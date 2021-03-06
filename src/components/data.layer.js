import DataLayerContext from './data.layer.context';
import DisplayLayer from './display.layer';
import is from '../utilities/is';
import React from 'react';

/** @namespace existingPost.data.stickied */

const constant = {
   oneMinute: 60000,
   pageSize: 25,
};

export default class DataLayer extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         appendToSubreddit: this.appendToSubreddit,
         currentPage: 1,
         getSubreddit: this.getSubreddit,
         lastSearch: {
            failed: false,
            subreddit: null,
         },
         posts: [],
         setCurrentPage: this.setCurrentPage,
      };
   }
   
   addNewPosts = (originalPosts = [], latestPosts = []) => {
      if (!is.anArray(originalPosts) || !is.anArray(latestPosts)) return;
      let updatedPosts = JSON.parse(JSON.stringify(originalPosts));
      let insertNewPostsAt = -1;
      let originalPostIds = [];
      originalPosts.forEach((originalPost, originalPostIndex) => {
         if (insertNewPostsAt === -1 && !originalPost.data.stickied) {
            insertNewPostsAt = originalPostIndex;
         }
         originalPostIds.push(originalPost.data.id);
      });
      if (insertNewPostsAt === -1) {
         insertNewPostsAt = 0;
      }
      latestPosts.forEach(latestPost => {
         if (!originalPostIds.some(originalPostId => originalPostId === latestPost.data.id)) {
            updatedPosts.splice(insertNewPostsAt, 0, latestPost);
            insertNewPostsAt++;
         }
      });
      return updatedPosts;
   };
   
   appendToSubreddit = () => {
      const lastPost = this.state.posts[this.state.posts.length - 1].data;
      const {lastSearch} = this.state;
      fetch(`https://www.reddit.com/r/${lastSearch.subreddit}.json?limit=100&after=t3_${lastPost.id}&random=${Date.now()}`)
         .then(response => response.json())
         .then(json => {
            if (json && json.data) {
               const combinedPosts = [...this.state.posts, ...json.data.children];
               this.setState({posts: combinedPosts});
            }
         })
         .catch(error => {
            console.error(`error trying to append to the ${lastSearch.subreddit} subreddit`);
            console.error(error);
         });
   };
   
   componentDidMount = () => this.updateSubreddit();
   
   getSubreddit = (subreddit = '') => {
      if (!is.aPopulatedString(subreddit)) return;
      fetch(`https://www.reddit.com/r/${subreddit}.json?limit=100&random=${Date.now()}`)
         .then(response => response.json())
         .then(json => {
            if (!json) {
               this.setState({
                  lastSearch: {
                     failed: true,
                     subreddit: subreddit,
                  },
                  posts: [],
               });
               return;
            }
            if (json.data && json.data.children) {
               this.setState({
                  currentPage: 1,
                  lastSearch: {
                     failed: false,
                     subreddit: subreddit,
                  },
                  posts: json.data.children,
               });
            }
         })
         .catch(error => {
            console.error(`error trying to retrieve the ${subreddit} subreddit`);
            console.error(error);
         });
   };
   
   removeDeletedPosts = (originalPosts = [], latestPosts = []) => {
      if (!is.anArray(originalPosts) || !is.anArray(latestPosts)) return;
      let updatedPosts = JSON.parse(JSON.stringify(originalPosts));
      let latestPostIds = [];
      latestPosts.forEach(latestPost => latestPostIds.push(latestPost.data.id));
      let originalPostIndexesToRemove = [];
      originalPosts.forEach((originalPost, originalPostIndex) => {
         if (!latestPostIds.some(latestPostId => latestPostId === originalPost.data.id)) {
            originalPostIndexesToRemove.push(originalPostIndex);
         }
      });
      for (let i = originalPostIndexesToRemove.length - 1; i >= 0; i--) {
         const indexToRemove = originalPostIndexesToRemove[i];
         updatedPosts.splice(indexToRemove, 1);
      }
      return updatedPosts;
   };
   
   render = () => {
      return (
         <DataLayerContext.Provider value={this.state}>
            <DisplayLayer/>
         </DataLayerContext.Provider>
      );
   };
   
   setCurrentPage = (newPageNumber = 1) => {
      if (!is.aPositiveInteger(newPageNumber)) return;
      this.setState({currentPage: newPageNumber});
   };
   
   updateExistingPosts = (originalPosts = [], latestPosts = []) => {
      if (!is.anArray(originalPosts) || !is.anArray(latestPosts)) return;
      let updatedPosts = JSON.parse(JSON.stringify(originalPosts));
      latestPosts.forEach(latestPost => {
         let indexFound = false;
         originalPosts.forEach((originalPost, originalPostIndex) => {
            if (indexFound) return;
            if (originalPost.data.id === latestPost.data.id) {
               indexFound = true;
               const latestPostJson = JSON.stringify(latestPost);
               const originalPostJson = JSON.stringify(originalPost);
               if (originalPostJson !== latestPostJson) {
                  updatedPosts[originalPostIndex] = JSON.parse(latestPostJson);
               }
            }
         });
      });
      return updatedPosts;
   };
   
   updateSubreddit = () => {
      setTimeout(() => {
         const {currentPage, lastSearch, posts} = this.state;
         if (!lastSearch.subreddit) return;
         let url = `https://www.reddit.com/r/${lastSearch.subreddit}.json?limit=100&random=${Date.now()}`;
         if (currentPage > 1) {
            const previousPostIndex = (currentPage * constant.pageSize) - 1;
            const after = posts[previousPostIndex].data.id;
            url += `&after=tp3_${after}`;
         }
         fetch(url)
            .then(response => response.json())
            .then(json => {
               if (json && json.data && json.data.children) {
                  let originalPosts = JSON.parse(JSON.stringify(posts));
                  let originalPostsJson = JSON.stringify(posts);
                  let latestPosts = JSON.parse(JSON.stringify(json.data.children));
                  let updatedPosts = this.updateExistingPosts(originalPosts, latestPosts);
                  updatedPosts = this.addNewPosts(updatedPosts, latestPosts);
                  updatedPosts = this.removeDeletedPosts(updatedPosts, latestPosts);
                  const updatedPostsJson = JSON.stringify(updatedPosts);
                  if (updatedPostsJson !== originalPostsJson) {
                     this.setState({posts: updatedPosts});
                  }
               }
            })
            .catch(error => {
               console.error(`error trying to update the ${lastSearch.subreddit} subreddit`);
               console.error(error);
            });
         this.updateSubreddit();
      }, constant.oneMinute);
   };
}
