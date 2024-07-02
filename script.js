const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const controlsContainer = document.getElementById('controls');

const audioFiles = [
    { left: './audio/freya-1.mp3', right: './audio/tom-1.mp3' },
    { left: './audio/freya-2.mp3', right: './audio/tom-2.mp3' },
    { left: './audio/freya-3.mp3', right: './audio/tom-3.mp3' },
    { left: './audio/freya-4.mp3', right: './audio/tom-4.mp3' },
    { left: './audio/freya-5.mp3', right: './audio/tom-5.mp3' },
    { left: './audio/freya-6.mp3', right: './audio/tom-6.mp3' },
    { left: './audio/freya-7.mp3', right: './audio/tom-7.mp3' },
    { left: './audio/freya-8.mp3', right: './audio/tom-8.mp3' },
    { left: './audio/freya-9.mp3', right: './audio/tom-9.mp3' },
    { left: './audio/freya-10.mp3', right: './audio/tom-10.mp3' },
    { left: './audio/freya-11.mp3', right: './audio/tom-11.mp3' },
    { left: './audio/freya-12.mp3', right: './audio/tom-12.mp3' },
  ];
  

audioFiles.forEach((files, index) => {
  createAudioSource(files.left, files.right, index);
});

const activeSources = [];

function createAudioSource(leftFile, rightFile, index) {
  const sourceContainer = document.createElement('div');
  sourceContainer.className = 'audio-source';

  const playButton = document.createElement('button');
  playButton.textContent = `Play Step ${index + 1}`;
  playButton.onclick = () => playAudio(leftFile, rightFile, index);

  const stopButton = document.createElement('button');
  stopButton.textContent = `Stop Step ${index + 1}`;
  stopButton.onclick = () => stopAudio(index);

  const volumeSlider = document.createElement('input');
  volumeSlider.type = 'range';
  volumeSlider.min = 0;
  volumeSlider.max = 1;
  volumeSlider.step = 0.01;
  volumeSlider.value = 1; 
  volumeSlider.oninput = (event) => changeVolume(index, event.target.value);

  sourceContainer.appendChild(playButton);
  sourceContainer.appendChild(stopButton);
  sourceContainer.appendChild(volumeSlider);
  controlsContainer.appendChild(sourceContainer);
}

async function playAudio(leftFile, rightFile, index) {
  const leftBuffer = await loadAudioFile(leftFile);
  const rightBuffer = await loadAudioFile(rightFile);

  const leftSource = audioContext.createBufferSource();
  const rightSource = audioContext.createBufferSource();

  leftSource.buffer = leftBuffer;
  rightSource.buffer = rightBuffer;

  const merger = audioContext.createChannelMerger(2);
  const gainNode = audioContext.createGain();

  leftSource.connect(merger, 0, 0);
  rightSource.connect(merger, 0, 1);
  merger.connect(gainNode);
  gainNode.connect(audioContext.destination);

  leftSource.start();
  rightSource.start();

  activeSources[index] = { leftSource, rightSource, gainNode };
}

function stopAudio(index) {
  const sources = activeSources[index];
  if (sources) {
    sources.leftSource.stop();
    sources.rightSource.stop();
    delete activeSources[index];
  }
}

function changeVolume(index, volume) {
  const sources = activeSources[index];
  if (sources) {
    sources.gainNode.gain.value = volume;
  }
}

async function loadAudioFile(filePath) {
  const response = await fetch(filePath);
  const arrayBuffer = await response.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
}
