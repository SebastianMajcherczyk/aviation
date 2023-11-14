import React, { useMemo, useState } from 'react';

import { countriesEN } from '../../data/countries-en';
import { airports } from '../../data/airports';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
} from '@mui/material';
import { FlightTable } from '../FlightTable/FlightTable';
import type { SimpleAirport, Direction } from '../../interfaces/interfaces';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import './SearchForm.css';

export const SearchForm = () => {
	const [selectedCountryName, setSelectedCountryName] = useState<string | null>(
		null
	);
	const [selectedAirport, setSelectedAirport] = useState<SimpleAirport | null>(
		null
	);
	const [direction, setDirection] = useState<Direction | null>(null);
	const [offset, setOffset] = useState<number>(0);

	const airportsListByCountry = useMemo(() => {
		if (selectedCountryName) {
			return airports.filter(
				airport => airport.country === selectedCountryName
			);
		}
		return [];
	}, [selectedCountryName]);

	const handleDirectionChange = (
		event: React.SyntheticEvent<Element, Event>
	) => {
		setDirection((event.target as HTMLInputElement).value as Direction);
	};

	return (
		<div>
			<Autocomplete
				disablePortal
				id='combo-box-countries'
				options={countriesEN}
				sx={{ width: '98%', margin: '10px auto' }}
				getOptionLabel={option => option.name || ''}
				renderInput={params => <TextField {...params} label='Wybierz kraj' />}
				onChange={(event, value) => {
					if (value) {
						setSelectedCountryName(value?.name);
					} else {
						setSelectedCountryName(null);
					}
				}}
			/>

			{airportsListByCountry?.length > 0 && (
				<div>
					<Autocomplete
						disablePortal
						id='combo-box-airports'
						options={airportsListByCountry}
						sx={{ width: '98%', margin: '10px auto' }}
						getOptionLabel={option => option.name || ''}
						renderInput={params => (
							<TextField {...params} label='Wybierz lotnisko' />
						)}
						onChange={(event, value) => {
							if (value) {
								setSelectedAirport({
									name: value?.name,
									iata_code: value?.iata_code,
								});
							} else {
								setSelectedAirport(null);
							}
						}}
					/>
				</div>
			)}

			{selectedAirport && (
				<FormControl
					sx={{
						width: '98%',
						margin: '10px auto',
					}}>
					<RadioGroup
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-evenly',
						}}>
						<Box className='direction-box'>
							<FlightTakeoffIcon />
							<FormControlLabel
								value='departure'
								control={<Radio />}
								label='Wyloty'
								onChange={handleDirectionChange}
							/>
						</Box>
						<Box className='direction-box'>
							<FlightLandIcon />
							<FormControlLabel
								value='arrival'
								control={<Radio />}
								label='Przyloty'
								onChange={handleDirectionChange}
							/>
						</Box>
					</RadioGroup>
				</FormControl>
			)}
			{selectedAirport && direction && (
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}>
					<Button onClick={() => setOffset(prev => prev + 1)}>
						<ArrowBackIos />
					</Button>

					<Button
						disabled={offset === 0}
						onClick={() => setOffset(prev => prev - 1)}>
						<ArrowForwardIos />
					</Button>
				</Box>
			)}
			{selectedAirport && direction && (
				<FlightTable
					selectedAirport={selectedAirport}
					direction={direction}
					offset={offset}
				/>
			)}
		</div>
	);
};
