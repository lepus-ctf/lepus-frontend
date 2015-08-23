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
				if (err || username != res.body.username) {
					res = res && res.text ? JSON.parse(res.text) : {message: err.toString()};
					console.error(err);
					console.error(res.message);
					console.error("Login failed.");
					failure(err, res);
				} else {
					this.token = res.req.res.headers['set-cookie'].toString().match(/csrftoken=(.*?)(?:$|;)/)[1];
					this.agent.saveCookies(res);
					success(res.body);
				}
			});
	}

	problems(success, failure) {
		this.agent
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
		this.agent
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
		this.agent
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
		console.log(flag)
		this.agent
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
					console.error(err);
					console.error((res && res.body) ? res.body.answer : res);
					failure(err, res);
				} else {
					console.error(err);
					console.error(res);
					failure(err, res);
				}
			});
	}

	teamlist(success, failure) {
		this.agent
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

	downloadFile(filepath, success, failure) {
		this.agent
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
