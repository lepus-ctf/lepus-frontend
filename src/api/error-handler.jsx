export default class ErrorHandler {
	constructor() {
		this.criticalAction = (() => {});
		this.errorCodes = [
			"REQUIRED",
			"TOO_LONG",
			"TOO_SHORT",
			"TOO_SMALL",
			"TOO_BIG",
			"INVALID",
			"DUPLICATED",
			"NOT_FOUND",
			"NUMERIC_IS_REQUIRED",
			"UNAUTHORIZED",
			"PERMISSION_DENIED",
			"INVALID_CREDENTIALS",
			"INCORRECT_ANSWER",
			"ALREADY_SUBMITTED",
			"MAX_FAILUER",
			"MAX_ANSWERS",
			"NOT_STARTED",
			"CLOSED",
			];
		this.errorMessagesJP = {
			"REQUIRED": "入力が必須です。",
			"TOO_LONG": "入力文字が長過ぎます。",
			"TOO_SHORT": "入力文字が短すぎます。",
			"TOO_SMALL": "入力値が小さすぎます。",
			"TOO_BIG": "入力値が大きすぎます。",
			"INVALID": "入力値が不正です。",
			"DUPLICATED": "入力値はすでに存在しています。",
			"NOT_FOUND": "項目が見つかりません。",
			"NUMERIC_IS_REQUIRED": "数値で入力する必要があります。",
			"UNAUTHORIZED": "アクセス認証がされていません。",
			"PERMISSION_DENIED": "あなたにはアクセス権限がありません。",
			"INVALID_CREDENTIALS": "認証情報が不正です。",
			"INCORRECT_ANSWER": "回答が間違っています。",
			"ALREADY_SUBMITTED": "すでに回答しています",
			"MAX_FAILUER": "回答回数制限に達したため、これ以上回答できません。",
			"MAX_ANSWERS": "正答者数が上限に達したため、回答を受け付けられません。",
			"NOT_STARTED": "まだ開始していません。",
			"CLOSED": "終了しました。",
		};
	}

	parseError(err, res) {
		try {
			console.error("Path:" + res.req.path);
		} catch(e) {
			console.error("Client side error");
		}
		console.error(err);
		var errors;
		if (!!res && res.text) {
			try {
				var json = JSON.parse(res.text);
				errors = json.errors;
				console.error("REST error: " + json.message);
			} catch(e) {
				console.error("Error object parsing failed.");
			}
		} else {
			console.error("Can't parse error object.");
			console.error("Unknown error.")
		}

		var messages = [];
		if (errors && errors.length > 0) {
			errors.forEach((error) => {
				console.log(JSON.stringify(error));
				const code = error.error.toUpperCase();
				if (this.errorCodes.indexOf(code) === -1) {
					console.error("Unlisted error!");
					messages.push(code);
				} else {
					if (error.field) {
						messages.push(error.field + 'の' + this.errorMessagesJP[code]);
					} else {
						messages.push(this.errorMessagesJP[code]);
					}
				}
			}.bind(this));
		} else {
			try {
				messages.push(err.toString());
			} catch(e) {
				messages.push("REALLY_UNKNOWN_ERROR");
			}
		}
		if (!!res && res.status === 403) {
			this.criticalAction();
		}
		console.log(JSON.stringify(messages));
		return messages;
	}

};
