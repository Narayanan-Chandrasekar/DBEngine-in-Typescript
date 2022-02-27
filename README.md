# DBEngine-in-Typescript
A test for concurrent data access via commands

Notes:
Data format - JSON 

Examples:
const promise1 = Promise.resolve(commandManager.do('fetch',data,4));
const promise3 = Promise.resolve(commandManager.do('insert',{"data":[1,6,7]},4));
const promise2 = Promise.resolve(commandManager.do('update',{"data":[2,5,9]},4));
const promise4 = Promise.resolve(commandManager.do('update',{"data":[2,5,99]},4));
const promise5 = Promise.resolve(commandManager.do('update',{"data":[2,5,999]},4));
const promise6 = Promise.resolve(commandManager.do('update',{"data":[2,5,9999]},4));
const promise7 = Promise.resolve(commandManager.do('update',{"data":[2,5,99999]},4));
const promise8 = Promise.resolve(commandManager.do('update',{"data":[2,5,999999]},4));

