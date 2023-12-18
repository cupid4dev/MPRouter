const { getEvent } = require("./events");
const { updateLeague } = require("./leagues");

var sports = {};

module.exports = {
    updateSports: ( ec ) => {
        sports = {};

        for( let i=0;i<ec.length;i++) {
            sports[ec[i].id] = {
                id: ec[i].id,
                title: ec[i].title,
                matches: [],
                competitions: [],
            }

            for( let j=0; j<ec[i].eventGroup.length; j++ ){
                sports[ec[i].id].competitions.push({
                    id: ec[i].eventGroup[j].id,
                    title: ec[i].eventGroup[j].title,
                });

                sports[ec[i].id].matches.push({
                    id: ec[i].eventGroup[j].id,
                    title: ec[i].eventGroup[j].title,
                    games: [],
                });

                for( let k=0; k<ec[i].eventGroup[j].events.length; k++ ){
                    sports[ec[i].id].matches[j].games.push(
                        getEvent(ec[i].eventGroup[j].events[k].eventAccount)
                    );
                }

                updateLeague( sports[ec[i].id].matches[j], ec[i].id );
            }
        }
    },
    getSport: ( id ) => {
        return sports[id];
    }
}