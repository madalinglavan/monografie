document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     SELECTORS
  ========================================================= */

  const navbar =
    document.getElementById("navbar");

  const navLinks =
    document.querySelector(".nav__links");

  const menuToggle =
    document.getElementById("menuToggle");

  const dropdowns =
    document.querySelectorAll(".nav__dropdown");

  /* Meniul mobil este prezentat ca un cuprins al monografiei. */
  if (navLinks && !navLinks.querySelector(".mobile-nav__intro")) {
    const intro = document.createElement("div");
    intro.className = "mobile-nav__intro";
    intro.innerHTML = `
      <span class="mobile-nav__eyebrow">Monografia comunei</span>
      <strong>Cuprins</strong>
      <small>Alege un capitol pentru a continua explorarea</small>
    `;
    navLinks.prepend(intro);

    dropdowns.forEach((dropdown, index) => {
      dropdown.style.setProperty("--nav-index", `'${String(index + 1).padStart(2, "0")}'`);
      dropdown.querySelector(".dropdown-trigger")?.setAttribute("aria-expanded", "false");
    });

    const footer = document.createElement("div");
    footer.className = "mobile-nav__footer";
    footer.innerHTML = '<i class="fas fa-location-dot"></i><span>Bustuchin, Gorj<br><small>Istorie · oameni · locuri</small></span>';
    navLinks.append(footer);
  }



  /* =========================================================
     MOBILE MENU
  ========================================================= */

  if(menuToggle && navLinks){

    menuToggle.addEventListener("click", () => {

      navLinks.classList.toggle("active");

      menuToggle.classList.toggle("active");

      document.body.classList.toggle("menu-open");

      const isOpen = navLinks.classList.contains("active");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Închide meniul" : "Deschide meniul");

    });

  }



  /* =========================================================
     CLOSE MENU WHEN CLICK OUTSIDE
  ========================================================= */

  document.addEventListener("click", (e) => {

    if(
      navLinks &&
      menuToggle &&
      !navLinks.contains(e.target) &&
      !menuToggle.contains(e.target)
    ){

      navLinks.classList.remove("active");

      menuToggle.classList.remove("active");

      document.body.classList.remove("menu-open");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Deschide meniul");



      /* CLOSE DROPDOWNS */

      dropdowns.forEach(dropdown => {

        dropdown.classList.remove("active");

      });

    }

  });


/* =========================================================
   CLOSE MOBILE MENU WHEN CLICK NAV LINK
========================================================= */

document
  .querySelectorAll(".nav__dropdown-menu a, .nav__links > a")
  .forEach(link => {

    link.addEventListener("click", () => {

      /* Închide meniul dacă acesta este deschis */

      if(navLinks && navLinks.classList.contains("active")){

        navLinks.classList.remove("active");

        menuToggle?.classList.remove("active");

        document.body.classList.remove("menu-open");

        menuToggle?.setAttribute("aria-expanded", "false");
        menuToggle?.setAttribute("aria-label", "Deschide meniul");

      }


      /* Închide toate dropdown-urile */

      dropdowns.forEach(dropdown => {

        dropdown.classList.remove("active");

      });

    });

  });


  /* =========================================================
     TOUCH DEVICE DROPDOWN
  ========================================================= */

  const isTouchDevice =
    window.matchMedia("(hover: none)").matches;


dropdowns.forEach(dropdown => {

  const trigger =
    dropdown.querySelector(".dropdown-trigger");

  if(!trigger) return;

  trigger.addEventListener("click", (e) => {

    e.preventDefault();

    dropdowns.forEach(item => {

      if(item !== dropdown){

        item.classList.remove("active");

      }

    });

    dropdown.classList.toggle("active");

    dropdowns.forEach(item => {
      item.querySelector(".dropdown-trigger")?.setAttribute(
        "aria-expanded",
        String(item.classList.contains("active"))
      );
    });

  });

});


  /* =========================================================
     NAVBAR SCROLL EFFECT
  ========================================================= */

  window.addEventListener("scroll", () => {

    if(!navbar) return;

    if(window.scrollY > 50){

      navbar.classList.add("scrolled");

    }else{

      navbar.classList.remove("scrolled");

    }

  });



  /* =========================================================
     SMOOTH SCROLL
  ========================================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(anchor => {

      anchor.addEventListener("click", function(e){

        const targetId =
          this.getAttribute("href");

        if(
          !targetId ||
          targetId === "#"
        ) return;



        const target =
          document.querySelector(targetId);



        if(target){

          e.preventDefault();

          target.scrollIntoView({
            behavior:"smooth",
            block:"start"
          });

        }

      });

    });


  /* =========================================================
     NAVIGARE MOBILĂ CU POZIȚIONARE EXACTĂ
  ========================================================= */

  document.addEventListener("click", event => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;

    const link = event.target.closest(".nav__dropdown-menu a[href^='#'], .nav__links > a[href^='#']");
    if (!link) return;

    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    navLinks?.classList.remove("active");
    menuToggle?.classList.remove("active");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Deschide meniul");

    dropdowns.forEach(dropdown => {
      dropdown.classList.remove("active");
      dropdown.querySelector(".dropdown-trigger")?.setAttribute("aria-expanded", "false");
    });

    const placeTargetExactly = behavior => {
      const navbarHeight = navbar?.getBoundingClientRect().height || 62;
      const navbarTop = Number.parseFloat(getComputedStyle(navbar).top) || 10;
      const offset = navbarHeight + navbarTop + 14;
      const destination = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);

      window.scrollTo({
        top: destination,
        behavior
      });
    };

    const transition = document.getElementById("pageTransition");
    const transitionTime = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 360 : 760;

    history.pushState(null, "", targetId);

    /* Ascunde deplasarea lungă sub coperta editorială a monografiei. */
    transition?.classList.add("active");
    transition?.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
      placeTargetExactly("auto");
    }, 180);

    /* Corecție după repoziționare, utilă pe browserele mobile cu bară dinamică. */
    window.setTimeout(() => {
      const navbarHeight = navbar?.getBoundingClientRect().height || 62;
      const expectedTop = navbarHeight + (Number.parseFloat(getComputedStyle(navbar).top) || 10) + 14;
      const error = target.getBoundingClientRect().top - expectedTop;

      if (Math.abs(error) > 3) {
        window.scrollBy({ top: error, behavior: "auto" });
      }
    }, 260);

    window.setTimeout(() => {
      transition?.classList.remove("active");
      transition?.setAttribute("aria-hidden", "true");
    }, transitionTime);
  }, true);


/* =========================================================
   HERO VIDEO
========================================================= */

const heroSection =
  document.getElementById("hero");

const playVideoBtn =
  document.getElementById("playVideoBtn");

const heroVideo =
  document.getElementById("heroVideo");

const heroIframe =
  document.getElementById("heroIframe");

const closeHeroVideo =
  document.getElementById("closeHeroVideo");


/* =========================================================
   YOUTUBE VIDEO
========================================================= */

const heroYoutubeVideoId =
  "_gEYWhsmpBc";


/* =========================================================
   PLAY HERO VIDEO
========================================================= */

function playHeroVideo() {

  if (
    !heroSection ||
    !heroVideo ||
    !heroIframe
  ) {
    return;
  }


  heroIframe.src =
    `https://www.youtube.com/embed/${heroYoutubeVideoId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1`;


  heroSection.classList.add(
    "is-video-playing"
  );


  heroVideo.setAttribute(
    "aria-hidden",
    "false"
  );

}


/* =========================================================
   STOP HERO VIDEO
========================================================= */

function stopHeroVideo() {

  if (
    !heroSection ||
    !heroVideo ||
    !heroIframe
  ) {
    return;
  }


  heroSection.classList.remove(
    "is-video-playing"
  );


  heroVideo.setAttribute(
    "aria-hidden",
    "true"
  );


  /*
    Golirea src-ului oprește efectiv
    redarea videoclipului YouTube.
  */

  heroIframe.src =
    "";

}


/* =========================================================
   PLAY BUTTON
========================================================= */

if (playVideoBtn) {

  playVideoBtn.addEventListener(
    "click",
    playHeroVideo
  );

}

if (closeHeroVideo) {
  closeHeroVideo.addEventListener("click", stopHeroVideo);
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && heroSection?.classList.contains("is-video-playing")) {
    stopHeroVideo();
    playVideoBtn?.focus();
  }
});


/* =========================================================
   AUTO STOP HERO VIDEO ON SCROLL
========================================================= */

if (
  heroSection &&
  heroVideo
) {

  const heroObserver =
    new IntersectionObserver(

      (entries) => {

        entries.forEach((entry) => {

          if (
            entry.intersectionRatio < 0.15 &&
            heroSection.classList.contains(
              "is-video-playing"
            )
          ) {

            stopHeroVideo();

          }

        });

      },

      {
        threshold: [
          0,
          0.15,
          1
        ]
      }

    );


  heroObserver.observe(
    heroSection
  );

}


/* =========================================================
   STOP VIDEO WHEN PAGE IS HIDDEN
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.hidden &&
      heroSection?.classList.contains(
        "is-video-playing"
      )
    ) {

      stopHeroVideo();

    }

  }
);

});

/* =========================================================
   REVEAL ON SCROLL
========================================================= */

const reveals =
  document.querySelectorAll(
    ".reveal, .history-card"
  );


const revealObserver =
  new IntersectionObserver(

    (entries, observer) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) {
          return;
        }


        entry.target.classList.add(
          "active"
        );


        observer.unobserve(
          entry.target
        );

      });

    },

    {
      threshold: 0.15
    }

  );


reveals.forEach((reveal) => {

  revealObserver.observe(
    reveal
  );

});



/* =========================================================
   MEDIA CARDS
========================================================= */

const mediaCards =
  document.querySelectorAll(".media-card");

