NAME = $(shell jq -r .name package.json)
VERSION = $(shell jq -r .version package.json)

SRCS = Makefile \
	README.md \
	bin/markov-pwgen.js \
	index.js \
	package.json \
	scripts/filter-wordlist.py

WORDLIST ?= /usr/share/dict/web2

all: index.js dictionary.js

dictionary.js:
	./scripts/filter-wordlist.py $(WORDLIST)

install: all $(NAME)-$(VERSION).tgz
	npm install -g $(NAME)-$(VERSION).tgz

$(NAME)-$(VERSION).tgz: $(SRCS)
	npm pack .

clean:
	rm -rf *.tgz node_modules dictionary.js package-lock.json yarn.lock *~
