#
# Run all tests
#

tester = mocha

test:
	@NODE_PATH=./lib:$NODE_PATH $(tester) -R spec --globals TEST test/unit/lib/*/*

check: test

.PHONY: test
