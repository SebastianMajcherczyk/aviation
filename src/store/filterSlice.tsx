import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SimpleAirport, Direction } from '../interfaces/interfaces';

export interface FilterSliceState {
	selectedCountryName: string | null;
	selectedAirport: SimpleAirport | null;
	direction: Direction | null;
	offset: number;
	destination: SimpleAirport | null;
	sharedFlightsTableOpen: boolean;
	flightNumber: string | null;
}

const initialState: FilterSliceState = {
	selectedCountryName: null,
	selectedAirport: null,
	direction: null,
	offset: 0,
	destination: null,
	sharedFlightsTableOpen: false,
	flightNumber: null,
};

export const filterSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		setCountry: (state, action: PayloadAction<string | null>) => {
			state.selectedCountryName = action.payload;
		},
		setAirport: (state, action: PayloadAction<SimpleAirport | null>) => {
			state.selectedAirport = action.payload;
		},
		setDirection: (state, action: PayloadAction<Direction | null>) => {
			state.direction = action.payload;
		},
		setOffset: (state, action: PayloadAction<number>) => {
			state.offset = action.payload;
		},
		setDestination: (state, action: PayloadAction<SimpleAirport | null>) => {
			state.destination = action.payload;
		},
		setSharedOpen: (state, action: PayloadAction<boolean>) => {
			state.sharedFlightsTableOpen = action.payload;
		},
		setFlightNumber: (state, action: PayloadAction<string | null>) => {
			state.flightNumber = action.payload;
		},
	},
});

export const {
	setCountry,
	setAirport,
	setDirection,
	setOffset,
	setDestination,
	setSharedOpen,
	setFlightNumber,
} = filterSlice.actions;
export default filterSlice.reducer;
