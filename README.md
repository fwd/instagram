<h1 align="center">@fwd/instagram 📊</h1>

> A NodeJS library for programmatically accesing Instagram.

### 🏠 [Homepage](https://github.com/fwd/sheets)

## Description

This package is under active development. 

## Install

```sh
npm install @fwd/instagram
# or
yarn add @fwd/instagram
```

## Usage

```javascript
const instagram = require('@fwd/instagram');

;(async () => {

	var user = await instagram({
		username: 'forwardmiami',
		postLimit: 10 
	})

	console.log(user)

})()
```

## Author

👤  **Forward Miami**

* Website: [https://forward.miami](https://forward.miami)
* Github: [@fwd](https://github.com/fwd)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/fwd/instagram/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Forward Miami](https://forward.miami).
