import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, googleAuth } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { ChatRoom } from "./ChatRoom";
import { useState } from "react";

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const toggleProfileInfo = () => {
    setShowProfileInfo(!showProfileInfo);
  };

  console.log(user);
  if (loading) {
    return (
      <div>
        <p>로딩중...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        {user && (
          <>
            <div
              className="profile-info"
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "10px",
              }}
              onMouseEnter={toggleProfileInfo}
              onMouseLeave={toggleProfileInfo}
            >
              <img
                src={user.photoURL}
                alt="프로필 사진"
                style={{
                  width: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                  marginLeft: "200px",
                }}
              />
              {showProfileInfo && (
                <div className="user-info">
                  <p>사용자 아이디: {user.displayName}</p>
                  {/* 다른 프로필 정보를 표시할 수도 있음 */}
                </div>
              )}
            </div>
            <SignOut />
          </>
        )}
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <p>🌱 커뮤니티에서 예의를 지켜주세요 😁</p>
    </>
  );
}

function SignOut() {
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button className="sign-out" onClick={logout}>
      Sign Out
    </button>
  );
}
export default App;
