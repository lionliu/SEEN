import React from 'react';
import './Header.css';

const logo = require('../../../assets/iotflowslogo.jpg')

export default function Header() {
    return (
        <header className='toolbar'>
            <nav className='toolbar_navigation'>
                <div className='logoContainer'>
                    <img alt='Burguer Toggle Button' className='buttonImg' src={logo}></img>
                </div>
            </nav>
        </header>
    )
}