mediaCards.forEach(card => {

  const preview =
    card.querySelector(".media-card__preview");

  const iframe =
    card.querySelector(".media-card__iframe");

  const videoId =
    card.dataset.video;



  if(!preview || !iframe || !videoId) return;



  preview.addEventListener("click", () => {

    /* CLOSE OTHER VIDEOS */

    mediaCards.forEach(otherCard => {

      if(otherCard !== card){

        otherCard.classList.remove("active");



        const otherIframe =
          otherCard.querySelector(".media-card__iframe");

        if(otherIframe){

          otherIframe.src = "";

        }

      }

    });



    /* OPEN CURRENT */

    card.classList.add("active");



    iframe.src =
`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  });

});


/* =========================================================
   AUTOMATIC HISTORY YEARS
========================================================= */

const historyYears =
  document.getElementById("historyYears");

if(historyYears){

  const startYear =
    Number(historyYears.dataset.startYear);

  const currentYear =
    new Date().getFullYear();

  const yearsOfHistory =
    currentYear - startYear;

  historyYears.dataset.target =
    yearsOfHistory;

}

/* =========================================================
   STATS COUNTER
========================================================= */

const statNumbers =
  document.querySelectorAll(".stats__number[data-target]")



const animateStat = (stat) => {

  const target =
    +stat.dataset.target;

  let current = 0;

  const increment =
    target / 80;



  stat.textContent = 0;



  const updateCounter = () => {

    current += increment;



    if(current < target){

      stat.textContent =
        Math.floor(current);

      requestAnimationFrame(updateCounter);

    }else{

      stat.textContent = target;

    }

  };



  updateCounter();

};



const statsObserver =
  new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if(entry.isIntersecting){

        const stat =
          entry.target;



        /* PREVENT MULTIPLE TRIGGERS */

        if(stat.classList.contains("counting"))
          return;



        stat.classList.add("counting");



        animateStat(stat);



        /* RESET AFTER ANIMATION */

        setTimeout(() => {

          stat.classList.remove("counting");

        }, 1000);

      }

    });

  },{
    threshold:0.45
  });



statNumbers.forEach(stat => {

  statsObserver.observe(stat);

});



const WEATHER_API_KEY =
"e26177d74d65c1ddff24333770484a70";

const LAT = 44.805;
const LON = 23.109;

async function loadWeather(){

  try{

    const currentResponse =
      await fetch(
`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&lang=ro&appid=${WEATHER_API_KEY}`
      );

    const current =
      await currentResponse.json();



    const currentContainer =
      document.getElementById("weatherCurrent");

    const updateTime = new Date().toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit"
    });

    currentContainer.dataset.condition =
      current.weather[0].main.toLowerCase();


    currentContainer.innerHTML = `

      <div class="weather-current__main">

        <div class="weather-current__icon-wrap">
          <img
            class="weather-current__icon"
            src="https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png"
            alt="${current.weather[0].description}">
        </div>

        <div class="weather-current__reading">
          <span class="weather-current__label">Acum în Bustuchin</span>
          <div class="weather-current__temp">

            ${Math.round(current.main.temp)}°C

          </div>

          <div class="weather-current__desc">

            ${current.weather[0].description}

          </div>
          <span class="weather-current__updated">Actualizat la ${updateTime}</span>
        </div>

      </div>



      <div class="weather-current__details">

        <div class="weather-detail">

          <i class="fas fa-temperature-half"></i>
          <span class="weather-detail__label">
            Se simte ca
          </span>

          <span class="weather-detail__value">
            ${Math.round(current.main.feels_like)}°C
          </span>

        </div>



        <div class="weather-detail">

          <i class="fas fa-droplet"></i>
          <span class="weather-detail__label">
            Umiditate
          </span>

          <span class="weather-detail__value">
            ${current.main.humidity}%
          </span>

        </div>



        <div class="weather-detail">

          <i class="fas fa-wind"></i>
          <span class="weather-detail__label">
            Vânt
          </span>

          <span class="weather-detail__value">
            ${Math.round(current.wind.speed * 3.6)} km/h
          </span>

        </div>



        <div class="weather-detail">

          <i class="fas fa-gauge-high"></i>
          <span class="weather-detail__label">
            Presiune
          </span>

          <span class="weather-detail__value">
            ${current.main.pressure} hPa
          </span>

        </div>

      </div>

    `;



    const forecastResponse =
      await fetch(
`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&lang=ro&appid=${WEATHER_API_KEY}`
      );

    const forecastData =
      await forecastResponse.json();



    const grouped = {};



    forecastData.list.forEach(item => {

      const date =
        item.dt_txt.split(" ")[0];



      if(!grouped[date]){

        grouped[date] = [];

      }



      grouped[date].push(item);

    });



    const weatherGrid =
      document.getElementById("weatherGrid");



    weatherGrid.innerHTML = "";



    Object.entries(grouped)
      .slice(1,4)
      .forEach(([date, entries]) => {

        const maxTemp =
          Math.max(
            ...entries.map(
              e => e.main.temp_max
            )
          );

        const minTemp =
          Math.min(
            ...entries.map(
              e => e.main.temp_min
            )
          );

        const rainChance =
          Math.max(
            ...entries.map(
              e => (e.pop || 0) * 100
            )
          );

        const wind =
          Math.max(
            ...entries.map(
              e => e.wind.speed
            )
          );

        const weather =
          entries[0].weather[0];



        const weekday =
          new Date(date)
          .toLocaleDateString(
            "ro-RO",
            {
              weekday:"long"
            }
          );



        weatherGrid.innerHTML += `

          <article class="weather-card">

            <div class="weather-card__top">
              <span class="weather-card__index">0${Object.keys(grouped).indexOf(date)}</span>
              <img
                class="weather-icon"
                src="https://openweathermap.org/img/wn/${weather.icon}@2x.png"
                alt="${weather.description}">
            </div>

            <h3 class="weather-day">

              ${weekday}

            </h3>

            <div class="weather-desc">

              ${weather.description}

            </div>

            <div class="weather-card__temperatures">
              <div class="weather-max"><span>Max.</span><strong>${Math.round(maxTemp)}°</strong></div>
              <div class="weather-min"><span>Min.</span><strong>${Math.round(minTemp)}°</strong></div>
            </div>
            <div class="weather-card__meta">
              <span><i class="fas fa-cloud-rain"></i> ${Math.round(rainChance)}%</span>
              <span><i class="fas fa-wind"></i> ${Math.round(wind * 3.6)} km/h</span>
            </div>
          </article>

        `;

      });

  }

  catch(error){

    console.error(error);

    const currentContainer = document.getElementById("weatherCurrent");
    if (currentContainer) {
      currentContainer.innerHTML = `
        <div class="weather-unavailable">
          <i class="fas fa-cloud-sun"></i>
          <div><strong>Vremea ia o scurtă pauză</strong><span>Datele meteo vor reveni la următoarea actualizare.</span></div>
        </div>
      `;
    }

  }

}

loadWeather();














/* =========================================================
   HERITAGE SLIDER
========================================================= */

const heritageSlides =
  document.querySelectorAll(".heritage-slide");

let heritageIndex = 0;

if(heritageSlides.length){

  setInterval(() => {

    heritageSlides[heritageIndex]
      .classList.remove("active");

    heritageIndex++;

    if(
      heritageIndex >= heritageSlides.length
    ){
      heritageIndex = 0;
    }

    heritageSlides[heritageIndex]
      .classList.add("active");

  }, 4000);

}





/* =========================================================
   YOUTUBE LOAD ON CLICK
========================================================= */

document
.querySelectorAll(".video-preview")
.forEach(video => {

  const original =
    video.innerHTML;

  video.addEventListener("click", () => {

    if(
      video.querySelector("iframe")
    ) return;

    const id =
      video.dataset.video;

    video.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1"
        allow="autoplay; encrypted-media"
        allowfullscreen>
      </iframe>
    `;

  });

  const observer =
  new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if(
        !entry.isIntersecting &&
        video.querySelector("iframe")
      ){

        video.innerHTML =
          original;

      }

    });

  },{
    threshold:.2
  });

  observer.observe(video);

});


/* =========================================================
   PAGE NAVIGATION TRANSITION
========================================================= */

function initPageNavigationTransition(){

  const transition =
    document.getElementById("pageTransition");

  if(!transition) return;


  const links =
    document.querySelectorAll('a[href^="#"]');


  links.forEach(link => {

    link.addEventListener("click", event => {

      const href =
        link.getAttribute("href");


      if(
        !href ||
        href === "#"
      ){
        return;
      }


      const target =
        document.querySelector(href);


      if(!target){
        return;
      }


      event.preventDefault();


      /* DISTANCE TO TARGET */

      const targetPosition =
        target.getBoundingClientRect().top
        + window.scrollY;

      const currentPosition =
        window.scrollY;

      const distance =
        Math.abs(
          targetPosition - currentPosition
        );


      /* DYNAMIC TRANSITION TIME */

      const transitionDuration =
        Math.min(
          Math.max(distance / 3, 700),
          1500
        );


      /* SHOW LOGO */

      transition.classList.add("active");

      transition.setAttribute(
        "aria-hidden",
        "false"
      );


      /* START SCROLL */

      setTimeout(() => {

        target.scrollIntoView({
          behavior:"smooth",
          block:"start"
        });

      },200);


      /* HIDE LOGO */

      setTimeout(() => {

        transition.classList.remove("active");

        transition.setAttribute(
          "aria-hidden",
          "true"
        );

      },transitionDuration);


      /* UPDATE URL */

      history.pushState(
        null,
        "",
        href
      );

    });

  });

}


document.addEventListener(
  "DOMContentLoaded",
  initPageNavigationTransition
);


/* =========================================================
   WELCOME SIGN - ANIMATE ON VIEW
========================================================= */

const welcomeSign =
  document.querySelector(".section-kicker-top");

if(welcomeSign){

  const welcomeObserver =
    new IntersectionObserver((entries, observer) => {

      entries.forEach(entry => {

        if(entry.isIntersecting){

          entry.target.classList.add("is-visible");

          /* Rulează o singură dată */
          observer.unobserve(entry.target);

        }

      });

    },{
      threshold:0.45
    });

  welcomeObserver.observe(welcomeSign);

}

/* =========================================================
   HARTA INTERACTIVĂ — COMUNA BUSTUCHIN
========================================================= */

