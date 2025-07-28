import React from 'react';
import {Phone ,Mail, GitHub, LinkedIn} from '@mui/icons-material'
import '../componentStyles/Footer.css'

function Footer() {
  return (
   <footer className="footer">
    <div className="footer-container">
        {/* Section1 */}
        <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p><Phone fontSize='small'/>Phone : +201094873443</p>
            <p><Mail fontSize='small'/>Email : hani.darklt@gmail.com</p>
        </div>

        {/* Section2 */}
        <div className="footer-section social">
            <h3>Follow me</h3>
            <div className="social-links">
                <a href="https://github.com/hanijack" target="_blank">
                    <GitHub className='social-icon'/>
                </a>
                <a href="https://www.linkedin.com/in/mohamad-darklt-892834208/" target="_blank">
                    <LinkedIn className='social-icon'/>
                </a>
                
            </div>
        </div>

        {/* Section3 */}
        <div className="footer-section about">
            <h3>About</h3>
            <p>This is an awesome website for buying and selling products</p>
        </div>
    </div>
    <div className="footer-bottom">
        <p>&copy; 2025 Hani Darklt . All rights reserved</p>
    </div>
   </footer>
  )
}

export default Footer
