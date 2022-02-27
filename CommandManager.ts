export interface Data {
    [key : string ]: string;
}

import { LockManager } from "./LockManager";

export class CommandManager
{
    commandService: any;
    commandQueue:any;
    data;
    lockManager;    
    constructor(commandService, commandQueue, data)
    {
        this.commandService = commandService;    
        this.commandQueue = commandQueue;
        this.data  = data;
        this.lockManager = new LockManager(); 
    }

    do(command, data, dataId)
    {
       
      let commandsResult = [];
      let commandQueue = this.commandQueue.getCommandQueue();
            while(commandQueue.hasCommands())
            {
                let {command, data, id } = commandQueue.dequeue();
                let result = this.commandService.issue(command,data, id);
                commandsResult.push({"command": command, "status": result.status, "data": result.data});
            }  

            if(!!data)
            {
                let result =   this.commandService.issue(command, data, dataId);
                commandsResult.push({"command": command, "status": result.status, "data": result.data});
                return commandsResult;
            }
                
       console.log(this.data[dataId-1],!!this.data[dataId-1])
        if(!!this.data[dataId-1])
        {
            let data = this.data[dataId-1];
            let isLocked = this.lockManager.lock(dataId);
            if(isLocked)
            {
                let result =  this.commandService.issue(command,data,dataId);
                commandsResult.push({"command": command, "status": result.status, "data": result.data});
                this.lockManager.unlock(dataId);
                
            } else {             //already locked
                
                this.commandQueue.enqueue(command,data,dataId); 
            }
        } else {                 // No data found. May be insert. Check for that
            
                console.log("No Data Found");
                commandsResult.push({"command": command, "status": "Did not execute", "data": "No Data Found"});
            }

        return commandsResult;    
    }

}