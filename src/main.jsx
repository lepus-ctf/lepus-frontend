import React from 'react';
import Api from './api'
import {connect} from 'react-redux';
import {UPDATE_TEAMINFO, UPDATE_SERVEREVENT} from './store'
import Router from 'react-router';
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.updateTeaminfo();
		this.watchServerEvent();
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
	watchServerEvent() {
		var socket = require('socket.io-client');
		var io = socket('https://score.sakura.tductf.org/', {
				secure: true,
				transports: ["websocket"]
				});
		io.on('connect', () => {
			console.log("Socket.io connected!")
		});
		io.on('event', (data) => {
			this.props.onReceiveServerEvent(data);
			this.setState({
				render: new Date()
			});
		}.bind(this));
		io.on('disconnect', () => {
			console.warn("Socket.io disconnected.");
		});
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
		const {point, solved, events} = this.props;
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
							{events.problems > 0 ? <div className="ui small teal label">{events.problems}</div> : "" }
							Problems
						</Link>
						<Link className="item" to="ranking">
							Ranking
						</Link>
						<Link className="item" to="announcements">
							{events.announcements > 0 ? <div className="ui small red label">{events.announcements}</div> : "" }
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
			solved: state.solved,
			events: state.events
		}),
		(dispatch) => ({
			updateTeaminfo: (data) => dispatch({type: UPDATE_TEAMINFO, data: data}),
			onReceiveServerEvent: (data) => dispatch({type: UPDATE_SERVEREVENT, data: data}),
		})
		)(Main);
