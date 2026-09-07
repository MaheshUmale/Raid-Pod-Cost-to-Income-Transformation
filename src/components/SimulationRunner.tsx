import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Terminal, 
  Activity, 
  BarChart2, 
  Sliders, 
  FileText,
  HelpCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { ScenarioTemplate, RaidPodExecutionResult, BatchSimulationResult } from '../types';

interface SimulationRunnerProps {
  scenario: ScenarioTemplate;
  lastExecution: RaidPodExecutionResult | null;
  isRunningSingle: boolean;
  onRunSingle: (customText?: string, forceException?: boolean) => void;
  batchResult: BatchSimulationResult | null;
  isRunningBatch: boolean;
  onRunBatch: (params: {
    batchSize: number;
    concurrency: number;
    legacyLatencyJitterMs: number;
    syntheticFailureRatePct: number;
  }) => void;
}

export const SimulationRunner: React.FC<SimulationRunnerProps> = ({
  scenario,
  lastExecution,
  isRunningSingle,
  onRunSingle,
  batchResult,
  isRunningBatch,
  onRunBatch,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const [inputText, setInputText] = useState<string>(scenario.sampleInput);
  const [forceException, setForceException] = useState<boolean>(false);

  // Update input text when scenario changes
  React.useEffect(() => {
    setInputText(scenario.sampleInput);
  }, [scenario]);

  // Batch simulation parameters
  const [batchSize, setBatchSize] = useState<number>(50);
  const [concurrency, setConcurrency] = useState<number>(5);
  const [legacyLatencyJitterMs, setLegacyLatencyJitterMs] = useState<number>(850);
  const [syntheticFailureRatePct, setSyntheticFailureRatePct] = useState<number>(12);

  const handleStartBatch = () => {
    onRunBatch({
      batchSize,
      concurrency,
      legacyLatencyJitterMs,
      syntheticFailureRatePct,
    });
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher: Single Live Execution vs Batch Bottleneck Tester */}
      <div className="bg-white border border-stone-200 rounded-xl p-2 shadow-xs flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            id="tab-single-sim"
            onClick={() => setActiveTab('single')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'single'
                ? 'bg-stone-900 text-stone-100 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-amber-400" />
            Single Transaction Interactive Test Bench
          </button>
          <button
            id="tab-batch-sim"
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'batch'
                ? 'bg-stone-900 text-stone-100 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            Batch Workload & Bottleneck Stress-Testing
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-stone-500 font-mono pr-2">
          <span>Target System:</span>
          <span className="text-stone-800 font-semibold">{scenario.legacySystemName}</span>
        </div>
      </div>

      {activeTab === 'single' ? (
        /* SINGLE TRANSACTION INTERACTIVE TEST BENCH */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input Document & Configuration */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-stone-700" />
                  <h3 className="text-sm font-bold text-stone-900">
                    Incoming Unstructured Payload
                  </h3>
                </div>
                <button
                  onClick={() => setInputText(scenario.sampleInput)}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-mono"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Sample
                </button>
              </div>

              <p className="text-xs text-stone-500 mb-2">
                Simulates raw emails, OCR scans, PDFs, or unstructured customer claims intercepted by the Raid Pod.
              </p>

              <textarea
                id="unstructured-input-textarea"
                rows={12}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-3 text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white resize-y"
                placeholder="Paste or type raw unstructured text here..."
              />

              {/* Execution Controls */}
              <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center space-x-2 cursor-pointer text-xs text-stone-700 select-none">
                  <input
                    type="checkbox"
                    checked={forceException}
                    onChange={(e) => setForceException(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Simulate Rule Violation / Policy Limit Breach
                  </span>
                </label>

                <button
                  id="btn-execute-raid-pod"
                  disabled={isRunningSingle}
                  onClick={() => onRunSingle(inputText, forceException)}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
                >
                  {isRunningSingle ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      Raid Pod Intercepting & Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      Execute Raid Pod Pipeline
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Deterministic Business Rule Checklist */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Active Deterministic Rule Gate for {scenario.name}
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-600">
                {scenario.deterministicRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Live Multi-Agent Execution Results */}
          <div className="lg:col-span-6 space-y-4">
            {lastExecution ? (
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-5">
                {/* Result Header & Status */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-stone-500">
                        {lastExecution.id}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-mono font-semibold flex items-center gap-1 ${
                          lastExecution.hasException
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {lastExecution.hasException ? (
                          <>
                            <AlertTriangle className="w-3 h-3 text-amber-700" />
                            EXCEPTION DIVERTED TO HITL
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            STP SUCCESS → LEGACY COMMITTED
                          </>
                        )}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-stone-900 mt-1">
                      {lastExecution.classification}
                    </h3>
                  </div>

                  <div className="text-right font-mono text-xs">
                    <span className="text-stone-400 block text-[10px]">TOTAL CYCLE</span>
                    <span className="text-stone-900 font-bold text-sm">
                      {lastExecution.aiDurationMs} ms
                    </span>
                  </div>
                </div>

                {/* Agent Latency Breakdown Waterfall */}
                <div>
                  <h4 className="text-xs font-semibold text-stone-700 mb-2">
                    Multi-Agent Pipeline Latency
                  </h4>
                  <div className="space-y-2">
                    {lastExecution.stepBreakdown.map((step, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-stone-700">{step.name}</span>
                          <span className="text-stone-500">{step.durationMs}ms</span>
                        </div>
                        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              step.status === 'exception'
                                ? 'bg-amber-500'
                                : step.status === 'diverted'
                                ? 'bg-stone-300'
                                : 'bg-stone-800'
                            }`}
                            style={{
                              width: `${Math.min(100, Math.max(10, (step.durationMs / lastExecution.aiDurationMs) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unit Economics Snapshot for This Run */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200 text-center font-mono">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Token Burn</span>
                    <span className="text-xs font-bold text-amber-600">
                      {lastExecution.totalTokens} tokens
                    </span>
                    <span className="text-[9px] text-stone-400 block">
                      ${lastExecution.totalAiCost.toFixed(4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Manual Baseline</span>
                    <span className="text-xs font-bold text-stone-700">
                      ${lastExecution.manualCost.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-stone-400 block">
                      {lastExecution.manualLaborMins} mins
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 block font-medium">Net Saved</span>
                    <span className="text-xs font-bold text-emerald-600">
                      +${lastExecution.netSavings.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-emerald-800 block">
                      {lastExecution.roiPercentage}% ROI
                    </span>
                  </div>
                </div>

                {/* Extracted Structured JSON Entities */}
                <div>
                  <h4 className="text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                    <span>Extracted Business Entities (Zero Hallucination)</span>
                    <span className="text-[10px] font-mono text-stone-500">
                      Confidence: {(lastExecution.confidenceScore * 100).toFixed(1)}%
                    </span>
                  </h4>
                  <div className="bg-stone-900 rounded-lg p-3 text-[11px] font-mono text-stone-200 overflow-x-auto max-h-48 border border-stone-800">
                    <pre>{JSON.stringify(lastExecution.extractedData, null, 2)}</pre>
                  </div>
                </div>

                {/* Legacy Execution or Exception Log */}
                <div className="p-3.5 rounded-lg border bg-stone-900 text-stone-100 font-mono text-xs space-y-2 border-stone-800">
                  <div className="flex items-center justify-between text-stone-400 text-[11px] pb-1 border-b border-stone-800">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-amber-400" />
                      Legacy Terminal Adapter Action
                    </span>
                    <span>{lastExecution.legacyExecutionOutput.route}</span>
                  </div>

                  {lastExecution.hasException ? (
                    <div className="space-y-1.5 text-amber-300">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        {lastExecution.legacyExecutionOutput.reason}
                      </div>
                      <p className="text-[11px] text-stone-300">
                        {lastExecution.legacyExecutionOutput.humanTriagePayload?.suggestedAction}
                      </p>
                      <div className="text-[10px] text-stone-400 pt-1">
                        Assigned: {lastExecution.legacyExecutionOutput.humanTriagePayload?.assignedRole} | SLA: {lastExecution.legacyExecutionOutput.humanTriagePayload?.slaCountdownMins}m
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-emerald-400">
                      <div className="text-[11px] font-bold">
                        Host System Ack: {lastExecution.legacyExecutionOutput.transactionRef}
                      </div>
                      <ul className="text-[10px] text-stone-300 space-y-0.5">
                        {lastExecution.legacyExecutionOutput.stepsExecuted?.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-stone-50 border border-dashed border-stone-300 rounded-xl p-12 text-center text-stone-500 space-y-3">
                <Cpu className="w-8 h-8 text-stone-400 mx-auto" />
                <h3 className="text-sm font-bold text-stone-800">
                  No Execution Trace Yet
                </h3>
                <p className="text-xs max-w-sm mx-auto">
                  Click "Execute Raid Pod Pipeline" to intercept and process the unstructured payload across all deterministic agent stages.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* BATCH WORKLOAD & BOTTLENECK STRESS-TESTING */
        <div className="space-y-6">
          {/* Controls Bar for Batch Simulation */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-200 mb-4 gap-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 tracking-tight">
                  Performance & Bottleneck Stress-Testing Simulator
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Simulate peak workload batches before production deployment to detect latency cliffs, queue backpressure, and legacy system locking.
                </p>
              </div>

              <button
                id="btn-run-batch-sim"
                disabled={isRunningBatch}
                onClick={handleStartBatch}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
              >
                {isRunningBatch ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                    Simulating Workload...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                    Run Batch Stress Test ({batchSize} Transactions)
                  </>
                )}
              </button>
            </div>

            {/* Slider Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-stone-700">
                  <span>Batch Volume</span>
                  <span className="font-mono font-bold text-stone-900">{batchSize} tx</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="10"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-stone-700">
                  <span>Parallel Agent Concurrency</span>
                  <span className="font-mono font-bold text-stone-900">{concurrency} workers</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={concurrency}
                  onChange={(e) => setConcurrency(Number(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-stone-700">
                  <span>Legacy Terminal Jitter</span>
                  <span className="font-mono font-bold text-stone-900">{legacyLatencyJitterMs} ms</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={legacyLatencyJitterMs}
                  onChange={(e) => setLegacyLatencyJitterMs(Number(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-stone-700">
                  <span>Synthetic Failure Rate</span>
                  <span className="font-mono font-bold text-amber-700">{syntheticFailureRatePct}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="2"
                  value={syntheticFailureRatePct}
                  onChange={(e) => setSyntheticFailureRatePct(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Batch Results Overview & Bottleneck Diagnostic Banner */}
          {batchResult && (
            <div className="space-y-5">
              {/* Automated Bottleneck Diagnostic Recommendation Banner */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 shadow-xs">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900">
                        AUTOMATED BOTTLENECK ANALYSIS
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-200 text-amber-900 font-semibold">
                        {batchResult.primaryBottleneck}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-amber-950 mt-1">
                      {batchResult.primaryBottleneck.includes('Legacy')
                        ? 'Legacy System Terminal Locking represents the predominant latency sink.'
                        : 'Semantic Extraction token inference accounts for the primary latency contributor.'}
                    </p>
                    <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                      <strong>Architectural Recommendation:</strong>{' '}
                      {batchResult.primaryBottleneck.includes('Legacy')
                        ? 'Scale headless browser / 3270 terminal session pools from 5 to 16 workers, or introduce an asynchronous Redis stream queue to buffer burst arrivals without waiting synchronously on legacy host database locks.'
                        : 'Utilize Gemini 2.5 Flash with responseSchema caching and batch prompt embeddings to reduce semantic extraction latency down to <400ms.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* High-Level Batch Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                  <span className="text-xs text-stone-500 block">Avg Transaction Latency</span>
                  <span className="text-xl font-bold text-stone-900 font-mono">
                    {batchResult.avgLatencyMs} ms
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    Range: {batchResult.minLatencyMs}ms - {batchResult.maxLatencyMs}ms
                  </span>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                  <span className="text-xs text-stone-500 block">Throughput Rate</span>
                  <span className="text-xl font-bold text-stone-900 font-mono">
                    {batchResult.throughputTxPerSec} tx/s
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    At {batchResult.concurrency} concurrent workers
                  </span>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                  <span className="text-xs text-stone-500 block">STP Success Rate</span>
                  <span className="text-xl font-bold text-emerald-600 font-mono">
                    {batchResult.stpRatePct}%
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    {batchResult.totalExceptions} exceptions diverted
                  </span>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                  <span className="text-xs text-stone-500 block">Total OpEx Reclaimed</span>
                  <span className="text-xl font-bold text-emerald-600 font-mono">
                    +${batchResult.totalSaved.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    On {batchResult.batchSize} simulated transactions
                  </span>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                  <span className="text-xs text-stone-500 block">Token Consumption</span>
                  <span className="text-xl font-bold text-amber-600 font-mono">
                    {batchResult.totalTokens.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    Cost: ${(batchResult.totalTokens * 0.00000035).toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Latency Waterfall Breakdown per Node */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                <h4 className="text-xs font-bold text-stone-900 mb-3 uppercase tracking-wider">
                  Pipeline Stage Latency Waterfall & Share
                </h4>
                <div className="space-y-3">
                  {batchResult.nodeBreakdown.map((node, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-stone-700 font-medium">{node.name}</span>
                        <span className="text-stone-500">
                          {node.avgMs} ms ({node.pct}% of total latency)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-stone-100 rounded-md overflow-hidden flex">
                        <div
                          className={`h-full ${
                            node.name.includes('Legacy')
                              ? 'bg-amber-600'
                              : node.name.includes('Semantic')
                              ? 'bg-stone-800'
                              : 'bg-stone-500'
                          }`}
                          style={{ width: `${node.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Transaction Stream Table */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                <h4 className="text-xs font-bold text-stone-900 mb-3">
                  Live Transaction Run Stream (Sample of {batchResult.sampleTransactions.length})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500">
                        <th className="pb-2">TX ID</th>
                        <th className="pb-2">STATUS</th>
                        <th className="pb-2">LATENCY</th>
                        <th className="pb-2">TOKENS</th>
                        <th className="pb-2">SAVED OPEX</th>
                        <th className="pb-2">BOTTLENECK STAGE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      {batchResult.sampleTransactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-stone-50">
                          <td className="py-2.5 font-bold">{tx.id}</td>
                          <td className="py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                tx.status === 'SUCCESS_STP'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-2.5">{tx.durationMs} ms</td>
                          <td className="py-2.5 text-stone-500">{tx.tokens}</td>
                          <td className="py-2.5 text-emerald-600 font-semibold">
                            +${tx.savedAmount.toFixed(2)}
                          </td>
                          <td className="py-2.5 text-stone-500">{tx.bottleneckStage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
