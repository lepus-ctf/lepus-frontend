import React from 'react';
import Api from './api'
import {connect} from 'react-redux';
import {UPDATE_TEAMLIST} from './store'

class Ranking extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			updated: null
		};
	}
	componentWillMount() {
		// Tap tap API server
		Api.teamlist((json) => {
			this.props.updateTeamlist(json);
			this.setState({
				updated: Date()
			});
		}, (err, res) => {
			// TODO: error notification
		})
	}
	render() {
		const {teaminfo, teamlist} = this.props;
		var ranking = teamlist.map((team, index) => {
			return (
							<tr className={teaminfo.id == team.id ? 'active' : ''} key={team.id}>
								<td>{index + 1}</td>
								<td>{team.name}</td>
								<td>{team.points}</td>
							</tr>
				   );
		});
		return (
				<div className="ui container">
					<div>Last updated: <span>{this.state.updated}</span></div>
					<table className="ui striped very compact table">
						<thead>
							<tr>
								<th className="two wide">Rank</th>
								<th className="twelve wide">Team</th>
								<th className="two wide">Points</th>
							</tr>
						</thead>
						<tbody>
							{ranking}
						</tbody>
					</table>
					<div className="ui divider">
					</div>
				</div>
			   );
	}
};

export default connect(
		(state) => ({
			teaminfo: state.teamInfo,
			teamlist: state.teamList
		}),
		(dispatch) => ({updateTeamlist: (data) => dispatch({type: UPDATE_TEAMLIST, data: data})})
		)(Ranking);
