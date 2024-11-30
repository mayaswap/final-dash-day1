import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { config } from './config/wagmi';
import Navbar from './components/layout/Navbar';
import AllPools from './pages/AllPools';
import MyPools from './pages/MyPools';
import PoolDetails from './pages/PoolDetails';

function App() {
  return (
    <WagmiConfig config={config}>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Navigate to="/all-pools" replace />} />
              <Route path="/all-pools" element={<AllPools />} />
              <Route path="/my-pools" element={<MyPools />} />
              <Route path="/pool/:id" element={<PoolDetails />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </WagmiConfig>
  );
}

export default App;