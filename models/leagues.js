const { ts2LWDDLMYYYY } = require("../utils/timestamp");

var popLeagues = [];
var leagues = {};

module.exports = {
    updatePopLeagues: (pl) => {
        popLeagues = pl;
    },

    updateLeague: (league, sportId) => {
        leagues[league.id] = {
            ...league,
            sportId: sportId
        };

        leagues[league.id].games.sort((a, b) => {
            return a.eventStart > b.eventStart ? 1 : -1;
        });

        leagues[league.id].games.forEach((item, index) => {
            // Create a new object with the existing properties of `item`
            const newItem = { ...item };

            // Add the new property `fDate` to the new object
            if(!item){
                return;
            }
            newItem.fDate = ts2LWDDLMYYYY(item.eventStart);

            // Replace the old item with the new one in the array
            leagues[league.id].games[index] = newItem;
        });

        const groupedItems = leagues[league.id].games.reduce((acc, item) => {
            if(!item){
                return;
            }
            const { fDate, ...rest } = item;
          
            if (!acc[fDate]) {
              acc[fDate] = [rest];
            } else {
              acc[fDate].push(rest);
            }
          
            return acc;
          }, {});

        leagues[league.id] = {
            title: leagues[league.id].title,
            id: leagues[league.id].id,
            events: groupedItems,
            sportId: sportId
        };
    },

    getPopLeagues: () => {
        return popLeagues;
    },

    getLeague: (id) => {
        return leagues[id];
    }
}