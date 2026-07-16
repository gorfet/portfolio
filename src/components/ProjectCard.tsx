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
        return <Monitor className="w-5 h-5 text-indigo-500" />;
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-emerald-500" />;
      case 'desktop':
        return <Cpu className="w-5 h-5 text-amber-500" />;
      case 'ai-studio':
        return <Sparkles className="w-5 h-5 text-violet-500" />;
      default:
        return <Monitor className="w-5 h-5 text-gray-500" />;
    }
  };

  const getGradient = (category: string) => {
    switch (category) {
      case 'web':
        return 'from-blue-500 to-indigo-600';
      case 'mobile':
        return 'from-emerald-400 to-teal-600';
      case 'desktop':
        return 'from-amber-400 to-orange-500';
      case 'ai-studio':
        return 'from-violet-500 to-fuchsia-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
      id={`project-card-${project.id}`}
    >
      {/* Card Header with Icon / Gradient */}
      <div className={`h-36 bg-gradient-to-br ${getGradient(project.category)} relative flex items-center justify-center overflow-hidden p-6`}>
        {/* Abstract background circles */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <div className="absolute -left-6 -top-6 w-20 h-20 bg-black/10 rounded-full blur-lg" />
        
        <span className="text-6xl select-none z-10 transform hover:scale-110 transition-transform duration-300">
          {project.icon}
        </span>
        
        {project.category === 'ai-studio' && (
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
            <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300 animate-pulse" />
            AI Studio Spotlight
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {getCategoryIcon(project.category)}
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {project.category === 'ai-studio' ? 'Google AI Studio App' : project.category}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 line-clamp-1 mb-2">
            {project.title}
          </h3>
          
          <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 leading-relaxed mb-4">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-0.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded text-[11px] font-medium border border-zinc-100 dark:border-zinc-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between mt-auto">
          {project.duration && (
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
              {project.duration}
            </span>
          )}

          <div className="flex items-center gap-2">
            {project.githubUrl && project.githubUrl !== '#' && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View Source Code"
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
                title="Launch Live Application"
                className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {onViewDetails && (
              <button
                onClick={() => onViewDetails(project)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer"
              >
                Details &rarr;
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
