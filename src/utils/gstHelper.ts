/**
 * Format number into Indian Rupee representation (e.g. ₹ 1,25,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format Date to Indian standard DD/MM/YYYY
 */
export function formatDateIN(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Convert number into Indian currency words
 */
export function numberToIndianWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  if (!num) return '';

  const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const double = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertTwoDigits = (n: number): string => {
    if (n < 20) return single[n];
    return double[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + single[n % 10] : '');
  };

  const convertThreeDigits = (n: number): string => {
    let str = '';
    if (Math.floor(n / 100) > 0) {
      str += single[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 0) {
      str += convertTwoDigits(n);
    }
    return str.trim();
  };

  const rounded = Math.floor(num);
  let crore = Math.floor(rounded / 10000000);
  let remainder = rounded % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder %= 100000;
  let thousand = Math.floor(remainder / 1000);
  remainder %= 1000;
  let hundreds = remainder;

  let words = '';
  if (crore > 0) words += convertThreeDigits(crore) + ' Crore ';
  if (lakh > 0) words += convertThreeDigits(lakh) + ' Lakh ';
  if (thousand > 0) words += convertThreeDigits(thousand) + ' Thousand ';
  if (hundreds > 0) words += convertThreeDigits(hundreds) + ' ';

  const paise = Math.round((num - rounded) * 100);
  let paiseStr = '';
  if (paise > 0) {
    paiseStr = ' and ' + convertTwoDigits(paise) + ' Paise';
  }

  return (words.trim() + ' Rupees' + paiseStr + ' Only').replace(/\s+/g, ' ');
}

/**
 * Determine if intra-state or inter-state GST
 * KlickKar / Mitaksh Infra is registered in Uttar Pradesh (State code: 09)
 */
export function calculateGSTBreakdown(taxableAmount: number, placeOfSupplyStateCode: string = '09', gstRatePercent: number = 18) {
  const isIntraState = placeOfSupplyStateCode === '09'; // Uttar Pradesh
  
  if (isIntraState) {
    const halfRate = gstRatePercent / 2;
    const cgst = (taxableAmount * halfRate) / 100;
    const sgst = (taxableAmount * halfRate) / 100;
    return {
      type: 'CGST_SGST' as const,
      cgstRate: halfRate,
      cgstAmount: Math.round(cgst * 100) / 100,
      sgstRate: halfRate,
      sgstAmount: Math.round(sgst * 100) / 100,
      igstRate: 0,
      igstAmount: 0,
      totalTax: Math.round((cgst + sgst) * 100) / 100,
      grandTotal: Math.round((taxableAmount + cgst + sgst) * 100) / 100,
    };
  } else {
    const igst = (taxableAmount * gstRatePercent) / 100;
    return {
      type: 'IGST' as const,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: gstRatePercent,
      igstAmount: Math.round(igst * 100) / 100,
      totalTax: Math.round(igst * 100) / 100,
      grandTotal: Math.round((taxableAmount + igst) * 100) / 100,
    };
  }
}