async function initBustuchinMap() {

  /* =======================================================
     ELEMENT HARTĂ
  ======================================================= */

  const mapElement =
    document.getElementById("bustuchinMap");


  if (!mapElement) {
    return;
  }


  if (typeof L === "undefined") {

    console.error(
      "Leaflet nu este încărcat."
    );

    return;

  }
  /* =======================================================
     CATEGORII
  ======================================================= */

  const categories = {

    village: {
      label: "Sat",
      icon: "fa-house"
    },

    tourism: {
      label: "Turism",
      icon: "fa-tree"
    },

    religion: {
      label: "Patrimoniu",
      icon: "fa-church"
    },

    education: {
      label: "Educație",
      icon: "fa-graduation-cap"
    },
    monument: {
      label: "Monument istoric",
      icon: "fa-landmark"
    },
    infrastructura: {
      label: "Infrastructura",
      icon: "fa-city"
    }

  };


  /* =======================================================
     LOCURILE DE PE HARTĂ

     id = ID-ul secțiunii din HTML

     Exemple:
     id: "pojaru"
     -> navighează la #pojaru

     category:
     village
     tourism
     religion
     education
  ======================================================= */

  const mapLocations = [

    /* =====================================================
       SATE
    ===================================================== */

    {
      id: "bustuchin",

      name: "Bustuchin",

      category: "village",

      lat: 44.96452,

      lng: 23.72814
    },


    {
      id: "cionti",

      name: "Cionți",

      category: "village",

      lat: 44.96595,

      lng: 23.68434
    },


    {
      id: "motorgi",

      name: "Motorgi",

      category: "village",

      lat: 44.97773,

      lng: 23.68391
    },


    {
      id: "namete",

      name: "Nămete",

      category: "village",

      lat: 44.98310,

      lng: 23.70205
    },


    {
      id: "poiana-seciuri",

      name: "Poiana-Seciuri",

      category: "village",

      lat: 44.99191,

      lng: 23.72536
    },


    {
      id: "poienita",

      name: "Poienița",

      category: "village",

      lat: 44.99267,

      lng: 23.68150
    },


    {
      id: "pojaru",

      name: "Pojaru",

      category: "village",

      lat: 44.93860,

      lng: 23.69542
    },


    {
      id: "valea-pojarului",

      name: "Valea Pojarului",

      category: "village",

      lat: 44.93230,

      lng: 23.72700
    }
,
       {
         id: "fantana-rece",
         name: "Fântâna Rece",
         category: "tourism",
         lat: 44.969408,
         lng: 23.760961
       }
,
,
       {
         id: "lacurile-de-la-poiana",
         name: "Lacurile de la Poiana-Seciuri",
         category: "tourism",
         lat: 45.005435,
         lng: 23.743231


       }
,
,
       {
         id: "dealul-muierii",
         name: "Dealul Muierii",
         category: "tourism",
         lat: 44.985166,
         lng: 23.760546


       }
,
       {
         id: "biserica-bustuchin",
         name: "Biserica Bustuchin",
         category: "religion",
         lat: 44.975502,
         lng: 23.725401


       }
 ,
       {
         id: "biserica-pojaru",
         name: "Biserica Pojaru",
         category: "religion",
         lat: 44.945505,
         lng: 23.707883


       }
,
       {
         id: "biserica-valea-pojarului",
         name: "Biserica Valea Pojarului",
         category: "religion",
         lat: 44.938034,
         lng: 23.727402


       }
,
       {
         id: "biserica-poienita",
         name: "Biserica Poienita",
         category: "religion",
         lat: 44.990881,
         lng: 23.681493

       }
,
       {
         id: "biserica-poiana",
         name: "Biserica Poiana Seciuri",
         category: "religion",
         lat: 44.988755,
         lng: 23.723080


       }
,
       
       {
         id: "biserica-din-valea-pojarului",
         name: "Biserica de lemn din Valea Pojarului",
         category: "monument",
         lat: 44.938134,
         lng: 23.727307
       }
,
       {
         id: "liceul-tehnologic-bustuchin",
         name: "Liceul Tehnologic Bustuchin",
         category: "education",
         lat: 44.952382,
         lng: 23.712845
       }
       ,
       {
         id: "scoala-poiana-seciuri",
         name: "Școala Gimnazială Poiana-Seciuri",
         category: "education",
         lat: 45.001266,
         lng: 23.724950
       }
    ,
       {
         id: "scoala-primara-nr2",
         name: "Școala Primara Nr.2",
         category: "education",
         lat: 44.974433,
         lng: 23.725543

       }
   
       ,
       {
         id: "gradinita-program-prelungit",
         name: "Grădinița cu Program Prelungit",
         category: "education",
         lat: 44.952288,
         lng: 23.713439


       }
       ,
       {
         id: "gradinita-nr2",
         name: "Gradinita nr2",
         category: "education",
         lat: 44.971261,
         lng: 23.730856

       }
       ,
       {
         id: "centru-persoane-varstnice",
         name: "Centrul de zi si noapte pentru persoanele varstnice",
         category: "infrastructura",
         lat: 45.008068,
         lng: 23.730713

       }
,
       {
         id: "infrastructura-locativa",
         name: "Bloc ANL",
         category: "infrastructura",
         lat: 44.973222,
         lng: 23.725497

       }
       ,
       {
         id: "infrastructura-locativa",
         name: "Locuinte sociale",
         category: "infrastructura",
         lat: 44.951237,
         lng: 23.711989

       }
       ,
       {
         id: "infrastructura-medicala",
         name: "Cabinet Medical",
         category: "infrastructura",
         lat: 44.954279,
         lng: 23.714761

       }
       ,
       {
         id: "infrastructura-culturala",
         name: "Stadionul Bustuchin",
         category: "infrastructura",
         lat: 44.951695,
         lng: 23.715280



       }

  ];

  /* =======================================================
     CREARE HARTĂ
  ======================================================= */

  const map =
    L.map(
      mapElement,
      {

        zoomControl:
          true,

        scrollWheelZoom:
          false,

        doubleClickZoom:
          true,

        dragging:
          true,

        touchZoom:
          true

      }
    );


  /* =======================================================
     OPENSTREETMAP
  ======================================================= */

  L.tileLayer(

    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

      maxZoom:
        19,

      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

    }

  )
  .addTo(map);


  /* =======================================================
     LIMITA OFICIALĂ UAT BUSTUCHIN — ANCPI

     SIRUTA BUSTUCHIN = 79406
  ======================================================= */

  let bustuchinBoundary =
    null;

/* =======================================================
   LIMITA UAT BUSTUCHIN — FIȘIER LOCAL
======================================================= */

async function loadBustuchinBoundary() {

  try {

    const response =
      await fetch(
        "data/bustuchin-boundary.geojson"
      );


    if (!response.ok) {

      throw new Error(
        `GeoJSON HTTP ${response.status}`
      );

    }


    const geoJSON =
      await response.json();


    if (
      !geoJSON.features ||
      !geoJSON.features.length
    ) {

      throw new Error(
        "Fișierul GeoJSON nu conține geometria Bustuchin."
      );

    }


    /* ===================================================
       DESENEAZĂ HOTARUL
    =================================================== */

    bustuchinBoundary =
      L.geoJSON(
        geoJSON,
        {

          style: {

            color:
              "#38bdf8",

            weight:
              4,

            opacity:
              1,

            dashArray:
              "10 7",

            lineCap:
              "round",

            lineJoin:
              "round",

            fillColor:
              "#2563eb",

            fillOpacity:
              0.08

          },

          interactive:
            false

        }
      )
      .addTo(map);


    /* Hotarul rămâne sub markere */

    bustuchinBoundary.bringToBack();


    console.log(
      "Hotarul Bustuchin a fost încărcat cu succes."
    );


    return bustuchinBoundary;

  }


  catch (error) {

    console.error(
      "Nu am putut încărca hotarul Bustuchin:",
      error
    );


    return null;

  }

}

  /* =======================================================
     COORDONATE MARKERE
  ======================================================= */

  const markerCoordinates =
    [];

  const markerRecords = [];


  /* =======================================================
     CREARE MARKERE
  ======================================================= */

  mapLocations.forEach(
    location => {

      const category =
        categories[
          location.category
        ];


      if (!category) {
        return;
      }


      const coordinates = [

        location.lat,

        location.lng

      ];


      markerCoordinates.push(
        coordinates
      );


      /* ===================================================
         ICON
      =================================================== */

      const markerIcon =
        L.divIcon({

          className:
            "community-marker-wrapper",

          html: `

            <div
              class="
                community-marker
                community-marker--${location.category}
              ">

              <i
                class="
                  fas
                  ${category.icon}
                "
                aria-hidden="true">
              </i>

            </div>

          `,

          iconSize:
            [42, 42],

          iconAnchor:
            [21, 42],

          popupAnchor:
            [0, -36]

        });


      /* ===================================================
         MARKER
      =================================================== */

      const marker =
        L.marker(
          coordinates,
          {

            icon:
              markerIcon,

            title:
              location.name,

            riseOnHover:
              true

          }
        )
        .addTo(map);

      markerRecords.push({
        marker,
        location,
        category
      });


      /* ===================================================
         POPUP
      =================================================== */

      const popupContent = `

        <div class="map-popup">

          <span class="map-popup__category">

            ${category.label}

          </span>


          <strong class="map-popup__title">

            ${location.name}

          </strong>


          <button
            type="button"
            class="map-popup__button"
            data-map-target="${location.id}">

            Descoperă locul

            <i
              class="fas fa-arrow-right"
              aria-hidden="true">
            </i>

          </button>

          <a
            class="map-popup__route"
            href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}"
            target="_blank"
            rel="noopener noreferrer">
            <i class="fas fa-route" aria-hidden="true"></i>
            Traseu până aici
          </a>

        </div>

      `;


      marker.bindPopup(
        popupContent,
        {

          className:
            "community-map-popup",

          closeButton:
            false,

          maxWidth:
            250,

          minWidth:
            170,

          autoPan:
            true,

          autoPanPadding:
            [40, 40]

        }
      );

    }
  );

  /* =======================================================
     ATLAS LOCAL — CĂUTARE, FILTRE ȘI CONTROLUL HĂRȚII
  ======================================================= */

  const searchInput = document.getElementById("mapSearch");
  const searchResults = document.getElementById("mapSearchResults");
  const resultsCount = document.getElementById("mapResultsCount");
  const resetViewButton = document.getElementById("mapResetView");
  const legendItems = document.querySelectorAll(".community-map__legend-item");
  let activeMapCategory = "all";

  const normalizeMapText = value => value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const updateMapCount = count => {
    if (!resultsCount) return;
    resultsCount.textContent = count === 1
      ? "1 loc afișat"
      : `${count} locuri afișate`;
  };

  const showMarkerRecord = record => {
    map.flyTo([record.location.lat, record.location.lng], 16, {
      duration: .8
    });
    window.setTimeout(() => record.marker.openPopup(), 450);
    if (searchResults) searchResults.classList.remove("is-visible");
  };

  window.focusBustuchinMapLocation = locationId => {
    const record = markerRecords.find(item => item.location.id === locationId);
    if (!record) return false;
    activeMapCategory = "all";
    if (searchInput) searchInput.value = "";
    legendItems.forEach(item => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });
    applyMapFilters();
    showMarkerRecord(record);
    return true;
  };

  const applyMapFilters = () => {
    const query = normalizeMapText(searchInput?.value || "");
    const matches = markerRecords.filter(record => {
      const categoryMatches = activeMapCategory === "all" || record.location.category === activeMapCategory;
      const textMatches = !query || normalizeMapText(`${record.location.name} ${record.category.label}`).includes(query);
      return categoryMatches && textMatches;
    });

    markerRecords.forEach(record => {
      const visible = matches.includes(record);
      if (visible && !map.hasLayer(record.marker)) record.marker.addTo(map);
      if (!visible && map.hasLayer(record.marker)) record.marker.removeFrom(map);
    });

    updateMapCount(matches.length);

    if (searchResults) {
      searchResults.innerHTML = query
        ? matches.slice(0, 6).map(record => `
            <button type="button" data-map-result="${markerRecords.indexOf(record)}">
              <i class="fas ${record.category.icon}" aria-hidden="true"></i>
              <span><strong>${record.location.name}</strong><small>${record.category.label}</small></span>
              <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </button>
          `).join("") || '<p>Nu am găsit acest loc pe hartă.</p>'
        : "";
      searchResults.classList.toggle("is-visible", Boolean(query));
    }

    return matches;
  };

  searchInput?.addEventListener("input", applyMapFilters);

  searchResults?.addEventListener("click", event => {
    const resultButton = event.target.closest("[data-map-result]");
    if (!resultButton) return;
    const record = markerRecords[Number(resultButton.dataset.mapResult)];
    if (record) showMarkerRecord(record);
  });

  legendItems.forEach(item => {
    const categoryClass = [...item.classList].find(className =>
      className.startsWith("community-map__legend-item--")
    );
    const categoryName = categoryClass?.replace("community-map__legend-item--", "");
    if (!categoryName) return;

    item.dataset.category = categoryName;
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.setAttribute("aria-pressed", "false");
    item.setAttribute("title", "Filtrează harta");

    const selectCategory = () => {
      activeMapCategory = activeMapCategory === categoryName ? "all" : categoryName;
      legendItems.forEach(otherItem => {
        const selected = otherItem.dataset.category === activeMapCategory;
        otherItem.classList.toggle("is-active", selected);
        otherItem.setAttribute("aria-pressed", String(selected));
      });
      const matches = applyMapFilters();
      if (matches.length) {
        map.fitBounds(L.latLngBounds(matches.map(record => [record.location.lat, record.location.lng])), {
          padding: [55, 55],
          maxZoom: 14
        });
      }
    };

    item.addEventListener("click", selectCategory);
    item.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCategory();
      }
    });
  });

  resetViewButton?.addEventListener("click", () => {
    activeMapCategory = "all";
    if (searchInput) searchInput.value = "";
    legendItems.forEach(item => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });
    applyMapFilters();
    map.closePopup();
    if (bustuchinBoundary?.getBounds().isValid()) {
      map.fitBounds(bustuchinBoundary.getBounds(), { padding: [35, 35], maxZoom: 13 });
    } else {
      fitMapToPins();
    }
  });

  updateMapCount(markerRecords.length);


  /* =======================================================
     NAVIGARE DIN POPUP + PAGE TRANSITION
  ======================================================= */

  mapElement.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          ".map-popup__button"
        );


      if (!button) {
        return;
      }


      const targetId =
        button.dataset.mapTarget;


      if (!targetId) {
        return;
      }


      const target =
        document.getElementById(
          targetId
        );


      if (!target) {

        console.warn(
          `Secțiunea #${targetId} nu există în HTML.`
        );

        return;

      }


      /* ===================================================
         ÎNCHIDE POPUP
      =================================================== */

      map.closePopup();


      /* ===================================================
         PAGE TRANSITION
      =================================================== */

      const transition =
        document.getElementById(
          "pageTransition"
        );


      const targetPosition =
        target.getBoundingClientRect().top
        + window.scrollY;


      const currentPosition =
        window.scrollY;


      const distance =
        Math.abs(
          targetPosition -
          currentPosition
        );


      const transitionDuration =
        Math.min(
          Math.max(
            distance / 3,
            700
          ),
          1500
        );


      /* ===================================================
         AFIȘEAZĂ TRANZIȚIA
      =================================================== */

      if (transition) {

        transition.classList.add(
          "active"
        );


        transition.setAttribute(
          "aria-hidden",
          "false"
        );

      }


      /* ===================================================
         URL
      =================================================== */

      history.pushState(
        null,
        "",
        `#${targetId}`
      );


      /* ===================================================
         NAVIGARE
      =================================================== */

      setTimeout(
        () => {

          target.scrollIntoView(
            {

              behavior:
                "smooth",

              block:
                "start"

            }
          );

        },

        200
      );


      /* ===================================================
         ASCUNDE TRANZIȚIA
      =================================================== */

      if (transition) {

        setTimeout(
          () => {

            transition.classList.remove(
              "active"
            );


            transition.setAttribute(
              "aria-hidden",
              "true"
            );

          },

          transitionDuration
        );

      }

    }
  );


  /* =======================================================
     ÎNCADRAREA HĂRȚII
  ======================================================= */

  function fitMapToPins() {

    if (!markerCoordinates.length) {
      return;
    }


    const bounds =
      L.latLngBounds(
        markerCoordinates
      );


    map.fitBounds(
      bounds,
      {

        padding:
          [45, 45],

        maxZoom:
          14

      }
    );

  }


  /* =======================================================
     ÎNTÂI ARĂTĂM PINII
  ======================================================= */

  fitMapToPins();


  /* =======================================================
     APOI ÎNCĂRCĂM HOTARUL OFICIAL
  ======================================================= */

  const boundary =
    await loadBustuchinBoundary();


  /* =======================================================
     DACĂ HOTARUL EXISTĂ,
     ÎNCADREAZĂ ÎNTREAGA COMUNĂ
  ======================================================= */

  if (
    boundary &&
    boundary.getBounds().isValid()
  ) {

    map.fitBounds(
      boundary.getBounds(),
      {

        paddingTopLeft:
          [35, 55],

        paddingBottomRight:
          [35, 70],

        maxZoom:
          13

      }
    );

  }


  /* =======================================================
     FIX LEAFLET DUPĂ REVEAL
  ======================================================= */

  setTimeout(
    () => {

      map.invalidateSize();


      if (
        bustuchinBoundary &&
        bustuchinBoundary.getBounds().isValid()
      ) {

        map.fitBounds(
          bustuchinBoundary.getBounds(),
          {

            padding:
              [35, 35],

            maxZoom:
              13

          }
        );

      }

    },

    350

  );


  /* =======================================================
     CÂND HARTA INTRĂ ÎN VIEWPORT
  ======================================================= */

  const mapObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (!entry.isIntersecting) {
              return;
            }


            setTimeout(
              () => {

                map.invalidateSize();

              },

              150
            );

          }
        );

      },
      {

        threshold:
          0.1

      }
    );


  mapObserver.observe(
    mapElement
  );


  /* =======================================================
     RESIZE
  ======================================================= */

  let resizeTimer;


  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          () => {

            map.invalidateSize();

          },

          150
        );

    }
  );


  /* =======================================================
     SCROLL WHEEL ZOOM — DESKTOP
  ======================================================= */

  const desktopPointer =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );


  if (
    desktopPointer.matches
  ) {

    mapElement.addEventListener(
      "click",
      () => {

        map.scrollWheelZoom.enable();

      }
    );


    mapElement.addEventListener(
      "mouseleave",
      () => {

        map.scrollWheelZoom.disable();

      }
    );

  }

}


