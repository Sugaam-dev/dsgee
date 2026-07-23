// ============================================================
// DSGEE — Dynamic SOP Governance and Execution Engine
// Synthetic Mock Data — All data flows simulated via React state
// ============================================================

export const MOCK_USER = {
  name: "Rajesh Sharma",
  shortName: "R. Sharma",
  initials: "RS",
  role: "Lead DevSecOps & SOC Architect",
  department: "Cyber Security & Cloud Infrastructure",
  email: "rajesh.sharma@dsgee.enterprise.in",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  location: "Bengaluru, India (IST +05:30)",
  clearance: "Level 4 — Enterprise Break-Glass Access",
  employeeId: "DSG-IND-8842",
};

export const MOCK_PLAYBOOKS = [
  {
    id: "PB-0042",
    name: "Ransomware Triage & Containment",
    severity: "CRITICAL",
    status: "ACTIVE",
    assignee: "R. Sharma",
    asset: "SRV-PROD-DB-07",
    started: "2026-07-23T07:22:11Z",
    estimatedDuration: "00:08:30",
    remainingSeconds: 245,
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
        input: "{ host: 'SRV-PROD-DB-07', pid: 4812, format: 'mem' }",
        output: "{ status: 'OK', ioc_count: 14, sha256: 'a3f1e2c4d5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2' }",
      },
      {
        id: 2,
        name: "Correlate Hashes with TI Feeds",
        description: "Submit extracted SHA256 hashes to internal MISP and VirusTotal Enterprise for threat intelligence correlation.",
        command: "python3 /tools/ti_correlate.py --hashes /tmp/extracted_hashes.txt --feeds misp,vt",
        status: "in-progress",
        duration: 18,
        automated: true,
        tactic: "Threat Intelligence",
        input: "{ hashes_file: '/tmp/extracted_hashes.txt', feeds: ['MISP', 'VT'] }",
        output: "{ matches: 11, classification: 'LockBit 3.0 Ransomware' }",
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
        input: "{ host: 'SRV-PROD-DB-07', isolation_type: 'network_only' }",
        output: "{ status: 'QUEUED' }",
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
        input: "{ volume: 'vol-0a2bc3d4e5', lock: true }",
        output: "{ status: 'QUEUED' }",
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
        input: "{ template: 'ransomware-exec-brief', recipients: ['ciso@dsgee.in', 'legal@dsgee.in'] }",
        output: "{ status: 'WAITING_APPROVAL' }",
      },
    ],
  },
  {
    id: "PB-0017",
    name: "Phishing Email Investigation",
    severity: "HIGH",
    status: "QUEUED",
    assignee: "Priya Nair",
    asset: "WORKSTATION-FIN-22",
    started: "2026-07-23T06:45:00Z",
    estimatedDuration: "00:04:15",
    remainingSeconds: 180,
    steps: [
      { id: 1, name: "Header Analysis", description: "Analyze email headers for spoofing indicators.", command: "parse-headers --file /inbox/suspicious.eml", status: "completed", duration: 12, automated: true, tactic: "Initial Access", input: "file: suspicious.eml", output: "SPF: PASS, DKIM: FAIL" },
      { id: 2, name: "URL Sandbox Detonation", description: "Detonate embedded URLs in isolated sandbox.", command: "sandbox-detonate --url $(extract-urls /inbox/suspicious.eml)", status: "in-progress", duration: 25, automated: true, tactic: "Execution", input: "url: http://malicious-login-auth.com", output: "Verdict: MALICIOUS" },
      { id: 3, name: "User Account Audit", description: "Review recent activity for compromised account.", command: "ad-audit --user fin22-user --days 7", status: "pending", duration: 0, automated: true, tactic: "Credential Access", input: "user: fin22-user", output: "pending" },
    ],
  },
  {
    id: "PB-0031",
    name: "Lateral Movement Detection Response",
    severity: "HIGH",
    status: "QUEUED",
    assignee: "Amit Verma",
    asset: "DC-CORP-01",
    started: "2026-07-23T05:30:00Z",
    estimatedDuration: "00:06:00",
    remainingSeconds: 310,
    steps: [
      { id: 1, name: "Parse Windows Event Logs", description: "Extract 4624/4625 events from Domain Controller.", command: "Get-WinEvent -LogName Security -FilterXPath \"*[System[EventID=4624]]\"", status: "completed", duration: 35, automated: true, tactic: "Lateral Movement", input: "EventID: 4624", output: "Failed logins: 142 from 10.0.4.12" },
      { id: 2, name: "Graph AD Relationships", description: "Map Kerberoastable accounts.", command: "bloodhound-python -u svc-audit -p $(vault kv get secret/ad/svc-audit) -d corp.internal -c All", status: "pending", duration: 0, automated: true, tactic: "Discovery", input: "domain: corp.internal", output: "pending" },
    ],
  },
];

