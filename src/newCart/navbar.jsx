import React, { useState } from 'react'
import "./index.css"
import "./custom-toast.css"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom'
import firebaseConfig from "./config"
import { ToastContainer, toast } from 'react-toastify';
import Logo from "./logo.png"

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
        <ToastContainer position="bottom-left" toastClassName="custom-toast"  />
        <ul>
          <img id="logoImg" src={Logo} alt="" />
          <Link  className='link' to="/" style={{ color: 'black' }} ><li>Home</li></Link>
          {
            state ?
              (
              <>

              <Link className='link' to="/signin" style={{ color: 'black'}}><li>SignUp</li></Link>
              
              <Link className='link' to="/login" style={{ color: 'black'}}><li>LogIn</li></Link>

              </>
              )
              :
              (<li style={{ color: 'black' }} onClick={handleLogout} >Logout</li>)
          }
        <li> <a href="https://ankitsinghchauhan.tech/">Portfolio</a></li>
        </ul>
      </nav>
    </>
  )
}
