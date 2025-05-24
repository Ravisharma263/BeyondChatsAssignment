import React, { useState, useEffect, useRef } from 'react';
import { MessageSquareText, Bot, Menu, ChevronLeft } from 'lucide-react';
import NavigationSidebar from './NavigationSidebar';
import InboxSidebar from './InboxSidebar';
import ChatArea from './ChatArea';
import AICopilot from './AICopilot';
import { markAllMessagesAsRead } from '../redux/actions/contactsActions';
import { useSelector, useDispatch } from 'react-redux';

export default function MessagingInterface() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [activeContact, setActiveContact] = useState(null);
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contacts);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
        setCopilotOpen(true);
      } else {
        // On mobile, start with sidebar closed
        setSidebarOpen(false);
        setCopilotOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Contact selection handler
  const handleContactSelect = (contactId) => {
    setActiveContact(contactId);
    dispatch(markAllMessagesAsRead(contactId));
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="h-screen w-full flex bg-gray-50 relative overflow-hidden">
      {/* Desktop Layout */}
      {!isMobile && (
        <>
          <NavigationSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          <InboxSidebar 
            activeContact={activeContact}
            onContactSelect={handleContactSelect}
            isOpen={true}
          />
          <ChatArea
            contact={contacts.find(c => c.id === activeContact)}
            onBack={() => setActiveContact(null)}
          />
          <AICopilot isOpen={copilotOpen} onToggle={() => setCopilotOpen(!copilotOpen)} />
        </>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <>
          {/* Mobile Top Navigation Bar */}
          <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-3 flex justify-between items-center z-50">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-blue-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveContact(null)}
                className="p-2 text-gray-600 hover:text-blue-600"
              >
                <MessageSquareText className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCopilotOpen(true)}
                className="p-2 text-gray-600 hover:text-blue-600"
              >
                <Bot className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Content Area with top padding for fixed nav */}
          <div className="flex-1 pt-16">
            {!activeContact ? (
              <InboxSidebar
                isMobile={true}
                isOpen={true}
                activeContact={activeContact}
                onContactSelect={handleContactSelect}
              />
            ) : (
              <ChatArea
                isMobile={true}
                contact={contacts.find(c => c.id === activeContact)}
                onBack={() => setActiveContact(null)}
                onMenuToggle={() => setSidebarOpen(true)}
              />
            )}
          </div>

          {/* Navigation Sidebar Overlay */}
          {sidebarOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/50 z-30" 
                onClick={() => setSidebarOpen(false)} 
              />
              <NavigationSidebar
                isMobile={true}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(false)}
              />
            </>
          )}

          {/* AI Copilot Overlay */}
          {copilotOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/50 z-30" 
                onClick={() => setCopilotOpen(false)} 
              />
              <AICopilot
                isMobile={true}
                isOpen={copilotOpen}
                onToggle={() => setCopilotOpen(false)}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}