import { Directions } from './Directions/Directions';
import React from 'react';
import { Airport } from './Airport/Airport';
import { Country } from './Country/Country';
import { Destinations } from './Destinations/Destinations';
import { FlightNumber } from './FlightNumber/FlightNumber';
import { Box } from '@mui/material';

export const SearchContainer = () => {
	return (
		<div>
			<div className='selection-container'>
				<Country />
				<Airport />
			</div>
			<div className='selection-container'>
				<Destinations />
				<FlightNumber />
			</div>
			<Directions />
		</div>
	);
};
