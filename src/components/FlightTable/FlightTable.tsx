import { CircularProgress } from '@mui/joy';
import { Box } from '@mui/material';
import React from 'react';

import { ArrivalTable } from '../ArrivalTable/ArrivalTable';
import { DepartureTable } from '../DepartureTable/DepartureTable';
import { SimpleAirport, Direction, Flight} from '../../interfaces/interfaces';


interface FlightTableProps {
	selectedAirport: SimpleAirport;
	direction: Direction;
	offset: number;
	date: string;
	flights: Flight[];
	tableActive: boolean;
	loaderActive: boolean;
}

export const FlightTable: React.FC<FlightTableProps> = ({
	selectedAirport,
	direction,
	offset,
	date,
	flights,
	tableActive,
	loaderActive
}) => {
	
	
	

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
				<ArrivalTable flights={flights} />
			)}
			{direction === 'departure' && tableActive && (
				<DepartureTable flights={flights} />
			)}
		</Box>
	);
};
