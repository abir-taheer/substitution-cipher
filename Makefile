PROJECT = "substitution-cipher"
all: build help

analyze:
	$(info ***** ANALYZING FILE *****)
	npm run analyze $(ARGS)

decode:
	$(info ***** DECODING FILE *****)
	npm run decode $(ARGS)

build:
	$(info ***** INSTALLING DEPENDENCIES *****)
	npm install

help:
	$(info ***** INSTRUCTIONS *****)
	@echo "The first time you run the program, install dependencies by running:"
	@echo "make build"
	@echo ""
	@echo "To decode a file: "
	@echo "make decode ARGS=\"<file path (relative or absolute)>\""
	@echo ""
	@echo "To analyze frequencies:"
	@echo "make analyze ARGS=\"<file path (relative or absolute)>\""

clean:
	$(info ***** REMOVING DEPENDENCIES *****)
	rm -rf node_modules


.PHONY: install analyze decode clean
.SECONDARY: install
