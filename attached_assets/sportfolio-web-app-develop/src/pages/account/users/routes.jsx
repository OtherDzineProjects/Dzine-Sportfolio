import { lazy } from 'react';
import StepBasic from '../profile/components/Steps/StepBasic';

const UserList = lazy(() => import('./index'));
const UserProfile = lazy(() => import('./components/UserProfile'));


const routes = [{
  path: '',
  element: <UserList />
},
{
  path: ':userId',
  element: <UserProfile />
},
{
  path: ':userId/profile',
  element: <UserProfile />
},
{
  path: ':userId/profile/edit/basic',
  element: <StepBasic />
}

];

export { routes };
