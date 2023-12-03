import { Autocomplete, TextField } from '@mui/material';
import React, { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { airports } from '../../data/airports';
import {
	setAirport,
	setDirection,
	setDestination,
} from '../../store/filterSlice';
import { setFlights } from '../../store/apiFlightsSlice';

export const Airport = () => {
	const dispatch = useAppDispatch();
	const selectedCountry = useAppSelector(
		(state: any) => state.filter.selectedCountry
	);

	const airportsListByCountry = useMemo(() => {
		if (selectedCountry) {
			return airports.filter(
				airport => airport.country === selectedCountry.name
			);
		}
		return [];
	}, [selectedCountry]);
	const selectedAirport = useAppSelector(
		(state: any) => state.filter.selectedAirport
	);

	return (
		<div className='selection-item'>
			{airportsListByCountry?.length > 0 && (
				<Autocomplete
					className='appear'
					disablePortal
					value={selectedAirport}
					id='combo-box-airports'
					options={airportsListByCountry}
					// isOptionEqualToValue={(option, value) =>
					// 	option.iata_code === value.iata_code
					// }
					getOptionLabel={option => option.name + ', ' + option.iata_code || ''}
					renderInput={params => (
						<TextField {...params} label='Wybierz lotnisko' />
					)}
					onChange={(event, value) => {
						dispatch(setDirection(null));
						dispatch(setDestination([]));
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
							dispatch(setDestination([]));
						}
					}}
				/>
			)}
		</div>
	);
};
