import Button from '@material-ui/core/Button';
import components from '../utilities/components';
import is from '../utilities/is';
import React from 'react';
import {TextField} from '@material-ui/core';

const enterKey = 13;
export default class FindSubredditForm extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         findButtonIsDisabled : true,
         subreddit : '',
      };
      components.FindSubredditForm = this;
   }
   
   checkFindButton(subreddit = '') {
      if (!is.aString(subreddit)) return;
      const {findButtonIsDisabled} = this.state;
      if (subreddit && findButtonIsDisabled) {
         this.setState({findButtonIsDisabled : false});
      } else if (!subreddit && !findButtonIsDisabled) {
         this.setState({findButtonIsDisabled : true});
      }
   }
   
   render() {
      const {findButtonIsDisabled, subreddit} = this.state;
      return (
         <div style={{marginBottom : '20px'}}>
            <TextField
               id={'subreddit'}
               inputProps={{
                  id : 'subredditInputField',
                  name : 'subredditInputField',
                  style : {width : '300px'}
               }}
               label={'Find a Subreddit'}
               name={'subreddit'}
               onChange={(event) => this.updateSubredditField(event)}
               onKeyDown={(event) => this.submitOnEnter(event)}
               placeholder={'Find a Subreddit'}
               value={subreddit}
            />
            <Button
               disabled={findButtonIsDisabled}
               id={'findButton'}
               onClick={() => components.DataLayer.getSubreddit(subreddit)}
               style={{
                  backgroundColor : '#3F51B5',
                  color : '#eeeeee',
                  marginLeft : '20px',
                  marginTop : '10px',
                  opacity : findButtonIsDisabled ? 0.3 : 1,
               }}
            >
               Find
            </Button>
         </div>
      );
   }
   
   submitOnEnter(event) {
      if (!event.keyCode) return;
      if (event.keyCode === enterKey) {
         const {subreddit} = this.state;
         if (subreddit) {
            components.DataLayer.getSubreddit(subreddit);
         }
      }
   }
   
   updateSubredditField(event = {}) {
      if (!event.target.name) return;
      const newValue = event.target.value.trim();
      this.setState({
         subreddit : newValue,
      });
      this.checkFindButton(newValue);
   }
}