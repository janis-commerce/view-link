'use strict';

const assert = require('assert');
const sandbox = require('sinon').createSandbox();
const Settings = require('@janiscommerce/settings');

const ViewLink = require('./../lib/view-link');
const ViewLinkError = require('./../lib/view-link-error');

const fakeConfig = {
	hosts: {
		local: 'http://localhost:8080',
		beta: 'https://app.janisdev.in',
		qa: 'https://app.janisqa.in',
		prod: 'https://app.janis.in'
	}
};

const stubStage = stage => {
	process.env.JANIS_ENV = stage;
};

const restoreStage = () => {
	delete process.env.JANIS_ENV;
};

const mockSettings = returns => sandbox.mock(Settings)
	.expects('get')
	.withArgs('view-link')
	.returns(returns);

const clearConfigCaches = () => {
	delete ViewLink._config;
	delete ViewLink._host;
};

describe('ViewLink', () => {

	beforeEach(() => {
		stubStage('local');
	});

	afterEach(() => {
		sandbox.restore();
		restoreStage();
		clearConfigCaches();
	});

	describe('Config caches', () => {

		it('should not call Settings when the config was already loaded', () => {

			const settingsMock = mockSettings(fakeConfig);

			assert.deepStrictEqual(ViewLink.config, fakeConfig);
			assert.deepStrictEqual(ViewLink.config, fakeConfig);

			settingsMock.verify();
			sandbox.assert.calledOnce(settingsMock);
		});

		it('should not call _setHost() when the host was already loaded', () => {

			const settingsMock = mockSettings(fakeConfig);
			const getHostSpy = sandbox.spy(ViewLink, '_setHost');

			assert.deepStrictEqual(ViewLink.host, 'http://localhost:8080');
			assert.deepStrictEqual(ViewLink.host, 'http://localhost:8080');

			settingsMock.verify();
			sandbox.assert.calledOnce(getHostSpy);
		});

	});

	describe('Config validations', () => {

		context('when the config is not exists', () => {

			[
				'getBrowse',
				'getEdit',
				'get'

			].forEach(method => {

				it(`${method} should throw`, () => {

					const settingsMock = mockSettings();

					assert.throws(() => ViewLink[method](), {
						name: 'ViewLinkError',
						code: ViewLinkError.codes.CONFIG_NOT_FOUND
					});

					settingsMock.verify();
				});
			});
		});

		context('when the config is invalid', () => {

			[
				'getBrowse',
				'getEdit',
				'get'

			].forEach(method => {

				it(`${method} should throw if the config.hosts not exists`, () => {

					const settingsMock = mockSettings({});

					assert.throws(() => ViewLink[method](), {
						name: 'ViewLinkError',
						code: ViewLinkError.codes.INVALID_HOSTS_IN_CONFIG
					});

					settingsMock.verify();
				});

				[1, 'string', ['array']].forEach(setting => {

					it(`${method} should throw if the config isn't an object or is an array`, () => {

						const settingsMock = mockSettings(setting);

						assert.throws(() => ViewLink[method](), {
							name: 'ViewLinkError',
							code: ViewLinkError.codes.INVALID_CONFIG
						});

						settingsMock.verify();
					});

					it(`${method} should throw if the config.hosts is an object or is an array`, () => {

						const settingsMock = mockSettings({ hosts: setting });

						assert.throws(() => ViewLink[method](), {
							name: 'ViewLinkError',
							code: ViewLinkError.codes.INVALID_HOSTS_IN_CONFIG
						});

						settingsMock.verify();
					});
				});
			});
		});
	});

	context('when the host is invalid or not exists', () => {

		[
			'getBrowse',
			'getEdit'

		].forEach(method => {

			it(`${method} should throw if the stage ENV variable not exists`, () => {

				restoreStage();

				assert.throws(() => ViewLink[method](), {
					name: 'ViewLinkError',
					code: ViewLinkError.codes.NO_STAGE_NAME
				});
			});

			it(`${method} should throw if the host not exists in config`, () => {

				const settingsMock = mockSettings({
					hosts: {
						sarasa: ''
					}
				});

				assert.throws(() => ViewLink[method](), {
					name: 'ViewLinkError',
					code: ViewLinkError.codes.HOST_NOT_FOUND
				});

				settingsMock.verify();
			});
		});
	});

	context('when the received parameters are invalid', () => {

		let settingsMock;

		beforeEach(() => {
			settingsMock = mockSettings(fakeConfig);
		});

		[
			'getBrowse',
			'getEdit'

		].forEach(method => {

			[undefined, null, 1, ['array']].forEach(value => {

				it(`${method} should throw if the received service is invalid`, () => {

					assert.throws(() => ViewLink[method](value), {
						name: 'ViewLinkError',
						code: ViewLinkError.codes.INVALID_SERVICE
					});

					settingsMock.verify();
				});

				it(`${method} should throw if the received entity is invalid`, () => {

					assert.throws(() => ViewLink[method]('some-service', value), {
						name: 'ViewLinkError',
						code: ViewLinkError.codes.INVALID_ENTITY
					});

					settingsMock.verify();
				});
			});
		});

		describe('getBrowse', () => {

			[1, 'string', ['array']].forEach(params => {

				it('should throw if the received params are invalid', () => {

					assert.throws(() => ViewLink.getBrowse('some-service', 'some-entity', params), {
						name: 'ViewLinkError',
						code: ViewLinkError.codes.INVALID_PARAMS
					});

					settingsMock.verify();
				});
			});
		});

		describe('getEdit', () => {

			[1, 'string', ['array']].forEach(params => {

				it('should throw if the received params are invalid', () => {

					assert.throws(() => ViewLink.getEdit('some-service', 'some-entity', 'some-id', params), {
						name: 'ViewLinkError',
						code: ViewLinkError.codes.INVALID_PARAMS
					});

					settingsMock.verify();
				});
			});

			[undefined, null, 1, ['array']].forEach(entityId => {

				it('should throw if the received entity ID is invalid', () => {

					assert.throws(() => ViewLink.getEdit('some-service', 'some-entity', entityId), {
						name: 'ViewLinkError',
						code: ViewLinkError.codes.INVALID_ENTITY_ID
					});

					settingsMock.verify();
				});
			});
		});

		describe('get', () => {

			[1, 'string', ['array']].forEach(params => {

				it('should throw if the received params are invalid', () => {

					assert.throws(() => ViewLink.get(['some-service', 'some-entity'], params), {
						name: 'ViewLinkError',
						code: ViewLinkError.codes.INVALID_PARAMS
					});

					settingsMock.verify();
				});
			});

			[undefined, null, 1, 'string'].forEach(entries => {

				it('should throw if the received entries is not an array', () => {

					assert.throws(() => ViewLink.get(entries), {
						name: 'ViewLinkError',
						code: ViewLinkError.codes.INVALID_ENTRIES
					});

					settingsMock.verify();
				});
			});
		});
	});

	context('when the url to build is invalid', () => {

		let settingsMock;

		beforeEach(() => {
			settingsMock = mockSettings({
				hosts: {
					local: 'bad-url'
				}
			});
		});

		describe('getBrowse', () => {

			it('should throw if the url build fails', () => {

				assert.throws(() => ViewLink.getBrowse('some-service', 'some-entity'), {
					name: 'ViewLinkError',
					code: ViewLinkError.codes.URL_ERROR
				});

				settingsMock.verify();
			});
		});

		describe('getEdit', () => {

			it('should throw if the url build fails', () => {

				assert.throws(() => ViewLink.getEdit('some-service', 'some-entity', 'some-id'), {
					name: 'ViewLinkError',
					code: ViewLinkError.codes.URL_ERROR
				});

				settingsMock.verify();
			});
		});

		describe('get', () => {

			it('should throw if the url build fails', () => {

				assert.throws(() => ViewLink.get(['some-service', 'some-entity']), {
					name: 'ViewLinkError',
					code: ViewLinkError.codes.URL_ERROR
				});

				settingsMock.verify();
			});
		});

	});

	describe('getBrowse', () => {

		let settingsMock;

		beforeEach(() => {
			settingsMock = mockSettings(fakeConfig);
		});

		it('should return the url of the view when receives the correct params', () => {

			assert.deepStrictEqual(
				ViewLink.getBrowse('some-service', 'some-entity'),
				'http://localhost:8080/some-service/some-entity/browse'
			);

			settingsMock.verify();
		});

		it('should return the url with query strings when exists in the params', () => {

			assert.deepStrictEqual(
				ViewLink.getBrowse('some-service', 'some-entity', { foo: 'bar' }),
				'http://localhost:8080/some-service/some-entity/browse?foo=bar'
			);

			settingsMock.verify();
		});
	});

	describe('getEdit', () => {

		let settingsMock;

		beforeEach(() => {
			settingsMock = mockSettings(fakeConfig);
		});

		it('should return the url of the view when receives the correct params', () => {

			assert.deepStrictEqual(
				ViewLink.getEdit('some-service', 'some-entity', 'some-id'),
				'http://localhost:8080/some-service/some-entity/edit/some-id'
			);

			settingsMock.verify();
		});

		it('should return the url with query strings when exists in the params', () => {

			assert.deepStrictEqual(
				ViewLink.getEdit('some-service', 'some-entity', 'some-id', { foo: 'bar' }),
				'http://localhost:8080/some-service/some-entity/edit/some-id?foo=bar'
			);

			settingsMock.verify();
		});
	});

	describe('get', () => {

		let settingsMock;

		beforeEach(() => {
			settingsMock = mockSettings(fakeConfig);
		});

		it('should return the url of the view when receives the correct params', () => {

			assert.deepStrictEqual(
				ViewLink.get(['some-service', 'some-entity', 'dashboard']),
				'http://localhost:8080/some-service/some-entity/dashboard'
			);

			settingsMock.verify();
		});

		it('should return the url with query strings when exists in the params', () => {

			assert.deepStrictEqual(
				ViewLink.get(['some-service', 'some-entity', 'dashboard'], { foo: 'bar' }),
				'http://localhost:8080/some-service/some-entity/dashboard?foo=bar'
			);

			settingsMock.verify();
		});
	});
});
