BUILD_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))
NAME = $(shell jq -r .name $(BUILD_DIR)package.json)
VERSION = $(shell jq -r .version $(BUILD_DIR)package.json)

SRCS =  $(BUILD_DIR)Makefile \
	$(BUILD_DIR)README.md \
	$(BUILD_DIR)bin/markov-pwgen.js \
	$(BUILD_DIR)index.js \
	$(BUILD_DIR)lib/random64.js \
	$(BUILD_DIR)package.json \
	$(BUILD_DIR)scripts/filter-wordlist.py

WORDLIST ?= /usr/share/dict/web2

all: $(BUILD_DIR)$(NAME)-$(VERSION).tgz

install: all
	npm install -g $(BUILD_DIR)$(NAME)-$(VERSION).tgz

uninstall:
	npm uninstall -g $(NAME)

$(BUILD_DIR)$(NAME)-$(VERSION).tgz:
	npm pack $(BUILD_DIR)

publish: clean all
	npm publish $(BUILD_DIR)$(NAME)-$(VERSION).tgz

clean:
	rm -rf $(BUILD_DIR)*.tgz $(BUILD_DIR)node_modules $(BUILD_DIR)lib/dictionary.js $(BUILD_DIR)package-lock.json  $(BUILD_DIR)*~
