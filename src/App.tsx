import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';

const App: React.FC = () => {
  const [isSidebarOpen] = useState(true);

  const responseMessage = (response: any) => {
    console.log(response);
    // Redirect to the main page upon successful login
    window.location.href = '/chat';
  };

  const errorMessage = (error: any) => {
    console.log(error);
  };

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
