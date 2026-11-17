import { getAccountingSettings } from '../api/fms';
import { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, WidthType, AlignmentType, BorderStyle, ImageRun } from 'docx';

let _companyInfo = null;
let _fetchPromise = null;

export async function ensureCompanyInfo() {
  if (_companyInfo) return _companyInfo;
  if (!_fetchPromise) {
    _fetchPromise = getAccountingSettings().then(res => {
      const data = res.data?.data || {};
      const templates = res.data?.templates || {};
      let logoUrl = data.companyLogo || null;
      let footerUrl = data.footerLogo || null;
      if (!logoUrl) {
        for (const t of Object.values(templates)) {
          if (t.dataUrl) { logoUrl = t.dataUrl; break; }
        }
      }
      if (!footerUrl) {
        for (const t of Object.values(templates)) {
          if (t.footerUrl) { footerUrl = t.footerUrl; break; }
        }
      }
      _companyInfo = {
        companyName: data.companyName || '',
        address: data.address || '',
        email: data.email || '',
        phone: data.phone || '',
        ntn: data.ntn || '',
        strn: data.strn || '',
        invoiceFooter: data.invoiceFooter || '',
        website: data.website || '',
        companyLogo: logoUrl,
        footerLogo: footerUrl,
      };
      return _companyInfo;
    }).catch(() => {
      _companyInfo = {
        companyName: '', address: '', email: '', phone: '',
        ntn: '', strn: '', invoiceFooter: '', website: '',
        companyLogo: null, footerLogo: null,
      };
      return _companyInfo;
    });
  }
  return _fetchPromise;
}

function downloadBlob(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = fileName;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function buildCompanyHeaderHtml(info) {
  let logoHtml = '';
  if (info.companyLogo) {
    logoHtml = '<div style="text-align:center;margin-bottom:12px;"><img src="' + info.companyLogo + '" style="max-height:80px;max-width:200px;object-fit:contain;" /></div>';
  }
  let nameHtml = info.companyName ? '<div style="font-size:20px;font-weight:700;margin-bottom:4px;">' + escHtml(info.companyName) + '</div>' : '';
  let addrHtml = info.address ? '<div style="font-size:11px;color:#555;margin-bottom:2px;">' + escHtml(info.address) + '</div>' : '';
  let contactHtml = '';
  if (info.email || info.phone) {
    contactHtml = '<div style="font-size:10px;color:#777;margin-bottom:2px;">';
    if (info.email) contactHtml += 'Email: ' + escHtml(info.email);
    if (info.email && info.phone) contactHtml += ' | ';
    if (info.phone) contactHtml += 'Phone: ' + escHtml(info.phone);
    contactHtml += '</div>';
  }
  let taxHtml = '';
  if (info.ntn || info.strn) {
    taxHtml = '<div style="font-size:10px;color:#777;margin-bottom:2px;">';
    if (info.ntn) taxHtml += 'NTN: ' + escHtml(info.ntn);
    if (info.ntn && info.strn) taxHtml += ' | ';
    if (info.strn) taxHtml += 'STRN: ' + escHtml(info.strn);
    taxHtml += '</div>';
  }
  let websiteHtml = info.website ? '<div style="font-size:10px;color:#777;">Web: ' + escHtml(info.website) + '</div>' : '';
  return '<div style="border-bottom:2px solid #6366f1;padding-bottom:12px;margin-bottom:16px;">' + logoHtml + nameHtml + addrHtml + contactHtml + taxHtml + websiteHtml + '</div>';
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

export async function exportPdf({ title, headers, rows, filename }) {
  const info = await ensureCompanyInfo();
  const dateStr = new Date().toISOString().slice(0, 10);
  const headerHtml = buildCompanyHeaderHtml(info);
  const thead = '<tr>' + headers.map(h => '<th style="background:#6366f1;color:#fff;padding:8px 10px;border:1px solid #6366f1;text-align:left;font-size:11px;text-transform:uppercase;">' + escHtml(h) + '</th>').join('') + '</tr>';
  const tbody = rows.map(r => '<tr>' + r.map(c => '<td style="padding:7px 10px;border:1px solid #e2e8f0;font-size:11px;">' + escHtml(c) + '</td>').join('') + '</tr>').join('');
  let footerHtml = '';
  if (info.invoiceFooter) {
    footerHtml += '<div style="text-align:center;font-size:9px;color:#888;margin-top:16px;padding-top:8px;border-top:1px solid #ddd;font-style:italic;">' + escHtml(info.invoiceFooter) + '</div>';
  }
  if (info.footerLogo) {
    footerHtml += '<div style="text-align:center;margin-top:8px;"><img src="' + info.footerLogo + '" style="max-height:60px;max-width:100%;object-fit:contain;" /></div>';
  }
  const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + escHtml(title) + '</title><style>body{font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:32px;color:#1e293b;background:#fff;}table{width:100%;border-collapse:collapse;margin-top:8px;}tr:nth-child(even){background:#f8fafc;}@media print{body{padding:16px;}th{background:#6366f1!important;color:white!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style></head><body>' + headerHtml + '<h2 style="font-size:16px;margin-bottom:4px;">' + escHtml(title) + '</h2><div style="font-size:11px;color:#888;margin-bottom:12px;">Generated: ' + dateStr + ' | Records: ' + rows.length + '</div><table><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table>' + footerHtml + '<script>window.onload=function(){window.print();}<\/script></body></html>';
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); }
}

