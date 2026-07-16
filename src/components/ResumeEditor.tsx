/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ResumeData } from '../types';
import { Download, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ResumeEditorProps {
  data: ResumeData;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ data }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Modern jsPDF PDF Export (exact design reproduction, multi-page aware and beautiful)
  const generatePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const marginX = 18;
      const marginTop = 18;
      const marginBottom = 16;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxWidth = pageWidth - marginX * 2;
      let y = marginTop;

      const GAP_WRAP = 5.5;
      const GAP_BULLET = 5.5;

      const newPageIfNeeded = (space = 0) => {
        if (y + space > pageHeight - marginBottom) {
          doc.addPage();
          y = marginTop;
          return true;
        }
        return false;
      };

      const fontRegular = (size = 10) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(size);
        doc.setTextColor(60, 60, 60);
      };

      const fontBold = (size = 11) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(size);
        doc.setTextColor(30, 30, 30);
      };

      const drawHeaderDivider = () => {
        doc.setDrawColor(220, 225, 230);
        doc.setLineWidth(0.3);
        doc.line(marginX, y, pageWidth - marginX, y);
        y += 4;
      };

      const drawDivider = () => {
        newPageIfNeeded(6);
        doc.setDrawColor(99, 102, 241); // Indigo color accents
        doc.setLineWidth(0.4);
        doc.line(marginX, y, pageWidth - marginX, y);
        y += 5;
      };

      const wrap = (text: string, opts: { bold?: boolean; size?: number; gap?: number; x?: number; width?: number } = {}) => {
        const { bold = false, size = 10, gap = GAP_WRAP, x = marginX, width = maxWidth } = opts;
        bold ? fontBold(size) : fontRegular(size);
        const lines = doc.splitTextToSize(text, width);
        newPageIfNeeded(lines.length * gap + 2);
        doc.text(lines, x, y);
        y += lines.length * gap;
      };

      const sectionHeader = (title: string) => {
        newPageIfNeeded(15);
        y += 4;
        fontBold(12);
        doc.setTextColor(79, 70, 229); // Accent Indigo color
        doc.text(title.toUpperCase(), marginX, y);
        y += 4;
        drawHeaderDivider();
        y += 2;
      };

      const bullet = (text: string) => {
        newPageIfNeeded(8);
        fontRegular(10);
        doc.text('•', marginX + 1, y);
        wrap(text, {
          x: marginX + 5,
          width: maxWidth - 6,
          gap: GAP_BULLET
        });
      };

      // 1. Title / Header
      fontBold(18);
      doc.setTextColor(17, 24, 39); // Deep dark color
      doc.text(data.personalInfo.name.toUpperCase(), marginX, y);
      y += 6;

      fontRegular(11);
      doc.setTextColor(79, 70, 229); // Indigo for professional title
      doc.text(data.personalInfo.title, marginX, y);
      y += 8;

      // Contact detail lines
      fontRegular(9.5);
      doc.setTextColor(100, 116, 139);
      const contactInfo = `${data.personalInfo.email}  |  ${data.personalInfo.phone}  |  Silay, Philippines`;
      doc.text(contactInfo, marginX, y);
      y += 5;

      const socialInfo = `${data.personalInfo.linkedin}  |  ${data.personalInfo.github}`;
      doc.text(socialInfo, marginX, y);
      y += 7;

      drawDivider();

      // 2. Objective
      sectionHeader('Professional Summary');
      wrap(data.personalInfo.objective, { size: 10, gap: 5.5 });
      y += 2;

      // 3. Experience
      if (data.experience.length > 0) {
        sectionHeader('Work Experience');
        data.experience.forEach((exp) => {
          newPageIfNeeded(25);
          fontBold(11);
          doc.text(exp.role, marginX, y);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(100, 116, 139);
          doc.text(exp.duration, pageWidth - marginX, y, { align: 'right' });
          y += 5;

          fontBold(10);
          doc.setTextColor(79, 70, 229);
          doc.text(exp.company, marginX, y);
          y += 6;

          exp.bullets.forEach((b) => {
            bullet(b);
          });
          y += 3;
        });
      }

      // 4. Education
      if (data.education.length > 0) {
        sectionHeader('Education');
        data.education.forEach((edu) => {
          newPageIfNeeded(20);
          fontBold(11);
          doc.text(edu.degree, marginX, y);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(100, 116, 139);
          doc.text(edu.duration, pageWidth - marginX, y, { align: 'right' });
          y += 5;

          fontBold(10);
          doc.setTextColor(17, 24, 39);
          doc.text(edu.school, marginX, y);
          y += 6;

          wrap(edu.details, { size: 9.5, gap: 5 });
          y += 3;
        });
      }

      // 5. Technical Skills
      sectionHeader('Technical Skills');
      data.skills.technical.forEach((tech) => {
        newPageIfNeeded(8);
        fontBold(10);
        doc.setTextColor(17, 24, 39);
        doc.text(`${tech.name}:`, marginX, y);
        
        fontRegular(10);
        const keywordsStr = tech.keywords.join(', ');
        doc.text(keywordsStr, marginX + 45, y);
        y += 5.5;
      });
      y += 2;

      // Other Tools category
      if (data.skills.tools.length > 0) {
        sectionHeader('Other Technologies & Methodologies');
        data.skills.tools.forEach((tool) => {
          newPageIfNeeded(8);
          fontBold(10);
          doc.setTextColor(17, 24, 39);
          doc.text(`${tool.name}:`, marginX, y);
          
          fontRegular(10);
          doc.text(tool.items.join(', '), marginX + 45, y);
          y += 5.5;
        });
      }

      // 6. Achievements
      if (data.achievements.length > 0) {
        sectionHeader('Key Achievements');
        data.achievements.forEach((ach) => {
          bullet(ach);
        });
      }

      // Dynamic Page numbering & Footer line
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(148, 163, 184);
        
        // Page border decoration (subtle and extremely elegant)
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.2);
        doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);

        doc.text(
          `Generated Portfolio Resume - ${data.personalInfo.name}`,
          marginX,
          pageHeight - 7
        );
        
        doc.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - marginX,
          pageHeight - 7,
          { align: 'right' }
        );
      }

      doc.save(`${data.personalInfo.name.replace(/\s+/g, '-')}-Resume.pdf`);
    } catch (err) {
      console.error('PDF Generation Error: ', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm animate-fade-in" id="resume-builder">
      {/* Header controls */}
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              Dave Postrero's Professional Resume
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            View Dave's professional background and download the official PDF immediately
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={generatePdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50 transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <Download className="w-3.5 h-3.5" />
            {isGeneratingPdf ? 'Compiling PDF...' : 'Download Resume PDF'}
          </button>
        </div>
      </div>

      {/* Beautiful layout simulating printed letterhead */}
      <div className="p-6 md:p-8 bg-zinc-100/50 dark:bg-zinc-950/40 flex justify-center border-t border-zinc-100 dark:border-zinc-800">
        <div className="w-full max-w-[210mm] min-h-[297mm] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm rounded-lg text-zinc-800 dark:text-zinc-200 relative">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600" />
          
          {/* Resume Heading */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
            <div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">
                {data.personalInfo.name}
              </h1>
              <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {data.personalInfo.title}
              </h2>
            </div>
            
            <div className="text-xs text-zinc-500 dark:text-zinc-400 text-left md:text-right space-y-1 font-sans">
              <div>📍 {data.personalInfo.address}</div>
              <div>📧 {data.personalInfo.email}</div>
              <div>📞 {data.personalInfo.phone}</div>
              <div className="flex flex-wrap md:justify-end gap-2 mt-1">
                <span className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded font-mono text-[10px]">
                  {data.personalInfo.linkedin}
                </span>
                <span className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded font-mono text-[10px]">
                  {data.personalInfo.github}
                </span>
              </div>
            </div>
          </div>

          {/* Professional objective summary */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 border-b border-zinc-100 dark:border-zinc-800 pb-1">
              Professional Summary
            </h3>
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-350">
              {data.personalInfo.objective}
            </p>
          </div>

          {/* Experience */}
          {data.experience.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-1">
                Work Experience
              </h3>
              
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {exp.role}
                      </h4>
                      <span className="text-xs text-zinc-500 font-mono">
                        {exp.duration}
                      </span>
                    </div>
                    <h5 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                      {exp.company}
                    </h5>
                    
                    <ul className="list-disc pl-5 text-sm space-y-1.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {exp.bullets.map((bulletText, bIdx) => (
                        <li key={bIdx}>{bulletText}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-1">
                Education History
              </h3>
              
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {edu.degree}
                      </h4>
                      <span className="text-xs text-zinc-500 font-mono">
                        {edu.duration}
                      </span>
                    </div>
                    <h5 className="text-xs font-semibold text-zinc-800 dark:text-zinc-300 mb-1.5">
                      {edu.school}
                    </h5>
                    <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {edu.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-1">
              Skills & Technology Domains
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                {data.skills.technical.map((tech, tIdx) => (
                  <div key={tIdx}>
                    <div className="flex justify-between items-baseline mb-0.5 text-xs">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{tech.name}</span>
                      <span className="text-zinc-400 font-mono">{tech.level}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1">
                      <div 
                        className="bg-indigo-600 h-1 rounded-full" 
                        style={{ width: `${tech.level}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight mt-0.5">
                      {tech.keywords.join(', ')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {data.skills.tools.map((cat, catIdx) => (
                  <div key={catIdx} className="bg-zinc-50 dark:bg-zinc-800/40 p-2 border border-zinc-150 dark:border-zinc-700/50 rounded">
                    <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-0.5">{cat.name}</h5>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {cat.items.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          {data.achievements.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-1">
                Key Achievements
              </h3>
              <ul className="list-disc pl-5 text-sm space-y-1.5 text-zinc-600 dark:text-zinc-400">
                {data.achievements.map((ach, aIdx) => (
                  <li key={aIdx}>{ach}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
