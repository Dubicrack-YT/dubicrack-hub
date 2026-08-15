// Diseño Directorio de señales: mantiene datos configurables y presenta rutas de forma clara, sin simular administración.
// Lee config.json y expone los datos a index.html / youtube/index.html / github/index.html
// Cambia aquí NADA: toda la configuración vive en config.json

const ICONS = {
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12Z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6.2 0c2.4-1.6 3.4-1.2 3.4-1.2.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z"/></svg>',
  star: '<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.79L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>',
  fork: '<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878Zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/></svg>'
};

async function loadConfig() {
  // funciona tanto desde la raíz (index.html) como desde subcarpetas (youtube/, github/)
  for (const p of ['config.json', '../config.json']) {
    try {
      const res = await fetch(p);
      if (res.ok) return res.json();
    } catch (_) { /* intenta la siguiente ruta */ }
  }
  throw new Error('No se pudo cargar config.json');
}

function paintVersion(cfg) {
  document.querySelectorAll('[data-version]').forEach(el => { el.textContent = 'v' + cfg.site.version; });
  document.querySelectorAll('[data-site-name]').forEach(el => { el.textContent = cfg.site.name; });
}

function paintHubStatus(cfg) {
  const count = Array.isArray(cfg.sites) ? cfg.sites.length : 0;
  document.querySelectorAll('[data-channel-count]').forEach(el => { el.textContent = String(count).padStart(2, '0'); });
  const clock = document.querySelector('[data-hub-time]');
  if (!clock) return;
  const tick = () => { clock.textContent = new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date()); };
  tick();
  window.setInterval(tick, 1000);
}

// Para index.html: listado tipo "ls -la" con carpetas reales
function renderListing(cfg, containerEl) {
  containerEl.innerHTML = '';
  cfg.sites.forEach(site => {
    const a = document.createElement('a');
    a.className = 'entry directory-entry';
    a.href = site.folder + '/index.html';
    a.style.setProperty('--site-accent', site.accent || 'var(--signal)');
    a.setAttribute('aria-label', `Abrir ${site.label}`);
    a.innerHTML = `
      <span class="perms">drwxr-xr-x</span>
      <span class="icon">${ICONS[site.icon] || ''}</span>
      <span class="meta">
        <span class="name">${site.folder}/</span>
        <span class="desc">${site.label} — ${site.desc}</span>
      </span>
      <span class="entry-state">READY</span>
      <span class="arrow">↗ abrir</span>
    `;
    containerEl.appendChild(a);
  });
}

// Ficha de perfil compartida (ícono + nombre + handle + botón externo)
function renderProfile(cfg, siteId) {
  const site = cfg.sites.find(s => s.id === siteId);
  if (!site) return null;

  document.documentElement.style.setProperty('--accent', site.accent);

  const iconEl = document.querySelector('[data-profile-icon]');
  if (iconEl) iconEl.innerHTML = ICONS[site.icon] || '';

  const nameEl = document.querySelector('[data-profile-name]');
  if (nameEl) nameEl.textContent = site.label;

  const handleEl = document.querySelector('[data-profile-handle]');
  if (handleEl) handleEl.textContent = site.desc;

  const linkEl = document.querySelector('[data-profile-link]');
  if (linkEl) linkEl.href = site.external;

  return site;
}

// Acepta youtu.be/ID, youtube.com/watch?v=ID, /embed/ID, /shorts/ID (con o sin parámetros extra como ?si=...)
function extractYoutubeId(url) {
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('/')[0] || null;
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const m = u.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
    if (m) return m[2];
  } catch (_) { /* URL inválida, se ignora */ }
  return null;
}

