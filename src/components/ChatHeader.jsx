import React from 'react';
import {
  Star,
  MoreHorizontal,
  Mail,
  Phone,
  MoonIcon,
  PanelBottomClose,
  ChevronLeft,
  Menu
} from 'lucide-react';

// ChatHeader displays the top navigation for an active chat
// Props:
// - contact: current selected contact object
// - isMobile: boolean indicating if view is on a mobile screen
// - onMenuToggle: function to toggle the sidebar or menu (used on mobile)
// - onOptionsToggle: function to toggle the right sidebar on mobile
const ChatHeader = ({ contact, isMobile, onMenuToggle, onBack, onOptionsToggle }) => {
  if (!contact) return null;

  // Mobile view
  if (isMobile) {
    return (
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onBack || onMenuToggle} className="p-1 mr-2">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            {/* Contact name */}
            <h2 className="text-xl font-bold text-gray-900">
              {contact?.name}
            </h2>
          </div>
          
          {/* Mobile: Just show the menu button */}
          <button 
            onClick={onOptionsToggle} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    );
  }

  // Desktop view - your original design
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Contact name */}
          <h2 className="text-xl font-bold text-gray-900">
            {contact?.name}
          </h2>
        </div>
        
        {/* Right section: action buttons */}
        <div className="flex items-center space-x-2">
          {/* Favorite/star contact */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Star className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* More options menu */}
          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Send email */}
          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Mail className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Call contact */}
          <button className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Phone className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm font-semibold text-gray-800">Call</span>
          </button>
          
          {/* Snooze notifications */}
          <button className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <MoonIcon className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm font-semibold text-gray-800">Snooze</span>
          </button>
          
          {/* Close conversation */}
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors">
            <PanelBottomClose className="w-4 h-4 mr-2" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;