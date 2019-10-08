'use strict';

class ViewLinkError extends Error {

	static get codes() {

		return {
			CONFIG_NOT_FOUND: 1,
			INVALID_SERVICE: 2,
			INVALID_ENTITY: 3,
			INVALID_ENTITY_ID: 4,
			INVALID_PARAMS: 5,
			INVALID_ENTRIES: 6,
			NO_STAGE_NAME: 7,
			INVALID_HOSTS_IN_CONFIG: 8,
			HOST_NOT_FOUND: 9,
			URL_ERROR: 10
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
