(function () {
    var root = document.body.getAttribute('data-root') || '';
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var index = 0;

        function showSlide(next) {
            if (!slides.length) {
                return;
            }
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                showSlide(i);
            });
        });

        showSlide(0);
        window.setInterval(function () {
            showSlide(index + 1);
        }, 5000);
    }

    var area = document.querySelector('[data-search-area]');

    if (area && window.SITE_MOVIES) {
        var input = area.querySelector('[data-search-input]');
        var typeSelect = area.querySelector('[data-search-type]');
        var yearSelect = area.querySelector('[data-search-year]');
        var results = area.querySelector('[data-search-results]');

        function render(items) {
            if (!results) {
                return;
            }
            if (!items.length) {
                results.classList.remove('is-open');
                results.innerHTML = '';
                return;
            }
            results.classList.add('is-open');
            results.innerHTML = items.slice(0, 30).map(function (movie) {
                return [
                    '<a class="search-result-item" href="' + root + movie.url + '">',
                    '<img src="' + root + movie.cover + '" alt="' + escapeHtml(movie.title) + '">',
                    '<span>',
                    '<strong class="rank-title">' + escapeHtml(movie.title) + '</strong>',
                    '<span class="movie-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.year) + '</span></span>',
                    '<span class="movie-line">' + escapeHtml(movie.oneLine) + '</span>',
                    '</span>',
                    '</a>'
                ].join('');
            }).join('');
        }

        function escapeHtml(value) {
            return String(value || '').replace(/[&<>"']/g, function (char) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[char];
            });
        }

        function runSearch() {
            var query = (input && input.value || '').trim().toLowerCase();
            var type = typeSelect && typeSelect.value || '';
            var year = yearSelect && yearSelect.value || '';

            if (!query && !type && !year) {
                render([]);
                return;
            }

            var items = window.SITE_MOVIES.filter(function (movie) {
                var text = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.oneLine].join(' ').toLowerCase();
                return (!query || text.indexOf(query) > -1) && (!type || movie.type === type) && (!year || movie.year === year);
            });

            render(items);
        }

        [input, typeSelect, yearSelect].forEach(function (el) {
            if (el) {
                el.addEventListener('input', runSearch);
                el.addEventListener('change', runSearch);
            }
        });
    }
})();
