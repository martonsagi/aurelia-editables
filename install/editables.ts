import * as fs from 'fs-extra';
import * as project from '../aurelia.json';
import * as deps from '../../node_modules/aurelia-editables/install/aurelia-editables.deps.json';
import {CLIOptions} from 'aurelia-cli';

// mini cli library

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

    let bundleName = getParam('bundle', 'b') || 'vendor-bundle.js';

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
            console.log(`[SKIP] Package '${name}' has already been configured.`);
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
 * @void
 */
let generate = function (options) {
    throw new Error("Generate command is not implemented yet.");
};


// execute mini cli
let generateParam = getParam('generate', 'g');

try {
    if (generateParam) {
        generate(generateParam);
    } else {
        configure();
    }
} catch (e) {
    console.log(e);
}

// an empty gulp task is required to insert our logic into CLI workflow
export default () => {};
