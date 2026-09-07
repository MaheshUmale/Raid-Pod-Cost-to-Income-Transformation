const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createPresentationPDF() {
  const pdfDoc = await PDFDocument.create();

  // Load standard fonts
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontCourier = await pdfDoc.embedFont(StandardFonts.Courier);
  const fontCourierBold = await pdfDoc.embedFont(StandardFonts.CourierBold);

  // A4 Landscape dimensions in points: 841.89 x 595.28
  const PAGE_WIDTH = 842;
  const PAGE_HEIGHT = 595;

  // Color Palette
  const darkBg = rgb(0.08, 0.08, 0.09); // #141417
  const cardBg = rgb(0.12, 0.12, 0.14); // #1f1f24
  const lightBg = rgb(0.98, 0.98, 0.98); // #fafafa
  const white = rgb(1, 1, 1);
  const textDark = rgb(0.12, 0.11, 0.10); // #1c1917
  const textMuted = rgb(0.45, 0.43, 0.40); // #736f66
  const amberAccent = rgb(0.96, 0.62, 0.05); // #f59e0b
  const amberDark = rgb(0.70, 0.40, 0.02);
  const emeraldAccent = rgb(0.06, 0.72, 0.44); // #10b981
  const blueAccent = rgb(0.23, 0.51, 0.96); // #3b82f6
  const borderGrey = rgb(0.85, 0.84, 0.82);

  // Load generated images if available
  let heroImage = null;
  let execImage = null;

  const heroImagePath = path.join(__dirname, '../src/assets/images/raid_pod_hero_visual_1788792902775.jpg');
  const execImagePath = path.join(__dirname, '../src/assets/images/raid_pod_exec_deck_1788792927201.jpg');

  try {
    if (fs.existsSync(heroImagePath)) {
      const heroBytes = fs.readFileSync(heroImagePath);
      heroImage = await pdfDoc.embedJpg(heroBytes);
    }
    if (fs.existsSync(execImagePath)) {
      const execBytes = fs.readFileSync(execImagePath);
      execImage = await pdfDoc.embedJpg(execBytes);
    }
  } catch (err) {
    console.warn('Image embed warning:', err.message);
  }

  // Helper to draw common slide header
  function drawSlideHeader(page, slideNumber, totalSlides, category, title) {
    // Header bar
    page.drawRectangle({
      x: 40,
      y: PAGE_HEIGHT - 55,
      width: PAGE_WIDTH - 80,
      height: 1,
      color: borderGrey,
    });

    page.drawRectangle({
      x: 40,
      y: PAGE_HEIGHT - 45,
      width: 24,
      height: 24,
      color: darkBg,
    });

    page.drawText('RP', {
      x: 45,
      y: PAGE_HEIGHT - 38,
      size: 11,
      font: fontCourierBold,
      color: amberAccent,
    });

    page.drawText('RAID POD: COST-TO-INCOME TRANSFORMATION', {
      x: 74,
      y: PAGE_HEIGHT - 34,
      size: 10,
      font: fontHelveticaBold,
      color: textDark,
    });

    page.drawText(`SLIDE ${slideNumber} OF ${totalSlides} • ${category}`, {
      x: PAGE_WIDTH - 240,
      y: PAGE_HEIGHT - 34,
      size: 9,
      font: fontCourier,
      color: textMuted,
    });

    // Slide Title
    page.drawText(title, {
      x: 40,
      y: PAGE_HEIGHT - 85,
      size: 20,
      font: fontHelveticaBold,
      color: textDark,
    });
  }

  // Helper to draw common slide footer
  function drawSlideFooter(page) {
    page.drawRectangle({
      x: 40,
      y: 40,
      width: PAGE_WIDTH - 80,
      height: 1,
      color: borderGrey,
    });

    page.drawText('CONFIDENTIAL & PROPRIETARY • PREPARED FOR INSTITUTIONAL EXECUTIVE LEADERSHIP', {
      x: 40,
      y: 25,
      size: 8,
      font: fontCourier,
      color: textMuted,
    });

    page.drawText('© 2026 RAID POD OPERATIONAL SYSTEMS • SECURE CLOUD & ON-PREM DEPLOYMENTS', {
      x: PAGE_WIDTH - 420,
      y: 25,
      size: 8,
      font: fontCourier,
      color: textMuted,
    });
  }

  // ==========================================
  // SLIDE 1: COVER SLIDE
  // ==========================================
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    // Dark sleek background for cover
    page.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      color: darkBg,
    });

    // Accent line at top
    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 8,
      width: PAGE_WIDTH,
      height: 8,
      color: amberAccent,
    });

    // Tag
    page.drawRectangle({
      x: 50,
      y: PAGE_HEIGHT - 80,
      width: 280,
      height: 24,
      color: rgb(0.2, 0.15, 0.05),
      borderColor: amberDark,
      borderWidth: 1,
    });
    page.drawText('ENTERPRISE BACK-OFFICE TRANSFORMATION', {
      x: 60,
      y: PAGE_HEIGHT - 73,
      size: 9,
      font: fontCourierBold,
      color: amberAccent,
    });

    // Main Title
    page.drawText('RAID POD: COST-TO-INCOME', {
      x: 50,
      y: PAGE_HEIGHT - 130,
      size: 32,
      font: fontHelveticaBold,
      color: white,
    });
    page.drawText('TRANSFORMATION PLATFORM', {
      x: 50,
      y: PAGE_HEIGHT - 170,
      size: 32,
      font: fontHelveticaBold,
      color: amberAccent,
    });

    // Subtitle
    page.drawText(
      'Autonomous Multi-Agent Pod Intercepting Unstructured Inbound Documents,',
      { x: 50, y: PAGE_HEIGHT - 210, size: 13, font: fontHelvetica, color: rgb(0.8, 0.8, 0.8) }
    );
    page.drawText(
      'Enforcing Deterministic Validation, and Committing Directly to Core Legacy Mainframes.',
      { x: 50, y: PAGE_HEIGHT - 230, size: 13, font: fontHelvetica, color: rgb(0.8, 0.8, 0.8) }
    );

    // 3 Stat Cards on Left
    const cardY = 180;
    const cardW = 125;
    const cardH = 80;

    // Stat 1
    page.drawRectangle({ x: 50, y: cardY, width: cardW, height: cardH, color: cardBg });
    page.drawText('$0.42', { x: 62, y: cardY + 45, size: 24, font: fontHelveticaBold, color: white });
    page.drawText('COST / TX', { x: 62, y: cardY + 28, size: 9, font: fontCourierBold, color: amberAccent });
    page.drawText('vs $28.50 Manual', { x: 62, y: cardY + 14, size: 8, font: fontHelvetica, color: textMuted });

    // Stat 2
    page.drawRectangle({ x: 190, y: cardY, width: cardW, height: cardH, color: cardBg });
    page.drawText('88.4%', { x: 202, y: cardY + 45, size: 24, font: fontHelveticaBold, color: emeraldAccent });
    page.drawText('STP RATE', { x: 202, y: cardY + 28, size: 9, font: fontCourierBold, color: emeraldAccent });
    page.drawText('Straight-Through', { x: 202, y: cardY + 14, size: 8, font: fontHelvetica, color: textMuted });

    // Stat 3
    page.drawRectangle({ x: 330, y: cardY, width: cardW, height: cardH, color: cardBg });
    page.drawText('< 1.2s', { x: 342, y: cardY + 45, size: 24, font: fontHelveticaBold, color: blueAccent });
    page.drawText('LATENCY', { x: 342, y: cardY + 28, size: 9, font: fontCourierBold, color: blueAccent });
    page.drawText('End-to-End Execution', { x: 342, y: cardY + 14, size: 8, font: fontHelvetica, color: textMuted });

    // Hero Image Embed on Right
    if (heroImage) {
      const imgW = 340;
      const imgH = 191; // 16:9 ratio
      const imgX = PAGE_WIDTH - 50 - imgW;
      const imgY = PAGE_HEIGHT - 320;

      page.drawRectangle({
        x: imgX - 4,
        y: imgY - 4,
        width: imgW + 8,
        height: imgH + 8,
        color: rgb(0.2, 0.2, 0.25),
      });

      page.drawImage(heroImage, {
        x: imgX,
        y: imgY,
        width: imgW,
        height: imgH,
      });

      page.drawText('Autonomous Neural Agent Pipeline Architecture', {
        x: imgX,
        y: imgY - 18,
        size: 9,
        font: fontCourier,
        color: rgb(0.6, 0.6, 0.6),
      });
    }

    // Cover Footer
    page.drawText('PREPARED FOR: CHIEF OPERATING OFFICERS, CFOs & HEADS OF SHARED SERVICES', {
      x: 50,
      y: 70,
      size: 10,
      font: fontCourierBold,
      color: amberAccent,
    });
    page.drawText('GLOBAL ENTERPRISE EDITION • CONFIDENTIAL EXECUTIVE BRIEFING', {
      x: 50,
      y: 50,
      size: 9,
      font: fontCourier,
      color: textMuted,
    });
  }

  // ==========================================
  // SLIDE 2: THE PROBLEM STATEMENT
  // ==========================================
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    drawSlideHeader(page, 2, 6, 'MARKET OPPORTUNITY', 'The $1.8 Trillion Back-Office Friction Point');

    page.drawText(
      'Enterprise operations remain tethered to swivel-chair data entry, manual document reviews, and fragile legacy automation.',
      { x: 40, y: PAGE_HEIGHT - 110, size: 11, font: fontHelvetica, color: textMuted }
    );

    const colW = 235;
    const colH = 340;
    const colY = 120;

    // Box 1
    page.drawRectangle({
      x: 40,
      y: colY,
      width: colW,
      height: colH,
      color: lightBg,
      borderColor: borderGrey,
      borderWidth: 1,
    });
    page.drawRectangle({ x: 55, y: colY + colH - 45, width: 30, height: 30, color: rgb(0.95, 0.85, 0.85) });
    page.drawText('$', { x: 65, y: colY + colH - 37, size: 18, font: fontHelveticaBold, color: rgb(0.8, 0.2, 0.2) });

    page.drawText('The $28.50 Manual Trap', { x: 55, y: colY + colH - 70, size: 14, font: fontHelveticaBold, color: textDark });
    page.drawText('Fully burdened operational labor costs for', { x: 55, y: colY + colH - 95, size: 10, font: fontHelvetica, color: textMuted });
    page.drawText('manual verification, cross-field checks,', { x: 55, y: colY + colH - 110, size: 10, font: fontHelvetica, color: textMuted });
    page.drawText('and green-screen keying average $28.50/tx', { x: 55, y: colY + colH - 125, size: 10, font: fontHelvetica, color: textMuted });
    page.drawText('across North America and Europe.', { x: 55, y: colY + colH - 140, size: 10, font: fontHelvetica, color: textMuted });

    page.drawRectangle({ x: 55, y: colY + 30, width: colW - 30, height: 45, color: rgb(0.98, 0.90, 0.90) });
    page.drawText('100,000 txs = $2.85M/yr', { x: 65, y: colY + 55, size: 11, font: fontCourierBold, color: rgb(0.7, 0.1, 0.1) });
    page.drawText('Direct unrecoverable labor overhead', { x: 65, y: colY + 40, size: 8, font: fontHelvetica, color: rgb(0.5, 0.1, 0.1) });

    // Box 2
    page.drawRectangle({
      x: 305,
      y: colY,
      width: colW,
      height: colH,
      color: lightBg,
      borderColor: borderGrey,
      borderWidth: 1,
    });
    page.drawRectangle({ x: 320, y: colY + colH - 45, width: 30, height: 30, color: rgb(0.98, 0.92, 0.80) });
    page.drawText('T', { x: 330, y: colY + colH - 37, size: 18, font: fontHelveticaBold, color: amberDark });

    page.drawText('48-Hour SLA Delays', { x: 320, y: colY + colH - 70, size: 14, font: fontHelveticaBold, color: textDark });
    page.drawText('Inbound invoices and claims sit in queues', { x: 320, y: colY + colH - 95, size: 10, font: fontHelvetica, color: textMuted });
    page.drawText('for 2 to 4 business days. Causes missed', { x: 320, y: colY + colH - 110, size: 10, font: fontHelvetica, color: textMuted });
    page.drawText('early-payment discounts (2/10 net 30) and', { x: 320, y: colY + colH - 125, size: 10, font: fontHelvetica, color: textMuted });
    page.drawText('strains counterparty vendor relationships.', { x: 320, y: colY + colH - 140, size: 10, font: fontHelvetica, color: textMuted });

    page.drawRectangle({ x: 320, y: colY + 30, width: colW - 30, height: 45, color: rgb(0.99, 0.95, 0.88) });
    page.drawText('$4.2M Working Capital Drag', { x: 330, y: colY + 55, size: 11, font: fontCourierBold, color: amberDark });
    page.drawText('Forfeited discounts per quarter', { x: 330, y: colY + 40, size: 8, font: fontHelvetica, color: amberDark });

    // Box 3
    page.drawRectangle({
      x: 570,
      y: colY,
      width: colW,
      height: colH,
      color: lightBg,
      borderColor: borderGrey,
      borderWidth: 1,
    });
    page.drawRectangle({ x: 585, y: colY + colH - 45, width: 30, height: 30, color: rgb(0.92, 0.88, 0.98) });
    page.drawText('X', { x: 595, y: colY + colH - 37, size: 18, font: fontHelveticaBold, color: rgb(0.5, 0.2, 0.8) });

    page.drawText('Brittle RPA Bot Failures', { x: 585, y: colY + colH - 70, size: 14, font: fontHelveticaBold, color: textDark });
    page.drawText('Robotic Process Automation scripts break', { x: 585, y: colY + colH - 95, size: 10, font: fontHelvetica, color: textMuted });
    page.drawText('whenever a PDF layout shifts by 2 pixels', { x: 585, y: colY + colH - 110, size: 10, font: fontHelvetica, color: textMuted });
    page.drawText('or a vendor adds a line item, requiring', { x: 585, y: colY + colH - 125, size: 10, font: fontHelvetica, color: textMuted });
    page.drawText('continuous IT re-engineering.', { x: 585, y: colY + colH - 140, size: 10, font: fontHelvetica, color: textMuted });

    page.drawRectangle({ x: 585, y: colY + 30, width: colW - 30, height: 45, color: rgb(0.95, 0.92, 0.99) });
    page.drawText('Failures Every 42 Days', { x: 595, y: colY + 55, size: 11, font: fontCourierBold, color: rgb(0.4, 0.1, 0.7) });
    page.drawText('Average break rate for RPA bots', { x: 595, y: colY + 40, size: 8, font: fontHelvetica, color: rgb(0.4, 0.1, 0.7) });

    drawSlideFooter(page);
  }

  // ==========================================
  // SLIDE 3: THE MULTI-AGENT ARCHITECTURE
  // ==========================================
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    drawSlideHeader(page, 3, 6, 'SYSTEM BLUEPRINT', 'The 4-Agent Autonomous Raid Pod Pipeline');

    page.drawText(
      'Synchronized orchestration combining multimodal visual recognition with deterministic validation and mainframe terminal emulation.',
      { x: 40, y: PAGE_HEIGHT - 110, size: 11, font: fontHelvetica, color: textMuted }
    );

    const stepW = 175;
    const stepH = 260;
    const stepY = 180;
    const gap = 20;

    const agents = [
      {
        num: '01',
        name: 'Extraction Agent',
        latency: '280ms',
        color: amberAccent,
        desc: 'Multimodal document comprehension. Ingests invoices, ACORD forms, BOLs & faxes. Maps fields to strongly typed JSON schemas.',
      },
      {
        num: '02',
        name: 'Validation Agent',
        latency: '140ms',
        color: emeraldAccent,
        desc: 'Deterministic mathematical audit. Verifies tax calculations, subtotal integrity, line-item multiplication, and PEP/OFAC watchlists.',
      },
      {
        num: '03',
        name: 'Reconciliation Agent',
        latency: '190ms',
        color: blueAccent,
        desc: '3-way automated matching against Purchase Orders and warehouse Goods Received Notes. Detects duplicate invoices.',
      },
      {
        num: '04',
        name: '3270 Terminal Bridge',
        latency: '230ms',
        color: rgb(0.6, 0.3, 0.9),
        desc: 'Headless Telnet TN3270 session driver. Automates buffer keying, cursor positioning, and atomic commits into CICS & SAP.',
      },
    ];

    agents.forEach((ag, i) => {
      const x = 40 + i * (stepW + gap);
      page.drawRectangle({
        x: x,
        y: stepY,
        width: stepW,
        height: stepH,
        color: cardBg,
      });

      // Step Tag
      page.drawText(`AGENT ${ag.num}`, { x: x + 15, y: stepY + stepH - 30, size: 11, font: fontCourierBold, color: ag.color });
      page.drawText(ag.latency, { x: x + stepW - 55, y: stepY + stepH - 30, size: 9, font: fontCourier, color: textMuted });

      page.drawText(ag.name, { x: x + 15, y: stepY + stepH - 55, size: 13, font: fontHelveticaBold, color: white });

      // Description lines
      const words = ag.desc.split(' ');
      let line = '';
      let curY = stepY + stepH - 85;
      for (const w of words) {
        if ((line + w).length > 22) {
          page.drawText(line, { x: x + 15, y: curY, size: 9, font: fontHelvetica, color: rgb(0.75, 0.75, 0.75) });
          line = w + ' ';
          curY -= 14;
        } else {
          line += w + ' ';
        }
      }
      if (line) {
        page.drawText(line, { x: x + 15, y: curY, size: 9, font: fontHelvetica, color: rgb(0.75, 0.75, 0.75) });
      }

      // Connecting arrow
      if (i < 3) {
        page.drawText('->', { x: x + stepW + 4, y: stepY + stepH / 2, size: 14, font: fontCourierBold, color: amberAccent });
      }
    });

    // Safeguard Banner at Bottom
    page.drawRectangle({
      x: 40,
      y: 90,
      width: PAGE_WIDTH - 80,
      height: 65,
      color: lightBg,
      borderColor: amberAccent,
      borderWidth: 1,
    });
    page.drawText('ZERO-KEYING SUPERVISOR SAFEGUARD & CIRCUIT BREAKER', {
      x: 60,
      y: 132,
      size: 11,
      font: fontCourierBold,
      color: amberDark,
    });
    page.drawText(
      'When policy variances (>2%) or legacy locks occur, exceptions route to human supervisors with pre-computed visual diffs.',
      { x: 60, y: 116, size: 9, font: fontHelvetica, color: textDark }
    );
    page.drawText(
      'Operators resolve triage packets with a single click in <15 seconds without ever re-typing data. 100% audit logging.',
      { x: 60, y: 102, size: 9, font: fontHelvetica, color: textMuted }
    );

    drawSlideFooter(page);
  }

  // ==========================================
  // SLIDE 4: UNIT ECONOMICS & ROI
  // ==========================================
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    drawSlideHeader(page, 4, 6, 'FINANCIAL MODEL', '98.5% Net OpEx Reduction: Transforming Unit Economics');

    page.drawText(
      'Replacing fixed operational payroll overhead with variable, sub-cent agentic micro-compute.',
      { x: 40, y: PAGE_HEIGHT - 110, size: 11, font: fontHelvetica, color: textMuted }
    );

    // Left Column: The Math
    const leftW = 410;
    page.drawRectangle({
      x: 40,
      y: 100,
      width: leftW,
      height: 340,
      color: lightBg,
      borderColor: borderGrey,
      borderWidth: 1,
    });

    page.drawText('BENCHMARK: 150,000 TRANSACTIONS / YEAR', {
      x: 60,
      y: 410,
      size: 11,
      font: fontCourierBold,
      color: textDark,
    });

    // Row 1: Manual
    page.drawRectangle({ x: 60, y: 340, width: leftW - 40, height: 50, color: rgb(0.95, 0.95, 0.95) });
    page.drawText('Manual Human Baseline (150k @ $28.50/tx)', { x: 75, y: 368, size: 10, font: fontHelveticaBold, color: textDark });
    page.drawText('$4,275,000 / year', { x: 75, y: 350, size: 14, font: fontCourierBold, color: rgb(0.7, 0.2, 0.2) });

    // Row 2: Raid Pod
    page.drawRectangle({ x: 60, y: 270, width: leftW - 40, height: 55, color: rgb(0.92, 0.98, 0.94) });
    page.drawText('Raid Pod Autonomous Operations (88.4% STP)', { x: 75, y: 305, size: 10, font: fontHelveticaBold, color: emeraldAccent });
    page.drawText('132,600 STP @ $0.42  +  17,400 HITL @ $4.10', { x: 75, y: 290, size: 8, font: fontCourier, color: textMuted });
    page.drawText('$127,032 / year', { x: 75, y: 276, size: 14, font: fontCourierBold, color: emeraldAccent });

    // Row 3: Net Savings
    page.drawRectangle({ x: 60, y: 190, width: leftW - 40, height: 65, color: darkBg });
    page.drawText('NET ANNUAL OPEX SAVINGS', { x: 75, y: 232, size: 10, font: fontCourierBold, color: amberAccent });
    page.drawText('+$4,147,968 / year', { x: 75, y: 205, size: 20, font: fontHelveticaBold, color: emeraldAccent });

    // KPIs below
    page.drawText('CAPITAL PAYBACK PERIOD: 42 Operating Days', { x: 60, y: 155, size: 10, font: fontCourierBold, color: textDark });
    page.drawText('3-YEAR CUMULATIVE ROI: 1,480%', { x: 60, y: 135, size: 10, font: fontCourierBold, color: emeraldAccent });
    page.drawText('BREAK-EVEN TRANSACTION VOLUME: 4,820 transactions', { x: 60, y: 115, size: 9, font: fontCourier, color: textMuted });

    // Right Column: Embed Image or Chart
    if (execImage) {
      const imgW = 320;
      const imgH = 180;
      const imgX = PAGE_WIDTH - 40 - imgW;
      const imgY = 220;

      page.drawRectangle({
        x: imgX - 3,
        y: imgY - 3,
        width: imgW + 6,
        height: imgH + 6,
        color: borderGrey,
      });

      page.drawImage(execImage, {
        x: imgX,
        y: imgY,
        width: imgW,
        height: imgH,
      });

      page.drawText('Predictive Operational Intelligence & Cost Curves', {
        x: imgX,
        y: imgY - 16,
        size: 9,
        font: fontCourier,
        color: textMuted,
      });
    }

    // Right Bottom Callout
    page.drawRectangle({
      x: PAGE_WIDTH - 360,
      y: 100,
      width: 320,
      height: 90,
      color: lightBg,
      borderColor: borderGrey,
      borderWidth: 1,
    });
    page.drawText('LABOR REALLOCATION DIVIDEND', { x: PAGE_WIDTH - 345, y: 165, size: 10, font: fontCourierBold, color: textDark });
    page.drawText('Rather than head-count reduction, leading enterprises', { x: PAGE_WIDTH - 345, y: 148, size: 8, font: fontHelvetica, color: textMuted });
    page.drawText('redeploy 80%+ of back-office staff to high-value client', { x: PAGE_WIDTH - 345, y: 136, size: 8, font: fontHelvetica, color: textMuted });
    page.drawText('relationship management and complex dispute resolution.', { x: PAGE_WIDTH - 345, y: 124, size: 8, font: fontHelvetica, color: textMuted });

    drawSlideFooter(page);
  }

  // ==========================================
  // SLIDE 5: ENTERPRISE CASE STUDIES
  // ==========================================
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    drawSlideHeader(page, 5, 6, 'PROVEN RESULTS', 'Validated at Global Fortune 500 Enterprise Scale');

    page.drawText(
      'Realized operational impact across commercial logistics, property & casualty insurance, and financial clearing.',
      { x: 40, y: PAGE_HEIGHT - 110, size: 11, font: fontHelvetica, color: textMuted }
    );

    const cardW = 365;
    const cardH = 330;
    const cardY = 110;

    // Case 1: Global Logistics
    page.drawRectangle({
      x: 40,
      y: cardY,
      width: cardW,
      height: cardH,
      color: lightBg,
      borderColor: borderGrey,
      borderWidth: 1,
    });

    page.drawText('CASE STUDY 01', { x: 60, y: cardY + cardH - 30, size: 9, font: fontCourierBold, color: blueAccent });
    page.drawText('Top-5 Global Freight & Logistics Provider', { x: 60, y: cardY + cardH - 50, size: 14, font: fontHelveticaBold, color: textDark });
    page.drawText('450,000 International Bills of Lading & Customs Filings / Year', { x: 60, y: cardY + cardH - 68, size: 9, font: fontCourier, color: textMuted });

    page.drawText('Operational Challenge:', { x: 60, y: cardY + cardH - 95, size: 10, font: fontHelveticaBold, color: textDark });
    page.drawText('120 full-time specialists in 4 regional shared services', { x: 60, y: cardY + cardH - 110, size: 9, font: fontHelvetica, color: textMuted });
    page.drawText('centers manually transcribing multilingual bills into an', { x: 60, y: cardY + cardH - 124, size: 9, font: fontHelvetica, color: textMuted });
    page.drawText('IBM AS/400 terminal. Average backlog: 6 hours.', { x: 60, y: cardY + cardH - 138, size: 9, font: fontHelvetica, color: textMuted });

    page.drawText('Raid Pod Results (90-Day Deployment):', { x: 60, y: cardY + cardH - 165, size: 10, font: fontHelveticaBold, color: textDark });

    const stats1 = [
      { label: 'STP RATE', val: '89.2%' },
      { label: 'PROCESSING LATENCY', val: '820 ms' },
      { label: 'ANNUAL OPEX SAVED', val: '$11.8M' },
    ];
    stats1.forEach((st, idx) => {
      const sy = cardY + cardH - 200 - idx * 38;
      page.drawRectangle({ x: 60, y: sy, width: cardW - 40, height: 32, color: white, borderColor: borderGrey, borderWidth: 1 });
      page.drawText(st.label, { x: 75, y: sy + 11, size: 9, font: fontCourierBold, color: textMuted });
      page.drawText(st.val, { x: cardW - 30, y: sy + 10, size: 13, font: fontHelveticaBold, color: emeraldAccent });
    });

    // Case 2: P&C Insurance Underwriting
    page.drawRectangle({
      x: 435,
      y: cardY,
      width: cardW,
      height: cardH,
      color: lightBg,
      borderColor: borderGrey,
      borderWidth: 1,
    });

    page.drawText('CASE STUDY 02', { x: 455, y: cardY + cardH - 30, size: 9, font: fontCourierBold, color: rgb(0.6, 0.2, 0.8) });
    page.drawText('Multinational P&C Insurance Carrier', { x: 455, y: cardY + cardH - 50, size: 14, font: fontHelveticaBold, color: textDark });
    page.drawText('180,000 ACORD 125 Commercial Property Submissions / Year', { x: 455, y: cardY + cardH - 68, size: 9, font: fontCourier, color: textMuted });

    page.drawText('Operational Challenge:', { x: 455, y: cardY + cardH - 95, size: 10, font: fontHelveticaBold, color: textDark });
    page.drawText('Commercial property applications delayed by 3 business', { x: 455, y: cardY + cardH - 110, size: 9, font: fontHelvetica, color: textMuted });
    page.drawText('days due to complex schedule-of-values re-keying.', { x: 455, y: cardY + cardH - 124, size: 9, font: fontHelvetica, color: textMuted });
    page.drawText('Caused high quote abandonment to faster competitors.', { x: 455, y: cardY + cardH - 138, size: 9, font: fontHelvetica, color: textMuted });

    page.drawText('Raid Pod Results (60-Day Deployment):', { x: 455, y: cardY + cardH - 165, size: 10, font: fontHelveticaBold, color: textDark });

    const stats2 = [
      { label: 'STP RATE', val: '91.4%' },
      { label: 'POLICY BIND ACCELERATION', val: '+28%' },
      { label: 'COMPLIANCE DEFECT RATE', val: '0.00%' },
    ];
    stats2.forEach((st, idx) => {
      const sy = cardY + cardH - 200 - idx * 38;
      page.drawRectangle({ x: 455, y: sy, width: cardW - 40, height: 32, color: white, borderColor: borderGrey, borderWidth: 1 });
      page.drawText(st.label, { x: 470, y: sy + 11, size: 9, font: fontCourierBold, color: textMuted });
      page.drawText(st.val, { x: 435 + cardW - 45, y: sy + 10, size: 13, font: fontHelveticaBold, color: emeraldAccent });
    });

    drawSlideFooter(page);
  }

  // ==========================================
  // SLIDE 6: SECURITY, RBAC & ROADMAP
  // ==========================================
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    drawSlideHeader(page, 6, 6, 'ENTERPRISE GOVERNANCE', 'Institutional Security & 90-Day Implementation Blueprint');

    page.drawText(
      'Built to comply with strict tier-1 financial and healthcare regulatory mandates from day one.',
      { x: 40, y: PAGE_HEIGHT - 110, size: 11, font: fontHelvetica, color: textMuted }
    );

    // 3 Security Pillars
    const pillW = 235;
    const pillH = 140;
    const pillY = 300;

    const securityPillars = [
      {
        title: 'Zero Data Retention (PII)',
        desc: 'Sensitive customer identifiers, tax numbers, and bank account numbers are redacted and salted before model inference.',
      },
      {
        title: 'Role-Based Access Control',
        desc: 'Strict separation of duties across Administrators, Operators, and Analysts prevents unauthorized tolerance overrides.',
      },
      {
        title: 'Cryptographic Audit Trail',
        desc: 'Every autonomous agent decision and human supervisor override is logged to an immutable hash chain for SOX 404 audits.',
      },
    ];

    securityPillars.forEach((p, i) => {
      const x = 40 + i * (pillW + 30);
      page.drawRectangle({
        x: x,
        y: pillY,
        width: pillW,
        height: pillH,
        color: lightBg,
        borderColor: borderGrey,
        borderWidth: 1,
      });

      page.drawText(p.title, { x: x + 15, y: pillY + pillH - 25, size: 12, font: fontHelveticaBold, color: textDark });

      const words = p.desc.split(' ');
      let line = '';
      let curY = pillY + pillH - 50;
      for (const w of words) {
        if ((line + w).length > 28) {
          page.drawText(line, { x: x + 15, y: curY, size: 9, font: fontHelvetica, color: textMuted });
          line = w + ' ';
          curY -= 14;
        } else {
          line += w + ' ';
        }
      }
      if (line) {
        page.drawText(line, { x: x + 15, y: curY, size: 9, font: fontHelvetica, color: textMuted });
      }
    });

    // 90-Day Roadmap Box
    page.drawRectangle({
      x: 40,
      y: 100,
      width: PAGE_WIDTH - 80,
      height: 165,
      color: darkBg,
    });

    page.drawText('90-DAY GUARANTEED PRODUCTION IMPLEMENTATION BLUEPRINT', {
      x: 60,
      y: 235,
      size: 11,
      font: fontCourierBold,
      color: amberAccent,
    });

    const phases = [
      {
        phase: 'PHASE 01 (WEEKS 1-2)',
        title: 'Discovery & Schema Mapping',
        desc: 'Catalog inbound document streams (Invoices, ACORD, BOLs). Establish sandbox 3270 / SAP terminal connections.',
      },
      {
        phase: 'PHASE 02 (WEEKS 3-5)',
        title: 'Shadow Mode Dry-Runs',
        desc: 'Deploy Raid Pod in passive shadow mode alongside human operators. Benchmark STP rates and calibrate tolerance boundaries.',
      },
      {
        phase: 'PHASE 03 (WEEKS 6-8)',
        title: 'Exception Triage Training',
        desc: 'Equip supervisors with Zero-Keying exception queue. Enforce RBAC roles, approval gates, and automated SLA escalations.',
      },
      {
        phase: 'PHASE 04 (WEEKS 9-12)',
        title: 'Live Production Cutover',
        desc: 'Enable autonomous straight-through ledger commits. Activate predictive bottleneck optimizer for peak burst scaling.',
      },
    ];

    phases.forEach((ph, i) => {
      const px = 60 + i * 180;
      page.drawText(ph.phase, { x: px, y: 205, size: 8, font: fontCourierBold, color: amberAccent });
      page.drawText(ph.title, { x: px, y: 190, size: 10, font: fontHelveticaBold, color: white });

      const words = ph.desc.split(' ');
      let line = '';
      let curY = 170;
      for (const w of words) {
        if ((line + w).length > 22) {
          page.drawText(line, { x: px, y: curY, size: 8, font: fontHelvetica, color: rgb(0.7, 0.7, 0.7) });
          line = w + ' ';
          curY -= 12;
        } else {
          line += w + ' ';
        }
      }
      if (line) {
        page.drawText(line, { x: px, y: curY, size: 8, font: fontHelvetica, color: rgb(0.7, 0.7, 0.7) });
      }
    });

    drawSlideFooter(page);
  }

  // Save the PDF
  const pdfBytes = await pdfDoc.save();

  // 1. Save to project root as requested: "CREATE PDF doc in ROOT of PROJECT"
  const rootPdfPath = path.join(process.cwd(), 'RAID_POD_EXECUTIVE_PRESENTATION.pdf');
  fs.writeFileSync(rootPdfPath, pdfBytes);
  console.log('Successfully generated PDF at project root:', rootPdfPath);

  // 2. Also save to public directory for direct in-browser download
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const publicPdfPath = path.join(publicDir, 'RAID_POD_EXECUTIVE_PRESENTATION.pdf');
  fs.writeFileSync(publicPdfPath, pdfBytes);
  console.log('Successfully copied PDF to public directory:', publicPdfPath);
}

createPresentationPDF().catch((err) => {
  console.error('Error generating presentation PDF:', err);
  process.exit(1);
});
