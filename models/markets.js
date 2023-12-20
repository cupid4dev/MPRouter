const { getAllMarketMatchingPools } = require("@monaco-protocol/client");
const { PublicKey } = require("@solana/web3.js");
const { getProgram } = require("../controller/program");
const { MP_CONSTS } = require("../constants/values");

var markets = {};

const checkOne = async (pk) => {
    const market = markets[pk];

    if (new Date().getTime() - market.lastUpdated >= 48 * 60 * 60 * 1000) {
        delete markets[pk];
        return;
    }

    const mpResult = (await getAllMarketMatchingPools(getProgram(), new PublicKey(market.marketAccount)));
    if (!mpResult.success) {
        return;
    }

    const matchingPools = mpResult.data.marketMatchingPoolsWithSeeds;

    let mp = [];
    for (let i = 0; i < market.outcomes.length; i++) {
        mp.push({
            totalLiquidity: 0,
            totalMatched: 0,
            minFor: -1,
            minForLiquidity: 0,
            maxAgainst: -1,
            maxAgainstLiquidity: 0,
            maxLiquidity: 0,
            listFor: [],
            listAgainst: [],
            matchedPrices: [],
            listForShow: [
                { price: 0, liquidityAmount: 0, },
                { price: 0, liquidityAmount: 0, },
                { price: 0, liquidityAmount: 0, },
            ],
            listAgainstShow: [
                { price: 0, liquidityAmount: 0, },
                { price: 0, liquidityAmount: 0, },
                { price: 0, liquidityAmount: 0, },
            ],
        });
    }

    let inplay = false;
    for (let i = 0; i < matchingPools.length; i++) {
        const marketMatchingPool = matchingPools[i].account.marketMatchingPool;
        const marketOutcomeIndex = marketMatchingPool.marketOutcomeIndex;
        const forOutcome = marketMatchingPool.forOutcome;
        mp[marketOutcomeIndex].totalLiquidity += (marketMatchingPool.liquidityAmount.toNumber() / MP_CONSTS.DEFAULT_LIQUIDITY_DEXIMAL);
        mp[marketOutcomeIndex].totalMatched += (marketMatchingPool.matchedAmount.toNumber() / MP_CONSTS.DEFAULT_LIQUIDITY_DEXIMAL) / 2;

        if (forOutcome) {
            if ((mp[marketOutcomeIndex].minFor == -1 || mp[marketOutcomeIndex].minFor > marketMatchingPool.price) && marketMatchingPool.liquidityAmount.toNumber() > 0) {
                mp[marketOutcomeIndex].minFor = marketMatchingPool.price;
                mp[marketOutcomeIndex].minForLiquidity = marketMatchingPool.liquidityAmount.toNumber() / MP_CONSTS.DEFAULT_LIQUIDITY_DEXIMAL;
            }
            mp[marketOutcomeIndex].listFor.push({
                price: marketMatchingPool.price,
                liquidityAmount: (marketMatchingPool.liquidityAmount.toNumber() / MP_CONSTS.DEFAULT_LIQUIDITY_DEXIMAL),
                matchedAmount: (marketMatchingPool.matchedAmount.toNumber() / MP_CONSTS.DEFAULT_LIQUIDITY_DEXIMAL),
                inplay: marketMatchingPool.inplay
            });
        } else {
            if ((mp[marketOutcomeIndex].maxAgainst == -1 || mp[marketOutcomeIndex].maxAgainst < marketMatchingPool.price) && marketMatchingPool.liquidityAmount.toNumber() > 0) {
                mp[marketOutcomeIndex].maxAgainst = marketMatchingPool.price;
                mp[marketOutcomeIndex].maxAgainstLiquidity = marketMatchingPool.liquidityAmount.toNumber() / MP_CONSTS.DEFAULT_LIQUIDITY_DEXIMAL;
            }
            mp[marketOutcomeIndex].listAgainst.push({
                price: marketMatchingPool.price,
                liquidityAmount: (marketMatchingPool.liquidityAmount.toNumber() / MP_CONSTS.DEFAULT_LIQUIDITY_DEXIMAL),
                matchedAmount: (marketMatchingPool.matchedAmount.toNumber() / MP_CONSTS.DEFAULT_LIQUIDITY_DEXIMAL),
                inplay: marketMatchingPool.inplay
            });
        }

        if (marketMatchingPool.liquidityAmount.toNumber() / MP_CONSTS.DEFAULT_LIQUIDITY_DEXIMAL > mp[marketOutcomeIndex].maxLiquidity) {
            mp[marketOutcomeIndex].maxLiquidity = marketMatchingPool.liquidityAmount.toNumber() / MP_CONSTS.DEFAULT_LIQUIDITY_DEXIMAL;
        }

        if (marketMatchingPool.inplay) {
            inplay = true;
        }

        if (marketMatchingPool.matchedAmount.toNumber() > 0) {
            mp[marketOutcomeIndex].matchedPrices.push(marketMatchingPool.price);
        }
    }

    let totalLiquidity = 0, totalMatched = 0;
    for (let i = 0; i < mp.length; i++) {
        mp[i].listFor.sort((a, b) => {
            return a.price < b.price ? 1 : -1;
        });

        mp[i].listAgainst.sort((a, b) => {
            return a.price < b.price ? 1 : -1;
        });

        let lFIndex = 0, lAIndex = 2;
        for (let j = mp[i].listFor.length - 1; j >= 0; j--) {
            if (mp[i].listFor[j].liquidityAmount > 0) {
                mp[i].listForShow[lFIndex++] = mp[i].listFor[j];
            }
            if (lFIndex > 2) {
                break;
            }
        }
        for (let j = 0; j < mp[i].listAgainst.length; j++) {
            if (mp[i].listAgainst[j].liquidityAmount > 0) {
                mp[i].listAgainstShow[lAIndex--] = mp[i].listAgainst[j];
            }
            if (lAIndex < 0) {
                break;
            }
        }

        mp[i].matchedPrices = [...new Set(mp[i].matchedPrices)];
        totalLiquidity += mp[i].totalLiquidity;
        totalMatched += mp[i].totalMatched;
    }


    markets[pk].mp = mp;
    markets[pk].inplay = inplay;
    markets[pk].totalLiquidity = totalLiquidity;
    markets[pk].totalMatched = totalMatched;
    markets[pk].lastUpdated = new Date().getTime();
}

module.exports = {
    fetchMarket: (market) => {
        if (markets[market.marketAccount] == undefined) {
            markets[market.marketAccount] = {
                marketAccount: market.marketAccount,
                marketName: market.marketName,
                outcomes: market.outcomes,
                lastUpdated: new Date().getTime(),
            };
        } else {
            markets[market.marketAccount].lastUpdated = new Date().getTime();
        }
    },

    getMarket: (pk) => markets[pk],

    checkMarkets: () => {
        console.log("Market Data Fetching...!");
        Object.keys(markets).forEach(async pk => {
            checkOne(pk);
        });
    },

    checkOneMarket: checkOne,
}