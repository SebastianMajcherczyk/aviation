import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@mui/material';
import { useState } from 'react';
import { FlightDetails } from '../FlightDetails/FlightDetails';
import { Flight } from '../../interfaces/interfaces';

interface DepartureTableProps {
	flights: Flight[] | null;
}

export const DepartureTable: React.FC<DepartureTableProps> = ({ flights }) => {
	const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
	const [selectedFlightIndex, setSelectedFlightIndex] = useState<number | null>(
		null
	);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const handleClickFlight = (flight: Flight) => () => {
		setSelectedFlight(flight);
		setIsModalOpen(true);
	};

	return (
		<div>
			{selectedFlight && isModalOpen && (
				<Box>
					<FlightDetails
						flight={selectedFlight}
						setIsModalOpen={setIsModalOpen}
						flights={flights}
						selectedFlightIndex={selectedFlightIndex}
						setSelectedFlightIndex={setSelectedFlightIndex}
					/>
				</Box>
			)}
			<Table>
				<TableHead className='table-head'>
					<TableRow>
						<TableCell>Flight Number</TableCell>
						<TableCell>To</TableCell>
						<TableCell>Departure Time</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Airline</TableCell>
					</TableRow>
				</TableHead>
				<TableBody className='table-body'>
					{flights?.map(flight => (
						<TableRow className='table-row'
							key={flight.departure.scheduled + flight.flight.iata}
							sx={{
								'&:last-child td, &:last-child th': { border: 0 },
								cursor: 'pointer',
							}}
							onClick={handleClickFlight(flight)}>
							<TableCell>{flight.flight.iata}</TableCell>
							<TableCell>
								{flight.arrival.airport}, {flight.arrival.iata}
							</TableCell>
							<TableCell>
								{new Date(flight.departure.scheduled).toLocaleString('pl-PL')}
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
