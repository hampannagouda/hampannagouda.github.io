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
      text: "Hello! 👋 I'm Hampanna's AI Assistant. I can tell you about his skills, projects, learning journey, or how to get in touch. What would you like to explore?",
      replies: ["🚀 View Projects", "🛠️ Core Skills", "📧 Contact Info", "🌟 Why Hire?"]
    },
    projects: {
      text: "Hampanna has built several impressive projects across AI/ML, DevOps, and Full Stack development:<br><br>📈 <strong>Stock Price Prediction</strong>: An LSTM model forecasting stock values with a Streamlit dashboard.<br>🐳 <strong>CI/CD Web Pipeline</strong>: Automating code builds and deployment with Docker & Jenkins.<br>☸️ <strong>Kubernetes Microservices</strong>: Orchestrating containerized services with Helm and local clusters.<br>☁️ <strong>Terraform IaC</strong>: Automating AWS resources (EC2, S3, IAM) with modular scripting.<br>🛒 <strong>MERN E-Commerce App</strong>: Flipkart-like app featuring JWT Auth and MongoDB.<br><br>Which project details would you like to see?",
      replies: ["📈 Stock Prediction", "🐳 CI/CD Pipeline", "☸️ Kubernetes", "☁️ Terraform IaC", "🛒 E-Commerce"]
    },
    stock: {
      text: "📈 <strong>Stock Price Prediction System</strong>:<br>• Built using <strong>Python, LSTM (Deep Learning), Pandas, NumPy, and Streamlit</strong>.<br>• Integrates real-time market data and technical indicators.<br>• Features interactive visualizations to display trend lines and risk parameters.<br>• Codebase available on <a href='https://github.com/hampannagouda' target='_blank'>GitHub ↗</a>",
      replies: ["🐳 CI/CD Pipeline", "☸️ Kubernetes", "🛠️ Core Skills", "📧 Contact Info"]
    },
    cicd: {
      text: "🐳 <strong>Dockerized Web App + CI/CD Pipeline</strong>:<br>• Implemented containerized deployment protocols using <strong>Docker</strong> and <strong>Docker Compose</strong>.<br>• Built a fully automated <strong>Jenkins CI/CD pipeline</strong> to run unit tests and push clean builds to production.<br>• Integrated GitHub Actions for automated linting.<br>• Codebase available on <a href='https://github.com/hampannagouda' target='_blank'>GitHub ↗</a>",
      replies: ["☸️ Kubernetes", "☁️ Terraform IaC", "🛠️ Core Skills", "📧 Contact Info"]
    },
    k8s: {
      text: "☸ <strong>Kubernetes Deployment Project</strong>:<br>• Designed multi-container pod deployments on a local Kubernetes cluster.<br>• Managed networking, DNS service discovery, cluster auto-scaling, and rolling updates.<br>• Configured Helm charts for packaging, updating, and rollbacks.<br>• Codebase available on <a href='https://github.com/hampannagouda' target='_blank'>GitHub ↗</a>",
      replies: ["☁️ Terraform IaC", "🛒 E-Commerce", "🛠️ Core Skills", "📧 Contact Info"]
    },
    terraform: {
      text: "☁️ <strong>Infrastructure Automation with Terraform & AWS</strong>:<br>• Configured infrastructure-as-code (IaC) modules for rapid deployment on <strong>AWS</strong>.<br>• Automated provisioning of <strong>EC2 compute nodes, S3 storage buckets, secure VPC networking, and IAM roles</strong>.<br>• Managed state locking and backend persistence patterns.<br>• Codebase available on <a href='https://github.com/hampannagouda' target='_blank'>GitHub ↗</a>",
      replies: ["📈 Stock Prediction", "☸️ Kubernetes", "🛠️ Core Skills", "📧 Contact Info"]
    },
    ecommerce: {
      text: "🛒 <strong>Flipkart-like E-Commerce App (MERN Stack)</strong>:<br>• Fully responsive web application with clean product displays, search, and dynamic cart operations.<br>• Implemented secure <strong>JWT Token Authentication</strong> and product schema management in <strong>MongoDB</strong>.<br><br>📚 Also check out his <strong>Real-time Book List App</strong> utilizing WebSockets for zero-refresh live listing syncs!",
      replies: ["🛠️ Core Skills", "🚀 View Projects", "📧 Contact Info"]
    },
    skills: {
      text: "Hampanna's technical arsenal spans multiple domains:<br><br>🚀 <strong>DevOps & Cloud</strong>: Docker, Kubernetes, Jenkins, Terraform, AWS, GCP, CI/CD, Linux<br>💻 <strong>Programming</strong>: Python, Java, JavaScript, TypeScript, C++, Bash, SQL<br>🌐 <strong>Web Dev</strong>: React, Node, Express, Next.js, Django, Flask, Tailwind CSS<br>🤖 <strong>AI & ML</strong>: TensorFlow, PyTorch, LSTM, Scikit-learn, OpenCV, Pandas, NumPy",
      replies: ["🚀 View Projects", "🌟 Why Hire?", "📧 Contact Info"]
    },
    contact: {
      text: "Here is how you can reach Hampanna:<br><br>📧 <strong>Email</strong>: <a href='mailto:hampannagouda18@gmail.com'>hampannagouda18@gmail.com</a><br>💼 <strong>LinkedIn</strong>: <a href='https://www.linkedin.com/in/hampanna-gouda-39518b25a/' target='_blank'>Hampanna Gouda ↗</a><br>🐙 <strong>GitHub</strong>: <a href='https://github.com/hampannagouda' target='_blank'>hampannagouda ↗</a><br>⚡ <strong>LeetCode</strong>: <a href='https://leetcode.com/hampu_/' target='_blank'>hampu_ ↗</a><br><br>He is actively seeking internship and junior engineering opportunities in AI/DevOps!",
      replies: ["🌟 Why Hire?", "🚀 View Projects", "🛠️ Core Skills"]
    },
    whyhire: {
      text: "🌟 <strong>Why hire Hampanna?</strong><br>1. <strong>DevOps & AI Hybrid</strong>: Combines a strong understanding of building ML pipelines with advanced container orchestration (K8s/Docker) and CI/CD automation.<br>2. <strong>Practical cloud experience</strong>: Actively provisioning AWS environments using Terraform (IaC).<br>3. <strong>Dedicated learner</strong>: Consistently coding, pursuing B.Tech in CSE at Dayananda Sagar University, and exploring advanced MLOps architectures.",
      replies: ["📧 Contact Info", "🚀 View Projects", "🛠️ Core Skills"]
    },
    fallback: {
      text: "I'm not sure I understand that query. 🤖 I can answer questions about Hampanna's projects, skills, education, contact info, and why you should hire him. Try using one of the quick options below or type words like 'Kubernetes', 'LSTM', or 'Email'!",
      replies: ["🚀 View Projects", "🛠️ Core Skills", "📧 Contact Info", "🌟 Why Hire?"]
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
    if (/\b(project|projects|work|portfolio|build|developed)\b/.test(q)) {
      return responses.projects;
    }
    if (/\b(stock|prediction|lstm|market|prices|shares)\b/.test(q)) {
      return responses.stock;
    }
    if (/\b(ci\/cd|jenkins|pipeline|docker|container|dockerized|actions)\b/.test(q)) {
      return responses.cicd;
    }
    if (/\b(k8s|kubernetes|helm|orchestrate|cluster|pods|scaling)\b/.test(q)) {
      return responses.k8s;
    }
    if (/\b(terraform|aws|cloud|iac|vpc|s3|ec2)\b/.test(q)) {
      return responses.terraform;
    }
    if (/\b(ecommerce|e-commerce|flipkart|mern|react|node|express|mongodb|full stack|sockets|web-sockets|book)\b/.test(q)) {
      return responses.ecommerce;
    }
    if (/\b(skills|skill|technologies|languages|stack|frameworks|arsenal|tools)\b/.test(q)) {
      return responses.skills;
    }
    if (/\b(contact|email|reach|hire|message|socials|linkedin|github|leetcode|phone)\b/.test(q)) {
      return responses.contact;
    }
    if (/\b(why hire|hire hampanna|about|experience|background|who is)\b/.test(q)) {
      return responses.whyhire;
    }
    if (/\b(resume|cv|education|university|degree|college|dsu|dayananda)\b/.test(q)) {
      return responses.whyhire; // Fall back to whyhire which has education details or custom resume answer
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
