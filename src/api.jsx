export class Api {
	constructor() {
		this.agent = require('superagent').agent();
		this.serverUrl = "https://score.sakura.tductf.org";
		this.apiEndpoint = this.serverUrl + "/api"
		this.token = "";
	}
	login(username, password, success, failure) {
		this.agent
			.post(this.apiEndpoint + '/auth.json')
			.send({username: username, password: password})
			.end((err, res) => {
				if (err) {
					console.error(err);
					console.error((res && res.body) ? res.body.detail : res);
					failure(err, res);
				} else if (username == res.body.username) {
					this.token = res.req.res.headers['set-cookie'].toString().match(/csrftoken=(.*?)(?:$|;)/)[1];
					this.agent.saveCookies(res);
					success();
				}
			});
	}

	problems(success, failure) {
		this.agent
			.get(this.apiEndpoint + '/questions.json')
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

	problem(id, success, failure) {
		this.agent
			.get(this.apiEndpoint + '/questions/' + id + '.json')
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

	submitFlag(id, flag, success, failure) {
		console.log(flag)
		this.agent
			.post(this.apiEndpoint + '/answer.json')
			.set('X-CSRFToken', this.token)
			.send({question: id, answer: flag})
			.end((err, res) => {
				if (res.body.is_correct) {
					this.agent.saveCookies(res);
					success();
				} else if (err) {
					console.error(err);
					console.error((res && res.body) ? res.body.answer : res);
					failure(err, res);
				} else {
					res.body.answer = "Incorrect.";
					failure(err, res);
				}
			});
	}

	downloadFile(filepath, success, failure) {
		this.agent
			.get(this.serverUrl + filepath)
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
