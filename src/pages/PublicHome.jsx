import React, { useState } from 'react';
import { 
  Activity, 
  Calendar, 
  Phone, 
  Clock,
  ShieldCheck,
  Stethoscope, 
  Users,
  Heart, 
  CheckCircle, 
  Check,
  AlertCircle, 
  Award,
  Star, 
  ShieldPlus, 
  HeartPulse, 
  Quote,
  ArrowRight, 
  Sparkles, 
  Zap, 
  Brain, 
  Bone, 
  Eye,
  Send,
  HelpCircle,
  Plus,
  Minus,
  UserCheck
} from 'lucide-react';
import doctorSarah from '../assets/images/doctor_sarah.jpg';
import doctorMichael from '../assets/images/doctor_michael.jpg';
import doctorEmily from '../assets/images/doctor_emily.jpg';
import doctorDavid from '../assets/images/doctor_david.jpg';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const SERVICES = [
  { 
    title: 'Cardiology & Heart Center', 
    description: 'Comprehensive non-invasive & interventional cardiac treatments, ECG diagnostics, and 24/7 emergency catheterization.', 
    icon: Heart, 
    color: 'from-rose-500 to-red-600',
    tag: 'Heart Care'
  },
  { 
    title: 'Pediatric Care & NICU', 
    description: 'Specialized clinical care for newborns, toddlers, and teens with child-friendly inpatient suites and level-3 NICU.', 
    icon: HeartPulse, 
    color: 'from-violet-500 to-purple-600',
    tag: 'Child Health'
  },
  { 
    title: 'Orthopedic & Joint Institute', 
    description: 'Computer-assisted robotic joint replacement, advanced arthroscopy, spinal surgery, and dedicated sports rehab.', 
    icon: Bone, 
    color: 'from-sky-500 to-blue-600',
    tag: 'Joints & Bones'
  },
  { 
    title: 'Neurology & Stroke Unit', 
    description: 'Comprehensive neurological evaluations, high-resolution neuroimaging, stroke thrombolysis, and epilepsy management.', 
    icon: Brain, 
    color: 'from-amber-500 to-orange-600',
    tag: 'Brain & Spine'
  },
  { 
    title: 'Advanced Ophthalmology', 
    description: 'Precision laser vision correction, cataract microsurgery, retinal therapies, and comprehensive corneal care.', 
    icon: Eye, 
    color: 'from-emerald-500 to-teal-600',
    tag: 'Vision Care'
  },
  { 
    title: '24/7 Trauma & Emergency', 
    description: 'State-of-the-art Level 1 trauma facilities with immediate board-certified resuscitation doctors always on-site.', 
    icon: Zap, 
    color: 'from-red-500 to-rose-700',
    tag: 'Immediate Care'
  },
];

const BENTO_FEATURES = [
  {
    title: 'Next-Gen Robotic Surgery',
    desc: 'Sub-millimeter surgical precision with faster recovery times and minimal scarring.',
    badge: 'Da Vinci Xi System',
    icon: Sparkles,
    gradient: 'from-slate-900 to-slate-800 text-white'
  },
  {
    title: 'Instant AI Diagnostic Imaging',
    desc: '3T MRI and 256-slice CT scans with AI-assisted pathology detection in under 15 minutes.',
    badge: 'Rapid Results',
    icon: Activity,
    gradient: 'from-emerald-950 via-slate-900 to-slate-900 text-white'
  },
  {
    title: 'Zero-Wait Emergency Ward',
    desc: 'Immediate triage protocol ensuring critical patients are seen within 60 seconds.',
    badge: '24/7 Available',
    icon: Zap,
    gradient: 'from-slate-900 to-slate-800 text-white'
  }
];

const TESTIMONIALS = [
  { 
    name: 'Robert Anderson', 
    role: 'Cardiac Surgery Patient', 
    text: 'The cardiology team at CarePlus saved my life. From the moment I was admitted to post-op recovery, the doctors were world-class and deeply empathetic.', 
    rating: 5, 
    badge: 'Verified Patient' 
  },
  { 
    name: 'Maria Gonzalez', 
    role: 'Mother of Pediatric Patient', 
    text: 'Dr. Michael Chang and the pediatric nurses made my daughter feel completely at ease. Clean, high-tech, and incredibly warm staff.', 
    rating: 5, 
    badge: 'Verified Parent' 
  },
  { 
    name: 'James Whitfield', 
    role: 'Robotic Knee Replacement', 
    text: 'I was walking unassisted within 3 weeks after surgery. The robotic joint replacement program here is simply extraordinary.', 
    rating: 5, 
    badge: 'Verified Patient' 
  },
];

