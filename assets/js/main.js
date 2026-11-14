/**
 * Dr. Rui's Skin, Hair & Laser Clinic - Main JavaScript
 * Handles navigation, modals, booking workflows, animations, filtering and lightboxes
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBookingModal();
  initFaqAccordion();
  initServiceFilters();
  initReviewFilters();
  initGalleryLightbox();
  initBlogModal();
  initScrollAnimations();
});

/* ==========================================================================
   NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}



/* ==========================================================================
   BOOKING MODAL & FORM HANDLER
   ========================================================================== */
function initBookingModal() {
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const openButtons = document.querySelectorAll('.js-open-booking');
  const serviceSelect = document.getElementById('modalServiceSelect');
  const bookingForm = document.getElementById('modalBookingForm');

  if (!modalOverlay) return;

  function openModal(serviceName = '') {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (serviceSelect && serviceName) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.toLowerCase() === serviceName.toLowerCase() ||
            serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openModal(service);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('modalName')?.value.trim() || 'Patient';
      const phone = document.getElementById('modalPhone')?.value.trim() || '';
      const email = document.getElementById('modalEmail')?.value.trim() || 'Not provided';
      const service = serviceSelect?.value || 'Consultation';
      const date = document.getElementById('modalDate')?.value || 'Flexible';
      const time = document.getElementById('modalTime')?.value || 'Anytime';
      const message = document.getElementById('modalMessage')?.value.trim() || 'No specific notes.';

      // Construct WhatsApp message
      const waText = encodeURIComponent(
        `*New Appointment Request - Dr. Rui's Clinic*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `✉️ *Email:* ${email}\n` +
        `✨ *Treatment:* ${service}\n` +
        `📅 *Preferred Date:* ${date}\n` +
        `⏰ *Preferred Time:* ${time}\n` +
        `📝 *Notes:* ${message}\n\n` +
        `Please confirm my consultation slot.`
      );

      const waUrl = `https://wa.me/919834080515?text=${waText}`;

      // Show instant feedback
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Booking Confirmed! Opening WhatsApp...</span>`;
      submitBtn.style.backgroundColor = '#4E9F5D';

      setTimeout(() => {
        window.open(waUrl, '_blank');
        closeModal();
        bookingForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.style.backgroundColor = '';
        showToast('Thank you! Your consultation request has been forwarded to Dr. Rui\'s Clinic on WhatsApp.');
      }, 700);
    });
  }
}

/* ==========================================================================
   TOAST NOTIFICATION HELPER
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.clinic-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'clinic-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background-color: #7B1E4D;
      color: #FFFFFF;
      padding: 14px 24px;
      border-radius: 9999px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
      font-size: 0.9rem;
      font-weight: 600;
      z-index: 4000;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 90%;
      text-align: center;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 4500);
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBody = other.querySelector('.faq-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   SERVICES FILTERING
   ========================================================================== */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.service-filter-tabs .filter-btn');
  const serviceCards = document.querySelectorAll('.services-grid .service-card');

  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || category.includes(filterVal)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   REVIEWS FILTERING
   ========================================================================== */
function initReviewFilters() {
  const reviewFilters = document.querySelectorAll('.review-filter-btn');
  const reviewCards = document.querySelectorAll('.reviews-grid .review-card');

  if (!reviewFilters.length || !reviewCards.length) return;

  reviewFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      reviewFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      reviewCards.forEach(card => {
        const cardCat = card.getAttribute('data-treatment') || '';
        if (category === 'all' || cardCat.includes(category)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // Create lightbox markup
  let lightbox = document.querySelector('.gallery-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(26, 7, 17, 0.95);
      z-index: 5000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px 20px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;
    lightbox.innerHTML = `
      <button class="lightbox-close" style="position: absolute; top: 20px; right: 24px; background: none; border: none; color: #FFF; font-size: 32px; cursor: pointer; line-height: 1;">&times;</button>
      <div class="lightbox-content" style="max-width: 900px; max-height: 80vh; text-align: center;">
        <img class="lightbox-img" src="" alt="Gallery Image" style="max-height: 70vh; max-width: 100%; border-radius: 12px; margin: 0 auto; box-shadow: 0 10px 40px rgba(0,0,0,0.5);" />
        <h4 class="lightbox-title" style="color: #FFF; margin-top: 16px; font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem;"></h4>
        <p class="lightbox-desc" style="color: #F6D5E1; font-size: 0.9rem; margin-top: 4px;"></p>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const lightboxDesc = lightbox.querySelector('.lightbox-desc');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  function openLightbox(src, title, desc) {
    lightboxImg.src = src;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;
    lightbox.style.opacity = '1';
    lightbox.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.style.opacity = '0';
    lightbox.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h4')?.textContent || 'Clinic View';
      const desc = item.querySelector('p')?.textContent || "Dr. Rui's Skin, Hair & Laser Clinic";
      if (img) openLightbox(img.src, title, desc);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.opacity === '1') {
      closeLightbox();
    }
  });

  // Gallery tabs filter if present
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  if (galleryFilterBtns.length) {
    galleryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const cat = item.getAttribute('data-category') || '';
          if (filter === 'all' || cat.includes(filter)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
}

/* ==========================================================================
   BLOG MODAL / EXPANDABLE READER
   ========================================================================== */
function initBlogModal() {
  const readButtons = document.querySelectorAll('.js-read-article');
  if (!readButtons.length) return;

  let blogModal = document.querySelector('.blog-reader-modal');
  if (!blogModal) {
    blogModal = document.createElement('div');
    blogModal.className = 'blog-reader-modal';
    blogModal.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(26, 7, 17, 0.7);
      backdrop-filter: blur(6px);
      z-index: 3500;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;
    blogModal.innerHTML = `
      <div class="blog-reader-card" style="background: #FFFFFF; border-radius: 20px; max-width: 820px; width: 100%; max-height: 85vh; overflow-y: auto; padding: 36px; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
        <button class="blog-reader-close" style="position: absolute; top: 20px; right: 20px; background: #FDF8F5; border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 20px; cursor: pointer; color: #7B1E4D;">&times;</button>
        <span class="blog-reader-tag" style="background: #F6D5E1; color: #7B1E4D; font-size: 0.8rem; font-weight: 700; padding: 4px 14px; border-radius: 999px; text-transform: uppercase;"></span>
        <h2 class="blog-reader-title" style="font-family: 'Playfair Display', Georgia, serif; color: #7B1E4D; margin: 16px 0 10px 0; font-size: 1.85rem; line-height: 1.3;"></h2>
        <div class="blog-reader-meta" style="color: #6B6B6B; font-size: 0.85rem; margin-bottom: 24px; border-bottom: 1px solid #EFE4DC; padding-bottom: 12px;">By Dr. Rohini Murade Patil • 5 min read</div>
        <div class="blog-reader-body" style="font-size: 1rem; line-height: 1.8; color: #2B2B2B;"></div>
        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #EFE4DC; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h4 style="font-family: 'Playfair Display', serif; color: #7B1E4D; margin-bottom: 4px;">Have questions about this condition?</h4>
            <p style="font-size: 0.875rem; color: #6B6B6B; margin: 0;">Consult Dr. Rohini Murade Patil for an individual assessment.</p>
          </div>
          <button class="btn btn-primary js-open-booking" style="border-radius: 9999px;">Book Consultation</button>
        </div>
      </div>
    `;
    document.body.appendChild(blogModal);
  }

  const closeBtn = blogModal.querySelector('.blog-reader-close');
  const tagEl = blogModal.querySelector('.blog-reader-tag');
  const titleEl = blogModal.querySelector('.blog-reader-title');
  const bodyEl = blogModal.querySelector('.blog-reader-body');
  const bookBtn = blogModal.querySelector('.js-open-booking');

  function openBlogModal(title, tag, content) {
    tagEl.textContent = tag;
    titleEl.textContent = title;
    bodyEl.innerHTML = content;
    blogModal.style.opacity = '1';
    blogModal.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';

    // attach booking listener to modal button
    if (bookBtn) {
      bookBtn.onclick = () => {
        closeBlogModal();
        const openBooking = document.querySelector('.js-open-booking');
        if (openBooking) openBooking.click();
      };
    }
  }

  function closeBlogModal() {
    blogModal.style.opacity = '0';
    blogModal.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  }

  readButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const articleCard = btn.closest('.blog-card');
      if (!articleCard) return;

      const title = articleCard.querySelector('.blog-card-title')?.textContent || 'Skin Care Advice';
      const tag = articleCard.querySelector('.blog-tag')?.textContent || 'Clinical Tip';
      const hiddenContent = articleCard.querySelector('.blog-full-content')?.innerHTML || articleCard.querySelector('p')?.innerHTML;

      openBlogModal(title, tag, hiddenContent);
    });
  });

  closeBtn.addEventListener('click', closeBlogModal);
  blogModal.addEventListener('click', (e) => {
    if (e.target === blogModal) closeBlogModal();
  });
}

/* ==========================================================================
   SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

