import FindSubredditForm from './find.subreddit.form';
import PostsTable from './posts.table';
import React from 'react';
import components from '../utilities/components';

export default class DisplayLayer extends React.Component {
   constructor(props) {
      super(props);
      components.DisplayLayer = this;
   }
   
   getFailureAlert() {
      const {lastSearch} = components.DataLayer.state;
      if (!lastSearch.failed) return null;
      return (
         <div
            id={'failedSearchDiv'}
            style={{
               backgroundColor : '#e82517',
               borderRadius : '10px',
               color : 'white',
               marginBottom : '20px',
               padding : '10px',
            }}
         >
            The subreddit '{lastSearch.subreddit}' is invalid or could not be retrieved!
         </div>
      );
   }
   
   render() {
      return (
         <>
            {this.getFailureAlert()}
            <FindSubredditForm/>
            <PostsTable/>
         </>
      );
   }
}