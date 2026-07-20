// ============================================================
// DSGEE — Dynamic SOP Governance and Execution Engine
// Synthetic Mock Data — All data flows simulated via React state
// ============================================================

export const MOCK_PLAYBOOKS = [
  {
    id: "PB-0042",
    name: "Ransomware Triage & Containment",
    severity: "CRITICAL",
    status: "ACTIVE",
    assignee: "J. Doe",
    asset: "SRV-PROD-DB-07",
    started: "2026-07-20T10:22:11Z",
    steps: [
      {
        id: 1,
        name: "Extract IoCs from Memory Dump",
        description: "Run Volatility3 against captured memory image to extract running processes, network connections, and suspicious strings.",
        command: "volatility3 -f /forensics/SRV-DB-07.mem windows.pstree --pid 4812",
        status: "completed",
        duration: 42,
        automated: true,
        tactic: "Collection",
      },
      {
        id: 2,
        name: "Correlate Hashes with TI Feeds",
        description: "Submit extracted SHA256 hashes to internal MISP and VirusTotal Enterprise for threat intelligence correlation.",
        command: "python3 /tools/ti_correlate.py --hashes /tmp/extracted_hashes.txt --feeds misp,vt",
        status: "in-progress",
        duration: 0,
        automated: true,
        tactic: "Threat Intelligence",
      },
      {
        id: 3,
        name: "Isolate Endpoint via EDR",
        description: "Trigger CrowdStrike Falcon host isolation for SRV-PROD-DB-07 to prevent lateral movement.",
        command: "cs-cli isolate --host SRV-PROD-DB-07 --reason 'Ransomware IOC confirmed'",
        status: "pending",
        duration: 0,
        automated: true,
        tactic: "Containment",
      },
      {
        id: 4,
        name: "Snapshot & Preserve Evidence",
        description: "Create immutable S3 snapshots of affected volumes for forensic preservation chain-of-custody.",
        command: "aws ec2 create-snapshot --volume-id vol-0a2bc3d4e5 --description 'ForensicPreserve-$(date +%s)'",
        status: "pending",
        duration: 0,
        automated: true,
        tactic: "Evidence Collection",
      },
      {
        id: 5,
        name: "Notify CISO & Legal",
        description: "Send encrypted PGP notification to CISO, Legal Counsel, and PR via secure channel with incident brief.",
        command: "dsgee-notify --template ransomware-exec-brief --recipients ciso,legal,pr --classify CONFIDENTIAL",
        status: "pending",
        duration: 0,
        automated: false,
        tactic: "Communication",
      },
    ],
  },
  {
    id: "PB-0017",
    name: "Phishing Email Investigation",
    severity: "HIGH",
    status: "QUEUED",
    assignee: "M. Chen",
    asset: "WORKSTATION-FIN-22",
    started: "2026-07-20T09:45:00Z",
    steps: [
      { id: 1, name: "Header Analysis", description: "Analyze email headers for spoofing indicators.", command: "parse-headers --file /inbox/suspicious.eml", status: "pending", duration: 0, automated: true, tactic: "Initial Access" },
      { id: 2, name: "URL Sandbox Detonation", description: "Detonate embedded URLs in isolated sandbox.", command: "sandbox-detonate --url $(extract-urls /inbox/suspicious.eml)", status: "pending", duration: 0, automated: true, tactic: "Execution" },
      { id: 3, name: "User Account Audit", description: "Review recent activity for compromised account.", command: "ad-audit --user fin22-user --days 7", status: "pending", duration: 0, automated: true, tactic: "Credential Access" },
    ],
  },
  {
    id: "PB-0031",
    name: "Lateral Movement Detection Response",
    severity: "HIGH",
    status: "QUEUED",
    assignee: "K. Patel",
    asset: "DC-CORP-01",
    started: "2026-07-20T08:30:00Z",
    steps: [
      { id: 1, name: "Parse Windows Event Logs", description: "Extract 4624/4625 events from Domain Controller.", command: "Get-WinEvent -LogName Security -FilterXPath \"*[System[EventID=4624]]\"", status: "pending", duration: 0, automated: true, tactic: "Lateral Movement" },
      { id: 2, name: "Graph ADRelationships", description: "Map Kerberoastable accounts.", command: "bloodhound-python -u svc-audit -p $(vault kv get secret/ad/svc-audit) -d corp.internal -c All", status: "pending", duration: 0, automated: true, tactic: "Discovery" },
    ],
  },
];

