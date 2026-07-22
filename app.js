(function(){
  "use strict";
  const $ = (sel, root) => (root||document).querySelector(sel);

  /* ============ i18n dictionary ============ */
  const dict = {
    en: {
      common: {
        wordmark:"Systems Console",
        nav:{ lb:"01 Load balancing", consistency:"02 Consistency", cache:"03 Caching", failover:"04 Failover" },
        uptime:"UPTIME",
        themeAuto:"Theme: Auto", themeLight:"Theme: Light", themeDark:"Theme: Dark",
        pageTitle:"Cloud Systems, Simulated",
        statusChanged:"status → {status}",
        footer:"Everything above runs client-side in JavaScript — no real servers, nodes, or network calls involved. Reload the page to reset all four modules."
      },
      intro:{
        title:"Cloud systems, taken apart",
        p:"Four small, live simulations of the mechanisms that keep large systems running — no real servers behind any of it, just the logic. Turn the dials and watch what actually happens under load, under a network partition, under a cache miss, under a failure.",
        meta:"4 modules · runs entirely in your browser · no real infrastructure"
      },
      lb:{
        modId:"MODULE 01", title:"Load Balancing & Auto-Scaling",
        dek:"Requests arrive faster than any one server can handle, so a balancer spreads them across a pool — and spins up new servers when the pool falls behind.",
        incoming:"Incoming traffic", node:"LOAD BALANCER",
        rateLabel:"Traffic rate —", rateUnit:"req/s",
        strategyLabel:"Balancing strategy", strategyRR:"Round robin", strategyLeast:"Least connections", strategyRandom:"Random",
        autoLabel:"Auto-scaling enabled", spikeBtn:"Send traffic spike",
        statServers:"Active servers", statUtil:"Avg utilization", statHandled:"Requests handled", statDropped:"Requests dropped",
        note:"Mirrors an ALB / Envoy / nginx pool sitting in front of an auto-scaling group: distribute connections by policy, watch utilization, add capacity when it's sustained, remove it when it's wasted.",
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
        partitionLabel:"Split the network into {N1,N2,N3} | {N4,N5}",
        modeLabel:"Consistency mode", modeEventual:"Eventual", modeStrong:"Strong (quorum)",
        lagLabel:"Replication lag —",
        writeBtn:"Write new value to selected node",
        statTarget:"Write target", statMode:"Mode", statCommitted:"Committed", statNetwork:"Network",
        networkJoined:"JOINED", networkSplit:"SPLIT",
        badgeLatest:"latest", badgeStale:"stale", grpLabel:"grp",
        note:"This is the CAP theorem in miniature: under a partition, a system stays available (eventual) or stays consistent (strong/quorum) — rarely both. DynamoDB and Cassandra default to eventual; Spanner and etcd default to strong.",
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
        targetLabel:"Target node", killBtn:"Kill selected node", reviveBtn:"Revive last failed node",
        statHealthy:"Healthy nodes", statPrimary:"Current primary", statFailovers:"Failovers", statQueue:"Down queue",
        note:"Production clusters (Postgres + Patroni, Redis Sentinel, Kubernetes leader election) use the same shape: heartbeats, a detection timeout, then a promotion step — tuned so failover is fast but a network blip doesn't trigger a false alarm.",
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
      }
    },
    tr: {
      common: {
        wordmark:"Sistem Konsolu",
        nav:{ lb:"01 Yük dengeleme", consistency:"02 Tutarlılık", cache:"03 Önbellekleme", failover:"04 Yük devretme" },
        uptime:"ÇALIŞMA SÜRESİ",
        themeAuto:"Tema: Otomatik", themeLight:"Tema: Açık", themeDark:"Tema: Koyu",
        pageTitle:"Bulut Sistemleri, Simülasyon",
        statusChanged:"durum → {status}",
        footer:"Yukarıdaki her şey tarayıcınızda JavaScript ile çalışır — gerçek sunucu, düğüm veya ağ isteği yoktur. Dört modülü sıfırlamak için sayfayı yenileyin."
      },
      intro:{
        title:"Bulut sistemleri, parçalarına ayrıldı",
        p:"Büyük sistemleri ayakta tutan mekanizmaların dört küçük, canlı simülasyonu — arkasında gerçek sunucu yok, sadece mantık. Kadranları çevirin ve yük altında, bir ağ bölünmesinde, bir önbellek ıskalamasında, bir arızada gerçekte ne olduğunu izleyin.",
        meta:"4 modül · tamamen tarayıcınızda çalışır · gerçek altyapı yok"
      },
      lb:{
        modId:"MODÜL 01", title:"Yük Dengeleme ve Otomatik Ölçekleme",
        dek:"İstekler tek bir sunucunun kaldırabileceğinden daha hızlı geliyor; bu yüzden bir dengeleyici onları bir havuza dağıtır — ve havuz yetişemediğinde yeni sunucular devreye sokar.",
        incoming:"Gelen trafik", node:"YÜK DENGELEYİCİ",
        rateLabel:"Trafik oranı —", rateUnit:"istek/sn",
        strategyLabel:"Dengeleme stratejisi", strategyRR:"Sırayla (round robin)", strategyLeast:"En az bağlantı", strategyRandom:"Rastgele",
        autoLabel:"Otomatik ölçekleme etkin", spikeBtn:"Trafik ani yükselmesi gönder",
        statServers:"Aktif sunucu", statUtil:"Ort. kullanım", statHandled:"İşlenen istek", statDropped:"Düşürülen istek",
        note:"Bir ALB / Envoy / nginx havuzunun bir otomatik ölçekleme grubunun önünde durmasıyla aynı mantık: bağlantıları bir politikaya göre dağıt, kullanımı izle, sürdürülebilir bir yük artışında kapasite ekle, israf olduğunda kaldır.",
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
        partitionLabel:"Ağı {N1,N2,N3} | {N4,N5} olarak ikiye ayır",
        modeLabel:"Tutarlılık modu", modeEventual:"Sonunda tutarlı (eventual)", modeStrong:"Güçlü (quorum)",
        lagLabel:"Çoğaltma gecikmesi —",
        writeBtn:"Seçili düğüme yeni değer yaz",
        statTarget:"Yazma hedefi", statMode:"Mod", statCommitted:"Uygulanan", statNetwork:"Ağ",
        networkJoined:"BİRLEŞİK", networkSplit:"BÖLÜNMÜŞ",
        badgeLatest:"güncel", badgeStale:"eski", grpLabel:"grp",
        note:"Bu, minyatür bir CAP teoremi: bir ağ bölünmesinde sistem ya erişilebilir kalır (eventual) ya da tutarlı kalır (strong/quorum) — nadiren ikisi birden. DynamoDB ve Cassandra varsayılan olarak eventual; Spanner ve etcd varsayılan olarak strong kullanır.",
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
        targetLabel:"Hedef düğüm", killBtn:"Seçili düğümü çökert", reviveBtn:"Son arızalanan düğümü canlandır",
        statHealthy:"Sağlıklı düğüm", statPrimary:"Mevcut birincil", statFailovers:"Yük devretme", statQueue:"Devre dışı sırası",
        note:"Üretim kümeleri (Postgres + Patroni, Redis Sentinel, Kubernetes lider seçimi) aynı yapıyı kullanır: kalp atışları, bir tespit zaman aşımı, sonra bir yükseltme adımı — yük devretme hızlı olsun ama kısa bir ağ kesintisi yanlış alarm tetiklemesin diye ayarlanmış.",
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
      }
    }
  };

  const LANG_KEY="csc-lang", THEME_KEY="csc-theme";
  let currentLang = localStorage.getItem(LANG_KEY) || (((navigator.language||"").toLowerCase().indexOf("tr")===0) ? "tr" : "en");
  let themeMode = localStorage.getItem(THEME_KEY) || "auto";

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
      setTimeout(function(){
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
    const node=foNodes.find(function(n){ return n.id===id; });
    if(!node || node.status==="down" || node.status==="detecting"){
      addLog($("#foLog"), t("failover.log.alreadyDown",{id:id}), "warn");
      return;
    }
    node.status="detecting";
    renderFo();
    addLog($("#foLog"), t("failover.log.heartbeat1",{id:node.id}), "warn");
    setTimeout(function(){
      if(node.status!=="detecting") return;
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
    const id=foDownQueue.shift();
    if(!id) return;
    const node=foNodes.find(function(n){ return n.id===id; });
    node.status="syncing";
    addLog($("#foLog"), t("failover.log.rejoining",{id:node.id}), "warn");
    renderFo();
    setTimeout(function(){
      node.status="healthy";
      addLog($("#foLog"), t("failover.log.backHealthy",{id:node.id}), "good");
      renderFo();
    }, 1800);
  }
  $("#foKillBtn").addEventListener("click", function(){ foKill($("#foTarget").value); });
  $("#foReviveBtn").addEventListener("click", foRevive);
  addLog($("#foLog"), t("failover.log.init"));
  renderFo();

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
