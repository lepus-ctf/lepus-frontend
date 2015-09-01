import React from 'react';
import Api from '../api/api'
import {connect} from 'react-redux';
import {UPDATE_ANNOUNCEMENTS, RESET_EVENTS} from '../data/store'
global.React = React;
var md2react = require('md2react');

class Announcements extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			updated: null,
			error: null
		};
	}
	componentWillMount() {
		// Tap tap API server
		Api.announcements((json) => {
			this.props.updateAnnouncements(json);
			this.setState({
				updated: Date()
			});
		}, (mes) => {
			this.setState({
				error: mes
			});
		})
		this.props.resetEvents();
	}
	clearError() {
		this.setState({
			error: null
		});
	}
	render() {
		const {announcements} = this.props;
		var contents = announcements.map((announcement, index) => {
			return (
						<div className="event" key={announcement.id}>
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
		var errorMessage;
		if (this.state.error) {
			errorMessage = (
					<div className="ui floating negative message">
						<i className="close icon" onClick={this.clearError.bind(this)}></i>
							<div className="header">
								Error
							</div>
						<p>{this.state.error[0]}</p>
					</div>
					);
		}
		return (
				<div className="ui container">
					<div>Last updated: <span>{this.state.updated}</span></div>
					<div className="ui feed segment">
						{contents}
					</div>
					<div className="ui divider">
					</div>
					{errorMessage}
				</div>
				);
	}
};

export default connect(
		(state) => ({
			announcements: state.announcements
		}),
		(dispatch) => ({
			updateAnnouncements: (data) => dispatch({type: UPDATE_ANNOUNCEMENTS, data: data}),
			resetEvents: () => dispatch({type: RESET_EVENTS, data: "announcements"})
		})
		)(Announcements);
