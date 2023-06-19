import React, { useState } from 'react'
import "./index.css"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom'
import firebaseConfig from "./config"
import { ToastContainer, toast } from 'react-toastify';
export default function Navbar() {
  const [state, setstate] = useState(false)
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const handleLogout = async (e) => {
    await signOut(auth);
    toast.success("Signed Out", { autoClose: 1500 });
    setTimeout(() => {
      window.location.reload();
    }, 1800);
  }
   onAuthStateChanged(auth, (user) => {
    if (user) {
      setstate(false)
    } else {
      setstate(true)
    }
  });
  return (
    <>
      <nav>
        <ToastContainer />
        <ul>
          <Link to="/" style={{ color: 'black', textDecoration: 'none' }} ><li>Home</li></Link>
          {
            state ?
              (<Link to="/login" style={{ color: 'black', textDecoration: 'none' }}><li>Sign In</li></Link>)
              :
              (<li style={{ color: 'black', textDecoration: 'none' }} onClick={handleLogout} >Logout</li>)
          }
        </ul>
      </nav>
    </>
  )
}
