import React from 'react';
import { 
  Bot, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  Users, 
  Key,
  Shield,
  FileText
} from 'lucide-react';
import { ScenarioType, UserProfile } from '../types';
import { SCENARIO_TEMPLATES } from '../data/scenarios';
import { ROLE_DEFINITIONS } from '../data/roles';

interface HeaderProps {
  selectedScenario: ScenarioType;
  onSelectScenario: (scenario: ScenarioType) => void;
  activeView: 'dashboard' | 'graph' | 'simulation' | 'exceptions' | 'bottlenecks';
  setActiveView: (view: 'dashboard' | 'graph' | 'simulation' | 'exceptions' | 'bottlenecks') => void;
  exceptionCount: number;
  totalTransactionsProcessed: number;
  totalDollarsSaved: number;
  hasGeminiKey: boolean;
  currentUser: UserProfile;
  onOpenRoleModal: () => void;
  onOpenMarketingDeck: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedScenario,
  onSelectScenario,
  activeView,
  setActiveView,
  exceptionCount,
  totalTransactionsProcessed,
  totalDollarsSaved,
  hasGeminiKey,
  currentUser,
  onOpenRoleModal,
  onOpenMarketingDeck,
}) => {
  const currentRoleConfig = ROLE_DEFINITIONS[currentUser.role];

  return (
    <header className="border-b border-stone-200 bg-stone-900 text-stone-100 sticky top-0 z-30 shadow-md">
      {/* Top Banner: Brand & Strategic Positioning */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono font-bold text-lg">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-stone-100 text-base tracking-tight">
                  RAID POD
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-amber-950 text-amber-300 border border-amber-800">
                  Sprint #2
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Zero Legacy Code Mod
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Cost-to-Income Transformation: Unstructured Data Interception & Deterministic Legacy Bridge
              </p>
            </div>
          </div>

          {/* Quick Metrics Ticker & User Role Pill */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex flex-col">
              <span className="text-stone-400">Total OpEx Saved</span>
              <span className="text-emerald-400 font-bold text-sm flex items-center">
                <DollarSign className="w-3.5 h-3.5 -mr-0.5" />
                {totalDollarsSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="hidden sm:block h-6 w-px bg-stone-800" />
            <div className="flex flex-col">
              <span className="text-stone-400">Transactions Run</span>
              <span className="text-stone-200 font-bold text-sm">
                {totalTransactionsProcessed.toLocaleString()}
              </span>
            </div>
            <div className="hidden sm:block h-6 w-px bg-stone-800" />
            
            {/* Active User Persona & Role Management Trigger */}
            <button
              id="btn-open-rbac"
              onClick={onOpenRoleModal}
              className="flex items-center space-x-2.5 bg-stone-800 hover:bg-stone-750 border border-stone-700 hover:border-stone-600 rounded-lg px-3 py-1.5 transition-all text-left group"
              title="Click to switch persona or configure RBAC permissions"
            >
              <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center">
                {currentUser.avatar}
              </div>
              <div>
                <div className="text-[11px] font-bold text-stone-200 flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${currentRoleConfig.badgeColor}`}>
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[10px] text-stone-400 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Key className="w-2.5 h-2.5" />
                  <span>Switch Role / Permissions</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Tabs and Scenario Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-stone-800 pt-2 pb-2 gap-3">
          {/* Main Navigation Tabs */}
          <nav className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-xs font-medium">
            <button
              id="tab-graph"
              onClick={() => setActiveView('graph')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeView === 'graph'
                  ? 'bg-stone-100 text-stone-900 font-semibold shadow-sm'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              Multi-Agent Graph & DAG
            </button>
            <button
              id="tab-dashboard"
              onClick={() => setActiveView('dashboard')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeView === 'dashboard'
                  ? 'bg-stone-100 text-stone-900 font-semibold shadow-sm'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              Cost & Token Dashboard
            </button>
            <button
              id="tab-simulation"
              onClick={() => setActiveView('simulation')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeView === 'simulation'
                  ? 'bg-stone-100 text-stone-900 font-semibold shadow-sm'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              Workflow Simulation
            </button>
            <button
              id="tab-bottlenecks"
              onClick={() => setActiveView('bottlenecks')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeView === 'bottlenecks'
                  ? 'bg-stone-100 text-stone-900 font-semibold shadow-sm'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              Predictive Bottlenecks & Optimization
            </button>
            <button
              id="tab-exceptions"
              onClick={() => setActiveView('exceptions')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 relative ${
                activeView === 'exceptions'
                  ? 'bg-stone-100 text-stone-900 font-semibold shadow-sm'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Exception Queue
              {exceptionCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px]">
                  {exceptionCount}
                </span>
              )}
            </button>
          </nav>

          {/* Controls: Executive Deck & Scenario Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-open-marketing-deck"
              onClick={onOpenMarketingDeck}
              className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Open Executive Presentation Deck & Print/Download PDF"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Pitch Deck & PDF</span>
            </button>

            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-stone-400 whitespace-nowrap">Target Bottleneck:</span>
              <select
                id="scenario-selector"
                value={selectedScenario}
                onChange={(e) => onSelectScenario(e.target.value as ScenarioType)}
                className="bg-stone-800 border border-stone-700 rounded text-xs text-stone-200 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {SCENARIO_TEMPLATES.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
