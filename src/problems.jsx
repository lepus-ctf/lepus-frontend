import React from 'react';

export class Problems extends React.Component {
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		document.body.style.backgroundColor = "#cccccc";
	}
	componentWillUnmount() {
		document.body.style.backgroundColor = null;
	}
	render() {
		var fullHeight = {
			height: "100%",
			paddingRight: "200px",
			paddingTop: "20px"
		};
		// TODO: AJAX
		// WARN: Dummy data
		var problems = [
		{title: "Hakoniwa XSS season 2", genre: "Web", level: 3, point: 300},
		{title: "Non-Non Biyori repeat", genre: "Network", level: 2, point: 100},
		{title: "Yuru yuri nachuyasumi", genre: "Misc", level: 5, point: 500},
		{title: "Charlotte", genre: "Binary", level: 2, point: 200},
		{title: "Dande raionn", genre: "Crypto", level: 5, point: 300},
		{title: "Honny come!", genre: "Pwn", level: 4, point: 20},
		{title: "Working!!!", genre: "Web", level: 3, point: 100},
		{title: "Etotama", genre: "Misc", level: 1, point: 100},
		{title: "Sorega seiyu", genre: "Binary", level: 4, point: 200},
		]
		var cards = problems.map(function(problem) {
			var difficulty = [];
			for (var i=0; i < problem["level"]; ++i)
				difficulty.push(<i className="lightning icon"></i>);
			return (
				<div className="ui card">
					<div className="content">
						<Link className="header" to="ranking">{problem["title"]}</Link>
						<div className="meta">{problem["genre"]}</div>
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
				<div className="ui container" style={fullHeight}>
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
