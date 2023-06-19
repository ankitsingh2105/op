import React, { useRef, useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
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
    const [loading, setLoading] = useState(true);

    const auth = getAuth(app);
    const storage = getStorage(app);

    console.log("welcome inspector 👋")

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {

                const areYaar = parseInt(user.reloadUserInfo.lastLoginAt)
                const lastLoginDate = new Date(areYaar);
                const formattedLastLogin = lastLoginDate.toDateString();

                setDummy(user.photoURL);
                setname(user.displayName);
                setLoading(false);

                infoCenter.current.innerHTML = `
                <br/>
                <div class="info"><b>Name:</b> &nbsp; ${user.displayName}</div>
                <br/>
                <div class="info"><b>Gmail:</b> &nbsp; ${user.email}</div>
                <br/>
                <div class="info"><b>Last Login:</b> &nbsp; ${formattedLastLogin}</div>
                <br/>
                `;
            }
            setLoading(false);
        });
    }, [loading]);


    const handleUploading = async () => {
        if (uploadedImage) {
            console.log('uploading starts');
            const user = auth.currentUser;
            if (!user) {
                toast.error('Please login', { autoClose: 1500 });
            }
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
                try {
                    toast.success('Image updated', { autoClose: 1500 });
                    window.location.reload();
                }
                catch (err) {
                    toast.error('Something went wrong', { autoClose: 1500 });
                }
            } catch (err) {
                console.log('Error uploading blob or file:', err);
                toast.error('Photo not updated', { autoClose: 1500 });
            }
        }
        else {
            toast.error("No image selected", { autoClose: 1500 });
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

    useEffect((e) => {
        // console.log("shit-> ", loading);
    }, [loading]);

    return (
        <>
            {
                loading ?
                    (<h1 id="spinner"></h1>) :
                    (<>
                        <div>
                            <br />
                            <h1>Welcome <br /> {name}👋</h1>
                            <img src={newDummy} alt="" />
                            <div><b>Picture</b></div>
                            <div id="info" ref={infoCenter}></div>
                        </div>
                        <div>
                            <div>
                                <br />
                                <input type="file" accept="image/*" onChange={handleImageChanges} />
                            </div>
                            <br />
                            <button onClick={handleUploading}>Upload New Image</button>
                        </div>
                        <br />
                        <div>
                            <button onClick={getUserInfo}>Get User Info <small>(not for you)</small> </button>
                        </div>
                    </>
                    )
            }
        </>
    );
}
