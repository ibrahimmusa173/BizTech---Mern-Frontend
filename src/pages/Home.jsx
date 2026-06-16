// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 bg-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          BizTech <span className="text-white">Tenders</span>
        </div>
        <Link 
          to="/login" 
          className="px-6 py-2 border border-blue-400 text-blue-400 rounded-full hover:bg-blue-400 hover:text-white transition-all duration-300"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Streamline Your <span className="text-blue-500">Tendering</span> Process
        </h1>
        <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto mb-10">
          The BizTech Tenders module is your one-stop solution for business procurement. 
          Connecting Clients with top-tier Vendors through a transparent bidding platform.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link 
            to="/login" 
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1"
          >
            Get Started Now
          </Link>
          <Link 
            to="/register" 
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-lg transition-all"
          >
            Create an Account
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 border-t border-slate-800">
        <div className="grid md:grid-cols-2 gap-12">
          {/* For Clients */}
          <div className="p-8 bg-slate-800/40 rounded-2xl border border-slate-700 hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m0 10V4m-4 6h4" />
               </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">For Clients</h3>
            <p className="text-gray-400">
              Post your project requirements (RFPs) easily. Manage incoming bids, evaluate vendors, 
              and find the perfect partner for your project in one centralized dashboard.
            </p>
          </div>

          {/* For Vendors */}
          <div className="p-8 bg-slate-800/40 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-colors">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">For Vendors (Bidders)</h3>
            <p className="text-gray-400">
              Browse active tenders that match your expertise. Submit competitive proposals, 
              track your bid status, and grow your business with BizTech.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-500 text-sm border-t border-slate-800">
        &copy; {new Date().getFullYear()} BizTech Group. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;