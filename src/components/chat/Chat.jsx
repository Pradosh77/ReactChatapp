import { useEffect, useRef, useState } from "react";
import "./chat.css"
import EmojiPicker from "emoji-picker-react" 
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../Library/firebase";
import { useSelector } from "react-redux";

const Chat =() => {

    const chatId = useSelector((state) => state.chat.chatId)

    const [chat,setChat] = useState();

    const [openEmojiPicker,setOpenEmojiPicker] = useState(false)

    const [msgText,setMsgtext] = useState("")

    const handelEmojiClick = (e) => {
        setMsgtext((prev) => prev + e.emoji)
    }

    const endRef = useRef(null)

    useEffect(()=>{
        endRef.current?.scrollIntoView({behavior : "smooth"})
    })

    useEffect(() => {
        const unSub = onSnapshot(
            doc(db, "chats", chatId),
            (res) => {
                setChat(res.data());
            }
        );

        return () => {
            unSub();
        }
    }, [chatId])

    console.log(chat);

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src="./avatar.png" alt="" />
                    <div className="tex">
                        <span>Abcd xyz</span>
                        <p>Lorem ipsum </p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
                {chat?.message?.map((message) => {
                    <div className="message" key={message?.createdAt}>
                        <div className="texts">
                            <p>{message?.text}</p>
                            {/* <span>{}</span> */}
                        </div>
                    </div>
                })}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <img src="./img.png" alt="" />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                    <input type="text"
                     placeholder="Type a message..."
                     value={msgText}
                     onChange={(e) => setMsgtext(e.target.value)}
                     />
                    <div className="emoji">
                        <img 
                         src="./emoji.png"
                         alt="" 
                         onClick={()=>setOpenEmojiPicker((prev) => !prev)}
                        />
                        <div className="picker">
                            <EmojiPicker open={openEmojiPicker} onEmojiClick={handelEmojiClick}/>
                        </div>
                    </div>
                    <button className="sendButton">Send</button>
            </div>
        </div>
    );
}

export default Chat;