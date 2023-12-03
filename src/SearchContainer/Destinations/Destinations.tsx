import { Autocomplete, Box, TextField } from '@mui/material';
import React, { useMemo } from 'react';
import { Flight, SimpleAirport } from '../../interfaces/interfaces';
import { useAppSelector, useAppDispatch, RootState } from '../../store/store';
import { airports } from '../../data/airports';
import { setDestination, setSharedOpen } from '../../store/filterSlice';

export const Destinations = () => {
	const dispatch = useAppDispatch();
	const direction = useAppSelector(
		(state: RootState) => state.filter.direction
	);
	const flightsFromStore = useAppSelector(
		(state: RootState) => state.apiFlights.modifiedFlights
	);
	const selectedAirport = useAppSelector(
		(state: RootState) => state.filter.selectedAirport
	);
	const selectedCountryName = useAppSelector(
		(state: RootState) => state.filter.selectedCountry
	);

	const selectedDestinations = useAppSelector(
		(state: RootState) => state.filter.destination
	);

	const destinationsList = useMemo<SimpleAirport[]>(() => {
		if (selectedAirport) {
			const flights: SimpleAirport[] = flightsFromStore.map(
				(flight: Flight) => {
					if (direction === 'arrival') {
						const flightCity = airports.find(
							airport => airport.iata_code === flight.departure.iata
						)?.city;
						return {
							iata_code: flight.departure.iata,
							name: flight.departure.airport,
							city: flightCity,
						};
					} else {
						const flightCity = airports.find(
							airport => airport.iata_code === flight.arrival.iata
						)?.city;
						return {
							iata_code: flight.arrival.iata,
							name: flight.arrival.airport,
							city: flightCity,
						};
					}
				}
			);

			const uniqueFlights: SimpleAirport[] = Array.from(
				new Set(flights.map((flight: SimpleAirport) => JSON.stringify(flight)))
			).map((str: string) => JSON.parse(str));

			return uniqueFlights;
		}
		return [];
	}, [selectedCountryName, selectedAirport, direction, flightsFromStore]);

	return (
		<div className='selection-item '>
			{' '}
			{direction && flightsFromStore.length > 0 && (
				<Autocomplete
					multiple
					disableCloseOnSelect
					autoSelect={false}
					className='appear'
					disablePortal
					ChipProps={{ color: 'primary' }}
					id='combo-box-destination'
					options={destinationsList}
					getOptionLabel={option =>
						option.city + ', ' + option.name + ', ' + option.iata_code || ''
					}
					renderInput={params => (
						<TextField {...params} label='Filtruj wg destynacji' />
					)}
					value={selectedDestinations}
					onChange={(event, value) => {
						if (value) {
							dispatch(setDestination(value));
							dispatch(setSharedOpen(true));
						} else {
							dispatch(setDestination([]));
							dispatch(setSharedOpen(false));
						}
					}}
				/>
			)}
		</div>
	);
};