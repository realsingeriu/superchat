import { useEffect, useRef, useState } from "react";
import { auth, db } from "./firebase";
import {
  query,
  collection,
  orderBy,
  limit,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export function ChatRoom() {
  const dummy = useRef(); // html을 선택하기 위한 객체
  const [formValue, setFormValue] = useState("");

  const messagesRef = collection(db, "messages"); // 파이어스토어DB에 messages 컬렉션
  const q = query(messagesRef, orderBy("createdAt"), limit(25));
  const [messages] = useCollectionData(q); // 실시간 메세지들을 가져옴

  const sendMessage = async (e) => {
    e.preventDefault();
    // auth.currentUser 하면 유저 정보가 나온다.
    const { uid, photoURL } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue(""); // 메세지 전송 후 입력값을 리셋
  };

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <main>
        {messages &&
          messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)}

        <span ref={dummy}></span>
      </main>
      {/*(하단) 메세지 입력창  */}
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="메세지를 입력하세요~"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  );
}
// 채팅 메세지 표시
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
        />
        <p>{text}</p>
      </div>
    </>
  );
}
