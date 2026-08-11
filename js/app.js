"use strict";

jQuery(function ($) {
  $(window).on("scroll", function () {
    if ($(this).scrollTop() >= 200) {
      $(".navbar").addClass("fixed-top");
    } else if ($(this).scrollTop() == 0) {
      $(".navbar").removeClass("fixed-top");
    }
  });

  function adjustNav() {
    var winWidth = $(window).width(),
      dropdown = $(".dropdown"),
      dropdownMenu = $(".dropdown-menu");

    if (winWidth >= 768) {
      dropdown.on("mouseenter", function () {
        $(this).addClass("show").children(dropdownMenu).addClass("show");
      });

      dropdown.on("mouseleave", function () {
        $(this).removeClass("show").children(dropdownMenu).removeClass("show");
      });
    } else {
      dropdown.off("mouseenter mouseleave");
    }
  }

  $(window).on("resize", adjustNav);

  adjustNav();
});

particlesJS(
  "particles-js",

  {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 1200,
        },
      },
      color: {
        value: "#f29f05",
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
        polygon: {
          nb_sides: 5,
        },
        image: {
          src: "img/github.svg",
          width: 100,
          height: 100,
        },
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 30,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 6,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
  }
);

const searchIndex = [
  { type: "Section", title: "Home", text: "Back to the top — intro & profile", target: "#home" },
  { type: "Section", title: "Portfolio", text: "Design & development skill breakdown", target: "#content" },
  { type: "Skill", title: "Illustrator", text: "Graphic design — vector illustration", target: "#skill-illustrator" },
  { type: "Skill", title: "Photoshop", text: "Graphic design — photo editing & compositing", target: "#skill-photoshop" },
  { type: "Skill", title: "After Effects", text: "Graphic design — motion graphics & animation", target: "#skill-aftereffects" },
  { type: "Skill", title: "React JS", text: "Development — front-end JavaScript library", target: "#skill-react" },
  { type: "Skill", title: "Vue JS", text: "Development — front-end JavaScript framework", target: "#skill-vue" },
  { type: "Skill", title: "Github", text: "Codebases — open source repositories", target: "#skill-github" },
  { type: "Social", title: "Twitter", text: "twitter.com/johnnnzivo", href: "https://twitter.com/johnnnzivo" },
  { type: "Social", title: "Github Profile", text: "github.com/nzivo", href: "https://github.com/nzivo" },
  { type: "Social", title: "CodePen", text: "codepen.io/johnnnzivo", href: "https://codepen.io/johnnnzivo" },
  { type: "Social", title: "Behance", text: "behance.net/johnnnzivo", href: "https://www.behance.net/johnnnzivo" },
];

const popularSearches = ["Portfolio", "React JS", "Illustrator", "Github", "Vue JS"];

function searchSite(query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return searchIndex
    .filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.text.toLowerCase().includes(q)
    )
    .slice(0, limit);
}

$(function () {
  const $searchOverlay = $("#search");
  const $searchInput = $("#search-input");
  const $searchPopular = $("#search-popular");
  const $searchPills = $("#search-pills");
  const $searchResults = $("#search-results");
  const $searchEmpty = $("#search-empty");

  popularSearches.forEach((label) => {
    $("<button>", { type: "button", text: label })
      .on("click", function () {
        $searchInput.val(label).trigger("input").trigger("focus");
      })
      .appendTo($searchPills);
  });

  function goToResult(item) {
    $searchOverlay.removeClass("open");
    if (item.href) {
      window.open(item.href, "_blank", "noopener");
      return;
    }
    const target = document.querySelector(item.target);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderResults(query) {
    const results = searchSite(query);
    $searchResults.empty();

    if (query.trim() === "") {
      $searchPopular.show();
      $searchResults.hide();
      $searchEmpty.hide();
      return;
    }

    $searchPopular.hide();

    if (results.length === 0) {
      $searchResults.hide();
      $searchEmpty.text(`No results for "${query}".`).show();
      return;
    }

    $searchEmpty.hide();
    $searchResults.show();

    results.forEach((item) => {
      const $result = $("<button>", { type: "button", class: "search-result" });
      $("<span>", { class: "search-result-tag", text: item.type }).appendTo($result);
      const $body = $("<span>", { class: "search-result-body" });
      $("<strong>", { text: item.title }).appendTo($body);
      $("<span>", { text: item.text }).appendTo($body);
      $body.appendTo($result);
      $result.on("click", () => goToResult(item));
      $result.appendTo($searchResults);
    });
  }

  $searchInput.on("input", function () {
    renderResults($(this).val());
  });

  $('a[href="#search"]').on("click", function (event) {
    event.preventDefault();
    $searchOverlay.addClass("open");
    $searchInput.val("");
    renderResults("");
    setTimeout(() => $searchInput.trigger("focus"), 60);
  });

  $("#search, #search button.close").on("click keyup", function (event) {
    if (
      event.target == this ||
      event.target.className == "close" ||
      event.keyCode == 27
    ) {
      $(this).removeClass("open");
    }
  });

  $("form").submit(function (event) {
    event.preventDefault();
    return false;
  });
});

let currentYear = new Date();
let getYear = currentYear.getFullYear();
const experience = getYear - 2016;
document.getElementById("experience").innerHTML = experience;
document.getElementById("full_year").innerHTML = getYear;