export async function exportWord({ title, headers, rows, filename }) {
  const info = await ensureCompanyInfo();
  const dateStr = new Date().toISOString().slice(0, 10);
  let headerHtml = '';
  if (info.companyName) {
    headerHtml += '<div style="font-size:18px;font-weight:bold;margin-bottom:4px;">' + escHtml(info.companyName) + '</div>';
  }
  if (info.address) {
    headerHtml += '<div style="font-size:10px;color:#555;margin-bottom:2px;">' + escHtml(info.address) + '</div>';
  }
  if (info.email || info.phone) {
    headerHtml += '<div style="font-size:10px;color:#555;margin-bottom:2px;">';
    if (info.email) headerHtml += 'Email: ' + escHtml(info.email);
    if (info.email && info.phone) headerHtml += ' | ';
    if (info.phone) headerHtml += 'Phone: ' + escHtml(info.phone);
    headerHtml += '</div>';
  }
  if (info.companyLogo) {
    headerHtml = '<div style="text-align:center;margin-bottom:8px;"><img src="' + info.companyLogo + '" style="max-height:60px;" /></div>' + headerHtml;
  }
  if (headerHtml) {
    headerHtml = '<div style="border-bottom:2px solid #6366f1;padding-bottom:8px;margin-bottom:12px;">' + headerHtml + '</div>';
  }
  const thead = '<tr>' + headers.map(h => '<th style="background:#6366f1;color:white;border:1px solid #6366f1;padding:6px 8px;text-align:left;">' + escHtml(h) + '</th>').join('') + '</tr>';
  const tbody = rows.map(r => '<tr>' + r.map(c => '<td style="border:1px solid #ddd;padding:6px 8px;">' + escHtml(c) + '</td>').join('') + '</tr>').join('');
  let footerHtml = '';
  if (info.invoiceFooter) {
    footerHtml += '<div style="text-align:center;font-size:9px;color:#888;margin-top:12px;border-top:1px solid #ddd;padding-top:6px;font-style:italic;">' + escHtml(info.invoiceFooter) + '</div>';
  }
  const wordHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>' + escHtml(title) + '</title><!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]--><style>body{font-family:Times New Roman,Times,serif;font-size:11pt;color:#111;}h2{color:#6366f1;margin-bottom:4px;}table{border-collapse:collapse;width:100%;font-size:10pt;}th{background:#6366f1;color:white;border:1px solid #6366f1;padding:8px;text-align:left;}td{border:1px solid #ddd;padding:6px 8px;}</style></head><body>' + headerHtml + '<h2>' + escHtml(title) + '</h2><div style="font-size:9pt;color:#888;margin-bottom:12px;">Generated: ' + dateStr + ' | Records: ' + rows.length + '</div><table>' + thead + '</tr>' + tbody + '</table>' + footerHtml + '</body></html>';
  downloadBlob('\ufeff' + wordHtml, filename || (title.toLowerCase().replace(/\\s+/g,'_') + '-' + dateStr + '.doc'), 'application/msword');
}

export async function exportDocx({ title, headers, rows, filename }) {
  const info = await ensureCompanyInfo();
  const dateStr = new Date().toISOString().slice(0, 10);

  const headerChildren = [];
  if (info.companyName) {
    headerChildren.push(new Paragraph({ children: [new TextRun({ text: info.companyName, bold: true, size: 28, color: '6366f1' })], spacing: { after: 40 } }));
  }
  if (info.address) {
    headerChildren.push(new Paragraph({ children: [new TextRun({ text: info.address, size: 18, color: '555555' })], spacing: { after: 20 } }));
  }
  if (info.email || info.phone) {
    let contact = '';
    if (info.email) contact += 'Email: ' + info.email;
    if (info.email && info.phone) contact += ' | ';
    if (info.phone) contact += 'Phone: ' + info.phone;
    headerChildren.push(new Paragraph({ children: [new TextRun({ text: contact, size: 16, color: '777777' })], spacing: { after: 20 } }));
  }
  if (info.ntn || info.strn) {
    let tax = '';
    if (info.ntn) tax += 'NTN: ' + info.ntn;
    if (info.ntn && info.strn) tax += ' | ';
    if (info.strn) tax += 'STRN: ' + info.strn;
    headerChildren.push(new Paragraph({ children: [new TextRun({ text: tax, size: 16, color: '777777' })], spacing: { after: 20 } }));
  }
  if (headerChildren.length > 0) {
    headerChildren.push(new Paragraph({ spacing: { after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '6366f1' } } }));
  }

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(h => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 18 })] })],
      shading: { fill: '6366f1' },
      width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
    })),
  });

  const dataRows = rows.map(r => new TableRow({
    children: r.map(c => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: String(c ?? ''), size: 16 })] })],
    })),
  }));

  const doc = new Document({
    styles: {
      default: { document: { run: { font: 'Calibri', size: 20 } } },
    },
    sections: [{
      children: [
        ...headerChildren,
        new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 24, color: '6366f1' })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: 'Generated: ' + dateStr + '  |  Records: ' + rows.length, size: 16, color: '64748b' })], spacing: { after: 200 } }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [headerRow, ...dataRows],
        }),
        ...(info.invoiceFooter ? [new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: info.invoiceFooter, size: 16, color: '888888', italics: true })], border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'cccccc' } } })] : []),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || (title.toLowerCase().replace(/\\s+/g,'_') + '-' + dateStr + '.docx');
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