export const MOCK_TERMINAL_LINES = [
  { delay: 200,  text: "[2026-07-20 10:22:11] DSGEE-ENGINE :: Initializing playbook PB-0042 on target SRV-PROD-DB-07", type: "info" },
  { delay: 600,  text: "[2026-07-20 10:22:11] AUTH    :: Service account dsgee-svc authenticated (MFA verified)", type: "success" },
  { delay: 900,  text: "[2026-07-20 10:22:12] API     :: POST /api/v2/actions/memory-dump {host:'SRV-PROD-DB-07', pid:4812}", type: "info" },
  { delay: 1300, text: "[2026-07-20 10:22:13] AGENT   :: Connected to SRV-PROD-DB-07 via mTLS (cert: CN=dsgee-agent-07)", type: "success" },
  { delay: 1700, text: "[2026-07-20 10:22:14] VOLATILITY :: Starting windows.pstree scan — PID 4812 (svchost.exe)", type: "info" },
  { delay: 2200, text: "[2026-07-20 10:22:16] VOLATILITY :: Offset: 0xfa8000c04060  PID:4812  PPID:652  svchost.exe", type: "warn" },
  { delay: 2600, text: "[2026-07-20 10:22:17] VOLATILITY :: Child PID:6104 (conhost.exe) — SUSPICIOUS child process chain", type: "warn" },
  { delay: 3000, text: "[2026-07-20 10:22:18] IOC     :: SHA256 extracted: a3f1e2c4d5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2", type: "danger" },
  { delay: 3400, text: "[2026-07-20 10:22:19] IOC     :: Network connection: 10.0.1.45:49324 -> 185.220.101.47:443 (TOR exit)", type: "danger" },
  { delay: 3900, text: "[2026-07-20 10:22:20] TI      :: Hash match: MISP event #8842 — LockBit 3.0 variant (confidence: HIGH)", type: "danger" },
  { delay: 4300, text: "[2026-07-20 10:22:21] TI      :: IP 185.220.101.47 → known TOR exit node — C2 communication confirmed", type: "danger" },
  { delay: 4700, text: "[2026-07-20 10:22:22] DSGEE   :: Step 1 COMPLETE — IoCs written to /forensics/pb0042/iocs.json", type: "success" },
  { delay: 5100, text: "[2026-07-20 10:22:23] DSGEE   :: Advancing to Step 2: TI Correlation...", type: "info" },
  { delay: 5500, text: "[2026-07-20 10:22:24] TI-CORRELATE :: Submitting 14 hashes to VT Enterprise...", type: "info" },
  { delay: 6000, text: "[2026-07-20 10:22:26] TI-CORRELATE :: 11/14 hashes flagged malicious — LockBit payload confirmed", type: "danger" },
  { delay: 6400, text: "[2026-07-20 10:22:27] AI-ADVISOR :: Override suggestion: DB-07 has active replication to SRV-DR-03", type: "warn" },
  { delay: 6800, text: "[2026-07-20 10:22:28] AI-ADVISOR :: Recommend isolation BEFORE replication sync (timeout: 5 min override)", type: "warn" },
];

export const MOCK_AUDIT_LOGS = [
  { id: "EVT-0001", timestamp: "10:19:42", actor: "DSGEE-ENGINE", action: "PLAYBOOK_STARTED", resource: "PB-0042", outcome: "SUCCESS", severity: "INFO", ocsf: "3002" },
  { id: "EVT-0002", timestamp: "10:20:11", actor: "J.Doe", action: "STEP_COMPLETED", resource: "Step 1: Extract IoCs", outcome: "SUCCESS", severity: "INFO", ocsf: "3002" },
  { id: "EVT-0003", timestamp: "10:21:05", actor: "DSGEE-ENGINE", action: "TI_LOOKUP", resource: "hash:a3f1e2c4...", outcome: "MATCH_FOUND", severity: "WARN", ocsf: "2001" },
  { id: "EVT-0004", timestamp: "10:21:33", actor: "J.Doe", action: "OVERRIDE_APPLIED", resource: "Step 3 Timeout", outcome: "MODIFIED", severity: "WARN", ocsf: "3004" },
  { id: "EVT-0005", timestamp: "10:22:01", actor: "DSGEE-ENGINE", action: "C2_DETECTED", resource: "185.220.101.47:443", outcome: "BLOCKED", severity: "CRITICAL", ocsf: "2004" },
];

export const MOCK_KPI = {
  mttr_triage: { value: "4m 22s", trend: -12, label: "Mean Time to Triage" },
  mttr_contain: { value: "18m 07s", trend: -8, label: "Mean Time to Contain" },
  active_incidents: { value: 3, trend: 1, label: "Active Incidents" },
  playbooks_run: { value: 47, trend: 5, label: "Playbooks Run (24h)" },
  automation_rate: { value: "84%", trend: 3, label: "Automation Rate" },
  sop_compliance: { value: "97.3%", trend: 0.4, label: "SOP Compliance" },
};

