export class Api {
	constructor() {
		this.agent = require('superagent').agent();
		this.apiEndpoint = "http://score.sakura.tductf.org/api/";
	}
	login(username, password, success, failure) {
		this.agent
			.post(this.apiEndpoint + 'auth.json')
			.send({username: username, password: password})
			.end((err, res) => {
				if (err) {
					console.error(err);
					console.error((res && res.body) ? res.body.detail : res);
					failure(err, res);
				} else if (username == res.body.username) {
					this.agent.saveCookies(res);
					success();
				}
			});
	}

	problems(success, failure) {
		this.agent
			.get(this.apiEndpoint + 'questions.json')
			.end((err, res) => {
				if (err) {
					console.error(err);
					console.error((res && res.body) ? res.body.detail : res);
					failure(err, res);
				} else {
					this.agent.saveCookies(res);
					success(res.body);
				}
			});
	}
};
export default new Api();
