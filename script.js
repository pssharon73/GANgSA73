/* EmailJS 및 사이트 설정 — 이 블록에서만 관리합니다. */
const SITE_URL = "https://gangsa73.vercel.app";
const EMAILJS_PUBLIC_KEY = "Lebdq6Hu0Ac0XOJ6I";
const EMAILJS_SERVICE_ID = "service_igeigtl";
const EMAILJS_TEMPLATE_ID = "template_vq1uvna"; // 접수 알림
const EMAILJS_AUTOREPLY_ID = "template_3j7ogku"; // 자동회신
const EMAILJS_TO_EMAIL = "pssharon73@gmail.com";

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const inquiryForm = document.getElementById('inquiry-form');
const formNote = document.getElementById('form-note');
const privacyCheckbox = inquiryForm.querySelector('[name="privacy_agreed"]');
const privacyMessage = document.getElementById('privacy-message');
const privacyToggle = inquiryForm.querySelector('.privacy-toggle');
const privacyDetails = document.getElementById('privacy-details');
const submitControl = document.getElementById('submit-control');
const submitButton = document.getElementById('inquiry-submit');

function formatSubmittedAt(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
}

function setFormStatus(message, state = '') {
  formNote.textContent = message;
  formNote.dataset.state = state;
}

function updatePrivacyState() {
  const agreed = privacyCheckbox.checked;
  submitButton.disabled = !agreed;
  submitControl.classList.toggle('is-ready', agreed);

  if (agreed) {
    inquiryForm.elements.agreed_at.value = formatSubmittedAt(new Date());
    privacyMessage.textContent = '';
  } else {
    inquiryForm.elements.agreed_at.value = '';
  }
}

if (window.emailjs) {
  window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
} else {
  setFormStatus('문의 전송 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.', 'error');
}

privacyToggle.addEventListener('click', () => {
  const willOpen = privacyDetails.hidden;
  privacyDetails.hidden = !willOpen;
  privacyToggle.setAttribute('aria-expanded', String(willOpen));
  privacyToggle.textContent = willOpen ? '전문 닫기' : '전문 보기';
});

privacyCheckbox.addEventListener('change', updatePrivacyState);

submitControl.addEventListener('click', () => {
  if (!privacyCheckbox.checked) {
    privacyMessage.textContent = '개인정보 수집 · 이용에 동의해 주세요.';
  }
});

inquiryForm.addEventListener('input', () => {
  if (formNote.dataset.state === 'error') setFormStatus('필수 항목과 개인정보 동의를 확인해 주세요.');
});

inquiryForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!privacyCheckbox.checked) {
    privacyMessage.textContent = '개인정보 수집 · 이용에 동의해 주세요.';
    privacyCheckbox.focus();
    return;
  }

  if (!inquiryForm.checkValidity()) {
    inquiryForm.reportValidity();
    setFormStatus('이름, 이메일, 문의 내용 등 필수 항목을 확인해 주세요.', 'error');
    return;
  }

  if (!window.emailjs) {
    setFormStatus('문의 전송 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.', 'error');
    return;
  }

  const data = new FormData(inquiryForm);
  const submittedAt = formatSubmittedAt(new Date());
  const pageUrl = window.location.href || SITE_URL + '/#contact';
  const agreedAt = inquiryForm.elements.agreed_at.value || submittedAt;
  const templateParams = {
    from_name: String(data.get('from_name') || ''),
    from_email: String(data.get('from_email') || ''),
    phone: String(data.get('phone') || ''),
    company: String(data.get('company') || ''),
    inquiry_type: String(data.get('inquiry_type') || '기타 문의'),
    message: String(data.get('message') || ''),
    to_email: EMAILJS_TO_EMAIL,
    reply_to: String(data.get('from_email') || ''),
    submitted_at: submittedAt,
    page_url: pageUrl,
    privacy_agreed: '동의',
    agreed_at: agreedAt
  };

  inquiryForm.elements.to_email.value = templateParams.to_email;
  inquiryForm.elements.reply_to.value = templateParams.reply_to;
  inquiryForm.elements.submitted_at.value = templateParams.submitted_at;
  inquiryForm.elements.page_url.value = templateParams.page_url;
  inquiryForm.elements.agreed_at.value = templateParams.agreed_at;

  submitButton.disabled = true;
  submitButton.textContent = '전송 중...';
  setFormStatus('문의 내용을 안전하게 전송하고 있습니다.', 'sending');

  try {
    await Promise.all([
      window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams),
      window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_ID, templateParams)
    ]);
    inquiryForm.reset();
    updatePrivacyState();
    setFormStatus('문의가 정상적으로 접수되었습니다. 확인 후 답변드리겠습니다.', 'success');
  } catch (error) {
    console.error('EmailJS 전송 오류:', error);
    setFormStatus('문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'error');
    submitButton.disabled = false;
  } finally {
    submitButton.textContent = '맞춤 교육 문의 보내기';
    if (!privacyCheckbox.checked) submitButton.disabled = true;
  }
});
const trackTabs = [...document.querySelectorAll('.track-tab')];
const trackPanels = [...document.querySelectorAll('.track-panel')];

function selectTrack(selectedTab) {
  trackTabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle('is-active', isSelected);
    tab.setAttribute('aria-selected', String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  trackPanels.forEach((panel) => {
    panel.hidden = panel.id !== selectedTab.getAttribute('aria-controls');
  });
}

trackTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTrack(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextTab = trackTabs[(index + direction + trackTabs.length) % trackTabs.length];
    selectTrack(nextTab);
    nextTab.focus();
  });
});
const siteHeader = document.querySelector('.site-header');
const mobileMenuButton = document.querySelector('.mobile-menu-toggle');
const siteNavigation = document.getElementById('site-navigation');

function setMobileMenu(open) {
  siteHeader.classList.toggle('menu-open', open);
  mobileMenuButton.setAttribute('aria-expanded', String(open));
  mobileMenuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
}

mobileMenuButton.addEventListener('click', () => {
  setMobileMenu(mobileMenuButton.getAttribute('aria-expanded') !== 'true');
});

siteNavigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMobileMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMobileMenu(false);
});

document.addEventListener('click', (event) => {
  if (!siteHeader.contains(event.target)) setMobileMenu(false);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) setMobileMenu(false);
});
const heroAudio = document.getElementById('hero-audio');
const heroSoundButton = document.querySelector('.hero-sound-toggle');
const heroSoundStatus = document.querySelector('.hero-sound-status');

function updateHeroSoundState(playing) {
  heroSoundButton.classList.toggle('is-playing', playing);
  heroSoundButton.setAttribute('aria-pressed', String(playing));
  heroSoundStatus.textContent = playing ? '음악 정지' : '12초 음악 듣기';
}

heroSoundButton.addEventListener('click', async () => {
  if (heroAudio.paused) {
    try {
      await heroAudio.play();
    } catch (error) {
      heroSoundStatus.textContent = '재생할 수 없습니다';
    }
  } else {
    heroAudio.pause();
  }
});

heroAudio.addEventListener('play', () => updateHeroSoundState(true));
heroAudio.addEventListener('pause', () => updateHeroSoundState(false));
heroAudio.addEventListener('ended', () => {
  heroAudio.currentTime = 0;
  updateHeroSoundState(false);
});