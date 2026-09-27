/**
 * Capacity Connect - Trainee Learning Context
 * Provides real reactive state and persistence for courses, enrollments, and lesson progress.
 * Scoped by authenticated user ID with persistent Cloud Firestore synchronization.
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Course, Enrollment, Lesson, Module, Assessment, Attempt } from '../types';
import { COMPREHENSIVE_COURSES } from '../data/coursesData';
import { COMPREHENSIVE_ASSESSMENTS } from '../data/assessmentData';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

interface LearningContextType {
  courses: Course[];
  enrollments: Enrollment[];
  enrolledCourses: (Course & { enrollment: Enrollment })[];
  activeCourse: (Course & { enrollment: Enrollment }) | undefined;
  getCourseById: (courseId: string) => Course | undefined;
  getEnrollment: (courseId: string) => Enrollment | undefined;
  isEnrolled: (courseId: string) => boolean;
  enrollCourse: (courseId: string) => boolean;
  toggleLessonComplete: (courseId: string, lessonId: string) => { newProgress: number; isCompleted: boolean };
  isLessonCompleted: (courseId: string, lessonId: string) => boolean;
  getCourseProgress: (courseId: string) => number;
  setLastAccessedLesson: (courseId: string, lessonId: string) => void;
  resetEnrollmentsToDefault: () => void;
  isLoadingData: boolean;
  stats: {
    enrolledCount: number;
    completedCount: number;
    inProgressCount: number;
    totalCompletedLessons: number;
    avgProgress: number;
    completedAssessmentsCount: number;
    pendingAssessmentsCount: number;
  };

  // Assessment Engine Integration
  assessments: Assessment[];
  attempts: Attempt[];
  getAssessmentById: (assessmentId: string) => Assessment | undefined;
  getAssessmentsForCourse: (courseId: string) => Assessment[];
  getLatestAttempt: (assessmentId: string) => Attempt | undefined;
  getAttemptsForAssessment: (assessmentId: string) => Attempt[];
  getAssessmentStatus: (assessmentId: string) => 'not-started' | 'passed' | 'failed';
  submitAssessmentAttempt: (
    assessmentId: string,
    answers: Record<string, number>,
    timeSpentSeconds: number
  ) => Attempt;
}

// Initial realistic seed attempts for default demo trainee (Aarav Sharma / Rohan Verma)
const DEFAULT_DEMO_ATTEMPTS: Attempt[] = [
  {
    id: 'att_pm_seed_01',
    assessmentId: 'asm_03',
    userId: 'usr_trainee_001',
    answers: {
      q_pm_601: 1,
      q_pm_602: 1,
      q_pm_603: 1,
      q_pm_604: 0,
      q_pm_605: 1,
    },
    score: 50,
    maxScore: 50,
    percentage: 100,
    passed: true,
    attemptDate: '2025-07-28T16:30:00Z',
    timeSpentSeconds: 780,
    attemptNumber: 1,
  },
];

// Initial realistic seed enrollments for default demo trainee
const DEFAULT_DEMO_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr_wda',
    userId: 'usr_trainee_001',
    courseId: 'crs_weather',
    courseTitle: 'Weather Data Analysis',
    enrolledDate: '2026-09-10T09:00:00Z',
    progressPercent: 17, // 2 of 12 lessons
    completedLessons: ['les_wda_01', 'les_wda_02'],
    status: 'in-progress',
    lastAccessedDate: '2026-09-25T14:30:00Z',
    lastAccessedLessonId: 'les_wda_02',
  },
  {
    id: 'enr_py',
    userId: 'usr_trainee_001',
    courseId: 'crs_python',
    courseTitle: 'Python for Data Analysis',
    enrolledDate: '2026-09-18T10:00:00Z',
    progressPercent: 0,
    completedLessons: [],
    status: 'not-started',
    lastAccessedDate: '2026-09-18T10:00:00Z',
    lastAccessedLessonId: 'les_py_01',
  },
];

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [courses] = useState<Course[]>(COMPREHENSIVE_COURSES);
  const [assessments] = useState<Assessment[]>(COMPREHENSIVE_ASSESSMENTS);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // Keep a reference to the active user ID to avoid race conditions
  const activeUserIdRef = useRef<string | null>(null);

  // Synchronize data whenever the authenticated user changes
  useEffect(() => {
    const currentUserId = user?.id || null;
    activeUserIdRef.current = currentUserId;

    if (!currentUserId) {
      // Unauthenticated state
      setEnrollments([]);
      setAttempts([]);
      return;
    }

    const loadUserData = async () => {
      setIsLoadingData(true);
      const storageEnrollmentsKey = `capacity_connect_enrollments_${currentUserId}`;
      const storageAttemptsKey = `capacity_connect_attempts_${currentUserId}`;

      // 1. First, check user-scoped local cache for instantaneous, flicker-free rendering
      let cachedEnrollments: Enrollment[] = [];
      let cachedAttempts: Attempt[] = [];

      try {
        const storedEnr = localStorage.getItem(storageEnrollmentsKey);
        if (storedEnr) {
          const parsed = JSON.parse(storedEnr);
          if (Array.isArray(parsed)) cachedEnrollments = parsed;
        }
      } catch (e) {
        console.warn('Error reading cached enrollments:', e);
      }

      try {
        const storedAtt = localStorage.getItem(storageAttemptsKey);
        if (storedAtt) {
          const parsed = JSON.parse(storedAtt);
          if (Array.isArray(parsed)) cachedAttempts = parsed;
        }
      } catch (e) {
        console.warn('Error reading cached attempts:', e);
      }

      // If it's a known demo trainee (or default demo user) and cache is fresh/empty, provide seed data
      if (
        user?.isDemoAccount &&
        cachedEnrollments.length === 0 &&
        (currentUserId === 'usr_trainee_001' || currentUserId === 'usr_trainee_003')
      ) {
        cachedEnrollments = DEFAULT_DEMO_ENROLLMENTS.map((e) => ({ ...e, userId: currentUserId }));
        cachedAttempts = DEFAULT_DEMO_ATTEMPTS.map((a) => ({ ...a, userId: currentUserId }));
        try {
          localStorage.setItem(storageEnrollmentsKey, JSON.stringify(cachedEnrollments));
          localStorage.setItem(storageAttemptsKey, JSON.stringify(cachedAttempts));
        } catch {
          // ignore
        }
      }

      if (activeUserIdRef.current === currentUserId) {
        setEnrollments(cachedEnrollments);
        setAttempts(cachedAttempts);
      }

      // 2. If it's a real Firebase account (not a local demo persona), query Firestore
      if (!user?.isDemoAccount) {
        try {
          // Query Firestore for this user's enrollments
          const enrPath = 'enrollments';
          const enrQuery = query(collection(db, enrPath), where('userId', '==', currentUserId));
          const enrSnap = await getDocs(enrQuery);

          const firestoreEnrollments: Enrollment[] = [];
          enrSnap.forEach((docSnap) => {
            const data = docSnap.data() as Enrollment;
            firestoreEnrollments.push({ ...data, id: docSnap.id });
          });

          // Query Firestore for this user's attempts
          const attPath = 'attempts';
          const attQuery = query(collection(db, attPath), where('userId', '==', currentUserId));
          const attSnap = await getDocs(attQuery);

          const firestoreAttempts: Attempt[] = [];
          attSnap.forEach((docSnap) => {
            const data = docSnap.data() as Attempt;
            firestoreAttempts.push({ ...data, id: docSnap.id });
          });

          if (activeUserIdRef.current === currentUserId) {
            // If Firestore returned records, adopt them; otherwise retain cached records
            const finalEnrollments = firestoreEnrollments.length > 0 ? firestoreEnrollments : cachedEnrollments;
            const finalAttempts = firestoreAttempts.length > 0 ? firestoreAttempts : cachedAttempts;

            setEnrollments(finalEnrollments);
            setAttempts(finalAttempts);

            try {
              localStorage.setItem(storageEnrollmentsKey, JSON.stringify(finalEnrollments));
              localStorage.setItem(storageAttemptsKey, JSON.stringify(finalAttempts));
            } catch {
              // ignore
            }
          }
        } catch (error) {
          console.warn('Firestore fetch for user records failed or offline; using local cache:', error);
        }
      }

      setIsLoadingData(false);
    };

    loadUserData();
  }, [user?.id, user?.isDemoAccount]);

  // Helper to persist user-scoped enrollments
  const persistEnrollments = (updated: Enrollment[]) => {
    if (!user?.id) return;
    try {
      localStorage.setItem(`capacity_connect_enrollments_${user.id}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to cache enrollments:', e);
    }
  };

  // Helper to persist user-scoped attempts
  const persistAttempts = (updated: Attempt[]) => {
    if (!user?.id) return;
    try {
      localStorage.setItem(`capacity_connect_attempts_${user.id}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to cache attempts:', e);
    }
  };

  const getCourseById = (courseId: string): Course | undefined => {
    return courses.find((c) => c.id === courseId);
  };

  const getEnrollment = (courseId: string): Enrollment | undefined => {
    return enrollments.find((e) => e.courseId === courseId);
  };

  const isEnrolled = (courseId: string): boolean => {
    return enrollments.some((e) => e.courseId === courseId);
  };

  const enrollCourse = (courseId: string): boolean => {
    if (!user) return false;
    if (isEnrolled(courseId)) {
      return false;
    }
    const course = getCourseById(courseId);
    if (!course) return false;

    // Pick first lesson ID if available
    const firstLessonId = course.modules?.[0]?.lessons?.[0]?.id;

    const newEnrollment: Enrollment = {
      id: `enr_${user.id}_${course.id}`,
      userId: user.id,
      courseId: course.id,
      courseTitle: course.title,
      enrolledDate: new Date().toISOString(),
      progressPercent: 0,
      completedLessons: [],
      status: 'not-started',
      lastAccessedDate: new Date().toISOString(),
      lastAccessedLessonId: firstLessonId,
    };

    const updated = [newEnrollment, ...enrollments];
    setEnrollments(updated);
    persistEnrollments(updated);

    // Persist to Cloud Firestore if real user
    if (!user.isDemoAccount) {
      const path = 'enrollments';
      setDoc(doc(db, path, newEnrollment.id), newEnrollment).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `${path}/${newEnrollment.id}`);
      });
    }

    return true;
  };

  const getTotalLessonsCount = (course: Course): number => {
    if (!course.modules) return course.lessonsCount || 1;
    let count = 0;
    for (const mod of course.modules) {
      count += mod.lessons?.length || 0;
    }
    return count > 0 ? count : (course.lessonsCount || 1);
  };

  const toggleLessonComplete = (
    courseId: string,
    lessonId: string
  ): { newProgress: number; isCompleted: boolean } => {
    if (!user) return { newProgress: 0, isCompleted: false };
    const course = getCourseById(courseId);
    const existing = getEnrollment(courseId);

    if (!course) {
      return { newProgress: 0, isCompleted: false };
    }

    const totalLessons = getTotalLessonsCount(course);

    let updatedCompleted: string[] = [];
    let isNowCompleted = false;

    // If trainee not enrolled yet, auto-enroll them when completing a lesson
    if (!existing) {
      updatedCompleted = [lessonId];
      isNowCompleted = true;
      const progressPercent = Math.min(100, Math.round((updatedCompleted.length / totalLessons) * 100));

      const newEnrollment: Enrollment = {
        id: `enr_${user.id}_${course.id}`,
        userId: user.id,
        courseId: course.id,
        courseTitle: course.title,
        enrolledDate: new Date().toISOString(),
        progressPercent,
        completedLessons: updatedCompleted,
        status: progressPercent === 100 ? 'completed' : 'in-progress',
        lastAccessedDate: new Date().toISOString(),
        lastAccessedLessonId: lessonId,
      };

      const updatedList = [newEnrollment, ...enrollments];
      setEnrollments(updatedList);
      persistEnrollments(updatedList);

      if (!user.isDemoAccount) {
        const path = 'enrollments';
        setDoc(doc(db, path, newEnrollment.id), newEnrollment).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, `${path}/${newEnrollment.id}`);
        });
      }

      return { newProgress: progressPercent, isCompleted: isNowCompleted };
    }

    // Existing enrollment
    const alreadyCompleted = existing.completedLessons.includes(lessonId);
    if (alreadyCompleted) {
      updatedCompleted = existing.completedLessons.filter((id) => id !== lessonId);
      isNowCompleted = false;
    } else {
      updatedCompleted = [...existing.completedLessons, lessonId];
      isNowCompleted = true;
    }

    const progressPercent = Math.min(100, Math.round((updatedCompleted.length / totalLessons) * 100));
    const newStatus: Enrollment['status'] =
      progressPercent === 100
        ? 'completed'
        : progressPercent > 0
        ? 'in-progress'
        : 'not-started';

    const updatedList = enrollments.map((e) => {
      if (e.courseId === courseId) {
        return {
          ...e,
          completedLessons: updatedCompleted,
          progressPercent,
          status: newStatus,
          lastAccessedDate: new Date().toISOString(),
          lastAccessedLessonId: lessonId,
        };
      }
      return e;
    });

    setEnrollments(updatedList);
    persistEnrollments(updatedList);

    // Sync to Cloud Firestore if real user
    if (!user.isDemoAccount) {
      const path = 'enrollments';
      updateDoc(doc(db, path, existing.id), {
        completedLessons: updatedCompleted,
        progressPercent,
        status: newStatus,
        lastAccessedDate: new Date().toISOString(),
        lastAccessedLessonId: lessonId,
      }).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `${path}/${existing.id}`);
      });
    }

    return { newProgress: progressPercent, isCompleted: isNowCompleted };
  };

  const isLessonCompleted = (courseId: string, lessonId: string): boolean => {
    const enr = getEnrollment(courseId);
    if (!enr) return false;
    return enr.completedLessons.includes(lessonId);
  };

  const getCourseProgress = (courseId: string): number => {
    const enr = getEnrollment(courseId);
    return enr ? enr.progressPercent : 0;
  };

  const setLastAccessedLesson = (courseId: string, lessonId: string) => {
    if (!user) return;
    const existing = getEnrollment(courseId);
    const updated = enrollments.map((e) => {
      if (e.courseId === courseId) {
        return {
          ...e,
          lastAccessedLessonId: lessonId,
          lastAccessedDate: new Date().toISOString(),
        };
      }
      return e;
    });

    setEnrollments(updated);
    persistEnrollments(updated);

    if (existing && !user.isDemoAccount) {
      const path = 'enrollments';
      updateDoc(doc(db, path, existing.id), {
        lastAccessedLessonId: lessonId,
        lastAccessedDate: new Date().toISOString(),
      }).catch((err) => {
        console.warn('Firestore update last accessed lesson:', err);
      });
    }
  };

  const resetEnrollmentsToDefault = () => {
    if (!user) return;
    const defaults = user.isDemoAccount
      ? DEFAULT_DEMO_ENROLLMENTS.map((e) => ({ ...e, userId: user.id }))
      : [];
    const defaultAtts = user.isDemoAccount
      ? DEFAULT_DEMO_ATTEMPTS.map((a) => ({ ...a, userId: user.id }))
      : [];

    setEnrollments(defaults);
    setAttempts(defaultAtts);
    persistEnrollments(defaults);
    persistAttempts(defaultAtts);
  };

  // Assessment Engine Integration Methods
  const getAssessmentById = (assessmentId: string): Assessment | undefined => {
    return assessments.find((a) => a.id === assessmentId);
  };

  const getAssessmentsForCourse = (courseId: string): Assessment[] => {
    return assessments.filter((a) => a.courseId === courseId);
  };

  const getAttemptsForAssessment = (assessmentId: string): Attempt[] => {
    return attempts.filter((att) => att.assessmentId === assessmentId);
  };

  const getLatestAttempt = (assessmentId: string): Attempt | undefined => {
    const list = attempts.filter((att) => att.assessmentId === assessmentId);
    if (list.length === 0) return undefined;
    return [...list].sort(
      (a, b) => new Date(b.attemptDate).getTime() - new Date(a.attemptDate).getTime()
    )[0];
  };

  const getAssessmentStatus = (assessmentId: string): 'not-started' | 'passed' | 'failed' => {
    const latest = getLatestAttempt(assessmentId);
    if (!latest) return 'not-started';
    return latest.passed ? 'passed' : 'failed';
  };

  const submitAssessmentAttempt = (
    assessmentId: string,
    answers: Record<string, number>,
    timeSpentSeconds: number
  ): Attempt => {
    const assessment = getAssessmentById(assessmentId);
    const existingAttempts = getAttemptsForAssessment(assessmentId);
    const currentUserId = user?.id || 'usr_trainee_001';

    const questions = assessment?.questions || [];
    let earnedPoints = 0;
    let totalPossiblePoints = 0;

    for (const q of questions) {
      const qPoints = q.points || 10;
      totalPossiblePoints += qPoints;
      if (answers[q.id] !== undefined && answers[q.id] === q.correctOptionIndex) {
        earnedPoints += qPoints;
      }
    }

    if (totalPossiblePoints === 0) {
      totalPossiblePoints = assessment?.totalMarks || 100;
    }

    const percentage = Math.round((earnedPoints / totalPossiblePoints) * 100);
    const passingThreshold = assessment?.passingScorePercent ?? 70;
    const passed = percentage >= passingThreshold;

    const newAttempt: Attempt = {
      id: `att_${currentUserId}_${Date.now()}`,
      assessmentId,
      userId: currentUserId,
      answers,
      score: earnedPoints,
      maxScore: totalPossiblePoints,
      percentage,
      passed,
      attemptDate: new Date().toISOString(),
      timeSpentSeconds,
      attemptNumber: existingAttempts.length + 1,
    };

    const updatedAttempts = [newAttempt, ...attempts];
    setAttempts(updatedAttempts);
    persistAttempts(updatedAttempts);

    // Write to Firestore if real user
    if (user && !user.isDemoAccount) {
      const path = 'attempts';
      setDoc(doc(db, path, newAttempt.id), newAttempt).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `${path}/${newAttempt.id}`);
      });
    }

    // If passed, link with course enrollment record
    if (passed && assessment) {
      const updatedEnrollments = enrollments.map((e) => {
        if (e.courseId === assessment.courseId) {
          const completedAssessments = Array.from(
            new Set([...(e.completedAssessments || []), assessmentId])
          );
          return {
            ...e,
            completedAssessments,
            lastAccessedDate: new Date().toISOString(),
          };
        }
        return e;
      });

      setEnrollments(updatedEnrollments);
      persistEnrollments(updatedEnrollments);

      const targetEnrollment = enrollments.find((e) => e.courseId === assessment.courseId);
      if (targetEnrollment && user && !user.isDemoAccount) {
        const path = 'enrollments';
        const completedAssessments = Array.from(
          new Set([...(targetEnrollment.completedAssessments || []), assessmentId])
        );
        updateDoc(doc(db, path, targetEnrollment.id), {
          completedAssessments,
          lastAccessedDate: new Date().toISOString(),
        }).catch((err) => {
          console.warn('Firestore update enrollment assessments:', err);
        });
      }
    }

    return newAttempt;
  };

  // Enrolled courses augmented with enrollment data
  const enrolledCourses = enrollments
    .map((enr) => {
      const course = courses.find((c) => c.id === enr.courseId);
      if (!course) return null;
      return {
        ...course,
        enrollment: enr,
      };
    })
    .filter((c): c is Course & { enrollment: Enrollment } => c !== null);

  // Active in-progress or recently accessed course
  const activeCourse =
    enrolledCourses.find((c) => c.enrollment.status === 'in-progress') ||
    enrolledCourses[0];

  // Calculated aggregate stats
  const totalCompletedLessons = enrollments.reduce(
    (sum, e) => sum + e.completedLessons.length,
    0
  );

  const completedCount = enrollments.filter((e) => e.status === 'completed').length;
  const inProgressCount = enrollments.filter((e) => e.status === 'in-progress').length;
  const avgProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((acc, curr) => acc + curr.progressPercent, 0) /
            enrollments.length
        )
      : 0;

  const completedAssessmentsCount = assessments.filter(
    (a) => getAssessmentStatus(a.id) === 'passed'
  ).length;
  const pendingAssessmentsCount = Math.max(0, assessments.length - completedAssessmentsCount);

  const stats = {
    enrolledCount: enrollments.length,
    completedCount,
    inProgressCount,
    totalCompletedLessons,
    avgProgress,
    completedAssessmentsCount,
    pendingAssessmentsCount,
  };

  return (
    <LearningContext.Provider
      value={{
        courses,
        enrollments,
        enrolledCourses,
        activeCourse,
        getCourseById,
        getEnrollment,
        isEnrolled,
        enrollCourse,
        toggleLessonComplete,
        isLessonCompleted,
        getCourseProgress,
        setLastAccessedLesson,
        resetEnrollmentsToDefault,
        isLoadingData,
        stats,
        assessments,
        attempts,
        getAssessmentById,
        getAssessmentsForCourse,
        getLatestAttempt,
        getAttemptsForAssessment,
        getAssessmentStatus,
        submitAssessmentAttempt,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = (): LearningContextType => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
