import React, { useDeferredValue, useEffect, useRef, useState } from 'react';
import { initializeApp } from "firebase/app";
import "./index.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, GoogleAuthProvider ,signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCFVxCioGK8yRArkJOMGsBQOSo95xdwyeA",
  authDomain: "inbound-ranger-375215.firebaseapp.com",
  projectId: "inbound-ranger-375215",
  storageBucket: "inbound-ranger-375215.appspot.com",
  messagingSenderId: "620360233615",
  appId: "1:620360233615:web:187bdeee983f8bb0bf36fa"
};


export default function FirebaseForm() {
  const [userName, setName] = useState("Please login");
  const [userEmail, setEmail] = useState("Please login")
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: name
      });
      console.log("this is the result -> ", result);
      toast.success("Successfully Signed Up", { autoClose: 1500 });
    } catch (err) {
      console.log(err);
      toast.error(err.message, { autoClose: 1500 });
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("this is the login form ");
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const login = await signInWithEmailAndPassword(auth, email, password);
      console.log("this is the login ", login);
      toast.success("Successfull login bawa!!", { autoClose: 1500 })
    }
    catch (error) {
      toast.error("Invalid Login credentials", { autoClose: 1500 })
    }
  }

  const handleLogout = async (e) => {
    await signOut(auth);
    toast.success("Sign out is successfull", { autoClose: 1500 });
    setTimeout(() => {
      window.location.reload();
    }, 1800);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user email-> ", user.email, " \nuser name-> ", user.displayName);
        setEmail(user.email);
        setName(user.displayName);
      } else {
        console.log("user is out ");
      }
    });
  
    return () => unsubscribe();
  },[auth, userEmail]);


  // TODO : google sign ups

  
  
  // todo: google signs 
  
  const handleGoogleLogin = async() =>{
    const provider = new GoogleAuthProvider();
    try{
      const signgoogle = await signInWithPopup(auth, provider)
      console.log("we are inside the login google -> " , signgoogle);
    }
    catch(err){
      console.error(err);
    }
  }
  
  return (
    <>
      <h1>Firebase Model</h1>
      <div>  Name : {userName} </div>
      <div> Email : {userEmail}  </div>
      <ToastContainer />
      <form onSubmit={handleSubmit} action="">
        <br />
        <input type="text" name="name" placeholder='name' />
        <br />
        <input type="email" name="email" placeholder='email' />
        <br />
        <input type="password" name="password" placeholder='password' />
        <br />
        <button type="submit">Sign up</button>
        <br />
      </form>
      <form onSubmit={handleLogin} action="">
        <br />
        <input type="email" name="email" placeholder='email' />
        <br />
        <input type="password" name="password" placeholder='password' />
        <br />
        <button type="submit">Login</button>
        <br />
      </form>
      <br />
      <button onClick={handleLogout} >
        Logout
      </button>
      <br />
      <button onClick={handleGoogleLogin}>Login with google</button>
    </>
  )
}
