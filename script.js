/**
 * ============================================================================
 * OBSIDIAN BLACK + ELECTRIC LIME DEVELOPER PORTFOLIO
 * Vanilla JavaScript (ES6+) — Clean, Modular, Accessible, Zero Dependencies
 * ============================================================================
 */

/* ----------------------------------------------------------------------------
 * 1. PURE LOGIC & VALIDATION HELPERS (Testable in Node & Browser)
 * ---------------------------------------------------------------------------- */

/**
 * Project preview catalog used by the interactive Live Demo modal.
 */
export const PROJECT_CATALOG = {
  'project-1': {
    id: 'project-1',
    kicker: 'Cut 01 · Commercial & Brand Edit Breakdown',
    title: '[Project Title 01 — High-Energy Brand Commercial or Showreel]',
    description:
      'Explore the timecode markers below to inspect how this commercial spot builds momentum from the 3-second hook to the final brand resolve.',
    repoUrl: 'https://vimeo.com/',
    demoType: 'timecode-markers',
  },
  'project-2': {
    id: 'project-2',
    kicker: 'Cut 02 · Documentary Multi-Track Stem Breakdown',
    title: '[Project Title 02 — Short Documentary or Long-Form Video Essay]',
    description:
      'Toggle the post-production audio and picture stems below to inspect how A-roll dialogue, B-roll sequences, room tone, and score are layered.',
    repoUrl: 'https://www.youtube.com/',
    demoType: 'stem-mixer',
  },
  'project-3': {
    id: 'project-3',
    kicker: 'Cut 03 · Multi-Aspect Delivery & Grade Breakdown',
    title: '[Project Title 03 — High-Retention Vertical Reels or Motion Edit]',
    description:
      'Switch between delivery aspect ratios and colour pipeline passes below to see how this edit adapts across social and widescreen platforms.',
    repoUrl: 'https://www.instagram.com/',
    demoType: 'delivery-specs',
  },
};

/**
 * Checks whether a project category list matches the selected filter.
 * @param {string[]} categories - Array of category strings on a project item
 * @param {string} activeFilter - Selected filter key ('all', 'html-css', 'javascript', 'responsive')
 * @returns {boolean}
 */
export function matchesProjectCategory(categories, activeFilter) {
  if (!activeFilter || activeFilter === 'all') {
    return true;
  }
  if (!Array.isArray(categories)) {
    return false;
  }
  return categories.includes(activeFilter);
}

/**
 * Filters an array of project objects by category.
 * @param {Array<{id: string, categories: string[]}>} projects
 * @param {string} activeFilter
 * @returns {Array<{id: string, categories: string[]}>}
 */
export function filterProjectsByCategory(projects, activeFilter) {
  if (!Array.isArray(projects)) return [];
  return projects.filter((project) =>
    matchesProjectCategory(project.categories, activeFilter)
  );
}

/**
 * Validates contact form fields and returns an object with `valid` and `errors`.
 * @param {{name?: string, email?: string, subject?: string, message?: string}} values
 * @returns {{valid: boolean, errors: {name?: string, email?: string, message?: string}}}
 */
