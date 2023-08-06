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
libraries to generate memorable passwords derived a given word list.

If a word list is not specified during installation, then the detected
language settings of the local computer are used to fetch a list of
words in the corresponding language from
[Krypton's Word Lists](https://github.com/kkrypt0nn/wordlists).
Languages oriented from right to left will be supported in a future release.
If a suitable word list is not found, then _/usr/share/dict/web2_ is
used if available, otherwise a
[list from Project Gutenberg](https://www.gutenberg.org/files/3201/files/SINGLE.TXT)
is downloaded.

- Version 2.1.0   Fix the word list parser. Introduce locale support.

## Synopsis

```
Usage: markov-pwgen OPTIONS
OPTIONS (defaults are random within the given range):
  --attemptsMax=N, -aN
           Fail after N attempts to generate chain (default: 100)
  --count=N, -cN
           Generate N hyphen-delimited passwords (default: [3, 5))
  --dictionary, -d
           Allow dictionary passwords (default: false)
  --help, -h
           Print this help, then exit.
  --lengthMin=N, -nN
           Minimum password length N (default: [4, 7))
  --lengthMax=N, -mN
           Maximum password length N (default: [7, 14))
  --order=N, -oN
           Markov order N (default: [3, 5))
  --transliterate=S,T, -tS,T
           Replace in password characters of S with corresponding
           characters of T.
  --version, -v
           Print version, then exit.
NB: Lower Markov order yields more random (i.e., less recognizable) words.
```

## Installation

To install from the web, run on the command line:

```bash
npm install -g  markov-pwgen
```

or to use a non-default locale, try, e.g.:

```bash
LANG=fr npm install -g  markov-pwgen
```

though only a few of the locales in */usr/share/locale* are currently
supported.

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
npm install -g ./markov-pwgen-2.1.0.tgz
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

The command-line option `--transliterate=S,T` replaces in the
password letters from the string S with the corresponding
letters from string T. This can be used to add more characters to the
output.  For instance, the command:

```bash
for i in {1..10}; do
    markov-pwgen -t'-e,_3'
done
```

replaces hyphens (-) and small letter e's with underscores (_) and
threes (3), respectively:

```
cr3ship_whalogic_lithbr33t
nasokabl3_rooth3r3d_b3payano
damasian_acull3t3_spankind_vulcat3
3pictop_unquium_incardy
r3nously_monoddl3ss_zoantian
3xondon_trumi3_pig3r3d
Cycl3a_3nf3ity_Torima_wously
m3gat3l3s_sh3b3rit3_aph3cial
Caps3r_polyd3sic_r3v3rt3l
sansiv3_Solpus_r3bl3d_3mbarg3
```

# Bugs
Please submit questions or bug reports to
[markov-pwgen issues](https://github.com/revolution-robotics/markov-pwgen/issues).
