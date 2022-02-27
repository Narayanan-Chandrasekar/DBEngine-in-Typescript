"use strict";
exports.__esModule = true;
exports.CommandQueue = void 0;
var CommandQueue = /** @class */ (function () {
    function CommandQueue() {
        this.head = 0;
        this.tail = 0;
        this.length = 100;
        this.queue = new Array();
    }
    CommandQueue.prototype.enqueue = function (command, data, dataId) {
        if (this.head === this.tail + 1) {
            return false;
        }
        this.queue[this.tail] = { "command": command, "data": data, "id": dataId };
        if (this.tail === this.length) {
            this.tail = 0;
        }
        else {
            this.tail++;
        }
    };
    CommandQueue.prototype.dequeue = function () {
        if (this.head === this.tail) {
            return false;
        }
        var command = this.queue[this.head].command;
        var data = this.queue[this.head].data;
        var dataId = this.queue[this.head].dataId;
        if (this.head === this.length) {
            this.head = 0;
        }
        else {
            this.head = this.head + 1;
        }
        return { "command": command, "data": data, "id": dataId };
    };
    CommandQueue.prototype.getCommandQueue = function () {
        return this;
    };
    CommandQueue.prototype.hasCommands = function () {
        return this.head !== this.tail;
    };
    return CommandQueue;
}());
exports.CommandQueue = CommandQueue;
