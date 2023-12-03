import {
	IconButton,
	TableCell,
	TableRow,
	Collapse,
	Box,
	Typography,
	Table,
	TableHead,
	TableBody,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

import { Flight } from '../../interfaces/interfaces';
import { airports } from '../../data/airports';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useAppSelector } from '../../store/store';

interface ArrivalTableRowProps {
	flight: Flight;
	handleClickFlight: (flight: Flight) => () => void;
}

export const ArrivalTableRow: React.FC<ArrivalTableRowProps> = ({
	flight,
	handleClickFlight,
}) => {
	const sharedOpen = useAppSelector(
		state => state.filter.sharedFlightsTableOpen
	);
	const [open, setOpen] = useState(sharedOpen);

	useEffect(() => {
		setOpen(sharedOpen);
	}, [sharedOpen]);

	//Finds the city of the current flight departure airport to display it in the table
	const flightCity = useMemo<string>(() => {
		const airport = airports.find(
			airport => airport.iata_code === flight.departure.iata
		);
		return airport ? airport.city : flight.departure.airport;
	}, [flight.departure]);

	return (
		<>
			<TableRow
				className='table-row'
				key={flight.arrival.scheduled + flight.flight.iata}
				sx={{
					'&:last-child td, &:last-child th': { border: 0 },
					cursor: 'pointer',
				}}>
				<TableCell>
					{flight.dependentFlights.length > 0 && (
						<IconButton onClick={() => setOpen(!open)}>
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					)}
				</TableCell>

				<TableCell onClick={handleClickFlight(flight)}>
					{flight.flight.iata}
				</TableCell>
				<TableCell
					onClick={handleClickFlight(
						flight
					)}>{`${flightCity} ,   (${flight.departure.iata})`}</TableCell>
				<TableCell onClick={handleClickFlight(flight)}>
					{flight.arrival.scheduled.slice(0, 10) +
						' ' +
						flight.arrival.scheduled.slice(11, 16)}
				</TableCell>
				<TableCell onClick={handleClickFlight(flight)}>
					{flight.flight_status}
				</TableCell>
				<TableCell onClick={handleClickFlight(flight)}>
					{flight.airline.name}
				</TableCell>
			</TableRow>
			{flight.dependentFlights.length > 0 &&  <TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
					<Collapse in={open} timeout='auto' unmountOnExit>
						<Box>
							<Typography variant='h6' gutterBottom>
								Codeshared
							</Typography>
							<Table size='small' aria-label='codeshared-flights'>
								<TableHead>
									<TableRow>
										<TableCell>Flight Number</TableCell>
										<TableCell>Airline</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{flight.dependentFlights?.map((sharedFlight: Flight) => (
										<TableRow
											key={flight.flight.iata}
											sx={{
												'&:last-child td, &:last-child th': { border: 0 },
											}}>
											<TableCell>{sharedFlight.flight.iata}</TableCell>
											<TableCell>{sharedFlight.airline.name}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>}
		</>
	);
};
