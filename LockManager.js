"use strict";
exports.__esModule = true;
exports.LockManager = void 0;
var LockManager = /** @class */ (function () {
    function LockManager() {
        LockManager.lockMap = new Map();
    }
    LockManager.prototype.lock = function (id) {
        if (!LockManager.lockMap.get(id)) {
            LockManager.lockMap.set(id, id);
            return true;
        }
        return false;
    };
    LockManager.prototype.unlock = function (id) {
        if (LockManager.lockMap.get(id)) {
            LockManager.lockMap["delete"](id);
            return true;
        }
        return false;
    };
    return LockManager;
}());
exports.LockManager = LockManager;
