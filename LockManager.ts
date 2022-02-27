 export class LockManager
{
  static lockMap:any; 
      constructor()
   {
       LockManager.lockMap = new Map();
   }

   public lock(id)
   {
       if(!LockManager.lockMap.get(id))
       {
        LockManager.lockMap.set(id,id);
        return true;
       }
       return false;
   }

   public unlock(id)
   {
    if(LockManager.lockMap.get(id))
    {
        LockManager.lockMap.delete(id);
        return true;
    }   
    return false;
    
   }
}