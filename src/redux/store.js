import { createStore } from "redux";
import contactsReducer from "./reducers/contactsReducer";

const store = createStore(contactsReducer);

export default store;