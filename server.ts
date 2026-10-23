import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

const SYSTEM_INSTRUCTION = `
You are the official AI Assistant for KlickKar.com (operated by Mitaksh Infra (OPC) Private Limited), an engineering, prefabrication, fabrication, and automation platform based in Noida, Uttar Pradesh, India.

Brand Identity & Details:
- Brand Name: KlickKar.com
- Tagline: "NO FIKAR JUST CLICK KAR"
- Parent Entity: Mitaksh Infra (OPC) Private Limited
- Head Office: House no 605, Plot no 4, Vill Sardarpur, Noida, Uttar Pradesh, India – 201301
- Phone / WhatsApp: +91 96546 10640
- Email: Info@klickkar.com
- Official Website: https://www.klickkar.com/
- Google Business Profile: https://share.google/MbZtoE4BtqCtjNneg
- Shop Code: 07457164035700496418
- GSTIN: 09AATCM1473H1Z0 (UP State Code 09)
- Bank: Kotak Mahindra Bank, Account: 2051338170, IFSC: KKBK0005033, Branch: Noida Sector-18
- Service Areas: Noida, Greater Noida, Greater Noida West, Ghaziabad, Faridabad, Delhi NCR, Gurugram.

Core Services & Indicative Pricing:
1. Prefabrication: Porta Cabins, Container Site Offices, Security Guard Huts, Prefab Structures (PUF insulated, starting approx ₹1.8 Lakh per 20x10 unit).
2. Fabrication: Heavy MS & SS 304 Gates, Balcony Railings, Window Grills, Industrial Tin Sheds (starting ₹380 - ₹450 / sq ft).
3. Smart Automation: Italian Sliding/Swing Gate Motors (1000kg load, remote/app, starting ₹38,000 complete kit), Automatic Boom Barriers with RFID.
4. Security: 4K IP CCTV surveillance, Video Door Phones (VDP), Biometric access control (starting ₹16,500/kit).
5. Renovation & Construction: Turnkey civil remodeling, waterproofing, commercial fitouts (starting ₹1,200/sq ft).
6. Maintenance & AMC: Annual Maintenance Contracts for residential high-rises & factories.
7. Property: Industrial sheds & land in Noida & Greater Noida.

Key Behavior Guidelines:
- Be friendly, respectful, and professional ("Namaste!", polite Indian corporate courtesy).
- Support English and simple Hindi / Hinglish ("Ji bilkul, hum Noida aur Delhi NCR me same-day inspection provide karte hain.").
- Transparently state: "I am KlickKar's AI Assistant. Final quotes are confirmed after free site measurement."
- Never invent prices or give binding promises; provide transparent standard estimates.
- Proactively guide users to:
  1. Book a free site inspection
  2. Request an official itemized GST quotation (with CGST/SGST/IGST breakdown)
  3. Speak directly to our Project Manager at +91 96546 10640
- Politely collect lead details: Name, Phone number, Service required, Site location, and Budget.
- If the user provides customer contact info or enough lead data, include a structured tag at the very end of your response in the format:
<<<LEAD_CAPTURED:{"name":"...","phone":"...","serviceRequired":"...","location":"...","budget":"..."}>>>
`;

