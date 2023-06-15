import React,{useState,useEffect,useRef} from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom'
//import chalk from 'chalk';
import Casa from '../utils/Casa';
import Typography from '@mui/material/Typography';
import { Card } from '@mui/material';
import { CardContent } from '@mui/material';
import Box from '@mui/material/Box';
import { Padding, WidthFull } from '@mui/icons-material';
import { makeStyles } from '@mui/material';
import  "../utils/index.css"
import { server_home } from '../secret/secret';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';

function Lecture() {
  const lec_id = useParams().id;
  const pdfRef = useRef();
  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      console.log("here")
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l','mm','a4',true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth/imgWidth,pdfHeight/imgHeight);
      const imgX = (pdfWidth-imgWidth*ratio)/2;
      const imgY = 30;
      pdf.addImage(imgData,'PNG',imgX,imgY,imgWidth*ratio,imgHeight*ratio);
      pdf.save('notes.pdf');
    });
  };
  const [lecture,setLecture] = useState();
  const [date,setDate] = useState();
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
      var date = new Date(res.data.created);
      var d = date.getDate();
      var m = date.getMonth()+1;
      var y = date.getFullYear();
      var hr = date.getHours();
      var min = date.getMinutes();
      setDate(d.toString()+"/"+m.toString()+"/"+y.toString());
      console.log(res.data);
    })
  }
  useEffect(()=>{
    getLecture();
    // setLecture({
    //   'heading':"Guptas Scam" , 'overview':"Gupta scammed a lot of students in gbpiet photosynthesis, the process by which green plants and certain other organisms transform light energy into chemical energy. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.",'taught_by':"Yogesh Bhatt",
    //   'created':"13-5-2023",'notes':["Gupta is gupta","Gupta is kujli waala kutta","Gupta loves Pet","Photosynthesis is also used by algae to convert solar energy into chemical energy. Oxygen is liberated as a by-product and light is considered as a major factor to complete the process of photosynthesis.","These sugars are then sent to the roots, stems, leaves, fruits, flowers and seeds. In other words, these sugars are used by the plants as an energy source, which helps them to grow. These sugar molecules then combine with each other to form more complex carbohydrates like cellulose and starch. The cellulose is considered as the structural material that is used in plant cell walls."
    // ,"Another by-product of photosynthesis is sugars such as glucose and fructose."]
    // });
  },[])
  return (
      <>
    {
    lecture ? (
      <div ref={pdfRef}  style ={{padding:'0px,0px,0px,0px'}} >
        <Box textAlign='right' margin="8px">
          <Button variant="contained" onClick={downloadPDF} aria-label="download"  endIcon={<DownloadIcon />}>
            Download pdf
          </Button>
        </Box>
        <Box  sx={{ flexGrow: 1  }}>
          <AppBar  position="static" style={{backgroundColor:'#333333'}}>
            <Toolbar >
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <h2 className='title'>{lecture.heading}</h2> 
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Typography variant='h6' className='meta'>Lecturer: {lecture.taught_by}</Typography>
                  <Box sx={{ height: 8 }} />
                  <Typography variant="subtitle1" className='meta'>Date created: {date}</Typography>
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
        <br /><br />
          <h2 className='heading' style={{paddingLeft:'10px'}}>Overview:</h2>
          <div className='overview' style={{paddingLeft:'10px'}}>{lecture.overview}</div>
        <br /><div style={{}}></div> <br />
        <h2 className='heading' style={{paddingLeft:'10px'}}>Notes:</h2>
        {lecture.notes.map((note, idx) => { 
          return <p className='overview' style={{paddingLeft:'10px'}} >🌲{note}</p>;
        })}
        <Casa id={lec_id} photos={lecture.snap_shots} />
      </div>
    ) : (
        <Box textAlign={'center'}>
          <br/><br/><br/><br/><br/>
          <CircularProgress />
        </Box>
    )
    }
  </>
  )
}

export default Lecture