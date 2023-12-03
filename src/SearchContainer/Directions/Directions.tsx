import { Box, Button } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import {
	setDirection,
	setDestination,
	setSharedOpen,
    setFlightNumber
} from '../../store/filterSlice';

export const Directions = () => {
	const dispatch = useAppDispatch();

	const selectedAirport = useAppSelector(
		(state: any) => state.filter.selectedAirport
	);
	const direction = useAppSelector((state: any) => state.filter.direction);
	return (
		<div>
			{selectedAirport && (
				<Box
					className='appear'
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
                                    dispatch(setFlightNumber(null));
									dispatch(setDestination([]));
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
									dispatch(setDestination([]));
									dispatch(setSharedOpen(false));
								}}>
								Arrival
							</Button>
						</Box>
					</Box>
				</Box>
			)}
		</div>
	);
};
