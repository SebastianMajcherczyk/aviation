import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import apiAirportsReducer from './apiAirportsSlice' 
import apiFlights from './apiFlightsSlice'

export const store = configureStore({
    reducer: {
        apiAirports: apiAirportsReducer,
        apiFlights: apiFlights,
    },
});


export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector