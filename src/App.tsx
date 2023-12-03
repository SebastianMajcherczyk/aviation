import './App.css';
import React, { useEffect, useMemo, useState } from 'react';

import { SearchContainer } from './SearchContainer/SearchContainer';
import { useAppSelector, useAppDispatch } from './store/store';
import { fetchFlights, setFlights } from './store/apiFlightsSlice';
import dayjs from 'dayjs';
import { FlightTable } from './components/FlightTable/FlightTable';
import { Flight, SimpleAirport } from './interfaces/interfaces';

const App: React.FC = () => {
	const dispatch = useAppDispatch();

	const selectedAirport = useAppSelector(
		(state: any) => state.filter.selectedAirport
	);
	const direction = useAppSelector((state: any) => state.filter.direction);

	const flightsFromStore = useAppSelector(
		(state: any) => state.apiFlights.modifiedFlights
	);

	const selectedDestinations = useAppSelector(
		(state: any) => state.filter.destination
	);

	const selectedFlightNumber = useAppSelector(
		(state: any) => state.filter.flightNumber
	);

	const [tableActive, setTableActive] = useState<boolean>(false);

	const currentDate: Date = new Date();
	const [date, setDate] = useState<Date>(currentDate);
	const formatedDate = dayjs(date).format('YYYY-MM-DD');
	const [offset, setOffset] = useState<number>(0);

	useEffect(() => {
		const iata_code = selectedAirport?.iata_code;

		setTableActive(false);
		if (iata_code && direction && date) {
			dispatch(setFlights([]));
			dispatch(
				fetchFlights({ iata_code, direction, date: formatedDate, offset })
			);

			setTableActive(true);
		}
	}, [selectedAirport, direction, offset, dispatch, date, formatedDate]);

	//Create the list of the flights filtered by the selected destination
	const flightsByDestination = useMemo<Flight[]>(() => {
		if (selectedDestinations.length > 0) {
		
			return flightsFromStore.filter((flight: Flight) =>
				direction === 'arrival'
					? 
					selectedDestinations.some((dest: SimpleAirport) => dest.iata_code === flight.departure.iata)
					
					: selectedDestinations.some((dest: SimpleAirport) => dest.iata_code === flight.arrival.iata)
			);
		}
		return flightsFromStore;
	}, [selectedDestinations, direction, flightsFromStore]);

	const flightsByNumber = useMemo<Flight[]>(() => {
		if (selectedFlightNumber) {
			return flightsByDestination.filter(
				(flight: Flight) =>
					flight.flight.iata === selectedFlightNumber ||
					flight.dependentFlights?.some(
						(dependentFlight: Flight) =>
							dependentFlight.flight.iata ===
							selectedFlightNumber
					)
			);
		}
		return flightsByDestination;
	}, [selectedFlightNumber, flightsFromStore, flightsByDestination]);

	return (
		<div className='App'>
			<SearchContainer />
			{selectedAirport && direction && (
				<FlightTable
					selectedAirport={selectedAirport}
					direction={direction}
					date={formatedDate}
					offset={offset}
					flights={flightsByNumber}
					tableActive={tableActive}
				/>
			)}
		</div>
	);
};

export default App;
