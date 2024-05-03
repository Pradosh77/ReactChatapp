import { useDispatch, useSelector } from "react-redux"
import { auth, db } from "../../Library/firebase"
import "./detail.css"
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"
import { changeBlock, resetChat } from "../../Library/Store/chatSlice"


const Detail = () => {

    const { chatId ,user ,isCurrentUserBlocked, isReceiverBlocked} = useSelector((state) => state.chat)
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch()
    const handleBlock = async() => {
        if(!user)
            return;

        const userDocRef = doc(db,"users",currentUser.id)
        
        try{
            await updateDoc(userDocRef,{
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            })

            dispatch(changeBlock());

        }catch(err){
            console.log(err)
        }
    }

    const handelLogout = () => {
        auth.signOut()
        resetChat()
    }

    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <h2>{user?.username}</h2>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg" alt="" />
                                <span>photo name</span>
                            </div>
                            <img src="./download.png" alt="" className="icon"/>
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg" alt="" />
                                <span>photo name</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg" alt="" />
                                <span>photo name</span>
                            </div>
                            <img src="./download.png" alt=""  className="icon"/>
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                </div>
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column" }}>
                    <button onClick={handleBlock}>
                        {isCurrentUserBlocked
                            ? "You are Blocked!"
                            : isReceiverBlocked
                                ? "User blocked"
                                : "Block User"}
                    </button>
                    <button className="logout" onClick={handelLogout}>Log Out</button>
                </div>
            </div>
        </div>
    )
}

export default Detail