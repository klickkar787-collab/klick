import jsPDF from 'jspdf';
import { GSTInvoice, Quotation } from '../types';
import { OFFICIAL_COMPANY_DETAILS } from '../data/companyDetails';
import { formatINR, formatDateIN } from './gstHelper';

export function exportInvoicePDF(invoice: GSTInvoice) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [30, 86, 160]; // KlickKar Blue
  const darkColor = [30, 41, 59];

  // Header banner
  doc.setFillColor(30, 86, 160);
  doc.rect(0, 0, 210, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', 14, 12);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('(Under Section 31 of CGST Act, 2017)', 60, 12);
  doc.text('ORIGINAL FOR RECIPIENT', 150, 12);

  // Company Details
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(OFFICIAL_COMPANY_DETAILS.companyName, 14, 28);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(OFFICIAL_COMPANY_DETAILS.legalEntity, 14, 33);
  doc.setFontSize(8.5);
  doc.text(OFFICIAL_COMPANY_DETAILS.address, 14, 38, { maxWidth: 100 });
  doc.text(`Phone: ${OFFICIAL_COMPANY_DETAILS.phone} | Email: ${OFFICIAL_COMPANY_DETAILS.email}`, 14, 46);
  doc.setFont('helvetica', 'bold');
  doc.text(`GSTIN: ${OFFICIAL_COMPANY_DETAILS.gstin} | PAN: ${OFFICIAL_COMPANY_DETAILS.pan} | State: 09-Uttar Pradesh`, 14, 51);
  doc.text(`CIN: ${OFFICIAL_COMPANY_DETAILS.cin} | MSME: ${OFFICIAL_COMPANY_DETAILS.msme}`, 14, 56);

  // Invoice Meta Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(120, 24, 76, 34, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Invoice No:', 124, 30);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoiceNumber, 150, 30);

  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Date:', 124, 36);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDateIN(invoice.invoiceDate), 150, 36);

  doc.setFont('helvetica', 'bold');
  doc.text('Place of Supply:', 124, 42);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.placeOfSupply || '09-Uttar Pradesh', 150, 42);

  doc.setFont('helvetica', 'bold');
  doc.text('Payment Status:', 124, 48);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.paymentStatus.toUpperCase(), 150, 48);

  doc.setFont('helvetica', 'bold');
  doc.text('Reverse Charge:', 124, 54);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.reverseCharge || 'No', 150, 54);

  // Line separator
  doc.setDrawColor(30, 86, 160);
  doc.setLineWidth(0.5);
  doc.line(14, 62, 196, 62);

  // Buyer details
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 66, 182, 24, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('DETAILS OF RECEIVER / BILLED TO:', 18, 71);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(9);
  doc.text(`Name: ${invoice.customerName}`, 18, 77);
  doc.setFont('helvetica', 'normal');
  doc.text(`Phone: ${invoice.customerPhone} | Email: ${invoice.customerEmail}`, 18, 82);
  doc.text(`Address: ${invoice.customerAddress}`, 18, 87, { maxWidth: 174 });
  if (invoice.customerGstin) {
    doc.setFont('helvetica', 'bold');
    doc.text(`GSTIN/UIN: ${invoice.customerGstin}`, 120, 77);
  }

  // Items Table Header
  let y = 96;
  doc.setFillColor(30, 86, 160);
  doc.rect(14, y, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('#', 17, y + 5);
  doc.text('Description of Goods / Services', 26, y + 5);
  doc.text('HSN/SAC', 110, y + 5);
  doc.text('Qty', 128, y + 5);
  doc.text('Rate', 142, y + 5);
  doc.text('Taxable', 160, y + 5);
  doc.text('Total', 182, y + 5);

  y += 8;
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFont('helvetica', 'normal');

  invoice.items.forEach((item, index) => {
    doc.setFillColor(index % 2 === 0 ? 255 : 249, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 251);
    doc.rect(14, y, 182, 10, 'FD');
    doc.text((index + 1).toString(), 17, y + 6);
    doc.text(item.description.slice(0, 48), 26, y + 6);
    doc.text(item.hsnSac || '9954', 110, y + 6);
    doc.text(`${item.quantity} ${item.unit}`, 128, y + 6);
    doc.text(formatINR(item.unitPrice), 142, y + 6);
    doc.text(formatINR(item.taxableValue), 160, y + 6);
    doc.text(formatINR(item.total), 182, y + 6);
    y += 10;
  });

  // Summary box
  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.rect(110, y, 86, 36);
  
  doc.setFontSize(8.5);
  doc.text('Taxable Amount:', 114, y + 6);
  doc.text(formatINR(invoice.taxableAmount), 168, y + 6);

  if (invoice.totalCgst > 0 || invoice.totalSgst > 0) {
    doc.text('CGST (9%):', 114, y + 12);
    doc.text(formatINR(invoice.totalCgst), 168, y + 12);
    doc.text('SGST (9%):', 114, y + 18);
    doc.text(formatINR(invoice.totalSgst), 168, y + 18);
  } else {
    doc.text('IGST (18%):', 114, y + 15);
    doc.text(formatINR(invoice.totalIgst), 168, y + 15);
  }

  doc.setFillColor(241, 245, 249);
  doc.rect(110, y + 24, 86, 12, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Grand Total:', 114, y + 32);
  doc.text(formatINR(invoice.grandTotal), 164, y + 32);

  // Amount in words
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Amount in Words:', 14, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.amountInWords || '', 14, y + 12, { maxWidth: 90 });

  // Bank Details
  y += 42;
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, 100, 32, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('OFFICIAL BANK PAYMENT DETAILS', 18, y + 6);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Bank: ${OFFICIAL_COMPANY_DETAILS.bankAccount.bankName}`, 18, y + 12);
  doc.text(`Account Holder: ${OFFICIAL_COMPANY_DETAILS.bankAccount.accountHolder}`, 18, y + 17);
  doc.text(`Account Number: ${OFFICIAL_COMPANY_DETAILS.bankAccount.accountNumber}`, 18, y + 22);
  doc.text(`IFSC: ${OFFICIAL_COMPANY_DETAILS.bankAccount.ifsc} | Branch: ${OFFICIAL_COMPANY_DETAILS.bankAccount.branch}`, 18, y + 27);

  // Authorised Signatory block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('For MITAKSH INFRA (OPC) PRIVATE LIMITED', 125, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('(KlickKar.com - Authorized Signatory)', 125, y + 27);

  // Footer notes
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('This is a computer-generated GST tax invoice. Subject to Noida jurisdiction.', 14, 285);
  doc.text(`Generated on ${new Date().toLocaleString('en-IN')} | www.klickkar.com`, 120, 285);

  doc.save(`${invoice.invoiceNumber.replace(/\//g, '_')}.pdf`);
}

export function exportQuotationPDF(quote: Quotation) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  doc.setFillColor(30, 86, 160);
  doc.rect(0, 0, 210, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PROFORMA / ESTIMATED QUOTATION', 14, 12);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(quote.quotationNumber, 150, 12);

  // Company details
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(OFFICIAL_COMPANY_DETAILS.companyName, 14, 28);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(OFFICIAL_COMPANY_DETAILS.legalEntity, 14, 33);
  doc.text(OFFICIAL_COMPANY_DETAILS.address, 14, 38, { maxWidth: 100 });
  doc.text(`Phone: ${OFFICIAL_COMPANY_DETAILS.phone} | Email: ${OFFICIAL_COMPANY_DETAILS.email}`, 14, 46);
  doc.setFont('helvetica', 'bold');
  doc.text(`GSTIN: ${OFFICIAL_COMPANY_DETAILS.gstin} | PAN: ${OFFICIAL_COMPANY_DETAILS.pan}`, 14, 51);

  // Client Box
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 58, 182, 22, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`Quotation To: ${quote.customerName}`, 18, 64);
  doc.setFont('helvetica', 'normal');
  doc.text(`Phone: ${quote.customerPhone} | Email: ${quote.customerEmail}`, 18, 69);
  doc.text(`Site: ${quote.customerAddress}`, 18, 74, { maxWidth: 174 });

  let y = 88;
  doc.setFillColor(30, 86, 160);
  doc.rect(14, y, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('#', 17, y + 5.5);
  doc.text('Scope of Work / Specification', 26, y + 5.5);
  doc.text('Qty', 130, y + 5.5);
  doc.text('Rate', 150, y + 5.5);
  doc.text('Amount (₹)', 175, y + 5.5);

  y += 8;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');

  quote.items.forEach((item, index) => {
    doc.setFillColor(index % 2 === 0 ? 255 : 249, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 251);
    doc.rect(14, y, 182, 10, 'FD');
    doc.text((index + 1).toString(), 17, y + 6);
    doc.text(item.description.slice(0, 52), 26, y + 6);
    doc.text(`${item.quantity} ${item.unit}`, 130, y + 6);
    doc.text(formatINR(item.unitPrice), 150, y + 6);
    doc.text(formatINR(item.amount), 175, y + 6);
    y += 10;
  });

  // Total
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`Subtotal: ${formatINR(quote.subtotal)}`, 140, y + 6);
  if (quote.discount > 0) {
    doc.text(`Discount: -${formatINR(quote.discount)}`, 140, y + 12);
  }
  doc.text(`GST (18%): ${formatINR(quote.cgstAmount + quote.sgstAmount + quote.igstAmount)}`, 140, y + 18);
  doc.setFontSize(11);
  doc.setTextColor(30, 86, 160);
  doc.text(`Grand Total: ${formatINR(quote.grandTotal)}`, 140, y + 26);

  // Bank Info
  y += 34;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('BANK DETAILS FOR ADVANCE:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Beneficiary: ${OFFICIAL_COMPANY_DETAILS.bankAccount.accountHolder}`, 14, y + 5);
  doc.text(`Bank: ${OFFICIAL_COMPANY_DETAILS.bankAccount.bankName} | A/C: ${OFFICIAL_COMPANY_DETAILS.bankAccount.accountNumber}`, 14, y + 10);
  doc.text(`IFSC: ${OFFICIAL_COMPANY_DETAILS.bankAccount.ifsc} | Branch: ${OFFICIAL_COMPANY_DETAILS.bankAccount.branch}`, 14, y + 15);

  doc.save(`${quote.quotationNumber.replace(/\//g, '_')}.pdf`);
}
