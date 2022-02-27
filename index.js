"use strict";
exports.__esModule = true;
var CommandManager_1 = require("./CommandManager");
var CommandQueue_1 = require("./CommandQueue");
var CommandService_1 = require("./CommandService");
var FileManager_1 = require("./FileManager");
var data = new FileManager_1.FileManager();
var commandService = new CommandService_1.CommandService(data);
var commandQueue = new CommandQueue_1.CommandQueue();
var commandManager = new CommandManager_1.CommandManager(commandService, commandQueue, data);
var promise1 = Promise.resolve(commandManager["do"]('fetch', data, 4));
var promise3 = Promise.resolve(commandManager["do"]('insert', { "data": [1, 6, 7] }, 4));
var promise2 = Promise.resolve(commandManager["do"]('update', { "data": [2, 5, 9] }, 4));
var promise4 = Promise.resolve(commandManager["do"]('update', { "data": [2, 5, 99] }, 4));
var promise5 = Promise.resolve(commandManager["do"]('update', { "data": [2, 5, 999] }, 4));
var promise6 = Promise.resolve(commandManager["do"]('update', { "data": [2, 5, 9999] }, 4));
var promise7 = Promise.resolve(commandManager["do"]('update', { "data": [2, 5, 99999] }, 4));
var promise8 = Promise.resolve(commandManager["do"]('update', { "data": [2, 5, 999999] }, 4));
//const promise4 = Promise.resolve(commandManager.do('delete',"*",""));
Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8]).then(function (values) {
    console.log(values);
});
// expected output: Array [3, 42, "foo"]
