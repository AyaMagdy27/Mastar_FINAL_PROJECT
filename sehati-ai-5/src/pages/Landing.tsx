import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartPulse, Stethoscope, Video, FileText, ArrowRight, ShieldCheck, 
  Activity, BrainCircuit, Users, Calendar, CreditCard, PieChart,
  CheckCircle2, Menu, X, Star, MapPin, Phone, Mail, MessageSquare
} from 'lucide-react';
import drEmilyImage from '../assets/images/dr_emily_rodriguez_1781641473500.jpg';

export default function Landing() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: "Patients Served", value: "50k+" },
    { label: "Specialist Doctors", value: "250+" },
    { label: "Appointments", value: "100k+" },
    { label: "AI Diagnoses", value: "1M+" },
  ];

  const services = [
    { icon: FileText, title: "Electronic Medical Records", desc: "Securely manage patient histories, vital signs, and chronic conditions digitally." },
    { icon: Calendar, title: "Smart Appointments", desc: "Automate scheduling, prevent double-booking, and send timely patient reminders." },
    { icon: Video, title: "Telemedicine Module", desc: "Conduct secure, high-quality video consultations directly from the platform." },
    { icon: BrainCircuit, title: "AI Diagnostics", desc: "Advanced AI-assisted differential diagnosis and symptom analysis engine." },
    { icon: CreditCard, title: "Automated Billing", desc: "Streamline invoicing, insurance claims, and multi-channel payment processing." },
    { icon: PieChart, title: "Analytics Dashboard", desc: "Gain real-time insights into clinic revenue, patient trends, and doctor performance." }
  ];

  const doctors = [
    { name: "Dr. Sarah Chen", specialty: "Cardiology", exp: "15+ Years Exp", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300" },
    { name: "Dr. Marcus Johnson", specialty: "Neurology", exp: "12+ Years Exp", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300" },
    { name: "Dr. Emily Rodriguez", specialty: "Pediatrics", exp: "10+ Years Exp", image: drEmilyImage },
    { name: "Dr. James Wilson", specialty: "General Practice", exp: "20+ Years Exp", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300" }
  ];

  const testimonials = [
    { name: "Emma Thompson", role: "Clinic Manager", text: "Sehati AI completely transformed how we manage patient flow. The AI diagnostic suggestions are incredibly accurate and save our doctors hours." },
    { name: "Michael Chen", role: "Head of Cardiology", text: "The cleanest UI I've seen in healthcare software. Connecting telemedicine with instant EMR access makes remote consultations completely seamless." },
    { name: "Sophia Rodriguez", role: "Patient Coordinator", text: "Automated billing and scheduling reduced our administrative workload by 40%. The transition was smooth and the platform is lightning fast." }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 scroll-smooth">
      {/* 1. Sticky Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-800">Sehati AI</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Home</a>
            <a href="#services" className="hover:text-indigo-600 transition-colors">Services</a>
            <a href="#doctors" className="hover:text-indigo-600 transition-colors">Doctors</a>
            <a href="#ai-assistant" className="hover:text-indigo-600 transition-colors">AI Assistant</a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => navigate('/login')} className="text-slate-600 font-bold text-sm px-5 py-2.5 hover:text-indigo-600 transition-colors">
              Login
            </button>
            <button onClick={() => navigate('/login')} className="bg-indigo-600 text-white font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all active:scale-95">
              Get Started
            </button>
          </div>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col pt-24 px-6"
          >
            <button className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col space-y-6 text-xl font-bold text-slate-800">
              <a href="#" onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
              <a href="#doctors" onClick={() => setMobileMenuOpen(false)}>Doctors</a>
              <a href="#ai-assistant" onClick={() => setMobileMenuOpen(false)}>AI Assistant</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            </div>
            <div className="mt-12 flex flex-col space-y-4">
              <button onClick={() => navigate('/login')} className="bg-slate-100 text-slate-800 font-bold py-4 rounded-xl text-center">Login</button>
              <button onClick={() => navigate('/login')} className="bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 text-center">Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 bg-slate-50 overflow-hidden">
          <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-100/40 blur-3xl"></motion.div>
          <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -1, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-emerald-100/40 blur-3xl"></motion.div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8 text-center lg:text-left">
              <motion.div variants={fadeInUp} className="inline-flex items-center rounded-full border border-indigo-200 bg-white/60 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-indigo-700 uppercase tracking-widest shadow-sm">
                <BrainCircuit className="w-4 h-4 mr-2" />
                Next-Gen Healthcare SaaS
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Predict Today, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Protect Tomorrow</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
                Streamline your practice with a modern EMR, seamless appointments, billing, and advanced AI-assisted medical analysis—all in one intelligent platform.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-primary text-primary-foreground font-bold text-sm px-8 py-4 rounded-xl hover:bg-primary/90 shadow-xl shadow-primary/10 transition-transform active:scale-95 text-center">
                  Start Free Trial
                </button>
                <button className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 font-bold text-sm px-8 py-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center shadow-sm">
                  <Video className="w-5 h-5 mr-2 text-indigo-600" />
                  Book Demo
                </button>
              </motion.div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-3xl bg-white border border-slate-200 shadow-2xl p-2 z-10">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 to-emerald-50 rounded-3xl opacity-50"></div>
                {/* Mock UI Representation */}
                <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                  <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-4 space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-3 w-24 bg-slate-100 rounded animate-pulse"></div>
                      </div>
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-emerald-50 rounded-xl border border-emerald-100 p-4">
                        <Activity className="w-6 h-6 text-emerald-500 mb-2" />
                        <div className="h-3 w-16 bg-emerald-200 rounded"></div>
                      </div>
                      <div className="h-24 bg-indigo-50 rounded-xl border border-indigo-100 p-4">
                        <BrainCircuit className="w-6 h-6 text-indigo-500 mb-2" />
                        <div className="h-3 w-16 bg-indigo-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-24 bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-2">
                      <div className="h-3 w-full bg-slate-200 rounded"></div>
                      <div className="h-3 w-5/6 bg-slate-200 rounded"></div>
                      <div className="h-3 w-4/6 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-8 top-1/4 bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-xl z-20 flex items-center hidden md:flex">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3" />
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accuracy</div>
                  <div className="text-sm font-bold text-slate-800">99.8% AI Precision</div>
                </div>
              </motion.div>
              
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-8 bottom-1/4 bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-xl z-20 flex items-center hidden md:flex">
                <ShieldCheck className="w-6 h-6 text-indigo-500 mr-3" />
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Security</div>
                  <div className="text-sm font-bold text-slate-800">HIPAA Compliant</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Statistics Section */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-indigo-500/30">
            <div className="text-center px-4 flex flex-col items-center">
              <HeartPulse className="w-10 h-10 text-white mb-3" />
              <div className="text-indigo-100 font-bold text-sm tracking-widest uppercase mt-2">Prevent</div>
            </div>
            <div className="text-center px-4 flex flex-col items-center">
              <BrainCircuit className="w-10 h-10 text-white mb-3" />
              <div className="text-indigo-100 font-bold text-sm tracking-widest uppercase mt-2">Predict</div>
            </div>
            <div className="text-center px-4 flex flex-col items-center">
              <ShieldCheck className="w-10 h-10 text-white mb-3" />
              <div className="text-indigo-100 font-bold text-sm tracking-widest uppercase mt-2">Protect</div>
            </div>
            <div className="text-center px-4 flex flex-col items-center">
              <span className="w-10 h-10 text-white mb-3 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                  <path d="M12 21c-5-5-8-9-8-12a5 5 0 0 1 10-2 5 5 0 0 1 10 2c0 3-3 7-8 12z"/>
                  <path d="M12 7v4" />
                  <path d="M10 9h4" />
                </svg>
              </span>
              <div className="text-indigo-100 font-bold text-sm tracking-widest uppercase mt-2">Care</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Complete Healthcare Infrastructure</h2>
            <p className="text-slate-600 text-lg">From the front desk to the doctor's office, Sehati AI provides a unified suite of tools designed to elevate patient care.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AI Feature Showcase */}
      <section id="ai-assistant" className="py-24 bg-card text-foreground overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-widest">
                <BrainCircuit className="w-4 h-4 mr-2" />
                Intelligence Engine
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
                A World-Class Medical <br />
                <span className="text-primary">AI Assistant</span> at Your Fingertips.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Empower your clinical decisions with our proprietary medical AI. Instantly analyze symptoms, generate differential diagnoses, and summarize complex lab reports in seconds.
              </p>
              
              <div className="space-y-4 pt-4">
                {[
                  "Context-aware Symptom Analysis",
                  "Evidence-based Diagnostic Suggestions",
                  "Instant Medical Report Summarization",
                  "Automated Patient Risk Detection"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-2xl pointer-events-none"></div>
              <div className="flex items-center border-b border-border pb-4 mb-4">
                <BrainCircuit className="w-6 h-6 text-primary mr-3" />
                <span className="font-bold text-foreground tracking-wider">SEHATI AI / DIAGNOSIS</span>
              </div>
              <div className="space-y-4">
                <div className="bg-background rounded-xl p-4 border border-border">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-2">Patient Input</span>
                  <p className="text-foreground text-sm">"Patient presents with acute chest pain radiating to the left arm, diaphoresis, and shortness of breath starting 45 mins ago."</p>
                </div>
                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-widest block mb-2 flex items-center">
                     <Activity className="w-3 h-3 mr-1" /> Primary Assessment
                  </span>
                  <h4 className="text-foreground font-bold mb-2">High Probability: Acute Myocardial Infarction (AMI)</h4>
                  <p className="text-muted-foreground text-sm mb-3">Critical warning. Symptoms strongly indicate ACS. Recommend immediate 12-lead ECG and Troponin test.</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-bold rounded">CRITICAL RISK</span>
                    <span className="px-2 py-1 bg-background text-foreground text-xs font-bold rounded border border-border">ECG Required</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Doctors Section */}
      <section id="doctors" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Our Leading Specialists</h2>
            <p className="text-slate-600 text-lg">Connect with world-class healthcare professionals using our platform.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="text-indigo-600 text-xs font-bold uppercase tracking-widest mb-1">{doc.specialty}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{doc.name}</h3>
                  <p className="text-slate-500 text-sm font-medium">{doc.exp}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 max-w-2xl mx-auto">
             <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4">
                Trusted Worldwide
              </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Transforming Clinics</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-400 mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-slate-700 leading-relaxed italic mb-8">"{t.text}"</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-sm text-slate-500 font-medium">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Contact Section */}
      <section id="contact" className="py-24 bg-card text-foreground">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center lg:text-left">
          <div className="bg-primary rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to modernize your healthcare practice?</h2>
              <p className="text-primary-foreground/90 text-lg mb-8">Join thousands of doctors and clinics automating their workflows and leveraging AI for better clinical outcomes.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={() => navigate('/login')} className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-slate-50 transition-colors shadow-xl">Get Started Now</button>
                <button className="bg-primary-foreground/10 text-white border border-primary-foreground/30 font-bold px-8 py-4 rounded-xl hover:bg-primary-foreground/20 transition-colors backdrop-blur-sm">Contact Sales</button>
              </div>
            </div>
            
            <div className="relative z-10 flex flex-col gap-6 w-full lg:w-auto text-left bg-black/10 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
               <div className="flex items-center gap-4 text-white">
                 <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-white/80 uppercase tracking-widest">Global HQ</h4>
                    <p>128 Innovation Drive, SF, CA</p>
                 </div>
               </div>
               <div className="flex items-center gap-4 text-white">
                 <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-white/80 uppercase tracking-widest">Call Us</h4>
                    <p>+1 (800) 555-SEHATI</p>
                 </div>
               </div>
               <div className="flex items-center gap-4 text-white">
                 <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-white/80 uppercase tracking-widest">Email</h4>
                    <p>hello@sehatiai.com</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-background text-muted-foreground py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8 border-b border-border pb-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-6 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-emerald-500 rounded flex items-center justify-center text-white">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-foreground">Sehati AI</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The next-generation clinical information system combining robust EMR capabilities with advanced AI diagnostic assistance.
              </p>
            </div>
            
            <div>
              <h4 className="text-foreground font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Telemedicine</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">AI Engine</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">HIPAA Compliance</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between text-sm">
            <p>&copy; {new Date().getFullYear()} Sehati AI Inc. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
               <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
               <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
               <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
