import React from 'react';
var request = require('superagent');

export class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			pending: false,
			error: false
		};
	}
	componentWillMount() {
		document.body.style.backgroundColor = "black";
	}
	componentWillUnmount() {
		document.body.style.backgroundColor = null;
	}
	changeText(e) {
		var value = {}
		value[e.target.name] = e.target.value;
		this.setState(value);
	}
	tryLogin() {
		this.setState({
			pending: true,
			error: false
		});

		var own = this;
		request
			.post('http://score.sakura.tductf.org/api/auth.json')
			.send({username: this.state.username, password: this.state.password})
			.end((err, res) => {
				if (err) {
					console.error(err);
					console.error(res.body.detail);
					own.setState({
						pending: false,
						error: true
					});
					React.render(<p>{res.body.detail}</p>, document.querySelector('.ui.error.message'));
				} else if (own.state.username == res.body.username) {
					own.context.router.transitionTo("main");
				}
			});
	}
	signUp() {
		// AJAX
		// Transition
		return true
	}
	render() {
		var size400 = {
			maxWidth: "400px",
			maxHeight: "400px"
		};
		var fullHeight = {
			height: "100%"
		};
		return (
				<div className="ui center aligned grid" style={fullHeight}>
					<div className="column" style={size400}>
						<img src="res/banner.png" alt="TDUCTF 2015 Bunner" className="ui image" style={size400} />
						<h2 className="ui teal header">
							<div className="content">
								Welcome to TDUCTF 2015
							</div>
						</h2>
						<form className={'ui large form' + (this.state.error ? ' error' : '')}>
							<div className="ui">
								<div className="field">
									<div className="ui left icon input">
										<i className="user icon"></i>
										<input type="text" name="username" placeholder="Username" onChange={this.changeText.bind(this)} value={this.state.username} />
									</div>
								</div>
								<div className="field">
									<div className="ui left icon input">
										<i className="lock icon"></i>
										<input type="password" name="password" placeholder="Password" onChange={this.changeText.bind(this)} value={this.state.password} />
									</div>
								</div>
								<div className="ui buttons">
								<input type="button" className={'ui positive button' + (this.state.pending ? ' disabled' : '')} onClick={this.tryLogin.bind(this)} value="Login" />
								<div className="or"></div>
								<input type="button" className="ui button" onClick={this.signUp.bind(this)} value="Sign up" />
								</div>
								<div className={'ui inline centered loader' + (this.state.pending ? ' active' : ' disabled ')} ></div>
							</div>
							<div className="ui error message"></div>
						</form>
					</div>
				</div>
			   );
	}
};
Login.contextTypes = {
  router: React.PropTypes.func.isRequired
};
