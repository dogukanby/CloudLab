# CloudLab

[![Download for Windows](https://img.shields.io/badge/Download-Windows%20Installer-0f8f80?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/dogukanby/cloud-systems-console/releases/latest/download/CloudLab-Setup.exe)
[![Latest release](https://img.shields.io/github/v/release/dogukanby/cloud-systems-console?style=for-the-badge&label=release&color=333)](https://github.com/dogukanby/cloud-systems-console/releases/latest)

A small, single-page, client-side simulation of the ideas that show up in almost every cloud architecture — plus a plain-language module explaining what "the cloud" even is. No backend, no build step to just use it in a browser — open `index.html` and every module runs live.

Available in English and Turkish (toggle in the top bar). Light/dark theme follows your system by default, with a manual override. A built-in "Ask the Console" chat assistant (powered by Groq) lets visitors ask about anything they don't understand.

## Modules

0. **What Is "The Cloud," Really?** — a jargon-free explanation of cloud computing for anyone who's never thought about what happens after they hit "upload."
1. **Load Balancing & Auto-Scaling** — a server pool takes traffic under a strategy you pick (round robin / least connections / random), scales up under sustained load, scales down when idle.
2. **Distributed Consistency** — a 5-node cluster where you can split the network in two and write under eventual or strong (quorum) consistency, watching nodes go stale or writes get rejected depending on the mode. A hands-on look at the CAP theorem.
3. **Caching & CDN** — three regional edge caches in front of an origin, with TTL-based expiry, cache hits/misses, and a rolling hit-rate sparkline.
4. **Fault Tolerance & Failover** — a primary + replica cluster where killing the primary triggers heartbeat-miss detection and promotes a replica; a revive flow resyncs a dead node back in.
5. **VPC: Networks & Security Groups** — public vs. private subnets and security-group rules; a private instance stays unreachable from the internet no matter what the firewall says.
6. **EC2: Instances & Idle Cost** — launch, stop, and terminate instances, and watch cost accrue every second an instance runs — even at 0% load.
7. **Elastic Beanstalk: Deploys & Rollback** — deploy a new version with an optional bug baked in, and watch the health check catch it and roll back automatically.
8. **Route 53: DNS Routing Policies** — simple, weighted, latency-based, and failover routing across three simulated regions.
9. **SNS: One Event, Many Subscribers** — a published event fans out to Email/SMS/Queue subscribers at once, with retries and a dead-letter path on failure.
10. **Snowball Edge: When the Network Loses** — a live calculator comparing network transfer time against physically shipping a device, with a real crossover point.
11. **Signing In: Federated & Passwordless** — simulated Google OAuth, email magic-link, and phone-OTP flows — client-side only, no real accounts, no real credentials.

Every module pairs an "In plain terms" everyday analogy with a "Try this" checklist, a live simulation, and a "Real incident" — a fact-checked, real-world outage or breach the concept maps to (HealthCare.gov, GitHub, Fastly, GitLab, Capital One, Code Spaces, Knight Capital, Dyn, AWS Kinesis, and a Jack Dorsey SIM-swap), plus an "Under the hood" note tying it to the real service or pattern it's modeled on.

## Ask the Console

A floating chat button opens a small assistant that can answer questions about anything on the page, in whichever language you ask in. It calls Groq's API (`llama-3.3-70b-versatile`) **directly from your browser** — there's no backend of ours in the loop.

That means it needs your own Groq API key: get a free one at [console.groq.com/keys](https://console.groq.com/keys) and paste it in when prompted. It's saved only in your browser's `localStorage`, sent only to Groq, and never touches this repo or any server. Don't paste keys you don't want visible to anyone using that browser profile.

## Download for Windows

The badge at the top links to a signed NSIS installer built from this same code with Electron — no browser required, just a desktop app. It's self-signed (see below), so **Windows SmartScreen will likely show an "unknown publisher" warning** the first time you run it: click **More info → Run anyway**. A self-signed certificate proves the file hasn't been tampered with since it was built; it doesn't buy reputation with Windows the way a paid certificate from a CA does.

To build it yourself instead of trusting the release:

```bash
npm install
npm run dist        # outputs dist/CloudLab-Setup.exe
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

- `index.html` / `styles.css` / `app.js` — the app: twelve modules plus the chat widget, the EN/TR i18n layer, and the theme toggle
- `main.js` / `package.json` — the Electron shell and `electron-builder` packaging config used to produce the Windows installer

---

## Türkçe

Bulut mimarilerinde sürekli karşımıza çıkan fikirlerin küçük, istemci taraflı bir simülasyonu — ayrıca "bulut" gerçekte ne demek, onu da düz bir dille anlatan bir modül. Arka uç yok, sadece tarayıcıda kullanmak için derleme adımı yok — `index.html` dosyasını açın, tüm modüller tarayıcınızda canlı çalışır.

İngilizce ve Türkçe olarak kullanılabilir (üst çubuktaki dil seçici). Açık/koyu tema sisteminizi takip eder, elle de değiştirilebilir. Sağ alttaki "Konsola Sor" sohbet asistanı (Groq ile çalışır) anlamadığınız her şeyi sormanızı sağlar — kendi ücretsiz Groq API anahtarınızı gerektirir, sadece tarayıcınızda saklanır.

On iki modül: bulut nedir, yük dengeleme, dağıtık tutarlılık, önbellekleme/CDN, yük devretme, VPC, EC2, Elastic Beanstalk, Route 53, SNS, Snowball Edge ve oturum açma akışları.

Yukarıdaki rozet imzalı bir Windows kurulum dosyasına bağlanır. Kendinden imzalı bir sertifika kullanıldığından Windows SmartScreen ilk çalıştırmada "bilinmeyen yayımcı" uyarısı gösterebilir — **Diğer bilgiler → Yine de çalıştır** yeterli.
