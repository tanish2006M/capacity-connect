/**
 * Capacity Connect - Main Application Entry & Router
 * "CAPACITY CONNECT – A Digital Capacity Building and Learning Management Portal"
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LearningProvider } from './context/LearningContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { TraineeDashboard } from './pages/dashboards/TraineeDashboard';
import { TrainerDashboard } from './pages/dashboards/TrainerDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { CourseCataloguePage } from './pages/trainee/CourseCataloguePage';
import { MyLearningPage } from './pages/trainee/MyLearningPage';
import { CoursePlayerPage } from './pages/trainee/CoursePlayerPage';
import { TraineeAssessmentsPage } from './pages/trainee/assessment/TraineeAssessmentsPage';
import { AssessmentRunnerPage } from './pages/trainee/assessment/AssessmentRunnerPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ModulePlaceholderPage } from './components/layout/ModulePlaceholderPage';
import { Role } from './types';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname + window.location.search || '/';
  });

  // Check if a path is public
  const isPublicRoute = (path: string): boolean => {
    const pathname = path.split('?')[0].split('#')[0];
    return pathname === '/' || pathname === '' || pathname === '/login' || pathname === '/signup';
  };

  // Immediate redirect for unauthenticated users accessing protected paths
  useEffect(() => {
    if (!isAuthenticated && !isPublicRoute(currentPath)) {
      window.history.replaceState({}, '', '/login');
      setCurrentPath('/login');
    }
  }, [isAuthenticated, currentPath]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Dispatcher
  const renderRoute = () => {
    const [pathname, search] = currentPath.split('?');
    const queryParams = new URLSearchParams(search || '');

    // 1. Public Landing Page
    if (pathname === '/' || pathname === '') {
      return <LandingPage onNavigate={navigate} />;
    }

    // 2. Authentication Routes
    if (pathname === '/login') {
      return <LoginPage onNavigate={navigate} />;
    }

    if (pathname === '/signup') {
      return <SignupPage onNavigate={navigate} />;
    }

    // ==============================================================
    // MANDATORY AUTHENTICATION GUARD
    // All routes below require an active authenticated user session.
    // Unauthenticated attempts are immediately intercepted without flashing.
    // ==============================================================
    if (!isAuthenticated || !user) {
      return (
        <LoginPage
          onNavigate={navigate}
          redirectNotice="Authentication required. Please sign in to access that protected portal resource."
        />
      );
    }

    // 3. Primary Role Dashboards
    if (pathname === '/trainee') {
      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate} requiredRole="trainee">
          <TraineeDashboard onNavigate={navigate} />
        </DashboardLayout>
      );
    }

    if (pathname === '/trainer') {
      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate} requiredRole="trainer">
          <TrainerDashboard onNavigate={navigate} />
        </DashboardLayout>
      );
    }

    if (pathname === '/admin') {
      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate} requiredRole="admin">
          <AdminDashboard onNavigate={navigate} />
        </DashboardLayout>
      );
    }

    // 4. Trainee Learning & Course Workflows (Real Functional Implementation)
    // 4a. Course Catalogue
    if (pathname === '/trainee/courses') {
      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate} requiredRole="trainee">
          <CourseCataloguePage
            onNavigate={navigate}
            onSelectCourse={(courseId, lessonId) => {
              const q = lessonId ? `&lesson=${lessonId}` : '';
              navigate(`/trainee/learning?course=${courseId}${q}`);
            }}
          />
        </DashboardLayout>
      );
    }

    // 4b. Direct Course Detail / Player
    if (pathname.startsWith('/trainee/courses/')) {
      const courseId = pathname.replace('/trainee/courses/', '');
      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate} requiredRole="trainee">
          <CoursePlayerPage
            courseId={courseId}
            initialLessonId={queryParams.get('lesson') || undefined}
            onNavigate={navigate}
          />
        </DashboardLayout>
      );
    }

    // 4c. My Learning & Interactive Lesson Viewer
    if (pathname === '/trainee/learning') {
      const selectedCourseId = queryParams.get('course');
      const selectedLessonId = queryParams.get('lesson') || undefined;

      if (selectedCourseId) {
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={navigate} requiredRole="trainee">
            <CoursePlayerPage
              courseId={selectedCourseId}
              initialLessonId={selectedLessonId}
              onNavigate={navigate}
            />
          </DashboardLayout>
        );
      }

      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate} requiredRole="trainee">
          <MyLearningPage
            onNavigate={navigate}
            onSelectCourse={(cId, lId) => {
              const q = lId ? `&lesson=${lId}` : '';
              navigate(`/trainee/learning?course=${cId}${q}`);
            }}
          />
        </DashboardLayout>
      );
    }

    // 4d. Direct Learning Route: /trainee/learning/:courseId
    if (pathname.startsWith('/trainee/learning/')) {
      const courseId = pathname.replace('/trainee/learning/', '');
      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate} requiredRole="trainee">
          <CoursePlayerPage
            courseId={courseId}
            initialLessonId={queryParams.get('lesson') || undefined}
            onNavigate={navigate}
          />
        </DashboardLayout>
      );
    }

    // 4e. Trainee Assessments Hub & Runner
    if (pathname === '/trainee/assessments' || pathname.startsWith('/trainee/assessments?')) {
      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate} requiredRole="trainee">
          <TraineeAssessmentsPage currentPath={currentPath} onNavigate={navigate} />
        </DashboardLayout>
      );
    }

    if (pathname.startsWith('/trainee/assessments/')) {
      const assessmentId = pathname.replace('/trainee/assessments/', '');
      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate} requiredRole="trainee">
          <AssessmentRunnerPage assessmentId={assessmentId} onNavigate={navigate} />
        </DashboardLayout>
      );
    }

    // 4f. Other Trainee Subroutes (Placeholders)
    if (pathname.startsWith('/trainee/')) {
      const sub = pathname.replace('/trainee/', '');
      const traineeSubMap: Record<string, { title: string; desc: string; items: string[] }> = {
        profile: {
          title: 'My Profile & Departmental Record',
          desc: 'View and update your official designation, administrative unit, employee ID, and historical learning transcripts.',
          items: [
            'Official departmental designation and posting verification',
            'Competency diagnostic transcripts and assessment scores',
            'Registered contact credentials and security preferences',
            'Cohort membership and assigned senior trainer details',
          ],
        },
        assessments: {
          title: 'Assessments & Evaluation Engine',
          desc: 'Take timed MCQ examinations, review graded attempts, and track passing benchmark scores.',
          items: [
            'Automated MCQ assessment engine with randomized question sets',
            'Real-time timer and autosave answer buffer',
            'Instant objective scoring and granular rubric explanations',
            'Historical attempt ledger with competency gap impacts',
          ],
        },
        competencies: {
          title: 'Competency Mapping & Diagnostics',
          desc: 'Interactive visualization of your institutional capabilities, proficiency benchmarks, and targeted growth trajectories.',
          items: [
            'Cluster-based proficiency radar (0 to 100 benchmark)',
            'Automated skill gap detection engine',
            'Targeted course recommendation routing',
            'Progress comparison against national cohort standards',
          ],
        },
        certificates: {
          title: 'Digital Certificates & Credentials',
          desc: 'Access, download, and verify your cryptographically signed certificates of capacity building.',
          items: [
            'Downloadable high-resolution digital certificate (PDF)',
            'Cryptographic verification code & public verification endpoint',
            'Direct export to national administrative employee profiles',
            'Tamper-evident verification registry matching platform security standards',
          ],
        },
        notifications: {
          title: 'Trainee Notifications & Alerts',
          desc: 'Timely reminders for upcoming assessment deadlines, course updates, and official circulars.',
          items: [
            'Assessment submission deadline countdown alerts',
            'New course material and lecture release notifications',
            'Trainer feedback and graded attempt advisories',
            'Official portal circulars and policy alerts',
          ],
        },
      };

      const meta = traineeSubMap[sub] || {
        title: 'Trainee Module',
        desc: 'Advanced capacity management interface.',
        items: ['Modular functionality coming in Stage 2'],
      };

      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate} requiredRole="trainee">
          <ModulePlaceholderPage
            title={meta.title}
            category="Trainee Experience"
            stageName="Stage 2 (Assessment & Content Engine)"
            description={meta.desc}
            upcomingDeliverables={meta.items}
            onNavigate={navigate}
          />
        </DashboardLayout>
      );
    }

    // 5. Trainer Subroutes (Polished Stage 2 Placeholders)
    if (pathname.startsWith('/trainer/')) {
      const sub = pathname.replace('/trainer/', '').split('/')[0];
      const trainerSubMap: Record<string, { title: string; desc: string; items: string[] }> = {
        profile: {
          title: 'Faculty Profile & Credentials',
          desc: 'Manage your instructor credentials, departmental faculty accreditation, and teaching portfolio.',
          items: [
            'Faculty accreditation and discipline expertise listing',
            'Course instruction history and aggregate trainee ratings',
            'Office hours and cohort advisory schedule',
            'Institutional authority verification badges',
          ],
        },
        courses: {
          title: 'Course Curriculum Management',
          desc: 'Author, structure, and publish courses with lessons, quizzes, and multimedia resources.',
          items: [
            'Drag-and-drop module and chapter builder',
            'Rich-text lecture editor with video embed support',
            'Prerequisite skill tagging and competency alignment',
            'Draft, review, and publication status lifecycle',
          ],
        },
        library: {
          title: 'Content Library & Resource Repository',
          desc: 'Centralized repository of teaching materials, PDFs, slides, policy briefs, and regulatory documents.',
          items: [
            'Multi-format file uploader (PDF, DOCX, PPTX, MP4)',
            'File versioning and cohort access permission management',
            'Resource tagging by competency cluster',
            'Trainee resource download tracking analytics',
          ],
        },
        assessments: {
          title: 'MCQ Assessment Creator & Rubrics',
          desc: 'Author MCQ question pools, set passing thresholds, and schedule testing windows.',
          items: [
            'Multiple choice question authoring with explanations',
            'Difficulty tier configuration and point weighting',
            'Assessment scheduling with automatic open/close windows',
            'Customizable pass percentage and attempt policies',
          ],
        },
        questionnaires: {
          title: 'Questionnaires & Competency Assessments',
          desc: 'Author structured diagnostic questionnaires, feedback surveys, and knowledge checks.',
          items: [
            'Modular questionnaire authoring and rubric tagging',
            'Automated response aggregation and analytics',
            'Feedback survey scheduling across trainee cohorts',
            'Question bank taxonomy alignment',
          ],
        },
        trainees: {
          title: 'Trainee Cohort Roster & Submissions',
          desc: 'Monitor enrolled trainees, track module completion adherence, and review quiz submissions.',
          items: [
            'Searchable trainee roster with progress percentages',
            'Individualized trainee performance drilldowns',
            'Automated alerts for trainees falling behind milestones',
            'Direct feedback and mentoring comments workflow',
          ],
        },
        participation: {
          title: 'Trainee Cohort Participation & Engagement',
          desc: 'Track participation rates, attendance benchmarks, module completion metrics, and cohort engagement.',
          items: [
            'Cohort attendance and participation rate monitoring',
            'Weekly activity adherence tracking',
            'Individualized participation milestone indicators',
            'Exportable departmental engagement reports',
          ],
        },
        performance: {
          title: 'Cohort Performance Analytics',
          desc: 'Comprehensive statistical breakdowns of assessment scores, pass rates, and competency improvements.',
          items: [
            'Score distribution histograms and median calculations',
            'Item analysis to identify challenging questions',
            'Cohort competency pre-test vs post-test delta',
            'Exportable departmental evaluation reports (CSV / PDF)',
          ],
        },
        notifications: {
          title: 'Trainer Notifications & Alerts',
          desc: 'Stay informed regarding trainee submissions, administration notices, and scheduled webinars.',
          items: [
            'New assessment submission alerts',
            'Departmental curriculum review feedback',
            'Cohort enrollment volume updates',
            'Administrative announcements and policy updates',
          ],
        },
      };

      const meta = trainerSubMap[sub] || {
        title: 'Trainer Workspace Module',
        desc: 'Curriculum authoring and cohort evaluation environment.',
        items: ['Modular functionality coming in Stage 2'],
      };

      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate} requiredRole="trainer">
          <ModulePlaceholderPage
            title={meta.title}
            category="Trainer Workspace"
            stageName="Stage 2 (Assessment & Content Engine)"
            description={meta.desc}
            upcomingDeliverables={meta.items}
            onNavigate={navigate}
          />
        </DashboardLayout>
      );
    }

    // 6. Admin Subroutes (Polished Stage 2 Placeholders)
    if (pathname.startsWith('/admin/')) {
      const sub = pathname.replace('/admin/', '').split('/')[0];
      const adminSubMap: Record<string, { title: string; desc: string; items: string[] }> = {
        users: {
          title: 'User Management & Role Permissions',
          desc: 'Oversee all trainees, faculty trainers, and administrative officers with granular access controls.',
          items: [
            'Directory of all participants with departmental filtering',
            'Role management (Trainee, Trainer, Department Lead)',
            'Account suspension and activation controls',
            'Bulk user onboarding via structured CSV upload',
          ],
        },
        roles: {
          title: 'Role Governance & Access Control Matrix',
          desc: 'Manage administrative roles, privilege hierarchies, and permission boundaries across portal workspaces.',
          items: [
            'Role assignment matrix and security hierarchy oversight',
            'Granular read/write permissions for departmental coordinators',
            'Audit logging for role changes and privilege escalations',
            'Role inheritance configurations',
          ],
        },
        courses: {
          title: 'Course Governance & Approvals',
          desc: 'Review curriculum submissions from faculty, verify statutory standards, and approve for public catalog.',
          items: [
            'Course approval queue with feedback mechanism',
            'Curriculum compliance verification against national standards',
            'Archival and version management for past courses',
            'Course enrollment caps and cohort scheduling',
          ],
        },
        assessments: {
          title: 'Assessment Governance & Question Banks',
          desc: 'Maintain standardized assessment banks, verify examination integrity, and oversee pass thresholds.',
          items: [
            'National question bank calibration and taxonomy tagging',
            'Assessment audit trails and anti-collusion safeguards',
            'Departmental benchmarking pass score standards',
            'Cross-cohort evaluation normalization reports',
          ],
        },
        certificates: {
          title: 'National Certificate Registry',
          desc: 'Audit all issued digital credentials, verify signatures, and manage institutional credential templates.',
          items: [
            'Central cryptographic credential ledger',
            'Verification key rotation and security auditing',
            'Certificate revocation and reissue protocol',
            'Compliance with national digital credential guidelines',
          ],
        },
        competencies: {
          title: 'National Competency Frameworks',
          desc: 'Define institutional competency clusters, proficiency levels, and skill gap diagnostic formulas.',
          items: [
            'Competency dictionary authoring (Clusters, Levels 1-5)',
            'Departmental benchmark competency mapping',
            'Automated course-to-competency tagging matrix',
            'Macro competency deficit Heatmap for policy leaders',
          ],
        },
        analytics: {
          title: 'Macro Analytics & Policy Intelligence',
          desc: 'Executive level visual analytics on institutional learning hours, completion metrics, and organizational capacity.',
          items: [
            'Departmental training completion rate comparisons',
            'Capacity index trajectory tracking across quarters',
            'Time-spent vs competency-growth correlation charts',
            'Exportable PDF executive summaries for administrative reviews',
          ],
        },
        reports: {
          title: 'Institutional Capacity Reports & Transcripts',
          desc: 'Generate official capacity building reports, compliance audits, and aggregated department transcripts.',
          items: [
            'Quarterly capacity index audit reports',
            'Departmental participation and completion ledgers',
            'Cross-cohort competency growth deltas',
            'Statutory regulatory compliance transcripts',
          ],
        },
        announcements: {
          title: 'Broadcasts & Administrative Circulars',
          desc: 'Draft and dispatch official capacity notifications across departments, roles, and cohorts.',
          items: [
            'Role-targeted dispatch (Trainees, Trainers, or All)',
            'Priority labeling (Urgent, Mandatory, Informational)',
            'Circular archive with delivery and read receipt telemetry',
            'Integration with departmental email relay endpoints',
          ],
        },
        notifications: {
          title: 'Administrative Alerts & Broadcast Management',
          desc: 'Draft and dispatch official capacity notifications across departments, roles, and cohorts.',
          items: [
            'System-wide announcement dispatches',
            'Urgent deadline broadcasts to enrolled trainees',
            'Trainer milestone reminders',
            'Audit alert logs and delivery telemetry',
          ],
        },
        settings: {
          title: 'System Settings & Integration Gateway',
          desc: 'Configure portal parameters, security policies, database connections, and external API gateways.',
          items: [
            'Organizational domain whitelist and SSO configuration',
            'Database backup and disaster recovery schedules',
            'Audit log retention and compliance policies',
            'API gateway keys for future LMS interoperability',
          ],
        },
      };

      const meta = adminSubMap[sub] || {
        title: 'Administrative Console',
        desc: 'System administration and governance tools.',
        items: ['Modular functionality coming in Stage 2'],
      };

      return (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate} requiredRole="admin">
          <ModulePlaceholderPage
            title={meta.title}
            category="Administration"
            stageName="Stage 2 (Assessment & Content Engine)"
            description={meta.desc}
            upcomingDeliverables={meta.items}
            onNavigate={navigate}
          />
        </DashboardLayout>
      );
    }

    // Fallback: 404 / Unknown path -> return to Home
    return <LandingPage onNavigate={navigate} />;
  };

  return <>{renderRoute()}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <LearningProvider>
          <AppContent />
        </LearningProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
