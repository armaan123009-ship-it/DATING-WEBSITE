// ============================================================================
// CRAZY LOVE / PAWANDATE - CORE APPLICATION CONTROLLER
// High-Impact Poster Layout, Editorial Swipe Deck, Web Audio FX,
// Instagram Direct Chat, Moments Feed, AI Wingman Openers,
// Video Vibe Checks, Anti-Ghosting Timers, Safety Suite, VIP Perks & Architecture Specs
// Reference: https://crazycreative.design/
// ============================================================================

import { PROFILES, CATEGORIES, SECRET_ADMIRERS } from './data/profiles.js';
import { INITIAL_MATCHES, INITIAL_MESSAGES, ICEBREAKER_PROMPTS, BOT_RESPONSES, AI_WINGMAN_OPENERS, SAFETY_REASONS } from './data/chats.js';
import { INITIAL_FEED_POSTS } from './data/feed.js';
import { LiquidNavbar, NimbusIcons } from './components/ui/liquid-glass-navbar.js';

class CrazyCreativeApp {
  constructor() {
    this.storageKey = 'cc_dating_state_v4';
    this.cardPhotoIndices = {}; // track photo index per profile
    this.initState();
    this.initSoundFX();
    this.initDOM();
    this.initLiveClock();
    this.initLiquidNavbar();
    this.bindEvents();
    this.initExtendedFeatures();
    this.updateHeaderAuthState();
    this.renderCurrentView();
  }

