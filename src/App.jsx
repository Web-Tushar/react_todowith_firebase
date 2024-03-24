import { useEffect, useState } from 'react'
import { getDatabase, ref, set, push,onValue,remove,update} from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import tailwindConfig from '../tailwind.config';

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
  
    <div className=' mt-4 mx-auto container'>

<ToastContainer/>
<div >
  <h2 className='text-green-500 text-center bg-neutral-700 text-[30px] font-bold mx-auto uppercase'>your todo</h2>
</div>
    <div className='flex justify-center items-center flex-col'>
  <div>
  <input className='border-2 border-gray-500 mt-4  p-[2px]' onChange={handleForm} name='text' value={text} placeholder='enter your task' />
      {isbtn
      ?
      <button className='ml-5 border-2 border-gray-500 p-[2px] rounded-[3px] text-[20px] font-bold' onClick={handleSubmit}>submit</button>
      :
      <button onClick={handleUpdate}>update</button>
        
      }
    </div>  
    
    </div>
    <div className=' flex  items-center justify-center'>
        <ul className='flex flex-col gap-5 '>
          {alltodo.map((item,index)=>(
          <li className='border-2 m text-[30px] text-green-400 flex justify-between  ' key={index}>{index}:{item.names} 
          <button  className='  text-red-400 border-2  text-[30px]'onClick={()=>handleDelete (item.id)}>delete</button>
          <button className='  text-green-400 border-2 ml-3 text-[30px]' onClick={()=>handleEdit(item)}>Edit</button></li>
            ))
          }
          
        </ul>
      </div>
    </div>

    </>
  )
}

export default App
 