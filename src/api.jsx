export class Api {
	constructor() {
		this.superagent = require('superagent');
		this.agent = require('superagent').agent();
		this.serverUrl = "https://score.sakura.tductf.org";
		this.apiEndpoint = this.serverUrl + "/api"
		this.token = "";

		var https = require('https');
		var _addRequest = https.Agent.prototype.addRequest;
		var self = this;
		https.Agent.prototype.addRequest = function() {
			var args = arguments;
			var cookies = self.agent.jar.getCookies(args[0]).map((cookie) => cookie.toValueString()).join('; ');;
			var old = args[0]._headers.cookie;
			args[0]._headers.cookie = cookies + (old ? '; ' + old : '');
			args[0]._headerNames['cookie'] = 'Cookie';
			return _addRequest.apply(this, args);
		};
	}
	login(username, password, success, failure) {
		this.superagent
			.post(this.apiEndpoint + '/auth.json')
			.send({username: username, password: password})
			.end((err, res) => {
				if (err || username != res.body.username) {
					res = res && res.text ? JSON.parse(res.text) : {message: err.toString()};
					console.error(err);
					console.error(res.message);
					console.error("Login failed.");
					failure(err, res);
				} else {
					this.agent.saveCookies(res);
					this.token = this.agent.jar.getCookie("csrftoken", res.req).value;
					success(res.body);
				}
			});
	}

	signup(username, password, success, failure) {
		this.superagent
			.post(this.apiEndpoint + '/users.json')
			.send({username: username, password: password, team_name: username, team_password: password})
			.end((err, res) => {
				if (err) {
					res = res && res.text ? JSON.parse(res.text) : {message: err.toString()};
					console.error(err);
					console.error(res.message);
					console.error("Sign-up failed.");
					failure(err, res);
				} else {
					success();
				}
			});
	}

	problems(success, failure) {
		this.superagent
			.get(this.apiEndpoint + '/questions.json')
			.query({include: '1'})
			.end((err, res) => {
				if (err) {
					res = res && res.text ? JSON.parse(res.text) : {message: err.toString()};
					console.error(err);
					failure(err, res);
				} else {
					this.agent.saveCookies(res);
					success(res.body);
				}
			});
	}

	problem(id, success, failure) {
		this.superagent
			.get(this.apiEndpoint + '/questions/' + id + '.json')
			.query({include: '1'})
			.end((err, res) => {
				if (err) {
					res = res && res.text ? JSON.parse(res.text) : {message: err.toString()};
					console.error(err);
					failure(err, res);
				} else {
					this.agent.saveCookies(res);
					success(res.body);
				}
			});
	}

	announcements(success, failure) {
		this.superagent
			.get(this.apiEndpoint + '/notices.json')
			.end((err, res) => {
				if (err) {
					res = res && res.text ? JSON.parse(res.text) : {message: err.toString()};
					console.error(err);
					failure(err, res);
				} else {
					this.agent.saveCookies(res);
					success(res.body);
				}
			});
	}

	submitFlag(id, flag, success, failure) {
		this.superagent
			.post(this.apiEndpoint + '/answers.json')
			.set('X-CSRFToken', this.token)
			.send({question: id, answer: flag})
			.end((err, res) => {
				if (err) {
					res = res && res.text ? JSON.parse(res.text) : {message: err.toString()};
					console.error(err);
					failure(err, res);
				} else if (res.body.is_correct) {
					this.agent.saveCookies(res);
					success();
				} else {
					console.error(err);
					console.error(res);
					failure(err, res);
				}
			});
	}

	teamlist(success, failure) {
		this.superagent
			.get(this.apiEndpoint + '/teams.json')
			.set('X-CSRFToken', this.token)
			.end((err, res) => {
				if (err) {
					res = res && res.text ? JSON.parse(res.text) : {message: err.toString()};
					console.error(err);
					failure(err, res);
				} else {
					success(res.body);
				}
			});
	}

	team(id, success, failure) {
		this.superagent
			.get(this.apiEndpoint + '/teams/' + id + '.json')
			.set('X-CSRFToken', this.token)
			.end((err, res) => {
				if (err) {
					res = res && res.text ? JSON.parse(res.text) : {message: err.toString()};
					console.error(err);
					failure(err, res);
				} else {
					success(res.body);
				}
			});
	}

	downloadFile(filepath, success, failure) {
		this.superagent
			.get(this.serverUrl + filepath)
			.end((err, res) => {
				if (err) {
					res = res && res.text ? JSON.parse(res.text) : {message: err.toString()};
					console.error(err);
					failure(err, res);
				} else {
					this.agent.saveCookies(res);
					success(res.body);
				}
			});
	}

};
export default new Api();
