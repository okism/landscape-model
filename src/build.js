const merge = require('./merge-all');

let model = merge.model();

/**
 * Check connections
 */
let component_ids = model['components'].map((component) => { return component['id']; });
let missingConnections = model['components'].reduce((a, component) => {
    let conns = component['connections'];
    if (conns !== undefined) {
        conns.forEach(c => {
            if (!component_ids.includes(c)) {
                a.push(c + ' in ' + component['name']);
            }
        });
        return a;
    } else {
        return a;
    }
}, []);


if (missingConnections.length > 0) {
    console.error('WARNING: There are unmatched connections components: ', missingConnections);
}


/**
 * Check licenses
 */
let missingLicenseLinks = model['components'].reduce((a, component) => {
    let licenses = component['license'];
    if (licenses !== undefined) {
        licenses.forEach(licenseName => {
            if (model['licenses'][licenseName] === undefined) {
                a.push(licenseName + ' in ' + component['name']);
            }
        });
        return a;
    } else {
        return a;
    }
}, []);

let componentsWithoutLicenses = model['components'].filter(c => c['license'] === undefined).map(c => c.id);


if (missingLicenseLinks.length > 0) {
    console.error('WARNING: There are licenses with missing links: ', missingLicenseLinks);
}

if (componentsWithoutLicenses.length > 0) {
    console.error('WARNING: The following components are missing license information: ', componentsWithoutLicenses);
}

/**
 * Merge model
 */
merge.modelAndFlush();