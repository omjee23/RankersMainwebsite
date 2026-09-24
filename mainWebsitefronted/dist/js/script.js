document.addEventListener('DOMContentLoaded', function () {
  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('mobile-open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('mobile-open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Gallery lightbox
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('[data-lightbox]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      lightboxImg.src = link.getAttribute('href');
      lightboxImg.alt = link.querySelector('img').alt || '';
      lightbox.classList.add('open');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // Enquiry form
  var enquiryForm = document.getElementById('enquiry-form');
  var enquiryStatus = document.getElementById('enquiry-status');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = enquiryForm.querySelector('.enquiry-submit');

      enquiryStatus.textContent = '';
      enquiryStatus.className = 'enquiry-status';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';

      fetch('contact-handler.php', {
        method: 'POST',
        body: new FormData(enquiryForm)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            enquiryStatus.textContent = "Thanks! We've received your enquiry and will call you back shortly.";
            enquiryStatus.classList.add('enquiry-status-success');
            enquiryForm.reset();
          } else {
            enquiryStatus.textContent = data.message || 'Something went wrong. Please try again or WhatsApp us directly.';
            enquiryStatus.classList.add('enquiry-status-error');
          }
        })
        .catch(function () {
          enquiryStatus.textContent = 'Network error. Please try again or WhatsApp us directly.';
          enquiryStatus.classList.add('enquiry-status-error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Enquiry';
        });
    });
  }
});