/* =========================================================
   PORNIRE HARTĂ
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initBustuchinMap
);








/* =========================================================
   PAGE SCROLL PROGRESS
========================================================= */

function initScrollProgress() {

  const progressBar =
    document.getElementById(
      "scrollProgressBar"
    );


  if (!progressBar) {
    return;
  }


  let ticking =
    false;


  function updateProgress() {

    /* =====================================================
       DISTANȚA TOTALĂ CARE POATE FI PARCURSĂ
    ===================================================== */

    const scrollableHeight =
      document.documentElement.scrollHeight
      - window.innerHeight;


    /* =====================================================
       PROCENT SCROLL
    ===================================================== */

    let progress =
      scrollableHeight > 0
        ? (
            window.scrollY /
            scrollableHeight
          ) * 100
        : 0;


    /* Siguranță */

    progress =
      Math.min(
        Math.max(
          progress,
          0
        ),
        100
      );


    /* =====================================================
       ACTUALIZEAZĂ BARA
    ===================================================== */

    progressBar.style.width =
      `${progress}%`;


    ticking =
      false;

  }


  /* =======================================================
     SCROLL
  ======================================================= */

  window.addEventListener(
    "scroll",
    () => {

      if (ticking) {
        return;
      }


      window.requestAnimationFrame(
        updateProgress
      );


      ticking =
        true;

    },
    {
      passive:
        true
    }
  );


  /* =======================================================
     RESIZE
  ======================================================= */

  window.addEventListener(
    "resize",
    updateProgress
  );


  /* =======================================================
     POZIȚIA INIȚIALĂ
  ======================================================= */

  updateProgress();

}


/* =========================================================
   PORNIRE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initScrollProgress
);







/* =========================================================
   NAVBAR — CAPITOL ACTIV ÎN FUNCȚIE DE SCROLL
========================================================= */

function initActiveNavSection() {

  /* =======================================================
     DEFINIRE CAPITOLE

     "selector" = zona din pagină
     "navText"  = textul dropdown-ului din navbar
  ======================================================= */

  const chapters = [

    /* EVENIMENTE */

    {
      selector:
        "#evenimente",

      navText:
        "Evenimente"
    },


    /* SATE */

    {
      selector:
        "#satele-comunei",

      navText:
        "Sate"
    },


    /* CULTURĂ */

    {
      selector:
        "#patrimoniu",

      navText:
        "Cultura"
    },


    /* RELIGIE */

    {
      selector:
        "#patrimoniu-religios",

      navText:
        "Religie"
    },


    /* ISTORIE */

    {
      selector:
        "#istorie",

      navText:
        "Istorie"
    },


    /* GEOGRAFIE */

    {
      selector:
        "#geografie",

      navText:
        "Geografie"
    },


    /* TURISM */

    {
      selector:
        "#turism",

      navText:
        "Turism"
    },


    /* INFRASTRUCTURĂ */

    {
      selector:
        "#infrastructura",

      directHref:
        "#infrastructura"
    },


    /* EDUCAȚIE */

    {
      selector:
        "#educatie",

      navText:
        "Educație"
    },

    /*Religie*/
    {
      selector:
      "#religie",
      navText:
      "Religie"
    }

  ];


  /* =======================================================
     GĂSEȘTE ELEMENTELE NAVBAR
  ======================================================= */

  const dropdowns =
    document.querySelectorAll(
      ".nav__dropdown"
    );


  const directLinks =
    document.querySelectorAll(
      ".nav__links > a"
    );


  /* =======================================================
     ȘTERGE ACTIVE STATE
  ======================================================= */

  function clearCurrentNav() {

    dropdowns.forEach(
      dropdown => {

        dropdown.classList.remove(
          "current-section"
        );

      }
    );


    directLinks.forEach(
      link => {

        link.classList.remove(
          "current-section"
        );

      }
    );

  }


  /* =======================================================
     ACTIVEAZĂ DROPDOWN DUPĂ TEXT
  ======================================================= */

  function activateDropdown(
    navText
  ) {

    dropdowns.forEach(
      dropdown => {

        const trigger =
          dropdown.querySelector(
            ".dropdown-trigger"
          );


        if (!trigger) {
          return;
        }


        const text =
          trigger.textContent
            .replace(/\s+/g, " ")
            .trim();


        if (
          text
            .toLowerCase()
            .includes(
              navText.toLowerCase()
            )
        ) {

          dropdown.classList.add(
            "current-section"
          );

        }

      }
    );

  }


  /* =======================================================
     ACTIVEAZĂ LINK DIRECT
  ======================================================= */

  function activateDirectLink(
    href
  ) {

    const link =
      document.querySelector(
        `.nav__links > a[href="${href}"]`
      );


    if (link) {

      link.classList.add(
        "current-section"
      );

    }

  }


  /* =======================================================
     GĂSEȘTE CAPITOLUL CURENT
  ======================================================= */

  function updateActiveChapter() {

    const viewportPoint =
      window.scrollY
      + window.innerHeight * 0.32;


    let currentChapter =
      null;


    chapters.forEach(
      chapter => {

        const section =
          document.querySelector(
            chapter.selector
          );


        if (!section) {
          return;
        }


        const top =
          section.offsetTop;


        const bottom =
          top
          + section.offsetHeight;


        if (
          viewportPoint >= top &&
          viewportPoint < bottom
        ) {

          currentChapter =
            chapter;

        }

      }
    );


    clearCurrentNav();


    if (!currentChapter) {
      return;
    }


    if (
      currentChapter.navText
    ) {

      activateDropdown(
        currentChapter.navText
      );

    }


    if (
      currentChapter.directHref
    ) {

      activateDirectLink(
        currentChapter.directHref
      );

    }

  }


  /* =======================================================
     SCROLL OPTIMIZAT
  ======================================================= */

  let ticking =
    false;


  window.addEventListener(
    "scroll",
    () => {

      if (ticking) {
        return;
      }


      requestAnimationFrame(
        () => {

          updateActiveChapter();

          ticking =
            false;

        }
      );


      ticking =
        true;

    },
    {
      passive:
        true
    }
  );


  /* RESIZE */

  window.addEventListener(
    "resize",
    updateActiveChapter
  );


  /* POZIȚIA INIȚIALĂ */

  updateActiveChapter();

}


/* =========================================================
   PORNIRE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initActiveNavSection
);



/* =========================================================
   REVISTA TRADIȚII BUSTUCHINENE
========================================================= */

const magazineViewer = document.getElementById("magazineViewer");
const magazineEditionTitle = document.getElementById("magazineEditionTitle");
const magazineOpenPdf = document.getElementById("magazineOpenPdf");
const magazineEditions = document.querySelectorAll(".magazine-edition");

if (
  magazineViewer &&
  magazineEditionTitle &&
  magazineOpenPdf &&
  magazineEditions.length
) {

  magazineEditions.forEach((button) => {

    button.addEventListener("click", () => {

      const pdf = button.dataset.pdf;
      const edition = button.dataset.edition;

      magazineEditions.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      magazineViewer.src = `${pdf}#toolbar=1&navpanes=0&view=FitH`;
      magazineViewer.title =
        `Revista Tradiții Bustuchinene – ${edition}`;

      magazineEditionTitle.textContent =
        `Revista „Tradiții Bustuchinene” – ${edition}`;

      magazineOpenPdf.href = pdf;

      document.querySelector(".magazine-reader")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

    });

  });

}

