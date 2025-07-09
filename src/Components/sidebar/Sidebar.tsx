import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { SidebarProps } from '../../type/SidebarProps';


const Sidebar: React.FC<SidebarProps> = ({
  activeMenuItem,
  onMenuItemClick,
}) => {
  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Add Hotel', path: '/add-hotel' },
    { name: 'Properties', path: '/properties' },
    { name: 'Room & Rateplan', path: '/room-rateplan' },
    { name: 'Room Allocated Count', path: '/inventory-entry' }, // ✅ FIXED PATH
    { name: 'Inventory', path: '/inventory' },
  ];

  return (
    <div className="sidebar">
      {/* Optional logo */}
      {/* <img src={AvootaLogo} alt="Logo" className="sidebar-logo" /> */}
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={activeMenuItem === item.name ? 'active-menu-item' : ''}
          >
            <Link
              to={item.path}
              onClick={() => onMenuItemClick(item.name)}
              className="sidebar-link"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
