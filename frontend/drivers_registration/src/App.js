// App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Register from './pages/Register';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import VerificationMessage from './pages/VerificationMessage';
import Home from './pages/home/Home';
import Profile from './pages/Profile';
import Bluebook from './pages/userDashboard/Bluebook';
import MainDashboard from './pages/userDashboard/NewDashboard';
import Timers from './pages/timer';
import { UserTable } from './dashboard/UserTable';
import UserRoutes from './ProtectedRoutes/userRoutes';
import AdminRoutes from './ProtectedRoutes/adminRoutes';
import SearchPage from './pages/userDashboard/ViewFine';
import AdminPanel from './dashboard/AdminBluebook';
import CreateBluebook from './pages/userDashboard/createBluebook';
import BluebookDetails from './pages/userDashboard/BluebookDetails';
import CreateLicense from './pages/userDashboard/CreateLicense';
import License from './pages/userDashboard/License';
import LicenseModel from './pages/userDashboard/LicenseModel';
import ConfirmationMessage from './pages/userDashboard/ConfirmationMessage';
import Dashboard from './dashboard/MainDashboard';
import AdminMainDash from './dashboard/AdminMainDash';
import AdminLicense from './dashboard/AdminLicense';
import ViewBluebookDetails from './dashboard/ViewDetailsAdmin';
import AdminLogin from './pages/adminLogin';
import ShareSection from './pages/userDashboard/ShareBluebook';
import BluebookComponent from './pages/userDashboard/BluebookShareBox';
import ViewSharedBluebook from './pages/userDashboard/ViewSharedBluebook';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Maindashboard" element={<Dashboard />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/verify" element={<VerificationMessage />} />
       
        <Route path="/timer" element={<Timers />} />
        {/* Wrap protected routes with userRoutes */}
        <Route element={<UserRoutes/>}>
          <Route path="/dashboards/*" element={<MainDashboard />} />
          <Route path="/profile" element={<Profile />} />
        <Route path="/license/create" element={<CreateLicense />} />
        <Route path="/license" element={<License />} />
        <Route path="/licenseModel" element={<LicenseModel/>} />
        <Route path="/confirmation" element={<ConfirmationMessage/>} />
        <Route path="/bluebook" element={<Bluebook />} />
        <Route path="/bluebook/create" element={<CreateBluebook />} />
        <Route path="/bluebook/viewDetails/:bluebookId" element={<BluebookDetails />} />
        <Route path="/search" element={<SearchPage/>} />
        <Route path="/bluebook/share" element={<ShareSection />} />
        <Route path="/bluebook/component" element={<BluebookComponent />} />
        <Route path="/bluebook/sharedBluebook" element={<ViewSharedBluebook />} />


        </Route>
        <Route element={<AdminRoutes/>}>
        <Route path="/admin/mainDashboard" element={<AdminMainDash />} />
        <Route path="/admin/Userdashboard" element={<UserTable />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminPanel/>} />
        <Route path="/admin/license" element={<AdminLicense/>} />
        <Route path="/admin/bluebook/viewDetails/:bluebookId" element={<ViewBluebookDetails/>}/>
        
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
