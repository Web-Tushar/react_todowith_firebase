import { useEffect, useState } from 'react'
import { getDatabase, ref, set, push,onValue,remove,update} from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  let [text,setText] = useState("")
  let [alltodo,setallTodo] = useState([])
  let [isbtn,setIsbtn] = useState (true)
  let [allinfo,setallinfo]= useState({})
  const db = getDatabase();
  let handleForm = (e) =>{
    setText(e.target.value);
  }

  // write operation

let handleSubmit =() =>{
  if(text !== ""){
    set(push(ref(db,'users')), {
      names:text,
      
    }).then(()=>{
      text==""
      toast.success('🦄 success!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        setText("")
    })
  }else{
    toast.success('🦄 pleas enter your todo!', {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      });


  }
}

// read operation
useEffect(()=>{
  const todoRef = ref(db, 'users');
    onValue(todoRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item)=>{
        arr.push({...item.val(),id:item.key});

      })
      setallTodo(arr)
    });
},[])

//delete operation

let handleDelete=(del)=>{
  // console.log(del);
  remove(ref(db,"users/" + del)).then(()=>{
    toast.warn('🦄 delete done!', {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  })


}
// Edit opreration
let handleEdit =(editinfo)=>{
  setIsbtn(false)
  setText(editinfo.names)
  setallinfo(editinfo);
}

// update operation

let handleUpdate =() =>{
  update(ref(db,"users/" + allinfo.id),{
    ...allinfo,
    names:text
  }).then(()=>{
    toast.warn('🦄 update done!', {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
    
    setText("")
    setIsbtn(true )
  })
 
  // console.log(text);


}

  
  return (
    <>

<ToastContainer/>
<div>
  <h2 className=' text-[red]'>tushar</h2>
</div>
      <input onChange={handleForm} name='text' value={text} placeholder='enter your task' />
      {isbtn
      ?
      <button onClick={handleSubmit}>submit</button>
      :
      <button onClick={handleUpdate}>update</button>
        
      }
      <div>
        <ul>
          {alltodo.map((item,index)=>(
          <li key={index}>{item.names} <button onClick={()=>handleDelete (item.id)}>delete</button>
          <button onClick={()=>handleEdit(item)}>Edit</button></li>
            ))
          }
          
        </ul>
      </div>
    </>
  )
}

export default App
 