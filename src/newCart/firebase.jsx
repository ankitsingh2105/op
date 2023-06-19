import "./index.css"
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import firebaseConfig from "./config";

export default function FirebaseForm() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [userName, setName] = useState("Please login");
  const [userEmail, setEmail] = useState("Please login")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        setName(user.displayName);
      }
    });

    return () => unsubscribe();
  }, [auth, userEmail]);


  // TODO : google sign ups

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const signgoogle = await signInWithPopup(auth, provider)
      createUserCollection(signgoogle.user, signgoogle.user.displayName);
    }
    catch (err) {
      console.error(err);
    }
  }

  // todo : creating user collection -> 
  // * ---------------------- *


  const createUserCollection = async (user, name) => {
    console.log
    try {
      const docRef = doc(db, 'newUsers21', user.uid);
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        name: name,
        phone: "",
        gender: ""
      });
    }
    catch (e) {
      console.error('Error adding document: ', e);
    }
  };



  return (
    <>
      <h1>स्वागत है!</h1>
      <div className="info"> <b>Name</b> : {userName} </div>
      <div className="info"> <b>Email</b> : {userEmail}  </div>
      <ToastContainer />
      <br />
      <button onClick={handleGoogleLogin}>Login with google</button>
    </>
  )
}
