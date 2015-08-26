import React from 'react';
import Api from './api'
import {connect} from 'react-redux';
import {UPDATE_TEAMLIST} from './store'

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		// Tap tap API server
		Api.teamlist((json) => {
			this.props.updateTeamlist(json);
		}, (err, res) => {
			// TODO: error notification
		})
	}
	render() {
		const {point, solved, teamlist, ranking} = this.props;
		return (
				<div className="ui container">
					<h1 className="ui top header blue">Countdown</h1>
					<div className="ui segment blue ">
						<div className="ui three statistics">
							<div className="statistic">
								<div className="value">
									4
								</div>
								<div className="label">
									Hours
								</div>
							</div>
							<div className="statistic">
								<div className="value">
									00
								</div>
								<div className="label">
									Minutes
								</div>
							</div>
							<div className="statistic">
								<div className="value">
									00
								</div>
								<div className="label">
									Seconds
								</div>
							</div>
						</div>
					</div>
					<h1 className="ui top header purple">Statisitcs</h1>
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
				</div>
			   );
	}
};

export default connect(
		(state) => ({
			solved: state.solved,
			point: state.point,
			teamlist: state.teamList,
			ranking: state.ranking
		}),
		(dispatch) => ({updateTeamlist: (data) => dispatch({type: UPDATE_TEAMLIST, data: data})})
		)(Dashboard);
