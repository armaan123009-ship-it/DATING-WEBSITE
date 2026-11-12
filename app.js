// ============================================================================
// LOVEEEZ DATING APPLICATION - CORE CONTROLLER & STATE ENGINE
// ============================================================================

import { PROFILES, ISLANDS } from './data/profiles.js';
import { INITIAL_MATCHES, INITIAL_MESSAGES, ICEBREAKER_PROMPTS, BOT_RESPONSES } from './data/chats.js';

class LoveeezDatingApp {
  constructor() {
    this.storageKey = 'loveeez_dating_state_v1';
    this.initState();
    this.initDOM();
    this.bindEvents();
    this.renderAll();
  }

  // --------------------------------------------------------------------------
  // STATE INITIALIZATION & LOCALSTORAGE SYNC
  // --------------------------------------------------------------------------
  initState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.user = parsed.user || this.getDefaultUser();
        this.matches = parsed.matches || INITIAL_MATCHES;
        this.chats = parsed.chats || INITIAL_MESSAGES;
        this.swiped = parsed.swiped || {}; // profileId -> 'like' | 'pass' | 'superlike'
        this.activeFilter = parsed.activeFilter || 'all';
      } catch (e) {
        this.resetDefaultState();
      }
    } else {
      this.resetDefaultState();
    }

    this.activeTab = 'discover';
    this.activeChatId = this.matches.length > 0 ? this.matches[0].profileId : null;
    this.dragState = {
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      cardEl: null
    };
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
      name: "Armaan",
      age: 23,
      city: "Tokyo",
      bio: "Coffee enthusiast, music lover, and exploring cozy city corners ☕✨",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      isLoggedIn: true,
      island: "pinky"
    };
  }

  saveState() {
    const data = {
      user: this.user,
      matches: this.matches,
      chats: this.chats,
      swiped: this.swiped,
      activeFilter: this.activeFilter
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // --------------------------------------------------------------------------
  // DOM ELEMENT REFERENCES
  // --------------------------------------------------------------------------
  initDOM() {
    // Navigation Tabs
    this.tabButtons = document.querySelectorAll('[data-tab-target]');
    this.tabPanes = document.querySelectorAll('.tab-pane');
    this.matchesBadge = document.getElementById('matchesBadge');
    
    // Header controls
    this.userAvatarBtn = document.getElementById('userAvatarBtn');
    this.headerUserAvatar = document.getElementById('headerUserAvatar');
    this.headerGoogleBtn = document.getElementById('headerGoogleBtn');
    
    // Deck elements
    this.deckStage = document.getElementById('deckStage');
    this.islandFilterBar = document.getElementById('islandFilterBar');
    this.btnRewind = document.getElementById('btnRewind');
    this.btnPass = document.getElementById('btnPass');
    this.btnSuperlike = document.getElementById('btnSuperlike');
    this.btnLike = document.getElementById('btnLike');
    this.btnInfo = document.getElementById('btnInfo');

    // Chat elements
    this.newMatchesRow = document.getElementById('newMatchesRow');
    this.chatThreadsList = document.getElementById('chatThreadsList');
    this.chatPane = document.getElementById('chatPane');
    this.chatPartnerAvatar = document.getElementById('chatPartnerAvatar');
    this.chatPartnerName = document.getElementById('chatPartnerName');
    this.chatMessagesArea = document.getElementById('chatMessagesArea');
    this.icebreakerDrawer = document.getElementById('icebreakerDrawer');
    this.chatInput = document.getElementById('chatInput');
    this.chatSendBtn = document.getElementById('chatSendBtn');

    // Modals
    this.matchModal = document.getElementById('matchModal');
    this.matchPartnerAvatar = document.getElementById('matchPartnerAvatar');
    this.matchPartnerName = document.getElementById('matchPartnerName');
    this.matchChatBtn = document.getElementById('matchChatBtn');
    this.matchKeepBtn = document.getElementById('matchKeepBtn');

    this.googleModal = document.getElementById('googleModal');
    this.googleSignInBtn = document.getElementById('googleSignInBtn');

    this.profileModal = document.getElementById('profileModal');
    this.profileModalBody = document.getElementById('profileModalBody');
  }

  // --------------------------------------------------------------------------
  // EVENT BINDINGS
  // --------------------------------------------------------------------------
  bindEvents() {
    // Tab switching
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tabTarget;
        this.switchTab(target);
      });
    });

    // Deck action buttons
    this.btnPass.addEventListener('click', () => this.swipeTopCard('pass'));
    this.btnLike.addEventListener('click', () => this.swipeTopCard('like'));
    this.btnSuperlike.addEventListener('click', () => this.swipeTopCard('superlike'));
    this.btnRewind.addEventListener('click', () => this.rewindLastSwipe());
    this.btnInfo.addEventListener('click', () => this.showCurrentCardDetails());

    // Keyboard controls (Arrow keys)
    window.addEventListener('keydown', (e) => {
      if (this.activeTab !== 'discover' || document.activeElement.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') this.swipeTopCard('pass');
      if (e.key === 'ArrowRight') this.swipeTopCard('like');
      if (e.key === 'ArrowUp') this.swipeTopCard('superlike');
      if (e.key === 'ArrowDown') this.rewindLastSwipe();
      if (e.key === ' ') {
        e.preventDefault();
        this.showCurrentCardDetails();
      }
    });

    // Chat sending
    this.chatSendBtn.addEventListener('click', () => this.sendMessage());
    this.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Header & Google Auth
    this.userAvatarBtn.addEventListener('click', () => this.switchTab('profile'));
    this.headerGoogleBtn.addEventListener('click', () => this.openGoogleModal());
    this.googleSignInBtn.addEventListener('click', () => this.completeGoogleAuth());

    // Match Modal actions
    this.matchKeepBtn.addEventListener('click', () => this.closeModals());
    this.matchChatBtn.addEventListener('click', () => {
      this.closeModals();
      this.switchTab('chats');
    });

    // Modal Close buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => this.closeModals());
    });
  }

  // --------------------------------------------------------------------------
  // TAB NAVIGATION
  // --------------------------------------------------------------------------
  switchTab(tabId) {
    this.activeTab = tabId;
    this.tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tabTarget === tabId);
    });
    this.tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === `${tabId}Tab`);
    });

    if (tabId === 'chats') {
      this.renderChatsView();
    } else if (tabId === 'discover') {
      this.renderDeck();
    }
  }

  // --------------------------------------------------------------------------
  // DECK & CARD SWIPING LOGIC
  // --------------------------------------------------------------------------
  getActiveDeck() {
    return PROFILES.filter(p => {
      // Must not be already swiped
      if (this.swiped[p.id]) return false;
      // Filter by island
      if (this.activeFilter !== 'all' && p.island !== this.activeFilter) return false;
      return true;
    });
  }

  renderDeck() {
    this.renderIslandFilters();
    const deck = this.getActiveDeck();
    this.deckStage.innerHTML = '';

    if (deck.length === 0) {
      this.deckStage.innerHTML = `
        <div class="deck-empty">
          <div class="empty-blob">🌸</div>
          <h3>You're All Caught Up!</h3>
          <p>There are no more profiles in this island right now. Try switching islands or check back later!</p>
          <button class="pill-btn pill-primary" id="btnResetDeck">↺ Reset Swipes</button>
        </div>
      `;
      const resetBtn = document.getElementById('btnResetDeck');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.swiped = {};
          this.saveState();
          this.renderDeck();
        });
      }
      return;
    }

    // Render up to 3 cards for performance and 3D stacking
    const topThree = deck.slice(0, 3);
    topThree.reverse().forEach((profile, index) => {
      const cardEl = this.createCardElement(profile, index, topThree.length);
      this.deckStage.appendChild(cardEl);
    });

    // Setup drag events on the top-most card
    const topCardEl = this.deckStage.lastElementChild;
    if (topCardEl) {
      this.attachDragEvents(topCardEl);
    }
  }

  renderIslandFilters() {
    this.islandFilterBar.innerHTML = '';
    ISLANDS.forEach(island => {
      const btn = document.createElement('button');
      btn.className = `filter-pill ${this.activeFilter === island.id ? 'active' : ''}`;
      btn.innerHTML = `<span>${island.emoji}</span> <span>${island.name}</span>`;
      btn.addEventListener('click', () => {
        this.activeFilter = island.id;
        this.saveState();
        this.renderDeck();
      });
      this.islandFilterBar.appendChild(btn);
    });
  }

  createCardElement(profile, reverseIndex, totalCount) {
    const isTop = reverseIndex === totalCount - 1;
    const isSecond = reverseIndex === totalCount - 2;
    const isThird = reverseIndex === totalCount - 3;

    const card = document.createElement('div');
    card.className = `swipe-card ${isSecond ? 'is-second' : ''} ${isThird ? 'is-third' : ''}`;
    card.dataset.profileId = profile.id;

    card.innerHTML = `
      <div class="card-media">
        <img src="${profile.photos[0]}" alt="${profile.name}">
        <div class="card-island-badge">${profile.islandName}</div>
        <div class="card-compat-badge">💖 ${profile.compatibility}% Match</div>
        
        <!-- Action stamps -->
        <div class="card-stamp stamp-like">LIKE</div>
        <div class="card-stamp stamp-nope">NOPE</div>
        <div class="card-stamp stamp-super">SUPER LIKE</div>
      </div>

      <div class="card-details">
        <div>
          <div class="card-title-row">
            <div>
              <span class="card-name">${profile.name}</span>
              <span class="card-age">${profile.age}</span>
              ${profile.verified ? '<span class="verified-icon" title="Verified Profile">✓</span>' : ''}
            </div>
          </div>
          <div class="card-subtitle">📍 ${profile.city} · ${profile.occupation}</div>
          <p class="card-bio">${profile.bio}</p>
        </div>

        <div>
          <div class="card-tags">
            ${profile.tags.slice(0, 3).map(tag => `<span class="interest-tag">${tag}</span>`).join('')}
          </div>
          <div class="card-prompt-bubble">
            <strong>${profile.prompts[0].question}</strong>
            <span>"${profile.prompts[0].answer}"</span>
          </div>
        </div>
      </div>
    `;

    return card;
  }

  // --------------------------------------------------------------------------
  // DRAG & GESTURE SYSTEM
  // --------------------------------------------------------------------------
  attachDragEvents(cardEl) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    const stampLike = cardEl.querySelector('.stamp-like');
    const stampNope = cardEl.querySelector('.stamp-nope');
    const stampSuper = cardEl.querySelector('.stamp-super');

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

      // Dynamic stamp opacity
      if (currentX > 30) {
        stampLike.style.opacity = Math.min((currentX - 30) / 90, 1);
        stampNope.style.opacity = 0;
        stampSuper.style.opacity = 0;
      } else if (currentX < -30) {
        stampNope.style.opacity = Math.min((Math.abs(currentX) - 30) / 90, 1);
        stampLike.style.opacity = 0;
        stampSuper.style.opacity = 0;
      } else if (currentY < -40) {
        stampSuper.style.opacity = Math.min((Math.abs(currentY) - 40) / 80, 1);
        stampLike.style.opacity = 0;
        stampNope.style.opacity = 0;
      } else {
        stampLike.style.opacity = 0;
        stampNope.style.opacity = 0;
        stampSuper.style.opacity = 0;
      }
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      cardEl.style.transition = 'transform 0.25s var(--ease-smooth), opacity 0.2s ease';

      const threshold = 110;
      if (currentX > threshold) {
        this.executeSwipe(cardEl, 'like');
      } else if (currentX < -threshold) {
        this.executeSwipe(cardEl, 'pass');
      } else if (currentY < -threshold) {
        this.executeSwipe(cardEl, 'superlike');
      } else {
        // Snap back
        cardEl.style.transform = '';
        stampLike.style.opacity = 0;
        stampNope.style.opacity = 0;
        stampSuper.style.opacity = 0;
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
    const topCardEl = this.deckStage.lastElementChild;
    if (!topCardEl || !topCardEl.classList.contains('swipe-card')) return;
    this.executeSwipe(topCardEl, action);
  }

  executeSwipe(cardEl, action) {
    const profileId = cardEl.dataset.profileId;
    const profile = PROFILES.find(p => p.id === profileId);

    // Apply swipe exit animation
    if (action === 'like') {
      cardEl.style.transform = `translate3d(${window.innerWidth + 200}px, 50px, 0) rotate(35deg)`;
    } else if (action === 'pass') {
      cardEl.style.transform = `translate3d(-${window.innerWidth + 200}px, 50px, 0) rotate(-35deg)`;
    } else if (action === 'superlike') {
      cardEl.style.transform = `translate3d(0, -${window.innerHeight + 200}px, 0) scale(1.1)`;
    }
    cardEl.style.opacity = '0';

    this.swiped[profileId] = action;
    this.lastSwipedId = profileId;

    // Check for match (like or superlike)
    if (action === 'like' || action === 'superlike') {
      this.triggerMatch(profile);
    } else {
      this.saveState();
    }

    setTimeout(() => {
      this.renderDeck();
    }, 250);
  }

  rewindLastSwipe() {
    if (!this.lastSwipedId) return;
    delete this.swiped[this.lastSwipedId];
    this.lastSwipedId = null;
    this.saveState();
    this.renderDeck();
  }

  triggerMatch(profile) {
    // Add to matches if not already present
    const exists = this.matches.some(m => m.profileId === profile.id);
    if (!exists) {
      this.matches.unshift({
        profileId: profile.id,
        matchedAt: "Just now",
        unread: true,
        lastMessage: profile.initialMessage
      });

      // Initialize initial conversation message
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
      this.updateMatchesBadge();
    }

    // Show Match Celebration Modal
    this.matchPartnerAvatar.src = profile.photos[0];
    this.matchPartnerName.textContent = profile.name;
    this.activeChatId = profile.id;
    this.matchModal.classList.add('active');
  }

  updateMatchesBadge() {
    const unreadCount = this.matches.filter(m => m.unread).length;
    if (unreadCount > 0) {
      this.matchesBadge.textContent = unreadCount;
      this.matchesBadge.style.display = 'inline-block';
    } else {
      this.matchesBadge.style.display = 'none';
    }
  }

  // --------------------------------------------------------------------------
  // CHAT & MESSAGING ENGINE
  // --------------------------------------------------------------------------
  renderChatsView() {
    this.updateMatchesBadge();
    this.renderNewMatchesRow();
    this.renderChatThreads();
    this.renderActiveConversation();
  }

  renderNewMatchesRow() {
    this.newMatchesRow.innerHTML = '';
    this.matches.forEach(match => {
      const profile = PROFILES.find(p => p.id === match.profileId);
      if (!profile) return;

      const item = document.createElement('div');
      item.className = 'new-match-avatar';
      item.innerHTML = `
        <img src="${profile.avatar}" alt="${profile.name}">
        <span class="new-match-name">${profile.name}</span>
      `;
      item.addEventListener('click', () => {
        this.selectChat(profile.id);
      });
      this.newMatchesRow.appendChild(item);
    });
  }

  renderChatThreads() {
    this.chatThreadsList.innerHTML = '';
    this.matches.forEach(match => {
      const profile = PROFILES.find(p => p.id === match.profileId);
      if (!profile) return;

      const isActive = this.activeChatId === profile.id;
      const thread = document.createElement('div');
      thread.className = `chat-thread-item ${isActive ? 'active' : ''}`;
      thread.innerHTML = `
        <div class="thread-avatar">
          <img src="${profile.avatar}" alt="${profile.name}">
          ${match.unread ? '<div class="thread-unread-dot"></div>' : ''}
        </div>
        <div class="thread-info">
          <div class="thread-top">
            <span class="thread-name">${profile.name}</span>
            <span class="thread-time">${match.matchedAt}</span>
          </div>
          <p class="thread-preview">${match.lastMessage || 'New connection!'}</p>
        </div>
      `;

      thread.addEventListener('click', () => {
        match.unread = false;
        this.saveState();
        this.selectChat(profile.id);
      });

      this.chatThreadsList.appendChild(thread);
    });
  }

  selectChat(profileId) {
    this.activeChatId = profileId;
    this.renderChatsView();
  }

  renderActiveConversation() {
    if (!this.activeChatId) {
      this.chatPartnerName.textContent = "Select a Match";
      this.chatMessagesArea.innerHTML = `<div style="text-align:center; padding:3rem; color:var(--muted-ink);">Select a connection to start chatting! 💬</div>`;
      return;
    }

    const profile = PROFILES.find(p => p.id === this.activeChatId);
    if (!profile) return;

    this.chatPartnerAvatar.src = profile.avatar;
    this.chatPartnerName.textContent = profile.name;

    const messages = this.chats[profile.id] || [];
    this.chatMessagesArea.innerHTML = '';

    messages.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = `message-bubble ${msg.sender}`;
      bubble.innerHTML = `
        <div>${msg.text}</div>
        <div class="message-time">${msg.time}</div>
      `;
      this.chatMessagesArea.appendChild(bubble);
    });

    // Render Icebreakers
    this.icebreakerDrawer.innerHTML = '';
    ICEBREAKER_PROMPTS.forEach(prompt => {
      const chip = document.createElement('button');
      chip.className = 'icebreaker-chip';
      chip.textContent = prompt;
      chip.addEventListener('click', () => {
        this.sendMessage(prompt);
      });
      this.icebreakerDrawer.appendChild(chip);
    });

    // Auto scroll to bottom
    this.chatMessagesArea.scrollTop = this.chatMessagesArea.scrollHeight;
  }

  sendMessage(customText = null) {
    const text = customText || this.chatInput.value.trim();
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

    // Update match last message
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
    // Show typing indicator
    const typingEl = document.createElement('div');
    typingEl.className = 'typing-indicator';
    typingEl.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    this.chatMessagesArea.appendChild(typingEl);
    this.chatMessagesArea.scrollTop = this.chatMessagesArea.scrollHeight;

    setTimeout(() => {
      typingEl.remove();
      const responses = BOT_RESPONSES[profileId] || [
        "That's so lovely! I'd love to hear more about that 🌸",
        "Haha totally agree! What else are you up to today?",
        "Aw that sounds wonderful! ✨"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const botMsg = {
        id: `msg-${Date.now()}`,
        sender: "them",
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      this.chats[profileId].push(botMsg);
      const match = this.matches.find(m => m.profileId === profileId);
      if (match) {
        match.lastMessage = randomResponse;
      }
      this.saveState();
      this.renderActiveConversation();
      this.renderChatThreads();
    }, 1200);
  }

  // --------------------------------------------------------------------------
  // GOOGLE AUTHENTICATION SIMULATION
  // --------------------------------------------------------------------------
  openGoogleModal() {
    this.googleModal.classList.add('active');
  }

  completeGoogleAuth() {
    this.user = {
      name: "Armaan Yadav",
      email: "armaan123009@gmail.com",
      city: "Tokyo",
      bio: "Software creator & music lover. Verified Google User ✨",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      isLoggedIn: true,
      island: "pinky"
    };
    this.saveState();
    this.closeModals();
    this.renderHeader();
    this.renderProfileView();
    alert("🎉 Successfully signed in with Google! Your profile is verified.");
  }

  // --------------------------------------------------------------------------
  // PROFILE DETAILS MODAL
  // --------------------------------------------------------------------------
  showCurrentCardDetails() {
    const deck = this.getActiveDeck();
    if (deck.length === 0) return;
    const profile = deck[0];

    this.profileModalBody.innerHTML = `
      <div style="text-align: left; display: flex; flex-direction: column; gap: 1rem;">
        <img src="${profile.photos[0]}" style="width:100%; height:320px; object-fit:cover; border-radius:1.5rem; border:2px solid var(--ink);" alt="${profile.name}">
        <div>
          <h2 style="font-family: var(--font-display); font-size: 2.2rem; color: var(--ink);">${profile.name}, ${profile.age} ${profile.verified ? '✓' : ''}</h2>
          <p style="color: var(--muted-ink); font-weight:700;">📍 ${profile.city} · ${profile.occupation}</p>
        </div>
        <div style="background:var(--surface-pink); padding:1rem; border-radius:1rem; border:2px solid var(--ink);">
          <strong style="display:block; font-family:var(--font-label); margin-bottom:0.25rem;">About Me</strong>
          <p>${profile.bio}</p>
        </div>
        <div>
          <strong style="display:block; font-family:var(--font-label); margin-bottom:0.4rem;">Prompts</strong>
          ${profile.prompts.map(p => `
            <div style="background:var(--surface-yellow); padding:0.85rem; border-radius:1rem; border:2px solid var(--ink); margin-bottom:0.6rem;">
              <strong>${p.question}</strong>
              <p style="margin-top:0.2rem;">"${p.answer}"</p>
            </div>
          `).join('')}
        </div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          ${profile.tags.map(t => `<span class="interest-tag">${t}</span>`).join('')}
        </div>
      </div>
    `;
    this.profileModal.classList.add('active');
  }

  // --------------------------------------------------------------------------
  // USER PROFILE & SETTINGS VIEW
  // --------------------------------------------------------------------------
  renderProfileView() {
    const profileAvatar = document.getElementById('profileAvatarImg');
    const profileName = document.getElementById('profileDisplayName');
    const profileEmail = document.getElementById('profileDisplayEmail');
    const profileBioInput = document.getElementById('profileBioInput');
    const profileCityInput = document.getElementById('profileCityInput');
    const saveProfileBtn = document.getElementById('saveProfileBtn');

    if (profileAvatar) profileAvatar.src = this.user.avatar;
    if (profileName) profileName.textContent = this.user.name;
    if (profileEmail) profileEmail.textContent = this.user.email || 'armaan123009@gmail.com';
    if (profileBioInput) profileBioInput.value = this.user.bio;
    if (profileCityInput) profileCityInput.value = this.user.city;

    if (saveProfileBtn) {
      saveProfileBtn.onclick = () => {
        this.user.bio = profileBioInput.value;
        this.user.city = profileCityInput.value;
        this.saveState();
        alert("✨ Profile updated successfully!");
      };
    }
  }

  // --------------------------------------------------------------------------
  // RENDER APP
  // --------------------------------------------------------------------------
  renderHeader() {
    if (this.headerUserAvatar) this.headerUserAvatar.src = this.user.avatar;
  }

  closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  }

  renderAll() {
    this.renderHeader();
    this.renderDeck();
    this.renderChatsView();
    this.renderProfileView();
  }
}

// Instantiate on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  window.loveeezApp = new LoveeezDatingApp();
});
