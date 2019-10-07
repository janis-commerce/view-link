'use strict';

class ViewLinkError extends Error {

	static get codes() {

		return {
			CONFIG_NOT_FOUND: 1,
			INVALID_SERVICE: 2,
			INVALID_ENTITY: 3,
			INVALID_ENTITY_ID: 4,
			INVALID_PARAMS: 5
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
