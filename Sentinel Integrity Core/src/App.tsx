
import { HashRouter, Route, Routes } from 'react-router'
import HomePage from './pages/Home'
import Sentinel from './pages/Sentinel'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sentinel" element={<Sentinel />} />
      </Routes>
    </HashRouter>
  )
}
