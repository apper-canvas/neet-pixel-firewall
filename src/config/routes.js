import Dashboard from '@/components/pages/Dashboard';
import TakeTest from '@/components/pages/TakeTest';
import TestInterface from '@/components/pages/TestInterface';
import Results from '@/components/pages/Results';
import Profile from '@/components/pages/Profile';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'Home',
    component: Dashboard,
    showInNav: true
  },
  takeTest: {
    id: 'takeTest',
    label: 'Take Test',
    path: '/take-test',
    icon: 'BookOpen',
    component: TakeTest,
    showInNav: true
  },
  testInterface: {
    id: 'testInterface',
    label: 'Test',
    path: '/test/:testId',
    icon: 'Clock',
    component: TestInterface,
    showInNav: false
  },
  results: {
    id: 'results',
    label: 'Results',
    path: '/results',
    icon: 'BarChart3',
    component: Results,
    showInNav: true
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile,
    showInNav: true
  }
};

export const routeArray = Object.values(routes);
export default routes;