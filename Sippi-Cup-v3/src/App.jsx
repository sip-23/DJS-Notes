import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./components/Main.jsx"
import PodcastDetail from "./components/podcastDetails.jsx"
import Popular from "./components/Popular.jsx"
import Recommended from "./components/Recommended.jsx"
import { ThemeProvider } from './utilities/themeContext.jsx'
import { LayoutProvider } from './layout/LayoutContext.jsx'
import { AudioProvider } from './utilities/AudioContext.jsx'
import GlobalAudioPlayer from './components/AudioPlayer.jsx'

function App() {
  return (
    <ThemeProvider>
      <LayoutProvider>
        <AudioProvider>
          <Router>
            <div className="pb-32"> 
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/podcast/:id" element={<PodcastDetail />} />
                <Route path="/popular" element={<Popular />} />
                <Route path="/recommended" element={<Recommended />} />
              </Routes>
              <GlobalAudioPlayer />
            </div>
          </Router>
        </AudioProvider>
      </LayoutProvider>
    </ThemeProvider>
  )
}

export default App