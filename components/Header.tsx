
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-black/80 backdrop-blur-md border-b-2 border-magenta-500 shadow-[0_0_15px_rgba(255,0,255,0.2)] sticky top-0 z-50 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-transparent border-2 border-cyan-400 rounded-sm flex items-center justify-center text-cyan-400 shadow-[0_0_10px_#00f3ff] rotate-45">
            <i className="fas fa-microchip text-xl -rotate-45"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter cyber-font text-white italic">
              POSE<span className="text-cyan-400">GEN</span> <span className="text-magenta-500">AI</span>
            </h1>
            <p className="text-[10px] mono-font text-cyan-300 font-bold uppercase tracking-[0.2em]">System: Nano-Banana_v2.5</p>
          </div>
        </div>
        <nav className="hidden md:flex space-x-8 text-xs font-bold cyber-font tracking-widest">
          <a href="#" className="text-cyan-300 hover:text-white transition-colors border-b-2 border-transparent hover:border-cyan-400 py-1">CONNECT</a>
          <a href="#" className="text-gray-100 hover:text-magenta-400 transition-colors border-b-2 border-transparent hover:border-magenta-500 py-1">PROTOCOLS</a>
          <a href="#" className="text-gray-100 hover:text-yellow-400 transition-colors border-b-2 border-transparent hover:border-yellow-400 py-1">ARCHIVE</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
