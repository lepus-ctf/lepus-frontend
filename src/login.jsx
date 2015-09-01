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
			message: "",
			success: false
		};
	}
	componentWillMount() {
		document.body.style.backgroundColor = "black";
		if (this.props && this.props.query && this.props.query.message) {
			this.setState({
				error: true,
				message: this.props.query.message
			});
		}
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
			this.context.router.transitionTo("dashboard");
		}, (mes) => {
			this.setState({
				login_pending: false,
				error: true,
				message: mes[0]
			});
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
		}, (mes) => {
			this.setState({
				signup_pending: false,
				error: true,
				message: mes[0]
			});
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
						<img src="res/banner.png" alt="Lepus-CTF Bunner" className="ui image" style={size400} />
						<h2 className="ui teal header">
							<div className="content">
								Welcome to Lepus-CTF
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
							<div className="ui error message"><p>{this.state.message}</p></div>
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
