/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'web' | 'mobile' | 'desktop' | 'ai-studio';
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  duration?: string;
  icon: string;
  featured: boolean;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  duration: string;
  details: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface SkillItem {
  name: string;
  level: number; // 0-100
  keywords: string[];
}

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    github: string;
    objective: string;
  };
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: {
    technical: SkillItem[];
    tools: { name: string; items: string[] }[];
  };
  achievements: string[];
}
