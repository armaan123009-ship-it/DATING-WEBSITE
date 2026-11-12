// ============================================================================
// CRAZY CREATIVE DATING SYSTEM - CORE APPLICATION CONTROLLER
// High-Impact Poster Transitions, Drag Gesture Physics, Real-Time Dialogue
// ============================================================================

import { PROFILES, CATEGORIES } from './data/profiles.js';
import { INITIAL_MATCHES, INITIAL_MESSAGES, ICEBREAKER_PROMPTS, BOT_RESPONSES } from './data/chats.js';

class CrazyCreativeApp {
  constructor() {
    this.storageKey = 'cc_dating_state_v1';
    this.initState();
    this.initDOM();
    this.bindEvents();
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
        this.user = parsed.user || this.getDefaultUser();
        this.matches = parsed.matches || INITIAL_MATCHES;
        this.chats = parsed.chats || INITIAL_MESSAGES;
        this.swiped = parsed.swiped || {};
        this.activeCategory = parsed.activeCategory || 'all';
      } catch (e) {
        this.resetDefaultState();
      }
    } else {
      this.resetDefaultState();
    }

    this.currentView = 'home';
    this.activeChatId = this.matches.length > 0 ? this.matches[0].profileId : null;
  }

  resetDefaultState() {
    this.user = this.getDefaultUser();
    this.matches = [...INITIAL_MATCHES];
    this.chats = JSON.parse(JSON.stringify(INITIAL_MESSAGES));
    this.swiped = {};
    this.activeCategory = 'all';
    this.saveState();
  }

  getDefaultUser() {
    return {
      name: "Armaan Yadav",
      email: "armaan123009@gmail.com",
      city: "Tokyo",
      role: "Creative Director",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      verified: true
    };
  }

  saveState() {
    const data = {
      user: this.user,
      matches: this.matches,
      chats: this.chats,
      swiped: this.swiped,
      activeCategory: this.activeCategory
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // --------------------------------------------------------------------------
  // DOM REFERENCES
  // --------------------------------------------------------------------------
  initDOM() {
    this.views = {
      home: document.getElementById('viewHome'),
      discover: document.getElementById('viewDiscover'),
      chats: document.getElementById('viewChats')
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

    // Theatrical Chat Stage
    this.theatricalThreads = document.getElementById('theatricalThreads');
    this.theatricalChatAvatar = document.getElementById('theatricalChatAvatar');
    this.theatricalChatName = document.getElementById('theatricalChatName');
    this.theatricalMessages = document.getElementById('theatricalMessages');
    this.theatricalInput = document.getElementById('theatricalInput');
    this.btnTheatricalSend = document.getElementById('btnTheatricalSend');
    this.theatricalIcebreakers = document.getElementById('theatricalIcebreakers');

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
        this.navigateTo(route);
      });
    });

    if (this.btnHeroLaunch) this.btnHeroLaunch.addEventListener('click', () => this.navigateTo('discover'));
    if (this.btnHeroSignIn) this.btnHeroSignIn.addEventListener('click', () => this.openAuthModal());
    if (this.btnFlameLaunch) this.btnFlameLaunch.addEventListener('click', () => this.navigateTo('discover'));

    // Deck Gestures and Buttons
    if (this.btnPass) this.btnPass.addEventListener('click', () => this.swipeTopCard('pass'));
    if (this.btnLike) this.btnLike.addEventListener('click', () => this.swipeTopCard('like'));
    if (this.btnRewind) this.btnRewind.addEventListener('click', () => this.rewindLastCard());
    if (this.btnInfo) this.btnInfo.addEventListener('click', () => this.showCardDetails());

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
    if (this.btnTheatricalSend) {
      this.btnTheatricalSend.addEventListener('click', () => this.sendChatMessage());
    }
    const sendBtnPage = document.getElementById('btnTheatricalSend_page');
    if (sendBtnPage) {
      sendBtnPage.addEventListener('click', () => {
        const inputPage = document.getElementById('theatricalInput_page');
        if (inputPage) this.sendChatMessage(inputPage.value);
        if (inputPage) inputPage.value = '';
      });
    }
    if (this.theatricalInput) {
      this.theatricalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.sendChatMessage();
      });
    }
    const inputPageEl = document.getElementById('theatricalInput_page');
    if (inputPageEl) {
      inputPageEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.sendChatMessage(inputPageEl.value);
          inputPageEl.value = '';
        }
      });
    }

    // Google Auth
    if (this.googleAuthBtn) {
      this.googleAuthBtn.addEventListener('click', () => this.handleGoogleAuth());
    }
    if (this.guestAuthBtn) {
      this.guestAuthBtn.addEventListener('click', () => {
        this.closeModals();
        this.navigateTo('discover');
      });
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
  }

  // --------------------------------------------------------------------------
  // ROUTING & VIEW CONTROLLER
  // --------------------------------------------------------------------------
  navigateTo(viewName) {
    this.currentView = viewName;
    document.body.classList.toggle('in-dashboard', viewName !== 'home');

    Object.keys(this.views).forEach(key => {
      if (this.views[key]) {
        this.views[key].classList.toggle('active', key === viewName);
      }
    });

    this.navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.route === viewName);
    });

    if (viewName === 'discover') {
      this.renderDeck();
    } else if (viewName === 'chats') {
      this.renderTheatricalChat();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderCurrentView() {
    this.navigateTo(this.currentView);
  }

  // --------------------------------------------------------------------------
  // DISCOVERY CARD STACK & GESTURES
  // --------------------------------------------------------------------------
  getActiveDeck() {
    return PROFILES.filter(p => !this.swiped[p.id]);
  }

  renderDeck() {
    const deck = this.getActiveDeck();
    this.ccSwipeStage.innerHTML = '';

    if (deck.length === 0) {
      this.ccSwipeStage.innerHTML = `
        <div style="background:var(--canvas-white); border:3px solid var(--ink-dark); border-radius:var(--radius-card); padding:3.5rem 2rem; text-align:center; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5rem; box-shadow:0 20px 50px rgba(0,0,0,0.1);">
          <div style="width:4.5rem; height:4.5rem; border-radius:50%; background:var(--accent-lime); display:flex; align-items:center; justify-content:center; font-size:2rem; font-weight:900; border:2px solid var(--ink-dark);">★</div>
          <h3 style="font-size:2.5rem; font-weight:800; text-transform:uppercase; line-height:1;">Queue Complete!</h3>
          <p style="color:var(--muted-gray); font-size:1.15rem; max-width:320px; font-weight:600;">You've explored the wild roster. Rewind or reload your discovery queue.</p>
          <button class="pill-btn pill-pink" id="btnResetCrazyDeck">↺ Reset Deck</button>
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
            ${profile.tags.slice(0, 3).map(tag => `<span style="background:#F3F4F6; border-radius:9999px; padding:0.25rem 0.75rem; font-size:0.8rem; font-weight:800;">${tag}</span>`).join('')}
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

    this.matchAvatar.src = profile.avatar;
    this.matchName.textContent = profile.name;
    this.activeChatId = profile.id;
    this.matchModal.classList.add('active');
  }

  // --------------------------------------------------------------------------
  // THEATRICAL DARK CHAT WORKSPACE
  // --------------------------------------------------------------------------
  renderTheatricalChat() {
    const threadContainers = [
      this.theatricalThreads,
      document.getElementById('theatricalThreads_page')
    ].filter(Boolean);

    threadContainers.forEach(container => {
      container.innerHTML = '';
      this.matches.forEach(match => {
        const profile = PROFILES.find(p => p.id === match.profileId);
        if (!profile) return;

        const isActive = this.activeChatId === profile.id;
        const thread = document.createElement('div');
        thread.className = `theatrical-thread-item ${isActive ? 'active' : ''}`;
        thread.innerHTML = `
          <img class="theatrical-thread-avatar" src="${profile.avatar}" alt="${profile.name}">
          <div style="flex:1; min-width:0;">
            <div style="display:flex; justify-content:space-between; align-items:baseline;">
              <strong style="font-size:1.1rem; font-weight:800;">${profile.name}</strong>
              <span style="font-size:0.75rem; opacity:0.8;">${match.matchedAt}</span>
            </div>
            <div style="font-size:0.875rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; opacity:0.85; margin-top:0.2rem;">
              ${match.lastMessage || 'Connected!'}
            </div>
          </div>
        `;

        thread.addEventListener('click', () => {
          match.unread = false;
          this.activeChatId = profile.id;
          this.saveState();
          this.renderTheatricalChat();
        });

        container.appendChild(thread);
      });
    });

    this.renderActiveMessages();
  }

  renderActiveMessages() {
    const avatarEls = [this.theatricalChatAvatar, document.getElementById('theatricalChatAvatar_page')].filter(Boolean);
    const nameEls = [this.theatricalChatName, document.getElementById('theatricalChatName_page')].filter(Boolean);
    const msgContainers = [this.theatricalMessages, document.getElementById('theatricalMessages_page')].filter(Boolean);
    const icebreakerContainers = [this.theatricalIcebreakers, document.getElementById('theatricalIcebreakers_page')].filter(Boolean);

    if (!this.activeChatId) {
      nameEls.forEach(el => el.textContent = "Select Connection");
      msgContainers.forEach(c => {
        c.innerHTML = `<div style="text-align:center; padding:3rem; color:rgba(255,255,255,0.5);">Select a connection to launch real-time conversation.</div>`;
      });
      return;
    }

    const profile = PROFILES.find(p => p.id === this.activeChatId);
    if (!profile) return;

    avatarEls.forEach(el => el.src = profile.avatar);
    nameEls.forEach(el => el.textContent = profile.name);

    const messages = this.chats[profile.id] || [];

    msgContainers.forEach(c => {
      c.innerHTML = '';
      messages.forEach(msg => {
        const bubble = document.createElement('div');
        bubble.className = `theatrical-bubble ${msg.sender}`;
        bubble.innerHTML = `
          <div>${msg.text}</div>
          <div style="font-size:0.7rem; opacity:0.7; margin-top:0.35rem; text-align:right;">${msg.time}</div>
        `;
        c.appendChild(bubble);
      });
      c.scrollTop = c.scrollHeight;
    });

    // Render Icebreakers
    icebreakerContainers.forEach(c => {
      c.innerHTML = '';
      ICEBREAKER_PROMPTS.forEach(prompt => {
        const chip = document.createElement('button');
        chip.className = 'pill-btn pill-sm pill-white';
        chip.style.padding = '0.35rem 0.85rem';
        chip.style.fontSize = '0.8rem';
        chip.textContent = prompt;
        chip.addEventListener('click', () => {
          this.sendChatMessage(prompt);
        });
        c.appendChild(chip);
      });
    });
  }

  sendChatMessage(customText = null) {
    const text = customText || this.theatricalInput.value.trim();
    if (!text || !this.activeChatId) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text: text,
      time: now
    };

    if (!this.chats[this.activeChatId]) {
      this.chats[this.activeChatId] = [];
    }
    this.chats[this.activeChatId].push(userMsg);

    const match = this.matches.find(m => m.profileId === this.activeChatId);
    if (match) {
      match.lastMessage = text;
    }

    this.theatricalInput.value = '';
    this.saveState();
    this.renderActiveMessages();

    // Trigger Automated Companion Response after 1.2s delay
    this.triggerBotResponse(this.activeChatId);
  }

  triggerBotResponse(profileId) {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'theatrical-bubble them';
    typingIndicator.innerHTML = `<span>Thinking &amp; typing...</span>`;
    this.theatricalMessages.appendChild(typingIndicator);
    this.theatricalMessages.scrollTop = this.theatricalMessages.scrollHeight;

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
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      this.chats[profileId].push(botMsg);
      const match = this.matches.find(m => m.profileId === profileId);
      if (match) {
        match.lastMessage = reply;
      }
      this.saveState();
      this.renderActiveMessages();
      this.renderTheatricalChat();
    }, 1200);
  }

  // --------------------------------------------------------------------------
  // AUTH & MODALS
  // --------------------------------------------------------------------------
  openAuthModal() {
    this.authModal.classList.add('active');
  }

  handleGoogleAuth() {
    this.user = {
      name: "Armaan Yadav",
      email: "armaan123009@gmail.com",
      city: "Tokyo",
      role: "Creative Director",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      verified: true
    };
    this.saveState();
    this.closeModals();
    this.navigateTo('discover');
  }

  showCardDetails() {
    const deck = this.getActiveDeck();
    if (deck.length === 0) return;
    const profile = deck[0];

    this.infoModalBody.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.25rem; text-align:left;">
        <img src="${profile.photos[0]}" style="width:100%; height:320px; object-fit:cover; border-radius:1.5rem; border:2px solid var(--ink-dark);" alt="${profile.name}">
        <div>
          <h2 style="font-size:2.5rem; font-weight:800; line-height:1; letter-spacing:-0.02em;">${profile.name}, ${profile.age}</h2>
          <div style="color:var(--canvas-pink); font-size:1.1rem; font-weight:800; margin-top:0.4rem;">${profile.occupation} · ${profile.city}</div>
        </div>
        <div style="background:#FFF0F7; border:2px solid var(--canvas-pink); border-radius:1.25rem; padding:1.25rem;">
          <strong style="display:block; text-transform:uppercase; font-size:0.85rem; letter-spacing:0.04em; color:var(--canvas-pink); margin-bottom:0.35rem;">Story &amp; Vibe</strong>
          <p style="font-size:1.1rem; font-weight:600; line-height:1.5;">${profile.bio}</p>
        </div>
        <div>
          <strong style="display:block; text-transform:uppercase; font-size:0.85rem; letter-spacing:0.04em; margin-bottom:0.5rem;">Interests</strong>
          <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
            ${profile.tags.map(t => `<span style="background:var(--canvas-dark); color:#FFF; font-weight:800; padding:0.35rem 0.85rem; border-radius:9999px; font-size:0.85rem;">${t}</span>`).join('')}
          </div>
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
