"use strict";
exports.__esModule = true;
exports.CommandManager = void 0;
var LockManager_1 = require("./LockManager");
var CommandManager = /** @class */ (function () {
    function CommandManager(commandService, commandQueue, data) {
        this.commandService = commandService;
        this.commandQueue = commandQueue;
        this.data = data;
        this.lockManager = new LockManager_1.LockManager();
    }
    CommandManager.prototype["do"] = function (command, data, dataId) {
        var commandsResult = [];
        var commandQueue = this.commandQueue.getCommandQueue();
        while (commandQueue.hasCommands()) {
            var _a = commandQueue.dequeue(), command_1 = _a.command, data_1 = _a.data, id = _a.id;
            var result = this.commandService.issue(command_1, data_1, id);
            commandsResult.push({ "command": command_1, "status": result.status, "data": result.data });
        }
        if (!!data) {
            var result = this.commandService.issue(command, data, dataId);
            commandsResult.push({ "command": command, "status": result.status, "data": result.data });
            return commandsResult;
        }
        console.log(this.data[dataId - 1], !!this.data[dataId - 1]);
        if (!!this.data[dataId - 1]) {
            var data_2 = this.data[dataId - 1];
            var isLocked = this.lockManager.lock(dataId);
            if (isLocked) {
                var result = this.commandService.issue(command, data_2, dataId);
                commandsResult.push({ "command": command, "status": result.status, "data": result.data });
                this.lockManager.unlock(dataId);
            }
            else { //already locked
                this.commandQueue.enqueue(command, data_2, dataId);
            }
        }
        else { // No data found. May be insert. Check for that
            console.log("No Data Found");
            commandsResult.push({ "command": command, "status": "Did not execute", "data": "No Data Found" });
        }
        return commandsResult;
    };
    return CommandManager;
}());
exports.CommandManager = CommandManager;
