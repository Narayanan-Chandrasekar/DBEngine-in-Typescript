const fs = require('fs');

export class FileManager
{
    public data;
    constructor()
    {
        //read file into an array
       this.data =  JSON.parse(fs.readFileSync('Data/data.json',{"encoding":"utf8"}));
      console.log(typeof this.data, this.data[2]);
      return this.data;
    }
    getIndexedData()
    {
        return true;
    }

    fetch(data)
    {
        return "fetched data";
    }
    insert(data)
    {
        return "inserted data";
    }
    delete(data)
    {
        return "deleted data";
    }
    update(data)
    {
        return "updated data";
    }
    crash()
    {
        return "crashed the engine";
    }

}