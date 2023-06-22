# Markov Chain Password Generator

`markov-pwgen` is a JavaScript command-line utility leveraging
[Foswig.js](https://github.com/mrsharpoblunto/foswig.js/) and
[Piscina](https://github.com/piscinajs/piscina) libraries
to generate memorable passwords derived from a given word list.

Version 2.0.0 adds a number of improvements, but the command-line
interface is not compatible with previous versions.

If _/usr/share/dict/web2_ exists, it is used as the default word list.
Otherwise, a
[word list from Project Gutenberg](https://www.gutenberg.org/files/3201/files/SINGLE.TXT) is downloaded.

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
  --lengthMin=N, -nN
           Maximum password length N (default: [4, 7))
  --lengthMax=N, -mN
           Minimum password length N (default: [7, 12))
  --order=N, -oN
           Markov order N (default: [3, 5))
  --transliterate=S,T, -tS,T
           Replace in password characters of S with corresponding
           characters of T.
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
make install
```

Otherwise, run:

```
npm pack .
npm install -g ./markov-pwgen-2.0.0.tgz
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
Markov order helps:

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

To be add additional characters to the output:

```bash
for i in {1..10}; do
    markov-pwgen -t'-e,_3'
done
```

Here, hyphens (-) are replaced with underscores (_) and small letter e
with the number three (3):

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
