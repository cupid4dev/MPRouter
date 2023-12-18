const { TIMER } = require("./../constants/values");
const { fetchEvent } = require("./events");
const { updateLeagues } = require("./leagues");
const { updateSports } = require("./sports");
const { updateUpcomings } = require("./upcomings");

const SPORTS_CATEGORIES = require("./../constants/values").MP_CONSTS.SPORTS;
const updatePopLeagues = require("./leagues").updatePopLeagues;

var sportsMenuList = [];

module.exports = {
    updateEventCategories: (ec) => {
        sportsMenuList = [];
        let popLeagues = [];

        for( let i=0; i<ec.length; i++) {
            if(ec[i].id == SPORTS_CATEGORIES.HISTORICAL){
                continue;
            }

            let leagues = [];

            for( let j=0; j<ec[i].eventGroup.length; j++) {
                const ev = ec[i].eventGroup[j];
                leagues.push({
                    id: ev.id,
                    title: ev.title,
                    displayPriority: ev.displayPriority,
                });
                if(ev.displayPriority == 1){
                    popLeagues.push({
                        id: ev.id,
                        title: ev.title,
                        sport: ec[i].id,
                    });
                }

                for( let k=0; k<ev.events.length; k++ ) {
                    fetchEvent(ev.events[k]);
                }
            }
            leagues.sort((a, b)=>{
                return a.displayPriority > b.displayPriority ? 1 : -1;
            });

            sportsMenuList.push({
                id: ec[i].id,
                displayPriority: ec[i].displayPriority,
                title: ec[i].title,
                leagues: leagues,
            })
        };

        sportsMenuList.sort( (a, b) => {
            return a.displayPriority > b.displayPriority ? 1 : -1;
        })
        updatePopLeagues(popLeagues);
        setTimeout(() => {updateUpcomings(ec)}, TIMER.BASIC_DELAY * 3);
        updateSports(ec);
    },

    getSportsMenuList: () => {
        return sportsMenuList;
    }
}