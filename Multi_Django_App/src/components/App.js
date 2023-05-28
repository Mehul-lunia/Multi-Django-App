import React from 'react'
import { render } from 'react-dom'
import NavbarComponent from './NavbarComponent';

const App = () => {
    return (
        <>
            <NavbarComponent />
        </>
    )
}

export default App

const appDiv = document.getElementById('app');
render(<App />, appDiv)