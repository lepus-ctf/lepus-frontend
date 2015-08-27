import React from 'react';
import Api from './api'
import {connect} from 'react-redux';
import {UPDATE_TEAMLIST} from './store'

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null
		};
	}
	componentWillMount() {
		// Tap tap API server
		Api.teamlist((json) => {
			this.props.updateTeamlist(json);
		}, (mes) => {
			this.setState({
				error: mes
			});
		})
		this.timer = setInterval(() => {
			this.setState({now: new Date()})
		}.bind(this), 1000);
	}
	componentWillUnmount() {
		clearInterval(this.timer);
	}
	clearError() {
		this.setState({
			error: null
		});
	}
	render() {
		const {point, solved, teamlist, ranking, countdown} = this.props;
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
					<h1 className="ui top header blue">Countdown</h1>
					<div className="ui segment blue ">
						<div className="ui three statistics">
							<div className="statistic">
								<div className="value">
									{countdown.h || 'n/a'}
								</div>
								<div className="label">
									Hours
								</div>
							</div>
							<div className="statistic">
								<div className="value">
									{countdown.m || 'n/a'}
								</div>
								<div className="label">
									Minutes
								</div>
							</div>
							<div className="statistic">
								<div className="value">
									{countdown.s || 'n/a'}
								</div>
								<div className="label">
									Seconds
								</div>
							</div>
						</div>
					</div>
					<h1 className="ui top header purple">Statistics</h1>
					<div className="ui three column grid center aligned">
						<div className="column">
							<div className="ui segment red">
								<div className="ui statistic">
									<h3 className="ui header">Ranking</h3>
									<div className="value">
										{ranking}
									</div>
									<div className="label">
										of {teamlist.length}
									</div>
								</div>
							</div>
						</div>
						<div className="column">
							<div className="ui segment orange">
								<div className="ui statistic">
									<h3 className="ui header">Score</h3>
									<div className="value">
										{point}
									</div>
									<div className="label">
										points
									</div>
								</div>
							</div>
						</div>
						<div className="column">
							<div className="ui segment violet">
								<div className="ui statistic">
									<h3 className="ui header">Flags</h3>
									<div className="value">
										{solved}
									</div>
									<div className="label">
										captured
									</div>
								</div>
							</div>
						</div>
					</div>
					{errorMessage}
				</div>
			   );
	}
};

export default connect(
		(state) => ({
			solved: state.solved,
			point: state.point,
			teamlist: state.teamList,
			ranking: state.ranking,
			start: state.config.start,
			end: state.config.end,
			countdown: state.countdown
		}),
		(dispatch) => ({updateTeamlist: (data) => dispatch({type: UPDATE_TEAMLIST, data: data})})
		)(Dashboard);
