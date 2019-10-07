'use strict';

const { URL } = require('url');
const path = require('path');
const Settings = require('@janiscommerce/settings');
const ViewLinkError = require('./view-link-error');

class ViewLink {

	static get config() {

		if(!this._config)
			this._getConfig();

		return this._config;
	}

	static _getConfig() {

		this._config = Settings.get('view-link');

		// Checks if there are settings, throws if not.
		if(typeof this._config === 'undefined')
			throw new ViewLinkError('Invalid config: not found.', ViewLinkError.codes.CONFIG_NOT_FOUND);
	}

	static getBrowse(service, entity, params = {}) {

		if(typeof service !== 'string')
			throw new ViewLinkError('Invalid service: Should be a string.', ViewLinkError.codes.INVALID_SERVICE);

		if(typeof entity !== 'string')
			throw new ViewLinkError('Invalid entity: Should be a string.', ViewLinkError.codes.INVALID_ENTITY);

		if(typeof params !== 'object' || Array.isArray(params))
			throw new ViewLinkError('Invalid params: Should be an object.', ViewLinkError.codes.INVALID_PARAMS);


	}

	static getEdit(service, entity, entityId, params = {}) {

	}

	static get(url, params = {}) {

	}

}

module.exports = ViewLink;
