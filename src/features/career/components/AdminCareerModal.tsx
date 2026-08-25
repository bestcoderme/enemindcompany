/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Career, CareerCategory } from '../../../types/career';
import { CareerService } from '../../../services/career/careerService';
import { X, Plus, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AdminCareerModalProps {
  onClose: () => void;
  onRefresh: () => void;
}

export const AdminCareerModal: React.FC<AdminCareerModalProps> = ({ onClose, onRefresh }) => {
  const [careers, setCareers] = useState<Career[]>(() => CareerService.getAllCareers());
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CareerCategory>('Technology');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [relatedProgrammes, setRelatedProgrammes] = useState('');
  const [entrySalary, setEntrySalary] = useState('KES 80,000 - 140,000/mo');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCareer: Omit<Career, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      category,
      tagline: tagline.trim() || title.trim(),
      description: description.trim() || `Professional ${title} pathway.`,
      whatProfessionalsDo: [
        'Analyze domain specifications and implement systematic solutions.',
        'Collaborate with multi-disciplinary stakeholders to deliver technical outcomes.',
      ],
      requiredSkills: requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      recommendedSkills: ['Problem Solving', 'Communication'],
      futureSkills: ['AI-Assisted Workflows'],
      educationRequirements: {
        minimumLevel: 'Bachelors',
        recommendedMajor: relatedProgrammes.split(',')[0]?.trim() || 'Related Field',
        alternativePathways: [],
      },
      salaryInformation: [
        {
          country: 'Kenya',
          currency: 'KES',
          entryLevel: entrySalary,
          midLevel: 'KES 200,000 - 450,000/mo',
          seniorLevel: 'KES 500,000+/mo',
        },
      ],
      industries: [category, 'Consulting'],
      remotePossible: true,
      remotePotentialScore: 75,
      freelanceViabilityScore: 70,
      entrepreneurshipPotentialScore: 80,
      entrepreneurshipIdeas: [`Launch a specialized ${title} agency/consultancy`],
      relatedProgrammes: relatedProgrammes.split(',').map((s) => s.trim()).filter(Boolean),
      relatedSubjects: ['Course Fundamentals', 'Domain Engineering'],
      entryLevelRoles: [`Junior ${title}`, `Associate ${title}`],
      progressionRoles: [`Senior ${title}`, 'Lead Consultant'],
      toolsAndTech: ['Core Stack'],
      countries: ['Kenya', 'Global'],
      pathways: ['Corporate Employment'],
      isVerified: true,
      certifications: [],
      projectTemplates: [],
      learningResources: [],
    };

    CareerService.createCareer(newCareer);
    setCareers(CareerService.getAllCareers());
    setIsAdding(false);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this career pathway?')) {
      CareerService.deleteCareer(id);
      setCareers(CareerService.getAllCareers());
      onRefresh();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between gap-4 bg-neutral-900 text-white shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
              Admin Governance Portal
            </span>
            <h2 className="text-lg font-bold font-heading">
              Career Catalog & Taxonomy Management
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700">
              Total Catalog Pathways: {careers.length}
            </span>

            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Cancel' : 'Add New Career'}</span>
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleCreate} className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Register New Career Pathway
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Career Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Cloud Security Architect"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CareerCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs"
                  >
                    {CareerService.getAllCategories().map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Tagline / Short Summary</label>
                <input
                  type="text"
                  placeholder="e.g. Design, secure, and operate enterprise cloud environments."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Full Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Required Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. AWS, Terraform, Zero Trust, Linux"
                    value={requiredSkills}
                    onChange={(e) => setRequiredSkills(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Related Programmes (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science, Information Security"
                    value={relatedProgrammes}
                    onChange={(e) => setRelatedProgrammes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  Save Career
                </button>
              </div>
            </form>
          )}

          {/* List of Careers */}
          <div className="space-y-2">
            {careers.map((career) => (
              <div
                key={career.id}
                className="p-4 rounded-xl border border-neutral-200 bg-white flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">{career.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      {career.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                    {career.tagline || career.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDelete(career.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
