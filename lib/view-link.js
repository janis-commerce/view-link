'use strict';

const { URL } = require('url');
const Settings = require('@janiscommerce/settings');
const ViewLinkError = require('./view-link-error');

/**
 * @class ViewLink
 * @classdesc Generates JANIS views links
 */
class ViewLink {

	static get stage() {
		return process.env.JANIS_ENV;
	}

	static get config() {

		if(!this._config)
			this._setConfig();

		return this._config;
	}

	static set config(config) {
		this._config = config;
	}

	static get host() {

		if(!this._host)
			this._setHost();

		return this._host;
	}

	static set host(host) {
		this._host = host;
	}

	/**
	 * Obtains the config from .janiscommercerc.json and validates the config
	 * @throws if the config is invalid
	 */
	static _setConfig() {

		const config = Settings.get('view-link');

		this._validateConfig(config);

		this.config = config;
	}

	/**
	 * Obtains the host from .janiscommercerc.json and validates it
	 * @throws if the host is invalid
	 */
	static _setHost() {

		if(typeof this.stage === 'undefined')
			throw new ViewLinkError('Unknown stage name', ViewLinkError.codes.NO_STAGE_NAME);

		const host = this.config.hosts[this.stage];

		if(typeof host === 'undefined')
			throw new ViewLinkError(`Host not found for stage '${this.stage}'. Check config file.`, ViewLinkError.codes.HOST_NOT_FOUND);

		this.host = host;
	}

	/**
	 * Validates that the config exists and have the required settings
	 * @param {Object} config The config object
	 * @throws If the config is invalid
	 */
	static _validateConfig(config) {

		// Checks if there are settings, throws if not.
		if(config === null || typeof config === 'undefined')
			throw new ViewLinkError('Invalid config: Not found.', ViewLinkError.codes.CONFIG_NOT_FOUND);

		// Checks if the config is an object (not array)
		if(typeof config !== 'object' || Array.isArray(config))
			throw new ViewLinkError('Invalid config: Should be an object.', ViewLinkError.codes.INVALID_CONFIG);

		// Hosts must exists in config
		if(config.hosts === null || typeof config.hosts !== 'object' || Array.isArray(config.hosts))
			throw new ViewLinkError('Invalid hosts in config: Should exist and must be an object.', ViewLinkError.codes.INVALID_HOSTS_IN_CONFIG);
	}

	/**
	 * Validates the basic parameters shared by most methods
	 * @param {String} service The service name
	 * @param {String} entity The entity name
	 * @param {Object} params The optional params (query string)
	 * @throws When the validation fails
	 */
	static _validateBasicParams(service, entity, params) {

		// Service is required and must be a string
		if(typeof service !== 'string')
			throw new ViewLinkError('Invalid service: Should be a string.', ViewLinkError.codes.INVALID_SERVICE);

		// Entity is required and must be a string
		if(typeof entity !== 'string')
			throw new ViewLinkError('Invalid entity: Should be a string.', ViewLinkError.codes.INVALID_ENTITY);

		// Params is optional and must be an object
		if(typeof params !== 'undefined' && (typeof params !== 'object' || Array.isArray(params)))
			throw new ViewLinkError('Invalid params: Should be an object.', ViewLinkError.codes.INVALID_PARAMS);
	}

	/**
	 * Exports the received URL with the specified query strings
	 * @param {URL} url The URL object
	 * @param {Object} params The params that will be converted into query strings
	 * @returns {String} The built URL
	 */
	static _exportURL(url, params) {

		if(typeof params !== 'undefined') {
			Object.entries(params).forEach(([key, value]) => {
				url.searchParams.append(key, value);
			});
		}

		return url.toString();
	}

	/**
	 * Obtain the Browse view link
	 * @param {String} service The service name
	 * @param {String} entity The entity
	 * @param {Object} params The query strings
	 * @returns {String} The built URL
	 * @throws if any of the required settings/params not exists or are invalid
	 * @example
	 * getBrowse('my-service','items',{ sortBy: 'something' });
	 * // Expected output: 'http://somehost.com/my-service/items/browse?sortBy=something'
	 */
	static getBrowse(service, entity, params) {

		const host = this.host; // eslint-disable-line

		this._validateBasicParams(service, entity, params);

		try {

			const url = new URL(`${host}/${service}/${entity}/browse`);

			return this._exportURL(url, params);

		} catch(err) {
			throw new ViewLinkError(err.message, ViewLinkError.codes.URL_ERROR);
		}
	}

	/**
	 * Obtain the Edit view link
	 * @param {String} service The service name
	 * @param {String} entity The entity
	 * @param {String} entityId The entity ID
	 * @param {Object} params The query strings
	 * @returns {String} The built URL
	 * @throws if any of the required settings/params not exists or are invalid
	 * @example
	 * getEdit('my-service','items', 'some-id',{ sortBy: 'something' });
	 * // Expected output: 'http://somehost.com/my-service/items/edit/some-id?sortBy=something'
	 */
	static getEdit(service, entity, entityId, params) {

		const host = this.host; // eslint-disable-line

		this._validateBasicParams(service, entity, params);

		if(typeof entityId !== 'string')
			throw new ViewLinkError('Invalid entity ID: Should exist and must be a string.', ViewLinkError.codes.INVALID_ENTITY_ID);

		try {

			const url = new URL(`${host}/${service}/${entity}/edit/${entityId}`);

			return this._exportURL(url, params);

		} catch(err) {
			throw new ViewLinkError(err.message, ViewLinkError.codes.URL_ERROR);
		}
	}

	/**
	 * Obtain a custom view link
	 * @param {Array} input The array of elements to build the URL
	 * @returns {String} The built URL
	 * @throws if any of the required settings/params not exists or are invalid
	 * @example
	 * get(['my-service','items'], { sortBy: 'something' });
	 * // Expected output: 'http://somehost.com/my-service/items?sortBy=something'
	 */
	static get(entries, params) {

		const host = this.host; // eslint-disable-line

		if(!Array.isArray(entries))
			throw new ViewLinkError('Invalid entries: Should be an array.', ViewLinkError.codes.INVALID_ENTRIES);

		if(typeof params !== 'undefined' && (typeof params !== 'object' || Array.isArray(params)))
			throw new ViewLinkError('Invalid params: Should be an object.', ViewLinkError.codes.INVALID_PARAMS);

		try {

			const url = new URL(`${host}/${
				entries.reduce((res, next) => `${res}/${next}`)
			}`);

			return this._exportURL(url, params);

		} catch(err) {
			throw new ViewLinkError(err.message, ViewLinkError.codes.URL_ERROR);
		}
	}
}

module.exports = ViewLink;
