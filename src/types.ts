export type ScenarioType = 'claims' | 'reconciliation' | 'escalations' | 'custom';

export interface ScenarioTemplate {
  id: ScenarioType;
  name: string;
  category: string;
  description: string;
  defaultManualMins: number;
  defaultHourlyWage: number;
  legacySystemName: string;
  sampleInput: string;
  expectedExtractionFields: string[];
  deterministicRules: string[];
}

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  type: 'ingestion' | 'extraction' | 'rules' | 'legacy_connector' | 'exception_route' | 'audit';
  description: string;
  technology: string;
  avgLatencyMs: number;
  isExceptionRoute?: boolean;
  status: 'idle' | 'running' | 'completed' | 'exception' | 'diverted';
}

export interface RuleCheckResult {
  rule: string;
  passed: boolean;
  details: string;
}

export interface StepTiming {
  name: string;
  durationMs: number;
  status: 'pending' | 'running' | 'complete' | 'exception' | 'diverted';
  confidence: number;
}

export interface RaidPodExecutionResult {
  id: string;
  timestamp: string;
  scenario: ScenarioType;
  title: string;
  classification: string;
  confidenceScore: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  totalAiCost: number;
  manualCost: number;
  netSavings: number;
  roiPercentage: number;
  manualLaborMins: number;
  aiDurationMs: number;
  hasException: boolean;
  stepBreakdown: StepTiming[];
  ruleChecks: RuleCheckResult[];
  extractedData: Record<string, any>;
  aiReasoning?: string;
  legacyExecutionOutput: {
    status: string;
    route: string;
    reason?: string;
    legacySystem?: string;
    transactionRef?: string;
    stepsExecuted?: string[];
    humanTriagePayload?: {
      assignedRole: string;
      slaCountdownMins: number;
      preFilledFields: Record<string, any>;
      suggestedAction: string;
    };
  };
}

export interface BatchSimulationResult {
  batchSize: number;
  concurrency: number;
  stpRatePct: number;
  totalExceptions: number;
  totalSaved: number;
  totalTokens: number;
  avgLatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  throughputTxPerSec: number;
  primaryBottleneck: string;
  nodeBreakdown: {
    name: string;
    avgMs: number;
    pct: number;
  }[];
  sampleTransactions: {
    id: string;
    status: string;
    durationMs: number;
    tokens: number;
    savedAmount: number;
    bottleneckStage: string;
  }[];
}

export interface CostSensitivityParams {
  hourlyOpExWage: number;
  manualLaborMins: number;
  monthlyVolume: number;
  stpTargetPct: number;
  tokenCostPer1k: number;
}

// User Role Management Types
export type UserRole = 'Administrator' | 'Operator' | 'Analyst';

export interface RolePermissions {
  canViewDashboard: boolean;
  canViewReports: boolean;
  canRunSimulations: boolean;
  canRunLivePods: boolean;
  canManageExceptions: boolean;
  canConfigureRules: boolean;
  canManageUsers: boolean;
  canExportAuditLogs: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  title: string;
  department: string;
  lastActive: string;
}

// Advanced Exception Handling Strategies Types
export type ExceptionStrategyType = 
  | 'api_timeout' 
  | 'malformed_data' 
  | 'system_unavailability' 
  | 'policy_breach';

export interface RetryAttempt {
  attemptNumber: number;
  delayMs: number;
  jitterMs: number;
  totalWaitMs: number;
  status: 'pending' | 'success' | 'failed' | 'circuit_opened';
  httpStatus?: number;
  details: string;
  timestamp: string;
}

export interface ExceptionSubProcess {
  id: ExceptionStrategyType;
  title: string;
  triggerEvent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectionLatencyMs: number;
  backoffStrategy: 'exponential_jitter' | 'linear_retry' | 'circuit_breaker' | 'fallback_routing';
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitterFactor: number;
  circuitBreakerThreshold: number;
  circuitStatus: 'CLOSED' | 'HALF_OPEN' | 'OPEN';
  steps: {
    stepNumber: number;
    name: string;
    description: string;
    actionType: 'retry' | 'quarantine' | 'circuit_check' | 'fallback' | 'supervisor_handoff';
  }[];
  fallbackAction: string;
  slaMinutes: number;
}

// Predictive Bottleneck & Optimization Types
export interface PipelineBottleneckMetric {
  stageId: string;
  stageName: string;
  currentAvgLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  saturationIndexPct: number; // 0 - 100%
  concurrencyLimit: number;
  failureRatePct: number;
  riskLevel: 'safe' | 'moderate' | 'high' | 'critical';
  projectedBreakingPoint: string;
  queueDepth: number;
  historicalTrend: number[]; // array of historical latency points
}

export interface OptimizationInsight {
  id: string;
  category: 'legacy_infra' | 'model_caching' | 'rule_tuning' | 'backoff_jitter';
  title: string;
  targetStage: string;
  currentConstraint: string;
  actionableRecommendation: string;
  implementationEffort: 'Low (Config)' | 'Medium (Rule Adjustment)' | 'Low (Pod Worker Pool)';
  estimatedLatencyImpactMs: number; // negative ms saved
  estimatedThroughputGainPct: number;
  estimatedMonthlyDollarSavings: number;
  activeInSimulation: boolean;
}

export interface BottleneckForecastResult {
  overallHealthScore: number;
  primaryProjectedBottleneck: string;
  projectedMaxThroughput: number;
  projectedCostPerTx: number;
  saturationRiskStage: string;
  daysUntilCapacityExceeded: number;
  stageMetrics: PipelineBottleneckMetric[];
  actionableInsights: OptimizationInsight[];
}
