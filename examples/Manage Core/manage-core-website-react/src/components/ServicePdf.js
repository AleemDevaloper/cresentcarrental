import { serviceCategories } from "@/data/servicesData";
import { serviceTierPricing } from "@/data/pricingData";

// Premium Color Palette (Slate & Brand Blue)
const COLS = {
  bgDark: [15, 23, 42],      // Slate 900 (Deep, elegant dark)
  bgLight: [248, 250, 252],   // Slate 50 (Clean, light backgrounds)
  bgCard: [241, 245, 249],    // Slate 100 (Subtle borders/cards)
  brand: [37, 99, 235],       // Brand Blue (accent)
  brandLight: [219, 234, 254], // Light Blue 100
  inkDark: [30, 41, 59],       // Slate 800 (Primary headers)
  inkBody: [71, 85, 105],      // Slate 600 (Highly readable body text)
  inkMuted: [148, 163, 184],   // Slate 400 (Secondary details)
  white: [255, 255, 255]
};

// Draw a modern, minimal header on inner pages
function companyHeader(doc, pageTitle) {
  const pageW = doc.internal.pageSize.getWidth();
  
  // Left border logo strip
  doc.setFillColor(...COLS.brand);
  doc.rect(20, 10, 4, 10, "F");
  
  // Manage Core Branding
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLS.inkDark);
  doc.text("Manage Core", 28, 15);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLS.inkMuted);
  doc.text("INTELLIGENT SYSTEMS", 28, 19.5);

  // Right-aligned page/category title
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLS.inkBody);
  doc.text(pageTitle, pageW - 20, 17, { align: "right" });

  // Thin clean separator line
  doc.setDrawColor(...COLS.bgCard);
  doc.setLineWidth(0.4);
  doc.line(20, 25, pageW - 20, 25);
}

// Draw a modern footer with page numbers
function companyFooter(doc, pageNum, totalPages) {
  const pageH = doc.internal.pageSize.getHeight();
  const pageW = doc.internal.pageSize.getWidth();
  
  doc.setDrawColor(...COLS.bgCard);
  doc.setLineWidth(0.4);
  doc.line(20, pageH - 20, pageW - 20, pageH - 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLS.inkMuted);
  doc.text(`Manage Core · Company Profile`, 20, pageH - 14);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageW - 20, pageH - 14, { align: "right" });
}