export const MOCK_TERMINAL_LINES = [
  { delay: 200,  text: "[2026-07-23 07:22:11] DSGEE-ENGINE :: Initializing playbook PB-0042 on target SRV-PROD-DB-07", type: "info" },
  { delay: 600,  text: "[2026-07-23 07:22:11] AUTH    :: Service account dsgee-svc authenticated for user Rajesh Sharma (MFA verified)", type: "success" },
  { delay: 900,  text: "[2026-07-23 07:22:12] API     :: POST /api/v2/actions/memory-dump {host:'SRV-PROD-DB-07', pid:4812}", type: "info" },
  { delay: 1300, text: "[2026-07-23 07:22:13] AGENT   :: Connected to SRV-PROD-DB-07 via mTLS (cert: CN=dsgee-agent-07)", type: "success" },
  { delay: 1700, text: "[2026-07-23 07:22:14] VOLATILITY :: Starting windows.pstree scan — PID 4812 (svchost.exe)", type: "info" },
  { delay: 2200, text: "[2026-07-23 07:22:16] VOLATILITY :: Offset: 0xfa8000c04060  PID:4812  PPID:652  svchost.exe", type: "warn" },
  { delay: 2600, text: "[2026-07-23 07:22:17] VOLATILITY :: Child PID:6104 (conhost.exe) — SUSPICIOUS child process chain", type: "warn" },
  { delay: 3000, text: "[2026-07-23 07:22:18] IOC     :: SHA256 extracted: a3f1e2c4d5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2", type: "danger" },
  { delay: 3400, text: "[2026-07-23 07:22:19] IOC     :: Network connection: 10.0.1.45:49324 -> 185.220.101.47:443 (TOR exit)", type: "danger" },
  { delay: 3900, text: "[2026-07-23 07:22:20] TI      :: Hash match: MISP event #8842 — LockBit 3.0 variant (confidence: HIGH)", type: "danger" },
  { delay: 4300, text: "[2026-07-23 07:22:21] TI      :: IP 185.220.101.47 → known TOR exit node — C2 communication confirmed", type: "danger" },
  { delay: 4700, text: "[2026-07-23 07:22:22] DSGEE   :: Step 1 COMPLETE — IoCs written to /forensics/pb0042/iocs.json", type: "success" },
  { delay: 5100, text: "[2026-07-23 07:22:23] DSGEE   :: Advancing to Step 2: TI Correlation...", type: "info" },
  { delay: 5500, text: "[2026-07-23 07:22:24] TI-CORRELATE :: Submitting 14 hashes to VT Enterprise...", type: "info" },
  { delay: 6000, text: "[2026-07-23 07:22:26] TI-CORRELATE :: 11/14 hashes flagged malicious — LockBit payload confirmed", type: "danger" },
  { delay: 6400, text: "[2026-07-23 07:22:27] AI-ADVISOR :: Override suggestion: DB-07 has active replication to SRV-DR-03", type: "warn" },
  { delay: 6800, text: "[2026-07-23 07:22:28] AI-ADVISOR :: Recommend isolation BEFORE replication sync (timeout: 5 min override)", type: "warn" },
];

