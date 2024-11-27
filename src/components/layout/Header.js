import { React, useEffect, useState } from 'react';
import webSocketService from '../../lib/api/requests/websocketservice';
import { useNavigate, useLocation } from 'react-router-dom';
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
      <div className="tailwind-wrapper">
        <div className="flex justify-between items-center bg-black px-[30px] py-[10px] h-[80px] text-white">
          <div className="cursor-pointer"
            onClick={() => {
              window.location.href = '/';
            }}>
            <img src="/images/logo.png" alt="logo" className="h-[50px]" />
          </div>

          {isLoggedIn && (
            <div className="flex space-x-12">

              <button className="bg-transparent text-white border-2 border-white py-1 px-2.5 cursor-pointer text-base rounded-full hover:bg-gray-600">
                Replays
              </button>

              <button className="bg-transparent text-white border-2 border-white py-1 px-2.5 cursor-pointer text-base rounded-full hover:bg-gray-600">
                Statistics
              </button>

              <button className="bg-transparent text-white border-2 border-white py-1 px-2.5 cursor-pointer text-base rounded-full hover:bg-gray-600" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
        <div>

          {/* Dont use tailwind for absolute positioning, move the toast inside the chatbox when not on login page */}
          <ToastContainer
            position="top-right"
            style={{
              top: isLoginPage ? '80px' : '153px',
              right: isLoginPage ? null : '32px',
            }}
          />
        </div>
      </div>
    </>
  );
}
