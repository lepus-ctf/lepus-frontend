import React from 'react';
import Router from 'react-router';
import Api from './api'
global.React = React;
var md2react = require('md2react');
var remote = require('remote');
var dialog = remote.require('dialog');
var fs = remote.require('fs');
var Link = Router.Link;

export class Problem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			problem: {},
			flagText: "",
			downloading: {},
			pending: false,
			error: false,
			correct: false
		};
	}
	componentWillMount() {
		// Tap tap API server
		Api.problem(this.props.params.id, (json) => {
			this.setState({
				problem: json
			});
			console.log(json);

		}, (err, res) => {
			// TODO: error notification
		})
	}
	changeText(e) {
		var value = {}
		value[e.target.name] = e.target.value;
		this.setState(value);
	}
	submitFlag() {
		this.setState({
			pending: true,
			error: false
		});

		var own = this;
		console.log(this.state.flagText);
		Api.submitFlag(this.props.params.id, this.state.flagText, () => {
			this.setState({
				correct: true
			});
			React.render(<div><div className="header">Congratulations</div><p>{this.state.flagText} is correct!!</p></div>, document.querySelector('.ui.success.message'));
		}, (err, res) => {
			own.setState({
				pending: false,
				error: true
			});
			React.render(<div><div className="header">Failed</div><p>{res.message}</p></div>, document.querySelector('.ui.error.message'));
		})
		return false;
	}
	saveFile(filename, filepath) {
		if (this.state.downloading[filename]) {
			return;
		}
		console.log("File saving");
		dialog.showSaveDialog({ defaultPath: filename}, function(savepath) {
			if (savepath === undefined) {
				console.log("File saving canceld");
				return;
			}
			var downloadState = this.state.downloading;
			downloadState[filename] = true;
			this.setState({downloading: downloadState});
			Api.downloadFile(filepath, function(blob) {
				var downloadState = this.state.downloading;
				delete downloadState[filename];
				this.setState({downloading: downloadState});
				fs.writeFile(savepath, blob, function (err) {
					if (err) {
						// TODO: Show error notification
						console.error("File saving error");
					} else {
						console.log("File saving done");
					}
				});
			}.bind(this), function() {
				// TODO: Show error notification
				console.error("File download error");
				var downloadState = this.state.downloading;
				delete downloadState[filename];
				this.setState({downloading: downloadState});
			}.bind(this));
		}.bind(this));
	}
	render() {
		if (!this.state.problem.title) return (<div></div>);
		var team_status = this.props.query.team_status;
		var current_problem_status = {};
		team_status.forEach((t_state) => {
			if (this.state.problem.id == t_state.id) {
				current_problem_status = t_state;
			}
		}.bind(this))
		var progress = Math.round(~~current_problem_status.points / this.state.problem["points"] * 100);
		var progressStyle = {
			width: progress + "%"
		};
		var attachments = this.state.problem["files"].map(function(file) {
			return (
					<button className={'ui labeled orange icon button' + (this.state.downloading[file["name"]] ? ' loading' : '')} onClick={this.saveFile.bind(this, file["name"], file["url"])} key={file["url"]}>
					<i className="file archive outline icon"></i>
					{file["name"]}
					</button>
				   );
		}.bind(this));
		return (
				<div className="ui container">
					<div className="ui breadcrumb">
						<Link className="section" to="problems" query={{team_status: team_status}}>Problems</Link>
						<i className="right angle icon divider"></i>
						<span className="active section">{this.state.problem["title"]}</span>
					</div>
					<div className="ui items">
						<div className="item">
							<div className="content">
								<a className="header">{this.state.problem["title"]}</a>
								<div className="meta">
									<span>{this.state.problem["points"]} points</span>
								</div>
								<div className="description">
											<div className="ui raised segment">
												<span className="ui top left attached label">{this.state.problem["category"]["name"]}</span>
												{md2react(this.state.problem["sentence"], {gfm: true, tables: true})}
											</div>
								</div>
								<div className="extra">
								{attachments}
								</div>
							</div>
						</div>
					</div>
					<form className={'ui form' + (this.state.error ? ' error' : (this.state.correct ? ' success' : ''))} onSubmit={this.submitFlag.bind(this)}>
						<div className="ui indicating progress active" data-percent="0">
							<div className="bar" style={progressStyle} ></div>
							<div className="label">You got {~~current_problem_status.points} points of {this.state.problem["points"]} points</div>
						</div>
						<div className="ui right action left icon input">
							<i className="flag icon"></i>
							<input type="text" placeholder="Enter the flag" name="flagText" onChange={this.changeText.bind(this)} value={this.state.flagText} />
							<div className="ui primary button" onClick={this.submitFlag.bind(this)}>Submit</div>
						</div>
						<div className="ui error message"></div>
						<div className="ui success message"></div>
					</form>
					<div className="ui divider">
					</div>
				</div>
			   );
	}
};
