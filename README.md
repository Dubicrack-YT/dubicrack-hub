# Dubicrack — Hub de enlaces

> **Abrir Dubicrack Hub:** [https://dubicrack-yt.github.io/dubicrack-hub/](https://dubicrack-yt.github.io/dubicrack-hub/)

Página tipo terminal que sirve como punto de entrada a mis sitios: canal de YouTube, perfil de GitHub y lo que se vaya sumando. Cada subsitio vive en su propia carpeta y trae contenido real cuando es posible.

🔗 **Demo:** [https://dubicrack-yt.github.io/dubicrack-hub/](https://dubicrack-yt.github.io/dubicrack-hub/)

## Estructura

```
dubicrack-hub/
├── index.html          # hub principal, lista las carpetas de subsitios desde config.json
├── config.json         # versión del sitio + datos de cada subsitio
├── assets/
│   ├── style.css        # estilos compartidos (tema terminal)
│   └── script.js         # lee config.json, arma el listado y trae contenido real
├── youtube/
│   └── index.html       # subpágina del canal: bio editable + video incrustable
└── github/
    └── index.html        # subpágina del perfil: repos reales vía API de GitHub
```

## Contenido de cada subpágina

- **github/**: trae en vivo tus repositorios públicos más recientes usando la API pública de GitHub (`api.github.com`, sin necesidad de API key). Muestra nombre, descripción, lenguaje, estrellas y forks.
- **youtube/**: como YouTube no tiene una API pública sin clave, la bio y el video destacado se configuran a mano en `config.json` (campos `"bio"` y `"videoId"`). Si dejas `"videoId"` vacío, se muestra un aviso invitando a completarlo.

## Cómo añadir un subsitio nuevo

1. Crea una carpeta nueva, por ejemplo `twitch/`, con su propio `index.html` (puedes copiar `github/index.html` como base).
2. Agrega una entrada en el arreglo `sites` de `config.json`:

```json
{
  "id": "twitch",
  "label": "Twitch",
  "desc": "@tuUsuario",
  "folder": "twitch",
  "external": "https://twitch.tv/tuUsuario",
  "icon": "twitch",
  "accent": "#9146ff"
}
```

3. En el `index.html` de la carpeta nueva, cambia `renderProfile(cfg, 'github')` por `renderProfile(cfg, 'twitch')`.
4. Si el ícono es nuevo, agrégalo al objeto `ICONS` en `assets/script.js`.

## Cambiar la versión

Edita `"version"` dentro de `config.json`. Se actualiza automáticamente en todas las páginas.

## Probarlo en local

El sitio carga `config.json` con `fetch()`, así que abrir `index.html` con doble clic puede fallar por CORS. Levanta un servidor simple:

```bash
python3 -m http.server
```

y entra a `http://localhost:8000`.

## Publicarlo en GitHub Pages

La versión publicada está disponible en [https://dubicrack-yt.github.io/dubicrack-hub/](https://dubicrack-yt.github.io/dubicrack-hub/).

1. Sube el contenido de esta carpeta a la raíz de un repositorio (por ejemplo `Dubicrack-YT.github.io` para que sea tu página principal).
2. Ve a **Settings → Pages**, selecciona la rama `main` y la carpeta `/root`.
3. Espera unos minutos y el sitio queda publicado.
