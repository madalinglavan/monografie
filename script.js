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



    currentContainer.innerHTML = `

      <div class="weather-current__main">

        <img
          class="weather-current__icon"
          src="https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png"
          alt="${current.weather[0].description}">

        <div>

          <div class="weather-current__temp">

            ${Math.round(current.main.temp)}°C

          </div>

          <div class="weather-current__desc">

            ${current.weather[0].description}

          </div>

        </div>

      </div>



      <div class="weather-current__details">

        <div class="weather-detail">

          <span class="weather-detail__label">
            Se simte ca
          </span>

          <span class="weather-detail__value">
            ${Math.round(current.main.feels_like)}°C
          </span>

        </div>



        <div class="weather-detail">

          <span class="weather-detail__label">
            Umiditate
          </span>

          <span class="weather-detail__value">
            ${current.main.humidity}%
          </span>

        </div>



        <div class="weather-detail">

          <span class="weather-detail__label">
            Vânt
          </span>

          <span class="weather-detail__value">
            ${Math.round(current.wind.speed * 3.6)} km/h
          </span>

        </div>



        <div class="weather-detail">

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

          <div class="weather-card">

            <img
              class="weather-icon"
              src="https://openweathermap.org/img/wn/${weather.icon}@2x.png"
              alt="${weather.description}">

            <h3 class="weather-day">

              ${weekday}

            </h3>

            <div class="weather-desc">

              ${weather.description}

            </div>

            <br>

            <div class="weather-max">

              ↑ ${Math.round(maxTemp)}°C

            </div>

            <div class="weather-min">

              ↓ ${Math.round(minTemp)}°C

            </div>

            <br>

            <div>

              🌧️ ${Math.round(rainChance)}%

            </div>

            <div>

              💨 ${Math.round(wind * 3.6)} km/h

            </div>

          </div>

        `;

      });

  }

  catch(error){

    console.error(error);

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

      magazineViewer.src = pdf;
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
    transition.className = "chapter-transition";
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
