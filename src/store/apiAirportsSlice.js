import { createSlice } from '@reduxjs/toolkit';

export const apiAirportsSlice = createSlice({
	name: 'apiAirports',
	initialState: {
		value: [],
	},
	reducers: {
		setApiAirports: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { setApiAirports } = apiAirportsSlice.actions;
export default apiAirportsSlice.reducer;
