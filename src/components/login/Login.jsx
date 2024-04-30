import { useState } from "react"
import { toast } from "react-toastify"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../Library/firebase"
import { doc, setDoc } from "firebase/firestore"
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

        const {username, email, password} = Object.fromEntries(formDate);

        try{
            const res = await createUserWithEmailAndPassword(auth,email,password)

            const imgUrl = "";
            if(avatar.file)
                imgUrl = await upload(avatar.file);

            const userData = {
                username: username,
                email: email,
                id: res.user.uid,
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