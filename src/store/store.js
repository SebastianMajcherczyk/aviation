import { configureStore } from '@reduxjs/toolkit';
import apiAirportsReducer from './apiAirportsSlice' 

export const store = configureStore({
    reducer: {
        apiAirports: apiAirportsReducer,
    },
});
