import React from 'react'

import './toolbar.css'
import DrawerToggleButton from '../layout/sideDrawer/drawerButton'

const Toolbar = props => (
    <header className='toolbar'>
        <nav className='toolbar_navigation'>
            <div className='logo-toggler'>
                <DrawerToggleButton click={props.drawerClickHandler} />
            </div>
        </nav>
    </header>
);

export default Toolbar;
