import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { Box } from '@mui/material';
import './DatePickerComponent.css'

interface DatePickerComponentProps {
	date: Date;
	setDate: React.Dispatch<React.SetStateAction<Date>>
}

export const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
	date,
	setDate,
}) => {
	return (
		<Box className='selection-item'>
			<LocalizationProvider dateAdapter={AdapterDayjs} >
				<DatePicker label='Wybierz datę' 
                maxDate={dayjs().add(1, 'day')}
                className='date-picker' 
                format='DD/MM/YYYY' 
                value={dayjs(date)}
                onChange={(newValue) => {
                    if (newValue) {
                        setDate(newValue.toDate());
                    }
                }}
                
                />
              
			</LocalizationProvider>
		</Box>
	);
};
