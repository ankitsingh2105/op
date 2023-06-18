import "./index.css"
import { useState , useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged , GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc , setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const firebaseConfig = {
  apiKey: "AIzaSyCFVxCioGK8yRArkJOMGsBQOSo95xdwyeA",
  authDomain: "inbound-ranger-375215.firebaseapp.com",
  projectId: "inbound-ranger-375215",
  storageBucket: "inbound-ranger-375215.appspot.com",
  messagingSenderId: "620360233615",
  appId: "1:620360233615:web:187bdeee983f8bb0bf36fa"
};


export default function FirebaseForm() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [userName, setName] = useState("Please login");
  const [userEmail, setEmail] = useState("Please login")

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
  }, [auth, userEmail]);


  // TODO : google sign ups

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const signgoogle = await signInWithPopup(auth, provider)
      console.log("we are inside the login google -> ", signgoogle.user.uid);
      console.log("we are inside the login google -> ", signgoogle.user.displayName);
      createUserCollection(signgoogle.user , signgoogle.user.displayName);
    }
    catch (err) {
      console.error(err);
    }
  }

  // todo : creating user collection -> 
  // * ---------------------- *


  const createUserCollection = async (user  , name) => {
    try {
      const docRef = doc(db, 'newUsers21' , user.uid);
      await setDoc(docRef , {
        uid: user.uid,
        email: user.email,
        name: name
      });
      console.log('Document written with ID: ', docRef.id);
    } 
    catch (e) {
      console.error('Error adding document: ', e);
    }
  };



  return (
    <>
      <h1></h1>
      <div>  Name : {userName} </div>
      <div> Email : {userEmail}  </div>
      <ToastContainer />
      <br />
      <button onClick={handleGoogleLogin}>Login with google</button>
    </>
  )
}
