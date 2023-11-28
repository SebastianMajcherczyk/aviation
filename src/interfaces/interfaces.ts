export type Direction = 'arrival' | 'departure';

export interface Airport {
	name: string;
	city: string;
	country: string;
	iata_code: string;
	_geoloc: Geoloc;
	links_count: number;
	objectID: string;
}

export interface Geoloc {
	lat: number;
	lng: number;
}

export interface Country {
	id: number;
	alpha2: string;
	alpha3: string;
	name: string;
}

export interface SimpleAirport {
	name: string;
	iata_code: string;
	city?: string;
}
export interface Flight {
	flight_date: string;
	flight_status: string;
	departure: Departure;
	arrival: Arrival;
	airline: Airline;
	flight: FlightInfo;
	aircraft: Aircraft | null;
	dependentFlights?: []
}

export interface Departure {
	airport: string;
	timezone: string;
	iata: string;
	icao: string;
	terminal: string | null;
	gate: string | null;
	delay: number | null;
	scheduled: string;
	estimated: string;
	actual: string | null;
	estimated_runway: string | null;
	actual_runway: string | null;
}

export interface Arrival {
	airport: string;
	timezone: string;
	iata: string;
	icao: string;
	terminal: string | null;
	gate: string | null;
	baggage: string | null;
	delay: number | null;
	scheduled: string;
	estimated: string;
	actual: string | null;
	estimated_runway: string | null;
	actual_runway: string | null;
	aircraft: Aircraft | null;
}
export interface Airline {
	name: string;
	iata: string;
	icao: string;
}

export interface FlightInfo {
	number: string | null;
	iata: string | null;
	icao: string | null;
	codeshared: Codeshared | null;
}

export interface Aircraft {
	registration: string | null;
	iata: string | null;
	icao: string | null;
	icao24: string | null;
}

interface Codeshared {
	airline_iata: string;
	airline_icao: string;
	airline_name: string;
	flight_iata: string;
	flight_icao: string;
	flight_number: string;
}