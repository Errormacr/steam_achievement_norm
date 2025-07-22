import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTopButton from './ScrollToTopButton';
import Header from './Header';
import '../styles/scss/Layout.scss';

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <main className="main-content">
        <ScrollToTopButton />
        <ToastContainer />
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
