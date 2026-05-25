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

      if(isTouchDevice){

        e.preventDefault();



        /* CLOSE OTHERS */

        dropdowns.forEach(item => {

          if(item !== dropdown){

            item.classList.remove("active");

          }

        });



        /* TOGGLE CURRENT */

        dropdown.classList.toggle("active");

      }

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