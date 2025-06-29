import { lazy } from 'react';

const SignIn = lazy(() => import('./components/SignIn'));
const SignUp = lazy(() => import('./components/signup'));
const ProblemSignIn = lazy(() => import('./components/ProblemSignIn'));


const routes = [{
  path: '',
  element: <SignIn />
}, {
  path: 'signin',
  element: <SignIn />
},
{
  path: 'signup',
  element: <SignUp />
},
{
  path: 'problem/signin',
  element: <ProblemSignIn />
}];

export { routes };
