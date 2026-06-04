import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-300 bg-gray-100 py-6 mt-12 text-center text-sm text-gray-600">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-4">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="mailto:support@findemp.com" className="hover:underline">Email: support@findemp.com</a>
        </div>
        <div>
          <p>© {new Date().getFullYear()} FindEmp. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
