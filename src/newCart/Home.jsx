import React, { useRef, useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import firebaseConfig from './config';
import dummy from './dummyimageFirebase.png';

const app = initializeApp(firebaseConfig);

export default function Home() {
    const [name, setname] = useState('');
    const [newDummy, setDummy] = useState(dummy);
    const infoCenter = useRef(null);
    const [uploadedImage, setImage] = useState(null);
    const [loading, setloading] = useState(false);

    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                infoCenter.current.innerHTML = `
                <br/>
                <div>Name: ${user.displayName}</div>
                <br/>
                <div>Email: ${user.email}</div>
                <br/>
                <br/>
                `;
                setDummy(user.photoURL);
                setname(user.displayName);
                console.log("in");
            }
            
            else {
                console.log('user is out');
            }
        });
    },[auth]);

    const handleUploading = async () => {
        if (uploadedImage) {
            console.log('uploading starts');
            const user = auth.currentUser;
            const storageRef = ref(
                storage,
                `images/${user.uid + ' - ' + user.email}/${uploadedImage.name}`
            );

            try {
                await uploadBytes(storageRef, uploadedImage);
                console.log('image uploaded to server');
                const url = await getDownloadURL(storageRef);
                console.log('url inside the try -> ', url);

                await updateProfile(auth.currentUser, { photoURL: url });
                toast.success('photo updated', { autoClose: 1500 });
                window.location.reload();
            } catch (err) {
                console.log('Error uploading blob or file:', err);
                toast.error('Photo not updated', { autoClose: 1500 });
            }
        } 
        else {
            toast.error("no image selected", { autoClose: 1500 });
        }
    };

    const handleImageChanges = (e) => {
        const photo = e.target.files[0];
        setImage(photo);
        console.log('Selected image:', photo);
    };

    const getUserInfo = () => {
        const user = auth.currentUser;
        if (user) {
            console.log('Current user:', user);
        }
    };

    return (
        <>
            {
                loading ?
                    (<h1>....loading</h1>) :
                    (<>
                        <div>
                            <h1>Welcome</h1>
                            <div id="info" ref={infoCenter}></div>
                        </div>
                        <div>
                            <img src={newDummy} alt="" />
                            <br />
                            <div>Profile Image</div>
                            <br />
                            <input type="file" accept="image/*" onChange={handleImageChanges} />
                            <br />
                            <button onClick={handleUploading}>Upload New Image</button>
                        </div>
                        <br />
                        <br />
                        <div>
                            <button onClick={getUserInfo}>Get User Info</button>
                        </div>
                    </>
                    )
            }
        </>
    );
}
