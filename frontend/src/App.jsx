import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"

function App() {
  // No overflow:hidden here — the body must be able to scroll
  // so GSAP ScrollTrigger can accumulate scroll distance for pinning.
  return (
    <div style={{ width: '100%', background: '#000' }}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
