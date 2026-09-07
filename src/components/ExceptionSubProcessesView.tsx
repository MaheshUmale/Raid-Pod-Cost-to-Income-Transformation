import React, { useState } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Play, 
  Sliders, 
  Layers, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ExceptionSubProcess, RetryAttempt, ExceptionStrategyType } from '../types';
import { EXCEPTION_SUBPROCESSES } from '../data/exceptionStrategies';

interface ExceptionSubProcessesViewProps {
  onSimulateRetry: (params: {
    strategyType: ExceptionStrategyType;
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
    jitterFactor: number;
    circuitBreakerThreshold: number;
  }) => Promise<any>;
}

export const ExceptionSubProcessesView: React.FC<ExceptionSubProcessesViewProps> = ({
  onSimulateRetry,
}) => {
  const [selectedStrategyId, setSelectedStrategyId] = useState<ExceptionStrategyType>('api_timeout');
  const [maxRetries, setMaxRetries] = useState<number>(3);
  const [baseDelayMs, setBaseDelayMs] = useState<number>(250);
  const [jitterFactor, setJitterFactor] = useState<number>(0.25);
  const [circuitBreakerThreshold, setCircuitBreakerThreshold] = useState<number>(3);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<{
    strategyType: string;
    attempts: RetryAttempt[];
    totalElapsedMs: number;
    circuitStatus: 'CLOSED' | 'HALF_OPEN' | 'OPEN';
    resolvedVia: string;
  } | null>(null);

  const selectedStrategy = EXCEPTION_SUBPROCESSES.find((s) => s.id === selectedStrategyId) || EXCEPTION_SUBPROCESSES[0];

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await onSimulateRetry({
        strategyType: selectedStrategyId,
        maxRetries,
        baseDelayMs,
        maxDelayMs: 2500,
        jitterFactor,
        circuitBreakerThreshold,
      });
      setSimulationResult(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Strategy Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {EXCEPTION_SUBPROCESSES.map((strategy) => {
          const isSelected = strategy.id === selectedStrategyId;
          return (
            <div
              key={strategy.id}
              onClick={() => {
                setSelectedStrategyId(strategy.id);
                setSimulationResult(null);
              }}
              className={`cursor-pointer rounded-xl p-4 border transition-all text-left ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/40 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-md bg-stone-100 text-stone-700">
                  {strategy.id === 'api_timeout' && <Cpu className="w-4 h-4 text-amber-600" />}
                  {strategy.id === 'malformed_data' && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                  {strategy.id === 'system_unavailability' && <Terminal className="w-4 h-4 text-red-600" />}
                  {strategy.id === 'policy_breach' && <ShieldAlert className="w-4 h-4 text-purple-600" />}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600 uppercase font-semibold">
                  {strategy.backoffStrategy.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-xs font-bold text-stone-900 leading-tight">
                {strategy.title}
              </h4>
              <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                {strategy.triggerEvent}
              </p>
              <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] font-mono text-stone-400">
                <span>Max Retries: {strategy.maxRetries}</span>
                <span className="text-stone-700 font-semibold">{strategy.slaMinutes}m SLA</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Sub-Process Breakdown & Interactive Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Step-by-Step Architectural Flowchart */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  SUB-PROCESS SPECIFICATION
                </span>
                <span className="text-xs font-mono text-stone-500">
                  Detection: ~{selectedStrategy.detectionLatencyMs}ms
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 mt-1">
                {selectedStrategy.title}
              </h3>
            </div>

            <div className="text-xs font-mono bg-stone-100 text-stone-700 px-2.5 py-1 rounded border border-stone-300">
              Strategy: <strong className="uppercase">{selectedStrategy.backoffStrategy}</strong>
            </div>
          </div>

          {/* Trigger Event Banner */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-800">Fault Detection Trigger: </span>
              <span className="text-stone-600">{selectedStrategy.triggerEvent}</span>
            </div>
          </div>

          {/* Step Sequence */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              Automated Remediation Sequence (Deterministic Protocol)
            </h4>
            <div className="space-y-2.5">
              {selectedStrategy.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-amber-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">{step.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-700 uppercase font-semibold">
                        {step.actionType}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal Fallback Protocol */}
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs">
            <span className="font-bold text-amber-900">Deterministic Fallback Protocol: </span>
            <span className="text-amber-800">{selectedStrategy.fallbackAction}</span>
          </div>
        </div>

        {/* Right 5 cols: Live Retry & Backoff Simulator Bench */}
        <div className="lg:col-span-5 bg-stone-900 text-stone-100 rounded-xl p-5 shadow-md flex flex-col justify-between space-y-5 border border-stone-800">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded bg-amber-500/20 text-amber-400">
                  <Sliders className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-stone-100">
                  Live Retry & Backoff Bench
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700">
                Formula Engine
              </span>
            </div>

            {/* Config Sliders */}
            <div className="mt-4 space-y-3 text-xs font-mono">
              <div>
                <div className="flex justify-between text-stone-400 mb-1">
                  <span>Max Retries:</span>
                  <span className="text-amber-400 font-bold">{maxRetries} attempts</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={maxRetries}
                  onChange={(e) => setMaxRetries(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-stone-800 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-stone-400 mb-1">
                  <span>Base Delay:</span>
                  <span className="text-amber-400 font-bold">{baseDelayMs} ms</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="50"
                  value={baseDelayMs}
                  onChange={(e) => setBaseDelayMs(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-stone-800 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-stone-400 mb-1">
                  <span>Jitter Factor:</span>
                  <span className="text-amber-400 font-bold">{(jitterFactor * 100).toFixed(0)}% full jitter</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={jitterFactor}
                  onChange={(e) => setJitterFactor(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-stone-800 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-stone-400 mb-1">
                  <span>Circuit Breaker Trip Threshold:</span>
                  <span className="text-amber-400 font-bold">{circuitBreakerThreshold} failures</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="5"
                  value={circuitBreakerThreshold}
                  onChange={(e) => setCircuitBreakerThreshold(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-stone-800 rounded"
                />
              </div>
            </div>

            {/* Run Trigger */}
            <div className="mt-4">
              <button
                id="btn-simulate-exception-retry"
                disabled={isSimulating}
                onClick={handleRunSimulation}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                {isSimulating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-stone-950" />
                )}
                Simulate Exception Backoff & Retry Sequence
              </button>
            </div>
          </div>

          {/* Simulation Output Trace */}
          <div className="space-y-2 border-t border-stone-800 pt-4 flex-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
              <span>RETRY EXECUTION TRACE</span>
              {simulationResult && (
                <span className="text-stone-300">
                  Total Elapsed: {simulationResult.totalElapsedMs}ms
                </span>
              )}
            </div>

            {!simulationResult ? (
              <div className="bg-stone-950/60 rounded-lg p-4 border border-stone-800 text-center text-stone-500 text-xs font-mono">
                Click &quot;Simulate Exception Backoff&quot; to test retry timings, jitter entropy, and circuit breaker transitions.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {simulationResult.attempts.map((att) => (
                  <div
                    key={att.attemptNumber}
                    className={`rounded-lg p-2.5 border text-xs font-mono ${
                      att.status === 'success'
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                        : att.status === 'circuit_opened'
                          ? 'bg-purple-950/40 border-purple-800 text-purple-300'
                          : 'bg-stone-950 border-stone-800 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold flex items-center gap-1">
                        {att.status === 'success' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-400" />
                        )}
                        Attempt #{att.attemptNumber} (HTTP {att.httpStatus})
                      </span>
                      <span className="text-stone-400">
                        Wait: {att.delayMs}ms + Jitter {att.jitterMs}ms = {att.totalWaitMs}ms
                      </span>
                    </div>
                    <div className="text-[11px] mt-1 text-stone-300 line-clamp-1">
                      {att.details}
                    </div>
                  </div>
                ))}

                <div className="bg-stone-800/80 rounded-lg p-2 text-[11px] font-mono flex items-center justify-between border border-stone-700">
                  <span className="text-stone-400">Final Resolution:</span>
                  <span className="text-amber-400 font-bold">{simulationResult.resolvedVia}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
