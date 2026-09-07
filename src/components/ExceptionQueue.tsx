import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  UserCheck, 
  ShieldAlert, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Filter,
  Lock
} from 'lucide-react';
import { RaidPodExecutionResult, UserProfile } from '../types';

interface ExceptionQueueProps {
  exceptions: RaidPodExecutionResult[];
  onResolveException: (id: string, action: 'override' | 'adjust' | 'reject') => void;
  currentUser?: UserProfile;
}

export const ExceptionQueue: React.FC<ExceptionQueueProps> = ({
  exceptions,
  onResolveException,
  currentUser,
}) => {
  const [selectedExceptionId, setSelectedExceptionId] = useState<string | null>(
    exceptions[0]?.id || null
  );

  const canResolve = currentUser ? (currentUser.role === 'Administrator' || currentUser.role === 'Operator') : true;

  const selectedItem = exceptions.find((e) => e.id === selectedExceptionId) || exceptions[0];

  return (
    <div className="space-y-6">
      {/* Top Explanation */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                Automated Exception Triage & Human-in-the-Loop (HITL) Queue
              </h2>
            </div>
            <p className="text-sm text-stone-600 mt-1 max-w-3xl">
              When deterministic rules trigger a tolerance breach or confidence dips below 85%, the Raid Pod prevents incorrect entries into legacy systems and auto-generates pre-filled warm-handoff packets for operations supervisors.
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
              {exceptions.length} Pending Exceptions
            </span>
          </div>
        </div>
      </div>

      {exceptions.length === 0 ? (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-12 text-center text-stone-500 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-stone-800">
            Exception Queue is Clear
          </h3>
          <p className="text-xs max-w-md mx-auto text-stone-500">
            All incoming unstructured transactions have met deterministic validation standards and been dispatched straight through into core legacy systems.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Exception Item List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-500 px-1">
              <span>Active Exception Items ({exceptions.length})</span>
              <span>Priority Sorted</span>
            </div>

            <div className="space-y-2">
              {exceptions.map((exc) => (
                <div
                  key={exc.id}
                  onClick={() => setSelectedExceptionId(exc.id)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all ${
                    selectedExceptionId === exc.id
                      ? 'bg-amber-50/50 border-amber-400 ring-1 ring-amber-400/40 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-stone-900">
                      {exc.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> 42m SLA
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-stone-800">
                    {exc.classification}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                    {exc.legacyExecutionOutput.reason || 'Deterministic policy validation flag'}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-stone-500 pt-2 border-t border-stone-100">
                    <span>Confidence: {(exc.confidenceScore * 100).toFixed(0)}%</span>
                    <span className="text-emerald-700 font-medium">Pre-filled: 100%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Active Incident Review & Resolution Drawer */}
          {selectedItem && (
            <div className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-stone-500">
                      {selectedItem.id}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono bg-amber-100 text-amber-800 font-semibold border border-amber-300">
                      {selectedItem.scenario.toUpperCase()} EXCEPTION
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mt-1">
                    {selectedItem.classification}
                  </h3>
                </div>

                <div className="text-right text-xs font-mono">
                  <span className="text-stone-400 block text-[10px]">TIMESTAMP</span>
                  <span className="text-stone-700">
                    {new Date(selectedItem.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Highlighted Rule Violation Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Intercepted Exception Cause:</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed pl-6">
                  {selectedItem.legacyExecutionOutput.reason ||
                    'Extracted transaction details exceeded autonomous STP tolerance. Supervisor authorization required to prevent erroneous core ledger posting.'}
                </p>
                <div className="pl-6 text-[11px] text-amber-900 font-mono pt-1">
                  Suggested Action: {selectedItem.legacyExecutionOutput.humanTriagePayload?.suggestedAction || 'Review variance and approve supervisor override.'}
                </div>
              </div>

              {/* Pre-Filled Extraction Data Packet */}
              <div>
                <h4 className="text-xs font-bold text-stone-900 mb-2">
                  Pre-Structured Data Packet (Ready for Zero-Keying Authorization)
                </h4>
                <div className="bg-stone-900 rounded-lg p-3 text-[11px] font-mono text-stone-200 overflow-x-auto max-h-48 border border-stone-800">
                  <pre>{JSON.stringify(selectedItem.extractedData, null, 2)}</pre>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  * 95% of human labor has already been completed by the extraction agent. The operator only evaluates the isolated discrepancy.
                </p>
              </div>

              {/* Resolution Action Buttons */}
              <div className="pt-4 border-t border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-stone-700">
                    Supervisor Resolution Decision:
                  </div>
                  {!canResolve && (
                    <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" />
                      Analyst: Read-Only Audit Mode
                    </span>
                  )}
                </div>

                {!canResolve ? (
                  <div className="p-3 bg-stone-100 rounded-lg text-xs text-stone-600 border border-stone-200">
                    Your current role (<strong>{currentUser?.role}</strong>) has read-only audit access to exception packages. To approve overrides or modify records, switch to an <strong>Operator</strong> or <strong>Administrator</strong> persona via the top navigation.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      id="btn-override-exception"
                      onClick={() => onResolveException(selectedItem.id, 'override')}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Authorize Supervisor Override & Commit to Legacy System
                    </button>

                    <button
                      id="btn-adjust-tolerance"
                      onClick={() => onResolveException(selectedItem.id, 'adjust')}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      Apply Tolerance Adjustment
                    </button>

                    <button
                      id="btn-reject-exception"
                      onClick={() => onResolveException(selectedItem.id, 'reject')}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      Reject & Return to Counterparty
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
