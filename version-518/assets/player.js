(function () {
    var video = document.querySelector('[data-player-video]');
    var overlay = document.querySelector('[data-player-overlay]');
    var src = window.SITE_PLAYER_SRC;
    var attached = false;
    var hls = null;

    if (!video || !src) {
        return;
    }

    function attachSource() {
        if (attached) {
            return;
        }
        attached = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            return;
        }

        video.src = src;
    }

    function playVideo() {
        attachSource();
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {});
        }
    }

    if (overlay) {
        overlay.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
        if (!attached || video.paused) {
            playVideo();
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
})();
