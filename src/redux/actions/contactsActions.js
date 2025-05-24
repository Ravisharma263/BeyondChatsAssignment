// redux/actions/contactsActions.js

export const markMessagesAsRead = (contactId) => ({
  type: 'contacts/markMessagesAsRead',
  payload: contactId,
});

export const markAllMessagesAsRead = (contactId) => ({
  type: 'MARK_ALL_MESSAGES_AS_READ',
  payload: { contactId },
});

export const setAIMessage = (message) => ({
  type: 'SET_AI_MESSAGE',
  payload: message,
});

export const clearAIMessage = () => ({
  type: 'CLEAR_AI_MESSAGE',
});

export const addMessage = (contactId, message) => ({
  type: 'ADD_MESSAGE',
  payload: { contactId, message },
});
