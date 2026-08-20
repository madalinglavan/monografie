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



  /* =========================================================
     MOBILE MENU
  ========================================================= */

  if(menuToggle && navLinks){

    menuToggle.addEventListener("click", () => {

      navLinks.classList.toggle("active");

      menuToggle.classList.toggle("active");

      document.body.classList.toggle("menu-open");

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



      /* CLOSE DROPDOWNS */

      dropdowns.forEach(dropdown => {

        dropdown.classList.remove("active");

      });

    }

  });


/* =========================================================
   CLOSE MENU WHEN CLICK REAL NAV LINKS
========================================================= */

document
  .querySelectorAll(".nav__dropdown-menu a, .nav__links > a")
  .forEach(link => {

    link.addEventListener("click", () => {

      if(window.matchMedia("(hover: none)").matches){

        navLinks.classList.remove("active");

        menuToggle.classList.remove("active");

        document.body.classList.remove("menu-open");



        /* CLOSE DROPDOWNS */

        dropdowns.forEach(dropdown => {

          dropdown.classList.remove("active");

        });

      }

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

  const playBtn =
    document.getElementById("playVideoBtn");

  const stopBtn =
    document.getElementById("stopVideoBtn");

  const heroVideo =
    document.getElementById("heroVideo");

  const heroIframe =
    document.getElementById("heroIframe");

  const heroBg =
    document.getElementById("heroBg");

  const heroContent =
    document.getElementById("heroContent");



  const youtubeVideoId =
    "_gEYWhsmpBc";



  if(
    playBtn &&
    stopBtn &&
    heroVideo &&
    heroIframe &&
    heroBg &&
    heroContent
  ){

    /* PLAY */

    playBtn.addEventListener("click", () => {

      heroVideo.classList.add("active");

      heroBg.style.display = "none";

      heroIframe.src =
`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&controls=0&loop=1&playlist=${youtubeVideoId}&modestbranding=1&rel=0&playsinline=1`;

      heroContent.classList.add("hidden");

      playBtn.classList.add("hidden");

      stopBtn.classList.remove("hidden");

    });



    /* STOP */

    stopBtn.addEventListener("click", () => {

      stopHeroVideo();

    });

  }



  /* =========================================================
     STOP HERO VIDEO FUNCTION
  ========================================================= */

  function stopHeroVideo(){

    heroVideo.classList.remove("active");

    heroBg.style.display = "block";

    heroIframe.src = "";

    heroContent.classList.remove("hidden");

    stopBtn.classList.add("hidden");

    playBtn.classList.remove("hidden");

  }



  /* =========================================================
     AUTO STOP VIDEO ON SCROLL
  ========================================================= */

  const heroSection =
    document.querySelector(".hero");



  if(heroSection && heroVideo){

    const heroObserver =
      new IntersectionObserver((entries) => {

        entries.forEach(entry => {

          if(
            !entry.isIntersecting &&
            heroVideo.classList.contains("active")
          ){

            stopHeroVideo();

          }

        });

      },{
        threshold:0.15
      });

    heroObserver.observe(heroSection);

  }

});








/* =========================================================
   REVEAL ON SCROLL
========================================================= */

const reveals =
  document.querySelectorAll(".reveal");

const revealObserver =
  new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if(entry.isIntersecting){

        entry.target.classList.add("active");

      }

    });

  },{
    threshold:0.15
  });

reveals.forEach(reveal => {

  revealObserver.observe(reveal);

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
         id: "biserica-pojaru",
         name: "Biserica Pojaru",
         category: "religion",
         lat: 44.945505,
         lng: 23.707883


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
         id: "gradinita-program-prelungit",
         name: "Grădinița cu Program Prelungit",
         category: "education",
         lat: 44.952288,
         lng: 23.713439


       }
,
       {
         id: "scoala-poiana-seciuri",
         name: "Școala Gimnazială Poiana-Seciuri",
         category: "education",
         lat: 45.001266,
         lng: 23.724950
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