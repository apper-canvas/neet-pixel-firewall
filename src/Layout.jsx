import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const Layout = () => {
  const location = useLocation();
  const navItems = Object.values(routes).filter(route => route.showInNav);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <div className="pb-20 md:pb-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 z-40 md:static md:border-0 md:bg-transparent">
        <div className="flex justify-around items-center h-16 md:justify-center md:space-x-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => 
                  `flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-1 ${isActive ? 'text-primary' : ''}`}
                    >
                      <ApperIcon 
                        name={item.icon} 
                        size={20} 
                        className={isActive ? 'text-primary' : ''}
                      />
                    </motion.div>
                    <span className={`text-xs mt-1 font-medium ${
                      isActive ? 'text-primary' : 'text-surface-500'
                    }`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;