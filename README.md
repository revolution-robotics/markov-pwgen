# Markov Chain Password Generator

`markov-pwgen` is a JavaScript command-line utility that leverages
the [Foswig.js](https://github.com/mrsharpoblunto/foswig.js/) library
to generate memorable passwords.

## Synopsis

```
Usage: markov-pwgen OPTIONS
OPTIONS (defaults are random within the given range):
  --count=N         Generate N hyphen-delimited passwords (default: 2)
  --order=N         Specify Markov chain order (default: 3 or 4)
  --minLength=N     Minimum password length (default: 3 or 4)
  --maxLength=N     Maximum password length (default: 6 or 7)
  --maxAttempts=N   Fail after N attempts to generate chain (default: 100)
  --allowDuplicates Allow dictionary passwords (default: false)
```

## Installation

To install from the web, run on the command line:
```
npm install -g  markov-pwgen
```

To install from source, if GNU `make` and the JSON parser `jq` are
available, run:
```
make install
```

Otherwise, run:
```
npm pack .
npm install -g *.tgz
```