// Youtube: pinta bio, contacto, metas y el carrusel de videos
function renderYoutubeExtras(site) {
  const bioEl = document.querySelector('[data-bio]');
  if (bioEl) bioEl.textContent = site.bio || '';

  const contactEl = document.querySelector('[data-contact]');
  if (contactEl && site.contact) {
    contactEl.innerHTML = `✉ <a href="mailto:${site.contact}">${site.contact}</a>`;
  }

  renderVideoCarousel(site);

  const goalsEl = document.querySelector('[data-goals]');
  if (goalsEl && Array.isArray(site.goals)) {
    goalsEl.innerHTML = '<p class="heading">Metas del canal</p>';
    site.goals.forEach(g => {
      const row = document.createElement('div');
      row.className = 'goal-row' + (g.achieved ? ' achieved' : '');
      row.innerHTML = `
        <span class="goal-bar"><span class="goal-fill" style="width:${g.achieved ? 100 : 0}%"></span></span>
        <span class="goal-count">${g.count.toLocaleString('es-ES')} subs</span>
        <span class="goal-mark">${g.achieved ? '✅' : '❌'}</span>
      `;
      goalsEl.appendChild(row);
    });
  }
}

function renderVideoCarousel(site) {
  const mainEl = document.querySelector('[data-video-main]');
  const stripEl = document.querySelector('[data-video-strip]');
  if (!mainEl || !stripEl) return;

  const ids = (site.videos || []).map(extractYoutubeId).filter(Boolean);

  if (ids.length === 0) {
    mainEl.innerHTML = '<div class="video-placeholder">Agrega URLs en el arreglo "videos" de config.json para mostrarlas aquí.</div>';
    stripEl.innerHTML = '';
    return;
  }

  function setActive(id) {
    mainEl.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}" title="Video de YouTube" allowfullscreen loading="lazy"></iframe>`;
    stripEl.querySelectorAll('.thumb').forEach(t => t.classList.toggle('active', t.dataset.id === id));
  }

  stripEl.innerHTML = '';
  ids.forEach(id => {
    const btn = document.createElement('button');
    btn.className = 'thumb';
    btn.dataset.id = id;
    btn.innerHTML = `<img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy"><span class="play">▶</span>`;
    btn.addEventListener('click', () => setActive(id));
    stripEl.appendChild(btn);
  });

  setActive(ids[0]);

  const prevBtn = document.querySelector('[data-car-prev]');
  const nextBtn = document.querySelector('[data-car-next]');
  if (prevBtn) prevBtn.addEventListener('click', () => stripEl.scrollBy({ left: -240, behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => stripEl.scrollBy({ left: 240, behavior: 'smooth' }));

  // ocultar flechas si no hace falta scroll (una sola miniatura, por ejemplo)
  const arrows = document.querySelector('[data-car-arrows]');
  if (arrows) arrows.style.display = ids.length > 2 ? '' : 'none';
}

// Colores aproximados de GitHub Linguist para las barras de lenguaje
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', HTML: '#e34c26',
  CSS: '#563d7c', Java: '#b07219', 'C++': '#f34b7d', C: '#555555', Shell: '#89e051',
  Lua: '#000080', 'C#': '#178600', PHP: '#4F5D95', Ruby: '#701516', Go: '#00ADD8',
  Rust: '#dea584', 'Jupyter Notebook': '#DA5B0B', Dockerfile: '#384d54', Vue: '#41b883',
  Kotlin: '#A97BFF', Swift: '#F05138', Batchfile: '#C1F12E', Makefile: '#427819'
};
function langColor(name) {
  if (LANG_COLORS[name]) return LANG_COLORS[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 55%, 55%)`;
}

// GitHub: trae repos reales desde la API pública (sin API key, CORS habilitado)
async function renderGithubRepos(apiUser, containerEl, viewerEl) {
  containerEl.innerHTML = '<p class="status-line">Cargando repositorios…</p>';
  try {
    const res = await fetch(`https://api.github.com/users/${apiUser}/repos?sort=updated&per_page=8`);
    if (!res.ok) throw new Error('GitHub API respondió ' + res.status);
    const repos = await res.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      containerEl.innerHTML = '<p class="status-line">Sin repositorios públicos todavía.</p>';
      return;
    }

    containerEl.innerHTML = '<p class="heading">Repositorios recientes — clic para ver detalle</p>';
    repos.forEach(repo => {
      const a = document.createElement('a');
      a.className = 'repo-card';
      a.href = repo.html_url;
      a.dataset.fullName = repo.full_name;
      a.innerHTML = `
        <div class="repo-name">${repo.name} <span class="repo-open-ext" title="Abrir en GitHub">↗</span></div>
        <div class="repo-desc">${repo.description ? repo.description : 'Sin descripción'}</div>
        <div class="repo-meta">
          ${repo.language ? `<span>${repo.language}</span>` : ''}
          <span>${ICONS.star} ${repo.stargazers_count}</span>
          <span>${ICONS.fork} ${repo.forks_count}</span>
        </div>
      `;
      a.addEventListener('click', (ev) => {
        // ctrl/cmd/click-rueda: dejar que abra en pestaña nueva normalmente
        if (ev.ctrlKey || ev.metaKey || ev.button === 1) return;
        // clic en el ícono ↗: abrir directo en GitHub
        if (ev.target.closest('.repo-open-ext')) return;
        ev.preventDefault();
        openRepoViewer(repo, containerEl, viewerEl);
      });
      containerEl.appendChild(a);
    });
  } catch (err) {
    containerEl.innerHTML = `<p class="status-line"><span class="err">●</span> no se pudieron cargar los repos (${err.message})</p>`;
  }
}

