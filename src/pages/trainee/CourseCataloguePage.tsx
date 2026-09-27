/**
 * Capacity Connect - Trainee Course Catalogue Page
 * Visual refinement matching the enterprise Stitch design language:
 * - Clean Page Header with Capacity Connect branding & quick stats
 * - Prominent rounded search bar
 * - Category filter chips
 * - Two-column main workspace:
 *    - Left: Comprehensive multi-attribute filter sidebar card
 *    - Right: Course grid with rich metadata cards & sorting
 * All existing enrollment logic, context hooks, and modal workflows are preserved.
 */

import React, { useState, useMemo } from 'react';
import { useLearning } from '../../context/LearningContext';
import { useToast } from '../../context/ToastContext';
import { Course } from '../../types';
import { getCourseImage, handleCourseImageError } from '../../utils/courseImageService';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { CourseDetailsModal } from './CourseDetailsModal';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
  Clock,
  Star,
  Users,
  CheckCircle2,
  Play,
  ArrowRight,
  Layers,
  GraduationCap,
  Sparkles,
  Award,
  ChevronRight,
  ChevronDown,
  X,
  Compass,
} from 'lucide-react';

interface CourseCataloguePageProps {
  onNavigate: (path: string) => void;
  onSelectCourse?: (courseId: string, lessonId?: string) => void;
}

