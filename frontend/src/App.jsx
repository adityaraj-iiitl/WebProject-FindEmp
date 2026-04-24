import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddJob from './pages/AddJob';
import Login from './pages/Login';
import Register from './pages/Register';
import AIChatbot from './components/AIChatbot';

import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/company/:name" element={<CompanyDetail />} />
          <Route path="/add-job" element={<AddJob />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <AIChatbot />
      </div>
    </Router>
  );
}

export default App;
