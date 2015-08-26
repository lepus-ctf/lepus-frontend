import React from 'react';
import Router from 'react-router';
import Api from './api'
import {connect} from 'react-redux';
import {UPDATE_PROBLEMS} from './store'
global.React = React;
var md2react = require('md2react');
var remote = require('remote');
var dialog = remote.require('dialog');
var fs = remote.require('fs');
var Link = Router.Link;

class Problem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			flagText: "",
			downloading: {},
			pending: false,
			error: false,
			correct: false
		};
	}
	componentWillMount() {
		// Tap tap API server
		Api.problems((json) => {
			this.props.updateProblems(json);
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
		dialog.showSaveDialog({ defaultPath: filename}, (savepath) => {
			if (savepath === undefined) {
				console.log("File saving canceld");
				return;
			}
			var downloadState = this.state.downloading;
			downloadState[filename] = true;
			this.setState({downloading: downloadState});
			Api.downloadFile(filepath, (blob) => {
				var downloadState = this.state.downloading;
				delete downloadState[filename];
				this.setState({downloading: downloadState});
				fs.writeFile(savepath, blob, (err) => {
					if (err) {
						// TODO: Show error notification
						console.error("File saving error");
					} else {
						console.log("File saving done");
					}
				});
			}.bind(this), () => {
				// TODO: Show error notification
				console.error("File download error");
				var downloadState = this.state.downloading;
				delete downloadState[filename];
				this.setState({downloading: downloadState});
			}.bind(this));
		}.bind(this));
	}
	render() {
		const {teaminfo, problems} = this.props;
		var problem;
		problems.forEach((id, current) => {
			if (id == current.id) {
				problem = current;
			}
		}.bind(this, this.props.params.id));
		if (!problem) return (<div>Can't find a problem.</div>);
		var problem_status = {};
		teaminfo.questions.forEach((t_state) => {
			if (problem.id == t_state.id) {
				problem_status = t_state;
			}
		}.bind(this))
		var progress = Math.round(~~problem_status.points / problem["points"] * 100);
		var progressStyle = {
			width: progress + "%"
		};
		var attachments = problem["files"].map((file) => {
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
						<Link className="section" to="problems">Problems</Link>
						<i className="right angle icon divider"></i>
						<span className="active section">{problem["title"]}</span>
					</div>
					<div className="ui items">
						<div className="item">
							<div className="content">
								<a className="header">{problem["title"]}</a>
								<div className="meta">
									<span>{problem["points"]} points</span>
								</div>
								<div className="description">
											<div className="ui raised segment">
												<span className="ui top left attached label">{problem["category"]["name"]}</span>
												{md2react(problem["sentence"], {gfm: true, tables: true})}
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
							<div className="label">You got {~~problem_status.points} points of {problem["points"]} points</div>
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

export default connect(
		(state) => ({
			teaminfo: state.teamInfo,
			problems: state.problems
		}),
		(dispatch) => ({updateProblems: (data) => dispatch({type: UPDATE_PROBLEMS, data: data})})
		)(Problem);
