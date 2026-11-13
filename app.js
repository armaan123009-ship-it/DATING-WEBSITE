// ============================================================================
// CRAZY LOVE / PAWANDATE - CORE APPLICATION CONTROLLER
// High-Impact Poster Transitions, AI Hobby Matching, Instagram-Style Direct Chat,
// Community Moments Media Feed, and Authentication Gate
// ============================================================================

import { PROFILES, CATEGORIES } from './data/profiles.js';
import { INITIAL_MATCHES, INITIAL_MESSAGES, ICEBREAKER_PROMPTS, BOT_RESPONSES } from './data/chats.js';
import { INITIAL_FEED_POSTS } from './data/feed.js';
import { LiquidNavbar, NimbusIcons } from './components/ui/liquid-glass-navbar.js';

class CrazyCreativeApp {
  constructor() {
    this.storageKey = 'cc_dating_state_v2';
    this.initState();
    this.initDOM();
    this.initLiquidNavbar();
    this.bindEvents();
    this.updateHeaderAuthState();
    this.renderCurrentView();
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
        this.matches = parsed.matches || INITIAL_MATCHES;
        this.chats = parsed.chats || INITIAL_MESSAGES;
        this.feedPosts = parsed.feedPosts || INITIAL_FEED_POSTS;
        this.swiped = parsed.swiped || {};
        this.activeCategory = parsed.activeCategory || 'all';
        this.selectedAiHobbies = parsed.selectedAiHobbies || ["35mm Film", "Brutalist Architecture", "Specialty Coffee"];
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
  }

