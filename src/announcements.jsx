import React from 'react';
import Api from './api'
import {connect} from 'react-redux';
import {UPDATE_ANNOUNCEMENTS} from './store'
global.React = React;
var md2react = require('md2react');

class Announcements extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			updated: null
		};
	}
	componentWillMount() {
		// Tap tap API server
		Api.announcements((json) => {
			this.props.updateAnnouncements(json);
			this.setState({
				updated: Date()
			});
		}, (err, res) => {
			// TODO: error notification
		})
	}
	render() {
		const {announcements} = this.props;
		var contents = announcements.map((announcement, index) => {
			return (
						<div className="event">
							<div className="label">
								<i className="icon announcement"></i>
							</div>
							<div className="content">
								<div className="summary">
									{announcement["title"]}
									<div className="date">
										{new Date(announcement["updated_at"]).toTimeString()}
									</div>
								</div>
								<div className="extra text">
									{md2react(announcement["body"], {gfm: true, tables: true})}
								</div>
								<div className="meta">
								</div>
							</div>
						</div>
				   );
		});
		if (!contents) contents = <div>No announcement</div>
		return (
				<div className="ui container">
					<div>Last updated: <span>{this.state.updated}</span></div>
					<div className="ui feed segment">
						{contents}
					</div>
					<div className="ui divider">
					</div>
				</div>
				);
	}
};

export default connect(
		(state) => ({
			announcements: state.announcements
		}),
		(dispatch) => ({updateAnnouncements: (data) => dispatch({type: UPDATE_ANNOUNCEMENTS, data: data})})
		)(Announcements);
