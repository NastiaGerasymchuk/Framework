import React, { useRef } from 'react';
import logo from './logo.svg';
import './App.css';

 class App extends React.Component{
   constructor(props){
     super (props);
     this.textWorkChange=this.textWorkChange.bind(this);
     this.dateWorkChange=this.dateWorkChange.bind(this);
     this.setItem=this.setItem.bind(this);
    //  this.state={items:[],textWork:'',dateWork:'',daysLeft:'',apiResponse: Person}; 
    this.state={items:[],textWork:'',dateWork:'',daysLeft:''}; 
    this.state.inputEl=React.createRef(null);
     
   } 
  
  textWorkChange(e){
    e.preventDefault();
    this.setState({textWork:e.target.value});
    
  }

  dateWorkChange(e){
    e.preventDefault();
    this.setState({dateWork:new Date(e.target.value)});
    this.setState(state=>({daysLeft:Math.floor((state.dateWork.getTime()-(new Date()).getTime())/(1000*24*60*60))+1}));
    console.log(this.state.daysLeft,this.state.dateWork);
    
  }
  setItem(e){    
    e.preventDefault(); 
   
    if(this.correctData(this.state.dateWork)&&(this.isCloneTask(this.state.textWork,this.state.dateWork)==false)&&this.emptyTask(this.state.textWork)==false){
    const newItem = {
      textWork: this.state.textWork,
      id: Math.random(),
      dateWork:this.state.dateWork,
      daysLeft:this.state.daysLeft,
    };
    this.setState(state => ({
      items: state.items.concat(newItem),
      textWork: '',
      dateWork: ''
    }));
    this.state.inputEl.current.value="date";
    this.state.inputEl.current.type="text";
    
  }
  else{
    alert("Your data IS'N CORRECT  Or this task EXISTS!!!");
}
  }
  dateEnd(dateWork){
    return `${this.correctDateNumber(dateWork.getDate())}/${this.correctDateNumber(dateWork.getMonth()+1)}/${dateWork.getFullYear()}`;            
} 
correctDateNumber=(number)=>{        
  return number<10? `0${number}`:number; 
  } 

handleRemove(id){
  const newList = this.state.items.filter((item) => item.id !== id);
  this.setState(state=>({
    items:newList
  }));
    
}
correctData(data){  
  data=new Date(data);
  let today=new Date();   
  return data.getTime()>=today.getTime()?true:false;

}
emptyTask(task){
  return task.trim()==""?true:false;
}
isCloneTask(textTask,dateTask){
  textTask=textTask.trim();
  dateTask=new Date(dateTask);
  let copyTasks=this.state.items.slice();

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
sendServer(event){
   event.preventDefault();
   console.log("sending to server...");
   if(this.state.items.length==0){
       alert("")
   }
   this.state.items.forEach(item => {
       this.postData('http://localhost:3000/tasks', item)
   .then((data) => {
      console.log.textContent = `Created: ${JSON.stringify(data)}`;
   }).catch("ERROR");
   });
   

}

 
 async postData(url = '', data = {}) {
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
          task:data.task,
          dueDate:data.dueDate
      }) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
   }
   catch (error) {
    console.log(error);
  }
   
  
 }
 
render(){
  return(
    
    <div id="main">
      {/* <div>{this.state.apiResponse.last_name}</div>
      <div>{this.state.apiResponse.first_name}</div> */}
      {/* {this.state.apiResponse} */}
    <div id="txt">
        <p id="text-task" className="padding-top-bottom-5"> Task:</p>
        <p id="text-date" className="padding-top-bottom-5">Due date</p>
        <p id="text-days-left" className="padding-top-bottom-5">Days left</p>
    </div>
    <div id="tasks">
    
    {this.state.items.map(item=>(
    <div className="current-task" key={item.id}>    
              <p id="curr-task" className="padding-top-bottom-5" >{item.textWork.trim()}</p>
              <p id="curr-date" className="padding-top-bottom-5" >{this.dateEnd(item.dateWork)}</p>
              <p id="curr-days-left" className="padding-top-bottom-5" >{item.daysLeft}</p>
              <button className="del-task padding-top-bottom-5" name="remove" onClick={()=>this.handleRemove(item.id)} >&#10006;</button>
          </div>
    ))}
   
    </div>
    <form >        
            <input id="txt-inp" className="margin3 padding-top-bottom-5" type="text" name="task" placeholder="to do..." onChange={this.textWorkChange} value={this.state.textWork}/>
            <input id="txt-date" className="margin3 padding-top-bottom-5" type="text" onFocus={(e) => e.target.type = 'date'} ref={this.state.inputEl}   name="dueDate" id="date" placeholder="date"  onChange={this.dateWorkChange} />
            <button id="btn" className="margin3 padding-top-bottom-5" type="button" onClick={this.setItem}>add task</button>            
    </form>
    <button id="send-to-server" className="margin3" disabled onClick={this.sendServer}>send to server</button>

</div>
);
 }
 
  }  

export default App;
   
 



