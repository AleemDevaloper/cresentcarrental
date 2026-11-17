import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faChartPie,
  faTable,
  faSquarePollVertical,
  faPlus,
  faMagicWandSparkles,
  faSave,
  faEye,
  faGripVertical,
  faTrash,
  faHeading,
  faChartLine,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
  faSpinner,
  faEdit,
  faCheck,
  faTimes,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { getTmsStats, getTaskCompletionReports, listAllTasks, listAllTimeLogs, listProductivityRecords } from '../../../../api/tms';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const STORAGE_KEY = 'tms_report_architect_saved';

const WIDGET_TYPES = [
  { type: 'kpi', label: 'KPI Card', icon: faSquarePollVertical, desc: 'Key metrics snapshot' },
  { type: 'chart', label: 'Trend Chart', icon: faChartLine, desc: 'Line chart over time' },
  { type: 'pie', label: 'Distribution', icon: faChartPie, desc: 'Pie/doughnut breakdown' },
  { type: 'table', label: 'Data Table', icon: faTable, desc: 'Tabular task data' },
  { type: 'text', label: 'Heading/Text', icon: faHeading, desc: 'Custom label or title' },
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', padding: 12, cornerRadius: 8 } },
  scales: { y: { grid: { display: false }, border: { display: false } }, x: { grid: { display: false }, border: { display: false } } },
};

