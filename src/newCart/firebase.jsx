import "./index.css"
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { updateProfile, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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
        console.log("this is user -> "  , user);
        console.log("this is user name-> "  , user.displayName);
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



  // todo : handeling form submissions
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("this is the email-> ", e.target.email.value)
    console.log("this is the password-> ", e.target.passwords.value)
    console.log("this is the first name -> ", e.target.firstName.value)
    console.log("this is the last name -> ", e.target.lastname.value)
    console.log("this is the form");
    const fname = e.target.firstName.value;
    const lname = e.target.lastname.value;
    const email = e.target.email.value;
    const password =e.target.passwords.value;
    const emailAndPass =await createUserWithEmailAndPassword(auth, email, password)
    try{
      console.log("this is emailandpass-> " , emailAndPass);
      toast.success("this is success" , {autoClose:1500});
      await updateProfile(auth.currentUser, { displayName: `${fname} ${ lname}` });
    }
    catch(err){
      toast.error(emailAndPass.error , {autoClose:1500});
    }
  }


  return (
    <>
      <h1>स्वागत है!</h1>
      <div className="info"> <b>Name</b> : {userName} </div>
      <div className="info"> <b>Email</b> : {userEmail}  </div>
      <br />

      <article>
        <br />
        <div>
          <button onClick={handleGoogleLogin}>Sign In with google</button>
        </div>
        <br />
        <div style={{ fontWeight: "bolder" }} >OR</div>
        <br />

        <form onSubmit={handleFormSubmit} action="">
          <div>
            <div>
              <div>Email</div>
              <input placeholder="Email" name="email" type="email" />
            </div>
            <div>
              <div>Password</div>
              <input placeholder="Password" name="passwords" type="password" />
            </div>
            <div>

              <div className="Names">

                <div>
                  <div>First Name</div>
                  <input placeholder="First Name" type="text" name="firstName" />
                </div>

                <div>
                  <div>Last Name</div>
                  <input placeholder="Last name" type="text" name="lastname" />
                </div>
              </div>
            </div>
            <br />
            <button>Sign Up</button>
            <br />
          </div>
        </form>
      </article>
    </>
  )
}
