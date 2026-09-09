const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.getElementById('inquiry-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const inquiry = [
    '[공공기관 생성형 AI 교육 문의]',
    `기관명: ${data.get('organization')}`,
    `담당자: ${data.get('name')}`,
    `이메일: ${data.get('email')}`,
    `희망 일정 및 인원: ${data.get('schedule') || '미정'}`,
    `문의 내용: ${data.get('message') || '없음'}`
  ].join('\n');
  const subject = encodeURIComponent(`[교육 문의] ${data.get('organization')} - 생성형 AI 실무 교육`);
  const body = encodeURIComponent(inquiry);
  window.location.href = `mailto:pssharon@hanmail.net?subject=${subject}&body=${body}`;
  document.getElementById('form-note').textContent = '이메일 앱이 열리지 않으면 pssharon@hanmail.net으로 보내주세요.';
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