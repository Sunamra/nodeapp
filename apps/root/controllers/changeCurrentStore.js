// To dynamically change the current store (storeDir)
// Implemented for multiple examination => multiple stores
// Default store is ./apps/root/store
// Changes to ./apps/root/store2 when an API is called
// Changed using getter ('get' keyword) in utils/constants.js
// Accessed in modules as `constants.storeDir` for fresh value each time.

const path = require('path');
module.exports = (_, res) => {
	// const stores = ['./apps/root/store', './apps/root/store2'];

	process.env.CURRENT_STORE =
		process.env.CURRENT_STORE === './apps/root/store' ?
			'./apps/root/store2' : './apps/root/store';

	// console.error('Current Store Changed to:', process.env.CURRENT_STORE);
	res.type('text').send(`\nCurrent Store Changed to: '${path.basename(process.env.CURRENT_STORE)}'\n`);
};