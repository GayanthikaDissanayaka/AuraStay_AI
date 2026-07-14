import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Hotel from "./pages/Hotel";
import Guest from "./pages/Guest";
import ServiceRequest from "./pages/ServiceRequest";
import FoodMenu from "./pages/FoodMenu";
import Housekeeping from "./pages/Housekeeping";
import Chatbot from "./pages/Chatbot";
import Facilities from "./pages/Facilities";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Admin Panel with Nested Routes */}
      <Route path="/admin" element={<Admin />}>
        <Route index element={<Dashboard />} />
        <Route path="hotel" element={<Hotel />} />
        <Route path="guest" element={<Guest />} />
        <Route path="servicerequest" element={<ServiceRequest />} />
        <Route path="foodmenu" element={<FoodMenu />} />
        <Route path="housekeeping" element={<Housekeeping />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}

export default App;