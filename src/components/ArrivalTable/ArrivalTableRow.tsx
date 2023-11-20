import { TableCell, TableRow } from '@mui/material';
import React, { useMemo } from 'react';

import { Flight } from '../../interfaces/interfaces';
import { airports } from '../../data/airports';

interface ArrivalTableRowProps {
	flight: Flight;
	handleClickFlight: (flight: Flight) => () => void;
}

export const ArrivalTableRow: React.FC<ArrivalTableRowProps> = ({
	flight,
	handleClickFlight,
}) => {
    const flightCity = useMemo<string>(() => {
        const airport = airports.find(
            airport => airport.iata_code === flight.departure.iata
        );
        return airport ? airport.city : flight.departure.airport;
    }, [flight.departure]);

	return (
		<TableRow
			className='table-row'
			key={flight.arrival.scheduled + flight.flight.iata}
			sx={{
				'&:last-child td, &:last-child th': { border: 0 },
				cursor: 'pointer',
			}}
			onClick={handleClickFlight(flight)}>
			<TableCell>{flight.flight.iata}</TableCell>
			<TableCell>{`${flightCity} ,   (${flight.departure.iata})`}</TableCell>
			<TableCell>
			{flight.arrival.scheduled.slice(0, 10) + ' ' + flight.arrival.scheduled.slice(11, 16) }
			</TableCell>
			<TableCell>{flight.flight_status}</TableCell>
			<TableCell>{flight.airline.name}</TableCell>
		</TableRow>
	);
};
