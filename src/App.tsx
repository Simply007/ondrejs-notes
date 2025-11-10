import { StrictMode } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import NotesList from './NotesList'
import NoteDetail from './NoteDetail'

function App() {
  return (
    <Routes>
      {/* StrictMode enabled for the notes list page */}
      <Route path="/" element={
        <StrictMode>
          <NotesList />
        </StrictMode>
      } />
      {/* No StrictMode for note editing page (contains Remirror) */}
      <Route path="/note/:id" element={<NoteDetail />} />
    </Routes>
  )
}

export default App