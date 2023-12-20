const express = require('express');
const router = express.Router();

const { getPopLeagues, getLeague } = require('./../models/leagues');
const { getSportsMenuList } = require('../models/eventCategories');
const { getUpcomings } = require('../models/upcomings');
const { getSport } = require('../models/sports');
const { getEvent, checkOneEvent } = require('../models/events');
const { checkOneMarket } = require('../models/markets');

router.get('/menulist', (req, res) => {
    res.json({
        popLeagues: getPopLeagues(),
        sports: getSportsMenuList(),
    });
});

router.get('/upcomings', (req, res) => {
    res.json({
        upcomings: getUpcomings(),
    })
})

router.get('/sport', (req, res) => {
    res.json({
        sport: getSport(req.query.id),
    })
})

router.get('/league', (req, res) => {
    res.json({
        league: getLeague(req.query.id),
    })
})

router.get('/event', (req, res) => {
    res.json({
        event: getEvent(req.query.id),
    })
})

router.get('/ordered', async (req, res) => {
    const { marketAccount, eventAccount } = req.query;
    await checkOneMarket(marketAccount);
    await checkOneEvent(eventAccount);
    res.json({ event: getEvent(eventAccount) })
})

module.exports = router;