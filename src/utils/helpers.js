// helpers.js
export const getLatestMessage = (messages) => {
  if (!messages || messages.length === 0) return null;
  return messages.reduce((latest, current) => 
    new Date(current.receivedTime) > new Date(latest.receivedTime) ? current : latest
  );
};

export const getUnreadCount = (messages) => {
  return messages.filter(msg => msg.state === 'unread').length;
};

export const formatTime = (timeString) => {
  const now = new Date();
  const messageTime = new Date(timeString);
  const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d`;
  }
};

