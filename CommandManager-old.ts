export interface Data {
    [key : string ]: string;
}

export class CommandManager
{
    commandService: any;
    lockManager:any;
    commandQueue:any;
    storageManager:any;
    constructor(commandService, lockManager,commandQueue,storageManager)
    {
        this.commandService = commandService;    
        this.lockManager = lockManager;
        this.commandQueue = commandQueue;
        this.storageManager = storageManager;
    }

    do(command, data=null, dataId=null)
    {
      let dataFound;let commandsResult = [];
      let commandQueue = this.commandQueue.getcommandQueue();
            while(commandQueue.hasCommands())
            {
                let command = commandQueue.dequeue().command;
                let dataId = commandQueue.dequeue().dataId;
                let data = this.storageManager.getIndexedData(dataId);
                let result = this.commandService.issue(command,data);
                commandsResult.push({"command": command, "status": result.status, "data": result.data});
            }  

            if(data)
            {
                let result =   this.commandService.issue(command, data);
                commandsResult.push({"command": command, "status": result.status, "data": result.data});
                return commandsResult;
            }
                
        dataFound = this.storageManager.hasIndexedData(dataId);
        if(dataFound)
        {
            let data = this.storageManager.getIndexedData(dataId);
            let isLocked = this.lockManager.lock(dataId, data);
            if(isLocked)
            {
                let result =  this.commandService.issue(command,data);
                commandsResult.push({"command": command, "status": result.status, "data": result.data});
                this.lockManager.unlock(dataId, data);
                
            } else {             //already locked
                
                this.commandQueue.enqueue(command,dataId); 
            }
        } else {                 // No data found. May be insert. Check for that
            
                console.log("No Data Found");
                commandsResult.push({"command": command, "status": "Did not execute", "data": "No Data Found"});
            }

        return commandsResult;    
    }

}