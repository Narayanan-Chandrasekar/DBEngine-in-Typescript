"use strict";
exports.__esModule = true;
exports.CommandService = void 0;
var fs = require('fs');
var CommandService = /** @class */ (function () {
    function CommandService(data) {
        this.data = data;
    }
    CommandService.prototype.issue = function (command, data, dataId) {
        var result;
        switch (command) {
            case 'fetch':
                result = this.fetch(dataId);
                break;
            case 'insert':
                result = this.insert(data, dataId);
                break;
            case 'update':
                result = this.update(data, dataId);
                break;
            case 'delete':
                result = this["delete"](data);
                break;
            case 'crash':
                result = this.crash();
                break;
            case 'transaction':
                result = this.transaction(data);
                break;
            default:
                result = { status: "Unknown command", data: data };
                console.log(result);
        }
        return result;
    };
    CommandService.prototype.fetch = function (dataId) {
        console.log(dataId, "DataID");
        var result;
        var fetchedData = this.data[dataId - 1].data;
        if (fetchedData) {
            result = { status: "Data Fetched", "data": JSON.stringify(fetchedData) };
        }
        else {
            console.log("No data found");
            result = { status: "Fetch Failed", "data": "No Data Found" };
        }
        console.log(fetchedData);
        return result;
    };
    CommandService.prototype.insert = function (data, dataId) {
        var result, datum, maxId = 0;
        this.data[dataId - 1] = data;
        if (!!this.data[dataId - 1]) {
            result = { status: "Data Inserted", "data": JSON.stringify(this.data) };
        }
        else {
            console.log("Insert failed");
            result = { status: "Insert Failed", "data": JSON.stringify(this.data) };
        }
        fs.writeFileSync("./Data/data.json", JSON.stringify(this.data));
        return result;
    };
    CommandService.prototype.update = function (data, dataId) {
        var result;
        this.data[dataId - 1] = data;
        if (!!this.data[dataId - 1]) {
            result = { status: "Data Updated", "data": JSON.stringify(this.data) };
        }
        else {
            console.log("Update failed");
            result = { status: "Update Failed", "data": JSON.stringify(this.data) };
        }
        fs.writeFileSync("./Data/data.json", JSON.stringify(this.data));
        return result;
    };
    CommandService.prototype["delete"] = function (data) {
        var result;
        this.data = data;
        if (this.data == "*") {
            result = { status: "Data Deleted", "data": JSON.stringify(this.data) };
        }
        else {
            console.log("Delete failed");
            result = { status: "Delete Failed", "data": JSON.stringify(this.data) };
        }
        fs.writeFileSync("./Data/data.json", JSON.stringify(this.data));
        return result;
    };
    //Not supported for now
    CommandService.prototype.transaction = function (data) {
        var result;
        var changedData = this.data.transact(data);
        if (!!changedData) {
            result = { status: "Transaction completed", "data": Buffer.from(changedData, "utf-8") };
        }
        else {
            console.log("Transaction failed");
            result = { status: "Transaction Failed", "data": data };
        }
        return result;
    };
    //not supported for now
    CommandService.prototype.crash = function () {
        /*let result;
        if(!this.storageManager.hasTransactionIds())
        {
            result = {"status": "No Transaction in progress","data": "Safe"}
        }
        let transactionIds = this.storageManager.getTransactionIds();
        let undoResult = this.undoLogManager.undo(transactionIds);
        result = {"status": `${transactionIds} . These transactions are rolled back`,"data": undoResult}
        return result;
        */
    };
    return CommandService;
}());
exports.CommandService = CommandService;
