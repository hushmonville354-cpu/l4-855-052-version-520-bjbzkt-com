document.addEventListener("DOMContentLoaded", function () {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (navToggle && mobileNav) {
        navToggle.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var active = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            active = (index + slides.length) % slides.length;

            slides.forEach(function (slide, position) {
                slide.classList.toggle("is-active", position === active);
            });

            dots.forEach(function (dot, position) {
                dot.classList.toggle("is-active", position === active);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });

        showSlide(0);

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        }
    }

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
        var search = scope.querySelector("[data-filter-search]");
        var year = scope.querySelector("[data-filter-year]");
        var type = scope.querySelector("[data-filter-type]");
        var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));

        function applyFilters() {
            var query = search ? search.value.trim().toLowerCase() : "";
            var selectedYear = year ? year.value : "";
            var selectedType = type ? type.value : "";

            cards.forEach(function (card) {
                var text = (card.getAttribute("data-search") || "").toLowerCase();
                var cardYear = card.getAttribute("data-year") || "";
                var cardType = card.getAttribute("data-type") || "";
                var visible = true;

                if (query && text.indexOf(query) === -1) {
                    visible = false;
                }

                if (selectedYear && selectedYear !== cardYear) {
                    visible = false;
                }

                if (selectedType && selectedType !== cardType) {
                    visible = false;
                }

                card.hidden = !visible;
            });
        }

        [search, year, type].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });
    });

    document.querySelectorAll("[data-stream]").forEach(function (player) {
        var video = player.querySelector("video");
        var overlay = player.querySelector(".play-overlay");
        var stream = player.getAttribute("data-stream");
        var started = false;
        var hlsInstance = null;

        if (!video || !stream) {
            return;
        }

        function attachStream() {
            if (started) {
                return;
            }

            started = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else {
                video.src = stream;
            }
        }

        function startPlayback() {
            player.classList.add("is-playing");
            attachStream();

            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    player.classList.remove("is-playing");
                });
            }
        }

        if (overlay) {
            overlay.addEventListener("click", startPlayback);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            }
        });

        video.addEventListener("play", function () {
            player.classList.add("is-playing");
        });

        video.addEventListener("pause", function () {
            if (!video.ended) {
                player.classList.remove("is-playing");
            }
        });

        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
});
