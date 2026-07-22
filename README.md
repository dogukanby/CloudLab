# Cloud Systems, Simulated

A small, single-page, client-side simulation of four ideas that show up in almost every cloud architecture: load balancing & auto-scaling, distributed consistency, caching/CDNs, and failover. No backend, no build step — open `index.html` and every module runs live in the browser.

Available in English and Turkish (toggle in the top bar). Light/dark theme follows your system by default, with a manual override.

## Modules

1. **Load Balancing & Auto-Scaling** — a server pool takes traffic under a strategy you pick (round robin / least connections / random), scales up under sustained load, scales down when idle.
2. **Distributed Consistency** — a 5-node cluster where you can split the network in two and write under eventual or strong (quorum) consistency, watching nodes go stale or writes get rejected depending on the mode. A hands-on look at the CAP theorem.
3. **Caching & CDN** — three regional edge caches in front of an origin, with TTL-based expiry, cache hits/misses, and a rolling hit-rate sparkline.
4. **Fault Tolerance & Failover** — a primary + replica cluster where killing the primary triggers heartbeat-miss detection and promotes a replica; a revive flow resyncs a dead node back in.

Each module has its own controls, live stats, and a scrolling event log narrating what's happening, plus a short note tying the toy version to the real thing it's modeled on (ALB/Envoy, DynamoDB/Spanner, Cloudflare/Fastly, Patroni/Sentinel).

## Running it

No install, no build. Either:

```bash
open index.html          # macOS
start index.html         # Windows
```

or serve it with any static file server, e.g.:

```bash
npx serve .
```

## Stack

Vanilla HTML, CSS, and JavaScript. No framework, no dependencies, no build tooling.

- `index.html` — markup and content structure
- `styles.css` — theming (CSS custom properties, light/dark) and layout
- `app.js` — the four simulations, plus the EN/TR i18n layer and theme toggle

---

## Türkçe

Bulut mimarilerinde sürekli karşımıza çıkan dört fikrin küçük, istemci taraflı bir simülasyonu: yük dengeleme ve otomatik ölçekleme, dağıtık tutarlılık, önbellekleme/CDN ve yük devretme. Arka uç yok, derleme adımı yok — `index.html` dosyasını açın, dört modül de tarayıcınızda canlı çalışır.

İngilizce ve Türkçe olarak kullanılabilir (üst çubuktaki dil seçici). Açık/koyu tema sisteminizi takip eder, elle de değiştirilebilir.
