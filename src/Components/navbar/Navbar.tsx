import React from 'react';
import './Navbar.css';
import avootaLogo from '../../asserts/logo/avootalogo.png';
import bellIcon from '../../asserts/icons/bell.png';
import logoutIcon from '../../asserts/icons/logout.png';
import userIcon from '../../asserts/icons/user.png';
import searchIcon from '../../asserts/icons/search.png';

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="navbar">
      <div className="logo-container">
        <img src={avootaLogo} alt="avoota logo" className="avoota-logo" />
      </div>

      <div className="search-bar">
        <span className="search-icon">
            <img src={searchIcon} alt="search" className='nav-icon'/>
        </span>
        <input
          type="text"
          placeholder="Search"
          onChange={handleSearchChange}
        />
      </div>

      <div className="nav-icons">
        <img src={bellIcon} alt="Notifications" className="nav-icon" />
        <img src={logoutIcon} alt="Logout" className="nav-icon logout-icon" />
        <img src={userIcon} alt="User Profile" className="user-avatar" />
      </div>
    </div>
  );
};

export default Navbar;
