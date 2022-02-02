'use strict';

module.exports = class UrlFormatter {

	/**
	 * @static
	 * @param {URL} url URL instance
	 * @param {object} params URL params to format
	 * @returns {string} formatted URL string
	 */
	static format(url, params) {

		if(params)
			Object.entries(params).forEach(([key, value]) => this.formatParam(url, key, value));

		return url.toString();
	}

	/**
	 * @static
	 * @private
	 */
	static formatParam(url, key, value) {

		if(typeof value !== 'object' || value === null) {
			url.searchParams.append(key, value);
			return;
		}

		if(Array.isArray(value)) {
			this.formatArrayParam(url, key, value);
			return;
		}

		this.formatObjectParam(url, key, value);
	}

	/**
	 * @static
	 * @private
	 */
	static formatArrayParam(url, key, values) {
		values.forEach((item, index) => this.formatParam(url, `${key}[${index}]`, item));
	}

	/**
	 * @static
	 * @private
	 */
	static formatObjectParam(url, key, value) {
		Object.entries(value).forEach(([subKey, subValue]) => this.formatParam(url, `${key}[${subKey}]`, subValue));
	}
};
