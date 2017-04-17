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
		if (className !== undefined) {
			if (attrs.class !== undefined) {
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
		if (attrs == null) {
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
	m.version = "1.1.1";
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
        { href: '/article/' + data.id + '}' },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmJjMTJlNGM0NjViM2IxM2U1MDAiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9taXRocmlsL21pdGhyaWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vZW50cnkuanMiLCJ3ZWJwYWNrOi8vLy4vbW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9iYXNlNjQtanMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L2llZWU3NTQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9pc2FycmF5L2luZGV4LmpzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L3N0eWxlLWxvYWRlci9maXhVcmxzLmpzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zdHlsZXMuY3NzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zdHlsZXMuY3NzP2E4MTMiXSwibmFtZXMiOlsiVm5vZGUiLCJ0YWciLCJrZXkiLCJhdHRyczAiLCJjaGlsZHJlbiIsInRleHQiLCJkb20iLCJhdHRycyIsImRvbVNpemUiLCJ1bmRlZmluZWQiLCJzdGF0ZSIsIl9zdGF0ZSIsImV2ZW50cyIsImluc3RhbmNlIiwic2tpcCIsIm5vcm1hbGl6ZSIsIm5vZGUiLCJBcnJheSIsImlzQXJyYXkiLCJub3JtYWxpemVDaGlsZHJlbiIsImkiLCJsZW5ndGgiLCJzZWxlY3RvclBhcnNlciIsInNlbGVjdG9yQ2FjaGUiLCJoYXNPd24iLCJoYXNPd25Qcm9wZXJ0eSIsImNvbXBpbGVTZWxlY3RvciIsInNlbGVjdG9yIiwibWF0Y2giLCJjbGFzc2VzIiwiZXhlYyIsInR5cGUiLCJ2YWx1ZSIsImlkIiwicHVzaCIsImF0dHJWYWx1ZSIsInJlcGxhY2UiLCJjbGFzc05hbWUiLCJqb2luIiwiZXhlY1NlbGVjdG9yIiwiaGFzQXR0cnMiLCJjaGlsZExpc3QiLCJjbGFzcyIsImNhbGwiLCJoeXBlcnNjcmlwdCIsImFyZ3VtZW50cyIsInN0YXJ0IiwidmlldyIsIkVycm9yIiwiY2FjaGVkIiwibm9ybWFsaXplZCIsInRydXN0IiwiaHRtbCIsImZyYWdtZW50IiwiYXR0cnMxIiwibSIsIlByb21pc2VQb2x5ZmlsbCIsImV4ZWN1dG9yIiwiVHlwZUVycm9yIiwic2VsZiIsInJlc29sdmVycyIsInJlamVjdG9ycyIsInJlc29sdmVDdXJyZW50IiwiaGFuZGxlciIsInJlamVjdEN1cnJlbnQiLCJfaW5zdGFuY2UiLCJjYWxsQXN5bmMiLCJzZXRJbW1lZGlhdGUiLCJzZXRUaW1lb3V0IiwibGlzdCIsInNob3VsZEFic29yYiIsImV4ZWN1dGUiLCJ0aGVuIiwiZXhlY3V0ZU9uY2UiLCJiaW5kIiwiY29uc29sZSIsImVycm9yIiwicmV0cnkiLCJlIiwicnVucyIsInJ1biIsImZuIiwib25lcnJvciIsInByb3RvdHlwZSIsIm9uRnVsZmlsbGVkIiwib25SZWplY3Rpb24iLCJoYW5kbGUiLCJjYWxsYmFjayIsIm5leHQiLCJyZXNvbHZlTmV4dCIsInJlamVjdE5leHQiLCJwcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNhdGNoIiwiYWxsIiwidG90YWwiLCJjb3VudCIsInZhbHVlcyIsImNvbnN1bWUiLCJyYWNlIiwid2luZG93IiwiUHJvbWlzZSIsImdsb2JhbCIsImJ1aWxkUXVlcnlTdHJpbmciLCJvYmplY3QiLCJPYmplY3QiLCJ0b1N0cmluZyIsImFyZ3MiLCJrZXkwIiwiZGVzdHJ1Y3R1cmUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJGSUxFX1BST1RPQ09MX1JFR0VYIiwiUmVnRXhwIiwiXzgiLCIkd2luZG93IiwiY2FsbGJhY2tDb3VudCIsIm9uY29tcGxldGlvbiIsInNldENvbXBsZXRpb25DYWxsYmFjayIsImZpbmFsaXplciIsImNvbXBsZXRlIiwiZmluYWxpemUiLCJwcm9taXNlMCIsInRoZW4wIiwiYXBwbHkiLCJleHRyYSIsInVybCIsInJlcXVlc3QiLCJtZXRob2QiLCJ0b1VwcGVyQ2FzZSIsInVzZUJvZHkiLCJzZXJpYWxpemUiLCJGb3JtRGF0YSIsImRhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwiZGVzZXJpYWxpemUiLCJleHRyYWN0IiwiaW50ZXJwb2xhdGUiLCJhc3NlbWJsZSIsInhociIsIlhNTEh0dHBSZXF1ZXN0IiwiYWJvcnRlZCIsIl9hYm9ydCIsImFib3J0Iiwib3BlbiIsImFzeW5jIiwidXNlciIsInBhc3N3b3JkIiwic2V0UmVxdWVzdEhlYWRlciIsIndpdGhDcmVkZW50aWFscyIsImhlYWRlcnMiLCJjb25maWciLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwicmVzcG9uc2UiLCJzdGF0dXMiLCJ0ZXN0IiwiY2FzdCIsInJlc3BvbnNlVGV4dCIsInNlbmQiLCJiYWNrZ3JvdW5kIiwianNvbnAiLCJjYWxsYmFja05hbWUiLCJNYXRoIiwicm91bmQiLCJyYW5kb20iLCJzY3JpcHQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJjYWxsYmFja0tleSIsInNyYyIsImRvY3VtZW50RWxlbWVudCIsImFwcGVuZENoaWxkIiwidG9rZW5zIiwic2xpY2UiLCJxdWVyeXN0cmluZyIsInByZWZpeCIsImluZGV4T2YiLCJwYXJzZSIsInR5cGUwIiwicmVxdWVzdFNlcnZpY2UiLCJjb3JlUmVuZGVyZXIiLCIkZG9jIiwiJGVtcHR5RnJhZ21lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50Iiwib25ldmVudCIsInNldEV2ZW50Q2FsbGJhY2siLCJjcmVhdGVOb2RlcyIsInBhcmVudCIsInZub2RlcyIsImVuZCIsImhvb2tzIiwibmV4dFNpYmxpbmciLCJucyIsInZub2RlIiwiY3JlYXRlTm9kZSIsImluaXRMaWZlY3ljbGUiLCJjcmVhdGVUZXh0IiwiY3JlYXRlSFRNTCIsImNyZWF0ZUZyYWdtZW50IiwiY3JlYXRlQ29tcG9uZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJpbnNlcnROb2RlIiwibWF0Y2gxIiwicGFyZW50MSIsImNhcHRpb24iLCJ0aGVhZCIsInRib2R5IiwidGZvb3QiLCJ0ciIsInRoIiwidGQiLCJjb2xncm91cCIsImNvbCIsInRlbXAiLCJpbm5lckhUTUwiLCJmaXJzdENoaWxkIiwiY2hpbGROb2RlcyIsImNoaWxkIiwiYXR0cnMyIiwiaXMiLCJlbGVtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwic2V0QXR0cnMiLCJjb250ZW50ZWRpdGFibGUiLCJzZXRDb250ZW50RWRpdGFibGUiLCJ0ZXh0Q29udGVudCIsInNldExhdGVBdHRycyIsImluaXRDb21wb25lbnQiLCJzZW50aW5lbCIsImNyZWF0ZSIsIiQkcmVlbnRyYW50TG9jayQkIiwidXBkYXRlTm9kZXMiLCJvbGQiLCJyZWN5Y2xpbmciLCJyZW1vdmVOb2RlcyIsImlzVW5rZXllZCIsImdldE5leHRTaWJsaW5nIiwidXBkYXRlTm9kZSIsImlzUmVjeWNsYWJsZSIsInBvb2wiLCJjb25jYXQiLCJvbGRTdGFydCIsIm9sZEVuZCIsIm1hcCIsIm8iLCJ2Iiwic2hvdWxkUmVjeWNsZSIsInRvRnJhZ21lbnQiLCJnZXRLZXlNYXAiLCJvbGRJbmRleCIsIm1vdmFibGUiLCJvbGRUYWciLCJzaG91bGROb3RVcGRhdGUiLCJ1cGRhdGVMaWZlY3ljbGUiLCJ1cGRhdGVUZXh0IiwidXBkYXRlSFRNTCIsInVwZGF0ZUZyYWdtZW50IiwidXBkYXRlRWxlbWVudCIsInVwZGF0ZUNvbXBvbmVudCIsInJlbW92ZU5vZGUiLCJub2RlVmFsdWUiLCJ1cGRhdGVBdHRycyIsImFicyIsIm9sZENoaWxkcmVuTGVuZ3RoIiwicG9vbENoaWxkcmVuTGVuZ3RoIiwidm5vZGVzQ2hpbGRyZW5MZW5ndGgiLCJrZXkyIiwiY291bnQwIiwiaW5zZXJ0QmVmb3JlIiwiY29udGVudCIsImNvbnRleHQiLCJleHBlY3RlZCIsImNhbGxlZCIsIm9uYmVmb3JlcmVtb3ZlIiwicmVzdWx0IiwiY29udGludWF0aW9uIiwib25yZW1vdmUiLCJyZW1vdmVOb2RlRnJvbURPTSIsImhhc0ludGVncmF0aW9uTWV0aG9kcyIsInNldEF0dHIiLCJpc0Zvcm1BdHRyaWJ1dGUiLCJpc0xpZmVjeWNsZU1ldGhvZCIsIm5zTGFzdEluZGV4Iiwic3Vic3RyIiwic2V0QXR0cmlidXRlTlMiLCJ1cGRhdGVFdmVudCIsInVwZGF0ZVN0eWxlIiwiaXNBdHRyaWJ1dGUiLCJpc0N1c3RvbUVsZW1lbnQiLCJhY3RpdmVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwic2VsZWN0ZWRJbmRleCIsImF0dHIiLCJzb3VyY2UiLCJvbmNyZWF0ZSIsIm9udXBkYXRlIiwic3R5bGUiLCJjc3NUZXh0IiwiZXZlbnROYW1lIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbmluaXQiLCJmb3JjZVZub2RlVXBkYXRlIiwiZm9yY2VDb21wb25lbnRVcGRhdGUiLCJvbmJlZm9yZXVwZGF0ZSIsInJlbmRlciIsImFjdGl2ZSIsImZvY3VzIiwidGhyb3R0bGUiLCJ0aW1lIiwibGFzdCIsInBlbmRpbmciLCJ0aW1lb3V0IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibm93IiwiRGF0ZSIsIl8xMSIsInJlbmRlclNlcnZpY2UiLCJyZWRyYXciLCJjYWxsYmFja3MiLCJzdWJzY3JpYmUiLCJrZXkxIiwidW5zdWJzY3JpYmUiLCJpbmRleCIsInNwbGljZSIsInJlZHJhd1NlcnZpY2UiLCJfMTYiLCJyZWRyYXdTZXJ2aWNlMCIsInJvb3QiLCJjb21wb25lbnQiLCJydW4wIiwibW91bnQiLCJwYXJzZVF1ZXJ5U3RyaW5nIiwic3RyaW5nIiwiY2hhckF0IiwiZW50cmllcyIsInNwbGl0IiwiZGF0YTAiLCJjb3VudGVycyIsImVudHJ5Iiwia2V5NSIsImRlY29kZVVSSUNvbXBvbmVudCIsImxldmVscyIsImN1cnNvciIsInBvcCIsImoiLCJsZXZlbCIsIm5leHRMZXZlbCIsImlzTnVtYmVyIiwiaXNOYU4iLCJwYXJzZUludCIsImlzVmFsdWUiLCJjb3JlUm91dGVyIiwic3VwcG9ydHNQdXNoU3RhdGUiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiY2FsbEFzeW5jMCIsIm5vcm1hbGl6ZTEiLCJmcmFnbWVudDAiLCJsb2NhdGlvbiIsImFzeW5jSWQiLCJkZWJvdW5jZUFzeW5jIiwiY2FsbGJhY2swIiwicGFyc2VQYXRoIiwicGF0aCIsInF1ZXJ5RGF0YSIsImhhc2hEYXRhIiwicXVlcnlJbmRleCIsImhhc2hJbmRleCIsInBhdGhFbmQiLCJxdWVyeUVuZCIsInF1ZXJ5UGFyYW1zIiwia2V5NCIsImhhc2hQYXJhbXMiLCJyb3V0ZXIiLCJnZXRQYXRoIiwidHlwZTIiLCJzZXRQYXRoIiwib3B0aW9ucyIsIm1hdGNoMiIsInRva2VuIiwicXVlcnkiLCJoYXNoIiwidGl0bGUiLCJvbnBvcHN0YXRlIiwicmVwbGFjZVN0YXRlIiwiaHJlZiIsImRlZmluZVJvdXRlcyIsInJvdXRlcyIsInJlc29sdmVSb3V0ZSIsInBhcmFtcyIsInBhdGhuYW1lIiwiayIsInJvdXRlMCIsIm1hdGNoZXIiLCJrZXlzIiwib25oYXNoY2hhbmdlIiwiXzIwIiwicm91dGVTZXJ2aWNlIiwiaWRlbnRpdHkiLCJyZW5kZXIxIiwiYXR0cnMzIiwiY3VycmVudFBhdGgiLCJsYXN0VXBkYXRlIiwicm91dGUiLCJkZWZhdWx0Um91dGUiLCJydW4xIiwiYmFpbCIsInBheWxvYWQiLCJ1cGRhdGUiLCJyb3V0ZVJlc29sdmVyIiwiY29tcCIsIm9ubWF0Y2giLCJyZXNvbHZlZCIsInNldCIsImdldCIsInByZWZpeDAiLCJsaW5rIiwidm5vZGUxIiwib25jbGljayIsImN0cmxLZXkiLCJtZXRhS2V5Iiwic2hpZnRLZXkiLCJ3aGljaCIsInByZXZlbnREZWZhdWx0IiwiZ2V0QXR0cmlidXRlIiwicGFyYW0iLCJrZXkzIiwid2l0aEF0dHIiLCJhdHRyTmFtZSIsImNhbGxiYWNrMSIsImN1cnJlbnRUYXJnZXQiLCJfMjgiLCJ2ZXJzaW9uIiwibW9kdWxlIiwiZyIsIkZ1bmN0aW9uIiwiZXZhbCIsImV4cG9ydHMiLCJVbCIsImlubmVyIiwiTGkiLCJEZXRhaWxzIiwic3VtbWFyeSIsIlllYXIiLCJtb250aHMiLCJkIiwieWVhciIsIk1vbnRoIiwiZGF5cyIsIm1vbnRoIiwiRGF5IiwiZGF5IiwiZmV0Y2giLCJhcnRpY2xlSW5kZXgiLCJmZXRjaGVkIiwiZ2V0RWxlbWVudEJ5SWQiLCJNb2RlbCIsImJ5dGVMZW5ndGgiLCJ0b0J5dGVBcnJheSIsImZyb21CeXRlQXJyYXkiLCJsb29rdXAiLCJyZXZMb29rdXAiLCJBcnIiLCJVaW50OEFycmF5IiwiY29kZSIsImxlbiIsImNoYXJDb2RlQXQiLCJwbGFjZUhvbGRlcnNDb3VudCIsImI2NCIsImwiLCJ0bXAiLCJwbGFjZUhvbGRlcnMiLCJhcnIiLCJMIiwidHJpcGxldFRvQmFzZTY0IiwibnVtIiwiZW5jb2RlQ2h1bmsiLCJ1aW50OCIsIm91dHB1dCIsImV4dHJhQnl0ZXMiLCJwYXJ0cyIsIm1heENodW5rTGVuZ3RoIiwibGVuMiIsImJhc2U2NCIsInJlcXVpcmUiLCJpZWVlNzU0IiwiQnVmZmVyIiwiU2xvd0J1ZmZlciIsIklOU1BFQ1RfTUFYX0JZVEVTIiwiVFlQRURfQVJSQVlfU1VQUE9SVCIsInR5cGVkQXJyYXlTdXBwb3J0Iiwia01heExlbmd0aCIsIl9fcHJvdG9fXyIsImZvbyIsInN1YmFycmF5IiwiY3JlYXRlQnVmZmVyIiwidGhhdCIsIlJhbmdlRXJyb3IiLCJhcmciLCJlbmNvZGluZ09yT2Zmc2V0IiwiYWxsb2NVbnNhZmUiLCJmcm9tIiwicG9vbFNpemUiLCJfYXVnbWVudCIsIkFycmF5QnVmZmVyIiwiZnJvbUFycmF5QnVmZmVyIiwiZnJvbVN0cmluZyIsImZyb21PYmplY3QiLCJTeW1ib2wiLCJzcGVjaWVzIiwiZGVmaW5lUHJvcGVydHkiLCJjb25maWd1cmFibGUiLCJhc3NlcnRTaXplIiwic2l6ZSIsImFsbG9jIiwiZmlsbCIsImVuY29kaW5nIiwiY2hlY2tlZCIsImFsbG9jVW5zYWZlU2xvdyIsImlzRW5jb2RpbmciLCJhY3R1YWwiLCJ3cml0ZSIsImZyb21BcnJheUxpa2UiLCJhcnJheSIsImJ5dGVPZmZzZXQiLCJvYmoiLCJpc0J1ZmZlciIsImNvcHkiLCJidWZmZXIiLCJpc25hbiIsImIiLCJfaXNCdWZmZXIiLCJjb21wYXJlIiwiYSIsIngiLCJ5IiwibWluIiwiU3RyaW5nIiwidG9Mb3dlckNhc2UiLCJwb3MiLCJidWYiLCJpc1ZpZXciLCJsb3dlcmVkQ2FzZSIsInV0ZjhUb0J5dGVzIiwiYmFzZTY0VG9CeXRlcyIsInNsb3dUb1N0cmluZyIsImhleFNsaWNlIiwidXRmOFNsaWNlIiwiYXNjaWlTbGljZSIsImxhdGluMVNsaWNlIiwiYmFzZTY0U2xpY2UiLCJ1dGYxNmxlU2xpY2UiLCJzd2FwIiwibiIsInN3YXAxNiIsInN3YXAzMiIsInN3YXA2NCIsImVxdWFscyIsImluc3BlY3QiLCJzdHIiLCJtYXgiLCJ0YXJnZXQiLCJ0aGlzU3RhcnQiLCJ0aGlzRW5kIiwidGhpc0NvcHkiLCJ0YXJnZXRDb3B5IiwiYmlkaXJlY3Rpb25hbEluZGV4T2YiLCJ2YWwiLCJkaXIiLCJhcnJheUluZGV4T2YiLCJsYXN0SW5kZXhPZiIsImluZGV4U2l6ZSIsImFyckxlbmd0aCIsInZhbExlbmd0aCIsInJlYWQiLCJyZWFkVUludDE2QkUiLCJmb3VuZEluZGV4IiwiZm91bmQiLCJpbmNsdWRlcyIsImhleFdyaXRlIiwib2Zmc2V0IiwiTnVtYmVyIiwicmVtYWluaW5nIiwic3RyTGVuIiwicGFyc2VkIiwidXRmOFdyaXRlIiwiYmxpdEJ1ZmZlciIsImFzY2lpV3JpdGUiLCJhc2NpaVRvQnl0ZXMiLCJsYXRpbjFXcml0ZSIsImJhc2U2NFdyaXRlIiwidWNzMldyaXRlIiwidXRmMTZsZVRvQnl0ZXMiLCJpc0Zpbml0ZSIsInRvSlNPTiIsIl9hcnIiLCJyZXMiLCJmaXJzdEJ5dGUiLCJjb2RlUG9pbnQiLCJieXRlc1BlclNlcXVlbmNlIiwic2Vjb25kQnl0ZSIsInRoaXJkQnl0ZSIsImZvdXJ0aEJ5dGUiLCJ0ZW1wQ29kZVBvaW50IiwiZGVjb2RlQ29kZVBvaW50c0FycmF5IiwiTUFYX0FSR1VNRU5UU19MRU5HVEgiLCJjb2RlUG9pbnRzIiwiZnJvbUNoYXJDb2RlIiwicmV0Iiwib3V0IiwidG9IZXgiLCJieXRlcyIsIm5ld0J1ZiIsInNsaWNlTGVuIiwiY2hlY2tPZmZzZXQiLCJleHQiLCJyZWFkVUludExFIiwibm9Bc3NlcnQiLCJtdWwiLCJyZWFkVUludEJFIiwicmVhZFVJbnQ4IiwicmVhZFVJbnQxNkxFIiwicmVhZFVJbnQzMkxFIiwicmVhZFVJbnQzMkJFIiwicmVhZEludExFIiwicG93IiwicmVhZEludEJFIiwicmVhZEludDgiLCJyZWFkSW50MTZMRSIsInJlYWRJbnQxNkJFIiwicmVhZEludDMyTEUiLCJyZWFkSW50MzJCRSIsInJlYWRGbG9hdExFIiwicmVhZEZsb2F0QkUiLCJyZWFkRG91YmxlTEUiLCJyZWFkRG91YmxlQkUiLCJjaGVja0ludCIsIndyaXRlVUludExFIiwibWF4Qnl0ZXMiLCJ3cml0ZVVJbnRCRSIsIndyaXRlVUludDgiLCJmbG9vciIsIm9iamVjdFdyaXRlVUludDE2IiwibGl0dGxlRW5kaWFuIiwid3JpdGVVSW50MTZMRSIsIndyaXRlVUludDE2QkUiLCJvYmplY3RXcml0ZVVJbnQzMiIsIndyaXRlVUludDMyTEUiLCJ3cml0ZVVJbnQzMkJFIiwid3JpdGVJbnRMRSIsImxpbWl0Iiwic3ViIiwid3JpdGVJbnRCRSIsIndyaXRlSW50OCIsIndyaXRlSW50MTZMRSIsIndyaXRlSW50MTZCRSIsIndyaXRlSW50MzJMRSIsIndyaXRlSW50MzJCRSIsImNoZWNrSUVFRTc1NCIsIndyaXRlRmxvYXQiLCJ3cml0ZUZsb2F0TEUiLCJ3cml0ZUZsb2F0QkUiLCJ3cml0ZURvdWJsZSIsIndyaXRlRG91YmxlTEUiLCJ3cml0ZURvdWJsZUJFIiwidGFyZ2V0U3RhcnQiLCJJTlZBTElEX0JBU0U2NF9SRSIsImJhc2U2NGNsZWFuIiwic3RyaW5ndHJpbSIsInRyaW0iLCJ1bml0cyIsIkluZmluaXR5IiwibGVhZFN1cnJvZ2F0ZSIsImJ5dGVBcnJheSIsImMiLCJoaSIsImxvIiwiZHN0IiwidXNlU291cmNlTWFwIiwiaXRlbSIsImNzc1dpdGhNYXBwaW5nVG9TdHJpbmciLCJtb2R1bGVzIiwibWVkaWFRdWVyeSIsImFscmVhZHlJbXBvcnRlZE1vZHVsZXMiLCJjc3NNYXBwaW5nIiwic291cmNlTWFwcGluZyIsInRvQ29tbWVudCIsInNvdXJjZVVSTHMiLCJzb3VyY2VzIiwic291cmNlUm9vdCIsInNvdXJjZU1hcCIsImlzTEUiLCJtTGVuIiwibkJ5dGVzIiwiZUxlbiIsImVNYXgiLCJlQmlhcyIsIm5CaXRzIiwicyIsIk5hTiIsInJ0IiwibG9nIiwiTE4yIiwicHJvY2VzcyIsImNhY2hlZFNldFRpbWVvdXQiLCJjYWNoZWRDbGVhclRpbWVvdXQiLCJkZWZhdWx0U2V0VGltb3V0IiwiZGVmYXVsdENsZWFyVGltZW91dCIsImNsZWFyVGltZW91dCIsInJ1blRpbWVvdXQiLCJmdW4iLCJydW5DbGVhclRpbWVvdXQiLCJtYXJrZXIiLCJxdWV1ZSIsImRyYWluaW5nIiwiY3VycmVudFF1ZXVlIiwicXVldWVJbmRleCIsImNsZWFuVXBOZXh0VGljayIsImRyYWluUXVldWUiLCJuZXh0VGljayIsIkl0ZW0iLCJicm93c2VyIiwiZW52IiwiYXJndiIsInZlcnNpb25zIiwibm9vcCIsIm9uIiwiYWRkTGlzdGVuZXIiLCJvbmNlIiwib2ZmIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJlbWl0IiwiYmluZGluZyIsIm5hbWUiLCJjd2QiLCJjaGRpciIsInVtYXNrIiwibmV4dEhhbmRsZSIsInRhc2tzQnlIYW5kbGUiLCJjdXJyZW50bHlSdW5uaW5nQVRhc2siLCJkb2MiLCJyZWdpc3RlckltbWVkaWF0ZSIsInRhc2siLCJjbGVhckltbWVkaWF0ZSIsInJ1bklmUHJlc2VudCIsImluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uIiwiY2FuVXNlUG9zdE1lc3NhZ2UiLCJwb3N0TWVzc2FnZSIsImltcG9ydFNjcmlwdHMiLCJwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzIiwib2xkT25NZXNzYWdlIiwib25tZXNzYWdlIiwiaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24iLCJtZXNzYWdlUHJlZml4Iiwib25HbG9iYWxNZXNzYWdlIiwiZXZlbnQiLCJhdHRhY2hFdmVudCIsImluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uIiwiY2hhbm5lbCIsIk1lc3NhZ2VDaGFubmVsIiwicG9ydDEiLCJwb3J0MiIsImluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24iLCJpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uIiwiYXR0YWNoVG8iLCJnZXRQcm90b3R5cGVPZiIsImNzcyIsImJhc2VVcmwiLCJwcm90b2NvbCIsImhvc3QiLCJjdXJyZW50RGlyIiwiZml4ZWRDc3MiLCJmdWxsTWF0Y2giLCJvcmlnVXJsIiwidW5xdW90ZWRPcmlnVXJsIiwiJDEiLCJuZXdVcmwiLCJUaW1lb3V0Iiwic2V0SW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwiY2xvc2UiLCJjbGVhckZuIiwiX2lkIiwiX2NsZWFyRm4iLCJ1bnJlZiIsInJlZiIsImVucm9sbCIsIm1zZWNzIiwiX2lkbGVUaW1lb3V0SWQiLCJfaWRsZVRpbWVvdXQiLCJ1bmVucm9sbCIsIl91bnJlZkFjdGl2ZSIsIm9uVGltZW91dCIsIl9vblRpbWVvdXQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7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QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEOztBQUVBLDZCQUE2QixtQkFBbUI7O0FBRWhEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQ2pTQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFpRjtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLGdDQUFnQyxVQUFVLEVBQUU7QUFDNUMsQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2YmMxMmU0YzQ2NWIzYjEzZTUwMCIsIjsoZnVuY3Rpb24oKSB7XG5cInVzZSBzdHJpY3RcIlxuZnVuY3Rpb24gVm5vZGUodGFnLCBrZXksIGF0dHJzMCwgY2hpbGRyZW4sIHRleHQsIGRvbSkge1xuXHRyZXR1cm4ge3RhZzogdGFnLCBrZXk6IGtleSwgYXR0cnM6IGF0dHJzMCwgY2hpbGRyZW46IGNoaWxkcmVuLCB0ZXh0OiB0ZXh0LCBkb206IGRvbSwgZG9tU2l6ZTogdW5kZWZpbmVkLCBzdGF0ZTogdW5kZWZpbmVkLCBfc3RhdGU6IHVuZGVmaW5lZCwgZXZlbnRzOiB1bmRlZmluZWQsIGluc3RhbmNlOiB1bmRlZmluZWQsIHNraXA6IGZhbHNlfVxufVxuVm5vZGUubm9ybWFsaXplID0gZnVuY3Rpb24obm9kZSkge1xuXHRpZiAoQXJyYXkuaXNBcnJheShub2RlKSkgcmV0dXJuIFZub2RlKFwiW1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgVm5vZGUubm9ybWFsaXplQ2hpbGRyZW4obm9kZSksIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxuXHRpZiAobm9kZSAhPSBudWxsICYmIHR5cGVvZiBub2RlICE9PSBcIm9iamVjdFwiKSByZXR1cm4gVm5vZGUoXCIjXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBub2RlID09PSBmYWxzZSA/IFwiXCIgOiBub2RlLCB1bmRlZmluZWQsIHVuZGVmaW5lZClcblx0cmV0dXJuIG5vZGVcbn1cblZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuID0gZnVuY3Rpb24gbm9ybWFsaXplQ2hpbGRyZW4oY2hpbGRyZW4pIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGNoaWxkcmVuW2ldID0gVm5vZGUubm9ybWFsaXplKGNoaWxkcmVuW2ldKVxuXHR9XG5cdHJldHVybiBjaGlsZHJlblxufVxudmFyIHNlbGVjdG9yUGFyc2VyID0gLyg/OihefCN8XFwuKShbXiNcXC5cXFtcXF1dKykpfChcXFsoLis/KSg/Olxccyo9XFxzKihcInwnfCkoKD86XFxcXFtcIidcXF1dfC4pKj8pXFw1KT9cXF0pL2dcbnZhciBzZWxlY3RvckNhY2hlID0ge31cbnZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eVxuZnVuY3Rpb24gY29tcGlsZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG5cdHZhciBtYXRjaCwgdGFnID0gXCJkaXZcIiwgY2xhc3NlcyA9IFtdLCBhdHRycyA9IHt9XG5cdHdoaWxlIChtYXRjaCA9IHNlbGVjdG9yUGFyc2VyLmV4ZWMoc2VsZWN0b3IpKSB7XG5cdFx0dmFyIHR5cGUgPSBtYXRjaFsxXSwgdmFsdWUgPSBtYXRjaFsyXVxuXHRcdGlmICh0eXBlID09PSBcIlwiICYmIHZhbHVlICE9PSBcIlwiKSB0YWcgPSB2YWx1ZVxuXHRcdGVsc2UgaWYgKHR5cGUgPT09IFwiI1wiKSBhdHRycy5pZCA9IHZhbHVlXG5cdFx0ZWxzZSBpZiAodHlwZSA9PT0gXCIuXCIpIGNsYXNzZXMucHVzaCh2YWx1ZSlcblx0XHRlbHNlIGlmIChtYXRjaFszXVswXSA9PT0gXCJbXCIpIHtcblx0XHRcdHZhciBhdHRyVmFsdWUgPSBtYXRjaFs2XVxuXHRcdFx0aWYgKGF0dHJWYWx1ZSkgYXR0clZhbHVlID0gYXR0clZhbHVlLnJlcGxhY2UoL1xcXFwoW1wiJ10pL2csIFwiJDFcIikucmVwbGFjZSgvXFxcXFxcXFwvZywgXCJcXFxcXCIpXG5cdFx0XHRpZiAobWF0Y2hbNF0gPT09IFwiY2xhc3NcIikgY2xhc3Nlcy5wdXNoKGF0dHJWYWx1ZSlcblx0XHRcdGVsc2UgYXR0cnNbbWF0Y2hbNF1dID0gYXR0clZhbHVlIHx8IHRydWVcblx0XHR9XG5cdH1cblx0aWYgKGNsYXNzZXMubGVuZ3RoID4gMCkgYXR0cnMuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKFwiIFwiKVxuXHRyZXR1cm4gc2VsZWN0b3JDYWNoZVtzZWxlY3Rvcl0gPSB7dGFnOiB0YWcsIGF0dHJzOiBhdHRyc31cbn1cbmZ1bmN0aW9uIGV4ZWNTZWxlY3RvcihzdGF0ZSwgYXR0cnMsIGNoaWxkcmVuKSB7XG5cdHZhciBoYXNBdHRycyA9IGZhbHNlLCBjaGlsZExpc3QsIHRleHRcblx0dmFyIGNsYXNzTmFtZSA9IGF0dHJzLmNsYXNzTmFtZSB8fCBhdHRycy5jbGFzc1xuXHRmb3IgKHZhciBrZXkgaW4gc3RhdGUuYXR0cnMpIHtcblx0XHRpZiAoaGFzT3duLmNhbGwoc3RhdGUuYXR0cnMsIGtleSkpIHtcblx0XHRcdGF0dHJzW2tleV0gPSBzdGF0ZS5hdHRyc1trZXldXG5cdFx0fVxuXHR9XG5cdGlmIChjbGFzc05hbWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdGlmIChhdHRycy5jbGFzcyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRhdHRycy5jbGFzcyA9IHVuZGVmaW5lZFxuXHRcdFx0YXR0cnMuY2xhc3NOYW1lID0gY2xhc3NOYW1lXG5cdFx0fVxuXHRcdGlmIChzdGF0ZS5hdHRycy5jbGFzc05hbWUgIT0gbnVsbCkge1xuXHRcdFx0YXR0cnMuY2xhc3NOYW1lID0gc3RhdGUuYXR0cnMuY2xhc3NOYW1lICsgXCIgXCIgKyBjbGFzc05hbWVcblx0XHR9XG5cdH1cblx0Zm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG5cdFx0aWYgKGhhc093bi5jYWxsKGF0dHJzLCBrZXkpICYmIGtleSAhPT0gXCJrZXlcIikge1xuXHRcdFx0aGFzQXR0cnMgPSB0cnVlXG5cdFx0XHRicmVha1xuXHRcdH1cblx0fVxuXHRpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikgJiYgY2hpbGRyZW4ubGVuZ3RoID09PSAxICYmIGNoaWxkcmVuWzBdICE9IG51bGwgJiYgY2hpbGRyZW5bMF0udGFnID09PSBcIiNcIikge1xuXHRcdHRleHQgPSBjaGlsZHJlblswXS5jaGlsZHJlblxuXHR9IGVsc2Uge1xuXHRcdGNoaWxkTGlzdCA9IGNoaWxkcmVuXG5cdH1cblx0cmV0dXJuIFZub2RlKHN0YXRlLnRhZywgYXR0cnMua2V5LCBoYXNBdHRycyA/IGF0dHJzIDogdW5kZWZpbmVkLCBjaGlsZExpc3QsIHRleHQpXG59XG5mdW5jdGlvbiBoeXBlcnNjcmlwdChzZWxlY3Rvcikge1xuXHQvLyBCZWNhdXNlIHNsb3BweSBtb2RlIHN1Y2tzXG5cdHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXSwgc3RhcnQgPSAyLCBjaGlsZHJlblxuXHRpZiAoc2VsZWN0b3IgPT0gbnVsbCB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHNlbGVjdG9yICE9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIHNlbGVjdG9yLnZpZXcgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdHRocm93IEVycm9yKFwiVGhlIHNlbGVjdG9yIG11c3QgYmUgZWl0aGVyIGEgc3RyaW5nIG9yIGEgY29tcG9uZW50LlwiKTtcblx0fVxuXHRpZiAodHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiKSB7XG5cdFx0dmFyIGNhY2hlZCA9IHNlbGVjdG9yQ2FjaGVbc2VsZWN0b3JdIHx8IGNvbXBpbGVTZWxlY3RvcihzZWxlY3Rvcilcblx0fVxuXHRpZiAoYXR0cnMgPT0gbnVsbCkge1xuXHRcdGF0dHJzID0ge31cblx0fSBlbHNlIGlmICh0eXBlb2YgYXR0cnMgIT09IFwib2JqZWN0XCIgfHwgYXR0cnMudGFnICE9IG51bGwgfHwgQXJyYXkuaXNBcnJheShhdHRycykpIHtcblx0XHRhdHRycyA9IHt9XG5cdFx0c3RhcnQgPSAxXG5cdH1cblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IHN0YXJ0ICsgMSkge1xuXHRcdGNoaWxkcmVuID0gYXJndW1lbnRzW3N0YXJ0XVxuXHRcdGlmICghQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIGNoaWxkcmVuID0gW2NoaWxkcmVuXVxuXHR9IGVsc2Uge1xuXHRcdGNoaWxkcmVuID0gW11cblx0XHR3aGlsZSAoc3RhcnQgPCBhcmd1bWVudHMubGVuZ3RoKSBjaGlsZHJlbi5wdXNoKGFyZ3VtZW50c1tzdGFydCsrXSlcblx0fVxuXHR2YXIgbm9ybWFsaXplZCA9IFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKGNoaWxkcmVuKVxuXHRpZiAodHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIGV4ZWNTZWxlY3RvcihjYWNoZWQsIGF0dHJzLCBub3JtYWxpemVkKVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBWbm9kZShzZWxlY3RvciwgYXR0cnMua2V5LCBhdHRycywgbm9ybWFsaXplZClcblx0fVxufVxuaHlwZXJzY3JpcHQudHJ1c3QgPSBmdW5jdGlvbihodG1sKSB7XG5cdGlmIChodG1sID09IG51bGwpIGh0bWwgPSBcIlwiXG5cdHJldHVybiBWbm9kZShcIjxcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGh0bWwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxufVxuaHlwZXJzY3JpcHQuZnJhZ21lbnQgPSBmdW5jdGlvbihhdHRyczEsIGNoaWxkcmVuKSB7XG5cdHJldHVybiBWbm9kZShcIltcIiwgYXR0cnMxLmtleSwgYXR0cnMxLCBWbm9kZS5ub3JtYWxpemVDaGlsZHJlbihjaGlsZHJlbiksIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxufVxudmFyIG0gPSBoeXBlcnNjcmlwdFxuLyoqIEBjb25zdHJ1Y3RvciAqL1xudmFyIFByb21pc2VQb2x5ZmlsbCA9IGZ1bmN0aW9uKGV4ZWN1dG9yKSB7XG5cdGlmICghKHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlUG9seWZpbGwpKSB0aHJvdyBuZXcgRXJyb3IoXCJQcm9taXNlIG11c3QgYmUgY2FsbGVkIHdpdGggYG5ld2BcIilcblx0aWYgKHR5cGVvZiBleGVjdXRvciAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpXG5cdHZhciBzZWxmID0gdGhpcywgcmVzb2x2ZXJzID0gW10sIHJlamVjdG9ycyA9IFtdLCByZXNvbHZlQ3VycmVudCA9IGhhbmRsZXIocmVzb2x2ZXJzLCB0cnVlKSwgcmVqZWN0Q3VycmVudCA9IGhhbmRsZXIocmVqZWN0b3JzLCBmYWxzZSlcblx0dmFyIGluc3RhbmNlID0gc2VsZi5faW5zdGFuY2UgPSB7cmVzb2x2ZXJzOiByZXNvbHZlcnMsIHJlamVjdG9yczogcmVqZWN0b3JzfVxuXHR2YXIgY2FsbEFzeW5jID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gXCJmdW5jdGlvblwiID8gc2V0SW1tZWRpYXRlIDogc2V0VGltZW91dFxuXHRmdW5jdGlvbiBoYW5kbGVyKGxpc3QsIHNob3VsZEFic29yYikge1xuXHRcdHJldHVybiBmdW5jdGlvbiBleGVjdXRlKHZhbHVlKSB7XG5cdFx0XHR2YXIgdGhlblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKHNob3VsZEFic29yYiAmJiB2YWx1ZSAhPSBudWxsICYmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpICYmIHR5cGVvZiAodGhlbiA9IHZhbHVlLnRoZW4pID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRpZiAodmFsdWUgPT09IHNlbGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIHcvIGl0c2VsZlwiKVxuXHRcdFx0XHRcdGV4ZWN1dGVPbmNlKHRoZW4uYmluZCh2YWx1ZSkpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Y2FsbEFzeW5jKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aWYgKCFzaG91bGRBYnNvcmIgJiYgbGlzdC5sZW5ndGggPT09IDApIGNvbnNvbGUuZXJyb3IoXCJQb3NzaWJsZSB1bmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb246XCIsIHZhbHVlKVxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSBsaXN0W2ldKHZhbHVlKVxuXHRcdFx0XHRcdFx0cmVzb2x2ZXJzLmxlbmd0aCA9IDAsIHJlamVjdG9ycy5sZW5ndGggPSAwXG5cdFx0XHRcdFx0XHRpbnN0YW5jZS5zdGF0ZSA9IHNob3VsZEFic29yYlxuXHRcdFx0XHRcdFx0aW5zdGFuY2UucmV0cnkgPSBmdW5jdGlvbigpIHtleGVjdXRlKHZhbHVlKX1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRyZWplY3RDdXJyZW50KGUpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIGV4ZWN1dGVPbmNlKHRoZW4pIHtcblx0XHR2YXIgcnVucyA9IDBcblx0XHRmdW5jdGlvbiBydW4oZm4pIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRpZiAocnVucysrID4gMCkgcmV0dXJuXG5cdFx0XHRcdGZuKHZhbHVlKVxuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgb25lcnJvciA9IHJ1bihyZWplY3RDdXJyZW50KVxuXHRcdHRyeSB7dGhlbihydW4ocmVzb2x2ZUN1cnJlbnQpLCBvbmVycm9yKX0gY2F0Y2ggKGUpIHtvbmVycm9yKGUpfVxuXHR9XG5cdGV4ZWN1dGVPbmNlKGV4ZWN1dG9yKVxufVxuUHJvbWlzZVBvbHlmaWxsLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0aW9uKSB7XG5cdHZhciBzZWxmID0gdGhpcywgaW5zdGFuY2UgPSBzZWxmLl9pbnN0YW5jZVxuXHRmdW5jdGlvbiBoYW5kbGUoY2FsbGJhY2ssIGxpc3QsIG5leHQsIHN0YXRlKSB7XG5cdFx0bGlzdC5wdXNoKGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIG5leHQodmFsdWUpXG5cdFx0XHRlbHNlIHRyeSB7cmVzb2x2ZU5leHQoY2FsbGJhY2sodmFsdWUpKX0gY2F0Y2ggKGUpIHtpZiAocmVqZWN0TmV4dCkgcmVqZWN0TmV4dChlKX1cblx0XHR9KVxuXHRcdGlmICh0eXBlb2YgaW5zdGFuY2UucmV0cnkgPT09IFwiZnVuY3Rpb25cIiAmJiBzdGF0ZSA9PT0gaW5zdGFuY2Uuc3RhdGUpIGluc3RhbmNlLnJldHJ5KClcblx0fVxuXHR2YXIgcmVzb2x2ZU5leHQsIHJlamVjdE5leHRcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge3Jlc29sdmVOZXh0ID0gcmVzb2x2ZSwgcmVqZWN0TmV4dCA9IHJlamVjdH0pXG5cdGhhbmRsZShvbkZ1bGZpbGxlZCwgaW5zdGFuY2UucmVzb2x2ZXJzLCByZXNvbHZlTmV4dCwgdHJ1ZSksIGhhbmRsZShvblJlamVjdGlvbiwgaW5zdGFuY2UucmVqZWN0b3JzLCByZWplY3ROZXh0LCBmYWxzZSlcblx0cmV0dXJuIHByb21pc2Vcbn1cblByb21pc2VQb2x5ZmlsbC5wcm90b3R5cGUuY2F0Y2ggPSBmdW5jdGlvbihvblJlamVjdGlvbikge1xuXHRyZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKVxufVxuUHJvbWlzZVBvbHlmaWxsLnJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlUG9seWZpbGwpIHJldHVybiB2YWx1ZVxuXHRyZXR1cm4gbmV3IFByb21pc2VQb2x5ZmlsbChmdW5jdGlvbihyZXNvbHZlKSB7cmVzb2x2ZSh2YWx1ZSl9KVxufVxuUHJvbWlzZVBvbHlmaWxsLnJlamVjdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge3JlamVjdCh2YWx1ZSl9KVxufVxuUHJvbWlzZVBvbHlmaWxsLmFsbCA9IGZ1bmN0aW9uKGxpc3QpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlUG9seWZpbGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0dmFyIHRvdGFsID0gbGlzdC5sZW5ndGgsIGNvdW50ID0gMCwgdmFsdWVzID0gW11cblx0XHRpZiAobGlzdC5sZW5ndGggPT09IDApIHJlc29sdmUoW10pXG5cdFx0ZWxzZSBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdChmdW5jdGlvbihpKSB7XG5cdFx0XHRcdGZ1bmN0aW9uIGNvbnN1bWUodmFsdWUpIHtcblx0XHRcdFx0XHRjb3VudCsrXG5cdFx0XHRcdFx0dmFsdWVzW2ldID0gdmFsdWVcblx0XHRcdFx0XHRpZiAoY291bnQgPT09IHRvdGFsKSByZXNvbHZlKHZhbHVlcylcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobGlzdFtpXSAhPSBudWxsICYmICh0eXBlb2YgbGlzdFtpXSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgbGlzdFtpXSA9PT0gXCJmdW5jdGlvblwiKSAmJiB0eXBlb2YgbGlzdFtpXS50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRsaXN0W2ldLnRoZW4oY29uc3VtZSwgcmVqZWN0KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgY29uc3VtZShsaXN0W2ldKVxuXHRcdFx0fSkoaSlcblx0XHR9XG5cdH0pXG59XG5Qcm9taXNlUG9seWZpbGwucmFjZSA9IGZ1bmN0aW9uKGxpc3QpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlUG9seWZpbGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsaXN0W2ldLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KVxuXHRcdH1cblx0fSlcbn1cbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGlmICh0eXBlb2Ygd2luZG93LlByb21pc2UgPT09IFwidW5kZWZpbmVkXCIpIHdpbmRvdy5Qcm9taXNlID0gUHJvbWlzZVBvbHlmaWxsXG5cdHZhciBQcm9taXNlUG9seWZpbGwgPSB3aW5kb3cuUHJvbWlzZVxufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsLlByb21pc2UgPT09IFwidW5kZWZpbmVkXCIpIGdsb2JhbC5Qcm9taXNlID0gUHJvbWlzZVBvbHlmaWxsXG5cdHZhciBQcm9taXNlUG9seWZpbGwgPSBnbG9iYWwuUHJvbWlzZVxufSBlbHNlIHtcbn1cbnZhciBidWlsZFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24ob2JqZWN0KSB7XG5cdGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSAhPT0gXCJbb2JqZWN0IE9iamVjdF1cIikgcmV0dXJuIFwiXCJcblx0dmFyIGFyZ3MgPSBbXVxuXHRmb3IgKHZhciBrZXkwIGluIG9iamVjdCkge1xuXHRcdGRlc3RydWN0dXJlKGtleTAsIG9iamVjdFtrZXkwXSlcblx0fVxuXHRyZXR1cm4gYXJncy5qb2luKFwiJlwiKVxuXHRmdW5jdGlvbiBkZXN0cnVjdHVyZShrZXkwLCB2YWx1ZSkge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRkZXN0cnVjdHVyZShrZXkwICsgXCJbXCIgKyBpICsgXCJdXCIsIHZhbHVlW2ldKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG5cdFx0XHRmb3IgKHZhciBpIGluIHZhbHVlKSB7XG5cdFx0XHRcdGRlc3RydWN0dXJlKGtleTAgKyBcIltcIiArIGkgKyBcIl1cIiwgdmFsdWVbaV0pXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgYXJncy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkwKSArICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBcIlwiID8gXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpIDogXCJcIikpXG5cdH1cbn1cbnZhciBGSUxFX1BST1RPQ09MX1JFR0VYID0gbmV3IFJlZ0V4cChcIl5maWxlOi8vXCIsIFwiaVwiKVxudmFyIF84ID0gZnVuY3Rpb24oJHdpbmRvdywgUHJvbWlzZSkge1xuXHR2YXIgY2FsbGJhY2tDb3VudCA9IDBcblx0dmFyIG9uY29tcGxldGlvblxuXHRmdW5jdGlvbiBzZXRDb21wbGV0aW9uQ2FsbGJhY2soY2FsbGJhY2spIHtvbmNvbXBsZXRpb24gPSBjYWxsYmFja31cblx0ZnVuY3Rpb24gZmluYWxpemVyKCkge1xuXHRcdHZhciBjb3VudCA9IDBcblx0XHRmdW5jdGlvbiBjb21wbGV0ZSgpIHtpZiAoLS1jb3VudCA9PT0gMCAmJiB0eXBlb2Ygb25jb21wbGV0aW9uID09PSBcImZ1bmN0aW9uXCIpIG9uY29tcGxldGlvbigpfVxuXHRcdHJldHVybiBmdW5jdGlvbiBmaW5hbGl6ZShwcm9taXNlMCkge1xuXHRcdFx0dmFyIHRoZW4wID0gcHJvbWlzZTAudGhlblxuXHRcdFx0cHJvbWlzZTAudGhlbiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb3VudCsrXG5cdFx0XHRcdHZhciBuZXh0ID0gdGhlbjAuYXBwbHkocHJvbWlzZTAsIGFyZ3VtZW50cylcblx0XHRcdFx0bmV4dC50aGVuKGNvbXBsZXRlLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0Y29tcGxldGUoKVxuXHRcdFx0XHRcdGlmIChjb3VudCA9PT0gMCkgdGhyb3cgZVxuXHRcdFx0XHR9KVxuXHRcdFx0XHRyZXR1cm4gZmluYWxpemUobmV4dClcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcm9taXNlMFxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBub3JtYWxpemUoYXJncywgZXh0cmEpIHtcblx0XHRpZiAodHlwZW9mIGFyZ3MgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHZhciB1cmwgPSBhcmdzXG5cdFx0XHRhcmdzID0gZXh0cmEgfHwge31cblx0XHRcdGlmIChhcmdzLnVybCA9PSBudWxsKSBhcmdzLnVybCA9IHVybFxuXHRcdH1cblx0XHRyZXR1cm4gYXJnc1xuXHR9XG5cdGZ1bmN0aW9uIHJlcXVlc3QoYXJncywgZXh0cmEpIHtcblx0XHR2YXIgZmluYWxpemUgPSBmaW5hbGl6ZXIoKVxuXHRcdGFyZ3MgPSBub3JtYWxpemUoYXJncywgZXh0cmEpXG5cdFx0dmFyIHByb21pc2UwID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRpZiAoYXJncy5tZXRob2QgPT0gbnVsbCkgYXJncy5tZXRob2QgPSBcIkdFVFwiXG5cdFx0XHRhcmdzLm1ldGhvZCA9IGFyZ3MubWV0aG9kLnRvVXBwZXJDYXNlKClcblx0XHRcdHZhciB1c2VCb2R5ID0gKGFyZ3MubWV0aG9kID09PSBcIkdFVFwiIHx8IGFyZ3MubWV0aG9kID09PSBcIlRSQUNFXCIpID8gZmFsc2UgOiAodHlwZW9mIGFyZ3MudXNlQm9keSA9PT0gXCJib29sZWFuXCIgPyBhcmdzLnVzZUJvZHkgOiB0cnVlKVxuXHRcdFx0aWYgKHR5cGVvZiBhcmdzLnNlcmlhbGl6ZSAhPT0gXCJmdW5jdGlvblwiKSBhcmdzLnNlcmlhbGl6ZSA9IHR5cGVvZiBGb3JtRGF0YSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhcmdzLmRhdGEgaW5zdGFuY2VvZiBGb3JtRGF0YSA/IGZ1bmN0aW9uKHZhbHVlKSB7cmV0dXJuIHZhbHVlfSA6IEpTT04uc3RyaW5naWZ5XG5cdFx0XHRpZiAodHlwZW9mIGFyZ3MuZGVzZXJpYWxpemUgIT09IFwiZnVuY3Rpb25cIikgYXJncy5kZXNlcmlhbGl6ZSA9IGRlc2VyaWFsaXplXG5cdFx0XHRpZiAodHlwZW9mIGFyZ3MuZXh0cmFjdCAhPT0gXCJmdW5jdGlvblwiKSBhcmdzLmV4dHJhY3QgPSBleHRyYWN0XG5cdFx0XHRhcmdzLnVybCA9IGludGVycG9sYXRlKGFyZ3MudXJsLCBhcmdzLmRhdGEpXG5cdFx0XHRpZiAodXNlQm9keSkgYXJncy5kYXRhID0gYXJncy5zZXJpYWxpemUoYXJncy5kYXRhKVxuXHRcdFx0ZWxzZSBhcmdzLnVybCA9IGFzc2VtYmxlKGFyZ3MudXJsLCBhcmdzLmRhdGEpXG5cdFx0XHR2YXIgeGhyID0gbmV3ICR3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKSxcblx0XHRcdFx0YWJvcnRlZCA9IGZhbHNlLFxuXHRcdFx0XHRfYWJvcnQgPSB4aHIuYWJvcnRcblx0XHRcdHhoci5hYm9ydCA9IGZ1bmN0aW9uIGFib3J0KCkge1xuXHRcdFx0XHRhYm9ydGVkID0gdHJ1ZVxuXHRcdFx0XHRfYWJvcnQuY2FsbCh4aHIpXG5cdFx0XHR9XG5cdFx0XHR4aHIub3BlbihhcmdzLm1ldGhvZCwgYXJncy51cmwsIHR5cGVvZiBhcmdzLmFzeW5jID09PSBcImJvb2xlYW5cIiA/IGFyZ3MuYXN5bmMgOiB0cnVlLCB0eXBlb2YgYXJncy51c2VyID09PSBcInN0cmluZ1wiID8gYXJncy51c2VyIDogdW5kZWZpbmVkLCB0eXBlb2YgYXJncy5wYXNzd29yZCA9PT0gXCJzdHJpbmdcIiA/IGFyZ3MucGFzc3dvcmQgOiB1bmRlZmluZWQpXG5cdFx0XHRpZiAoYXJncy5zZXJpYWxpemUgPT09IEpTT04uc3RyaW5naWZ5ICYmIHVzZUJvZHkpIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpXG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJncy5kZXNlcmlhbGl6ZSA9PT0gZGVzZXJpYWxpemUpIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0LypcIilcblx0XHRcdH1cblx0XHRcdGlmIChhcmdzLndpdGhDcmVkZW50aWFscykgeGhyLndpdGhDcmVkZW50aWFscyA9IGFyZ3Mud2l0aENyZWRlbnRpYWxzXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJncy5oZWFkZXJzKSBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChhcmdzLmhlYWRlcnMsIGtleSkpIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBhcmdzLmhlYWRlcnNba2V5XSlcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YgYXJncy5jb25maWcgPT09IFwiZnVuY3Rpb25cIikgeGhyID0gYXJncy5jb25maWcoeGhyLCBhcmdzKSB8fCB4aHJcblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gRG9uJ3QgdGhyb3cgZXJyb3JzIG9uIHhoci5hYm9ydCgpLlxuXHRcdFx0XHRpZihhYm9ydGVkKSByZXR1cm5cblx0XHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhciByZXNwb25zZSA9IChhcmdzLmV4dHJhY3QgIT09IGV4dHJhY3QpID8gYXJncy5leHRyYWN0KHhociwgYXJncykgOiBhcmdzLmRlc2VyaWFsaXplKGFyZ3MuZXh0cmFjdCh4aHIsIGFyZ3MpKVxuXHRcdFx0XHRcdFx0aWYgKCh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB8fCB4aHIuc3RhdHVzID09PSAzMDQgfHwgRklMRV9QUk9UT0NPTF9SRUdFWC50ZXN0KGFyZ3MudXJsKSkge1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGNhc3QoYXJncy50eXBlLCByZXNwb25zZSkpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0gbmV3IEVycm9yKHhoci5yZXNwb25zZVRleHQpXG5cdFx0XHRcdFx0XHRcdGZvciAodmFyIGtleSBpbiByZXNwb25zZSkgZXJyb3Jba2V5XSA9IHJlc3BvbnNlW2tleV1cblx0XHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0cmVqZWN0KGUpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodXNlQm9keSAmJiAoYXJncy5kYXRhICE9IG51bGwpKSB4aHIuc2VuZChhcmdzLmRhdGEpXG5cdFx0XHRlbHNlIHhoci5zZW5kKClcblx0XHR9KVxuXHRcdHJldHVybiBhcmdzLmJhY2tncm91bmQgPT09IHRydWUgPyBwcm9taXNlMCA6IGZpbmFsaXplKHByb21pc2UwKVxuXHR9XG5cdGZ1bmN0aW9uIGpzb25wKGFyZ3MsIGV4dHJhKSB7XG5cdFx0dmFyIGZpbmFsaXplID0gZmluYWxpemVyKClcblx0XHRhcmdzID0gbm9ybWFsaXplKGFyZ3MsIGV4dHJhKVxuXHRcdHZhciBwcm9taXNlMCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0dmFyIGNhbGxiYWNrTmFtZSA9IGFyZ3MuY2FsbGJhY2tOYW1lIHx8IFwiX21pdGhyaWxfXCIgKyBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxZTE2KSArIFwiX1wiICsgY2FsbGJhY2tDb3VudCsrXG5cdFx0XHR2YXIgc2NyaXB0ID0gJHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpXG5cdFx0XHQkd2luZG93W2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdClcblx0XHRcdFx0cmVzb2x2ZShjYXN0KGFyZ3MudHlwZSwgZGF0YSkpXG5cdFx0XHRcdGRlbGV0ZSAkd2luZG93W2NhbGxiYWNrTmFtZV1cblx0XHRcdH1cblx0XHRcdHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdClcblx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIkpTT05QIHJlcXVlc3QgZmFpbGVkXCIpKVxuXHRcdFx0XHRkZWxldGUgJHdpbmRvd1tjYWxsYmFja05hbWVdXG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJncy5kYXRhID09IG51bGwpIGFyZ3MuZGF0YSA9IHt9XG5cdFx0XHRhcmdzLnVybCA9IGludGVycG9sYXRlKGFyZ3MudXJsLCBhcmdzLmRhdGEpXG5cdFx0XHRhcmdzLmRhdGFbYXJncy5jYWxsYmFja0tleSB8fCBcImNhbGxiYWNrXCJdID0gY2FsbGJhY2tOYW1lXG5cdFx0XHRzY3JpcHQuc3JjID0gYXNzZW1ibGUoYXJncy51cmwsIGFyZ3MuZGF0YSlcblx0XHRcdCR3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKHNjcmlwdClcblx0XHR9KVxuXHRcdHJldHVybiBhcmdzLmJhY2tncm91bmQgPT09IHRydWU/IHByb21pc2UwIDogZmluYWxpemUocHJvbWlzZTApXG5cdH1cblx0ZnVuY3Rpb24gaW50ZXJwb2xhdGUodXJsLCBkYXRhKSB7XG5cdFx0aWYgKGRhdGEgPT0gbnVsbCkgcmV0dXJuIHVybFxuXHRcdHZhciB0b2tlbnMgPSB1cmwubWF0Y2goLzpbXlxcL10rL2dpKSB8fCBbXVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIga2V5ID0gdG9rZW5zW2ldLnNsaWNlKDEpXG5cdFx0XHRpZiAoZGF0YVtrZXldICE9IG51bGwpIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UodG9rZW5zW2ldLCBkYXRhW2tleV0pXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB1cmxcblx0fVxuXHRmdW5jdGlvbiBhc3NlbWJsZSh1cmwsIGRhdGEpIHtcblx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKGRhdGEpXG5cdFx0aWYgKHF1ZXJ5c3RyaW5nICE9PSBcIlwiKSB7XG5cdFx0XHR2YXIgcHJlZml4ID0gdXJsLmluZGV4T2YoXCI/XCIpIDwgMCA/IFwiP1wiIDogXCImXCJcblx0XHRcdHVybCArPSBwcmVmaXggKyBxdWVyeXN0cmluZ1xuXHRcdH1cblx0XHRyZXR1cm4gdXJsXG5cdH1cblx0ZnVuY3Rpb24gZGVzZXJpYWxpemUoZGF0YSkge1xuXHRcdHRyeSB7cmV0dXJuIGRhdGEgIT09IFwiXCIgPyBKU09OLnBhcnNlKGRhdGEpIDogbnVsbH1cblx0XHRjYXRjaCAoZSkge3Rocm93IG5ldyBFcnJvcihkYXRhKX1cblx0fVxuXHRmdW5jdGlvbiBleHRyYWN0KHhocikge3JldHVybiB4aHIucmVzcG9uc2VUZXh0fVxuXHRmdW5jdGlvbiBjYXN0KHR5cGUwLCBkYXRhKSB7XG5cdFx0aWYgKHR5cGVvZiB0eXBlMCA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRkYXRhW2ldID0gbmV3IHR5cGUwKGRhdGFbaV0pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgcmV0dXJuIG5ldyB0eXBlMChkYXRhKVxuXHRcdH1cblx0XHRyZXR1cm4gZGF0YVxuXHR9XG5cdHJldHVybiB7cmVxdWVzdDogcmVxdWVzdCwganNvbnA6IGpzb25wLCBzZXRDb21wbGV0aW9uQ2FsbGJhY2s6IHNldENvbXBsZXRpb25DYWxsYmFja31cbn1cbnZhciByZXF1ZXN0U2VydmljZSA9IF84KHdpbmRvdywgUHJvbWlzZVBvbHlmaWxsKVxudmFyIGNvcmVSZW5kZXJlciA9IGZ1bmN0aW9uKCR3aW5kb3cpIHtcblx0dmFyICRkb2MgPSAkd2luZG93LmRvY3VtZW50XG5cdHZhciAkZW1wdHlGcmFnbWVudCA9ICRkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdHZhciBvbmV2ZW50XG5cdGZ1bmN0aW9uIHNldEV2ZW50Q2FsbGJhY2soY2FsbGJhY2spIHtyZXR1cm4gb25ldmVudCA9IGNhbGxiYWNrfVxuXHQvL2NyZWF0ZVxuXHRmdW5jdGlvbiBjcmVhdGVOb2RlcyhwYXJlbnQsIHZub2Rlcywgc3RhcnQsIGVuZCwgaG9va3MsIG5leHRTaWJsaW5nLCBucykge1xuXHRcdGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG5cdFx0XHR2YXIgdm5vZGUgPSB2bm9kZXNbaV1cblx0XHRcdGlmICh2bm9kZSAhPSBudWxsKSB7XG5cdFx0XHRcdGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKSB7XG5cdFx0dmFyIHRhZyA9IHZub2RlLnRhZ1xuXHRcdGlmICh0eXBlb2YgdGFnID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHR2bm9kZS5zdGF0ZSA9IHt9XG5cdFx0XHRpZiAodm5vZGUuYXR0cnMgIT0gbnVsbCkgaW5pdExpZmVjeWNsZSh2bm9kZS5hdHRycywgdm5vZGUsIGhvb2tzKVxuXHRcdFx0c3dpdGNoICh0YWcpIHtcblx0XHRcdFx0Y2FzZSBcIiNcIjogcmV0dXJuIGNyZWF0ZVRleHQocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdGNhc2UgXCI8XCI6IHJldHVybiBjcmVhdGVIVE1MKHBhcmVudCwgdm5vZGUsIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRjYXNlIFwiW1wiOiByZXR1cm4gY3JlYXRlRnJhZ21lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdFx0ZGVmYXVsdDogcmV0dXJuIGNyZWF0ZUVsZW1lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSByZXR1cm4gY3JlYXRlQ29tcG9uZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlVGV4dChwYXJlbnQsIHZub2RlLCBuZXh0U2libGluZykge1xuXHRcdHZub2RlLmRvbSA9ICRkb2MuY3JlYXRlVGV4dE5vZGUodm5vZGUuY2hpbGRyZW4pXG5cdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIHZub2RlLmRvbSwgbmV4dFNpYmxpbmcpXG5cdFx0cmV0dXJuIHZub2RlLmRvbVxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZUhUTUwocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpIHtcblx0XHR2YXIgbWF0Y2gxID0gdm5vZGUuY2hpbGRyZW4ubWF0Y2goL15cXHMqPzwoXFx3KykvaW0pIHx8IFtdXG5cdFx0dmFyIHBhcmVudDEgPSB7Y2FwdGlvbjogXCJ0YWJsZVwiLCB0aGVhZDogXCJ0YWJsZVwiLCB0Ym9keTogXCJ0YWJsZVwiLCB0Zm9vdDogXCJ0YWJsZVwiLCB0cjogXCJ0Ym9keVwiLCB0aDogXCJ0clwiLCB0ZDogXCJ0clwiLCBjb2xncm91cDogXCJ0YWJsZVwiLCBjb2w6IFwiY29sZ3JvdXBcIn1bbWF0Y2gxWzFdXSB8fCBcImRpdlwiXG5cdFx0dmFyIHRlbXAgPSAkZG9jLmNyZWF0ZUVsZW1lbnQocGFyZW50MSlcblx0XHR0ZW1wLmlubmVySFRNTCA9IHZub2RlLmNoaWxkcmVuXG5cdFx0dm5vZGUuZG9tID0gdGVtcC5maXJzdENoaWxkXG5cdFx0dm5vZGUuZG9tU2l6ZSA9IHRlbXAuY2hpbGROb2Rlcy5sZW5ndGhcblx0XHR2YXIgZnJhZ21lbnQgPSAkZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdHZhciBjaGlsZFxuXHRcdHdoaWxlIChjaGlsZCA9IHRlbXAuZmlyc3RDaGlsZCkge1xuXHRcdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpXG5cdFx0fVxuXHRcdGluc2VydE5vZGUocGFyZW50LCBmcmFnbWVudCwgbmV4dFNpYmxpbmcpXG5cdFx0cmV0dXJuIGZyYWdtZW50XG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZykge1xuXHRcdHZhciBmcmFnbWVudCA9ICRkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0aWYgKHZub2RlLmNoaWxkcmVuICE9IG51bGwpIHtcblx0XHRcdHZhciBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG5cdFx0XHRjcmVhdGVOb2RlcyhmcmFnbWVudCwgY2hpbGRyZW4sIDAsIGNoaWxkcmVuLmxlbmd0aCwgaG9va3MsIG51bGwsIG5zKVxuXHRcdH1cblx0XHR2bm9kZS5kb20gPSBmcmFnbWVudC5maXJzdENoaWxkXG5cdFx0dm5vZGUuZG9tU2l6ZSA9IGZyYWdtZW50LmNoaWxkTm9kZXMubGVuZ3RoXG5cdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIGZyYWdtZW50LCBuZXh0U2libGluZylcblx0XHRyZXR1cm4gZnJhZ21lbnRcblx0fVxuXHRmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpIHtcblx0XHR2YXIgdGFnID0gdm5vZGUudGFnXG5cdFx0c3dpdGNoICh2bm9kZS50YWcpIHtcblx0XHRcdGNhc2UgXCJzdmdcIjogbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7IGJyZWFrXG5cdFx0XHRjYXNlIFwibWF0aFwiOiBucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiOyBicmVha1xuXHRcdH1cblx0XHR2YXIgYXR0cnMyID0gdm5vZGUuYXR0cnNcblx0XHR2YXIgaXMgPSBhdHRyczIgJiYgYXR0cnMyLmlzXG5cdFx0dmFyIGVsZW1lbnQgPSBucyA/XG5cdFx0XHRpcyA/ICRkb2MuY3JlYXRlRWxlbWVudE5TKG5zLCB0YWcsIHtpczogaXN9KSA6ICRkb2MuY3JlYXRlRWxlbWVudE5TKG5zLCB0YWcpIDpcblx0XHRcdGlzID8gJGRvYy5jcmVhdGVFbGVtZW50KHRhZywge2lzOiBpc30pIDogJGRvYy5jcmVhdGVFbGVtZW50KHRhZylcblx0XHR2bm9kZS5kb20gPSBlbGVtZW50XG5cdFx0aWYgKGF0dHJzMiAhPSBudWxsKSB7XG5cdFx0XHRzZXRBdHRycyh2bm9kZSwgYXR0cnMyLCBucylcblx0XHR9XG5cdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIGVsZW1lbnQsIG5leHRTaWJsaW5nKVxuXHRcdGlmICh2bm9kZS5hdHRycyAhPSBudWxsICYmIHZub2RlLmF0dHJzLmNvbnRlbnRlZGl0YWJsZSAhPSBudWxsKSB7XG5cdFx0XHRzZXRDb250ZW50RWRpdGFibGUodm5vZGUpXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aWYgKHZub2RlLnRleHQgIT0gbnVsbCkge1xuXHRcdFx0XHRpZiAodm5vZGUudGV4dCAhPT0gXCJcIikgZWxlbWVudC50ZXh0Q29udGVudCA9IHZub2RlLnRleHRcblx0XHRcdFx0ZWxzZSB2bm9kZS5jaGlsZHJlbiA9IFtWbm9kZShcIiNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHZub2RlLnRleHQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKV1cblx0XHRcdH1cblx0XHRcdGlmICh2bm9kZS5jaGlsZHJlbiAhPSBudWxsKSB7XG5cdFx0XHRcdHZhciBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG5cdFx0XHRcdGNyZWF0ZU5vZGVzKGVsZW1lbnQsIGNoaWxkcmVuLCAwLCBjaGlsZHJlbi5sZW5ndGgsIGhvb2tzLCBudWxsLCBucylcblx0XHRcdFx0c2V0TGF0ZUF0dHJzKHZub2RlKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZWxlbWVudFxuXHR9XG5cdGZ1bmN0aW9uIGluaXRDb21wb25lbnQodm5vZGUsIGhvb2tzKSB7XG5cdFx0dmFyIHNlbnRpbmVsXG5cdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcudmlldyA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHR2bm9kZS5zdGF0ZSA9IE9iamVjdC5jcmVhdGUodm5vZGUudGFnKVxuXHRcdFx0c2VudGluZWwgPSB2bm9kZS5zdGF0ZS52aWV3XG5cdFx0XHRpZiAoc2VudGluZWwuJCRyZWVudHJhbnRMb2NrJCQgIT0gbnVsbCkgcmV0dXJuICRlbXB0eUZyYWdtZW50XG5cdFx0XHRzZW50aW5lbC4kJHJlZW50cmFudExvY2skJCA9IHRydWVcblx0XHR9IGVsc2Uge1xuXHRcdFx0dm5vZGUuc3RhdGUgPSB2b2lkIDBcblx0XHRcdHNlbnRpbmVsID0gdm5vZGUudGFnXG5cdFx0XHRpZiAoc2VudGluZWwuJCRyZWVudHJhbnRMb2NrJCQgIT0gbnVsbCkgcmV0dXJuICRlbXB0eUZyYWdtZW50XG5cdFx0XHRzZW50aW5lbC4kJHJlZW50cmFudExvY2skJCA9IHRydWVcblx0XHRcdHZub2RlLnN0YXRlID0gKHZub2RlLnRhZy5wcm90b3R5cGUgIT0gbnVsbCAmJiB0eXBlb2Ygdm5vZGUudGFnLnByb3RvdHlwZS52aWV3ID09PSBcImZ1bmN0aW9uXCIpID8gbmV3IHZub2RlLnRhZyh2bm9kZSkgOiB2bm9kZS50YWcodm5vZGUpXG5cdFx0fVxuXHRcdHZub2RlLl9zdGF0ZSA9IHZub2RlLnN0YXRlXG5cdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIGluaXRMaWZlY3ljbGUodm5vZGUuYXR0cnMsIHZub2RlLCBob29rcylcblx0XHRpbml0TGlmZWN5Y2xlKHZub2RlLl9zdGF0ZSwgdm5vZGUsIGhvb2tzKVxuXHRcdHZub2RlLmluc3RhbmNlID0gVm5vZGUubm9ybWFsaXplKHZub2RlLl9zdGF0ZS52aWV3LmNhbGwodm5vZGUuc3RhdGUsIHZub2RlKSlcblx0XHRpZiAodm5vZGUuaW5zdGFuY2UgPT09IHZub2RlKSB0aHJvdyBFcnJvcihcIkEgdmlldyBjYW5ub3QgcmV0dXJuIHRoZSB2bm9kZSBpdCByZWNlaXZlZCBhcyBhcmd1bWVudFwiKVxuXHRcdHNlbnRpbmVsLiQkcmVlbnRyYW50TG9jayQkID0gbnVsbFxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKSB7XG5cdFx0aW5pdENvbXBvbmVudCh2bm9kZSwgaG9va3MpXG5cdFx0aWYgKHZub2RlLmluc3RhbmNlICE9IG51bGwpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gY3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLmluc3RhbmNlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdFx0dm5vZGUuZG9tID0gdm5vZGUuaW5zdGFuY2UuZG9tXG5cdFx0XHR2bm9kZS5kb21TaXplID0gdm5vZGUuZG9tICE9IG51bGwgPyB2bm9kZS5pbnN0YW5jZS5kb21TaXplIDogMFxuXHRcdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIGVsZW1lbnQsIG5leHRTaWJsaW5nKVxuXHRcdFx0cmV0dXJuIGVsZW1lbnRcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR2bm9kZS5kb21TaXplID0gMFxuXHRcdFx0cmV0dXJuICRlbXB0eUZyYWdtZW50XG5cdFx0fVxuXHR9XG5cdC8vdXBkYXRlXG5cdGZ1bmN0aW9uIHVwZGF0ZU5vZGVzKHBhcmVudCwgb2xkLCB2bm9kZXMsIHJlY3ljbGluZywgaG9va3MsIG5leHRTaWJsaW5nLCBucykge1xuXHRcdGlmIChvbGQgPT09IHZub2RlcyB8fCBvbGQgPT0gbnVsbCAmJiB2bm9kZXMgPT0gbnVsbCkgcmV0dXJuXG5cdFx0ZWxzZSBpZiAob2xkID09IG51bGwpIGNyZWF0ZU5vZGVzKHBhcmVudCwgdm5vZGVzLCAwLCB2bm9kZXMubGVuZ3RoLCBob29rcywgbmV4dFNpYmxpbmcsIHVuZGVmaW5lZClcblx0XHRlbHNlIGlmICh2bm9kZXMgPT0gbnVsbCkgcmVtb3ZlTm9kZXMob2xkLCAwLCBvbGQubGVuZ3RoLCB2bm9kZXMpXG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAob2xkLmxlbmd0aCA9PT0gdm5vZGVzLmxlbmd0aCkge1xuXHRcdFx0XHR2YXIgaXNVbmtleWVkID0gZmFsc2Vcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2bm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAodm5vZGVzW2ldICE9IG51bGwgJiYgb2xkW2ldICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGlzVW5rZXllZCA9IHZub2Rlc1tpXS5rZXkgPT0gbnVsbCAmJiBvbGRbaV0ua2V5ID09IG51bGxcblx0XHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChpc1Vua2V5ZWQpIHtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG9sZC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYgKG9sZFtpXSA9PT0gdm5vZGVzW2ldKSBjb250aW51ZVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAob2xkW2ldID09IG51bGwgJiYgdm5vZGVzW2ldICE9IG51bGwpIGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZXNbaV0sIGhvb2tzLCBucywgZ2V0TmV4dFNpYmxpbmcob2xkLCBpICsgMSwgbmV4dFNpYmxpbmcpKVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAodm5vZGVzW2ldID09IG51bGwpIHJlbW92ZU5vZGVzKG9sZCwgaSwgaSArIDEsIHZub2Rlcylcblx0XHRcdFx0XHRcdGVsc2UgdXBkYXRlTm9kZShwYXJlbnQsIG9sZFtpXSwgdm5vZGVzW2ldLCBob29rcywgZ2V0TmV4dFNpYmxpbmcob2xkLCBpICsgMSwgbmV4dFNpYmxpbmcpLCByZWN5Y2xpbmcsIG5zKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmVjeWNsaW5nID0gcmVjeWNsaW5nIHx8IGlzUmVjeWNsYWJsZShvbGQsIHZub2Rlcylcblx0XHRcdGlmIChyZWN5Y2xpbmcpIHtcblx0XHRcdFx0dmFyIHBvb2wgPSBvbGQucG9vbFxuXHRcdFx0XHRvbGQgPSBvbGQuY29uY2F0KG9sZC5wb29sKVxuXHRcdFx0fVxuXHRcdFx0dmFyIG9sZFN0YXJ0ID0gMCwgc3RhcnQgPSAwLCBvbGRFbmQgPSBvbGQubGVuZ3RoIC0gMSwgZW5kID0gdm5vZGVzLmxlbmd0aCAtIDEsIG1hcFxuXHRcdFx0d2hpbGUgKG9sZEVuZCA+PSBvbGRTdGFydCAmJiBlbmQgPj0gc3RhcnQpIHtcblx0XHRcdFx0dmFyIG8gPSBvbGRbb2xkU3RhcnRdLCB2ID0gdm5vZGVzW3N0YXJ0XVxuXHRcdFx0XHRpZiAobyA9PT0gdiAmJiAhcmVjeWNsaW5nKSBvbGRTdGFydCsrLCBzdGFydCsrXG5cdFx0XHRcdGVsc2UgaWYgKG8gPT0gbnVsbCkgb2xkU3RhcnQrK1xuXHRcdFx0XHRlbHNlIGlmICh2ID09IG51bGwpIHN0YXJ0Kytcblx0XHRcdFx0ZWxzZSBpZiAoby5rZXkgPT09IHYua2V5KSB7XG5cdFx0XHRcdFx0dmFyIHNob3VsZFJlY3ljbGUgPSAocG9vbCAhPSBudWxsICYmIG9sZFN0YXJ0ID49IG9sZC5sZW5ndGggLSBwb29sLmxlbmd0aCkgfHwgKChwb29sID09IG51bGwpICYmIHJlY3ljbGluZylcblx0XHRcdFx0XHRvbGRTdGFydCsrLCBzdGFydCsrXG5cdFx0XHRcdFx0dXBkYXRlTm9kZShwYXJlbnQsIG8sIHYsIGhvb2tzLCBnZXROZXh0U2libGluZyhvbGQsIG9sZFN0YXJ0LCBuZXh0U2libGluZyksIHNob3VsZFJlY3ljbGUsIG5zKVxuXHRcdFx0XHRcdGlmIChyZWN5Y2xpbmcgJiYgby50YWcgPT09IHYudGFnKSBpbnNlcnROb2RlKHBhcmVudCwgdG9GcmFnbWVudChvKSwgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmFyIG8gPSBvbGRbb2xkRW5kXVxuXHRcdFx0XHRcdGlmIChvID09PSB2ICYmICFyZWN5Y2xpbmcpIG9sZEVuZC0tLCBzdGFydCsrXG5cdFx0XHRcdFx0ZWxzZSBpZiAobyA9PSBudWxsKSBvbGRFbmQtLVxuXHRcdFx0XHRcdGVsc2UgaWYgKHYgPT0gbnVsbCkgc3RhcnQrK1xuXHRcdFx0XHRcdGVsc2UgaWYgKG8ua2V5ID09PSB2LmtleSkge1xuXHRcdFx0XHRcdFx0dmFyIHNob3VsZFJlY3ljbGUgPSAocG9vbCAhPSBudWxsICYmIG9sZEVuZCA+PSBvbGQubGVuZ3RoIC0gcG9vbC5sZW5ndGgpIHx8ICgocG9vbCA9PSBudWxsKSAmJiByZWN5Y2xpbmcpXG5cdFx0XHRcdFx0XHR1cGRhdGVOb2RlKHBhcmVudCwgbywgdiwgaG9va3MsIGdldE5leHRTaWJsaW5nKG9sZCwgb2xkRW5kICsgMSwgbmV4dFNpYmxpbmcpLCBzaG91bGRSZWN5Y2xlLCBucylcblx0XHRcdFx0XHRcdGlmIChyZWN5Y2xpbmcgfHwgc3RhcnQgPCBlbmQpIGluc2VydE5vZGUocGFyZW50LCB0b0ZyYWdtZW50KG8pLCBnZXROZXh0U2libGluZyhvbGQsIG9sZFN0YXJ0LCBuZXh0U2libGluZykpXG5cdFx0XHRcdFx0XHRvbGRFbmQtLSwgc3RhcnQrK1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGJyZWFrXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHdoaWxlIChvbGRFbmQgPj0gb2xkU3RhcnQgJiYgZW5kID49IHN0YXJ0KSB7XG5cdFx0XHRcdHZhciBvID0gb2xkW29sZEVuZF0sIHYgPSB2bm9kZXNbZW5kXVxuXHRcdFx0XHRpZiAobyA9PT0gdiAmJiAhcmVjeWNsaW5nKSBvbGRFbmQtLSwgZW5kLS1cblx0XHRcdFx0ZWxzZSBpZiAobyA9PSBudWxsKSBvbGRFbmQtLVxuXHRcdFx0XHRlbHNlIGlmICh2ID09IG51bGwpIGVuZC0tXG5cdFx0XHRcdGVsc2UgaWYgKG8ua2V5ID09PSB2LmtleSkge1xuXHRcdFx0XHRcdHZhciBzaG91bGRSZWN5Y2xlID0gKHBvb2wgIT0gbnVsbCAmJiBvbGRFbmQgPj0gb2xkLmxlbmd0aCAtIHBvb2wubGVuZ3RoKSB8fCAoKHBvb2wgPT0gbnVsbCkgJiYgcmVjeWNsaW5nKVxuXHRcdFx0XHRcdHVwZGF0ZU5vZGUocGFyZW50LCBvLCB2LCBob29rcywgZ2V0TmV4dFNpYmxpbmcob2xkLCBvbGRFbmQgKyAxLCBuZXh0U2libGluZyksIHNob3VsZFJlY3ljbGUsIG5zKVxuXHRcdFx0XHRcdGlmIChyZWN5Y2xpbmcgJiYgby50YWcgPT09IHYudGFnKSBpbnNlcnROb2RlKHBhcmVudCwgdG9GcmFnbWVudChvKSwgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdFx0aWYgKG8uZG9tICE9IG51bGwpIG5leHRTaWJsaW5nID0gby5kb21cblx0XHRcdFx0XHRvbGRFbmQtLSwgZW5kLS1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRpZiAoIW1hcCkgbWFwID0gZ2V0S2V5TWFwKG9sZCwgb2xkRW5kKVxuXHRcdFx0XHRcdGlmICh2ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdHZhciBvbGRJbmRleCA9IG1hcFt2LmtleV1cblx0XHRcdFx0XHRcdGlmIChvbGRJbmRleCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBtb3ZhYmxlID0gb2xkW29sZEluZGV4XVxuXHRcdFx0XHRcdFx0XHR2YXIgc2hvdWxkUmVjeWNsZSA9IChwb29sICE9IG51bGwgJiYgb2xkSW5kZXggPj0gb2xkLmxlbmd0aCAtIHBvb2wubGVuZ3RoKSB8fCAoKHBvb2wgPT0gbnVsbCkgJiYgcmVjeWNsaW5nKVxuXHRcdFx0XHRcdFx0XHR1cGRhdGVOb2RlKHBhcmVudCwgbW92YWJsZSwgdiwgaG9va3MsIGdldE5leHRTaWJsaW5nKG9sZCwgb2xkRW5kICsgMSwgbmV4dFNpYmxpbmcpLCByZWN5Y2xpbmcsIG5zKVxuXHRcdFx0XHRcdFx0XHRpbnNlcnROb2RlKHBhcmVudCwgdG9GcmFnbWVudChtb3ZhYmxlKSwgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdFx0XHRcdG9sZFtvbGRJbmRleF0uc2tpcCA9IHRydWVcblx0XHRcdFx0XHRcdFx0aWYgKG1vdmFibGUuZG9tICE9IG51bGwpIG5leHRTaWJsaW5nID0gbW92YWJsZS5kb21cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR2YXIgZG9tID0gY3JlYXRlTm9kZShwYXJlbnQsIHYsIGhvb2tzLCB1bmRlZmluZWQsIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdFx0XHRuZXh0U2libGluZyA9IGRvbVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbmQtLVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChlbmQgPCBzdGFydCkgYnJlYWtcblx0XHRcdH1cblx0XHRcdGNyZWF0ZU5vZGVzKHBhcmVudCwgdm5vZGVzLCBzdGFydCwgZW5kICsgMSwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHRcdHJlbW92ZU5vZGVzKG9sZCwgb2xkU3RhcnQsIG9sZEVuZCArIDEsIHZub2Rlcylcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlTm9kZShwYXJlbnQsIG9sZCwgdm5vZGUsIGhvb2tzLCBuZXh0U2libGluZywgcmVjeWNsaW5nLCBucykge1xuXHRcdHZhciBvbGRUYWcgPSBvbGQudGFnLCB0YWcgPSB2bm9kZS50YWdcblx0XHRpZiAob2xkVGFnID09PSB0YWcpIHtcblx0XHRcdHZub2RlLnN0YXRlID0gb2xkLnN0YXRlXG5cdFx0XHR2bm9kZS5fc3RhdGUgPSBvbGQuX3N0YXRlXG5cdFx0XHR2bm9kZS5ldmVudHMgPSBvbGQuZXZlbnRzXG5cdFx0XHRpZiAoIXJlY3ljbGluZyAmJiBzaG91bGROb3RVcGRhdGUodm5vZGUsIG9sZCkpIHJldHVyblxuXHRcdFx0aWYgKHR5cGVvZiBvbGRUYWcgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIHtcblx0XHRcdFx0XHRpZiAocmVjeWNsaW5nKSB7XG5cdFx0XHRcdFx0XHR2bm9kZS5zdGF0ZSA9IHt9XG5cdFx0XHRcdFx0XHRpbml0TGlmZWN5Y2xlKHZub2RlLmF0dHJzLCB2bm9kZSwgaG9va3MpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgdXBkYXRlTGlmZWN5Y2xlKHZub2RlLmF0dHJzLCB2bm9kZSwgaG9va3MpXG5cdFx0XHRcdH1cblx0XHRcdFx0c3dpdGNoIChvbGRUYWcpIHtcblx0XHRcdFx0XHRjYXNlIFwiI1wiOiB1cGRhdGVUZXh0KG9sZCwgdm5vZGUpOyBicmVha1xuXHRcdFx0XHRcdGNhc2UgXCI8XCI6IHVwZGF0ZUhUTUwocGFyZW50LCBvbGQsIHZub2RlLCBuZXh0U2libGluZyk7IGJyZWFrXG5cdFx0XHRcdFx0Y2FzZSBcIltcIjogdXBkYXRlRnJhZ21lbnQocGFyZW50LCBvbGQsIHZub2RlLCByZWN5Y2xpbmcsIGhvb2tzLCBuZXh0U2libGluZywgbnMpOyBicmVha1xuXHRcdFx0XHRcdGRlZmF1bHQ6IHVwZGF0ZUVsZW1lbnQob2xkLCB2bm9kZSwgcmVjeWNsaW5nLCBob29rcywgbnMpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgdXBkYXRlQ29tcG9uZW50KHBhcmVudCwgb2xkLCB2bm9kZSwgaG9va3MsIG5leHRTaWJsaW5nLCByZWN5Y2xpbmcsIG5zKVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJlbW92ZU5vZGUob2xkLCBudWxsKVxuXHRcdFx0Y3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVUZXh0KG9sZCwgdm5vZGUpIHtcblx0XHRpZiAob2xkLmNoaWxkcmVuLnRvU3RyaW5nKCkgIT09IHZub2RlLmNoaWxkcmVuLnRvU3RyaW5nKCkpIHtcblx0XHRcdG9sZC5kb20ubm9kZVZhbHVlID0gdm5vZGUuY2hpbGRyZW5cblx0XHR9XG5cdFx0dm5vZGUuZG9tID0gb2xkLmRvbVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUhUTUwocGFyZW50LCBvbGQsIHZub2RlLCBuZXh0U2libGluZykge1xuXHRcdGlmIChvbGQuY2hpbGRyZW4gIT09IHZub2RlLmNoaWxkcmVuKSB7XG5cdFx0XHR0b0ZyYWdtZW50KG9sZClcblx0XHRcdGNyZWF0ZUhUTUwocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpXG5cdFx0fVxuXHRcdGVsc2Ugdm5vZGUuZG9tID0gb2xkLmRvbSwgdm5vZGUuZG9tU2l6ZSA9IG9sZC5kb21TaXplXG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlRnJhZ21lbnQocGFyZW50LCBvbGQsIHZub2RlLCByZWN5Y2xpbmcsIGhvb2tzLCBuZXh0U2libGluZywgbnMpIHtcblx0XHR1cGRhdGVOb2RlcyhwYXJlbnQsIG9sZC5jaGlsZHJlbiwgdm5vZGUuY2hpbGRyZW4sIHJlY3ljbGluZywgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHR2YXIgZG9tU2l6ZSA9IDAsIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHR2bm9kZS5kb20gPSBudWxsXG5cdFx0aWYgKGNoaWxkcmVuICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIGNoaWxkID0gY2hpbGRyZW5baV1cblx0XHRcdFx0aWYgKGNoaWxkICE9IG51bGwgJiYgY2hpbGQuZG9tICE9IG51bGwpIHtcblx0XHRcdFx0XHRpZiAodm5vZGUuZG9tID09IG51bGwpIHZub2RlLmRvbSA9IGNoaWxkLmRvbVxuXHRcdFx0XHRcdGRvbVNpemUgKz0gY2hpbGQuZG9tU2l6ZSB8fCAxXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChkb21TaXplICE9PSAxKSB2bm9kZS5kb21TaXplID0gZG9tU2l6ZVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVFbGVtZW50KG9sZCwgdm5vZGUsIHJlY3ljbGluZywgaG9va3MsIG5zKSB7XG5cdFx0dmFyIGVsZW1lbnQgPSB2bm9kZS5kb20gPSBvbGQuZG9tXG5cdFx0c3dpdGNoICh2bm9kZS50YWcpIHtcblx0XHRcdGNhc2UgXCJzdmdcIjogbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7IGJyZWFrXG5cdFx0XHRjYXNlIFwibWF0aFwiOiBucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiOyBicmVha1xuXHRcdH1cblx0XHRpZiAodm5vZGUudGFnID09PSBcInRleHRhcmVhXCIpIHtcblx0XHRcdGlmICh2bm9kZS5hdHRycyA9PSBudWxsKSB2bm9kZS5hdHRycyA9IHt9XG5cdFx0XHRpZiAodm5vZGUudGV4dCAhPSBudWxsKSB7XG5cdFx0XHRcdHZub2RlLmF0dHJzLnZhbHVlID0gdm5vZGUudGV4dCAvL0ZJWE1FIGhhbmRsZTAgbXVsdGlwbGUgY2hpbGRyZW5cblx0XHRcdFx0dm5vZGUudGV4dCA9IHVuZGVmaW5lZFxuXHRcdFx0fVxuXHRcdH1cblx0XHR1cGRhdGVBdHRycyh2bm9kZSwgb2xkLmF0dHJzLCB2bm9kZS5hdHRycywgbnMpXG5cdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwgJiYgdm5vZGUuYXR0cnMuY29udGVudGVkaXRhYmxlICE9IG51bGwpIHtcblx0XHRcdHNldENvbnRlbnRFZGl0YWJsZSh2bm9kZSlcblx0XHR9XG5cdFx0ZWxzZSBpZiAob2xkLnRleHQgIT0gbnVsbCAmJiB2bm9kZS50ZXh0ICE9IG51bGwgJiYgdm5vZGUudGV4dCAhPT0gXCJcIikge1xuXHRcdFx0aWYgKG9sZC50ZXh0LnRvU3RyaW5nKCkgIT09IHZub2RlLnRleHQudG9TdHJpbmcoKSkgb2xkLmRvbS5maXJzdENoaWxkLm5vZGVWYWx1ZSA9IHZub2RlLnRleHRcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAob2xkLnRleHQgIT0gbnVsbCkgb2xkLmNoaWxkcmVuID0gW1Zub2RlKFwiI1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgb2xkLnRleHQsIHVuZGVmaW5lZCwgb2xkLmRvbS5maXJzdENoaWxkKV1cblx0XHRcdGlmICh2bm9kZS50ZXh0ICE9IG51bGwpIHZub2RlLmNoaWxkcmVuID0gW1Zub2RlKFwiI1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdm5vZGUudGV4dCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpXVxuXHRcdFx0dXBkYXRlTm9kZXMoZWxlbWVudCwgb2xkLmNoaWxkcmVuLCB2bm9kZS5jaGlsZHJlbiwgcmVjeWNsaW5nLCBob29rcywgbnVsbCwgbnMpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUNvbXBvbmVudChwYXJlbnQsIG9sZCwgdm5vZGUsIGhvb2tzLCBuZXh0U2libGluZywgcmVjeWNsaW5nLCBucykge1xuXHRcdGlmIChyZWN5Y2xpbmcpIHtcblx0XHRcdGluaXRDb21wb25lbnQodm5vZGUsIGhvb2tzKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2bm9kZS5pbnN0YW5jZSA9IFZub2RlLm5vcm1hbGl6ZSh2bm9kZS5fc3RhdGUudmlldy5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSkpXG5cdFx0XHRpZiAodm5vZGUuaW5zdGFuY2UgPT09IHZub2RlKSB0aHJvdyBFcnJvcihcIkEgdmlldyBjYW5ub3QgcmV0dXJuIHRoZSB2bm9kZSBpdCByZWNlaXZlZCBhcyBhcmd1bWVudFwiKVxuXHRcdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIHVwZGF0ZUxpZmVjeWNsZSh2bm9kZS5hdHRycywgdm5vZGUsIGhvb2tzKVxuXHRcdFx0dXBkYXRlTGlmZWN5Y2xlKHZub2RlLl9zdGF0ZSwgdm5vZGUsIGhvb2tzKVxuXHRcdH1cblx0XHRpZiAodm5vZGUuaW5zdGFuY2UgIT0gbnVsbCkge1xuXHRcdFx0aWYgKG9sZC5pbnN0YW5jZSA9PSBudWxsKSBjcmVhdGVOb2RlKHBhcmVudCwgdm5vZGUuaW5zdGFuY2UsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHRlbHNlIHVwZGF0ZU5vZGUocGFyZW50LCBvbGQuaW5zdGFuY2UsIHZub2RlLmluc3RhbmNlLCBob29rcywgbmV4dFNpYmxpbmcsIHJlY3ljbGluZywgbnMpXG5cdFx0XHR2bm9kZS5kb20gPSB2bm9kZS5pbnN0YW5jZS5kb21cblx0XHRcdHZub2RlLmRvbVNpemUgPSB2bm9kZS5pbnN0YW5jZS5kb21TaXplXG5cdFx0fVxuXHRcdGVsc2UgaWYgKG9sZC5pbnN0YW5jZSAhPSBudWxsKSB7XG5cdFx0XHRyZW1vdmVOb2RlKG9sZC5pbnN0YW5jZSwgbnVsbClcblx0XHRcdHZub2RlLmRvbSA9IHVuZGVmaW5lZFxuXHRcdFx0dm5vZGUuZG9tU2l6ZSA9IDBcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR2bm9kZS5kb20gPSBvbGQuZG9tXG5cdFx0XHR2bm9kZS5kb21TaXplID0gb2xkLmRvbVNpemVcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gaXNSZWN5Y2xhYmxlKG9sZCwgdm5vZGVzKSB7XG5cdFx0aWYgKG9sZC5wb29sICE9IG51bGwgJiYgTWF0aC5hYnMob2xkLnBvb2wubGVuZ3RoIC0gdm5vZGVzLmxlbmd0aCkgPD0gTWF0aC5hYnMob2xkLmxlbmd0aCAtIHZub2Rlcy5sZW5ndGgpKSB7XG5cdFx0XHR2YXIgb2xkQ2hpbGRyZW5MZW5ndGggPSBvbGRbMF0gJiYgb2xkWzBdLmNoaWxkcmVuICYmIG9sZFswXS5jaGlsZHJlbi5sZW5ndGggfHwgMFxuXHRcdFx0dmFyIHBvb2xDaGlsZHJlbkxlbmd0aCA9IG9sZC5wb29sWzBdICYmIG9sZC5wb29sWzBdLmNoaWxkcmVuICYmIG9sZC5wb29sWzBdLmNoaWxkcmVuLmxlbmd0aCB8fCAwXG5cdFx0XHR2YXIgdm5vZGVzQ2hpbGRyZW5MZW5ndGggPSB2bm9kZXNbMF0gJiYgdm5vZGVzWzBdLmNoaWxkcmVuICYmIHZub2Rlc1swXS5jaGlsZHJlbi5sZW5ndGggfHwgMFxuXHRcdFx0aWYgKE1hdGguYWJzKHBvb2xDaGlsZHJlbkxlbmd0aCAtIHZub2Rlc0NoaWxkcmVuTGVuZ3RoKSA8PSBNYXRoLmFicyhvbGRDaGlsZHJlbkxlbmd0aCAtIHZub2Rlc0NoaWxkcmVuTGVuZ3RoKSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxuXHRmdW5jdGlvbiBnZXRLZXlNYXAodm5vZGVzLCBlbmQpIHtcblx0XHR2YXIgbWFwID0ge30sIGkgPSAwXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBlbmQ7IGkrKykge1xuXHRcdFx0dmFyIHZub2RlID0gdm5vZGVzW2ldXG5cdFx0XHRpZiAodm5vZGUgIT0gbnVsbCkge1xuXHRcdFx0XHR2YXIga2V5MiA9IHZub2RlLmtleVxuXHRcdFx0XHRpZiAoa2V5MiAhPSBudWxsKSBtYXBba2V5Ml0gPSBpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBtYXBcblx0fVxuXHRmdW5jdGlvbiB0b0ZyYWdtZW50KHZub2RlKSB7XG5cdFx0dmFyIGNvdW50MCA9IHZub2RlLmRvbVNpemVcblx0XHRpZiAoY291bnQwICE9IG51bGwgfHwgdm5vZGUuZG9tID09IG51bGwpIHtcblx0XHRcdHZhciBmcmFnbWVudCA9ICRkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0XHRpZiAoY291bnQwID4gMCkge1xuXHRcdFx0XHR2YXIgZG9tID0gdm5vZGUuZG9tXG5cdFx0XHRcdHdoaWxlICgtLWNvdW50MCkgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZG9tLm5leHRTaWJsaW5nKVxuXHRcdFx0XHRmcmFnbWVudC5pbnNlcnRCZWZvcmUoZG9tLCBmcmFnbWVudC5maXJzdENoaWxkKVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWdtZW50XG5cdFx0fVxuXHRcdGVsc2UgcmV0dXJuIHZub2RlLmRvbVxuXHR9XG5cdGZ1bmN0aW9uIGdldE5leHRTaWJsaW5nKHZub2RlcywgaSwgbmV4dFNpYmxpbmcpIHtcblx0XHRmb3IgKDsgaSA8IHZub2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHZub2Rlc1tpXSAhPSBudWxsICYmIHZub2Rlc1tpXS5kb20gIT0gbnVsbCkgcmV0dXJuIHZub2Rlc1tpXS5kb21cblx0XHR9XG5cdFx0cmV0dXJuIG5leHRTaWJsaW5nXG5cdH1cblx0ZnVuY3Rpb24gaW5zZXJ0Tm9kZShwYXJlbnQsIGRvbSwgbmV4dFNpYmxpbmcpIHtcblx0XHRpZiAobmV4dFNpYmxpbmcgJiYgbmV4dFNpYmxpbmcucGFyZW50Tm9kZSkgcGFyZW50Lmluc2VydEJlZm9yZShkb20sIG5leHRTaWJsaW5nKVxuXHRcdGVsc2UgcGFyZW50LmFwcGVuZENoaWxkKGRvbSlcblx0fVxuXHRmdW5jdGlvbiBzZXRDb250ZW50RWRpdGFibGUodm5vZGUpIHtcblx0XHR2YXIgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlblxuXHRcdGlmIChjaGlsZHJlbiAhPSBudWxsICYmIGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJiBjaGlsZHJlblswXS50YWcgPT09IFwiPFwiKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNoaWxkcmVuWzBdLmNoaWxkcmVuXG5cdFx0XHRpZiAodm5vZGUuZG9tLmlubmVySFRNTCAhPT0gY29udGVudCkgdm5vZGUuZG9tLmlubmVySFRNTCA9IGNvbnRlbnRcblx0XHR9XG5cdFx0ZWxzZSBpZiAodm5vZGUudGV4dCAhPSBudWxsIHx8IGNoaWxkcmVuICE9IG51bGwgJiYgY2hpbGRyZW4ubGVuZ3RoICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZCBub2RlIG9mIGEgY29udGVudGVkaXRhYmxlIG11c3QgYmUgdHJ1c3RlZFwiKVxuXHR9XG5cdC8vcmVtb3ZlXG5cdGZ1bmN0aW9uIHJlbW92ZU5vZGVzKHZub2Rlcywgc3RhcnQsIGVuZCwgY29udGV4dCkge1xuXHRcdGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG5cdFx0XHR2YXIgdm5vZGUgPSB2bm9kZXNbaV1cblx0XHRcdGlmICh2bm9kZSAhPSBudWxsKSB7XG5cdFx0XHRcdGlmICh2bm9kZS5za2lwKSB2bm9kZS5za2lwID0gZmFsc2Vcblx0XHRcdFx0ZWxzZSByZW1vdmVOb2RlKHZub2RlLCBjb250ZXh0KVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiByZW1vdmVOb2RlKHZub2RlLCBjb250ZXh0KSB7XG5cdFx0dmFyIGV4cGVjdGVkID0gMSwgY2FsbGVkID0gMFxuXHRcdGlmICh2bm9kZS5hdHRycyAmJiB0eXBlb2Ygdm5vZGUuYXR0cnMub25iZWZvcmVyZW1vdmUgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dmFyIHJlc3VsdCA9IHZub2RlLmF0dHJzLm9uYmVmb3JlcmVtb3ZlLmNhbGwodm5vZGUuc3RhdGUsIHZub2RlKVxuXHRcdFx0aWYgKHJlc3VsdCAhPSBudWxsICYmIHR5cGVvZiByZXN1bHQudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdGV4cGVjdGVkKytcblx0XHRcdFx0cmVzdWx0LnRoZW4oY29udGludWF0aW9uLCBjb250aW51YXRpb24pXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiB2bm9kZS5fc3RhdGUub25iZWZvcmVyZW1vdmUgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dmFyIHJlc3VsdCA9IHZub2RlLl9zdGF0ZS5vbmJlZm9yZXJlbW92ZS5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSlcblx0XHRcdGlmIChyZXN1bHQgIT0gbnVsbCAmJiB0eXBlb2YgcmVzdWx0LnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRleHBlY3RlZCsrXG5cdFx0XHRcdHJlc3VsdC50aGVuKGNvbnRpbnVhdGlvbiwgY29udGludWF0aW9uKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRjb250aW51YXRpb24oKVxuXHRcdGZ1bmN0aW9uIGNvbnRpbnVhdGlvbigpIHtcblx0XHRcdGlmICgrK2NhbGxlZCA9PT0gZXhwZWN0ZWQpIHtcblx0XHRcdFx0b25yZW1vdmUodm5vZGUpXG5cdFx0XHRcdGlmICh2bm9kZS5kb20pIHtcblx0XHRcdFx0XHR2YXIgY291bnQwID0gdm5vZGUuZG9tU2l6ZSB8fCAxXG5cdFx0XHRcdFx0aWYgKGNvdW50MCA+IDEpIHtcblx0XHRcdFx0XHRcdHZhciBkb20gPSB2bm9kZS5kb21cblx0XHRcdFx0XHRcdHdoaWxlICgtLWNvdW50MCkge1xuXHRcdFx0XHRcdFx0XHRyZW1vdmVOb2RlRnJvbURPTShkb20ubmV4dFNpYmxpbmcpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlbW92ZU5vZGVGcm9tRE9NKHZub2RlLmRvbSlcblx0XHRcdFx0XHRpZiAoY29udGV4dCAhPSBudWxsICYmIHZub2RlLmRvbVNpemUgPT0gbnVsbCAmJiAhaGFzSW50ZWdyYXRpb25NZXRob2RzKHZub2RlLmF0dHJzKSAmJiB0eXBlb2Ygdm5vZGUudGFnID09PSBcInN0cmluZ1wiKSB7IC8vVE9ETyB0ZXN0IGN1c3RvbSBlbGVtZW50c1xuXHRcdFx0XHRcdFx0aWYgKCFjb250ZXh0LnBvb2wpIGNvbnRleHQucG9vbCA9IFt2bm9kZV1cblx0XHRcdFx0XHRcdGVsc2UgY29udGV4dC5wb29sLnB1c2godm5vZGUpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHJlbW92ZU5vZGVGcm9tRE9NKG5vZGUpIHtcblx0XHR2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnROb2RlXG5cdFx0aWYgKHBhcmVudCAhPSBudWxsKSBwYXJlbnQucmVtb3ZlQ2hpbGQobm9kZSlcblx0fVxuXHRmdW5jdGlvbiBvbnJlbW92ZSh2bm9kZSkge1xuXHRcdGlmICh2bm9kZS5hdHRycyAmJiB0eXBlb2Ygdm5vZGUuYXR0cnMub25yZW1vdmUgPT09IFwiZnVuY3Rpb25cIikgdm5vZGUuYXR0cnMub25yZW1vdmUuY2FsbCh2bm9kZS5zdGF0ZSwgdm5vZGUpXG5cdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHZub2RlLl9zdGF0ZS5vbnJlbW92ZSA9PT0gXCJmdW5jdGlvblwiKSB2bm9kZS5fc3RhdGUub25yZW1vdmUuY2FsbCh2bm9kZS5zdGF0ZSwgdm5vZGUpXG5cdFx0aWYgKHZub2RlLmluc3RhbmNlICE9IG51bGwpIG9ucmVtb3ZlKHZub2RlLmluc3RhbmNlKVxuXHRcdGVsc2Uge1xuXHRcdFx0dmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0dmFyIGNoaWxkID0gY2hpbGRyZW5baV1cblx0XHRcdFx0XHRpZiAoY2hpbGQgIT0gbnVsbCkgb25yZW1vdmUoY2hpbGQpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Ly9hdHRyczJcblx0ZnVuY3Rpb24gc2V0QXR0cnModm5vZGUsIGF0dHJzMiwgbnMpIHtcblx0XHRmb3IgKHZhciBrZXkyIGluIGF0dHJzMikge1xuXHRcdFx0c2V0QXR0cih2bm9kZSwga2V5MiwgbnVsbCwgYXR0cnMyW2tleTJdLCBucylcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gc2V0QXR0cih2bm9kZSwga2V5Miwgb2xkLCB2YWx1ZSwgbnMpIHtcblx0XHR2YXIgZWxlbWVudCA9IHZub2RlLmRvbVxuXHRcdGlmIChrZXkyID09PSBcImtleVwiIHx8IGtleTIgPT09IFwiaXNcIiB8fCAob2xkID09PSB2YWx1ZSAmJiAhaXNGb3JtQXR0cmlidXRlKHZub2RlLCBrZXkyKSkgJiYgdHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBpc0xpZmVjeWNsZU1ldGhvZChrZXkyKSkgcmV0dXJuXG5cdFx0dmFyIG5zTGFzdEluZGV4ID0ga2V5Mi5pbmRleE9mKFwiOlwiKVxuXHRcdGlmIChuc0xhc3RJbmRleCA+IC0xICYmIGtleTIuc3Vic3RyKDAsIG5zTGFzdEluZGV4KSA9PT0gXCJ4bGlua1wiKSB7XG5cdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLCBrZXkyLnNsaWNlKG5zTGFzdEluZGV4ICsgMSksIHZhbHVlKVxuXHRcdH1cblx0XHRlbHNlIGlmIChrZXkyWzBdID09PSBcIm9cIiAmJiBrZXkyWzFdID09PSBcIm5cIiAmJiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikgdXBkYXRlRXZlbnQodm5vZGUsIGtleTIsIHZhbHVlKVxuXHRcdGVsc2UgaWYgKGtleTIgPT09IFwic3R5bGVcIikgdXBkYXRlU3R5bGUoZWxlbWVudCwgb2xkLCB2YWx1ZSlcblx0XHRlbHNlIGlmIChrZXkyIGluIGVsZW1lbnQgJiYgIWlzQXR0cmlidXRlKGtleTIpICYmIG5zID09PSB1bmRlZmluZWQgJiYgIWlzQ3VzdG9tRWxlbWVudCh2bm9kZSkpIHtcblx0XHRcdC8vc2V0dGluZyBpbnB1dFt2YWx1ZV0gdG8gc2FtZSB2YWx1ZSBieSB0eXBpbmcgb24gZm9jdXNlZCBlbGVtZW50IG1vdmVzIGN1cnNvciB0byBlbmQgaW4gQ2hyb21lXG5cdFx0XHRpZiAodm5vZGUudGFnID09PSBcImlucHV0XCIgJiYga2V5MiA9PT0gXCJ2YWx1ZVwiICYmIHZub2RlLmRvbS52YWx1ZSA9PSB2YWx1ZSAmJiB2bm9kZS5kb20gPT09ICRkb2MuYWN0aXZlRWxlbWVudCkgcmV0dXJuXG5cdFx0XHQvL3NldHRpbmcgc2VsZWN0W3ZhbHVlXSB0byBzYW1lIHZhbHVlIHdoaWxlIGhhdmluZyBzZWxlY3Qgb3BlbiBibGlua3Mgc2VsZWN0IGRyb3Bkb3duIGluIENocm9tZVxuXHRcdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJzZWxlY3RcIiAmJiBrZXkyID09PSBcInZhbHVlXCIgJiYgdm5vZGUuZG9tLnZhbHVlID09IHZhbHVlICYmIHZub2RlLmRvbSA9PT0gJGRvYy5hY3RpdmVFbGVtZW50KSByZXR1cm5cblx0XHRcdC8vc2V0dGluZyBvcHRpb25bdmFsdWVdIHRvIHNhbWUgdmFsdWUgd2hpbGUgaGF2aW5nIHNlbGVjdCBvcGVuIGJsaW5rcyBzZWxlY3QgZHJvcGRvd24gaW4gQ2hyb21lXG5cdFx0XHRpZiAodm5vZGUudGFnID09PSBcIm9wdGlvblwiICYmIGtleTIgPT09IFwidmFsdWVcIiAmJiB2bm9kZS5kb20udmFsdWUgPT0gdmFsdWUpIHJldHVyblxuXHRcdFx0Ly8gSWYgeW91IGFzc2lnbiBhbiBpbnB1dCB0eXBlMSB0aGF0IGlzIG5vdCBzdXBwb3J0ZWQgYnkgSUUgMTEgd2l0aCBhbiBhc3NpZ25tZW50IGV4cHJlc3Npb24sIGFuIGVycm9yMCB3aWxsIG9jY3VyLlxuXHRcdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJpbnB1dFwiICYmIGtleTIgPT09IFwidHlwZVwiKSB7XG5cdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleTIsIHZhbHVlKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdGVsZW1lbnRba2V5Ml0gPSB2YWx1ZVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0XHRcdGlmICh2YWx1ZSkgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5MiwgXCJcIilcblx0XHRcdFx0ZWxzZSBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShrZXkyKVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBlbGVtZW50LnNldEF0dHJpYnV0ZShrZXkyID09PSBcImNsYXNzTmFtZVwiID8gXCJjbGFzc1wiIDoga2V5MiwgdmFsdWUpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHNldExhdGVBdHRycyh2bm9kZSkge1xuXHRcdHZhciBhdHRyczIgPSB2bm9kZS5hdHRyc1xuXHRcdGlmICh2bm9kZS50YWcgPT09IFwic2VsZWN0XCIgJiYgYXR0cnMyICE9IG51bGwpIHtcblx0XHRcdGlmIChcInZhbHVlXCIgaW4gYXR0cnMyKSBzZXRBdHRyKHZub2RlLCBcInZhbHVlXCIsIG51bGwsIGF0dHJzMi52YWx1ZSwgdW5kZWZpbmVkKVxuXHRcdFx0aWYgKFwic2VsZWN0ZWRJbmRleFwiIGluIGF0dHJzMikgc2V0QXR0cih2bm9kZSwgXCJzZWxlY3RlZEluZGV4XCIsIG51bGwsIGF0dHJzMi5zZWxlY3RlZEluZGV4LCB1bmRlZmluZWQpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUF0dHJzKHZub2RlLCBvbGQsIGF0dHJzMiwgbnMpIHtcblx0XHRpZiAoYXR0cnMyICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGtleTIgaW4gYXR0cnMyKSB7XG5cdFx0XHRcdHNldEF0dHIodm5vZGUsIGtleTIsIG9sZCAmJiBvbGRba2V5Ml0sIGF0dHJzMltrZXkyXSwgbnMpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChvbGQgIT0gbnVsbCkge1xuXHRcdFx0Zm9yICh2YXIga2V5MiBpbiBvbGQpIHtcblx0XHRcdFx0aWYgKGF0dHJzMiA9PSBudWxsIHx8ICEoa2V5MiBpbiBhdHRyczIpKSB7XG5cdFx0XHRcdFx0aWYgKGtleTIgPT09IFwiY2xhc3NOYW1lXCIpIGtleTIgPSBcImNsYXNzXCJcblx0XHRcdFx0XHRpZiAoa2V5MlswXSA9PT0gXCJvXCIgJiYga2V5MlsxXSA9PT0gXCJuXCIgJiYgIWlzTGlmZWN5Y2xlTWV0aG9kKGtleTIpKSB1cGRhdGVFdmVudCh2bm9kZSwga2V5MiwgdW5kZWZpbmVkKVxuXHRcdFx0XHRcdGVsc2UgaWYgKGtleTIgIT09IFwia2V5XCIpIHZub2RlLmRvbS5yZW1vdmVBdHRyaWJ1dGUoa2V5Milcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBpc0Zvcm1BdHRyaWJ1dGUodm5vZGUsIGF0dHIpIHtcblx0XHRyZXR1cm4gYXR0ciA9PT0gXCJ2YWx1ZVwiIHx8IGF0dHIgPT09IFwiY2hlY2tlZFwiIHx8IGF0dHIgPT09IFwic2VsZWN0ZWRJbmRleFwiIHx8IGF0dHIgPT09IFwic2VsZWN0ZWRcIiAmJiB2bm9kZS5kb20gPT09ICRkb2MuYWN0aXZlRWxlbWVudFxuXHR9XG5cdGZ1bmN0aW9uIGlzTGlmZWN5Y2xlTWV0aG9kKGF0dHIpIHtcblx0XHRyZXR1cm4gYXR0ciA9PT0gXCJvbmluaXRcIiB8fCBhdHRyID09PSBcIm9uY3JlYXRlXCIgfHwgYXR0ciA9PT0gXCJvbnVwZGF0ZVwiIHx8IGF0dHIgPT09IFwib25yZW1vdmVcIiB8fCBhdHRyID09PSBcIm9uYmVmb3JlcmVtb3ZlXCIgfHwgYXR0ciA9PT0gXCJvbmJlZm9yZXVwZGF0ZVwiXG5cdH1cblx0ZnVuY3Rpb24gaXNBdHRyaWJ1dGUoYXR0cikge1xuXHRcdHJldHVybiBhdHRyID09PSBcImhyZWZcIiB8fCBhdHRyID09PSBcImxpc3RcIiB8fCBhdHRyID09PSBcImZvcm1cIiB8fCBhdHRyID09PSBcIndpZHRoXCIgfHwgYXR0ciA9PT0gXCJoZWlnaHRcIi8vIHx8IGF0dHIgPT09IFwidHlwZVwiXG5cdH1cblx0ZnVuY3Rpb24gaXNDdXN0b21FbGVtZW50KHZub2RlKXtcblx0XHRyZXR1cm4gdm5vZGUuYXR0cnMuaXMgfHwgdm5vZGUudGFnLmluZGV4T2YoXCItXCIpID4gLTFcblx0fVxuXHRmdW5jdGlvbiBoYXNJbnRlZ3JhdGlvbk1ldGhvZHMoc291cmNlKSB7XG5cdFx0cmV0dXJuIHNvdXJjZSAhPSBudWxsICYmIChzb3VyY2Uub25jcmVhdGUgfHwgc291cmNlLm9udXBkYXRlIHx8IHNvdXJjZS5vbmJlZm9yZXJlbW92ZSB8fCBzb3VyY2Uub25yZW1vdmUpXG5cdH1cblx0Ly9zdHlsZVxuXHRmdW5jdGlvbiB1cGRhdGVTdHlsZShlbGVtZW50LCBvbGQsIHN0eWxlKSB7XG5cdFx0aWYgKG9sZCA9PT0gc3R5bGUpIGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IFwiXCIsIG9sZCA9IG51bGxcblx0XHRpZiAoc3R5bGUgPT0gbnVsbCkgZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gXCJcIlxuXHRcdGVsc2UgaWYgKHR5cGVvZiBzdHlsZSA9PT0gXCJzdHJpbmdcIikgZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gc3R5bGVcblx0XHRlbHNlIHtcblx0XHRcdGlmICh0eXBlb2Ygb2xkID09PSBcInN0cmluZ1wiKSBlbGVtZW50LnN0eWxlLmNzc1RleHQgPSBcIlwiXG5cdFx0XHRmb3IgKHZhciBrZXkyIGluIHN0eWxlKSB7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGVba2V5Ml0gPSBzdHlsZVtrZXkyXVxuXHRcdFx0fVxuXHRcdFx0aWYgKG9sZCAhPSBudWxsICYmIHR5cGVvZiBvbGQgIT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5MiBpbiBvbGQpIHtcblx0XHRcdFx0XHRpZiAoIShrZXkyIGluIHN0eWxlKSkgZWxlbWVudC5zdHlsZVtrZXkyXSA9IFwiXCJcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHQvL2V2ZW50XG5cdGZ1bmN0aW9uIHVwZGF0ZUV2ZW50KHZub2RlLCBrZXkyLCB2YWx1ZSkge1xuXHRcdHZhciBlbGVtZW50ID0gdm5vZGUuZG9tXG5cdFx0dmFyIGNhbGxiYWNrID0gdHlwZW9mIG9uZXZlbnQgIT09IFwiZnVuY3Rpb25cIiA/IHZhbHVlIDogZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIHJlc3VsdCA9IHZhbHVlLmNhbGwoZWxlbWVudCwgZSlcblx0XHRcdG9uZXZlbnQuY2FsbChlbGVtZW50LCBlKVxuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXHRcdH1cblx0XHRpZiAoa2V5MiBpbiBlbGVtZW50KSBlbGVtZW50W2tleTJdID0gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBjYWxsYmFjayA6IG51bGxcblx0XHRlbHNlIHtcblx0XHRcdHZhciBldmVudE5hbWUgPSBrZXkyLnNsaWNlKDIpXG5cdFx0XHRpZiAodm5vZGUuZXZlbnRzID09PSB1bmRlZmluZWQpIHZub2RlLmV2ZW50cyA9IHt9XG5cdFx0XHRpZiAodm5vZGUuZXZlbnRzW2tleTJdID09PSBjYWxsYmFjaykgcmV0dXJuXG5cdFx0XHRpZiAodm5vZGUuZXZlbnRzW2tleTJdICE9IG51bGwpIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHZub2RlLmV2ZW50c1trZXkyXSwgZmFsc2UpXG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0dm5vZGUuZXZlbnRzW2tleTJdID0gY2FsbGJhY2tcblx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdm5vZGUuZXZlbnRzW2tleTJdLCBmYWxzZSlcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Ly9saWZlY3ljbGVcblx0ZnVuY3Rpb24gaW5pdExpZmVjeWNsZShzb3VyY2UsIHZub2RlLCBob29rcykge1xuXHRcdGlmICh0eXBlb2Ygc291cmNlLm9uaW5pdCA9PT0gXCJmdW5jdGlvblwiKSBzb3VyY2Uub25pbml0LmNhbGwodm5vZGUuc3RhdGUsIHZub2RlKVxuXHRcdGlmICh0eXBlb2Ygc291cmNlLm9uY3JlYXRlID09PSBcImZ1bmN0aW9uXCIpIGhvb2tzLnB1c2goc291cmNlLm9uY3JlYXRlLmJpbmQodm5vZGUuc3RhdGUsIHZub2RlKSlcblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVMaWZlY3ljbGUoc291cmNlLCB2bm9kZSwgaG9va3MpIHtcblx0XHRpZiAodHlwZW9mIHNvdXJjZS5vbnVwZGF0ZSA9PT0gXCJmdW5jdGlvblwiKSBob29rcy5wdXNoKHNvdXJjZS5vbnVwZGF0ZS5iaW5kKHZub2RlLnN0YXRlLCB2bm9kZSkpXG5cdH1cblx0ZnVuY3Rpb24gc2hvdWxkTm90VXBkYXRlKHZub2RlLCBvbGQpIHtcblx0XHR2YXIgZm9yY2VWbm9kZVVwZGF0ZSwgZm9yY2VDb21wb25lbnRVcGRhdGVcblx0XHRpZiAodm5vZGUuYXR0cnMgIT0gbnVsbCAmJiB0eXBlb2Ygdm5vZGUuYXR0cnMub25iZWZvcmV1cGRhdGUgPT09IFwiZnVuY3Rpb25cIikgZm9yY2VWbm9kZVVwZGF0ZSA9IHZub2RlLmF0dHJzLm9uYmVmb3JldXBkYXRlLmNhbGwodm5vZGUuc3RhdGUsIHZub2RlLCBvbGQpXG5cdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHZub2RlLl9zdGF0ZS5vbmJlZm9yZXVwZGF0ZSA9PT0gXCJmdW5jdGlvblwiKSBmb3JjZUNvbXBvbmVudFVwZGF0ZSA9IHZub2RlLl9zdGF0ZS5vbmJlZm9yZXVwZGF0ZS5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSwgb2xkKVxuXHRcdGlmICghKGZvcmNlVm5vZGVVcGRhdGUgPT09IHVuZGVmaW5lZCAmJiBmb3JjZUNvbXBvbmVudFVwZGF0ZSA9PT0gdW5kZWZpbmVkKSAmJiAhZm9yY2VWbm9kZVVwZGF0ZSAmJiAhZm9yY2VDb21wb25lbnRVcGRhdGUpIHtcblx0XHRcdHZub2RlLmRvbSA9IG9sZC5kb21cblx0XHRcdHZub2RlLmRvbVNpemUgPSBvbGQuZG9tU2l6ZVxuXHRcdFx0dm5vZGUuaW5zdGFuY2UgPSBvbGQuaW5zdGFuY2Vcblx0XHRcdHJldHVybiB0cnVlXG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZVxuXHR9XG5cdGZ1bmN0aW9uIHJlbmRlcihkb20sIHZub2Rlcykge1xuXHRcdGlmICghZG9tKSB0aHJvdyBuZXcgRXJyb3IoXCJFbnN1cmUgdGhlIERPTSBlbGVtZW50IGJlaW5nIHBhc3NlZCB0byBtLnJvdXRlL20ubW91bnQvbS5yZW5kZXIgaXMgbm90IHVuZGVmaW5lZC5cIilcblx0XHR2YXIgaG9va3MgPSBbXVxuXHRcdHZhciBhY3RpdmUgPSAkZG9jLmFjdGl2ZUVsZW1lbnRcblx0XHQvLyBGaXJzdCB0aW1lMCByZW5kZXJpbmcgaW50byBhIG5vZGUgY2xlYXJzIGl0IG91dFxuXHRcdGlmIChkb20udm5vZGVzID09IG51bGwpIGRvbS50ZXh0Q29udGVudCA9IFwiXCJcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkodm5vZGVzKSkgdm5vZGVzID0gW3Zub2Rlc11cblx0XHR1cGRhdGVOb2Rlcyhkb20sIGRvbS52bm9kZXMsIFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKHZub2RlcyksIGZhbHNlLCBob29rcywgbnVsbCwgdW5kZWZpbmVkKVxuXHRcdGRvbS52bm9kZXMgPSB2bm9kZXNcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhvb2tzLmxlbmd0aDsgaSsrKSBob29rc1tpXSgpXG5cdFx0aWYgKCRkb2MuYWN0aXZlRWxlbWVudCAhPT0gYWN0aXZlKSBhY3RpdmUuZm9jdXMoKVxuXHR9XG5cdHJldHVybiB7cmVuZGVyOiByZW5kZXIsIHNldEV2ZW50Q2FsbGJhY2s6IHNldEV2ZW50Q2FsbGJhY2t9XG59XG5mdW5jdGlvbiB0aHJvdHRsZShjYWxsYmFjaykge1xuXHQvLzYwZnBzIHRyYW5zbGF0ZXMgdG8gMTYuNm1zLCByb3VuZCBpdCBkb3duIHNpbmNlIHNldFRpbWVvdXQgcmVxdWlyZXMgaW50XG5cdHZhciB0aW1lID0gMTZcblx0dmFyIGxhc3QgPSAwLCBwZW5kaW5nID0gbnVsbFxuXHR2YXIgdGltZW91dCA9IHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09IFwiZnVuY3Rpb25cIiA/IHJlcXVlc3RBbmltYXRpb25GcmFtZSA6IHNldFRpbWVvdXRcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBub3cgPSBEYXRlLm5vdygpXG5cdFx0aWYgKGxhc3QgPT09IDAgfHwgbm93IC0gbGFzdCA+PSB0aW1lKSB7XG5cdFx0XHRsYXN0ID0gbm93XG5cdFx0XHRjYWxsYmFjaygpXG5cdFx0fVxuXHRcdGVsc2UgaWYgKHBlbmRpbmcgPT09IG51bGwpIHtcblx0XHRcdHBlbmRpbmcgPSB0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRwZW5kaW5nID0gbnVsbFxuXHRcdFx0XHRjYWxsYmFjaygpXG5cdFx0XHRcdGxhc3QgPSBEYXRlLm5vdygpXG5cdFx0XHR9LCB0aW1lIC0gKG5vdyAtIGxhc3QpKVxuXHRcdH1cblx0fVxufVxudmFyIF8xMSA9IGZ1bmN0aW9uKCR3aW5kb3cpIHtcblx0dmFyIHJlbmRlclNlcnZpY2UgPSBjb3JlUmVuZGVyZXIoJHdpbmRvdylcblx0cmVuZGVyU2VydmljZS5zZXRFdmVudENhbGxiYWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRpZiAoZS5yZWRyYXcgIT09IGZhbHNlKSByZWRyYXcoKVxuXHR9KVxuXHR2YXIgY2FsbGJhY2tzID0gW11cblx0ZnVuY3Rpb24gc3Vic2NyaWJlKGtleTEsIGNhbGxiYWNrKSB7XG5cdFx0dW5zdWJzY3JpYmUoa2V5MSlcblx0XHRjYWxsYmFja3MucHVzaChrZXkxLCB0aHJvdHRsZShjYWxsYmFjaykpXG5cdH1cblx0ZnVuY3Rpb24gdW5zdWJzY3JpYmUoa2V5MSkge1xuXHRcdHZhciBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGtleTEpXG5cdFx0aWYgKGluZGV4ID4gLTEpIGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDIpXG5cdH1cblx0ZnVuY3Rpb24gcmVkcmF3KCkge1xuXHRcdGZvciAodmFyIGkgPSAxOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSArPSAyKSB7XG5cdFx0XHRjYWxsYmFja3NbaV0oKVxuXHRcdH1cblx0fVxuXHRyZXR1cm4ge3N1YnNjcmliZTogc3Vic2NyaWJlLCB1bnN1YnNjcmliZTogdW5zdWJzY3JpYmUsIHJlZHJhdzogcmVkcmF3LCByZW5kZXI6IHJlbmRlclNlcnZpY2UucmVuZGVyfVxufVxudmFyIHJlZHJhd1NlcnZpY2UgPSBfMTEod2luZG93KVxucmVxdWVzdFNlcnZpY2Uuc2V0Q29tcGxldGlvbkNhbGxiYWNrKHJlZHJhd1NlcnZpY2UucmVkcmF3KVxudmFyIF8xNiA9IGZ1bmN0aW9uKHJlZHJhd1NlcnZpY2UwKSB7XG5cdHJldHVybiBmdW5jdGlvbihyb290LCBjb21wb25lbnQpIHtcblx0XHRpZiAoY29tcG9uZW50ID09PSBudWxsKSB7XG5cdFx0XHRyZWRyYXdTZXJ2aWNlMC5yZW5kZXIocm9vdCwgW10pXG5cdFx0XHRyZWRyYXdTZXJ2aWNlMC51bnN1YnNjcmliZShyb290KVxuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXHRcdFxuXHRcdGlmIChjb21wb25lbnQudmlldyA9PSBudWxsICYmIHR5cGVvZiBjb21wb25lbnQgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yKFwibS5tb3VudChlbGVtZW50LCBjb21wb25lbnQpIGV4cGVjdHMgYSBjb21wb25lbnQsIG5vdCBhIHZub2RlXCIpXG5cdFx0XG5cdFx0dmFyIHJ1bjAgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlZHJhd1NlcnZpY2UwLnJlbmRlcihyb290LCBWbm9kZShjb21wb25lbnQpKVxuXHRcdH1cblx0XHRyZWRyYXdTZXJ2aWNlMC5zdWJzY3JpYmUocm9vdCwgcnVuMClcblx0XHRyZWRyYXdTZXJ2aWNlMC5yZWRyYXcoKVxuXHR9XG59XG5tLm1vdW50ID0gXzE2KHJlZHJhd1NlcnZpY2UpXG52YXIgUHJvbWlzZSA9IFByb21pc2VQb2x5ZmlsbFxudmFyIHBhcnNlUXVlcnlTdHJpbmcgPSBmdW5jdGlvbihzdHJpbmcpIHtcblx0aWYgKHN0cmluZyA9PT0gXCJcIiB8fCBzdHJpbmcgPT0gbnVsbCkgcmV0dXJuIHt9XG5cdGlmIChzdHJpbmcuY2hhckF0KDApID09PSBcIj9cIikgc3RyaW5nID0gc3RyaW5nLnNsaWNlKDEpXG5cdHZhciBlbnRyaWVzID0gc3RyaW5nLnNwbGl0KFwiJlwiKSwgZGF0YTAgPSB7fSwgY291bnRlcnMgPSB7fVxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZW50cnkgPSBlbnRyaWVzW2ldLnNwbGl0KFwiPVwiKVxuXHRcdHZhciBrZXk1ID0gZGVjb2RlVVJJQ29tcG9uZW50KGVudHJ5WzBdKVxuXHRcdHZhciB2YWx1ZSA9IGVudHJ5Lmxlbmd0aCA9PT0gMiA/IGRlY29kZVVSSUNvbXBvbmVudChlbnRyeVsxXSkgOiBcIlwiXG5cdFx0aWYgKHZhbHVlID09PSBcInRydWVcIikgdmFsdWUgPSB0cnVlXG5cdFx0ZWxzZSBpZiAodmFsdWUgPT09IFwiZmFsc2VcIikgdmFsdWUgPSBmYWxzZVxuXHRcdHZhciBsZXZlbHMgPSBrZXk1LnNwbGl0KC9cXF1cXFs/fFxcWy8pXG5cdFx0dmFyIGN1cnNvciA9IGRhdGEwXG5cdFx0aWYgKGtleTUuaW5kZXhPZihcIltcIikgPiAtMSkgbGV2ZWxzLnBvcCgpXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBsZXZlbHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdHZhciBsZXZlbCA9IGxldmVsc1tqXSwgbmV4dExldmVsID0gbGV2ZWxzW2ogKyAxXVxuXHRcdFx0dmFyIGlzTnVtYmVyID0gbmV4dExldmVsID09IFwiXCIgfHwgIWlzTmFOKHBhcnNlSW50KG5leHRMZXZlbCwgMTApKVxuXHRcdFx0dmFyIGlzVmFsdWUgPSBqID09PSBsZXZlbHMubGVuZ3RoIC0gMVxuXHRcdFx0aWYgKGxldmVsID09PSBcIlwiKSB7XG5cdFx0XHRcdHZhciBrZXk1ID0gbGV2ZWxzLnNsaWNlKDAsIGopLmpvaW4oKVxuXHRcdFx0XHRpZiAoY291bnRlcnNba2V5NV0gPT0gbnVsbCkgY291bnRlcnNba2V5NV0gPSAwXG5cdFx0XHRcdGxldmVsID0gY291bnRlcnNba2V5NV0rK1xuXHRcdFx0fVxuXHRcdFx0aWYgKGN1cnNvcltsZXZlbF0gPT0gbnVsbCkge1xuXHRcdFx0XHRjdXJzb3JbbGV2ZWxdID0gaXNWYWx1ZSA/IHZhbHVlIDogaXNOdW1iZXIgPyBbXSA6IHt9XG5cdFx0XHR9XG5cdFx0XHRjdXJzb3IgPSBjdXJzb3JbbGV2ZWxdXG5cdFx0fVxuXHR9XG5cdHJldHVybiBkYXRhMFxufVxudmFyIGNvcmVSb3V0ZXIgPSBmdW5jdGlvbigkd2luZG93KSB7XG5cdHZhciBzdXBwb3J0c1B1c2hTdGF0ZSA9IHR5cGVvZiAkd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlID09PSBcImZ1bmN0aW9uXCJcblx0dmFyIGNhbGxBc3luYzAgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSBcImZ1bmN0aW9uXCIgPyBzZXRJbW1lZGlhdGUgOiBzZXRUaW1lb3V0XG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZTEoZnJhZ21lbnQwKSB7XG5cdFx0dmFyIGRhdGEgPSAkd2luZG93LmxvY2F0aW9uW2ZyYWdtZW50MF0ucmVwbGFjZSgvKD86JVthLWY4OV1bYS1mMC05XSkrL2dpbSwgZGVjb2RlVVJJQ29tcG9uZW50KVxuXHRcdGlmIChmcmFnbWVudDAgPT09IFwicGF0aG5hbWVcIiAmJiBkYXRhWzBdICE9PSBcIi9cIikgZGF0YSA9IFwiL1wiICsgZGF0YVxuXHRcdHJldHVybiBkYXRhXG5cdH1cblx0dmFyIGFzeW5jSWRcblx0ZnVuY3Rpb24gZGVib3VuY2VBc3luYyhjYWxsYmFjazApIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoYXN5bmNJZCAhPSBudWxsKSByZXR1cm5cblx0XHRcdGFzeW5jSWQgPSBjYWxsQXN5bmMwKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRhc3luY0lkID0gbnVsbFxuXHRcdFx0XHRjYWxsYmFjazAoKVxuXHRcdFx0fSlcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gcGFyc2VQYXRoKHBhdGgsIHF1ZXJ5RGF0YSwgaGFzaERhdGEpIHtcblx0XHR2YXIgcXVlcnlJbmRleCA9IHBhdGguaW5kZXhPZihcIj9cIilcblx0XHR2YXIgaGFzaEluZGV4ID0gcGF0aC5pbmRleE9mKFwiI1wiKVxuXHRcdHZhciBwYXRoRW5kID0gcXVlcnlJbmRleCA+IC0xID8gcXVlcnlJbmRleCA6IGhhc2hJbmRleCA+IC0xID8gaGFzaEluZGV4IDogcGF0aC5sZW5ndGhcblx0XHRpZiAocXVlcnlJbmRleCA+IC0xKSB7XG5cdFx0XHR2YXIgcXVlcnlFbmQgPSBoYXNoSW5kZXggPiAtMSA/IGhhc2hJbmRleCA6IHBhdGgubGVuZ3RoXG5cdFx0XHR2YXIgcXVlcnlQYXJhbXMgPSBwYXJzZVF1ZXJ5U3RyaW5nKHBhdGguc2xpY2UocXVlcnlJbmRleCArIDEsIHF1ZXJ5RW5kKSlcblx0XHRcdGZvciAodmFyIGtleTQgaW4gcXVlcnlQYXJhbXMpIHF1ZXJ5RGF0YVtrZXk0XSA9IHF1ZXJ5UGFyYW1zW2tleTRdXG5cdFx0fVxuXHRcdGlmIChoYXNoSW5kZXggPiAtMSkge1xuXHRcdFx0dmFyIGhhc2hQYXJhbXMgPSBwYXJzZVF1ZXJ5U3RyaW5nKHBhdGguc2xpY2UoaGFzaEluZGV4ICsgMSkpXG5cdFx0XHRmb3IgKHZhciBrZXk0IGluIGhhc2hQYXJhbXMpIGhhc2hEYXRhW2tleTRdID0gaGFzaFBhcmFtc1trZXk0XVxuXHRcdH1cblx0XHRyZXR1cm4gcGF0aC5zbGljZSgwLCBwYXRoRW5kKVxuXHR9XG5cdHZhciByb3V0ZXIgPSB7cHJlZml4OiBcIiMhXCJ9XG5cdHJvdXRlci5nZXRQYXRoID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHR5cGUyID0gcm91dGVyLnByZWZpeC5jaGFyQXQoMClcblx0XHRzd2l0Y2ggKHR5cGUyKSB7XG5cdFx0XHRjYXNlIFwiI1wiOiByZXR1cm4gbm9ybWFsaXplMShcImhhc2hcIikuc2xpY2Uocm91dGVyLnByZWZpeC5sZW5ndGgpXG5cdFx0XHRjYXNlIFwiP1wiOiByZXR1cm4gbm9ybWFsaXplMShcInNlYXJjaFwiKS5zbGljZShyb3V0ZXIucHJlZml4Lmxlbmd0aCkgKyBub3JtYWxpemUxKFwiaGFzaFwiKVxuXHRcdFx0ZGVmYXVsdDogcmV0dXJuIG5vcm1hbGl6ZTEoXCJwYXRobmFtZVwiKS5zbGljZShyb3V0ZXIucHJlZml4Lmxlbmd0aCkgKyBub3JtYWxpemUxKFwic2VhcmNoXCIpICsgbm9ybWFsaXplMShcImhhc2hcIilcblx0XHR9XG5cdH1cblx0cm91dGVyLnNldFBhdGggPSBmdW5jdGlvbihwYXRoLCBkYXRhLCBvcHRpb25zKSB7XG5cdFx0dmFyIHF1ZXJ5RGF0YSA9IHt9LCBoYXNoRGF0YSA9IHt9XG5cdFx0cGF0aCA9IHBhcnNlUGF0aChwYXRoLCBxdWVyeURhdGEsIGhhc2hEYXRhKVxuXHRcdGlmIChkYXRhICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGtleTQgaW4gZGF0YSkgcXVlcnlEYXRhW2tleTRdID0gZGF0YVtrZXk0XVxuXHRcdFx0cGF0aCA9IHBhdGgucmVwbGFjZSgvOihbXlxcL10rKS9nLCBmdW5jdGlvbihtYXRjaDIsIHRva2VuKSB7XG5cdFx0XHRcdGRlbGV0ZSBxdWVyeURhdGFbdG9rZW5dXG5cdFx0XHRcdHJldHVybiBkYXRhW3Rva2VuXVxuXHRcdFx0fSlcblx0XHR9XG5cdFx0dmFyIHF1ZXJ5ID0gYnVpbGRRdWVyeVN0cmluZyhxdWVyeURhdGEpXG5cdFx0aWYgKHF1ZXJ5KSBwYXRoICs9IFwiP1wiICsgcXVlcnlcblx0XHR2YXIgaGFzaCA9IGJ1aWxkUXVlcnlTdHJpbmcoaGFzaERhdGEpXG5cdFx0aWYgKGhhc2gpIHBhdGggKz0gXCIjXCIgKyBoYXNoXG5cdFx0aWYgKHN1cHBvcnRzUHVzaFN0YXRlKSB7XG5cdFx0XHR2YXIgc3RhdGUgPSBvcHRpb25zID8gb3B0aW9ucy5zdGF0ZSA6IG51bGxcblx0XHRcdHZhciB0aXRsZSA9IG9wdGlvbnMgPyBvcHRpb25zLnRpdGxlIDogbnVsbFxuXHRcdFx0JHdpbmRvdy5vbnBvcHN0YXRlKClcblx0XHRcdGlmIChvcHRpb25zICYmIG9wdGlvbnMucmVwbGFjZSkgJHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShzdGF0ZSwgdGl0bGUsIHJvdXRlci5wcmVmaXggKyBwYXRoKVxuXHRcdFx0ZWxzZSAkd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHN0YXRlLCB0aXRsZSwgcm91dGVyLnByZWZpeCArIHBhdGgpXG5cdFx0fVxuXHRcdGVsc2UgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcm91dGVyLnByZWZpeCArIHBhdGhcblx0fVxuXHRyb3V0ZXIuZGVmaW5lUm91dGVzID0gZnVuY3Rpb24ocm91dGVzLCByZXNvbHZlLCByZWplY3QpIHtcblx0XHRmdW5jdGlvbiByZXNvbHZlUm91dGUoKSB7XG5cdFx0XHR2YXIgcGF0aCA9IHJvdXRlci5nZXRQYXRoKClcblx0XHRcdHZhciBwYXJhbXMgPSB7fVxuXHRcdFx0dmFyIHBhdGhuYW1lID0gcGFyc2VQYXRoKHBhdGgsIHBhcmFtcywgcGFyYW1zKVxuXHRcdFx0dmFyIHN0YXRlID0gJHdpbmRvdy5oaXN0b3J5LnN0YXRlXG5cdFx0XHRpZiAoc3RhdGUgIT0gbnVsbCkge1xuXHRcdFx0XHRmb3IgKHZhciBrIGluIHN0YXRlKSBwYXJhbXNba10gPSBzdGF0ZVtrXVxuXHRcdFx0fVxuXHRcdFx0Zm9yICh2YXIgcm91dGUwIGluIHJvdXRlcykge1xuXHRcdFx0XHR2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXCJeXCIgKyByb3V0ZTAucmVwbGFjZSgvOlteXFwvXSs/XFwuezN9L2csIFwiKC4qPylcIikucmVwbGFjZSgvOlteXFwvXSsvZywgXCIoW15cXFxcL10rKVwiKSArIFwiXFwvPyRcIilcblx0XHRcdFx0aWYgKG1hdGNoZXIudGVzdChwYXRobmFtZSkpIHtcblx0XHRcdFx0XHRwYXRobmFtZS5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dmFyIGtleXMgPSByb3V0ZTAubWF0Y2goLzpbXlxcL10rL2cpIHx8IFtdXG5cdFx0XHRcdFx0XHR2YXIgdmFsdWVzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEsIC0yKVxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdHBhcmFtc1trZXlzW2ldLnJlcGxhY2UoLzp8XFwuL2csIFwiXCIpXSA9IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZXNbaV0pXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHJvdXRlc1tyb3V0ZTBdLCBwYXJhbXMsIHBhdGgsIHJvdXRlMClcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZWplY3QocGF0aCwgcGFyYW1zKVxuXHRcdH1cblx0XHRpZiAoc3VwcG9ydHNQdXNoU3RhdGUpICR3aW5kb3cub25wb3BzdGF0ZSA9IGRlYm91bmNlQXN5bmMocmVzb2x2ZVJvdXRlKVxuXHRcdGVsc2UgaWYgKHJvdXRlci5wcmVmaXguY2hhckF0KDApID09PSBcIiNcIikgJHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSByZXNvbHZlUm91dGVcblx0XHRyZXNvbHZlUm91dGUoKVxuXHR9XG5cdHJldHVybiByb3V0ZXJcbn1cbnZhciBfMjAgPSBmdW5jdGlvbigkd2luZG93LCByZWRyYXdTZXJ2aWNlMCkge1xuXHR2YXIgcm91dGVTZXJ2aWNlID0gY29yZVJvdXRlcigkd2luZG93KVxuXHR2YXIgaWRlbnRpdHkgPSBmdW5jdGlvbih2KSB7cmV0dXJuIHZ9XG5cdHZhciByZW5kZXIxLCBjb21wb25lbnQsIGF0dHJzMywgY3VycmVudFBhdGgsIGxhc3RVcGRhdGVcblx0dmFyIHJvdXRlID0gZnVuY3Rpb24ocm9vdCwgZGVmYXVsdFJvdXRlLCByb3V0ZXMpIHtcblx0XHRpZiAocm9vdCA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoXCJFbnN1cmUgdGhlIERPTSBlbGVtZW50IHRoYXQgd2FzIHBhc3NlZCB0byBgbS5yb3V0ZWAgaXMgbm90IHVuZGVmaW5lZFwiKVxuXHRcdHZhciBydW4xID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAocmVuZGVyMSAhPSBudWxsKSByZWRyYXdTZXJ2aWNlMC5yZW5kZXIocm9vdCwgcmVuZGVyMShWbm9kZShjb21wb25lbnQsIGF0dHJzMy5rZXksIGF0dHJzMykpKVxuXHRcdH1cblx0XHR2YXIgYmFpbCA9IGZ1bmN0aW9uKHBhdGgpIHtcblx0XHRcdGlmIChwYXRoICE9PSBkZWZhdWx0Um91dGUpIHJvdXRlU2VydmljZS5zZXRQYXRoKGRlZmF1bHRSb3V0ZSwgbnVsbCwge3JlcGxhY2U6IHRydWV9KVxuXHRcdFx0ZWxzZSB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgcmVzb2x2ZSBkZWZhdWx0IHJvdXRlIFwiICsgZGVmYXVsdFJvdXRlKVxuXHRcdH1cblx0XHRyb3V0ZVNlcnZpY2UuZGVmaW5lUm91dGVzKHJvdXRlcywgZnVuY3Rpb24ocGF5bG9hZCwgcGFyYW1zLCBwYXRoKSB7XG5cdFx0XHR2YXIgdXBkYXRlID0gbGFzdFVwZGF0ZSA9IGZ1bmN0aW9uKHJvdXRlUmVzb2x2ZXIsIGNvbXApIHtcblx0XHRcdFx0aWYgKHVwZGF0ZSAhPT0gbGFzdFVwZGF0ZSkgcmV0dXJuXG5cdFx0XHRcdGNvbXBvbmVudCA9IGNvbXAgIT0gbnVsbCAmJiAodHlwZW9mIGNvbXAudmlldyA9PT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBjb21wID09PSBcImZ1bmN0aW9uXCIpPyBjb21wIDogXCJkaXZcIlxuXHRcdFx0XHRhdHRyczMgPSBwYXJhbXMsIGN1cnJlbnRQYXRoID0gcGF0aCwgbGFzdFVwZGF0ZSA9IG51bGxcblx0XHRcdFx0cmVuZGVyMSA9IChyb3V0ZVJlc29sdmVyLnJlbmRlciB8fCBpZGVudGl0eSkuYmluZChyb3V0ZVJlc29sdmVyKVxuXHRcdFx0XHRydW4xKClcblx0XHRcdH1cblx0XHRcdGlmIChwYXlsb2FkLnZpZXcgfHwgdHlwZW9mIHBheWxvYWQgPT09IFwiZnVuY3Rpb25cIikgdXBkYXRlKHt9LCBwYXlsb2FkKVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmIChwYXlsb2FkLm9ubWF0Y2gpIHtcblx0XHRcdFx0XHRQcm9taXNlLnJlc29sdmUocGF5bG9hZC5vbm1hdGNoKHBhcmFtcywgcGF0aCkpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZWQpIHtcblx0XHRcdFx0XHRcdHVwZGF0ZShwYXlsb2FkLCByZXNvbHZlZClcblx0XHRcdFx0XHR9LCBiYWlsKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgdXBkYXRlKHBheWxvYWQsIFwiZGl2XCIpXG5cdFx0XHR9XG5cdFx0fSwgYmFpbClcblx0XHRyZWRyYXdTZXJ2aWNlMC5zdWJzY3JpYmUocm9vdCwgcnVuMSlcblx0fVxuXHRyb3V0ZS5zZXQgPSBmdW5jdGlvbihwYXRoLCBkYXRhLCBvcHRpb25zKSB7XG5cdFx0aWYgKGxhc3RVcGRhdGUgIT0gbnVsbCkgb3B0aW9ucyA9IHtyZXBsYWNlOiB0cnVlfVxuXHRcdGxhc3RVcGRhdGUgPSBudWxsXG5cdFx0cm91dGVTZXJ2aWNlLnNldFBhdGgocGF0aCwgZGF0YSwgb3B0aW9ucylcblx0fVxuXHRyb3V0ZS5nZXQgPSBmdW5jdGlvbigpIHtyZXR1cm4gY3VycmVudFBhdGh9XG5cdHJvdXRlLnByZWZpeCA9IGZ1bmN0aW9uKHByZWZpeDApIHtyb3V0ZVNlcnZpY2UucHJlZml4ID0gcHJlZml4MH1cblx0cm91dGUubGluayA9IGZ1bmN0aW9uKHZub2RlMSkge1xuXHRcdHZub2RlMS5kb20uc2V0QXR0cmlidXRlKFwiaHJlZlwiLCByb3V0ZVNlcnZpY2UucHJlZml4ICsgdm5vZGUxLmF0dHJzLmhyZWYpXG5cdFx0dm5vZGUxLmRvbS5vbmNsaWNrID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYgKGUuY3RybEtleSB8fCBlLm1ldGFLZXkgfHwgZS5zaGlmdEtleSB8fCBlLndoaWNoID09PSAyKSByZXR1cm5cblx0XHRcdGUucHJldmVudERlZmF1bHQoKVxuXHRcdFx0ZS5yZWRyYXcgPSBmYWxzZVxuXHRcdFx0dmFyIGhyZWYgPSB0aGlzLmdldEF0dHJpYnV0ZShcImhyZWZcIilcblx0XHRcdGlmIChocmVmLmluZGV4T2Yocm91dGVTZXJ2aWNlLnByZWZpeCkgPT09IDApIGhyZWYgPSBocmVmLnNsaWNlKHJvdXRlU2VydmljZS5wcmVmaXgubGVuZ3RoKVxuXHRcdFx0cm91dGUuc2V0KGhyZWYsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxuXHRcdH1cblx0fVxuXHRyb3V0ZS5wYXJhbSA9IGZ1bmN0aW9uKGtleTMpIHtcblx0XHRpZih0eXBlb2YgYXR0cnMzICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBrZXkzICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gYXR0cnMzW2tleTNdXG5cdFx0cmV0dXJuIGF0dHJzM1xuXHR9XG5cdHJldHVybiByb3V0ZVxufVxubS5yb3V0ZSA9IF8yMCh3aW5kb3csIHJlZHJhd1NlcnZpY2UpXG5tLndpdGhBdHRyID0gZnVuY3Rpb24oYXR0ck5hbWUsIGNhbGxiYWNrMSwgY29udGV4dCkge1xuXHRyZXR1cm4gZnVuY3Rpb24oZSkge1xuXHRcdGNhbGxiYWNrMS5jYWxsKGNvbnRleHQgfHwgdGhpcywgYXR0ck5hbWUgaW4gZS5jdXJyZW50VGFyZ2V0ID8gZS5jdXJyZW50VGFyZ2V0W2F0dHJOYW1lXSA6IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpKVxuXHR9XG59XG52YXIgXzI4ID0gY29yZVJlbmRlcmVyKHdpbmRvdylcbm0ucmVuZGVyID0gXzI4LnJlbmRlclxubS5yZWRyYXcgPSByZWRyYXdTZXJ2aWNlLnJlZHJhd1xubS5yZXF1ZXN0ID0gcmVxdWVzdFNlcnZpY2UucmVxdWVzdFxubS5qc29ucCA9IHJlcXVlc3RTZXJ2aWNlLmpzb25wXG5tLnBhcnNlUXVlcnlTdHJpbmcgPSBwYXJzZVF1ZXJ5U3RyaW5nXG5tLmJ1aWxkUXVlcnlTdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nXG5tLnZlcnNpb24gPSBcIjEuMS4xXCJcbm0udm5vZGUgPSBWbm9kZVxuaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpIG1vZHVsZVtcImV4cG9ydHNcIl0gPSBtXG5lbHNlIHdpbmRvdy5tID0gbVxufSgpKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L21pdGhyaWwvbWl0aHJpbC5qcyIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcbmltcG9ydCBNb2RlbCBmcm9tICcuL21vZGVsLmpzJztcblxuaW1wb3J0IHN0eWxlcyBmcm9tICcuL3N0eWxlcy5jc3MnO1xuXG5cbmNvbnN0IFVsID0ge1xuICB2aWV3OiB2bm9kZSA9PiB7XG4gICAgcmV0dXJuIDx1bCBjbGFzc05hbWU9J21kbC1saXN0Jz5cbiAgICAgIHt2bm9kZS5hdHRycy5pbm5lcn1cbiAgICA8L3VsPlxuICB9XG59O1xuXG5jb25zdCBMaSA9IHtcbiAgdmlldzogdm5vZGUgPT4ge1xuICAgIHJldHVybiA8bGkgY2xhc3NOYW1lPSdtZGwtbGlzdF9faXRlbSc+XG4gICAgICB7dm5vZGUuYXR0cnMuaW5uZXJ9XG4gICAgPC9saT5cbiAgfVxufTtcblxuY29uc3QgRGV0YWlscyA9IHtcbiAgdmlldzogdm5vZGUgID0+IHtcbiAgICByZXR1cm4gPGRldGFpbHM+XG4gICAgICA8c3VtbWFyeT57dm5vZGUuYXR0cnMuc3VtbWFyeX08L3N1bW1hcnk+XG4gICAgICB7dm5vZGUuYXR0cnMuaW5uZXJ9XG4gICAgPC9kZXRhaWxzPlxuICB9XG59O1xuXG5jb25zdCBZZWFyID0ge1xuICB2aWV3OiB2bm9kZSA9PiB7XG4gICAgY29uc3QgZGF0YSA9IHZub2RlLmF0dHJzLmRhdGE7XG4gICAgY29uc3QgaW5uZXIgPSBkYXRhLm1vbnRocy5tYXAoZCA9PiB7XG4gICAgICByZXR1cm4gPFVsIGlubmVyPXs8TGkgaW5uZXI9ezxNb250aCBkYXRhPXtkfSAvPn0gLz59IC8+XG4gICAgfSk7XG4gICAgcmV0dXJuIDxkaXYgaWQ9e2RhdGEueWVhcn0+XG4gICAgICA8RGV0YWlscyBzdW1tYXJ5PXtgJHtkYXRhLnllYXJ95bm0YH0gaW5uZXI9e2lubmVyfSAvPlxuICAgIDwvZGl2PlxuICB9XG59O1xuXG5jb25zdCBNb250aCA9IHtcbiAgdmlldzogdm5vZGUgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSB2bm9kZS5hdHRycy5kYXRhO1xuICAgIGNvbnN0IGlubmVyID0gZGF0YS5kYXlzLm1hcChkID0+IHtcbiAgICAgIHJldHVybiA8VWwgaW5uZXI9ezxMaSBpbm5lcj17PERheSBkYXRhPXtkfSAvPn0gLz59IC8+XG4gICAgfSk7XG4gICAgcmV0dXJuIDxkaXYgaWQ9e2RhdGEubW9udGh9PlxuICAgICAgPERldGFpbHMgc3VtbWFyeT17YCR7ZGF0YS5tb250aH3mnIhgfSBpbm5lcj17aW5uZXJ9IC8+XG4gICAgPC9kaXY+XG4gIH1cbn07XG5cbmNvbnN0IERheSA9IHtcbiAgdmlldzogdm5vZGUgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSB2bm9kZS5hdHRycy5kYXRhO1xuICAgIGNvbnN0IGlubmVyID0gPHNwYW4+XG4gICAgICB7YCR7ZGF0YS5kYXl95pelIGB9XG4gICAgICA8YSBocmVmPXtgL2FydGljbGUvJHtkYXRhLmlkfX1gfT5cbiAgICAgICAge2RhdGEudGl0bGV9XG4gICAgICA8L2E+XG4gICAgPC9zcGFuPlxuICAgIHJldHVybiA8TGkgaW5uZXI9e2lubmVyfSAvPlxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG9uaW5pdDogdm5vZGUgPT4ge1xuICAgIE1vZGVsLmZldGNoKCk7XG4gICAgdm5vZGUuc3RhdGUuYXJ0aWNsZUluZGV4ID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIE1vZGVsLmRhdGEubWFwKGQgPT4ge1xuICAgICAgICByZXR1cm4gPFVsIGlubmVyPXs8TGkgaW5uZXI9ezxZZWFyIGRhdGE9e2R9IC8+fSAvPn0gLz5cbiAgICAgIH0pO1xuICAgIH07XG4gIH0sXG4gIHZpZXc6IHZub2RlID0+IHtcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9J21kbC1ncmlkJz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdtZGwtY2VsbC0tMS1vZmZzZXQnIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbWRsLWNlbGwgbWRsLWNlbGwtLTEwLWNvbCc+XG4gICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgIGlmICghTW9kZWwuZmV0Y2hlZCkge1xuICAgICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdtZGwtc3Bpbm5lciBtZGwtanMtc3Bpbm5lciBpcy1hY3RpdmUnPjwvZGl2PlxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gPFVsIGlubmVyPXt2bm9kZS5zdGF0ZS5hcnRpY2xlSW5kZXgoKX0gLz5cbiAgICAgICAgfSkoKX1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9J21kbC1jZWxsLS0xLW9mZnNldCcgLz5cbiAgICA8L2Rpdj5cbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY29tcG9uZW50LmpzIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi9jb21wb25lbnQuanMnO1xuXG5cbm0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKSwgQ29tcG9uZW50KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2VudHJ5LmpzIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmNvbnN0IE1vZGVsID0ge1xuICBkYXRhOiBbXSxcbiAgZmV0Y2hlZDogZmFsc2UsXG4gIGZldGNoOiAoKSA9PiB7XG4gICAgcmV0dXJuIG0ucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL2FwaS9hcnRpY2xlcycsXG4gICAgfSkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBNb2RlbC5mZXRjaGVkID0gdHJ1ZTtcbiAgICAgIE1vZGVsLmRhdGEgPSByZXNwb25zZTtcbiAgICB9KTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgTW9kZWxcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL21vZGVsLmpzIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gcGxhY2VIb2xkZXJzQ291bnQgKGI2NCkge1xuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcbiAgLy8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuICAvLyByZXByZXNlbnQgb25lIGJ5dGVcbiAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG4gIC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2VcbiAgcmV0dXJuIGI2NFtsZW4gLSAyXSA9PT0gJz0nID8gMiA6IGI2NFtsZW4gLSAxXSA9PT0gJz0nID8gMSA6IDBcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuICByZXR1cm4gYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzQ291bnQoYjY0KVxufVxuXG5mdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG4gIHBsYWNlSG9sZGVycyA9IHBsYWNlSG9sZGVyc0NvdW50KGI2NClcblxuICBhcnIgPSBuZXcgQXJyKGxlbiAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgbCA9IHBsYWNlSG9sZGVycyA+IDAgPyBsZW4gLSA0IDogbGVuXG5cbiAgdmFyIEwgPSAwXG5cbiAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfCByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltMKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICsgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICsgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gKyBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgb3V0cHV0ID0gJydcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz09J1xuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMTBdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPSdcbiAgfVxuXG4gIHBhcnRzLnB1c2gob3V0cHV0KVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9iYXNlNjQtanMvaW5kZXguanMiLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuXG4ndXNlIHN0cmljdCdcblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxudmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuLypcbiAqIEV4cG9ydCBrTWF4TGVuZ3RoIGFmdGVyIHR5cGVkIGFycmF5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZC5cbiAqL1xuZXhwb3J0cy5rTWF4TGVuZ3RoID0ga01heExlbmd0aCgpXG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMSlcbiAgICBhcnIuX19wcm90b19fID0ge19fcHJvdG9fXzogVWludDhBcnJheS5wcm90b3R5cGUsIGZvbzogZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfX1cbiAgICByZXR1cm4gYXJyLmZvbygpID09PSA0MiAmJiAvLyB0eXBlZCBhcnJheSBpbnN0YW5jZXMgY2FuIGJlIGF1Z21lbnRlZFxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nICYmIC8vIGNocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICAgICAgICBhcnIuc3ViYXJyYXkoMSwgMSkuYnl0ZUxlbmd0aCA9PT0gMCAvLyBpZTEwIGhhcyBicm9rZW4gYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24ga01heExlbmd0aCAoKSB7XG4gIHJldHVybiBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVFxuICAgID8gMHg3ZmZmZmZmZlxuICAgIDogMHgzZmZmZmZmZlxufVxuXG5mdW5jdGlvbiBjcmVhdGVCdWZmZXIgKHRoYXQsIGxlbmd0aCkge1xuICBpZiAoa01heExlbmd0aCgpIDwgbGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgdHlwZWQgYXJyYXkgbGVuZ3RoJylcbiAgfVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoKVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICBpZiAodGhhdCA9PT0gbnVsbCkge1xuICAgICAgdGhhdCA9IG5ldyBCdWZmZXIobGVuZ3RoKVxuICAgIH1cbiAgICB0aGF0Lmxlbmd0aCA9IGxlbmd0aFxuICB9XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5mdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0lmIGVuY29kaW5nIGlzIHNwZWNpZmllZCB0aGVuIHRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUodGhpcywgYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKHRoaXMsIGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuLy8gVE9ETzogTGVnYWN5LCBub3QgbmVlZGVkIGFueW1vcmUuIFJlbW92ZSBpbiBuZXh0IG1ham9yIHZlcnNpb24uXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gZnJvbSAodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIHJldHVybiBmcm9tT2JqZWN0KHRoYXQsIHZhbHVlKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKG51bGwsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbmlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICBCdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG4gIEJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgICAgQnVmZmVyW1N5bWJvbC5zcGVjaWVzXSA9PT0gQnVmZmVyKSB7XG4gICAgLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgICAgdmFsdWU6IG51bGwsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG5lZ2F0aXZlJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAodGhhdCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2MobnVsbCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlICh0aGF0LCBzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgKytpKSB7XG4gICAgICB0aGF0W2ldID0gMFxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHRoYXQsIHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJlbmNvZGluZ1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgZW5jb2RpbmcnKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICB0aGF0ID0gdGhhdC5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGFycmF5LmJ5dGVMZW5ndGggLy8gdGhpcyB0aHJvd3MgaWYgYGFycmF5YCBpcyBub3QgYSB2YWxpZCBBcnJheUJ1ZmZlclxuXG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdvZmZzZXRcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ2xlbmd0aFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gYXJyYXlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21BcnJheUxpa2UodGhhdCwgYXJyYXkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIob2JqKSkge1xuICAgIHZhciBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuKVxuXG4gICAgaWYgKHRoYXQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhhdFxuICAgIH1cblxuICAgIG9iai5jb3B5KHRoYXQsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gdGhhdFxuICB9XG5cbiAgaWYgKG9iaikge1xuICAgIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICBvYmouYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHx8ICdsZW5ndGgnIGluIG9iaikge1xuICAgICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBpc25hbihvYmoubGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIDApXG4gICAgICB9XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh0aGF0LCBvYmopXG4gICAgfVxuXG4gICAgaWYgKG9iai50eXBlID09PSAnQnVmZmVyJyAmJiBpc0FycmF5KG9iai5kYXRhKSkge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqLmRhdGEpXG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksIG9yIGFycmF5LWxpa2Ugb2JqZWN0LicpXG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBrTWF4TGVuZ3RoKClgIGhlcmUgYmVjYXVzZSB0aGF0IGZhaWxzIHdoZW5cbiAgLy8gbGVuZ3RoIGlzIE5hTiAod2hpY2ggaXMgb3RoZXJ3aXNlIGNvZXJjZWQgdG8gemVyby4pXG4gIGlmIChsZW5ndGggPj0ga01heExlbmd0aCgpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gYWxsb2NhdGUgQnVmZmVyIGxhcmdlciB0aGFuIG1heGltdW0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3NpemU6IDB4JyArIGtNYXhMZW5ndGgoKS50b1N0cmluZygxNikgKyAnIGJ5dGVzJylcbiAgfVxuICByZXR1cm4gbGVuZ3RoIHwgMFxufVxuXG5mdW5jdGlvbiBTbG93QnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKCtsZW5ndGggIT0gbGVuZ3RoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZXFlcWVxXG4gICAgbGVuZ3RoID0gMFxuICB9XG4gIHJldHVybiBCdWZmZXIuYWxsb2MoK2xlbmd0aClcbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIgKGIpIHtcbiAgcmV0dXJuICEhKGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIWlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gICAgfVxuICAgIGJ1Zi5jb3B5KGJ1ZmZlciwgcG9zKVxuICAgIHBvcyArPSBidWYubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoc3RyaW5nKSkge1xuICAgIHJldHVybiBzdHJpbmcubGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldyA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgKEFycmF5QnVmZmVyLmlzVmlldyhzdHJpbmcpIHx8IHN0cmluZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSkge1xuICAgIHJldHVybiBzdHJpbmcuYnl0ZUxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHN0cmluZyA9ICcnICsgc3RyaW5nXG4gIH1cblxuICB2YXIgbGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAobGVuID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIFVzZSBhIGZvciBsb29wIHRvIGF2b2lkIHJlY3Vyc2lvblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICAvLyBObyBuZWVkIHRvIHZlcmlmeSB0aGF0IFwidGhpcy5sZW5ndGggPD0gTUFYX1VJTlQzMlwiIHNpbmNlIGl0J3MgYSByZWFkLW9ubHlcbiAgLy8gcHJvcGVydHkgb2YgYSB0eXBlZCBhcnJheS5cblxuICAvLyBUaGlzIGJlaGF2ZXMgbmVpdGhlciBsaWtlIFN0cmluZyBub3IgVWludDhBcnJheSBpbiB0aGF0IHdlIHNldCBzdGFydC9lbmRcbiAgLy8gdG8gdGhlaXIgdXBwZXIvbG93ZXIgYm91bmRzIGlmIHRoZSB2YWx1ZSBwYXNzZWQgaXMgb3V0IG9mIHJhbmdlLlxuICAvLyB1bmRlZmluZWQgaXMgaGFuZGxlZCBzcGVjaWFsbHkgYXMgcGVyIEVDTUEtMjYyIDZ0aCBFZGl0aW9uLFxuICAvLyBTZWN0aW9uIDEzLjMuMy43IFJ1bnRpbWUgU2VtYW50aWNzOiBLZXllZEJpbmRpbmdJbml0aWFsaXphdGlvbi5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgLy8gUmV0dXJuIGVhcmx5IGlmIHN0YXJ0ID4gdGhpcy5sZW5ndGguIERvbmUgaGVyZSB0byBwcmV2ZW50IHBvdGVudGlhbCB1aW50MzJcbiAgLy8gY29lcmNpb24gZmFpbCBiZWxvdy5cbiAgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoZW5kIDw9IDApIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIC8vIEZvcmNlIGNvZXJzaW9uIHRvIHVpbnQzMi4gVGhpcyB3aWxsIGFsc28gY29lcmNlIGZhbHNleS9OYU4gdmFsdWVzIHRvIDAuXG4gIGVuZCA+Pj49IDBcbiAgc3RhcnQgPj4+PSAwXG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIFRoZSBwcm9wZXJ0eSBpcyB1c2VkIGJ5IGBCdWZmZXIuaXNCdWZmZXJgIGFuZCBgaXMtYnVmZmVyYCAoaW4gU2FmYXJpIDUtNykgdG8gZGV0ZWN0XG4vLyBCdWZmZXIgaW5zdGFuY2VzLlxuQnVmZmVyLnByb3RvdHlwZS5faXNCdWZmZXIgPSB0cnVlXG5cbmZ1bmN0aW9uIHN3YXAgKGIsIG4sIG0pIHtcbiAgdmFyIGkgPSBiW25dXG4gIGJbbl0gPSBiW21dXG4gIGJbbV0gPSBpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDE2ID0gZnVuY3Rpb24gc3dhcDE2ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAzMiA9IGZ1bmN0aW9uIHN3YXAzMiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgNCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDMpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDIpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwNjQgPSBmdW5jdGlvbiBzd2FwNjQgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDggIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDY0LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDgpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyA3KVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyA2KVxuICAgIHN3YXAodGhpcywgaSArIDIsIGkgKyA1KVxuICAgIHN3YXAodGhpcywgaSArIDMsIGkgKyA0KVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCB8IDBcbiAgaWYgKGxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHNsb3dUb1N0cmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzIChiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTXG4gIGlmICh0aGlzLmxlbmd0aCA+IDApIHtcbiAgICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLm1hdGNoKC8uezJ9L2cpLmpvaW4oJyAnKVxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIHN0ciArICc+J1xufVxuXG5CdWZmZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlICh0YXJnZXQsIHN0YXJ0LCBlbmQsIHRoaXNTdGFydCwgdGhpc0VuZCkge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIH1cblxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHRhcmdldCA/IHRhcmdldC5sZW5ndGggOiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1N0YXJ0ID0gMFxuICB9XG4gIGlmICh0aGlzRW5kID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzRW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChzdGFydCA8IDAgfHwgZW5kID4gdGFyZ2V0Lmxlbmd0aCB8fCB0aGlzU3RhcnQgPCAwIHx8IHRoaXNFbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdvdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kICYmIHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kKSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cbiAgaWYgKHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAxXG4gIH1cblxuICBzdGFydCA+Pj49IDBcbiAgZW5kID4+Pj0gMFxuICB0aGlzU3RhcnQgPj4+PSAwXG4gIHRoaXNFbmQgPj4+PSAwXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCkgcmV0dXJuIDBcblxuICB2YXIgeCA9IHRoaXNFbmQgLSB0aGlzU3RhcnRcbiAgdmFyIHkgPSBlbmQgLSBzdGFydFxuICB2YXIgbGVuID0gTWF0aC5taW4oeCwgeSlcblxuICB2YXIgdGhpc0NvcHkgPSB0aGlzLnNsaWNlKHRoaXNTdGFydCwgdGhpc0VuZClcbiAgdmFyIHRhcmdldENvcHkgPSB0YXJnZXQuc2xpY2Uoc3RhcnQsIGVuZClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKHRoaXNDb3B5W2ldICE9PSB0YXJnZXRDb3B5W2ldKSB7XG4gICAgICB4ID0gdGhpc0NvcHlbaV1cbiAgICAgIHkgPSB0YXJnZXRDb3B5W2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuLy8gRmluZHMgZWl0aGVyIHRoZSBmaXJzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPj0gYGJ5dGVPZmZzZXRgLFxuLy8gT1IgdGhlIGxhc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0IDw9IGBieXRlT2Zmc2V0YC5cbi8vXG4vLyBBcmd1bWVudHM6XG4vLyAtIGJ1ZmZlciAtIGEgQnVmZmVyIHRvIHNlYXJjaFxuLy8gLSB2YWwgLSBhIHN0cmluZywgQnVmZmVyLCBvciBudW1iZXJcbi8vIC0gYnl0ZU9mZnNldCAtIGFuIGluZGV4IGludG8gYGJ1ZmZlcmA7IHdpbGwgYmUgY2xhbXBlZCB0byBhbiBpbnQzMlxuLy8gLSBlbmNvZGluZyAtIGFuIG9wdGlvbmFsIGVuY29kaW5nLCByZWxldmFudCBpcyB2YWwgaXMgYSBzdHJpbmdcbi8vIC0gZGlyIC0gdHJ1ZSBmb3IgaW5kZXhPZiwgZmFsc2UgZm9yIGxhc3RJbmRleE9mXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsSW5kZXhPZiAoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgLy8gRW1wdHkgYnVmZmVyIG1lYW5zIG5vIG1hdGNoXG4gIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSByZXR1cm4gLTFcblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldFxuICBpZiAodHlwZW9mIGJ5dGVPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBieXRlT2Zmc2V0XG4gICAgYnl0ZU9mZnNldCA9IDBcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikge1xuICAgIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSB7XG4gICAgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIH1cbiAgYnl0ZU9mZnNldCA9ICtieXRlT2Zmc2V0ICAvLyBDb2VyY2UgdG8gTnVtYmVyLlxuICBpZiAoaXNOYU4oYnl0ZU9mZnNldCkpIHtcbiAgICAvLyBieXRlT2Zmc2V0OiBpdCBpdCdzIHVuZGVmaW5lZCwgbnVsbCwgTmFOLCBcImZvb1wiLCBldGMsIHNlYXJjaCB3aG9sZSBidWZmZXJcbiAgICBieXRlT2Zmc2V0ID0gZGlyID8gMCA6IChidWZmZXIubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0OiBuZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggKyBieXRlT2Zmc2V0XG4gIGlmIChieXRlT2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBpZiAoZGlyKSByZXR1cm4gLTFcbiAgICBlbHNlIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoIC0gMVxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAwKSB7XG4gICAgaWYgKGRpcikgYnl0ZU9mZnNldCA9IDBcbiAgICBlbHNlIHJldHVybiAtMVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIHZhbFxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgLy8gRmluYWxseSwgc2VhcmNoIGVpdGhlciBpbmRleE9mIChpZiBkaXIgaXMgdHJ1ZSkgb3IgbGFzdEluZGV4T2ZcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJlxuICAgICAgICB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKHN0ckxlbiAlIDIgIT09IDApIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBsYXRpbjFXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCB8IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICAvLyBsZWdhY3kgd3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpIC0gcmVtb3ZlIGluIHYwLjEzXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERikgPyAzXG4gICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2kgKyAxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47ICsraSkge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJ1ZmZlclwiIGFyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlVUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVVSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDIpOyBpIDwgajsgKytpKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCA0KTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSAwXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSAtIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSArIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4N2YsIC0weDgwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5mdW5jdGlvbiBjaGVja0lFRUU3NTQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuZnVuY3Rpb24gd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA0LCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiB3cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoZW5kIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCArIHN0YXJ0XG4gIH1cblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcbiAgdmFyIGlcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHN0YXJ0IDwgdGFyZ2V0U3RhcnQgJiYgdGFyZ2V0U3RhcnQgPCBlbmQpIHtcbiAgICAvLyBkZXNjZW5kaW5nIGNvcHkgZnJvbSBlbmRcbiAgICBmb3IgKGkgPSBsZW4gLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSBpZiAobGVuIDwgMTAwMCB8fCAhQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBhc2NlbmRpbmcgY29weSBmcm9tIHN0YXJ0XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBVaW50OEFycmF5LnByb3RvdHlwZS5zZXQuY2FsbChcbiAgICAgIHRhcmdldCxcbiAgICAgIHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSxcbiAgICAgIHRhcmdldFN0YXJ0XG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIGxlblxufVxuXG4vLyBVc2FnZTpcbi8vICAgIGJ1ZmZlci5maWxsKG51bWJlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoYnVmZmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChzdHJpbmdbLCBvZmZzZXRbLCBlbmRdXVssIGVuY29kaW5nXSlcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uIGZpbGwgKHZhbCwgc3RhcnQsIGVuZCwgZW5jb2RpbmcpIHtcbiAgLy8gSGFuZGxlIHN0cmluZyBjYXNlczpcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHR5cGVvZiBzdGFydCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gc3RhcnRcbiAgICAgIHN0YXJ0ID0gMFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbmQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IGVuZFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9XG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciBjb2RlID0gdmFsLmNoYXJDb2RlQXQoMClcbiAgICAgIGlmIChjb2RlIDwgMjU2KSB7XG4gICAgICAgIHZhbCA9IGNvZGVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZW5jb2RpbmcgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnICYmICFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAyNTVcbiAgfVxuXG4gIC8vIEludmFsaWQgcmFuZ2VzIGFyZSBub3Qgc2V0IHRvIGEgZGVmYXVsdCwgc28gY2FuIHJhbmdlIGNoZWNrIGVhcmx5LlxuICBpZiAoc3RhcnQgPCAwIHx8IHRoaXMubGVuZ3RoIDwgc3RhcnQgfHwgdGhpcy5sZW5ndGggPCBlbmQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignT3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgc3RhcnQgPSBzdGFydCA+Pj4gMFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHRoaXMubGVuZ3RoIDogZW5kID4+PiAwXG5cbiAgaWYgKCF2YWwpIHZhbCA9IDBcblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgICB0aGlzW2ldID0gdmFsXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBieXRlcyA9IEJ1ZmZlci5pc0J1ZmZlcih2YWwpXG4gICAgICA/IHZhbFxuICAgICAgOiB1dGY4VG9CeXRlcyhuZXcgQnVmZmVyKHZhbCwgZW5jb2RpbmcpLnRvU3RyaW5nKCkpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGZvciAoaSA9IDA7IGkgPCBlbmQgLSBzdGFydDsgKytpKSB7XG4gICAgICB0aGlzW2kgKyBzdGFydF0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxudmFyIElOVkFMSURfQkFTRTY0X1JFID0gL1teK1xcLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0cmluZ3RyaW0oc3RyKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCAnJylcbiAgLy8gTm9kZSBjb252ZXJ0cyBzdHJpbmdzIHdpdGggbGVuZ3RoIDwgMiB0byAnJ1xuICBpZiAoc3RyLmxlbmd0aCA8IDIpIHJldHVybiAnJ1xuICAvLyBOb2RlIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBiYXNlNjQgc3RyaW5ncyAobWlzc2luZyB0cmFpbGluZyA9PT0pLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgd2hpbGUgKHN0ci5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgc3RyID0gc3RyICsgJz0nXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHJpbmcsIHVuaXRzKSB7XG4gIHVuaXRzID0gdW5pdHMgfHwgSW5maW5pdHlcbiAgdmFyIGNvZGVQb2ludFxuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuICB2YXIgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcbiAgdmFyIGJ5dGVzID0gW11cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29kZVBvaW50ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcblxuICAgIC8vIGlzIHN1cnJvZ2F0ZSBjb21wb25lbnRcbiAgICBpZiAoY29kZVBvaW50ID4gMHhEN0ZGICYmIGNvZGVQb2ludCA8IDB4RTAwMCkge1xuICAgICAgLy8gbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICghbGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgICAvLyBubyBsZWFkIHlldFxuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhEQkZGKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCB0cmFpbFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIC8vIHVucGFpcmVkIGxlYWRcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWQgbGVhZFxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gMiBsZWFkcyBpbiBhIHJvd1xuICAgICAgaWYgKGNvZGVQb2ludCA8IDB4REMwMCkge1xuICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyB2YWxpZCBzdXJyb2dhdGUgcGFpclxuICAgICAgY29kZVBvaW50ID0gKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDAgPDwgMTAgfCBjb2RlUG9pbnQgLSAweERDMDApICsgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0ciwgdW5pdHMpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcblxuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NGNsZWFuKHN0cikpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGlzbmFuICh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gdmFsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VsZi1jb21wYXJlXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L2J1ZmZlci9pbmRleC5qcyIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuICB2YXIgYmFzZTY0ID0gbmV3IEJ1ZmZlcihKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKS50b1N0cmluZygnYmFzZTY0Jyk7XG4gIHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cbiAgcmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vaWVlZTc1NC9pbmRleC5qcyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9pc2FycmF5L2luZGV4LmpzIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vcHJvY2Vzcy9icm93c2VyLmpzIiwiKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKGdsb2JhbC5zZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXh0SGFuZGxlID0gMTsgLy8gU3BlYyBzYXlzIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgdmFyIHRhc2tzQnlIYW5kbGUgPSB7fTtcbiAgICB2YXIgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgdmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbiAgICB2YXIgcmVnaXN0ZXJJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbiAgICAgIC8vIENhbGxiYWNrIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiBvciBhIHN0cmluZ1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uKFwiXCIgKyBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICAvLyBDb3B5IGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XG4gICAgICB9XG4gICAgICAvLyBTdG9yZSBhbmQgcmVnaXN0ZXIgdGhlIHRhc2tcbiAgICAgIHZhciB0YXNrID0geyBjYWxsYmFjazogY2FsbGJhY2ssIGFyZ3M6IGFyZ3MgfTtcbiAgICAgIHRhc2tzQnlIYW5kbGVbbmV4dEhhbmRsZV0gPSB0YXNrO1xuICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUobmV4dEhhbmRsZSk7XG4gICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIHZhciBhcmdzID0gdGFzay5hcmdzO1xuICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGUpIHtcbiAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ0FUYXNrKSB7XG4gICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcnVuKHRhc2spO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1bklmUHJlc2VudChoYW5kbGUpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcbiAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgICAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhbid0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2VcbiAgICAgICAgLy8gKiBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9jb21tcy5odG1sI2Nyb3NzRG9jdW1lbnRNZXNzYWdlc1xuXG4gICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG4gICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoK2V2ZW50LmRhdGEuc2xpY2UobWVzc2FnZVByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShtZXNzYWdlUHJlZml4ICsgaGFuZGxlLCBcIipcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSWYgc3VwcG9ydGVkLCB3ZSBzaG91bGQgYXR0YWNoIHRvIHRoZSBwcm90b3R5cGUgb2YgZ2xvYmFsLCBzaW5jZSB0aGF0IGlzIHdoZXJlIHNldFRpbWVvdXQgZXQgYWwuIGxpdmUuXG4gICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG4gICAgLy8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBlLmcuIGJyb3dzZXJpZnkgZW52aXJvbm1lbnRzLlxuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuICAgICAgICBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG4gICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG4gICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG4gICAgICAgIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG4gICAgICAgIC8vIEZvciBJRSA24oCTOFxuICAgICAgICBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpO1xuICAgIH1cblxuICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICBhdHRhY2hUby5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xufSh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIiA/IHR5cGVvZiBnbG9iYWwgPT09IFwidW5kZWZpbmVkXCIgPyB0aGlzIDogZ2xvYmFsIDogc2VsZikpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzIiwiXG4vKipcbiAqIFdoZW4gc291cmNlIG1hcHMgYXJlIGVuYWJsZWQsIGBzdHlsZS1sb2FkZXJgIHVzZXMgYSBsaW5rIGVsZW1lbnQgd2l0aCBhIGRhdGEtdXJpIHRvXG4gKiBlbWJlZCB0aGUgY3NzIG9uIHRoZSBwYWdlLiBUaGlzIGJyZWFrcyBhbGwgcmVsYXRpdmUgdXJscyBiZWNhdXNlIG5vdyB0aGV5IGFyZSByZWxhdGl2ZSB0byBhXG4gKiBidW5kbGUgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBwYWdlLlxuICpcbiAqIE9uZSBzb2x1dGlvbiBpcyB0byBvbmx5IHVzZSBmdWxsIHVybHMsIGJ1dCB0aGF0IG1heSBiZSBpbXBvc3NpYmxlLlxuICpcbiAqIEluc3RlYWQsIHRoaXMgZnVuY3Rpb24gXCJmaXhlc1wiIHRoZSByZWxhdGl2ZSB1cmxzIHRvIGJlIGFic29sdXRlIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBwYWdlIGxvY2F0aW9uLlxuICpcbiAqIEEgcnVkaW1lbnRhcnkgdGVzdCBzdWl0ZSBpcyBsb2NhdGVkIGF0IGB0ZXN0L2ZpeFVybHMuanNgIGFuZCBjYW4gYmUgcnVuIHZpYSB0aGUgYG5wbSB0ZXN0YCBjb21tYW5kLlxuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MpIHtcbiAgLy8gZ2V0IGN1cnJlbnQgbG9jYXRpb25cbiAgdmFyIGxvY2F0aW9uID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cubG9jYXRpb247XG5cbiAgaWYgKCFsb2NhdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpeFVybHMgcmVxdWlyZXMgd2luZG93LmxvY2F0aW9uXCIpO1xuICB9XG5cblx0Ly8gYmxhbmsgb3IgbnVsbD9cblx0aWYgKCFjc3MgfHwgdHlwZW9mIGNzcyAhPT0gXCJzdHJpbmdcIikge1xuXHQgIHJldHVybiBjc3M7XG4gIH1cblxuICB2YXIgYmFzZVVybCA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdDtcbiAgdmFyIGN1cnJlbnREaXIgPSBiYXNlVXJsICsgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvW15cXC9dKiQvLCBcIi9cIik7XG5cblx0Ly8gY29udmVydCBlYWNoIHVybCguLi4pXG5cdC8qXG5cdFRoaXMgcmVndWxhciBleHByZXNzaW9uIGlzIGp1c3QgYSB3YXkgdG8gcmVjdXJzaXZlbHkgbWF0Y2ggYnJhY2tldHMgd2l0aGluXG5cdGEgc3RyaW5nLlxuXG5cdCAvdXJsXFxzKlxcKCAgPSBNYXRjaCBvbiB0aGUgd29yZCBcInVybFwiIHdpdGggYW55IHdoaXRlc3BhY2UgYWZ0ZXIgaXQgYW5kIHRoZW4gYSBwYXJlbnNcblx0ICAgKCAgPSBTdGFydCBhIGNhcHR1cmluZyBncm91cFxuXHQgICAgICg/OiAgPSBTdGFydCBhIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAgICAgW14pKF0gID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICg/OiAgPSBTdGFydCBhbm90aGVyIG5vbi1jYXB0dXJpbmcgZ3JvdXBzXG5cdCAgICAgICAgICAgICAgICAgW14pKF0rICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgICAgICBbXikoXSogID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgXFwpICA9IE1hdGNoIGEgZW5kIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICApICA9IEVuZCBHcm91cFxuICAgICAgICAgICAgICAqXFwpID0gTWF0Y2ggYW55dGhpbmcgYW5kIHRoZW4gYSBjbG9zZSBwYXJlbnNcbiAgICAgICAgICApICA9IENsb3NlIG5vbi1jYXB0dXJpbmcgZ3JvdXBcbiAgICAgICAgICAqICA9IE1hdGNoIGFueXRoaW5nXG4gICAgICAgKSAgPSBDbG9zZSBjYXB0dXJpbmcgZ3JvdXBcblx0IFxcKSAgPSBNYXRjaCBhIGNsb3NlIHBhcmVuc1xuXG5cdCAvZ2kgID0gR2V0IGFsbCBtYXRjaGVzLCBub3QgdGhlIGZpcnN0LiAgQmUgY2FzZSBpbnNlbnNpdGl2ZS5cblx0ICovXG5cdHZhciBmaXhlZENzcyA9IGNzcy5yZXBsYWNlKC91cmxcXHMqXFwoKCg/OlteKShdfFxcKCg/OlteKShdK3xcXChbXikoXSpcXCkpKlxcKSkqKVxcKS9naSwgZnVuY3Rpb24oZnVsbE1hdGNoLCBvcmlnVXJsKSB7XG5cdFx0Ly8gc3RyaXAgcXVvdGVzIChpZiB0aGV5IGV4aXN0KVxuXHRcdHZhciB1bnF1b3RlZE9yaWdVcmwgPSBvcmlnVXJsXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXlwiKC4qKVwiJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KVxuXHRcdFx0LnJlcGxhY2UoL14nKC4qKSckLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pO1xuXG5cdFx0Ly8gYWxyZWFkeSBhIGZ1bGwgdXJsPyBubyBjaGFuZ2Vcblx0XHRpZiAoL14oI3xkYXRhOnxodHRwOlxcL1xcL3xodHRwczpcXC9cXC98ZmlsZTpcXC9cXC9cXC8pL2kudGVzdCh1bnF1b3RlZE9yaWdVcmwpKSB7XG5cdFx0ICByZXR1cm4gZnVsbE1hdGNoO1xuXHRcdH1cblxuXHRcdC8vIGNvbnZlcnQgdGhlIHVybCB0byBhIGZ1bGwgdXJsXG5cdFx0dmFyIG5ld1VybDtcblxuXHRcdGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi8vXCIpID09PSAwKSB7XG5cdFx0ICBcdC8vVE9ETzogc2hvdWxkIHdlIGFkZCBwcm90b2NvbD9cblx0XHRcdG5ld1VybCA9IHVucXVvdGVkT3JpZ1VybDtcblx0XHR9IGVsc2UgaWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgdXJsXG5cdFx0XHRuZXdVcmwgPSBiYXNlVXJsICsgdW5xdW90ZWRPcmlnVXJsOyAvLyBhbHJlYWR5IHN0YXJ0cyB3aXRoICcvJ1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byBjdXJyZW50IGRpcmVjdG9yeVxuXHRcdFx0bmV3VXJsID0gY3VycmVudERpciArIHVucXVvdGVkT3JpZ1VybC5yZXBsYWNlKC9eXFwuXFwvLywgXCJcIik7IC8vIFN0cmlwIGxlYWRpbmcgJy4vJ1xuXHRcdH1cblxuXHRcdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgdXJsKC4uLilcblx0XHRyZXR1cm4gXCJ1cmwoXCIgKyBKU09OLnN0cmluZ2lmeShuZXdVcmwpICsgXCIpXCI7XG5cdH0pO1xuXG5cdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgY3NzXG5cdHJldHVybiBmaXhlZENzcztcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L3N0eWxlLWxvYWRlci9maXhVcmxzLmpzIiwidmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xuXG4vLyBET00gQVBJcywgZm9yIGNvbXBsZXRlbmVzc1xuXG5leHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhclRpbWVvdXQpO1xufTtcbmV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG59O1xuZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkge1xuICBpZiAodGltZW91dCkge1xuICAgIHRpbWVvdXQuY2xvc2UoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuICB0aGlzLl9pZCA9IGlkO1xuICB0aGlzLl9jbGVhckZuID0gY2xlYXJGbjtcbn1cblRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblRpbWVvdXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csIHRoaXMuX2lkKTtcbn07XG5cbi8vIERvZXMgbm90IHN0YXJ0IHRoZSB0aW1lLCBqdXN0IHNldHMgdXAgdGhlIG1lbWJlcnMgbmVlZGVkLlxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gbXNlY3M7XG59O1xuXG5leHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG59O1xuXG5leHBvcnRzLl91bnJlZkFjdGl2ZSA9IGV4cG9ydHMuYWN0aXZlID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cbiAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG4gIGlmIChtc2VjcyA+PSAwKSB7XG4gICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcbiAgICAgICAgaXRlbS5fb25UaW1lb3V0KCk7XG4gICAgfSwgbXNlY3MpO1xuICB9XG59O1xuXG4vLyBzZXRpbW1lZGlhdGUgYXR0YWNoZXMgaXRzZWxmIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5yZXF1aXJlKFwic2V0aW1tZWRpYXRlXCIpO1xuZXhwb3J0cy5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG5leHBvcnRzLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuXzF5eXFuQnZQRThuSnhub21jS2s5OXZ7cG9zaXRpb246Zml4ZWQ7cmlnaHQ6MDtib3R0b206MH1cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5leHBvcnRzLmxvY2FscyA9IHtcblx0XCJmaXhlZEJvdHRvbVwiOiBcIl8xeXlxbkJ2UEU4bkp4bm9tY0trOTl2XCJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L2Nzcy1sb2FkZXI/e1wibW9kdWxlc1wiOnRydWUsXCJtaW5pbWl6ZVwiOnRydWUsXCJjYW1lbENhc2VcIjp0cnVlfSEuL3N0eWxlcy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG52YXIgc3R5bGVzSW5Eb20gPSB7fSxcblx0bWVtb2l6ZSA9IGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIG1lbW87XG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRyZXR1cm4gbWVtbztcblx0XHR9O1xuXHR9LFxuXHRpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbigpIHtcblx0XHQvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuXHRcdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0XHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyIFxuXHRcdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHRcdC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIvaXNzdWVzLzE3N1xuXHRcdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcblx0fSksXG5cdGdldEVsZW1lbnQgPSAoZnVuY3Rpb24oZm4pIHtcblx0XHR2YXIgbWVtbyA9IHt9O1xuXHRcdHJldHVybiBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdFx0aWYgKHR5cGVvZiBtZW1vW3NlbGVjdG9yXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRtZW1vW3NlbGVjdG9yXSA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1lbW9bc2VsZWN0b3JdXG5cdFx0fTtcblx0fSkoZnVuY3Rpb24gKHN0eWxlVGFyZ2V0KSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc3R5bGVUYXJnZXQpXG5cdH0pLFxuXHRzaW5nbGV0b25FbGVtZW50ID0gbnVsbCxcblx0c2luZ2xldG9uQ291bnRlciA9IDAsXG5cdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW10sXG5cdGZpeFVybHMgPSByZXF1aXJlKFwiLi9maXhVcmxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRJbnRvID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCk7XG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKylcblx0XHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyhsaXN0KSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKVxuXHRcdFx0c3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlXG5cdFx0XHRuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCkge1xuXHR2YXIgc3R5bGVUYXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblx0aWYgKCFzdHlsZVRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wW3N0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0c3R5bGVUYXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgc3R5bGVUYXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHRzdHlsZVRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlVGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cdFx0fVxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGVFbGVtZW50KTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0c3R5bGVUYXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuXHRzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHR2YXIgaWR4ID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZUVsZW1lbnQpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSB7XG5cdHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblxuXHRhdHRhY2hUYWdBdHRycyhzdHlsZUVsZW1lbnQsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KTtcblx0cmV0dXJuIHN0eWxlRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucykge1xuXHR2YXIgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGF0dGFjaFRhZ0F0dHJzKGxpbmtFbGVtZW50LCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmtFbGVtZW50KTtcblx0cmV0dXJuIGxpbmtFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBhdHRhY2hUYWdBdHRycyhlbGVtZW50LCBhdHRycykge1xuXHRPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVFbGVtZW50LCB1cGRhdGUsIHJlbW92ZTtcblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblx0XHRzdHlsZUVsZW1lbnQgPSBzaW5nbGV0b25FbGVtZW50IHx8IChzaW5nbGV0b25FbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cdH0gZWxzZSBpZihvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG5cdFx0XHRpZihzdHlsZUVsZW1lbnQuaHJlZilcblx0XHRcdFx0VVJMLnJldm9rZU9iamVjdFVSTChzdHlsZUVsZW1lbnQuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xuXHRcdGlmKG5ld09iaikge1xuXHRcdFx0aWYobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnKHN0eWxlRWxlbWVudCwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGVFbGVtZW50LmNoaWxkTm9kZXM7XG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGVFbGVtZW50Lmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZUVsZW1lbnQsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayhsaW5rRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHQvKiBJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0YW5kIHRoZXJlIGlzIG5vIHB1YmxpY1BhdGggZGVmaW5lZCB0aGVuIGxldHMgdHVybiBjb252ZXJ0VG9BYnNvbHV0ZVVybHNcblx0b24gYnkgZGVmYXVsdC4gIE90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgb3B0aW9uXG5cdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscyl7XG5cdFx0Y3NzID0gZml4VXJscyhjc3MpO1xuXHR9XG5cblx0aWYoc291cmNlTWFwKSB7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblxuXHR2YXIgb2xkU3JjID0gbGlua0VsZW1lbnQuaHJlZjtcblxuXHRsaW5rRWxlbWVudC5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpXG5cdFx0VVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi9zdHlsZXMuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuL3N0eWxlcy5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuL3N0eWxlcy5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3R5bGVzLmNzc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==