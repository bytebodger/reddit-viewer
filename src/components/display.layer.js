import components from '../utilities/components';
import FindSubredditForm from './find.subreddit.form';
import React from 'react';
import PostsTable from './posts.table';

export default class DisplayLayer extends React.Component {
	constructor(props) {
		super(props);
		components.DisplayLayer = this;
	}
	
	getFailureAlert() {
		const { lastSearch } = components.DataLayer.state;
		if (!lastSearch.failed) return null;
		return (
			<div
				style={{
					backgroundColor: '#e82517',
					borderRadius: '10px',
					color: 'white',
					marginBottom: '20px',
					padding: '10px',
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