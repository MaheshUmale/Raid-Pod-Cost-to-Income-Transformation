# Technical Architecture: The Raid Pod Autonomous Multi-Agent Engine

## 1. System Topology & Design Principles

The Raid Pod is engineered as a resilient, low-latency, hybrid orchestration platform designed to replace fragile RPA (Robotic Process Automation) scripts and labor-intensive manual data entry with autonomous multi-agent pipelines.

### Core Architectural Axioms
1. **Separation of Cognitive Recognition and Deterministic Execution**: Generative AI (LLMs) is leveraged exclusively for unstructured data interpretation and contextual field extraction. Core financial calculations, cross-field reconciliation, and ledger commitments are strictly governed by deterministic mathematical code to ensure zero hallucinations.
2. **Stateless Pod Execution with Immutable Audit Trails**: Each transaction packet transitions through the Directed Acyclic Graph (DAG) as an immutable payload with stage-by-stage cryptographic hashing.
3. **Resilient Legacy Terminal Integration**: Direct emulation of IBM 3270/5250 datastreams bypasses GUI scraping brittle failure points, providing structured screen-buffer manipulation and atomic commit guarantees.

```
+----------------------------------------------------------------------------------------------------+
|                                    RAID POD ORCHESTRATION PIPELINE                                 |
+----------------------------------------------------------------------------------------------------+
                                      |
                           [Inbound Ingestion Gateway]
                                      |
                     +----------------+----------------+
                     |                                 |
                     v                                 v
          [Cognitive Extraction Agent]      [PII Sanitization Gateway]
          - Gemini 2.5 Flash Multimodal    - Regex / NER Redaction
          - Fallback Heuristic Parser       - Salted Token Substitution
                     |                                 |
                     +----------------+----------------+
                                      |
                                      v
                     [Deterministic Validation Agent]
                     - Tax / Subtotal Sum Parity
                     - PO Tolerance Check (Threshold: 2.0%)
                     - Sanction & PEP Watchlist Screening
                                      |
                     +----------------+----------------+
                     |                                 |
        (Within Policy Limits)             (Variance / Breach)
                     |                                 |
                     v                                 v
         [Legacy Terminal Bridge]           [Exception Router & DLQ]
         - IBM 3270 Buffer Parsing          - Exponential Backoff & Jitter
         - Atomic Commit Protocol           - Circuit Breaker Tripping
         - Session Pool Recycling           - Zero-Keying Supervisor UI
                     |                                 |
                     +----------------+----------------+
                                      |
                                      v
                         [Enterprise Core Systems]
                         - SAP / Oracle / CICS Ledger
```

---

## 2. Multi-Agent DAG Specification

### Stage 1: Multimodal Extraction & Schema Normalization
- **Purpose**: Transform arbitrary PDF, TIFF, scanned document, and unstructured email payloads into strongly typed JSON structures conforming to `RaidPodPayload`.
- **Latency Envelope**: 280ms – 420ms.
- **Failover Heuristics**: If the primary multimodal vision API experiences timeout or rate limiting, the engine falls back to local optical structure analysis and historical entity dictionaries.

### Stage 2: Deterministic Business Rule Validation
- **Purpose**: Verify arithmetic consistency, tax integrity, entity registry validity, and vendor contract cross-checks.
- **Tolerance Boundaries**:
  - Exact match on line-item math: $\sum (\text{Qty} \times \text{UnitPrice}) = \text{Subtotal}$.
  - Purchase Order Variance: Permissible variance $\le \$50.00$ or $\le 2.0\%$ of total contract value.
  - Due Date Constraints: Invoices must not exceed net-60 terms from issue date unless explicitly granted.

### Stage 3: Two-Way & Three-Way Reconciliation
- **Purpose**: Cross-correlate extracted invoices with external Purchase Orders and Warehouse Goods Received Notes (GRN).
- **Match Algorithms**: Levenshtein distance string matching on line item descriptions, fuzzy SKU mapping, and quantity parity verification.

### Stage 4: Virtual 3270 Terminal Bridge
- **Purpose**: Automate the commit of verified records into legacy mainframe systems (e.g., CICS, IMS, AS/400).
- **Driver Mechanism**:
  - Uses Telnet TN3270 protocol with structured screen buffer mapping (24 rows $\times$ 80 columns).
  - Cursor tracking and field-attribute inspection ensure data is inserted strictly into unprotected input fields.
  - Automated transaction commit (`ENTER`, `PF3`, `PA1`) with verification of system acknowledgement codes (`TRANS COMPLETED RC=0`).

---

## 3. Exception Handling & Circuit Breaker State Machine

When a step fails (due to network timeout, malformed data, or policy variance), the pod triggers a deterministic exception sub-process:

```
                  [Normal Execution]
                          |
                   (Failure Event)
                          |
                          v
               [Attempt 1: Immediate Retry]
                          |
                     (Failure)
                          |
                          v
         [Attempt 2: Exponential Backoff + Jitter]
            Wait = random(0, BaseDelay * 2^attempt)
                          |
                     (Failure)
                          |
                          v
               [Trip Circuit Breaker]
               State: CLOSED -> OPEN
                          |
              +-----------+-----------+
              |                       |
              v                       v
     [Dead-Letter Queue]    [Human Supervisor Packet]
     - Isolated Payload     - Pre-Computed Variance
     - Forensic Audit       - Single-Click Resolution
```

### Circuit Breaker Dynamics
- **Closed**: Requests pass freely to downstream legacy mainframes.
- **Half-Open**: When 3 consecutive failures occur, the breaker enters Half-Open, allowing 1 test transaction every 30 seconds.
- **Open**: Protects downstream legacy mainframe sessions from saturation when concurrency spikes exceed 8 concurrent lock requests.

---

## 4. Security & Compliance Architecture

1. **Role-Based Access Control (RBAC)**: Enforces principle of least privilege:
   - `Administrator`: Full system provisioning, policy tuning, role assignment.
   - `Operator`: Production transaction trigger, exception triage, resolution approval.
   - `Analyst`: Performance analytics, simulation, bottleneck observation.
2. **Data-at-Rest & In-Flight Encryption**: TLS 1.3 for all HTTP/gRPC ingress; AES-256 for queue buffers and transaction archives.
3. **Audit Immutability**: All decisions—whether made by autonomous agent or human supervisor—are recorded with timestamp, operator ID, and cryptographically hashed delta.
