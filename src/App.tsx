import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Components/sidebar/Sidebar';
import Navbar from './Components/navbar/Navbar';
import AddHotel from './Components/addHotel/AddHotel';

import './App.css';

const App: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Home');

  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
  };

  return (
    <div className="app-container">
      {/* Top navbar */}
      <Navbar onSearch={() => {}} />

      {/* Sidebar + Content layout */}
      <div className="main-content">
        <Sidebar
          activeMenuItem={activeMenuItem}
          onMenuItemClick={handleMenuItemClick}
        />

        {/* Dynamic content area */}
        <div className="content-area">
          <Routes>
            <Route path="/add-hotel" element={<AddHotel />} />
            {/* Add other routes like Home, Properties, etc. */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
