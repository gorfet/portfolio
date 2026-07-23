import React, { useState } from 'react';
import { 
  Code, Server, Smartphone, Database, Wrench, CheckCircle2, 
  Layers, Cpu, Sparkles, Terminal, Award, FileCode 
} from 'lucide-react';
import { motion } from 'motion/react';

interface SkillCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  skills: {
    name: string;
    level: number;
    badge?: string;
    highlight?: string;
  }[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'backend',
    title: 'Backend & System Architecture',
    icon: <Server className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />,
    description: 'Specializing in object-oriented PHP frameworks, REST API design, and database optimizations.',
    skills: [
      { name: 'PHP & Laravel (MVC)', level: 88, badge: 'Core Focus', highlight: 'Used in ITSS Faculty Evaluation System' },
      { name: 'RESTful API Engineering', level: 82, highlight: 'JSON endpoint integration & authentication' },
      { name: 'Node.js & Express.js', level: 78, highlight: 'Server-side API routes & Vite middleware' },
      { name: 'Python & Pygame', level: 75, highlight: 'OOP architecture & custom physics algorithms' }
    ]
  },
  {
    id: 'frontend',
    title: 'Frontend & UI Engineering',
    icon: <Code className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />,
    description: 'Crafting responsive, fast single-page web applications with modern component standards.',
    skills: [
      { name: 'React 19 & TypeScript', level: 85, badge: 'Core Focus', highlight: 'Hooks, Context, Custom State Engines' },
      { name: 'Tailwind CSS v4 & Bootstrap', level: 90, highlight: 'Utility-first responsive layouts & dark mode' },
      { name: 'Modern JavaScript (ES6+)', level: 86, highlight: 'Async/Await, DOM manipulation & Promises' },
      { name: 'Motion / Framer Animations', level: 80, highlight: 'Layout transitions & micro-interactions' }
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile App Development',
    icon: <Smartphone className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />,
    description: 'Building cross-platform iOS & Android mobile apps with native capabilities.',
    skills: [
      { name: 'React Native & Expo', level: 82, badge: 'Core Focus', highlight: 'Deployed Student Habit Tracker on Expo' },
      { name: 'Firebase Mobile Auth & DB', level: 80, highlight: 'Real-time database sync & secure user login' },
      { name: 'Android Studio Environment', level: 72, highlight: 'SDK configuration & device testing' }
    ]
  },
  {
    id: 'database',
    title: 'Databases & Cloud Storage',
    icon: <Database className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />,
    description: 'Designing relational schemas, optimizing query execution, and managing local storage.',
    skills: [
      { name: 'MySQL & Relational SQL', level: 85, badge: 'Core Focus', highlight: 'Complex joins, indexing & relational design' },
      { name: 'SQLite', level: 80, highlight: 'Embedded local database for Java Swing & mobile' },
      { name: 'Firebase Firestore & Auth', level: 78, highlight: 'NoSQL document models & client SDKs' },
      { name: 'MongoDB', level: 70, highlight: 'Document aggregation & Node.js drivers' }
    ]
  },
  {
    id: 'tools',
    title: 'Development Tools & Practices',
    icon: <Wrench className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />,
    description: 'Utilizing industry tools for version control, testing, and continuous integration.',
    skills: [
      { name: 'Git & GitHub Version Control', level: 88, badge: 'Daily Tool', highlight: 'Branching strategies, pull requests & CI workflows' },
      { name: 'OOP Standards (Java/PHP)', level: 85, highlight: 'Encapsulation, Inheritance, Polymorphism' },
      { name: 'Postman & API Testing', level: 82, highlight: 'Route testing & collection documentation' },
      { name: 'System Quality Assurance', level: 80, highlight: 'Unit testing, regression & bug tracking' }
    ]
  }
];

export const TechSkillsMatrix: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCategories = selectedCategory === 'all' 
    ? SKILL_CATEGORIES 
    : SKILL_CATEGORIES.filter(c => c.id === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            selectedCategory === 'all'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850'
          }`}
        >
          All Tech Domains
        </button>
        {SKILL_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850'
            }`}
          >
            {cat.title.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-zinc-900 dark:text-zinc-100 text-base">
                    {category.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                {category.skills.map((skill, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">
                          {skill.name}
                        </span>
                        {skill.badge && (
                          <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold rounded-md border border-zinc-200 dark:border-zinc-700">
                            {skill.badge}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-zinc-500 dark:text-zinc-400 font-medium">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-zinc-900 dark:bg-zinc-200 rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>

                    {skill.highlight && (
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        ↳ {skill.highlight}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
