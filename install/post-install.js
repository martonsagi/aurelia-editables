"use strict";

let fs = require('fs-extra'),
    path = require('path'),
    projectFolder = '../../aurelia_project';

// check if it is an aurelia-cli project
fs.exists(projectFolder, function (exists) {
    if (exists) {
        fs.readJson(projectFolder + '/aurelia.json', function (err, project) {
            if (err) {
                return console.log('Could not install aurelia.json', err);
            } else {
                // determinate transpiler to set correct file extension
                let filename = 'editables'+project.transpiler.fileExtension;

                fs.copy('./install/editables.js', projectFolder + '/tasks/'+filename, function (err) {
                    if (err) {
                        return console.log('Could not install '+filename, err);
                    } else {
                        fs.copy('./install/editables.json', projectFolder + '/tasks/editables.json', function (err) {
                            if (err) {
                                return console.log('Could not install editables.json', err);
                            } else {
                                return console.log(filename+' has been installed.');
                            }
                        });
                    }
                });
            }
        });
    }
});
