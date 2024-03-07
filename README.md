![Build Status](https://github.com/revolution-robotics/markov-pwgen/actions/workflows/markov-pwgen.yml/badge.svg)

# Markov Chain Password Generator

- [Description](#description)
- [Synopsis](#synopsis)
- [Installation](#installation)
- [Source Installation](#source-installation)
- [MS Windows](#ms-windows)
- [Word List Update](#word-list-update)
- [Examples](#examples)
- [Bugs](#bugs)

## Description

`markov-pwgen` is a JavaScript command-line utility leveraging
[Foswig.js](https://github.com/mrsharpoblunto/foswig.js/)
and
[Piscina](https://github.com/piscinajs/piscina)
libraries to generate memorable passwords derived from a given word
list.

If a word list is not specified during installation, then a list of
words in the language of the default locale is fetched from
[Krypton's Word Lists](https://github.com/kkrypt0nn/wordlists).
Languages oriented from right to left will be supported in a future
release. If the default locale is not supported, then the word list
_/usr/share/dict/web2_ is used if available, otherwise a
[list from Project Gutenberg](https://www.gutenberg.org/files/3201/files/SINGLE.TXT)
is downloaded.

### Changes in v2.2.0
  - Update transliterate option to match tr command when length of
    FROM and TO strings differ.
  - Add option, `--truncate-set1`, to preserve previous transliterate
    behavior.
  - Improve regex implementing capitalization (option `--upperCase`).
  - Improve error handling.
  - Update dependencies.
  - Add standard to devDependencies.
### Changes in V2.1.5
  - Fix URLs of locale-based word lists.
  - Node v20 required for RegExp.prototype.unicodeSets.
  - Introduce locale support.

## Synopsis

```
Usage: markov-pwgen OPTIONS
OPTIONS (defaults are random within the given range):
  --attemptsMax, -a N
           Fail after N attempts to generate chain (default: 100)
  --count, -c N
           Generate N hyphen-delimited passwords (default: [3, 4])
  --dictionary, -d
           Allow dictionary-word passwords (default: false)
  --help, -h
           Print this help, then exit.
  --lengthMin, -n N
           Minimum password length N (default: [4, 6])
  --lengthMax, -m N
           Maximum password length N (default: [7, 13])
  --order, -o N
           Markov order N (default: [3, 4])
  --transliterate, -t FROM,TO
           Replace in password characters of FROM with corresponding
           characters of TO.
  --truncate-set1, -s
           By default, transliteration string TO is extended to
           length of FROM by repeating its last character as necessary.
           This option first truncates FROM to length of TO.
  --upperCase, -u
           Capitalize password components.
  --version, -v
           Print version, then exit.
NB: Lower Markov order yields more random (i.e., less recognizable) words.
```

## Installation

In the following, to use a non-default locale, prefix
the install command with the desired locale, e.g., LANG=fr.

To install from the web, run on the command line:

```bash
npm install -g  markov-pwgen
```

## Source Installation

To install from source, on the command line run:

```bash
git clone https://github.com/revolution-robotics/markov-pwgen
cd ./markov-pwgen
```
and if GNU `make` and JSON parser `jq` are
available, run:

```bash
gmake install
```

Otherwise, run:

```bash
npm pack .
npm install -g ./markov-pwgen-2.2.0.tgz
```

## MS Windows

Do **not** attempt to install `markov-pwgen` with **PowerShell**. If not
already installed, follow the instructions:
[Install NodeJS on Windows](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).
Unless using Windows Subsystem for Linux, install **Git** along with
**Node.js**.  Then, with **Git-Bash** running in Terminal, verify that `node` is
in the command search path, e.g.:

```bash
export PATH=$PATH:'/c/Program Files/nodejs'
```

Now, `markov-pwgen` can be installed as described above.

## Word List Update

Passwords are derived from a filtered version of a given word list. To
filter and deploy an updated or alternative word list, a `gmake` target
is provided in the `markov-pwgen` source:

```bash
gmake update-wordlist WORDLIST=/path-or-url/to/updated-wordlist
```

where */path-or-url/to/updated-wordlist* is the given word list
update.

To change the locale of the word list, use, e.g.:

```bash
LANG=fr gmake update-wordlist
```

## Examples

`markov-pwgen`'s default settings are sufficient for generating
passwords that are secure yet memorable, e.g. the command:

```bash
for i in {1..10}; do
    markov-pwgen
done
```

might produce:

```
cowhead-coastis-identry
Amertab-pentation-leenwine
ergonic-Morchic-unsory-unicize
Centenant-theomalo-wintral
corest-gummless-banision
unadie-briliac-upporian-tobed
smiless-lernalled-repulla-prethic
tranship-waiveting-Hinduped
crustee-dolutered-zoozoop
octable-Amosed-instic-fibric
```

For shorter words, say, between 4 and 6 characters long, lowering the
Markov order helps (at the expense of less "recognizable" words):

```bash
for i in {1..10}; do
    markov-pwgen -n 4 -m 6 -o 2
done
```

produces:

```
gagish-rewhic-subity-chmose
porogy-wairdy-owmate
nised-ectul-whess-scory
efulke-excale-psyced-trear
scrase-dreip-minbus
nomma-jary-porgue
hemet-imagge-mainch-Lyctor
tivion-wity-putsan
Myrlae-firism-kniong-hoodin
spolid-coeod-prodal
```

Command-line option `--transliterate=FROM,TO` replaces in the output
letters of string FROM with corresponding letters of string TO.
Command-line option `--upperCase` capitalizes each "word" component.
Together, these options add more variation in the output. For
instance, the command:

```bash
for i in {1..10}; do
    markov-pwgen -u -t'its,!7$'
done
```

might produce:

```
Furan7$-Beneface-Unance$
Vaccou$-Alvayne$$-$ub$eral-Boozener
Re7ragoe$-Hel!g!on-Dockey!ng
Ammone$-Malac7er-Encoax!n-Verneb
Hered$-Fluced-Coequee-Vo7e!ng
Azoc7a7e-Baboun7er-Federanx
M!lder-Kal!dae-Arch!n!
Febr!d!ne-Econqu!r!ng-Paper$ed-$udor!f!d
Unwrongyl-Cyclo7hurl-Fam!l!7e
Unf!l!zed-Bu$7he$-Predoneure
```

# Bugs

If you feel that `markov-pwgen` could be improved, please consider
creating an issue at:
[markov-pwgen issues](https://github.com/revolution-robotics/markov-pwgen/issues).