// AI Chatbot Route
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (aiClient) {
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-8)) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const rawText = response.text || '';
      
      // Check for lead extraction
      let extractedLead: any = null;
      let cleanedText = rawText;
      const leadMatch = rawText.match(/<<<LEAD_CAPTURED:(.*?)>>>/);
      if (leadMatch && leadMatch[1]) {
        try {
          extractedLead = JSON.parse(leadMatch[1]);
          cleanedText = rawText.replace(/<<<LEAD_CAPTURED:(.*?)>>>/, '').trim();
        } catch {
          // Ignore JSON parse error
        }
      }

      return res.json({
        reply: cleanedText,
        extractedLead,
      });
    } else {
      // Intelligent Rule-Based Fallback when GEMINI_API_KEY is not yet populated
      const lower = message.toLowerCase();
      let reply = '';
      let extractedLead: any = null;

      if (lower.includes('porta') || lower.includes('cabin') || lower.includes('prefab')) {
        reply = `Namaste! KlickKar.com specializes in heavy-duty insulated Porta Cabins and Container Site Offices manufactured at our factory in Noida. We use 50mm high-density PUF panels with concealed electrical wiring and vinyl flooring. Prices start around ₹1,80,000 for standard 20x10 ft units. Would you like our project engineer to schedule a free site inspection? Please share your name, phone number, and site location.`;
      } else if (lower.includes('gate') || lower.includes('motor') || lower.includes('automation') || lower.includes('boom')) {
        reply = `Hello! We install Italian-engineered heavy-duty sliding gate motors (up to 1000kg load capacity) with remote controls and optical safety sensors, as well as automatic boom barriers with RFID for societies and factories. Complete kits start from ₹38,000 with a 2-Year Warranty. Please share your site location and contact number to receive an instant quotation.`;
      } else if (lower.includes('fabrication') || lower.includes('railing') || lower.includes('grill') || lower.includes('shed')) {
        reply = `Namaste! We fabricate custom MS & SS 304 main gates, balcony railings, boundary wall grills, and industrial tin sheds. Rates start at approx ₹450 / sq ft including anti-rust primer and top coat. Where is your project located in Noida or NCR?`;
      } else if (lower.includes('cctv') || lower.includes('security') || lower.includes('camera')) {
        reply = `We provide commercial 4K ColorVu IP CCTV systems, Video Door Phones (VDP), and biometric access control with cloud and mobile remote view. Packages start at ₹16,500 with 1-year onsite warranty. Would you like an itemized proposal?`;
      } else if (lower.includes('gst') || lower.includes('invoice') || lower.includes('tax')) {
        reply = `Yes, all our services and materials come with 100% GST-compliant tax invoices under Mitaksh Infra (OPC) Private Limited (GSTIN: 09AATCM1473H1Z0). Registered B2B clients can claim full 18% Input Tax Credit (ITC). Bank transfer details: Kotak Mahindra Bank A/C 2051338170 (IFSC: KKBK0005033).`;
      } else if (lower.includes('phone') || lower.includes('call') || lower.includes('number') || lower.includes('contact')) {
        reply = `You can call or WhatsApp our official helpline directly at +91 96546 10640. Our engineering office is located at House no 605, Plot no 4, Vill Sardarpur, Noida, UP – 201301. We are available Monday to Saturday, 9:00 AM to 7:00 PM.`;
      } else {
        reply = `Namaste! Welcome to KlickKar.com (Mitaksh Infra (OPC) Pvt Ltd) — "No Fikar, Just Click Kar". We are your one-stop partner for Prefabrication (Porta Cabins), Fabrication (Gates & Railings), Smart Gate Automation, CCTV Security, and Renovation in Noida & Delhi NCR. How can our engineering team assist your project today?`;
      }

      // Check for phone number in user message to capture lead
      const phoneMatch = message.match(/(\+?91[\s-]?)?[6-9]\d{9}/);
      if (phoneMatch) {
        extractedLead = {
          name: 'Direct Web Chat Lead',
          phone: phoneMatch[0],
          serviceRequired: lower.includes('cabin') ? 'Prefabrication' : lower.includes('gate') ? 'Automation' : 'Engineering Services',
          location: lower.includes('noida') ? 'Noida' : 'Delhi NCR',
          budget: 'Flexible',
        };
      }

      return res.json({
        reply,
        extractedLead,
      });
    }
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      error: 'Failed to process chat message',
      reply: 'Namaste! We are experiencing a brief connection delay. Please feel free to call our direct engineering desk at +91 96546 10640 or WhatsApp us for immediate assistance.',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`KlickKar.com Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