async function openRepoViewer(repo, listEl, viewerEl) {
  listEl.style.display = 'none';
  viewerEl.hidden = false;
  viewerEl.innerHTML = `
    <button class="back-btn" data-back>← volver a la lista</button>
    <h3 class="viewer-name">${repo.name}</h3>
    <p class="viewer-desc">${repo.description ? repo.description : 'Sin descripción'}</p>
    <div class="viewer-stats">
      <span>${ICONS.star} ${repo.stargazers_count} estrellas</span>
      <span>${ICONS.fork} ${repo.forks_count} forks</span>
      <span>👁 ${repo.watchers_count} watchers</span>
      <span>⚑ ${repo.open_issues_count} issues</span>
    </div>
    <div class="lang-bar" data-langs><span class="status-line">Cargando lenguajes…</span></div>
    <div class="readme-box" data-readme>Cargando README…</div>
    <a class="btn" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Visitar repositorio →</a>
  `;
  viewerEl.querySelector('[data-back]').addEventListener('click', () => {
    viewerEl.hidden = true;
    listEl.style.display = '';
  });

  // Lenguajes usados (bytes por lenguaje)
  fetch(`https://api.github.com/repos/${repo.full_name}/languages`)
    .then(r => r.ok ? r.json() : {})
    .then(langs => {
      const box = viewerEl.querySelector('[data-langs]');
      const total = Object.values(langs).reduce((a, b) => a + b, 0);
      if (!total) { box.innerHTML = ''; return; }
      box.innerHTML = `
        <div class="lang-track">${Object.entries(langs).map(([name, bytes]) =>
          `<span style="width:${(bytes / total * 100).toFixed(1)}%; background:${langColor(name)}"></span>`
        ).join('')}</div>
        <div class="lang-legend">${Object.entries(langs).map(([name, bytes]) =>
          `<span><i style="background:${langColor(name)}"></i>${name} ${(bytes / total * 100).toFixed(0)}%</span>`
        ).join('')}</div>
      `;
    })
    .catch(() => { viewerEl.querySelector('[data-langs]').innerHTML = ''; });

  // README renderizado
  fetch(`https://api.github.com/repos/${repo.full_name}/readme`, {
    headers: { Accept: 'application/vnd.github.v3.raw' }
  })
    .then(r => { if (!r.ok) throw new Error('sin README'); return r.text(); })
    .then(md => {
      const box = viewerEl.querySelector('[data-readme]');
      if (window.marked) {
        box.innerHTML = marked.parse(md);
      } else {
        const pre = document.createElement('pre');
        pre.textContent = md;
        box.innerHTML = '';
        box.appendChild(pre);
      }
    })
    .catch(() => {
      viewerEl.querySelector('[data-readme]').innerHTML = '<p class="status-line">Este repositorio no tiene README.</p>';
    });
}
