import React, { useRef, useState } from 'react'
import { initializeApp } from 'firebase/app';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import firebaseConfig from './config';
import dummy from "./dummyimageFirebase.png"
import { getDoc, doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { getStorage, ref ,uploadBytes } from "firebase/storage";
export default function Home() {
    const [name, setname] = useState("")
    const infoCenter = useRef(null);
    // todo : displaying date on the home page
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setname(user.displayName);
                infoCenter.current.innerHTML =
                    `
                <br/>
                <div>Name : ${user.displayName}</div>
                <br/>
                <div>Email : ${user.email}</div>
                <br/>
                <br/>
                `
        } else {
            console.log("user is out ");
        }
    });


    // todo : something shit here!!
    // todo : handeling images 

    const handleImageChanges = (e) => {
        const photo = e.target.files[0];
        console.log("we are selecting an image:", photo.name);
        const user = auth.currentUser;
        const storageRef = ref(storage, `images/${user.uid}/${photo.name}`);
      
        uploadBytes(storageRef, photo).then(() => {
          console.log('Uploaded a blob or file!');
        }).catch((error) => {
          console.log('Error uploading blob or file:', error);
        });
      }

    // todo : getting user info

    const getUserInfo = () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            console.log("current user is  -> ", user.displayName);
        }
    }

    return (
        <>
            <div>
                <h1>Welcome <br />{name} 👋</h1>
                <div id="info" ref={infoCenter} ></div>
            </div>
            <div>
                <img src={dummy} alt="" />
                <br />
                <div>Profile Image</div>
                <br />
                <input type="file" accept='image/*' onChange={handleImageChanges} />
            </div>
            <br /><br />
            <div>
                <button onClick={getUserInfo}>Get User Info</button>
            </div>
        </>
    )
}
