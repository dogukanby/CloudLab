(function(){
  "use strict";
  const $ = (sel, root) => (root||document).querySelector(sel);

  /* ============ i18n dictionary ============ */
  const dict = {
    en: {
      common: {
        wordmark:"Cloud Lab",
        nav:{ cloud101:"00 What is the cloud?", lb:"01 Load balancing", consistency:"02 Consistency", cache:"03 Caching", failover:"04 Failover" },
        uptime:"UPTIME",
        themeAuto:"Theme: Auto", themeLight:"Theme: Light", themeDark:"Theme: Dark",
        pageTitle:"Cloud Lab",
        statusChanged:"status → {status}",
        analogyLabel:"In plain terms", technicalLabel:"Under the hood",
        tryThisLabel:"Try this", realIncidentLabel:"Real incident",
        footer:"Everything above runs client-side in JavaScript — no real servers, nodes, or network calls involved.",
        resetAll:"Reset all modules"
      },
      cloud101:{
        modId:"MODULE 00", title:"What Is \"The Cloud,\" Really?",
        p1:"When you save a photo, send a message, or stream a video, it usually doesn't stay on your phone or laptop — it travels to a computer somewhere else, does its job, and sends the result back. That's the cloud: not a mysterious place in the sky, just someone else's computers — owned by companies like Amazon, Google, or Microsoft — built to serve millions of people at once, all day, every day, without going down.",
        p2:"Making that work — never going down, never running out of room, never getting confused about who changed what last — takes a handful of core tricks that every cloud provider relies on. The four modules below let you play with each one and watch, live, what's actually happening underneath a phrase like \"it's in the cloud.\""
      },
      intro:{
        title:"Cloud systems, taken apart",
        p:"Four small, live simulations of the mechanisms that keep large systems running — no real servers behind any of it, just the logic. Turn the dials and watch what actually happens under load, under a network partition, under a cache miss, under a failure.",
        meta:"4 modules · runs entirely in your browser · no real infrastructure"
      },
      lb:{
        modId:"MODULE 01", title:"Load Balancing & Auto-Scaling",
        dek:"Requests arrive faster than any one server can handle, so a balancer spreads them across a pool — and spins up new servers when the pool falls behind.",
        analogy:"Think of a grocery store at rush hour: one checkout lane backs up fast, so the manager opens more lanes as the line grows — and closes them again once it's quiet. That's load balancing and auto-scaling: spreading customers (requests) across cashiers (servers), and adding or removing cashiers as needed.",
        incoming:"Incoming traffic", node:"LOAD BALANCER",
        rateLabel:"Traffic rate —", rateUnit:"req/s",
        strategyLabel:"Balancing strategy", strategyRR:"Round robin", strategyLeast:"Least connections", strategyRandom:"Random",
        autoLabel:"Auto-scaling enabled", spikeBtn:"Send traffic spike",
        statServers:"Active servers", statUtil:"Avg utilization", statHandled:"Requests handled", statDropped:"Requests dropped",
        note:"Mirrors an ALB / Envoy / nginx pool sitting in front of an auto-scaling group: distribute connections by policy, watch utilization, add capacity when it's sustained, remove it when it's wasted.",
        tryStep1:"Drag traffic rate up past ~40 req/s and watch the pool grow on its own.",
        tryStep2:"Turn off auto-scaling, then push the rate up again — watch requests start dropping instead.",
        tryStep3:"Switch the strategy to \"Random\" and compare how evenly the load spreads versus round robin.",
        incident:{
          meta:"HealthCare.gov · October 2013",
          body:"When HealthCare.gov launched on October 1, 2013, the government expected 50,000–60,000 concurrent users. It got 250,000 in the first two hours — and the site had only been load-tested at 2,000 concurrent users. With no real capacity plan or auto-scaling behind it, the site collapsed almost immediately; on day one, only six people successfully enrolled."
        },
        status:{ stable:"STABLE", degraded:"DEGRADED", overloaded:"OVERLOADED" },
        log:{
          poolInit:"pool initialized with {n} servers",
          provisioned:"server-{id} provisioned — joining pool",
          scaledDown:"server-{id} idle — scaled down",
          spike:"traffic spike injected"
        }
      },
      consistency:{
        modId:"MODULE 02", title:"Distributed Consistency",
        dek:"Copies of the same data live on five machines. When a write happens, how fast — and how safely — do the copies agree?",
        analogy:"Imagine texting your friends in different cities that the plan changed. Do you wait until everyone has replied \"got it\" before you consider it official — slower, but nobody shows up confused? Or do you just send it and move on, trusting they'll catch up — faster, but for a moment someone might still be working off the old plan. That trade-off is what \"consistency\" means for computers holding copies of the same data.",
        partitionLabel:"Split the network into {N1,N2,N3} | {N4,N5}",
        modeLabel:"Consistency mode", modeEventual:"Eventual", modeStrong:"Strong (quorum)",
        lagLabel:"Replication lag —",
        writeBtn:"Write new value to selected node",
        statTarget:"Write target", statMode:"Mode", statCommitted:"Committed", statNetwork:"Network",
        networkJoined:"JOINED", networkSplit:"SPLIT",
        badgeLatest:"latest", badgeStale:"stale", grpLabel:"grp",
        note:"This is the CAP theorem in miniature: under a partition, a system stays available (eventual) or stays consistent (strong/quorum) — rarely both. DynamoDB and Cassandra default to eventual; Spanner and etcd default to strong.",
        tryStep1:"Turn on the network split, then write a value under Eventual — watch one side go stale.",
        tryStep2:"Switch to Strong and write again while still split — the write should get rejected.",
        tryStep3:"Turn the split back off and watch the stale side catch up automatically.",
        incident:{
          meta:"GitHub · October 2018",
          body:"On October 21, 2018, a 43-second network blip between two of GitHub's data centers was enough to split its database cluster in two. Both sides kept accepting writes the other didn't have. To avoid silently losing or corrupting data, GitHub chose consistency over availability — and spent the next 24 hours in a degraded state while it reconciled the two histories by hand."
        },
        status:{ consistent:"CONSISTENT", partitioned:"PARTITIONED", converging:"CONVERGING" },
        log:{
          init:"5-node cluster online, all synced at v0",
          partition:"network partition: {N1,N2,N3} | {N4,N5}",
          writeLocal:"WRITE v{value} → {target} committed locally (eventual)",
          replicated:"{node} replicated v{value}",
          rejected:"WRITE v{value} REJECTED — {reachable}/{total} reachable, need {quorum} for quorum",
          proposed:"WRITE v{value} proposed at {target}, awaiting quorum...",
          quorumReached:"quorum reached ({reachable}/{total}) — v{value} committed",
          healed:"{node} caught up to v{value} after partition healed"
        }
      },
      cache:{
        modId:"MODULE 03", title:"Caching & CDN",
        dek:"Edge caches sit between clients and the origin so repeat requests don't have to travel as far. A hit is fast; a miss pays the round trip once and remembers it.",
        analogy:"It's like keeping snacks in your desk drawer instead of walking to the kitchen every time you're hungry. Grabbing from the drawer (a cache hit) is instant; the first trip to restock it (a cache miss) takes longer — and eventually the snacks go stale and need replacing. That's caching and CDNs, just for web pages instead of chips.",
        origin:"ORIGIN — authoritative source",
        edgeEU:"EDGE — EU", edgeUS:"EDGE — US", edgeAPAC:"EDGE — APAC",
        edgeEUOpt:"EU", edgeUSOpt:"US", edgeAPACOpt:"APAC",
        cachedCount:"{n} cached",
        hitRateLabel:"Hit rate, rolling",
        keyLabel:"Key", edgeSelectLabel:"Client's nearest edge",
        sendBtn:"Send request", ttlLabel:"Cache TTL —",
        autoLabel:"Simulate live traffic", purgeBtn:"Purge all caches",
        statHitRate:"Hit rate", statRequests:"Requests", statKeys:"Cached keys", statPurges:"Purges",
        note:"Real CDNs (Cloudflare, Fastly, CloudFront) work the same way: edge PoPs cache by TTL or explicit purge. A low hit rate usually means TTLs are too short, or the content is too personalized to cache at all.",
        tryStep1:"Request the same key twice from the same edge — the second one should be a hit.",
        tryStep2:"Now request it from a different edge — first time there is always a miss.",
        tryStep3:"Drop the TTL slider low and watch entries expire out of the cache in real time.",
        incident:{
          meta:"Fastly · June 2021",
          body:"On June 8, 2021, a single customer changed a routine CDN configuration setting — and triggered a dormant software bug that had been sitting in Fastly's edge network since a May update. Within minutes, about 85% of Fastly's network started failing, taking down Reddit, Amazon, the UK government's website, and huge parts of the web with it — a reminder that even the cache layer meant to add resilience can become a single point of failure."
        },
        status:{ warming:"WARMING", warm:"WARM", cooling:"COOLING", cold:"COLD" },
        log:{
          init:"3 edge regions online, caches empty",
          hit:"EDGE-{name}: HIT {key} (~{ms}ms)",
          miss:"EDGE-{name}: MISS {key} — fetching origin...",
          cached:"EDGE-{name}: cached {key} for {ttl}s",
          purged:"all edge caches purged"
        }
      },
      failover:{
        modId:"MODULE 04", title:"Fault Tolerance & Failover",
        dek:"One node in the cluster does the writing. If it disappears, something else has to notice, take over, and keep serving — without anyone downstream needing to know it happened.",
        analogy:"Picture a classroom with a substitute teacher on standby down the hall. If the main teacher suddenly can't continue, someone who already knows the class steps in — so the lesson keeps going and most students barely notice the switch. That's failover: a backup that's ready to take over the moment the primary goes quiet.",
        targetLabel:"Target node", killBtn:"Kill selected node", reviveBtn:"Revive last failed node",
        statHealthy:"Healthy nodes", statPrimary:"Current primary", statFailovers:"Failovers", statQueue:"Down queue",
        note:"Production clusters (Postgres + Patroni, Redis Sentinel, Kubernetes leader election) use the same shape: heartbeats, a detection timeout, then a promotion step — tuned so failover is fast but a network blip doesn't trigger a false alarm.",
        tryStep1:"Kill the primary and watch the log walk through detection, then promotion.",
        tryStep2:"Try reviving it — notice it rejoins as a replica, not primary again.",
        tryStep3:"Kill two nodes in a row and see what happens when no healthy replica is left.",
        incident:{
          meta:"GitLab · January 2017",
          body:"On January 31, 2017, a GitLab engineer trying to fix replication lag ran a delete command against the wrong database — the live primary, not a replica — removing around 300GB of production data. That's what backups and replicas are for. Except when they checked, most of GitLab's backup mechanisms had been failing silently for weeks. Only one recovery option worked, and it was six hours old — the redundancy existed on paper, but nobody had tested that it actually failed over."
        },
        status:{ healthy:"HEALTHY", degraded:"DEGRADED", critical:"CRITICAL" },
        role:{ primary:"PRIMARY", replica:"REPLICA" },
        health:{ healthy:"HEALTHY", down:"DOWN", detecting:"DETECTING", syncing:"SYNCING" },
        targetOption:"{id} — {role} ({status})",
        primaryNone:"— none —", primaryDownSuffix:" (down)",
        log:{
          init:"cluster online — N1 is primary",
          alreadyDown:"{id} is already down or failing",
          heartbeat1:"{id} missed heartbeat (1/3)",
          heartbeat3:"{id} missed heartbeat (3/3) — marking DOWN",
          promoting:"promoting {id} to PRIMARY",
          rerouted:"traffic rerouted to {id}",
          noReplica:"no healthy replica available — cluster has no primary",
          rejoining:"{id} rejoining — syncing from primary",
          backHealthy:"{id} healthy — back in rotation as replica"
        }
      },
      chat:{
        title:"Ask the Console", fabAria:"Ask a question", closeAria:"Close",
        setupIntro:"This runs entirely in your browser through Groq's free API — nothing is sent anywhere except directly to Groq. Paste your own key to turn it on; it's saved only on this device, never on any server.",
        keyLabel:"Groq API key", saveKey:"Save key", getKey:"Get a free key at console.groq.com",
        placeholder:"Ask about load balancing, consistency, caching, failover…", send:"Send",
        forgetKey:"Remove saved key",
        thinking:"…thinking",
        you:"You", bot:"Console",
        errorAuth:"That key didn't work. Double-check it at console.groq.com/keys.",
        errorRate:"Groq is rate-limiting this key right now. Wait a bit and try again.",
        errorGeneric:"Something went wrong reaching Groq. Try again in a moment."
      }
    },
    tr: {
      common: {
        wordmark:"Bulut Laboratuvarı",
        nav:{ cloud101:"00 Bulut nedir?", lb:"01 Yük dengeleme", consistency:"02 Tutarlılık", cache:"03 Önbellekleme", failover:"04 Yük devretme" },
        uptime:"ÇALIŞMA SÜRESİ",
        themeAuto:"Tema: Otomatik", themeLight:"Tema: Açık", themeDark:"Tema: Koyu",
        pageTitle:"Bulut Laboratuvarı",
        statusChanged:"durum → {status}",
        analogyLabel:"Basitçe söylemek gerekirse", technicalLabel:"Perde arkasında",
        tryThisLabel:"Dene bunu", realIncidentLabel:"Gerçek olay",
        footer:"Yukarıdaki her şey tarayıcınızda JavaScript ile çalışır — gerçek sunucu, düğüm veya ağ isteği yoktur.",
        resetAll:"Tüm modülleri sıfırla"
      },
      cloud101:{
        modId:"MODÜL 00", title:"\"Bulut\" Gerçekte Nedir?",
        p1:"Bir fotoğraf kaydettiğinizde, bir mesaj gönderdiğinizde ya da bir video izlediğinizde, bu genelde telefonunuzda ya da bilgisayarınızda kalmaz — başka bir yerdeki bir bilgisayara gider, işini yapar ve sonucu geri gönderir. İşte bulut budur: gökyüzünde gizemli bir yer değil, sadece başkasının bilgisayarları — Amazon, Google ya da Microsoft gibi şirketlere ait — milyonlarca kişiye aynı anda, gün boyu, hiç durmadan hizmet verecek şekilde inşa edilmiş.",
        p2:"Bunun çalışmasını sağlamak — hiç durmamak, hiç yer bitirmemek, en son kimin neyi değiştirdiği konusunda hiç kafası karışmamak — her bulut sağlayıcısının dayandığı birkaç temel yönteme bağlı. Aşağıdaki dört modül, her birini canlı olarak deneyip \"bulutta\" demenin altında gerçekte ne olduğunu izlemenizi sağlıyor."
      },
      intro:{
        title:"Bulut sistemleri, parçalarına ayrıldı",
        p:"Büyük sistemleri ayakta tutan mekanizmaların dört küçük, canlı simülasyonu — arkasında gerçek sunucu yok, sadece mantık. Kadranları çevirin ve yük altında, bir ağ bölünmesinde, bir önbellek ıskalamasında, bir arızada gerçekte ne olduğunu izleyin.",
        meta:"4 modül · tamamen tarayıcınızda çalışır · gerçek altyapı yok"
      },
      lb:{
        modId:"MODÜL 01", title:"Yük Dengeleme ve Otomatik Ölçekleme",
        dek:"İstekler tek bir sunucunun kaldırabileceğinden daha hızlı geliyor; bu yüzden bir dengeleyici onları bir havuza dağıtır — ve havuz yetişemediğinde yeni sunucular devreye sokar.",
        analogy:"Yoğun saatteki bir marketi düşünün: tek bir kasa hızla kuyruk yapar, bu yüzden müdür kuyruk uzadıkça yeni kasalar açar — sakinleşince de kapatır. Yük dengeleme ve otomatik ölçekleme tam olarak bu: müşterileri (istekleri) kasiyerlere (sunuculara) dağıtmak, gerektikçe kasiyer eklemek ya da azaltmak.",
        incoming:"Gelen trafik", node:"YÜK DENGELEYİCİ",
        rateLabel:"Trafik oranı —", rateUnit:"istek/sn",
        strategyLabel:"Dengeleme stratejisi", strategyRR:"Sırayla (round robin)", strategyLeast:"En az bağlantı", strategyRandom:"Rastgele",
        autoLabel:"Otomatik ölçekleme etkin", spikeBtn:"Trafik ani yükselmesi gönder",
        statServers:"Aktif sunucu", statUtil:"Ort. kullanım", statHandled:"İşlenen istek", statDropped:"Düşürülen istek",
        note:"Bir ALB / Envoy / nginx havuzunun bir otomatik ölçekleme grubunun önünde durmasıyla aynı mantık: bağlantıları bir politikaya göre dağıt, kullanımı izle, sürdürülebilir bir yük artışında kapasite ekle, israf olduğunda kaldır.",
        tryStep1:"Trafik oranını ~40 istek/sn üzerine çekin ve havuzun kendiliğinden büyümesini izleyin.",
        tryStep2:"Otomatik ölçeklemeyi kapatın, oranı tekrar yükseltin — bu kez isteklerin düşmeye başladığını görün.",
        tryStep3:"Stratejiyi \"Rastgele\" yapın ve yükün round robin'e göre ne kadar dengeli dağıldığını karşılaştırın.",
        incident:{
          meta:"HealthCare.gov · Ekim 2013",
          body:"HealthCare.gov, 1 Ekim 2013'te açıldığında hükümet aynı anda 50-60 bin kullanıcı bekliyordu. İlk iki saatte 250 bin kullanıcı geldi — oysa site sadece 2 bin eşzamanlı kullanıcıyla test edilmişti. Gerçek bir kapasite planı ya da otomatik ölçekleme olmadan site neredeyse anında çöktü; ilk gün sadece altı kişi başvurusunu tamamlayabildi."
        },
        status:{ stable:"KARARLI", degraded:"YÜK ALTINDA", overloaded:"AŞIRI YÜKLÜ" },
        log:{
          poolInit:"havuz {n} sunucuyla başlatıldı",
          provisioned:"sunucu-{id} sağlandı — havuza katılıyor",
          scaledDown:"sunucu-{id} boşta — ölçek küçültüldü",
          spike:"trafik ani yükselmesi enjekte edildi"
        }
      },
      consistency:{
        modId:"MODÜL 02", title:"Dağıtık Tutarlılık",
        dek:"Aynı verinin kopyaları beş makinede yaşıyor. Bir yazma işlemi olduğunda, kopyalar ne kadar hızlı — ve ne kadar güvenli — anlaşıyor?",
        analogy:"Farklı şehirlerdeki arkadaşlarınıza planın değiştiğini yazdığınızı düşünün. Herkes \"anladım\" diyene kadar bekleyip mi resmiyet kazandırırsınız — daha yavaş ama kimse kafası karışık gelmez? Yoksa gönderip devam mı edersiniz, yetişeceklerine güvenerek — daha hızlı ama bir an için biri hâlâ eski planla hareket ediyor olabilir. İşte aynı verinin kopyalarını tutan bilgisayarlar için \"tutarlılık\" tam olarak bu ödünleşim.",
        partitionLabel:"Ağı {N1,N2,N3} | {N4,N5} olarak ikiye ayır",
        modeLabel:"Tutarlılık modu", modeEventual:"Sonunda tutarlı (eventual)", modeStrong:"Güçlü (quorum)",
        lagLabel:"Çoğaltma gecikmesi —",
        writeBtn:"Seçili düğüme yeni değer yaz",
        statTarget:"Yazma hedefi", statMode:"Mod", statCommitted:"Uygulanan", statNetwork:"Ağ",
        networkJoined:"BİRLEŞİK", networkSplit:"BÖLÜNMÜŞ",
        badgeLatest:"güncel", badgeStale:"eski", grpLabel:"grp",
        note:"Bu, minyatür bir CAP teoremi: bir ağ bölünmesinde sistem ya erişilebilir kalır (eventual) ya da tutarlı kalır (strong/quorum) — nadiren ikisi birden. DynamoDB ve Cassandra varsayılan olarak eventual; Spanner ve etcd varsayılan olarak strong kullanır.",
        tryStep1:"Ağ bölünmesini açın, sonra Eventual modda bir değer yazın — bir tarafın nasıl eskidiğini izleyin.",
        tryStep2:"Strong moda geçin ve hâlâ bölünmüşken tekrar yazın — yazma reddedilmeli.",
        tryStep3:"Bölünmeyi tekrar kapatın ve eski kalan tarafın kendiliğinden yetiştiğini izleyin.",
        incident:{
          meta:"GitHub · Ekim 2018",
          body:"21 Ekim 2018'de, GitHub'ın iki veri merkezi arasında yaşanan 43 saniyelik bir ağ kesintisi, veritabanı kümesini ikiye bölmeye yetti. Her iki taraf da diğerinde olmayan yazmaları kabul etmeye devam etti. Veriyi sessizce kaybetmemek ya da bozmamak için GitHub erişilebilirlik yerine tutarlılığı seçti — ve iki geçmişi elle uzlaştırırken sonraki 24 saati düşük performansla geçirdi."
        },
        status:{ consistent:"TUTARLI", partitioned:"BÖLÜNDÜ", converging:"YAKINSIYOR" },
        log:{
          init:"5 düğümlü küme çevrimiçi, tümü v0 sürümünde senkron",
          partition:"ağ bölünmesi: {N1,N2,N3} | {N4,N5}",
          writeLocal:"YAZMA v{value} → {target} yerel olarak uygulandı (eventual)",
          replicated:"{node}, v{value} sürümünü çoğalttı",
          rejected:"YAZMA v{value} REDDEDİLDİ — {reachable}/{total} erişilebilir, quorum için {quorum} gerekli",
          proposed:"YAZMA v{value}, {target} düğümünde önerildi, quorum bekleniyor...",
          quorumReached:"quorum sağlandı ({reachable}/{total}) — v{value} uygulandı",
          healed:"{node}, bölünme iyileştikten sonra v{value} sürümüne yetişti"
        }
      },
      cache:{
        modId:"MODÜL 03", title:"Önbellekleme ve CDN",
        dek:"Uç önbellekler istemciler ile kaynak arasında durur; böylece tekrarlanan istekler o kadar uzağa gitmek zorunda kalmaz. İsabet hızlıdır; ıskalama gidiş-dönüşü bir kez öder ve sonucu hatırlar.",
        analogy:"Her acıktığınızda mutfağa gitmek yerine masanızın çekmecesinde atıştırmalık bulundurmak gibi. Çekmeceden almak (önbellek isabeti) anındadır; ilk kez stok yapmak için gitmek (önbellek ıskalaması) daha uzun sürer — ve zamanla atıştırmalıklar bayatlar, değiştirilmesi gerekir. Önbellekleme ve CDN'ler de tam olarak bu, sadece cips yerine web sayfaları için.",
        origin:"KAYNAK — yetkili sunucu",
        edgeEU:"UÇ — AB", edgeUS:"UÇ — ABD", edgeAPAC:"UÇ — APAC",
        edgeEUOpt:"AB", edgeUSOpt:"ABD", edgeAPACOpt:"APAC",
        cachedCount:"{n} önbellekte",
        hitRateLabel:"İsabet oranı (kayan)",
        keyLabel:"Anahtar", edgeSelectLabel:"İstemciye en yakın uç",
        sendBtn:"İstek gönder", ttlLabel:"Önbellek TTL —",
        autoLabel:"Canlı trafiği simüle et", purgeBtn:"Tüm önbellekleri temizle",
        statHitRate:"İsabet oranı", statRequests:"İstekler", statKeys:"Önbellekteki anahtar", statPurges:"Temizlemeler",
        note:"Gerçek CDN'ler (Cloudflare, Fastly, CloudFront) aynı şekilde çalışır: uç PoP'lar TTL'ye veya açık bir temizlemeye göre önbellekler. Düşük isabet oranı genelde TTL'lerin çok kısa olduğu, ya da içeriğin önbelleklenemeyecek kadar kişiselleştirilmiş olduğu anlamına gelir.",
        tryStep1:"Aynı anahtarı aynı uçtan iki kez isteyin — ikincisi isabet olmalı.",
        tryStep2:"Şimdi farklı bir uçtan isteyin — ilk seferde her zaman ıskalama olur.",
        tryStep3:"TTL kaydırıcısını düşürün ve girişlerin gerçek zamanlı olarak önbellekten düştüğünü izleyin.",
        incident:{
          meta:"Fastly · Haziran 2021",
          body:"8 Haziran 2021'de tek bir müşteri, rutin bir CDN ayarını değiştirdi — ve bu, Fastly'nin uç ağında Mayıs ayındaki bir güncellemeden beri gizli kalmış bir yazılım hatasını tetikledi. Dakikalar içinde Fastly ağının yaklaşık %85'i hata vermeye başladı; Reddit, Amazon, İngiltere hükümetinin sitesi ve web'in büyük bir kısmı çöktü — dayanıklılık katmanı olması gereken önbelleğin de tek arıza noktasına dönüşebileceğinin bir hatırlatması."
        },
        status:{ warming:"ISINIYOR", warm:"SICAK", cooling:"SOĞUYOR", cold:"SOĞUK" },
        log:{
          init:"3 uç bölge çevrimiçi, önbellekler boş",
          hit:"UÇ-{name}: İSABET {key} (~{ms}ms)",
          miss:"UÇ-{name}: ISKALAMA {key} — kaynağa gidiliyor...",
          cached:"UÇ-{name}: {key} {ttl}sn önbelleğe alındı",
          purged:"tüm uç önbellekleri temizlendi"
        }
      },
      failover:{
        modId:"MODÜL 04", title:"Hata Toleransı ve Yük Devretme",
        dek:"Kümedeki bir düğüm yazma işini yapar. Kaybolursa, başka bir şeyin bunu fark etmesi, devralması ve servise devam etmesi gerekir — akış aşağısındaki hiç kimsenin bunu fark etmesine gerek kalmadan.",
        analogy:"Koridorun ilerisinde hazırda bekleyen bir vekil öğretmenli bir sınıf düşünün. Asıl öğretmen aniden derse devam edemezse, sınıfı zaten tanıyan biri devreye girer — ders devam eder ve çoğu öğrenci değişikliği neredeyse fark etmez. Yük devretme (failover) tam olarak bu: birincil sessiz kaldığı anda devralmaya hazır bir yedek.",
        targetLabel:"Hedef düğüm", killBtn:"Seçili düğümü çökert", reviveBtn:"Son arızalanan düğümü canlandır",
        statHealthy:"Sağlıklı düğüm", statPrimary:"Mevcut birincil", statFailovers:"Yük devretme", statQueue:"Devre dışı sırası",
        note:"Üretim kümeleri (Postgres + Patroni, Redis Sentinel, Kubernetes lider seçimi) aynı yapıyı kullanır: kalp atışları, bir tespit zaman aşımı, sonra bir yükseltme adımı — yük devretme hızlı olsun ama kısa bir ağ kesintisi yanlış alarm tetiklemesin diye ayarlanmış.",
        tryStep1:"Birincili çökertin ve günlüğün tespitten yükseltmeye nasıl ilerlediğini izleyin.",
        tryStep2:"Onu canlandırmayı deneyin — birincil olarak değil, yedek olarak yeniden katıldığına dikkat edin.",
        tryStep3:"Art arda iki düğümü çökertin ve sağlıklı yedek kalmadığında ne olduğunu görün.",
        incident:{
          meta:"GitLab · Ocak 2017",
          body:"31 Ocak 2017'de, çoğaltma gecikmesini düzeltmeye çalışan bir GitLab mühendisi, yanlış veritabanına — yedeğe değil, canlı birincile — bir silme komutu çalıştırarak yaklaşık 300GB üretim verisini sildi. Yedekler ve replikalar tam olarak bunun için var. Ama kontrol ettiklerinde, GitLab'ın yedekleme mekanizmalarının çoğunun haftalardır sessizce başarısız olduğunu gördüler. Tek çalışan kurtarma seçeneği altı saat eskiydi — yedeklilik kağıt üzerinde vardı, ama kimse gerçekten devreye girip girmediğini test etmemişti."
        },
        status:{ healthy:"SAĞLIKLI", degraded:"ZAYIFLADI", critical:"KRİTİK" },
        role:{ primary:"BİRİNCİL", replica:"YEDEK" },
        health:{ healthy:"SAĞLIKLI", down:"DEVRE DIŞI", detecting:"TESPİT EDİLİYOR", syncing:"SENKRONİZE EDİLİYOR" },
        targetOption:"{id} — {role} ({status})",
        primaryNone:"— yok —", primaryDownSuffix:" (devre dışı)",
        log:{
          init:"küme çevrimiçi — N1 birincil",
          alreadyDown:"{id} zaten devre dışı veya arızalanıyor",
          heartbeat1:"{id} kalp atışını kaçırdı (1/3)",
          heartbeat3:"{id} kalp atışını kaçırdı (3/3) — DEVRE DIŞI işaretleniyor",
          promoting:"{id} BİRİNCİL olarak yükseltiliyor",
          rerouted:"trafik {id} düğümüne yönlendirildi",
          noReplica:"sağlıklı yedek yok — kümede birincil düğüm kalmadı",
          rejoining:"{id} yeniden katılıyor — birincilden senkronize ediliyor",
          backHealthy:"{id} sağlıklı — yedek olarak rotasyona döndü"
        }
      },
      chat:{
        title:"Konsola Sor", fabAria:"Bir soru sor", closeAria:"Kapat",
        setupIntro:"Bu tamamen tarayıcınızda, Groq'un ücretsiz API'si üzerinden çalışır — hiçbir şey Groq dışında bir yere gönderilmez. Etkinleştirmek için kendi anahtarınızı yapıştırın; sadece bu cihazda saklanır, hiçbir sunucuda değil.",
        keyLabel:"Groq API anahtarı", saveKey:"Anahtarı kaydet", getKey:"console.groq.com adresinden ücretsiz anahtar alın",
        placeholder:"Yük dengeleme, tutarlılık, önbellekleme, yük devretme hakkında sorun…", send:"Gönder",
        forgetKey:"Kayıtlı anahtarı kaldır",
        thinking:"…düşünüyor",
        you:"Siz", bot:"Konsol",
        errorAuth:"Bu anahtar çalışmadı. console.groq.com/keys üzerinden kontrol edin.",
        errorRate:"Groq şu anda bu anahtarı sınırlıyor. Biraz bekleyip tekrar deneyin.",
        errorGeneric:"Groq'a ulaşırken bir şeyler ters gitti. Birazdan tekrar deneyin."
      }
    }
  };

  const LANG_KEY="csc-lang", THEME_KEY="csc-theme";
  let currentLang = localStorage.getItem(LANG_KEY) || (((navigator.language||"").toLowerCase().indexOf("tr")===0) ? "tr" : "en");
  let themeMode = localStorage.getItem(THEME_KEY) || "auto";
  let stateEpoch = 0; // bumped by resetAllModules() so in-flight setTimeouts from before a reset become no-ops

  function t(path, vars){
    const parts=path.split(".");
    let node=dict[currentLang];
    for(let i=0;i<parts.length;i++){ node = node && node[parts[i]]; }
    if(typeof node !== "string"){
      node=dict.en;
      for(let i=0;i<parts.length;i++){ node = node && node[parts[i]]; }
    }
    if(typeof node !== "string") return path;
    if(vars){
      Object.keys(vars).forEach(function(k){
        node = node.split("{"+k+"}").join(vars[k]);
      });
    }
    return node;
  }
  function applyStaticI18n(){
    document.documentElement.lang = currentLang;
    document.title = t("common.pageTitle");
    document.querySelectorAll("[data-i18n]").forEach(function(el){
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function(el){
      el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function(el){
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
  }
  function fmtTime(d){ return d.toTimeString().slice(0,8); }
  function addLog(el, msg, cls){
    if(!el) return;
    const line=document.createElement("div");
    line.className="line"+(cls?" "+cls:"");
    const time=document.createElement("span");
    time.className="t";
    time.textContent="["+fmtTime(new Date())+"] ";
    line.appendChild(time);
    line.appendChild(document.createTextNode(msg));
    el.appendChild(line);
    while(el.children.length>40) el.removeChild(el.firstChild);
    el.scrollTop=el.scrollHeight;
  }
  function setStatus(pillEl, logEl, key, i18nBase, cls){
    if(!pillEl) return;
    const text=t(i18nBase+"."+key);
    pillEl.textContent=text;
    pillEl.className="status-pill "+cls;
    if(pillEl.dataset.statusKey!==key){
      pillEl.dataset.statusKey=key;
      addLog(logEl, t("common.statusChanged", {status:text}), cls);
    }
  }

  /* ============ theme ============ */
  function updateThemeButton(){
    const key = themeMode==="light" ? "common.themeLight" : themeMode==="dark" ? "common.themeDark" : "common.themeAuto";
    const label=$("#themeLabel");
    label.setAttribute("data-i18n", key);
    label.textContent=t(key);
    $("#themeIcon").textContent = themeMode==="light" ? "☀" : themeMode==="dark" ? "☾" : "◐";
  }
  function applyTheme(mode){
    if(mode==="light" || mode==="dark"){ document.documentElement.dataset.theme=mode; }
    else { delete document.documentElement.dataset.theme; }
    updateThemeButton();
  }
  function cycleTheme(){
    themeMode = themeMode==="auto" ? "light" : themeMode==="light" ? "dark" : "auto";
    localStorage.setItem(THEME_KEY, themeMode);
    applyTheme(themeMode);
  }
  $("#themeBtn").addEventListener("click", cycleTheme);
  applyTheme(themeMode);

  /* ============ uptime ticker ============ */
  const startTime=Date.now();
  setInterval(function(){
    const s=Math.floor((Date.now()-startTime)/1000);
    const hh=String(Math.floor(s/3600)).padStart(2,"0");
    const mm=String(Math.floor((s%3600)/60)).padStart(2,"0");
    const ss=String(s%60).padStart(2,"0");
    $("#uptimeVal").textContent=hh+":"+mm+":"+ss;
  },1000);

  /* ============ MODULE 01 — LOAD BALANCING ============ */
  let lbServers=[];
  let lbNextId=1;
  let lbRRIndex=-1;
  let lbHandled=0, lbDropped=0, lbAcc=0, lbAutoCooldown=0;

  function lbAddServer(withLog){
    const s={id:lbNextId++, load:0};
    lbServers.push(s);
    if(withLog) addLog($("#lbLog"), t("lb.log.provisioned",{id:s.id}), "good");
    renderLbPool();
  }
  function lbRemoveServer(){
    if(lbServers.length<=2) return;
    let idx=0;
    for(let i=1;i<lbServers.length;i++) if(lbServers[i].load<lbServers[idx].load) idx=i;
    const removed=lbServers.splice(idx,1)[0];
    const el=document.getElementById("srv-"+removed.id);
    if(el) el.remove();
    addLog($("#lbLog"), t("lb.log.scaledDown",{id:removed.id}), "warn");
  }
  function lbPick(strategy){
    if(strategy==="rr"){ lbRRIndex=(lbRRIndex+1)%lbServers.length; return lbServers[lbRRIndex]; }
    if(strategy==="least"){ return lbServers.reduce((a,b)=> b.load<a.load?b:a); }
    return lbServers[Math.floor(Math.random()*lbServers.length)];
  }
  function renderLbPool(){
    const pool=$("#lbServers");
    lbServers.forEach(function(s){
      let el=document.getElementById("srv-"+s.id);
      if(!el){
        el=document.createElement("div");
        el.className="server-card new";
        el.id="srv-"+s.id;
        el.innerHTML='<div class="id"><span>SRV-'+s.id+'</span><span class="pct">0%</span></div><div class="bar"><span></span></div>';
        pool.appendChild(el);
      }
      el.querySelector(".pct").textContent=Math.round(s.load)+"%";
      const barSpan=el.querySelector(".bar > span");
      barSpan.style.width=s.load+"%";
      barSpan.style.background = s.load>85 ? "var(--bad)" : s.load>60 ? "var(--warn)" : "var(--accent)";
      if(s._justHit){
        el.classList.add("hit");
        setTimeout(function(){ el.classList.remove("hit"); },200);
        s._justHit=false;
      }
    });
  }
  function lbTick(dtMs){
    const rate=Number($("#lbRate").value);
    $("#lbRateOut").textContent=rate;
    $("#lbRateBar").style.width=Math.min(100, rate/60*100)+"%";
    lbAcc += rate*(dtMs/1000);
    let spawned=0;
    while(lbAcc>=1 && spawned<25){
      lbAcc-=1; spawned++;
      const strategy=$("#lbStrategy").value;
      const target=lbPick(strategy);
      if(target.load>=98){ lbDropped++; }
      else { target.load=Math.min(100, target.load+9+Math.random()*4); lbHandled++; target._justHit=true; }
    }
    lbServers.forEach(function(s){ s.load=Math.max(0, s.load-6); });

    if($("#lbAuto").checked){
      if(lbAutoCooldown>0){ lbAutoCooldown--; }
      else {
        const avg=lbServers.reduce((a,s)=>a+s.load,0)/lbServers.length;
        if(avg>78 && lbServers.length<8){ lbAddServer(true); lbAutoCooldown=10; }
        else if(avg<20 && lbServers.length>2){ lbRemoveServer(); lbAutoCooldown=14; }
      }
    }
    renderLbPool();
    updateLbStats();
  }
  function updateLbStats(){
    $("#lbCount").textContent=lbServers.length;
    const avg=lbServers.reduce((a,s)=>a+s.load,0)/lbServers.length;
    $("#lbUtil").textContent=Math.round(avg)+"%";
    $("#lbHandled").textContent=lbHandled;
    $("#lbDropped").textContent=lbDropped;
    let key="stable", cls="good";
    if(lbDropped>0 && avg>85){ key="overloaded"; cls="bad"; }
    else if(avg>75){ key="degraded"; cls="warn"; }
    setStatus($("#lbStatus"), $("#lbLog"), key, "lb.status", cls);
  }
  $("#lbRate").addEventListener("input", function(){ $("#lbRateOut").textContent=$("#lbRate").value; });
  $("#lbSpike").addEventListener("click", function(){
    $("#lbRate").value=Math.min(60, Number($("#lbRate").value)+30);
    $("#lbRateOut").textContent=$("#lbRate").value;
    addLog($("#lbLog"), t("lb.log.spike"), "warn");
  });
  lbAddServer(false); lbAddServer(false);
  addLog($("#lbLog"), t("lb.log.poolInit",{n:2}));
  updateLbStats();
  setInterval(function(){ lbTick(250); }, 250);

  /* ============ MODULE 02 — CONSISTENCY ============ */
  let consNodes=[1,2,3,4,5].map(function(i){ return {id:"N"+i, value:0, ts:Date.now(), group: i<=3?"A":"B"}; });
  let consTargetIdx=0;
  let consCounter=0;
  let consPartitioned=false;
  let consLatestCommitted=0;
  let consPendingByNode={};

  function consReachable(a,b){ return !consPartitioned || a.group===b.group; }
  function consQueuePending(nodeId, item){
    (consPendingByNode[nodeId]=consPendingByNode[nodeId]||[]).push(item);
  }
  function consFlash(id){
    const el=document.getElementById("cons-"+id);
    if(el){ el.classList.add("flash"); setTimeout(function(){ el.classList.remove("flash"); },500); }
  }
  function renderCons(){
    const row=$("#consRow");
    row.innerHTML="";
    consNodes.forEach(function(n,i){
      if(i===3){
        const div=document.createElement("div");
        div.className="partition-divider"+(consPartitioned?" active":"");
        row.appendChild(div);
      }
      const btn=document.createElement("button");
      btn.type="button";
      const targetNode=consNodes[consTargetIdx];
      const stale = n.value!==consLatestCommitted;
      const unreachable = consPartitioned && n.group!==targetNode.group;
      btn.className="node-card"+(i===consTargetIdx?" target":"")+(unreachable?" unreachable":"");
      btn.id="cons-"+n.id;
      btn.dataset.idx=i;
      btn.innerHTML='<div class="id"><span>'+n.id+'</span><span>'+t("consistency.grpLabel")+' '+n.group+'</span></div>'+
        '<div class="value">v'+n.value+'</div>'+
        '<span class="badge '+(stale?"stale":"latest")+'">'+(stale?t("consistency.badgeStale"):t("consistency.badgeLatest"))+'</span>';
      row.appendChild(btn);
    });
    $("#consLatest").textContent="v"+consLatestCommitted;
    $("#consTargetOut").textContent=consNodes[consTargetIdx].id;
    $("#consPartitionState").textContent = consPartitioned ? t("consistency.networkSplit") : t("consistency.networkJoined");
    $("#consModeOut").textContent = $("#consMode").value==="strong" ? t("consistency.modeStrong") : t("consistency.modeEventual");
    const anyStale=consNodes.some(function(n){ return n.value!==consLatestCommitted; });
    let key="consistent", cls="good";
    if(consPartitioned){ key="partitioned"; cls="bad"; }
    else if(anyStale){ key="converging"; cls="warn"; }
    setStatus($("#consStatus"), $("#consLog"), key, "consistency.status", cls);
  }
  function consWrite(){
    const epoch=stateEpoch;
    const target=consNodes[consTargetIdx];
    consCounter++;
    const value=consCounter, ts=Date.now();
    const mode=$("#consMode").value;
    const lag=Number($("#consLag").value);

    if(mode==="eventual"){
      target.value=value; target.ts=ts;
      consLatestCommitted=Math.max(consLatestCommitted, value);
      addLog($("#consLog"), t("consistency.log.writeLocal",{value:value,target:target.id}), "good");
      consNodes.forEach(function(other){
        if(other===target) return;
        if(consReachable(target, other)){
          setTimeout(function(){
            if(epoch!==stateEpoch) return;
            other.value=value; other.ts=ts;
            renderCons();
            consFlash(other.id);
            addLog($("#consLog"), t("consistency.log.replicated",{node:other.id,value:value}));
          }, lag);
        } else {
          consQueuePending(other.id, {value:value, ts:ts});
        }
      });
    } else {
      const reachableSet=consNodes.filter(function(n){ return consReachable(target, n); });
      const quorum=Math.floor(consNodes.length/2)+1;
      if(reachableSet.length<quorum){
        addLog($("#consLog"), t("consistency.log.rejected",{value:value,reachable:reachableSet.length,total:consNodes.length,quorum:quorum}), "bad");
        renderCons();
        return;
      }
      addLog($("#consLog"), t("consistency.log.proposed",{value:value,target:target.id}));
      setTimeout(function(){
        if(epoch!==stateEpoch) return;
        reachableSet.forEach(function(n){ n.value=value; n.ts=ts; });
        consLatestCommitted=Math.max(consLatestCommitted, value);
        addLog($("#consLog"), t("consistency.log.quorumReached",{reachable:reachableSet.length,total:consNodes.length,value:value}), "good");
        renderCons();
      }, lag);
      consNodes.filter(function(n){ return !consReachable(target, n); }).forEach(function(n){ consQueuePending(n.id, {value:value, ts:ts}); });
    }
    renderCons();
  }
  function consHeal(){
    consPartitioned=false;
    Object.keys(consPendingByNode).forEach(function(nodeId){
      const items=consPendingByNode[nodeId];
      if(!items || !items.length) return;
      const last=items[items.length-1];
      const node=consNodes.find(function(n){ return n.id===nodeId; });
      node.value=last.value; node.ts=last.ts;
      addLog($("#consLog"), t("consistency.log.healed",{node:nodeId,value:last.value}), "good");
    });
    consPendingByNode={};
    renderCons();
  }
  $("#consLag").addEventListener("input", function(){ $("#consLagOut").textContent=$("#consLag").value; });
  $("#consWriteBtn").addEventListener("click", consWrite);
  $("#consMode").addEventListener("change", renderCons);
  $("#consPartition").addEventListener("change", function(e){
    consPartitioned=e.target.checked;
    if(consPartitioned){ addLog($("#consLog"), t("consistency.log.partition"), "warn"); renderCons(); }
    else { consHeal(); }
  });
  $("#consRow").addEventListener("click", function(e){
    const card=e.target.closest(".node-card");
    if(!card) return;
    consTargetIdx=Number(card.dataset.idx);
    renderCons();
  });
  addLog($("#consLog"), t("consistency.log.init"));
  renderCons();

  /* ============ MODULE 03 — CACHING & CDN ============ */
  const CACHE_KEYS=["/api/products/8842","/images/hero.jpg","/api/weather/istanbul","/video/trailer.mp4"];
  const cacheEdges=["EU","US","APAC"].map(function(name){ return {name:name, cache:new Map()}; });
  let cacheHitHistory=[];
  let cachePurges=0;
  let cacheAutoTimer=null;

  function cacheFlashEdge(idx, kind){
    const el=document.getElementById("edge-"+idx);
    el.classList.remove("hit","miss");
    void el.offsetWidth;
    el.classList.add(kind);
    setTimeout(function(){ el.classList.remove(kind); },500);
  }
  function cacheFlashOrigin(){
    const el=$("#cacheOrigin");
    el.classList.add("flash");
    setTimeout(function(){ el.classList.remove("flash"); },500);
  }
  function renderEdge(idx){
    const edge=cacheEdges[idx];
    const wrap=document.getElementById("edge-"+idx+"-entries");
    const count=document.getElementById("edge-"+idx+"-count");
    count.textContent=t("cache.cachedCount",{n:edge.cache.size});
    wrap.innerHTML="";
    edge.cache.forEach(function(v,k){
      const remaining=Math.max(0, Math.ceil((v.expires-Date.now())/1000));
      const chip=document.createElement("span");
      chip.className="cache-entry";
      chip.textContent=k.split("/").pop()+" · "+remaining+"s";
      wrap.appendChild(chip);
    });
  }
  function renderSparkline(){
    const el=$("#cacheSpark");
    el.innerHTML="";
    const hist=cacheHitHistory.slice(-30);
    const win=8;
    hist.forEach(function(_,i){
      const start=Math.max(0, i-win+1);
      const slice=hist.slice(start, i+1);
      const p=slice.reduce(function(a,b){return a+b;},0)/slice.length;
      const bar=document.createElement("i");
      bar.style.height=Math.max(3, Math.round(p*32))+"px";
      if(hist[i]===1) bar.classList.add("hit");
      el.appendChild(bar);
    });
  }
  function updateCacheStats(){
    const total=cacheHitHistory.length;
    const hits=cacheHitHistory.reduce(function(a,b){return a+b;},0);
    const rate=total? Math.round(hits/total*100):0;
    $("#cacheHitRate").textContent=rate+"%";
    $("#cacheReqs").textContent=total;
    const keys=cacheEdges.reduce(function(a,e){return a+e.cache.size;},0);
    $("#cacheKeys").textContent=keys;
    $("#cachePurgesEl").textContent=cachePurges;
    let key="warming", cls="warn";
    if(total>=5){
      if(rate>66){ key="warm"; cls="good"; }
      else if(rate>33){ key="cooling"; cls="warn"; }
      else { key="cold"; cls="bad"; }
    }
    setStatus($("#cacheStatus"), $("#cacheLog"), key, "cache.status", cls);
  }
  function edgeRequest(edgeIdx, key){
    const edge=cacheEdges[edgeIdx];
    const now=Date.now();
    const entry=edge.cache.get(key);
    if(entry && entry.expires>now){
      cacheHitHistory.push(1);
      addLog($("#cacheLog"), t("cache.log.hit",{name:edge.name,key:key,ms:12+Math.floor(Math.random()*10)}), "good");
      cacheFlashEdge(edgeIdx, "hit");
    } else {
      cacheHitHistory.push(0);
      addLog($("#cacheLog"), t("cache.log.miss",{name:edge.name,key:key}), "warn");
      cacheFlashEdge(edgeIdx, "miss");
      cacheFlashOrigin();
      const ttl=Number($("#cacheTtl").value);
      const epoch=stateEpoch;
      setTimeout(function(){
        if(epoch!==stateEpoch) return;
        edge.cache.set(key, {expires: Date.now()+ttl*1000});
        renderEdge(edgeIdx);
        addLog($("#cacheLog"), t("cache.log.cached",{name:edge.name,key:key,ttl:ttl}));
      }, 260);
    }
    cacheHitHistory=cacheHitHistory.slice(-30);
    renderSparkline();
    renderEdge(edgeIdx);
    updateCacheStats();
  }
  $("#cacheTtl").addEventListener("input", function(){ $("#cacheTtlOut").textContent=$("#cacheTtl").value; });
  $("#cacheGo").addEventListener("click", function(){ edgeRequest(Number($("#cacheEdgeSel").value), $("#cacheKeySel").value); });
  $("#cachePurge").addEventListener("click", function(){
    cacheEdges.forEach(function(e,i){ e.cache.clear(); renderEdge(i); });
    cachePurges++;
    addLog($("#cacheLog"), t("cache.log.purged"), "warn");
    updateCacheStats();
  });
  $("#cacheAuto").addEventListener("change", function(e){
    if(e.target.checked){
      cacheAutoTimer=setInterval(function(){
        const k=CACHE_KEYS[Math.floor(Math.random()*CACHE_KEYS.length)];
        const ei=Math.floor(Math.random()*cacheEdges.length);
        edgeRequest(ei,k);
      }, 900);
    } else if(cacheAutoTimer){ clearInterval(cacheAutoTimer); cacheAutoTimer=null; }
  });
  setInterval(function(){
    cacheEdges.forEach(function(e,i){
      let changed=false;
      e.cache.forEach(function(v,k){ if(v.expires<=Date.now()){ e.cache.delete(k); changed=true; } });
      renderEdge(i);
      if(changed) updateCacheStats();
    });
  }, 500);
  cacheEdges.forEach(function(e,i){ renderEdge(i); });
  addLog($("#cacheLog"), t("cache.log.init"));
  updateCacheStats();

  /* ============ MODULE 04 — FAILOVER ============ */
  let foNodes=[
    {id:"N1", role:"primary", status:"healthy"},
    {id:"N2", role:"replica", status:"healthy"},
    {id:"N3", role:"replica", status:"healthy"},
    {id:"N4", role:"replica", status:"healthy"}
  ];
  let foDownQueue=[];
  let foFailoverCount=0;

  function renderFo(){
    const wrap=$("#foNodes");
    wrap.innerHTML="";
    foNodes.forEach(function(n){
      const box=document.createElement("div");
      box.className="node-box "+n.status;
      box.id="fo-"+n.id;
      const ringColor = n.status==="healthy" ? "var(--good)" : n.status==="down" ? "var(--bad)" : "var(--warn)";
      box.innerHTML =
        '<div class="id"><span>'+n.id+'</span><span class="pulse-ring" style="background:'+ringColor+'"></span></div>'+
        '<div class="role'+(n.role==="primary"?" primary":"")+'">'+t("failover.role."+n.role)+'</div>'+
        '<div class="health">'+t("failover.health."+n.status)+'</div>';
      wrap.appendChild(box);
    });
    const sel=$("#foTarget");
    const prevVal=sel.value;
    sel.innerHTML=foNodes.map(function(n){
      return '<option value="'+n.id+'">'+t("failover.targetOption",{id:n.id, role:t("failover.role."+n.role), status:t("failover.health."+n.status)})+'</option>';
    }).join("");
    if(foNodes.some(function(n){ return n.id===prevVal; })) sel.value=prevVal;

    $("#foHealthy").textContent=foNodes.filter(function(n){return n.status==="healthy";}).length+"/"+foNodes.length;
    const primary=foNodes.find(function(n){ return n.role==="primary"; });
    $("#foPrimary").textContent = primary ? primary.id+(primary.status!=="healthy"?t("failover.primaryDownSuffix"):"") : t("failover.primaryNone");
    $("#foCount").textContent=foFailoverCount;
    $("#foQueue").textContent=foDownQueue.length;
    $("#foReviveBtn").disabled = foDownQueue.length===0;

    const healthyCount=foNodes.filter(function(n){return n.status==="healthy";}).length;
    const hasPrimary=foNodes.some(function(n){ return n.role==="primary" && n.status==="healthy"; });
    let key="healthy", cls="good";
    if(!hasPrimary){ key="critical"; cls="bad"; }
    else if(healthyCount<foNodes.length){ key="degraded"; cls="warn"; }
    setStatus($("#foStatus"), $("#foLog"), key, "failover.status", cls);
  }
  function foKill(id){
    const epoch=stateEpoch;
    const node=foNodes.find(function(n){ return n.id===id; });
    if(!node || node.status==="down" || node.status==="detecting"){
      addLog($("#foLog"), t("failover.log.alreadyDown",{id:id}), "warn");
      return;
    }
    node.status="detecting";
    renderFo();
    addLog($("#foLog"), t("failover.log.heartbeat1",{id:node.id}), "warn");
    setTimeout(function(){
      if(epoch!==stateEpoch || node.status!=="detecting") return;
      addLog($("#foLog"), t("failover.log.heartbeat3",{id:node.id}), "bad");
      node.status="down";
      foDownQueue.push(node.id);
      if(node.role==="primary"){
        const candidate=foNodes.find(function(n){ return n.status==="healthy" && n.role==="replica"; });
        if(candidate){
          candidate.role="primary";
          node.role="replica";
          foFailoverCount++;
          addLog($("#foLog"), t("failover.log.promoting",{id:candidate.id}), "good");
          addLog($("#foLog"), t("failover.log.rerouted",{id:candidate.id}));
        } else {
          addLog($("#foLog"), t("failover.log.noReplica"), "bad");
        }
      }
      renderFo();
    }, 900);
  }
  function foRevive(){
    const epoch=stateEpoch;
    const id=foDownQueue.shift();
    if(!id) return;
    const node=foNodes.find(function(n){ return n.id===id; });
    node.status="syncing";
    addLog($("#foLog"), t("failover.log.rejoining",{id:node.id}), "warn");
    renderFo();
    setTimeout(function(){
      if(epoch!==stateEpoch) return;
      node.status="healthy";
      addLog($("#foLog"), t("failover.log.backHealthy",{id:node.id}), "good");
      renderFo();
    }, 1800);
  }
  $("#foKillBtn").addEventListener("click", function(){ foKill($("#foTarget").value); });
  $("#foReviveBtn").addEventListener("click", foRevive);
  addLog($("#foLog"), t("failover.log.init"));
  renderFo();

  /* ============ RESET ALL MODULES ============ */
  function resetAllModules(){
    stateEpoch++;

    lbServers=[]; lbNextId=1; lbRRIndex=-1; lbHandled=0; lbDropped=0; lbAcc=0; lbAutoCooldown=0;
    $("#lbServers").innerHTML=""; $("#lbLog").innerHTML=""; $("#lbStatus").dataset.statusKey="";
    $("#lbRate").value=12; $("#lbRateOut").textContent=12; $("#lbStrategy").value="rr"; $("#lbAuto").checked=true;
    lbAddServer(false); lbAddServer(false);
    addLog($("#lbLog"), t("lb.log.poolInit",{n:2}));
    updateLbStats();

    consNodes=[1,2,3,4,5].map(function(i){ return {id:"N"+i, value:0, ts:Date.now(), group: i<=3?"A":"B"}; });
    consTargetIdx=0; consCounter=0; consPartitioned=false; consLatestCommitted=0; consPendingByNode={};
    $("#consPartition").checked=false; $("#consMode").value="eventual";
    $("#consLag").value=800; $("#consLagOut").textContent=800;
    $("#consLog").innerHTML=""; $("#consStatus").dataset.statusKey="";
    addLog($("#consLog"), t("consistency.log.init"));
    renderCons();

    if(cacheAutoTimer){ clearInterval(cacheAutoTimer); cacheAutoTimer=null; }
    cacheEdges.forEach(function(e){ e.cache=new Map(); });
    cacheHitHistory=[]; cachePurges=0;
    $("#cacheAuto").checked=false; $("#cacheTtl").value=10; $("#cacheTtlOut").textContent=10;
    $("#cacheKeySel").selectedIndex=0; $("#cacheEdgeSel").selectedIndex=0;
    $("#cacheLog").innerHTML=""; $("#cacheStatus").dataset.statusKey="";
    cacheEdges.forEach(function(e,i){ renderEdge(i); });
    renderSparkline();
    addLog($("#cacheLog"), t("cache.log.init"));
    updateCacheStats();

    foNodes=[
      {id:"N1", role:"primary", status:"healthy"},
      {id:"N2", role:"replica", status:"healthy"},
      {id:"N3", role:"replica", status:"healthy"},
      {id:"N4", role:"replica", status:"healthy"}
    ];
    foDownQueue=[]; foFailoverCount=0;
    $("#foLog").innerHTML=""; $("#foStatus").dataset.statusKey="";
    addLog($("#foLog"), t("failover.log.init"));
    renderFo();
  }
  $("#resetAllBtn").addEventListener("click", resetAllModules);

  /* ============ ASK THE CONSOLE — Groq chat ============ */
  const CHAT_KEY_STORAGE="csc-groq-key";
  const CHAT_MODEL="llama-3.3-70b-versatile";
  const CHAT_SYSTEM_PROMPT=
    "You are a friendly, concise assistant embedded in an interactive web page called 'Cloud Systems, Simulated' that teaches cloud computing through four live simulations: load balancing & auto-scaling, distributed consistency (the CAP theorem), caching & CDNs, and fault tolerance & failover. Answer the visitor's question about cloud computing concepts clearly, using everyday analogies where helpful, in a few sentences unless they ask for more depth. If asked something unrelated to cloud computing or this page, answer briefly and steer back. Reply in the same language the user wrote in (English or Turkish).";
  let chatHistory=[];

  function chatGetKey(){ return localStorage.getItem(CHAT_KEY_STORAGE) || ""; }
  function chatShowBodyIfKeySet(){
    const has=!!chatGetKey();
    $("#chatSetup").hidden=has;
    $("#chatBody").hidden=!has;
  }
  function chatAddLine(role, text){
    const el=$("#chatLog");
    const line=document.createElement("div");
    line.className="line "+role;
    const who=document.createElement("span");
    who.className="who";
    who.textContent=(role==="user" ? t("chat.you") : t("chat.bot"))+": ";
    line.appendChild(who);
    line.appendChild(document.createTextNode(text));
    el.appendChild(line);
    el.scrollTop=el.scrollHeight;
    return line;
  }
  async function chatSend(question){
    const key=chatGetKey();
    if(!key) return;
    chatAddLine("user", question);
    chatHistory.push({role:"user", content:question});
    const pending=chatAddLine("bot", t("chat.thinking"));
    try{
      const res=await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method:"POST",
        headers:{ "Content-Type":"application/json", "Authorization":"Bearer "+key },
        body:JSON.stringify({
          model:CHAT_MODEL,
          messages:[{role:"system", content:CHAT_SYSTEM_PROMPT}].concat(chatHistory.slice(-10)),
          temperature:0.4,
          max_tokens:500
        })
      });
      if(!res.ok){
        let msg=t("chat.errorGeneric");
        if(res.status===401 || res.status===403) msg=t("chat.errorAuth");
        else if(res.status===429) msg=t("chat.errorRate");
        pending.lastChild.textContent=msg;
        pending.classList.add("bad");
        return;
      }
      const data=await res.json();
      const answer = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
        ? data.choices[0].message.content.trim() : t("chat.errorGeneric");
      pending.lastChild.textContent=answer;
      chatHistory.push({role:"assistant", content:answer});
    } catch(e){
      pending.lastChild.textContent=t("chat.errorGeneric");
      pending.classList.add("bad");
    }
  }
  $("#chatFab").addEventListener("click", function(){
    const panel=$("#chatPanel");
    panel.hidden=!panel.hidden;
    if(!panel.hidden){
      if(chatGetKey()) $("#chatInput").focus();
      else $("#chatKeyInput").focus();
    }
  });
  $("#chatClose").addEventListener("click", function(){ $("#chatPanel").hidden=true; });
  $("#chatKeySave").addEventListener("click", function(){
    const val=$("#chatKeyInput").value.trim();
    if(!val) return;
    localStorage.setItem(CHAT_KEY_STORAGE, val);
    $("#chatKeyInput").value="";
    chatShowBodyIfKeySet();
    $("#chatInput").focus();
  });
  $("#chatForget").addEventListener("click", function(){
    localStorage.removeItem(CHAT_KEY_STORAGE);
    chatHistory=[];
    $("#chatLog").innerHTML="";
    chatShowBodyIfKeySet();
  });
  $("#chatForm").addEventListener("submit", function(e){
    e.preventDefault();
    const input=$("#chatInput");
    const q=input.value.trim();
    if(!q) return;
    input.value="";
    chatSend(q);
  });
  chatShowBodyIfKeySet();

  /* ============ language switching ============ */
  function setLang(lang){
    currentLang=lang;
    localStorage.setItem(LANG_KEY, lang);
    $("#langEnBtn").classList.toggle("active", lang==="en");
    $("#langTrBtn").classList.toggle("active", lang==="tr");
    applyStaticI18n();
    updateThemeButton();
    renderLbPool(); updateLbStats();
    renderCons();
    cacheEdges.forEach(function(_,i){ renderEdge(i); });
    updateCacheStats();
    renderFo();
  }
  $("#langEnBtn").addEventListener("click", function(){ setLang("en"); });
  $("#langTrBtn").addEventListener("click", function(){ setLang("tr"); });

  setLang(currentLang);
})();