// Styled section header with a vertical accent bar on the left
function drawAccentSectionHeader(doc, title, y) {
  doc.setFillColor(...COLS.brand);
  doc.rect(20, y - 4, 3, 5, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(...COLS.inkDark);
  doc.text(title, 26, y);
}

export async function downloadCompanyBrochure() {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // PAGE 1: COVER PAGE (Zylvoo-style High-End Minimal Design)
  doc.setFillColor(...COLS.bgDark);
  doc.rect(0, 0, pageW, pageH, "F");

  // Premium geometric overlapping lines for visual depth
  doc.setFillColor(30, 41, 59); // Dark slate highlight
  doc.rect(0, 0, 16, pageH, "F");
  doc.setFillColor(...COLS.brand); // Brand stripe
  doc.rect(16, 0, 3, pageH, "F");

  // Modern grid background lines (top-right corner)
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.3);
  for (let i = 0; i < 5; i++) {
    doc.line(pageW - 80 + i * 15, 0, pageW - 80 + i * 15, 90);
    doc.line(pageW - 80, i * 15, pageW, i * 15);
  }

  // Cover Content
  doc.setFont("helvetica", "bold");
  doc.setFontSize(38);
  doc.setTextColor(...COLS.white);
  doc.text("MANAGE\nCORE", 35, 95, { leading: 42 });

  // Accent Line
  doc.setFillColor(...COLS.brand);
  doc.rect(35, 120, 35, 2, "F");

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...COLS.inkMuted);
  doc.text("COMPANY PROFILE & CAPABILITY GUIDE", 35, 132);

  // Description Tagline
  doc.setFontSize(10.5);
  doc.setTextColor(203, 213, 225); // Slate 300
  const tagline = "Architecting intelligent AI systems, custom automation workflows, and unified enterprise operational platforms.";
  doc.text(doc.splitTextToSize(tagline, 140), 35, 146);

  // High-contrast clean expertise card
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(35, 175, 145, 54, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...COLS.white);
  doc.text("CORE SOLUTIONS", 43, 187);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.2);
  doc.setTextColor(203, 213, 225);
  doc.text("•  Autonomous AI Agents & RAG Pipelines", 43, 196);
  doc.text("•  Full-Stack Enterprise Applications", 43, 203);
  doc.text("•  Unified Operations, HR & Financial Hubs", 43, 210);
  doc.text("•  Custom Systems Integration & Cloud Ops", 43, 217);

  // Footer Metadata
  doc.setFontSize(8.5);
  doc.setTextColor(...COLS.inkMuted);
  doc.text("Prepared for: Partners & Enterprise Clients", 35, 260);
  doc.text("Website: https://managecore.asiancon.com", 35, 266);
  doc.text("Contact: hello@managecore.test · +92 319 0782328", 35, 272);

  // PAGE 2: CAPABILITY DETAILS
  doc.addPage();
  let y = 38;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...COLS.inkDark);
  doc.text("Software, AI & automation — built to scale", 20, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.8);
  doc.setTextColor(...COLS.inkBody);
  const intro =
    "Manage Core is a premier software engineering house. We design, build, integrate, and support end-to-end business tools. " +
    "A single aligned engineering team owns the entire lifecycle — from scoping to long-term cloud operations.";
  doc.text(doc.splitTextToSize(intro, pageW - 40), 20, y + 8);

  y += 28;

  for (const cat of serviceCategories) {
    const needed = cat.links.length * 15 + 30;
    if (y + needed > pageH - 30) {
      doc.addPage();
      y = 38;
    }

    drawAccentSectionHeader(doc, cat.name, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLS.inkBody);
    doc.text(doc.splitTextToSize(cat.short, pageW - 40), 20, y + 5);

    autoTable(doc, {
      startY: y + 9,
      head: [["Service", "What it delivers"]],
      body: cat.links.map((s) => [s.name, s.description]),
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 3.2, textColor: COLS.inkBody, font: "helvetica", lineColor: COLS.bgCard, lineWidth: 0.1 },
      headStyles: { fillColor: COLS.inkDark, textColor: COLS.white, fontStyle: "bold", fontSize: 8.5 },
      alternateRowStyles: { fillColor: COLS.bgLight },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 50, textColor: COLS.brand } },
      margin: { left: 20, right: 20, top: 35, bottom: 25 }
    });

    y = (doc.lastAutoTable?.finalY || y) + 14;
  }

  // CTA Card
  if (y + 35 > pageH - 30) {
    doc.addPage();
    y = 38;
  }
  
  doc.setFillColor(...COLS.bgDark);
  doc.roundedRect(20, y, pageW - 40, 26, 2, 2, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLS.white);
  doc.text("Let's build yours", 28, y + 10);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(200, 215, 255);
  doc.text("hello@managecore.test · +92 319 0782328 · https://managecore.asiancon.com/contact", 28, y + 17);

  // Apply Headers and Footers to all pages except Cover
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    companyHeader(doc, "Overview | Capability Guide");
    companyFooter(doc, i, totalPages);
  }

  doc.save("managecore-services-brochure.pdf");
}

function ensureSpace(doc, needed) {
  const pageH = doc.internal.pageSize.getHeight();
  const currentY = doc.lastAutoTable?.finalY || 38;
  if (currentY + needed > pageH - 25) {
    doc.addPage();
  }
}

// Draw a service overview header
function serviceHeader(doc, service, catName) {
  const pageW = doc.internal.pageSize.getWidth();
  
  doc.setFillColor(...COLS.brand);
  doc.rect(20, 10, 4, 10, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLS.inkDark);
  doc.text(service.name, 28, 15);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLS.inkMuted);
  doc.text(`${catName || "Services"} | Service Overview`, 28, 19.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLS.inkBody);
  doc.text("Manage Core", pageW - 20, 17, { align: "right" });

  doc.setDrawColor(...COLS.bgCard);
  doc.setLineWidth(0.4);
  doc.line(20, 25, pageW - 20, 25);
}

function serviceFooter(doc, service, pageNum, totalPages) {
  const pageH = doc.internal.pageSize.getHeight();
  const pageW = doc.internal.pageSize.getWidth();
  
  doc.setDrawColor(...COLS.bgCard);
  doc.setLineWidth(0.4);
  doc.line(20, pageH - 20, pageW - 20, pageH - 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLS.inkMuted);
  doc.text(`Manage Core · ${service.name} Overview`, 20, pageH - 14);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageW - 20, pageH - 14, { align: "right" });
}

