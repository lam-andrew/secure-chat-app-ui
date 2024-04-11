import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage onSuccess={responseMessage} onError={errorMessage} />} />
        <Route path="/chat" element={<MainPage isSidebarOpen={isSidebarOpen} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
