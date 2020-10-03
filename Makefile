PROJECT = "substitution-cipher"

all: install

analyze: ;@echo "Analyzing..."; \
	npm run analyze $(ARGS)

decode: ;@echo "Decoding..."; \
	npm run decode $(ARGS)

install: ;@echo "Installing dependencies"; \
	npm install
	@echo "Instructions:"
	@echo ""
	@echo "To decode a file: "
	@echo "make decode ARGS=\"<file path (relative or absolute)>\""
	@echo ""
	@echo "To analyze frequencies:"
	@echo "make analyze ARGS=\"<file path (relative or absolute)>\""

clean : ;
	rm -rf node_modules


.PHONY: install analyze decode clean
