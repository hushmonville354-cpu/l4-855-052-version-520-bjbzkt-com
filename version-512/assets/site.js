(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        startTimer();
    }

    function yearMatches(cardYear, chosen) {
        if (!chosen) {
            return true;
        }

        if (chosen.length === 4 && chosen.endsWith('0')) {
            var y = parseInt(cardYear, 10);
            var base = parseInt(chosen, 10);
            return !isNaN(y) && y >= base && y <= base + 9;
        }

        return cardYear === chosen;
    }

    var grids = Array.prototype.slice.call(document.querySelectorAll('[data-grid]'));

    grids.forEach(function (grid) {
        var scope = grid.closest('section') || document;
        var search = scope.querySelector('[data-search]');
        var year = scope.querySelector('[data-filter-year]');
        var category = scope.querySelector('[data-filter-category]');
        var empty = scope.querySelector('[data-empty]');
        var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));

        function applyFilters() {
            var query = search ? search.value.trim().toLowerCase() : '';
            var selectedYear = year ? year.value : '';
            var selectedCategory = category ? category.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var title = card.getAttribute('data-title') || '';
                var region = card.getAttribute('data-region') || '';
                var genre = card.getAttribute('data-genre') || '';
                var tags = card.getAttribute('data-tags') || '';
                var cardYear = card.getAttribute('data-year') || '';
                var text = (title + ' ' + region + ' ' + genre + ' ' + tags).toLowerCase();
                var categoryText = card.closest('[data-category-name]') ? card.closest('[data-category-name]').getAttribute('data-category-name') : '';
                var matched = text.indexOf(query) !== -1 && yearMatches(cardYear, selectedYear);

                if (selectedCategory) {
                    matched = matched && (categoryText === selectedCategory || text.indexOf(selectedCategory.toLowerCase()) !== -1);
                }

                card.style.display = matched ? '' : 'none';

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.style.display = visible ? 'none' : 'block';
            }
        }

        if (search) {
            search.addEventListener('input', applyFilters);
        }

        if (year) {
            year.addEventListener('change', applyFilters);
        }

        if (category) {
            category.addEventListener('change', applyFilters);
        }
    });

    var player = document.querySelector('.movie-player');
    var playButton = document.querySelector('[data-play-button]');
    var started = false;
    var hlsInstance = null;

    function startVideo() {
        if (!player || started) {
            if (player) {
                player.play().catch(function () {});
            }
            return;
        }

        var url = player.getAttribute('data-url');
        started = true;

        if (playButton) {
            playButton.classList.add('is-hidden');
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(url);
            hlsInstance.attachMedia(player);
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                player.play().catch(function () {});
            });
        } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
            player.src = url;
            player.addEventListener('loadedmetadata', function () {
                player.play().catch(function () {});
            }, { once: true });
        } else {
            player.src = url;
            player.play().catch(function () {});
        }
    }

    if (playButton) {
        playButton.addEventListener('click', startVideo);
    }

    if (player) {
        player.addEventListener('click', function () {
            if (!started) {
                startVideo();
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }
})();
