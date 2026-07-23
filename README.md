# Dubicrack — Hub de enlaces

Página tipo terminal que sirve como punto de entrada a mis sitios: canal de YouTube, perfil de GitHub y lo que se vaya sumando.

🔗 **Demo:** https://dubicrack-yt.github.io/

## Estructura

```
dubicrack-hub/
├── index.html        # hub principal, lista los subsitios desde config.json
├── youtube.html       # subpágina del canal de YouTube
├── github.html         # subpágina del perfil de GitHub
├── config.json        # versión del sitio + lista de subsitios que se muestran
└── assets/
    ├── style.css       # estilos compartidos (tema terminal)
    └── script.js       # lee config.json y arma la lista/fichas dinámicamente
```

## Cómo añadir un subsitio nuevo

1. Agrega una entrada en el arreglo `sites` de `config.json`:

```json
{
  "id": "twitch",
  "file": "twitch.txt",
  "label": "Twitch",
  "desc": "@tuUsuario",
  "page": "twitch.html",
  "external": "https://twitch.tv/tuUsuario",
  "icon": "twitch",
  "accent": "#9146ff"
}
```

2. Copia `github.html` como plantilla, renómbralo (`twitch.html`) y cambia la línea `renderProfile(cfg, 'github')` por `renderProfile(cfg, 'twitch')`.
3. Si el ícono es nuevo, agrégalo al objeto `ICONS` en `assets/script.js`.

## Cambiar la versión

Solo edita `"version"` dentro de `config.json`. Se actualiza automáticamente en todas las páginas.

## Probarlo en local

El sitio carga `config.json` con `fetch()`, así que abrir `index.html` con doble clic puede fallar por CORS. Levanta un servidor simple:

```bash
python3 -m http.server
```

y entra a `http://localhost:8000`.

## Publicarlo en GitHub Pages

1. Sube el contenido de esta carpeta a la raíz de un repositorio (por ejemplo `Dubicrack-YT.github.io` para que sea tu página principal).
2. Ve a **Settings → Pages**, selecciona la rama `main` y la carpeta `/root`.
3. Espera unos minutos y el sitio queda publicado.
