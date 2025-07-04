import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { SidebarProps } from '../../type/SidebarProps';
import AvootaLogo from '../../assets/logo/avootalogo.png';

const Sidebar: React.FC<SidebarProps> = ({
  activeMenuItem,
  onMenuItemClick,
}) => {
  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Add Hotel', path: '/add-hotel' },
    { name: 'Properties', path: '/properties' },
    { name: 'Room & Rateplan', path: '/room-rateplan' },
    { name: 'Room Allocated Count', path: '/room-count' },
    { name: 'Inventory', path: '/inventory' },
  ];

  return (
    <div className="sidebar">
    
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.name} className={activeMenuItem === item.name ? 'active-menu-item' : ''}>
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