const TmsCustomReportsBuilder = () => {
  const [loading, setLoading] = useState(true);
  const [activeWidgets, setActiveWidgets] = useState([]);
  const [reportTitle, setReportTitle] = useState('Untitled Report');
  const [editingTitle, setEditingTitle] = useState(false);
  const [preview, setPreview] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const [tmsStats, setTmsStats] = useState(null);
  const [completionData, setCompletionData] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [productivityRecords, setProductivityRecords] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActiveWidgets(parsed.widgets || []);
        setReportTitle(parsed.title || 'Untitled Report');
      } catch { /* ignore corrupt data */ }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, completion, tasks, logs, records] = await Promise.all([
          getTmsStats().catch(() => null),
          getTaskCompletionReports().catch(() => null),
          listAllTasks().catch(() => []),
          listAllTimeLogs().catch(() => []),
          listProductivityRecords().catch(() => []),
        ]);
        setTmsStats(stats);
        setCompletionData(completion);
        setAllTasks(Array.isArray(tasks) ? tasks : []);
        setTimeLogs(Array.isArray(logs) ? logs : []);
        setProductivityRecords(Array.isArray(records) ? records : []);
      } catch { /* data unavailable */ }
    };
    fetchData();
  }, []);

  const statsList = useMemo(() => {
    if (!completionData?.stats) return [];
    return completionData.stats;
  }, [completionData]);

  const addWidget = useCallback((type) => {
    const labels = { kpi: 'KPI Card', chart: 'Trend Chart', pie: 'Distribution', table: 'Data Table', text: 'Heading' };
    setActiveWidgets(prev => [...prev, {
      id: Date.now(), type,
      title: labels[type] || 'Widget',
      width: type === 'chart' ? 'col-md-8' : 'col-md-4',
      content: type === 'text' ? 'Enter your heading text here' : '',
    }]);
    setDirty(true);
  }, []);

  const removeWidget = useCallback((id) => {
    setActiveWidgets(prev => prev.filter(w => w.id !== id));
    setDirty(true);
  }, []);

  const updateWidgetTitle = useCallback((id, title) => {
    setActiveWidgets(prev => prev.map(w => w.id === id ? { ...w, title } : w));
    setDirty(true);
  }, []);

  const updateWidgetContent = useCallback((id, content) => {
    setActiveWidgets(prev => prev.map(w => w.id === id ? { ...w, content } : w));
    setDirty(true);
  }, []);

  const saveReport = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ title: reportTitle, widgets: activeWidgets }));
    setDirty(false);
  }, [reportTitle, activeWidgets]);

  const renderChartToCanvas = useCallback((type, labels, data) => {
    const canvas = document.createElement('canvas');
    const isLine = type === 'line';
    canvas.width = isLine ? 500 : 350;
    canvas.height = isLine ? 280 : 280;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isLine) {
      const pad = { top: 20, bottom: 35, left: 45, right: 20 };
      const w = canvas.width - pad.left - pad.right;
      const h = canvas.height - pad.top - pad.bottom;
      const max = Math.max(...data, 100);
      const stepX = w / Math.max(labels.length - 1, 1);

      ctx.strokeStyle = '#eee'; ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = pad.top + (h / 4) * i;
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(canvas.width - pad.right, y); ctx.stroke();
      }
      ctx.fillStyle = '#666'; ctx.font = '10px Calibri,sans-serif'; ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) {
        const y = pad.top + (h / 4) * i;
        ctx.fillText(Math.round(max - (max / 4) * i) + '%', pad.left - 8, y + 4);
      }
      ctx.beginPath(); ctx.moveTo(pad.left, pad.top + h);
      data.forEach((d, i) => ctx.lineTo(pad.left + i * stepX, pad.top + h - (d / max) * h));
      ctx.lineTo(pad.left + (data.length - 1) * stepX, pad.top + h);
      ctx.closePath(); ctx.fillStyle = 'rgba(40,40,226,0.1)'; ctx.fill();
      ctx.beginPath();
      data.forEach((d, i) => {
        const x = pad.left + i * stepX;
        const y = pad.top + h - (d / max) * h;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#2828e2'; ctx.lineWidth = 2.5; ctx.stroke();
      data.forEach((d, i) => {
        const x = pad.left + i * stepX;
        const y = pad.top + h - (d / max) * h;
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = '#2828e2'; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
      });
      ctx.fillStyle = '#666'; ctx.font = '10px Calibri,sans-serif'; ctx.textAlign = 'center';
      labels.forEach((l, i) => ctx.fillText(l, pad.left + i * stepX, canvas.height - 5));
    } else {
      const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'];
      const cx = 130, cy = 140, radius = 100;
      const total = data.reduce((a, b) => a + b, 0);
      if (total > 0) {
        let startAngle = -Math.PI / 2;
        data.forEach((d, i) => {
          const sliceAngle = (d / total) * Math.PI * 2;
          ctx.beginPath(); ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
          ctx.closePath(); ctx.fillStyle = colors[i % colors.length]; ctx.fill();
          startAngle += sliceAngle;
        });
        ctx.beginPath(); ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fillStyle = '#eee'; ctx.fill();
      }
      const legendX = 245;
      labels.forEach((l, i) => {
        const ly = 20 + i * 28;
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(legendX, ly, 14, 14);
        ctx.fillStyle = '#333'; ctx.font = '12px Calibri,sans-serif'; ctx.textAlign = 'left';
        ctx.fillText(`${l} (${data[i]})`, legendX + 20, ly + 12);
      });
    }
    return canvas.toDataURL('image/png');
  }, []);

  const buildExportHtml = useCallback(() => {
    const sections = activeWidgets.map(w => {
      let body = '';
      if (w.type === 'text') {
        body = `<p style="font-size:16pt;font-weight:bold;margin:8px 0;color:#1e293b">${w.content || w.title}</p>`;
      } else if (w.type === 'kpi' && completionData?.stats) {
        body = `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;margin:8px 0;font-family:Calibri,sans-serif;font-size:12pt">
          <tr style="background:#2828e2;color:white"><th>Metric</th><th>Value</th><th>Trend</th></tr>
          ${completionData.stats.map(s => `<tr><td>${s.label}</td><td style="font-weight:bold;font-size:14pt">${s.value}</td><td>${s.trend}</td></tr>`).join('')}
        </table>`;
      } else if (w.type === 'chart' && completionData?.lineData?.labels?.length > 0) {
        const chartUrl = renderChartToCanvas('line', completionData.lineData.labels, completionData.lineData.data);
        body = `<div style="text-align:center;margin:8px 0"><img src="${chartUrl}" style="max-width:500px"/></div>
          <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;margin:8px 0;font-family:Calibri,sans-serif;font-size:11pt">
          <tr style="background:#2828e2;color:white"><th>Month</th><th>Completion Rate (%)</th></tr>
          ${completionData.lineData.labels.map((l, i) => `<tr${i % 2 === 0 ? ' style="background:#f8fafc"' : ''}><td>${l}</td><td>${completionData.lineData.data[i]}%</td></tr>`).join('')}
        </table>`;
      } else if (w.type === 'pie' && completionData?.priorityData?.labels?.length > 0) {
        const chartUrl = renderChartToCanvas('pie', completionData.priorityData.labels, completionData.priorityData.data);
        body = `<div style="text-align:center;margin:8px 0"><img src="${chartUrl}" style="max-width:400px"/></div>
          <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;margin:8px 0;font-family:Calibri,sans-serif;font-size:11pt">
          <tr style="background:#2828e2;color:white"><th>Priority</th><th>Task Count</th></tr>
          ${completionData.priorityData.labels.map((l, i) => `<tr${i % 2 === 0 ? ' style="background:#f8fafc"' : ''}><td><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${['#EF4444','#F59E0B','#3B82F6','#10B981'][i]};margin-right:8px;vertical-align:middle"></span>${l}</td><td>${completionData.priorityData.data[i]}</td></tr>`).join('')}
        </table>`;
      } else if (w.type === 'table' && allTasks.length > 0) {
        body = `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;margin:8px 0;font-family:Calibri,sans-serif;font-size:11pt">
          <tr style="background:#2828e2;color:white"><th>Task</th><th>Status</th><th>Priority</th><th>Due Date</th></tr>
          ${allTasks.slice(0, 100).map((t, i) => `<tr${i % 2 === 0 ? ' style="background:#f8fafc"' : ''}><td>${t.title || t.name}</td><td>${t.status}</td><td>${t.priority || '—'}</td><td>${t.due_date ? new Date(t.due_date).toLocaleDateString() : '—'}</td></tr>`).join('')}
        </table>`;
      }
      return `<h3 style="color:#2828e2;margin:20px 0 8px;font-size:14pt">${w.title}</h3>${body || '<p style="color:#999;font-style:italic">No data for this widget</p>'}`;
    }).join('');

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${reportTitle}</title>
<style>body{font-family:Calibri,sans-serif;padding:40px;max-width:1000px;margin:0 auto;background:#fff;color:#1e293b}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px 10px}th{background:#2828e2;color:#fff;font-weight:bold;text-align:left}h1{color:#1e1e9c;margin:0;font-size:24pt}h3{color:#2828e2;margin:20px 0 8px;font-size:14pt}.footer{margin-top:40px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:9pt;color:#94a3b8;text-align:center}td{font-size:11pt}</style>
</head>
<body>
  <div style="border-bottom:3px solid #2828e2;padding-bottom:12px;margin-bottom:24px">
    <h1>${reportTitle}</h1>
    <p style="color:#94a3b8;margin:4px 0 0;font-size:10pt">Generated by Manage Core Report Architect</p>
  </div>
  ${sections}
  <div class="footer">Manage Core — Enterprise Report · ${new Date().toLocaleDateString()}</div>
</body></html>`;
  }, [activeWidgets, reportTitle, completionData, allTasks, renderChartToCanvas]);

  const base64ToArrayBuffer = useCallback((b64) => {
    const byteString = atob(b64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return ab;
  }, []);

  const exportToExcel = useCallback(async () => {
    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Manage Core Report Architect';
      const sheet = workbook.addWorksheet('Report');
      sheet.getColumn(1).width = 30;
      sheet.getColumn(2).width = 18;
      sheet.getColumn(3).width = 18;
      sheet.getColumn(4).width = 20;

      sheet.getRow(1).getCell(1).value = reportTitle;
      sheet.mergeCells(1, 1, 1, 4);
      sheet.getRow(1).font = { bold: true, size: 16, color: { argb: 'FF1E1E9C' } };

      let r = 3;
      for (const w of activeWidgets) {
        sheet.getRow(r).getCell(1).value = w.title;
        sheet.getRow(r).font = { bold: true, size: 14, color: { argb: 'FF2828E2' } };
        r++;

        if (w.type === 'text') {
          sheet.getRow(r).getCell(1).value = w.content || w.title;
          r++;
        } else if (w.type === 'kpi' && completionData?.stats) {
          ['A', 'B', 'C'].forEach((col, ci) => {
            const cell = sheet.getRow(r).getCell(ci + 1);
            cell.value = ['Metric', 'Value', 'Trend'][ci];
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2828E2' } };
          });
          r++;
          for (const s of completionData.stats) {
            sheet.getRow(r).getCell(1).value = s.label;
            sheet.getRow(r).getCell(2).value = s.value;
            sheet.getRow(r).getCell(3).value = s.trend;
            r++;
          }
        } else if (w.type === 'chart' && completionData?.lineData?.labels) {
          const chartUrl = renderChartToCanvas('line', completionData.lineData.labels, completionData.lineData.data);
          const imageId = workbook.addImage({ base64: chartUrl.split(',')[1], extension: 'png' });
          sheet.addImage(imageId, { tl: { col: 0, row: r - 1 }, ext: { width: 300, height: 168 } });
          r += 10;

          ['A', 'B'].forEach((col, ci) => {
            const cell = sheet.getRow(r).getCell(ci + 1);
            cell.value = ['Month', 'Completion Rate (%)'][ci];
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2828E2' } };
          });
          r++;
          for (let i = 0; i < completionData.lineData.labels.length; i++) {
            sheet.getRow(r).getCell(1).value = completionData.lineData.labels[i];
            sheet.getRow(r).getCell(2).value = completionData.lineData.data[i];
            r++;
          }
        } else if (w.type === 'pie' && completionData?.priorityData?.labels) {
          const chartUrl = renderChartToCanvas('pie', completionData.priorityData.labels, completionData.priorityData.data);
          const imageId = workbook.addImage({ base64: chartUrl.split(',')[1], extension: 'png' });
          sheet.addImage(imageId, { tl: { col: 0, row: r - 1 }, ext: { width: 210, height: 168 } });
          r += 10;

          ['A', 'B'].forEach((col, ci) => {
            const cell = sheet.getRow(r).getCell(ci + 1);
            cell.value = ['Priority', 'Task Count'][ci];
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2828E2' } };
          });
          r++;
          for (let i = 0; i < completionData.priorityData.labels.length; i++) {
            sheet.getRow(r).getCell(1).value = completionData.priorityData.labels[i];
            sheet.getRow(r).getCell(2).value = completionData.priorityData.data[i];
            r++;
          }
        } else if (w.type === 'table' && allTasks.length > 0) {
          ['A', 'B', 'C', 'D'].forEach((col, ci) => {
            const cell = sheet.getRow(r).getCell(ci + 1);
            cell.value = ['Task', 'Status', 'Priority', 'Due Date'][ci];
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2828E2' } };
          });
          r++;
          for (const t of allTasks.slice(0, 100)) {
            sheet.getRow(r).getCell(1).value = t.title || t.name;
            sheet.getRow(r).getCell(2).value = t.status;
            sheet.getRow(r).getCell(3).value = t.priority || '—';
            sheet.getRow(r).getCell(4).value = t.due_date ? new Date(t.due_date).toLocaleDateString() : '—';
            r++;
          }
        }
        r += 2;
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${reportTitle.replace(/\s+/g, '_')}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch (e) {
      const html = buildExportHtml();
      const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${reportTitle.replace(/\s+/g, '_')}.xls`;
      a.click(); URL.revokeObjectURL(url);
    }
  }, [activeWidgets, reportTitle, completionData, allTasks, renderChartToCanvas, buildExportHtml]);

  const exportToWord = useCallback(async () => {
    try {
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, ImageRunType, AlignmentType, WidthType, HeadingLevel } = await import('docx');
      const children = [];
      children.push(
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: reportTitle, bold: true, size: 36, color: '1E1E9C' })] }),
        new Paragraph({ spacing: { after: 400 }, children: [new TextRun({ text: 'Generated by Manage Core Report Architect', size: 20, color: '94A3B8', italics: true })] })
      );

      for (const w of activeWidgets) {
        children.push(new Paragraph({ spacing: { before: 400, after: 200 }, children: [new TextRun({ text: w.title, bold: true, size: 28, color: '2828E2' })] }));

        if (w.type === 'text') {
          children.push(new Paragraph({ children: [new TextRun({ text: w.content || w.title, size: 22 })] }));
        } else if (w.type === 'kpi' && completionData?.stats) {
          const kpiRows = [new TableRow({ children: ['Metric', 'Value', 'Trend'].map(h => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF' })] })], shading: { fill: '2828E2' } })) })];
          for (const s of completionData.stats) {
            kpiRows.push(new TableRow({ children: [s.label, s.value, s.trend].map(v => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(v), size: 20 })] })] })) }));
          }
          children.push(new Table({ rows: kpiRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
        } else if (w.type === 'chart' && completionData?.lineData?.labels) {
          const chartUrl = renderChartToCanvas('line', completionData.lineData.labels, completionData.lineData.data);
          const imgBuffer = base64ToArrayBuffer(chartUrl.split(',')[1]);
          children.push(
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ data: imgBuffer, transformation: { width: 400, height: 224 }, type: ImageRunType.PNG })] })
          );
          const lineRows = [new TableRow({ children: ['Month', 'Completion Rate (%)'].map(h => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF' })] })], shading: { fill: '2828E2' } })) })];
          for (let i = 0; i < completionData.lineData.labels.length; i++) {
            lineRows.push(new TableRow({ children: [completionData.lineData.labels[i], String(completionData.lineData.data[i]) + '%'].map(v => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: v, size: 20 })] })] })) }));
          }
          children.push(new Table({ rows: lineRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
        } else if (w.type === 'pie' && completionData?.priorityData?.labels) {
          const chartUrl = renderChartToCanvas('pie', completionData.priorityData.labels, completionData.priorityData.data);
          const imgBuffer = base64ToArrayBuffer(chartUrl.split(',')[1]);
          children.push(
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ data: imgBuffer, transformation: { width: 300, height: 240 }, type: ImageRunType.PNG })] })
          );
          const pieRows = [new TableRow({ children: ['Priority', 'Task Count'].map(h => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF' })] })], shading: { fill: '2828E2' } })) })];
          for (let i = 0; i < completionData.priorityData.labels.length; i++) {
            pieRows.push(new TableRow({ children: [completionData.priorityData.labels[i], String(completionData.priorityData.data[i])].map(v => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: v, size: 20 })] })] })) }));
          }
          children.push(new Table({ rows: pieRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
        } else if (w.type === 'table' && allTasks.length > 0) {
          const taskRows = [new TableRow({ children: ['Task', 'Status', 'Priority', 'Due Date'].map(h => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF' })] })], shading: { fill: '2828E2' } })) })];
          for (const t of allTasks.slice(0, 50)) {
            taskRows.push(new TableRow({ children: [t.title || t.name, t.status, t.priority || '—', t.due_date ? new Date(t.due_date).toLocaleDateString() : '—'].map(v => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: v, size: 20 })] })] })) }));
          }
          children.push(new Table({ rows: taskRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
        }
      }

      const doc = new Document({ sections: [{ children }] });
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${reportTitle.replace(/\s+/g, '_')}.docx`;
      a.click(); URL.revokeObjectURL(url);
    } catch (e) {
      const html = buildExportHtml();
      const blob = new Blob([html], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${reportTitle.replace(/\s+/g, '_')}.doc`;
      a.click(); URL.revokeObjectURL(url);
    }
  }, [activeWidgets, reportTitle, completionData, allTasks, renderChartToCanvas, base64ToArrayBuffer, buildExportHtml]);

  const generateFromAI = useCallback(() => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    setTimeout(() => {
      const promptLower = aiPrompt.toLowerCase();
      const suggested = [];
      if (promptLower.includes('kpi') || promptLower.includes('stat') || promptLower.includes('metric') || promptLower.includes('overview')) {
        suggested.push({ id: Date.now() + 1, type: 'kpi', title: 'Performance KPI', width: 'col-md-4' });
      }
      if (promptLower.includes('trend') || promptLower.includes('chart') || promptLower.includes('velocity') || promptLower.includes('monthly') || promptLower.includes('completion')) {
        suggested.push({ id: Date.now() + 2, type: 'chart', title: 'Completion Trend', width: 'col-md-8' });
      }
      if (promptLower.includes('distribut') || promptLower.includes('pie') || promptLower.includes('breakdown') || promptLower.includes('priority')) {
        suggested.push({ id: Date.now() + 3, type: 'pie', title: 'Priority Distribution', width: 'col-md-4' });
      }
      if (promptLower.includes('table') || promptLower.includes('list') || promptLower.includes('data') || promptLower.includes('tasks') || promptLower.includes('detail')) {
        suggested.push({ id: Date.now() + 4, type: 'table', title: 'Task Details', width: 'col-md-12' });
      }
      if (promptLower.includes('heading') || promptLower.includes('title') || promptLower.includes('header') || promptLower.includes('section')) {
        suggested.push({ id: Date.now() + 5, type: 'text', title: 'Section Heading', width: 'col-md-12', content: promptLower.includes('monthly') ? 'Monthly Performance Report' : 'Custom Section' });
      }
      if (suggested.length === 0) {
        suggested.push({ id: Date.now() + 1, type: 'kpi', title: 'Performance KPI', width: 'col-md-4' });
        suggested.push({ id: Date.now() + 2, type: 'chart', title: 'Completion Trend', width: 'col-md-8' });
        suggested.push({ id: Date.now() + 3, type: 'table', title: 'Task Details', width: 'col-md-12' });
      }
      setActiveWidgets(prev => [...prev, ...suggested]);
      setAiGenerating(false);
      setAiPrompt('');
      setDirty(true);
    }, 800);
  }, [aiPrompt]);

  const dataLoaded = !!(completionData?.lineData?.labels?.length || completionData?.priorityData?.data?.length);

  const lineChartData = useMemo(() => ({
    labels: completionData?.lineData?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Completion Rate %',
      data: completionData?.lineData?.data || [30, 45, 60, 55, 75, 82],
      borderColor: '#2828e2',
      backgroundColor: 'rgba(40, 40, 226, 0.1)',
      fill: true, tension: 0.4,
    }],
  }), [completionData]);

  const pieChartData = useMemo(() => ({
    labels: completionData?.priorityData?.labels || ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      data: completionData?.priorityData?.data || [8, 15, 32, 20],
      backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'],
      borderWidth: 0,
    }],
  }), [completionData]);

  const renderWidgetContent = (widget) => {
    switch (widget.type) {
      case 'kpi':
        return (
          <div className="row g-3">
            {statsList.length > 0 ? statsList.map((stat, i) => (
              <div className="col-6" key={i}>
                <div className="p-3 rounded-4 bg-light text-center h-100">
                  <div className={`text-${stat.color} mb-2`}>
                    <FontAwesomeIcon icon={stat.icon === 'faCheckCircle' ? faCheckCircle : stat.icon === 'faClock' ? faClock : stat.icon === 'faExclamationTriangle' ? faExclamationTriangle : faChartLine} className="fs-4" />
                  </div>
                  <div className="fw-bold fs-4 mb-0">{stat.value}</div>
                  <div className="x-small text-muted text-uppercase letter-spacing-1">{stat.label}</div>
                </div>
              </div>
            )) : (
              <>
                <div className="col-6">
                  <div className="p-3 rounded-4 bg-light text-center">
                    <div className="text-primary mb-2"><FontAwesomeIcon icon={faCheckCircle} className="fs-4" /></div>
                    <div className="fw-bold fs-4 mb-0">—</div>
                    <div className="x-small text-muted">Loading...</div>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'chart':
        return (
          <div style={{ height: '280px', width: '100%', position: 'relative' }}>
            <Line key={`chart-${dataLoaded}`} data={lineChartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
          </div>
        );

      case 'pie':
        return (
          <div className="text-center" style={{ width: '100%' }}>
            <div style={{ height: '220px', width: '100%', maxWidth: '280px', margin: '0 auto', position: 'relative' }}>
              <Doughnut key={`pie-${dataLoaded}`} data={pieChartData} options={{ ...chartOptions, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 10, padding: 8, font: { size: 10 } } } } }} />
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="table-responsive" style={{ maxHeight: '320px', overflowY: 'auto' }}>
            <table className="table table-sm table-hover align-middle mb-0">
              <thead className="small text-muted text-uppercase letter-spacing-1">
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {allTasks.length > 0 ? allTasks.slice(0, 20).map(task => (
                  <tr key={task.id}>
                    <td className="fw-semibold small">{task.title || task.name}</td>
                    <td><span className={`badge rounded-pill bg-${task.status === 'Done' ? 'success' : task.status === 'In Progress' ? 'primary' : 'secondary'} bg-opacity-10 text-${task.status === 'Done' ? 'success' : task.status === 'In Progress' ? 'primary' : 'secondary'}`}>{task.status}</span></td>
                    <td className="small">{task.priority || '—'}</td>
                    <td className="small text-muted">{task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center text-muted small py-4">No task data available</td></tr>
                )}
              </tbody>
            </table>
            {allTasks.length > 20 && <div className="text-center text-muted x-small p-2">{allTasks.length} tasks total (showing 20)</div>}
          </div>
        );

      case 'text':
        return (
          <input
            className="form-control form-control-lg fw-bold border-0 p-0 bg-transparent"
            value={widget.content || ''}
            onChange={e => updateWidgetContent(widget.id, e.target.value)}
            placeholder="Type your heading here..."
          />
        );

      default:
        return <div className="text-muted small text-center py-4">Unknown widget type</div>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-primary fs-1 mb-3" />
          <p className="text-muted">Loading report architect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          {editingTitle ? (
            <div className="d-flex align-items-center gap-2">
              <input className="form-control form-control-lg fw-bold border-primary" value={reportTitle} onChange={e => setReportTitle(e.target.value)} autoFocus style={{ maxWidth: 350 }} />
              <button className="btn btn-sm btn-link text-success p-0" onClick={() => { setEditingTitle(false); setDirty(true); }}><FontAwesomeIcon icon={faCheck} /></button>
              <button className="btn btn-sm btn-link text-danger p-0" onClick={() => setEditingTitle(false)}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
          ) : (
            <>
              <h2 className="fw-bold mb-0">{reportTitle}</h2>
              <button className="btn btn-sm btn-link text-muted p-0" onClick={() => setEditingTitle(true)}><FontAwesomeIcon icon={faEdit} /></button>
            </>
          )}
        </div>
        <div className="d-flex gap-2">
          <button className={`btn rounded-pill border shadow-sm px-4 ${preview ? 'btn-primary' : 'btn-light'}`} onClick={() => setPreview(!preview)}>
            <FontAwesomeIcon icon={preview ? faTimes : faEye} className="me-2" /> {preview ? 'Edit' : 'Preview'}
          </button>
          <div className="position-relative">
            <button className="btn btn-outline-secondary rounded-pill shadow-sm px-4" onClick={() => setExportOpen(!exportOpen)} onBlur={() => setTimeout(() => setExportOpen(false), 200)}>
              <FontAwesomeIcon icon={faFileExport} className="me-2" /> Export
            </button>
            {exportOpen && (
              <div className="position-absolute end-0 mt-2 bg-white border rounded-3 shadow-lg" style={{ zIndex: 1050, minWidth: 180 }}>
                <button className="dropdown-item px-4 py-2 d-flex align-items-center gap-2 btn btn-light border-0 w-100 text-start" onClick={() => { exportToExcel(); setExportOpen(false); }} onMouseDown={e => e.preventDefault()}>
                  <FontAwesomeIcon icon={faTable} className="text-success" /> Excel (.xlsx)
                </button>
                <button className="dropdown-item px-4 py-2 d-flex align-items-center gap-2 btn btn-light border-0 w-100 text-start" onClick={() => { exportToWord(); setExportOpen(false); }} onMouseDown={e => e.preventDefault()}>
                  <FontAwesomeIcon icon={faFileExport} className="text-primary" /> Word (.doc)
                </button>
              </div>
            )}
          </div>
          <button className="btn btn-primary rounded-pill shadow-sm px-4" onClick={saveReport} disabled={!dirty}>
            <FontAwesomeIcon icon={faSave} className="me-2" /> {dirty ? 'Save' : 'Saved'}
          </button>
        </div>
      </div>

      <div className="row g-4">
        {!preview && (
          <div className="col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '20px', zIndex: 100}}>
              <h6 className="fw-bold mb-4 text-uppercase small letter-spacing-1 text-muted">Widget Library</h6>
              <div className="d-grid gap-2">
                {WIDGET_TYPES.map((item, i) => (
                  <button key={i} className="btn btn-light border-0 text-start p-3 rounded-4 d-flex align-items-center gap-3 widget-item" onClick={() => addWidget(item.type)}>
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary"><FontAwesomeIcon icon={item.icon} /></div>
                    <div><div className="fw-semibold small">{item.label}</div><div className="x-small text-muted">{item.desc}</div></div>
                    <FontAwesomeIcon icon={faPlus} className="ms-auto text-muted small opacity-50" />
                  </button>
                ))}
              </div>

              {activeWidgets.length > 0 && (
                <>
                  <hr className="my-4 opacity-50" />
                  <h6 className="fw-bold mb-3 text-uppercase small letter-spacing-1 text-muted">Canvas ({activeWidgets.length})</h6>
                  <div className="d-grid gap-2">
                    {activeWidgets.map((w, i) => (
                      <div key={w.id} className="d-flex align-items-center gap-2 p-2 rounded-3 bg-light small">
                        <FontAwesomeIcon icon={faGripVertical} className="text-muted opacity-50" />
                        <span className="flex-grow-1 text-truncate">{w.title || WIDGET_TYPES.find(t => t.type === w.type)?.label}</span>
                        <button className="btn btn-link text-danger p-0 btn-sm" onClick={() => removeWidget(w.id)}><FontAwesomeIcon icon={faTrash} /></button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <hr className="my-4 opacity-50" />
              <div className="ai-report-box p-4 rounded-4 bg-primary text-white position-relative overflow-hidden shadow-lg">
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <h6 className="fw-bold mb-2 d-flex align-items-center gap-2"><FontAwesomeIcon icon={faMagicWandSparkles} /> AI Architect</h6>
                  <p className="x-small text-white text-opacity-75 mb-3">Describe the report you want to build.</p>
                  <textarea className="form-control form-control-sm bg-white bg-opacity-20 border-0 text-white placeholder-light mb-3" rows="3" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="e.g. Monthly velocity report with KPI stats and task list..." />
                  <button className="btn btn-white btn-sm w-100 rounded-pill fw-bold text-primary py-2" onClick={generateFromAI} disabled={aiGenerating || !aiPrompt.trim()}>
                    {aiGenerating ? <><FontAwesomeIcon icon={faSpinner} spin className="me-2" /> Generating...</> : <><FontAwesomeIcon icon={faMagicWandSparkles} className="me-2" /> Generate Report</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={preview ? 'col-xl-12' : 'col-xl-9'}>
          <div className={`report-canvas p-4 rounded-5 ${preview ? 'bg-white border shadow-sm' : 'border-dashed min-vh-100 bg-light bg-opacity-50'}`}>
            {activeWidgets.length === 0 ? (
              <div className="text-center py-5">
                <div className="bg-white p-4 rounded-circle shadow-sm d-inline-block mb-4">
                  <FontAwesomeIcon icon={faLayerGroup} className="fs-1 text-primary opacity-20" />
                </div>
                <h5 className="fw-bold">Empty Canvas</h5>
                <p className="text-muted small">Click widgets from the library to start building your report.</p>
              </div>
            ) : (
              <div className="row g-4">
                {activeWidgets.map((widget) => (
                  <div className={widget.width} key={widget.id}>
                    <div className={`card border-0 h-100 p-4 widget-card position-relative ${preview ? 'shadow-sm rounded-4' : 'shadow-sm rounded-4'}`}>
                      {!preview && <div className="widget-handle position-absolute top-0 start-0 m-3 opacity-25"><FontAwesomeIcon icon={faGripVertical} /></div>}
                      <div className="d-flex justify-content-between align-items-center mb-3 ms-4">
                        {preview ? (
                          <h6 className="fw-bold mb-0">{widget.title}</h6>
                        ) : (
                          <input className="form-control form-control-sm fw-bold border-0 p-0 bg-transparent" value={widget.title} onChange={e => updateWidgetTitle(widget.id, e.target.value)} style={{ maxWidth: '70%' }} />
                        )}
                        {!preview && (
                          <button className="btn btn-link text-danger p-0 opacity-0 widget-delete" onClick={() => removeWidget(widget.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>
                      <div className="widget-preview-box rounded-4 bg-white p-3">
                        {renderWidgetContent(widget)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .border-dashed { border: 2px dashed rgba(0,0,0,0.1); }
        .widget-item:hover { background: #e3f2fd !important; border-color: #90caf9 !important; }
        .widget-card:hover .widget-delete { opacity: 1 !important; }
        .widget-card:hover .widget-handle { opacity: 0.8 !important; }
        .ai-report-box { background: linear-gradient(135deg, #2828e2 0%, #1e1e9c 100%); }
        .placeholder-light::placeholder { color: rgba(255,255,255,0.5); }
        .btn-white { background: white; color: #2828e2; }
        .x-small { font-size: 11px; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .report-canvas { transition: all 0.3s ease; }
        .widget-preview-box { min-height: 200px; }
        .widget-card { min-height: 180px; }
      `}</style>
    </div>
  );
};

export default TmsCustomReportsBuilder;
