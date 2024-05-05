import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';

const App: React.FC = () => {
  const [isSidebarOpen] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/chat" element={<MainPage isSidebarOpen={isSidebarOpen} />} />
      </Routes>
    </Router>
  );
}

export default App;