/* =========================================================
   TRANZIȚII NARATIVE ÎNTRE CAPITOLE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const chapters = [
    {
      target: "istorie",
      icon: "fa-book-open",
      eyebrow: "Istorie",
      message: "De aici începe povestea locului"
    },
    {
      target: "geografie",
      icon: "fa-mountain-sun",
      eyebrow: "Geografie",
      message: "Din trecut, spre locurile de astăzi"
    },
    {
      target: "sate",
      icon: "fa-tree-city",
      eyebrow: "Comunitate",
      message: "Opt sate. O singură comunitate."
    },
    {
      target: "religie",
      icon: "fa-church",
      eyebrow: "Credință",
      message: "Credință, memorie și continuitate"
    },
    {
      target: "patrimoniu",
      icon: "fa-landmark",
      eyebrow: "Patrimoniu",
      message: "Moștenirea păstrată din generație în generație"
    },
    {
      target: "evenimente",
      icon: "fa-people-group",
      eyebrow: "Tradiții",
      message: "Tradiția continuă prin oameni"
    },
    {
      target: "turism",
      icon: "fa-route",
      eyebrow: "Descoperire",
      message: "Locuri care merită descoperite"
    },
    {
      target: "educatie",
      icon: "fa-graduation-cap",
      eyebrow: "Educație",
      message: "Povestea merge mai departe prin noile generații"
    },
    {
      target: "infrastructura",
      icon: "fa-road",
      eyebrow: "Dezvoltare",
      message: "Rădăcini trainice. Un drum spre viitor."
    }
  ];

  const transitions = [];

  chapters.forEach((chapter) => {
    const section = document.getElementById(chapter.target);

    if (!section || section.previousElementSibling?.classList.contains("chapter-transition")) {
      return;
    }

    const transition = document.createElement("div");
    transition.className = `chapter-transition chapter-transition--${chapter.target}`;
    transition.dataset.chapter = chapter.target;
    transition.setAttribute("role", "separator");
    transition.setAttribute("aria-label", `Urmează capitolul ${chapter.eyebrow}`);
    transition.innerHTML = `
      <div class="chapter-transition__path" aria-hidden="true">
        <span class="chapter-transition__line chapter-transition__line--left"></span>
        <span class="chapter-transition__marker">
          <i class="fa-solid ${chapter.icon}"></i>
        </span>
        <span class="chapter-transition__line chapter-transition__line--right"></span>
      </div>
      <div class="chapter-transition__copy">
        <span class="chapter-transition__eyebrow">${chapter.eyebrow}</span>
        <p>${chapter.message}</p>
      </div>
    `;

    section.insertAdjacentElement("beforebegin", transition);
    transitions.push(transition);
  });

  if (!transitions.length) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    transitions.forEach((transition) => transition.classList.add("is-visible"));
    return;
  }

  const transitionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.42,
    rootMargin: "0px 0px -8%"
  });

  transitions.forEach((transition) => transitionObserver.observe(transition));
});


/* =========================================================
   LAYOUT EDITORIAL PENTRU SECȚIUNILE CU TEXT LUNG
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const candidates = document.querySelectorAll(".split-layout, .section--villages .village");

  candidates.forEach((block) => {
    const content = block.querySelector(":scope > .section-block__content, :scope > .village__content");
    const media = block.querySelector(":scope > .section-block__media, :scope > .village__media, :scope > .video-preview");

    if (!content || !media || block.classList.contains("split-layout--longform")) {
      return;
    }

    const paragraphs = Array.from(content.children).filter((element) =>
      element.matches("p.section-block__text")
    );

    if (paragraphs.length < 4) {
      return;
    }

    const textFlow = document.createElement("div");
    textFlow.className = "longform__text";
    paragraphs[0].insertAdjacentElement("beforebegin", textFlow);
    paragraphs.forEach((paragraph) => textFlow.appendChild(paragraph));

    block.classList.add("split-layout--longform");

    const image = media.querySelector("img");

    if (image) {
      const updateOrientation = () => {
        const isPortraitLike = image.naturalWidth > 0 &&
          image.naturalHeight >= image.naturalWidth * 0.9;

        block.classList.toggle("longform--portrait-media", isPortraitLike);
      };

      if (image.complete) {
        updateOrientation();
      }

      image.addEventListener("load", updateOrientation, { once: true });
    }
  });
});

/* =========================================================
   PARCURI, LOCURI DE JOACĂ ȘI BAZE SPORTIVE
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("parcuri-spatii-joaca");
  if (!section) return;

  const cards = Array.from(section.querySelectorAll("[data-facility]"));
  const buttons = Array.from(section.querySelectorAll("[data-facility-filter]"));
  const count = section.querySelector(".community-facilities__count b");

  const applyFilter = (filter) => {
    let visible = 0;
    cards.forEach((card) => {
      const show = filter === "all" || card.dataset.facility === filter;
      card.hidden = !show;
      card.setAttribute("aria-hidden", String(!show));
      if (show) visible += 1;
    });
    buttons.forEach((button) => {
      const active = button.dataset.facilityFilter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (count) count.textContent = String(visible);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.facilityFilter));
  });

  cards.forEach((card) => {
    const image = card.querySelector("img");
    const media = card.querySelector(".facility-card__media");
    if (!image || !media) return;
    media.dataset.placeholder = image.alt;
    const updateImageState = () => card.classList.toggle("is-missing-image", !image.naturalWidth);
    if (image.complete) updateImageState();
    image.addEventListener("load", updateImageState);
    image.addEventListener("error", updateImageState);
  });

  applyFilter("all");
});


/* Imaginile încă neadăugate nu mai lasă spații goale în cardurile de memorie. */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#bustuchin-altadata :is(.memory-card, .memory-object, .memory-portrait) img").forEach((image) => {
    const card = image.closest(".memory-card, .memory-object, .memory-portrait");

    const updateImageState = () => {
      const isMissing = !image.naturalWidth;
      card?.classList.toggle("memory-item--missing-image", isMissing);
      card?.classList.toggle("memory-card--missing-image", isMissing && card.classList.contains("memory-card"));
    };

    if (image.complete) {
      updateImageState();
    }

    image.addEventListener("load", updateImageState, { once: true });
    image.addEventListener("error", updateImageState, { once: true });
  });
});

