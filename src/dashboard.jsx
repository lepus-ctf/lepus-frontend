import React from 'react';
import {connect} from 'react-redux';

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
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
				</div>
			   );
	}
};

export default connect(
		(state) => ({
		}),
		(dispatch) => ({})
		)(Dashboard);
