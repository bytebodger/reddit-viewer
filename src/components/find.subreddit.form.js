import Button from '@material-ui/core/Button';
import DataLayerContext from './data.layer.context';
import React from 'react';
import is from '../utilities/is';
import {TextField} from '@material-ui/core';

const enterKey = 13;
export default class FindSubredditForm extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         findButtonIsDisabled: true,
         subreddit: '',
      };
   }
   
   static contextType = DataLayerContext;
   
   checkFindButton = (subreddit = '') => {
      if (!is.aString(subreddit)) return;
      const {findButtonIsDisabled} = this.state;
      if (subreddit && findButtonIsDisabled) {
         this.setState({findButtonIsDisabled: false});
      } else if (!subreddit && !findButtonIsDisabled) {
         this.setState({findButtonIsDisabled: true});
      }
   };
   
   render = () => {
      const {findButtonIsDisabled, subreddit} = this.state;
      const dataLayer = this.context;
      return (
         <div style={{marginBottom: '20px'}}>
            <TextField
               id={'subreddit'}
               inputProps={{
                  id: 'subredditInputField',
                  name: 'subredditInputField',
                  style: {width: '300px'}
               }}
               label={'Find a Subreddit'}
               name={'subreddit'}
               onChange={this.updateSubredditField}
               onKeyDown={event => this.submitOnEnter(event)}
               placeholder={'Find a Subreddit'}
               value={subreddit}
            />
            <Button
               disabled={findButtonIsDisabled}
               id={'findButton'}
               onClick={() => dataLayer.getSubreddit(subreddit)}
               style={{
                  backgroundColor: '#3F51B5',
                  color: '#eeeeee',
                  marginLeft: '20px',
                  marginTop: '10px',
                  opacity: findButtonIsDisabled ? 0.3 : 1,
               }}
            >
               Find
            </Button>
         </div>
      );
   };
   
   submitOnEnter = event => {
      if (!event.keyCode || event.keyCode !== enterKey) return;
      const {subreddit} = this.state;
      if (!subreddit) return;
      const dataLayer = this.context;
      dataLayer.getSubreddit(subreddit);
   };
   
   updateSubredditField = (event = {}) => {
      if (!event.target.name) return;
      const newValue = event.target.value.trim();
      this.setState({subreddit: newValue});
      this.checkFindButton(newValue);
   };
}