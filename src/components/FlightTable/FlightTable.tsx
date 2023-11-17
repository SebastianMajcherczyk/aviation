import { CircularProgress } from '@mui/joy';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { dataService } from '../../services';
import { ArrivalTable } from '../ArrivalTable/ArrivalTable';
import { DepartureTable } from '../DepartureTable/DepartureTable';
import { SimpleAirport, Direction} from '../../interfaces/interfaces';


import { useAppDispatch, useAppSelector } from '../../store/store';
import { setFlights } from '../../store/apiFlightsSlice';


interface FlightTableProps {
	selectedAirport: SimpleAirport;
	direction: Direction;
	offset: number;
}

export const FlightTable: React.FC<FlightTableProps> = ({
	selectedAirport,
	direction,
	offset,
}) => {
	// const [flights, setFlights] = useState<Flight[] | null>(null);
	const [tableActive, setTableActive] = useState(false);
	const [loaderActive, setLoaderActive] = useState(false);
	const dispatch = useAppDispatch();
	const flightsFromStore = useAppSelector(
		(state: any) => state.apiFlights.flights
	);

	useEffect(() => {
		const iata_code = selectedAirport?.iata_code;
		setTableActive(false);
		setLoaderActive(true);

		const fetchFlights = async () => {
			const data = await dataService.getFlights(iata_code, direction, offset);
			// setFlights(data.data);
			dispatch(setFlights(data.data));
			setTableActive(true);
			setLoaderActive(false);
		};
		fetchFlights();
	}, [selectedAirport, direction, offset, dispatch]);

	return (
		<Box
			sx={{
				position: 'relative',
				minHeight: '100vh',
				width: '98%',
				margin: '0 auto',
			}}>
			{loaderActive && (
				<CircularProgress
					variant='soft'
					size='lg'
					sx={{
						position: 'fixed',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
					}}
				/>
			)}
			{direction === 'arrival' && tableActive && (
				<ArrivalTable flights={flightsFromStore} />
			)}
			{direction === 'departure' && tableActive && (
				<DepartureTable flights={flightsFromStore} />
			)}
		</Box>
	);
};
