import React, { useContext } from 'react';  
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home.jsx';
import Result from './pages/Result';
import BuyCredit from './pages/BuyCredit.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Login from './components/Login.jsx';
import { AppContext } from './context/AppContext.jsx';

const App = () => {
  const context = useContext(AppContext);

  if (!context) return null; // Prevents error if context is undefined

  const { showLogin } = context; 

  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50'>
      <ToastContainer position='bottom-right' />

      <Navbar />
      {showLogin && <Login />}  
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/result' element={<Result />} />
        <Route path='/pricing' element={<BuyCredit />} />
      </Routes>
      <Footer />
    </div>
  );
};  

export default App;
