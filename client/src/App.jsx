import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm'; // Import LoginForm if separate from AuthPage
import DashboardPage from './components/DashboardPage';
import ShareLink from './components/ShareLink';
import QuestionAnalysis from './components/QuestionAnalysis'; // Import the new component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        
      <Route path="/dashboard/:userId/*" element={<DashboardPage />} />
      <Route path="/ShareLink/:quizId/*" element={<ShareLink />}/>
      <Route path="/dashboard/:userId/question-analysis/:quizId" element={<QuestionAnalysis />} />
      </Routes>
      
    </Router>
  );
}

export default App;
