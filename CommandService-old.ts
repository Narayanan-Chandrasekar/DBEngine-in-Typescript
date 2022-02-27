export class CommandService
{
    storageManager;undoLogManager;
    constructor(storageManager, undoLogManager)
    {
        this.storageManager = storageManager;
        this.undoLogManager = undoLogManager;
    }

    issue(command, data, dataId= null)
    {
        let result;
        switch(command)
        {
            case 'fetch':
            result = this.fetch(dataId);
            break;
            case 'insert':
            result = this.insert(data);
            break;
            case 'update':
            result = this.update(data);
            break;
            case 'delete':
            result = this.delete(data);
            break;
            case 'crash':
            result = this.crash();
            break;
            case 'transaction':
            result = this.transaction(data);
            break;    
            default:
            result = {status:"Unknown command", data: data}
            console.log(result);
        }
        return result;
    }
    fetch(dataId)
    {
        let result;
        let fetchedData = this.storageManager.fetch(dataId);
        if(fetchedData)
        {
            result =  {status: "Data Fetched","data": fetchedData};
        } else {
            console.log("No data found");
            result =  {status: "Fetch Failed","data": "No Data Found"};
        }
        
        console.log(fetchedData);
        return result;
    }

    insert(data)
    {
        let result;
       let isDataInserted = this.storageManager.insert(data);
       if(isDataInserted)
        {
            result =  {status: "Data Inserted","data": data};
        } else {
            console.log("Insert failed");
            result =  {status: "Insert Failed","data": data};
        }
        return result;
    }

    update(data)
    {
        let result;
        let updatedData = this.storageManager.update(data);
       if(!!updatedData)
        {
            result =  {status: "Data Updated","data": updatedData};
        } else {
            console.log("Update failed");
            result =  {status: "Update Failed","data": data};
        }
        return result;
        
    }

    delete(data)
    {
        let result;
        let isDataDeleted = this.storageManager.delete(data);
       if(!!isDataDeleted)
        {
            result =  {status: "Data Deleted","data": ""};
        } else {
            console.log("Delete failed");
            result =  {status: "Delete Failed","data": data};
        }
        return result;
        
    }
    
    transaction(data)
    {
        let result;
        let changedData = this.storageManager.transact(data);
       if(!!changedData)
        {
            result =  {status: "Transaction completed","data": changedData};
        } else {
            console.log("Transaction failed");
            result =  {status: "Transaction Failed","data": data};
        }
        return result;
    }

    crash()
    {
        let result;
        if(!this.storageManager.hasTransactionIds())
        {
            result = {"status": "No Transaction in progress","data": "Safe"}
        }
        let transactionIds = this.storageManager.getTransactionIds();       
        let undoResult = this.undoLogManager.undo(transactionIds);
        result = {"status": `${transactionIds} . These transactions are rolled back`,"data": undoResult}
        return result;
        
    }
}