export const CourseCataloguePage: React.FC<CourseCataloguePageProps> = ({
  onNavigate,
  onSelectCourse,
}) => {
  const { courses, isEnrolled, getEnrollment, enrollCourse, enrolledCourses } = useLearning();
  const { showSuccess } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All'); // All | short | medium | extended
  const [selectedStatus, setSelectedStatus] = useState<string>('All'); // All | Enrolled | Available
  const [sortBy, setSortBy] = useState<string>('popular'); // popular | rating | duration-asc | duration-desc | title
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);

  // Extract unique categories from real application courses
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.category));
    return ['All', ...Array.from(set)];
  }, [courses]);

  const difficulties = ['All', 'Foundational', 'Intermediate', 'Advanced'];

  // Counts for filters
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: courses.length };
    courses.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [courses]);

  const difficultyCounts = useMemo(() => {
    const counts: Record<string, number> = { All: courses.length };
    courses.forEach((c) => {
      counts[c.level] = (counts[c.level] || 0) + 1;
    });
    return counts;
  }, [courses]);

  const durationCounts = useMemo(() => {
    let short = 0;
    let medium = 0;
    let extended = 0;
    courses.forEach((c) => {
      if (c.durationHours < 15) short++;
      else if (c.durationHours <= 20) medium++;
      else extended++;
    });
    return { All: courses.length, short, medium, extended };
  }, [courses]);

  const statusCounts = useMemo(() => {
    let enrolled = 0;
    courses.forEach((c) => {
      if (isEnrolled(c.id)) enrolled++;
    });
    return {
      All: courses.length,
      Enrolled: enrolled,
      Available: courses.length - enrolled,
    };
  }, [courses, isEnrolled]);

  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedDuration !== 'All' ||
    selectedStatus !== 'All';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedDuration('All');
    setSelectedStatus('All');
  };

  // Filter courses based on user criteria
  const filteredCourses = useMemo(() => {
    const result = courses.filter((c) => {
      // 1. Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tagline?.toLowerCase().includes(q) ||
        c.trainerName.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.skillsCovered.some((s) => s.toLowerCase().includes(q));

      // 2. Category filter
      const matchesCategory =
        selectedCategory === 'All' || c.category === selectedCategory;

      // 3. Difficulty filter
      const matchesDifficulty =
        selectedDifficulty === 'All' || c.level === selectedDifficulty;

      // 4. Duration filter
      let matchesDuration = true;
      if (selectedDuration === 'short') {
        matchesDuration = c.durationHours < 15;
      } else if (selectedDuration === 'medium') {
        matchesDuration = c.durationHours >= 15 && c.durationHours <= 20;
      } else if (selectedDuration === 'extended') {
        matchesDuration = c.durationHours > 20;
      }

      // 5. Status filter
      const enrolled = isEnrolled(c.id);
      const matchesStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Enrolled' && enrolled) ||
        (selectedStatus === 'Available' && !enrolled);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesDuration &&
        matchesStatus
      );
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'duration-asc') {
        return a.durationHours - b.durationHours;
      }
      if (sortBy === 'duration-desc') {
        return b.durationHours - a.durationHours;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // default: 'popular' by enrolledCount
      return b.enrolledCount - a.enrolledCount;
    });
  }, [
    courses,
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedDuration,
    selectedStatus,
    sortBy,
    isEnrolled,
  ]);

  const handleStartLearning = (courseId: string, lessonId?: string) => {
    if (onSelectCourse) {
      onSelectCourse(courseId, lessonId);
    } else {
      onNavigate(`/trainee/learning?course=${courseId}${lessonId ? `&lesson=${lessonId}` : ''}`);
    }
  };

  const handleQuickEnroll = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    const success = enrollCourse(course.id);
    if (success) {
      showSuccess(
        'Enrollment Confirmed!',
        `You have enrolled in "${course.title}". Start with Module 1 now.`
      );
    }
  };

  const getLevelBadge = (level: Course['level']) => {
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

  const getCategoryHeaderStyle = (category: string) => {
    switch (category) {
      case 'Data & Analytics':
        return {
          gradient: 'from-[#0f284e] via-[#163e75] to-[#1e293b]',
          accentText: 'text-sky-300',
          badge: 'bg-blue-500/25 text-blue-100 border-blue-400/30',
        };
      case 'Earth & Climate':
        return {
          gradient: 'from-[#063326] via-[#0d4f3b] to-[#132d29]',
          accentText: 'text-emerald-300',
          badge: 'bg-emerald-500/25 text-emerald-100 border-emerald-400/30',
        };
      case 'Technology':
        return {
          gradient: 'from-[#082f49] via-[#0369a1] to-[#0f172a]',
          accentText: 'text-cyan-300',
          badge: 'bg-cyan-500/25 text-cyan-100 border-cyan-400/30',
        };
      case 'Geospatial Technology':
        return {
          gradient: 'from-[#2e1065] via-[#4c1d95] to-[#1e1b4b]',
          accentText: 'text-purple-300',
          badge: 'bg-purple-500/25 text-purple-100 border-purple-400/30',
        };
      case 'Professional Development':
        return {
          gradient: 'from-[#1e293b] via-[#334155] to-[#0f172a]',
          accentText: 'text-amber-300',
          badge: 'bg-amber-500/25 text-amber-100 border-amber-400/30',
        };
      default:
        return {
          gradient: 'from-slate-900 via-slate-800 to-slate-950',
          accentText: 'text-blue-300',
          badge: 'bg-slate-500/25 text-slate-100 border-slate-400/30',
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200/80">
                <Compass className="w-3.5 h-3.5" />
                Capacity Connect Academy
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {courses.length} Programs Available
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001034] tracking-tight">
              Enterprise Course Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Curated technical and institutional learning programs engineered for rapid organizational capability building and verified skills development.
            </p>
          </div>

          {/* Quick link to active learning */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            <button
              onClick={() => onNavigate('/trainee/learning')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs group cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-blue-600 group-hover:scale-105 transition-transform" />
              <span>My Active Learning</span>
              {enrolledCourses.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold">
                  {enrolledCourses.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 2. Prominent Course Search Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course title, skills, code, or instructor name..."
              className="w-full pl-12 pr-11 py-3 text-xs sm:text-sm bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200/90 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Category Filter Chips (Horizontal Pill Bar) */}
        <div className="mt-4 pt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Focus:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = categoryCounts[cat] ?? 0;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#001034] text-white shadow-xs font-semibold'
                    : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <span>{cat === 'All' ? 'All Courses' : cat}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Compact Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Compact Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 shrink-0 pr-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-700" />
              <span>Filters:</span>
            </span>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                aria-label="Filter by Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`appearance-none text-xs rounded-xl pl-3 pr-7 py-2 font-medium border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  selectedCategory !== 'All'
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <option value="All">All Categories ({categoryCounts['All'] || courses.length})</option>
                <option value="Data & Analytics">Data & Analytics</option>
                <option value="Earth & Climate">Earth & Climate</option>
                <option value="Technology">Technology</option>
                <option value="Geospatial Technology">Geospatial Technology</option>
                <option value="Professional Development">Professional Development</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Difficulty Dropdown */}
            <div className="relative">
              <select
                aria-label="Filter by Difficulty Level"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className={`appearance-none text-xs rounded-xl pl-3 pr-7 py-2 font-medium border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  selectedDifficulty !== 'All'
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <option value="All">All Levels</option>
                <option value="Foundational">Foundational ({difficultyCounts['Foundational'] || 0})</option>
                <option value="Intermediate">Intermediate ({difficultyCounts['Intermediate'] || 0})</option>
                <option value="Advanced">Advanced ({difficultyCounts['Advanced'] || 0})</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Duration Dropdown */}
            <div className="relative">
              <select
                aria-label="Filter by Estimated Duration"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className={`appearance-none text-xs rounded-xl pl-3 pr-7 py-2 font-medium border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  selectedDuration !== 'All'
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <option value="All">All Durations</option>
                <option value="short">Under 15 Hours ({durationCounts.short})</option>
                <option value="medium">15–20 Hours ({durationCounts.medium})</option>
                <option value="extended">20+ Hours ({durationCounts.extended})</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Enrollment Status Dropdown */}
            <div className="relative">
              <select
                aria-label="Filter by Enrollment Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={`appearance-none text-xs rounded-xl pl-3 pr-7 py-2 font-medium border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  selectedStatus !== 'All'
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <option value="All">All Programs</option>
                <option value="Enrolled">Enrolled Only ({statusCounts.Enrolled})</option>
                <option value="Available">Available to Enroll ({statusCounts.Available})</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Reset Button */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-xl transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right: Showing Count & Sort Dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 text-xs">
            <span className="font-semibold text-slate-700 whitespace-nowrap">
              Showing <span className="font-bold text-[#001034]">{filteredCourses.length}</span> of {courses.length}
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  aria-label="Sort Courses"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl pl-3 pr-7 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="duration-asc">Duration: Short to Long</option>
                  <option value="duration-desc">Duration: Long to Short</option>
                  <option value="title">Title (A – Z)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Course Cards Grid (Full Width, Immediately Visible) */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCourses.map((course) => {
                const enrolled = isEnrolled(course.id);
                const enrollment = getEnrollment(course.id);
                const progress = enrollment?.progressPercent ?? 0;
                const courseImg = getCourseImage(course);

                return (
                  <article
                    key={course.id}
                    className="group bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
                  >
                    <div className="flex flex-col">
                      {/* Top Media / Visual Teaser Area */}
                      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#001034]">
                        <img
                          src={courseImg}
                          alt={course.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => handleCourseImageError(e, course)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#001034]/95 via-[#001034]/30 to-transparent" />

                        {/* Top Overlays: Category & Level Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-600/95 backdrop-blur-md text-white font-semibold text-[11px] tracking-wide shadow-xs">
                              {course.category}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#001034]/80 backdrop-blur-md text-slate-200 text-[11px] font-medium border border-white/10">
                              {course.level}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-[#001034]/85 backdrop-blur-md text-slate-300 font-mono text-[10px] font-semibold border border-white/10">
                            {course.code}
                          </span>
                        </div>

                        {/* In-Progress Pill Overlay */}
                        {enrolled && (
                          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            <span className="text-[11px] font-bold text-slate-900">
                              Enrolled • {progress}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Course Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                        <div className="space-y-3">
                          {/* Meta details row: Duration, Modules, Lessons, Rating */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <div className="flex items-center gap-1" title="Duration">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-mono font-medium text-slate-700">{course.durationHours}h</span>
                            </div>
                            <span className="text-slate-300">•</span>
                            <div className="flex items-center gap-1" title="Modules">
                              <Layers className="w-3.5 h-3.5 text-slate-400" />
                              <span>{course.modulesCount || course.modules?.length || 4} Modules</span>
                            </div>
                            <span className="text-slate-300">•</span>
                            <div className="flex items-center gap-1" title="Lessons">
                              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                              <span>{course.lessonsCount || 12} Lessons</span>
                            </div>
                            <span className="text-slate-300">•</span>
                            <div className="flex items-center gap-1" title="Rating">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="font-mono font-semibold text-slate-700">{course.rating}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3
                            onClick={() => setActiveCourseModal(course)}
                            className="text-base sm:text-lg font-bold text-[#001034] group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug cursor-pointer"
                            title={course.title}
                          >
                            {course.title}
                          </h3>

                          {/* Description */}
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {course.tagline || course.description}
                          </p>

                          {/* Trainer Byline */}
                          <div className="flex items-center gap-2.5 pt-1">
                            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#001034] shrink-0">
                              {course.trainerName.replace(/Prof\.|Dr\.|Adv\./g, '').trim().charAt(0) || 'T'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-slate-900 truncate">
                                {course.trainerName}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {course.trainerDesignation || 'Academic Faculty'}
                              </p>
                            </div>
                          </div>

                          {/* Skills Covered Pills */}
                          {course.skillsCovered && course.skillsCovered.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {course.skillsCovered.slice(0, 3).map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                                >
                                  {skill}
                                </span>
                              ))}
                              {course.skillsCovered.length > 3 && (
                                <span className="text-[11px] font-mono text-slate-400 self-center">
                                  +{course.skillsCovered.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Bottom / Action Area */}
                        <div className="pt-3.5 border-t border-slate-100">
                          {enrolled ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">Learning Progress</span>
                                <span className="font-mono font-bold text-blue-700">{progress}% Completed</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between pt-1">
                                <button
                                  type="button"
                                  onClick={() => setActiveCourseModal(course)}
                                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                                >
                                  Syllabus
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStartLearning(course.id, enrollment?.lastAccessedLessonId)}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-[#001034] text-white shadow-xs transition-colors cursor-pointer"
                                >
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span>{progress === 0 ? 'Start Course' : 'Resume'}</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveCourseModal(course)}
                                className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                              >
                                Syllabus
                              </button>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => handleQuickEnroll(e, course)}
                                  className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg bg-[#001034] hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
                                >
                                  <span>Enroll Now</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  No learning programs found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  We couldn't find any courses matching your current search or filter criteria. Try adjusting the filters or resetting them to view all programs.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>
          )}

      {/* Course Details Modal (Preserved exactly with full syllabus & enrollment logic) */}
      <CourseDetailsModal
        course={activeCourseModal}
        isOpen={activeCourseModal !== null}
        onClose={() => setActiveCourseModal(null)}
        onStartLearning={handleStartLearning}
        onNavigate={onNavigate}
      />
    </div>
  );
};
