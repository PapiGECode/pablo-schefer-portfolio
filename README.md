# Pablo Schefer Orduña — Portfolio

Portafolio bilingüe y multipágina centrado en Discord, vibecoding y colaboración en comunidades y proyectos como FNLB y KernelOS.

Producción: [pabloschefer.vercel.app](https://pabloschefer.vercel.app)

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Verificación

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Stack

- React + TypeScript + Vite
- React Router
- Motion for React
- CSS/SVG/Canvas nativos
- Vercel Function para normalizar el widget público de Discord
- GitHub REST API mediante una Vercel Function con caché CDN
- Integración de presencia de Spotify mediante Lanyard REST + WebSocket
- Despliegue SPA compatible con rutas directas en Vercel

## Rutas

- `/` — portada
- `/perfil` — perfil completo
- `/comunidades` — experiencia de moderación
- `/comunidades/edgar-pons` — monitor interactivo del widget público de Discord
- `/juegos-y-equipo` — rotación, juego favorito, biblioteca de 20 títulos y hardware
- `/musica` — monitor de Spotify preparado para activación pública

## Integración con GitHub

La portada incluye una sección `GitHub / Open Source` en `/#github`, alimentada con datos reales de la [GitHub REST API](https://docs.github.com/en/rest). La integración consulta el perfil público `PapiGEGamer-web` y sus repositorios para mostrar descripción, lenguaje principal, estrellas, forks, fecha de actualización y enlaces originales.

El navegador no consulta GitHub directamente ni recibe credenciales. La Vercel Function [`api/github.ts`](./api/github.ts) consume `GET /users/PapiGEGamer-web` y `GET /users/PapiGEGamer-web/repos`, valida y reduce la respuesta y publica únicamente los campos utilizados por la interfaz. La respuesta se conserva una hora en la CDN, admite datos obsoletos durante incidencias temporales y ofrece un fallback que mantiene operativo el resto del portfolio.

No se utiliza OAuth ni se declara afiliación con GitHub. La interfaz indica únicamente: `Powered by the GitHub REST API`.

La función `api/edgar-community.ts` utiliza únicamente los endpoints públicos de Discord. No requiere bot, token ni acceso a canales privados. Discord impone una caché de 300 segundos a la URL estable del widget; la función comparte una consulta versionada por intervalos para obtener un snapshot público nuevo cada 15 segundos. La interfaz ofrece actualización manual y diferencia la hora de comprobación del último cambio detectado.

La ruta `/musica` no incluye credenciales de Spotify. Se suscribe a la presencia pública de Discord mediante Lanyard y se activa automáticamente cuando el usuario `633600812970541056` forma parte voluntariamente de ese servicio y muestra Spotify en Discord.

Las portadas se sirven localmente. Sus orígenes promocionales se documentan en [GAME_ASSETS.md](./GAME_ASSETS.md).
