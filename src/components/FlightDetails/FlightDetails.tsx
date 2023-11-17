import React, { useRef, useEffect } from 'react';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { Flight } from '../../interfaces/interfaces';
import './FlightDetails.css';

interface FlightDetailsProps {
	flight: Flight;
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	flights: Flight[] | null;
	setSelectedFlight: React.Dispatch<React.SetStateAction<Flight | null>>;
	selectedFlightIndex: number | null;
	setSelectedFlightIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

export const FlightDetails: React.FC<FlightDetailsProps> = ({
	flight,
	setIsModalOpen,
	flights,
	setSelectedFlight,
	selectedFlightIndex,
	setSelectedFlightIndex,
}) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				setIsModalOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [setIsModalOpen]);

	const navigateToFlight = (direction: 'prev' | 'next') => {
		if (selectedFlightIndex === null || flights === null) return;
		let newIndex;
		if (direction === 'prev') {
			newIndex =
				selectedFlightIndex === 0
					? flights.length - 1
					: selectedFlightIndex - 1;
		} else {
			newIndex =
				selectedFlightIndex === flights.length - 1
					? 0
					: selectedFlightIndex + 1;
		}
		setSelectedFlight(flights[newIndex]);
		setSelectedFlightIndex(newIndex);
	};

	const modalRef = useRef<HTMLDivElement>(null);
	return (
		<Box className='modal-container'>
			<Box ref={modalRef} className='modal-box'>
				<ChevronLeftIcon
					className='chevron-left'
					onClick={() => navigateToFlight('prev')}
				/>
				<CloseIcon
					className='close-icon'
					onClick={() => setIsModalOpen(false)}
				/>
				<Typography
					sx={{
						fontSize: '2rem',
						fontWeight: 'bold',
						textAlign: 'center',
					}}>
					{flight.flight.icao}
				</Typography>
				<Typography
					sx={{
						fontSize: '1.5rem',
						fontWeight: 'bold',
						textAlign: 'center',
					}}>
					{flight.airline.name}
				</Typography>
				<Typography
					sx={{
						fontSize: '1.5rem',
						fontWeight: 'bold',
						textAlign: 'center',
					}}>
					{flight.aircraft?.icao}
				</Typography>
				<Table
					sx={{
						margin: {
							xs: '5px auto',
							md: '50px auto',
						},
					}}>
					<TableHead>
						<TableRow>
							<TableCell>Departure Airport</TableCell>
							<TableCell>Departure time</TableCell>
							<TableCell>Departure Terminal</TableCell>
							<TableCell>Departure Gate</TableCell>
							<TableCell>Departure Delay</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow key={flight.flight_date + flight.flight.number}>
							<TableCell>
								{flight.departure.airport}, {flight.departure.iata}
							</TableCell>
							<TableCell>{flight.departure.scheduled}</TableCell>
							<TableCell>{flight.departure.terminal}</TableCell>
							<TableCell>{flight.departure.gate}</TableCell>
							<TableCell>{flight.departure.delay}</TableCell>
							<TableCell sx={{ width: '100px' }}></TableCell>
						</TableRow>
					</TableBody>
				</Table>

				<Table
					sx={{
						margin: {
							xs: '5px auto',
							md: '50px auto',
						},
					}}>
					<TableHead>
						<TableRow>
							<TableCell>Arrival Airport</TableCell>
							<TableCell>Arrival Time</TableCell>
							<TableCell>Arrival Terminal</TableCell>
							<TableCell>Arrival Gate</TableCell>
							<TableCell>Arrival Delay</TableCell>
							<TableCell>Baggage</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow key={flight.flight_date + flight.flight.number}>
							<TableCell>
								{flight.arrival.airport}, {flight.arrival.iata}
							</TableCell>
							<TableCell>{flight.arrival.scheduled}</TableCell>
							<TableCell>{flight.arrival.terminal}</TableCell>
							<TableCell>{flight.arrival.gate}</TableCell>
							<TableCell>{flight.arrival.delay}</TableCell>
							<TableCell>{flight.arrival.baggage}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
				<ChevronRightIcon
					className='chevron-right'
					onClick={() => navigateToFlight('next')}
				/>
			</Box>
		</Box>
	);
};