export function validateContactForm(values = {}) {
  const errors = {};
  const trimmedName = (values.name || '').trim();
  const trimmedEmail = (values.email || '').trim();
  const trimmedMessage = (values.message || '').trim();

  if (!trimmedName) {
    errors.name = 'Please enter your name.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail) {
    errors.email = 'Please enter your email address.';
  } else if (!emailPattern.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address (e.g., name@example.com).';
  }

  if (!trimmedMessage) {
    errors.message = 'Please enter a message before submitting.';
  } else if (trimmedMessage.length < 10) {
    errors.message = 'Message should be at least 10 characters long.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Formats a clean plain-text summary for the prepared contact message.
 * @param {{name: string, email: string, subject?: string, message: string}} values
 * @returns {string}
 */
export function formatContactSummary(values) {
  const name = (values.name || '').trim();
  const email = (values.email || '').trim();
  const subject = (values.subject || '').trim() || 'Portfolio Inquiry';
  const message = (values.message || '').trim();

  return [
    `From: ${name} <${email}>`,
    `Subject: ${subject}`,
    `---`,
    message,
  ].join('\n');
}

/**
 * Builds a properly encoded mailto: URI from contact form values.
 * @param {string} recipientEmail
 * @param {{name: string, email: string, subject?: string, message: string}} values
 * @returns {string}
 */
export function buildMailtoHref(recipientEmail, values) {
  const cleanRecipient = (recipientEmail || 'your.email@example.com').trim();
  const subject = (values.subject || '').trim() || 'Portfolio Inquiry';
  const body = `Hello,\n\n${(values.message || '').trim()}\n\nBest regards,\n${(values.name || '').trim()}\n${(values.email || '').trim()}`;

  return `mailto:${cleanRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Returns project preview details by project ID.
 * @param {string} projectId
 */
export function getProjectPreviewData(projectId) {
  return PROJECT_CATALOG[projectId] || PROJECT_CATALOG['project-1'];
}

/**
 * Calculates clamped scroll progress ratio (0 to 1) and rounded percentage (0 to 100).
 * @param {number} scrollTop - Current vertical scroll offset
 * @param {number} scrollHeight - Total scrollable document height
 * @param {number} clientHeight - Viewport height
 * @returns {{ratio: number, percent: number}}
 */
export function calculateScrollProgress(scrollTop, scrollHeight, clientHeight) {
  const maxScrollable = Number(scrollHeight) - Number(clientHeight);
  if (!Number.isFinite(maxScrollable) || maxScrollable <= 0) {
    return { ratio: 0, percent: 0 };
  }
  const rawRatio = Number(scrollTop) / maxScrollable;
  const clampedRatio = Math.min(1, Math.max(0, Number.isFinite(rawRatio) ? rawRatio : 0));
  return {
    ratio: Number(clampedRatio.toFixed(4)),
    percent: Math.round(clampedRatio * 100),
  };
}

/* ----------------------------------------------------------------------------
 * 2. BROWSER DOM INITIALIZATION
 * ---------------------------------------------------------------------------- */

function initPortfolioApp() {
  // Set current copyright year dynamically
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  initScrollProgressBar();
  initMobileNavigation();
  initActiveSectionObserver();
  initSectionReveal();
  initCodeSpecimenTabs();
  initPlaceholderHighlighter();
  initSkillDisclosures();
  initProjectFilters();
  initProjectModal();
  initCopyEmailButton();
  initContactForm();
}

/**
 * 1.9 Top Viewport Scroll Progress Bar
 */
function initScrollProgressBar() {
  const trackEl = document.getElementById('scroll-progress-track');
  const barEl = document.getElementById('scroll-progress-bar');

  if (!trackEl || !barEl) return;

  let ticking = false;

  function updateProgress() {
    const docEl = document.documentElement;
    const scrollTop = window.scrollY || docEl.scrollTop || 0;
    const scrollHeight = docEl.scrollHeight || 0;
    const clientHeight = docEl.clientHeight || window.innerHeight || 0;

    const { ratio, percent } = calculateScrollProgress(
      scrollTop,
      scrollHeight,
      clientHeight
    );

    barEl.style.transform = `scaleX(${ratio})`;
    trackEl.setAttribute('aria-valuenow', String(percent));
    ticking = false;
  }

  function onScrollOrResize() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    }
  }

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize, { passive: true });
  updateProgress();
}

/**
 * 2.0 Lightweight Entrance Animations (Respects prefers-reduced-motion)
 */
function initSectionReveal() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    return;
  }

  const revealSections = document.querySelectorAll('.section-reveal');
  if (!revealSections.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealSections.forEach((sec, index) => {
    // Keep hero immediately visible with zero latency
    if (index === 0) return;
    const rect = sec.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      sec.classList.add('reveal-pending');
      observer.observe(sec);
    }
  });
}

/**
 * 2.1 Responsive Mobile Navigation Drawer
 */
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');

  if (!menuBtn || !drawer) return;

  function setMenuOpen(isOpen) {
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      drawer.removeAttribute('hidden');
    } else {
      drawer.setAttribute('hidden', '');
    }
  }

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isExpanded);
  });

  // Close mobile menu when any navigation link inside it is clicked
  const mobileLinks = drawer.querySelectorAll('a');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuBtn.focus();
    }
  });
}

/**
 * 2.2 Active Navigation Link Highlighting on Scroll
 */
function initActiveSectionObserver() {
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('main section[id]');

  if (!navLinks.length || !sections.length) return;

  function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
      const target = link.getAttribute('data-section');
      if (target === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-25% 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
}

/**
 * 2.3 Hero Interactive Code Specimen Tabs & Copy Button
 */
function initCodeSpecimenTabs() {
  const tabs = document.querySelectorAll('[data-code-tab]');
  const panels = document.querySelectorAll('[data-code-panel]');
  const copyBtn = document.getElementById('copy-specimen-btn');
  const statusEl = document.getElementById('specimen-status');

  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetKey = tab.getAttribute('data-code-tab');

      tabs.forEach((t) => {
        const isCurrent = t === tab;
        t.classList.toggle('active', isCurrent);
        t.setAttribute('aria-selected', String(isCurrent));
      });

      panels.forEach((panel) => {
        const isMatch = panel.getAttribute('data-code-panel') === targetKey;
        panel.classList.toggle('active', isMatch);
        if (isMatch) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });

      if (statusEl) {
        statusEl.textContent = `Viewing ${targetKey.toUpperCase()} pass`;
      }
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const activePanel = document.querySelector('.specimen-pre.active code');
      const codeText = activePanel ? activePanel.textContent || '' : '';

      await copyTextToClipboard(codeText);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      if (statusEl) {
        statusEl.textContent = 'Specs copied to clipboard';
      }

      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 1800);
    });
  }
}

/**
 * 2.4 Toggle Highlight on All Customizable [Placeholder] Tokens
 */
function initPlaceholderHighlighter() {
  const toggleBtn = document.getElementById('toggle-placeholders-btn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
    const nextState = !isPressed;
    toggleBtn.setAttribute('aria-pressed', String(nextState));
    document.body.classList.toggle('highlight-placeholders', nextState);
    toggleBtn.textContent = nextState
      ? 'Hide Placeholder Highlights'
      : 'Highlight Placeholders';
  });
}

/**
 * 2.5 Skills Section Practical Focus Area Disclosures
 */
function initSkillDisclosures() {
  const toggles = document.querySelectorAll('.skill-detail-toggle');
  toggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const targetId = btn.getAttribute('aria-controls');
      const listEl = targetId ? document.getElementById(targetId) : null;

      const nextExpanded = !expanded;
      btn.setAttribute('aria-expanded', String(nextExpanded));
      const labelSpan = btn.querySelector('span');
      if (labelSpan) {
        labelSpan.textContent = nextExpanded
          ? 'Hide Practical Focus Areas'
          : 'View Practical Focus Areas';
      }

      if (listEl) {
        if (nextExpanded) {
          listEl.removeAttribute('hidden');
        } else {
          listEl.setAttribute('hidden', '');
        }
      }
    });
  });
}

/**
 * 2.6 Projects Section Interactive Category Filter
 */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const countLabel = document.getElementById('projects-count-label');

  if (!filterButtons.length || !projectCards.length) return;

  const totalCount = projectCards.length;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedFilter = btn.getAttribute('data-filter') || 'all';

      filterButtons.forEach((b) => {
        b.classList.toggle('active', b === btn);
      });

      let visibleCount = 0;
      projectCards.forEach((card) => {
        const rawCategories = card.getAttribute('data-categories') || '';
        const categories = rawCategories.split(/\s+/).filter(Boolean);
        const isMatch = matchesProjectCategory(categories, selectedFilter);

        if (isMatch) {
          card.removeAttribute('hidden');
          visibleCount += 1;
        } else {
          card.setAttribute('hidden', '');
        }
      });

      if (countLabel) {
        countLabel.textContent = `Showing ${visibleCount} of ${totalCount} projects`;
      }
    });
  });
}

/**
 * 2.7 Accessible Project Live Demo Preview Modal (<dialog>)
 */
function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const doneBtn = document.getElementById('modal-done-btn');
  const demoButtons = document.querySelectorAll('[data-open-project]');

  const kickerEl = document.getElementById('modal-project-kicker');
  const titleEl = document.getElementById('modal-project-title');
  const descEl = document.getElementById('modal-project-desc');
  const sandboxArea = document.getElementById('modal-sandbox-area');
  const sourceLink = document.getElementById('modal-source-link');

  if (!modal || !demoButtons.length) return;

  let lastFocusedElement = null;

  function renderInteractiveSandbox(projectData) {
    if (!sandboxArea) return;

    if (projectData.demoType === 'timecode-markers') {
      sandboxArea.innerHTML = `
        <div class="sandbox-demo-header">
          <span>Interactive Edit Timecode Breakdown</span>
          <span id="sandbox-tc-status">TC 00:00:00:00 · Hook</span>
        </div>
        <div class="sandbox-interactive-row">
          <button type="button" class="btn btn-primary btn-sm" data-tc="00:00:00:00 · Opening Hook" data-note="Fast 12-frame rhythmic montage + sub-bass impact to capture viewer attention in the first 3 seconds.">00:00 Hook</button>
          <button type="button" class="btn btn-secondary btn-sm" data-tc="00:00:18:12 · Narrative Build" data-note="J-cut voiceover entry over dynamic B-roll movement, synced to 124 BPM percussion stems.">00:18 Rhythm Build</button>
          <button type="button" class="btn btn-secondary btn-sm" data-tc="00:00:48:04 · Climax & Resolve" data-note="Speed-ramped hero product reveal with custom foley riser, cutting to silence before the final title card.">00:48 Final Resolve</button>
        </div>
        <div class="sandbox-output" id="sandbox-tc-output">
          Fast 12-frame rhythmic montage + sub-bass impact to capture viewer attention in the first 3 seconds.
        </div>
      `;

      const tcButtons = sandboxArea.querySelectorAll('[data-tc]');
      const outputEl = sandboxArea.querySelector('#sandbox-tc-output');
      const statusSpan = sandboxArea.querySelector('#sandbox-tc-status');

      tcButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const tc = btn.getAttribute('data-tc') || '';
          const note = btn.getAttribute('data-note') || '';
          if (statusSpan) statusSpan.textContent = `TC ${tc}`;
          if (outputEl) outputEl.textContent = note;
          tcButtons.forEach((b) => {
            b.className = b === btn ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
          });
        });
      });
    } else if (projectData.demoType === 'stem-mixer') {
      sandboxArea.innerHTML = `
        <div class="sandbox-demo-header">
          <span>Post-Production Track &amp; Stem Layers</span>
          <span id="sandbox-task-count">3 / 3 Stems Active</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.875rem;">
            <input type="checkbox" class="sandbox-task-check" checked />
            <span>V1 + A1: Multi-Cam A-Roll Interview &amp; Isolated Dialogue (-3 dB)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.875rem;">
            <input type="checkbox" class="sandbox-task-check" checked />
            <span>V2 + A2: Archival B-Roll Sequences &amp; Ambient Room Tone</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.875rem;">
            <input type="checkbox" class="sandbox-task-check" checked />
            <span>A3 Master: Dynamic Score Ducking &amp; -14 LUFS Loudness Normalization</span>
          </label>
        </div>
      `;

      const checks = sandboxArea.querySelectorAll('.sandbox-task-check');
      const countSpan = sandboxArea.querySelector('#sandbox-task-count');
      checks.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
          const done = Array.from(checks).filter((c) => c.checked).length;
          if (countSpan) {
            countSpan.textContent = `${done} / ${checks.length} Stems Active`;
          }
        });
      });
    } else {
      sandboxArea.innerHTML = `
        <div class="sandbox-demo-header">
          <span>Multi-Format Delivery &amp; Grade Specs</span>
          <span>Rec.709 Master</span>
        </div>
        <div class="sandbox-interactive-row">
          <button type="button" class="btn btn-primary btn-sm" data-pair="vertical">9:16 Vertical (1080×1920)</button>
          <button type="button" class="btn btn-secondary btn-sm" data-pair="cinema">16:9 UHD Master (3840×2160)</button>
        </div>
        <div class="sandbox-output" id="sandbox-contrast-output">
          Format: 1080×1920 60fps · Safe-Zone Kinetic Captions · -14 LUFS Stereo Mix
        </div>
      `;

      const pairBtns = sandboxArea.querySelectorAll('[data-pair]');
      const outputEl = sandboxArea.querySelector('#sandbox-contrast-output');
      pairBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const pair = btn.getAttribute('data-pair');
          if (outputEl) {
            outputEl.textContent =
              pair === 'vertical'
                ? 'Format: 1080×1920 60fps · Safe-Zone Kinetic Captions · -14 LUFS Stereo Mix'
                : 'Format: 3840×2160 23.976fps · ProRes 422 HQ · DaVinci Wide Gamut Grade';
          }
          pairBtns.forEach((b) => {
            b.className = b === btn ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
          });
        });
      });
    }
  }

  function openModal(projectId, triggerEl) {
    lastFocusedElement = triggerEl || document.activeElement;
    const data = getProjectPreviewData(projectId);

    if (kickerEl) kickerEl.textContent = data.kicker;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.description;
    if (sourceLink) sourceLink.setAttribute('href', data.repoUrl);

    renderInteractiveSandbox(data);

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
  }

  function closeModal() {
    if (typeof modal.close === 'function' && modal.open) {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  demoButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-open-project') || 'project-1';
      openModal(projectId, btn);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (doneBtn) doneBtn.addEventListener('click', closeModal);

  // Close when clicking the dialog backdrop outside the modal container
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

/**
 * 2.8 Copy Email Address Button
 */
function initCopyEmailButton() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailEl = document.getElementById('contact-email-text');

  if (!copyBtn || !emailEl) return;

  copyBtn.addEventListener('click', async () => {
    const email = (emailEl.textContent || 'your.email@example.com').trim();
    await copyTextToClipboard(email);

    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Email Copied!';
    copyBtn.classList.add('btn-primary');
    copyBtn.classList.remove('btn-secondary');

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.classList.remove('btn-primary');
      copyBtn.classList.add('btn-secondary');
    }, 2000);
  });
}

/**
 * 2.9 Client-Side Inquiry Builder (Validation, Format Quick-Picks, LocalStorage Drafts, Mailto/Copy)
 */
const DRAFT_STORAGE_KEY = 'obsidian_lime_inquiry_draft_v1';

function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('sender-name');
  const emailInput = document.getElementById('sender-email');
  const subjectInput = document.getElementById('sender-subject');
  const messageInput = document.getElementById('sender-message');
  const formatPickBtns = document.querySelectorAll('[data-format-pick]');
  const clearDraftBtn = document.getElementById('clear-draft-btn');
  const draftStatusNote = document.getElementById('draft-status-note');

  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorMessage = document.getElementById('error-message');

  const successPanel = document.getElementById('form-success-panel');
  const summaryEl = document.getElementById('prepared-message-summary');
  const mailtoLink = document.getElementById('mailto-launch-link');
  const copyMessageBtn = document.getElementById('copy-message-btn');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const recipientEl = document.getElementById('contact-email-text');

  if (!form || !nameInput || !emailInput || !messageInput) return;

  function saveDraftToLocal() {
    try {
      const draft = {
        name: nameInput.value,
        email: emailInput.value,
        subject: subjectInput ? subjectInput.value : '',
        message: messageInput.value,
      };
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      if (draftStatusNote) {
        draftStatusNote.textContent = 'Draft saved locally in your browser.';
      }
    } catch {
      // Ignore storage quota or private mode restrictions
    }
  }

  function loadDraftFromLocal() {
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if (parsed.name) nameInput.value = parsed.name;
        if (parsed.email) emailInput.value = parsed.email;
        if (parsed.subject && subjectInput) subjectInput.value = parsed.subject;
        if (parsed.message) messageInput.value = parsed.message;
        syncFormatPickHighlight();
      }
    } catch {
      // Ignore malformed local storage data
    }
  }

  function syncFormatPickHighlight() {
    const currentSubject = subjectInput ? subjectInput.value.trim() : '';
    formatPickBtns.forEach((btn) => {
      const pickValue = btn.getAttribute('data-format-pick') || '';
      btn.classList.toggle('active', pickValue === currentSubject);
    });
  }

  // Wire format quick-pick buttons
  formatPickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const pickValue = btn.getAttribute('data-format-pick') || '';
      if (subjectInput) {
        subjectInput.value = pickValue;
      }
      syncFormatPickHighlight();
      saveDraftToLocal();
    });
  });

  if (subjectInput) {
    subjectInput.addEventListener('input', () => {
      syncFormatPickHighlight();
      saveDraftToLocal();
    });
  }

  function setFieldError(inputEl, errorEl, errorMessageText) {
    if (!inputEl || !errorEl) return;
    if (errorMessageText) {
      inputEl.setAttribute('aria-invalid', 'true');
      errorEl.textContent = errorMessageText;
      errorEl.removeAttribute('hidden');
    } else {
      inputEl.setAttribute('aria-invalid', 'false');
      errorEl.textContent = '';
      errorEl.setAttribute('hidden', '');
    }
  }

  // Clear individual field errors and save draft as the user types
  [
    [nameInput, errorName],
    [emailInput, errorEmail],
    [messageInput, errorMessage],
  ].forEach(([inputEl, errorEl]) => {
    inputEl.addEventListener('input', () => {
      if (inputEl.getAttribute('aria-invalid') === 'true') {
        setFieldError(inputEl, errorEl, '');
      }
      saveDraftToLocal();
    });
  });

  if (clearDraftBtn) {
    clearDraftBtn.addEventListener('click', () => {
      form.reset();
      if (subjectInput) subjectInput.value = '';
      syncFormatPickHighlight();
      setFieldError(nameInput, errorName, '');
      setFieldError(emailInput, errorEmail, '');
      setFieldError(messageInput, errorMessage, '');
      if (successPanel) successPanel.setAttribute('hidden', '');
      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Ignore storage errors
      }
      if (draftStatusNote) {
        draftStatusNote.textContent = 'Browser draft cleared.';
      }
    });
  }

  // Restore any existing browser draft on load
  loadDraftFromLocal();

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const values = {
      name: nameInput.value,
      email: emailInput.value,
      subject: subjectInput ? subjectInput.value : '',
      message: messageInput.value,
    };

    const result = validateContactForm(values);

    setFieldError(nameInput, errorName, result.errors.name || '');
    setFieldError(emailInput, errorEmail, result.errors.email || '');
    setFieldError(messageInput, errorMessage, result.errors.message || '');

    if (!result.valid) {
      // Focus the first invalid field for accessibility
      if (result.errors.name) nameInput.focus();
      else if (result.errors.email) emailInput.focus();
      else if (result.errors.message) messageInput.focus();
      return;
    }

    const formattedSummary = formatContactSummary(values);
    const recipient = recipientEl
      ? recipientEl.textContent || 'your.email@example.com'
      : 'your.email@example.com';

    if (summaryEl) {
      summaryEl.textContent = formattedSummary;
    }

    if (mailtoLink) {
      mailtoLink.setAttribute('href', buildMailtoHref(recipient, values));
    }

    if (successPanel) {
      successPanel.removeAttribute('hidden');
    }
  });

  if (copyMessageBtn) {
    copyMessageBtn.addEventListener('click', async () => {
      const text = summaryEl ? summaryEl.textContent || '' : '';
      await copyTextToClipboard(text);
      const original = copyMessageBtn.textContent;
      copyMessageBtn.textContent = 'Brief Copied!';
      setTimeout(() => {
        copyMessageBtn.textContent = original;
      }, 1800);
    });
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      if (successPanel) {
        successPanel.setAttribute('hidden', '');
      }
      nameInput.focus();
    });
  }
}

/**
 * Helper to copy plain text to clipboard with fallback support.
 * @param {string} text
 */
async function copyTextToClipboard(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to textarea fallback
    }
  }

  const tempArea = document.createElement('textarea');
  tempArea.value = text;
  tempArea.setAttribute('readonly', '');
  tempArea.style.position = 'fixed';
  tempArea.style.opacity = '0';
  document.body.appendChild(tempArea);
  tempArea.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(tempArea);
  }
  return true;
}

// Run initialization automatically when in a browser environment
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioApp);
  } else {
    initPortfolioApp();
  }
}
