const _ = require('underscore');

module.exports.config = {
    dashboardEndpoint: "/dashboard"
};

module.exports.calculateStats = function (visitorsData) {
    return {
        pages: calculatePageCounts(visitorsData),
        referrers: calculateRefererCount(visitorsData),
        activeUsers: getActiveUsers(visitorsData)
    };
};

function calculatePageCounts(visitorsData) {
    // sample data in pageCounts object:
    // { url: "/",count: 13, url: "/about", count: 5 }
    var pageCountArray = [];
    for (var key in visitorsData) {
        if (visitorsData.hasOwnProperty(key)) {
            var page = visitorsData[key].page;
            var found = _.findWhere(pageCountArray, {url: page});
            if (found) {
                pageCountArray[page].count++;
            } else {
                pageCountArray.push({url: page, count: 0});
            }
        }
    }
    return pageCountArray;
}

function calculateRefererCount(visitorsData) {
    // sample data in referrerCounts object:
    // { ref: "http://twitter.com/",count : 3, ref: "http://stackoverflow.com/",count: 6 }
    var refererArray = [];
    for (var key in visitorsData) {
        if (visitorsData.hasOwnProperty(key)) {
            var referringSite = visitorsData[key].referringSite || '(direct)';
            var found = _.findWhere(refererArray, {ref: referringSite});
            if (found) {
                refererArray[referringSite].count++;
            } else {
                refererArray.push({ref: referringSite, count: 0});
            }
        }
    }
    return refererArray;
}

function getActiveUsers(visitorsData) {
    return Object.keys(visitorsData).length;
}