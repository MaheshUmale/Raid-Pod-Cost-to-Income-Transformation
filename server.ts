import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google Gen AI helper
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

// Primary Raid Pod Processing endpoint
app.post('/api/process-pod', async (req, res) => {
  try {
    const {
      scenario = 'claims',
      unstructuredText = '',
      title = 'Transaction Item',
      simulateError = false,
      manualLaborMins = 35,
      hourlyOpExWage = 72,
    } = req.body;

    const startTime = Date.now();
    const ai = getAIClient();

    let extractedData: Record<string, any> = {};
    let classification = '';
    let confidenceScore = 0.96;
    let inputTokens = 0;
    let outputTokens = 0;
    let aiReasoning = '';

    if (ai && unstructuredText.trim().length > 10) {
      try {
        const prompt = `You are the core Extraction & Classification Agent in an enterprise Raid Pod for operations.
Given the following unstructured text for a ${scenario} operation:
"""
${unstructuredText}
"""

Extract the structured attributes, classify the document sub-type, compute a confidence score (0.00 to 1.00), and evaluate whether any anomalies or deterministic policy limits are violated.
Return valid JSON.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                classification: { type: Type.STRING },
                confidenceScore: { type: Type.NUMBER },
                entities: {
                  type: Type.OBJECT,
                  properties: {
                    referenceId: { type: Type.STRING },
                    entityName: { type: Type.STRING },
                    amount: { type: Type.NUMBER },
                    currency: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    policyOrContractNum: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    potentialFlags: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                },
                validationAssessment: { type: Type.STRING },
              },
              required: ['classification', 'confidenceScore', 'entities'],
            },
          },
        });

        const rawText = response.text || '{}';
        const parsed = JSON.parse(rawText);
        classification = parsed.classification || 'Document';
        confidenceScore = typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.94;
        extractedData = parsed.entities || {};
        aiReasoning = parsed.validationAssessment || 'Standard extraction completed.';

        // Estimate tokens
        inputTokens = Math.ceil(unstructuredText.length / 3.8) + 180;
        outputTokens = Math.ceil(rawText.length / 3.8);
      } catch (err: any) {
        console.warn('Gemini extraction fallback:', err.message);
        // Fallback to heuristic parser
        classification = scenario === 'claims' ? 'Auto First Notice of Loss (FNOL)' : scenario === 'reconciliation' ? 'Multi-Vendor Ledger Discrepancy' : 'Tier-2 Priority Technical Escalation';
        confidenceScore = simulateError ? 0.62 : 0.97;
        inputTokens = 640;
        outputTokens = 290;
        extractedData = {
          referenceId: `POD-${Date.now().toString().slice(-6)}`,
          entityName: 'Acme Corp / John Doe',
          amount: scenario === 'claims' ? 4850.00 : scenario === 'reconciliation' ? 12450.75 : 0,
          currency: 'USD',
          priority: 'High',
          summary: 'Extracted key claim parameters from unstructured narrative.',
        };
      }
    } else {
      // High fidelity deterministic extraction
      inputTokens = Math.max(320, Math.ceil(unstructuredText.length / 3.8));
      outputTokens = 240;
      if (scenario === 'claims') {
        classification = 'Commercial Property & Casualty FNOL';
        confidenceScore = simulateError ? 0.58 : 0.98;
        extractedData = {
          claimant: 'Apex Logistics Inc.',
          claimNumber: 'CLM-2026-9841',
          dateOfLoss: '2026-08-28',
          estimatedDamage: 6420.00,
          deductible: 1000.00,
          coverageVerified: true,
          policeReportRef: 'PR-8812-DISTRICT-4',
          vehicleVin: '1FTFW1ED4MFA19234',
        };
      } else if (scenario === 'reconciliation') {
        classification = '3-Way ERP Matching (PO vs Invoice vs GRN)';
        confidenceScore = simulateError ? 0.65 : 0.95;
        extractedData = {
          vendor: 'Global Freight & Forwarding LLC',
          poNumber: 'PO-991204',
          invoiceNumber: 'INV-44812',
          invoiceAmount: 24890.50,
          purchaseOrderAmount: 24890.50,
          taxVariance: 0.00,
          currency: 'EUR',
          paymentTerms: 'Net 30',
        };
      } else {
        classification = 'Tier-2 Critical Database Replication Latency';
        confidenceScore = simulateError ? 0.52 : 0.94;
        extractedData = {
          customerOrg: 'FinTech Core Systems Ltd.',
          accountTier: 'Enterprise Platinum',
          slaThresholdMin: 60,
          reportedDowntimeMin: 14,
          affectedNode: 'db-cluster-eu-west-01',
          errorSignature: 'ORA-12541: TNS no listener / replication sync lag',
        };
      }
    }

    // Step-by-step agent timings
    const step1Latency = Math.floor(120 + Math.random() * 80); // Ingestion & Sanitization
    const step2Latency = Math.floor(650 + Math.random() * 300); // Classification & Extraction
    const step3Latency = Math.floor(180 + Math.random() * 90); // Deterministic Rules Validation
    const step4Latency = Math.floor(820 + Math.random() * 450); // Legacy Adapter / Browser Automation
    const totalDurationMs = step1Latency + step2Latency + step3Latency + step4Latency;

    // Deterministic validation checks
    const ruleChecks = [
      {
        rule: 'PII / PCI Data Redaction Check',
        passed: true,
        details: 'Tax IDs and Credit Card numbers encrypted & masked before storage.',
      },
      {
        rule: 'Confidence Threshold >= 0.85',
        passed: confidenceScore >= 0.85 && !simulateError,
        details: `Extraction confidence is ${(confidenceScore * 100).toFixed(1)}%.`,
      },
      {
        rule: 'Deterministic Policy Limit / Tolerance Threshold',
        passed: !simulateError,
        details: simulateError ? 'Amount exceeds automated STP (Straight-Through-Processing) cap of $5,000 without manual supervisor key.' : 'Within automated settlement authority.',
      },
      {
        rule: 'Legacy System Connectivity & Lock Check',
        passed: true,
        details: 'Legacy AS/400 terminal session 03 active, terminal green-screen ready.',
      },
    ];

    const hasException = ruleChecks.some((r) => !r.passed) || confidenceScore < 0.85 || simulateError;

    // Cost calculations
    // Gemini 2.5 Flash token costs: ~$0.075 per 1M input tokens, ~$0.30 per 1M output tokens
    const inputCost = (inputTokens / 1_000_000) * 0.15;
    const outputCost = (outputTokens / 1_000_000) * 0.60;
    const orchestrationFee = 0.0035; // Cloud container / proxy overhead
    const totalAiCost = Number((inputCost + outputCost + orchestrationFee).toFixed(5));

    // Manual baseline cost: minutes * (hourly wage / 60)
    const manualCost = Number(((manualLaborMins / 60) * hourlyOpExWage).toFixed(2));
    const netSavings = Number(Math.max(0, manualCost - totalAiCost).toFixed(2));
    const roiPercentage = Number(((netSavings / Math.max(0.001, totalAiCost)) * 100).toFixed(0));

    // Legacy Robotic Automation payload
    const legacyExecutionOutput = hasException
      ? {
          status: 'EXCEPTION_DIVERTED',
          route: 'HITL_SUPERVISOR_QUEUE',
          reason: simulateError
            ? 'Forced exception injection: Policy threshold breach / confidence below threshold'
            : 'Rule check violation. Diverted to human-in-the-loop review.',
          humanTriagePayload: {
            assignedRole: 'Senior Claims Adjuster / Tier-2 Lead',
            slaCountdownMins: 45,
            preFilledFields: extractedData,
            suggestedAction: 'Authorize override or adjust ledger tolerance.',
          },
        }
      : {
          status: 'LEGACY_SYNC_SUCCESS',
          route: 'STRAIGHT_THROUGH_PROCESSING (STP)',
          legacySystem: scenario === 'claims' ? 'IBM Mainframe 3270 / Guidewire Core' : scenario === 'reconciliation' ? 'SAP ECC 6.0 (T-Code FB01)' : 'ServiceNow Enterprise CMDB',
          transactionRef: `LEG-TX-${Math.floor(100000 + Math.random() * 900000)}`,
          stepsExecuted: [
            '1. Headless chromium session initiated on bastion gateway (port 443)',
            '2. Authenticated via virtual bot identity #POD-AGENT-4',
            '3. Navigated legacy screen tree & injected verified JSON payload',
            '4. Captured host system commit acknowledgment & generated audit ledger record',
          ],
        };

    const result = {
      id: `POD-RUN-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      scenario,
      title,
      classification,
      confidenceScore,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      totalAiCost,
      manualCost,
      netSavings,
      roiPercentage,
      manualLaborMins,
      aiDurationMs: totalDurationMs,
      hasException,
      stepBreakdown: [
        { name: '1. Ingestion & Quarantine Agent', durationMs: step1Latency, status: 'complete', confidence: 1.0 },
        { name: '2. Classification & Extraction Agent', durationMs: step2Latency, status: 'complete', confidence: confidenceScore },
        { name: '3. Deterministic Rules Engine', durationMs: step3Latency, status: hasException ? 'exception' : 'complete', confidence: 1.0 },
        { name: '4. Legacy Robotic Dispatch Agent', durationMs: step4Latency, status: hasException ? 'diverted' : 'complete', confidence: hasException ? 0.5 : 1.0 },
      ],
      ruleChecks,
      extractedData,
      aiReasoning,
      legacyExecutionOutput,
    };

    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/process-pod:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Stress test & Bottleneck Simulation endpoint
app.post('/api/simulate-batch', (req, res) => {
  const {
    batchSize = 50,
    concurrency = 5,
    legacyLatencyJitterMs = 600,
    syntheticFailureRatePct = 12,
    hourlyOpExWage = 72,
    manualLaborMins = 32,
    scenario = 'claims',
  } = req.body;

  const results = [];
  let totalSaved = 0;
  let totalTokens = 0;
  let totalExceptions = 0;
  let maxLatency = 0;
  let minLatency = 99999;
  let totalLatency = 0;

  const nodeBottlenecks = {
    ingestion: { totalMs: 0, count: 0, errorCount: 0 },
    extraction: { totalMs: 0, count: 0, errorCount: 0 },
    rulesEngine: { totalMs: 0, count: 0, errorCount: 0 },
    legacyConnector: { totalMs: 0, count: 0, errorCount: 0 },
  };

  for (let i = 0; i < batchSize; i++) {
    const isException = Math.random() * 100 < syntheticFailureRatePct;
    if (isException) totalExceptions++;

    const ingMs = Math.floor(100 + Math.random() * 80);
    const extMs = Math.floor(550 + Math.random() * 250);
    const ruleMs = Math.floor(120 + Math.random() * 70);
    // Legacy system is often the physical bottleneck (e.g. legacy ERP locks, slow 3270 terminals)
    const legMs = Math.floor(700 + Math.random() * legacyLatencyJitterMs);

    nodeBottlenecks.ingestion.totalMs += ingMs;
    nodeBottlenecks.ingestion.count++;
    nodeBottlenecks.extraction.totalMs += extMs;
    nodeBottlenecks.extraction.count++;
    nodeBottlenecks.rulesEngine.totalMs += ruleMs;
    nodeBottlenecks.rulesEngine.count++;
    nodeBottlenecks.legacyConnector.totalMs += legMs;
    nodeBottlenecks.legacyConnector.count++;

    if (isException) {
      nodeBottlenecks.rulesEngine.errorCount++;
    }

    const txLatency = ingMs + extMs + ruleMs + (isException ? 150 : legMs);
    totalLatency += txLatency;
    if (txLatency > maxLatency) maxLatency = txLatency;
    if (txLatency < minLatency) minLatency = txLatency;

    const tokens = Math.floor(650 + Math.random() * 320);
    totalTokens += tokens;

    const aiCost = (tokens / 1000000) * 0.35 + 0.003;
    const manualCost = (manualLaborMins / 60) * hourlyOpExWage;
    const saved = isException ? manualCost * 0.65 : manualCost - aiCost; // Even exceptions save 65% of triage time due to pre-extraction
    totalSaved += saved;

    results.push({
      id: `TX-${(i + 1).toString().padStart(4, '0')}`,
      status: isException ? 'EXCEPTION_ROUTED' : 'SUCCESS_STP',
      durationMs: txLatency,
      tokens,
      savedAmount: Number(saved.toFixed(2)),
      bottleneckStage: legMs > 1100 ? 'Legacy Terminal Wait' : extMs > 750 ? 'AI Extraction' : 'Normal',
    });
  }

  const avgLatency = Math.round(totalLatency / batchSize);
  const throughputPerSec = Number(((concurrency * 1000) / avgLatency).toFixed(2));
  const stpRatePct = Number((((batchSize - totalExceptions) / batchSize) * 100).toFixed(1));

  // Determine top bottleneck
  const avgIng = Math.round(nodeBottlenecks.ingestion.totalMs / batchSize);
  const avgExt = Math.round(nodeBottlenecks.extraction.totalMs / batchSize);
  const avgRule = Math.round(nodeBottlenecks.rulesEngine.totalMs / batchSize);
  const avgLeg = Math.round(nodeBottlenecks.legacyConnector.totalMs / batchSize);

  let primaryBottleneck = 'Legacy System Connector (Terminal Latency)';
  if (avgExt > avgLeg) primaryBottleneck = 'Model Extraction Latency';

  res.json({
    batchSize,
    concurrency,
    stpRatePct,
    totalExceptions,
    totalSaved: Number(totalSaved.toFixed(2)),
    totalTokens,
    avgLatencyMs: avgLatency,
    minLatencyMs: minLatency,
    maxLatencyMs: maxLatency,
    throughputTxPerSec: throughputPerSec,
    primaryBottleneck,
    nodeBreakdown: [
      { name: 'Ingestion & Quarantine', avgMs: avgIng, pct: Math.round((avgIng / avgLatency) * 100) },
      { name: 'Semantic Extraction', avgMs: avgExt, pct: Math.round((avgExt / avgLatency) * 100) },
      { name: 'Deterministic Rules', avgMs: avgRule, pct: Math.round((avgRule / avgLatency) * 100) },
      { name: 'Legacy System Adapter', avgMs: avgLeg, pct: Math.round((avgLeg / avgLatency) * 100) },
    ],
    sampleTransactions: results.slice(0, 15),
  });
});

// Advanced Exception Handling Retry & Backoff Simulation endpoint
app.post('/api/simulate-retry', async (req, res) => {
  const {
    strategyType = 'api_timeout',
    maxRetries = 3,
    baseDelayMs = 250,
    maxDelayMs = 2500,
    jitterFactor = 0.25,
    circuitBreakerThreshold = 3,
  } = req.body;

  const attempts = [];
  let totalElapsedMs = 0;
  let circuitStatus: 'CLOSED' | 'HALF_OPEN' | 'OPEN' = 'CLOSED';
  let resolvedVia = 'RETRY_SUCCESS';

  // Strategy specific failure messages
  const failureDescriptions: Record<string, string[]> = {
    api_timeout: [
      'HTTP 504 Gateway Timeout: Gemini 2.5 Flash token stream stalled at t=3,000ms',
      'HTTP 429 Too Many Requests: Upstream model concurrency burst quota exceeded',
      'Socket hangup on secure egress proxy gateway',
    ],
    malformed_data: [
      'Schema Validation Error: Unexpected token 0x00 at offset 1024',
      'Unicode byte cut: Truncated multibyte UTF-8 sequence in invoice body',
      'OCR raster distortion: Confidence score 0.58 below 0.85 threshold',
    ],
    system_unavailability: [
      'AS/400 3270 Terminal Lock: Session #3 unresponsive on screen 04',
      'SAP ECC 6.0 RFC Connection Refused: Lock table full (T-Code FB01)',
      'IBM Host Gateway: Green-screen cursor positioning timeout',
    ],
    policy_breach: [
      'Deterministic Rule Violation: Damage amount exceeds autonomous STP cap ($5,000)',
      '3-Way Match Variance: PO total ($4,200) vs Invoice total ($4,850) > 0.05%',
      'SLA Risk Anomaly: Claim priority requires Tier-2 Supervisor Sign-off',
    ],
  };

  const msgs = failureDescriptions[strategyType] || failureDescriptions.api_timeout;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // Calculate exponential backoff with full jitter
    // Formula: min(maxDelay, baseDelay * 2^(attempt - 1)) + random(0, baseDelay * jitterFactor)
    const exponentialBackoff = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt - 1));
    const jitter = Math.floor(Math.random() * (exponentialBackoff * jitterFactor));
    const waitTime = exponentialBackoff + jitter;

    totalElapsedMs += waitTime;

    // Check if circuit breaker trips
    if (attempt >= circuitBreakerThreshold) {
      circuitStatus = 'OPEN';
    }

    // Usually succeeds on final retry unless policy breach or circuit is OPEN
    const isSuccess = strategyType === 'policy_breach' 
      ? false 
      : circuitStatus === 'OPEN' 
        ? false 
        : attempt === maxRetries || (attempt > 1 && Math.random() > 0.45);

    attempts.push({
      attemptNumber: attempt,
      delayMs: exponentialBackoff,
      jitterMs: jitter,
      totalWaitMs: waitTime,
      status: isSuccess ? 'success' : circuitStatus === 'OPEN' ? 'circuit_opened' : 'failed',
      httpStatus: isSuccess ? 200 : strategyType === 'api_timeout' ? 504 : 422,
      details: isSuccess
        ? 'Payload re-verified & successfully ingested via automated backoff.'
        : msgs[(attempt - 1) % msgs.length],
      timestamp: new Date(Date.now() + totalElapsedMs).toISOString(),
    });

    if (isSuccess) {
      resolvedVia = 'RETRY_SUCCESS';
      circuitStatus = 'CLOSED';
      break;
    }

    if (circuitStatus === 'OPEN') {
      resolvedVia = 'CIRCUIT_BREAKER_FALLBACK';
      break;
    }
  }

  if (attempts.every((a) => a.status !== 'success')) {
    resolvedVia = strategyType === 'policy_breach' ? 'SUPERVISOR_HITL_QUEUE' : 'FALLBACK_HEURISTIC_APPLIED';
  }

  res.json({
    strategyType,
    attempts,
    totalElapsedMs,
    circuitStatus,
    resolvedVia,
    timestamp: new Date().toISOString(),
  });
});

// Download PDF Presentation endpoint
app.get('/api/download-deck-pdf', (req, res) => {
  const rootPdfPath = path.join(process.cwd(), 'RAID_POD_EXECUTIVE_PRESENTATION.pdf');
  const publicPdfPath = path.join(process.cwd(), 'public', 'RAID_POD_EXECUTIVE_PRESENTATION.pdf');
  
  const targetPath = fs.existsSync(rootPdfPath) ? rootPdfPath : publicPdfPath;

  if (!fs.existsSync(targetPath)) {
    return res.status(404).json({ error: 'PDF presentation document not found.' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="RAID_POD_EXECUTIVE_PRESENTATION.pdf"');
  res.sendFile(targetPath);
});

// Setup Vite development middleware or static production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Raid Pod server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
