// SignedOut.tsx
import React from 'react';
import { Button, Menu } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from '../../store/user/userSlice';
import SignedIn from './SignedIn';


export default function SignedOut({ signIn }: { signIn: () => void }) {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: any) => state.auth);
  const email = useSelector((state: any) => state.auth.email);
  const dispatch = useDispatch();

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = 'white';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };


  
  const handleLoginClick = () => {
    navigate('/login');
  };


  const handleLogout = () => {
    dispatch(logoutSuccess());
    localStorage.removeItem('token');
  };

  return (
    <Menu.Item>
      {isAuthenticated.id === 0 && (
        <Button
          onClick={handleLoginClick}
          type="button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="transparent-button"
        >
          <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
          Giriş Yap
        </Button>
      )}

      {isAuthenticated.id === 0 && (
        <Button
          type="button"
          onClick={handleRegisterClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="transparent-button"
        >
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Kayıt Ol
        </Button>
      )}

      {isAuthenticated.id !== 0 &&  (
        <>
          <span>
            <SignedIn/>
          </span>
        </>
      )}
    </Menu.Item>
  );
}
