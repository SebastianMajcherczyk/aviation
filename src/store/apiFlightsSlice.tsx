import { createSlice, PayloadAction, createAsyncThunk, Slice } from '@reduxjs/toolkit';
import { Flight, Direction } from '../interfaces/interfaces';
import { dataService } from '../services';

export interface ApiFlightsState {
	flights: Flight[];
	loading: boolean;
	error: string | null;
	modifiedFlights: Flight[];
}

export interface FetchFlightsParams {
	iata_code: string;
	direction: Direction;
	offset: number;
	date: string;
}

export const fetchFlights = createAsyncThunk(
	'apiFlights/fetchFlights',
	async ({ iata_code, direction, offset, date }: FetchFlightsParams) => {
		const flights = (
			await dataService.getFlights(iata_code, direction, offset, date)
		).data;
		const sortedFlights = flights?.sort((a: Flight, b: Flight) => {
			if (direction === 'arrival') {
				return (
					new Date(b.arrival.scheduled).getTime() -
					new Date(a.arrival.scheduled).getTime()
				);
			} else {
				return (
					new Date(b.departure.scheduled).getTime() -
					new Date(a.departure.scheduled).getTime()
				);
			}
		});

		return sortedFlights;
	}
);

const initialState: ApiFlightsState = {
	flights: [],
	loading: false,
	error: null,
	modifiedFlights: [],
};

export const apiFlightsSlice: Slice = createSlice({
	name: 'apiFlights',
	initialState,
	reducers: {
		setFlights: (state, action: PayloadAction<Flight[]>) => {
			state.flights = action.payload;
			state.modifiedFlights = getModifiedFlights(action.payload);
		},
	},
	extraReducers: builder => {
		builder.addCase(fetchFlights.pending, (state, action) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(fetchFlights.fulfilled, (state, action) => {
			state.loading = false;
			state.error = null;
			state.flights = action.payload;
			state.modifiedFlights = getModifiedFlights(action.payload);
		});
		builder.addCase(fetchFlights.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message || null;
		});
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
				copy.dependentFlights = [];
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

					copy.dependentFlights = [flight];
					collector.push(copy);
				}
			}
		}

		return collector;
	}, []);
};
