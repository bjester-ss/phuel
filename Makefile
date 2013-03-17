#
# Run all tests
#

tester = mocha

test:
	@NODE_PATH=./lib:$NODE_PATH $(tester) -R spec test/lib/*/*

check: test

.PHONY: test