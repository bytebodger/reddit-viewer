import DataLayer from './components/data.layer';
import React from 'react';
import components from './utilities/components';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core';

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
            <div id={'outerPaddingDiv'} style={{padding : '20px'}}>
               <DataLayer/>
            </div>
         </MuiThemeProvider>
      );
   }
}
