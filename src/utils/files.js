const Glob = require('glob');
const async = require('async');
const fs = require('fs');
const { mergeObjects } = require('./objects')


/**
 * Given the given matching glob pattern, load each file asynchronously and return
 * an array where each index contains the content of a file.
**/
exports.loadFiles = (glob, isToObj, withFileName, userCB) => {
  Glob(glob, {}, (err, mappingFileNames) => {
    // map each file name to its content
    async.map(mappingFileNames, (mappingFileName, cb) => {
      fs.readFile(mappingFileName, 'utf-8', (err, res) => {
        const value = isToObj == true ? JSON.parse(res) : res;
        cb(err, withFileName ? {name: mappingFileName, value: value} : value);
      });
    }, (err, result) => {
      userCB(err, result);
    })
  });
}

/**
 * Given the given matching glob pattern, load each file asynchronously and return a merged object
 * of all files content at once.
 **/
exports.loadFilesAndMerge = (glob, userCB) => {
  exports.loadFiles(glob, true, false, (err, allFiles) => {
    return mergeObjects(allFiles, userCB);
  });
}
