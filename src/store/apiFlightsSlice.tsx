import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flight } from '../interfaces/interfaces';

export interface ApiFlightsState {
	flights: Flight[];
	loading: boolean;
	error: string | null;
	modifiedFlights: any[];
}

const initialState: ApiFlightsState = {
	flights: [],
	loading: false,
	error: null,
	modifiedFlights: [],
};

export const apiFlightsSlice = createSlice({
	name: 'apiFlights',
	initialState,
	reducers: {
		setFlights: (state, action: PayloadAction<Flight[]>) => {
			state.flights = action.payload;
			state.modifiedFlights = getModifiedFlights(action.payload);
		},
	},
});

export const { setFlights } = apiFlightsSlice.actions;
export default apiFlightsSlice.reducer;

/////////////////////////////////////////////


const getModifiedFlights = (flights: Flight[]): any[] => {
	return flights.reduce<any[]>((collector, flight, index, array) => {
			if (!flight.flight.codeshared) {
				if (
					!collector.find(fl => {
					
						return fl.flight.number === flight.flight.number;
					})
				) {
					const copy: any = { ...flight };
					copy.dependentFlights = [flight];
					collector.push(copy);
				}
			} else {
				const flight_number = flight.flight.codeshared.flight_number;
				const elIndex = collector.findIndex(
					fl => fl.flight.number === flight_number
				);

				if (elIndex > -1) {
					collector[elIndex].dependentFlights.push(flight);
				} else {
					const foundElement = array.find(
						fl => fl.flight.number === flight_number
					);

					if (foundElement) {
						const copy: any = { ...foundElement };

						copy.dependentFlights = [foundElement, flight];
						collector.push(copy);
					}
				}
			}

			return collector;
		}, []);
};
