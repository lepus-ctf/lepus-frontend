import React from 'react';
import Api from './api'

export class Problems extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			problems: []
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
	render() {
		var cards = this.state.problems.map(function(problem) {
			var difficulty = [];
			// temporary commented out
			//for (var i=0; i < problem["level"]; ++i)
				difficulty.push(<i className="lightning icon"></i>);
			return (
				<div className="ui card">
					<div className="content">
						<Link className="header" to="problem" params={{id: problem["id"]}}>{problem["title"]}</Link>
						<div className="meta">{problem["category"]["name"]}</div>
						<div className="ui mini horizontal statistic">
							<div className="value">
								{problem["point"]}
							</div>
							<div className="label">
								Points
							</div>
						</div>
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
								<input type="checkbox" name="public" />
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
				</div>
			   );
	}
};
