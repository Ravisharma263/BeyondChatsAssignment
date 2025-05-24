import React, { useState } from 'react';
import { getUnreadCount } from '../utils/helpers';
import { useSelector } from 'react-redux';

import { 
  FolderKanban,
  BookOpenCheck,
  Send,
  Zap,
  BookText,
  BarChart3,
  Users,
  MessageSquareText,
  Grid3X3
} from 'lucide-react';

const NavigationSidebar = ({ isMobile, isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState('kanban');
  const contacts = useSelector(state => state.contacts);

  const totalUnread = contacts.reduce((total, contact) => 
    total + getUnreadCount(contact.messages), 0
  );

  const navItems = [
    { id: 'MessageSquare', icon: MessageSquareText, notificationCount: totalUnread },
    { id: 'bookOpen', icon: BookOpenCheck },
    { id: 'send', icon: Send },
  ];

  const bottomItems = [
    { id: 'zap', icon: Zap },
    { id: 'bookText', icon: BookText },
    { id: 'chart', icon: BarChart3 },
    { id: 'users', icon: Users },
    { id: 'message', icon: MessageSquareText },
    { id: 'grid', icon: Grid3X3 },
  ];

  // Hide sidebar on mobile if not open
  if (isMobile && !isOpen) return null;

  return (
    <div className={`
      ${isMobile ? 'fixed left-0 top-0 z-50 h-full' : 'relative'}
      w-12 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4
      transition-transform duration-300 
      ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
    `}>
      
      {/* App logo / icon */}
     <div className="mb-6">
  <img
    src="https://imgs.search.brave.com/IIMOcZumnTtb8ow-hyJFgTfVsJIudlIU7onDrd4NhL8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vOUhnZVJM/Nl9WUk81OGMwUmJt/bndqUnlONjA3Qmlr/VGQ2OVM3WktxazBx/dy9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTl6/ZEdGMC9hV011ZG1W/amRHVmxlbmt1L1ky/OXRMM041YzNSbGJT/OXkvWlhOdmRYSmpa/WE12ZEdoMS9iV0p1/WVdsc2N5OHdNakl2/L05UVXhMekEzTmk5/emJXRnMvYkM5cGJt/SnZlQzFwWTI5dS9M/WE4wZVd4bExYWmxZ/M1J2L2NpNXFjR2M.jpeg"
    alt="Tone Icon"
    className="h-8 w-8"
  />
</div>

      
      {/* Top navigation icons with notification */}
      <div className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              relative w-11 h-11 flex items-center justify-center 
              transition-all duration-200 transform hover:scale-105 
              ${activeTab === item.id
                ? 'bg-white text-blue-600 shadow-sm border-l-4 border-blue-600'
                : 'text-gray-950 hover:bg-gray-200 hover:text-black'}
            `}
          >
            <item.icon className="w-5 h-5" />

            {item.notificationCount ? (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold z-30">
                {item.notificationCount}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Spacer pushes bottom items to the bottom */}
      <div className="flex-1"></div>

      {/* Bottom utility icons */}
      <div className="space-y-2">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-black hover:bg-gray-200 hover:text-black transition-all duration-200 transform hover:scale-105"
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* User avatar at the bottom */}
      <div className="mt-4 relative">
        <img
          src="https://picsum.photos/200"
          alt="User Avatar"
          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
        />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      </div>
    </div>
  );
};

export default NavigationSidebar;