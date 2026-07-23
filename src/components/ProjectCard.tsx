/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Project } from '../types';
import { ExternalLink, Github, Monitor, Smartphone, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ProjectCardProps {
  project: Project;
  onViewDetails?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web':
        return <Monitor className="w-3.5 h-3.5" />;
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'desktop':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'ai-studio':
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Monitor className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'web': return 'Web Development';
      case 'mobile': return 'Mobile Applications';
      case 'desktop': return 'Desktop Systems';
      case 'ai-studio': return 'Google AI Studio';
      default: return category;
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col h-full overflow-hidden group"
      id={`project-card-${project.id}`}
    >
      {/* Featured Banner / Media Area */}
      <div className="h-36 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-800 relative flex items-center justify-center p-6 group-hover:bg-zinc-200/50 dark:group-hover:bg-zinc-800 transition-colors">
        <span className="text-5xl select-none transform group-hover:scale-105 transition-transform duration-300">
          {project.icon}
        </span>
        
        {/* Category Taxonomy Badge */}
        <div className="absolute top-3 left-3 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-xs flex items-center gap-1.5">
          {getCategoryIcon(project.category)}
          <span>{getCategoryLabel(project.category)}</span>
        </div>

        {project.category === 'ai-studio' && (
          <div className="absolute top-3 right-3 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            AI App
          </div>
        )}
      </div>

      {/* Entry Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Card Meta Header */}
          <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-sans mb-1.5 flex items-center gap-2">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Software Project</span>
            <span>•</span>
            <time className="font-mono">{project.duration || '2026'}</time>
          </div>
          
          {/* Title in Editorial Serif Style */}
          <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors line-clamp-1 mb-2 leading-snug">
            {project.title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-zinc-600 dark:text-zinc-400 text-xs line-clamp-3 leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Tags Cloud */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded text-[10px] font-mono border border-zinc-200/80 dark:border-zinc-700/80"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card Entry Footer / Actions */}
        <div className="pt-3 border-t border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between mt-auto text-xs">
          <div className="flex items-center gap-2">
            {project.githubUrl && project.githubUrl !== '#' && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View Source Repository"
                className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            
            {project.demoUrl && project.demoUrl !== '#' && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open Live Preview"
                className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {onViewDetails && (
            <button
              onClick={() => onViewDetails(project)}
              className="font-bold text-zinc-900 dark:text-zinc-100 hover:underline transition-all cursor-pointer flex items-center gap-1"
            >
              View Details &rarr;
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
};