export const MOCK_THREATS = [
  {
    id: "CVE-2026-10520",
    title: "Ivanti Sentry RCE — Pre-auth Remote Code Execution",
    source: "CISA KEV",
    severity: "CRITICAL",
    cvss: 9.8,
    published: "2026-07-19T14:00:00Z",
    affected: "Ivanti Sentry 9.x, 8.x",
    description: "A pre-authentication stack-based buffer overflow in Ivanti Sentry MICS admin interface allows unauthenticated remote code execution. Actively exploited in the wild by TA577 group.",
    iocs: ["185.220.101.47", "a3f1e2c4d5b6a7f8", "hxxp://ivanti-update[.]ru/payload.bin"],
    policy_match: "POL-302 § 4.1",
    mitre: ["T1190", "T1059.004", "T1071.001"],
    feed: "CISA KEV",
  },
  {
    id: "CVE-2026-9881",
    title: "OpenSSL 3.x Heap Corruption (DoS / Potential RCE)",
    source: "NVD",
    severity: "HIGH",
    cvss: 8.1,
    published: "2026-07-18T08:00:00Z",
    affected: "OpenSSL 3.0–3.3",
    description: "A heap-use-after-free condition in OpenSSL's X.509 certificate parsing allows crafted certificates to trigger denial-of-service and potentially arbitrary code execution.",
    iocs: ["malformed-cert-chain", "heap-spray-pattern"],
    policy_match: "POL-114 § 2.3",
    mitre: ["T1499", "T1190"],
    feed: "NVD",
  },
  {
    id: "TA577-CAMPAIGN",
    title: "TA577 Spearphishing Campaign — Finance Sector",
    source: "ISAC Alert",
    severity: "HIGH",
    cvss: 7.5,
    published: "2026-07-20T06:30:00Z",
    affected: "Finance sector organizations",
    description: "TA577 is running targeted spearphishing with QBot loader against finance sector. Emails impersonate DocuSign e-signature requests with weaponized PDF attachments.",
    iocs: ["docusign-verify[.]net", "qbot-hash-f7a3b2", "hxxp://185.176.43.21/loader.ps1"],
    policy_match: "POL-201 § 1.2",
    mitre: ["T1566.001", "T1059.001", "T1547.001"],
    feed: "FS-ISAC",
  },
  {
    id: "CVE-2026-8830",
    title: "VMware vCenter Server SSRF — Internal Network Pivot",
    source: "VMware PSIRT",
    severity: "HIGH",
    cvss: 7.8,
    published: "2026-07-17T16:00:00Z",
    affected: "vCenter Server 7.x, 8.x",
    description: "Server-Side Request Forgery in vCenter Server's management API allows authenticated attackers to proxy requests to internal services, enabling internal network reconnaissance.",
    iocs: ["vcenter-ssrf-probe", "169.254.169.254/metadata"],
    policy_match: "POL-441 § 3.0",
    mitre: ["T1018", "T1046", "T1590"],
    feed: "VMware PSIRT",
  },
  {
    id: "ZERO-DAY-001",
    title: "Unpatched Windows NTLM Relay — Domain Compromise",
    source: "0-day Watch",
    severity: "CRITICAL",
    cvss: 9.1,
    published: "2026-07-20T04:00:00Z",
    affected: "Windows Server 2019/2022, Windows 11",
    description: "Researchers disclosed a novel NTLM relay technique exploiting SMB signing bypass. Allows any domain user to escalate to Domain Admin within minutes. No patch available.",
    iocs: ["ntlm-relay-tool", "responder-variant-x7"],
    policy_match: "POL-302 § 2.0",
    mitre: ["T1557.001", "T1558.003", "T1078.002"],
    feed: "0-day Watch",
  },
];

