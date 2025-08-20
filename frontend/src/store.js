import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { thunk } from "redux-thunk";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { userReducer } from "./reducers/userReducer";
import { allArtistsReducer } from "./reducers/usersReducer";
import { artReducer } from "./reducers/artReducer";
import { portfolioReducer } from "./reducers/portfolioReducer";
import { walletReducer } from "./reducers/walletReducer";
import { cartReducer } from "./reducers/cartReducer";
import { orderReducer } from "./reducers/orderReducer";
import { analyticsReducer } from "./reducers/analyticsReducer";
import { buyersReducer } from "./reducers/buyersReducer";

const reducer = combineReducers({
  user: userReducer,
  allArtists: allArtistsReducer,
  art: artReducer,
  portfolio: portfolioReducer,
  wallet: walletReducer,
  cart: cartReducer,
  order: orderReducer,
  analytics: analyticsReducer,
  buyers: buyersReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }).concat(thunk),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export default store;
