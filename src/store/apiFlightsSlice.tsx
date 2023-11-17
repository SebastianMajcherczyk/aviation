import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flight } from '../interfaces/interfaces';

export interface ApiFlightsState {
	flights: Flight[];
	loading: boolean;
	error: string | null;
}

const initialState: ApiFlightsState = {
	flights: [],
	loading: false,
	error: null,
};

export const apiFlightsSlice = createSlice({
	name: 'apiFlights',
	initialState,
	reducers: {
		setFlights: (state, action: PayloadAction<Flight[]>) => {
			state.flights = action.payload;
		},
	},
});

export const { setFlights } = apiFlightsSlice.actions;
export default apiFlightsSlice.reducer;
