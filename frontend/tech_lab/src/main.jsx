import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';   // 🔥 eksik olan import eklendi
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';


const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const TechPage = React.lazy(() => import('./pages/TechPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));

const router = createBrowserRouter([
  { 
    path: '/', 
    element: <App />, 
    children: [
      { 
        index: true, 
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LoginPage/>
          </Suspense>
        ) 
      },
      { 
        path: 'tech', 
        element: (
          <Suspense fallback={null}>
            <TechPage/>
          </Suspense>
        ) 
      },
      { 
        path: 'admin', 
        element: (
          <Suspense fallback={null}>
            <AdminPage/>
          </Suspense>
        ) 
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
