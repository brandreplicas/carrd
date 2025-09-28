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
    var volumeSlider = null;

    let currentIndex = (parseInt(localStorage.getItem("mp3_currentIndex"))||0);
    let savedVolume = (parseFloat(localStorage.getItem("mp3_volume"))||0.5);

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
      if(!audioPlayer){
        return;
      }
      document.querySelector('#player-ui').classList.remove('d-none');
      playPauseButton = document.querySelector("#player-controls button:nth-child(2)");
      volumeSlider = document.getElementById("volumeControl");
      audioPlayer.volume = savedVolume;

      loadSong(currentIndex);
      audioPlayer.pause();
      audioPlayer.loop = true;
      playPauseButton.innerHTML = playLabel;

      // When a song ends, move to the next song automatically
      audioPlayer.addEventListener("ended", () => {
        nextSong();
      });

      volumeSlider.addEventListener("input", function() {
        audioPlayer.volume = this.value;
      });
    });


    // Play or pause the audio
    function togglePlayPause() {
      if(audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.innerHTML = pauseLabel;
      } else {
        audioPlayer.pause();
        playPauseButton.innerHTML = playLabel;
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
      playPauseButton.innerHTML = pauseLabel;
    }

    window.addEventListener("beforeunload", () => {
      localStorage.setItem("mp3_currentIndex", currentIndex);
      localStorage.setItem("mp3_volume", audioPlayer?.volume);
    });
