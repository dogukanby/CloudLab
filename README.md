# CloudLab

[![Download for Windows](https://img.shields.io/badge/Download-Windows%20Installer-0f8f80?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/dogukanby/cloud-systems-console/releases/latest/download/CloudLab-Setup.exe)
[![Latest release](https://img.shields.io/github/v/release/dogukanby/cloud-systems-console?style=for-the-badge&label=release&color=333)](https://github.com/dogukanby/cloud-systems-console/releases/latest)

A small, single-page, client-side simulation of the ideas that show up in almost every cloud architecture — plus a plain-language module explaining what "the cloud" even is. No backend, no build step to just use it in a browser — open `index.html` and every module runs live.

Available in English and Turkish (toggle in the top bar). Light/dark theme follows your system by default, with a manual override. A built-in "Ask the Console" chat assistant (powered by Groq) lets visitors ask about anything they don't understand.

## Modules

0. **What Is "The Cloud," Really?** — a jargon-free explanation of cloud computing for anyone who's never thought about what happens after they hit "upload."
1. **Signing In: Federated & Passwordless** — simulated Google OAuth, email magic-link, and phone-OTP flows — client-side only, no real accounts, no real credentials.
2. **IAM: Permissions & Least Privilege** — attach permissions to a role, try actions against it, and watch a wildcard grant turn a leaked credential into full account access.
3. **VPC: Networks & Security Groups** — public vs. private subnets and security-group rules; a private instance stays unreachable from the internet no matter what the firewall says.
4. **EC2: Instances & Idle Cost** — launch, stop, and terminate instances, and watch cost accrue every second an instance runs — even at 0% load.
5. **S3: Object Storage & Versioning** — upload, delete, and restore versions of the same object; watch how versioning turns a delete into a recoverable marker instead of data loss, and how public-access settings actually gate exposure.
6. **Lambda: Serverless & Cold Starts** — invoke a function and watch the difference between a cold start (new execution environment) and a warm one, and how a burst of concurrent traffic after idle time forces cold starts across the board.
7. **Load Balancing & Auto-Scaling** — a server pool takes traffic under a strategy you pick (round robin / least connections / random), scales up under sustained load, scales down when idle.
8. **Elastic Beanstalk: Deploys & Rollback** — deploy a new version with an optional bug baked in, and watch the health check catch it and roll back automatically.
9. **Route 53: DNS Routing Policies** — simple, weighted, latency-based, and failover routing across three simulated regions.
10. **Caching & CDN** — three regional edge caches in front of an origin, with TTL-based expiry, cache hits/misses, and a rolling hit-rate sparkline.
11. **Distributed Consistency** — a 5-node cluster where you can split the network in two and write under eventual or strong (quorum) consistency, watching nodes go stale or writes get rejected depending on the mode. A hands-on look at the CAP theorem.
12. **Fault Tolerance & Failover** — a primary + replica cluster where killing the primary triggers heartbeat-miss detection and promotes a replica; a revive flow resyncs a dead node back in.
13. **SNS: One Event, Many Subscribers** — a published event fans out to Email/SMS/Queue subscribers at once, with retries and a dead-letter path on failure.
14. **CloudWatch: Monitoring & Alarms** — a live metric feeds an alarm that waits for three consecutive breaches before firing, and goes to a distinct "insufficient data" state if the agent stops reporting instead of silently assuming health.
15. **Snowball Edge: When the Network Loses** — a live calculator comparing network transfer time against physically shipping a device, with a real crossover point.

Every module pairs an "In plain terms" everyday analogy with a "Try this" checklist, a live simulation, and a "Real incident" — a fact-checked, real-world outage or breach the concept maps to (HealthCare.gov, Uber, GitHub, Fastly, GitLab, Capital One, Verizon/NICE Systems, Code Spaces, Knight Capital, Dyn, AWS Kinesis, two separate AWS US-EAST-1 incidents, and a Jack Dorsey SIM-swap), plus an "Under the hood" note tying it to the real service or pattern it's modeled on.

## Quests

A separate section below the modules puts you in the seat of someone who actually has to fix something, instead of just reading how it works: a realistic scenario, a broken state, and a mocked provider console with real decisions to make — wrong answers get a real-sounding rejection reason, not just a red X. Each quest has an Easy tier (the core fix) and a Hard tier (the full, real-world response, unlocking more steps on top of the easy ones).

Launched with six: fixing a broken Google sign-in, locking down a leaked AWS credential, stopping a public S3 data leak, sealing an internet-exposed database, failing DNS over to a healthy region, and catching a silently-failing service with a CloudWatch alarm.

## Ask the Console

A floating chat button opens a small assistant that can answer questions about anything on the page, in whichever language you ask in. It calls Groq's API (`llama-3.3-70b-versatile`) **directly from your browser** — there's no backend of ours in the loop.

That means it needs your own Groq API key: get a free one at [console.groq.com/keys](https://console.groq.com/keys) and paste it in when prompted. It's saved only in your browser's `localStorage`, sent only to Groq, and never touches this repo or any server. Don't paste keys you don't want visible to anyone using that browser profile.

## Download for Windows

The badge at the top links to a signed NSIS installer built from this same code with Electron — no browser required, just a desktop app. It's self-signed (see below), so **Windows SmartScreen will likely show an "unknown publisher" warning** the first time you run it: click **More info → Run anyway**. A self-signed certificate proves the file hasn't been tampered with since it was built; it doesn't buy reputation with Windows the way a paid certificate from a CA does.

You only need to download it once. After that, the installed app checks GitHub on launch and — if a newer version has been published — asks with a dialog before downloading or installing anything. Nothing updates silently without you clicking through it.

To build it yourself instead of trusting the release:

```bash
npm install
npm run dist        # outputs dist/CloudLab-Setup.exe (+ latest.yml + .blockmap)
```

### Publishing a new version (for maintainers)

`npm run dist` builds and signs the installer but never uploads anything (`--publish never`). Every release needs **all three** generated files — the installer alone isn't enough for already-installed apps to detect the update:

```bash
npm run dist
gh release create vX.Y.Z dist/CloudLab-Setup.exe dist/latest.yml dist/CloudLab-Setup.exe.blockmap \
  --title "CloudLab vX.Y.Z" --notes "…"
```

(Bump `"version"` in `package.json` first — `latest.yml` is generated from it.) Alternatively, `npm run release` with a `GH_TOKEN` environment variable set lets `electron-builder` create the release and upload all three files itself.

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

- `index.html` / `styles.css` / `app.js` — the app: sixteen modules, six quests, the chat widget, the EN/TR i18n layer, and the theme toggle
- `main.js` / `package.json` — the Electron shell, `electron-builder` packaging config, and the `electron-updater`-based update check

---

## Türkçe

Bulut mimarilerinde sürekli karşımıza çıkan fikirlerin küçük, istemci taraflı bir simülasyonu — ayrıca "bulut" gerçekte ne demek, onu da düz bir dille anlatan bir modül. Arka uç yok, sadece tarayıcıda kullanmak için derleme adımı yok — `index.html` dosyasını açın, tüm modüller tarayıcınızda canlı çalışır.

İngilizce ve Türkçe olarak kullanılabilir (üst çubuktaki dil seçici). Açık/koyu tema sisteminizi takip eder, elle de değiştirilebilir. Sağ alttaki "Konsola Sor" sohbet asistanı (Groq ile çalışır) anlamadığınız her şeyi sormanızı sağlar — kendi ücretsiz Groq API anahtarınızı gerektirir, sadece tarayıcınızda saklanır.

On altı modül: bulut nedir, oturum açma, IAM ve izinler, VPC, EC2, S3, Lambda, yük dengeleme, Elastic Beanstalk, Route 53, önbellekleme/CDN, dağıtık tutarlılık, yük devretme, SNS, CloudWatch ve Snowball Edge.

Modüllerin altında ayrı bir "Görevler" bölümü var: gerçekçi bir senaryo, bozuk bir durum, ve gerçek sonuçları olan kararlarla, bir şeyi düzeltmek zorunda olan kişinin yerine sizi koyuyor. Her görevin bir Kolay (temel düzeltme) ve bir Zor (tam gerçek dünya tepkisi) kademesi var.

Yukarıdaki rozet imzalı bir Windows kurulum dosyasına bağlanır. Kendinden imzalı bir sertifika kullanıldığından Windows SmartScreen ilk çalıştırmada "bilinmeyen yayımcı" uyarısı gösterebilir — **Diğer bilgiler → Yine de çalıştır** yeterli. Kurulumu yalnızca bir kez indirmeniz yeterli: uygulama her açılışta yeni bir sürüm olup olmadığını kontrol eder ve varsa, siz onaylamadan hiçbir şeyi indirip kurmaz.
