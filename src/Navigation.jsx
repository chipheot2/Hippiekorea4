import React from 'react';
import { Calendar, Info, Mail, HelpCircle } from 'lucide-react';

export default function Navigation({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'home', label: 'Events', icon: Calendar },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'faq', label: 'FAQ', icon: HelpCircle }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setCurrentPage('home')}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition">
              H
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                HippeKorea
              </div>
              <div className="text-xs text-gray-500 -mt-1">Cultural Experiences</div>
            </div>
          </div>
          <div className="flex gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold
                    ${currentPage === item.id 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
