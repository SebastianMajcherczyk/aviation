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
import { setFlights } from '../../store/apiFlightsSlice';

export const SearchForm = () => {
	const dispatch = useAppDispatch();
	const [selectedCountryName, setSelectedCountryName] = useState<string | null>(
		null
	);
	const [selectedAirport, setSelectedAirport] = useState<SimpleAirport | null>(
		null
	);
	const [tableActive, setTableActive] = useState(false);
	const [loaderActive, setLoaderActive] = useState(false);

	const [direction, setDirection] = useState<Direction | null>(null);
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
		(state: any) => state.apiFlights.flights
	);

	const [selectedDestination, setSelectedDestination] =
		useState<SimpleAirport | null>(null);

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
	}, [selectedAirport, direction, flightsFromStore.length]);

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
	useEffect(() => {
		const iata_code = selectedAirport?.iata_code;
		setLoaderActive(true);
		setTableActive(false);
		const fetchFlights = async () => {
			if (iata_code && direction && date) {
				const response = await dataService.getFlights(
					iata_code,
					direction,
					offset,
					formatedDate
				);
				const flights = response.data;
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

				dispatch(setFlights(sortedFlights));
				setLoaderActive(false);
				setTableActive(true);
			}
		};
		fetchFlights();
	}, [selectedAirport, direction, offset, dispatch, date, formatedDate]);

	const resetStates = () => {
		setSelectedCountryName(null);
		setSelectedAirport(null);
		setDirection(null);
		setSelectedDestination(null);
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
							setSelectedCountryName(value?.name);
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
						getOptionLabel={option =>
							option.name + ', ' + option.iata_code || ''
						}
						renderInput={params => (
							<TextField {...params} label='Wybierz lotnisko' />
						)}
						onChange={(event, value) => {
							if (value) {
								setSelectedAirport({
									name: value?.name,
									iata_code: value?.iata_code,
								});
								setDirection(null);
							} else {
								setSelectedAirport(null);
								setDirection(null);
								setSelectedDestination(null);
							}
						}}
					/>
				)}
			</div>
			{/* <DatePickerComponent date={date} setDate={setDate} /> */}
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
							<Button onClick={() => setDirection('departure')}>
								Departure
							</Button>
						</Box>
						<Box
							className={`direction-box ${
								direction === 'arrival' ? 'active' : ''
							}`}>
							<FlightLandIcon />
							<Button onClick={() => setDirection('arrival')}>Arrival</Button>
						</Box>
					</Box>
				</Box>
			)}
			{selectedAirport && direction && flightsFromStore.length > 0 && (
				<Box
					sx={{
						margin: '0 auto',
						width: '98%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}>
					<Autocomplete
						className='selection-item'
						disablePortal
						id='combo-box-destination'
						options={destinationsList}
						getOptionLabel={option =>
							option.city + ', ' + option.name + ', '+ option.iata_code || ''
						}
						renderInput={params => (
							<TextField {...params} label='Filtruj wg destynacji' />
						)}
						value={selectedDestination}
						onChange={(event, value) => {
							if (value) {
								setSelectedDestination({
									name: value.name,
									iata_code: value.iata_code,
								});
							} else {
								setSelectedDestination(null);
							}
						}}
					/>
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
					flights={flightsByDestination}
					tableActive={tableActive}
					loaderActive={loaderActive}
				/>
			)}
		</div>
	);
};
