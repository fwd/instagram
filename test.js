const instagram = require('./index')

;(async () => {

	try {

		var user = await instagram({
			username: 'forwardmiami',
			postLimit: 10 
		})

		console.log(user.posts)

	} catch (e) {
		console.log(e)
	}

})()