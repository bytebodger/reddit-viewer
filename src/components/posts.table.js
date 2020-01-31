import components from '../utilities/components';
import React from 'react';
import ReactTable from 'react-table-6';

/** @namespace images.resolutions */
/** @namespace post.author */
/** @namespace post.created_utc */
/** @namespace post.num_comments */
/** @namespace post.permalink */

export default class PostsTable extends React.Component{
	constructor(props) {
		super(props);
		components.PostsTable = this;
	}
	
	columns = [
		{
			Cell : row => this.getThumbnail(row.original.data),
			maxWidth : 120,
			sortable : false,
		},
		{
			Cell : row => this.getTitleCell(row.original.data),
			Header : 'Posts',
			sortable : false,
		},
	];
	
	getThumbnail(post) {
		let thumbnail = <div style={{height : 108, width : 67}}>{' '}</div>;
		if (post.preview && post.preview.images) {
			const images = post.preview.images[0];
			if (images.resolutions) {
				const smallestThumbnail = images.resolutions[0];
				if (smallestThumbnail.width === 108) {
					const url = smallestThumbnail.url.replace(/&amp;/g, '&');
					thumbnail = (
						<div style={{height : 108, width : 67}}>
							<img src={url} alt={'thumbnail'} />
						</div>
					);
				}
			}
		}
		return thumbnail;
	}
	
	getTitleCell(post) {
		let commentLink = '0 Comments';
		if (post.num_comments > 0) {
			const comments = post.num_comments > 1 ? 'Comments' : 'Comment';
			commentLink = (
				<a
					href={post.permalink}
					target={'_blank'}
				>{post.num_comments} {comments}</a>
			);
		}
		const domParser = new DOMParser();
		const dom = domParser.parseFromString(`<!doctype html><body>${post.title}</body></html>`, 'text/html');
		const decodedTitle = dom.body.textContent;
		const date = new Date(post.created_utc * 1000);
		const authoredOn = date.toLocaleString();
		return (
			<div style={{fontSize : '0.9em'}}>
				<a
					href={`https://www.reddit.com${post.url}`}
					target={'_blank'}
				>{decodedTitle}</a>
				<br/>
				<div style={{fontSize : '0.9em'}}>
					Posted by {post.author} on {authoredOn} - {commentLink}
				</div>
			</div>
		);
	}
	
	changePage(newPageNumber) {
		const posts = components.DataLayer.state.posts;
		let totalPages = Math.floor(posts.length / 25);
		if (posts.length % 25) {
			totalPages++;
		}
		if (newPageNumber >= totalPages - 2) {
			components.DataLayer.appendToSubreddit();
		}
		components.DataLayer.currentPage = newPageNumber;
	}
	
	render() {
		return (
			<ReactTable
				className={'-highlight -striped'}
				columns={this.columns}
				data={components.DataLayer.state.posts}
				defaultPageSize={25}
				onPageChange={previousPageNumber => this.changePage(previousPageNumber)}
				showPageSizeOptions={false}
			/>
		);
	}
}