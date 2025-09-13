import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaComments, 
  FaVirus, 
  FaSyringe, 
  FaExclamationTriangle,
  FaUserCircle
} from 'react-icons/fa';

const Nav = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${props => props.isOpen ? '0' : '-100%'};
    width: 100%;
    height: 100vh;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    justify-content: center;
    transition: right 0.3s ease;
    z-index: 1001;
  }
`;

const NavLink = styled(Link)`
  color: #495057;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }

  &.active {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 1rem;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: #495057;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  min-width: 200px;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s ease;
  z-index: 1002;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #495057;
  text-decoration: none;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #dc3545;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(220, 53, 69, 0.1);
  }
`;

const MobileToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: #495057;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/chat', label: 'Chat', icon: FaComments },
    { path: '/diseases', label: 'Diseases', icon: FaVirus },
    { path: '/vaccination', label: 'Vaccination', icon: FaSyringe },
    { path: '/alerts', label: 'Alerts', icon: FaExclamationTriangle },
  ];

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          🏥 HealthBot
        </Logo>

        {user ? (
          <>
            <NavMenu isOpen={isMobileMenuOpen}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={location.pathname === item.path ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >
                    <Icon />
                    {item.label}
                  </NavLink>
                );
              })}
            </NavMenu>

            <UserMenu>
              <UserButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <FaUserCircle size={24} />
              </UserButton>
              
              <Dropdown isOpen={isUserMenuOpen}>
                <DropdownItem to="/profile" onClick={() => setIsUserMenuOpen(false)}>
                  <FaUser />
                  Profile
                </DropdownItem>
                <LogoutButton onClick={handleLogout}>
                  <FaSignOutAlt />
                  Logout
                </LogoutButton>
              </Dropdown>
            </UserMenu>

            <MobileToggle onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </MobileToggle>
          </>
        ) : (
          <NavMenu>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </NavMenu>
        )}
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
