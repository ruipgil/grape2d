#!/usr/bin/env python

import argparse
import json
import os
import shutil
import tempfile


def main(argv=None):
	parser = argparse.ArgumentParser()
	parser.add_argument('--include', action='append', required=True)
	parser.add_argument('--minify', action='store_true', default=False)
	parser.add_argument('--output', default='../build/Grape2D.js')

	args = parser.parse_args()

	output = args.output

	fd, path = tempfile.mkstemp()
	tmp = open(path, 'w')
	sources = []

	for include in args.include:
		with open('includes/' + include + '.json','r') as f: files = json.load(f)
		for filename in files:
			sources.append(filename)
			with open(filename, 'r') as f: tmp.write(f.read())

	tmp.close()

	# save

	if args.minify is False:
			shutil.copy(path, output)
			os.chmod(output, 0o664); # temp files would usually get 0600

	else:

		source = ' '.join(sources)
		cmd = 'java -jar compiler/compiler.jar --warning_level=VERBOSE --jscomp_off=globalThis --jscomp_off=checkTypes --language_in=ECMASCRIPT5_STRICT --js %s --js_output_file %s' % (source, output)
		os.system(cmd)

		# header

		with open(output,'r') as f: text = f.read()
		with open(output,'w') as f: f.write('// Grape2D\n' + text)

	os.close(fd)
	os.remove(path)


if __name__ == "__main__":
	main()