  // --------------------------------------------------------------------------
  // SOUND FX ENGINE (WEB AUDIO OSCILLATOR - ZERO EXTERNAL ASSETS NEEDED)
  // --------------------------------------------------------------------------
  initSoundFX() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.audioCtx = new AudioContext();
    } catch (e) {
      this.audioCtx = null;
    }
  }

  playSound(type = 'pop') {
    if (!this.settings.soundFx || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      if (type === 'like') {
        // High playful chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'pass') {
        // Low swoop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'superlike') {
        // Sparkle arpeggio
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.18); // B5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else {
        // Generic crisp pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch (e) {}
  }

  // --------------------------------------------------------------------------
  // STATE INITIALIZATION & LOCALSTORAGE
  // --------------------------------------------------------------------------
  initState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.isAuthenticated = parsed.isAuthenticated !== undefined ? parsed.isAuthenticated : true;
        this.user = parsed.user || this.getDefaultUser();
        this.settings = parsed.settings || this.getDefaultSettings();
        this.matches = parsed.matches || INITIAL_MATCHES;
        this.chats = parsed.chats || INITIAL_MESSAGES;
        this.feedPosts = parsed.feedPosts || INITIAL_FEED_POSTS;
        this.swiped = parsed.swiped || {};
        this.activeCategory = parsed.activeCategory || 'all';
        this.selectedAiHobbies = parsed.selectedAiHobbies || ["35mm Film", "Brutalist Architecture", "Specialty Coffee"];
        this.superLikesRemaining = parsed.superLikesRemaining !== undefined ? parsed.superLikesRemaining : 3;
        this.boostActive = parsed.boostActive || false;
        this.secretAdmirers = parsed.secretAdmirers || SECRET_ADMIRERS;
        this.blockedUserIds = new Set(parsed.blockedUserIds || []);
      } catch (e) {
        this.resetDefaultState();
      }
    } else {
      this.resetDefaultState();
    }

    this.currentView = 'home';
    this.activeChatId = this.matches.length > 0 ? this.matches[0].profileId : (PROFILES[0] ? PROFILES[0].id : null);
    this.pendingGateRoute = null;
    this.selectedPresetUploadUrl = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80";
    this.onboardingStep = 1;
    this.admirersRevealed = false;
    this.boostTimer = null;
    this.boostSecondsRemaining = 1800; // 30 minutes
  }

  resetDefaultState() {
    this.isAuthenticated = true; // Logged in demo state
    this.user = this.getDefaultUser();
    this.settings = this.getDefaultSettings();
    this.matches = [...INITIAL_MATCHES];
    this.chats = JSON.parse(JSON.stringify(INITIAL_MESSAGES));
    this.feedPosts = JSON.parse(JSON.stringify(INITIAL_FEED_POSTS));
    this.swiped = {};
    this.activeCategory = 'all';
    this.selectedAiHobbies = ["35mm Film", "Brutalist Architecture", "Specialty Coffee"];
    this.superLikesRemaining = 3;
    this.boostActive = false;
    this.secretAdmirers = SECRET_ADMIRERS;
    this.blockedUserIds = new Set();
    this.saveState();
  }

  getDefaultUser() {
    return {
      name: "Armaan Yadav",
      handle: "@armaan.yadav",
      email: "armaan123009@gmail.com",
      city: "Tokyo",
      role: "Creative Director & Visual Storyteller",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&h=240&q=80",
      verified: true,
      photoVerified: true,
      bio: "Architectural photography, collecting Japanese city-pop vinyl, and designing digital platforms with electric character.",
      hobbies: ["35mm Film", "Product Design", "Specialty Coffee", "Synthesizers", "Tokyo Architecture"],
      values: ["Creative Freedom", "Deep Ambition", "Anti-Ghosting"],
      lifestyle: ["Night Owl & Early Matcha", "High Output"],
      socials: {
        instagram: "@armaan.lens",
        spotify: "Bicep • Glue",
        twitter: "@armaanyadav",
        github: "armaanyadav"
      }
    };
  }

  getDefaultSettings() {
    return {
      maxDistance: 15,
      maxAge: 30,
      aiSensitivity: "balanced",
      soundFx: true,
      stealthMode: false,
      readReceipts: true,
      photoBlur: true
    };
  }

  saveState() {
    const data = {
      isAuthenticated: this.isAuthenticated,
      user: this.user,
      settings: this.settings,
      matches: this.matches,
      chats: this.chats,
      feedPosts: this.feedPosts,
      swiped: this.swiped,
      activeCategory: this.activeCategory,
      selectedAiHobbies: this.selectedAiHobbies,
      superLikesRemaining: this.superLikesRemaining,
      boostActive: this.boostActive,
      secretAdmirers: this.secretAdmirers,
      blockedUserIds: Array.from(this.blockedUserIds)
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // --------------------------------------------------------------------------
  // LIVE TOKYO STUDIO CLOCK (CRAZY CREATIVE LATE NIGHT WIDGET)
  // --------------------------------------------------------------------------
  initLiveClock() {
    const clockEl = document.getElementById('liveClockTime');
    if (!clockEl) return;
    const updateTime = () => {
      const now = new Date();
      const options = { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      clockEl.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  // --------------------------------------------------------------------------
  // NAVIGATION BAR (VISIBLE ONLY AFTER LOGIN)
  // --------------------------------------------------------------------------
  initLiquidNavbar() {
    const mountContainer = document.getElementById('liquidNavbarMount');
    if (!mountContainer) return;
    mountContainer.innerHTML = '';

    this.liquidNav = new LiquidNavbar({
      target: mountContainer,
      tone: "dark",
      defaultActive: 0,
      sound: false,
      items: [
        { label: "Deck", icon: NimbusIcons.plane, fx: "plane", route: "discover" },
        { label: "Moments", icon: NimbusIcons.camera, fx: "spin", route: "feed" },
        { label: "Chats", icon: NimbusIcons.drop, fx: "drop", route: "chats" },
        { label: "Settings", icon: NimbusIcons.settings, fx: "glow", route: "settings" }
      ],
      onChange: (index, item) => {
        this.playSound('pop');
        this.handleGateRoute(item.route);
      }
    });
  }

  // --------------------------------------------------------------------------
  // ROUTING & AUTHENTICATION GATING
  // --------------------------------------------------------------------------
  handleGateRoute(targetRoute) {
    if (targetRoute === 'home') {
      this.navigateTo('home');
      return;
    }

    if (!this.isAuthenticated) {
      this.pendingGateRoute = targetRoute;
      this.openAuthModal();
      return;
    }

    this.navigateTo(targetRoute);
  }

  navigateTo(viewName) {
    this.currentView = viewName;
    window.currentView = viewName;

    // Toggle body classes for navbar visibility:
    // Nav bar is hidden on home view and when logged out
    const isDashboardView = ['discover', 'feed', 'chats', 'settings'].includes(viewName);
    
    if (this.isAuthenticated && isDashboardView) {
      document.body.classList.remove('logged-out');
      document.body.classList.add('in-dashboard');
    } else {
      document.body.classList.add('logged-out');
      document.body.classList.remove('in-dashboard');
    }

    // Toggle active view sections
    Object.keys(this.views).forEach(key => {
      if (this.views[key]) {
        this.views[key].classList.toggle('active', key === viewName);
      }
    });

    // Update active nav button
    const routeIndexMap = { discover: 0, feed: 1, chats: 2, settings: 3 };
    if (this.liquidNav && routeIndexMap[viewName] !== undefined) {
      this.liquidNav.setActive(routeIndexMap[viewName]);
    }

    // Window scroll reset
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render corresponding view data
    this.renderCurrentView();
  }

  renderCurrentView() {
    if (this.currentView === 'discover') {
      this.renderCategoryFilterBar();
      this.renderDeck();
    } else if (this.currentView === 'feed') {
      this.renderStories();
      this.renderFeed();
    } else if (this.currentView === 'chats') {
      this.renderChatThreads();
      this.renderActiveMessages();
    } else if (this.currentView === 'settings') {
      this.renderSettings();
    }
  }

  updateHeaderAuthState() {
    const slot = document.getElementById('headerUserSlot');
    if (!slot) return;

    if (this.isAuthenticated) {
      slot.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div class="user-status-pill ${this.boostActive ? 'boost-active-pill' : ''}" style="cursor:pointer;" title="View Profile" onclick="window.crazyApp.handleGateRoute('settings')">
            <img src="${this.user.avatar}" class="user-avatar-tiny" alt="${this.user.name}">
            <span style="font-size:0.875rem; font-weight:800; color:#FFF;">${this.user.name.split(' ')[0]}</span>
            ${this.user.photoVerified ? '<span style="color:var(--accent-cyan); font-size:0.9rem;" title="Verified Creator">✓</span>' : ''}
          </div>
          <button class="btn-header-logout" id="btnQuickLogout" title="Sign out" type="button">✕</button>
        </div>
      `;
      const logoutBtn = document.getElementById('btnQuickLogout');
      if (logoutBtn) logoutBtn.addEventListener('click', () => this.logoutUser());
    } else {
      slot.innerHTML = `
        <button class="pill-btn pill-white pill-sm" id="btnHeaderSignIn" type="button">
          <span>Log In</span>
        </button>
      `;
      const signInBtn = document.getElementById('btnHeaderSignIn');
      if (signInBtn) signInBtn.addEventListener('click', () => this.openAuthModal());
    }
  }

  loginUser(name, email) {
    this.isAuthenticated = true;
    this.user.name = name;
    this.user.email = email;
    this.saveState();
    this.updateHeaderAuthState();
    this.closeModals();
    this.playSound('like');

    const targetRoute = this.pendingGateRoute || 'discover';
    this.pendingGateRoute = null;
    this.navigateTo(targetRoute);
  }

  logoutUser() {
    this.isAuthenticated = false;
    this.saveState();
    this.updateHeaderAuthState();
    this.playSound('pass');
    this.navigateTo('home');
  }

  // --------------------------------------------------------------------------
  // DOM REFERENCES
  // --------------------------------------------------------------------------
  initDOM() {
    this.views = {
      home: document.getElementById('viewHome'),
      discover: document.getElementById('viewDiscover'),
      feed: document.getElementById('viewFeed'),
      chats: document.getElementById('viewChats'),
      settings: document.getElementById('viewSettings')
    };

    this.navLinks = document.querySelectorAll('[data-route]');
    this.btnHeroLaunch = document.getElementById('btnHeroLaunch');
    this.btnHeroSignIn = document.getElementById('btnHeroSignIn');
    this.btnFlameLaunch = document.getElementById('btnFlameLaunch');

    // Deck Arena
    this.ccSwipeStage = document.getElementById('ccSwipeStage');
    this.btnPass = document.getElementById('btnPass');
    this.btnLike = document.getElementById('btnLike');
    this.btnRewind = document.getElementById('btnRewind');
    this.btnSuperlike = document.getElementById('btnSuperlike');
    this.btnInfo = document.getElementById('btnInfo');
    this.interestFilterBar = document.getElementById('interestFilterBar');
    this.btnOpenAiMatch = document.getElementById('btnOpenAiMatch');

    // Theatrical Chat Stage
    this.theatricalChatAvatar_page = document.getElementById('theatricalChatAvatar_page');
    this.theatricalChatName_page = document.getElementById('theatricalChatName_page');
    this.theatricalChatStatus_page = document.getElementById('theatricalChatStatus_page');
    this.theatricalMessages_page = document.getElementById('theatricalMessages_page');
    this.theatricalInput_page = document.getElementById('theatricalInput_page');
    this.btnTheatricalSend_page = document.getElementById('btnTheatricalSend_page');
    this.theatricalIcebreakers_page = document.getElementById('theatricalIcebreakers_page');
    this.chatSearchInput = document.getElementById('chatSearchInput');
    this.btnSendVoiceNote = document.getElementById('btnSendVoiceNote');
    this.chatPhotoUpload = document.getElementById('chatPhotoUpload');

    // Feed / Moments
    this.btnOpenUploadModal = document.getElementById('btnOpenUploadModal');
    this.storiesTray = document.getElementById('storiesTray');
    this.feedStream = document.getElementById('feedStream');

    // Modals
    this.matchModal = document.getElementById('ccMatchModal');
    this.matchAvatar = document.getElementById('ccMatchAvatar');
    this.matchName = document.getElementById('ccMatchName');
    this.btnMatchChat = document.getElementById('btnMatchChat');
    this.btnMatchClose = document.getElementById('btnMatchClose');

    this.authModal = document.getElementById('ccAuthModal');
    this.googleAuthBtn = document.getElementById('googleAuthBtn');
    this.guestAuthBtn = document.getElementById('guestAuthBtn');

    this.infoModal = document.getElementById('ccInfoModal');
    this.infoModalBody = document.getElementById('infoModalBody');

    this.aiMatchModal = document.getElementById('ccAiMatchModal');
    this.aiHobbiesPicker = document.getElementById('aiHobbiesPicker');
    this.btnRunAiMatchScan = document.getElementById('btnRunAiMatchScan');
    this.aiMatchResults = document.getElementById('aiMatchResults');

    this.uploadModal = document.getElementById('ccUploadModal');
    this.momentFileInput = document.getElementById('momentFileInput');
    this.uploadPreviewImg = document.getElementById('uploadPreviewImg');
    this.uploadCaption = document.getElementById('uploadCaption');
    this.uploadInterest = document.getElementById('uploadInterest');
    this.btnSubmitMoment = document.getElementById('btnSubmitMoment');
    this.uploadPresetsRow = document.getElementById('uploadPresetsRow');

    // Settings elements
    this.sliderDistance = document.getElementById('sliderDistance');
    this.labelDistance = document.getElementById('labelDistance');
    this.sliderAge = document.getElementById('sliderAge');
    this.labelAgeRange = document.getElementById('labelAgeRange');
    this.selectAiSensitivity = document.getElementById('selectAiSensitivity');
    this.toggleSoundFx = document.getElementById('toggleSoundFx');
    this.toggleStealth = document.getElementById('toggleStealth');
    this.toggleReadReceipts = document.getElementById('toggleReadReceipts');
    this.togglePhotoBlur = document.getElementById('togglePhotoBlur');
    this.btnResetAllSwipes = document.getElementById('btnResetAllSwipes');
    this.btnLogoutFromSettings = document.getElementById('btnLogoutFromSettings');
    this.settingsBioInput = document.getElementById('settingsBioInput');
    this.btnSaveBio = document.getElementById('btnSaveBio');
    this.settingsUserName = document.getElementById('settingsUserName');
    this.settingsUserEmail = document.getElementById('settingsUserEmail');
    this.settingsUserAvatar = document.getElementById('settingsUserAvatar');

    // Interactive Mascot
    this.mascotPeek = document.getElementById('mascotPeek');

    // Extended Modals & Triggers
    this.onboardingModal = document.getElementById('ccOnboardingModal');
    this.vipModal = document.getElementById('ccVipModal');
    this.safetyModal = document.getElementById('ccSafetyModal');
    this.videoCallModal = document.getElementById('ccVideoCallModal');
    this.archModal = document.getElementById('ccArchitectureModal');
    this.aiWingmanTray = document.getElementById('aiWingmanTray');
  }

  // --------------------------------------------------------------------------
  // EVENT BINDINGS
  // --------------------------------------------------------------------------
  bindEvents() {
    // Navigation Routing
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.dataset.route;
        this.handleGateRoute(route);
      });
    });

    if (this.btnHeroLaunch) this.btnHeroLaunch.addEventListener('click', () => {
      this.playSound('pop');
      this.handleGateRoute('discover');
    });
    if (this.btnHeroSignIn) this.btnHeroSignIn.addEventListener('click', () => {
      this.playSound('pop');
      this.openAuthModal();
    });
    if (this.btnFlameLaunch) this.btnFlameLaunch.addEventListener('click', () => {
      this.playSound('pop');
      this.handleGateRoute('discover');
    });

    // Mascot Click Interaction
    if (this.mascotPeek) {
      this.mascotPeek.addEventListener('click', () => {
        this.playSound('pop');
        this.mascotPeek.style.transform = 'translateX(-50%) translateY(-24px) rotate(4deg)';
        setTimeout(() => {
          this.mascotPeek.style.transform = '';
        }, 300);
      });
    }

    // Deck Gestures and Action Buttons
    if (this.btnPass) this.btnPass.addEventListener('click', () => {
      this.playSound('pass');
      this.swipeTopCard('pass');
    });
    if (this.btnLike) this.btnLike.addEventListener('click', () => {
      this.playSound('like');
      this.swipeTopCard('like');
    });
    if (this.btnSuperlike) this.btnSuperlike.addEventListener('click', () => {
      this.triggerSuperLikeAction();
    });
    if (this.btnRewind) this.btnRewind.addEventListener('click', () => {
      this.playSound('pop');
      this.rewindLastCard();
    });
    if (this.btnInfo) this.btnInfo.addEventListener('click', () => {
      this.playSound('pop');
      this.showCardDetails();
    });
    if (this.btnOpenAiMatch) this.btnOpenAiMatch.addEventListener('click', () => {
      this.playSound('pop');
      this.openAiMatchModal();
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (this.currentView === 'discover') {
        if (e.key === 'ArrowLeft') {
          this.playSound('pass');
          this.swipeTopCard('pass');
        }
        if (e.key === 'ArrowRight') {
          this.playSound('like');
          this.swipeTopCard('like');
        }
        if (e.key === 'ArrowUp') {
          this.triggerSuperLikeAction();
        }
        if (e.key === 'ArrowDown') {
          this.playSound('pop');
          this.rewindLastCard();
        }
        if (e.key === ' ') {
          e.preventDefault();
          this.playSound('pop');
          this.showCardDetails();
        }
      }
    });

    // Chat Message Sending
    if (this.btnTheatricalSend_page) {
      this.btnTheatricalSend_page.addEventListener('click', () => {
        const text = this.theatricalInput_page.value;
        this.sendChatMessage(text);
        this.theatricalInput_page.value = '';
      });
    }

    if (this.theatricalInput_page) {
      this.theatricalInput_page.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.sendChatMessage(this.theatricalInput_page.value);
          this.theatricalInput_page.value = '';
        }
      });
    }

    // Quick Emoji Bar
    document.querySelectorAll('.quick-emoji-bar .quick-emoji-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const emoji = chip.dataset.emoji;
        if (emoji) {
          this.playSound('pop');
          this.sendChatMessage(emoji);
        }
      });
    });

    // Audio Call Simulation
    const audioCallBtn = document.getElementById('btnSimulateAudioCall');
    if (audioCallBtn) {
      audioCallBtn.addEventListener('click', () => {
        this.playSound('superlike');
        const partner = PROFILES.find(p => p.id === this.activeChatId);
        alert(`📞 Encrypted audio connection active with ${partner ? partner.name : 'match'}... (Microphone active)`);
      });
    }

    // Video Call Simulation
    const videoCallBtn = document.getElementById('btnSimulateVideoCall');
    if (videoCallBtn) {
      videoCallBtn.addEventListener('click', () => {
        this.openVideoCallModal();
      });
    }

    // Voice Memo
    if (this.btnSendVoiceNote) {
      this.btnSendVoiceNote.addEventListener('click', () => {
        this.playSound('pop');
        this.sendVoiceNoteMessage();
      });
    }

    // Photo Upload in Chat
    if (this.chatPhotoUpload) {
      this.chatPhotoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          this.sendImageMessage(event.target.result);
        };
        reader.readAsDataURL(file);
      });
    }

    // Chat Search Filter
    if (this.chatSearchInput) {
      this.chatSearchInput.addEventListener('input', (e) => {
        this.filterChatThreads(e.target.value.toLowerCase());
      });
    }

    // Feed Upload Moment
    if (this.btnOpenUploadModal) {
      this.btnOpenUploadModal.addEventListener('click', () => {
        this.playSound('pop');
        this.openUploadModal();
      });
    }

    if (this.momentFileInput) {
      this.momentFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          this.selectedPresetUploadUrl = event.target.result;
          this.uploadPreviewImg.src = event.target.result;
          this.uploadPreviewImg.style.display = 'block';
          document.querySelectorAll('.upload-preset-thumb').forEach(t => t.classList.remove('active'));
        };
        reader.readAsDataURL(file);
      });
    }

    if (this.uploadPresetsRow) {
      this.uploadPresetsRow.addEventListener('click', (e) => {
        const thumb = e.target.closest('.upload-preset-thumb');
        if (!thumb) return;
        document.querySelectorAll('.upload-preset-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        this.selectedPresetUploadUrl = thumb.dataset.url;
        this.uploadPreviewImg.src = this.selectedPresetUploadUrl;
        this.uploadPreviewImg.style.display = 'block';
      });
    }

    if (this.btnSubmitMoment) {
      this.btnSubmitMoment.addEventListener('click', () => {
        this.playSound('like');
        this.submitNewMoment();
      });
    }

    // Google Auth & Guest Auth
    if (this.googleAuthBtn) {
      this.googleAuthBtn.addEventListener('click', () => this.loginUser("Armaan Yadav", "armaan123009@gmail.com"));
    }
    if (this.guestAuthBtn) {
      this.guestAuthBtn.addEventListener('click', () => this.loginUser("Guest Creator", "guest@crazylove.studio"));
    }

    // Match Modal actions
    if (this.btnMatchChat) {
      this.btnMatchChat.addEventListener('click', () => {
        this.closeModals();
        this.navigateTo('chats');
      });
    }
    if (this.btnMatchClose) {
      this.btnMatchClose.addEventListener('click', () => {
        this.playSound('pop');
        this.closeModals();
      });
    }

    // Close Modals on click outside or close buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.playSound('pop');
        this.closeModals();
      });
    });

    document.querySelectorAll('.cc-modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.playSound('pop');
          this.closeModals();
        }
      });
    });

    // Accordions
    document.querySelectorAll('.faq-item-row').forEach(row => {
      row.addEventListener('click', () => {
        this.playSound('pop');
        row.classList.toggle('open');
      });
    });

    // Settings Inputs Listeners
    if (this.sliderDistance) {
      this.sliderDistance.addEventListener('input', (e) => {
        this.settings.maxDistance = parseInt(e.target.value);
        if (this.labelDistance) this.labelDistance.textContent = `${this.settings.maxDistance} km`;
        this.saveState();
      });
    }

    if (this.sliderAge) {
      this.sliderAge.addEventListener('input', (e) => {
        this.settings.maxAge = parseInt(e.target.value);
        if (this.labelAgeRange) this.labelAgeRange.textContent = `18 – ${this.settings.maxAge}`;
        this.saveState();
      });
    }

    if (this.selectAiSensitivity) {
      this.selectAiSensitivity.addEventListener('change', (e) => {
        this.settings.aiSensitivity = e.target.value;
        this.saveState();
      });
    }

    if (this.toggleSoundFx) {
      this.toggleSoundFx.addEventListener('change', (e) => {
        this.settings.soundFx = e.target.checked;
        this.saveState();
      });
    }

    if (this.toggleStealth) {
      this.toggleStealth.addEventListener('change', (e) => {
        this.settings.stealthMode = e.target.checked;
        this.saveState();
        if (this.currentView === 'discover') this.renderDeck();
      });
    }

    if (this.toggleReadReceipts) {
      this.toggleReadReceipts.addEventListener('change', (e) => {
        this.settings.readReceipts = e.target.checked;
        this.saveState();
      });
    }

    if (this.togglePhotoBlur) {
      this.togglePhotoBlur.addEventListener('change', (e) => {
        this.settings.photoBlur = e.target.checked;
        this.saveState();
      });
    }

    if (this.btnSaveBio) {
      this.btnSaveBio.addEventListener('click', () => {
        this.playSound('like');
        if (this.settingsBioInput) {
          this.user.bio = this.settingsBioInput.value;
          this.saveState();
          alert('✓ Studio Bio saved successfully!');
        }
      });
    }

    if (this.btnResetAllSwipes) {
      this.btnResetAllSwipes.addEventListener('click', () => {
        this.playSound('pop');
        this.swiped = {};
        this.saveState();
        alert('↺ Swiped queue reset! All candidates returned to your discovery deck.');
        if (this.currentView === 'discover') this.renderDeck();
      });
    }

    if (this.btnLogoutFromSettings) {
      this.btnLogoutFromSettings.addEventListener('click', () => {
        this.logoutUser();
      });
    }
  }

  // --------------------------------------------------------------------------
  // EXTENDED FEATURES: ONBOARDING, AI WINGMAN, VIP PERKS, SAFETY & ARCHITECTURE
  // --------------------------------------------------------------------------
  initExtendedFeatures() {
    // 1. Onboarding Triggers & Flow
    const launchOnboardingHome = document.getElementById('btnLaunchOnboardingHome');
    const settingsOnboarding = document.getElementById('btnSettingsOnboarding');
    if (launchOnboardingHome) launchOnboardingHome.addEventListener('click', () => this.openOnboardingModal());
    if (settingsOnboarding) settingsOnboarding.addEventListener('click', () => this.openOnboardingModal());

    const btnSendSms = document.getElementById('btnSendSmsCode');
    const btnVerifySms = document.getElementById('btnVerifySmsCode');
    const smsCodeRow = document.getElementById('smsCodeRow');

    if (btnSendSms) {
      btnSendSms.addEventListener('click', () => {
        this.playSound('pop');
        if (smsCodeRow) smsCodeRow.style.display = 'block';
        btnSendSms.style.display = 'none';
        if (btnVerifySms) btnVerifySms.style.display = 'block';
      });
    }

    if (btnVerifySms) {
      btnVerifySms.addEventListener('click', () => {
        this.playSound('like');
        this.setOnboardingStep(2);
      });
    }

    const btnCaptureSelfie = document.getElementById('btnCaptureSelfie');
    const btnStep2Next = document.getElementById('btnStep2Next');
    const verificationResultBox = document.getElementById('verificationResultBox');

    if (btnCaptureSelfie) {
      btnCaptureSelfie.addEventListener('click', () => {
        this.playSound('superlike');
        if (verificationResultBox) verificationResultBox.style.display = 'block';
        btnCaptureSelfie.style.display = 'none';
        if (btnStep2Next) btnStep2Next.style.display = 'block';
        this.user.photoVerified = true;
        this.saveState();
      });
    }

    if (btnStep2Next) {
      btnStep2Next.addEventListener('click', () => {
        this.playSound('pop');
        this.setOnboardingStep(3);
      });
    }

    const btnStep3Next = document.getElementById('btnStep3Next');
    if (btnStep3Next) {
      btnStep3Next.addEventListener('click', () => {
        this.playSound('pop');
        this.setOnboardingStep(4);
      });
    }

    // Values Tag Toggle in Step 4
    const valuesPicker = document.getElementById('onboardingValuesPicker');
    if (valuesPicker) {
      valuesPicker.addEventListener('click', (e) => {
        const tag = e.target.closest('.ai-hobby-tag');
        if (!tag) return;
        this.playSound('pop');
        tag.classList.toggle('active');
      });
    }

    const btnCompleteOnboarding = document.getElementById('btnCompleteOnboarding');
    if (btnCompleteOnboarding) {
      btnCompleteOnboarding.addEventListener('click', () => {
        this.playSound('superlike');
        this.closeModals();
        this.loginUser(this.user.name, this.user.email);
        alert('🎉 Onboarding Complete! Your profile is 100% verified with blue badge.');
      });
    }

    // 2. VIP Perks Modal & Boost Actions
    const btnOpenVipHome = document.getElementById('btnOpenVipPerksHome');
    const btnDeckVip = document.getElementById('btnDeckVipPerks');
    if (btnOpenVipHome) btnOpenVipHome.addEventListener('click', () => this.openVipModal());
    if (btnDeckVip) btnDeckVip.addEventListener('click', () => this.openVipModal());

    const btnDeckBoost = document.getElementById('btnDeckBoost');
    const btnActivateBoost = document.getElementById('btnActivateBoostAction');
    if (btnDeckBoost) btnDeckBoost.addEventListener('click', () => this.activateBoost());
    if (btnActivateBoost) btnActivateBoost.addEventListener('click', () => this.activateBoost());

    const btnTestSuperLike = document.getElementById('btnSendTestSuperLike');
    if (btnTestSuperLike) btnTestSuperLike.addEventListener('click', () => this.triggerSuperLikeAction());

    const btnRevealAll = document.getElementById('btnRevealAllAdmirers');
    if (btnRevealAll) {
      btnRevealAll.addEventListener('click', () => {
        this.playSound('superlike');
        this.admirersRevealed = true;
        document.querySelectorAll('.admirer-card').forEach(c => c.classList.add('revealed'));
        btnRevealAll.textContent = '✓ All Admirers Revealed';
      });
    }

    // 3. Safety & Moderation
    const btnDeckSafety = document.getElementById('btnDeckSafety');
    const btnChatSafety = document.getElementById('btnChatSafety');
    if (btnDeckSafety) btnDeckSafety.addEventListener('click', () => this.openSafetyModal());
    if (btnChatSafety) btnChatSafety.addEventListener('click', () => this.openSafetyModal());

    const btnSubmitReport = document.getElementById('btnSubmitReportAction');
    if (btnSubmitReport) {
      btnSubmitReport.addEventListener('click', () => {
        this.playSound('pop');
        this.closeModals();
        alert('🛡️ Report submitted to Crazy Love Trust & Safety. Our moderation team reviews all flagged content within 15 minutes.');
      });
    }

    const btnBlockUser = document.getElementById('btnBlockUserAction');
    if (btnBlockUser) {
      btnBlockUser.addEventListener('click', () => {
        this.playSound('pass');
        const activeProfile = this.getActiveTargetProfile();
        if (activeProfile) {
          this.blockedUserIds.add(activeProfile.id);
          this.swiped[activeProfile.id] = 'pass';
          this.saveState();
          this.closeModals();
          alert(`🚫 ${activeProfile.name} has been blocked and removed from your queue and chats.`);
          if (this.currentView === 'discover') this.renderDeck();
          if (this.currentView === 'chats') this.renderChatThreads();
        }
      });
    }

    // 4. Video Call Simulation
    const btnCallHangup = document.getElementById('btnCallHangup');
    const btnCallMute = document.getElementById('btnCallMute');
    const btnCallFlip = document.getElementById('btnCallFlip');

    if (btnCallHangup) {
      btnCallHangup.addEventListener('click', () => {
        this.playSound('pass');
        if (this.videoCallModal) this.videoCallModal.style.display = 'none';
      });
    }

    if (btnCallMute) {
      btnCallMute.addEventListener('click', () => {
        this.playSound('pop');
        btnCallMute.classList.toggle('active');
        btnCallMute.style.background = btnCallMute.classList.contains('active') ? '#EF4444' : '#27272A';
      });
    }

    if (btnCallFlip) {
      btnCallFlip.addEventListener('click', () => {
        this.playSound('pop');
        const stream = document.getElementById('videoCallStreamImg');
        if (stream) stream.style.transform = stream.style.transform === 'scaleX(-1)' ? 'none' : 'scaleX(-1)';
      });
    }

    // 5. AI Wingman Opener Drawer
    const btnToggleWingman = document.getElementById('btnToggleAiWingman');
    if (btnToggleWingman) {
      btnToggleWingman.addEventListener('click', () => {
        this.playSound('pop');
        this.toggleAiWingmanDrawer();
      });
    }

    // 6. System Architecture Blueprint
    const btnOpenArchHome = document.getElementById('btnOpenArchitectureHome');
    const btnSettingsArch = document.getElementById('btnSettingsArch');
    if (btnOpenArchHome) btnOpenArchHome.addEventListener('click', () => this.openArchitectureModal());
    if (btnSettingsArch) btnSettingsArch.addEventListener('click', () => this.openArchitectureModal());
  }

  // --------------------------------------------------------------------------
  // MODALS LAUNCHERS
  // --------------------------------------------------------------------------
  openAuthModal() {
    this.authModal.classList.add('active');
  }

  openOnboardingModal() {
    this.setOnboardingStep(1);
    if (this.onboardingModal) this.onboardingModal.classList.add('active');
  }

  setOnboardingStep(stepNum) {
    this.onboardingStep = stepNum;
    for (let i = 1; i <= 4; i++) {
      const stepEl = document.getElementById(`onboardingStep${i}`);
      const dotEl = document.getElementById(`stepDot${i}`);
      if (stepEl) stepEl.style.display = i === stepNum ? 'block' : 'none';
      if (dotEl) {
        dotEl.classList.toggle('active', i === stepNum);
        dotEl.classList.toggle('done', i < stepNum);
      }
    }
  }

  openVipModal() {
    this.renderAdmirersGrid();
    if (this.vipModal) this.vipModal.classList.add('active');
  }

  openSafetyModal() {
    if (this.safetyModal) this.safetyModal.classList.add('active');
  }

  openArchitectureModal() {
    if (this.archModal) this.archModal.classList.add('active');
  }

  openVideoCallModal() {
    const partner = this.getActiveTargetProfile();
    if (!partner) return;

    this.playSound('superlike');
    const partnerNameEl = document.getElementById('videoCallPartnerName');
    const streamImgEl = document.getElementById('videoCallStreamImg');

    if (partnerNameEl) partnerNameEl.textContent = `${partner.name} (Live Video)`;
    if (streamImgEl) streamImgEl.src = partner.photos && partner.photos[1] ? partner.photos[1] : partner.photos[0];

    if (this.videoCallModal) this.videoCallModal.style.display = 'flex';
  }

  getActiveTargetProfile() {
    if (this.currentView === 'chats' && this.activeChatId) {
      return PROFILES.find(p => p.id === this.activeChatId);
    }
    const deck = this.getActiveDeck();
    return deck.length > 0 ? deck[0] : PROFILES[0];
  }

  activateBoost() {
    if (this.boostActive) {
      alert(`⚡ 10x Radar Boost already active! ${Math.floor(this.boostSecondsRemaining / 60)} minutes remaining.`);
      return;
    }

    this.playSound('superlike');
    this.boostActive = true;
    this.boostSecondsRemaining = 1800; // 30 mins
    this.saveState();
    this.updateHeaderAuthState();

    const deckSummary = document.getElementById('deckVipSummary');
    if (deckSummary) deckSummary.innerHTML = `⚡ <span style="color:var(--accent-lime);">10x BOOST ACTIVE</span> (30m) · 3 Secret Admirers`;

    alert('🚀 10x Profile Boost Activated! Your profile is now prioritized in discovery for all local creators in Tokyo.');
  }

  triggerSuperLikeAction() {
    if (this.superLikesRemaining <= 0) {
      alert('★ You have used all 3 Super Likes for today! Refills in 24 hours.');
      return;
    }

    this.playSound('superlike');
    this.superLikesRemaining--;
    this.saveState();

    const balText = document.getElementById('superLikeBalanceText');
    if (balText) balText.textContent = `${this.superLikesRemaining} Available`;

    // Trigger deck swipe
    this.swipeTopCard('like');
  }

  renderAdmirersGrid() {
    const grid = document.getElementById('admirersGrid');
    if (!grid) return;
    grid.innerHTML = '';

    SECRET_ADMIRERS.forEach(admirer => {
      const card = document.createElement('div');
      card.className = `admirer-card ${this.admirersRevealed ? 'revealed' : ''}`;
      card.innerHTML = `
        <div class="admirer-img-wrap">
          <img src="${admirer.photos[0]}" class="admirer-img" alt="${admirer.name}">
          <span class="admirer-badge-superlike">★ ${admirer.action}</span>
        </div>
        <div style="padding:0.85rem 1rem;">
          <strong style="color:#FFF; font-size:1.05rem; display:block;">${admirer.name}, ${admirer.age}</strong>
          <span style="font-size:0.8rem; color:var(--accent-lime); font-weight:700;">${admirer.occupation}</span>
          <p style="font-size:0.75rem; color:#A1A1AA; margin:0.35rem 0 0.75rem;">${admirer.previewVibe}</p>
          <button class="pill-btn pill-lime pill-xs" style="width:100%;" type="button">
            Match Instantly ⚡
          </button>
        </div>
      `;

      card.querySelector('button').addEventListener('click', () => {
        this.playSound('like');
        this.closeModals();
        this.triggerMatch({
          id: admirer.id,
          name: admirer.name,
          age: admirer.age,
          avatar: admirer.photos[0],
          photos: admirer.photos,
          occupation: admirer.occupation,
          city: admirer.city,
          compatibility: admirer.compatibility,
          initialMessage: "Hey! Loved your aesthetic on the radar. What are you building right now?"
        });
      });

      grid.appendChild(card);
    });
  }

  toggleAiWingmanDrawer() {
    if (!this.aiWingmanTray) return;
    const isHidden = this.aiWingmanTray.style.display === 'none' || !this.aiWingmanTray.style.display;
    
    if (isHidden) {
      this.renderAiWingmanOpeners();
      this.aiWingmanTray.style.display = 'block';
    } else {
      this.aiWingmanTray.style.display = 'none';
    }
  }

  renderAiWingmanOpeners() {
    if (!this.aiWingmanTray) return;
    const profile = PROFILES.find(p => p.id === this.activeChatId) || PROFILES[0];
    const openers = AI_WINGMAN_OPENERS[profile.id] || [
      `What is your quintessential weekend unwinding ritual?`,
      `I noticed your taste in design—what's your favorite creative spot in Tokyo?`,
      `Coffee or evening listening bar?`
    ];

    this.aiWingmanTray.innerHTML = `
      <div class="ai-wingman-header">
        <div class="ai-wingman-title">
          <span>⚡</span>
          <span>AI Wingman Opener Radar</span>
        </div>
        <span style="font-size:0.75rem; color:var(--muted-gray); font-weight:700;">Based on ${profile.name}'s hobbies</span>
      </div>
      <div class="ai-wingman-openers-grid">
        ${openers.map((op, idx) => `
          <div class="ai-opener-card" data-opener-index="${idx}">
            <span>"${op}"</span>
            <button class="opener-tap-btn" type="button">Fire ⚡</button>
          </div>
        `).join('')}
      </div>
    `;

    this.aiWingmanTray.querySelectorAll('.ai-opener-card').forEach((card, idx) => {
      card.addEventListener('click', () => {
        this.playSound('superlike');
        const text = openers[idx];
        this.sendChatMessage(text);
        this.aiWingmanTray.style.display = 'none';
      });
    });
  }

  // --------------------------------------------------------------------------
  // DECK / DISCOVERY CARDS WITH RICH PROMPTS, VALUES & LINKED SOCIALS
  // --------------------------------------------------------------------------
  renderCategoryFilterBar() {
    if (!this.interestFilterBar) return;
    this.interestFilterBar.innerHTML = '';

    CATEGORIES.forEach(cat => {
      const chip = document.createElement('button');
      chip.className = `interest-chip ${this.activeCategory === cat.id ? 'active' : ''}`;
      chip.innerHTML = `<span>${cat.icon}</span> <span>${cat.label}</span>`;
      chip.addEventListener('click', () => {
        this.playSound('pop');
        this.activeCategory = cat.id;
        this.saveState();
        this.renderCategoryFilterBar();
        this.renderDeck();
      });
      this.interestFilterBar.appendChild(chip);
    });
  }

  getActiveDeck() {
    return PROFILES.filter(p => {
      if (this.blockedUserIds && this.blockedUserIds.has(p.id)) return false;
      if (this.swiped[p.id]) return false;
      if (this.settings.maxAge && p.age > this.settings.maxAge) return false;
      if (this.activeCategory === 'all') return true;
      return p.category === this.activeCategory;
    });
  }

  renderDeck() {
    const deck = this.getActiveDeck();
    this.ccSwipeStage.innerHTML = '';

    if (deck.length === 0) {
      this.ccSwipeStage.innerHTML = `
        <div style="background:#18181B; border:3px solid #27272A; border-radius:var(--radius-card); padding:3.5rem 2rem; text-align:center; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5rem; box-shadow:0 20px 50px rgba(0,0,0,0.6);">
          <div style="width:4.75rem; height:4.75rem; border-radius:50%; background:var(--accent-lime); display:flex; align-items:center; justify-content:center; font-size:2rem; font-weight:900; color:#000; box-shadow:0 6px 20px rgba(212,255,0,0.4);">★</div>
          <h3 style="font-size:2.5rem; font-weight:800; text-transform:uppercase; line-height:1; color:#FFF;">Queue Explored!</h3>
          <p style="color:#A1A1AA; font-size:1.15rem; max-width:340px; font-weight:600;">You've seen all verified candidates in this vibe. Reset your queue or choose another category.</p>
          <button class="pill-btn pill-pink" id="btnResetCrazyDeck">↺ Reset Queue</button>
        </div>
      `;
      const resetBtn = document.getElementById('btnResetCrazyDeck');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.playSound('pop');
          this.swiped = {};
          this.saveState();
          this.renderDeck();
        });
      }
      return;
    }

    const topThree = deck.slice(0, 3);
    topThree.reverse().forEach((profile, index) => {
      const cardEl = this.createCardElement(profile, index, topThree.length);
      this.ccSwipeStage.appendChild(cardEl);
    });

    const topCard = this.ccSwipeStage.lastElementChild;
    if (topCard) {
      this.attachDragGestures(topCard);
    }
  }

  createCardElement(profile, reverseIndex, totalCount) {
    const isSecond = reverseIndex === totalCount - 2;
    const isThird = reverseIndex === totalCount - 3;
    const currentPhotoIdx = this.cardPhotoIndices[profile.id] || 0;
    const photos = profile.photos && profile.photos.length > 0 ? profile.photos : [profile.avatar];

    const card = document.createElement('div');
    card.className = `cc-swipe-card ${isSecond ? 'depth-2' : ''} ${isThird ? 'depth-3' : ''}`;
    card.dataset.profileId = profile.id;

    card.innerHTML = `
      <div class="cc-card-art">
        <!-- Photo Pagination Bars -->
        <div class="card-photo-bars">
          ${photos.map((_, i) => `<span class="card-photo-bar-dash ${i === currentPhotoIdx ? 'active' : ''}"></span>`).join('')}
        </div>

        <!-- Badges Row -->
        <div class="cc-card-badges-row">
          <span class="cc-card-category-tag">${profile.categoryLabel}</span>
          <span class="cc-card-match-score">⚡ ${profile.compatibility}% MATCH</span>
        </div>

        <!-- Image -->
        <img src="${photos[currentPhotoIdx]}" class="card-hero-img" alt="${profile.name}">
        <div class="cc-card-vignette"></div>

        <!-- Tap zones to navigate photos -->
        <div class="card-tap-zone card-tap-left" title="Previous photo"></div>
        <div class="card-tap-zone card-tap-right" title="Next photo"></div>

        <!-- Dynamic Action Stamps -->
        <div class="cc-stamp cc-stamp-like">MATCH!</div>
        <div class="cc-stamp cc-stamp-pass">PASS</div>
      </div>

      <div class="cc-card-body">
        <div>
          <div class="cc-card-title-row">
            <div>
              <span class="cc-name-heading">${profile.name}, ${profile.age}</span>
              ${profile.photoVerified ? '<span style="color:var(--accent-cyan); font-size:1.15rem; margin-left:0.35rem;" title="100% Photo Verified">✓</span>' : ''}
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span class="anti-ghost-badge" title="48h Anti-Ghosting Window">⏳ 48h</span>
              <span style="font-size:0.9rem; font-weight:800; color:var(--canvas-pink);">
                ${this.settings.stealthMode ? profile.city : profile.distance}
              </span>
            </div>
          </div>
          <div style="font-size:0.95rem; font-weight:700; color:var(--accent-lime); margin-top:0.2rem;">
            ${profile.occupation} · ${profile.city}
          </div>
          <p class="cc-bio-snippet">
            ${profile.bio}
          </p>
        </div>

        <!-- Linked Socials Row -->
        <div class="social-links-row">
          ${profile.socials && profile.socials.spotify ? `
            <span class="social-badge spotify" title="Anthem: ${profile.socials.spotify}">
              <span>♫</span>
              <span>${profile.socials.spotify.split('•')[0].trim()}</span>
              <span class="soundwave-bars">
                <span class="soundwave-bar"></span>
                <span class="soundwave-bar"></span>
                <span class="soundwave-bar"></span>
              </span>
            </span>
          ` : ''}
          ${profile.socials && profile.socials.instagram ? `
            <span class="social-badge instagram" title="Instagram: ${profile.socials.instagram}">
              <span>📸</span>
              <span>${profile.socials.instagram}</span>
            </span>
          ` : ''}
          ${profile.videoCheck ? `
            <span class="social-badge" style="border-color:var(--accent-yellow); color:var(--accent-yellow);" title="${profile.videoCheck.title}">
              <span>📹 Video Vibe (${profile.videoCheck.duration})</span>
            </span>
          ` : ''}
        </div>

        <div>
          <div class="cc-card-hobbies-row">
            ${profile.hobbies.slice(0, 3).map(h => `<span class="cc-hobby-pill">${h}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    // Bind Photo Tap switcher
    const tapLeft = card.querySelector('.card-tap-left');
    const tapRight = card.querySelector('.card-tap-right');
    const imgEl = card.querySelector('.card-hero-img');
    const dashes = card.querySelectorAll('.card-photo-bar-dash');

    if (tapLeft && tapRight && photos.length > 1) {
      tapLeft.addEventListener('click', (e) => {
        e.stopPropagation();
        let idx = this.cardPhotoIndices[profile.id] || 0;
        idx = (idx - 1 + photos.length) % photos.length;
        this.cardPhotoIndices[profile.id] = idx;
        imgEl.src = photos[idx];
        dashes.forEach((d, i) => d.classList.toggle('active', i === idx));
        this.playSound('pop');
      });

      tapRight.addEventListener('click', (e) => {
        e.stopPropagation();
        let idx = this.cardPhotoIndices[profile.id] || 0;
        idx = (idx + 1) % photos.length;
        this.cardPhotoIndices[profile.id] = idx;
        imgEl.src = photos[idx];
        dashes.forEach((d, i) => d.classList.toggle('active', i === idx));
        this.playSound('pop');
      });
    }

    return card;
  }

  attachDragGestures(cardEl) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    const likeStamp = cardEl.querySelector('.cc-stamp-like');
    const passStamp = cardEl.querySelector('.cc-stamp-pass');

    const onPointerDown = (e) => {
      if (e.target.closest('.card-tap-zone')) return;
      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX);
      startY = e.clientY || (e.touches && e.touches[0].clientY);
      cardEl.style.transition = 'none';
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      currentX = clientX - startX;
      currentY = clientY - startY;

      const rotate = currentX * 0.08;
      cardEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rotate}deg)`;

      if (currentX > 35) {
        if (likeStamp) likeStamp.style.opacity = Math.min((currentX - 35) / 80, 1);
        if (passStamp) passStamp.style.opacity = 0;
      } else if (currentX < -35) {
        if (passStamp) passStamp.style.opacity = Math.min((-currentX - 35) / 80, 1);
        if (likeStamp) likeStamp.style.opacity = 0;
      } else {
        if (likeStamp) likeStamp.style.opacity = 0;
        if (passStamp) passStamp.style.opacity = 0;
      }
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      cardEl.style.transition = 'transform 0.4s var(--spring-bounce), opacity 0.3s ease';

      const threshold = 110;
      if (currentX > threshold) {
        this.playSound('like');
        this.executeSwipe(cardEl, 'like');
      } else if (currentX < -threshold) {
        this.playSound('pass');
        this.executeSwipe(cardEl, 'pass');
      } else {
        cardEl.style.transform = '';
        if (likeStamp) likeStamp.style.opacity = 0;
        if (passStamp) passStamp.style.opacity = 0;
      }
    };

    cardEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    cardEl.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  swipeTopCard(action) {
    const topCard = this.ccSwipeStage.lastElementChild;
    if (!topCard || !topCard.classList.contains('cc-swipe-card')) return;
    this.executeSwipe(topCard, action);
  }

  executeSwipe(cardEl, action) {
    const profileId = cardEl.dataset.profileId;
    const profile = PROFILES.find(p => p.id === profileId);

    if (action === 'like') {
      cardEl.style.transform = `translate3d(${window.innerWidth + 200}px, 40px, 0) rotate(30deg)`;
    } else {
      cardEl.style.transform = `translate3d(-${window.innerWidth + 200}px, 40px, 0) rotate(-30deg)`;
    }
    cardEl.style.opacity = '0';

    this.swiped[profileId] = action;
    this.lastSwipedId = profileId;

    if (action === 'like') {
      this.triggerMatch(profile);
    } else {
      this.saveState();
    }

    setTimeout(() => {
      this.renderDeck();
    }, 240);
  }

  rewindLastCard() {
    if (!this.lastSwipedId) return;
    delete this.swiped[this.lastSwipedId];
    this.lastSwipedId = null;
    this.saveState();
    this.renderDeck();
  }

  triggerMatch(profile) {
    const exists = this.matches.some(m => m.profileId === profile.id);
    if (!exists) {
      this.matches.unshift({
        profileId: profile.id,
        matchedAt: "Just now",
        unread: true,
        lastMessage: profile.initialMessage,
        lastTime: "Just now",
        antiGhostTimer: "48h 00m"
      });

      if (!this.chats[profile.id]) {
        this.chats[profile.id] = [
          {
            id: `msg-${Date.now()}`,
            sender: "them",
            type: "text",
            text: profile.initialMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: ["❤️"],
            status: "seen"
          }
        ];
      }
      this.saveState();
    }

    this.matchAvatar.src = profile.avatar;
    this.matchName.textContent = profile.name;
    this.activeChatId = profile.id;
    this.matchModal.classList.add('active');
  }

  // --------------------------------------------------------------------------
  // AI CHEMISTRY RADAR SCANNER
  // --------------------------------------------------------------------------
  openAiMatchModal() {
    this.renderAiHobbiesPicker();
    this.aiMatchModal.classList.add('active');
  }

  renderAiHobbiesPicker() {
    const ALL_RADAR_HOBBIES = [
      "35mm Film", "Brutalist Architecture", "Specialty Coffee",
      "Analog Photography", "Modular Synthesizers", "Pastry Architecture",
      "Ceramic Art", "Bouldering", "Independent Books",
      "Vintage Fashion", "Botanical Gardening", "Techno Records"
    ];

    this.aiHobbiesPicker.innerHTML = '';
    ALL_RADAR_HOBBIES.forEach(hobby => {
      const tag = document.createElement('span');
      const isSelected = this.selectedAiHobbies.includes(hobby);
      tag.className = `ai-hobby-tag ${isSelected ? 'active' : ''}`;
      tag.textContent = hobby;
      tag.addEventListener('click', () => {
        this.playSound('pop');
        if (this.selectedAiHobbies.includes(hobby)) {
          this.selectedAiHobbies = this.selectedAiHobbies.filter(h => h !== hobby);
        } else {
          this.selectedAiHobbies.push(hobby);
        }
        tag.classList.toggle('active');
        this.saveState();
      });
      this.aiHobbiesPicker.appendChild(tag);
    });

    if (this.btnRunAiMatchScan) {
      this.btnRunAiMatchScan.onclick = () => {
        this.runAiMatchScan();
      };
    }
  }

  runAiMatchScan() {
    this.playSound('superlike');
    this.btnRunAiMatchScan.textContent = "Analyzing Vectors...";
    this.btnRunAiMatchScan.disabled = true;

    setTimeout(() => {
      this.btnRunAiMatchScan.textContent = "Find Best Matches ⚡";
      this.btnRunAiMatchScan.disabled = false;

      const scored = PROFILES.map(profile => {
        let overlap = 0;
        profile.hobbies.forEach(h => {
          if (this.selectedAiHobbies.includes(h)) overlap++;
        });
        const matchScore = Math.min(80 + overlap * 5, 99);
        return { profile, overlap, matchScore };
      });

      scored.sort((a, b) => b.matchScore - a.matchScore);
      const topMatches = scored.slice(0, 3);

      this.aiMatchResults.innerHTML = `
        <h4 style="font-size:1.1rem; font-weight:800; color:var(--accent-lime); margin-bottom:0.75rem; text-transform:uppercase;">Top Compatible Creators:</h4>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          ${topMatches.map(m => `
            <div style="background:#18181B; border:2px solid #27272A; border-radius:1rem; padding:0.85rem; display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <img src="${m.profile.avatar}" style="width:2.75rem; height:2.75rem; border-radius:50%; object-fit:cover; border:2px solid var(--accent-lime);" alt="${m.profile.name}">
                <div>
                  <div style="font-size:1.05rem; font-weight:800; color:#FFF;">${m.profile.name}, ${m.profile.age}</div>
                  <div style="font-size:0.8rem; color:var(--muted-gray); font-weight:600;">${m.overlap} Shared Passions · ${m.profile.city}</div>
                </div>
              </div>
              <button class="pill-btn pill-lime pill-sm" onclick="window.crazyApp.quickMatchFromAi('${m.profile.id}')">
                Connect ⚡
              </button>
            </div>
          `).join('')}
        </div>
      `;
    }, 400);
  }

  quickMatchFromAi(profileId) {
    const profile = PROFILES.find(p => p.id === profileId);
    if (!profile) return;
    this.closeModals();
    this.triggerMatch(profile);
  }

  // --------------------------------------------------------------------------
  // FEED & COMMUNITY MOMENTS (INSTAGRAM / THREADS STYLE)
  // --------------------------------------------------------------------------
  renderStories() {
    if (!this.storiesTray) return;
    this.storiesTray.innerHTML = '';

    const myStory = document.createElement('div');
    myStory.className = 'story-avatar-item';
    myStory.innerHTML = `
      <div class="story-ring story-ring-unread" style="border-color:var(--canvas-pink);">
        <img src="${this.user.avatar}" class="story-avatar-img" alt="${this.user.name}">
      </div>
      <span class="story-username">Your Vibe</span>
    `;
    myStory.addEventListener('click', () => {
      this.playSound('pop');
      this.openUploadModal();
    });
    this.storiesTray.appendChild(myStory);

    PROFILES.forEach(profile => {
      if (!profile.storyActive) return;
      const item = document.createElement('div');
      item.className = 'story-avatar-item';
      item.innerHTML = `
        <div class="story-ring story-ring-unread">
          <img src="${profile.avatar}" class="story-avatar-img" alt="${profile.name}">
        </div>
        <span class="story-username">${profile.name.split(' ')[0]}</span>
      `;
      item.addEventListener('click', () => {
        this.playSound('pop');
        this.activeChatId = profile.id;
        this.showCardDetails();
      });
      this.storiesTray.appendChild(item);
    });
  }

  renderFeed() {
    if (!this.feedStream) return;
    this.feedStream.innerHTML = '';

    this.feedPosts.forEach(post => {
      const card = document.createElement('article');
      card.className = 'feed-moment-card';
      card.dataset.postId = post.id;

      card.innerHTML = `
        <div class="feed-author-header">
          <div class="feed-author-info">
            <img src="${post.authorAvatar}" class="feed-author-avatar" alt="${post.authorName}">
            <div>
              <div class="feed-author-name">
                <span>${post.authorName}</span>
                <span style="color:var(--accent-cyan); font-size:0.95rem;">✓</span>
              </div>
              <div class="feed-location-text">${post.location} · ${post.timeAgo}</div>
            </div>
          </div>
          <button class="chat-icon-action" style="font-size:1.1rem; border:none;" title="Options">•••</button>
        </div>

        <div class="feed-media-wrap">
          <img src="${post.mediaUrl}" class="feed-media-img ${this.settings.photoBlur ? 'photo-shield-blur' : ''}" alt="Post moment">
          <div class="heart-burst-icon">❤️</div>
        </div>

        <div class="feed-actions-bar">
          <button class="feed-action-btn btn-like-moment" title="Like">
            <span class="heart-symbol" style="color:${post.liked ? 'var(--canvas-pink)' : '#FFF'}; font-size:1.4rem;">${post.liked ? '❤️' : '🤍'}</span>
            <span class="feed-count-badge">${post.likesCount}</span>
          </button>
          <button class="feed-action-btn btn-comment-moment" title="Comment">
            <span style="font-size:1.3rem;">💬</span>
            <span class="feed-count-badge">${post.comments.length}</span>
          </button>
          <button class="feed-action-btn btn-share-moment" title="Send to Chat">
            <span style="font-size:1.3rem;">✈️</span>
          </button>
        </div>

        <div class="feed-caption-block">
          <p class="feed-caption-text">
            <strong>${post.authorName}</strong> ${post.caption}
          </p>
          <span style="color:var(--accent-lime); font-size:0.8rem; font-weight:800;">${post.interestTag}</span>
        </div>

        <div class="feed-comments-container">
          ${post.comments.slice(-2).map(c => `
            <div class="feed-comment-row">
              <strong>${c.author}</strong>: ${c.text}
            </div>
          `).join('')}
        </div>

        <div class="feed-add-comment-row">
          <input type="text" class="feed-comment-input" placeholder="Add a comment to this moment...">
          <button class="feed-comment-post-btn" type="button">Post</button>
        </div>
      `;

      // Tap on image to unblur or double tap to heart
      const mediaWrap = card.querySelector('.feed-media-wrap');
      const mediaImg = card.querySelector('.feed-media-img');
      const heartIcon = card.querySelector('.heart-burst-icon');

      mediaWrap.addEventListener('click', () => {
        if (mediaImg.classList.contains('photo-shield-blur')) {
          mediaImg.classList.remove('photo-shield-blur');
        }
      });

      mediaWrap.addEventListener('dblclick', () => {
        this.playSound('like');
        heartIcon.classList.add('burst');
        setTimeout(() => heartIcon.classList.remove('burst'), 700);

        if (!post.liked) {
          post.liked = true;
          post.likesCount++;
          this.saveState();
          this.renderFeed();
        }
      });

      const likeBtn = card.querySelector('.btn-like-moment');
      likeBtn.addEventListener('click', () => {
        this.playSound('like');
        post.liked = !post.liked;
        post.likesCount += post.liked ? 1 : -1;
        this.saveState();
        this.renderFeed();
      });

      const commentInput = card.querySelector('.feed-comment-input');
      const commentPostBtn = card.querySelector('.feed-comment-post-btn');

      const handleAddComment = () => {
        const val = commentInput.value.trim();
        if (!val) return;
        this.playSound('pop');
        post.comments.push({
          id: `c-${Date.now()}`,
          author: this.user.name.split(' ')[0],
          text: val,
          time: 'Just now'
        });
        commentInput.value = '';
        this.saveState();
        this.renderFeed();
      };

      commentPostBtn.addEventListener('click', handleAddComment);
      commentInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleAddComment();
      });

      this.feedStream.appendChild(card);
    });
  }

  openUploadModal() {
    this.uploadModal.classList.add('active');
  }

  submitNewMoment() {
    const caption = this.uploadCaption.value.trim() || "Sunday light across the studio gallery.";
    const interest = this.uploadInterest.value;

    const newPost = {
      id: `post-${Date.now()}`,
      authorId: "user-me",
      authorName: this.user.name,
      authorHandle: this.user.handle,
      authorAvatar: this.user.avatar,
      location: "Tokyo Studio",
      timeAgo: "Just now",
      mediaUrl: this.selectedPresetUploadUrl,
      caption: caption,
      interestTag: `#${interest.replace(/\s+/g, '')}`,
      likesCount: 1,
      liked: true,
      comments: []
    };

    this.feedPosts.unshift(newPost);
    this.saveState();
    this.uploadCaption.value = '';
    this.closeModals();
    this.renderFeed();
    this.playSound('superlike');
  }

  // --------------------------------------------------------------------------
  // CHATS & DIRECT MESSAGING ENGINE
  // --------------------------------------------------------------------------
  renderChatThreads() {
    const container = document.getElementById('theatricalThreads_page');
    if (!container) return;
    container.innerHTML = '';

    if (this.matches.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--muted-gray); font-size:0.95rem;">No active matches yet. Swipe on the Deck to trigger sparks!</div>`;
      return;
    }

    this.matches.forEach(match => {
      if (this.blockedUserIds && this.blockedUserIds.has(match.profileId)) return;
      const profile = PROFILES.find(p => p.id === match.profileId);
      if (!profile) return;

      const isActive = this.activeChatId === match.profileId;
      const threadEl = document.createElement('div');
      threadEl.className = `theatrical-thread-row ${isActive ? 'active' : ''}`;

      threadEl.innerHTML = `
        <div style="position:relative;">
          <img src="${profile.avatar}" class="theatrical-thread-avatar" alt="${profile.name}">
          ${match.unread ? '<span class="unread-dot-badge"></span>' : ''}
        </div>
        <div style="flex:1; overflow:hidden;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-weight:800; font-size:1.05rem; color:#FFF; display:flex; align-items:center; gap:0.25rem;">
              <span>${profile.name}</span>
              ${profile.photoVerified ? '<span style="color:var(--accent-cyan); font-size:0.85rem;">✓</span>' : ''}
            </div>
            <span style="font-size:0.75rem; color:var(--muted-gray); font-weight:600;">${match.lastTime}</span>
          </div>
          <div style="font-size:0.85rem; color:${match.unread ? '#FFF' : 'var(--muted-gray)'}; font-weight:${match.unread ? '700' : '500'}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:0.2rem;">
            ${match.lastMessage}
          </div>
          <div style="margin-top:0.35rem;">
            <span class="anti-ghost-badge" style="font-size:0.7rem; padding:0.15rem 0.5rem;">⏳ ${match.antiGhostTimer || '47h 58m'}</span>
          </div>
        </div>
      `;

      threadEl.addEventListener('click', () => {
        this.playSound('pop');
        this.activeChatId = match.profileId;
        match.unread = false;
        this.saveState();
        this.renderChatThreads();
        this.renderActiveMessages();
      });

      container.appendChild(threadEl);
    });
  }

  filterChatThreads(keyword) {
    document.querySelectorAll('.theatrical-thread-row').forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(keyword) ? 'flex' : 'none';
    });
  }

  renderActiveMessages() {
    const avatarEl = this.theatricalChatAvatar_page;
    const nameEl = this.theatricalChatName_page;
    const statusEl = this.theatricalChatStatus_page;
    const msgContainer = this.theatricalMessages_page;
    const icebreakerContainer = this.theatricalIcebreakers_page;
    const antiGhostBadge = document.getElementById('chatAntiGhostBadge');

    if (!this.activeChatId) {
      if (nameEl) nameEl.textContent = "Select Connection";
      if (msgContainer) msgContainer.innerHTML = `<div style="text-align:center; padding:3rem; color:rgba(255,255,255,0.5);">Select a creator to launch direct correspondence.</div>`;
      return;
    }

    const profile = PROFILES.find(p => p.id === this.activeChatId);
    if (!profile) return;

    if (avatarEl) avatarEl.src = profile.avatar;
    if (nameEl) nameEl.textContent = profile.name;
    if (statusEl) statusEl.textContent = `● ${profile.lastActive || 'Active now'}`;
    if (antiGhostBadge) antiGhostBadge.textContent = `⏳ ${profile.antiGhostExpiresIn || '47h 58m'}`;

    const messages = this.chats[profile.id] || [];

    if (msgContainer) {
      msgContainer.innerHTML = '';
      messages.forEach(msg => {
        const bubble = document.createElement('div');
        bubble.className = `theatrical-bubble ${msg.sender}`;
        bubble.style.position = 'relative';

        if (msg.type === 'voice') {
          bubble.innerHTML = `
            <div class="voice-memo-bubble">
              <button class="voice-play-btn" type="button">▶</button>
              <div class="voice-waveform">
                <span class="voice-wave-bar" style="height:12px;"></span>
                <span class="voice-wave-bar" style="height:20px;"></span>
                <span class="voice-wave-bar" style="height:8px;"></span>
                <span class="voice-wave-bar" style="height:16px;"></span>
                <span class="voice-wave-bar" style="height:22px;"></span>
                <span class="voice-wave-bar" style="height:14px;"></span>
                <span class="voice-wave-bar" style="height:18px;"></span>
              </div>
              <span style="font-size:0.75rem; font-weight:700;">0:14</span>
            </div>
            <div style="font-size:0.7rem; opacity:0.7; margin-top:0.35rem; text-align:right;">${msg.time} · Voice Memo</div>
          `;
          const playBtn = bubble.querySelector('.voice-play-btn');
          if (playBtn) {
            playBtn.addEventListener('click', () => {
              this.playSound('like');
              playBtn.textContent = playBtn.textContent === '▶' ? '⏸' : '▶';
            });
          }
        } else if (msg.type === 'image') {
          bubble.innerHTML = `
            <img src="${msg.mediaUrl}" class="${this.settings.photoBlur ? 'photo-shield-blur' : ''}" style="max-width:240px; border-radius:0.85rem; object-fit:cover; margin-bottom:0.35rem; cursor:pointer;" alt="Media">
            <div>${msg.text || ''}</div>
            <div style="font-size:0.7rem; opacity:0.7; margin-top:0.35rem; text-align:right;">${msg.time} · Seen ✓✓</div>
          `;
          const img = bubble.querySelector('img');
          if (img) {
            img.addEventListener('click', () => img.classList.remove('photo-shield-blur'));
          }
        } else {
          bubble.innerHTML = `
            <div>${msg.text}</div>
            <div style="font-size:0.7rem; opacity:0.7; margin-top:0.35rem; text-align:right;">${msg.time} ${msg.sender === 'me' && this.settings.readReceipts ? '· Seen ✓✓' : ''}</div>
          `;
        }

        // Reactions rendering
        if (msg.reactions && msg.reactions.length > 0) {
          const rxPill = document.createElement('div');
          rxPill.className = 'msg-reaction-pill';
          rxPill.textContent = msg.reactions.join(' ');
          bubble.appendChild(rxPill);
        }

        // Double-click message to react
        bubble.addEventListener('dblclick', () => {
          this.playSound('like');
          if (!msg.reactions) msg.reactions = [];
          if (!msg.reactions.includes('❤️')) {
            msg.reactions.push('❤️');
          } else {
            msg.reactions = msg.reactions.filter(r => r !== '❤️');
          }
          this.saveState();
          this.renderActiveMessages();
        });

        msgContainer.appendChild(bubble);
      });
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    // Icebreaker Prompts
    if (icebreakerContainer) {
      icebreakerContainer.innerHTML = '';
      ICEBREAKER_PROMPTS.forEach(prompt => {
        const chip = document.createElement('button');
        chip.className = 'pill-btn pill-sm pill-white';
        chip.style.fontSize = '0.85rem';
        chip.style.padding = '0.45rem 1rem';
        chip.textContent = prompt;
        chip.addEventListener('click', () => {
          this.playSound('pop');
          this.sendChatMessage(prompt);
        });
        icebreakerContainer.appendChild(chip);
      });
    }
  }

  sendChatMessage(text) {
    if (!text || !text.trim() || !this.activeChatId) return;
    const clean = text.trim();

    this.playSound('pop');

    if (!this.chats[this.activeChatId]) {
      this.chats[this.activeChatId] = [];
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "me",
      type: "text",
      text: clean,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
      status: "sent"
    };

    this.chats[this.activeChatId].push(newMsg);

    const match = this.matches.find(m => m.profileId === this.activeChatId);
    if (match) {
      match.lastMessage = `You: ${clean}`;
      match.lastTime = "Just now";
      match.unread = false;
    }

    this.saveState();
    this.renderChatThreads();
    this.renderActiveMessages();

    // Automated Bot Reply Simulation with Active Typing
    setTimeout(() => {
      this.simulatePartnerReply(this.activeChatId);
    }, 1100);
  }

  simulatePartnerReply(profileId) {
    const profile = PROFILES.find(p => p.id === profileId);
    if (!profile) return;

    if (this.theatricalChatStatus_page && this.activeChatId === profileId) {
      this.theatricalChatStatus_page.textContent = `● typing...`;
      this.theatricalChatStatus_page.style.color = "var(--accent-yellow)";
    }

    setTimeout(() => {
      const possibleReplies = BOT_RESPONSES[profileId] || [
        "That resonates with me completely! What are you exploring this weekend?",
        "I love your clarity. What else is inspiring your creative routine right now?",
        "Let's coordinate a visit to that gallery or specialty coffee spot soon!"
      ];

      const replyText = possibleReplies[Math.floor(Math.random() * possibleReplies.length)];

      if (!this.chats[profileId]) this.chats[profileId] = [];

      this.chats[profileId].push({
        id: `msg-${Date.now()}`,
        sender: "them",
        type: "text",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: ["⚡"],
        status: "seen"
      });

      const match = this.matches.find(m => m.profileId === profileId);
      if (match) {
        match.lastMessage = replyText;
        match.lastTime = "Just now";
        if (this.activeChatId !== profileId) match.unread = true;
      }

      this.saveState();
      this.playSound('like');

      if (this.theatricalChatStatus_page && this.activeChatId === profileId) {
        this.theatricalChatStatus_page.textContent = `● Active now`;
        this.theatricalChatStatus_page.style.color = "var(--accent-lime)";
      }

      this.renderChatThreads();
      if (this.activeChatId === profileId) {
        this.renderActiveMessages();
      }
    }, 1500);
  }

  sendVoiceNoteMessage() {
    if (!this.activeChatId) return;
    this.playSound('like');

    if (!this.chats[this.activeChatId]) this.chats[this.activeChatId] = [];

    this.chats[this.activeChatId].push({
      id: `msg-${Date.now()}`,
      sender: "me",
      type: "voice",
      duration: "0:14",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: ["🔥"],
      status: "sent"
    });

    const match = this.matches.find(m => m.profileId === this.activeChatId);
    if (match) {
      match.lastMessage = "You sent a voice memo 🎙️";
      match.lastTime = "Just now";
    }

    this.saveState();
    this.renderChatThreads();
    this.renderActiveMessages();

    setTimeout(() => this.simulatePartnerReply(this.activeChatId), 1200);
  }

  sendImageMessage(base64Data) {
    if (!this.activeChatId) return;
    this.playSound('like');

    if (!this.chats[this.activeChatId]) this.chats[this.activeChatId] = [];

    this.chats[this.activeChatId].push({
      id: `msg-${Date.now()}`,
      sender: "me",
      type: "image",
      mediaUrl: base64Data,
      text: "Sent an aesthetic studio capture",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: ["❤️"],
      status: "sent"
    });

    const match = this.matches.find(m => m.profileId === this.activeChatId);
    if (match) {
      match.lastMessage = "You shared a photo 📷";
      match.lastTime = "Just now";
    }

    this.saveState();
    this.renderChatThreads();
    this.renderActiveMessages();

    setTimeout(() => this.simulatePartnerReply(this.activeChatId), 1200);
  }

  // --------------------------------------------------------------------------
  // SETTINGS VIEW
  // --------------------------------------------------------------------------
  renderSettings() {
    if (this.settingsUserName) this.settingsUserName.textContent = this.user.name;
    if (this.settingsUserEmail) this.settingsUserEmail.textContent = this.user.email;
    if (this.settingsUserAvatar) this.settingsUserAvatar.src = this.user.avatar;
    if (this.settingsBioInput) this.settingsBioInput.value = this.user.bio;

    if (this.sliderDistance) this.sliderDistance.value = this.settings.maxDistance;
    if (this.labelDistance) this.labelDistance.textContent = `${this.settings.maxDistance} km`;

    if (this.sliderAge) this.sliderAge.value = this.settings.maxAge;
    if (this.labelAgeRange) this.labelAgeRange.textContent = `18 – ${this.settings.maxAge}`;

    if (this.selectAiSensitivity) this.selectAiSensitivity.value = this.settings.aiSensitivity;
    if (this.toggleSoundFx) this.toggleSoundFx.checked = this.settings.soundFx;
    if (this.toggleStealth) this.toggleStealth.checked = this.settings.stealthMode;
    if (this.toggleReadReceipts) this.toggleReadReceipts.checked = this.settings.readReceipts;
    if (this.togglePhotoBlur) this.togglePhotoBlur.checked = this.settings.photoBlur;
  }

  // --------------------------------------------------------------------------
  // PROFILE INSPECTOR MODAL WITH PROMPTS, VALUES & LINKED SOCIALS
  // --------------------------------------------------------------------------
  showCardDetails() {
    const deck = this.getActiveDeck();
    if (deck.length === 0 && !this.activeChatId) return;
    const profile = deck[0] || PROFILES.find(p => p.id === this.activeChatId);
    if (!profile) return;

    this.infoModalBody.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.25rem; text-align:left;">
        <div style="position:relative;">
          <img src="${profile.photos[0]}" style="width:100%; height:320px; object-fit:cover; border-radius:1.5rem; border:3px solid #27272A;" alt="${profile.name}">
          <div style="position:absolute; bottom:1rem; left:1rem; display:flex; gap:0.5rem;">
            ${profile.photoVerified ? '<span class="badge-solid badge-cyan">✓ PHOTO VERIFIED</span>' : ''}
            <span class="badge-solid badge-lime">⚡ ${profile.compatibility}% MATCH</span>
          </div>
        </div>

        <div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h2 style="font-size:2.5rem; font-weight:800; line-height:1; letter-spacing:-0.02em; color:#FFF;">${profile.name}, ${profile.age}</h2>
            <span class="anti-ghost-badge">⏳ 48h Spark Window</span>
          </div>
          <div style="color:var(--canvas-pink); font-size:1.1rem; font-weight:800; margin-top:0.4rem;">${profile.occupation} · ${profile.city}</div>
        </div>

        <div class="auth-info-card">
          <strong style="display:block; text-transform:uppercase; font-size:0.85rem; letter-spacing:0.04em; color:var(--canvas-pink); margin-bottom:0.35rem;">Story &amp; Vibe</strong>
          <p style="font-size:1.1rem; font-weight:600; line-height:1.5; color:#E4E4E7;">${profile.bio}</p>
        </div>

        <!-- Video Vibe Check Feature -->
        ${profile.videoCheck ? `
          <div style="background:#18181B; border:2px solid var(--accent-yellow); border-radius:1.25rem; padding:1.25rem; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:var(--accent-yellow); font-size:1rem; display:block;">📹 Ambient Video Vibe Check</strong>
              <span style="font-size:0.85rem; color:#D4D4D8;">"${profile.videoCheck.title}" (${profile.videoCheck.duration})</span>
            </div>
            <button class="pill-btn pill-yellow pill-xs" onclick="window.crazyApp.openVideoCallModal()">
              Play Video Reel ▶
            </button>
          </div>
        ` : ''}

        <!-- Linked Social Badges -->
        <div>
          <strong style="display:block; text-transform:uppercase; font-size:0.85rem; letter-spacing:0.04em; margin-bottom:0.5rem; color:#FFF;">Verified Connected Socials</strong>
          <div class="social-links-row">
            ${profile.socials && profile.socials.spotify ? `
              <span class="social-badge spotify">
                <span>♫ Spotify Anthem:</span>
                <strong>${profile.socials.spotify}</strong>
                <span class="soundwave-bars">
                  <span class="soundwave-bar"></span>
                  <span class="soundwave-bar"></span>
                  <span class="soundwave-bar"></span>
                </span>
              </span>
            ` : ''}
            ${profile.socials && profile.socials.instagram ? `
              <span class="social-badge instagram">
                <span>📸 Instagram:</span>
                <strong>${profile.socials.instagram}</strong>
              </span>
            ` : ''}
            ${profile.socials && profile.socials.twitter ? `
              <span class="social-badge">
                <span>𝕏 Twitter:</span>
                <strong>${profile.socials.twitter}</strong>
              </span>
            ` : ''}
            ${profile.socials && profile.socials.github ? `
              <span class="social-badge">
                <span>🐙 GitHub:</span>
                <strong>${profile.socials.github}</strong>
              </span>
            ` : ''}
          </div>
        </div>

        <div>
          <strong style="display:block; text-transform:uppercase; font-size:0.85rem; letter-spacing:0.04em; margin-bottom:0.5rem; color:#FFF;">Hobbies &amp; Creative Passions</strong>
          <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
            ${profile.hobbies.map(t => `<span class="cc-hobby-pill" style="font-size:0.85rem; padding:0.35rem 0.85rem;">${t}</span>`).join('')}
          </div>
        </div>

        ${profile.values ? `
          <div>
            <strong style="display:block; text-transform:uppercase; font-size:0.85rem; letter-spacing:0.04em; margin-bottom:0.5rem; color:var(--accent-lime);">Shared Values &amp; Ambition</strong>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
              ${profile.values.map(v => `<span class="badge-solid badge-lime" style="font-size:0.8rem;">✦ ${v}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <div style="margin-top:0.5rem;">
          <strong style="display:block; text-transform:uppercase; font-size:0.85rem; letter-spacing:0.04em; margin-bottom:0.5rem; color:#FFF;">Story Prompts</strong>
          ${profile.prompts.map(pr => `
            <div style="background:#202024; border:2px solid #27272A; border-radius:1rem; padding:1rem; margin-bottom:0.5rem;">
              <div style="font-size:0.8rem; color:var(--accent-lime); font-weight:800;">${pr.question}</div>
              <div style="font-size:1rem; font-weight:600; color:#FFF; margin-top:0.25rem;">${pr.answer}</div>
            </div>
          `).join('')}
        </div>

        <div style="display:flex; gap:0.75rem; margin-top:1rem;">
          <button class="pill-btn pill-lime" style="flex:1;" onclick="window.crazyApp.quickMatchFromAi('${profile.id}')">
            Connect &amp; Message ⚡
          </button>
          <button class="pill-btn pill-white pill-sm" onclick="window.crazyApp.openSafetyModal()">
            🛡️ Report
          </button>
        </div>
      </div>
    `;

    this.infoModal.classList.add('active');
  }

  closeModals() {
    document.querySelectorAll('.cc-modal-backdrop').forEach(m => m.classList.remove('active'));
    if (this.videoCallModal) this.videoCallModal.style.display = 'none';
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.crazyApp = new CrazyCreativeApp();
});
