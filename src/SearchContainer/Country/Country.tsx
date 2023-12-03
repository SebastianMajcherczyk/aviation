import React from 'react';

import { countriesEN } from '../../data/countries-en';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useAppDispatch, useAppSelector } from '../../store/store';

import {
	setCountry,
	setAirport,
	setDirection,
	setDestination,
} from '../../store/filterSlice';
import { setFlights } from '../../store/apiFlightsSlice';
export const Country = () => {
	const dispatch = useAppDispatch();

	const resetStates = () => {
		dispatch(setCountry(null));
		dispatch(setAirport(null));
		dispatch(setDirection(null));
		dispatch(setDestination([]));
		dispatch(setFlights([]));
	};
	const selectedCountry = useAppSelector(
		(state: any) => state.filter.selectedCountry
	);

	return (
		<div className='selection-item'>
			<Autocomplete
				
				className='appear'
				value={selectedCountry}
				disablePortal
				id='combo-box-countries'
				options={countriesEN}
				getOptionLabel={option => option.name || ''}
				renderInput={params => <TextField {...params} label='Wybierz kraj' />}
				onChange={(event, value) => {
					resetStates();
					if (value) {
						dispatch(setCountry(value));
					}
				}}
			/>
		</div>
	);
};
