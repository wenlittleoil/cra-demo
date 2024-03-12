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
import VideoPage from 'containers/video';
import WebrtcPage from 'containers/webrtc';
import Webrtc2Page from 'containers/webrtc2';
import ThreejsPage from 'containers/threejs';
import LfuPage from 'containers/large-file-upload';

console.log('process.env.REACT_APP_ENV', process.env.REACT_APP_ENV)

const isHashRouter = false;

function App() {
  const Router = isHashRouter ? HashRouter : BrowserRouter;
  return (
    <Router basename='/wen-base'>
      <Routes>
        <Route path="dashboard/*" element={<DashboardPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="video" element={<VideoPage />} />
        <Route path="webrtc" element={<WebrtcPage />} />
        <Route path="webrtc2" element={<Webrtc2Page />} />
        <Route path="large-file-upload" element={<LfuPage />} />
        <Route path="threejs" element={<ThreejsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
