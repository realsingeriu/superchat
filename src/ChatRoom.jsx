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
    // auth.currentUser 하면 유저 정보를 가져온다.
    const { uid, photoURL, displayName } = auth.currentUser;

    // 현재 시간을 가져와 메세지와 함께 저장
    const createdAt = serverTimestamp(); // createdAt 추가
    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue(""); // 메세지 전송 후 입력값을 리셋
  };

  // 채팅 메세지가 자동으로 스크롤 메세지로 내려간다.
  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* main은 메세지가 나오는 화면 */}
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
  const { text, uid, photoURL, createdAt } = props.message; // 메세지 객체 분리
  // uid가 유저와 같으면 내가 쓴 메세지 sent, 다른 사람 메세지 received
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  // 사용자의 디스플레이 이름 가져오기
  const getDisplayName = () => {
    const googleProvider = auth.currentUser.providerData.find(
      (provider) => provider.providerId === "google.com"
    );

    return googleProvider
      ? googleProvider.displayName
      : auth.currentUser.displayName || uid;
  };

  const [displayName, setDisplayName] = useState(getDisplayName());

  // createdAt을 표시할 형식으로 포맷팅
  const formattedTime = createdAt
    ? new Date(createdAt.seconds * 1000).toLocaleString()
    : "";

  return (
    <>
      <p className="Date">({formattedTime})</p>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
        />
        <p>
          <strong>{displayName}</strong>: {text}
        </p>
      </div>
    </>
  );
}
