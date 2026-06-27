import express from "express";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";
import { io as ioc } from "socket.io-client";
import http from "http";
import path from "path";
import { createProxyMiddleware } from 'http-proxy-middleware';

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  const server = http.createServer(app);
  
  // API Gateway proxy rules
  app.use('/api/children', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));
  app.use('/api/shelters', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));
  app.use('/api/family-matches', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));
  app.use('/api/wellness', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));
  app.use('/api/journeys', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));
  app.use('/api/stats', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));
  app.use('/api/auth', createProxyMiddleware({ target: 'http://localhost:5010', changeOrigin: true }));
  app.use('/api/cw', createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true }));

  // National Command (ROS) Proxies
  app.use('/api/command', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
  app.use('/api/nation', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
  app.use('/api/genome', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
  app.use('/api/forecasts', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
  app.use('/api/organizations', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
  app.use('/api/ledger', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
  app.use('/api/missions', createProxyMiddleware({ target: 'http://localhost:5005', changeOrigin: true }));
  app.use('/api/teams', createProxyMiddleware({ target: 'http://localhost:5005', changeOrigin: true }));
  app.use('/api/drones', createProxyMiddleware({ target: 'http://localhost:5005', changeOrigin: true }));
  app.use('/api/emergency', createProxyMiddleware({ target: 'http://localhost:5005', changeOrigin: true }));

  app.use('/api/criminal', createProxyMiddleware({ target: 'http://localhost:5004', changeOrigin: true }));
  app.use('/api/predictions', createProxyMiddleware({ target: 'http://localhost:5004', changeOrigin: true }));
  app.use('/api/gemini', createProxyMiddleware({ target: 'http://localhost:5004', changeOrigin: true }));

  // Central WebSocket Aggregator
  const io = new Server(server, { cors: { origin: "*" } });
  
  const childSocket = ioc('http://localhost:5000');
  const missionSocket = ioc('http://localhost:5005');
  const forensicSocket = ioc('http://localhost:5004');

  childSocket.on('update', (data: any) => io.emit('update', data));
  missionSocket.on('update', (data: any) => io.emit('update', data));
  forensicSocket.on('update', (data: any) => io.emit('update', data));

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  
  app.use(vite.middlewares);

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const statsRes = await fetch(`${TARGETS.missionControl}/api/stats`);
    const statsData = await statsRes.json();
    res.json(statsData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// System Status endpoint (pings all services)
app.get('/api/system/status', async (req, res) => {
  const checkService = async (url: string) => {
    try {
      const start = Date.now();
      const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(2000) });
      const latency = Date.now() - start;
      return { status: res.ok ? 'Optimal' : 'Error', latency };
    } catch {
      return { status: 'Offline', latency: 0 };
    }
  };

  const [auth, missionControl, childProtection] = await Promise.all([
    checkService(TARGETS.auth),
    checkService(TARGETS.missionControl),
    checkService(TARGETS.childProtection)
  ]);

  res.json({
    network: { status: 'Optimal', label: 'Network Routing' },
    database: { status: childProtection.status === 'Optimal' ? 'Syncing' : 'Offline', label: 'Core Database' },
    cache: { status: '45% Used', label: 'Local Cache' }, // Could be connected to Redis
    websocket: { status: missionControl.status === 'Optimal' ? 'Connected' : 'Disconnected', label: 'WebSocket' },
    aiEngine: { status: 'Operational', label: 'AI Engine API' }, // Mock for now until connected to AI Forensic Lab
    telemetry: { status: missionControl.latency > 500 ? 'Warning: High Latency' : 'Optimal', label: 'Telemetry', latency: missionControl.latency }
  });
});

  app.use("*", async (req, res, next) => {
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
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`API Gateway and Vite server running at http://localhost:${PORT}`);
  });
}

startServer();
