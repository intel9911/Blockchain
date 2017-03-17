export const DELETE_RECORD = 'DELETE_RECORD';
export const UPLOAD_START = 'UPLOAD_START';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';

function uploadStart(payload) {
	return {
		type: UPLOAD_START,
		url: payload
	};
}

function uploadError(payload) {
	return {
		type: UPLOAD_ERROR,
		subtitles: []
	};
}

function uploadSuccess(payload) {
	return { 
		type: UPLOAD_SUCCESS,
		subtitles: payload.data
	};
}

export function deleteRecord() {
	return (dispatch, getState) => {
		dispatch({
			type: DELETE_RECORD
		});
	}
}

export function setRecord(data, url) {
	return (dispatch, getState) => {
		dispatch(uploadStart(url));
		fetch('https://shopshot-quangogster.c9users.io/API/parse', {
			method: "POST",
			mode: 'cors',
			body: data
		})
		.then(res => res.json())
		.then(res => {
			if (!res.success) {
				dispatch(uploadError(res));
			} else {
				dispatch(uploadSuccess(res));
			}
		});
	};
}