export const MOCK_AUDIT_LOGS = [
  {
    id: "EVT-0001",
    timestamp: "07:19:42",
    actor: "DSGEE-ENGINE",
    action: "PLAYBOOK_STARTED",
    resource: "PB-0042",
    outcome: "SUCCESS",
    severity: "INFO",
    ocsf: "3002",
    service: "Execution Engine",
    user: "System",
    status: "Completed",
    rawPayload: { event_id: "EVT-0001", category: "Execution", severity_id: 1, action: "PLAYBOOK_STARTED", target: "PB-0042", execution_time_ms: 120 }
  },
  {
    id: "EVT-0002",
    timestamp: "07:20:11",
    actor: "Rajesh Sharma",
    action: "STEP_COMPLETED",
    resource: "Step 1: Extract IoCs",
    outcome: "SUCCESS",
    severity: "INFO",
    ocsf: "3002",
    service: "Execution Engine",
    user: "Rajesh Sharma",
    status: "Completed",
    rawPayload: { event_id: "EVT-0002", category: "Analyst Action", severity_id: 1, action: "STEP_COMPLETED", target: "Step 1: Extract IoCs", analyst: "rajesh.sharma@dsgee.in" }
  },
  {
    id: "EVT-0003",
    timestamp: "07:21:05",
    actor: "DSGEE-ENGINE",
    action: "TI_LOOKUP",
    resource: "hash:a3f1e2c4...",
    outcome: "MATCH_FOUND",
    severity: "WARN",
    ocsf: "2001",
    service: "Threat Intelligence",
    user: "System",
    status: "Completed",
    rawPayload: { event_id: "EVT-0003", category: "Threat Intel", severity_id: 2, action: "TI_LOOKUP", match_count: 11, source: "VirusTotal Enterprise" }
  },
  {
    id: "EVT-0004",
    timestamp: "07:21:33",
    actor: "Rajesh Sharma",
    action: "OVERRIDE_APPLIED",
    resource: "Step 3 Isolation Timeout → 5m",
    outcome: "MODIFIED",
    severity: "WARN",
    ocsf: "3004",
    service: "Execution Engine",
    user: "Rajesh Sharma",
    status: "Modified",
    rawPayload: { event_id: "EVT-0004", category: "Policy Override", severity_id: 2, action: "OVERRIDE_APPLIED", previous: "120s", updated: "300s", justification: "Prevent DB replication corruption" }
  },
  {
    id: "EVT-0005",
    timestamp: "07:22:01",
    actor: "DSGEE-ENGINE",
    action: "C2_DETECTED",
    resource: "185.220.101.47:443",
    outcome: "BLOCKED",
    severity: "CRITICAL",
    ocsf: "2004",
    service: "Network Security",
    user: "System",
    status: "Blocked",
    rawPayload: { event_id: "EVT-0005", category: "Network Firewall", severity_id: 4, action: "C2_DETECTED", remote_ip: "185.220.101.47", port: 443, action_taken: "TCP RST" }
  },
  {
    id: "EVT-0006",
    timestamp: "07:25:10",
    actor: "Priya Nair",
    action: "POLICY_SIGN_OFF",
    resource: "POL-302 § 4.1",
    outcome: "APPROVED",
    severity: "INFO",
    ocsf: "1001",
    service: "Governance",
    user: "Priya Nair",
    status: "Completed",
    rawPayload: { event_id: "EVT-0006", category: "Governance", severity_id: 1, action: "POLICY_SIGN_OFF", policy: "POL-302", signed_by: "Priya Nair (CISO Delegate)" }
  },
  {
    id: "EVT-0007",
    timestamp: "07:28:44",
    actor: "Amit Verma",
    action: "STEP_BYPASSED",
    resource: "Step 2: URL Detonation",
    outcome: "BYPASSED",
    severity: "CRITICAL",
    ocsf: "3004",
    service: "Execution Engine",
    user: "Amit Verma",
    status: "Bypassed",
    rawPayload: { event_id: "EVT-0007", category: "Break Glass", severity_id: 4, action: "STEP_BYPASSED", step: "URL Sandbox Detonation", justification: "Emergency isolation required" }
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "NOTIF-101",
    title: "Critical Ransomware Indicator Detected",
    message: "LockBit 3.0 hash identified on host SRV-PROD-DB-07 during automated memory triage.",
    timestamp: "07:22:18",
    read: false,
    severity: "CRITICAL",
    category: "Security Alert",
    asset: "SRV-PROD-DB-07",
    actionText: "View Incident",
    details: "High confidence LockBit 3.0 malware IOC found in process memory space of svchost.exe (PID 4812). Network connection to TOR exit node 185.220.101.47 blocked."
  },
  {
    id: "NOTIF-102",
    title: "Process Drift Alert — Shadow Execution",
    message: "Analyst Rajesh Sharma isolated endpoint via CrowdStrike console bypassing DSGEE pipeline.",
    timestamp: "07:20:05",
    read: false,
    severity: "WARN",
    category: "Compliance",
    asset: "SRV-PROD-DB-07",
    actionText: "Auto-Remediate",
    details: "State mismatch between CrowdStrike Falcon EDR and DSGEE SOP execution log. Auto-remediation script queued to sync state."
  },
  {
    id: "NOTIF-103",
    title: "SOP Pull Request Merged & Deployed",
    message: "PR-440 (enforce MFA break-glass) merged by Ananya Patel into production policy engine.",
    timestamp: "07:15:30",
    read: false,
    severity: "INFO",
    category: "Governance",
    asset: "POL-302-V2",
    actionText: "View PR",
    details: "PR-440 approved by security engineering team. Break-glass break actions now mandate Okta push MFA verification."
  },
  {
    id: "NOTIF-104",
    title: "CVE-2026-10520 Ivanti Sentry RCE Ingested",
    message: "New CISA KEV zero-day vulnerability ingested. Playbook auto-synthesis recommended.",
    timestamp: "06:50:12",
    read: true,
    severity: "CRITICAL",
    category: "Threat Intel",
    asset: "Global Scope",
    actionText: "Synthesize",
    details: "Pre-auth RCE in Ivanti Sentry MICS admin interface (CVSS 9.8). Active exploitation confirmed in financial sector."
  },
  {
    id: "NOTIF-105",
    title: "Scheduled Backup & Snapshot Verification Passed",
    message: "Immutable EBS forensic snapshot completed for DB-07 (vol-0a2bc3d4e5).",
    timestamp: "06:10:00",
    read: true,
    severity: "INFO",
    category: "System",
    asset: "SRV-PROD-DB-07",
    actionText: "View Snapshot",
    details: "Snapshot snap-0e8971f2a34b5c6d verified with SHA-256 checksum and locked in AWS S3 Object Lock vault."
  },
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
    published: "2026-07-23T06:30:00Z",
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
    published: "2026-07-23T04:00:00Z",
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
    author: "amit.verma",
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
    author: "rajesh.sharma",
    branch: "fix/pol302-mfa-breakglass",
    status: "Deployed",
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
  last_reviewed: "2026-07-23"
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
# Generated: 2026-07-23T07:50:00Z
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

// Tech Board Mock Data
export const MOCK_TECH_BOARD = {
  services: [
    { name: "DSGEE Orchestrator Engine", status: "Healthy", uptime: "99.98%", load: "14%", port: "8443", version: "v2.4.1" },
    { name: "Threat Intelligence Synthesizer", status: "Healthy", uptime: "99.95%", load: "28%", port: "9090", version: "v2.3.0" },
    { name: "OCSF Audit Logger", status: "Healthy", uptime: "100%", load: "8%", port: "5140", version: "v1.9.4" },
    { name: "EDR CrowdStrike Integration Adapter", status: "Healthy", uptime: "99.90%", load: "12%", port: "8081", version: "v3.0.2" },
    { name: "Policy RAG Vector Indexer", status: "Warning", uptime: "98.50%", load: "82%", port: "6379", version: "v1.2.0" },
    { name: "Break-Glass Access Controller", status: "Healthy", uptime: "100%", load: "4%", port: "8888", version: "v2.0.1" },
  ],
  jobs: [
    { id: "JOB-401", name: "CISA KEV Feed Sync", schedule: "Every 15m", lastRun: "3 mins ago", status: "Success", duration: "1.4s" },
    { id: "JOB-402", name: "Forensic Evidence Vault Backup", schedule: "Every 1h", lastRun: "22 mins ago", status: "Success", duration: "45.2s" },
    { id: "JOB-403", name: "MITRE ATT&CK Matrix Re-index", schedule: "Daily at 00:00", lastRun: "7 hours ago", status: "Success", duration: "12.8s" },
    { id: "JOB-404", name: "ISO 27001 Automated Audit Check", schedule: "Every 6h", lastRun: "1 hour ago", status: "Running", duration: "18.0s" },
    { id: "JOB-405", name: "WAF Rule Set Auto-Propagation", schedule: "Triggered", lastRun: "14 mins ago", status: "Failed", duration: "8.1s" },
  ],
  containers: [
    { id: "cnt-8f4a12", name: "dsgee-api-gateway", image: "dsgee/api:2.4.1", cpu: "2.4%", mem: "184MB", status: "Running" },
    { id: "cnt-3b9c01", name: "dsgee-rag-redis", image: "redis:7.2-alpine", cpu: "1.1%", mem: "512MB", status: "Running" },
    { id: "cnt-7d2e45", name: "dsgee-exec-runner-01", image: "dsgee/runner:latest", cpu: "14.8%", mem: "420MB", status: "Running" },
    { id: "cnt-1a5f99", name: "dsgee-vector-chroma", image: "chromadb/chroma:0.4", cpu: "18.2%", mem: "1.2GB", status: "Running" },
  ],
  k8sPods: [
    { name: "dsgee-orchestrator-7d8f9b-x42p", namespace: "prod-sec", status: "Running", restarts: 0, node: "k8s-node-blru-01" },
    { name: "dsgee-telemetry-collector-5c4d-9m1k", namespace: "prod-sec", status: "Running", restarts: 1, node: "k8s-node-blru-02" },
    { name: "dsgee-ai-advisor-84b2c-ll7r", namespace: "prod-ai", status: "Running", restarts: 0, node: "k8s-node-blru-03" },
    { name: "dsgee-audit-ingestor-11a2f-90xz", namespace: "prod-sec", status: "CrashLoopBackOff", restarts: 4, node: "k8s-node-blru-01" },
  ],
  failedPipelines: [
    { pipeline: "WAF Auto-Mitigation Pipeline #104", branch: "main", commit: "a7b3c9f", failedAt: "07:12:00", step: "deploy-cloudflare-rules", error: "403 Forbidden: API key scope missing waf:write" },
    { pipeline: "vCenter Patch Verification #88", branch: "sec/vcenter-ssrf", commit: "90e1d2c", failedAt: "06:45:10", step: "health-check-post-patch", error: "Timeout 300s exceeded on host vcenter-prod-02" },
  ],
  agents: [
    { id: "DSGEE-AGENT-01", host: "SRV-PROD-DB-07", os: "Ubuntu 22.04 LTS", status: "Online", latency: "4ms", version: "v2.4.0" },
    { id: "DSGEE-AGENT-02", host: "DC-CORP-01", os: "Windows Server 2022", status: "Online", latency: "12ms", version: "v2.4.0" },
    { id: "DSGEE-AGENT-03", host: "WORKSTATION-FIN-22", os: "Windows 11 Enterprise", status: "Online", latency: "28ms", version: "v2.3.9" },
    { id: "DSGEE-AGENT-04", host: "K8S-NODE-BLRU-01", os: "RHEL 9.2", status: "Degraded", latency: "142ms", version: "v2.4.0" },
  ],
};

// Self Page User Data
export const MOCK_SELF_DATA = {
  profile: {
    fullName: "Rajesh Sharma",
    role: "Lead DevSecOps & SOC Architect",
    email: "rajesh.sharma@dsgee.enterprise.in",
    phone: "+91 98765 43210",
    employeeId: "DSG-IND-8842",
    department: "Cyber Security & Cloud Infrastructure",
    team: "SOC Tier 3 — Incident Response & Automation",
    location: "Bengaluru, Karnataka, India",
    joinedDate: "15-Aug-2023",
    mfaEnabled: true,
  },
  assets: [
    { id: "SRV-PROD-DB-07", type: "Production Database Server", os: "Ubuntu 22.04 LTS", ip: "10.0.1.45", role: "Primary DB Master" },
    { id: "DC-CORP-01", type: "Domain Controller", os: "Windows Server 2022", ip: "10.0.0.10", role: "Active Directory Key Server" },
    { id: "K8S-NODE-BLRU-01", type: "Kubernetes Cluster Node", os: "RHEL 9.2", ip: "10.0.8.12", role: "Security Microservices Pool" },
  ],
  certifications: [
    { name: "CISSP — Certified Information Systems Security Professional", issuer: "(ISC)²", validUntil: "2028-12-31" },
    { name: "CISM — Certified Information Security Manager", issuer: "ISACA", validUntil: "2027-09-30" },
    { name: "AWS Certified Security — Specialty", issuer: "Amazon Web Services", validUntil: "2027-04-15" },
    { name: "CKS — Certified Kubernetes Security Specialist", issuer: "CNCF", validUntil: "2026-11-20" },
  ],
  tasks: [
    { id: "TSK-801", title: "Review Break-Glass Isolation Timeout for DB-07", priority: "HIGH", dueDate: "Today", status: "In Progress" },
    { id: "TSK-802", title: "Sign-off ISO 27001 Incident Response Evidence Bundle", priority: "MEDIUM", dueDate: "Tomorrow", status: "Pending" },
    { id: "TSK-803", title: "Verify OpenSSL Patch Deployment across Staging", priority: "LOW", dueDate: "25-Jul-2026", status: "Completed" },
  ],
  loginHistory: [
    { time: "2026-07-23 07:15:22", ip: "10.0.4.15", location: "Bengaluru HQ (VPN)", device: "MacBook Pro M3 Max / Chrome 126", status: "SUCCESS" },
    { time: "2026-07-22 09:30:11", ip: "10.0.4.15", location: "Bengaluru HQ (VPN)", device: "MacBook Pro M3 Max / Chrome 126", status: "SUCCESS" },
    { time: "2026-07-21 14:12:00", ip: "10.0.4.18", location: "Bengaluru HQ (Wi-Fi)", device: "MacBook Pro M3 Max / Chrome 126", status: "SUCCESS" },
    { time: "2026-07-20 08:01:45", ip: "182.72.10.4", location: "Mumbai Remote Gateway", device: "MacBook Pro M3 Max / Safari", status: "SUCCESS" },
  ],
};

// Linux command simulation registry
export const LINUX_COMMAND_OUTPUTS = {
  "pwd": "/home/rajesh/dsgee-platform/security-ops",
  "whoami": "rajesh_sharma (uid=1000 gid=1000 groups=1000(rajesh),27(sudo),999(docker),1002(dsgee-ops))",
  "id": "uid=1000(rajesh_sharma) gid=1000(rajesh) groups=1000(rajesh),27(sudo),999(docker),1002(dsgee-ops),1005(soc-tier3)",
  "uname": "Linux dsgee-prod-srv07 6.5.0-41-generic #41~22.04.1-Ubuntu SMP PREEMPT_DYNAMIC x86_64 x86_64 x86_64 GNU/Linux",
  "uptime": " 07:35:59 up 42 days, 14:22,  3 users,  load average: 0.42, 0.58, 0.65",
  "hostname": "srv-prod-db-07.internal.dsgee.in",
  "ls": "bin  config  data  docs  forensics  logs  playbooks  scripts  src  templates",
  "ls -la": `drwxr-xr-x 12 rajesh dsgee-ops  4096 Jul 23 07:20 .
drwxr-xr-x  5 root   root       4096 Jul 01 00:00 ..
-rw-r--r--  1 rajesh dsgee-ops   577 Jul 23 02:06 package.json
drwxr-xr-x  2 rajesh dsgee-ops  4096 Jul 23 07:22 forensics
drwxr-xr-x  4 rajesh dsgee-ops  4096 Jul 20 10:00 playbooks
drwxr-xr-x  3 rajesh dsgee-ops  4096 Jul 23 07:00 logs
-rw-r--r--  1 rajesh dsgee-ops  1660 Jul 23 02:06 index.css`,
  "df": `Filesystem     1K-blocks      Used Available Use% Mounted on
/dev/sda1      205077248 114502840  80108608  59% /
tmpfs            8142340         0   8142340   0% /dev/shm
/dev/sdb1      512000000 184520000 327480000  37% /forensics`,
  "free": `               total        used        free      shared  buff/cache   available
Mem:        16384200     6245100     2840100      412000     7299000     9420000
Swap:        4194300           0     4194300`,
  "ps": `  PID TTY          TIME CMD
 4812 ?        00:02:14 svchost.exe (SUSPICIOUS)
 6104 ?        00:00:12 conhost.exe
 8842 pts/0    00:00:00 dsgee-agent
 9102 pts/0    00:00:00 volatility3
 9450 pts/0    00:00:00 bash`,
  "ss": `Netid  State   Recv-Q  Send-Q     Local Address:Port      Peer Address:Port
tcp    ESTAB   0       0             10.0.1.45:49324    185.220.101.47:443
tcp    LISTEN  0       128             0.0.0.0:8443            0.0.0.0:*
tcp    LISTEN  0       128             0.0.0.0:22              0.0.0.0:*`,
  "lsof": `COMMAND   PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
svchost  4812 root    3u  IPv4 992014      0t0  TCP 10.0.1.45:49324->185.220.101.47:443 (ESTABLISHED)
dsgee-ag 8842 rajesh  4u  IPv4 882104      0t0  TCP 10.0.1.45:8443->10.0.0.5:54120 (ESTABLISHED)`,
  "top": `top - 07:36:00 up 42 days, 14:22,  3 users,  load average: 0.42, 0.58, 0.65
Tasks: 214 total,   2 running, 212 sleeping,   0 stopped,   0 zombie
%Cpu(s):  6.2 us,  2.1 sy,  0.0 ni, 91.2 id,  0.3 wa,  0.0 hi,  0.2 si
MiB Mem :  16000.2 total,   2773.5 free,   6100.1 used,   7126.6 buff/cache
MiB Swap:   4096.0 total,   4096.0 free,      0.0 used.   9200.0 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 4812 root      20   0  840120 184500  42100 R  42.5   1.2   2:14.20 svchost.exe
 9102 rajesh    20   0  420100  92000  18400 S  14.2   0.6   0:08.40 volatility3
 8842 rajesh    20   0  184200  45000  12000 S   2.1   0.3   0:45.10 dsgee-agent`,
  "htop": `  1  [||||||||||||||||||||||||||||                42.5%]   Tasks: 214, 483 thr; 2 running
  2  [||||||||||                                 14.2%]   Load average: 0.42 0.58 0.65
  Mem[|||||||||||||||||||||||||         6.10G/16.0G]   Uptime: 42 days, 14:22:00
  Swp[                                    0K/4.10G]

  PID USER      PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command
 4812 root       20   0  840M  184M 42100 R 42.5  1.2  2:14.20 /tmp/svchost.exe -c 185.220.101.47
 9102 rajesh     20   0  420M   92M 18400 S 14.2  0.6  0:08.40 volatility3 -f /forensics/SRV-DB-07.mem`,
  "systemctl": `UNIT                               LOAD   ACTIVE SUB     DESCRIPTION
● dsgee-agent.service              loaded active running DSGEE Security Execution Agent
● crowdstrike-falcon.service       loaded active running CrowdStrike Falcon Sensor
● ufw.service                      loaded active running Uncomplicated Firewall
● docker.service                   loaded active running Docker Application Container Engine`,
  "journalctl": `Jul 23 07:22:11 srv-prod-db-07 dsgee-agent[8842]: [INFO] Playbook PB-0042 assigned to target host.
Jul 23 07:22:14 srv-prod-db-07 dsgee-agent[8842]: [WARN] Suspicious process chain detected PID 4812 -> 6104.
Jul 23 07:22:18 srv-prod-db-07 dsgee-agent[8842]: [CRITICAL] Outbound connection to TOR exit node 185.220.101.47.`,
  "netstat": `Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 10.0.1.45:49324         185.220.101.47:443      ESTABLISHED 4812/svchost.exe
tcp        0      0 0.0.0.0:8443            0.0.0.0:*               LISTEN      8842/dsgee-agent`,
  "ip": `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff
    inet 10.0.1.45/24 brd 10.0.1.255 scope global eth0`,
  "iptables": `Chain INPUT (policy ACCEPT)
target     prot opt source               destination         
DROP       tcp  --  185.220.101.47       0.0.0.0/0            tcp dpt:443 /* Block TOR C2 */

Chain FORWARD (policy ACCEPT)
Chain OUTPUT (policy ACCEPT)`,
  "whoami": "rajesh_sharma",
  "groups": "rajesh sudo docker dsgee-ops soc-tier3",
  "users": "rajesh priya_nair amit_verma",
  "last": `rajesh   pts/0        10.0.4.15        Thu Jul 23 07:15   still logged in
priya    pts/1        10.0.4.18        Thu Jul 23 06:30 - 07:10  (00:40)
reboot   system boot  6.5.0-41-generic Wed Jun 11 17:13   still running`,
};
