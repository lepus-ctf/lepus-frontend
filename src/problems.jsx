import React from 'react';
import Api from './api'

export class Problems extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			problems: [],
			hide_solved: false
		};
	}
	componentWillMount() {
		// Tap tap API server
		Api.problems((json) => {
			this.setState({
				problems: json
			});
		}, (err, res) => {
			// TODO: error notification
		})
	}
	toggleSolvedVisibleState(e) {
		this.setState({
			hide_solved: e.target.checked
		})
		console.log('Toggle hide solved');
		console.log(e.target.checked);
	}
	render() {
		var hide_solved = this.state.hide_solved;
		var team_status = this.props.query.team_status;
		var problem_status = {};
		team_status.forEach((problem) => {
			problem_status[problem.id] = problem;
		})
		var cards = this.state.problems.map(function(problem) {
			var difficulty = [];
			for (var i = 0; i < problem["points"]; i+=100)
				difficulty.push(<i className="lightning icon" key={i}></i>);

			var solved;
			if (problem_status[problem["id"]]) {
				if (problem_status[problem["id"]].points == problem["points"]) {
					if (hide_solved) {
						return;
					}
					solved = <div><i className="large green checkmark icon"></i>Solved</div>
				} else {
					solved = <div>{Math.round(problem_status[problem["id"]].points / problem["points"] * 100)}% Solved</div>
				}
			}
			return (
				<div className="ui card" key={problem["id"]}>
					<div className="content">
						<Link className="header" to="problem" params={{id: problem["id"]}} query={{team_status: team_status}}>{problem["title"]}</Link>
						<div className="meta">{problem["category"]["name"]}</div>
						<div className="ui mini horizontal statistic">
							<div className="value">
								{problem["points"]}
							</div>
							<div className="label">
								Points
							</div>
						</div>
						{solved}
					</div>
				    <div className="content extra">
						Difficulty:
							{difficulty}
					</div>
					<div className="ui bottom attached rogress" data-percent="60">
						<div className="bar"></div>
					</div>
				</div>
				);
		})
		return (
				<div className="ui container">
					<div className="ui text menu">
						<div className="ui item">
							<div className="ui toggle checkbox">
								<input type="checkbox" name="hide_solved" onChange={this.toggleSolvedVisibleState.bind(this)} />
								<label>Hide solved problems</label>
							</div>
						</div>
						<div className="ui right category search item">
							<div className="ui transparent icon input">
								<input className="prompt" type="text" placeholder="Search problems..." />
								<i className="search link icon"></i>
							</div>
							<div className="results"></div>
						</div>
					</div>
					<div className="ui three cards">
						{cards}
					</div>
					<div className="ui divider">
					</div>
				</div>
			   );
	}
};
