export default function Analytics(){

 return(

  <div>

   <h2 className="text-xl font-bold mb-4">
     Project Analytics
   </h2>

   <div className="grid grid-cols-3 gap-4">

     <div className="bg-white p-4 rounded shadow">
       Total Tasks
     </div>

     <div className="bg-white p-4 rounded shadow">
       Completed Tasks
     </div>

     <div className="bg-white p-4 rounded shadow">
       Pending Tasks
     </div>

   </div>

  </div>

 );

}