import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Message from "../components/message";
import { auth, db } from "../utils/firebase";

export default function Details() {
  const route = useRouter();
  const routeData = route.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  // ADD COMMENT
  const SubmitMessage = async () => {
    if (!auth.currentUser) return route.push("/auth/login");
    if (!message) {
      toast.error("Don't leave an empty message 🙂", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
    }

    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        timestamp: Timestamp.now(),
      }),
    });
    setMessage("");
  };

  // Get comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    })
    return unsubscribe;
  };

  useEffect(() => {
    if (!route.isReady) return;
    getComments();
  }, [route.isReady]);

  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="Send a message 😉"
            className="bg-gray-800 w-full p-2 text-white text-sm"
          />
          <button
            onClick={SubmitMessage}
            className="bg-cyan-400 text-white py-2 px-4 text-sm"
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessages?.map((message) => (
            <div className="bg-white p-4 my-4 border-2">
              <div className="flex items-center gap-2 mb-4">
                <img src={message.avatar} className="w-10 rounded-full"/>
                <h2>{message.username}</h2>
              </div>
              <h2>{message.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
