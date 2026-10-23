import { AppSettings } from '../types';

export const OFFICIAL_COMPANY_DETAILS: AppSettings = {
  companyName: 'KlickKar.com',
  legalEntity: 'Mitaksh Infra (OPC) Private Limited',
  gstin: '09AATCM1473H1Z0',
  cin: 'U70200UP2025OPC219795',
  pan: 'AATCM1473H',
  tan: 'MRTM16447E',
  msme: 'UDYAM-UP-28-0155954',
  address: 'House no 605, Plot no 4, Vill Sardarpur, Noida, Uttar Pradesh, India – 201301',
  phone: '+91 96546 10640',
  email: 'Info@klickkar.com',
  website: 'https://www.klickkar.com/',
  shopCode: '07457164035700496418',
  googleProfileUrl: 'https://share.google/MbZtoE4BtqCtjNneg',
  bankAccount: {
    accountHolder: 'MITAKSH INFRA OPC PRIVATE LIMITED',
    bankName: 'KOTAK MAHINDRA BANK',
    accountNumber: '2051338170',
    ifsc: 'KKBK0005033',
    branch: 'NOIDA SECTOR-18',
  },
  whatsapp: {
    enabled: true,
    phoneNumber: '+91 96546 10640',
    defaultMessage: 'Hi KlickKar team, I need a quotation for structural/fabrication work in Noida.',
  },
  telegram: {
    enabled: true,
    botToken: '7829104821:AAH-kkBot_ProductionToken_2026',
    botUsername: 'KlickKar_Support_Bot',
    autoReply: true,
  },
  aiChatbot: {
    enabled: true,
    welcomeMessage: 'Namaste! I am KlickKar AI Assistant. How can our engineering & fabrication team assist your project today?',
    botName: 'KlickKar AI Assistant',
  },
  paymentTerms: {
    standardAdvancePercentage: 40,
    allowCashOnSite: true,
    cashOnSiteMaxLimit: 20000,
    termsClauses: [
      '40% Advance upon order confirmation & drawing/technical approval.',
      '40% Milestone payment upon material dispatch / fabrication progress.',
      '20% Final balance payment upon site installation, testing & formal handover.',
      'All payments must be made strictly in favour of MITAKSH INFRA OPC PRIVATE LIMITED.',
      'Statutory GST @ 18% is applicable with Input Tax Credit (ITC) available for registered businesses.',
    ],
    cancellationRefundPolicy: 'Orders cancelled within 24 hours of booking are eligible for a 100% refund. For custom fabricated items, once material processing starts, advance deposits are non-refundable to cover steel procurement and custom cutting.',
  },
};

export const SERVICE_AREAS = [
  'Noida',
  'Greater Noida',
  'Greater Noida West (Noida Ext.)',
  'Delhi NCR',
  'Ghaziabad',
  'Faridabad',
  'Gurugram / Manesar',
  'Yamuna Expressway & Nearby Locations',
];

export const ASSETS = {
  logo: '/assets/aistudio/Untitled_design__1__0c7b2e98.png',
  logoWide: '/assets/aistudio/Untitled_design__2__f6714e5b.png',
  stampSeal: '/assets/aistudio/Blue_Corporate_Stamp_Seal_Emblem_b7965f48.png',
  mascotTools: '/assets/aistudio/Gemini_Generated_Image_mtpl8ymtpl8ymtpl_e77b28d8.png',
  mascotBadge: '/assets/aistudio/Gemini_Generated_Image_th53idth53idth53__1__06fa69fe.png',
  introVideo: '/assets/aistudio/erasio_Logo_assembly_animation_for_klic__20261018000626_a350672d.mp4',
};

// State code helper for Indian GST
export const GST_STATE_CODES: Record<string, string> = {
  '09': 'Uttar Pradesh',
  '07': 'Delhi',
  '06': 'Haryana',
  '08': 'Rajasthan',
  '27': 'Maharashtra',
  '03': 'Punjab',
  '19': 'West Bengal',
  '29': 'Karnataka',
  '33': 'Tamil Nadu',
};
