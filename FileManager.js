"use strict";
exports.__esModule = true;
exports.FileManager = void 0;
var fs = require('fs');
var FileManager = /** @class */ (function () {
    function FileManager() {
        //read file into an array
        this.data = JSON.parse(fs.readFileSync('Data/data.json', { "encoding": "utf8" }));
        console.log(typeof this.data, this.data[2]);
        return this.data;
    }
    FileManager.prototype.getIndexedData = function () {
        return true;
    };
    FileManager.prototype.fetch = function (data) {
        return "fetched data";
    };
    FileManager.prototype.insert = function (data) {
        return "inserted data";
    };
    FileManager.prototype["delete"] = function (data) {
        return "deleted data";
    };
    FileManager.prototype.update = function (data) {
        return "updated data";
    };
    FileManager.prototype.crash = function () {
        return "crashed the engine";
    };
    return FileManager;
}());
exports.FileManager = FileManager;
