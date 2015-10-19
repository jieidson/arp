export PATH := $(shell pwd)/node_modules/.bin:$(PATH)

.PHONY: build clean deps server npminstall bowerinstall tsdinstall outdated

build:
	gulp

clean:
	gulp clean

serve:
	gulp serve

deps:
	npm install
	bower --force-latest update
	tsd update

npminstall:
	npm install --save-dev --save-exact $(PKG)

bowerinstall:
	bower install --save --save-exact $(PKG)

tsdinstall:
	tsd install --save $(PKG)

outdated:
	npm outdated
	bower list | grep 'latest is'
