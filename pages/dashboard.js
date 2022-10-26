import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Message from "../components/message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);

  const [post, setPost] = useState([]);

  // USER CHECK
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPost(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  // DELETE
  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  return (
    <div>
      <h1>Your Posts</h1>
      <div>
        {post.map((post) => (
          <Message {...post} key={post.id}>
            <div className="flex gap-2">
              <button
                onClick={() => deletePost(post.id)}
                className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
              >
                <BsTrash2Fill className="text-2xl" /> Delete
              </button>
              <Link href={{pathname: "/post", query: post}}>
                <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                  <AiFillEdit className="text-2xl" /> Edit
                </button>
              </Link>
            </div>
          </Message>
        ))}
      </div>
      <button
        onClick={() => auth.signOut()}
        className="font-medium text-white bg-gray-800 py-2 px-4 my-6 rounded-md"
      >
        Sign out
      </button>
    </div>
  );
}
