# Operations Playbook & Standard Operating Procedures (SOP)

**For:** Operations Supervisors, Exception Handlers, DevOps Engineers, and Platform Administrators.

---

## 1. Daily Operations & System Health Monitoring

### Key Performance Indicators (KPIs) to Track
- **Straight-Through Processing (STP) Rate:** Target $\ge 85\%$. If STP falls below $80\%$, check for vendor invoice layout changes or optical degradation.
- **P95 Latency:** Target $\le 1{,}500\text{ms}$. If P95 exceeds $3{,}000\text{ms}$, inspect mainframe terminal session pool locks in the Bottleneck Intelligence tab.
- **Exception Queue Backlog:** Target $\le 15$ pending items. Any item older than 60 minutes triggers an automated Slack/PagerDuty escalation.

---

## 2. Exception Triage Protocols

When an inbound transaction triggers an exception, it is routed to the **Exception Queue** with one of four root causes:

### 1. Purchase Order Variance (> 2.0% Tolerance)
- **Root Cause:** Invoiced total does not match approved purchase order total.
- **Standard Protocol:**
  1. Inspect the side-by-side variance diff in the Exception Queue.
  2. Verify if shipping or freight fees account for the discrepancy.
  3. If variance is $< \$100$ and freight-related, click **"Apply Tolerance Adjustment"**.
  4. If unit price is altered without buyer consent, click **"Reject & Return to Counterparty"**.

### 2. Sanctioned Entity / PEP Match Warning
- **Root Cause:** Counterparty name or beneficial owner triggers an automated OFAC/EU watchlist fuzzy match.
- **Standard Protocol:**
  1. Mandatory Level-2 Compliance review.
  2. Cross-reference company registration number in registry.
  3. If false positive (homonym), upload compliance clearance note and click **"Authorize Supervisor Override"**.
  4. If confirmed match, immediately escalate to Chief Compliance Officer and quarantine record.

### 3. IBM 3270 Terminal Lock / Contention
- **Root Cause:** Mainframe terminal session pool exceeded concurrent threshold or remote host returned `DFHAC2001 TRANSACTION ABEND`.
- **Standard Protocol:**
  1. Check the **Exception Strategies & Retry Bench** tab.
  2. The system will execute exponential backoff with full jitter up to 3 attempts.
  3. If circuit breaker enters `OPEN` state, verify mainframe VPN connectivity and recycle terminal session pools via the Admin console.

---

## 3. Role-Based Access Control (RBAC) Governance

| Role | Permitted Actions | Prohibited Actions |
| :--- | :--- | :--- |
| **Administrator** | Full configuration, tolerance adjustments, production injection, user role management | N/A |
| **Operator** | Run test transactions, view live telemetry, resolve exceptions, authorize supervisor overrides | Modifying global tolerance thresholds, assigning user roles |
| **Analyst** | View cost analytics, run Monte Carlo simulations, review bottleneck forecasts | Triggering live production ledger writes, approving overrides |

---

## 4. Disaster Recovery & Failover Protocol

- **Failover Mode:** If upstream generative AI endpoints experience global degradation, the engine automatically switches to **Deterministic Heuristic Mode**, maintaining critical transaction flow for standardized recurring vendors.
- **Dead-Letter Queue (DLQ):** Unresolvable transactions are persisted in AES-256 encrypted DLQ storage with full forensic payloads for post-incident review.
