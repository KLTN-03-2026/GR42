import React from 'react';
import Chatbot from '../core/Chatbot';
import Header from './Header';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authToken = localStorage.getItem('auth_token');

  return (
    <div className="min-h-screen bg-[#F9F9FC] flex flex-col font-roboto">
      <Header />

      <main className="flex-1">
        {children}
      </main>

      {authToken && <Chatbot />}
    </div>
  );
};

export default PublicLayout;
