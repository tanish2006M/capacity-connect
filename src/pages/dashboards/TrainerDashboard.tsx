/**
 * Capacity Connect - Trainer Dashboard
 * Route: /trainer
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { SEED_COURSES, SEED_ASSESSMENTS } from '../../data/seedData';
import { Course } from '../../types';
import {
  BookOpen,
  Users,
  FileCheck,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  Sparkles,
  Calendar,
  AlertCircle,
  FileText,
  BarChart2,
  ExternalLink,
} from 'lucide-react';

interface TrainerDashboardProps {
  onNavigate: (path: string) => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showSuccess, showInfo } = useToast();

  const [createCourseModalOpen, setCreateCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Filter courses taught by trainer
  const trainerCourses = SEED_COURSES.filter((c) => c.trainerId === 'usr_trainer_002');
  const totalTrainees = trainerCourses.reduce((acc, c) => acc + c.enrolledCount, 0);

  const recentTraineeActivity = [
    {
      id: 'act_01',
      traineeName: 'Ananya Mukherjee',
      action: 'Submitted Quiz Evaluation',
      course: 'Digital Governance & Cloud Operations',
      score: '46/50 (92%)',
      timestamp: '25 mins ago',
      status: 'evaluated',
    },
    {
      id: 'act_02',
      traineeName: 'Devendra Rathore',
      action: 'Completed Module 3',
      course: 'Enterprise Cybersecurity Essentials',
      score: '100%',
      timestamp: '1 hour ago',
      status: 'completed',
    },
    {
      id: 'act_03',
      traineeName: 'Sanjay Deshmukh',
      action: 'Submitted Assessment for Grading',
      course: 'Digital Governance & Cloud Operations',
      score: 'Pending Review',
      timestamp: '3 hours ago',
      status: 'pending',
    },
    {
      id: 'act_04',
      traineeName: 'Priya Nambiar',
      action: 'Enrolled in Program',
      course: 'Enterprise Cybersecurity Essentials',
      score: 'New Cohort',
      timestamp: 'Yesterday',
      status: 'enrolled',
    },
  ];

  const upcomingDeadlines = [
    {
      id: 'dl_01',
      title: 'Q4 Mid-Term Assessment Final Submission Window',
      course: 'Digital Governance & Cloud Operations',
      date: 'Oct 05, 2026',
      traineesPending: 18,
    },
    {
      id: 'dl_02',
      title: 'Practical Threat Simulation Evaluation',
      course: 'Enterprise Cybersecurity Essentials',
      date: 'Oct 12, 2026',
      traineesPending: 42,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Trainer Workspace"
        description={`Faculty Lead: ${user?.fullName || 'Senior Faculty'} · ${user?.organization || 'Public Sector Faculty'}`}
        tag={
          <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            Instructor Console
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/trainer/library')}
              icon={<FileText className="w-3.5 h-3.5" />}
            >
              Content Library
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCreateCourseModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              New Curriculum
            </Button>
          </div>
        }
      />

      {/* Demo Banner */}
      <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80 flex items-center justify-between text-xs text-indigo-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-700 shrink-0" />
          <span>
            <strong>Trainer Workspace:</strong> Access course curriculum builder, submission evaluation ledger, and cohort performance telemetry.
          </span>
        </div>
        <button
          onClick={() => onNavigate('/trainer/trainees')}
          className="text-indigo-700 font-semibold hover:underline hidden sm:inline"
        >
          View All Trainees ({totalTrainees}) →
        </button>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Courses"
          value={trainerCourses.length}
          subtext="All syllabi published"
          icon={<BookOpen className="w-5 h-5 text-indigo-700" />}
          iconBgColor="bg-indigo-50"
          onClick={() => onNavigate('/trainer/courses')}
        />
        <StatCard
          label="Total Trainees"
          value={totalTrainees}
          subtext="+86 enrolled this month"
          trend={{ value: '+86', direction: 'up' }}
          icon={<Users className="w-5 h-5 text-blue-700" />}
          iconBgColor="bg-blue-50"
          onClick={() => onNavigate('/trainer/trainees')}
        />
        <StatCard
          label="MCQ Assessments"
          value={SEED_ASSESSMENTS.length}
          subtext="2 active testing windows"
          icon={<FileCheck className="w-5 h-5 text-amber-700" />}
          iconBgColor="bg-amber-50"
          onClick={() => onNavigate('/trainer/assessments')}
        />
        <StatCard
          label="Completion Rate"
          value="84.6%"
          subtext="Exceeds 75% benchmark"
          trend={{ value: '+3.2%', direction: 'up' }}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-700" />}
          iconBgColor="bg-emerald-50"
          onClick={() => onNavigate('/trainer/performance')}
        />
      </div>

      {/* Main Grid: My Courses + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: My Courses */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">My Instructed Courses</h3>
                <p className="text-xs text-slate-500">Live programs under your faculty supervision</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('/trainer/courses')}
                className="text-xs"
              >
                Manage All
              </Button>
            </div>

            <div className="space-y-3">
              {trainerCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-mono font-semibold text-slate-700">{course.code}</span>
                      <span className="text-slate-300">·</span>
                      <span>{course.category}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-mono text-indigo-700 font-medium">{course.durationHours} Hours</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate">{course.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                      <span>{course.enrolledCount} active trainees</span>
                      <span className="text-slate-300">·</span>
                      <span>{course.modulesCount} modules</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-emerald-700 font-medium">Rating: {course.rating}/5.0</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCourse(course)}
                    >
                      Syllabus
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        showInfo('Trainee Cohort View', `Opening student roster for ${course.code}`);
                        onNavigate('/trainer/trainees');
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      View Cohort
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Overview Matrix */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Cohort Score Distribution</h3>
                <p className="text-xs text-slate-500">Aggregated performance across 2026 assessments</p>
              </div>
              <span className="text-xs font-mono text-slate-500">Total Attempts: 758</span>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <span className="text-xs text-emerald-800 font-medium block">Distinction (90%+)</span>
                <span className="text-lg font-bold font-mono text-emerald-900 mt-1 block">38.2%</span>
                <span className="text-[11px] text-emerald-700 font-mono">290 trainees</span>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <span className="text-xs text-blue-800 font-medium block">Merit (75-89%)</span>
                <span className="text-lg font-bold font-mono text-blue-900 mt-1 block">46.4%</span>
                <span className="text-[11px] text-blue-700 font-mono">352 trainees</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <span className="text-xs text-amber-800 font-medium block">Pass (60-74%)</span>
                <span className="text-lg font-bold font-mono text-amber-900 mt-1 block">11.8%</span>
                <span className="text-[11px] text-amber-700 font-mono">89 trainees</span>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                <span className="text-xs text-rose-800 font-medium block">Remedial (&lt;60%)</span>
                <span className="text-lg font-bold font-mono text-rose-900 mt-1 block">3.6%</span>
                <span className="text-[11px] text-rose-700 font-mono">27 trainees</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Trainee Activity & Deadlines */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Activity */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Recent Trainee Submissions</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentTraineeActivity.map((act) => (
                <div key={act.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{act.traineeName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{act.action}</p>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400 truncate max-w-[150px]">{act.course}</span>
                    <span className="font-mono font-semibold text-slate-800">{act.score}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('/trainer/trainees')}
                className="w-full justify-center text-xs"
              >
                View Complete Activity Ledger
              </Button>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Upcoming Deadlines</h3>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.map((dl) => (
                <div key={dl.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-semibold text-indigo-700">{dl.date}</span>
                    <span className="font-mono text-amber-700">{dl.traineesPending} Pending</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">{dl.title}</h5>
                  <p className="text-[11px] text-slate-500 mt-1">{dl.course}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Course Modal */}
      <Modal
        isOpen={createCourseModalOpen}
        onClose={() => setCreateCourseModalOpen(false)}
        title="Draft New Capacity Program"
        subtitle="Stage 2 Curriculum Authoring Pipeline"
        maxWidth="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setCreateCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                showSuccess('Curriculum Blueprint Saved', 'Course draft initialized in repository.');
                setCreateCourseModalOpen(false);
              }}
            >
              Initialize Blueprint
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-slate-700">
          <p>
            The full interactive lesson builder and video transcoder will be unlocked in <strong>Stage 2 (Course Creation & Content Engine)</strong>.
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div>
              <label className="block font-semibold mb-1">Course Title</label>
              <input
                type="text"
                placeholder="e.g. Modern Public Governance Frameworks"
                className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
                defaultValue="Advanced Citizen Services Architecture"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Target Competency Cluster</label>
              <select className="w-full p-2 bg-white border border-slate-200 rounded text-xs">
                <option>Technical Capability & Cloud</option>
                <option>Information Security & Risk</option>
                <option>Public Policy & Governance</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Syllabus Modal */}
      {selectedCourse && (
        <Modal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={`${selectedCourse.code}: ${selectedCourse.title}`}
          subtitle={`${selectedCourse.durationHours} Hours · ${selectedCourse.modulesCount} Modules · ${selectedCourse.enrolledCount} Trainees`}
          maxWidth="md"
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedCourse(null)}>
              Done
            </Button>
          }
        >
          <div className="space-y-3 text-xs text-slate-700">
            <p>{selectedCourse.description}</p>
            <h5 className="font-semibold uppercase text-slate-500 pt-2">Mapped Skills</h5>
            <div className="flex flex-wrap gap-1">
              {selectedCourse.skillsCovered.map((s, idx) => (
                <span key={idx} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
