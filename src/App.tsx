import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PROJECTS, 
  INITIAL_RESUME_DATA 
} from './data';
import { Project, ResumeData } from './types';
import { ProjectCard } from './components/ProjectCard';
import { ResumeEditor } from './components/ResumeEditor';
import { TechSkillsMatrix } from './components/TechSkillsMatrix';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { AiAssistantWidget } from './components/AiAssistantWidget';
import { 
  User, Briefcase, GraduationCap, Award, Sliders, Mail, Phone, MapPin, 
  Linkedin, Github, Moon, Sun, Menu, X, ArrowUpRight, ArrowUp, Check, Copy, 
  Sparkles, Star, ExternalLink, ChevronRight, FileText, Send, Search,
  Code, Layers, Bot, Terminal, Inbox, CheckCircle2, Clock, Trash2, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_AVATAR = "/profile.jfif"; 

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [avatarSrc, setAvatarSrc] = useState<string>(DEFAULT_AVATAR);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  
  // Custom contact form states
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'Opportunity / Job Offer', message: '' });
  const [formSending, setFormSending] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [lastSubmittedMsg, setLastSubmittedMsg] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
    mailtoUrl: string;
    targetEmail: string;
  } | null>(null);

  // Live Inbox State
  const [inboxMessages, setInboxMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showInboxModal, setShowInboxModal] = useState<boolean>(false);
  const [loadingInbox, setLoadingInbox] = useState<boolean>(false);

  // Fetch messages from live Express backend
  const fetchInboxMessages = async () => {
    setLoadingInbox(true);
    try {
      const res = await fetch('/api/contact/messages');
      if (res.ok) {
        const data = await res.json();
        setInboxMessages(data.messages || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error('Failed to fetch inbox messages:', e);
    } finally {
      setLoadingInbox(false);
    }
  };

  useEffect(() => {
    fetchInboxMessages();
  }, []);

  // Auto-typing text states
  const tracks = ['Full-Stack Web Developer', 'Laravel PHP Specialist', 'React Native Developer'];
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

  // Track scroll position for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const heroElement = document.getElementById('hero');
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Auto-typing effect logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = tracks[currentTrackIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(prev => prev.substring(0, prev.length - 1));
      }, 45);
    } else {
      timer = setTimeout(() => {
        setTypedText(prev => currentFullText.substring(0, prev.length + 1));
      }, 80);
    }

    if (!isDeleting && typedText === currentFullText) {
      timer = setTimeout(() => setIsDeleting(true), 2200);
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    
    setFormSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormSubmitted(true);
        setLastSubmittedMsg({
          name: contactForm.name,
          email: contactForm.email,
          subject: contactForm.subject,
          message: contactForm.message,
          mailtoUrl: data.mailtoUrl,
          targetEmail: data.targetEmail || 'kindpsycho1@gmail.com',
        });
        setContactForm({ name: '', email: '', subject: 'Opportunity / Job Offer', message: '' });
        fetchInboxMessages();
        
        // Optionally open default mail client as well
        if (data.mailtoUrl) {
          window.location.href = data.mailtoUrl;
        }
      } else {
        alert(data.error || 'Failed to process message.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      alert('Error connecting to backend server. Please try again.');
    } finally {
      setFormSending(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchInboxMessages();
      }
    } catch (e) {
      console.error('Error deleting message:', e);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 transition-colors duration-300 font-sans">
      
      {/* TOP UTILITY BAR */}
      <div className="bg-[#1d2327] text-zinc-300 text-xs py-1.5 px-4 sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 shadow-xs font-sans">
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs">Dave Postrero</span>
            <span className="text-zinc-500 font-normal hidden sm:inline">| Full-Stack IT Developer</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Inbox Button */}
          <button
            onClick={() => { setShowInboxModal(true); fetchInboxMessages(); }}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer text-[11px] relative"
            title="View Live Received Messages"
          >
            <Inbox className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Inbox</span>
            {inboxMessages.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-500 text-zinc-950 font-bold rounded-full text-[10px]">
                {inboxMessages.length}
              </span>
            )}
          </button>

          {/* Theme Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer text-[11px]"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
            <span className="hidden sm:inline">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* User Badge */}
          <div className="flex items-center gap-2 border-l border-zinc-700 pl-3">
            <span className="text-[11px] text-zinc-400 hidden sm:inline">Recruiter Portal</span>
            <img
              src={avatarSrc}
              onError={() => setAvatarSrc(DEFAULT_AVATAR)}
              alt="Author headshot"
              className="w-5 h-5 rounded-full object-cover border border-zinc-600"
            />
          </div>
        </div>
      </div>

      {/* EDITORIAL HEADER BANNER */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Software Developer Portfolio
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                Dave Postrero
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 font-sans">
                Full-Stack IT Developer & Assistant Programmer • STI West Negros University '26
              </p>
            </div>

            {/* Quick Contact Header Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <a 
                href={`https://${resumeData.personalInfo.github}`} 
                target="_blank" 
                rel="noreferrer" 
                className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
              <a 
                href={`https://${resumeData.personalInfo.linkedin}`} 
                target="_blank" 
                rel="noreferrer" 
                className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
              <a 
                href="#contact" 
                className="px-3 py-1.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 text-xs font-bold rounded flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                Hire Dave
              </a>
            </div>
          </div>
        </div>

        {/* HORIZONTAL NAVIGATION MENU */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto">
            <nav className="flex items-center space-x-1 sm:space-x-2 py-2 text-xs font-semibold whitespace-nowrap">
              {[
                { href: '#hero', label: 'Home' },
                { href: '#projects', label: 'Projects' },
                { href: '#skills', label: 'Technical Stack' },
                { href: '#experience', label: 'Career Journey' },
                { href: '#resume', label: 'Official Resume' },
                { href: '#contact', label: 'Get In Touch' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Quick Filter Search Indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <span>Press #projects to explore code</span>
            </div>
          </div>
        </div>
      </header>

      {/* TWO-COLUMN EDITORIAL CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* MAIN COLUMN (8 Cols) */}
          <main className="lg:col-span-8 space-y-12">
            
            {/* HERO COVER BLOCK */}
            <article id="hero" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
              {/* Header Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-sans text-zinc-500 dark:text-zinc-400 mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                  Featured
                </span>
                <span>•</span>
                <span>Developer Overview • <strong>Dave Postrero</strong></span>
                <span>•</span>
                <span className="font-mono">Graduating 2026</span>
              </div>

              {/* Title in Playfair Serif */}
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-4">
                Welcome to My Developer Showcase & Portfolio
              </h2>

              {/* Dynamic typing track line */}
              <div className="text-base sm:text-lg font-mono font-semibold text-zinc-700 dark:text-zinc-300 mb-4 h-7">
                <span>{typedText}</span>
                <span className="animate-pulse font-light">|</span>
              </div>

              {/* Post Content Excerpt */}
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 font-sans">
                Graduating Information Technology student at STI West Negros University and Full-Stack Developer. Experienced in building full-stack web platforms with PHP/Laravel, cross-platform mobile apps with React Native & Expo, and custom desktop architectures. Currently serving as Assistant Programmer Intern at ITSS.
              </p>

              {/* Micro stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 rounded-lg mb-6 text-center">
                {[
                  { title: 'Degree', value: 'BSIT Grad 2026' },
                  { title: 'Core Framework', value: 'PHP & Laravel' },
                  { title: 'Mobile Stack', value: 'React Native' },
                  { title: 'Deployed Apps', value: '6+ Codebases' }
                ].map((card, idx) => (
                  <div key={idx}>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{card.title}</div>
                    <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{card.value}</div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="px-5 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs rounded hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
                >
                  Explore Deployed Projects
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#resume"
                  className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs rounded border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
                >
                  Download Official Resume
                  <FileText className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>

            {/* PROJECTS SHOWCASE SECTION */}
            <section id="projects" className="space-y-6">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                    Portfolio Showcase
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    Featured Applications & Codebases
                  </h3>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All Projects' },
                    { id: 'web', label: 'Web Dev' },
                    { id: 'mobile', label: 'Mobile' },
                    { id: 'desktop', label: 'Desktop' },
                    { id: 'ai-studio', label: 'AI Studio' }
                  ].map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                        activeCategory === category.id
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                          : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtered Projects Grid */}
              {filteredProjects.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <p className="text-xs font-semibold text-zinc-500">
                    No projects found matching "{searchQuery}"
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                    className="text-xs font-bold text-zinc-900 dark:text-zinc-100 underline cursor-pointer"
                  >
                    Clear search & reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onViewDetails={setSelectedProject}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* TECHNICAL SKILLS MATRIX SECTION */}
            <section id="skills" className="space-y-4">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                  Competencies
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  Software & Architecture Skills
                </h3>
              </div>
              
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                <TechSkillsMatrix />
              </div>
            </section>

            {/* CAREER JOURNEY SECTION */}
            <section id="experience" className="space-y-4">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                  Timeline
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  Work Experience & Academic Education
                </h3>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                <ExperienceTimeline />
              </div>
            </section>

            {/* RESUME PAGE SECTION */}
            <section id="resume" className="space-y-4">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                  Document
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  Official Resume Document
                </h3>
              </div>

              <ResumeEditor data={resumeData} />
            </section>

            {/* CONTACT FORM */}
            <section id="contact" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Get In Touch (Live Direct Contact)
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Messages are routed live to <strong>Postreroz09@gmail.com</strong> and saved in Dave's portfolio inbox.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowInboxModal(true); fetchInboxMessages(); }}
                  className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Inbox className="w-3.5 h-3.5 text-emerald-500" />
                  View Inbox ({inboxMessages.length})
                </button>
              </div>

              {formSubmitted && lastSubmittedMsg ? (
                <div className="p-6 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                        Message Live Sent & Saved!
                      </h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">
                        Routed directly to <strong>{lastSubmittedMsg.targetEmail}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/80 dark:bg-zinc-900/80 p-4 rounded-lg border border-emerald-100 dark:border-emerald-900/50 space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row justify-between text-zinc-600 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2 gap-1">
                      <span><strong>From:</strong> {lastSubmittedMsg.name} ({lastSubmittedMsg.email})</span>
                      <span><strong>Subject:</strong> {lastSubmittedMsg.subject}</span>
                    </div>
                    <p className="text-zinc-800 dark:text-zinc-200 italic pt-1 whitespace-pre-wrap">
                      "{lastSubmittedMsg.message}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={lastSubmittedMsg.mailtoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Open Default Email App
                    </a>
                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-xs font-bold rounded transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Your Name / Organization"
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Your Email *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="your.email@company.com"
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Inquiry Type / Subject</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 cursor-pointer"
                    >
                      <option value="Opportunity / Job Offer">Full-Time Junior Developer Role</option>
                      <option value="Internship Inquiry">Internship / Entry Level Inquiry</option>
                      <option value="Freelance Project">Freelance Web / Mobile Project</option>
                      <option value="General Networking">General Networking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Write your message here..."
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="submit"
                      disabled={formSending}
                      className="px-6 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold rounded hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {formSending ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Sending Live...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Send Message Direct
                        </>
                      )}
                    </button>

                    <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                      Direct Email: Postreroz09@gmail.com
                    </span>
                  </div>
                </form>
              )}
            </section>
          </main>

          {/* RIGHT SIDEBAR (4 Cols) - WIDGETS */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* WIDGET 1: ABOUT DAVE */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-2xs">
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                About Dave
              </h4>
              
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={avatarSrc}
                  onError={() => setAvatarSrc(DEFAULT_AVATAR)}
                  alt="Dave Postrero Author"
                  className="w-12 h-12 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700"
                />
                <div>
                  <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Dave Postrero</h5>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-bold px-2 py-0.5 rounded inline-block mt-0.5">
                    ● Active for Work
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                Graduating BSIT student @ STI West Negros University '26 & Assistant Programmer Intern @ ITSS. Skilled in PHP Laravel, React Native, and full-stack software development.
              </p>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs font-semibold space-y-1">
                <div className="text-zinc-500">📍 Negros Occidental, Philippines</div>
                <div className="text-zinc-500">📧 {resumeData.personalInfo.email}</div>
              </div>
            </div>

            {/* WIDGET 2: LIVE SEARCH */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-2xs">
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                Search Codebases
              </h4>
              
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects by stack..."
                  className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-zinc-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* WIDGET 3: PROJECT CATEGORIES */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-2xs">
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                Project Categories
              </h4>
              
              <ul className="space-y-2 text-xs">
                {[
                  { name: 'Web Applications', cat: 'web', count: projects.filter(p => p.category === 'web').length },
                  { name: 'Mobile Applications', cat: 'mobile', count: projects.filter(p => p.category === 'mobile').length },
                  { name: 'Desktop Systems', cat: 'desktop', count: projects.filter(p => p.category === 'desktop').length },
                  { name: 'Google AI Studio Apps', cat: 'ai-studio', count: projects.filter(p => p.category === 'ai-studio').length },
                ].map((item) => (
                  <li key={item.cat}>
                    <button
                      onClick={() => setActiveCategory(item.cat)}
                      className={`w-full flex items-center justify-between text-left py-1 px-2 rounded transition-colors cursor-pointer ${
                        activeCategory === item.cat 
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold' 
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>{item.name}</span>
                      <span className="font-mono text-[10px] opacity-70">({item.count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* WIDGET 4: DOWNLOAD RESUME QUICK WIDGET */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">
                Official Resume
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Need a PDF copy for hiring or recruitment review?
              </p>
              
              <a
                href="#resume"
                className="w-full py-2 px-3 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold rounded flex items-center justify-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                View & Compile PDF
              </a>

              <button
                onClick={handleCopyEmail}
                className="w-full py-2 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold rounded border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedEmail ? 'Email Copied!' : 'Copy Email Address'}
              </button>
            </div>

            {/* WIDGET 5: QUICK TECH STACK SUMMARY */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-2xs">
              <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                Core Stack
              </h4>
              
              <div className="flex flex-wrap gap-1.5 text-xs">
                {['PHP', 'Laravel', 'React Native', 'Expo', 'TypeScript', 'MySQL', 'Tailwind', 'Git'].map((tech) => (
                  <span key={tech} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded text-[11px] font-mono border border-zinc-200/80 dark:border-zinc-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-zinc-900 text-zinc-400 border-t border-zinc-800 mt-16 py-12 px-4 sm:px-6 lg:px-8 text-xs font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-zinc-800">
          <div>
            <h5 className="font-serif text-base font-bold text-white mb-2">Dave Postrero</h5>
            <p className="text-zinc-400 leading-relaxed">
              Full-Stack IT Developer specializing in PHP Laravel, React Native, and modern Web / Mobile solutions.
            </p>
          </div>

          <div>
            <h5 className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Quick Navigation</h5>
            <ul className="space-y-1 text-zinc-400">
              <li><a href="#hero" className="hover:text-white">Home Page</a></li>
              <li><a href="#projects" className="hover:text-white">Projects Archive</a></li>
              <li><a href="#skills" className="hover:text-white">Technical Stack</a></li>
              <li><a href="#resume" className="hover:text-white">Official Resume</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Connect & Socials</h5>
            <div className="flex gap-3 mt-2">
              <a href={`https://${resumeData.personalInfo.github}`} target="_blank" rel="noreferrer" className="p-2 bg-zinc-800 text-zinc-300 hover:text-white rounded">
                <Github className="w-4 h-4" />
              </a>
              <a href={`https://${resumeData.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="p-2 bg-zinc-800 text-zinc-300 hover:text-white rounded">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p>© 2026 Dave Postrero • All rights reserved.</p>
          <p className="font-mono text-[11px] text-zinc-500">
            Designed with Editorial Serif & Modern UI Principles
          </p>
        </div>
      </footer>

      {/* FLOATING RECRUITER AI ASSISTANT WIDGET */}
      <AiAssistantWidget />

      {/* FLOATING BACK TO TOP BUTTON */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
            className="fixed bottom-6 left-6 lg:left-86 z-40 p-3 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full shadow-lg border border-zinc-700/50 dark:border-zinc-300/50 transition-all cursor-pointer flex items-center justify-center group"
          >
            <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* PROJECT DETAILS MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.97, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 15 }}
              className="bg-white dark:bg-zinc-900 max-w-2xl w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Banner */}
              <div className="h-36 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700/80 relative flex items-center justify-center">
                <span className="text-6xl select-none z-10">{selectedProject.icon}</span>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-zinc-200/80 dark:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-full transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Category: {selectedProject.category}
                  </div>
                  <h3 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                    {selectedProject.title}
                  </h3>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Project Description</h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Tech specifications */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Technologies & Architecture</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                {selectedProject.duration && (
                  <div className="flex justify-between items-center p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
                    <span className="font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Project Timeline</span>
                    <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{selectedProject.duration}</span>
                  </div>
                )}

                {/* Action CTA Buttons */}
                <div className="flex gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  {selectedProject.demoUrl && selectedProject.demoUrl !== '#' && (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs rounded-xl transition-colors cursor-pointer"
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
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Source Code
                    </a>
                  ) : (
                    <div className="flex-1 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 rounded-xl text-center text-xs font-medium cursor-not-allowed select-none bg-zinc-50 dark:bg-zinc-950">
                      Private Repository
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* LIVE INBOX MODAL */}
      <AnimatePresence>
        {showInboxModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50"
            onClick={() => setShowInboxModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.97, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 15 }}
              className="bg-white dark:bg-zinc-900 max-w-2xl w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl relative max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      Dave's Portfolio Inbox
                      <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono rounded-full font-normal">
                        {inboxMessages.length} Messages
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Live messages received via direct contact form
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowInboxModal(false)}
                  className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {loadingInbox ? (
                  <div className="p-8 text-center text-zinc-400 space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-500" />
                    <p className="text-xs">Loading live messages...</p>
                  </div>
                ) : inboxMessages.length === 0 ? (
                  <div className="p-12 text-center text-zinc-400 space-y-3">
                    <Mail className="w-8 h-8 mx-auto text-zinc-300 dark:text-zinc-700" />
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No Messages Yet</p>
                    <p className="text-xs max-w-sm mx-auto text-zinc-500">
                      Use the "Get In Touch" form on the main page to send a test message live to Dave Postrero!
                    </p>
                  </div>
                ) : (
                  inboxMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-2">
                        <div>
                          <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            {msg.name}
                            <span className="font-normal text-zinc-500 text-[11px]">({msg.email})</span>
                          </div>
                          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                            Subject: {msg.subject}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(msg.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete Message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap pt-1 font-sans">
                        {msg.message}
                      </p>

                      <div className="pt-2 flex justify-end">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Reply via Email
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-between items-center text-xs">
                <span className="text-zinc-500">
                  Target Recipient: <strong>Postreroz09@gmail.com</strong>
                </span>
                <button
                  onClick={() => setShowInboxModal(false)}
                  className="px-4 py-1.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold rounded hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
