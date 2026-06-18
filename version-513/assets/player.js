(function () {
  var boxes = document.querySelectorAll('[data-video-box]');

  boxes.forEach(function (box) {
    var video = box.querySelector('video');
    var trigger = box.querySelector('[data-play-trigger]');
    var started = false;

    function startPlayback() {
      if (!video || started) {
        return;
      }

      started = true;
      var url = video.dataset.videoUrl;

      if (trigger) {
        trigger.classList.add('is-hidden');
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play().catch(function () {});
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
            }
          }
        });
        return;
      }

      video.src = url;
      video.play().catch(function () {});
    }

    if (trigger) {
      trigger.addEventListener('click', startPlayback);
    }

    if (video) {
      video.addEventListener('click', startPlayback);
    }
  });
})();
