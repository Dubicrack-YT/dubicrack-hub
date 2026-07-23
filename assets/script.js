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

// Para index.html: listado tipo "ls -la" con carpetas reales
function renderListing(cfg, containerEl) {
  containerEl.innerHTML = '';
  cfg.sites.forEach(site => {
    const a = document.createElement('a');
    a.className = 'entry';
    a.href = site.folder + '/index.html';
    a.innerHTML = `
      <span class="perms">drwxr-xr-x</span>
      <span class="icon">${ICONS[site.icon] || ''}</span>
      <span class="meta">
        <span class="name">${site.folder}/</span>
        <span class="desc">${site.label} — ${site.desc}</span>
      </span>
      <span class="arrow">→ abrir</span>
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

// Youtube: pinta bio y, si hay videoId en config.json, incrusta el video
function renderYoutubeExtras(site) {
  const bioEl = document.querySelector('[data-bio]');
  if (bioEl) bioEl.textContent = site.bio || '';

  const videoEl = document.querySelector('[data-video]');
  if (!videoEl) return;

  if (site.videoId) {
    videoEl.innerHTML = `<iframe src="https://www.youtube.com/embed/${site.videoId}" title="Video de YouTube" allowfullscreen loading="lazy"></iframe>`;
  } else {
    videoEl.innerHTML = `<div class="video-placeholder">Agrega un "videoId" en config.json para incrustar aquí un video destacado.</div>`;
  }
}

// GitHub: trae repos reales desde la API pública (sin API key, CORS habilitado)
async function renderGithubRepos(apiUser, containerEl) {
  containerEl.innerHTML = '<p class="status-line">Cargando repositorios…</p>';
  try {
    const res = await fetch(`https://api.github.com/users/${apiUser}/repos?sort=updated&per_page=6`);
    if (!res.ok) throw new Error('GitHub API respondió ' + res.status);
    const repos = await res.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      containerEl.innerHTML = '<p class="status-line">Sin repositorios públicos todavía.</p>';
      return;
    }

    containerEl.innerHTML = '<p class="heading">Repositorios recientes</p>';
    repos.forEach(repo => {
      const a = document.createElement('a');
      a.className = 'repo-card';
      a.href = repo.html_url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = `
        <div class="repo-name">${repo.name}</div>
        <div class="repo-desc">${repo.description ? repo.description : 'Sin descripción'}</div>
        <div class="repo-meta">
          ${repo.language ? `<span>${repo.language}</span>` : ''}
          <span>${ICONS.star} ${repo.stargazers_count}</span>
          <span>${ICONS.fork} ${repo.forks_count}</span>
        </div>
      `;
      containerEl.appendChild(a);
    });
  } catch (err) {
    containerEl.innerHTML = `<p class="status-line"><span class="err">●</span> no se pudieron cargar los repos (${err.message})</p>`;
  }
}
