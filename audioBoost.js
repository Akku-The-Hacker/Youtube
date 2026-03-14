const boostSlider =
document.getElementById("boostSlider");

const boostValue =
document.getElementById("boostValue");

const warning =
document.getElementById("boostWarning");

const audioContext =
new AudioContext();

const source =
audioContext.createMediaElementSource(video);

const gainNode =
audioContext.createGain();

source.connect(gainNode);

gainNode.connect(audioContext.destination);

video.addEventListener("play",()=>{

if(audioContext.state==="suspended"){
audioContext.resume();
}

});

boostSlider.addEventListener("input",()=>{

let boost =
parseFloat(boostSlider.value);

gainNode.gain.value = boost;

boostValue.innerText =
Math.round(boost*100)+"%";

if(boost>3){

warning.innerText =
"High audio boost may distort audio";

}
else{

warning.innerText="";

}

});
