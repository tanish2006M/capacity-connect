/**
 * Capacity Connect - Public Landing Page
 */

import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { SEED_COURSES, SEED_COMPETENCIES } from '../data/seedData';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Award,
  Layers,
  Sparkles,
  ChevronRight,
  Target,
  ArrowDown,
  UserCheck,
  Check,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { demoLogin } = useAuth();
  const [selectedFeature, setSelectedFeature] = useState<{
    title: string;
    description: string;
    bullets: string[];
    role: string;
  } | null>(null);

  const [activePreviewTab, setActivePreviewTab] = useState<'learning' | 'competency' | 'assessment'>('learning');
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const handleRoleQuickStart = (role: 'trainee' | 'trainer' | 'admin') => {
    demoLogin(role);
    onNavigate(`/${role}`);
  };

  const featureCards = [
    {
      id: 'lms',
      title: 'Learning Management',
      description: 'Structured course and lesson-based learning with modular curriculums, interactive units, and progress checkpoints.',
      bullets: ['Modular chapter hierarchies', 'Multimedia content support', 'Interactive lesson sequencing'],
      role: 'Trainees & Trainers',
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'asm',
      title: 'Assessments',
      description: 'MCQ-based evaluation and performance tracking with instant rubrics, automated evaluation, and time-bound testing.',
      bullets: ['Automated MCQ grading pool', 'Customizable passing thresholds', 'Comprehensive attempt logs'],
      role: 'Trainers & Trainees',
      icon: <FileCheck className="w-5 h-5 text-indigo-600" />,
    },
    {
      id: 'cmp',
      title: 'Competency Mapping',
      description: 'Identify institutional skill benchmarks, pinpoint skill deficits, and dynamically recommend targeted learning paths.',
      bullets: ['Organizational skill matrix', 'Target proficiency scoring', 'Targeted course recommendations'],
      role: 'Admins & Trainees',
      icon: <Target className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'prg',
      title: 'Progress Tracking',
      description: 'Monitor individual and cohort-wide learning, module completion rates, and assessment timelines with tabular precision.',
      bullets: ['Real-time completion percentage', 'Milestone adherence indicators', 'Audit-ready progress ledgers'],
      role: 'All Stakeholders',
      icon: <TrendingUp className="w-5 h-5 text-cyan-600" />,
    },
    {
      id: 'trn',
      title: 'Trainer Management',
      description: 'Equip instructors to author training content, manage resource libraries, evaluate submissions, and mentor trainees.',
      bullets: ['Course creation workflows', 'Cohort progress monitoring', 'Submission & feedback handling'],
      role: 'Trainers & Admins',
      icon: <UserCheck className="w-5 h-5 text-purple-600" />,
    },
    {
      id: 'crt',
      title: 'Digital Certification',
      description: 'Recognize completed learning achievements with tamper-evident, verifiable digital credentials and serial registries.',
      bullets: ['Automated credential issuance', 'Cryptographic verification codes', 'Downloadable completion proof'],
      role: 'Trainees & Admins',
      icon: <Award className="w-5 h-5 text-amber-600" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Header / Navbar */}
      <Navbar onNavigate={onNavigate} activePath="/" />

      {/* 2. Hero Section */}
      <section id="hero" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>Digital Capacity Building & Learning Management</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Build Capability. <br />
                <span className="text-blue-700">Learn. Grow.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                One connected platform for organizational learning, training, assessment, and competency development. Designed for modern capacity building across public institutions and enterprise cohorts.
              </p>

              {/* Primary Action Zone */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('/login')}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="shadow-md shadow-blue-700/10"
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const el = document.querySelector('#platform-preview');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore Platform
                </Button>
              </div>

              {/* Instant Demo Access */}
              <div className="pt-4 border-t border-slate-200/80">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                  Quick Demo Experience
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleRoleQuickStart('trainee')}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-blue-600 hover:text-blue-700 text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>Enter as Trainee</span>
                  </button>
                  <button
                    onClick={() => handleRoleQuickStart('trainer')}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-blue-600 hover:text-blue-700 text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Enter as Trainer</span>
                  </button>
                  <button
                    onClick={() => handleRoleQuickStart('admin')}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-blue-600 hover:text-blue-700 text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Enter as Admin</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Dashboard Simulation */}
            <div id="platform-preview" className="lg:col-span-6">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-6 transition-all">
                {/* Simulated UI Topbar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono text-slate-500 ml-2">capacity-connect.portal</span>
                  </div>

                  {/* Interactive preview tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setActivePreviewTab('learning')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        activePreviewTab === 'learning'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Learning
                    </button>
                    <button
                      onClick={() => setActivePreviewTab('competency')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        activePreviewTab === 'competency'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Competencies
                    </button>
                    <button
                      onClick={() => setActivePreviewTab('assessment')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        activePreviewTab === 'assessment'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Assessments
                    </button>
                  </div>
                </div>

                {/* Tab Content 1: Learning view */}
                {activePreviewTab === 'learning' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-slate-700">Current Program</span>
                        <span className="font-mono tabular-nums text-blue-700 font-bold">72% Completed</span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        Public Service Digital Governance & Cloud Operations
                      </h4>
                      <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
                        <div className="bg-blue-600 h-2 rounded-full w-[72%]" />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                        <span>Module 4 of 6: Cloud Security & Data Governance</span>
                        <span className="font-mono">22/28 Lessons</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl border border-slate-100 bg-white">
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Active Trainees
                        </span>
                        <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                          1,842
                        </div>
                        <span className="text-[11px] text-emerald-700 font-medium">94.2% engagement</span>
                      </div>
                      <div className="p-3.5 rounded-xl border border-slate-100 bg-white">
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Verified Credentials
                        </span>
                        <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                          628
                        </div>
                        <span className="text-[11px] text-blue-700 font-medium">Audit verified</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content 2: Competency view */}
                {activePreviewTab === 'competency' && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="text-xs text-slate-600 mb-2">
                      Competency Matrix Diagnostic · Ananya Mukherjee
                    </div>
                    {SEED_COMPETENCIES.slice(0, 3).map((comp) => (
                      <div key={comp.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/70">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-semibold text-slate-800">{comp.title}</span>
                          <span className="font-mono tabular-nums font-bold text-slate-700">
                            {comp.currentProficiency}% / {comp.targetProficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              comp.gap === 0 ? 'bg-emerald-600' : 'bg-blue-600'
                            }`}
                            style={{ width: `${comp.currentProficiency}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                          <span>Cluster: {comp.cluster}</span>
                          <span>
                            {comp.gap === 0 ? (
                              <strong className="text-emerald-700">Target Reached</strong>
                            ) : (
                              <span className="text-amber-700 font-mono">Gap: {comp.gap}%</span>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab Content 3: Assessment view */}
                {activePreviewTab === 'assessment' && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="text-xs text-slate-600 mb-2">Upcoming Evaluations & Quizzes</div>
                    <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-blue-700 font-medium">MCQ EVALUATION</span>
                        <span className="text-[11px] font-mono text-slate-500">45 Mins · 25 Questions</span>
                      </div>
                      <h5 className="text-sm font-semibold text-slate-900 mt-1">
                        Mid-Term Evaluation: Cloud Readiness & Architecture
                      </h5>
                      <div className="flex items-center justify-between text-xs text-slate-600 mt-3 pt-2 border-t border-blue-200/50">
                        <span>Passing standard: 70%</span>
                        <span className="font-semibold text-blue-700">Due Oct 05, 2026</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-500 font-medium">FINAL EXAM</span>
                        <span className="text-[11px] font-mono text-emerald-700 font-semibold">PASSED (88%)</span>
                      </div>
                      <h5 className="text-sm font-semibold text-slate-900 mt-1">
                        Modern Project Management Certification
                      </h5>
                      <p className="text-xs text-slate-500 mt-1">Certificate #CC-2025-PM-0842 issued</p>
                    </div>
                  </div>
                )}

                {/* Bottom preview footer with active interaction hint */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Real interactive state in dashboard</span>
                  </div>
                  <button
                    onClick={() => handleRoleQuickStart('trainee')}
                    className="text-blue-700 font-medium hover:underline flex items-center gap-1"
                  >
                    <span>Launch Trainee Portal</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trust / Purpose Strip */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Structured Learning</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Modular programs with progressive lesson checkpoints.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Continuous Assessment</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  MCQ evaluation engine with real-time scoring.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Competency Development</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Skill gap identification with recommended courses.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Professional Growth</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Digital certification and institutional capability building.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works (5-step section) */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-slate-50/50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider font-mono">
              Process Architecture
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
              How Capacity Connect Works
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              A 5-step institutional workflow transforming training into measurable organizational capability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs relative">
              <div className="text-2xl font-black font-mono text-blue-700 mb-2">01</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Create Your Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Register organizational credentials, department role, and initial competency baseline.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs relative">
              <div className="text-2xl font-black font-mono text-blue-700 mb-2">02</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Learn & Train</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Engage with structured curriculum modules, instructional videos, and rich resource documents.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs relative">
              <div className="text-2xl font-black font-mono text-blue-700 mb-2">03</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Assess Your Skills</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Undergo rigorous MCQ assessments and practical simulations to benchmark understanding.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs relative">
              <div className="text-2xl font-black font-mono text-blue-700 mb-2">04</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Track Competencies</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visualize skill gaps across clusters, target proficiency metrics, and progress trajectories.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs relative">
              <div className="text-2xl font-black font-mono text-blue-700 mb-2">05</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Grow & Get Certified</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Attain verifiable digital certificates recognized for institutional promotion and readiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Role Section: One Platform. Three Experiences. */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider font-mono">
              Tailored Ecosystem
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
              One Platform. Three Experiences.
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Every participant enters a purpose-built workspace calibrated to their role and responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* TRAINEE CARD */}
            <div className="border border-slate-200/90 rounded-2xl p-6 sm:p-8 bg-slate-50/50 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">TRAINEE</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 mb-6 leading-relaxed">
                  Learn, assess, and build professional capabilities through personalized learning journeys.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-200/80">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Explore Courses</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Track Learning Progress</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Take Assessments & Quizzes</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Build Competencies & Earn Credentials</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/80">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleRoleQuickStart('trainee')}
                  className="w-full justify-center"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  iconPosition="right"
                >
                  Enter Trainee Portal
                </Button>
              </div>
            </div>

            {/* TRAINER CARD */}
            <div className="border border-slate-200/90 rounded-2xl p-6 sm:p-8 bg-slate-50/50 flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-5">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">TRAINER</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 mb-6 leading-relaxed">
                  Create learning experiences and support trainee development with robust evaluation tools.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-200/80">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Create & Organize Courses</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Upload Learning Resources</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Create MCQ Assessments</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Monitor Cohort Performance</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/80">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleRoleQuickStart('trainer')}
                  className="w-full justify-center"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  iconPosition="right"
                >
                  Enter Trainer Workspace
                </Button>
              </div>
            </div>

            {/* ADMIN CARD */}
            <div className="border border-slate-200/90 rounded-2xl p-6 sm:p-8 bg-slate-50/50 flex flex-col justify-between hover:border-slate-400 hover:shadow-md transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">ADMIN</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 mb-6 leading-relaxed">
                  Manage the learning ecosystem and unlock macro organizational insights and compliance.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-200/80">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-slate-900 shrink-0" />
                    <span>Manage Users & Roles</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-slate-900 shrink-0" />
                    <span>Monitor Courses & Approvals</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-slate-900 shrink-0" />
                    <span>View System Analytics</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-slate-900 shrink-0" />
                    <span>Manage Competency Frameworks</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/80">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => handleRoleQuickStart('admin')}
                  className="w-full justify-center"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  iconPosition="right"
                >
                  Enter Admin Overview
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Feature Section (6 polished feature cards) */}
      <section id="features" className="py-16 lg:py-24 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider font-mono">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
              Comprehensive Capacity Building
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Engineered to support the full lifecycle: learning → training → assessments → feedback → competency development → certification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat) => (
              <div
                key={feat.id}
                className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-2xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                    {feat.icon}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mb-1">{feat.role}</div>
                  <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedFeature(feat)}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Specifications</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Competency Section: Turn Learning Into Measurable Capability */}
      <section id="competencies" className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider font-mono">
              Competency Architecture
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
              Turn Learning Into Measurable Capability
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Moving beyond traditional attendance tracking into real, diagnostic competency evolution.
            </p>
          </div>

          {/* Visual flow chart */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-10 mb-12">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center mb-6">
              The Capacity Connect Competency Progression Engine
            </h4>

            {/* Desktop horizontal flow / Mobile vertical stack */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-2xs">
                <span className="text-xs font-mono text-slate-400 block mb-1">STAGE 1</span>
                <span className="text-sm font-bold text-slate-900 block">Current Skills</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Baseline profiling</span>
              </div>

              <div className="hidden md:flex justify-center text-blue-600">
                <ChevronRight className="w-6 h-6" />
              </div>
              <div className="md:hidden flex justify-center text-blue-600 py-1">
                <ArrowDown className="w-5 h-5" />
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-2xs">
                <span className="text-xs font-mono text-slate-400 block mb-1">STAGE 2</span>
                <span className="text-sm font-bold text-slate-900 block">Competency Analysis</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Cluster benchmarking</span>
              </div>

              <div className="hidden md:flex justify-center text-blue-600">
                <ChevronRight className="w-6 h-6" />
              </div>
              <div className="md:hidden flex justify-center text-blue-600 py-1">
                <ArrowDown className="w-5 h-5" />
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-2xs">
                <span className="text-xs font-mono text-slate-400 block mb-1">STAGE 3</span>
                <span className="text-sm font-bold text-slate-900 block">Skill Gaps</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Deficit diagnostics</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mt-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-2xs md:col-start-1">
                <span className="text-xs font-mono text-slate-400 block mb-1">STAGE 4</span>
                <span className="text-sm font-bold text-slate-900 block">Recommended Learning</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Curated course routing</span>
              </div>

              <div className="hidden md:flex justify-center text-blue-600">
                <ChevronRight className="w-6 h-6" />
              </div>
              <div className="md:hidden flex justify-center text-blue-600 py-1">
                <ArrowDown className="w-5 h-5" />
              </div>

              <div className="bg-blue-700 text-white rounded-xl p-4 text-center shadow-xs">
                <span className="text-xs font-mono text-blue-200 block mb-1">OUTCOME</span>
                <span className="text-sm font-bold text-white block">Improved Capability</span>
                <span className="text-[11px] text-blue-100 mt-1 block">Certified readiness</span>
              </div>
            </div>
          </div>

          {/* Featured Courses Showcase */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Featured Capacity Curriculums</h3>
                <p className="text-xs text-slate-500">Seed programs mapped to the institutional competency framework</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('/login')}
              >
                View Catalog
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SEED_COURSES.slice(0, 3).map((course) => (
                <div key={course.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-mono text-slate-700">{course.code}</span>
                      <span className="text-blue-700 font-medium">{course.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{course.title}</h4>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{course.tagline}</p>

                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                      {course.skillsCovered.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-mono">{course.durationHours} Hours</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRoleQuickStart('trainee')}
                      className="text-xs text-blue-700"
                    >
                      Explore & Enroll
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-16 lg:py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-900/60 border border-blue-700/60 text-blue-200 text-xs font-mono">
            <span>Digital Capacity Building Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ready to build stronger capabilities?
          </h2>

          <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Connect learning, training and competency development in one unified digital platform.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('/signup')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Enter Capacity Connect
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('/login')}
              className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white"
            >
              Sign In to Existing Account
            </Button>
          </div>
        </div>
      </section>

      {/* 9. Public Footer */}
      <Footer
        onNavigate={onNavigate}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenContact={() => setContactModalOpen(true)}
      />

      {/* Feature Specification Modal */}
      {selectedFeature && (
        <Modal
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
          title={selectedFeature.title}
          subtitle={`Functional Scope: ${selectedFeature.role}`}
          maxWidth="md"
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedFeature(null)}>
              Close Specifications
            </Button>
          }
        >
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {selectedFeature.description}
            </p>
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Planned Functional Deliverables
              </h5>
              <ul className="space-y-2">
                {selectedFeature.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              This module will be deeply expanded in subsequent stages of the portal build.
            </div>
          </div>
        </Modal>
      )}

      {/* About Modal */}
      <Modal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        title="About Capacity Connect"
        subtitle="Digital Capacity Building & Learning Management Portal"
        maxWidth="md"
        footer={
          <Button variant="primary" size="sm" onClick={() => setAboutModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            <strong>CAPACITY CONNECT</strong> is a Digital Capacity Building & Learning Management Portal designed to provide a centralized digital environment for trainees, trainers, and administrators.
          </p>
          <p>
            The platform addresses the need for a unified digital environment connecting trainees, trainers, and administrators across government departments, academic faculties, and organizational cohorts.
          </p>
          <p>
            The project architecture is built from scratch with clean TypeScript, React, and modular system boundaries supporting continuous learning, assessments, and competency analytics.
          </p>
        </div>
      </Modal>

      {/* Contact & Support Modal */}
      <Modal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title="Contact & Technical Support"
        subtitle="Portal Support Team"
        maxWidth="md"
        footer={
          <Button variant="primary" size="sm" onClick={() => setContactModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            For inquiries regarding the Capacity Connect architecture, deployment guidelines, or platform walkthrough:
          </p>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-xs text-slate-800">
            <div>Support Portal: support@capacityconnect.demo</div>
            <div>Information Desk: desk@capacityconnect.demo</div>
            <div>Cohort Hours: 09:00 - 18:00 IST (Mon - Fri)</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
