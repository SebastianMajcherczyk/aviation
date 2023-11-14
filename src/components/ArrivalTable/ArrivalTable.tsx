import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@mui/material';

import React, { useState } from 'react';
import { FlightDetails } from '../FlightDetails/FlightDetails';
import { Flight } from '../../interfaces/interfaces';

interface ArrivalTableProps {
	flights: Flight[] | null;
}

export const ArrivalTable: React.FC<ArrivalTableProps> = ({ flights }) => {
	const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
	const [selectedFlightIndex, setSelectedFlightIndex] = useState<number | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const handleClickFlight = (flight: Flight, index: number) => () => {
		setSelectedFlight(flight);
		setSelectedFlightIndex(index);
		setIsModalOpen(true);
	};
	return (
		<div>
			{selectedFlight && isModalOpen && (
				<Box>
					<FlightDetails flight={selectedFlight} setIsModalOpen={setIsModalOpen}
					flights={flights}
					selectedFlightIndex={selectedFlightIndex}
					setSelectedFlightIndex={setSelectedFlightIndex}
					
					/>
				</Box>
			)}
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Flight Number</TableCell>
						<TableCell>From</TableCell>
						<TableCell>Arrival Time</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Airline</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{flights?.map((flight, index) => (
						<TableRow
							key={flight.flight_date + flight.flight.number}
							sx={{
								'&:last-child td, &:last-child th': { border: 0 },
								cursor: 'pointer',
							}}
							onClick={handleClickFlight(flight, index)}>
							<TableCell>{flight.flight.iata}</TableCell>
							<TableCell>{flight.departure.airport}</TableCell>
							<TableCell>
								{new Date(flight.arrival.scheduled).toLocaleString('pl-PL')}
							</TableCell>
							<TableCell>{flight.flight_status}</TableCell>
							<TableCell>{flight.airline.name}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
