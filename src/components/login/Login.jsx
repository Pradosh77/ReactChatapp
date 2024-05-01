import { useState } from "react"
import { toast } from "react-toastify"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../Library/firebase"
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"
import upload from "../../Library/upload"
import "./login.css"

const Login = () => {

    const [avatar,setAvatar] = useState({
        file: null,
        url:""
    })

    const[loading,setLoading] = useState(false)

    const handelAvatar = (e) => {
        if(e.target.files[0]){
            setAvatar({
                file: e.target.files[0],
                url : URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handelLogin = async(e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.target)

        const {email, password} = Object.fromEntries(formData);

        try{
            await signInWithEmailAndPassword(auth,email,password)

        }catch(err){
            console.log(err)
            toast.warn(err.message)
        }
        finally{
            setLoading(false)
        }
    }

    const handelRegister = async(e) => {
        e.preventDefault();
        setLoading(true)
        const formDate = new FormData(e.target)

        const { username, email, password } = Object.fromEntries(formDate);
        // VALIDATE INPUTS
        if (!username || !email || !password)
            return toast.warn("Please enter inputs!");
        if (!avatar.file){
            setLoading(false)
            return toast.warn("Please upload an avatar!");
        }

        // VALIDATE UNIQUE USERNAME
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            setLoading(false)
            return toast.warn("Select another username");
        }


        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)

            const imgUrl = await upload(avatar.file);           

            const userData = {
                username: username,
                email: email,
                id: res.user.uid,
                avatar:imgUrl,
                blocked: []
            };
            
            if (imgUrl != "") {
                userData.avatar = imgUrl;
            }
            await setDoc(doc(db, "users", res.user.uid), userData);
            if (imgUrl) {
                userData.avatar = imgUrl;
            }

            await setDoc(doc(db, "userchats", res.user.uid), {
                chat: [],
            });

              toast.success("Account Created! You can login now")

        }catch(err){
            console.log(err)
            toast.error(err.message)
        }finally{
            setLoading(false)
        }
    }

    return(
        <div className="login">
            <div className="item">
                <h2>Welcome back,</h2>
                <form onSubmit={handelLogin}>
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Passowrd" name="password" />
                    <button disabled={loading}>{loading? "Loading...": "Sign In"}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
                <h2>Create an Account</h2>
                <form action="" onSubmit={handelRegister}>
                    <label htmlFor="file" style={{ cursor: "pointer" }}>
                        <img src={avatar.url || "./avatar.png"} alt="" />
                        Upload an image
                    </label>
                    <input
                        type="file"
                        id="file"
                        accept=".jpeg, .jpg, .png"
                        style={{ position: "absolute", visibility: "hidden" }}
                        onChange={handelAvatar}
                    />
                    <input type="text" placeholder="Username" name="username"/>
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Passowrd" name="password" />
                    <button disabled={loading}>{loading? "Loading...": "Sign Up"}</button>
                </form>
            </div>
        </div>
    )
}

export default Login