/* =========================================================
   BUSTUCHINUL DE ALTĂDATĂ — COMPARAȚII ȘI CARUSELE
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const sourceLocation = document.querySelector("[data-location-gallery]");

  if (sourceLocation) {
    const locations = [
      {
        old: "img/bustuchinul de altadata.webp",
        now: "img/bustuchin astazi.webp",
        oldAlt: "Centrul Bustuchinului în trecut",
        nowAlt: "Centrul Bustuchinului în prezent",
        number: "Locul nr. 01",
        title: "Centrul comunei Bustuchin",
        text: "Aceeași zonă, surprinsă în două momente diferite ale istoriei locale."
      },
      {
        old: "img/altadata/pojaru-atunci.webp",
        now: "img/altadata/pojaru-acum.webp",
        oldAlt: "Centrul satului Pojaru în trecut",
        nowAlt: "Centrul satului Pojaru în prezent",
        number: "Locul nr. 02",
        title: "Centrul satului Pojaru",
        text: "O privire comparativă asupra felului în care s-a schimbat vatra satului."
      },
      {
        old: "img/altadata/poiana-atunci.webp",
        now: "img/altadata/poiana-acum.webp",
        oldAlt: "Satul Poiana în trecut",
        nowAlt: "Satul Poiana în prezent",
        number: "Locul nr. 03",
        title: "Satul Poiana",
        text: "Drumurile, gospodăriile și peisajul local, păstrate în două epoci."
      },
      {
        old: "img/altadata/scoala-atunci.webp",
        now: "img/altadata/scoala-acum.webp",
        oldAlt: "Școala din Bustuchin în trecut",
        nowAlt: "Școala din Bustuchin în prezent",
        number: "Locul nr. 04",
        title: "Școala din Bustuchin",
        text: "Locul în care generații de copii au învățat, văzut ieri și astăzi."
      }
    ];

    const gallery = document.createElement("div");
    gallery.className = "memory-location-gallery";
    sourceLocation.before(gallery);
    sourceLocation.removeAttribute("data-location-gallery");

    locations.forEach((location, index) => {
      const card = index === 0 ? sourceLocation : sourceLocation.cloneNode(true);
      const images = card.querySelectorAll(".memory-compare__image img");
      images[0].src = location.old;
      images[0].alt = location.oldAlt;
      images[1].src = location.now;
      images[1].alt = location.nowAlt;
      card.querySelector(".memory-compare__caption > span").textContent = location.number;
      card.querySelector(".memory-compare__caption h4").textContent = location.title;
      card.querySelector(".memory-compare__caption p").textContent = location.text;
      card.classList.toggle("is-active", index === 0);
      card.hidden = index !== 0;
      card.setAttribute("aria-hidden", String(index !== 0));
      gallery.append(card);
    });

    const navigation = document.createElement("div");
    navigation.className = "memory-location-gallery__navigation";
    navigation.innerHTML = `
      <button type="button" data-location-prev aria-label="Locul anterior"><i class="fas fa-arrow-left"></i></button>
      <div class="memory-location-gallery__status">
        <span>Arhiva locurilor</span>
        <strong><b>01</b> / 04</strong>
      </div>
      <div class="memory-location-gallery__dots" aria-label="Alege un loc"></div>
      <button type="button" data-location-next aria-label="Locul următor"><i class="fas fa-arrow-right"></i></button>
    `;
    gallery.append(navigation);

    const cards = Array.from(gallery.querySelectorAll(":scope > .memory-compare"));
    const dots = navigation.querySelector(".memory-location-gallery__dots");
    cards.forEach((card, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Arată locul ${index + 1}`);
      dot.classList.toggle("is-active", index === 0);
      dots.append(dot);
    });

    let currentLocation = 0;
    const showLocation = (index) => {
      currentLocation = (index + cards.length) % cards.length;
      cards.forEach((card, cardIndex) => {
        const active = cardIndex === currentLocation;
        card.hidden = !active;
        card.classList.toggle("is-active", active);
        card.setAttribute("aria-hidden", String(!active));
      });
      Array.from(dots.children).forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === currentLocation));
      navigation.querySelector("strong b").textContent = String(currentLocation + 1).padStart(2, "0");
    };

    navigation.querySelector("[data-location-prev]").addEventListener("click", () => showLocation(currentLocation - 1));
    navigation.querySelector("[data-location-next]").addEventListener("click", () => showLocation(currentLocation + 1));
    Array.from(dots.children).forEach((dot, index) => dot.addEventListener("click", () => showLocation(index)));
  }

  document.querySelectorAll("[data-before-after]").forEach((comparison) => {
    const range = comparison.querySelector(".memory-compare__range");
    if (!range) return;

    const updateComparison = () => {
      comparison.style.setProperty("--compare-position", `${range.value}%`);
      range.setAttribute("aria-valuetext", `${range.value}% fotografie actuală`);
    };

    range.addEventListener("input", updateComparison);
    updateComparison();

    comparison.querySelectorAll(".memory-compare__image img").forEach((image) => {
      const frame = image.closest(".memory-compare__image");
      frame.dataset.placeholder = image.alt;
      const updateImageState = () => frame.classList.toggle("is-missing", !image.naturalWidth);
      if (image.complete) updateImageState();
      image.addEventListener("load", updateImageState);
      image.addEventListener("error", updateImageState);
    });
  });

  document.querySelectorAll("[data-memory-slider]").forEach((slider) => {
    const originalImage = slider.querySelector(":scope > img");
    const nowSource = slider.dataset.nowSrc;
    const title = slider.dataset.title || "Imagine";
    if (!originalImage || !nowSource) return;

    const track = document.createElement("div");
    track.className = "memory-mini-slider__track";

    const createSlide = (image, label, placeholder) => {
      const slide = document.createElement("figure");
      slide.className = "memory-mini-slider__slide";
      const badge = document.createElement("figcaption");
      badge.textContent = label;
      const emptyState = document.createElement("span");
      emptyState.className = "memory-mini-slider__placeholder";
      emptyState.innerHTML = `<i class="fas fa-image"></i><strong>${placeholder}</strong><small>Înlocuiește imaginea din dosarul img/altadata</small>`;
      slide.append(image, emptyState, badge);

      const updateState = () => slide.classList.toggle("is-missing", !image.naturalWidth);
      if (image.complete) updateState();
      image.addEventListener("load", updateState);
      image.addEventListener("error", updateState);
      return slide;
    };

    originalImage.remove();
    const nowImage = document.createElement("img");
    nowImage.src = nowSource;
    nowImage.alt = `${title} în prezent`;
    nowImage.loading = "lazy";

    track.append(
      createSlide(originalImage, "Altădată", `${title} — fotografie de altădată`),
      createSlide(nowImage, "Astăzi", `${title} — fotografie actuală`)
    );

    const controls = document.createElement("div");
    controls.className = "memory-mini-slider__controls";
    controls.innerHTML = `
      <button type="button" data-slide-prev aria-label="Imaginea anterioară"><i class="fas fa-arrow-left"></i></button>
      <span><b>1</b> / 2</span>
      <button type="button" data-slide-next aria-label="Imaginea următoare"><i class="fas fa-arrow-right"></i></button>
    `;
    slider.prepend(track);
    slider.append(controls);

    let currentSlide = 0;
    let touchStart = 0;
    const showSlide = (index) => {
      currentSlide = (index + 2) % 2;
      track.style.transform = `translateX(-${currentSlide * 50}%)`;
      controls.querySelector("b").textContent = String(currentSlide + 1);
    };

    controls.querySelector("[data-slide-prev]").addEventListener("click", () => showSlide(currentSlide - 1));
    controls.querySelector("[data-slide-next]").addEventListener("click", () => showSlide(currentSlide + 1));
    slider.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") showSlide(currentSlide - 1);
      if (event.key === "ArrowRight") showSlide(currentSlide + 1);
    });
    slider.addEventListener("touchstart", (event) => { touchStart = event.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", (event) => {
      const distance = event.changedTouches[0].clientX - touchStart;
      if (Math.abs(distance) > 45) showSlide(currentSlide + (distance < 0 ? 1 : -1));
    }, { passive: true });
    slider.tabIndex = 0;
    slider.setAttribute("role", "region");
    slider.setAttribute("aria-label", `Galerie: ${title}`);
  });
});

/* =========================================================
   CASELE DE CULTURĂ — GALERIE
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("case-de-cultura");
  const viewport = section?.querySelector(".culture-houses__viewport");
  const track = section?.querySelector(".culture-houses__track");
  const cards = track ? Array.from(track.children) : [];
  if (!section || !viewport || !track || !cards.length) return;

  let activeCard = 0;
  const counter = section.querySelector(".culture-houses__controls b");

  const updateGallery = (index) => {
    activeCard = Math.max(0, Math.min(cards.length - 1, index));
    cards[activeCard].scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
      inline: "start"
    });
    if (counter) counter.textContent = String(activeCard + 1).padStart(2, "0");
  };

  section.querySelector("[data-culture-prev]")?.addEventListener("click", () => updateGallery(activeCard - 1));
  section.querySelector("[data-culture-next]")?.addEventListener("click", () => updateGallery(activeCard + 1));

  viewport.addEventListener("scroll", () => {
    const nearest = cards.reduce((best, card, index) => {
      const distance = Math.abs(card.offsetLeft - viewport.scrollLeft);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Infinity });
    activeCard = nearest.index;
    if (counter) counter.textContent = String(activeCard + 1).padStart(2, "0");
  }, { passive: true });

  cards.forEach((card) => {
    const image = card.querySelector("img");
    const media = card.querySelector(".culture-house-card__media");
    if (!image || !media) return;
    media.dataset.placeholder = image.alt;
    const updateImageState = () => card.classList.toggle("is-missing-image", !image.naturalWidth);
    if (image.complete) updateImageState();
    image.addEventListener("load", updateImageState);
    image.addEventListener("error", updateImageState);
  });
});

/* =========================================================
   EXPERIENȚĂ DE EXPLORARE — PROGRES, MICRO-POVEȘTI ȘI AMBIANȚĂ
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const chapterData = [
    { id: "istorie", label: "Istorie", icon: "fa-book-open" },
    { id: "geografie", label: "Geografie", icon: "fa-mountain-sun" },
    { id: "sate", label: "Sate", icon: "fa-house-chimney" },
    { id: "religie", label: "Religie", icon: "fa-church" },
    { id: "patrimoniu", label: "Patrimoniu", icon: "fa-landmark" },
    { id: "evenimente", label: "Evenimente", icon: "fa-people-group" },
    { id: "turism", label: "Turism", icon: "fa-route" },
    { id: "educatie", label: "Educație", icon: "fa-graduation-cap" },
    { id: "infrastructura", label: "Infrastructură", icon: "fa-road" }
  ].map(chapter => ({ ...chapter, element: document.getElementById(chapter.id) }))
    .filter(chapter => chapter.element);

  const progress = document.querySelector(".scroll-progress");
  if (progress && chapterData.length) {
    progress.removeAttribute("aria-hidden");
    const guide = document.createElement("div");
    guide.className = "chapter-guide";
    guide.setAttribute("aria-live", "polite");
    guide.innerHTML = `
      <span class="chapter-guide__icon"><i class="fas fa-book-open" aria-hidden="true"></i></span>
      <span class="chapter-guide__copy"><small>Explorezi</small><strong>Introducere</strong></span>
      <span class="chapter-guide__count">0 / ${chapterData.length}</span>
      <span class="chapter-guide__percent">0%</span>
    `;
    progress.append(guide);

    let activeIndex = -1;
    const visited = new Set(JSON.parse(sessionStorage.getItem("bustuchinVisitedChapters") || "[]"));
    const updateGuide = () => {
      const point = window.scrollY + window.innerHeight * .34;
      let nextIndex = -1;
      chapterData.forEach((chapter, index) => {
        if (point >= chapter.element.offsetTop) nextIndex = index;
      });
      if (nextIndex >= 0) {
        visited.add(chapterData[nextIndex].id);
        sessionStorage.setItem("bustuchinVisitedChapters", JSON.stringify([...visited]));
      }
      if (nextIndex !== activeIndex) {
        activeIndex = nextIndex;
        const current = chapterData[Math.max(0, activeIndex)];
        guide.classList.remove("is-changing");
        void guide.offsetWidth;
        guide.classList.add("is-changing");
        guide.querySelector("i").className = `fas ${current.icon}`;
        guide.querySelector("strong").textContent = activeIndex < 0 ? "Introducere" : current.label;
        guide.querySelector(".chapter-guide__count").textContent =
          `${Math.max(0, activeIndex + 1)} / ${chapterData.length}`;
      }
      const total = document.documentElement.scrollHeight - innerHeight;
      const percent = total > 0 ? Math.round((scrollY / total) * 100) : 0;
      guide.querySelector(".chapter-guide__percent").textContent = `${Math.max(0, Math.min(100, percent))}%`;
      updateEpilogue();
    };

    let guideTicking = false;
    addEventListener("scroll", () => {
      if (guideTicking) return;
      guideTicking = true;
      requestAnimationFrame(() => {
        updateGuide();
        guideTicking = false;
      });
    }, { passive: true });
    addEventListener("resize", updateGuide, { passive: true });

    const epilogueMessage = document.querySelector(".site-epilogue__message");
    let explorationStatus = null;
    const updateEpilogue = () => {
      if (!epilogueMessage) return;
      if (!explorationStatus) {
        explorationStatus = document.createElement("div");
        explorationStatus.className = "exploration-summary";
        explorationStatus.innerHTML = `
          <i class="fas fa-compass" aria-hidden="true"></i>
          <div><span>Jurnalul explorării</span><strong></strong><nav aria-label="Capitole încă nevizitate"></nav></div>
        `;
        epilogueMessage.querySelector(".site-epilogue__actions")?.before(explorationStatus);
      }
      const missing = chapterData.filter(chapter => !visited.has(chapter.id));
      explorationStatus.querySelector("strong").textContent =
        `Ai parcurs ${visited.size} dintre cele ${chapterData.length} capitole.`;
      explorationStatus.querySelector("nav").innerHTML = missing.length
        ? `<span>Mai poți descoperi:</span> ${missing.slice(0, 4).map(chapter =>
            `<a href="#${chapter.id}">${chapter.label}</a>`).join("")}`
        : "<span>Ai descoperit întreaga monografie.</span>";
    };
    updateGuide();
  }

  const facts = [
    {
      after: "istorie",
      icon: "fa-scroll",
      label: "Știai că?",
      question: "Primele repere documentare ale zonei coboară până în anul 1516.",
      answer: "În jurul vechilor așezări s-au format treptat satele și cătunele care alcătuiesc comuna de astăzi."
    },
    {
      after: "geografie",
      icon: "fa-water",
      label: "De reținut",
      question: "Valea Amaradiei a modelat atât relieful, cât și așezarea comunităților.",
      answer: "Apa, terasele și drumurile naturale ale văii au influențat dezvoltarea satelor și ocupațiile locuitorilor."
    },
    {
      after: "sate",
      icon: "fa-people-roof",
      label: "O comună, opt sate",
      question: "Bustuchinul este alcătuit din opt comunități cu povești și identități proprii.",
      answer: "Bustuchin, Cionți, Motorgi, Nămete, Pojaru, Poiana-Seciuri, Poienița și Valea Pojarului formează împreună comuna."
    }
  ];

  facts.forEach(fact => {
    const section = document.getElementById(fact.after);
    if (!section || document.querySelector(`[data-fact-after="${fact.after}"]`)) return;
    const card = document.createElement("aside");
    card.className = "discovery-fact reveal";
    card.dataset.factAfter = fact.after;
    card.innerHTML = `
      <button type="button" class="discovery-fact__button" aria-expanded="false">
        <span class="discovery-fact__icon"><i class="fas ${fact.icon}" aria-hidden="true"></i></span>
        <span class="discovery-fact__front"><small>${fact.label}</small><strong>${fact.question}</strong></span>
        <span class="discovery-fact__action">Descoperă <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
      </button>
      <div class="discovery-fact__answer" hidden><p>${fact.answer}</p></div>
    `;
    section.insertAdjacentElement("afterend", card);
    const button = card.querySelector("button");
    const answer = card.querySelector(".discovery-fact__answer");
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      card.classList.toggle("is-open", !open);
      answer.hidden = open;
      card.querySelector(".discovery-fact__action").firstChild.textContent = open ? "Descoperă " : "Închide ";
    });
  });

  const mobileReadingQuery = matchMedia("(max-width: 768px)");
  const initializeMobileReading = () => {
    if (!mobileReadingQuery.matches) return;
    document.querySelectorAll(".longform__text").forEach(text => {
      /* Unele capitole sunt ascunse la încărcare și au scrollHeight 0.
         Lungimea conținutului rămâne însă disponibilă și este un criteriu stabil. */
      const isLongStory = text.textContent.trim().length >= 650 || text.children.length >= 3;
      if (!isLongStory || text.dataset.readable === "true") return;
      text.dataset.readable = "true";
      text.classList.add("longform__text--collapsible", "is-collapsed");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "longform__toggle";
      button.setAttribute("aria-expanded", "false");
      button.innerHTML = '<span>Continuă povestea</span><i class="fas fa-chevron-down" aria-hidden="true"></i>';
      text.after(button);
      button.addEventListener("click", () => {
        const collapsed = text.classList.toggle("is-collapsed");
        button.setAttribute("aria-expanded", String(!collapsed));
        button.querySelector("span").textContent = collapsed ? "Continuă povestea" : "Restrânge textul";
      });
    });
  };
  initializeMobileReading();
  mobileReadingQuery.addEventListener?.("change", initializeMobileReading);

  const mappedPlaces = [
    "bustuchin", "cionti", "motorgi", "namete", "poiana-seciuri", "poienita", "pojaru",
    "valea-pojarului", "fantana-rece", "lacurile-de-la-poiana", "dealul-muierii",
    "biserica-bustuchin", "biserica-pojaru", "biserica-valea-pojarului", "biserica-poienita",
    "biserica-poiana", "biserica-din-valea-pojarului", "liceul-tehnologic-bustuchin",
    "scoala-poiana-seciuri", "scoala-primara-nr2", "gradinita-program-prelungit",
    "gradinita-nr2", "centru-persoane-varstnice", "infrastructura-locativa",
    "infrastructura-medicala", "infrastructura-culturala"
  ];
  mappedPlaces.forEach(id => {
    const place = document.getElementById(id);
    if (!place || place.querySelector(":scope > .context-map-link")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "context-map-link";
    button.innerHTML = '<i class="fas fa-location-dot" aria-hidden="true"></i><span>Vezi acest loc pe hartă</span>';
    button.addEventListener("click", () => {
      const mapSection = document.getElementById("harta-comunei");
      const transition = document.getElementById("pageTransition");
      if (!mapSection) return;

      transition?.classList.add("active");
      transition?.setAttribute("aria-hidden", "false");
      history.pushState(null, "", "#harta-comunei");

      window.setTimeout(() => {
        const navbar = document.getElementById("navbar");
        const navbarHeight = navbar?.getBoundingClientRect().height || 62;
        const navbarTop = Number.parseFloat(getComputedStyle(navbar).top) || 10;
        const destination = Math.max(
          0,
          mapSection.getBoundingClientRect().top + scrollY - navbarHeight - navbarTop - 14
        );
        scrollTo({ top: destination, behavior: "auto" });
        window.focusBustuchinMapLocation?.(id);
      }, 190);

      window.setTimeout(() => {
        transition?.classList.remove("active");
        transition?.setAttribute("aria-hidden", "true");
      }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 380 : 780);
    });
    place.prepend(button);
  });

  const soundButton = document.createElement("button");
  soundButton.type = "button";
  soundButton.className = "ambient-toggle";
  soundButton.setAttribute("aria-pressed", "false");
  soundButton.setAttribute("aria-label", "Pornește ambianța sonoră");
  soundButton.innerHTML = '<i class="fas fa-volume-xmark" aria-hidden="true"></i><span>Ambianță</span>';
  document.body.append(soundButton);

  const chapterGuide = document.querySelector(".chapter-guide");
  const mapButton = document.getElementById("floatingMapButton");
  if (chapterGuide && mapButton) {
    const dock = document.createElement("aside");
    dock.className = "explorer-dock";
    dock.setAttribute("aria-label", "Instrumente pentru explorarea monografiei");

    const ticker = document.createElement("div");
    ticker.className = "explorer-dock__ticker";
    ticker.setAttribute("aria-label", "Repere despre comuna Bustuchin");
    const tickerItems = [
      "Opt sate, o singură comunitate",
      "Comuna reunește satele Bustuchin, Cionți, Motorgi și Nămete",
      "Pojaru, Poiana-Seciuri, Poienița și Valea Pojarului completează comuna",
      "Bustuchin este satul de reședință și centrul administrativ al comunei",
      "Valea Amaradiei unește locurile și poveștile comunei",
      "Primele repere documentare ale zonei coboară până în anul 1516",
      "Un document emis la 3 noiembrie 1516 amintește vechi așezări ale zonei",
      "Reforma administrativă din 1968 a stabilit structura actuală a comunei",
      "Comuna Bustuchin se întinde pe o suprafață de 6.096 de hectare",
      "Așezarea comunei urmărește cursul superior al râului Amaradia",
      "Râul Amaradia este un afluent important al Jiului",
      "Amaradia are o lungime de aproximativ 99 de kilometri",
      "Relieful comunei este predominant colinar",
      "Unele culmi depășesc altitudinea de 500 de metri",
      "Relieful păstrează trăsăturile zonei subcarpatice a Gorjului",
      "Temperatura medie anuală este cuprinsă aproximativ între 8,7 și 11 grade Celsius",
      "În documentarea climatică apar valori extreme de până la minus 31 de grade Celsius",
      "Precipitațiile medii anuale variază aproximativ între 550 și 750 de milimetri",
      "În episoadele abundente, precipitațiile pot depăși 80 de milimetri în 24 de ore",
      "Vara, temperatura apei poate ajunge la aproximativ 23 de grade Celsius",
      "Amaradia este completată de numeroși afluenți și pâraie locale",
      "Versanții nordici păstrează mai multă umiditate decât cei însoriți",
      "Pădurile de gorun sunt caracteristice peisajului local",
      "Biserica de lemn din Strâmba–Valea Pojarului este înscrisă în Lista Monumentelor Istorice",
      "Biserica de lemn din Valea Pojarului a fost ridicată în anul 1737",
      "Lăcașul de lemn are hramul Nașterea Maicii Domnului",
      "Tradiția spune că biserica a fost construită pe malul stâng al pârâului Strâmba",
      "Biserica a fost strămutată la sfârșitul secolului al XVIII-lea",
      "Planul bisericii este dreptunghiular, cu altar poligonal în cinci laturi",
      "Sărbătoarea hramului este legată de ziua de 8 septembrie",
      "Bisericile comunei păstrează continuitatea vieții spirituale",
      "Pădurile, apele și dealurile alcătuiesc identitatea naturală a locului",
      "Solurile și relieful au susținut agricultura și pomicultura",
      "Livezile și culturile au fost mult timp în centrul vieții gospodăriilor",
      "Fântânile și cișmelele au fost locuri importante pentru comunitate",
      "Drumurile de pământ și căruțele făceau parte din peisajul de odinioară",
      "Casele tradiționale foloseau materiale locale, prispe, curți și grădini",
      "Nunțile păstrau cântece, costume și ritualuri transmise între generații",
      "Hora satului era deopotrivă joc, întâlnire și expresie a identității",
      "Petrolul, gazele naturale și lignitul au influențat dezvoltarea economică a comunei",
      "Industria petrolieră a adus locuri de muncă și transformări sociale",
      "Lampa cu petrol amintește viața gospodăriilor de dinaintea electrificării",
      "Portul popular păstrează o legătură directă cu tradițiile locale",
      "Documentele de familie pot completa povestea oficială a comunei",
      "Albumele vechi păstrează chipurile și viața generațiilor trecute",
      "Fotografiile comparative arată felul în care s-au schimbat locurile",
      "Arhiva digitală adună imagini, obiecte și mărturii locale",
      "Festivalul Iustina Băluțeanu păstrează vie memoria interpretei",
      "Festivalul Ștefan Popescu celebrează muzica și valoarea artistică",
      "Zilele Comunei aduc împreună locuitori, artiști și vizitatori",
      "Muzica, dansul și portul popular dau continuitate tradițiilor",
      "Profesorul Haralambie Bodescu a contribuit la formarea unor generații",
      "Școlile Bustuchinului duc povestea comunității către noile generații",
      "Liceul Tehnologic Bustuchin oferă pregătire teoretică și practică",
      "Școlile și grădinițele formează rețeaua educațională locală",
      "Programul prelungit sprijină educația și rutina zilnică a preșcolarilor",
      "Drumurile județene DJ 675A și DJ 675C susțin legăturile comunei",
      "DJ 675C asigură conexiunea cu drumul național DN 67B",
      "Drumurile comunale și vicinale asigură accesul către cele opt sate",
      "Rețelele de apă, energie și gaze fac parte din modernizarea comunei",
      "Telecomunicațiile facilitează accesul la educație și servicii digitale",
      "Cabinetele medicale susțin accesul local la servicii de sănătate",
      "Centrul pentru persoane vârstnice completează infrastructura socială",
      "Parcurile și locurile de joacă oferă spații pentru comunitate",
      "Terenurile de sport susțin mișcarea și întâlnirile dintre generații",
      "Casele de cultură găzduiesc spectacole, festivaluri și evenimente locale",
      "Proiectele de locuințe au adăugat noi opțiuni pentru familii și tineri",
      "Colectarea responsabilă a deșeurilor face parte din modernizarea locală",
      "Tradițiile locale sunt păstrate prin muzică, dans, port popular și sărbători",
      "Harta interactivă reunește satele, școlile, bisericile și obiectivele comunei",
      "Atlasul local cuprinde 27 de locuri care pot fi filtrate și explorate",
      "Fiecare sat are o poveste proprie în cadrul aceleiași comunități",
      "Traseele locale leagă patrimoniul cultural de peisajul natural",
      "Fotografiile de altădată păstrează memoria locurilor și a familiilor",
      "Descoperă patrimoniul, oamenii și natura Bustuchinului"
    ];
    const tickerStories = [];
    for (let index = 0; index < tickerItems.length; index += 2) {
      const first = tickerItems[index];
      const second = tickerItems[index + 1] || tickerItems[0];
      tickerStories.push(`${first}. ${second}.`);
    }
    const tickerMarkup = [...tickerStories, ...tickerStories]
      .map(item => `<span>${item}</span><i aria-hidden="true"></i>`)
      .join("");
    ticker.innerHTML = `
      <span class="explorer-dock__live"><img src="img/logo.png" alt="" aria-hidden="true"> Info</span>
      <div class="explorer-dock__ticker-window">
        <div class="explorer-dock__ticker-track" aria-hidden="true">${tickerMarkup}</div>
      </div>
    `;

    document.body.append(dock);
    dock.append(ticker, chapterGuide, mapButton, soundButton);

    /* Căutare editorială în întreaga monografie, deschisă din indicatorul Explorezi. */
    chapterGuide.setAttribute("role", "button");
    chapterGuide.setAttribute("tabindex", "0");
    chapterGuide.setAttribute("aria-haspopup", "dialog");
    chapterGuide.setAttribute("aria-label", "Caută în monografia comunei Bustuchin");

    const searchPanel = document.createElement("div");
    searchPanel.className = "site-search";
    searchPanel.hidden = true;
    searchPanel.innerHTML = `
      <div class="site-search__backdrop" data-search-close></div>
      <section class="site-search__panel" role="dialog" aria-modal="true" aria-labelledby="site-search-title">
        <header class="site-search__header">
          <span class="site-search__crest"><img src="img/logo.png" alt=""></span>
          <span><small>ATLASUL MONOGRAFIEI</small><strong id="site-search-title">Descoperă în pagină</strong></span>
          <button type="button" class="site-search__close" data-search-close aria-label="Închide căutarea"><i class="fas fa-xmark" aria-hidden="true"></i></button>
        </header>
        <label class="site-search__field">
          <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
          <input type="search" autocomplete="off" placeholder="Caută un sat, o persoană, un loc…" aria-label="Caută în monografie">
          <kbd>ESC</kbd>
        </label>
        <div class="site-search__meta"><span>Rezultate din toate capitolele</span><b></b></div>
        <div class="site-search__results" role="list"></div>
      </section>
    `;
    document.body.append(searchPanel);

    const normalizeSearch = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const indexedTargets = [];
    const indexedKeys = new Set();
    document.querySelectorAll("main h2, main h3, main h4").forEach(heading => {
      const target = heading.id ? heading : heading.closest("[id]");
      if (!target?.id || indexedKeys.has(`${target.id}:${heading.textContent.trim()}`)) return;
      const title = heading.textContent.replace(/\s+/g, " ").trim();
      const paragraph = heading.parentElement?.querySelector("p") || target.querySelector("p");
      const description = paragraph?.textContent.replace(/\s+/g, " ").trim() || "Deschide acest reper din monografie.";
      const chapter = chapterData.find(item => target.closest(`#${item.id}`));
      indexedKeys.add(`${target.id}:${title}`);
      indexedTargets.push({ id: target.id, title, description, chapter: chapter?.label || "Monografie" });
    });

    const searchInput = searchPanel.querySelector("input");
    const searchResults = searchPanel.querySelector(".site-search__results");
    const searchCount = searchPanel.querySelector(".site-search__meta b");
    const renderSearchResults = query => {
      const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
      const matches = indexedTargets.filter(item => {
        const haystack = normalizeSearch(`${item.title} ${item.description} ${item.chapter}`);
        return words.every(word => haystack.includes(word));
      }).slice(0, 12);
      searchCount.textContent = `${matches.length} ${matches.length === 1 ? "rezultat" : "rezultate"}`;
      searchResults.innerHTML = matches.length
        ? matches.map(item => `
          <a href="#${item.id}" class="site-search__result" role="listitem">
            <span class="site-search__result-icon"><i class="fas fa-arrow-turn-down" aria-hidden="true"></i></span>
            <span><small>${item.chapter}</small><strong>${item.title}</strong><em>${item.description}</em></span>
            <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </a>`).join("")
        : '<p class="site-search__empty"><i class="fas fa-feather-pointed" aria-hidden="true"></i><strong>Niciun reper găsit</strong><span>Încearcă un termen mai scurt sau o altă denumire.</span></p>';
    };
    const closeSearch = () => {
      searchPanel.classList.remove("is-open");
      document.body.classList.remove("search-open");
      setTimeout(() => { searchPanel.hidden = true; }, 220);
      chapterGuide.focus();
    };
    const openSearch = () => {
      searchPanel.hidden = false;
      document.body.classList.add("search-open");
      renderSearchResults("");
      requestAnimationFrame(() => {
        searchPanel.classList.add("is-open");
        searchInput.focus();
      });
    };
    chapterGuide.addEventListener("click", openSearch);
    chapterGuide.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSearch();
      }
    });
    searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));
    searchPanel.addEventListener("click", event => {
      if (event.target.closest("[data-search-close]")) closeSearch();
      if (event.target.closest(".site-search__result")) closeSearch();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !searchPanel.hidden) closeSearch();
    });
  }

  let audioContext;
  let ambientNodes = [];
  let ambientTimers = [];
  const stopAmbient = () => {
    ambientTimers.forEach(timer => clearTimeout(timer));
    ambientTimers = [];
    ambientNodes.forEach(node => {
      try { node.stop?.(); } catch (_) {}
      try { node.disconnect?.(); } catch (_) {}
    });
    ambientNodes = [];
    audioContext?.close();
    audioContext = null;
    soundButton.classList.remove("is-active");
    soundButton.setAttribute("aria-pressed", "false");
    soundButton.setAttribute("aria-label", "Pornește ambianța sonoră");
    soundButton.querySelector("i")?.classList.replace("fa-volume-high", "fa-volume-xmark");
  };
  const startAmbient = () => {
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) return;
    audioContext = new AudioEngine();
    const master = audioContext.createGain();
    master.gain.value = .125;
    master.connect(audioContext.destination);

    const createNoiseBuffer = seconds => {
      const buffer = audioContext.createBuffer(1, audioContext.sampleRate * seconds, audioContext.sampleRate);
      const channel = buffer.getChannelData(0);
      let previous = 0;
      for (let index = 0; index < channel.length; index += 1) {
        const white = Math.random() * 2 - 1;
        previous = previous * .985 + white * .015;
        channel[index] = previous * 3.2;
      }
      return buffer;
    };

    /* Foșnetul pădurii — zgomot filtrat, modulat foarte lent. */
    const breeze = audioContext.createBufferSource();
    const windFilter = audioContext.createBiquadFilter();
    const breezeGain = audioContext.createGain();
    const windLfo = audioContext.createOscillator();
    const windDepth = audioContext.createGain();
    breeze.buffer = createNoiseBuffer(4);
    breeze.loop = true;
    windFilter.type = "lowpass";
    windFilter.frequency.value = 780;
    breezeGain.gain.value = .42;
    windLfo.frequency.value = .09;
    windDepth.gain.value = .16;
    windLfo.connect(windDepth).connect(breezeGain.gain);
    breeze.connect(windFilter).connect(breezeGain).connect(master);
    breeze.start();
    windLfo.start();

    /* Apa — un strat mai luminos și continuu, asemenea unui pârâu îndepărtat. */
    const water = audioContext.createBufferSource();
    const waterFilter = audioContext.createBiquadFilter();
    const waterGain = audioContext.createGain();
    const waterLfo = audioContext.createOscillator();
    const waterDepth = audioContext.createGain();
    water.buffer = createNoiseBuffer(3);
    water.loop = true;
    waterFilter.type = "bandpass";
    waterFilter.frequency.value = 1450;
    waterFilter.Q.value = .7;
    waterGain.gain.value = .22;
    waterLfo.frequency.value = .21;
    waterDepth.gain.value = .07;
    waterLfo.connect(waterDepth).connect(waterGain.gain);
    water.connect(waterFilter).connect(waterGain).connect(master);
    water.start();
    waterLfo.start();

    /* Frunziș apropiat — adaugă profunzime pădurii fără a acoperi celelalte sunete. */
    const leaves = audioContext.createBufferSource();
    const leavesFilter = audioContext.createBiquadFilter();
    const leavesGain = audioContext.createGain();
    leaves.buffer = createNoiseBuffer(2);
    leaves.loop = true;
    leavesFilter.type = "highpass";
    leavesFilter.frequency.value = 2600;
    leavesGain.gain.value = .055;
    leaves.connect(leavesFilter).connect(leavesGain).connect(master);
    leaves.start();

    /* Picături neregulate, pentru senzația unui fir de apă aflat în apropiere. */
    const waterDrop = () => {
      if (!audioContext) return;
      const now = audioContext.currentTime;
      const drop = audioContext.createOscillator();
      const dropGain = audioContext.createGain();
      drop.type = "sine";
      drop.frequency.setValueAtTime(720 + Math.random() * 420, now);
      drop.frequency.exponentialRampToValueAtTime(310 + Math.random() * 100, now + .12);
      dropGain.gain.setValueAtTime(.09, now);
      dropGain.gain.exponentialRampToValueAtTime(.001, now + .16);
      drop.connect(dropGain).connect(master);
      drop.start(now);
      drop.stop(now + .17);
      ambientTimers.push(setTimeout(waterDrop, 700 + Math.random() * 1900));
    };
    ambientTimers.push(setTimeout(waterDrop, 500));

    /* Păsări cu triluri diferite: mierlă, pitulice și cuc, distribuite în spațiul stereo. */
    const birdCall = () => {
      if (!audioContext) return;
      const now = audioContext.currentTime;
      const callGain = audioContext.createGain();
      const panner = audioContext.createStereoPanner?.();
      const profiles = [
        { notes: 4, spacing: .17, duration: .18, base: 1550, spread: 700, wave: "sine", rise: 1.55, fall: .9 },
        { notes: 6, spacing: .105, duration: .12, base: 2350, spread: 850, wave: "sine", rise: 1.28, fall: .82 },
        { notes: 2, spacing: .34, duration: .3, base: 720, spread: 100, wave: "triangle", rise: .82, fall: .72 }
      ];
      const profile = profiles[Math.floor(Math.random() * profiles.length)];
      callGain.gain.setValueAtTime(0, now);
      if (panner) {
        panner.pan.value = Math.random() * 1.7 - .85;
        callGain.connect(panner).connect(master);
      } else {
        callGain.connect(master);
      }

      for (let index = 0; index < profile.notes; index += 1) {
        const start = now + index * profile.spacing;
        const oscillator = audioContext.createOscillator();
        const noteGain = audioContext.createGain();
        const base = profile.base + Math.random() * profile.spread;
        oscillator.type = profile.wave;
        oscillator.frequency.setValueAtTime(base, start);
        oscillator.frequency.exponentialRampToValueAtTime(base * profile.rise, start + profile.duration * .38);
        oscillator.frequency.exponentialRampToValueAtTime(base * profile.fall, start + profile.duration);
        noteGain.gain.setValueAtTime(0, start);
        noteGain.gain.linearRampToValueAtTime(.25, start + .018);
        noteGain.gain.exponentialRampToValueAtTime(.001, start + profile.duration);
        oscillator.connect(noteGain).connect(callGain);
        oscillator.start(start);
        oscillator.stop(start + profile.duration + .01);
      }
      callGain.gain.setValueAtTime(.7, now);
      callGain.gain.exponentialRampToValueAtTime(.001, now + profile.notes * profile.spacing + .3);
      const nextBird = setTimeout(birdCall, 2300 + Math.random() * 4700);
      ambientTimers.push(nextBird);
    };

    /* Ciocănitoare îndepărtată — serii scurte și rare, pentru un fundal mai viu. */
    const woodpecker = () => {
      if (!audioContext) return;
      const now = audioContext.currentTime;
      const panner = audioContext.createStereoPanner?.();
      const output = audioContext.createGain();
      output.gain.value = .22;
      if (panner) {
        panner.pan.value = Math.random() * 1.6 - .8;
        output.connect(panner).connect(master);
      } else output.connect(master);
      const taps = 5 + Math.floor(Math.random() * 5);
      for (let index = 0; index < taps; index += 1) {
        const start = now + index * .075;
        const tap = audioContext.createOscillator();
        const tapGain = audioContext.createGain();
        tap.type = "square";
        tap.frequency.value = 1050 + Math.random() * 280;
        tapGain.gain.setValueAtTime(.12, start);
        tapGain.gain.exponentialRampToValueAtTime(.001, start + .026);
        tap.connect(tapGain).connect(output);
        tap.start(start);
        tap.stop(start + .03);
      }
      ambientTimers.push(setTimeout(woodpecker, 9000 + Math.random() * 12000));
    };

    ambientTimers.push(setTimeout(birdCall, 650 + Math.random() * 1000));
    ambientTimers.push(setTimeout(woodpecker, 5000 + Math.random() * 5000));
    ambientNodes.push(
      breeze, windFilter, breezeGain, windLfo, windDepth,
      water, waterFilter, waterGain, waterLfo, waterDepth,
      leaves, leavesFilter, leavesGain, master
    );
    soundButton.classList.add("is-active");
    soundButton.setAttribute("aria-pressed", "true");
    soundButton.setAttribute("aria-label", "Oprește ambianța sonoră");
    soundButton.querySelector("i")?.classList.replace("fa-volume-xmark", "fa-volume-high");
  };
  soundButton.addEventListener("click", () => {
    if (!audioContext) {
      startAmbient();
    } else if (audioContext.state === "suspended") {
      audioContext.resume();
    } else {
      stopAmbient();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && audioContext) stopAmbient();
  });
});
