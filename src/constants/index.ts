import {
  IAssinmentAnalytics,
  IQuizzzAnalytics,
  IStatCard,
  IStudentAnalytics,
} from './../types/index';
import { IAnalyticsData } from '@/types';
import { formatDate } from '@/utils';
import {
  Award,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Clock,
  FileText,
  GraduationCap,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
const style = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase';

export const ADMIN_ANALYTICS_STATS = (analytics: IAnalyticsData) => {
  const statsCardItem: IStatCard[] = [
    {
      icon: BookOpen,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      value: analytics?.overview.totalCourses || 0,
      label: 'Total Courses',
    },
    {
      icon: Users,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      value: analytics?.overview.totalStudents || 0,
      label: 'Total Students',
    },
    {
      icon: GraduationCap,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      value: analytics?.overview.totalEnrollments || 0,
      label: 'Total Enrollments',
    },
    {
      icon: TrendingUp,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      value: analytics?.overview.totalCourses
        ? Math.round(analytics.overview.totalEnrollments / analytics.overview.totalCourses)
        : 0,
      label: 'Avg Enrollments/Course',
    },
  ];

  return statsCardItem;
};

export const QUIZ_ANALYTICS_STATS = ({
  totalQuizzes,
  totalAttempts,
  avgScore,
  passRate,
}: IQuizzzAnalytics) => {
  const quizStatsCards: IStatCard[] = [
    {
      icon: ClipboardList,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      value: totalQuizzes,
      label: 'Total Quizzes',
    },
    {
      icon: Users,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      value: totalAttempts,
      label: 'Total Attempts',
    },
    {
      icon: TrendingUp,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      value: `${avgScore}%`,
      label: 'Average Score',
    },
    {
      icon: Award,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      value: `${passRate}%`,
      label: 'Pass Rate',
    },
  ];
  return quizStatsCards;
};

export const QUIZ_TABLE_ITEMS = [
  {
    title: 'Quiz',
    style,
  },
  {
    title: 'Course',
    style,
  },
  {
    title: 'Questions',
    style,
  },
  {
    title: 'Attempts',
    style,
  },
  {
    title: 'Avg Score',
    style,
  },
  {
    title: 'Created',
    style,
  },
  {
    title: 'Actions',
    style: 'px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase',
  },
];

export const ASSIGNMENT_ANALYTICS_STATS = ({
  totalAssignments,
  totalSubmissions,
  gradedSubmissions,
  pendingGrading,
}: IAssinmentAnalytics) => {
  const assignmentStatsCards: IStatCard[] = [
    {
      icon: FileText,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      value: totalAssignments,
      label: 'Total Assignments',
    },
    {
      icon: Users,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      value: totalSubmissions,
      label: 'Total Submissions',
    },
    {
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      value: gradedSubmissions,
      label: 'Graded',
    },
    {
      icon: Clock,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      value: pendingGrading,
      label: 'Pending Grading',
    },
  ];
  return assignmentStatsCards;
};

export const STUDENT_ANALYTICS_STATS = ({
  totalStudents,
  totalEnrollments,
  activeStudents,
  avgProgress,
}: IStudentAnalytics) => {
  const studentStatsCards: IStatCard[] = [
    {
      icon: UserCheck,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      value: totalStudents,
      label: 'Total Students',
    },
    {
      icon: GraduationCap,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      value: totalEnrollments,
      label: 'Total Enrollments',
    },
    {
      icon: TrendingUp,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      value: activeStudents,
      label: 'Active Students',
    },
    {
      icon: TrendingUp,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      value: `${avgProgress}%`,
      label: 'Average Progress',
    },
  ];

  return studentStatsCards;
};

export const DASHBOARD_ANALYTICS_STATS = (analytics: IAnalyticsData | null) => {
  const stats = [
    {
      title: 'Total Courses',
      value: analytics?.overview.totalCourses || 0,
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
      href: '/admin/course',
    },
    {
      title: 'Total Students',
      value: analytics?.overview.totalStudents || 0,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      href: '/admin/students',
    },
    {
      title: 'Total Enrollments',
      value: analytics?.overview.totalEnrollments || 0,
      icon: GraduationCap,
      color: 'bg-green-100 text-green-600',
      href: '/admin/analytics',
    },
    {
      title: 'Active Courses',
      value: analytics?.overview.totalCourses || 0,
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
      href: '/admin/course',
    },
  ];
  return stats;
};

export const ADMIN_DASHBOARD_CARDS = [
  {
    title: 'Manage Courses',
    description: 'Create, edit, and manage course content',
    icon: BookOpen,
    color: 'w-5 h-5 mr-2 text-blue-600',
    buttonText: 'Go to Courses',
    route: '/admin/course',
  },
  {
    title: 'Student Management',
    description: 'View and manage student enrollments',
    icon: Users,
    color: 'w-5 h-5 mr-2 text-purple-600',
    buttonText: 'View Students',
    route: '/admin/students',
  },
  {
    title: 'Analytics',
    description: 'View detailed platform analytics',
    icon: TrendingUp,
    color: 'w-5 h-5 mr-2 text-green-600',
    buttonText: 'View Analytics',
    route: '/admin/analytics',
  },
];

export const INSIDE_ASSIGNMENT_STATS = ({
  submissionsCount,
  gradedCount,
  pendingCount,
  assignmentDate,
}: {
  submissionsCount: number;
  gradedCount: number;
  pendingCount: number;
  assignmentDate: string;
}) => {
  const stats = [
    {
      icon: Users,
      value: submissionsCount,
      label: 'Submissions',
      bgColor: 'bg-blue-100',
      iconColor: 'w-5 h-5 text-blue-600',
    },
    {
      icon: CheckCircle,
      value: gradedCount,
      label: 'Graded',
      bgColor: 'bg-green-100',
      iconColor: 'w-5 h-5 text-green-600',
    },
    {
      icon: Clock,
      value: pendingCount,
      label: 'Pending',
      bgColor: 'bg-orange-100',
      iconColor: 'w-5 h-5 text-orange-600',
    },
    {
      icon: FileText,
      value: formatDate(assignmentDate),
      label: 'Created',
      bgColor: 'bg-purple-100',
      iconColor: 'w-5 h-5 text-purple-600',
    },
  ];

  return stats;
};

export const ASSIGNMENT_TABLE_ITEMS = [
  {
    title: 'Assignment',
    style,
  },
  {
    title: 'Course',
    style,
  },
  {
    title: 'Submissions',
    style,
  },
  {
    title: 'Graded',
    style,
  },
  {
    title: 'Created',
    style,
  },
  {
    title: 'Actions',
    style: 'px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase',
  },
];

export const CATEGORY_STATS = ({
  categoriesCount,
  activeCount,
  inactiveCount,
}: {
  categoriesCount: number;
  activeCount: number;
  inactiveCount: number;
}) => {
  const categoryStats = [
    {
      label: 'Total Categories',
      value: categoriesCount,
      valueColor: 'text-gray-900',
    },
    {
      label: 'Active',
      value: activeCount,
      valueColor: 'text-green-600',
    },
    {
      label: 'Inactive',
      value: inactiveCount,
      valueColor: 'text-orange-600',
    },
  ];

  return categoryStats;
};

export const CATEGORY_TABLE_ITEMS = [
  {
    title: 'Order',
    style: style + ' tracking-wider',
  },
  {
    title: 'Name',
    style: style + ' tracking-wider',
  },
  {
    title: 'Slug',
    style: style + ' tracking-wider',
  },
  {
    title: 'Description',
    style: style + ' tracking-wider',
  },
  {
    title: 'Status',
    style: style + ' tracking-wider',
  },
  {
    title: 'Created',
    style: style + ' tracking-wider',
  },
  {
    title: 'Actions',
    style: 'px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider',
  },
];

export const COURSE_STATS = ({
  coursesCount,
  publishedCount,
  draftCount,
  totalEnrollments,
}: {
  coursesCount: number;
  publishedCount: number;
  draftCount: number;
  totalEnrollments: number;
}) => {
  const courseStats = [
    {
      label: 'Total Courses',
      value: coursesCount,
      valueColor: 'text-gray-900',
    },
    {
      label: 'Published',
      value: publishedCount,
      valueColor: 'text-green-600',
    },
    {
      label: 'Draft',
      value: draftCount,
      valueColor: 'text-orange-600',
    },
    {
      label: 'Total Enrollments',
      value: totalEnrollments,
      valueColor: 'text-blue-600',
    },
  ];

  return courseStats;
};

export const COURSE_TABLE_ITEMS = [
  {
    title: ' Course',
    style: style + ' tracking-wider',
  },
  {
    title: 'Category',
    style: style + ' tracking-wider',
  },
  {
    title: ' Price',
    style: style + ' tracking-wider',
  },
  {
    title: ' Enrollments',
    style: style + ' tracking-wider',
  },
  {
    title: ' Status',
    style: style + ' tracking-wider',
  },
  {
    title: 'Created',
    style: style + ' tracking-wider',
  },
  {
    title: 'Actions',
    style: 'px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider',
  },
];

export const STUDENT_TABLE_ITEMS = [
  {
    title: ' Student',
    style,
  },
  {
    title: 'Course',
    style,
  },
  {
    title: ' Progress',
    style,
  },
  {
    title: 'Enrolled Date',
    style,
  },
  {
    title: ' Lessons Completed',
    style,
  },
  {
    title: 'Actions',
    style: 'px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase',
  },
];
