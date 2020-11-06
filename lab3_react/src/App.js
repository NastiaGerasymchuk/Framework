import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';


 export default function App (){
     const[items,setItems]=useState([]);
     const[textWork,setTextWork]=useState("");
     const[dateWork,setDateWork]=useState(new Date());
     const[daysLeft,setDaysLeft]=useState("");

     const textWorkChange=(e)=>{   
      e.preventDefault();
      const {value}=e.target;
      setTextWork(() => (value ));
      console.log(textWork);   
  }

 const  dateWorkChange= (e)=>{
   //e.preventDefault();   
   setDateWork(new Date(e.target.value));
   console.log(dateWork);
  //  if(dateWork=='')
  //  return
   setDaysLeft(Math.floor((dateWork.getTime()-(new Date()).getTime())/(1000*24*60*60))+1);
    console.log(daysLeft)
    
  }
 const setItem=(e)=>{    
    e.preventDefault(); 
   
    if(correctData(dateWork)&&(isCloneTask(textWork,dateWork)==false)&&emptyTask(textWork)==false){
    setItems((prevListTasks) => {
      return prevListTasks.concat({
        textWork:textWork,
        id: Math.random(),
        dateWork:dateWork,
        daysLeft:daysLeft,
      });
    });
    //setDateWork('');
    setTextWork('');
    // setInputType("text");
    // setInputType("date")
    
  }
  else{
    alert("Your data IS'N CORRECT  Or this task EXISTS!!!");
}
  }
 const dateEnd=(dateWork)=>{
    return `${correctDateNumber(dateWork.getDate())}/${correctDateNumber(dateWork.getMonth()+1)}/${dateWork.getFullYear()}`;            
} 
const correctDateNumber=(number)=>{        
  return number<10? `0${number}`:number; 
  } 

const handleRemove=(id)=>{
  const newList = items.filter((item) => item.id !== id);
  setItems(newList);
    
}
const correctData=(data)=>{  
  data=new Date(data);
  let today=new Date();   
  return data.getTime()>=today.getTime()?true:false;

}
const emptyTask=(task)=>{
  return task.trim()==""?true:false;
}
const isCloneTask=(textTask,dateTask)=>{
  textTask=textTask.trim();
  dateTask=new Date(dateTask);
  let copyTasks=items.slice();

  let res=false;
  if(copyTasks.length==0){
      res=false;
  }
  else{
      copyTasks.forEach(item => {        
          if((item.textWork==textTask)&&(item.dateWork.getTime()==dateTask.getTime())){                               
              res=true;
          }
                
      });
  }
  
  return res;

}
const sendServer=(event)=>{
   event.preventDefault();
   console.log("sending to server...");
   if(items.length==0){
       alert("")
   }
   items.forEach(item => {
       postData('http://localhost:3000/tasks', item)
   .then((data) => {
      console.log.textContent = `Created: ${JSON.stringify(data)}`;
   }).catch("ERROR");
   });
   

}

 
const postData=async function(url = '', data = {}) {
   // Default options are marked with *
   try{
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify({
          id:data.id,
          task:data.textWork,
          daysLeft:data.daysLeft
      }) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
   }
   catch (error) {
    console.log(error);
  }
   
  
 }
 

  return(
    
    <div id="main">
    <div id="txt">
        <p id="text-task" className="padding-top-bottom-5"> Task:</p>
        <p id="text-date" className="padding-top-bottom-5">Due date</p>
        <p id="text-days-left" className="padding-top-bottom-5">Days left</p>
    </div>
    <div id="tasks">
    
    {items.map(item=>(
    <div className="current-task" key={item.id}>    
              <p id="curr-task" className="padding-top-bottom-5" >{item.textWork.trim()}</p>
              <p id="curr-date" className="padding-top-bottom-5" >{dateEnd(item.dateWork)}</p>
              <p id="curr-days-left" className="padding-top-bottom-5" >{item.daysLeft}</p>
              <button className="del-task padding-top-bottom-5" name="remove" onClick={()=>handleRemove(item.id)} >&#10006;</button>
          </div>
    ))}
   
    </div>
    <form >        
            <input id="txt-inp" className="margin3 padding-top-bottom-5" type="text" name="task" placeholder="to do..." onChange={textWorkChange} value={textWork}/>
            {/* <input id="txt-date" className="margin3 padding-top-bottom-5" type="text" onFocus={(e) => e.target.type = 'date'} ref={inputEl}   name="dueDate" id="date" placeholder="date"  onChange={dateWorkChange} /> */}
            <input id="txt-date" className="margin3 padding-top-bottom-5"  type="date" name="dueDate" id="date" onChange={dateWorkChange} />
            <button id="btn" className="margin3 padding-top-bottom-5" type="button" onClick={setItem}>add task</button>            
    </form>
    <button id="send-to-server" className="margin3" disabled onClick={sendServer}>send to server</button>

</div>
);
 
    }


   
 



