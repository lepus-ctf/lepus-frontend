import React from 'react';

export class Dashboard extends React.Component {
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
			paddingRight: "220px",
			paddingTop: "20px"
		};
		return (
				<div className="ui container" style={fullHeight}>
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
				</div>
			   );
	}
};
