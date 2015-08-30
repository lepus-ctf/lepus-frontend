import {createStore} from 'redux';

export const UPDATE_USERINFO = 'updateUserinfo';
export const UPDATE_TEAMINFO = 'updateTeaminfo';
export const UPDATE_PROBLEMS = 'updateProblems';
export const UPDATE_TEAMLIST = 'updateTeamlist';
export const UPDATE_ANNOUNCEMENTS = 'updateAnnouncements';
export const UPDATE_SERVEREVENT = 'updateServerEvent';
export const UPDATE_CTFCONF = 'updateCTFConfigurations';
export const UPDATE_COUNTDOWN = 'updateCountdown';
export const SET_VISIBLE_CATEGORY = 'setVisibleCategory';
export const SET_VISIBLE_LEVEL = 'setVisibleLevel';
export const SET_HIDDEN_SOLVED = 'setHiddenSolved';
export const RESET_EVENTS = 'resetEvents';
export const EE = 'kkjjhlhlba';

const initialState = {
	point: 0,
	solved: 0,
	ranking: 0,
	easteregg: false,
	hiddenSolved: false,
	visibleCategory: -1,
	visibleLevel: -1,
	userInfo: {},
	teamInfo: {},
	problems: [],
	solvedTeams: {},
	teamList: [],
	announcements: [],
	config: {},
	countdown: {},
	events: {}
};

const dataStore = (state=initialState, action) => {
	switch(action.type){
		case UPDATE_USERINFO:
			state["userInfo"] = action.data;
			return state;
		case UPDATE_TEAMINFO:
			var solved = 0;
			action.data.questions.forEach((question) => {
				solved += question.flags;
			});
			state["teamInfo"] = action.data;
			state["point"] = action.data.points;
			state["solved"] = solved;
			return state;
		case UPDATE_PROBLEMS:
			state["problems"] = action.data;
			return state;
		case UPDATE_TEAMLIST:
			const teamlist = action.data.sort((current, next) => {
				if (current.points < next.points)
					return 1;
				if (current.points > next.points)
					return -1;
				if (new Date(current.last_score_time) > new Date(next.last_score_time))
					return 1;
				return -1;
			})
			state["teamList"] = teamlist;
			state["solvedTeams"] = {};
			teamlist.forEach((team, index) => {
				if (team.id == state["userInfo"].team) {
					var solved = 0;
					team.questions.forEach((question) => {
						solved += question.flags;
					});
					state["teamInfo"] = team;
					state["point"] = team.points;
					state["solved"] = solved;
					state["ranking"] = index + 1;
				}
				team.questions.forEach((question) => {
					state["solvedTeams"][question.id] = ~~state["solvedTeams"][question.id] + 1;
				});
			});
			return state;
		case UPDATE_ANNOUNCEMENTS:
			const announcements = action.data.sort((current, next) => {
				const day_current = new Date(current["updated_at"]);
				const day_next = new Date(next["updated_at"]);
				if (day_current < day_next)
					return 1;
				if (day_current > day_next)
					return -1;
				return 0;
			})
			state["announcements"] = announcements;
			return state;
		case UPDATE_SERVEREVENT:
			switch (action.data.type) {
				case "update":
					switch (action.data.model) {
						case "notice":
							state["events"]["announcements"] = ~~state["events"]["announcements"] + 1;
							break;
						case "question":
							state["events"]["problems"] = ~~state["events"]["problems"] + 1;
							break;
						default:
							console.log(JSON.stringify(action.data));
					}
					break;
				default:
					console.log(JSON.stringify(action.data));
			}
			return state;
		case UPDATE_CTFCONF:
			action.data.forEach((config) => {
				switch (config.id) {
					case "start_at":
						state["config"]["start"] = new Date(config.value);
						break;
					case "end_at":
						state["config"]["end"] = new Date(config.value);
						break;
				}
			});
			return state;
		case UPDATE_COUNTDOWN:
			state["countdown"] = action.data;
			return state;
		case SET_VISIBLE_CATEGORY:
			state["visibleLevel"] = -1;
			state["visibleCategory"] = action.data;
			return state;
		case SET_VISIBLE_LEVEL:
			state["visibleCategory"] = -1;
			state["visibleLevel"] = action.data;
			return state;
		case SET_HIDDEN_SOLVED:
			state["hiddenSolved"] = action.data;
			return state;
		case RESET_EVENTS:
			switch (action.data) {
				case "problems":
					state["events"]["problems"] = 0;
					break;
				case "announcements":
					state["events"]["announcements"] = 0;
					break;
				default:
					console.log(JSON.stringify(action.data));
			}
			return state;
		case EE:
			state["easteregg"] = action.data;
			return state;
		default:
			console.log(JSON.stringify(action));
			return state;
	}
}

export default createStore(dataStore);
