import './App.css';
import React from 'react';

import { SearchForm } from './components/SearchForm/SearchForm';


const App: React.FC = () => {
	return (
		<div className='App'>
			<SearchForm />
		</div>
	);
};

export default App;
