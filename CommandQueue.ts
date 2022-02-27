export class CommandQueue
{
    queue;
    tail;
    head;
    length;
    constructor()
    {
        this.head=0;
        this.tail=0;
        this.length =100;
        this.queue = new Array();
    }

    enqueue(command, data, dataId)
    {
        if(this.head === this.tail + 1)
        {
            return false;
        }
        this.queue[this.tail] = {"command":command, "data": data, "id":dataId};
        if(this.tail === this.length)
        {
            this.tail = 0;
        }else {
            this.tail++;
        }
        
    }

    dequeue()
    {
        if(this.head === this.tail)
        {
            return false;
        }
        let command = this.queue[this.head].command;
        let data = this.queue[this.head].data;
        let dataId = this.queue[this.head].dataId;
        if(this.head === this.length)
        {
            this.head = 0;
        } else {
            this.head = this.head + 1;
        }
        return {"command":command, "data": data, "id":dataId};
    }

    getCommandQueue()
    {
        return this;
    }

    hasCommands()
    {
        return this.head !== this.tail;
    }
}