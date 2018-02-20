'use strict';

var geoip = require('geoip-lite');

var ips = require('./ipSampleList.json');


// MAIN
if (require.main === module) {
    if (process.argv.length === 3) {
        let ipsJsonFile = process.argv[2];
        console.log('Getting ip list from json file: ' + ipsJsonFile);
        ips = require('./' + ipsJsonFile);  // requiring given file (default: ipSampleList.json)
    } else {
        console.log('Using sample (default) ips json file: ips.json');
    }
    printUniquePlaces(ips);
}


function printUniquePlaces(ips) {
    var uniquePlaces = getUniqueIpPlaces(ips);
    
    console.log('\n------\n');
    console.log('Places:');
    uniquePlaces.forEach((p) => { console.log(p); });

}

function OLD_printUniquePlaces(ips) {
    var geos = ips.map(function(ip) { return geoip.lookup(ip); });

    var countries = geos.map(function(geo) { return geo ? geo.country : ''; });

    var regions = geos.map(function(geo) { return geo ? geo.region : ''; });

    var places = geos.map(getGeoPlace);
    places.sort();

    // logging
    
    console.log('UNIQUE COUNTRIES:');
    (new Set(countries)).forEach((c) => { console.log(c) });

    console.log('\n-----\n');

    console.log('UNIQUE REGIONS:');
    (new Set(regions)).forEach((r) => { console.log(r); });

    console.log('\n------\n');
    console.log('Places:');
    (new Set(places)).forEach((p) => { console.log(p); });

}


function getUniqueIpPlaces(ips) {
    let places = ips.map(getIpPlace);
    places.sort();

    return new Set(places);
}


function getIpPlace(ip) {
    return getGeoPlace(geoip.lookup(ip));
}

function getGeoPlace(geo) {
    if (geo) {
        let city = String(geo.city);
        let region = String(geo.region);
        let country = String(geo.country);

        if (city.length > 0) {
            return country + ': ' + city + ', ' + region;
        } else if (region.length > 0) {
            return country + ': ' + region;
        } else {
            return country;
        }
    } else {
        return '****';
    }
}


module.exports = {
    printUniquePlaces,
    getUniqueIpPlaces,
    getGeoPlace,
    getIpPlace
}
