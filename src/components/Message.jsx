import React from 'react';
import { formatTime } from '../utils/helpers.js';
import { useSelector } from 'react-redux';

// Message component renders a single chat message.
// Props:
// - message: the message object containing content, sender, state, etc.
// - contactId: the ID of the contact this message belongs to
// - index: index of the message (used for staggered animation)
const Message = ({ message, contactId, index }) => {
  // Determine if the message is sent by the contact or the agent (user)
  const isFromContact = message.sender === 'contact';

  // Retrieve the contact details from Redux using contactId
  const contact = useSelector(state =>
    state.contacts.find(c => c.id === contactId)
  );

  // Safety check: return nothing if the contact doesn't exist
  if (!contact) return null;

  // Helper to get a random Tailwind color class
  const getRandomColor = () => {
    const colors = [
      'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500', 'bg-gray-600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Random color selected per render (you might want to persist it based on contact)
  const randomColor = getRandomColor(); // not used currently, you could use it for avatarColor fallback

  return (
    <div
      className="mb-6 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }} // staggered fade-in animation
    >
      <div className={`flex items-start space-x-3 ${!isFromContact ? 'justify-end' : ''}`}>
        {/* Avatar on the left if message is from contact */}
        {isFromContact && (
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${contact.avatarColor} shadow-sm`}
          >
            {contact.initial}
          </div>
        )}

        {/* Message bubble */}
        <div className={`flex-1 ${!isFromContact ? 'flex justify-end' : ''}`}>
          <div
            className={`rounded-2xl p-4 max-w-lg shadow-sm transition-all duration-200 hover:shadow-md ${
              !isFromContact ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'
            }`}
          >
            {/* Message text */}
            <p className="text-sm leading-relaxed">{message.content}</p>

            {/* Timestamp and read status */}
            <div
              className={`flex items-center space-x-2 mt-2 text-xs ${
                !isFromContact ? 'justify-end text-white' : 'text-black'
              }`}
            >
              {/* Show 'Seen' if message is sent by agent and read */}
              {!isFromContact && message.state === 'read' && <span>Seen</span>}
              <span>{formatTime(message.receivedTime)}</span>
            </div>
          </div>
        </div>

        {/* Agent avatar on the right for user's messages */}
        {!isFromContact && (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center shadow-sm">
            {/* Placeholder agent image */}
            <img
              src="https://picsum.photos/200"
              alt="Agent"
              className="w-10 h-10 rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
