NAME = $(shell jq -r .name package.json)
VERSION = $(shell jq -r .version package.json)

SRCS = Makefile \
	README.md \
	bin/markov-pwgen.js \
	index.js \
	package.json \
	scripts/filter-wordlist.py \
	scripts/filter-wordlist.rb

BINDIR = $(shell type node 2>/dev/null | sed -e 's;[^/]*/;/;' -e 's;/[^/]*$$;;')

ifeq ($(BINDIR),)
BINDIR = /usr/bin
endif

LIBDIR = $(subst /bin,/lib,$(BINDIR))

WORDLIST ?= /usr/share/dict/web2

all: index.js dictionary.js
	npm install

dictionary.js: $(WORDLIST)
	if type ruby >/dev/null 2>&1; then \
		./scripts/filter-wordlist.rb $(WORDLIST); \
	else \
		./scripts/filter-wordlist.py $(WORDLIST); \
	fi

install: all $(NAME)-$(VERSION).tgz
	npm install -g $(NAME)-$(VERSION).tgz

$(NAME)-$(VERSION).tgz: $(SRCS)
	npm pack .

uninstall:
	rm -f $(BINDIR)/$(NAME)
	rm -rf $(LIBDIR)/node_modules/$(NAME)

clean:
	rm -rf *.tgz node_modules dictionary.js package-lock.json yarn.lock *~
