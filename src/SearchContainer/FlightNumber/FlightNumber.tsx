import { Autocomplete, Box, TextField } from '@mui/material';
import React, { useMemo } from 'react';
import { Flight, SimpleAirport } from '../../interfaces/interfaces';
import { setFlightNumber, setSharedOpen } from '../../store/filterSlice';
import { useAppSelector, useAppDispatch } from '../../store/store';

export const FlightNumber = () => {
	const dispatch = useAppDispatch();
	const direction = useAppSelector((state: any) => state.filter.direction);

	const flightsFromStore = useAppSelector(
		(state: any) => state.apiFlights.modifiedFlights
	);

	const selectedAirport = useAppSelector(
		(state: any) => state.filter.selectedAirport
	);

	const selectedDestinations = useAppSelector(
		(state: any) => state.filter.destination
	);

	const selectedFlightNumber = useAppSelector(
		(state: any) => state.filter.flightNumber
	);

	

	const flightNumbersList = useMemo<string[]>(() => {
		if (selectedAirport ) {
			const flights: string[] = flightsFromStore.reduce(
				(accumulator: string[], flight: Flight) => {
					// Dodanie numeru lotu głównego, jeśli nie ma wybranej destynacji lub lot jest związany z wybraną destynacją
					if (
						selectedDestinations.length === 0 ||
						selectedDestinations.some(
							(dest: SimpleAirport) => dest.iata_code === flight.departure.iata
						) ||
						selectedDestinations.some(
							(dest: SimpleAirport) => dest.iata_code === flight.arrival.iata
						)
					) {
						console.log("First if")
						accumulator.push(flight.flight.iata);
					}

					// Przetwarzanie lotów zależnych
					flight.dependentFlights?.forEach(dependentFlight => {
						// Dodanie numeru lotu zależnego, jeśli nie ma wybranej destynacji lub lot zależny jest związany z wybraną destynacją
						if (
							selectedDestinations.length === 0 ||
							selectedDestinations.some(
								(dest: SimpleAirport) =>
									dest.iata_code === dependentFlight.departure.iata
							) ||
							selectedDestinations.some(
								(dest: SimpleAirport) =>
									dest.iata_code === dependentFlight.arrival.iata
							)
						) {
							console.log("Second if")
							accumulator.push(dependentFlight.flight.iata);
						}
					});

					return accumulator;
				},
				[]
			);
			return flights;
		}
		return [];
	}, [selectedAirport, flightsFromStore, selectedDestinations]);

	return (
		<div className='selection-item'>
			{direction && flightsFromStore.length > 0 && (
				<Autocomplete
					className='appear'
					disablePortal
					id='combo-box-flight'
					options={flightNumbersList}
					getOptionLabel={option => option || ''}
					renderInput={params => (
						<TextField {...params} label={selectedDestinations.length > 0 ?  'Wyszukaj numer lotu do wybranych destynacji' : 'Wyszukaj wg numeru lotu'} />
					)}
					value={selectedFlightNumber}
					onChange={(event, value) => {
						if (value) {
							dispatch(setFlightNumber(value));
							dispatch(setSharedOpen(true));
						} else {
							dispatch(setFlightNumber(null));
							dispatch(setSharedOpen(false));
						}
					}}
				/>
			)}
		</div>
	);
};
