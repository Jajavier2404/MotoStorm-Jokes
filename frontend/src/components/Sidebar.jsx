import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Smile, 
  Car, 
  Cloud, 
  Menu, 
  X,
  ChevronRight 
} from 'lucide-react';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/jokes', label: 'Chistes', icon: Smile },
    { path: '/car-store', label: 'Tienda de Carros', icon: Car },
    { path: '/weather', label: 'Clima', icon: Cloud },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static top-0 left-0 z-40 h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white transition-all duration-300 ease-in-out shadow-xl
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!isCollapsed && (
            <h2 className="text-xl ml-4 font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Moto-storm J
            </h2>
          )}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-2 hover:bg-gray-700 rounded-md transition-colors"
          >
            <ChevronRight 
              size={16} 
              className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.path);
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-[6Ñpx] py-3  rounded-lg transition-all duration-200 group relative 
                      ${active 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                        : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                      }
                    `}
                  >
                    <IconComponent 
                      size={20} 
                      className={`flex-shrink-0 transition-colors  ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
                    />
                    {!isCollapsed && (
                      <span className="font-medium transition-colors">
                        {item.label}
                      </span>
                    )}
                    
                  </Link>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-16 top-0 bg-gray-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          {!isCollapsed && (
            <div className="text-xs text-gray-400 text-center border-t border-gray-700 pt-4">
              © 2025 MotoStorm Jokes
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Sidebar;