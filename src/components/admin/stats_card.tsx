import {
  IAnalyticsData,
  IAssinmentAnalytics,
  IQuizzzAnalytics,
  IStatCard,
  IStudentAnalytics,
} from '@/types';
import { Card, CardContent } from '../ui/card';

type StatsCardProps = {
  analytics: IAnalyticsData | IQuizzzAnalytics | IAssinmentAnalytics | IStudentAnalytics;
  ANALYTICS_STATS: (
    data: IAnalyticsData | IQuizzzAnalytics | IAssinmentAnalytics | IStudentAnalytics
  ) => IStatCard[];
};

const StatsCard = ({ analytics, ANALYTICS_STATS }: StatsCardProps) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {analytics &&
        ANALYTICS_STATS(analytics)?.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <h3 className='text-3xl font-bold text-gray-900 mb-1'>{stat.value}</h3>
                <p className='text-sm text-gray-600'>{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
};

export default StatsCard;
