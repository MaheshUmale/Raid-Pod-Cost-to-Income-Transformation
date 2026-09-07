import React, { useState } from 'react';
import { 
  FileText, 
  BrainCircuit, 
  ShieldAlert, 
  Terminal, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Info, 
  Layers, 
  RefreshCw,
  Play,
  Cpu,
  Lock,
  ExternalLink
} from 'lucide-react';
import { AgentNode, RaidPodExecutionResult, UserProfile, ExceptionStrategyType } from '../types';
import { ExceptionSubProcessesView } from './ExceptionSubProcessesView';

interface AgentGraphProps {
  lastExecution: RaidPodExecutionResult | null;
  isRunning: boolean;
  onRunTestExecution: (forceException: boolean) => void;
  onOpenExceptionQueue: () => void;
  currentUser: UserProfile;
}

export const AgentGraph: React.FC<AgentGraphProps> = ({
  lastExecution,
  isRunning,
  onRunTestExecution,
  onOpenExceptionQueue,
  currentUser,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-extraction');
  const [graphMode, setGraphMode] = useState<'dag' | 'exception_strategies'>('dag');
  const [permissionAlert, setPermissionAlert] = useState<string | null>(null);

  const canRunLive = currentUser.role === 'Administrator' || currentUser.role === 'Operator';

  const handleRunClick = (forceException: boolean) => {
    if (!canRunLive) {
      setPermissionAlert(
        `Access Restricted: The "${currentUser.role}" role has simulation & reporting privileges. Switch to "Administrator" or "Operator" in the top bar to trigger live pod injections.`
      );
      setTimeout(() => setPermissionAlert(null), 5000);
      return;
    }
    onRunTestExecution(forceException);
  };

  const handleSimulateRetry = async (params: {
    strategyType: ExceptionStrategyType;
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
    jitterFactor: number;
    circuitBreakerThreshold: number;
  }) => {
    const response = await fetch('/api/simulate-retry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  };

  // Define the multi-agent nodes in the Raid Pod
  const nodes: AgentNode[] = [
    {
      id: 'node-ingestion',
      name: 'Ingestion & Quarantine Agent',
      role: 'Zero-Trust Payload Interceptor',
      type: 'ingestion',
      description: 'Intercepts incoming emails, PDFs, OCR scans, and webhook payloads. Enforces cryptographic checksums, strips malicious embedded objects, and executes automated PII/PCI tokenization.',
      technology: 'Streaming Ingest Gateway + PII Tokenizer',
      avgLatencyMs: 140,
      status: isRunning ? 'running' : lastExecution ? 'completed' : 'idle',
    },
    {
      id: 'node-extraction',
      name: 'Classification & Extraction Agent',
      role: 'Semantic AI Entity Parser',
      type: 'extraction',
      description: 'Leverages Gemini 2.5 Flash with structured JSON schemas to classify document sub-categories, extract critical business entities, and score extraction confidence.',
      technology: 'Gemini 2.5 Flash / Multi-Modal LLM',
      avgLatencyMs: 680,
      status: isRunning ? 'running' : lastExecution ? 'completed' : 'idle',
    },
    {
      id: 'node-rules',
      name: 'Deterministic Rules & Audit Engine',
      role: 'Rigid Mathematical & Policy Filter',
      type: 'rules',
      description: 'Applies deterministic validation rules: policy caps, 3-way ledger balancing, ISO checksums, and fraud anomaly detection without relying on generative approximations.',
      technology: 'Deterministic Rule Matrix + Arithmetic Validator',
      avgLatencyMs: 160,
      status: isRunning 
        ? 'running' 
        : lastExecution?.hasException 
          ? 'exception' 
          : lastExecution 
            ? 'completed' 
            : 'idle',
    },
    {
      id: 'node-legacy',
      name: 'Legacy Robotic Dispatch Agent',
      role: 'Zero-Code Core Bridge',
      type: 'legacy_connector',
      description: 'Interfaces directly with legacy core software (AS/400 3270, SAP ECC 6.0, Siebel, Guidewire) via headless browser or terminal emulator without altering a single line of legacy code.',
      technology: 'Headless Browser Automation + Virtual 3270/RFC Terminal Client',
      avgLatencyMs: 820,
      status: isRunning 
        ? 'running' 
        : lastExecution?.hasException 
          ? 'diverted' 
          : lastExecution 
            ? 'completed' 
            : 'idle',
    },
    {
      id: 'node-exception',
      name: 'Automated Exception Triage Agent',
      role: 'Human-in-the-Loop Smart Router',
      type: 'exception_route',
      isExceptionRoute: true,
      description: 'Triggered when confidence < 0.85 or a deterministic rule breaches tolerance. Synthesizes a structured incident packet, highlights exact variance, and routes to senior supervisor queue with SLA timer.',
      technology: 'Smart Exception Packager + HITL Escalation Queue',
      avgLatencyMs: 95,
      status: isRunning 
        ? 'idle' 
        : lastExecution?.hasException 
          ? 'completed' 
          : 'idle',
    },
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[1];

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              Targeted Multi-Agent "Raid Pod" Graph
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-stone-100 text-stone-700 border border-stone-300">
              Deterministic DAG v2.4
            </span>
          </div>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Intercepts raw unstructured enterprise data, passes through deterministic checkpoints, and injects directly into legacy systems with automated exception-handling bypasses.
          </p>
        </div>

        {/* Live Execution Triggers */}
        <div className="flex items-center space-x-3">
          <button
            id="btn-run-pass"
            disabled={isRunning}
            onClick={() => handleRunClick(false)}
            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            )}
            Run Straight-Through (STP)
          </button>
          <button
            id="btn-run-exception"
            disabled={isRunning}
            onClick={() => handleRunClick(true)}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Inject Exception Route
          </button>
        </div>
      </div>

      {/* Permission alert if role cannot run live pod */}
      {permissionAlert && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{permissionAlert}</span>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold bg-amber-200 px-2 py-0.5 rounded text-amber-900">
            RBAC Enforcement
          </span>
        </div>
      )}

      {/* Graph vs Exception Sub-Process Mode Switcher */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex items-center space-x-2">
          <button
            id="subtab-dag"
            onClick={() => setGraphMode('dag')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              graphMode === 'dag'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Global Orchestration DAG
          </button>
          <button
            id="subtab-exception-subprocesses"
            onClick={() => setGraphMode('exception_strategies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              graphMode === 'exception_strategies'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Advanced Exception Strategies & Retry Bench
          </button>
        </div>
        <span className="text-xs font-mono text-stone-500">
          {graphMode === 'dag' ? 'Stage-by-Stage Telemetry' : 'Sub-Process Retry Protocols'}
        </span>
      </div>

      {graphMode === 'exception_strategies' ? (
        <ExceptionSubProcessesView onSimulateRetry={handleSimulateRetry} />
      ) : (
        <>
          {/* Visual Multi-Agent Directed Acyclic Graph Canvas */}
          <div className="bg-stone-900 rounded-xl p-6 border border-stone-800 shadow-md relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-stone-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE ORCHESTRATION PIPELINE</span>
            </div>
            <div className="text-xs text-stone-400">
              Click any agent node to inspect schema, rule thresholds, and legacy connector
            </div>
          </div>

          {/* Graph Nodes Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
            {/* 1. Ingestion Agent */}
            <div
              onClick={() => setSelectedNodeId('node-ingestion')}
              className={`cursor-pointer rounded-lg p-4 border transition-all ${
                selectedNodeId === 'node-ingestion'
                  ? 'border-amber-400 bg-stone-800 shadow-lg ring-1 ring-amber-400/40'
                  : 'border-stone-800 bg-stone-800/70 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-stone-700/60 text-amber-400">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-stone-400">STAGE 01</span>
              </div>
              <h4 className="text-xs font-semibold text-stone-200">Ingestion & Quarantine</h4>
              <p className="text-[11px] text-stone-400 mt-1">
                Checksum, PII/PCI redaction, MIME sanitize.
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-stone-400 pt-2 border-t border-stone-700/50">
                <span>Avg: ~140ms</span>
                <span className="text-emerald-400">100% STP</span>
              </div>
            </div>

            {/* 2. Semantic Extraction Agent */}
            <div
              onClick={() => setSelectedNodeId('node-extraction')}
              className={`cursor-pointer rounded-lg p-4 border transition-all ${
                selectedNodeId === 'node-extraction'
                  ? 'border-amber-400 bg-stone-800 shadow-lg ring-1 ring-amber-400/40'
                  : 'border-stone-800 bg-stone-800/70 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-amber-500/20 text-amber-300">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-stone-400">STAGE 02</span>
              </div>
              <h4 className="text-xs font-semibold text-stone-200">Semantic Extraction</h4>
              <p className="text-[11px] text-stone-400 mt-1">
                Gemini 2.5 Flash JSON schema parser.
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-stone-400 pt-2 border-t border-stone-700/50">
                <span>Avg: ~680ms</span>
                <span className="text-amber-400">Confidence: 96%</span>
              </div>
            </div>

            {/* 3. Deterministic Rules Engine */}
            <div
              onClick={() => setSelectedNodeId('node-rules')}
              className={`cursor-pointer rounded-lg p-4 border transition-all ${
                selectedNodeId === 'node-rules'
                  ? 'border-amber-400 bg-stone-800 shadow-lg ring-1 ring-amber-400/40'
                  : 'border-stone-800 bg-stone-800/70 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-blue-500/20 text-blue-300">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-stone-400">STAGE 03</span>
              </div>
              <h4 className="text-xs font-semibold text-stone-200">Deterministic Rules</h4>
              <p className="text-[11px] text-stone-400 mt-1">
                Hard policy caps & arithmetic balance.
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-stone-400 pt-2 border-t border-stone-700/50">
                <span>Avg: ~160ms</span>
                <span className="text-blue-400">Tolerance 0.05%</span>
              </div>
            </div>

            {/* 4. Branching Outcome (Legacy vs Exception) */}
            <div className="space-y-3">
              {/* 4A: Normal Path to Legacy Systems */}
              <div
                onClick={() => setSelectedNodeId('node-legacy')}
                className={`cursor-pointer rounded-lg p-3 border transition-all ${
                  selectedNodeId === 'node-legacy'
                    ? 'border-emerald-400 bg-stone-800 shadow-md ring-1 ring-emerald-400/40'
                    : 'border-stone-800 bg-stone-800/70 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Legacy Dispatch (STP)</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    NORMAL ROUTE
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Zero-code headless browser / 3270 bridge
                </p>
              </div>

              {/* 4B: Automated Exception Route */}
              <div
                onClick={() => setSelectedNodeId('node-exception')}
                className={`cursor-pointer rounded-lg p-3 border transition-all ${
                  selectedNodeId === 'node-exception'
                    ? 'border-amber-400 bg-amber-950/40 shadow-md ring-1 ring-amber-400/50'
                    : 'border-amber-900/50 bg-stone-800/50 hover:border-amber-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-semibold">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Exception Triage Route</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    FAIL-SAFE
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Pre-filled supervisor packet + SLA timer
                </p>
              </div>
            </div>
          </div>

          {/* Conditional Decision Flow Diagram Legend */}
          <div className="mt-4 pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                Straight-Through Path (Confidence ≥ 85% & All Rules Valid)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                Automated Exception Branch (Policy breach or low OCR confidence)
              </span>
            </div>

            {lastExecution && (
              <div className="font-mono text-[11px] text-stone-300">
                Last Trace: <span className="text-amber-400 font-bold">{lastExecution.id}</span> — {lastExecution.aiDurationMs}ms total ({lastExecution.hasException ? 'Exception Route' : 'STP Success'})
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Node Inspector Drawer */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-200 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-stone-100 border border-stone-200 text-stone-800">
              <Layers className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-stone-900 text-base">{selectedNode.name}</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-stone-100 text-stone-700 border border-stone-300">
                  {selectedNode.role}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {selectedNode.technology} • Latency profile: ~{selectedNode.avgLatencyMs}ms
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {selectedNode.isExceptionRoute && (
              <button
                onClick={onOpenExceptionQueue}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Open Exception Triage Queue
              </button>
            )}
          </div>
        </div>

        {/* Detailed Node Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
          {/* Column 1: Core Responsibilities & Logic */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-stone-500" />
              Operational Mandate
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {selectedNode.description}
            </p>
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1.5 font-mono">
              <div className="text-stone-500">Security / Governance:</div>
              <div className="text-stone-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Air-gapped execution sandbox
              </div>
              <div className="text-stone-800 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                Full telemetry audit hashing
              </div>
            </div>
          </div>

          {/* Column 2: Inbound / Outbound Data Contracts */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-stone-500" />
              Input / Output Schema
            </h4>
            <div className="bg-stone-900 rounded-lg p-3 text-[11px] font-mono text-stone-300 overflow-x-auto max-h-40 border border-stone-800">
              {selectedNode.id === 'node-ingestion' && (
                <pre>{`// Input: raw multipart or webhook
{
  "source": "email_attachment.pdf",
  "sanitizedPayload": "raw_text_stream",
  "sha256": "8f3b2...a901",
  "piiMasked": true
}`}</pre>
              )}
              {selectedNode.id === 'node-extraction' && (
                <pre>{`// Output: Typed JSON Entities
{
  "classification": "Auto_FNOL_Claim",
  "confidenceScore": 0.96,
  "entities": {
    "claimNumber": "CLM-9841",
    "amount": 6420.00,
    "vin": "1FTFW1ED..."
  }
}`}</pre>
              )}
              {selectedNode.id === 'node-rules' && (
                <pre>{`// Deterministic Evaluation
{
  "policyCoverageActive": true,
  "stpAuthorityLimit": 10000.00,
  "passedRulesCount": 4,
  "exceptionTriggered": false
}`}</pre>
              )}
              {selectedNode.id === 'node-legacy' && (
                <pre>{`// Zero-Code Legacy Automation
{
  "adapter": "Virtual_3270_Terminal",
  "command": "PUT_SCREEN_BUFFER",
  "terminalCoordinates": [12, 4],
  "commitStatus": "ACK_RECEIVED"
}`}</pre>
              )}
              {selectedNode.id === 'node-exception' && (
                <pre>{`// HITL Incident Package
{
  "escalationReason": "TOLERANCE_BREACH",
  "slaTimeRemaining": "45m",
  "preFilledFields": { ... },
  "suggestedRemedy": "Approve override"
}`}</pre>
              )}
            </div>
          </div>

          {/* Column 3: Fail-Safe & Zero-Code Mechanics */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-stone-500" />
              Zero-Code Bridge Protocol
            </h4>
            <div className="text-xs text-stone-600 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>No core code modification:</strong> Legacy systems remain completely untouched. The agent talks to the UI layer or legacy database read-only views.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Automated rollback:</strong> Any intermittent terminal lock or network stall triggers instant rollback and warm-handoff to operations.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
