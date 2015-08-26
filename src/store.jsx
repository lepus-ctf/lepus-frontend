import {createStore} from 'redux';

export const UPDATE_USERINFO = 'updateUserinfo';
export const UPDATE_TEAMINFO = 'updateTeaminfo';
export const UPDATE_PROBLEMS = 'updateProblems';
export const UPDATE_TEAMLIST = 'updateTeamlist';
export const UPDATE_ANNOUNCEMENTS = 'updateAnnouncements';
export const UPDATE_SERVEREVENT = 'updateServerEvent';
export const RESET_EVENTS = 'resetEvents';

const initialState = {
	point: 0,
	solved: 0,
	userInfo: {},
	teamInfo: {},
	problems: [],
	teamList: [],
	announcements: [],
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
			for (var i = 0; i < action.data.length; ++i) {
				if (action.data[i].id == state["userInfo"].team) {
					var solved = 0;
					action.data[i].questions.forEach((question) => {
						solved += question.flags;
					});
					state["teamInfo"] = action.data[i];
					state["point"] = action.data[i].points;
					state["solved"] = solved;
					break;
				}
			}
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
		default:
			console.log(JSON.stringify(action));
			return state;
	}
}

export default createStore(dataStore);
