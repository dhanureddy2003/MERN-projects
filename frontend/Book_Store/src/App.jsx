import {Route, Routes} from 'react-router-dom';
import Home from './Home/Home'
import './index.css'
import Courses from './Courses/Courses';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Signup from './components/Signup';

function App() {

  return (
    <>
    <NavBar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/courses' element={<Courses/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </Routes>
    <Footer/>
    </>
  )
}

export default App
