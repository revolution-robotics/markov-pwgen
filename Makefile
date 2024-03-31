BUILD_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))
NAME = $(shell jq -r .name $(BUILD_DIR)package.json)
VERSION = $(shell jq -r .version $(BUILD_DIR)package.json)

SRCS =	$(BUILD_DIR).github/workflows/markov-pwgen.yml \
	$(BUILD_DIR)Makefile \
	$(BUILD_DIR)README.md \
	$(BUILD_DIR)bin/markov-pwgen.js \
	$(BUILD_DIR)index.js \
	$(BUILD_DIR)lib/random64.js \
	$(BUILD_DIR)lib/utils.js \
	$(BUILD_DIR)package.json \
	$(BUILD_DIR)scripts/filter-wordlist.js

.PHONY: all install install-local uninstall update-wordlist wordlist publish

all: $(BUILD_DIR)$(NAME)-$(VERSION).tgz

install: all
	npm install -g $(BUILD_DIR)$(NAME)-$(VERSION).tgz

install-local:
	npm install

uninstall:
	npm uninstall -g $(NAME)

$(BUILD_DIR)$(NAME)-$(VERSION).tgz: $(SRCS)
	npm pack $(BUILD_DIR)

check test: install-local
	npm run test

update-wordlist: wordlist
	npm run update-wordlist

wordlist: $(WORDLIST)
	npm run filter-wordlist -- $(WORDLIST)

publish: clean all
	npm publish $(BUILD_DIR)$(NAME)-$(VERSION).tgz

clean:
	rm -rf $(BUILD_DIR)*.tgz $(BUILD_DIR)node_modules $(BUILD_DIR)lib/word-list.js $(BUILD_DIR)*~
