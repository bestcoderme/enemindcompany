/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../types/user';
import { MentorService } from '../../services/mentorship/mentorService';
import { TeacherService } from '../../services/mentorship/teacherService';
import { CurrencyCode, SessionFormat } from '../../types/mentorship';
import {
  X,
  Sparkles,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Clock,
  Globe,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

interface BecomeMentorTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onProfileSubmitted: (role: UserRole) => void;
}

export const BecomeMentorTeacherModal: React.FC<BecomeMentorTeacherModalProps> = ({
  isOpen,
  onClose,
  user,
  onProfileSubmitted,
}) => {
  const [selectedRole, setSelectedRole] = useState<'MENTOR' | 'TEACHER'>('MENTOR');
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [yearsExperience, setYearsExperience] = useState('5');
  const [education, setEducation] = useState(user.university?.name ? `B.Sc. at ${user.university.name}` : '');
  const [country, setCountry] = useState(user.country || 'Kenya');
  const [timezone, setTimezone] = useState('Africa/Nairobi');
  const [languagesInput, setLanguagesInput] = useState('English, Swahili');

  // Skills & Expertise
  const [skillsInput, setSkillsInput] = useState('Python, System Design, SQL');
  const [expertiseInput, setExpertiseInput] = useState('Cloud Architecture, Backend APIs, Career Coaching');
  const [subjectsInput, setSubjectsInput] = useState('Distributed Databases, Algorithms, Web Development');

  // Certifications & Verification proof
  const [certificationsInput, setCertificationsInput] = useState('AWS Certified Solutions Architect, Google Professional');
  const [verificationProof, setVerificationProof] = useState('https://linkedin.com/in/my-profile or Certificate Link');

  // Pricing & Availability
  const [pricingModel, setPricingModel] = useState<'FREE' | 'FIXED_PRICE'>('FREE');
  const [priceAmount, setPriceAmount] = useState('300');
  const [currency, setCurrency] = useState<CurrencyCode>('KES');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Wednesday', 'Friday']);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [sessionDuration, setSessionDuration] = useState('45');

  // Agreement
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      setErrorMsg('Please accept the Provider Quality and Safety Agreement.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
      const languages = languagesInput.split(',').map((l) => l.trim()).filter(Boolean);
      const certifications = certificationsInput.split(',').map((c) => c.trim()).filter(Boolean);
      const expertise = expertiseInput.split(',').map((e) => e.trim()).filter(Boolean);
      const subjects = subjectsInput.split(',').map((s) => s.trim()).filter(Boolean);

      const availability = {
        days: selectedDays,
        startTime,
        endTime,
        timezone,
        sessionDuration: parseInt(sessionDuration) || 45,
        breakDuration: 15,
        blockedDates: [],
        vacationDates: [],
        recurringAvailability: true,
      };

      const pricing = {
        model: pricingModel,
        amount: pricingModel === 'FREE' ? 0 : parseFloat(priceAmount) || 0,
        currency,
      };

      if (selectedRole === 'MENTOR') {
        MentorService.createMentorProfile({
          userId: user.email || 'user_custom',
          name: user.name || 'Professional Mentor',
          headline: headline || 'Industry Professional & Career Mentor',
          bio: bio || 'Helping university students bridge the gap to top industry roles.',
          expertise,
          skills,
          industries: ['Technology', 'Engineering', 'FinTech'],
          careerAreas: ['Software Engineering', 'Data Science', 'Product Design'],
          yearsExperience: parseInt(yearsExperience) || 3,
          education: education || 'Bachelor Degree',
          certifications,
          languages,
          country,
          location: `${country} / Remote`,
          timezone,
          sessionTypes: ['ONE_ON_ONE', 'CV_REVIEW', 'INTERVIEW_PREPARATION'],
          pricing,
          availability,
          profilePhoto: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          verificationStatus: 'PENDING',
          verificationNotes: `Proof provided: ${verificationProof}`,
        });
        onProfileSubmitted('MENTOR');
      } else {
        TeacherService.createTeacherProfile({
          userId: user.email || 'user_custom',
          name: user.name || 'Skill Teacher',
          headline: headline || 'Technical Instructor & Skill Coach',
          bio: bio || 'Hands-on practical instructor delivering curriculum-aligned coding & engineering lessons.',
          subjects,
          skills,
          teachingAreas: ['Computer Science', 'Data Engineering', 'Applied Tech'],
          experience: `${yearsExperience} years teaching & practical engineering`,
          education: education || 'Bachelor Degree',
          certifications,
          languages,
          teachingFormats: ['SKILL_LESSON', 'GROUP', 'ONE_ON_ONE'],
          pricing,
          availability,
          profilePhoto: user.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
          verificationStatus: 'PENDING',
          verificationNotes: `Proof provided: ${verificationProof}`,
        });
        onProfileSubmitted('TEACHER');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-100 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                Phase 5 Provider Studio
              </span>
              <span className="text-xs text-neutral-400">· Global Teaching Network</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-heading">
              {isSubmitted
                ? 'Application Submitted for Review!'
                : selectedRole === 'MENTOR'
                ? 'Become an ENEMIND Mentor'
                : 'Become a Skill Teacher'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Share your industry expertise, mentor emerging students, and build an income stream.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Your Provider Profile is Pending Review</h3>
            <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
              Our administrator team is reviewing your professional qualifications. You can immediately access your
              Provider Studio workspace to manage session offerings and preview your calendar.
            </p>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs space-y-1 max-w-md mx-auto">
              <div className="flex justify-between font-semibold text-neutral-800">
                <span>Role Registered:</span>
                <span className="text-emerald-700">{selectedRole}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Status:</span>
                <span className="font-bold text-amber-600">PENDING ADMIN VERIFICATION</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Verification Badge:</span>
                <span>Issued upon approval</span>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 shadow-sm"
              >
                Go to Provider Studio
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Role Selection & Professional Headline */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-2">Select Your Primary Focus</label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole('MENTOR')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedRole === 'MENTOR'
                      ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <Briefcase
                    className={`w-5 h-5 mb-2 ${selectedRole === 'MENTOR' ? 'text-emerald-600' : 'text-neutral-400'}`}
                  />
                  <h4 className="text-xs font-bold text-neutral-900">Industry Mentor</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    1-on-1 career advisories, CV & portfolio reviews, mock interviews.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('TEACHER')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedRole === 'TEACHER'
                      ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <GraduationCap
                    className={`w-5 h-5 mb-2 ${selectedRole === 'TEACHER' ? 'text-emerald-600' : 'text-neutral-400'}`}
                  />
                  <h4 className="text-xs font-bold text-neutral-900">Skill Teacher</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Curriculum classes, group masterclasses, practical coding lessons.
                  </p>
                </button>
              </div>
            </div>

            {/* General Info */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-800 block mb-1">
                  Professional Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Software Architect @ AWS | Microservices & Cloud Mentor"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">
                  Bio & Approach <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your background, who you love guiding, and what students gain from your sessions..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-800 block mb-1">
                    Skills Taught / Mentored (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Python, Kubernetes, System Design, SQL"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">Years of Industry/Teaching Experience</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-800 block mb-1">Education & Degrees</label>
                  <input
                    type="text"
                    placeholder="B.Sc. Computer Science (UoN)"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">Certifications</label>
                  <input
                    type="text"
                    placeholder="AWS Solutions Architect, Oracle OCP"
                    value={certificationsInput}
                    onChange={(e) => setCertificationsInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Verification Link */}
              <div>
                <label className="font-bold text-neutral-800 block mb-1">
                  Verification Proof / LinkedIn URL / Portfolio <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://linkedin.com/in/... or professional certificate link"
                  value={verificationProof}
                  onChange={(e) => setVerificationProof(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Our admin team verifies genuine credentials before assigning the "Verified Provider" shield.
                </p>
              </div>

              {/* Pricing & Availability */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <h4 className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Session Pricing & Default Availability</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Pricing Model</label>
                    <select
                      value={pricingModel}
                      onChange={(e) => setPricingModel(e.target.value as any)}
                      className="w-full p-2 rounded-xl bg-white border border-neutral-200 font-medium"
                    >
                      <option value="FREE">Free / Volunteer</option>
                      <option value="FIXED_PRICE">Fixed Price per Session</option>
                    </select>
                  </div>

                  {pricingModel === 'FIXED_PRICE' && (
                    <>
                      <div>
                        <label className="font-semibold text-neutral-700 block mb-1">Fee Amount</label>
                        <input
                          type="number"
                          min="0"
                          value={priceAmount}
                          onChange={(e) => setPriceAmount(e.target.value)}
                          className="w-full p-2 rounded-xl bg-white border border-neutral-200 font-medium"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-neutral-700 block mb-1">Currency</label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value as any)}
                          className="w-full p-2 rounded-xl bg-white border border-neutral-200 font-medium"
                        >
                          <option value="KES">KES (Kenya Shillings)</option>
                          <option value="USD">USD (US Dollars)</option>
                          <option value="EUR">EUR (Euros)</option>
                          <option value="GBP">GBP (British Pounds)</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1.5">Weekly Working Days</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                          selectedDays.includes(day)
                            ? 'bg-neutral-900 text-white'
                            : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-1.5 rounded-lg bg-white border border-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-1.5 rounded-lg bg-white border border-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full p-1.5 rounded-lg bg-white border border-neutral-200"
                    >
                      <option value="Africa/Nairobi">Nairobi (EAT)</option>
                      <option value="Europe/London">London (GMT/BST)</option>
                      <option value="America/New_York">New York (EST)</option>
                      <option value="UTC">UTC Universal</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quality & Safety Agreement */}
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="agree_terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="agree_terms" className="text-[11px] text-emerald-950 font-medium leading-relaxed">
                  I agree to ENEMIND's Quality & Student Safety Charter. I understand that all credentials will be verified
                  by administrators, sessions take place in accordance with our safety guidelines, and platform commission (10%)
                  applies to paid bookings.
                </label>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isSubmitting ? 'Submitting Application...' : 'Submit for Verification'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
