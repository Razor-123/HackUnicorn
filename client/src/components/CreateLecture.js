import React,{useState,useEffect} from 'react'
import { useNavigate,Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import MicRecorder from 'mic-recorder-to-mp3';
import { Box, Typography } from '@mui/material';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import IconButton from '@mui/material/IconButton';
import { server_home } from '../secret/secret';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import bg from '../utils/lecture.jpg'
import '../utils/index.css'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import  "../utils/index.css"

import CssBaseline from '@mui/material/CssBaseline';

const navItems = ['About', 'Services', 'Contact'];
const ngrok = "http://381b-34-123-101-185.ngrok-free.app/upload";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });
function CreateLecture() {
  
  const [file,setFile] = useState("");
  const [transcript,setTranscript] = useState("");
  const navigate = useNavigate();
  const [isRecording,setIsRecording] = useState(false)
  const [blobURL,setBlobURL] = useState('')
  const [isBlocked,setIsBlocked] = useState(false)
  const [heading,setHeading] = useState("")
  const [notes,setNotes] = useState([])
  const [overview,setOverview] = useState("")
  const [photos,setPhotos] = useState([])
  const [displayMessage,setDisplayMessage] = useState("")
  const [showAlert,setShowAlert] = useState(false)
  const [lecId,setLecId] = useState("");

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handleChange = (e)=>{
      const file = e.target.files[0];
      setFile(file);
      //console.log(e.target.files[0]);
  }
  const handleAlertClose = (event,reason) => {
    if (reason && reason == "backdropClick") return;
    setShowAlert(false);
    navigate(`/lecture/${lecId}`);
  };

  const handlSubmit = async (e) => {
    e.preventDefault();
    setDisplayMessage("Generating notes")
    console.log("Audio submitted");
    let formData = new FormData();
    formData.append("file",file);
    const response  = await fetch(`${ngrok}`,{ // python server
        method:"POST",
        body:formData,
    })
    const responseWithBody = await response.json();
    console.log(responseWithBody);

    if (responseWithBody){
      let tns = responseWithBody.transcript;
      let nts = responseWithBody.notes;
      let ovr = responseWithBody.overview;
      let head = responseWithBody.heading;
      console.log(tns);
      const rsp = await fetch(`${server_home}/admin/createlecture`,{
          method:"POST",
          headers:{
              'Content-Type':'application/json',
          },
          body:JSON.stringify({
              heading:head,
              transcript:tns,
              overview:ovr,
              notes:nts,
              url:"",
              category:localStorage.getItem('subject'),
              taught_by:localStorage.getItem('name'), //// <<<<<------
              snap_shots:photos,
          }),
          credentials:'include',
      }).then((data)=>{
          return data.json();
      }).then((data)=>{
          console.log(data);
          if (data.status)
          setLecId(data.data['_id'])
          setDisplayMessage("");
          setShowAlert(true)
          // show dialog done
      })
    }else{
      console.log("No notes generated")
    }
  }

  
  const start = async() => {
    if (isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(async() => {
          setIsRecording(true)
          const response  = await fetch("http://127.0.0.1:5001/startendrecord",{ // python server
              method:"GET"
          })
          const responseWithBody = await response.json();
          console.log(responseWithBody)
        }).catch((e) => console.error(e));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisplayMessage("Generating notes")
    console.log("Audio submitted");
    let formData = new FormData();
    formData.append("file",file);
    const response  = await fetch("http://127.0.0.1:5000/upload",{ // python server
        method:"POST",
        body:formData,
    })
    const responseWithBody = await response.json();
    console.log(responseWithBody);

    if (responseWithBody){
      let tns = responseWithBody.transcript;
      let nts = responseWithBody.notes;
      let ovr = responseWithBody.overview;
      let head = responseWithBody.heading;
      console.log(tns);
      const rsp = await fetch(`${server_home}/admin/createlecture`,{
          method:"POST",
          headers:{
              'Content-Type':'application/json',
          },
          body:JSON.stringify({
              heading:head,
              transcript:tns,
              overview:ovr,
              notes:nts,
              url:"",
              category:localStorage.getItem('subject'),
              taught_by:localStorage.getItem('name'), //// <<<<<------
              snap_shots:photos,
          }),
          credentials:'include',
      }).then((data)=>{
          return data.json();
      }).then((data)=>{
          console.log(data);
          if (data.status)
          setLecId(data.data['_id'])
          setDisplayMessage("");
          setShowAlert(true)
          // show dialog done
      })
    }else{
      console.log("No notes generated")
    }
  }
  const stop = async() => {
      Mp3Recorder
        .stop()
        .getMp3()
        .then(async([buffer, blob]) => {
          const blobURL = URL.createObjectURL(blob)
          const file = new File(buffer,'my_audio.wav',{
              type:blob.type,
              lastModified:Date.now()
          });
          setFile(file)
          setBlobURL(blobURL)
          setIsRecording(false)
          const response  = await fetch("http://127.0.0.1:5001/startendrecord",{ // python server
              method:"GET"
          })
          const responseWithBody = await response.json();
          console.log(responseWithBody)
          if (responseWithBody){
            let phts = [];
            for (let i=0;i<responseWithBody.photos.length;i++){
              phts.push(`data:image/jpeg;base64,${responseWithBody.photos[i]}`)
            }
            setPhotos(phts)
          }
        }).catch((e) => console.log(e));
    };
    function removeImage(idx){
      let phts = [];
      for (let i=0;i<photos.length;i++){
        if (i!=idx)phts.push(photos[i]);
      }
      setPhotos(phts);
    }
  useEffect(()=>{
    navigator.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        setIsBlocked(false)
      },
      () => {
        console.log('Permission Denied');
        handlSubmit();
        setIsBlocked(true)
      },
    );
    //setPhotos(["/2.jpg"])
  },[])
  return (
    <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', width: '100vw' }} >
    <CssBaseline />
      <AppBar component="nav" style={{backgroundColor:'#333333'}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Edumade
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Dialog
          fullWidth={true}
          open={showAlert}
          onClose={handleAlertClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Notes Created
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleAlertClose}>Ok</Button>
          </DialogActions>
        </Dialog>
      <center>
      <br/><br/><br/><br/><br/><br/>
      <Box>
      {/* <div class="recorder-container">
                  <div class="outer"></div>
                  <div class="outer-2"></div>
                  <div class="icon-microphone"> 
                  </div>
              </div> */}
        {
          isRecording ? (
                <StopCircleIcon style={{ color: "white" }} fontSize='large' onClick={stop} disabled={!isRecording}/>) :
            (
              <MicRoundedIcon style={{ color: "white" }} fontSize='large' onClick={start} disabled={isRecording}/>  
            )
          }
          
      </Box>
      <br/><br/><br/>
      <Container component="main" maxWidth="md">
        <form onSubmit={handleSubmit}>
            <Paper elevation={5}>
                <br/><br/>
                <Button variant="outlined" component="label">
                    Upload Video
                    <input hidden type="file" onChange={handleChange}/>
                </Button>
                {file.name && file.name.length!=0 &&
                    <span><br/>{file.name}</span>
                }
                <br/><br/><br/>
            </Paper>
            <br/><br/>
            {
              displayMessage.length==0 ? (
                <Button type='submit' variant="contained">
                    Generate Notes
                </Button>
              ) : (
                <Box>
                  <CircularProgress/>
                  <Typography>{displayMessage}</Typography>
                </Box>
              )
            }
            
            <br/><br/>
        </form>
      </Container>
      <br/><br/>
      {
        photos.length!=0 ? (
          photos.map((src,idx)=>{
              {/* return (
                <img width="300px" height="300px" src={`data:image/jpg;base64,${src}`} />
              ) */}
              return(
                <Box position="relative" margin="20px" display='inline-block' paddingRight="10px" paddingTop="10px">
                  <IconButton onClick={()=>removeImage(idx)} sx={{"&:hover": { color: "red",fontSize:"29px" },position:"absolute",top:"0",right:"0",padding:"0px"}} size="large" aria-label="remove picture" component="label">
                    <HighlightOffIcon sx={{backgroundColor:"white"}} fontSize="inherit" />
                  </IconButton>
                  <img width="350px" height="230px" src={src} />
                </Box>
              )
            })
        ) : (
          <></>
        )
      }
      <br/><br/><br/><br/><br/>
      </center>
    </div>
  )
}

export default CreateLecture
