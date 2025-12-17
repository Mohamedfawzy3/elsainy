import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Success = () => {
  const [color, setColor] = useState({ r: 160, g: 90, b: 220 }); 

  const [code, setCode] = useState(''); 
  const location = useLocation();
  const phone = location.state?.phone; 

  useEffect(() => {
    if (!phone) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          '/api/ValidatePhoneNumber/Get User Data'
        
        
        );

        if (response.data?.userData?.colorCode) {
          setColor(response.data.userData.colorCode);
          setCode(response.data.userData.code);
        }
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };

    fetchUserData();
  }, [phone]);

 
  const rgbColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

  return (
    <div className="card p-4 text-center mx-auto mt-5" style={{ maxWidth: '400px' }}>
        <h2 style={{ background: rgbColor,width:"100px",height:"50px" }} className=' m-auto mb-3'></h2>
                <h2 >{code}</h2>

      <h2 style={{ color: "#28a745" }}>Success!</h2>
      <p>Your verification is complete.</p>
    </div>
  );
};

export default Success;
