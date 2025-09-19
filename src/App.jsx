import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import Courses from "@/components/pages/Courses";
import Assignments from "@/components/pages/Assignments";
import Grades from "@/components/pages/Grades";
import Schedule from "@/components/pages/Schedule";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="h-screen bg-slate-50">
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        
        <div className="lg:pl-64">
          <main className="min-h-screen">
            <div className="p-4 lg:p-8">
              <Routes>
                <Route 
                  path="/" 
                  element={<Dashboard onMenuClick={handleMenuClick} />} 
                />
                <Route 
                  path="/courses" 
                  element={<Courses onMenuClick={handleMenuClick} />} 
                />
                <Route 
                  path="/assignments" 
                  element={<Assignments onMenuClick={handleMenuClick} />} 
                />
                <Route 
                  path="/grades" 
                  element={<Grades onMenuClick={handleMenuClick} />} 
                />
                <Route 
                  path="/schedule" 
                  element={<Schedule onMenuClick={handleMenuClick} />} 
                />
              </Routes>
            </div>
          </main>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;