document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================
     1. INTRO LOADER ANIMATION
     ========================================== */
  const loader = document.getElementById('loader');
  
  // 로더가 정상 작동하도록 안전 장치로 window load 이벤트 바인딩
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) {
        loader.classList.add('fade-out');
        // 애니메이션 끝나고 DOM 공간 차지하지 않도록 처리
        setTimeout(() => {
          loader.style.display = 'none';
        }, 600);
      }
    }, 1500); // 1.5초 정도 고급스러운 로고 및 로딩 모션을 감상하도록 딜레이
  });

  // 혹시 window load가 너무 오래 걸릴 경우 5초 후 강제 종료
  setTimeout(() => {
    if (loader && !loader.classList.contains('fade-out')) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 600);
    }
  }, 5000);

  /* ==========================================
     2. DARK / LIGHT THEME TOGGLE
     ========================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';

  // 초기 테마 설정
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  // 테마 전환 이벤트
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  /* ==========================================
     3. SCROLL PROGRESS BAR & HEADER SCROLLED
     ========================================== */
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    // 3.1 스크롤 진행 바 (Progress Bar)
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    document.documentElement.style.setProperty('--scroll-progress', `${scrollPercent}%`);

    // 3.2 헤더 스크롤링 효과
    if (header) {
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  /* ==========================================
     4. MOBILE NAVIGATION (HAMBURGER MENU)
     ========================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isActive = menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      
      // Accessibility (접근성) 설정
      menuToggle.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // 모바일 오버레이 메뉴 내 링크 클릭 시 닫기
    const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ==========================================
     5. SCROLL INTERSECTION OBSERVER FOR FADE-IN
     ========================================== */
  const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-fade-in');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport 기준
      rootMargin: '0px 0px -80px 0px', // 화면 하단보다 약간 먼저 애니메이션 발생
      threshold: 0.1 // 10% 정도 드러났을 때
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // 한 번 보이면 관찰 종료(재 스크롤 시 반복을 피하기 위함, 자연스러움 유지)
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Intersection Observer 미지원 구형 브라우저 대응
    animatedElements.forEach(element => {
      element.classList.add('visible');
    });
  }
});
