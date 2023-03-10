import React from 'react';
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';

import NotFound from 'components/NotFound';
import LoginPage from 'containers/login';
import DashboardPage from 'containers/dashboard';

console.log('process.env.REACT_APP_ENV', process.env.REACT_APP_ENV)

const isHashRouter = false;

function App() {
  const Router = isHashRouter ? HashRouter : BrowserRouter;
  return (
    <Router basename='/wen-base'>
      <Routes>
        <Route path="dashboard/*" element={<DashboardPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
