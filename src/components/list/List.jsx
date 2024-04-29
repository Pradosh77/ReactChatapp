import Userinfo from "./userInfo/Userinfo.jsx"
import Chatlist from "./chatList/Chatlist.jsx"
import "./list.css"

const List = () => {
    return (
        <div className="list">
            <Userinfo/>
            <Chatlist/>
        </div>
    )
}

export default List