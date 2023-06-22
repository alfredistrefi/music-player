import React, { useState, useEffect } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEllipsisV, faHeart, faBackward, faPlay, faForward, faAngleUp, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import './App.css';

// Add the required Font Awesome icons to the library
library.add(faChevronLeft, faEllipsisV, faHeart, faBackward, faPlay, faForward, faAngleUp, faChevronRight);

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = React.useRef(null);

  // Function to fetch songs from Spotify API
  const fetchData = async () => {
    try {
      const clientId = 'c881de79492a4845d8de937779a7fe902';
      const clientSecret = 'f213a92a254849f75a6572355b4bf43d0';
      const authEndpoint = 'https://accounts.spotify.com/api/token';
      const apiEndpoint = 'https://api.spotify.com/v1/playlists/1qFYv9j9Y9Iqeq6UJOtlti/tracks';

      // Fetch access token
      const tokenResponse = await fetch(authEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        },
        body: 'grant_type=client_credentials'
      });

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Fetch songs using access token
      const response = await fetch(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const data = await response.json();
      setSongs(data.items); // Update the state with the fetched songs
    } catch (error) {
      console.log('Error', error);
    }
  };

  // Fetch songs when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Play or pause the audio when the 'isPlaying' state changes
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Function to handle play/pause button click
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Function to handle song change
  const handleSongChange = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true); // Auto-play the selected song
  };

  // Function to handle previous song button click
  const handlePreviousSong = () => {
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) {
      newIndex = songs.length - 1;
    }
    setCurrentSongIndex(newIndex);
    setIsPlaying(true);
  };

  // Function to handle next song button click
  const handleNextSong = () => {
    let newIndex = currentSongIndex + 1;
    if (newIndex >= songs.length) {
      newIndex = 0;
    }
    setCurrentSongIndex(newIndex);
    setIsPlaying(true); // Auto-play the selected song
  };

  return (
    <div className='appi'>
      <h1>Music Player</h1>
      <div className="album-cover">
        <div className="album-overlay"></div>
        {songs.length > 0 && (
          <img src={songs[currentSongIndex]?.track?.album?.images[0]?.url} alt="" />
        )}
        <div className="container">
          <button onClick={handlePreviousSong} className="button">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button onClick={handlePlayPause} className={`button-play ${isPlaying ? 'playing' : ''}`}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={handleNextSong} className="button">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
      
      <ul className='list'>
        {songs.map((song, index) => (
          <li key={song.track.id}>
            <h3>{song.track.name}</h3>
            <button className='button-play-main' onClick={() => handleSongChange(index)}>
              ▶
            </button>
          </li>
        ))}
      </ul>
      {songs.length > 2 && (
        <audio ref={audioRef} src={songs[currentSongIndex]?.track?.preview_url}></audio>
      )}
    </div>
  );
}

export default App;
