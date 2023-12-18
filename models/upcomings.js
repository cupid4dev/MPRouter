const { ts2DateOptions } = require("../utils/timestamp");
const { getEvent, getEvents } = require("./events");

var upcomings = [];

module.exports = {
    updateUpcomings: (eventCategories) => {
        console.log("Upcoming Data Fetching...!");
        upcomings = [];

        eventCategories.forEach((eventCategory) => {
            if (eventCategory.id == "HISTORICAL") {
                return;
            }

            let upcomingS = {
                id: eventCategory.id,
                title: eventCategory.title,
                games: new Array(),
                upcomingDate: 0,
            };

            eventCategory.eventGroup.forEach((eg) => {
                let games = [...eg.events.slice(0)];
                games.sort((a, b) => {
                    return a.eventStart > b.eventStart ? 1 : -1;
                });

                if (upcomingS.upcomingDate == 0) {
                    upcomingS.upcomingDate = games[0].eventStart;
                }
                let startDate = "";
                for (let i = 0; i < games.length; i++) {
                    if (games[i].eventStart * 1000 < new Date().getTime()) {
                        continue;
                    }
                    if (startDate == "") {
                        startDate = ts2DateOptions(games[i].eventStart);
                    }
                    if (ts2DateOptions(games[i].eventStart) != startDate) {
                        break;
                    }
                    upcomingS.games.push(getEvent(games[i].eventAccount));
                }
            });

            upcomingS.games.sort((a, b) => {
                return a.eventStart > b.eventStart ? 1 : -1;
            });

            upcomingS.games = upcomingS.games.filter((a) => {
                return (
                    ts2DateOptions(a.eventStart) ==
                    ts2DateOptions(upcomingS.games[0].eventStart)
                );
            });

            upcomings.push(upcomingS);
        });
    },

    getUpcomings: () => {
        return upcomings;
    }
}