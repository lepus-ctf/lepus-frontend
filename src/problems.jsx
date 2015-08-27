import React from 'react';
import Api from './api'
import {connect} from 'react-redux';
import {UPDATE_PROBLEMS, RESET_EVENTS, SET_VISIBLE_CATEGORY, SET_HIDDEN_SOLVED} from './store'

class Problems extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchBoxFocused: false,
			error: null
		};
	}
	componentWillMount() {
		// Tap tap API server
		Api.problems((json) => {
			this.props.updateProblems(json);
		}, (err, res) => {
			this.setState({
				error: mes
			});
		})
		this.props.resetEvents();
	}
	toggleSolvedVisibleState(e) {
		this.props.hideSolved(e.target.checked);
	}
	onSearchBoxFocus(e) {
		this.setState({
			searchBoxFocused: true
		})
	}
	onCategoryClick(e) {
		this.props.setVisibleCategory(e.target.getAttribute("data-id"));
		this.setState({
			searchBoxFocused: false
		})

	}
	clearCatrgory() {
		this.props.setVisibleCategory(-1);
		this.setState({
			searchBoxFocused: false
		})
	}
	clearError() {
		this.setState({
			error: null
		});
	}
	render() {
		const colors = ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "gray"];
		const {teaminfo, solvedTeams, problems, hiddenSolved, visibleCategory} = this.props;
		var problem_status = {};
		if (teaminfo.questions) {
			teaminfo.questions.forEach((problem) => {
				problem_status[problem.id] = problem;
			})
		}
		var categories = {};
		var cards = problems.map((problem) => {
			var difficulty = [];
			for (var i = 0; i < problem["points"]; i+=100)
				difficulty.push(<i className="lightning icon" key={i}></i>);

			categories[problem["category"]["name"]] = problem["category"]["id"];
			if (visibleCategory >= 0 && visibleCategory != problem["category"]["id"]) {
				return
			}
			var solved;
			if (problem_status[problem["id"]]) {
				if (problem_status[problem["id"]].points == problem["points"]) {
					if (hiddenSolved) {
						return;
					}
					solved = <div><i className="large green checkmark icon"></i>Solved</div>
				} else {
					solved = <div>{Math.round(problem_status[problem["id"]].points / problem["points"] * 100)}% Solved</div>
				}
			}
			return (
				<div className={"ui card " + (colors[problem["category"]["id"]] || "black")} key={problem["id"]}>
					<div className="content">
						<Link className="header" to="problem" params={{id: problem["id"]}}>{problem["title"]}</Link>
						<div className="meta">{problem["category"]["name"]}</div>
						<div className="ui mini horizontal statistic">
							<div className="value">
								{problem["points"]}
							</div>
							<div className="label">
								Points
							</div>
						</div>
						{solved}
					</div>
				    <div className="content extra">
						Difficulty:
							{difficulty}
					</div>
				    <div className="content extra">
						<i className="users icon"></i>
						{~~solvedTeams[problem.id]} teams solved
					</div>
					<div className="ui bottom attached rogress" data-percent="60">
						<div className="bar"></div>
					</div>
				</div>
				);
		})
		var categoryName = "";
		var categoryList = [
					<div className="result" key="-1" data-id="-1" onClick={this.onCategoryClick.bind(this)}>
						<div className="content" data-id="-1">
							<div className="title" data-id="-1">All</div>
						</div>
					</div>
			];
		for (var key in categories) {
			categoryList.push(
					<div className="result" key={categories[key]} data-id={categories[key]} onClick={this.onCategoryClick.bind(this)}>
						<div className="content" data-id={categories[key]}>
							<div className="title" data-id={categories[key]}>{key}</div>
						</div>
					</div>
					);
			if (visibleCategory == categories[key]) {
				categoryName = "Category: " + key;
			}
		}
		var errorMessage;
		if (this.state.error) {
			errorMessage = (
					<div className="ui floating negative message">
						<i className="close icon" onClick={this.clearError.bind(this)}></i>
							<div className="header">
								Error
							</div>
						<p>{this.state.error[0]}</p>
					</div>
					);
		}
		return (
				<div className="ui container">
					<div className="ui breadcrumb">
						<span className="active section">Problems</span>
					</div>
					<div className="ui text menu">
						<div className="ui item">
							<div className="ui toggle checkbox">
								<input type="checkbox" name="hide_solved" onChange={this.toggleSolvedVisibleState.bind(this)} checked={hiddenSolved}/>
								<label>Hide solved problems</label>
							</div>
						</div>
						<div className="ui right aligned category search item">
							<div className="ui transparent icon input">
								<input className="prompt" type="text" placeholder="Search problems..." onFocus={this.onSearchBoxFocus.bind(this)} value={categoryName}/>
								<i className={!categoryName ? "search link icon" : "close icon link"} onClick={this.clearCatrgory.bind(this)}></i>
							</div>
							<div className="results"></div>
							<div className={"results transition" + (this.state.searchBoxFocused ? " visible" : "")} >
								<div className="category">
									<div className="name">Category</div>
									{categoryList}
								</div>
							</div>
						</div>
					</div>
					<div className="ui three cards">
						{cards}
					</div>
					<div className="ui divider">
					</div>
					{errorMessage}
				</div>
			   );
	}
};

export default connect(
		(state) => ({
			teaminfo: state.teamInfo,
			solvedTeams: state.solvedTeams,
			problems: state.problems,
			visibleCategory: state.visibleCategory,
			hiddenSolved: state.hiddenSolved
		}),
		(dispatch) => ({
			updateProblems: (data) => dispatch({type: UPDATE_PROBLEMS, data: data}),
			resetEvents: () => dispatch({type: RESET_EVENTS, data: "problems"}),
			setVisibleCategory: (data) => dispatch({type: SET_VISIBLE_CATEGORY, data: data}),
			hideSolved: (data) => dispatch({type: SET_HIDDEN_SOLVED, data: data}),
		})
		)(Problems);
