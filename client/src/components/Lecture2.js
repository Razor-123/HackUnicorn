import React,{useState,useEffect} from 'react'
import { server_home } from '../secret/secret';
import { useNavigate, useParams } from 'react-router-dom'

function Lecture() {
  const lec_id = useParams().id;
  const [lecture,setLecture] = useState();
  async function getLecture(){
    const response = await fetch(`${server_home}/util/lecture/${lec_id}`,{
      method:"GET",
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include'
    })
    const data = response.json();
    data.then(res=>{
      setLecture(res.data);
      console.log(res.data);
    })
  }
  useEffect(()=>{
    getLecture();
  },[])
  return (
    <center>
      {
        lecture ? (
          <div>
            <br/><br/>
            <h1>{lecture.heading}</h1>
            <br/><br/>
            <h3>{lecture.overview}</h3>
            <br/>
            <h4>{lecture.taught_by.name}</h4>
            <h5>{lecture.created}</h5>
            <br/>
            {
              lecture.notes.map((note,idx)=>{
                return <p>{note}</p>
              })
            }
          </div>
        ):(
          <h1>loading</h1>
        )
      }
    </center>
  )
}

export default Lecture
