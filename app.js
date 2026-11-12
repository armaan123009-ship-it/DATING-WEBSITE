// ============================================================================
// JAN.AI EDITORIAL DATING APP - CONTROLLER & STATE ARCHITECTURE
// Clean, professional, zero emojis, full multi-view navigation & messaging
// ============================================================================

import { PROFILES, CATEGORIES } from './data/profiles.js';
import { INITIAL_MATCHES, INITIAL_MESSAGES, ICEBREAKER_PROMPTS, BOT_RESPONSES } from './data/chats.js';

class JanDatingApp {
  constructor() {
    this.storageKey = 'jandate_app_state_v1';
    this.initState();
    this.initDOM();
    this.bindEvents();
    this.renderCurrentView();
  }

  // --------------------------------------------------------------------------
  // 1. STATE INITIALIZATION & LOCALSTORAGE
  // --------------------------------------------------------------------------
  initState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.user = parsed.user || this.getDefaultUser();
        this.matches = parsed.matches || INITIAL_MATCHES;
        this.chats = parsed.chats || INITIAL_MESSAGES;
        this.swiped = parsed.swiped || {};
        this.activeFilter = parsed.activeFilter || 'all';
      } catch (e) {
        this.resetDefaultState();
      }
    } else {
      this.resetDefaultState();
    }

    // Default View: 'home', 'login', or 'dashboard'
    this.currentView = 'home';
    this.activeDashTab = 'discover';
    this.activeChatId = this.matches.length > 0 ? this.matches[0].profileId : null;
  }

  resetDefaultState() {
    this.user = this.getDefaultUser();
    this.matches = [...INITIAL_MATCHES];
    this.chats = JSON.parse(JSON.stringify(INITIAL_MESSAGES));
    this.swiped = {};
    this.activeFilter = 'all';
    this.saveState();
  }

  getDefaultUser() {
    return {
      name: "Armaan Yadav",
      email: "armaan123009@gmail.com",
      city: "Tokyo",
      role: "Design Engineer",
      bio: "Focusing on distributed interfaces, editorial typography, and quiet specialty coffee roasters.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      verified: true,
      isLoggedIn: true
    };
  }

  saveState() {
    const state = {
      user: this.user,
      matches: this.matches,
      chats: this.chats,
      swiped: this.swiped,
      activeFilter: this.activeFilter
    };
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  // --------------------------------------------------------------------------
  // 2. DOM INITIALIZATION
  // --------------------------------------------------------------------------
  initDOM() {
    // High-level Views
    this.views = {
      home: document.getElementById('viewHome'),
      login: document.getElementById('viewLogin'),
      dashboard: document.getElementById('viewDashboard')
    };

    // Nav triggers
    this.navViewLinks = document.querySelectorAll('[data-route]');
    this.navUserBtn = document.getElementById('navUserBtn');
    this.navUserAvatar = document.getElementById('navUserAvatar');

    // Dashboard Sub-navigation Tabs
    this.dashTabButtons = document.querySelectorAll('[data-dash-tab]');
    this.dashTabPanes = document.querySelectorAll('.dash-tab-pane');
    this.dashMatchesBadge = document.getElementById('dashMatchesBadge');

    // Deck Elements
    this.janCardArena = document.getElementById('janCardArena');
    this.categoryFilterRow = document.getElementById('categoryFilterRow');
    this.btnDeckPass = document.getElementById('btnDeckPass');
    this.btnDeckLike = document.getElementById('btnDeckLike');
    this.btnDeckRewind = document.getElementById('btnDeckRewind');
    this.btnDeckInfo = document.getElementById('btnDeckInfo');

    // Chat Elements
    this.threadsList = document.getElementById('threadsList');
    this.chatPartnerAvatar = document.getElementById('chatPartnerAvatar');
    this.chatPartnerName = document.getElementById('chatPartnerName');
    this.messageStreamBody = document.getElementById('messageStreamBody');
    this.conversationIcebreakers = document.getElementById('conversationIcebreakers');
    this.chatInput = document.getElementById('chatInput');
    this.btnSendMessage = document.getElementById('btnSendMessage');

    // Modals
    this.matchModal = document.getElementById('matchModal');
    this.matchPartnerName = document.getElementById('matchPartnerName');
    this.matchPartnerAvatar = document.getElementById('matchPartnerAvatar');
    this.btnMatchChat = document.getElementById('btnMatchChat');
    this.btnMatchContinue = document.getElementById('btnMatchContinue');

    this.profileDetailModal = document.getElementById('profileDetailModal');
    this.profileModalContent = document.getElementById('profileModalContent');
  }

  // --------------------------------------------------------------------------
  // 3. EVENT BINDINGS
  // --------------------------------------------------------------------------
  bindEvents() {
    // Navigation Routing
    this.navViewLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.dataset.route;
        this.navigateTo(route);
      });
    });

    // Dashboard Sub-tabs
    this.dashTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.dashTab;
        this.switchDashTab(tab);
      });
    });

    // Deck Action Triggers
    if (this.btnDeckPass) this.btnDeckPass.addEventListener('click', () => this.swipeTopCard('pass'));
    if (this.btnDeckLike) this.btnDeckLike.addEventListener('click', () => this.swipeTopCard('like'));
    if (this.btnDeckRewind) this.btnDeckRewind.addEventListener('click', () => this.rewindLastSwipe());
    if (this.btnDeckInfo) this.btnDeckInfo.addEventListener('click', () => this.showCardDetails());

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (this.currentView !== 'dashboard' || this.activeDashTab !== 'discover') return;
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') this.swipeTopCard('pass');
      if (e.key === 'ArrowRight') this.swipeTopCard('like');
      if (e.key === 'ArrowDown') this.rewindLastSwipe();
      if (e.key === ' ') {
        e.preventDefault();
        this.showCardDetails();
      }
    });

    // Chat Message Sending
    if (this.btnSendMessage) {
      this.btnSendMessage.addEventListener('click', () => this.sendChatMessage());
    }
    if (this.chatInput) {
      this.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.sendChatMessage();
      });
    }

    // Google Sign-In Triggers
    const googleAuthBtn = document.getElementById('googleAuthBtn');
    if (googleAuthBtn) {
      googleAuthBtn.addEventListener('click', () => this.completeGoogleAuth());
    }

    const guestLoginBtn = document.getElementById('guestLoginBtn');
    if (guestLoginBtn) {
      guestLoginBtn.addEventListener('click', () => this.navigateTo('dashboard'));
    }

    // Modal Triggers
    if (this.btnMatchContinue) {
      this.btnMatchContinue.addEventListener('click', () => this.closeModals());
    }
    if (this.btnMatchChat) {
      this.btnMatchChat.addEventListener('click', () => {
        this.closeModals();
        this.switchDashTab('chats');
      });
    }

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => this.closeModals());
    });
  }

  // --------------------------------------------------------------------------
  // 4. ROUTING & VIEW CONTROLLER
  // --------------------------------------------------------------------------
  navigateTo(viewName) {
    this.currentView = viewName;
    this.renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderCurrentView() {
    // Toggle active view container
    Object.keys(this.views).forEach(key => {
      if (this.views[key]) {
        this.views[key].classList.toggle('active', key === this.currentView);
      }
    });

    // Update Nav Link Active states
    this.navViewLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.route === this.currentView);
    });

    if (this.currentView === 'dashboard') {
      this.renderDashboard();
    }
  }

  switchDashTab(tabName) {
    this.activeDashTab = tabName;
    this.dashTabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.dashTab === tabName);
    });
    this.dashTabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === `dashTab_${tabName}`);
    });

    if (tabName === 'discover') {
      this.renderDeck();
    } else if (tabName === 'chats') {
      this.renderChatWorkspace();
    }
  }

  // --------------------------------------------------------------------------
  // 5. DECK & CARD SWIPE ENGINE (JAN.AI SPECIFICATION)
  // --------------------------------------------------------------------------
  getActiveDeck() {
    return PROFILES.filter(p => {
      if (this.swiped[p.id]) return false;
      if (this.activeFilter !== 'all' && p.category !== this.activeFilter) return false;
      return true;
    });
  }

  renderDeck() {
    this.renderCategoryFilters();
    const deck = this.getActiveDeck();
    this.janCardArena.innerHTML = '';

    if (deck.length === 0) {
      this.janCardArena.innerHTML = `
        <div style="background:var(--canvas); border:2px solid var(--ink); border-radius:var(--radius-md); box-shadow:var(--shadow-xl); padding:3rem 2rem; text-align:center; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.25rem;">
          <div style="width:3.5rem; height:3.5rem; border:2px solid var(--ink); border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--accent-yellow); box-shadow:var(--shadow-sm);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3 style="font-size:1.75rem; font-weight:800; letter-spacing:-0.03em;">Queue Completed</h3>
          <p style="color:var(--muted); font-size:0.95rem; max-width:320px; line-height:1.5;">You have reviewed all available profiles within this focus area. Reset your queue or select another filter category.</p>
          <button class="btn btn-primary" id="btnResetJanDeck">Reset Discovery Queue</button>
        </div>
      `;
      const resetBtn = document.getElementById('btnResetJanDeck');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.swiped = {};
          this.saveState();
          this.renderDeck();
        });
      }
      return;
    }

    // Render top 3 stacked cards
    const topThree = deck.slice(0, 3);
    topThree.reverse().forEach((profile, index) => {
      const cardEl = this.createCardElement(profile, index, topThree.length);
      this.janCardArena.appendChild(cardEl);
    });

    // Attach gestures to topmost card
    const topCard = this.janCardArena.lastElementChild;
    if (topCard) {
      this.attachCardGestures(topCard);
    }
  }

  renderCategoryFilters() {
    this.categoryFilterRow.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `cat-filter-btn ${this.activeFilter === cat.id ? 'active' : ''}`;
      btn.innerHTML = `<span>${cat.label}</span>`;
      btn.addEventListener('click', () => {
        this.activeFilter = cat.id;
        this.saveState();
        this.renderDeck();
      });
      this.categoryFilterRow.appendChild(btn);
    });
  }

  createCardElement(profile, reverseIndex, totalCount) {
    const isSecond = reverseIndex === totalCount - 2;
    const isThird = reverseIndex === totalCount - 3;

    const card = document.createElement('div');
    card.className = `jan-swipe-card ${isSecond ? 'card-depth-2' : ''} ${isThird ? 'card-depth-3' : ''}`;
    card.dataset.profileId = profile.id;

    card.innerHTML = `
      <div class="jan-card-media">
        <img src="${profile.photos[0]}" alt="${profile.name}">
        <div class="badge-tag-overlay">${profile.categoryLabel}</div>
        <div class="badge-compat-overlay">${profile.compatibility}% COMPATIBILITY</div>

        <!-- Stamp Indicators -->
        <div class="card-stamp-indicator stamp-accept">CONNECT</div>
        <div class="card-stamp-indicator stamp-reject">PASS</div>
      </div>

      <div class="jan-card-body">
        <div>
          <div class="card-title-group">
            <div>
              <span class="card-display-name">${profile.name}</span>
              <span class="card-display-age">${profile.age}</span>
              ${profile.verified ? `
                <span class="verified-badge-icon" title="Verified Profile">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
              ` : ''}
            </div>
            <span style="font-size:0.75rem; font-weight:700; color:var(--muted);">${profile.distance}</span>
          </div>
          <div class="card-role-line">${profile.occupation} · ${profile.city}</div>
          <p class="card-bio-clamp">${profile.bio}</p>
        </div>

        <div>
          <div class="card-tags-cloud">
            ${profile.tags.slice(0, 3).map(tag => `<span class="tag-capsule">${tag}</span>`).join('')}
          </div>
          <div style="background:var(--accent-cream); border:1.5px solid var(--ink); border-radius:var(--radius-sm); padding:0.5rem 0.75rem; margin-top:0.6rem; font-size:0.8125rem;">
            <strong style="display:block; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.04em;">${profile.prompts[0].question}</strong>
            <span style="color:var(--ink-secondary); font-weight:600;">"${profile.prompts[0].answer}"</span>
          </div>
        </div>
      </div>
    `;

    return card;
  }

  attachCardGestures(cardEl) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    const stampAccept = cardEl.querySelector('.stamp-accept');
    const stampReject = cardEl.querySelector('.stamp-reject');

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

      const rotate = currentX * 0.06;
      cardEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rotate}deg)`;

      if (currentX > 30) {
        stampAccept.style.opacity = Math.min((currentX - 30) / 90, 1);
        stampReject.style.opacity = 0;
      } else if (currentX < -30) {
        stampReject.style.opacity = Math.min((Math.abs(currentX) - 30) / 90, 1);
        stampAccept.style.opacity = 0;
      } else {
        stampAccept.style.opacity = 0;
        stampReject.style.opacity = 0;
      }
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      cardEl.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease';

      const threshold = 110;
      if (currentX > threshold) {
        this.executeSwipe(cardEl, 'like');
      } else if (currentX < -threshold) {
        this.executeSwipe(cardEl, 'pass');
      } else {
        cardEl.style.transform = '';
        stampAccept.style.opacity = 0;
        stampReject.style.opacity = 0;
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
    const topCard = this.janCardArena.lastElementChild;
    if (!topCard || !topCard.classList.contains('jan-swipe-card')) return;
    this.executeSwipe(topCard, action);
  }

  executeSwipe(cardEl, action) {
    const profileId = cardEl.dataset.profileId;
    const profile = PROFILES.find(p => p.id === profileId);

    if (action === 'like') {
      cardEl.style.transform = `translate3d(${window.innerWidth + 200}px, 30px, 0) rotate(25deg)`;
    } else {
      cardEl.style.transform = `translate3d(-${window.innerWidth + 200}px, 30px, 0) rotate(-25deg)`;
    }
    cardEl.style.opacity = '0';

    this.swiped[profileId] = action;
    this.lastSwipedId = profileId;

    if (action === 'like') {
      this.triggerMutualMatch(profile);
    } else {
      this.saveState();
    }

    setTimeout(() => {
      this.renderDeck();
    }, 240);
  }

  rewindLastSwipe() {
    if (!this.lastSwipedId) return;
    delete this.swiped[this.lastSwipedId];
    this.lastSwipedId = null;
    this.saveState();
    this.renderDeck();
  }

  triggerMutualMatch(profile) {
    const exists = this.matches.some(m => m.profileId === profile.id);
    if (!exists) {
      this.matches.unshift({
        profileId: profile.id,
        matchedAt: "Just now",
        unread: true,
        lastMessage: profile.initialMessage
      });

      if (!this.chats[profile.id]) {
        this.chats[profile.id] = [
          {
            id: `msg-${Date.now()}`,
            sender: "them",
            text: profile.initialMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
      }
      this.saveState();
    }

    this.matchPartnerAvatar.src = profile.avatar;
    this.matchPartnerName.textContent = profile.name;
    this.activeChatId = profile.id;
    this.matchModal.classList.add('active');
  }

  // --------------------------------------------------------------------------
  // 6. CHAT & MESSAGING WORKSPACE
  // --------------------------------------------------------------------------
  renderChatWorkspace() {
    this.renderThreadsList();
    this.renderActiveConversation();
  }

  renderThreadsList() {
    this.threadsList.innerHTML = '';
    this.matches.forEach(match => {
      const profile = PROFILES.find(p => p.id === match.profileId);
      if (!profile) return;

      const isActive = this.activeChatId === profile.id;
      const entry = document.createElement('div');
      entry.className = `thread-entry ${isActive ? 'active' : ''}`;
      entry.innerHTML = `
        <img class="thread-entry-avatar" src="${profile.avatar}" alt="${profile.name}">
        <div class="thread-entry-meta">
          <div class="thread-name-row">
            <span class="thread-person-name">${profile.name}</span>
            <span class="thread-time-label">${match.matchedAt}</span>
          </div>
          <div class="thread-snippet">${match.lastMessage || 'New connection confirmed'}</div>
        </div>
      `;

      entry.addEventListener('click', () => {
        match.unread = false;
        this.activeChatId = profile.id;
        this.saveState();
        this.renderChatWorkspace();
      });

      this.threadsList.appendChild(entry);
    });
  }

  renderActiveConversation() {
    if (!this.activeChatId) {
      this.chatPartnerName.textContent = "Select Connection";
      this.messageStreamBody.innerHTML = `<div style="text-align:center; padding:3rem; color:var(--muted); font-size:0.9375rem;">Select an active dialogue thread to begin messaging.</div>`;
      return;
    }

    const profile = PROFILES.find(p => p.id === this.activeChatId);
    if (!profile) return;

    this.chatPartnerAvatar.src = profile.avatar;
    this.chatPartnerName.textContent = profile.name;

    const messages = this.chats[profile.id] || [];
    this.messageStreamBody.innerHTML = '';

    messages.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = `editorial-bubble ${msg.sender}`;
      bubble.innerHTML = `
        <div>${msg.text}</div>
        <div class="bubble-timestamp">${msg.time}</div>
      `;
      this.messageStreamBody.appendChild(bubble);
    });

    // Render Icebreakers
    this.conversationIcebreakers.innerHTML = '';
    ICEBREAKER_PROMPTS.forEach(prompt => {
      const chip = document.createElement('button');
      chip.className = 'icebreaker-capsule';
      chip.textContent = prompt;
      chip.addEventListener('click', () => {
        this.sendChatMessage(prompt);
      });
      this.conversationIcebreakers.appendChild(chip);
    });

    this.messageStreamBody.scrollTop = this.messageStreamBody.scrollHeight;
  }

  sendChatMessage(customText = null) {
    const text = customText || this.chatInput.value.trim();
    if (!text || !this.activeChatId) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `m-${Date.now()}`,
      sender: "me",
      text: text,
      time: timeString
    };

    if (!this.chats[this.activeChatId]) {
      this.chats[this.activeChatId] = [];
    }
    this.chats[this.activeChatId].push(userMsg);

    const match = this.matches.find(m => m.profileId === this.activeChatId);
    if (match) {
      match.lastMessage = text;
    }

    this.chatInput.value = '';
    this.saveState();
    this.renderActiveConversation();

    // Trigger Automated Companion Response after 1.2s delay
    this.triggerCompanionResponse(this.activeChatId);
  }

  triggerCompanionResponse(profileId) {
    const typingBox = document.createElement('div');
    typingBox.className = 'typing-box';
    typingBox.innerHTML = `
      <div class="typing-dot-mono"></div>
      <div class="typing-dot-mono"></div>
      <div class="typing-dot-mono"></div>
      <span style="font-size:0.75rem; font-weight:700; color:var(--muted); margin-left:0.25rem;">Typing...</span>
    `;
    this.messageStreamBody.appendChild(typingBox);
    this.messageStreamBody.scrollTop = this.messageStreamBody.scrollHeight;

    setTimeout(() => {
      typingBox.remove();
      const pool = BOT_RESPONSES[profileId] || [
        "I find that perspective very compelling. Would love to explore that further.",
        "Agreed. High standards and clear intent create the best connections.",
        "That sounds like a great plan. Let's arrange a time to meet."
      ];
      const reply = pool[Math.floor(Math.random() * pool.length)];

      const botMsg = {
        id: `m-${Date.now()}`,
        sender: "them",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      this.chats[profileId].push(botMsg);
      const match = this.matches.find(m => m.profileId === profileId);
      if (match) {
        match.lastMessage = reply;
      }
      this.saveState();
      this.renderActiveConversation();
      this.renderThreadsList();
    }, 1200);
  }

  // --------------------------------------------------------------------------
  // 7. GOOGLE AUTHENTICATION & LOGIN FLOW
  // --------------------------------------------------------------------------
  completeGoogleAuth() {
    this.user = {
      name: "Armaan Yadav",
      email: "armaan123009@gmail.com",
      city: "Tokyo",
      role: "Design Engineer",
      bio: "Focusing on distributed interfaces, editorial typography, and quiet specialty coffee roasters.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      verified: true,
      isLoggedIn: true
    };
    this.saveState();
    this.navigateTo('dashboard');
  }

  // --------------------------------------------------------------------------
  // 8. PROFILE MODAL DETAILS
  // --------------------------------------------------------------------------
  showCardDetails() {
    const deck = this.getActiveDeck();
    if (deck.length === 0) return;
    const profile = deck[0];

    this.profileModalContent.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <img src="${profile.photos[0]}" style="width:100%; height:300px; object-fit:cover; border:2px solid var(--ink); border-radius:var(--radius-sm); box-shadow:var(--shadow-sm);" alt="${profile.name}">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <h2 style="font-size:1.75rem; font-weight:800; letter-spacing:-0.03em;">${profile.name}, ${profile.age}</h2>
            <span style="font-size:0.8125rem; font-weight:700; color:var(--muted);">${profile.distance}</span>
          </div>
          <div style="color:var(--muted); font-weight:600; font-size:0.9375rem;">${profile.occupation} · ${profile.city}</div>
        </div>

        <div style="border-top:1px solid var(--border-subtle); padding-top:1rem;">
          <h4 style="font-size:0.8125rem; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.4rem;">Overview</h4>
          <p style="color:var(--ink-secondary); line-height:1.6; font-size:0.9375rem;">${profile.bio}</p>
        </div>

        <div style="background:var(--accent-cream); border:2px solid var(--ink); border-radius:var(--radius-sm); padding:1rem; box-shadow:var(--shadow-sm);">
          <strong style="display:block; font-size:0.8125rem; text-transform:uppercase; letter-spacing:0.04em;">${profile.prompts[0].question}</strong>
          <p style="margin-top:0.35rem; color:var(--ink); font-weight:600;">"${profile.prompts[0].answer}"</p>
        </div>

        <div>
          <h4 style="font-size:0.8125rem; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.5rem;">Interests</h4>
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
            ${profile.tags.map(t => `<span class="tag-capsule">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    this.profileDetailModal.classList.add('active');
  }

  // --------------------------------------------------------------------------
  // 9. DASHBOARD INITIALIZATION
  // --------------------------------------------------------------------------
  renderDashboard() {
    this.renderDeck();
    this.renderChatWorkspace();
    this.renderProfileSettings();
  }

  renderProfileSettings() {
    const nameInput = document.getElementById('userSettingName');
    const cityInput = document.getElementById('userSettingCity');
    const bioInput = document.getElementById('userSettingBio');
    const btnSave = document.getElementById('btnSaveSettings');

    if (nameInput) nameInput.value = this.user.name;
    if (cityInput) cityInput.value = this.user.city;
    if (bioInput) bioInput.value = this.user.bio;

    if (btnSave) {
      btnSave.onclick = () => {
        this.user.name = nameInput.value;
        this.user.city = cityInput.value;
        this.user.bio = bioInput.value;
        this.saveState();
        alert("Account configuration updated.");
      };
    }
  }

  closeModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.janApp = new JanDatingApp();
});
