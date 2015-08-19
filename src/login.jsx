import React from 'react';

export class Login extends React.Component {
	componentWillMount() {
		document.body.style.backgroundColor = "black";
	}
	componentWillUnmount() {
		document.body.style.backgroundColor = null;
	}
	tryLogin() {
		// AJAX
		// Transition
		return true
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
						<form className="ui large form">
							<div className="ui">
								<div className="field">
									<div className="ui left icon input">
										<i className="user icon"></i>
										<input type="text" name="user" placeholder="User name" />
									</div>
								</div>
								<div className="field">
									<div className="ui left icon input">
										<i className="lock icon"></i>
										<input type="password" name="password" placeholder="Password" />
									</div>
								</div>
								<div className="ui buttons">
								<button className="ui positive button" onClick={this.tryLogin}>Login</button>
								<div className="or"></div>
								<button className="ui button" onClick={this.signUp}>Sign up</button>
								</div>
							</div>
							<div className="ui error message"></div>
						</form>
					</div>
				</div>
			   );
	}
};
