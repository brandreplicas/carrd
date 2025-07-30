    const playlist = [
      "songs-1.mp3",
      "songs-2.mp3",
      "songs-3.mp3",
      "songs-4.mp3",
      "songs-5.mp3",
      "songs-6.mp3",
      "songs-7.mp3",
      "songs-8.mp3",
      "songs-9.mp3",
      "songs-10.mp3",
      "songs-11.mp3",
      "songs-12.mp3",
      "songs-13.mp3",
      "songs-14.mp3",
      "songs-15.mp3",
      "songs-16.mp3",
      "songs-17.mp3",
      "songs-18.mp3",
      "songs-19.mp3"
    ];

    const playLabel = "&#9654;";
    const pauseLabel = "&#10074;&#10074;";
    var audioPlayer = null;
    var playPauseButton = null;

    let currentIndex = localStorage.getItem("mp3_currentIndex") 
                         ? parseInt(localStorage.getItem("mp3_currentIndex"))
                         : 0;
    let wasPlaying = localStorage.getItem("mp3_wasPlaying") === "true";
    let savedTime = localStorage.getItem("mp3_currentTime") 
                         ? parseFloat(localStorage.getItem("mp3_currentTime"))
                         : 0;


    function loadSong(index) {
      // Ensure index is within bounds
      if(index < 0 || index >= playlist.length) return;
      currentIndex = index;
      localStorage.setItem("mp3_currentIndex", currentIndex);
      audioPlayer.src = 'assets/audios.in/'+playlist[currentIndex];
      audioPlayer.currentTime = 0;
    }

    // Set up the audio element when the page loads
    window.addEventListener("load", () => {
      audioPlayer = document.getElementById("audioPlayer");
      audioPlayer.loop = true;
      playPauseButton = document.querySelector("#player-controls button:nth-child(2)");
      loadSong(currentIndex);
      // Restore last time if available
      if(savedTime) {
        audioPlayer.currentTime = savedTime;
      }
      if(wasPlaying) {
        audioPlayer.play();
        playPauseButton.innerHTML = pauseLabel;
      } else {
        playPauseButton.innerHTML = playLabel;
      }

      // Update persistent current time regularly
      audioPlayer.addEventListener("timeupdate", () => {
        localStorage.setItem("mp3_currentTime", audioPlayer.currentTime);
      });

      // When a song ends, move to the next song automatically
      audioPlayer.addEventListener("ended", () => {
        //nextSong();
      });
    });


    // Play or pause the audio
    function togglePlayPause() {
      if(audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.innerHTML = pauseLabel;
        localStorage.setItem("mp3_wasPlaying", "true");
      } else {
        audioPlayer.pause();
        playPauseButton.innerHTML = playLabel;
        localStorage.setItem("mp3_wasPlaying", "false");
      }
    }

    // Play next song; if loop is enabled, restart playlist
    function nextSong() {
      let nextIndex = currentIndex + 1;
      if(nextIndex >= playlist.length) {
        // If looping is enabled, reset to 0, otherwise do nothing
        if(audioPlayer.loop) {
          nextIndex = 0;
        } else {
          // End of playlist, so pause playback.
          audioPlayer.pause();
          playPauseButton.innerHTML = playLabel;
          return;
        }
      }
      loadSong(nextIndex);
      audioPlayer.play();
      localStorage.setItem("mp3_wasPlaying", "true");
      playPauseButton.innerHTML = pauseLabel;
    }

    // Play previous song
    function prevSong() {
      let prevIndex = currentIndex - 1;
      if(prevIndex < 0) {
        prevIndex = 0;
      }
      loadSong(prevIndex);
      audioPlayer.play();
      localStorage.setItem("mp3_wasPlaying", "true");
      playPauseButton.innerHTML = pauseLabel;
    }

    window.addEventListener("beforeunload", () => {
      localStorage.setItem("mp3_currentIndex", currentIndex);
      localStorage.setItem("mp3_currentTime", audioPlayer.currentTime);
      localStorage.setItem("mp3_wasPlaying", !audioPlayer.paused);
    });