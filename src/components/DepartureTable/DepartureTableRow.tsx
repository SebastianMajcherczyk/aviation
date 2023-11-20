import { TableCell, TableRow } from '@mui/material';
import React, { useMemo } from 'react';

import { Flight } from '../../interfaces/interfaces';
import { airports } from '../../data/airports';

interface DepartureTableRowProps {
	flight: Flight;
	handleClickFlight: (flight: Flight) => () => void;
}

export const DepartureTableRow: React.FC<DepartureTableRowProps> = ({
	flight,
	handleClickFlight,
}) => {
	const flightCity = useMemo<string>(() => {
		const airport = airports.find(
			airport => airport.iata_code === flight.arrival.iata
		);
		return airport ? airport.city : flight.arrival.airport;
	}, [flight.arrival]);

	return (
		<TableRow
			className='table-row'
			key={flight.departure.scheduled + flight.flight.iata}
			sx={{
				'&:last-child td, &:last-child th': { border: 0 },
				cursor: 'pointer',
			}}
			onClick={handleClickFlight(flight)}>
			<TableCell>{flight.flight.iata}</TableCell>
			<TableCell>{`${flightCity} ,   (${flight.arrival.iata})`}</TableCell>
			<TableCell>
				{flight.departure.scheduled.slice(0, 10) + ' ' + flight.departure.scheduled.slice(11, 16) }
			</TableCell>
			<TableCell>{flight.flight_status}</TableCell>
			<TableCell>{flight.airline.name}</TableCell>
		</TableRow>
	);
};
