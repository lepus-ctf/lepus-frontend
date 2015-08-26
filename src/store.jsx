import {createStore} from 'redux';

export const UPDATE_USERINFO = 'updateUserinfo';
export const UPDATE_TEAMINFO = 'updateTeaminfo';
export const UPDATE_PROBLEMS = 'updateProblems';
export const UPDATE_TEAMLIST = 'updateTeamlist';
export const UPDATE_ANNOUNCEMENTS = 'updateAnnouncements';

const initialState = {
	point: 0,
	solved: 0,
	userInfo: {},
	teamInfo: {},
	problems: [],
	teamList: [],
	announcements: []
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
			state["teamList"] = action.data;
			for (var i = 0; i < action.data.length; ++i) {
				if (action.data[i] === state["userInfo"].team) {
					state["teamInfo"] = action.data[i];
					break;
				}
			}
			return state;
		case UPDATE_ANNOUNCEMENTS:
			state["announcements"] = action.data;
			return state;
		default:
			return state;
	}
}

export default createStore(dataStore);
