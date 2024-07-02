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

  // Volume
  const volLabel = document.createElement('label');
  volLabel.innerText = 'Volume: ';
  volLabel.for = 'volume';

  const volumeSlider = document.createElement('input');
  volumeSlider.name = 'volume';
  volumeSlider.type = 'range';
  volumeSlider.min = 0;
  volumeSlider.max = 1;
  volumeSlider.step = 0.01;
  volumeSlider.value = 1;
  volumeSlider.oninput = (event) => changeVolume(index, event.target.value);

  // Timestretch
  const stretchLabel = document.createElement('label');
  stretchLabel.innerText = 'Timestretch: ';
  stretchLabel.for = 'timestretch';

  const stretchSlider = document.createElement('input');
  stretchSlider.name = 'timestretch';
  stretchSlider.type = 'range';
  stretchSlider.min = 0;
  stretchSlider.max = 2;
  stretchSlider.step = 0.01;
  stretchSlider.value = 1;
  stretchSlider.oninput = (event) => timeStretch(index, event.target.value);

  // Bitcrush
  const bitcrushLabel = document.createElement('label');
  bitcrushLabel.innerText = 'Bitcrush: ';
  bitcrushLabel.for = 'bitcrush';

  const bitcrushSlider = document.createElement('input');
  bitcrushSlider.name = 'bitcrush';
  bitcrushSlider.type = 'range';
  bitcrushSlider.min = 1; // Start at 16 bits (no crush)
  bitcrushSlider.max = 16; // Go down to 1 bit
  bitcrushSlider.step = 1;
  bitcrushSlider.value = 16;
  bitcrushSlider.oninput = (event) => applyBitcrush(index, event.target.value);

  sourceContainer.appendChild(playButton);
  sourceContainer.appendChild(stopButton);
  sourceContainer.appendChild(volLabel);
  sourceContainer.appendChild(volumeSlider);
  sourceContainer.appendChild(stretchLabel);
  sourceContainer.appendChild(stretchSlider);
  sourceContainer.appendChild(bitcrushLabel);
  sourceContainer.appendChild(bitcrushSlider);
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
  const bitcrusherNode = createBitcrusherNode();

  leftSource.connect(merger, 0, 0);
  rightSource.connect(merger, 0, 1);
  merger.connect(bitcrusherNode);
  bitcrusherNode.connect(gainNode);
  gainNode.connect(audioContext.destination);

  leftSource.start();
  rightSource.start();

  activeSources[index] = { leftSource, rightSource, gainNode, bitcrusherNode };
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

function timeStretch(index, value) {
  const sources = activeSources[index];
  if (sources) {
    sources.leftSource.playbackRate.linearRampToValueAtTime(value, audioContext.currentTime + 0.05);
    sources.rightSource.playbackRate.linearRampToValueAtTime(value, audioContext.currentTime + 0.05);
  }
}

function applyBitcrush(index, value) {
  const sources = activeSources[index];
  if (sources) {
    sources.bitcrusherNode.bits = value;
  }
}

async function loadAudioFile(filePath) {
  const response = await fetch(filePath);
  const arrayBuffer = await response.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
}

function createBitcrusherNode() {
  const bufferSize = 4096;
  const node = audioContext.createScriptProcessor(bufferSize, 1, 1);

  node.bits = 16; // Default bit depth (no crush)
  node.normfreq = 1; // Default frequency reduction (no reduction)

  node.onaudioprocess = function(e) {
    const input = e.inputBuffer.getChannelData(0);
    const output = e.outputBuffer.getChannelData(0);
    const step = Math.pow(1 / 2, node.bits);
    let phaser = 0;
    let lastValue = 0;

    for (let i = 0; i < bufferSize; i++) {
      phaser += node.normfreq;
      if (phaser >= 1.0) {
        phaser -= 1.0;
        lastValue = step * Math.floor(input[i] / step + 0.5);
      }
      output[i] = lastValue;
    }
  };

  return node;
}
