#!/usr/bin/env python

import argparse
import json
import os
import shutil
import tempfile


def main(argv=None):
	parser = argparse.ArgumentParser()
	parser.add_argument('--include', action='append', required=True)
	parser.add_argument('--version', action='append', required=True)
	parser.add_argument('--vernum', action='append', required=True)

	args = parser.parse_args()


if __name__ == "__main__":
	main()
