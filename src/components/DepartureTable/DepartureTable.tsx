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
import { DepartureTableRow } from './DepartureTableRow';

interface DepartureTableProps {
	flights: Flight[] | null;
}

export const DepartureTable: React.FC<DepartureTableProps> = ({ flights }) => {
	const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
	const [selectedFlightIndex, setSelectedFlightIndex] = useState<number | null>(
		null
	);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const handleClickFlight = (index: number) =>  (flight: Flight) => () => {
		setSelectedFlight(flight);
		setSelectedFlightIndex(index);
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
						setSelectedFlight={setSelectedFlight}
					/>
				</Box>
			)}
			<Table stickyHeader>
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
					{flights?.map((flight, index) => (
				<DepartureTableRow key={flight.departure.scheduled + flight.flight.iata} flight={flight} handleClickFlight={handleClickFlight(index)}/>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
