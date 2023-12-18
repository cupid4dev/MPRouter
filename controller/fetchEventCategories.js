const axios = require('axios');
const { TIMER, API_URLS } = require('./../constants/values');
const updateEventCategories = require('./../models/eventCategories').updateEventCategories;

const fetchEventCategories = () => {
    axios.get(API_URLS.BET_DEX_EVENTS).then(result => {
        if(result.status == 200){
            const ecData = result.data.eventCategories;
            updateEventCategories(ecData);
        }
    }).catch(e => {
        console.log("Catching event error!", e);
    })
}

module.exports = () => {
    fetchEventCategories();
    setInterval(() => {
        fetchEventCategories();
    }, TIMER.EVENT_CATEGORY);
}