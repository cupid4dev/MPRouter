
const { fetchMarket, getMarket } = require("./markets");

var events = {};

const checkOne = (pk) => {
    if(events[pk].eventStart * 1000 + 48 * 60 * 60 * 1000 < new Date().getTime() ){
        delete events[pk];
        return;
    }

    let totalLiquidity = 0, totalMatched = 0;
    events[pk].marketsWithMP = [];
    for(let i=0;i<events[pk].markets.length;i++){
        const market = getMarket(events[pk].markets[i].marketAccount);
        totalLiquidity += market.totalLiquidity;
        totalMatched += market.totalMatched;
        events[pk].marketsWithMP.push({
            ...market,
            displayPriority: events[pk].markets[i].displayPriority,
        });
    }

    events[pk].totalLiquidity = totalLiquidity;
    events[pk].totalMatched = totalMatched;
    events[pk].marketsWithMP.sort((a, b) => {
        return a.displayPriority > b.displayPriority ? 1 : -1;
    })
}

module.exports = {
    fetchEvent: ( ev ) => {
        let markets = [];

        for( let i=0; i<ev.markets.length; i++ ){
            markets.push({
                marketAccount: ev.markets[i].marketAccount,
                displayPriority: ev.markets[i].displayPriority,
            });

            fetchMarket(ev.markets[i]);
        }

        if(events[ev.eventAccount] == undefined){
            events[ev.eventAccount] = {
                eventAccount: ev.eventAccount,
                eventName: ev.eventName,
                participants: ev.participants,
                eventStart: ev.eventStart,
                category: ev.category,
                eventGroup: ev.eventGroup,
                eventGroupTitle: ev.eventGroupTitle,
                markets: markets,
            }
        } else {
            events[ev.eventAccount] = {
                ...events[ev.eventAccount],
                eventAccount: ev.eventAccount,
                eventName: ev.eventName,
                participants: ev.participants,
                eventStart: ev.eventStart,
                category: ev.category,
                eventGroup: ev.eventGroup,
                eventGroupTitle: ev.eventGroupTitle,
                markets: markets,
            }
        }
    },

    getEvent: (pk) => {
        return events[pk];
    },

    getEvents: () => {
        return events;
    },

    checkEvents: () => {
        console.log("Event Data Fetching...!");
        Object.keys(events).forEach(async pk => {
           checkOne(pk);
        });
    },

    checkOneEvent: checkOne,
}