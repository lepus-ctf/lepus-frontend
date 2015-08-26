import React from 'react';
import Api from './api'
import {connect} from 'react-redux';
import {UPDATE_TEAMINFO, UPDATE_SERVEREVENT, UPDATE_CTFCONF, UPDATE_COUNTDOWN} from './store'
import Router from 'react-router';
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {url: "", breakingnews: true, playOnce: false};
		this.watchServerEvent();
		this.getCTFConfigurations();
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
	getCTFConfigurations() {
		Api.configurations((json) => {
			this.props.updateCTFConfigurations(json);
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
			switch (data.type) {
				case "update":
					this.props.onReceiveServerEvent(data);
					break;
				case "answer":
					if (data.team === this.props.userinfo.team) {
						this.updateTeaminfo();
					}
					break;
				case "youtube":
					this.setState({url: "http://www.youtube.com/embed/" + data["video_id"] + "?autoplay=1"});
					if (!this.state.breakingnews) {
						var n = new Notification('TDUCTF 2015', {
							body: 'Breaking news!'
						});
						n.onclick = () => {
							this.setState({playOnce: true});
						};
					}
					break;
				default:
					console.log(JSON.stringify(data));
			}
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
		setInterval(() => {
			if (!!this.props.start && !!this.props.end) {
				const now = new Date();
				const diff = new Date(this.props.end - now);
				const h = Math.round(diff.getTime() / 1000 / 3600);
				const time = diff.toUTCString().replace(/^.*\d\d:(\d\d:\d\d).*$/,'$1');
				const m = time.replace(/^(\d\d):\d\d$/,'$1');
				const s = time.replace(/^\d\d:(\d\d)$/,'$1');
				this.props.updateCountdown(h, m, s);
			}
		}.bind(this), 1000);
	}
	componentWillUnmount() {
		document.body.style.backgroundColor = null;
	}
	unsetBreakingnews() {
		this.setState({url: null, breakingnews: false})
	}
	closeBreakingnewsModal() {
		this.setState({url: null, playOnce: false})
	}
	render() {
		var mainStyle = {
			height: "100%",
			padding: "20px",
			paddingLeft: "220px",
		};
		var maxSize = {
			height: "100%",
			width: "100%",
		};
		var centeredModal = {
			height: "70%",
			marginTop: "-20%",
		}
		const {point, solved, events, countdown} = this.props;
		var modal;
		if (this.state.url && (this.state.breakingnews || this.state.playOnce)) {
			modal = (
					<div className="ui dimmer modals page transition visible active">
						<div className="ui small basic test modal transition visible active" style={centeredModal}>
							<i className="icon close" onClick={this.closeBreakingnewsModal.bind(this)}></i>
							<iframe src={this.state.url} frameBorder="0" style={maxSize}/>
							<div className="ui container">
								<div className="ui checkbox" onClick={this.unsetBreakingnews.bind(this)}>
									<div className="ui grey tiny header">I'll not watch BREAKING NEWS any more.</div>
								</div>
							</div>
						</div>
					</div>
					);
		}
		var count = "Countdown";
		if (countdown.h) {
			count = countdown.h + ':' + countdown.m + ':' + countdown.s;
		}
		return (
				<div className="ui" style={mainStyle}>
					<RouteHandler routerState={this.props.routerState} />
					<div className="ui left fixed vertical menu inverted">
						<div className="header item">
							<h1 className="header ui center aligned teal">TDUCTF</h1>
						</div>
						<div className="header item">
							<h2 className="header ui center aligned inverted">
							{count}
							</h2>
						</div>
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
					{modal}
				</div>
			   );
	}
};

export default connect(
		(state) => ({
			userinfo: state.userInfo,
			point: state.point,
			solved: state.solved,
			events: state.events,
			start: state.config.start,
			end: state.config.end,
			countdown: state.countdown
		}),
		(dispatch) => ({
			updateTeaminfo: (data) => dispatch({type: UPDATE_TEAMINFO, data: data}),
			onReceiveServerEvent: (data) => dispatch({type: UPDATE_SERVEREVENT, data: data}),
			updateCTFConfigurations: (data) => dispatch({type: UPDATE_CTFCONF, data: data}),
			updateCountdown: (h, m, s) => dispatch({type: UPDATE_COUNTDOWN, data: {h, m, s}}),
		})
		)(Main);
