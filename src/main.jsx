import React from 'react';
import Router from 'react-router';
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

export class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			point: 0,
			solved: 0,
			problem: {
				update: 0
			}
		};
	}
	render() {
		var fullHeight = {
			height: "100%"
		};
		return (
				<div className="ui " style={fullHeight}>
					<RouteHandler/>
					<div className="ui right fixed vertical menu inverted">
						<div className="item">
							<img className="ui mini image" alt="user icon" src="" />
							<div className="ui statistics mini horizontal inverted">
								<div className="statistic">
									<div className="value">
										{this.state.point}
									</div>
									<div className="label">
										Points
									</div>
								</div>
								<div className="statistic">
									<div className="value">
										{this.state.solved}
									</div>
									<div className="label">
										Solved
									</div>
								</div>
							</div>
						</div>
						<Link className="item" to="dashboard">Dashboard</Link>
						<Link className="item" to="problems">
							{this.state.problem.update > 0 ? <div className="ui small teal label">{this.state.problem.update}</div> : "" }
							Problems
						</Link>
					</div>
				</div>
			   );
	}
};
