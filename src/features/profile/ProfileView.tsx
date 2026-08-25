import React from 'react';
import { UserProfile, UserRole } from '../../types';
import { Badge } from '../../components/common/Badge';
import { User, Mail, Phone, GraduationCap, Building2, BookOpen, Award, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { mpesaService } from '../../services/mpesaService';

interface ProfileViewProps {
  user: UserProfile | null;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenCompleteProfile: () => void;
  onOpenPaymentModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  activeRole,
  onRoleChange,
  onOpenCompleteProfile,
  onOpenPaymentModal,
}) => {
  const trialDetails = mpesaService.getTrialDetails(user?.subscription);
  const ALL_ROLES: { role: UserRole; label: string; desc: string }[] = [
    { role: 'STUDENT', label: 'University Student', desc: 'Browse notes, track marks, calculate GPA & find attachments' },
    { role: 'MENTOR', label: 'Industry Mentor', desc: 'Host 1-on-1 guidance sessions & review portfolios' },
    { role: 'TEACHER', label: 'Skill Instructor', desc: 'Create live classes & share specialized coursework' },
    { role: 'SELLER', label: 'Student Entrepreneur', desc: 'Sell services & publish Google Sheet automations' },
    { role: 'PROFESSIONAL', label: 'Working Professional', desc: 'Share opportunities & connect with upcoming talent' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 font-heading">
                {user?.name || 'Enemind User'}
              </h1>
              <Badge variant="emerald">{activeRole}</Badge>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{user?.email}</p>
            <p className="text-xs text-neutral-600 font-semibold mt-1">
              {user?.university?.name || 'Institutional Network'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCompleteProfile}
          className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all active:scale-95"
        >
          Edit Profile Details
        </button>
      </div>

      {/* Persona / Multi-Role Selector */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs">
        <h3 className="text-sm font-bold text-neutral-900 font-heading mb-1">
          Active Platform Persona & Roles
        </h3>
        <p className="text-xs text-neutral-500 mb-4">
          Enemind accounts can have multiple capabilities simultaneously. Select your active perspective:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALL_ROLES.map(({ role, label, desc }) => {
            const isSelected = activeRole === role;

            return (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 ring-2 ring-emerald-500 shadow-xs'
                    : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold font-heading">{label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Academic Details Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Academic Information
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[11px] text-neutral-400 block font-medium">Institution</span>
              <span className="font-semibold text-neutral-800">{user?.university?.name || 'Not set'}</span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block font-medium">Campus</span>
              <span className="font-semibold text-neutral-800">{user?.campus || 'Main Campus'}</span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block font-medium">Programme</span>
              <span className="font-semibold text-neutral-800">{user?.course?.name || 'Not set'}</span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block font-medium">Admission No.</span>
              <span className="font-semibold text-neutral-800">{user?.studentIdNumber || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Subscription & Account Health */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Subscription & Passes
              </h4>
            </div>
            <Badge variant={trialDetails.isPaid ? 'emerald' : 'amber'}>
              {trialDetails.isPaid ? 'Full Access' : `${trialDetails.daysLeft} Days Trial`}
            </Badge>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed">
            {trialDetails.isPaid
              ? 'Your account has unlocked full access to all revision materials, past papers, hostel wardens, and automation marketplace.'
              : 'You are enjoying a 7-day free trial. Activate your full academic pass to keep permanent access.'}
          </p>

          {!trialDetails.isPaid && (
            <button
              onClick={onOpenPaymentModal}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unlock Pass via M-PESA (KSh 200)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
