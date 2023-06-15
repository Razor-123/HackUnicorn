import './App.css';
import { BrowserRouter as Router,Routes,Route,} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import StudentProfile from './components/StudentProfile';
import Welcome from './components/Welcome';
import Lecture from './components/Lecture';
import Subject from './components/Subject';
import AdminHome from './components/AdminHome';
import CreateLecture from './components/CreateLecture';
import Quiz from './components/Quiz'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Welcome/>}/>
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/student_profile' element={<StudentProfile/>} />
        <Route exact path='/home' element={<Home/>} />
        <Route exact path='/admin_home' element={<AdminHome />} />
        <Route exact path='/lecture/:id' element={<Lecture />} />
        <Route exact path='/subject/:id' element={<Subject />} />
        <Route exact path='/quiz/:id' element={<Quiz />} />
        <Route exact path='/create_lecture' element={<CreateLecture/>} />
      </Routes>
    </Router>
  );
}

export default App;
