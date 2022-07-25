# 🏤 PM2MD

[![Banner representing Postman2Markdown (PM2MD)][pm2md]][0]

[![npm][npm]][3]
[![codacy][codacy]][9]
[![Coverage Status](https://coveralls.io/repos/github/sebastienrousseau/pm2md/badge.svg?branch=main)][8]
<!-- [![Coverage Status](https://img.shields.io/coveralls/github/sebastienrousseau/pm2md/solid.svg?branch=main&style=for-the-badge\&color=blueviolet)](https://coveralls.io/github/sebastienrousseau/pm2md?branch=main) -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge\&color=ff69b4)][4]
![Made with Love][7]

**[Website](https://pm2md.o) • [Documentation](https://pm2md/docs/) 
• [Report Bug](https://github.com/sebastienrousseau/pm2md/issues) 
• [Request Feature](https://github.com/sebastienrousseau/pm2md/issues) 
• [Contributing Guidelines](https://github.com/sebastienrousseau/pm2md/blob/master/.github/CONTRIBUTING.md)**

***

## 👋 Welcome to Postman2Markdown (PM2MD) 

This package generates generates a markdown documentation from a Postman
collection file.

## Getting Started

👉 Before you begin: » Make sure you have downloaded [Postman][1] and installed
it on your computer. Alternatively, you can sign up to use the [web version][2]
of Postman.

- First export the collection from Postman.

![Drag Racing][5]

- Save the collection file.

![Drag Racing][6]

## Install

```npm
npm install -g pm2md
```

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

## Contributing
If someone wants to add or improve something, I invite you to collaborate
directly in this repository: 
[pm2md](https://github.com/sebastienrousseau/pm2md.git)

## License
pm2md is released under the
[MIT License](https://opensource.org/licenses/MIT).

[pm2md]: https://raw.githubusercontent.com/sebastienrousseau/pm2md/master/assets/pm2md-logo.svg "Postman2Markdown (PM2MD)" 
[npm]: https://img.shields.io/npm/v/sebastienrousseau/pm2md.svg?style=for-the-badge\&color=f14041
[codacy]: https://img.shields.io/codacy/grade/f20b5f4e5e6649a9a4ec25df87b6dc08?style=for-the-badge
[contributors-shield]: https://img.shields.io/github/contributors/sebastienrousseau/pm2md.svg?style=for-the-badge
[contributors-url]: https://github.com/sebastienrousseau/pm2md/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/sebastienrousseau/pm2md.svg?style=for-the-badge
[forks-url]: https://github.com/sebastienrousseau/pm2md/network/members

[0]: https://pm2md.io
[1]: https://www.postman.com/downloads/
[2]: https://www.postman.com/
[3]: https://www.npmjs.com/@sebastienrousseau/pm2md
[4]: https://opensource.org/licenses/MIT
[5]: https://raw.githubusercontent.com/sebastienrousseau/pm2md/master/resources/export_collection.png
[6]: https://raw.githubusercontent.com/sebastienrousseau/pm2md/master/resources/export.png
[7]: https://raw.githubusercontent.com/sebastienrousseau/pm2md/master/assets/made-with-love.svg
[8]: https://coveralls.io/github/sebastienrousseau/pm2md?branch=main
[9]: https://app.codacy.com/gh/sebastienrousseau/pm2md/

