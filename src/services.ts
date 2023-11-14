import type { Direction } from './interfaces/interfaces';


const dataServiceDef = () => {
	const apiKey = 'b6262521f04a0543604820b593a7a679';
	const proxyUrl = 'https://corsproxy.io/?';
	const baseUrl = 'http://api.aviationstack.com/v1/flights?access_key=';
	const getFlights = async (iata_code: string, direction: Direction, offset: number) => {
		try {
			const url = (): string => {
				if (direction === 'arrival') {
					return `${proxyUrl}${baseUrl}${apiKey}&arr_iata=${iata_code}&offset=${offset}`;
				} else {
					return `${proxyUrl}${baseUrl}${apiKey}&dep_iata=${iata_code}&offset=${offset}`;
				} 
			};
			const response = await fetch(url());
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
		}
	};
	return { getFlights };
};

export const dataService = dataServiceDef();
