/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ResumeData } from '../types';
import { Download, FileText, Edit2, Check, X, Phone, Mail, MapPin, RotateCcw } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ResumeEditorProps {
  data: ResumeData;
  onUpdateData?: (newData: ResumeData) => void;
  onResetData?: () => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, onUpdateData, onResetData }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: data.personalInfo.name,
    phone: data.personalInfo.phone,
    email: data.personalInfo.email,
    address: data.personalInfo.address,
    title: data.personalInfo.title,
    linkedin: data.personalInfo.linkedin,
    github: data.personalInfo.github,
    objective: data.personalInfo.objective,
  });

  const handleSaveContact = () => {
    if (onUpdateData) {
      const updated = {
        ...data,
        personalInfo: {
          ...data.personalInfo,
          name: contactForm.name,
          phone: contactForm.phone,
          email: contactForm.email,
          address: contactForm.address,
          title: contactForm.title,
          linkedin: contactForm.linkedin,
          github: contactForm.github,
          objective: contactForm.objective,
        },
      };
      onUpdateData(updated);
    }
    setIsEditingContact(false);
  };

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
        doc.setDrawColor(113, 113, 122); // Neutral zinc divider
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
        fontBold(11);
        doc.setTextColor(24, 24, 27); // Zinc accent color
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
  };  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs animate-fade-in" id="resume-builder">
      {/* Header controls */}
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Dave Postrero's Professional Resume
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            View Dave's professional background and download the official PDF immediately
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {onResetData && (
            <button
              onClick={onResetData}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-xl transition-colors cursor-pointer justify-center"
              title="Reset resume data to original data.ts file defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset to data.ts</span>
            </button>
          )}

          <button
            onClick={() => {
              setContactForm({
                name: data.personalInfo.name,
                phone: data.personalInfo.phone,
                email: data.personalInfo.email,
                address: data.personalInfo.address,
                title: data.personalInfo.title,
                linkedin: data.personalInfo.linkedin,
                github: data.personalInfo.github,
                objective: data.personalInfo.objective,
              });
              setIsEditingContact(!isEditingContact);
            }}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-amber-500/10 dark:bg-amber-500/20 hover:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-bold rounded-xl transition-colors cursor-pointer justify-center border border-amber-300 dark:border-amber-700"
            title="Edit Phone Number & Personal Info"
          >
            <Edit2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Edit Info</span>
          </button>

          <button
            onClick={generatePdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <Download className="w-3.5 h-3.5" />
            {isGeneratingPdf ? 'Compiling PDF...' : 'Download Resume PDF'}
          </button>
        </div>
      </div>

      {/* Inline Editor Panel when editing is active */}
      {isEditingContact && (
        <div className="p-5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 text-xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-900/60 pb-2">
            <h4 className="font-bold text-amber-950 dark:text-amber-100 text-sm flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Edit Resume Details (Updates live on preview & PDF)
            </h4>
            <button 
              onClick={() => setIsEditingContact(false)}
              className="p-1 text-amber-700 dark:text-amber-400 hover:text-amber-900 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-800 rounded text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-800 rounded text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                placeholder="+63 9xx xxx xxxx"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-800 rounded text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={contactForm.title}
                onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-800 rounded text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                Location / Address
              </label>
              <input
                type="text"
                value={contactForm.address}
                onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-800 rounded text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                LinkedIn Profile / Handle
              </label>
              <input
                type="text"
                value={contactForm.linkedin}
                onChange={(e) => setContactForm({ ...contactForm, linkedin: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-800 rounded text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                GitHub Profile / Link
              </label>
              <input
                type="text"
                value={contactForm.github}
                onChange={(e) => setContactForm({ ...contactForm, github: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-800 rounded text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
              Professional Summary / Objective
            </label>
            <textarea
              rows={2}
              value={contactForm.objective}
              onChange={(e) => setContactForm({ ...contactForm, objective: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-800 rounded text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-amber-200/60 dark:border-amber-900/60">
            <button
              type="button"
              onClick={() => setIsEditingContact(false)}
              className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveContact}
              className="px-5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              Save Resume Details
            </button>
          </div>
        </div>
      )}

      {/* Beautiful layout simulating printed letterhead */}
      <div className="p-6 md:p-8 bg-zinc-100/50 dark:bg-zinc-950/40 flex justify-center border-t border-zinc-200 dark:border-zinc-800">
        <div className="w-full max-w-[210mm] min-h-[297mm] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-xs rounded-xl text-zinc-800 dark:text-zinc-200 relative">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-900 dark:bg-zinc-100" />
          
          {/* Resume Heading */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase">
                {data.personalInfo.name}
              </h1>
              <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mt-1">
                {data.personalInfo.title}
              </h2>
            </div>
            
            <div className="text-xs text-zinc-500 dark:text-zinc-400 text-left md:text-right space-y-1 font-sans">
              <div>📍 {data.personalInfo.address}</div>
              <div>📧 {data.personalInfo.email}</div>
              <div>📞 {data.personalInfo.phone}</div>
              <div className="flex flex-wrap md:justify-end gap-2 mt-1">
                <span className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded font-mono text-[10px]">
                  {data.personalInfo.linkedin}
                </span>
                <span className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded font-mono text-[10px]">
                  {data.personalInfo.github}
                </span>
              </div>
            </div>
          </div>

          {/* Professional objective summary */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest mb-2 border-b border-zinc-200 dark:border-zinc-800 pb-1">
              Professional Summary
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {data.personalInfo.objective}
            </p>
          </div>

          {/* Experience */}
          {data.experience.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest mb-3 border-b border-zinc-200 dark:border-zinc-800 pb-1">
                Work Experience
              </h3>
              
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {exp.role}
                      </h4>
                      <span className="text-xs text-zinc-500 font-mono">
                        {exp.duration}
                      </span>
                    </div>
                    <h5 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                      {exp.company}
                    </h5>
                    
                    <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1.5 text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest mb-3 border-b border-zinc-200 dark:border-zinc-800 pb-1">
                Education History
              </h3>
              
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {edu.degree}
                      </h4>
                      <span className="text-xs text-zinc-500 font-mono">
                        {edu.duration}
                      </span>
                    </div>
                    <h5 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
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
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest mb-3 border-b border-zinc-200 dark:border-zinc-800 pb-1">
              Skills & Technology Domains
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                {data.skills.technical.map((tech, tIdx) => (
                  <div key={tIdx}>
                    <div className="flex justify-between items-baseline mb-0.5 text-xs">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{tech.name}</span>
                      <span className="text-zinc-400 font-mono text-[10px]">{tech.level}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1">
                      <div 
                        className="bg-zinc-900 dark:bg-zinc-100 h-1 rounded-full" 
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
                  <div key={catIdx} className="bg-zinc-50 dark:bg-zinc-800/40 p-2.5 border border-zinc-200 dark:border-zinc-700/60 rounded-xl">
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
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest mb-3 border-b border-zinc-200 dark:border-zinc-800 pb-1">
                Key Achievements
              </h3>
              <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1.5 text-zinc-600 dark:text-zinc-400">
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
