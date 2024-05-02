import { useEffect, useRef, useState } from "react";
import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import {
    arrayUnion,
    doc,
    getDoc,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";
import { db } from "../../Library/firebase";
import { useSelector } from "react-redux";
import upload from '../../Library/upload.js'

const Chat = () => {

    const chatId = useSelector((state) => state.chat.chatId)
    const user = useSelector((state) => state.chat.user)
    const isCurrentUserBlocked = useSelector((state) => state.chat.isCurrentUserBlocked)
    const isReceiverBlocked = useSelector((state) => state.chat.isReceiverBlocked)

    const currentUser = useSelector((state) => state.user.currentUser)

    const [chat, setChat] = useState();

    const [openEmojiPicker, setOpenEmojiPicker] = useState(false)

    const [msgText, setMsgtext] = useState("")

    const [img, setImg] = useState({
        file: null,
        url: "",
    });

    const handleEmojiClick = (e) => {
        setMsgtext((prev) => prev + e.emoji)
    }

    const handleImage = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat?.messages]);

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

    const handleSend = async () => {
        if (msgText === "") return;

        let imgUrl = null;

        try {
            if (img.file) {
                imgUrl = await upload(img.file);
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text: msgText,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                }),
            });

            const userIDs = [currentUser.id, user.id];

            userIDs.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex(
                        (c) => c.chatId === chatId
                    );

                    userChatsData.chats[chatIndex].lastMessage = msgText;
                    userChatsData.chats[chatIndex].isSeen =
                        id === currentUser.id ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            });
        } catch (err) {
            console.log(err);
        } finally {
            setImg({
                file: null,
                url: "",
            });

            setMsgtext("");
        }
    };

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src={currentUser.avatar || "./favicon.png"} alt="" />
                    <div className="text">
                        <span>{currentUser.username}</span>
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
                {chat?.messages?.map((message) => (
                    <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createdAt}>
                        <div className="texts">
                            <p>{message?.text}</p>
                            {/* <span>{}</span> */}
                        </div>
                    </div>
                ))}
                {img.url && (
                    <div className="message own">
                        <div className="texts">
                            <img src={img.url} alt="" />
                        </div>
                    </div>
                )}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file" style={{ cursor: "pointer" }}>
                        <img src="./img.png" alt="" />
                    </label>
                    <input
                        type="file"
                        id="file"
                        accept=".jpeg, .jpg, .png"
                        style={{ position: "absolute", visibility: "hidden" }}
                        onChange={handleImage}
                    />
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
                        onClick={() => setOpenEmojiPicker((prev) => !prev)}
                    />
                    <div className="picker">
                        <EmojiPicker open={openEmojiPicker} onEmojiClick={handleEmojiClick} />
                    </div>
                </div>
                <button className="sendButton" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}

export default Chat;