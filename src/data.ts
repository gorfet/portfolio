/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ResumeData } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'seopilot',
    title: 'SEOPilot AI Assistant',
    description: 'An AI-driven SEO analysis platform that crawls websites, performs real-time semantic keyword research, analyzes page performance, and provides automated, model-guided recommendations to scale search rankings.',
    category: 'SEO',
    tags: ['React 19', 'Vite', 'Tailwind CSS', 'Node.js'],
    demoUrl: '#',
    githubUrl: 'https://github.com/gorfet',
    duration: 'Recent',
    icon: '🚀',
    featured: true
  },
  {
    id: 'careerpilot',
    title: 'CareerPilot AI Coach',
    description: 'A comprehensive, model-grounded career growth system featuring an interactive resume refiner, automated cover letter tailored writer, mock interview AI simulators, and structured path trackers.',
    category: 'career',
    tags: ['React', 'TypeScript', 'jsPDF', 'Vite'],
    demoUrl: '#',
    githubUrl: 'https://github.com/gorfet',
    duration: 'Recent',
    icon: '🎯',
    featured: true
  },
  {
    id: 'fac-eval',
    title: 'Faculty Evaluation System',
    description: 'Developed a robust web-based faculty evaluation platform that enables students to evaluate instructors securely, while providing administrators with real-time analytics, dynamic reporting, and performance tracking.',
    category: 'web',
    tags: ['Laravel', 'PHP', 'Bootstrap', 'MySQL', 'JavaScript'],
    demoUrl: 'http://169.58.51.70/ievaluated',
    githubUrl: '#',
    duration: '3 months',
    icon: '📋',
    featured: true
  },
  {
    id: 'habit-tracker',
    title: 'Student Habit Tracker Mobile App',
    description: 'A responsive habit-tracking mobile application equipped with authentication, smart reminders, analytics dashboard, progression charts, achievements, and calendar integration.',
    category: 'mobile',
    tags: ['React Native', 'Firebase Auth', 'Firebase Database', 'JavaScript'],
    demoUrl: 'https://expo.dev/accounts/gorfet/projects/StudentHabitTracker/builds/7b31d6a3-338e-4767-83c9-db620faec987',
    githubUrl: 'https://github.com/gorfet/student-habit-tracker',
    duration: '2 months',
    icon: '📱',
    featured: true
  },
  {
    id: 'speed-typing',
    title: 'Speed Typing Game',
    description: 'A desktop typing challenger built featuring user login/registration, timed typing sessions, metric charts, accuracy tracking, and persistent local SQLite storage. Focused on OOP standards.',
    category: 'desktop',
    tags: ['Java', 'Swing GUI', 'OOP', 'SQLite'],
    demoUrl: '#',
    githubUrl: 'https://github.com/gorfet/SpeedTyping',
    duration: '3 months',
    icon: '⌨️',
    featured: true
  },
  {
    id: 'maze-runner',
    title: 'Maze Runner Web Game',
    description: 'An interactive web-based puzzle game with procedurally generated mazes, smooth keyboard controls, dynamic lighting effects, and smart obstacle navigation.',
    category: 'web',
    tags: ['HTML5', 'Tailwind CSS', 'JavaScript'],
    demoUrl: 'https://gorfet.github.io/Third/',
    githubUrl: 'https://github.com/gorfet/Third',
    duration: '1 month',
    icon: '🧩',
    featured: false
  },
  {
    id: 'battle-shapes',
    title: 'Battle Shapes Pygame',
    description: 'Arena-style desktop game where players control customizable geometric shapes and battle in real-time, utilizing custom physics, hitboxes, and smart AI agents.',
    category: 'desktop',
    tags: ['Python', 'Pygame', 'OOP'],
    demoUrl: 'https://gorfet.github.io/battle/',
    githubUrl: 'https://github.com/gorfet/battle',
    duration: '2 months',
    icon: '🎮',
    featured: false
  },
  {
    id: 'portfolio',
    title: 'Interactive Resume & Dev Portfolio',
    description: 'This current application! A professional, modern portfolio and real-time resume customizer deployed in Google AI Studio, featuring dynamic PDF generation, live edit preview, and state persistence.',
    category: 'portfolio',
    tags: ['React 19', 'Vite', 'TypeScript', 'Tailwind v4', 'jsPDF', 'Motion'],
    demoUrl: 'https://portfolio-8jds-sage.vercel.app/',
    githubUrl: 'https://github.com/gorfet',
    duration: 'Recent',
    icon: '⚡',
    featured: true
  }
];

export const INITIAL_RESUME_DATA: ResumeData = {
  personalInfo: {
    name: 'Dave Postrero',
    title: 'Junior Web & Mobile Developer',
    email: 'postrero63@gmail.com',
    phone: '+63 991 5725 762',
    address: 'Silay City, Negros Occidental, Philippines',
    objective: 'Motivated Developer with hands-on experience building responsive web apps, mobile solutions, and database-driven systems. Adept in PHP/Laravel, React Native, SQL, and modern tools, with a strong foundation in Object-Oriented programming and collaborative developer environments.'
  },
  education: [
    {
      id: 'edu-1',
      school: 'STI West Negros University',
      degree: 'Bachelor of Science in Information Technology (BSIT)',
      details: 'Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming (Java), Database Management, Full-Stack Web Development, Mobile App Development, Systems Integration, and Quality Assurance.'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Assistant Programmer Intern',
      company: 'Information Technology Systems and Services (ITSS)',
      duration: 'Feb 2026 – May 2026',
      bullets: [
        'Assisted in developing a full-scale Faculty Evaluation System using Laravel, PHP, Bootstrap, JavaScript, and MySQL.',
        'Built interactive UI components and optimized database query runtimes to enhance load speeds.',
        'Conducted modular unit testing, regression testing, and collaborative debugging.',
        'Participated in systems analysis and documentation updates alongside development leads.'
      ]
    }
  ],
  skills: {
    technical: [
      { name: 'Frontend Development', level: 85, keywords: ['React', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'JavaScript'] },
      { name: 'Backend Development', level: 78, keywords: ['PHP', 'Laravel', 'Node.js', 'Express.js', 'Python'] },
      { name: 'Database Management', level: 80, keywords: ['MySQL', 'MongoDB', 'SQLite', 'Firebase Firestore'] },
      { name: 'Mobile App Development', level: 75, keywords: ['React Native', 'Expo', 'Android Development'] }
    ],
    tools: [
      { name: 'Development Tools', items: ['Git & GitHub', 'VS Code', 'Postman', 'Vite', 'npm', 'ESLint'] },
      { name: 'Design Tools', items: ['Figma', 'Adobe XD', 'Canva', 'Photoshop'] },
      { name: 'Core Foundations', items: ['OOP (Java/PHP)', 'Data Structures', 'RESTful APIs', 'MVC Architecture'] }
    ]
  },
  achievements: [
    'Successfully developed and piloted the Faculty Evaluation System at ITSS.',
    'Developed and deployed SEOPilot AI Assistant & CareerPilot AI Coach.',
    'Completed a comprehensive 400-hour Industry Internship with outstanding evaluation.',
    'Built and published a mobile Student Habit Tracker on GitHub & Expo builds.'
  ]
};
