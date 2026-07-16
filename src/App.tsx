/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PROJECTS, 
  INITIAL_RESUME_DATA 
} from './data';
import { Project, ResumeData } from './types';
import { ProjectCard } from './components/ProjectCard';
import { ResumeEditor } from './components/ResumeEditor';
import { 
  User, Briefcase, GraduationCap, Award, Sliders, Mail, Phone, MapPin, 
  Linkedin, Github, Moon, Sun, Menu, X, ArrowUpRight, Check, Copy, 
  Sparkles, Star, ExternalLink, ChevronRight, FileText, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('dave_resume_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_RESUME_DATA;
      }
    }
    return INITIAL_RESUME_DATA;
  });

  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Custom contact form states
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Auto-typing text states
  const tracks = ['Web Developer', 'Mobile Developer', 'Laravel Specialist', 'BSIT Graduate'];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('dave_resume_data', JSON.stringify(resumeData));
  }, [resumeData]);

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Auto-typing effect logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = tracks[currentTrackIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(prev => prev.substring(0, prev.length - 1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setTypedText(prev => currentFullText.substring(0, prev.length + 1));
      }, 100);
    }

    if (!isDeleting && typedText === currentFullText) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setCurrentTrackIndex(prev => (prev + 1) % tracks.length);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentTrackIndex]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(resumeData.personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    
    // Simulate successful form submission
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 4000);
  };

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 transition-colors duration-300">
      
      {/* MOBILE HEADER */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-100 dark:border-zinc-850 px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
            DP
          </div>
          <span className="font-display font-bold text-slate-900 dark:text-zinc-100 text-sm">
            Dave Postrero
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-x-0 top-[61px] bottom-0 bg-white dark:bg-zinc-900 z-30 border-b border-slate-200 dark:border-zinc-800 p-6 flex flex-col justify-between"
          >
            <nav className="space-y-4">
              {[
                { href: '#hero', label: 'Home', icon: <Star className="w-4 h-4" /> },
                { href: '#projects', label: 'Featured Projects', icon: <Sparkles className="w-4 h-4" /> },
                { href: '#resume', label: 'Resume Customizer', icon: <FileText className="w-4 h-4" /> },
                { href: '#contact', label: 'Get In Touch', icon: <Mail className="w-4 h-4" /> },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-all"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="border-t border-slate-100 dark:border-zinc-800 pt-6 space-y-4">
              <div className="flex gap-4 justify-center">
                <a href={`https://${resumeData.personalInfo.github}`} target="_blank" rel="noreferrer" className="p-2 rounded-full border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 text-slate-600 dark:text-zinc-400">
                  <Github className="w-5 h-5" />
                </a>
                <a href={`https://${resumeData.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="p-2 rounded-full border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 text-slate-600 dark:text-zinc-400">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <p className="text-center text-xs text-slate-400">© 2026 Dave Postrero</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col justify-between fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-zinc-900 border-r border-slate-100 dark:border-zinc-850 p-8 z-20">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
              DP
            </div>
            <div>
              <h2 className="font-display font-black text-slate-900 dark:text-white tracking-tight">
                Dave Postrero
              </h2>
              <p className="text-[11px] font-mono font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                IT Developer Portfolio
              </p>
            </div>
          </div>

          {/* Quick Profile Bio */}
          <div className="p-5 bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-850 rounded-2xl mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-xl font-bold border border-white dark:border-zinc-800">
                👨‍💻
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 leading-tight">Dave Postrero</h3>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full inline-block mt-1">
                  Active For Work
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              BSIT graduate focused on Laravel, React Native, and full-stack software architectures.
            </p>
          </div>

          {/* Nav links */}
          <nav className="space-y-1.5">
            {[
              { href: '#hero', label: 'About', icon: <User className="w-4 h-4" /> },
              { href: '#projects', label: 'Featured Projects', icon: <Sparkles className="w-4 h-4" /> },
              { href: '#resume', label: 'Resume Customizer', icon: <FileText className="w-4 h-4" /> },
              { href: '#contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
              >
                <span className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {link.icon}
                </span>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Footer controls & social */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-zinc-800">
            <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Theme Style
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 transition-colors cursor-pointer"
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
          </div>

          <div className="flex items-center gap-3 justify-center">
            <a 
              href={`https://${resumeData.personalInfo.github}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-105"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
            <a 
              href={`https://${resumeData.personalInfo.linkedin}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-105"
            >
              <Linkedin className="w-4.5 h-4.5" />
            </a>
          </div>

          <p className="text-[10px] text-center text-slate-400 dark:text-zinc-600 font-mono">
            Dave Postrero Portfolio © 2026
          </p>
        </div>
      </aside>

      {/* MAIN MAIN CONTENT STAGE */}
      <main className="lg:pl-80 min-h-screen">
        
        {/* HERO SECTION */}
        <section id="hero" className="relative min-h-[90vh] flex items-center justify-center p-6 md:p-12 overflow-hidden bg-radial from-indigo-50/40 via-transparent to-transparent dark:from-indigo-950/10 dark:via-transparent dark:to-transparent">
          {/* Subtle light blob overlays */}
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-violet-200/10 dark:bg-violet-900/5 rounded-full blur-3xl -z-10" />

          <div className="max-w-4xl mx-auto w-full text-center space-y-8">
            
            {/* Status indicator badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-850 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
                Ready to contribute to development teams
              </span>
            </div>

            {/* Profile Avatar stack */}
            <div className="relative w-28 h-28 mx-auto">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-20 animate-pulse-slow" />
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md flex items-center justify-center relative">
                <div className="w-full h-full rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center text-5xl">
                  👨‍💻
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                Hi, I'm <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">Dave Postrero</span>
              </h1>

              {/* Dynamic typing loop */}
              <div className="text-xl md:text-2xl font-semibold text-indigo-600 dark:text-indigo-400 h-8 font-display">
                <span>{typedText}</span>
                <span className="animate-pulse font-light">|</span>
              </div>

              <p className="max-w-2xl mx-auto text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
                Graduating BSIT student and Developer. I specialize in building full-stack web architectures with PHP/Laravel, responsive cross-platform mobile apps with React Native, and secure local databases.
              </p>
            </div>

            {/* Micro credentials / counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
              {[
                { title: 'Degree', value: 'BSIT Grad 2026' },
                { title: 'Core Framework', value: 'PHP & Laravel' },
                { title: 'Mobile', value: 'React Native' },
                { title: 'Completed Projects', value: '6+ Apps Deployed' }
              ].map((card, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 p-4 rounded-xl shadow-xs text-center">
                  <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">{card.title}</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-zinc-200">{card.value}</div>
                </div>
              ))}
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Explore Selected Projects
                <ArrowUpRight className="w-4 h-4" />
              </a>
              
              <a
                href="#resume"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300 font-semibold rounded-xl border border-slate-200 dark:border-zinc-800 transition-colors cursor-pointer"
              >
                Customize & Download Resume
                <FileText className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-20 px-6 md:px-12 bg-white dark:bg-zinc-900/50 border-t border-b border-slate-100 dark:border-zinc-900">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Section Head */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Portfolio
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                Featured Deployed Applications
              </h2>
              <p className="max-w-xl mx-auto text-sm text-slate-500 dark:text-zinc-400">
                Explore real full-stack web platforms, mobile solutions, and games designed with optimized performance.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'web', label: 'Web Applications' },
                { id: 'mobile', label: 'Mobile Solutions' },
                { id: 'desktop', label: 'Desktop & Gaming' },
                { id: 'ai-studio', label: 'Google AI Studio Spotlights' }
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    activeCategory === category.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-600 dark:text-zinc-300 border border-slate-100 dark:border-zinc-700/50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Project Cards Grid */}
            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onViewDetails={setSelectedProject}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* PROFESSIONAL RESUME SECTION */}
        <section id="resume" className="py-20 px-6 md:px-12 bg-slate-50 dark:bg-zinc-950">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Header description */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 dark:border-zinc-800 pb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full">
                  <FileText className="w-3.5 h-3.5" />
                  PDF Resume Engine
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                  Official Resume & CV
                </h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-xl">
                  View Dave's professional highlights, key achievements, and skills. Download a high-fidelity, beautifully formatted A4 PDF copy directly to your device.
                </p>
              </div>
            </div>

            {/* Resume Component */}
            <ResumeEditor 
              data={resumeData} 
            />
          </div>
        </section>

        {/* CONTACT & CONNECT SECTION */}
        <section id="contact" className="py-20 px-6 md:px-12 bg-white dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-900">
          <div className="max-w-5xl mx-auto space-y-12">
            
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full">
                <Mail className="w-3.5 h-3.5" />
                Get In Touch
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                Let's Build Something Together
              </h2>
              <p className="max-w-xl mx-auto text-sm text-slate-500 dark:text-zinc-400">
                I'm currently looking for junior development opportunities. Reach out via email, check my social links, or drop a message below.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Info Cards Side */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-850 rounded-2xl flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Direct Email</h3>
                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-2">{resumeData.personalInfo.email}</p>
                    
                    <button
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" /> Copied successfully!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy email address
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-850 rounded-2xl flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Location</h3>
                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                      {resumeData.personalInfo.address}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                      Negros Occidental, Western Visayas (GMT+8)
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-850 rounded-2xl flex items-start gap-4">
                  <div className="p-3 bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Professional Channels</h3>
                    <div className="space-y-1.5 mt-1 text-sm font-semibold">
                      <a href={`https://${resumeData.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="block text-indigo-600 dark:text-indigo-400 hover:underline">
                        Dave Postrero LinkedIn &rarr;
                      </a>
                      <a href={`https://${resumeData.personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="block text-indigo-600 dark:text-indigo-400 hover:underline">
                        GitHub Profile @gorfet &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Composer Side */}
              <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-850 p-6 md:p-8 rounded-2xl">
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-6">Send Dave a Message</h3>
                
                {formSubmitted ? (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-xl font-bold">
                      ✓
                    </div>
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-400">Message Dispatched Successfully!</h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 leading-relaxed max-w-sm mx-auto">
                      Thank you for reaching out, Dave has received your message via this Google AI Studio workspace simulation.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Your Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-150 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Your Email</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-150 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Your Message</label>
                      <textarea
                        required
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Describe your project, internship opportunity, or ask a question..."
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-150 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center border-t border-slate-800">
          <p className="text-sm font-medium">
            Dave Postrero Portfolio & Resume Customizer
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Built with React 19, TypeScript, and Tailwind CSS.
          </p>
        </footer>
      </main>

      {/* DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-zinc-900 max-w-2xl w-full rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-800 shadow-xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Banner */}
              <div className="h-40 bg-gradient-to-tr from-indigo-500 to-violet-600 relative flex items-center justify-center">
                <span className="text-7xl select-none z-10">{selectedProject.icon}</span>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Category: {selectedProject.category}
                  </div>
                  <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white leading-tight">
                    {selectedProject.title}
                  </h3>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</h4>
                  <p className="text-sm text-slate-600 dark:text-zinc-350 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Tech specifications */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-slate-50 dark:bg-zinc-800 border border-slate-150 dark:border-zinc-750 text-slate-700 dark:text-zinc-300 rounded-lg text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Duration/Timeline */}
                {selectedProject.duration && (
                  <div className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-850 text-xs">
                    <span className="font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Project Lifecycle</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-zinc-300">{selectedProject.duration}</span>
                  </div>
                )}

                {/* Action CTA Buttons */}
                <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  {selectedProject.demoUrl && selectedProject.demoUrl !== '#' && (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Launch Application
                    </a>
                  )}

                  {selectedProject.githubUrl && selectedProject.githubUrl !== '#' ? (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Source Code
                    </a>
                  ) : (
                    <div className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-600 rounded-xl text-center text-xs font-medium cursor-not-allowed select-none bg-slate-50/50 dark:bg-zinc-950/20">
                      Private Repository
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
