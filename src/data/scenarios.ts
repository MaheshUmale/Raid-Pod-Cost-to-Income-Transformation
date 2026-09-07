import { ScenarioTemplate } from '../types';

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: 'claims',
    name: 'Auto & Casualty Insurance Claims (FNOL)',
    category: 'Insurance / Financial Services',
    description: 'Intercepts unstructured accident reports, police narratives, and repair shop estimates. Extracts loss details, verifies policy limits, and submits directly into legacy IBM Mainframe 3270 / Guidewire.',
    defaultManualMins: 38,
    defaultHourlyWage: 75,
    legacySystemName: 'IBM z/OS Mainframe 3270 / Guidewire PolicyCore',
    expectedExtractionFields: ['Claimant Name', 'Date of Loss', 'Estimated Damage', 'Deductible', 'VIN', 'Police Report #'],
    deterministicRules: [
      'Coverage Active on Date of Incident',
      'Loss Amount <= $10,000 STP Authority Cap',
      'No Active Fraud Watch Flag on Claimant Tax ID',
      'Valid VIN Checksum (17 Alphanumeric ISO 3779)',
    ],
    sampleInput: `ACCIDENT REPORT & FIRST NOTICE OF LOSS (FNOL)
Policyholder: Apex Fleet Logistics Corp
Policy Number: POL-99283-COMM-P&C
Claimant: Johnathan E. Vance (Driver ID: DF-8819)
Date & Time of Occurrence: August 28, 2026 at approximately 14:15 EST
Location: Interstate 95 Northbound, Mile Marker 42, Richmond, VA
Vehicle: 2024 Freightliner Cascadia | VIN: 1FTFW1ED4MFA19234
Incident Summary: Insured tractor-trailer sustained passenger-side impact when an unauthorized delivery van merged into Lane 2 without signaling. Severe panel intrusion on the steer axle side, hydraulic line fracture, and bumper assembly detachment.
Police Incident Ref: Richmond Dept of Police #PR-8812-DISTRICT-4 (Officer Miller badge #412).
Estimated Repair Quotation: $6,420.00 (Parts: $3,920, Labor: $2,500 at Apex Body Works).
Towing & Storage: $480.00 incurred via Statewide Heavy Haul.
Injuries: None reported at scene; driver declined EMS transport.
Deductible Applicable: $1,000.00 Comprehensive Fleet.`,
  },
  {
    id: 'reconciliation',
    name: 'Cross-Border Document & Invoice Reconciliation',
    category: 'Supply Chain & Corporate Treasury',
    description: 'Intercepts multi-currency vendor commercial invoices, Bills of Lading, and Goods Receipt Notes. Solves 3-way matching discrepancies and inputs into legacy SAP ECC 6.0 without manual keying.',
    defaultManualMins: 28,
    defaultHourlyWage: 68,
    legacySystemName: 'SAP ECC 6.0 (T-Code FB01 / MIRO Accounts Payable)',
    expectedExtractionFields: ['Vendor Name', 'Purchase Order #', 'Invoice #', 'Total Gross Amount', 'Line Items Count', 'VAT/Tax Breakdown'],
    deterministicRules: [
      'PO Matching Tolerance <= 0.05% or $15.00',
      'Goods Receipt (GRN) Status Confirmed in Warehouse',
      'Vendor IBAN & Swift matches approved corporate vendor master',
      'Tax & Surcharge arithmetic equals net + gross balance',
    ],
    sampleInput: `COMMERCIAL INVOICE & BILL OF LADING RECONCILIATION
Vendor: Global Freight & Forwarding LLC (Tax ID: DE-819920148)
Remittance Address: Speicherstadt Block 4, Hamburg, Germany
Invoice Number: GFF-2026-INV-44812
Date of Issue: 02-SEP-2026 | Due Date: 02-OCT-2026 (Net 30)
Customer Ref / Purchase Order: PO-991204-SUPPLY-EU
Associated Goods Receipt Note: GRN-2026-08831 (Received at Rotterdam Port Hub)
Line Items:
  1. Container Drayage & Intermodal Rail (40ft High-Cube): 12 Units @ €1,240.00 = €14,880.00
  2. Cold-Chain Monitoring & Telematics Surcharge: €1,250.00
  3. Port Customs Clearance & Terminal Handling: €6,420.50
Subtotal Net: €22,550.50
VAT / Customs Import Duty (10.37% Blended): €2,340.00
TOTAL PAYABLE AMOUNT: €24,890.50 EUR
Banking Details: Deutsche Bank Frankfurt | IBAN: DE89 3704 0044 0532 0130 00 | SWIFT: DEUTDEDBFXX
Discrepancy Note: Purchase Order was budgeted for €24,800.00 (+€90.50 variance due to terminal fuel adjustment index).`,
  },
  {
    id: 'escalations',
    name: 'Tier-2 Critical Incident Escalations & SLA Triage',
    category: 'Customer Support & B2B Telecommunications',
    description: 'Intercepts complex multi-channel client escalation threads, log dumps, and SLA breach notices. Categorizes root fault, computes SLA penalty risk, and triggers legacy ServiceNow / Remedy tickets.',
    defaultManualMins: 45,
    defaultHourlyWage: 82,
    legacySystemName: 'BMC Remedy On-Premise 9.1 / Legacy Oracle Siebel CRM',
    expectedExtractionFields: ['Customer Organization', 'Account Tier', 'Impacted Service', 'Downtime Duration', 'SLA Breach Risk', 'Error Signature'],
    deterministicRules: [
      'Platinum Tier Auto-Escalation within 15 mins',
      'Financial Penalty Penalty Exposure > $25,000 flags VP on-call',
      'Severity-1 Core Gateway Outage triggers automated diagnostic ping',
      'No duplicate open incident with matching cluster fingerprint',
    ],
    sampleInput: `URGENT ESCALATION: SEVERITY-1 REPLICATION DESYNC
From: marcus.chen@fintechcore.global
To: tier2-escalations@enterprise-cloudops.net
Subject: [CRITICAL SLA NOTICE] Database Cluster EU-West-01 Desynchronization - Payment API Stalled
Client: FinTech Core Systems Ltd. (Enterprise Platinum Support SLA Tier)
Contract Ref: MSA-2023-PLAT-0091
Incident Timestamp: 2026-09-07 07:15:22 UTC (Ongoing - 14 minutes active)
Observed Behavior:
Our production payment gateway routing transactions through node 'db-cluster-eu-west-01' is experiencing replication lag spikes exceeding 4,800ms. 
Error dump: "ORA-12541: TNS:no listener / sync heartbeat timed out on secondary replica 10.142.12.98:1521".
SLA Threshold: Under Section 4.2 of Enterprise MSA, any unacknowledged outage over 30 minutes triggers automated credit penalties of $12,500/hour plus liquidation damages.
Estimated impact: 14,000 payment authorizations queued, 380 customer drop-offs registered.
Action Demanded: Immediate failover to standby replica and direct confirmation of incident ticket dispatch.`,
  },
  {
    id: 'custom',
    name: 'Custom Unstructured Document Sandbox',
    category: 'Enterprise Ad-hoc',
    description: 'Test any unstructured document, invoice, regulatory filing, or complex email thread against the multi-agent Raid Pod.',
    defaultManualMins: 30,
    defaultHourlyWage: 70,
    legacySystemName: 'Custom Enterprise Core System',
    expectedExtractionFields: ['Primary Entity', 'Key Reference ID', 'Actionable Value', 'Risk Assessment'],
    deterministicRules: [
      'Extraction Confidence Score >= 0.85',
      'Required Entity Fields Present',
      'No Sanction / Compliance Blacklist Matches',
    ],
    sampleInput: `INSPECTION & DISCREPANCY MEMORANDUM
Entity: Pacific Northwest Marine Logistics
Ref Number: DOC-90142-DISP
Date: September 5, 2026
Audit Findings: Vessel manifest indicates 450 metric tons of industrial bauxite cleared at terminal gate 4. Weight scale sensor reported 448.2 metric tons (0.4% discrepancy). Port authority fee of $3,180.00 invoiced to account #88192-A.
Verification Request: Authorize release and transfer voucher into warehouse management AS/400 ledger.`,
  },
];
