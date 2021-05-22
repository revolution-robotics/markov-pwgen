#!/usr/bin/env python3
#
# @(#) generate-wordlist.py
#
# This script selects a random subset of words matching a regular
# expression in a wordlist.
#
import sys
import os
import random
import re
import shutil
import tempfile
import urllib.request

SCRIPT_NAME = os.path.basename(__file__)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

FILTER_PATTERN = r'^[^"\W]{3,12}$'
WORDS_MAX = 200000
WORDLIST_DEFAULT = '/usr/share/dict/web2'
WORDLIST_ALTERNATE = 'https://www.gutenberg.org/files/3201/files/SINGLE.TXT'

def get_wordlist(uri):
    filename = ''
    if re.match('^https?://', uri):
        print(f'{uri}: Saving to tempfile...')
        with urllib.request.urlopen(uri) as response:
            with tempfile.NamedTemporaryFile(delete = False) as tmp_file:
                shutil.copyfileobj(response, tmp_file)
                filename =  tmp_file.name
    else:
        filename = uri
    return filename


pathname = sys.argv[1] if len(sys.argv) > 1 else WORDLIST_DEFAULT
wordlist = get_wordlist(pathname)

if not os.path.exists(wordlist):
    if wordlist != '':
        print(f'{wordlist}: Not found; trying: {WORDLIST_ALTERNATE}')
    wordlist = get_wordlist(WORDLIST_ALTERNATE)
    if not os.path.exists(wordlist):
        print(f'{wordlist}: Not found; Please specify another.')
        sys.exit()

print(f'Generating dictionary.js from: {wordlist}', file=sys.stderr)
words =  [m.group(0) for line in open(wordlist)
          for m in [re.match(FILTER_PATTERN, line.rstrip())] if m]

if len(words) > WORDS_MAX:

    # Take random subset of size words_max.
    random.shuffle(words)
    words = words[:WORDS_MAX]

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

if re.match(r'/tmp/tmp\w{6,}', wordlist):
    os.unlink(wordlist)
