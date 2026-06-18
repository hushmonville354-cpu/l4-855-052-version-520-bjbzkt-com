(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        var open = mobileNav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }

    var hero = document.querySelector(".hero-slider");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
      var current = 0;
      var timer = null;

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function start() {
        if (slides.length > 1) {
          timer = window.setInterval(function () {
            show(current + 1);
          }, 5200);
        }
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        start();
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
          restart();
        });
      });

      start();
    }

    var params = new URLSearchParams(window.location.search);
    var queryText = params.get("q") || "";
    var filterPanel = document.querySelector(".filter-panel");

    if (filterPanel) {
      var input = filterPanel.querySelector(".filter-input");
      var chips = Array.prototype.slice.call(filterPanel.querySelectorAll("[data-chip]"));
      var empty = filterPanel.querySelector(".filter-empty");
      var activeChip = "";

      if (input && queryText) {
        input.value = queryText;
      }

      function applyFilter() {
        var text = input ? input.value.trim().toLowerCase() : "";
        var items = Array.prototype.slice.call(document.querySelectorAll(".filter-item"));
        var visible = 0;

        items.forEach(function (item) {
          var source = (item.getAttribute("data-filter") || "").toLowerCase();
          var matchText = !text || source.indexOf(text) !== -1;
          var matchChip = !activeChip || source.indexOf(activeChip.toLowerCase()) !== -1;
          var show = matchText && matchChip;
          item.classList.toggle("is-hidden", !show);
          if (show) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          activeChip = chip.getAttribute("data-chip") || "";
          chips.forEach(function (item) {
            item.classList.toggle("is-active", item === chip);
          });
          applyFilter();
        });
      });

      applyFilter();
    }
  });
})();
