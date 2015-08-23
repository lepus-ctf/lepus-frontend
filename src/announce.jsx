import React from 'react';
import Api from './api'

export class Announce extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			announcements: []
		};
	}
	componentWillMount() {
		// Tap tap API server
		Api.announcements((json) => {
			this.setState({
				announcements: json,
				updated: Date()
			});
		}, (err, res) => {
			// TODO: error notification
		})
	}
	render() {
		var announcements = this.state.announcements.map((announcement, index) => {
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
									{announcement["body"]}
								</div>
								<div className="meta">
								</div>
							</div>
						</div>
				   );
		});
		if (!announcements) announcements = <div>No announcement</div>
		return (
				<div className="ui container">
					<div>Last updated: <span>{this.state.updated}</span></div>
					<div className="ui feed segment">
						{announcements}
					</div>
				</div>
				);
	}
};
