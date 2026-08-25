/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentPortfolio } from '../../../types/career';
import {
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Globe,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ShieldCheck,
  Printer,
  Edit3,
  Check,
  Eye,
  Lock,
} from 'lucide-react';

interface CareerPortfolioTabProps {
  portfolio: StudentPortfolio;
  onUpdatePortfolio: (portfolio: StudentPortfolio) => void;
  onTogglePublic: (isPublic: boolean) => void;
}

export const CareerPortfolioTab: React.FC<CareerPortfolioTabProps> = ({
  portfolio,
  onUpdatePortfolio,
  onTogglePublic,
}) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [headline, setHeadline] = useState(portfolio.headline);
  const [bio, setBio] = useState(portfolio.bio);
  const [githubUrl, setGithubUrl] = useState(portfolio.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(portfolio.linkedinUrl || '');

  const handleSaveProfile = () => {
    onUpdatePortfolio({
      ...portfolio,
      headline,
      bio,
      githubUrl,
      linkedinUrl,
    });
    setIsEditingBio(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Portfolio Header Bar */}
      <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 font-heading">
              Verified Student CV & Portfolio
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              Enemind Verified
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Aggregates your authenticated Phase 2 academic honors, verified technical skills, and practical projects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTogglePublic(!portfolio.isPublic)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              portfolio.isPublic
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-neutral-100 border-neutral-200 text-neutral-600'
            }`}
          >
            {portfolio.isPublic ? <Eye className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{portfolio.isPublic ? 'Publicly Visible' : 'Private'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export / Print CV</span>
          </button>
        </div>
      </div>

      {/* Main Resume Sheet */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Header Profile Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-neutral-200">
          <div className="space-y-2 flex-1">
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 font-heading tracking-tight">
              {portfolio.fullName}
            </h1>
            <p className="text-sm font-bold text-emerald-700">
              {portfolio.headline}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-500 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" /> {portfolio.location}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-neutral-400" /> {portfolio.emailContact}
              </span>
              {portfolio.phoneContact && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" /> {portfolio.phoneContact}
                </span>
              )}
            </div>

            {/* Links */}
            <div className="flex items-center gap-3 pt-2">
              {portfolio.githubUrl && (
                <a
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub Profile
                </a>
              )}
              {portfolio.linkedinUrl && (
                <a
                  href={portfolio.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingBio(!isEditingBio)}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 print:hidden"
          >
            <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
            <span>{isEditingBio ? 'Cancel' : 'Edit Info'}</span>
          </button>
        </div>

        {/* Edit Bio Drawer */}
        {isEditingBio && (
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4 print:hidden">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Edit Headline, Bio & Social Links
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Executive Summary / Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditingBio(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Bio / Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">
            Professional Summary
          </h3>
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
            {portfolio.bio}
          </p>
        </div>

        {/* Education (From Phase 2 Academic Engine) */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            Academic Education & Verified Standing
          </h3>

          <div className="space-y-3">
            {portfolio.education.map((edu, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 font-heading">
                    {edu.degree} in {edu.programme}
                  </h4>
                  <span className="text-xs font-bold text-neutral-600">
                    {edu.startYear} – {edu.endYear}
                  </span>
                </div>
                <p className="text-xs text-neutral-700 font-medium">
                  {edu.institution}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200/60">
                    {edu.gpaDisplay}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {edu.honors}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Technical Skills */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Technical & Domain Competencies
          </h3>

          <div className="flex flex-wrap gap-2">
            {portfolio.skills.map((sk, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-semibold flex items-center gap-1.5"
              >
                <span>{sk.skillName}</span>
                <span className="text-[10px] text-neutral-500 font-normal uppercase">
                  ({sk.level})
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Proof of Work Projects */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Code className="w-4 h-4 text-emerald-600" />
            Applied Projects & Proof of Work
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolio.projects
              .filter((p) => p.isFeaturedInPortfolio)
              .map((proj) => (
                <div key={proj.id} className="p-4 rounded-2xl border border-neutral-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 font-heading">
                      {proj.title}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      {proj.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.skillsUsed.map((sk, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 text-neutral-700">
                        {sk}
                      </span>
                    ))}
                  </div>
                  {proj.githubUrl && (
                    <div className="pt-2">
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" /> View Code Artifact
                      </a>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Experience & Attachments */}
        {portfolio.experience.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Industry Attachments & Practical Experience
            </h3>

            <div className="space-y-3">
              {portfolio.experience.map((exp) => (
                <div key={exp.id} className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 font-heading">
                      {exp.role} · {exp.organization}
                    </h4>
                    <span className="text-xs text-neutral-500 font-medium">
                      {exp.startDate} – {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">{exp.location}</p>
                  <ul className="space-y-1 pt-1">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="text-xs text-neutral-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Honors */}
        {portfolio.certifications.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              Professional Certifications & Awards
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {portfolio.certifications.map((cert) => (
                <div key={cert.id} className="p-3.5 rounded-xl border border-neutral-200 bg-white space-y-1">
                  <h5 className="text-xs font-bold text-neutral-900">
                    {cert.name}
                  </h5>
                  <p className="text-[11px] text-neutral-500">
                    {cert.issuingOrganization} · Issued {cert.issueDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
