import React, { Component, useEffect } from 'react';
import ReactDOM from 'react-dom';
import src from './lecture.jpg'
import background from './lecture.jpg'
import { useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Button from '@mui/material/Button';
import { useNavigate,Link } from 'react-router-dom';
import Box from '@mui/material/Box';

function Casa(props) {
    const photos = props.photos
    const id = props.id
    const [currentIndex, setCurrentIndex] = useState();
    const navigate = useNavigate();
    const renderSlides = photos.map((src) => (
      <div >
        <img style={{transform: [{ rotate: '100deg'}]}} src={src} />
      </div>
    ));
    useEffect(()=>{
      console.log(photos)
    },[])
  function handleChange(index) {
    setCurrentIndex(index);
  }
  function handleClick(){
    navigate(`/quiz/${id}`)
  }
    return(
      <Box sx={{position:"relative"}}>
        <center>
          <div style={{ 
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                height:'100vh' ,backgroundImage: `url(${background})`  }}
                >
          <Carousel
            showArrows={true}
            autoPlay={true}
            infiniteLoop={true}
            selectedItem={photos[currentIndex]}
            onChange={handleChange}
            width={'750px'}
          >
            {renderSlides}
          </Carousel>
            
        </div>
      
      </center>
      <Box style={{display: 'inline-block'}} sx={{ position:"absolute",margin:"30px" ,bottom: '0px', right: '0px'}}>
              <Button sx={{padding:"15px"}} color="success" variant="contained" onClick={handleClick} >Self-assessment</Button>
            </Box>

    </Box>
        
    )
}
export default Casa