export const MOCK_MITRE_TACTICS = [
  { tactic: "Reconnaissance", id: "TA0043", techniques: ["T1595", "T1596", "T1591"], covered: 2, total: 3 },
  { tactic: "Initial Access", id: "TA0001", techniques: ["T1190", "T1566", "T1133"], covered: 3, total: 3 },
  { tactic: "Execution", id: "TA0002", techniques: ["T1059", "T1203", "T1106"], covered: 2, total: 3 },
  { tactic: "Persistence", id: "TA0003", techniques: ["T1547", "T1053", "T1078"], covered: 1, total: 3 },
  { tactic: "Priv. Escalation", id: "TA0004", techniques: ["T1055", "T1068", "T1078"], covered: 2, total: 3 },
  { tactic: "Defense Evasion", id: "TA0005", techniques: ["T1070", "T1027", "T1036"], covered: 1, total: 3 },
  { tactic: "Credential Access", id: "TA0006", techniques: ["T1110", "T1558", "T1555"], covered: 2, total: 3 },
  { tactic: "Discovery", id: "TA0007", techniques: ["T1018", "T1046", "T1082"], covered: 3, total: 3 },
  { tactic: "Lateral Movement", id: "TA0008", techniques: ["T1021", "T1550", "T1557"], covered: 2, total: 3 },
  { tactic: "Collection", id: "TA0009", techniques: ["T1005", "T1074", "T1039"], covered: 2, total: 3 },
  { tactic: "C2", id: "TA0011", techniques: ["T1071", "T1095", "T1573"], covered: 3, total: 3 },
  { tactic: "Exfiltration", id: "TA0010", techniques: ["T1041", "T1048", "T1537"], covered: 1, total: 3 },
  { tactic: "Impact", id: "TA0040", techniques: ["T1486", "T1489", "T1490"], covered: 2, total: 3 },
];

export const MOCK_COMPLIANCE_CONTROLS = [
  { framework: "ISO 27001", control: "A.16.1.2", name: "Reporting Information Security Events", status: "COMPLIANT", coverage: 97 },
  { framework: "ISO 27001", control: "A.16.1.5", name: "Response to Information Security Incidents", status: "COMPLIANT", coverage: 94 },
  { framework: "ISO 27001", control: "A.12.6.1", name: "Management of Technical Vulnerabilities", status: "PARTIAL", coverage: 78 },
  { framework: "SOC 2", control: "CC7.2", name: "System Monitoring", status: "COMPLIANT", coverage: 99 },
  { framework: "SOC 2", control: "CC7.3", name: "Boundary Protection", status: "COMPLIANT", coverage: 91 },
  { framework: "SOC 2", control: "CC9.2", name: "Risk Mitigation Activities", status: "PARTIAL", coverage: 72 },
  { framework: "NIST CSF", control: "RS.AN-1", name: "Investigations are performed", status: "COMPLIANT", coverage: 96 },
  { framework: "NIST CSF", control: "RS.CO-2", name: "Incidents are reported per policy", status: "COMPLIANT", coverage: 88 },
];

export const MOCK_GIT_PRS = [
  {
    id: "PR-441",
    title: "feat(pb-0042): add AI-driven isolation timeout override logic",
    author: "k.patel",
    branch: "feature/pb0042-timeout-override",
    status: "open",
    checks: { lint: "pass", dryrun: "pass", policy: "warn" },
    diff: `@@ -42,6 +42,12 @@ steps:
   - name: Isolate Endpoint via EDR
     action: crowdstrike.isolate
     params:
-      timeout: 120
+      timeout: 300  # AI-recommended override
+      override_reason: "DB replication risk — see AI-ADV-2026-07-20"
+      requires_justification: true
       host: "{{ incident.asset }}"
       reason: "{{ incident.id }} containment"`,
   },
  {
    id: "PR-440",
    title: "fix(pol-302): enforce MFA for break-glass operations",
    author: "j.smith",
    branch: "fix/pol302-mfa-breakglass",
    status: "merged",
    checks: { lint: "pass", dryrun: "pass", policy: "pass" },
    diff: `@@ -18,4 +18,7 @@ break_glass:
   authentication:
-    method: password
+    method: mfa
+    mfa_provider: okta
+    session_timeout: 900`,
   },
];

