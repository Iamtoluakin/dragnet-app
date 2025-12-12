import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Dashboard from './components/Dashboard/Dashboard';
import CourseModule from './components/CourseModule/CourseModule';
import Profile from './components/Profile/Profile';
import Community from './components/Community/Community';
import Assessment from './components/Assessment/Assessment';
import Notification from './components/Notification/Notification';
import Reporting from './components/Reporting/Reporting';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course" element={<CourseModule />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<Community />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/report" element={<Reporting />} />
      </Routes>
    </Router>
  );
}

export default App;
