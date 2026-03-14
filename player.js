const video =
document.getElementById("videoPlayer");

const playBtn =
document.getElementById("playBtn");

const urlInput =
document.getElementById("urlInput");

const speedSlider =
document.getElementById("speedSlider");

function extractID(url){

let reg =
/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&]+)/;

let match = url.match(reg);

return match ? match[1] : null;

}

playBtn.onclick = () => {

let url = urlInput.value;

let id = extractID(url);

if(!id){

alert("Invalid link");

return;

}

video.src =
"https://yewtu.be/latest_version?id=" +
id +
"&itag=18";

video.play();

};

speedSlider.addEventListener(
"input",
()=>{
video.playbackRate =
parseFloat(speedSlider.value);
});
