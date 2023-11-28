import React, { useEffect, useMemo, useState } from 'react';

import { countriesEN } from '../../data/countries-en';
import { airports } from '../../data/airports';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Button } from '@mui/material';
import { FlightTable } from '../FlightTable/FlightTable';
import type {
	SimpleAirport,
	Direction,
	Flight,
} from '../../interfaces/interfaces';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import './SearchForm.css';
import { DatePickerComponent } from '../DatePickerComponent/DatePickerComponent';
import dayjs from 'dayjs';

import { dataService } from '../../services';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchFlights, setFlights } from '../../store/apiFlightsSlice';
import {
	setCountry,
	setAirport,
	setDirection,
	setOffset,
	setDestination,
	setSharedOpen,
	setFlightNumber,
} from '../../store/filterSlice';

export const SearchForm = () => {
	const dispatch = useAppDispatch();
	const selectedCountryName = useAppSelector(
		(state: any) => state.filter.selectedCountryName
	);
	const selectedAirport = useAppSelector(
		(state: any) => state.filter.selectedAirport
	);
	const selectedDestination = useAppSelector(
		(state: any) => state.filter.destination
	);
	const selectedFlightNumber = useAppSelector(
		(state: any) => state.filter.flightNumber
	);
	const [tableActive, setTableActive] = useState(false);

	const direction = useAppSelector((state: any) => state.filter.direction);
	const [offset, setOffset] = useState<number>(0);
	const currentDate: Date = new Date();
	const [date, setDate] = useState<Date>(currentDate);
	const formatedDate = dayjs(date).format('YYYY-MM-DD');
	const airportsListByCountry = useMemo(() => {
		if (selectedCountryName) {
			return airports.filter(
				airport => airport.country === selectedCountryName
			);
		}
		return [];
	}, [selectedCountryName]);

	const flightsFromStore = useAppSelector(
		(state: any) => state.apiFlights.modifiedFlights
	);

	// Create the list of unique destinations at the current airport to display in the autocomplete and filter by it
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
	}, [
		selectedCountryName,
		selectedAirport,
		direction,
		flightsFromStore.length,
	]);

	const flightNumbersList = useMemo<string[]>(() => {
		if (selectedAirport) {
			const flights: string[] = flightsFromStore.map((flight: Flight) => {
				if (!flight.dependentFlights) {
					return flight.flight.iata;
				} else {
					const dependentFlights = flight.dependentFlights.map(
						(dependentFlight: Flight) => dependentFlight.flight.iata
					);
					return [flight.flight.iata, ...dependentFlights];
				}
			});
			return flights.flat(2);
		}
		return [];
	}, [selectedAirport, flightsFromStore.length]);

	//Create the list of the flights filtered by the selected destination
	const flightsByDestination = useMemo<Flight[]>(() => {
		if (selectedDestination) {
			return flightsFromStore.filter((flight: Flight) =>
				direction === 'arrival'
					? flight.departure.iata === selectedDestination.iata_code
					: flight.arrival.iata === selectedDestination.iata_code
			);
		}
		return flightsFromStore;
	}, [selectedDestination, direction, flightsFromStore]);

	//Create the list of the flights filtered by the selected flight number
	const flightsByNumber = useMemo<Flight[]>(() => {
		if (selectedFlightNumber) {
			return flightsByDestination.filter(
				(flight: Flight) =>
					flight.flight.iata === selectedFlightNumber ||
					flight.dependentFlights?.some(
						(dependentFlight: Flight) =>
							dependentFlight.flight.codeshared?.flight_iata ===
							selectedFlightNumber
					)
			);
		}
		return flightsByDestination;
	}, [selectedFlightNumber, flightsFromStore, flightsByDestination]);

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

	const resetStates = () => {
		dispatch(setCountry(null));
		dispatch(setAirport(null));
		dispatch(setDirection(null));
		dispatch(setDestination(null));
		dispatch(setFlights([]));
	};

	return (
		<div>
			<div className='selection-container'>
				<Autocomplete
					className='selection-item'
					disablePortal
					id='combo-box-countries'
					options={countriesEN}
					getOptionLabel={option => option.name || ''}
					renderInput={params => <TextField {...params} label='Wybierz kraj' />}
					onChange={(event, value) => {
						resetStates();
						if (value) {
							dispatch(setCountry(value?.name));
						}
					}}
				/>

				{airportsListByCountry?.length > 0 && (
					<Autocomplete
						className='selection-item'
						disablePortal
						value={selectedAirport}
						id='combo-box-airports'
						options={airportsListByCountry}
						isOptionEqualToValue={(option, value) =>
							option.iata_code === value.iata_code
						}
						getOptionLabel={option =>
							option.name + ', ' + option.iata_code || ''
						}
						renderInput={params => (
							<TextField {...params} label='Wybierz lotnisko' />
						)}
						onChange={(event, value) => {
							dispatch(setDirection(null));
							dispatch(setDestination(null));
							dispatch(setFlights([]));

							if (value) {
								dispatch(
									setAirport({
										name: value?.name,
										iata_code: value?.iata_code,
									})
								);
								dispatch(setDirection(null));
							} else {
								dispatch(setAirport(null));
								dispatch(setDirection(null));
								dispatch(setDestination(null));
							}
						}}
					/>
				)}
			</div>
			{/* <DatePickerComponent date={date} setDate={setDate} /> */}
			{selectedAirport && direction && flightsFromStore.length > 0 && (
				<Box
				className='selection-container'
					>
					<Autocomplete
						className='selection-item'
						disablePortal
						id='combo-box-destination'
						options={destinationsList}
						getOptionLabel={option =>
							option.city + ', ' + option.name + ', ' + option.iata_code || ''
						}
						renderInput={params => (
							<TextField {...params} label='Filtruj wg destynacji' />
						)}
						value={selectedDestination}
						onChange={(event, value) => {
							if (value) {
								dispatch(
									setDestination({
										name: value.name,
										iata_code: value.iata_code,
										city: value?.city,
									})
								);
								dispatch(setSharedOpen(true));
							} else {
								dispatch(setDestination(null));
								dispatch(setSharedOpen(false));
							}
						}}
					/>
					<Autocomplete
						className='selection-item'
						disablePortal
						id='combo-box-flight'
						options={flightNumbersList}
						getOptionLabel={option => option || ''}
						renderInput={params => (
							<TextField {...params} label='Filtruj wg numeru lotu' />
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
				</Box>
			)}
			{selectedAirport && (
				<Box
					sx={{
						width: '98%',
						margin: '0 auto',
					}}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-evenly',
							margin: '0 auto',
						}}>
						<Box
							className={`direction-box ${
								direction === 'departure' ? 'active' : ''
							}`}>
							<FlightTakeoffIcon />
							<Button
								onClick={() => {
									dispatch(setDirection('departure'));
									dispatch(setDestination(null));
									dispatch(setSharedOpen(false));
								}}>
								Departure
							</Button>
						</Box>
						<Box
							className={`direction-box ${
								direction === 'arrival' ? 'active' : ''
							}`}>
							<FlightLandIcon />
							<Button
								onClick={() => {
									dispatch(setDirection('arrival'));
									dispatch(setDestination(null));
									dispatch(setSharedOpen(false));
								}}>
								Arrival
							</Button>
						</Box>
					</Box>
				</Box>
			)}

			{/* {selectedAirport && direction && (
				<Box
					sx={{
						margin: '0 auto',
						width: '98%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}>
					<Box className={`arrow-box ${direction !== null ? 'active' : ''}`}>
						<Button onClick={() => setOffset(prev => prev + 1)}>
							<ArrowBackIos />
						</Button>
					</Box>
					<Box className={`arrow-box ${direction !== null ? 'active' : ''}`}>
						<Button
							disabled={offset === 0}
							onClick={() => setOffset(prev => prev - 1)}>
							<ArrowForwardIos />
						</Button>
					</Box>
				</Box>
			)} */}

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
