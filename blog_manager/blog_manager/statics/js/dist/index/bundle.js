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
      url: '/api/articles/index'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzRjZmMxZDQzYmZjODU4MWUzNWQiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9taXRocmlsL21pdGhyaWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vZW50cnkuanMiLCJ3ZWJwYWNrOi8vLy4vbW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9iYXNlNjQtanMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L2llZWU3NTQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9pc2FycmF5L2luZGV4LmpzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L3N0eWxlLWxvYWRlci9maXhVcmxzLmpzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zdHlsZXMuY3NzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zdHlsZXMuY3NzP2E4MTMiXSwibmFtZXMiOlsiVm5vZGUiLCJ0YWciLCJrZXkiLCJhdHRyczAiLCJjaGlsZHJlbiIsInRleHQiLCJkb20iLCJhdHRycyIsImRvbVNpemUiLCJ1bmRlZmluZWQiLCJzdGF0ZSIsIl9zdGF0ZSIsImV2ZW50cyIsImluc3RhbmNlIiwic2tpcCIsIm5vcm1hbGl6ZSIsIm5vZGUiLCJBcnJheSIsImlzQXJyYXkiLCJub3JtYWxpemVDaGlsZHJlbiIsImkiLCJsZW5ndGgiLCJzZWxlY3RvclBhcnNlciIsInNlbGVjdG9yQ2FjaGUiLCJoYXNPd24iLCJoYXNPd25Qcm9wZXJ0eSIsImNvbXBpbGVTZWxlY3RvciIsInNlbGVjdG9yIiwibWF0Y2giLCJjbGFzc2VzIiwiZXhlYyIsInR5cGUiLCJ2YWx1ZSIsImlkIiwicHVzaCIsImF0dHJWYWx1ZSIsInJlcGxhY2UiLCJjbGFzc05hbWUiLCJqb2luIiwiZXhlY1NlbGVjdG9yIiwiaGFzQXR0cnMiLCJjaGlsZExpc3QiLCJjbGFzcyIsImNhbGwiLCJoeXBlcnNjcmlwdCIsImFyZ3VtZW50cyIsInN0YXJ0IiwidmlldyIsIkVycm9yIiwiY2FjaGVkIiwibm9ybWFsaXplZCIsInRydXN0IiwiaHRtbCIsImZyYWdtZW50IiwiYXR0cnMxIiwibSIsIlByb21pc2VQb2x5ZmlsbCIsImV4ZWN1dG9yIiwiVHlwZUVycm9yIiwic2VsZiIsInJlc29sdmVycyIsInJlamVjdG9ycyIsInJlc29sdmVDdXJyZW50IiwiaGFuZGxlciIsInJlamVjdEN1cnJlbnQiLCJfaW5zdGFuY2UiLCJjYWxsQXN5bmMiLCJzZXRJbW1lZGlhdGUiLCJzZXRUaW1lb3V0IiwibGlzdCIsInNob3VsZEFic29yYiIsImV4ZWN1dGUiLCJ0aGVuIiwiZXhlY3V0ZU9uY2UiLCJiaW5kIiwiY29uc29sZSIsImVycm9yIiwicmV0cnkiLCJlIiwicnVucyIsInJ1biIsImZuIiwib25lcnJvciIsInByb3RvdHlwZSIsIm9uRnVsZmlsbGVkIiwib25SZWplY3Rpb24iLCJoYW5kbGUiLCJjYWxsYmFjayIsIm5leHQiLCJyZXNvbHZlTmV4dCIsInJlamVjdE5leHQiLCJwcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNhdGNoIiwiYWxsIiwidG90YWwiLCJjb3VudCIsInZhbHVlcyIsImNvbnN1bWUiLCJyYWNlIiwid2luZG93IiwiUHJvbWlzZSIsImdsb2JhbCIsImJ1aWxkUXVlcnlTdHJpbmciLCJvYmplY3QiLCJPYmplY3QiLCJ0b1N0cmluZyIsImFyZ3MiLCJrZXkwIiwiZGVzdHJ1Y3R1cmUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJGSUxFX1BST1RPQ09MX1JFR0VYIiwiUmVnRXhwIiwiXzgiLCIkd2luZG93IiwiY2FsbGJhY2tDb3VudCIsIm9uY29tcGxldGlvbiIsInNldENvbXBsZXRpb25DYWxsYmFjayIsImZpbmFsaXplciIsImNvbXBsZXRlIiwiZmluYWxpemUiLCJwcm9taXNlMCIsInRoZW4wIiwiYXBwbHkiLCJleHRyYSIsInVybCIsInJlcXVlc3QiLCJtZXRob2QiLCJ0b1VwcGVyQ2FzZSIsInVzZUJvZHkiLCJzZXJpYWxpemUiLCJGb3JtRGF0YSIsImRhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwiZGVzZXJpYWxpemUiLCJleHRyYWN0IiwiaW50ZXJwb2xhdGUiLCJhc3NlbWJsZSIsInhociIsIlhNTEh0dHBSZXF1ZXN0IiwiYWJvcnRlZCIsIl9hYm9ydCIsImFib3J0Iiwib3BlbiIsImFzeW5jIiwidXNlciIsInBhc3N3b3JkIiwic2V0UmVxdWVzdEhlYWRlciIsIndpdGhDcmVkZW50aWFscyIsImhlYWRlcnMiLCJjb25maWciLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwicmVzcG9uc2UiLCJzdGF0dXMiLCJ0ZXN0IiwiY2FzdCIsInJlc3BvbnNlVGV4dCIsInNlbmQiLCJiYWNrZ3JvdW5kIiwianNvbnAiLCJjYWxsYmFja05hbWUiLCJNYXRoIiwicm91bmQiLCJyYW5kb20iLCJzY3JpcHQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJjYWxsYmFja0tleSIsInNyYyIsImRvY3VtZW50RWxlbWVudCIsImFwcGVuZENoaWxkIiwidG9rZW5zIiwic2xpY2UiLCJxdWVyeXN0cmluZyIsInByZWZpeCIsImluZGV4T2YiLCJwYXJzZSIsInR5cGUwIiwicmVxdWVzdFNlcnZpY2UiLCJjb3JlUmVuZGVyZXIiLCIkZG9jIiwiJGVtcHR5RnJhZ21lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50Iiwib25ldmVudCIsInNldEV2ZW50Q2FsbGJhY2siLCJjcmVhdGVOb2RlcyIsInBhcmVudCIsInZub2RlcyIsImVuZCIsImhvb2tzIiwibmV4dFNpYmxpbmciLCJucyIsInZub2RlIiwiY3JlYXRlTm9kZSIsImluaXRMaWZlY3ljbGUiLCJjcmVhdGVUZXh0IiwiY3JlYXRlSFRNTCIsImNyZWF0ZUZyYWdtZW50IiwiY3JlYXRlQ29tcG9uZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJpbnNlcnROb2RlIiwibWF0Y2gxIiwicGFyZW50MSIsImNhcHRpb24iLCJ0aGVhZCIsInRib2R5IiwidGZvb3QiLCJ0ciIsInRoIiwidGQiLCJjb2xncm91cCIsImNvbCIsInRlbXAiLCJpbm5lckhUTUwiLCJmaXJzdENoaWxkIiwiY2hpbGROb2RlcyIsImNoaWxkIiwiYXR0cnMyIiwiaXMiLCJlbGVtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwic2V0QXR0cnMiLCJjb250ZW50ZWRpdGFibGUiLCJzZXRDb250ZW50RWRpdGFibGUiLCJ0ZXh0Q29udGVudCIsInNldExhdGVBdHRycyIsImluaXRDb21wb25lbnQiLCJzZW50aW5lbCIsImNyZWF0ZSIsIiQkcmVlbnRyYW50TG9jayQkIiwidXBkYXRlTm9kZXMiLCJvbGQiLCJyZWN5Y2xpbmciLCJyZW1vdmVOb2RlcyIsImlzVW5rZXllZCIsImdldE5leHRTaWJsaW5nIiwidXBkYXRlTm9kZSIsImlzUmVjeWNsYWJsZSIsInBvb2wiLCJjb25jYXQiLCJvbGRTdGFydCIsIm9sZEVuZCIsIm1hcCIsIm8iLCJ2Iiwic2hvdWxkUmVjeWNsZSIsInRvRnJhZ21lbnQiLCJnZXRLZXlNYXAiLCJvbGRJbmRleCIsIm1vdmFibGUiLCJvbGRUYWciLCJzaG91bGROb3RVcGRhdGUiLCJ1cGRhdGVMaWZlY3ljbGUiLCJ1cGRhdGVUZXh0IiwidXBkYXRlSFRNTCIsInVwZGF0ZUZyYWdtZW50IiwidXBkYXRlRWxlbWVudCIsInVwZGF0ZUNvbXBvbmVudCIsInJlbW92ZU5vZGUiLCJub2RlVmFsdWUiLCJ1cGRhdGVBdHRycyIsImFicyIsIm9sZENoaWxkcmVuTGVuZ3RoIiwicG9vbENoaWxkcmVuTGVuZ3RoIiwidm5vZGVzQ2hpbGRyZW5MZW5ndGgiLCJrZXkyIiwiY291bnQwIiwiaW5zZXJ0QmVmb3JlIiwiY29udGVudCIsImNvbnRleHQiLCJleHBlY3RlZCIsImNhbGxlZCIsIm9uYmVmb3JlcmVtb3ZlIiwicmVzdWx0IiwiY29udGludWF0aW9uIiwib25yZW1vdmUiLCJyZW1vdmVOb2RlRnJvbURPTSIsImhhc0ludGVncmF0aW9uTWV0aG9kcyIsInNldEF0dHIiLCJpc0Zvcm1BdHRyaWJ1dGUiLCJpc0xpZmVjeWNsZU1ldGhvZCIsIm5zTGFzdEluZGV4Iiwic3Vic3RyIiwic2V0QXR0cmlidXRlTlMiLCJ1cGRhdGVFdmVudCIsInVwZGF0ZVN0eWxlIiwiaXNBdHRyaWJ1dGUiLCJpc0N1c3RvbUVsZW1lbnQiLCJhY3RpdmVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwic2VsZWN0ZWRJbmRleCIsImF0dHIiLCJzb3VyY2UiLCJvbmNyZWF0ZSIsIm9udXBkYXRlIiwic3R5bGUiLCJjc3NUZXh0IiwiZXZlbnROYW1lIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbmluaXQiLCJmb3JjZVZub2RlVXBkYXRlIiwiZm9yY2VDb21wb25lbnRVcGRhdGUiLCJvbmJlZm9yZXVwZGF0ZSIsInJlbmRlciIsImFjdGl2ZSIsImZvY3VzIiwidGhyb3R0bGUiLCJ0aW1lIiwibGFzdCIsInBlbmRpbmciLCJ0aW1lb3V0IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibm93IiwiRGF0ZSIsIl8xMSIsInJlbmRlclNlcnZpY2UiLCJyZWRyYXciLCJjYWxsYmFja3MiLCJzdWJzY3JpYmUiLCJrZXkxIiwidW5zdWJzY3JpYmUiLCJpbmRleCIsInNwbGljZSIsInJlZHJhd1NlcnZpY2UiLCJfMTYiLCJyZWRyYXdTZXJ2aWNlMCIsInJvb3QiLCJjb21wb25lbnQiLCJydW4wIiwibW91bnQiLCJwYXJzZVF1ZXJ5U3RyaW5nIiwic3RyaW5nIiwiY2hhckF0IiwiZW50cmllcyIsInNwbGl0IiwiZGF0YTAiLCJjb3VudGVycyIsImVudHJ5Iiwia2V5NSIsImRlY29kZVVSSUNvbXBvbmVudCIsImxldmVscyIsImN1cnNvciIsInBvcCIsImoiLCJsZXZlbCIsIm5leHRMZXZlbCIsImlzTnVtYmVyIiwiaXNOYU4iLCJwYXJzZUludCIsImlzVmFsdWUiLCJjb3JlUm91dGVyIiwic3VwcG9ydHNQdXNoU3RhdGUiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiY2FsbEFzeW5jMCIsIm5vcm1hbGl6ZTEiLCJmcmFnbWVudDAiLCJsb2NhdGlvbiIsImFzeW5jSWQiLCJkZWJvdW5jZUFzeW5jIiwiY2FsbGJhY2swIiwicGFyc2VQYXRoIiwicGF0aCIsInF1ZXJ5RGF0YSIsImhhc2hEYXRhIiwicXVlcnlJbmRleCIsImhhc2hJbmRleCIsInBhdGhFbmQiLCJxdWVyeUVuZCIsInF1ZXJ5UGFyYW1zIiwia2V5NCIsImhhc2hQYXJhbXMiLCJyb3V0ZXIiLCJnZXRQYXRoIiwidHlwZTIiLCJzZXRQYXRoIiwib3B0aW9ucyIsIm1hdGNoMiIsInRva2VuIiwicXVlcnkiLCJoYXNoIiwidGl0bGUiLCJvbnBvcHN0YXRlIiwicmVwbGFjZVN0YXRlIiwiaHJlZiIsImRlZmluZVJvdXRlcyIsInJvdXRlcyIsInJlc29sdmVSb3V0ZSIsInBhcmFtcyIsInBhdGhuYW1lIiwiayIsInJvdXRlMCIsIm1hdGNoZXIiLCJrZXlzIiwib25oYXNoY2hhbmdlIiwiXzIwIiwicm91dGVTZXJ2aWNlIiwiaWRlbnRpdHkiLCJyZW5kZXIxIiwiYXR0cnMzIiwiY3VycmVudFBhdGgiLCJsYXN0VXBkYXRlIiwicm91dGUiLCJkZWZhdWx0Um91dGUiLCJydW4xIiwiYmFpbCIsInBheWxvYWQiLCJ1cGRhdGUiLCJyb3V0ZVJlc29sdmVyIiwiY29tcCIsIm9ubWF0Y2giLCJyZXNvbHZlZCIsInNldCIsImdldCIsInByZWZpeDAiLCJsaW5rIiwidm5vZGUxIiwib25jbGljayIsImN0cmxLZXkiLCJtZXRhS2V5Iiwic2hpZnRLZXkiLCJ3aGljaCIsInByZXZlbnREZWZhdWx0IiwiZ2V0QXR0cmlidXRlIiwicGFyYW0iLCJrZXkzIiwid2l0aEF0dHIiLCJhdHRyTmFtZSIsImNhbGxiYWNrMSIsImN1cnJlbnRUYXJnZXQiLCJfMjgiLCJ2ZXJzaW9uIiwibW9kdWxlIiwiZyIsIkZ1bmN0aW9uIiwiZXZhbCIsImV4cG9ydHMiLCJVbCIsImlubmVyIiwiTGkiLCJEZXRhaWxzIiwic3VtbWFyeSIsIlllYXIiLCJtb250aHMiLCJkIiwieWVhciIsIk1vbnRoIiwiZGF5cyIsIm1vbnRoIiwiRGF5IiwiZGF5Iiwic2x1ZyIsImZldGNoIiwiYXJ0aWNsZUluZGV4IiwiZmV0Y2hlZCIsImdldEVsZW1lbnRCeUlkIiwiTW9kZWwiLCJieXRlTGVuZ3RoIiwidG9CeXRlQXJyYXkiLCJmcm9tQnl0ZUFycmF5IiwibG9va3VwIiwicmV2TG9va3VwIiwiQXJyIiwiVWludDhBcnJheSIsImNvZGUiLCJsZW4iLCJjaGFyQ29kZUF0IiwicGxhY2VIb2xkZXJzQ291bnQiLCJiNjQiLCJsIiwidG1wIiwicGxhY2VIb2xkZXJzIiwiYXJyIiwiTCIsInRyaXBsZXRUb0Jhc2U2NCIsIm51bSIsImVuY29kZUNodW5rIiwidWludDgiLCJvdXRwdXQiLCJleHRyYUJ5dGVzIiwicGFydHMiLCJtYXhDaHVua0xlbmd0aCIsImxlbjIiLCJiYXNlNjQiLCJyZXF1aXJlIiwiaWVlZTc1NCIsIkJ1ZmZlciIsIlNsb3dCdWZmZXIiLCJJTlNQRUNUX01BWF9CWVRFUyIsIlRZUEVEX0FSUkFZX1NVUFBPUlQiLCJ0eXBlZEFycmF5U3VwcG9ydCIsImtNYXhMZW5ndGgiLCJfX3Byb3RvX18iLCJmb28iLCJzdWJhcnJheSIsImNyZWF0ZUJ1ZmZlciIsInRoYXQiLCJSYW5nZUVycm9yIiwiYXJnIiwiZW5jb2RpbmdPck9mZnNldCIsImFsbG9jVW5zYWZlIiwiZnJvbSIsInBvb2xTaXplIiwiX2F1Z21lbnQiLCJBcnJheUJ1ZmZlciIsImZyb21BcnJheUJ1ZmZlciIsImZyb21TdHJpbmciLCJmcm9tT2JqZWN0IiwiU3ltYm9sIiwic3BlY2llcyIsImRlZmluZVByb3BlcnR5IiwiY29uZmlndXJhYmxlIiwiYXNzZXJ0U2l6ZSIsInNpemUiLCJhbGxvYyIsImZpbGwiLCJlbmNvZGluZyIsImNoZWNrZWQiLCJhbGxvY1Vuc2FmZVNsb3ciLCJpc0VuY29kaW5nIiwiYWN0dWFsIiwid3JpdGUiLCJmcm9tQXJyYXlMaWtlIiwiYXJyYXkiLCJieXRlT2Zmc2V0Iiwib2JqIiwiaXNCdWZmZXIiLCJjb3B5IiwiYnVmZmVyIiwiaXNuYW4iLCJiIiwiX2lzQnVmZmVyIiwiY29tcGFyZSIsImEiLCJ4IiwieSIsIm1pbiIsIlN0cmluZyIsInRvTG93ZXJDYXNlIiwicG9zIiwiYnVmIiwiaXNWaWV3IiwibG93ZXJlZENhc2UiLCJ1dGY4VG9CeXRlcyIsImJhc2U2NFRvQnl0ZXMiLCJzbG93VG9TdHJpbmciLCJoZXhTbGljZSIsInV0ZjhTbGljZSIsImFzY2lpU2xpY2UiLCJsYXRpbjFTbGljZSIsImJhc2U2NFNsaWNlIiwidXRmMTZsZVNsaWNlIiwic3dhcCIsIm4iLCJzd2FwMTYiLCJzd2FwMzIiLCJzd2FwNjQiLCJlcXVhbHMiLCJpbnNwZWN0Iiwic3RyIiwibWF4IiwidGFyZ2V0IiwidGhpc1N0YXJ0IiwidGhpc0VuZCIsInRoaXNDb3B5IiwidGFyZ2V0Q29weSIsImJpZGlyZWN0aW9uYWxJbmRleE9mIiwidmFsIiwiZGlyIiwiYXJyYXlJbmRleE9mIiwibGFzdEluZGV4T2YiLCJpbmRleFNpemUiLCJhcnJMZW5ndGgiLCJ2YWxMZW5ndGgiLCJyZWFkIiwicmVhZFVJbnQxNkJFIiwiZm91bmRJbmRleCIsImZvdW5kIiwiaW5jbHVkZXMiLCJoZXhXcml0ZSIsIm9mZnNldCIsIk51bWJlciIsInJlbWFpbmluZyIsInN0ckxlbiIsInBhcnNlZCIsInV0ZjhXcml0ZSIsImJsaXRCdWZmZXIiLCJhc2NpaVdyaXRlIiwiYXNjaWlUb0J5dGVzIiwibGF0aW4xV3JpdGUiLCJiYXNlNjRXcml0ZSIsInVjczJXcml0ZSIsInV0ZjE2bGVUb0J5dGVzIiwiaXNGaW5pdGUiLCJ0b0pTT04iLCJfYXJyIiwicmVzIiwiZmlyc3RCeXRlIiwiY29kZVBvaW50IiwiYnl0ZXNQZXJTZXF1ZW5jZSIsInNlY29uZEJ5dGUiLCJ0aGlyZEJ5dGUiLCJmb3VydGhCeXRlIiwidGVtcENvZGVQb2ludCIsImRlY29kZUNvZGVQb2ludHNBcnJheSIsIk1BWF9BUkdVTUVOVFNfTEVOR1RIIiwiY29kZVBvaW50cyIsImZyb21DaGFyQ29kZSIsInJldCIsIm91dCIsInRvSGV4IiwiYnl0ZXMiLCJuZXdCdWYiLCJzbGljZUxlbiIsImNoZWNrT2Zmc2V0IiwiZXh0IiwicmVhZFVJbnRMRSIsIm5vQXNzZXJ0IiwibXVsIiwicmVhZFVJbnRCRSIsInJlYWRVSW50OCIsInJlYWRVSW50MTZMRSIsInJlYWRVSW50MzJMRSIsInJlYWRVSW50MzJCRSIsInJlYWRJbnRMRSIsInBvdyIsInJlYWRJbnRCRSIsInJlYWRJbnQ4IiwicmVhZEludDE2TEUiLCJyZWFkSW50MTZCRSIsInJlYWRJbnQzMkxFIiwicmVhZEludDMyQkUiLCJyZWFkRmxvYXRMRSIsInJlYWRGbG9hdEJFIiwicmVhZERvdWJsZUxFIiwicmVhZERvdWJsZUJFIiwiY2hlY2tJbnQiLCJ3cml0ZVVJbnRMRSIsIm1heEJ5dGVzIiwid3JpdGVVSW50QkUiLCJ3cml0ZVVJbnQ4IiwiZmxvb3IiLCJvYmplY3RXcml0ZVVJbnQxNiIsImxpdHRsZUVuZGlhbiIsIndyaXRlVUludDE2TEUiLCJ3cml0ZVVJbnQxNkJFIiwib2JqZWN0V3JpdGVVSW50MzIiLCJ3cml0ZVVJbnQzMkxFIiwid3JpdGVVSW50MzJCRSIsIndyaXRlSW50TEUiLCJsaW1pdCIsInN1YiIsIndyaXRlSW50QkUiLCJ3cml0ZUludDgiLCJ3cml0ZUludDE2TEUiLCJ3cml0ZUludDE2QkUiLCJ3cml0ZUludDMyTEUiLCJ3cml0ZUludDMyQkUiLCJjaGVja0lFRUU3NTQiLCJ3cml0ZUZsb2F0Iiwid3JpdGVGbG9hdExFIiwid3JpdGVGbG9hdEJFIiwid3JpdGVEb3VibGUiLCJ3cml0ZURvdWJsZUxFIiwid3JpdGVEb3VibGVCRSIsInRhcmdldFN0YXJ0IiwiSU5WQUxJRF9CQVNFNjRfUkUiLCJiYXNlNjRjbGVhbiIsInN0cmluZ3RyaW0iLCJ0cmltIiwidW5pdHMiLCJJbmZpbml0eSIsImxlYWRTdXJyb2dhdGUiLCJieXRlQXJyYXkiLCJjIiwiaGkiLCJsbyIsImRzdCIsInVzZVNvdXJjZU1hcCIsIml0ZW0iLCJjc3NXaXRoTWFwcGluZ1RvU3RyaW5nIiwibW9kdWxlcyIsIm1lZGlhUXVlcnkiLCJhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzIiwiY3NzTWFwcGluZyIsInNvdXJjZU1hcHBpbmciLCJ0b0NvbW1lbnQiLCJzb3VyY2VVUkxzIiwic291cmNlcyIsInNvdXJjZVJvb3QiLCJzb3VyY2VNYXAiLCJpc0xFIiwibUxlbiIsIm5CeXRlcyIsImVMZW4iLCJlTWF4IiwiZUJpYXMiLCJuQml0cyIsInMiLCJOYU4iLCJydCIsImxvZyIsIkxOMiIsInByb2Nlc3MiLCJjYWNoZWRTZXRUaW1lb3V0IiwiY2FjaGVkQ2xlYXJUaW1lb3V0IiwiZGVmYXVsdFNldFRpbW91dCIsImRlZmF1bHRDbGVhclRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJydW5UaW1lb3V0IiwiZnVuIiwicnVuQ2xlYXJUaW1lb3V0IiwibWFya2VyIiwicXVldWUiLCJkcmFpbmluZyIsImN1cnJlbnRRdWV1ZSIsInF1ZXVlSW5kZXgiLCJjbGVhblVwTmV4dFRpY2siLCJkcmFpblF1ZXVlIiwibmV4dFRpY2siLCJJdGVtIiwiYnJvd3NlciIsImVudiIsImFyZ3YiLCJ2ZXJzaW9ucyIsIm5vb3AiLCJvbiIsImFkZExpc3RlbmVyIiwib25jZSIsIm9mZiIsInJlbW92ZUxpc3RlbmVyIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwiZW1pdCIsImJpbmRpbmciLCJuYW1lIiwiY3dkIiwiY2hkaXIiLCJ1bWFzayIsIm5leHRIYW5kbGUiLCJ0YXNrc0J5SGFuZGxlIiwiY3VycmVudGx5UnVubmluZ0FUYXNrIiwiZG9jIiwicmVnaXN0ZXJJbW1lZGlhdGUiLCJ0YXNrIiwiY2xlYXJJbW1lZGlhdGUiLCJydW5JZlByZXNlbnQiLCJpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbiIsImNhblVzZVBvc3RNZXNzYWdlIiwicG9zdE1lc3NhZ2UiLCJpbXBvcnRTY3JpcHRzIiwicG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyIsIm9sZE9uTWVzc2FnZSIsIm9ubWVzc2FnZSIsImluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uIiwibWVzc2FnZVByZWZpeCIsIm9uR2xvYmFsTWVzc2FnZSIsImV2ZW50IiwiYXR0YWNoRXZlbnQiLCJpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbiIsImNoYW5uZWwiLCJNZXNzYWdlQ2hhbm5lbCIsInBvcnQxIiwicG9ydDIiLCJpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uIiwiaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbiIsImF0dGFjaFRvIiwiZ2V0UHJvdG90eXBlT2YiLCJjc3MiLCJiYXNlVXJsIiwicHJvdG9jb2wiLCJob3N0IiwiY3VycmVudERpciIsImZpeGVkQ3NzIiwiZnVsbE1hdGNoIiwib3JpZ1VybCIsInVucXVvdGVkT3JpZ1VybCIsIiQxIiwibmV3VXJsIiwiVGltZW91dCIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsImNsb3NlIiwiY2xlYXJGbiIsIl9pZCIsIl9jbGVhckZuIiwidW5yZWYiLCJyZWYiLCJlbnJvbGwiLCJtc2VjcyIsIl9pZGxlVGltZW91dElkIiwiX2lkbGVUaW1lb3V0IiwidW5lbnJvbGwiLCJfdW5yZWZBY3RpdmUiLCJvblRpbWVvdXQiLCJfb25UaW1lb3V0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFD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RUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEOztBQUVBLDZCQUE2QixtQkFBbUI7O0FBRWhEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQ2pTQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFpRjtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLGdDQUFnQyxVQUFVLEVBQUU7QUFDNUMsQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzNGNmYzFkNDNiZmM4NTgxZTM1ZCIsIjsoZnVuY3Rpb24oKSB7XG5cInVzZSBzdHJpY3RcIlxuZnVuY3Rpb24gVm5vZGUodGFnLCBrZXksIGF0dHJzMCwgY2hpbGRyZW4sIHRleHQsIGRvbSkge1xuXHRyZXR1cm4ge3RhZzogdGFnLCBrZXk6IGtleSwgYXR0cnM6IGF0dHJzMCwgY2hpbGRyZW46IGNoaWxkcmVuLCB0ZXh0OiB0ZXh0LCBkb206IGRvbSwgZG9tU2l6ZTogdW5kZWZpbmVkLCBzdGF0ZTogdW5kZWZpbmVkLCBfc3RhdGU6IHVuZGVmaW5lZCwgZXZlbnRzOiB1bmRlZmluZWQsIGluc3RhbmNlOiB1bmRlZmluZWQsIHNraXA6IGZhbHNlfVxufVxuVm5vZGUubm9ybWFsaXplID0gZnVuY3Rpb24obm9kZSkge1xuXHRpZiAoQXJyYXkuaXNBcnJheShub2RlKSkgcmV0dXJuIFZub2RlKFwiW1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgVm5vZGUubm9ybWFsaXplQ2hpbGRyZW4obm9kZSksIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxuXHRpZiAobm9kZSAhPSBudWxsICYmIHR5cGVvZiBub2RlICE9PSBcIm9iamVjdFwiKSByZXR1cm4gVm5vZGUoXCIjXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBub2RlID09PSBmYWxzZSA/IFwiXCIgOiBub2RlLCB1bmRlZmluZWQsIHVuZGVmaW5lZClcblx0cmV0dXJuIG5vZGVcbn1cblZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuID0gZnVuY3Rpb24gbm9ybWFsaXplQ2hpbGRyZW4oY2hpbGRyZW4pIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGNoaWxkcmVuW2ldID0gVm5vZGUubm9ybWFsaXplKGNoaWxkcmVuW2ldKVxuXHR9XG5cdHJldHVybiBjaGlsZHJlblxufVxudmFyIHNlbGVjdG9yUGFyc2VyID0gLyg/OihefCN8XFwuKShbXiNcXC5cXFtcXF1dKykpfChcXFsoLis/KSg/Olxccyo9XFxzKihcInwnfCkoKD86XFxcXFtcIidcXF1dfC4pKj8pXFw1KT9cXF0pL2dcbnZhciBzZWxlY3RvckNhY2hlID0ge31cbnZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eVxuZnVuY3Rpb24gY29tcGlsZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG5cdHZhciBtYXRjaCwgdGFnID0gXCJkaXZcIiwgY2xhc3NlcyA9IFtdLCBhdHRycyA9IHt9XG5cdHdoaWxlIChtYXRjaCA9IHNlbGVjdG9yUGFyc2VyLmV4ZWMoc2VsZWN0b3IpKSB7XG5cdFx0dmFyIHR5cGUgPSBtYXRjaFsxXSwgdmFsdWUgPSBtYXRjaFsyXVxuXHRcdGlmICh0eXBlID09PSBcIlwiICYmIHZhbHVlICE9PSBcIlwiKSB0YWcgPSB2YWx1ZVxuXHRcdGVsc2UgaWYgKHR5cGUgPT09IFwiI1wiKSBhdHRycy5pZCA9IHZhbHVlXG5cdFx0ZWxzZSBpZiAodHlwZSA9PT0gXCIuXCIpIGNsYXNzZXMucHVzaCh2YWx1ZSlcblx0XHRlbHNlIGlmIChtYXRjaFszXVswXSA9PT0gXCJbXCIpIHtcblx0XHRcdHZhciBhdHRyVmFsdWUgPSBtYXRjaFs2XVxuXHRcdFx0aWYgKGF0dHJWYWx1ZSkgYXR0clZhbHVlID0gYXR0clZhbHVlLnJlcGxhY2UoL1xcXFwoW1wiJ10pL2csIFwiJDFcIikucmVwbGFjZSgvXFxcXFxcXFwvZywgXCJcXFxcXCIpXG5cdFx0XHRpZiAobWF0Y2hbNF0gPT09IFwiY2xhc3NcIikgY2xhc3Nlcy5wdXNoKGF0dHJWYWx1ZSlcblx0XHRcdGVsc2UgYXR0cnNbbWF0Y2hbNF1dID0gYXR0clZhbHVlIHx8IHRydWVcblx0XHR9XG5cdH1cblx0aWYgKGNsYXNzZXMubGVuZ3RoID4gMCkgYXR0cnMuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKFwiIFwiKVxuXHRyZXR1cm4gc2VsZWN0b3JDYWNoZVtzZWxlY3Rvcl0gPSB7dGFnOiB0YWcsIGF0dHJzOiBhdHRyc31cbn1cbmZ1bmN0aW9uIGV4ZWNTZWxlY3RvcihzdGF0ZSwgYXR0cnMsIGNoaWxkcmVuKSB7XG5cdHZhciBoYXNBdHRycyA9IGZhbHNlLCBjaGlsZExpc3QsIHRleHRcblx0dmFyIGNsYXNzTmFtZSA9IGF0dHJzLmNsYXNzTmFtZSB8fCBhdHRycy5jbGFzc1xuXHRmb3IgKHZhciBrZXkgaW4gc3RhdGUuYXR0cnMpIHtcblx0XHRpZiAoaGFzT3duLmNhbGwoc3RhdGUuYXR0cnMsIGtleSkpIHtcblx0XHRcdGF0dHJzW2tleV0gPSBzdGF0ZS5hdHRyc1trZXldXG5cdFx0fVxuXHR9XG5cdGlmIChjbGFzc05hbWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdGlmIChhdHRycy5jbGFzcyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRhdHRycy5jbGFzcyA9IHVuZGVmaW5lZFxuXHRcdFx0YXR0cnMuY2xhc3NOYW1lID0gY2xhc3NOYW1lXG5cdFx0fVxuXHRcdGlmIChzdGF0ZS5hdHRycy5jbGFzc05hbWUgIT0gbnVsbCkge1xuXHRcdFx0YXR0cnMuY2xhc3NOYW1lID0gc3RhdGUuYXR0cnMuY2xhc3NOYW1lICsgXCIgXCIgKyBjbGFzc05hbWVcblx0XHR9XG5cdH1cblx0Zm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG5cdFx0aWYgKGhhc093bi5jYWxsKGF0dHJzLCBrZXkpICYmIGtleSAhPT0gXCJrZXlcIikge1xuXHRcdFx0aGFzQXR0cnMgPSB0cnVlXG5cdFx0XHRicmVha1xuXHRcdH1cblx0fVxuXHRpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikgJiYgY2hpbGRyZW4ubGVuZ3RoID09PSAxICYmIGNoaWxkcmVuWzBdICE9IG51bGwgJiYgY2hpbGRyZW5bMF0udGFnID09PSBcIiNcIikge1xuXHRcdHRleHQgPSBjaGlsZHJlblswXS5jaGlsZHJlblxuXHR9IGVsc2Uge1xuXHRcdGNoaWxkTGlzdCA9IGNoaWxkcmVuXG5cdH1cblx0cmV0dXJuIFZub2RlKHN0YXRlLnRhZywgYXR0cnMua2V5LCBoYXNBdHRycyA/IGF0dHJzIDogdW5kZWZpbmVkLCBjaGlsZExpc3QsIHRleHQpXG59XG5mdW5jdGlvbiBoeXBlcnNjcmlwdChzZWxlY3Rvcikge1xuXHQvLyBCZWNhdXNlIHNsb3BweSBtb2RlIHN1Y2tzXG5cdHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXSwgc3RhcnQgPSAyLCBjaGlsZHJlblxuXHRpZiAoc2VsZWN0b3IgPT0gbnVsbCB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHNlbGVjdG9yICE9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIHNlbGVjdG9yLnZpZXcgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdHRocm93IEVycm9yKFwiVGhlIHNlbGVjdG9yIG11c3QgYmUgZWl0aGVyIGEgc3RyaW5nIG9yIGEgY29tcG9uZW50LlwiKTtcblx0fVxuXHRpZiAodHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiKSB7XG5cdFx0dmFyIGNhY2hlZCA9IHNlbGVjdG9yQ2FjaGVbc2VsZWN0b3JdIHx8IGNvbXBpbGVTZWxlY3RvcihzZWxlY3Rvcilcblx0fVxuXHRpZiAoYXR0cnMgPT0gbnVsbCkge1xuXHRcdGF0dHJzID0ge31cblx0fSBlbHNlIGlmICh0eXBlb2YgYXR0cnMgIT09IFwib2JqZWN0XCIgfHwgYXR0cnMudGFnICE9IG51bGwgfHwgQXJyYXkuaXNBcnJheShhdHRycykpIHtcblx0XHRhdHRycyA9IHt9XG5cdFx0c3RhcnQgPSAxXG5cdH1cblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IHN0YXJ0ICsgMSkge1xuXHRcdGNoaWxkcmVuID0gYXJndW1lbnRzW3N0YXJ0XVxuXHRcdGlmICghQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIGNoaWxkcmVuID0gW2NoaWxkcmVuXVxuXHR9IGVsc2Uge1xuXHRcdGNoaWxkcmVuID0gW11cblx0XHR3aGlsZSAoc3RhcnQgPCBhcmd1bWVudHMubGVuZ3RoKSBjaGlsZHJlbi5wdXNoKGFyZ3VtZW50c1tzdGFydCsrXSlcblx0fVxuXHR2YXIgbm9ybWFsaXplZCA9IFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKGNoaWxkcmVuKVxuXHRpZiAodHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIGV4ZWNTZWxlY3RvcihjYWNoZWQsIGF0dHJzLCBub3JtYWxpemVkKVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBWbm9kZShzZWxlY3RvciwgYXR0cnMua2V5LCBhdHRycywgbm9ybWFsaXplZClcblx0fVxufVxuaHlwZXJzY3JpcHQudHJ1c3QgPSBmdW5jdGlvbihodG1sKSB7XG5cdGlmIChodG1sID09IG51bGwpIGh0bWwgPSBcIlwiXG5cdHJldHVybiBWbm9kZShcIjxcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGh0bWwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxufVxuaHlwZXJzY3JpcHQuZnJhZ21lbnQgPSBmdW5jdGlvbihhdHRyczEsIGNoaWxkcmVuKSB7XG5cdHJldHVybiBWbm9kZShcIltcIiwgYXR0cnMxLmtleSwgYXR0cnMxLCBWbm9kZS5ub3JtYWxpemVDaGlsZHJlbihjaGlsZHJlbiksIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxufVxudmFyIG0gPSBoeXBlcnNjcmlwdFxuLyoqIEBjb25zdHJ1Y3RvciAqL1xudmFyIFByb21pc2VQb2x5ZmlsbCA9IGZ1bmN0aW9uKGV4ZWN1dG9yKSB7XG5cdGlmICghKHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlUG9seWZpbGwpKSB0aHJvdyBuZXcgRXJyb3IoXCJQcm9taXNlIG11c3QgYmUgY2FsbGVkIHdpdGggYG5ld2BcIilcblx0aWYgKHR5cGVvZiBleGVjdXRvciAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpXG5cdHZhciBzZWxmID0gdGhpcywgcmVzb2x2ZXJzID0gW10sIHJlamVjdG9ycyA9IFtdLCByZXNvbHZlQ3VycmVudCA9IGhhbmRsZXIocmVzb2x2ZXJzLCB0cnVlKSwgcmVqZWN0Q3VycmVudCA9IGhhbmRsZXIocmVqZWN0b3JzLCBmYWxzZSlcblx0dmFyIGluc3RhbmNlID0gc2VsZi5faW5zdGFuY2UgPSB7cmVzb2x2ZXJzOiByZXNvbHZlcnMsIHJlamVjdG9yczogcmVqZWN0b3JzfVxuXHR2YXIgY2FsbEFzeW5jID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gXCJmdW5jdGlvblwiID8gc2V0SW1tZWRpYXRlIDogc2V0VGltZW91dFxuXHRmdW5jdGlvbiBoYW5kbGVyKGxpc3QsIHNob3VsZEFic29yYikge1xuXHRcdHJldHVybiBmdW5jdGlvbiBleGVjdXRlKHZhbHVlKSB7XG5cdFx0XHR2YXIgdGhlblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKHNob3VsZEFic29yYiAmJiB2YWx1ZSAhPSBudWxsICYmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpICYmIHR5cGVvZiAodGhlbiA9IHZhbHVlLnRoZW4pID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRpZiAodmFsdWUgPT09IHNlbGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIHcvIGl0c2VsZlwiKVxuXHRcdFx0XHRcdGV4ZWN1dGVPbmNlKHRoZW4uYmluZCh2YWx1ZSkpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Y2FsbEFzeW5jKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aWYgKCFzaG91bGRBYnNvcmIgJiYgbGlzdC5sZW5ndGggPT09IDApIGNvbnNvbGUuZXJyb3IoXCJQb3NzaWJsZSB1bmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb246XCIsIHZhbHVlKVxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSBsaXN0W2ldKHZhbHVlKVxuXHRcdFx0XHRcdFx0cmVzb2x2ZXJzLmxlbmd0aCA9IDAsIHJlamVjdG9ycy5sZW5ndGggPSAwXG5cdFx0XHRcdFx0XHRpbnN0YW5jZS5zdGF0ZSA9IHNob3VsZEFic29yYlxuXHRcdFx0XHRcdFx0aW5zdGFuY2UucmV0cnkgPSBmdW5jdGlvbigpIHtleGVjdXRlKHZhbHVlKX1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRyZWplY3RDdXJyZW50KGUpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIGV4ZWN1dGVPbmNlKHRoZW4pIHtcblx0XHR2YXIgcnVucyA9IDBcblx0XHRmdW5jdGlvbiBydW4oZm4pIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRpZiAocnVucysrID4gMCkgcmV0dXJuXG5cdFx0XHRcdGZuKHZhbHVlKVxuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgb25lcnJvciA9IHJ1bihyZWplY3RDdXJyZW50KVxuXHRcdHRyeSB7dGhlbihydW4ocmVzb2x2ZUN1cnJlbnQpLCBvbmVycm9yKX0gY2F0Y2ggKGUpIHtvbmVycm9yKGUpfVxuXHR9XG5cdGV4ZWN1dGVPbmNlKGV4ZWN1dG9yKVxufVxuUHJvbWlzZVBvbHlmaWxsLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0aW9uKSB7XG5cdHZhciBzZWxmID0gdGhpcywgaW5zdGFuY2UgPSBzZWxmLl9pbnN0YW5jZVxuXHRmdW5jdGlvbiBoYW5kbGUoY2FsbGJhY2ssIGxpc3QsIG5leHQsIHN0YXRlKSB7XG5cdFx0bGlzdC5wdXNoKGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIG5leHQodmFsdWUpXG5cdFx0XHRlbHNlIHRyeSB7cmVzb2x2ZU5leHQoY2FsbGJhY2sodmFsdWUpKX0gY2F0Y2ggKGUpIHtpZiAocmVqZWN0TmV4dCkgcmVqZWN0TmV4dChlKX1cblx0XHR9KVxuXHRcdGlmICh0eXBlb2YgaW5zdGFuY2UucmV0cnkgPT09IFwiZnVuY3Rpb25cIiAmJiBzdGF0ZSA9PT0gaW5zdGFuY2Uuc3RhdGUpIGluc3RhbmNlLnJldHJ5KClcblx0fVxuXHR2YXIgcmVzb2x2ZU5leHQsIHJlamVjdE5leHRcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge3Jlc29sdmVOZXh0ID0gcmVzb2x2ZSwgcmVqZWN0TmV4dCA9IHJlamVjdH0pXG5cdGhhbmRsZShvbkZ1bGZpbGxlZCwgaW5zdGFuY2UucmVzb2x2ZXJzLCByZXNvbHZlTmV4dCwgdHJ1ZSksIGhhbmRsZShvblJlamVjdGlvbiwgaW5zdGFuY2UucmVqZWN0b3JzLCByZWplY3ROZXh0LCBmYWxzZSlcblx0cmV0dXJuIHByb21pc2Vcbn1cblByb21pc2VQb2x5ZmlsbC5wcm90b3R5cGUuY2F0Y2ggPSBmdW5jdGlvbihvblJlamVjdGlvbikge1xuXHRyZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKVxufVxuUHJvbWlzZVBvbHlmaWxsLnJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlUG9seWZpbGwpIHJldHVybiB2YWx1ZVxuXHRyZXR1cm4gbmV3IFByb21pc2VQb2x5ZmlsbChmdW5jdGlvbihyZXNvbHZlKSB7cmVzb2x2ZSh2YWx1ZSl9KVxufVxuUHJvbWlzZVBvbHlmaWxsLnJlamVjdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge3JlamVjdCh2YWx1ZSl9KVxufVxuUHJvbWlzZVBvbHlmaWxsLmFsbCA9IGZ1bmN0aW9uKGxpc3QpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlUG9seWZpbGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0dmFyIHRvdGFsID0gbGlzdC5sZW5ndGgsIGNvdW50ID0gMCwgdmFsdWVzID0gW11cblx0XHRpZiAobGlzdC5sZW5ndGggPT09IDApIHJlc29sdmUoW10pXG5cdFx0ZWxzZSBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdChmdW5jdGlvbihpKSB7XG5cdFx0XHRcdGZ1bmN0aW9uIGNvbnN1bWUodmFsdWUpIHtcblx0XHRcdFx0XHRjb3VudCsrXG5cdFx0XHRcdFx0dmFsdWVzW2ldID0gdmFsdWVcblx0XHRcdFx0XHRpZiAoY291bnQgPT09IHRvdGFsKSByZXNvbHZlKHZhbHVlcylcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobGlzdFtpXSAhPSBudWxsICYmICh0eXBlb2YgbGlzdFtpXSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgbGlzdFtpXSA9PT0gXCJmdW5jdGlvblwiKSAmJiB0eXBlb2YgbGlzdFtpXS50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRsaXN0W2ldLnRoZW4oY29uc3VtZSwgcmVqZWN0KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgY29uc3VtZShsaXN0W2ldKVxuXHRcdFx0fSkoaSlcblx0XHR9XG5cdH0pXG59XG5Qcm9taXNlUG9seWZpbGwucmFjZSA9IGZ1bmN0aW9uKGxpc3QpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlUG9seWZpbGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsaXN0W2ldLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KVxuXHRcdH1cblx0fSlcbn1cbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGlmICh0eXBlb2Ygd2luZG93LlByb21pc2UgPT09IFwidW5kZWZpbmVkXCIpIHdpbmRvdy5Qcm9taXNlID0gUHJvbWlzZVBvbHlmaWxsXG5cdHZhciBQcm9taXNlUG9seWZpbGwgPSB3aW5kb3cuUHJvbWlzZVxufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsLlByb21pc2UgPT09IFwidW5kZWZpbmVkXCIpIGdsb2JhbC5Qcm9taXNlID0gUHJvbWlzZVBvbHlmaWxsXG5cdHZhciBQcm9taXNlUG9seWZpbGwgPSBnbG9iYWwuUHJvbWlzZVxufSBlbHNlIHtcbn1cbnZhciBidWlsZFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24ob2JqZWN0KSB7XG5cdGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSAhPT0gXCJbb2JqZWN0IE9iamVjdF1cIikgcmV0dXJuIFwiXCJcblx0dmFyIGFyZ3MgPSBbXVxuXHRmb3IgKHZhciBrZXkwIGluIG9iamVjdCkge1xuXHRcdGRlc3RydWN0dXJlKGtleTAsIG9iamVjdFtrZXkwXSlcblx0fVxuXHRyZXR1cm4gYXJncy5qb2luKFwiJlwiKVxuXHRmdW5jdGlvbiBkZXN0cnVjdHVyZShrZXkwLCB2YWx1ZSkge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRkZXN0cnVjdHVyZShrZXkwICsgXCJbXCIgKyBpICsgXCJdXCIsIHZhbHVlW2ldKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG5cdFx0XHRmb3IgKHZhciBpIGluIHZhbHVlKSB7XG5cdFx0XHRcdGRlc3RydWN0dXJlKGtleTAgKyBcIltcIiArIGkgKyBcIl1cIiwgdmFsdWVbaV0pXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgYXJncy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkwKSArICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBcIlwiID8gXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpIDogXCJcIikpXG5cdH1cbn1cbnZhciBGSUxFX1BST1RPQ09MX1JFR0VYID0gbmV3IFJlZ0V4cChcIl5maWxlOi8vXCIsIFwiaVwiKVxudmFyIF84ID0gZnVuY3Rpb24oJHdpbmRvdywgUHJvbWlzZSkge1xuXHR2YXIgY2FsbGJhY2tDb3VudCA9IDBcblx0dmFyIG9uY29tcGxldGlvblxuXHRmdW5jdGlvbiBzZXRDb21wbGV0aW9uQ2FsbGJhY2soY2FsbGJhY2spIHtvbmNvbXBsZXRpb24gPSBjYWxsYmFja31cblx0ZnVuY3Rpb24gZmluYWxpemVyKCkge1xuXHRcdHZhciBjb3VudCA9IDBcblx0XHRmdW5jdGlvbiBjb21wbGV0ZSgpIHtpZiAoLS1jb3VudCA9PT0gMCAmJiB0eXBlb2Ygb25jb21wbGV0aW9uID09PSBcImZ1bmN0aW9uXCIpIG9uY29tcGxldGlvbigpfVxuXHRcdHJldHVybiBmdW5jdGlvbiBmaW5hbGl6ZShwcm9taXNlMCkge1xuXHRcdFx0dmFyIHRoZW4wID0gcHJvbWlzZTAudGhlblxuXHRcdFx0cHJvbWlzZTAudGhlbiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb3VudCsrXG5cdFx0XHRcdHZhciBuZXh0ID0gdGhlbjAuYXBwbHkocHJvbWlzZTAsIGFyZ3VtZW50cylcblx0XHRcdFx0bmV4dC50aGVuKGNvbXBsZXRlLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0Y29tcGxldGUoKVxuXHRcdFx0XHRcdGlmIChjb3VudCA9PT0gMCkgdGhyb3cgZVxuXHRcdFx0XHR9KVxuXHRcdFx0XHRyZXR1cm4gZmluYWxpemUobmV4dClcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcm9taXNlMFxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBub3JtYWxpemUoYXJncywgZXh0cmEpIHtcblx0XHRpZiAodHlwZW9mIGFyZ3MgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHZhciB1cmwgPSBhcmdzXG5cdFx0XHRhcmdzID0gZXh0cmEgfHwge31cblx0XHRcdGlmIChhcmdzLnVybCA9PSBudWxsKSBhcmdzLnVybCA9IHVybFxuXHRcdH1cblx0XHRyZXR1cm4gYXJnc1xuXHR9XG5cdGZ1bmN0aW9uIHJlcXVlc3QoYXJncywgZXh0cmEpIHtcblx0XHR2YXIgZmluYWxpemUgPSBmaW5hbGl6ZXIoKVxuXHRcdGFyZ3MgPSBub3JtYWxpemUoYXJncywgZXh0cmEpXG5cdFx0dmFyIHByb21pc2UwID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRpZiAoYXJncy5tZXRob2QgPT0gbnVsbCkgYXJncy5tZXRob2QgPSBcIkdFVFwiXG5cdFx0XHRhcmdzLm1ldGhvZCA9IGFyZ3MubWV0aG9kLnRvVXBwZXJDYXNlKClcblx0XHRcdHZhciB1c2VCb2R5ID0gKGFyZ3MubWV0aG9kID09PSBcIkdFVFwiIHx8IGFyZ3MubWV0aG9kID09PSBcIlRSQUNFXCIpID8gZmFsc2UgOiAodHlwZW9mIGFyZ3MudXNlQm9keSA9PT0gXCJib29sZWFuXCIgPyBhcmdzLnVzZUJvZHkgOiB0cnVlKVxuXHRcdFx0aWYgKHR5cGVvZiBhcmdzLnNlcmlhbGl6ZSAhPT0gXCJmdW5jdGlvblwiKSBhcmdzLnNlcmlhbGl6ZSA9IHR5cGVvZiBGb3JtRGF0YSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhcmdzLmRhdGEgaW5zdGFuY2VvZiBGb3JtRGF0YSA/IGZ1bmN0aW9uKHZhbHVlKSB7cmV0dXJuIHZhbHVlfSA6IEpTT04uc3RyaW5naWZ5XG5cdFx0XHRpZiAodHlwZW9mIGFyZ3MuZGVzZXJpYWxpemUgIT09IFwiZnVuY3Rpb25cIikgYXJncy5kZXNlcmlhbGl6ZSA9IGRlc2VyaWFsaXplXG5cdFx0XHRpZiAodHlwZW9mIGFyZ3MuZXh0cmFjdCAhPT0gXCJmdW5jdGlvblwiKSBhcmdzLmV4dHJhY3QgPSBleHRyYWN0XG5cdFx0XHRhcmdzLnVybCA9IGludGVycG9sYXRlKGFyZ3MudXJsLCBhcmdzLmRhdGEpXG5cdFx0XHRpZiAodXNlQm9keSkgYXJncy5kYXRhID0gYXJncy5zZXJpYWxpemUoYXJncy5kYXRhKVxuXHRcdFx0ZWxzZSBhcmdzLnVybCA9IGFzc2VtYmxlKGFyZ3MudXJsLCBhcmdzLmRhdGEpXG5cdFx0XHR2YXIgeGhyID0gbmV3ICR3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKSxcblx0XHRcdFx0YWJvcnRlZCA9IGZhbHNlLFxuXHRcdFx0XHRfYWJvcnQgPSB4aHIuYWJvcnRcblx0XHRcdHhoci5hYm9ydCA9IGZ1bmN0aW9uIGFib3J0KCkge1xuXHRcdFx0XHRhYm9ydGVkID0gdHJ1ZVxuXHRcdFx0XHRfYWJvcnQuY2FsbCh4aHIpXG5cdFx0XHR9XG5cdFx0XHR4aHIub3BlbihhcmdzLm1ldGhvZCwgYXJncy51cmwsIHR5cGVvZiBhcmdzLmFzeW5jID09PSBcImJvb2xlYW5cIiA/IGFyZ3MuYXN5bmMgOiB0cnVlLCB0eXBlb2YgYXJncy51c2VyID09PSBcInN0cmluZ1wiID8gYXJncy51c2VyIDogdW5kZWZpbmVkLCB0eXBlb2YgYXJncy5wYXNzd29yZCA9PT0gXCJzdHJpbmdcIiA/IGFyZ3MucGFzc3dvcmQgOiB1bmRlZmluZWQpXG5cdFx0XHRpZiAoYXJncy5zZXJpYWxpemUgPT09IEpTT04uc3RyaW5naWZ5ICYmIHVzZUJvZHkpIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpXG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJncy5kZXNlcmlhbGl6ZSA9PT0gZGVzZXJpYWxpemUpIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0LypcIilcblx0XHRcdH1cblx0XHRcdGlmIChhcmdzLndpdGhDcmVkZW50aWFscykgeGhyLndpdGhDcmVkZW50aWFscyA9IGFyZ3Mud2l0aENyZWRlbnRpYWxzXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJncy5oZWFkZXJzKSBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChhcmdzLmhlYWRlcnMsIGtleSkpIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBhcmdzLmhlYWRlcnNba2V5XSlcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YgYXJncy5jb25maWcgPT09IFwiZnVuY3Rpb25cIikgeGhyID0gYXJncy5jb25maWcoeGhyLCBhcmdzKSB8fCB4aHJcblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gRG9uJ3QgdGhyb3cgZXJyb3JzIG9uIHhoci5hYm9ydCgpLlxuXHRcdFx0XHRpZihhYm9ydGVkKSByZXR1cm5cblx0XHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhciByZXNwb25zZSA9IChhcmdzLmV4dHJhY3QgIT09IGV4dHJhY3QpID8gYXJncy5leHRyYWN0KHhociwgYXJncykgOiBhcmdzLmRlc2VyaWFsaXplKGFyZ3MuZXh0cmFjdCh4aHIsIGFyZ3MpKVxuXHRcdFx0XHRcdFx0aWYgKCh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB8fCB4aHIuc3RhdHVzID09PSAzMDQgfHwgRklMRV9QUk9UT0NPTF9SRUdFWC50ZXN0KGFyZ3MudXJsKSkge1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGNhc3QoYXJncy50eXBlLCByZXNwb25zZSkpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0gbmV3IEVycm9yKHhoci5yZXNwb25zZVRleHQpXG5cdFx0XHRcdFx0XHRcdGZvciAodmFyIGtleSBpbiByZXNwb25zZSkgZXJyb3Jba2V5XSA9IHJlc3BvbnNlW2tleV1cblx0XHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0cmVqZWN0KGUpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodXNlQm9keSAmJiAoYXJncy5kYXRhICE9IG51bGwpKSB4aHIuc2VuZChhcmdzLmRhdGEpXG5cdFx0XHRlbHNlIHhoci5zZW5kKClcblx0XHR9KVxuXHRcdHJldHVybiBhcmdzLmJhY2tncm91bmQgPT09IHRydWUgPyBwcm9taXNlMCA6IGZpbmFsaXplKHByb21pc2UwKVxuXHR9XG5cdGZ1bmN0aW9uIGpzb25wKGFyZ3MsIGV4dHJhKSB7XG5cdFx0dmFyIGZpbmFsaXplID0gZmluYWxpemVyKClcblx0XHRhcmdzID0gbm9ybWFsaXplKGFyZ3MsIGV4dHJhKVxuXHRcdHZhciBwcm9taXNlMCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0dmFyIGNhbGxiYWNrTmFtZSA9IGFyZ3MuY2FsbGJhY2tOYW1lIHx8IFwiX21pdGhyaWxfXCIgKyBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxZTE2KSArIFwiX1wiICsgY2FsbGJhY2tDb3VudCsrXG5cdFx0XHR2YXIgc2NyaXB0ID0gJHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpXG5cdFx0XHQkd2luZG93W2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdClcblx0XHRcdFx0cmVzb2x2ZShjYXN0KGFyZ3MudHlwZSwgZGF0YSkpXG5cdFx0XHRcdGRlbGV0ZSAkd2luZG93W2NhbGxiYWNrTmFtZV1cblx0XHRcdH1cblx0XHRcdHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdClcblx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIkpTT05QIHJlcXVlc3QgZmFpbGVkXCIpKVxuXHRcdFx0XHRkZWxldGUgJHdpbmRvd1tjYWxsYmFja05hbWVdXG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJncy5kYXRhID09IG51bGwpIGFyZ3MuZGF0YSA9IHt9XG5cdFx0XHRhcmdzLnVybCA9IGludGVycG9sYXRlKGFyZ3MudXJsLCBhcmdzLmRhdGEpXG5cdFx0XHRhcmdzLmRhdGFbYXJncy5jYWxsYmFja0tleSB8fCBcImNhbGxiYWNrXCJdID0gY2FsbGJhY2tOYW1lXG5cdFx0XHRzY3JpcHQuc3JjID0gYXNzZW1ibGUoYXJncy51cmwsIGFyZ3MuZGF0YSlcblx0XHRcdCR3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKHNjcmlwdClcblx0XHR9KVxuXHRcdHJldHVybiBhcmdzLmJhY2tncm91bmQgPT09IHRydWU/IHByb21pc2UwIDogZmluYWxpemUocHJvbWlzZTApXG5cdH1cblx0ZnVuY3Rpb24gaW50ZXJwb2xhdGUodXJsLCBkYXRhKSB7XG5cdFx0aWYgKGRhdGEgPT0gbnVsbCkgcmV0dXJuIHVybFxuXHRcdHZhciB0b2tlbnMgPSB1cmwubWF0Y2goLzpbXlxcL10rL2dpKSB8fCBbXVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIga2V5ID0gdG9rZW5zW2ldLnNsaWNlKDEpXG5cdFx0XHRpZiAoZGF0YVtrZXldICE9IG51bGwpIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UodG9rZW5zW2ldLCBkYXRhW2tleV0pXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB1cmxcblx0fVxuXHRmdW5jdGlvbiBhc3NlbWJsZSh1cmwsIGRhdGEpIHtcblx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKGRhdGEpXG5cdFx0aWYgKHF1ZXJ5c3RyaW5nICE9PSBcIlwiKSB7XG5cdFx0XHR2YXIgcHJlZml4ID0gdXJsLmluZGV4T2YoXCI/XCIpIDwgMCA/IFwiP1wiIDogXCImXCJcblx0XHRcdHVybCArPSBwcmVmaXggKyBxdWVyeXN0cmluZ1xuXHRcdH1cblx0XHRyZXR1cm4gdXJsXG5cdH1cblx0ZnVuY3Rpb24gZGVzZXJpYWxpemUoZGF0YSkge1xuXHRcdHRyeSB7cmV0dXJuIGRhdGEgIT09IFwiXCIgPyBKU09OLnBhcnNlKGRhdGEpIDogbnVsbH1cblx0XHRjYXRjaCAoZSkge3Rocm93IG5ldyBFcnJvcihkYXRhKX1cblx0fVxuXHRmdW5jdGlvbiBleHRyYWN0KHhocikge3JldHVybiB4aHIucmVzcG9uc2VUZXh0fVxuXHRmdW5jdGlvbiBjYXN0KHR5cGUwLCBkYXRhKSB7XG5cdFx0aWYgKHR5cGVvZiB0eXBlMCA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRkYXRhW2ldID0gbmV3IHR5cGUwKGRhdGFbaV0pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgcmV0dXJuIG5ldyB0eXBlMChkYXRhKVxuXHRcdH1cblx0XHRyZXR1cm4gZGF0YVxuXHR9XG5cdHJldHVybiB7cmVxdWVzdDogcmVxdWVzdCwganNvbnA6IGpzb25wLCBzZXRDb21wbGV0aW9uQ2FsbGJhY2s6IHNldENvbXBsZXRpb25DYWxsYmFja31cbn1cbnZhciByZXF1ZXN0U2VydmljZSA9IF84KHdpbmRvdywgUHJvbWlzZVBvbHlmaWxsKVxudmFyIGNvcmVSZW5kZXJlciA9IGZ1bmN0aW9uKCR3aW5kb3cpIHtcblx0dmFyICRkb2MgPSAkd2luZG93LmRvY3VtZW50XG5cdHZhciAkZW1wdHlGcmFnbWVudCA9ICRkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdHZhciBvbmV2ZW50XG5cdGZ1bmN0aW9uIHNldEV2ZW50Q2FsbGJhY2soY2FsbGJhY2spIHtyZXR1cm4gb25ldmVudCA9IGNhbGxiYWNrfVxuXHQvL2NyZWF0ZVxuXHRmdW5jdGlvbiBjcmVhdGVOb2RlcyhwYXJlbnQsIHZub2Rlcywgc3RhcnQsIGVuZCwgaG9va3MsIG5leHRTaWJsaW5nLCBucykge1xuXHRcdGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG5cdFx0XHR2YXIgdm5vZGUgPSB2bm9kZXNbaV1cblx0XHRcdGlmICh2bm9kZSAhPSBudWxsKSB7XG5cdFx0XHRcdGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKSB7XG5cdFx0dmFyIHRhZyA9IHZub2RlLnRhZ1xuXHRcdGlmICh0eXBlb2YgdGFnID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHR2bm9kZS5zdGF0ZSA9IHt9XG5cdFx0XHRpZiAodm5vZGUuYXR0cnMgIT0gbnVsbCkgaW5pdExpZmVjeWNsZSh2bm9kZS5hdHRycywgdm5vZGUsIGhvb2tzKVxuXHRcdFx0c3dpdGNoICh0YWcpIHtcblx0XHRcdFx0Y2FzZSBcIiNcIjogcmV0dXJuIGNyZWF0ZVRleHQocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdGNhc2UgXCI8XCI6IHJldHVybiBjcmVhdGVIVE1MKHBhcmVudCwgdm5vZGUsIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRjYXNlIFwiW1wiOiByZXR1cm4gY3JlYXRlRnJhZ21lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdFx0ZGVmYXVsdDogcmV0dXJuIGNyZWF0ZUVsZW1lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSByZXR1cm4gY3JlYXRlQ29tcG9uZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlVGV4dChwYXJlbnQsIHZub2RlLCBuZXh0U2libGluZykge1xuXHRcdHZub2RlLmRvbSA9ICRkb2MuY3JlYXRlVGV4dE5vZGUodm5vZGUuY2hpbGRyZW4pXG5cdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIHZub2RlLmRvbSwgbmV4dFNpYmxpbmcpXG5cdFx0cmV0dXJuIHZub2RlLmRvbVxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZUhUTUwocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpIHtcblx0XHR2YXIgbWF0Y2gxID0gdm5vZGUuY2hpbGRyZW4ubWF0Y2goL15cXHMqPzwoXFx3KykvaW0pIHx8IFtdXG5cdFx0dmFyIHBhcmVudDEgPSB7Y2FwdGlvbjogXCJ0YWJsZVwiLCB0aGVhZDogXCJ0YWJsZVwiLCB0Ym9keTogXCJ0YWJsZVwiLCB0Zm9vdDogXCJ0YWJsZVwiLCB0cjogXCJ0Ym9keVwiLCB0aDogXCJ0clwiLCB0ZDogXCJ0clwiLCBjb2xncm91cDogXCJ0YWJsZVwiLCBjb2w6IFwiY29sZ3JvdXBcIn1bbWF0Y2gxWzFdXSB8fCBcImRpdlwiXG5cdFx0dmFyIHRlbXAgPSAkZG9jLmNyZWF0ZUVsZW1lbnQocGFyZW50MSlcblx0XHR0ZW1wLmlubmVySFRNTCA9IHZub2RlLmNoaWxkcmVuXG5cdFx0dm5vZGUuZG9tID0gdGVtcC5maXJzdENoaWxkXG5cdFx0dm5vZGUuZG9tU2l6ZSA9IHRlbXAuY2hpbGROb2Rlcy5sZW5ndGhcblx0XHR2YXIgZnJhZ21lbnQgPSAkZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdHZhciBjaGlsZFxuXHRcdHdoaWxlIChjaGlsZCA9IHRlbXAuZmlyc3RDaGlsZCkge1xuXHRcdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpXG5cdFx0fVxuXHRcdGluc2VydE5vZGUocGFyZW50LCBmcmFnbWVudCwgbmV4dFNpYmxpbmcpXG5cdFx0cmV0dXJuIGZyYWdtZW50XG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZykge1xuXHRcdHZhciBmcmFnbWVudCA9ICRkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0aWYgKHZub2RlLmNoaWxkcmVuICE9IG51bGwpIHtcblx0XHRcdHZhciBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG5cdFx0XHRjcmVhdGVOb2RlcyhmcmFnbWVudCwgY2hpbGRyZW4sIDAsIGNoaWxkcmVuLmxlbmd0aCwgaG9va3MsIG51bGwsIG5zKVxuXHRcdH1cblx0XHR2bm9kZS5kb20gPSBmcmFnbWVudC5maXJzdENoaWxkXG5cdFx0dm5vZGUuZG9tU2l6ZSA9IGZyYWdtZW50LmNoaWxkTm9kZXMubGVuZ3RoXG5cdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIGZyYWdtZW50LCBuZXh0U2libGluZylcblx0XHRyZXR1cm4gZnJhZ21lbnRcblx0fVxuXHRmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpIHtcblx0XHR2YXIgdGFnID0gdm5vZGUudGFnXG5cdFx0c3dpdGNoICh2bm9kZS50YWcpIHtcblx0XHRcdGNhc2UgXCJzdmdcIjogbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7IGJyZWFrXG5cdFx0XHRjYXNlIFwibWF0aFwiOiBucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiOyBicmVha1xuXHRcdH1cblx0XHR2YXIgYXR0cnMyID0gdm5vZGUuYXR0cnNcblx0XHR2YXIgaXMgPSBhdHRyczIgJiYgYXR0cnMyLmlzXG5cdFx0dmFyIGVsZW1lbnQgPSBucyA/XG5cdFx0XHRpcyA/ICRkb2MuY3JlYXRlRWxlbWVudE5TKG5zLCB0YWcsIHtpczogaXN9KSA6ICRkb2MuY3JlYXRlRWxlbWVudE5TKG5zLCB0YWcpIDpcblx0XHRcdGlzID8gJGRvYy5jcmVhdGVFbGVtZW50KHRhZywge2lzOiBpc30pIDogJGRvYy5jcmVhdGVFbGVtZW50KHRhZylcblx0XHR2bm9kZS5kb20gPSBlbGVtZW50XG5cdFx0aWYgKGF0dHJzMiAhPSBudWxsKSB7XG5cdFx0XHRzZXRBdHRycyh2bm9kZSwgYXR0cnMyLCBucylcblx0XHR9XG5cdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIGVsZW1lbnQsIG5leHRTaWJsaW5nKVxuXHRcdGlmICh2bm9kZS5hdHRycyAhPSBudWxsICYmIHZub2RlLmF0dHJzLmNvbnRlbnRlZGl0YWJsZSAhPSBudWxsKSB7XG5cdFx0XHRzZXRDb250ZW50RWRpdGFibGUodm5vZGUpXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aWYgKHZub2RlLnRleHQgIT0gbnVsbCkge1xuXHRcdFx0XHRpZiAodm5vZGUudGV4dCAhPT0gXCJcIikgZWxlbWVudC50ZXh0Q29udGVudCA9IHZub2RlLnRleHRcblx0XHRcdFx0ZWxzZSB2bm9kZS5jaGlsZHJlbiA9IFtWbm9kZShcIiNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHZub2RlLnRleHQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKV1cblx0XHRcdH1cblx0XHRcdGlmICh2bm9kZS5jaGlsZHJlbiAhPSBudWxsKSB7XG5cdFx0XHRcdHZhciBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG5cdFx0XHRcdGNyZWF0ZU5vZGVzKGVsZW1lbnQsIGNoaWxkcmVuLCAwLCBjaGlsZHJlbi5sZW5ndGgsIGhvb2tzLCBudWxsLCBucylcblx0XHRcdFx0c2V0TGF0ZUF0dHJzKHZub2RlKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZWxlbWVudFxuXHR9XG5cdGZ1bmN0aW9uIGluaXRDb21wb25lbnQodm5vZGUsIGhvb2tzKSB7XG5cdFx0dmFyIHNlbnRpbmVsXG5cdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcudmlldyA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHR2bm9kZS5zdGF0ZSA9IE9iamVjdC5jcmVhdGUodm5vZGUudGFnKVxuXHRcdFx0c2VudGluZWwgPSB2bm9kZS5zdGF0ZS52aWV3XG5cdFx0XHRpZiAoc2VudGluZWwuJCRyZWVudHJhbnRMb2NrJCQgIT0gbnVsbCkgcmV0dXJuICRlbXB0eUZyYWdtZW50XG5cdFx0XHRzZW50aW5lbC4kJHJlZW50cmFudExvY2skJCA9IHRydWVcblx0XHR9IGVsc2Uge1xuXHRcdFx0dm5vZGUuc3RhdGUgPSB2b2lkIDBcblx0XHRcdHNlbnRpbmVsID0gdm5vZGUudGFnXG5cdFx0XHRpZiAoc2VudGluZWwuJCRyZWVudHJhbnRMb2NrJCQgIT0gbnVsbCkgcmV0dXJuICRlbXB0eUZyYWdtZW50XG5cdFx0XHRzZW50aW5lbC4kJHJlZW50cmFudExvY2skJCA9IHRydWVcblx0XHRcdHZub2RlLnN0YXRlID0gKHZub2RlLnRhZy5wcm90b3R5cGUgIT0gbnVsbCAmJiB0eXBlb2Ygdm5vZGUudGFnLnByb3RvdHlwZS52aWV3ID09PSBcImZ1bmN0aW9uXCIpID8gbmV3IHZub2RlLnRhZyh2bm9kZSkgOiB2bm9kZS50YWcodm5vZGUpXG5cdFx0fVxuXHRcdHZub2RlLl9zdGF0ZSA9IHZub2RlLnN0YXRlXG5cdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIGluaXRMaWZlY3ljbGUodm5vZGUuYXR0cnMsIHZub2RlLCBob29rcylcblx0XHRpbml0TGlmZWN5Y2xlKHZub2RlLl9zdGF0ZSwgdm5vZGUsIGhvb2tzKVxuXHRcdHZub2RlLmluc3RhbmNlID0gVm5vZGUubm9ybWFsaXplKHZub2RlLl9zdGF0ZS52aWV3LmNhbGwodm5vZGUuc3RhdGUsIHZub2RlKSlcblx0XHRpZiAodm5vZGUuaW5zdGFuY2UgPT09IHZub2RlKSB0aHJvdyBFcnJvcihcIkEgdmlldyBjYW5ub3QgcmV0dXJuIHRoZSB2bm9kZSBpdCByZWNlaXZlZCBhcyBhcmd1bWVudFwiKVxuXHRcdHNlbnRpbmVsLiQkcmVlbnRyYW50TG9jayQkID0gbnVsbFxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKSB7XG5cdFx0aW5pdENvbXBvbmVudCh2bm9kZSwgaG9va3MpXG5cdFx0aWYgKHZub2RlLmluc3RhbmNlICE9IG51bGwpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gY3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLmluc3RhbmNlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdFx0dm5vZGUuZG9tID0gdm5vZGUuaW5zdGFuY2UuZG9tXG5cdFx0XHR2bm9kZS5kb21TaXplID0gdm5vZGUuZG9tICE9IG51bGwgPyB2bm9kZS5pbnN0YW5jZS5kb21TaXplIDogMFxuXHRcdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIGVsZW1lbnQsIG5leHRTaWJsaW5nKVxuXHRcdFx0cmV0dXJuIGVsZW1lbnRcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR2bm9kZS5kb21TaXplID0gMFxuXHRcdFx0cmV0dXJuICRlbXB0eUZyYWdtZW50XG5cdFx0fVxuXHR9XG5cdC8vdXBkYXRlXG5cdGZ1bmN0aW9uIHVwZGF0ZU5vZGVzKHBhcmVudCwgb2xkLCB2bm9kZXMsIHJlY3ljbGluZywgaG9va3MsIG5leHRTaWJsaW5nLCBucykge1xuXHRcdGlmIChvbGQgPT09IHZub2RlcyB8fCBvbGQgPT0gbnVsbCAmJiB2bm9kZXMgPT0gbnVsbCkgcmV0dXJuXG5cdFx0ZWxzZSBpZiAob2xkID09IG51bGwpIGNyZWF0ZU5vZGVzKHBhcmVudCwgdm5vZGVzLCAwLCB2bm9kZXMubGVuZ3RoLCBob29rcywgbmV4dFNpYmxpbmcsIHVuZGVmaW5lZClcblx0XHRlbHNlIGlmICh2bm9kZXMgPT0gbnVsbCkgcmVtb3ZlTm9kZXMob2xkLCAwLCBvbGQubGVuZ3RoLCB2bm9kZXMpXG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAob2xkLmxlbmd0aCA9PT0gdm5vZGVzLmxlbmd0aCkge1xuXHRcdFx0XHR2YXIgaXNVbmtleWVkID0gZmFsc2Vcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2bm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAodm5vZGVzW2ldICE9IG51bGwgJiYgb2xkW2ldICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGlzVW5rZXllZCA9IHZub2Rlc1tpXS5rZXkgPT0gbnVsbCAmJiBvbGRbaV0ua2V5ID09IG51bGxcblx0XHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChpc1Vua2V5ZWQpIHtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG9sZC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYgKG9sZFtpXSA9PT0gdm5vZGVzW2ldKSBjb250aW51ZVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAob2xkW2ldID09IG51bGwgJiYgdm5vZGVzW2ldICE9IG51bGwpIGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZXNbaV0sIGhvb2tzLCBucywgZ2V0TmV4dFNpYmxpbmcob2xkLCBpICsgMSwgbmV4dFNpYmxpbmcpKVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAodm5vZGVzW2ldID09IG51bGwpIHJlbW92ZU5vZGVzKG9sZCwgaSwgaSArIDEsIHZub2Rlcylcblx0XHRcdFx0XHRcdGVsc2UgdXBkYXRlTm9kZShwYXJlbnQsIG9sZFtpXSwgdm5vZGVzW2ldLCBob29rcywgZ2V0TmV4dFNpYmxpbmcob2xkLCBpICsgMSwgbmV4dFNpYmxpbmcpLCByZWN5Y2xpbmcsIG5zKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmVjeWNsaW5nID0gcmVjeWNsaW5nIHx8IGlzUmVjeWNsYWJsZShvbGQsIHZub2Rlcylcblx0XHRcdGlmIChyZWN5Y2xpbmcpIHtcblx0XHRcdFx0dmFyIHBvb2wgPSBvbGQucG9vbFxuXHRcdFx0XHRvbGQgPSBvbGQuY29uY2F0KG9sZC5wb29sKVxuXHRcdFx0fVxuXHRcdFx0dmFyIG9sZFN0YXJ0ID0gMCwgc3RhcnQgPSAwLCBvbGRFbmQgPSBvbGQubGVuZ3RoIC0gMSwgZW5kID0gdm5vZGVzLmxlbmd0aCAtIDEsIG1hcFxuXHRcdFx0d2hpbGUgKG9sZEVuZCA+PSBvbGRTdGFydCAmJiBlbmQgPj0gc3RhcnQpIHtcblx0XHRcdFx0dmFyIG8gPSBvbGRbb2xkU3RhcnRdLCB2ID0gdm5vZGVzW3N0YXJ0XVxuXHRcdFx0XHRpZiAobyA9PT0gdiAmJiAhcmVjeWNsaW5nKSBvbGRTdGFydCsrLCBzdGFydCsrXG5cdFx0XHRcdGVsc2UgaWYgKG8gPT0gbnVsbCkgb2xkU3RhcnQrK1xuXHRcdFx0XHRlbHNlIGlmICh2ID09IG51bGwpIHN0YXJ0Kytcblx0XHRcdFx0ZWxzZSBpZiAoby5rZXkgPT09IHYua2V5KSB7XG5cdFx0XHRcdFx0dmFyIHNob3VsZFJlY3ljbGUgPSAocG9vbCAhPSBudWxsICYmIG9sZFN0YXJ0ID49IG9sZC5sZW5ndGggLSBwb29sLmxlbmd0aCkgfHwgKChwb29sID09IG51bGwpICYmIHJlY3ljbGluZylcblx0XHRcdFx0XHRvbGRTdGFydCsrLCBzdGFydCsrXG5cdFx0XHRcdFx0dXBkYXRlTm9kZShwYXJlbnQsIG8sIHYsIGhvb2tzLCBnZXROZXh0U2libGluZyhvbGQsIG9sZFN0YXJ0LCBuZXh0U2libGluZyksIHNob3VsZFJlY3ljbGUsIG5zKVxuXHRcdFx0XHRcdGlmIChyZWN5Y2xpbmcgJiYgby50YWcgPT09IHYudGFnKSBpbnNlcnROb2RlKHBhcmVudCwgdG9GcmFnbWVudChvKSwgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmFyIG8gPSBvbGRbb2xkRW5kXVxuXHRcdFx0XHRcdGlmIChvID09PSB2ICYmICFyZWN5Y2xpbmcpIG9sZEVuZC0tLCBzdGFydCsrXG5cdFx0XHRcdFx0ZWxzZSBpZiAobyA9PSBudWxsKSBvbGRFbmQtLVxuXHRcdFx0XHRcdGVsc2UgaWYgKHYgPT0gbnVsbCkgc3RhcnQrK1xuXHRcdFx0XHRcdGVsc2UgaWYgKG8ua2V5ID09PSB2LmtleSkge1xuXHRcdFx0XHRcdFx0dmFyIHNob3VsZFJlY3ljbGUgPSAocG9vbCAhPSBudWxsICYmIG9sZEVuZCA+PSBvbGQubGVuZ3RoIC0gcG9vbC5sZW5ndGgpIHx8ICgocG9vbCA9PSBudWxsKSAmJiByZWN5Y2xpbmcpXG5cdFx0XHRcdFx0XHR1cGRhdGVOb2RlKHBhcmVudCwgbywgdiwgaG9va3MsIGdldE5leHRTaWJsaW5nKG9sZCwgb2xkRW5kICsgMSwgbmV4dFNpYmxpbmcpLCBzaG91bGRSZWN5Y2xlLCBucylcblx0XHRcdFx0XHRcdGlmIChyZWN5Y2xpbmcgfHwgc3RhcnQgPCBlbmQpIGluc2VydE5vZGUocGFyZW50LCB0b0ZyYWdtZW50KG8pLCBnZXROZXh0U2libGluZyhvbGQsIG9sZFN0YXJ0LCBuZXh0U2libGluZykpXG5cdFx0XHRcdFx0XHRvbGRFbmQtLSwgc3RhcnQrK1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGJyZWFrXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHdoaWxlIChvbGRFbmQgPj0gb2xkU3RhcnQgJiYgZW5kID49IHN0YXJ0KSB7XG5cdFx0XHRcdHZhciBvID0gb2xkW29sZEVuZF0sIHYgPSB2bm9kZXNbZW5kXVxuXHRcdFx0XHRpZiAobyA9PT0gdiAmJiAhcmVjeWNsaW5nKSBvbGRFbmQtLSwgZW5kLS1cblx0XHRcdFx0ZWxzZSBpZiAobyA9PSBudWxsKSBvbGRFbmQtLVxuXHRcdFx0XHRlbHNlIGlmICh2ID09IG51bGwpIGVuZC0tXG5cdFx0XHRcdGVsc2UgaWYgKG8ua2V5ID09PSB2LmtleSkge1xuXHRcdFx0XHRcdHZhciBzaG91bGRSZWN5Y2xlID0gKHBvb2wgIT0gbnVsbCAmJiBvbGRFbmQgPj0gb2xkLmxlbmd0aCAtIHBvb2wubGVuZ3RoKSB8fCAoKHBvb2wgPT0gbnVsbCkgJiYgcmVjeWNsaW5nKVxuXHRcdFx0XHRcdHVwZGF0ZU5vZGUocGFyZW50LCBvLCB2LCBob29rcywgZ2V0TmV4dFNpYmxpbmcob2xkLCBvbGRFbmQgKyAxLCBuZXh0U2libGluZyksIHNob3VsZFJlY3ljbGUsIG5zKVxuXHRcdFx0XHRcdGlmIChyZWN5Y2xpbmcgJiYgby50YWcgPT09IHYudGFnKSBpbnNlcnROb2RlKHBhcmVudCwgdG9GcmFnbWVudChvKSwgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdFx0aWYgKG8uZG9tICE9IG51bGwpIG5leHRTaWJsaW5nID0gby5kb21cblx0XHRcdFx0XHRvbGRFbmQtLSwgZW5kLS1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRpZiAoIW1hcCkgbWFwID0gZ2V0S2V5TWFwKG9sZCwgb2xkRW5kKVxuXHRcdFx0XHRcdGlmICh2ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdHZhciBvbGRJbmRleCA9IG1hcFt2LmtleV1cblx0XHRcdFx0XHRcdGlmIChvbGRJbmRleCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBtb3ZhYmxlID0gb2xkW29sZEluZGV4XVxuXHRcdFx0XHRcdFx0XHR2YXIgc2hvdWxkUmVjeWNsZSA9IChwb29sICE9IG51bGwgJiYgb2xkSW5kZXggPj0gb2xkLmxlbmd0aCAtIHBvb2wubGVuZ3RoKSB8fCAoKHBvb2wgPT0gbnVsbCkgJiYgcmVjeWNsaW5nKVxuXHRcdFx0XHRcdFx0XHR1cGRhdGVOb2RlKHBhcmVudCwgbW92YWJsZSwgdiwgaG9va3MsIGdldE5leHRTaWJsaW5nKG9sZCwgb2xkRW5kICsgMSwgbmV4dFNpYmxpbmcpLCByZWN5Y2xpbmcsIG5zKVxuXHRcdFx0XHRcdFx0XHRpbnNlcnROb2RlKHBhcmVudCwgdG9GcmFnbWVudChtb3ZhYmxlKSwgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdFx0XHRcdG9sZFtvbGRJbmRleF0uc2tpcCA9IHRydWVcblx0XHRcdFx0XHRcdFx0aWYgKG1vdmFibGUuZG9tICE9IG51bGwpIG5leHRTaWJsaW5nID0gbW92YWJsZS5kb21cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR2YXIgZG9tID0gY3JlYXRlTm9kZShwYXJlbnQsIHYsIGhvb2tzLCB1bmRlZmluZWQsIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdFx0XHRuZXh0U2libGluZyA9IGRvbVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbmQtLVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChlbmQgPCBzdGFydCkgYnJlYWtcblx0XHRcdH1cblx0XHRcdGNyZWF0ZU5vZGVzKHBhcmVudCwgdm5vZGVzLCBzdGFydCwgZW5kICsgMSwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHRcdHJlbW92ZU5vZGVzKG9sZCwgb2xkU3RhcnQsIG9sZEVuZCArIDEsIHZub2Rlcylcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlTm9kZShwYXJlbnQsIG9sZCwgdm5vZGUsIGhvb2tzLCBuZXh0U2libGluZywgcmVjeWNsaW5nLCBucykge1xuXHRcdHZhciBvbGRUYWcgPSBvbGQudGFnLCB0YWcgPSB2bm9kZS50YWdcblx0XHRpZiAob2xkVGFnID09PSB0YWcpIHtcblx0XHRcdHZub2RlLnN0YXRlID0gb2xkLnN0YXRlXG5cdFx0XHR2bm9kZS5fc3RhdGUgPSBvbGQuX3N0YXRlXG5cdFx0XHR2bm9kZS5ldmVudHMgPSBvbGQuZXZlbnRzXG5cdFx0XHRpZiAoIXJlY3ljbGluZyAmJiBzaG91bGROb3RVcGRhdGUodm5vZGUsIG9sZCkpIHJldHVyblxuXHRcdFx0aWYgKHR5cGVvZiBvbGRUYWcgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIHtcblx0XHRcdFx0XHRpZiAocmVjeWNsaW5nKSB7XG5cdFx0XHRcdFx0XHR2bm9kZS5zdGF0ZSA9IHt9XG5cdFx0XHRcdFx0XHRpbml0TGlmZWN5Y2xlKHZub2RlLmF0dHJzLCB2bm9kZSwgaG9va3MpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgdXBkYXRlTGlmZWN5Y2xlKHZub2RlLmF0dHJzLCB2bm9kZSwgaG9va3MpXG5cdFx0XHRcdH1cblx0XHRcdFx0c3dpdGNoIChvbGRUYWcpIHtcblx0XHRcdFx0XHRjYXNlIFwiI1wiOiB1cGRhdGVUZXh0KG9sZCwgdm5vZGUpOyBicmVha1xuXHRcdFx0XHRcdGNhc2UgXCI8XCI6IHVwZGF0ZUhUTUwocGFyZW50LCBvbGQsIHZub2RlLCBuZXh0U2libGluZyk7IGJyZWFrXG5cdFx0XHRcdFx0Y2FzZSBcIltcIjogdXBkYXRlRnJhZ21lbnQocGFyZW50LCBvbGQsIHZub2RlLCByZWN5Y2xpbmcsIGhvb2tzLCBuZXh0U2libGluZywgbnMpOyBicmVha1xuXHRcdFx0XHRcdGRlZmF1bHQ6IHVwZGF0ZUVsZW1lbnQob2xkLCB2bm9kZSwgcmVjeWNsaW5nLCBob29rcywgbnMpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgdXBkYXRlQ29tcG9uZW50KHBhcmVudCwgb2xkLCB2bm9kZSwgaG9va3MsIG5leHRTaWJsaW5nLCByZWN5Y2xpbmcsIG5zKVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJlbW92ZU5vZGUob2xkLCBudWxsKVxuXHRcdFx0Y3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVUZXh0KG9sZCwgdm5vZGUpIHtcblx0XHRpZiAob2xkLmNoaWxkcmVuLnRvU3RyaW5nKCkgIT09IHZub2RlLmNoaWxkcmVuLnRvU3RyaW5nKCkpIHtcblx0XHRcdG9sZC5kb20ubm9kZVZhbHVlID0gdm5vZGUuY2hpbGRyZW5cblx0XHR9XG5cdFx0dm5vZGUuZG9tID0gb2xkLmRvbVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUhUTUwocGFyZW50LCBvbGQsIHZub2RlLCBuZXh0U2libGluZykge1xuXHRcdGlmIChvbGQuY2hpbGRyZW4gIT09IHZub2RlLmNoaWxkcmVuKSB7XG5cdFx0XHR0b0ZyYWdtZW50KG9sZClcblx0XHRcdGNyZWF0ZUhUTUwocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpXG5cdFx0fVxuXHRcdGVsc2Ugdm5vZGUuZG9tID0gb2xkLmRvbSwgdm5vZGUuZG9tU2l6ZSA9IG9sZC5kb21TaXplXG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlRnJhZ21lbnQocGFyZW50LCBvbGQsIHZub2RlLCByZWN5Y2xpbmcsIGhvb2tzLCBuZXh0U2libGluZywgbnMpIHtcblx0XHR1cGRhdGVOb2RlcyhwYXJlbnQsIG9sZC5jaGlsZHJlbiwgdm5vZGUuY2hpbGRyZW4sIHJlY3ljbGluZywgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHR2YXIgZG9tU2l6ZSA9IDAsIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHR2bm9kZS5kb20gPSBudWxsXG5cdFx0aWYgKGNoaWxkcmVuICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIGNoaWxkID0gY2hpbGRyZW5baV1cblx0XHRcdFx0aWYgKGNoaWxkICE9IG51bGwgJiYgY2hpbGQuZG9tICE9IG51bGwpIHtcblx0XHRcdFx0XHRpZiAodm5vZGUuZG9tID09IG51bGwpIHZub2RlLmRvbSA9IGNoaWxkLmRvbVxuXHRcdFx0XHRcdGRvbVNpemUgKz0gY2hpbGQuZG9tU2l6ZSB8fCAxXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChkb21TaXplICE9PSAxKSB2bm9kZS5kb21TaXplID0gZG9tU2l6ZVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVFbGVtZW50KG9sZCwgdm5vZGUsIHJlY3ljbGluZywgaG9va3MsIG5zKSB7XG5cdFx0dmFyIGVsZW1lbnQgPSB2bm9kZS5kb20gPSBvbGQuZG9tXG5cdFx0c3dpdGNoICh2bm9kZS50YWcpIHtcblx0XHRcdGNhc2UgXCJzdmdcIjogbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7IGJyZWFrXG5cdFx0XHRjYXNlIFwibWF0aFwiOiBucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiOyBicmVha1xuXHRcdH1cblx0XHRpZiAodm5vZGUudGFnID09PSBcInRleHRhcmVhXCIpIHtcblx0XHRcdGlmICh2bm9kZS5hdHRycyA9PSBudWxsKSB2bm9kZS5hdHRycyA9IHt9XG5cdFx0XHRpZiAodm5vZGUudGV4dCAhPSBudWxsKSB7XG5cdFx0XHRcdHZub2RlLmF0dHJzLnZhbHVlID0gdm5vZGUudGV4dCAvL0ZJWE1FIGhhbmRsZTAgbXVsdGlwbGUgY2hpbGRyZW5cblx0XHRcdFx0dm5vZGUudGV4dCA9IHVuZGVmaW5lZFxuXHRcdFx0fVxuXHRcdH1cblx0XHR1cGRhdGVBdHRycyh2bm9kZSwgb2xkLmF0dHJzLCB2bm9kZS5hdHRycywgbnMpXG5cdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwgJiYgdm5vZGUuYXR0cnMuY29udGVudGVkaXRhYmxlICE9IG51bGwpIHtcblx0XHRcdHNldENvbnRlbnRFZGl0YWJsZSh2bm9kZSlcblx0XHR9XG5cdFx0ZWxzZSBpZiAob2xkLnRleHQgIT0gbnVsbCAmJiB2bm9kZS50ZXh0ICE9IG51bGwgJiYgdm5vZGUudGV4dCAhPT0gXCJcIikge1xuXHRcdFx0aWYgKG9sZC50ZXh0LnRvU3RyaW5nKCkgIT09IHZub2RlLnRleHQudG9TdHJpbmcoKSkgb2xkLmRvbS5maXJzdENoaWxkLm5vZGVWYWx1ZSA9IHZub2RlLnRleHRcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAob2xkLnRleHQgIT0gbnVsbCkgb2xkLmNoaWxkcmVuID0gW1Zub2RlKFwiI1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgb2xkLnRleHQsIHVuZGVmaW5lZCwgb2xkLmRvbS5maXJzdENoaWxkKV1cblx0XHRcdGlmICh2bm9kZS50ZXh0ICE9IG51bGwpIHZub2RlLmNoaWxkcmVuID0gW1Zub2RlKFwiI1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdm5vZGUudGV4dCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpXVxuXHRcdFx0dXBkYXRlTm9kZXMoZWxlbWVudCwgb2xkLmNoaWxkcmVuLCB2bm9kZS5jaGlsZHJlbiwgcmVjeWNsaW5nLCBob29rcywgbnVsbCwgbnMpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUNvbXBvbmVudChwYXJlbnQsIG9sZCwgdm5vZGUsIGhvb2tzLCBuZXh0U2libGluZywgcmVjeWNsaW5nLCBucykge1xuXHRcdGlmIChyZWN5Y2xpbmcpIHtcblx0XHRcdGluaXRDb21wb25lbnQodm5vZGUsIGhvb2tzKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2bm9kZS5pbnN0YW5jZSA9IFZub2RlLm5vcm1hbGl6ZSh2bm9kZS5fc3RhdGUudmlldy5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSkpXG5cdFx0XHRpZiAodm5vZGUuaW5zdGFuY2UgPT09IHZub2RlKSB0aHJvdyBFcnJvcihcIkEgdmlldyBjYW5ub3QgcmV0dXJuIHRoZSB2bm9kZSBpdCByZWNlaXZlZCBhcyBhcmd1bWVudFwiKVxuXHRcdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIHVwZGF0ZUxpZmVjeWNsZSh2bm9kZS5hdHRycywgdm5vZGUsIGhvb2tzKVxuXHRcdFx0dXBkYXRlTGlmZWN5Y2xlKHZub2RlLl9zdGF0ZSwgdm5vZGUsIGhvb2tzKVxuXHRcdH1cblx0XHRpZiAodm5vZGUuaW5zdGFuY2UgIT0gbnVsbCkge1xuXHRcdFx0aWYgKG9sZC5pbnN0YW5jZSA9PSBudWxsKSBjcmVhdGVOb2RlKHBhcmVudCwgdm5vZGUuaW5zdGFuY2UsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHRlbHNlIHVwZGF0ZU5vZGUocGFyZW50LCBvbGQuaW5zdGFuY2UsIHZub2RlLmluc3RhbmNlLCBob29rcywgbmV4dFNpYmxpbmcsIHJlY3ljbGluZywgbnMpXG5cdFx0XHR2bm9kZS5kb20gPSB2bm9kZS5pbnN0YW5jZS5kb21cblx0XHRcdHZub2RlLmRvbVNpemUgPSB2bm9kZS5pbnN0YW5jZS5kb21TaXplXG5cdFx0fVxuXHRcdGVsc2UgaWYgKG9sZC5pbnN0YW5jZSAhPSBudWxsKSB7XG5cdFx0XHRyZW1vdmVOb2RlKG9sZC5pbnN0YW5jZSwgbnVsbClcblx0XHRcdHZub2RlLmRvbSA9IHVuZGVmaW5lZFxuXHRcdFx0dm5vZGUuZG9tU2l6ZSA9IDBcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR2bm9kZS5kb20gPSBvbGQuZG9tXG5cdFx0XHR2bm9kZS5kb21TaXplID0gb2xkLmRvbVNpemVcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gaXNSZWN5Y2xhYmxlKG9sZCwgdm5vZGVzKSB7XG5cdFx0aWYgKG9sZC5wb29sICE9IG51bGwgJiYgTWF0aC5hYnMob2xkLnBvb2wubGVuZ3RoIC0gdm5vZGVzLmxlbmd0aCkgPD0gTWF0aC5hYnMob2xkLmxlbmd0aCAtIHZub2Rlcy5sZW5ndGgpKSB7XG5cdFx0XHR2YXIgb2xkQ2hpbGRyZW5MZW5ndGggPSBvbGRbMF0gJiYgb2xkWzBdLmNoaWxkcmVuICYmIG9sZFswXS5jaGlsZHJlbi5sZW5ndGggfHwgMFxuXHRcdFx0dmFyIHBvb2xDaGlsZHJlbkxlbmd0aCA9IG9sZC5wb29sWzBdICYmIG9sZC5wb29sWzBdLmNoaWxkcmVuICYmIG9sZC5wb29sWzBdLmNoaWxkcmVuLmxlbmd0aCB8fCAwXG5cdFx0XHR2YXIgdm5vZGVzQ2hpbGRyZW5MZW5ndGggPSB2bm9kZXNbMF0gJiYgdm5vZGVzWzBdLmNoaWxkcmVuICYmIHZub2Rlc1swXS5jaGlsZHJlbi5sZW5ndGggfHwgMFxuXHRcdFx0aWYgKE1hdGguYWJzKHBvb2xDaGlsZHJlbkxlbmd0aCAtIHZub2Rlc0NoaWxkcmVuTGVuZ3RoKSA8PSBNYXRoLmFicyhvbGRDaGlsZHJlbkxlbmd0aCAtIHZub2Rlc0NoaWxkcmVuTGVuZ3RoKSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxuXHRmdW5jdGlvbiBnZXRLZXlNYXAodm5vZGVzLCBlbmQpIHtcblx0XHR2YXIgbWFwID0ge30sIGkgPSAwXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBlbmQ7IGkrKykge1xuXHRcdFx0dmFyIHZub2RlID0gdm5vZGVzW2ldXG5cdFx0XHRpZiAodm5vZGUgIT0gbnVsbCkge1xuXHRcdFx0XHR2YXIga2V5MiA9IHZub2RlLmtleVxuXHRcdFx0XHRpZiAoa2V5MiAhPSBudWxsKSBtYXBba2V5Ml0gPSBpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBtYXBcblx0fVxuXHRmdW5jdGlvbiB0b0ZyYWdtZW50KHZub2RlKSB7XG5cdFx0dmFyIGNvdW50MCA9IHZub2RlLmRvbVNpemVcblx0XHRpZiAoY291bnQwICE9IG51bGwgfHwgdm5vZGUuZG9tID09IG51bGwpIHtcblx0XHRcdHZhciBmcmFnbWVudCA9ICRkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0XHRpZiAoY291bnQwID4gMCkge1xuXHRcdFx0XHR2YXIgZG9tID0gdm5vZGUuZG9tXG5cdFx0XHRcdHdoaWxlICgtLWNvdW50MCkgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZG9tLm5leHRTaWJsaW5nKVxuXHRcdFx0XHRmcmFnbWVudC5pbnNlcnRCZWZvcmUoZG9tLCBmcmFnbWVudC5maXJzdENoaWxkKVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWdtZW50XG5cdFx0fVxuXHRcdGVsc2UgcmV0dXJuIHZub2RlLmRvbVxuXHR9XG5cdGZ1bmN0aW9uIGdldE5leHRTaWJsaW5nKHZub2RlcywgaSwgbmV4dFNpYmxpbmcpIHtcblx0XHRmb3IgKDsgaSA8IHZub2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHZub2Rlc1tpXSAhPSBudWxsICYmIHZub2Rlc1tpXS5kb20gIT0gbnVsbCkgcmV0dXJuIHZub2Rlc1tpXS5kb21cblx0XHR9XG5cdFx0cmV0dXJuIG5leHRTaWJsaW5nXG5cdH1cblx0ZnVuY3Rpb24gaW5zZXJ0Tm9kZShwYXJlbnQsIGRvbSwgbmV4dFNpYmxpbmcpIHtcblx0XHRpZiAobmV4dFNpYmxpbmcgJiYgbmV4dFNpYmxpbmcucGFyZW50Tm9kZSkgcGFyZW50Lmluc2VydEJlZm9yZShkb20sIG5leHRTaWJsaW5nKVxuXHRcdGVsc2UgcGFyZW50LmFwcGVuZENoaWxkKGRvbSlcblx0fVxuXHRmdW5jdGlvbiBzZXRDb250ZW50RWRpdGFibGUodm5vZGUpIHtcblx0XHR2YXIgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlblxuXHRcdGlmIChjaGlsZHJlbiAhPSBudWxsICYmIGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJiBjaGlsZHJlblswXS50YWcgPT09IFwiPFwiKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNoaWxkcmVuWzBdLmNoaWxkcmVuXG5cdFx0XHRpZiAodm5vZGUuZG9tLmlubmVySFRNTCAhPT0gY29udGVudCkgdm5vZGUuZG9tLmlubmVySFRNTCA9IGNvbnRlbnRcblx0XHR9XG5cdFx0ZWxzZSBpZiAodm5vZGUudGV4dCAhPSBudWxsIHx8IGNoaWxkcmVuICE9IG51bGwgJiYgY2hpbGRyZW4ubGVuZ3RoICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZCBub2RlIG9mIGEgY29udGVudGVkaXRhYmxlIG11c3QgYmUgdHJ1c3RlZFwiKVxuXHR9XG5cdC8vcmVtb3ZlXG5cdGZ1bmN0aW9uIHJlbW92ZU5vZGVzKHZub2Rlcywgc3RhcnQsIGVuZCwgY29udGV4dCkge1xuXHRcdGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG5cdFx0XHR2YXIgdm5vZGUgPSB2bm9kZXNbaV1cblx0XHRcdGlmICh2bm9kZSAhPSBudWxsKSB7XG5cdFx0XHRcdGlmICh2bm9kZS5za2lwKSB2bm9kZS5za2lwID0gZmFsc2Vcblx0XHRcdFx0ZWxzZSByZW1vdmVOb2RlKHZub2RlLCBjb250ZXh0KVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiByZW1vdmVOb2RlKHZub2RlLCBjb250ZXh0KSB7XG5cdFx0dmFyIGV4cGVjdGVkID0gMSwgY2FsbGVkID0gMFxuXHRcdGlmICh2bm9kZS5hdHRycyAmJiB0eXBlb2Ygdm5vZGUuYXR0cnMub25iZWZvcmVyZW1vdmUgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dmFyIHJlc3VsdCA9IHZub2RlLmF0dHJzLm9uYmVmb3JlcmVtb3ZlLmNhbGwodm5vZGUuc3RhdGUsIHZub2RlKVxuXHRcdFx0aWYgKHJlc3VsdCAhPSBudWxsICYmIHR5cGVvZiByZXN1bHQudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdGV4cGVjdGVkKytcblx0XHRcdFx0cmVzdWx0LnRoZW4oY29udGludWF0aW9uLCBjb250aW51YXRpb24pXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiB2bm9kZS5fc3RhdGUub25iZWZvcmVyZW1vdmUgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dmFyIHJlc3VsdCA9IHZub2RlLl9zdGF0ZS5vbmJlZm9yZXJlbW92ZS5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSlcblx0XHRcdGlmIChyZXN1bHQgIT0gbnVsbCAmJiB0eXBlb2YgcmVzdWx0LnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRleHBlY3RlZCsrXG5cdFx0XHRcdHJlc3VsdC50aGVuKGNvbnRpbnVhdGlvbiwgY29udGludWF0aW9uKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRjb250aW51YXRpb24oKVxuXHRcdGZ1bmN0aW9uIGNvbnRpbnVhdGlvbigpIHtcblx0XHRcdGlmICgrK2NhbGxlZCA9PT0gZXhwZWN0ZWQpIHtcblx0XHRcdFx0b25yZW1vdmUodm5vZGUpXG5cdFx0XHRcdGlmICh2bm9kZS5kb20pIHtcblx0XHRcdFx0XHR2YXIgY291bnQwID0gdm5vZGUuZG9tU2l6ZSB8fCAxXG5cdFx0XHRcdFx0aWYgKGNvdW50MCA+IDEpIHtcblx0XHRcdFx0XHRcdHZhciBkb20gPSB2bm9kZS5kb21cblx0XHRcdFx0XHRcdHdoaWxlICgtLWNvdW50MCkge1xuXHRcdFx0XHRcdFx0XHRyZW1vdmVOb2RlRnJvbURPTShkb20ubmV4dFNpYmxpbmcpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlbW92ZU5vZGVGcm9tRE9NKHZub2RlLmRvbSlcblx0XHRcdFx0XHRpZiAoY29udGV4dCAhPSBudWxsICYmIHZub2RlLmRvbVNpemUgPT0gbnVsbCAmJiAhaGFzSW50ZWdyYXRpb25NZXRob2RzKHZub2RlLmF0dHJzKSAmJiB0eXBlb2Ygdm5vZGUudGFnID09PSBcInN0cmluZ1wiKSB7IC8vVE9ETyB0ZXN0IGN1c3RvbSBlbGVtZW50c1xuXHRcdFx0XHRcdFx0aWYgKCFjb250ZXh0LnBvb2wpIGNvbnRleHQucG9vbCA9IFt2bm9kZV1cblx0XHRcdFx0XHRcdGVsc2UgY29udGV4dC5wb29sLnB1c2godm5vZGUpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHJlbW92ZU5vZGVGcm9tRE9NKG5vZGUpIHtcblx0XHR2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnROb2RlXG5cdFx0aWYgKHBhcmVudCAhPSBudWxsKSBwYXJlbnQucmVtb3ZlQ2hpbGQobm9kZSlcblx0fVxuXHRmdW5jdGlvbiBvbnJlbW92ZSh2bm9kZSkge1xuXHRcdGlmICh2bm9kZS5hdHRycyAmJiB0eXBlb2Ygdm5vZGUuYXR0cnMub25yZW1vdmUgPT09IFwiZnVuY3Rpb25cIikgdm5vZGUuYXR0cnMub25yZW1vdmUuY2FsbCh2bm9kZS5zdGF0ZSwgdm5vZGUpXG5cdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHZub2RlLl9zdGF0ZS5vbnJlbW92ZSA9PT0gXCJmdW5jdGlvblwiKSB2bm9kZS5fc3RhdGUub25yZW1vdmUuY2FsbCh2bm9kZS5zdGF0ZSwgdm5vZGUpXG5cdFx0aWYgKHZub2RlLmluc3RhbmNlICE9IG51bGwpIG9ucmVtb3ZlKHZub2RlLmluc3RhbmNlKVxuXHRcdGVsc2Uge1xuXHRcdFx0dmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0dmFyIGNoaWxkID0gY2hpbGRyZW5baV1cblx0XHRcdFx0XHRpZiAoY2hpbGQgIT0gbnVsbCkgb25yZW1vdmUoY2hpbGQpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Ly9hdHRyczJcblx0ZnVuY3Rpb24gc2V0QXR0cnModm5vZGUsIGF0dHJzMiwgbnMpIHtcblx0XHRmb3IgKHZhciBrZXkyIGluIGF0dHJzMikge1xuXHRcdFx0c2V0QXR0cih2bm9kZSwga2V5MiwgbnVsbCwgYXR0cnMyW2tleTJdLCBucylcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gc2V0QXR0cih2bm9kZSwga2V5Miwgb2xkLCB2YWx1ZSwgbnMpIHtcblx0XHR2YXIgZWxlbWVudCA9IHZub2RlLmRvbVxuXHRcdGlmIChrZXkyID09PSBcImtleVwiIHx8IGtleTIgPT09IFwiaXNcIiB8fCAob2xkID09PSB2YWx1ZSAmJiAhaXNGb3JtQXR0cmlidXRlKHZub2RlLCBrZXkyKSkgJiYgdHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBpc0xpZmVjeWNsZU1ldGhvZChrZXkyKSkgcmV0dXJuXG5cdFx0dmFyIG5zTGFzdEluZGV4ID0ga2V5Mi5pbmRleE9mKFwiOlwiKVxuXHRcdGlmIChuc0xhc3RJbmRleCA+IC0xICYmIGtleTIuc3Vic3RyKDAsIG5zTGFzdEluZGV4KSA9PT0gXCJ4bGlua1wiKSB7XG5cdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLCBrZXkyLnNsaWNlKG5zTGFzdEluZGV4ICsgMSksIHZhbHVlKVxuXHRcdH1cblx0XHRlbHNlIGlmIChrZXkyWzBdID09PSBcIm9cIiAmJiBrZXkyWzFdID09PSBcIm5cIiAmJiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikgdXBkYXRlRXZlbnQodm5vZGUsIGtleTIsIHZhbHVlKVxuXHRcdGVsc2UgaWYgKGtleTIgPT09IFwic3R5bGVcIikgdXBkYXRlU3R5bGUoZWxlbWVudCwgb2xkLCB2YWx1ZSlcblx0XHRlbHNlIGlmIChrZXkyIGluIGVsZW1lbnQgJiYgIWlzQXR0cmlidXRlKGtleTIpICYmIG5zID09PSB1bmRlZmluZWQgJiYgIWlzQ3VzdG9tRWxlbWVudCh2bm9kZSkpIHtcblx0XHRcdC8vc2V0dGluZyBpbnB1dFt2YWx1ZV0gdG8gc2FtZSB2YWx1ZSBieSB0eXBpbmcgb24gZm9jdXNlZCBlbGVtZW50IG1vdmVzIGN1cnNvciB0byBlbmQgaW4gQ2hyb21lXG5cdFx0XHRpZiAodm5vZGUudGFnID09PSBcImlucHV0XCIgJiYga2V5MiA9PT0gXCJ2YWx1ZVwiICYmIHZub2RlLmRvbS52YWx1ZSA9PSB2YWx1ZSAmJiB2bm9kZS5kb20gPT09ICRkb2MuYWN0aXZlRWxlbWVudCkgcmV0dXJuXG5cdFx0XHQvL3NldHRpbmcgc2VsZWN0W3ZhbHVlXSB0byBzYW1lIHZhbHVlIHdoaWxlIGhhdmluZyBzZWxlY3Qgb3BlbiBibGlua3Mgc2VsZWN0IGRyb3Bkb3duIGluIENocm9tZVxuXHRcdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJzZWxlY3RcIiAmJiBrZXkyID09PSBcInZhbHVlXCIgJiYgdm5vZGUuZG9tLnZhbHVlID09IHZhbHVlICYmIHZub2RlLmRvbSA9PT0gJGRvYy5hY3RpdmVFbGVtZW50KSByZXR1cm5cblx0XHRcdC8vc2V0dGluZyBvcHRpb25bdmFsdWVdIHRvIHNhbWUgdmFsdWUgd2hpbGUgaGF2aW5nIHNlbGVjdCBvcGVuIGJsaW5rcyBzZWxlY3QgZHJvcGRvd24gaW4gQ2hyb21lXG5cdFx0XHRpZiAodm5vZGUudGFnID09PSBcIm9wdGlvblwiICYmIGtleTIgPT09IFwidmFsdWVcIiAmJiB2bm9kZS5kb20udmFsdWUgPT0gdmFsdWUpIHJldHVyblxuXHRcdFx0Ly8gSWYgeW91IGFzc2lnbiBhbiBpbnB1dCB0eXBlMSB0aGF0IGlzIG5vdCBzdXBwb3J0ZWQgYnkgSUUgMTEgd2l0aCBhbiBhc3NpZ25tZW50IGV4cHJlc3Npb24sIGFuIGVycm9yMCB3aWxsIG9jY3VyLlxuXHRcdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJpbnB1dFwiICYmIGtleTIgPT09IFwidHlwZVwiKSB7XG5cdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleTIsIHZhbHVlKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdGVsZW1lbnRba2V5Ml0gPSB2YWx1ZVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0XHRcdGlmICh2YWx1ZSkgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5MiwgXCJcIilcblx0XHRcdFx0ZWxzZSBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShrZXkyKVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBlbGVtZW50LnNldEF0dHJpYnV0ZShrZXkyID09PSBcImNsYXNzTmFtZVwiID8gXCJjbGFzc1wiIDoga2V5MiwgdmFsdWUpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHNldExhdGVBdHRycyh2bm9kZSkge1xuXHRcdHZhciBhdHRyczIgPSB2bm9kZS5hdHRyc1xuXHRcdGlmICh2bm9kZS50YWcgPT09IFwic2VsZWN0XCIgJiYgYXR0cnMyICE9IG51bGwpIHtcblx0XHRcdGlmIChcInZhbHVlXCIgaW4gYXR0cnMyKSBzZXRBdHRyKHZub2RlLCBcInZhbHVlXCIsIG51bGwsIGF0dHJzMi52YWx1ZSwgdW5kZWZpbmVkKVxuXHRcdFx0aWYgKFwic2VsZWN0ZWRJbmRleFwiIGluIGF0dHJzMikgc2V0QXR0cih2bm9kZSwgXCJzZWxlY3RlZEluZGV4XCIsIG51bGwsIGF0dHJzMi5zZWxlY3RlZEluZGV4LCB1bmRlZmluZWQpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUF0dHJzKHZub2RlLCBvbGQsIGF0dHJzMiwgbnMpIHtcblx0XHRpZiAoYXR0cnMyICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGtleTIgaW4gYXR0cnMyKSB7XG5cdFx0XHRcdHNldEF0dHIodm5vZGUsIGtleTIsIG9sZCAmJiBvbGRba2V5Ml0sIGF0dHJzMltrZXkyXSwgbnMpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChvbGQgIT0gbnVsbCkge1xuXHRcdFx0Zm9yICh2YXIga2V5MiBpbiBvbGQpIHtcblx0XHRcdFx0aWYgKGF0dHJzMiA9PSBudWxsIHx8ICEoa2V5MiBpbiBhdHRyczIpKSB7XG5cdFx0XHRcdFx0aWYgKGtleTIgPT09IFwiY2xhc3NOYW1lXCIpIGtleTIgPSBcImNsYXNzXCJcblx0XHRcdFx0XHRpZiAoa2V5MlswXSA9PT0gXCJvXCIgJiYga2V5MlsxXSA9PT0gXCJuXCIgJiYgIWlzTGlmZWN5Y2xlTWV0aG9kKGtleTIpKSB1cGRhdGVFdmVudCh2bm9kZSwga2V5MiwgdW5kZWZpbmVkKVxuXHRcdFx0XHRcdGVsc2UgaWYgKGtleTIgIT09IFwia2V5XCIpIHZub2RlLmRvbS5yZW1vdmVBdHRyaWJ1dGUoa2V5Milcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBpc0Zvcm1BdHRyaWJ1dGUodm5vZGUsIGF0dHIpIHtcblx0XHRyZXR1cm4gYXR0ciA9PT0gXCJ2YWx1ZVwiIHx8IGF0dHIgPT09IFwiY2hlY2tlZFwiIHx8IGF0dHIgPT09IFwic2VsZWN0ZWRJbmRleFwiIHx8IGF0dHIgPT09IFwic2VsZWN0ZWRcIiAmJiB2bm9kZS5kb20gPT09ICRkb2MuYWN0aXZlRWxlbWVudFxuXHR9XG5cdGZ1bmN0aW9uIGlzTGlmZWN5Y2xlTWV0aG9kKGF0dHIpIHtcblx0XHRyZXR1cm4gYXR0ciA9PT0gXCJvbmluaXRcIiB8fCBhdHRyID09PSBcIm9uY3JlYXRlXCIgfHwgYXR0ciA9PT0gXCJvbnVwZGF0ZVwiIHx8IGF0dHIgPT09IFwib25yZW1vdmVcIiB8fCBhdHRyID09PSBcIm9uYmVmb3JlcmVtb3ZlXCIgfHwgYXR0ciA9PT0gXCJvbmJlZm9yZXVwZGF0ZVwiXG5cdH1cblx0ZnVuY3Rpb24gaXNBdHRyaWJ1dGUoYXR0cikge1xuXHRcdHJldHVybiBhdHRyID09PSBcImhyZWZcIiB8fCBhdHRyID09PSBcImxpc3RcIiB8fCBhdHRyID09PSBcImZvcm1cIiB8fCBhdHRyID09PSBcIndpZHRoXCIgfHwgYXR0ciA9PT0gXCJoZWlnaHRcIi8vIHx8IGF0dHIgPT09IFwidHlwZVwiXG5cdH1cblx0ZnVuY3Rpb24gaXNDdXN0b21FbGVtZW50KHZub2RlKXtcblx0XHRyZXR1cm4gdm5vZGUuYXR0cnMuaXMgfHwgdm5vZGUudGFnLmluZGV4T2YoXCItXCIpID4gLTFcblx0fVxuXHRmdW5jdGlvbiBoYXNJbnRlZ3JhdGlvbk1ldGhvZHMoc291cmNlKSB7XG5cdFx0cmV0dXJuIHNvdXJjZSAhPSBudWxsICYmIChzb3VyY2Uub25jcmVhdGUgfHwgc291cmNlLm9udXBkYXRlIHx8IHNvdXJjZS5vbmJlZm9yZXJlbW92ZSB8fCBzb3VyY2Uub25yZW1vdmUpXG5cdH1cblx0Ly9zdHlsZVxuXHRmdW5jdGlvbiB1cGRhdGVTdHlsZShlbGVtZW50LCBvbGQsIHN0eWxlKSB7XG5cdFx0aWYgKG9sZCA9PT0gc3R5bGUpIGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IFwiXCIsIG9sZCA9IG51bGxcblx0XHRpZiAoc3R5bGUgPT0gbnVsbCkgZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gXCJcIlxuXHRcdGVsc2UgaWYgKHR5cGVvZiBzdHlsZSA9PT0gXCJzdHJpbmdcIikgZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gc3R5bGVcblx0XHRlbHNlIHtcblx0XHRcdGlmICh0eXBlb2Ygb2xkID09PSBcInN0cmluZ1wiKSBlbGVtZW50LnN0eWxlLmNzc1RleHQgPSBcIlwiXG5cdFx0XHRmb3IgKHZhciBrZXkyIGluIHN0eWxlKSB7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGVba2V5Ml0gPSBzdHlsZVtrZXkyXVxuXHRcdFx0fVxuXHRcdFx0aWYgKG9sZCAhPSBudWxsICYmIHR5cGVvZiBvbGQgIT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5MiBpbiBvbGQpIHtcblx0XHRcdFx0XHRpZiAoIShrZXkyIGluIHN0eWxlKSkgZWxlbWVudC5zdHlsZVtrZXkyXSA9IFwiXCJcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHQvL2V2ZW50XG5cdGZ1bmN0aW9uIHVwZGF0ZUV2ZW50KHZub2RlLCBrZXkyLCB2YWx1ZSkge1xuXHRcdHZhciBlbGVtZW50ID0gdm5vZGUuZG9tXG5cdFx0dmFyIGNhbGxiYWNrID0gdHlwZW9mIG9uZXZlbnQgIT09IFwiZnVuY3Rpb25cIiA/IHZhbHVlIDogZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIHJlc3VsdCA9IHZhbHVlLmNhbGwoZWxlbWVudCwgZSlcblx0XHRcdG9uZXZlbnQuY2FsbChlbGVtZW50LCBlKVxuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXHRcdH1cblx0XHRpZiAoa2V5MiBpbiBlbGVtZW50KSBlbGVtZW50W2tleTJdID0gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBjYWxsYmFjayA6IG51bGxcblx0XHRlbHNlIHtcblx0XHRcdHZhciBldmVudE5hbWUgPSBrZXkyLnNsaWNlKDIpXG5cdFx0XHRpZiAodm5vZGUuZXZlbnRzID09PSB1bmRlZmluZWQpIHZub2RlLmV2ZW50cyA9IHt9XG5cdFx0XHRpZiAodm5vZGUuZXZlbnRzW2tleTJdID09PSBjYWxsYmFjaykgcmV0dXJuXG5cdFx0XHRpZiAodm5vZGUuZXZlbnRzW2tleTJdICE9IG51bGwpIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHZub2RlLmV2ZW50c1trZXkyXSwgZmFsc2UpXG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0dm5vZGUuZXZlbnRzW2tleTJdID0gY2FsbGJhY2tcblx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdm5vZGUuZXZlbnRzW2tleTJdLCBmYWxzZSlcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Ly9saWZlY3ljbGVcblx0ZnVuY3Rpb24gaW5pdExpZmVjeWNsZShzb3VyY2UsIHZub2RlLCBob29rcykge1xuXHRcdGlmICh0eXBlb2Ygc291cmNlLm9uaW5pdCA9PT0gXCJmdW5jdGlvblwiKSBzb3VyY2Uub25pbml0LmNhbGwodm5vZGUuc3RhdGUsIHZub2RlKVxuXHRcdGlmICh0eXBlb2Ygc291cmNlLm9uY3JlYXRlID09PSBcImZ1bmN0aW9uXCIpIGhvb2tzLnB1c2goc291cmNlLm9uY3JlYXRlLmJpbmQodm5vZGUuc3RhdGUsIHZub2RlKSlcblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVMaWZlY3ljbGUoc291cmNlLCB2bm9kZSwgaG9va3MpIHtcblx0XHRpZiAodHlwZW9mIHNvdXJjZS5vbnVwZGF0ZSA9PT0gXCJmdW5jdGlvblwiKSBob29rcy5wdXNoKHNvdXJjZS5vbnVwZGF0ZS5iaW5kKHZub2RlLnN0YXRlLCB2bm9kZSkpXG5cdH1cblx0ZnVuY3Rpb24gc2hvdWxkTm90VXBkYXRlKHZub2RlLCBvbGQpIHtcblx0XHR2YXIgZm9yY2VWbm9kZVVwZGF0ZSwgZm9yY2VDb21wb25lbnRVcGRhdGVcblx0XHRpZiAodm5vZGUuYXR0cnMgIT0gbnVsbCAmJiB0eXBlb2Ygdm5vZGUuYXR0cnMub25iZWZvcmV1cGRhdGUgPT09IFwiZnVuY3Rpb25cIikgZm9yY2VWbm9kZVVwZGF0ZSA9IHZub2RlLmF0dHJzLm9uYmVmb3JldXBkYXRlLmNhbGwodm5vZGUuc3RhdGUsIHZub2RlLCBvbGQpXG5cdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHZub2RlLl9zdGF0ZS5vbmJlZm9yZXVwZGF0ZSA9PT0gXCJmdW5jdGlvblwiKSBmb3JjZUNvbXBvbmVudFVwZGF0ZSA9IHZub2RlLl9zdGF0ZS5vbmJlZm9yZXVwZGF0ZS5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSwgb2xkKVxuXHRcdGlmICghKGZvcmNlVm5vZGVVcGRhdGUgPT09IHVuZGVmaW5lZCAmJiBmb3JjZUNvbXBvbmVudFVwZGF0ZSA9PT0gdW5kZWZpbmVkKSAmJiAhZm9yY2VWbm9kZVVwZGF0ZSAmJiAhZm9yY2VDb21wb25lbnRVcGRhdGUpIHtcblx0XHRcdHZub2RlLmRvbSA9IG9sZC5kb21cblx0XHRcdHZub2RlLmRvbVNpemUgPSBvbGQuZG9tU2l6ZVxuXHRcdFx0dm5vZGUuaW5zdGFuY2UgPSBvbGQuaW5zdGFuY2Vcblx0XHRcdHJldHVybiB0cnVlXG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZVxuXHR9XG5cdGZ1bmN0aW9uIHJlbmRlcihkb20sIHZub2Rlcykge1xuXHRcdGlmICghZG9tKSB0aHJvdyBuZXcgRXJyb3IoXCJFbnN1cmUgdGhlIERPTSBlbGVtZW50IGJlaW5nIHBhc3NlZCB0byBtLnJvdXRlL20ubW91bnQvbS5yZW5kZXIgaXMgbm90IHVuZGVmaW5lZC5cIilcblx0XHR2YXIgaG9va3MgPSBbXVxuXHRcdHZhciBhY3RpdmUgPSAkZG9jLmFjdGl2ZUVsZW1lbnRcblx0XHQvLyBGaXJzdCB0aW1lMCByZW5kZXJpbmcgaW50byBhIG5vZGUgY2xlYXJzIGl0IG91dFxuXHRcdGlmIChkb20udm5vZGVzID09IG51bGwpIGRvbS50ZXh0Q29udGVudCA9IFwiXCJcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkodm5vZGVzKSkgdm5vZGVzID0gW3Zub2Rlc11cblx0XHR1cGRhdGVOb2Rlcyhkb20sIGRvbS52bm9kZXMsIFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKHZub2RlcyksIGZhbHNlLCBob29rcywgbnVsbCwgdW5kZWZpbmVkKVxuXHRcdGRvbS52bm9kZXMgPSB2bm9kZXNcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhvb2tzLmxlbmd0aDsgaSsrKSBob29rc1tpXSgpXG5cdFx0aWYgKCRkb2MuYWN0aXZlRWxlbWVudCAhPT0gYWN0aXZlKSBhY3RpdmUuZm9jdXMoKVxuXHR9XG5cdHJldHVybiB7cmVuZGVyOiByZW5kZXIsIHNldEV2ZW50Q2FsbGJhY2s6IHNldEV2ZW50Q2FsbGJhY2t9XG59XG5mdW5jdGlvbiB0aHJvdHRsZShjYWxsYmFjaykge1xuXHQvLzYwZnBzIHRyYW5zbGF0ZXMgdG8gMTYuNm1zLCByb3VuZCBpdCBkb3duIHNpbmNlIHNldFRpbWVvdXQgcmVxdWlyZXMgaW50XG5cdHZhciB0aW1lID0gMTZcblx0dmFyIGxhc3QgPSAwLCBwZW5kaW5nID0gbnVsbFxuXHR2YXIgdGltZW91dCA9IHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09IFwiZnVuY3Rpb25cIiA/IHJlcXVlc3RBbmltYXRpb25GcmFtZSA6IHNldFRpbWVvdXRcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBub3cgPSBEYXRlLm5vdygpXG5cdFx0aWYgKGxhc3QgPT09IDAgfHwgbm93IC0gbGFzdCA+PSB0aW1lKSB7XG5cdFx0XHRsYXN0ID0gbm93XG5cdFx0XHRjYWxsYmFjaygpXG5cdFx0fVxuXHRcdGVsc2UgaWYgKHBlbmRpbmcgPT09IG51bGwpIHtcblx0XHRcdHBlbmRpbmcgPSB0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRwZW5kaW5nID0gbnVsbFxuXHRcdFx0XHRjYWxsYmFjaygpXG5cdFx0XHRcdGxhc3QgPSBEYXRlLm5vdygpXG5cdFx0XHR9LCB0aW1lIC0gKG5vdyAtIGxhc3QpKVxuXHRcdH1cblx0fVxufVxudmFyIF8xMSA9IGZ1bmN0aW9uKCR3aW5kb3cpIHtcblx0dmFyIHJlbmRlclNlcnZpY2UgPSBjb3JlUmVuZGVyZXIoJHdpbmRvdylcblx0cmVuZGVyU2VydmljZS5zZXRFdmVudENhbGxiYWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRpZiAoZS5yZWRyYXcgIT09IGZhbHNlKSByZWRyYXcoKVxuXHR9KVxuXHR2YXIgY2FsbGJhY2tzID0gW11cblx0ZnVuY3Rpb24gc3Vic2NyaWJlKGtleTEsIGNhbGxiYWNrKSB7XG5cdFx0dW5zdWJzY3JpYmUoa2V5MSlcblx0XHRjYWxsYmFja3MucHVzaChrZXkxLCB0aHJvdHRsZShjYWxsYmFjaykpXG5cdH1cblx0ZnVuY3Rpb24gdW5zdWJzY3JpYmUoa2V5MSkge1xuXHRcdHZhciBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGtleTEpXG5cdFx0aWYgKGluZGV4ID4gLTEpIGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDIpXG5cdH1cblx0ZnVuY3Rpb24gcmVkcmF3KCkge1xuXHRcdGZvciAodmFyIGkgPSAxOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSArPSAyKSB7XG5cdFx0XHRjYWxsYmFja3NbaV0oKVxuXHRcdH1cblx0fVxuXHRyZXR1cm4ge3N1YnNjcmliZTogc3Vic2NyaWJlLCB1bnN1YnNjcmliZTogdW5zdWJzY3JpYmUsIHJlZHJhdzogcmVkcmF3LCByZW5kZXI6IHJlbmRlclNlcnZpY2UucmVuZGVyfVxufVxudmFyIHJlZHJhd1NlcnZpY2UgPSBfMTEod2luZG93KVxucmVxdWVzdFNlcnZpY2Uuc2V0Q29tcGxldGlvbkNhbGxiYWNrKHJlZHJhd1NlcnZpY2UucmVkcmF3KVxudmFyIF8xNiA9IGZ1bmN0aW9uKHJlZHJhd1NlcnZpY2UwKSB7XG5cdHJldHVybiBmdW5jdGlvbihyb290LCBjb21wb25lbnQpIHtcblx0XHRpZiAoY29tcG9uZW50ID09PSBudWxsKSB7XG5cdFx0XHRyZWRyYXdTZXJ2aWNlMC5yZW5kZXIocm9vdCwgW10pXG5cdFx0XHRyZWRyYXdTZXJ2aWNlMC51bnN1YnNjcmliZShyb290KVxuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXHRcdFxuXHRcdGlmIChjb21wb25lbnQudmlldyA9PSBudWxsICYmIHR5cGVvZiBjb21wb25lbnQgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yKFwibS5tb3VudChlbGVtZW50LCBjb21wb25lbnQpIGV4cGVjdHMgYSBjb21wb25lbnQsIG5vdCBhIHZub2RlXCIpXG5cdFx0XG5cdFx0dmFyIHJ1bjAgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlZHJhd1NlcnZpY2UwLnJlbmRlcihyb290LCBWbm9kZShjb21wb25lbnQpKVxuXHRcdH1cblx0XHRyZWRyYXdTZXJ2aWNlMC5zdWJzY3JpYmUocm9vdCwgcnVuMClcblx0XHRyZWRyYXdTZXJ2aWNlMC5yZWRyYXcoKVxuXHR9XG59XG5tLm1vdW50ID0gXzE2KHJlZHJhd1NlcnZpY2UpXG52YXIgUHJvbWlzZSA9IFByb21pc2VQb2x5ZmlsbFxudmFyIHBhcnNlUXVlcnlTdHJpbmcgPSBmdW5jdGlvbihzdHJpbmcpIHtcblx0aWYgKHN0cmluZyA9PT0gXCJcIiB8fCBzdHJpbmcgPT0gbnVsbCkgcmV0dXJuIHt9XG5cdGlmIChzdHJpbmcuY2hhckF0KDApID09PSBcIj9cIikgc3RyaW5nID0gc3RyaW5nLnNsaWNlKDEpXG5cdHZhciBlbnRyaWVzID0gc3RyaW5nLnNwbGl0KFwiJlwiKSwgZGF0YTAgPSB7fSwgY291bnRlcnMgPSB7fVxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZW50cnkgPSBlbnRyaWVzW2ldLnNwbGl0KFwiPVwiKVxuXHRcdHZhciBrZXk1ID0gZGVjb2RlVVJJQ29tcG9uZW50KGVudHJ5WzBdKVxuXHRcdHZhciB2YWx1ZSA9IGVudHJ5Lmxlbmd0aCA9PT0gMiA/IGRlY29kZVVSSUNvbXBvbmVudChlbnRyeVsxXSkgOiBcIlwiXG5cdFx0aWYgKHZhbHVlID09PSBcInRydWVcIikgdmFsdWUgPSB0cnVlXG5cdFx0ZWxzZSBpZiAodmFsdWUgPT09IFwiZmFsc2VcIikgdmFsdWUgPSBmYWxzZVxuXHRcdHZhciBsZXZlbHMgPSBrZXk1LnNwbGl0KC9cXF1cXFs/fFxcWy8pXG5cdFx0dmFyIGN1cnNvciA9IGRhdGEwXG5cdFx0aWYgKGtleTUuaW5kZXhPZihcIltcIikgPiAtMSkgbGV2ZWxzLnBvcCgpXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBsZXZlbHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdHZhciBsZXZlbCA9IGxldmVsc1tqXSwgbmV4dExldmVsID0gbGV2ZWxzW2ogKyAxXVxuXHRcdFx0dmFyIGlzTnVtYmVyID0gbmV4dExldmVsID09IFwiXCIgfHwgIWlzTmFOKHBhcnNlSW50KG5leHRMZXZlbCwgMTApKVxuXHRcdFx0dmFyIGlzVmFsdWUgPSBqID09PSBsZXZlbHMubGVuZ3RoIC0gMVxuXHRcdFx0aWYgKGxldmVsID09PSBcIlwiKSB7XG5cdFx0XHRcdHZhciBrZXk1ID0gbGV2ZWxzLnNsaWNlKDAsIGopLmpvaW4oKVxuXHRcdFx0XHRpZiAoY291bnRlcnNba2V5NV0gPT0gbnVsbCkgY291bnRlcnNba2V5NV0gPSAwXG5cdFx0XHRcdGxldmVsID0gY291bnRlcnNba2V5NV0rK1xuXHRcdFx0fVxuXHRcdFx0aWYgKGN1cnNvcltsZXZlbF0gPT0gbnVsbCkge1xuXHRcdFx0XHRjdXJzb3JbbGV2ZWxdID0gaXNWYWx1ZSA/IHZhbHVlIDogaXNOdW1iZXIgPyBbXSA6IHt9XG5cdFx0XHR9XG5cdFx0XHRjdXJzb3IgPSBjdXJzb3JbbGV2ZWxdXG5cdFx0fVxuXHR9XG5cdHJldHVybiBkYXRhMFxufVxudmFyIGNvcmVSb3V0ZXIgPSBmdW5jdGlvbigkd2luZG93KSB7XG5cdHZhciBzdXBwb3J0c1B1c2hTdGF0ZSA9IHR5cGVvZiAkd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlID09PSBcImZ1bmN0aW9uXCJcblx0dmFyIGNhbGxBc3luYzAgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSBcImZ1bmN0aW9uXCIgPyBzZXRJbW1lZGlhdGUgOiBzZXRUaW1lb3V0XG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZTEoZnJhZ21lbnQwKSB7XG5cdFx0dmFyIGRhdGEgPSAkd2luZG93LmxvY2F0aW9uW2ZyYWdtZW50MF0ucmVwbGFjZSgvKD86JVthLWY4OV1bYS1mMC05XSkrL2dpbSwgZGVjb2RlVVJJQ29tcG9uZW50KVxuXHRcdGlmIChmcmFnbWVudDAgPT09IFwicGF0aG5hbWVcIiAmJiBkYXRhWzBdICE9PSBcIi9cIikgZGF0YSA9IFwiL1wiICsgZGF0YVxuXHRcdHJldHVybiBkYXRhXG5cdH1cblx0dmFyIGFzeW5jSWRcblx0ZnVuY3Rpb24gZGVib3VuY2VBc3luYyhjYWxsYmFjazApIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoYXN5bmNJZCAhPSBudWxsKSByZXR1cm5cblx0XHRcdGFzeW5jSWQgPSBjYWxsQXN5bmMwKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRhc3luY0lkID0gbnVsbFxuXHRcdFx0XHRjYWxsYmFjazAoKVxuXHRcdFx0fSlcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gcGFyc2VQYXRoKHBhdGgsIHF1ZXJ5RGF0YSwgaGFzaERhdGEpIHtcblx0XHR2YXIgcXVlcnlJbmRleCA9IHBhdGguaW5kZXhPZihcIj9cIilcblx0XHR2YXIgaGFzaEluZGV4ID0gcGF0aC5pbmRleE9mKFwiI1wiKVxuXHRcdHZhciBwYXRoRW5kID0gcXVlcnlJbmRleCA+IC0xID8gcXVlcnlJbmRleCA6IGhhc2hJbmRleCA+IC0xID8gaGFzaEluZGV4IDogcGF0aC5sZW5ndGhcblx0XHRpZiAocXVlcnlJbmRleCA+IC0xKSB7XG5cdFx0XHR2YXIgcXVlcnlFbmQgPSBoYXNoSW5kZXggPiAtMSA/IGhhc2hJbmRleCA6IHBhdGgubGVuZ3RoXG5cdFx0XHR2YXIgcXVlcnlQYXJhbXMgPSBwYXJzZVF1ZXJ5U3RyaW5nKHBhdGguc2xpY2UocXVlcnlJbmRleCArIDEsIHF1ZXJ5RW5kKSlcblx0XHRcdGZvciAodmFyIGtleTQgaW4gcXVlcnlQYXJhbXMpIHF1ZXJ5RGF0YVtrZXk0XSA9IHF1ZXJ5UGFyYW1zW2tleTRdXG5cdFx0fVxuXHRcdGlmIChoYXNoSW5kZXggPiAtMSkge1xuXHRcdFx0dmFyIGhhc2hQYXJhbXMgPSBwYXJzZVF1ZXJ5U3RyaW5nKHBhdGguc2xpY2UoaGFzaEluZGV4ICsgMSkpXG5cdFx0XHRmb3IgKHZhciBrZXk0IGluIGhhc2hQYXJhbXMpIGhhc2hEYXRhW2tleTRdID0gaGFzaFBhcmFtc1trZXk0XVxuXHRcdH1cblx0XHRyZXR1cm4gcGF0aC5zbGljZSgwLCBwYXRoRW5kKVxuXHR9XG5cdHZhciByb3V0ZXIgPSB7cHJlZml4OiBcIiMhXCJ9XG5cdHJvdXRlci5nZXRQYXRoID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHR5cGUyID0gcm91dGVyLnByZWZpeC5jaGFyQXQoMClcblx0XHRzd2l0Y2ggKHR5cGUyKSB7XG5cdFx0XHRjYXNlIFwiI1wiOiByZXR1cm4gbm9ybWFsaXplMShcImhhc2hcIikuc2xpY2Uocm91dGVyLnByZWZpeC5sZW5ndGgpXG5cdFx0XHRjYXNlIFwiP1wiOiByZXR1cm4gbm9ybWFsaXplMShcInNlYXJjaFwiKS5zbGljZShyb3V0ZXIucHJlZml4Lmxlbmd0aCkgKyBub3JtYWxpemUxKFwiaGFzaFwiKVxuXHRcdFx0ZGVmYXVsdDogcmV0dXJuIG5vcm1hbGl6ZTEoXCJwYXRobmFtZVwiKS5zbGljZShyb3V0ZXIucHJlZml4Lmxlbmd0aCkgKyBub3JtYWxpemUxKFwic2VhcmNoXCIpICsgbm9ybWFsaXplMShcImhhc2hcIilcblx0XHR9XG5cdH1cblx0cm91dGVyLnNldFBhdGggPSBmdW5jdGlvbihwYXRoLCBkYXRhLCBvcHRpb25zKSB7XG5cdFx0dmFyIHF1ZXJ5RGF0YSA9IHt9LCBoYXNoRGF0YSA9IHt9XG5cdFx0cGF0aCA9IHBhcnNlUGF0aChwYXRoLCBxdWVyeURhdGEsIGhhc2hEYXRhKVxuXHRcdGlmIChkYXRhICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGtleTQgaW4gZGF0YSkgcXVlcnlEYXRhW2tleTRdID0gZGF0YVtrZXk0XVxuXHRcdFx0cGF0aCA9IHBhdGgucmVwbGFjZSgvOihbXlxcL10rKS9nLCBmdW5jdGlvbihtYXRjaDIsIHRva2VuKSB7XG5cdFx0XHRcdGRlbGV0ZSBxdWVyeURhdGFbdG9rZW5dXG5cdFx0XHRcdHJldHVybiBkYXRhW3Rva2VuXVxuXHRcdFx0fSlcblx0XHR9XG5cdFx0dmFyIHF1ZXJ5ID0gYnVpbGRRdWVyeVN0cmluZyhxdWVyeURhdGEpXG5cdFx0aWYgKHF1ZXJ5KSBwYXRoICs9IFwiP1wiICsgcXVlcnlcblx0XHR2YXIgaGFzaCA9IGJ1aWxkUXVlcnlTdHJpbmcoaGFzaERhdGEpXG5cdFx0aWYgKGhhc2gpIHBhdGggKz0gXCIjXCIgKyBoYXNoXG5cdFx0aWYgKHN1cHBvcnRzUHVzaFN0YXRlKSB7XG5cdFx0XHR2YXIgc3RhdGUgPSBvcHRpb25zID8gb3B0aW9ucy5zdGF0ZSA6IG51bGxcblx0XHRcdHZhciB0aXRsZSA9IG9wdGlvbnMgPyBvcHRpb25zLnRpdGxlIDogbnVsbFxuXHRcdFx0JHdpbmRvdy5vbnBvcHN0YXRlKClcblx0XHRcdGlmIChvcHRpb25zICYmIG9wdGlvbnMucmVwbGFjZSkgJHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShzdGF0ZSwgdGl0bGUsIHJvdXRlci5wcmVmaXggKyBwYXRoKVxuXHRcdFx0ZWxzZSAkd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHN0YXRlLCB0aXRsZSwgcm91dGVyLnByZWZpeCArIHBhdGgpXG5cdFx0fVxuXHRcdGVsc2UgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcm91dGVyLnByZWZpeCArIHBhdGhcblx0fVxuXHRyb3V0ZXIuZGVmaW5lUm91dGVzID0gZnVuY3Rpb24ocm91dGVzLCByZXNvbHZlLCByZWplY3QpIHtcblx0XHRmdW5jdGlvbiByZXNvbHZlUm91dGUoKSB7XG5cdFx0XHR2YXIgcGF0aCA9IHJvdXRlci5nZXRQYXRoKClcblx0XHRcdHZhciBwYXJhbXMgPSB7fVxuXHRcdFx0dmFyIHBhdGhuYW1lID0gcGFyc2VQYXRoKHBhdGgsIHBhcmFtcywgcGFyYW1zKVxuXHRcdFx0dmFyIHN0YXRlID0gJHdpbmRvdy5oaXN0b3J5LnN0YXRlXG5cdFx0XHRpZiAoc3RhdGUgIT0gbnVsbCkge1xuXHRcdFx0XHRmb3IgKHZhciBrIGluIHN0YXRlKSBwYXJhbXNba10gPSBzdGF0ZVtrXVxuXHRcdFx0fVxuXHRcdFx0Zm9yICh2YXIgcm91dGUwIGluIHJvdXRlcykge1xuXHRcdFx0XHR2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXCJeXCIgKyByb3V0ZTAucmVwbGFjZSgvOlteXFwvXSs/XFwuezN9L2csIFwiKC4qPylcIikucmVwbGFjZSgvOlteXFwvXSsvZywgXCIoW15cXFxcL10rKVwiKSArIFwiXFwvPyRcIilcblx0XHRcdFx0aWYgKG1hdGNoZXIudGVzdChwYXRobmFtZSkpIHtcblx0XHRcdFx0XHRwYXRobmFtZS5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dmFyIGtleXMgPSByb3V0ZTAubWF0Y2goLzpbXlxcL10rL2cpIHx8IFtdXG5cdFx0XHRcdFx0XHR2YXIgdmFsdWVzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEsIC0yKVxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdHBhcmFtc1trZXlzW2ldLnJlcGxhY2UoLzp8XFwuL2csIFwiXCIpXSA9IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZXNbaV0pXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHJvdXRlc1tyb3V0ZTBdLCBwYXJhbXMsIHBhdGgsIHJvdXRlMClcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZWplY3QocGF0aCwgcGFyYW1zKVxuXHRcdH1cblx0XHRpZiAoc3VwcG9ydHNQdXNoU3RhdGUpICR3aW5kb3cub25wb3BzdGF0ZSA9IGRlYm91bmNlQXN5bmMocmVzb2x2ZVJvdXRlKVxuXHRcdGVsc2UgaWYgKHJvdXRlci5wcmVmaXguY2hhckF0KDApID09PSBcIiNcIikgJHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSByZXNvbHZlUm91dGVcblx0XHRyZXNvbHZlUm91dGUoKVxuXHR9XG5cdHJldHVybiByb3V0ZXJcbn1cbnZhciBfMjAgPSBmdW5jdGlvbigkd2luZG93LCByZWRyYXdTZXJ2aWNlMCkge1xuXHR2YXIgcm91dGVTZXJ2aWNlID0gY29yZVJvdXRlcigkd2luZG93KVxuXHR2YXIgaWRlbnRpdHkgPSBmdW5jdGlvbih2KSB7cmV0dXJuIHZ9XG5cdHZhciByZW5kZXIxLCBjb21wb25lbnQsIGF0dHJzMywgY3VycmVudFBhdGgsIGxhc3RVcGRhdGVcblx0dmFyIHJvdXRlID0gZnVuY3Rpb24ocm9vdCwgZGVmYXVsdFJvdXRlLCByb3V0ZXMpIHtcblx0XHRpZiAocm9vdCA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoXCJFbnN1cmUgdGhlIERPTSBlbGVtZW50IHRoYXQgd2FzIHBhc3NlZCB0byBgbS5yb3V0ZWAgaXMgbm90IHVuZGVmaW5lZFwiKVxuXHRcdHZhciBydW4xID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAocmVuZGVyMSAhPSBudWxsKSByZWRyYXdTZXJ2aWNlMC5yZW5kZXIocm9vdCwgcmVuZGVyMShWbm9kZShjb21wb25lbnQsIGF0dHJzMy5rZXksIGF0dHJzMykpKVxuXHRcdH1cblx0XHR2YXIgYmFpbCA9IGZ1bmN0aW9uKHBhdGgpIHtcblx0XHRcdGlmIChwYXRoICE9PSBkZWZhdWx0Um91dGUpIHJvdXRlU2VydmljZS5zZXRQYXRoKGRlZmF1bHRSb3V0ZSwgbnVsbCwge3JlcGxhY2U6IHRydWV9KVxuXHRcdFx0ZWxzZSB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgcmVzb2x2ZSBkZWZhdWx0IHJvdXRlIFwiICsgZGVmYXVsdFJvdXRlKVxuXHRcdH1cblx0XHRyb3V0ZVNlcnZpY2UuZGVmaW5lUm91dGVzKHJvdXRlcywgZnVuY3Rpb24ocGF5bG9hZCwgcGFyYW1zLCBwYXRoKSB7XG5cdFx0XHR2YXIgdXBkYXRlID0gbGFzdFVwZGF0ZSA9IGZ1bmN0aW9uKHJvdXRlUmVzb2x2ZXIsIGNvbXApIHtcblx0XHRcdFx0aWYgKHVwZGF0ZSAhPT0gbGFzdFVwZGF0ZSkgcmV0dXJuXG5cdFx0XHRcdGNvbXBvbmVudCA9IGNvbXAgIT0gbnVsbCAmJiAodHlwZW9mIGNvbXAudmlldyA9PT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBjb21wID09PSBcImZ1bmN0aW9uXCIpPyBjb21wIDogXCJkaXZcIlxuXHRcdFx0XHRhdHRyczMgPSBwYXJhbXMsIGN1cnJlbnRQYXRoID0gcGF0aCwgbGFzdFVwZGF0ZSA9IG51bGxcblx0XHRcdFx0cmVuZGVyMSA9IChyb3V0ZVJlc29sdmVyLnJlbmRlciB8fCBpZGVudGl0eSkuYmluZChyb3V0ZVJlc29sdmVyKVxuXHRcdFx0XHRydW4xKClcblx0XHRcdH1cblx0XHRcdGlmIChwYXlsb2FkLnZpZXcgfHwgdHlwZW9mIHBheWxvYWQgPT09IFwiZnVuY3Rpb25cIikgdXBkYXRlKHt9LCBwYXlsb2FkKVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmIChwYXlsb2FkLm9ubWF0Y2gpIHtcblx0XHRcdFx0XHRQcm9taXNlLnJlc29sdmUocGF5bG9hZC5vbm1hdGNoKHBhcmFtcywgcGF0aCkpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZWQpIHtcblx0XHRcdFx0XHRcdHVwZGF0ZShwYXlsb2FkLCByZXNvbHZlZClcblx0XHRcdFx0XHR9LCBiYWlsKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgdXBkYXRlKHBheWxvYWQsIFwiZGl2XCIpXG5cdFx0XHR9XG5cdFx0fSwgYmFpbClcblx0XHRyZWRyYXdTZXJ2aWNlMC5zdWJzY3JpYmUocm9vdCwgcnVuMSlcblx0fVxuXHRyb3V0ZS5zZXQgPSBmdW5jdGlvbihwYXRoLCBkYXRhLCBvcHRpb25zKSB7XG5cdFx0aWYgKGxhc3RVcGRhdGUgIT0gbnVsbCkgb3B0aW9ucyA9IHtyZXBsYWNlOiB0cnVlfVxuXHRcdGxhc3RVcGRhdGUgPSBudWxsXG5cdFx0cm91dGVTZXJ2aWNlLnNldFBhdGgocGF0aCwgZGF0YSwgb3B0aW9ucylcblx0fVxuXHRyb3V0ZS5nZXQgPSBmdW5jdGlvbigpIHtyZXR1cm4gY3VycmVudFBhdGh9XG5cdHJvdXRlLnByZWZpeCA9IGZ1bmN0aW9uKHByZWZpeDApIHtyb3V0ZVNlcnZpY2UucHJlZml4ID0gcHJlZml4MH1cblx0cm91dGUubGluayA9IGZ1bmN0aW9uKHZub2RlMSkge1xuXHRcdHZub2RlMS5kb20uc2V0QXR0cmlidXRlKFwiaHJlZlwiLCByb3V0ZVNlcnZpY2UucHJlZml4ICsgdm5vZGUxLmF0dHJzLmhyZWYpXG5cdFx0dm5vZGUxLmRvbS5vbmNsaWNrID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYgKGUuY3RybEtleSB8fCBlLm1ldGFLZXkgfHwgZS5zaGlmdEtleSB8fCBlLndoaWNoID09PSAyKSByZXR1cm5cblx0XHRcdGUucHJldmVudERlZmF1bHQoKVxuXHRcdFx0ZS5yZWRyYXcgPSBmYWxzZVxuXHRcdFx0dmFyIGhyZWYgPSB0aGlzLmdldEF0dHJpYnV0ZShcImhyZWZcIilcblx0XHRcdGlmIChocmVmLmluZGV4T2Yocm91dGVTZXJ2aWNlLnByZWZpeCkgPT09IDApIGhyZWYgPSBocmVmLnNsaWNlKHJvdXRlU2VydmljZS5wcmVmaXgubGVuZ3RoKVxuXHRcdFx0cm91dGUuc2V0KGhyZWYsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxuXHRcdH1cblx0fVxuXHRyb3V0ZS5wYXJhbSA9IGZ1bmN0aW9uKGtleTMpIHtcblx0XHRpZih0eXBlb2YgYXR0cnMzICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBrZXkzICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gYXR0cnMzW2tleTNdXG5cdFx0cmV0dXJuIGF0dHJzM1xuXHR9XG5cdHJldHVybiByb3V0ZVxufVxubS5yb3V0ZSA9IF8yMCh3aW5kb3csIHJlZHJhd1NlcnZpY2UpXG5tLndpdGhBdHRyID0gZnVuY3Rpb24oYXR0ck5hbWUsIGNhbGxiYWNrMSwgY29udGV4dCkge1xuXHRyZXR1cm4gZnVuY3Rpb24oZSkge1xuXHRcdGNhbGxiYWNrMS5jYWxsKGNvbnRleHQgfHwgdGhpcywgYXR0ck5hbWUgaW4gZS5jdXJyZW50VGFyZ2V0ID8gZS5jdXJyZW50VGFyZ2V0W2F0dHJOYW1lXSA6IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpKVxuXHR9XG59XG52YXIgXzI4ID0gY29yZVJlbmRlcmVyKHdpbmRvdylcbm0ucmVuZGVyID0gXzI4LnJlbmRlclxubS5yZWRyYXcgPSByZWRyYXdTZXJ2aWNlLnJlZHJhd1xubS5yZXF1ZXN0ID0gcmVxdWVzdFNlcnZpY2UucmVxdWVzdFxubS5qc29ucCA9IHJlcXVlc3RTZXJ2aWNlLmpzb25wXG5tLnBhcnNlUXVlcnlTdHJpbmcgPSBwYXJzZVF1ZXJ5U3RyaW5nXG5tLmJ1aWxkUXVlcnlTdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nXG5tLnZlcnNpb24gPSBcIjEuMS4xXCJcbm0udm5vZGUgPSBWbm9kZVxuaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpIG1vZHVsZVtcImV4cG9ydHNcIl0gPSBtXG5lbHNlIHdpbmRvdy5tID0gbVxufSgpKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L21pdGhyaWwvbWl0aHJpbC5qcyIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcbmltcG9ydCBNb2RlbCBmcm9tICcuL21vZGVsLmpzJztcblxuaW1wb3J0IHN0eWxlcyBmcm9tICcuL3N0eWxlcy5jc3MnO1xuXG5cbmNvbnN0IFVsID0ge1xuICB2aWV3OiB2bm9kZSA9PiB7XG4gICAgcmV0dXJuIDx1bCBjbGFzc05hbWU9J21kbC1saXN0Jz5cbiAgICAgIHt2bm9kZS5hdHRycy5pbm5lcn1cbiAgICA8L3VsPlxuICB9XG59O1xuXG5jb25zdCBMaSA9IHtcbiAgdmlldzogdm5vZGUgPT4ge1xuICAgIHJldHVybiA8bGkgY2xhc3NOYW1lPSdtZGwtbGlzdF9faXRlbSc+XG4gICAgICB7dm5vZGUuYXR0cnMuaW5uZXJ9XG4gICAgPC9saT5cbiAgfVxufTtcblxuY29uc3QgRGV0YWlscyA9IHtcbiAgdmlldzogdm5vZGUgID0+IHtcbiAgICByZXR1cm4gPGRldGFpbHM+XG4gICAgICA8c3VtbWFyeT57dm5vZGUuYXR0cnMuc3VtbWFyeX08L3N1bW1hcnk+XG4gICAgICB7dm5vZGUuYXR0cnMuaW5uZXJ9XG4gICAgPC9kZXRhaWxzPlxuICB9XG59O1xuXG5jb25zdCBZZWFyID0ge1xuICB2aWV3OiB2bm9kZSA9PiB7XG4gICAgY29uc3QgZGF0YSA9IHZub2RlLmF0dHJzLmRhdGE7XG4gICAgY29uc3QgaW5uZXIgPSBkYXRhLm1vbnRocy5tYXAoZCA9PiB7XG4gICAgICByZXR1cm4gPFVsIGlubmVyPXs8TGkgaW5uZXI9ezxNb250aCBkYXRhPXtkfSAvPn0gLz59IC8+XG4gICAgfSk7XG4gICAgcmV0dXJuIDxkaXYgaWQ9e2RhdGEueWVhcn0+XG4gICAgICA8RGV0YWlscyBzdW1tYXJ5PXtgJHtkYXRhLnllYXJ95bm0YH0gaW5uZXI9e2lubmVyfSAvPlxuICAgIDwvZGl2PlxuICB9XG59O1xuXG5jb25zdCBNb250aCA9IHtcbiAgdmlldzogdm5vZGUgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSB2bm9kZS5hdHRycy5kYXRhO1xuICAgIGNvbnN0IGlubmVyID0gZGF0YS5kYXlzLm1hcChkID0+IHtcbiAgICAgIHJldHVybiA8VWwgaW5uZXI9ezxMaSBpbm5lcj17PERheSBkYXRhPXtkfSAvPn0gLz59IC8+XG4gICAgfSk7XG4gICAgcmV0dXJuIDxkaXYgaWQ9e2RhdGEubW9udGh9PlxuICAgICAgPERldGFpbHMgc3VtbWFyeT17YCR7ZGF0YS5tb250aH3mnIhgfSBpbm5lcj17aW5uZXJ9IC8+XG4gICAgPC9kaXY+XG4gIH1cbn07XG5cbmNvbnN0IERheSA9IHtcbiAgdmlldzogdm5vZGUgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSB2bm9kZS5hdHRycy5kYXRhO1xuICAgIGNvbnN0IGlubmVyID0gPHNwYW4+XG4gICAgICB7YCR7ZGF0YS5kYXl95pelIGB9XG4gICAgICA8YSBocmVmPXtgL2FydGljbGUvJHtkYXRhLnllYXJ9LyR7ZGF0YS5tb250aH0vJHtkYXRhLmRheX0vJHtkYXRhLnNsdWd9YH0+XG4gICAgICAgIHtkYXRhLnRpdGxlfVxuICAgICAgPC9hPlxuICAgIDwvc3Bhbj5cbiAgICByZXR1cm4gPExpIGlubmVyPXtpbm5lcn0gLz5cbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBvbmluaXQ6IHZub2RlID0+IHtcbiAgICBNb2RlbC5mZXRjaCgpO1xuICAgIHZub2RlLnN0YXRlLmFydGljbGVJbmRleCA9ICgpID0+IHtcbiAgICAgIHJldHVybiBNb2RlbC5kYXRhLm1hcChkID0+IHtcbiAgICAgICAgcmV0dXJuIDxVbCBpbm5lcj17PExpIGlubmVyPXs8WWVhciBkYXRhPXtkfSAvPn0gLz59IC8+XG4gICAgICB9KTtcbiAgICB9O1xuICB9LFxuICB2aWV3OiB2bm9kZSA9PiB7XG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdtZGwtZ3JpZCc+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbWRsLWNlbGwtLTEtb2Zmc2V0JyAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9J21kbC1jZWxsIG1kbC1jZWxsLS0xMC1jb2wnPlxuICAgICAgICB7KCgpID0+IHtcbiAgICAgICAgICBpZiAoIU1vZGVsLmZldGNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nbWRsLXNwaW5uZXIgbWRsLWpzLXNwaW5uZXIgaXMtYWN0aXZlJz48L2Rpdj5cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIDxVbCBpbm5lcj17dm5vZGUuc3RhdGUuYXJ0aWNsZUluZGV4KCl9IC8+XG4gICAgICAgIH0pKCl9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdtZGwtY2VsbC0tMS1vZmZzZXQnIC8+XG4gICAgPC9kaXY+XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NvbXBvbmVudC5qcyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50LmpzJztcblxuXG5tLm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJyksIENvbXBvbmVudCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9lbnRyeS5qcyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5jb25zdCBNb2RlbCA9IHtcbiAgZGF0YTogW10sXG4gIGZldGNoZWQ6IGZhbHNlLFxuICBmZXRjaDogKCkgPT4ge1xuICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9hcGkvYXJ0aWNsZXMvaW5kZXgnLFxuICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgTW9kZWwuZmV0Y2hlZCA9IHRydWU7XG4gICAgICBNb2RlbC5kYXRhID0gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGVsXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tb2RlbC5qcyIsIid1c2Ugc3RyaWN0J1xuXG5leHBvcnRzLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5leHBvcnRzLnRvQnl0ZUFycmF5ID0gdG9CeXRlQXJyYXlcbmV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IGZyb21CeXRlQXJyYXlcblxudmFyIGxvb2t1cCA9IFtdXG52YXIgcmV2TG9va3VwID0gW11cbnZhciBBcnIgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgPyBVaW50OEFycmF5IDogQXJyYXlcblxudmFyIGNvZGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLydcbmZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gIGxvb2t1cFtpXSA9IGNvZGVbaV1cbiAgcmV2TG9va3VwW2NvZGUuY2hhckNvZGVBdChpKV0gPSBpXG59XG5cbnJldkxvb2t1cFsnLScuY2hhckNvZGVBdCgwKV0gPSA2MlxucmV2TG9va3VwWydfJy5jaGFyQ29kZUF0KDApXSA9IDYzXG5cbmZ1bmN0aW9uIHBsYWNlSG9sZGVyc0NvdW50IChiNjQpIHtcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG4gIC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcbiAgLy8gcmVwcmVzZW50IG9uZSBieXRlXG4gIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuICAvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG4gIHJldHVybiBiNjRbbGVuIC0gMl0gPT09ICc9JyA/IDIgOiBiNjRbbGVuIC0gMV0gPT09ICc9JyA/IDEgOiAwXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKGI2NCkge1xuICAvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcbiAgcmV0dXJuIGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVyc0NvdW50KGI2NClcbn1cblxuZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICB2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuICBwbGFjZUhvbGRlcnMgPSBwbGFjZUhvbGRlcnNDb3VudChiNjQpXG5cbiAgYXJyID0gbmV3IEFycihsZW4gKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gbGVuIC0gNCA6IGxlblxuXG4gIHZhciBMID0gMFxuXG4gIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildIDw8IDYpIHwgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA+PiA0KVxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA+PiAyKVxuICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcbiAgcmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICsgbG9va3VwW251bSAmIDB4M0ZdXG59XG5cbmZ1bmN0aW9uIGVuY29kZUNodW5rICh1aW50OCwgc3RhcnQsIGVuZCkge1xuICB2YXIgdG1wXG4gIHZhciBvdXRwdXQgPSBbXVxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gMykge1xuICAgIHRtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIG91dHB1dCA9ICcnXG4gIHZhciBwYXJ0cyA9IFtdXG4gIHZhciBtYXhDaHVua0xlbmd0aCA9IDE2MzgzIC8vIG11c3QgYmUgbXVsdGlwbGUgb2YgM1xuXG4gIC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbjIgPSBsZW4gLSBleHRyYUJ5dGVzOyBpIDwgbGVuMjsgaSArPSBtYXhDaHVua0xlbmd0aCkge1xuICAgIHBhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKSkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBvdXRwdXQgKz0gbG9va3VwW3RtcCA+PiAyXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9ICc9PSdcbiAgfSBlbHNlIGlmIChleHRyYUJ5dGVzID09PSAyKSB7XG4gICAgdG1wID0gKHVpbnQ4W2xlbiAtIDJdIDw8IDgpICsgKHVpbnQ4W2xlbiAtIDFdKVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDEwXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz0nXG4gIH1cblxuICBwYXJ0cy5wdXNoKG91dHB1dClcblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vYmFzZTY0LWpzL2luZGV4LmpzIiwiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxuLyoqXG4gKiBJZiBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAobW9zdCBjb21wYXRpYmxlLCBldmVuIElFNilcbiAqXG4gKiBCcm93c2VycyB0aGF0IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssIENocm9tZSA3KywgU2FmYXJpIDUuMSssXG4gKiBPcGVyYSAxMS42KywgaU9TIDQuMisuXG4gKlxuICogRHVlIHRvIHZhcmlvdXMgYnJvd3NlciBidWdzLCBzb21ldGltZXMgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiB3aWxsIGJlIHVzZWQgZXZlblxuICogd2hlbiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0eXBlZCBhcnJheXMuXG4gKlxuICogTm90ZTpcbiAqXG4gKiAgIC0gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLFxuICogICAgIFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4LlxuICpcbiAqICAgLSBDaHJvbWUgOS0xMCBpcyBtaXNzaW5nIHRoZSBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uLlxuICpcbiAqICAgLSBJRTEwIGhhcyBhIGJyb2tlbiBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYXJyYXlzIG9mXG4gKiAgICAgaW5jb3JyZWN0IGxlbmd0aCBpbiBzb21lIHNpdHVhdGlvbnMuXG5cbiAqIFdlIGRldGVjdCB0aGVzZSBidWdneSBicm93c2VycyBhbmQgc2V0IGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGAgdG8gYGZhbHNlYCBzbyB0aGV5XG4gKiBnZXQgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggaXMgc2xvd2VyIGJ1dCBiZWhhdmVzIGNvcnJlY3RseS5cbiAqL1xuQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgPSBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVCAhPT0gdW5kZWZpbmVkXG4gID8gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgOiB0eXBlZEFycmF5U3VwcG9ydCgpXG5cbi8qXG4gKiBFeHBvcnQga01heExlbmd0aCBhZnRlciB0eXBlZCBhcnJheSBzdXBwb3J0IGlzIGRldGVybWluZWQuXG4gKi9cbmV4cG9ydHMua01heExlbmd0aCA9IGtNYXhMZW5ndGgoKVxuXG5mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCAoKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgYXJyLl9fcHJvdG9fXyA9IHtfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLCBmb286IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH19XG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDIgJiYgLy8gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWRcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiAvLyBjaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgICAgICAgYXJyLnN1YmFycmF5KDEsIDEpLmJ5dGVMZW5ndGggPT09IDAgLy8gaWUxMCBoYXMgYnJva2VuIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGtNYXhMZW5ndGggKCkge1xuICByZXR1cm4gQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgICA/IDB4N2ZmZmZmZmZcbiAgICA6IDB4M2ZmZmZmZmZcbn1cblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyICh0aGF0LCBsZW5ndGgpIHtcbiAgaWYgKGtNYXhMZW5ndGgoKSA8IGxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHR5cGVkIGFycmF5IGxlbmd0aCcpXG4gIH1cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IG5ldyBVaW50OEFycmF5KGxlbmd0aClcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgaWYgKHRoYXQgPT09IG51bGwpIHtcbiAgICAgIHRoYXQgPSBuZXcgQnVmZmVyKGxlbmd0aClcbiAgICB9XG4gICAgdGhhdC5sZW5ndGggPSBsZW5ndGhcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBoYXZlIHRoZWlyXG4gKiBwcm90b3R5cGUgY2hhbmdlZCB0byBgQnVmZmVyLnByb3RvdHlwZWAuIEZ1cnRoZXJtb3JlLCBgQnVmZmVyYCBpcyBhIHN1YmNsYXNzIG9mXG4gKiBgVWludDhBcnJheWAsIHNvIHRoZSByZXR1cm5lZCBpbnN0YW5jZXMgd2lsbCBoYXZlIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBtZXRob2RzXG4gKiBhbmQgdGhlIGBVaW50OEFycmF5YCBtZXRob2RzLiBTcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdFxuICogcmV0dXJucyBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBUaGUgYFVpbnQ4QXJyYXlgIHByb3RvdHlwZSByZW1haW5zIHVubW9kaWZpZWQuXG4gKi9cblxuZnVuY3Rpb24gQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmICEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdJZiBlbmNvZGluZyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKHRoaXMsIGFyZylcbiAgfVxuICByZXR1cm4gZnJvbSh0aGlzLCBhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbi8vIFRPRE86IExlZ2FjeSwgbm90IG5lZWRlZCBhbnltb3JlLiBSZW1vdmUgaW4gbmV4dCBtYWpvciB2ZXJzaW9uLlxuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIGZyb20gKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQpXG4gIH1cblxuICByZXR1cm4gZnJvbU9iamVjdCh0aGF0LCB2YWx1ZSlcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbShudWxsLCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5pZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuICBCdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnNwZWNpZXMgJiZcbiAgICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICAgIC8vIEZpeCBzdWJhcnJheSgpIGluIEVTMjAxNi4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzk3XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlciwgU3ltYm9sLnNwZWNpZXMsIHtcbiAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfSBlbHNlIGlmIChzaXplIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBuZWdhdGl2ZScpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb2MgKHRoYXQsIHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgaWYgKHNpemUgPD0gMCkge1xuICAgIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbiAgfVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSBwYXkgYXR0ZW50aW9uIHRvIGVuY29kaW5nIGlmIGl0J3MgYSBzdHJpbmcuIFRoaXNcbiAgICAvLyBwcmV2ZW50cyBhY2NpZGVudGFsbHkgc2VuZGluZyBpbiBhIG51bWJlciB0aGF0IHdvdWxkXG4gICAgLy8gYmUgaW50ZXJwcmV0dGVkIGFzIGEgc3RhcnQgb2Zmc2V0LlxuICAgIHJldHVybiB0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnXG4gICAgICA/IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgICAgOiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSkuZmlsbChmaWxsKVxuICB9XG4gIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiBhbGxvYyhzaXplWywgZmlsbFssIGVuY29kaW5nXV0pXG4gKiovXG5CdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGFsbG9jKG51bGwsIHNpemUsIGZpbGwsIGVuY29kaW5nKVxufVxuXG5mdW5jdGlvbiBhbGxvY1Vuc2FmZSAodGhhdCwgc2l6ZSkge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSA8IDAgPyAwIDogY2hlY2tlZChzaXplKSB8IDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7ICsraSkge1xuICAgICAgdGhhdFtpXSA9IDBcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nICh0aGF0LCBzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZW5jb2RpbmdcIiBtdXN0IGJlIGEgdmFsaWQgc3RyaW5nIGVuY29kaW5nJylcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcblxuICB2YXIgYWN0dWFsID0gdGhhdC53cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuXG4gIGlmIChhY3R1YWwgIT09IGxlbmd0aCkge1xuICAgIC8vIFdyaXRpbmcgYSBoZXggc3RyaW5nLCBmb3IgZXhhbXBsZSwgdGhhdCBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMgd2lsbFxuICAgIC8vIGNhdXNlIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0IGludmFsaWQgY2hhcmFjdGVyIHRvIGJlIGlnbm9yZWQuIChlLmcuXG4gICAgLy8gJ2FieHhjZCcgd2lsbCBiZSB0cmVhdGVkIGFzICdhYicpXG4gICAgdGhhdCA9IHRoYXQuc2xpY2UoMCwgYWN0dWFsKVxuICB9XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCA8IDAgPyAwIDogY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAodGhhdCwgYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICBhcnJheS5ieXRlTGVuZ3RoIC8vIHRoaXMgdGhyb3dzIGlmIGBhcnJheWAgaXMgbm90IGEgdmFsaWQgQXJyYXlCdWZmZXJcblxuICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnb2Zmc2V0XFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgKGxlbmd0aCB8fCAwKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdsZW5ndGhcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYnl0ZU9mZnNldCA9PT0gdW5kZWZpbmVkICYmIGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSlcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IGFycmF5XG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQgPSBmcm9tQXJyYXlMaWtlKHRoYXQsIGFycmF5KVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKHRoYXQsIG9iaikge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbilcblxuICAgIGlmICh0aGF0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoYXRcbiAgICB9XG5cbiAgICBvYmouY29weSh0aGF0LCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIHRoYXRcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgb2JqLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgaXNuYW4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCAwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aCgpYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFpc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2MoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBzdHJpbmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZ1xuICB9XG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2Vyc2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBUaGUgcHJvcGVydHkgaXMgdXNlZCBieSBgQnVmZmVyLmlzQnVmZmVyYCBhbmQgYGlzLWJ1ZmZlcmAgKGluIFNhZmFyaSA1LTcpIHRvIGRldGVjdFxuLy8gQnVmZmVyIGluc3RhbmNlcy5cbkJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuXG5mdW5jdGlvbiBzd2FwIChiLCBuLCBtKSB7XG4gIHZhciBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgMiAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMTYtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDEpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMzIgPSBmdW5jdGlvbiBzd2FwMzIgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAzKVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyAyKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDY0ID0gZnVuY3Rpb24gc3dhcDY0ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggfCAwXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgdmFyIHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIHZhciB5ID0gZW5kIC0gc3RhcnRcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgdmFyIHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIHZhciB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAgLy8gQ29lcmNlIHRvIE51bWJlci5cbiAgaWYgKGlzTmFOKGJ5dGVPZmZzZXQpKSB7XG4gICAgLy8gYnl0ZU9mZnNldDogaXQgaXQncyB1bmRlZmluZWQsIG51bGwsIE5hTiwgXCJmb29cIiwgZXRjLCBzZWFyY2ggd2hvbGUgYnVmZmVyXG4gICAgYnl0ZU9mZnNldCA9IGRpciA/IDAgOiAoYnVmZmVyLmxlbmd0aCAtIDEpXG4gIH1cblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldDogbmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoICsgYnl0ZU9mZnNldFxuICBpZiAoYnl0ZU9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgaWYgKGRpcikgcmV0dXJuIC0xXG4gICAgZWxzZSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCAtIDFcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgMCkge1xuICAgIGlmIChkaXIpIGJ5dGVPZmZzZXQgPSAwXG4gICAgZWxzZSByZXR1cm4gLTFcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB2YWxcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgfVxuXG4gIC8vIEZpbmFsbHksIHNlYXJjaCBlaXRoZXIgaW5kZXhPZiAoaWYgZGlyIGlzIHRydWUpIG9yIGxhc3RJbmRleE9mXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nL2J1ZmZlciBhbHdheXMgZmFpbHNcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAweEZGIC8vIFNlYXJjaCBmb3IgYSBieXRlIHZhbHVlIFswLTI1NV1cbiAgICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiZcbiAgICAgICAgdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgWyB2YWwgXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgdmFyIGluZGV4U2l6ZSA9IDFcbiAgdmFyIGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgdmFyIHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGRpcikge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChpc05hTihwYXJzZWQpKSByZXR1cm4gaVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHBhcnNlZFxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGFzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gbGF0aW4xV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggfCAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgLy8gbGVnYWN5IHdyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKSAtIHJlbW92ZSBpbiB2MC4xM1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpICsgMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZlxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBuZXdCdWYgPSB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpXG4gICAgbmV3QnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyArK2kpIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCAyKTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoY29kZSA8IDI1Nikge1xuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBCdWZmZXIuaXNCdWZmZXIodmFsKVxuICAgICAgPyB2YWxcbiAgICAgIDogdXRmOFRvQnl0ZXMobmV3IEJ1ZmZlcih2YWwsIGVuY29kaW5nKS50b1N0cmluZygpKVxuICAgIHZhciBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7ICsraSkge1xuICAgICAgdGhpc1tpICsgc3RhcnRdID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXitcXC8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHJpbmd0cmltKHN0cikucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBpc25hbiAodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHZhbCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9idWZmZXIvaW5kZXguanMiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCkge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcbiAgdmFyIGJhc2U2NCA9IG5ldyBCdWZmZXIoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICB2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG4gIHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L2llZWU3NTQvaW5kZXguanMiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vaXNhcnJheS9pbmRleC5qcyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsIihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGlmIChnbG9iYWwuc2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV4dEhhbmRsZSA9IDE7IC8vIFNwZWMgc2F5cyBncmVhdGVyIHRoYW4gemVyb1xuICAgIHZhciB0YXNrc0J5SGFuZGxlID0ge307XG4gICAgdmFyIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgIHZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG4gICAgdmFyIHJlZ2lzdGVySW1tZWRpYXRlO1xuXG4gICAgZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4gICAgICAvLyBDYWxsYmFjayBjYW4gZWl0aGVyIGJlIGEgZnVuY3Rpb24gb3IgYSBzdHJpbmdcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsYmFjayA9IG5ldyBGdW5jdGlvbihcIlwiICsgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgLy8gQ29weSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdO1xuICAgICAgfVxuICAgICAgLy8gU3RvcmUgYW5kIHJlZ2lzdGVyIHRoZSB0YXNrXG4gICAgICB2YXIgdGFzayA9IHsgY2FsbGJhY2s6IGNhbGxiYWNrLCBhcmdzOiBhcmdzIH07XG4gICAgICB0YXNrc0J5SGFuZGxlW25leHRIYW5kbGVdID0gdGFzaztcbiAgICAgIHJlZ2lzdGVySW1tZWRpYXRlKG5leHRIYW5kbGUpO1xuICAgICAgcmV0dXJuIG5leHRIYW5kbGUrKztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShoYW5kbGUpIHtcbiAgICAgICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW4odGFzaykge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0YXNrLmNhbGxiYWNrO1xuICAgICAgICB2YXIgYXJncyA9IHRhc2suYXJncztcbiAgICAgICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW5JZlByZXNlbnQoaGFuZGxlKSB7XG4gICAgICAgIC8vIEZyb20gdGhlIHNwZWM6IFwiV2FpdCB1bnRpbCBhbnkgaW52b2NhdGlvbnMgb2YgdGhpcyBhbGdvcml0aG0gc3RhcnRlZCBiZWZvcmUgdGhpcyBvbmUgaGF2ZSBjb21wbGV0ZWQuXCJcbiAgICAgICAgLy8gU28gaWYgd2UncmUgY3VycmVudGx5IHJ1bm5pbmcgYSB0YXNrLCB3ZSdsbCBuZWVkIHRvIGRlbGF5IHRoaXMgaW52b2NhdGlvbi5cbiAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdBVGFzaykge1xuICAgICAgICAgICAgLy8gRGVsYXkgYnkgZG9pbmcgYSBzZXRUaW1lb3V0LiBzZXRJbW1lZGlhdGUgd2FzIHRyaWVkIGluc3RlYWQsIGJ1dCBpbiBGaXJlZm94IDcgaXQgZ2VuZXJhdGVkIGFcbiAgICAgICAgICAgIC8vIFwidG9vIG11Y2ggcmVjdXJzaW9uXCIgZXJyb3IuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgICAgICAgICAgaWYgKHRhc2spIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bih0YXNrKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckltbWVkaWF0ZShoYW5kbGUpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkgeyBydW5JZlByZXNlbnQoaGFuZGxlKTsgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuVXNlUG9zdE1lc3NhZ2UoKSB7XG4gICAgICAgIC8vIFRoZSB0ZXN0IGFnYWluc3QgYGltcG9ydFNjcmlwdHNgIHByZXZlbnRzIHRoaXMgaW1wbGVtZW50YXRpb24gZnJvbSBiZWluZyBpbnN0YWxsZWQgaW5zaWRlIGEgd2ViIHdvcmtlcixcbiAgICAgICAgLy8gd2hlcmUgYGdsb2JhbC5wb3N0TWVzc2FnZWAgbWVhbnMgc29tZXRoaW5nIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFuZCBjYW4ndCBiZSB1c2VkIGZvciB0aGlzIHB1cnBvc2UuXG4gICAgICAgIGlmIChnbG9iYWwucG9zdE1lc3NhZ2UgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgICAgICAgICB2YXIgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IHRydWU7XG4gICAgICAgICAgICB2YXIgb2xkT25NZXNzYWdlID0gZ2xvYmFsLm9ubWVzc2FnZTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKFwiXCIsIFwiKlwiKTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBvbGRPbk1lc3NhZ2U7XG4gICAgICAgICAgICByZXR1cm4gcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICAvLyBJbnN0YWxscyBhbiBldmVudCBoYW5kbGVyIG9uIGBnbG9iYWxgIGZvciB0aGUgYG1lc3NhZ2VgIGV2ZW50OiBzZWVcbiAgICAgICAgLy8gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9ET00vd2luZG93LnBvc3RNZXNzYWdlXG4gICAgICAgIC8vICogaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvY29tbXMuaHRtbCNjcm9zc0RvY3VtZW50TWVzc2FnZXNcblxuICAgICAgICB2YXIgbWVzc2FnZVByZWZpeCA9IFwic2V0SW1tZWRpYXRlJFwiICsgTWF0aC5yYW5kb20oKSArIFwiJFwiO1xuICAgICAgICB2YXIgb25HbG9iYWxNZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5pbmRleE9mKG1lc3NhZ2VQcmVmaXgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KCtldmVudC5kYXRhLnNsaWNlKG1lc3NhZ2VQcmVmaXgubGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWwuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UobWVzc2FnZVByZWZpeCArIGhhbmRsZSwgXCIqXCIpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgPHNjcmlwdD4gZWxlbWVudDsgaXRzIHJlYWR5c3RhdGVjaGFuZ2UgZXZlbnQgd2lsbCBiZSBmaXJlZCBhc3luY2hyb25vdXNseSBvbmNlIGl0IGlzIGluc2VydGVkXG4gICAgICAgICAgICAvLyBpbnRvIHRoZSBkb2N1bWVudC4gRG8gc28sIHRodXMgcXVldWluZyB1cCB0aGUgdGFzay4gUmVtZW1iZXIgdG8gY2xlYW4gdXAgb25jZSBpdCdzIGJlZW4gY2FsbGVkLlxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBodG1sLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIElmIHN1cHBvcnRlZCwgd2Ugc2hvdWxkIGF0dGFjaCB0byB0aGUgcHJvdG90eXBlIG9mIGdsb2JhbCwgc2luY2UgdGhhdCBpcyB3aGVyZSBzZXRUaW1lb3V0IGV0IGFsLiBsaXZlLlxuICAgIHZhciBhdHRhY2hUbyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsKTtcbiAgICBhdHRhY2hUbyA9IGF0dGFjaFRvICYmIGF0dGFjaFRvLnNldFRpbWVvdXQgPyBhdHRhY2hUbyA6IGdsb2JhbDtcblxuICAgIC8vIERvbid0IGdldCBmb29sZWQgYnkgZS5nLiBicm93c2VyaWZ5IGVudmlyb25tZW50cy5cbiAgICBpZiAoe30udG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09IFwiW29iamVjdCBwcm9jZXNzXVwiKSB7XG4gICAgICAgIC8vIEZvciBOb2RlLmpzIGJlZm9yZSAwLjlcbiAgICAgICAgaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoY2FuVXNlUG9zdE1lc3NhZ2UoKSkge1xuICAgICAgICAvLyBGb3Igbm9uLUlFMTAgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCkge1xuICAgICAgICAvLyBGb3Igd2ViIHdvcmtlcnMsIHdoZXJlIHN1cHBvcnRlZFxuICAgICAgICBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChkb2MgJiYgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBpbiBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSkge1xuICAgICAgICAvLyBGb3IgSUUgNuKAkzhcbiAgICAgICAgaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yIG9sZGVyIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKTtcbiAgICB9XG5cbiAgICBhdHRhY2hUby5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG4gICAgYXR0YWNoVG8uY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcbn0odHlwZW9mIHNlbGYgPT09IFwidW5kZWZpbmVkXCIgPyB0eXBlb2YgZ2xvYmFsID09PSBcInVuZGVmaW5lZFwiID8gdGhpcyA6IGdsb2JhbCA6IHNlbGYpKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qcyIsIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9zdHlsZS1sb2FkZXIvZml4VXJscy5qcyIsInZhciBhcHBseSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcblxuLy8gRE9NIEFQSXMsIGZvciBjb21wbGV0ZW5lc3NcblxuZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldFRpbWVvdXQsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJUaW1lb3V0KTtcbn07XG5leHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldEludGVydmFsLCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFySW50ZXJ2YWwpO1xufTtcbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cbmV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHtcbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lb3V0LmNsb3NlKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcbiAgdGhpcy5faWQgPSBpZDtcbiAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG59XG5UaW1lb3V0LnByb3RvdHlwZS51bnJlZiA9IFRpbWVvdXQucHJvdG90eXBlLnJlZiA9IGZ1bmN0aW9uKCkge307XG5UaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jbGVhckZuLmNhbGwod2luZG93LCB0aGlzLl9pZCk7XG59O1xuXG4vLyBEb2VzIG5vdCBzdGFydCB0aGUgdGltZSwganVzdCBzZXRzIHVwIHRoZSBtZW1iZXJzIG5lZWRlZC5cbmV4cG9ydHMuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSwgbXNlY3MpIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IG1zZWNzO1xufTtcblxuZXhwb3J0cy51bmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IC0xO1xufTtcblxuZXhwb3J0cy5fdW5yZWZBY3RpdmUgPSBleHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXG4gIHZhciBtc2VjcyA9IGl0ZW0uX2lkbGVUaW1lb3V0O1xuICBpZiAobXNlY3MgPj0gMCkge1xuICAgIGl0ZW0uX2lkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpIHtcbiAgICAgIGlmIChpdGVtLl9vblRpbWVvdXQpXG4gICAgICAgIGl0ZW0uX29uVGltZW91dCgpO1xuICAgIH0sIG1zZWNzKTtcbiAgfVxufTtcblxuLy8gc2V0aW1tZWRpYXRlIGF0dGFjaGVzIGl0c2VsZiB0byB0aGUgZ2xvYmFsIG9iamVjdFxucmVxdWlyZShcInNldGltbWVkaWF0ZVwiKTtcbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuZXhwb3J0cy5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLl8xeXlxbkJ2UEU4bkp4bm9tY0trOTl2e3Bvc2l0aW9uOmZpeGVkO3JpZ2h0OjA7Ym90dG9tOjB9XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuZXhwb3J0cy5sb2NhbHMgPSB7XG5cdFwiZml4ZWRCb3R0b21cIjogXCJfMXl5cW5CdlBFOG5KeG5vbWNLazk5dlwiXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9jc3MtbG9hZGVyP3tcIm1vZHVsZXNcIjp0cnVlLFwibWluaW1pemVcIjp0cnVlLFwiY2FtZWxDYXNlXCI6dHJ1ZX0hLi9zdHlsZXMuY3NzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xudmFyIHN0eWxlc0luRG9tID0ge30sXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xuXHRcdHZhciBtZW1vO1xuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fTtcblx0fSxcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0XHQvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG5cdFx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlciBcblx0XHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0XHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0XHRyZXR1cm4gd2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2I7XG5cdH0pLFxuXHRnZXRFbGVtZW50ID0gKGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIG1lbW8gPSB7fTtcblx0XHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0bWVtb1tzZWxlY3Rvcl0gPSBmbi5jYWxsKHRoaXMsIHNlbGVjdG9yKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHRcdH07XG5cdH0pKGZ1bmN0aW9uIChzdHlsZVRhcmdldCkge1xuXHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN0eWxlVGFyZ2V0KVxuXHR9KSxcblx0c2luZ2xldG9uRWxlbWVudCA9IG51bGwsXG5cdHNpbmdsZXRvbkNvdW50ZXIgPSAwLFxuXHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdLFxuXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vZml4VXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0SW50byA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QpO1xuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspXG5cdFx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oKTtcblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMobGlzdCkge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gaXRlbVswXTtcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcblx0XHRpZighbmV3U3R5bGVzW2lkXSlcblx0XHRcdHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZVxuXHRcdFx0bmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xuXHR9XG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpIHtcblx0dmFyIHN0eWxlVGFyZ2V0ID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8pXG5cdGlmICghc3R5bGVUYXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydEludG8nIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcblx0fVxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcFtzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZighbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcblx0XHRcdHN0eWxlVGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIHN0eWxlVGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZihsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0c3R5bGVUYXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZVRhcmdldC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHRcdH1cblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlRWxlbWVudCk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdHN0eWxlVGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcuIE11c3QgYmUgJ3RvcCcgb3IgJ2JvdHRvbScuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcblx0c3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0dmFyIGlkeCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGVFbGVtZW50KTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuXHR2YXIgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cblx0YXR0YWNoVGFnQXR0cnMoc3R5bGVFbGVtZW50LCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCk7XG5cdHJldHVybiBzdHlsZUVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpIHtcblx0dmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0b3B0aW9ucy5hdHRycy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuXHRhdHRhY2hUYWdBdHRycyhsaW5rRWxlbWVudCwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rRWxlbWVudCk7XG5cdHJldHVybiBsaW5rRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gYXR0YWNoVGFnQXR0cnMoZWxlbWVudCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlRWxlbWVudCwgdXBkYXRlLCByZW1vdmU7XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cdFx0c3R5bGVFbGVtZW50ID0gc2luZ2xldG9uRWxlbWVudCB8fCAoc2luZ2xldG9uRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIHRydWUpO1xuXHR9IGVsc2UgaWYob2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuXHRcdFx0aWYoc3R5bGVFbGVtZW50LmhyZWYpXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGVFbGVtZW50LmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZShuZXdPYmopIHtcblx0XHRpZihuZXdPYmopIHtcblx0XHRcdGlmKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcClcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZUVsZW1lbnQsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlRWxlbWVudC5jaGlsZE5vZGVzO1xuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlRWxlbWVudC5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGVFbGVtZW50LCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcblx0XHR9XG5cdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsobGlua0VsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0LyogSWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpe1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmtFbGVtZW50LmhyZWY7XG5cblx0bGlua0VsZW1lbnQuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKVxuXHRcdFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4vc3R5bGVzLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi9zdHlsZXMuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi9zdHlsZXMuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3N0eWxlcy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=