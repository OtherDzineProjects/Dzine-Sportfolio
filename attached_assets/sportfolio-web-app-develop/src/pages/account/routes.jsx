import { lazy } from 'react';

const Dashboard = lazy(() => import('./dashboard'));
const Profile = lazy(() => import('./profile'));
const Verification = lazy(() => import('./verification'));
const Notifications = lazy(() => import('./notifications'));
const Settings = lazy(() => import('./settings'));

import { routes as userRoutes } from './users/routes';
import { routes as orgRoutes } from './organizations/routes';


const routes = [{
  path: '',
  element: <Dashboard />
}, {
  path: 'dashboard',
  element: <Dashboard />
},
{
  path: 'users',
  children: [
    ...userRoutes
  ]
},
{
  path: 'organizations',
  children: [
    ...orgRoutes
  ]
},
{
  path: 'verification',
  element: <Verification />
},
{
  path: 'notifications',
  element: <Notifications />
},
{
  path: 'user/profile/:userId/edit',
  element: <Profile />
},
{
  path: 'user/profile/:userId/view',
  element: <Profile />
},
{
  path: 'settings',
  element: <Settings />
}];

export { routes };
