import React from 'react';
import ContactItem from './ContactItem';
import { getUnreadCount } from '../utils/helpers';
import { ChevronDown, AlignJustify, WalletCards, X } from 'lucide-react';
import { useSelector } from 'react-redux';

const InboxSidebar = ({ activeContact, onContactSelect, isMobile, isOpen, onToggle }) => {
  const contacts = useSelector(state => state.contacts);

  const totalUnread = contacts.reduce((total, contact) =>
    total + getUnreadCount(contact.messages), 0
  );

  // Mobile version - full screen overlay
  if (isMobile) {
    return (
      <div className="h-full w-full bg-white flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl text-gray-900">Inbox</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-1 text-gray-700">
              <span className="text-sm font-bold text-black">{totalUnread} Open</span>
              <ChevronDown className="w-4 h-4 font-bold text-black" />
            </div>
            <div className="flex items-center space-x-1 text-gray-700">
              <span className="text-sm font-bold">Newest</span>
              <ChevronDown className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isActive={contact.id === activeContact}
              onClick={() => onContactSelect(contact.id)}
            />
          ))}
        </div>

        {/* Bottom action buttons */}
        {/* <div className="p-3 bg-white border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <AlignJustify size={18} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <WalletCards size={18} />
            </button>
          </div>
        </div> */}
      </div>
    );
  }

  // Desktop version - original sidebar
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white flex flex-col shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-gray-900">Inbox</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2">
          <div className="flex items-center space-x-1 text-gray-700">
            <span className="text-sm font-bold text-black">{totalUnread} Open</span>
            <ChevronDown className="w-4 h-4 font-bold text-black" />
          </div>
          <div className="flex items-center space-x-1 text-gray-700">
            <span className="text-sm font-bold">Newest</span>
            <ChevronDown className="w-4 h-4 text-black" />
          </div>
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide">
        {contacts.map((contact) => (
          <ContactItem
            key={contact.id}
            contact={contact}
            isActive={contact.id === activeContact}
            onClick={() => onContactSelect(contact.id)}
          />
        ))}
      </div>

      {/* Bottom action buttons */}
      {/* <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <AlignJustify size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <WalletCards size={18} />
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default InboxSidebar;