  resetDefaultState() {
    this.isAuthenticated = true; // Logged in with rich demo state
    this.user = this.getDefaultUser();
    this.matches = [...INITIAL_MATCHES];
    this.chats = JSON.parse(JSON.stringify(INITIAL_MESSAGES));
    this.feedPosts = JSON.parse(JSON.stringify(INITIAL_FEED_POSTS));
    this.swiped = {};
    this.activeCategory = 'all';
    this.selectedAiHobbies = ["35mm Film", "Brutalist Architecture", "Specialty Coffee"];
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
      bio: "Architectural photography, collecting Japanese city-pop vinyl, and designing digital platforms with electric character.",
      hobbies: ["35mm Film", "Product Design", "Specialty Coffee", "Synthesizers", "Tokyo Architecture"]
    };
  }

  saveState() {
    const data = {
      isAuthenticated: this.isAuthenticated,
      user: this.user,
      matches: this.matches,
      chats: this.chats,
      feedPosts: this.feedPosts,
      swiped: this.swiped,
      activeCategory: this.activeCategory,
      selectedAiHobbies: this.selectedAiHobbies
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // --------------------------------------------------------------------------
  // LIQUID GLASS NAVBAR INTEGRATION (NO WATERMARKS)
  // --------------------------------------------------------------------------
  initLiquidNavbar() {
    const mountContainer = document.getElementById('liquidNavbarMount');
    if (!mountContainer) return;
    mountContainer.innerHTML = ''; // Clean slate

    this.liquidNav = new LiquidNavbar({
      target: mountContainer,
      tone: "light",
      defaultActive: 0,
      sound: false,
      items: [
        { label: "Home", icon: NimbusIcons.home, fx: "glow", route: "home" },
        { label: "Deck", icon: NimbusIcons.plane, fx: "plane", route: "discover" },
        { label: "Feed", icon: NimbusIcons.camera, fx: "spin", route: "feed" },
        { label: "Chats", icon: NimbusIcons.drop, fx: "drop", route: "chats" },
        { label: "Profile", icon: NimbusIcons.user, fx: "wave", route: "profile" }
      ],
      onChange: (index, item) => {
        this.handleGateRoute(item.route);
      }
    });
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATION GATEWAY
  // --------------------------------------------------------------------------
  handleGateRoute(route) {
    if (route === 'home') {
      this.navigateTo('home');
      return;
    }

    // Require login for dashboard features
    if (!this.isAuthenticated) {
      this.pendingGateRoute = route;
      this.openAuthModal();
      return;
    }

    this.navigateTo(route);
  }

  updateHeaderAuthState() {
    const slot = document.getElementById('headerUserSlot');
    if (!slot) return;

    if (this.isAuthenticated) {
      slot.innerHTML = `
        <div class="header-user-badge liquid-glass-btn" id="headerProfileTrigger" title="View Profile">
          <img src="${this.user.avatar}" class="user-avatar-sm" alt="${this.user.name}">
          <span style="color:#FFF;">${this.user.name.split(' ')[0]}</span>
          <span style="color:var(--accent-lime); font-size:0.8rem;">★</span>
          <button class="btn-header-logout" id="btnQuickLogout" title="Sign Out" type="button">✕</button>
        </div>
      `;

      const trigger = document.getElementById('headerProfileTrigger');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          if (e.target.closest('#btnQuickLogout')) return;
          this.navigateTo('profile');
        });
      }

      const logoutBtn = document.getElementById('btnQuickLogout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.logoutUser();
        });
      }
    } else {
      slot.innerHTML = `
        <button class="pill-btn pill-white pill-sm liquid-glass-btn" id="btnHeaderActionLogin" type="button">
          <span>Log In</span>
          <span style="font-size:1.1rem; line-height:1;">→</span>
        </button>
      `;
      const btn = document.getElementById('btnHeaderActionLogin');
      if (btn) btn.addEventListener('click', () => this.openAuthModal());
    }
  }

  loginUser(name = "Armaan Yadav", email = "armaan123009@gmail.com") {
    this.isAuthenticated = true;
    this.user.name = name;
    this.user.email = email;
    this.saveState();
    this.updateHeaderAuthState();
    this.closeModals();

    const targetRoute = this.pendingGateRoute || 'discover';
    this.pendingGateRoute = null;
    this.navigateTo(targetRoute);
  }

  logoutUser() {
    this.isAuthenticated = false;
    this.saveState();
    this.updateHeaderAuthState();
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
      profile: document.getElementById('viewProfile')
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

    // Profile Screen Buttons
    this.btnLogoutProfile = document.getElementById('btnLogoutProfile');
    this.btnProfileEdit = document.getElementById('btnProfileEdit');
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

    if (this.btnHeroLaunch) this.btnHeroLaunch.addEventListener('click', () => this.handleGateRoute('discover'));
    if (this.btnHeroSignIn) this.btnHeroSignIn.addEventListener('click', () => this.openAuthModal());
    if (this.btnFlameLaunch) this.btnFlameLaunch.addEventListener('click', () => this.handleGateRoute('discover'));

    // Deck Gestures and Buttons
    if (this.btnPass) this.btnPass.addEventListener('click', () => this.swipeTopCard('pass'));
    if (this.btnLike) this.btnLike.addEventListener('click', () => this.swipeTopCard('like'));
    if (this.btnRewind) this.btnRewind.addEventListener('click', () => this.rewindLastCard());
    if (this.btnInfo) this.btnInfo.addEventListener('click', () => this.showCardDetails());
    if (this.btnOpenAiMatch) this.btnOpenAiMatch.addEventListener('click', () => this.openAiMatchModal());

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (this.currentView === 'discover') {
        if (e.key === 'ArrowLeft') this.swipeTopCard('pass');
        if (e.key === 'ArrowRight') this.swipeTopCard('like');
        if (e.key === 'ArrowDown') this.rewindLastCard();
        if (e.key === ' ') {
          e.preventDefault();
          this.showCardDetails();
        }
      }
    });

    // Chat Sending
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
    document.querySelectorAll('.quick-emoji-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const emoji = chip.dataset.emoji;
        this.sendChatMessage(emoji);
      });
    });

    // Call Simulation
    const audioCallBtn = document.getElementById('btnSimulateAudioCall');
    if (audioCallBtn) {
      audioCallBtn.addEventListener('click', () => {
        const partner = PROFILES.find(p => p.id === this.activeChatId);
        alert(`📞 Connecting studio encrypted audio line with ${partner ? partner.name : 'match'}... (Microphone active)`);
      });
    }
    const videoCallBtn = document.getElementById('btnSimulateVideoCall');
    if (videoCallBtn) {
      videoCallBtn.addEventListener('click', () => {
        const partner = PROFILES.find(p => p.id === this.activeChatId);
        alert(`📹 Starting HD video call with ${partner ? partner.name : 'match'}... (Camera preview active)`);
      });
    }

    // Chat Voice Memo
    if (this.btnSendVoiceNote) {
      this.btnSendVoiceNote.addEventListener('click', () => {
        this.sendVoiceNoteMessage();
      });
    }

    // Chat Photo Upload
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

    // Feed / Moments Upload
    if (this.btnOpenUploadModal) {
      this.btnOpenUploadModal.addEventListener('click', () => {
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
      this.btnMatchClose.addEventListener('click', () => this.closeModals());
    }

    // Modal Close
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => this.closeModals());
    });

    // FAQ Accordion Click Handlers
    document.querySelectorAll('.faq-item-row').forEach(row => {
      row.addEventListener('click', () => {
        row.classList.toggle('open');
      });
    });

    // Profile Page Logout
    if (this.btnLogoutProfile) {
      this.btnLogoutProfile.addEventListener('click', () => this.logoutUser());
    }
    if (this.btnProfileEdit) {
      this.btnProfileEdit.addEventListener('click', () => {
        const newBio = prompt("Update your studio bio:", this.user.bio);
        if (newBio) {
          this.user.bio = newBio;
          this.saveState();
          this.renderProfileView();
        }
      });
    }

    // AI Matchmaker Scan button
    if (this.btnRunAiMatchScan) {
      this.btnRunAiMatchScan.addEventListener('click', () => {
        this.executeAiChemistryScan();
      });
    }
  }

  // --------------------------------------------------------------------------
  // ROUTING & VIEW CONTROLLER
  // --------------------------------------------------------------------------
  navigateTo(viewName) {
    this.currentView = viewName;
    document.body.classList.toggle('in-dashboard', viewName !== 'home');

    // Sync Liquid Navbar state & dynamic tone
    if (this.liquidNav) {
      const routeToIndex = { home: 0, discover: 1, feed: 2, chats: 3, profile: 4 };
      const idx = routeToIndex[viewName] !== undefined ? routeToIndex[viewName] : 0;
      this.liquidNav.setActive(idx);

      if (viewName === 'home') {
        this.liquidNav.setTone('light');
      } else {
        this.liquidNav.setTone('dark');
      }
    }

    Object.keys(this.views).forEach(key => {
      if (this.views[key]) {
        this.views[key].classList.toggle('active', key === viewName);
      }
    });

    this.navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.route === viewName);
    });

    if (viewName === 'discover') {
      this.renderCategoryFilterBar();
      this.renderDeck();
    } else if (viewName === 'feed') {
      this.renderFeedView();
    } else if (viewName === 'chats') {
      this.renderTheatricalChat();
    } else if (viewName === 'profile') {
      this.renderProfileView();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderCurrentView() {
    this.navigateTo(this.currentView);
  }

  // --------------------------------------------------------------------------
  // DISCOVERY CARD STACK & HOBBY FILTERING
  // --------------------------------------------------------------------------
  renderCategoryFilterBar() {
    if (!this.interestFilterBar) return;
    this.interestFilterBar.innerHTML = '';

    CATEGORIES.forEach(cat => {
      const chip = document.createElement('button');
      chip.className = `interest-chip ${this.activeCategory === cat.id ? 'active' : ''}`;
      chip.innerHTML = `<span>${cat.icon}</span> <span>${cat.label}</span>`;
      chip.addEventListener('click', () => {
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
      if (this.swiped[p.id]) return false;
      if (this.activeCategory === 'all') return true;
      return p.category === this.activeCategory;
    });
  }

  renderDeck() {
    const deck = this.getActiveDeck();
    this.ccSwipeStage.innerHTML = '';

    if (deck.length === 0) {
      this.ccSwipeStage.innerHTML = `
        <div class="liquid-glass-modal" style="border-radius:var(--radius-card); padding:3.5rem 2rem; text-align:center; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5rem;">
          <div style="width:4.5rem; height:4.5rem; border-radius:50%; background:var(--accent-lime); display:flex; align-items:center; justify-content:center; font-size:2rem; font-weight:900; box-shadow:0 4px 16px rgba(212,255,0,0.4);">★</div>
          <h3 style="font-size:2.5rem; font-weight:800; text-transform:uppercase; line-height:1; color:var(--ink-dark);">Queue Complete!</h3>
          <p style="color:var(--muted-gray); font-size:1.15rem; max-width:320px; font-weight:600;">You've explored the current creators in this vibe. Reset your queue or try another category.</p>
          <button class="pill-btn pill-pink liquid-glass-btn" id="btnResetCrazyDeck">↺ Reset Queue</button>
        </div>
      `;
      const resetBtn = document.getElementById('btnResetCrazyDeck');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
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

    const card = document.createElement('div');
    card.className = `cc-swipe-card ${isSecond ? 'depth-2' : ''} ${isThird ? 'depth-3' : ''}`;
    card.dataset.profileId = profile.id;

    card.innerHTML = `
      <div class="cc-card-art">
        <img src="${profile.photos[0]}" alt="${profile.name}">
        <div class="cc-card-tag">${profile.categoryLabel}</div>
        <div class="cc-card-score">⚡ ${profile.compatibility}% MATCH</div>

        <!-- Dynamic Action Stamps -->
        <div class="cc-stamp cc-stamp-like">MATCH!</div>
        <div class="cc-stamp cc-stamp-pass">PASS</div>
      </div>

      <div class="cc-card-body">
        <div>
          <div class="cc-card-title-row">
            <div>
              <span class="cc-name-heading">${profile.name}, ${profile.age}</span>
              <span style="color:var(--accent-cyan); font-size:1rem; margin-left:0.25rem;">✓</span>
            </div>
            <span style="font-size:0.875rem; font-weight:800; color:var(--canvas-pink);">${profile.distance}</span>
          </div>
          <div style="font-size:0.95rem; font-weight:700; color:var(--muted-gray); margin-top:0.25rem;">
            ${profile.occupation} · ${profile.city}
          </div>
          <p style="font-size:1.05rem; line-height:1.45; font-weight:600; margin-top:0.75rem; color:var(--ink-secondary); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
            ${profile.bio}
          </p>
        </div>

        <div>
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.75rem;">
            ${profile.hobbies.slice(0, 3).map(h => `<span class="liquid-glass-badge" style="position:static; display:inline-block; font-size:0.78rem; padding:0.25rem 0.65rem; border-radius:9999px;">${h}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    return card;
  }

  attachDragGestures(cardEl) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    const stampLike = cardEl.querySelector('.cc-stamp-like');
    const stampPass = cardEl.querySelector('.cc-stamp-pass');

    const onStart = (e) => {
      isDragging = true;
      const point = e.touches ? e.touches[0] : e;
      startX = point.clientX;
      startY = point.clientY;
      cardEl.style.transition = 'none';
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const point = e.touches ? e.touches[0] : e;
      currentX = point.clientX - startX;
      currentY = point.clientY - startY;

      const rotate = currentX * 0.08;
      cardEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rotate}deg)`;

      if (currentX > 30) {
        stampLike.style.opacity = Math.min((currentX - 30) / 90, 1);
        stampPass.style.opacity = 0;
      } else if (currentX < -30) {
        stampPass.style.opacity = Math.min((Math.abs(currentX) - 30) / 90, 1);
        stampLike.style.opacity = 0;
      } else {
        stampLike.style.opacity = 0;
        stampPass.style.opacity = 0;
      }
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      cardEl.style.transition = 'transform 0.25s var(--smooth-ease), opacity 0.2s ease';

      const threshold = 110;
      if (currentX > threshold) {
        this.executeSwipe(cardEl, 'like');
      } else if (currentX < -threshold) {
        this.executeSwipe(cardEl, 'pass');
      } else {
        cardEl.style.transform = '';
        stampLike.style.opacity = 0;
        stampPass.style.opacity = 0;
      }
    };

    cardEl.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    cardEl.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
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
        lastTime: "Just now"
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
  // AI HOBBY MATCHMAKER SCANNER
  // --------------------------------------------------------------------------
  openAiMatchModal() {
    this.aiHobbiesPicker.innerHTML = '';
    const allHobbies = [
      "Analog Photography", "35mm Film", "Brutalist Architecture", "Record Collecting",
      "Specialty Coffee", "Modular Synthesizers", "Clay Sculpting", "Sourdough Baking",
      "Natural Wines", "French Cinema", "Bouldering", "Independent Zines", "Botanical Gardening",
      "Vintage Fashion Archiving", "Tokyo Architecture", "Techno"
    ];

    allHobbies.forEach(hobby => {
      const chip = document.createElement('div');
      const isSelected = this.selectedAiHobbies.includes(hobby);
      chip.className = `ai-hobby-chip ${isSelected ? 'selected' : ''}`;
      chip.textContent = hobby;
      chip.addEventListener('click', () => {
        if (this.selectedAiHobbies.includes(hobby)) {
          this.selectedAiHobbies = this.selectedAiHobbies.filter(h => h !== hobby);
        } else {
          this.selectedAiHobbies.push(hobby);
        }
        chip.classList.toggle('selected');
        this.saveState();
      });
      this.aiHobbiesPicker.appendChild(chip);
    });

    this.aiMatchResults.innerHTML = '';
    this.aiMatchModal.classList.add('active');
  }

  executeAiChemistryScan() {
    if (this.selectedAiHobbies.length === 0) {
      alert("Please select at least one hobby or creative passion!");
      return;
    }

    // Score all profiles against user chosen hobbies
    const scored = PROFILES.map(p => {
      const shared = p.hobbies.filter(h => this.selectedAiHobbies.includes(h));
      const matchScore = Math.min(Math.round(75 + (shared.length * 8)), 99);
      return { profile: p, shared, score: matchScore };
    });

    scored.sort((a, b) => b.score - a.score);
    const topThree = scored.slice(0, 3);

    this.aiMatchResults.innerHTML = `
      <div style="font-size:0.85rem; font-weight:800; color:var(--accent-lime); text-transform:uppercase; margin-bottom:0.75rem;">
        ⚡ AI Identified ${topThree.length} Compatible Matches:
      </div>
      ${topThree.map(item => `
        <div class="ai-result-card">
          <img src="${item.profile.avatar}" style="width:3.5rem; height:3.5rem; border-radius:50%; object-fit:cover; border:2px solid var(--accent-lime);" alt="${item.profile.name}">
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:baseline;">
              <strong style="font-size:1.1rem; color:#FFF;">${item.profile.name}, ${item.profile.age}</strong>
              <span style="color:var(--accent-lime); font-weight:900; font-size:0.95rem;">⚡ ${item.score}%</span>
            </div>
            <div style="font-size:0.8rem; color:var(--canvas-pink); font-weight:700;">${item.profile.occupation}</div>
            <div style="font-size:0.75rem; color:rgba(255,255,255,0.7); margin-top:0.25rem;">
              Shared passions: ${item.shared.length > 0 ? item.shared.join(', ') : item.profile.hobbies.slice(0, 2).join(', ')}
            </div>
          </div>
          <button class="pill-btn pill-sm pill-pink liquid-glass-btn" onclick="window.crazyApp.startChatWith('${item.profile.id}')" type="button">
            Chat →
          </button>
        </div>
      `).join('')}
    `;
  }

  startChatWith(profileId) {
    this.closeModals();
    const profile = PROFILES.find(p => p.id === profileId);
    if (profile) this.triggerMatch(profile);
    this.navigateTo('chats');
  }

  // --------------------------------------------------------------------------
  // COMMUNITY MOMENTS & MEDIA FEED (INSTAGRAM STYLE)
  // --------------------------------------------------------------------------
  renderFeedView() {
    this.renderStoriesTray();
    this.renderFeedStream();
  }

  renderStoriesTray() {
    if (!this.storiesTray) return;
    this.storiesTray.innerHTML = '';

    // Render my story bubble + creator stories
    const myStoryEl = document.createElement('div');
    myStoryEl.className = 'story-bubble';
    myStoryEl.innerHTML = `
      <div class="story-ring-wrap" style="background:rgba(255,255,255,0.2);">
        <img src="${this.user.avatar}" class="story-avatar-img" alt="My Story">
      </div>
      <span class="story-name-label">Your Story +</span>
    `;
    myStoryEl.addEventListener('click', () => this.openUploadModal());
    this.storiesTray.appendChild(myStoryEl);

    PROFILES.forEach(profile => {
      const bubble = document.createElement('div');
      bubble.className = 'story-bubble';
      bubble.innerHTML = `
        <div class="story-ring-wrap">
          <img src="${profile.avatar}" class="story-avatar-img" alt="${profile.name}">
        </div>
        <span class="story-name-label">${profile.name.split(' ')[0]}</span>
      `;
      bubble.addEventListener('click', () => {
        this.startChatWith(profile.id);
      });
      this.storiesTray.appendChild(bubble);
    });
  }

  renderFeedStream() {
    if (!this.feedStream) return;
    this.feedStream.innerHTML = '';

    this.feedPosts.forEach(post => {
      const card = document.createElement('article');
      card.className = 'feed-card liquid-glass-panel';
      card.dataset.postId = post.id;

      card.innerHTML = `
        <div class="feed-card-header">
          <div class="feed-author-meta">
            <img src="${post.authorAvatar}" class="feed-author-avatar" alt="${post.authorName}">
            <div>
              <div class="feed-author-name">${post.authorName}</div>
              <div class="feed-location-text">${post.location}</div>
            </div>
          </div>
          <button class="pill-btn pill-sm pill-white liquid-glass-btn" style="padding:0.35rem 0.85rem; font-size:0.8rem;" onclick="window.crazyApp.startChatWith('${post.authorId}')" type="button">
            Direct Message ⚡
          </button>
        </div>

        <div class="feed-media-wrap">
          <img src="${post.mediaUrl}" class="feed-media-img" alt="Moment Photo">
          <div class="heart-burst-icon">❤️</div>
        </div>

        <div class="feed-actions-bar">
          <div class="feed-actions-left">
            <button class="feed-action-btn btn-feed-like ${post.isLiked ? 'liked' : ''}" title="Like Moment" type="button">
              <span>${post.isLiked ? '❤️' : '🤍'}</span>
              <span class="feed-likes-count">${post.likesCount}</span>
            </button>
            <button class="feed-action-btn btn-feed-toggle-comments" title="Comments" type="button">
              <span>💬</span>
              <span style="font-size:0.95rem; font-weight:800; color:#FFF;">${post.comments.length}</span>
            </button>
          </div>
          <span style="font-size:0.8rem; font-weight:700; color:var(--accent-lime);">${post.interest}</span>
        </div>

        <div class="feed-caption-block">
          <div>
            <span class="feed-caption-author">${post.authorName}</span>
            <span>${post.caption}</span>
          </div>
          <div class="feed-tags-row">
            ${post.tags.map(t => `<span class="feed-tag-pill">${t}</span>`).join('')}
          </div>
          <div class="feed-timestamp">${post.timestamp}</div>
        </div>

        <div class="feed-comments-section" style="display:${post.comments.length > 0 ? 'block' : 'none'};">
          <div class="feed-comments-list">
            ${post.comments.map(c => `
              <div class="feed-comment-item">
                <img src="${c.authorAvatar}" class="feed-comment-avatar" alt="${c.authorName}">
                <div class="feed-comment-body">
                  <span class="feed-comment-user">${c.authorName}</span>
                  <span>${c.text}</span>
                  <div style="font-size:0.7rem; color:var(--muted-gray); margin-top:0.2rem;">${c.time}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="feed-comment-input-bar">
            <input type="text" class="feed-comment-input liquid-glass-input" placeholder="Add a comment for ${post.authorName}...">
            <button class="pill-btn pill-sm pill-pink liquid-glass-btn btn-post-comment" type="button">Post</button>
          </div>
        </div>
      `;

      // Event: Double-tap/click to like with heart burst
      const mediaWrap = card.querySelector('.feed-media-wrap');
      const burstHeart = card.querySelector('.heart-burst-icon');
      const likeBtn = card.querySelector('.btn-feed-like');
      const likesCountSpan = card.querySelector('.feed-likes-count');

      mediaWrap.addEventListener('dblclick', () => {
        burstHeart.classList.remove('burst');
        void burstHeart.offsetWidth;
        burstHeart.classList.add('burst');

        if (!post.isLiked) {
          post.isLiked = true;
          post.likesCount += 1;
          likeBtn.classList.add('liked');
          likeBtn.querySelector('span:first-child').textContent = '❤️';
          likesCountSpan.textContent = post.likesCount;
          this.saveState();
        }
      });

      likeBtn.addEventListener('click', () => {
        post.isLiked = !post.isLiked;
        post.likesCount += post.isLiked ? 1 : -1;
        likeBtn.classList.toggle('liked', post.isLiked);
        likeBtn.querySelector('span:first-child').textContent = post.isLiked ? '❤️' : '🤍';
        likesCountSpan.textContent = post.likesCount;
        this.saveState();
      });

      // Event: Toggle comments drawer
      const commentToggleBtn = card.querySelector('.btn-feed-toggle-comments');
      const commentsSection = card.querySelector('.feed-comments-section');
      commentToggleBtn.addEventListener('click', () => {
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
      });

      // Event: Post new comment
      const commentInput = card.querySelector('.feed-comment-input');
      const postCommentBtn = card.querySelector('.btn-post-comment');

      const handleAddComment = () => {
        const text = commentInput.value.trim();
        if (!text) return;
        const newC = {
          id: `c-${Date.now()}`,
          authorName: this.user.name,
          authorAvatar: this.user.avatar,
          text: text,
          time: "Just now"
        };
        post.comments.push(newC);
        this.saveState();
        this.renderFeedStream();
      };

      postCommentBtn.addEventListener('click', handleAddComment);
      commentInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleAddComment();
      });

      this.feedStream.appendChild(card);
    });
  }

  openUploadModal() {
    this.uploadPreviewImg.src = this.selectedPresetUploadUrl;
    this.uploadPreviewImg.style.display = 'block';
    this.uploadCaption.value = '';
    this.uploadModal.classList.add('active');
  }

  submitNewMoment() {
    const caption = this.uploadCaption.value.trim() || "Sharing a glimpse from the studio space.";
    const interest = this.uploadInterest.value;

    const newPost = {
      id: `post-${Date.now()}`,
      authorId: "me",
      authorName: this.user.name,
      authorHandle: this.user.handle,
      authorAvatar: this.user.avatar,
      location: "Tokyo Studio",
      mediaUrl: this.selectedPresetUploadUrl,
      caption: caption,
      tags: ["#CrazyLove", `#${interest.replace(/\s+/g, '')}`, "#CreatorLife"],
      interest: interest,
      likesCount: 1,
      isLiked: true,
      timestamp: "Just now",
      comments: []
    };

    this.feedPosts.unshift(newPost);
    this.saveState();
    this.closeModals();
    this.renderFeedView();
  }

  // --------------------------------------------------------------------------
  // INSTAGRAM-STYLE DIRECT MESSAGES CONSOLE
  // --------------------------------------------------------------------------
  renderTheatricalChat() {
    this.renderChatStoriesStrip();
    this.renderChatSidebarThreads();
    this.renderActiveMessages();
  }

  renderChatStoriesStrip() {
    const strip = document.getElementById('chatStoriesStrip');
    if (!strip) return;
    strip.innerHTML = '';

    PROFILES.forEach(profile => {
      const avatar = document.createElement('img');
      avatar.src = profile.avatar;
      avatar.className = 'chat-story-avatar';
      avatar.title = `${profile.name} (${profile.lastActive})`;
      avatar.addEventListener('click', () => {
        this.startChatWith(profile.id);
      });
      strip.appendChild(avatar);
    });
  }

  renderChatSidebarThreads(filterQuery = '') {
    const container = document.getElementById('theatricalThreads_page');
    if (!container) return;
    container.innerHTML = '';

    const filteredMatches = this.matches.filter(match => {
      const profile = PROFILES.find(p => p.id === match.profileId);
      if (!profile) return false;
      if (!filterQuery) return true;
      return profile.name.toLowerCase().includes(filterQuery) ||
             profile.hobbies.some(h => h.toLowerCase().includes(filterQuery));
    });

    if (filteredMatches.length === 0) {
      container.innerHTML = `<div style="padding:2rem 1rem; text-align:center; color:var(--muted-gray); font-size:0.9rem;">No matching threads found.</div>`;
      return;
    }

    filteredMatches.forEach(match => {
      const profile = PROFILES.find(p => p.id === match.profileId);
      if (!profile) return;

      const isActive = this.activeChatId === profile.id;
      const thread = document.createElement('div');
      thread.className = `theatrical-thread-item ${isActive ? 'active' : ''}`;
      thread.innerHTML = `
        <div style="position:relative;">
          <img class="theatrical-thread-avatar" src="${profile.avatar}" alt="${profile.name}">
          <span class="online-dot-beacon"></span>
        </div>
        <div style="flex:1; min-width:0;">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <strong style="font-size:1.05rem; font-weight:800; color:#FFF;">${profile.name}</strong>
            <span style="font-size:0.75rem; color:var(--muted-gray);">${match.lastTime || match.matchedAt}</span>
          </div>
          <div style="font-size:0.875rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:rgba(255,255,255,0.7); margin-top:0.2rem;">
            ${match.lastMessage || 'Connected!'}
          </div>
        </div>
        ${match.unread ? `<span style="width:8px; height:8px; border-radius:50%; background:var(--canvas-pink);"></span>` : ''}
      `;

      thread.addEventListener('click', () => {
        match.unread = false;
        this.activeChatId = profile.id;
        this.saveState();
        this.renderTheatricalChat();
      });

      container.appendChild(thread);
    });
  }

  filterChatThreads(query) {
    this.renderChatSidebarThreads(query);
  }

  renderActiveMessages() {
    const avatarEl = this.theatricalChatAvatar_page;
    const nameEl = this.theatricalChatName_page;
    const statusEl = this.theatricalChatStatus_page;
    const msgContainer = this.theatricalMessages_page;
    const icebreakerContainer = this.theatricalIcebreakers_page;

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
        } else if (msg.type === 'image') {
          bubble.innerHTML = `
            <img src="${msg.mediaUrl}" style="max-width:240px; border-radius:0.85rem; object-fit:cover; margin-bottom:0.35rem;" alt="Media">
            <div>${msg.text || ''}</div>
            <div style="font-size:0.7rem; opacity:0.7; margin-top:0.35rem; text-align:right;">${msg.time} · Seen</div>
          `;
        } else {
          bubble.innerHTML = `
            <div>${msg.text}</div>
            <div style="font-size:0.7rem; opacity:0.7; margin-top:0.35rem; text-align:right;">${msg.time} ${msg.sender === 'me' ? '· Seen ✓' : ''}</div>
          `;
        }

        // Reactions rendering
        if (msg.reactions && msg.reactions.length > 0) {
          const rxPill = document.createElement('div');
          rxPill.className = 'msg-reaction-pill';
          rxPill.textContent = msg.reactions.join(' ');
          bubble.appendChild(rxPill);
        }

        // Double-click message to react with ❤️
        bubble.addEventListener('dblclick', () => {
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
        chip.className = 'pill-btn pill-sm pill-white liquid-glass-btn';
        chip.style.padding = '0.35rem 0.85rem';
        chip.style.fontSize = '0.8rem';
        chip.textContent = prompt;
        chip.addEventListener('click', () => {
          this.sendChatMessage(prompt);
        });
        icebreakerContainer.appendChild(chip);
      });
    }
  }

  sendChatMessage(customText = null) {
    const text = customText !== null ? customText.trim() : (this.theatricalInput_page ? this.theatricalInput_page.value.trim() : '');
    if (!text || !this.activeChatId) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: "me",
      type: "text",
      text: text,
      time: now,
      reactions: [],
      status: "seen"
    };

    if (!this.chats[this.activeChatId]) {
      this.chats[this.activeChatId] = [];
    }
    this.chats[this.activeChatId].push(userMsg);

    const match = this.matches.find(m => m.profileId === this.activeChatId);
    if (match) {
      match.lastMessage = text;
      match.lastTime = now;
    }

    if (this.theatricalInput_page) this.theatricalInput_page.value = '';
    this.saveState();
    this.renderActiveMessages();
    this.renderChatSidebarThreads();

    // Trigger Automated Companion Response after 1.2s delay
    this.triggerBotResponse(this.activeChatId);
  }

  sendImageMessage(dataUrl) {
    if (!this.activeChatId || !dataUrl) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: "me",
      type: "image",
      mediaUrl: dataUrl,
      text: "Sent an aesthetic capture",
      time: now,
      reactions: ["❤️"],
      status: "seen"
    };

    if (!this.chats[this.activeChatId]) this.chats[this.activeChatId] = [];
    this.chats[this.activeChatId].push(userMsg);

    const match = this.matches.find(m => m.profileId === this.activeChatId);
    if (match) {
      match.lastMessage = "📷 Sent a photo";
      match.lastTime = now;
    }

    this.saveState();
    this.renderActiveMessages();
    this.renderChatSidebarThreads();
    this.triggerBotResponse(this.activeChatId);
  }

  sendVoiceNoteMessage() {
    if (!this.activeChatId) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: "me",
      type: "voice",
      duration: "0:14",
      time: now,
      reactions: ["🔥"],
      status: "seen"
    };

    if (!this.chats[this.activeChatId]) this.chats[this.activeChatId] = [];
    this.chats[this.activeChatId].push(userMsg);

    const match = this.matches.find(m => m.profileId === this.activeChatId);
    if (match) {
      match.lastMessage = "🎙️ Voice memo (0:14)";
      match.lastTime = now;
    }

    this.saveState();
    this.renderActiveMessages();
    this.renderChatSidebarThreads();
    this.triggerBotResponse(this.activeChatId);
  }

  triggerBotResponse(profileId) {
    if (!this.theatricalMessages_page) return;
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'theatrical-bubble them';
    typingIndicator.innerHTML = `<span>Thinking &amp; typing...</span>`;
    this.theatricalMessages_page.appendChild(typingIndicator);
    this.theatricalMessages_page.scrollTop = this.theatricalMessages_page.scrollHeight;

    setTimeout(() => {
      typingIndicator.remove();
      const pool = BOT_RESPONSES[profileId] || [
        "That is awesome! Would love to hear more about that.",
        "Totally on the same wavelength. When are you free this week?",
        "Love that energy!"
      ];
      const reply = pool[Math.floor(Math.random() * pool.length)];

      const botMsg = {
        id: `msg-${Date.now()}`,
        sender: "them",
        type: "text",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: ["❤️"],
        status: "seen"
      };

      this.chats[profileId].push(botMsg);
      const match = this.matches.find(m => m.profileId === profileId);
      if (match) {
        match.lastMessage = reply;
        match.lastTime = botMsg.time;
      }
      this.saveState();
      this.renderActiveMessages();
      this.renderChatSidebarThreads();
    }, 1200);
  }

  // --------------------------------------------------------------------------
  // USER PROFILE VIEW
  // --------------------------------------------------------------------------
  renderProfileView() {
    const avatar = document.getElementById('userProfileAvatar');
    const name = document.getElementById('userProfileName');
    const handle = document.getElementById('userProfileHandle');
    const role = document.getElementById('userProfileRole');
    const bio = document.getElementById('userProfileBio');
    const tags = document.getElementById('userProfileTags');

    if (avatar) avatar.src = this.user.avatar;
    if (name) name.textContent = this.user.name;
    if (handle) handle.textContent = `${this.user.handle} · ${this.user.city}`;
    if (role) role.textContent = this.user.role;
    if (bio) bio.textContent = this.user.bio;

    if (tags) {
      tags.innerHTML = this.user.hobbies.map(h => `<span class="liquid-glass-badge" style="position:static; display:inline-block; margin-right:0.4rem; margin-bottom:0.4rem;">${h}</span>`).join('');
    }
  }

  // --------------------------------------------------------------------------
  // AUTH & MODALS
  // --------------------------------------------------------------------------
  openAuthModal() {
    this.authModal.classList.add('active');
  }

  showCardDetails() {
    const deck = this.getActiveDeck();
    if (deck.length === 0 && !this.activeChatId) return;
    const profile = deck[0] || PROFILES.find(p => p.id === this.activeChatId);
    if (!profile) return;

    this.infoModalBody.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.25rem; text-align:left;">
        <img src="${profile.photos[0]}" style="width:100%; height:320px; object-fit:cover; border-radius:1.5rem; border:2px solid var(--ink-dark);" alt="${profile.name}">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h2 style="font-size:2.5rem; font-weight:800; line-height:1; letter-spacing:-0.02em;">${profile.name}, ${profile.age}</h2>
            <span style="background:var(--accent-lime); color:#000; font-weight:900; padding:0.35rem 0.85rem; border-radius:9999px; font-size:0.85rem;">⚡ ${profile.compatibility}% Match</span>
          </div>
          <div style="color:var(--canvas-pink); font-size:1.1rem; font-weight:800; margin-top:0.4rem;">${profile.occupation} · ${profile.city}</div>
        </div>

        <div class="auth-info-card" style="border-color:var(--canvas-pink);">
          <strong style="display:block; text-transform:uppercase; font-size:0.85rem; letter-spacing:0.04em; color:var(--canvas-pink); margin-bottom:0.35rem;">Story &amp; Vibe</strong>
          <p style="font-size:1.1rem; font-weight:600; line-height:1.5;">${profile.bio}</p>
        </div>

        <div>
          <strong style="display:block; text-transform:uppercase; font-size:0.85rem; letter-spacing:0.04em; margin-bottom:0.5rem; color:#FFF;">Hobbies &amp; Creative Passions</strong>
          <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
            ${profile.hobbies.map(t => `<span class="liquid-glass-badge" style="position:static; display:inline-block; font-size:0.85rem; padding:0.35rem 0.85rem; border-radius:9999px;">${t}</span>`).join('')}
          </div>
        </div>

        <div style="margin-top:0.5rem;">
          <strong style="display:block; text-transform:uppercase; font-size:0.85rem; letter-spacing:0.04em; margin-bottom:0.5rem; color:#FFF;">Prompts</strong>
          ${profile.prompts.map(pr => `
            <div style="background:rgba(255,255,255,0.06); border-radius:1rem; padding:1rem; margin-bottom:0.5rem;">
              <div style="font-size:0.8rem; color:var(--accent-lime); font-weight:800;">${pr.question}</div>
              <div style="font-size:1rem; font-weight:600; color:#FFF; margin-top:0.25rem;">${pr.answer}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.infoModal.classList.add('active');
  }

  closeModals() {
    document.querySelectorAll('.cc-modal-backdrop').forEach(m => m.classList.remove('active'));
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.crazyApp = new CrazyCreativeApp();
});