export const MOCK_YAML_PREVIEW = `# DSGEE Playbook Schema v2.1
# PB-0042: Ransomware Triage & Containment
---
metadata:
  id: PB-0042
  version: "3.1.4"
  severity: CRITICAL
  author: dsgee-engine
  last_reviewed: "2026-07-20"
  frameworks:
    - iso27001: "A.16.1.5"
    - soc2: "CC7.3"
    - nist_csf: "RS.AN-1"

variables:
  target_host: "{{ incident.asset }}"
  analyst: "{{ incident.assignee }}"
  isolation_timeout: 120  # seconds — PENDING OVERRIDE

steps:
  - id: step_1
    name: Extract IoCs from Memory Dump
    action: volatility3.pstree
    params:
      memory_image: "/forensics/{{ incident.asset }}.mem"
      output: "/forensics/{{ incident.id }}/iocs.json"
    on_success: step_2
    on_failure: notify_team

  - id: step_2
    name: Correlate Hashes with TI Feeds
    action: ti.correlate
    params:
      feeds: [misp, virustotal_enterprise]
      hash_file: "/forensics/{{ incident.id }}/iocs.json"
    timeout: 300
    on_success: step_3

  - id: step_3
    name: Isolate Endpoint via EDR
    action: crowdstrike.isolate
    params:
      host: "{{ variables.target_host }}"
      timeout: "{{ variables.isolation_timeout }}"
      reason: "Ransomware IOC confirmed — {{ incident.id }}"
    requires_approval: false
    on_success: step_4

  - id: step_4
    name: Snapshot & Preserve Evidence
    action: aws.ec2.create_snapshot
    params:
      volume_id: "{{ asset.volume_id }}"
      description: "ForensicPreserve-{{ incident.id }}-{{ timestamp }}"
      tags:
        Purpose: forensic-preservation
        IncidentID: "{{ incident.id }}"

  - id: step_5
    name: Notify CISO & Legal
    action: notify.secure_channel
    params:
      template: ransomware-exec-brief
      recipients: [ciso, legal, pr]
      classification: CONFIDENTIAL
    automated: false
    requires_human: true
`;

export const MOCK_SYNTHESIS_STAGES = [
  { id: 1, name: "Threat Profile Parsing", duration: 800, description: "Extracting CVE metadata, CVSS vectors, affected versions..." },
  { id: 2, name: "Policy RAG Lookup", duration: 1200, description: "Matching against internal policy corpus POL-302, POL-114..." },
  { id: 3, name: "MITRE Technique Mapping", duration: 1000, description: "Correlating TTPs: T1190, T1059.004, T1071.001..." },
  { id: 4, name: "Playbook Template Selection", duration: 700, description: "Selecting base template: remote-code-execution-response-v2..." },
  { id: 5, name: "YAML Schema Generation", duration: 1500, description: "Compiling automated action blocks with policy constraints..." },
  { id: 6, name: "Compliance Annotation", duration: 800, description: "Injecting ISO 27001, SOC 2, NIST CSF control references..." },
  { id: 7, name: "Dry-Run Validation", duration: 600, description: "Executing sandbox validation pass — checking action bindings..." },
];

export const MOCK_GENERATED_PLAYBOOK = `# DSGEE Auto-Synthesized Playbook
# Generated: 2026-07-20T10:50:00Z
# Threat: CVE-2026-10520 — Ivanti Sentry RCE
---
metadata:
  id: PB-AUTO-CVE-2026-10520
  version: "1.0.0-autogen"
  severity: CRITICAL
  cvss: 9.8
  auto_generated: true
  threat_source: "CISA KEV"
  policy_refs:
    - "POL-302 § 4.1"
    - "ISO 27001 A.12.6.1"
    - "SOC 2 CC9.2"
  mitre_coverage:
    - "T1190"
    - "T1059.004"
    - "T1071.001"

variables:
  target_asset: "{{ incident.asset }}"
  ivanti_version: "{{ asset.software.ivanti_sentry.version }}"
  patch_available: false

steps:
  - id: step_1
    name: Identify Ivanti Sentry Instances
    action: asset.discovery.scan
    params:
      product: "ivanti-sentry"
      versions: ["9.x", "8.x"]
      network_scope: "{{ org.internal_ranges }}"
    timeout: 600

  - id: step_2
    name: Check Exploitation Indicators
    action: edr.query
    params:
      ioc_list:
        - "185.220.101.47"
        - "a3f1e2c4d5b6a7f8"
      timeframe_hours: 72
      hosts: "{{ step_1.results }}"

  - id: step_3
    name: Emergency WAF Rule Deployment
    action: waf.rule.deploy
    params:
      rule_set: "ivanti-sentry-rce-block"
      mode: block
      targets: "{{ step_1.results }}"
    requires_approval: false

  - id: step_4
    name: Apply Vendor Mitigation Config
    action: config.apply
    params:
      target: "{{ step_1.results }}"
      config_template: "ivanti-mics-interface-disable"
      backup_before: true

  - id: step_5
    name: Isolate Unpatched Instances
    action: network.isolate
    params:
      hosts: "{{ step_1.results }}"
      allow_management: true
      reason: "CVE-2026-10520 — pre-patch isolation"

  - id: step_6
    name: Generate Executive Report
    action: report.generate
    params:
      template: cve-executive-brief
      cve: "CVE-2026-10520"
      recipients: [ciso, security_team]
      classification: CONFIDENTIAL
`;
