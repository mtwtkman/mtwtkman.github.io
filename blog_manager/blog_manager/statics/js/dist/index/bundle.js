/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate, global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function () {
	"use strict";

	function Vnode(tag, key, attrs0, children, text, dom) {
		return { tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false };
	}
	Vnode.normalize = function (node) {
		if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined);
		if (node != null && (typeof node === "undefined" ? "undefined" : _typeof(node)) !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined);
		return node;
	};
	Vnode.normalizeChildren = function normalizeChildren(children) {
		for (var i = 0; i < children.length; i++) {
			children[i] = Vnode.normalize(children[i]);
		}
		return children;
	};
	var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g;
	var selectorCache = {};
	var hasOwn = {}.hasOwnProperty;
	function compileSelector(selector) {
		var match,
		    tag = "div",
		    classes = [],
		    attrs = {};
		while (match = selectorParser.exec(selector)) {
			var type = match[1],
			    value = match[2];
			if (type === "" && value !== "") tag = value;else if (type === "#") attrs.id = value;else if (type === ".") classes.push(value);else if (match[3][0] === "[") {
				var attrValue = match[6];
				if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\");
				if (match[4] === "class") classes.push(attrValue);else attrs[match[4]] = attrValue || true;
			}
		}
		if (classes.length > 0) attrs.className = classes.join(" ");
		return selectorCache[selector] = { tag: tag, attrs: attrs };
	}
	function execSelector(state, attrs, children) {
		var hasAttrs = false,
		    childList,
		    text;
		var className = attrs.className || attrs.class;
		for (var key in state.attrs) {
			if (hasOwn.call(state.attrs, key)) {
				attrs[key] = state.attrs[key];
			}
		}
		if (className != null) {
			if (attrs.class != null) {
				attrs.class = undefined;
				attrs.className = className;
			}
			if (state.attrs.className != null) {
				attrs.className = state.attrs.className + " " + className;
			}
		}
		for (var key in attrs) {
			if (hasOwn.call(attrs, key) && key !== "key") {
				hasAttrs = true;
				break;
			}
		}
		if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
			text = children[0].children;
		} else {
			childList = children;
		}
		return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text);
	}
	function hyperscript(selector) {
		// Because sloppy mode sucks
		var attrs = arguments[1],
		    start = 2,
		    children;
		if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
			throw Error("The selector must be either a string or a component.");
		}
		if (typeof selector === "string") {
			var cached = selectorCache[selector] || compileSelector(selector);
		}
		if (!attrs) {
			attrs = {};
		} else if ((typeof attrs === "undefined" ? "undefined" : _typeof(attrs)) !== "object" || attrs.tag != null || Array.isArray(attrs)) {
			attrs = {};
			start = 1;
		}
		if (arguments.length === start + 1) {
			children = arguments[start];
			if (!Array.isArray(children)) children = [children];
		} else {
			children = [];
			while (start < arguments.length) {
				children.push(arguments[start++]);
			}
		}
		var normalized = Vnode.normalizeChildren(children);
		if (typeof selector === "string") {
			return execSelector(cached, attrs, normalized);
		} else {
			return Vnode(selector, attrs.key, attrs, normalized);
		}
	}
	hyperscript.trust = function (html) {
		if (html == null) html = "";
		return Vnode("<", undefined, undefined, html, undefined, undefined);
	};
	hyperscript.fragment = function (attrs1, children) {
		return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined);
	};
	var m = hyperscript;
	/** @constructor */
	var PromisePolyfill = function PromisePolyfill(executor) {
		if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`");
		if (typeof executor !== "function") throw new TypeError("executor must be a function");
		var self = this,
		    resolvers = [],
		    rejectors = [],
		    resolveCurrent = handler(resolvers, true),
		    rejectCurrent = handler(rejectors, false);
		var instance = self._instance = { resolvers: resolvers, rejectors: rejectors };
		var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout;
		function handler(list, shouldAbsorb) {
			return function execute(value) {
				var then;
				try {
					if (shouldAbsorb && value != null && ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
						if (value === self) throw new TypeError("Promise can't be resolved w/ itself");
						executeOnce(then.bind(value));
					} else {
						callAsync(function () {
							if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value);
							for (var i = 0; i < list.length; i++) {
								list[i](value);
							}resolvers.length = 0, rejectors.length = 0;
							instance.state = shouldAbsorb;
							instance.retry = function () {
								execute(value);
							};
						});
					}
				} catch (e) {
					rejectCurrent(e);
				}
			};
		}
		function executeOnce(then) {
			var runs = 0;
			function run(fn) {
				return function (value) {
					if (runs++ > 0) return;
					fn(value);
				};
			}
			var onerror = run(rejectCurrent);
			try {
				then(run(resolveCurrent), onerror);
			} catch (e) {
				onerror(e);
			}
		}
		executeOnce(executor);
	};
	PromisePolyfill.prototype.then = function (onFulfilled, onRejection) {
		var self = this,
		    instance = self._instance;
		function handle(callback, list, next, state) {
			list.push(function (value) {
				if (typeof callback !== "function") next(value);else try {
					resolveNext(callback(value));
				} catch (e) {
					if (rejectNext) rejectNext(e);
				}
			});
			if (typeof instance.retry === "function" && state === instance.state) instance.retry();
		}
		var resolveNext, rejectNext;
		var promise = new PromisePolyfill(function (resolve, reject) {
			resolveNext = resolve, rejectNext = reject;
		});
		handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false);
		return promise;
	};
	PromisePolyfill.prototype.catch = function (onRejection) {
		return this.then(null, onRejection);
	};
	PromisePolyfill.resolve = function (value) {
		if (value instanceof PromisePolyfill) return value;
		return new PromisePolyfill(function (resolve) {
			resolve(value);
		});
	};
	PromisePolyfill.reject = function (value) {
		return new PromisePolyfill(function (resolve, reject) {
			reject(value);
		});
	};
	PromisePolyfill.all = function (list) {
		return new PromisePolyfill(function (resolve, reject) {
			var total = list.length,
			    count = 0,
			    values = [];
			if (list.length === 0) resolve([]);else for (var i = 0; i < list.length; i++) {
				(function (i) {
					function consume(value) {
						count++;
						values[i] = value;
						if (count === total) resolve(values);
					}
					if (list[i] != null && (_typeof(list[i]) === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
						list[i].then(consume, reject);
					} else consume(list[i]);
				})(i);
			}
		});
	};
	PromisePolyfill.race = function (list) {
		return new PromisePolyfill(function (resolve, reject) {
			for (var i = 0; i < list.length; i++) {
				list[i].then(resolve, reject);
			}
		});
	};
	if (typeof window !== "undefined") {
		if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill;
		var PromisePolyfill = window.Promise;
	} else if (typeof global !== "undefined") {
		if (typeof global.Promise === "undefined") global.Promise = PromisePolyfill;
		var PromisePolyfill = global.Promise;
	} else {}
	var buildQueryString = function buildQueryString(object) {
		if (Object.prototype.toString.call(object) !== "[object Object]") return "";
		var args = [];
		for (var key0 in object) {
			destructure(key0, object[key0]);
		}
		return args.join("&");
		function destructure(key0, value) {
			if (Array.isArray(value)) {
				for (var i = 0; i < value.length; i++) {
					destructure(key0 + "[" + i + "]", value[i]);
				}
			} else if (Object.prototype.toString.call(value) === "[object Object]") {
				for (var i in value) {
					destructure(key0 + "[" + i + "]", value[i]);
				}
			} else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""));
		}
	};
	var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i");
	var _8 = function _8($window, Promise) {
		var callbackCount = 0;
		var oncompletion;
		function setCompletionCallback(callback) {
			oncompletion = callback;
		}
		function finalizer() {
			var count = 0;
			function complete() {
				if (--count === 0 && typeof oncompletion === "function") oncompletion();
			}
			return function finalize(promise0) {
				var then0 = promise0.then;
				promise0.then = function () {
					count++;
					var next = then0.apply(promise0, arguments);
					next.then(complete, function (e) {
						complete();
						if (count === 0) throw e;
					});
					return finalize(next);
				};
				return promise0;
			};
		}
		function normalize(args, extra) {
			if (typeof args === "string") {
				var url = args;
				args = extra || {};
				if (args.url == null) args.url = url;
			}
			return args;
		}
		function request(args, extra) {
			var finalize = finalizer();
			args = normalize(args, extra);
			var promise0 = new Promise(function (resolve, reject) {
				if (args.method == null) args.method = "GET";
				args.method = args.method.toUpperCase();
				var useBody = args.method === "GET" || args.method === "TRACE" ? false : typeof args.useBody === "boolean" ? args.useBody : true;
				if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function (value) {
					return value;
				} : JSON.stringify;
				if (typeof args.deserialize !== "function") args.deserialize = deserialize;
				if (typeof args.extract !== "function") args.extract = extract;
				args.url = interpolate(args.url, args.data);
				if (useBody) args.data = args.serialize(args.data);else args.url = assemble(args.url, args.data);
				var xhr = new $window.XMLHttpRequest(),
				    aborted = false,
				    _abort = xhr.abort;
				xhr.abort = function abort() {
					aborted = true;
					_abort.call(xhr);
				};
				xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined);
				if (args.serialize === JSON.stringify && useBody) {
					xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				}
				if (args.deserialize === deserialize) {
					xhr.setRequestHeader("Accept", "application/json, text/*");
				}
				if (args.withCredentials) xhr.withCredentials = args.withCredentials;
				for (var key in args.headers) {
					if ({}.hasOwnProperty.call(args.headers, key)) {
						xhr.setRequestHeader(key, args.headers[key]);
					}
				}if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr;
				xhr.onreadystatechange = function () {
					// Don't throw errors on xhr.abort().
					if (aborted) return;
					if (xhr.readyState === 4) {
						try {
							var response = args.extract !== extract ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args));
							if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
								resolve(cast(args.type, response));
							} else {
								var error = new Error(xhr.responseText);
								for (var key in response) {
									error[key] = response[key];
								}reject(error);
							}
						} catch (e) {
							reject(e);
						}
					}
				};
				if (useBody && args.data != null) xhr.send(args.data);else xhr.send();
			});
			return args.background === true ? promise0 : finalize(promise0);
		}
		function jsonp(args, extra) {
			var finalize = finalizer();
			args = normalize(args, extra);
			var promise0 = new Promise(function (resolve, reject) {
				var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++;
				var script = $window.document.createElement("script");
				$window[callbackName] = function (data) {
					script.parentNode.removeChild(script);
					resolve(cast(args.type, data));
					delete $window[callbackName];
				};
				script.onerror = function () {
					script.parentNode.removeChild(script);
					reject(new Error("JSONP request failed"));
					delete $window[callbackName];
				};
				if (args.data == null) args.data = {};
				args.url = interpolate(args.url, args.data);
				args.data[args.callbackKey || "callback"] = callbackName;
				script.src = assemble(args.url, args.data);
				$window.document.documentElement.appendChild(script);
			});
			return args.background === true ? promise0 : finalize(promise0);
		}
		function interpolate(url, data) {
			if (data == null) return url;
			var tokens = url.match(/:[^\/]+/gi) || [];
			for (var i = 0; i < tokens.length; i++) {
				var key = tokens[i].slice(1);
				if (data[key] != null) {
					url = url.replace(tokens[i], data[key]);
				}
			}
			return url;
		}
		function assemble(url, data) {
			var querystring = buildQueryString(data);
			if (querystring !== "") {
				var prefix = url.indexOf("?") < 0 ? "?" : "&";
				url += prefix + querystring;
			}
			return url;
		}
		function deserialize(data) {
			try {
				return data !== "" ? JSON.parse(data) : null;
			} catch (e) {
				throw new Error(data);
			}
		}
		function extract(xhr) {
			return xhr.responseText;
		}
		function cast(type0, data) {
			if (typeof type0 === "function") {
				if (Array.isArray(data)) {
					for (var i = 0; i < data.length; i++) {
						data[i] = new type0(data[i]);
					}
				} else return new type0(data);
			}
			return data;
		}
		return { request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback };
	};
	var requestService = _8(window, PromisePolyfill);
	var coreRenderer = function coreRenderer($window) {
		var $doc = $window.document;
		var $emptyFragment = $doc.createDocumentFragment();
		var onevent;
		function setEventCallback(callback) {
			return onevent = callback;
		}
		//create
		function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
			for (var i = start; i < end; i++) {
				var vnode = vnodes[i];
				if (vnode != null) {
					createNode(parent, vnode, hooks, ns, nextSibling);
				}
			}
		}
		function createNode(parent, vnode, hooks, ns, nextSibling) {
			var tag = vnode.tag;
			if (typeof tag === "string") {
				vnode.state = {};
				if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks);
				switch (tag) {
					case "#":
						return createText(parent, vnode, nextSibling);
					case "<":
						return createHTML(parent, vnode, nextSibling);
					case "[":
						return createFragment(parent, vnode, hooks, ns, nextSibling);
					default:
						return createElement(parent, vnode, hooks, ns, nextSibling);
				}
			} else return createComponent(parent, vnode, hooks, ns, nextSibling);
		}
		function createText(parent, vnode, nextSibling) {
			vnode.dom = $doc.createTextNode(vnode.children);
			insertNode(parent, vnode.dom, nextSibling);
			return vnode.dom;
		}
		function createHTML(parent, vnode, nextSibling) {
			var match1 = vnode.children.match(/^\s*?<(\w+)/im) || [];
			var parent1 = { caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup" }[match1[1]] || "div";
			var temp = $doc.createElement(parent1);
			temp.innerHTML = vnode.children;
			vnode.dom = temp.firstChild;
			vnode.domSize = temp.childNodes.length;
			var fragment = $doc.createDocumentFragment();
			var child;
			while (child = temp.firstChild) {
				fragment.appendChild(child);
			}
			insertNode(parent, fragment, nextSibling);
			return fragment;
		}
		function createFragment(parent, vnode, hooks, ns, nextSibling) {
			var fragment = $doc.createDocumentFragment();
			if (vnode.children != null) {
				var children = vnode.children;
				createNodes(fragment, children, 0, children.length, hooks, null, ns);
			}
			vnode.dom = fragment.firstChild;
			vnode.domSize = fragment.childNodes.length;
			insertNode(parent, fragment, nextSibling);
			return fragment;
		}
		function createElement(parent, vnode, hooks, ns, nextSibling) {
			var tag = vnode.tag;
			switch (vnode.tag) {
				case "svg":
					ns = "http://www.w3.org/2000/svg";break;
				case "math":
					ns = "http://www.w3.org/1998/Math/MathML";break;
			}
			var attrs2 = vnode.attrs;
			var is = attrs2 && attrs2.is;
			var element = ns ? is ? $doc.createElementNS(ns, tag, { is: is }) : $doc.createElementNS(ns, tag) : is ? $doc.createElement(tag, { is: is }) : $doc.createElement(tag);
			vnode.dom = element;
			if (attrs2 != null) {
				setAttrs(vnode, attrs2, ns);
			}
			insertNode(parent, element, nextSibling);
			if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
				setContentEditable(vnode);
			} else {
				if (vnode.text != null) {
					if (vnode.text !== "") element.textContent = vnode.text;else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)];
				}
				if (vnode.children != null) {
					var children = vnode.children;
					createNodes(element, children, 0, children.length, hooks, null, ns);
					setLateAttrs(vnode);
				}
			}
			return element;
		}
		function initComponent(vnode, hooks) {
			var sentinel;
			if (typeof vnode.tag.view === "function") {
				vnode.state = Object.create(vnode.tag);
				sentinel = vnode.state.view;
				if (sentinel.$$reentrantLock$$ != null) return $emptyFragment;
				sentinel.$$reentrantLock$$ = true;
			} else {
				vnode.state = void 0;
				sentinel = vnode.tag;
				if (sentinel.$$reentrantLock$$ != null) return $emptyFragment;
				sentinel.$$reentrantLock$$ = true;
				vnode.state = vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function" ? new vnode.tag(vnode) : vnode.tag(vnode);
			}
			vnode._state = vnode.state;
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks);
			initLifecycle(vnode._state, vnode, hooks);
			vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode));
			if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument");
			sentinel.$$reentrantLock$$ = null;
		}
		function createComponent(parent, vnode, hooks, ns, nextSibling) {
			initComponent(vnode, hooks);
			if (vnode.instance != null) {
				var element = createNode(parent, vnode.instance, hooks, ns, nextSibling);
				vnode.dom = vnode.instance.dom;
				vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0;
				insertNode(parent, element, nextSibling);
				return element;
			} else {
				vnode.domSize = 0;
				return $emptyFragment;
			}
		}
		//update
		function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
			if (old === vnodes || old == null && vnodes == null) return;else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, undefined);else if (vnodes == null) removeNodes(old, 0, old.length, vnodes);else {
				if (old.length === vnodes.length) {
					var isUnkeyed = false;
					for (var i = 0; i < vnodes.length; i++) {
						if (vnodes[i] != null && old[i] != null) {
							isUnkeyed = vnodes[i].key == null && old[i].key == null;
							break;
						}
					}
					if (isUnkeyed) {
						for (var i = 0; i < old.length; i++) {
							if (old[i] === vnodes[i]) continue;else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling));else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes);else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns);
						}
						return;
					}
				}
				recycling = recycling || isRecyclable(old, vnodes);
				if (recycling) {
					var pool = old.pool;
					old = old.concat(old.pool);
				}
				var oldStart = 0,
				    start = 0,
				    oldEnd = old.length - 1,
				    end = vnodes.length - 1,
				    map;
				while (oldEnd >= oldStart && end >= start) {
					var o = old[oldStart],
					    v = vnodes[start];
					if (o === v && !recycling) oldStart++, start++;else if (o == null) oldStart++;else if (v == null) start++;else if (o.key === v.key) {
						var shouldRecycle = pool != null && oldStart >= old.length - pool.length || pool == null && recycling;
						oldStart++, start++;
						updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns);
						if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling);
					} else {
						var o = old[oldEnd];
						if (o === v && !recycling) oldEnd--, start++;else if (o == null) oldEnd--;else if (v == null) start++;else if (o.key === v.key) {
							var shouldRecycle = pool != null && oldEnd >= old.length - pool.length || pool == null && recycling;
							updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns);
							if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling));
							oldEnd--, start++;
						} else break;
					}
				}
				while (oldEnd >= oldStart && end >= start) {
					var o = old[oldEnd],
					    v = vnodes[end];
					if (o === v && !recycling) oldEnd--, end--;else if (o == null) oldEnd--;else if (v == null) end--;else if (o.key === v.key) {
						var shouldRecycle = pool != null && oldEnd >= old.length - pool.length || pool == null && recycling;
						updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns);
						if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling);
						if (o.dom != null) nextSibling = o.dom;
						oldEnd--, end--;
					} else {
						if (!map) map = getKeyMap(old, oldEnd);
						if (v != null) {
							var oldIndex = map[v.key];
							if (oldIndex != null) {
								var movable = old[oldIndex];
								var shouldRecycle = pool != null && oldIndex >= old.length - pool.length || pool == null && recycling;
								updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns);
								insertNode(parent, toFragment(movable), nextSibling);
								old[oldIndex].skip = true;
								if (movable.dom != null) nextSibling = movable.dom;
							} else {
								var dom = createNode(parent, v, hooks, undefined, nextSibling);
								nextSibling = dom;
							}
						}
						end--;
					}
					if (end < start) break;
				}
				createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns);
				removeNodes(old, oldStart, oldEnd + 1, vnodes);
			}
		}
		function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
			var oldTag = old.tag,
			    tag = vnode.tag;
			if (oldTag === tag) {
				vnode.state = old.state;
				vnode._state = old._state;
				vnode.events = old.events;
				if (!recycling && shouldNotUpdate(vnode, old)) return;
				if (typeof oldTag === "string") {
					if (vnode.attrs != null) {
						if (recycling) {
							vnode.state = {};
							initLifecycle(vnode.attrs, vnode, hooks);
						} else updateLifecycle(vnode.attrs, vnode, hooks);
					}
					switch (oldTag) {
						case "#":
							updateText(old, vnode);break;
						case "<":
							updateHTML(parent, old, vnode, nextSibling);break;
						case "[":
							updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns);break;
						default:
							updateElement(old, vnode, recycling, hooks, ns);
					}
				} else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns);
			} else {
				removeNode(old, null);
				createNode(parent, vnode, hooks, ns, nextSibling);
			}
		}
		function updateText(old, vnode) {
			if (old.children.toString() !== vnode.children.toString()) {
				old.dom.nodeValue = vnode.children;
			}
			vnode.dom = old.dom;
		}
		function updateHTML(parent, old, vnode, nextSibling) {
			if (old.children !== vnode.children) {
				toFragment(old);
				createHTML(parent, vnode, nextSibling);
			} else vnode.dom = old.dom, vnode.domSize = old.domSize;
		}
		function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
			updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns);
			var domSize = 0,
			    children = vnode.children;
			vnode.dom = null;
			if (children != null) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i];
					if (child != null && child.dom != null) {
						if (vnode.dom == null) vnode.dom = child.dom;
						domSize += child.domSize || 1;
					}
				}
				if (domSize !== 1) vnode.domSize = domSize;
			}
		}
		function updateElement(old, vnode, recycling, hooks, ns) {
			var element = vnode.dom = old.dom;
			switch (vnode.tag) {
				case "svg":
					ns = "http://www.w3.org/2000/svg";break;
				case "math":
					ns = "http://www.w3.org/1998/Math/MathML";break;
			}
			if (vnode.tag === "textarea") {
				if (vnode.attrs == null) vnode.attrs = {};
				if (vnode.text != null) {
					vnode.attrs.value = vnode.text; //FIXME handle0 multiple children
					vnode.text = undefined;
				}
			}
			updateAttrs(vnode, old.attrs, vnode.attrs, ns);
			if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
				setContentEditable(vnode);
			} else if (old.text != null && vnode.text != null && vnode.text !== "") {
				if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text;
			} else {
				if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)];
				if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)];
				updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns);
			}
		}
		function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
			if (recycling) {
				initComponent(vnode, hooks);
			} else {
				vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode));
				if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument");
				if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks);
				updateLifecycle(vnode._state, vnode, hooks);
			}
			if (vnode.instance != null) {
				if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling);else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns);
				vnode.dom = vnode.instance.dom;
				vnode.domSize = vnode.instance.domSize;
			} else if (old.instance != null) {
				removeNode(old.instance, null);
				vnode.dom = undefined;
				vnode.domSize = 0;
			} else {
				vnode.dom = old.dom;
				vnode.domSize = old.domSize;
			}
		}
		function isRecyclable(old, vnodes) {
			if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
				var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0;
				var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0;
				var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0;
				if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
					return true;
				}
			}
			return false;
		}
		function getKeyMap(vnodes, end) {
			var map = {},
			    i = 0;
			for (var i = 0; i < end; i++) {
				var vnode = vnodes[i];
				if (vnode != null) {
					var key2 = vnode.key;
					if (key2 != null) map[key2] = i;
				}
			}
			return map;
		}
		function toFragment(vnode) {
			var count0 = vnode.domSize;
			if (count0 != null || vnode.dom == null) {
				var fragment = $doc.createDocumentFragment();
				if (count0 > 0) {
					var dom = vnode.dom;
					while (--count0) {
						fragment.appendChild(dom.nextSibling);
					}fragment.insertBefore(dom, fragment.firstChild);
				}
				return fragment;
			} else return vnode.dom;
		}
		function getNextSibling(vnodes, i, nextSibling) {
			for (; i < vnodes.length; i++) {
				if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom;
			}
			return nextSibling;
		}
		function insertNode(parent, dom, nextSibling) {
			if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling);else parent.appendChild(dom);
		}
		function setContentEditable(vnode) {
			var children = vnode.children;
			if (children != null && children.length === 1 && children[0].tag === "<") {
				var content = children[0].children;
				if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content;
			} else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted");
		}
		//remove
		function removeNodes(vnodes, start, end, context) {
			for (var i = start; i < end; i++) {
				var vnode = vnodes[i];
				if (vnode != null) {
					if (vnode.skip) vnode.skip = false;else removeNode(vnode, context);
				}
			}
		}
		function removeNode(vnode, context) {
			var expected = 1,
			    called = 0;
			if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
				var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode);
				if (result != null && typeof result.then === "function") {
					expected++;
					result.then(continuation, continuation);
				}
			}
			if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
				var result = vnode._state.onbeforeremove.call(vnode.state, vnode);
				if (result != null && typeof result.then === "function") {
					expected++;
					result.then(continuation, continuation);
				}
			}
			continuation();
			function continuation() {
				if (++called === expected) {
					onremove(vnode);
					if (vnode.dom) {
						var count0 = vnode.domSize || 1;
						if (count0 > 1) {
							var dom = vnode.dom;
							while (--count0) {
								removeNodeFromDOM(dom.nextSibling);
							}
						}
						removeNodeFromDOM(vnode.dom);
						if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") {
							//TODO test custom elements
							if (!context.pool) context.pool = [vnode];else context.pool.push(vnode);
						}
					}
				}
			}
		}
		function removeNodeFromDOM(node) {
			var parent = node.parentNode;
			if (parent != null) parent.removeChild(node);
		}
		function onremove(vnode) {
			if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode);
			if (typeof vnode.tag !== "string" && typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode);
			if (vnode.instance != null) onremove(vnode.instance);else {
				var children = vnode.children;
				if (Array.isArray(children)) {
					for (var i = 0; i < children.length; i++) {
						var child = children[i];
						if (child != null) onremove(child);
					}
				}
			}
		}
		//attrs2
		function setAttrs(vnode, attrs2, ns) {
			for (var key2 in attrs2) {
				setAttr(vnode, key2, null, attrs2[key2], ns);
			}
		}
		function setAttr(vnode, key2, old, value, ns) {
			var element = vnode.dom;
			if (key2 === "key" || key2 === "is" || old === value && !isFormAttribute(vnode, key2) && (typeof value === "undefined" ? "undefined" : _typeof(value)) !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return;
			var nsLastIndex = key2.indexOf(":");
			if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
				element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value);
			} else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value);else if (key2 === "style") updateStyle(element, old, value);else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if (vnode.tag === "input" && key2 === "value" && vnode.dom.value == value && vnode.dom === $doc.activeElement) return;
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "select" && key2 === "value" && vnode.dom.value == value && vnode.dom === $doc.activeElement) return;
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "option" && key2 === "value" && vnode.dom.value == value) return;
				// If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
				if (vnode.tag === "input" && key2 === "type") {
					element.setAttribute(key2, value);
					return;
				}
				element[key2] = value;
			} else {
				if (typeof value === "boolean") {
					if (value) element.setAttribute(key2, "");else element.removeAttribute(key2);
				} else element.setAttribute(key2 === "className" ? "class" : key2, value);
			}
		}
		function setLateAttrs(vnode) {
			var attrs2 = vnode.attrs;
			if (vnode.tag === "select" && attrs2 != null) {
				if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined);
				if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined);
			}
		}
		function updateAttrs(vnode, old, attrs2, ns) {
			if (attrs2 != null) {
				for (var key2 in attrs2) {
					setAttr(vnode, key2, old && old[key2], attrs2[key2], ns);
				}
			}
			if (old != null) {
				for (var key2 in old) {
					if (attrs2 == null || !(key2 in attrs2)) {
						if (key2 === "className") key2 = "class";
						if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined);else if (key2 !== "key") vnode.dom.removeAttribute(key2);
					}
				}
			}
		}
		function isFormAttribute(vnode, attr) {
			return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement;
		}
		function isLifecycleMethod(attr) {
			return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate";
		}
		function isAttribute(attr) {
			return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"; // || attr === "type"
		}
		function isCustomElement(vnode) {
			return vnode.attrs.is || vnode.tag.indexOf("-") > -1;
		}
		function hasIntegrationMethods(source) {
			return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove);
		}
		//style
		function updateStyle(element, old, style) {
			if (old === style) element.style.cssText = "", old = null;
			if (style == null) element.style.cssText = "";else if (typeof style === "string") element.style.cssText = style;else {
				if (typeof old === "string") element.style.cssText = "";
				for (var key2 in style) {
					element.style[key2] = style[key2];
				}
				if (old != null && typeof old !== "string") {
					for (var key2 in old) {
						if (!(key2 in style)) element.style[key2] = "";
					}
				}
			}
		}
		//event
		function updateEvent(vnode, key2, value) {
			var element = vnode.dom;
			var callback = typeof onevent !== "function" ? value : function (e) {
				var result = value.call(element, e);
				onevent.call(element, e);
				return result;
			};
			if (key2 in element) element[key2] = typeof value === "function" ? callback : null;else {
				var eventName = key2.slice(2);
				if (vnode.events === undefined) vnode.events = {};
				if (vnode.events[key2] === callback) return;
				if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false);
				if (typeof value === "function") {
					vnode.events[key2] = callback;
					element.addEventListener(eventName, vnode.events[key2], false);
				}
			}
		}
		//lifecycle
		function initLifecycle(source, vnode, hooks) {
			if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode);
			if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode));
		}
		function updateLifecycle(source, vnode, hooks) {
			if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode));
		}
		function shouldNotUpdate(vnode, old) {
			var forceVnodeUpdate, forceComponentUpdate;
			if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old);
			if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old);
			if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
				vnode.dom = old.dom;
				vnode.domSize = old.domSize;
				vnode.instance = old.instance;
				return true;
			}
			return false;
		}
		function render(dom, vnodes) {
			if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
			var hooks = [];
			var active = $doc.activeElement;
			// First time0 rendering into a node clears it out
			if (dom.vnodes == null) dom.textContent = "";
			if (!Array.isArray(vnodes)) vnodes = [vnodes];
			updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, undefined);
			dom.vnodes = vnodes;
			for (var i = 0; i < hooks.length; i++) {
				hooks[i]();
			}if ($doc.activeElement !== active) active.focus();
		}
		return { render: render, setEventCallback: setEventCallback };
	};
	function throttle(callback) {
		//60fps translates to 16.6ms, round it down since setTimeout requires int
		var time = 16;
		var last = 0,
		    pending = null;
		var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout;
		return function () {
			var now = Date.now();
			if (last === 0 || now - last >= time) {
				last = now;
				callback();
			} else if (pending === null) {
				pending = timeout(function () {
					pending = null;
					callback();
					last = Date.now();
				}, time - (now - last));
			}
		};
	}
	var _11 = function _11($window) {
		var renderService = coreRenderer($window);
		renderService.setEventCallback(function (e) {
			if (e.redraw !== false) redraw();
		});
		var callbacks = [];
		function subscribe(key1, callback) {
			unsubscribe(key1);
			callbacks.push(key1, throttle(callback));
		}
		function unsubscribe(key1) {
			var index = callbacks.indexOf(key1);
			if (index > -1) callbacks.splice(index, 2);
		}
		function redraw() {
			for (var i = 1; i < callbacks.length; i += 2) {
				callbacks[i]();
			}
		}
		return { subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render };
	};
	var redrawService = _11(window);
	requestService.setCompletionCallback(redrawService.redraw);
	var _16 = function _16(redrawService0) {
		return function (root, component) {
			if (component === null) {
				redrawService0.render(root, []);
				redrawService0.unsubscribe(root);
				return;
			}

			if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode");

			var run0 = function run0() {
				redrawService0.render(root, Vnode(component));
			};
			redrawService0.subscribe(root, run0);
			redrawService0.redraw();
		};
	};
	m.mount = _16(redrawService);
	var Promise = PromisePolyfill;
	var parseQueryString = function parseQueryString(string) {
		if (string === "" || string == null) return {};
		if (string.charAt(0) === "?") string = string.slice(1);
		var entries = string.split("&"),
		    data0 = {},
		    counters = {};
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i].split("=");
			var key5 = decodeURIComponent(entry[0]);
			var value = entry.length === 2 ? decodeURIComponent(entry[1]) : "";
			if (value === "true") value = true;else if (value === "false") value = false;
			var levels = key5.split(/\]\[?|\[/);
			var cursor = data0;
			if (key5.indexOf("[") > -1) levels.pop();
			for (var j = 0; j < levels.length; j++) {
				var level = levels[j],
				    nextLevel = levels[j + 1];
				var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10));
				var isValue = j === levels.length - 1;
				if (level === "") {
					var key5 = levels.slice(0, j).join();
					if (counters[key5] == null) counters[key5] = 0;
					level = counters[key5]++;
				}
				if (cursor[level] == null) {
					cursor[level] = isValue ? value : isNumber ? [] : {};
				}
				cursor = cursor[level];
			}
		}
		return data0;
	};
	var coreRouter = function coreRouter($window) {
		var supportsPushState = typeof $window.history.pushState === "function";
		var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout;
		function normalize1(fragment0) {
			var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent);
			if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data;
			return data;
		}
		var asyncId;
		function debounceAsync(callback0) {
			return function () {
				if (asyncId != null) return;
				asyncId = callAsync0(function () {
					asyncId = null;
					callback0();
				});
			};
		}
		function parsePath(path, queryData, hashData) {
			var queryIndex = path.indexOf("?");
			var hashIndex = path.indexOf("#");
			var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length;
			if (queryIndex > -1) {
				var queryEnd = hashIndex > -1 ? hashIndex : path.length;
				var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd));
				for (var key4 in queryParams) {
					queryData[key4] = queryParams[key4];
				}
			}
			if (hashIndex > -1) {
				var hashParams = parseQueryString(path.slice(hashIndex + 1));
				for (var key4 in hashParams) {
					hashData[key4] = hashParams[key4];
				}
			}
			return path.slice(0, pathEnd);
		}
		var router = { prefix: "#!" };
		router.getPath = function () {
			var type2 = router.prefix.charAt(0);
			switch (type2) {
				case "#":
					return normalize1("hash").slice(router.prefix.length);
				case "?":
					return normalize1("search").slice(router.prefix.length) + normalize1("hash");
				default:
					return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash");
			}
		};
		router.setPath = function (path, data, options) {
			var queryData = {},
			    hashData = {};
			path = parsePath(path, queryData, hashData);
			if (data != null) {
				for (var key4 in data) {
					queryData[key4] = data[key4];
				}path = path.replace(/:([^\/]+)/g, function (match2, token) {
					delete queryData[token];
					return data[token];
				});
			}
			var query = buildQueryString(queryData);
			if (query) path += "?" + query;
			var hash = buildQueryString(hashData);
			if (hash) path += "#" + hash;
			if (supportsPushState) {
				var state = options ? options.state : null;
				var title = options ? options.title : null;
				$window.onpopstate();
				if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path);else $window.history.pushState(state, title, router.prefix + path);
			} else $window.location.href = router.prefix + path;
		};
		router.defineRoutes = function (routes, resolve, reject) {
			function resolveRoute() {
				var path = router.getPath();
				var params = {};
				var pathname = parsePath(path, params, params);
				var state = $window.history.state;
				if (state != null) {
					for (var k in state) {
						params[k] = state[k];
					}
				}
				for (var route0 in routes) {
					var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");
					if (matcher.test(pathname)) {
						pathname.replace(matcher, function () {
							var keys = route0.match(/:[^\/]+/g) || [];
							var values = [].slice.call(arguments, 1, -2);
							for (var i = 0; i < keys.length; i++) {
								params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i]);
							}
							resolve(routes[route0], params, path, route0);
						});
						return;
					}
				}
				reject(path, params);
			}
			if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute);else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute;
			resolveRoute();
		};
		return router;
	};
	var _20 = function _20($window, redrawService0) {
		var routeService = coreRouter($window);
		var identity = function identity(v) {
			return v;
		};
		var render1, component, attrs3, currentPath, _lastUpdate;
		var route = function route(root, defaultRoute, routes) {
			if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined");
			var run1 = function run1() {
				if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)));
			};
			var bail = function bail(path) {
				if (path !== defaultRoute) routeService.setPath(defaultRoute, null, { replace: true });else throw new Error("Could not resolve default route " + defaultRoute);
			};
			routeService.defineRoutes(routes, function (payload, params, path) {
				var update = _lastUpdate = function lastUpdate(routeResolver, comp) {
					if (update !== _lastUpdate) return;
					component = comp != null && (typeof comp.view === "function" || typeof comp === "function") ? comp : "div";
					attrs3 = params, currentPath = path, _lastUpdate = null;
					render1 = (routeResolver.render || identity).bind(routeResolver);
					run1();
				};
				if (payload.view || typeof payload === "function") update({}, payload);else {
					if (payload.onmatch) {
						Promise.resolve(payload.onmatch(params, path)).then(function (resolved) {
							update(payload, resolved);
						}, bail);
					} else update(payload, "div");
				}
			}, bail);
			redrawService0.subscribe(root, run1);
		};
		route.set = function (path, data, options) {
			if (_lastUpdate != null) options = { replace: true };
			_lastUpdate = null;
			routeService.setPath(path, data, options);
		};
		route.get = function () {
			return currentPath;
		};
		route.prefix = function (prefix0) {
			routeService.prefix = prefix0;
		};
		route.link = function (vnode1) {
			vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href);
			vnode1.dom.onclick = function (e) {
				if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return;
				e.preventDefault();
				e.redraw = false;
				var href = this.getAttribute("href");
				if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length);
				route.set(href, undefined, undefined);
			};
		};
		route.param = function (key3) {
			if (typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3];
			return attrs3;
		};
		return route;
	};
	m.route = _20(window, redrawService);
	m.withAttr = function (attrName, callback1, context) {
		return function (e) {
			callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName));
		};
	};
	var _28 = coreRenderer(window);
	m.render = _28.render;
	m.redraw = redrawService.redraw;
	m.request = requestService.request;
	m.jsonp = requestService.jsonp;
	m.parseQueryString = parseQueryString;
	m.buildQueryString = buildQueryString;
	m.version = "1.1.0";
	m.vnode = Vnode;
	if (true) module["exports"] = m;else window.m = m;
})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13).setImmediate, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mithril = __webpack_require__(0);

var _mithril2 = _interopRequireDefault(_mithril);

var _model = __webpack_require__(4);

var _model2 = _interopRequireDefault(_model);

var _styles = __webpack_require__(16);

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Ul = {
  view: function view(vnode) {
    return (0, _mithril2.default)(
      'ul',
      { className: 'mdl-list' },
      vnode.attrs.inner
    );
  }
};

var Li = {
  view: function view(vnode) {
    return (0, _mithril2.default)(
      'li',
      { className: 'mdl-list__item' },
      vnode.attrs.inner
    );
  }
};

var Details = {
  view: function view(vnode) {
    return (0, _mithril2.default)(
      'details',
      null,
      (0, _mithril2.default)(
        'summary',
        null,
        vnode.attrs.summary
      ),
      vnode.attrs.inner
    );
  }
};

var Year = {
  view: function view(vnode) {
    var data = vnode.attrs.data;
    var inner = data.months.map(function (d) {
      return (0, _mithril2.default)(Ul, { inner: (0, _mithril2.default)(Li, { inner: (0, _mithril2.default)(Month, { data: d }) }) });
    });
    return (0, _mithril2.default)(
      'div',
      { id: data.year },
      (0, _mithril2.default)(Details, { summary: data.year + '\u5E74', inner: inner })
    );
  }
};

var Month = {
  view: function view(vnode) {
    var data = vnode.attrs.data;
    var inner = data.days.map(function (d) {
      return (0, _mithril2.default)(Ul, { inner: (0, _mithril2.default)(Li, { inner: (0, _mithril2.default)(Day, { data: d }) }) });
    });
    return (0, _mithril2.default)(
      'div',
      { id: data.month },
      (0, _mithril2.default)(Details, { summary: data.month + '\u6708', inner: inner })
    );
  }
};

var Day = {
  view: function view(vnode) {
    var data = vnode.attrs.data;
    var inner = (0, _mithril2.default)(
      'span',
      null,
      data.day + '\u65E5 ',
      (0, _mithril2.default)(
        'a',
        { href: '/article/' + data.year + '/' + data.month + '/' + data.day + '/' + data.slug },
        data.title
      )
    );
    return (0, _mithril2.default)(Li, { inner: inner });
  }
};

exports.default = {
  oninit: function oninit(vnode) {
    _model2.default.fetch();
    vnode.state.articleIndex = function () {
      return _model2.default.data.map(function (d) {
        return (0, _mithril2.default)(Ul, { inner: (0, _mithril2.default)(Li, { inner: (0, _mithril2.default)(Year, { data: d }) }) });
      });
    };
  },
  view: function view(vnode) {
    return (0, _mithril2.default)(
      'div',
      { className: 'mdl-grid' },
      (0, _mithril2.default)('div', { className: 'mdl-cell--1-offset' }),
      (0, _mithril2.default)(
        'div',
        { className: 'mdl-cell mdl-cell--10-col' },
        function () {
          if (!_model2.default.fetched) {
            return (0, _mithril2.default)('div', { className: 'mdl-spinner mdl-js-spinner is-active' });
          }
          return (0, _mithril2.default)(Ul, { inner: vnode.state.articleIndex() });
        }()
      ),
      (0, _mithril2.default)('div', { className: 'mdl-cell--1-offset' })
    );
  }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mithril = __webpack_require__(0);

var _mithril2 = _interopRequireDefault(_mithril);

var _component = __webpack_require__(2);

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mithril2.default.mount(document.getElementById('main'), _component2.default);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mithril = __webpack_require__(0);

var _mithril2 = _interopRequireDefault(_mithril);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Model = {
  data: [],
  fetched: false,
  fetch: function fetch() {
    return _mithril2.default.request({
      method: 'GET',
      url: '/api/articles'
    }).then(function (response) {
      Model.fetched = true;
      Model.data = response;
    });
  }
};

exports.default = Model;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function placeHoldersCount(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
}

function byteLength(b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64);
}

function toByteArray(b64) {
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;
  placeHolders = placeHoldersCount(b64);

  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = tmp >> 16 & 0xFF;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }
  return output.join('');
}

function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[tmp << 4 & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[tmp >> 4 & 0x3F];
    output += lookup[tmp << 2 & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('');
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(5);
var ieee754 = __webpack_require__(8);
var isArray = __webpack_require__(9);

exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength();

function typedArraySupport() {
  try {
    var arr = new Uint8Array(1);
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
        return 42;
      } };
    return arr.foo() === 42 && // typed array instances can be augmented
    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
  } catch (e) {
    return false;
  }
}

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
}

function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length');
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that;
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer(arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length);
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error('If encoding is specified then the first argument must be a string');
    }
    return allocUnsafe(this, arg);
  }
  return from(this, arg, encodingOrOffset, length);
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr;
};

function from(that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset);
  }

  return fromObject(that, value);
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length);
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
  if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    });
  }
}

function assertSize(size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}

function alloc(that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size);
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
  }
  return createBuffer(that, size);
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding);
};

function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that;
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size);
};

function fromString(that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that;
}

function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that;
}

function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds');
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds');
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that;
}

function fromObject(that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that;
    }

    obj.copy(that, 0, 0, len);
    return that;
  }

  if (obj) {
    if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0);
      }
      return fromArrayLike(that, obj);
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}

function checked(length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
  }
  return length | 0;
}

function SlowBuffer(length) {
  if (+length != length) {
    // eslint-disable-line eqeqeq
    length = 0;
  }
  return Buffer.alloc(+length);
}

Buffer.isBuffer = function isBuffer(b) {
  return !!(b != null && b._isBuffer);
};

Buffer.compare = function compare(a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers');
  }

  if (a === b) return 0;

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;
    default:
      return false;
  }
};

Buffer.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return Buffer.alloc(0);
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

function byteLength(string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length;
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0;

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len;
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length;
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2;
      case 'hex':
        return len >>> 1;
      case 'base64':
        return base64ToBytes(string).length;
      default:
        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return '';
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return '';
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return '';
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end);

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end);

      case 'ascii':
        return asciiSlice(this, start, end);

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end);

      case 'base64':
        return base64Slice(this, start, end);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
};

Buffer.prototype.swap32 = function swap32() {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits');
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
};

Buffer.prototype.swap64 = function swap64() {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits');
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
};

Buffer.prototype.toString = function toString() {
  var length = this.length | 0;
  if (length === 0) return '';
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};

Buffer.prototype.equals = function equals(b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
  var str = '';
  var max = exports.INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>';
};

Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer');
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index');
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0;

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1;

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset; // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }

  throw new TypeError('val must be string, number or Buffer');
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
  }

  return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }
  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}

Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
    // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
    // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length);

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length);

      case 'ascii':
        return asciiWrite(this, string, offset, length);

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length);

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf);
  } else {
    return base64.fromByteArray(buf.slice(start, end));
  }
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }
  return res;
}

function asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret;
}

function latin1Slice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}

function hexSlice(buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out;
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf;
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}

Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val;
};

Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val;
};

Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};

Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};

Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};

Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};

Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
}

Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = value & 0xff;
  return offset + 1;
};

function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0;

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
  if (end < 0) throw new RangeError('sourceEnd out of bounds');

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
  }

  return len;
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean(str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return '';
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str;
}

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        }

        // valid lead
        leadSurrogate = codePoint;

        continue;
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }

  return bytes;
}

function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray;
}

function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return base64.toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}

function isnan(val) {
  return val !== val; // eslint-disable-line no-self-compare
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap) {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6).Buffer))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
        // Callback can either be a function or a string
        if (typeof callback !== "function") {
            callback = new Function("" + callback);
        }
        // Copy function arguments
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i + 1];
        }
        // Store and register the task
        var task = { callback: callback, args: args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
            case 0:
                callback();
                break;
            case 1:
                callback(args[0]);
                break;
            case 2:
                callback(args[0], args[1]);
                break;
            case 3:
                callback(args[0], args[1], args[2]);
                break;
            default:
                callback.apply(undefined, args);
                break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function registerImmediate(handle) {
            process.nextTick(function () {
                runIfPresent(handle);
            });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function () {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function onGlobalMessage(event) {
            if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function registerImmediate(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function (event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function registerImmediate(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function registerImmediate(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function registerImmediate(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();
    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();
    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();
    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();
    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? undefined : global : self);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(10)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function () {};
Timeout.prototype.close = function () {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(11);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(undefined);
// imports


// module
exports.push([module.i, "._1yyqnBvPE8nJxnomcKk99v{position:fixed;right:0;bottom:0}", ""]);

// exports
exports.locals = {
	"fixedBottom": "_1yyqnBvPE8nJxnomcKk99v"
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(12);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(15)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!./styles.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!./styles.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzUzNmNjNjhlYTMxNDE2MDQ1ZmIiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9taXRocmlsL21pdGhyaWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vZW50cnkuanMiLCJ3ZWJwYWNrOi8vLy4vbW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9iYXNlNjQtanMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L2llZWU3NTQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9pc2FycmF5L2luZGV4LmpzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L3N0eWxlLWxvYWRlci9maXhVcmxzLmpzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zdHlsZXMuY3NzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zdHlsZXMuY3NzP2E4MTMiXSwibmFtZXMiOlsiVm5vZGUiLCJ0YWciLCJrZXkiLCJhdHRyczAiLCJjaGlsZHJlbiIsInRleHQiLCJkb20iLCJhdHRycyIsImRvbVNpemUiLCJ1bmRlZmluZWQiLCJzdGF0ZSIsIl9zdGF0ZSIsImV2ZW50cyIsImluc3RhbmNlIiwic2tpcCIsIm5vcm1hbGl6ZSIsIm5vZGUiLCJBcnJheSIsImlzQXJyYXkiLCJub3JtYWxpemVDaGlsZHJlbiIsImkiLCJsZW5ndGgiLCJzZWxlY3RvclBhcnNlciIsInNlbGVjdG9yQ2FjaGUiLCJoYXNPd24iLCJoYXNPd25Qcm9wZXJ0eSIsImNvbXBpbGVTZWxlY3RvciIsInNlbGVjdG9yIiwibWF0Y2giLCJjbGFzc2VzIiwiZXhlYyIsInR5cGUiLCJ2YWx1ZSIsImlkIiwicHVzaCIsImF0dHJWYWx1ZSIsInJlcGxhY2UiLCJjbGFzc05hbWUiLCJqb2luIiwiZXhlY1NlbGVjdG9yIiwiaGFzQXR0cnMiLCJjaGlsZExpc3QiLCJjbGFzcyIsImNhbGwiLCJoeXBlcnNjcmlwdCIsImFyZ3VtZW50cyIsInN0YXJ0IiwidmlldyIsIkVycm9yIiwiY2FjaGVkIiwibm9ybWFsaXplZCIsInRydXN0IiwiaHRtbCIsImZyYWdtZW50IiwiYXR0cnMxIiwibSIsIlByb21pc2VQb2x5ZmlsbCIsImV4ZWN1dG9yIiwiVHlwZUVycm9yIiwic2VsZiIsInJlc29sdmVycyIsInJlamVjdG9ycyIsInJlc29sdmVDdXJyZW50IiwiaGFuZGxlciIsInJlamVjdEN1cnJlbnQiLCJfaW5zdGFuY2UiLCJjYWxsQXN5bmMiLCJzZXRJbW1lZGlhdGUiLCJzZXRUaW1lb3V0IiwibGlzdCIsInNob3VsZEFic29yYiIsImV4ZWN1dGUiLCJ0aGVuIiwiZXhlY3V0ZU9uY2UiLCJiaW5kIiwiY29uc29sZSIsImVycm9yIiwicmV0cnkiLCJlIiwicnVucyIsInJ1biIsImZuIiwib25lcnJvciIsInByb3RvdHlwZSIsIm9uRnVsZmlsbGVkIiwib25SZWplY3Rpb24iLCJoYW5kbGUiLCJjYWxsYmFjayIsIm5leHQiLCJyZXNvbHZlTmV4dCIsInJlamVjdE5leHQiLCJwcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNhdGNoIiwiYWxsIiwidG90YWwiLCJjb3VudCIsInZhbHVlcyIsImNvbnN1bWUiLCJyYWNlIiwid2luZG93IiwiUHJvbWlzZSIsImdsb2JhbCIsImJ1aWxkUXVlcnlTdHJpbmciLCJvYmplY3QiLCJPYmplY3QiLCJ0b1N0cmluZyIsImFyZ3MiLCJrZXkwIiwiZGVzdHJ1Y3R1cmUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJGSUxFX1BST1RPQ09MX1JFR0VYIiwiUmVnRXhwIiwiXzgiLCIkd2luZG93IiwiY2FsbGJhY2tDb3VudCIsIm9uY29tcGxldGlvbiIsInNldENvbXBsZXRpb25DYWxsYmFjayIsImZpbmFsaXplciIsImNvbXBsZXRlIiwiZmluYWxpemUiLCJwcm9taXNlMCIsInRoZW4wIiwiYXBwbHkiLCJleHRyYSIsInVybCIsInJlcXVlc3QiLCJtZXRob2QiLCJ0b1VwcGVyQ2FzZSIsInVzZUJvZHkiLCJzZXJpYWxpemUiLCJGb3JtRGF0YSIsImRhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwiZGVzZXJpYWxpemUiLCJleHRyYWN0IiwiaW50ZXJwb2xhdGUiLCJhc3NlbWJsZSIsInhociIsIlhNTEh0dHBSZXF1ZXN0IiwiYWJvcnRlZCIsIl9hYm9ydCIsImFib3J0Iiwib3BlbiIsImFzeW5jIiwidXNlciIsInBhc3N3b3JkIiwic2V0UmVxdWVzdEhlYWRlciIsIndpdGhDcmVkZW50aWFscyIsImhlYWRlcnMiLCJjb25maWciLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwicmVzcG9uc2UiLCJzdGF0dXMiLCJ0ZXN0IiwiY2FzdCIsInJlc3BvbnNlVGV4dCIsInNlbmQiLCJiYWNrZ3JvdW5kIiwianNvbnAiLCJjYWxsYmFja05hbWUiLCJNYXRoIiwicm91bmQiLCJyYW5kb20iLCJzY3JpcHQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJjYWxsYmFja0tleSIsInNyYyIsImRvY3VtZW50RWxlbWVudCIsImFwcGVuZENoaWxkIiwidG9rZW5zIiwic2xpY2UiLCJxdWVyeXN0cmluZyIsInByZWZpeCIsImluZGV4T2YiLCJwYXJzZSIsInR5cGUwIiwicmVxdWVzdFNlcnZpY2UiLCJjb3JlUmVuZGVyZXIiLCIkZG9jIiwiJGVtcHR5RnJhZ21lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50Iiwib25ldmVudCIsInNldEV2ZW50Q2FsbGJhY2siLCJjcmVhdGVOb2RlcyIsInBhcmVudCIsInZub2RlcyIsImVuZCIsImhvb2tzIiwibmV4dFNpYmxpbmciLCJucyIsInZub2RlIiwiY3JlYXRlTm9kZSIsImluaXRMaWZlY3ljbGUiLCJjcmVhdGVUZXh0IiwiY3JlYXRlSFRNTCIsImNyZWF0ZUZyYWdtZW50IiwiY3JlYXRlQ29tcG9uZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJpbnNlcnROb2RlIiwibWF0Y2gxIiwicGFyZW50MSIsImNhcHRpb24iLCJ0aGVhZCIsInRib2R5IiwidGZvb3QiLCJ0ciIsInRoIiwidGQiLCJjb2xncm91cCIsImNvbCIsInRlbXAiLCJpbm5lckhUTUwiLCJmaXJzdENoaWxkIiwiY2hpbGROb2RlcyIsImNoaWxkIiwiYXR0cnMyIiwiaXMiLCJlbGVtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwic2V0QXR0cnMiLCJjb250ZW50ZWRpdGFibGUiLCJzZXRDb250ZW50RWRpdGFibGUiLCJ0ZXh0Q29udGVudCIsInNldExhdGVBdHRycyIsImluaXRDb21wb25lbnQiLCJzZW50aW5lbCIsImNyZWF0ZSIsIiQkcmVlbnRyYW50TG9jayQkIiwidXBkYXRlTm9kZXMiLCJvbGQiLCJyZWN5Y2xpbmciLCJyZW1vdmVOb2RlcyIsImlzVW5rZXllZCIsImdldE5leHRTaWJsaW5nIiwidXBkYXRlTm9kZSIsImlzUmVjeWNsYWJsZSIsInBvb2wiLCJjb25jYXQiLCJvbGRTdGFydCIsIm9sZEVuZCIsIm1hcCIsIm8iLCJ2Iiwic2hvdWxkUmVjeWNsZSIsInRvRnJhZ21lbnQiLCJnZXRLZXlNYXAiLCJvbGRJbmRleCIsIm1vdmFibGUiLCJvbGRUYWciLCJzaG91bGROb3RVcGRhdGUiLCJ1cGRhdGVMaWZlY3ljbGUiLCJ1cGRhdGVUZXh0IiwidXBkYXRlSFRNTCIsInVwZGF0ZUZyYWdtZW50IiwidXBkYXRlRWxlbWVudCIsInVwZGF0ZUNvbXBvbmVudCIsInJlbW92ZU5vZGUiLCJub2RlVmFsdWUiLCJ1cGRhdGVBdHRycyIsImFicyIsIm9sZENoaWxkcmVuTGVuZ3RoIiwicG9vbENoaWxkcmVuTGVuZ3RoIiwidm5vZGVzQ2hpbGRyZW5MZW5ndGgiLCJrZXkyIiwiY291bnQwIiwiaW5zZXJ0QmVmb3JlIiwiY29udGVudCIsImNvbnRleHQiLCJleHBlY3RlZCIsImNhbGxlZCIsIm9uYmVmb3JlcmVtb3ZlIiwicmVzdWx0IiwiY29udGludWF0aW9uIiwib25yZW1vdmUiLCJyZW1vdmVOb2RlRnJvbURPTSIsImhhc0ludGVncmF0aW9uTWV0aG9kcyIsInNldEF0dHIiLCJpc0Zvcm1BdHRyaWJ1dGUiLCJpc0xpZmVjeWNsZU1ldGhvZCIsIm5zTGFzdEluZGV4Iiwic3Vic3RyIiwic2V0QXR0cmlidXRlTlMiLCJ1cGRhdGVFdmVudCIsInVwZGF0ZVN0eWxlIiwiaXNBdHRyaWJ1dGUiLCJpc0N1c3RvbUVsZW1lbnQiLCJhY3RpdmVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwic2VsZWN0ZWRJbmRleCIsImF0dHIiLCJzb3VyY2UiLCJvbmNyZWF0ZSIsIm9udXBkYXRlIiwic3R5bGUiLCJjc3NUZXh0IiwiZXZlbnROYW1lIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbmluaXQiLCJmb3JjZVZub2RlVXBkYXRlIiwiZm9yY2VDb21wb25lbnRVcGRhdGUiLCJvbmJlZm9yZXVwZGF0ZSIsInJlbmRlciIsImFjdGl2ZSIsImZvY3VzIiwidGhyb3R0bGUiLCJ0aW1lIiwibGFzdCIsInBlbmRpbmciLCJ0aW1lb3V0IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibm93IiwiRGF0ZSIsIl8xMSIsInJlbmRlclNlcnZpY2UiLCJyZWRyYXciLCJjYWxsYmFja3MiLCJzdWJzY3JpYmUiLCJrZXkxIiwidW5zdWJzY3JpYmUiLCJpbmRleCIsInNwbGljZSIsInJlZHJhd1NlcnZpY2UiLCJfMTYiLCJyZWRyYXdTZXJ2aWNlMCIsInJvb3QiLCJjb21wb25lbnQiLCJydW4wIiwibW91bnQiLCJwYXJzZVF1ZXJ5U3RyaW5nIiwic3RyaW5nIiwiY2hhckF0IiwiZW50cmllcyIsInNwbGl0IiwiZGF0YTAiLCJjb3VudGVycyIsImVudHJ5Iiwia2V5NSIsImRlY29kZVVSSUNvbXBvbmVudCIsImxldmVscyIsImN1cnNvciIsInBvcCIsImoiLCJsZXZlbCIsIm5leHRMZXZlbCIsImlzTnVtYmVyIiwiaXNOYU4iLCJwYXJzZUludCIsImlzVmFsdWUiLCJjb3JlUm91dGVyIiwic3VwcG9ydHNQdXNoU3RhdGUiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiY2FsbEFzeW5jMCIsIm5vcm1hbGl6ZTEiLCJmcmFnbWVudDAiLCJsb2NhdGlvbiIsImFzeW5jSWQiLCJkZWJvdW5jZUFzeW5jIiwiY2FsbGJhY2swIiwicGFyc2VQYXRoIiwicGF0aCIsInF1ZXJ5RGF0YSIsImhhc2hEYXRhIiwicXVlcnlJbmRleCIsImhhc2hJbmRleCIsInBhdGhFbmQiLCJxdWVyeUVuZCIsInF1ZXJ5UGFyYW1zIiwia2V5NCIsImhhc2hQYXJhbXMiLCJyb3V0ZXIiLCJnZXRQYXRoIiwidHlwZTIiLCJzZXRQYXRoIiwib3B0aW9ucyIsIm1hdGNoMiIsInRva2VuIiwicXVlcnkiLCJoYXNoIiwidGl0bGUiLCJvbnBvcHN0YXRlIiwicmVwbGFjZVN0YXRlIiwiaHJlZiIsImRlZmluZVJvdXRlcyIsInJvdXRlcyIsInJlc29sdmVSb3V0ZSIsInBhcmFtcyIsInBhdGhuYW1lIiwiayIsInJvdXRlMCIsIm1hdGNoZXIiLCJrZXlzIiwib25oYXNoY2hhbmdlIiwiXzIwIiwicm91dGVTZXJ2aWNlIiwiaWRlbnRpdHkiLCJyZW5kZXIxIiwiYXR0cnMzIiwiY3VycmVudFBhdGgiLCJsYXN0VXBkYXRlIiwicm91dGUiLCJkZWZhdWx0Um91dGUiLCJydW4xIiwiYmFpbCIsInBheWxvYWQiLCJ1cGRhdGUiLCJyb3V0ZVJlc29sdmVyIiwiY29tcCIsIm9ubWF0Y2giLCJyZXNvbHZlZCIsInNldCIsImdldCIsInByZWZpeDAiLCJsaW5rIiwidm5vZGUxIiwib25jbGljayIsImN0cmxLZXkiLCJtZXRhS2V5Iiwic2hpZnRLZXkiLCJ3aGljaCIsInByZXZlbnREZWZhdWx0IiwiZ2V0QXR0cmlidXRlIiwicGFyYW0iLCJrZXkzIiwid2l0aEF0dHIiLCJhdHRyTmFtZSIsImNhbGxiYWNrMSIsImN1cnJlbnRUYXJnZXQiLCJfMjgiLCJ2ZXJzaW9uIiwibW9kdWxlIiwiZyIsIkZ1bmN0aW9uIiwiZXZhbCIsImV4cG9ydHMiLCJVbCIsImlubmVyIiwiTGkiLCJEZXRhaWxzIiwic3VtbWFyeSIsIlllYXIiLCJtb250aHMiLCJkIiwieWVhciIsIk1vbnRoIiwiZGF5cyIsIm1vbnRoIiwiRGF5IiwiZGF5Iiwic2x1ZyIsImZldGNoIiwiYXJ0aWNsZUluZGV4IiwiZmV0Y2hlZCIsImdldEVsZW1lbnRCeUlkIiwiTW9kZWwiLCJieXRlTGVuZ3RoIiwidG9CeXRlQXJyYXkiLCJmcm9tQnl0ZUFycmF5IiwibG9va3VwIiwicmV2TG9va3VwIiwiQXJyIiwiVWludDhBcnJheSIsImNvZGUiLCJsZW4iLCJjaGFyQ29kZUF0IiwicGxhY2VIb2xkZXJzQ291bnQiLCJiNjQiLCJsIiwidG1wIiwicGxhY2VIb2xkZXJzIiwiYXJyIiwiTCIsInRyaXBsZXRUb0Jhc2U2NCIsIm51bSIsImVuY29kZUNodW5rIiwidWludDgiLCJvdXRwdXQiLCJleHRyYUJ5dGVzIiwicGFydHMiLCJtYXhDaHVua0xlbmd0aCIsImxlbjIiLCJiYXNlNjQiLCJyZXF1aXJlIiwiaWVlZTc1NCIsIkJ1ZmZlciIsIlNsb3dCdWZmZXIiLCJJTlNQRUNUX01BWF9CWVRFUyIsIlRZUEVEX0FSUkFZX1NVUFBPUlQiLCJ0eXBlZEFycmF5U3VwcG9ydCIsImtNYXhMZW5ndGgiLCJfX3Byb3RvX18iLCJmb28iLCJzdWJhcnJheSIsImNyZWF0ZUJ1ZmZlciIsInRoYXQiLCJSYW5nZUVycm9yIiwiYXJnIiwiZW5jb2RpbmdPck9mZnNldCIsImFsbG9jVW5zYWZlIiwiZnJvbSIsInBvb2xTaXplIiwiX2F1Z21lbnQiLCJBcnJheUJ1ZmZlciIsImZyb21BcnJheUJ1ZmZlciIsImZyb21TdHJpbmciLCJmcm9tT2JqZWN0IiwiU3ltYm9sIiwic3BlY2llcyIsImRlZmluZVByb3BlcnR5IiwiY29uZmlndXJhYmxlIiwiYXNzZXJ0U2l6ZSIsInNpemUiLCJhbGxvYyIsImZpbGwiLCJlbmNvZGluZyIsImNoZWNrZWQiLCJhbGxvY1Vuc2FmZVNsb3ciLCJpc0VuY29kaW5nIiwiYWN0dWFsIiwid3JpdGUiLCJmcm9tQXJyYXlMaWtlIiwiYXJyYXkiLCJieXRlT2Zmc2V0Iiwib2JqIiwiaXNCdWZmZXIiLCJjb3B5IiwiYnVmZmVyIiwiaXNuYW4iLCJiIiwiX2lzQnVmZmVyIiwiY29tcGFyZSIsImEiLCJ4IiwieSIsIm1pbiIsIlN0cmluZyIsInRvTG93ZXJDYXNlIiwicG9zIiwiYnVmIiwiaXNWaWV3IiwibG93ZXJlZENhc2UiLCJ1dGY4VG9CeXRlcyIsImJhc2U2NFRvQnl0ZXMiLCJzbG93VG9TdHJpbmciLCJoZXhTbGljZSIsInV0ZjhTbGljZSIsImFzY2lpU2xpY2UiLCJsYXRpbjFTbGljZSIsImJhc2U2NFNsaWNlIiwidXRmMTZsZVNsaWNlIiwic3dhcCIsIm4iLCJzd2FwMTYiLCJzd2FwMzIiLCJzd2FwNjQiLCJlcXVhbHMiLCJpbnNwZWN0Iiwic3RyIiwibWF4IiwidGFyZ2V0IiwidGhpc1N0YXJ0IiwidGhpc0VuZCIsInRoaXNDb3B5IiwidGFyZ2V0Q29weSIsImJpZGlyZWN0aW9uYWxJbmRleE9mIiwidmFsIiwiZGlyIiwiYXJyYXlJbmRleE9mIiwibGFzdEluZGV4T2YiLCJpbmRleFNpemUiLCJhcnJMZW5ndGgiLCJ2YWxMZW5ndGgiLCJyZWFkIiwicmVhZFVJbnQxNkJFIiwiZm91bmRJbmRleCIsImZvdW5kIiwiaW5jbHVkZXMiLCJoZXhXcml0ZSIsIm9mZnNldCIsIk51bWJlciIsInJlbWFpbmluZyIsInN0ckxlbiIsInBhcnNlZCIsInV0ZjhXcml0ZSIsImJsaXRCdWZmZXIiLCJhc2NpaVdyaXRlIiwiYXNjaWlUb0J5dGVzIiwibGF0aW4xV3JpdGUiLCJiYXNlNjRXcml0ZSIsInVjczJXcml0ZSIsInV0ZjE2bGVUb0J5dGVzIiwiaXNGaW5pdGUiLCJ0b0pTT04iLCJfYXJyIiwicmVzIiwiZmlyc3RCeXRlIiwiY29kZVBvaW50IiwiYnl0ZXNQZXJTZXF1ZW5jZSIsInNlY29uZEJ5dGUiLCJ0aGlyZEJ5dGUiLCJmb3VydGhCeXRlIiwidGVtcENvZGVQb2ludCIsImRlY29kZUNvZGVQb2ludHNBcnJheSIsIk1BWF9BUkdVTUVOVFNfTEVOR1RIIiwiY29kZVBvaW50cyIsImZyb21DaGFyQ29kZSIsInJldCIsIm91dCIsInRvSGV4IiwiYnl0ZXMiLCJuZXdCdWYiLCJzbGljZUxlbiIsImNoZWNrT2Zmc2V0IiwiZXh0IiwicmVhZFVJbnRMRSIsIm5vQXNzZXJ0IiwibXVsIiwicmVhZFVJbnRCRSIsInJlYWRVSW50OCIsInJlYWRVSW50MTZMRSIsInJlYWRVSW50MzJMRSIsInJlYWRVSW50MzJCRSIsInJlYWRJbnRMRSIsInBvdyIsInJlYWRJbnRCRSIsInJlYWRJbnQ4IiwicmVhZEludDE2TEUiLCJyZWFkSW50MTZCRSIsInJlYWRJbnQzMkxFIiwicmVhZEludDMyQkUiLCJyZWFkRmxvYXRMRSIsInJlYWRGbG9hdEJFIiwicmVhZERvdWJsZUxFIiwicmVhZERvdWJsZUJFIiwiY2hlY2tJbnQiLCJ3cml0ZVVJbnRMRSIsIm1heEJ5dGVzIiwid3JpdGVVSW50QkUiLCJ3cml0ZVVJbnQ4IiwiZmxvb3IiLCJvYmplY3RXcml0ZVVJbnQxNiIsImxpdHRsZUVuZGlhbiIsIndyaXRlVUludDE2TEUiLCJ3cml0ZVVJbnQxNkJFIiwib2JqZWN0V3JpdGVVSW50MzIiLCJ3cml0ZVVJbnQzMkxFIiwid3JpdGVVSW50MzJCRSIsIndyaXRlSW50TEUiLCJsaW1pdCIsInN1YiIsIndyaXRlSW50QkUiLCJ3cml0ZUludDgiLCJ3cml0ZUludDE2TEUiLCJ3cml0ZUludDE2QkUiLCJ3cml0ZUludDMyTEUiLCJ3cml0ZUludDMyQkUiLCJjaGVja0lFRUU3NTQiLCJ3cml0ZUZsb2F0Iiwid3JpdGVGbG9hdExFIiwid3JpdGVGbG9hdEJFIiwid3JpdGVEb3VibGUiLCJ3cml0ZURvdWJsZUxFIiwid3JpdGVEb3VibGVCRSIsInRhcmdldFN0YXJ0IiwiSU5WQUxJRF9CQVNFNjRfUkUiLCJiYXNlNjRjbGVhbiIsInN0cmluZ3RyaW0iLCJ0cmltIiwidW5pdHMiLCJJbmZpbml0eSIsImxlYWRTdXJyb2dhdGUiLCJieXRlQXJyYXkiLCJjIiwiaGkiLCJsbyIsImRzdCIsInVzZVNvdXJjZU1hcCIsIml0ZW0iLCJjc3NXaXRoTWFwcGluZ1RvU3RyaW5nIiwibW9kdWxlcyIsIm1lZGlhUXVlcnkiLCJhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzIiwiY3NzTWFwcGluZyIsInNvdXJjZU1hcHBpbmciLCJ0b0NvbW1lbnQiLCJzb3VyY2VVUkxzIiwic291cmNlcyIsInNvdXJjZVJvb3QiLCJzb3VyY2VNYXAiLCJpc0xFIiwibUxlbiIsIm5CeXRlcyIsImVMZW4iLCJlTWF4IiwiZUJpYXMiLCJuQml0cyIsInMiLCJOYU4iLCJydCIsImxvZyIsIkxOMiIsInByb2Nlc3MiLCJjYWNoZWRTZXRUaW1lb3V0IiwiY2FjaGVkQ2xlYXJUaW1lb3V0IiwiZGVmYXVsdFNldFRpbW91dCIsImRlZmF1bHRDbGVhclRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJydW5UaW1lb3V0IiwiZnVuIiwicnVuQ2xlYXJUaW1lb3V0IiwibWFya2VyIiwicXVldWUiLCJkcmFpbmluZyIsImN1cnJlbnRRdWV1ZSIsInF1ZXVlSW5kZXgiLCJjbGVhblVwTmV4dFRpY2siLCJkcmFpblF1ZXVlIiwibmV4dFRpY2siLCJJdGVtIiwiYnJvd3NlciIsImVudiIsImFyZ3YiLCJ2ZXJzaW9ucyIsIm5vb3AiLCJvbiIsImFkZExpc3RlbmVyIiwib25jZSIsIm9mZiIsInJlbW92ZUxpc3RlbmVyIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwiZW1pdCIsImJpbmRpbmciLCJuYW1lIiwiY3dkIiwiY2hkaXIiLCJ1bWFzayIsIm5leHRIYW5kbGUiLCJ0YXNrc0J5SGFuZGxlIiwiY3VycmVudGx5UnVubmluZ0FUYXNrIiwiZG9jIiwicmVnaXN0ZXJJbW1lZGlhdGUiLCJ0YXNrIiwiY2xlYXJJbW1lZGlhdGUiLCJydW5JZlByZXNlbnQiLCJpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbiIsImNhblVzZVBvc3RNZXNzYWdlIiwicG9zdE1lc3NhZ2UiLCJpbXBvcnRTY3JpcHRzIiwicG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyIsIm9sZE9uTWVzc2FnZSIsIm9ubWVzc2FnZSIsImluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uIiwibWVzc2FnZVByZWZpeCIsIm9uR2xvYmFsTWVzc2FnZSIsImV2ZW50IiwiYXR0YWNoRXZlbnQiLCJpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbiIsImNoYW5uZWwiLCJNZXNzYWdlQ2hhbm5lbCIsInBvcnQxIiwicG9ydDIiLCJpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uIiwiaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbiIsImF0dGFjaFRvIiwiZ2V0UHJvdG90eXBlT2YiLCJjc3MiLCJiYXNlVXJsIiwicHJvdG9jb2wiLCJob3N0IiwiY3VycmVudERpciIsImZpeGVkQ3NzIiwiZnVsbE1hdGNoIiwib3JpZ1VybCIsInVucXVvdGVkT3JpZ1VybCIsIiQxIiwibmV3VXJsIiwiVGltZW91dCIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsImNsb3NlIiwiY2xlYXJGbiIsIl9pZCIsIl9jbGVhckZuIiwidW5yZWYiLCJyZWYiLCJlbnJvbGwiLCJtc2VjcyIsIl9pZGxlVGltZW91dElkIiwiX2lkbGVUaW1lb3V0IiwidW5lbnJvbGwiLCJfdW5yZWZBY3RpdmUiLCJvblRpbWVvdXQiLCJfb25UaW1lb3V0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDaEVBLENBQUUsYUFBVztBQUNiOztBQUNBLFVBQVNBLEtBQVQsQ0FBZUMsR0FBZixFQUFvQkMsR0FBcEIsRUFBeUJDLE1BQXpCLEVBQWlDQyxRQUFqQyxFQUEyQ0MsSUFBM0MsRUFBaURDLEdBQWpELEVBQXNEO0FBQ3JELFNBQU8sRUFBQ0wsS0FBS0EsR0FBTixFQUFXQyxLQUFLQSxHQUFoQixFQUFxQkssT0FBT0osTUFBNUIsRUFBb0NDLFVBQVVBLFFBQTlDLEVBQXdEQyxNQUFNQSxJQUE5RCxFQUFvRUMsS0FBS0EsR0FBekUsRUFBOEVFLFNBQVNDLFNBQXZGLEVBQWtHQyxPQUFPRCxTQUF6RyxFQUFvSEUsUUFBUUYsU0FBNUgsRUFBdUlHLFFBQVFILFNBQS9JLEVBQTBKSSxVQUFVSixTQUFwSyxFQUErS0ssTUFBTSxLQUFyTCxFQUFQO0FBQ0E7QUFDRGQsT0FBTWUsU0FBTixHQUFrQixVQUFTQyxJQUFULEVBQWU7QUFDaEMsTUFBSUMsTUFBTUMsT0FBTixDQUFjRixJQUFkLENBQUosRUFBeUIsT0FBT2hCLE1BQU0sR0FBTixFQUFXUyxTQUFYLEVBQXNCQSxTQUF0QixFQUFpQ1QsTUFBTW1CLGlCQUFOLENBQXdCSCxJQUF4QixDQUFqQyxFQUFnRVAsU0FBaEUsRUFBMkVBLFNBQTNFLENBQVA7QUFDekIsTUFBSU8sUUFBUSxJQUFSLElBQWdCLFFBQU9BLElBQVAseUNBQU9BLElBQVAsT0FBZ0IsUUFBcEMsRUFBOEMsT0FBT2hCLE1BQU0sR0FBTixFQUFXUyxTQUFYLEVBQXNCQSxTQUF0QixFQUFpQ08sU0FBUyxLQUFULEdBQWlCLEVBQWpCLEdBQXNCQSxJQUF2RCxFQUE2RFAsU0FBN0QsRUFBd0VBLFNBQXhFLENBQVA7QUFDOUMsU0FBT08sSUFBUDtBQUNBLEVBSkQ7QUFLQWhCLE9BQU1tQixpQkFBTixHQUEwQixTQUFTQSxpQkFBVCxDQUEyQmYsUUFBM0IsRUFBcUM7QUFDOUQsT0FBSyxJQUFJZ0IsSUFBSSxDQUFiLEVBQWdCQSxJQUFJaEIsU0FBU2lCLE1BQTdCLEVBQXFDRCxHQUFyQyxFQUEwQztBQUN6Q2hCLFlBQVNnQixDQUFULElBQWNwQixNQUFNZSxTQUFOLENBQWdCWCxTQUFTZ0IsQ0FBVCxDQUFoQixDQUFkO0FBQ0E7QUFDRCxTQUFPaEIsUUFBUDtBQUNBLEVBTEQ7QUFNQSxLQUFJa0IsaUJBQWlCLDhFQUFyQjtBQUNBLEtBQUlDLGdCQUFnQixFQUFwQjtBQUNBLEtBQUlDLFNBQVMsR0FBR0MsY0FBaEI7QUFDQSxVQUFTQyxlQUFULENBQXlCQyxRQUF6QixFQUFtQztBQUNsQyxNQUFJQyxLQUFKO0FBQUEsTUFBVzNCLE1BQU0sS0FBakI7QUFBQSxNQUF3QjRCLFVBQVUsRUFBbEM7QUFBQSxNQUFzQ3RCLFFBQVEsRUFBOUM7QUFDQSxTQUFPcUIsUUFBUU4sZUFBZVEsSUFBZixDQUFvQkgsUUFBcEIsQ0FBZixFQUE4QztBQUM3QyxPQUFJSSxPQUFPSCxNQUFNLENBQU4sQ0FBWDtBQUFBLE9BQXFCSSxRQUFRSixNQUFNLENBQU4sQ0FBN0I7QUFDQSxPQUFJRyxTQUFTLEVBQVQsSUFBZUMsVUFBVSxFQUE3QixFQUFpQy9CLE1BQU0rQixLQUFOLENBQWpDLEtBQ0ssSUFBSUQsU0FBUyxHQUFiLEVBQWtCeEIsTUFBTTBCLEVBQU4sR0FBV0QsS0FBWCxDQUFsQixLQUNBLElBQUlELFNBQVMsR0FBYixFQUFrQkYsUUFBUUssSUFBUixDQUFhRixLQUFiLEVBQWxCLEtBQ0EsSUFBSUosTUFBTSxDQUFOLEVBQVMsQ0FBVCxNQUFnQixHQUFwQixFQUF5QjtBQUM3QixRQUFJTyxZQUFZUCxNQUFNLENBQU4sQ0FBaEI7QUFDQSxRQUFJTyxTQUFKLEVBQWVBLFlBQVlBLFVBQVVDLE9BQVYsQ0FBa0IsV0FBbEIsRUFBK0IsSUFBL0IsRUFBcUNBLE9BQXJDLENBQTZDLE9BQTdDLEVBQXNELElBQXRELENBQVo7QUFDZixRQUFJUixNQUFNLENBQU4sTUFBYSxPQUFqQixFQUEwQkMsUUFBUUssSUFBUixDQUFhQyxTQUFiLEVBQTFCLEtBQ0s1QixNQUFNcUIsTUFBTSxDQUFOLENBQU4sSUFBa0JPLGFBQWEsSUFBL0I7QUFDTDtBQUNEO0FBQ0QsTUFBSU4sUUFBUVIsTUFBUixHQUFpQixDQUFyQixFQUF3QmQsTUFBTThCLFNBQU4sR0FBa0JSLFFBQVFTLElBQVIsQ0FBYSxHQUFiLENBQWxCO0FBQ3hCLFNBQU9mLGNBQWNJLFFBQWQsSUFBMEIsRUFBQzFCLEtBQUtBLEdBQU4sRUFBV00sT0FBT0EsS0FBbEIsRUFBakM7QUFDQTtBQUNELFVBQVNnQyxZQUFULENBQXNCN0IsS0FBdEIsRUFBNkJILEtBQTdCLEVBQW9DSCxRQUFwQyxFQUE4QztBQUM3QyxNQUFJb0MsV0FBVyxLQUFmO0FBQUEsTUFBc0JDLFNBQXRCO0FBQUEsTUFBaUNwQyxJQUFqQztBQUNBLE1BQUlnQyxZQUFZOUIsTUFBTThCLFNBQU4sSUFBbUI5QixNQUFNbUMsS0FBekM7QUFDQSxPQUFLLElBQUl4QyxHQUFULElBQWdCUSxNQUFNSCxLQUF0QixFQUE2QjtBQUM1QixPQUFJaUIsT0FBT21CLElBQVAsQ0FBWWpDLE1BQU1ILEtBQWxCLEVBQXlCTCxHQUF6QixDQUFKLEVBQW1DO0FBQ2xDSyxVQUFNTCxHQUFOLElBQWFRLE1BQU1ILEtBQU4sQ0FBWUwsR0FBWixDQUFiO0FBQ0E7QUFDRDtBQUNELE1BQUltQyxhQUFhLElBQWpCLEVBQXVCO0FBQ3RCLE9BQUk5QixNQUFNbUMsS0FBTixJQUFlLElBQW5CLEVBQXlCO0FBQ3hCbkMsVUFBTW1DLEtBQU4sR0FBY2pDLFNBQWQ7QUFDQUYsVUFBTThCLFNBQU4sR0FBa0JBLFNBQWxCO0FBQ0E7QUFDRCxPQUFJM0IsTUFBTUgsS0FBTixDQUFZOEIsU0FBWixJQUF5QixJQUE3QixFQUFtQztBQUNsQzlCLFVBQU04QixTQUFOLEdBQWtCM0IsTUFBTUgsS0FBTixDQUFZOEIsU0FBWixHQUF3QixHQUF4QixHQUE4QkEsU0FBaEQ7QUFDQTtBQUNEO0FBQ0QsT0FBSyxJQUFJbkMsR0FBVCxJQUFnQkssS0FBaEIsRUFBdUI7QUFDdEIsT0FBSWlCLE9BQU9tQixJQUFQLENBQVlwQyxLQUFaLEVBQW1CTCxHQUFuQixLQUEyQkEsUUFBUSxLQUF2QyxFQUE4QztBQUM3Q3NDLGVBQVcsSUFBWDtBQUNBO0FBQ0E7QUFDRDtBQUNELE1BQUl2QixNQUFNQyxPQUFOLENBQWNkLFFBQWQsS0FBMkJBLFNBQVNpQixNQUFULEtBQW9CLENBQS9DLElBQW9EakIsU0FBUyxDQUFULEtBQWUsSUFBbkUsSUFBMkVBLFNBQVMsQ0FBVCxFQUFZSCxHQUFaLEtBQW9CLEdBQW5HLEVBQXdHO0FBQ3ZHSSxVQUFPRCxTQUFTLENBQVQsRUFBWUEsUUFBbkI7QUFDQSxHQUZELE1BRU87QUFDTnFDLGVBQVlyQyxRQUFaO0FBQ0E7QUFDRCxTQUFPSixNQUFNVSxNQUFNVCxHQUFaLEVBQWlCTSxNQUFNTCxHQUF2QixFQUE0QnNDLFdBQVdqQyxLQUFYLEdBQW1CRSxTQUEvQyxFQUEwRGdDLFNBQTFELEVBQXFFcEMsSUFBckUsQ0FBUDtBQUNBO0FBQ0QsVUFBU3VDLFdBQVQsQ0FBcUJqQixRQUFyQixFQUErQjtBQUM5QjtBQUNBLE1BQUlwQixRQUFRc0MsVUFBVSxDQUFWLENBQVo7QUFBQSxNQUEwQkMsUUFBUSxDQUFsQztBQUFBLE1BQXFDMUMsUUFBckM7QUFDQSxNQUFJdUIsWUFBWSxJQUFaLElBQW9CLE9BQU9BLFFBQVAsS0FBb0IsUUFBcEIsSUFBZ0MsT0FBT0EsUUFBUCxLQUFvQixVQUFwRCxJQUFrRSxPQUFPQSxTQUFTb0IsSUFBaEIsS0FBeUIsVUFBbkgsRUFBK0g7QUFDOUgsU0FBTUMsTUFBTSxzREFBTixDQUFOO0FBQ0E7QUFDRCxNQUFJLE9BQU9yQixRQUFQLEtBQW9CLFFBQXhCLEVBQWtDO0FBQ2pDLE9BQUlzQixTQUFTMUIsY0FBY0ksUUFBZCxLQUEyQkQsZ0JBQWdCQyxRQUFoQixDQUF4QztBQUNBO0FBQ0QsTUFBSSxDQUFDcEIsS0FBTCxFQUFZO0FBQ1hBLFdBQVEsRUFBUjtBQUNBLEdBRkQsTUFFTyxJQUFJLFFBQU9BLEtBQVAseUNBQU9BLEtBQVAsT0FBaUIsUUFBakIsSUFBNkJBLE1BQU1OLEdBQU4sSUFBYSxJQUExQyxJQUFrRGdCLE1BQU1DLE9BQU4sQ0FBY1gsS0FBZCxDQUF0RCxFQUE0RTtBQUNsRkEsV0FBUSxFQUFSO0FBQ0F1QyxXQUFRLENBQVI7QUFDQTtBQUNELE1BQUlELFVBQVV4QixNQUFWLEtBQXFCeUIsUUFBUSxDQUFqQyxFQUFvQztBQUNuQzFDLGNBQVd5QyxVQUFVQyxLQUFWLENBQVg7QUFDQSxPQUFJLENBQUM3QixNQUFNQyxPQUFOLENBQWNkLFFBQWQsQ0FBTCxFQUE4QkEsV0FBVyxDQUFDQSxRQUFELENBQVg7QUFDOUIsR0FIRCxNQUdPO0FBQ05BLGNBQVcsRUFBWDtBQUNBLFVBQU8wQyxRQUFRRCxVQUFVeEIsTUFBekI7QUFBaUNqQixhQUFTOEIsSUFBVCxDQUFjVyxVQUFVQyxPQUFWLENBQWQ7QUFBakM7QUFDQTtBQUNELE1BQUlJLGFBQWFsRCxNQUFNbUIsaUJBQU4sQ0FBd0JmLFFBQXhCLENBQWpCO0FBQ0EsTUFBSSxPQUFPdUIsUUFBUCxLQUFvQixRQUF4QixFQUFrQztBQUNqQyxVQUFPWSxhQUFhVSxNQUFiLEVBQXFCMUMsS0FBckIsRUFBNEIyQyxVQUE1QixDQUFQO0FBQ0EsR0FGRCxNQUVPO0FBQ04sVUFBT2xELE1BQU0yQixRQUFOLEVBQWdCcEIsTUFBTUwsR0FBdEIsRUFBMkJLLEtBQTNCLEVBQWtDMkMsVUFBbEMsQ0FBUDtBQUNBO0FBQ0Q7QUFDRE4sYUFBWU8sS0FBWixHQUFvQixVQUFTQyxJQUFULEVBQWU7QUFDbEMsTUFBSUEsUUFBUSxJQUFaLEVBQWtCQSxPQUFPLEVBQVA7QUFDbEIsU0FBT3BELE1BQU0sR0FBTixFQUFXUyxTQUFYLEVBQXNCQSxTQUF0QixFQUFpQzJDLElBQWpDLEVBQXVDM0MsU0FBdkMsRUFBa0RBLFNBQWxELENBQVA7QUFDQSxFQUhEO0FBSUFtQyxhQUFZUyxRQUFaLEdBQXVCLFVBQVNDLE1BQVQsRUFBaUJsRCxRQUFqQixFQUEyQjtBQUNqRCxTQUFPSixNQUFNLEdBQU4sRUFBV3NELE9BQU9wRCxHQUFsQixFQUF1Qm9ELE1BQXZCLEVBQStCdEQsTUFBTW1CLGlCQUFOLENBQXdCZixRQUF4QixDQUEvQixFQUFrRUssU0FBbEUsRUFBNkVBLFNBQTdFLENBQVA7QUFDQSxFQUZEO0FBR0EsS0FBSThDLElBQUlYLFdBQVI7QUFDQTtBQUNBLEtBQUlZLGtCQUFrQixTQUFsQkEsZUFBa0IsQ0FBU0MsUUFBVCxFQUFtQjtBQUN4QyxNQUFJLEVBQUUsZ0JBQWdCRCxlQUFsQixDQUFKLEVBQXdDLE1BQU0sSUFBSVIsS0FBSixDQUFVLG1DQUFWLENBQU47QUFDeEMsTUFBSSxPQUFPUyxRQUFQLEtBQW9CLFVBQXhCLEVBQW9DLE1BQU0sSUFBSUMsU0FBSixDQUFjLDZCQUFkLENBQU47QUFDcEMsTUFBSUMsT0FBTyxJQUFYO0FBQUEsTUFBaUJDLFlBQVksRUFBN0I7QUFBQSxNQUFpQ0MsWUFBWSxFQUE3QztBQUFBLE1BQWlEQyxpQkFBaUJDLFFBQVFILFNBQVIsRUFBbUIsSUFBbkIsQ0FBbEU7QUFBQSxNQUE0RkksZ0JBQWdCRCxRQUFRRixTQUFSLEVBQW1CLEtBQW5CLENBQTVHO0FBQ0EsTUFBSWhELFdBQVc4QyxLQUFLTSxTQUFMLEdBQWlCLEVBQUNMLFdBQVdBLFNBQVosRUFBdUJDLFdBQVdBLFNBQWxDLEVBQWhDO0FBQ0EsTUFBSUssWUFBWSxPQUFPQyxZQUFQLEtBQXdCLFVBQXhCLEdBQXFDQSxZQUFyQyxHQUFvREMsVUFBcEU7QUFDQSxXQUFTTCxPQUFULENBQWlCTSxJQUFqQixFQUF1QkMsWUFBdkIsRUFBcUM7QUFDcEMsVUFBTyxTQUFTQyxPQUFULENBQWlCdkMsS0FBakIsRUFBd0I7QUFDOUIsUUFBSXdDLElBQUo7QUFDQSxRQUFJO0FBQ0gsU0FBSUYsZ0JBQWdCdEMsU0FBUyxJQUF6QixLQUFrQyxRQUFPQSxLQUFQLHlDQUFPQSxLQUFQLE9BQWlCLFFBQWpCLElBQTZCLE9BQU9BLEtBQVAsS0FBaUIsVUFBaEYsS0FBK0YsUUFBUXdDLE9BQU94QyxNQUFNd0MsSUFBckIsTUFBK0IsVUFBbEksRUFBOEk7QUFDN0ksVUFBSXhDLFVBQVUyQixJQUFkLEVBQW9CLE1BQU0sSUFBSUQsU0FBSixDQUFjLHFDQUFkLENBQU47QUFDcEJlLGtCQUFZRCxLQUFLRSxJQUFMLENBQVUxQyxLQUFWLENBQVo7QUFDQSxNQUhELE1BSUs7QUFDSmtDLGdCQUFVLFlBQVc7QUFDcEIsV0FBSSxDQUFDSSxZQUFELElBQWlCRCxLQUFLaEQsTUFBTCxLQUFnQixDQUFyQyxFQUF3Q3NELFFBQVFDLEtBQVIsQ0FBYyx1Q0FBZCxFQUF1RDVDLEtBQXZEO0FBQ3hDLFlBQUssSUFBSVosSUFBSSxDQUFiLEVBQWdCQSxJQUFJaUQsS0FBS2hELE1BQXpCLEVBQWlDRCxHQUFqQztBQUFzQ2lELGFBQUtqRCxDQUFMLEVBQVFZLEtBQVI7QUFBdEMsUUFDQTRCLFVBQVV2QyxNQUFWLEdBQW1CLENBQW5CLEVBQXNCd0MsVUFBVXhDLE1BQVYsR0FBbUIsQ0FBekM7QUFDQVIsZ0JBQVNILEtBQVQsR0FBaUI0RCxZQUFqQjtBQUNBekQsZ0JBQVNnRSxLQUFULEdBQWlCLFlBQVc7QUFBQ04sZ0JBQVF2QyxLQUFSO0FBQWUsUUFBNUM7QUFDQSxPQU5EO0FBT0E7QUFDRCxLQWRELENBZUEsT0FBTzhDLENBQVAsRUFBVTtBQUNUZCxtQkFBY2MsQ0FBZDtBQUNBO0FBQ0QsSUFwQkQ7QUFxQkE7QUFDRCxXQUFTTCxXQUFULENBQXFCRCxJQUFyQixFQUEyQjtBQUMxQixPQUFJTyxPQUFPLENBQVg7QUFDQSxZQUFTQyxHQUFULENBQWFDLEVBQWIsRUFBaUI7QUFDaEIsV0FBTyxVQUFTakQsS0FBVCxFQUFnQjtBQUN0QixTQUFJK0MsU0FBUyxDQUFiLEVBQWdCO0FBQ2hCRSxRQUFHakQsS0FBSDtBQUNBLEtBSEQ7QUFJQTtBQUNELE9BQUlrRCxVQUFVRixJQUFJaEIsYUFBSixDQUFkO0FBQ0EsT0FBSTtBQUFDUSxTQUFLUSxJQUFJbEIsY0FBSixDQUFMLEVBQTBCb0IsT0FBMUI7QUFBbUMsSUFBeEMsQ0FBeUMsT0FBT0osQ0FBUCxFQUFVO0FBQUNJLFlBQVFKLENBQVI7QUFBVztBQUMvRDtBQUNETCxjQUFZaEIsUUFBWjtBQUNBLEVBekNEO0FBMENBRCxpQkFBZ0IyQixTQUFoQixDQUEwQlgsSUFBMUIsR0FBaUMsVUFBU1ksV0FBVCxFQUFzQkMsV0FBdEIsRUFBbUM7QUFDbkUsTUFBSTFCLE9BQU8sSUFBWDtBQUFBLE1BQWlCOUMsV0FBVzhDLEtBQUtNLFNBQWpDO0FBQ0EsV0FBU3FCLE1BQVQsQ0FBZ0JDLFFBQWhCLEVBQTBCbEIsSUFBMUIsRUFBZ0NtQixJQUFoQyxFQUFzQzlFLEtBQXRDLEVBQTZDO0FBQzVDMkQsUUFBS25DLElBQUwsQ0FBVSxVQUFTRixLQUFULEVBQWdCO0FBQ3pCLFFBQUksT0FBT3VELFFBQVAsS0FBb0IsVUFBeEIsRUFBb0NDLEtBQUt4RCxLQUFMLEVBQXBDLEtBQ0ssSUFBSTtBQUFDeUQsaUJBQVlGLFNBQVN2RCxLQUFULENBQVo7QUFBNkIsS0FBbEMsQ0FBbUMsT0FBTzhDLENBQVAsRUFBVTtBQUFDLFNBQUlZLFVBQUosRUFBZ0JBLFdBQVdaLENBQVg7QUFBYztBQUNqRixJQUhEO0FBSUEsT0FBSSxPQUFPakUsU0FBU2dFLEtBQWhCLEtBQTBCLFVBQTFCLElBQXdDbkUsVUFBVUcsU0FBU0gsS0FBL0QsRUFBc0VHLFNBQVNnRSxLQUFUO0FBQ3RFO0FBQ0QsTUFBSVksV0FBSixFQUFpQkMsVUFBakI7QUFDQSxNQUFJQyxVQUFVLElBQUluQyxlQUFKLENBQW9CLFVBQVNvQyxPQUFULEVBQWtCQyxNQUFsQixFQUEwQjtBQUFDSixpQkFBY0csT0FBZCxFQUF1QkYsYUFBYUcsTUFBcEM7QUFBMkMsR0FBMUYsQ0FBZDtBQUNBUCxTQUFPRixXQUFQLEVBQW9CdkUsU0FBUytDLFNBQTdCLEVBQXdDNkIsV0FBeEMsRUFBcUQsSUFBckQsR0FBNERILE9BQU9ELFdBQVAsRUFBb0J4RSxTQUFTZ0QsU0FBN0IsRUFBd0M2QixVQUF4QyxFQUFvRCxLQUFwRCxDQUE1RDtBQUNBLFNBQU9DLE9BQVA7QUFDQSxFQWJEO0FBY0FuQyxpQkFBZ0IyQixTQUFoQixDQUEwQlcsS0FBMUIsR0FBa0MsVUFBU1QsV0FBVCxFQUFzQjtBQUN2RCxTQUFPLEtBQUtiLElBQUwsQ0FBVSxJQUFWLEVBQWdCYSxXQUFoQixDQUFQO0FBQ0EsRUFGRDtBQUdBN0IsaUJBQWdCb0MsT0FBaEIsR0FBMEIsVUFBUzVELEtBQVQsRUFBZ0I7QUFDekMsTUFBSUEsaUJBQWlCd0IsZUFBckIsRUFBc0MsT0FBT3hCLEtBQVA7QUFDdEMsU0FBTyxJQUFJd0IsZUFBSixDQUFvQixVQUFTb0MsT0FBVCxFQUFrQjtBQUFDQSxXQUFRNUQsS0FBUjtBQUFlLEdBQXRELENBQVA7QUFDQSxFQUhEO0FBSUF3QixpQkFBZ0JxQyxNQUFoQixHQUF5QixVQUFTN0QsS0FBVCxFQUFnQjtBQUN4QyxTQUFPLElBQUl3QixlQUFKLENBQW9CLFVBQVNvQyxPQUFULEVBQWtCQyxNQUFsQixFQUEwQjtBQUFDQSxVQUFPN0QsS0FBUDtBQUFjLEdBQTdELENBQVA7QUFDQSxFQUZEO0FBR0F3QixpQkFBZ0J1QyxHQUFoQixHQUFzQixVQUFTMUIsSUFBVCxFQUFlO0FBQ3BDLFNBQU8sSUFBSWIsZUFBSixDQUFvQixVQUFTb0MsT0FBVCxFQUFrQkMsTUFBbEIsRUFBMEI7QUFDcEQsT0FBSUcsUUFBUTNCLEtBQUtoRCxNQUFqQjtBQUFBLE9BQXlCNEUsUUFBUSxDQUFqQztBQUFBLE9BQW9DQyxTQUFTLEVBQTdDO0FBQ0EsT0FBSTdCLEtBQUtoRCxNQUFMLEtBQWdCLENBQXBCLEVBQXVCdUUsUUFBUSxFQUFSLEVBQXZCLEtBQ0ssS0FBSyxJQUFJeEUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJaUQsS0FBS2hELE1BQXpCLEVBQWlDRCxHQUFqQyxFQUFzQztBQUMxQyxLQUFDLFVBQVNBLENBQVQsRUFBWTtBQUNaLGNBQVMrRSxPQUFULENBQWlCbkUsS0FBakIsRUFBd0I7QUFDdkJpRTtBQUNBQyxhQUFPOUUsQ0FBUCxJQUFZWSxLQUFaO0FBQ0EsVUFBSWlFLFVBQVVELEtBQWQsRUFBcUJKLFFBQVFNLE1BQVI7QUFDckI7QUFDRCxTQUFJN0IsS0FBS2pELENBQUwsS0FBVyxJQUFYLEtBQW9CLFFBQU9pRCxLQUFLakQsQ0FBTCxDQUFQLE1BQW1CLFFBQW5CLElBQStCLE9BQU9pRCxLQUFLakQsQ0FBTCxDQUFQLEtBQW1CLFVBQXRFLEtBQXFGLE9BQU9pRCxLQUFLakQsQ0FBTCxFQUFRb0QsSUFBZixLQUF3QixVQUFqSCxFQUE2SDtBQUM1SEgsV0FBS2pELENBQUwsRUFBUW9ELElBQVIsQ0FBYTJCLE9BQWIsRUFBc0JOLE1BQXRCO0FBQ0EsTUFGRCxNQUdLTSxRQUFROUIsS0FBS2pELENBQUwsQ0FBUjtBQUNMLEtBVkQsRUFVR0EsQ0FWSDtBQVdBO0FBQ0QsR0FoQk0sQ0FBUDtBQWlCQSxFQWxCRDtBQW1CQW9DLGlCQUFnQjRDLElBQWhCLEdBQXVCLFVBQVMvQixJQUFULEVBQWU7QUFDckMsU0FBTyxJQUFJYixlQUFKLENBQW9CLFVBQVNvQyxPQUFULEVBQWtCQyxNQUFsQixFQUEwQjtBQUNwRCxRQUFLLElBQUl6RSxJQUFJLENBQWIsRUFBZ0JBLElBQUlpRCxLQUFLaEQsTUFBekIsRUFBaUNELEdBQWpDLEVBQXNDO0FBQ3JDaUQsU0FBS2pELENBQUwsRUFBUW9ELElBQVIsQ0FBYW9CLE9BQWIsRUFBc0JDLE1BQXRCO0FBQ0E7QUFDRCxHQUpNLENBQVA7QUFLQSxFQU5EO0FBT0EsS0FBSSxPQUFPUSxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2xDLE1BQUksT0FBT0EsT0FBT0MsT0FBZCxLQUEwQixXQUE5QixFQUEyQ0QsT0FBT0MsT0FBUCxHQUFpQjlDLGVBQWpCO0FBQzNDLE1BQUlBLGtCQUFrQjZDLE9BQU9DLE9BQTdCO0FBQ0EsRUFIRCxNQUdPLElBQUksT0FBT0MsTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUN6QyxNQUFJLE9BQU9BLE9BQU9ELE9BQWQsS0FBMEIsV0FBOUIsRUFBMkNDLE9BQU9ELE9BQVAsR0FBaUI5QyxlQUFqQjtBQUMzQyxNQUFJQSxrQkFBa0IrQyxPQUFPRCxPQUE3QjtBQUNBLEVBSE0sTUFHQSxDQUNOO0FBQ0QsS0FBSUUsbUJBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBU0MsTUFBVCxFQUFpQjtBQUN2QyxNQUFJQyxPQUFPdkIsU0FBUCxDQUFpQndCLFFBQWpCLENBQTBCaEUsSUFBMUIsQ0FBK0I4RCxNQUEvQixNQUEyQyxpQkFBL0MsRUFBa0UsT0FBTyxFQUFQO0FBQ2xFLE1BQUlHLE9BQU8sRUFBWDtBQUNBLE9BQUssSUFBSUMsSUFBVCxJQUFpQkosTUFBakIsRUFBeUI7QUFDeEJLLGVBQVlELElBQVosRUFBa0JKLE9BQU9JLElBQVAsQ0FBbEI7QUFDQTtBQUNELFNBQU9ELEtBQUt0RSxJQUFMLENBQVUsR0FBVixDQUFQO0FBQ0EsV0FBU3dFLFdBQVQsQ0FBcUJELElBQXJCLEVBQTJCN0UsS0FBM0IsRUFBa0M7QUFDakMsT0FBSWYsTUFBTUMsT0FBTixDQUFjYyxLQUFkLENBQUosRUFBMEI7QUFDekIsU0FBSyxJQUFJWixJQUFJLENBQWIsRUFBZ0JBLElBQUlZLE1BQU1YLE1BQTFCLEVBQWtDRCxHQUFsQyxFQUF1QztBQUN0QzBGLGlCQUFZRCxPQUFPLEdBQVAsR0FBYXpGLENBQWIsR0FBaUIsR0FBN0IsRUFBa0NZLE1BQU1aLENBQU4sQ0FBbEM7QUFDQTtBQUNELElBSkQsTUFLSyxJQUFJc0YsT0FBT3ZCLFNBQVAsQ0FBaUJ3QixRQUFqQixDQUEwQmhFLElBQTFCLENBQStCWCxLQUEvQixNQUEwQyxpQkFBOUMsRUFBaUU7QUFDckUsU0FBSyxJQUFJWixDQUFULElBQWNZLEtBQWQsRUFBcUI7QUFDcEI4RSxpQkFBWUQsT0FBTyxHQUFQLEdBQWF6RixDQUFiLEdBQWlCLEdBQTdCLEVBQWtDWSxNQUFNWixDQUFOLENBQWxDO0FBQ0E7QUFDRCxJQUpJLE1BS0F3RixLQUFLMUUsSUFBTCxDQUFVNkUsbUJBQW1CRixJQUFuQixLQUE0QjdFLFNBQVMsSUFBVCxJQUFpQkEsVUFBVSxFQUEzQixHQUFnQyxNQUFNK0UsbUJBQW1CL0UsS0FBbkIsQ0FBdEMsR0FBa0UsRUFBOUYsQ0FBVjtBQUNMO0FBQ0QsRUFwQkQ7QUFxQkEsS0FBSWdGLHNCQUFzQixJQUFJQyxNQUFKLENBQVcsVUFBWCxFQUF1QixHQUF2QixDQUExQjtBQUNBLEtBQUlDLEtBQUssU0FBTEEsRUFBSyxDQUFTQyxPQUFULEVBQWtCYixPQUFsQixFQUEyQjtBQUNuQyxNQUFJYyxnQkFBZ0IsQ0FBcEI7QUFDQSxNQUFJQyxZQUFKO0FBQ0EsV0FBU0MscUJBQVQsQ0FBK0IvQixRQUEvQixFQUF5QztBQUFDOEIsa0JBQWU5QixRQUFmO0FBQXdCO0FBQ2xFLFdBQVNnQyxTQUFULEdBQXFCO0FBQ3BCLE9BQUl0QixRQUFRLENBQVo7QUFDQSxZQUFTdUIsUUFBVCxHQUFvQjtBQUFDLFFBQUksRUFBRXZCLEtBQUYsS0FBWSxDQUFaLElBQWlCLE9BQU9vQixZQUFQLEtBQXdCLFVBQTdDLEVBQXlEQTtBQUFlO0FBQzdGLFVBQU8sU0FBU0ksUUFBVCxDQUFrQkMsUUFBbEIsRUFBNEI7QUFDbEMsUUFBSUMsUUFBUUQsU0FBU2xELElBQXJCO0FBQ0FrRCxhQUFTbEQsSUFBVCxHQUFnQixZQUFXO0FBQzFCeUI7QUFDQSxTQUFJVCxPQUFPbUMsTUFBTUMsS0FBTixDQUFZRixRQUFaLEVBQXNCN0UsU0FBdEIsQ0FBWDtBQUNBMkMsVUFBS2hCLElBQUwsQ0FBVWdELFFBQVYsRUFBb0IsVUFBUzFDLENBQVQsRUFBWTtBQUMvQjBDO0FBQ0EsVUFBSXZCLFVBQVUsQ0FBZCxFQUFpQixNQUFNbkIsQ0FBTjtBQUNqQixNQUhEO0FBSUEsWUFBTzJDLFNBQVNqQyxJQUFULENBQVA7QUFDQSxLQVJEO0FBU0EsV0FBT2tDLFFBQVA7QUFDQSxJQVpEO0FBYUE7QUFDRCxXQUFTM0csU0FBVCxDQUFtQjZGLElBQW5CLEVBQXlCaUIsS0FBekIsRUFBZ0M7QUFDL0IsT0FBSSxPQUFPakIsSUFBUCxLQUFnQixRQUFwQixFQUE4QjtBQUM3QixRQUFJa0IsTUFBTWxCLElBQVY7QUFDQUEsV0FBT2lCLFNBQVMsRUFBaEI7QUFDQSxRQUFJakIsS0FBS2tCLEdBQUwsSUFBWSxJQUFoQixFQUFzQmxCLEtBQUtrQixHQUFMLEdBQVdBLEdBQVg7QUFDdEI7QUFDRCxVQUFPbEIsSUFBUDtBQUNBO0FBQ0QsV0FBU21CLE9BQVQsQ0FBaUJuQixJQUFqQixFQUF1QmlCLEtBQXZCLEVBQThCO0FBQzdCLE9BQUlKLFdBQVdGLFdBQWY7QUFDQVgsVUFBTzdGLFVBQVU2RixJQUFWLEVBQWdCaUIsS0FBaEIsQ0FBUDtBQUNBLE9BQUlILFdBQVcsSUFBSXBCLE9BQUosQ0FBWSxVQUFTVixPQUFULEVBQWtCQyxNQUFsQixFQUEwQjtBQUNwRCxRQUFJZSxLQUFLb0IsTUFBTCxJQUFlLElBQW5CLEVBQXlCcEIsS0FBS29CLE1BQUwsR0FBYyxLQUFkO0FBQ3pCcEIsU0FBS29CLE1BQUwsR0FBY3BCLEtBQUtvQixNQUFMLENBQVlDLFdBQVosRUFBZDtBQUNBLFFBQUlDLFVBQVd0QixLQUFLb0IsTUFBTCxLQUFnQixLQUFoQixJQUF5QnBCLEtBQUtvQixNQUFMLEtBQWdCLE9BQTFDLEdBQXFELEtBQXJELEdBQThELE9BQU9wQixLQUFLc0IsT0FBWixLQUF3QixTQUF4QixHQUFvQ3RCLEtBQUtzQixPQUF6QyxHQUFtRCxJQUEvSDtBQUNBLFFBQUksT0FBT3RCLEtBQUt1QixTQUFaLEtBQTBCLFVBQTlCLEVBQTBDdkIsS0FBS3VCLFNBQUwsR0FBaUIsT0FBT0MsUUFBUCxLQUFvQixXQUFwQixJQUFtQ3hCLEtBQUt5QixJQUFMLFlBQXFCRCxRQUF4RCxHQUFtRSxVQUFTcEcsS0FBVCxFQUFnQjtBQUFDLFlBQU9BLEtBQVA7QUFBYSxLQUFqRyxHQUFvR3NHLEtBQUtDLFNBQTFIO0FBQzFDLFFBQUksT0FBTzNCLEtBQUs0QixXQUFaLEtBQTRCLFVBQWhDLEVBQTRDNUIsS0FBSzRCLFdBQUwsR0FBbUJBLFdBQW5CO0FBQzVDLFFBQUksT0FBTzVCLEtBQUs2QixPQUFaLEtBQXdCLFVBQTVCLEVBQXdDN0IsS0FBSzZCLE9BQUwsR0FBZUEsT0FBZjtBQUN4QzdCLFNBQUtrQixHQUFMLEdBQVdZLFlBQVk5QixLQUFLa0IsR0FBakIsRUFBc0JsQixLQUFLeUIsSUFBM0IsQ0FBWDtBQUNBLFFBQUlILE9BQUosRUFBYXRCLEtBQUt5QixJQUFMLEdBQVl6QixLQUFLdUIsU0FBTCxDQUFldkIsS0FBS3lCLElBQXBCLENBQVosQ0FBYixLQUNLekIsS0FBS2tCLEdBQUwsR0FBV2EsU0FBUy9CLEtBQUtrQixHQUFkLEVBQW1CbEIsS0FBS3lCLElBQXhCLENBQVg7QUFDTCxRQUFJTyxNQUFNLElBQUl6QixRQUFRMEIsY0FBWixFQUFWO0FBQUEsUUFDQ0MsVUFBVSxLQURYO0FBQUEsUUFFQ0MsU0FBU0gsSUFBSUksS0FGZDtBQUdBSixRQUFJSSxLQUFKLEdBQVksU0FBU0EsS0FBVCxHQUFpQjtBQUM1QkYsZUFBVSxJQUFWO0FBQ0FDLFlBQU9wRyxJQUFQLENBQVlpRyxHQUFaO0FBQ0EsS0FIRDtBQUlBQSxRQUFJSyxJQUFKLENBQVNyQyxLQUFLb0IsTUFBZCxFQUFzQnBCLEtBQUtrQixHQUEzQixFQUFnQyxPQUFPbEIsS0FBS3NDLEtBQVosS0FBc0IsU0FBdEIsR0FBa0N0QyxLQUFLc0MsS0FBdkMsR0FBK0MsSUFBL0UsRUFBcUYsT0FBT3RDLEtBQUt1QyxJQUFaLEtBQXFCLFFBQXJCLEdBQWdDdkMsS0FBS3VDLElBQXJDLEdBQTRDMUksU0FBakksRUFBNEksT0FBT21HLEtBQUt3QyxRQUFaLEtBQXlCLFFBQXpCLEdBQW9DeEMsS0FBS3dDLFFBQXpDLEdBQW9EM0ksU0FBaE07QUFDQSxRQUFJbUcsS0FBS3VCLFNBQUwsS0FBbUJHLEtBQUtDLFNBQXhCLElBQXFDTCxPQUF6QyxFQUFrRDtBQUNqRFUsU0FBSVMsZ0JBQUosQ0FBcUIsY0FBckIsRUFBcUMsaUNBQXJDO0FBQ0E7QUFDRCxRQUFJekMsS0FBSzRCLFdBQUwsS0FBcUJBLFdBQXpCLEVBQXNDO0FBQ3JDSSxTQUFJUyxnQkFBSixDQUFxQixRQUFyQixFQUErQiwwQkFBL0I7QUFDQTtBQUNELFFBQUl6QyxLQUFLMEMsZUFBVCxFQUEwQlYsSUFBSVUsZUFBSixHQUFzQjFDLEtBQUswQyxlQUEzQjtBQUMxQixTQUFLLElBQUlwSixHQUFULElBQWdCMEcsS0FBSzJDLE9BQXJCO0FBQThCLFNBQUksR0FBRzlILGNBQUgsQ0FBa0JrQixJQUFsQixDQUF1QmlFLEtBQUsyQyxPQUE1QixFQUFxQ3JKLEdBQXJDLENBQUosRUFBK0M7QUFDNUUwSSxVQUFJUyxnQkFBSixDQUFxQm5KLEdBQXJCLEVBQTBCMEcsS0FBSzJDLE9BQUwsQ0FBYXJKLEdBQWIsQ0FBMUI7QUFDQTtBQUZELEtBR0EsSUFBSSxPQUFPMEcsS0FBSzRDLE1BQVosS0FBdUIsVUFBM0IsRUFBdUNaLE1BQU1oQyxLQUFLNEMsTUFBTCxDQUFZWixHQUFaLEVBQWlCaEMsSUFBakIsS0FBMEJnQyxHQUFoQztBQUN2Q0EsUUFBSWEsa0JBQUosR0FBeUIsWUFBVztBQUNuQztBQUNBLFNBQUdYLE9BQUgsRUFBWTtBQUNaLFNBQUlGLElBQUljLFVBQUosS0FBbUIsQ0FBdkIsRUFBMEI7QUFDekIsVUFBSTtBQUNILFdBQUlDLFdBQVkvQyxLQUFLNkIsT0FBTCxLQUFpQkEsT0FBbEIsR0FBNkI3QixLQUFLNkIsT0FBTCxDQUFhRyxHQUFiLEVBQWtCaEMsSUFBbEIsQ0FBN0IsR0FBdURBLEtBQUs0QixXQUFMLENBQWlCNUIsS0FBSzZCLE9BQUwsQ0FBYUcsR0FBYixFQUFrQmhDLElBQWxCLENBQWpCLENBQXRFO0FBQ0EsV0FBS2dDLElBQUlnQixNQUFKLElBQWMsR0FBZCxJQUFxQmhCLElBQUlnQixNQUFKLEdBQWEsR0FBbkMsSUFBMkNoQixJQUFJZ0IsTUFBSixLQUFlLEdBQTFELElBQWlFNUMsb0JBQW9CNkMsSUFBcEIsQ0FBeUJqRCxLQUFLa0IsR0FBOUIsQ0FBckUsRUFBeUc7QUFDeEdsQyxnQkFBUWtFLEtBQUtsRCxLQUFLN0UsSUFBVixFQUFnQjRILFFBQWhCLENBQVI7QUFDQSxRQUZELE1BR0s7QUFDSixZQUFJL0UsUUFBUSxJQUFJNUIsS0FBSixDQUFVNEYsSUFBSW1CLFlBQWQsQ0FBWjtBQUNBLGFBQUssSUFBSTdKLEdBQVQsSUFBZ0J5SixRQUFoQjtBQUEwQi9FLGVBQU0xRSxHQUFOLElBQWF5SixTQUFTekosR0FBVCxDQUFiO0FBQTFCLFNBQ0EyRixPQUFPakIsS0FBUDtBQUNBO0FBQ0QsT0FWRCxDQVdBLE9BQU9FLENBQVAsRUFBVTtBQUNUZSxjQUFPZixDQUFQO0FBQ0E7QUFDRDtBQUNELEtBbkJEO0FBb0JBLFFBQUlvRCxXQUFZdEIsS0FBS3lCLElBQUwsSUFBYSxJQUE3QixFQUFvQ08sSUFBSW9CLElBQUosQ0FBU3BELEtBQUt5QixJQUFkLEVBQXBDLEtBQ0tPLElBQUlvQixJQUFKO0FBQ0wsSUFuRGMsQ0FBZjtBQW9EQSxVQUFPcEQsS0FBS3FELFVBQUwsS0FBb0IsSUFBcEIsR0FBMkJ2QyxRQUEzQixHQUFzQ0QsU0FBU0MsUUFBVCxDQUE3QztBQUNBO0FBQ0QsV0FBU3dDLEtBQVQsQ0FBZXRELElBQWYsRUFBcUJpQixLQUFyQixFQUE0QjtBQUMzQixPQUFJSixXQUFXRixXQUFmO0FBQ0FYLFVBQU83RixVQUFVNkYsSUFBVixFQUFnQmlCLEtBQWhCLENBQVA7QUFDQSxPQUFJSCxXQUFXLElBQUlwQixPQUFKLENBQVksVUFBU1YsT0FBVCxFQUFrQkMsTUFBbEIsRUFBMEI7QUFDcEQsUUFBSXNFLGVBQWV2RCxLQUFLdUQsWUFBTCxJQUFxQixjQUFjQyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0IsSUFBM0IsQ0FBZCxHQUFpRCxHQUFqRCxHQUF1RGxELGVBQS9GO0FBQ0EsUUFBSW1ELFNBQVNwRCxRQUFRcUQsUUFBUixDQUFpQkMsYUFBakIsQ0FBK0IsUUFBL0IsQ0FBYjtBQUNBdEQsWUFBUWdELFlBQVIsSUFBd0IsVUFBUzlCLElBQVQsRUFBZTtBQUN0Q2tDLFlBQU9HLFVBQVAsQ0FBa0JDLFdBQWxCLENBQThCSixNQUE5QjtBQUNBM0UsYUFBUWtFLEtBQUtsRCxLQUFLN0UsSUFBVixFQUFnQnNHLElBQWhCLENBQVI7QUFDQSxZQUFPbEIsUUFBUWdELFlBQVIsQ0FBUDtBQUNBLEtBSkQ7QUFLQUksV0FBT3JGLE9BQVAsR0FBaUIsWUFBVztBQUMzQnFGLFlBQU9HLFVBQVAsQ0FBa0JDLFdBQWxCLENBQThCSixNQUE5QjtBQUNBMUUsWUFBTyxJQUFJN0MsS0FBSixDQUFVLHNCQUFWLENBQVA7QUFDQSxZQUFPbUUsUUFBUWdELFlBQVIsQ0FBUDtBQUNBLEtBSkQ7QUFLQSxRQUFJdkQsS0FBS3lCLElBQUwsSUFBYSxJQUFqQixFQUF1QnpCLEtBQUt5QixJQUFMLEdBQVksRUFBWjtBQUN2QnpCLFNBQUtrQixHQUFMLEdBQVdZLFlBQVk5QixLQUFLa0IsR0FBakIsRUFBc0JsQixLQUFLeUIsSUFBM0IsQ0FBWDtBQUNBekIsU0FBS3lCLElBQUwsQ0FBVXpCLEtBQUtnRSxXQUFMLElBQW9CLFVBQTlCLElBQTRDVCxZQUE1QztBQUNBSSxXQUFPTSxHQUFQLEdBQWFsQyxTQUFTL0IsS0FBS2tCLEdBQWQsRUFBbUJsQixLQUFLeUIsSUFBeEIsQ0FBYjtBQUNBbEIsWUFBUXFELFFBQVIsQ0FBaUJNLGVBQWpCLENBQWlDQyxXQUFqQyxDQUE2Q1IsTUFBN0M7QUFDQSxJQWxCYyxDQUFmO0FBbUJBLFVBQU8zRCxLQUFLcUQsVUFBTCxLQUFvQixJQUFwQixHQUEwQnZDLFFBQTFCLEdBQXFDRCxTQUFTQyxRQUFULENBQTVDO0FBQ0E7QUFDRCxXQUFTZ0IsV0FBVCxDQUFxQlosR0FBckIsRUFBMEJPLElBQTFCLEVBQWdDO0FBQy9CLE9BQUlBLFFBQVEsSUFBWixFQUFrQixPQUFPUCxHQUFQO0FBQ2xCLE9BQUlrRCxTQUFTbEQsSUFBSWxHLEtBQUosQ0FBVSxXQUFWLEtBQTBCLEVBQXZDO0FBQ0EsUUFBSyxJQUFJUixJQUFJLENBQWIsRUFBZ0JBLElBQUk0SixPQUFPM0osTUFBM0IsRUFBbUNELEdBQW5DLEVBQXdDO0FBQ3ZDLFFBQUlsQixNQUFNOEssT0FBTzVKLENBQVAsRUFBVTZKLEtBQVYsQ0FBZ0IsQ0FBaEIsQ0FBVjtBQUNBLFFBQUk1QyxLQUFLbkksR0FBTCxLQUFhLElBQWpCLEVBQXVCO0FBQ3RCNEgsV0FBTUEsSUFBSTFGLE9BQUosQ0FBWTRJLE9BQU81SixDQUFQLENBQVosRUFBdUJpSCxLQUFLbkksR0FBTCxDQUF2QixDQUFOO0FBQ0E7QUFDRDtBQUNELFVBQU80SCxHQUFQO0FBQ0E7QUFDRCxXQUFTYSxRQUFULENBQWtCYixHQUFsQixFQUF1Qk8sSUFBdkIsRUFBNkI7QUFDNUIsT0FBSTZDLGNBQWMxRSxpQkFBaUI2QixJQUFqQixDQUFsQjtBQUNBLE9BQUk2QyxnQkFBZ0IsRUFBcEIsRUFBd0I7QUFDdkIsUUFBSUMsU0FBU3JELElBQUlzRCxPQUFKLENBQVksR0FBWixJQUFtQixDQUFuQixHQUF1QixHQUF2QixHQUE2QixHQUExQztBQUNBdEQsV0FBT3FELFNBQVNELFdBQWhCO0FBQ0E7QUFDRCxVQUFPcEQsR0FBUDtBQUNBO0FBQ0QsV0FBU1UsV0FBVCxDQUFxQkgsSUFBckIsRUFBMkI7QUFDMUIsT0FBSTtBQUFDLFdBQU9BLFNBQVMsRUFBVCxHQUFjQyxLQUFLK0MsS0FBTCxDQUFXaEQsSUFBWCxDQUFkLEdBQWlDLElBQXhDO0FBQTZDLElBQWxELENBQ0EsT0FBT3ZELENBQVAsRUFBVTtBQUFDLFVBQU0sSUFBSTlCLEtBQUosQ0FBVXFGLElBQVYsQ0FBTjtBQUFzQjtBQUNqQztBQUNELFdBQVNJLE9BQVQsQ0FBaUJHLEdBQWpCLEVBQXNCO0FBQUMsVUFBT0EsSUFBSW1CLFlBQVg7QUFBd0I7QUFDL0MsV0FBU0QsSUFBVCxDQUFjd0IsS0FBZCxFQUFxQmpELElBQXJCLEVBQTJCO0FBQzFCLE9BQUksT0FBT2lELEtBQVAsS0FBaUIsVUFBckIsRUFBaUM7QUFDaEMsUUFBSXJLLE1BQU1DLE9BQU4sQ0FBY21ILElBQWQsQ0FBSixFQUF5QjtBQUN4QixVQUFLLElBQUlqSCxJQUFJLENBQWIsRUFBZ0JBLElBQUlpSCxLQUFLaEgsTUFBekIsRUFBaUNELEdBQWpDLEVBQXNDO0FBQ3JDaUgsV0FBS2pILENBQUwsSUFBVSxJQUFJa0ssS0FBSixDQUFVakQsS0FBS2pILENBQUwsQ0FBVixDQUFWO0FBQ0E7QUFDRCxLQUpELE1BS0ssT0FBTyxJQUFJa0ssS0FBSixDQUFVakQsSUFBVixDQUFQO0FBQ0w7QUFDRCxVQUFPQSxJQUFQO0FBQ0E7QUFDRCxTQUFPLEVBQUNOLFNBQVNBLE9BQVYsRUFBbUJtQyxPQUFPQSxLQUExQixFQUFpQzVDLHVCQUF1QkEscUJBQXhELEVBQVA7QUFDQSxFQWxKRDtBQW1KQSxLQUFJaUUsaUJBQWlCckUsR0FBR2IsTUFBSCxFQUFXN0MsZUFBWCxDQUFyQjtBQUNBLEtBQUlnSSxlQUFlLFNBQWZBLFlBQWUsQ0FBU3JFLE9BQVQsRUFBa0I7QUFDcEMsTUFBSXNFLE9BQU90RSxRQUFRcUQsUUFBbkI7QUFDQSxNQUFJa0IsaUJBQWlCRCxLQUFLRSxzQkFBTCxFQUFyQjtBQUNBLE1BQUlDLE9BQUo7QUFDQSxXQUFTQyxnQkFBVCxDQUEwQnRHLFFBQTFCLEVBQW9DO0FBQUMsVUFBT3FHLFVBQVVyRyxRQUFqQjtBQUEwQjtBQUMvRDtBQUNBLFdBQVN1RyxXQUFULENBQXFCQyxNQUFyQixFQUE2QkMsTUFBN0IsRUFBcUNsSixLQUFyQyxFQUE0Q21KLEdBQTVDLEVBQWlEQyxLQUFqRCxFQUF3REMsV0FBeEQsRUFBcUVDLEVBQXJFLEVBQXlFO0FBQ3hFLFFBQUssSUFBSWhMLElBQUkwQixLQUFiLEVBQW9CMUIsSUFBSTZLLEdBQXhCLEVBQTZCN0ssR0FBN0IsRUFBa0M7QUFDakMsUUFBSWlMLFFBQVFMLE9BQU81SyxDQUFQLENBQVo7QUFDQSxRQUFJaUwsU0FBUyxJQUFiLEVBQW1CO0FBQ2xCQyxnQkFBV1AsTUFBWCxFQUFtQk0sS0FBbkIsRUFBMEJILEtBQTFCLEVBQWlDRSxFQUFqQyxFQUFxQ0QsV0FBckM7QUFDQTtBQUNEO0FBQ0Q7QUFDRCxXQUFTRyxVQUFULENBQW9CUCxNQUFwQixFQUE0Qk0sS0FBNUIsRUFBbUNILEtBQW5DLEVBQTBDRSxFQUExQyxFQUE4Q0QsV0FBOUMsRUFBMkQ7QUFDMUQsT0FBSWxNLE1BQU1vTSxNQUFNcE0sR0FBaEI7QUFDQSxPQUFJLE9BQU9BLEdBQVAsS0FBZSxRQUFuQixFQUE2QjtBQUM1Qm9NLFVBQU0zTCxLQUFOLEdBQWMsRUFBZDtBQUNBLFFBQUkyTCxNQUFNOUwsS0FBTixJQUFlLElBQW5CLEVBQXlCZ00sY0FBY0YsTUFBTTlMLEtBQXBCLEVBQTJCOEwsS0FBM0IsRUFBa0NILEtBQWxDO0FBQ3pCLFlBQVFqTSxHQUFSO0FBQ0MsVUFBSyxHQUFMO0FBQVUsYUFBT3VNLFdBQVdULE1BQVgsRUFBbUJNLEtBQW5CLEVBQTBCRixXQUExQixDQUFQO0FBQ1YsVUFBSyxHQUFMO0FBQVUsYUFBT00sV0FBV1YsTUFBWCxFQUFtQk0sS0FBbkIsRUFBMEJGLFdBQTFCLENBQVA7QUFDVixVQUFLLEdBQUw7QUFBVSxhQUFPTyxlQUFlWCxNQUFmLEVBQXVCTSxLQUF2QixFQUE4QkgsS0FBOUIsRUFBcUNFLEVBQXJDLEVBQXlDRCxXQUF6QyxDQUFQO0FBQ1Y7QUFBUyxhQUFPMUIsY0FBY3NCLE1BQWQsRUFBc0JNLEtBQXRCLEVBQTZCSCxLQUE3QixFQUFvQ0UsRUFBcEMsRUFBd0NELFdBQXhDLENBQVA7QUFKVjtBQU1BLElBVEQsTUFVSyxPQUFPUSxnQkFBZ0JaLE1BQWhCLEVBQXdCTSxLQUF4QixFQUErQkgsS0FBL0IsRUFBc0NFLEVBQXRDLEVBQTBDRCxXQUExQyxDQUFQO0FBQ0w7QUFDRCxXQUFTSyxVQUFULENBQW9CVCxNQUFwQixFQUE0Qk0sS0FBNUIsRUFBbUNGLFdBQW5DLEVBQWdEO0FBQy9DRSxTQUFNL0wsR0FBTixHQUFZbUwsS0FBS21CLGNBQUwsQ0FBb0JQLE1BQU1qTSxRQUExQixDQUFaO0FBQ0F5TSxjQUFXZCxNQUFYLEVBQW1CTSxNQUFNL0wsR0FBekIsRUFBOEI2TCxXQUE5QjtBQUNBLFVBQU9FLE1BQU0vTCxHQUFiO0FBQ0E7QUFDRCxXQUFTbU0sVUFBVCxDQUFvQlYsTUFBcEIsRUFBNEJNLEtBQTVCLEVBQW1DRixXQUFuQyxFQUFnRDtBQUMvQyxPQUFJVyxTQUFTVCxNQUFNak0sUUFBTixDQUFld0IsS0FBZixDQUFxQixlQUFyQixLQUF5QyxFQUF0RDtBQUNBLE9BQUltTCxVQUFVLEVBQUNDLFNBQVMsT0FBVixFQUFtQkMsT0FBTyxPQUExQixFQUFtQ0MsT0FBTyxPQUExQyxFQUFtREMsT0FBTyxPQUExRCxFQUFtRUMsSUFBSSxPQUF2RSxFQUFnRkMsSUFBSSxJQUFwRixFQUEwRkMsSUFBSSxJQUE5RixFQUFvR0MsVUFBVSxPQUE5RyxFQUF1SEMsS0FBSyxVQUE1SCxHQUF3SVYsT0FBTyxDQUFQLENBQXhJLEtBQXNKLEtBQXBLO0FBQ0EsT0FBSVcsT0FBT2hDLEtBQUtoQixhQUFMLENBQW1Cc0MsT0FBbkIsQ0FBWDtBQUNBVSxRQUFLQyxTQUFMLEdBQWlCckIsTUFBTWpNLFFBQXZCO0FBQ0FpTSxTQUFNL0wsR0FBTixHQUFZbU4sS0FBS0UsVUFBakI7QUFDQXRCLFNBQU03TCxPQUFOLEdBQWdCaU4sS0FBS0csVUFBTCxDQUFnQnZNLE1BQWhDO0FBQ0EsT0FBSWdDLFdBQVdvSSxLQUFLRSxzQkFBTCxFQUFmO0FBQ0EsT0FBSWtDLEtBQUo7QUFDQSxVQUFPQSxRQUFRSixLQUFLRSxVQUFwQixFQUFnQztBQUMvQnRLLGFBQVMwSCxXQUFULENBQXFCOEMsS0FBckI7QUFDQTtBQUNEaEIsY0FBV2QsTUFBWCxFQUFtQjFJLFFBQW5CLEVBQTZCOEksV0FBN0I7QUFDQSxVQUFPOUksUUFBUDtBQUNBO0FBQ0QsV0FBU3FKLGNBQVQsQ0FBd0JYLE1BQXhCLEVBQWdDTSxLQUFoQyxFQUF1Q0gsS0FBdkMsRUFBOENFLEVBQTlDLEVBQWtERCxXQUFsRCxFQUErRDtBQUM5RCxPQUFJOUksV0FBV29JLEtBQUtFLHNCQUFMLEVBQWY7QUFDQSxPQUFJVSxNQUFNak0sUUFBTixJQUFrQixJQUF0QixFQUE0QjtBQUMzQixRQUFJQSxXQUFXaU0sTUFBTWpNLFFBQXJCO0FBQ0EwTCxnQkFBWXpJLFFBQVosRUFBc0JqRCxRQUF0QixFQUFnQyxDQUFoQyxFQUFtQ0EsU0FBU2lCLE1BQTVDLEVBQW9ENkssS0FBcEQsRUFBMkQsSUFBM0QsRUFBaUVFLEVBQWpFO0FBQ0E7QUFDREMsU0FBTS9MLEdBQU4sR0FBWStDLFNBQVNzSyxVQUFyQjtBQUNBdEIsU0FBTTdMLE9BQU4sR0FBZ0I2QyxTQUFTdUssVUFBVCxDQUFvQnZNLE1BQXBDO0FBQ0F3TCxjQUFXZCxNQUFYLEVBQW1CMUksUUFBbkIsRUFBNkI4SSxXQUE3QjtBQUNBLFVBQU85SSxRQUFQO0FBQ0E7QUFDRCxXQUFTb0gsYUFBVCxDQUF1QnNCLE1BQXZCLEVBQStCTSxLQUEvQixFQUFzQ0gsS0FBdEMsRUFBNkNFLEVBQTdDLEVBQWlERCxXQUFqRCxFQUE4RDtBQUM3RCxPQUFJbE0sTUFBTW9NLE1BQU1wTSxHQUFoQjtBQUNBLFdBQVFvTSxNQUFNcE0sR0FBZDtBQUNDLFNBQUssS0FBTDtBQUFZbU0sVUFBSyw0QkFBTCxDQUFtQztBQUMvQyxTQUFLLE1BQUw7QUFBYUEsVUFBSyxvQ0FBTCxDQUEyQztBQUZ6RDtBQUlBLE9BQUkwQixTQUFTekIsTUFBTTlMLEtBQW5CO0FBQ0EsT0FBSXdOLEtBQUtELFVBQVVBLE9BQU9DLEVBQTFCO0FBQ0EsT0FBSUMsVUFBVTVCLEtBQ2IyQixLQUFLdEMsS0FBS3dDLGVBQUwsQ0FBcUI3QixFQUFyQixFQUF5Qm5NLEdBQXpCLEVBQThCLEVBQUM4TixJQUFJQSxFQUFMLEVBQTlCLENBQUwsR0FBK0N0QyxLQUFLd0MsZUFBTCxDQUFxQjdCLEVBQXJCLEVBQXlCbk0sR0FBekIsQ0FEbEMsR0FFYjhOLEtBQUt0QyxLQUFLaEIsYUFBTCxDQUFtQnhLLEdBQW5CLEVBQXdCLEVBQUM4TixJQUFJQSxFQUFMLEVBQXhCLENBQUwsR0FBeUN0QyxLQUFLaEIsYUFBTCxDQUFtQnhLLEdBQW5CLENBRjFDO0FBR0FvTSxTQUFNL0wsR0FBTixHQUFZME4sT0FBWjtBQUNBLE9BQUlGLFVBQVUsSUFBZCxFQUFvQjtBQUNuQkksYUFBUzdCLEtBQVQsRUFBZ0J5QixNQUFoQixFQUF3QjFCLEVBQXhCO0FBQ0E7QUFDRFMsY0FBV2QsTUFBWCxFQUFtQmlDLE9BQW5CLEVBQTRCN0IsV0FBNUI7QUFDQSxPQUFJRSxNQUFNOUwsS0FBTixJQUFlLElBQWYsSUFBdUI4TCxNQUFNOUwsS0FBTixDQUFZNE4sZUFBWixJQUErQixJQUExRCxFQUFnRTtBQUMvREMsdUJBQW1CL0IsS0FBbkI7QUFDQSxJQUZELE1BR0s7QUFDSixRQUFJQSxNQUFNaE0sSUFBTixJQUFjLElBQWxCLEVBQXdCO0FBQ3ZCLFNBQUlnTSxNQUFNaE0sSUFBTixLQUFlLEVBQW5CLEVBQXVCMk4sUUFBUUssV0FBUixHQUFzQmhDLE1BQU1oTSxJQUE1QixDQUF2QixLQUNLZ00sTUFBTWpNLFFBQU4sR0FBaUIsQ0FBQ0osTUFBTSxHQUFOLEVBQVdTLFNBQVgsRUFBc0JBLFNBQXRCLEVBQWlDNEwsTUFBTWhNLElBQXZDLEVBQTZDSSxTQUE3QyxFQUF3REEsU0FBeEQsQ0FBRCxDQUFqQjtBQUNMO0FBQ0QsUUFBSTRMLE1BQU1qTSxRQUFOLElBQWtCLElBQXRCLEVBQTRCO0FBQzNCLFNBQUlBLFdBQVdpTSxNQUFNak0sUUFBckI7QUFDQTBMLGlCQUFZa0MsT0FBWixFQUFxQjVOLFFBQXJCLEVBQStCLENBQS9CLEVBQWtDQSxTQUFTaUIsTUFBM0MsRUFBbUQ2SyxLQUFuRCxFQUEwRCxJQUExRCxFQUFnRUUsRUFBaEU7QUFDQWtDLGtCQUFhakMsS0FBYjtBQUNBO0FBQ0Q7QUFDRCxVQUFPMkIsT0FBUDtBQUNBO0FBQ0QsV0FBU08sYUFBVCxDQUF1QmxDLEtBQXZCLEVBQThCSCxLQUE5QixFQUFxQztBQUNwQyxPQUFJc0MsUUFBSjtBQUNBLE9BQUksT0FBT25DLE1BQU1wTSxHQUFOLENBQVU4QyxJQUFqQixLQUEwQixVQUE5QixFQUEwQztBQUN6Q3NKLFVBQU0zTCxLQUFOLEdBQWNnRyxPQUFPK0gsTUFBUCxDQUFjcEMsTUFBTXBNLEdBQXBCLENBQWQ7QUFDQXVPLGVBQVduQyxNQUFNM0wsS0FBTixDQUFZcUMsSUFBdkI7QUFDQSxRQUFJeUwsU0FBU0UsaUJBQVQsSUFBOEIsSUFBbEMsRUFBd0MsT0FBT2hELGNBQVA7QUFDeEM4QyxhQUFTRSxpQkFBVCxHQUE2QixJQUE3QjtBQUNBLElBTEQsTUFLTztBQUNOckMsVUFBTTNMLEtBQU4sR0FBYyxLQUFLLENBQW5CO0FBQ0E4TixlQUFXbkMsTUFBTXBNLEdBQWpCO0FBQ0EsUUFBSXVPLFNBQVNFLGlCQUFULElBQThCLElBQWxDLEVBQXdDLE9BQU9oRCxjQUFQO0FBQ3hDOEMsYUFBU0UsaUJBQVQsR0FBNkIsSUFBN0I7QUFDQXJDLFVBQU0zTCxLQUFOLEdBQWUyTCxNQUFNcE0sR0FBTixDQUFVa0YsU0FBVixJQUF1QixJQUF2QixJQUErQixPQUFPa0gsTUFBTXBNLEdBQU4sQ0FBVWtGLFNBQVYsQ0FBb0JwQyxJQUEzQixLQUFvQyxVQUFwRSxHQUFrRixJQUFJc0osTUFBTXBNLEdBQVYsQ0FBY29NLEtBQWQsQ0FBbEYsR0FBeUdBLE1BQU1wTSxHQUFOLENBQVVvTSxLQUFWLENBQXZIO0FBQ0E7QUFDREEsU0FBTTFMLE1BQU4sR0FBZTBMLE1BQU0zTCxLQUFyQjtBQUNBLE9BQUkyTCxNQUFNOUwsS0FBTixJQUFlLElBQW5CLEVBQXlCZ00sY0FBY0YsTUFBTTlMLEtBQXBCLEVBQTJCOEwsS0FBM0IsRUFBa0NILEtBQWxDO0FBQ3pCSyxpQkFBY0YsTUFBTTFMLE1BQXBCLEVBQTRCMEwsS0FBNUIsRUFBbUNILEtBQW5DO0FBQ0FHLFNBQU14TCxRQUFOLEdBQWlCYixNQUFNZSxTQUFOLENBQWdCc0wsTUFBTTFMLE1BQU4sQ0FBYW9DLElBQWIsQ0FBa0JKLElBQWxCLENBQXVCMEosTUFBTTNMLEtBQTdCLEVBQW9DMkwsS0FBcEMsQ0FBaEIsQ0FBakI7QUFDQSxPQUFJQSxNQUFNeEwsUUFBTixLQUFtQndMLEtBQXZCLEVBQThCLE1BQU1ySixNQUFNLHdEQUFOLENBQU47QUFDOUJ3TCxZQUFTRSxpQkFBVCxHQUE2QixJQUE3QjtBQUNBO0FBQ0QsV0FBUy9CLGVBQVQsQ0FBeUJaLE1BQXpCLEVBQWlDTSxLQUFqQyxFQUF3Q0gsS0FBeEMsRUFBK0NFLEVBQS9DLEVBQW1ERCxXQUFuRCxFQUFnRTtBQUMvRG9DLGlCQUFjbEMsS0FBZCxFQUFxQkgsS0FBckI7QUFDQSxPQUFJRyxNQUFNeEwsUUFBTixJQUFrQixJQUF0QixFQUE0QjtBQUMzQixRQUFJbU4sVUFBVTFCLFdBQVdQLE1BQVgsRUFBbUJNLE1BQU14TCxRQUF6QixFQUFtQ3FMLEtBQW5DLEVBQTBDRSxFQUExQyxFQUE4Q0QsV0FBOUMsQ0FBZDtBQUNBRSxVQUFNL0wsR0FBTixHQUFZK0wsTUFBTXhMLFFBQU4sQ0FBZVAsR0FBM0I7QUFDQStMLFVBQU03TCxPQUFOLEdBQWdCNkwsTUFBTS9MLEdBQU4sSUFBYSxJQUFiLEdBQW9CK0wsTUFBTXhMLFFBQU4sQ0FBZUwsT0FBbkMsR0FBNkMsQ0FBN0Q7QUFDQXFNLGVBQVdkLE1BQVgsRUFBbUJpQyxPQUFuQixFQUE0QjdCLFdBQTVCO0FBQ0EsV0FBTzZCLE9BQVA7QUFDQSxJQU5ELE1BT0s7QUFDSjNCLFVBQU03TCxPQUFOLEdBQWdCLENBQWhCO0FBQ0EsV0FBT2tMLGNBQVA7QUFDQTtBQUNEO0FBQ0Q7QUFDQSxXQUFTaUQsV0FBVCxDQUFxQjVDLE1BQXJCLEVBQTZCNkMsR0FBN0IsRUFBa0M1QyxNQUFsQyxFQUEwQzZDLFNBQTFDLEVBQXFEM0MsS0FBckQsRUFBNERDLFdBQTVELEVBQXlFQyxFQUF6RSxFQUE2RTtBQUM1RSxPQUFJd0MsUUFBUTVDLE1BQVIsSUFBa0I0QyxPQUFPLElBQVAsSUFBZTVDLFVBQVUsSUFBL0MsRUFBcUQsT0FBckQsS0FDSyxJQUFJNEMsT0FBTyxJQUFYLEVBQWlCOUMsWUFBWUMsTUFBWixFQUFvQkMsTUFBcEIsRUFBNEIsQ0FBNUIsRUFBK0JBLE9BQU8zSyxNQUF0QyxFQUE4QzZLLEtBQTlDLEVBQXFEQyxXQUFyRCxFQUFrRTFMLFNBQWxFLEVBQWpCLEtBQ0EsSUFBSXVMLFVBQVUsSUFBZCxFQUFvQjhDLFlBQVlGLEdBQVosRUFBaUIsQ0FBakIsRUFBb0JBLElBQUl2TixNQUF4QixFQUFnQzJLLE1BQWhDLEVBQXBCLEtBQ0E7QUFDSixRQUFJNEMsSUFBSXZOLE1BQUosS0FBZTJLLE9BQU8zSyxNQUExQixFQUFrQztBQUNqQyxTQUFJME4sWUFBWSxLQUFoQjtBQUNBLFVBQUssSUFBSTNOLElBQUksQ0FBYixFQUFnQkEsSUFBSTRLLE9BQU8zSyxNQUEzQixFQUFtQ0QsR0FBbkMsRUFBd0M7QUFDdkMsVUFBSTRLLE9BQU81SyxDQUFQLEtBQWEsSUFBYixJQUFxQndOLElBQUl4TixDQUFKLEtBQVUsSUFBbkMsRUFBeUM7QUFDeEMyTixtQkFBWS9DLE9BQU81SyxDQUFQLEVBQVVsQixHQUFWLElBQWlCLElBQWpCLElBQXlCME8sSUFBSXhOLENBQUosRUFBT2xCLEdBQVAsSUFBYyxJQUFuRDtBQUNBO0FBQ0E7QUFDRDtBQUNELFNBQUk2TyxTQUFKLEVBQWU7QUFDZCxXQUFLLElBQUkzTixJQUFJLENBQWIsRUFBZ0JBLElBQUl3TixJQUFJdk4sTUFBeEIsRUFBZ0NELEdBQWhDLEVBQXFDO0FBQ3BDLFdBQUl3TixJQUFJeE4sQ0FBSixNQUFXNEssT0FBTzVLLENBQVAsQ0FBZixFQUEwQixTQUExQixLQUNLLElBQUl3TixJQUFJeE4sQ0FBSixLQUFVLElBQVYsSUFBa0I0SyxPQUFPNUssQ0FBUCxLQUFhLElBQW5DLEVBQXlDa0wsV0FBV1AsTUFBWCxFQUFtQkMsT0FBTzVLLENBQVAsQ0FBbkIsRUFBOEI4SyxLQUE5QixFQUFxQ0UsRUFBckMsRUFBeUM0QyxlQUFlSixHQUFmLEVBQW9CeE4sSUFBSSxDQUF4QixFQUEyQitLLFdBQTNCLENBQXpDLEVBQXpDLEtBQ0EsSUFBSUgsT0FBTzVLLENBQVAsS0FBYSxJQUFqQixFQUF1QjBOLFlBQVlGLEdBQVosRUFBaUJ4TixDQUFqQixFQUFvQkEsSUFBSSxDQUF4QixFQUEyQjRLLE1BQTNCLEVBQXZCLEtBQ0FpRCxXQUFXbEQsTUFBWCxFQUFtQjZDLElBQUl4TixDQUFKLENBQW5CLEVBQTJCNEssT0FBTzVLLENBQVAsQ0FBM0IsRUFBc0M4SyxLQUF0QyxFQUE2QzhDLGVBQWVKLEdBQWYsRUFBb0J4TixJQUFJLENBQXhCLEVBQTJCK0ssV0FBM0IsQ0FBN0MsRUFBc0YwQyxTQUF0RixFQUFpR3pDLEVBQWpHO0FBQ0w7QUFDRDtBQUNBO0FBQ0Q7QUFDRHlDLGdCQUFZQSxhQUFhSyxhQUFhTixHQUFiLEVBQWtCNUMsTUFBbEIsQ0FBekI7QUFDQSxRQUFJNkMsU0FBSixFQUFlO0FBQ2QsU0FBSU0sT0FBT1AsSUFBSU8sSUFBZjtBQUNBUCxXQUFNQSxJQUFJUSxNQUFKLENBQVdSLElBQUlPLElBQWYsQ0FBTjtBQUNBO0FBQ0QsUUFBSUUsV0FBVyxDQUFmO0FBQUEsUUFBa0J2TSxRQUFRLENBQTFCO0FBQUEsUUFBNkJ3TSxTQUFTVixJQUFJdk4sTUFBSixHQUFhLENBQW5EO0FBQUEsUUFBc0Q0SyxNQUFNRCxPQUFPM0ssTUFBUCxHQUFnQixDQUE1RTtBQUFBLFFBQStFa08sR0FBL0U7QUFDQSxXQUFPRCxVQUFVRCxRQUFWLElBQXNCcEQsT0FBT25KLEtBQXBDLEVBQTJDO0FBQzFDLFNBQUkwTSxJQUFJWixJQUFJUyxRQUFKLENBQVI7QUFBQSxTQUF1QkksSUFBSXpELE9BQU9sSixLQUFQLENBQTNCO0FBQ0EsU0FBSTBNLE1BQU1DLENBQU4sSUFBVyxDQUFDWixTQUFoQixFQUEyQlEsWUFBWXZNLE9BQVosQ0FBM0IsS0FDSyxJQUFJME0sS0FBSyxJQUFULEVBQWVILFdBQWYsS0FDQSxJQUFJSSxLQUFLLElBQVQsRUFBZTNNLFFBQWYsS0FDQSxJQUFJME0sRUFBRXRQLEdBQUYsS0FBVXVQLEVBQUV2UCxHQUFoQixFQUFxQjtBQUN6QixVQUFJd1AsZ0JBQWlCUCxRQUFRLElBQVIsSUFBZ0JFLFlBQVlULElBQUl2TixNQUFKLEdBQWE4TixLQUFLOU4sTUFBL0MsSUFBNEQ4TixRQUFRLElBQVQsSUFBa0JOLFNBQWpHO0FBQ0FRLGtCQUFZdk0sT0FBWjtBQUNBbU0saUJBQVdsRCxNQUFYLEVBQW1CeUQsQ0FBbkIsRUFBc0JDLENBQXRCLEVBQXlCdkQsS0FBekIsRUFBZ0M4QyxlQUFlSixHQUFmLEVBQW9CUyxRQUFwQixFQUE4QmxELFdBQTlCLENBQWhDLEVBQTRFdUQsYUFBNUUsRUFBMkZ0RCxFQUEzRjtBQUNBLFVBQUl5QyxhQUFhVyxFQUFFdlAsR0FBRixLQUFVd1AsRUFBRXhQLEdBQTdCLEVBQWtDNE0sV0FBV2QsTUFBWCxFQUFtQjRELFdBQVdILENBQVgsQ0FBbkIsRUFBa0NyRCxXQUFsQztBQUNsQyxNQUxJLE1BTUE7QUFDSixVQUFJcUQsSUFBSVosSUFBSVUsTUFBSixDQUFSO0FBQ0EsVUFBSUUsTUFBTUMsQ0FBTixJQUFXLENBQUNaLFNBQWhCLEVBQTJCUyxVQUFVeE0sT0FBVixDQUEzQixLQUNLLElBQUkwTSxLQUFLLElBQVQsRUFBZUYsU0FBZixLQUNBLElBQUlHLEtBQUssSUFBVCxFQUFlM00sUUFBZixLQUNBLElBQUkwTSxFQUFFdFAsR0FBRixLQUFVdVAsRUFBRXZQLEdBQWhCLEVBQXFCO0FBQ3pCLFdBQUl3UCxnQkFBaUJQLFFBQVEsSUFBUixJQUFnQkcsVUFBVVYsSUFBSXZOLE1BQUosR0FBYThOLEtBQUs5TixNQUE3QyxJQUEwRDhOLFFBQVEsSUFBVCxJQUFrQk4sU0FBL0Y7QUFDQUksa0JBQVdsRCxNQUFYLEVBQW1CeUQsQ0FBbkIsRUFBc0JDLENBQXRCLEVBQXlCdkQsS0FBekIsRUFBZ0M4QyxlQUFlSixHQUFmLEVBQW9CVSxTQUFTLENBQTdCLEVBQWdDbkQsV0FBaEMsQ0FBaEMsRUFBOEV1RCxhQUE5RSxFQUE2RnRELEVBQTdGO0FBQ0EsV0FBSXlDLGFBQWEvTCxRQUFRbUosR0FBekIsRUFBOEJZLFdBQVdkLE1BQVgsRUFBbUI0RCxXQUFXSCxDQUFYLENBQW5CLEVBQWtDUixlQUFlSixHQUFmLEVBQW9CUyxRQUFwQixFQUE4QmxELFdBQTlCLENBQWxDO0FBQzlCbUQsaUJBQVV4TSxPQUFWO0FBQ0EsT0FMSSxNQU1BO0FBQ0w7QUFDRDtBQUNELFdBQU93TSxVQUFVRCxRQUFWLElBQXNCcEQsT0FBT25KLEtBQXBDLEVBQTJDO0FBQzFDLFNBQUkwTSxJQUFJWixJQUFJVSxNQUFKLENBQVI7QUFBQSxTQUFxQkcsSUFBSXpELE9BQU9DLEdBQVAsQ0FBekI7QUFDQSxTQUFJdUQsTUFBTUMsQ0FBTixJQUFXLENBQUNaLFNBQWhCLEVBQTJCUyxVQUFVckQsS0FBVixDQUEzQixLQUNLLElBQUl1RCxLQUFLLElBQVQsRUFBZUYsU0FBZixLQUNBLElBQUlHLEtBQUssSUFBVCxFQUFleEQsTUFBZixLQUNBLElBQUl1RCxFQUFFdFAsR0FBRixLQUFVdVAsRUFBRXZQLEdBQWhCLEVBQXFCO0FBQ3pCLFVBQUl3UCxnQkFBaUJQLFFBQVEsSUFBUixJQUFnQkcsVUFBVVYsSUFBSXZOLE1BQUosR0FBYThOLEtBQUs5TixNQUE3QyxJQUEwRDhOLFFBQVEsSUFBVCxJQUFrQk4sU0FBL0Y7QUFDQUksaUJBQVdsRCxNQUFYLEVBQW1CeUQsQ0FBbkIsRUFBc0JDLENBQXRCLEVBQXlCdkQsS0FBekIsRUFBZ0M4QyxlQUFlSixHQUFmLEVBQW9CVSxTQUFTLENBQTdCLEVBQWdDbkQsV0FBaEMsQ0FBaEMsRUFBOEV1RCxhQUE5RSxFQUE2RnRELEVBQTdGO0FBQ0EsVUFBSXlDLGFBQWFXLEVBQUV2UCxHQUFGLEtBQVV3UCxFQUFFeFAsR0FBN0IsRUFBa0M0TSxXQUFXZCxNQUFYLEVBQW1CNEQsV0FBV0gsQ0FBWCxDQUFuQixFQUFrQ3JELFdBQWxDO0FBQ2xDLFVBQUlxRCxFQUFFbFAsR0FBRixJQUFTLElBQWIsRUFBbUI2TCxjQUFjcUQsRUFBRWxQLEdBQWhCO0FBQ25CZ1AsZ0JBQVVyRCxLQUFWO0FBQ0EsTUFOSSxNQU9BO0FBQ0osVUFBSSxDQUFDc0QsR0FBTCxFQUFVQSxNQUFNSyxVQUFVaEIsR0FBVixFQUFlVSxNQUFmLENBQU47QUFDVixVQUFJRyxLQUFLLElBQVQsRUFBZTtBQUNkLFdBQUlJLFdBQVdOLElBQUlFLEVBQUV2UCxHQUFOLENBQWY7QUFDQSxXQUFJMlAsWUFBWSxJQUFoQixFQUFzQjtBQUNyQixZQUFJQyxVQUFVbEIsSUFBSWlCLFFBQUosQ0FBZDtBQUNBLFlBQUlILGdCQUFpQlAsUUFBUSxJQUFSLElBQWdCVSxZQUFZakIsSUFBSXZOLE1BQUosR0FBYThOLEtBQUs5TixNQUEvQyxJQUE0RDhOLFFBQVEsSUFBVCxJQUFrQk4sU0FBakc7QUFDQUksbUJBQVdsRCxNQUFYLEVBQW1CK0QsT0FBbkIsRUFBNEJMLENBQTVCLEVBQStCdkQsS0FBL0IsRUFBc0M4QyxlQUFlSixHQUFmLEVBQW9CVSxTQUFTLENBQTdCLEVBQWdDbkQsV0FBaEMsQ0FBdEMsRUFBb0YwQyxTQUFwRixFQUErRnpDLEVBQS9GO0FBQ0FTLG1CQUFXZCxNQUFYLEVBQW1CNEQsV0FBV0csT0FBWCxDQUFuQixFQUF3QzNELFdBQXhDO0FBQ0F5QyxZQUFJaUIsUUFBSixFQUFjL08sSUFBZCxHQUFxQixJQUFyQjtBQUNBLFlBQUlnUCxRQUFReFAsR0FBUixJQUFlLElBQW5CLEVBQXlCNkwsY0FBYzJELFFBQVF4UCxHQUF0QjtBQUN6QixRQVBELE1BUUs7QUFDSixZQUFJQSxNQUFNZ00sV0FBV1AsTUFBWCxFQUFtQjBELENBQW5CLEVBQXNCdkQsS0FBdEIsRUFBNkJ6TCxTQUE3QixFQUF3QzBMLFdBQXhDLENBQVY7QUFDQUEsc0JBQWM3TCxHQUFkO0FBQ0E7QUFDRDtBQUNEMkw7QUFDQTtBQUNELFNBQUlBLE1BQU1uSixLQUFWLEVBQWlCO0FBQ2pCO0FBQ0RnSixnQkFBWUMsTUFBWixFQUFvQkMsTUFBcEIsRUFBNEJsSixLQUE1QixFQUFtQ21KLE1BQU0sQ0FBekMsRUFBNENDLEtBQTVDLEVBQW1EQyxXQUFuRCxFQUFnRUMsRUFBaEU7QUFDQTBDLGdCQUFZRixHQUFaLEVBQWlCUyxRQUFqQixFQUEyQkMsU0FBUyxDQUFwQyxFQUF1Q3RELE1BQXZDO0FBQ0E7QUFDRDtBQUNELFdBQVNpRCxVQUFULENBQW9CbEQsTUFBcEIsRUFBNEI2QyxHQUE1QixFQUFpQ3ZDLEtBQWpDLEVBQXdDSCxLQUF4QyxFQUErQ0MsV0FBL0MsRUFBNEQwQyxTQUE1RCxFQUF1RXpDLEVBQXZFLEVBQTJFO0FBQzFFLE9BQUkyRCxTQUFTbkIsSUFBSTNPLEdBQWpCO0FBQUEsT0FBc0JBLE1BQU1vTSxNQUFNcE0sR0FBbEM7QUFDQSxPQUFJOFAsV0FBVzlQLEdBQWYsRUFBb0I7QUFDbkJvTSxVQUFNM0wsS0FBTixHQUFja08sSUFBSWxPLEtBQWxCO0FBQ0EyTCxVQUFNMUwsTUFBTixHQUFlaU8sSUFBSWpPLE1BQW5CO0FBQ0EwTCxVQUFNekwsTUFBTixHQUFlZ08sSUFBSWhPLE1BQW5CO0FBQ0EsUUFBSSxDQUFDaU8sU0FBRCxJQUFjbUIsZ0JBQWdCM0QsS0FBaEIsRUFBdUJ1QyxHQUF2QixDQUFsQixFQUErQztBQUMvQyxRQUFJLE9BQU9tQixNQUFQLEtBQWtCLFFBQXRCLEVBQWdDO0FBQy9CLFNBQUkxRCxNQUFNOUwsS0FBTixJQUFlLElBQW5CLEVBQXlCO0FBQ3hCLFVBQUlzTyxTQUFKLEVBQWU7QUFDZHhDLGFBQU0zTCxLQUFOLEdBQWMsRUFBZDtBQUNBNkwscUJBQWNGLE1BQU05TCxLQUFwQixFQUEyQjhMLEtBQTNCLEVBQWtDSCxLQUFsQztBQUNBLE9BSEQsTUFJSytELGdCQUFnQjVELE1BQU05TCxLQUF0QixFQUE2QjhMLEtBQTdCLEVBQW9DSCxLQUFwQztBQUNMO0FBQ0QsYUFBUTZELE1BQVI7QUFDQyxXQUFLLEdBQUw7QUFBVUcsa0JBQVd0QixHQUFYLEVBQWdCdkMsS0FBaEIsRUFBd0I7QUFDbEMsV0FBSyxHQUFMO0FBQVU4RCxrQkFBV3BFLE1BQVgsRUFBbUI2QyxHQUFuQixFQUF3QnZDLEtBQXhCLEVBQStCRixXQUEvQixFQUE2QztBQUN2RCxXQUFLLEdBQUw7QUFBVWlFLHNCQUFlckUsTUFBZixFQUF1QjZDLEdBQXZCLEVBQTRCdkMsS0FBNUIsRUFBbUN3QyxTQUFuQyxFQUE4QzNDLEtBQTlDLEVBQXFEQyxXQUFyRCxFQUFrRUMsRUFBbEUsRUFBdUU7QUFDakY7QUFBU2lFLHFCQUFjekIsR0FBZCxFQUFtQnZDLEtBQW5CLEVBQTBCd0MsU0FBMUIsRUFBcUMzQyxLQUFyQyxFQUE0Q0UsRUFBNUM7QUFKVjtBQU1BLEtBZEQsTUFlS2tFLGdCQUFnQnZFLE1BQWhCLEVBQXdCNkMsR0FBeEIsRUFBNkJ2QyxLQUE3QixFQUFvQ0gsS0FBcEMsRUFBMkNDLFdBQTNDLEVBQXdEMEMsU0FBeEQsRUFBbUV6QyxFQUFuRTtBQUNMLElBckJELE1Bc0JLO0FBQ0ptRSxlQUFXM0IsR0FBWCxFQUFnQixJQUFoQjtBQUNBdEMsZUFBV1AsTUFBWCxFQUFtQk0sS0FBbkIsRUFBMEJILEtBQTFCLEVBQWlDRSxFQUFqQyxFQUFxQ0QsV0FBckM7QUFDQTtBQUNEO0FBQ0QsV0FBUytELFVBQVQsQ0FBb0J0QixHQUFwQixFQUF5QnZDLEtBQXpCLEVBQWdDO0FBQy9CLE9BQUl1QyxJQUFJeE8sUUFBSixDQUFhdUcsUUFBYixPQUE0QjBGLE1BQU1qTSxRQUFOLENBQWV1RyxRQUFmLEVBQWhDLEVBQTJEO0FBQzFEaUksUUFBSXRPLEdBQUosQ0FBUWtRLFNBQVIsR0FBb0JuRSxNQUFNak0sUUFBMUI7QUFDQTtBQUNEaU0sU0FBTS9MLEdBQU4sR0FBWXNPLElBQUl0TyxHQUFoQjtBQUNBO0FBQ0QsV0FBUzZQLFVBQVQsQ0FBb0JwRSxNQUFwQixFQUE0QjZDLEdBQTVCLEVBQWlDdkMsS0FBakMsRUFBd0NGLFdBQXhDLEVBQXFEO0FBQ3BELE9BQUl5QyxJQUFJeE8sUUFBSixLQUFpQmlNLE1BQU1qTSxRQUEzQixFQUFxQztBQUNwQ3VQLGVBQVdmLEdBQVg7QUFDQW5DLGVBQVdWLE1BQVgsRUFBbUJNLEtBQW5CLEVBQTBCRixXQUExQjtBQUNBLElBSEQsTUFJS0UsTUFBTS9MLEdBQU4sR0FBWXNPLElBQUl0TyxHQUFoQixFQUFxQitMLE1BQU03TCxPQUFOLEdBQWdCb08sSUFBSXBPLE9BQXpDO0FBQ0w7QUFDRCxXQUFTNFAsY0FBVCxDQUF3QnJFLE1BQXhCLEVBQWdDNkMsR0FBaEMsRUFBcUN2QyxLQUFyQyxFQUE0Q3dDLFNBQTVDLEVBQXVEM0MsS0FBdkQsRUFBOERDLFdBQTlELEVBQTJFQyxFQUEzRSxFQUErRTtBQUM5RXVDLGVBQVk1QyxNQUFaLEVBQW9CNkMsSUFBSXhPLFFBQXhCLEVBQWtDaU0sTUFBTWpNLFFBQXhDLEVBQWtEeU8sU0FBbEQsRUFBNkQzQyxLQUE3RCxFQUFvRUMsV0FBcEUsRUFBaUZDLEVBQWpGO0FBQ0EsT0FBSTVMLFVBQVUsQ0FBZDtBQUFBLE9BQWlCSixXQUFXaU0sTUFBTWpNLFFBQWxDO0FBQ0FpTSxTQUFNL0wsR0FBTixHQUFZLElBQVo7QUFDQSxPQUFJRixZQUFZLElBQWhCLEVBQXNCO0FBQ3JCLFNBQUssSUFBSWdCLElBQUksQ0FBYixFQUFnQkEsSUFBSWhCLFNBQVNpQixNQUE3QixFQUFxQ0QsR0FBckMsRUFBMEM7QUFDekMsU0FBSXlNLFFBQVF6TixTQUFTZ0IsQ0FBVCxDQUFaO0FBQ0EsU0FBSXlNLFNBQVMsSUFBVCxJQUFpQkEsTUFBTXZOLEdBQU4sSUFBYSxJQUFsQyxFQUF3QztBQUN2QyxVQUFJK0wsTUFBTS9MLEdBQU4sSUFBYSxJQUFqQixFQUF1QitMLE1BQU0vTCxHQUFOLEdBQVl1TixNQUFNdk4sR0FBbEI7QUFDdkJFLGlCQUFXcU4sTUFBTXJOLE9BQU4sSUFBaUIsQ0FBNUI7QUFDQTtBQUNEO0FBQ0QsUUFBSUEsWUFBWSxDQUFoQixFQUFtQjZMLE1BQU03TCxPQUFOLEdBQWdCQSxPQUFoQjtBQUNuQjtBQUNEO0FBQ0QsV0FBUzZQLGFBQVQsQ0FBdUJ6QixHQUF2QixFQUE0QnZDLEtBQTVCLEVBQW1Dd0MsU0FBbkMsRUFBOEMzQyxLQUE5QyxFQUFxREUsRUFBckQsRUFBeUQ7QUFDeEQsT0FBSTRCLFVBQVUzQixNQUFNL0wsR0FBTixHQUFZc08sSUFBSXRPLEdBQTlCO0FBQ0EsV0FBUStMLE1BQU1wTSxHQUFkO0FBQ0MsU0FBSyxLQUFMO0FBQVltTSxVQUFLLDRCQUFMLENBQW1DO0FBQy9DLFNBQUssTUFBTDtBQUFhQSxVQUFLLG9DQUFMLENBQTJDO0FBRnpEO0FBSUEsT0FBSUMsTUFBTXBNLEdBQU4sS0FBYyxVQUFsQixFQUE4QjtBQUM3QixRQUFJb00sTUFBTTlMLEtBQU4sSUFBZSxJQUFuQixFQUF5QjhMLE1BQU05TCxLQUFOLEdBQWMsRUFBZDtBQUN6QixRQUFJOEwsTUFBTWhNLElBQU4sSUFBYyxJQUFsQixFQUF3QjtBQUN2QmdNLFdBQU05TCxLQUFOLENBQVl5QixLQUFaLEdBQW9CcUssTUFBTWhNLElBQTFCLENBRHVCLENBQ1E7QUFDL0JnTSxXQUFNaE0sSUFBTixHQUFhSSxTQUFiO0FBQ0E7QUFDRDtBQUNEZ1EsZUFBWXBFLEtBQVosRUFBbUJ1QyxJQUFJck8sS0FBdkIsRUFBOEI4TCxNQUFNOUwsS0FBcEMsRUFBMkM2TCxFQUEzQztBQUNBLE9BQUlDLE1BQU05TCxLQUFOLElBQWUsSUFBZixJQUF1QjhMLE1BQU05TCxLQUFOLENBQVk0TixlQUFaLElBQStCLElBQTFELEVBQWdFO0FBQy9EQyx1QkFBbUIvQixLQUFuQjtBQUNBLElBRkQsTUFHSyxJQUFJdUMsSUFBSXZPLElBQUosSUFBWSxJQUFaLElBQW9CZ00sTUFBTWhNLElBQU4sSUFBYyxJQUFsQyxJQUEwQ2dNLE1BQU1oTSxJQUFOLEtBQWUsRUFBN0QsRUFBaUU7QUFDckUsUUFBSXVPLElBQUl2TyxJQUFKLENBQVNzRyxRQUFULE9BQXdCMEYsTUFBTWhNLElBQU4sQ0FBV3NHLFFBQVgsRUFBNUIsRUFBbURpSSxJQUFJdE8sR0FBSixDQUFRcU4sVUFBUixDQUFtQjZDLFNBQW5CLEdBQStCbkUsTUFBTWhNLElBQXJDO0FBQ25ELElBRkksTUFHQTtBQUNKLFFBQUl1TyxJQUFJdk8sSUFBSixJQUFZLElBQWhCLEVBQXNCdU8sSUFBSXhPLFFBQUosR0FBZSxDQUFDSixNQUFNLEdBQU4sRUFBV1MsU0FBWCxFQUFzQkEsU0FBdEIsRUFBaUNtTyxJQUFJdk8sSUFBckMsRUFBMkNJLFNBQTNDLEVBQXNEbU8sSUFBSXRPLEdBQUosQ0FBUXFOLFVBQTlELENBQUQsQ0FBZjtBQUN0QixRQUFJdEIsTUFBTWhNLElBQU4sSUFBYyxJQUFsQixFQUF3QmdNLE1BQU1qTSxRQUFOLEdBQWlCLENBQUNKLE1BQU0sR0FBTixFQUFXUyxTQUFYLEVBQXNCQSxTQUF0QixFQUFpQzRMLE1BQU1oTSxJQUF2QyxFQUE2Q0ksU0FBN0MsRUFBd0RBLFNBQXhELENBQUQsQ0FBakI7QUFDeEJrTyxnQkFBWVgsT0FBWixFQUFxQlksSUFBSXhPLFFBQXpCLEVBQW1DaU0sTUFBTWpNLFFBQXpDLEVBQW1EeU8sU0FBbkQsRUFBOEQzQyxLQUE5RCxFQUFxRSxJQUFyRSxFQUEyRUUsRUFBM0U7QUFDQTtBQUNEO0FBQ0QsV0FBU2tFLGVBQVQsQ0FBeUJ2RSxNQUF6QixFQUFpQzZDLEdBQWpDLEVBQXNDdkMsS0FBdEMsRUFBNkNILEtBQTdDLEVBQW9EQyxXQUFwRCxFQUFpRTBDLFNBQWpFLEVBQTRFekMsRUFBNUUsRUFBZ0Y7QUFDL0UsT0FBSXlDLFNBQUosRUFBZTtBQUNkTixrQkFBY2xDLEtBQWQsRUFBcUJILEtBQXJCO0FBQ0EsSUFGRCxNQUVPO0FBQ05HLFVBQU14TCxRQUFOLEdBQWlCYixNQUFNZSxTQUFOLENBQWdCc0wsTUFBTTFMLE1BQU4sQ0FBYW9DLElBQWIsQ0FBa0JKLElBQWxCLENBQXVCMEosTUFBTTNMLEtBQTdCLEVBQW9DMkwsS0FBcEMsQ0FBaEIsQ0FBakI7QUFDQSxRQUFJQSxNQUFNeEwsUUFBTixLQUFtQndMLEtBQXZCLEVBQThCLE1BQU1ySixNQUFNLHdEQUFOLENBQU47QUFDOUIsUUFBSXFKLE1BQU05TCxLQUFOLElBQWUsSUFBbkIsRUFBeUIwUCxnQkFBZ0I1RCxNQUFNOUwsS0FBdEIsRUFBNkI4TCxLQUE3QixFQUFvQ0gsS0FBcEM7QUFDekIrRCxvQkFBZ0I1RCxNQUFNMUwsTUFBdEIsRUFBOEIwTCxLQUE5QixFQUFxQ0gsS0FBckM7QUFDQTtBQUNELE9BQUlHLE1BQU14TCxRQUFOLElBQWtCLElBQXRCLEVBQTRCO0FBQzNCLFFBQUkrTixJQUFJL04sUUFBSixJQUFnQixJQUFwQixFQUEwQnlMLFdBQVdQLE1BQVgsRUFBbUJNLE1BQU14TCxRQUF6QixFQUFtQ3FMLEtBQW5DLEVBQTBDRSxFQUExQyxFQUE4Q0QsV0FBOUMsRUFBMUIsS0FDSzhDLFdBQVdsRCxNQUFYLEVBQW1CNkMsSUFBSS9OLFFBQXZCLEVBQWlDd0wsTUFBTXhMLFFBQXZDLEVBQWlEcUwsS0FBakQsRUFBd0RDLFdBQXhELEVBQXFFMEMsU0FBckUsRUFBZ0Z6QyxFQUFoRjtBQUNMQyxVQUFNL0wsR0FBTixHQUFZK0wsTUFBTXhMLFFBQU4sQ0FBZVAsR0FBM0I7QUFDQStMLFVBQU03TCxPQUFOLEdBQWdCNkwsTUFBTXhMLFFBQU4sQ0FBZUwsT0FBL0I7QUFDQSxJQUxELE1BTUssSUFBSW9PLElBQUkvTixRQUFKLElBQWdCLElBQXBCLEVBQTBCO0FBQzlCMFAsZUFBVzNCLElBQUkvTixRQUFmLEVBQXlCLElBQXpCO0FBQ0F3TCxVQUFNL0wsR0FBTixHQUFZRyxTQUFaO0FBQ0E0TCxVQUFNN0wsT0FBTixHQUFnQixDQUFoQjtBQUNBLElBSkksTUFLQTtBQUNKNkwsVUFBTS9MLEdBQU4sR0FBWXNPLElBQUl0TyxHQUFoQjtBQUNBK0wsVUFBTTdMLE9BQU4sR0FBZ0JvTyxJQUFJcE8sT0FBcEI7QUFDQTtBQUNEO0FBQ0QsV0FBUzBPLFlBQVQsQ0FBc0JOLEdBQXRCLEVBQTJCNUMsTUFBM0IsRUFBbUM7QUFDbEMsT0FBSTRDLElBQUlPLElBQUosSUFBWSxJQUFaLElBQW9CL0UsS0FBS3NHLEdBQUwsQ0FBUzlCLElBQUlPLElBQUosQ0FBUzlOLE1BQVQsR0FBa0IySyxPQUFPM0ssTUFBbEMsS0FBNkMrSSxLQUFLc0csR0FBTCxDQUFTOUIsSUFBSXZOLE1BQUosR0FBYTJLLE9BQU8zSyxNQUE3QixDQUFyRSxFQUEyRztBQUMxRyxRQUFJc1Asb0JBQW9CL0IsSUFBSSxDQUFKLEtBQVVBLElBQUksQ0FBSixFQUFPeE8sUUFBakIsSUFBNkJ3TyxJQUFJLENBQUosRUFBT3hPLFFBQVAsQ0FBZ0JpQixNQUE3QyxJQUF1RCxDQUEvRTtBQUNBLFFBQUl1UCxxQkFBcUJoQyxJQUFJTyxJQUFKLENBQVMsQ0FBVCxLQUFlUCxJQUFJTyxJQUFKLENBQVMsQ0FBVCxFQUFZL08sUUFBM0IsSUFBdUN3TyxJQUFJTyxJQUFKLENBQVMsQ0FBVCxFQUFZL08sUUFBWixDQUFxQmlCLE1BQTVELElBQXNFLENBQS9GO0FBQ0EsUUFBSXdQLHVCQUF1QjdFLE9BQU8sQ0FBUCxLQUFhQSxPQUFPLENBQVAsRUFBVTVMLFFBQXZCLElBQW1DNEwsT0FBTyxDQUFQLEVBQVU1TCxRQUFWLENBQW1CaUIsTUFBdEQsSUFBZ0UsQ0FBM0Y7QUFDQSxRQUFJK0ksS0FBS3NHLEdBQUwsQ0FBU0UscUJBQXFCQyxvQkFBOUIsS0FBdUR6RyxLQUFLc0csR0FBTCxDQUFTQyxvQkFBb0JFLG9CQUE3QixDQUEzRCxFQUErRztBQUM5RyxZQUFPLElBQVA7QUFDQTtBQUNEO0FBQ0QsVUFBTyxLQUFQO0FBQ0E7QUFDRCxXQUFTakIsU0FBVCxDQUFtQjVELE1BQW5CLEVBQTJCQyxHQUEzQixFQUFnQztBQUMvQixPQUFJc0QsTUFBTSxFQUFWO0FBQUEsT0FBY25PLElBQUksQ0FBbEI7QUFDQSxRQUFLLElBQUlBLElBQUksQ0FBYixFQUFnQkEsSUFBSTZLLEdBQXBCLEVBQXlCN0ssR0FBekIsRUFBOEI7QUFDN0IsUUFBSWlMLFFBQVFMLE9BQU81SyxDQUFQLENBQVo7QUFDQSxRQUFJaUwsU0FBUyxJQUFiLEVBQW1CO0FBQ2xCLFNBQUl5RSxPQUFPekUsTUFBTW5NLEdBQWpCO0FBQ0EsU0FBSTRRLFFBQVEsSUFBWixFQUFrQnZCLElBQUl1QixJQUFKLElBQVkxUCxDQUFaO0FBQ2xCO0FBQ0Q7QUFDRCxVQUFPbU8sR0FBUDtBQUNBO0FBQ0QsV0FBU0ksVUFBVCxDQUFvQnRELEtBQXBCLEVBQTJCO0FBQzFCLE9BQUkwRSxTQUFTMUUsTUFBTTdMLE9BQW5CO0FBQ0EsT0FBSXVRLFVBQVUsSUFBVixJQUFrQjFFLE1BQU0vTCxHQUFOLElBQWEsSUFBbkMsRUFBeUM7QUFDeEMsUUFBSStDLFdBQVdvSSxLQUFLRSxzQkFBTCxFQUFmO0FBQ0EsUUFBSW9GLFNBQVMsQ0FBYixFQUFnQjtBQUNmLFNBQUl6USxNQUFNK0wsTUFBTS9MLEdBQWhCO0FBQ0EsWUFBTyxFQUFFeVEsTUFBVDtBQUFpQjFOLGVBQVMwSCxXQUFULENBQXFCekssSUFBSTZMLFdBQXpCO0FBQWpCLE1BQ0E5SSxTQUFTMk4sWUFBVCxDQUFzQjFRLEdBQXRCLEVBQTJCK0MsU0FBU3NLLFVBQXBDO0FBQ0E7QUFDRCxXQUFPdEssUUFBUDtBQUNBLElBUkQsTUFTSyxPQUFPZ0osTUFBTS9MLEdBQWI7QUFDTDtBQUNELFdBQVMwTyxjQUFULENBQXdCaEQsTUFBeEIsRUFBZ0M1SyxDQUFoQyxFQUFtQytLLFdBQW5DLEVBQWdEO0FBQy9DLFVBQU8vSyxJQUFJNEssT0FBTzNLLE1BQWxCLEVBQTBCRCxHQUExQixFQUErQjtBQUM5QixRQUFJNEssT0FBTzVLLENBQVAsS0FBYSxJQUFiLElBQXFCNEssT0FBTzVLLENBQVAsRUFBVWQsR0FBVixJQUFpQixJQUExQyxFQUFnRCxPQUFPMEwsT0FBTzVLLENBQVAsRUFBVWQsR0FBakI7QUFDaEQ7QUFDRCxVQUFPNkwsV0FBUDtBQUNBO0FBQ0QsV0FBU1UsVUFBVCxDQUFvQmQsTUFBcEIsRUFBNEJ6TCxHQUE1QixFQUFpQzZMLFdBQWpDLEVBQThDO0FBQzdDLE9BQUlBLGVBQWVBLFlBQVl6QixVQUEvQixFQUEyQ3FCLE9BQU9pRixZQUFQLENBQW9CMVEsR0FBcEIsRUFBeUI2TCxXQUF6QixFQUEzQyxLQUNLSixPQUFPaEIsV0FBUCxDQUFtQnpLLEdBQW5CO0FBQ0w7QUFDRCxXQUFTOE4sa0JBQVQsQ0FBNEIvQixLQUE1QixFQUFtQztBQUNsQyxPQUFJak0sV0FBV2lNLE1BQU1qTSxRQUFyQjtBQUNBLE9BQUlBLFlBQVksSUFBWixJQUFvQkEsU0FBU2lCLE1BQVQsS0FBb0IsQ0FBeEMsSUFBNkNqQixTQUFTLENBQVQsRUFBWUgsR0FBWixLQUFvQixHQUFyRSxFQUEwRTtBQUN6RSxRQUFJZ1IsVUFBVTdRLFNBQVMsQ0FBVCxFQUFZQSxRQUExQjtBQUNBLFFBQUlpTSxNQUFNL0wsR0FBTixDQUFVb04sU0FBVixLQUF3QnVELE9BQTVCLEVBQXFDNUUsTUFBTS9MLEdBQU4sQ0FBVW9OLFNBQVYsR0FBc0J1RCxPQUF0QjtBQUNyQyxJQUhELE1BSUssSUFBSTVFLE1BQU1oTSxJQUFOLElBQWMsSUFBZCxJQUFzQkQsWUFBWSxJQUFaLElBQW9CQSxTQUFTaUIsTUFBVCxLQUFvQixDQUFsRSxFQUFxRSxNQUFNLElBQUkyQixLQUFKLENBQVUsaURBQVYsQ0FBTjtBQUMxRTtBQUNEO0FBQ0EsV0FBUzhMLFdBQVQsQ0FBcUI5QyxNQUFyQixFQUE2QmxKLEtBQTdCLEVBQW9DbUosR0FBcEMsRUFBeUNpRixPQUF6QyxFQUFrRDtBQUNqRCxRQUFLLElBQUk5UCxJQUFJMEIsS0FBYixFQUFvQjFCLElBQUk2SyxHQUF4QixFQUE2QjdLLEdBQTdCLEVBQWtDO0FBQ2pDLFFBQUlpTCxRQUFRTCxPQUFPNUssQ0FBUCxDQUFaO0FBQ0EsUUFBSWlMLFNBQVMsSUFBYixFQUFtQjtBQUNsQixTQUFJQSxNQUFNdkwsSUFBVixFQUFnQnVMLE1BQU12TCxJQUFOLEdBQWEsS0FBYixDQUFoQixLQUNLeVAsV0FBV2xFLEtBQVgsRUFBa0I2RSxPQUFsQjtBQUNMO0FBQ0Q7QUFDRDtBQUNELFdBQVNYLFVBQVQsQ0FBb0JsRSxLQUFwQixFQUEyQjZFLE9BQTNCLEVBQW9DO0FBQ25DLE9BQUlDLFdBQVcsQ0FBZjtBQUFBLE9BQWtCQyxTQUFTLENBQTNCO0FBQ0EsT0FBSS9FLE1BQU05TCxLQUFOLElBQWUsT0FBTzhMLE1BQU05TCxLQUFOLENBQVk4USxjQUFuQixLQUFzQyxVQUF6RCxFQUFxRTtBQUNwRSxRQUFJQyxTQUFTakYsTUFBTTlMLEtBQU4sQ0FBWThRLGNBQVosQ0FBMkIxTyxJQUEzQixDQUFnQzBKLE1BQU0zTCxLQUF0QyxFQUE2QzJMLEtBQTdDLENBQWI7QUFDQSxRQUFJaUYsVUFBVSxJQUFWLElBQWtCLE9BQU9BLE9BQU85TSxJQUFkLEtBQXVCLFVBQTdDLEVBQXlEO0FBQ3hEMk07QUFDQUcsWUFBTzlNLElBQVAsQ0FBWStNLFlBQVosRUFBMEJBLFlBQTFCO0FBQ0E7QUFDRDtBQUNELE9BQUksT0FBT2xGLE1BQU1wTSxHQUFiLEtBQXFCLFFBQXJCLElBQWlDLE9BQU9vTSxNQUFNMUwsTUFBTixDQUFhMFEsY0FBcEIsS0FBdUMsVUFBNUUsRUFBd0Y7QUFDdkYsUUFBSUMsU0FBU2pGLE1BQU0xTCxNQUFOLENBQWEwUSxjQUFiLENBQTRCMU8sSUFBNUIsQ0FBaUMwSixNQUFNM0wsS0FBdkMsRUFBOEMyTCxLQUE5QyxDQUFiO0FBQ0EsUUFBSWlGLFVBQVUsSUFBVixJQUFrQixPQUFPQSxPQUFPOU0sSUFBZCxLQUF1QixVQUE3QyxFQUF5RDtBQUN4RDJNO0FBQ0FHLFlBQU85TSxJQUFQLENBQVkrTSxZQUFaLEVBQTBCQSxZQUExQjtBQUNBO0FBQ0Q7QUFDREE7QUFDQSxZQUFTQSxZQUFULEdBQXdCO0FBQ3ZCLFFBQUksRUFBRUgsTUFBRixLQUFhRCxRQUFqQixFQUEyQjtBQUMxQkssY0FBU25GLEtBQVQ7QUFDQSxTQUFJQSxNQUFNL0wsR0FBVixFQUFlO0FBQ2QsVUFBSXlRLFNBQVMxRSxNQUFNN0wsT0FBTixJQUFpQixDQUE5QjtBQUNBLFVBQUl1USxTQUFTLENBQWIsRUFBZ0I7QUFDZixXQUFJelEsTUFBTStMLE1BQU0vTCxHQUFoQjtBQUNBLGNBQU8sRUFBRXlRLE1BQVQsRUFBaUI7QUFDaEJVLDBCQUFrQm5SLElBQUk2TCxXQUF0QjtBQUNBO0FBQ0Q7QUFDRHNGLHdCQUFrQnBGLE1BQU0vTCxHQUF4QjtBQUNBLFVBQUk0USxXQUFXLElBQVgsSUFBbUI3RSxNQUFNN0wsT0FBTixJQUFpQixJQUFwQyxJQUE0QyxDQUFDa1Isc0JBQXNCckYsTUFBTTlMLEtBQTVCLENBQTdDLElBQW1GLE9BQU84TCxNQUFNcE0sR0FBYixLQUFxQixRQUE1RyxFQUFzSDtBQUFFO0FBQ3ZILFdBQUksQ0FBQ2lSLFFBQVEvQixJQUFiLEVBQW1CK0IsUUFBUS9CLElBQVIsR0FBZSxDQUFDOUMsS0FBRCxDQUFmLENBQW5CLEtBQ0s2RSxRQUFRL0IsSUFBUixDQUFhak4sSUFBYixDQUFrQm1LLEtBQWxCO0FBQ0w7QUFDRDtBQUNEO0FBQ0Q7QUFDRDtBQUNELFdBQVNvRixpQkFBVCxDQUEyQnpRLElBQTNCLEVBQWlDO0FBQ2hDLE9BQUkrSyxTQUFTL0ssS0FBSzBKLFVBQWxCO0FBQ0EsT0FBSXFCLFVBQVUsSUFBZCxFQUFvQkEsT0FBT3BCLFdBQVAsQ0FBbUIzSixJQUFuQjtBQUNwQjtBQUNELFdBQVN3USxRQUFULENBQWtCbkYsS0FBbEIsRUFBeUI7QUFDeEIsT0FBSUEsTUFBTTlMLEtBQU4sSUFBZSxPQUFPOEwsTUFBTTlMLEtBQU4sQ0FBWWlSLFFBQW5CLEtBQWdDLFVBQW5ELEVBQStEbkYsTUFBTTlMLEtBQU4sQ0FBWWlSLFFBQVosQ0FBcUI3TyxJQUFyQixDQUEwQjBKLE1BQU0zTCxLQUFoQyxFQUF1QzJMLEtBQXZDO0FBQy9ELE9BQUksT0FBT0EsTUFBTXBNLEdBQWIsS0FBcUIsUUFBckIsSUFBaUMsT0FBT29NLE1BQU0xTCxNQUFOLENBQWE2USxRQUFwQixLQUFpQyxVQUF0RSxFQUFrRm5GLE1BQU0xTCxNQUFOLENBQWE2USxRQUFiLENBQXNCN08sSUFBdEIsQ0FBMkIwSixNQUFNM0wsS0FBakMsRUFBd0MyTCxLQUF4QztBQUNsRixPQUFJQSxNQUFNeEwsUUFBTixJQUFrQixJQUF0QixFQUE0QjJRLFNBQVNuRixNQUFNeEwsUUFBZixFQUE1QixLQUNLO0FBQ0osUUFBSVQsV0FBV2lNLE1BQU1qTSxRQUFyQjtBQUNBLFFBQUlhLE1BQU1DLE9BQU4sQ0FBY2QsUUFBZCxDQUFKLEVBQTZCO0FBQzVCLFVBQUssSUFBSWdCLElBQUksQ0FBYixFQUFnQkEsSUFBSWhCLFNBQVNpQixNQUE3QixFQUFxQ0QsR0FBckMsRUFBMEM7QUFDekMsVUFBSXlNLFFBQVF6TixTQUFTZ0IsQ0FBVCxDQUFaO0FBQ0EsVUFBSXlNLFNBQVMsSUFBYixFQUFtQjJELFNBQVMzRCxLQUFUO0FBQ25CO0FBQ0Q7QUFDRDtBQUNEO0FBQ0Q7QUFDQSxXQUFTSyxRQUFULENBQWtCN0IsS0FBbEIsRUFBeUJ5QixNQUF6QixFQUFpQzFCLEVBQWpDLEVBQXFDO0FBQ3BDLFFBQUssSUFBSTBFLElBQVQsSUFBaUJoRCxNQUFqQixFQUF5QjtBQUN4QjZELFlBQVF0RixLQUFSLEVBQWV5RSxJQUFmLEVBQXFCLElBQXJCLEVBQTJCaEQsT0FBT2dELElBQVAsQ0FBM0IsRUFBeUMxRSxFQUF6QztBQUNBO0FBQ0Q7QUFDRCxXQUFTdUYsT0FBVCxDQUFpQnRGLEtBQWpCLEVBQXdCeUUsSUFBeEIsRUFBOEJsQyxHQUE5QixFQUFtQzVNLEtBQW5DLEVBQTBDb0ssRUFBMUMsRUFBOEM7QUFDN0MsT0FBSTRCLFVBQVUzQixNQUFNL0wsR0FBcEI7QUFDQSxPQUFJd1EsU0FBUyxLQUFULElBQWtCQSxTQUFTLElBQTNCLElBQW9DbEMsUUFBUTVNLEtBQVIsSUFBaUIsQ0FBQzRQLGdCQUFnQnZGLEtBQWhCLEVBQXVCeUUsSUFBdkIsQ0FBbkIsSUFBb0QsUUFBTzlPLEtBQVAseUNBQU9BLEtBQVAsT0FBaUIsUUFBeEcsSUFBb0gsT0FBT0EsS0FBUCxLQUFpQixXQUFySSxJQUFvSjZQLGtCQUFrQmYsSUFBbEIsQ0FBeEosRUFBaUw7QUFDakwsT0FBSWdCLGNBQWNoQixLQUFLMUYsT0FBTCxDQUFhLEdBQWIsQ0FBbEI7QUFDQSxPQUFJMEcsY0FBYyxDQUFDLENBQWYsSUFBb0JoQixLQUFLaUIsTUFBTCxDQUFZLENBQVosRUFBZUQsV0FBZixNQUFnQyxPQUF4RCxFQUFpRTtBQUNoRTlELFlBQVFnRSxjQUFSLENBQXVCLDhCQUF2QixFQUF1RGxCLEtBQUs3RixLQUFMLENBQVc2RyxjQUFjLENBQXpCLENBQXZELEVBQW9GOVAsS0FBcEY7QUFDQSxJQUZELE1BR0ssSUFBSThPLEtBQUssQ0FBTCxNQUFZLEdBQVosSUFBbUJBLEtBQUssQ0FBTCxNQUFZLEdBQS9CLElBQXNDLE9BQU85TyxLQUFQLEtBQWlCLFVBQTNELEVBQXVFaVEsWUFBWTVGLEtBQVosRUFBbUJ5RSxJQUFuQixFQUF5QjlPLEtBQXpCLEVBQXZFLEtBQ0EsSUFBSThPLFNBQVMsT0FBYixFQUFzQm9CLFlBQVlsRSxPQUFaLEVBQXFCWSxHQUFyQixFQUEwQjVNLEtBQTFCLEVBQXRCLEtBQ0EsSUFBSThPLFFBQVE5QyxPQUFSLElBQW1CLENBQUNtRSxZQUFZckIsSUFBWixDQUFwQixJQUF5QzFFLE9BQU8zTCxTQUFoRCxJQUE2RCxDQUFDMlIsZ0JBQWdCL0YsS0FBaEIsQ0FBbEUsRUFBMEY7QUFDOUY7QUFDQSxRQUFJQSxNQUFNcE0sR0FBTixLQUFjLE9BQWQsSUFBeUI2USxTQUFTLE9BQWxDLElBQTZDekUsTUFBTS9MLEdBQU4sQ0FBVTBCLEtBQVYsSUFBbUJBLEtBQWhFLElBQXlFcUssTUFBTS9MLEdBQU4sS0FBY21MLEtBQUs0RyxhQUFoRyxFQUErRztBQUMvRztBQUNBLFFBQUloRyxNQUFNcE0sR0FBTixLQUFjLFFBQWQsSUFBMEI2USxTQUFTLE9BQW5DLElBQThDekUsTUFBTS9MLEdBQU4sQ0FBVTBCLEtBQVYsSUFBbUJBLEtBQWpFLElBQTBFcUssTUFBTS9MLEdBQU4sS0FBY21MLEtBQUs0RyxhQUFqRyxFQUFnSDtBQUNoSDtBQUNBLFFBQUloRyxNQUFNcE0sR0FBTixLQUFjLFFBQWQsSUFBMEI2USxTQUFTLE9BQW5DLElBQThDekUsTUFBTS9MLEdBQU4sQ0FBVTBCLEtBQVYsSUFBbUJBLEtBQXJFLEVBQTRFO0FBQzVFO0FBQ0EsUUFBSXFLLE1BQU1wTSxHQUFOLEtBQWMsT0FBZCxJQUF5QjZRLFNBQVMsTUFBdEMsRUFBOEM7QUFDN0M5QyxhQUFRc0UsWUFBUixDQUFxQnhCLElBQXJCLEVBQTJCOU8sS0FBM0I7QUFDQTtBQUNBO0FBQ0RnTSxZQUFROEMsSUFBUixJQUFnQjlPLEtBQWhCO0FBQ0EsSUFiSSxNQWNBO0FBQ0osUUFBSSxPQUFPQSxLQUFQLEtBQWlCLFNBQXJCLEVBQWdDO0FBQy9CLFNBQUlBLEtBQUosRUFBV2dNLFFBQVFzRSxZQUFSLENBQXFCeEIsSUFBckIsRUFBMkIsRUFBM0IsRUFBWCxLQUNLOUMsUUFBUXVFLGVBQVIsQ0FBd0J6QixJQUF4QjtBQUNMLEtBSEQsTUFJSzlDLFFBQVFzRSxZQUFSLENBQXFCeEIsU0FBUyxXQUFULEdBQXVCLE9BQXZCLEdBQWlDQSxJQUF0RCxFQUE0RDlPLEtBQTVEO0FBQ0w7QUFDRDtBQUNELFdBQVNzTSxZQUFULENBQXNCakMsS0FBdEIsRUFBNkI7QUFDNUIsT0FBSXlCLFNBQVN6QixNQUFNOUwsS0FBbkI7QUFDQSxPQUFJOEwsTUFBTXBNLEdBQU4sS0FBYyxRQUFkLElBQTBCNk4sVUFBVSxJQUF4QyxFQUE4QztBQUM3QyxRQUFJLFdBQVdBLE1BQWYsRUFBdUI2RCxRQUFRdEYsS0FBUixFQUFlLE9BQWYsRUFBd0IsSUFBeEIsRUFBOEJ5QixPQUFPOUwsS0FBckMsRUFBNEN2QixTQUE1QztBQUN2QixRQUFJLG1CQUFtQnFOLE1BQXZCLEVBQStCNkQsUUFBUXRGLEtBQVIsRUFBZSxlQUFmLEVBQWdDLElBQWhDLEVBQXNDeUIsT0FBTzBFLGFBQTdDLEVBQTREL1IsU0FBNUQ7QUFDL0I7QUFDRDtBQUNELFdBQVNnUSxXQUFULENBQXFCcEUsS0FBckIsRUFBNEJ1QyxHQUE1QixFQUFpQ2QsTUFBakMsRUFBeUMxQixFQUF6QyxFQUE2QztBQUM1QyxPQUFJMEIsVUFBVSxJQUFkLEVBQW9CO0FBQ25CLFNBQUssSUFBSWdELElBQVQsSUFBaUJoRCxNQUFqQixFQUF5QjtBQUN4QjZELGFBQVF0RixLQUFSLEVBQWV5RSxJQUFmLEVBQXFCbEMsT0FBT0EsSUFBSWtDLElBQUosQ0FBNUIsRUFBdUNoRCxPQUFPZ0QsSUFBUCxDQUF2QyxFQUFxRDFFLEVBQXJEO0FBQ0E7QUFDRDtBQUNELE9BQUl3QyxPQUFPLElBQVgsRUFBaUI7QUFDaEIsU0FBSyxJQUFJa0MsSUFBVCxJQUFpQmxDLEdBQWpCLEVBQXNCO0FBQ3JCLFNBQUlkLFVBQVUsSUFBVixJQUFrQixFQUFFZ0QsUUFBUWhELE1BQVYsQ0FBdEIsRUFBeUM7QUFDeEMsVUFBSWdELFNBQVMsV0FBYixFQUEwQkEsT0FBTyxPQUFQO0FBQzFCLFVBQUlBLEtBQUssQ0FBTCxNQUFZLEdBQVosSUFBbUJBLEtBQUssQ0FBTCxNQUFZLEdBQS9CLElBQXNDLENBQUNlLGtCQUFrQmYsSUFBbEIsQ0FBM0MsRUFBb0VtQixZQUFZNUYsS0FBWixFQUFtQnlFLElBQW5CLEVBQXlCclEsU0FBekIsRUFBcEUsS0FDSyxJQUFJcVEsU0FBUyxLQUFiLEVBQW9CekUsTUFBTS9MLEdBQU4sQ0FBVWlTLGVBQVYsQ0FBMEJ6QixJQUExQjtBQUN6QjtBQUNEO0FBQ0Q7QUFDRDtBQUNELFdBQVNjLGVBQVQsQ0FBeUJ2RixLQUF6QixFQUFnQ29HLElBQWhDLEVBQXNDO0FBQ3JDLFVBQU9BLFNBQVMsT0FBVCxJQUFvQkEsU0FBUyxTQUE3QixJQUEwQ0EsU0FBUyxlQUFuRCxJQUFzRUEsU0FBUyxVQUFULElBQXVCcEcsTUFBTS9MLEdBQU4sS0FBY21MLEtBQUs0RyxhQUF2SDtBQUNBO0FBQ0QsV0FBU1IsaUJBQVQsQ0FBMkJZLElBQTNCLEVBQWlDO0FBQ2hDLFVBQU9BLFNBQVMsUUFBVCxJQUFxQkEsU0FBUyxVQUE5QixJQUE0Q0EsU0FBUyxVQUFyRCxJQUFtRUEsU0FBUyxVQUE1RSxJQUEwRkEsU0FBUyxnQkFBbkcsSUFBdUhBLFNBQVMsZ0JBQXZJO0FBQ0E7QUFDRCxXQUFTTixXQUFULENBQXFCTSxJQUFyQixFQUEyQjtBQUMxQixVQUFPQSxTQUFTLE1BQVQsSUFBbUJBLFNBQVMsTUFBNUIsSUFBc0NBLFNBQVMsTUFBL0MsSUFBeURBLFNBQVMsT0FBbEUsSUFBNkVBLFNBQVMsUUFBN0YsQ0FEMEIsQ0FDMkU7QUFDckc7QUFDRCxXQUFTTCxlQUFULENBQXlCL0YsS0FBekIsRUFBK0I7QUFDOUIsVUFBT0EsTUFBTTlMLEtBQU4sQ0FBWXdOLEVBQVosSUFBa0IxQixNQUFNcE0sR0FBTixDQUFVbUwsT0FBVixDQUFrQixHQUFsQixJQUF5QixDQUFDLENBQW5EO0FBQ0E7QUFDRCxXQUFTc0cscUJBQVQsQ0FBK0JnQixNQUEvQixFQUF1QztBQUN0QyxVQUFPQSxVQUFVLElBQVYsS0FBbUJBLE9BQU9DLFFBQVAsSUFBbUJELE9BQU9FLFFBQTFCLElBQXNDRixPQUFPckIsY0FBN0MsSUFBK0RxQixPQUFPbEIsUUFBekYsQ0FBUDtBQUNBO0FBQ0Q7QUFDQSxXQUFTVSxXQUFULENBQXFCbEUsT0FBckIsRUFBOEJZLEdBQTlCLEVBQW1DaUUsS0FBbkMsRUFBMEM7QUFDekMsT0FBSWpFLFFBQVFpRSxLQUFaLEVBQW1CN0UsUUFBUTZFLEtBQVIsQ0FBY0MsT0FBZCxHQUF3QixFQUF4QixFQUE0QmxFLE1BQU0sSUFBbEM7QUFDbkIsT0FBSWlFLFNBQVMsSUFBYixFQUFtQjdFLFFBQVE2RSxLQUFSLENBQWNDLE9BQWQsR0FBd0IsRUFBeEIsQ0FBbkIsS0FDSyxJQUFJLE9BQU9ELEtBQVAsS0FBaUIsUUFBckIsRUFBK0I3RSxRQUFRNkUsS0FBUixDQUFjQyxPQUFkLEdBQXdCRCxLQUF4QixDQUEvQixLQUNBO0FBQ0osUUFBSSxPQUFPakUsR0FBUCxLQUFlLFFBQW5CLEVBQTZCWixRQUFRNkUsS0FBUixDQUFjQyxPQUFkLEdBQXdCLEVBQXhCO0FBQzdCLFNBQUssSUFBSWhDLElBQVQsSUFBaUIrQixLQUFqQixFQUF3QjtBQUN2QjdFLGFBQVE2RSxLQUFSLENBQWMvQixJQUFkLElBQXNCK0IsTUFBTS9CLElBQU4sQ0FBdEI7QUFDQTtBQUNELFFBQUlsQyxPQUFPLElBQVAsSUFBZSxPQUFPQSxHQUFQLEtBQWUsUUFBbEMsRUFBNEM7QUFDM0MsVUFBSyxJQUFJa0MsSUFBVCxJQUFpQmxDLEdBQWpCLEVBQXNCO0FBQ3JCLFVBQUksRUFBRWtDLFFBQVErQixLQUFWLENBQUosRUFBc0I3RSxRQUFRNkUsS0FBUixDQUFjL0IsSUFBZCxJQUFzQixFQUF0QjtBQUN0QjtBQUNEO0FBQ0Q7QUFDRDtBQUNEO0FBQ0EsV0FBU21CLFdBQVQsQ0FBcUI1RixLQUFyQixFQUE0QnlFLElBQTVCLEVBQWtDOU8sS0FBbEMsRUFBeUM7QUFDeEMsT0FBSWdNLFVBQVUzQixNQUFNL0wsR0FBcEI7QUFDQSxPQUFJaUYsV0FBVyxPQUFPcUcsT0FBUCxLQUFtQixVQUFuQixHQUFnQzVKLEtBQWhDLEdBQXdDLFVBQVM4QyxDQUFULEVBQVk7QUFDbEUsUUFBSXdNLFNBQVN0UCxNQUFNVyxJQUFOLENBQVdxTCxPQUFYLEVBQW9CbEosQ0FBcEIsQ0FBYjtBQUNBOEcsWUFBUWpKLElBQVIsQ0FBYXFMLE9BQWIsRUFBc0JsSixDQUF0QjtBQUNBLFdBQU93TSxNQUFQO0FBQ0EsSUFKRDtBQUtBLE9BQUlSLFFBQVE5QyxPQUFaLEVBQXFCQSxRQUFROEMsSUFBUixJQUFnQixPQUFPOU8sS0FBUCxLQUFpQixVQUFqQixHQUE4QnVELFFBQTlCLEdBQXlDLElBQXpELENBQXJCLEtBQ0s7QUFDSixRQUFJd04sWUFBWWpDLEtBQUs3RixLQUFMLENBQVcsQ0FBWCxDQUFoQjtBQUNBLFFBQUlvQixNQUFNekwsTUFBTixLQUFpQkgsU0FBckIsRUFBZ0M0TCxNQUFNekwsTUFBTixHQUFlLEVBQWY7QUFDaEMsUUFBSXlMLE1BQU16TCxNQUFOLENBQWFrUSxJQUFiLE1BQXVCdkwsUUFBM0IsRUFBcUM7QUFDckMsUUFBSThHLE1BQU16TCxNQUFOLENBQWFrUSxJQUFiLEtBQXNCLElBQTFCLEVBQWdDOUMsUUFBUWdGLG1CQUFSLENBQTRCRCxTQUE1QixFQUF1QzFHLE1BQU16TCxNQUFOLENBQWFrUSxJQUFiLENBQXZDLEVBQTJELEtBQTNEO0FBQ2hDLFFBQUksT0FBTzlPLEtBQVAsS0FBaUIsVUFBckIsRUFBaUM7QUFDaENxSyxXQUFNekwsTUFBTixDQUFha1EsSUFBYixJQUFxQnZMLFFBQXJCO0FBQ0F5SSxhQUFRaUYsZ0JBQVIsQ0FBeUJGLFNBQXpCLEVBQW9DMUcsTUFBTXpMLE1BQU4sQ0FBYWtRLElBQWIsQ0FBcEMsRUFBd0QsS0FBeEQ7QUFDQTtBQUNEO0FBQ0Q7QUFDRDtBQUNBLFdBQVN2RSxhQUFULENBQXVCbUcsTUFBdkIsRUFBK0JyRyxLQUEvQixFQUFzQ0gsS0FBdEMsRUFBNkM7QUFDNUMsT0FBSSxPQUFPd0csT0FBT1EsTUFBZCxLQUF5QixVQUE3QixFQUF5Q1IsT0FBT1EsTUFBUCxDQUFjdlEsSUFBZCxDQUFtQjBKLE1BQU0zTCxLQUF6QixFQUFnQzJMLEtBQWhDO0FBQ3pDLE9BQUksT0FBT3FHLE9BQU9DLFFBQWQsS0FBMkIsVUFBL0IsRUFBMkN6RyxNQUFNaEssSUFBTixDQUFXd1EsT0FBT0MsUUFBUCxDQUFnQmpPLElBQWhCLENBQXFCMkgsTUFBTTNMLEtBQTNCLEVBQWtDMkwsS0FBbEMsQ0FBWDtBQUMzQztBQUNELFdBQVM0RCxlQUFULENBQXlCeUMsTUFBekIsRUFBaUNyRyxLQUFqQyxFQUF3Q0gsS0FBeEMsRUFBK0M7QUFDOUMsT0FBSSxPQUFPd0csT0FBT0UsUUFBZCxLQUEyQixVQUEvQixFQUEyQzFHLE1BQU1oSyxJQUFOLENBQVd3USxPQUFPRSxRQUFQLENBQWdCbE8sSUFBaEIsQ0FBcUIySCxNQUFNM0wsS0FBM0IsRUFBa0MyTCxLQUFsQyxDQUFYO0FBQzNDO0FBQ0QsV0FBUzJELGVBQVQsQ0FBeUIzRCxLQUF6QixFQUFnQ3VDLEdBQWhDLEVBQXFDO0FBQ3BDLE9BQUl1RSxnQkFBSixFQUFzQkMsb0JBQXRCO0FBQ0EsT0FBSS9HLE1BQU05TCxLQUFOLElBQWUsSUFBZixJQUF1QixPQUFPOEwsTUFBTTlMLEtBQU4sQ0FBWThTLGNBQW5CLEtBQXNDLFVBQWpFLEVBQTZFRixtQkFBbUI5RyxNQUFNOUwsS0FBTixDQUFZOFMsY0FBWixDQUEyQjFRLElBQTNCLENBQWdDMEosTUFBTTNMLEtBQXRDLEVBQTZDMkwsS0FBN0MsRUFBb0R1QyxHQUFwRCxDQUFuQjtBQUM3RSxPQUFJLE9BQU92QyxNQUFNcE0sR0FBYixLQUFxQixRQUFyQixJQUFpQyxPQUFPb00sTUFBTTFMLE1BQU4sQ0FBYTBTLGNBQXBCLEtBQXVDLFVBQTVFLEVBQXdGRCx1QkFBdUIvRyxNQUFNMUwsTUFBTixDQUFhMFMsY0FBYixDQUE0QjFRLElBQTVCLENBQWlDMEosTUFBTTNMLEtBQXZDLEVBQThDMkwsS0FBOUMsRUFBcUR1QyxHQUFyRCxDQUF2QjtBQUN4RixPQUFJLEVBQUV1RSxxQkFBcUIxUyxTQUFyQixJQUFrQzJTLHlCQUF5QjNTLFNBQTdELEtBQTJFLENBQUMwUyxnQkFBNUUsSUFBZ0csQ0FBQ0Msb0JBQXJHLEVBQTJIO0FBQzFIL0csVUFBTS9MLEdBQU4sR0FBWXNPLElBQUl0TyxHQUFoQjtBQUNBK0wsVUFBTTdMLE9BQU4sR0FBZ0JvTyxJQUFJcE8sT0FBcEI7QUFDQTZMLFVBQU14TCxRQUFOLEdBQWlCK04sSUFBSS9OLFFBQXJCO0FBQ0EsV0FBTyxJQUFQO0FBQ0E7QUFDRCxVQUFPLEtBQVA7QUFDQTtBQUNELFdBQVN5UyxNQUFULENBQWdCaFQsR0FBaEIsRUFBcUIwTCxNQUFyQixFQUE2QjtBQUM1QixPQUFJLENBQUMxTCxHQUFMLEVBQVUsTUFBTSxJQUFJMEMsS0FBSixDQUFVLG1GQUFWLENBQU47QUFDVixPQUFJa0osUUFBUSxFQUFaO0FBQ0EsT0FBSXFILFNBQVM5SCxLQUFLNEcsYUFBbEI7QUFDQTtBQUNBLE9BQUkvUixJQUFJMEwsTUFBSixJQUFjLElBQWxCLEVBQXdCMUwsSUFBSStOLFdBQUosR0FBa0IsRUFBbEI7QUFDeEIsT0FBSSxDQUFDcE4sTUFBTUMsT0FBTixDQUFjOEssTUFBZCxDQUFMLEVBQTRCQSxTQUFTLENBQUNBLE1BQUQsQ0FBVDtBQUM1QjJDLGVBQVlyTyxHQUFaLEVBQWlCQSxJQUFJMEwsTUFBckIsRUFBNkJoTSxNQUFNbUIsaUJBQU4sQ0FBd0I2SyxNQUF4QixDQUE3QixFQUE4RCxLQUE5RCxFQUFxRUUsS0FBckUsRUFBNEUsSUFBNUUsRUFBa0Z6TCxTQUFsRjtBQUNBSCxPQUFJMEwsTUFBSixHQUFhQSxNQUFiO0FBQ0EsUUFBSyxJQUFJNUssSUFBSSxDQUFiLEVBQWdCQSxJQUFJOEssTUFBTTdLLE1BQTFCLEVBQWtDRCxHQUFsQztBQUF1QzhLLFVBQU05SyxDQUFOO0FBQXZDLElBQ0EsSUFBSXFLLEtBQUs0RyxhQUFMLEtBQXVCa0IsTUFBM0IsRUFBbUNBLE9BQU9DLEtBQVA7QUFDbkM7QUFDRCxTQUFPLEVBQUNGLFFBQVFBLE1BQVQsRUFBaUJ6SCxrQkFBa0JBLGdCQUFuQyxFQUFQO0FBQ0EsRUE3a0JEO0FBOGtCQSxVQUFTNEgsUUFBVCxDQUFrQmxPLFFBQWxCLEVBQTRCO0FBQzNCO0FBQ0EsTUFBSW1PLE9BQU8sRUFBWDtBQUNBLE1BQUlDLE9BQU8sQ0FBWDtBQUFBLE1BQWNDLFVBQVUsSUFBeEI7QUFDQSxNQUFJQyxVQUFVLE9BQU9DLHFCQUFQLEtBQWlDLFVBQWpDLEdBQThDQSxxQkFBOUMsR0FBc0UxUCxVQUFwRjtBQUNBLFNBQU8sWUFBVztBQUNqQixPQUFJMlAsTUFBTUMsS0FBS0QsR0FBTCxFQUFWO0FBQ0EsT0FBSUosU0FBUyxDQUFULElBQWNJLE1BQU1KLElBQU4sSUFBY0QsSUFBaEMsRUFBc0M7QUFDckNDLFdBQU9JLEdBQVA7QUFDQXhPO0FBQ0EsSUFIRCxNQUlLLElBQUlxTyxZQUFZLElBQWhCLEVBQXNCO0FBQzFCQSxjQUFVQyxRQUFRLFlBQVc7QUFDNUJELGVBQVUsSUFBVjtBQUNBck87QUFDQW9PLFlBQU9LLEtBQUtELEdBQUwsRUFBUDtBQUNBLEtBSlMsRUFJUEwsUUFBUUssTUFBTUosSUFBZCxDQUpPLENBQVY7QUFLQTtBQUNELEdBYkQ7QUFjQTtBQUNELEtBQUlNLE1BQU0sU0FBTkEsR0FBTSxDQUFTOU0sT0FBVCxFQUFrQjtBQUMzQixNQUFJK00sZ0JBQWdCMUksYUFBYXJFLE9BQWIsQ0FBcEI7QUFDQStNLGdCQUFjckksZ0JBQWQsQ0FBK0IsVUFBUy9HLENBQVQsRUFBWTtBQUMxQyxPQUFJQSxFQUFFcVAsTUFBRixLQUFhLEtBQWpCLEVBQXdCQTtBQUN4QixHQUZEO0FBR0EsTUFBSUMsWUFBWSxFQUFoQjtBQUNBLFdBQVNDLFNBQVQsQ0FBbUJDLElBQW5CLEVBQXlCL08sUUFBekIsRUFBbUM7QUFDbENnUCxlQUFZRCxJQUFaO0FBQ0FGLGFBQVVsUyxJQUFWLENBQWVvUyxJQUFmLEVBQXFCYixTQUFTbE8sUUFBVCxDQUFyQjtBQUNBO0FBQ0QsV0FBU2dQLFdBQVQsQ0FBcUJELElBQXJCLEVBQTJCO0FBQzFCLE9BQUlFLFFBQVFKLFVBQVVoSixPQUFWLENBQWtCa0osSUFBbEIsQ0FBWjtBQUNBLE9BQUlFLFFBQVEsQ0FBQyxDQUFiLEVBQWdCSixVQUFVSyxNQUFWLENBQWlCRCxLQUFqQixFQUF3QixDQUF4QjtBQUNoQjtBQUNELFdBQVNMLE1BQVQsR0FBa0I7QUFDakIsUUFBSyxJQUFJL1MsSUFBSSxDQUFiLEVBQWdCQSxJQUFJZ1QsVUFBVS9TLE1BQTlCLEVBQXNDRCxLQUFLLENBQTNDLEVBQThDO0FBQzdDZ1QsY0FBVWhULENBQVY7QUFDQTtBQUNEO0FBQ0QsU0FBTyxFQUFDaVQsV0FBV0EsU0FBWixFQUF1QkUsYUFBYUEsV0FBcEMsRUFBaURKLFFBQVFBLE1BQXpELEVBQWlFYixRQUFRWSxjQUFjWixNQUF2RixFQUFQO0FBQ0EsRUFwQkQ7QUFxQkEsS0FBSW9CLGdCQUFnQlQsSUFBSTVOLE1BQUosQ0FBcEI7QUFDQWtGLGdCQUFlakUscUJBQWYsQ0FBcUNvTixjQUFjUCxNQUFuRDtBQUNBLEtBQUlRLE1BQU0sU0FBTkEsR0FBTSxDQUFTQyxjQUFULEVBQXlCO0FBQ2xDLFNBQU8sVUFBU0MsSUFBVCxFQUFlQyxTQUFmLEVBQTBCO0FBQ2hDLE9BQUlBLGNBQWMsSUFBbEIsRUFBd0I7QUFDdkJGLG1CQUFldEIsTUFBZixDQUFzQnVCLElBQXRCLEVBQTRCLEVBQTVCO0FBQ0FELG1CQUFlTCxXQUFmLENBQTJCTSxJQUEzQjtBQUNBO0FBQ0E7O0FBRUQsT0FBSUMsVUFBVS9SLElBQVYsSUFBa0IsSUFBbEIsSUFBMEIsT0FBTytSLFNBQVAsS0FBcUIsVUFBbkQsRUFBK0QsTUFBTSxJQUFJOVIsS0FBSixDQUFVLDhEQUFWLENBQU47O0FBRS9ELE9BQUkrUixPQUFPLFNBQVBBLElBQU8sR0FBVztBQUNyQkgsbUJBQWV0QixNQUFmLENBQXNCdUIsSUFBdEIsRUFBNEI3VSxNQUFNOFUsU0FBTixDQUE1QjtBQUNBLElBRkQ7QUFHQUYsa0JBQWVQLFNBQWYsQ0FBeUJRLElBQXpCLEVBQStCRSxJQUEvQjtBQUNBSCxrQkFBZVQsTUFBZjtBQUNBLEdBZEQ7QUFlQSxFQWhCRDtBQWlCQTVRLEdBQUV5UixLQUFGLEdBQVVMLElBQUlELGFBQUosQ0FBVjtBQUNBLEtBQUlwTyxVQUFVOUMsZUFBZDtBQUNBLEtBQUl5UixtQkFBbUIsU0FBbkJBLGdCQUFtQixDQUFTQyxNQUFULEVBQWlCO0FBQ3ZDLE1BQUlBLFdBQVcsRUFBWCxJQUFpQkEsVUFBVSxJQUEvQixFQUFxQyxPQUFPLEVBQVA7QUFDckMsTUFBSUEsT0FBT0MsTUFBUCxDQUFjLENBQWQsTUFBcUIsR0FBekIsRUFBOEJELFNBQVNBLE9BQU9qSyxLQUFQLENBQWEsQ0FBYixDQUFUO0FBQzlCLE1BQUltSyxVQUFVRixPQUFPRyxLQUFQLENBQWEsR0FBYixDQUFkO0FBQUEsTUFBaUNDLFFBQVEsRUFBekM7QUFBQSxNQUE2Q0MsV0FBVyxFQUF4RDtBQUNBLE9BQUssSUFBSW5VLElBQUksQ0FBYixFQUFnQkEsSUFBSWdVLFFBQVEvVCxNQUE1QixFQUFvQ0QsR0FBcEMsRUFBeUM7QUFDeEMsT0FBSW9VLFFBQVFKLFFBQVFoVSxDQUFSLEVBQVdpVSxLQUFYLENBQWlCLEdBQWpCLENBQVo7QUFDQSxPQUFJSSxPQUFPQyxtQkFBbUJGLE1BQU0sQ0FBTixDQUFuQixDQUFYO0FBQ0EsT0FBSXhULFFBQVF3VCxNQUFNblUsTUFBTixLQUFpQixDQUFqQixHQUFxQnFVLG1CQUFtQkYsTUFBTSxDQUFOLENBQW5CLENBQXJCLEdBQW9ELEVBQWhFO0FBQ0EsT0FBSXhULFVBQVUsTUFBZCxFQUFzQkEsUUFBUSxJQUFSLENBQXRCLEtBQ0ssSUFBSUEsVUFBVSxPQUFkLEVBQXVCQSxRQUFRLEtBQVI7QUFDNUIsT0FBSTJULFNBQVNGLEtBQUtKLEtBQUwsQ0FBVyxVQUFYLENBQWI7QUFDQSxPQUFJTyxTQUFTTixLQUFiO0FBQ0EsT0FBSUcsS0FBS3JLLE9BQUwsQ0FBYSxHQUFiLElBQW9CLENBQUMsQ0FBekIsRUFBNEJ1SyxPQUFPRSxHQUFQO0FBQzVCLFFBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSCxPQUFPdFUsTUFBM0IsRUFBbUN5VSxHQUFuQyxFQUF3QztBQUN2QyxRQUFJQyxRQUFRSixPQUFPRyxDQUFQLENBQVo7QUFBQSxRQUF1QkUsWUFBWUwsT0FBT0csSUFBSSxDQUFYLENBQW5DO0FBQ0EsUUFBSUcsV0FBV0QsYUFBYSxFQUFiLElBQW1CLENBQUNFLE1BQU1DLFNBQVNILFNBQVQsRUFBb0IsRUFBcEIsQ0FBTixDQUFuQztBQUNBLFFBQUlJLFVBQVVOLE1BQU1ILE9BQU90VSxNQUFQLEdBQWdCLENBQXBDO0FBQ0EsUUFBSTBVLFVBQVUsRUFBZCxFQUFrQjtBQUNqQixTQUFJTixPQUFPRSxPQUFPMUssS0FBUCxDQUFhLENBQWIsRUFBZ0I2SyxDQUFoQixFQUFtQnhULElBQW5CLEVBQVg7QUFDQSxTQUFJaVQsU0FBU0UsSUFBVCxLQUFrQixJQUF0QixFQUE0QkYsU0FBU0UsSUFBVCxJQUFpQixDQUFqQjtBQUM1Qk0sYUFBUVIsU0FBU0UsSUFBVCxHQUFSO0FBQ0E7QUFDRCxRQUFJRyxPQUFPRyxLQUFQLEtBQWlCLElBQXJCLEVBQTJCO0FBQzFCSCxZQUFPRyxLQUFQLElBQWdCSyxVQUFVcFUsS0FBVixHQUFrQmlVLFdBQVcsRUFBWCxHQUFnQixFQUFsRDtBQUNBO0FBQ0RMLGFBQVNBLE9BQU9HLEtBQVAsQ0FBVDtBQUNBO0FBQ0Q7QUFDRCxTQUFPVCxLQUFQO0FBQ0EsRUE3QkQ7QUE4QkEsS0FBSWUsYUFBYSxTQUFiQSxVQUFhLENBQVNsUCxPQUFULEVBQWtCO0FBQ2xDLE1BQUltUCxvQkFBb0IsT0FBT25QLFFBQVFvUCxPQUFSLENBQWdCQyxTQUF2QixLQUFxQyxVQUE3RDtBQUNBLE1BQUlDLGFBQWEsT0FBT3RTLFlBQVAsS0FBd0IsVUFBeEIsR0FBcUNBLFlBQXJDLEdBQW9EQyxVQUFyRTtBQUNBLFdBQVNzUyxVQUFULENBQW9CQyxTQUFwQixFQUErQjtBQUM5QixPQUFJdE8sT0FBT2xCLFFBQVF5UCxRQUFSLENBQWlCRCxTQUFqQixFQUE0QnZVLE9BQTVCLENBQW9DLDBCQUFwQyxFQUFnRXNULGtCQUFoRSxDQUFYO0FBQ0EsT0FBSWlCLGNBQWMsVUFBZCxJQUE0QnRPLEtBQUssQ0FBTCxNQUFZLEdBQTVDLEVBQWlEQSxPQUFPLE1BQU1BLElBQWI7QUFDakQsVUFBT0EsSUFBUDtBQUNBO0FBQ0QsTUFBSXdPLE9BQUo7QUFDQSxXQUFTQyxhQUFULENBQXVCQyxTQUF2QixFQUFrQztBQUNqQyxVQUFPLFlBQVc7QUFDakIsUUFBSUYsV0FBVyxJQUFmLEVBQXFCO0FBQ3JCQSxjQUFVSixXQUFXLFlBQVc7QUFDL0JJLGVBQVUsSUFBVjtBQUNBRTtBQUNBLEtBSFMsQ0FBVjtBQUlBLElBTkQ7QUFPQTtBQUNELFdBQVNDLFNBQVQsQ0FBbUJDLElBQW5CLEVBQXlCQyxTQUF6QixFQUFvQ0MsUUFBcEMsRUFBOEM7QUFDN0MsT0FBSUMsYUFBYUgsS0FBSzdMLE9BQUwsQ0FBYSxHQUFiLENBQWpCO0FBQ0EsT0FBSWlNLFlBQVlKLEtBQUs3TCxPQUFMLENBQWEsR0FBYixDQUFoQjtBQUNBLE9BQUlrTSxVQUFVRixhQUFhLENBQUMsQ0FBZCxHQUFrQkEsVUFBbEIsR0FBK0JDLFlBQVksQ0FBQyxDQUFiLEdBQWlCQSxTQUFqQixHQUE2QkosS0FBSzVWLE1BQS9FO0FBQ0EsT0FBSStWLGFBQWEsQ0FBQyxDQUFsQixFQUFxQjtBQUNwQixRQUFJRyxXQUFXRixZQUFZLENBQUMsQ0FBYixHQUFpQkEsU0FBakIsR0FBNkJKLEtBQUs1VixNQUFqRDtBQUNBLFFBQUltVyxjQUFjdkMsaUJBQWlCZ0MsS0FBS2hNLEtBQUwsQ0FBV21NLGFBQWEsQ0FBeEIsRUFBMkJHLFFBQTNCLENBQWpCLENBQWxCO0FBQ0EsU0FBSyxJQUFJRSxJQUFULElBQWlCRCxXQUFqQjtBQUE4Qk4sZUFBVU8sSUFBVixJQUFrQkQsWUFBWUMsSUFBWixDQUFsQjtBQUE5QjtBQUNBO0FBQ0QsT0FBSUosWUFBWSxDQUFDLENBQWpCLEVBQW9CO0FBQ25CLFFBQUlLLGFBQWF6QyxpQkFBaUJnQyxLQUFLaE0sS0FBTCxDQUFXb00sWUFBWSxDQUF2QixDQUFqQixDQUFqQjtBQUNBLFNBQUssSUFBSUksSUFBVCxJQUFpQkMsVUFBakI7QUFBNkJQLGNBQVNNLElBQVQsSUFBaUJDLFdBQVdELElBQVgsQ0FBakI7QUFBN0I7QUFDQTtBQUNELFVBQU9SLEtBQUtoTSxLQUFMLENBQVcsQ0FBWCxFQUFjcU0sT0FBZCxDQUFQO0FBQ0E7QUFDRCxNQUFJSyxTQUFTLEVBQUN4TSxRQUFRLElBQVQsRUFBYjtBQUNBd00sU0FBT0MsT0FBUCxHQUFpQixZQUFXO0FBQzNCLE9BQUlDLFFBQVFGLE9BQU94TSxNQUFQLENBQWNnSyxNQUFkLENBQXFCLENBQXJCLENBQVo7QUFDQSxXQUFRMEMsS0FBUjtBQUNDLFNBQUssR0FBTDtBQUFVLFlBQU9uQixXQUFXLE1BQVgsRUFBbUJ6TCxLQUFuQixDQUF5QjBNLE9BQU94TSxNQUFQLENBQWM5SixNQUF2QyxDQUFQO0FBQ1YsU0FBSyxHQUFMO0FBQVUsWUFBT3FWLFdBQVcsUUFBWCxFQUFxQnpMLEtBQXJCLENBQTJCME0sT0FBT3hNLE1BQVAsQ0FBYzlKLE1BQXpDLElBQW1EcVYsV0FBVyxNQUFYLENBQTFEO0FBQ1Y7QUFBUyxZQUFPQSxXQUFXLFVBQVgsRUFBdUJ6TCxLQUF2QixDQUE2QjBNLE9BQU94TSxNQUFQLENBQWM5SixNQUEzQyxJQUFxRHFWLFdBQVcsUUFBWCxDQUFyRCxHQUE0RUEsV0FBVyxNQUFYLENBQW5GO0FBSFY7QUFLQSxHQVBEO0FBUUFpQixTQUFPRyxPQUFQLEdBQWlCLFVBQVNiLElBQVQsRUFBZTVPLElBQWYsRUFBcUIwUCxPQUFyQixFQUE4QjtBQUM5QyxPQUFJYixZQUFZLEVBQWhCO0FBQUEsT0FBb0JDLFdBQVcsRUFBL0I7QUFDQUYsVUFBT0QsVUFBVUMsSUFBVixFQUFnQkMsU0FBaEIsRUFBMkJDLFFBQTNCLENBQVA7QUFDQSxPQUFJOU8sUUFBUSxJQUFaLEVBQWtCO0FBQ2pCLFNBQUssSUFBSW9QLElBQVQsSUFBaUJwUCxJQUFqQjtBQUF1QjZPLGVBQVVPLElBQVYsSUFBa0JwUCxLQUFLb1AsSUFBTCxDQUFsQjtBQUF2QixLQUNBUixPQUFPQSxLQUFLN1UsT0FBTCxDQUFhLFlBQWIsRUFBMkIsVUFBUzRWLE1BQVQsRUFBaUJDLEtBQWpCLEVBQXdCO0FBQ3pELFlBQU9mLFVBQVVlLEtBQVYsQ0FBUDtBQUNBLFlBQU81UCxLQUFLNFAsS0FBTCxDQUFQO0FBQ0EsS0FITSxDQUFQO0FBSUE7QUFDRCxPQUFJQyxRQUFRMVIsaUJBQWlCMFEsU0FBakIsQ0FBWjtBQUNBLE9BQUlnQixLQUFKLEVBQVdqQixRQUFRLE1BQU1pQixLQUFkO0FBQ1gsT0FBSUMsT0FBTzNSLGlCQUFpQjJRLFFBQWpCLENBQVg7QUFDQSxPQUFJZ0IsSUFBSixFQUFVbEIsUUFBUSxNQUFNa0IsSUFBZDtBQUNWLE9BQUk3QixpQkFBSixFQUF1QjtBQUN0QixRQUFJNVYsUUFBUXFYLFVBQVVBLFFBQVFyWCxLQUFsQixHQUEwQixJQUF0QztBQUNBLFFBQUkwWCxRQUFRTCxVQUFVQSxRQUFRSyxLQUFsQixHQUEwQixJQUF0QztBQUNBalIsWUFBUWtSLFVBQVI7QUFDQSxRQUFJTixXQUFXQSxRQUFRM1YsT0FBdkIsRUFBZ0MrRSxRQUFRb1AsT0FBUixDQUFnQitCLFlBQWhCLENBQTZCNVgsS0FBN0IsRUFBb0MwWCxLQUFwQyxFQUEyQ1QsT0FBT3hNLE1BQVAsR0FBZ0I4TCxJQUEzRCxFQUFoQyxLQUNLOVAsUUFBUW9QLE9BQVIsQ0FBZ0JDLFNBQWhCLENBQTBCOVYsS0FBMUIsRUFBaUMwWCxLQUFqQyxFQUF3Q1QsT0FBT3hNLE1BQVAsR0FBZ0I4TCxJQUF4RDtBQUNMLElBTkQsTUFPSzlQLFFBQVF5UCxRQUFSLENBQWlCMkIsSUFBakIsR0FBd0JaLE9BQU94TSxNQUFQLEdBQWdCOEwsSUFBeEM7QUFDTCxHQXRCRDtBQXVCQVUsU0FBT2EsWUFBUCxHQUFzQixVQUFTQyxNQUFULEVBQWlCN1MsT0FBakIsRUFBMEJDLE1BQTFCLEVBQWtDO0FBQ3ZELFlBQVM2UyxZQUFULEdBQXdCO0FBQ3ZCLFFBQUl6QixPQUFPVSxPQUFPQyxPQUFQLEVBQVg7QUFDQSxRQUFJZSxTQUFTLEVBQWI7QUFDQSxRQUFJQyxXQUFXNUIsVUFBVUMsSUFBVixFQUFnQjBCLE1BQWhCLEVBQXdCQSxNQUF4QixDQUFmO0FBQ0EsUUFBSWpZLFFBQVF5RyxRQUFRb1AsT0FBUixDQUFnQjdWLEtBQTVCO0FBQ0EsUUFBSUEsU0FBUyxJQUFiLEVBQW1CO0FBQ2xCLFVBQUssSUFBSW1ZLENBQVQsSUFBY25ZLEtBQWQ7QUFBcUJpWSxhQUFPRSxDQUFQLElBQVluWSxNQUFNbVksQ0FBTixDQUFaO0FBQXJCO0FBQ0E7QUFDRCxTQUFLLElBQUlDLE1BQVQsSUFBbUJMLE1BQW5CLEVBQTJCO0FBQzFCLFNBQUlNLFVBQVUsSUFBSTlSLE1BQUosQ0FBVyxNQUFNNlIsT0FBTzFXLE9BQVAsQ0FBZSxnQkFBZixFQUFpQyxPQUFqQyxFQUEwQ0EsT0FBMUMsQ0FBa0QsVUFBbEQsRUFBOEQsV0FBOUQsQ0FBTixHQUFtRixNQUE5RixDQUFkO0FBQ0EsU0FBSTJXLFFBQVFsUCxJQUFSLENBQWErTyxRQUFiLENBQUosRUFBNEI7QUFDM0JBLGVBQVN4VyxPQUFULENBQWlCMlcsT0FBakIsRUFBMEIsWUFBVztBQUNwQyxXQUFJQyxPQUFPRixPQUFPbFgsS0FBUCxDQUFhLFVBQWIsS0FBNEIsRUFBdkM7QUFDQSxXQUFJc0UsU0FBUyxHQUFHK0UsS0FBSCxDQUFTdEksSUFBVCxDQUFjRSxTQUFkLEVBQXlCLENBQXpCLEVBQTRCLENBQUMsQ0FBN0IsQ0FBYjtBQUNBLFlBQUssSUFBSXpCLElBQUksQ0FBYixFQUFnQkEsSUFBSTRYLEtBQUszWCxNQUF6QixFQUFpQ0QsR0FBakMsRUFBc0M7QUFDckN1WCxlQUFPSyxLQUFLNVgsQ0FBTCxFQUFRZ0IsT0FBUixDQUFnQixPQUFoQixFQUF5QixFQUF6QixDQUFQLElBQXVDc1QsbUJBQW1CeFAsT0FBTzlFLENBQVAsQ0FBbkIsQ0FBdkM7QUFDQTtBQUNEd0UsZUFBUTZTLE9BQU9LLE1BQVAsQ0FBUixFQUF3QkgsTUFBeEIsRUFBZ0MxQixJQUFoQyxFQUFzQzZCLE1BQXRDO0FBQ0EsT0FQRDtBQVFBO0FBQ0E7QUFDRDtBQUNEalQsV0FBT29SLElBQVAsRUFBYTBCLE1BQWI7QUFDQTtBQUNELE9BQUlyQyxpQkFBSixFQUF1Qm5QLFFBQVFrUixVQUFSLEdBQXFCdkIsY0FBYzRCLFlBQWQsQ0FBckIsQ0FBdkIsS0FDSyxJQUFJZixPQUFPeE0sTUFBUCxDQUFjZ0ssTUFBZCxDQUFxQixDQUFyQixNQUE0QixHQUFoQyxFQUFxQ2hPLFFBQVE4UixZQUFSLEdBQXVCUCxZQUF2QjtBQUMxQ0E7QUFDQSxHQTVCRDtBQTZCQSxTQUFPZixNQUFQO0FBQ0EsRUEvRkQ7QUFnR0EsS0FBSXVCLE1BQU0sU0FBTkEsR0FBTSxDQUFTL1IsT0FBVCxFQUFrQnlOLGNBQWxCLEVBQWtDO0FBQzNDLE1BQUl1RSxlQUFlOUMsV0FBV2xQLE9BQVgsQ0FBbkI7QUFDQSxNQUFJaVMsV0FBVyxTQUFYQSxRQUFXLENBQVMzSixDQUFULEVBQVk7QUFBQyxVQUFPQSxDQUFQO0FBQVMsR0FBckM7QUFDQSxNQUFJNEosT0FBSixFQUFhdkUsU0FBYixFQUF3QndFLE1BQXhCLEVBQWdDQyxXQUFoQyxFQUE2Q0MsV0FBN0M7QUFDQSxNQUFJQyxRQUFRLFNBQVJBLEtBQVEsQ0FBUzVFLElBQVQsRUFBZTZFLFlBQWYsRUFBNkJqQixNQUE3QixFQUFxQztBQUNoRCxPQUFJNUQsUUFBUSxJQUFaLEVBQWtCLE1BQU0sSUFBSTdSLEtBQUosQ0FBVSxzRUFBVixDQUFOO0FBQ2xCLE9BQUkyVyxPQUFPLFNBQVBBLElBQU8sR0FBVztBQUNyQixRQUFJTixXQUFXLElBQWYsRUFBcUJ6RSxlQUFldEIsTUFBZixDQUFzQnVCLElBQXRCLEVBQTRCd0UsUUFBUXJaLE1BQU04VSxTQUFOLEVBQWlCd0UsT0FBT3BaLEdBQXhCLEVBQTZCb1osTUFBN0IsQ0FBUixDQUE1QjtBQUNyQixJQUZEO0FBR0EsT0FBSU0sT0FBTyxTQUFQQSxJQUFPLENBQVMzQyxJQUFULEVBQWU7QUFDekIsUUFBSUEsU0FBU3lDLFlBQWIsRUFBMkJQLGFBQWFyQixPQUFiLENBQXFCNEIsWUFBckIsRUFBbUMsSUFBbkMsRUFBeUMsRUFBQ3RYLFNBQVMsSUFBVixFQUF6QyxFQUEzQixLQUNLLE1BQU0sSUFBSVksS0FBSixDQUFVLHFDQUFxQzBXLFlBQS9DLENBQU47QUFDTCxJQUhEO0FBSUFQLGdCQUFhWCxZQUFiLENBQTBCQyxNQUExQixFQUFrQyxVQUFTb0IsT0FBVCxFQUFrQmxCLE1BQWxCLEVBQTBCMUIsSUFBMUIsRUFBZ0M7QUFDakUsUUFBSTZDLFNBQVNOLGNBQWEsb0JBQVNPLGFBQVQsRUFBd0JDLElBQXhCLEVBQThCO0FBQ3ZELFNBQUlGLFdBQVdOLFdBQWYsRUFBMkI7QUFDM0IxRSxpQkFBWWtGLFFBQVEsSUFBUixLQUFpQixPQUFPQSxLQUFLalgsSUFBWixLQUFxQixVQUFyQixJQUFtQyxPQUFPaVgsSUFBUCxLQUFnQixVQUFwRSxJQUFpRkEsSUFBakYsR0FBd0YsS0FBcEc7QUFDQVYsY0FBU1gsTUFBVCxFQUFpQlksY0FBY3RDLElBQS9CLEVBQXFDdUMsY0FBYSxJQUFsRDtBQUNBSCxlQUFVLENBQUNVLGNBQWN6RyxNQUFkLElBQXdCOEYsUUFBekIsRUFBbUMxVSxJQUFuQyxDQUF3Q3FWLGFBQXhDLENBQVY7QUFDQUo7QUFDQSxLQU5EO0FBT0EsUUFBSUUsUUFBUTlXLElBQVIsSUFBZ0IsT0FBTzhXLE9BQVAsS0FBbUIsVUFBdkMsRUFBbURDLE9BQU8sRUFBUCxFQUFXRCxPQUFYLEVBQW5ELEtBQ0s7QUFDSixTQUFJQSxRQUFRSSxPQUFaLEVBQXFCO0FBQ3BCM1QsY0FBUVYsT0FBUixDQUFnQmlVLFFBQVFJLE9BQVIsQ0FBZ0J0QixNQUFoQixFQUF3QjFCLElBQXhCLENBQWhCLEVBQStDelMsSUFBL0MsQ0FBb0QsVUFBUzBWLFFBQVQsRUFBbUI7QUFDdEVKLGNBQU9ELE9BQVAsRUFBZ0JLLFFBQWhCO0FBQ0EsT0FGRCxFQUVHTixJQUZIO0FBR0EsTUFKRCxNQUtLRSxPQUFPRCxPQUFQLEVBQWdCLEtBQWhCO0FBQ0w7QUFDRCxJQWpCRCxFQWlCR0QsSUFqQkg7QUFrQkFoRixrQkFBZVAsU0FBZixDQUF5QlEsSUFBekIsRUFBK0I4RSxJQUEvQjtBQUNBLEdBNUJEO0FBNkJBRixRQUFNVSxHQUFOLEdBQVksVUFBU2xELElBQVQsRUFBZTVPLElBQWYsRUFBcUIwUCxPQUFyQixFQUE4QjtBQUN6QyxPQUFJeUIsZUFBYyxJQUFsQixFQUF3QnpCLFVBQVUsRUFBQzNWLFNBQVMsSUFBVixFQUFWO0FBQ3hCb1gsaUJBQWEsSUFBYjtBQUNBTCxnQkFBYXJCLE9BQWIsQ0FBcUJiLElBQXJCLEVBQTJCNU8sSUFBM0IsRUFBaUMwUCxPQUFqQztBQUNBLEdBSkQ7QUFLQTBCLFFBQU1XLEdBQU4sR0FBWSxZQUFXO0FBQUMsVUFBT2IsV0FBUDtBQUFtQixHQUEzQztBQUNBRSxRQUFNdE8sTUFBTixHQUFlLFVBQVNrUCxPQUFULEVBQWtCO0FBQUNsQixnQkFBYWhPLE1BQWIsR0FBc0JrUCxPQUF0QjtBQUE4QixHQUFoRTtBQUNBWixRQUFNYSxJQUFOLEdBQWEsVUFBU0MsTUFBVCxFQUFpQjtBQUM3QkEsVUFBT2phLEdBQVAsQ0FBV2dTLFlBQVgsQ0FBd0IsTUFBeEIsRUFBZ0M2RyxhQUFhaE8sTUFBYixHQUFzQm9QLE9BQU9oYSxLQUFQLENBQWFnWSxJQUFuRTtBQUNBZ0MsVUFBT2phLEdBQVAsQ0FBV2thLE9BQVgsR0FBcUIsVUFBUzFWLENBQVQsRUFBWTtBQUNoQyxRQUFJQSxFQUFFMlYsT0FBRixJQUFhM1YsRUFBRTRWLE9BQWYsSUFBMEI1VixFQUFFNlYsUUFBNUIsSUFBd0M3VixFQUFFOFYsS0FBRixLQUFZLENBQXhELEVBQTJEO0FBQzNEOVYsTUFBRStWLGNBQUY7QUFDQS9WLE1BQUVxUCxNQUFGLEdBQVcsS0FBWDtBQUNBLFFBQUlvRSxPQUFPLEtBQUt1QyxZQUFMLENBQWtCLE1BQWxCLENBQVg7QUFDQSxRQUFJdkMsS0FBS25OLE9BQUwsQ0FBYStOLGFBQWFoTyxNQUExQixNQUFzQyxDQUExQyxFQUE2Q29OLE9BQU9BLEtBQUt0TixLQUFMLENBQVdrTyxhQUFhaE8sTUFBYixDQUFvQjlKLE1BQS9CLENBQVA7QUFDN0NvWSxVQUFNVSxHQUFOLENBQVU1QixJQUFWLEVBQWdCOVgsU0FBaEIsRUFBMkJBLFNBQTNCO0FBQ0EsSUFQRDtBQVFBLEdBVkQ7QUFXQWdaLFFBQU1zQixLQUFOLEdBQWMsVUFBU0MsSUFBVCxFQUFlO0FBQzVCLE9BQUcsT0FBTzFCLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUMsT0FBTzBCLElBQVAsS0FBZ0IsV0FBcEQsRUFBaUUsT0FBTzFCLE9BQU8wQixJQUFQLENBQVA7QUFDakUsVUFBTzFCLE1BQVA7QUFDQSxHQUhEO0FBSUEsU0FBT0csS0FBUDtBQUNBLEVBeEREO0FBeURBbFcsR0FBRWtXLEtBQUYsR0FBVVAsSUFBSTdTLE1BQUosRUFBWXFPLGFBQVosQ0FBVjtBQUNBblIsR0FBRTBYLFFBQUYsR0FBYSxVQUFTQyxRQUFULEVBQW1CQyxTQUFuQixFQUE4QmpLLE9BQTlCLEVBQXVDO0FBQ25ELFNBQU8sVUFBU3BNLENBQVQsRUFBWTtBQUNsQnFXLGFBQVV4WSxJQUFWLENBQWV1TyxXQUFXLElBQTFCLEVBQWdDZ0ssWUFBWXBXLEVBQUVzVyxhQUFkLEdBQThCdFcsRUFBRXNXLGFBQUYsQ0FBZ0JGLFFBQWhCLENBQTlCLEdBQTBEcFcsRUFBRXNXLGFBQUYsQ0FBZ0JOLFlBQWhCLENBQTZCSSxRQUE3QixDQUExRjtBQUNBLEdBRkQ7QUFHQSxFQUpEO0FBS0EsS0FBSUcsTUFBTTdQLGFBQWFuRixNQUFiLENBQVY7QUFDQTlDLEdBQUUrUCxNQUFGLEdBQVcrSCxJQUFJL0gsTUFBZjtBQUNBL1AsR0FBRTRRLE1BQUYsR0FBV08sY0FBY1AsTUFBekI7QUFDQTVRLEdBQUV3RSxPQUFGLEdBQVl3RCxlQUFleEQsT0FBM0I7QUFDQXhFLEdBQUUyRyxLQUFGLEdBQVVxQixlQUFlckIsS0FBekI7QUFDQTNHLEdBQUUwUixnQkFBRixHQUFxQkEsZ0JBQXJCO0FBQ0ExUixHQUFFaUQsZ0JBQUYsR0FBcUJBLGdCQUFyQjtBQUNBakQsR0FBRStYLE9BQUYsR0FBWSxPQUFaO0FBQ0EvWCxHQUFFOEksS0FBRixHQUFVck0sS0FBVjtBQUNBLEtBQUksSUFBSixFQUFtQ3ViLE9BQU8sU0FBUCxJQUFvQmhZLENBQXBCLENBQW5DLEtBQ0s4QyxPQUFPOUMsQ0FBUCxHQUFXQSxDQUFYO0FBQ0osQ0Exc0NDLEdBQUQsQzs7Ozs7Ozs7Ozs7O0FDQUQsSUFBSWlZLENBQUo7O0FBRUE7QUFDQUEsSUFBSyxZQUFXO0FBQ2YsUUFBTyxJQUFQO0FBQ0EsQ0FGRyxFQUFKOztBQUlBLElBQUk7QUFDSDtBQUNBQSxLQUFJQSxLQUFLQyxTQUFTLGFBQVQsR0FBTCxJQUFrQyxDQUFDLEdBQUVDLElBQUgsRUFBUyxNQUFULENBQXRDO0FBQ0EsQ0FIRCxDQUdFLE9BQU01VyxDQUFOLEVBQVM7QUFDVjtBQUNBLEtBQUcsUUFBT3VCLE1BQVAseUNBQU9BLE1BQVAsT0FBa0IsUUFBckIsRUFDQ21WLElBQUluVixNQUFKO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBOztBQUVBa1YsT0FBT0ksT0FBUCxHQUFpQkgsQ0FBakIsQzs7Ozs7Ozs7Ozs7OztBQ3BCQTs7OztBQUNBOzs7O0FBRUE7Ozs7OztBQUdBLElBQU1JLEtBQUs7QUFDVDdZLFFBQU0scUJBQVM7QUFDYixXQUFPO0FBQUE7QUFBQSxRQUFJLFdBQVUsVUFBZDtBQUNKc0osWUFBTTlMLEtBQU4sQ0FBWXNiO0FBRFIsS0FBUDtBQUdEO0FBTFEsQ0FBWDs7QUFRQSxJQUFNQyxLQUFLO0FBQ1QvWSxRQUFNLHFCQUFTO0FBQ2IsV0FBTztBQUFBO0FBQUEsUUFBSSxXQUFVLGdCQUFkO0FBQ0pzSixZQUFNOUwsS0FBTixDQUFZc2I7QUFEUixLQUFQO0FBR0Q7QUFMUSxDQUFYOztBQVFBLElBQU1FLFVBQVU7QUFDZGhaLFFBQU0scUJBQVU7QUFDZCxXQUFPO0FBQUE7QUFBQTtBQUNMO0FBQUE7QUFBQTtBQUFVc0osY0FBTTlMLEtBQU4sQ0FBWXliO0FBQXRCLE9BREs7QUFFSjNQLFlBQU05TCxLQUFOLENBQVlzYjtBQUZSLEtBQVA7QUFJRDtBQU5hLENBQWhCOztBQVNBLElBQU1JLE9BQU87QUFDWGxaLFFBQU0scUJBQVM7QUFDYixRQUFNc0YsT0FBT2dFLE1BQU05TCxLQUFOLENBQVk4SCxJQUF6QjtBQUNBLFFBQU13VCxRQUFReFQsS0FBSzZULE1BQUwsQ0FBWTNNLEdBQVosQ0FBZ0IsYUFBSztBQUNqQyxhQUFPLHVCQUFDLEVBQUQsSUFBSSxPQUFPLHVCQUFDLEVBQUQsSUFBSSxPQUFPLHVCQUFDLEtBQUQsSUFBTyxNQUFNNE0sQ0FBYixHQUFYLEdBQVgsR0FBUDtBQUNELEtBRmEsQ0FBZDtBQUdBLFdBQU87QUFBQTtBQUFBLFFBQUssSUFBSTlULEtBQUsrVCxJQUFkO0FBQ0wsNkJBQUMsT0FBRCxJQUFTLFNBQVkvVCxLQUFLK1QsSUFBakIsV0FBVCxFQUFtQyxPQUFPUCxLQUExQztBQURLLEtBQVA7QUFHRDtBQVRVLENBQWI7O0FBWUEsSUFBTVEsUUFBUTtBQUNadFosUUFBTSxxQkFBUztBQUNiLFFBQU1zRixPQUFPZ0UsTUFBTTlMLEtBQU4sQ0FBWThILElBQXpCO0FBQ0EsUUFBTXdULFFBQVF4VCxLQUFLaVUsSUFBTCxDQUFVL00sR0FBVixDQUFjLGFBQUs7QUFDL0IsYUFBTyx1QkFBQyxFQUFELElBQUksT0FBTyx1QkFBQyxFQUFELElBQUksT0FBTyx1QkFBQyxHQUFELElBQUssTUFBTTRNLENBQVgsR0FBWCxHQUFYLEdBQVA7QUFDRCxLQUZhLENBQWQ7QUFHQSxXQUFPO0FBQUE7QUFBQSxRQUFLLElBQUk5VCxLQUFLa1UsS0FBZDtBQUNMLDZCQUFDLE9BQUQsSUFBUyxTQUFZbFUsS0FBS2tVLEtBQWpCLFdBQVQsRUFBb0MsT0FBT1YsS0FBM0M7QUFESyxLQUFQO0FBR0Q7QUFUVyxDQUFkOztBQVlBLElBQU1XLE1BQU07QUFDVnpaLFFBQU0scUJBQVM7QUFDYixRQUFNc0YsT0FBT2dFLE1BQU05TCxLQUFOLENBQVk4SCxJQUF6QjtBQUNBLFFBQU13VCxRQUFRO0FBQUE7QUFBQTtBQUNSeFQsV0FBS29VLEdBREc7QUFFWjtBQUFBO0FBQUEsVUFBRyxvQkFBa0JwVSxLQUFLK1QsSUFBdkIsU0FBK0IvVCxLQUFLa1UsS0FBcEMsU0FBNkNsVSxLQUFLb1UsR0FBbEQsU0FBeURwVSxLQUFLcVUsSUFBakU7QUFDR3JVLGFBQUsrUDtBQURSO0FBRlksS0FBZDtBQU1BLFdBQU8sdUJBQUMsRUFBRCxJQUFJLE9BQU95RCxLQUFYLEdBQVA7QUFDRDtBQVZTLENBQVo7O2tCQWFlO0FBQ2IzSSxVQUFRLHVCQUFTO0FBQ2Ysb0JBQU15SixLQUFOO0FBQ0F0USxVQUFNM0wsS0FBTixDQUFZa2MsWUFBWixHQUEyQixZQUFNO0FBQy9CLGFBQU8sZ0JBQU12VSxJQUFOLENBQVdrSCxHQUFYLENBQWUsYUFBSztBQUN6QixlQUFPLHVCQUFDLEVBQUQsSUFBSSxPQUFPLHVCQUFDLEVBQUQsSUFBSSxPQUFPLHVCQUFDLElBQUQsSUFBTSxNQUFNNE0sQ0FBWixHQUFYLEdBQVgsR0FBUDtBQUNELE9BRk0sQ0FBUDtBQUdELEtBSkQ7QUFLRCxHQVJZO0FBU2JwWixRQUFNLHFCQUFTO0FBQ2IsV0FBTztBQUFBO0FBQUEsUUFBSyxXQUFVLFVBQWY7QUFDTCxzQ0FBSyxXQUFVLG9CQUFmLEdBREs7QUFFTDtBQUFBO0FBQUEsVUFBSyxXQUFVLDJCQUFmO0FBQ0ksb0JBQU07QUFDTixjQUFJLENBQUMsZ0JBQU04WixPQUFYLEVBQW9CO0FBQ2xCLG1CQUFPLGdDQUFLLFdBQVUsc0NBQWYsR0FBUDtBQUNEO0FBQ0QsaUJBQU8sdUJBQUMsRUFBRCxJQUFJLE9BQU94USxNQUFNM0wsS0FBTixDQUFZa2MsWUFBWixFQUFYLEdBQVA7QUFDRCxTQUxBO0FBREgsT0FGSztBQVVMLHNDQUFLLFdBQVUsb0JBQWY7QUFWSyxLQUFQO0FBWUQ7QUF0QlksQzs7Ozs7Ozs7O0FDcEVmOzs7O0FBRUE7Ozs7OztBQUdBLGtCQUFFNUgsS0FBRixDQUFReEssU0FBU3NTLGNBQVQsQ0FBd0IsTUFBeEIsQ0FBUix1Qjs7Ozs7Ozs7Ozs7OztBQ0xBOzs7Ozs7QUFFQSxJQUFNQyxRQUFRO0FBQ1oxVSxRQUFNLEVBRE07QUFFWndVLFdBQVMsS0FGRztBQUdaRixTQUFPLGlCQUFNO0FBQ1gsV0FBTyxrQkFBRTVVLE9BQUYsQ0FBVTtBQUNmQyxjQUFRLEtBRE87QUFFZkYsV0FBSztBQUZVLEtBQVYsRUFHSnRELElBSEksQ0FHQyxvQkFBWTtBQUNsQnVZLFlBQU1GLE9BQU4sR0FBZ0IsSUFBaEI7QUFDQUUsWUFBTTFVLElBQU4sR0FBYXNCLFFBQWI7QUFDRCxLQU5NLENBQVA7QUFPRDtBQVhXLENBQWQ7O2tCQWNlb1QsSzs7Ozs7OztBQ2hCZjs7QUFFQXBCLFFBQVFxQixVQUFSLEdBQXFCQSxVQUFyQjtBQUNBckIsUUFBUXNCLFdBQVIsR0FBc0JBLFdBQXRCO0FBQ0F0QixRQUFRdUIsYUFBUixHQUF3QkEsYUFBeEI7O0FBRUEsSUFBSUMsU0FBUyxFQUFiO0FBQ0EsSUFBSUMsWUFBWSxFQUFoQjtBQUNBLElBQUlDLE1BQU0sT0FBT0MsVUFBUCxLQUFzQixXQUF0QixHQUFvQ0EsVUFBcEMsR0FBaURyYyxLQUEzRDs7QUFFQSxJQUFJc2MsT0FBTyxrRUFBWDtBQUNBLEtBQUssSUFBSW5jLElBQUksQ0FBUixFQUFXb2MsTUFBTUQsS0FBS2xjLE1BQTNCLEVBQW1DRCxJQUFJb2MsR0FBdkMsRUFBNEMsRUFBRXBjLENBQTlDLEVBQWlEO0FBQy9DK2IsU0FBTy9iLENBQVAsSUFBWW1jLEtBQUtuYyxDQUFMLENBQVo7QUFDQWdjLFlBQVVHLEtBQUtFLFVBQUwsQ0FBZ0JyYyxDQUFoQixDQUFWLElBQWdDQSxDQUFoQztBQUNEOztBQUVEZ2MsVUFBVSxJQUFJSyxVQUFKLENBQWUsQ0FBZixDQUFWLElBQStCLEVBQS9CO0FBQ0FMLFVBQVUsSUFBSUssVUFBSixDQUFlLENBQWYsQ0FBVixJQUErQixFQUEvQjs7QUFFQSxTQUFTQyxpQkFBVCxDQUE0QkMsR0FBNUIsRUFBaUM7QUFDL0IsTUFBSUgsTUFBTUcsSUFBSXRjLE1BQWQ7QUFDQSxNQUFJbWMsTUFBTSxDQUFOLEdBQVUsQ0FBZCxFQUFpQjtBQUNmLFVBQU0sSUFBSXhhLEtBQUosQ0FBVSxnREFBVixDQUFOO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQU8yYSxJQUFJSCxNQUFNLENBQVYsTUFBaUIsR0FBakIsR0FBdUIsQ0FBdkIsR0FBMkJHLElBQUlILE1BQU0sQ0FBVixNQUFpQixHQUFqQixHQUF1QixDQUF2QixHQUEyQixDQUE3RDtBQUNEOztBQUVELFNBQVNSLFVBQVQsQ0FBcUJXLEdBQXJCLEVBQTBCO0FBQ3hCO0FBQ0EsU0FBT0EsSUFBSXRjLE1BQUosR0FBYSxDQUFiLEdBQWlCLENBQWpCLEdBQXFCcWMsa0JBQWtCQyxHQUFsQixDQUE1QjtBQUNEOztBQUVELFNBQVNWLFdBQVQsQ0FBc0JVLEdBQXRCLEVBQTJCO0FBQ3pCLE1BQUl2YyxDQUFKLEVBQU8wVSxDQUFQLEVBQVU4SCxDQUFWLEVBQWFDLEdBQWIsRUFBa0JDLFlBQWxCLEVBQWdDQyxHQUFoQztBQUNBLE1BQUlQLE1BQU1HLElBQUl0YyxNQUFkO0FBQ0F5YyxpQkFBZUosa0JBQWtCQyxHQUFsQixDQUFmOztBQUVBSSxRQUFNLElBQUlWLEdBQUosQ0FBUUcsTUFBTSxDQUFOLEdBQVUsQ0FBVixHQUFjTSxZQUF0QixDQUFOOztBQUVBO0FBQ0FGLE1BQUlFLGVBQWUsQ0FBZixHQUFtQk4sTUFBTSxDQUF6QixHQUE2QkEsR0FBakM7O0FBRUEsTUFBSVEsSUFBSSxDQUFSOztBQUVBLE9BQUs1YyxJQUFJLENBQUosRUFBTzBVLElBQUksQ0FBaEIsRUFBbUIxVSxJQUFJd2MsQ0FBdkIsRUFBMEJ4YyxLQUFLLENBQUwsRUFBUTBVLEtBQUssQ0FBdkMsRUFBMEM7QUFDeEMrSCxVQUFPVCxVQUFVTyxJQUFJRixVQUFKLENBQWVyYyxDQUFmLENBQVYsS0FBZ0MsRUFBakMsR0FBd0NnYyxVQUFVTyxJQUFJRixVQUFKLENBQWVyYyxJQUFJLENBQW5CLENBQVYsS0FBb0MsRUFBNUUsR0FBbUZnYyxVQUFVTyxJQUFJRixVQUFKLENBQWVyYyxJQUFJLENBQW5CLENBQVYsS0FBb0MsQ0FBdkgsR0FBNEhnYyxVQUFVTyxJQUFJRixVQUFKLENBQWVyYyxJQUFJLENBQW5CLENBQVYsQ0FBbEk7QUFDQTJjLFFBQUlDLEdBQUosSUFBWUgsT0FBTyxFQUFSLEdBQWMsSUFBekI7QUFDQUUsUUFBSUMsR0FBSixJQUFZSCxPQUFPLENBQVIsR0FBYSxJQUF4QjtBQUNBRSxRQUFJQyxHQUFKLElBQVdILE1BQU0sSUFBakI7QUFDRDs7QUFFRCxNQUFJQyxpQkFBaUIsQ0FBckIsRUFBd0I7QUFDdEJELFVBQU9ULFVBQVVPLElBQUlGLFVBQUosQ0FBZXJjLENBQWYsQ0FBVixLQUFnQyxDQUFqQyxHQUF1Q2djLFVBQVVPLElBQUlGLFVBQUosQ0FBZXJjLElBQUksQ0FBbkIsQ0FBVixLQUFvQyxDQUFqRjtBQUNBMmMsUUFBSUMsR0FBSixJQUFXSCxNQUFNLElBQWpCO0FBQ0QsR0FIRCxNQUdPLElBQUlDLGlCQUFpQixDQUFyQixFQUF3QjtBQUM3QkQsVUFBT1QsVUFBVU8sSUFBSUYsVUFBSixDQUFlcmMsQ0FBZixDQUFWLEtBQWdDLEVBQWpDLEdBQXdDZ2MsVUFBVU8sSUFBSUYsVUFBSixDQUFlcmMsSUFBSSxDQUFuQixDQUFWLEtBQW9DLENBQTVFLEdBQWtGZ2MsVUFBVU8sSUFBSUYsVUFBSixDQUFlcmMsSUFBSSxDQUFuQixDQUFWLEtBQW9DLENBQTVIO0FBQ0EyYyxRQUFJQyxHQUFKLElBQVlILE9BQU8sQ0FBUixHQUFhLElBQXhCO0FBQ0FFLFFBQUlDLEdBQUosSUFBV0gsTUFBTSxJQUFqQjtBQUNEOztBQUVELFNBQU9FLEdBQVA7QUFDRDs7QUFFRCxTQUFTRSxlQUFULENBQTBCQyxHQUExQixFQUErQjtBQUM3QixTQUFPZixPQUFPZSxPQUFPLEVBQVAsR0FBWSxJQUFuQixJQUEyQmYsT0FBT2UsT0FBTyxFQUFQLEdBQVksSUFBbkIsQ0FBM0IsR0FBc0RmLE9BQU9lLE9BQU8sQ0FBUCxHQUFXLElBQWxCLENBQXRELEdBQWdGZixPQUFPZSxNQUFNLElBQWIsQ0FBdkY7QUFDRDs7QUFFRCxTQUFTQyxXQUFULENBQXNCQyxLQUF0QixFQUE2QnRiLEtBQTdCLEVBQW9DbUosR0FBcEMsRUFBeUM7QUFDdkMsTUFBSTRSLEdBQUo7QUFDQSxNQUFJUSxTQUFTLEVBQWI7QUFDQSxPQUFLLElBQUlqZCxJQUFJMEIsS0FBYixFQUFvQjFCLElBQUk2SyxHQUF4QixFQUE2QjdLLEtBQUssQ0FBbEMsRUFBcUM7QUFDbkN5YyxVQUFNLENBQUNPLE1BQU1oZCxDQUFOLEtBQVksRUFBYixLQUFvQmdkLE1BQU1oZCxJQUFJLENBQVYsS0FBZ0IsQ0FBcEMsSUFBMENnZCxNQUFNaGQsSUFBSSxDQUFWLENBQWhEO0FBQ0FpZCxXQUFPbmMsSUFBUCxDQUFZK2IsZ0JBQWdCSixHQUFoQixDQUFaO0FBQ0Q7QUFDRCxTQUFPUSxPQUFPL2IsSUFBUCxDQUFZLEVBQVosQ0FBUDtBQUNEOztBQUVELFNBQVM0YSxhQUFULENBQXdCa0IsS0FBeEIsRUFBK0I7QUFDN0IsTUFBSVAsR0FBSjtBQUNBLE1BQUlMLE1BQU1ZLE1BQU0vYyxNQUFoQjtBQUNBLE1BQUlpZCxhQUFhZCxNQUFNLENBQXZCLENBSDZCLENBR0o7QUFDekIsTUFBSWEsU0FBUyxFQUFiO0FBQ0EsTUFBSUUsUUFBUSxFQUFaO0FBQ0EsTUFBSUMsaUJBQWlCLEtBQXJCLENBTjZCLENBTUY7O0FBRTNCO0FBQ0EsT0FBSyxJQUFJcGQsSUFBSSxDQUFSLEVBQVdxZCxPQUFPakIsTUFBTWMsVUFBN0IsRUFBeUNsZCxJQUFJcWQsSUFBN0MsRUFBbURyZCxLQUFLb2QsY0FBeEQsRUFBd0U7QUFDdEVELFVBQU1yYyxJQUFOLENBQVdpYyxZQUFZQyxLQUFaLEVBQW1CaGQsQ0FBbkIsRUFBdUJBLElBQUlvZCxjQUFMLEdBQXVCQyxJQUF2QixHQUE4QkEsSUFBOUIsR0FBc0NyZCxJQUFJb2QsY0FBaEUsQ0FBWDtBQUNEOztBQUVEO0FBQ0EsTUFBSUYsZUFBZSxDQUFuQixFQUFzQjtBQUNwQlQsVUFBTU8sTUFBTVosTUFBTSxDQUFaLENBQU47QUFDQWEsY0FBVWxCLE9BQU9VLE9BQU8sQ0FBZCxDQUFWO0FBQ0FRLGNBQVVsQixPQUFRVSxPQUFPLENBQVIsR0FBYSxJQUFwQixDQUFWO0FBQ0FRLGNBQVUsSUFBVjtBQUNELEdBTEQsTUFLTyxJQUFJQyxlQUFlLENBQW5CLEVBQXNCO0FBQzNCVCxVQUFNLENBQUNPLE1BQU1aLE1BQU0sQ0FBWixLQUFrQixDQUFuQixJQUF5QlksTUFBTVosTUFBTSxDQUFaLENBQS9CO0FBQ0FhLGNBQVVsQixPQUFPVSxPQUFPLEVBQWQsQ0FBVjtBQUNBUSxjQUFVbEIsT0FBUVUsT0FBTyxDQUFSLEdBQWEsSUFBcEIsQ0FBVjtBQUNBUSxjQUFVbEIsT0FBUVUsT0FBTyxDQUFSLEdBQWEsSUFBcEIsQ0FBVjtBQUNBUSxjQUFVLEdBQVY7QUFDRDs7QUFFREUsUUFBTXJjLElBQU4sQ0FBV21jLE1BQVg7O0FBRUEsU0FBT0UsTUFBTWpjLElBQU4sQ0FBVyxFQUFYLENBQVA7QUFDRCxDOzs7Ozs7O0FDakhEOzs7Ozs7QUFNQTs7QUFFQTs7QUFFQSxJQUFJb2MsU0FBUyxtQkFBQUMsQ0FBUSxDQUFSLENBQWI7QUFDQSxJQUFJQyxVQUFVLG1CQUFBRCxDQUFRLENBQVIsQ0FBZDtBQUNBLElBQUl6ZCxVQUFVLG1CQUFBeWQsQ0FBUSxDQUFSLENBQWQ7O0FBRUFoRCxRQUFRa0QsTUFBUixHQUFpQkEsTUFBakI7QUFDQWxELFFBQVFtRCxVQUFSLEdBQXFCQSxVQUFyQjtBQUNBbkQsUUFBUW9ELGlCQUFSLEdBQTRCLEVBQTVCOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QkFGLE9BQU9HLG1CQUFQLEdBQTZCelksT0FBT3lZLG1CQUFQLEtBQStCdmUsU0FBL0IsR0FDekI4RixPQUFPeVksbUJBRGtCLEdBRXpCQyxtQkFGSjs7QUFJQTs7O0FBR0F0RCxRQUFRdUQsVUFBUixHQUFxQkEsWUFBckI7O0FBRUEsU0FBU0QsaUJBQVQsR0FBOEI7QUFDNUIsTUFBSTtBQUNGLFFBQUlsQixNQUFNLElBQUlULFVBQUosQ0FBZSxDQUFmLENBQVY7QUFDQVMsUUFBSW9CLFNBQUosR0FBZ0IsRUFBQ0EsV0FBVzdCLFdBQVduWSxTQUF2QixFQUFrQ2lhLEtBQUssZUFBWTtBQUFFLGVBQU8sRUFBUDtBQUFXLE9BQWhFLEVBQWhCO0FBQ0EsV0FBT3JCLElBQUlxQixHQUFKLE9BQWMsRUFBZCxJQUFvQjtBQUN2QixXQUFPckIsSUFBSXNCLFFBQVgsS0FBd0IsVUFEckIsSUFDbUM7QUFDdEN0QixRQUFJc0IsUUFBSixDQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUJyQyxVQUFuQixLQUFrQyxDQUZ0QyxDQUhFLENBS3NDO0FBQ3pDLEdBTkQsQ0FNRSxPQUFPbFksQ0FBUCxFQUFVO0FBQ1YsV0FBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTb2EsVUFBVCxHQUF1QjtBQUNyQixTQUFPTCxPQUFPRyxtQkFBUCxHQUNILFVBREcsR0FFSCxVQUZKO0FBR0Q7O0FBRUQsU0FBU00sWUFBVCxDQUF1QkMsSUFBdkIsRUFBNkJsZSxNQUE3QixFQUFxQztBQUNuQyxNQUFJNmQsZUFBZTdkLE1BQW5CLEVBQTJCO0FBQ3pCLFVBQU0sSUFBSW1lLFVBQUosQ0FBZSw0QkFBZixDQUFOO0FBQ0Q7QUFDRCxNQUFJWCxPQUFPRyxtQkFBWCxFQUFnQztBQUM5QjtBQUNBTyxXQUFPLElBQUlqQyxVQUFKLENBQWVqYyxNQUFmLENBQVA7QUFDQWtlLFNBQUtKLFNBQUwsR0FBaUJOLE9BQU8xWixTQUF4QjtBQUNELEdBSkQsTUFJTztBQUNMO0FBQ0EsUUFBSW9hLFNBQVMsSUFBYixFQUFtQjtBQUNqQkEsYUFBTyxJQUFJVixNQUFKLENBQVd4ZCxNQUFYLENBQVA7QUFDRDtBQUNEa2UsU0FBS2xlLE1BQUwsR0FBY0EsTUFBZDtBQUNEOztBQUVELFNBQU9rZSxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQSxTQUFTVixNQUFULENBQWlCWSxHQUFqQixFQUFzQkMsZ0JBQXRCLEVBQXdDcmUsTUFBeEMsRUFBZ0Q7QUFDOUMsTUFBSSxDQUFDd2QsT0FBT0csbUJBQVIsSUFBK0IsRUFBRSxnQkFBZ0JILE1BQWxCLENBQW5DLEVBQThEO0FBQzVELFdBQU8sSUFBSUEsTUFBSixDQUFXWSxHQUFYLEVBQWdCQyxnQkFBaEIsRUFBa0NyZSxNQUFsQyxDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJLE9BQU9vZSxHQUFQLEtBQWUsUUFBbkIsRUFBNkI7QUFDM0IsUUFBSSxPQUFPQyxnQkFBUCxLQUE0QixRQUFoQyxFQUEwQztBQUN4QyxZQUFNLElBQUkxYyxLQUFKLENBQ0osbUVBREksQ0FBTjtBQUdEO0FBQ0QsV0FBTzJjLFlBQVksSUFBWixFQUFrQkYsR0FBbEIsQ0FBUDtBQUNEO0FBQ0QsU0FBT0csS0FBSyxJQUFMLEVBQVdILEdBQVgsRUFBZ0JDLGdCQUFoQixFQUFrQ3JlLE1BQWxDLENBQVA7QUFDRDs7QUFFRHdkLE9BQU9nQixRQUFQLEdBQWtCLElBQWxCLEMsQ0FBdUI7O0FBRXZCO0FBQ0FoQixPQUFPaUIsUUFBUCxHQUFrQixVQUFVL0IsR0FBVixFQUFlO0FBQy9CQSxNQUFJb0IsU0FBSixHQUFnQk4sT0FBTzFaLFNBQXZCO0FBQ0EsU0FBTzRZLEdBQVA7QUFDRCxDQUhEOztBQUtBLFNBQVM2QixJQUFULENBQWVMLElBQWYsRUFBcUJ2ZCxLQUFyQixFQUE0QjBkLGdCQUE1QixFQUE4Q3JlLE1BQTlDLEVBQXNEO0FBQ3BELE1BQUksT0FBT1csS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUM3QixVQUFNLElBQUkwQixTQUFKLENBQWMsdUNBQWQsQ0FBTjtBQUNEOztBQUVELE1BQUksT0FBT3FjLFdBQVAsS0FBdUIsV0FBdkIsSUFBc0MvZCxpQkFBaUIrZCxXQUEzRCxFQUF3RTtBQUN0RSxXQUFPQyxnQkFBZ0JULElBQWhCLEVBQXNCdmQsS0FBdEIsRUFBNkIwZCxnQkFBN0IsRUFBK0NyZSxNQUEvQyxDQUFQO0FBQ0Q7O0FBRUQsTUFBSSxPQUFPVyxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzdCLFdBQU9pZSxXQUFXVixJQUFYLEVBQWlCdmQsS0FBakIsRUFBd0IwZCxnQkFBeEIsQ0FBUDtBQUNEOztBQUVELFNBQU9RLFdBQVdYLElBQVgsRUFBaUJ2ZCxLQUFqQixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O0FBUUE2YyxPQUFPZSxJQUFQLEdBQWMsVUFBVTVkLEtBQVYsRUFBaUIwZCxnQkFBakIsRUFBbUNyZSxNQUFuQyxFQUEyQztBQUN2RCxTQUFPdWUsS0FBSyxJQUFMLEVBQVc1ZCxLQUFYLEVBQWtCMGQsZ0JBQWxCLEVBQW9DcmUsTUFBcEMsQ0FBUDtBQUNELENBRkQ7O0FBSUEsSUFBSXdkLE9BQU9HLG1CQUFYLEVBQWdDO0FBQzlCSCxTQUFPMVosU0FBUCxDQUFpQmdhLFNBQWpCLEdBQTZCN0IsV0FBV25ZLFNBQXhDO0FBQ0EwWixTQUFPTSxTQUFQLEdBQW1CN0IsVUFBbkI7QUFDQSxNQUFJLE9BQU82QyxNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxPQUFPQyxPQUF4QyxJQUNBdkIsT0FBT3NCLE9BQU9DLE9BQWQsTUFBMkJ2QixNQUQvQixFQUN1QztBQUNyQztBQUNBblksV0FBTzJaLGNBQVAsQ0FBc0J4QixNQUF0QixFQUE4QnNCLE9BQU9DLE9BQXJDLEVBQThDO0FBQzVDcGUsYUFBTyxJQURxQztBQUU1Q3NlLG9CQUFjO0FBRjhCLEtBQTlDO0FBSUQ7QUFDRjs7QUFFRCxTQUFTQyxVQUFULENBQXFCQyxJQUFyQixFQUEyQjtBQUN6QixNQUFJLE9BQU9BLElBQVAsS0FBZ0IsUUFBcEIsRUFBOEI7QUFDNUIsVUFBTSxJQUFJOWMsU0FBSixDQUFjLGtDQUFkLENBQU47QUFDRCxHQUZELE1BRU8sSUFBSThjLE9BQU8sQ0FBWCxFQUFjO0FBQ25CLFVBQU0sSUFBSWhCLFVBQUosQ0FBZSxzQ0FBZixDQUFOO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTaUIsS0FBVCxDQUFnQmxCLElBQWhCLEVBQXNCaUIsSUFBdEIsRUFBNEJFLElBQTVCLEVBQWtDQyxRQUFsQyxFQUE0QztBQUMxQ0osYUFBV0MsSUFBWDtBQUNBLE1BQUlBLFFBQVEsQ0FBWixFQUFlO0FBQ2IsV0FBT2xCLGFBQWFDLElBQWIsRUFBbUJpQixJQUFuQixDQUFQO0FBQ0Q7QUFDRCxNQUFJRSxTQUFTamdCLFNBQWIsRUFBd0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0EsV0FBTyxPQUFPa2dCLFFBQVAsS0FBb0IsUUFBcEIsR0FDSHJCLGFBQWFDLElBQWIsRUFBbUJpQixJQUFuQixFQUF5QkUsSUFBekIsQ0FBOEJBLElBQTlCLEVBQW9DQyxRQUFwQyxDQURHLEdBRUhyQixhQUFhQyxJQUFiLEVBQW1CaUIsSUFBbkIsRUFBeUJFLElBQXpCLENBQThCQSxJQUE5QixDQUZKO0FBR0Q7QUFDRCxTQUFPcEIsYUFBYUMsSUFBYixFQUFtQmlCLElBQW5CLENBQVA7QUFDRDs7QUFFRDs7OztBQUlBM0IsT0FBTzRCLEtBQVAsR0FBZSxVQUFVRCxJQUFWLEVBQWdCRSxJQUFoQixFQUFzQkMsUUFBdEIsRUFBZ0M7QUFDN0MsU0FBT0YsTUFBTSxJQUFOLEVBQVlELElBQVosRUFBa0JFLElBQWxCLEVBQXdCQyxRQUF4QixDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxTQUFTaEIsV0FBVCxDQUFzQkosSUFBdEIsRUFBNEJpQixJQUE1QixFQUFrQztBQUNoQ0QsYUFBV0MsSUFBWDtBQUNBakIsU0FBT0QsYUFBYUMsSUFBYixFQUFtQmlCLE9BQU8sQ0FBUCxHQUFXLENBQVgsR0FBZUksUUFBUUosSUFBUixJQUFnQixDQUFsRCxDQUFQO0FBQ0EsTUFBSSxDQUFDM0IsT0FBT0csbUJBQVosRUFBaUM7QUFDL0IsU0FBSyxJQUFJNWQsSUFBSSxDQUFiLEVBQWdCQSxJQUFJb2YsSUFBcEIsRUFBMEIsRUFBRXBmLENBQTVCLEVBQStCO0FBQzdCbWUsV0FBS25lLENBQUwsSUFBVSxDQUFWO0FBQ0Q7QUFDRjtBQUNELFNBQU9tZSxJQUFQO0FBQ0Q7O0FBRUQ7OztBQUdBVixPQUFPYyxXQUFQLEdBQXFCLFVBQVVhLElBQVYsRUFBZ0I7QUFDbkMsU0FBT2IsWUFBWSxJQUFaLEVBQWtCYSxJQUFsQixDQUFQO0FBQ0QsQ0FGRDtBQUdBOzs7QUFHQTNCLE9BQU9nQyxlQUFQLEdBQXlCLFVBQVVMLElBQVYsRUFBZ0I7QUFDdkMsU0FBT2IsWUFBWSxJQUFaLEVBQWtCYSxJQUFsQixDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxTQUFTUCxVQUFULENBQXFCVixJQUFyQixFQUEyQnJLLE1BQTNCLEVBQW1DeUwsUUFBbkMsRUFBNkM7QUFDM0MsTUFBSSxPQUFPQSxRQUFQLEtBQW9CLFFBQXBCLElBQWdDQSxhQUFhLEVBQWpELEVBQXFEO0FBQ25EQSxlQUFXLE1BQVg7QUFDRDs7QUFFRCxNQUFJLENBQUM5QixPQUFPaUMsVUFBUCxDQUFrQkgsUUFBbEIsQ0FBTCxFQUFrQztBQUNoQyxVQUFNLElBQUlqZCxTQUFKLENBQWMsNENBQWQsQ0FBTjtBQUNEOztBQUVELE1BQUlyQyxTQUFTMmIsV0FBVzlILE1BQVgsRUFBbUJ5TCxRQUFuQixJQUErQixDQUE1QztBQUNBcEIsU0FBT0QsYUFBYUMsSUFBYixFQUFtQmxlLE1BQW5CLENBQVA7O0FBRUEsTUFBSTBmLFNBQVN4QixLQUFLeUIsS0FBTCxDQUFXOUwsTUFBWCxFQUFtQnlMLFFBQW5CLENBQWI7O0FBRUEsTUFBSUksV0FBVzFmLE1BQWYsRUFBdUI7QUFDckI7QUFDQTtBQUNBO0FBQ0FrZSxXQUFPQSxLQUFLdFUsS0FBTCxDQUFXLENBQVgsRUFBYzhWLE1BQWQsQ0FBUDtBQUNEOztBQUVELFNBQU94QixJQUFQO0FBQ0Q7O0FBRUQsU0FBUzBCLGFBQVQsQ0FBd0IxQixJQUF4QixFQUE4QjJCLEtBQTlCLEVBQXFDO0FBQ25DLE1BQUk3ZixTQUFTNmYsTUFBTTdmLE1BQU4sR0FBZSxDQUFmLEdBQW1CLENBQW5CLEdBQXVCdWYsUUFBUU0sTUFBTTdmLE1BQWQsSUFBd0IsQ0FBNUQ7QUFDQWtlLFNBQU9ELGFBQWFDLElBQWIsRUFBbUJsZSxNQUFuQixDQUFQO0FBQ0EsT0FBSyxJQUFJRCxJQUFJLENBQWIsRUFBZ0JBLElBQUlDLE1BQXBCLEVBQTRCRCxLQUFLLENBQWpDLEVBQW9DO0FBQ2xDbWUsU0FBS25lLENBQUwsSUFBVThmLE1BQU05ZixDQUFOLElBQVcsR0FBckI7QUFDRDtBQUNELFNBQU9tZSxJQUFQO0FBQ0Q7O0FBRUQsU0FBU1MsZUFBVCxDQUEwQlQsSUFBMUIsRUFBZ0MyQixLQUFoQyxFQUF1Q0MsVUFBdkMsRUFBbUQ5ZixNQUFuRCxFQUEyRDtBQUN6RDZmLFFBQU1sRSxVQUFOLENBRHlELENBQ3hDOztBQUVqQixNQUFJbUUsYUFBYSxDQUFiLElBQWtCRCxNQUFNbEUsVUFBTixHQUFtQm1FLFVBQXpDLEVBQXFEO0FBQ25ELFVBQU0sSUFBSTNCLFVBQUosQ0FBZSw2QkFBZixDQUFOO0FBQ0Q7O0FBRUQsTUFBSTBCLE1BQU1sRSxVQUFOLEdBQW1CbUUsY0FBYzlmLFVBQVUsQ0FBeEIsQ0FBdkIsRUFBbUQ7QUFDakQsVUFBTSxJQUFJbWUsVUFBSixDQUFlLDZCQUFmLENBQU47QUFDRDs7QUFFRCxNQUFJMkIsZUFBZTFnQixTQUFmLElBQTRCWSxXQUFXWixTQUEzQyxFQUFzRDtBQUNwRHlnQixZQUFRLElBQUk1RCxVQUFKLENBQWU0RCxLQUFmLENBQVI7QUFDRCxHQUZELE1BRU8sSUFBSTdmLFdBQVdaLFNBQWYsRUFBMEI7QUFDL0J5Z0IsWUFBUSxJQUFJNUQsVUFBSixDQUFlNEQsS0FBZixFQUFzQkMsVUFBdEIsQ0FBUjtBQUNELEdBRk0sTUFFQTtBQUNMRCxZQUFRLElBQUk1RCxVQUFKLENBQWU0RCxLQUFmLEVBQXNCQyxVQUF0QixFQUFrQzlmLE1BQWxDLENBQVI7QUFDRDs7QUFFRCxNQUFJd2QsT0FBT0csbUJBQVgsRUFBZ0M7QUFDOUI7QUFDQU8sV0FBTzJCLEtBQVA7QUFDQTNCLFNBQUtKLFNBQUwsR0FBaUJOLE9BQU8xWixTQUF4QjtBQUNELEdBSkQsTUFJTztBQUNMO0FBQ0FvYSxXQUFPMEIsY0FBYzFCLElBQWQsRUFBb0IyQixLQUFwQixDQUFQO0FBQ0Q7QUFDRCxTQUFPM0IsSUFBUDtBQUNEOztBQUVELFNBQVNXLFVBQVQsQ0FBcUJYLElBQXJCLEVBQTJCNkIsR0FBM0IsRUFBZ0M7QUFDOUIsTUFBSXZDLE9BQU93QyxRQUFQLENBQWdCRCxHQUFoQixDQUFKLEVBQTBCO0FBQ3hCLFFBQUk1RCxNQUFNb0QsUUFBUVEsSUFBSS9mLE1BQVosSUFBc0IsQ0FBaEM7QUFDQWtlLFdBQU9ELGFBQWFDLElBQWIsRUFBbUIvQixHQUFuQixDQUFQOztBQUVBLFFBQUkrQixLQUFLbGUsTUFBTCxLQUFnQixDQUFwQixFQUF1QjtBQUNyQixhQUFPa2UsSUFBUDtBQUNEOztBQUVENkIsUUFBSUUsSUFBSixDQUFTL0IsSUFBVCxFQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIvQixHQUFyQjtBQUNBLFdBQU8rQixJQUFQO0FBQ0Q7O0FBRUQsTUFBSTZCLEdBQUosRUFBUztBQUNQLFFBQUssT0FBT3JCLFdBQVAsS0FBdUIsV0FBdkIsSUFDRHFCLElBQUlHLE1BQUosWUFBc0J4QixXQUR0QixJQUNzQyxZQUFZcUIsR0FEdEQsRUFDMkQ7QUFDekQsVUFBSSxPQUFPQSxJQUFJL2YsTUFBWCxLQUFzQixRQUF0QixJQUFrQ21nQixNQUFNSixJQUFJL2YsTUFBVixDQUF0QyxFQUF5RDtBQUN2RCxlQUFPaWUsYUFBYUMsSUFBYixFQUFtQixDQUFuQixDQUFQO0FBQ0Q7QUFDRCxhQUFPMEIsY0FBYzFCLElBQWQsRUFBb0I2QixHQUFwQixDQUFQO0FBQ0Q7O0FBRUQsUUFBSUEsSUFBSXJmLElBQUosS0FBYSxRQUFiLElBQXlCYixRQUFRa2dCLElBQUkvWSxJQUFaLENBQTdCLEVBQWdEO0FBQzlDLGFBQU80WSxjQUFjMUIsSUFBZCxFQUFvQjZCLElBQUkvWSxJQUF4QixDQUFQO0FBQ0Q7QUFDRjs7QUFFRCxRQUFNLElBQUkzRSxTQUFKLENBQWMsb0ZBQWQsQ0FBTjtBQUNEOztBQUVELFNBQVNrZCxPQUFULENBQWtCdmYsTUFBbEIsRUFBMEI7QUFDeEI7QUFDQTtBQUNBLE1BQUlBLFVBQVU2ZCxZQUFkLEVBQTRCO0FBQzFCLFVBQU0sSUFBSU0sVUFBSixDQUFlLG9EQUNBLFVBREEsR0FDYU4sYUFBYXZZLFFBQWIsQ0FBc0IsRUFBdEIsQ0FEYixHQUN5QyxRQUR4RCxDQUFOO0FBRUQ7QUFDRCxTQUFPdEYsU0FBUyxDQUFoQjtBQUNEOztBQUVELFNBQVN5ZCxVQUFULENBQXFCemQsTUFBckIsRUFBNkI7QUFDM0IsTUFBSSxDQUFDQSxNQUFELElBQVdBLE1BQWYsRUFBdUI7QUFBRTtBQUN2QkEsYUFBUyxDQUFUO0FBQ0Q7QUFDRCxTQUFPd2QsT0FBTzRCLEtBQVAsQ0FBYSxDQUFDcGYsTUFBZCxDQUFQO0FBQ0Q7O0FBRUR3ZCxPQUFPd0MsUUFBUCxHQUFrQixTQUFTQSxRQUFULENBQW1CSSxDQUFuQixFQUFzQjtBQUN0QyxTQUFPLENBQUMsRUFBRUEsS0FBSyxJQUFMLElBQWFBLEVBQUVDLFNBQWpCLENBQVI7QUFDRCxDQUZEOztBQUlBN0MsT0FBTzhDLE9BQVAsR0FBaUIsU0FBU0EsT0FBVCxDQUFrQkMsQ0FBbEIsRUFBcUJILENBQXJCLEVBQXdCO0FBQ3ZDLE1BQUksQ0FBQzVDLE9BQU93QyxRQUFQLENBQWdCTyxDQUFoQixDQUFELElBQXVCLENBQUMvQyxPQUFPd0MsUUFBUCxDQUFnQkksQ0FBaEIsQ0FBNUIsRUFBZ0Q7QUFDOUMsVUFBTSxJQUFJL2QsU0FBSixDQUFjLDJCQUFkLENBQU47QUFDRDs7QUFFRCxNQUFJa2UsTUFBTUgsQ0FBVixFQUFhLE9BQU8sQ0FBUDs7QUFFYixNQUFJSSxJQUFJRCxFQUFFdmdCLE1BQVY7QUFDQSxNQUFJeWdCLElBQUlMLEVBQUVwZ0IsTUFBVjs7QUFFQSxPQUFLLElBQUlELElBQUksQ0FBUixFQUFXb2MsTUFBTXBULEtBQUsyWCxHQUFMLENBQVNGLENBQVQsRUFBWUMsQ0FBWixDQUF0QixFQUFzQzFnQixJQUFJb2MsR0FBMUMsRUFBK0MsRUFBRXBjLENBQWpELEVBQW9EO0FBQ2xELFFBQUl3Z0IsRUFBRXhnQixDQUFGLE1BQVNxZ0IsRUFBRXJnQixDQUFGLENBQWIsRUFBbUI7QUFDakJ5Z0IsVUFBSUQsRUFBRXhnQixDQUFGLENBQUo7QUFDQTBnQixVQUFJTCxFQUFFcmdCLENBQUYsQ0FBSjtBQUNBO0FBQ0Q7QUFDRjs7QUFFRCxNQUFJeWdCLElBQUlDLENBQVIsRUFBVyxPQUFPLENBQUMsQ0FBUjtBQUNYLE1BQUlBLElBQUlELENBQVIsRUFBVyxPQUFPLENBQVA7QUFDWCxTQUFPLENBQVA7QUFDRCxDQXJCRDs7QUF1QkFoRCxPQUFPaUMsVUFBUCxHQUFvQixTQUFTQSxVQUFULENBQXFCSCxRQUFyQixFQUErQjtBQUNqRCxVQUFRcUIsT0FBT3JCLFFBQVAsRUFBaUJzQixXQUFqQixFQUFSO0FBQ0UsU0FBSyxLQUFMO0FBQ0EsU0FBSyxNQUFMO0FBQ0EsU0FBSyxPQUFMO0FBQ0EsU0FBSyxPQUFMO0FBQ0EsU0FBSyxRQUFMO0FBQ0EsU0FBSyxRQUFMO0FBQ0EsU0FBSyxRQUFMO0FBQ0EsU0FBSyxNQUFMO0FBQ0EsU0FBSyxPQUFMO0FBQ0EsU0FBSyxTQUFMO0FBQ0EsU0FBSyxVQUFMO0FBQ0UsYUFBTyxJQUFQO0FBQ0Y7QUFDRSxhQUFPLEtBQVA7QUFkSjtBQWdCRCxDQWpCRDs7QUFtQkFwRCxPQUFPelAsTUFBUCxHQUFnQixTQUFTQSxNQUFULENBQWlCL0ssSUFBakIsRUFBdUJoRCxNQUF2QixFQUErQjtBQUM3QyxNQUFJLENBQUNILFFBQVFtRCxJQUFSLENBQUwsRUFBb0I7QUFDbEIsVUFBTSxJQUFJWCxTQUFKLENBQWMsNkNBQWQsQ0FBTjtBQUNEOztBQUVELE1BQUlXLEtBQUtoRCxNQUFMLEtBQWdCLENBQXBCLEVBQXVCO0FBQ3JCLFdBQU93ZCxPQUFPNEIsS0FBUCxDQUFhLENBQWIsQ0FBUDtBQUNEOztBQUVELE1BQUlyZixDQUFKO0FBQ0EsTUFBSUMsV0FBV1osU0FBZixFQUEwQjtBQUN4QlksYUFBUyxDQUFUO0FBQ0EsU0FBS0QsSUFBSSxDQUFULEVBQVlBLElBQUlpRCxLQUFLaEQsTUFBckIsRUFBNkIsRUFBRUQsQ0FBL0IsRUFBa0M7QUFDaENDLGdCQUFVZ0QsS0FBS2pELENBQUwsRUFBUUMsTUFBbEI7QUFDRDtBQUNGOztBQUVELE1BQUlrZ0IsU0FBUzFDLE9BQU9jLFdBQVAsQ0FBbUJ0ZSxNQUFuQixDQUFiO0FBQ0EsTUFBSTZnQixNQUFNLENBQVY7QUFDQSxPQUFLOWdCLElBQUksQ0FBVCxFQUFZQSxJQUFJaUQsS0FBS2hELE1BQXJCLEVBQTZCLEVBQUVELENBQS9CLEVBQWtDO0FBQ2hDLFFBQUkrZ0IsTUFBTTlkLEtBQUtqRCxDQUFMLENBQVY7QUFDQSxRQUFJLENBQUN5ZCxPQUFPd0MsUUFBUCxDQUFnQmMsR0FBaEIsQ0FBTCxFQUEyQjtBQUN6QixZQUFNLElBQUl6ZSxTQUFKLENBQWMsNkNBQWQsQ0FBTjtBQUNEO0FBQ0R5ZSxRQUFJYixJQUFKLENBQVNDLE1BQVQsRUFBaUJXLEdBQWpCO0FBQ0FBLFdBQU9DLElBQUk5Z0IsTUFBWDtBQUNEO0FBQ0QsU0FBT2tnQixNQUFQO0FBQ0QsQ0E1QkQ7O0FBOEJBLFNBQVN2RSxVQUFULENBQXFCOUgsTUFBckIsRUFBNkJ5TCxRQUE3QixFQUF1QztBQUNyQyxNQUFJOUIsT0FBT3dDLFFBQVAsQ0FBZ0JuTSxNQUFoQixDQUFKLEVBQTZCO0FBQzNCLFdBQU9BLE9BQU83VCxNQUFkO0FBQ0Q7QUFDRCxNQUFJLE9BQU8wZSxXQUFQLEtBQXVCLFdBQXZCLElBQXNDLE9BQU9BLFlBQVlxQyxNQUFuQixLQUE4QixVQUFwRSxLQUNDckMsWUFBWXFDLE1BQVosQ0FBbUJsTixNQUFuQixLQUE4QkEsa0JBQWtCNkssV0FEakQsQ0FBSixFQUNtRTtBQUNqRSxXQUFPN0ssT0FBTzhILFVBQWQ7QUFDRDtBQUNELE1BQUksT0FBTzlILE1BQVAsS0FBa0IsUUFBdEIsRUFBZ0M7QUFDOUJBLGFBQVMsS0FBS0EsTUFBZDtBQUNEOztBQUVELE1BQUlzSSxNQUFNdEksT0FBTzdULE1BQWpCO0FBQ0EsTUFBSW1jLFFBQVEsQ0FBWixFQUFlLE9BQU8sQ0FBUDs7QUFFZjtBQUNBLE1BQUk2RSxjQUFjLEtBQWxCO0FBQ0EsV0FBUztBQUNQLFlBQVExQixRQUFSO0FBQ0UsV0FBSyxPQUFMO0FBQ0EsV0FBSyxRQUFMO0FBQ0EsV0FBSyxRQUFMO0FBQ0UsZUFBT25ELEdBQVA7QUFDRixXQUFLLE1BQUw7QUFDQSxXQUFLLE9BQUw7QUFDQSxXQUFLL2MsU0FBTDtBQUNFLGVBQU82aEIsWUFBWXBOLE1BQVosRUFBb0I3VCxNQUEzQjtBQUNGLFdBQUssTUFBTDtBQUNBLFdBQUssT0FBTDtBQUNBLFdBQUssU0FBTDtBQUNBLFdBQUssVUFBTDtBQUNFLGVBQU9tYyxNQUFNLENBQWI7QUFDRixXQUFLLEtBQUw7QUFDRSxlQUFPQSxRQUFRLENBQWY7QUFDRixXQUFLLFFBQUw7QUFDRSxlQUFPK0UsY0FBY3JOLE1BQWQsRUFBc0I3VCxNQUE3QjtBQUNGO0FBQ0UsWUFBSWdoQixXQUFKLEVBQWlCLE9BQU9DLFlBQVlwTixNQUFaLEVBQW9CN1QsTUFBM0IsQ0FEbkIsQ0FDcUQ7QUFDbkRzZixtQkFBVyxDQUFDLEtBQUtBLFFBQU4sRUFBZ0JzQixXQUFoQixFQUFYO0FBQ0FJLHNCQUFjLElBQWQ7QUFyQko7QUF1QkQ7QUFDRjtBQUNEeEQsT0FBTzdCLFVBQVAsR0FBb0JBLFVBQXBCOztBQUVBLFNBQVN3RixZQUFULENBQXVCN0IsUUFBdkIsRUFBaUM3ZCxLQUFqQyxFQUF3Q21KLEdBQXhDLEVBQTZDO0FBQzNDLE1BQUlvVyxjQUFjLEtBQWxCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFJdmYsVUFBVXJDLFNBQVYsSUFBdUJxQyxRQUFRLENBQW5DLEVBQXNDO0FBQ3BDQSxZQUFRLENBQVI7QUFDRDtBQUNEO0FBQ0E7QUFDQSxNQUFJQSxRQUFRLEtBQUt6QixNQUFqQixFQUF5QjtBQUN2QixXQUFPLEVBQVA7QUFDRDs7QUFFRCxNQUFJNEssUUFBUXhMLFNBQVIsSUFBcUJ3TCxNQUFNLEtBQUs1SyxNQUFwQyxFQUE0QztBQUMxQzRLLFVBQU0sS0FBSzVLLE1BQVg7QUFDRDs7QUFFRCxNQUFJNEssT0FBTyxDQUFYLEVBQWM7QUFDWixXQUFPLEVBQVA7QUFDRDs7QUFFRDtBQUNBQSxXQUFTLENBQVQ7QUFDQW5KLGFBQVcsQ0FBWDs7QUFFQSxNQUFJbUosT0FBT25KLEtBQVgsRUFBa0I7QUFDaEIsV0FBTyxFQUFQO0FBQ0Q7O0FBRUQsTUFBSSxDQUFDNmQsUUFBTCxFQUFlQSxXQUFXLE1BQVg7O0FBRWYsU0FBTyxJQUFQLEVBQWE7QUFDWCxZQUFRQSxRQUFSO0FBQ0UsV0FBSyxLQUFMO0FBQ0UsZUFBTzhCLFNBQVMsSUFBVCxFQUFlM2YsS0FBZixFQUFzQm1KLEdBQXRCLENBQVA7O0FBRUYsV0FBSyxNQUFMO0FBQ0EsV0FBSyxPQUFMO0FBQ0UsZUFBT3lXLFVBQVUsSUFBVixFQUFnQjVmLEtBQWhCLEVBQXVCbUosR0FBdkIsQ0FBUDs7QUFFRixXQUFLLE9BQUw7QUFDRSxlQUFPMFcsV0FBVyxJQUFYLEVBQWlCN2YsS0FBakIsRUFBd0JtSixHQUF4QixDQUFQOztBQUVGLFdBQUssUUFBTDtBQUNBLFdBQUssUUFBTDtBQUNFLGVBQU8yVyxZQUFZLElBQVosRUFBa0I5ZixLQUFsQixFQUF5Qm1KLEdBQXpCLENBQVA7O0FBRUYsV0FBSyxRQUFMO0FBQ0UsZUFBTzRXLFlBQVksSUFBWixFQUFrQi9mLEtBQWxCLEVBQXlCbUosR0FBekIsQ0FBUDs7QUFFRixXQUFLLE1BQUw7QUFDQSxXQUFLLE9BQUw7QUFDQSxXQUFLLFNBQUw7QUFDQSxXQUFLLFVBQUw7QUFDRSxlQUFPNlcsYUFBYSxJQUFiLEVBQW1CaGdCLEtBQW5CLEVBQTBCbUosR0FBMUIsQ0FBUDs7QUFFRjtBQUNFLFlBQUlvVyxXQUFKLEVBQWlCLE1BQU0sSUFBSTNlLFNBQUosQ0FBYyx1QkFBdUJpZCxRQUFyQyxDQUFOO0FBQ2pCQSxtQkFBVyxDQUFDQSxXQUFXLEVBQVosRUFBZ0JzQixXQUFoQixFQUFYO0FBQ0FJLHNCQUFjLElBQWQ7QUEzQko7QUE2QkQ7QUFDRjs7QUFFRDtBQUNBO0FBQ0F4RCxPQUFPMVosU0FBUCxDQUFpQnVjLFNBQWpCLEdBQTZCLElBQTdCOztBQUVBLFNBQVNxQixJQUFULENBQWV0QixDQUFmLEVBQWtCdUIsQ0FBbEIsRUFBcUJ6ZixDQUFyQixFQUF3QjtBQUN0QixNQUFJbkMsSUFBSXFnQixFQUFFdUIsQ0FBRixDQUFSO0FBQ0F2QixJQUFFdUIsQ0FBRixJQUFPdkIsRUFBRWxlLENBQUYsQ0FBUDtBQUNBa2UsSUFBRWxlLENBQUYsSUFBT25DLENBQVA7QUFDRDs7QUFFRHlkLE9BQU8xWixTQUFQLENBQWlCOGQsTUFBakIsR0FBMEIsU0FBU0EsTUFBVCxHQUFtQjtBQUMzQyxNQUFJekYsTUFBTSxLQUFLbmMsTUFBZjtBQUNBLE1BQUltYyxNQUFNLENBQU4sS0FBWSxDQUFoQixFQUFtQjtBQUNqQixVQUFNLElBQUlnQyxVQUFKLENBQWUsMkNBQWYsQ0FBTjtBQUNEO0FBQ0QsT0FBSyxJQUFJcGUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJb2MsR0FBcEIsRUFBeUJwYyxLQUFLLENBQTlCLEVBQWlDO0FBQy9CMmhCLFNBQUssSUFBTCxFQUFXM2hCLENBQVgsRUFBY0EsSUFBSSxDQUFsQjtBQUNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0QsQ0FURDs7QUFXQXlkLE9BQU8xWixTQUFQLENBQWlCK2QsTUFBakIsR0FBMEIsU0FBU0EsTUFBVCxHQUFtQjtBQUMzQyxNQUFJMUYsTUFBTSxLQUFLbmMsTUFBZjtBQUNBLE1BQUltYyxNQUFNLENBQU4sS0FBWSxDQUFoQixFQUFtQjtBQUNqQixVQUFNLElBQUlnQyxVQUFKLENBQWUsMkNBQWYsQ0FBTjtBQUNEO0FBQ0QsT0FBSyxJQUFJcGUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJb2MsR0FBcEIsRUFBeUJwYyxLQUFLLENBQTlCLEVBQWlDO0FBQy9CMmhCLFNBQUssSUFBTCxFQUFXM2hCLENBQVgsRUFBY0EsSUFBSSxDQUFsQjtBQUNBMmhCLFNBQUssSUFBTCxFQUFXM2hCLElBQUksQ0FBZixFQUFrQkEsSUFBSSxDQUF0QjtBQUNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0QsQ0FWRDs7QUFZQXlkLE9BQU8xWixTQUFQLENBQWlCZ2UsTUFBakIsR0FBMEIsU0FBU0EsTUFBVCxHQUFtQjtBQUMzQyxNQUFJM0YsTUFBTSxLQUFLbmMsTUFBZjtBQUNBLE1BQUltYyxNQUFNLENBQU4sS0FBWSxDQUFoQixFQUFtQjtBQUNqQixVQUFNLElBQUlnQyxVQUFKLENBQWUsMkNBQWYsQ0FBTjtBQUNEO0FBQ0QsT0FBSyxJQUFJcGUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJb2MsR0FBcEIsRUFBeUJwYyxLQUFLLENBQTlCLEVBQWlDO0FBQy9CMmhCLFNBQUssSUFBTCxFQUFXM2hCLENBQVgsRUFBY0EsSUFBSSxDQUFsQjtBQUNBMmhCLFNBQUssSUFBTCxFQUFXM2hCLElBQUksQ0FBZixFQUFrQkEsSUFBSSxDQUF0QjtBQUNBMmhCLFNBQUssSUFBTCxFQUFXM2hCLElBQUksQ0FBZixFQUFrQkEsSUFBSSxDQUF0QjtBQUNBMmhCLFNBQUssSUFBTCxFQUFXM2hCLElBQUksQ0FBZixFQUFrQkEsSUFBSSxDQUF0QjtBQUNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0QsQ0FaRDs7QUFjQXlkLE9BQU8xWixTQUFQLENBQWlCd0IsUUFBakIsR0FBNEIsU0FBU0EsUUFBVCxHQUFxQjtBQUMvQyxNQUFJdEYsU0FBUyxLQUFLQSxNQUFMLEdBQWMsQ0FBM0I7QUFDQSxNQUFJQSxXQUFXLENBQWYsRUFBa0IsT0FBTyxFQUFQO0FBQ2xCLE1BQUl3QixVQUFVeEIsTUFBVixLQUFxQixDQUF6QixFQUE0QixPQUFPcWhCLFVBQVUsSUFBVixFQUFnQixDQUFoQixFQUFtQnJoQixNQUFuQixDQUFQO0FBQzVCLFNBQU9taEIsYUFBYTVhLEtBQWIsQ0FBbUIsSUFBbkIsRUFBeUIvRSxTQUF6QixDQUFQO0FBQ0QsQ0FMRDs7QUFPQWdjLE9BQU8xWixTQUFQLENBQWlCaWUsTUFBakIsR0FBMEIsU0FBU0EsTUFBVCxDQUFpQjNCLENBQWpCLEVBQW9CO0FBQzVDLE1BQUksQ0FBQzVDLE9BQU93QyxRQUFQLENBQWdCSSxDQUFoQixDQUFMLEVBQXlCLE1BQU0sSUFBSS9kLFNBQUosQ0FBYywyQkFBZCxDQUFOO0FBQ3pCLE1BQUksU0FBUytkLENBQWIsRUFBZ0IsT0FBTyxJQUFQO0FBQ2hCLFNBQU81QyxPQUFPOEMsT0FBUCxDQUFlLElBQWYsRUFBcUJGLENBQXJCLE1BQTRCLENBQW5DO0FBQ0QsQ0FKRDs7QUFNQTVDLE9BQU8xWixTQUFQLENBQWlCa2UsT0FBakIsR0FBMkIsU0FBU0EsT0FBVCxHQUFvQjtBQUM3QyxNQUFJQyxNQUFNLEVBQVY7QUFDQSxNQUFJQyxNQUFNNUgsUUFBUW9ELGlCQUFsQjtBQUNBLE1BQUksS0FBSzFkLE1BQUwsR0FBYyxDQUFsQixFQUFxQjtBQUNuQmlpQixVQUFNLEtBQUszYyxRQUFMLENBQWMsS0FBZCxFQUFxQixDQUFyQixFQUF3QjRjLEdBQXhCLEVBQTZCM2hCLEtBQTdCLENBQW1DLE9BQW5DLEVBQTRDVSxJQUE1QyxDQUFpRCxHQUFqRCxDQUFOO0FBQ0EsUUFBSSxLQUFLakIsTUFBTCxHQUFja2lCLEdBQWxCLEVBQXVCRCxPQUFPLE9BQVA7QUFDeEI7QUFDRCxTQUFPLGFBQWFBLEdBQWIsR0FBbUIsR0FBMUI7QUFDRCxDQVJEOztBQVVBekUsT0FBTzFaLFNBQVAsQ0FBaUJ3YyxPQUFqQixHQUEyQixTQUFTQSxPQUFULENBQWtCNkIsTUFBbEIsRUFBMEIxZ0IsS0FBMUIsRUFBaUNtSixHQUFqQyxFQUFzQ3dYLFNBQXRDLEVBQWlEQyxPQUFqRCxFQUEwRDtBQUNuRixNQUFJLENBQUM3RSxPQUFPd0MsUUFBUCxDQUFnQm1DLE1BQWhCLENBQUwsRUFBOEI7QUFDNUIsVUFBTSxJQUFJOWYsU0FBSixDQUFjLDJCQUFkLENBQU47QUFDRDs7QUFFRCxNQUFJWixVQUFVckMsU0FBZCxFQUF5QjtBQUN2QnFDLFlBQVEsQ0FBUjtBQUNEO0FBQ0QsTUFBSW1KLFFBQVF4TCxTQUFaLEVBQXVCO0FBQ3JCd0wsVUFBTXVYLFNBQVNBLE9BQU9uaUIsTUFBaEIsR0FBeUIsQ0FBL0I7QUFDRDtBQUNELE1BQUlvaUIsY0FBY2hqQixTQUFsQixFQUE2QjtBQUMzQmdqQixnQkFBWSxDQUFaO0FBQ0Q7QUFDRCxNQUFJQyxZQUFZampCLFNBQWhCLEVBQTJCO0FBQ3pCaWpCLGNBQVUsS0FBS3JpQixNQUFmO0FBQ0Q7O0FBRUQsTUFBSXlCLFFBQVEsQ0FBUixJQUFhbUosTUFBTXVYLE9BQU9uaUIsTUFBMUIsSUFBb0NvaUIsWUFBWSxDQUFoRCxJQUFxREMsVUFBVSxLQUFLcmlCLE1BQXhFLEVBQWdGO0FBQzlFLFVBQU0sSUFBSW1lLFVBQUosQ0FBZSxvQkFBZixDQUFOO0FBQ0Q7O0FBRUQsTUFBSWlFLGFBQWFDLE9BQWIsSUFBd0I1Z0IsU0FBU21KLEdBQXJDLEVBQTBDO0FBQ3hDLFdBQU8sQ0FBUDtBQUNEO0FBQ0QsTUFBSXdYLGFBQWFDLE9BQWpCLEVBQTBCO0FBQ3hCLFdBQU8sQ0FBQyxDQUFSO0FBQ0Q7QUFDRCxNQUFJNWdCLFNBQVNtSixHQUFiLEVBQWtCO0FBQ2hCLFdBQU8sQ0FBUDtBQUNEOztBQUVEbkosYUFBVyxDQUFYO0FBQ0FtSixXQUFTLENBQVQ7QUFDQXdYLGlCQUFlLENBQWY7QUFDQUMsZUFBYSxDQUFiOztBQUVBLE1BQUksU0FBU0YsTUFBYixFQUFxQixPQUFPLENBQVA7O0FBRXJCLE1BQUkzQixJQUFJNkIsVUFBVUQsU0FBbEI7QUFDQSxNQUFJM0IsSUFBSTdWLE1BQU1uSixLQUFkO0FBQ0EsTUFBSTBhLE1BQU1wVCxLQUFLMlgsR0FBTCxDQUFTRixDQUFULEVBQVlDLENBQVosQ0FBVjs7QUFFQSxNQUFJNkIsV0FBVyxLQUFLMVksS0FBTCxDQUFXd1ksU0FBWCxFQUFzQkMsT0FBdEIsQ0FBZjtBQUNBLE1BQUlFLGFBQWFKLE9BQU92WSxLQUFQLENBQWFuSSxLQUFiLEVBQW9CbUosR0FBcEIsQ0FBakI7O0FBRUEsT0FBSyxJQUFJN0ssSUFBSSxDQUFiLEVBQWdCQSxJQUFJb2MsR0FBcEIsRUFBeUIsRUFBRXBjLENBQTNCLEVBQThCO0FBQzVCLFFBQUl1aUIsU0FBU3ZpQixDQUFULE1BQWdCd2lCLFdBQVd4aUIsQ0FBWCxDQUFwQixFQUFtQztBQUNqQ3lnQixVQUFJOEIsU0FBU3ZpQixDQUFULENBQUo7QUFDQTBnQixVQUFJOEIsV0FBV3hpQixDQUFYLENBQUo7QUFDQTtBQUNEO0FBQ0Y7O0FBRUQsTUFBSXlnQixJQUFJQyxDQUFSLEVBQVcsT0FBTyxDQUFDLENBQVI7QUFDWCxNQUFJQSxJQUFJRCxDQUFSLEVBQVcsT0FBTyxDQUFQO0FBQ1gsU0FBTyxDQUFQO0FBQ0QsQ0F6REQ7O0FBMkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNnQyxvQkFBVCxDQUErQnRDLE1BQS9CLEVBQXVDdUMsR0FBdkMsRUFBNEMzQyxVQUE1QyxFQUF3RFIsUUFBeEQsRUFBa0VvRCxHQUFsRSxFQUF1RTtBQUNyRTtBQUNBLE1BQUl4QyxPQUFPbGdCLE1BQVAsS0FBa0IsQ0FBdEIsRUFBeUIsT0FBTyxDQUFDLENBQVI7O0FBRXpCO0FBQ0EsTUFBSSxPQUFPOGYsVUFBUCxLQUFzQixRQUExQixFQUFvQztBQUNsQ1IsZUFBV1EsVUFBWDtBQUNBQSxpQkFBYSxDQUFiO0FBQ0QsR0FIRCxNQUdPLElBQUlBLGFBQWEsVUFBakIsRUFBNkI7QUFDbENBLGlCQUFhLFVBQWI7QUFDRCxHQUZNLE1BRUEsSUFBSUEsYUFBYSxDQUFDLFVBQWxCLEVBQThCO0FBQ25DQSxpQkFBYSxDQUFDLFVBQWQ7QUFDRDtBQUNEQSxlQUFhLENBQUNBLFVBQWQsQ0FicUUsQ0FhM0M7QUFDMUIsTUFBSWpMLE1BQU1pTCxVQUFOLENBQUosRUFBdUI7QUFDckI7QUFDQUEsaUJBQWE0QyxNQUFNLENBQU4sR0FBV3hDLE9BQU9sZ0IsTUFBUCxHQUFnQixDQUF4QztBQUNEOztBQUVEO0FBQ0EsTUFBSThmLGFBQWEsQ0FBakIsRUFBb0JBLGFBQWFJLE9BQU9sZ0IsTUFBUCxHQUFnQjhmLFVBQTdCO0FBQ3BCLE1BQUlBLGNBQWNJLE9BQU9sZ0IsTUFBekIsRUFBaUM7QUFDL0IsUUFBSTBpQixHQUFKLEVBQVMsT0FBTyxDQUFDLENBQVIsQ0FBVCxLQUNLNUMsYUFBYUksT0FBT2xnQixNQUFQLEdBQWdCLENBQTdCO0FBQ04sR0FIRCxNQUdPLElBQUk4ZixhQUFhLENBQWpCLEVBQW9CO0FBQ3pCLFFBQUk0QyxHQUFKLEVBQVM1QyxhQUFhLENBQWIsQ0FBVCxLQUNLLE9BQU8sQ0FBQyxDQUFSO0FBQ047O0FBRUQ7QUFDQSxNQUFJLE9BQU8yQyxHQUFQLEtBQWUsUUFBbkIsRUFBNkI7QUFDM0JBLFVBQU1qRixPQUFPZSxJQUFQLENBQVlrRSxHQUFaLEVBQWlCbkQsUUFBakIsQ0FBTjtBQUNEOztBQUVEO0FBQ0EsTUFBSTlCLE9BQU93QyxRQUFQLENBQWdCeUMsR0FBaEIsQ0FBSixFQUEwQjtBQUN4QjtBQUNBLFFBQUlBLElBQUl6aUIsTUFBSixLQUFlLENBQW5CLEVBQXNCO0FBQ3BCLGFBQU8sQ0FBQyxDQUFSO0FBQ0Q7QUFDRCxXQUFPMmlCLGFBQWF6QyxNQUFiLEVBQXFCdUMsR0FBckIsRUFBMEIzQyxVQUExQixFQUFzQ1IsUUFBdEMsRUFBZ0RvRCxHQUFoRCxDQUFQO0FBQ0QsR0FORCxNQU1PLElBQUksT0FBT0QsR0FBUCxLQUFlLFFBQW5CLEVBQTZCO0FBQ2xDQSxVQUFNQSxNQUFNLElBQVosQ0FEa0MsQ0FDakI7QUFDakIsUUFBSWpGLE9BQU9HLG1CQUFQLElBQ0EsT0FBTzFCLFdBQVduWSxTQUFYLENBQXFCaUcsT0FBNUIsS0FBd0MsVUFENUMsRUFDd0Q7QUFDdEQsVUFBSTJZLEdBQUosRUFBUztBQUNQLGVBQU96RyxXQUFXblksU0FBWCxDQUFxQmlHLE9BQXJCLENBQTZCekksSUFBN0IsQ0FBa0M0ZSxNQUFsQyxFQUEwQ3VDLEdBQTFDLEVBQStDM0MsVUFBL0MsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU83RCxXQUFXblksU0FBWCxDQUFxQjhlLFdBQXJCLENBQWlDdGhCLElBQWpDLENBQXNDNGUsTUFBdEMsRUFBOEN1QyxHQUE5QyxFQUFtRDNDLFVBQW5ELENBQVA7QUFDRDtBQUNGO0FBQ0QsV0FBTzZDLGFBQWF6QyxNQUFiLEVBQXFCLENBQUV1QyxHQUFGLENBQXJCLEVBQThCM0MsVUFBOUIsRUFBMENSLFFBQTFDLEVBQW9Eb0QsR0FBcEQsQ0FBUDtBQUNEOztBQUVELFFBQU0sSUFBSXJnQixTQUFKLENBQWMsc0NBQWQsQ0FBTjtBQUNEOztBQUVELFNBQVNzZ0IsWUFBVCxDQUF1QmpHLEdBQXZCLEVBQTRCK0YsR0FBNUIsRUFBaUMzQyxVQUFqQyxFQUE2Q1IsUUFBN0MsRUFBdURvRCxHQUF2RCxFQUE0RDtBQUMxRCxNQUFJRyxZQUFZLENBQWhCO0FBQ0EsTUFBSUMsWUFBWXBHLElBQUkxYyxNQUFwQjtBQUNBLE1BQUkraUIsWUFBWU4sSUFBSXppQixNQUFwQjs7QUFFQSxNQUFJc2YsYUFBYWxnQixTQUFqQixFQUE0QjtBQUMxQmtnQixlQUFXcUIsT0FBT3JCLFFBQVAsRUFBaUJzQixXQUFqQixFQUFYO0FBQ0EsUUFBSXRCLGFBQWEsTUFBYixJQUF1QkEsYUFBYSxPQUFwQyxJQUNBQSxhQUFhLFNBRGIsSUFDMEJBLGFBQWEsVUFEM0MsRUFDdUQ7QUFDckQsVUFBSTVDLElBQUkxYyxNQUFKLEdBQWEsQ0FBYixJQUFrQnlpQixJQUFJemlCLE1BQUosR0FBYSxDQUFuQyxFQUFzQztBQUNwQyxlQUFPLENBQUMsQ0FBUjtBQUNEO0FBQ0Q2aUIsa0JBQVksQ0FBWjtBQUNBQyxtQkFBYSxDQUFiO0FBQ0FDLG1CQUFhLENBQWI7QUFDQWpELG9CQUFjLENBQWQ7QUFDRDtBQUNGOztBQUVELFdBQVNrRCxJQUFULENBQWVsQyxHQUFmLEVBQW9CL2dCLENBQXBCLEVBQXVCO0FBQ3JCLFFBQUk4aUIsY0FBYyxDQUFsQixFQUFxQjtBQUNuQixhQUFPL0IsSUFBSS9nQixDQUFKLENBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPK2dCLElBQUltQyxZQUFKLENBQWlCbGpCLElBQUk4aUIsU0FBckIsQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQsTUFBSTlpQixDQUFKO0FBQ0EsTUFBSTJpQixHQUFKLEVBQVM7QUFDUCxRQUFJUSxhQUFhLENBQUMsQ0FBbEI7QUFDQSxTQUFLbmpCLElBQUkrZixVQUFULEVBQXFCL2YsSUFBSStpQixTQUF6QixFQUFvQy9pQixHQUFwQyxFQUF5QztBQUN2QyxVQUFJaWpCLEtBQUt0RyxHQUFMLEVBQVUzYyxDQUFWLE1BQWlCaWpCLEtBQUtQLEdBQUwsRUFBVVMsZUFBZSxDQUFDLENBQWhCLEdBQW9CLENBQXBCLEdBQXdCbmpCLElBQUltakIsVUFBdEMsQ0FBckIsRUFBd0U7QUFDdEUsWUFBSUEsZUFBZSxDQUFDLENBQXBCLEVBQXVCQSxhQUFhbmpCLENBQWI7QUFDdkIsWUFBSUEsSUFBSW1qQixVQUFKLEdBQWlCLENBQWpCLEtBQXVCSCxTQUEzQixFQUFzQyxPQUFPRyxhQUFhTCxTQUFwQjtBQUN2QyxPQUhELE1BR087QUFDTCxZQUFJSyxlQUFlLENBQUMsQ0FBcEIsRUFBdUJuakIsS0FBS0EsSUFBSW1qQixVQUFUO0FBQ3ZCQSxxQkFBYSxDQUFDLENBQWQ7QUFDRDtBQUNGO0FBQ0YsR0FYRCxNQVdPO0FBQ0wsUUFBSXBELGFBQWFpRCxTQUFiLEdBQXlCRCxTQUE3QixFQUF3Q2hELGFBQWFnRCxZQUFZQyxTQUF6QjtBQUN4QyxTQUFLaGpCLElBQUkrZixVQUFULEVBQXFCL2YsS0FBSyxDQUExQixFQUE2QkEsR0FBN0IsRUFBa0M7QUFDaEMsVUFBSW9qQixRQUFRLElBQVo7QUFDQSxXQUFLLElBQUkxTyxJQUFJLENBQWIsRUFBZ0JBLElBQUlzTyxTQUFwQixFQUErQnRPLEdBQS9CLEVBQW9DO0FBQ2xDLFlBQUl1TyxLQUFLdEcsR0FBTCxFQUFVM2MsSUFBSTBVLENBQWQsTUFBcUJ1TyxLQUFLUCxHQUFMLEVBQVVoTyxDQUFWLENBQXpCLEVBQXVDO0FBQ3JDME8sa0JBQVEsS0FBUjtBQUNBO0FBQ0Q7QUFDRjtBQUNELFVBQUlBLEtBQUosRUFBVyxPQUFPcGpCLENBQVA7QUFDWjtBQUNGOztBQUVELFNBQU8sQ0FBQyxDQUFSO0FBQ0Q7O0FBRUR5ZCxPQUFPMVosU0FBUCxDQUFpQnNmLFFBQWpCLEdBQTRCLFNBQVNBLFFBQVQsQ0FBbUJYLEdBQW5CLEVBQXdCM0MsVUFBeEIsRUFBb0NSLFFBQXBDLEVBQThDO0FBQ3hFLFNBQU8sS0FBS3ZWLE9BQUwsQ0FBYTBZLEdBQWIsRUFBa0IzQyxVQUFsQixFQUE4QlIsUUFBOUIsTUFBNEMsQ0FBQyxDQUFwRDtBQUNELENBRkQ7O0FBSUE5QixPQUFPMVosU0FBUCxDQUFpQmlHLE9BQWpCLEdBQTJCLFNBQVNBLE9BQVQsQ0FBa0IwWSxHQUFsQixFQUF1QjNDLFVBQXZCLEVBQW1DUixRQUFuQyxFQUE2QztBQUN0RSxTQUFPa0QscUJBQXFCLElBQXJCLEVBQTJCQyxHQUEzQixFQUFnQzNDLFVBQWhDLEVBQTRDUixRQUE1QyxFQUFzRCxJQUF0RCxDQUFQO0FBQ0QsQ0FGRDs7QUFJQTlCLE9BQU8xWixTQUFQLENBQWlCOGUsV0FBakIsR0FBK0IsU0FBU0EsV0FBVCxDQUFzQkgsR0FBdEIsRUFBMkIzQyxVQUEzQixFQUF1Q1IsUUFBdkMsRUFBaUQ7QUFDOUUsU0FBT2tELHFCQUFxQixJQUFyQixFQUEyQkMsR0FBM0IsRUFBZ0MzQyxVQUFoQyxFQUE0Q1IsUUFBNUMsRUFBc0QsS0FBdEQsQ0FBUDtBQUNELENBRkQ7O0FBSUEsU0FBUytELFFBQVQsQ0FBbUJ2QyxHQUFuQixFQUF3QmpOLE1BQXhCLEVBQWdDeVAsTUFBaEMsRUFBd0N0akIsTUFBeEMsRUFBZ0Q7QUFDOUNzakIsV0FBU0MsT0FBT0QsTUFBUCxLQUFrQixDQUEzQjtBQUNBLE1BQUlFLFlBQVkxQyxJQUFJOWdCLE1BQUosR0FBYXNqQixNQUE3QjtBQUNBLE1BQUksQ0FBQ3RqQixNQUFMLEVBQWE7QUFDWEEsYUFBU3dqQixTQUFUO0FBQ0QsR0FGRCxNQUVPO0FBQ0x4akIsYUFBU3VqQixPQUFPdmpCLE1BQVAsQ0FBVDtBQUNBLFFBQUlBLFNBQVN3akIsU0FBYixFQUF3QjtBQUN0QnhqQixlQUFTd2pCLFNBQVQ7QUFDRDtBQUNGOztBQUVEO0FBQ0EsTUFBSUMsU0FBUzVQLE9BQU83VCxNQUFwQjtBQUNBLE1BQUl5akIsU0FBUyxDQUFULEtBQWUsQ0FBbkIsRUFBc0IsTUFBTSxJQUFJcGhCLFNBQUosQ0FBYyxvQkFBZCxDQUFOOztBQUV0QixNQUFJckMsU0FBU3lqQixTQUFTLENBQXRCLEVBQXlCO0FBQ3ZCempCLGFBQVN5akIsU0FBUyxDQUFsQjtBQUNEO0FBQ0QsT0FBSyxJQUFJMWpCLElBQUksQ0FBYixFQUFnQkEsSUFBSUMsTUFBcEIsRUFBNEIsRUFBRUQsQ0FBOUIsRUFBaUM7QUFDL0IsUUFBSTJqQixTQUFTNU8sU0FBU2pCLE9BQU9uRCxNQUFQLENBQWMzUSxJQUFJLENBQWxCLEVBQXFCLENBQXJCLENBQVQsRUFBa0MsRUFBbEMsQ0FBYjtBQUNBLFFBQUk4VSxNQUFNNk8sTUFBTixDQUFKLEVBQW1CLE9BQU8zakIsQ0FBUDtBQUNuQitnQixRQUFJd0MsU0FBU3ZqQixDQUFiLElBQWtCMmpCLE1BQWxCO0FBQ0Q7QUFDRCxTQUFPM2pCLENBQVA7QUFDRDs7QUFFRCxTQUFTNGpCLFNBQVQsQ0FBb0I3QyxHQUFwQixFQUF5QmpOLE1BQXpCLEVBQWlDeVAsTUFBakMsRUFBeUN0akIsTUFBekMsRUFBaUQ7QUFDL0MsU0FBTzRqQixXQUFXM0MsWUFBWXBOLE1BQVosRUFBb0JpTixJQUFJOWdCLE1BQUosR0FBYXNqQixNQUFqQyxDQUFYLEVBQXFEeEMsR0FBckQsRUFBMER3QyxNQUExRCxFQUFrRXRqQixNQUFsRSxDQUFQO0FBQ0Q7O0FBRUQsU0FBUzZqQixVQUFULENBQXFCL0MsR0FBckIsRUFBMEJqTixNQUExQixFQUFrQ3lQLE1BQWxDLEVBQTBDdGpCLE1BQTFDLEVBQWtEO0FBQ2hELFNBQU80akIsV0FBV0UsYUFBYWpRLE1BQWIsQ0FBWCxFQUFpQ2lOLEdBQWpDLEVBQXNDd0MsTUFBdEMsRUFBOEN0akIsTUFBOUMsQ0FBUDtBQUNEOztBQUVELFNBQVMrakIsV0FBVCxDQUFzQmpELEdBQXRCLEVBQTJCak4sTUFBM0IsRUFBbUN5UCxNQUFuQyxFQUEyQ3RqQixNQUEzQyxFQUFtRDtBQUNqRCxTQUFPNmpCLFdBQVcvQyxHQUFYLEVBQWdCak4sTUFBaEIsRUFBd0J5UCxNQUF4QixFQUFnQ3RqQixNQUFoQyxDQUFQO0FBQ0Q7O0FBRUQsU0FBU2drQixXQUFULENBQXNCbEQsR0FBdEIsRUFBMkJqTixNQUEzQixFQUFtQ3lQLE1BQW5DLEVBQTJDdGpCLE1BQTNDLEVBQW1EO0FBQ2pELFNBQU80akIsV0FBVzFDLGNBQWNyTixNQUFkLENBQVgsRUFBa0NpTixHQUFsQyxFQUF1Q3dDLE1BQXZDLEVBQStDdGpCLE1BQS9DLENBQVA7QUFDRDs7QUFFRCxTQUFTaWtCLFNBQVQsQ0FBb0JuRCxHQUFwQixFQUF5QmpOLE1BQXpCLEVBQWlDeVAsTUFBakMsRUFBeUN0akIsTUFBekMsRUFBaUQ7QUFDL0MsU0FBTzRqQixXQUFXTSxlQUFlclEsTUFBZixFQUF1QmlOLElBQUk5Z0IsTUFBSixHQUFhc2pCLE1BQXBDLENBQVgsRUFBd0R4QyxHQUF4RCxFQUE2RHdDLE1BQTdELEVBQXFFdGpCLE1BQXJFLENBQVA7QUFDRDs7QUFFRHdkLE9BQU8xWixTQUFQLENBQWlCNmIsS0FBakIsR0FBeUIsU0FBU0EsS0FBVCxDQUFnQjlMLE1BQWhCLEVBQXdCeVAsTUFBeEIsRUFBZ0N0akIsTUFBaEMsRUFBd0NzZixRQUF4QyxFQUFrRDtBQUN6RTtBQUNBLE1BQUlnRSxXQUFXbGtCLFNBQWYsRUFBMEI7QUFDeEJrZ0IsZUFBVyxNQUFYO0FBQ0F0ZixhQUFTLEtBQUtBLE1BQWQ7QUFDQXNqQixhQUFTLENBQVQ7QUFDRjtBQUNDLEdBTEQsTUFLTyxJQUFJdGpCLFdBQVdaLFNBQVgsSUFBd0IsT0FBT2trQixNQUFQLEtBQWtCLFFBQTlDLEVBQXdEO0FBQzdEaEUsZUFBV2dFLE1BQVg7QUFDQXRqQixhQUFTLEtBQUtBLE1BQWQ7QUFDQXNqQixhQUFTLENBQVQ7QUFDRjtBQUNDLEdBTE0sTUFLQSxJQUFJYSxTQUFTYixNQUFULENBQUosRUFBc0I7QUFDM0JBLGFBQVNBLFNBQVMsQ0FBbEI7QUFDQSxRQUFJYSxTQUFTbmtCLE1BQVQsQ0FBSixFQUFzQjtBQUNwQkEsZUFBU0EsU0FBUyxDQUFsQjtBQUNBLFVBQUlzZixhQUFhbGdCLFNBQWpCLEVBQTRCa2dCLFdBQVcsTUFBWDtBQUM3QixLQUhELE1BR087QUFDTEEsaUJBQVd0ZixNQUFYO0FBQ0FBLGVBQVNaLFNBQVQ7QUFDRDtBQUNIO0FBQ0MsR0FWTSxNQVVBO0FBQ0wsVUFBTSxJQUFJdUMsS0FBSixDQUNKLHlFQURJLENBQU47QUFHRDs7QUFFRCxNQUFJNmhCLFlBQVksS0FBS3hqQixNQUFMLEdBQWNzakIsTUFBOUI7QUFDQSxNQUFJdGpCLFdBQVdaLFNBQVgsSUFBd0JZLFNBQVN3akIsU0FBckMsRUFBZ0R4akIsU0FBU3dqQixTQUFUOztBQUVoRCxNQUFLM1AsT0FBTzdULE1BQVAsR0FBZ0IsQ0FBaEIsS0FBc0JBLFNBQVMsQ0FBVCxJQUFjc2pCLFNBQVMsQ0FBN0MsQ0FBRCxJQUFxREEsU0FBUyxLQUFLdGpCLE1BQXZFLEVBQStFO0FBQzdFLFVBQU0sSUFBSW1lLFVBQUosQ0FBZSx3Q0FBZixDQUFOO0FBQ0Q7O0FBRUQsTUFBSSxDQUFDbUIsUUFBTCxFQUFlQSxXQUFXLE1BQVg7O0FBRWYsTUFBSTBCLGNBQWMsS0FBbEI7QUFDQSxXQUFTO0FBQ1AsWUFBUTFCLFFBQVI7QUFDRSxXQUFLLEtBQUw7QUFDRSxlQUFPK0QsU0FBUyxJQUFULEVBQWV4UCxNQUFmLEVBQXVCeVAsTUFBdkIsRUFBK0J0akIsTUFBL0IsQ0FBUDs7QUFFRixXQUFLLE1BQUw7QUFDQSxXQUFLLE9BQUw7QUFDRSxlQUFPMmpCLFVBQVUsSUFBVixFQUFnQjlQLE1BQWhCLEVBQXdCeVAsTUFBeEIsRUFBZ0N0akIsTUFBaEMsQ0FBUDs7QUFFRixXQUFLLE9BQUw7QUFDRSxlQUFPNmpCLFdBQVcsSUFBWCxFQUFpQmhRLE1BQWpCLEVBQXlCeVAsTUFBekIsRUFBaUN0akIsTUFBakMsQ0FBUDs7QUFFRixXQUFLLFFBQUw7QUFDQSxXQUFLLFFBQUw7QUFDRSxlQUFPK2pCLFlBQVksSUFBWixFQUFrQmxRLE1BQWxCLEVBQTBCeVAsTUFBMUIsRUFBa0N0akIsTUFBbEMsQ0FBUDs7QUFFRixXQUFLLFFBQUw7QUFDRTtBQUNBLGVBQU9na0IsWUFBWSxJQUFaLEVBQWtCblEsTUFBbEIsRUFBMEJ5UCxNQUExQixFQUFrQ3RqQixNQUFsQyxDQUFQOztBQUVGLFdBQUssTUFBTDtBQUNBLFdBQUssT0FBTDtBQUNBLFdBQUssU0FBTDtBQUNBLFdBQUssVUFBTDtBQUNFLGVBQU9pa0IsVUFBVSxJQUFWLEVBQWdCcFEsTUFBaEIsRUFBd0J5UCxNQUF4QixFQUFnQ3RqQixNQUFoQyxDQUFQOztBQUVGO0FBQ0UsWUFBSWdoQixXQUFKLEVBQWlCLE1BQU0sSUFBSTNlLFNBQUosQ0FBYyx1QkFBdUJpZCxRQUFyQyxDQUFOO0FBQ2pCQSxtQkFBVyxDQUFDLEtBQUtBLFFBQU4sRUFBZ0JzQixXQUFoQixFQUFYO0FBQ0FJLHNCQUFjLElBQWQ7QUE1Qko7QUE4QkQ7QUFDRixDQXRFRDs7QUF3RUF4RCxPQUFPMVosU0FBUCxDQUFpQnNnQixNQUFqQixHQUEwQixTQUFTQSxNQUFULEdBQW1CO0FBQzNDLFNBQU87QUFDTDFqQixVQUFNLFFBREQ7QUFFTHNHLFVBQU1wSCxNQUFNa0UsU0FBTixDQUFnQjhGLEtBQWhCLENBQXNCdEksSUFBdEIsQ0FBMkIsS0FBSytpQixJQUFMLElBQWEsSUFBeEMsRUFBOEMsQ0FBOUM7QUFGRCxHQUFQO0FBSUQsQ0FMRDs7QUFPQSxTQUFTN0MsV0FBVCxDQUFzQlYsR0FBdEIsRUFBMkJyZixLQUEzQixFQUFrQ21KLEdBQWxDLEVBQXVDO0FBQ3JDLE1BQUluSixVQUFVLENBQVYsSUFBZW1KLFFBQVFrVyxJQUFJOWdCLE1BQS9CLEVBQXVDO0FBQ3JDLFdBQU9xZCxPQUFPeEIsYUFBUCxDQUFxQmlGLEdBQXJCLENBQVA7QUFDRCxHQUZELE1BRU87QUFDTCxXQUFPekQsT0FBT3hCLGFBQVAsQ0FBcUJpRixJQUFJbFgsS0FBSixDQUFVbkksS0FBVixFQUFpQm1KLEdBQWpCLENBQXJCLENBQVA7QUFDRDtBQUNGOztBQUVELFNBQVN5VyxTQUFULENBQW9CUCxHQUFwQixFQUF5QnJmLEtBQXpCLEVBQWdDbUosR0FBaEMsRUFBcUM7QUFDbkNBLFFBQU03QixLQUFLMlgsR0FBTCxDQUFTSSxJQUFJOWdCLE1BQWIsRUFBcUI0SyxHQUFyQixDQUFOO0FBQ0EsTUFBSTBaLE1BQU0sRUFBVjs7QUFFQSxNQUFJdmtCLElBQUkwQixLQUFSO0FBQ0EsU0FBTzFCLElBQUk2SyxHQUFYLEVBQWdCO0FBQ2QsUUFBSTJaLFlBQVl6RCxJQUFJL2dCLENBQUosQ0FBaEI7QUFDQSxRQUFJeWtCLFlBQVksSUFBaEI7QUFDQSxRQUFJQyxtQkFBb0JGLFlBQVksSUFBYixHQUFxQixDQUFyQixHQUNsQkEsWUFBWSxJQUFiLEdBQXFCLENBQXJCLEdBQ0NBLFlBQVksSUFBYixHQUFxQixDQUFyQixHQUNBLENBSEo7O0FBS0EsUUFBSXhrQixJQUFJMGtCLGdCQUFKLElBQXdCN1osR0FBNUIsRUFBaUM7QUFDL0IsVUFBSThaLFVBQUosRUFBZ0JDLFNBQWhCLEVBQTJCQyxVQUEzQixFQUF1Q0MsYUFBdkM7O0FBRUEsY0FBUUosZ0JBQVI7QUFDRSxhQUFLLENBQUw7QUFDRSxjQUFJRixZQUFZLElBQWhCLEVBQXNCO0FBQ3BCQyx3QkFBWUQsU0FBWjtBQUNEO0FBQ0Q7QUFDRixhQUFLLENBQUw7QUFDRUcsdUJBQWE1RCxJQUFJL2dCLElBQUksQ0FBUixDQUFiO0FBQ0EsY0FBSSxDQUFDMmtCLGFBQWEsSUFBZCxNQUF3QixJQUE1QixFQUFrQztBQUNoQ0csNEJBQWdCLENBQUNOLFlBQVksSUFBYixLQUFzQixHQUF0QixHQUE2QkcsYUFBYSxJQUExRDtBQUNBLGdCQUFJRyxnQkFBZ0IsSUFBcEIsRUFBMEI7QUFDeEJMLDBCQUFZSyxhQUFaO0FBQ0Q7QUFDRjtBQUNEO0FBQ0YsYUFBSyxDQUFMO0FBQ0VILHVCQUFhNUQsSUFBSS9nQixJQUFJLENBQVIsQ0FBYjtBQUNBNGtCLHNCQUFZN0QsSUFBSS9nQixJQUFJLENBQVIsQ0FBWjtBQUNBLGNBQUksQ0FBQzJrQixhQUFhLElBQWQsTUFBd0IsSUFBeEIsSUFBZ0MsQ0FBQ0MsWUFBWSxJQUFiLE1BQXVCLElBQTNELEVBQWlFO0FBQy9ERSw0QkFBZ0IsQ0FBQ04sWUFBWSxHQUFiLEtBQXFCLEdBQXJCLEdBQTJCLENBQUNHLGFBQWEsSUFBZCxLQUF1QixHQUFsRCxHQUF5REMsWUFBWSxJQUFyRjtBQUNBLGdCQUFJRSxnQkFBZ0IsS0FBaEIsS0FBMEJBLGdCQUFnQixNQUFoQixJQUEwQkEsZ0JBQWdCLE1BQXBFLENBQUosRUFBaUY7QUFDL0VMLDBCQUFZSyxhQUFaO0FBQ0Q7QUFDRjtBQUNEO0FBQ0YsYUFBSyxDQUFMO0FBQ0VILHVCQUFhNUQsSUFBSS9nQixJQUFJLENBQVIsQ0FBYjtBQUNBNGtCLHNCQUFZN0QsSUFBSS9nQixJQUFJLENBQVIsQ0FBWjtBQUNBNmtCLHVCQUFhOUQsSUFBSS9nQixJQUFJLENBQVIsQ0FBYjtBQUNBLGNBQUksQ0FBQzJrQixhQUFhLElBQWQsTUFBd0IsSUFBeEIsSUFBZ0MsQ0FBQ0MsWUFBWSxJQUFiLE1BQXVCLElBQXZELElBQStELENBQUNDLGFBQWEsSUFBZCxNQUF3QixJQUEzRixFQUFpRztBQUMvRkMsNEJBQWdCLENBQUNOLFlBQVksR0FBYixLQUFxQixJQUFyQixHQUE0QixDQUFDRyxhQUFhLElBQWQsS0FBdUIsR0FBbkQsR0FBeUQsQ0FBQ0MsWUFBWSxJQUFiLEtBQXNCLEdBQS9FLEdBQXNGQyxhQUFhLElBQW5IO0FBQ0EsZ0JBQUlDLGdCQUFnQixNQUFoQixJQUEwQkEsZ0JBQWdCLFFBQTlDLEVBQXdEO0FBQ3RETCwwQkFBWUssYUFBWjtBQUNEO0FBQ0Y7QUFsQ0w7QUFvQ0Q7O0FBRUQsUUFBSUwsY0FBYyxJQUFsQixFQUF3QjtBQUN0QjtBQUNBO0FBQ0FBLGtCQUFZLE1BQVo7QUFDQUMseUJBQW1CLENBQW5CO0FBQ0QsS0FMRCxNQUtPLElBQUlELFlBQVksTUFBaEIsRUFBd0I7QUFDN0I7QUFDQUEsbUJBQWEsT0FBYjtBQUNBRixVQUFJempCLElBQUosQ0FBUzJqQixjQUFjLEVBQWQsR0FBbUIsS0FBbkIsR0FBMkIsTUFBcEM7QUFDQUEsa0JBQVksU0FBU0EsWUFBWSxLQUFqQztBQUNEOztBQUVERixRQUFJempCLElBQUosQ0FBUzJqQixTQUFUO0FBQ0F6a0IsU0FBSzBrQixnQkFBTDtBQUNEOztBQUVELFNBQU9LLHNCQUFzQlIsR0FBdEIsQ0FBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBLElBQUlTLHVCQUF1QixNQUEzQjs7QUFFQSxTQUFTRCxxQkFBVCxDQUFnQ0UsVUFBaEMsRUFBNEM7QUFDMUMsTUFBSTdJLE1BQU02SSxXQUFXaGxCLE1BQXJCO0FBQ0EsTUFBSW1jLE9BQU80SSxvQkFBWCxFQUFpQztBQUMvQixXQUFPcEUsT0FBT3NFLFlBQVAsQ0FBb0IxZSxLQUFwQixDQUEwQm9hLE1BQTFCLEVBQWtDcUUsVUFBbEMsQ0FBUCxDQUQrQixDQUNzQjtBQUN0RDs7QUFFRDtBQUNBLE1BQUlWLE1BQU0sRUFBVjtBQUNBLE1BQUl2a0IsSUFBSSxDQUFSO0FBQ0EsU0FBT0EsSUFBSW9jLEdBQVgsRUFBZ0I7QUFDZG1JLFdBQU8zRCxPQUFPc0UsWUFBUCxDQUFvQjFlLEtBQXBCLENBQ0xvYSxNQURLLEVBRUxxRSxXQUFXcGIsS0FBWCxDQUFpQjdKLENBQWpCLEVBQW9CQSxLQUFLZ2xCLG9CQUF6QixDQUZLLENBQVA7QUFJRDtBQUNELFNBQU9ULEdBQVA7QUFDRDs7QUFFRCxTQUFTaEQsVUFBVCxDQUFxQlIsR0FBckIsRUFBMEJyZixLQUExQixFQUFpQ21KLEdBQWpDLEVBQXNDO0FBQ3BDLE1BQUlzYSxNQUFNLEVBQVY7QUFDQXRhLFFBQU03QixLQUFLMlgsR0FBTCxDQUFTSSxJQUFJOWdCLE1BQWIsRUFBcUI0SyxHQUFyQixDQUFOOztBQUVBLE9BQUssSUFBSTdLLElBQUkwQixLQUFiLEVBQW9CMUIsSUFBSTZLLEdBQXhCLEVBQTZCLEVBQUU3SyxDQUEvQixFQUFrQztBQUNoQ21sQixXQUFPdkUsT0FBT3NFLFlBQVAsQ0FBb0JuRSxJQUFJL2dCLENBQUosSUFBUyxJQUE3QixDQUFQO0FBQ0Q7QUFDRCxTQUFPbWxCLEdBQVA7QUFDRDs7QUFFRCxTQUFTM0QsV0FBVCxDQUFzQlQsR0FBdEIsRUFBMkJyZixLQUEzQixFQUFrQ21KLEdBQWxDLEVBQXVDO0FBQ3JDLE1BQUlzYSxNQUFNLEVBQVY7QUFDQXRhLFFBQU03QixLQUFLMlgsR0FBTCxDQUFTSSxJQUFJOWdCLE1BQWIsRUFBcUI0SyxHQUFyQixDQUFOOztBQUVBLE9BQUssSUFBSTdLLElBQUkwQixLQUFiLEVBQW9CMUIsSUFBSTZLLEdBQXhCLEVBQTZCLEVBQUU3SyxDQUEvQixFQUFrQztBQUNoQ21sQixXQUFPdkUsT0FBT3NFLFlBQVAsQ0FBb0JuRSxJQUFJL2dCLENBQUosQ0FBcEIsQ0FBUDtBQUNEO0FBQ0QsU0FBT21sQixHQUFQO0FBQ0Q7O0FBRUQsU0FBUzlELFFBQVQsQ0FBbUJOLEdBQW5CLEVBQXdCcmYsS0FBeEIsRUFBK0JtSixHQUEvQixFQUFvQztBQUNsQyxNQUFJdVIsTUFBTTJFLElBQUk5Z0IsTUFBZDs7QUFFQSxNQUFJLENBQUN5QixLQUFELElBQVVBLFFBQVEsQ0FBdEIsRUFBeUJBLFFBQVEsQ0FBUjtBQUN6QixNQUFJLENBQUNtSixHQUFELElBQVFBLE1BQU0sQ0FBZCxJQUFtQkEsTUFBTXVSLEdBQTdCLEVBQWtDdlIsTUFBTXVSLEdBQU47O0FBRWxDLE1BQUlnSixNQUFNLEVBQVY7QUFDQSxPQUFLLElBQUlwbEIsSUFBSTBCLEtBQWIsRUFBb0IxQixJQUFJNkssR0FBeEIsRUFBNkIsRUFBRTdLLENBQS9CLEVBQWtDO0FBQ2hDb2xCLFdBQU9DLE1BQU10RSxJQUFJL2dCLENBQUosQ0FBTixDQUFQO0FBQ0Q7QUFDRCxTQUFPb2xCLEdBQVA7QUFDRDs7QUFFRCxTQUFTMUQsWUFBVCxDQUF1QlgsR0FBdkIsRUFBNEJyZixLQUE1QixFQUFtQ21KLEdBQW5DLEVBQXdDO0FBQ3RDLE1BQUl5YSxRQUFRdkUsSUFBSWxYLEtBQUosQ0FBVW5JLEtBQVYsRUFBaUJtSixHQUFqQixDQUFaO0FBQ0EsTUFBSTBaLE1BQU0sRUFBVjtBQUNBLE9BQUssSUFBSXZrQixJQUFJLENBQWIsRUFBZ0JBLElBQUlzbEIsTUFBTXJsQixNQUExQixFQUFrQ0QsS0FBSyxDQUF2QyxFQUEwQztBQUN4Q3VrQixXQUFPM0QsT0FBT3NFLFlBQVAsQ0FBb0JJLE1BQU10bEIsQ0FBTixJQUFXc2xCLE1BQU10bEIsSUFBSSxDQUFWLElBQWUsR0FBOUMsQ0FBUDtBQUNEO0FBQ0QsU0FBT3VrQixHQUFQO0FBQ0Q7O0FBRUQ5RyxPQUFPMVosU0FBUCxDQUFpQjhGLEtBQWpCLEdBQXlCLFNBQVNBLEtBQVQsQ0FBZ0JuSSxLQUFoQixFQUF1Qm1KLEdBQXZCLEVBQTRCO0FBQ25ELE1BQUl1UixNQUFNLEtBQUtuYyxNQUFmO0FBQ0F5QixVQUFRLENBQUMsQ0FBQ0EsS0FBVjtBQUNBbUosUUFBTUEsUUFBUXhMLFNBQVIsR0FBb0IrYyxHQUFwQixHQUEwQixDQUFDLENBQUN2UixHQUFsQzs7QUFFQSxNQUFJbkosUUFBUSxDQUFaLEVBQWU7QUFDYkEsYUFBUzBhLEdBQVQ7QUFDQSxRQUFJMWEsUUFBUSxDQUFaLEVBQWVBLFFBQVEsQ0FBUjtBQUNoQixHQUhELE1BR08sSUFBSUEsUUFBUTBhLEdBQVosRUFBaUI7QUFDdEIxYSxZQUFRMGEsR0FBUjtBQUNEOztBQUVELE1BQUl2UixNQUFNLENBQVYsRUFBYTtBQUNYQSxXQUFPdVIsR0FBUDtBQUNBLFFBQUl2UixNQUFNLENBQVYsRUFBYUEsTUFBTSxDQUFOO0FBQ2QsR0FIRCxNQUdPLElBQUlBLE1BQU11UixHQUFWLEVBQWU7QUFDcEJ2UixVQUFNdVIsR0FBTjtBQUNEOztBQUVELE1BQUl2UixNQUFNbkosS0FBVixFQUFpQm1KLE1BQU1uSixLQUFOOztBQUVqQixNQUFJNmpCLE1BQUo7QUFDQSxNQUFJOUgsT0FBT0csbUJBQVgsRUFBZ0M7QUFDOUIySCxhQUFTLEtBQUt0SCxRQUFMLENBQWN2YyxLQUFkLEVBQXFCbUosR0FBckIsQ0FBVDtBQUNBMGEsV0FBT3hILFNBQVAsR0FBbUJOLE9BQU8xWixTQUExQjtBQUNELEdBSEQsTUFHTztBQUNMLFFBQUl5aEIsV0FBVzNhLE1BQU1uSixLQUFyQjtBQUNBNmpCLGFBQVMsSUFBSTlILE1BQUosQ0FBVytILFFBQVgsRUFBcUJubUIsU0FBckIsQ0FBVDtBQUNBLFNBQUssSUFBSVcsSUFBSSxDQUFiLEVBQWdCQSxJQUFJd2xCLFFBQXBCLEVBQThCLEVBQUV4bEIsQ0FBaEMsRUFBbUM7QUFDakN1bEIsYUFBT3ZsQixDQUFQLElBQVksS0FBS0EsSUFBSTBCLEtBQVQsQ0FBWjtBQUNEO0FBQ0Y7O0FBRUQsU0FBTzZqQixNQUFQO0FBQ0QsQ0FsQ0Q7O0FBb0NBOzs7QUFHQSxTQUFTRSxXQUFULENBQXNCbEMsTUFBdEIsRUFBOEJtQyxHQUE5QixFQUFtQ3psQixNQUFuQyxFQUEyQztBQUN6QyxNQUFLc2pCLFNBQVMsQ0FBVixLQUFpQixDQUFqQixJQUFzQkEsU0FBUyxDQUFuQyxFQUFzQyxNQUFNLElBQUluRixVQUFKLENBQWUsb0JBQWYsQ0FBTjtBQUN0QyxNQUFJbUYsU0FBU21DLEdBQVQsR0FBZXpsQixNQUFuQixFQUEyQixNQUFNLElBQUltZSxVQUFKLENBQWUsdUNBQWYsQ0FBTjtBQUM1Qjs7QUFFRFgsT0FBTzFaLFNBQVAsQ0FBaUI0aEIsVUFBakIsR0FBOEIsU0FBU0EsVUFBVCxDQUFxQnBDLE1BQXJCLEVBQTZCM0gsVUFBN0IsRUFBeUNnSyxRQUF6QyxFQUFtRDtBQUMvRXJDLFdBQVNBLFNBQVMsQ0FBbEI7QUFDQTNILGVBQWFBLGFBQWEsQ0FBMUI7QUFDQSxNQUFJLENBQUNnSyxRQUFMLEVBQWVILFlBQVlsQyxNQUFaLEVBQW9CM0gsVUFBcEIsRUFBZ0MsS0FBSzNiLE1BQXJDOztBQUVmLE1BQUl5aUIsTUFBTSxLQUFLYSxNQUFMLENBQVY7QUFDQSxNQUFJc0MsTUFBTSxDQUFWO0FBQ0EsTUFBSTdsQixJQUFJLENBQVI7QUFDQSxTQUFPLEVBQUVBLENBQUYsR0FBTTRiLFVBQU4sS0FBcUJpSyxPQUFPLEtBQTVCLENBQVAsRUFBMkM7QUFDekNuRCxXQUFPLEtBQUthLFNBQVN2akIsQ0FBZCxJQUFtQjZsQixHQUExQjtBQUNEOztBQUVELFNBQU9uRCxHQUFQO0FBQ0QsQ0FiRDs7QUFlQWpGLE9BQU8xWixTQUFQLENBQWlCK2hCLFVBQWpCLEdBQThCLFNBQVNBLFVBQVQsQ0FBcUJ2QyxNQUFyQixFQUE2QjNILFVBQTdCLEVBQXlDZ0ssUUFBekMsRUFBbUQ7QUFDL0VyQyxXQUFTQSxTQUFTLENBQWxCO0FBQ0EzSCxlQUFhQSxhQUFhLENBQTFCO0FBQ0EsTUFBSSxDQUFDZ0ssUUFBTCxFQUFlO0FBQ2JILGdCQUFZbEMsTUFBWixFQUFvQjNILFVBQXBCLEVBQWdDLEtBQUszYixNQUFyQztBQUNEOztBQUVELE1BQUl5aUIsTUFBTSxLQUFLYSxTQUFTLEVBQUUzSCxVQUFoQixDQUFWO0FBQ0EsTUFBSWlLLE1BQU0sQ0FBVjtBQUNBLFNBQU9qSyxhQUFhLENBQWIsS0FBbUJpSyxPQUFPLEtBQTFCLENBQVAsRUFBeUM7QUFDdkNuRCxXQUFPLEtBQUthLFNBQVMsRUFBRTNILFVBQWhCLElBQThCaUssR0FBckM7QUFDRDs7QUFFRCxTQUFPbkQsR0FBUDtBQUNELENBZEQ7O0FBZ0JBakYsT0FBTzFaLFNBQVAsQ0FBaUJnaUIsU0FBakIsR0FBNkIsU0FBU0EsU0FBVCxDQUFvQnhDLE1BQXBCLEVBQTRCcUMsUUFBNUIsRUFBc0M7QUFDakUsTUFBSSxDQUFDQSxRQUFMLEVBQWVILFlBQVlsQyxNQUFaLEVBQW9CLENBQXBCLEVBQXVCLEtBQUt0akIsTUFBNUI7QUFDZixTQUFPLEtBQUtzakIsTUFBTCxDQUFQO0FBQ0QsQ0FIRDs7QUFLQTlGLE9BQU8xWixTQUFQLENBQWlCaWlCLFlBQWpCLEdBQWdDLFNBQVNBLFlBQVQsQ0FBdUJ6QyxNQUF2QixFQUErQnFDLFFBQS9CLEVBQXlDO0FBQ3ZFLE1BQUksQ0FBQ0EsUUFBTCxFQUFlSCxZQUFZbEMsTUFBWixFQUFvQixDQUFwQixFQUF1QixLQUFLdGpCLE1BQTVCO0FBQ2YsU0FBTyxLQUFLc2pCLE1BQUwsSUFBZ0IsS0FBS0EsU0FBUyxDQUFkLEtBQW9CLENBQTNDO0FBQ0QsQ0FIRDs7QUFLQTlGLE9BQU8xWixTQUFQLENBQWlCbWYsWUFBakIsR0FBZ0MsU0FBU0EsWUFBVCxDQUF1QkssTUFBdkIsRUFBK0JxQyxRQUEvQixFQUF5QztBQUN2RSxNQUFJLENBQUNBLFFBQUwsRUFBZUgsWUFBWWxDLE1BQVosRUFBb0IsQ0FBcEIsRUFBdUIsS0FBS3RqQixNQUE1QjtBQUNmLFNBQVEsS0FBS3NqQixNQUFMLEtBQWdCLENBQWpCLEdBQXNCLEtBQUtBLFNBQVMsQ0FBZCxDQUE3QjtBQUNELENBSEQ7O0FBS0E5RixPQUFPMVosU0FBUCxDQUFpQmtpQixZQUFqQixHQUFnQyxTQUFTQSxZQUFULENBQXVCMUMsTUFBdkIsRUFBK0JxQyxRQUEvQixFQUF5QztBQUN2RSxNQUFJLENBQUNBLFFBQUwsRUFBZUgsWUFBWWxDLE1BQVosRUFBb0IsQ0FBcEIsRUFBdUIsS0FBS3RqQixNQUE1Qjs7QUFFZixTQUFPLENBQUUsS0FBS3NqQixNQUFMLENBQUQsR0FDSCxLQUFLQSxTQUFTLENBQWQsS0FBb0IsQ0FEakIsR0FFSCxLQUFLQSxTQUFTLENBQWQsS0FBb0IsRUFGbEIsSUFHRixLQUFLQSxTQUFTLENBQWQsSUFBbUIsU0FIeEI7QUFJRCxDQVBEOztBQVNBOUYsT0FBTzFaLFNBQVAsQ0FBaUJtaUIsWUFBakIsR0FBZ0MsU0FBU0EsWUFBVCxDQUF1QjNDLE1BQXZCLEVBQStCcUMsUUFBL0IsRUFBeUM7QUFDdkUsTUFBSSxDQUFDQSxRQUFMLEVBQWVILFlBQVlsQyxNQUFaLEVBQW9CLENBQXBCLEVBQXVCLEtBQUt0akIsTUFBNUI7O0FBRWYsU0FBUSxLQUFLc2pCLE1BQUwsSUFBZSxTQUFoQixJQUNILEtBQUtBLFNBQVMsQ0FBZCxLQUFvQixFQUFyQixHQUNBLEtBQUtBLFNBQVMsQ0FBZCxLQUFvQixDQURwQixHQUVELEtBQUtBLFNBQVMsQ0FBZCxDQUhLLENBQVA7QUFJRCxDQVBEOztBQVNBOUYsT0FBTzFaLFNBQVAsQ0FBaUJvaUIsU0FBakIsR0FBNkIsU0FBU0EsU0FBVCxDQUFvQjVDLE1BQXBCLEVBQTRCM0gsVUFBNUIsRUFBd0NnSyxRQUF4QyxFQUFrRDtBQUM3RXJDLFdBQVNBLFNBQVMsQ0FBbEI7QUFDQTNILGVBQWFBLGFBQWEsQ0FBMUI7QUFDQSxNQUFJLENBQUNnSyxRQUFMLEVBQWVILFlBQVlsQyxNQUFaLEVBQW9CM0gsVUFBcEIsRUFBZ0MsS0FBSzNiLE1BQXJDOztBQUVmLE1BQUl5aUIsTUFBTSxLQUFLYSxNQUFMLENBQVY7QUFDQSxNQUFJc0MsTUFBTSxDQUFWO0FBQ0EsTUFBSTdsQixJQUFJLENBQVI7QUFDQSxTQUFPLEVBQUVBLENBQUYsR0FBTTRiLFVBQU4sS0FBcUJpSyxPQUFPLEtBQTVCLENBQVAsRUFBMkM7QUFDekNuRCxXQUFPLEtBQUthLFNBQVN2akIsQ0FBZCxJQUFtQjZsQixHQUExQjtBQUNEO0FBQ0RBLFNBQU8sSUFBUDs7QUFFQSxNQUFJbkQsT0FBT21ELEdBQVgsRUFBZ0JuRCxPQUFPMVosS0FBS29kLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBSXhLLFVBQWhCLENBQVA7O0FBRWhCLFNBQU84RyxHQUFQO0FBQ0QsQ0FoQkQ7O0FBa0JBakYsT0FBTzFaLFNBQVAsQ0FBaUJzaUIsU0FBakIsR0FBNkIsU0FBU0EsU0FBVCxDQUFvQjlDLE1BQXBCLEVBQTRCM0gsVUFBNUIsRUFBd0NnSyxRQUF4QyxFQUFrRDtBQUM3RXJDLFdBQVNBLFNBQVMsQ0FBbEI7QUFDQTNILGVBQWFBLGFBQWEsQ0FBMUI7QUFDQSxNQUFJLENBQUNnSyxRQUFMLEVBQWVILFlBQVlsQyxNQUFaLEVBQW9CM0gsVUFBcEIsRUFBZ0MsS0FBSzNiLE1BQXJDOztBQUVmLE1BQUlELElBQUk0YixVQUFSO0FBQ0EsTUFBSWlLLE1BQU0sQ0FBVjtBQUNBLE1BQUluRCxNQUFNLEtBQUthLFNBQVMsRUFBRXZqQixDQUFoQixDQUFWO0FBQ0EsU0FBT0EsSUFBSSxDQUFKLEtBQVU2bEIsT0FBTyxLQUFqQixDQUFQLEVBQWdDO0FBQzlCbkQsV0FBTyxLQUFLYSxTQUFTLEVBQUV2akIsQ0FBaEIsSUFBcUI2bEIsR0FBNUI7QUFDRDtBQUNEQSxTQUFPLElBQVA7O0FBRUEsTUFBSW5ELE9BQU9tRCxHQUFYLEVBQWdCbkQsT0FBTzFaLEtBQUtvZCxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUl4SyxVQUFoQixDQUFQOztBQUVoQixTQUFPOEcsR0FBUDtBQUNELENBaEJEOztBQWtCQWpGLE9BQU8xWixTQUFQLENBQWlCdWlCLFFBQWpCLEdBQTRCLFNBQVNBLFFBQVQsQ0FBbUIvQyxNQUFuQixFQUEyQnFDLFFBQTNCLEVBQXFDO0FBQy9ELE1BQUksQ0FBQ0EsUUFBTCxFQUFlSCxZQUFZbEMsTUFBWixFQUFvQixDQUFwQixFQUF1QixLQUFLdGpCLE1BQTVCO0FBQ2YsTUFBSSxFQUFFLEtBQUtzakIsTUFBTCxJQUFlLElBQWpCLENBQUosRUFBNEIsT0FBUSxLQUFLQSxNQUFMLENBQVI7QUFDNUIsU0FBUSxDQUFDLE9BQU8sS0FBS0EsTUFBTCxDQUFQLEdBQXNCLENBQXZCLElBQTRCLENBQUMsQ0FBckM7QUFDRCxDQUpEOztBQU1BOUYsT0FBTzFaLFNBQVAsQ0FBaUJ3aUIsV0FBakIsR0FBK0IsU0FBU0EsV0FBVCxDQUFzQmhELE1BQXRCLEVBQThCcUMsUUFBOUIsRUFBd0M7QUFDckUsTUFBSSxDQUFDQSxRQUFMLEVBQWVILFlBQVlsQyxNQUFaLEVBQW9CLENBQXBCLEVBQXVCLEtBQUt0akIsTUFBNUI7QUFDZixNQUFJeWlCLE1BQU0sS0FBS2EsTUFBTCxJQUFnQixLQUFLQSxTQUFTLENBQWQsS0FBb0IsQ0FBOUM7QUFDQSxTQUFRYixNQUFNLE1BQVAsR0FBaUJBLE1BQU0sVUFBdkIsR0FBb0NBLEdBQTNDO0FBQ0QsQ0FKRDs7QUFNQWpGLE9BQU8xWixTQUFQLENBQWlCeWlCLFdBQWpCLEdBQStCLFNBQVNBLFdBQVQsQ0FBc0JqRCxNQUF0QixFQUE4QnFDLFFBQTlCLEVBQXdDO0FBQ3JFLE1BQUksQ0FBQ0EsUUFBTCxFQUFlSCxZQUFZbEMsTUFBWixFQUFvQixDQUFwQixFQUF1QixLQUFLdGpCLE1BQTVCO0FBQ2YsTUFBSXlpQixNQUFNLEtBQUthLFNBQVMsQ0FBZCxJQUFvQixLQUFLQSxNQUFMLEtBQWdCLENBQTlDO0FBQ0EsU0FBUWIsTUFBTSxNQUFQLEdBQWlCQSxNQUFNLFVBQXZCLEdBQW9DQSxHQUEzQztBQUNELENBSkQ7O0FBTUFqRixPQUFPMVosU0FBUCxDQUFpQjBpQixXQUFqQixHQUErQixTQUFTQSxXQUFULENBQXNCbEQsTUFBdEIsRUFBOEJxQyxRQUE5QixFQUF3QztBQUNyRSxNQUFJLENBQUNBLFFBQUwsRUFBZUgsWUFBWWxDLE1BQVosRUFBb0IsQ0FBcEIsRUFBdUIsS0FBS3RqQixNQUE1Qjs7QUFFZixTQUFRLEtBQUtzakIsTUFBTCxDQUFELEdBQ0osS0FBS0EsU0FBUyxDQUFkLEtBQW9CLENBRGhCLEdBRUosS0FBS0EsU0FBUyxDQUFkLEtBQW9CLEVBRmhCLEdBR0osS0FBS0EsU0FBUyxDQUFkLEtBQW9CLEVBSHZCO0FBSUQsQ0FQRDs7QUFTQTlGLE9BQU8xWixTQUFQLENBQWlCMmlCLFdBQWpCLEdBQStCLFNBQVNBLFdBQVQsQ0FBc0JuRCxNQUF0QixFQUE4QnFDLFFBQTlCLEVBQXdDO0FBQ3JFLE1BQUksQ0FBQ0EsUUFBTCxFQUFlSCxZQUFZbEMsTUFBWixFQUFvQixDQUFwQixFQUF1QixLQUFLdGpCLE1BQTVCOztBQUVmLFNBQVEsS0FBS3NqQixNQUFMLEtBQWdCLEVBQWpCLEdBQ0osS0FBS0EsU0FBUyxDQUFkLEtBQW9CLEVBRGhCLEdBRUosS0FBS0EsU0FBUyxDQUFkLEtBQW9CLENBRmhCLEdBR0osS0FBS0EsU0FBUyxDQUFkLENBSEg7QUFJRCxDQVBEOztBQVNBOUYsT0FBTzFaLFNBQVAsQ0FBaUI0aUIsV0FBakIsR0FBK0IsU0FBU0EsV0FBVCxDQUFzQnBELE1BQXRCLEVBQThCcUMsUUFBOUIsRUFBd0M7QUFDckUsTUFBSSxDQUFDQSxRQUFMLEVBQWVILFlBQVlsQyxNQUFaLEVBQW9CLENBQXBCLEVBQXVCLEtBQUt0akIsTUFBNUI7QUFDZixTQUFPdWQsUUFBUXlGLElBQVIsQ0FBYSxJQUFiLEVBQW1CTSxNQUFuQixFQUEyQixJQUEzQixFQUFpQyxFQUFqQyxFQUFxQyxDQUFyQyxDQUFQO0FBQ0QsQ0FIRDs7QUFLQTlGLE9BQU8xWixTQUFQLENBQWlCNmlCLFdBQWpCLEdBQStCLFNBQVNBLFdBQVQsQ0FBc0JyRCxNQUF0QixFQUE4QnFDLFFBQTlCLEVBQXdDO0FBQ3JFLE1BQUksQ0FBQ0EsUUFBTCxFQUFlSCxZQUFZbEMsTUFBWixFQUFvQixDQUFwQixFQUF1QixLQUFLdGpCLE1BQTVCO0FBQ2YsU0FBT3VkLFFBQVF5RixJQUFSLENBQWEsSUFBYixFQUFtQk0sTUFBbkIsRUFBMkIsS0FBM0IsRUFBa0MsRUFBbEMsRUFBc0MsQ0FBdEMsQ0FBUDtBQUNELENBSEQ7O0FBS0E5RixPQUFPMVosU0FBUCxDQUFpQjhpQixZQUFqQixHQUFnQyxTQUFTQSxZQUFULENBQXVCdEQsTUFBdkIsRUFBK0JxQyxRQUEvQixFQUF5QztBQUN2RSxNQUFJLENBQUNBLFFBQUwsRUFBZUgsWUFBWWxDLE1BQVosRUFBb0IsQ0FBcEIsRUFBdUIsS0FBS3RqQixNQUE1QjtBQUNmLFNBQU91ZCxRQUFReUYsSUFBUixDQUFhLElBQWIsRUFBbUJNLE1BQW5CLEVBQTJCLElBQTNCLEVBQWlDLEVBQWpDLEVBQXFDLENBQXJDLENBQVA7QUFDRCxDQUhEOztBQUtBOUYsT0FBTzFaLFNBQVAsQ0FBaUIraUIsWUFBakIsR0FBZ0MsU0FBU0EsWUFBVCxDQUF1QnZELE1BQXZCLEVBQStCcUMsUUFBL0IsRUFBeUM7QUFDdkUsTUFBSSxDQUFDQSxRQUFMLEVBQWVILFlBQVlsQyxNQUFaLEVBQW9CLENBQXBCLEVBQXVCLEtBQUt0akIsTUFBNUI7QUFDZixTQUFPdWQsUUFBUXlGLElBQVIsQ0FBYSxJQUFiLEVBQW1CTSxNQUFuQixFQUEyQixLQUEzQixFQUFrQyxFQUFsQyxFQUFzQyxDQUF0QyxDQUFQO0FBQ0QsQ0FIRDs7QUFLQSxTQUFTd0QsUUFBVCxDQUFtQmhHLEdBQW5CLEVBQXdCbmdCLEtBQXhCLEVBQStCMmlCLE1BQS9CLEVBQXVDbUMsR0FBdkMsRUFBNEN2RCxHQUE1QyxFQUFpRHhCLEdBQWpELEVBQXNEO0FBQ3BELE1BQUksQ0FBQ2xELE9BQU93QyxRQUFQLENBQWdCYyxHQUFoQixDQUFMLEVBQTJCLE1BQU0sSUFBSXplLFNBQUosQ0FBYyw2Q0FBZCxDQUFOO0FBQzNCLE1BQUkxQixRQUFRdWhCLEdBQVIsSUFBZXZoQixRQUFRK2YsR0FBM0IsRUFBZ0MsTUFBTSxJQUFJdkMsVUFBSixDQUFlLG1DQUFmLENBQU47QUFDaEMsTUFBSW1GLFNBQVNtQyxHQUFULEdBQWUzRSxJQUFJOWdCLE1BQXZCLEVBQStCLE1BQU0sSUFBSW1lLFVBQUosQ0FBZSxvQkFBZixDQUFOO0FBQ2hDOztBQUVEWCxPQUFPMVosU0FBUCxDQUFpQmlqQixXQUFqQixHQUErQixTQUFTQSxXQUFULENBQXNCcG1CLEtBQXRCLEVBQTZCMmlCLE1BQTdCLEVBQXFDM0gsVUFBckMsRUFBaURnSyxRQUFqRCxFQUEyRDtBQUN4RmhsQixVQUFRLENBQUNBLEtBQVQ7QUFDQTJpQixXQUFTQSxTQUFTLENBQWxCO0FBQ0EzSCxlQUFhQSxhQUFhLENBQTFCO0FBQ0EsTUFBSSxDQUFDZ0ssUUFBTCxFQUFlO0FBQ2IsUUFBSXFCLFdBQVdqZSxLQUFLb2QsR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFJeEssVUFBaEIsSUFBOEIsQ0FBN0M7QUFDQW1MLGFBQVMsSUFBVCxFQUFlbm1CLEtBQWYsRUFBc0IyaUIsTUFBdEIsRUFBOEIzSCxVQUE5QixFQUEwQ3FMLFFBQTFDLEVBQW9ELENBQXBEO0FBQ0Q7O0FBRUQsTUFBSXBCLE1BQU0sQ0FBVjtBQUNBLE1BQUk3bEIsSUFBSSxDQUFSO0FBQ0EsT0FBS3VqQixNQUFMLElBQWUzaUIsUUFBUSxJQUF2QjtBQUNBLFNBQU8sRUFBRVosQ0FBRixHQUFNNGIsVUFBTixLQUFxQmlLLE9BQU8sS0FBNUIsQ0FBUCxFQUEyQztBQUN6QyxTQUFLdEMsU0FBU3ZqQixDQUFkLElBQW9CWSxRQUFRaWxCLEdBQVQsR0FBZ0IsSUFBbkM7QUFDRDs7QUFFRCxTQUFPdEMsU0FBUzNILFVBQWhCO0FBQ0QsQ0FqQkQ7O0FBbUJBNkIsT0FBTzFaLFNBQVAsQ0FBaUJtakIsV0FBakIsR0FBK0IsU0FBU0EsV0FBVCxDQUFzQnRtQixLQUF0QixFQUE2QjJpQixNQUE3QixFQUFxQzNILFVBQXJDLEVBQWlEZ0ssUUFBakQsRUFBMkQ7QUFDeEZobEIsVUFBUSxDQUFDQSxLQUFUO0FBQ0EyaUIsV0FBU0EsU0FBUyxDQUFsQjtBQUNBM0gsZUFBYUEsYUFBYSxDQUExQjtBQUNBLE1BQUksQ0FBQ2dLLFFBQUwsRUFBZTtBQUNiLFFBQUlxQixXQUFXamUsS0FBS29kLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBSXhLLFVBQWhCLElBQThCLENBQTdDO0FBQ0FtTCxhQUFTLElBQVQsRUFBZW5tQixLQUFmLEVBQXNCMmlCLE1BQXRCLEVBQThCM0gsVUFBOUIsRUFBMENxTCxRQUExQyxFQUFvRCxDQUFwRDtBQUNEOztBQUVELE1BQUlqbkIsSUFBSTRiLGFBQWEsQ0FBckI7QUFDQSxNQUFJaUssTUFBTSxDQUFWO0FBQ0EsT0FBS3RDLFNBQVN2akIsQ0FBZCxJQUFtQlksUUFBUSxJQUEzQjtBQUNBLFNBQU8sRUFBRVosQ0FBRixJQUFPLENBQVAsS0FBYTZsQixPQUFPLEtBQXBCLENBQVAsRUFBbUM7QUFDakMsU0FBS3RDLFNBQVN2akIsQ0FBZCxJQUFvQlksUUFBUWlsQixHQUFULEdBQWdCLElBQW5DO0FBQ0Q7O0FBRUQsU0FBT3RDLFNBQVMzSCxVQUFoQjtBQUNELENBakJEOztBQW1CQTZCLE9BQU8xWixTQUFQLENBQWlCb2pCLFVBQWpCLEdBQThCLFNBQVNBLFVBQVQsQ0FBcUJ2bUIsS0FBckIsRUFBNEIyaUIsTUFBNUIsRUFBb0NxQyxRQUFwQyxFQUE4QztBQUMxRWhsQixVQUFRLENBQUNBLEtBQVQ7QUFDQTJpQixXQUFTQSxTQUFTLENBQWxCO0FBQ0EsTUFBSSxDQUFDcUMsUUFBTCxFQUFlbUIsU0FBUyxJQUFULEVBQWVubUIsS0FBZixFQUFzQjJpQixNQUF0QixFQUE4QixDQUE5QixFQUFpQyxJQUFqQyxFQUF1QyxDQUF2QztBQUNmLE1BQUksQ0FBQzlGLE9BQU9HLG1CQUFaLEVBQWlDaGQsUUFBUW9JLEtBQUtvZSxLQUFMLENBQVd4bUIsS0FBWCxDQUFSO0FBQ2pDLE9BQUsyaUIsTUFBTCxJQUFnQjNpQixRQUFRLElBQXhCO0FBQ0EsU0FBTzJpQixTQUFTLENBQWhCO0FBQ0QsQ0FQRDs7QUFTQSxTQUFTOEQsaUJBQVQsQ0FBNEJ0RyxHQUE1QixFQUFpQ25nQixLQUFqQyxFQUF3QzJpQixNQUF4QyxFQUFnRCtELFlBQWhELEVBQThEO0FBQzVELE1BQUkxbUIsUUFBUSxDQUFaLEVBQWVBLFFBQVEsU0FBU0EsS0FBVCxHQUFpQixDQUF6QjtBQUNmLE9BQUssSUFBSVosSUFBSSxDQUFSLEVBQVcwVSxJQUFJMUwsS0FBSzJYLEdBQUwsQ0FBU0ksSUFBSTlnQixNQUFKLEdBQWFzakIsTUFBdEIsRUFBOEIsQ0FBOUIsQ0FBcEIsRUFBc0R2akIsSUFBSTBVLENBQTFELEVBQTZELEVBQUUxVSxDQUEvRCxFQUFrRTtBQUNoRStnQixRQUFJd0MsU0FBU3ZqQixDQUFiLElBQWtCLENBQUNZLFFBQVMsUUFBUyxLQUFLMG1CLGVBQWV0bkIsQ0FBZixHQUFtQixJQUFJQSxDQUE1QixDQUFuQixNQUNoQixDQUFDc25CLGVBQWV0bkIsQ0FBZixHQUFtQixJQUFJQSxDQUF4QixJQUE2QixDQUQvQjtBQUVEO0FBQ0Y7O0FBRUR5ZCxPQUFPMVosU0FBUCxDQUFpQndqQixhQUFqQixHQUFpQyxTQUFTQSxhQUFULENBQXdCM21CLEtBQXhCLEVBQStCMmlCLE1BQS9CLEVBQXVDcUMsUUFBdkMsRUFBaUQ7QUFDaEZobEIsVUFBUSxDQUFDQSxLQUFUO0FBQ0EyaUIsV0FBU0EsU0FBUyxDQUFsQjtBQUNBLE1BQUksQ0FBQ3FDLFFBQUwsRUFBZW1CLFNBQVMsSUFBVCxFQUFlbm1CLEtBQWYsRUFBc0IyaUIsTUFBdEIsRUFBOEIsQ0FBOUIsRUFBaUMsTUFBakMsRUFBeUMsQ0FBekM7QUFDZixNQUFJOUYsT0FBT0csbUJBQVgsRUFBZ0M7QUFDOUIsU0FBSzJGLE1BQUwsSUFBZ0IzaUIsUUFBUSxJQUF4QjtBQUNBLFNBQUsyaUIsU0FBUyxDQUFkLElBQW9CM2lCLFVBQVUsQ0FBOUI7QUFDRCxHQUhELE1BR087QUFDTHltQixzQkFBa0IsSUFBbEIsRUFBd0J6bUIsS0FBeEIsRUFBK0IyaUIsTUFBL0IsRUFBdUMsSUFBdkM7QUFDRDtBQUNELFNBQU9BLFNBQVMsQ0FBaEI7QUFDRCxDQVhEOztBQWFBOUYsT0FBTzFaLFNBQVAsQ0FBaUJ5akIsYUFBakIsR0FBaUMsU0FBU0EsYUFBVCxDQUF3QjVtQixLQUF4QixFQUErQjJpQixNQUEvQixFQUF1Q3FDLFFBQXZDLEVBQWlEO0FBQ2hGaGxCLFVBQVEsQ0FBQ0EsS0FBVDtBQUNBMmlCLFdBQVNBLFNBQVMsQ0FBbEI7QUFDQSxNQUFJLENBQUNxQyxRQUFMLEVBQWVtQixTQUFTLElBQVQsRUFBZW5tQixLQUFmLEVBQXNCMmlCLE1BQXRCLEVBQThCLENBQTlCLEVBQWlDLE1BQWpDLEVBQXlDLENBQXpDO0FBQ2YsTUFBSTlGLE9BQU9HLG1CQUFYLEVBQWdDO0FBQzlCLFNBQUsyRixNQUFMLElBQWdCM2lCLFVBQVUsQ0FBMUI7QUFDQSxTQUFLMmlCLFNBQVMsQ0FBZCxJQUFvQjNpQixRQUFRLElBQTVCO0FBQ0QsR0FIRCxNQUdPO0FBQ0x5bUIsc0JBQWtCLElBQWxCLEVBQXdCem1CLEtBQXhCLEVBQStCMmlCLE1BQS9CLEVBQXVDLEtBQXZDO0FBQ0Q7QUFDRCxTQUFPQSxTQUFTLENBQWhCO0FBQ0QsQ0FYRDs7QUFhQSxTQUFTa0UsaUJBQVQsQ0FBNEIxRyxHQUE1QixFQUFpQ25nQixLQUFqQyxFQUF3QzJpQixNQUF4QyxFQUFnRCtELFlBQWhELEVBQThEO0FBQzVELE1BQUkxbUIsUUFBUSxDQUFaLEVBQWVBLFFBQVEsYUFBYUEsS0FBYixHQUFxQixDQUE3QjtBQUNmLE9BQUssSUFBSVosSUFBSSxDQUFSLEVBQVcwVSxJQUFJMUwsS0FBSzJYLEdBQUwsQ0FBU0ksSUFBSTlnQixNQUFKLEdBQWFzakIsTUFBdEIsRUFBOEIsQ0FBOUIsQ0FBcEIsRUFBc0R2akIsSUFBSTBVLENBQTFELEVBQTZELEVBQUUxVSxDQUEvRCxFQUFrRTtBQUNoRStnQixRQUFJd0MsU0FBU3ZqQixDQUFiLElBQW1CWSxVQUFVLENBQUMwbUIsZUFBZXRuQixDQUFmLEdBQW1CLElBQUlBLENBQXhCLElBQTZCLENBQXhDLEdBQTZDLElBQS9EO0FBQ0Q7QUFDRjs7QUFFRHlkLE9BQU8xWixTQUFQLENBQWlCMmpCLGFBQWpCLEdBQWlDLFNBQVNBLGFBQVQsQ0FBd0I5bUIsS0FBeEIsRUFBK0IyaUIsTUFBL0IsRUFBdUNxQyxRQUF2QyxFQUFpRDtBQUNoRmhsQixVQUFRLENBQUNBLEtBQVQ7QUFDQTJpQixXQUFTQSxTQUFTLENBQWxCO0FBQ0EsTUFBSSxDQUFDcUMsUUFBTCxFQUFlbUIsU0FBUyxJQUFULEVBQWVubUIsS0FBZixFQUFzQjJpQixNQUF0QixFQUE4QixDQUE5QixFQUFpQyxVQUFqQyxFQUE2QyxDQUE3QztBQUNmLE1BQUk5RixPQUFPRyxtQkFBWCxFQUFnQztBQUM5QixTQUFLMkYsU0FBUyxDQUFkLElBQW9CM2lCLFVBQVUsRUFBOUI7QUFDQSxTQUFLMmlCLFNBQVMsQ0FBZCxJQUFvQjNpQixVQUFVLEVBQTlCO0FBQ0EsU0FBSzJpQixTQUFTLENBQWQsSUFBb0IzaUIsVUFBVSxDQUE5QjtBQUNBLFNBQUsyaUIsTUFBTCxJQUFnQjNpQixRQUFRLElBQXhCO0FBQ0QsR0FMRCxNQUtPO0FBQ0w2bUIsc0JBQWtCLElBQWxCLEVBQXdCN21CLEtBQXhCLEVBQStCMmlCLE1BQS9CLEVBQXVDLElBQXZDO0FBQ0Q7QUFDRCxTQUFPQSxTQUFTLENBQWhCO0FBQ0QsQ0FiRDs7QUFlQTlGLE9BQU8xWixTQUFQLENBQWlCNGpCLGFBQWpCLEdBQWlDLFNBQVNBLGFBQVQsQ0FBd0IvbUIsS0FBeEIsRUFBK0IyaUIsTUFBL0IsRUFBdUNxQyxRQUF2QyxFQUFpRDtBQUNoRmhsQixVQUFRLENBQUNBLEtBQVQ7QUFDQTJpQixXQUFTQSxTQUFTLENBQWxCO0FBQ0EsTUFBSSxDQUFDcUMsUUFBTCxFQUFlbUIsU0FBUyxJQUFULEVBQWVubUIsS0FBZixFQUFzQjJpQixNQUF0QixFQUE4QixDQUE5QixFQUFpQyxVQUFqQyxFQUE2QyxDQUE3QztBQUNmLE1BQUk5RixPQUFPRyxtQkFBWCxFQUFnQztBQUM5QixTQUFLMkYsTUFBTCxJQUFnQjNpQixVQUFVLEVBQTFCO0FBQ0EsU0FBSzJpQixTQUFTLENBQWQsSUFBb0IzaUIsVUFBVSxFQUE5QjtBQUNBLFNBQUsyaUIsU0FBUyxDQUFkLElBQW9CM2lCLFVBQVUsQ0FBOUI7QUFDQSxTQUFLMmlCLFNBQVMsQ0FBZCxJQUFvQjNpQixRQUFRLElBQTVCO0FBQ0QsR0FMRCxNQUtPO0FBQ0w2bUIsc0JBQWtCLElBQWxCLEVBQXdCN21CLEtBQXhCLEVBQStCMmlCLE1BQS9CLEVBQXVDLEtBQXZDO0FBQ0Q7QUFDRCxTQUFPQSxTQUFTLENBQWhCO0FBQ0QsQ0FiRDs7QUFlQTlGLE9BQU8xWixTQUFQLENBQWlCNmpCLFVBQWpCLEdBQThCLFNBQVNBLFVBQVQsQ0FBcUJobkIsS0FBckIsRUFBNEIyaUIsTUFBNUIsRUFBb0MzSCxVQUFwQyxFQUFnRGdLLFFBQWhELEVBQTBEO0FBQ3RGaGxCLFVBQVEsQ0FBQ0EsS0FBVDtBQUNBMmlCLFdBQVNBLFNBQVMsQ0FBbEI7QUFDQSxNQUFJLENBQUNxQyxRQUFMLEVBQWU7QUFDYixRQUFJaUMsUUFBUTdlLEtBQUtvZCxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUl4SyxVQUFKLEdBQWlCLENBQTdCLENBQVo7O0FBRUFtTCxhQUFTLElBQVQsRUFBZW5tQixLQUFmLEVBQXNCMmlCLE1BQXRCLEVBQThCM0gsVUFBOUIsRUFBMENpTSxRQUFRLENBQWxELEVBQXFELENBQUNBLEtBQXREO0FBQ0Q7O0FBRUQsTUFBSTduQixJQUFJLENBQVI7QUFDQSxNQUFJNmxCLE1BQU0sQ0FBVjtBQUNBLE1BQUlpQyxNQUFNLENBQVY7QUFDQSxPQUFLdkUsTUFBTCxJQUFlM2lCLFFBQVEsSUFBdkI7QUFDQSxTQUFPLEVBQUVaLENBQUYsR0FBTTRiLFVBQU4sS0FBcUJpSyxPQUFPLEtBQTVCLENBQVAsRUFBMkM7QUFDekMsUUFBSWpsQixRQUFRLENBQVIsSUFBYWtuQixRQUFRLENBQXJCLElBQTBCLEtBQUt2RSxTQUFTdmpCLENBQVQsR0FBYSxDQUFsQixNQUF5QixDQUF2RCxFQUEwRDtBQUN4RDhuQixZQUFNLENBQU47QUFDRDtBQUNELFNBQUt2RSxTQUFTdmpCLENBQWQsSUFBbUIsQ0FBRVksUUFBUWlsQixHQUFULElBQWlCLENBQWxCLElBQXVCaUMsR0FBdkIsR0FBNkIsSUFBaEQ7QUFDRDs7QUFFRCxTQUFPdkUsU0FBUzNILFVBQWhCO0FBQ0QsQ0FyQkQ7O0FBdUJBNkIsT0FBTzFaLFNBQVAsQ0FBaUJna0IsVUFBakIsR0FBOEIsU0FBU0EsVUFBVCxDQUFxQm5uQixLQUFyQixFQUE0QjJpQixNQUE1QixFQUFvQzNILFVBQXBDLEVBQWdEZ0ssUUFBaEQsRUFBMEQ7QUFDdEZobEIsVUFBUSxDQUFDQSxLQUFUO0FBQ0EyaUIsV0FBU0EsU0FBUyxDQUFsQjtBQUNBLE1BQUksQ0FBQ3FDLFFBQUwsRUFBZTtBQUNiLFFBQUlpQyxRQUFRN2UsS0FBS29kLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBSXhLLFVBQUosR0FBaUIsQ0FBN0IsQ0FBWjs7QUFFQW1MLGFBQVMsSUFBVCxFQUFlbm1CLEtBQWYsRUFBc0IyaUIsTUFBdEIsRUFBOEIzSCxVQUE5QixFQUEwQ2lNLFFBQVEsQ0FBbEQsRUFBcUQsQ0FBQ0EsS0FBdEQ7QUFDRDs7QUFFRCxNQUFJN25CLElBQUk0YixhQUFhLENBQXJCO0FBQ0EsTUFBSWlLLE1BQU0sQ0FBVjtBQUNBLE1BQUlpQyxNQUFNLENBQVY7QUFDQSxPQUFLdkUsU0FBU3ZqQixDQUFkLElBQW1CWSxRQUFRLElBQTNCO0FBQ0EsU0FBTyxFQUFFWixDQUFGLElBQU8sQ0FBUCxLQUFhNmxCLE9BQU8sS0FBcEIsQ0FBUCxFQUFtQztBQUNqQyxRQUFJamxCLFFBQVEsQ0FBUixJQUFha25CLFFBQVEsQ0FBckIsSUFBMEIsS0FBS3ZFLFNBQVN2akIsQ0FBVCxHQUFhLENBQWxCLE1BQXlCLENBQXZELEVBQTBEO0FBQ3hEOG5CLFlBQU0sQ0FBTjtBQUNEO0FBQ0QsU0FBS3ZFLFNBQVN2akIsQ0FBZCxJQUFtQixDQUFFWSxRQUFRaWxCLEdBQVQsSUFBaUIsQ0FBbEIsSUFBdUJpQyxHQUF2QixHQUE2QixJQUFoRDtBQUNEOztBQUVELFNBQU92RSxTQUFTM0gsVUFBaEI7QUFDRCxDQXJCRDs7QUF1QkE2QixPQUFPMVosU0FBUCxDQUFpQmlrQixTQUFqQixHQUE2QixTQUFTQSxTQUFULENBQW9CcG5CLEtBQXBCLEVBQTJCMmlCLE1BQTNCLEVBQW1DcUMsUUFBbkMsRUFBNkM7QUFDeEVobEIsVUFBUSxDQUFDQSxLQUFUO0FBQ0EyaUIsV0FBU0EsU0FBUyxDQUFsQjtBQUNBLE1BQUksQ0FBQ3FDLFFBQUwsRUFBZW1CLFNBQVMsSUFBVCxFQUFlbm1CLEtBQWYsRUFBc0IyaUIsTUFBdEIsRUFBOEIsQ0FBOUIsRUFBaUMsSUFBakMsRUFBdUMsQ0FBQyxJQUF4QztBQUNmLE1BQUksQ0FBQzlGLE9BQU9HLG1CQUFaLEVBQWlDaGQsUUFBUW9JLEtBQUtvZSxLQUFMLENBQVd4bUIsS0FBWCxDQUFSO0FBQ2pDLE1BQUlBLFFBQVEsQ0FBWixFQUFlQSxRQUFRLE9BQU9BLEtBQVAsR0FBZSxDQUF2QjtBQUNmLE9BQUsyaUIsTUFBTCxJQUFnQjNpQixRQUFRLElBQXhCO0FBQ0EsU0FBTzJpQixTQUFTLENBQWhCO0FBQ0QsQ0FSRDs7QUFVQTlGLE9BQU8xWixTQUFQLENBQWlCa2tCLFlBQWpCLEdBQWdDLFNBQVNBLFlBQVQsQ0FBdUJybkIsS0FBdkIsRUFBOEIyaUIsTUFBOUIsRUFBc0NxQyxRQUF0QyxFQUFnRDtBQUM5RWhsQixVQUFRLENBQUNBLEtBQVQ7QUFDQTJpQixXQUFTQSxTQUFTLENBQWxCO0FBQ0EsTUFBSSxDQUFDcUMsUUFBTCxFQUFlbUIsU0FBUyxJQUFULEVBQWVubUIsS0FBZixFQUFzQjJpQixNQUF0QixFQUE4QixDQUE5QixFQUFpQyxNQUFqQyxFQUF5QyxDQUFDLE1BQTFDO0FBQ2YsTUFBSTlGLE9BQU9HLG1CQUFYLEVBQWdDO0FBQzlCLFNBQUsyRixNQUFMLElBQWdCM2lCLFFBQVEsSUFBeEI7QUFDQSxTQUFLMmlCLFNBQVMsQ0FBZCxJQUFvQjNpQixVQUFVLENBQTlCO0FBQ0QsR0FIRCxNQUdPO0FBQ0x5bUIsc0JBQWtCLElBQWxCLEVBQXdCem1CLEtBQXhCLEVBQStCMmlCLE1BQS9CLEVBQXVDLElBQXZDO0FBQ0Q7QUFDRCxTQUFPQSxTQUFTLENBQWhCO0FBQ0QsQ0FYRDs7QUFhQTlGLE9BQU8xWixTQUFQLENBQWlCbWtCLFlBQWpCLEdBQWdDLFNBQVNBLFlBQVQsQ0FBdUJ0bkIsS0FBdkIsRUFBOEIyaUIsTUFBOUIsRUFBc0NxQyxRQUF0QyxFQUFnRDtBQUM5RWhsQixVQUFRLENBQUNBLEtBQVQ7QUFDQTJpQixXQUFTQSxTQUFTLENBQWxCO0FBQ0EsTUFBSSxDQUFDcUMsUUFBTCxFQUFlbUIsU0FBUyxJQUFULEVBQWVubUIsS0FBZixFQUFzQjJpQixNQUF0QixFQUE4QixDQUE5QixFQUFpQyxNQUFqQyxFQUF5QyxDQUFDLE1BQTFDO0FBQ2YsTUFBSTlGLE9BQU9HLG1CQUFYLEVBQWdDO0FBQzlCLFNBQUsyRixNQUFMLElBQWdCM2lCLFVBQVUsQ0FBMUI7QUFDQSxTQUFLMmlCLFNBQVMsQ0FBZCxJQUFvQjNpQixRQUFRLElBQTVCO0FBQ0QsR0FIRCxNQUdPO0FBQ0x5bUIsc0JBQWtCLElBQWxCLEVBQXdCem1CLEtBQXhCLEVBQStCMmlCLE1BQS9CLEVBQXVDLEtBQXZDO0FBQ0Q7QUFDRCxTQUFPQSxTQUFTLENBQWhCO0FBQ0QsQ0FYRDs7QUFhQTlGLE9BQU8xWixTQUFQLENBQWlCb2tCLFlBQWpCLEdBQWdDLFNBQVNBLFlBQVQsQ0FBdUJ2bkIsS0FBdkIsRUFBOEIyaUIsTUFBOUIsRUFBc0NxQyxRQUF0QyxFQUFnRDtBQUM5RWhsQixVQUFRLENBQUNBLEtBQVQ7QUFDQTJpQixXQUFTQSxTQUFTLENBQWxCO0FBQ0EsTUFBSSxDQUFDcUMsUUFBTCxFQUFlbUIsU0FBUyxJQUFULEVBQWVubUIsS0FBZixFQUFzQjJpQixNQUF0QixFQUE4QixDQUE5QixFQUFpQyxVQUFqQyxFQUE2QyxDQUFDLFVBQTlDO0FBQ2YsTUFBSTlGLE9BQU9HLG1CQUFYLEVBQWdDO0FBQzlCLFNBQUsyRixNQUFMLElBQWdCM2lCLFFBQVEsSUFBeEI7QUFDQSxTQUFLMmlCLFNBQVMsQ0FBZCxJQUFvQjNpQixVQUFVLENBQTlCO0FBQ0EsU0FBSzJpQixTQUFTLENBQWQsSUFBb0IzaUIsVUFBVSxFQUE5QjtBQUNBLFNBQUsyaUIsU0FBUyxDQUFkLElBQW9CM2lCLFVBQVUsRUFBOUI7QUFDRCxHQUxELE1BS087QUFDTDZtQixzQkFBa0IsSUFBbEIsRUFBd0I3bUIsS0FBeEIsRUFBK0IyaUIsTUFBL0IsRUFBdUMsSUFBdkM7QUFDRDtBQUNELFNBQU9BLFNBQVMsQ0FBaEI7QUFDRCxDQWJEOztBQWVBOUYsT0FBTzFaLFNBQVAsQ0FBaUJxa0IsWUFBakIsR0FBZ0MsU0FBU0EsWUFBVCxDQUF1QnhuQixLQUF2QixFQUE4QjJpQixNQUE5QixFQUFzQ3FDLFFBQXRDLEVBQWdEO0FBQzlFaGxCLFVBQVEsQ0FBQ0EsS0FBVDtBQUNBMmlCLFdBQVNBLFNBQVMsQ0FBbEI7QUFDQSxNQUFJLENBQUNxQyxRQUFMLEVBQWVtQixTQUFTLElBQVQsRUFBZW5tQixLQUFmLEVBQXNCMmlCLE1BQXRCLEVBQThCLENBQTlCLEVBQWlDLFVBQWpDLEVBQTZDLENBQUMsVUFBOUM7QUFDZixNQUFJM2lCLFFBQVEsQ0FBWixFQUFlQSxRQUFRLGFBQWFBLEtBQWIsR0FBcUIsQ0FBN0I7QUFDZixNQUFJNmMsT0FBT0csbUJBQVgsRUFBZ0M7QUFDOUIsU0FBSzJGLE1BQUwsSUFBZ0IzaUIsVUFBVSxFQUExQjtBQUNBLFNBQUsyaUIsU0FBUyxDQUFkLElBQW9CM2lCLFVBQVUsRUFBOUI7QUFDQSxTQUFLMmlCLFNBQVMsQ0FBZCxJQUFvQjNpQixVQUFVLENBQTlCO0FBQ0EsU0FBSzJpQixTQUFTLENBQWQsSUFBb0IzaUIsUUFBUSxJQUE1QjtBQUNELEdBTEQsTUFLTztBQUNMNm1CLHNCQUFrQixJQUFsQixFQUF3QjdtQixLQUF4QixFQUErQjJpQixNQUEvQixFQUF1QyxLQUF2QztBQUNEO0FBQ0QsU0FBT0EsU0FBUyxDQUFoQjtBQUNELENBZEQ7O0FBZ0JBLFNBQVM4RSxZQUFULENBQXVCdEgsR0FBdkIsRUFBNEJuZ0IsS0FBNUIsRUFBbUMyaUIsTUFBbkMsRUFBMkNtQyxHQUEzQyxFQUFnRHZELEdBQWhELEVBQXFEeEIsR0FBckQsRUFBMEQ7QUFDeEQsTUFBSTRDLFNBQVNtQyxHQUFULEdBQWUzRSxJQUFJOWdCLE1BQXZCLEVBQStCLE1BQU0sSUFBSW1lLFVBQUosQ0FBZSxvQkFBZixDQUFOO0FBQy9CLE1BQUltRixTQUFTLENBQWIsRUFBZ0IsTUFBTSxJQUFJbkYsVUFBSixDQUFlLG9CQUFmLENBQU47QUFDakI7O0FBRUQsU0FBU2tLLFVBQVQsQ0FBcUJ2SCxHQUFyQixFQUEwQm5nQixLQUExQixFQUFpQzJpQixNQUFqQyxFQUF5QytELFlBQXpDLEVBQXVEMUIsUUFBdkQsRUFBaUU7QUFDL0QsTUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDYnlDLGlCQUFhdEgsR0FBYixFQUFrQm5nQixLQUFsQixFQUF5QjJpQixNQUF6QixFQUFpQyxDQUFqQyxFQUFvQyxzQkFBcEMsRUFBNEQsQ0FBQyxzQkFBN0Q7QUFDRDtBQUNEL0YsVUFBUW9DLEtBQVIsQ0FBY21CLEdBQWQsRUFBbUJuZ0IsS0FBbkIsRUFBMEIyaUIsTUFBMUIsRUFBa0MrRCxZQUFsQyxFQUFnRCxFQUFoRCxFQUFvRCxDQUFwRDtBQUNBLFNBQU8vRCxTQUFTLENBQWhCO0FBQ0Q7O0FBRUQ5RixPQUFPMVosU0FBUCxDQUFpQndrQixZQUFqQixHQUFnQyxTQUFTQSxZQUFULENBQXVCM25CLEtBQXZCLEVBQThCMmlCLE1BQTlCLEVBQXNDcUMsUUFBdEMsRUFBZ0Q7QUFDOUUsU0FBTzBDLFdBQVcsSUFBWCxFQUFpQjFuQixLQUFqQixFQUF3QjJpQixNQUF4QixFQUFnQyxJQUFoQyxFQUFzQ3FDLFFBQXRDLENBQVA7QUFDRCxDQUZEOztBQUlBbkksT0FBTzFaLFNBQVAsQ0FBaUJ5a0IsWUFBakIsR0FBZ0MsU0FBU0EsWUFBVCxDQUF1QjVuQixLQUF2QixFQUE4QjJpQixNQUE5QixFQUFzQ3FDLFFBQXRDLEVBQWdEO0FBQzlFLFNBQU8wQyxXQUFXLElBQVgsRUFBaUIxbkIsS0FBakIsRUFBd0IyaUIsTUFBeEIsRUFBZ0MsS0FBaEMsRUFBdUNxQyxRQUF2QyxDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxTQUFTNkMsV0FBVCxDQUFzQjFILEdBQXRCLEVBQTJCbmdCLEtBQTNCLEVBQWtDMmlCLE1BQWxDLEVBQTBDK0QsWUFBMUMsRUFBd0QxQixRQUF4RCxFQUFrRTtBQUNoRSxNQUFJLENBQUNBLFFBQUwsRUFBZTtBQUNieUMsaUJBQWF0SCxHQUFiLEVBQWtCbmdCLEtBQWxCLEVBQXlCMmlCLE1BQXpCLEVBQWlDLENBQWpDLEVBQW9DLHVCQUFwQyxFQUE2RCxDQUFDLHVCQUE5RDtBQUNEO0FBQ0QvRixVQUFRb0MsS0FBUixDQUFjbUIsR0FBZCxFQUFtQm5nQixLQUFuQixFQUEwQjJpQixNQUExQixFQUFrQytELFlBQWxDLEVBQWdELEVBQWhELEVBQW9ELENBQXBEO0FBQ0EsU0FBTy9ELFNBQVMsQ0FBaEI7QUFDRDs7QUFFRDlGLE9BQU8xWixTQUFQLENBQWlCMmtCLGFBQWpCLEdBQWlDLFNBQVNBLGFBQVQsQ0FBd0I5bkIsS0FBeEIsRUFBK0IyaUIsTUFBL0IsRUFBdUNxQyxRQUF2QyxFQUFpRDtBQUNoRixTQUFPNkMsWUFBWSxJQUFaLEVBQWtCN25CLEtBQWxCLEVBQXlCMmlCLE1BQXpCLEVBQWlDLElBQWpDLEVBQXVDcUMsUUFBdkMsQ0FBUDtBQUNELENBRkQ7O0FBSUFuSSxPQUFPMVosU0FBUCxDQUFpQjRrQixhQUFqQixHQUFpQyxTQUFTQSxhQUFULENBQXdCL25CLEtBQXhCLEVBQStCMmlCLE1BQS9CLEVBQXVDcUMsUUFBdkMsRUFBaUQ7QUFDaEYsU0FBTzZDLFlBQVksSUFBWixFQUFrQjduQixLQUFsQixFQUF5QjJpQixNQUF6QixFQUFpQyxLQUFqQyxFQUF3Q3FDLFFBQXhDLENBQVA7QUFDRCxDQUZEOztBQUlBO0FBQ0FuSSxPQUFPMVosU0FBUCxDQUFpQm1jLElBQWpCLEdBQXdCLFNBQVNBLElBQVQsQ0FBZWtDLE1BQWYsRUFBdUJ3RyxXQUF2QixFQUFvQ2xuQixLQUFwQyxFQUEyQ21KLEdBQTNDLEVBQWdEO0FBQ3RFLE1BQUksQ0FBQ25KLEtBQUwsRUFBWUEsUUFBUSxDQUFSO0FBQ1osTUFBSSxDQUFDbUosR0FBRCxJQUFRQSxRQUFRLENBQXBCLEVBQXVCQSxNQUFNLEtBQUs1SyxNQUFYO0FBQ3ZCLE1BQUkyb0IsZUFBZXhHLE9BQU9uaUIsTUFBMUIsRUFBa0Myb0IsY0FBY3hHLE9BQU9uaUIsTUFBckI7QUFDbEMsTUFBSSxDQUFDMm9CLFdBQUwsRUFBa0JBLGNBQWMsQ0FBZDtBQUNsQixNQUFJL2QsTUFBTSxDQUFOLElBQVdBLE1BQU1uSixLQUFyQixFQUE0Qm1KLE1BQU1uSixLQUFOOztBQUU1QjtBQUNBLE1BQUltSixRQUFRbkosS0FBWixFQUFtQixPQUFPLENBQVA7QUFDbkIsTUFBSTBnQixPQUFPbmlCLE1BQVAsS0FBa0IsQ0FBbEIsSUFBdUIsS0FBS0EsTUFBTCxLQUFnQixDQUEzQyxFQUE4QyxPQUFPLENBQVA7O0FBRTlDO0FBQ0EsTUFBSTJvQixjQUFjLENBQWxCLEVBQXFCO0FBQ25CLFVBQU0sSUFBSXhLLFVBQUosQ0FBZSwyQkFBZixDQUFOO0FBQ0Q7QUFDRCxNQUFJMWMsUUFBUSxDQUFSLElBQWFBLFNBQVMsS0FBS3pCLE1BQS9CLEVBQXVDLE1BQU0sSUFBSW1lLFVBQUosQ0FBZSwyQkFBZixDQUFOO0FBQ3ZDLE1BQUl2VCxNQUFNLENBQVYsRUFBYSxNQUFNLElBQUl1VCxVQUFKLENBQWUseUJBQWYsQ0FBTjs7QUFFYjtBQUNBLE1BQUl2VCxNQUFNLEtBQUs1SyxNQUFmLEVBQXVCNEssTUFBTSxLQUFLNUssTUFBWDtBQUN2QixNQUFJbWlCLE9BQU9uaUIsTUFBUCxHQUFnQjJvQixXQUFoQixHQUE4Qi9kLE1BQU1uSixLQUF4QyxFQUErQztBQUM3Q21KLFVBQU11WCxPQUFPbmlCLE1BQVAsR0FBZ0Iyb0IsV0FBaEIsR0FBOEJsbkIsS0FBcEM7QUFDRDs7QUFFRCxNQUFJMGEsTUFBTXZSLE1BQU1uSixLQUFoQjtBQUNBLE1BQUkxQixDQUFKOztBQUVBLE1BQUksU0FBU29pQixNQUFULElBQW1CMWdCLFFBQVFrbkIsV0FBM0IsSUFBMENBLGNBQWMvZCxHQUE1RCxFQUFpRTtBQUMvRDtBQUNBLFNBQUs3SyxJQUFJb2MsTUFBTSxDQUFmLEVBQWtCcGMsS0FBSyxDQUF2QixFQUEwQixFQUFFQSxDQUE1QixFQUErQjtBQUM3Qm9pQixhQUFPcGlCLElBQUk0b0IsV0FBWCxJQUEwQixLQUFLNW9CLElBQUkwQixLQUFULENBQTFCO0FBQ0Q7QUFDRixHQUxELE1BS08sSUFBSTBhLE1BQU0sSUFBTixJQUFjLENBQUNxQixPQUFPRyxtQkFBMUIsRUFBK0M7QUFDcEQ7QUFDQSxTQUFLNWQsSUFBSSxDQUFULEVBQVlBLElBQUlvYyxHQUFoQixFQUFxQixFQUFFcGMsQ0FBdkIsRUFBMEI7QUFDeEJvaUIsYUFBT3BpQixJQUFJNG9CLFdBQVgsSUFBMEIsS0FBSzVvQixJQUFJMEIsS0FBVCxDQUExQjtBQUNEO0FBQ0YsR0FMTSxNQUtBO0FBQ0x3YSxlQUFXblksU0FBWCxDQUFxQmdWLEdBQXJCLENBQXlCeFgsSUFBekIsQ0FDRTZnQixNQURGLEVBRUUsS0FBS25FLFFBQUwsQ0FBY3ZjLEtBQWQsRUFBcUJBLFFBQVEwYSxHQUE3QixDQUZGLEVBR0V3TSxXQUhGO0FBS0Q7O0FBRUQsU0FBT3hNLEdBQVA7QUFDRCxDQTlDRDs7QUFnREE7QUFDQTtBQUNBO0FBQ0E7QUFDQXFCLE9BQU8xWixTQUFQLENBQWlCdWIsSUFBakIsR0FBd0IsU0FBU0EsSUFBVCxDQUFlb0QsR0FBZixFQUFvQmhoQixLQUFwQixFQUEyQm1KLEdBQTNCLEVBQWdDMFUsUUFBaEMsRUFBMEM7QUFDaEU7QUFDQSxNQUFJLE9BQU9tRCxHQUFQLEtBQWUsUUFBbkIsRUFBNkI7QUFDM0IsUUFBSSxPQUFPaGhCLEtBQVAsS0FBaUIsUUFBckIsRUFBK0I7QUFDN0I2ZCxpQkFBVzdkLEtBQVg7QUFDQUEsY0FBUSxDQUFSO0FBQ0FtSixZQUFNLEtBQUs1SyxNQUFYO0FBQ0QsS0FKRCxNQUlPLElBQUksT0FBTzRLLEdBQVAsS0FBZSxRQUFuQixFQUE2QjtBQUNsQzBVLGlCQUFXMVUsR0FBWDtBQUNBQSxZQUFNLEtBQUs1SyxNQUFYO0FBQ0Q7QUFDRCxRQUFJeWlCLElBQUl6aUIsTUFBSixLQUFlLENBQW5CLEVBQXNCO0FBQ3BCLFVBQUlrYyxPQUFPdUcsSUFBSXJHLFVBQUosQ0FBZSxDQUFmLENBQVg7QUFDQSxVQUFJRixPQUFPLEdBQVgsRUFBZ0I7QUFDZHVHLGNBQU12RyxJQUFOO0FBQ0Q7QUFDRjtBQUNELFFBQUlvRCxhQUFhbGdCLFNBQWIsSUFBMEIsT0FBT2tnQixRQUFQLEtBQW9CLFFBQWxELEVBQTREO0FBQzFELFlBQU0sSUFBSWpkLFNBQUosQ0FBYywyQkFBZCxDQUFOO0FBQ0Q7QUFDRCxRQUFJLE9BQU9pZCxRQUFQLEtBQW9CLFFBQXBCLElBQWdDLENBQUM5QixPQUFPaUMsVUFBUCxDQUFrQkgsUUFBbEIsQ0FBckMsRUFBa0U7QUFDaEUsWUFBTSxJQUFJamQsU0FBSixDQUFjLHVCQUF1QmlkLFFBQXJDLENBQU47QUFDRDtBQUNGLEdBckJELE1BcUJPLElBQUksT0FBT21ELEdBQVAsS0FBZSxRQUFuQixFQUE2QjtBQUNsQ0EsVUFBTUEsTUFBTSxHQUFaO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJaGhCLFFBQVEsQ0FBUixJQUFhLEtBQUt6QixNQUFMLEdBQWN5QixLQUEzQixJQUFvQyxLQUFLekIsTUFBTCxHQUFjNEssR0FBdEQsRUFBMkQ7QUFDekQsVUFBTSxJQUFJdVQsVUFBSixDQUFlLG9CQUFmLENBQU47QUFDRDs7QUFFRCxNQUFJdlQsT0FBT25KLEtBQVgsRUFBa0I7QUFDaEIsV0FBTyxJQUFQO0FBQ0Q7O0FBRURBLFVBQVFBLFVBQVUsQ0FBbEI7QUFDQW1KLFFBQU1BLFFBQVF4TCxTQUFSLEdBQW9CLEtBQUtZLE1BQXpCLEdBQWtDNEssUUFBUSxDQUFoRDs7QUFFQSxNQUFJLENBQUM2WCxHQUFMLEVBQVVBLE1BQU0sQ0FBTjs7QUFFVixNQUFJMWlCLENBQUo7QUFDQSxNQUFJLE9BQU8waUIsR0FBUCxLQUFlLFFBQW5CLEVBQTZCO0FBQzNCLFNBQUsxaUIsSUFBSTBCLEtBQVQsRUFBZ0IxQixJQUFJNkssR0FBcEIsRUFBeUIsRUFBRTdLLENBQTNCLEVBQThCO0FBQzVCLFdBQUtBLENBQUwsSUFBVTBpQixHQUFWO0FBQ0Q7QUFDRixHQUpELE1BSU87QUFDTCxRQUFJNEMsUUFBUTdILE9BQU93QyxRQUFQLENBQWdCeUMsR0FBaEIsSUFDUkEsR0FEUSxHQUVSeEIsWUFBWSxJQUFJekQsTUFBSixDQUFXaUYsR0FBWCxFQUFnQm5ELFFBQWhCLEVBQTBCaGEsUUFBMUIsRUFBWixDQUZKO0FBR0EsUUFBSTZXLE1BQU1rSixNQUFNcmxCLE1BQWhCO0FBQ0EsU0FBS0QsSUFBSSxDQUFULEVBQVlBLElBQUk2SyxNQUFNbkosS0FBdEIsRUFBNkIsRUFBRTFCLENBQS9CLEVBQWtDO0FBQ2hDLFdBQUtBLElBQUkwQixLQUFULElBQWtCNGpCLE1BQU10bEIsSUFBSW9jLEdBQVYsQ0FBbEI7QUFDRDtBQUNGOztBQUVELFNBQU8sSUFBUDtBQUNELENBekREOztBQTJEQTtBQUNBOztBQUVBLElBQUl5TSxvQkFBb0Isb0JBQXhCOztBQUVBLFNBQVNDLFdBQVQsQ0FBc0I1RyxHQUF0QixFQUEyQjtBQUN6QjtBQUNBQSxRQUFNNkcsV0FBVzdHLEdBQVgsRUFBZ0JsaEIsT0FBaEIsQ0FBd0I2bkIsaUJBQXhCLEVBQTJDLEVBQTNDLENBQU47QUFDQTtBQUNBLE1BQUkzRyxJQUFJamlCLE1BQUosR0FBYSxDQUFqQixFQUFvQixPQUFPLEVBQVA7QUFDcEI7QUFDQSxTQUFPaWlCLElBQUlqaUIsTUFBSixHQUFhLENBQWIsS0FBbUIsQ0FBMUIsRUFBNkI7QUFDM0JpaUIsVUFBTUEsTUFBTSxHQUFaO0FBQ0Q7QUFDRCxTQUFPQSxHQUFQO0FBQ0Q7O0FBRUQsU0FBUzZHLFVBQVQsQ0FBcUI3RyxHQUFyQixFQUEwQjtBQUN4QixNQUFJQSxJQUFJOEcsSUFBUixFQUFjLE9BQU85RyxJQUFJOEcsSUFBSixFQUFQO0FBQ2QsU0FBTzlHLElBQUlsaEIsT0FBSixDQUFZLFlBQVosRUFBMEIsRUFBMUIsQ0FBUDtBQUNEOztBQUVELFNBQVNxa0IsS0FBVCxDQUFnQnpELENBQWhCLEVBQW1CO0FBQ2pCLE1BQUlBLElBQUksRUFBUixFQUFZLE9BQU8sTUFBTUEsRUFBRXJjLFFBQUYsQ0FBVyxFQUFYLENBQWI7QUFDWixTQUFPcWMsRUFBRXJjLFFBQUYsQ0FBVyxFQUFYLENBQVA7QUFDRDs7QUFFRCxTQUFTMmIsV0FBVCxDQUFzQnBOLE1BQXRCLEVBQThCbVYsS0FBOUIsRUFBcUM7QUFDbkNBLFVBQVFBLFNBQVNDLFFBQWpCO0FBQ0EsTUFBSXpFLFNBQUo7QUFDQSxNQUFJeGtCLFNBQVM2VCxPQUFPN1QsTUFBcEI7QUFDQSxNQUFJa3BCLGdCQUFnQixJQUFwQjtBQUNBLE1BQUk3RCxRQUFRLEVBQVo7O0FBRUEsT0FBSyxJQUFJdGxCLElBQUksQ0FBYixFQUFnQkEsSUFBSUMsTUFBcEIsRUFBNEIsRUFBRUQsQ0FBOUIsRUFBaUM7QUFDL0J5a0IsZ0JBQVkzUSxPQUFPdUksVUFBUCxDQUFrQnJjLENBQWxCLENBQVo7O0FBRUE7QUFDQSxRQUFJeWtCLFlBQVksTUFBWixJQUFzQkEsWUFBWSxNQUF0QyxFQUE4QztBQUM1QztBQUNBLFVBQUksQ0FBQzBFLGFBQUwsRUFBb0I7QUFDbEI7QUFDQSxZQUFJMUUsWUFBWSxNQUFoQixFQUF3QjtBQUN0QjtBQUNBLGNBQUksQ0FBQ3dFLFNBQVMsQ0FBVixJQUFlLENBQUMsQ0FBcEIsRUFBdUIzRCxNQUFNeGtCLElBQU4sQ0FBVyxJQUFYLEVBQWlCLElBQWpCLEVBQXVCLElBQXZCO0FBQ3ZCO0FBQ0QsU0FKRCxNQUlPLElBQUlkLElBQUksQ0FBSixLQUFVQyxNQUFkLEVBQXNCO0FBQzNCO0FBQ0EsY0FBSSxDQUFDZ3BCLFNBQVMsQ0FBVixJQUFlLENBQUMsQ0FBcEIsRUFBdUIzRCxNQUFNeGtCLElBQU4sQ0FBVyxJQUFYLEVBQWlCLElBQWpCLEVBQXVCLElBQXZCO0FBQ3ZCO0FBQ0Q7O0FBRUQ7QUFDQXFvQix3QkFBZ0IxRSxTQUFoQjs7QUFFQTtBQUNEOztBQUVEO0FBQ0EsVUFBSUEsWUFBWSxNQUFoQixFQUF3QjtBQUN0QixZQUFJLENBQUN3RSxTQUFTLENBQVYsSUFBZSxDQUFDLENBQXBCLEVBQXVCM0QsTUFBTXhrQixJQUFOLENBQVcsSUFBWCxFQUFpQixJQUFqQixFQUF1QixJQUF2QjtBQUN2QnFvQix3QkFBZ0IxRSxTQUFoQjtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQUEsa0JBQVksQ0FBQzBFLGdCQUFnQixNQUFoQixJQUEwQixFQUExQixHQUErQjFFLFlBQVksTUFBNUMsSUFBc0QsT0FBbEU7QUFDRCxLQTdCRCxNQTZCTyxJQUFJMEUsYUFBSixFQUFtQjtBQUN4QjtBQUNBLFVBQUksQ0FBQ0YsU0FBUyxDQUFWLElBQWUsQ0FBQyxDQUFwQixFQUF1QjNELE1BQU14a0IsSUFBTixDQUFXLElBQVgsRUFBaUIsSUFBakIsRUFBdUIsSUFBdkI7QUFDeEI7O0FBRURxb0Isb0JBQWdCLElBQWhCOztBQUVBO0FBQ0EsUUFBSTFFLFlBQVksSUFBaEIsRUFBc0I7QUFDcEIsVUFBSSxDQUFDd0UsU0FBUyxDQUFWLElBQWUsQ0FBbkIsRUFBc0I7QUFDdEIzRCxZQUFNeGtCLElBQU4sQ0FBVzJqQixTQUFYO0FBQ0QsS0FIRCxNQUdPLElBQUlBLFlBQVksS0FBaEIsRUFBdUI7QUFDNUIsVUFBSSxDQUFDd0UsU0FBUyxDQUFWLElBQWUsQ0FBbkIsRUFBc0I7QUFDdEIzRCxZQUFNeGtCLElBQU4sQ0FDRTJqQixhQUFhLEdBQWIsR0FBbUIsSUFEckIsRUFFRUEsWUFBWSxJQUFaLEdBQW1CLElBRnJCO0FBSUQsS0FOTSxNQU1BLElBQUlBLFlBQVksT0FBaEIsRUFBeUI7QUFDOUIsVUFBSSxDQUFDd0UsU0FBUyxDQUFWLElBQWUsQ0FBbkIsRUFBc0I7QUFDdEIzRCxZQUFNeGtCLElBQU4sQ0FDRTJqQixhQUFhLEdBQWIsR0FBbUIsSUFEckIsRUFFRUEsYUFBYSxHQUFiLEdBQW1CLElBQW5CLEdBQTBCLElBRjVCLEVBR0VBLFlBQVksSUFBWixHQUFtQixJQUhyQjtBQUtELEtBUE0sTUFPQSxJQUFJQSxZQUFZLFFBQWhCLEVBQTBCO0FBQy9CLFVBQUksQ0FBQ3dFLFNBQVMsQ0FBVixJQUFlLENBQW5CLEVBQXNCO0FBQ3RCM0QsWUFBTXhrQixJQUFOLENBQ0UyakIsYUFBYSxJQUFiLEdBQW9CLElBRHRCLEVBRUVBLGFBQWEsR0FBYixHQUFtQixJQUFuQixHQUEwQixJQUY1QixFQUdFQSxhQUFhLEdBQWIsR0FBbUIsSUFBbkIsR0FBMEIsSUFINUIsRUFJRUEsWUFBWSxJQUFaLEdBQW1CLElBSnJCO0FBTUQsS0FSTSxNQVFBO0FBQ0wsWUFBTSxJQUFJN2lCLEtBQUosQ0FBVSxvQkFBVixDQUFOO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPMGpCLEtBQVA7QUFDRDs7QUFFRCxTQUFTdkIsWUFBVCxDQUF1QjdCLEdBQXZCLEVBQTRCO0FBQzFCLE1BQUlrSCxZQUFZLEVBQWhCO0FBQ0EsT0FBSyxJQUFJcHBCLElBQUksQ0FBYixFQUFnQkEsSUFBSWtpQixJQUFJamlCLE1BQXhCLEVBQWdDLEVBQUVELENBQWxDLEVBQXFDO0FBQ25DO0FBQ0FvcEIsY0FBVXRvQixJQUFWLENBQWVvaEIsSUFBSTdGLFVBQUosQ0FBZXJjLENBQWYsSUFBb0IsSUFBbkM7QUFDRDtBQUNELFNBQU9vcEIsU0FBUDtBQUNEOztBQUVELFNBQVNqRixjQUFULENBQXlCakMsR0FBekIsRUFBOEIrRyxLQUE5QixFQUFxQztBQUNuQyxNQUFJSSxDQUFKLEVBQU9DLEVBQVAsRUFBV0MsRUFBWDtBQUNBLE1BQUlILFlBQVksRUFBaEI7QUFDQSxPQUFLLElBQUlwcEIsSUFBSSxDQUFiLEVBQWdCQSxJQUFJa2lCLElBQUlqaUIsTUFBeEIsRUFBZ0MsRUFBRUQsQ0FBbEMsRUFBcUM7QUFDbkMsUUFBSSxDQUFDaXBCLFNBQVMsQ0FBVixJQUFlLENBQW5CLEVBQXNCOztBQUV0QkksUUFBSW5ILElBQUk3RixVQUFKLENBQWVyYyxDQUFmLENBQUo7QUFDQXNwQixTQUFLRCxLQUFLLENBQVY7QUFDQUUsU0FBS0YsSUFBSSxHQUFUO0FBQ0FELGNBQVV0b0IsSUFBVixDQUFleW9CLEVBQWY7QUFDQUgsY0FBVXRvQixJQUFWLENBQWV3b0IsRUFBZjtBQUNEOztBQUVELFNBQU9GLFNBQVA7QUFDRDs7QUFFRCxTQUFTakksYUFBVCxDQUF3QmUsR0FBeEIsRUFBNkI7QUFDM0IsU0FBTzVFLE9BQU96QixXQUFQLENBQW1CaU4sWUFBWTVHLEdBQVosQ0FBbkIsQ0FBUDtBQUNEOztBQUVELFNBQVMyQixVQUFULENBQXFCcGEsR0FBckIsRUFBMEIrZixHQUExQixFQUErQmpHLE1BQS9CLEVBQXVDdGpCLE1BQXZDLEVBQStDO0FBQzdDLE9BQUssSUFBSUQsSUFBSSxDQUFiLEVBQWdCQSxJQUFJQyxNQUFwQixFQUE0QixFQUFFRCxDQUE5QixFQUFpQztBQUMvQixRQUFLQSxJQUFJdWpCLE1BQUosSUFBY2lHLElBQUl2cEIsTUFBbkIsSUFBK0JELEtBQUt5SixJQUFJeEosTUFBNUMsRUFBcUQ7QUFDckR1cEIsUUFBSXhwQixJQUFJdWpCLE1BQVIsSUFBa0I5WixJQUFJekosQ0FBSixDQUFsQjtBQUNEO0FBQ0QsU0FBT0EsQ0FBUDtBQUNEOztBQUVELFNBQVNvZ0IsS0FBVCxDQUFnQnNDLEdBQWhCLEVBQXFCO0FBQ25CLFNBQU9BLFFBQVFBLEdBQWYsQ0FEbUIsQ0FDQTtBQUNwQixDOzs7Ozs7Ozs7O0FDNXZERDs7OztBQUlBO0FBQ0F2SSxPQUFPSSxPQUFQLEdBQWlCLFVBQVNrUCxZQUFULEVBQXVCO0FBQ3ZDLEtBQUl4bUIsT0FBTyxFQUFYOztBQUVBO0FBQ0FBLE1BQUtzQyxRQUFMLEdBQWdCLFNBQVNBLFFBQVQsR0FBb0I7QUFDbkMsU0FBTyxLQUFLNEksR0FBTCxDQUFTLFVBQVV1YixJQUFWLEVBQWdCO0FBQy9CLE9BQUk3WixVQUFVOFosdUJBQXVCRCxJQUF2QixFQUE2QkQsWUFBN0IsQ0FBZDtBQUNBLE9BQUdDLEtBQUssQ0FBTCxDQUFILEVBQVk7QUFDWCxXQUFPLFlBQVlBLEtBQUssQ0FBTCxDQUFaLEdBQXNCLEdBQXRCLEdBQTRCN1osT0FBNUIsR0FBc0MsR0FBN0M7QUFDQSxJQUZELE1BRU87QUFDTixXQUFPQSxPQUFQO0FBQ0E7QUFDRCxHQVBNLEVBT0ozTyxJQVBJLENBT0MsRUFQRCxDQUFQO0FBUUEsRUFURDs7QUFXQTtBQUNBK0IsTUFBS2pELENBQUwsR0FBUyxVQUFTNHBCLE9BQVQsRUFBa0JDLFVBQWxCLEVBQThCO0FBQ3RDLE1BQUcsT0FBT0QsT0FBUCxLQUFtQixRQUF0QixFQUNDQSxVQUFVLENBQUMsQ0FBQyxJQUFELEVBQU9BLE9BQVAsRUFBZ0IsRUFBaEIsQ0FBRCxDQUFWO0FBQ0QsTUFBSUUseUJBQXlCLEVBQTdCO0FBQ0EsT0FBSSxJQUFJOXBCLElBQUksQ0FBWixFQUFlQSxJQUFJLEtBQUtDLE1BQXhCLEVBQWdDRCxHQUFoQyxFQUFxQztBQUNwQyxPQUFJYSxLQUFLLEtBQUtiLENBQUwsRUFBUSxDQUFSLENBQVQ7QUFDQSxPQUFHLE9BQU9hLEVBQVAsS0FBYyxRQUFqQixFQUNDaXBCLHVCQUF1QmpwQixFQUF2QixJQUE2QixJQUE3QjtBQUNEO0FBQ0QsT0FBSWIsSUFBSSxDQUFSLEVBQVdBLElBQUk0cEIsUUFBUTNwQixNQUF2QixFQUErQkQsR0FBL0IsRUFBb0M7QUFDbkMsT0FBSTBwQixPQUFPRSxRQUFRNXBCLENBQVIsQ0FBWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBRyxPQUFPMHBCLEtBQUssQ0FBTCxDQUFQLEtBQW1CLFFBQW5CLElBQStCLENBQUNJLHVCQUF1QkosS0FBSyxDQUFMLENBQXZCLENBQW5DLEVBQW9FO0FBQ25FLFFBQUdHLGNBQWMsQ0FBQ0gsS0FBSyxDQUFMLENBQWxCLEVBQTJCO0FBQzFCQSxVQUFLLENBQUwsSUFBVUcsVUFBVjtBQUNBLEtBRkQsTUFFTyxJQUFHQSxVQUFILEVBQWU7QUFDckJILFVBQUssQ0FBTCxJQUFVLE1BQU1BLEtBQUssQ0FBTCxDQUFOLEdBQWdCLFNBQWhCLEdBQTRCRyxVQUE1QixHQUF5QyxHQUFuRDtBQUNBO0FBQ0Q1bUIsU0FBS25DLElBQUwsQ0FBVTRvQixJQUFWO0FBQ0E7QUFDRDtBQUNELEVBeEJEO0FBeUJBLFFBQU96bUIsSUFBUDtBQUNBLENBMUNEOztBQTRDQSxTQUFTMG1CLHNCQUFULENBQWdDRCxJQUFoQyxFQUFzQ0QsWUFBdEMsRUFBb0Q7QUFDbkQsS0FBSTVaLFVBQVU2WixLQUFLLENBQUwsS0FBVyxFQUF6QjtBQUNBLEtBQUlLLGFBQWFMLEtBQUssQ0FBTCxDQUFqQjtBQUNBLEtBQUksQ0FBQ0ssVUFBTCxFQUFpQjtBQUNoQixTQUFPbGEsT0FBUDtBQUNBOztBQUVELEtBQUk0WixZQUFKLEVBQWtCO0FBQ2pCLE1BQUlPLGdCQUFnQkMsVUFBVUYsVUFBVixDQUFwQjtBQUNBLE1BQUlHLGFBQWFILFdBQVdJLE9BQVgsQ0FBbUJoYyxHQUFuQixDQUF1QixVQUFVbUQsTUFBVixFQUFrQjtBQUN6RCxVQUFPLG1CQUFtQnlZLFdBQVdLLFVBQTlCLEdBQTJDOVksTUFBM0MsR0FBb0QsS0FBM0Q7QUFDQSxHQUZnQixDQUFqQjs7QUFJQSxTQUFPLENBQUN6QixPQUFELEVBQVU3QixNQUFWLENBQWlCa2MsVUFBakIsRUFBNkJsYyxNQUE3QixDQUFvQyxDQUFDZ2MsYUFBRCxDQUFwQyxFQUFxRDlvQixJQUFyRCxDQUEwRCxJQUExRCxDQUFQO0FBQ0E7O0FBRUQsUUFBTyxDQUFDMk8sT0FBRCxFQUFVM08sSUFBVixDQUFlLElBQWYsQ0FBUDtBQUNBOztBQUVEO0FBQ0EsU0FBUytvQixTQUFULENBQW1CSSxTQUFuQixFQUE4QjtBQUM1QixLQUFJL00sU0FBUyxJQUFJRyxNQUFKLENBQVd2VyxLQUFLQyxTQUFMLENBQWVrakIsU0FBZixDQUFYLEVBQXNDOWtCLFFBQXRDLENBQStDLFFBQS9DLENBQWI7QUFDQSxLQUFJMEIsT0FBTyxpRUFBaUVxVyxNQUE1RTs7QUFFQSxRQUFPLFNBQVNyVyxJQUFULEdBQWdCLEtBQXZCO0FBQ0QsQzs7Ozs7Ozs7OztBQzFFRHNULFFBQVEwSSxJQUFSLEdBQWUsVUFBVTlDLE1BQVYsRUFBa0JvRCxNQUFsQixFQUEwQitHLElBQTFCLEVBQWdDQyxJQUFoQyxFQUFzQ0MsTUFBdEMsRUFBOEM7QUFDM0QsTUFBSTltQixDQUFKLEVBQU92QixDQUFQO0FBQ0EsTUFBSXNvQixPQUFPRCxTQUFTLENBQVQsR0FBYUQsSUFBYixHQUFvQixDQUEvQjtBQUNBLE1BQUlHLE9BQU8sQ0FBQyxLQUFLRCxJQUFOLElBQWMsQ0FBekI7QUFDQSxNQUFJRSxRQUFRRCxRQUFRLENBQXBCO0FBQ0EsTUFBSUUsUUFBUSxDQUFDLENBQWI7QUFDQSxNQUFJNXFCLElBQUlzcUIsT0FBUUUsU0FBUyxDQUFqQixHQUFzQixDQUE5QjtBQUNBLE1BQUl6UCxJQUFJdVAsT0FBTyxDQUFDLENBQVIsR0FBWSxDQUFwQjtBQUNBLE1BQUlPLElBQUkxSyxPQUFPb0QsU0FBU3ZqQixDQUFoQixDQUFSOztBQUVBQSxPQUFLK2EsQ0FBTDs7QUFFQXJYLE1BQUltbkIsSUFBSyxDQUFDLEtBQU0sQ0FBQ0QsS0FBUixJQUFrQixDQUEzQjtBQUNBQyxRQUFPLENBQUNELEtBQVI7QUFDQUEsV0FBU0gsSUFBVDtBQUNBLFNBQU9HLFFBQVEsQ0FBZixFQUFrQmxuQixJQUFJQSxJQUFJLEdBQUosR0FBVXljLE9BQU9vRCxTQUFTdmpCLENBQWhCLENBQWQsRUFBa0NBLEtBQUsrYSxDQUF2QyxFQUEwQzZQLFNBQVMsQ0FBckUsRUFBd0UsQ0FBRTs7QUFFMUV6b0IsTUFBSXVCLElBQUssQ0FBQyxLQUFNLENBQUNrbkIsS0FBUixJQUFrQixDQUEzQjtBQUNBbG5CLFFBQU8sQ0FBQ2tuQixLQUFSO0FBQ0FBLFdBQVNMLElBQVQ7QUFDQSxTQUFPSyxRQUFRLENBQWYsRUFBa0J6b0IsSUFBSUEsSUFBSSxHQUFKLEdBQVVnZSxPQUFPb0QsU0FBU3ZqQixDQUFoQixDQUFkLEVBQWtDQSxLQUFLK2EsQ0FBdkMsRUFBMEM2UCxTQUFTLENBQXJFLEVBQXdFLENBQUU7O0FBRTFFLE1BQUlsbkIsTUFBTSxDQUFWLEVBQWE7QUFDWEEsUUFBSSxJQUFJaW5CLEtBQVI7QUFDRCxHQUZELE1BRU8sSUFBSWpuQixNQUFNZ25CLElBQVYsRUFBZ0I7QUFDckIsV0FBT3ZvQixJQUFJMm9CLEdBQUosR0FBVyxDQUFDRCxJQUFJLENBQUMsQ0FBTCxHQUFTLENBQVYsSUFBZTNCLFFBQWpDO0FBQ0QsR0FGTSxNQUVBO0FBQ0wvbUIsUUFBSUEsSUFBSTZHLEtBQUtvZCxHQUFMLENBQVMsQ0FBVCxFQUFZbUUsSUFBWixDQUFSO0FBQ0E3bUIsUUFBSUEsSUFBSWluQixLQUFSO0FBQ0Q7QUFDRCxTQUFPLENBQUNFLElBQUksQ0FBQyxDQUFMLEdBQVMsQ0FBVixJQUFlMW9CLENBQWYsR0FBbUI2RyxLQUFLb2QsR0FBTCxDQUFTLENBQVQsRUFBWTFpQixJQUFJNm1CLElBQWhCLENBQTFCO0FBQ0QsQ0EvQkQ7O0FBaUNBaFEsUUFBUXFGLEtBQVIsR0FBZ0IsVUFBVU8sTUFBVixFQUFrQnZmLEtBQWxCLEVBQXlCMmlCLE1BQXpCLEVBQWlDK0csSUFBakMsRUFBdUNDLElBQXZDLEVBQTZDQyxNQUE3QyxFQUFxRDtBQUNuRSxNQUFJOW1CLENBQUosRUFBT3ZCLENBQVAsRUFBVWtuQixDQUFWO0FBQ0EsTUFBSW9CLE9BQU9ELFNBQVMsQ0FBVCxHQUFhRCxJQUFiLEdBQW9CLENBQS9CO0FBQ0EsTUFBSUcsT0FBTyxDQUFDLEtBQUtELElBQU4sSUFBYyxDQUF6QjtBQUNBLE1BQUlFLFFBQVFELFFBQVEsQ0FBcEI7QUFDQSxNQUFJSyxLQUFNUixTQUFTLEVBQVQsR0FBY3ZoQixLQUFLb2QsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFDLEVBQWIsSUFBbUJwZCxLQUFLb2QsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFDLEVBQWIsQ0FBakMsR0FBb0QsQ0FBOUQ7QUFDQSxNQUFJcG1CLElBQUlzcUIsT0FBTyxDQUFQLEdBQVlFLFNBQVMsQ0FBN0I7QUFDQSxNQUFJelAsSUFBSXVQLE9BQU8sQ0FBUCxHQUFXLENBQUMsQ0FBcEI7QUFDQSxNQUFJTyxJQUFJanFCLFFBQVEsQ0FBUixJQUFjQSxVQUFVLENBQVYsSUFBZSxJQUFJQSxLQUFKLEdBQVksQ0FBekMsR0FBOEMsQ0FBOUMsR0FBa0QsQ0FBMUQ7O0FBRUFBLFVBQVFvSSxLQUFLc0csR0FBTCxDQUFTMU8sS0FBVCxDQUFSOztBQUVBLE1BQUlrVSxNQUFNbFUsS0FBTixLQUFnQkEsVUFBVXNvQixRQUE5QixFQUF3QztBQUN0Qy9tQixRQUFJMlMsTUFBTWxVLEtBQU4sSUFBZSxDQUFmLEdBQW1CLENBQXZCO0FBQ0E4QyxRQUFJZ25CLElBQUo7QUFDRCxHQUhELE1BR087QUFDTGhuQixRQUFJc0YsS0FBS29lLEtBQUwsQ0FBV3BlLEtBQUtnaUIsR0FBTCxDQUFTcHFCLEtBQVQsSUFBa0JvSSxLQUFLaWlCLEdBQWxDLENBQUo7QUFDQSxRQUFJcnFCLFNBQVN5b0IsSUFBSXJnQixLQUFLb2QsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFDMWlCLENBQWIsQ0FBYixJQUFnQyxDQUFwQyxFQUF1QztBQUNyQ0E7QUFDQTJsQixXQUFLLENBQUw7QUFDRDtBQUNELFFBQUkzbEIsSUFBSWluQixLQUFKLElBQWEsQ0FBakIsRUFBb0I7QUFDbEIvcEIsZUFBU21xQixLQUFLMUIsQ0FBZDtBQUNELEtBRkQsTUFFTztBQUNMem9CLGVBQVNtcUIsS0FBSy9oQixLQUFLb2QsR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFJdUUsS0FBaEIsQ0FBZDtBQUNEO0FBQ0QsUUFBSS9wQixRQUFReW9CLENBQVIsSUFBYSxDQUFqQixFQUFvQjtBQUNsQjNsQjtBQUNBMmxCLFdBQUssQ0FBTDtBQUNEOztBQUVELFFBQUkzbEIsSUFBSWluQixLQUFKLElBQWFELElBQWpCLEVBQXVCO0FBQ3JCdm9CLFVBQUksQ0FBSjtBQUNBdUIsVUFBSWduQixJQUFKO0FBQ0QsS0FIRCxNQUdPLElBQUlobkIsSUFBSWluQixLQUFKLElBQWEsQ0FBakIsRUFBb0I7QUFDekJ4b0IsVUFBSSxDQUFDdkIsUUFBUXlvQixDQUFSLEdBQVksQ0FBYixJQUFrQnJnQixLQUFLb2QsR0FBTCxDQUFTLENBQVQsRUFBWW1FLElBQVosQ0FBdEI7QUFDQTdtQixVQUFJQSxJQUFJaW5CLEtBQVI7QUFDRCxLQUhNLE1BR0E7QUFDTHhvQixVQUFJdkIsUUFBUW9JLEtBQUtvZCxHQUFMLENBQVMsQ0FBVCxFQUFZdUUsUUFBUSxDQUFwQixDQUFSLEdBQWlDM2hCLEtBQUtvZCxHQUFMLENBQVMsQ0FBVCxFQUFZbUUsSUFBWixDQUFyQztBQUNBN21CLFVBQUksQ0FBSjtBQUNEO0FBQ0Y7O0FBRUQsU0FBTzZtQixRQUFRLENBQWYsRUFBa0JwSyxPQUFPb0QsU0FBU3ZqQixDQUFoQixJQUFxQm1DLElBQUksSUFBekIsRUFBK0JuQyxLQUFLK2EsQ0FBcEMsRUFBdUM1WSxLQUFLLEdBQTVDLEVBQWlEb29CLFFBQVEsQ0FBM0UsRUFBOEUsQ0FBRTs7QUFFaEY3bUIsTUFBS0EsS0FBSzZtQixJQUFOLEdBQWNwb0IsQ0FBbEI7QUFDQXNvQixVQUFRRixJQUFSO0FBQ0EsU0FBT0UsT0FBTyxDQUFkLEVBQWlCdEssT0FBT29ELFNBQVN2akIsQ0FBaEIsSUFBcUIwRCxJQUFJLElBQXpCLEVBQStCMUQsS0FBSythLENBQXBDLEVBQXVDclgsS0FBSyxHQUE1QyxFQUFpRCttQixRQUFRLENBQTFFLEVBQTZFLENBQUU7O0FBRS9FdEssU0FBT29ELFNBQVN2akIsQ0FBVCxHQUFhK2EsQ0FBcEIsS0FBMEI4UCxJQUFJLEdBQTlCO0FBQ0QsQ0FsREQsQzs7Ozs7Ozs7O0FDakNBLElBQUl0bEIsV0FBVyxHQUFHQSxRQUFsQjs7QUFFQTRVLE9BQU9JLE9BQVAsR0FBaUIxYSxNQUFNQyxPQUFOLElBQWlCLFVBQVU2YyxHQUFWLEVBQWU7QUFDL0MsU0FBT3BYLFNBQVNoRSxJQUFULENBQWNvYixHQUFkLEtBQXNCLGdCQUE3QjtBQUNELENBRkQsQzs7Ozs7Ozs7O0FDRkE7QUFDQSxJQUFJdU8sVUFBVS9RLE9BQU9JLE9BQVAsR0FBaUIsRUFBL0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSTRRLGdCQUFKO0FBQ0EsSUFBSUMsa0JBQUo7O0FBRUEsU0FBU0MsZ0JBQVQsR0FBNEI7QUFDeEIsVUFBTSxJQUFJenBCLEtBQUosQ0FBVSxpQ0FBVixDQUFOO0FBQ0g7QUFDRCxTQUFTMHBCLG1CQUFULEdBQWdDO0FBQzVCLFVBQU0sSUFBSTFwQixLQUFKLENBQVUsbUNBQVYsQ0FBTjtBQUNIO0FBQ0EsYUFBWTtBQUNULFFBQUk7QUFDQSxZQUFJLE9BQU9vQixVQUFQLEtBQXNCLFVBQTFCLEVBQXNDO0FBQ2xDbW9CLCtCQUFtQm5vQixVQUFuQjtBQUNILFNBRkQsTUFFTztBQUNIbW9CLCtCQUFtQkUsZ0JBQW5CO0FBQ0g7QUFDSixLQU5ELENBTUUsT0FBTzNuQixDQUFQLEVBQVU7QUFDUnluQiwyQkFBbUJFLGdCQUFuQjtBQUNIO0FBQ0QsUUFBSTtBQUNBLFlBQUksT0FBT0UsWUFBUCxLQUF3QixVQUE1QixFQUF3QztBQUNwQ0gsaUNBQXFCRyxZQUFyQjtBQUNILFNBRkQsTUFFTztBQUNISCxpQ0FBcUJFLG1CQUFyQjtBQUNIO0FBQ0osS0FORCxDQU1FLE9BQU81bkIsQ0FBUCxFQUFVO0FBQ1IwbkIsNkJBQXFCRSxtQkFBckI7QUFDSDtBQUNKLENBbkJBLEdBQUQ7QUFvQkEsU0FBU0UsVUFBVCxDQUFvQkMsR0FBcEIsRUFBeUI7QUFDckIsUUFBSU4scUJBQXFCbm9CLFVBQXpCLEVBQXFDO0FBQ2pDO0FBQ0EsZUFBT0EsV0FBV3lvQixHQUFYLEVBQWdCLENBQWhCLENBQVA7QUFDSDtBQUNEO0FBQ0EsUUFBSSxDQUFDTixxQkFBcUJFLGdCQUFyQixJQUF5QyxDQUFDRixnQkFBM0MsS0FBZ0Vub0IsVUFBcEUsRUFBZ0Y7QUFDNUVtb0IsMkJBQW1Cbm9CLFVBQW5CO0FBQ0EsZUFBT0EsV0FBV3lvQixHQUFYLEVBQWdCLENBQWhCLENBQVA7QUFDSDtBQUNELFFBQUk7QUFDQTtBQUNBLGVBQU9OLGlCQUFpQk0sR0FBakIsRUFBc0IsQ0FBdEIsQ0FBUDtBQUNILEtBSEQsQ0FHRSxPQUFNL25CLENBQU4sRUFBUTtBQUNOLFlBQUk7QUFDQTtBQUNBLG1CQUFPeW5CLGlCQUFpQjVwQixJQUFqQixDQUFzQixJQUF0QixFQUE0QmtxQixHQUE1QixFQUFpQyxDQUFqQyxDQUFQO0FBQ0gsU0FIRCxDQUdFLE9BQU0vbkIsQ0FBTixFQUFRO0FBQ047QUFDQSxtQkFBT3luQixpQkFBaUI1cEIsSUFBakIsQ0FBc0IsSUFBdEIsRUFBNEJrcUIsR0FBNUIsRUFBaUMsQ0FBakMsQ0FBUDtBQUNIO0FBQ0o7QUFHSjtBQUNELFNBQVNDLGVBQVQsQ0FBeUJDLE1BQXpCLEVBQWlDO0FBQzdCLFFBQUlQLHVCQUF1QkcsWUFBM0IsRUFBeUM7QUFDckM7QUFDQSxlQUFPQSxhQUFhSSxNQUFiLENBQVA7QUFDSDtBQUNEO0FBQ0EsUUFBSSxDQUFDUCx1QkFBdUJFLG1CQUF2QixJQUE4QyxDQUFDRixrQkFBaEQsS0FBdUVHLFlBQTNFLEVBQXlGO0FBQ3JGSCw2QkFBcUJHLFlBQXJCO0FBQ0EsZUFBT0EsYUFBYUksTUFBYixDQUFQO0FBQ0g7QUFDRCxRQUFJO0FBQ0E7QUFDQSxlQUFPUCxtQkFBbUJPLE1BQW5CLENBQVA7QUFDSCxLQUhELENBR0UsT0FBT2pvQixDQUFQLEVBQVM7QUFDUCxZQUFJO0FBQ0E7QUFDQSxtQkFBTzBuQixtQkFBbUI3cEIsSUFBbkIsQ0FBd0IsSUFBeEIsRUFBOEJvcUIsTUFBOUIsQ0FBUDtBQUNILFNBSEQsQ0FHRSxPQUFPam9CLENBQVAsRUFBUztBQUNQO0FBQ0E7QUFDQSxtQkFBTzBuQixtQkFBbUI3cEIsSUFBbkIsQ0FBd0IsSUFBeEIsRUFBOEJvcUIsTUFBOUIsQ0FBUDtBQUNIO0FBQ0o7QUFJSjtBQUNELElBQUlDLFFBQVEsRUFBWjtBQUNBLElBQUlDLFdBQVcsS0FBZjtBQUNBLElBQUlDLFlBQUo7QUFDQSxJQUFJQyxhQUFhLENBQUMsQ0FBbEI7O0FBRUEsU0FBU0MsZUFBVCxHQUEyQjtBQUN2QixRQUFJLENBQUNILFFBQUQsSUFBYSxDQUFDQyxZQUFsQixFQUFnQztBQUM1QjtBQUNIO0FBQ0RELGVBQVcsS0FBWDtBQUNBLFFBQUlDLGFBQWE3ckIsTUFBakIsRUFBeUI7QUFDckIyckIsZ0JBQVFFLGFBQWE5ZCxNQUFiLENBQW9CNGQsS0FBcEIsQ0FBUjtBQUNILEtBRkQsTUFFTztBQUNIRyxxQkFBYSxDQUFDLENBQWQ7QUFDSDtBQUNELFFBQUlILE1BQU0zckIsTUFBVixFQUFrQjtBQUNkZ3NCO0FBQ0g7QUFDSjs7QUFFRCxTQUFTQSxVQUFULEdBQXNCO0FBQ2xCLFFBQUlKLFFBQUosRUFBYztBQUNWO0FBQ0g7QUFDRCxRQUFJcFosVUFBVStZLFdBQVdRLGVBQVgsQ0FBZDtBQUNBSCxlQUFXLElBQVg7O0FBRUEsUUFBSXpQLE1BQU13UCxNQUFNM3JCLE1BQWhCO0FBQ0EsV0FBTW1jLEdBQU4sRUFBVztBQUNQMFAsdUJBQWVGLEtBQWY7QUFDQUEsZ0JBQVEsRUFBUjtBQUNBLGVBQU8sRUFBRUcsVUFBRixHQUFlM1AsR0FBdEIsRUFBMkI7QUFDdkIsZ0JBQUkwUCxZQUFKLEVBQWtCO0FBQ2RBLDZCQUFhQyxVQUFiLEVBQXlCbm9CLEdBQXpCO0FBQ0g7QUFDSjtBQUNEbW9CLHFCQUFhLENBQUMsQ0FBZDtBQUNBM1AsY0FBTXdQLE1BQU0zckIsTUFBWjtBQUNIO0FBQ0Q2ckIsbUJBQWUsSUFBZjtBQUNBRCxlQUFXLEtBQVg7QUFDQUgsb0JBQWdCalosT0FBaEI7QUFDSDs7QUFFRHlZLFFBQVFnQixRQUFSLEdBQW1CLFVBQVVULEdBQVYsRUFBZTtBQUM5QixRQUFJam1CLE9BQU8sSUFBSTNGLEtBQUosQ0FBVTRCLFVBQVV4QixNQUFWLEdBQW1CLENBQTdCLENBQVg7QUFDQSxRQUFJd0IsVUFBVXhCLE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7QUFDdEIsYUFBSyxJQUFJRCxJQUFJLENBQWIsRUFBZ0JBLElBQUl5QixVQUFVeEIsTUFBOUIsRUFBc0NELEdBQXRDLEVBQTJDO0FBQ3ZDd0YsaUJBQUt4RixJQUFJLENBQVQsSUFBY3lCLFVBQVV6QixDQUFWLENBQWQ7QUFDSDtBQUNKO0FBQ0Q0ckIsVUFBTTlxQixJQUFOLENBQVcsSUFBSXFyQixJQUFKLENBQVNWLEdBQVQsRUFBY2ptQixJQUFkLENBQVg7QUFDQSxRQUFJb21CLE1BQU0zckIsTUFBTixLQUFpQixDQUFqQixJQUFzQixDQUFDNHJCLFFBQTNCLEVBQXFDO0FBQ2pDTCxtQkFBV1MsVUFBWDtBQUNIO0FBQ0osQ0FYRDs7QUFhQTtBQUNBLFNBQVNFLElBQVQsQ0FBY1YsR0FBZCxFQUFtQjNMLEtBQW5CLEVBQTBCO0FBQ3RCLFNBQUsyTCxHQUFMLEdBQVdBLEdBQVg7QUFDQSxTQUFLM0wsS0FBTCxHQUFhQSxLQUFiO0FBQ0g7QUFDRHFNLEtBQUtwb0IsU0FBTCxDQUFlSCxHQUFmLEdBQXFCLFlBQVk7QUFDN0IsU0FBSzZuQixHQUFMLENBQVNqbEIsS0FBVCxDQUFlLElBQWYsRUFBcUIsS0FBS3NaLEtBQTFCO0FBQ0gsQ0FGRDtBQUdBb0wsUUFBUWxVLEtBQVIsR0FBZ0IsU0FBaEI7QUFDQWtVLFFBQVFrQixPQUFSLEdBQWtCLElBQWxCO0FBQ0FsQixRQUFRbUIsR0FBUixHQUFjLEVBQWQ7QUFDQW5CLFFBQVFvQixJQUFSLEdBQWUsRUFBZjtBQUNBcEIsUUFBUWhSLE9BQVIsR0FBa0IsRUFBbEIsQyxDQUFzQjtBQUN0QmdSLFFBQVFxQixRQUFSLEdBQW1CLEVBQW5COztBQUVBLFNBQVNDLElBQVQsR0FBZ0IsQ0FBRTs7QUFFbEJ0QixRQUFRdUIsRUFBUixHQUFhRCxJQUFiO0FBQ0F0QixRQUFRd0IsV0FBUixHQUFzQkYsSUFBdEI7QUFDQXRCLFFBQVF5QixJQUFSLEdBQWVILElBQWY7QUFDQXRCLFFBQVEwQixHQUFSLEdBQWNKLElBQWQ7QUFDQXRCLFFBQVEyQixjQUFSLEdBQXlCTCxJQUF6QjtBQUNBdEIsUUFBUTRCLGtCQUFSLEdBQTZCTixJQUE3QjtBQUNBdEIsUUFBUTZCLElBQVIsR0FBZVAsSUFBZjs7QUFFQXRCLFFBQVE4QixPQUFSLEdBQWtCLFVBQVVDLElBQVYsRUFBZ0I7QUFDOUIsVUFBTSxJQUFJcnJCLEtBQUosQ0FBVSxrQ0FBVixDQUFOO0FBQ0gsQ0FGRDs7QUFJQXNwQixRQUFRZ0MsR0FBUixHQUFjLFlBQVk7QUFBRSxXQUFPLEdBQVA7QUFBWSxDQUF4QztBQUNBaEMsUUFBUWlDLEtBQVIsR0FBZ0IsVUFBVXhLLEdBQVYsRUFBZTtBQUMzQixVQUFNLElBQUkvZ0IsS0FBSixDQUFVLGdDQUFWLENBQU47QUFDSCxDQUZEO0FBR0FzcEIsUUFBUWtDLEtBQVIsR0FBZ0IsWUFBVztBQUFFLFdBQU8sQ0FBUDtBQUFXLENBQXhDLEM7Ozs7Ozs7OztBQ25MQyxXQUFVam9CLE1BQVYsRUFBa0I5RixTQUFsQixFQUE2QjtBQUMxQjs7QUFFQSxRQUFJOEYsT0FBT3BDLFlBQVgsRUFBeUI7QUFDckI7QUFDSDs7QUFFRCxRQUFJc3FCLGFBQWEsQ0FBakIsQ0FQMEIsQ0FPTjtBQUNwQixRQUFJQyxnQkFBZ0IsRUFBcEI7QUFDQSxRQUFJQyx3QkFBd0IsS0FBNUI7QUFDQSxRQUFJQyxNQUFNcm9CLE9BQU9pRSxRQUFqQjtBQUNBLFFBQUlxa0IsaUJBQUo7O0FBRUEsYUFBUzFxQixZQUFULENBQXNCb0IsUUFBdEIsRUFBZ0M7QUFDOUI7QUFDQSxZQUFJLE9BQU9BLFFBQVAsS0FBb0IsVUFBeEIsRUFBb0M7QUFDbENBLHVCQUFXLElBQUlrVyxRQUFKLENBQWEsS0FBS2xXLFFBQWxCLENBQVg7QUFDRDtBQUNEO0FBQ0EsWUFBSXFCLE9BQU8sSUFBSTNGLEtBQUosQ0FBVTRCLFVBQVV4QixNQUFWLEdBQW1CLENBQTdCLENBQVg7QUFDQSxhQUFLLElBQUlELElBQUksQ0FBYixFQUFnQkEsSUFBSXdGLEtBQUt2RixNQUF6QixFQUFpQ0QsR0FBakMsRUFBc0M7QUFDbEN3RixpQkFBS3hGLENBQUwsSUFBVXlCLFVBQVV6QixJQUFJLENBQWQsQ0FBVjtBQUNIO0FBQ0Q7QUFDQSxZQUFJMHRCLE9BQU8sRUFBRXZwQixVQUFVQSxRQUFaLEVBQXNCcUIsTUFBTUEsSUFBNUIsRUFBWDtBQUNBOG5CLHNCQUFjRCxVQUFkLElBQTRCSyxJQUE1QjtBQUNBRCwwQkFBa0JKLFVBQWxCO0FBQ0EsZUFBT0EsWUFBUDtBQUNEOztBQUVELGFBQVNNLGNBQVQsQ0FBd0J6cEIsTUFBeEIsRUFBZ0M7QUFDNUIsZUFBT29wQixjQUFjcHBCLE1BQWQsQ0FBUDtBQUNIOztBQUVELGFBQVNOLEdBQVQsQ0FBYThwQixJQUFiLEVBQW1CO0FBQ2YsWUFBSXZwQixXQUFXdXBCLEtBQUt2cEIsUUFBcEI7QUFDQSxZQUFJcUIsT0FBT2tvQixLQUFLbG9CLElBQWhCO0FBQ0EsZ0JBQVFBLEtBQUt2RixNQUFiO0FBQ0EsaUJBQUssQ0FBTDtBQUNJa0U7QUFDQTtBQUNKLGlCQUFLLENBQUw7QUFDSUEseUJBQVNxQixLQUFLLENBQUwsQ0FBVDtBQUNBO0FBQ0osaUJBQUssQ0FBTDtBQUNJckIseUJBQVNxQixLQUFLLENBQUwsQ0FBVCxFQUFrQkEsS0FBSyxDQUFMLENBQWxCO0FBQ0E7QUFDSixpQkFBSyxDQUFMO0FBQ0lyQix5QkFBU3FCLEtBQUssQ0FBTCxDQUFULEVBQWtCQSxLQUFLLENBQUwsQ0FBbEIsRUFBMkJBLEtBQUssQ0FBTCxDQUEzQjtBQUNBO0FBQ0o7QUFDSXJCLHlCQUFTcUMsS0FBVCxDQUFlbkgsU0FBZixFQUEwQm1HLElBQTFCO0FBQ0E7QUFmSjtBQWlCSDs7QUFFRCxhQUFTb29CLFlBQVQsQ0FBc0IxcEIsTUFBdEIsRUFBOEI7QUFDMUI7QUFDQTtBQUNBLFlBQUlxcEIscUJBQUosRUFBMkI7QUFDdkI7QUFDQTtBQUNBdnFCLHVCQUFXNHFCLFlBQVgsRUFBeUIsQ0FBekIsRUFBNEIxcEIsTUFBNUI7QUFDSCxTQUpELE1BSU87QUFDSCxnQkFBSXdwQixPQUFPSixjQUFjcHBCLE1BQWQsQ0FBWDtBQUNBLGdCQUFJd3BCLElBQUosRUFBVTtBQUNOSCx3Q0FBd0IsSUFBeEI7QUFDQSxvQkFBSTtBQUNBM3BCLHdCQUFJOHBCLElBQUo7QUFDSCxpQkFGRCxTQUVVO0FBQ05DLG1DQUFlenBCLE1BQWY7QUFDQXFwQiw0Q0FBd0IsS0FBeEI7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFFRCxhQUFTTSw2QkFBVCxHQUF5QztBQUNyQ0osNEJBQW9CLDJCQUFTdnBCLE1BQVQsRUFBaUI7QUFDakNnbkIsb0JBQVFnQixRQUFSLENBQWlCLFlBQVk7QUFBRTBCLDZCQUFhMXBCLE1BQWI7QUFBdUIsYUFBdEQ7QUFDSCxTQUZEO0FBR0g7O0FBRUQsYUFBUzRwQixpQkFBVCxHQUE2QjtBQUN6QjtBQUNBO0FBQ0EsWUFBSTNvQixPQUFPNG9CLFdBQVAsSUFBc0IsQ0FBQzVvQixPQUFPNm9CLGFBQWxDLEVBQWlEO0FBQzdDLGdCQUFJQyw0QkFBNEIsSUFBaEM7QUFDQSxnQkFBSUMsZUFBZS9vQixPQUFPZ3BCLFNBQTFCO0FBQ0FocEIsbUJBQU9ncEIsU0FBUCxHQUFtQixZQUFXO0FBQzFCRiw0Q0FBNEIsS0FBNUI7QUFDSCxhQUZEO0FBR0E5b0IsbUJBQU80b0IsV0FBUCxDQUFtQixFQUFuQixFQUF1QixHQUF2QjtBQUNBNW9CLG1CQUFPZ3BCLFNBQVAsR0FBbUJELFlBQW5CO0FBQ0EsbUJBQU9ELHlCQUFQO0FBQ0g7QUFDSjs7QUFFRCxhQUFTRyxnQ0FBVCxHQUE0QztBQUN4QztBQUNBO0FBQ0E7O0FBRUEsWUFBSUMsZ0JBQWdCLGtCQUFrQnJsQixLQUFLRSxNQUFMLEVBQWxCLEdBQWtDLEdBQXREO0FBQ0EsWUFBSW9sQixrQkFBa0IsU0FBbEJBLGVBQWtCLENBQVNDLEtBQVQsRUFBZ0I7QUFDbEMsZ0JBQUlBLE1BQU1qZCxNQUFOLEtBQWlCbk0sTUFBakIsSUFDQSxPQUFPb3BCLE1BQU10bkIsSUFBYixLQUFzQixRQUR0QixJQUVBc25CLE1BQU10bkIsSUFBTixDQUFXK0MsT0FBWCxDQUFtQnFrQixhQUFuQixNQUFzQyxDQUYxQyxFQUU2QztBQUN6Q1QsNkJBQWEsQ0FBQ1csTUFBTXRuQixJQUFOLENBQVc0QyxLQUFYLENBQWlCd2tCLGNBQWNwdUIsTUFBL0IsQ0FBZDtBQUNIO0FBQ0osU0FORDs7QUFRQSxZQUFJa0YsT0FBTzBNLGdCQUFYLEVBQTZCO0FBQ3pCMU0sbUJBQU8wTSxnQkFBUCxDQUF3QixTQUF4QixFQUFtQ3ljLGVBQW5DLEVBQW9ELEtBQXBEO0FBQ0gsU0FGRCxNQUVPO0FBQ0hucEIsbUJBQU9xcEIsV0FBUCxDQUFtQixXQUFuQixFQUFnQ0YsZUFBaEM7QUFDSDs7QUFFRGIsNEJBQW9CLDJCQUFTdnBCLE1BQVQsRUFBaUI7QUFDakNpQixtQkFBTzRvQixXQUFQLENBQW1CTSxnQkFBZ0JucUIsTUFBbkMsRUFBMkMsR0FBM0M7QUFDSCxTQUZEO0FBR0g7O0FBRUQsYUFBU3VxQixtQ0FBVCxHQUErQztBQUMzQyxZQUFJQyxVQUFVLElBQUlDLGNBQUosRUFBZDtBQUNBRCxnQkFBUUUsS0FBUixDQUFjVCxTQUFkLEdBQTBCLFVBQVNJLEtBQVQsRUFBZ0I7QUFDdEMsZ0JBQUlycUIsU0FBU3FxQixNQUFNdG5CLElBQW5CO0FBQ0EybUIseUJBQWExcEIsTUFBYjtBQUNILFNBSEQ7O0FBS0F1cEIsNEJBQW9CLDJCQUFTdnBCLE1BQVQsRUFBaUI7QUFDakN3cUIsb0JBQVFHLEtBQVIsQ0FBY2QsV0FBZCxDQUEwQjdwQixNQUExQjtBQUNILFNBRkQ7QUFHSDs7QUFFRCxhQUFTNHFCLHFDQUFULEdBQWlEO0FBQzdDLFlBQUk5c0IsT0FBT3dyQixJQUFJOWpCLGVBQWY7QUFDQStqQiw0QkFBb0IsMkJBQVN2cEIsTUFBVCxFQUFpQjtBQUNqQztBQUNBO0FBQ0EsZ0JBQUlpRixTQUFTcWtCLElBQUlua0IsYUFBSixDQUFrQixRQUFsQixDQUFiO0FBQ0FGLG1CQUFPZCxrQkFBUCxHQUE0QixZQUFZO0FBQ3BDdWxCLDZCQUFhMXBCLE1BQWI7QUFDQWlGLHVCQUFPZCxrQkFBUCxHQUE0QixJQUE1QjtBQUNBckcscUJBQUt1SCxXQUFMLENBQWlCSixNQUFqQjtBQUNBQSx5QkFBUyxJQUFUO0FBQ0gsYUFMRDtBQU1BbkgsaUJBQUsySCxXQUFMLENBQWlCUixNQUFqQjtBQUNILFNBWEQ7QUFZSDs7QUFFRCxhQUFTNGxCLCtCQUFULEdBQTJDO0FBQ3ZDdEIsNEJBQW9CLDJCQUFTdnBCLE1BQVQsRUFBaUI7QUFDakNsQix1QkFBVzRxQixZQUFYLEVBQXlCLENBQXpCLEVBQTRCMXBCLE1BQTVCO0FBQ0gsU0FGRDtBQUdIOztBQUVEO0FBQ0EsUUFBSThxQixXQUFXMXBCLE9BQU8ycEIsY0FBUCxJQUF5QjNwQixPQUFPMnBCLGNBQVAsQ0FBc0I5cEIsTUFBdEIsQ0FBeEM7QUFDQTZwQixlQUFXQSxZQUFZQSxTQUFTaHNCLFVBQXJCLEdBQWtDZ3NCLFFBQWxDLEdBQTZDN3BCLE1BQXhEOztBQUVBO0FBQ0EsUUFBSSxHQUFHSSxRQUFILENBQVloRSxJQUFaLENBQWlCNEQsT0FBTytsQixPQUF4QixNQUFxQyxrQkFBekMsRUFBNkQ7QUFDekQ7QUFDQTJDO0FBRUgsS0FKRCxNQUlPLElBQUlDLG1CQUFKLEVBQXlCO0FBQzVCO0FBQ0FNO0FBRUgsS0FKTSxNQUlBLElBQUlqcEIsT0FBT3dwQixjQUFYLEVBQTJCO0FBQzlCO0FBQ0FGO0FBRUgsS0FKTSxNQUlBLElBQUlqQixPQUFPLHdCQUF3QkEsSUFBSW5rQixhQUFKLENBQWtCLFFBQWxCLENBQW5DLEVBQWdFO0FBQ25FO0FBQ0F5bEI7QUFFSCxLQUpNLE1BSUE7QUFDSDtBQUNBQztBQUNIOztBQUVEQyxhQUFTanNCLFlBQVQsR0FBd0JBLFlBQXhCO0FBQ0Fpc0IsYUFBU3JCLGNBQVQsR0FBMEJBLGNBQTFCO0FBQ0gsQ0F6TEEsRUF5TEMsT0FBT3ByQixJQUFQLEtBQWdCLFdBQWhCLEdBQThCLE9BQU80QyxNQUFQLEtBQWtCLFdBQWxCLGVBQXVDQSxNQUFyRSxHQUE4RTVDLElBekwvRSxDQUFELEM7Ozs7Ozs7Ozs7QUNDQTs7Ozs7Ozs7Ozs7OztBQWFBNFgsT0FBT0ksT0FBUCxHQUFpQixVQUFVMlUsR0FBVixFQUFlO0FBQzlCO0FBQ0EsS0FBSTFaLFdBQVcsT0FBT3ZRLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE9BQU91USxRQUF2RDs7QUFFQSxLQUFJLENBQUNBLFFBQUwsRUFBZTtBQUNiLFFBQU0sSUFBSTVULEtBQUosQ0FBVSxrQ0FBVixDQUFOO0FBQ0Q7O0FBRUY7QUFDQSxLQUFJLENBQUNzdEIsR0FBRCxJQUFRLE9BQU9BLEdBQVAsS0FBZSxRQUEzQixFQUFxQztBQUNuQyxTQUFPQSxHQUFQO0FBQ0E7O0FBRUQsS0FBSUMsVUFBVTNaLFNBQVM0WixRQUFULEdBQW9CLElBQXBCLEdBQTJCNVosU0FBUzZaLElBQWxEO0FBQ0EsS0FBSUMsYUFBYUgsVUFBVTNaLFNBQVNnQyxRQUFULENBQWtCeFcsT0FBbEIsQ0FBMEIsV0FBMUIsRUFBdUMsR0FBdkMsQ0FBM0I7O0FBRUQ7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsS0FBSXV1QixXQUFXTCxJQUFJbHVCLE9BQUosQ0FBWSxxREFBWixFQUFtRSxVQUFTd3VCLFNBQVQsRUFBb0JDLE9BQXBCLEVBQTZCO0FBQzlHO0FBQ0EsTUFBSUMsa0JBQWtCRCxRQUNwQnpHLElBRG9CLEdBRXBCaG9CLE9BRm9CLENBRVosVUFGWSxFQUVBLFVBQVNvTixDQUFULEVBQVl1aEIsRUFBWixFQUFlO0FBQUUsVUFBT0EsRUFBUDtBQUFZLEdBRjdCLEVBR3BCM3VCLE9BSG9CLENBR1osVUFIWSxFQUdBLFVBQVNvTixDQUFULEVBQVl1aEIsRUFBWixFQUFlO0FBQUUsVUFBT0EsRUFBUDtBQUFZLEdBSDdCLENBQXRCOztBQUtBO0FBQ0EsTUFBSSwrQ0FBK0NsbkIsSUFBL0MsQ0FBb0RpbkIsZUFBcEQsQ0FBSixFQUEwRTtBQUN4RSxVQUFPRixTQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJSSxNQUFKOztBQUVBLE1BQUlGLGdCQUFnQjFsQixPQUFoQixDQUF3QixJQUF4QixNQUFrQyxDQUF0QyxFQUF5QztBQUN0QztBQUNGNGxCLFlBQVNGLGVBQVQ7QUFDQSxHQUhELE1BR08sSUFBSUEsZ0JBQWdCMWxCLE9BQWhCLENBQXdCLEdBQXhCLE1BQWlDLENBQXJDLEVBQXdDO0FBQzlDO0FBQ0E0bEIsWUFBU1QsVUFBVU8sZUFBbkIsQ0FGOEMsQ0FFVjtBQUNwQyxHQUhNLE1BR0E7QUFDTjtBQUNBRSxZQUFTTixhQUFhSSxnQkFBZ0IxdUIsT0FBaEIsQ0FBd0IsT0FBeEIsRUFBaUMsRUFBakMsQ0FBdEIsQ0FGTSxDQUVzRDtBQUM1RDs7QUFFRDtBQUNBLFNBQU8sU0FBU2tHLEtBQUtDLFNBQUwsQ0FBZXlvQixNQUFmLENBQVQsR0FBa0MsR0FBekM7QUFDQSxFQTVCYyxDQUFmOztBQThCQTtBQUNBLFFBQU9MLFFBQVA7QUFDQSxDQTFFRCxDOzs7Ozs7Ozs7QUNkQSxJQUFJL29CLFFBQVE2VCxTQUFTdFcsU0FBVCxDQUFtQnlDLEtBQS9COztBQUVBOztBQUVBK1QsUUFBUXZYLFVBQVIsR0FBcUIsWUFBVztBQUM5QixTQUFPLElBQUk2c0IsT0FBSixDQUFZcnBCLE1BQU1qRixJQUFOLENBQVd5QixVQUFYLEVBQXVCaUMsTUFBdkIsRUFBK0J4RCxTQUEvQixDQUFaLEVBQXVEOHBCLFlBQXZELENBQVA7QUFDRCxDQUZEO0FBR0FoUixRQUFRdVYsV0FBUixHQUFzQixZQUFXO0FBQy9CLFNBQU8sSUFBSUQsT0FBSixDQUFZcnBCLE1BQU1qRixJQUFOLENBQVd1dUIsV0FBWCxFQUF3QjdxQixNQUF4QixFQUFnQ3hELFNBQWhDLENBQVosRUFBd0RzdUIsYUFBeEQsQ0FBUDtBQUNELENBRkQ7QUFHQXhWLFFBQVFnUixZQUFSLEdBQ0FoUixRQUFRd1YsYUFBUixHQUF3QixVQUFTdGQsT0FBVCxFQUFrQjtBQUN4QyxNQUFJQSxPQUFKLEVBQWE7QUFDWEEsWUFBUXVkLEtBQVI7QUFDRDtBQUNGLENBTEQ7O0FBT0EsU0FBU0gsT0FBVCxDQUFpQmh2QixFQUFqQixFQUFxQm92QixPQUFyQixFQUE4QjtBQUM1QixPQUFLQyxHQUFMLEdBQVdydkIsRUFBWDtBQUNBLE9BQUtzdkIsUUFBTCxHQUFnQkYsT0FBaEI7QUFDRDtBQUNESixRQUFROXJCLFNBQVIsQ0FBa0Jxc0IsS0FBbEIsR0FBMEJQLFFBQVE5ckIsU0FBUixDQUFrQnNzQixHQUFsQixHQUF3QixZQUFXLENBQUUsQ0FBL0Q7QUFDQVIsUUFBUTlyQixTQUFSLENBQWtCaXNCLEtBQWxCLEdBQTBCLFlBQVc7QUFDbkMsT0FBS0csUUFBTCxDQUFjNXVCLElBQWQsQ0FBbUIwRCxNQUFuQixFQUEyQixLQUFLaXJCLEdBQWhDO0FBQ0QsQ0FGRDs7QUFJQTtBQUNBM1YsUUFBUStWLE1BQVIsR0FBaUIsVUFBUzVHLElBQVQsRUFBZTZHLEtBQWYsRUFBc0I7QUFDckNoRixlQUFhN0IsS0FBSzhHLGNBQWxCO0FBQ0E5RyxPQUFLK0csWUFBTCxHQUFvQkYsS0FBcEI7QUFDRCxDQUhEOztBQUtBaFcsUUFBUW1XLFFBQVIsR0FBbUIsVUFBU2hILElBQVQsRUFBZTtBQUNoQzZCLGVBQWE3QixLQUFLOEcsY0FBbEI7QUFDQTlHLE9BQUsrRyxZQUFMLEdBQW9CLENBQUMsQ0FBckI7QUFDRCxDQUhEOztBQUtBbFcsUUFBUW9XLFlBQVIsR0FBdUJwVyxRQUFRcEksTUFBUixHQUFpQixVQUFTdVgsSUFBVCxFQUFlO0FBQ3JENkIsZUFBYTdCLEtBQUs4RyxjQUFsQjs7QUFFQSxNQUFJRCxRQUFRN0csS0FBSytHLFlBQWpCO0FBQ0EsTUFBSUYsU0FBUyxDQUFiLEVBQWdCO0FBQ2Q3RyxTQUFLOEcsY0FBTCxHQUFzQnh0QixXQUFXLFNBQVM0dEIsU0FBVCxHQUFxQjtBQUNwRCxVQUFJbEgsS0FBS21ILFVBQVQsRUFDRW5ILEtBQUttSCxVQUFMO0FBQ0gsS0FIcUIsRUFHbkJOLEtBSG1CLENBQXRCO0FBSUQ7QUFDRixDQVZEOztBQVlBO0FBQ0EsbUJBQUFoVCxDQUFRLEVBQVI7QUFDQWhELFFBQVF4WCxZQUFSLEdBQXVCQSxZQUF2QjtBQUNBd1gsUUFBUW9ULGNBQVIsR0FBeUJBLGNBQXpCLEM7Ozs7OztBQ3BEQTtBQUNBOzs7QUFHQTtBQUNBLGtEQUFtRCxlQUFlLFFBQVEsU0FBUzs7QUFFbkY7QUFDQTtBQUNBO0FBQ0EsRTs7Ozs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixtQkFBbUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLHNCQUFzQjtBQUN0QztBQUNBO0FBQ0Esa0JBQWtCLDJCQUEyQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLG1CQUFtQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwyQkFBMkI7QUFDNUM7QUFDQTtBQUNBLFFBQVEsdUJBQXVCO0FBQy9CO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxpQkFBaUIsdUJBQXVCO0FBQ3hDO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsaUJBQWlCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSxnQ0FBZ0Msc0JBQXNCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDs7QUFFQSw2QkFBNkIsbUJBQW1COztBQUVoRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNqU0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBaUY7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNzUzNmNjNjhlYTMxNDE2MDQ1ZmIiLCI7KGZ1bmN0aW9uKCkge1xuXCJ1c2Ugc3RyaWN0XCJcbmZ1bmN0aW9uIFZub2RlKHRhZywga2V5LCBhdHRyczAsIGNoaWxkcmVuLCB0ZXh0LCBkb20pIHtcblx0cmV0dXJuIHt0YWc6IHRhZywga2V5OiBrZXksIGF0dHJzOiBhdHRyczAsIGNoaWxkcmVuOiBjaGlsZHJlbiwgdGV4dDogdGV4dCwgZG9tOiBkb20sIGRvbVNpemU6IHVuZGVmaW5lZCwgc3RhdGU6IHVuZGVmaW5lZCwgX3N0YXRlOiB1bmRlZmluZWQsIGV2ZW50czogdW5kZWZpbmVkLCBpbnN0YW5jZTogdW5kZWZpbmVkLCBza2lwOiBmYWxzZX1cbn1cblZub2RlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKG5vZGUpIHtcblx0aWYgKEFycmF5LmlzQXJyYXkobm9kZSkpIHJldHVybiBWbm9kZShcIltcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKG5vZGUpLCB1bmRlZmluZWQsIHVuZGVmaW5lZClcblx0aWYgKG5vZGUgIT0gbnVsbCAmJiB0eXBlb2Ygbm9kZSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIFZub2RlKFwiI1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgbm9kZSA9PT0gZmFsc2UgPyBcIlwiIDogbm9kZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQpXG5cdHJldHVybiBub2RlXG59XG5Wbm9kZS5ub3JtYWxpemVDaGlsZHJlbiA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUNoaWxkcmVuKGNoaWxkcmVuKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRjaGlsZHJlbltpXSA9IFZub2RlLm5vcm1hbGl6ZShjaGlsZHJlbltpXSlcblx0fVxuXHRyZXR1cm4gY2hpbGRyZW5cbn1cbnZhciBzZWxlY3RvclBhcnNlciA9IC8oPzooXnwjfFxcLikoW14jXFwuXFxbXFxdXSspKXwoXFxbKC4rPykoPzpcXHMqPVxccyooXCJ8J3wpKCg/OlxcXFxbXCInXFxdXXwuKSo/KVxcNSk/XFxdKS9nXG52YXIgc2VsZWN0b3JDYWNoZSA9IHt9XG52YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHlcbmZ1bmN0aW9uIGNvbXBpbGVTZWxlY3RvcihzZWxlY3Rvcikge1xuXHR2YXIgbWF0Y2gsIHRhZyA9IFwiZGl2XCIsIGNsYXNzZXMgPSBbXSwgYXR0cnMgPSB7fVxuXHR3aGlsZSAobWF0Y2ggPSBzZWxlY3RvclBhcnNlci5leGVjKHNlbGVjdG9yKSkge1xuXHRcdHZhciB0eXBlID0gbWF0Y2hbMV0sIHZhbHVlID0gbWF0Y2hbMl1cblx0XHRpZiAodHlwZSA9PT0gXCJcIiAmJiB2YWx1ZSAhPT0gXCJcIikgdGFnID0gdmFsdWVcblx0XHRlbHNlIGlmICh0eXBlID09PSBcIiNcIikgYXR0cnMuaWQgPSB2YWx1ZVxuXHRcdGVsc2UgaWYgKHR5cGUgPT09IFwiLlwiKSBjbGFzc2VzLnB1c2godmFsdWUpXG5cdFx0ZWxzZSBpZiAobWF0Y2hbM11bMF0gPT09IFwiW1wiKSB7XG5cdFx0XHR2YXIgYXR0clZhbHVlID0gbWF0Y2hbNl1cblx0XHRcdGlmIChhdHRyVmFsdWUpIGF0dHJWYWx1ZSA9IGF0dHJWYWx1ZS5yZXBsYWNlKC9cXFxcKFtcIiddKS9nLCBcIiQxXCIpLnJlcGxhY2UoL1xcXFxcXFxcL2csIFwiXFxcXFwiKVxuXHRcdFx0aWYgKG1hdGNoWzRdID09PSBcImNsYXNzXCIpIGNsYXNzZXMucHVzaChhdHRyVmFsdWUpXG5cdFx0XHRlbHNlIGF0dHJzW21hdGNoWzRdXSA9IGF0dHJWYWx1ZSB8fCB0cnVlXG5cdFx0fVxuXHR9XG5cdGlmIChjbGFzc2VzLmxlbmd0aCA+IDApIGF0dHJzLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbihcIiBcIilcblx0cmV0dXJuIHNlbGVjdG9yQ2FjaGVbc2VsZWN0b3JdID0ge3RhZzogdGFnLCBhdHRyczogYXR0cnN9XG59XG5mdW5jdGlvbiBleGVjU2VsZWN0b3Ioc3RhdGUsIGF0dHJzLCBjaGlsZHJlbikge1xuXHR2YXIgaGFzQXR0cnMgPSBmYWxzZSwgY2hpbGRMaXN0LCB0ZXh0XG5cdHZhciBjbGFzc05hbWUgPSBhdHRycy5jbGFzc05hbWUgfHwgYXR0cnMuY2xhc3Ncblx0Zm9yICh2YXIga2V5IGluIHN0YXRlLmF0dHJzKSB7XG5cdFx0aWYgKGhhc093bi5jYWxsKHN0YXRlLmF0dHJzLCBrZXkpKSB7XG5cdFx0XHRhdHRyc1trZXldID0gc3RhdGUuYXR0cnNba2V5XVxuXHRcdH1cblx0fVxuXHRpZiAoY2xhc3NOYW1lICE9IG51bGwpIHtcblx0XHRpZiAoYXR0cnMuY2xhc3MgIT0gbnVsbCkge1xuXHRcdFx0YXR0cnMuY2xhc3MgPSB1bmRlZmluZWRcblx0XHRcdGF0dHJzLmNsYXNzTmFtZSA9IGNsYXNzTmFtZVxuXHRcdH1cblx0XHRpZiAoc3RhdGUuYXR0cnMuY2xhc3NOYW1lICE9IG51bGwpIHtcblx0XHRcdGF0dHJzLmNsYXNzTmFtZSA9IHN0YXRlLmF0dHJzLmNsYXNzTmFtZSArIFwiIFwiICsgY2xhc3NOYW1lXG5cdFx0fVxuXHR9XG5cdGZvciAodmFyIGtleSBpbiBhdHRycykge1xuXHRcdGlmIChoYXNPd24uY2FsbChhdHRycywga2V5KSAmJiBrZXkgIT09IFwia2V5XCIpIHtcblx0XHRcdGhhc0F0dHJzID0gdHJ1ZVxuXHRcdFx0YnJlYWtcblx0XHR9XG5cdH1cblx0aWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pICYmIGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJiBjaGlsZHJlblswXSAhPSBudWxsICYmIGNoaWxkcmVuWzBdLnRhZyA9PT0gXCIjXCIpIHtcblx0XHR0ZXh0ID0gY2hpbGRyZW5bMF0uY2hpbGRyZW5cblx0fSBlbHNlIHtcblx0XHRjaGlsZExpc3QgPSBjaGlsZHJlblxuXHR9XG5cdHJldHVybiBWbm9kZShzdGF0ZS50YWcsIGF0dHJzLmtleSwgaGFzQXR0cnMgPyBhdHRycyA6IHVuZGVmaW5lZCwgY2hpbGRMaXN0LCB0ZXh0KVxufVxuZnVuY3Rpb24gaHlwZXJzY3JpcHQoc2VsZWN0b3IpIHtcblx0Ly8gQmVjYXVzZSBzbG9wcHkgbW9kZSBzdWNrc1xuXHR2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV0sIHN0YXJ0ID0gMiwgY2hpbGRyZW5cblx0aWYgKHNlbGVjdG9yID09IG51bGwgfHwgdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiBzZWxlY3RvciAhPT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBzZWxlY3Rvci52aWV3ICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHR0aHJvdyBFcnJvcihcIlRoZSBzZWxlY3RvciBtdXN0IGJlIGVpdGhlciBhIHN0cmluZyBvciBhIGNvbXBvbmVudC5cIik7XG5cdH1cblx0aWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHZhciBjYWNoZWQgPSBzZWxlY3RvckNhY2hlW3NlbGVjdG9yXSB8fCBjb21waWxlU2VsZWN0b3Ioc2VsZWN0b3IpXG5cdH1cblx0aWYgKCFhdHRycykge1xuXHRcdGF0dHJzID0ge31cblx0fSBlbHNlIGlmICh0eXBlb2YgYXR0cnMgIT09IFwib2JqZWN0XCIgfHwgYXR0cnMudGFnICE9IG51bGwgfHwgQXJyYXkuaXNBcnJheShhdHRycykpIHtcblx0XHRhdHRycyA9IHt9XG5cdFx0c3RhcnQgPSAxXG5cdH1cblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IHN0YXJ0ICsgMSkge1xuXHRcdGNoaWxkcmVuID0gYXJndW1lbnRzW3N0YXJ0XVxuXHRcdGlmICghQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIGNoaWxkcmVuID0gW2NoaWxkcmVuXVxuXHR9IGVsc2Uge1xuXHRcdGNoaWxkcmVuID0gW11cblx0XHR3aGlsZSAoc3RhcnQgPCBhcmd1bWVudHMubGVuZ3RoKSBjaGlsZHJlbi5wdXNoKGFyZ3VtZW50c1tzdGFydCsrXSlcblx0fVxuXHR2YXIgbm9ybWFsaXplZCA9IFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKGNoaWxkcmVuKVxuXHRpZiAodHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIGV4ZWNTZWxlY3RvcihjYWNoZWQsIGF0dHJzLCBub3JtYWxpemVkKVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBWbm9kZShzZWxlY3RvciwgYXR0cnMua2V5LCBhdHRycywgbm9ybWFsaXplZClcblx0fVxufVxuaHlwZXJzY3JpcHQudHJ1c3QgPSBmdW5jdGlvbihodG1sKSB7XG5cdGlmIChodG1sID09IG51bGwpIGh0bWwgPSBcIlwiXG5cdHJldHVybiBWbm9kZShcIjxcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGh0bWwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxufVxuaHlwZXJzY3JpcHQuZnJhZ21lbnQgPSBmdW5jdGlvbihhdHRyczEsIGNoaWxkcmVuKSB7XG5cdHJldHVybiBWbm9kZShcIltcIiwgYXR0cnMxLmtleSwgYXR0cnMxLCBWbm9kZS5ub3JtYWxpemVDaGlsZHJlbihjaGlsZHJlbiksIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxufVxudmFyIG0gPSBoeXBlcnNjcmlwdFxuLyoqIEBjb25zdHJ1Y3RvciAqL1xudmFyIFByb21pc2VQb2x5ZmlsbCA9IGZ1bmN0aW9uKGV4ZWN1dG9yKSB7XG5cdGlmICghKHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlUG9seWZpbGwpKSB0aHJvdyBuZXcgRXJyb3IoXCJQcm9taXNlIG11c3QgYmUgY2FsbGVkIHdpdGggYG5ld2BcIilcblx0aWYgKHR5cGVvZiBleGVjdXRvciAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpXG5cdHZhciBzZWxmID0gdGhpcywgcmVzb2x2ZXJzID0gW10sIHJlamVjdG9ycyA9IFtdLCByZXNvbHZlQ3VycmVudCA9IGhhbmRsZXIocmVzb2x2ZXJzLCB0cnVlKSwgcmVqZWN0Q3VycmVudCA9IGhhbmRsZXIocmVqZWN0b3JzLCBmYWxzZSlcblx0dmFyIGluc3RhbmNlID0gc2VsZi5faW5zdGFuY2UgPSB7cmVzb2x2ZXJzOiByZXNvbHZlcnMsIHJlamVjdG9yczogcmVqZWN0b3JzfVxuXHR2YXIgY2FsbEFzeW5jID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gXCJmdW5jdGlvblwiID8gc2V0SW1tZWRpYXRlIDogc2V0VGltZW91dFxuXHRmdW5jdGlvbiBoYW5kbGVyKGxpc3QsIHNob3VsZEFic29yYikge1xuXHRcdHJldHVybiBmdW5jdGlvbiBleGVjdXRlKHZhbHVlKSB7XG5cdFx0XHR2YXIgdGhlblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKHNob3VsZEFic29yYiAmJiB2YWx1ZSAhPSBudWxsICYmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpICYmIHR5cGVvZiAodGhlbiA9IHZhbHVlLnRoZW4pID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRpZiAodmFsdWUgPT09IHNlbGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIHcvIGl0c2VsZlwiKVxuXHRcdFx0XHRcdGV4ZWN1dGVPbmNlKHRoZW4uYmluZCh2YWx1ZSkpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Y2FsbEFzeW5jKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aWYgKCFzaG91bGRBYnNvcmIgJiYgbGlzdC5sZW5ndGggPT09IDApIGNvbnNvbGUuZXJyb3IoXCJQb3NzaWJsZSB1bmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb246XCIsIHZhbHVlKVxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSBsaXN0W2ldKHZhbHVlKVxuXHRcdFx0XHRcdFx0cmVzb2x2ZXJzLmxlbmd0aCA9IDAsIHJlamVjdG9ycy5sZW5ndGggPSAwXG5cdFx0XHRcdFx0XHRpbnN0YW5jZS5zdGF0ZSA9IHNob3VsZEFic29yYlxuXHRcdFx0XHRcdFx0aW5zdGFuY2UucmV0cnkgPSBmdW5jdGlvbigpIHtleGVjdXRlKHZhbHVlKX1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRyZWplY3RDdXJyZW50KGUpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIGV4ZWN1dGVPbmNlKHRoZW4pIHtcblx0XHR2YXIgcnVucyA9IDBcblx0XHRmdW5jdGlvbiBydW4oZm4pIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRpZiAocnVucysrID4gMCkgcmV0dXJuXG5cdFx0XHRcdGZuKHZhbHVlKVxuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgb25lcnJvciA9IHJ1bihyZWplY3RDdXJyZW50KVxuXHRcdHRyeSB7dGhlbihydW4ocmVzb2x2ZUN1cnJlbnQpLCBvbmVycm9yKX0gY2F0Y2ggKGUpIHtvbmVycm9yKGUpfVxuXHR9XG5cdGV4ZWN1dGVPbmNlKGV4ZWN1dG9yKVxufVxuUHJvbWlzZVBvbHlmaWxsLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0aW9uKSB7XG5cdHZhciBzZWxmID0gdGhpcywgaW5zdGFuY2UgPSBzZWxmLl9pbnN0YW5jZVxuXHRmdW5jdGlvbiBoYW5kbGUoY2FsbGJhY2ssIGxpc3QsIG5leHQsIHN0YXRlKSB7XG5cdFx0bGlzdC5wdXNoKGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIG5leHQodmFsdWUpXG5cdFx0XHRlbHNlIHRyeSB7cmVzb2x2ZU5leHQoY2FsbGJhY2sodmFsdWUpKX0gY2F0Y2ggKGUpIHtpZiAocmVqZWN0TmV4dCkgcmVqZWN0TmV4dChlKX1cblx0XHR9KVxuXHRcdGlmICh0eXBlb2YgaW5zdGFuY2UucmV0cnkgPT09IFwiZnVuY3Rpb25cIiAmJiBzdGF0ZSA9PT0gaW5zdGFuY2Uuc3RhdGUpIGluc3RhbmNlLnJldHJ5KClcblx0fVxuXHR2YXIgcmVzb2x2ZU5leHQsIHJlamVjdE5leHRcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge3Jlc29sdmVOZXh0ID0gcmVzb2x2ZSwgcmVqZWN0TmV4dCA9IHJlamVjdH0pXG5cdGhhbmRsZShvbkZ1bGZpbGxlZCwgaW5zdGFuY2UucmVzb2x2ZXJzLCByZXNvbHZlTmV4dCwgdHJ1ZSksIGhhbmRsZShvblJlamVjdGlvbiwgaW5zdGFuY2UucmVqZWN0b3JzLCByZWplY3ROZXh0LCBmYWxzZSlcblx0cmV0dXJuIHByb21pc2Vcbn1cblByb21pc2VQb2x5ZmlsbC5wcm90b3R5cGUuY2F0Y2ggPSBmdW5jdGlvbihvblJlamVjdGlvbikge1xuXHRyZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKVxufVxuUHJvbWlzZVBvbHlmaWxsLnJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlUG9seWZpbGwpIHJldHVybiB2YWx1ZVxuXHRyZXR1cm4gbmV3IFByb21pc2VQb2x5ZmlsbChmdW5jdGlvbihyZXNvbHZlKSB7cmVzb2x2ZSh2YWx1ZSl9KVxufVxuUHJvbWlzZVBvbHlmaWxsLnJlamVjdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge3JlamVjdCh2YWx1ZSl9KVxufVxuUHJvbWlzZVBvbHlmaWxsLmFsbCA9IGZ1bmN0aW9uKGxpc3QpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlUG9seWZpbGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0dmFyIHRvdGFsID0gbGlzdC5sZW5ndGgsIGNvdW50ID0gMCwgdmFsdWVzID0gW11cblx0XHRpZiAobGlzdC5sZW5ndGggPT09IDApIHJlc29sdmUoW10pXG5cdFx0ZWxzZSBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdChmdW5jdGlvbihpKSB7XG5cdFx0XHRcdGZ1bmN0aW9uIGNvbnN1bWUodmFsdWUpIHtcblx0XHRcdFx0XHRjb3VudCsrXG5cdFx0XHRcdFx0dmFsdWVzW2ldID0gdmFsdWVcblx0XHRcdFx0XHRpZiAoY291bnQgPT09IHRvdGFsKSByZXNvbHZlKHZhbHVlcylcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobGlzdFtpXSAhPSBudWxsICYmICh0eXBlb2YgbGlzdFtpXSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgbGlzdFtpXSA9PT0gXCJmdW5jdGlvblwiKSAmJiB0eXBlb2YgbGlzdFtpXS50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRsaXN0W2ldLnRoZW4oY29uc3VtZSwgcmVqZWN0KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgY29uc3VtZShsaXN0W2ldKVxuXHRcdFx0fSkoaSlcblx0XHR9XG5cdH0pXG59XG5Qcm9taXNlUG9seWZpbGwucmFjZSA9IGZ1bmN0aW9uKGxpc3QpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlUG9seWZpbGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsaXN0W2ldLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KVxuXHRcdH1cblx0fSlcbn1cbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGlmICh0eXBlb2Ygd2luZG93LlByb21pc2UgPT09IFwidW5kZWZpbmVkXCIpIHdpbmRvdy5Qcm9taXNlID0gUHJvbWlzZVBvbHlmaWxsXG5cdHZhciBQcm9taXNlUG9seWZpbGwgPSB3aW5kb3cuUHJvbWlzZVxufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsLlByb21pc2UgPT09IFwidW5kZWZpbmVkXCIpIGdsb2JhbC5Qcm9taXNlID0gUHJvbWlzZVBvbHlmaWxsXG5cdHZhciBQcm9taXNlUG9seWZpbGwgPSBnbG9iYWwuUHJvbWlzZVxufSBlbHNlIHtcbn1cbnZhciBidWlsZFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24ob2JqZWN0KSB7XG5cdGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSAhPT0gXCJbb2JqZWN0IE9iamVjdF1cIikgcmV0dXJuIFwiXCJcblx0dmFyIGFyZ3MgPSBbXVxuXHRmb3IgKHZhciBrZXkwIGluIG9iamVjdCkge1xuXHRcdGRlc3RydWN0dXJlKGtleTAsIG9iamVjdFtrZXkwXSlcblx0fVxuXHRyZXR1cm4gYXJncy5qb2luKFwiJlwiKVxuXHRmdW5jdGlvbiBkZXN0cnVjdHVyZShrZXkwLCB2YWx1ZSkge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRkZXN0cnVjdHVyZShrZXkwICsgXCJbXCIgKyBpICsgXCJdXCIsIHZhbHVlW2ldKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG5cdFx0XHRmb3IgKHZhciBpIGluIHZhbHVlKSB7XG5cdFx0XHRcdGRlc3RydWN0dXJlKGtleTAgKyBcIltcIiArIGkgKyBcIl1cIiwgdmFsdWVbaV0pXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgYXJncy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkwKSArICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBcIlwiID8gXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpIDogXCJcIikpXG5cdH1cbn1cbnZhciBGSUxFX1BST1RPQ09MX1JFR0VYID0gbmV3IFJlZ0V4cChcIl5maWxlOi8vXCIsIFwiaVwiKVxudmFyIF84ID0gZnVuY3Rpb24oJHdpbmRvdywgUHJvbWlzZSkge1xuXHR2YXIgY2FsbGJhY2tDb3VudCA9IDBcblx0dmFyIG9uY29tcGxldGlvblxuXHRmdW5jdGlvbiBzZXRDb21wbGV0aW9uQ2FsbGJhY2soY2FsbGJhY2spIHtvbmNvbXBsZXRpb24gPSBjYWxsYmFja31cblx0ZnVuY3Rpb24gZmluYWxpemVyKCkge1xuXHRcdHZhciBjb3VudCA9IDBcblx0XHRmdW5jdGlvbiBjb21wbGV0ZSgpIHtpZiAoLS1jb3VudCA9PT0gMCAmJiB0eXBlb2Ygb25jb21wbGV0aW9uID09PSBcImZ1bmN0aW9uXCIpIG9uY29tcGxldGlvbigpfVxuXHRcdHJldHVybiBmdW5jdGlvbiBmaW5hbGl6ZShwcm9taXNlMCkge1xuXHRcdFx0dmFyIHRoZW4wID0gcHJvbWlzZTAudGhlblxuXHRcdFx0cHJvbWlzZTAudGhlbiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb3VudCsrXG5cdFx0XHRcdHZhciBuZXh0ID0gdGhlbjAuYXBwbHkocHJvbWlzZTAsIGFyZ3VtZW50cylcblx0XHRcdFx0bmV4dC50aGVuKGNvbXBsZXRlLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0Y29tcGxldGUoKVxuXHRcdFx0XHRcdGlmIChjb3VudCA9PT0gMCkgdGhyb3cgZVxuXHRcdFx0XHR9KVxuXHRcdFx0XHRyZXR1cm4gZmluYWxpemUobmV4dClcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcm9taXNlMFxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBub3JtYWxpemUoYXJncywgZXh0cmEpIHtcblx0XHRpZiAodHlwZW9mIGFyZ3MgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHZhciB1cmwgPSBhcmdzXG5cdFx0XHRhcmdzID0gZXh0cmEgfHwge31cblx0XHRcdGlmIChhcmdzLnVybCA9PSBudWxsKSBhcmdzLnVybCA9IHVybFxuXHRcdH1cblx0XHRyZXR1cm4gYXJnc1xuXHR9XG5cdGZ1bmN0aW9uIHJlcXVlc3QoYXJncywgZXh0cmEpIHtcblx0XHR2YXIgZmluYWxpemUgPSBmaW5hbGl6ZXIoKVxuXHRcdGFyZ3MgPSBub3JtYWxpemUoYXJncywgZXh0cmEpXG5cdFx0dmFyIHByb21pc2UwID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRpZiAoYXJncy5tZXRob2QgPT0gbnVsbCkgYXJncy5tZXRob2QgPSBcIkdFVFwiXG5cdFx0XHRhcmdzLm1ldGhvZCA9IGFyZ3MubWV0aG9kLnRvVXBwZXJDYXNlKClcblx0XHRcdHZhciB1c2VCb2R5ID0gKGFyZ3MubWV0aG9kID09PSBcIkdFVFwiIHx8IGFyZ3MubWV0aG9kID09PSBcIlRSQUNFXCIpID8gZmFsc2UgOiAodHlwZW9mIGFyZ3MudXNlQm9keSA9PT0gXCJib29sZWFuXCIgPyBhcmdzLnVzZUJvZHkgOiB0cnVlKVxuXHRcdFx0aWYgKHR5cGVvZiBhcmdzLnNlcmlhbGl6ZSAhPT0gXCJmdW5jdGlvblwiKSBhcmdzLnNlcmlhbGl6ZSA9IHR5cGVvZiBGb3JtRGF0YSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhcmdzLmRhdGEgaW5zdGFuY2VvZiBGb3JtRGF0YSA/IGZ1bmN0aW9uKHZhbHVlKSB7cmV0dXJuIHZhbHVlfSA6IEpTT04uc3RyaW5naWZ5XG5cdFx0XHRpZiAodHlwZW9mIGFyZ3MuZGVzZXJpYWxpemUgIT09IFwiZnVuY3Rpb25cIikgYXJncy5kZXNlcmlhbGl6ZSA9IGRlc2VyaWFsaXplXG5cdFx0XHRpZiAodHlwZW9mIGFyZ3MuZXh0cmFjdCAhPT0gXCJmdW5jdGlvblwiKSBhcmdzLmV4dHJhY3QgPSBleHRyYWN0XG5cdFx0XHRhcmdzLnVybCA9IGludGVycG9sYXRlKGFyZ3MudXJsLCBhcmdzLmRhdGEpXG5cdFx0XHRpZiAodXNlQm9keSkgYXJncy5kYXRhID0gYXJncy5zZXJpYWxpemUoYXJncy5kYXRhKVxuXHRcdFx0ZWxzZSBhcmdzLnVybCA9IGFzc2VtYmxlKGFyZ3MudXJsLCBhcmdzLmRhdGEpXG5cdFx0XHR2YXIgeGhyID0gbmV3ICR3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKSxcblx0XHRcdFx0YWJvcnRlZCA9IGZhbHNlLFxuXHRcdFx0XHRfYWJvcnQgPSB4aHIuYWJvcnRcblx0XHRcdHhoci5hYm9ydCA9IGZ1bmN0aW9uIGFib3J0KCkge1xuXHRcdFx0XHRhYm9ydGVkID0gdHJ1ZVxuXHRcdFx0XHRfYWJvcnQuY2FsbCh4aHIpXG5cdFx0XHR9XG5cdFx0XHR4aHIub3BlbihhcmdzLm1ldGhvZCwgYXJncy51cmwsIHR5cGVvZiBhcmdzLmFzeW5jID09PSBcImJvb2xlYW5cIiA/IGFyZ3MuYXN5bmMgOiB0cnVlLCB0eXBlb2YgYXJncy51c2VyID09PSBcInN0cmluZ1wiID8gYXJncy51c2VyIDogdW5kZWZpbmVkLCB0eXBlb2YgYXJncy5wYXNzd29yZCA9PT0gXCJzdHJpbmdcIiA/IGFyZ3MucGFzc3dvcmQgOiB1bmRlZmluZWQpXG5cdFx0XHRpZiAoYXJncy5zZXJpYWxpemUgPT09IEpTT04uc3RyaW5naWZ5ICYmIHVzZUJvZHkpIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpXG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJncy5kZXNlcmlhbGl6ZSA9PT0gZGVzZXJpYWxpemUpIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0LypcIilcblx0XHRcdH1cblx0XHRcdGlmIChhcmdzLndpdGhDcmVkZW50aWFscykgeGhyLndpdGhDcmVkZW50aWFscyA9IGFyZ3Mud2l0aENyZWRlbnRpYWxzXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJncy5oZWFkZXJzKSBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChhcmdzLmhlYWRlcnMsIGtleSkpIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBhcmdzLmhlYWRlcnNba2V5XSlcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YgYXJncy5jb25maWcgPT09IFwiZnVuY3Rpb25cIikgeGhyID0gYXJncy5jb25maWcoeGhyLCBhcmdzKSB8fCB4aHJcblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gRG9uJ3QgdGhyb3cgZXJyb3JzIG9uIHhoci5hYm9ydCgpLlxuXHRcdFx0XHRpZihhYm9ydGVkKSByZXR1cm5cblx0XHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhciByZXNwb25zZSA9IChhcmdzLmV4dHJhY3QgIT09IGV4dHJhY3QpID8gYXJncy5leHRyYWN0KHhociwgYXJncykgOiBhcmdzLmRlc2VyaWFsaXplKGFyZ3MuZXh0cmFjdCh4aHIsIGFyZ3MpKVxuXHRcdFx0XHRcdFx0aWYgKCh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB8fCB4aHIuc3RhdHVzID09PSAzMDQgfHwgRklMRV9QUk9UT0NPTF9SRUdFWC50ZXN0KGFyZ3MudXJsKSkge1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGNhc3QoYXJncy50eXBlLCByZXNwb25zZSkpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0gbmV3IEVycm9yKHhoci5yZXNwb25zZVRleHQpXG5cdFx0XHRcdFx0XHRcdGZvciAodmFyIGtleSBpbiByZXNwb25zZSkgZXJyb3Jba2V5XSA9IHJlc3BvbnNlW2tleV1cblx0XHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0cmVqZWN0KGUpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodXNlQm9keSAmJiAoYXJncy5kYXRhICE9IG51bGwpKSB4aHIuc2VuZChhcmdzLmRhdGEpXG5cdFx0XHRlbHNlIHhoci5zZW5kKClcblx0XHR9KVxuXHRcdHJldHVybiBhcmdzLmJhY2tncm91bmQgPT09IHRydWUgPyBwcm9taXNlMCA6IGZpbmFsaXplKHByb21pc2UwKVxuXHR9XG5cdGZ1bmN0aW9uIGpzb25wKGFyZ3MsIGV4dHJhKSB7XG5cdFx0dmFyIGZpbmFsaXplID0gZmluYWxpemVyKClcblx0XHRhcmdzID0gbm9ybWFsaXplKGFyZ3MsIGV4dHJhKVxuXHRcdHZhciBwcm9taXNlMCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0dmFyIGNhbGxiYWNrTmFtZSA9IGFyZ3MuY2FsbGJhY2tOYW1lIHx8IFwiX21pdGhyaWxfXCIgKyBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxZTE2KSArIFwiX1wiICsgY2FsbGJhY2tDb3VudCsrXG5cdFx0XHR2YXIgc2NyaXB0ID0gJHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpXG5cdFx0XHQkd2luZG93W2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdClcblx0XHRcdFx0cmVzb2x2ZShjYXN0KGFyZ3MudHlwZSwgZGF0YSkpXG5cdFx0XHRcdGRlbGV0ZSAkd2luZG93W2NhbGxiYWNrTmFtZV1cblx0XHRcdH1cblx0XHRcdHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdClcblx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIkpTT05QIHJlcXVlc3QgZmFpbGVkXCIpKVxuXHRcdFx0XHRkZWxldGUgJHdpbmRvd1tjYWxsYmFja05hbWVdXG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJncy5kYXRhID09IG51bGwpIGFyZ3MuZGF0YSA9IHt9XG5cdFx0XHRhcmdzLnVybCA9IGludGVycG9sYXRlKGFyZ3MudXJsLCBhcmdzLmRhdGEpXG5cdFx0XHRhcmdzLmRhdGFbYXJncy5jYWxsYmFja0tleSB8fCBcImNhbGxiYWNrXCJdID0gY2FsbGJhY2tOYW1lXG5cdFx0XHRzY3JpcHQuc3JjID0gYXNzZW1ibGUoYXJncy51cmwsIGFyZ3MuZGF0YSlcblx0XHRcdCR3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKHNjcmlwdClcblx0XHR9KVxuXHRcdHJldHVybiBhcmdzLmJhY2tncm91bmQgPT09IHRydWU/IHByb21pc2UwIDogZmluYWxpemUocHJvbWlzZTApXG5cdH1cblx0ZnVuY3Rpb24gaW50ZXJwb2xhdGUodXJsLCBkYXRhKSB7XG5cdFx0aWYgKGRhdGEgPT0gbnVsbCkgcmV0dXJuIHVybFxuXHRcdHZhciB0b2tlbnMgPSB1cmwubWF0Y2goLzpbXlxcL10rL2dpKSB8fCBbXVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIga2V5ID0gdG9rZW5zW2ldLnNsaWNlKDEpXG5cdFx0XHRpZiAoZGF0YVtrZXldICE9IG51bGwpIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UodG9rZW5zW2ldLCBkYXRhW2tleV0pXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB1cmxcblx0fVxuXHRmdW5jdGlvbiBhc3NlbWJsZSh1cmwsIGRhdGEpIHtcblx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKGRhdGEpXG5cdFx0aWYgKHF1ZXJ5c3RyaW5nICE9PSBcIlwiKSB7XG5cdFx0XHR2YXIgcHJlZml4ID0gdXJsLmluZGV4T2YoXCI/XCIpIDwgMCA/IFwiP1wiIDogXCImXCJcblx0XHRcdHVybCArPSBwcmVmaXggKyBxdWVyeXN0cmluZ1xuXHRcdH1cblx0XHRyZXR1cm4gdXJsXG5cdH1cblx0ZnVuY3Rpb24gZGVzZXJpYWxpemUoZGF0YSkge1xuXHRcdHRyeSB7cmV0dXJuIGRhdGEgIT09IFwiXCIgPyBKU09OLnBhcnNlKGRhdGEpIDogbnVsbH1cblx0XHRjYXRjaCAoZSkge3Rocm93IG5ldyBFcnJvcihkYXRhKX1cblx0fVxuXHRmdW5jdGlvbiBleHRyYWN0KHhocikge3JldHVybiB4aHIucmVzcG9uc2VUZXh0fVxuXHRmdW5jdGlvbiBjYXN0KHR5cGUwLCBkYXRhKSB7XG5cdFx0aWYgKHR5cGVvZiB0eXBlMCA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRkYXRhW2ldID0gbmV3IHR5cGUwKGRhdGFbaV0pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgcmV0dXJuIG5ldyB0eXBlMChkYXRhKVxuXHRcdH1cblx0XHRyZXR1cm4gZGF0YVxuXHR9XG5cdHJldHVybiB7cmVxdWVzdDogcmVxdWVzdCwganNvbnA6IGpzb25wLCBzZXRDb21wbGV0aW9uQ2FsbGJhY2s6IHNldENvbXBsZXRpb25DYWxsYmFja31cbn1cbnZhciByZXF1ZXN0U2VydmljZSA9IF84KHdpbmRvdywgUHJvbWlzZVBvbHlmaWxsKVxudmFyIGNvcmVSZW5kZXJlciA9IGZ1bmN0aW9uKCR3aW5kb3cpIHtcblx0dmFyICRkb2MgPSAkd2luZG93LmRvY3VtZW50XG5cdHZhciAkZW1wdHlGcmFnbWVudCA9ICRkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdHZhciBvbmV2ZW50XG5cdGZ1bmN0aW9uIHNldEV2ZW50Q2FsbGJhY2soY2FsbGJhY2spIHtyZXR1cm4gb25ldmVudCA9IGNhbGxiYWNrfVxuXHQvL2NyZWF0ZVxuXHRmdW5jdGlvbiBjcmVhdGVOb2RlcyhwYXJlbnQsIHZub2Rlcywgc3RhcnQsIGVuZCwgaG9va3MsIG5leHRTaWJsaW5nLCBucykge1xuXHRcdGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG5cdFx0XHR2YXIgdm5vZGUgPSB2bm9kZXNbaV1cblx0XHRcdGlmICh2bm9kZSAhPSBudWxsKSB7XG5cdFx0XHRcdGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKSB7XG5cdFx0dmFyIHRhZyA9IHZub2RlLnRhZ1xuXHRcdGlmICh0eXBlb2YgdGFnID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHR2bm9kZS5zdGF0ZSA9IHt9XG5cdFx0XHRpZiAodm5vZGUuYXR0cnMgIT0gbnVsbCkgaW5pdExpZmVjeWNsZSh2bm9kZS5hdHRycywgdm5vZGUsIGhvb2tzKVxuXHRcdFx0c3dpdGNoICh0YWcpIHtcblx0XHRcdFx0Y2FzZSBcIiNcIjogcmV0dXJuIGNyZWF0ZVRleHQocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdGNhc2UgXCI8XCI6IHJldHVybiBjcmVhdGVIVE1MKHBhcmVudCwgdm5vZGUsIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRjYXNlIFwiW1wiOiByZXR1cm4gY3JlYXRlRnJhZ21lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdFx0ZGVmYXVsdDogcmV0dXJuIGNyZWF0ZUVsZW1lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSByZXR1cm4gY3JlYXRlQ29tcG9uZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlVGV4dChwYXJlbnQsIHZub2RlLCBuZXh0U2libGluZykge1xuXHRcdHZub2RlLmRvbSA9ICRkb2MuY3JlYXRlVGV4dE5vZGUodm5vZGUuY2hpbGRyZW4pXG5cdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIHZub2RlLmRvbSwgbmV4dFNpYmxpbmcpXG5cdFx0cmV0dXJuIHZub2RlLmRvbVxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZUhUTUwocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpIHtcblx0XHR2YXIgbWF0Y2gxID0gdm5vZGUuY2hpbGRyZW4ubWF0Y2goL15cXHMqPzwoXFx3KykvaW0pIHx8IFtdXG5cdFx0dmFyIHBhcmVudDEgPSB7Y2FwdGlvbjogXCJ0YWJsZVwiLCB0aGVhZDogXCJ0YWJsZVwiLCB0Ym9keTogXCJ0YWJsZVwiLCB0Zm9vdDogXCJ0YWJsZVwiLCB0cjogXCJ0Ym9keVwiLCB0aDogXCJ0clwiLCB0ZDogXCJ0clwiLCBjb2xncm91cDogXCJ0YWJsZVwiLCBjb2w6IFwiY29sZ3JvdXBcIn1bbWF0Y2gxWzFdXSB8fCBcImRpdlwiXG5cdFx0dmFyIHRlbXAgPSAkZG9jLmNyZWF0ZUVsZW1lbnQocGFyZW50MSlcblx0XHR0ZW1wLmlubmVySFRNTCA9IHZub2RlLmNoaWxkcmVuXG5cdFx0dm5vZGUuZG9tID0gdGVtcC5maXJzdENoaWxkXG5cdFx0dm5vZGUuZG9tU2l6ZSA9IHRlbXAuY2hpbGROb2Rlcy5sZW5ndGhcblx0XHR2YXIgZnJhZ21lbnQgPSAkZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdHZhciBjaGlsZFxuXHRcdHdoaWxlIChjaGlsZCA9IHRlbXAuZmlyc3RDaGlsZCkge1xuXHRcdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpXG5cdFx0fVxuXHRcdGluc2VydE5vZGUocGFyZW50LCBmcmFnbWVudCwgbmV4dFNpYmxpbmcpXG5cdFx0cmV0dXJuIGZyYWdtZW50XG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZykge1xuXHRcdHZhciBmcmFnbWVudCA9ICRkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0aWYgKHZub2RlLmNoaWxkcmVuICE9IG51bGwpIHtcblx0XHRcdHZhciBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG5cdFx0XHRjcmVhdGVOb2RlcyhmcmFnbWVudCwgY2hpbGRyZW4sIDAsIGNoaWxkcmVuLmxlbmd0aCwgaG9va3MsIG51bGwsIG5zKVxuXHRcdH1cblx0XHR2bm9kZS5kb20gPSBmcmFnbWVudC5maXJzdENoaWxkXG5cdFx0dm5vZGUuZG9tU2l6ZSA9IGZyYWdtZW50LmNoaWxkTm9kZXMubGVuZ3RoXG5cdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIGZyYWdtZW50LCBuZXh0U2libGluZylcblx0XHRyZXR1cm4gZnJhZ21lbnRcblx0fVxuXHRmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpIHtcblx0XHR2YXIgdGFnID0gdm5vZGUudGFnXG5cdFx0c3dpdGNoICh2bm9kZS50YWcpIHtcblx0XHRcdGNhc2UgXCJzdmdcIjogbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7IGJyZWFrXG5cdFx0XHRjYXNlIFwibWF0aFwiOiBucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiOyBicmVha1xuXHRcdH1cblx0XHR2YXIgYXR0cnMyID0gdm5vZGUuYXR0cnNcblx0XHR2YXIgaXMgPSBhdHRyczIgJiYgYXR0cnMyLmlzXG5cdFx0dmFyIGVsZW1lbnQgPSBucyA/XG5cdFx0XHRpcyA/ICRkb2MuY3JlYXRlRWxlbWVudE5TKG5zLCB0YWcsIHtpczogaXN9KSA6ICRkb2MuY3JlYXRlRWxlbWVudE5TKG5zLCB0YWcpIDpcblx0XHRcdGlzID8gJGRvYy5jcmVhdGVFbGVtZW50KHRhZywge2lzOiBpc30pIDogJGRvYy5jcmVhdGVFbGVtZW50KHRhZylcblx0XHR2bm9kZS5kb20gPSBlbGVtZW50XG5cdFx0aWYgKGF0dHJzMiAhPSBudWxsKSB7XG5cdFx0XHRzZXRBdHRycyh2bm9kZSwgYXR0cnMyLCBucylcblx0XHR9XG5cdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIGVsZW1lbnQsIG5leHRTaWJsaW5nKVxuXHRcdGlmICh2bm9kZS5hdHRycyAhPSBudWxsICYmIHZub2RlLmF0dHJzLmNvbnRlbnRlZGl0YWJsZSAhPSBudWxsKSB7XG5cdFx0XHRzZXRDb250ZW50RWRpdGFibGUodm5vZGUpXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aWYgKHZub2RlLnRleHQgIT0gbnVsbCkge1xuXHRcdFx0XHRpZiAodm5vZGUudGV4dCAhPT0gXCJcIikgZWxlbWVudC50ZXh0Q29udGVudCA9IHZub2RlLnRleHRcblx0XHRcdFx0ZWxzZSB2bm9kZS5jaGlsZHJlbiA9IFtWbm9kZShcIiNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHZub2RlLnRleHQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKV1cblx0XHRcdH1cblx0XHRcdGlmICh2bm9kZS5jaGlsZHJlbiAhPSBudWxsKSB7XG5cdFx0XHRcdHZhciBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG5cdFx0XHRcdGNyZWF0ZU5vZGVzKGVsZW1lbnQsIGNoaWxkcmVuLCAwLCBjaGlsZHJlbi5sZW5ndGgsIGhvb2tzLCBudWxsLCBucylcblx0XHRcdFx0c2V0TGF0ZUF0dHJzKHZub2RlKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZWxlbWVudFxuXHR9XG5cdGZ1bmN0aW9uIGluaXRDb21wb25lbnQodm5vZGUsIGhvb2tzKSB7XG5cdFx0dmFyIHNlbnRpbmVsXG5cdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcudmlldyA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHR2bm9kZS5zdGF0ZSA9IE9iamVjdC5jcmVhdGUodm5vZGUudGFnKVxuXHRcdFx0c2VudGluZWwgPSB2bm9kZS5zdGF0ZS52aWV3XG5cdFx0XHRpZiAoc2VudGluZWwuJCRyZWVudHJhbnRMb2NrJCQgIT0gbnVsbCkgcmV0dXJuICRlbXB0eUZyYWdtZW50XG5cdFx0XHRzZW50aW5lbC4kJHJlZW50cmFudExvY2skJCA9IHRydWVcblx0XHR9IGVsc2Uge1xuXHRcdFx0dm5vZGUuc3RhdGUgPSB2b2lkIDBcblx0XHRcdHNlbnRpbmVsID0gdm5vZGUudGFnXG5cdFx0XHRpZiAoc2VudGluZWwuJCRyZWVudHJhbnRMb2NrJCQgIT0gbnVsbCkgcmV0dXJuICRlbXB0eUZyYWdtZW50XG5cdFx0XHRzZW50aW5lbC4kJHJlZW50cmFudExvY2skJCA9IHRydWVcblx0XHRcdHZub2RlLnN0YXRlID0gKHZub2RlLnRhZy5wcm90b3R5cGUgIT0gbnVsbCAmJiB0eXBlb2Ygdm5vZGUudGFnLnByb3RvdHlwZS52aWV3ID09PSBcImZ1bmN0aW9uXCIpID8gbmV3IHZub2RlLnRhZyh2bm9kZSkgOiB2bm9kZS50YWcodm5vZGUpXG5cdFx0fVxuXHRcdHZub2RlLl9zdGF0ZSA9IHZub2RlLnN0YXRlXG5cdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIGluaXRMaWZlY3ljbGUodm5vZGUuYXR0cnMsIHZub2RlLCBob29rcylcblx0XHRpbml0TGlmZWN5Y2xlKHZub2RlLl9zdGF0ZSwgdm5vZGUsIGhvb2tzKVxuXHRcdHZub2RlLmluc3RhbmNlID0gVm5vZGUubm9ybWFsaXplKHZub2RlLl9zdGF0ZS52aWV3LmNhbGwodm5vZGUuc3RhdGUsIHZub2RlKSlcblx0XHRpZiAodm5vZGUuaW5zdGFuY2UgPT09IHZub2RlKSB0aHJvdyBFcnJvcihcIkEgdmlldyBjYW5ub3QgcmV0dXJuIHRoZSB2bm9kZSBpdCByZWNlaXZlZCBhcyBhcmd1bWVudFwiKVxuXHRcdHNlbnRpbmVsLiQkcmVlbnRyYW50TG9jayQkID0gbnVsbFxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKSB7XG5cdFx0aW5pdENvbXBvbmVudCh2bm9kZSwgaG9va3MpXG5cdFx0aWYgKHZub2RlLmluc3RhbmNlICE9IG51bGwpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gY3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLmluc3RhbmNlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdFx0dm5vZGUuZG9tID0gdm5vZGUuaW5zdGFuY2UuZG9tXG5cdFx0XHR2bm9kZS5kb21TaXplID0gdm5vZGUuZG9tICE9IG51bGwgPyB2bm9kZS5pbnN0YW5jZS5kb21TaXplIDogMFxuXHRcdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIGVsZW1lbnQsIG5leHRTaWJsaW5nKVxuXHRcdFx0cmV0dXJuIGVsZW1lbnRcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR2bm9kZS5kb21TaXplID0gMFxuXHRcdFx0cmV0dXJuICRlbXB0eUZyYWdtZW50XG5cdFx0fVxuXHR9XG5cdC8vdXBkYXRlXG5cdGZ1bmN0aW9uIHVwZGF0ZU5vZGVzKHBhcmVudCwgb2xkLCB2bm9kZXMsIHJlY3ljbGluZywgaG9va3MsIG5leHRTaWJsaW5nLCBucykge1xuXHRcdGlmIChvbGQgPT09IHZub2RlcyB8fCBvbGQgPT0gbnVsbCAmJiB2bm9kZXMgPT0gbnVsbCkgcmV0dXJuXG5cdFx0ZWxzZSBpZiAob2xkID09IG51bGwpIGNyZWF0ZU5vZGVzKHBhcmVudCwgdm5vZGVzLCAwLCB2bm9kZXMubGVuZ3RoLCBob29rcywgbmV4dFNpYmxpbmcsIHVuZGVmaW5lZClcblx0XHRlbHNlIGlmICh2bm9kZXMgPT0gbnVsbCkgcmVtb3ZlTm9kZXMob2xkLCAwLCBvbGQubGVuZ3RoLCB2bm9kZXMpXG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAob2xkLmxlbmd0aCA9PT0gdm5vZGVzLmxlbmd0aCkge1xuXHRcdFx0XHR2YXIgaXNVbmtleWVkID0gZmFsc2Vcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2bm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAodm5vZGVzW2ldICE9IG51bGwgJiYgb2xkW2ldICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGlzVW5rZXllZCA9IHZub2Rlc1tpXS5rZXkgPT0gbnVsbCAmJiBvbGRbaV0ua2V5ID09IG51bGxcblx0XHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChpc1Vua2V5ZWQpIHtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG9sZC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYgKG9sZFtpXSA9PT0gdm5vZGVzW2ldKSBjb250aW51ZVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAob2xkW2ldID09IG51bGwgJiYgdm5vZGVzW2ldICE9IG51bGwpIGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZXNbaV0sIGhvb2tzLCBucywgZ2V0TmV4dFNpYmxpbmcob2xkLCBpICsgMSwgbmV4dFNpYmxpbmcpKVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAodm5vZGVzW2ldID09IG51bGwpIHJlbW92ZU5vZGVzKG9sZCwgaSwgaSArIDEsIHZub2Rlcylcblx0XHRcdFx0XHRcdGVsc2UgdXBkYXRlTm9kZShwYXJlbnQsIG9sZFtpXSwgdm5vZGVzW2ldLCBob29rcywgZ2V0TmV4dFNpYmxpbmcob2xkLCBpICsgMSwgbmV4dFNpYmxpbmcpLCByZWN5Y2xpbmcsIG5zKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmVjeWNsaW5nID0gcmVjeWNsaW5nIHx8IGlzUmVjeWNsYWJsZShvbGQsIHZub2Rlcylcblx0XHRcdGlmIChyZWN5Y2xpbmcpIHtcblx0XHRcdFx0dmFyIHBvb2wgPSBvbGQucG9vbFxuXHRcdFx0XHRvbGQgPSBvbGQuY29uY2F0KG9sZC5wb29sKVxuXHRcdFx0fVxuXHRcdFx0dmFyIG9sZFN0YXJ0ID0gMCwgc3RhcnQgPSAwLCBvbGRFbmQgPSBvbGQubGVuZ3RoIC0gMSwgZW5kID0gdm5vZGVzLmxlbmd0aCAtIDEsIG1hcFxuXHRcdFx0d2hpbGUgKG9sZEVuZCA+PSBvbGRTdGFydCAmJiBlbmQgPj0gc3RhcnQpIHtcblx0XHRcdFx0dmFyIG8gPSBvbGRbb2xkU3RhcnRdLCB2ID0gdm5vZGVzW3N0YXJ0XVxuXHRcdFx0XHRpZiAobyA9PT0gdiAmJiAhcmVjeWNsaW5nKSBvbGRTdGFydCsrLCBzdGFydCsrXG5cdFx0XHRcdGVsc2UgaWYgKG8gPT0gbnVsbCkgb2xkU3RhcnQrK1xuXHRcdFx0XHRlbHNlIGlmICh2ID09IG51bGwpIHN0YXJ0Kytcblx0XHRcdFx0ZWxzZSBpZiAoby5rZXkgPT09IHYua2V5KSB7XG5cdFx0XHRcdFx0dmFyIHNob3VsZFJlY3ljbGUgPSAocG9vbCAhPSBudWxsICYmIG9sZFN0YXJ0ID49IG9sZC5sZW5ndGggLSBwb29sLmxlbmd0aCkgfHwgKChwb29sID09IG51bGwpICYmIHJlY3ljbGluZylcblx0XHRcdFx0XHRvbGRTdGFydCsrLCBzdGFydCsrXG5cdFx0XHRcdFx0dXBkYXRlTm9kZShwYXJlbnQsIG8sIHYsIGhvb2tzLCBnZXROZXh0U2libGluZyhvbGQsIG9sZFN0YXJ0LCBuZXh0U2libGluZyksIHNob3VsZFJlY3ljbGUsIG5zKVxuXHRcdFx0XHRcdGlmIChyZWN5Y2xpbmcgJiYgby50YWcgPT09IHYudGFnKSBpbnNlcnROb2RlKHBhcmVudCwgdG9GcmFnbWVudChvKSwgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmFyIG8gPSBvbGRbb2xkRW5kXVxuXHRcdFx0XHRcdGlmIChvID09PSB2ICYmICFyZWN5Y2xpbmcpIG9sZEVuZC0tLCBzdGFydCsrXG5cdFx0XHRcdFx0ZWxzZSBpZiAobyA9PSBudWxsKSBvbGRFbmQtLVxuXHRcdFx0XHRcdGVsc2UgaWYgKHYgPT0gbnVsbCkgc3RhcnQrK1xuXHRcdFx0XHRcdGVsc2UgaWYgKG8ua2V5ID09PSB2LmtleSkge1xuXHRcdFx0XHRcdFx0dmFyIHNob3VsZFJlY3ljbGUgPSAocG9vbCAhPSBudWxsICYmIG9sZEVuZCA+PSBvbGQubGVuZ3RoIC0gcG9vbC5sZW5ndGgpIHx8ICgocG9vbCA9PSBudWxsKSAmJiByZWN5Y2xpbmcpXG5cdFx0XHRcdFx0XHR1cGRhdGVOb2RlKHBhcmVudCwgbywgdiwgaG9va3MsIGdldE5leHRTaWJsaW5nKG9sZCwgb2xkRW5kICsgMSwgbmV4dFNpYmxpbmcpLCBzaG91bGRSZWN5Y2xlLCBucylcblx0XHRcdFx0XHRcdGlmIChyZWN5Y2xpbmcgfHwgc3RhcnQgPCBlbmQpIGluc2VydE5vZGUocGFyZW50LCB0b0ZyYWdtZW50KG8pLCBnZXROZXh0U2libGluZyhvbGQsIG9sZFN0YXJ0LCBuZXh0U2libGluZykpXG5cdFx0XHRcdFx0XHRvbGRFbmQtLSwgc3RhcnQrK1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGJyZWFrXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHdoaWxlIChvbGRFbmQgPj0gb2xkU3RhcnQgJiYgZW5kID49IHN0YXJ0KSB7XG5cdFx0XHRcdHZhciBvID0gb2xkW29sZEVuZF0sIHYgPSB2bm9kZXNbZW5kXVxuXHRcdFx0XHRpZiAobyA9PT0gdiAmJiAhcmVjeWNsaW5nKSBvbGRFbmQtLSwgZW5kLS1cblx0XHRcdFx0ZWxzZSBpZiAobyA9PSBudWxsKSBvbGRFbmQtLVxuXHRcdFx0XHRlbHNlIGlmICh2ID09IG51bGwpIGVuZC0tXG5cdFx0XHRcdGVsc2UgaWYgKG8ua2V5ID09PSB2LmtleSkge1xuXHRcdFx0XHRcdHZhciBzaG91bGRSZWN5Y2xlID0gKHBvb2wgIT0gbnVsbCAmJiBvbGRFbmQgPj0gb2xkLmxlbmd0aCAtIHBvb2wubGVuZ3RoKSB8fCAoKHBvb2wgPT0gbnVsbCkgJiYgcmVjeWNsaW5nKVxuXHRcdFx0XHRcdHVwZGF0ZU5vZGUocGFyZW50LCBvLCB2LCBob29rcywgZ2V0TmV4dFNpYmxpbmcob2xkLCBvbGRFbmQgKyAxLCBuZXh0U2libGluZyksIHNob3VsZFJlY3ljbGUsIG5zKVxuXHRcdFx0XHRcdGlmIChyZWN5Y2xpbmcgJiYgby50YWcgPT09IHYudGFnKSBpbnNlcnROb2RlKHBhcmVudCwgdG9GcmFnbWVudChvKSwgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdFx0aWYgKG8uZG9tICE9IG51bGwpIG5leHRTaWJsaW5nID0gby5kb21cblx0XHRcdFx0XHRvbGRFbmQtLSwgZW5kLS1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRpZiAoIW1hcCkgbWFwID0gZ2V0S2V5TWFwKG9sZCwgb2xkRW5kKVxuXHRcdFx0XHRcdGlmICh2ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdHZhciBvbGRJbmRleCA9IG1hcFt2LmtleV1cblx0XHRcdFx0XHRcdGlmIChvbGRJbmRleCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBtb3ZhYmxlID0gb2xkW29sZEluZGV4XVxuXHRcdFx0XHRcdFx0XHR2YXIgc2hvdWxkUmVjeWNsZSA9IChwb29sICE9IG51bGwgJiYgb2xkSW5kZXggPj0gb2xkLmxlbmd0aCAtIHBvb2wubGVuZ3RoKSB8fCAoKHBvb2wgPT0gbnVsbCkgJiYgcmVjeWNsaW5nKVxuXHRcdFx0XHRcdFx0XHR1cGRhdGVOb2RlKHBhcmVudCwgbW92YWJsZSwgdiwgaG9va3MsIGdldE5leHRTaWJsaW5nKG9sZCwgb2xkRW5kICsgMSwgbmV4dFNpYmxpbmcpLCByZWN5Y2xpbmcsIG5zKVxuXHRcdFx0XHRcdFx0XHRpbnNlcnROb2RlKHBhcmVudCwgdG9GcmFnbWVudChtb3ZhYmxlKSwgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdFx0XHRcdG9sZFtvbGRJbmRleF0uc2tpcCA9IHRydWVcblx0XHRcdFx0XHRcdFx0aWYgKG1vdmFibGUuZG9tICE9IG51bGwpIG5leHRTaWJsaW5nID0gbW92YWJsZS5kb21cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR2YXIgZG9tID0gY3JlYXRlTm9kZShwYXJlbnQsIHYsIGhvb2tzLCB1bmRlZmluZWQsIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdFx0XHRuZXh0U2libGluZyA9IGRvbVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbmQtLVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChlbmQgPCBzdGFydCkgYnJlYWtcblx0XHRcdH1cblx0XHRcdGNyZWF0ZU5vZGVzKHBhcmVudCwgdm5vZGVzLCBzdGFydCwgZW5kICsgMSwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHRcdHJlbW92ZU5vZGVzKG9sZCwgb2xkU3RhcnQsIG9sZEVuZCArIDEsIHZub2Rlcylcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlTm9kZShwYXJlbnQsIG9sZCwgdm5vZGUsIGhvb2tzLCBuZXh0U2libGluZywgcmVjeWNsaW5nLCBucykge1xuXHRcdHZhciBvbGRUYWcgPSBvbGQudGFnLCB0YWcgPSB2bm9kZS50YWdcblx0XHRpZiAob2xkVGFnID09PSB0YWcpIHtcblx0XHRcdHZub2RlLnN0YXRlID0gb2xkLnN0YXRlXG5cdFx0XHR2bm9kZS5fc3RhdGUgPSBvbGQuX3N0YXRlXG5cdFx0XHR2bm9kZS5ldmVudHMgPSBvbGQuZXZlbnRzXG5cdFx0XHRpZiAoIXJlY3ljbGluZyAmJiBzaG91bGROb3RVcGRhdGUodm5vZGUsIG9sZCkpIHJldHVyblxuXHRcdFx0aWYgKHR5cGVvZiBvbGRUYWcgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIHtcblx0XHRcdFx0XHRpZiAocmVjeWNsaW5nKSB7XG5cdFx0XHRcdFx0XHR2bm9kZS5zdGF0ZSA9IHt9XG5cdFx0XHRcdFx0XHRpbml0TGlmZWN5Y2xlKHZub2RlLmF0dHJzLCB2bm9kZSwgaG9va3MpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgdXBkYXRlTGlmZWN5Y2xlKHZub2RlLmF0dHJzLCB2bm9kZSwgaG9va3MpXG5cdFx0XHRcdH1cblx0XHRcdFx0c3dpdGNoIChvbGRUYWcpIHtcblx0XHRcdFx0XHRjYXNlIFwiI1wiOiB1cGRhdGVUZXh0KG9sZCwgdm5vZGUpOyBicmVha1xuXHRcdFx0XHRcdGNhc2UgXCI8XCI6IHVwZGF0ZUhUTUwocGFyZW50LCBvbGQsIHZub2RlLCBuZXh0U2libGluZyk7IGJyZWFrXG5cdFx0XHRcdFx0Y2FzZSBcIltcIjogdXBkYXRlRnJhZ21lbnQocGFyZW50LCBvbGQsIHZub2RlLCByZWN5Y2xpbmcsIGhvb2tzLCBuZXh0U2libGluZywgbnMpOyBicmVha1xuXHRcdFx0XHRcdGRlZmF1bHQ6IHVwZGF0ZUVsZW1lbnQob2xkLCB2bm9kZSwgcmVjeWNsaW5nLCBob29rcywgbnMpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgdXBkYXRlQ29tcG9uZW50KHBhcmVudCwgb2xkLCB2bm9kZSwgaG9va3MsIG5leHRTaWJsaW5nLCByZWN5Y2xpbmcsIG5zKVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJlbW92ZU5vZGUob2xkLCBudWxsKVxuXHRcdFx0Y3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVUZXh0KG9sZCwgdm5vZGUpIHtcblx0XHRpZiAob2xkLmNoaWxkcmVuLnRvU3RyaW5nKCkgIT09IHZub2RlLmNoaWxkcmVuLnRvU3RyaW5nKCkpIHtcblx0XHRcdG9sZC5kb20ubm9kZVZhbHVlID0gdm5vZGUuY2hpbGRyZW5cblx0XHR9XG5cdFx0dm5vZGUuZG9tID0gb2xkLmRvbVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUhUTUwocGFyZW50LCBvbGQsIHZub2RlLCBuZXh0U2libGluZykge1xuXHRcdGlmIChvbGQuY2hpbGRyZW4gIT09IHZub2RlLmNoaWxkcmVuKSB7XG5cdFx0XHR0b0ZyYWdtZW50KG9sZClcblx0XHRcdGNyZWF0ZUhUTUwocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpXG5cdFx0fVxuXHRcdGVsc2Ugdm5vZGUuZG9tID0gb2xkLmRvbSwgdm5vZGUuZG9tU2l6ZSA9IG9sZC5kb21TaXplXG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlRnJhZ21lbnQocGFyZW50LCBvbGQsIHZub2RlLCByZWN5Y2xpbmcsIGhvb2tzLCBuZXh0U2libGluZywgbnMpIHtcblx0XHR1cGRhdGVOb2RlcyhwYXJlbnQsIG9sZC5jaGlsZHJlbiwgdm5vZGUuY2hpbGRyZW4sIHJlY3ljbGluZywgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHR2YXIgZG9tU2l6ZSA9IDAsIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHR2bm9kZS5kb20gPSBudWxsXG5cdFx0aWYgKGNoaWxkcmVuICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIGNoaWxkID0gY2hpbGRyZW5baV1cblx0XHRcdFx0aWYgKGNoaWxkICE9IG51bGwgJiYgY2hpbGQuZG9tICE9IG51bGwpIHtcblx0XHRcdFx0XHRpZiAodm5vZGUuZG9tID09IG51bGwpIHZub2RlLmRvbSA9IGNoaWxkLmRvbVxuXHRcdFx0XHRcdGRvbVNpemUgKz0gY2hpbGQuZG9tU2l6ZSB8fCAxXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChkb21TaXplICE9PSAxKSB2bm9kZS5kb21TaXplID0gZG9tU2l6ZVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVFbGVtZW50KG9sZCwgdm5vZGUsIHJlY3ljbGluZywgaG9va3MsIG5zKSB7XG5cdFx0dmFyIGVsZW1lbnQgPSB2bm9kZS5kb20gPSBvbGQuZG9tXG5cdFx0c3dpdGNoICh2bm9kZS50YWcpIHtcblx0XHRcdGNhc2UgXCJzdmdcIjogbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7IGJyZWFrXG5cdFx0XHRjYXNlIFwibWF0aFwiOiBucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiOyBicmVha1xuXHRcdH1cblx0XHRpZiAodm5vZGUudGFnID09PSBcInRleHRhcmVhXCIpIHtcblx0XHRcdGlmICh2bm9kZS5hdHRycyA9PSBudWxsKSB2bm9kZS5hdHRycyA9IHt9XG5cdFx0XHRpZiAodm5vZGUudGV4dCAhPSBudWxsKSB7XG5cdFx0XHRcdHZub2RlLmF0dHJzLnZhbHVlID0gdm5vZGUudGV4dCAvL0ZJWE1FIGhhbmRsZTAgbXVsdGlwbGUgY2hpbGRyZW5cblx0XHRcdFx0dm5vZGUudGV4dCA9IHVuZGVmaW5lZFxuXHRcdFx0fVxuXHRcdH1cblx0XHR1cGRhdGVBdHRycyh2bm9kZSwgb2xkLmF0dHJzLCB2bm9kZS5hdHRycywgbnMpXG5cdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwgJiYgdm5vZGUuYXR0cnMuY29udGVudGVkaXRhYmxlICE9IG51bGwpIHtcblx0XHRcdHNldENvbnRlbnRFZGl0YWJsZSh2bm9kZSlcblx0XHR9XG5cdFx0ZWxzZSBpZiAob2xkLnRleHQgIT0gbnVsbCAmJiB2bm9kZS50ZXh0ICE9IG51bGwgJiYgdm5vZGUudGV4dCAhPT0gXCJcIikge1xuXHRcdFx0aWYgKG9sZC50ZXh0LnRvU3RyaW5nKCkgIT09IHZub2RlLnRleHQudG9TdHJpbmcoKSkgb2xkLmRvbS5maXJzdENoaWxkLm5vZGVWYWx1ZSA9IHZub2RlLnRleHRcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAob2xkLnRleHQgIT0gbnVsbCkgb2xkLmNoaWxkcmVuID0gW1Zub2RlKFwiI1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgb2xkLnRleHQsIHVuZGVmaW5lZCwgb2xkLmRvbS5maXJzdENoaWxkKV1cblx0XHRcdGlmICh2bm9kZS50ZXh0ICE9IG51bGwpIHZub2RlLmNoaWxkcmVuID0gW1Zub2RlKFwiI1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdm5vZGUudGV4dCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpXVxuXHRcdFx0dXBkYXRlTm9kZXMoZWxlbWVudCwgb2xkLmNoaWxkcmVuLCB2bm9kZS5jaGlsZHJlbiwgcmVjeWNsaW5nLCBob29rcywgbnVsbCwgbnMpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUNvbXBvbmVudChwYXJlbnQsIG9sZCwgdm5vZGUsIGhvb2tzLCBuZXh0U2libGluZywgcmVjeWNsaW5nLCBucykge1xuXHRcdGlmIChyZWN5Y2xpbmcpIHtcblx0XHRcdGluaXRDb21wb25lbnQodm5vZGUsIGhvb2tzKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2bm9kZS5pbnN0YW5jZSA9IFZub2RlLm5vcm1hbGl6ZSh2bm9kZS5fc3RhdGUudmlldy5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSkpXG5cdFx0XHRpZiAodm5vZGUuaW5zdGFuY2UgPT09IHZub2RlKSB0aHJvdyBFcnJvcihcIkEgdmlldyBjYW5ub3QgcmV0dXJuIHRoZSB2bm9kZSBpdCByZWNlaXZlZCBhcyBhcmd1bWVudFwiKVxuXHRcdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIHVwZGF0ZUxpZmVjeWNsZSh2bm9kZS5hdHRycywgdm5vZGUsIGhvb2tzKVxuXHRcdFx0dXBkYXRlTGlmZWN5Y2xlKHZub2RlLl9zdGF0ZSwgdm5vZGUsIGhvb2tzKVxuXHRcdH1cblx0XHRpZiAodm5vZGUuaW5zdGFuY2UgIT0gbnVsbCkge1xuXHRcdFx0aWYgKG9sZC5pbnN0YW5jZSA9PSBudWxsKSBjcmVhdGVOb2RlKHBhcmVudCwgdm5vZGUuaW5zdGFuY2UsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHRlbHNlIHVwZGF0ZU5vZGUocGFyZW50LCBvbGQuaW5zdGFuY2UsIHZub2RlLmluc3RhbmNlLCBob29rcywgbmV4dFNpYmxpbmcsIHJlY3ljbGluZywgbnMpXG5cdFx0XHR2bm9kZS5kb20gPSB2bm9kZS5pbnN0YW5jZS5kb21cblx0XHRcdHZub2RlLmRvbVNpemUgPSB2bm9kZS5pbnN0YW5jZS5kb21TaXplXG5cdFx0fVxuXHRcdGVsc2UgaWYgKG9sZC5pbnN0YW5jZSAhPSBudWxsKSB7XG5cdFx0XHRyZW1vdmVOb2RlKG9sZC5pbnN0YW5jZSwgbnVsbClcblx0XHRcdHZub2RlLmRvbSA9IHVuZGVmaW5lZFxuXHRcdFx0dm5vZGUuZG9tU2l6ZSA9IDBcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR2bm9kZS5kb20gPSBvbGQuZG9tXG5cdFx0XHR2bm9kZS5kb21TaXplID0gb2xkLmRvbVNpemVcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gaXNSZWN5Y2xhYmxlKG9sZCwgdm5vZGVzKSB7XG5cdFx0aWYgKG9sZC5wb29sICE9IG51bGwgJiYgTWF0aC5hYnMob2xkLnBvb2wubGVuZ3RoIC0gdm5vZGVzLmxlbmd0aCkgPD0gTWF0aC5hYnMob2xkLmxlbmd0aCAtIHZub2Rlcy5sZW5ndGgpKSB7XG5cdFx0XHR2YXIgb2xkQ2hpbGRyZW5MZW5ndGggPSBvbGRbMF0gJiYgb2xkWzBdLmNoaWxkcmVuICYmIG9sZFswXS5jaGlsZHJlbi5sZW5ndGggfHwgMFxuXHRcdFx0dmFyIHBvb2xDaGlsZHJlbkxlbmd0aCA9IG9sZC5wb29sWzBdICYmIG9sZC5wb29sWzBdLmNoaWxkcmVuICYmIG9sZC5wb29sWzBdLmNoaWxkcmVuLmxlbmd0aCB8fCAwXG5cdFx0XHR2YXIgdm5vZGVzQ2hpbGRyZW5MZW5ndGggPSB2bm9kZXNbMF0gJiYgdm5vZGVzWzBdLmNoaWxkcmVuICYmIHZub2Rlc1swXS5jaGlsZHJlbi5sZW5ndGggfHwgMFxuXHRcdFx0aWYgKE1hdGguYWJzKHBvb2xDaGlsZHJlbkxlbmd0aCAtIHZub2Rlc0NoaWxkcmVuTGVuZ3RoKSA8PSBNYXRoLmFicyhvbGRDaGlsZHJlbkxlbmd0aCAtIHZub2Rlc0NoaWxkcmVuTGVuZ3RoKSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxuXHRmdW5jdGlvbiBnZXRLZXlNYXAodm5vZGVzLCBlbmQpIHtcblx0XHR2YXIgbWFwID0ge30sIGkgPSAwXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBlbmQ7IGkrKykge1xuXHRcdFx0dmFyIHZub2RlID0gdm5vZGVzW2ldXG5cdFx0XHRpZiAodm5vZGUgIT0gbnVsbCkge1xuXHRcdFx0XHR2YXIga2V5MiA9IHZub2RlLmtleVxuXHRcdFx0XHRpZiAoa2V5MiAhPSBudWxsKSBtYXBba2V5Ml0gPSBpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBtYXBcblx0fVxuXHRmdW5jdGlvbiB0b0ZyYWdtZW50KHZub2RlKSB7XG5cdFx0dmFyIGNvdW50MCA9IHZub2RlLmRvbVNpemVcblx0XHRpZiAoY291bnQwICE9IG51bGwgfHwgdm5vZGUuZG9tID09IG51bGwpIHtcblx0XHRcdHZhciBmcmFnbWVudCA9ICRkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0XHRpZiAoY291bnQwID4gMCkge1xuXHRcdFx0XHR2YXIgZG9tID0gdm5vZGUuZG9tXG5cdFx0XHRcdHdoaWxlICgtLWNvdW50MCkgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZG9tLm5leHRTaWJsaW5nKVxuXHRcdFx0XHRmcmFnbWVudC5pbnNlcnRCZWZvcmUoZG9tLCBmcmFnbWVudC5maXJzdENoaWxkKVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWdtZW50XG5cdFx0fVxuXHRcdGVsc2UgcmV0dXJuIHZub2RlLmRvbVxuXHR9XG5cdGZ1bmN0aW9uIGdldE5leHRTaWJsaW5nKHZub2RlcywgaSwgbmV4dFNpYmxpbmcpIHtcblx0XHRmb3IgKDsgaSA8IHZub2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHZub2Rlc1tpXSAhPSBudWxsICYmIHZub2Rlc1tpXS5kb20gIT0gbnVsbCkgcmV0dXJuIHZub2Rlc1tpXS5kb21cblx0XHR9XG5cdFx0cmV0dXJuIG5leHRTaWJsaW5nXG5cdH1cblx0ZnVuY3Rpb24gaW5zZXJ0Tm9kZShwYXJlbnQsIGRvbSwgbmV4dFNpYmxpbmcpIHtcblx0XHRpZiAobmV4dFNpYmxpbmcgJiYgbmV4dFNpYmxpbmcucGFyZW50Tm9kZSkgcGFyZW50Lmluc2VydEJlZm9yZShkb20sIG5leHRTaWJsaW5nKVxuXHRcdGVsc2UgcGFyZW50LmFwcGVuZENoaWxkKGRvbSlcblx0fVxuXHRmdW5jdGlvbiBzZXRDb250ZW50RWRpdGFibGUodm5vZGUpIHtcblx0XHR2YXIgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlblxuXHRcdGlmIChjaGlsZHJlbiAhPSBudWxsICYmIGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJiBjaGlsZHJlblswXS50YWcgPT09IFwiPFwiKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNoaWxkcmVuWzBdLmNoaWxkcmVuXG5cdFx0XHRpZiAodm5vZGUuZG9tLmlubmVySFRNTCAhPT0gY29udGVudCkgdm5vZGUuZG9tLmlubmVySFRNTCA9IGNvbnRlbnRcblx0XHR9XG5cdFx0ZWxzZSBpZiAodm5vZGUudGV4dCAhPSBudWxsIHx8IGNoaWxkcmVuICE9IG51bGwgJiYgY2hpbGRyZW4ubGVuZ3RoICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZCBub2RlIG9mIGEgY29udGVudGVkaXRhYmxlIG11c3QgYmUgdHJ1c3RlZFwiKVxuXHR9XG5cdC8vcmVtb3ZlXG5cdGZ1bmN0aW9uIHJlbW92ZU5vZGVzKHZub2Rlcywgc3RhcnQsIGVuZCwgY29udGV4dCkge1xuXHRcdGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG5cdFx0XHR2YXIgdm5vZGUgPSB2bm9kZXNbaV1cblx0XHRcdGlmICh2bm9kZSAhPSBudWxsKSB7XG5cdFx0XHRcdGlmICh2bm9kZS5za2lwKSB2bm9kZS5za2lwID0gZmFsc2Vcblx0XHRcdFx0ZWxzZSByZW1vdmVOb2RlKHZub2RlLCBjb250ZXh0KVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiByZW1vdmVOb2RlKHZub2RlLCBjb250ZXh0KSB7XG5cdFx0dmFyIGV4cGVjdGVkID0gMSwgY2FsbGVkID0gMFxuXHRcdGlmICh2bm9kZS5hdHRycyAmJiB0eXBlb2Ygdm5vZGUuYXR0cnMub25iZWZvcmVyZW1vdmUgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dmFyIHJlc3VsdCA9IHZub2RlLmF0dHJzLm9uYmVmb3JlcmVtb3ZlLmNhbGwodm5vZGUuc3RhdGUsIHZub2RlKVxuXHRcdFx0aWYgKHJlc3VsdCAhPSBudWxsICYmIHR5cGVvZiByZXN1bHQudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdGV4cGVjdGVkKytcblx0XHRcdFx0cmVzdWx0LnRoZW4oY29udGludWF0aW9uLCBjb250aW51YXRpb24pXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiB2bm9kZS5fc3RhdGUub25iZWZvcmVyZW1vdmUgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dmFyIHJlc3VsdCA9IHZub2RlLl9zdGF0ZS5vbmJlZm9yZXJlbW92ZS5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSlcblx0XHRcdGlmIChyZXN1bHQgIT0gbnVsbCAmJiB0eXBlb2YgcmVzdWx0LnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRleHBlY3RlZCsrXG5cdFx0XHRcdHJlc3VsdC50aGVuKGNvbnRpbnVhdGlvbiwgY29udGludWF0aW9uKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRjb250aW51YXRpb24oKVxuXHRcdGZ1bmN0aW9uIGNvbnRpbnVhdGlvbigpIHtcblx0XHRcdGlmICgrK2NhbGxlZCA9PT0gZXhwZWN0ZWQpIHtcblx0XHRcdFx0b25yZW1vdmUodm5vZGUpXG5cdFx0XHRcdGlmICh2bm9kZS5kb20pIHtcblx0XHRcdFx0XHR2YXIgY291bnQwID0gdm5vZGUuZG9tU2l6ZSB8fCAxXG5cdFx0XHRcdFx0aWYgKGNvdW50MCA+IDEpIHtcblx0XHRcdFx0XHRcdHZhciBkb20gPSB2bm9kZS5kb21cblx0XHRcdFx0XHRcdHdoaWxlICgtLWNvdW50MCkge1xuXHRcdFx0XHRcdFx0XHRyZW1vdmVOb2RlRnJvbURPTShkb20ubmV4dFNpYmxpbmcpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlbW92ZU5vZGVGcm9tRE9NKHZub2RlLmRvbSlcblx0XHRcdFx0XHRpZiAoY29udGV4dCAhPSBudWxsICYmIHZub2RlLmRvbVNpemUgPT0gbnVsbCAmJiAhaGFzSW50ZWdyYXRpb25NZXRob2RzKHZub2RlLmF0dHJzKSAmJiB0eXBlb2Ygdm5vZGUudGFnID09PSBcInN0cmluZ1wiKSB7IC8vVE9ETyB0ZXN0IGN1c3RvbSBlbGVtZW50c1xuXHRcdFx0XHRcdFx0aWYgKCFjb250ZXh0LnBvb2wpIGNvbnRleHQucG9vbCA9IFt2bm9kZV1cblx0XHRcdFx0XHRcdGVsc2UgY29udGV4dC5wb29sLnB1c2godm5vZGUpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHJlbW92ZU5vZGVGcm9tRE9NKG5vZGUpIHtcblx0XHR2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnROb2RlXG5cdFx0aWYgKHBhcmVudCAhPSBudWxsKSBwYXJlbnQucmVtb3ZlQ2hpbGQobm9kZSlcblx0fVxuXHRmdW5jdGlvbiBvbnJlbW92ZSh2bm9kZSkge1xuXHRcdGlmICh2bm9kZS5hdHRycyAmJiB0eXBlb2Ygdm5vZGUuYXR0cnMub25yZW1vdmUgPT09IFwiZnVuY3Rpb25cIikgdm5vZGUuYXR0cnMub25yZW1vdmUuY2FsbCh2bm9kZS5zdGF0ZSwgdm5vZGUpXG5cdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHZub2RlLl9zdGF0ZS5vbnJlbW92ZSA9PT0gXCJmdW5jdGlvblwiKSB2bm9kZS5fc3RhdGUub25yZW1vdmUuY2FsbCh2bm9kZS5zdGF0ZSwgdm5vZGUpXG5cdFx0aWYgKHZub2RlLmluc3RhbmNlICE9IG51bGwpIG9ucmVtb3ZlKHZub2RlLmluc3RhbmNlKVxuXHRcdGVsc2Uge1xuXHRcdFx0dmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0dmFyIGNoaWxkID0gY2hpbGRyZW5baV1cblx0XHRcdFx0XHRpZiAoY2hpbGQgIT0gbnVsbCkgb25yZW1vdmUoY2hpbGQpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Ly9hdHRyczJcblx0ZnVuY3Rpb24gc2V0QXR0cnModm5vZGUsIGF0dHJzMiwgbnMpIHtcblx0XHRmb3IgKHZhciBrZXkyIGluIGF0dHJzMikge1xuXHRcdFx0c2V0QXR0cih2bm9kZSwga2V5MiwgbnVsbCwgYXR0cnMyW2tleTJdLCBucylcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gc2V0QXR0cih2bm9kZSwga2V5Miwgb2xkLCB2YWx1ZSwgbnMpIHtcblx0XHR2YXIgZWxlbWVudCA9IHZub2RlLmRvbVxuXHRcdGlmIChrZXkyID09PSBcImtleVwiIHx8IGtleTIgPT09IFwiaXNcIiB8fCAob2xkID09PSB2YWx1ZSAmJiAhaXNGb3JtQXR0cmlidXRlKHZub2RlLCBrZXkyKSkgJiYgdHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBpc0xpZmVjeWNsZU1ldGhvZChrZXkyKSkgcmV0dXJuXG5cdFx0dmFyIG5zTGFzdEluZGV4ID0ga2V5Mi5pbmRleE9mKFwiOlwiKVxuXHRcdGlmIChuc0xhc3RJbmRleCA+IC0xICYmIGtleTIuc3Vic3RyKDAsIG5zTGFzdEluZGV4KSA9PT0gXCJ4bGlua1wiKSB7XG5cdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLCBrZXkyLnNsaWNlKG5zTGFzdEluZGV4ICsgMSksIHZhbHVlKVxuXHRcdH1cblx0XHRlbHNlIGlmIChrZXkyWzBdID09PSBcIm9cIiAmJiBrZXkyWzFdID09PSBcIm5cIiAmJiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikgdXBkYXRlRXZlbnQodm5vZGUsIGtleTIsIHZhbHVlKVxuXHRcdGVsc2UgaWYgKGtleTIgPT09IFwic3R5bGVcIikgdXBkYXRlU3R5bGUoZWxlbWVudCwgb2xkLCB2YWx1ZSlcblx0XHRlbHNlIGlmIChrZXkyIGluIGVsZW1lbnQgJiYgIWlzQXR0cmlidXRlKGtleTIpICYmIG5zID09PSB1bmRlZmluZWQgJiYgIWlzQ3VzdG9tRWxlbWVudCh2bm9kZSkpIHtcblx0XHRcdC8vc2V0dGluZyBpbnB1dFt2YWx1ZV0gdG8gc2FtZSB2YWx1ZSBieSB0eXBpbmcgb24gZm9jdXNlZCBlbGVtZW50IG1vdmVzIGN1cnNvciB0byBlbmQgaW4gQ2hyb21lXG5cdFx0XHRpZiAodm5vZGUudGFnID09PSBcImlucHV0XCIgJiYga2V5MiA9PT0gXCJ2YWx1ZVwiICYmIHZub2RlLmRvbS52YWx1ZSA9PSB2YWx1ZSAmJiB2bm9kZS5kb20gPT09ICRkb2MuYWN0aXZlRWxlbWVudCkgcmV0dXJuXG5cdFx0XHQvL3NldHRpbmcgc2VsZWN0W3ZhbHVlXSB0byBzYW1lIHZhbHVlIHdoaWxlIGhhdmluZyBzZWxlY3Qgb3BlbiBibGlua3Mgc2VsZWN0IGRyb3Bkb3duIGluIENocm9tZVxuXHRcdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJzZWxlY3RcIiAmJiBrZXkyID09PSBcInZhbHVlXCIgJiYgdm5vZGUuZG9tLnZhbHVlID09IHZhbHVlICYmIHZub2RlLmRvbSA9PT0gJGRvYy5hY3RpdmVFbGVtZW50KSByZXR1cm5cblx0XHRcdC8vc2V0dGluZyBvcHRpb25bdmFsdWVdIHRvIHNhbWUgdmFsdWUgd2hpbGUgaGF2aW5nIHNlbGVjdCBvcGVuIGJsaW5rcyBzZWxlY3QgZHJvcGRvd24gaW4gQ2hyb21lXG5cdFx0XHRpZiAodm5vZGUudGFnID09PSBcIm9wdGlvblwiICYmIGtleTIgPT09IFwidmFsdWVcIiAmJiB2bm9kZS5kb20udmFsdWUgPT0gdmFsdWUpIHJldHVyblxuXHRcdFx0Ly8gSWYgeW91IGFzc2lnbiBhbiBpbnB1dCB0eXBlMSB0aGF0IGlzIG5vdCBzdXBwb3J0ZWQgYnkgSUUgMTEgd2l0aCBhbiBhc3NpZ25tZW50IGV4cHJlc3Npb24sIGFuIGVycm9yMCB3aWxsIG9jY3VyLlxuXHRcdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJpbnB1dFwiICYmIGtleTIgPT09IFwidHlwZVwiKSB7XG5cdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleTIsIHZhbHVlKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdGVsZW1lbnRba2V5Ml0gPSB2YWx1ZVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0XHRcdGlmICh2YWx1ZSkgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5MiwgXCJcIilcblx0XHRcdFx0ZWxzZSBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShrZXkyKVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBlbGVtZW50LnNldEF0dHJpYnV0ZShrZXkyID09PSBcImNsYXNzTmFtZVwiID8gXCJjbGFzc1wiIDoga2V5MiwgdmFsdWUpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHNldExhdGVBdHRycyh2bm9kZSkge1xuXHRcdHZhciBhdHRyczIgPSB2bm9kZS5hdHRyc1xuXHRcdGlmICh2bm9kZS50YWcgPT09IFwic2VsZWN0XCIgJiYgYXR0cnMyICE9IG51bGwpIHtcblx0XHRcdGlmIChcInZhbHVlXCIgaW4gYXR0cnMyKSBzZXRBdHRyKHZub2RlLCBcInZhbHVlXCIsIG51bGwsIGF0dHJzMi52YWx1ZSwgdW5kZWZpbmVkKVxuXHRcdFx0aWYgKFwic2VsZWN0ZWRJbmRleFwiIGluIGF0dHJzMikgc2V0QXR0cih2bm9kZSwgXCJzZWxlY3RlZEluZGV4XCIsIG51bGwsIGF0dHJzMi5zZWxlY3RlZEluZGV4LCB1bmRlZmluZWQpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUF0dHJzKHZub2RlLCBvbGQsIGF0dHJzMiwgbnMpIHtcblx0XHRpZiAoYXR0cnMyICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGtleTIgaW4gYXR0cnMyKSB7XG5cdFx0XHRcdHNldEF0dHIodm5vZGUsIGtleTIsIG9sZCAmJiBvbGRba2V5Ml0sIGF0dHJzMltrZXkyXSwgbnMpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChvbGQgIT0gbnVsbCkge1xuXHRcdFx0Zm9yICh2YXIga2V5MiBpbiBvbGQpIHtcblx0XHRcdFx0aWYgKGF0dHJzMiA9PSBudWxsIHx8ICEoa2V5MiBpbiBhdHRyczIpKSB7XG5cdFx0XHRcdFx0aWYgKGtleTIgPT09IFwiY2xhc3NOYW1lXCIpIGtleTIgPSBcImNsYXNzXCJcblx0XHRcdFx0XHRpZiAoa2V5MlswXSA9PT0gXCJvXCIgJiYga2V5MlsxXSA9PT0gXCJuXCIgJiYgIWlzTGlmZWN5Y2xlTWV0aG9kKGtleTIpKSB1cGRhdGVFdmVudCh2bm9kZSwga2V5MiwgdW5kZWZpbmVkKVxuXHRcdFx0XHRcdGVsc2UgaWYgKGtleTIgIT09IFwia2V5XCIpIHZub2RlLmRvbS5yZW1vdmVBdHRyaWJ1dGUoa2V5Milcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBpc0Zvcm1BdHRyaWJ1dGUodm5vZGUsIGF0dHIpIHtcblx0XHRyZXR1cm4gYXR0ciA9PT0gXCJ2YWx1ZVwiIHx8IGF0dHIgPT09IFwiY2hlY2tlZFwiIHx8IGF0dHIgPT09IFwic2VsZWN0ZWRJbmRleFwiIHx8IGF0dHIgPT09IFwic2VsZWN0ZWRcIiAmJiB2bm9kZS5kb20gPT09ICRkb2MuYWN0aXZlRWxlbWVudFxuXHR9XG5cdGZ1bmN0aW9uIGlzTGlmZWN5Y2xlTWV0aG9kKGF0dHIpIHtcblx0XHRyZXR1cm4gYXR0ciA9PT0gXCJvbmluaXRcIiB8fCBhdHRyID09PSBcIm9uY3JlYXRlXCIgfHwgYXR0ciA9PT0gXCJvbnVwZGF0ZVwiIHx8IGF0dHIgPT09IFwib25yZW1vdmVcIiB8fCBhdHRyID09PSBcIm9uYmVmb3JlcmVtb3ZlXCIgfHwgYXR0ciA9PT0gXCJvbmJlZm9yZXVwZGF0ZVwiXG5cdH1cblx0ZnVuY3Rpb24gaXNBdHRyaWJ1dGUoYXR0cikge1xuXHRcdHJldHVybiBhdHRyID09PSBcImhyZWZcIiB8fCBhdHRyID09PSBcImxpc3RcIiB8fCBhdHRyID09PSBcImZvcm1cIiB8fCBhdHRyID09PSBcIndpZHRoXCIgfHwgYXR0ciA9PT0gXCJoZWlnaHRcIi8vIHx8IGF0dHIgPT09IFwidHlwZVwiXG5cdH1cblx0ZnVuY3Rpb24gaXNDdXN0b21FbGVtZW50KHZub2RlKXtcblx0XHRyZXR1cm4gdm5vZGUuYXR0cnMuaXMgfHwgdm5vZGUudGFnLmluZGV4T2YoXCItXCIpID4gLTFcblx0fVxuXHRmdW5jdGlvbiBoYXNJbnRlZ3JhdGlvbk1ldGhvZHMoc291cmNlKSB7XG5cdFx0cmV0dXJuIHNvdXJjZSAhPSBudWxsICYmIChzb3VyY2Uub25jcmVhdGUgfHwgc291cmNlLm9udXBkYXRlIHx8IHNvdXJjZS5vbmJlZm9yZXJlbW92ZSB8fCBzb3VyY2Uub25yZW1vdmUpXG5cdH1cblx0Ly9zdHlsZVxuXHRmdW5jdGlvbiB1cGRhdGVTdHlsZShlbGVtZW50LCBvbGQsIHN0eWxlKSB7XG5cdFx0aWYgKG9sZCA9PT0gc3R5bGUpIGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IFwiXCIsIG9sZCA9IG51bGxcblx0XHRpZiAoc3R5bGUgPT0gbnVsbCkgZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gXCJcIlxuXHRcdGVsc2UgaWYgKHR5cGVvZiBzdHlsZSA9PT0gXCJzdHJpbmdcIikgZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gc3R5bGVcblx0XHRlbHNlIHtcblx0XHRcdGlmICh0eXBlb2Ygb2xkID09PSBcInN0cmluZ1wiKSBlbGVtZW50LnN0eWxlLmNzc1RleHQgPSBcIlwiXG5cdFx0XHRmb3IgKHZhciBrZXkyIGluIHN0eWxlKSB7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGVba2V5Ml0gPSBzdHlsZVtrZXkyXVxuXHRcdFx0fVxuXHRcdFx0aWYgKG9sZCAhPSBudWxsICYmIHR5cGVvZiBvbGQgIT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5MiBpbiBvbGQpIHtcblx0XHRcdFx0XHRpZiAoIShrZXkyIGluIHN0eWxlKSkgZWxlbWVudC5zdHlsZVtrZXkyXSA9IFwiXCJcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHQvL2V2ZW50XG5cdGZ1bmN0aW9uIHVwZGF0ZUV2ZW50KHZub2RlLCBrZXkyLCB2YWx1ZSkge1xuXHRcdHZhciBlbGVtZW50ID0gdm5vZGUuZG9tXG5cdFx0dmFyIGNhbGxiYWNrID0gdHlwZW9mIG9uZXZlbnQgIT09IFwiZnVuY3Rpb25cIiA/IHZhbHVlIDogZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIHJlc3VsdCA9IHZhbHVlLmNhbGwoZWxlbWVudCwgZSlcblx0XHRcdG9uZXZlbnQuY2FsbChlbGVtZW50LCBlKVxuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXHRcdH1cblx0XHRpZiAoa2V5MiBpbiBlbGVtZW50KSBlbGVtZW50W2tleTJdID0gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBjYWxsYmFjayA6IG51bGxcblx0XHRlbHNlIHtcblx0XHRcdHZhciBldmVudE5hbWUgPSBrZXkyLnNsaWNlKDIpXG5cdFx0XHRpZiAodm5vZGUuZXZlbnRzID09PSB1bmRlZmluZWQpIHZub2RlLmV2ZW50cyA9IHt9XG5cdFx0XHRpZiAodm5vZGUuZXZlbnRzW2tleTJdID09PSBjYWxsYmFjaykgcmV0dXJuXG5cdFx0XHRpZiAodm5vZGUuZXZlbnRzW2tleTJdICE9IG51bGwpIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHZub2RlLmV2ZW50c1trZXkyXSwgZmFsc2UpXG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0dm5vZGUuZXZlbnRzW2tleTJdID0gY2FsbGJhY2tcblx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdm5vZGUuZXZlbnRzW2tleTJdLCBmYWxzZSlcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Ly9saWZlY3ljbGVcblx0ZnVuY3Rpb24gaW5pdExpZmVjeWNsZShzb3VyY2UsIHZub2RlLCBob29rcykge1xuXHRcdGlmICh0eXBlb2Ygc291cmNlLm9uaW5pdCA9PT0gXCJmdW5jdGlvblwiKSBzb3VyY2Uub25pbml0LmNhbGwodm5vZGUuc3RhdGUsIHZub2RlKVxuXHRcdGlmICh0eXBlb2Ygc291cmNlLm9uY3JlYXRlID09PSBcImZ1bmN0aW9uXCIpIGhvb2tzLnB1c2goc291cmNlLm9uY3JlYXRlLmJpbmQodm5vZGUuc3RhdGUsIHZub2RlKSlcblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVMaWZlY3ljbGUoc291cmNlLCB2bm9kZSwgaG9va3MpIHtcblx0XHRpZiAodHlwZW9mIHNvdXJjZS5vbnVwZGF0ZSA9PT0gXCJmdW5jdGlvblwiKSBob29rcy5wdXNoKHNvdXJjZS5vbnVwZGF0ZS5iaW5kKHZub2RlLnN0YXRlLCB2bm9kZSkpXG5cdH1cblx0ZnVuY3Rpb24gc2hvdWxkTm90VXBkYXRlKHZub2RlLCBvbGQpIHtcblx0XHR2YXIgZm9yY2VWbm9kZVVwZGF0ZSwgZm9yY2VDb21wb25lbnRVcGRhdGVcblx0XHRpZiAodm5vZGUuYXR0cnMgIT0gbnVsbCAmJiB0eXBlb2Ygdm5vZGUuYXR0cnMub25iZWZvcmV1cGRhdGUgPT09IFwiZnVuY3Rpb25cIikgZm9yY2VWbm9kZVVwZGF0ZSA9IHZub2RlLmF0dHJzLm9uYmVmb3JldXBkYXRlLmNhbGwodm5vZGUuc3RhdGUsIHZub2RlLCBvbGQpXG5cdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHZub2RlLl9zdGF0ZS5vbmJlZm9yZXVwZGF0ZSA9PT0gXCJmdW5jdGlvblwiKSBmb3JjZUNvbXBvbmVudFVwZGF0ZSA9IHZub2RlLl9zdGF0ZS5vbmJlZm9yZXVwZGF0ZS5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSwgb2xkKVxuXHRcdGlmICghKGZvcmNlVm5vZGVVcGRhdGUgPT09IHVuZGVmaW5lZCAmJiBmb3JjZUNvbXBvbmVudFVwZGF0ZSA9PT0gdW5kZWZpbmVkKSAmJiAhZm9yY2VWbm9kZVVwZGF0ZSAmJiAhZm9yY2VDb21wb25lbnRVcGRhdGUpIHtcblx0XHRcdHZub2RlLmRvbSA9IG9sZC5kb21cblx0XHRcdHZub2RlLmRvbVNpemUgPSBvbGQuZG9tU2l6ZVxuXHRcdFx0dm5vZGUuaW5zdGFuY2UgPSBvbGQuaW5zdGFuY2Vcblx0XHRcdHJldHVybiB0cnVlXG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZVxuXHR9XG5cdGZ1bmN0aW9uIHJlbmRlcihkb20sIHZub2Rlcykge1xuXHRcdGlmICghZG9tKSB0aHJvdyBuZXcgRXJyb3IoXCJFbnN1cmUgdGhlIERPTSBlbGVtZW50IGJlaW5nIHBhc3NlZCB0byBtLnJvdXRlL20ubW91bnQvbS5yZW5kZXIgaXMgbm90IHVuZGVmaW5lZC5cIilcblx0XHR2YXIgaG9va3MgPSBbXVxuXHRcdHZhciBhY3RpdmUgPSAkZG9jLmFjdGl2ZUVsZW1lbnRcblx0XHQvLyBGaXJzdCB0aW1lMCByZW5kZXJpbmcgaW50byBhIG5vZGUgY2xlYXJzIGl0IG91dFxuXHRcdGlmIChkb20udm5vZGVzID09IG51bGwpIGRvbS50ZXh0Q29udGVudCA9IFwiXCJcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkodm5vZGVzKSkgdm5vZGVzID0gW3Zub2Rlc11cblx0XHR1cGRhdGVOb2Rlcyhkb20sIGRvbS52bm9kZXMsIFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKHZub2RlcyksIGZhbHNlLCBob29rcywgbnVsbCwgdW5kZWZpbmVkKVxuXHRcdGRvbS52bm9kZXMgPSB2bm9kZXNcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhvb2tzLmxlbmd0aDsgaSsrKSBob29rc1tpXSgpXG5cdFx0aWYgKCRkb2MuYWN0aXZlRWxlbWVudCAhPT0gYWN0aXZlKSBhY3RpdmUuZm9jdXMoKVxuXHR9XG5cdHJldHVybiB7cmVuZGVyOiByZW5kZXIsIHNldEV2ZW50Q2FsbGJhY2s6IHNldEV2ZW50Q2FsbGJhY2t9XG59XG5mdW5jdGlvbiB0aHJvdHRsZShjYWxsYmFjaykge1xuXHQvLzYwZnBzIHRyYW5zbGF0ZXMgdG8gMTYuNm1zLCByb3VuZCBpdCBkb3duIHNpbmNlIHNldFRpbWVvdXQgcmVxdWlyZXMgaW50XG5cdHZhciB0aW1lID0gMTZcblx0dmFyIGxhc3QgPSAwLCBwZW5kaW5nID0gbnVsbFxuXHR2YXIgdGltZW91dCA9IHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09IFwiZnVuY3Rpb25cIiA/IHJlcXVlc3RBbmltYXRpb25GcmFtZSA6IHNldFRpbWVvdXRcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBub3cgPSBEYXRlLm5vdygpXG5cdFx0aWYgKGxhc3QgPT09IDAgfHwgbm93IC0gbGFzdCA+PSB0aW1lKSB7XG5cdFx0XHRsYXN0ID0gbm93XG5cdFx0XHRjYWxsYmFjaygpXG5cdFx0fVxuXHRcdGVsc2UgaWYgKHBlbmRpbmcgPT09IG51bGwpIHtcblx0XHRcdHBlbmRpbmcgPSB0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRwZW5kaW5nID0gbnVsbFxuXHRcdFx0XHRjYWxsYmFjaygpXG5cdFx0XHRcdGxhc3QgPSBEYXRlLm5vdygpXG5cdFx0XHR9LCB0aW1lIC0gKG5vdyAtIGxhc3QpKVxuXHRcdH1cblx0fVxufVxudmFyIF8xMSA9IGZ1bmN0aW9uKCR3aW5kb3cpIHtcblx0dmFyIHJlbmRlclNlcnZpY2UgPSBjb3JlUmVuZGVyZXIoJHdpbmRvdylcblx0cmVuZGVyU2VydmljZS5zZXRFdmVudENhbGxiYWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRpZiAoZS5yZWRyYXcgIT09IGZhbHNlKSByZWRyYXcoKVxuXHR9KVxuXHR2YXIgY2FsbGJhY2tzID0gW11cblx0ZnVuY3Rpb24gc3Vic2NyaWJlKGtleTEsIGNhbGxiYWNrKSB7XG5cdFx0dW5zdWJzY3JpYmUoa2V5MSlcblx0XHRjYWxsYmFja3MucHVzaChrZXkxLCB0aHJvdHRsZShjYWxsYmFjaykpXG5cdH1cblx0ZnVuY3Rpb24gdW5zdWJzY3JpYmUoa2V5MSkge1xuXHRcdHZhciBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGtleTEpXG5cdFx0aWYgKGluZGV4ID4gLTEpIGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDIpXG5cdH1cblx0ZnVuY3Rpb24gcmVkcmF3KCkge1xuXHRcdGZvciAodmFyIGkgPSAxOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSArPSAyKSB7XG5cdFx0XHRjYWxsYmFja3NbaV0oKVxuXHRcdH1cblx0fVxuXHRyZXR1cm4ge3N1YnNjcmliZTogc3Vic2NyaWJlLCB1bnN1YnNjcmliZTogdW5zdWJzY3JpYmUsIHJlZHJhdzogcmVkcmF3LCByZW5kZXI6IHJlbmRlclNlcnZpY2UucmVuZGVyfVxufVxudmFyIHJlZHJhd1NlcnZpY2UgPSBfMTEod2luZG93KVxucmVxdWVzdFNlcnZpY2Uuc2V0Q29tcGxldGlvbkNhbGxiYWNrKHJlZHJhd1NlcnZpY2UucmVkcmF3KVxudmFyIF8xNiA9IGZ1bmN0aW9uKHJlZHJhd1NlcnZpY2UwKSB7XG5cdHJldHVybiBmdW5jdGlvbihyb290LCBjb21wb25lbnQpIHtcblx0XHRpZiAoY29tcG9uZW50ID09PSBudWxsKSB7XG5cdFx0XHRyZWRyYXdTZXJ2aWNlMC5yZW5kZXIocm9vdCwgW10pXG5cdFx0XHRyZWRyYXdTZXJ2aWNlMC51bnN1YnNjcmliZShyb290KVxuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXHRcdFxuXHRcdGlmIChjb21wb25lbnQudmlldyA9PSBudWxsICYmIHR5cGVvZiBjb21wb25lbnQgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yKFwibS5tb3VudChlbGVtZW50LCBjb21wb25lbnQpIGV4cGVjdHMgYSBjb21wb25lbnQsIG5vdCBhIHZub2RlXCIpXG5cdFx0XG5cdFx0dmFyIHJ1bjAgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlZHJhd1NlcnZpY2UwLnJlbmRlcihyb290LCBWbm9kZShjb21wb25lbnQpKVxuXHRcdH1cblx0XHRyZWRyYXdTZXJ2aWNlMC5zdWJzY3JpYmUocm9vdCwgcnVuMClcblx0XHRyZWRyYXdTZXJ2aWNlMC5yZWRyYXcoKVxuXHR9XG59XG5tLm1vdW50ID0gXzE2KHJlZHJhd1NlcnZpY2UpXG52YXIgUHJvbWlzZSA9IFByb21pc2VQb2x5ZmlsbFxudmFyIHBhcnNlUXVlcnlTdHJpbmcgPSBmdW5jdGlvbihzdHJpbmcpIHtcblx0aWYgKHN0cmluZyA9PT0gXCJcIiB8fCBzdHJpbmcgPT0gbnVsbCkgcmV0dXJuIHt9XG5cdGlmIChzdHJpbmcuY2hhckF0KDApID09PSBcIj9cIikgc3RyaW5nID0gc3RyaW5nLnNsaWNlKDEpXG5cdHZhciBlbnRyaWVzID0gc3RyaW5nLnNwbGl0KFwiJlwiKSwgZGF0YTAgPSB7fSwgY291bnRlcnMgPSB7fVxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZW50cnkgPSBlbnRyaWVzW2ldLnNwbGl0KFwiPVwiKVxuXHRcdHZhciBrZXk1ID0gZGVjb2RlVVJJQ29tcG9uZW50KGVudHJ5WzBdKVxuXHRcdHZhciB2YWx1ZSA9IGVudHJ5Lmxlbmd0aCA9PT0gMiA/IGRlY29kZVVSSUNvbXBvbmVudChlbnRyeVsxXSkgOiBcIlwiXG5cdFx0aWYgKHZhbHVlID09PSBcInRydWVcIikgdmFsdWUgPSB0cnVlXG5cdFx0ZWxzZSBpZiAodmFsdWUgPT09IFwiZmFsc2VcIikgdmFsdWUgPSBmYWxzZVxuXHRcdHZhciBsZXZlbHMgPSBrZXk1LnNwbGl0KC9cXF1cXFs/fFxcWy8pXG5cdFx0dmFyIGN1cnNvciA9IGRhdGEwXG5cdFx0aWYgKGtleTUuaW5kZXhPZihcIltcIikgPiAtMSkgbGV2ZWxzLnBvcCgpXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBsZXZlbHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdHZhciBsZXZlbCA9IGxldmVsc1tqXSwgbmV4dExldmVsID0gbGV2ZWxzW2ogKyAxXVxuXHRcdFx0dmFyIGlzTnVtYmVyID0gbmV4dExldmVsID09IFwiXCIgfHwgIWlzTmFOKHBhcnNlSW50KG5leHRMZXZlbCwgMTApKVxuXHRcdFx0dmFyIGlzVmFsdWUgPSBqID09PSBsZXZlbHMubGVuZ3RoIC0gMVxuXHRcdFx0aWYgKGxldmVsID09PSBcIlwiKSB7XG5cdFx0XHRcdHZhciBrZXk1ID0gbGV2ZWxzLnNsaWNlKDAsIGopLmpvaW4oKVxuXHRcdFx0XHRpZiAoY291bnRlcnNba2V5NV0gPT0gbnVsbCkgY291bnRlcnNba2V5NV0gPSAwXG5cdFx0XHRcdGxldmVsID0gY291bnRlcnNba2V5NV0rK1xuXHRcdFx0fVxuXHRcdFx0aWYgKGN1cnNvcltsZXZlbF0gPT0gbnVsbCkge1xuXHRcdFx0XHRjdXJzb3JbbGV2ZWxdID0gaXNWYWx1ZSA/IHZhbHVlIDogaXNOdW1iZXIgPyBbXSA6IHt9XG5cdFx0XHR9XG5cdFx0XHRjdXJzb3IgPSBjdXJzb3JbbGV2ZWxdXG5cdFx0fVxuXHR9XG5cdHJldHVybiBkYXRhMFxufVxudmFyIGNvcmVSb3V0ZXIgPSBmdW5jdGlvbigkd2luZG93KSB7XG5cdHZhciBzdXBwb3J0c1B1c2hTdGF0ZSA9IHR5cGVvZiAkd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlID09PSBcImZ1bmN0aW9uXCJcblx0dmFyIGNhbGxBc3luYzAgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSBcImZ1bmN0aW9uXCIgPyBzZXRJbW1lZGlhdGUgOiBzZXRUaW1lb3V0XG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZTEoZnJhZ21lbnQwKSB7XG5cdFx0dmFyIGRhdGEgPSAkd2luZG93LmxvY2F0aW9uW2ZyYWdtZW50MF0ucmVwbGFjZSgvKD86JVthLWY4OV1bYS1mMC05XSkrL2dpbSwgZGVjb2RlVVJJQ29tcG9uZW50KVxuXHRcdGlmIChmcmFnbWVudDAgPT09IFwicGF0aG5hbWVcIiAmJiBkYXRhWzBdICE9PSBcIi9cIikgZGF0YSA9IFwiL1wiICsgZGF0YVxuXHRcdHJldHVybiBkYXRhXG5cdH1cblx0dmFyIGFzeW5jSWRcblx0ZnVuY3Rpb24gZGVib3VuY2VBc3luYyhjYWxsYmFjazApIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoYXN5bmNJZCAhPSBudWxsKSByZXR1cm5cblx0XHRcdGFzeW5jSWQgPSBjYWxsQXN5bmMwKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRhc3luY0lkID0gbnVsbFxuXHRcdFx0XHRjYWxsYmFjazAoKVxuXHRcdFx0fSlcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gcGFyc2VQYXRoKHBhdGgsIHF1ZXJ5RGF0YSwgaGFzaERhdGEpIHtcblx0XHR2YXIgcXVlcnlJbmRleCA9IHBhdGguaW5kZXhPZihcIj9cIilcblx0XHR2YXIgaGFzaEluZGV4ID0gcGF0aC5pbmRleE9mKFwiI1wiKVxuXHRcdHZhciBwYXRoRW5kID0gcXVlcnlJbmRleCA+IC0xID8gcXVlcnlJbmRleCA6IGhhc2hJbmRleCA+IC0xID8gaGFzaEluZGV4IDogcGF0aC5sZW5ndGhcblx0XHRpZiAocXVlcnlJbmRleCA+IC0xKSB7XG5cdFx0XHR2YXIgcXVlcnlFbmQgPSBoYXNoSW5kZXggPiAtMSA/IGhhc2hJbmRleCA6IHBhdGgubGVuZ3RoXG5cdFx0XHR2YXIgcXVlcnlQYXJhbXMgPSBwYXJzZVF1ZXJ5U3RyaW5nKHBhdGguc2xpY2UocXVlcnlJbmRleCArIDEsIHF1ZXJ5RW5kKSlcblx0XHRcdGZvciAodmFyIGtleTQgaW4gcXVlcnlQYXJhbXMpIHF1ZXJ5RGF0YVtrZXk0XSA9IHF1ZXJ5UGFyYW1zW2tleTRdXG5cdFx0fVxuXHRcdGlmIChoYXNoSW5kZXggPiAtMSkge1xuXHRcdFx0dmFyIGhhc2hQYXJhbXMgPSBwYXJzZVF1ZXJ5U3RyaW5nKHBhdGguc2xpY2UoaGFzaEluZGV4ICsgMSkpXG5cdFx0XHRmb3IgKHZhciBrZXk0IGluIGhhc2hQYXJhbXMpIGhhc2hEYXRhW2tleTRdID0gaGFzaFBhcmFtc1trZXk0XVxuXHRcdH1cblx0XHRyZXR1cm4gcGF0aC5zbGljZSgwLCBwYXRoRW5kKVxuXHR9XG5cdHZhciByb3V0ZXIgPSB7cHJlZml4OiBcIiMhXCJ9XG5cdHJvdXRlci5nZXRQYXRoID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHR5cGUyID0gcm91dGVyLnByZWZpeC5jaGFyQXQoMClcblx0XHRzd2l0Y2ggKHR5cGUyKSB7XG5cdFx0XHRjYXNlIFwiI1wiOiByZXR1cm4gbm9ybWFsaXplMShcImhhc2hcIikuc2xpY2Uocm91dGVyLnByZWZpeC5sZW5ndGgpXG5cdFx0XHRjYXNlIFwiP1wiOiByZXR1cm4gbm9ybWFsaXplMShcInNlYXJjaFwiKS5zbGljZShyb3V0ZXIucHJlZml4Lmxlbmd0aCkgKyBub3JtYWxpemUxKFwiaGFzaFwiKVxuXHRcdFx0ZGVmYXVsdDogcmV0dXJuIG5vcm1hbGl6ZTEoXCJwYXRobmFtZVwiKS5zbGljZShyb3V0ZXIucHJlZml4Lmxlbmd0aCkgKyBub3JtYWxpemUxKFwic2VhcmNoXCIpICsgbm9ybWFsaXplMShcImhhc2hcIilcblx0XHR9XG5cdH1cblx0cm91dGVyLnNldFBhdGggPSBmdW5jdGlvbihwYXRoLCBkYXRhLCBvcHRpb25zKSB7XG5cdFx0dmFyIHF1ZXJ5RGF0YSA9IHt9LCBoYXNoRGF0YSA9IHt9XG5cdFx0cGF0aCA9IHBhcnNlUGF0aChwYXRoLCBxdWVyeURhdGEsIGhhc2hEYXRhKVxuXHRcdGlmIChkYXRhICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGtleTQgaW4gZGF0YSkgcXVlcnlEYXRhW2tleTRdID0gZGF0YVtrZXk0XVxuXHRcdFx0cGF0aCA9IHBhdGgucmVwbGFjZSgvOihbXlxcL10rKS9nLCBmdW5jdGlvbihtYXRjaDIsIHRva2VuKSB7XG5cdFx0XHRcdGRlbGV0ZSBxdWVyeURhdGFbdG9rZW5dXG5cdFx0XHRcdHJldHVybiBkYXRhW3Rva2VuXVxuXHRcdFx0fSlcblx0XHR9XG5cdFx0dmFyIHF1ZXJ5ID0gYnVpbGRRdWVyeVN0cmluZyhxdWVyeURhdGEpXG5cdFx0aWYgKHF1ZXJ5KSBwYXRoICs9IFwiP1wiICsgcXVlcnlcblx0XHR2YXIgaGFzaCA9IGJ1aWxkUXVlcnlTdHJpbmcoaGFzaERhdGEpXG5cdFx0aWYgKGhhc2gpIHBhdGggKz0gXCIjXCIgKyBoYXNoXG5cdFx0aWYgKHN1cHBvcnRzUHVzaFN0YXRlKSB7XG5cdFx0XHR2YXIgc3RhdGUgPSBvcHRpb25zID8gb3B0aW9ucy5zdGF0ZSA6IG51bGxcblx0XHRcdHZhciB0aXRsZSA9IG9wdGlvbnMgPyBvcHRpb25zLnRpdGxlIDogbnVsbFxuXHRcdFx0JHdpbmRvdy5vbnBvcHN0YXRlKClcblx0XHRcdGlmIChvcHRpb25zICYmIG9wdGlvbnMucmVwbGFjZSkgJHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShzdGF0ZSwgdGl0bGUsIHJvdXRlci5wcmVmaXggKyBwYXRoKVxuXHRcdFx0ZWxzZSAkd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHN0YXRlLCB0aXRsZSwgcm91dGVyLnByZWZpeCArIHBhdGgpXG5cdFx0fVxuXHRcdGVsc2UgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcm91dGVyLnByZWZpeCArIHBhdGhcblx0fVxuXHRyb3V0ZXIuZGVmaW5lUm91dGVzID0gZnVuY3Rpb24ocm91dGVzLCByZXNvbHZlLCByZWplY3QpIHtcblx0XHRmdW5jdGlvbiByZXNvbHZlUm91dGUoKSB7XG5cdFx0XHR2YXIgcGF0aCA9IHJvdXRlci5nZXRQYXRoKClcblx0XHRcdHZhciBwYXJhbXMgPSB7fVxuXHRcdFx0dmFyIHBhdGhuYW1lID0gcGFyc2VQYXRoKHBhdGgsIHBhcmFtcywgcGFyYW1zKVxuXHRcdFx0dmFyIHN0YXRlID0gJHdpbmRvdy5oaXN0b3J5LnN0YXRlXG5cdFx0XHRpZiAoc3RhdGUgIT0gbnVsbCkge1xuXHRcdFx0XHRmb3IgKHZhciBrIGluIHN0YXRlKSBwYXJhbXNba10gPSBzdGF0ZVtrXVxuXHRcdFx0fVxuXHRcdFx0Zm9yICh2YXIgcm91dGUwIGluIHJvdXRlcykge1xuXHRcdFx0XHR2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXCJeXCIgKyByb3V0ZTAucmVwbGFjZSgvOlteXFwvXSs/XFwuezN9L2csIFwiKC4qPylcIikucmVwbGFjZSgvOlteXFwvXSsvZywgXCIoW15cXFxcL10rKVwiKSArIFwiXFwvPyRcIilcblx0XHRcdFx0aWYgKG1hdGNoZXIudGVzdChwYXRobmFtZSkpIHtcblx0XHRcdFx0XHRwYXRobmFtZS5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dmFyIGtleXMgPSByb3V0ZTAubWF0Y2goLzpbXlxcL10rL2cpIHx8IFtdXG5cdFx0XHRcdFx0XHR2YXIgdmFsdWVzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEsIC0yKVxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdHBhcmFtc1trZXlzW2ldLnJlcGxhY2UoLzp8XFwuL2csIFwiXCIpXSA9IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZXNbaV0pXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHJvdXRlc1tyb3V0ZTBdLCBwYXJhbXMsIHBhdGgsIHJvdXRlMClcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZWplY3QocGF0aCwgcGFyYW1zKVxuXHRcdH1cblx0XHRpZiAoc3VwcG9ydHNQdXNoU3RhdGUpICR3aW5kb3cub25wb3BzdGF0ZSA9IGRlYm91bmNlQXN5bmMocmVzb2x2ZVJvdXRlKVxuXHRcdGVsc2UgaWYgKHJvdXRlci5wcmVmaXguY2hhckF0KDApID09PSBcIiNcIikgJHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSByZXNvbHZlUm91dGVcblx0XHRyZXNvbHZlUm91dGUoKVxuXHR9XG5cdHJldHVybiByb3V0ZXJcbn1cbnZhciBfMjAgPSBmdW5jdGlvbigkd2luZG93LCByZWRyYXdTZXJ2aWNlMCkge1xuXHR2YXIgcm91dGVTZXJ2aWNlID0gY29yZVJvdXRlcigkd2luZG93KVxuXHR2YXIgaWRlbnRpdHkgPSBmdW5jdGlvbih2KSB7cmV0dXJuIHZ9XG5cdHZhciByZW5kZXIxLCBjb21wb25lbnQsIGF0dHJzMywgY3VycmVudFBhdGgsIGxhc3RVcGRhdGVcblx0dmFyIHJvdXRlID0gZnVuY3Rpb24ocm9vdCwgZGVmYXVsdFJvdXRlLCByb3V0ZXMpIHtcblx0XHRpZiAocm9vdCA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoXCJFbnN1cmUgdGhlIERPTSBlbGVtZW50IHRoYXQgd2FzIHBhc3NlZCB0byBgbS5yb3V0ZWAgaXMgbm90IHVuZGVmaW5lZFwiKVxuXHRcdHZhciBydW4xID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAocmVuZGVyMSAhPSBudWxsKSByZWRyYXdTZXJ2aWNlMC5yZW5kZXIocm9vdCwgcmVuZGVyMShWbm9kZShjb21wb25lbnQsIGF0dHJzMy5rZXksIGF0dHJzMykpKVxuXHRcdH1cblx0XHR2YXIgYmFpbCA9IGZ1bmN0aW9uKHBhdGgpIHtcblx0XHRcdGlmIChwYXRoICE9PSBkZWZhdWx0Um91dGUpIHJvdXRlU2VydmljZS5zZXRQYXRoKGRlZmF1bHRSb3V0ZSwgbnVsbCwge3JlcGxhY2U6IHRydWV9KVxuXHRcdFx0ZWxzZSB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgcmVzb2x2ZSBkZWZhdWx0IHJvdXRlIFwiICsgZGVmYXVsdFJvdXRlKVxuXHRcdH1cblx0XHRyb3V0ZVNlcnZpY2UuZGVmaW5lUm91dGVzKHJvdXRlcywgZnVuY3Rpb24ocGF5bG9hZCwgcGFyYW1zLCBwYXRoKSB7XG5cdFx0XHR2YXIgdXBkYXRlID0gbGFzdFVwZGF0ZSA9IGZ1bmN0aW9uKHJvdXRlUmVzb2x2ZXIsIGNvbXApIHtcblx0XHRcdFx0aWYgKHVwZGF0ZSAhPT0gbGFzdFVwZGF0ZSkgcmV0dXJuXG5cdFx0XHRcdGNvbXBvbmVudCA9IGNvbXAgIT0gbnVsbCAmJiAodHlwZW9mIGNvbXAudmlldyA9PT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBjb21wID09PSBcImZ1bmN0aW9uXCIpPyBjb21wIDogXCJkaXZcIlxuXHRcdFx0XHRhdHRyczMgPSBwYXJhbXMsIGN1cnJlbnRQYXRoID0gcGF0aCwgbGFzdFVwZGF0ZSA9IG51bGxcblx0XHRcdFx0cmVuZGVyMSA9IChyb3V0ZVJlc29sdmVyLnJlbmRlciB8fCBpZGVudGl0eSkuYmluZChyb3V0ZVJlc29sdmVyKVxuXHRcdFx0XHRydW4xKClcblx0XHRcdH1cblx0XHRcdGlmIChwYXlsb2FkLnZpZXcgfHwgdHlwZW9mIHBheWxvYWQgPT09IFwiZnVuY3Rpb25cIikgdXBkYXRlKHt9LCBwYXlsb2FkKVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmIChwYXlsb2FkLm9ubWF0Y2gpIHtcblx0XHRcdFx0XHRQcm9taXNlLnJlc29sdmUocGF5bG9hZC5vbm1hdGNoKHBhcmFtcywgcGF0aCkpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZWQpIHtcblx0XHRcdFx0XHRcdHVwZGF0ZShwYXlsb2FkLCByZXNvbHZlZClcblx0XHRcdFx0XHR9LCBiYWlsKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgdXBkYXRlKHBheWxvYWQsIFwiZGl2XCIpXG5cdFx0XHR9XG5cdFx0fSwgYmFpbClcblx0XHRyZWRyYXdTZXJ2aWNlMC5zdWJzY3JpYmUocm9vdCwgcnVuMSlcblx0fVxuXHRyb3V0ZS5zZXQgPSBmdW5jdGlvbihwYXRoLCBkYXRhLCBvcHRpb25zKSB7XG5cdFx0aWYgKGxhc3RVcGRhdGUgIT0gbnVsbCkgb3B0aW9ucyA9IHtyZXBsYWNlOiB0cnVlfVxuXHRcdGxhc3RVcGRhdGUgPSBudWxsXG5cdFx0cm91dGVTZXJ2aWNlLnNldFBhdGgocGF0aCwgZGF0YSwgb3B0aW9ucylcblx0fVxuXHRyb3V0ZS5nZXQgPSBmdW5jdGlvbigpIHtyZXR1cm4gY3VycmVudFBhdGh9XG5cdHJvdXRlLnByZWZpeCA9IGZ1bmN0aW9uKHByZWZpeDApIHtyb3V0ZVNlcnZpY2UucHJlZml4ID0gcHJlZml4MH1cblx0cm91dGUubGluayA9IGZ1bmN0aW9uKHZub2RlMSkge1xuXHRcdHZub2RlMS5kb20uc2V0QXR0cmlidXRlKFwiaHJlZlwiLCByb3V0ZVNlcnZpY2UucHJlZml4ICsgdm5vZGUxLmF0dHJzLmhyZWYpXG5cdFx0dm5vZGUxLmRvbS5vbmNsaWNrID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYgKGUuY3RybEtleSB8fCBlLm1ldGFLZXkgfHwgZS5zaGlmdEtleSB8fCBlLndoaWNoID09PSAyKSByZXR1cm5cblx0XHRcdGUucHJldmVudERlZmF1bHQoKVxuXHRcdFx0ZS5yZWRyYXcgPSBmYWxzZVxuXHRcdFx0dmFyIGhyZWYgPSB0aGlzLmdldEF0dHJpYnV0ZShcImhyZWZcIilcblx0XHRcdGlmIChocmVmLmluZGV4T2Yocm91dGVTZXJ2aWNlLnByZWZpeCkgPT09IDApIGhyZWYgPSBocmVmLnNsaWNlKHJvdXRlU2VydmljZS5wcmVmaXgubGVuZ3RoKVxuXHRcdFx0cm91dGUuc2V0KGhyZWYsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxuXHRcdH1cblx0fVxuXHRyb3V0ZS5wYXJhbSA9IGZ1bmN0aW9uKGtleTMpIHtcblx0XHRpZih0eXBlb2YgYXR0cnMzICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBrZXkzICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gYXR0cnMzW2tleTNdXG5cdFx0cmV0dXJuIGF0dHJzM1xuXHR9XG5cdHJldHVybiByb3V0ZVxufVxubS5yb3V0ZSA9IF8yMCh3aW5kb3csIHJlZHJhd1NlcnZpY2UpXG5tLndpdGhBdHRyID0gZnVuY3Rpb24oYXR0ck5hbWUsIGNhbGxiYWNrMSwgY29udGV4dCkge1xuXHRyZXR1cm4gZnVuY3Rpb24oZSkge1xuXHRcdGNhbGxiYWNrMS5jYWxsKGNvbnRleHQgfHwgdGhpcywgYXR0ck5hbWUgaW4gZS5jdXJyZW50VGFyZ2V0ID8gZS5jdXJyZW50VGFyZ2V0W2F0dHJOYW1lXSA6IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpKVxuXHR9XG59XG52YXIgXzI4ID0gY29yZVJlbmRlcmVyKHdpbmRvdylcbm0ucmVuZGVyID0gXzI4LnJlbmRlclxubS5yZWRyYXcgPSByZWRyYXdTZXJ2aWNlLnJlZHJhd1xubS5yZXF1ZXN0ID0gcmVxdWVzdFNlcnZpY2UucmVxdWVzdFxubS5qc29ucCA9IHJlcXVlc3RTZXJ2aWNlLmpzb25wXG5tLnBhcnNlUXVlcnlTdHJpbmcgPSBwYXJzZVF1ZXJ5U3RyaW5nXG5tLmJ1aWxkUXVlcnlTdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nXG5tLnZlcnNpb24gPSBcIjEuMS4wXCJcbm0udm5vZGUgPSBWbm9kZVxuaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpIG1vZHVsZVtcImV4cG9ydHNcIl0gPSBtXG5lbHNlIHdpbmRvdy5tID0gbVxufSgpKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L21pdGhyaWwvbWl0aHJpbC5qcyIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcbmltcG9ydCBNb2RlbCBmcm9tICcuL21vZGVsLmpzJztcblxuaW1wb3J0IHN0eWxlcyBmcm9tICcuL3N0eWxlcy5jc3MnO1xuXG5cbmNvbnN0IFVsID0ge1xuICB2aWV3OiB2bm9kZSA9PiB7XG4gICAgcmV0dXJuIDx1bCBjbGFzc05hbWU9J21kbC1saXN0Jz5cbiAgICAgIHt2bm9kZS5hdHRycy5pbm5lcn1cbiAgICA8L3VsPlxuICB9XG59O1xuXG5jb25zdCBMaSA9IHtcbiAgdmlldzogdm5vZGUgPT4ge1xuICAgIHJldHVybiA8bGkgY2xhc3NOYW1lPSdtZGwtbGlzdF9faXRlbSc+XG4gICAgICB7dm5vZGUuYXR0cnMuaW5uZXJ9XG4gICAgPC9saT5cbiAgfVxufTtcblxuY29uc3QgRGV0YWlscyA9IHtcbiAgdmlldzogdm5vZGUgID0+IHtcbiAgICByZXR1cm4gPGRldGFpbHM+XG4gICAgICA8c3VtbWFyeT57dm5vZGUuYXR0cnMuc3VtbWFyeX08L3N1bW1hcnk+XG4gICAgICB7dm5vZGUuYXR0cnMuaW5uZXJ9XG4gICAgPC9kZXRhaWxzPlxuICB9XG59O1xuXG5jb25zdCBZZWFyID0ge1xuICB2aWV3OiB2bm9kZSA9PiB7XG4gICAgY29uc3QgZGF0YSA9IHZub2RlLmF0dHJzLmRhdGE7XG4gICAgY29uc3QgaW5uZXIgPSBkYXRhLm1vbnRocy5tYXAoZCA9PiB7XG4gICAgICByZXR1cm4gPFVsIGlubmVyPXs8TGkgaW5uZXI9ezxNb250aCBkYXRhPXtkfSAvPn0gLz59IC8+XG4gICAgfSk7XG4gICAgcmV0dXJuIDxkaXYgaWQ9e2RhdGEueWVhcn0+XG4gICAgICA8RGV0YWlscyBzdW1tYXJ5PXtgJHtkYXRhLnllYXJ95bm0YH0gaW5uZXI9e2lubmVyfSAvPlxuICAgIDwvZGl2PlxuICB9XG59O1xuXG5jb25zdCBNb250aCA9IHtcbiAgdmlldzogdm5vZGUgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSB2bm9kZS5hdHRycy5kYXRhO1xuICAgIGNvbnN0IGlubmVyID0gZGF0YS5kYXlzLm1hcChkID0+IHtcbiAgICAgIHJldHVybiA8VWwgaW5uZXI9ezxMaSBpbm5lcj17PERheSBkYXRhPXtkfSAvPn0gLz59IC8+XG4gICAgfSk7XG4gICAgcmV0dXJuIDxkaXYgaWQ9e2RhdGEubW9udGh9PlxuICAgICAgPERldGFpbHMgc3VtbWFyeT17YCR7ZGF0YS5tb250aH3mnIhgfSBpbm5lcj17aW5uZXJ9IC8+XG4gICAgPC9kaXY+XG4gIH1cbn07XG5cbmNvbnN0IERheSA9IHtcbiAgdmlldzogdm5vZGUgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSB2bm9kZS5hdHRycy5kYXRhO1xuICAgIGNvbnN0IGlubmVyID0gPHNwYW4+XG4gICAgICB7YCR7ZGF0YS5kYXl95pelIGB9XG4gICAgICA8YSBocmVmPXtgL2FydGljbGUvJHtkYXRhLnllYXJ9LyR7ZGF0YS5tb250aH0vJHtkYXRhLmRheX0vJHtkYXRhLnNsdWd9YH0+XG4gICAgICAgIHtkYXRhLnRpdGxlfVxuICAgICAgPC9hPlxuICAgIDwvc3Bhbj5cbiAgICByZXR1cm4gPExpIGlubmVyPXtpbm5lcn0gLz5cbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBvbmluaXQ6IHZub2RlID0+IHtcbiAgICBNb2RlbC5mZXRjaCgpO1xuICAgIHZub2RlLnN0YXRlLmFydGljbGVJbmRleCA9ICgpID0+IHtcbiAgICAgIHJldHVybiBNb2RlbC5kYXRhLm1hcChkID0+IHtcbiAgICAgICAgcmV0dXJuIDxVbCBpbm5lcj17PExpIGlubmVyPXs8WWVhciBkYXRhPXtkfSAvPn0gLz59IC8+XG4gICAgICB9KTtcbiAgICB9O1xuICB9LFxuICB2aWV3OiB2bm9kZSA9PiB7XG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdtZGwtZ3JpZCc+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbWRsLWNlbGwtLTEtb2Zmc2V0JyAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9J21kbC1jZWxsIG1kbC1jZWxsLS0xMC1jb2wnPlxuICAgICAgICB7KCgpID0+IHtcbiAgICAgICAgICBpZiAoIU1vZGVsLmZldGNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nbWRsLXNwaW5uZXIgbWRsLWpzLXNwaW5uZXIgaXMtYWN0aXZlJz48L2Rpdj5cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIDxVbCBpbm5lcj17dm5vZGUuc3RhdGUuYXJ0aWNsZUluZGV4KCl9IC8+XG4gICAgICAgIH0pKCl9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdtZGwtY2VsbC0tMS1vZmZzZXQnIC8+XG4gICAgPC9kaXY+XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NvbXBvbmVudC5qcyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50LmpzJztcblxuXG5tLm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJyksIENvbXBvbmVudCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9lbnRyeS5qcyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5jb25zdCBNb2RlbCA9IHtcbiAgZGF0YTogW10sXG4gIGZldGNoZWQ6IGZhbHNlLFxuICBmZXRjaDogKCkgPT4ge1xuICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9hcGkvYXJ0aWNsZXMnLFxuICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgTW9kZWwuZmV0Y2hlZCA9IHRydWU7XG4gICAgICBNb2RlbC5kYXRhID0gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGVsXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tb2RlbC5qcyIsIid1c2Ugc3RyaWN0J1xuXG5leHBvcnRzLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5leHBvcnRzLnRvQnl0ZUFycmF5ID0gdG9CeXRlQXJyYXlcbmV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IGZyb21CeXRlQXJyYXlcblxudmFyIGxvb2t1cCA9IFtdXG52YXIgcmV2TG9va3VwID0gW11cbnZhciBBcnIgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgPyBVaW50OEFycmF5IDogQXJyYXlcblxudmFyIGNvZGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLydcbmZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gIGxvb2t1cFtpXSA9IGNvZGVbaV1cbiAgcmV2TG9va3VwW2NvZGUuY2hhckNvZGVBdChpKV0gPSBpXG59XG5cbnJldkxvb2t1cFsnLScuY2hhckNvZGVBdCgwKV0gPSA2MlxucmV2TG9va3VwWydfJy5jaGFyQ29kZUF0KDApXSA9IDYzXG5cbmZ1bmN0aW9uIHBsYWNlSG9sZGVyc0NvdW50IChiNjQpIHtcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG4gIC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcbiAgLy8gcmVwcmVzZW50IG9uZSBieXRlXG4gIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuICAvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG4gIHJldHVybiBiNjRbbGVuIC0gMl0gPT09ICc9JyA/IDIgOiBiNjRbbGVuIC0gMV0gPT09ICc9JyA/IDEgOiAwXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKGI2NCkge1xuICAvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcbiAgcmV0dXJuIGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVyc0NvdW50KGI2NClcbn1cblxuZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICB2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuICBwbGFjZUhvbGRlcnMgPSBwbGFjZUhvbGRlcnNDb3VudChiNjQpXG5cbiAgYXJyID0gbmV3IEFycihsZW4gKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gbGVuIC0gNCA6IGxlblxuXG4gIHZhciBMID0gMFxuXG4gIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildIDw8IDYpIHwgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA+PiA0KVxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA+PiAyKVxuICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcbiAgcmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICsgbG9va3VwW251bSAmIDB4M0ZdXG59XG5cbmZ1bmN0aW9uIGVuY29kZUNodW5rICh1aW50OCwgc3RhcnQsIGVuZCkge1xuICB2YXIgdG1wXG4gIHZhciBvdXRwdXQgPSBbXVxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gMykge1xuICAgIHRtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIG91dHB1dCA9ICcnXG4gIHZhciBwYXJ0cyA9IFtdXG4gIHZhciBtYXhDaHVua0xlbmd0aCA9IDE2MzgzIC8vIG11c3QgYmUgbXVsdGlwbGUgb2YgM1xuXG4gIC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbjIgPSBsZW4gLSBleHRyYUJ5dGVzOyBpIDwgbGVuMjsgaSArPSBtYXhDaHVua0xlbmd0aCkge1xuICAgIHBhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKSkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBvdXRwdXQgKz0gbG9va3VwW3RtcCA+PiAyXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9ICc9PSdcbiAgfSBlbHNlIGlmIChleHRyYUJ5dGVzID09PSAyKSB7XG4gICAgdG1wID0gKHVpbnQ4W2xlbiAtIDJdIDw8IDgpICsgKHVpbnQ4W2xlbiAtIDFdKVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDEwXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz0nXG4gIH1cblxuICBwYXJ0cy5wdXNoKG91dHB1dClcblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vYmFzZTY0LWpzL2luZGV4LmpzIiwiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxuLyoqXG4gKiBJZiBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAobW9zdCBjb21wYXRpYmxlLCBldmVuIElFNilcbiAqXG4gKiBCcm93c2VycyB0aGF0IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssIENocm9tZSA3KywgU2FmYXJpIDUuMSssXG4gKiBPcGVyYSAxMS42KywgaU9TIDQuMisuXG4gKlxuICogRHVlIHRvIHZhcmlvdXMgYnJvd3NlciBidWdzLCBzb21ldGltZXMgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiB3aWxsIGJlIHVzZWQgZXZlblxuICogd2hlbiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0eXBlZCBhcnJheXMuXG4gKlxuICogTm90ZTpcbiAqXG4gKiAgIC0gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLFxuICogICAgIFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4LlxuICpcbiAqICAgLSBDaHJvbWUgOS0xMCBpcyBtaXNzaW5nIHRoZSBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uLlxuICpcbiAqICAgLSBJRTEwIGhhcyBhIGJyb2tlbiBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYXJyYXlzIG9mXG4gKiAgICAgaW5jb3JyZWN0IGxlbmd0aCBpbiBzb21lIHNpdHVhdGlvbnMuXG5cbiAqIFdlIGRldGVjdCB0aGVzZSBidWdneSBicm93c2VycyBhbmQgc2V0IGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGAgdG8gYGZhbHNlYCBzbyB0aGV5XG4gKiBnZXQgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggaXMgc2xvd2VyIGJ1dCBiZWhhdmVzIGNvcnJlY3RseS5cbiAqL1xuQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgPSBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVCAhPT0gdW5kZWZpbmVkXG4gID8gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgOiB0eXBlZEFycmF5U3VwcG9ydCgpXG5cbi8qXG4gKiBFeHBvcnQga01heExlbmd0aCBhZnRlciB0eXBlZCBhcnJheSBzdXBwb3J0IGlzIGRldGVybWluZWQuXG4gKi9cbmV4cG9ydHMua01heExlbmd0aCA9IGtNYXhMZW5ndGgoKVxuXG5mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCAoKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgYXJyLl9fcHJvdG9fXyA9IHtfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLCBmb286IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH19XG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDIgJiYgLy8gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWRcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiAvLyBjaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgICAgICAgYXJyLnN1YmFycmF5KDEsIDEpLmJ5dGVMZW5ndGggPT09IDAgLy8gaWUxMCBoYXMgYnJva2VuIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGtNYXhMZW5ndGggKCkge1xuICByZXR1cm4gQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgICA/IDB4N2ZmZmZmZmZcbiAgICA6IDB4M2ZmZmZmZmZcbn1cblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyICh0aGF0LCBsZW5ndGgpIHtcbiAgaWYgKGtNYXhMZW5ndGgoKSA8IGxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHR5cGVkIGFycmF5IGxlbmd0aCcpXG4gIH1cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IG5ldyBVaW50OEFycmF5KGxlbmd0aClcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgaWYgKHRoYXQgPT09IG51bGwpIHtcbiAgICAgIHRoYXQgPSBuZXcgQnVmZmVyKGxlbmd0aClcbiAgICB9XG4gICAgdGhhdC5sZW5ndGggPSBsZW5ndGhcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBoYXZlIHRoZWlyXG4gKiBwcm90b3R5cGUgY2hhbmdlZCB0byBgQnVmZmVyLnByb3RvdHlwZWAuIEZ1cnRoZXJtb3JlLCBgQnVmZmVyYCBpcyBhIHN1YmNsYXNzIG9mXG4gKiBgVWludDhBcnJheWAsIHNvIHRoZSByZXR1cm5lZCBpbnN0YW5jZXMgd2lsbCBoYXZlIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBtZXRob2RzXG4gKiBhbmQgdGhlIGBVaW50OEFycmF5YCBtZXRob2RzLiBTcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdFxuICogcmV0dXJucyBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBUaGUgYFVpbnQ4QXJyYXlgIHByb3RvdHlwZSByZW1haW5zIHVubW9kaWZpZWQuXG4gKi9cblxuZnVuY3Rpb24gQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmICEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdJZiBlbmNvZGluZyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKHRoaXMsIGFyZylcbiAgfVxuICByZXR1cm4gZnJvbSh0aGlzLCBhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbi8vIFRPRE86IExlZ2FjeSwgbm90IG5lZWRlZCBhbnltb3JlLiBSZW1vdmUgaW4gbmV4dCBtYWpvciB2ZXJzaW9uLlxuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIGZyb20gKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQpXG4gIH1cblxuICByZXR1cm4gZnJvbU9iamVjdCh0aGF0LCB2YWx1ZSlcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbShudWxsLCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5pZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuICBCdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnNwZWNpZXMgJiZcbiAgICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICAgIC8vIEZpeCBzdWJhcnJheSgpIGluIEVTMjAxNi4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzk3XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlciwgU3ltYm9sLnNwZWNpZXMsIHtcbiAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfSBlbHNlIGlmIChzaXplIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBuZWdhdGl2ZScpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb2MgKHRoYXQsIHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgaWYgKHNpemUgPD0gMCkge1xuICAgIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbiAgfVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSBwYXkgYXR0ZW50aW9uIHRvIGVuY29kaW5nIGlmIGl0J3MgYSBzdHJpbmcuIFRoaXNcbiAgICAvLyBwcmV2ZW50cyBhY2NpZGVudGFsbHkgc2VuZGluZyBpbiBhIG51bWJlciB0aGF0IHdvdWxkXG4gICAgLy8gYmUgaW50ZXJwcmV0dGVkIGFzIGEgc3RhcnQgb2Zmc2V0LlxuICAgIHJldHVybiB0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnXG4gICAgICA/IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgICAgOiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSkuZmlsbChmaWxsKVxuICB9XG4gIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiBhbGxvYyhzaXplWywgZmlsbFssIGVuY29kaW5nXV0pXG4gKiovXG5CdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGFsbG9jKG51bGwsIHNpemUsIGZpbGwsIGVuY29kaW5nKVxufVxuXG5mdW5jdGlvbiBhbGxvY1Vuc2FmZSAodGhhdCwgc2l6ZSkge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSA8IDAgPyAwIDogY2hlY2tlZChzaXplKSB8IDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7ICsraSkge1xuICAgICAgdGhhdFtpXSA9IDBcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nICh0aGF0LCBzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZW5jb2RpbmdcIiBtdXN0IGJlIGEgdmFsaWQgc3RyaW5nIGVuY29kaW5nJylcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcblxuICB2YXIgYWN0dWFsID0gdGhhdC53cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuXG4gIGlmIChhY3R1YWwgIT09IGxlbmd0aCkge1xuICAgIC8vIFdyaXRpbmcgYSBoZXggc3RyaW5nLCBmb3IgZXhhbXBsZSwgdGhhdCBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMgd2lsbFxuICAgIC8vIGNhdXNlIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0IGludmFsaWQgY2hhcmFjdGVyIHRvIGJlIGlnbm9yZWQuIChlLmcuXG4gICAgLy8gJ2FieHhjZCcgd2lsbCBiZSB0cmVhdGVkIGFzICdhYicpXG4gICAgdGhhdCA9IHRoYXQuc2xpY2UoMCwgYWN0dWFsKVxuICB9XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCA8IDAgPyAwIDogY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAodGhhdCwgYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICBhcnJheS5ieXRlTGVuZ3RoIC8vIHRoaXMgdGhyb3dzIGlmIGBhcnJheWAgaXMgbm90IGEgdmFsaWQgQXJyYXlCdWZmZXJcblxuICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnb2Zmc2V0XFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgKGxlbmd0aCB8fCAwKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdsZW5ndGhcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYnl0ZU9mZnNldCA9PT0gdW5kZWZpbmVkICYmIGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSlcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IGFycmF5XG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQgPSBmcm9tQXJyYXlMaWtlKHRoYXQsIGFycmF5KVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKHRoYXQsIG9iaikge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbilcblxuICAgIGlmICh0aGF0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoYXRcbiAgICB9XG5cbiAgICBvYmouY29weSh0aGF0LCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIHRoYXRcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgb2JqLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgaXNuYW4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCAwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aCgpYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFpc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2MoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBzdHJpbmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZ1xuICB9XG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2Vyc2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBUaGUgcHJvcGVydHkgaXMgdXNlZCBieSBgQnVmZmVyLmlzQnVmZmVyYCBhbmQgYGlzLWJ1ZmZlcmAgKGluIFNhZmFyaSA1LTcpIHRvIGRldGVjdFxuLy8gQnVmZmVyIGluc3RhbmNlcy5cbkJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuXG5mdW5jdGlvbiBzd2FwIChiLCBuLCBtKSB7XG4gIHZhciBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgMiAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMTYtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDEpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMzIgPSBmdW5jdGlvbiBzd2FwMzIgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAzKVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyAyKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDY0ID0gZnVuY3Rpb24gc3dhcDY0ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggfCAwXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgdmFyIHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIHZhciB5ID0gZW5kIC0gc3RhcnRcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgdmFyIHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIHZhciB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAgLy8gQ29lcmNlIHRvIE51bWJlci5cbiAgaWYgKGlzTmFOKGJ5dGVPZmZzZXQpKSB7XG4gICAgLy8gYnl0ZU9mZnNldDogaXQgaXQncyB1bmRlZmluZWQsIG51bGwsIE5hTiwgXCJmb29cIiwgZXRjLCBzZWFyY2ggd2hvbGUgYnVmZmVyXG4gICAgYnl0ZU9mZnNldCA9IGRpciA/IDAgOiAoYnVmZmVyLmxlbmd0aCAtIDEpXG4gIH1cblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldDogbmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoICsgYnl0ZU9mZnNldFxuICBpZiAoYnl0ZU9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgaWYgKGRpcikgcmV0dXJuIC0xXG4gICAgZWxzZSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCAtIDFcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgMCkge1xuICAgIGlmIChkaXIpIGJ5dGVPZmZzZXQgPSAwXG4gICAgZWxzZSByZXR1cm4gLTFcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB2YWxcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgfVxuXG4gIC8vIEZpbmFsbHksIHNlYXJjaCBlaXRoZXIgaW5kZXhPZiAoaWYgZGlyIGlzIHRydWUpIG9yIGxhc3RJbmRleE9mXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nL2J1ZmZlciBhbHdheXMgZmFpbHNcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAweEZGIC8vIFNlYXJjaCBmb3IgYSBieXRlIHZhbHVlIFswLTI1NV1cbiAgICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiZcbiAgICAgICAgdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgWyB2YWwgXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgdmFyIGluZGV4U2l6ZSA9IDFcbiAgdmFyIGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgdmFyIHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGRpcikge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChpc05hTihwYXJzZWQpKSByZXR1cm4gaVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHBhcnNlZFxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGFzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gbGF0aW4xV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggfCAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgLy8gbGVnYWN5IHdyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKSAtIHJlbW92ZSBpbiB2MC4xM1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpICsgMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZlxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBuZXdCdWYgPSB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpXG4gICAgbmV3QnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyArK2kpIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCAyKTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoY29kZSA8IDI1Nikge1xuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBCdWZmZXIuaXNCdWZmZXIodmFsKVxuICAgICAgPyB2YWxcbiAgICAgIDogdXRmOFRvQnl0ZXMobmV3IEJ1ZmZlcih2YWwsIGVuY29kaW5nKS50b1N0cmluZygpKVxuICAgIHZhciBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7ICsraSkge1xuICAgICAgdGhpc1tpICsgc3RhcnRdID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXitcXC8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHJpbmd0cmltKHN0cikucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBpc25hbiAodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHZhbCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9idWZmZXIvaW5kZXguanMiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCkge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcbiAgdmFyIGJhc2U2NCA9IG5ldyBCdWZmZXIoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICB2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG4gIHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L2llZWU3NTQvaW5kZXguanMiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vaXNhcnJheS9pbmRleC5qcyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsIihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGlmIChnbG9iYWwuc2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV4dEhhbmRsZSA9IDE7IC8vIFNwZWMgc2F5cyBncmVhdGVyIHRoYW4gemVyb1xuICAgIHZhciB0YXNrc0J5SGFuZGxlID0ge307XG4gICAgdmFyIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgIHZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG4gICAgdmFyIHJlZ2lzdGVySW1tZWRpYXRlO1xuXG4gICAgZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4gICAgICAvLyBDYWxsYmFjayBjYW4gZWl0aGVyIGJlIGEgZnVuY3Rpb24gb3IgYSBzdHJpbmdcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsYmFjayA9IG5ldyBGdW5jdGlvbihcIlwiICsgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgLy8gQ29weSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdO1xuICAgICAgfVxuICAgICAgLy8gU3RvcmUgYW5kIHJlZ2lzdGVyIHRoZSB0YXNrXG4gICAgICB2YXIgdGFzayA9IHsgY2FsbGJhY2s6IGNhbGxiYWNrLCBhcmdzOiBhcmdzIH07XG4gICAgICB0YXNrc0J5SGFuZGxlW25leHRIYW5kbGVdID0gdGFzaztcbiAgICAgIHJlZ2lzdGVySW1tZWRpYXRlKG5leHRIYW5kbGUpO1xuICAgICAgcmV0dXJuIG5leHRIYW5kbGUrKztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShoYW5kbGUpIHtcbiAgICAgICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW4odGFzaykge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0YXNrLmNhbGxiYWNrO1xuICAgICAgICB2YXIgYXJncyA9IHRhc2suYXJncztcbiAgICAgICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW5JZlByZXNlbnQoaGFuZGxlKSB7XG4gICAgICAgIC8vIEZyb20gdGhlIHNwZWM6IFwiV2FpdCB1bnRpbCBhbnkgaW52b2NhdGlvbnMgb2YgdGhpcyBhbGdvcml0aG0gc3RhcnRlZCBiZWZvcmUgdGhpcyBvbmUgaGF2ZSBjb21wbGV0ZWQuXCJcbiAgICAgICAgLy8gU28gaWYgd2UncmUgY3VycmVudGx5IHJ1bm5pbmcgYSB0YXNrLCB3ZSdsbCBuZWVkIHRvIGRlbGF5IHRoaXMgaW52b2NhdGlvbi5cbiAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdBVGFzaykge1xuICAgICAgICAgICAgLy8gRGVsYXkgYnkgZG9pbmcgYSBzZXRUaW1lb3V0LiBzZXRJbW1lZGlhdGUgd2FzIHRyaWVkIGluc3RlYWQsIGJ1dCBpbiBGaXJlZm94IDcgaXQgZ2VuZXJhdGVkIGFcbiAgICAgICAgICAgIC8vIFwidG9vIG11Y2ggcmVjdXJzaW9uXCIgZXJyb3IuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgICAgICAgICAgaWYgKHRhc2spIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bih0YXNrKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckltbWVkaWF0ZShoYW5kbGUpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkgeyBydW5JZlByZXNlbnQoaGFuZGxlKTsgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuVXNlUG9zdE1lc3NhZ2UoKSB7XG4gICAgICAgIC8vIFRoZSB0ZXN0IGFnYWluc3QgYGltcG9ydFNjcmlwdHNgIHByZXZlbnRzIHRoaXMgaW1wbGVtZW50YXRpb24gZnJvbSBiZWluZyBpbnN0YWxsZWQgaW5zaWRlIGEgd2ViIHdvcmtlcixcbiAgICAgICAgLy8gd2hlcmUgYGdsb2JhbC5wb3N0TWVzc2FnZWAgbWVhbnMgc29tZXRoaW5nIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFuZCBjYW4ndCBiZSB1c2VkIGZvciB0aGlzIHB1cnBvc2UuXG4gICAgICAgIGlmIChnbG9iYWwucG9zdE1lc3NhZ2UgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgICAgICAgICB2YXIgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IHRydWU7XG4gICAgICAgICAgICB2YXIgb2xkT25NZXNzYWdlID0gZ2xvYmFsLm9ubWVzc2FnZTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKFwiXCIsIFwiKlwiKTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBvbGRPbk1lc3NhZ2U7XG4gICAgICAgICAgICByZXR1cm4gcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICAvLyBJbnN0YWxscyBhbiBldmVudCBoYW5kbGVyIG9uIGBnbG9iYWxgIGZvciB0aGUgYG1lc3NhZ2VgIGV2ZW50OiBzZWVcbiAgICAgICAgLy8gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9ET00vd2luZG93LnBvc3RNZXNzYWdlXG4gICAgICAgIC8vICogaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvY29tbXMuaHRtbCNjcm9zc0RvY3VtZW50TWVzc2FnZXNcblxuICAgICAgICB2YXIgbWVzc2FnZVByZWZpeCA9IFwic2V0SW1tZWRpYXRlJFwiICsgTWF0aC5yYW5kb20oKSArIFwiJFwiO1xuICAgICAgICB2YXIgb25HbG9iYWxNZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5pbmRleE9mKG1lc3NhZ2VQcmVmaXgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KCtldmVudC5kYXRhLnNsaWNlKG1lc3NhZ2VQcmVmaXgubGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWwuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UobWVzc2FnZVByZWZpeCArIGhhbmRsZSwgXCIqXCIpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgPHNjcmlwdD4gZWxlbWVudDsgaXRzIHJlYWR5c3RhdGVjaGFuZ2UgZXZlbnQgd2lsbCBiZSBmaXJlZCBhc3luY2hyb25vdXNseSBvbmNlIGl0IGlzIGluc2VydGVkXG4gICAgICAgICAgICAvLyBpbnRvIHRoZSBkb2N1bWVudC4gRG8gc28sIHRodXMgcXVldWluZyB1cCB0aGUgdGFzay4gUmVtZW1iZXIgdG8gY2xlYW4gdXAgb25jZSBpdCdzIGJlZW4gY2FsbGVkLlxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBodG1sLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIElmIHN1cHBvcnRlZCwgd2Ugc2hvdWxkIGF0dGFjaCB0byB0aGUgcHJvdG90eXBlIG9mIGdsb2JhbCwgc2luY2UgdGhhdCBpcyB3aGVyZSBzZXRUaW1lb3V0IGV0IGFsLiBsaXZlLlxuICAgIHZhciBhdHRhY2hUbyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsKTtcbiAgICBhdHRhY2hUbyA9IGF0dGFjaFRvICYmIGF0dGFjaFRvLnNldFRpbWVvdXQgPyBhdHRhY2hUbyA6IGdsb2JhbDtcblxuICAgIC8vIERvbid0IGdldCBmb29sZWQgYnkgZS5nLiBicm93c2VyaWZ5IGVudmlyb25tZW50cy5cbiAgICBpZiAoe30udG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09IFwiW29iamVjdCBwcm9jZXNzXVwiKSB7XG4gICAgICAgIC8vIEZvciBOb2RlLmpzIGJlZm9yZSAwLjlcbiAgICAgICAgaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoY2FuVXNlUG9zdE1lc3NhZ2UoKSkge1xuICAgICAgICAvLyBGb3Igbm9uLUlFMTAgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCkge1xuICAgICAgICAvLyBGb3Igd2ViIHdvcmtlcnMsIHdoZXJlIHN1cHBvcnRlZFxuICAgICAgICBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChkb2MgJiYgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBpbiBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSkge1xuICAgICAgICAvLyBGb3IgSUUgNuKAkzhcbiAgICAgICAgaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yIG9sZGVyIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKTtcbiAgICB9XG5cbiAgICBhdHRhY2hUby5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG4gICAgYXR0YWNoVG8uY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcbn0odHlwZW9mIHNlbGYgPT09IFwidW5kZWZpbmVkXCIgPyB0eXBlb2YgZ2xvYmFsID09PSBcInVuZGVmaW5lZFwiID8gdGhpcyA6IGdsb2JhbCA6IHNlbGYpKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qcyIsIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9zdHlsZS1sb2FkZXIvZml4VXJscy5qcyIsInZhciBhcHBseSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcblxuLy8gRE9NIEFQSXMsIGZvciBjb21wbGV0ZW5lc3NcblxuZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldFRpbWVvdXQsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJUaW1lb3V0KTtcbn07XG5leHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldEludGVydmFsLCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFySW50ZXJ2YWwpO1xufTtcbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cbmV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHtcbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lb3V0LmNsb3NlKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcbiAgdGhpcy5faWQgPSBpZDtcbiAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG59XG5UaW1lb3V0LnByb3RvdHlwZS51bnJlZiA9IFRpbWVvdXQucHJvdG90eXBlLnJlZiA9IGZ1bmN0aW9uKCkge307XG5UaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jbGVhckZuLmNhbGwod2luZG93LCB0aGlzLl9pZCk7XG59O1xuXG4vLyBEb2VzIG5vdCBzdGFydCB0aGUgdGltZSwganVzdCBzZXRzIHVwIHRoZSBtZW1iZXJzIG5lZWRlZC5cbmV4cG9ydHMuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSwgbXNlY3MpIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IG1zZWNzO1xufTtcblxuZXhwb3J0cy51bmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IC0xO1xufTtcblxuZXhwb3J0cy5fdW5yZWZBY3RpdmUgPSBleHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXG4gIHZhciBtc2VjcyA9IGl0ZW0uX2lkbGVUaW1lb3V0O1xuICBpZiAobXNlY3MgPj0gMCkge1xuICAgIGl0ZW0uX2lkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpIHtcbiAgICAgIGlmIChpdGVtLl9vblRpbWVvdXQpXG4gICAgICAgIGl0ZW0uX29uVGltZW91dCgpO1xuICAgIH0sIG1zZWNzKTtcbiAgfVxufTtcblxuLy8gc2V0aW1tZWRpYXRlIGF0dGFjaGVzIGl0c2VsZiB0byB0aGUgZ2xvYmFsIG9iamVjdFxucmVxdWlyZShcInNldGltbWVkaWF0ZVwiKTtcbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuZXhwb3J0cy5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLl8xeXlxbkJ2UEU4bkp4bm9tY0trOTl2e3Bvc2l0aW9uOmZpeGVkO3JpZ2h0OjA7Ym90dG9tOjB9XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuZXhwb3J0cy5sb2NhbHMgPSB7XG5cdFwiZml4ZWRCb3R0b21cIjogXCJfMXl5cW5CdlBFOG5KeG5vbWNLazk5dlwiXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9jc3MtbG9hZGVyP3tcIm1vZHVsZXNcIjp0cnVlLFwibWluaW1pemVcIjp0cnVlLFwiY2FtZWxDYXNlXCI6dHJ1ZX0hLi9zdHlsZXMuY3NzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xudmFyIHN0eWxlc0luRG9tID0ge30sXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xuXHRcdHZhciBtZW1vO1xuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fTtcblx0fSxcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0XHQvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG5cdFx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlciBcblx0XHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0XHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0XHRyZXR1cm4gd2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2I7XG5cdH0pLFxuXHRnZXRFbGVtZW50ID0gKGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIG1lbW8gPSB7fTtcblx0XHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0bWVtb1tzZWxlY3Rvcl0gPSBmbi5jYWxsKHRoaXMsIHNlbGVjdG9yKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHRcdH07XG5cdH0pKGZ1bmN0aW9uIChzdHlsZVRhcmdldCkge1xuXHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN0eWxlVGFyZ2V0KVxuXHR9KSxcblx0c2luZ2xldG9uRWxlbWVudCA9IG51bGwsXG5cdHNpbmdsZXRvbkNvdW50ZXIgPSAwLFxuXHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdLFxuXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vZml4VXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0SW50byA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QpO1xuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspXG5cdFx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oKTtcblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMobGlzdCkge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gaXRlbVswXTtcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcblx0XHRpZighbmV3U3R5bGVzW2lkXSlcblx0XHRcdHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZVxuXHRcdFx0bmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xuXHR9XG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpIHtcblx0dmFyIHN0eWxlVGFyZ2V0ID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8pXG5cdGlmICghc3R5bGVUYXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydEludG8nIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcblx0fVxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcFtzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZighbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcblx0XHRcdHN0eWxlVGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIHN0eWxlVGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZihsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0c3R5bGVUYXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZVRhcmdldC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHRcdH1cblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlRWxlbWVudCk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdHN0eWxlVGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcuIE11c3QgYmUgJ3RvcCcgb3IgJ2JvdHRvbScuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcblx0c3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0dmFyIGlkeCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGVFbGVtZW50KTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuXHR2YXIgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cblx0YXR0YWNoVGFnQXR0cnMoc3R5bGVFbGVtZW50LCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCk7XG5cdHJldHVybiBzdHlsZUVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpIHtcblx0dmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0b3B0aW9ucy5hdHRycy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuXHRhdHRhY2hUYWdBdHRycyhsaW5rRWxlbWVudCwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rRWxlbWVudCk7XG5cdHJldHVybiBsaW5rRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gYXR0YWNoVGFnQXR0cnMoZWxlbWVudCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlRWxlbWVudCwgdXBkYXRlLCByZW1vdmU7XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cdFx0c3R5bGVFbGVtZW50ID0gc2luZ2xldG9uRWxlbWVudCB8fCAoc2luZ2xldG9uRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIHRydWUpO1xuXHR9IGVsc2UgaWYob2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuXHRcdFx0aWYoc3R5bGVFbGVtZW50LmhyZWYpXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGVFbGVtZW50LmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZShuZXdPYmopIHtcblx0XHRpZihuZXdPYmopIHtcblx0XHRcdGlmKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcClcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZUVsZW1lbnQsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlRWxlbWVudC5jaGlsZE5vZGVzO1xuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlRWxlbWVudC5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGVFbGVtZW50LCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcblx0XHR9XG5cdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsobGlua0VsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0LyogSWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpe1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmtFbGVtZW50LmhyZWY7XG5cblx0bGlua0VsZW1lbnQuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKVxuXHRcdFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4vc3R5bGVzLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi9zdHlsZXMuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi9zdHlsZXMuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3N0eWxlcy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=