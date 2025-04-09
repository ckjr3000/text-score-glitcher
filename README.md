# Text Score Glitcher

A tool for glitching text to speech audio.

Created as part of an experimental performance by [Tom Hawkins](https://tomhawkinscomposer.wordpress.com/), [Freya Shaw](https://immersionsoundstudio.com/), and [Charlotte Roe](https://www.charlotteroe.space/), as part of a submission to the 9th edition of the [CeReNeM Journal](https://cerenempostgraduates.wordpress.com/cerenem-journal/).

Built using the Web [Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## How To Use

The version of the project contained in this repository uses audio files created from a score by Tom Hawkins.
To add your own audio to manipulate simply clone the project, replace the files in the 'audio' folder with your own, and update the file paths in script.js (line 4).

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
  { left: './audio/freya-13.mp3', right: './audio/tom-13.mp3' },
  { left: './audio/freya-14.mp3', right: './audio/tom-14.mp3' },
  { left: './audio/freya-15.mp3', right: './audio/tom-15.mp3' },
  { left: './audio/freya-16.mp3', right: './audio/tom-16.mp3' },
];

^ Replace file paths here.

This is a plain static HTML site which can be run locally or uploaded to a web server.

The project can run in any browser but certain audio effects work best in Chrome.
