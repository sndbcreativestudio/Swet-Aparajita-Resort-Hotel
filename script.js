/**
 * Swet Aparajita — Resort & Hotel, Shantiniketan
 * Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Header Scroll Behavior
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile Navigation Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeNavBtn = document.getElementById('closeNavBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileNav() {
    mobileNav?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav?.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  mobileMenuBtn?.addEventListener('click', openMobileNav);
  closeNavBtn?.addEventListener('click', closeMobileNav);
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Gallery Filtering Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Lightbox Modal Logic
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightbox = document.getElementById('closeLightbox');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-caption')?.textContent || '';
      
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || caption;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        
        lightboxModal?.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeLightbox?.addEventListener('click', () => {
    lightboxModal?.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // Room Pre-selection on Booking Form
  const bookRoomBtns = document.querySelectorAll('.btn-book-room');
  const roomSelect = document.getElementById('roomTypeSelect');
  const checkinInput = document.getElementById('checkinDate');

  bookRoomBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const roomType = btn.getAttribute('data-room');
      if (roomSelect && roomType) {
        roomSelect.value = roomType;
      }
      const bookingFormSection = document.getElementById('booking');
      if (bookingFormSection) {
        bookingFormSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          checkinInput?.focus();
        }, 600);
      }
    });
  });

  // Date Logic — Set minimum date to today
  const todayStr = new Date().toISOString().split('T')[0];
  if (checkinInput) checkinInput.min = todayStr;
  const checkoutInput = document.getElementById('checkoutDate');
  if (checkoutInput) checkoutInput.min = todayStr;

  checkinInput?.addEventListener('change', () => {
    if (checkoutInput && checkinInput.value) {
      checkoutInput.min = checkinInput.value;
      if (checkoutInput.value && checkoutInput.value < checkinInput.value) {
        checkoutInput.value = checkinInput.value;
      }
    }
  });

  // Booking Form Submission Handler
  const bookingForm = document.getElementById('bookingForm');
  const confirmModal = document.getElementById('confirmModal');
  const closeConfirmModal = document.getElementById('closeConfirmModal');
  const confirmDetails = document.getElementById('confirmDetails');
  const waConfirmBtn = document.getElementById('waConfirmBtn');

  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const checkin = document.getElementById('checkinDate')?.value;
    const checkout = document.getElementById('checkoutDate')?.value;
    const guests = document.getElementById('guestsCount')?.value;
    const room = document.getElementById('roomTypeSelect')?.value;
    const message = document.getElementById('messageText')?.value.trim();

    if (!fullName || !phone || !checkin || !checkout) {
      alert('Please fill in all required fields (Name, Phone, Check-in & Check-out dates).');
      return;
    }

    // Calculate Nights
    const d1 = new Date(checkin);
    const d2 = new Date(checkout);
    const diffTime = Math.abs(d2 - d1);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Build Summary HTML
    if (confirmDetails) {
      confirmDetails.innerHTML = `
        <div style="text-align: left; background: var(--color-sand-light); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); margin: 1.25rem 0;">
          <p style="margin-bottom: 0.5rem;"><strong>Guest Name:</strong> ${fullName}</p>
          <p style="margin-bottom: 0.5rem;"><strong>Phone:</strong> ${phone}</p>
          <p style="margin-bottom: 0.5rem;"><strong>Dates:</strong> ${checkin} to ${checkout} (${nights} Night${nights > 1 ? 's' : ''})</p>
          <p style="margin-bottom: 0.5rem;"><strong>Guests:</strong> ${guests} Guest(s)</p>
          <p style="margin-bottom: 0.5rem;"><strong>Room Type:</strong> ${room}</p>
          ${message ? `<p style="margin-bottom: 0;"><strong>Message:</strong> "${message}"</p>` : ''}
        </div>
      `;
    }

    // Prepare WhatsApp Pre-filled URL
    const waText = encodeURIComponent(
      `Hello Swet Aparajita,\n\nI would like to request a booking with the following details:\n` +
      `• *Name:* ${fullName}\n` +
      `• *Phone:* ${phone}\n` +
      `• *Check-in:* ${checkin}\n` +
      `• *Check-out:* ${checkout} (${nights} Night${nights > 1 ? 's' : ''})\n` +
      `• *Guests:* ${guests}\n` +
      `• *Room:* ${room}\n` +
      (message ? `• *Note:* ${message}\n` : '') +
      `\nPlease confirm availability and rate.`
    );

    if (waConfirmBtn) {
      waConfirmBtn.href = `https://wa.me/919433778441?text=${waText}`;
    }

    // Show Confirmation Modal
    confirmModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeConfirmModal?.addEventListener('click', () => {
    confirmModal?.classList.remove('active');
    document.body.style.overflow = 'auto';
    bookingForm?.reset();
  });

  confirmModal?.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
      confirmModal.classList.remove('active');
      document.body.style.overflow = 'auto';
      bookingForm?.reset();
    }
  });
});
