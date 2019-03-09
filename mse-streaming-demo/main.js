(function() {
  var sourceBuffer;
  var video;
  var ms;
  let chunkIndex = 0;

  document.addEventListener('DOMContentLoaded', function() {
    // WS Connection
    var socket = new WebSocket('ws://35.247.82.159:8080');
    socket.onopen = function() {
      socket.send('resolution low');
      socket.send('video 1');
    };

    socket.onmessage = function(event) {
      console.log(`Received chunk #${ chunkIndex++ }.`);
      appendToBuffer(event.data);
    };

    startStream();

    // Choose video
    var menu = document.querySelector('select');
    menu.onchange = function() {
      const videoIndex = menu.value;
      console.log(`Selected video: ${videoIndex}`);

      ms.endOfStream();
      startStream();

      socket.send(`video ${ videoIndex }`);
    };
  });

  function startStream() {
    ms = new MediaSource();
    video = document.querySelector('video');
    video.src = window.URL.createObjectURL(ms);
    ms.addEventListener('sourceopen', onMediaSourceOpen);
  }

  if (!window.MediaSource) {
    console.error('No Media Source API available');
    return;
  }

  function onMediaSourceOpen() {
    sourceBuffer = ms.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2');
    sourceBuffer.mode = 'sequence';
  }

  function appendToBuffer(videoChunk) {
    if (videoChunk) {
      var arrayBuffer;
      var fileReader = new FileReader();
      fileReader.onload = function(event) {
        arrayBuffer = event.target.result;

        sourceBuffer.appendBuffer(arrayBuffer);

        console.log('video.paused:', video.paused);
        if (video.paused) {
          video.play();
        }
      };
      fileReader.readAsArrayBuffer(videoChunk);
    }
  }
})();