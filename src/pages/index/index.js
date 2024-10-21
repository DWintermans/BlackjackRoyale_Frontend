import React from 'react';
import { useNavigate } from 'react-router-dom';

import Footer from '../../components/layout/Footer.js';
import Header from '../../components/layout/Header.js';

export default function Index() {
    const navigate = useNavigate();
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',  // To center vertically
        },
        button: {
            margin: '10px',
            padding: '15px 30px',
            fontSize: '18px',
            cursor: 'pointer',
            backgroundColor: '#636363',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            width: '200px',
            height: '50px',
        }
    };

    return (
        <div>
            <Header />

            <div style={styles.container}>
                <button style={styles.button} onClick={() => navigate('/login')}>Play</button>
                <button style={styles.button} onClick={() => navigate('/how-to-play')}>How to Play</button>
                <button style={styles.button} onClick={() => navigate('/leaderboard')}>Leaderboard</button>
            </div>

            <Footer />
        </div>
    );
}
