# Markov Chain Password Generator

- [Description](#description)
- [Synopsis](#synopsis)
- [Installation](#installation)
- [MS Windows](#ms-windows)
- [Examples](#examples)

## Description

`markov-pwgen` is a JavaScript command-line utility leveraging
[Foswig.js](https://github.com/mrsharpoblunto/foswig.js/)
and
[Piscina](https://github.com/piscinajs/piscina)
libraries to generate memorable passwords derived from a given word
list.

If _/usr/share/dict/web2_ exists, it is used as the default word list.
Otherwise, a
[word list from Project Gutenberg](https://www.gutenberg.org/files/3201/files/SINGLE.TXT)
is downloaded.

- Version 2.0.8 Use a faster loop.
- Version 2.0.7 MS Windows support.
- Version 2.0.6 Limit thread count.
- Version 2.0.5 Code clean up.
- Version 2.0.4 Markdown formatting.
- Version 2.0.3 Bugfix.
- Version 2.0.2 Use cryptographically secure random number generator.
- Version 2.0.0 Implement parallel execution, replace minimist and add new
                command line options.

## Synopsis

```
Usage: markov-pwgen.js OPTIONS
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

```
npm install -g  markov-pwgen
```

To install from source:

```
git clone https://github.com/revolution-robotics/markov-pwgen
cd ./markov-pwgen
```

and if GNU `make` and the JSON parser `jq` are
available, run:

```
gmake install
```

Otherwise, run:

```
npm pack .
npm install -g ./markov-pwgen-2.0.8.tgz
```

## MS Windows

Do **not** attempt to install `markov-pwgen` with **PowerShell**. If not
already installed, follow the instructions:
[Install NodeJS on Windows](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows#install-git).
Unless using Windows Subsystem for Linux, install **Git** along with
**Node.js**.  Then, with **Git-Bash** running in Terminal, verify that `node` is
in the command search path, e.g.:

```bash
export PATH=$PATH:'/c/Program Files/nodejs'
```

Now, `markov-pwgen` can be installed as described above.

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
