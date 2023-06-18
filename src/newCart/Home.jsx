import React, { useState } from 'react'
import { initializeApp } from 'firebase/app';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyCFVxCioGK8yRArkJOMGsBQOSo95xdwyeA",
    authDomain: "inbound-ranger-375215.firebaseapp.com",
    projectId: "inbound-ranger-375215",
    storageBucket: "inbound-ranger-375215.appspot.com",
    messagingSenderId: "620360233615",
    appId: "1:620360233615:web:187bdeee983f8bb0bf36fa"
};
export default function Home() {
    const [name, setname] = useState("")
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setname(user.displayName);
        } else {
            console.log("user is out ");
        }
    });
    return (
        <div>
            <h1>Welcome {name} 👋</h1>
            {/* <h1>{name}</h1> */}
        </div>
    )
}
