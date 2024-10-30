import { React, useEffect, useState } from 'react';
import webSocketService from '../../lib/api/requests/websocketservice';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginPage, setIsLoginPage] = useState(false);
  const isLoggedIn = !!localStorage.getItem('jwt');

  useEffect(() => {
    setIsLoginPage(location.pathname === '/login');
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.href = '/';
    webSocketService.close();
  };

  useEffect(() => {
    const handleIncomingMessage = (message) => {

      if (message.Type === 'TOAST') {
        showToast(message);
      }
    };

    webSocketService.addListener(handleIncomingMessage);

    return () => {
      webSocketService.removeListener(handleIncomingMessage);
    };
  }, []);

  const showToast = (message) => {
    //make duration longer based on text length
    const duration = message.Message.length > 100 ? 10000 : 5000;

    if (message.ToastType === "DEFAULT") {
      toast(message.Message, {
        autoClose: duration,
      });
    } else {
      toast[message.ToastType.toLowerCase()](message.Message, {
        autoClose: duration,
      });
    }
  }

  return (
    <>
      <div className="header">
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="logo" />
        </div>

        {isLoggedIn && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
      <div>

        {/* Different location of toast based on what page youre on. More spacing on non login-pages. */}
        <ToastContainer
          position="top-right"
          style={{
            top: isLoginPage ? '80px' : '145px',
            right: isLoginPage ? null : '32px',
          }}
        />
      </div>
    </>
  );
}
