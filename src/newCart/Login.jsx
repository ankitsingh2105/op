import React from 'react'
import "./index.css"
import "./custom-toast.css"
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { toast } from 'react-toastify';
export default function Login() {

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login successful", { autoClose: 1500 });
            e.target.email.value = "";
            e.target.password.value = "";
        } catch (error) {
            toast.error("Invalid Credentials", { autoClose: 1500 });
        }
    }

    return (
        <>
            <h1>स्वागत है!</h1>
            <article>

                <form onSubmit={handleLogin} action="">
                    <div>
                        <div>
                            <div>Email</div>
                            <input placeholder="Email" name="email" type="email" />
                        </div>
                        <div>
                            <div>Password</div>
                            <input placeholder="Password" name="password" type="password" />
                        </div>
                        <br />
                        <button >Login</button>
                        <br />
                    </div>
                </form>
            </article>
        </>
    )
}
