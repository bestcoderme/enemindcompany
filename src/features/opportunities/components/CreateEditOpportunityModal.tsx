import React, { useState } from 'react';
import { X, Plus, Edit2, ShieldCheck, Building, Globe, MapPin, DollarSign, Calendar } from 'lucide-react';
import { Opportunity, OpportunityType, FundingType } from '../../../types/opportunities';
import { OpportunityService } from '../../../services/opportunities/opportunityService';

interface CreateEditOpportunityModalProps {
  initialData?: Opportunity | null;
  authorEmail: string;
  onClose: () => void;
  onSaved: () => void;
}

const TYPES: OpportunityType[] = [
  'Scholarship',
  'Attachment',
  'Internship',
  'Job',
  'Fellowship',
  'Competition',
  'Graduate Programme',
  'Volunteering',
  'Training',
];

const FUNDING_TYPES: FundingType[] = [
  'Fully Funded',
  'Partially Funded',
  'Paid',
  'Unpaid',
  'Competitive',
  'Tuition Only',
  'Monthly Stipend',
  'Grant',
];

export const CreateEditOpportunityModal: React.FC<CreateEditOpportunityModalProps> = ({
  initialData,
  authorEmail,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title || '');
  const [organization, setOrganization] = useState(initialData?.organization || '');
  const [type, setType] = useState<OpportunityType>(initialData?.type || 'Attachment');
  const [country, setCountry] = useState(initialData?.country || 'Kenya');
  const [location, setLocation] = useState(initialData?.location || 'Nairobi, Kenya');
  const [isRemote, setIsRemote] = useState<boolean>(
    initialData?.remote === true || initialData?.remote === 'remote'
  );
  const [applicationUrl, setApplicationUrl] = useState(initialData?.applicationUrl || '');
  const [source, setSource] = useState(initialData?.source || 'Official Directorate Portal');
  const [sourceUrl, setSourceUrl] = useState(initialData?.sourceUrl || '');
  const [field, setField] = useState(initialData?.field || 'Engineering & Technology');
  const [skillsStr, setSkillsStr] = useState(
    (initialData?.requiredSkills || ['Python', 'Problem Solving']).join(', ')
  );
  const [minimumGPA, setMinimumGPA] = useState<string>(
    initialData?.minimumGPA ? String(initialData.minimumGPA) : ''
  );
  const [fundingAmount, setFundingAmount] = useState(initialData?.fundingAmount || '');
  const [fundingType, setFundingType] = useState<FundingType>(
    initialData?.fundingType || 'Paid'
  );
  const [deadline, setDeadline] = useState(initialData?.deadline || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [verified, setVerified] = useState(initialData?.verified || true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedSkills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<Opportunity> = {
      title: title.trim(),
      organization: organization.trim(),
      provider: organization.trim(),
      type,
      country: country.trim(),
      countries: [country.trim()],
      location: location.trim(),
      remote: isRemote,
      applicationUrl: applicationUrl.trim() || 'https://enemind.com',
      source: source.trim(),
      sourceUrl: sourceUrl.trim() || applicationUrl.trim(),
      field: field.trim(),
      fields: [field.trim()],
      requiredSkills: parsedSkills,
      minimumGPA: minimumGPA ? parseFloat(minimumGPA) : undefined,
      fundingAmount: fundingAmount.trim(),
      fundingType,
      deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      description: description.trim(),
      verified,
      status: 'open',
    };

    if (isEditing && initialData) {
      OpportunityService.updateOpportunity(initialData.id, payload);
    } else {
      OpportunityService.createOpportunity(payload, authorEmail);
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              {isEditing ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {isEditing ? 'Edit Opportunity' : 'Create Verified Opportunity'}
              </h3>
              <p className="text-xs text-slate-400">
                Provide genuine details and official application links.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Opportunity Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Safaricom Engineering Attachment 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Org & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Organization / Provider *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Safaricom PLC, Mastercard Foundation"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Opportunity Type *
              </label>
              <select
                aria-label="Select Opportunity Type"
                value={type}
                onChange={(e) => setType(e.target.value as OpportunityType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location & Remote */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location / City
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={isRemote}
                  onChange={(e) => setIsRemote(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-500 bg-slate-950 border-slate-700"
                />
                <span>Remote Friendly</span>
              </label>
            </div>
          </div>

          {/* Application URL & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Official Application URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Official Source Name
              </label>
              <input
                type="text"
                placeholder="e.g. Careers Bulletin / University Liaison"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Field, Skills, Minimum GPA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Field of Study
              </label>
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Required Skills (comma-separated)
              </label>
              <input
                type="text"
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Minimum GPA (Optional)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5.0"
                placeholder="e.g., 3.2"
                value={minimumGPA}
                onChange={(e) => setMinimumGPA(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Funding Amount, Funding Type, Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Funding / Stipend Amount
              </label>
              <input
                type="text"
                placeholder="e.g. KSh 35,000 / month"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Funding Type
              </label>
              <select
                aria-label="Select Funding Type"
                value={fundingType}
                onChange={(e) => setFundingType(e.target.value as FundingType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              >
                {FUNDING_TYPES.map((ft) => (
                  <option key={ft} value={ft}>
                    {ft}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Application Deadline *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description & Requirements *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe program, duties, duration, and application requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Verified toggle */}
          <div className="flex items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-emerald-400">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-700"
              />
              <ShieldCheck className="w-4 h-4" />
              <span>Mark as Verified Official Listing</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors shadow-md"
            >
              {isEditing ? 'Save Changes' : 'Create Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
