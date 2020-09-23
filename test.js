const instagram = require('./index')

;(async () => {

	try {

		var user = await instagram.profile('forwardmiami')

		console.log(user.posts)

	} catch (e) {
		console.log(e)
	}

})()