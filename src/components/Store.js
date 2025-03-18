// store.js
import { createStore } from "redux";
import rootReducer from "./HomePage";

const Store = createStore(rootReducer);

export default Store;
