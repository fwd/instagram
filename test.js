const instagram = require('./index')

;(async () => {

	try {

		var user = await instagram.profile('forwardmiami')

		console.log(user)

	} catch (e) {
		console.log(e)
	}

})()