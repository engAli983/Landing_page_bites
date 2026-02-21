/**
 * ========================================
 * BITES RESTAURANT — Main JavaScript
 * ========================================
 * Features:
 * 1. Mobile Navigation Toggle
 * 2. Sticky Header on Scroll
 * 3. Active Nav Link Tracking
 * 4. Carousel/Slider Controls
 * 5. Menu Tab Filtering
 * 6. Scroll Reveal Animations
 * 7. Add to Cart with Toast
 * 8. Newsletter Form Validation
 * 9. Scroll-to-Top Button
 * 10. Search Bar Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========================================
  // 1. MOBILE NAVIGATION
  // ========================================
  const menuToggle = document.querySelector('.menu-toggle');
  const menuHeader = document.querySelector('.menu-header');
  const navOverlay = document.getElementById('nav-overlay');
  const menuLinks = document.querySelectorAll('.menu-header li a');

  function openNav() {
    menuHeader.classList.add('open');
    navOverlay.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.querySelector('i').className = 'fa-solid fa-xmark';
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    menuHeader.classList.remove('open');
    navOverlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.querySelector('i').className = 'fa-solid fa-bars';
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', () => {
    menuHeader.classList.contains('open') ? closeNav() : openNav();
  });

  navOverlay.addEventListener('click', closeNav);

  menuLinks.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // ========================================
  // 2. STICKY HEADER
  // ========================================
  const header = document.querySelector('.header');

  function handleScroll() {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ========================================
  // 3. ACTIVE NAV LINK TRACKING
  // ========================================
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          menuLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach(section => navObserver.observe(section));

  // ========================================
  // 4. CAROUSEL / SLIDER CONTROLS
  // ========================================
  const carouselArrows = document.querySelectorAll('.carousel-arrows');

  carouselArrows.forEach(arrowGroup => {
    const targetId = arrowGroup.dataset.carousel;
    const track = document.getElementById(targetId);
    if (!track) return;

    const leftBtn = arrowGroup.querySelector('.arrow-left');
    const rightBtn = arrowGroup.querySelector('.arrow-right');
    const scrollAmount = 300;

    leftBtn.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  });

  // ========================================
  // 5. MENU TAB FILTERING
  // ========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const menuCards = document.querySelectorAll('.menu-cards .card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active tab
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      menuCards.forEach(card => {
        const categories = card.dataset.category || '';

        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hide');
          card.classList.add('show');
        } else {
          card.classList.remove('show');
          card.classList.add('hide');
        }
      });
    });
  });

  // ========================================
  // 6. SCROLL REVEAL ANIMATIONS
  // ========================================
  const revealElements = document.querySelectorAll(
    '.card, .review-card, .chef-card, .services-content, .reserv-content, .get-app .container, .hero-text, .hero-image'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ========================================
  // 7. SHOPPING CART SYSTEM
  // ========================================
  const cartItems = JSON.parse(localStorage.getItem('bites_cart') || '[]');

  function saveCart() {
    localStorage.setItem('bites_cart', JSON.stringify(cartItems));
  }
  const cartCountEl = document.querySelector('.cart-count');
  const toast = document.getElementById('toast');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartCloseBtn = document.getElementById('cart-close');
  const cartItemsEl = document.getElementById('cart-items');
  const cartEmptyEl = document.getElementById('cart-empty');
  const cartFooterEl = document.getElementById('cart-footer');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartDeliveryEl = document.getElementById('cart-delivery');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCheckoutBtn = document.getElementById('cart-checkout');
  const cartClearBtn = document.getElementById('cart-clear');
  const cartBtn = document.querySelector('.reserve-menu .cart');
  const DELIVERY_FEE = 5.00;

  function showToast(message, type = '') {
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // Open / Close cart sidebar
  function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  });

  cartCloseBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Update cart badge count
  function updateCartBadge() {
    const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalQty;
    cartCountEl.classList.toggle('show', totalQty > 0);

    // Animate badge
    cartCountEl.style.transform = 'scale(1.3)';
    setTimeout(() => {
      cartCountEl.style.transform = 'scale(1)';
    }, 200);
  }

  // Calculate and update totals
  function updateTotals() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = cartItems.length > 0 ? DELIVERY_FEE : 0;
    const total = subtotal + delivery;

    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    cartDeliveryEl.textContent = cartItems.length > 0 ? `$${delivery.toFixed(2)}` : '$0.00';
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  // Render cart items
  function renderCart() {
    // Remove only cart-item elements (keep empty state)
    cartItemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());

    if (cartItems.length === 0) {
      cartEmptyEl.style.display = 'flex';
      cartFooterEl.classList.remove('visible');
    } else {
      cartEmptyEl.style.display = 'none';
      cartFooterEl.classList.add('visible');

      cartItems.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn qty-minus" data-index="${index}" aria-label="Decrease quantity">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn qty-plus" data-index="${index}" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-item-remove" data-index="${index}" aria-label="Remove item">
            <i class="fa-solid fa-trash"></i>
          </button>
        `;
        cartItemsEl.appendChild(el);
      });

      // Attach quantity event listeners
      cartItemsEl.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = parseInt(btn.dataset.index);
          if (cartItems[i].qty > 1) {
            cartItems[i].qty--;
          } else {
            cartItems.splice(i, 1);
          }
          renderCart();
          updateCartBadge();
          updateTotals();
        });
      });

      cartItemsEl.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = parseInt(btn.dataset.index);
          cartItems[i].qty++;
          renderCart();
          updateCartBadge();
          updateTotals();
        });
      });

      cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = parseInt(btn.dataset.index);
          const removedName = cartItems[i].name;
          cartItems.splice(i, 1);
          renderCart();
          updateCartBadge();
          updateTotals();
          showToast(`${removedName} removed from cart`, 'error');
        });
      });
    }

    updateTotals();
    saveCart();
  }

  // Add to cart from buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);

      // Check if already in cart
      const existing = cartItems.find(item => item.name === name);
      if (existing) {
        existing.qty++;
      } else {
        cartItems.push({ name, price, qty: 1 });
      }

      // Visual feedback on button
      btn.classList.add('added');
      btn.textContent = '✓ Added';
      setTimeout(() => {
        btn.classList.remove('added');
        btn.textContent = 'Add To Cart';
      }, 1500);

      updateCartBadge();
      renderCart();
      showToast(`${name} added to cart!`, 'success');
    });
  });

  // Clear cart
  cartClearBtn.addEventListener('click', () => {
    cartItems.length = 0;
    saveCart();
    renderCart();
    updateCartBadge();
    showToast('Cart cleared', 'error');
  });

  // Place order
  cartCheckoutBtn.addEventListener('click', () => {
    if (cartItems.length === 0) return;
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0) + DELIVERY_FEE;
    showToast(`Order placed! Total: $${total.toFixed(2)} 🎉`, 'success');
    cartItems.length = 0;
    saveCart();
    renderCart();
    updateCartBadge();
    closeCart();
  });

  // Initial render
  renderCart();
  updateCartBadge();

  // ========================================
  // 8. NEWSLETTER FORM
  // ========================================
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = newsletterEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        showToast('Please enter your email address.', 'error');
        newsletterEmail.focus();
        return;
      }

      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        newsletterEmail.focus();
        return;
      }

      // Success
      showToast('Successfully subscribed! Thank you 🎉', 'success');
      newsletterEmail.value = '';
    });
  }

  // ========================================
  // 9. SCROLL-TO-TOP BUTTON
  // ========================================
  const scrollTopBtn = document.getElementById('scroll-top');

  function handleScrollTop() {
    scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  }

  window.addEventListener('scroll', handleScrollTop, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ========================================
  // 10. SEARCH BAR INTERACTION
  // ========================================
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    // "Explore Food" button scrolls to menu
    const exploreBtn = searchForm.querySelector('button');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        const menuSection = document.getElementById('menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Search input — filter menu cards as you type
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();

        if (!query) {
          // Show all menu cards
          menuCards.forEach(card => {
            card.classList.remove('hide');
            card.classList.add('show');
          });
          // Reset tabs
          tabButtons.forEach(b => b.classList.remove('active'));
          tabButtons[0]?.classList.add('active');
          return;
        }

        // Scroll to menu section
        const menuSection = document.getElementById('menu');
        if (menuSection && !isElementInViewport(menuSection)) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }

        menuCards.forEach(card => {
          const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
          const desc = card.querySelector('p')?.textContent.toLowerCase() || '';

          if (title.includes(query) || desc.includes(query)) {
            card.classList.remove('hide');
            card.classList.add('show');
          } else {
            card.classList.remove('show');
            card.classList.add('hide');
          }
        });

        // Clear active tab
        tabButtons.forEach(b => b.classList.remove('active'));
      });
    }
  }

  // Utility: check if element is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  // ========================================
  // 11. RESERVATION SYSTEM
  // ========================================
  const WHATSAPP_NUMBER = '201033458035';

  // Zone configuration
  const ZONES = {
    window: { name: 'Window Side', tables: 3, minGuests: 2, maxGuests: 4 },
    garden: { name: 'Garden Terrace', tables: 4, minGuests: 2, maxGuests: 6 },
    hall:   { name: 'Main Hall', tables: 5, minGuests: 2, maxGuests: 8 },
    vip:    { name: 'VIP Lounge', tables: 2, minGuests: 2, maxGuests: 10 },
  };

  // Simulated bookings: { 'YYYY-MM-DD': { 'time': { zone: bookedCount } } }
  // Pre-populate some demo bookings
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = new Date(today.getTime() + 86400000).toISOString().split('T')[0];

  const bookings = {};
  // Demo: some slots booked today
  bookings[todayStr] = {
    '7:00 PM': { window: 3, garden: 2, hall: 1, vip: 0 },
    '8:00 PM': { window: 3, garden: 4, hall: 3, vip: 2 },
    '9:00 PM': { window: 2, garden: 3, hall: 5, vip: 1 },
  };
  // Demo: some slots booked tomorrow
  bookings[tomorrowStr] = {
    '6:00 PM': { window: 1, garden: 4, hall: 2, vip: 2 },
    '7:00 PM': { window: 3, garden: 3, hall: 4, vip: 0 },
    '8:00 PM': { window: 2, garden: 1, hall: 5, vip: 2 },
  };

  // DOM elements
  const reservModal = document.getElementById('reserv-modal');
  const reservOverlay = document.getElementById('reserv-overlay');
  const reservCloseBtn = document.getElementById('reserv-close');
  const reservBackBtn = document.getElementById('reserv-back');
  const reservNextBtn = document.getElementById('reserv-next');
  const reservWhatsappBtn = document.getElementById('reserv-whatsapp');
  const stepDots = document.querySelectorAll('.step-dot');
  const stepLines = document.querySelectorAll('.step-line');
  const reservSteps = document.querySelectorAll('.reserv-step');
  const zoneCards = document.querySelectorAll('.zone-card');
  const timeSlotsContainer = document.getElementById('time-slots');
  const timeSlotBtns = document.querySelectorAll('.time-slot');
  const availabilityMsg = document.getElementById('availability-msg');
  const reservDateInput = document.getElementById('reserv-date');
  const reservGuestsSelect = document.getElementById('reserv-guests');

  let currentStep = 1;
  let selectedZone = null;
  let selectedTime = null;

  // Set min date to today
  reservDateInput.min = todayStr;
  reservDateInput.value = todayStr;

  // Open / Close modal
  function openReservModal() {
    reservModal.classList.add('open');
    reservOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetReservation();
  }

  function closeReservModal() {
    reservModal.classList.remove('open');
    reservOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function resetReservation() {
    currentStep = 1;
    selectedZone = null;
    selectedTime = null;
    zoneCards.forEach(c => c.classList.remove('selected'));
    timeSlotBtns.forEach(s => { s.classList.remove('selected', 'booked'); });
    availabilityMsg.className = 'availability-msg';
    availabilityMsg.textContent = '';
    document.getElementById('reserv-name').value = '';
    document.getElementById('reserv-phone').value = '';
    document.getElementById('reserv-notes').value = '';
    reservDateInput.value = todayStr;
    reservGuestsSelect.value = '2';
    updateStepUI();
  }

  // Wire all reservation trigger buttons
  // Header "Reserve Table" button
  const reserveHeaderBtn = document.querySelector('.reserve-menu .reserve');
  if (reserveHeaderBtn) {
    reserveHeaderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openReservModal();
    });
  }

  // CTA "Make Reservation" button
  const makeReservCTA = document.querySelector('.reservation-cta .btn-primary');
  if (makeReservCTA) {
    makeReservCTA.addEventListener('click', (e) => {
      e.preventDefault();
      openReservModal();
    });
  }

  reservCloseBtn.addEventListener('click', closeReservModal);
  reservOverlay.addEventListener('click', closeReservModal);

  // Step navigation UI
  function updateStepUI() {
    // Update step dots
    stepDots.forEach((dot, i) => {
      const stepNum = i + 1;
      dot.classList.remove('active', 'done');
      if (stepNum === currentStep) {
        dot.classList.add('active');
      } else if (stepNum < currentStep) {
        dot.classList.add('done');
      }
    });

    // Update step lines
    stepLines.forEach((line, i) => {
      line.classList.toggle('done', i + 1 < currentStep);
    });

    // Show current step content
    reservSteps.forEach((step, i) => {
      step.classList.toggle('active', i + 1 === currentStep);
    });

    // Show/hide buttons
    reservBackBtn.style.display = currentStep > 1 ? 'flex' : 'none';
    reservNextBtn.style.display = currentStep < 4 ? 'flex' : 'none';
    reservWhatsappBtn.style.display = currentStep === 4 ? 'flex' : 'none';
  }

  // Zone selection
  zoneCards.forEach(card => {
    card.addEventListener('click', () => {
      zoneCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedZone = card.dataset.zone;

      // Update guest options based on zone capacity
      const zone = ZONES[selectedZone];
      reservGuestsSelect.innerHTML = '';
      for (let i = zone.minGuests; i <= zone.maxGuests; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${i} Guests`;
        reservGuestsSelect.appendChild(opt);
      }
    });
  });

  // Time slot selection
  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('booked')) {
        showToast('⚠️ This time slot is fully booked!', 'error');
        return;
      }
      timeSlotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTime = btn.dataset.time;

      // Show availability message
      availabilityMsg.className = 'availability-msg available';
      availabilityMsg.textContent = `✓ ${selectedTime} is available in ${ZONES[selectedZone].name}!`;
    });
  });

  // Update time slot availability when date changes
  function updateTimeSlotAvailability() {
    if (!selectedZone) return;

    const date = reservDateInput.value;
    const dateBookings = bookings[date] || {};

    timeSlotBtns.forEach(btn => {
      btn.classList.remove('booked', 'selected');
      const time = btn.dataset.time;
      const timeBooking = dateBookings[time];

      if (timeBooking) {
        const bookedCount = timeBooking[selectedZone] || 0;
        const totalTables = ZONES[selectedZone].tables;
        if (bookedCount >= totalTables) {
          btn.classList.add('booked');
        }
      }
    });

    selectedTime = null;
    availabilityMsg.className = 'availability-msg';
    availabilityMsg.textContent = '';
  }

  reservDateInput.addEventListener('change', updateTimeSlotAvailability);

  // Validate current step
  function validateStep() {
    switch (currentStep) {
      case 1:
        if (!selectedZone) {
          showToast('Please select an area first', 'error');
          return false;
        }
        return true;

      case 2:
        if (!reservDateInput.value) {
          showToast('Please select a date', 'error');
          return false;
        }
        if (!selectedTime) {
          showToast('Please select a time slot', 'error');
          return false;
        }
        return true;

      case 3:
        const name = document.getElementById('reserv-name').value.trim();
        const phone = document.getElementById('reserv-phone').value.trim();
        if (!name) {
          showToast('Please enter your name', 'error');
          document.getElementById('reserv-name').focus();
          return false;
        }
        if (!phone || phone.length < 10) {
          showToast('Please enter a valid phone number', 'error');
          document.getElementById('reserv-phone').focus();
          return false;
        }
        return true;

      default:
        return true;
    }
  }

  // Populate confirmation summary
  function populateConfirmation() {
    const zone = ZONES[selectedZone];
    document.getElementById('confirm-zone').textContent = zone.name;

    // Format date nicely
    const dateObj = new Date(reservDateInput.value + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('confirm-date').textContent = dateObj.toLocaleDateString('en-US', options);

    document.getElementById('confirm-time').textContent = selectedTime;
    document.getElementById('confirm-guests').textContent = `${reservGuestsSelect.value} Guests`;
    document.getElementById('confirm-name').textContent = document.getElementById('reserv-name').value.trim();
    document.getElementById('confirm-phone').textContent = document.getElementById('reserv-phone').value.trim();

    const notes = document.getElementById('reserv-notes').value.trim();
    const notesRow = document.getElementById('confirm-notes-row');
    if (notes) {
      notesRow.style.display = 'flex';
      document.getElementById('confirm-notes').textContent = notes;
    } else {
      notesRow.style.display = 'none';
    }
  }

  // Next button
  reservNextBtn.addEventListener('click', () => {
    if (!validateStep()) return;

    if (currentStep === 1) {
      // Moving to step 2 — update availability
      updateTimeSlotAvailability();
    }

    if (currentStep === 3) {
      // Moving to step 4 — populate confirmation
      populateConfirmation();
    }

    currentStep++;
    updateStepUI();
  });

  // Back button
  reservBackBtn.addEventListener('click', () => {
    currentStep--;
    updateStepUI();
  });

  // WhatsApp send
  reservWhatsappBtn.addEventListener('click', () => {
    const zone = ZONES[selectedZone];
    const name = document.getElementById('reserv-name').value.trim();
    const phone = document.getElementById('reserv-phone').value.trim();
    const notes = document.getElementById('reserv-notes').value.trim();
    const guests = reservGuestsSelect.value;

    const dateObj = new Date(reservDateInput.value + 'T00:00:00');
    const dateFormatted = dateObj.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    let message = `🍽️ *New Table Reservation — Bites Restaurant*\n\n`;
    message += `📍 *Area:* ${zone.name}\n`;
    message += `📅 *Date:* ${dateFormatted}\n`;
    message += `⏰ *Time:* ${selectedTime}\n`;
    message += `👥 *Guests:* ${guests}\n`;
    message += `👤 *Name:* ${name}\n`;
    message += `📞 *Phone:* ${phone}\n`;
    if (notes) {
      message += `📝 *Notes:* ${notes}\n`;
    }
    message += `\n✅ Please confirm my reservation. Thank you!`;

    const encoded = encodeURIComponent(message);
    const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    window.open(waURL, '_blank');

    // Mark as booked in local data
    const date = reservDateInput.value;
    if (!bookings[date]) bookings[date] = {};
    if (!bookings[date][selectedTime]) bookings[date][selectedTime] = { window: 0, garden: 0, hall: 0, vip: 0 };
    bookings[date][selectedTime][selectedZone]++;

    showToast('Reservation sent to WhatsApp! 🎉', 'success');
    closeReservModal();
  });

  // ========================================
  // INITIAL STATE
  // ========================================
  handleScroll();
  handleScrollTop();
});
