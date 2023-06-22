import React from 'react'
import "./index.css"
import "./custom-toast.css"
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { toast } from 'react-toastify';
export default function Login() {
    const auth = getAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login successful", { autoClose: 1500 });
            e.target.email.value = "";
            e.target.password.value = "";
            window.location.href = "/";
        } catch (error) {
            toast.error("Invalid Credentials", { autoClose: 1500 });
        }
    }

    const createUserCollection = async (user) => {
        const docRef = doc(db, 'newUser', user.uid);
        await setDoc(docRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
        });
      };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
        const signgoogle = await signInWithPopup(auth, provider)
          createUserCollection(signgoogle.user);
          toast.success("Google Authentication Successful", { autoClose: 1500 });
          window.location.href = "/";
        }
        catch (err) {
          toast.error("Somethign went wrong", { autoClose: 1500 });
        }
      }


    return (
        <>
            <h1>स्वागत है!</h1>
            <article>

                <form onSubmit={handleLogin} action="">
                    <div>
                        <div>
                            <div><b>Email</b></div>
                            <input placeholder="Email" name="email" type="email" />
                        </div>
                        <div>
                            <div><b>Password</b></div>
                            <input placeholder="Password" name="password" type="password" />
                        </div>
                        <br />
                        <button>Login</button>
                        <br />
                    </div>
                </form>
            </article>
            <br />
            <h3>OR</h3>
            <br />
            <article>
                <div style={{padding : "1rem 0rem"}} >
                <button onClick={handleGoogleLogin}>Login with google</button>
                </div>
            </article>
        </>
    )
}
