import React from 'react';
import Chatbot from './Chatbot';
import Header from './Header';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F9F9FC] flex flex-col font-inter">
      <Header />

      <main className="flex-1">
        {children}
      </main>

      <Chatbot />
    </div>
  );
};

export default PublicLayout;
