import DataLayerContext from './data.layer.context';
import React from 'react';
import ReactTable from 'react-table-6';
import is from '../utilities/is';
/** @namespace images.resolutions */
/** @namespace post.author */
/** @namespace post.created_utc */
/** @namespace post.num_comments */
/** @namespace post.permalink */

export default class PostsTable extends React.Component {
   changePage = (newPageNumber = 1) => {
      if (!is.aPositiveInteger(newPageNumber)) return;
      const dataLayer = this.context;
      const {posts} = dataLayer;
      let totalPages = Math.floor(posts.length / 25);
      if (posts.length % 25) {
         totalPages++;
      }
      if (newPageNumber >= totalPages - 2) {
         dataLayer.appendToSubreddit();
      }
      dataLayer.setCurrentPage(newPageNumber);
   };
   
   static contextType = DataLayerContext;
   
   columns = [
      {
         Cell: row => this.getThumbnailContainer(row.original.data),
         maxWidth: 120,
         sortable: false,
      },
      {
         Cell: row => this.getTitleCell(row.original.data),
         Header: 'Posts',
         sortable: false,
      },
   ];
   
   getCommentLink = (post = {}) => {
      if (!is.aPopulatedObject(post)) return;
      if (post.num_comments === 0) return '0 Comments';
      const comments = post.num_comments > 1 ? 'Comments' : 'Comment';
      return (
         <a
            href={post.permalink}
            target={'_blank'}
         >{post.num_comments} {comments}</a>
      );
   };
   
   getFormattedDate = (dateString = '') => {
      if (!is.aPopulatedString(dateString)) return;
      const date = new Date(dateString * 1000);
      return date.toLocaleString();
   };
   
   getHtmlDecodedContent = (content = '') => {
      if (!is.aPopulatedString(content)) return;
      const domParser = new DOMParser();
      const dom = domParser.parseFromString(`<!doctype html><body>${content}</body></html>`, 'text/html');
      return dom.body.textContent;
   };
   
   getSmallestImageResolution = (post = {}) => {
      if (!is.aPopulatedObject(post)) return;
      if (!post.preview || !post.preview.images || !post.preview.images.length) return null;
      const images = post.preview.images[0];
      if (!images.resolutions || !images.resolutions.length) return null;
      return images.resolutions[0];
   };
   
   getThumbnailContainer = (post = {}) => {
      if (!is.aPopulatedObject(post)) return;
      return (
         <div style={this.smallestPossibleRedditThumbnail}>
            {this.getThumbnailImage(post)}
         </div>
      );
   };
   
   getThumbnailImage = (post = {}) => {
      if (!is.aPopulatedObject(post)) return;
      const smallestImageResolution = this.getSmallestImageResolution(post);
      if (smallestImageResolution === null) return null;
      if (smallestImageResolution.width !== this.smallestPossibleRedditThumbnail.width) return null;
      const decodedUrl = smallestImageResolution.url.replace(/&amp;/g, '&');
      return <img src={decodedUrl} alt={'thumbnail'}/>;
   };
   
   getTitleCell = (post = {}) => {
      if (!is.aPopulatedObject(post)) return;
      return (
         <div style={{fontSize: '0.9em'}}>
            <a
               href={`https://www.reddit.com${post.url}`}
               target={'_blank'}
            >{this.getHtmlDecodedContent(post.title)}</a>
            <br/>
            <div style={{fontSize: '0.9em'}}>
               Posted by {post.author} on {this.getFormattedDate(post.created_utc)} - {this.getCommentLink(post)}
            </div>
         </div>
      );
   };
   
   render = () => {
      const dataLayer = this.context;
      return (
         <ReactTable
            className={'-highlight -striped'}
            columns={this.columns}
            data={dataLayer.posts}
            defaultPageSize={25}
            onPageChange={previousPageNumber => this.changePage(previousPageNumber)}
            showPageSizeOptions={false}
         />
      );
   };
   
   smallestPossibleRedditThumbnail = {
      height: 108,
      width: 108,
   };
}