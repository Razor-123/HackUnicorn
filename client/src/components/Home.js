import React from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate,Link } from 'react-router-dom';
import Menu from './Menu'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

// TODO ->
// subject blocks

function Home() {
  const subjectList = ["Mathematics","Biology","Chemistry","DAA","SST","History"]
  const subImg = ["./maths.jpg",'./5451375.png',"./chemistry.jpg",'./cs.jpg','./socialscience.png','./history.jpg',]
  const navigate = useNavigate();
  function handleSubjectSelect(subjectName){
    console.log(subjectName);
    navigate('/subject/'+subjectName);
  }
  return (
    <>
      <Menu />
      <div style={{
        minHeight: "100vh",
        backgroundImage: `url(./lecture.jpg)`,
        padding: "40px",
      }}>
        <Grid sx={{ flexGrow: 1 }} paddingTop={5} container spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={12}>
              {subjectList.map((value,idx) => (
                <Grid key={value} item>
                  <Paper
                    style={{ border: ` 25` }}
                    sx={{
                      height: 300,
                      width: 300,
                      backgroundColor: '#F1F6F9',
                      borderRadius: '8'
                    }}
                    onClick={()=>handleSubjectSelect(value)}
                  >
                    <div style={{ position: 'relative', height: '100%' }}>
                      <img
                        src={subImg[idx]}
                        alt="Subject Image"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </div>
                    <Box p={1}>
                      <Typography className='heading' color={'#F1F6F9'} variant="h5">{value}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default Home


{/* <Card sx={{ maxWidth: 275,margin:"20px",boxShadow: 4 }}>
                    <CardContent>
                      <img src="https://www.pngitem.com/pimgs/m/21-212871_body-math-signs-maths-icon-png-transparent-png.png" alt="Girl in a jacket" width="200" height="200" />
                    </CardContent>
                    <CardActions>
                      <div sx={{display:"block"}}>
                        <Button size="small" onClick={()=>handleSubjectSelect(subject_name)}>{subject_name}</Button>
                      </div>
                    </CardActions>
                  </Card> */}