NAME = $(shell jq -r .name package.json)
VERSION = $(shell jq -r .version package.json)

SRCS = Makefile \
	README.md \
	bin/markov-pwgen.js \
	index.js \
	lib/random64.js \
	lib/zip.js \
	package.json \
	scripts/filter-wordlist.py

WORDLIST ?= /usr/share/dict/web2

all: lib/dictionary.js $(NAME)-$(VERSION).tgz

lib/dictionary.js:
	./scripts/filter-wordlist.py $(WORDLIST)

install: all
	npm install -g $(NAME)-$(VERSION).tgz

uninstall:
	npm uninstall -g $(NAME)

$(NAME)-$(VERSION).tgz: $(SRCS)
	npm pack .

publish: clean all
	npm publish $(NAME)-$(VERSION).tgz

clean:
	rm -rf *.tgz node_modules lib/dictionary.js package-lock.json yarn.lock *~
