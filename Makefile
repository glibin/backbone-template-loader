
gh-pages:
	rm -f ../backbone-template-loader-gh-pages/js/core.js
	cp core.js ../backbone-template-loader-gh-pages/js/

.PHONY: dist gh-pages