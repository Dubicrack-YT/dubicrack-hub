// Lee config.json y expone los datos a index.html / youtube.html / github.html
// Cambia aquí NADA: toda la configuración vive en config.json

const ICONS = {
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12Z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6.2 0c2.4-1.6 3.4-1.2 3.4-1.2.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z"/></svg>'
};

async function loadConfig() {
  const res = await fetch('config.json');
  if (!res.ok) throw new Error('No se pudo cargar config.json');
  return res.json();
}

// Pinta la versión en cualquier elemento con [data-version]
function paintVersion(cfg) {
  document.querySelectorAll('[data-version]').forEach(el => {
    el.textContent = 'v' + cfg.site.version;
  });
  document.querySelectorAll('[data-site-name]').forEach(el => {
    el.textContent = cfg.site.name;
  });
}

// Para index.html: construye el listado de subsitios
function renderListing(cfg, containerEl) {
  containerEl.innerHTML = '';
  cfg.sites.forEach(site => {
    const a = document.createElement('a');
    a.className = 'entry';
    a.href = site.page;
    a.innerHTML = `
      <span class="icon">${ICONS[site.icon] || ''}</span>
      <span class="meta">
        <span class="name">${site.file}</span>
        <span class="desc">${site.label} — ${site.desc}</span>
      </span>
      <span class="arrow">→ abrir</span>
    `;
    containerEl.appendChild(a);
  });
}

// Para youtube.html / github.html: rellena la ficha de perfil con datos de config.json
function renderProfile(cfg, siteId) {
  const site = cfg.sites.find(s => s.id === siteId);
  if (!site) return;

  document.documentElement.style.setProperty('--accent', site.accent);

  const iconEl = document.querySelector('[data-profile-icon]');
  if (iconEl) iconEl.innerHTML = ICONS[site.icon] || '';

  const nameEl = document.querySelector('[data-profile-name]');
  if (nameEl) nameEl.textContent = site.label;

  const handleEl = document.querySelector('[data-profile-handle]');
  if (handleEl) handleEl.textContent = site.desc;

  const linkEl = document.querySelector('[data-profile-link]');
  if (linkEl) linkEl.href = site.external;
}
