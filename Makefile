all:
	@cp scripts/githooks/* .git/hooks/
	@chmod -R +x .git/hooks/
	@npm install -d

tests := $(shell find ./tests -name '*.test.js')
reporter = dot
opts =
test:
	@rm -rf tests/tmp
	@node_modules/mocha/bin/mocha --reporter ${reporter} --require should ${opts} ${tests}

watch-tests:
	@make test reporter=min opts="--watch ${opts}" tests=${tests}

out = tests/coverage.html
coverage:
	# NOTE: You must have node-jscoverage installed:
	# https://github.com/visionmedia/node-jscoverage
	# The jscoverage npm module and original JSCoverage packages will not work
	@jscoverage lib lib-cov
	@STILL_COVERAGE=1 $(MAKE) test reporter=html-cov > tests/coverage.html
	@rm -rd lib-cov
	@echo
	@echo "Built Report to ${out}"
	@echo

files := $(shell find . -name '*.js' ! -path "*node_modules/*" ! -path "./lib-cov/*")
lint:
	@node_modules/nodelint/nodelint ${files} --config=scripts/config-lint.js

.PHONY: all, lint, test
