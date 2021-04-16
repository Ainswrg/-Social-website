import React from 'react';
import s from './Message.module.css';
import User from './User/User';
import UserResponder from './UserResponder/UserResponder';


const Message = (props) => {
   let messageData = props.dialogPage.messages.map(m => <UserResponder  message={m.message} time={m.time} />);
   let messageUserData = props.dialogPage.messageCurrentUser.map(m => <User message={m.message} time={m.time} />);

   let newMessageElement = React.createRef();

   let addMessage = () => {
      props.addMessage();
   }
   let messageTextChange = () => {
      let text = newMessageElement.current.value;
      props.updateNewMessageText(text);
   }
   return (
      <div>
         <div className={s.messages} >
            
            {messageData}
            {messageUserData}
            
         </div>
         <div className={s.input__block}>
            <textarea onChange={messageTextChange} ref={newMessageElement} value={props.newMessageText} className={s.input}></textarea>
            <div className={s.button}>
               <button onClick={addMessage} className={s.btn}>Send</button>
            </div>
         </div>
      </div>
   )
}

export default Message;