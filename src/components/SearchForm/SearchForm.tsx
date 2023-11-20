import React, { useMemo, useState } from 'react';

import { countriesEN } from '../../data/countries-en';
import { airports } from '../../data/airports';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Button } from '@mui/material';
import { FlightTable } from '../FlightTable/FlightTable';
import type { SimpleAirport, Direction } from '../../interfaces/interfaces';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import './SearchForm.css';
import { DatePickerComponent } from '../DatePickerComponent/DatePickerComponent';
import dayjs from 'dayjs';

export const SearchForm = () => {
	const [selectedCountryName, setSelectedCountryName] = useState<string | null>(
		null
	);
	const [selectedAirport, setSelectedAirport] = useState<SimpleAirport | null>(
		null
	);
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
						if (value) {
							setSelectedCountryName(value?.name);
							setSelectedAirport(null);
						} else {
							setSelectedCountryName(null);
							setSelectedAirport(null);
							setDirection(null);
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
				/>
			)}
		</div>
	);
};
