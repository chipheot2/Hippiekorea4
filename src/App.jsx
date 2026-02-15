import React, { useState } from 'react';
import Navigation from './Navigation';
import CalendarPage from './CalendarPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import FAQPage from './FAQPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <CalendarPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FAQPage />;
      default:
        return <CalendarPage />;
    }
  };

  return (
    <div>
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
}
