"use strict";

let fs = require('fs-extra'),
    path = require('path'),
    projectFolder = '../../aurelia_project';

// check if it is an aurelia-cli project
fs.exists(projectFolder, function (exists) {
    if (exists) {
        fs.copy('./install/editables.ts', projectFolder+'/tasks/editables.ts', function (err) {
            if (err) {
                console.log('Could not install editables.ts.', err);
            } else {
                console.log('editables.ts has been installed.');
            }
        });
    }
});
