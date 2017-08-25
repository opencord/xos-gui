const request = require('request-promise');
const config = require('../test_helpers/config');
const user = require('../test_helpers/user');
const P = require('bluebird');
const baseUrl = config.url.replace('xos/#', '');
const auth = {
  'auth': {
    'user': user.username,
    'pass': user.pwd,
  }
};

const _getIds = (list) => {
	return list.map(i => i.id);
}

const _parseRes = (res) => JSON.parse(res);

const getModels = P.promisify((url, done) => {
	request.get(`${ baseUrl + url }`, auth)
	.then(res => {
		return done(null, _parseRes(res));
	})
	.catch(done);
});

const deleteModel = P.promisify((url, id, done) => {
	request.delete(`${ baseUrl +url }/${id}`, auth)
	.then(res => {
		return done(null, res);
	})
	.catch(done);
});

const deleteAllModels = P.promisify((url, done) => {
	getModels(url)
	.then(res => {
		if (res.items.length === 0) {
			return done(null);
		}
		const ids = _getIds(res.items);
		const promises = [];
		ids.forEach(id => {
			promises.push(deleteModel(url, id));
		})

		return P.all(promises)
	})
	.then(res => {
		done(null, res);
	})
	.catch(done);
});

const createModel = P.promisify((url, data, done) => {
	request({
		uri: baseUrl + url,
		method: 'POST',
		json: data,
		auth: auth.auth
	})
	.then(res => {
		return done(null, res);
	})
	.catch(err => {
		return done(err);
	})
})

// getModels(`/xosapi/v1/core/nodes`).then(console.log);

// createModel(`/xosapi/v1/core/nodes`, {name: 'test-p', site_deployment_id: 1});

module.exports = {
	getModels: getModels,
	deleteAllModels: deleteAllModels,
	createModel: createModel,
	deleteModel: deleteModel
}