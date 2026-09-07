import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Zap, 
  Clock, 
  Sliders, 
  ShieldCheck, 
  PieChart, 
  Layers, 
  ArrowRight,
  Sparkles,
  BarChart3,
  Flame
} from 'lucide-react';
import { RaidPodExecutionResult, CostSensitivityParams } from '../types';

interface CostDashboardProps {
  lastExecution: RaidPodExecutionResult | null;
  totalTransactionsProcessed: number;
  totalDollarsSaved: number;
  totalTokensSpent: number;
}

export const CostDashboard: React.FC<CostDashboardProps> = ({
  lastExecution,
  totalTransactionsProcessed,
  totalDollarsSaved,
  totalTokensSpent,
}) => {
  // Sensitivity params state with realistic defaults
  const [params, setParams] = useState<CostSensitivityParams>({
    hourlyOpExWage: 75, // $75/hr fully burdened operations cost (benefits, payroll, overhead)
    manualLaborMins: 35, // 35 minutes manual re-keying & cross-referencing per case
    monthlyVolume: 3500, // 3,500 monthly transactions
    stpTargetPct: 88, // 88% straight-through processing
    tokenCostPer1k: 0.00035, // blended input/output token cost
  });

  // Calculate live dynamic economics based on sliders
  const manualCostPerTx = (params.manualLaborMins / 60) * params.hourlyOpExWage;
  
  // Single transaction token spend
  const avgTokensPerTx = lastExecution ? lastExecution.totalTokens : 820;
  const tokenCostPerTx = (avgTokensPerTx / 1000) * params.tokenCostPer1k;
  const infrastructureOverheadPerTx = 0.0035; // Cloud container execution + headless browser instance
  const totalRaidPodCostPerTx = tokenCostPerTx + infrastructureOverheadPerTx;

  // Savings per transaction
  const netSavingsPerTx = Math.max(0, manualCostPerTx - totalRaidPodCostPerTx);
  const costReductionPct = ((netSavingsPerTx / manualCostPerTx) * 100).toFixed(1);

  // Monthly & Annualized Financial Impact
  const automatedVolume = Math.round(params.monthlyVolume * (params.stpTargetPct / 100));
  const exceptionVolume = params.monthlyVolume - automatedVolume;
  
  // Exception handling still saves ~60% of manual time because the Raid Pod pre-extracts and highlights the discrepancy
  const exceptionSavingsFactor = 0.60;
  const monthlyManualCost = params.monthlyVolume * manualCostPerTx;
  const monthlyRaidPodOpEx = (params.monthlyVolume * totalRaidPodCostPerTx) + (exceptionVolume * (manualCostPerTx * (1 - exceptionSavingsFactor)));
  const monthlyNetSavings = monthlyManualCost - monthlyRaidPodOpEx;
  const annualNetSavings = monthlyNetSavings * 12;

  // Human hours saved
  const monthlyHoursReclaimed = Math.round((params.monthlyVolume * params.manualLaborMins * (params.stpTargetPct / 100)) / 60);
  const annualHoursReclaimed = monthlyHoursReclaimed * 12;

  // Payback period assuming standard 2-week Raid Pod sprint deployment cost ($45,000)
  const sprintDeploymentCost = 45000;
  const paybackDays = Math.max(1, Math.round((sprintDeploymentCost / (monthlyNetSavings / 30))));

  return (
    <div className="space-y-6">
      {/* Top Banner: Cost-to-Income Transformation Rationale */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <DollarSign className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                Live Cost Dashboard: Token Spend vs. Dollar Savings
              </h2>
            </div>
            <p className="text-sm text-stone-600 mt-1 max-w-3xl">
              Legacy API modifications take 12+ months and cost upwards of $1.5M. The Raid Pod delivers immediate OpEx collapse by replacing manual 35-minute data entry with sub-second AI tokens.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="px-3 py-2 rounded-lg bg-stone-900 text-stone-100">
              <span className="text-stone-400 block text-[10px]">SPRINT PAYBACK</span>
              <span className="text-emerald-400 font-bold text-sm">{paybackDays} Days</span>
            </div>
            <div className="px-3 py-2 rounded-lg bg-stone-100 border border-stone-300 text-stone-900">
              <span className="text-stone-500 block text-[10px]">OPEX REDUCTION</span>
              <span className="text-stone-900 font-bold text-sm">{costReductionPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Transaction Unit Economics Breakdown (The Core Comparison) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Legacy Manual Cost */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Legacy Manual OpEx</span>
            <Clock className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono">
            ${manualCostPerTx.toFixed(2)}
          </div>
          <div className="text-xs text-stone-500 mt-1 flex items-center gap-1">
            <span>{params.manualLaborMins} mins @ ${params.hourlyOpExWage}/hr</span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
            High error rate & slow turnaround
          </div>
        </div>

        {/* Metric 2: Raid Pod AI Token Spend */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Raid Pod Token Spend</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono">
            ${totalRaidPodCostPerTx.toFixed(4)}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            ~{avgTokensPerTx.toLocaleString()} tokens + compute
          </div>
          <div className="mt-3 text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
            $0.0003 token + $0.0035 runtime
          </div>
        </div>

        {/* Metric 3: Net Savings per Transaction */}
        <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-xs ring-1 ring-emerald-500/20">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-medium mb-1">
            <span>Net Dollar Savings</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">
            +${netSavingsPerTx.toFixed(2)}
          </div>
          <div className="text-xs text-stone-600 mt-1">
            Per transaction processed
          </div>
          <div className="mt-3 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
            {costReductionPct}% margin unlocked
          </div>
        </div>

        {/* Metric 4: Annualized Enterprise Value */}
        <div className="bg-stone-900 text-stone-100 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span>Annualized Net Savings</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-stone-100 font-mono">
            ${(annualNetSavings / 1_000_000).toFixed(2)}M
          </div>
          <div className="text-xs text-stone-400 mt-1">
            At {params.monthlyVolume.toLocaleString()} tx / month
          </div>
          <div className="mt-3 text-[11px] font-mono text-emerald-400 bg-stone-800 px-2 py-1 rounded border border-stone-700">
            {annualHoursReclaimed.toLocaleString()} analyst hrs reclaimed
          </div>
        </div>
      </div>

      {/* Visual Unit Comparison Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 mb-2">
          Unit Cost Breakdown: Legacy Manual vs. Multi-Agent Raid Pod
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Visualizing where capital is spent per transaction. The AI token expenditure is essentially negligible compared to burdened operations payroll.
        </p>

        <div className="space-y-4">
          {/* Legacy Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="font-semibold text-stone-700">Legacy Manual Baseline:</span>
              <span className="text-stone-900 font-bold">${manualCostPerTx.toFixed(2)} / tx</span>
            </div>
            <div className="w-full h-7 bg-stone-100 rounded-md overflow-hidden flex">
              <div 
                className="bg-stone-400 h-full flex items-center px-3 text-[11px] text-stone-900 font-medium"
                style={{ width: '100%' }}
              >
                Human Keying & Verification ($38.50 - $45.00)
              </div>
            </div>
          </div>

          {/* Raid Pod Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="font-semibold text-emerald-800">Raid Pod Multi-Agent STP:</span>
              <span className="text-emerald-600 font-bold">${totalRaidPodCostPerTx.toFixed(4)} / tx (99.98% Cheaper)</span>
            </div>
            <div className="w-full h-7 bg-stone-100 rounded-md overflow-hidden flex">
              <div 
                className="bg-amber-500 h-full flex items-center px-2 text-[10px] text-stone-950 font-bold"
                style={{ width: '3%' }}
                title="AI Token Spend"
              />
              <div 
                className="bg-emerald-500 h-full flex items-center px-2 text-[10px] text-white font-medium"
                style={{ width: '4%' }}
                title="Browser / Terminal Orchestration"
              />
              <div 
                className="bg-emerald-50 border-l border-emerald-300 h-full flex items-center px-3 text-[11px] text-emerald-800 font-bold"
                style={{ width: '93%' }}
              >
                Direct OpEx Margin Expansion Saved (+${netSavingsPerTx.toFixed(2)})
              </div>
            </div>
            <div className="flex items-center space-x-4 text-[11px] text-stone-500 mt-1.5">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                Gemini Token Spend ($0.0003)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                Headless Legacy Orchestration ($0.0035)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-300" />
                Net Cash Flow Reclaimed ($43.74)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive OpEx Sensitivity Calculator */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-stone-700" />
            <h3 className="text-base font-bold text-stone-900 tracking-tight">
              Interactive OpEx & Volume Sensitivity Modeler
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            Adjust variables to simulate your enterprise bottleneck
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Slider 1: Hourly Burdened Wage */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-stone-700 font-medium">Analyst Hourly Wage (Burdened)</span>
              <span className="font-mono font-bold text-stone-900">${params.hourlyOpExWage}/hr</span>
            </div>
            <input
              type="range"
              min="40"
              max="130"
              step="5"
              value={params.hourlyOpExWage}
              onChange={(e) => setParams({ ...params, hourlyOpExWage: Number(e.target.value) })}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-600 font-mono">
              <span>$40/hr</span>
              <span>$85/hr</span>
              <span>$130/hr</span>
            </div>
          </div>

          {/* Slider 2: Manual Minutes per Transaction */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-stone-700 font-medium">Manual Cycle Time</span>
              <span className="font-mono font-bold text-stone-900">{params.manualLaborMins} mins</span>
            </div>
            <input
              type="range"
              min="10"
              max="75"
              step="5"
              value={params.manualLaborMins}
              onChange={(e) => setParams({ ...params, manualLaborMins: Number(e.target.value) })}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-600 font-mono">
              <span>10m</span>
              <span>40m</span>
              <span>75m</span>
            </div>
          </div>

          {/* Slider 3: Monthly Volume */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-stone-700 font-medium">Monthly Transaction Volume</span>
              <span className="font-mono font-bold text-stone-900">{params.monthlyVolume.toLocaleString()} tx</span>
            </div>
            <input
              type="range"
              min="500"
              max="25000"
              step="500"
              value={params.monthlyVolume}
              onChange={(e) => setParams({ ...params, monthlyVolume: Number(e.target.value) })}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-600 font-mono">
              <span>500</span>
              <span>12.5k</span>
              <span>25k</span>
            </div>
          </div>

          {/* Slider 4: STP Target Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-stone-700 font-medium">Straight-Through Rate (STP)</span>
              <span className="font-mono font-bold text-emerald-800">{params.stpTargetPct}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="98"
              step="2"
              value={params.stpTargetPct}
              onChange={(e) => setParams({ ...params, stpTargetPct: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-600 font-mono">
              <span>60%</span>
              <span>80%</span>
              <span>98%</span>
            </div>
          </div>
        </div>

        {/* Dynamic ROI Summary Table */}
        <div className="mt-6 pt-5 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-3.5 rounded-lg border border-stone-200">
            <span className="text-xs text-stone-500 block">Current Legacy Monthly Spend</span>
            <span className="text-lg font-bold text-stone-900 font-mono">
              ${Math.round(monthlyManualCost).toLocaleString()}
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-stone-200">
            <span className="text-xs text-stone-500 block">Raid Pod Monthly OpEx</span>
            <span className="text-lg font-bold text-amber-600 font-mono">
              ${Math.round(monthlyRaidPodOpEx).toLocaleString()}
            </span>
          </div>
          <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200">
            <span className="text-xs text-emerald-800 font-medium block">Monthly Net Savings</span>
            <span className="text-lg font-bold text-emerald-700 font-mono">
              +${Math.round(monthlyNetSavings).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
