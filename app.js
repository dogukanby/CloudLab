(function(){
  "use strict";
  const $ = (sel, root) => (root||document).querySelector(sel);
  // Keep in sync with package.json's "version" — there's no build step to
  // inject this automatically, so it's a manual mirror. Shown in the topbar
  // (and read as the desktop window title via app.getVersion() in main.js).
  const APP_VERSION = "1.2.3";
  $("#versionTag").textContent = "v"+APP_VERSION;

  /* ============ i18n dictionary ============ */
  const dict = {
    en: {
      common: {
        wordmark:"CloudLab",
        nav:{ cloud101:"00 What is the cloud?", auth:"01 Sign-in", iam:"02 IAM & permissions", vpc:"03 VPC", ec2:"04 EC2", s3:"05 S3", lambda:"06 Lambda", lb:"07 Load balancing", beanstalk:"08 Beanstalk", route53:"09 Route 53", cache:"10 Caching", consistency:"11 Consistency", failover:"12 Failover", sns:"13 SNS", cloudwatch:"14 CloudWatch", snowball:"15 Snowball Edge" },
        themeAuto:"Theme: Auto", themeLight:"Theme: Light", themeDark:"Theme: Dark",
        pageTitle:"CloudLab",
        statusChanged:"status → {status}",
        analogyLabel:"In plain terms", technicalLabel:"Under the hood",
        tryThisLabel:"Try this", realIncidentLabel:"Real incident",
        footer:"Everything above runs client-side in JavaScript — no real servers, nodes, or network calls involved.",
        resetAll:"Reset all modules", resetAllShort:"Reset"
      },
      cloud101:{
        modId:"MODULE 00", title:"What Is \"The Cloud,\" Really?",
        p1:"When you save a photo, send a message, or stream a video, it usually doesn't stay on your phone or laptop — it travels to a computer somewhere else, does its job, and sends the result back. That's the cloud: not a mysterious place in the sky, just someone else's computers — owned by companies like Amazon, Google, or Microsoft — built to serve millions of people at once, all day, every day, without going down.",
        p2:"It didn't used to work this way. Companies used to buy and run their own physical servers in their own basement or data center — expensive to buy, expensive to cool, expensive to staff, and almost always either too small for a busy day or too big for a quiet one. Cloud providers realized they could build enormous shared data centers once, then rent out tiny slices of that capacity to anyone who needed it, by the hour or even by the second. Renting is what makes the whole thing work: you stop paying for a warehouse full of computers you might need, and start paying only for the ones you're actually using right now.",
        p3:"Every cloud provider is really just selling four promises, wrapped in different product names: it will scale up when you get busy and back down when you're quiet (elasticity), it won't lose your data even if a hard drive or an entire building fails (durability), it can serve someone in Tokyo and someone in Toronto without either of them noticing the other exists (global reach), and you only pay for what you actually use (metered pricing). Almost everything a cloud provider sells — the 16 modules below included — is one of those four promises, turned into an actual product.",
        p4:"Each module below simulates one small piece of how that actually works — signing in without this app ever seeing your password, an idle server still costing money every second, a single message reaching five different subscribers at once, a truck full of hard drives beating a network cable. None of it is a real server or a real network call; it's the same logic real systems run, just slowed down and made visible so you can watch it happen.",
        glossaryLabel:"A few words you'll see a lot below",
        glossRegionTerm:"Region",
        glossRegionDef:"A specific geographic area a provider operates in — \"US East\" or \"Europe West,\" for instance — usually built from multiple data centers close enough together to act as one, but far enough apart to survive a local disaster.",
        glossAzTerm:"Availability zone",
        glossAzDef:"One physically separate data center within a region, with its own power and cooling. Spreading a service across zones means one zone catching fire doesn't take the whole region down with it.",
        glossInstanceTerm:"Instance",
        glossInstanceDef:"A single rented virtual computer — CPU, memory, and storage carved out of a much bigger physical machine and handed to you as if it were your own.",
        glossApiTerm:"API",
        glossApiDef:"The set of rules a piece of software exposes so other software can ask it to do something. Almost everything in the cloud, including every module below, happens by one program calling another program's API.",
        glossManagedTerm:"Managed service",
        glossManagedDef:"A piece of infrastructure the provider runs for you — patched, backed up, scaled — so you never have to think about the actual machine underneath it. Most of the 16 modules below are simulating a managed service.",
        glossSlaTerm:"SLA / uptime",
        glossSlaDef:"A provider's written promise for how reliable a service will be, usually a percentage like 99.99% — which sounds close to 100%, but still allows for roughly 52 minutes of downtime a year."
      },
      intro:{
        title:"Cloud systems, taken apart",
        p:"Sixteen small, live simulations of the mechanisms that keep large systems running — no real servers behind any of it, just the logic. Turn the dials and watch what actually happens under load, under a network partition, under a cache miss, under a failure.",
        meta:"16 modules · runs entirely in your browser · no real infrastructure"
      },
      lb:{
        modId:"MODULE 07", title:"Load Balancing & Auto-Scaling",
        titleAzure:"Azure Load Balancer: Load Balancing & Auto-Scaling", titleGcp:"Cloud Load Balancing: Load Balancing & Auto-Scaling",
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
        modId:"MODULE 11", title:"Distributed Consistency",
        titleAzure:"Distributed Consistency (Azure Cosmos DB)", titleGcp:"Distributed Consistency (Cloud Spanner)",
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
        modId:"MODULE 10", title:"Caching & CDN",
        titleAzure:"Caching & Azure CDN", titleGcp:"Caching & Cloud CDN",
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
        modId:"MODULE 12", title:"Fault Tolerance & Failover",
        titleAzure:"Fault Tolerance & Failover (Azure SQL Failover Groups)", titleGcp:"Fault Tolerance & Failover (Cloud SQL High Availability)",
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
      vpc:{
        modId:"MODULE 03", title:"VPC: Networks & Security Groups",
        titleAzure:"Virtual Network: Networks & Security Groups", titleGcp:"VPC Network: Networks & Security Groups",
        dek:"A cloud network is carved into subnets — some reachable from the internet, some deliberately not — and a security group decides which ports may even knock on the door.",
        analogy:"Think of an office building: the lobby (public subnet) is open to anyone off the street, but the server room (private subnet) has no door to the street at all — you can only reach it from inside the building. A security guard's checklist (security group) then decides which visitors get past the lobby, port by port.",
        publicSubnet:"PUBLIC SUBNET", privateSubnet:"PRIVATE SUBNET",
        webInstance:"WEB-1", dbInstance:"DB-1",
        rule80:"Allow HTTP (80) from the internet", rule22:"Allow SSH (22) from the internet",
        targetLabel:"Request target",
        targetWeb80:"WEB-1 (public) — port 80", targetWeb22:"WEB-1 (public) — port 22", targetDb:"DB-1 (private) — port 5432",
        sendBtn:"Send request from the internet",
        statAllowed:"Requests allowed", statBlocked:"Requests blocked", statOpenPorts:"Open ports", statPrivateHits:"Private subnet attempts",
        note:"Real VPCs work in layers exactly like this: route tables decide what a subnet can even reach, then security groups (stateful, per-instance) and network ACLs (stateless, per-subnet) filter by port and source. A private subnet is unreachable from the internet by routing alone — no firewall rule can undo that.",
        tryStep1:"Send a request to WEB-1 on port 80 — it gets through.",
        tryStep2:"Send a request to DB-1 — blocked, no route exists, no matter what the security group says.",
        tryStep3:"Turn on \"Allow SSH from the internet\" and send to WEB-1 port 22 — watch the status turn EXPOSED.",
        incident:{
          meta:"Capital One · July 2019",
          body:"A misconfigured web application firewall on an EC2 instance let an attacker perform a server-side request forgery — tricking the instance into calling AWS's own internal metadata service and handing over credentials for an IAM role with far more access than it needed. That role reached into S3 and exposed data on over 106 million people. Nothing here was a broken lock; it was a door that should never have been reachable in the first place."
        },
        status:{ locked:"LOCKED DOWN", secure:"SECURE", exposed:"EXPOSED" },
        log:{
          init:"VPC online — 1 public subnet, 1 private subnet",
          allowedPublic:"ALLOWED — {target} reachable, security group permits port {port}",
          blockedSg:"BLOCKED — security group denies port {port} on {target}",
          blockedPrivate:"BLOCKED — {target} has no route from the internet (private subnet)"
        }
      },
      ec2:{
        modId:"MODULE 04", title:"EC2: Instances & Idle Cost",
        titleAzure:"Virtual Machines: Instances & Idle Cost", titleGcp:"Compute Engine: Instances & Idle Cost",
        dek:"An instance isn't a request — it's a rented machine that keeps costing money for every second it's running, whether it's doing anything or not.",
        analogy:"It's like renting a car for the week instead of paying per ride. Handy if you're driving constantly — but if it sits in the driveway for four of those days, you're still paying for all seven, whether you drove it or not.",
        sizeLabel:"Instance size",
        sizeMicro:"t3.micro — 1 vCPU", sizeMedium:"t3.medium — 2 vCPU", sizeXlarge:"t3.xlarge — 4 vCPU",
        launchBtn:"Launch instance",
        loadLabel:"Simulated CPU load —", loadUnit:"%",
        statRunning:"Running instances", statCost:"Accrued cost", statVcpu:"Total vCPUs", statIdle:"Idle but running",
        stopBtn:"Stop", terminateBtn:"Terminate",
        note:"This is why cost dashboards matter: AWS bills for a running instance whether its CPU sits at 2% or 90%. Auto-scaling (module 07) removes idle capacity automatically; without it, \"launch and forget\" is the single most common way cloud bills balloon.",
        tryStep1:"Launch two or three instances and watch the accrued cost tick up even at 0% load.",
        tryStep2:"Push simulated load up — notice the cost doesn't change, only the CPU bars do.",
        tryStep3:"Stop an instance instead of terminating it — cost stops, but it's still listed, ready to start again.",
        incident:{
          meta:"Code Spaces · June 2014",
          body:"An attacker broke into Code Spaces' AWS console and demanded a ransom. When the company tried to lock them out by resetting credentials, the attacker — who had already created backup logins — retaliated by deleting EC2 instances, EBS snapshots, S3 buckets, and machine images across the account. With no access controls limiting what a single compromised login could destroy, Code Spaces lost most of its infrastructure and backups in one sitting, and shut down within days."
        },
        status:{ idle:"IDLE FLEET", right:"RIGHT-SIZED", over:"OVER-PROVISIONED" },
        log:{
          init:"fleet online — 0 instances running",
          launched:"{id} ({size}) launched — state: pending",
          running:"{id} now running",
          stopped:"{id} stopped — billing paused",
          terminated:"{id} terminated — removed from fleet"
        }
      },
      beanstalk:{
        modId:"MODULE 08", title:"Elastic Beanstalk: Deploys & Rollback",
        titleAzure:"Azure App Service: Deploys & Rollback", titleGcp:"App Engine: Deploys & Rollback",
        dek:"You upload code; the platform provisions the servers, load balancer, and health checks for you — and refuses to finish rolling out a version that fails them.",
        analogy:"It's like a stage manager who won't bring the new set piece into view until it's passed a safety check — if it wobbles, the old set stays up and nobody in the audience ever sees the broken one.",
        liveVersion:"LIVE VERSION",
        bugLabel:"Introduce a bug in this deploy", deployBtn:"Deploy new version",
        statVersion:"Live version", statDeploys:"Deployments", statRollbacks:"Rollbacks", statHealth:"Environment health",
        note:"This mirrors what Beanstalk (and similar platforms — Heroku, Cloud Run, App Engine) actually do under the hood: a rolling or immutable deployment behind the same load balancer and auto-scaling group from module 07, gated by a health check before old capacity is ever removed.",
        tryStep1:"Deploy a clean version and watch it go live in seconds.",
        tryStep2:"Check \"introduce a bug\" and deploy again — watch the health check fail and the rollback happen automatically.",
        tryStep3:"Notice the live version number never changes during a failed deploy — nothing broken ever reaches the audience.",
        incident:{
          meta:"Knight Capital · August 2012",
          body:"During a manual deployment, a technician updated seven of Knight Capital's eight trading servers with new code — and missed the eighth, which still held a dormant, decade-old test feature. When markets opened, that one mismatched server reactivated the old code and began firing unintended trades. In 45 minutes it executed 4 million trades across 154 stocks, losing the firm roughly $440 million and nearly ending the company by the weekend. A deployment process with an atomic, all-or-nothing rollout and a health check would have caught it before a single order went out."
        },
        status:{ ok:"OK", warning:"WARNING", severe:"SEVERE" },
        log:{
          init:"environment online — v1.0 live, health: Ok",
          uploading:"uploading application bundle...",
          provisioning:"provisioning environment...",
          healthCheck:"running health checks...",
          success:"health checks passed — v{version} is now live",
          failure:"health check FAILED on v{version} — environment: Severe",
          rollback:"rolling back to v{version} — environment: Ok"
        }
      },
      route53:{
        modId:"MODULE 09", title:"Route 53: DNS Routing Policies",
        titleAzure:"Azure DNS: DNS Routing Policies", titleGcp:"Cloud DNS: DNS Routing Policies",
        dek:"Before anything reaches a server, a name has to become an address — and which address it becomes can depend on load, distance, or whether anything answers at all.",
        analogy:"It's like calling a company's main phone number and being routed to whichever branch is least busy, or nearest to you, or — if your usual branch stopped answering — automatically sent to the backup office instead, without you ever dialing a different number.",
        regionEU:"REGION — EU", regionUS:"REGION — US", regionAPAC:"REGION — APAC",
        policyLabel:"Routing policy",
        policySimple:"Simple", policyWeighted:"Weighted", policyLatency:"Latency-based", policyFailover:"Failover",
        primaryDownLabel:"Primary region's health check is failing",
        resolveBtn:"Resolve example.com",
        statQueries:"Queries resolved", statPolicy:"Policy", statLastResolved:"Last resolved to", statPrimaryHealth:"Primary health",
        note:"This is genuinely how Route 53 works: simple routing always answers the same way, weighted splits traffic by percentage (handy for canary releases), latency-based answers with whichever region is measured fastest for that resolver, and failover routing depends on active health checks — exactly the mechanism module 12 simulates, just one layer up at the DNS level.",
        reasonSimple:"simple", reasonWeighted:"weighted", reasonLatency:"lowest latency", reasonFailoverDown:"failover — primary down", reasonFailoverUp:"primary healthy",
        tryStep1:"Resolve a few times under \"Weighted\" and watch the split roughly match the configured weights.",
        tryStep2:"Switch to \"Failover\" and fail the primary's health check — resolves now go to the secondary.",
        tryStep3:"Fix the health check and resolve again — traffic returns to the primary automatically.",
        incident:{
          meta:"Dyn · October 2016",
          body:"On October 21, 2016, a botnet of hundreds of thousands of hijacked smart devices — infected with malware called Mirai — flooded Dyn, a major DNS provider, with traffic peaking over 1 terabit per second. Dyn resolved DNS for huge swaths of the internet, so when it went down, so did the ability to even look up the address for Twitter, Netflix, Reddit, Spotify, PayPal, and dozens of other major sites — even though those sites' own servers were running fine the whole time. If nobody can resolve your name to an address, it doesn't matter how healthy your servers are."
        },
        status:{ healthy:"HEALTHY", failoverActive:"FAILOVER ACTIVE" },
        log:{
          init:"3 regions configured — policy: Simple",
          resolved:"example.com → {region} ({reason})",
          primaryDown:"primary region health check FAILED",
          primaryUp:"primary region health check recovered"
        }
      },
      sns:{
        modId:"MODULE 13", title:"SNS: One Event, Many Subscribers",
        titleAzure:"Event Grid: One Event, Many Subscribers", titleGcp:"Pub/Sub: One Event, Many Subscribers",
        dek:"A single published event fans out to every subscriber at once — email, text message, another service — without the publisher knowing or caring who's listening.",
        analogy:"It's like a school's PA announcement instead of the principal calling every classroom one by one: say it once, and every room subscribed to that speaker hears it at the same moment, whether it's 3 rooms or 300.",
        topicLabel:"TOPIC — order.placed",
        subEmail:"Email", subSms:"SMS", subQueue:"Queue (worker)",
        failLabel:"Simulate one subscriber failing",
        publishBtn:"Publish event",
        statPublished:"Events published", statDelivered:"Deliveries", statFailed:"Failed / retried", statSubs:"Active subscribers",
        note:"This is the real shape of SNS: a topic, any number of subscribers (email, SMS, SQS queues, Lambda functions), and automatic retries with backoff on failure — eventually landing in a dead-letter queue if nothing works. It's what lets a checkout service announce \"order placed\" without needing to know that a warehouse system, an email service, and an analytics pipeline all care.",
        tryStep1:"Publish an event with all three subscribers on and watch them all fire together.",
        tryStep2:"Unsubscribe SMS, then publish again — only the remaining two fire.",
        tryStep3:"Turn on \"simulate failing subscriber\" and publish a few times — watch retries, and eventually a dead-letter.",
        incident:{
          meta:"AWS Kinesis · November 2020",
          body:"This one isn't SNS itself, but the lesson is identical. In November 2020, routine capacity growth pushed AWS's Kinesis streaming service past an internal operating-system thread limit in US-EAST-1. Kinesis is a backbone that other services quietly stream data through — so when it degraded, Cognito logins started failing, CloudWatch stopped processing metrics and alarms, and the outage cascaded through services most customers never knew depended on it. A shared fan-out backbone is exactly that: shared. When it wobbles, everything subscribed through it wobbles too."
        },
        status:{ fanning:"FANNING OUT", degraded:"DEGRADED", dlq:"DLQ BUILDUP" },
        log:{
          init:"topic online — 3 subscribers active",
          published:"event published to topic",
          delivered:"delivered → {sub}",
          retry:"delivery to {sub} failed — retrying ({n}/3)",
          deadLetter:"delivery to {sub} moved to dead-letter queue after 3 failed attempts",
          subChanged:"{sub} {state}"
        }
      },
      snowball:{
        modId:"MODULE 15", title:"Snowball Edge: When the Network Loses",
        titleAzure:"Azure Data Box: When the Network Loses", titleGcp:"Transfer Appliance: When the Network Loses",
        dek:"Past a certain size, the fastest way to move data isn't a bigger pipe — it's a physical box on a truck.",
        analogy:"If you needed to send someone 10TB of family photos, emailing them one at a time would take forever — at some point it's genuinely faster to copy them to a hard drive and mail it. Snowball Edge is that instinct, turned into an actual AWS product.",
        dataSizeLabel:"Dataset size —", dataSizeUnit:"TB",
        bandwidthLabel:"Your network bandwidth —", bandwidthUnit:"Mbps",
        networkResult:"OVER THE NETWORK", snowballResult:"BY SNOWBALL EDGE",
        statNetworkTime:"Network transfer time", statSnowballTime:"Snowball Edge time", statDevices:"Devices needed", statWinner:"Faster method",
        note:"Real Snowball Edge devices hold up to 80TB usable each, and AWS's own guidance is blunt about it: if your transfer would take more than about a week over your current bandwidth, shipping a device is very likely faster — and it doesn't compete with your production network traffic while it copies.",
        tryStep1:"Set a small dataset and fast bandwidth — the network wins easily.",
        tryStep2:"Push the dataset size up into the hundreds of terabytes and watch the crossover happen.",
        tryStep3:"Drop your bandwidth down to a slow connection and see how much sooner the truck wins.",
        incident:{
          meta:"Real world, not an outage",
          body:"Computer scientist Andrew Tanenbaum put this in a networking textbook back in 1996: \"Never underestimate the bandwidth of a station wagon full of tapes hurtling down the highway.\" AWS took the joke seriously enough to build Snowmobile — a literal 45-foot shipping container on a truck, holding up to 100 petabytes and moving it at up to 1 terabit per second once plugged in, for customers whose datasets were too large to move any other way. (AWS retired the Snowmobile service in 2024; Snowball Edge, its smaller sibling, is still very real.)"
        },
        status:{ networkWins:"NETWORK WINS", snowballWins:"SNOWBALL WINS" },
        log:{ init:"calculator ready" },
        unitSeconds:" sec", unitMinutes:" min", unitHours:" hr", unitDays:" days"
      },
      auth:{
        modId:"MODULE 01", title:"Signing In: Federated & Passwordless",
        titleAzure:"Signing In: Federated & Passwordless (Microsoft Entra ID)", titleGcp:"Signing In: Federated & Passwordless (Google Identity Platform)",
        dek:"None of these methods ever hand your password to this app — they either ask someone else to vouch for you, or prove you control something only you should have.",
        analogy:"It's the difference between showing a bouncer your actual house keys versus showing a wristband a trusted friend already checked you in with. \"Sign in with Google\" is the wristband — this app never sees what unlocked it.",
        flowLabel:"Choose a method",
        flowGoogle:"Sign in with Google", flowEmail:"Email link", flowPhone:"Phone code",
        startBtn:"Start flow", resetBtn:"Reset",
        statFlow:"Flow", statStep:"Step", statSeen:"Credentials seen by this app", statState:"Session",
        note:"This is genuinely how OAuth/OIDC (\"Sign in with Google\"), magic links, and SMS one-time codes work: the app never touches your Google password, your email password, or a permanent secret — it either receives a short-lived signed token from an identity provider, or verifies a code that's useless five minutes later. That's why none of them require this app to store a password at all.",
        tryStep1:"Run the Google flow and watch \"credentials seen by this app\" stay at zero the whole time.",
        tryStep2:"Try the email link flow — notice the link is single-use and time-limited, not a password.",
        tryStep3:"Run the phone code flow, then read the incident below for why it's considered the weakest of the three.",
        incident:{
          meta:"Jack Dorsey · August 2019",
          body:"Twitter's own CEO had his personal account taken over for about 20 minutes in August 2019 — not through a stolen password, but a SIM swap: attackers convinced his mobile carrier to move his phone number onto a SIM card they controlled. Once they had his number, they could receive his SMS codes and reset access. Phone-based verification proves you have a phone number right now — not that you're the person who's always had it, which is exactly the gap SIM swapping exploits."
        },
        status:{ signedOut:"SIGNED OUT", inProgress:"IN PROGRESS", signedIn:"SIGNED IN" },
        google:{
          step1:"Redirecting to accounts.google.com...",
          step2:"Google shows a consent screen: \"CloudLab wants to know your name and email\"",
          step3:"You approve",
          step4:"Google redirects back with a signed id_token — your password never left Google",
          step5:"App verifies the token's signature and starts a session"
        },
        email:{
          step1:"You enter your email address",
          step2:"App sends a single-use link, valid for 15 minutes",
          step3:"You open your inbox and click the link",
          step4:"App verifies the link's token and starts a session"
        },
        phone:{
          step1:"You enter your phone number",
          step2:"App texts a 6-digit code",
          step3:"You enter the code",
          step4:"App verifies the code and starts a session"
        },
        log:{
          init:"signed out",
          started:"starting {flow} flow...",
          complete:"session started — signed in",
          reset:"session cleared — signed out"
        },
        quest:{
          eyebrow:"QUEST", title:"Fix the broken sign-in",
          intro:"Below is a simplified mock of the Google Cloud Console. \"Sign in with Google\" is wired up on this page already — but it's broken, because none of the setup a real developer has to do has been done yet. Complete the steps below, in any order, then try signing in again.",
          consoleLabel:"Google Cloud Console (simulated)",
          trySignInBtn:"Sign in with Google",
          resultSuccess:"Signed in as demo@cloudlab.app — every step below is done.",
          stepConsent:"Configure the OAuth consent screen",
          stepClientId:"Create an OAuth 2.0 Client ID",
          stepRedirect:"Add the correct authorized redirect URI",
          stepApi:"Enable the People API",
          doneTag:"done",
          consentPrompt:"Choose a user type for the consent screen:",
          consentInternal:"Internal", consentExternal:"External",
          consentInternalError:"Internal is restricted to accounts inside a single Google Workspace organization. CloudLab is a public app anyone can sign into — Internal would lock out every one of them.",
          consentExternalOk:"External — any Google Account can sign in. Consent screen saved.",
          clientTypePrompt:"Choose an application type for the OAuth client:",
          clientTypeWeb:"Web application", clientTypeDesktop:"Desktop app", clientTypeAndroid:"Android", clientTypeIos:"iOS",
          clientTypeWrongError:"Wrong type — a {type} client isn't built to receive an HTTP redirect back from a browser sign-in. Google would reject this app's requests outright.",
          clientTypeOk:"Web application client created — ID {clientId}",
          redirectPrompt:"Pick the redirect URI that actually matches this app:",
          redirectWrong:"Rejected — that URI doesn't match this app. A real Google sign-in would fail here with redirect_uri_mismatch.",
          redirectCorrect:"Added — that URI matches this app's real callback path.",
          apiLibraryLabel:"API Library",
          apiResultName:"Google People API",
          apiEnableBtn:"Enable", apiEnabling:"Enabling…", apiEnabledOk:"Enabled.",
          errorConsent:"Error 403: access_denied — this app's OAuth consent screen hasn't been configured yet.",
          errorClient:"Error 401: invalid_client — no OAuth 2.0 client exists for this app yet.",
          errorRedirect:"Error 400: redirect_uri_mismatch — the redirect URI in the request doesn't match any authorized for this client.",
          errorApi:"Error 403: access_denied — Google People API has not been used in this project before or it is disabled.",
          resetBtn:"Reset quest",
          completeNote:"These are the actual four steps every real \"Sign in with Google\" integration requires in Google Cloud Console — this quest just compresses the clicking and waiting out of it."
        }
      },
      iam:{
        modId:"MODULE 02", title:"IAM: Permissions & Least Privilege",
        titleAzure:"Microsoft Entra ID: Permissions & Least Privilege", titleGcp:"Cloud IAM: Permissions & Least Privilege",
        dek:"A role isn't secure or insecure by itself — it's exactly as dangerous as the permissions attached to it, and nothing more.",
        analogy:"It's the difference between a hotel key card that only opens one room versus a master key that opens every door in the building. Both look identical in your hand. The damage from losing one is completely different from losing the other.",
        permsLabel:"Permissions attached to this role",
        permRead:"s3:GetObject — read files", permWrite:"s3:PutObject — write files",
        permLaunch:"ec2:RunInstances — launch servers", permWildcard:"*:* — administrator access",
        actionsLabel:"Try an action with this role",
        actionRead:"Read a file", actionWrite:"Write a file", actionLaunch:"Launch a server", actionLeak:"Simulate a leaked credential (attempt everything)",
        statGranted:"Permissions granted", statAllowed:"Actions allowed", statDenied:"Actions denied", statBlast:"Blast radius if leaked",
        blastLow:"Low", blastHigh:"High — full account access",
        note:"This is the actual mechanism behind every IAM policy: each action a credential attempts is checked against an explicit allow list, and anything not listed is denied by default. \"Least privilege\" just means that list should be as short as the job requires — a wildcard (*) isn't a convenience, it's a promise that a single leaked key can do anything to the whole account.",
        tryStep1:"Leave only \"read\" checked and try each action — only reading a file succeeds.",
        tryStep2:"Check \"administrator access\" and click \"simulate a leaked credential\" — watch every action succeed at once.",
        tryStep3:"Uncheck the wildcard, grant only what the job needs, and compare the blast-radius stat.",
        incident:{
          meta:"Uber · November 2016",
          body:"Attackers found AWS credentials hardcoded in a private GitHub repository used by Uber engineers. Those credentials weren't scoped to one small task — they had broad access to a data store holding personal information for 57 million riders and drivers. Uber didn't disclose the breach for over a year, and paid the attackers $100,000 to delete the data and stay quiet, a decision that later triggered FTC action and state settlements once it came to light. A narrowly scoped credential would have handed the attackers a locked door instead of the building's master key."
        },
        status:{ leastPriv:"LEAST PRIVILEGE", overPermissioned:"OVER-PERMISSIONED" },
        log:{
          init:"role attached — no permissions granted",
          allowed:"ALLOWED — {action} permitted by attached policy",
          denied:"DENIED — {action} not in attached policy (default deny)",
          leakStart:"simulating a leaked credential — attempting every action..."
        }
      },
      s3:{
        modId:"MODULE 05", title:"S3: Object Storage & Versioning",
        titleAzure:"Blob Storage: Object Storage & Versioning", titleGcp:"Cloud Storage: Object Storage & Versioning",
        dek:"An object store doesn't overwrite — by default every PUT to the same name is a brand-new version sitting on top of the last one.",
        analogy:"It's like a shared document with \"track changes\" always on: saving over the old draft doesn't erase it, it just files the old draft underneath and makes yours the one people see. Nothing is really gone until someone deliberately shreds a specific draft.",
        keyLabel:"Object key", keyValue:"photos/family.jpg",
        uploadBtn:"Upload new version", deleteBtn:"Delete object", restoreBtn:"Restore previous version",
        versioningLabel:"Versioning enabled",
        blockPublicLabel:"Block Public Access (on by default)",
        publicPolicyLabel:"Public-read bucket policy attached",
        testPublicBtn:"Test an anonymous read",
        statVersions:"Versions stored", statState:"Object state", statPublic:"Public access", statSize:"Approx. storage used",
        badgeCurrent:"current", badgePrevious:"previous",
        note:"This is genuinely how S3 versioning works: turning it on means a DELETE without a specific version ID just adds an invisible \"delete marker\" on top — the object looks gone, but every prior version is still billed and still recoverable until someone deletes that exact version ID. Public access is a separate axis entirely: Block Public Access and a bucket/object policy both have to agree to expose anything.",
        tryStep1:"Upload a couple of versions, delete the object, then restore it — nothing was actually lost.",
        tryStep2:"Turn versioning off, delete the object, and try to restore it — this time it's actually gone.",
        tryStep3:"Turn off Block Public Access, attach the public-read policy, and test an anonymous read.",
        incident:{
          meta:"Verizon / NICE Systems · July 2017",
          body:"A security researcher scanning for open Amazon S3 buckets found one, run by Verizon partner NICE Systems, with no access restriction at all — anyone with the URL could browse it. It held call and account records for roughly 14 million Verizon customers. Nothing was hacked in the traditional sense; the bucket's permissions were simply left open, which any anonymous visitor could just... read. Verizon secured it after being notified, but the data had been publicly reachable for an unknown stretch of time before that."
        },
        status:{ secure:"SECURE", exposed:"PUBLICLY EXPOSED", available:"AVAILABLE", deleted:"DELETED (recoverable)", gone:"DELETED (unrecoverable)", empty:"NO OBJECT YET" },
        log:{
          init:"bucket ready — versioning off, public access blocked",
          uploaded:"v{v} uploaded — {size} — now the current version",
          deletedMarker:"delete marker added — object hidden, {n} version(s) still stored",
          deletedHard:"object permanently deleted — versioning was off, nothing to recover",
          restored:"delete marker removed — v{v} is the current version again",
          restoreNoop:"object isn't deleted — nothing to restore",
          publicBlocked:"anonymous GET → 403 Forbidden — Block Public Access is on",
          publicNoPolicy:"anonymous GET → 403 Forbidden — no public-read policy attached",
          publicExposed:"anonymous GET → 200 OK — object contents returned to an unauthenticated caller"
        }
      },
      lambda:{
        modId:"MODULE 06", title:"Lambda: Serverless & Cold Starts",
        titleAzure:"Azure Functions: Serverless & Cold Starts", titleGcp:"Cloud Functions: Serverless & Cold Starts",
        dek:"There's no server sitting around waiting for a request — an execution environment is built the moment one arrives, and that construction time is the price of not renting anything while idle.",
        analogy:"It's like a pop-up coffee stand that only assembles itself the moment the first customer of the day shows up — that first person waits while the stand gets built, but everyone right behind them gets served instantly, because it's already standing. Leave it alone too long and it packs itself away again.",
        invokeBtn:"Invoke once", burstLabel:"Concurrent requests to send —", burstBtn:"Send burst",
        idleBtn:"Let the pool go idle",
        statInvocations:"Total invocations", statCold:"Cold starts", statWarm:"Warm starts", statAvgLatency:"Average latency", statCost:"Accrued cost",
        badgeWarm:"warm",
        note:"This is genuinely how Lambda works: AWS keeps a pool of \"warm\" execution environments per function, and reuses one instantly if a request arrives while it's idle-but-alive. If every environment is busy or the pool has spun down from inactivity, a brand-new one has to be provisioned first — the \"cold start\" — which is why a burst of concurrent traffic after a quiet period is the single most common cause of a slow first request.",
        tryStep1:"Invoke once — with an empty pool, it's a cold start.",
        tryStep2:"Invoke once more right away — same environment is still warm, so it's fast.",
        tryStep3:"Let the pool go idle, then send a burst of 20 concurrent requests, and watch how many have to start cold.",
        incident:{
          meta:"AWS US-EAST-1 · December 7, 2021",
          body:"An automated process meant to scale capacity for an internal AWS network triggered unexpected behavior in that network, saturating its devices and disrupting communication between other internal AWS services. Lambda's own invocation rate dropped sharply for hours, alongside failures launching new EC2 instances and errors in several other services that depend on that internal network — a reminder that \"serverless\" still runs on physical infrastructure someone else operates, and that infrastructure can still have a bad day."
        },
        status:{ warmPool:"WARM POOL READY", cold:"POOL COLD" },
        log:{
          init:"pool empty — next invocation will cold start",
          cold:"cold start — new execution environment provisioned ({ms}ms)",
          warm:"warm start — reused an idle environment ({ms}ms)",
          burst:"burst of {n} requests — {cold} cold, {warm} warm",
          idled:"pool recycled after inactivity — {n} environment(s) shut down"
        }
      },
      cloudwatch:{
        modId:"MODULE 14", title:"CloudWatch: Monitoring & Alarms",
        titleAzure:"Azure Monitor: Monitoring & Alarms", titleGcp:"Cloud Monitoring: Monitoring & Alarms",
        dek:"An alarm doesn't fire the moment a metric crosses a line — it waits for that breach to repeat, so a single noisy spike doesn't page anyone at 3AM.",
        analogy:"It's a smoke detector with a short delay built in, not a hair-trigger: a few seconds of steam from a hot shower shouldn't set it off, but smoke that keeps building for a while genuinely should. The delay is what makes it trustworthy enough to actually act on.",
        metricLabel:"Simulated CPU metric —", thresholdLabel:"Alarm threshold —",
        spikeBtn:"Spike the metric", silentLabel:"Metric agent stopped reporting",
        statLatest:"Latest datapoint", statStreak:"Consecutive breaches", statAlarm:"Alarm state", statThreshold:"Alarm threshold",
        note:"This mirrors real CloudWatch alarms closely: they evaluate over a configurable number of consecutive periods (three, here) before changing state, specifically to avoid flapping on a single noisy datapoint. And when an agent stops reporting, a real alarm doesn't quietly assume \"OK\" — it can be configured to treat missing data as its own distinct state, because silence isn't the same thing as health.",
        tryStep1:"Watch the metric sit under the threshold — the alarm stays OK.",
        tryStep2:"Click \"spike the metric\" and count the consecutive breaches it takes before ALARM fires.",
        tryStep3:"Check \"metric agent stopped reporting\" and watch the state go to INSUFFICIENT DATA instead of staying OK.",
        incident:{
          meta:"AWS S3 US-EAST-1 · February 28, 2017",
          body:"During routine debugging, an authorized engineer ran a command intended to remove a small number of servers from an S3 subsystem — a typo in the command's input removed far more capacity than intended, taking a large portion of S3 in US-EAST-1 offline for hours and disrupting huge parts of the internet that depended on it. The detail that made it a monitoring lesson: AWS's own public Service Health Dashboard couldn't be updated to show the outage, because the icons and images the dashboard itself depended on were hosted on the very S3 servers that had just gone down."
        },
        status:{ ok:"OK", alarm:"ALARM", insufficient:"INSUFFICIENT DATA" },
        log:{
          init:"alarm created — state OK, threshold {threshold}%",
          datapointOk:"datapoint {value}% — below threshold ({threshold}%)",
          datapointBreach:"datapoint {value}% — breach {streak}/3",
          alarmFired:"ALARM — 3 consecutive breaches past {threshold}% — would notify SNS / trigger auto-scaling",
          alarmCleared:"state → OK — datapoint back under threshold",
          noData:"no datapoint received — {n}/3 missed periods",
          insufficientFired:"state → INSUFFICIENT DATA — agent has been silent too long",
          spiked:"metric spike triggered"
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
        wordmark:"CloudLab",
        nav:{ cloud101:"00 Bulut nedir?", auth:"01 Giriş", iam:"02 IAM ve izinler", vpc:"03 VPC", ec2:"04 EC2", s3:"05 S3", lambda:"06 Lambda", lb:"07 Yük dengeleme", beanstalk:"08 Beanstalk", route53:"09 Route 53", cache:"10 Önbellekleme", consistency:"11 Tutarlılık", failover:"12 Yük devretme", sns:"13 SNS", cloudwatch:"14 CloudWatch", snowball:"15 Snowball Edge" },
        themeAuto:"Tema: Otomatik", themeLight:"Tema: Açık", themeDark:"Tema: Koyu",
        pageTitle:"CloudLab",
        statusChanged:"durum → {status}",
        analogyLabel:"Basitçe söylemek gerekirse", technicalLabel:"Perde arkasında",
        tryThisLabel:"Dene bunu", realIncidentLabel:"Gerçek olay",
        footer:"Yukarıdaki her şey tarayıcınızda JavaScript ile çalışır — gerçek sunucu, düğüm veya ağ isteği yoktur.",
        resetAll:"Tüm modülleri sıfırla", resetAllShort:"Sıfırla"
      },
      cloud101:{
        modId:"MODÜL 00", title:"\"Bulut\" Gerçekte Nedir?",
        p1:"Bir fotoğraf kaydettiğinizde, bir mesaj gönderdiğinizde ya da bir video izlediğinizde, bu genelde telefonunuzda ya da bilgisayarınızda kalmaz — başka bir yerdeki bir bilgisayara gider, işini yapar ve sonucu geri gönderir. İşte bulut budur: gökyüzünde gizemli bir yer değil, sadece başkasının bilgisayarları — Amazon, Google ya da Microsoft gibi şirketlere ait — milyonlarca kişiye aynı anda, gün boyu, hiç durmadan hizmet verecek şekilde inşa edilmiş.",
        p2:"Eskiden böyle çalışmıyordu. Şirketler kendi bodrumlarında ya da veri merkezlerinde kendi fiziksel sunucularını satın alıp işletiyordu — satın alması pahalı, soğutması pahalı, personeli pahalı, ve neredeyse her zaman ya yoğun bir gün için çok küçük ya da sakin bir gün için çok büyüktü. Bulut sağlayıcıları, devasa paylaşılan veri merkezlerini bir kez inşa edip, o kapasitenin küçük dilimlerini ihtiyacı olan herkese saat başına, hatta saniye başına kiralayabileceklerini fark etti. Bütün bu işi çalışır kılan da kiralama fikri: artık ihtiyacınız olabilecek bir depo dolusu bilgisayar için ödeme yapmıyorsunuz, sadece şu anda gerçekten kullandıklarınız için ödüyorsunuz.",
        p3:"Her bulut sağlayıcısı aslında farklı ürün isimleriyle sarılmış dört söz satıyor: yoğunlaştığınızda büyüyecek, sakinleştiğinizde küçülecek (esneklik), bir sabit disk ya da koca bir bina çökse bile verinizi kaybetmeyecek (dayanıklılık), Tokyo'daki biriyle Toronto'daki birine, ikisi de diğerinin varlığını fark etmeden hizmet verebilecek (küresel erişim), ve sadece gerçekten kullandığınız kadarını ödeyeceksiniz (ölçülü fiyatlandırma). Bir bulut sağlayıcısının sattığı hemen her şey — aşağıdaki 16 modül dahil — bu dört sözden birinin gerçek bir ürüne dönüşmüş hali.",
        p4:"Aşağıdaki her modül, bunun gerçekte nasıl çalıştığının küçük bir parçasını simüle ediyor — bu uygulamanın parolanızı hiç görmeden giriş yapmanız, boşta duran bir sunucunun her saniye para harcamaya devam etmesi, tek bir mesajın beş farklı aboneye aynı anda ulaşması, sabit disklerle dolu bir kamyonun bir ağ kablosunu yenmesi. Hiçbiri gerçek bir sunucu ya da gerçek bir ağ isteği değil; gerçek sistemlerin çalıştırdığı aynı mantık, sadece yavaşlatılmış ve izleyebilmeniz için görünür kılınmış.",
        glossaryLabel:"Aşağıda sıkça göreceğiniz birkaç kelime",
        glossRegionTerm:"Bölge (Region)",
        glossRegionDef:"Bir sağlayıcının faaliyet gösterdiği belirli bir coğrafi alan — örneğin \"US East\" ya da \"Europe West\" — genelde birbirine yeterince yakın, ama yerel bir felaketten kurtulabilecek kadar da uzak birden fazla veri merkezinden oluşur.",
        glossAzTerm:"Kullanılabilirlik bölgesi (Availability Zone)",
        glossAzDef:"Bir bölge içindeki, kendi elektrik ve soğutmasına sahip, fiziksel olarak ayrı tek bir veri merkezi. Bir servisi bölgeler arasında yaymak, bir bölgenin yanmasının tüm bölgeyi çökertmemesini sağlar.",
        glossInstanceTerm:"Örnek (Instance)",
        glossInstanceDef:"Kiralanmış tek bir sanal bilgisayar — çok daha büyük fiziksel bir makineden kesilip size sanki kendinizinmiş gibi verilen CPU, bellek ve depolama.",
        glossApiTerm:"API",
        glossApiDef:"Bir yazılım parçasının, başka bir yazılımın ondan bir şey yapmasını isteyebilmesi için açığa çıkardığı kurallar bütünü. Bulutta olan hemen her şey — aşağıdaki her modül dahil — bir programın başka bir programın API'sini çağırmasıyla olur.",
        glossManagedTerm:"Yönetilen servis (Managed Service)",
        glossManagedDef:"Sağlayıcının sizin yerinize işlettiği bir altyapı parçası — yamalanmış, yedeklenmiş, ölçeklenmiş — böylece altındaki gerçek makineyi hiç düşünmeniz gerekmez. Aşağıdaki 16 modülün çoğu bir yönetilen servisi simüle ediyor.",
        glossSlaTerm:"SLA / çalışma süresi",
        glossSlaDef:"Bir sağlayıcının bir servisin ne kadar güvenilir olacağına dair yazılı sözü, genelde %99,99 gibi bir yüzde ile ifade edilir — bu %100'e yakın görünse de, yılda yaklaşık 52 dakikalık bir kesintiye hâlâ izin verir."
      },
      intro:{
        title:"Bulut sistemleri, parçalarına ayrıldı",
        p:"Büyük sistemleri ayakta tutan mekanizmaların on altı küçük, canlı simülasyonu — arkasında gerçek sunucu yok, sadece mantık. Kadranları çevirin ve yük altında, bir ağ bölünmesinde, bir önbellek ıskalamasında, bir arızada gerçekte ne olduğunu izleyin.",
        meta:"16 modül · tamamen tarayıcınızda çalışır · gerçek altyapı yok"
      },
      lb:{
        modId:"MODÜL 07", title:"Yük Dengeleme ve Otomatik Ölçekleme",
        titleAzure:"Azure Load Balancer: Yük Dengeleme ve Otomatik Ölçekleme", titleGcp:"Cloud Load Balancing: Yük Dengeleme ve Otomatik Ölçekleme",
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
        modId:"MODÜL 11", title:"Dağıtık Tutarlılık",
        titleAzure:"Dağıtık Tutarlılık (Azure Cosmos DB)", titleGcp:"Dağıtık Tutarlılık (Cloud Spanner)",
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
        modId:"MODÜL 10", title:"Önbellekleme ve CDN",
        titleAzure:"Önbellekleme ve Azure CDN", titleGcp:"Önbellekleme ve Cloud CDN",
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
        modId:"MODÜL 12", title:"Hata Toleransı ve Yük Devretme",
        titleAzure:"Hata Toleransı ve Yük Devretme (Azure SQL Yük Devretme Grupları)", titleGcp:"Hata Toleransı ve Yük Devretme (Cloud SQL Yüksek Kullanılabilirlik)",
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
      vpc:{
        modId:"MODÜL 03", title:"VPC: Ağlar ve Güvenlik Grupları",
        titleAzure:"Sanal Ağ: Ağlar ve Güvenlik Grupları", titleGcp:"VPC Ağı: Ağlar ve Güvenlik Grupları",
        dek:"Bulut ağı alt ağlara bölünür — bazıları internetten erişilebilir, bazıları kasıtlı olarak değil — ve bir güvenlik grubu hangi portların kapıyı çalabileceğine karar verir.",
        analogy:"Bir ofis binasını düşünün: lobi (herkese açık alt ağ) sokaktan gelen herkese açıktır, ama sunucu odasının (özel alt ağ) sokağa açılan kapısı yoktur — oraya sadece binanın içinden ulaşılabilir. Bir güvenlik görevlisinin kontrol listesi (güvenlik grubu) ise lobiden kimin geçebileceğine port port karar verir.",
        publicSubnet:"HERKESE AÇIK ALT AĞ", privateSubnet:"ÖZEL ALT AĞ",
        webInstance:"WEB-1", dbInstance:"DB-1",
        rule80:"İnternetten HTTP'ye (80) izin ver", rule22:"İnternetten SSH'a (22) izin ver",
        targetLabel:"İstek hedefi",
        targetWeb80:"WEB-1 (herkese açık) — port 80", targetWeb22:"WEB-1 (herkese açık) — port 22", targetDb:"DB-1 (özel) — port 5432",
        sendBtn:"İnternetten istek gönder",
        statAllowed:"İzin verilen istek", statBlocked:"Engellenen istek", statOpenPorts:"Açık port", statPrivateHits:"Özel alt ağ denemesi",
        note:"Gerçek VPC'ler tam olarak böyle katmanlar halinde çalışır: yönlendirme tabloları bir alt ağın neye ulaşabileceğine karar verir, sonra güvenlik grupları (durumlu, örnek başına) ve ağ ACL'leri (durumsuz, alt ağ başına) porta ve kaynağa göre filtreler. Özel bir alt ağa internetten sadece yönlendirme yüzünden ulaşılamaz — hiçbir güvenlik duvarı kuralı bunu değiştiremez.",
        tryStep1:"WEB-1'e 80 portundan istek gönderin — geçer.",
        tryStep2:"DB-1'e istek gönderin — güvenlik grubu ne derse desin, yönlendirme olmadığı için engellenir.",
        tryStep3:"\"İnternetten SSH'a izin ver\"i açın ve WEB-1'e 22 portundan gönderin — durumun AÇIK'a döndüğünü izleyin.",
        incident:{
          meta:"Capital One · Temmuz 2019",
          body:"Bir EC2 örneğindeki hatalı yapılandırılmış bir web uygulama güvenlik duvarı, bir saldırganın sunucu taraflı istek sahteciliği (SSRF) yapmasına izin verdi — örneği, AWS'nin kendi dahili metadata servisini çağırmaya ve ihtiyacından çok daha fazla erişime sahip bir IAM rolünün kimlik bilgilerini vermeye kandırdı. O rol S3'e uzandı ve 106 milyondan fazla kişinin verisini açığa çıkardı. Burada kırılan bir kilit yoktu; hiç ulaşılabilir olmaması gereken bir kapıydı."
        },
        status:{ locked:"KİLİTLİ", secure:"GÜVENLİ", exposed:"AÇIK" },
        log:{
          init:"VPC çevrimiçi — 1 herkese açık, 1 özel alt ağ",
          allowedPublic:"İZİN VERİLDİ — {target} erişilebilir, güvenlik grubu {port} portuna izin veriyor",
          blockedSg:"ENGELLENDİ — güvenlik grubu {target} üzerinde {port} portunu reddediyor",
          blockedPrivate:"ENGELLENDİ — {target} internetten yönlendirmeye sahip değil (özel alt ağ)"
        }
      },
      ec2:{
        modId:"MODÜL 04", title:"EC2: Örnekler ve Boşta Duran Maliyet",
        titleAzure:"Sanal Makineler: Örnekler ve Boşta Duran Maliyet", titleGcp:"Compute Engine: Örnekler ve Boşta Duran Maliyet",
        dek:"Bir örnek bir istek değildir — çalıştığı her saniye için, bir şey yapıyor olsun ya da olmasın para harcatan kiralık bir makinedir.",
        analogy:"Yolculuk başına ödemek yerine hafta boyunca araba kiralamak gibi. Sürekli kullanıyorsanız işe yarar — ama dört gün garajda dururken bile yedi günün tamamını ödersiniz, sürseniz de sürmeseniz de.",
        sizeLabel:"Örnek boyutu",
        sizeMicro:"t3.micro — 1 vCPU", sizeMedium:"t3.medium — 2 vCPU", sizeXlarge:"t3.xlarge — 4 vCPU",
        launchBtn:"Örnek başlat",
        loadLabel:"Simüle edilmiş CPU yükü —", loadUnit:"%",
        statRunning:"Çalışan örnek", statCost:"Biriken maliyet", statVcpu:"Toplam vCPU", statIdle:"Boşta ama çalışıyor",
        stopBtn:"Durdur", terminateBtn:"Sonlandır",
        note:"Maliyet panellerinin önemli olmasının sebebi bu: AWS, CPU'su %2'de dursun %90'da dursun çalışan bir örneği faturalandırır. Otomatik ölçekleme (modül 07) boşta kalan kapasiteyi kendiliğinden kaldırır; o olmadan \"başlat ve unut\" bulut faturalarının şişmesinin en yaygın sebebidir.",
        tryStep1:"İki üç örnek başlatın ve %0 yükte bile biriken maliyetin arttığını izleyin.",
        tryStep2:"Simüle edilmiş yükü yükseltin — maliyetin değil, sadece CPU çubuklarının değiştiğine dikkat edin.",
        tryStep3:"Bir örneği sonlandırmak yerine durdurun — maliyet durur, ama hâlâ listede, tekrar başlatılmaya hazır.",
        incident:{
          meta:"Code Spaces · Haziran 2014",
          body:"Bir saldırgan Code Spaces'in AWS konsoluna sızdı ve fidye istedi. Şirket kimlik bilgilerini sıfırlayarak onu dışarıda bırakmaya çalıştığında, zaten yedek girişler oluşturmuş olan saldırgan, hesap genelinde EC2 örneklerini, EBS anlık görüntülerini, S3 kovalarını ve makine imajlarını silerek karşılık verdi. Tek bir ele geçirilmiş girişin neyi yok edebileceğini sınırlayan erişim kontrolleri olmadan, Code Spaces altyapısının ve yedeklerinin çoğunu tek oturuşta kaybetti ve günler içinde kapandı."
        },
        status:{ idle:"BOŞTA FİLO", right:"DOĞRU BOYUT", over:"AŞIRI SAĞLANMIŞ" },
        log:{
          init:"filo çevrimiçi — 0 örnek çalışıyor",
          launched:"{id} ({size}) başlatıldı — durum: bekliyor",
          running:"{id} artık çalışıyor",
          stopped:"{id} durduruldu — faturalama duraklatıldı",
          terminated:"{id} sonlandırıldı — filodan kaldırıldı"
        }
      },
      beanstalk:{
        modId:"MODÜL 08", title:"Elastic Beanstalk: Dağıtımlar ve Geri Alma",
        titleAzure:"Azure App Service: Dağıtımlar ve Geri Alma", titleGcp:"App Engine: Dağıtımlar ve Geri Alma",
        dek:"Kodu yüklersiniz; platform sunucuları, yük dengeleyiciyi ve sağlık kontrollerini sizin için sağlar — ve bunları geçemeyen bir sürümün dağıtımını tamamlamayı reddeder.",
        analogy:"Güvenlik kontrolünden geçmeden yeni sahne dekorunu sahneye çıkarmayı reddeden bir sahne amiri gibi — sallanırsa eski dekor yerinde kalır ve seyirciden kimse bozuk olanı hiç görmez.",
        liveVersion:"CANLI SÜRÜM",
        bugLabel:"Bu dağıtıma bir hata ekle", deployBtn:"Yeni sürüm dağıt",
        statVersion:"Canlı sürüm", statDeploys:"Dağıtımlar", statRollbacks:"Geri almalar", statHealth:"Ortam sağlığı",
        note:"Bu, Beanstalk'ın (ve Heroku, Cloud Run, App Engine gibi benzer platformların) perde arkasında gerçekten yaptığı şey: modül 07'deki aynı yük dengeleyici ve otomatik ölçekleme grubunun arkasında, eski kapasite hiç kaldırılmadan önce bir sağlık kontrolünden geçmesi gereken kademeli ya da değişmez bir dağıtım.",
        tryStep1:"Temiz bir sürüm dağıtın ve saniyeler içinde canlıya çıktığını izleyin.",
        tryStep2:"\"Hata ekle\"yi işaretleyip tekrar dağıtın — sağlık kontrolünün başarısız olup geri almanın kendiliğinden gerçekleştiğini izleyin.",
        tryStep3:"Başarısız bir dağıtım sırasında canlı sürüm numarasının hiç değişmediğine dikkat edin — bozuk hiçbir şey seyirciye ulaşmaz.",
        incident:{
          meta:"Knight Capital · Ağustos 2012",
          body:"Manuel bir dağıtım sırasında bir teknisyen, Knight Capital'ın sekiz işlem sunucusundan yedisini yeni kodla güncelledi — sekizincisini atladı, orada hâlâ on yıllık, uykuda bir test özelliği duruyordu. Piyasalar açıldığında, o tek uyumsuz sunucu eski kodu yeniden etkinleştirdi ve istenmeyen işlemler göndermeye başladı. 45 dakikada 154 hissede 4 milyon işlem gerçekleşti, şirket yaklaşık 440 milyon dolar kaybetti ve hafta sonuna kadar şirketi neredeyse bitiriyordu. Atomik, ya hep ya hiç bir dağıtım süreci ve bir sağlık kontrolü, tek bir emir bile gitmeden bunu yakalardı."
        },
        status:{ ok:"OK", warning:"UYARI", severe:"CİDDİ" },
        log:{
          init:"ortam çevrimiçi — v1.0 canlı, sağlık: Ok",
          uploading:"uygulama paketi yükleniyor...",
          provisioning:"ortam sağlanıyor...",
          healthCheck:"sağlık kontrolleri çalıştırılıyor...",
          success:"sağlık kontrolleri geçti — v{version} artık canlı",
          failure:"v{version} üzerinde sağlık kontrolü BAŞARISIZ — ortam: Ciddi",
          rollback:"v{version} sürümüne geri alınıyor — ortam: Ok"
        }
      },
      route53:{
        modId:"MODÜL 09", title:"Route 53: DNS Yönlendirme Politikaları",
        titleAzure:"Azure DNS: DNS Yönlendirme Politikaları", titleGcp:"Cloud DNS: DNS Yönlendirme Politikaları",
        dek:"Bir şey bir sunucuya ulaşmadan önce, bir ismin adrese dönüşmesi gerekir — ve hangi adrese dönüştüğü yüke, mesafeye ya da hiçbir şeyin yanıt verip vermediğine bağlı olabilir.",
        analogy:"Bir şirketin ana hattını aradığınızda en az meşgul olan, ya da size en yakın şubeye yönlendirilmeniz gibi — ya da her zamanki şubeniz yanıt vermeyi bırakmışsa, siz farklı bir numara çevirmeden otomatik olarak yedek ofise bağlanmanız gibi.",
        regionEU:"BÖLGE — AB", regionUS:"BÖLGE — ABD", regionAPAC:"BÖLGE — APAC",
        policyLabel:"Yönlendirme politikası",
        policySimple:"Basit", policyWeighted:"Ağırlıklı", policyLatency:"Gecikmeye göre", policyFailover:"Yük devretme",
        primaryDownLabel:"Birincil bölgenin sağlık kontrolü başarısız",
        resolveBtn:"example.com'u çözümle",
        statQueries:"Çözümlenen sorgu", statPolicy:"Politika", statLastResolved:"Son çözümlenen", statPrimaryHealth:"Birincil sağlığı",
        note:"Route 53 gerçekten böyle çalışır: basit yönlendirme her zaman aynı yanıtı verir, ağırlıklı trafiği yüzdeye göre böler (canary sürümler için kullanışlı), gecikmeye göre yönlendirme o çözümleyici için en hızlı ölçülen bölgeyle yanıt verir, ve yük devretme yönlendirmesi aktif sağlık kontrollerine bağlıdır — tam olarak modül 12'nin simüle ettiği mekanizma, sadece bir katman yukarıda, DNS seviyesinde.",
        reasonSimple:"basit", reasonWeighted:"ağırlıklı", reasonLatency:"en düşük gecikme", reasonFailoverDown:"yük devretme — birincil devre dışı", reasonFailoverUp:"birincil sağlıklı",
        tryStep1:"\"Ağırlıklı\" altında birkaç kez çözümleyin ve dağılımın yaklaşık olarak yapılandırılmış ağırlıklara uyduğunu izleyin.",
        tryStep2:"\"Yük devretme\"ye geçin ve birincilin sağlık kontrolünü başarısız yapın — çözümlemeler artık ikincile gidiyor.",
        tryStep3:"Sağlık kontrolünü düzeltin ve tekrar çözümleyin — trafik kendiliğinden birincile döner.",
        incident:{
          meta:"Dyn · Ekim 2016",
          body:"21 Ekim 2016'da, Mirai adlı kötü amaçlı yazılımla ele geçirilmiş yüz binlerce akıllı cihazdan oluşan bir botnet, büyük bir DNS sağlayıcısı olan Dyn'i saniyede 1 terabiti aşan bir trafikle boğdu. Dyn internetin geniş bir kısmı için DNS çözümlüyordu, bu yüzden çöktüğünde Twitter, Netflix, Reddit, Spotify, PayPal ve düzinelerce büyük sitenin adresini bulma yeteneği de gitti — o sitelerin kendi sunucuları o süre boyunca gayet iyi çalışıyor olsa bile. Kimse isminizi bir adrese çözemiyorsa, sunucularınızın ne kadar sağlıklı olduğunun önemi kalmaz."
        },
        status:{ healthy:"SAĞLIKLI", failoverActive:"YÜK DEVRETME AKTİF" },
        log:{
          init:"3 bölge yapılandırıldı — politika: Basit",
          resolved:"example.com → {region} ({reason})",
          primaryDown:"birincil bölge sağlık kontrolü BAŞARISIZ",
          primaryUp:"birincil bölge sağlık kontrolü düzeldi"
        }
      },
      sns:{
        modId:"MODÜL 13", title:"SNS: Tek Olay, Çok Abone",
        titleAzure:"Event Grid: Tek Olay, Çok Abone", titleGcp:"Pub/Sub: Tek Olay, Çok Abone",
        dek:"Yayınlanan tek bir olay, yayıncının kimin dinlediğini bilmesine ya da umursamasına gerek kalmadan tüm abonelere aynı anda dağılır — e-posta, mesaj, başka bir servis.",
        analogy:"Müdürün her sınıfı tek tek arayacağına okulun anons sistemi kullanması gibi: bir kez söylersiniz, o hoparlöre abone olan her sınıf aynı anda duyar, ister 3 oda olsun ister 300.",
        topicLabel:"KONU — order.placed",
        subEmail:"E-posta", subSms:"SMS", subQueue:"Kuyruk (worker)",
        failLabel:"Bir abonenin başarısız olmasını simüle et",
        publishBtn:"Olay yayınla",
        statPublished:"Yayınlanan olay", statDelivered:"Teslimat", statFailed:"Başarısız / yeniden denenen", statSubs:"Aktif abone",
        note:"SNS'in gerçek yapısı bu: bir konu, sınırsız sayıda abone (e-posta, SMS, SQS kuyrukları, Lambda fonksiyonları) ve başarısızlıkta geri çekilmeli otomatik yeniden denemeler — hiçbiri işe yaramazsa sonunda bir ölü mektup kuyruğuna düşer. Bu, bir ödeme servisinin \"sipariş verildi\" diye duyurabilmesini sağlar; bir depo sisteminin, bir e-posta servisinin ve bir analiz hattının bunu umursadığını bilmesine gerek kalmadan.",
        tryStep1:"Üç abone de açıkken bir olay yayınlayın ve hepsinin birlikte tetiklendiğini izleyin.",
        tryStep2:"SMS aboneliğini iptal edin, sonra tekrar yayınlayın — sadece kalan ikisi tetiklenir.",
        tryStep3:"\"Başarısız aboneyi simüle et\"i açın ve birkaç kez yayınlayın — yeniden denemeleri, sonunda bir ölü mektubu izleyin.",
        incident:{
          meta:"AWS Kinesis · Kasım 2020",
          body:"Bu SNS'in kendisi değil, ama ders aynı. Kasım 2020'de, rutin bir kapasite artışı AWS'nin Kinesis akış servisini US-EAST-1'de dahili bir işletim sistemi iş parçacığı sınırının ötesine itti. Kinesis, başka servislerin sessizce veri akıttığı bir omurgadır — bu yüzden bozulduğunda Cognito girişleri başarısız olmaya başladı, CloudWatch metrik ve alarmları işlemeyi durdurdu, ve kesinti çoğu müşterinin ona bağlı olduğunu hiç bilmediği servisler arasında yayıldı. Paylaşılan bir dağıtım omurgası tam olarak budur: paylaşılan. O sarsıldığında, ona abone olan her şey de sarsılır."
        },
        status:{ fanning:"DAĞITILIYOR", degraded:"ZAYIFLADI", dlq:"ÖLÜ MEKTUP BİRİKİMİ" },
        log:{
          init:"konu çevrimiçi — 3 abone aktif",
          published:"olay konuya yayınlandı",
          delivered:"teslim edildi → {sub}",
          retry:"{sub} teslimatı başarısız — yeniden deneniyor ({n}/3)",
          deadLetter:"{sub} teslimatı 3 başarısız denemeden sonra ölü mektup kuyruğuna taşındı",
          subChanged:"{sub} {state}"
        }
      },
      snowball:{
        modId:"MODÜL 15", title:"Snowball Edge: Ağın Kaybettiği Yer",
        titleAzure:"Azure Data Box: Ağın Kaybettiği Yer", titleGcp:"Transfer Appliance: Ağın Kaybettiği Yer",
        dek:"Belirli bir boyuttan sonra, veriyi taşımanın en hızlı yolu daha büyük bir boru değil — bir kamyondaki fiziksel bir kutudur.",
        analogy:"Birine 10TB aile fotoğrafı göndermeniz gerekseydi, tek tek e-postalamak sonsuza kadar sürerdi — belli bir noktada onları bir sabit diske kopyalayıp postalamak gerçekten daha hızlıdır. Snowball Edge bu içgüdünün gerçek bir AWS ürününe dönüşmüş hali.",
        dataSizeLabel:"Veri kümesi boyutu —", dataSizeUnit:"TB",
        bandwidthLabel:"Ağ bant genişliğiniz —", bandwidthUnit:"Mbps",
        networkResult:"AĞ ÜZERİNDEN", snowballResult:"SNOWBALL EDGE İLE",
        statNetworkTime:"Ağ aktarım süresi", statSnowballTime:"Snowball Edge süresi", statDevices:"Gereken cihaz", statWinner:"Daha hızlı yöntem",
        note:"Gerçek Snowball Edge cihazları her biri 80TB'a kadar kullanılabilir alan tutar, ve AWS'nin kendi tavsiyesi açık: aktarımınız mevcut bant genişliğinizle yaklaşık bir haftadan uzun sürecekse, bir cihaz göndermek büyük ihtimalle daha hızlıdır — ve kopyalarken üretim ağ trafiğinizle yarışmaz.",
        tryStep1:"Küçük bir veri kümesi ve hızlı bant genişliği seçin — ağ kolayca kazanır.",
        tryStep2:"Veri kümesi boyutunu yüzlerce terabayta çıkarın ve dönüm noktasını izleyin.",
        tryStep3:"Bant genişliğinizi yavaş bir bağlantıya düşürün ve kamyonun ne kadar erken kazandığını görün.",
        incident:{
          meta:"Gerçek dünya, bir kesinti değil",
          body:"Bilgisayar bilimci Andrew Tanenbaum bunu 1996'da bir ağ ders kitabına şöyle yazmıştı: \"Otobandan geçen, teyplerle dolu bir station wagon'un bant genişliğini asla hafife almayın.\" AWS bu şakayı ciddiye alacak kadar ileri gitti ve Snowmobile'ı inşa etti — bir kamyon üzerinde, 100 petabayta kadar veri taşıyan ve bağlandığında saniyede 1 terabite kadar aktaran, gerçek bir 45 fitlik nakliye konteyneri; veri kümesi başka hiçbir şekilde taşınamayacak kadar büyük olan müşteriler için. (AWS, Snowmobile hizmetini 2024'te kullanımdan kaldırdı; daha küçük kardeşi Snowball Edge hâlâ gerçek.)"
        },
        status:{ networkWins:"AĞ KAZANIYOR", snowballWins:"SNOWBALL KAZANIYOR" },
        log:{ init:"hesap makinesi hazır" },
        unitSeconds:" sn", unitMinutes:" dk", unitHours:" sa", unitDays:" gün"
      },
      auth:{
        modId:"MODÜL 01", title:"Giriş Yapmak: Federe ve Parolasız",
        titleAzure:"Giriş Yapmak: Federe ve Parolasız (Microsoft Entra ID)", titleGcp:"Giriş Yapmak: Federe ve Parolasız (Google Identity Platform)",
        dek:"Bu yöntemlerin hiçbiri parolanızı bu uygulamaya vermez — ya başkasının sizin için kefil olmasını ister, ya da sadece sizde olması gereken bir şeyi kontrol ettiğinizi kanıtlarsınız.",
        analogy:"Bir fedaiye gerçek ev anahtarlarınızı göstermekle, güvenilir bir arkadaşınızın sizi zaten içeri aldığı bir bileziği göstermek arasındaki fark gibi. \"Google ile giriş yap\" o bileziktir — bu uygulama onu neyin açtığını hiç görmez.",
        flowLabel:"Bir yöntem seçin",
        flowGoogle:"Google ile giriş yap", flowEmail:"E-posta bağlantısı", flowPhone:"Telefon kodu",
        startBtn:"Akışı başlat", resetBtn:"Sıfırla",
        statFlow:"Akış", statStep:"Adım", statSeen:"Bu uygulamanın gördüğü kimlik bilgisi", statState:"Oturum",
        note:"OAuth/OIDC (\"Google ile giriş yap\"), sihirli bağlantılar ve SMS tek kullanımlık kodlar gerçekten böyle çalışır: uygulama Google parolanıza, e-posta parolanıza ya da kalıcı bir sırra hiç dokunmaz — ya bir kimlik sağlayıcıdan kısa ömürlü, imzalı bir jeton alır, ya da beş dakika sonra işe yaramaz hale gelen bir kodu doğrular. Hiçbirinin bu uygulamanın bir parola saklamasını gerektirmemesinin sebebi bu.",
        tryStep1:"Google akışını çalıştırın ve \"bu uygulamanın gördüğü kimlik bilgisi\"nin baştan sona sıfırda kaldığını izleyin.",
        tryStep2:"E-posta bağlantısı akışını deneyin — bağlantının parola değil, tek kullanımlık ve süreli olduğuna dikkat edin.",
        tryStep3:"Telefon kodu akışını çalıştırın, sonra üçü arasında neden en zayıfı sayıldığını aşağıdaki olayda okuyun.",
        incident:{
          meta:"Jack Dorsey · Ağustos 2019",
          body:"Twitter'ın kendi CEO'sunun kişisel hesabı Ağustos 2019'da yaklaşık 20 dakika boyunca ele geçirildi — çalınan bir parolayla değil, bir SIM takas saldırısıyla: saldırganlar mobil operatörünü telefon numarasını kendi kontrollerindeki bir SIM karta taşımaya ikna etti. Numarasına sahip olduklarında, SMS kodlarını alıp erişimi sıfırlayabildiler. Telefon tabanlı doğrulama, şu anda bir telefon numarasına sahip olduğunuzu kanıtlar — her zaman ona sahip olan kişi olduğunuzu değil, ve SIM takasının istismar ettiği boşluk tam olarak bu."
        },
        status:{ signedOut:"OTURUM KAPALI", inProgress:"DEVAM EDİYOR", signedIn:"OTURUM AÇIK" },
        google:{
          step1:"accounts.google.com'a yönlendiriliyor...",
          step2:"Google bir onay ekranı gösteriyor: \"CloudLab adınızı ve e-postanızı öğrenmek istiyor\"",
          step3:"Onaylıyorsunuz",
          step4:"Google imzalı bir id_token ile geri yönlendiriyor — parolanız Google'dan hiç çıkmadı",
          step5:"Uygulama jetonun imzasını doğrular ve oturum başlatır"
        },
        email:{
          step1:"E-posta adresinizi giriyorsunuz",
          step2:"Uygulama 15 dakika geçerli, tek kullanımlık bir bağlantı gönderiyor",
          step3:"Gelen kutunuzu açıp bağlantıya tıklıyorsunuz",
          step4:"Uygulama bağlantının jetonunu doğrular ve oturum başlatır"
        },
        phone:{
          step1:"Telefon numaranızı giriyorsunuz",
          step2:"Uygulama 6 haneli bir kod gönderiyor",
          step3:"Kodu giriyorsunuz",
          step4:"Uygulama kodu doğrular ve oturum başlatır"
        },
        log:{
          init:"oturum kapalı",
          started:"{flow} akışı başlıyor...",
          complete:"oturum başlatıldı — giriş yapıldı",
          reset:"oturum temizlendi — oturum kapalı"
        },
        quest:{
          eyebrow:"GÖREV", title:"Bozuk oturum açmayı düzelt",
          intro:"Aşağıda Google Cloud Console'un basitleştirilmiş bir taklidi var. \"Google ile giriş yap\" bu sayfada zaten bağlanmış — ama bozuk, çünkü gerçek bir geliştiricinin yapması gereken kurulum adımlarının hiçbiri henüz yapılmadı. Aşağıdaki adımları herhangi bir sırada tamamlayın, sonra tekrar giriş yapmayı deneyin.",
          consoleLabel:"Google Cloud Console (simüle edilmiş)",
          trySignInBtn:"Google ile giriş yap",
          resultSuccess:"demo@cloudlab.app olarak giriş yapıldı — aşağıdaki her adım tamamlandı.",
          stepConsent:"OAuth onay ekranını yapılandır",
          stepClientId:"Bir OAuth 2.0 İstemci Kimliği oluştur",
          stepRedirect:"Doğru yetkili yönlendirme URI'sini ekle",
          stepApi:"People API'sini etkinleştir",
          doneTag:"tamam",
          consentPrompt:"Onay ekranı için bir kullanıcı türü seçin:",
          consentInternal:"Dahili (Internal)", consentExternal:"Harici (External)",
          consentInternalError:"Dahili, tek bir Google Workspace kuruluşundaki hesaplarla sınırlıdır. CloudLab herkesin giriş yapabildiği herkese açık bir uygulama — Dahili seçilirse hepsi dışarıda kalır.",
          consentExternalOk:"Harici — herhangi bir Google Hesabı giriş yapabilir. Onay ekranı kaydedildi.",
          clientTypePrompt:"OAuth istemcisi için bir uygulama türü seçin:",
          clientTypeWeb:"Web uygulaması", clientTypeDesktop:"Masaüstü uygulaması", clientTypeAndroid:"Android", clientTypeIos:"iOS",
          clientTypeWrongError:"Yanlış tür — bir {type} istemcisi bir tarayıcı girişinden HTTP yönlendirmesi almak üzere tasarlanmamıştır. Google bu uygulamanın isteklerini doğrudan reddederdi.",
          clientTypeOk:"Web uygulaması istemcisi oluşturuldu — Kimlik {clientId}",
          redirectPrompt:"Bu uygulamayla gerçekten eşleşen yönlendirme URI'sini seçin:",
          redirectWrong:"Reddedildi — bu URI bu uygulamayla eşleşmiyor. Gerçek bir Google girişi burada redirect_uri_mismatch hatasıyla başarısız olurdu.",
          redirectCorrect:"Eklendi — bu URI, uygulamanın gerçek geri çağırma yoluyla eşleşiyor.",
          apiLibraryLabel:"API Kitaplığı",
          apiResultName:"Google People API",
          apiEnableBtn:"Etkinleştir", apiEnabling:"Etkinleştiriliyor…", apiEnabledOk:"Etkinleştirildi.",
          errorConsent:"Hata 403: access_denied — bu uygulamanın OAuth onay ekranı henüz yapılandırılmadı.",
          errorClient:"Hata 401: invalid_client — bu uygulama için henüz bir OAuth 2.0 istemcisi yok.",
          errorRedirect:"Hata 400: redirect_uri_mismatch — istekteki yönlendirme URI'si bu istemci için yetkili hiçbir URI ile eşleşmiyor.",
          errorApi:"Hata 403: access_denied — Google People API bu projede daha önce kullanılmadı veya devre dışı bırakıldı.",
          resetBtn:"Görevi sıfırla",
          completeNote:"Bunlar, Google Cloud Console'da gerçek her \"Google ile giriş yap\" entegrasyonunun gerektirdiği dört gerçek adım — bu görev sadece tıklama ve bekleme kısmını sıkıştırıyor."
        }
      },
      iam:{
        modId:"MODÜL 02", title:"IAM: İzinler ve En Az Ayrıcalık",
        titleAzure:"Microsoft Entra ID: İzinler ve En Az Ayrıcalık", titleGcp:"Cloud IAM: İzinler ve En Az Ayrıcalık",
        dek:"Bir rol kendi başına güvenli ya da güvensiz değildir — sadece üzerine eklenmiş izinler kadar tehlikelidir, ne fazlası ne azı.",
        analogy:"Sadece bir odayı açan bir otel kart anahtarıyla, binadaki her kapıyı açan bir ana anahtar arasındaki fark gibi. İkisi de elinizde aynı görünür. Birini kaybetmenin sonucu, diğerini kaybetmenin sonucuyla hiç aynı değildir.",
        permsLabel:"Bu role eklenmiş izinler",
        permRead:"s3:GetObject — dosya okuma", permWrite:"s3:PutObject — dosya yazma",
        permLaunch:"ec2:RunInstances — sunucu başlatma", permWildcard:"*:* — yönetici erişimi",
        actionsLabel:"Bu rolle bir eylem deneyin",
        actionRead:"Dosya oku", actionWrite:"Dosya yaz", actionLaunch:"Sunucu başlat", actionLeak:"Sızmış bir kimlik bilgisini simüle et (hepsini dene)",
        statGranted:"Verilen izinler", statAllowed:"İzin verilen eylemler", statDenied:"Reddedilen eylemler", statBlast:"Sızarsa etki alanı",
        blastLow:"Düşük", blastHigh:"Yüksek — hesabın tamamına erişim",
        note:"Her IAM politikasının arkasındaki gerçek mekanizma bu: bir kimlik bilginin denediği her eylem, açık bir izin listesiyle karşılaştırılır ve listede olmayan her şey varsayılan olarak reddedilir. \"En az ayrıcalık\" sadece o listenin işin gerektirdiği kadar kısa olması demektir — bir joker karakter (*) bir kolaylık değildir, sızan tek bir anahtarın tüm hesaba her şeyi yapabileceğinin sözüdür.",
        tryStep1:"Sadece \"okuma\"yı işaretli bırakın ve her eylemi deneyin — sadece dosya okuma başarılı olur.",
        tryStep2:"\"Yönetici erişimi\"ni işaretleyin ve \"sızmış bir kimlik bilgisini simüle et\"e tıklayın — her eylemin birden başarılı olduğunu görün.",
        tryStep3:"Joker karakterin işaretini kaldırın, sadece işin gerektirdiğini verin ve etki alanı istatistiğini karşılaştırın.",
        incident:{
          meta:"Uber · Kasım 2016",
          body:"Saldırganlar, Uber mühendislerinin kullandığı özel bir GitHub deposuna gömülmüş AWS kimlik bilgileri buldu. Bu kimlik bilgileri küçük bir göreve özel değildi — 57 milyon yolcu ve sürücünün kişisel bilgilerini tutan bir veri deposuna geniş erişimi vardı. Uber ihlali bir yıldan fazla açıklamadı ve saldırganlara veriyi silmeleri ve sessiz kalmaları için 100.000 dolar ödedi; bu karar ortaya çıktığında FTC soruşturmasına ve eyalet uzlaşmalarına yol açtı. Dar kapsamlı bir kimlik bilgisi, saldırganlara binanın ana anahtarı yerine kilitli tek bir kapı verirdi."
        },
        status:{ leastPriv:"EN AZ AYRICALIK", overPermissioned:"AŞIRI YETKİLİ" },
        log:{
          init:"rol eklendi — hiçbir izin verilmedi",
          allowed:"İZİN VERİLDİ — {action}, eklenmiş politika tarafından izinli",
          denied:"REDDEDİLDİ — {action} eklenmiş politikada yok (varsayılan red)",
          leakStart:"sızmış bir kimlik bilgisi simüle ediliyor — her eylem deneniyor..."
        }
      },
      s3:{
        modId:"MODÜL 05", title:"S3: Nesne Depolama ve Sürümleme",
        titleAzure:"Blob Depolama: Nesne Depolama ve Sürümleme", titleGcp:"Cloud Storage: Nesne Depolama ve Sürümleme",
        dek:"Bir nesne deposu üzerine yazmaz — varsayılan olarak aynı isme yapılan her PUT, öncekinin üzerine oturan yepyeni bir sürümdür.",
        analogy:"Her zaman \"değişiklikleri izle\" açık olan paylaşımlı bir belge gibi: eski taslağın üzerine kaydetmek onu silmez, sadece eski taslağı altına dosyalar ve sizinkini görünen yapar. Biri özellikle belirli bir taslağı imha etmedikçe hiçbir şey gerçekten kaybolmaz.",
        keyLabel:"Nesne anahtarı", keyValue:"fotograflar/aile.jpg",
        uploadBtn:"Yeni sürüm yükle", deleteBtn:"Nesneyi sil", restoreBtn:"Önceki sürümü geri yükle",
        versioningLabel:"Sürümleme etkin",
        blockPublicLabel:"Herkese Açık Erişimi Engelle (varsayılan açık)",
        publicPolicyLabel:"Herkese açık okuma politikası eklendi",
        testPublicBtn:"Anonim bir okuma dene",
        statVersions:"Depolanan sürümler", statState:"Nesne durumu", statPublic:"Herkese açık erişim", statSize:"Yaklaşık kullanılan depolama",
        badgeCurrent:"güncel", badgePrevious:"önceki",
        note:"S3 sürümleme gerçekten böyle çalışır: açık olduğunda, belirli bir sürüm kimliği olmadan yapılan bir DELETE sadece üzerine görünmez bir \"silme işareti\" ekler — nesne silinmiş gibi görünür, ama biri o tam sürüm kimliğini silmedikçe önceki her sürüm hâlâ faturalandırılır ve hâlâ kurtarılabilir. Herkese açık erişim tamamen ayrı bir eksendir: bir şeyin dışarı açılması için hem Herkese Açık Erişimi Engelle hem de kova/nesne politikası aynı fikirde olmalıdır.",
        tryStep1:"Birkaç sürüm yükleyin, nesneyi silin, sonra geri yükleyin — aslında hiçbir şey kaybolmadı.",
        tryStep2:"Sürümlemeyi kapatın, nesneyi silin ve geri yüklemeyi deneyin — bu sefer gerçekten gitti.",
        tryStep3:"Herkese Açık Erişimi Engelle'yi kapatın, herkese açık okuma politikasını ekleyin ve anonim bir okuma deneyin.",
        incident:{
          meta:"Verizon / NICE Systems · Temmuz 2017",
          body:"Açık Amazon S3 kovalarını tarayan bir güvenlik araştırmacısı, Verizon ortağı NICE Systems'ın işlettiği, hiçbir erişim kısıtlaması olmayan bir kova buldu — URL'yi bilen herkes içine göz atabiliyordu. Yaklaşık 14 milyon Verizon müşterisinin arama ve hesap kayıtlarını barındırıyordu. Geleneksel anlamda hiçbir şey hacklenmedi; kovanın izinleri sadece açık bırakılmıştı, ve anonim herhangi bir ziyaretçi onu... okuyabiliyordu. Verizon bildirim aldıktan sonra güvenliğini sağladı, ama veri bundan önce bilinmeyen bir süre boyunca herkese açık erişilebilir durumdaydı."
        },
        status:{ secure:"GÜVENLİ", exposed:"HERKESE AÇIK", available:"MEVCUT", deleted:"SİLİNDİ (kurtarılabilir)", gone:"SİLİNDİ (kurtarılamaz)", empty:"HENÜZ NESNE YOK" },
        log:{
          init:"kova hazır — sürümleme kapalı, herkese açık erişim engelli",
          uploaded:"v{v} yüklendi — {size} — şimdi güncel sürüm",
          deletedMarker:"silme işareti eklendi — nesne gizlendi, {n} sürüm hâlâ depolanıyor",
          deletedHard:"nesne kalıcı olarak silindi — sürümleme kapalıydı, kurtaracak bir şey yok",
          restored:"silme işareti kaldırıldı — v{v} yeniden güncel sürüm",
          restoreNoop:"nesne silinmiş değil — geri yüklenecek bir şey yok",
          publicBlocked:"anonim GET → 403 Forbidden — Herkese Açık Erişimi Engelle açık",
          publicNoPolicy:"anonim GET → 403 Forbidden — herkese açık okuma politikası eklenmemiş",
          publicExposed:"anonim GET → 200 OK — nesne içeriği kimliği doğrulanmamış bir çağırana döndürüldü"
        }
      },
      lambda:{
        modId:"MODÜL 06", title:"Lambda: Sunucusuz ve Soğuk Başlangıçlar",
        titleAzure:"Azure Functions: Sunucusuz ve Soğuk Başlangıçlar", titleGcp:"Cloud Functions: Sunucusuz ve Soğuk Başlangıçlar",
        dek:"İsteği bekleyen duran bir sunucu yoktur — bir çalıştırma ortamı istek geldiği an inşa edilir, ve o inşa süresi, boştayken hiçbir şey kiralamamanın bedelidir.",
        analogy:"Günün ilk müşterisi geldiği an kendini kuran açılır bir kahve standı gibi: o ilk kişi stant kurulurken bekler, ama hemen arkasındaki herkes anında hizmet alır, çünkü stant artık ayakta. Çok uzun süre yalnız bırakılırsa kendini yeniden toplar.",
        invokeBtn:"Bir kez çağır", burstLabel:"Gönderilecek eşzamanlı istek —", burstBtn:"Patlama gönder",
        idleBtn:"Havuzun boşa düşmesine izin ver",
        statInvocations:"Toplam çağrı", statCold:"Soğuk başlangıçlar", statWarm:"Sıcak başlangıçlar", statAvgLatency:"Ortalama gecikme", statCost:"Biriken maliyet",
        badgeWarm:"sıcak",
        note:"Lambda gerçekten böyle çalışır: AWS her fonksiyon için bir \"sıcak\" çalıştırma ortamı havuzu tutar ve boşta-ama-canlı bir ortam varken bir istek gelirse onu anında yeniden kullanır. Her ortam meşgulse ya da havuz hareketsizlikten kapanmışsa, önce yepyeni bir tane hazırlanmalıdır — \"soğuk başlangıç\" — bu yüzden sessiz bir dönemden sonra gelen eşzamanlı trafik patlaması, yavaş bir ilk isteğin en yaygın tek sebebidir.",
        tryStep1:"Bir kez çağırın — boş bir havuzla bu bir soğuk başlangıçtır.",
        tryStep2:"Hemen bir kez daha çağırın — aynı ortam hâlâ sıcak, bu yüzden hızlı.",
        tryStep3:"Havuzun boşa düşmesine izin verin, sonra 20 eşzamanlı istekten oluşan bir patlama gönderin ve kaç tanesinin soğuk başlamak zorunda kaldığını izleyin.",
        incident:{
          meta:"AWS US-EAST-1 · 7 Aralık 2021",
          body:"AWS'nin dahili bir ağının kapasitesini ölçeklemek için tasarlanmış otomatik bir süreç, o ağda beklenmeyen bir davranış tetikledi; ağın cihazlarını doyurdu ve diğer dahili AWS servisleri arasındaki iletişimi bozdu. Lambda'nın kendi çağrı oranı saatlerce keskin biçimde düştü, yeni EC2 örnekleri başlatma hataları ve o dahili ağa bağımlı birkaç başka serviste hatalarla birlikte — \"sunucusuz\"un hâlâ birinin işlettiği fiziksel altyapı üzerinde çalıştığının, ve o altyapının da kötü bir gün geçirebileceğinin bir hatırlatması."
        },
        status:{ warmPool:"HAVUZ SICAK VE HAZIR", cold:"HAVUZ SOĞUK" },
        log:{
          init:"havuz boş — sıradaki çağrı soğuk başlayacak",
          cold:"soğuk başlangıç — yeni bir çalıştırma ortamı hazırlandı ({ms}ms)",
          warm:"sıcak başlangıç — boştaki bir ortam yeniden kullanıldı ({ms}ms)",
          burst:"{n} isteklik patlama — {cold} soğuk, {warm} sıcak",
          idled:"hareketsizlik sonrası havuz geri toplandı — {n} ortam kapatıldı"
        }
      },
      cloudwatch:{
        modId:"MODÜL 14", title:"CloudWatch: İzleme ve Alarmlar",
        titleAzure:"Azure Monitor: İzleme ve Alarmlar", titleGcp:"Cloud Monitoring: İzleme ve Alarmlar",
        dek:"Bir alarm, bir metrik sınırı geçtiği an ötmez — bu ihlalin tekrar etmesini bekler, böylece tek bir gürültülü sıçrama gece 3'te kimseyi çağırmaz.",
        analogy:"Kısa bir gecikmesi olan, tetiği hassas olmayan bir duman dedektörü gibi: sıcak bir duştan çıkan birkaç saniyelik buhar onu çalıştırmamalı, ama artmaya devam eden duman gerçekten çalıştırmalı. Onu gerçekten güvenip eyleme geçirilebilir kılan da bu gecikmedir.",
        metricLabel:"Simüle edilen CPU metriği —", thresholdLabel:"Alarm eşiği —",
        spikeBtn:"Metriği sıçrat", silentLabel:"Metrik ajanı veri göndermeyi durdurdu",
        statLatest:"Son veri noktası", statStreak:"Ardışık ihlal", statAlarm:"Alarm durumu", statThreshold:"Alarm eşiği",
        note:"Bu, gerçek CloudWatch alarmlarına oldukça yakın: durum değiştirmeden önce yapılandırılabilir sayıda ardışık dönem (burada üç) değerlendirirler, özellikle tek bir gürültülü veri noktasında çırpınmayı önlemek için. Ve bir ajan veri göndermeyi durdurduğunda, gerçek bir alarm sessizce \"TAMAM\" varsaymaz — eksik veriyi kendi ayrı durumu olarak ele alacak şekilde yapılandırılabilir, çünkü sessizlik sağlıkla aynı şey değildir.",
        tryStep1:"Metriğin eşiğin altında durduğunu izleyin — alarm TAMAM kalır.",
        tryStep2:"\"Metriği sıçrat\"a tıklayın ve ALARM ötmeden önce kaç ardışık ihlal gerektiğini sayın.",
        tryStep3:"\"Metrik ajanı veri göndermeyi durdurdu\"yu işaretleyin ve durumun TAMAM kalmak yerine YETERSİZ VERİ'ye gittiğini izleyin.",
        incident:{
          meta:"AWS S3 US-EAST-1 · 28 Şubat 2017",
          body:"Rutin bir hata ayıklama sırasında, yetkili bir mühendis S3'ün bir alt sisteminden az sayıda sunucuyu kaldırmayı amaçlayan bir komut çalıştırdı — komutun girdisindeki bir yazım hatası amaçlanandan çok daha fazla kapasiteyi kaldırdı ve US-EAST-1'deki S3'ün büyük bir kısmını saatlerce çevrimdışı bıraktı, buna bağımlı interneti büyük ölçüde aksattı. Bunu bir izleme dersine dönüştüren detay şu: AWS'nin kendi herkese açık Servis Sağlığı Panosu, kesintiyi göstermek için güncellenemedi — çünkü panonun kendisinin dayandığı simgeler ve görseller, tam da o an çöken S3 sunucularında barındırılıyordu."
        },
        status:{ ok:"TAMAM", alarm:"ALARM", insufficient:"YETERSİZ VERİ" },
        log:{
          init:"alarm oluşturuldu — durum TAMAM, eşik %{threshold}",
          datapointOk:"veri noktası %{value} — eşiğin altında (%{threshold})",
          datapointBreach:"veri noktası %{value} — ihlal {streak}/3",
          alarmFired:"ALARM — %{threshold} eşiğini aşan 3 ardışık ihlal — SNS'i bilgilendirir / otomatik ölçeklemeyi tetikler",
          alarmCleared:"durum → TAMAM — veri noktası yeniden eşiğin altında",
          noData:"veri noktası alınamadı — {n}/3 kaçırılan dönem",
          insufficientFired:"durum → YETERSİZ VERİ — ajan çok uzun süredir sessiz",
          spiked:"metrik sıçraması tetiklendi"
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

  const LANG_KEY="csc-lang", THEME_KEY="csc-theme", PROVIDER_KEY="csc-provider";
  let currentLang = localStorage.getItem(LANG_KEY) || (((navigator.language||"").toLowerCase().indexOf("tr")===0) ? "tr" : "en");
  let themeMode = localStorage.getItem(THEME_KEY) || "auto";
  let providerMode = localStorage.getItem(PROVIDER_KEY) || "aws";
  const PROVIDER_MODULES=["auth","iam","vpc","ec2","s3","lambda","lb","beanstalk","route53","cache","consistency","failover","sns","cloudwatch","snowball"];
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

  /* ============ jump nav: smooth scroll to module ============ */
  document.querySelectorAll(".jumpnav a").forEach(function(link){
    link.addEventListener("click", function(e){
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if(!target) return;
      e.preventDefault();
      const topbarH = $(".topbar").getBoundingClientRect().height;
      const top = target.getBoundingClientRect().top + window.pageYOffset - topbarH - 12;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
      history.pushState(null, "", "#"+id);
    });
  });

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

  /* ============ MODULE 05 — VPC ============ */
  let vpcAllowed=0, vpcBlocked=0, vpcPrivateHits=0;
  function vpcOpenPortsCount(){
    let n=0;
    if($("#vpcRule80").checked) n++;
    if($("#vpcRule22").checked) n++;
    return n;
  }
  function vpcFlash(el, ok){
    el.classList.remove("hit","blocked");
    void el.offsetWidth;
    el.classList.add(ok?"hit":"blocked");
    setTimeout(function(){ el.classList.remove("hit","blocked"); }, 500);
  }
  function vpcUpdateStats(){
    $("#vpcAllowed").textContent=vpcAllowed;
    $("#vpcBlocked").textContent=vpcBlocked;
    $("#vpcOpenPorts").textContent=vpcOpenPortsCount();
    $("#vpcPrivateHits").textContent=vpcPrivateHits;
    let key="locked", cls="good";
    if($("#vpcRule22").checked){ key="exposed"; cls="bad"; }
    else if($("#vpcRule80").checked){ key="secure"; cls="good"; }
    setStatus($("#vpcStatus"), $("#vpcLog"), key, "vpc.status", cls);
  }
  $("#vpcSend").addEventListener("click", function(){
    const target=$("#vpcTarget").value;
    if(target==="db"){
      vpcBlocked++; vpcPrivateHits++;
      addLog($("#vpcLog"), t("vpc.log.blockedPrivate",{target:"DB-1"}), "bad");
      vpcFlash($("#vpcDb"), false);
    } else {
      const port = target==="web80" ? 80 : 22;
      const allowed = target==="web80" ? $("#vpcRule80").checked : $("#vpcRule22").checked;
      if(allowed){
        vpcAllowed++;
        addLog($("#vpcLog"), t("vpc.log.allowedPublic",{target:"WEB-1",port:port}), "good");
        vpcFlash($("#vpcWeb"), true);
      } else {
        vpcBlocked++;
        addLog($("#vpcLog"), t("vpc.log.blockedSg",{target:"WEB-1",port:port}), "warn");
        vpcFlash($("#vpcWeb"), false);
      }
    }
    vpcUpdateStats();
  });
  $("#vpcRule80").addEventListener("change", vpcUpdateStats);
  $("#vpcRule22").addEventListener("change", vpcUpdateStats);
  addLog($("#vpcLog"), t("vpc.log.init"));
  vpcUpdateStats();

  /* ============ MODULE 06 — EC2 ============ */
  const EC2_SIZES={ micro:{vcpu:1,costPerSec:0.002}, medium:{vcpu:2,costPerSec:0.008}, xlarge:{vcpu:4,costPerSec:0.03} };
  let ec2Instances=[];
  let ec2NextId=1;
  let ec2TotalCost=0;
  function ec2SizeLabel(size){ return t("ec2.size"+size.charAt(0).toUpperCase()+size.slice(1)); }
  function ec2Render(){
    const pool=$("#ec2Instances");
    ec2Instances.forEach(function(inst){
      let el=document.getElementById("ec2-"+inst.id);
      if(!el){
        el=document.createElement("div");
        el.className="ec2-card";
        el.id="ec2-"+inst.id;
        el.innerHTML=
          '<div class="id"><span>i-'+inst.id+'</span><span class="state"></span></div>'+
          '<div class="size"></div>'+
          '<div class="bar"><span></span></div>'+
          '<div class="cost"></div>'+
          '<div class="btnrow"><button type="button" class="btn" data-act="stop"></button><button type="button" class="btn" data-act="terminate"></button></div>';
        pool.appendChild(el);
      }
      el.className="ec2-card"+(inst.state==="pending"?" pending":"")+(inst.state==="stopped"?" stopped":"");
      el.querySelector(".state").textContent=inst.state.toUpperCase();
      el.querySelector(".size").textContent=ec2SizeLabel(inst.size);
      const load = inst.state==="running" ? Number($("#ec2Load").value) : 0;
      const barSpan=el.querySelector(".bar > span");
      barSpan.style.width=load+"%";
      barSpan.style.background = load>80 ? "var(--bad)" : load>50 ? "var(--warn)" : "var(--accent)";
      el.querySelector(".cost").textContent="$"+inst.cost.toFixed(3);
      const stopBtn=el.querySelector('[data-act="stop"]');
      stopBtn.disabled = inst.state!=="running";
      stopBtn.textContent=t("ec2.stopBtn");
      el.querySelector('[data-act="terminate"]').textContent=t("ec2.terminateBtn");
    });
    [...pool.children].forEach(function(el){
      const id=Number(el.id.replace("ec2-",""));
      if(!ec2Instances.find(function(i){ return i.id===id; })) el.remove();
    });
  }
  function ec2UpdateStats(){
    const running=ec2Instances.filter(function(i){ return i.state==="running"; });
    $("#ec2Running").textContent=running.length;
    $("#ec2Cost").textContent="$"+ec2TotalCost.toFixed(3);
    $("#ec2Vcpu").textContent=running.reduce(function(a,i){ return a+EC2_SIZES[i.size].vcpu; },0);
    const load=Number($("#ec2Load").value);
    const idle = running.length>0 && load<10 ? running.length : 0;
    $("#ec2Idle").textContent=idle;
    let key="right", cls="good";
    if(running.length>0 && load<10){ key="idle"; cls="warn"; }
    else if(running.filter(function(i){return i.size==="xlarge";}).length>=2 && load<30){ key="over"; cls="warn"; }
    setStatus($("#ec2Status"), $("#ec2Log"), key, "ec2.status", cls);
  }
  $("#ec2Launch").addEventListener("click", function(){
    const size=$("#ec2Size").value;
    const inst={ id:ec2NextId++, size:size, state:"pending", cost:0 };
    ec2Instances.push(inst);
    ec2Render();
    addLog($("#ec2Log"), t("ec2.log.launched",{id:"i-"+inst.id,size:ec2SizeLabel(size)}), "good");
    setTimeout(function(){
      if(!ec2Instances.includes(inst)) return;
      inst.state="running";
      addLog($("#ec2Log"), t("ec2.log.running",{id:"i-"+inst.id}));
      ec2Render(); ec2UpdateStats();
    }, 700);
    ec2UpdateStats();
  });
  $("#ec2Instances").addEventListener("click", function(e){
    const btn=e.target.closest("button[data-act]");
    if(!btn) return;
    const card=e.target.closest(".ec2-card");
    const id=Number(card.id.replace("ec2-",""));
    const inst=ec2Instances.find(function(i){ return i.id===id; });
    if(!inst) return;
    if(btn.dataset.act==="stop" && inst.state==="running"){
      inst.state="stopped";
      addLog($("#ec2Log"), t("ec2.log.stopped",{id:"i-"+inst.id}), "warn");
    } else if(btn.dataset.act==="terminate"){
      ec2Instances=ec2Instances.filter(function(i){ return i!==inst; });
      addLog($("#ec2Log"), t("ec2.log.terminated",{id:"i-"+inst.id}), "warn");
    }
    ec2Render(); ec2UpdateStats();
  });
  $("#ec2Load").addEventListener("input", function(){ $("#ec2LoadOut").textContent=$("#ec2Load").value; ec2Render(); ec2UpdateStats(); });
  setInterval(function(){
    let changed=false;
    ec2Instances.forEach(function(inst){
      if(inst.state==="running"){
        inst.cost += EC2_SIZES[inst.size].costPerSec*0.5;
        ec2TotalCost += EC2_SIZES[inst.size].costPerSec*0.5;
        changed=true;
      }
    });
    if(changed){ ec2Render(); ec2UpdateStats(); }
  }, 500);
  addLog($("#ec2Log"), t("ec2.log.init"));
  ec2UpdateStats();

  /* ============ MODULE 07 — ELASTIC BEANSTALK ============ */
  let beanstalkVersion=1;
  let beanstalkDeploys=0, beanstalkRollbacks=0;
  let beanstalkHealthKey="ok";
  const beanstalkServerIds=[1,2,3];
  function beanstalkRenderServers(){
    const pool=$("#beanstalkServers");
    pool.innerHTML="";
    beanstalkServerIds.forEach(function(id){
      const el=document.createElement("div");
      el.className="server-card";
      el.id="bs-srv-"+id;
      el.innerHTML='<div class="id"><span>SRV-'+id+'</span></div><div class="bar"><span style="width:100%;background:var(--accent);"></span></div>';
      pool.appendChild(el);
    });
  }
  function beanstalkFlashServers(cls){
    beanstalkServerIds.forEach(function(id){
      const el=document.getElementById("bs-srv-"+id);
      if(!el) return;
      el.classList.add(cls);
      setTimeout(function(){ el.classList.remove(cls); }, 600);
    });
  }
  function beanstalkUpdateStats(){
    $("#beanstalkVersionOut").textContent="v1."+(beanstalkVersion-1);
    $("#beanstalkDeploys").textContent=beanstalkDeploys;
    $("#beanstalkRollbacks").textContent=beanstalkRollbacks;
    $("#beanstalkHealth").textContent=t("beanstalk.status."+beanstalkHealthKey);
  }
  $("#beanstalkDeploy").addEventListener("click", function(){
    const epoch=stateEpoch;
    const newVersion=beanstalkVersion+1;
    const bug=$("#beanstalkBug").checked;
    addLog($("#beanstalkLog"), t("beanstalk.log.uploading"));
    setTimeout(function(){ if(epoch===stateEpoch) addLog($("#beanstalkLog"), t("beanstalk.log.provisioning")); }, 400);
    setTimeout(function(){ if(epoch===stateEpoch) addLog($("#beanstalkLog"), t("beanstalk.log.healthCheck")); }, 900);
    setTimeout(function(){
      if(epoch!==stateEpoch) return;
      beanstalkDeploys++;
      if(bug){
        addLog($("#beanstalkLog"), t("beanstalk.log.failure",{version:"1."+(newVersion-1)}), "bad");
        beanstalkHealthKey="severe";
        setStatus($("#beanstalkStatus"), $("#beanstalkLog"), "severe", "beanstalk.status", "bad");
        beanstalkFlashServers("hit");
        beanstalkUpdateStats();
        setTimeout(function(){
          if(epoch!==stateEpoch) return;
          beanstalkRollbacks++;
          addLog($("#beanstalkLog"), t("beanstalk.log.rollback",{version:"1."+(beanstalkVersion-1)}), "warn");
          beanstalkHealthKey="ok";
          setStatus($("#beanstalkStatus"), $("#beanstalkLog"), "ok", "beanstalk.status", "good");
          beanstalkUpdateStats();
        }, 1000);
      } else {
        beanstalkVersion=newVersion;
        addLog($("#beanstalkLog"), t("beanstalk.log.success",{version:"1."+(beanstalkVersion-1)}), "good");
        beanstalkHealthKey="ok";
        setStatus($("#beanstalkStatus"), $("#beanstalkLog"), "ok", "beanstalk.status", "good");
        beanstalkFlashServers("hit");
        beanstalkUpdateStats();
      }
    }, 1500);
  });
  beanstalkRenderServers();
  addLog($("#beanstalkLog"), t("beanstalk.log.init"));
  beanstalkUpdateStats();

  /* ============ MODULE 08 — ROUTE 53 ============ */
  const r53Regions=[
    {code:"EU", latency:80, healthy:true},
    {code:"US", latency:40, healthy:true},
    {code:"APAC", latency:120, healthy:true}
  ];
  let r53Queries=0;
  const r53Weights=[20,70,10];
  function r53RegionName(idx){ return idx===0?t("route53.regionEU"):idx===1?t("route53.regionUS"):t("route53.regionAPAC"); }
  function r53RenderRegions(){
    r53Regions.forEach(function(r,i){
      const info=document.getElementById("r53-"+i+"-info");
      if(!r.healthy){ info.textContent="DOWN"; return; }
      const jitter=Math.round(r.latency+(Math.random()*10-5));
      info.textContent=jitter+"ms";
    });
  }
  function r53Pick(policy){
    if(policy==="simple") return 1;
    if(policy==="weighted"){
      const roll=Math.random()*100;
      if(roll<r53Weights[0]) return 0;
      if(roll<r53Weights[0]+r53Weights[1]) return 1;
      return 2;
    }
    if(policy==="latency"){
      let best=0;
      r53Regions.forEach(function(r,i){ if(r.latency<r53Regions[best].latency) best=i; });
      return best;
    }
    return $("#r53PrimaryDown").checked ? 1 : 0;
  }
  $("#r53Resolve").addEventListener("click", function(){
    const policy=$("#r53Policy").value;
    const idx=r53Pick(policy);
    r53Queries++;
    const reason = policy==="simple" ? t("route53.reasonSimple")
      : policy==="weighted" ? t("route53.reasonWeighted")
      : policy==="latency" ? t("route53.reasonLatency")
      : ($("#r53PrimaryDown").checked ? t("route53.reasonFailoverDown") : t("route53.reasonFailoverUp"));
    addLog($("#r53Log"), t("route53.log.resolved",{region:r53RegionName(idx),reason:reason}));
    $("#r53Last").textContent=r53RegionName(idx);
    $("#r53Queries").textContent=r53Queries;
    r53RenderRegions();
  });
  $("#r53Policy").addEventListener("change", function(){
    const opt=$("#r53Policy").selectedOptions[0];
    $("#r53PolicyOut").textContent=opt.textContent;
  });
  $("#r53PrimaryDown").addEventListener("change", function(e){
    r53Regions[0].healthy=!e.target.checked;
    $("#r53PrimaryHealth").textContent = e.target.checked ? t("route53.status.failoverActive") : t("route53.status.healthy");
    addLog($("#r53Log"), e.target.checked ? t("route53.log.primaryDown") : t("route53.log.primaryUp"), e.target.checked?"bad":"good");
    setStatus($("#route53Status"), $("#r53Log"), e.target.checked?"failoverActive":"healthy", "route53.status", e.target.checked?"warn":"good");
    r53RenderRegions();
  });
  r53RenderRegions();
  addLog($("#r53Log"), t("route53.log.init"));
  $("#r53PrimaryHealth").textContent=t("route53.status.healthy");
  $("#r53PolicyOut").textContent=$("#r53Policy").selectedOptions[0].textContent;

  /* ============ MODULE 09 — SNS ============ */
  let snsPublished=0, snsDelivered=0, snsFailedCount=0;
  function snsSubKey(id){ return id==="snsSubEmail"?"email":id==="snsSubSms"?"sms":"queue"; }
  function snsSubLabel(key){ return key==="email"?t("sns.subEmail"):key==="sms"?t("sns.subSms"):t("sns.subQueue"); }
  function snsFlashSub(key, ok){
    const el=document.getElementById("sub-"+key);
    el.classList.remove("hit","fail");
    void el.offsetWidth;
    el.classList.add(ok?"hit":"fail");
    setTimeout(function(){ el.classList.remove("hit","fail"); }, 600);
  }
  function snsUpdateStats(){
    $("#snsPublished").textContent=snsPublished;
    $("#snsDelivered").textContent=snsDelivered;
    $("#snsFailed").textContent=snsFailedCount;
    const activeSubs=["snsSubEmail","snsSubSms","snsSubQueue"].filter(function(id){ return $("#"+id).checked; }).length;
    $("#snsSubs").textContent=activeSubs;
    let key="fanning", cls="good";
    if(snsFailedCount>=3){ key="dlq"; cls="bad"; }
    else if($("#snsFail").checked){ key="degraded"; cls="warn"; }
    setStatus($("#snsStatus"), $("#snsLog"), key, "sns.status", cls);
  }
  function snsDeliverTo(subKey, attempt){
    const epoch=stateEpoch;
    attempt=attempt||1;
    const willFail = $("#snsFail").checked && subKey==="email" && Math.random()<0.5 && attempt<=3;
    if(willFail && attempt<3){
      snsFailedCount++;
      addLog($("#snsLog"), t("sns.log.retry",{sub:snsSubLabel(subKey),n:attempt}), "warn");
      snsFlashSub(subKey, false);
      setTimeout(function(){ if(epoch===stateEpoch) snsDeliverTo(subKey, attempt+1); }, 500);
    } else if(willFail && attempt>=3){
      snsFailedCount++;
      addLog($("#snsLog"), t("sns.log.deadLetter",{sub:snsSubLabel(subKey)}), "bad");
      snsFlashSub(subKey, false);
    } else {
      snsDelivered++;
      addLog($("#snsLog"), t("sns.log.delivered",{sub:snsSubLabel(subKey)}), "good");
      snsFlashSub(subKey, true);
    }
    snsUpdateStats();
  }
  $("#snsPublish").addEventListener("click", function(){
    snsPublished++;
    addLog($("#snsLog"), t("sns.log.published"));
    ["snsSubEmail","snsSubSms","snsSubQueue"].forEach(function(id){
      if($("#"+id).checked) snsDeliverTo(snsSubKey(id));
    });
    snsUpdateStats();
  });
  ["snsSubEmail","snsSubSms","snsSubQueue"].forEach(function(id){ $("#"+id).addEventListener("change", snsUpdateStats); });
  addLog($("#snsLog"), t("sns.log.init"));
  snsUpdateStats();

  /* ============ MODULE 10 — SNOWBALL EDGE ============ */
  const SNOWBALL_DEVICE_TB=80;
  const SNOWBALL_SHIP_DAYS=7;
  const SNOWBALL_LOCAL_GBPS=10;
  function snowballFormatDuration(seconds){
    const locale = currentLang==="tr" ? "tr-TR" : "en-US";
    if(seconds<60) return Math.round(seconds)+t("snowball.unitSeconds");
    const minutes=seconds/60;
    if(minutes<60) return Math.round(minutes)+t("snowball.unitMinutes");
    const hours=minutes/60;
    if(hours<48) return hours.toFixed(1)+t("snowball.unitHours");
    const days=hours/24;
    return days.toLocaleString(locale,{minimumFractionDigits:1,maximumFractionDigits:1})+t("snowball.unitDays");
  }
  function snowballCompute(){
    const sizeTB=Number($("#snowballSize").value);
    const bwMbps=Number($("#snowballBw").value);
    $("#snowballSizeOut").textContent=sizeTB;
    $("#snowballBwOut").textContent=bwMbps;

    const sizeBits=sizeTB*1e12*8;
    const netSeconds=sizeBits/(bwMbps*1e6);
    const devices=Math.max(1, Math.ceil(sizeTB/SNOWBALL_DEVICE_TB));
    const localCopySeconds=sizeBits/(SNOWBALL_LOCAL_GBPS*1e9);
    const snowballSeconds=(SNOWBALL_SHIP_DAYS*2*86400)+localCopySeconds;

    $("#snowballNetTime").textContent=snowballFormatDuration(netSeconds);
    $("#snowballDeviceTime").textContent=snowballFormatDuration(snowballSeconds);
    $("#snowballStatNet").textContent=snowballFormatDuration(netSeconds);
    $("#snowballStatDevice").textContent=snowballFormatDuration(snowballSeconds);
    $("#snowballStatDevices").textContent=devices;

    const netWins=netSeconds<=snowballSeconds;
    $("#snowballStatWinner").textContent = netWins ? t("snowball.status.networkWins") : t("snowball.status.snowballWins");
    $("#snowballNetRow").classList.toggle("winner", netWins);
    $("#snowballDeviceRow").classList.toggle("winner", !netWins);
    setStatus($("#snowballStatus"), null, netWins?"networkWins":"snowballWins", "snowball.status", "good");
  }
  $("#snowballSize").addEventListener("input", snowballCompute);
  $("#snowballBw").addEventListener("input", snowballCompute);
  snowballCompute();

  /* ============ MODULE 11 — AUTH ============ */
  let authFlow="google";
  let authStepIndex=0;
  let authRunning=false;
  let authSignedIn=false;
  let authRunEpoch=0;
  function authStepsFor(flow){
    if(flow==="google") return ["step1","step2","step3","step4","step5"].map(function(k){ return t("auth.google."+k); });
    if(flow==="email") return ["step1","step2","step3","step4"].map(function(k){ return t("auth.email."+k); });
    return ["step1","step2","step3","step4"].map(function(k){ return t("auth.phone."+k); });
  }
  function authFlowLabel(flow){ return flow==="google"?t("auth.flowGoogle"):flow==="email"?t("auth.flowEmail"):t("auth.flowPhone"); }
  function authRenderSteps(){
    const steps=authStepsFor(authFlow);
    const ol=$("#authSteps");
    ol.innerHTML="";
    steps.forEach(function(text,i){
      const li=document.createElement("li");
      if(i<authStepIndex) li.className="done";
      else if(i===authStepIndex && authRunning) li.className="active";
      li.innerHTML='<span class="num">'+(i+1)+'</span><span>'+text+'</span>';
      ol.appendChild(li);
    });
  }
  function authUpdateStats(){
    $("#authFlowOut").textContent=authFlowLabel(authFlow);
    $("#authStepOut").textContent=authStepIndex;
    $("#authSeenOut").textContent="0";
    $("#authStateOut").textContent = authSignedIn ? t("auth.status.signedIn") : (authRunning ? t("auth.status.inProgress") : t("auth.status.signedOut"));
    const key = authSignedIn ? "signedIn" : (authRunning ? "inProgress" : "signedOut");
    setStatus($("#authStatus"), $("#authLog"), key, "auth.status", authRunning?"warn":"good");
  }
  function authRunStep(myEpoch){
    if(myEpoch!==authRunEpoch) return;
    const steps=authStepsFor(authFlow);
    if(authStepIndex>=steps.length){
      authRunning=false; authSignedIn=true;
      addLog($("#authLog"), t("auth.log.complete"), "good");
      authRenderSteps(); authUpdateStats();
      return;
    }
    addLog($("#authLog"), steps[authStepIndex]);
    authStepIndex++;
    authRenderSteps(); authUpdateStats();
    setTimeout(function(){ authRunStep(myEpoch); }, 750);
  }
  function authSelectFlow(flow){
    authRunEpoch++;
    authFlow=flow; authStepIndex=0; authRunning=false; authSignedIn=false;
    ["authTabGoogle","authTabEmail","authTabPhone"].forEach(function(id){
      $("#"+id).classList.toggle("active", $("#"+id).dataset.flow===flow);
    });
    authRenderSteps(); authUpdateStats();
  }
  $("#authStart").addEventListener("click", function(){
    if(authRunning) return;
    authRunEpoch++;
    const myEpoch=authRunEpoch;
    authStepIndex=0; authSignedIn=false; authRunning=true;
    addLog($("#authLog"), t("auth.log.started",{flow:authFlowLabel(authFlow)}));
    authRenderSteps(); authUpdateStats();
    setTimeout(function(){ authRunStep(myEpoch); }, 500);
  });
  $("#authReset").addEventListener("click", function(){
    authRunEpoch++;
    authStepIndex=0; authRunning=false; authSignedIn=false;
    addLog($("#authLog"), t("auth.log.reset"), "warn");
    authRenderSteps(); authUpdateStats();
  });
  $("#authTabs").addEventListener("click", function(e){
    const btn=e.target.closest(".auth-tab");
    if(!btn || authRunning) return;
    authSelectFlow(btn.dataset.flow);
  });
  authRenderSteps();
  addLog($("#authLog"), t("auth.log.init"));
  authUpdateStats();

  /* ============ MODULE 01 QUEST — fix the broken sign-in ============ */
  const QUEST_CLIENT_ID_FAKE="847293651042-k3j8s0d9f2h1a0b9c8d7e6f5g4h3.apps.googleusercontent.com";
  let questSteps={ consent:false, clientid:false, redirect:false, api:false };
  let questLastResultKey=null; // null | "consent" | "clientid" | "redirect" | "api" | "success"
  // per-panel last feedback, so language switches can re-render without re-deriving state:
  // consent/redirect: null | "ok" | "bad" — clientid: null | "ok" | "desktop" | "android" | "ios" — api: null | "enabling" | "ok"
  let questLastFeedback={ consent:null, clientid:null, redirect:null, api:null };

  function questAllDone(){
    return questSteps.consent && questSteps.clientid && questSteps.redirect && questSteps.api;
  }
  function questUpdateConsoleDot(){
    $("#questConsoleDot").classList.toggle("ok", questAllDone());
  }
  function questMarkDone(stepEl, stepKey){
    questSteps[stepKey]=true;
    stepEl.classList.add("done");
    questUpdateConsoleDot();
  }
  function questToggleOptions(id, done){
    if(done) return;
    const el=$("#"+id);
    el.hidden=!el.hidden;
  }
  function questClientTypeLabel(key){
    return t("auth.quest.clientType"+key.charAt(0).toUpperCase()+key.slice(1));
  }
  function questResultTextFor(key){
    if(key==="success") return t("auth.quest.resultSuccess");
    const errKey={ consent:"errorConsent", clientid:"errorClient", redirect:"errorRedirect", api:"errorApi" }[key];
    return t("auth.quest."+errKey);
  }

  $("#questConsentToggle").addEventListener("click", function(){
    questToggleOptions("questConsentOptions", questSteps.consent);
  });
  document.querySelectorAll("#questConsentOptions .quest-option-btn").forEach(function(btn){
    btn.addEventListener("click", function(){
      const fb=$("#questConsentFeedback");
      if(btn.dataset.consent==="external"){
        questLastFeedback.consent="ok";
        fb.textContent=t("auth.quest.consentExternalOk"); fb.className="quest-options-feedback good";
        questMarkDone($("#questStepConsent"), "consent");
        $("#questConsentOptions").hidden=true;
      } else {
        questLastFeedback.consent="bad";
        fb.textContent=t("auth.quest.consentInternalError"); fb.className="quest-options-feedback bad";
      }
    });
  });

  $("#questClientToggle").addEventListener("click", function(){
    questToggleOptions("questClientOptions", questSteps.clientid);
  });
  document.querySelectorAll("#questClientOptions .quest-option-btn").forEach(function(btn){
    btn.addEventListener("click", function(){
      const fb=$("#questClientFeedback");
      if(btn.dataset.client==="web"){
        questLastFeedback.clientid="ok";
        fb.textContent=t("auth.quest.clientTypeOk",{clientId:QUEST_CLIENT_ID_FAKE}); fb.className="quest-options-feedback good";
        questMarkDone($("#questStepClientid"), "clientid");
        $("#questClientOptions").hidden=true;
      } else {
        questLastFeedback.clientid=btn.dataset.client;
        fb.textContent=t("auth.quest.clientTypeWrongError",{type:questClientTypeLabel(btn.dataset.client)}); fb.className="quest-options-feedback bad";
      }
    });
  });

  $("#questRedirectToggle").addEventListener("click", function(){
    questToggleOptions("questRedirectOptions", questSteps.redirect);
  });
  document.querySelectorAll("#questRedirectOptions .quest-option-btn").forEach(function(btn){
    btn.addEventListener("click", function(){
      const fb=$("#questRedirectFeedback");
      if(btn.dataset.redirect==="correct"){
        questLastFeedback.redirect="ok";
        fb.textContent=t("auth.quest.redirectCorrect"); fb.className="quest-options-feedback good";
        questMarkDone($("#questStepRedirect"), "redirect");
        $("#questRedirectOptions").hidden=true;
      } else {
        questLastFeedback.redirect="bad";
        fb.textContent=t("auth.quest.redirectWrong"); fb.className="quest-options-feedback bad";
      }
    });
  });

  $("#questApiToggle").addEventListener("click", function(){
    questToggleOptions("questApiOptions", questSteps.api);
  });
  $("#questApiEnableBtn").addEventListener("click", function(){
    if(questSteps.api) return;
    const btn=$("#questApiEnableBtn");
    const fb=$("#questApiFeedback");
    btn.disabled=true;
    questLastFeedback.api="enabling";
    fb.textContent=t("auth.quest.apiEnabling"); fb.className="quest-options-feedback";
    setTimeout(function(){
      questLastFeedback.api="ok";
      fb.textContent=t("auth.quest.apiEnabledOk"); fb.className="quest-options-feedback good";
      questMarkDone($("#questStepApi"), "api");
      $("#questApiOptions").hidden=true;
      btn.disabled=false;
    }, 700);
  });

  $("#questTrySignIn").addEventListener("click", function(){
    const result=$("#questResult");
    result.hidden=false;
    let missingKey=null;
    if(!questSteps.consent) missingKey="consent";
    else if(!questSteps.clientid) missingKey="clientid";
    else if(!questSteps.redirect) missingKey="redirect";
    else if(!questSteps.api) missingKey="api";
    questLastResultKey = missingKey || "success";
    result.textContent=questResultTextFor(questLastResultKey);
    if(missingKey){
      result.className="quest-result bad";
    } else {
      result.className="quest-result good";
      $("#questCompleteNote").hidden=false;
    }
  });

  function questReset(){
    questSteps={ consent:false, clientid:false, redirect:false, api:false };
    questLastResultKey=null;
    questLastFeedback={ consent:null, clientid:null, redirect:null, api:null };
    document.querySelectorAll("#questSteps .quest-step").forEach(function(li){ li.classList.remove("done"); });
    ["questConsentOptions","questClientOptions","questRedirectOptions","questApiOptions"].forEach(function(id){ $("#"+id).hidden=true; });
    ["questConsentFeedback","questClientFeedback","questRedirectFeedback","questApiFeedback"].forEach(function(id){
      $("#"+id).textContent=""; $("#"+id).className="quest-options-feedback";
    });
    $("#questApiEnableBtn").disabled=false;
    $("#questResult").hidden=true; $("#questResult").textContent=""; $("#questResult").className="quest-result";
    $("#questCompleteNote").hidden=true;
    questUpdateConsoleDot();
  }
  $("#questReset").addEventListener("click", questReset);

  function questRefreshLang(){
    if(questLastResultKey) $("#questResult").textContent = questResultTextFor(questLastResultKey);
    if(questLastFeedback.consent==="ok") $("#questConsentFeedback").textContent=t("auth.quest.consentExternalOk");
    else if(questLastFeedback.consent==="bad") $("#questConsentFeedback").textContent=t("auth.quest.consentInternalError");
    if(questLastFeedback.clientid==="ok") $("#questClientFeedback").textContent=t("auth.quest.clientTypeOk",{clientId:QUEST_CLIENT_ID_FAKE});
    else if(questLastFeedback.clientid) $("#questClientFeedback").textContent=t("auth.quest.clientTypeWrongError",{type:questClientTypeLabel(questLastFeedback.clientid)});
    if(questLastFeedback.redirect==="ok") $("#questRedirectFeedback").textContent=t("auth.quest.redirectCorrect");
    else if(questLastFeedback.redirect==="bad") $("#questRedirectFeedback").textContent=t("auth.quest.redirectWrong");
    if(questLastFeedback.api==="ok") $("#questApiFeedback").textContent=t("auth.quest.apiEnabledOk");
    else if(questLastFeedback.api==="enabling") $("#questApiFeedback").textContent=t("auth.quest.apiEnabling");
  }

  /* ============ MODULE 02 — IAM ============ */
  let iamAllowedCount=0, iamDeniedCount=0;
  function iamPerms(){
    return {
      read: $("#iamPermRead").checked,
      write: $("#iamPermWrite").checked,
      launch: $("#iamPermLaunch").checked,
      wildcard: $("#iamPermWildcard").checked
    };
  }
  function iamUpdateStats(){
    const p=iamPerms();
    const granted=[p.read,p.write,p.launch,p.wildcard].filter(Boolean).length;
    $("#iamStatGranted").textContent=granted;
    $("#iamStatAllowed").textContent=iamAllowedCount;
    $("#iamStatDenied").textContent=iamDeniedCount;
    $("#iamStatBlast").textContent = p.wildcard ? t("iam.blastHigh") : t("iam.blastLow");
    setStatus($("#iamStatus"), null, p.wildcard?"overPermissioned":"leastPriv", "iam.status", p.wildcard?"bad":"good");
  }
  function iamAttempt(actionLabelKey, permKey){
    const p=iamPerms();
    const allowed = p[permKey] || p.wildcard;
    if(allowed){
      iamAllowedCount++;
      addLog($("#iamLog"), t("iam.log.allowed",{action:t("iam."+actionLabelKey)}), "good");
    } else {
      iamDeniedCount++;
      addLog($("#iamLog"), t("iam.log.denied",{action:t("iam."+actionLabelKey)}), "bad");
    }
    iamUpdateStats();
  }
  $("#iamActionRead").addEventListener("click", function(){ iamAttempt("actionRead","read"); });
  $("#iamActionWrite").addEventListener("click", function(){ iamAttempt("actionWrite","write"); });
  $("#iamActionLaunch").addEventListener("click", function(){ iamAttempt("actionLaunch","launch"); });
  $("#iamActionLeak").addEventListener("click", function(){
    addLog($("#iamLog"), t("iam.log.leakStart"), "warn");
    iamAttempt("actionRead","read");
    iamAttempt("actionWrite","write");
    iamAttempt("actionLaunch","launch");
  });
  ["iamPermRead","iamPermWrite","iamPermLaunch","iamPermWildcard"].forEach(function(id){
    $("#"+id).addEventListener("change", iamUpdateStats);
  });
  addLog($("#iamLog"), t("iam.log.init"));
  iamUpdateStats();

  /* ============ MODULE 05 — S3 ============ */
  let s3VersionList=[];
  let s3NextV=1;
  let s3DeleteMarker=false;
  let s3EverUploaded=false;
  function s3RandomSizeKB(){ return Math.round(80+Math.random()*900); }
  function s3TotalSizeKB(){ return s3VersionList.reduce(function(a,v){ return a+v.sizeKB; },0); }
  function s3Render(){
    const wrap=$("#s3Versions");
    wrap.innerHTML="";
    s3VersionList.forEach(function(ver,i){
      const isCurrent = i===s3VersionList.length-1 && !s3DeleteMarker;
      const card=document.createElement("div");
      card.className="node-card"+(s3DeleteMarker?" unreachable":"");
      card.innerHTML =
        '<span class="id">v'+ver.v+'<span class="badge '+(isCurrent?"latest":"stale")+'">'+
        (isCurrent?t("s3.badgeCurrent"):t("s3.badgePrevious"))+'</span></span>'+
        '<span class="value">'+ver.sizeKB+' KB</span>';
      wrap.appendChild(card);
    });
  }
  function s3UpdateStats(){
    $("#s3StatVersions").textContent=s3VersionList.length;
    $("#s3StatSize").textContent=s3TotalSizeKB()+" KB";
    let stateKey;
    if(s3VersionList.length===0) stateKey = s3EverUploaded ? "gone" : "empty";
    else if(s3DeleteMarker) stateKey="deleted";
    else stateKey="available";
    $("#s3StatState").textContent=t("s3.status."+stateKey);
    const blockPublic=$("#s3BlockPublic").checked;
    const publicPolicy=$("#s3PublicPolicy").checked;
    const exposed = !blockPublic && publicPolicy;
    $("#s3StatPublic").textContent = exposed ? t("s3.status.exposed") : t("s3.status.secure");
    setStatus($("#s3Status"), null, exposed?"exposed":"secure", "s3.status", exposed?"bad":"good");
  }
  $("#s3Upload").addEventListener("click", function(){
    const size=s3RandomSizeKB();
    s3VersionList.push({v:s3NextV, sizeKB:size});
    s3NextV++; s3DeleteMarker=false; s3EverUploaded=true;
    addLog($("#s3Log"), t("s3.log.uploaded",{v:s3VersionList[s3VersionList.length-1].v, size:size+" KB"}), "good");
    s3Render(); s3UpdateStats();
  });
  $("#s3Delete").addEventListener("click", function(){
    if(s3VersionList.length===0 || s3DeleteMarker) return;
    if($("#s3Versioning").checked){
      s3DeleteMarker=true;
      addLog($("#s3Log"), t("s3.log.deletedMarker",{n:s3VersionList.length}), "warn");
    } else {
      s3VersionList=[];
      s3DeleteMarker=false;
      addLog($("#s3Log"), t("s3.log.deletedHard"), "bad");
    }
    s3Render(); s3UpdateStats();
  });
  $("#s3Restore").addEventListener("click", function(){
    if(s3DeleteMarker){
      s3DeleteMarker=false;
      addLog($("#s3Log"), t("s3.log.restored",{v:s3VersionList[s3VersionList.length-1].v}), "good");
    } else {
      addLog($("#s3Log"), t("s3.log.restoreNoop"));
    }
    s3Render(); s3UpdateStats();
  });
  $("#s3TestPublic").addEventListener("click", function(){
    const blockPublic=$("#s3BlockPublic").checked;
    const publicPolicy=$("#s3PublicPolicy").checked;
    if(blockPublic) addLog($("#s3Log"), t("s3.log.publicBlocked"), "good");
    else if(!publicPolicy) addLog($("#s3Log"), t("s3.log.publicNoPolicy"), "good");
    else addLog($("#s3Log"), t("s3.log.publicExposed"), "bad");
  });
  ["s3BlockPublic","s3PublicPolicy"].forEach(function(id){
    $("#"+id).addEventListener("change", s3UpdateStats);
  });
  addLog($("#s3Log"), t("s3.log.init"));
  s3Render(); s3UpdateStats();

  /* ============ MODULE 06 — LAMBDA ============ */
  let lambdaEnvs=[];
  let lambdaNextEnvId=1;
  let lambdaInvocations=0, lambdaColdCount=0, lambdaWarmCount=0, lambdaCost=0;
  const LAMBDA_COLD_MS=1150, LAMBDA_WARM_MS=45, LAMBDA_COST_PER_100MS=0.0000167;
  function lambdaRenderPool(){
    const wrap=$("#lambdaPool");
    wrap.innerHTML="";
    lambdaEnvs.forEach(function(env){
      const card=document.createElement("div");
      card.className="node-card";
      card.innerHTML='<span class="id">env-'+env.id+'<span class="badge latest">'+t("lambda.badgeWarm")+'</span></span>';
      wrap.appendChild(card);
    });
  }
  function lambdaUpdateStats(){
    $("#lambdaStatInvocations").textContent=lambdaInvocations;
    $("#lambdaStatCold").textContent=lambdaColdCount;
    $("#lambdaStatWarm").textContent=lambdaWarmCount;
    $("#lambdaStatCost").textContent="$"+lambdaCost.toFixed(4);
    const key = lambdaEnvs.length>0 ? "warmPool" : "cold";
    setStatus($("#lambdaStatus"), null, key, "lambda.status", lambdaEnvs.length>0?"good":"warn");
  }
  function lambdaInvokeOnce(){
    lambdaInvocations++;
    let ms;
    if(lambdaEnvs.length>0){
      ms=LAMBDA_WARM_MS+Math.round(Math.random()*15);
      lambdaWarmCount++;
      addLog($("#lambdaLog"), t("lambda.log.warm",{ms:ms}), "good");
    } else {
      ms=LAMBDA_COLD_MS+Math.round(Math.random()*300);
      lambdaColdCount++;
      lambdaEnvs.push({id:lambdaNextEnvId++});
      addLog($("#lambdaLog"), t("lambda.log.cold",{ms:ms}), "warn");
    }
    lambdaCost += (ms/100)*LAMBDA_COST_PER_100MS;
    lambdaRenderPool(); lambdaUpdateStats();
  }
  function lambdaBurst(n){
    const availableWarm=lambdaEnvs.length;
    const warm=Math.min(n, availableWarm);
    const cold=n-warm;
    for(let i=0;i<cold;i++){ lambdaEnvs.push({id:lambdaNextEnvId++}); }
    lambdaInvocations+=n; lambdaWarmCount+=warm; lambdaColdCount+=cold;
    lambdaCost += (warm*LAMBDA_WARM_MS + cold*LAMBDA_COLD_MS)/100*LAMBDA_COST_PER_100MS;
    addLog($("#lambdaLog"), t("lambda.log.burst",{n:n, cold:cold, warm:warm}), cold>0?"warn":"good");
    lambdaRenderPool(); lambdaUpdateStats();
  }
  function lambdaGoIdle(){
    const n=lambdaEnvs.length;
    lambdaEnvs=[];
    addLog($("#lambdaLog"), t("lambda.log.idled",{n:n}), "warn");
    lambdaRenderPool(); lambdaUpdateStats();
  }
  $("#lambdaInvoke").addEventListener("click", lambdaInvokeOnce);
  $("#lambdaBurst").addEventListener("input", function(){ $("#lambdaBurstOut").textContent=$("#lambdaBurst").value; });
  $("#lambdaBurstBtn").addEventListener("click", function(){ lambdaBurst(Number($("#lambdaBurst").value)); });
  $("#lambdaIdle").addEventListener("click", lambdaGoIdle);
  addLog($("#lambdaLog"), t("lambda.log.init"));
  lambdaRenderPool(); lambdaUpdateStats();

  /* ============ MODULE 14 — CLOUDWATCH ============ */
  let cwHistory=[];
  let cwBreachStreak=0, cwSilentStreak=0, cwSpikeTicksLeft=0;
  let cwAlarmKey="ok";
  function cwRenderSpark(){
    const el=$("#cwSpark");
    el.innerHTML="";
    cwHistory.forEach(function(d){
      const bar=document.createElement("i");
      bar.style.height=Math.max(3, Math.round(d.value/100*32))+"px";
      if(d.breach) bar.classList.add("breach");
      el.appendChild(bar);
    });
  }
  function cwUpdateStats(){
    const threshold=Number($("#cwThreshold").value);
    $("#cwThresholdOut").textContent=threshold;
    $("#cwStatThreshold").textContent=threshold+"%";
    $("#cwLoadOut").textContent=$("#cwLoad").value;
    const last=cwHistory[cwHistory.length-1];
    $("#cwStatLatest").textContent = last ? last.value+"%" : "—";
    $("#cwStatStreak").textContent=Math.min(cwBreachStreak,3)+"/3";
    const cls = cwAlarmKey==="alarm" ? "bad" : cwAlarmKey==="insufficient" ? "warn" : "good";
    setStatus($("#cloudwatchStatus"), null, cwAlarmKey, "cloudwatch.status", cls);
    $("#cwStatAlarm").textContent=t("cloudwatch.status."+cwAlarmKey);
  }
  function cwTick(){
    if($("#cwSilent").checked){
      cwSilentStreak++;
      if(cwSilentStreak<=3) addLog($("#cwLog"), t("cloudwatch.log.noData",{n:Math.min(cwSilentStreak,3)}), "warn");
      if(cwSilentStreak>=3 && cwAlarmKey!=="insufficient"){
        cwAlarmKey="insufficient";
        addLog($("#cwLog"), t("cloudwatch.log.insufficientFired"), "warn");
      }
      cwUpdateStats();
      return;
    }
    cwSilentStreak=0;
    const base=Number($("#cwLoad").value);
    let spikeBonus=0;
    if(cwSpikeTicksLeft>0){ spikeBonus=55; cwSpikeTicksLeft--; }
    const jitter=Math.round(Math.random()*8-4);
    const value=Math.max(0, Math.min(100, base+spikeBonus+jitter));
    const threshold=Number($("#cwThreshold").value);
    const breach=value>=threshold;
    cwHistory.push({value:value, breach:breach});
    if(cwHistory.length>30) cwHistory.shift();
    if(breach){
      cwBreachStreak=Math.min(cwBreachStreak+1,3);
      addLog($("#cwLog"), t("cloudwatch.log.datapointBreach",{value:value, streak:cwBreachStreak}), "warn");
      if(cwBreachStreak>=3 && cwAlarmKey!=="alarm"){
        cwAlarmKey="alarm";
        addLog($("#cwLog"), t("cloudwatch.log.alarmFired",{threshold:threshold}), "bad");
      }
    } else {
      if(cwAlarmKey==="alarm" || cwAlarmKey==="insufficient"){
        addLog($("#cwLog"), t("cloudwatch.log.alarmCleared"), "good");
      }
      cwBreachStreak=0;
      cwAlarmKey="ok";
    }
    cwRenderSpark();
    cwUpdateStats();
  }
  $("#cwLoad").addEventListener("input", function(){ $("#cwLoadOut").textContent=$("#cwLoad").value; });
  $("#cwThreshold").addEventListener("input", function(){
    $("#cwThresholdOut").textContent=$("#cwThreshold").value;
    $("#cwStatThreshold").textContent=$("#cwThreshold").value+"%";
  });
  $("#cwSpike").addEventListener("click", function(){
    cwSpikeTicksLeft=4;
    addLog($("#cwLog"), t("cloudwatch.log.spiked"), "warn");
  });
  $("#cwSilent").addEventListener("change", function(){
    if(!$("#cwSilent").checked) cwSilentStreak=0;
  });
  addLog($("#cwLog"), t("cloudwatch.log.init",{threshold:$("#cwThreshold").value}));
  cwRenderSpark(); cwUpdateStats();
  setInterval(cwTick, 900);

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

    vpcAllowed=0; vpcBlocked=0; vpcPrivateHits=0;
    $("#vpcRule80").checked=true; $("#vpcRule22").checked=false; $("#vpcTarget").selectedIndex=0;
    $("#vpcLog").innerHTML=""; $("#vpcStatus").dataset.statusKey="";
    addLog($("#vpcLog"), t("vpc.log.init"));
    vpcUpdateStats();

    ec2Instances=[]; ec2NextId=1; ec2TotalCost=0;
    $("#ec2Instances").innerHTML=""; $("#ec2Log").innerHTML=""; $("#ec2Status").dataset.statusKey="";
    $("#ec2Size").selectedIndex=0; $("#ec2Load").value=0; $("#ec2LoadOut").textContent=0;
    addLog($("#ec2Log"), t("ec2.log.init"));
    ec2UpdateStats();

    beanstalkVersion=1; beanstalkDeploys=0; beanstalkRollbacks=0; beanstalkHealthKey="ok";
    $("#beanstalkBug").checked=false;
    $("#beanstalkLog").innerHTML=""; $("#beanstalkStatus").dataset.statusKey="";
    beanstalkRenderServers();
    addLog($("#beanstalkLog"), t("beanstalk.log.init"));
    beanstalkUpdateStats();

    r53Regions.forEach(function(r){ r.healthy=true; });
    r53Queries=0;
    $("#r53Policy").selectedIndex=0; $("#r53PrimaryDown").checked=false;
    $("#r53Last").textContent="—"; $("#r53Queries").textContent=0;
    $("#r53Log").innerHTML=""; $("#route53Status").dataset.statusKey="";
    r53RenderRegions();
    addLog($("#r53Log"), t("route53.log.init"));
    $("#r53PrimaryHealth").textContent=t("route53.status.healthy");
    $("#r53PolicyOut").textContent=$("#r53Policy").selectedOptions[0].textContent;

    snsPublished=0; snsDelivered=0; snsFailedCount=0;
    $("#snsSubEmail").checked=true; $("#snsSubSms").checked=true; $("#snsSubQueue").checked=true; $("#snsFail").checked=false;
    $("#snsLog").innerHTML=""; $("#snsStatus").dataset.statusKey="";
    addLog($("#snsLog"), t("sns.log.init"));
    snsUpdateStats();

    $("#snowballSize").value=50; $("#snowballBw").value=100;
    snowballCompute();

    authRunEpoch++;
    authFlow="google"; authStepIndex=0; authRunning=false; authSignedIn=false;
    ["authTabGoogle","authTabEmail","authTabPhone"].forEach(function(id){ $("#"+id).classList.toggle("active", $("#"+id).dataset.flow==="google"); });
    $("#authLog").innerHTML=""; $("#authStatus").dataset.statusKey="";
    authRenderSteps();
    addLog($("#authLog"), t("auth.log.init"));
    authUpdateStats();
    questReset();

    iamAllowedCount=0; iamDeniedCount=0;
    $("#iamPermRead").checked=true; $("#iamPermWrite").checked=false;
    $("#iamPermLaunch").checked=false; $("#iamPermWildcard").checked=false;
    $("#iamLog").innerHTML=""; $("#iamStatus").dataset.statusKey="";
    addLog($("#iamLog"), t("iam.log.init"));
    iamUpdateStats();

    s3VersionList=[]; s3NextV=1; s3DeleteMarker=false; s3EverUploaded=false;
    $("#s3Versioning").checked=false; $("#s3BlockPublic").checked=true; $("#s3PublicPolicy").checked=false;
    $("#s3Log").innerHTML=""; $("#s3Status").dataset.statusKey="";
    addLog($("#s3Log"), t("s3.log.init"));
    s3Render(); s3UpdateStats();

    lambdaEnvs=[]; lambdaNextEnvId=1; lambdaInvocations=0; lambdaColdCount=0; lambdaWarmCount=0; lambdaCost=0;
    $("#lambdaBurst").value=20; $("#lambdaBurstOut").textContent=20;
    $("#lambdaLog").innerHTML=""; $("#lambdaStatus").dataset.statusKey="";
    addLog($("#lambdaLog"), t("lambda.log.init"));
    lambdaRenderPool(); lambdaUpdateStats();

    cwHistory=[]; cwBreachStreak=0; cwSilentStreak=0; cwSpikeTicksLeft=0; cwAlarmKey="ok";
    $("#cwLoad").value=30; $("#cwLoadOut").textContent=30;
    $("#cwThreshold").value=80; $("#cwThresholdOut").textContent=80;
    $("#cwSilent").checked=false;
    $("#cwLog").innerHTML=""; $("#cloudwatchStatus").dataset.statusKey="";
    addLog($("#cwLog"), t("cloudwatch.log.init",{threshold:80}));
    cwRenderSpark(); cwUpdateStats();
  }
  $("#resetAllBtn").addEventListener("click", resetAllModules);

  /* ============ ASK THE CONSOLE — Groq chat ============ */
  const CHAT_KEY_STORAGE="csc-groq-key";
  const CHAT_MODEL="llama-3.3-70b-versatile";
  const CHAT_SYSTEM_PROMPT=
    "You are a friendly, concise assistant embedded in an interactive web page called 'CloudLab' that teaches cloud computing through sixteen live simulations: what the cloud is, sign-in (federated & passwordless auth), IAM & least privilege, VPC networking, EC2, S3 & versioning, Lambda & cold starts, load balancing & auto-scaling, Elastic Beanstalk deploys, Route 53 DNS routing, caching & CDNs, distributed consistency (the CAP theorem), fault tolerance & failover, SNS fan-out, CloudWatch monitoring & alarms, and Snowball Edge. Answer the visitor's question about cloud computing concepts clearly, using everyday analogies where helpful, in a few sentences unless they ask for more depth. If asked something unrelated to cloud computing or this page, answer briefly and steer back. Reply in the same language the user wrote in (English or Turkish).";
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
  function chatSetOpen(open){
    const panel=$("#chatPanel");
    const fab=$("#chatFab");
    panel.classList.toggle("open", open);
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    if(open){
      if(chatGetKey()) $("#chatInput").focus();
      else $("#chatKeyInput").focus();
    } else {
      fab.focus();
    }
  }
  $("#chatFab").addEventListener("click", function(){
    chatSetOpen(!$("#chatPanel").classList.contains("open"));
  });
  $("#chatClose").addEventListener("click", function(){ chatSetOpen(false); });
  document.addEventListener("keydown", function(e){
    if(e.key==="Escape" && $("#chatPanel").classList.contains("open")) chatSetOpen(false);
  });
  document.addEventListener("click", function(e){
    if(!$("#chatPanel").classList.contains("open")) return;
    if(e.target.closest("#chatPanel") || e.target.closest("#chatFab")) return;
    chatSetOpen(false);
  });
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
    vpcUpdateStats();
    ec2Render(); ec2UpdateStats();
    beanstalkUpdateStats();
    r53RenderRegions();
    $("#r53PrimaryHealth").textContent = $("#r53PrimaryDown").checked ? t("route53.status.failoverActive") : t("route53.status.healthy");
    $("#r53PolicyOut").textContent=$("#r53Policy").selectedOptions[0].textContent;
    snsUpdateStats();
    snowballCompute();
    authRenderSteps(); authUpdateStats();
    questRefreshLang();
    iamUpdateStats();
    s3Render(); s3UpdateStats();
    lambdaRenderPool(); lambdaUpdateStats();
    cwRenderSpark(); cwUpdateStats();
    applyProviderTitles();
  }
  $("#langEnBtn").addEventListener("click", function(){ setLang("en"); });
  $("#langTrBtn").addEventListener("click", function(){ setLang("tr"); });

  /* ============ cloud provider toggle ============ */
  function applyProviderTitles(){
    PROVIDER_MODULES.forEach(function(mod){
      const el=document.querySelector('#'+mod+' > .panel-head > h2');
      if(!el) return;
      const key = providerMode==="aws" ? mod+".title" : mod+".title"+(providerMode==="azure"?"Azure":"Gcp");
      el.textContent=t(key);
    });
  }
  function setProvider(provider){
    providerMode=provider;
    localStorage.setItem(PROVIDER_KEY, provider);
    ["providerAwsBtn","providerAzureBtn","providerGcpBtn"].forEach(function(id){
      $("#"+id).classList.toggle("active", $("#"+id).dataset.provider===provider);
    });
    applyProviderTitles();
  }
  $("#providerAwsBtn").addEventListener("click", function(){ setProvider("aws"); });
  $("#providerAzureBtn").addEventListener("click", function(){ setProvider("azure"); });
  $("#providerGcpBtn").addEventListener("click", function(){ setProvider("gcp"); });
  setProvider(providerMode);

  setLang(currentLang);
})();
