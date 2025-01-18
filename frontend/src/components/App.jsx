import { useState, useEffect } from 'react'
import '../App.css'
import axios from "axios"
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import Login from './Login';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {
  // const [count, setCount] = useState(0);
  // const [array, setArray] = useState([]);

  // const fetchAPI = async () => {
  //   const response = await axios.get("http://localhost:8080/api");
  //   setArray(response.data.test);
  //   console.log(response.data.test);
  // };

  // useEffect(() => {
  //   fetchAPI();
  // }, []);

  return (
    <div>
      <Router>
        <AuthProvider>
          <Routes>
            <Route exact path='/' element={<Dashboard/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/login' element={<Login/>}/>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App
