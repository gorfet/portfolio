import React from 'react';
import { Briefcase, GraduationCap, Award, Calendar, MapPin, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export const ExperienceTimeline: React.FC = () => {
  return (
    <div className="space-y-12">
      
      {/* Experience & Education Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* WORK EXPERIENCE */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
                Industry Experience
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Hands-on practical development & system maintenance
              </p>
            </div>
          </div>

          <div className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-8">
            
            {/* ITSS Internship Card */}
            <motion.div 
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-4"
            >
              {/* Timeline indicator circle */}
              <div className="absolute -left-[31px] top-6 w-4 h-4 rounded-full bg-zinc-900 dark:bg-zinc-100 border-4 border-zinc-50 dark:border-zinc-950" />

              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 uppercase">
                    400-Hour Internship
                  </span>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                    Assistant Programmer Intern
                  </h4>
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    Information Technology Systems & Services (ITSS)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Feb 2026 – May 2026
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Key developer on the ITSS Faculty Evaluation System, designing full-stack modular views, optimizing database query executions, and conducting software QA testing.
              </p>

              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Key Deliverables & Accomplishments
                </h5>
                <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Developed full-stack web modules with Laravel, PHP, MySQL, and Bootstrap.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Engineered dynamic reporting dashboards and optimized query execution times.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Executed modular unit testing, regression passes, and system documentation.</span>
                  </li>
                </ul>
              </div>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Laravel', 'PHP', 'MySQL', 'Bootstrap', 'JavaScript', 'QA Testing'].map((tech) => (
                  <span key={tech} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-semibold rounded-md border border-zinc-200/50 dark:border-zinc-700/50">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ACADEMIC EDUCATION */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
                Education & Background
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Academic degree, coursework, and honors
              </p>
            </div>
          </div>

          <div className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-8">
            
            {/* STI Degree Card */}
            <motion.div 
              initial={{ opacity: 0, x: 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-4"
            >
              {/* Timeline indicator circle */}
              <div className="absolute -left-[31px] top-6 w-4 h-4 rounded-full bg-zinc-900 dark:bg-zinc-100 border-4 border-zinc-50 dark:border-zinc-950" />

              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 uppercase">
                    Bachelor's Degree
                  </span>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                    BS in Information Technology (BSIT)
                  </h4>
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    STI West Negros University
                  </p>
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Graduating 2026
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Focused on software development, database design, mobile development, object-oriented programming (Java/PHP), and software quality engineering.
              </p>

              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Key Academic Subjects
                </h5>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Full-Stack Web Dev</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Database Systems</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Mobile App Dev</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    <span>OOP in Java & PHP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* MILESTONES & HIGHLIGHTS BANNER */}
      <div className="bg-zinc-900 text-zinc-100 p-8 rounded-2xl border border-zinc-800 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-zinc-300" />
          <h3 className="font-display font-bold text-base text-zinc-100">Key Career Milestones & Accomplishments</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[
            { title: 'ITSS Internship Pilot', desc: 'Successfully built and piloted Faculty Evaluation System for 400hr internship.' },
            { title: 'Expo Mobile App Release', desc: 'Published Student Habit Tracker app on Expo builds & GitHub repo.' },
            { title: 'Google AI Studio Apps', desc: 'Engineered SEOPilot & CareerPilot applications using GenAI SDK.' },
            { title: 'Full-Stack Proficiency', desc: 'Specializing in Laravel PHP backend and React/React Native frontends.' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/60 space-y-1">
              <h4 className="font-bold text-zinc-200 text-xs">{item.title}</h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
