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
  document.querySelectorAll(".stats__number");



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