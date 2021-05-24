#!/usr/bin/env python3
#
# @(#) filter-wordlist.py
#
# This script selects a random subset of words matching a regular
# expression in a wordlist.
#
import atexit
import os
import random
import re
import shutil
import sys
import ssl
import tempfile
import urllib.request

SCRIPT_NAME = os.path.basename(__file__)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

FILTER_PATTERN = r'^[^"\W]{3,12}$'
WORDS_MAX = 200000
WORDLIST_DEFAULT = '/usr/share/dict/web2'
WORDLIST_ALTERNATE = 'https://www.gutenberg.org/files/3201/files/SINGLE.TXT'

def get_wordlist(uri, context):
    filename = ''
    if re.match('^https?://', uri):
        print(f'{uri}: Saving to tempfile...')
        ssl._create_default_https_context = context
        with urllib.request.urlopen(uri) as response:
            with tempfile.NamedTemporaryFile(delete = False) as tmp_file:
                shutil.copyfileobj(response, tmp_file)
                filename =  tmp_file.name
    else:
        filename = uri
    return filename

def validate_wordlist(uri, context):
    filename = get_wordlist(uri, context)

    if not os.path.exists(filename):
        if filename != '':
            print(f'{filename}: Not found; trying: {WORDLIST_ALTERNATE}')
        filename = get_wordlist(WORDLIST_ALTERNATE, context)
        if not os.path.exists(filename):
            print(f'{filename}: Not found; Please specify another.')
            sys.exit()
    return filename

def clean_up(filename):
    if re.match(r'/tmp/tmp\w{6,}', filename):
        os.unlink(filename)

source = sys.argv[1] if len(sys.argv) > 1 else WORDLIST_DEFAULT

try:
    wordlist = validate_wordlist(source, ssl.create_default_context)
except urllib.error.URLError:
    print('SSL certificate verification failure - disabling verification')
    wordlist = validate_wordlist(source, ssl._create_unverified_context)

atexit.register(clean_up, wordlist)

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
