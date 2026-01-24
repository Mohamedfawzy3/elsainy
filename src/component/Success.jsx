import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const phone = location.state?.phone;
  const connectionRef = useRef(null);

useEffect(() => {
  const handleUserData = (userData) => {
    console.log('>>> SIGNALR DATA RECEIVED <<<', userData);
/**
 * Handles the received user data from the SignalR hub.
 * Logs the received data and updates the component state
 * with the received color code and code.
 * If the received data is null or undefined, it does nothing.
 * If the received data contains a color code, it updates the component
 * state with the new color code.
 * If the received data contains a code, it updates the component
 * state with the new code.
 * Finally, it stops loading the component ONLY when real data arrives.
 * @param {object} userData The received user data from the SignalR hub.
 */
    if (!userData) return;

    if (userData.colorCode) setColor(userData.colorCode);
    if (userData.code) setCode(userData.code);

    setLoading(false); // stop loading ONLY when real data arrives
  };

  // Listen to all users (no phone)
  const connection = new signalR.HubConnectionBuilder()
    .withUrl('https://prototype.runasp.net/userData')
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();

  connectionRef.current = connection;

  connection.on('GetUserStatus', handleUserData);
  connection.on('UserDataUpdated', handleUserData);
  connection.on('UserVerified', handleUserData);
  connection.on('ReceiveUserData', handleUserData);

  const start = async () => {
    try {
      await connection.start();
      console.log('SignalR Connected');
    } catch (err) {
      console.error('SignalR Error:', err);
      setTimeout(start, 5000);
    }
  };

  start();

  return () => {
    if (connectionRef.current) {
      connectionRef.current.stop();
    }
  };
}, []);



  const rgbColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <style jsx>{`

        .custom-card {
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.4s ease;
        }

        .custom-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .color-box {
          width: 140px;
          height: 140px;
          border-radius: 20px;
          margin: 0 auto 30px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transition: all 0.5s ease;
          animation: pulse 2s infinite alternate;
        }

        @keyframes pulse {
          0% { box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); }
          100% { box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25); }
        }

        .code-display {
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: 8px;
          color: #1a1a1a;
        }

        .success-icon {
          font-size: 4rem;
          color: #28a745;
          margin-bottom: 20px;
        }
          .modern-btn {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: #fff;
  border: none;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.35);
}

.modern-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(40, 167, 69, 0.45);
  background: linear-gradient(135deg, #20c997, #28a745);
}

      `}</style>

      <div className="custom-card p-5 animate__animated animate__fadeInUp text-center" style={{ maxWidth: '450px', width: '100%' }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3 text-muted">تم ارسال رساله التحقق الى رقم {phone} وفى انتظار اكتمال التحقق...</p>
          </div>
        ) : (
          <>
            <div className="success-icon animate__animated animate__bounceIn">
              ✓
            </div>

            <h2 className="mb-4 fw-bold" style={{ fontSize: '2rem', color: '#28a745' }}>
              تم التحقق بنجاح!
            </h2>

            <div 
              className="color-box animate__animated animate__zoomIn"
              style={{ backgroundColor: rgbColor }}
            ></div>

            <h3 className="code-display mb-4 animate__animated animate__fadeIn animate__delay-1s">
              {code || '—'}
            </h3>

            <p className="text-muted" style={{ fontSize: '1.1rem' }}>
              تم التحقق من رقم الجوال بنجاح
            </p>
            <button
  onClick={() => navigate('/')}
  className="btn modern-btn mt-4"
>
  العودة إلى الصفحة الرئيسية
</button>

          </>
        )}
      </div>
    </div>
  );
};

export default Success;