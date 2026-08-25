/* ── PORTFOLIO CHATBOT SCRIPT ── */

document.addEventListener('DOMContentLoaded', () => {
  // 1. INJECT CHATBOT DOM STRUCTURE
  const chatbotRoot = document.createElement('div');
  chatbotRoot.id = 'portfolio-chatbot-root';
  chatbotRoot.innerHTML = `
    <!-- Floating Trigger Button -->
    <button class="chatbot-toggle" id="chatbot-toggle" aria-label="Open Chat Assistant">
      <svg id="chat-icon-open" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        <circle cx="8" cy="10" r="2"/>
        <circle cx="12" cy="10" r="2"/>
        <circle cx="16" cy="10" r="2"/>
      </svg>
    </button>

    <!-- Chatbot Window -->
    <div class="chatbot-window" id="chatbot-window">
      <!-- Header -->
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">🤖</div>
          <div class="chatbot-title">
            <h4>Hampanna's Assistant</h4>
            <span>AI Bot • Online</span>
          </div>
        </div>
        <button class="chatbot-close" id="chatbot-close" aria-label="Close Chat Window">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Messages Area -->
      <div class="chatbot-messages" id="chatbot-messages">
        <!-- Messages will be appended dynamically here -->
      </div>

      <!-- Quick Replies -->
      <div class="chatbot-quick-replies" id="chatbot-quick-replies">
        <!-- Pills will be appended dynamically here -->
      </div>

      <!-- Input Footer -->
      <div class="chatbot-footer">
        <div class="chatbot-input-wrapper">
          <input type="text" class="chatbot-input" id="chatbot-input" placeholder="Type a message..." autocomplete="off">
        </div>
        <button class="chatbot-send" id="chatbot-send" aria-label="Send Message">
          <svg viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(chatbotRoot);

  // 2. ELEMENT REFERENCES
  const toggleBtn = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const chatWindow = document.getElementById('chatbot-window');
  const messagesContainer = document.getElementById('chatbot-messages');
  const quickRepliesContainer = document.getElementById('chatbot-quick-replies');
  const chatInput = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');

  // 3. DIALOG DATABASE
  const responses = {
    greeting: {
      text: "Hello! 👋 I'm Hampanna's assistant. I can tell you about his projects, skills, experience, or how to get in touch. What would you like to explore?",
      replies: ["🚀 View Projects", "🛠️ Core Skills", "💼 Experience", "📧 Contact Info"]
    },
    projects: {
      text: "Six featured projects, picked for range rather than volume:<br><br>📈 <strong>AI Stock Prediction</strong>: LSTM model forecasting next-day close, baselined against a Random Forest first.<br>🎫 <strong>Help Desk MCP Server</strong>: A ticketing system exposed as both MCP tools and a REST API.<br>⚡ <strong>VoltFlow</strong>: An enterprise booking platform with real domain modeling (Next.js + Prisma + Postgres).<br>🧭 <strong>GitMCP Studio</strong>: A dashboard that auto-generates UI from any MCP server's schema.<br>🖥️ <strong>Monitor Agent</strong>: A CPU/RAM/disk watchdog with a dry-run-safe design.<br>👔 <strong>Employee Management System</strong>: Java/Spring Boot/Hibernate — his Java Full Stack track.<br><br>Which one do you want details on?",
      replies: ["📈 Stock Prediction", "🎫 Help Desk MCP", "⚡ VoltFlow", "🧭 GitMCP Studio", "🖥️ Monitor Agent"]
    },
    stock: {
      text: "📈 <strong>AI Stock Prediction System</strong>:<br>• A two-layer LSTM (64→32 units) forecasting next-day closing price from 15 engineered features (RSI, MACD, EMAs, lagged returns).<br>• Uses EarlyStopping and ReduceLROnPlateau instead of a fixed epoch count.<br>• Before committing to the LSTM, he baselined a Random Forest on the same data to justify the architecture choice.<br>• Served through a Streamlit dashboard. Code on <a href='https://github.com/hampannagouda/ai-stock-prediction' target='_blank'>GitHub ↗</a>",
      replies: ["🎫 Help Desk MCP", "⚡ VoltFlow", "🛠️ Core Skills", "📧 Contact Info"]
    },
    helpdesk: {
      text: "🎫 <strong>Help Desk Ticket MCP Server</strong>:<br>• An IT ticketing system exposed two ways from one codebase: as <strong>MCP tools</strong> for AI assistants (Claude/Gemini), and as a <strong>FastAPI REST API</strong> for regular clients.<br>• Spec'd with design and requirements docs before the implementation existed.<br>• His most recent build — actively being extended. Code on <a href='https://github.com/hampannagouda/helpdesk-mcp' target='_blank'>GitHub ↗</a>",
      replies: ["🧭 GitMCP Studio", "📈 Stock Prediction", "🛠️ Core Skills", "📧 Contact Info"]
    },
    voltflow: {
      text: "⚡ <strong>VoltFlow — Service Booking Platform</strong>:<br>• An enterprise-style booking &amp; dispatch platform: 7 related entities (User, Technician, Service, Booking, Invoice, Review, SlotAvailability), not a flat CRUD table.<br>• Next.js 15 client, TypeScript/Express API with JWT + role-based access, PostgreSQL via Prisma, Jest/Supertest tests, all containerized with Docker Compose.<br>• His most production-shaped full-stack project. Code on <a href='https://github.com/hampannagouda/voltflow' target='_blank'>GitHub ↗</a>",
      replies: ["🎫 Help Desk MCP", "👔 Employee Mgmt", "🛠️ Core Skills", "📧 Contact Info"]
    },
    gitmcp: {
      text: "🧭 <strong>GitMCP Studio</strong>:<br>• A dashboard that introspects any MCP server's JSON Schema and auto-generates the UI to run its tools.<br>• Ships with an AI chatbot that falls back across Gemini model tiers automatically on rate limits.<br>• Code on <a href='https://github.com/hampannagouda/git-mcp' target='_blank'>GitHub ↗</a>",
      replies: ["🖥️ Monitor Agent", "🎫 Help Desk MCP", "🛠️ Core Skills", "📧 Contact Info"]
    },
    monitor: {
      text: "🖥️ <strong>Monitor Agent</strong>:<br>• A CPU/RAM/disk monitoring agent with a Flask dashboard.<br>• Dry-run mode is the <em>default</em> — live process termination is explicit opt-in, and critical system processes are protected from being killed.<br>• Code on <a href='https://github.com/hampannagouda/Monitor-agent' target='_blank'>GitHub ↗</a>",
      replies: ["👔 Employee Mgmt", "⚡ VoltFlow", "🛠️ Core Skills", "📧 Contact Info"]
    },
    ems: {
      text: "👔 <strong>Employee Management System</strong>:<br>• A layered Spring Boot + Hibernate + MySQL CRUD system — REST controllers, a service layer, JPA repositories.<br>• The clearest example of his Java Full Stack training at JSpiders.<br>• Code on <a href='https://github.com/hampannagouda/employee-management-system' target='_blank'>GitHub ↗</a>",
      replies: ["🚀 View Projects", "🛠️ Core Skills", "📧 Contact Info"]
    },
    skills: {
      text: "Hampanna's skills span a few domains:<br><br>💻 <strong>Languages</strong>: Java, Python, TypeScript, JavaScript, SQL, C++<br>🤖 <strong>AI, Agents &amp; ML</strong>: Model Context Protocol, Claude &amp; Gemini APIs, TensorFlow/Keras, Scikit-learn, YOLOv8, OpenCV<br>🧱 <strong>Backend &amp; Full-Stack</strong>: Spring Boot, Hibernate, FastAPI, Flask, Node.js/Express, Next.js, React<br>🗄️ <strong>Data &amp; Infra</strong>: PostgreSQL, MySQL, MongoDB, Prisma, Docker, Docker Compose, AWS EC2<br>🌱 <strong>Currently exploring</strong>: Kubernetes, Argo CD, Terraform, Vertex AI",
      replies: ["🚀 View Projects", "💼 Experience", "📧 Contact Info"]
    },
    experience: {
      text: "💼 <strong>Current &amp; past roles</strong>:<br>• <strong>Software Engineering Intern @ Unisys</strong> (Apr 2026–Present) — enterprise software development and workflows.<br>• <strong>Java Full Stack Developer Intern @ JSpiders</strong> (Feb–Apr 2026) — backend, databases, REST APIs, deployment.<br>• <strong>B.Tech CSE @ Dayananda Sagar University</strong> — graduated 2026.",
      replies: ["🚀 View Projects", "🛠️ Core Skills", "📧 Contact Info"]
    },
    contact: {
      text: "Here's how to reach Hampanna:<br><br>📧 <strong>Email</strong>: <a href='mailto:hampannagouda18@gmail.com'>hampannagouda18@gmail.com</a><br>💼 <strong>LinkedIn</strong>: <a href='https://www.linkedin.com/in/hampanna-gouda-39518b25a/' target='_blank'>Hampanna Gouda ↗</a><br>🐙 <strong>GitHub</strong>: <a href='https://github.com/hampannagouda' target='_blank'>hampannagouda ↗</a><br>⚡ <strong>LeetCode</strong>: <a href='https://leetcode.com/hampu_/' target='_blank'>hampu_ ↗</a><br><br>He's open to full-time software engineering roles and responds to every message.",
      replies: ["🚀 View Projects", "🛠️ Core Skills", "💼 Experience"]
    },
    fallback: {
      text: "I'm not sure I caught that. 🤖 I can answer questions about Hampanna's projects, skills, experience, and contact info — try the quick options below, or type something like 'MCP', 'LSTM', 'VoltFlow', or 'email'.",
      replies: ["🚀 View Projects", "🛠️ Core Skills", "💼 Experience", "📧 Contact Info"]
    }
  };

  let isInitialized = false;

  // 4. CHAT LOGIC FUNCTIONS

  // Toggle chat window open/close
  function toggleChat() {
    const isOpen = chatWindow.classList.toggle('open');
    toggleBtn.classList.toggle('open', isOpen);
    
    // Auto focus input on desktop when opening
    if (isOpen) {
      if (window.innerWidth > 768) {
        chatInput.focus();
      }
      
      // Send greeting on first open
      if (!isInitialized) {
        isInitialized = true;
        simulateBotResponse(responses.greeting);
      }
    }
  }

  // Append a message bubble to the chat container
  function appendMessage(sender, text) {
    const msgElement = document.createElement('div');
    msgElement.className = `chatbot-msg ${sender}`;
    msgElement.innerHTML = text;
    messagesContainer.appendChild(msgElement);
    scrollToBottom();
    
    // Wire custom cursor support for new links in messages
    if (sender === 'bot') {
      setupCursorInteractions(msgElement);
    }
  }

  // Scroll messages container to bottom
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Show dynamic typing indicator
  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'chatbot-msg bot chatbot-typing';
    indicator.id = 'chatbot-typing-indicator';
    indicator.innerHTML = `
      <div class="chatbot-typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    messagesContainer.appendChild(indicator);
    scrollToBottom();
  }

  // Hide dynamic typing indicator
  function hideTypingIndicator() {
    const indicator = document.getElementById('chatbot-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // Populate quick reply pills
  function renderQuickReplies(replies) {
    quickRepliesContainer.innerHTML = '';
    replies.forEach(replyText => {
      const pill = document.createElement('button');
      pill.className = 'chatbot-pill';
      pill.textContent = replyText;
      pill.addEventListener('click', () => handleUserInput(replyText));
      quickRepliesContainer.appendChild(pill);
    });
    setupCursorInteractions(quickRepliesContainer);
  }

  // Simulate bot writing message with typing delay
  function simulateBotResponse(responseObject) {
    showTypingIndicator();
    // Hide quick replies while bot is typing to keep clean UX
    quickRepliesContainer.style.opacity = '0.3';
    quickRepliesContainer.style.pointerEvents = 'none';

    // Calculate dynamic delay based on length of response to make it feel natural
    const baseDelay = 600;
    const charDelay = Math.min(responseObject.text.length * 3, 1000);
    const totalDelay = baseDelay + charDelay;

    setTimeout(() => {
      hideTypingIndicator();
      appendMessage('bot', responseObject.text);
      renderQuickReplies(responseObject.replies);
      quickRepliesContainer.style.opacity = '1';
      quickRepliesContainer.style.pointerEvents = 'all';
    }, totalDelay);
  }

  // Match user queries to pre-defined responses using keyword clustering
  function getMatchResponse(query) {
    const q = query.toLowerCase().trim();

    if (/\b(hello|hi|hey|greetings|yo|welcome)\b/.test(q)) {
      return responses.greeting;
    }
    if (/\b(stock|prediction|lstm|market|prices|shares|random forest)\b/.test(q)) {
      return responses.stock;
    }
    if (/\b(help ?desk|ticket|mcp server|fastmcp|claude|gemini)\b/.test(q)) {
      return responses.helpdesk;
    }
    if (/\b(voltflow|booking|electrical|prisma|technician|invoice)\b/.test(q)) {
      return responses.voltflow;
    }
    if (/\b(gitmcp|git-mcp|git mcp|schema|dashboard studio)\b/.test(q)) {
      return responses.gitmcp;
    }
    if (/\b(monitor|monitoring|cpu|ram|disk|psutil|watchdog)\b/.test(q)) {
      return responses.monitor;
    }
    if (/\b(employee|spring boot|hibernate|jpa|ems)\b/.test(q)) {
      return responses.ems;
    }
    if (/\b(project|projects|work|portfolio|build|developed|mcp)\b/.test(q)) {
      return responses.projects;
    }
    if (/\b(skills|skill|technologies|languages|stack|frameworks|arsenal|tools)\b/.test(q)) {
      return responses.skills;
    }
    if (/\b(why hire|hire hampanna|experience|background|who is|unisys|jspiders|internship)\b/.test(q)) {
      return responses.experience;
    }
    if (/\b(contact|email|reach|hire|message|socials|linkedin|github|leetcode|phone)\b/.test(q)) {
      return responses.contact;
    }
    if (/\b(resume|cv|education|university|degree|college|dsu|dayananda)\b/.test(q)) {
      return responses.experience;
    }

    return responses.fallback;
  }

  // Handle standard user action (typing or clicking a pill)
  function handleUserInput(text) {
    if (!text.trim()) return;

    // Show user message bubble
    appendMessage('user', text);
    chatInput.value = '';

    // Match query and trigger typing simulation
    const matchedResponse = getMatchResponse(text);
    simulateBotResponse(matchedResponse);
  }

  // 5. EVENT LISTENERS
  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  sendBtn.addEventListener('click', () => {
    handleUserInput(chatInput.value);
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleUserInput(chatInput.value);
    }
  });

  // 6. CUSTOM CURSOR SUPPORT WIRING
  function setupCursorInteractions(container) {
    const cur = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (!cur || !ring) return; // Safely skip if not active (like in index_latest.html)

    container.querySelectorAll('a, button, .chatbot-pill, .chatbot-toggle').forEach(el => {
      // Prevent double-binding cursor scaling
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = 'true';

      el.addEventListener('mouseenter', () => {
        cur.style.transform = 'translate(-50%,-50%) scale(2)';
        ring.style.width = '55px';
        ring.style.height = '55px';
      });
      el.addEventListener('mouseleave', () => {
        cur.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.width = '36px';
        ring.style.height = '36px';
      });
    });
  }

  // Initial cursor hook for triggers
  setupCursorInteractions(chatbotRoot);
});
