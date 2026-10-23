import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/gstHelper';
import { OFFICIAL_COMPANY_DETAILS } from '../../data/companyDetails';
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Clock,
  Sparkles,
  Award,
  Layers,
  Wrench,
  Cpu,
  Camera,
  Hammer,
  Building,
  Calendar,
} from 'lucide-react';

interface ServiceDetailProps {
  categoryKey: string;
}

interface ServiceMeta {
  title: string;
  category: string;
  tagline: string;
  hsnSac: string;
  basePrice: number;
  unit: string;
  heroImage: string;
  description: string;
  specs: string[];
  subServices: {
    name: string;
    description: string;
    approxPrice: string;
    leadTime: string;
    image: string;
  }[];
  faqs: { q: string; a: string }[];
}

const SERVICE_CATALOG: Record<string, ServiceMeta> = {
  prefabrication: {
    title: 'Prefabrication & Porta Cabins',
    category: 'Prefabrication',
    tagline: 'Heavy-Duty Insulated Site Offices, Modular Containers & Guard Huts',
    hsnSac: '7308',
    basePrice: 180000,
    unit: 'per 20x10 unit',
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop',
    description:
      'KlickKar.com manufactures turnkey pre-engineered and insulated Porta Cabins built for extreme weather durability. Constructed with 50mm high-density PUF wall & roof panels, corrosion-resistant MS chassis, concealed electrical wiring, and heavy-duty vinyl flooring.',
    specs: [
      '50mm / 80mm High-Density PUF Panels (Thermal & Sound Insulated)',
      '18mm Cement Fiber Board Sub-base with 1.5mm Industrial Vinyl Sheet',
      'Concealed ISI Fire-Retardant Copper Wiring with MCB Distribution Box',
      'Anodized Aluminum Sliding Windows with Safety Wire Mesh & Glass',
      'Corrosion-Resistant Structural Base Chassis (IS 2062 Grade Steel)',
      'Plug-and-play setup ready for direct crane placement and immediate use',
    ],
    subServices: [
      {
        name: '20ft x 10ft Executive Site Office Cabin',
        description: 'Complete with executive desk partition, AC cutout, 4 LED battens, 4 power sockets, and lockable flush door.',
        approxPrice: '₹1,80,000 + 18% GST',
        leadTime: '5-7 Days Dispatch',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: '10ft x 10ft Security Guard & Ticketing Hut',
        description: '360-degree glass visibility, writing desk counter, exhaust provision, weatherproof roof canopy.',
        approxPrice: '₹95,000 + 18% GST',
        leadTime: '3-4 Days Dispatch',
        image: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: '40ft x 10ft Double-Bay Conference Container',
        description: 'Large modular conference cabin suitable for 14-person meetings, director chamber, and washroom integration.',
        approxPrice: '₹3,50,000 + 18% GST',
        leadTime: '8-10 Days Dispatch',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: 'Modular Portable Toilet & Shower Block',
        description: 'Hygienic FRP / PUF cabin with Western/Indian WC, CP fittings, washbasin, and waste plumbing lines.',
        approxPrice: '₹65,000 + 18% GST',
        leadTime: '3-5 Days Dispatch',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop',
      },
    ],
    faqs: [
      { q: 'How long does delivery take in Noida and Greater Noida?', a: 'Standard 20x10 cabins are delivered in 5 to 7 days directly from our Noida fabrication plant.' },
      { q: 'Can the cabin be moved to other construction sites later?', a: 'Yes, every cabin has dedicated heavy-duty lifting hooks for easy hydraulic crane loading and transit.' },
      { q: 'Can we claim GST input tax credit?', a: 'Yes! KlickKar issues 100% compliant GST tax invoices under HSN 7308 with 18% ITC credit.' },
    ],
  },

  fabrication: {
    title: 'Custom Metal & Steel Fabrication',
    category: 'Fabrication',
    tagline: 'Heavy MS & SS Gates, Railings, Grills, Tin Sheds & Industrial PEB Work',
    hsnSac: '7308',
    basePrice: 450,
    unit: 'per sq. ft',
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop',
    description:
      'We design and fabricate architectural and industrial steel structures with certified branded hollow pipes (Jindal / Tata Steel). From modern CNC laser-cut entrance gates to factory warehouse tin shed roofing.',
    specs: [
      'Certified Jindal / Apollo 14-Gauge & 16-Gauge Structural Steel Pipes',
      'SS 304 High-Grade Stainless Steel Balcony & Staircase Railings',
      'Anti-Rust Red Oxide Primer + 2 Coats of Polyurethane Enamel Finish',
      'Precision CNC Laser Cut Motifs and Structural Welding (MIG / TIG)',
      'Certified Weld Joint Tensile Strength with On-Site Civil Anchoring',
      'Custom CAD drawings approved prior to fabrication commencement',
    ],
    subServices: [
      {
        name: 'Heavy-Duty Main Entrance Gates (MS / SS)',
        description: 'Sliding or swing configurations with laser-cut geometric patterns and high-grade ball hinges.',
        approxPrice: 'From ₹480 / sq ft',
        leadTime: '4-7 Working Days',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: 'Modern Balcony & Staircase Safety Railings',
        description: 'Sleek SS 304 glass-bracket railings and MS horizontal safety bar designs.',
        approxPrice: 'From ₹380 / running ft',
        leadTime: '3-5 Working Days',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: 'Factory Warehouse Tin Shed & Trusses',
        description: 'Heavy structural steel columns, rafters, purlins, and Tata Bluescope color-coated profile sheets.',
        approxPrice: 'From ₹210 / sq ft covered',
        leadTime: '10-15 Working Days',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: 'Boundary Wall Security Grills & Fencing',
        description: 'Spiked anti-climb MS grill panels with rust-proof coating for residential high-rises and plots.',
        approxPrice: 'From ₹240 / running ft',
        leadTime: '2-4 Working Days',
        image: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=600&auto=format&fit=crop',
      },
    ],
    faqs: [
      { q: 'Do you provide on-site measurement in Delhi NCR?', a: 'Yes, our fabrication engineer visits your site with laser meters to record accurate dimensions free of cost.' },
      { q: 'What brand of steel is used?', a: 'We exclusively use branded mill-certified pipes such as Jindal, Apollo, and Tata Steel.' },
    ],
  },

  automation: {
    title: 'Smart Gate & Barrier Automation',
    category: 'Automation',
    tagline: 'Italian Sliding Gate Motors, Swing Actuators & RFID Boom Barriers',
    hsnSac: '8479',
    basePrice: 38000,
    unit: 'per setup',
    heroImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200&auto=format&fit=crop',
    description:
      'Upgrade your home, society, or industrial facility with effortless automation. We install heavy-duty Italian motors capable of smoothly operating gates up to 1000kg load, featuring obstacle sensors and smartphone integration.',
    specs: [
      'Italian Motors (Beninca, Ditec, Nice) with 2-Year Replacement Warranty',
      'Optical Anti-Crush Photocell Sensors for Pedestrian & Vehicle Safety',
      'Steel-reinforced Nylon & Zinc-plated Gear Racks for Silent Gliding',
      'Wireless Remote Controls with 50-Meter Range + Mobile App Access',
      'Manual Emergency Override Key in Case of Power Outage',
      'High-Speed Automatic Boom Barriers with Fast 1.5s - 3s Arm Opening',
    ],
    subServices: [
      {
        name: 'Heavy Automatic Sliding Gate Kit (Up to 1000 KG)',
        description: 'Includes motor, base plate, 4m steel gear rack, 2 wireless remotes, and photocell sensors.',
        approxPrice: '₹38,000 + 18% GST',
        leadTime: 'Installed in 24-48 Hours',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: 'Dual Swing Gate Telescopic Linear Actuators',
        description: 'Underground or linear arm actuators for luxurious double-swing entrance gates.',
        approxPrice: '₹55,000 + 18% GST',
        leadTime: 'Installed in 48 Hours',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: 'Automatic Toll & Society Boom Barrier System',
        description: 'Heavy cycle brushless barrier with 4m-6m telescopic boom, safety loop detector & push button.',
        approxPrice: '₹42,000 + 18% GST',
        leadTime: '2-3 Days Setup',
        image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: 'Long-Range RFID Vehicle Access Tag Reader',
        description: 'Hands-free automatic barrier opening for registered society and corporate resident windshield tags.',
        approxPrice: '₹22,000 + 18% GST',
        leadTime: 'Same-day Integration',
        image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=600&auto=format&fit=crop',
      },
    ],
    faqs: [
      { q: 'What happens when power goes off?', a: 'Every motor comes with a physical personalized key for quick manual override, plus optional battery backup.' },
      { q: 'Is there a warranty?', a: 'Yes! All gate motors come with a direct 2-Year Replacement Warranty and quarterly preventative servicing.' },
    ],
  },

  security: {
    title: 'Commercial Security & Surveillance',
    category: 'Security',
    tagline: '4K ColorVu IP CCTV, Video Door Phones & Biometric Access Control',
    hsnSac: '8525',
    basePrice: 16500,
    unit: 'per 4-cam kit',
    heroImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1200&auto=format&fit=crop',
    description:
      'Complete premise protection for residential villas, housing societies, factories, and commercial shops. We configure high-definition night-vision IP CCTV, cloud monitoring, and Video Door Phones (VDP).',
    specs: [
      '4K 8MP & 5MP ColorVu IP Cameras with Full Color Night Vision',
      '4K Network Video Recorders (NVR) with H.265+ Compression',
      'Secure Remote Live View on iOS & Android Smartphones',
      'Concealed Cat6 Network Cabling with Gigabit PoE Switches',
      'Smart Motion Detection & Human Body Perimeter Alarms',
      '1-Year Complete On-Site Hardware & Replacement Warranty',
    ],
    subServices: [
      {
        name: '4-Camera Commercial IP CCTV Package',
        description: '4 ColorVu cameras, 4-Channel PoE NVR, 2TB Surveillance Hard Disk, power supply & installation.',
        approxPrice: '₹18,500 + 18% GST',
        leadTime: '1 Day Installation',
        image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: 'Smart WiFi Video Door Phone (VDP) with Intercom',
        description: '7-Inch high-definition indoor touch screen with doorbell camera and mobile call forwarding.',
        approxPrice: '₹14,000 + 18% GST',
        leadTime: 'Same Day Setup',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: 'Biometric Fingerprint & Face Recognition Attendance',
        description: 'Time attendance terminal with electromagnetic door lock for corporate office access control.',
        approxPrice: '₹12,500 + 18% GST',
        leadTime: '1 Day Setup',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
      },
    ],
    faqs: [
      { q: 'Can I view the cameras on my phone when away from Noida?', a: 'Yes, our mobile app allows 24/7 live video monitoring and recorded playback from anywhere in the world.' },
    ],
  },

  renovation: {
    title: 'Turnkey Renovation & Remodeling',
    category: 'Renovation',
    tagline: 'Complete Commercial, Corporate & Residential Space Makeover',
    hsnSac: '9954',
    basePrice: 1200,
    unit: 'per sq. ft',
    heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
    description:
      'Transform dated commercial offices, clinics, retail shops, and residential floors with turnkey renovation. Dedicated site project manager, zero hassle, and guaranteed completion timelines.',
    specs: [
      'Turnkey Project Execution with Structured Milestone-Based Billing',
      'Commercial Gypsum False Ceiling with LED Acoustic Grid Lighting',
      'Heavy-Duty Flooring (Anti-Bacterial Vinyl, Vitrified Tiles, Epoxy)',
      'Waterproofing & Anti-Damp Wall Treatments with 5-Year Guarantee',
      'Electrical, LAN Cabling & Plumbing Remodeling with Certified MEPs',
      'Branded Material Grades (Asian Paints, UltraTech, Finolex, Saint Gobain)',
    ],
    subServices: [
      {
        name: 'Corporate Office Fitout & Remodeling',
        description: 'Glass partitions, workstation counters, acoustic false ceiling, laminate flooring and paint.',
        approxPrice: 'From ₹1,150 / sq ft',
        leadTime: '2-4 Weeks Project SLA',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: 'Clinic & Hospital Interior Renovation',
        description: 'Hospital-grade antibacterial vinyl sheet flooring, patient consultation cabins, reception desks.',
        approxPrice: 'From ₹950 / sq ft',
        leadTime: '10-15 Working Days',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: 'Complete Residential Villa & Apartment Renovation',
        description: 'Modern modular kitchen remodeling, designer bathrooms, tile replacement, and luxury painting.',
        approxPrice: 'From ₹1,400 / sq ft',
        leadTime: '3-6 Weeks Project SLA',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop',
      },
    ],
    faqs: [
      { q: 'Do you provide a formal Bill of Quantities (BOQ)?', a: 'Yes! We provide an itemized BOQ with exact material specifications, brand names, and transparent rates.' },
    ],
  },

  construction: {
    title: 'Civil Construction & PEB Structures',
    category: 'Construction',
    tagline: 'Pre-Engineered Steel Buildings, RCC Works & Turnkey Industrial Civil Projects',
    hsnSac: '9954',
    basePrice: 1850,
    unit: 'per sq. ft',
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop',
    description:
      'Turnkey civil engineering and industrial construction executed by licensed engineers under Mitaksh Infra (OPC) Private Limited. We handle foundation excavation, RCC columns, PEB steel buildings, and industrial warehouse structures.',
    specs: [
      'Pre-Engineered Building (PEB) Structural Design with Staad Pro Verification',
      'Grade M25 / M30 Ready-Mix Concrete with Testing Certificates',
      'Complete Civil Foundation, Retaining Walls & Heavy Machinery Bedding',
      'Industrial Flooring with Tremix / Vacuum Dewatered Concrete (VDF)',
      'Government Authority Clearances & Structural Safety Audits',
      'Timely Delivery SLA with Liquidated Damage Protection Clauses',
    ],
    subServices: [
      {
        name: 'Pre-Engineered Steel Industrial Sheds (PEB)',
        description: 'Clear span factory sheds, mezzanine floors, crane gantries, and insulated roofing.',
        approxPrice: 'From ₹260 / sq ft covered',
        leadTime: '3-6 Weeks Project Timeline',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: 'RCC Frame Civil Construction (Residential / Commercial)',
        description: 'Columns, beams, slabs, brickwork, plaster, and complete structural shell.',
        approxPrice: 'From ₹1,850 / sq ft built-up',
        leadTime: 'Milestone-based SLA',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop',
      },
    ],
    faqs: [
      { q: 'Where are your active construction sites?', a: 'We have active project executions across Noida Sector 62, Phase 2, Greater Noida Ecotech, and Yamuna Expressway.' },
    ],
  },

  maintenance: {
    title: 'Facility Maintenance & AMC Services',
    category: 'Maintenance',
    tagline: 'Annual Maintenance Contracts (AMC) for Housing Societies & Corporate Buildings',
    hsnSac: '9987',
    basePrice: 15000,
    unit: 'per quarter',
    heroImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop',
    description:
      'Prevent costly breakdowns with professional Annual Maintenance Contracts (AMC). We handle routine electrical inspections, plumbing pump maintenance, gate motor servicing, and structural metal rustproofing.',
    specs: [
      'Guaranteed 2-Hour Emergency Response Service across Noida & NCR',
      'Quarterly Comprehensive Preventative Maintenance Audit Reports',
      '20% Flat Discount on Replacement Spare Parts & Steel Works',
      'Dedicated Licensed Electrical & Mechanical Engineers Assigned',
      'GST-Compliant Quarterly Billing with Full Tax Input Eligibility',
    ],
    subServices: [
      {
        name: 'RWA & Society Annual Maintenance Contract (AMC)',
        description: 'Boom barrier servicing, motor greasing, common area electricals, and boundary fencing.',
        approxPrice: 'From ₹25,000 / month',
        leadTime: 'Annual Agreement',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: 'Commercial Office MEP Maintenance',
        description: 'AC routine servicing, electrical distribution panels, plumbing lines, and false ceiling repairs.',
        approxPrice: 'From ₹15,000 / quarter',
        leadTime: 'Annual Agreement',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop',
      },
    ],
    faqs: [
      { q: 'How quickly do you respond to emergency breakdowns?', a: 'Our mobile maintenance vans in Noida guarantee on-site response within 120 minutes.' },
    ],
  },

  property: {
    title: 'KlickKar Commercial & Industrial Property',
    category: 'KlickKar Property',
    tagline: 'Industrial Sheds, Factory Land Leasing & PEB Warehouse Rentals in Noida & NCR',
    hsnSac: '9972',
    basePrice: 50000,
    unit: 'consultancy & setup',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    description:
      'Finding the ideal industrial plot, manufacturing shed, or warehouse space in Noida and Greater Noida is seamless with KlickKar Property. We handle title verification, authority leasing, and customized shed construction.',
    specs: [
      'Verified Noida & Greater Noida Industrial Authority Clearances',
      'Direct Factory Land & Shed Leasing (Zero Hidden Commission)',
      'Custom PEB Shed Construction & Electrical Transformer Setup Support',
      'Industrial Fire NOC, Pollution Board & Factory License Facilitation',
      'Complete Legal Lease Deed Drafting & Registration Support',
    ],
    subServices: [
      {
        name: 'Industrial Warehouse Shed Leasing (5,000 - 50,000 Sq Ft)',
        description: 'Ready-to-move industrial sheds with 24ft height, dock levellers, and 100KVA power.',
        approxPrice: 'From ₹22 / sq ft / month',
        leadTime: 'Immediate Handover',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop',
      },
      {
        name: 'Industrial Land Allotment & Authority Transfers',
        description: 'Industrial plots in Ecotech Greater Noida, Noida Phase 2, and Yamuna Expressway.',
        approxPrice: 'Consultation & Due Diligence',
        leadTime: 'Verified Records',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
      },
    ],
    faqs: [
      { q: 'Do you assist with electricity and power load enhancement?', a: 'Yes, our team facilitates NPCL / PVVNL transformer installation and industrial power sanctions.' },
    ],
  },
};

