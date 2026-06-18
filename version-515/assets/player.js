function initializePlayer(stream) {
  var area = document.querySelector(".watch-area");

  if (!area) {
    return;
  }

  var video = area.querySelector("video");
  var cover = area.querySelector(".player-cover");
  var buttons = Array.prototype.slice.call(area.querySelectorAll("[data-play]"));
  var hls = null;
  var loaded = false;

  function bind() {
    if (!video || loaded) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
        }
      });
    } else {
      video.src = stream;
    }

    loaded = true;
  }

  function play() {
    bind();

    if (cover) {
      cover.classList.add("is-hidden");
    }

    if (video) {
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          if (cover) {
            cover.classList.remove("is-hidden");
          }
        });
      }
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      play();
    });
  });

  if (cover) {
    cover.addEventListener("click", play);
  }

  if (video) {
    video.addEventListener("play", function () {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    });
    video.addEventListener("pause", function () {
      if (cover && video.currentTime === 0) {
        cover.classList.remove("is-hidden");
      }
    });
  }

  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
    }
  });
}
