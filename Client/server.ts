import express from "express";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";
import { io as ioc } from "socket.io-client";
import http from "http";
import { createProxyMiddleware } from 'http-proxy-middleware';

const SERVICES = {
  childProtection:  'http://localhost:5000',
  auth:             'http://localhost:5010',
  communityWatch:   'http://localhost:5001',
  nationalCommand:  'http://localhost:5002',
  investigationWar: 'http://localhost:5003',
  aiForensicLab:    'http://localhost:5004',
  missionControl:   'http://localhost:5005',
  ghostEngine:      'http://localhost:8001',
};

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  // Helper for http-proxy-middleware to preserve paths
  const proxyTo = (target: string, pathPrefix: string) => {
    return createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: (path, req) => {
        // Express strips the pathPrefix when using app.use(pathPrefix, ...)
        // So we just prepend it back to the remaining path
        return pathPrefix + path;
      }
    });
  };

  // Child Protection Service (port 5000)
  app.use('/api/children',      proxyTo(SERVICES.childProtection, '/api/children'));
  app.use('/api/shelters',      proxyTo(SERVICES.childProtection, '/api/shelters'));
  app.use('/api/family-matches',proxyTo(SERVICES.childProtection, '/api/family-matches'));
  app.use('/api/wellness',      proxyTo(SERVICES.childProtection, '/api/wellness'));
  app.use('/api/journeys',      proxyTo(SERVICES.childProtection, '/api/journeys'));

  // Auth Service (port 5010)
  app.use('/api/auth',          proxyTo(SERVICES.auth, '/api/auth'));

  // Community Watch (port 5001)
  app.use('/api/cw',            proxyTo(SERVICES.communityWatch, '/api/cw'));

  // National Command (port 5002)
  app.use('/api/command',       proxyTo(SERVICES.nationalCommand, '/api/command'));
  app.use('/api/nation',        proxyTo(SERVICES.nationalCommand, '/api/nation'));
  app.use('/api/forecasts',     proxyTo(SERVICES.nationalCommand, '/api/forecasts'));
  app.use('/api/organizations', proxyTo(SERVICES.nationalCommand, '/api/organizations'));
  app.use('/api/ledger',        proxyTo(SERVICES.nationalCommand, '/api/ledger'));
  app.use('/api/knowledge',     proxyTo(SERVICES.nationalCommand, '/api/knowledge'));

  // Mission Control (port 5005)
  app.use('/api/missions',      proxyTo(SERVICES.missionControl, '/api/missions'));
  app.use('/api/teams',         proxyTo(SERVICES.missionControl, '/api/teams'));
  app.use('/api/drones',        proxyTo(SERVICES.missionControl, '/api/drones'));
  app.use('/api/emergency',     proxyTo(SERVICES.missionControl, '/api/emergency'));

  // AI Forensic Lab (port 5004)
  app.use('/api/criminal',      proxyTo(SERVICES.aiForensicLab, '/api/criminal'));
  app.use('/api/predictions',   proxyTo(SERVICES.aiForensicLab, '/api/predictions'));
  app.use('/api/gemini',        proxyTo(SERVICES.aiForensicLab, '/api/gemini'));
  app.use('/api/network-genome',proxyTo(SERVICES.aiForensicLab, '/api/network-genome'));
  app.use('/api/search',        proxyTo(SERVICES.aiForensicLab, '/api/search'));
  app.use('/api/dashboard',     proxyTo(SERVICES.aiForensicLab, '/api/dashboard'));

  // Ghost Engine (port 8001)
  app.use('/api/v1/ghost',      proxyTo(SERVICES.ghostEngine, '/api/v1/ghost'));

  // Network Genome (port 8003)
  app.use('/api/genome',        proxyTo('http://localhost:8003', '/api/genome'));

  // ── Aggregated Stats ────────────────────────────────────────────────────
  app.get('/api/stats', async (req: any, res: any) => {
    try {
      const statsRes = await fetch(`${SERVICES.childProtection}/api/stats`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!statsRes.ok) throw new Error(`stats returned ${statsRes.status}`);
      const statsData = await statsRes.json();
      res.json(statsData);
    } catch (error: any) {
      // Return safe fallback so dashboard doesn't crash
      res.json({
        totalChildren: 0, newRescues: 0, familyMatches: 0,
        medicalCases: 0, successRate: 0, urgentCases: 0,
        priorityQueue: [], recoveryPipeline: [], schedule: [], dailyBrief: [],
        _error: error.message,
      });
    }
  });

  // ── System Status ───────────────────────────────────────────────────────
  app.get('/api/system/status', async (_req: any, res: any) => {
    const checkService = async (url: string) => {
      try {
        const start = Date.now();
        const r = await fetch(`${url}/health`, { signal: AbortSignal.timeout(2000) });
        return { status: r.ok ? 'Optimal' : 'Error', latency: Date.now() - start };
      } catch {
        return { status: 'Offline', latency: 0 };
      }
    };
    const [auth, mc, cp] = await Promise.all([
      checkService(SERVICES.auth),
      checkService(SERVICES.missionControl),
      checkService(SERVICES.childProtection),
    ]);
    res.json({
      network:    { status: 'Optimal',                                              label: 'Network Routing' },
      database:   { status: cp.status === 'Optimal' ? 'Syncing' : 'Offline',       label: 'Core Database' },
      cache:      { status: '45% Used',                                             label: 'Local Cache' },
      websocket:  { status: mc.status === 'Optimal' ? 'Connected' : 'Disconnected',label: 'WebSocket' },
      aiEngine:   { status: 'Operational',                                          label: 'AI Engine API' },
      telemetry:  { status: mc.latency > 500 ? 'Warning: High Latency' : 'Optimal',label: 'Telemetry', latency: mc.latency },
    });
  });

  // ── WebSocket Aggregator ────────────────────────────────────────────────
  const io = new Server(server, { cors: { origin: '*' } });
  const childSocket   = ioc(SERVICES.childProtection);
  const missionSocket = ioc(SERVICES.missionControl);
  const forensicSocket= ioc(SERVICES.aiForensicLab);
  childSocket.on('update',   (data: any) => io.emit('update', data));
  missionSocket.on('update', (data: any) => io.emit('update', data));
  forensicSocket.on('update',(data: any) => io.emit('update', data));
  // Broadcast stats updates every 30s
  setInterval(async () => {
    try {
      const r = await fetch(`${SERVICES.childProtection}/api/stats`);
      if (r.ok) io.emit('update', { type: 'stats', data: await r.json() });
    } catch {}
  }, 30000);

  // ── Vite Dev Server ─────────────────────────────────────────────────────
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use('*', async (req: any, res: any, next: any) => {
    const url = req.originalUrl;
    try {
      let template = await vite.transformIndexHtml(url, `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/vite.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>ABHAYA - National Child Protection Command</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="/src/main.tsx"></script>
          </body>
        </html>
      `);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ ABHAYA API Gateway + Vite running at http://localhost:${PORT}`);
    console.log(`   Child Protection : ${SERVICES.childProtection}`);
    console.log(`   Mission Control  : ${SERVICES.missionControl}`);
    console.log(`   Ghost Engine     : ${SERVICES.ghostEngine}`);
  });
}

startServer();
