import { StrictMode, lazy, Suspense } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import NotesList from './NotesList'
import NoteDetail from './NoteDetail'

// Lazy load showcase component for better performance
const EditorShowcaseStatic = lazy(() => import('./components/EditorShowcaseStatic'))

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

      {/* Showcase route - no StrictMode for editor compatibility */}
      <Route path="/showcase" element={
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Loading showcase...</div>}>
          <EditorShowcaseStatic />
        </Suspense>
      } />
    </Routes>
  )
}

export default App