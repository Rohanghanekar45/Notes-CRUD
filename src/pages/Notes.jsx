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
  const [selectedNote, setSelectedNote] = useState(null);


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
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition max-h-64 flex flex-col"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {note.title}
            </h3>

            <div className="mt-2 text-gray-600 line-clamp-4 whitespace-pre-wrap">
  {note.content}
</div>

            {note.content.length > 150 && (
  <button
    onClick={() => setSelectedNote(note)}
    className="text-sm text-green-600 mt-2 hover:underline"
  >
    View more
  </button>
)}

            <div className="flex justify-end gap-4 mt-auto pt-4">
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
    {selectedNote && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative shadow-lg">
      <button
        onClick={() => setSelectedNote(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
      >
        ×
      </button>

      <h3 className="text-2xl font-semibold mb-4">
        {selectedNote.title}
      </h3>

      <div className="max-h-96 overflow-y-auto whitespace-pre-wrap text-gray-700">
        {selectedNote.content}
      </div>
    </div>
  </div>
)}

  </div>
);

};

export default Notes;
