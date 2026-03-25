import {Navigate, Route, Routes } from "react-router-dom"; 
import { RegisterForm } from "../../modules/auth/pages/RegisterForm";
import { SignIn } from "../../modules/auth/pages/LoginForm";
import ProtectedRoute from "../components/ProtectedRoute";
import { Dashboard } from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";

export default function AppRoutes() {
    return(
        <Routes>
            <Route path="/" element={<Navigate to="/register"/>} />
            <Route path="/register" element={<RegisterForm/>} />
            <Route path="/login" element={<SignIn/>}/>
           <Route 
           path="/dashboard"
           element={
            <ProtectedRoute>
                <Dashboard/>
            </ProtectedRoute>
           }
           />
           <Route 
           path="/admin" 
           element={
            <ProtectedRoute adminOnly={true}>
               <AdminDashboard/>
            </ProtectedRoute>
           }
           />
        </Routes>
    );
}