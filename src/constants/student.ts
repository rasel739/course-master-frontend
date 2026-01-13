import { IStatCard } from '@/types';
import { Award, BookOpen, Calendar, Clock, TrendingUp } from 'lucide-react';

export const STUDENT_ANALYTICS_STATS = ({
  enrollmentCount,
  enrollmentProgress,
  enrollmentCompleted,
  enrollmentTotalProgress,
}: {
  enrollmentCount: number;
  enrollmentProgress: number;
  enrollmentCompleted: number;
  enrollmentTotalProgress: number;
}) => {
  const stats: IStatCard[] = [
    {
      label: 'Enrolled Courses',
      value: enrollmentCount,
      icon: BookOpen,
      iconColor: 'bg-blue-100 text-blue-600',
      bgColor: '',
    },
    {
      label: 'In Progress',
      value: enrollmentProgress,
      icon: TrendingUp,
      iconColor: 'bg-purple-100 text-purple-600',
      bgColor: '',
    },
    {
      label: 'Completed',
      value: enrollmentCompleted,
      icon: Award,
      iconColor: 'bg-green-100 text-green-600',
      bgColor: '',
    },
    {
      label: 'Total Progress',
      value: enrollmentTotalProgress,
      icon: Clock,
      iconColor: 'bg-orange-100 text-orange-600',
      bgColor: '',
    },
  ];

  return stats;
};

export const CERTIFICATE_STATS = ({
  certificateCount,
  latestCertificateDate,
}: {
  certificateCount: number;
  latestCertificateDate: string;
}) => {
  const stats = [
    {
      icon: Award,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      value: certificateCount,
      label: 'Total Certificates',
    },
    {
      icon: BookOpen,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      value: certificateCount,
      label: 'Courses Completed',
    },
    {
      icon: Calendar,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      value: latestCertificateDate,
      label: 'Latest Certificate',
    },
  ];

  return stats;
};

export const CHECKOUT_STEPS = [
  {
    id: 1,
    title: 'Access Your Courses',
    description: 'Head to your dashboard to start learning immediately.',
  },
  {
    id: 2,
    title: 'Download Resources',
    description: 'Download supplementary materials for offline learning.',
  },
  {
    id: 3,
    title: 'Earn Your Certificate',
    description: 'Complete the course to receive your verified certificate.',
  },
];
