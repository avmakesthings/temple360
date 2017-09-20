/*
Compiles nested YAML assets to JSON
*/


var fs = require('fs'),
    path = require('path'),
    YAML = require('yamljs');


//Functions

function isFolder(filepath) {

    var stats = fs.lstatSync(filepath);
    if (stats.isDirectory()) {
        return true
        };
    return false;
}


//read Category
function readCategory(categoryPath, categoryName){
    var category = YAML.load(categoryPath+'/category.yaml');




    //Read projects
    var projectFolders = fs.readdirSync(categoryPath)

    //Read through everthing in projects folder
    var projects = []
    projectFolders.forEach(function readProjects(projectName) {

        var projectPath = categoryPath + '/' + projectName;

        if (isFolder(projectPath)){
            try{
                // return readAssets(filename + '/' + child);
                var project = readProject(projectPath);
                project.slug = projectName;
                project.category = categoryName;
                projects.push(project);                
            }
            catch(e){
                console.error('Failed to read Project ' + projectName)
            }

        }
    });


    category.projects = projects ;






    return category;
}


//read project
function readProject(projectPath){
    var project = YAML.load(projectPath+'/project.yaml');
    return project;
}



function readAssets(rootPath) {

    // Load yaml file using YAML.load & convert to JSON
    var assets = YAML.load(rootPath+'/main.yaml');

    //Read categories
    var categoryFolders = fs.readdirSync(rootPath + '/projects')

    //Read through everthing in projects folder
    var categories = []
    categoryFolders.forEach(function readCategories(categoryName) {

        var categoryPath = rootPath + '/projects/' + categoryName;

        if (isFolder(categoryPath)){
            // return readAssets(filename + '/' + child);
            var category = readCategory(categoryPath, categoryName);
            category.slug = categoryName;
            categories.push(category);
        }
    });


    assets.categories = categories ;

    return assets;
}

module.exports = readAssets;

// This runs when you execute this script from command line
if (module.parent == undefined) {
    // node readAssets.js ~/foo/bar
    var util = require('util');
    var filepath = process.argv[2]; //gets filepath from command line
    var json = readAssets(filepath);
    console.log(util.inspect(json, false, null));
}