export const ServiceDetailView: React.FC<ServiceDetailProps> = ({ categoryKey }) => {
  const { openBookingForService, setIsBookingModalOpen, services, setActiveNav } = useApp();

  const meta = SERVICE_CATALOG[categoryKey] || SERVICE_CATALOG.prefabrication;
  const matchedService = services.find((s) => s.category.toLowerCase().includes(meta.category.toLowerCase())) || services[0];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Banner */}
      <div className="relative bg-slate-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={meta.heroImage}
            alt={meta.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-500/40 px-3.5 py-1.5 rounded-full text-xs text-blue-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-semibold uppercase tracking-wider">{meta.category}</span>
              <span className="text-blue-400">•</span>
              <span className="font-mono">HSN/SAC: {meta.hsnSac}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {meta.title}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {meta.tagline}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openBookingForService(matchedService.id)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-3.5 rounded-xl text-sm shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Book Service / Request Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${OFFICIAL_COMPANY_DETAILS.phone.replace(/\s+/g, '')}`}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-3.5 rounded-xl text-sm border border-slate-700 flex items-center gap-2 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Call +91 96546 10640</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Overview & Technical Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineering Overview & Manufacturing Standards
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {meta.description}
            </p>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-blue-700">
                Key Technical Specifications:
              </h3>
              <div className="space-y-2.5">
                {meta.specs.map((spec, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Booking Card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6 sticky top-28">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider block">
                Instant Customer Booking
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Schedule a Site Visit in Noida & NCR
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Our site engineer will inspect within 24 hours with laser meters.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Starting Price:</span>
                <strong className="text-blue-700 font-bold">{formatINR(meta.basePrice)} {meta.unit}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GST Rate:</span>
                <strong className="text-slate-800">18% (Eligible for ITC)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">HSN/SAC Code:</span>
                <strong className="text-slate-800">{meta.hsnSac}</strong>
              </div>
            </div>

            <button
              onClick={() => openBookingForService(matchedService.id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Site Visit & Quotation</span>
            </button>

            <div className="text-center text-[11px] text-slate-500 space-y-1">
              <div>✓ Zero obligation • Free measurement in Noida</div>
              <div>Official billing under Mitaksh Infra (OPC) Pvt Ltd</div>
            </div>
          </div>
        </div>

        {/* Product / Sub-Services Catalog */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Available Models & Scope
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Popular Configurations & Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {meta.subServices.map((sub, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="h-44 overflow-hidden bg-slate-900">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-blue-700">{sub.approxPrice}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        {sub.leadTime}
                      </span>
                    </div>

                    <button
                      onClick={() => openBookingForService(matchedService.id)}
                      className="w-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Request Quotation
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Frequently Asked Questions — {meta.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            {meta.faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                <h4 className="font-bold text-slate-900">{faq.q}</h4>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
