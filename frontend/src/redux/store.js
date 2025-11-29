import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import ownerReducer from './ownerSlice.js';
import userReducer from './userSlice.js';
import mapReducer from './mapSlice.js'

const rootReducer = combineReducers({
  owner: ownerReducer,
  user: userReducer,
  map:mapReducer
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);