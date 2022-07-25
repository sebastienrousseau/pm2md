[![npm](https://img.shields.io/npm/v/sebastienrousseau/pm2md.svg?style=for-the-badge\&color=f14041)][3]
![Codacy grade](https://img.shields.io/codacy/grade/40d370244f3843f389094afe7719c4e4?style=for-the-badge)
[![Coverage Status](https://img.shields.io/coveralls/github/sebastienrousseau/pm2md/solid.svg?branch=main&style=for-the-badge\&color=blueviolet)](https://coveralls.io/github/sebastienrousseau/pm2md?branch=main)
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge\&color=ff69b4)][4]

# 📦 pm2md

This package generates a Markdown document from a Postman collection. Postman is
an API development environment that makes sending API requests very easy.

**[Website](https://pm2md.o) • [Documentation](https://pm2md/docs/) 
• [Report Bug](https://github.com/sebastienrousseau/pm2md/issues) 
• [Request Feature](https://github.com/sebastienrousseau/pm2md/issues) 
• [Contributing Guidelines](https://github.com/sebastienrousseau/pm2md/blob/master/.github/CONTRIBUTING.md)**

***

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

[contributors-shield]: https://img.shields.io/github/contributors/sebastienrousseau/pm2md.svg?style=for-the-badge
[contributors-url]: https://github.com/sebastienrousseau/pm2md/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/sebastienrousseau/pm2md.svg?style=for-the-badge
[forks-url]: https://github.com/sebastienrousseau/pm2md/network/members

[1]: https://www.postman.com/downloads/
[2]: https://www.postman.com/
[3]: https://www.npmjs.com/@sebastienrousseau/pm2md
[4]: https://opensource.org/licenses/MIT
[5]: https://raw.githubusercontent.com/sebastienrousseau/pm2md/master/resources/export_collection.png
[6]: https://raw.githubusercontent.com/sebastienrousseau/pm2md/master/resources/export.png
