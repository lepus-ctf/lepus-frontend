import React from 'react';
import Api from './api'
import {connect} from 'react-redux';
import {UPDATE_USERINFO} from './store'

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			login_pending: false,
			signup_pending: false,
			error: false,
			success: false
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
			login_pending: true,
			error: false,
			success: false
		});

		Api.login(this.state.username, this.state.password, (userinfo) => {
			this.props.saveUserinfo(userinfo);
			this.context.router.transitionTo("main");
		}, (err, res) => {
			this.setState({
				login_pending: false,
				error: true
			});
			React.render(<p>{res.message}</p>, document.querySelector('.ui.error.message'));
		})
	}
	signUp() {
		this.setState({
			signup_pending: true,
			error: false,
			success: false
		});

		Api.signup(this.state.username, this.state.password, (userinfo) => {
			this.setState({
				signup_pending: false,
				success: true
			});
			React.render(<div><div className="header">New account created</div><p>Press "Login" to start CTF!</p></div>, document.querySelector('.ui.success.message'));
		}, (err, res) => {
			this.setState({
				signup_pending: false,
				error: true
			});
			React.render(<p>{res.message}</p>, document.querySelector('.ui.error.message'));
		})
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
						<form className={'ui large form' + (this.state.error ? ' error' : '') + (this.state.success ? ' success' : '')}>
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
								<input type="button" className={'ui positive button' + (this.state.login_pending ? ' disabled' : '')} onClick={this.tryLogin.bind(this)} value="Login" />
								<div className="or"></div>
								<input type="button" className={'ui button' + (this.state.signup_pending ? ' disabled' : '')} onClick={this.signUp.bind(this)} value="Sign up" />
								</div>
								<div className={'ui inline centered loader' + (this.state.signup_pending || this.state.login_pending ? ' active' : ' disabled ')} ></div>
							</div>
							<div className="ui error message"></div>
							<div className="ui success message"></div>
						</form>
					</div>
				</div>
			   );
	}
};
Login.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default connect(
		(state) => ({}),
		(dispatch) => ({saveUserinfo: (data) => dispatch({type: UPDATE_USERINFO, data: data})})
		)(Login);
