import { contacts as contactsData } from "../../data/data";

const initialState = {
  contacts: contactsData.map((contact) => ({
    ...contact,
    messages: contact.messages.map((msg) => ({ ...msg, state: "unread" })),
  })),
  aiResponse: null,
};

const contactsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_AI_MESSAGE":
      return { ...state, aiMessage: action.payload };

    case "CLEAR_AI_MESSAGE":
      return { ...state, aiMessage: null };

    case "MARK_ALL_MESSAGES_AS_READ":
      return {
        ...state,
        contacts: state.contacts.map((contact) => {
          if (contact.id === action.payload.contactId) {
            return {
              ...contact,
              messages: contact.messages.map((message) => ({
                ...message,
                state: "read",
                seenTime:
                  message.sender === "contact"
                    ? new Date().toISOString()
                    : message.seenTime,
              })),
            };
          }
          return contact;
        }),
      };

    case "contacts/markMessagesAsRead":
      return {
        ...state,
        contacts: state.contacts.map((contact) => {
          if (contact.id === action.payload) {
            return {
              ...contact,
              messages: contact.messages.map((msg) => ({
                ...msg,
                unread: false,
              })),
            };
          }
          return contact;
        }),
      };

    case "ADD_MESSAGE":
      return {
        ...state,
        contacts: state.contacts.map((contact) => {
          if (contact.id === action.payload.contactId) {
            return {
              ...contact,
              messages: [...contact.messages, action.payload.message],
            };
          }
          return contact;
        }),
      };

    default:
      return state;
  }
};

export default contactsReducer;
