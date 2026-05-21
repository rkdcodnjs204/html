document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================
     1. STATS COUNT-UP ANIMATION
     ========================================== */
  const countElements = document.querySelectorAll('[data-count]');
  
  function countUp(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const duration = 2000; // 2초 동안 카운트업
    const stepTime = 20;   // 20ms 마다 업데이트
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;
    let stepCount = 0;

    const timer = setInterval(() => {
      current += increment;
      stepCount++;
      
      if (stepCount >= steps) {
        clearInterval(timer);
        element.textContent = target.toLocaleString() + (element.getAttribute('data-suffix') || '');
      } else {
        element.textContent = Math.floor(current).toLocaleString() + (element.getAttribute('data-suffix') || '');
      }
    }, stepTime);
  }

  // Count Elements Observer
  if (countElements.length > 0 && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target); // 한번 시작하면 중복 방지
        }
      });
    }, { threshold: 0.5 });

    countElements.forEach(el => countObserver.observe(el));
  } else {
    // Observer 지원 안될 때 즉시 완료 처리
    countElements.forEach(el => {
      el.textContent = parseInt(el.getAttribute('data-count'), 10).toLocaleString() + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ==========================================
     2. PRODUCT CATEGORY FILTER (product.html)
     ========================================== */
  const filterButtons = document.querySelectorAll('.filter-tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Active class 전환
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        productCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          if (filterValue === 'all' || cardCategory === filterValue) {
            // 보이기 애니메이션 적용
            card.classList.remove('hidden');
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            // 숨기기
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            // 트랜지션 완료 후 display 처리
            setTimeout(() => {
              card.classList.add('hidden');
            }, 300);
          }
        });
      });
    });
  }

  /* ==========================================
     3. SLIDER / CAROUSEL COMPONENT
     ========================================== */
  const sliders = document.querySelectorAll('.slider-container');
  
  sliders.forEach(slider => {
    const wrapper = slider.querySelector('.slider-wrapper');
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    
    if (!wrapper || slides.length === 0) return;
    
    let currentIndex = 0;
    const slideCount = slides.length;
    let autoSlideTimer = null;

    function updateSlider() {
      wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slideCount;
      updateSlider();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      updateSlider();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });
    if (prevBtn) prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });

    // 자동 슬라이드 (3초 간격)
    function startAutoSlide() {
      autoSlideTimer = setInterval(nextSlide, 3500);
    }

    function resetAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        startAutoSlide();
      }
    }

    // 마우스 호버 시 일시 정지
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
    slider.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();
  });

  /* ==========================================
     4. LIGHTBOX GALLERY MODAL (equipment.html)
     ========================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (galleryItems.length > 0 && lightboxModal && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('h4').textContent;
        const desc = item.querySelector('p').textContent;

        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || title;
          if (lightboxCaption) {
            lightboxCaption.innerHTML = `<strong>${title}</strong><br><span style="font-size:0.9rem; color:#ccc;">${desc}</span>`;
          }
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden'; // 스크롤 차단
        }
      });
    });

    // 닫기 로직
    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-content-wrapper')) {
        closeLightbox();
      }
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ==========================================
     5. INQUIRY FORM VALIDATION & TOAST (inquiry.html)
     ========================================== */
  const inquiryForm = document.getElementById('inquiry-form');
  const toast = document.getElementById('toast');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault(); // 기본 서브밋 방지

      let isValid = true;
      const inputs = inquiryForm.querySelectorAll('.form-control[required]');

      inputs.forEach(input => {
        // 빈 값 검증
        if (!input.value.trim()) {
          input.classList.add('invalid');
          isValid = false;
        } else {
          input.classList.remove('invalid');
        }

        // 이메일 정규식 추가 검증
        if (input.type === 'email' && input.value.trim()) {
          const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
          if (!emailPattern.test(input.value.trim())) {
            input.classList.add('invalid');
            isValid = false;
          } else {
            input.classList.remove('invalid');
          }
        }

        // 연락처 정규식 추가 검증
        if (input.name === 'phone' && input.value.trim()) {
          const phonePattern = /^\d{2,4}-\d{3,4}-\d{4}$/;
          if (!phonePattern.test(input.value.trim())) {
            input.classList.add('invalid');
            isValid = false;
          } else {
            input.classList.remove('invalid');
          }
        }
      });

      // 개인정보 약관 동의 체크
      const consentCheckbox = document.getElementById('privacy-consent');
      if (consentCheckbox && !consentCheckbox.checked) {
        consentCheckbox.style.outline = '2px solid #ff3b30';
        isValid = false;
      } else if (consentCheckbox) {
        consentCheckbox.style.outline = '';
      }

      if (isValid) {
        // 비동기 전송 성공 연출
        const submitBtn = inquiryForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loader-logo" style="font-size:1rem; margin:0;"><svg viewBox="0 0 24 24" style="width:20px; height:20px; animation: drip 1s infinite;"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> 전송 중...</span>';

        setTimeout(() => {
          // 전송 성공 Toast 활성화
          if (toast) {
            toast.classList.add('active');
            
            // 3.5초 뒤 비활성화
            setTimeout(() => {
              toast.classList.remove('active');
            }, 3500);
          }

          // 폼 리셋 및 버튼 복구
          inquiryForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 1500);
      }
    });

    // 입력 중 에러 피드백 실시간 해제
    const formControls = inquiryForm.querySelectorAll('.form-control');
    formControls.forEach(ctrl => {
      ctrl.addEventListener('input', () => {
        if (ctrl.value.trim()) {
          ctrl.classList.remove('invalid');
        }
      });
    });
  }
});
