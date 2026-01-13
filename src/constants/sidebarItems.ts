import { Icons } from '@/lib/icons';
import { useAppSelector } from '@/redux/hook';
import { USER_ROLE } from './role';

export const SidebarItems = (role: string) => {
  const { unreadCount } = useAppSelector((state) => state.chat);
  const defaultSidebarItems = [
    {
      name: 'Dashboard',
      path: `/${role}`,
      icon: Icons.Dashboard,
    },

    { name: 'Courses', path: `/${role}/course`, icon: Icons.Courses },
    {
      name: 'Chat',
      path: `/${role}/chat`,
      icon: Icons.Chat,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  const studentSidebarItems = [
    ...defaultSidebarItems,
    { name: 'My Enrollments', path: `/${role}/enrollment`, icon: Icons.MyEnrollments },
    { name: 'Certificates', path: `/${role}/certificates`, icon: Icons.Certificates },
    { name: 'Profile', path: `/${role}/profile`, icon: Icons.Profile },
    { name: 'Settings', path: `/${role}/settings`, icon: Icons.Settings },
  ];

  const adminSidebarItems = [
    ...defaultSidebarItems,
    { name: 'Categories', path: `/${role}/categories`, icon: Icons.Categories },
    { name: 'Students', path: `/${role}/students`, icon: Icons.Profile },
    { name: 'Assignments', path: `/${role}/assignments`, icon: Icons.Assignments },
    { name: 'Quizzes', path: `/${role}/quizzes`, icon: Icons.Quizzes },
    { name: 'Analytics', path: `/${role}/analytics`, icon: Icons.Analytics },
  ];

  switch (role) {
    case USER_ROLE.ADMIN:
      return adminSidebarItems;
    case USER_ROLE.STUDENT:
      return studentSidebarItems;
    default:
      return defaultSidebarItems;
  }
};
