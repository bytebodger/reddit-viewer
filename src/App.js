import DataLayer from './components/data.layer';
import React from 'react';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core';

const theme = createMuiTheme({
   typography: {
      useNextVariants: true,
      suppressDeprecationWarnings: true,
   }
});
export default class App extends React.Component {
   render = () => {
      return (
         <MuiThemeProvider theme={theme}>
            <div id={'outerPaddingDiv'} style={{padding: '20px'}}>
               <DataLayer/>
            </div>
         </MuiThemeProvider>
      );
   };
}
