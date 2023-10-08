# Postman2Markdown (PM2MD)

[![logo][pm2md]][0]


[![codacy][codacy]][9]
[![contributors][contributors-shield]][contributors-url]
[![forks][forks-shield]][forks-url]
[![license](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge\&color=ff69b4)][4]
![made with love][7]
[![npm](https://img.shields.io/npm/v/@sebastienrousseau/pm2md.svg?style=for-the-badge\&color=f14041)](https://www.npmjs.com/package/@sebastienrousseau/pm2md)

**[Website][0] • [Documentation](https://pm2md/docs/)
• [Report Bug](https://github.com/sebastienrousseau/pm2md/issues)
• [Request Feature](https://github.com/sebastienrousseau/pm2md/issues)
• [Contributing Guidelines](https://github.com/sebastienrousseau/pm2md/blob/master/.github/CONTRIBUTING.md)**

***

## Welcome to Postman2Markdown (PM2MD)

Postman2Markdown (PM2MD) is a package that generates markdown documentation from
a Postman collection file. It simplifies the process of converting your Postman
collections into well-structured and readable documentation.

## Getting Started with Development

Before you begin, make sure you have downloaded [Postman][1] and installed
it on your computer. Alternatively, you can use the [web version][2] of Postman.

- Export your Postman collection.

![Drag Racing][5]

- Save the collection file to your local directory.

![Drag Racing][6]

## Install

You can install Postman2Markdown globally using npm:

```bash
npm install -g pm2md
```

## Usage

To generate markdown documentation from a Postman collection, run the following
command in your terminal, specifying the path to your collection file:

```bash
pm2md postman_collection.json
```

```bash
Reading file examples/postman_collection.json
Generating markdown file ...
Documentation was created correctly examples/postman_collection.md

```

This will read the specified Postman collection file, generate the corresponding
markdown documentation, and save it as an `.md` file.

Example of file generated
[postman_collection.md](examples/postman_collection.md)

## Versioning & Updates

Adhering to [semantic versioning](http://semver.org/) ensures consistent
updates. Refer to
[GitHub Releases](https://github.com/sebastienrousseau/pm2md/releases) for the
changelog.

## How to Contribute

Your contributions can make this guide even better! Check our
[Contributing Guidelines](https://github.com/sebastienrousseau/pm2md/blob/main/.github/CONTRIBUTING.md)
to get started.

## Community & Values

Join a community that values diversity and inclusivity. Familiarize yourself
with our [Code of Conduct](https://github.com/sebastienrousseau/pm2md/blob/main/.github/CODE-OF-CONDUCT.md).

Our beliefs:

- Perfection encompasses everything.
- Passion transcends code.
- Obsession with excellence in solutions.

## Licensing

This project embraces the MIT License. View [LICENSE details](LICENSE).

## Shoutouts & Credits

[PM2MD][0] is a masterpiece crafted by
[Sebastien Rousseau](https://sebastienrousseau.com) and other incredible
[contributors][contributors-url].

Crafted with ❤ in London.

[codacy]: https://img.shields.io/codacy/grade/f20b5f4e5e6649a9a4ec25df87b6dc08?style=for-the-badge "codacy"
[contributors-shield]: https://img.shields.io/github/contributors/sebastienrousseau/pm2md.svg?style=for-the-badge "contributors"
[divider]: https://raw.githubusercontent.com/sebastienrousseau/pm2md/master/assets/divider.svg "divider"
[forks-shield]: https://img.shields.io/github/forks/sebastienrousseau/pm2md.svg?style=for-the-badge "forks"
[pm2md]: https://raw.githubusercontent.com/sebastienrousseau/pm2md/master/assets/pm2md-logo.svg "Postman2Markdown (PM2MD)"
[logo]: https://kura.pro/pm2md/images/banners/pm2md.webp "Postman2Markdown (PM2MD)"

[0]: https://pm2md.com
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
