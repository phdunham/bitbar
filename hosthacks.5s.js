#!/usr/local/bin/node

/*
# <bitbar.title>HostHacks</bitbar.title>
# <bitbar.version>v1.0.0</bitbar.version>
# <bitbar.author>pdunham</bitbar.author>
# <bitbar.author.github>phdunham</bitbar.author.github>
# <bitbar.desc>Check for /etc/hosts hacks</bitbar.desc>
# <bitbar.dependencies>node</bitbar.dependencies>
*/

// Get /etc/hosts
let hostFile = require('fs').readFileSync('/etc/hosts').toString().split('\n');

let hosts = {};
hostFile.forEach(function (line) {
    // remove all blank and commented out lines
    let entry = line.replace(/\s*#.*$/, '').replace(/^\s+/, '');
    if (!entry.length) {
        return;
    }

    // Colapse multiple spaces and tabs to a single space for easier parsing.
    entry = entry.replace(/\s+/g, ' ');
    let hack = entry.split(' ');
    let ip = hack.shift();

    // Ignore localhost and broadcast
    if (['127.0.0.1', '255.255.255.255', '::1'].indexOf(ip) >= 0) {
        return;
    }

    // Ignore my local network
    if (ip.indexOf('10.1') === 0) {
        return;
    }

    // Create map of host => IP
    hack.forEach(function (hostname) {
        hosts[hostname] = ip;
    });
});

// Report on host hacks
let names = Object.keys(hosts);
if (names.length > 0) {
    console.log('HOST HACKS! | color=red');
    names.forEach(function(host) {
        console.log(`${host} => ${hosts[host]} | color=gray`);

    });
} else {
    console.log('Hosts ok');
}
