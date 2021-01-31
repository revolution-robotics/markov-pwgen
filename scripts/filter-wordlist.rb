#!/usr/bin/env ruby
#
# @(#) filter-dictionary.rb
#
# This script selects a random subset of words matching a regular
# expression in a wordlist.
#
require 'set'

# For wordlist = '/usr/share/dict/web2', when matching:
#    lowercase words of 3 to 8 chars, word_max <= 76025
#    words of 3 to 8 chars, word_max <= 87585
#    lowercase words of 3 to 9 chars, word_max <= 104857
#    words of 3 to 9 chars, word_max <= 119965
regex = /^[A-Za-z]{3,9}$/
words_max = 119964
alt_wordlist = '/usr/share/dict/words'

wordlist = ARGV[0]

if wordlist.nil? || ! File.exist?(wordlist)
  if ! wordlist.nil?
    STDERR.puts "#{wordlist}: Wordlist unavailable; trying: #{alt_wordlist}"
  end
  wordlist =  alt_wordlist
  if ! File.exist?(wordlist)
    STDERR.puts "#{wordlist}: Wordlist unavailable; Please specify another."
    exit
  end
end

STDERR.puts "Generating dictionary.js from: #{wordlist}."
words = IO.foreach(wordlist).select { |line| line[regex] }.map(&:chomp)

# Take random subset of size words_max.
words = words.shuffle![0 ... words_max] if words.size > words_max

File.open('dictionary.js', 'w') do |f|
  f.write <<EOF
const dict = {
    "words": [
EOF
  words.sort.each { |w| f.write "        \"#{w}\",\n" }
  f.write <<EOF
    ]
};

export { dict };
EOF
end
