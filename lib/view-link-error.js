'use strict';

class ViewLinkError extends Error {

	static get codes() {

		return {
			CONFIG_NOT_FOUND: 1,
			INVALID_CONFIG: 2,
			INVALID_SERVICE: 3,
			INVALID_ENTITY: 4,
			INVALID_ENTITY_ID: 5,
			INVALID_PARAMS: 6,
			INVALID_ENTRIES: 7,
			NO_STAGE_NAME: 8,
			INVALID_HOSTS_IN_CONFIG: 9,
			HOST_NOT_FOUND: 10,
			URL_ERROR: 11
		};

	}

	constructor(err, code) {
		super(err);
		this.message = err.message || err;
		this.code = code;
		this.name = 'ViewLinkError';
	}
}

module.exports = ViewLinkError;
