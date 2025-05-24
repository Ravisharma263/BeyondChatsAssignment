import React from 'react';
import { getLatestMessage, getUnreadCount, formatTime } from '../utils/helpers';
import { useSelector } from 'react-redux';

// ContactItem renders an individual contact in the inbox list
// Props:
// - contact: the contact object passed as a prop
// - isActive: whether this contact is currently selected
// - onClick: function to call when this item is clicked
const ContactItem = ({ contact, isActive, onClick }) => {
  // Access full list of contacts from Redux
  const contacts = useSelector(state => state.contacts);

  // Find the most up-to-date contact data using the contact id
  const currentContact = contacts.find(c => c.id === contact.id);

  // Return nothing if contact prop is missing
  if (!contact) return null;

  // Get latest message and unread count for this contact
  const latestMessage = getLatestMessage(currentContact.messages);
  const unreadCount = getUnreadCount(currentContact.messages);
  const hasUnread = unreadCount > 0;

  // Skip rendering if there's no latest message
  if (!latestMessage) return null;

  return (
    <div 
      className={`mx-3 my-1 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-102 hover:shadow-sm ${
        isActive 
          ? 'bg-blue-100 shadow-sm'  // Highlight selected contact
          : 'hover:bg-gray-50'       // Hover effect for others
      }`}
      onClick={() => onClick(contact.id)}  // Call handler with contact ID
    >
      <div className="flex items-center space-x-3 p-4">
        {/* Contact avatar */}
        <div className="relative">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${contact.avatarColor} shadow-sm`}
          >
            {contact.initial}
          </div>
        </div>

        {/* Message preview section */}
        <div className="flex-1 min-w-0">
          {/* Name and timestamp row */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold truncate text-black">
              {contact.name}
            </span>

            <div className="flex items-center space-x-2">
              {/* Optional timeTag like "New" or "Urgent" */}
              {contact.timeTag && (
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${contact.timeTag.style}`}
                >
                  {contact.timeTag.text}
                </span>
              )}
              {/* Time of last message */}
              <span className="text-xs text-gray-500 font-medium">
                {formatTime(latestMessage.receivedTime)}
              </span>
            </div>
          </div>

          {/* Subject and content preview */}
          <div className="space-y-1">
            {/* Show subject if available */}
            {latestMessage.subject && (
              <p
                className={`text-xs font-medium truncate ${
                  hasUnread ? 'text-black text-sm font-bold' : 'text-gray-500'
                }`}
              >
                {latestMessage.subject}
              </p>
            )}
            {/* Show message snippet */}
            <p
              className={`text-xs truncate ${
                hasUnread ? 'text-black text-sm font-bold' : 'text-gray-500'
              }`}
            >
              {latestMessage.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactItem;
