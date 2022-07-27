# 🏤 PM2MD

[![Banner representing Postman2Markdown (PM2MD)][pm2md]][0]

[![npm][npm]][3]
[![codacy][codacy]][9]
[![Coverage Status](https://coveralls.io/repos/github/sebastienrousseau/pm2md/badge.svg?branch=main)][8]
[![Coverage Status](https://img.shields.io/coveralls/github/sebastienrousseau/pm2md/solid.svg?branch=main&style=for-the-badge\&color=blueviolet)][8]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge\&color=ff69b4)][4]
![Made with Love][7]

**[Website][0] • [Documentation](https://pm2md/docs/) 
• [Report Bug](https://github.com/sebastienrousseau/pm2md/issues) 
• [Request Feature](https://github.com/sebastienrousseau/pm2md/issues) 
• [Contributing Guidelines](https://github.com/sebastienrousseau/pm2md/blob/master/.github/CONTRIBUTING.md)**

***

## 👋 Welcome to Postman2Markdown (PM2MD) 

This package generates generates a markdown documentation from a Postman
collection file.

![divider][divider]

## Getting Started

👉 Before you begin: » Make sure you have downloaded [Postman][1] and installed
it on your computer. Alternatively, you can sign up to use the [web version][2]
of Postman.

- First export the collection from Postman.

![Drag Racing][5]

- Save the collection file.

![Drag Racing][6]

![divider][divider]

## Install

```npm
npm install -g pm2md
```

![divider][divider]

## Usage

Execute pm2md specifying the collection file.

```bash
pm2md postman_collection.json 
```

```bash
Reading file examples/postman_collection.json
Generating markdown file ...
Documentation was created correctly examples/postman_collection.md

```
The package will create an .md file.

Example of file generated
[postman_collection.md](examples/postman_collection.md)

![divider][divider]

## 🚥 Semantic Versioning Policy

For transparency into our release cycle and in striving to maintain backward
compatibility, `pm2md` follows [semantic versioning](http://semver.org/)
and [ESLint's Semantic Versioning Policy](https://github.com/eslint/eslint#semantic-versioning-policy).

![divider][divider]

## ✅ Changelog

- [GitHub Releases](https://github.com/sebastienrousseau/pm2md/releases)

![divider][divider]

## 📖 Code of Conduct

We are committed to preserving and fostering a diverse, welcoming community.
Please read our [Code of Conduct](https://github.com/sebastienrousseau/pm2md/blob/master/.github/CODE-OF-CONDUCT.md).

![divider][divider]

## ⭐️ Our Values

- We believe perfection must consider everything.
- We take our passion beyond code into our daily practices.
- We are just obsessed about creating and delivering exceptional solutions.

![divider][divider]

## ❤️ Contributing

Thank you for using PM2MD! If you like the library, it would be 
great if you can give it a star ⭐ on [GitHub][17].

There are also many ways in which you can participate in this project, for
example:

* [Submit bugs and feature requests](https://github.com/sebastienrousseau/pm2md/issues/new), and help us verify as they are checked in,
* Review [source code changes](https://github.com/sebastienrousseau/pm2md/pulls), and help us improve our code quality,
* Review the [documentation](https://github.com/sebastienrousseau/pm2md/docs) and make pull requests for anything from typos to additional and new content.

Please read carefully through our
[Contributing Guidelines](https://github.com/sebastienrousseau/pm2md/blob/master/.github/CONTRIBUTING.md)
for further details on the process for submitting pull requests to us.

![divider][divider]

## 🥂 License

Copyright (c) Sebastien Rousseau. All rights reserved.

Licensed under the [MIT](LICENSE) license.

![divider][divider]

## 💖 Acknowledgements

[PM2MD][0] is beautifully crafted by these people and a bunch of awesome
[contributors][contributors-url].

| Contributors |
|---------|
|[![Sebastien Rousseau](https://avatars0.githubusercontent.com/u/1394998?s=250)](https://sebastienrousseau.co.uk)|
|[Sebastien Rousseau](https://github.com/sebastienrousseau)|

![divider][divider]

[codacy]: https://img.shields.io/codacy/grade/f20b5f4e5e6649a9a4ec25df87b6dc08?style=for-the-badge "codacy"
[contributors-shield]: https://img.shields.io/github/contributors/sebastienrousseau/pm2md.svg?style=for-the-badge "contributors"
[divider]: https://raw.githubusercontent.com/sebastienrousseau/pm2md/master/assets/divider.svg "divider"
[forks-shield]: https://img.shields.io/github/forks/sebastienrousseau/pm2md.svg?style=for-the-badge "forks"
[npm]: https://img.shields.io/npm/v/sebastienrousseau/pm2md.svg?style=for-the-badge\&color=f14041 "npm"
[pm2md]: https://raw.githubusercontent.com/sebastienrousseau/pm2md/master/assets/pm2md-logo.svg "Postman2Markdown (PM2MD)" 

[0]: https://pm2md.io
[1]: https://www.postman.com/downloads/
[2]: https://www.postman.com/
[3]: https://www.npmjs.com/package/@sebastienrousseau/pm2md
[4]: https://opensource.org/licenses/MIT
[5]: https://raw.githubusercontent.com/sebastienrousseau/pm2md/master/resources/export_collection.png
[6]: https://raw.githubusercontent.com/sebastienrousseau/pm2md/master/resources/export.png
[7]: https://raw.githubusercontent.com/sebastienrousseau/pm2md/master/assets/made-with-love.svg
[8]: https://coveralls.io/github/sebastienrousseau/pm2md?branch=main
[9]: https://app.codacy.com/gh/sebastienrousseau/pm2md/
[forks-url]: https://github.com/sebastienrousseau/pm2md/network/members
[contributors-url]: https://github.com/sebastienrousseau/pm2md/graphs/contributors
