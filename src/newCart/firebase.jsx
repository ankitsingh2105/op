import "./index.css"
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { updateProfile, signInWithEmailAndPassword , createUserWithEmailAndPassword, getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {getFirestore, doc, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import firebaseConfig from "./config";
import dummy from "./dummyimageFirebase.png"
export default function FirebaseForm() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [userName, setName] = useState("Please login");
  const [userEmail, setEmail] = useState("Please login");
  const [loading, setLoading] = useState(true);
  
  // todo : creating user collection -> 
  // * ---------------------- *
  
  
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        createUserCollection(user , user.displayName);
        console.log("op -> " , user.uid , user.displayName);
        setLoading(false);
        setEmail(user.email);
        setName(user.displayName);
      }
    });
    
    setLoading(false);
    return () => unsubscribe();
  }, [auth, userEmail]);

  
  const createUserCollection = async (user, name) => {
      const docRef = doc(db, 'newUser', user.uid);
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        name: name,
      });
  };
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




  // todo : handeling form submissions
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const fname = e.target.firstName.value;
    const lname = e.target.lastname.value;
    const email = e.target.email.value;
    const password = e.target.passwords.value;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.reload();
      console.log("this is emailandpass-> ", emailAndPass);
      toast.success("this is success", { autoClose: 1500 });
      await updateProfile(auth.currentUser, { displayName: `${fname} ${lname}`, photoURL: dummy });
    } catch (err) {
      console.log("0-0-0");
      toast.error("An error occurred", { autoClose: 1500 });
    }
  };
  


  return (
    <>
      <h1>स्वागत है!</h1>
      {
        loading ? (<h1 id="spinner2"></h1>) : (
          <>
            <div className="info"> <b>Name</b> : {userName} </div>
            <div className="info"> <b>Email</b> : {userEmail}  </div>
            <br />
          </>
        )
      }
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
