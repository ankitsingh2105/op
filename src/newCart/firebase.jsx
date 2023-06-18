import "./index.css"
import { useState , useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc , setDoc, addDoc, collection } from 'firebase/firestore';
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

  // ...

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
    if (auth.currentUser) {
      console.log("this is the user UID -> ", result.user);
      toast.success("Successfully Signed Up", { autoClose: 1500 });
    } else {
      throw new Error("User authentication failed.");
    }
  } catch (err) {
    console.log(err);
    toast.error(err.message, { autoClose: 1500 });
  }
};

// ...


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
  }, [auth, userEmail]);


  // TODO : google sign ups



  // TODO: google signs 

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
