# Cloud Lab

[![Download for Windows](https://img.shields.io/badge/Download-Windows%20Installer-0f8f80?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/dogukanby/cloud-systems-console/releases/latest/download/Cloud-Lab-Setup.exe)
[![Latest release](https://img.shields.io/github/v/release/dogukanby/cloud-systems-console?style=for-the-badge&label=release&color=333)](https://github.com/dogukanby/cloud-systems-console/releases/latest)

A small, single-page, client-side simulation of the ideas that show up in almost every cloud architecture: load balancing & auto-scaling, distributed consistency, caching/CDNs, and failover — plus a plain-language module explaining what "the cloud" even is. No backend, no build step to just use it in a browser — open `index.html` and every module runs live.

Available in English and Turkish (toggle in the top bar). Light/dark theme follows your system by default, with a manual override. A built-in "Ask the Console" chat assistant (powered by Groq) lets visitors ask about anything they don't understand.

## Modules

0. **What Is "The Cloud," Really?** — a jargon-free explanation of cloud computing for anyone who's never thought about what happens after they hit "upload."
1. **Load Balancing & Auto-Scaling** — a server pool takes traffic under a strategy you pick (round robin / least connections / random), scales up under sustained load, scales down when idle.
2. **Distributed Consistency** — a 5-node cluster where you can split the network in two and write under eventual or strong (quorum) consistency, watching nodes go stale or writes get rejected depending on the mode. A hands-on look at the CAP theorem.
3. **Caching & CDN** — three regional edge caches in front of an origin, with TTL-based expiry, cache hits/misses, and a rolling hit-rate sparkline.
4. **Fault Tolerance & Failover** — a primary + replica cluster where killing the primary triggers heartbeat-miss detection and promotes a replica; a revive flow resyncs a dead node back in.

Modules 1–4 each pair an "In plain terms" everyday analogy (grocery checkout lines, group texts, a desk drawer of snacks, a substitute teacher) with an "Under the hood" note tying it to the real thing it's modeled on (ALB/Envoy, DynamoDB/Spanner, Cloudflare/Fastly, Patroni/Sentinel) — plus its own controls, live stats, and a scrolling event log narrating what's happening.

## Ask the Console

A floating chat button opens a small assistant that can answer questions about anything on the page, in whichever language you ask in. It calls Groq's API (`llama-3.3-70b-versatile`) **directly from your browser** — there's no backend of ours in the loop.

That means it needs your own Groq API key: get a free one at [console.groq.com/keys](https://console.groq.com/keys) and paste it in when prompted. It's saved only in your browser's `localStorage`, sent only to Groq, and never touches this repo or any server. Don't paste keys you don't want visible to anyone using that browser profile.

## Download for Windows

The badge at the top links to a signed NSIS installer built from this same code with Electron — no browser required, just a desktop app. It's self-signed (see below), so **Windows SmartScreen will likely show an "unknown publisher" warning** the first time you run it: click **More info → Run anyway**. A self-signed certificate proves the file hasn't been tampered with since it was built; it doesn't buy reputation with Windows the way a paid certificate from a CA does.

To build it yourself instead of trusting the release:

```bash
npm install
npm run dist        # outputs dist/Cloud-Lab-Setup.exe
```

## Running it in a browser

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

Vanilla HTML, CSS, and JavaScript for the app itself — no framework, no build tooling. Electron wraps it for the desktop build.

- `index.html` / `styles.css` / `app.js` — the app: five modules (incl. the chat widget), the EN/TR i18n layer, and the theme toggle
- `main.js` / `package.json` — the Electron shell and `electron-builder` packaging config used to produce the Windows installer

---

## Türkçe

Bulut mimarilerinde sürekli karşımıza çıkan fikirlerin küçük, istemci taraflı bir simülasyonu: yük dengeleme ve otomatik ölçekleme, dağıtık tutarlılık, önbellekleme/CDN ve yük devretme — ayrıca "bulut" gerçekte ne demek, onu da düz bir dille anlatan bir modül. Arka uç yok, sadece tarayıcıda kullanmak için derleme adımı yok — `index.html` dosyasını açın, tüm modüller tarayıcınızda canlı çalışır.

İngilizce ve Türkçe olarak kullanılabilir (üst çubuktaki dil seçici). Açık/koyu tema sisteminizi takip eder, elle de değiştirilebilir. Sağ alttaki "Konsola Sor" sohbet asistanı (Groq ile çalışır) anlamadığınız her şeyi sormanızı sağlar — kendi ücretsiz Groq API anahtarınızı gerektirir, sadece tarayıcınızda saklanır.

Yukarıdaki rozet imzalı bir Windows kurulum dosyasına bağlanır. Kendinden imzalı bir sertifika kullanıldığından Windows SmartScreen ilk çalıştırmada "bilinmeyen yayımcı" uyarısı gösterebilir — **Diğer bilgiler → Yine de çalıştır** yeterli.
