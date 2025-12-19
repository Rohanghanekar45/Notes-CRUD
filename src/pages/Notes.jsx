import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../components/firebase.js";
import { auth } from "../components/firebase.js";

const Notes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const user = auth.currentUser;

  // 🔹 Fetch notes
  const fetchNotes = async () => {
    if (!user) return;

    const notesRef = collection(db, "users", user.uid, "notes");
    const snapshot = await getDocs(notesRef);

    const notesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setNotes(notesData);
  };

  // 🔹 Add note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const notesRef = collection(db, "users", user.uid, "notes");

    await addDoc(notesRef, {
      title,
      content,
      createdAt: serverTimestamp(),
    });

    setTitle("");
    setContent("");
    fetchNotes();
  };

  // 🔹 Delete note
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "notes", id));
    fetchNotes();
  };

  // 🔹 Start editing
  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  // 🔹 Update note
  const handleUpdate = async () => {
    if (!editingId) return;

    const noteRef = doc(db, "users", user.uid, "notes", editingId);

    await updateDoc(noteRef, {
      title,
      content,
    });

    setEditingId(null);
    setTitle("");
    setContent("");
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
  <div className="max-w-4xl mx-auto mt-10">
    <h2 className="text-3xl font-bold mb-6 text-gray-800">
      My Notes 📝
    </h2>

    {/* Add / Edit Note */}
    <form
      onSubmit={editingId ? handleUpdate : handleAddNote}
      className="bg-white p-6 rounded-2xl shadow mb-10"
    >
      <input
        type="text"
        placeholder="Note title"
        className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Write your note here..."
        rows="4"
        className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="submit"
        className={`px-6 py-2 rounded-lg text-white font-medium transition ${
          editingId
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {editingId ? "Update Note" : "Add Note"}
      </button>
    </form>

    {/* Notes List */}
    {notes.length === 0 ? (
      <div className="text-center text-gray-500">
        <p>No notes yet.</p>
        <p className="text-sm mt-1">Start by adding one above ✨</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {note.title}
            </h3>

            <p className="text-gray-600 mt-2 whitespace-pre-wrap">
              {note.content}
            </p>

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => handleEdit(note)}
                className="text-blue-500 hover:underline text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(note.id)}
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

};

export default Notes;
