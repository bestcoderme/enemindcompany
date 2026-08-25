import React, { useState } from 'react';
import { X, Check, Calendar, AlertCircle } from 'lucide-react';
import { SemesterStatus } from '../../../types';

interface AddSemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    academicYearName: string;
    semesterNumber: number;
    status: SemesterStatus;
  }) => void;
}

export const AddSemesterModal: React.FC<AddSemesterModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [academicYearName, setAcademicYearName] = useState('Year 1 (2025/2026)');
  const [name, setName] = useState('Semester 1');
  const [semesterNumber, setSemesterNumber] = useState(1);
  const [status, setStatus] = useState<SemesterStatus>('active');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!academicYearName.trim() || !name.trim()) {
      setError('Please provide academic year and semester name');
      return;
    }
    onSave({
      academicYearName: academicYearName.trim(),
      name: name.trim(),
      semesterNumber,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-neutral-900 font-heading">
                Add Academic Semester
              </h3>
              <p className="text-xs text-neutral-500">Create new term for marks entry</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Academic Year (e.g. Year 1 / 2025/2026) *
            </label>
            <input
              type="text"
              required
              id="sem-modal-year-input"
              placeholder="Year 1 (2025/2026)"
              value={academicYearName}
              onChange={(e) => setAcademicYearName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Semester / Term Name *
              </label>
              <input
                type="text"
                required
                id="sem-modal-name-input"
                placeholder="Semester 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Semester Number (1-4)
              </label>
              <select
                id="sem-modal-num-select"
                value={semesterNumber}
                onChange={(e) => setSemesterNumber(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              >
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
                <option value={3}>Semester 3 / Trimester</option>
                <option value={4}>Semester 4 / Attachment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Current Status
            </label>
            <select
              id="sem-modal-status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as SemesterStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="active">Active (Currently in progress)</option>
              <option value="completed">Completed (Graded past semester)</option>
              <option value="upcoming">Upcoming (Future semester)</option>
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-semester-submit-btn"
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Create Semester</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
