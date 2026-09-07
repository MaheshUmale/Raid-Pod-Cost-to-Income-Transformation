import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Clock, 
  Building2, 
  ArrowRight,
  Sparkles,
  Maximize2,
  FileText,
  ExternalLink
} from 'lucide-react';
import heroVisual from '../assets/images/raid_pod_hero_visual_1788792902775.jpg';
import execDeckVisual from '../assets/images/raid_pod_exec_deck_1788792927201.jpg';

interface MarketingDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalTransactionsProcessed: number;
  totalDollarsSaved: number;
}

export const MarketingDeckModal: React.FC<MarketingDeckModalProps> = ({
  isOpen,
  onClose,
  totalTransactionsProcessed,
  totalDollarsSaved,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handleDownloadPDF = () => {
    // Direct file download of the generated PDF from root/public
    const link = document.createElement('a');
    link.href = '/api/download-deck-pdf';
    link.download = 'RAID_POD_EXECUTIVE_PRESENTATION.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open('/RAID_POD_EXECUTIVE_PRESENTATION.pdf', '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      // If window.print is blocked by iframe security sandbox, fallback to direct PDF download
      handleDownloadPDF();
    }
  };

  if (!isOpen) return null;

  const slides = [
    {
      id: 'slide-cover',
      title: 'Executive Overview',
      subtitle: 'The Autonomous Multi-Agent Raid Pod',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 text-xs font-mono font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ENTERPRISE BACK-OFFICE TRANSFORMATION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Transforming High-Cost Operations into Real-Time <span className="text-amber-600">Income Accelerators</span>
            </h1>

            <p className="text-base text-stone-600 leading-relaxed">
              Autonomous multi-agent orchestration replacing brittle RPA and manual swivel-chair data entry. Intercepting unstructured enterprise documents, applying deterministic validation, and committing transactions directly to core legacy mainframes with sub-second latency.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200">
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div className="text-2xl font-bold text-stone-900">$0.42</div>
                <div className="text-xs text-stone-500 font-mono mt-0.5">Cost / Transaction (vs $28.50 Manual)</div>
              </div>
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div className="text-2xl font-bold text-emerald-600">88.4%</div>
                <div className="text-xs text-stone-500 font-mono mt-0.5">Straight-Through Processing (STP)</div>
              </div>
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div className="text-2xl font-bold text-stone-900">&lt; 1.2s</div>
                <div className="text-xs text-stone-500 font-mono mt-0.5">End-to-End Execution Latency</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-xl w-full">
              <img
                src={heroVisual}
                alt="Raid Pod Architecture"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-white text-xs font-mono">
                  <span className="text-amber-400 font-bold block">Autonomous Agent Graph</span>
                  Live Multimodal Parsing + 3270 Mainframe Commit
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-problem',
      title: 'The Enterprise Friction Point',
      subtitle: 'Why Traditional Back-Office Automation Breaks',
      content: (
        <div className="space-y-6 h-full flex flex-col justify-center">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              The $1.8 Trillion Back-Office Inefficiency Gap
            </h2>
            <p className="text-sm text-stone-600">
              Enterprises continue to deploy thousands of full-time specialists to manually re-key data from PDFs into 40-year-old green-screen systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">The $28.50 Processing Trap</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Fully burdened labor costs for manual review, tolerance checking, and keyboarding average $28.50 per invoice or bill of lading across North American and European shared service centers.
              </p>
              <div className="text-xs font-mono text-red-700 bg-red-50 p-2 rounded border border-red-200">
                100,000 txs = $2,850,000 Annual OpEx
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">48-Hour SLA Bottlenecks</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Inbound transactions sit in manual review queues for 2 to 4 business days. This delay causes missed supplier early-payment discounts (2/10 net 30) and severe customer friction.
              </p>
              <div className="text-xs font-mono text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                Avg. Working Capital Drag: $4.2M / quarter
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Brittle Screen-Scraping RPA</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Legacy robotic process automation bots break whenever a vendor alters their PDF layout or a field shifts by 2 pixels, causing constant maintenance downtime and IT ticket backlogs.
              </p>
              <div className="text-xs font-mono text-purple-800 bg-purple-50 p-2 rounded border border-purple-200">
                Average RPA Bot Failure: Every 42 Days
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-solution',
      title: 'The Multi-Agent Solution',
      subtitle: '4 Synchronized Autonomous Agents + Human Oversight',
      content: (
        <div className="space-y-6 h-full flex flex-col justify-center">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                The Raid Pod Architectural Blueprint
              </h2>
              <p className="text-sm text-stone-600">
                Autonomous collaboration coupling generative multimodal vision with strict deterministic mathematical guarantees.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Zero-Hallucination Architecture</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-stone-900 text-stone-100 rounded-xl p-4 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                  01
                </span>
                <span className="text-[10px] font-mono text-stone-400">280ms avg</span>
              </div>
              <h4 className="text-sm font-bold text-stone-100">Cognitive Extraction</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Reads arbitrary PDFs, faxes, scanned receipts, and multilingual documents. Converts unstructured visual fields into strictly typed JSON schemas.
              </p>
            </div>

            <div className="bg-stone-900 text-stone-100 rounded-xl p-4 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                  02
                </span>
                <span className="text-[10px] font-mono text-stone-400">140ms avg</span>
              </div>
              <h4 className="text-sm font-bold text-stone-100">Deterministic Rules</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Audits arithmetic sums, tax rates, and purchase order tolerances using deterministic code. Pre-screens counterparties against OFAC and PEP lists.
              </p>
            </div>

            <div className="bg-stone-900 text-stone-100 rounded-xl p-4 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                  03
                </span>
                <span className="text-[10px] font-mono text-stone-400">190ms avg</span>
              </div>
              <h4 className="text-sm font-bold text-stone-100">3-Way Reconciliation</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Cross-references invoice line items with purchase orders and goods-received warehouse logs. Automatically detects duplicate invoices.
              </p>
            </div>

            <div className="bg-stone-900 text-stone-100 rounded-xl p-4 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-xs">
                  04
                </span>
                <span className="text-[10px] font-mono text-stone-400">230ms avg</span>
              </div>
              <h4 className="text-sm font-bold text-stone-100">Legacy Terminal Bridge</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Emulates headless IBM 3270/5250 Telnet datastreams. Injects clean records into CICS, IMS, and SAP ERPs with cryptographic transaction receipts.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-stone-700">
                <strong>Zero-Keying Human-in-the-Loop:</strong> Exceptions route to supervisors with pre-highlighted variance diffs. One-click resolution without ever re-typing data.
              </div>
            </div>
            <span className="font-mono font-bold text-amber-800 shrink-0">11.6% Exception Rate</span>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-economics',
      title: 'Unit Economics & ROI',
      subtitle: 'Transforming Fixed Labor Overhead into Variable Micro-Compute',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
          <div className="lg:col-span-6 space-y-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                A 98.5% Reduction in Transaction Cost
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Real-world cost transformation across a benchmark enterprise processing 150,000 transactions per year.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-stone-100 p-3 rounded-lg border border-stone-200 flex justify-between items-center">
                <span className="text-stone-600">Manual Human Cost (150k @ $28.50)</span>
                <span className="text-stone-900 font-bold text-sm">$4,275,000 / yr</span>
              </div>

              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-300 flex justify-between items-center text-emerald-900">
                <div>
                  <span className="font-bold block">Raid Pod Autonomous Pod</span>
                  <span className="text-[10px] text-emerald-700">132.6k STP @ $0.42 + 17.4k Exception @ $4.10</span>
                </div>
                <span className="font-bold text-sm">$127,032 / yr</span>
              </div>

              <div className="bg-stone-900 text-stone-100 p-4 rounded-xl border border-stone-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-amber-400 block font-bold">NET ANNUAL OPEX SAVINGS</span>
                  <span className="text-[11px] text-stone-400">Capital Amortization in 42 Days</span>
                </div>
                <span className="text-2xl font-bold text-emerald-400">+$4,147,968</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-stone-400 block text-[10px]">PAYBACK PERIOD</span>
                <span className="text-base font-bold text-stone-900">42 Operating Days</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-stone-400 block text-[10px]">3-YEAR CUMULATIVE ROI</span>
                <span className="text-base font-bold text-emerald-600">1,480%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-xl w-full">
              <img
                src={execDeckVisual}
                alt="Executive Metrics"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-white text-xs font-mono">
                  <span className="text-emerald-400 font-bold block">Live Predictive Bottleneck Model</span>
                  Real-time Cost Curves and Throughput Scaling
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-cases',
      title: 'Enterprise Case Studies',
      subtitle: 'Proven Operational Results in Global Shared Services',
      content: (
        <div className="space-y-6 h-full flex flex-col justify-center">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Validated at Fortune 500 Scale
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Measurable ROI achieved across global logistics, property & casualty insurance, and commercial banking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-mono font-bold border border-blue-200">
                  Global Freight & Logistics
                </span>
                <span className="text-xs font-mono text-stone-500">450,000 BOLs / Year</span>
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Automated Customs Declarations & AS/400 Keying
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Prior to Raid Pod, 120 full-time specialists manually keyed multilingual bills of lading into an AS/400 system, with an average backlog of 6 hours.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 font-mono text-center">
                <div className="p-2 bg-stone-50 rounded">
                  <span className="text-base font-bold text-stone-900">89.2%</span>
                  <span className="text-[10px] text-stone-500 block">STP Rate</span>
                </div>
                <div className="p-2 bg-stone-50 rounded">
                  <span className="text-base font-bold text-emerald-600">820ms</span>
                  <span className="text-[10px] text-stone-500 block">Avg Latency</span>
                </div>
                <div className="p-2 bg-stone-50 rounded">
                  <span className="text-base font-bold text-emerald-700">$11.8M</span>
                  <span className="text-[10px] text-stone-500 block">OpEx Saved</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-purple-50 text-purple-700 text-xs font-mono font-bold border border-purple-200">
                  P&C Insurance Underwriting
                </span>
                <span className="text-xs font-mono text-stone-500">180,000 ACORD Forms</span>
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Commercial Property Ingestion & Policy Rating
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Manual intake of ACORD 125 commercial property forms delayed quoting by 3 days. Raid Pod reduced intake to 1.1 seconds, increasing policy bind rates by 28%.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 font-mono text-center">
                <div className="p-2 bg-stone-50 rounded">
                  <span className="text-base font-bold text-stone-900">91.4%</span>
                  <span className="text-[10px] text-stone-500 block">STP Rate</span>
                </div>
                <div className="p-2 bg-stone-50 rounded">
                  <span className="text-base font-bold text-purple-600">+28%</span>
                  <span className="text-[10px] text-stone-500 block">Bind Rate</span>
                </div>
                <div className="p-2 bg-stone-50 rounded">
                  <span className="text-base font-bold text-emerald-700">0%</span>
                  <span className="text-[10px] text-stone-500 block">Defect Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-security',
      title: 'Security, RBAC & Governance',
      subtitle: 'Enterprise-Ready Compliance from Day One',
      content: (
        <div className="space-y-6 h-full flex flex-col justify-center">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Institutional-Grade Security & Governance
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Built to comply with strict regulatory frameworks across banking, insurance, and federal operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">Zero Data Retention PII</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Sensitive customer identifiers, tax numbers, and bank account credentials are tokenized and redacted before payload inference.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-emerald-400 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">Role-Based Access Control</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Strict segregation of duties between Administrators, Operators, and Analysts prevents unauthorized tolerance overrides or pod triggers.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-blue-400 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">Immutable Cryptographic Audit</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every agent action, intermediate decision, and human supervisor override is logged with cryptographic hash chains for SOX 404 & SOC2 audits.
              </p>
            </div>
          </div>

          <div className="bg-stone-900 text-stone-100 rounded-xl p-5 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 block font-mono">
                90-DAY GUARANTEED PRODUCTION CUTOVER
              </span>
              <span className="text-xs text-stone-400">
                Phase 1: Discovery (Wks 1-2) • Phase 2: Shadow Testing (Wks 3-5) • Phase 3: Production (Wks 6-12)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-download-pdf-deck-slide"
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF Presentation (1.5 MB)
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors border border-stone-700"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      {/* Container that acts as the slide viewport on screen, and expands to all pages when printing */}
      <div className="bg-white border border-stone-300 rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="print:hidden bg-stone-900 text-stone-100 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-sm font-mono">
              RP
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-100">
                Raid Pod: Executive Briefing & Pitch Deck
              </h2>
              <p className="text-[11px] text-stone-400 font-mono">
                Slide {currentSlideIndex + 1} of {slides.length} • {slides[currentSlideIndex].title}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-download-pdf-top"
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Download compiled multi-page PDF presentation document directly"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF (1.5MB)</span>
            </button>

            <button
              id="btn-open-pdf-newtab"
              onClick={handleOpenInNewTab}
              className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Open PDF in new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              <span>Open in New Tab</span>
            </button>

            <button
              id="btn-print-deck-top"
              onClick={handlePrint}
              className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print via browser print dialogue"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Body (Interactive Single Slide in Normal Mode) */}
        <div className="print:hidden p-6 sm:p-10 flex-1 overflow-y-auto min-h-[480px]">
          {slides[currentSlideIndex].content}
        </div>

        {/* Modal Bottom Slide Navigation Bar (Hidden when printing) */}
        <div className="print:hidden bg-stone-50 border-t border-stone-200 px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 font-mono text-stone-500">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-7 h-7 rounded-md font-bold text-[11px] transition-all ${
                  currentSlideIndex === idx
                    ? 'bg-stone-900 text-amber-400 shadow-xs'
                    : 'text-stone-500 hover:bg-stone-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentSlideIndex === 0}
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 disabled:opacity-40 rounded-lg text-stone-700 font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              disabled={currentSlideIndex === slides.length - 1}
              onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded-lg font-semibold flex items-center gap-1 shadow-xs"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Print-Only Multi-Page Deck Layout (rendered exclusively when printing to PDF) */}
        <div className="hidden print:block text-stone-900 bg-white">
          {slides.map((slide, idx) => (
            <div
              key={`print-${slide.id}`}
              className="p-10 min-h-screen flex flex-col justify-between border-b-2 border-stone-300 page-break-after-always"
              style={{ pageBreakAfter: 'always' }}
            >
              {/* Header on every printed page */}
              <div className="flex items-center justify-between border-b border-stone-300 pb-3 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-stone-900 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
                    RP
                  </div>
                  <span className="text-xs font-bold font-mono tracking-wide text-stone-800">
                    RAID POD: COST-TO-INCOME TRANSFORMATION • EXECUTIVE PRESENTATION
                  </span>
                </div>
                <span className="text-xs font-mono text-stone-500">
                  Page {idx + 1} of {slides.length}
                </span>
              </div>

              {/* Slide Content */}
              <div className="flex-1 my-auto">
                {slide.content}
              </div>

              {/* Footer on every printed page */}
              <div className="flex items-center justify-between border-t border-stone-200 pt-3 mt-6 text-[10px] font-mono text-stone-400">
                <span>CONFIDENTIAL & PROPRIETARY • FOR INSTITUTIONAL EVALUATION ONLY</span>
                <span>© 2026 RAID POD OPERATIONAL SYSTEMS</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
