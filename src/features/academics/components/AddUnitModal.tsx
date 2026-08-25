import React, { useState, useEffect } from 'react';
import { StudentAcademicRecord, UniversityGradingSystem } from '../../../types';
import { AcademicCalculationService } from '../../../services/academic/academicCalculationService';
import { AcademicRulesResolver } from '../../../services/academic/academicRulesResolver';
import { X, Check, AlertCircle, Calculator, BookOpen } from 'lucide-react';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  semesterId: string;
  semesterName: string;
  gradingSystem: UniversityGradingSystem;
  editingRecord?: StudentAcademicRecord | null;
  onSave: (data: {
    semesterId: string;
    unitCode: string;
    unitName: string;
    creditHours: number;
    catScore?: number;
    catMax?: number;
    examScore?: number;
    examMax?: number;
    remarks?: string;
  }) => { error?: string };
}

export const AddUnitModal: React.FC<AddUnitModalProps> = ({
  isOpen,
  onClose,
  semesterId,
  semesterName,
  gradingSystem,
  editingRecord,
  onSave,
}) => {
  const [unitCode, setUnitCode] = useState('');
  const [unitName, setUnitName] = useState('');
  const [creditHours, setCreditHours] = useState(3);
  const [catScore, setCatScore] = useState<string>('24');
  const [catMax, setCatMax] = useState<number>(30);
  const [examScore, setExamScore] = useState<string>('52');
  const [examMax, setExamMax] = useState<number>(70);
  const [remarks, setRemarks] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingRecord) {
      setUnitCode(editingRecord.unitCode);
      setUnitName(editingRecord.unitName);
      setCreditHours(editingRecord.creditHours);
      setCatScore(editingRecord.assessments.catScore !== undefined ? String(editingRecord.assessments.catScore) : '');
      setCatMax(editingRecord.assessments.catMax || 30);
      setExamScore(editingRecord.assessments.examScore !== undefined ? String(editingRecord.assessments.examScore) : '');
      setExamMax(editingRecord.assessments.examMax || 70);
      setRemarks(editingRecord.remarks || '');
    } else {
      setUnitCode('');
      setUnitName('');
      setCreditHours(3);
      setCatScore('');
      setCatMax(30);
      setExamScore('');
      setExamMax(70);
      setRemarks('');
    }
    setFormError(null);
  }, [editingRecord, isOpen]);

  if (!isOpen) return null;

  // Real-time live calculation
  const numCat = parseFloat(catScore) || 0;
  const numExam = parseFloat(examScore) || 0;
  const numCredit = Math.max(1, creditHours);

  const previewCalc = AcademicCalculationService.calculateAssessmentTotal({
    catScore: numCat,
    catMax,
    examScore: numExam,
    examMax,
  });

  const previewGrade = previewCalc.isValid
    ? AcademicCalculationService.resolveGrade(previewCalc.percentage, gradingSystem)
    : '—';
  const previewGradePoint = previewCalc.isValid
    ? AcademicCalculationService.resolveGradePoint(previewCalc.percentage, gradingSystem)
    : 0.0;
  const previewQualityPoints = AcademicCalculationService.calculateWeightedPoints(
    previewGradePoint,
    numCredit
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!unitCode.trim()) {
      setFormError('Please enter a unit code (e.g. EEE 421)');
      return;
    }
    if (!unitName.trim()) {
      setFormError('Please enter the unit title (e.g. Electrical Machines II)');
      return;
    }
    if (!previewCalc.isValid) {
      setFormError(previewCalc.error || 'Invalid assessment marks');
      return;
    }

    const res = onSave({
      semesterId,
      unitCode: unitCode.trim().toUpperCase(),
      unitName: unitName.trim(),
      creditHours: numCredit,
      catScore: numCat,
      catMax,
      examScore: numExam,
      examMax,
      remarks: remarks.trim() || undefined,
    });

    if (res.error) {
      setFormError(res.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-neutral-900 font-heading">
                {editingRecord ? 'Edit Course Unit Marks' : 'Add Unit & Enter Marks'}
              </h3>
              <p className="text-xs text-neutral-500">{semesterName}</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Unit Code *
              </label>
              <input
                type="text"
                required
                id="unit-code-input"
                placeholder="EEE 421"
                value={unitCode}
                onChange={(e) => setUnitCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 uppercase focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Unit Name / Title *
              </label>
              <input
                type="text"
                required
                id="unit-name-input"
                placeholder="Electrical Machines II"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Credit Hours *
              </label>
              <input
                type="number"
                min="1"
                max="12"
                required
                id="unit-credits-input"
                value={creditHours}
                onChange={(e) => setCreditHours(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                CAT / Coursework
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={catMax}
                  id="unit-cat-score-input"
                  placeholder="24"
                  value={catScore}
                  onChange={(e) => setCatScore(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-xs text-neutral-400 font-bold">/ {catMax}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Final Exam Score
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={examMax}
                  id="unit-exam-score-input"
                  placeholder="52"
                  value={examScore}
                  onChange={(e) => setExamScore(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-xs text-neutral-400 font-bold">/ {examMax}</span>
              </div>
            </div>
          </div>

          {/* Real-time Calculation Result Box */}
          <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-2">
              <span className="flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                Automatic Mark Calculation
              </span>
              <span>Rule: {gradingSystem.name}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              <div>
                <span className="text-[10px] text-neutral-400 block">Total Mark</span>
                <span className="text-base font-black text-white font-heading">
                  {previewCalc.isValid ? `${previewCalc.totalMarks}%` : '—'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 block">Grade</span>
                <span className="text-base font-black text-emerald-400 font-heading">
                  {previewGrade}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 block">Grade Point</span>
                <span className="text-base font-black text-white font-heading">
                  {previewCalc.isValid ? previewGradePoint.toFixed(1) : '—'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 block">Quality Pts</span>
                <span className="text-base font-black text-emerald-400 font-heading">
                  {previewCalc.isValid ? previewQualityPoints.toFixed(1) : '—'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Remarks / Notes (Optional)
            </label>
            <input
              type="text"
              id="unit-remarks-input"
              placeholder="e.g. Core Major Unit"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
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
              id="save-unit-submit-btn"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingRecord ? 'Update Unit' : 'Save Unit Marks'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
