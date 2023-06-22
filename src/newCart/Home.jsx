import React, { useRef, useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import firebaseConfig from './config';
import dummy from './dummyimageFirebase.png';
import 'react-image-crop/dist/ReactCrop.css';

const app = initializeApp(firebaseConfig);
export default function Home() {

    const db = getFirestore(app);

    const [name, setname] = useState('');
    const [newDummy, setDummy] = useState(dummy);
    const infoCenter = useRef(null);
    const arrayStore = useRef(null);
    const [uploadedImage, setImage] = useState(null);
    const [loading, setLoading] = useState(true);

    const auth = getAuth(app);
    const storage = getStorage(app);

    const obj = [
        {
            name: "Ankit Singh Chauhan",
            class: "12th"
        },
        {
            name: "Manish Singh Chauhan",
            class: "11th",
        },
        {
            name: "Nitin Chauhan",
            class: "13th"
        }
    ]

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {

                console.log("this is the user-> ", user);
                console.log("op anku -> ", user.arrayOfObject);

                const areYaar = parseInt(user.reloadUserInfo.lastLoginAt)
                const lastLoginDate = new Date(areYaar);
                const formattedLastLogin = lastLoginDate.toDateString();

                setDummy(user.photoURL);
                setname(user.displayName);
                setLoading(false);

                getCollection();

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
                const url = await getDownloadURL(storageRef);

                await updateProfile(auth.currentUser, { photoURL: url });
                try {
                    toast.success('Image updated', { autoClose: 1500 });
                    window.location.reload();
                }
                catch (err) {
                    toast.error('Something went wrong', { autoClose: 1500 });
                }
            } catch (err) {
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
    };

    const createUserCollection = async (user, name) => {
        const docRef = doc(db, 'objUser', user.uid);
        await setDoc(docRef, {
            uid: user.uid,
            email: user.email,
            name: name,
            arrayOfObject: obj
        });
    };


    // todo :i this is the second thing

    // const getCollection = async () => {
    //     const user = auth.currentUser;
    //     const docRef = doc(db, "objUser", user.uid);
    //     const docSnap = await getDoc(docRef);
    //     if(user){
    //         let objArray =  docSnap.data().arrayOfObject;
    //         let tempHTML = ""
    //         objArray.forEach((e) => {
    //             tempHTML+=
    //                 `
    //             <div className="info"><b>Name : ${e.name} </b></div>
    //             <div className="info"><b>Class : ${e.class} </b></div>
    //             `
    //         })
    //         arrayStore.current.innerHTML = tempHTML
    //     }
    //     else{
    //         toast.error("Please login first-> " , {autoClose:1500})
    //     }
    // }

    // todo : adding shit

    const handleAdding = async () => {
        console.log("trying to add data right now");
        onAuthStateChanged(auth, (user) => {
            if (user) {
                createUserCollection(user, user.displayName);
                toast.success("creadted", { autoClose: 1500 });
            }
        });
    }

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
                    </>
                    )
            }
        </>
    );
}
