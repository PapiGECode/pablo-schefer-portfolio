# Monitor local de componentes

El portfolio no puede leer el hardware de un PC desde Vercel: el navegador solo permite mostrar datos que un agente local exponga explícitamente. El agente de este repositorio queda limitado a `127.0.0.1`, sin puertos públicos ni credenciales.

1. Desde la carpeta del proyecto ejecuta `pnpm install` una vez.
2. Para ejecutarlo sin una ventana visible, haz doble clic en `scripts/start-telemetry-hidden.vbs`. El agente seguirá activo en segundo plano.
3. Si prefieres la consola visible para depurar, ejecuta `pnpm telemetry:start` y déjalo abierto mientras quieras ver los datos.
4. Abre `https://pabloschefer.vercel.app/juegos-y-equipo` en ese mismo ordenador.

El agente toma una lectura cada cinco segundos (la misma frecuencia con la que la web actualiza el panel) y publica/guarda esa muestra. Las comprobaciones pesadas (GPU, temperatura y discos) se reutilizan durante 60 segundos y la limpieza de la base de datos se ejecuta como máximo una vez por hora para mantener bajo el uso de CPU. El historial se guarda localmente en `.telemetry/metrics.sqlite` y se conserva un máximo de 31 días. La GPU se muestra como no disponible cuando el controlador no expone su uso a Windows; no se inventan datos.
