#!/usr/bin/env python3
#
# @(#) filter-wordlist.py
#
# This script selects a random subset of words matching a regular
# expression in a wordlist.
#
import sys, os, random, re

# For wordlist = '/usr/share/dict/web2', when matching:
#    lowercase words of 3 to 8 chars, word_max <= 76025
#    words of 3 to 8 chars, word_max <= 87585
#    lowercase words of 3 to 9 chars, word_max <= 104857
#    words of 3 to 9 chars, word_max <= 119965
regex = r'^[A-Za-z]{3,9}$'
words_max = 119964

wordlist = sys.argv[1] if len(sys.argv) > 1 else ''

if not os.path.exists(wordlist):
    wordlist = '/usr/share/dict/web2'
    print(f'Attempting to use dictionary: {wordlist}', file=sys.stderr)
    if not os.path.exists(wordlist):
        print(f'{wordlist}: Dictionary unavailable; Please specify a dictionary.', file=sys.stderr)
        sys.exit()

words = [m.group(0) for line in open(wordlist) for m in [re.match(regex, line)] if m]

if len(words) > words_max:

    # Take random subset of size words_max.
    random.shuffle(words)
    words = words[:words_max]

with open('dictionary.js', 'w') as f:
    f.write('''const dict = {
    "words": [
''')
    for word in sorted(words):
        f.write(f'        "{word}",\n')
    f.write('''    ]
};

export { dict };
''')
