import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

function Whatsapp() {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };


    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div>
            {isVisible && (
                <button   
                    style={{
                        backgroundColor: '#25D366',
                        color: '#ffffff',
                        fontSize: '16px',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        position: 'fixed',
                        bottom: '15px',
                        right: '15px',
                        zIndex: '1000'
                    }}
                >
                    <FaWhatsapp size={20} style={{ marginRight: '10px' }} />
                    WhatsApp
                </button>
            )}
        </div>
    );
}

export default Whatsapp;
