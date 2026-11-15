(function() {
  // 1. Loader dismissal
  var loader = document.getElementById('loader');
  function hideLoader() {
    if (loader) loader.classList.add('hidden');
  }
  window.addEventListener('load', function() {
    setTimeout(hideLoader, 300);
  });
  setTimeout(hideLoader, 1000);

  // 2. Staggered Scroll-Reveal Observer
  var reveals = document.querySelectorAll('.reveal, .card, .directory-card');
  for (var i = 0; i < reveals.length; i++) {
    reveals[i].classList.add('reveal');
    reveals[i].style.transitionDelay = ((i % 4) * 0.08) + 's';
  }

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(function(el) { obs.observe(el); });
  } else {
    reveals.forEach(function(el) { el.classList.add('visible'); });
  }

  // 3. Inertial Smooth Wheel Scroll & Subtle Art Parallax (Desktop)
  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sun = document.querySelector('.home-sun');
  var archBack = document.querySelector('.home-arch-back');

  if (!isTouch && !reduceMotion) {
    var currentY = window.scrollY;
    var targetY = window.scrollY;
    var ease = 0.095;
    var ticking = false;

    window.addEventListener('wheel', function(e) {
      e.preventDefault();
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetY = Math.max(0, Math.min(targetY + e.deltaY, maxScroll));
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(smoothStep);
      }
    }, { passive: false });

    window.addEventListener('scroll', function() {
      if (!ticking) {
        currentY = targetY = window.scrollY;
      }
      if (sun && window.scrollY < 700) {
        sun.style.transform = 'translateY(' + (window.scrollY * 0.08) + 'px)';
      }
      if (archBack && window.scrollY < 700) {
        archBack.style.transform = 'translateY(' + (window.scrollY * -0.04) + 'px)';
      }
    }, { passive: true });

    function smoothStep() {
      currentY += (targetY - currentY) * ease;
      window.scrollTo(0, currentY);
      if (Math.abs(targetY - currentY) > 0.5) {
        requestAnimationFrame(smoothStep);
      } else {
        window.scrollTo(0, targetY);
        ticking = false;
      }
    }
  }

  // 4. Interactive 3D Tilt on .home-art Card
  var artCard = document.querySelector('.home-art');
  if (artCard && !isTouch && !reduceMotion) {
    artCard.addEventListener('mousemove', function(e) {
      var rect = artCard.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      artCard.style.transform = 'perspective(800px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg)';
      if (sun) sun.style.transform = 'translate(' + (x * 14) + 'px, ' + (y * 14) + 'px)';
    });
    artCard.addEventListener('mouseleave', function() {
      artCard.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
      if (sun) sun.style.transform = 'translate(0, 0)';
    });
  }
})();
