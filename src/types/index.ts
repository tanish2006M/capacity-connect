/**
 * Capacity Connect - Core Data Models and Types
 */

export type Role = 'trainee' | 'trainer' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  organization?: string;
  department?: string;
  designation?: string;
  state?: string;
  district?: string;
  city?: string;
  qualifications?: string;
  workExperience?: string;
  interests?: string[];
  createdAt: string;
  updatedAt?: string;
  status: 'active' | 'pending' | 'suspended';
  isDemoAccount?: boolean;
}

export interface Profile extends User {
  phone?: string;
  employeeId?: string;
  bio?: string;
  assignedTrainerId?: string;
  competencyScore?: number;
  skillsAcquired?: string[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  durationMinutes: number;
  type: 'video' | 'document' | 'interactive' | 'quiz';
  contentUrl?: string;
  order: number;
  content?: string;
  keyTakeaways?: string[];
  resources?: { title: string; type: string; size: string; url?: string }[];
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
}

export interface Resource {
  id: string;
  courseId?: string;
  title: string;
  fileType: 'pdf' | 'doc' | 'slides' | 'spreadsheet' | 'video';
  fileSizeMb: number;
  uploadedAt: string;
  uploadedBy: string;
  downloadUrl?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  level: 'Foundational' | 'Intermediate' | 'Advanced';
  trainerId: string;
  trainerName: string;
  trainerDesignation?: string;
  durationHours: number;
  modulesCount: number;
  lessonsCount: number;
  thumbnailUrl?: string;
  status: 'published' | 'draft' | 'archived';
  enrolledCount: number;
  rating: number;
  skillsCovered: string[];
  objectives?: string[];
  modules?: Module[];
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  enrolledDate: string;
  progressPercent: number;
  completedLessons: string[];
  completedAssessments?: string[];
  status: 'in-progress' | 'completed' | 'not-started';
  lastAccessedDate: string;
  lastAccessedLessonId?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  points: number;
}

export interface Assessment {
  id: string;
  courseId: string;
  courseTitle: string;
  moduleId?: string;
  moduleTitle?: string;
  title: string;
  description?: string;
  durationMinutes: number;
  totalMarks: number;
  passingScorePercent: number;
  questionsCount: number;
  deadline?: string;
  instructions?: string[];
  status: 'upcoming' | 'open' | 'completed' | 'evaluated';
  questions?: Question[];
}

export interface Attempt {
  id: string;
  assessmentId: string;
  userId: string;
  answers: Record<string, number>;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  attemptDate: string;
  timeSpentSeconds: number;
  attemptNumber?: number;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  verificationCode: string;
  credentialUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiencyLevel: number; // 0 - 100
  targetLevel: number;
}

export interface Competency {
  id: string;
  code: string;
  title: string;
  cluster: string;
  description: string;
  currentProficiency: number; // 0 - 100
  targetProficiency: number;
  gap: number;
  recommendedCourses: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'assessment' | 'course' | 'system' | 'certificate';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  publishedDate: string;
  priority: 'normal' | 'high' | 'urgent';
  targetAudience: 'all' | 'trainees' | 'trainers';
}
