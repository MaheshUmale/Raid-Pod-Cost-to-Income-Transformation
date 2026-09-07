import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AgentGraph } from './components/AgentGraph';
import { CostDashboard } from './components/CostDashboard';
import { SimulationRunner } from './components/SimulationRunner';
import { ExceptionQueue } from './components/ExceptionQueue';
import { BottleneckIntelligence } from './components/BottleneckIntelligence';
import { RoleManagementModal } from './components/RoleManagementModal';
import { MarketingDeckModal } from './components/MarketingDeckModal';
import { SCENARIO_TEMPLATES } from './data/scenarios';
import { INITIAL_USERS } from './data/roles';
import { 
  ScenarioType, 
  RaidPodExecutionResult, 
  BatchSimulationResult,
  UserProfile,
  UserRole
} from './types';

export default function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioType>('claims');
  const [activeView, setActiveView] = useState<'dashboard' | 'graph' | 'simulation' | 'exceptions' | 'bottlenecks'>('graph');
  
  // RBAC User Management State
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('raidpod_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_USERS;
  });
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('raidpod_current_user_id') || 'usr-sarah-chen';
  });
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [isMarketingDeckOpen, setIsMarketingDeckOpen] = useState<boolean>(false);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const handleSelectUser = (id: string) => {
    setCurrentUserId(id);
    localStorage.setItem('raidpod_current_user_id', id);
  };

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
      localStorage.setItem('raidpod_users', JSON.stringify(updated));
      return updated;
    });
  };
  
  // Real-time server telemetry
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [lastExecution, setLastExecution] = useState<RaidPodExecutionResult | null>(null);
  const [isRunningSingle, setIsRunningSingle] = useState<boolean>(false);
  
  // Batch simulation state
  const [batchResult, setBatchResult] = useState<BatchSimulationResult | null>(null);
  const [isRunningBatch, setIsRunningBatch] = useState<boolean>(false);

  // Global Operations metrics
  const [totalTransactionsProcessed, setTotalTransactionsProcessed] = useState<number>(() => {
    const saved = localStorage.getItem('raidpod_tx_count');
    return saved ? Number(saved) : 1420;
  });
  const [totalDollarsSaved, setTotalDollarsSaved] = useState<number>(() => {
    const saved = localStorage.getItem('raidpod_dollars_saved');
    return saved ? Number(saved) : 58940.50;
  });
  const [totalTokensSpent, setTotalTokensSpent] = useState<number>(() => {
    const saved = localStorage.getItem('raidpod_tokens_spent');
    return saved ? Number(saved) : 1184000;
  });

  // Exception triage queue items
  const [exceptions, setExceptions] = useState<RaidPodExecutionResult[]>(() => {
    const saved = localStorage.getItem('raidpod_exceptions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Seed with 1 realistic initial exception item for operations demonstration
    return [
      {
        id: 'EXC-2026-0819',
        timestamp: new Date().toISOString(),
        scenario: 'claims',
        title: 'Auto FNOL Incident Report',
        classification: 'Auto Collision Property Damage (FNOL)',
        confidenceScore: 0.81,
        inputTokens: 720,
        outputTokens: 310,
        totalTokens: 1030,
        totalAiCost: 0.0048,
        manualCost: 47.50,
        netSavings: 47.49,
        roiPercentage: 9890,
        manualLaborMins: 38,
        aiDurationMs: 1840,
        hasException: true,
        stepBreakdown: [
          { name: '1. Ingestion & Quarantine Agent', durationMs: 130, status: 'complete', confidence: 1.0 },
          { name: '2. Classification & Extraction Agent', durationMs: 710, status: 'complete', confidence: 0.81 },
          { name: '3. Deterministic Rules Engine', durationMs: 180, status: 'exception', confidence: 1.0 },
          { name: '4. Legacy Robotic Dispatch Agent', durationMs: 820, status: 'diverted', confidence: 0.5 },
        ],
        ruleChecks: [
          { rule: 'PII Check', passed: true, details: 'Tax IDs redacted.' },
          { rule: 'Policy Coverage Active', passed: true, details: 'Active commercial fleet policy.' },
          { rule: 'STP Authority Cap', passed: false, details: 'Repair quote $6,420 exceeds autonomous threshold ($5,000).' },
        ],
        extractedData: {
          claimant: 'Apex Logistics Inc.',
          claimNumber: 'CLM-2026-9841',
          estimatedDamage: 6420.00,
          deductible: 1000.00,
          vehicleVin: '1FTFW1ED4MFA19234',
        },
        legacyExecutionOutput: {
          status: 'EXCEPTION_DIVERTED',
          route: 'HITL_SUPERVISOR_QUEUE',
          reason: 'Repair estimate $6,420.00 exceeds straight-through approval cap of $5,000.00.',
          humanTriagePayload: {
            assignedRole: 'Senior Casualty Adjuster',
            slaCountdownMins: 42,
            preFilledFields: {
              claimant: 'Apex Logistics Inc.',
              estimatedDamage: 6420.00,
            },
            suggestedAction: 'Authorize senior supervisor override for commercial fleet preferred account.',
          },
        },
      },
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('raidpod_tx_count', totalTransactionsProcessed.toString());
    localStorage.setItem('raidpod_dollars_saved', totalDollarsSaved.toString());
    localStorage.setItem('raidpod_tokens_spent', totalTokensSpent.toString());
    localStorage.setItem('raidpod_exceptions', JSON.stringify(exceptions));
  }, [totalTransactionsProcessed, totalDollarsSaved, totalTokensSpent, exceptions]);

  // Check health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHasGeminiKey(Boolean(data.hasGeminiKey));
      })
      .catch((err) => {
        console.warn('API health check error:', err);
      });
  }, []);

  const currentScenario = SCENARIO_TEMPLATES.find((s) => s.id === selectedScenarioId) || SCENARIO_TEMPLATES[0];

  // Run a single transaction execution (calls backend /api/process-pod)
  const handleRunSingle = async (customText?: string, forceException?: boolean) => {
    setIsRunningSingle(true);
    const textToProcess = customText || currentScenario.sampleInput;

    try {
      const response = await fetch('/api/process-pod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: currentScenario.id,
          unstructuredText: textToProcess,
          title: `${currentScenario.name} Submission`,
          simulateError: Boolean(forceException),
          manualLaborMins: currentScenario.defaultManualMins,
          hourlyOpExWage: currentScenario.defaultHourlyWage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result: RaidPodExecutionResult = await response.json();
      setLastExecution(result);

      // Accumulate metrics
      setTotalTransactionsProcessed((prev) => prev + 1);
      setTotalDollarsSaved((prev) => prev + result.netSavings);
      setTotalTokensSpent((prev) => prev + result.totalTokens);

      if (result.hasException) {
        setExceptions((prev) => [result, ...prev]);
      }
    } catch (err: any) {
      console.error('Error executing single transaction:', err);
    } finally {
      setIsRunningSingle(false);
    }
  };

  // Run batch simulation (calls backend /api/simulate-batch)
  const handleRunBatch = async (params: {
    batchSize: number;
    concurrency: number;
    legacyLatencyJitterMs: number;
    syntheticFailureRatePct: number;
  }) => {
    setIsRunningBatch(true);
    try {
      const response = await fetch('/api/simulate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          scenario: currentScenario.id,
          manualLaborMins: currentScenario.defaultManualMins,
          hourlyOpExWage: currentScenario.defaultHourlyWage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Batch simulation error ${response.status}`);
      }

      const result: BatchSimulationResult = await response.json();
      setBatchResult(result);

      // Accumulate metrics
      setTotalTransactionsProcessed((prev) => prev + result.batchSize);
      setTotalDollarsSaved((prev) => prev + result.totalSaved);
      setTotalTokensSpent((prev) => prev + result.totalTokens);
    } catch (err: any) {
      console.error('Error running batch simulation:', err);
    } finally {
      setIsRunningBatch(false);
    }
  };

  // Resolve an exception item from the HITL queue
  const handleResolveException = (id: string, action: 'override' | 'adjust' | 'reject') => {
    setExceptions((prev) => prev.filter((item) => item.id !== id));
    if (action === 'override' || action === 'adjust') {
      // Award additional savings as the transaction is successfully committed to legacy core
      setTotalDollarsSaved((prev) => prev + 42.00);
      setTotalTransactionsProcessed((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Header & Operational Scenario Selector */}
      <Header
        selectedScenario={selectedScenarioId}
        onSelectScenario={setSelectedScenarioId}
        activeView={activeView}
        setActiveView={setActiveView}
        exceptionCount={exceptions.length}
        totalTransactionsProcessed={totalTransactionsProcessed}
        totalDollarsSaved={totalDollarsSaved}
        hasGeminiKey={hasGeminiKey}
        currentUser={currentUser}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenMarketingDeck={() => setIsMarketingDeckOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'graph' && (
          <AgentGraph
            lastExecution={lastExecution}
            isRunning={isRunningSingle}
            onRunTestExecution={(forceException) => handleRunSingle(undefined, forceException)}
            onOpenExceptionQueue={() => setActiveView('exceptions')}
            currentUser={currentUser}
          />
        )}

        {activeView === 'dashboard' && (
          <CostDashboard
            lastExecution={lastExecution}
            totalTransactionsProcessed={totalTransactionsProcessed}
            totalDollarsSaved={totalDollarsSaved}
            totalTokensSpent={totalTokensSpent}
          />
        )}

        {activeView === 'simulation' && (
          <SimulationRunner
            scenario={currentScenario}
            lastExecution={lastExecution}
            isRunningSingle={isRunningSingle}
            onRunSingle={handleRunSingle}
            batchResult={batchResult}
            isRunningBatch={isRunningBatch}
            onRunBatch={handleRunBatch}
          />
        )}

        {activeView === 'bottlenecks' && (
          <BottleneckIntelligence
            currentUser={currentUser}
            totalTransactionsProcessed={totalTransactionsProcessed}
          />
        )}

        {activeView === 'exceptions' && (
          <ExceptionQueue
            exceptions={exceptions}
            onResolveException={handleResolveException}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Role Management & RBAC Modal */}
      <RoleManagementModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentUser={currentUser}
        users={users}
        onSelectUser={handleSelectUser}
        onUpdateUserRole={handleUpdateRole}
      />

      {/* Marketing Presentation & Executive PDF Deck Modal */}
      <MarketingDeckModal
        isOpen={isMarketingDeckOpen}
        onClose={() => setIsMarketingDeckOpen(false)}
        totalTransactionsProcessed={totalTransactionsProcessed}
        totalDollarsSaved={totalDollarsSaved}
      />

      {/* Footer / Telemetry Bar */}
      <footer className="border-t border-stone-200 bg-white py-4 text-stone-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Raid Pod Zero-Code Gateway Active • Port 3000 Ingress</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Target: Operations Leaders (Claims / Reconciliations / Escalations)</span>
            <span>Sprint #2 Cost-to-Income Transformation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
