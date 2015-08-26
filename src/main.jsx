import React from 'react';
import Api from './api'
import {connect} from 'react-redux';
import {UPDATE_TEAMINFO} from './store'
import Router from 'react-router';
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			update: {
				problem: 0,
				announcement: 0
			}
		};
		this.updateTeaminfo();
	}
	static willTransitionTo(transition) {
		//TODO: check logon status
		var logon = true;
		if (!logon){
			transition.redirect('/login');
		}
	}
	updateTeaminfo() {
		Api.team(this.props.userinfo.team, (json) => {
			this.props.updateTeaminfo(json);
		}, (err, res) => {
		})
	}
	componentWillMount() {
		document.body.style.backgroundColor = "#1abc9c";
	}
	componentWillUnmount() {
		document.body.style.backgroundColor = null;
	}
	render() {
		var mainStyle = {
			height: "100%",
			padding: "20px",
			paddingLeft: "220px",
		};
		const {point, solved} = this.props;
		return (
				<div className="ui" style={mainStyle}>
					<RouteHandler routerState={this.props.routerState} />
					<div className="ui left fixed vertical menu inverted">
						<h1 className="header item">TDUCTF</h1>
						<div className="item">
							<div className="ui statistics mini horizontal inverted">
								<div className="statistic">
									<div className="value">
										{point}
									</div>
									<div className="label">
										Points
									</div>
								</div>
								<div className="statistic">
									<div className="value">
										{solved}
									</div>
									<div className="label">
										Solved
									</div>
								</div>
							</div>
						</div>
						<Link className="item" to="dashboard">Dashboard</Link>
						<Link className="item" to="problems">
							{this.state.update.problem > 0 ? <div className="ui small teal label">{this.state.update.problem}</div> : "" }
							Problems
						</Link>
						<Link className="item" to="ranking">
							Ranking
						</Link>
						<Link className="item" to="announcements">
							{this.state.update.announcement > 0 ? <div className="ui small red label">{this.state.update.announcement}</div> : "" }
							Announcements
						</Link>
					</div>
				</div>
			   );
	}
};

export default connect(
		(state) => ({
			userinfo: state.userInfo,
			point: state.point,
			solved: state.solved
		}),
		(dispatch) => ({updateTeaminfo: (data) => dispatch({type: UPDATE_TEAMINFO, data: data})})
		)(Main);
