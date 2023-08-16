import "./App.css";
import { useMemo, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import NewNote from "./NewNote";
import ShowNotes from "./ShowNotes";
import useLocalStorage from "./useLocalStorage";
import { v4 as uuidV4 } from "uuid";
import NoteCard from "./NoteCard";
import HomePage from "./HomePage";
import NotesLayout from "./NotesLayout";
import EditNote from "./EditNote";
function App() {
  const [notes, setNotes] = useLocalStorage("NOTES", []);
  const [tags, setTags] = useLocalStorage("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);
  const onCreateNotes = ({ tags, ...data }) => {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        {
          ...data,
          id: uuidV4(),
          tagIds: tags.map((tag) => tag.id),
        },
      ];
    });
  };
  const updateNotes = ({ id, tags, ...data }) => {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            tagIds: tags.map((tag) => tag.id),
            ...data,
          };
        } else return note;
      });
    });
  };
  const addTag = (newTag) => {
    setTags((prev) => [...prev, newTag]);
  };
  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={<HomePage availableTags={tags} notes={notesWithTags} />}
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNotes}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NotesLayout notes={notesWithTags} />}>
          <Route index element={<ShowNotes />} />
          <Route
            path="edit"
            element={
              <EditNote
                onUpdate={updateNotes}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
