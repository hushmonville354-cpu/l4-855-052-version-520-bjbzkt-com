(function () {
  var button = document.querySelector('[data-menu-button]');
  var nav = document.querySelector('[data-mobile-nav]');

  if (button && nav) {
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function activate(index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        activate(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        activate((current + 1) % slides.length);
      }, 5200);
    }
  }

  var cardGrid = document.querySelector('[data-card-grid]');
  var cardSearch = document.querySelector('[data-card-search]');
  var yearFilter = document.querySelector('[data-year-filter]');

  if (cardGrid && cardSearch) {
    var cards = Array.prototype.slice.call(cardGrid.querySelectorAll('.movie-card'));

    function applyCardFilter() {
      var keyword = (cardSearch.value || '').trim().toLowerCase();
      var year = yearFilter ? yearFilter.value : '';

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchedYear = !year || card.getAttribute('data-year') === year;
        card.hidden = !(matchedKeyword && matchedYear);
      });
    }

    cardSearch.addEventListener('input', applyCardFilter);

    if (yearFilter) {
      yearFilter.addEventListener('change', applyCardFilter);
    }
  }

  var searchInput = document.querySelector('[data-site-search]');
  var searchResults = document.querySelector('[data-search-results]');
  var searchClear = document.querySelector('[data-search-clear]');

  if (searchInput && searchResults && window.ASIAN_CLASSIC_SEARCH_DATA) {
    var movies = window.ASIAN_CLASSIC_SEARCH_DATA;

    function card(movie) {
      return [
        '<article class="search-result-card">',
        '<a href="' + movie.url + '"><img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy"></a>',
        '<div>',
        '<h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>',
        '<p>' + escapeHtml(movie.year + ' · ' + movie.region + ' · ' + movie.genre) + '</p>',
        '<p>' + escapeHtml(movie.line) + '</p>',
        '</div>',
        '</article>'
      ].join('');
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderSearch() {
      var keyword = searchInput.value.trim().toLowerCase();
      var matched = movies.filter(function (movie) {
        if (!keyword) {
          return movie.hot;
        }
        return movie.search.indexOf(keyword) !== -1;
      }).slice(0, 60);
      searchResults.innerHTML = matched.map(card).join('');
    }

    searchInput.addEventListener('input', renderSearch);

    if (searchClear) {
      searchClear.addEventListener('click', function () {
        searchInput.value = '';
        renderSearch();
        searchInput.focus();
      });
    }

    renderSearch();
  }
})();
