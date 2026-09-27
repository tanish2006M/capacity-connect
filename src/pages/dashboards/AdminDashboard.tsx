/**
 * Capacity Connect - Administrator Dashboard
 * Route: /admin
 * Includes real-time Firestore user aggregation, organizational geographic analytics,
 * user approvals, and competency tracking. Protected strictly for Admin role.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  SEED_REGIONAL_USER_ACCOUNTS,
  SEED_COMPETENCIES,
  SEED_ANNOUNCEMENTS,
} from '../../data/seedData';
import { COMPREHENSIVE_COURSES } from '../../data/coursesData';
import { Announcement, User } from '../../types';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
  Users,
  BookOpen,
  Award,
  GraduationCap,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Target,
  FileCheck,
  TrendingUp,
  MapPin,
  ChevronDown,
  ChevronRight,
  Search,
  Building,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

interface StateDistrictStat {
  state: string;
  totalUsers: number;
  traineesCount: number;
  trainersCount: number;
  districts: Record<string, number>;
  topDistricts: { name: string; count: number }[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showSuccess, showInfo } = useToast();

  const [announcements, setAnnouncements] = useState<Announcement[]>(SEED_ANNOUNCEMENTS);
  const [newAnnouncementModal, setNewAnnouncementModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementAudience, setAnnouncementAudience] = useState<'all' | 'trainees' | 'trainers'>('all');

  // Real-time Firestore users combined with regional baseline
  const [firestoreUsers, setFirestoreUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Search & Accordion State for Geographic Analytics
  const [geoSearchQuery, setGeoSearchQuery] = useState('');
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({
    Telangana: true,
    Maharashtra: true,
    Karnataka: false,
    Jharkhand: false,
    'Delhi (NCT)': false,
  });

  const [pendingUsers, setPendingUsers] = useState([
    {
      id: 'req_1',
      name: 'Dr. Vikram Malhotra',
      email: 'vikram.malhotra@capacityconnect.demo',
      role: 'Trainer',
      department: 'Urban Development & Sanitation',
      state: 'Gujarat',
      district: 'Ahmedabad',
      date: 'Today, 10:15 IST',
    },
    {
      id: 'req_2',
      name: 'Sunita Chauhan',
      email: 'sunita.chauhan@capacityconnect.demo',
      role: 'Trainee',
      department: 'Revenue & Land Records',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      date: 'Today, 09:30 IST',
    },
    {
      id: 'req_3',
      name: 'Manoj Pillai',
      email: 'm.pillai@transport.gov.in',
      role: 'Trainee',
      department: 'Public Transit Operations',
      state: 'Kerala',
      district: 'Ernakulam (Kochi)',
      date: 'Yesterday',
    },
  ]);

  // Fetch real registered users from Cloud Firestore
  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList: User[] = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ ...(doc.data() as User), id: doc.id });
        });
        if (isMounted) {
          setFirestoreUsers(usersList);
        }
      } catch (err) {
        console.warn('Could not query Firestore users collection (offline or permissions):', err);
      } finally {
        if (isMounted) setIsLoadingUsers(false);
      }
    };

    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  // Merge Seed Regional Users + Real Firestore Users (deduplicated by ID or email)
  const allConsolidatedUsers = useMemo(() => {
    const map = new Map<string, User>();

    // 1. Seed regional accounts
    SEED_REGIONAL_USER_ACCOUNTS.forEach((u) => {
      map.set(u.email.toLowerCase(), u);
    });

    // 2. Real Firestore accounts (takes precedence)
    firestoreUsers.forEach((u) => {
      map.set(u.email.toLowerCase(), u);
    });

    return Array.from(map.values());
  }, [firestoreUsers]);

  // Calculate Geographic Aggregations (State & District Breakdown)
  const geographicStats = useMemo(() => {
    const stateMap: Record<string, StateDistrictStat> = {};

    allConsolidatedUsers.forEach((u) => {
      const stateName = u.state || 'Unspecified Region';
      const districtName = u.district || 'Unassigned District';

      if (!stateMap[stateName]) {
        stateMap[stateName] = {
          state: stateName,
          totalUsers: 0,
          traineesCount: 0,
          trainersCount: 0,
          districts: {},
          topDistricts: [],
        };
      }

      stateMap[stateName].totalUsers += 1;
      if (u.role === 'trainee') stateMap[stateName].traineesCount += 1;
      if (u.role === 'trainer') stateMap[stateName].trainersCount += 1;

      stateMap[stateName].districts[districtName] =
        (stateMap[stateName].districts[districtName] || 0) + 1;
    });

    // Format top districts per state
    Object.values(stateMap).forEach((st) => {
      st.topDistricts = Object.entries(st.districts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    });

    return Object.values(stateMap).sort((a, b) => b.totalUsers - a.totalUsers);
  }, [allConsolidatedUsers]);

  // Filter states based on user search query
  const filteredGeographicStats = useMemo(() => {
    if (!geoSearchQuery.trim()) return geographicStats;
    const query = geoSearchQuery.toLowerCase();
    return geographicStats.filter((s) => {
      if (s.state.toLowerCase().includes(query)) return true;
      return Object.keys(s.districts).some((d) => d.toLowerCase().includes(query));
    });
  }, [geographicStats, geoSearchQuery]);

  const toggleStateAccordion = (stateName: string) => {
    setExpandedStates((prev) => ({
      ...prev,
      [stateName]: !prev[stateName],
    }));
  };

  const handleApproveUser = (id: string, name: string) => {
    setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    showSuccess('Access Approved', `${name} provisioned with active authenticated role.`);
  };

  const handleRejectUser = (id: string, name: string) => {
    setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    showInfo('Request Archived', `Enrollment request for ${name} declined.`);
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim()) return;

    const newAnn: Announcement = {
      id: `ann_${Date.now()}`,
      title: announcementTitle.trim(),
      content: announcementContent.trim(),
      authorName: user?.fullName || 'Chief Administrator',
      authorRole: 'National Learning Directorate',
      publishedDate: new Date().toISOString(),
      priority: 'high',
      targetAudience: announcementAudience,
    };

    setAnnouncements([newAnn, ...announcements]);
    setNewAnnouncementModal(false);
    setAnnouncementTitle('');
    setAnnouncementContent('');
    showSuccess('Announcement Dispatched', 'Notification delivered across the capacity portal.');
  };

  const totalRegisteredCount = allConsolidatedUsers.length;
  const totalTraineesCount = allConsolidatedUsers.filter((u) => u.role === 'trainee').length;
  const totalTrainersCount = allConsolidatedUsers.filter((u) => u.role === 'trainer').length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Administration Overview"
        description="National Capacity Development Governance · Central Platform Directorate"
        tag={
          <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-white font-semibold">
            Admin Console
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/admin/analytics')}
              icon={<TrendingUp className="w-3.5 h-3.5" />}
            >
              Export Metrics
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setNewAnnouncementModal(true)}
              icon={<Megaphone className="w-3.5 h-3.5" />}
            >
              Post Circular
            </Button>
          </div>
        }
      />

      {/* Admin Notice Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Governance Dashboard:</strong> Organization-wide geographic analytics, user verification queue, and multi-tenant telemetry.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
            {allConsolidatedUsers.length} Users Tracked
          </span>
          <button
            onClick={() => onNavigate('/admin/competencies')}
            className="text-blue-300 font-semibold hover:underline hidden sm:inline"
          >
            Competency Matrix →
          </button>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Registered Users"
          value={totalRegisteredCount}
          subtext={`${totalTraineesCount} Trainees · ${totalTrainersCount} Trainers`}
          trend={{ value: '+142 this month', direction: 'up' }}
          icon={<Users className="w-5 h-5 text-slate-800" />}
          iconBgColor="bg-slate-100"
          onClick={() => onNavigate('/admin/users')}
        />
        <StatCard
          label="Curriculum Courses"
          value={COMPREHENSIVE_COURSES.length}
          subtext="Across 10 core disciplines"
          icon={<BookOpen className="w-5 h-5 text-blue-700" />}
          iconBgColor="bg-blue-50"
          onClick={() => onNavigate('/admin/courses')}
        />
        <StatCard
          label="Active Enrollments"
          value="2,410"
          subtext="89% active lesson progression"
          trend={{ value: '+18.4%', direction: 'up' }}
          icon={<GraduationCap className="w-5 h-5 text-indigo-700" />}
          iconBgColor="bg-indigo-50"
          onClick={() => onNavigate('/admin/courses')}
        />
        <StatCard
          label="Verified Credentials"
          value="742"
          subtext="Cryptographically authenticated"
          icon={<Award className="w-5 h-5 text-emerald-700" />}
          iconBgColor="bg-emerald-50"
          onClick={() => onNavigate('/admin/certificates')}
        />
      </div>

      {/* ============================================================== */}
      {/* SECTION: ORGANIZATIONAL GEOGRAPHIC ANALYTICS (ADMIN-ONLY)       */}
      {/* ============================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Organization-Wide Regional & Geographic Analytics
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-100/70 text-blue-800 font-semibold">
                Admin Confidential
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Aggregated administrative demographics by State, District, and regional cadre participation.
            </p>
          </div>

          {/* Search box for geographic drill-down */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={geoSearchQuery}
                onChange={(e) => setGeoSearchQuery(e.target.value)}
                placeholder="Search State or District..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
              />
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">
              {filteredGeographicStats.length} States
            </span>
          </div>
        </div>

        {/* Geographic Summary Highlight Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-[11px] text-slate-500 font-medium">Top Represented State</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {geographicStats[0]?.state || 'Telangana'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {geographicStats[0]?.totalUsers || 0} enrolled officers
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-[11px] text-slate-500 font-medium">Active States / UTs</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {geographicStats.length} Covered
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">National outreach</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-[11px] text-slate-500 font-medium">District Spread</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {allConsolidatedUsers.reduce((set, u) => (u.district ? set.add(u.district) : set), new Set()).size} Districts
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Grassroots presence</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-[11px] text-slate-500 font-medium">Privacy Compliance</span>
            <div className="text-sm font-bold text-emerald-700 mt-0.5">Zero GPS Tracking</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Voluntary cadre data only</div>
          </div>
        </div>

        {/* Hierarchical Regional Tree & Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-[11px] font-semibold text-slate-600 uppercase tracking-wider font-mono">
            <span className="flex-1">Administrative Jurisdiction</span>
            <span className="w-24 text-center">Trainees</span>
            <span className="w-24 text-center">Faculty</span>
            <span className="w-28 text-right pr-2">Total Cohort</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
            {filteredGeographicStats.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No state or district records matching "{geoSearchQuery}".
              </div>
            ) : (
              filteredGeographicStats.map((stateStat) => {
                const isExpanded = !!expandedStates[stateStat.state];
                const percentage = Math.round(
                  (stateStat.totalUsers / (totalRegisteredCount || 1)) * 100
                );

                return (
                  <div key={stateStat.state} className="transition-colors hover:bg-slate-50/50">
                    {/* State Header Row */}
                    <div
                      onClick={() => toggleStateAccordion(stateStat.state)}
                      className="px-4 py-3 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-4">
                        <button
                          type="button"
                          className="w-5 h-5 rounded hover:bg-slate-200/80 flex items-center justify-center text-slate-500"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-900">
                            {stateStat.state}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-2 font-mono">
                            ({stateStat.topDistricts.length} districts recorded)
                          </span>
                        </div>
                      </div>

                      <div className="w-24 text-center text-xs font-mono text-slate-700">
                        {stateStat.traineesCount}
                      </div>

                      <div className="w-24 text-center text-xs font-mono text-slate-700">
                        {stateStat.trainersCount}
                      </div>

                      <div className="w-28 text-right pr-2 flex items-center justify-end gap-2">
                        <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, percentage * 3)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold font-mono text-slate-900 w-8 text-right">
                          {stateStat.totalUsers}
                        </span>
                      </div>
                    </div>

                    {/* District Sub-Rows (Tree Drilldown) */}
                    {isExpanded && (
                      <div className="bg-slate-50/40 px-6 py-2.5 border-t border-slate-100 space-y-1.5">
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <span>Districts in {stateStat.state}:</span>
                        </div>
                        {stateStat.topDistricts.map((dist) => (
                          <div
                            key={dist.name}
                            className="flex items-center justify-between text-xs py-1 px-2.5 rounded-md hover:bg-white transition-colors"
                          >
                            <div className="flex items-center gap-2 text-slate-700">
                              <span className="text-slate-300 font-mono">└─</span>
                              <span className="font-medium text-slate-800">{dist.name}</span>
                            </div>
                            <div className="flex items-center gap-2 font-mono text-slate-600 text-[11px]">
                              <span>{dist.count} officer{dist.count > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              Real-time Firestore user profiles synchronized with baseline administrative registries.
            </span>
          </div>
          <span className="italic">Confidential administrative intelligence · Not visible to trainees</span>
        </div>
      </div>

      {/* Main Grid: User Approvals + Competency Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: User Approvals Queue */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  User Approvals & Verification Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Pending departmental verification and role authorization
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                {pendingUsers.length} Pending
              </span>
            </div>

            {pendingUsers.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                No pending authorization requests. All registrations verified.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingUsers.map((u) => (
                  <div
                    key={u.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{u.name}</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          {u.role}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {u.state} · {u.district}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <span>{u.email}</span> · <span className="text-slate-600">{u.department}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        Applied: {u.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectUser(u.id, u.name)}
                        className="text-xs text-slate-600 hover:text-rose-600 h-8 px-2.5"
                      >
                        Decline
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveUser(u.id, u.name)}
                        className="text-xs h-8 px-3"
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assessment & Learning Activity Overview */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">National Assessment Telemetry</h3>
                <p className="text-xs text-slate-500">Benchmark pass rates across all regional cohorts</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('/admin/assessments')}
                className="text-xs text-blue-700"
              >
                Assessment Matrix →
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
                <span className="text-xs text-slate-500">Average National Score</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">79.4%</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium mt-1">
                  <span>+4.1% vs Q3 cohort</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
                <span className="text-xs text-slate-500">Question Pool</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">450+ MCQs</div>
                <div className="text-[11px] text-slate-500 mt-1">Calibrated rubrics</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
                <span className="text-xs text-slate-500">First-Attempt Pass Rate</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">87.2%</div>
                <div className="text-[11px] text-blue-700 font-medium mt-1">High standard adherence</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Macro Competency Insights & Announcements */}
        <div className="lg:col-span-4 space-y-6">
          {/* Competency Insights */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Competency Diagnostics</h3>
                <p className="text-[11px] text-slate-500">Institutional cluster proficiency</p>
              </div>
              <Target className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3.5">
              {SEED_COMPETENCIES.map((comp) => (
                <div key={comp.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                      {comp.title}
                    </span>
                    <span className="font-mono text-slate-600 font-medium">
                      {comp.currentProficiency}% / {comp.targetProficiency}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        comp.gap === 0 ? 'bg-emerald-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${comp.currentProficiency}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{comp.cluster}</span>
                    <span>Gap: {comp.gap}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('/admin/competencies')}
                className="w-full justify-center text-xs"
              >
                Detailed Competency Analysis
              </Button>
            </div>
          </div>

          {/* Announcements Manager */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">National Announcements</h3>
              <button
                onClick={() => setNewAnnouncementModal(true)}
                className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                    <span className="uppercase font-semibold text-blue-700">{ann.targetAudience}</span>
                    <span>{new Date(ann.publishedDate).toLocaleDateString()}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 leading-snug">{ann.title}</h5>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Announcement Modal */}
      <Modal
        isOpen={newAnnouncementModal}
        onClose={() => setNewAnnouncementModal(false)}
        title="Publish Official Portal Circular"
        subtitle="Broadcast to Trainees, Trainers, or All Stakeholders"
        maxWidth="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setNewAnnouncementModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handlePublishAnnouncement}>
              Publish Announcement
            </Button>
          </div>
        }
      >
        <form onSubmit={handlePublishAnnouncement} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Circular Title</label>
            <input
              type="text"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              placeholder="e.g. Schedule for Annual Regional Competency Audit"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
            <select
              value={announcementAudience}
              onChange={(e) => setAnnouncementAudience(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
            >
              <option value="all">All Stakeholders (Trainees + Trainers)</option>
              <option value="trainees">Trainees Only</option>
              <option value="trainers">Faculty & Trainers Only</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Announcement Content</label>
            <textarea
              rows={3}
              value={announcementContent}
              onChange={(e) => setAnnouncementContent(e.target.value)}
              placeholder="Detailed administrative directive copy..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
