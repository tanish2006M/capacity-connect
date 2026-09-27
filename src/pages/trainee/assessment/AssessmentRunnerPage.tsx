/**
 * Capacity Connect - Trainee Assessment Runner Experience
 * Real MCQ evaluation engine with timer, answer persistence, question navigator,
 * automatic scoring, and granular pedagogical answer review.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Assessment, Question, Attempt } from '../../../types';
import { useLearning } from '../../../context/LearningContext';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { Modal } from '../../../components/ui/Modal';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Award,
  RotateCcw,
  Check,
  HelpCircle,
  Layers,
  Sparkles,
  Info,
  Calendar,
  ShieldCheck,
  Target,
} from 'lucide-react';

interface AssessmentRunnerPageProps {
  assessmentId: string;
  onNavigate: (path: string) => void;
  onBack?: () => void;
}

type RunnerStep = 'intro' | 'active' | 'result';

export const AssessmentRunnerPage: React.FC<AssessmentRunnerPageProps> = ({
  assessmentId,
  onNavigate,
  onBack,
}) => {
  const {
    getAssessmentById,
    getCourseById,
    submitAssessmentAttempt,
    getLatestAttempt,
    getAttemptsForAssessment,
  } = useLearning();

  const { showSuccess, showWarning, showError, showInfo } = useToast();

  const assessment = getAssessmentById(assessmentId);
  const course = assessment ? getCourseById(assessment.courseId) : undefined;
  const existingAttempts = getAttemptsForAssessment(assessmentId);
  const latestAttempt = getLatestAttempt(assessmentId);

  // If user previously completed this assessment, let them choose to review or retake
  const [step, setStep] = useState<RunnerStep>(() => {
    // If there is an existing attempt, start on intro so user can see their past score or review
    return 'intro';
  });

  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(() => {
    return (assessment?.durationMinutes || 15) * 60;
  });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [submitConfirmModalOpen, setSubmitConfirmModalOpen] = useState<boolean>(false);
  const [lastSubmittedAttempt, setLastSubmittedAttempt] = useState<Attempt | null>(latestAttempt || null);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialDurationSeconds = (assessment?.durationMinutes || 15) * 60;

  const questions: Question[] = useMemo(() => {
    return assessment?.questions || [];
  }, [assessment]);

  const currentQuestion: Question | undefined = questions[activeQuestionIndex];

  // Count answered questions
  const answeredCount = useMemo(() => {
    let count = 0;
    for (const q of questions) {
      if (selectedAnswers[q.id] !== undefined) {
        count += 1;
      }
    }
    return count;
  }, [questions, selectedAnswers]);

  const unansweredCount = questions.length - answeredCount;

  // Handle countdown timer
  useEffect(() => {
    if (step === 'active' && isTimerRunning && (assessment?.durationMinutes || 0) > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmitOnTimeExpiry();
            return 0;
          }
          return prev - 1;
        });
        setTimeSpentSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, isTimerRunning, assessment?.durationMinutes]);

  // Handle timer warning when under 2 minutes
  const isTimeLow = timeRemainingSeconds <= 120 && timeRemainingSeconds > 0;

  // Auto-submit when time reaches zero
  const handleAutoSubmitOnTimeExpiry = () => {
    setIsTimerRunning(false);
    showWarning('Time Expired', 'The assessment time limit has elapsed. Submitting your current answers.');
    executeSubmission();
  };

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start assessment attempt
  const handleStartAssessment = () => {
    setSelectedAnswers({});
    setActiveQuestionIndex(0);
    setTimeRemainingSeconds(initialDurationSeconds);
    setTimeSpentSeconds(0);
    setIsTimerRunning(true);
    setStep('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showInfo('Assessment Session Started', `Good luck! Timer is now active (${assessment?.durationMinutes || 15} minutes).`);
  };

  // Select option for current question
  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  // Question navigation
  const handleNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setActiveQuestionIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submission handling
  const handlePromptSubmission = () => {
    setSubmitConfirmModalOpen(true);
  };

  const executeSubmission = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTimerRunning(false);
    setSubmitConfirmModalOpen(false);

    const effectiveTimeSpent = Math.max(1, timeSpentSeconds);
    const attempt = submitAssessmentAttempt(assessmentId, selectedAnswers, effectiveTimeSpent);
    setLastSubmittedAttempt(attempt);
    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (attempt.passed) {
      showSuccess(
        'Assessment Passed!',
        `Congratulations! You achieved ${attempt.percentage}% (Benchmark: ${assessment?.passingScorePercent}%).`
      );
    } else {
      showWarning(
        'Benchmark Not Reached',
        `Score: ${attempt.percentage}%. The passing threshold is ${assessment?.passingScorePercent}%. You can review explanations and retake.`
      );
    }
  };

  // If assessment not found
  if (!assessment) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-lg mx-auto text-center mt-8 space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Assessment Not Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            The requested assessment could not be located. It may have been relocated or archived.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => onNavigate('/trainee/assessments')}>
          Return to Assessments
        </Button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 1: ASSESSMENT INTRODUCTION / START SCREEN
  // -------------------------------------------------------------
  if (step === 'intro') {
    const isAlreadyPassed = latestAttempt?.passed === true;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation back bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (onBack) onBack();
              else if (course) onNavigate(`/trainee/learning?course=${course.id}`);
              else onNavigate('/trainee/assessments');
            }}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{course ? `Back to ${course.title}` : 'Back to Assessments'}</span>
          </button>

          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            OFFICIAL EVALUATION
          </span>
        </div>

        {/* Main Introduction Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
          {/* Header */}
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-mono font-semibold text-slate-700">{course?.code || 'CAP-ASSESS'}</span>
              <span className="text-slate-300">·</span>
              <span className="text-blue-700 font-medium">{assessment.courseTitle}</span>
              {assessment.moduleTitle && (
                <>
                  <span className="text-slate-300">·</span>
                  <span>{assessment.moduleTitle}</span>
                </>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {assessment.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {assessment.description ||
                'This formal evaluation validates your understanding of core concepts covered in the curriculum.'}
            </p>
          </div>

          {/* Key Evaluation Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Questions</span>
              </div>
              <p className="text-lg font-bold text-slate-900 font-mono">
                {assessment.questionsCount || questions.length} MCQs
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Single choice</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Time Limit</span>
              </div>
              <p className="text-lg font-bold text-slate-900 font-mono">
                {assessment.durationMinutes > 0 ? `${assessment.durationMinutes} Mins` : 'Untimed'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Autosave active</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                <span>Passing Benchmark</span>
              </div>
              <p className="text-lg font-bold text-slate-900 font-mono">
                {assessment.passingScorePercent}%
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {Math.ceil((questions.length * assessment.passingScorePercent) / 100)} of {questions.length} correct
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                <span>Status</span>
              </div>
              <p className="text-sm font-bold text-slate-900">
                {isAlreadyPassed ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Passed ({latestAttempt?.percentage}%)
                  </span>
                ) : latestAttempt ? (
                  <span className="text-amber-700 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Needs Retake
                  </span>
                ) : (
                  <span className="text-slate-700">Not Started</span>
                )}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {existingAttempts.length} previous attempt{existingAttempts.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {/* Previous Attempt Summary (if any) */}
          {latestAttempt && (
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                latestAttempt.passed
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {latestAttempt.passed ? 'Previous Attempt: Passed' : 'Previous Attempt: Benchmark Not Met'}
                  </span>
                  <span className="text-xs font-mono">
                    Score: {latestAttempt.score} / {latestAttempt.maxScore} ({latestAttempt.percentage}%)
                  </span>
                </div>
                <p className="text-xs opacity-80">
                  Attempt #{latestAttempt.attemptNumber || 1} logged on{' '}
                  {new Date(latestAttempt.attemptDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLastSubmittedAttempt(latestAttempt);
                    setSelectedAnswers(latestAttempt.answers || {});
                    setStep('result');
                  }}
                  className="text-xs bg-white"
                >
                  View Attempt Results & Explanations
                </Button>
              </div>
            </div>
          )}

          {/* Instructions Box */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              Evaluation Guidelines & Candidate Rules
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 pl-5 list-disc leading-relaxed">
              {(
                assessment.instructions || [
                  'Each multiple choice question has four choices with exactly one correct option.',
                  'You may freely navigate forward and backward between questions; your selections persist automatically.',
                  'Unanswered questions will be counted as incorrect when the evaluation is submitted.',
                  'Once you click "Begin Assessment", the countdown timer starts and will automatically submit at 00:00.',
                  'Passing benchmark is 70% or higher. Passing records formal competency credit to your permanent record.',
                ]
              ).map((instr, i) => (
                <li key={i}>{instr}</li>
              ))}
            </ul>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                if (onBack) onBack();
                else if (course) onNavigate(`/trainee/learning?course=${course.id}`);
                else onNavigate('/trainee/assessments');
              }}
              icon={<ArrowLeft className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Cancel & Return
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={handleStartAssessment}
              icon={<Sparkles className="w-4 h-4" />}
              className="w-full sm:w-auto min-w-[200px] justify-center"
            >
              {latestAttempt ? 'Retake Assessment' : 'Begin Assessment Now'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 2: ACTIVE MCQ ASSESSMENT RUNNER
  // -------------------------------------------------------------
  if (step === 'active') {
    const isFirstQuestion = activeQuestionIndex === 0;
    const isLastQuestion = activeQuestionIndex === questions.length - 1;
    const currentSelectedOption = currentQuestion ? selectedAnswers[currentQuestion.id] : undefined;

    return (
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Top Assessment Status Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: Title & Question Count */}
            <div className="space-y-0.5 min-w-0">
              <span className="text-[11px] font-mono text-blue-700 font-semibold uppercase tracking-wider block">
                {course?.title || assessment.courseTitle}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {assessment.title}
              </h2>
            </div>

            {/* Right: Timer & Questions Answered Counter */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
              {/* Answered Progress Pill */}
              <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 flex items-center gap-1.5">
                <span className="text-slate-400">Answered:</span>
                <span className="font-bold text-slate-900">
                  {answeredCount}/{questions.length}
                </span>
              </div>

              {/* Countdown Timer */}
              {assessment.durationMinutes > 0 && (
                <div
                  className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold transition-all ${
                    isTimeLow
                      ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}
                >
                  <Clock className={`w-3.5 h-3.5 ${isTimeLow ? 'text-red-600' : 'text-blue-700'}`} />
                  <span>{formatTimer(timeRemainingSeconds)}</span>
                  {isTimeLow && <span className="text-[10px] uppercase tracking-wider font-sans font-bold">Low Time</span>}
                </div>
              )}
            </div>
          </div>

          {/* Progress bar across total questions */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Overall Progress</span>
              <span className="font-mono">
                {Math.round((answeredCount / questions.length) * 100)}% Answered
              </span>
            </div>
            <ProgressBar
              value={Math.round((answeredCount / questions.length) * 100)}
              size="sm"
              color={answeredCount === questions.length ? 'emerald' : 'blue'}
            />
          </div>
        </div>

        {/* Question Navigator Number Strip */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Question Navigator</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Current
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Answered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" /> Unanswered
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {questions.map((q, idx) => {
              const isCurrent = idx === activeQuestionIndex;
              const isAnswered = selectedAnswers[q.id] !== undefined;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleJumpToQuestion(idx)}
                  className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center relative ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600 ring-offset-2'
                      : isAnswered
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                  }`}
                >
                  {idx + 1}
                  {isAnswered && !isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Question Box */}
        {currentQuestion && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                Question {activeQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {currentQuestion.points || 10} Points
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                {currentQuestion.text}
              </h3>
            </div>

            {/* Multiple Choice Options List */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((optionText, optIdx) => {
                const isSelected = currentSelectedOption === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-xl text-left transition-all border flex items-center justify-between gap-4 group ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-700 group-hover:border-slate-400'
                        }`}
                      >
                        {letter}
                      </div>
                      <span
                        className={`text-xs sm:text-sm leading-normal ${
                          isSelected ? 'font-semibold text-blue-950' : 'text-slate-800'
                        }`}
                      >
                        {optionText}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevQuestion}
                disabled={isFirstQuestion}
                icon={<ChevronLeft className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Previous Question
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {!isLastQuestion ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleNextQuestion}
                    icon={<ChevronRight className="w-4 h-4" />}
                    iconPosition="right"
                    className="w-full sm:w-auto"
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handlePromptSubmission}
                    icon={<CheckCircle className="w-4 h-4" />}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white justify-center shadow-xs"
                  >
                    Finish & Submit Assessment
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        <Modal
          isOpen={submitConfirmModalOpen}
          onClose={() => setSubmitConfirmModalOpen(false)}
          title="Submit Assessment Evaluation?"
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => setSubmitConfirmModalOpen(false)}>
                Return to Questions
              </Button>
              <Button variant="primary" size="sm" onClick={executeSubmission}>
                Confirm & Submit
              </Button>
            </div>
          }
        >
          <div className="space-y-4 py-1 text-xs">
            {unansweredCount > 0 ? (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-0.5">
                    You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}!
                  </strong>
                  <span>
                    Unanswered questions will receive 0 points and cannot be revised after submission.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-900">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-0.5">
                    All {questions.length} questions answered!
                  </strong>
                  <span>Your responses are saved and ready for scoring against the evaluation rubric.</span>
                </div>
              </div>
            )}

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Assessment:</span>
                <span className="font-semibold text-slate-800">{assessment.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span className="font-mono text-slate-800">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Passing Criteria:</span>
                <span className="font-mono text-slate-800 font-semibold">{assessment.passingScorePercent}%</span>
              </div>
              <div className="flex justify-between">
                <span>Time Elapsed:</span>
                <span className="font-mono text-slate-800">{formatTimer(timeSpentSeconds)}</span>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 3: RESULT SCREEN & PEDAGOGICAL ANSWER REVIEW
  // -------------------------------------------------------------
  const attempt = lastSubmittedAttempt || latestAttempt;
  if (!attempt) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl max-w-lg mx-auto">
        <p className="text-xs text-slate-500">No submission records found.</p>
        <Button variant="primary" size="sm" onClick={() => setStep('intro')} className="mt-4">
          Start Assessment
        </Button>
      </div>
    );
  }

  const passed = attempt.passed;
  const passingScore = assessment.passingScorePercent;

  // Compute breakdown stats
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredInAttempt = 0;

  questions.forEach((q) => {
    const userChoice = attempt.answers[q.id];
    if (userChoice === undefined) {
      unansweredInAttempt += 1;
    } else if (userChoice === q.correctOptionIndex) {
      correctCount += 1;
    } else {
      incorrectCount += 1;
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (course) onNavigate(`/trainee/learning?course=${course.id}`);
            else onNavigate('/trainee/assessments');
          }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{course ? `Return to ${course.title}` : 'Return to Assessments'}</span>
        </button>

        <span
          className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
            passed
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {passed ? 'PASSED & CREDITED' : 'BENCHMARK NOT MET'}
        </span>
      </div>

      {/* Hero Outcome Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 text-center">
        {/* Status Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm ${
            passed
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {passed ? <Award className="w-9 h-9" /> : <AlertTriangle className="w-9 h-9" />}
        </div>

        {/* Title & Feedback message */}
        <div className="space-y-1.5 max-w-lg mx-auto">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
            {assessment.courseTitle}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {passed ? 'Assessment Successfully Completed!' : 'Evaluation Completed — Retake Required'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {passed
              ? `You achieved an official score of ${attempt.percentage}%, exceeding the required ${passingScore}% benchmark. Your course competency transcript has been updated.`
              : `You scored ${attempt.percentage}%. A minimum passing score of ${passingScore}% is required to verify competency. Review your detailed answer rationale below and retake whenever ready.`}
          </p>
        </div>

        {/* Key Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Overall Score</span>
            <span className="text-xl font-bold text-slate-900 font-mono">
              {attempt.percentage}%
            </span>
            <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
              {attempt.score} / {attempt.maxScore} pts
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-[11px] text-emerald-800 block">Correct Answers</span>
            <span className="text-xl font-bold text-emerald-700 font-mono">
              {correctCount}
            </span>
            <span className="text-[11px] text-emerald-600 font-mono block mt-0.5">
              of {questions.length} questions
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Passing Benchmark</span>
            <span className="text-xl font-bold text-slate-900 font-mono">
              {passingScore}%
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {passed ? 'Met' : 'Pending'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Time Recorded</span>
            <span className="text-xl font-bold text-slate-900 font-mono">
              {formatTimer(attempt.timeSpentSeconds)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Attempt #{attempt.attemptNumber || 1}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleStartAssessment}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Retake Assessment
          </Button>

          {course && (
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate(`/trainee/learning?course=${course.id}`)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Return to Course Syllabus
            </Button>
          )}

          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate('/trainee/learning')}
          >
            My Learning
          </Button>
        </div>
      </div>

      {/* Answer Review Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900">
              Detailed Question Review & Explanations
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review your chosen answers alongside official rationales for every question.
          </p>
        </div>

        {/* Question cards list */}
        <div className="space-y-6 divide-y divide-slate-100">
          {questions.map((q, idx) => {
            const userChoice = attempt.answers[q.id];
            const isCorrect = userChoice === q.correctOptionIndex;
            const isUnanswered = userChoice === undefined;

            return (
              <div key={q.id} className="pt-6 first:pt-0 space-y-4">
                {/* Question Top Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Question {idx + 1} of {questions.length}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                      {q.text}
                    </h3>
                  </div>

                  {/* Outcome Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : isUnanswered
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                        Correct (+{q.points || 10} pts)
                      </>
                    ) : isUnanswered ? (
                      <>Unanswered (0 pts)</>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-700" />
                        Incorrect (0 pts)
                      </>
                    )}
                  </span>
                </div>

                {/* Options display */}
                <div className="space-y-2">
                  {q.options.map((optText, optIdx) => {
                    const isUserPick = userChoice === optIdx;
                    const isRightAnswer = q.correctOptionIndex === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);

                    let optionStyle = 'bg-slate-50/70 border-slate-200 text-slate-700';

                    if (isRightAnswer) {
                      optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium ring-1 ring-emerald-300';
                    } else if (isUserPick && !isCorrect) {
                      optionStyle = 'bg-rose-50 border-rose-300 text-rose-950 ring-1 ring-rose-300';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-[11px] shrink-0 ${
                              isRightAnswer
                                ? 'bg-emerald-600 text-white'
                                : isUserPick && !isCorrect
                                ? 'bg-rose-600 text-white'
                                : 'bg-white border border-slate-300 text-slate-600'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="truncate sm:whitespace-normal">{optText}</span>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {isRightAnswer && (
                            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                              <Check className="w-3 h-3 stroke-[3]" /> Correct Answer
                            </span>
                          )}
                          {isUserPick && !isRightAnswer && (
                            <span className="text-[11px] font-semibold text-rose-700">
                              Your Choice
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation rationale if available */}
                {q.explanation && (
                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold mb-0.5 text-blue-900">
                        Explanation & Pedagogical Rationale:
                      </strong>
                      <p className="leading-relaxed opacity-90">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
