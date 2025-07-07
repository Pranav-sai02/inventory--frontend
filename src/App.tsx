import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Components/sidebar/Sidebar';
import Navbar from './Components/navbar/Navbar';
import AddHotel from './Components/addHotel/AddHotel';
import PropertiesPage from './Components/PropertiesPage/PropertiesPage';
import RoomList from './Components/room-rateplan/RoomList';
import CreateRoom from './Components/create-room/CreateRoom';
import AddRatePlanPage from './Components/room-rateplan/AddRatePlanPage';

// ✅ Import RoomInventoryEntry component
import RoomInventoryEntry from './Components/RoomInventory/RoomInventoryEntry';

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
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/room-rateplan" element={<RoomList />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/add-rateplan" element={<AddRatePlanPage />} />

            {/* ✅ New route for inventory entry */}
            <Route path="/inventory-entry" element={<RoomInventoryEntry />} />

            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
