import React,{useState,useEffect} from 'react'
import { useNavigate,Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { server_home } from '../secret/secret';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
const theme = createTheme();


function Login() {
  const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [showAlert,setShowAlert] = useState(false);
    const [alertMessage,setAlertMessage] = useState("An error occured");
    const navigate = useNavigate();
    async function handleSubmit(event){
        event.preventDefault();
        const response = await fetch(`${server_home}/util/login`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                email:email,
                password:password
            }),
            credentials:'include',
        })
        const data = response.json();
        data.then(res=>{
            console.log(res);
            if (res.status==="ok"){
                localStorage.setItem('token',res.token);
                localStorage.setItem('email',res.data.email);
                localStorage.setItem('password',res.data.password);
                if (res.data.subject){
                  localStorage.setItem('isStudent',0);
                  localStorage.setItem('subject',res.data["subject"]);
                  localStorage.setItem('name',res.data['name']);
                  navigate('/create_lecture');
                }
                else{
                  localStorage.setItem('isStudent',1);
                  navigate('/home');
                }
            }else{
                setAlertMessage(res.message);
                setShowAlert(true);
            }
        })
    };
    return (
        <ThemeProvider theme={theme}>
          <Collapse in={showAlert}>
              <Alert 
                  action={
                      <IconButton
                          size="small" color="inherit"
                          onClick={() => {
                              setShowAlert(false);
                          }}
                      >
                          <CloseIcon fontSize="inherit" />
                      </IconButton>
                  }
                  severity="error">
                  {alertMessage}
              </Alert>
          </Collapse>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Log in
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={(e)=>setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e)=>setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Log In
                </Button>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
    );
}

export default Login