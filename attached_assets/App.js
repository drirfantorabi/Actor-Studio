
import React, { useState } from 'react';
import { Howl } from 'howler';
import './App.css';

const dialogueData = [
  { id: 1, speaker: 'Ali', audio: '/audio/ali1.mp3' },
  { id: 2, speaker: 'Ayşe', audio: '/audio/ayse1.mp3' },
  { id: 3, speaker: 'Ali', audio: '/audio/ali2.mp3' },
  { id: 4, speaker: 'Ayşe', audio: '/audio/ayse2.mp3' }
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState('Ali');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setIsPlaying(false);
  };

  const playAudio = (url) => {
    const sound = new Howl({ src: [url], html5: true });
    sound.play();
    sound.on('end', () => handleNext());
  };

  const handlePlay = () => {
    const current = dialogueData[currentIndex];
    if (!current) return;
    if (current.speaker === selectedRole) {
      alert(`It's your turn: ${current.speaker}. Please say your line out loud and click 'Next' when ready.`);
    } else {
      setIsPlaying(true);
      playAudio(current.audio);
    }
  };

  return (
    <div className="App">
      <h2>Theater Rehearsal Tool</h2>

      <label>Select Your Role:</label>
      <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
        <option value="Ali">Ali</option>
        <option value="Ayşe">Ayşe</option>
      </select>

      <div style={{ marginTop: '20px' }}>
        {currentIndex < dialogueData.length ? (
          <>
            <p><b>Now Speaking:</b> {dialogueData[currentIndex].speaker}</p>
            <button onClick={handlePlay} disabled={isPlaying}>Play</button>
            {dialogueData[currentIndex].speaker === selectedRole && (
              <button onClick={handleNext}>Next</button>
            )}
          </>
        ) : (
          <p>Rehearsal complete.</p>
        )}
      </div>
    </div>
  );
}

export default App;
