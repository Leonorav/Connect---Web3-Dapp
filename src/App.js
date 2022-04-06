import React from "react";

import WalletEther from './Wallet';
import logo from './metamask.png';
import './App.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
      </header>
    
        <WalletEther/>
     
    </div>
  );
}

export default App;
