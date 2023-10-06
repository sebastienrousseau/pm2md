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

#
# Build tasks
#

# @HELP Install.
install:
	@echo
	@echo "Installing..."
	npx pnpm install

# @HELP npx check updates.
update:
	@echo
	@echo "Checking npx updates..."
	npx npm-check-updates -u

# @HELP Build.
build:
	@echo
	@echo "Building..."
	rm -rf dist
	npx pnpm run build

# @HELP Publish.
publish:
	@echo
	@echo "Publishing pm2md..."
	npx publish

# @HELP node_modules.
deps: package.json
	npx pnpm install

#
# Clean up tasks
#

# @HELP Run directory clean.
clean:
	@rm -rf node_modules

# @HELP Run eslint.
lint:
	@echo
	@echo "Running eslint..."
	npx eslint .

# Display the help menu.
help:
	@ echo
	@ echo '  ___ __  __ ___ __  __ ___'
	@ echo ' | _ \  \/  |_  )  \/  |   \'
	@ echo ' |  _/ |\/| |/ /| |\/| | |) |'
	@ echo ' |_| |_|  |_/___|_|  |_|___/'
	@ echo ''
	@ echo ' PM2MD - Postman to Markdown'
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
	@ awk '/^# @HELP/{ comment = substr($$0, 7) } comment && /^[a-zA-Z][a-zA-Z0-9_-]+ ?:/{ print "   ", $$1, comment }' $(MAKEFILE_LIST) | column -t -s ':' | sort
	@ echo ''
	@ echo '  Flags:'
	@ echo ''
	@ awk '/^# @HELP/{ comment = substr($$0, 7) } comment && /^[a-zA-Z][a-zA-Z0-9_-]+ ?\?=/{ print "   ", $$1, $$2, comment }' $(MAKEFILE_LIST) | column -t -s '?=' | sort
	@ echo ''



.PHONY: install update build publish deps clean lint help
