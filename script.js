const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const controlsContainer = document.getElementById('controls');

// Array of file paths for left and right channels for each source
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

function createAudioSource(leftFile, rightFile, index) {
  const sourceContainer = document.createElement('div');
  sourceContainer.className = 'audio-source';

  const playButton = document.createElement('button');
  playButton.textContent = `Step ${index + 1}`;
  playButton.onclick = () => playAudio(leftFile, rightFile);

  sourceContainer.appendChild(playButton);
  controlsContainer.appendChild(sourceContainer);
}

async function playAudio(leftFile, rightFile) {
  const leftBuffer = await loadAudioFile(leftFile);
  const rightBuffer = await loadAudioFile(rightFile);

  const leftSource = audioContext.createBufferSource();
  const rightSource = audioContext.createBufferSource();

  leftSource.buffer = leftBuffer;
  rightSource.buffer = rightBuffer;

  const merger = audioContext.createChannelMerger(2);

  leftSource.connect(merger, 0, 0);
  rightSource.connect(merger, 0, 1);

  merger.connect(audioContext.destination);

  leftSource.start();
  rightSource.start();
}

async function loadAudioFile(filePath) {
  const response = await fetch(filePath);
  const arrayBuffer = await response.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
}

const activeSources = [];

function playAudio(leftFile, rightFile) {
  loadAudioFile(leftFile).then(leftBuffer => {
    loadAudioFile(rightFile).then(rightBuffer => {
      const leftSource = audioContext.createBufferSource();
      const rightSource = audioContext.createBufferSource();

      leftSource.buffer = leftBuffer;
      rightSource.buffer = rightBuffer;

      const merger = audioContext.createChannelMerger(2);

      leftSource.connect(merger, 0, 0);
      rightSource.connect(merger, 0, 1);

      merger.connect(audioContext.destination);

      leftSource.start();
      rightSource.start();

      activeSources.push({ leftSource, rightSource });
    });
  });
}

function stopAllSources() {
  activeSources.forEach(({ leftSource, rightSource }) => {
    leftSource.stop();
    rightSource.stop();
  });
  activeSources.length = 0;
}
