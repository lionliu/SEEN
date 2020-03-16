import React from 'react'
import './drawerButton.css'

const logo = require('../../../assets/iotflowslogo.jpg')

const drawerButton = props => (
    <button className='toggle-button' onClick={props.click}>
        <img alt='Burguer Toggle Button' className='buttonImg' src={logo}></img>
    </button>
);


export default drawerButton;