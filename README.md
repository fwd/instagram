![Cover](https://raw.githubusercontent.com/fwd/instagram/master/.github/cover.png)

<h1 align="center">@fwd/instagram 📷</h1>

> A NodeJS library for programmatically accessing Instagram.

## Install

```sh
npm install @fwd/instagram
```

## Usage

```js

const instagram = require('@fwd/instagram');

(async () => {
	console.log( await instagram.profile('forwardmiami') )
})()

```

## Example Response

```json
{
   "id": "6812824271",
   "bio": "We modernize your online presence, and help get new customers. All in a few weeks.",
   "fullName": "Miami Web Design",
   "website":" https://forward.miami/",
   "channel": false,
   "is_business": true,
   "is_private": false,
   "is_verified": false,
   "avatar":" https://instagram.fmia1-2.fna.fbcdn.net/v/t51.2885-19/s320x320/118291205_667481360532286_6172069380366027002_n.jpg?_nc_ht=instagram.fmia1-2.fna.fbcdn.net&_nc_ohc=_q_awSUArN0AX9W1NXN&tp=1&oh=6e8cc4fe53b7d05da7cad905b38f4a7b&oe=5FF7C66C",
   "username": "forwardmiami",
   "connected_fb_page": null,
   "followers": 9592,
   "following": 1973,
   "posts": [],
   "averageLike": 196.38,
   "engagementRate": 2,
   "advertisingValue": 1.98,
   "popularPost": {},
   "occupation": "n/a",
   "links": [],
   "hashtags": [],
   "updated": "December 7, 2020"
}
```

## 👤 Author

**Forward Miami**

* Github: [@fwd](https://github.com/fwd)
* Website: [https://forward.miami](https://forward.miami)

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to check [issues page](https://github.com/fwd/instagram/issues).

## ⭐️ Show your support

Give a star if this project helped you, and help us continue maintaining this project by contributing to it or becoming a sponsor.

[Become a sponsor to fwd](https://github.com/sponsors/fwd)

## 📝 License

Copyright © 2020 [Forward Miami](https://forward.miami). This project is [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html) licensed.
