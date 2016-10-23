/**
 * Mini cli helper for aurelia-editables plugin
 * - Configures bundle correctly
 * - Generates datagrid/form configuration (not implemented yet)
 *
 * It's pure ES6 to support Babel/Typescript aurelia-cli projects as well
 * Uses an empty gulp task to execute below logic within aurelia-cli's infrastructure
 *
 * Usage:
 * au editables [--bundle <custom-bundle-filename>] [--force]
 */

import * as fs from 'fs-extra';
import * as project from '../aurelia.json';
import * as deps from '../../node_modules/aurelia-editables/install/dependencies.json';
import {CLIOptions} from 'aurelia-cli';

/**
 * Simple wrapper for built-in CLIOptions
 *
 * @param name
 * @param shortcut
 * @returns {any|null}
 */
let getParam = function (name, shortcut) {
    if (CLIOptions.hasFlag(name, shortcut)) {
        return CLIOptions.getFlagValue(name, shortcut) || null;
    }
};

/**
 * Gets all given options in a single array
 *
 * @return object
 */
let getOptions = function () {
    let options = {};
    options.bundle = getParam('bundle', 'b');
    options.generate = getParam('generate', 'g');
    options.force = CLIOptions.hasFlag('force', 'f');

    return options;
};

let cliParams = getOptions();

/**
 * Configure | default action
 * Edit aurelia.json to add preconfigured dependencies for aurelia-editables package
 *
 * @void
 */
let configure = function () {
    let bundle = null,
        bundles = project.build.bundles;

    if (bundles.length === 0) {
        throw new Error("aurelia.json: bundles section is missing.");
    }

    let bundleName = cliParams.bundle || 'vendor-bundle.js';

    bundle = bundles.find(item => item.name === bundleName);

    if (!bundle) {
        console.log(`[INFO] Bundle '${bundleName}' could not be found. Looking for default bundles...`);

        // There are 2 sections by default, second is usually the vendor-bundle.js
        // Although, some developers prefer to merge everything into a single bundle
        let index = bundles.length > 1 ? 1 : 0;
        bundle = bundles[index];

        // this should not be reached ever, but never say never :)
        if (!bundle) {
            throw new Error('Default bundle could not be found either. Check aurelia.json configuration.');
        }

        bundleName = bundle.name;
    }

    console.log(`[INFO] Bundle found: ${bundle.name}. Configuring new dependencies in aurelia.json for ${bundleName}...`);
    for (let dep of deps) {
        let name = dep.name || dep,
            check = bundle.dependencies.find(item => (item.name || item) === name);

        if (!check) {
            console.log(`[NEW] Package '${name}' has been configured.`);
            bundle.dependencies.push(dep);
        } else {
            if (cliParams.force) {
                let i = bundle.dependencies.indexOf(check);
                bundle.dependencies[i] = dep;
                console.log(`[MOD] Package '${name}' has been configured.`);
            } else {
                console.log(`[SKIP] Package '${name}' has already been configured.`);
            }
        }
    }

    console.log('[INFO] Saving changes to aurelia.json file...');
    let aureliaProjectFile = 'aurelia_project/aurelia.json';

    fs.copy(aureliaProjectFile, aureliaProjectFile+'.bak', function (err) {
        if (err) {
            console.log('[ERROR] An error occurred while duplicating aurelia.json.', err);
        } else {
            console.log('[INFO] Backup of aurelia.json has been created.');
            fs.writeJson(aureliaProjectFile, project, (err) => {
                if (err) {
                    console.log('[ERROR] An error occurred while updating aurelia.json.', err);
                } else {
                    console.log('[OK] aurelia.json has been updated.');
                    console.log(`\n\n[OK] aurelia-editables has been configured successfully.`);
                }
            });
        }
    });
}

/**
 * Generate | generate datagrid json configuration files quickly
 *
 * @todo implemetation
 * @void
 */
let generate = function (options) {
    throw new Error("Generate command is not implemented yet.");
};

/**
 * Execute
 */
try {
    if (cliParams.generate) {
        generate(cliParams.generate);
    } else {
        configure();
    }
} catch (e) {
    console.log(e);
}

export default () => {};
