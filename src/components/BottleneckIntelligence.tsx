import React, { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  Zap, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Clock, 
  BarChart3, 
  Lock,
  ArrowUpRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  PipelineBottleneckMetric, 
  OptimizationInsight, 
  UserProfile 
} from '../types';
import { 
  INITIAL_PIPELINE_METRICS, 
  INITIAL_OPTIMIZATION_INSIGHTS 
} from '../data/bottlenecks';

interface BottleneckIntelligenceProps {
  currentUser: UserProfile;
  totalTransactionsProcessed: number;
}

export const BottleneckIntelligence: React.FC<BottleneckIntelligenceProps> = ({
  currentUser,
  totalTransactionsProcessed,
}) => {
  const [metrics, setMetrics] = useState<PipelineBottleneckMetric[]>(INITIAL_PIPELINE_METRICS);
  const [optimizations, setOptimizations] = useState<OptimizationInsight[]>(INITIAL_OPTIMIZATION_INSIGHTS);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const isAdmin = currentUser.role === 'Administrator';

  // Toggle optimization toggle
  const toggleOptimization = (id: string) => {
    setOptimizations((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, activeInSimulation: !opt.activeInSimulation } : opt))
    );
  };

  // Calculate dynamic projected improvements based on active optimizations
  const activeOptimizations = optimizations.filter((o) => o.activeInSimulation);
  
  const totalLatencyReductionMs = activeOptimizations.reduce(
    (acc, o) => acc + Math.abs(o.estimatedLatencyImpactMs),
    0
  );
  
  const totalMonthlySavings = activeOptimizations.reduce(
    (acc, o) => acc + o.estimatedMonthlyDollarSavings,
    0
  );

  const baselineP95Latency = 3840; // ms
  const simulatedP95Latency = Math.max(680, baselineP95Latency - totalLatencyReductionMs);
  
  const baselineThroughput = 16.5; // tx/sec
  const simulatedThroughput = Number(
    (baselineThroughput * (1 + (activeOptimizations.length * 0.42))).toFixed(1)
  );

  const baselineHealthScore = 68;
  const simulatedHealthScore = Math.min(96, baselineHealthScore + (activeOptimizations.length * 7));

  const handleApplyToPod = (opt: OptimizationInsight) => {
    if (!isAdmin) {
      alert('Only Administrators can commit optimization parameters to the live production pod.');
      return;
    }
    setAppliedNotification(`Successfully committed "${opt.title}" to production pod configuration.`);
    setTimeout(() => setAppliedNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Predictive Intelligence Summary */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                Predictive Bottleneck & Optimization Intelligence Engine
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-100 text-purple-800 border border-purple-300 font-semibold">
                AI Forecast Model v3.2
              </span>
            </div>
            <p className="text-sm text-stone-600 mt-1 max-w-3xl">
              Analyzes historical queue durations, token usage patterns, and legacy locking jitter to predict upstream and downstream pipeline bottlenecks before production slowdowns occur.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-2 text-center">
              <span className="text-[10px] text-stone-400 block">HEALTH INDEX</span>
              <span className={`text-base font-bold ${simulatedHealthScore > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {simulatedHealthScore}/100
              </span>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-2 text-center">
              <span className="text-[10px] text-stone-400 block">PROJECTED BREAK</span>
              <span className="text-xs font-bold text-stone-800">
                {activeOptimizations.length >= 2 ? 'Stable (>90 Days)' : '18 Days (Peak Burst)'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Notification Bar */}
        {appliedNotification && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{appliedNotification}</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <span className="text-stone-400 block text-[11px]">PROJECTED P95 LATENCY</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-stone-900">{simulatedP95Latency}ms</span>
            {totalLatencyReductionMs > 0 && (
              <span className="text-emerald-700 font-bold text-xs">
                -{totalLatencyReductionMs}ms
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">Baseline: 3,840ms</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <span className="text-stone-400 block text-[11px]">MAX SUSTAINED THROUGHPUT</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-stone-900">{simulatedThroughput} tx/s</span>
            {activeOptimizations.length > 0 && (
              <span className="text-emerald-700 font-bold text-xs">
                +{(activeOptimizations.length * 42)}%
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">Without queue contention</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <span className="text-stone-400 block text-[11px]">PROJECTED MONTHLY RECLAIMED</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-emerald-700">
              ${totalMonthlySavings.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">
            {activeOptimizations.length} optimizations active
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <span className="text-stone-400 block text-[11px]">PRIMARY CHOKE STAGE</span>
          <div className="mt-1">
            <span className="text-sm font-bold text-amber-800 block truncate">
              {activeOptimizations.some((o) => o.id === 'opt-worker-pool')
                ? 'Semantic LLM Token Burst'
                : 'Legacy 3270 Session Lock'}
            </span>
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">
            {activeOptimizations.some((o) => o.id === 'opt-worker-pool')
              ? 'Legacy queue relieved'
              : '86% saturation at 8 concurrent'}
          </span>
        </div>
      </div>

      {/* Section 1: Historical Pipeline Saturation Matrix */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Multi-Agent Pipeline Saturation & Historical Latency Spectrum
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Identifies which stage represents the physical ceiling for enterprise scalability.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-400">
            Telemetry Samples: {totalTransactionsProcessed.toLocaleString()} txs
          </span>
        </div>

        <div className="space-y-3">
          {metrics.map((metric) => {
            const isRelieved = activeOptimizations.some((o) => o.targetStage === metric.stageName);
            const displaySaturation = isRelieved 
              ? Math.max(15, Math.round(metric.saturationIndexPct * 0.45)) 
              : metric.saturationIndexPct;

            return (
              <div
                key={metric.stageId}
                className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50 hover:bg-stone-50 transition-colors space-y-2"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        displaySaturation > 75
                          ? 'bg-red-500'
                          : displaySaturation > 45
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                      }`}
                    />
                    <span className="text-xs font-bold text-stone-900">{metric.stageName}</span>
                    {isRelieved && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Optimized
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <span className="text-stone-500">
                      Avg: <strong className="text-stone-800">{isRelieved ? Math.round(metric.currentAvgLatencyMs * 0.5) : metric.currentAvgLatencyMs}ms</strong>
                    </span>
                    <span className="text-stone-500">
                      P95: <strong className="text-stone-800">{isRelieved ? Math.round(metric.p95LatencyMs * 0.55) : metric.p95LatencyMs}ms</strong>
                    </span>
                    <span className="text-stone-500">
                      Queue Depth: <strong className="text-stone-800">{isRelieved ? 2 : metric.queueDepth}</strong>
                    </span>
                    <span className="text-stone-500">
                      Saturation: <strong className={displaySaturation > 75 ? 'text-red-600' : 'text-stone-800'}>{displaySaturation}%</strong>
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      displaySaturation > 75
                        ? 'bg-red-500'
                        : displaySaturation > 45
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                    }`}
                    style={{ width: `${displaySaturation}%` }}
                  />
                </div>

                {/* Projected Breaking Point Warning */}
                <div className="flex items-center justify-between text-[11px] text-stone-600 pt-1">
                  <span className="text-stone-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    {metric.projectedBreakingPoint}
                  </span>
                  <span className="font-mono text-stone-400">
                    Concurrency Cap: {metric.concurrencyLimit} threads
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Actionable Optimization Playbook */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-stone-900">
                Actionable Optimization Playbook & Architectural Recommendations
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Toggle optimizations to simulate impact on P95 latency, peak throughput, and OpEx savings.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-500">
            {activeOptimizations.length} of {optimizations.length} Enabled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optimizations.map((opt) => (
            <div
              key={opt.id}
              className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                opt.activeInSimulation
                  ? 'bg-purple-50/40 border-purple-400 ring-1 ring-purple-400/40 shadow-xs'
                  : 'bg-stone-50/50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-semibold">
                    {opt.implementationEffort}
                  </span>
                  <button
                    onClick={() => toggleOptimization(opt.id)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-md transition-colors ${
                      opt.activeInSimulation
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    {opt.activeInSimulation ? 'Enabled in Sim' : 'Toggle Simulation'}
                  </button>
                </div>

                <h4 className="text-xs font-bold text-stone-900 mt-1">{opt.title}</h4>
                <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                  Target: {opt.targetStage}
                </div>

                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  <strong>Constraint: </strong>{opt.currentConstraint}
                </p>
                <p className="text-xs text-stone-700 mt-1.5 leading-relaxed bg-white/80 p-2 rounded border border-stone-200/60">
                  <strong>Recommendation: </strong>{opt.actionableRecommendation}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-emerald-700 font-bold block">
                    {opt.estimatedLatencyImpactMs}ms latency
                  </span>
                  <span className="text-purple-700 font-semibold text-[10px]">
                    +{opt.estimatedThroughputGainPct}% throughput
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-stone-900 font-bold block">
                    +${opt.estimatedMonthlyDollarSavings.toLocaleString()}/mo
                  </span>
                  {isAdmin ? (
                    <button
                      onClick={() => handleApplyToPod(opt)}
                      className="text-[10px] text-purple-700 hover:text-purple-900 font-bold underline flex items-center gap-0.5 mt-0.5"
                    >
                      Commit to Live Pod
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Admin Commit
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
