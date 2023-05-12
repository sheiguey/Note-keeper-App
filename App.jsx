import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore"
import { db, notesCollection } from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText,setTempNoteText] = React.useState("")
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)
    
    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

    React.useEffect(() => {
      const unSubscribe = onSnapshot(notesCollection,(snapshot)=>{
           const noteArr = snapshot.docs.map(doc=>({
            ...doc.data(),
            id:doc.id
           }))

           setNotes(noteArr)
      })

      return unSubscribe
    }, [])

    React.useEffect(()=>{
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    },[notes])

    React.useEffect(() => {
        if (currentNote) {
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])
    

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body) {
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])



   async function createNewNote() {
      
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt : Date.now(),
            updatedAt :Date.now()
        }
        
       const newNoteRef = await addDoc(notesCollection,newNote)
        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        
        const docRef= doc(db,"Notes",currentNoteId);
        await setDoc(docRef,{body:text,updatedAt :Date.now()},{merge:true})
    }

   async function deleteNote(noteId) {
        const docRef= doc(db,"Notes",noteId);
        await deleteDoc(docRef);
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                       
                           
                            <Editor
                                tempNoteText={tempNoteText}
                                setTempNoteText={setTempNoteText}
                            />
                        
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