const FAQS = [
  {
    q: 'How do I schedule an appointment with a specialist?',
    a: 'You can book an appointment directly through our online form below, or call our 24/7 appointment hotline at +1 (800) 432-7800. We confirm appointments within 15 minutes.'
  },
  {
    q: 'Do you accept major health insurance providers?',
    a: 'Yes, CarePlus accepts over 95% of national and regional health insurance plans, including BlueCross, Aetna, Cigna, Medicare, and UnitedHealthcare. Our billing specialists assist with pre-authorizations.'
  },
  {
    q: 'What should I bring on the day of my appointment?',
    a: 'Please bring a valid photo ID, your insurance card, any previous medical records or test results related to your condition, and a list of your current medications.'
  },
  {
    q: 'Is emergency service available round-the-clock?',
    a: 'Yes, our Level-1 Emergency & Trauma Care Department is open 24 hours a day, 365 days a year, staffed by board-certified emergency physicians and critical care nurses.'
  }
];

export default function PublicHome({ bookingRef }) {
  const DOCTORS = [
    { 
      name: 'Dr. Sarah Jenkins', 
      specialty: 'Chief Cardiologist', 
      experience: '14+ Yrs Exp', 
      education: 'MD, FACC — Harvard Medical School', 
      availability: 'Mon — Fri, 9:00 AM — 1:00 PM', 
      image: doctorSarah 
    },
    { 
      name: 'Dr. Michael Chang', 
      specialty: 'Senior Pediatrician', 
      experience: '11+ Yrs Exp', 
      education: 'MD — Johns Hopkins Medicine', 
      availability: 'Mon — Sat, 2:00 PM — 6:00 PM', 
      image: doctorMichael 
    },
    { 
      name: 'Dr. Emily Ross', 
      specialty: 'Orthopedic Surgeon', 
      experience: '16+ Yrs Exp', 
      education: 'MD, FACS — Stanford Medicine', 
      availability: 'Tue — Thu, 10:00 AM — 4:00 PM', 
      image: doctorEmily 
    },
    { 
      name: 'Dr. David Miller', 
      specialty: 'Consultant Neurologist', 
      experience: '10+ Yrs Exp', 
      education: 'MD — Columbia University', 
      availability: 'Wed — Fri, 1:00 PM — 5:00 PM', 
      image: doctorDavid 
    }
  ];

  const [formData, setFormData] = useState({
    patient_name: '', 
    patient_email: '', 
    patient_phone: '',
    doctor_name: '', 
    appointment_date: '', 
    appointment_time: '', 
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectDoctorAndScroll = (doctorName) => {
    setFormData(prev => ({ ...prev, doctor_name: doctorName }));
    if (bookingRef?.current) {
      bookingRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!formData.patient_name || !formData.patient_email || !formData.patient_phone || !formData.doctor_name || !formData.appointment_date || !formData.appointment_time) {
      setMessage({ type: 'error', text: 'Please complete all required fields.' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `Success! Appointment confirmed with ${formData.doctor_name}. Our reception desk will contact you via SMS shortly.` 
        });
        setFormData({
          patient_name: '',
          patient_email: '',
          patient_phone: '',
          doctor_name: '',
          appointment_date: '',
          appointment_time: '',
          notes: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Error occurred while scheduling.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Cannot connect to backend server. Make sure Python backend is running.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* ═══════════════════════════════════════════
          1. HERO SECTION — Ultra Modern Glass & Floating Aesthetics
      ═══════════════════════════════════════════ */}
      <section id="home" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 overflow-hidden">
        {/* Futuristic Background Gradients & Grids */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.12),transparent_40%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>
        
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column — Text & Dynamic CTAs */}
            <div className="lg:col-span-7 space-y-8 text-left animate-fade-in-up">
              
              {/* Trust & Accreditations Pill */}
              <div className="inline-flex items-center gap-3 bg-slate-800/90 border border-slate-700/80 px-4 py-2 rounded-full backdrop-blur-xl shadow-lg shadow-black/20">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-200">Rated 4.9/5 by 10,000+ Patients</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
                  Next-Gen <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 animate-gradient-x">
                    Precision Medical Care
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl font-normal">
                  World-renowned specialists, AI-accelerated diagnostics, and compassionate inpatient facilities engineered for optimal human healing.
                </p>
              </div>

              {/* CTA Action Bar */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={() => bookingRef?.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/25 pulse-glow cursor-pointer text-base hover-lift group"
                >
                  <Calendar className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                  Book Appointment Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <a 
                  href="#services" 
                  className="border border-slate-700 hover:border-slate-500 bg-slate-800/60 backdrop-blur-xl text-white font-bold px-8 py-4 rounded-2xl transition-all text-center flex items-center justify-center gap-2 text-base hover-lift hover:bg-slate-800"
                >
                  <Stethoscope className="w-5 h-5 text-emerald-400" />
                  Explore Specialties
                </a>
              </div>

              {/* Live Status Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">JCI Gold</p>
                    <p className="text-[10px] text-slate-400">Accredited</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">150+ Doctors</p>
                    <p className="text-[10px] text-slate-400">On Duty Today</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">24/7 Trauma</p>
                    <p className="text-[10px] text-slate-400">Zero Wait Time</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column — 3D Floating Collage & Live Telemetry */}
            <div className="lg:col-span-5 relative flex justify-center items-center min-h-[460px]">
              
              {/* Central Glowing Shield Frame */}
              <div className="relative z-10 w-[280px] sm:w-[320px] h-[390px] sm:h-[430px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-500/10 border-2 border-slate-700/80 animate-float bg-slate-800">
                <img 
                  src={doctorSarah} 
                  alt="Dr. Sarah Jenkins" 
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Featured Specialist</p>
                  <p className="text-xl font-black text-white">Dr. Sarah Jenkins</p>
                  <p className="text-xs text-slate-300">Chief of Interventional Cardiology</p>
                </div>
              </div>

              {/* Floating Live Badge 1 — Top Right */}
              <div className="absolute -top-4 right-0 sm:right-4 z-20 glass-card bg-slate-900/90 border border-slate-700 p-4 rounded-2xl shadow-2xl backdrop-blur-xl animate-float-delayed max-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                  <p className="text-xs font-extrabold text-white">Instant Triage</p>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Average check-in time under 4 minutes</p>
              </div>

              {/* Floating Live Badge 2 — Bottom Left */}
              <div className="absolute -bottom-6 -left-4 sm:left-0 z-20 glass-card bg-slate-900/90 border border-slate-700 p-4 rounded-2xl shadow-2xl backdrop-blur-xl animate-float-reverse max-w-[210px]">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-black">Top 1% Center</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">Recognized for surgical excellence & safety</p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. STATS BANNER — High-Tech Metrics
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16">
        <div className="bg-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-slate-700/80 shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { num: '30+', label: 'Medical Specialties', icon: Stethoscope, color: 'text-emerald-400' },
            { num: '150+', label: 'Board Doctors', icon: Users, color: 'text-teal-400' },
            { num: '45,000+', label: 'Surgeries Performed', icon: Heart, color: 'text-rose-400' },
            { num: '99.8%', label: 'Clinical Satisfaction', icon: ShieldCheck, color: 'text-amber-400' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className={`p-4 rounded-2xl bg-slate-900/90 border border-slate-700 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">{stat.num}</p>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. BENTO GRID — High-Tech Capabilities
      ═══════════════════════════════════════════ */}
      <section id="about" className="py-20 bg-slate-950/60 relative border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Gen Medical Infrastructure
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Pioneering Care With <br className="hidden sm:block"/> Advanced Medical Technology
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Our hospital integrates cutting-edge robotic tools, AI diagnostic pathways, and ultra-hygienic smart wards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {BENTO_FEATURES.map((feat, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/90 border border-slate-800 p-8 rounded-[2rem] hover-lift relative overflow-hidden group flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all"></div>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <feat.icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-extrabold bg-slate-800 text-slate-300 px-3.5 py-1.5 rounded-full border border-slate-700">
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-3">{feat.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800/80 mt-6 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>Explore Protocol</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. MEDICAL SERVICES & SPECIALTIES
      ═══════════════════════════════════════════ */}
      <section id="services" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest">
                <Stethoscope className="w-3.5 h-3.5" />
                Specialized Departments
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Comprehensive Clinical Departments
              </h2>
            </div>
            <p className="text-slate-400 max-w-md text-sm sm:text-base">
              Every department is staffed by board-certified physicians, supported by dedicated medical teams and specialized equipment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((srv, index) => (
              <div 
                key={index} 
                className="bg-slate-800/70 border border-slate-700/80 hover:border-emerald-500/50 p-8 rounded-[2rem] hover-lift transition-all group relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-4 rounded-2xl bg-gradient-to-tr ${srv.color} text-white shadow-lg`}>
                      <srv.icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
                      {srv.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-3 group-hover:text-emerald-400 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {srv.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-700/60 flex items-center justify-between">
                  <button 
                    onClick={() => bookingRef?.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    Book Specialist <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. MEET OUR DOCTORS & SPECIALISTS
      ═══════════════════════════════════════════ */}
      <section id="doctors" className="py-24 bg-slate-950/80 relative border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest">
              <UserCheck className="w-3.5 h-3.5" />
              World-Class Faculty
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Meet Our Leading Specialists
            </h2>
            <p className="text-slate-400 text-base">
              Board-certified practitioners with decades of combined clinical leadership and patient-centric dedication.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {DOCTORS.map((doc, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden hover-lift flex flex-col justify-between group"
              >
                {/* Doctor Photo */}
                <div className="relative h-72 w-full overflow-hidden bg-slate-800">
                  <img 
                    src={doc.image} 
                    alt={doc.name} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  <span className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md text-emerald-400 text-xs font-extrabold px-3 py-1 rounded-full border border-slate-700">
                    {doc.experience}
                  </span>
                </div>

                {/* Doctor Info */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">{doc.specialty}</p>
                    <h3 className="text-xl font-bold text-white tracking-tight">{doc.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{doc.education}</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 pt-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{doc.availability}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => selectDoctorAndScroll(doc.name)}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-md shadow-emerald-500/20 cursor-pointer mt-4"
                  >
                    <Calendar className="w-4 h-4" />
                    Book with {doc.name.split(' ')[1]}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. SMART ONLINE APPOINTMENT BOOKING SECTION
      ═══════════════════════════════════════════ */}
      <section id="booking" ref={bookingRef} className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="bg-slate-900/95 border border-slate-700/80 rounded-[2.5rem] shadow-2xl p-8 sm:p-12 lg:p-16 grid lg:grid-cols-12 gap-12 items-center backdrop-blur-2xl">
            
            {/* Left Side: Booking Guidelines & Benefits */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5" />
                  Fast-Track Scheduling
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  Book Your Consultation
                </h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Fill in your preferred doctor and time slot. Our automated dispatch will confirm your slot instantly without waiting in phone queues.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Zero Registration Fee', desc: 'No upfront registration or booking charge required.' },
                  { title: 'SMS & Email Reminder', desc: 'Instant confirmation with Google Calendar integration.' },
                  { title: 'Flexible Rescheduling', desc: 'Reschedule or modify your slot anytime with 1 click.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/30 flex items-center gap-4">
                <Phone className="w-8 h-8 text-emerald-400 shrink-0 animate-bounce" />
                <div>
                  <p className="text-xs font-bold uppercase text-emerald-400">Emergency Helpline</p>
                  <p className="text-xl font-black text-white">+1 (800) 432-7800</p>
                </div>
              </div>
            </div>

            {/* Right Side: Interactive Booking Form */}
            <div className="lg:col-span-7 bg-slate-850/80 border border-slate-700 p-8 sm:p-10 rounded-3xl shadow-xl">
              
              {message && (
                <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm font-bold ${
                  message.type === 'success' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">Patient Full Name *</label>
                    <input 
                      type="text" 
                      name="patient_name" 
                      required 
                      value={formData.patient_name} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Johnathan Doe" 
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      name="patient_email" 
                      required 
                      value={formData.patient_email} 
                      onChange={handleInputChange} 
                      placeholder="john@example.com" 
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="patient_phone" 
                      required 
                      value={formData.patient_phone} 
                      onChange={handleInputChange} 
                      placeholder="+1 (555) 000-0000" 
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">Select Specialist *</label>
                    <select 
                      name="doctor_name" 
                      required 
                      value={formData.doctor_name} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-medium"
                    >
                      <option value="">-- Choose Specialist --</option>
                      {DOCTORS.map((d, i) => (
                        <option key={i} value={d.name}>{d.name} ({d.specialty})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">Preferred Date *</label>
                    <input 
                      type="date" 
                      name="appointment_date" 
                      required 
                      value={formData.appointment_date} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">Preferred Time Slot *</label>
                    <select 
                      name="appointment_time" 
                      required 
                      value={formData.appointment_time} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-medium"
                    >
                      <option value="">-- Select Time --</option>
                      <option value="09:00 AM">09:00 AM - Morning Slot</option>
                      <option value="11:30 AM">11:30 AM - Morning Slot</option>
                      <option value="02:00 PM">02:00 PM - Afternoon Slot</option>
                      <option value="04:30 PM">04:30 PM - Evening Slot</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">Medical Reason / Notes (Optional)</label>
                  <textarea 
                    name="notes" 
                    rows="3" 
                    value={formData.notes} 
                    onChange={handleInputChange} 
                    placeholder="Briefly describe your symptoms or reason for visit..." 
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-medium"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-xl transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-base hover-lift"
                >
                  {loading ? (
                    <span>Scheduling Consultation...</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Confirm & Schedule Appointment
                    </>
                  )}
                </button>
              </form>

            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7. PATIENT TESTIMONIALS
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-slate-950/70 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest">
              <Quote className="w-3.5 h-3.5" />
              Patient Experiences
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Trusted by Thousands of Families
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover-lift flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic">"{t.text}"</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-sm">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          8. FAQ ACCORDION
      ═══════════════════════════════════════════ */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            Common Inquiries
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden transition-all"
              >
                <button 
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 text-base font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="p-2 rounded-xl bg-slate-900 text-emerald-400">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-700/50 pt-4 animate-fade-in-up">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          9. FOOTER — Ultra Modern Minimal Dark
      ═══════════════════════════════════════════ */}
      <footer id="contact" className="bg-slate-950 text-slate-400 pt-20 pb-12 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
            
            {/* Col 1: Brand */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/20 p-2.5 rounded-2xl border border-emerald-500/30">
                  <HeartPulse className="h-7 w-7 text-emerald-400 animate-pulse" />
                </div>
                <span className="text-2xl font-black tracking-tight text-white">
                  CarePlus <span className="text-emerald-400">Hospital</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Empowering patients with compassionate, cutting-edge medical interventions and clinical excellence around the clock.
              </p>
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency Ambulance Service</p>
                <p className="text-lg font-black text-emerald-400 mt-0.5">+1 (800) 911-CARE</p>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#home" className="hover:text-emerald-400 transition-colors">Home Overview</a></li>
                <li><a href="#about" className="hover:text-emerald-400 transition-colors">About Facility</a></li>
                <li><a href="#services" className="hover:text-emerald-400 transition-colors">Specialties</a></li>
                <li><a href="#doctors" className="hover:text-emerald-400 transition-colors">Doctor Directory</a></li>
                <li><a href="#booking" className="hover:text-emerald-400 transition-colors">Book Online</a></li>
              </ul>
            </div>

            {/* Col 3: Departments */}
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">Departments</h4>
              <ul className="space-y-2.5 text-sm">
                <li><span className="hover:text-white transition-colors">Cardiology Institute</span></li>
                <li><span className="hover:text-white transition-colors">Pediatric ICU</span></li>
                <li><span className="hover:text-white transition-colors">Robotic Orthopedics</span></li>
                <li><span className="hover:text-white transition-colors">Neurosciences Center</span></li>
                <li><span className="hover:text-white transition-colors">Emergency & Trauma</span></li>
              </ul>
            </div>

            {/* Col 4: Administrative */}
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">Administration</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="/admin/login" className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
                    <ShieldPlus className="w-4 h-4" />
                    Admin Portal Login
                  </a>
                </li>
                <li><span className="text-slate-500">HIPAA Compliant</span></li>
                <li><span className="text-slate-500">ISO 9001:2015</span></li>
                <li><span className="text-slate-500">JCI Gold Accredited</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© 2026 CarePlus Hospital Healthcare System. All rights reserved.</p>
            <p>Designed with Precision & Empathy.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
