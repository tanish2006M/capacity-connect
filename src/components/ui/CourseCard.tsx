/**
 * Capacity Connect - CourseCard Component
 * High quality enterprise course representation with unboxed metadata
 */

import React from 'react';
import { Course } from '../../types';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import { Clock, BookOpen, User, Star, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  progress?: number;
  onAction?: (course: Course) => void;
  actionLabel?: string;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  progress,
  onAction,
  actionLabel = 'View Course',
  className = '',
}) => {
  const getLevelColor = (level: Course['level']) => {
    switch (level) {
      case 'Foundational':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Intermediate':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Advanced':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div
      className={`group bg-white border border-slate-200/90 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-slate-300 hover:shadow-sm ${className}`}
    >
      <div>
        {/* Top metadata row with clean unboxed text */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="font-mono text-slate-700">{course.code}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{course.category}</span>
          </div>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
          {course.title}
        </h4>

        {/* Tagline / short description */}
        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {course.tagline || course.description}
        </p>

        {/* Course stats row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono tabular-nums">{course.durationHours}h</span>
          </div>
          <span aria-hidden="true" className="text-slate-200">·</span>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.modulesCount} modules</span>
          </div>
          <span aria-hidden="true" className="text-slate-200">·</span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-mono tabular-nums font-medium text-slate-700">{course.rating}</span>
          </div>
        </div>

        {/* Trainer info */}
        <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
            <User className="w-3 h-3" />
          </div>
          <span className="truncate">{course.trainerName}</span>
        </div>

        {/* Progress bar if enrolled */}
        {typeof progress === 'number' && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <ProgressBar value={progress} label="Completion Progress" size="sm" />
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-mono tabular-nums">
          {course.enrolledCount} enrolled
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction && onAction(course)}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
          iconPosition="right"
          className="group-hover:border-blue-600 group-hover:text-blue-700"
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
};
