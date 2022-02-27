import {CommandManager} from './CommandManager';
import {CommandQueue} from './CommandQueue';
import {CommandService} from './CommandService';
import {LockManager} from './LockManager';
import {FileManager} from './FileManager';

let data = new FileManager();

let commandService = new CommandService(data);
let commandQueue = new CommandQueue();


let commandManager = new CommandManager(commandService, commandQueue,  data)

const promise1 = Promise.resolve(commandManager.do('fetch',data,4));
const promise3 = Promise.resolve(commandManager.do('insert',{"data":[1,6,7]},4));
const promise2 = Promise.resolve(commandManager.do('update',{"data":[2,5,9]},4));
const promise4 = Promise.resolve(commandManager.do('update',{"data":[2,5,99]},4));
const promise5 = Promise.resolve(commandManager.do('update',{"data":[2,5,999]},4));
const promise6 = Promise.resolve(commandManager.do('update',{"data":[2,5,9999]},4));
const promise7 = Promise.resolve(commandManager.do('update',{"data":[2,5,99999]},4));
const promise8 = Promise.resolve(commandManager.do('update',{"data":[2,5,999999]},4));
//const promise4 = Promise.resolve(commandManager.do('delete',"*",""));
Promise.all([promise1, promise2, promise3, promise4,promise5,promise6,promise7,promise8]).then((values) => {
  console.log(values);
});
// expected output: Array [3, 42, "foo"]
  


