import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteNote, getMyNotes, searchNotes } from "../services/notesService";
import NoteCard from "../components/notes/NoteCard";
import CreateNote from "./CreateNote";

const DashboardPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const fetchNotes = async () => {
    try {
      const data = await getMyNotes();
      setNotes(data.notes || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load notes.");
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note:", err);
      setError("Failed to delete note.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchNotes();
      return;
    }

    try {
      const data = await searchNotes(searchQuery);
      setNotes(data.notes || []);
    } catch (err) {
      console.error("Failed to search notes:", err);
      setError("Failed to search notes.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loadingNotes)
    return (
      <div className="text-center mt-10 text-xl">Loading user notes...</div>
    );
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    
    <div className="max-w-screen mx-auto px-4 py-8 " style={{
      backgroundImage:
        "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlA-1KpPQlcGZaxo9hMzeAGLFh0t-z62UU7A&s')", // พื้นหลัง Akatsuki (ใช้ลิงก์อื่นได้)
    }}>
      <h1 className="text-3xl font-bold mb-6 text-amber-50">
        Welcome, {user?.fullName || "User"} 👋
      </h1>

      {/* ✅ Audio player */}
      <audio autoPlay loop>
        <source src="public/audio/02 - MONEY.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6  text-white">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes by title, content, or tags"
          className="w-full border px-3 py-2 rounded-md"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* Button to Open Modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
      >
        Create Note
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)} // Close modal when clicking on the backdrop
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <CreateNote
              onNoteAdded={() => {
                fetchNotes();
                setIsModalOpen(false); // Close modal after note is added
              }}
            />
          </div>
        </div>
      )}

      {Array.isArray(notes) && notes.length === 0 ? (
        <p className="text-gray-600">You have no notes yet. Start writing!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={handleDeleteNote} />
          ))}
        </div>
      )}
    </div>
  );
  
};

export default DashboardPage;
