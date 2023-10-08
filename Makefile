#  ___ __  __ ___ __  __ ___
# | _ \  \/  |_  )  \/  |   \
# |  _/ |\/| |/ /| |\/| | |) |
# |_| |_|  |_/___|_|  |_|___/
#
# PM2MD - Postman to Markdown
# https://pm2md.com
#
# Copyright (c) Sebastien Rousseau 2022 - 2023. All rights reserved
# Licensed under the MIT license
# See LICENSE file in the project root for full license information.

.DEFAULT_GOAL := help

# @HELP Set the environment. Default: development.
ENV ?= development

# @HELP Set the version identifier. Default: 0.0.2.
VERSION ?= 0.0.2

# @HELP Set the destination path. Default: ./dist.
DEST ?= ./dist

# @HELP Specify additional flags. No default.
FLAGS ?=

#
# Build tasks
#

# @HELP Generate the PM2MD project.
pm2md:
	@echo
	@echo "Cleaning up..."
	@rm -rf node_modules
	@echo "Installing..."
	@npx pnpm install
	@echo "Building version $(VERSION)..."
	@npx pnpm run build
	@echo "PM2MD v$(VERSION) is ready to use! 🚀"

# @HELP Generate the documentation.
doc:
	@echo
	@echo "Generating documentation..."
	npx typedoc --out ./docs ./src

# @HELP Install dependencies.
install:
	@echo
	@echo "Installing dependencies for $(ENV) environment..."
	npx pnpm install

# @HELP Check for updates.
update:
	@echo
	@echo "Checking npx updates..."
	npx npm-check-updates -u

# @HELP Compile the project.
build:
	@echo
	@echo "Building project to $(DEST)..."
	rm -rf $(DEST)
	npx pnpm run build

# @HELP Publish the project.
publish:
	@echo
	@echo "Publishing pm2md..."
	npx publish

# @HELP Install dependencies.
deps: package.json
	npx pnpm install

#
# Clean up tasks
#

# @HELP Clean up the node_modules.
clean:
	@rm -rf node_modules

# @HELP Check for linting errors.
lint:
	@echo
	@echo "Running eslint with additional flags: $(FLAGS)..."
	npx eslint . $(FLAGS)

# @HELP Fix linting errors.
lint-fix:
	@echo
	@echo "Running eslint --fix..."
	npx eslint . --fix

# @HELP Display the help menu.
help:
	@ echo
	@ echo '  ___ __  __ ___ __  __ ___'
	@ echo ' | _ \  \/  |_  )  \/  |   \'
	@ echo ' |  _/ |\/| |/ /| |\/| | |) |'
	@ echo ' |_| |_|  |_/___|_|  |_|___/'
	@ echo ''
	@ echo ' PM2MD - Postman to Markdown - v$(VERSION)'
	@ echo ' https://pm2md.com'
	@ echo ''
	@ echo ' Copyright (c) Sebastien Rousseau 2022 - 2023. All rights reserved'
	@ echo ' Licensed under the MIT license'
	@ echo ''
	@ echo '  Usage:'
	@ echo ''
	@ echo '    make <target> [flags...]'
	@ echo ''
	@ echo '  Targets:'
	@ echo ''
	@ awk '/^# @HELP/{ comment = substr($$0, 8) } comment && /^[a-zA-Z][a-zA-Z0-9_-]+ ?:/{ print "   ", $$1, comment }' $(MAKEFILE_LIST) | column -t -s ':' | sort
	@ echo ''
	@ echo '  Flags:'
	@ echo ''
	@ awk '/^# @HELP/{ comment = substr($$0, 8) } comment && /^[a-zA-Z][a-zA-Z0-9_-]+ ?\?=/{ print "   ", $$1, $$2, comment }' $(MAKEFILE_LIST) | column -t -s '?=' | sort
	@ echo ''

.PHONY: pm2md install update build publish deps clean lint lint-fix help doc