export async function downloadServicePdf(service) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  
  const cat = serviceCategories.find((c) => c.slug === service.category);
  const catName = cat?.name;

  let y = 38;

  // Headline
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLS.inkDark);
  const headlineLines = doc.splitTextToSize(service.headline, pageW - 40);
  doc.text(headlineLines, 20, y);
  y += headlineLines.length * 5 + 4;

  // Description Paragraph
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.8);
  doc.setTextColor(...COLS.inkBody);
  const desc = doc.splitTextToSize(service.description, pageW - 40);
  doc.text(desc, 20, y);
  y += desc.length * 4.8 + 8;

  // Overview Block
  ensureSpace(doc, 35);
  const curYOverview = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 12 : y;
  drawAccentSectionHeader(doc, "Service Overview", curYOverview);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLS.inkBody);
  const ov = doc.splitTextToSize(service.overview, pageW - 40);
  doc.text(ov, 20, curYOverview + 6);
  y = curYOverview + 10 + ov.length * 4.8;

  // Problems Section
  ensureSpace(doc, service.problems.length * 8 + 20);
  const curYProblems = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : y;
  autoTable(doc, {
    startY: curYProblems,
    head: [["Problems this service removes"]],
    body: service.problems.map((p) => [p]),
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 3.4, textColor: COLS.inkBody, font: "helvetica" },
    headStyles: { fontStyle: "bold", fontSize: 11.5, textColor: COLS.inkDark, fillColor: COLS.bgCard },
    alternateRowStyles: { fillColor: COLS.bgLight },
    margin: { left: 20, right: 20, top: 35, bottom: 25 }
  });
  y = (doc.lastAutoTable?.finalY || y) + 12;

  // Capabilities Grid
  ensureSpace(doc, 35);
  autoTable(doc, {
    startY: y,
    head: [["What we deliver / Capabilities"]],
    body: (service.capabilities || []).map((c) => [`•  ${c}`]),
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 3.4, textColor: COLS.inkBody, lineColor: COLS.bgCard, lineWidth: 0.1, font: "helvetica" },
    headStyles: { fontStyle: "bold", fontSize: 11.5, textColor: COLS.inkDark, fillColor: COLS.bgLight },
    margin: { left: 20, right: 20, top: 35, bottom: 25 }
  });
  y = (doc.lastAutoTable?.finalY || y) + 12;

  // Who it's for
  ensureSpace(doc, 30);
  const curYWho = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : y;
  drawAccentSectionHeader(doc, "Ideal Fit", curYWho);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLS.inkBody);
  const who = doc.splitTextToSize(service.whoNeeds || "", pageW - 40);
  doc.text(who, 20, curYWho + 6);
  y = curYWho + 10 + who.length * 4.8;

  // Packages Table
  ensureSpace(doc, 40);
  autoTable(doc, {
    startY: y + 2,
    head: [["Package", "Audience", "Price indicator"]],
    body: serviceTierPricing(service).map((p) => [p.name, p.audience, `${p.price} (${p.priceNote})`]),
    theme: "striped",
    styles: { fontSize: 8.5, cellPadding: 3.5, textColor: COLS.inkBody, font: "helvetica" },
    headStyles: { fillColor: COLS.brand, textColor: COLS.white, fontStyle: "bold", fontSize: 9 },
    alternateRowStyles: { fillColor: COLS.bgLight },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 }, 2: { cellWidth: 55 } },
    margin: { left: 20, right: 20, top: 35, bottom: 25 }
  });
  y = (doc.lastAutoTable?.finalY || y) + 12;

  // Process Steps
  ensureSpace(doc, 50);
  const curYProcess = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : y;
  drawAccentSectionHeader(doc, "How We Deliver", curYProcess);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLS.inkMuted);
  doc.text("Our structured lifecycle applied to ensure delivery success.", 20, curYProcess + 5);
  
  autoTable(doc, {
    startY: curYProcess + 8,
    head: [["Stage", "What happens"]],
    body: [
      ["01 · Discovery", "Map the business problem, users, workflows and outcomes."],
      ["02 · Business Analysis", "Validate requirements, constraints and integration needs."],
      ["03 · Strategy", "Agree approach, architecture, phasing and success criteria."],
      ["04 · UI/UX Design", "Design and validate the user journey before building."],
      ["05 · Development", "Build in controlled sprints with working demos."],
      ["06 · Testing & QA", "Verify functionality, edges and performance."],
      ["07 · Deployment", "Migrate data and release with a rollback plan."],
      ["08 · Support & Optimization", "Monitor adoption and continuously improve."],
    ],
    theme: "plain",
    styles: { fontSize: 8.5, cellPadding: 2.5, textColor: COLS.inkBody, font: "helvetica" },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 55, textColor: COLS.brand } },
    margin: { left: 20, right: 20, top: 35, bottom: 25 }
  });
  y = (doc.lastAutoTable?.finalY || y) + 12;

  // Contact Band Card
  ensureSpace(doc, 30);
  const curYContact = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : y;
  doc.setFillColor(...COLS.bgDark);
  doc.roundedRect(20, curYContact, pageW - 40, 26, 2, 2, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLS.white);
  doc.text("Let's build yours", 28, curYContact + 10);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(200, 215, 255);
  doc.text("hello@managecore.test · +92 319 0782328 · https://managecore.asiancon.com/contact", 28, curYContact + 17);

  // Apply Headers and Footers to all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    serviceHeader(doc, service, catName);
    serviceFooter(doc, service, i, totalPages);
  }

  doc.save(`${service.slug}-brochure.pdf`);
}