let player;
let isPlayerReady = false;

// WebAudio API architecture elements
let audioContext;
let mediaElementSource;
let gainNode;

// DOM Elements
const urlInput = document.getElementById('url-input');
const playBtn = document.getElementById('play-btn');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const boostSlider = document.getElementById('boost-slider');
const boostValue = document.getElementById('boost-value');
const boostWarning = document.getElementById('boost-warning');
const playlistControls = document.getElementById('playlist-controls');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const videoTitle = document.getElementById('video-title');

// Initialize YouTube API
function onYouTubeIframeAPIReady() {
    isPlayerReady = true;
}

// Extract Video ID
function extractVideoID(url) {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
}

// Extract Playlist ID
function extractPlaylistID(url) {
    const regExp = /[?&]list=([^#\&\?]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

// Load Video or Playlist Handler
function loadVideo() {
    const url = urlInput.value.trim();
    if (!url) return;

    const playlistID = extractPlaylistID(url);
    const videoID = extractVideoID(url);

    if (!isPlayerReady) return;

    if (!player) {
        initializePlayer(videoID, playlistID);
    } else {
        if (playlistID) {
            loadPlaylist(playlistID);
        } else if (videoID) {
            player.loadVideoById(videoID);
            playlistControls.classList.remove('active');
        }
    }
}

// Initialize YouTube Player
function initializePlayer(videoID, playlistID) {
    const playerVars = {
        autoplay: 1,
        controls: 1,
        rel: 0
    };

    if (playlistID) {
        playerVars.listType = 'playlist';
        playerVars.list = playlistID;
    }

    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: playlistID ? undefined : videoID,
        playerVars: playerVars,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

    if (playlistID) {
        playlistControls.classList.add('active');
    }
}

// Load Playlist into existing player
function loadPlaylist(playlistID) {
    player.loadPlaylist({ list: playlistID, listType: 'playlist' });
    playlistControls.classList.add('active');
}

// YouTube Player Ready Callback
function onPlayerReady(event) {
    updatePlaybackSpeed();
    setupWebAudioArchitecture();
    event.target.playVideo();
}

// YouTube Player State Change Callback
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        const data = player.getVideoData();
        if (data && data.title) {
            videoTitle.textContent = data.title;
        }
        updatePlaybackSpeed();
    }
}

// Update Playback Speed
function updatePlaybackSpeed() {
    const rate = parseFloat(speedSlider.value);
    speedValue.textContent = rate.toFixed(2) + 'x';
    if (player && player.setPlaybackRate) {
        player.setPlaybackRate(rate);
    }
}

// Update Audio Boost
function updateAudioBoost() {
    const boostPercentage = parseInt(boostSlider.value, 10);
    boostValue.textContent = boostPercentage + '%';
    
    if (boostPercentage > 300) {
        boostWarning.style.display = 'block';
    } else {
        boostWarning.style.display = 'none';
    }

    // WebAudio API Architecture logic (Placeholder for DOM cross-origin integration)
    if (audioContext && gainNode) {
        const gainValue = boostPercentage / 100;
        gainNode.gain.setTargetAtTime(gainValue, audioContext.currentTime, 0.1);
    }
}

// WebAudio Architecture Setup (Ready for integration)
function setupWebAudioArchitecture() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
            
            // Note: True integration requires access to the iframe's internal video element 
            // which is restricted by CORS. The architecture below establishes the routing.
            /*
            const iframe = document.querySelector('iframe');
            // Assuming cross-origin resource sharing (CORS) is configured
            mediaElementSource = audioContext.createMediaElementSource(iframe.contentWindow.document.querySelector('video'));
            mediaElementSource.connect(gainNode);
            */
            
            updateAudioBoost();
        }
    } catch (e) {
        console.warn("WebAudio API setup incomplete due to browser/CORS restrictions.", e);
    }
}

// Event Listeners
playBtn.addEventListener('click', loadVideo);

urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadVideo();
    }
});

speedSlider.addEventListener('input', updatePlaybackSpeed);
boostSlider.addEventListener('input', updateAudioBoost);

prevBtn.addEventListener('click', () => {
    if (player && player.previousVideo) {
        player.previousVideo();
    }
});

nextBtn.addEventListener('click', () => {
    if (player && player.nextVideo) {
        player.nextVideo();
    }
});
