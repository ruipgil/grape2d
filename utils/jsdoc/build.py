import argparse
import json
import os


def main(argv=None):
	parser = argparse.ArgumentParser()
	parser.add_argument('--include', action='append', required=True)
	parser.add_argument('--conf', default='./')

	args = parser.parse_args()

	# include into string
	print(' * Building sources')

	sources = []

	for include in args.include:
		with open('./includes/' + include + '.json','r') as f: files = json.load(f)
		for filename in files:
			sources.append(filename)

	sourcesStr = ' '.join(sources)
	print(' * Sources are "'+sourcesStr+'"')
	print(' * Generating jsdoc')

	cmd = 'jsdoc -c '+args.conf+' '+sourcesStr
	print(cmd)
	os.system(cmd)

if __name__ == "__main__":
	main()
