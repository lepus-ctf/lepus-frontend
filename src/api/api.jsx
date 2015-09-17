import ErrorHandler from './error-handler'
export class Api {
	constructor() {
		this.superagent = require('superagent');
		this.serverUrl = "";
		this.apiEndpoint = this.serverUrl + "/api"
		this.errorHandler = new ErrorHandler();
	}
	setCriticalAction(func) {
		this.errorHandler.criticalAction = func || (() => {});
	}
	login(username, password, success, failure) {
		if (document.cookie.match(/csrftoken=(.*?)(?:$|;)/)) {
			this.superagent
				.post(this.apiEndpoint + '/auth.json')
				.set('X-CSRFToken', document.cookie.match(/csrftoken=(.*?)(?:$|;)/)[1])
				.send({username: username, password: password})
				.end((err, res) => {
					if (err || username != res.body.username) {
						const error = this.errorHandler.parseError(err, res);
						failure(error);
					} else {
						success(res.body);
					}
				});
		} else {
			this.superagent
				.post(this.apiEndpoint + '/auth.json')
				.send({username: username, password: password})
				.end((err, res) => {
					if (err || username != res.body.username) {
						const error = this.errorHandler.parseError(err, res);
						failure(error);
					} else {
						success(res.body);
					}
				});
		}
	}

	signup(username, password, success, failure) {
		if (document.cookie.match(/csrftoken=(.*?)(?:$|;)/)) {
			this.superagent
				.post(this.apiEndpoint + '/users.json')
				.set('X-CSRFToken', document.cookie.match(/csrftoken=(.*?)(?:$|;)/)[1])
				.send({username: username, password: password, team_name: username, team_password: password})
				.end((err, res) => {
					if (err) {
						const error = this.errorHandler.parseError(err, res);
						failure(error);
					} else {
						success();
					}
				});
		} else {
			this.superagent
				.post(this.apiEndpoint + '/users.json')
				.send({username: username, password: password, team_name: username, team_password: password})
				.end((err, res) => {
					if (err) {
						const error = this.errorHandler.parseError(err, res);
						failure(error);
					} else {
						success();
					}
				});
		}
	}

	configurations(success, failure) {
		this.superagent
			.get(this.apiEndpoint + '/configurations.json')
			.end((err, res) => {
				if (err) {
					const error = this.errorHandler.parseError(err, res);
					failure(error);
				} else {
					success(res.body);
				}
			});
	}

	problems(success, failure) {
		this.superagent
			.get(this.apiEndpoint + '/questions.json')
			.query({include: '1'})
			.end((err, res) => {
				if (err) {
					const error = this.errorHandler.parseError(err, res);
					failure(error);
				} else {
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
					const error = this.errorHandler.parseError(err, res);
					failure(error);
				} else {
					success(res.body);
				}
			});
	}

	announcement(id, success, failure) {
		this.superagent
			.get(this.apiEndpoint + '/notices/' + id + '.json')
			.end((err, res) => {
				if (err) {
					const error = this.errorHandler.parseError(err, res);
					failure(error);
				} else {
					success(res.body);
				}
			});
	}

	announcements(success, failure) {
		this.superagent
			.get(this.apiEndpoint + '/notices.json')
			.end((err, res) => {
				if (err) {
					const error = this.errorHandler.parseError(err, res);
					failure(error);
				} else {
					success(res.body);
				}
			});
	}

	submitFlag(id, flag, success, failure) {
		if (document.cookie.match(/csrftoken=(.*?)(?:$|;)/)) {
			this.superagent
				.post(this.apiEndpoint + '/answers.json')
				.set('X-CSRFToken', document.cookie.match(/csrftoken=(.*?)(?:$|;)/)[1])
				.send({question: id, answer: flag})
				.end((err, res) => {
					if (err) {
						const error = this.errorHandler.parseError(err, res);
						failure(error);
					} else if (res.body.is_correct) {
						success();
					} else {
						console.error(err);
						console.error(res);
						failure(err, res);
					}
				});
		} else {
			this.superagent
				.post(this.apiEndpoint + '/answers.json')
				.send({question: id, answer: flag})
				.end((err, res) => {
					if (err) {
						const error = this.errorHandler.parseError(err, res);
						failure(error);
					} else if (res.body.is_correct) {
						success();
					} else {
						console.error(err);
						console.error(res);
						failure(err, res);
					}
				});
		}
	}

	teamlist(success, failure) {
		this.superagent
			.get(this.apiEndpoint + '/teams.json')
			.end((err, res) => {
				if (err) {
					const error = this.errorHandler.parseError(err, res);
					failure(error);
				} else {
					success(res.body);
				}
			});
	}

	team(id, success, failure) {
		this.superagent
			.get(this.apiEndpoint + '/teams/' + id + '.json')
			.end((err, res) => {
				if (err) {
					const error = this.errorHandler.parseError(err, res);
					failure(error);
				} else {
					success(res.body);
				}
			});
	}

};
export default new Api();
