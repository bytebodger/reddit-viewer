import components from './utilities/components';
import React from 'react';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core';
import DataLayer from './components/data.layer';

const theme = createMuiTheme({
	typography : {
		useNextVariants : true,
		suppressDeprecationWarnings : true,
	}
});
export default class App extends React.Component {
	constructor(props) {
		super(props);
		components.App = this;
	}
	
	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<div style={{padding : '20px'}}>
					<DataLayer/>
				</div>
			</MuiThemeProvider>
		);
	}
}
