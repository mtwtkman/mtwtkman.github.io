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
        { href: '/article/' + data.id },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWRhODc0N2IxNmRmZjRmMmVjNzciLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9taXRocmlsL21pdGhyaWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vZW50cnkuanMiLCJ3ZWJwYWNrOi8vLy4vbW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9iYXNlNjQtanMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L2llZWU3NTQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9pc2FycmF5L2luZGV4LmpzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L3N0eWxlLWxvYWRlci9maXhVcmxzLmpzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zdHlsZXMuY3NzIiwid2VicGFjazovLy8vVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zdHlsZXMuY3NzP2E4MTMiXSwibmFtZXMiOlsiVm5vZGUiLCJ0YWciLCJrZXkiLCJhdHRyczAiLCJjaGlsZHJlbiIsInRleHQiLCJkb20iLCJhdHRycyIsImRvbVNpemUiLCJ1bmRlZmluZWQiLCJzdGF0ZSIsIl9zdGF0ZSIsImV2ZW50cyIsImluc3RhbmNlIiwic2tpcCIsIm5vcm1hbGl6ZSIsIm5vZGUiLCJBcnJheSIsImlzQXJyYXkiLCJub3JtYWxpemVDaGlsZHJlbiIsImkiLCJsZW5ndGgiLCJzZWxlY3RvclBhcnNlciIsInNlbGVjdG9yQ2FjaGUiLCJoYXNPd24iLCJoYXNPd25Qcm9wZXJ0eSIsImNvbXBpbGVTZWxlY3RvciIsInNlbGVjdG9yIiwibWF0Y2giLCJjbGFzc2VzIiwiZXhlYyIsInR5cGUiLCJ2YWx1ZSIsImlkIiwicHVzaCIsImF0dHJWYWx1ZSIsInJlcGxhY2UiLCJjbGFzc05hbWUiLCJqb2luIiwiZXhlY1NlbGVjdG9yIiwiaGFzQXR0cnMiLCJjaGlsZExpc3QiLCJjbGFzcyIsImNhbGwiLCJoeXBlcnNjcmlwdCIsImFyZ3VtZW50cyIsInN0YXJ0IiwidmlldyIsIkVycm9yIiwiY2FjaGVkIiwibm9ybWFsaXplZCIsInRydXN0IiwiaHRtbCIsImZyYWdtZW50IiwiYXR0cnMxIiwibSIsIlByb21pc2VQb2x5ZmlsbCIsImV4ZWN1dG9yIiwiVHlwZUVycm9yIiwic2VsZiIsInJlc29sdmVycyIsInJlamVjdG9ycyIsInJlc29sdmVDdXJyZW50IiwiaGFuZGxlciIsInJlamVjdEN1cnJlbnQiLCJfaW5zdGFuY2UiLCJjYWxsQXN5bmMiLCJzZXRJbW1lZGlhdGUiLCJzZXRUaW1lb3V0IiwibGlzdCIsInNob3VsZEFic29yYiIsImV4ZWN1dGUiLCJ0aGVuIiwiZXhlY3V0ZU9uY2UiLCJiaW5kIiwiY29uc29sZSIsImVycm9yIiwicmV0cnkiLCJlIiwicnVucyIsInJ1biIsImZuIiwib25lcnJvciIsInByb3RvdHlwZSIsIm9uRnVsZmlsbGVkIiwib25SZWplY3Rpb24iLCJoYW5kbGUiLCJjYWxsYmFjayIsIm5leHQiLCJyZXNvbHZlTmV4dCIsInJlamVjdE5leHQiLCJwcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNhdGNoIiwiYWxsIiwidG90YWwiLCJjb3VudCIsInZhbHVlcyIsImNvbnN1bWUiLCJyYWNlIiwid2luZG93IiwiUHJvbWlzZSIsImdsb2JhbCIsImJ1aWxkUXVlcnlTdHJpbmciLCJvYmplY3QiLCJPYmplY3QiLCJ0b1N0cmluZyIsImFyZ3MiLCJrZXkwIiwiZGVzdHJ1Y3R1cmUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJGSUxFX1BST1RPQ09MX1JFR0VYIiwiUmVnRXhwIiwiXzgiLCIkd2luZG93IiwiY2FsbGJhY2tDb3VudCIsIm9uY29tcGxldGlvbiIsInNldENvbXBsZXRpb25DYWxsYmFjayIsImZpbmFsaXplciIsImNvbXBsZXRlIiwiZmluYWxpemUiLCJwcm9taXNlMCIsInRoZW4wIiwiYXBwbHkiLCJleHRyYSIsInVybCIsInJlcXVlc3QiLCJtZXRob2QiLCJ0b1VwcGVyQ2FzZSIsInVzZUJvZHkiLCJzZXJpYWxpemUiLCJGb3JtRGF0YSIsImRhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwiZGVzZXJpYWxpemUiLCJleHRyYWN0IiwiaW50ZXJwb2xhdGUiLCJhc3NlbWJsZSIsInhociIsIlhNTEh0dHBSZXF1ZXN0IiwiYWJvcnRlZCIsIl9hYm9ydCIsImFib3J0Iiwib3BlbiIsImFzeW5jIiwidXNlciIsInBhc3N3b3JkIiwic2V0UmVxdWVzdEhlYWRlciIsIndpdGhDcmVkZW50aWFscyIsImhlYWRlcnMiLCJjb25maWciLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwicmVzcG9uc2UiLCJzdGF0dXMiLCJ0ZXN0IiwiY2FzdCIsInJlc3BvbnNlVGV4dCIsInNlbmQiLCJiYWNrZ3JvdW5kIiwianNvbnAiLCJjYWxsYmFja05hbWUiLCJNYXRoIiwicm91bmQiLCJyYW5kb20iLCJzY3JpcHQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJjYWxsYmFja0tleSIsInNyYyIsImRvY3VtZW50RWxlbWVudCIsImFwcGVuZENoaWxkIiwidG9rZW5zIiwic2xpY2UiLCJxdWVyeXN0cmluZyIsInByZWZpeCIsImluZGV4T2YiLCJwYXJzZSIsInR5cGUwIiwicmVxdWVzdFNlcnZpY2UiLCJjb3JlUmVuZGVyZXIiLCIkZG9jIiwiJGVtcHR5RnJhZ21lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50Iiwib25ldmVudCIsInNldEV2ZW50Q2FsbGJhY2siLCJjcmVhdGVOb2RlcyIsInBhcmVudCIsInZub2RlcyIsImVuZCIsImhvb2tzIiwibmV4dFNpYmxpbmciLCJucyIsInZub2RlIiwiY3JlYXRlTm9kZSIsImluaXRMaWZlY3ljbGUiLCJjcmVhdGVUZXh0IiwiY3JlYXRlSFRNTCIsImNyZWF0ZUZyYWdtZW50IiwiY3JlYXRlQ29tcG9uZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJpbnNlcnROb2RlIiwibWF0Y2gxIiwicGFyZW50MSIsImNhcHRpb24iLCJ0aGVhZCIsInRib2R5IiwidGZvb3QiLCJ0ciIsInRoIiwidGQiLCJjb2xncm91cCIsImNvbCIsInRlbXAiLCJpbm5lckhUTUwiLCJmaXJzdENoaWxkIiwiY2hpbGROb2RlcyIsImNoaWxkIiwiYXR0cnMyIiwiaXMiLCJlbGVtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwic2V0QXR0cnMiLCJjb250ZW50ZWRpdGFibGUiLCJzZXRDb250ZW50RWRpdGFibGUiLCJ0ZXh0Q29udGVudCIsInNldExhdGVBdHRycyIsImluaXRDb21wb25lbnQiLCJzZW50aW5lbCIsImNyZWF0ZSIsIiQkcmVlbnRyYW50TG9jayQkIiwidXBkYXRlTm9kZXMiLCJvbGQiLCJyZWN5Y2xpbmciLCJyZW1vdmVOb2RlcyIsImlzVW5rZXllZCIsImdldE5leHRTaWJsaW5nIiwidXBkYXRlTm9kZSIsImlzUmVjeWNsYWJsZSIsInBvb2wiLCJjb25jYXQiLCJvbGRTdGFydCIsIm9sZEVuZCIsIm1hcCIsIm8iLCJ2Iiwic2hvdWxkUmVjeWNsZSIsInRvRnJhZ21lbnQiLCJnZXRLZXlNYXAiLCJvbGRJbmRleCIsIm1vdmFibGUiLCJvbGRUYWciLCJzaG91bGROb3RVcGRhdGUiLCJ1cGRhdGVMaWZlY3ljbGUiLCJ1cGRhdGVUZXh0IiwidXBkYXRlSFRNTCIsInVwZGF0ZUZyYWdtZW50IiwidXBkYXRlRWxlbWVudCIsInVwZGF0ZUNvbXBvbmVudCIsInJlbW92ZU5vZGUiLCJub2RlVmFsdWUiLCJ1cGRhdGVBdHRycyIsImFicyIsIm9sZENoaWxkcmVuTGVuZ3RoIiwicG9vbENoaWxkcmVuTGVuZ3RoIiwidm5vZGVzQ2hpbGRyZW5MZW5ndGgiLCJrZXkyIiwiY291bnQwIiwiaW5zZXJ0QmVmb3JlIiwiY29udGVudCIsImNvbnRleHQiLCJleHBlY3RlZCIsImNhbGxlZCIsIm9uYmVmb3JlcmVtb3ZlIiwicmVzdWx0IiwiY29udGludWF0aW9uIiwib25yZW1vdmUiLCJyZW1vdmVOb2RlRnJvbURPTSIsImhhc0ludGVncmF0aW9uTWV0aG9kcyIsInNldEF0dHIiLCJpc0Zvcm1BdHRyaWJ1dGUiLCJpc0xpZmVjeWNsZU1ldGhvZCIsIm5zTGFzdEluZGV4Iiwic3Vic3RyIiwic2V0QXR0cmlidXRlTlMiLCJ1cGRhdGVFdmVudCIsInVwZGF0ZVN0eWxlIiwiaXNBdHRyaWJ1dGUiLCJpc0N1c3RvbUVsZW1lbnQiLCJhY3RpdmVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwic2VsZWN0ZWRJbmRleCIsImF0dHIiLCJzb3VyY2UiLCJvbmNyZWF0ZSIsIm9udXBkYXRlIiwic3R5bGUiLCJjc3NUZXh0IiwiZXZlbnROYW1lIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbmluaXQiLCJmb3JjZVZub2RlVXBkYXRlIiwiZm9yY2VDb21wb25lbnRVcGRhdGUiLCJvbmJlZm9yZXVwZGF0ZSIsInJlbmRlciIsImFjdGl2ZSIsImZvY3VzIiwidGhyb3R0bGUiLCJ0aW1lIiwibGFzdCIsInBlbmRpbmciLCJ0aW1lb3V0IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibm93IiwiRGF0ZSIsIl8xMSIsInJlbmRlclNlcnZpY2UiLCJyZWRyYXciLCJjYWxsYmFja3MiLCJzdWJzY3JpYmUiLCJrZXkxIiwidW5zdWJzY3JpYmUiLCJpbmRleCIsInNwbGljZSIsInJlZHJhd1NlcnZpY2UiLCJfMTYiLCJyZWRyYXdTZXJ2aWNlMCIsInJvb3QiLCJjb21wb25lbnQiLCJydW4wIiwibW91bnQiLCJwYXJzZVF1ZXJ5U3RyaW5nIiwic3RyaW5nIiwiY2hhckF0IiwiZW50cmllcyIsInNwbGl0IiwiZGF0YTAiLCJjb3VudGVycyIsImVudHJ5Iiwia2V5NSIsImRlY29kZVVSSUNvbXBvbmVudCIsImxldmVscyIsImN1cnNvciIsInBvcCIsImoiLCJsZXZlbCIsIm5leHRMZXZlbCIsImlzTnVtYmVyIiwiaXNOYU4iLCJwYXJzZUludCIsImlzVmFsdWUiLCJjb3JlUm91dGVyIiwic3VwcG9ydHNQdXNoU3RhdGUiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiY2FsbEFzeW5jMCIsIm5vcm1hbGl6ZTEiLCJmcmFnbWVudDAiLCJsb2NhdGlvbiIsImFzeW5jSWQiLCJkZWJvdW5jZUFzeW5jIiwiY2FsbGJhY2swIiwicGFyc2VQYXRoIiwicGF0aCIsInF1ZXJ5RGF0YSIsImhhc2hEYXRhIiwicXVlcnlJbmRleCIsImhhc2hJbmRleCIsInBhdGhFbmQiLCJxdWVyeUVuZCIsInF1ZXJ5UGFyYW1zIiwia2V5NCIsImhhc2hQYXJhbXMiLCJyb3V0ZXIiLCJnZXRQYXRoIiwidHlwZTIiLCJzZXRQYXRoIiwib3B0aW9ucyIsIm1hdGNoMiIsInRva2VuIiwicXVlcnkiLCJoYXNoIiwidGl0bGUiLCJvbnBvcHN0YXRlIiwicmVwbGFjZVN0YXRlIiwiaHJlZiIsImRlZmluZVJvdXRlcyIsInJvdXRlcyIsInJlc29sdmVSb3V0ZSIsInBhcmFtcyIsInBhdGhuYW1lIiwiayIsInJvdXRlMCIsIm1hdGNoZXIiLCJrZXlzIiwib25oYXNoY2hhbmdlIiwiXzIwIiwicm91dGVTZXJ2aWNlIiwiaWRlbnRpdHkiLCJyZW5kZXIxIiwiYXR0cnMzIiwiY3VycmVudFBhdGgiLCJsYXN0VXBkYXRlIiwicm91dGUiLCJkZWZhdWx0Um91dGUiLCJydW4xIiwiYmFpbCIsInBheWxvYWQiLCJ1cGRhdGUiLCJyb3V0ZVJlc29sdmVyIiwiY29tcCIsIm9ubWF0Y2giLCJyZXNvbHZlZCIsInNldCIsImdldCIsInByZWZpeDAiLCJsaW5rIiwidm5vZGUxIiwib25jbGljayIsImN0cmxLZXkiLCJtZXRhS2V5Iiwic2hpZnRLZXkiLCJ3aGljaCIsInByZXZlbnREZWZhdWx0IiwiZ2V0QXR0cmlidXRlIiwicGFyYW0iLCJrZXkzIiwid2l0aEF0dHIiLCJhdHRyTmFtZSIsImNhbGxiYWNrMSIsImN1cnJlbnRUYXJnZXQiLCJfMjgiLCJ2ZXJzaW9uIiwibW9kdWxlIiwiZyIsIkZ1bmN0aW9uIiwiZXZhbCIsImV4cG9ydHMiLCJVbCIsImlubmVyIiwiTGkiLCJEZXRhaWxzIiwic3VtbWFyeSIsIlllYXIiLCJtb250aHMiLCJkIiwieWVhciIsIk1vbnRoIiwiZGF5cyIsIm1vbnRoIiwiRGF5IiwiZGF5IiwiZmV0Y2giLCJhcnRpY2xlSW5kZXgiLCJmZXRjaGVkIiwiZ2V0RWxlbWVudEJ5SWQiLCJNb2RlbCIsImJ5dGVMZW5ndGgiLCJ0b0J5dGVBcnJheSIsImZyb21CeXRlQXJyYXkiLCJsb29rdXAiLCJyZXZMb29rdXAiLCJBcnIiLCJVaW50OEFycmF5IiwiY29kZSIsImxlbiIsImNoYXJDb2RlQXQiLCJwbGFjZUhvbGRlcnNDb3VudCIsImI2NCIsImwiLCJ0bXAiLCJwbGFjZUhvbGRlcnMiLCJhcnIiLCJMIiwidHJpcGxldFRvQmFzZTY0IiwibnVtIiwiZW5jb2RlQ2h1bmsiLCJ1aW50OCIsIm91dHB1dCIsImV4dHJhQnl0ZXMiLCJwYXJ0cyIsIm1heENodW5rTGVuZ3RoIiwibGVuMiIsImJhc2U2NCIsInJlcXVpcmUiLCJpZWVlNzU0IiwiQnVmZmVyIiwiU2xvd0J1ZmZlciIsIklOU1BFQ1RfTUFYX0JZVEVTIiwiVFlQRURfQVJSQVlfU1VQUE9SVCIsInR5cGVkQXJyYXlTdXBwb3J0Iiwia01heExlbmd0aCIsIl9fcHJvdG9fXyIsImZvbyIsInN1YmFycmF5IiwiY3JlYXRlQnVmZmVyIiwidGhhdCIsIlJhbmdlRXJyb3IiLCJhcmciLCJlbmNvZGluZ09yT2Zmc2V0IiwiYWxsb2NVbnNhZmUiLCJmcm9tIiwicG9vbFNpemUiLCJfYXVnbWVudCIsIkFycmF5QnVmZmVyIiwiZnJvbUFycmF5QnVmZmVyIiwiZnJvbVN0cmluZyIsImZyb21PYmplY3QiLCJTeW1ib2wiLCJzcGVjaWVzIiwiZGVmaW5lUHJvcGVydHkiLCJjb25maWd1cmFibGUiLCJhc3NlcnRTaXplIiwic2l6ZSIsImFsbG9jIiwiZmlsbCIsImVuY29kaW5nIiwiY2hlY2tlZCIsImFsbG9jVW5zYWZlU2xvdyIsImlzRW5jb2RpbmciLCJhY3R1YWwiLCJ3cml0ZSIsImZyb21BcnJheUxpa2UiLCJhcnJheSIsImJ5dGVPZmZzZXQiLCJvYmoiLCJpc0J1ZmZlciIsImNvcHkiLCJidWZmZXIiLCJpc25hbiIsImIiLCJfaXNCdWZmZXIiLCJjb21wYXJlIiwiYSIsIngiLCJ5IiwibWluIiwiU3RyaW5nIiwidG9Mb3dlckNhc2UiLCJwb3MiLCJidWYiLCJpc1ZpZXciLCJsb3dlcmVkQ2FzZSIsInV0ZjhUb0J5dGVzIiwiYmFzZTY0VG9CeXRlcyIsInNsb3dUb1N0cmluZyIsImhleFNsaWNlIiwidXRmOFNsaWNlIiwiYXNjaWlTbGljZSIsImxhdGluMVNsaWNlIiwiYmFzZTY0U2xpY2UiLCJ1dGYxNmxlU2xpY2UiLCJzd2FwIiwibiIsInN3YXAxNiIsInN3YXAzMiIsInN3YXA2NCIsImVxdWFscyIsImluc3BlY3QiLCJzdHIiLCJtYXgiLCJ0YXJnZXQiLCJ0aGlzU3RhcnQiLCJ0aGlzRW5kIiwidGhpc0NvcHkiLCJ0YXJnZXRDb3B5IiwiYmlkaXJlY3Rpb25hbEluZGV4T2YiLCJ2YWwiLCJkaXIiLCJhcnJheUluZGV4T2YiLCJsYXN0SW5kZXhPZiIsImluZGV4U2l6ZSIsImFyckxlbmd0aCIsInZhbExlbmd0aCIsInJlYWQiLCJyZWFkVUludDE2QkUiLCJmb3VuZEluZGV4IiwiZm91bmQiLCJpbmNsdWRlcyIsImhleFdyaXRlIiwib2Zmc2V0IiwiTnVtYmVyIiwicmVtYWluaW5nIiwic3RyTGVuIiwicGFyc2VkIiwidXRmOFdyaXRlIiwiYmxpdEJ1ZmZlciIsImFzY2lpV3JpdGUiLCJhc2NpaVRvQnl0ZXMiLCJsYXRpbjFXcml0ZSIsImJhc2U2NFdyaXRlIiwidWNzMldyaXRlIiwidXRmMTZsZVRvQnl0ZXMiLCJpc0Zpbml0ZSIsInRvSlNPTiIsIl9hcnIiLCJyZXMiLCJmaXJzdEJ5dGUiLCJjb2RlUG9pbnQiLCJieXRlc1BlclNlcXVlbmNlIiwic2Vjb25kQnl0ZSIsInRoaXJkQnl0ZSIsImZvdXJ0aEJ5dGUiLCJ0ZW1wQ29kZVBvaW50IiwiZGVjb2RlQ29kZVBvaW50c0FycmF5IiwiTUFYX0FSR1VNRU5UU19MRU5HVEgiLCJjb2RlUG9pbnRzIiwiZnJvbUNoYXJDb2RlIiwicmV0Iiwib3V0IiwidG9IZXgiLCJieXRlcyIsIm5ld0J1ZiIsInNsaWNlTGVuIiwiY2hlY2tPZmZzZXQiLCJleHQiLCJyZWFkVUludExFIiwibm9Bc3NlcnQiLCJtdWwiLCJyZWFkVUludEJFIiwicmVhZFVJbnQ4IiwicmVhZFVJbnQxNkxFIiwicmVhZFVJbnQzMkxFIiwicmVhZFVJbnQzMkJFIiwicmVhZEludExFIiwicG93IiwicmVhZEludEJFIiwicmVhZEludDgiLCJyZWFkSW50MTZMRSIsInJlYWRJbnQxNkJFIiwicmVhZEludDMyTEUiLCJyZWFkSW50MzJCRSIsInJlYWRGbG9hdExFIiwicmVhZEZsb2F0QkUiLCJyZWFkRG91YmxlTEUiLCJyZWFkRG91YmxlQkUiLCJjaGVja0ludCIsIndyaXRlVUludExFIiwibWF4Qnl0ZXMiLCJ3cml0ZVVJbnRCRSIsIndyaXRlVUludDgiLCJmbG9vciIsIm9iamVjdFdyaXRlVUludDE2IiwibGl0dGxlRW5kaWFuIiwid3JpdGVVSW50MTZMRSIsIndyaXRlVUludDE2QkUiLCJvYmplY3RXcml0ZVVJbnQzMiIsIndyaXRlVUludDMyTEUiLCJ3cml0ZVVJbnQzMkJFIiwid3JpdGVJbnRMRSIsImxpbWl0Iiwic3ViIiwid3JpdGVJbnRCRSIsIndyaXRlSW50OCIsIndyaXRlSW50MTZMRSIsIndyaXRlSW50MTZCRSIsIndyaXRlSW50MzJMRSIsIndyaXRlSW50MzJCRSIsImNoZWNrSUVFRTc1NCIsIndyaXRlRmxvYXQiLCJ3cml0ZUZsb2F0TEUiLCJ3cml0ZUZsb2F0QkUiLCJ3cml0ZURvdWJsZSIsIndyaXRlRG91YmxlTEUiLCJ3cml0ZURvdWJsZUJFIiwidGFyZ2V0U3RhcnQiLCJJTlZBTElEX0JBU0U2NF9SRSIsImJhc2U2NGNsZWFuIiwic3RyaW5ndHJpbSIsInRyaW0iLCJ1bml0cyIsIkluZmluaXR5IiwibGVhZFN1cnJvZ2F0ZSIsImJ5dGVBcnJheSIsImMiLCJoaSIsImxvIiwiZHN0IiwidXNlU291cmNlTWFwIiwiaXRlbSIsImNzc1dpdGhNYXBwaW5nVG9TdHJpbmciLCJtb2R1bGVzIiwibWVkaWFRdWVyeSIsImFscmVhZHlJbXBvcnRlZE1vZHVsZXMiLCJjc3NNYXBwaW5nIiwic291cmNlTWFwcGluZyIsInRvQ29tbWVudCIsInNvdXJjZVVSTHMiLCJzb3VyY2VzIiwic291cmNlUm9vdCIsInNvdXJjZU1hcCIsImlzTEUiLCJtTGVuIiwibkJ5dGVzIiwiZUxlbiIsImVNYXgiLCJlQmlhcyIsIm5CaXRzIiwicyIsIk5hTiIsInJ0IiwibG9nIiwiTE4yIiwicHJvY2VzcyIsImNhY2hlZFNldFRpbWVvdXQiLCJjYWNoZWRDbGVhclRpbWVvdXQiLCJkZWZhdWx0U2V0VGltb3V0IiwiZGVmYXVsdENsZWFyVGltZW91dCIsImNsZWFyVGltZW91dCIsInJ1blRpbWVvdXQiLCJmdW4iLCJydW5DbGVhclRpbWVvdXQiLCJtYXJrZXIiLCJxdWV1ZSIsImRyYWluaW5nIiwiY3VycmVudFF1ZXVlIiwicXVldWVJbmRleCIsImNsZWFuVXBOZXh0VGljayIsImRyYWluUXVldWUiLCJuZXh0VGljayIsIkl0ZW0iLCJicm93c2VyIiwiZW52IiwiYXJndiIsInZlcnNpb25zIiwibm9vcCIsIm9uIiwiYWRkTGlzdGVuZXIiLCJvbmNlIiwib2ZmIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJlbWl0IiwiYmluZGluZyIsIm5hbWUiLCJjd2QiLCJjaGRpciIsInVtYXNrIiwibmV4dEhhbmRsZSIsInRhc2tzQnlIYW5kbGUiLCJjdXJyZW50bHlSdW5uaW5nQVRhc2siLCJkb2MiLCJyZWdpc3RlckltbWVkaWF0ZSIsInRhc2siLCJjbGVhckltbWVkaWF0ZSIsInJ1bklmUHJlc2VudCIsImluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uIiwiY2FuVXNlUG9zdE1lc3NhZ2UiLCJwb3N0TWVzc2FnZSIsImltcG9ydFNjcmlwdHMiLCJwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzIiwib2xkT25NZXNzYWdlIiwib25tZXNzYWdlIiwiaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24iLCJtZXNzYWdlUHJlZml4Iiwib25HbG9iYWxNZXNzYWdlIiwiZXZlbnQiLCJhdHRhY2hFdmVudCIsImluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uIiwiY2hhbm5lbCIsIk1lc3NhZ2VDaGFubmVsIiwicG9ydDEiLCJwb3J0MiIsImluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24iLCJpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uIiwiYXR0YWNoVG8iLCJnZXRQcm90b3R5cGVPZiIsImNzcyIsImJhc2VVcmwiLCJwcm90b2NvbCIsImhvc3QiLCJjdXJyZW50RGlyIiwiZml4ZWRDc3MiLCJmdWxsTWF0Y2giLCJvcmlnVXJsIiwidW5xdW90ZWRPcmlnVXJsIiwiJDEiLCJuZXdVcmwiLCJUaW1lb3V0Iiwic2V0SW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwiY2xvc2UiLCJjbGVhckZuIiwiX2lkIiwiX2NsZWFyRm4iLCJ1bnJlZiIsInJlZiIsImVucm9sbCIsIm1zZWNzIiwiX2lkbGVUaW1lb3V0SWQiLCJfaWRsZVRpbWVvdXQiLCJ1bmVucm9sbCIsIl91bnJlZkFjdGl2ZSIsIm9uVGltZW91dCIsIl9vblRpbWVvdXQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7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QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDs7QUFFQSw2QkFBNkIsbUJBQW1COztBQUVoRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNqU0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBaUY7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNWRhODc0N2IxNmRmZjRmMmVjNzciLCI7KGZ1bmN0aW9uKCkge1xuXCJ1c2Ugc3RyaWN0XCJcbmZ1bmN0aW9uIFZub2RlKHRhZywga2V5LCBhdHRyczAsIGNoaWxkcmVuLCB0ZXh0LCBkb20pIHtcblx0cmV0dXJuIHt0YWc6IHRhZywga2V5OiBrZXksIGF0dHJzOiBhdHRyczAsIGNoaWxkcmVuOiBjaGlsZHJlbiwgdGV4dDogdGV4dCwgZG9tOiBkb20sIGRvbVNpemU6IHVuZGVmaW5lZCwgc3RhdGU6IHVuZGVmaW5lZCwgX3N0YXRlOiB1bmRlZmluZWQsIGV2ZW50czogdW5kZWZpbmVkLCBpbnN0YW5jZTogdW5kZWZpbmVkLCBza2lwOiBmYWxzZX1cbn1cblZub2RlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKG5vZGUpIHtcblx0aWYgKEFycmF5LmlzQXJyYXkobm9kZSkpIHJldHVybiBWbm9kZShcIltcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKG5vZGUpLCB1bmRlZmluZWQsIHVuZGVmaW5lZClcblx0aWYgKG5vZGUgIT0gbnVsbCAmJiB0eXBlb2Ygbm9kZSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIFZub2RlKFwiI1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgbm9kZSA9PT0gZmFsc2UgPyBcIlwiIDogbm9kZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQpXG5cdHJldHVybiBub2RlXG59XG5Wbm9kZS5ub3JtYWxpemVDaGlsZHJlbiA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUNoaWxkcmVuKGNoaWxkcmVuKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRjaGlsZHJlbltpXSA9IFZub2RlLm5vcm1hbGl6ZShjaGlsZHJlbltpXSlcblx0fVxuXHRyZXR1cm4gY2hpbGRyZW5cbn1cbnZhciBzZWxlY3RvclBhcnNlciA9IC8oPzooXnwjfFxcLikoW14jXFwuXFxbXFxdXSspKXwoXFxbKC4rPykoPzpcXHMqPVxccyooXCJ8J3wpKCg/OlxcXFxbXCInXFxdXXwuKSo/KVxcNSk/XFxdKS9nXG52YXIgc2VsZWN0b3JDYWNoZSA9IHt9XG52YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHlcbmZ1bmN0aW9uIGNvbXBpbGVTZWxlY3RvcihzZWxlY3Rvcikge1xuXHR2YXIgbWF0Y2gsIHRhZyA9IFwiZGl2XCIsIGNsYXNzZXMgPSBbXSwgYXR0cnMgPSB7fVxuXHR3aGlsZSAobWF0Y2ggPSBzZWxlY3RvclBhcnNlci5leGVjKHNlbGVjdG9yKSkge1xuXHRcdHZhciB0eXBlID0gbWF0Y2hbMV0sIHZhbHVlID0gbWF0Y2hbMl1cblx0XHRpZiAodHlwZSA9PT0gXCJcIiAmJiB2YWx1ZSAhPT0gXCJcIikgdGFnID0gdmFsdWVcblx0XHRlbHNlIGlmICh0eXBlID09PSBcIiNcIikgYXR0cnMuaWQgPSB2YWx1ZVxuXHRcdGVsc2UgaWYgKHR5cGUgPT09IFwiLlwiKSBjbGFzc2VzLnB1c2godmFsdWUpXG5cdFx0ZWxzZSBpZiAobWF0Y2hbM11bMF0gPT09IFwiW1wiKSB7XG5cdFx0XHR2YXIgYXR0clZhbHVlID0gbWF0Y2hbNl1cblx0XHRcdGlmIChhdHRyVmFsdWUpIGF0dHJWYWx1ZSA9IGF0dHJWYWx1ZS5yZXBsYWNlKC9cXFxcKFtcIiddKS9nLCBcIiQxXCIpLnJlcGxhY2UoL1xcXFxcXFxcL2csIFwiXFxcXFwiKVxuXHRcdFx0aWYgKG1hdGNoWzRdID09PSBcImNsYXNzXCIpIGNsYXNzZXMucHVzaChhdHRyVmFsdWUpXG5cdFx0XHRlbHNlIGF0dHJzW21hdGNoWzRdXSA9IGF0dHJWYWx1ZSB8fCB0cnVlXG5cdFx0fVxuXHR9XG5cdGlmIChjbGFzc2VzLmxlbmd0aCA+IDApIGF0dHJzLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbihcIiBcIilcblx0cmV0dXJuIHNlbGVjdG9yQ2FjaGVbc2VsZWN0b3JdID0ge3RhZzogdGFnLCBhdHRyczogYXR0cnN9XG59XG5mdW5jdGlvbiBleGVjU2VsZWN0b3Ioc3RhdGUsIGF0dHJzLCBjaGlsZHJlbikge1xuXHR2YXIgaGFzQXR0cnMgPSBmYWxzZSwgY2hpbGRMaXN0LCB0ZXh0XG5cdHZhciBjbGFzc05hbWUgPSBhdHRycy5jbGFzc05hbWUgfHwgYXR0cnMuY2xhc3Ncblx0Zm9yICh2YXIga2V5IGluIHN0YXRlLmF0dHJzKSB7XG5cdFx0aWYgKGhhc093bi5jYWxsKHN0YXRlLmF0dHJzLCBrZXkpKSB7XG5cdFx0XHRhdHRyc1trZXldID0gc3RhdGUuYXR0cnNba2V5XVxuXHRcdH1cblx0fVxuXHRpZiAoY2xhc3NOYW1lICE9PSB1bmRlZmluZWQpIHtcblx0XHRpZiAoYXR0cnMuY2xhc3MgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0YXR0cnMuY2xhc3MgPSB1bmRlZmluZWRcblx0XHRcdGF0dHJzLmNsYXNzTmFtZSA9IGNsYXNzTmFtZVxuXHRcdH1cblx0XHRpZiAoc3RhdGUuYXR0cnMuY2xhc3NOYW1lICE9IG51bGwpIHtcblx0XHRcdGF0dHJzLmNsYXNzTmFtZSA9IHN0YXRlLmF0dHJzLmNsYXNzTmFtZSArIFwiIFwiICsgY2xhc3NOYW1lXG5cdFx0fVxuXHR9XG5cdGZvciAodmFyIGtleSBpbiBhdHRycykge1xuXHRcdGlmIChoYXNPd24uY2FsbChhdHRycywga2V5KSAmJiBrZXkgIT09IFwia2V5XCIpIHtcblx0XHRcdGhhc0F0dHJzID0gdHJ1ZVxuXHRcdFx0YnJlYWtcblx0XHR9XG5cdH1cblx0aWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pICYmIGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJiBjaGlsZHJlblswXSAhPSBudWxsICYmIGNoaWxkcmVuWzBdLnRhZyA9PT0gXCIjXCIpIHtcblx0XHR0ZXh0ID0gY2hpbGRyZW5bMF0uY2hpbGRyZW5cblx0fSBlbHNlIHtcblx0XHRjaGlsZExpc3QgPSBjaGlsZHJlblxuXHR9XG5cdHJldHVybiBWbm9kZShzdGF0ZS50YWcsIGF0dHJzLmtleSwgaGFzQXR0cnMgPyBhdHRycyA6IHVuZGVmaW5lZCwgY2hpbGRMaXN0LCB0ZXh0KVxufVxuZnVuY3Rpb24gaHlwZXJzY3JpcHQoc2VsZWN0b3IpIHtcblx0Ly8gQmVjYXVzZSBzbG9wcHkgbW9kZSBzdWNrc1xuXHR2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV0sIHN0YXJ0ID0gMiwgY2hpbGRyZW5cblx0aWYgKHNlbGVjdG9yID09IG51bGwgfHwgdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiBzZWxlY3RvciAhPT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBzZWxlY3Rvci52aWV3ICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHR0aHJvdyBFcnJvcihcIlRoZSBzZWxlY3RvciBtdXN0IGJlIGVpdGhlciBhIHN0cmluZyBvciBhIGNvbXBvbmVudC5cIik7XG5cdH1cblx0aWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHZhciBjYWNoZWQgPSBzZWxlY3RvckNhY2hlW3NlbGVjdG9yXSB8fCBjb21waWxlU2VsZWN0b3Ioc2VsZWN0b3IpXG5cdH1cblx0aWYgKGF0dHJzID09IG51bGwpIHtcblx0XHRhdHRycyA9IHt9XG5cdH0gZWxzZSBpZiAodHlwZW9mIGF0dHJzICE9PSBcIm9iamVjdFwiIHx8IGF0dHJzLnRhZyAhPSBudWxsIHx8IEFycmF5LmlzQXJyYXkoYXR0cnMpKSB7XG5cdFx0YXR0cnMgPSB7fVxuXHRcdHN0YXJ0ID0gMVxuXHR9XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSBzdGFydCArIDEpIHtcblx0XHRjaGlsZHJlbiA9IGFyZ3VtZW50c1tzdGFydF1cblx0XHRpZiAoIUFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSBjaGlsZHJlbiA9IFtjaGlsZHJlbl1cblx0fSBlbHNlIHtcblx0XHRjaGlsZHJlbiA9IFtdXG5cdFx0d2hpbGUgKHN0YXJ0IDwgYXJndW1lbnRzLmxlbmd0aCkgY2hpbGRyZW4ucHVzaChhcmd1bWVudHNbc3RhcnQrK10pXG5cdH1cblx0dmFyIG5vcm1hbGl6ZWQgPSBWbm9kZS5ub3JtYWxpemVDaGlsZHJlbihjaGlsZHJlbilcblx0aWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybiBleGVjU2VsZWN0b3IoY2FjaGVkLCBhdHRycywgbm9ybWFsaXplZClcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gVm5vZGUoc2VsZWN0b3IsIGF0dHJzLmtleSwgYXR0cnMsIG5vcm1hbGl6ZWQpXG5cdH1cbn1cbmh5cGVyc2NyaXB0LnRydXN0ID0gZnVuY3Rpb24oaHRtbCkge1xuXHRpZiAoaHRtbCA9PSBudWxsKSBodG1sID0gXCJcIlxuXHRyZXR1cm4gVm5vZGUoXCI8XCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBodG1sLCB1bmRlZmluZWQsIHVuZGVmaW5lZClcbn1cbmh5cGVyc2NyaXB0LmZyYWdtZW50ID0gZnVuY3Rpb24oYXR0cnMxLCBjaGlsZHJlbikge1xuXHRyZXR1cm4gVm5vZGUoXCJbXCIsIGF0dHJzMS5rZXksIGF0dHJzMSwgVm5vZGUubm9ybWFsaXplQ2hpbGRyZW4oY2hpbGRyZW4pLCB1bmRlZmluZWQsIHVuZGVmaW5lZClcbn1cbnZhciBtID0gaHlwZXJzY3JpcHRcbi8qKiBAY29uc3RydWN0b3IgKi9cbnZhciBQcm9taXNlUG9seWZpbGwgPSBmdW5jdGlvbihleGVjdXRvcikge1xuXHRpZiAoISh0aGlzIGluc3RhbmNlb2YgUHJvbWlzZVBvbHlmaWxsKSkgdGhyb3cgbmV3IEVycm9yKFwiUHJvbWlzZSBtdXN0IGJlIGNhbGxlZCB3aXRoIGBuZXdgXCIpXG5cdGlmICh0eXBlb2YgZXhlY3V0b3IgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcImV4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvblwiKVxuXHR2YXIgc2VsZiA9IHRoaXMsIHJlc29sdmVycyA9IFtdLCByZWplY3RvcnMgPSBbXSwgcmVzb2x2ZUN1cnJlbnQgPSBoYW5kbGVyKHJlc29sdmVycywgdHJ1ZSksIHJlamVjdEN1cnJlbnQgPSBoYW5kbGVyKHJlamVjdG9ycywgZmFsc2UpXG5cdHZhciBpbnN0YW5jZSA9IHNlbGYuX2luc3RhbmNlID0ge3Jlc29sdmVyczogcmVzb2x2ZXJzLCByZWplY3RvcnM6IHJlamVjdG9yc31cblx0dmFyIGNhbGxBc3luYyA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHNldEltbWVkaWF0ZSA6IHNldFRpbWVvdXRcblx0ZnVuY3Rpb24gaGFuZGxlcihsaXN0LCBzaG91bGRBYnNvcmIpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gZXhlY3V0ZSh2YWx1ZSkge1xuXHRcdFx0dmFyIHRoZW5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmIChzaG91bGRBYnNvcmIgJiYgdmFsdWUgIT0gbnVsbCAmJiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSAmJiB0eXBlb2YgKHRoZW4gPSB2YWx1ZS50aGVuKSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0aWYgKHZhbHVlID09PSBzZWxmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCB3LyBpdHNlbGZcIilcblx0XHRcdFx0XHRleGVjdXRlT25jZSh0aGVuLmJpbmQodmFsdWUpKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGNhbGxBc3luYyhmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGlmICghc2hvdWxkQWJzb3JiICYmIGxpc3QubGVuZ3RoID09PSAwKSBjb25zb2xlLmVycm9yKFwiUG9zc2libGUgdW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uOlwiLCB2YWx1ZSlcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykgbGlzdFtpXSh2YWx1ZSlcblx0XHRcdFx0XHRcdHJlc29sdmVycy5sZW5ndGggPSAwLCByZWplY3RvcnMubGVuZ3RoID0gMFxuXHRcdFx0XHRcdFx0aW5zdGFuY2Uuc3RhdGUgPSBzaG91bGRBYnNvcmJcblx0XHRcdFx0XHRcdGluc3RhbmNlLnJldHJ5ID0gZnVuY3Rpb24oKSB7ZXhlY3V0ZSh2YWx1ZSl9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdFx0cmVqZWN0Q3VycmVudChlKVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBleGVjdXRlT25jZSh0aGVuKSB7XG5cdFx0dmFyIHJ1bnMgPSAwXG5cdFx0ZnVuY3Rpb24gcnVuKGZuKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0aWYgKHJ1bnMrKyA+IDApIHJldHVyblxuXHRcdFx0XHRmbih2YWx1ZSlcblx0XHRcdH1cblx0XHR9XG5cdFx0dmFyIG9uZXJyb3IgPSBydW4ocmVqZWN0Q3VycmVudClcblx0XHR0cnkge3RoZW4ocnVuKHJlc29sdmVDdXJyZW50KSwgb25lcnJvcil9IGNhdGNoIChlKSB7b25lcnJvcihlKX1cblx0fVxuXHRleGVjdXRlT25jZShleGVjdXRvcilcbn1cblByb21pc2VQb2x5ZmlsbC5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKG9uRnVsZmlsbGVkLCBvblJlamVjdGlvbikge1xuXHR2YXIgc2VsZiA9IHRoaXMsIGluc3RhbmNlID0gc2VsZi5faW5zdGFuY2Vcblx0ZnVuY3Rpb24gaGFuZGxlKGNhbGxiYWNrLCBsaXN0LCBuZXh0LCBzdGF0ZSkge1xuXHRcdGxpc3QucHVzaChmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSBuZXh0KHZhbHVlKVxuXHRcdFx0ZWxzZSB0cnkge3Jlc29sdmVOZXh0KGNhbGxiYWNrKHZhbHVlKSl9IGNhdGNoIChlKSB7aWYgKHJlamVjdE5leHQpIHJlamVjdE5leHQoZSl9XG5cdFx0fSlcblx0XHRpZiAodHlwZW9mIGluc3RhbmNlLnJldHJ5ID09PSBcImZ1bmN0aW9uXCIgJiYgc3RhdGUgPT09IGluc3RhbmNlLnN0YXRlKSBpbnN0YW5jZS5yZXRyeSgpXG5cdH1cblx0dmFyIHJlc29sdmVOZXh0LCByZWplY3ROZXh0XG5cdHZhciBwcm9taXNlID0gbmV3IFByb21pc2VQb2x5ZmlsbChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtyZXNvbHZlTmV4dCA9IHJlc29sdmUsIHJlamVjdE5leHQgPSByZWplY3R9KVxuXHRoYW5kbGUob25GdWxmaWxsZWQsIGluc3RhbmNlLnJlc29sdmVycywgcmVzb2x2ZU5leHQsIHRydWUpLCBoYW5kbGUob25SZWplY3Rpb24sIGluc3RhbmNlLnJlamVjdG9ycywgcmVqZWN0TmV4dCwgZmFsc2UpXG5cdHJldHVybiBwcm9taXNlXG59XG5Qcm9taXNlUG9seWZpbGwucHJvdG90eXBlLmNhdGNoID0gZnVuY3Rpb24ob25SZWplY3Rpb24pIHtcblx0cmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGlvbilcbn1cblByb21pc2VQb2x5ZmlsbC5yZXNvbHZlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZVBvbHlmaWxsKSByZXR1cm4gdmFsdWVcblx0cmV0dXJuIG5ldyBQcm9taXNlUG9seWZpbGwoZnVuY3Rpb24ocmVzb2x2ZSkge3Jlc29sdmUodmFsdWUpfSlcbn1cblByb21pc2VQb2x5ZmlsbC5yZWplY3QgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2VQb2x5ZmlsbChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtyZWplY3QodmFsdWUpfSlcbn1cblByb21pc2VQb2x5ZmlsbC5hbGwgPSBmdW5jdGlvbihsaXN0KSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdHZhciB0b3RhbCA9IGxpc3QubGVuZ3RoLCBjb3VudCA9IDAsIHZhbHVlcyA9IFtdXG5cdFx0aWYgKGxpc3QubGVuZ3RoID09PSAwKSByZXNvbHZlKFtdKVxuXHRcdGVsc2UgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHQoZnVuY3Rpb24oaSkge1xuXHRcdFx0XHRmdW5jdGlvbiBjb25zdW1lKHZhbHVlKSB7XG5cdFx0XHRcdFx0Y291bnQrK1xuXHRcdFx0XHRcdHZhbHVlc1tpXSA9IHZhbHVlXG5cdFx0XHRcdFx0aWYgKGNvdW50ID09PSB0b3RhbCkgcmVzb2x2ZSh2YWx1ZXMpXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGxpc3RbaV0gIT0gbnVsbCAmJiAodHlwZW9mIGxpc3RbaV0gPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGxpc3RbaV0gPT09IFwiZnVuY3Rpb25cIikgJiYgdHlwZW9mIGxpc3RbaV0udGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0bGlzdFtpXS50aGVuKGNvbnN1bWUsIHJlamVjdClcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGNvbnN1bWUobGlzdFtpXSlcblx0XHRcdH0pKGkpXG5cdFx0fVxuXHR9KVxufVxuUHJvbWlzZVBvbHlmaWxsLnJhY2UgPSBmdW5jdGlvbihsaXN0KSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGlzdFtpXS50aGVuKHJlc29sdmUsIHJlamVjdClcblx0XHR9XG5cdH0pXG59XG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRpZiAodHlwZW9mIHdpbmRvdy5Qcm9taXNlID09PSBcInVuZGVmaW5lZFwiKSB3aW5kb3cuUHJvbWlzZSA9IFByb21pc2VQb2x5ZmlsbFxuXHR2YXIgUHJvbWlzZVBvbHlmaWxsID0gd2luZG93LlByb21pc2Vcbn0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRpZiAodHlwZW9mIGdsb2JhbC5Qcm9taXNlID09PSBcInVuZGVmaW5lZFwiKSBnbG9iYWwuUHJvbWlzZSA9IFByb21pc2VQb2x5ZmlsbFxuXHR2YXIgUHJvbWlzZVBvbHlmaWxsID0gZ2xvYmFsLlByb21pc2Vcbn0gZWxzZSB7XG59XG52YXIgYnVpbGRRdWVyeVN0cmluZyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXHRpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgIT09IFwiW29iamVjdCBPYmplY3RdXCIpIHJldHVybiBcIlwiXG5cdHZhciBhcmdzID0gW11cblx0Zm9yICh2YXIga2V5MCBpbiBvYmplY3QpIHtcblx0XHRkZXN0cnVjdHVyZShrZXkwLCBvYmplY3Rba2V5MF0pXG5cdH1cblx0cmV0dXJuIGFyZ3Muam9pbihcIiZcIilcblx0ZnVuY3Rpb24gZGVzdHJ1Y3R1cmUoa2V5MCwgdmFsdWUpIHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0ZGVzdHJ1Y3R1cmUoa2V5MCArIFwiW1wiICsgaSArIFwiXVwiLCB2YWx1ZVtpXSlcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIikge1xuXHRcdFx0Zm9yICh2YXIgaSBpbiB2YWx1ZSkge1xuXHRcdFx0XHRkZXN0cnVjdHVyZShrZXkwICsgXCJbXCIgKyBpICsgXCJdXCIsIHZhbHVlW2ldKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGFyZ3MucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5MCkgKyAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSAhPT0gXCJcIiA/IFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSA6IFwiXCIpKVxuXHR9XG59XG52YXIgRklMRV9QUk9UT0NPTF9SRUdFWCA9IG5ldyBSZWdFeHAoXCJeZmlsZTovL1wiLCBcImlcIilcbnZhciBfOCA9IGZ1bmN0aW9uKCR3aW5kb3csIFByb21pc2UpIHtcblx0dmFyIGNhbGxiYWNrQ291bnQgPSAwXG5cdHZhciBvbmNvbXBsZXRpb25cblx0ZnVuY3Rpb24gc2V0Q29tcGxldGlvbkNhbGxiYWNrKGNhbGxiYWNrKSB7b25jb21wbGV0aW9uID0gY2FsbGJhY2t9XG5cdGZ1bmN0aW9uIGZpbmFsaXplcigpIHtcblx0XHR2YXIgY291bnQgPSAwXG5cdFx0ZnVuY3Rpb24gY29tcGxldGUoKSB7aWYgKC0tY291bnQgPT09IDAgJiYgdHlwZW9mIG9uY29tcGxldGlvbiA9PT0gXCJmdW5jdGlvblwiKSBvbmNvbXBsZXRpb24oKX1cblx0XHRyZXR1cm4gZnVuY3Rpb24gZmluYWxpemUocHJvbWlzZTApIHtcblx0XHRcdHZhciB0aGVuMCA9IHByb21pc2UwLnRoZW5cblx0XHRcdHByb21pc2UwLnRoZW4gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y291bnQrK1xuXHRcdFx0XHR2YXIgbmV4dCA9IHRoZW4wLmFwcGx5KHByb21pc2UwLCBhcmd1bWVudHMpXG5cdFx0XHRcdG5leHQudGhlbihjb21wbGV0ZSwgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGNvbXBsZXRlKClcblx0XHRcdFx0XHRpZiAoY291bnQgPT09IDApIHRocm93IGVcblx0XHRcdFx0fSlcblx0XHRcdFx0cmV0dXJuIGZpbmFsaXplKG5leHQpXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcHJvbWlzZTBcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gbm9ybWFsaXplKGFyZ3MsIGV4dHJhKSB7XG5cdFx0aWYgKHR5cGVvZiBhcmdzID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHR2YXIgdXJsID0gYXJnc1xuXHRcdFx0YXJncyA9IGV4dHJhIHx8IHt9XG5cdFx0XHRpZiAoYXJncy51cmwgPT0gbnVsbCkgYXJncy51cmwgPSB1cmxcblx0XHR9XG5cdFx0cmV0dXJuIGFyZ3Ncblx0fVxuXHRmdW5jdGlvbiByZXF1ZXN0KGFyZ3MsIGV4dHJhKSB7XG5cdFx0dmFyIGZpbmFsaXplID0gZmluYWxpemVyKClcblx0XHRhcmdzID0gbm9ybWFsaXplKGFyZ3MsIGV4dHJhKVxuXHRcdHZhciBwcm9taXNlMCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0aWYgKGFyZ3MubWV0aG9kID09IG51bGwpIGFyZ3MubWV0aG9kID0gXCJHRVRcIlxuXHRcdFx0YXJncy5tZXRob2QgPSBhcmdzLm1ldGhvZC50b1VwcGVyQ2FzZSgpXG5cdFx0XHR2YXIgdXNlQm9keSA9IChhcmdzLm1ldGhvZCA9PT0gXCJHRVRcIiB8fCBhcmdzLm1ldGhvZCA9PT0gXCJUUkFDRVwiKSA/IGZhbHNlIDogKHR5cGVvZiBhcmdzLnVzZUJvZHkgPT09IFwiYm9vbGVhblwiID8gYXJncy51c2VCb2R5IDogdHJ1ZSlcblx0XHRcdGlmICh0eXBlb2YgYXJncy5zZXJpYWxpemUgIT09IFwiZnVuY3Rpb25cIikgYXJncy5zZXJpYWxpemUgPSB0eXBlb2YgRm9ybURhdGEgIT09IFwidW5kZWZpbmVkXCIgJiYgYXJncy5kYXRhIGluc3RhbmNlb2YgRm9ybURhdGEgPyBmdW5jdGlvbih2YWx1ZSkge3JldHVybiB2YWx1ZX0gOiBKU09OLnN0cmluZ2lmeVxuXHRcdFx0aWYgKHR5cGVvZiBhcmdzLmRlc2VyaWFsaXplICE9PSBcImZ1bmN0aW9uXCIpIGFyZ3MuZGVzZXJpYWxpemUgPSBkZXNlcmlhbGl6ZVxuXHRcdFx0aWYgKHR5cGVvZiBhcmdzLmV4dHJhY3QgIT09IFwiZnVuY3Rpb25cIikgYXJncy5leHRyYWN0ID0gZXh0cmFjdFxuXHRcdFx0YXJncy51cmwgPSBpbnRlcnBvbGF0ZShhcmdzLnVybCwgYXJncy5kYXRhKVxuXHRcdFx0aWYgKHVzZUJvZHkpIGFyZ3MuZGF0YSA9IGFyZ3Muc2VyaWFsaXplKGFyZ3MuZGF0YSlcblx0XHRcdGVsc2UgYXJncy51cmwgPSBhc3NlbWJsZShhcmdzLnVybCwgYXJncy5kYXRhKVxuXHRcdFx0dmFyIHhociA9IG5ldyAkd2luZG93LlhNTEh0dHBSZXF1ZXN0KCksXG5cdFx0XHRcdGFib3J0ZWQgPSBmYWxzZSxcblx0XHRcdFx0X2Fib3J0ID0geGhyLmFib3J0XG5cdFx0XHR4aHIuYWJvcnQgPSBmdW5jdGlvbiBhYm9ydCgpIHtcblx0XHRcdFx0YWJvcnRlZCA9IHRydWVcblx0XHRcdFx0X2Fib3J0LmNhbGwoeGhyKVxuXHRcdFx0fVxuXHRcdFx0eGhyLm9wZW4oYXJncy5tZXRob2QsIGFyZ3MudXJsLCB0eXBlb2YgYXJncy5hc3luYyA9PT0gXCJib29sZWFuXCIgPyBhcmdzLmFzeW5jIDogdHJ1ZSwgdHlwZW9mIGFyZ3MudXNlciA9PT0gXCJzdHJpbmdcIiA/IGFyZ3MudXNlciA6IHVuZGVmaW5lZCwgdHlwZW9mIGFyZ3MucGFzc3dvcmQgPT09IFwic3RyaW5nXCIgPyBhcmdzLnBhc3N3b3JkIDogdW5kZWZpbmVkKVxuXHRcdFx0aWYgKGFyZ3Muc2VyaWFsaXplID09PSBKU09OLnN0cmluZ2lmeSAmJiB1c2VCb2R5KSB7XG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKVxuXHRcdFx0fVxuXHRcdFx0aWYgKGFyZ3MuZGVzZXJpYWxpemUgPT09IGRlc2VyaWFsaXplKSB7XG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvbiwgdGV4dC8qXCIpXG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJncy53aXRoQ3JlZGVudGlhbHMpIHhoci53aXRoQ3JlZGVudGlhbHMgPSBhcmdzLndpdGhDcmVkZW50aWFsc1xuXHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZ3MuaGVhZGVycykgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoYXJncy5oZWFkZXJzLCBrZXkpKSB7XG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgYXJncy5oZWFkZXJzW2tleV0pXG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIGFyZ3MuY29uZmlnID09PSBcImZ1bmN0aW9uXCIpIHhociA9IGFyZ3MuY29uZmlnKHhociwgYXJncykgfHwgeGhyXG5cdFx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIERvbid0IHRocm93IGVycm9ycyBvbiB4aHIuYWJvcnQoKS5cblx0XHRcdFx0aWYoYWJvcnRlZCkgcmV0dXJuXG5cdFx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHR2YXIgcmVzcG9uc2UgPSAoYXJncy5leHRyYWN0ICE9PSBleHRyYWN0KSA/IGFyZ3MuZXh0cmFjdCh4aHIsIGFyZ3MpIDogYXJncy5kZXNlcmlhbGl6ZShhcmdzLmV4dHJhY3QoeGhyLCBhcmdzKSlcblx0XHRcdFx0XHRcdGlmICgoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkgfHwgeGhyLnN0YXR1cyA9PT0gMzA0IHx8IEZJTEVfUFJPVE9DT0xfUkVHRVgudGVzdChhcmdzLnVybCkpIHtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShjYXN0KGFyZ3MudHlwZSwgcmVzcG9uc2UpKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IG5ldyBFcnJvcih4aHIucmVzcG9uc2VUZXh0KVxuXHRcdFx0XHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gcmVzcG9uc2UpIGVycm9yW2tleV0gPSByZXNwb25zZVtrZXldXG5cdFx0XHRcdFx0XHRcdHJlamVjdChlcnJvcilcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdHJlamVjdChlKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHVzZUJvZHkgJiYgKGFyZ3MuZGF0YSAhPSBudWxsKSkgeGhyLnNlbmQoYXJncy5kYXRhKVxuXHRcdFx0ZWxzZSB4aHIuc2VuZCgpXG5cdFx0fSlcblx0XHRyZXR1cm4gYXJncy5iYWNrZ3JvdW5kID09PSB0cnVlID8gcHJvbWlzZTAgOiBmaW5hbGl6ZShwcm9taXNlMClcblx0fVxuXHRmdW5jdGlvbiBqc29ucChhcmdzLCBleHRyYSkge1xuXHRcdHZhciBmaW5hbGl6ZSA9IGZpbmFsaXplcigpXG5cdFx0YXJncyA9IG5vcm1hbGl6ZShhcmdzLCBleHRyYSlcblx0XHR2YXIgcHJvbWlzZTAgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdHZhciBjYWxsYmFja05hbWUgPSBhcmdzLmNhbGxiYWNrTmFtZSB8fCBcIl9taXRocmlsX1wiICsgTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMWUxNikgKyBcIl9cIiArIGNhbGxiYWNrQ291bnQrK1xuXHRcdFx0dmFyIHNjcmlwdCA9ICR3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKVxuXHRcdFx0JHdpbmRvd1tjYWxsYmFja05hbWVdID0gZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpXG5cdFx0XHRcdHJlc29sdmUoY2FzdChhcmdzLnR5cGUsIGRhdGEpKVxuXHRcdFx0XHRkZWxldGUgJHdpbmRvd1tjYWxsYmFja05hbWVdXG5cdFx0XHR9XG5cdFx0XHRzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpXG5cdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJKU09OUCByZXF1ZXN0IGZhaWxlZFwiKSlcblx0XHRcdFx0ZGVsZXRlICR3aW5kb3dbY2FsbGJhY2tOYW1lXVxuXHRcdFx0fVxuXHRcdFx0aWYgKGFyZ3MuZGF0YSA9PSBudWxsKSBhcmdzLmRhdGEgPSB7fVxuXHRcdFx0YXJncy51cmwgPSBpbnRlcnBvbGF0ZShhcmdzLnVybCwgYXJncy5kYXRhKVxuXHRcdFx0YXJncy5kYXRhW2FyZ3MuY2FsbGJhY2tLZXkgfHwgXCJjYWxsYmFja1wiXSA9IGNhbGxiYWNrTmFtZVxuXHRcdFx0c2NyaXB0LnNyYyA9IGFzc2VtYmxlKGFyZ3MudXJsLCBhcmdzLmRhdGEpXG5cdFx0XHQkd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChzY3JpcHQpXG5cdFx0fSlcblx0XHRyZXR1cm4gYXJncy5iYWNrZ3JvdW5kID09PSB0cnVlPyBwcm9taXNlMCA6IGZpbmFsaXplKHByb21pc2UwKVxuXHR9XG5cdGZ1bmN0aW9uIGludGVycG9sYXRlKHVybCwgZGF0YSkge1xuXHRcdGlmIChkYXRhID09IG51bGwpIHJldHVybiB1cmxcblx0XHR2YXIgdG9rZW5zID0gdXJsLm1hdGNoKC86W15cXC9dKy9naSkgfHwgW11cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGtleSA9IHRva2Vuc1tpXS5zbGljZSgxKVxuXHRcdFx0aWYgKGRhdGFba2V5XSAhPSBudWxsKSB7XG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKHRva2Vuc1tpXSwgZGF0YVtrZXldKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdXJsXG5cdH1cblx0ZnVuY3Rpb24gYXNzZW1ibGUodXJsLCBkYXRhKSB7XG5cdFx0dmFyIHF1ZXJ5c3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZyhkYXRhKVxuXHRcdGlmIChxdWVyeXN0cmluZyAhPT0gXCJcIikge1xuXHRcdFx0dmFyIHByZWZpeCA9IHVybC5pbmRleE9mKFwiP1wiKSA8IDAgPyBcIj9cIiA6IFwiJlwiXG5cdFx0XHR1cmwgKz0gcHJlZml4ICsgcXVlcnlzdHJpbmdcblx0XHR9XG5cdFx0cmV0dXJuIHVybFxuXHR9XG5cdGZ1bmN0aW9uIGRlc2VyaWFsaXplKGRhdGEpIHtcblx0XHR0cnkge3JldHVybiBkYXRhICE9PSBcIlwiID8gSlNPTi5wYXJzZShkYXRhKSA6IG51bGx9XG5cdFx0Y2F0Y2ggKGUpIHt0aHJvdyBuZXcgRXJyb3IoZGF0YSl9XG5cdH1cblx0ZnVuY3Rpb24gZXh0cmFjdCh4aHIpIHtyZXR1cm4geGhyLnJlc3BvbnNlVGV4dH1cblx0ZnVuY3Rpb24gY2FzdCh0eXBlMCwgZGF0YSkge1xuXHRcdGlmICh0eXBlb2YgdHlwZTAgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0ZGF0YVtpXSA9IG5ldyB0eXBlMChkYXRhW2ldKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHJldHVybiBuZXcgdHlwZTAoZGF0YSlcblx0XHR9XG5cdFx0cmV0dXJuIGRhdGFcblx0fVxuXHRyZXR1cm4ge3JlcXVlc3Q6IHJlcXVlc3QsIGpzb25wOiBqc29ucCwgc2V0Q29tcGxldGlvbkNhbGxiYWNrOiBzZXRDb21wbGV0aW9uQ2FsbGJhY2t9XG59XG52YXIgcmVxdWVzdFNlcnZpY2UgPSBfOCh3aW5kb3csIFByb21pc2VQb2x5ZmlsbClcbnZhciBjb3JlUmVuZGVyZXIgPSBmdW5jdGlvbigkd2luZG93KSB7XG5cdHZhciAkZG9jID0gJHdpbmRvdy5kb2N1bWVudFxuXHR2YXIgJGVtcHR5RnJhZ21lbnQgPSAkZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHR2YXIgb25ldmVudFxuXHRmdW5jdGlvbiBzZXRFdmVudENhbGxiYWNrKGNhbGxiYWNrKSB7cmV0dXJuIG9uZXZlbnQgPSBjYWxsYmFja31cblx0Ly9jcmVhdGVcblx0ZnVuY3Rpb24gY3JlYXRlTm9kZXMocGFyZW50LCB2bm9kZXMsIHN0YXJ0LCBlbmQsIGhvb2tzLCBuZXh0U2libGluZywgbnMpIHtcblx0XHRmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuXHRcdFx0dmFyIHZub2RlID0gdm5vZGVzW2ldXG5cdFx0XHRpZiAodm5vZGUgIT0gbnVsbCkge1xuXHRcdFx0XHRjcmVhdGVOb2RlKHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZykge1xuXHRcdHZhciB0YWcgPSB2bm9kZS50YWdcblx0XHRpZiAodHlwZW9mIHRhZyA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0dm5vZGUuc3RhdGUgPSB7fVxuXHRcdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIGluaXRMaWZlY3ljbGUodm5vZGUuYXR0cnMsIHZub2RlLCBob29rcylcblx0XHRcdHN3aXRjaCAodGFnKSB7XG5cdFx0XHRcdGNhc2UgXCIjXCI6IHJldHVybiBjcmVhdGVUZXh0KHBhcmVudCwgdm5vZGUsIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRjYXNlIFwiPFwiOiByZXR1cm4gY3JlYXRlSFRNTChwYXJlbnQsIHZub2RlLCBuZXh0U2libGluZylcblx0XHRcdFx0Y2FzZSBcIltcIjogcmV0dXJuIGNyZWF0ZUZyYWdtZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdGRlZmF1bHQ6IHJldHVybiBjcmVhdGVFbGVtZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgcmV0dXJuIGNyZWF0ZUNvbXBvbmVudChwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZVRleHQocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpIHtcblx0XHR2bm9kZS5kb20gPSAkZG9jLmNyZWF0ZVRleHROb2RlKHZub2RlLmNoaWxkcmVuKVxuXHRcdGluc2VydE5vZGUocGFyZW50LCB2bm9kZS5kb20sIG5leHRTaWJsaW5nKVxuXHRcdHJldHVybiB2bm9kZS5kb21cblx0fVxuXHRmdW5jdGlvbiBjcmVhdGVIVE1MKHBhcmVudCwgdm5vZGUsIG5leHRTaWJsaW5nKSB7XG5cdFx0dmFyIG1hdGNoMSA9IHZub2RlLmNoaWxkcmVuLm1hdGNoKC9eXFxzKj88KFxcdyspL2ltKSB8fCBbXVxuXHRcdHZhciBwYXJlbnQxID0ge2NhcHRpb246IFwidGFibGVcIiwgdGhlYWQ6IFwidGFibGVcIiwgdGJvZHk6IFwidGFibGVcIiwgdGZvb3Q6IFwidGFibGVcIiwgdHI6IFwidGJvZHlcIiwgdGg6IFwidHJcIiwgdGQ6IFwidHJcIiwgY29sZ3JvdXA6IFwidGFibGVcIiwgY29sOiBcImNvbGdyb3VwXCJ9W21hdGNoMVsxXV0gfHwgXCJkaXZcIlxuXHRcdHZhciB0ZW1wID0gJGRvYy5jcmVhdGVFbGVtZW50KHBhcmVudDEpXG5cdFx0dGVtcC5pbm5lckhUTUwgPSB2bm9kZS5jaGlsZHJlblxuXHRcdHZub2RlLmRvbSA9IHRlbXAuZmlyc3RDaGlsZFxuXHRcdHZub2RlLmRvbVNpemUgPSB0ZW1wLmNoaWxkTm9kZXMubGVuZ3RoXG5cdFx0dmFyIGZyYWdtZW50ID0gJGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblx0XHR2YXIgY2hpbGRcblx0XHR3aGlsZSAoY2hpbGQgPSB0ZW1wLmZpcnN0Q2hpbGQpIHtcblx0XHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKGNoaWxkKVxuXHRcdH1cblx0XHRpbnNlcnROb2RlKHBhcmVudCwgZnJhZ21lbnQsIG5leHRTaWJsaW5nKVxuXHRcdHJldHVybiBmcmFnbWVudFxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZUZyYWdtZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpIHtcblx0XHR2YXIgZnJhZ21lbnQgPSAkZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdGlmICh2bm9kZS5jaGlsZHJlbiAhPSBudWxsKSB7XG5cdFx0XHR2YXIgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlblxuXHRcdFx0Y3JlYXRlTm9kZXMoZnJhZ21lbnQsIGNoaWxkcmVuLCAwLCBjaGlsZHJlbi5sZW5ndGgsIGhvb2tzLCBudWxsLCBucylcblx0XHR9XG5cdFx0dm5vZGUuZG9tID0gZnJhZ21lbnQuZmlyc3RDaGlsZFxuXHRcdHZub2RlLmRvbVNpemUgPSBmcmFnbWVudC5jaGlsZE5vZGVzLmxlbmd0aFxuXHRcdGluc2VydE5vZGUocGFyZW50LCBmcmFnbWVudCwgbmV4dFNpYmxpbmcpXG5cdFx0cmV0dXJuIGZyYWdtZW50XG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlRWxlbWVudChwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKSB7XG5cdFx0dmFyIHRhZyA9IHZub2RlLnRhZ1xuXHRcdHN3aXRjaCAodm5vZGUudGFnKSB7XG5cdFx0XHRjYXNlIFwic3ZnXCI6IG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiOyBicmVha1xuXHRcdFx0Y2FzZSBcIm1hdGhcIjogbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTgvTWF0aC9NYXRoTUxcIjsgYnJlYWtcblx0XHR9XG5cdFx0dmFyIGF0dHJzMiA9IHZub2RlLmF0dHJzXG5cdFx0dmFyIGlzID0gYXR0cnMyICYmIGF0dHJzMi5pc1xuXHRcdHZhciBlbGVtZW50ID0gbnMgP1xuXHRcdFx0aXMgPyAkZG9jLmNyZWF0ZUVsZW1lbnROUyhucywgdGFnLCB7aXM6IGlzfSkgOiAkZG9jLmNyZWF0ZUVsZW1lbnROUyhucywgdGFnKSA6XG5cdFx0XHRpcyA/ICRkb2MuY3JlYXRlRWxlbWVudCh0YWcsIHtpczogaXN9KSA6ICRkb2MuY3JlYXRlRWxlbWVudCh0YWcpXG5cdFx0dm5vZGUuZG9tID0gZWxlbWVudFxuXHRcdGlmIChhdHRyczIgIT0gbnVsbCkge1xuXHRcdFx0c2V0QXR0cnModm5vZGUsIGF0dHJzMiwgbnMpXG5cdFx0fVxuXHRcdGluc2VydE5vZGUocGFyZW50LCBlbGVtZW50LCBuZXh0U2libGluZylcblx0XHRpZiAodm5vZGUuYXR0cnMgIT0gbnVsbCAmJiB2bm9kZS5hdHRycy5jb250ZW50ZWRpdGFibGUgIT0gbnVsbCkge1xuXHRcdFx0c2V0Q29udGVudEVkaXRhYmxlKHZub2RlKVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmICh2bm9kZS50ZXh0ICE9IG51bGwpIHtcblx0XHRcdFx0aWYgKHZub2RlLnRleHQgIT09IFwiXCIpIGVsZW1lbnQudGV4dENvbnRlbnQgPSB2bm9kZS50ZXh0XG5cdFx0XHRcdGVsc2Ugdm5vZGUuY2hpbGRyZW4gPSBbVm5vZGUoXCIjXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB2bm9kZS50ZXh0LCB1bmRlZmluZWQsIHVuZGVmaW5lZCldXG5cdFx0XHR9XG5cdFx0XHRpZiAodm5vZGUuY2hpbGRyZW4gIT0gbnVsbCkge1xuXHRcdFx0XHR2YXIgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlblxuXHRcdFx0XHRjcmVhdGVOb2RlcyhlbGVtZW50LCBjaGlsZHJlbiwgMCwgY2hpbGRyZW4ubGVuZ3RoLCBob29rcywgbnVsbCwgbnMpXG5cdFx0XHRcdHNldExhdGVBdHRycyh2bm9kZSlcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGVsZW1lbnRcblx0fVxuXHRmdW5jdGlvbiBpbml0Q29tcG9uZW50KHZub2RlLCBob29rcykge1xuXHRcdHZhciBzZW50aW5lbFxuXHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnLnZpZXcgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dm5vZGUuc3RhdGUgPSBPYmplY3QuY3JlYXRlKHZub2RlLnRhZylcblx0XHRcdHNlbnRpbmVsID0gdm5vZGUuc3RhdGUudmlld1xuXHRcdFx0aWYgKHNlbnRpbmVsLiQkcmVlbnRyYW50TG9jayQkICE9IG51bGwpIHJldHVybiAkZW1wdHlGcmFnbWVudFxuXHRcdFx0c2VudGluZWwuJCRyZWVudHJhbnRMb2NrJCQgPSB0cnVlXG5cdFx0fSBlbHNlIHtcblx0XHRcdHZub2RlLnN0YXRlID0gdm9pZCAwXG5cdFx0XHRzZW50aW5lbCA9IHZub2RlLnRhZ1xuXHRcdFx0aWYgKHNlbnRpbmVsLiQkcmVlbnRyYW50TG9jayQkICE9IG51bGwpIHJldHVybiAkZW1wdHlGcmFnbWVudFxuXHRcdFx0c2VudGluZWwuJCRyZWVudHJhbnRMb2NrJCQgPSB0cnVlXG5cdFx0XHR2bm9kZS5zdGF0ZSA9ICh2bm9kZS50YWcucHJvdG90eXBlICE9IG51bGwgJiYgdHlwZW9mIHZub2RlLnRhZy5wcm90b3R5cGUudmlldyA9PT0gXCJmdW5jdGlvblwiKSA/IG5ldyB2bm9kZS50YWcodm5vZGUpIDogdm5vZGUudGFnKHZub2RlKVxuXHRcdH1cblx0XHR2bm9kZS5fc3RhdGUgPSB2bm9kZS5zdGF0ZVxuXHRcdGlmICh2bm9kZS5hdHRycyAhPSBudWxsKSBpbml0TGlmZWN5Y2xlKHZub2RlLmF0dHJzLCB2bm9kZSwgaG9va3MpXG5cdFx0aW5pdExpZmVjeWNsZSh2bm9kZS5fc3RhdGUsIHZub2RlLCBob29rcylcblx0XHR2bm9kZS5pbnN0YW5jZSA9IFZub2RlLm5vcm1hbGl6ZSh2bm9kZS5fc3RhdGUudmlldy5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSkpXG5cdFx0aWYgKHZub2RlLmluc3RhbmNlID09PSB2bm9kZSkgdGhyb3cgRXJyb3IoXCJBIHZpZXcgY2Fubm90IHJldHVybiB0aGUgdm5vZGUgaXQgcmVjZWl2ZWQgYXMgYXJndW1lbnRcIilcblx0XHRzZW50aW5lbC4kJHJlZW50cmFudExvY2skJCA9IG51bGxcblx0fVxuXHRmdW5jdGlvbiBjcmVhdGVDb21wb25lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZykge1xuXHRcdGluaXRDb21wb25lbnQodm5vZGUsIGhvb2tzKVxuXHRcdGlmICh2bm9kZS5pbnN0YW5jZSAhPSBudWxsKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZS5pbnN0YW5jZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdHZub2RlLmRvbSA9IHZub2RlLmluc3RhbmNlLmRvbVxuXHRcdFx0dm5vZGUuZG9tU2l6ZSA9IHZub2RlLmRvbSAhPSBudWxsID8gdm5vZGUuaW5zdGFuY2UuZG9tU2l6ZSA6IDBcblx0XHRcdGluc2VydE5vZGUocGFyZW50LCBlbGVtZW50LCBuZXh0U2libGluZylcblx0XHRcdHJldHVybiBlbGVtZW50XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dm5vZGUuZG9tU2l6ZSA9IDBcblx0XHRcdHJldHVybiAkZW1wdHlGcmFnbWVudFxuXHRcdH1cblx0fVxuXHQvL3VwZGF0ZVxuXHRmdW5jdGlvbiB1cGRhdGVOb2RlcyhwYXJlbnQsIG9sZCwgdm5vZGVzLCByZWN5Y2xpbmcsIGhvb2tzLCBuZXh0U2libGluZywgbnMpIHtcblx0XHRpZiAob2xkID09PSB2bm9kZXMgfHwgb2xkID09IG51bGwgJiYgdm5vZGVzID09IG51bGwpIHJldHVyblxuXHRcdGVsc2UgaWYgKG9sZCA9PSBudWxsKSBjcmVhdGVOb2RlcyhwYXJlbnQsIHZub2RlcywgMCwgdm5vZGVzLmxlbmd0aCwgaG9va3MsIG5leHRTaWJsaW5nLCB1bmRlZmluZWQpXG5cdFx0ZWxzZSBpZiAodm5vZGVzID09IG51bGwpIHJlbW92ZU5vZGVzKG9sZCwgMCwgb2xkLmxlbmd0aCwgdm5vZGVzKVxuXHRcdGVsc2Uge1xuXHRcdFx0aWYgKG9sZC5sZW5ndGggPT09IHZub2Rlcy5sZW5ndGgpIHtcblx0XHRcdFx0dmFyIGlzVW5rZXllZCA9IGZhbHNlXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdm5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKHZub2Rlc1tpXSAhPSBudWxsICYmIG9sZFtpXSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRpc1Vua2V5ZWQgPSB2bm9kZXNbaV0ua2V5ID09IG51bGwgJiYgb2xkW2ldLmtleSA9PSBudWxsXG5cdFx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaXNVbmtleWVkKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBvbGQubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmIChvbGRbaV0gPT09IHZub2Rlc1tpXSkgY29udGludWVcblx0XHRcdFx0XHRcdGVsc2UgaWYgKG9sZFtpXSA9PSBudWxsICYmIHZub2Rlc1tpXSAhPSBudWxsKSBjcmVhdGVOb2RlKHBhcmVudCwgdm5vZGVzW2ldLCBob29rcywgbnMsIGdldE5leHRTaWJsaW5nKG9sZCwgaSArIDEsIG5leHRTaWJsaW5nKSlcblx0XHRcdFx0XHRcdGVsc2UgaWYgKHZub2Rlc1tpXSA9PSBudWxsKSByZW1vdmVOb2RlcyhvbGQsIGksIGkgKyAxLCB2bm9kZXMpXG5cdFx0XHRcdFx0XHRlbHNlIHVwZGF0ZU5vZGUocGFyZW50LCBvbGRbaV0sIHZub2Rlc1tpXSwgaG9va3MsIGdldE5leHRTaWJsaW5nKG9sZCwgaSArIDEsIG5leHRTaWJsaW5nKSwgcmVjeWNsaW5nLCBucylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJlY3ljbGluZyA9IHJlY3ljbGluZyB8fCBpc1JlY3ljbGFibGUob2xkLCB2bm9kZXMpXG5cdFx0XHRpZiAocmVjeWNsaW5nKSB7XG5cdFx0XHRcdHZhciBwb29sID0gb2xkLnBvb2xcblx0XHRcdFx0b2xkID0gb2xkLmNvbmNhdChvbGQucG9vbClcblx0XHRcdH1cblx0XHRcdHZhciBvbGRTdGFydCA9IDAsIHN0YXJ0ID0gMCwgb2xkRW5kID0gb2xkLmxlbmd0aCAtIDEsIGVuZCA9IHZub2Rlcy5sZW5ndGggLSAxLCBtYXBcblx0XHRcdHdoaWxlIChvbGRFbmQgPj0gb2xkU3RhcnQgJiYgZW5kID49IHN0YXJ0KSB7XG5cdFx0XHRcdHZhciBvID0gb2xkW29sZFN0YXJ0XSwgdiA9IHZub2Rlc1tzdGFydF1cblx0XHRcdFx0aWYgKG8gPT09IHYgJiYgIXJlY3ljbGluZykgb2xkU3RhcnQrKywgc3RhcnQrK1xuXHRcdFx0XHRlbHNlIGlmIChvID09IG51bGwpIG9sZFN0YXJ0Kytcblx0XHRcdFx0ZWxzZSBpZiAodiA9PSBudWxsKSBzdGFydCsrXG5cdFx0XHRcdGVsc2UgaWYgKG8ua2V5ID09PSB2LmtleSkge1xuXHRcdFx0XHRcdHZhciBzaG91bGRSZWN5Y2xlID0gKHBvb2wgIT0gbnVsbCAmJiBvbGRTdGFydCA+PSBvbGQubGVuZ3RoIC0gcG9vbC5sZW5ndGgpIHx8ICgocG9vbCA9PSBudWxsKSAmJiByZWN5Y2xpbmcpXG5cdFx0XHRcdFx0b2xkU3RhcnQrKywgc3RhcnQrK1xuXHRcdFx0XHRcdHVwZGF0ZU5vZGUocGFyZW50LCBvLCB2LCBob29rcywgZ2V0TmV4dFNpYmxpbmcob2xkLCBvbGRTdGFydCwgbmV4dFNpYmxpbmcpLCBzaG91bGRSZWN5Y2xlLCBucylcblx0XHRcdFx0XHRpZiAocmVjeWNsaW5nICYmIG8udGFnID09PSB2LnRhZykgaW5zZXJ0Tm9kZShwYXJlbnQsIHRvRnJhZ21lbnQobyksIG5leHRTaWJsaW5nKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHZhciBvID0gb2xkW29sZEVuZF1cblx0XHRcdFx0XHRpZiAobyA9PT0gdiAmJiAhcmVjeWNsaW5nKSBvbGRFbmQtLSwgc3RhcnQrK1xuXHRcdFx0XHRcdGVsc2UgaWYgKG8gPT0gbnVsbCkgb2xkRW5kLS1cblx0XHRcdFx0XHRlbHNlIGlmICh2ID09IG51bGwpIHN0YXJ0Kytcblx0XHRcdFx0XHRlbHNlIGlmIChvLmtleSA9PT0gdi5rZXkpIHtcblx0XHRcdFx0XHRcdHZhciBzaG91bGRSZWN5Y2xlID0gKHBvb2wgIT0gbnVsbCAmJiBvbGRFbmQgPj0gb2xkLmxlbmd0aCAtIHBvb2wubGVuZ3RoKSB8fCAoKHBvb2wgPT0gbnVsbCkgJiYgcmVjeWNsaW5nKVxuXHRcdFx0XHRcdFx0dXBkYXRlTm9kZShwYXJlbnQsIG8sIHYsIGhvb2tzLCBnZXROZXh0U2libGluZyhvbGQsIG9sZEVuZCArIDEsIG5leHRTaWJsaW5nKSwgc2hvdWxkUmVjeWNsZSwgbnMpXG5cdFx0XHRcdFx0XHRpZiAocmVjeWNsaW5nIHx8IHN0YXJ0IDwgZW5kKSBpbnNlcnROb2RlKHBhcmVudCwgdG9GcmFnbWVudChvKSwgZ2V0TmV4dFNpYmxpbmcob2xkLCBvbGRTdGFydCwgbmV4dFNpYmxpbmcpKVxuXHRcdFx0XHRcdFx0b2xkRW5kLS0sIHN0YXJ0Kytcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBicmVha1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR3aGlsZSAob2xkRW5kID49IG9sZFN0YXJ0ICYmIGVuZCA+PSBzdGFydCkge1xuXHRcdFx0XHR2YXIgbyA9IG9sZFtvbGRFbmRdLCB2ID0gdm5vZGVzW2VuZF1cblx0XHRcdFx0aWYgKG8gPT09IHYgJiYgIXJlY3ljbGluZykgb2xkRW5kLS0sIGVuZC0tXG5cdFx0XHRcdGVsc2UgaWYgKG8gPT0gbnVsbCkgb2xkRW5kLS1cblx0XHRcdFx0ZWxzZSBpZiAodiA9PSBudWxsKSBlbmQtLVxuXHRcdFx0XHRlbHNlIGlmIChvLmtleSA9PT0gdi5rZXkpIHtcblx0XHRcdFx0XHR2YXIgc2hvdWxkUmVjeWNsZSA9IChwb29sICE9IG51bGwgJiYgb2xkRW5kID49IG9sZC5sZW5ndGggLSBwb29sLmxlbmd0aCkgfHwgKChwb29sID09IG51bGwpICYmIHJlY3ljbGluZylcblx0XHRcdFx0XHR1cGRhdGVOb2RlKHBhcmVudCwgbywgdiwgaG9va3MsIGdldE5leHRTaWJsaW5nKG9sZCwgb2xkRW5kICsgMSwgbmV4dFNpYmxpbmcpLCBzaG91bGRSZWN5Y2xlLCBucylcblx0XHRcdFx0XHRpZiAocmVjeWNsaW5nICYmIG8udGFnID09PSB2LnRhZykgaW5zZXJ0Tm9kZShwYXJlbnQsIHRvRnJhZ21lbnQobyksIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdGlmIChvLmRvbSAhPSBudWxsKSBuZXh0U2libGluZyA9IG8uZG9tXG5cdFx0XHRcdFx0b2xkRW5kLS0sIGVuZC0tXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCFtYXApIG1hcCA9IGdldEtleU1hcChvbGQsIG9sZEVuZClcblx0XHRcdFx0XHRpZiAodiAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHR2YXIgb2xkSW5kZXggPSBtYXBbdi5rZXldXG5cdFx0XHRcdFx0XHRpZiAob2xkSW5kZXggIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbW92YWJsZSA9IG9sZFtvbGRJbmRleF1cblx0XHRcdFx0XHRcdFx0dmFyIHNob3VsZFJlY3ljbGUgPSAocG9vbCAhPSBudWxsICYmIG9sZEluZGV4ID49IG9sZC5sZW5ndGggLSBwb29sLmxlbmd0aCkgfHwgKChwb29sID09IG51bGwpICYmIHJlY3ljbGluZylcblx0XHRcdFx0XHRcdFx0dXBkYXRlTm9kZShwYXJlbnQsIG1vdmFibGUsIHYsIGhvb2tzLCBnZXROZXh0U2libGluZyhvbGQsIG9sZEVuZCArIDEsIG5leHRTaWJsaW5nKSwgcmVjeWNsaW5nLCBucylcblx0XHRcdFx0XHRcdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIHRvRnJhZ21lbnQobW92YWJsZSksIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdFx0XHRvbGRbb2xkSW5kZXhdLnNraXAgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGlmIChtb3ZhYmxlLmRvbSAhPSBudWxsKSBuZXh0U2libGluZyA9IG1vdmFibGUuZG9tXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0dmFyIGRvbSA9IGNyZWF0ZU5vZGUocGFyZW50LCB2LCBob29rcywgdW5kZWZpbmVkLCBuZXh0U2libGluZylcblx0XHRcdFx0XHRcdFx0bmV4dFNpYmxpbmcgPSBkb21cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZW5kLS1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZW5kIDwgc3RhcnQpIGJyZWFrXG5cdFx0XHR9XG5cdFx0XHRjcmVhdGVOb2RlcyhwYXJlbnQsIHZub2Rlcywgc3RhcnQsIGVuZCArIDEsIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0XHRyZW1vdmVOb2RlcyhvbGQsIG9sZFN0YXJ0LCBvbGRFbmQgKyAxLCB2bm9kZXMpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZU5vZGUocGFyZW50LCBvbGQsIHZub2RlLCBob29rcywgbmV4dFNpYmxpbmcsIHJlY3ljbGluZywgbnMpIHtcblx0XHR2YXIgb2xkVGFnID0gb2xkLnRhZywgdGFnID0gdm5vZGUudGFnXG5cdFx0aWYgKG9sZFRhZyA9PT0gdGFnKSB7XG5cdFx0XHR2bm9kZS5zdGF0ZSA9IG9sZC5zdGF0ZVxuXHRcdFx0dm5vZGUuX3N0YXRlID0gb2xkLl9zdGF0ZVxuXHRcdFx0dm5vZGUuZXZlbnRzID0gb2xkLmV2ZW50c1xuXHRcdFx0aWYgKCFyZWN5Y2xpbmcgJiYgc2hvdWxkTm90VXBkYXRlKHZub2RlLCBvbGQpKSByZXR1cm5cblx0XHRcdGlmICh0eXBlb2Ygb2xkVGFnID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdGlmICh2bm9kZS5hdHRycyAhPSBudWxsKSB7XG5cdFx0XHRcdFx0aWYgKHJlY3ljbGluZykge1xuXHRcdFx0XHRcdFx0dm5vZGUuc3RhdGUgPSB7fVxuXHRcdFx0XHRcdFx0aW5pdExpZmVjeWNsZSh2bm9kZS5hdHRycywgdm5vZGUsIGhvb2tzKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHVwZGF0ZUxpZmVjeWNsZSh2bm9kZS5hdHRycywgdm5vZGUsIGhvb2tzKVxuXHRcdFx0XHR9XG5cdFx0XHRcdHN3aXRjaCAob2xkVGFnKSB7XG5cdFx0XHRcdFx0Y2FzZSBcIiNcIjogdXBkYXRlVGV4dChvbGQsIHZub2RlKTsgYnJlYWtcblx0XHRcdFx0XHRjYXNlIFwiPFwiOiB1cGRhdGVIVE1MKHBhcmVudCwgb2xkLCB2bm9kZSwgbmV4dFNpYmxpbmcpOyBicmVha1xuXHRcdFx0XHRcdGNhc2UgXCJbXCI6IHVwZGF0ZUZyYWdtZW50KHBhcmVudCwgb2xkLCB2bm9kZSwgcmVjeWNsaW5nLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKTsgYnJlYWtcblx0XHRcdFx0XHRkZWZhdWx0OiB1cGRhdGVFbGVtZW50KG9sZCwgdm5vZGUsIHJlY3ljbGluZywgaG9va3MsIG5zKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHVwZGF0ZUNvbXBvbmVudChwYXJlbnQsIG9sZCwgdm5vZGUsIGhvb2tzLCBuZXh0U2libGluZywgcmVjeWNsaW5nLCBucylcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZW1vdmVOb2RlKG9sZCwgbnVsbClcblx0XHRcdGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlVGV4dChvbGQsIHZub2RlKSB7XG5cdFx0aWYgKG9sZC5jaGlsZHJlbi50b1N0cmluZygpICE9PSB2bm9kZS5jaGlsZHJlbi50b1N0cmluZygpKSB7XG5cdFx0XHRvbGQuZG9tLm5vZGVWYWx1ZSA9IHZub2RlLmNoaWxkcmVuXG5cdFx0fVxuXHRcdHZub2RlLmRvbSA9IG9sZC5kb21cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVIVE1MKHBhcmVudCwgb2xkLCB2bm9kZSwgbmV4dFNpYmxpbmcpIHtcblx0XHRpZiAob2xkLmNoaWxkcmVuICE9PSB2bm9kZS5jaGlsZHJlbikge1xuXHRcdFx0dG9GcmFnbWVudChvbGQpXG5cdFx0XHRjcmVhdGVIVE1MKHBhcmVudCwgdm5vZGUsIG5leHRTaWJsaW5nKVxuXHRcdH1cblx0XHRlbHNlIHZub2RlLmRvbSA9IG9sZC5kb20sIHZub2RlLmRvbVNpemUgPSBvbGQuZG9tU2l6ZVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUZyYWdtZW50KHBhcmVudCwgb2xkLCB2bm9kZSwgcmVjeWNsaW5nLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKSB7XG5cdFx0dXBkYXRlTm9kZXMocGFyZW50LCBvbGQuY2hpbGRyZW4sIHZub2RlLmNoaWxkcmVuLCByZWN5Y2xpbmcsIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0dmFyIGRvbVNpemUgPSAwLCBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG5cdFx0dm5vZGUuZG9tID0gbnVsbFxuXHRcdGlmIChjaGlsZHJlbiAhPSBudWxsKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldXG5cdFx0XHRcdGlmIChjaGlsZCAhPSBudWxsICYmIGNoaWxkLmRvbSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0aWYgKHZub2RlLmRvbSA9PSBudWxsKSB2bm9kZS5kb20gPSBjaGlsZC5kb21cblx0XHRcdFx0XHRkb21TaXplICs9IGNoaWxkLmRvbVNpemUgfHwgMVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoZG9tU2l6ZSAhPT0gMSkgdm5vZGUuZG9tU2l6ZSA9IGRvbVNpemVcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlRWxlbWVudChvbGQsIHZub2RlLCByZWN5Y2xpbmcsIGhvb2tzLCBucykge1xuXHRcdHZhciBlbGVtZW50ID0gdm5vZGUuZG9tID0gb2xkLmRvbVxuXHRcdHN3aXRjaCAodm5vZGUudGFnKSB7XG5cdFx0XHRjYXNlIFwic3ZnXCI6IG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiOyBicmVha1xuXHRcdFx0Y2FzZSBcIm1hdGhcIjogbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTgvTWF0aC9NYXRoTUxcIjsgYnJlYWtcblx0XHR9XG5cdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG5cdFx0XHRpZiAodm5vZGUuYXR0cnMgPT0gbnVsbCkgdm5vZGUuYXR0cnMgPSB7fVxuXHRcdFx0aWYgKHZub2RlLnRleHQgIT0gbnVsbCkge1xuXHRcdFx0XHR2bm9kZS5hdHRycy52YWx1ZSA9IHZub2RlLnRleHQgLy9GSVhNRSBoYW5kbGUwIG11bHRpcGxlIGNoaWxkcmVuXG5cdFx0XHRcdHZub2RlLnRleHQgPSB1bmRlZmluZWRcblx0XHRcdH1cblx0XHR9XG5cdFx0dXBkYXRlQXR0cnModm5vZGUsIG9sZC5hdHRycywgdm5vZGUuYXR0cnMsIG5zKVxuXHRcdGlmICh2bm9kZS5hdHRycyAhPSBudWxsICYmIHZub2RlLmF0dHJzLmNvbnRlbnRlZGl0YWJsZSAhPSBudWxsKSB7XG5cdFx0XHRzZXRDb250ZW50RWRpdGFibGUodm5vZGUpXG5cdFx0fVxuXHRcdGVsc2UgaWYgKG9sZC50ZXh0ICE9IG51bGwgJiYgdm5vZGUudGV4dCAhPSBudWxsICYmIHZub2RlLnRleHQgIT09IFwiXCIpIHtcblx0XHRcdGlmIChvbGQudGV4dC50b1N0cmluZygpICE9PSB2bm9kZS50ZXh0LnRvU3RyaW5nKCkpIG9sZC5kb20uZmlyc3RDaGlsZC5ub2RlVmFsdWUgPSB2bm9kZS50ZXh0XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aWYgKG9sZC50ZXh0ICE9IG51bGwpIG9sZC5jaGlsZHJlbiA9IFtWbm9kZShcIiNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIG9sZC50ZXh0LCB1bmRlZmluZWQsIG9sZC5kb20uZmlyc3RDaGlsZCldXG5cdFx0XHRpZiAodm5vZGUudGV4dCAhPSBudWxsKSB2bm9kZS5jaGlsZHJlbiA9IFtWbm9kZShcIiNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHZub2RlLnRleHQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKV1cblx0XHRcdHVwZGF0ZU5vZGVzKGVsZW1lbnQsIG9sZC5jaGlsZHJlbiwgdm5vZGUuY2hpbGRyZW4sIHJlY3ljbGluZywgaG9va3MsIG51bGwsIG5zKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVDb21wb25lbnQocGFyZW50LCBvbGQsIHZub2RlLCBob29rcywgbmV4dFNpYmxpbmcsIHJlY3ljbGluZywgbnMpIHtcblx0XHRpZiAocmVjeWNsaW5nKSB7XG5cdFx0XHRpbml0Q29tcG9uZW50KHZub2RlLCBob29rcylcblx0XHR9IGVsc2Uge1xuXHRcdFx0dm5vZGUuaW5zdGFuY2UgPSBWbm9kZS5ub3JtYWxpemUodm5vZGUuX3N0YXRlLnZpZXcuY2FsbCh2bm9kZS5zdGF0ZSwgdm5vZGUpKVxuXHRcdFx0aWYgKHZub2RlLmluc3RhbmNlID09PSB2bm9kZSkgdGhyb3cgRXJyb3IoXCJBIHZpZXcgY2Fubm90IHJldHVybiB0aGUgdm5vZGUgaXQgcmVjZWl2ZWQgYXMgYXJndW1lbnRcIilcblx0XHRcdGlmICh2bm9kZS5hdHRycyAhPSBudWxsKSB1cGRhdGVMaWZlY3ljbGUodm5vZGUuYXR0cnMsIHZub2RlLCBob29rcylcblx0XHRcdHVwZGF0ZUxpZmVjeWNsZSh2bm9kZS5fc3RhdGUsIHZub2RlLCBob29rcylcblx0XHR9XG5cdFx0aWYgKHZub2RlLmluc3RhbmNlICE9IG51bGwpIHtcblx0XHRcdGlmIChvbGQuaW5zdGFuY2UgPT0gbnVsbCkgY3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLmluc3RhbmNlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdFx0ZWxzZSB1cGRhdGVOb2RlKHBhcmVudCwgb2xkLmluc3RhbmNlLCB2bm9kZS5pbnN0YW5jZSwgaG9va3MsIG5leHRTaWJsaW5nLCByZWN5Y2xpbmcsIG5zKVxuXHRcdFx0dm5vZGUuZG9tID0gdm5vZGUuaW5zdGFuY2UuZG9tXG5cdFx0XHR2bm9kZS5kb21TaXplID0gdm5vZGUuaW5zdGFuY2UuZG9tU2l6ZVxuXHRcdH1cblx0XHRlbHNlIGlmIChvbGQuaW5zdGFuY2UgIT0gbnVsbCkge1xuXHRcdFx0cmVtb3ZlTm9kZShvbGQuaW5zdGFuY2UsIG51bGwpXG5cdFx0XHR2bm9kZS5kb20gPSB1bmRlZmluZWRcblx0XHRcdHZub2RlLmRvbVNpemUgPSAwXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dm5vZGUuZG9tID0gb2xkLmRvbVxuXHRcdFx0dm5vZGUuZG9tU2l6ZSA9IG9sZC5kb21TaXplXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIGlzUmVjeWNsYWJsZShvbGQsIHZub2Rlcykge1xuXHRcdGlmIChvbGQucG9vbCAhPSBudWxsICYmIE1hdGguYWJzKG9sZC5wb29sLmxlbmd0aCAtIHZub2Rlcy5sZW5ndGgpIDw9IE1hdGguYWJzKG9sZC5sZW5ndGggLSB2bm9kZXMubGVuZ3RoKSkge1xuXHRcdFx0dmFyIG9sZENoaWxkcmVuTGVuZ3RoID0gb2xkWzBdICYmIG9sZFswXS5jaGlsZHJlbiAmJiBvbGRbMF0uY2hpbGRyZW4ubGVuZ3RoIHx8IDBcblx0XHRcdHZhciBwb29sQ2hpbGRyZW5MZW5ndGggPSBvbGQucG9vbFswXSAmJiBvbGQucG9vbFswXS5jaGlsZHJlbiAmJiBvbGQucG9vbFswXS5jaGlsZHJlbi5sZW5ndGggfHwgMFxuXHRcdFx0dmFyIHZub2Rlc0NoaWxkcmVuTGVuZ3RoID0gdm5vZGVzWzBdICYmIHZub2Rlc1swXS5jaGlsZHJlbiAmJiB2bm9kZXNbMF0uY2hpbGRyZW4ubGVuZ3RoIHx8IDBcblx0XHRcdGlmIChNYXRoLmFicyhwb29sQ2hpbGRyZW5MZW5ndGggLSB2bm9kZXNDaGlsZHJlbkxlbmd0aCkgPD0gTWF0aC5hYnMob2xkQ2hpbGRyZW5MZW5ndGggLSB2bm9kZXNDaGlsZHJlbkxlbmd0aCkpIHtcblx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cblx0ZnVuY3Rpb24gZ2V0S2V5TWFwKHZub2RlcywgZW5kKSB7XG5cdFx0dmFyIG1hcCA9IHt9LCBpID0gMFxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZW5kOyBpKyspIHtcblx0XHRcdHZhciB2bm9kZSA9IHZub2Rlc1tpXVxuXHRcdFx0aWYgKHZub2RlICE9IG51bGwpIHtcblx0XHRcdFx0dmFyIGtleTIgPSB2bm9kZS5rZXlcblx0XHRcdFx0aWYgKGtleTIgIT0gbnVsbCkgbWFwW2tleTJdID0gaVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbWFwXG5cdH1cblx0ZnVuY3Rpb24gdG9GcmFnbWVudCh2bm9kZSkge1xuXHRcdHZhciBjb3VudDAgPSB2bm9kZS5kb21TaXplXG5cdFx0aWYgKGNvdW50MCAhPSBudWxsIHx8IHZub2RlLmRvbSA9PSBudWxsKSB7XG5cdFx0XHR2YXIgZnJhZ21lbnQgPSAkZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdFx0aWYgKGNvdW50MCA+IDApIHtcblx0XHRcdFx0dmFyIGRvbSA9IHZub2RlLmRvbVxuXHRcdFx0XHR3aGlsZSAoLS1jb3VudDApIGZyYWdtZW50LmFwcGVuZENoaWxkKGRvbS5uZXh0U2libGluZylcblx0XHRcdFx0ZnJhZ21lbnQuaW5zZXJ0QmVmb3JlKGRvbSwgZnJhZ21lbnQuZmlyc3RDaGlsZClcblx0XHRcdH1cblx0XHRcdHJldHVybiBmcmFnbWVudFxuXHRcdH1cblx0XHRlbHNlIHJldHVybiB2bm9kZS5kb21cblx0fVxuXHRmdW5jdGlvbiBnZXROZXh0U2libGluZyh2bm9kZXMsIGksIG5leHRTaWJsaW5nKSB7XG5cdFx0Zm9yICg7IGkgPCB2bm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICh2bm9kZXNbaV0gIT0gbnVsbCAmJiB2bm9kZXNbaV0uZG9tICE9IG51bGwpIHJldHVybiB2bm9kZXNbaV0uZG9tXG5cdFx0fVxuXHRcdHJldHVybiBuZXh0U2libGluZ1xuXHR9XG5cdGZ1bmN0aW9uIGluc2VydE5vZGUocGFyZW50LCBkb20sIG5leHRTaWJsaW5nKSB7XG5cdFx0aWYgKG5leHRTaWJsaW5nICYmIG5leHRTaWJsaW5nLnBhcmVudE5vZGUpIHBhcmVudC5pbnNlcnRCZWZvcmUoZG9tLCBuZXh0U2libGluZylcblx0XHRlbHNlIHBhcmVudC5hcHBlbmRDaGlsZChkb20pXG5cdH1cblx0ZnVuY3Rpb24gc2V0Q29udGVudEVkaXRhYmxlKHZub2RlKSB7XG5cdFx0dmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHRpZiAoY2hpbGRyZW4gIT0gbnVsbCAmJiBjaGlsZHJlbi5sZW5ndGggPT09IDEgJiYgY2hpbGRyZW5bMF0udGFnID09PSBcIjxcIikge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjaGlsZHJlblswXS5jaGlsZHJlblxuXHRcdFx0aWYgKHZub2RlLmRvbS5pbm5lckhUTUwgIT09IGNvbnRlbnQpIHZub2RlLmRvbS5pbm5lckhUTUwgPSBjb250ZW50XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHZub2RlLnRleHQgIT0gbnVsbCB8fCBjaGlsZHJlbiAhPSBudWxsICYmIGNoaWxkcmVuLmxlbmd0aCAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGQgbm9kZSBvZiBhIGNvbnRlbnRlZGl0YWJsZSBtdXN0IGJlIHRydXN0ZWRcIilcblx0fVxuXHQvL3JlbW92ZVxuXHRmdW5jdGlvbiByZW1vdmVOb2Rlcyh2bm9kZXMsIHN0YXJ0LCBlbmQsIGNvbnRleHQpIHtcblx0XHRmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuXHRcdFx0dmFyIHZub2RlID0gdm5vZGVzW2ldXG5cdFx0XHRpZiAodm5vZGUgIT0gbnVsbCkge1xuXHRcdFx0XHRpZiAodm5vZGUuc2tpcCkgdm5vZGUuc2tpcCA9IGZhbHNlXG5cdFx0XHRcdGVsc2UgcmVtb3ZlTm9kZSh2bm9kZSwgY29udGV4dClcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gcmVtb3ZlTm9kZSh2bm9kZSwgY29udGV4dCkge1xuXHRcdHZhciBleHBlY3RlZCA9IDEsIGNhbGxlZCA9IDBcblx0XHRpZiAodm5vZGUuYXR0cnMgJiYgdHlwZW9mIHZub2RlLmF0dHJzLm9uYmVmb3JlcmVtb3ZlID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdHZhciByZXN1bHQgPSB2bm9kZS5hdHRycy5vbmJlZm9yZXJlbW92ZS5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSlcblx0XHRcdGlmIChyZXN1bHQgIT0gbnVsbCAmJiB0eXBlb2YgcmVzdWx0LnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRleHBlY3RlZCsrXG5cdFx0XHRcdHJlc3VsdC50aGVuKGNvbnRpbnVhdGlvbiwgY29udGludWF0aW9uKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAodHlwZW9mIHZub2RlLnRhZyAhPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2Ygdm5vZGUuX3N0YXRlLm9uYmVmb3JlcmVtb3ZlID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdHZhciByZXN1bHQgPSB2bm9kZS5fc3RhdGUub25iZWZvcmVyZW1vdmUuY2FsbCh2bm9kZS5zdGF0ZSwgdm5vZGUpXG5cdFx0XHRpZiAocmVzdWx0ICE9IG51bGwgJiYgdHlwZW9mIHJlc3VsdC50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0ZXhwZWN0ZWQrK1xuXHRcdFx0XHRyZXN1bHQudGhlbihjb250aW51YXRpb24sIGNvbnRpbnVhdGlvbilcblx0XHRcdH1cblx0XHR9XG5cdFx0Y29udGludWF0aW9uKClcblx0XHRmdW5jdGlvbiBjb250aW51YXRpb24oKSB7XG5cdFx0XHRpZiAoKytjYWxsZWQgPT09IGV4cGVjdGVkKSB7XG5cdFx0XHRcdG9ucmVtb3ZlKHZub2RlKVxuXHRcdFx0XHRpZiAodm5vZGUuZG9tKSB7XG5cdFx0XHRcdFx0dmFyIGNvdW50MCA9IHZub2RlLmRvbVNpemUgfHwgMVxuXHRcdFx0XHRcdGlmIChjb3VudDAgPiAxKSB7XG5cdFx0XHRcdFx0XHR2YXIgZG9tID0gdm5vZGUuZG9tXG5cdFx0XHRcdFx0XHR3aGlsZSAoLS1jb3VudDApIHtcblx0XHRcdFx0XHRcdFx0cmVtb3ZlTm9kZUZyb21ET00oZG9tLm5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZW1vdmVOb2RlRnJvbURPTSh2bm9kZS5kb20pXG5cdFx0XHRcdFx0aWYgKGNvbnRleHQgIT0gbnVsbCAmJiB2bm9kZS5kb21TaXplID09IG51bGwgJiYgIWhhc0ludGVncmF0aW9uTWV0aG9kcyh2bm9kZS5hdHRycykgJiYgdHlwZW9mIHZub2RlLnRhZyA9PT0gXCJzdHJpbmdcIikgeyAvL1RPRE8gdGVzdCBjdXN0b20gZWxlbWVudHNcblx0XHRcdFx0XHRcdGlmICghY29udGV4dC5wb29sKSBjb250ZXh0LnBvb2wgPSBbdm5vZGVdXG5cdFx0XHRcdFx0XHRlbHNlIGNvbnRleHQucG9vbC5wdXNoKHZub2RlKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiByZW1vdmVOb2RlRnJvbURPTShub2RlKSB7XG5cdFx0dmFyIHBhcmVudCA9IG5vZGUucGFyZW50Tm9kZVxuXHRcdGlmIChwYXJlbnQgIT0gbnVsbCkgcGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpXG5cdH1cblx0ZnVuY3Rpb24gb25yZW1vdmUodm5vZGUpIHtcblx0XHRpZiAodm5vZGUuYXR0cnMgJiYgdHlwZW9mIHZub2RlLmF0dHJzLm9ucmVtb3ZlID09PSBcImZ1bmN0aW9uXCIpIHZub2RlLmF0dHJzLm9ucmVtb3ZlLmNhbGwodm5vZGUuc3RhdGUsIHZub2RlKVxuXHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiB2bm9kZS5fc3RhdGUub25yZW1vdmUgPT09IFwiZnVuY3Rpb25cIikgdm5vZGUuX3N0YXRlLm9ucmVtb3ZlLmNhbGwodm5vZGUuc3RhdGUsIHZub2RlKVxuXHRcdGlmICh2bm9kZS5pbnN0YW5jZSAhPSBudWxsKSBvbnJlbW92ZSh2bm9kZS5pbnN0YW5jZSlcblx0XHRlbHNlIHtcblx0XHRcdHZhciBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldXG5cdFx0XHRcdFx0aWYgKGNoaWxkICE9IG51bGwpIG9ucmVtb3ZlKGNoaWxkKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdC8vYXR0cnMyXG5cdGZ1bmN0aW9uIHNldEF0dHJzKHZub2RlLCBhdHRyczIsIG5zKSB7XG5cdFx0Zm9yICh2YXIga2V5MiBpbiBhdHRyczIpIHtcblx0XHRcdHNldEF0dHIodm5vZGUsIGtleTIsIG51bGwsIGF0dHJzMltrZXkyXSwgbnMpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHNldEF0dHIodm5vZGUsIGtleTIsIG9sZCwgdmFsdWUsIG5zKSB7XG5cdFx0dmFyIGVsZW1lbnQgPSB2bm9kZS5kb21cblx0XHRpZiAoa2V5MiA9PT0gXCJrZXlcIiB8fCBrZXkyID09PSBcImlzXCIgfHwgKG9sZCA9PT0gdmFsdWUgJiYgIWlzRm9ybUF0dHJpYnV0ZSh2bm9kZSwga2V5MikpICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCIgfHwgaXNMaWZlY3ljbGVNZXRob2Qoa2V5MikpIHJldHVyblxuXHRcdHZhciBuc0xhc3RJbmRleCA9IGtleTIuaW5kZXhPZihcIjpcIilcblx0XHRpZiAobnNMYXN0SW5kZXggPiAtMSAmJiBrZXkyLnN1YnN0cigwLCBuc0xhc3RJbmRleCkgPT09IFwieGxpbmtcIikge1xuXHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiwga2V5Mi5zbGljZShuc0xhc3RJbmRleCArIDEpLCB2YWx1ZSlcblx0XHR9XG5cdFx0ZWxzZSBpZiAoa2V5MlswXSA9PT0gXCJvXCIgJiYga2V5MlsxXSA9PT0gXCJuXCIgJiYgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHVwZGF0ZUV2ZW50KHZub2RlLCBrZXkyLCB2YWx1ZSlcblx0XHRlbHNlIGlmIChrZXkyID09PSBcInN0eWxlXCIpIHVwZGF0ZVN0eWxlKGVsZW1lbnQsIG9sZCwgdmFsdWUpXG5cdFx0ZWxzZSBpZiAoa2V5MiBpbiBlbGVtZW50ICYmICFpc0F0dHJpYnV0ZShrZXkyKSAmJiBucyA9PT0gdW5kZWZpbmVkICYmICFpc0N1c3RvbUVsZW1lbnQodm5vZGUpKSB7XG5cdFx0XHQvL3NldHRpbmcgaW5wdXRbdmFsdWVdIHRvIHNhbWUgdmFsdWUgYnkgdHlwaW5nIG9uIGZvY3VzZWQgZWxlbWVudCBtb3ZlcyBjdXJzb3IgdG8gZW5kIGluIENocm9tZVxuXHRcdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJpbnB1dFwiICYmIGtleTIgPT09IFwidmFsdWVcIiAmJiB2bm9kZS5kb20udmFsdWUgPT0gdmFsdWUgJiYgdm5vZGUuZG9tID09PSAkZG9jLmFjdGl2ZUVsZW1lbnQpIHJldHVyblxuXHRcdFx0Ly9zZXR0aW5nIHNlbGVjdFt2YWx1ZV0gdG8gc2FtZSB2YWx1ZSB3aGlsZSBoYXZpbmcgc2VsZWN0IG9wZW4gYmxpbmtzIHNlbGVjdCBkcm9wZG93biBpbiBDaHJvbWVcblx0XHRcdGlmICh2bm9kZS50YWcgPT09IFwic2VsZWN0XCIgJiYga2V5MiA9PT0gXCJ2YWx1ZVwiICYmIHZub2RlLmRvbS52YWx1ZSA9PSB2YWx1ZSAmJiB2bm9kZS5kb20gPT09ICRkb2MuYWN0aXZlRWxlbWVudCkgcmV0dXJuXG5cdFx0XHQvL3NldHRpbmcgb3B0aW9uW3ZhbHVlXSB0byBzYW1lIHZhbHVlIHdoaWxlIGhhdmluZyBzZWxlY3Qgb3BlbiBibGlua3Mgc2VsZWN0IGRyb3Bkb3duIGluIENocm9tZVxuXHRcdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJvcHRpb25cIiAmJiBrZXkyID09PSBcInZhbHVlXCIgJiYgdm5vZGUuZG9tLnZhbHVlID09IHZhbHVlKSByZXR1cm5cblx0XHRcdC8vIElmIHlvdSBhc3NpZ24gYW4gaW5wdXQgdHlwZTEgdGhhdCBpcyBub3Qgc3VwcG9ydGVkIGJ5IElFIDExIHdpdGggYW4gYXNzaWdubWVudCBleHByZXNzaW9uLCBhbiBlcnJvcjAgd2lsbCBvY2N1ci5cblx0XHRcdGlmICh2bm9kZS50YWcgPT09IFwiaW5wdXRcIiAmJiBrZXkyID09PSBcInR5cGVcIikge1xuXHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShrZXkyLCB2YWx1ZSlcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHRlbGVtZW50W2tleTJdID0gdmFsdWVcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIikge1xuXHRcdFx0XHRpZiAodmFsdWUpIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleTIsIFwiXCIpXG5cdFx0XHRcdGVsc2UgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoa2V5Milcblx0XHRcdH1cblx0XHRcdGVsc2UgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5MiA9PT0gXCJjbGFzc05hbWVcIiA/IFwiY2xhc3NcIiA6IGtleTIsIHZhbHVlKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBzZXRMYXRlQXR0cnModm5vZGUpIHtcblx0XHR2YXIgYXR0cnMyID0gdm5vZGUuYXR0cnNcblx0XHRpZiAodm5vZGUudGFnID09PSBcInNlbGVjdFwiICYmIGF0dHJzMiAhPSBudWxsKSB7XG5cdFx0XHRpZiAoXCJ2YWx1ZVwiIGluIGF0dHJzMikgc2V0QXR0cih2bm9kZSwgXCJ2YWx1ZVwiLCBudWxsLCBhdHRyczIudmFsdWUsIHVuZGVmaW5lZClcblx0XHRcdGlmIChcInNlbGVjdGVkSW5kZXhcIiBpbiBhdHRyczIpIHNldEF0dHIodm5vZGUsIFwic2VsZWN0ZWRJbmRleFwiLCBudWxsLCBhdHRyczIuc2VsZWN0ZWRJbmRleCwgdW5kZWZpbmVkKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVBdHRycyh2bm9kZSwgb2xkLCBhdHRyczIsIG5zKSB7XG5cdFx0aWYgKGF0dHJzMiAhPSBudWxsKSB7XG5cdFx0XHRmb3IgKHZhciBrZXkyIGluIGF0dHJzMikge1xuXHRcdFx0XHRzZXRBdHRyKHZub2RlLCBrZXkyLCBvbGQgJiYgb2xkW2tleTJdLCBhdHRyczJba2V5Ml0sIG5zKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAob2xkICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGtleTIgaW4gb2xkKSB7XG5cdFx0XHRcdGlmIChhdHRyczIgPT0gbnVsbCB8fCAhKGtleTIgaW4gYXR0cnMyKSkge1xuXHRcdFx0XHRcdGlmIChrZXkyID09PSBcImNsYXNzTmFtZVwiKSBrZXkyID0gXCJjbGFzc1wiXG5cdFx0XHRcdFx0aWYgKGtleTJbMF0gPT09IFwib1wiICYmIGtleTJbMV0gPT09IFwiblwiICYmICFpc0xpZmVjeWNsZU1ldGhvZChrZXkyKSkgdXBkYXRlRXZlbnQodm5vZGUsIGtleTIsIHVuZGVmaW5lZClcblx0XHRcdFx0XHRlbHNlIGlmIChrZXkyICE9PSBcImtleVwiKSB2bm9kZS5kb20ucmVtb3ZlQXR0cmlidXRlKGtleTIpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gaXNGb3JtQXR0cmlidXRlKHZub2RlLCBhdHRyKSB7XG5cdFx0cmV0dXJuIGF0dHIgPT09IFwidmFsdWVcIiB8fCBhdHRyID09PSBcImNoZWNrZWRcIiB8fCBhdHRyID09PSBcInNlbGVjdGVkSW5kZXhcIiB8fCBhdHRyID09PSBcInNlbGVjdGVkXCIgJiYgdm5vZGUuZG9tID09PSAkZG9jLmFjdGl2ZUVsZW1lbnRcblx0fVxuXHRmdW5jdGlvbiBpc0xpZmVjeWNsZU1ldGhvZChhdHRyKSB7XG5cdFx0cmV0dXJuIGF0dHIgPT09IFwib25pbml0XCIgfHwgYXR0ciA9PT0gXCJvbmNyZWF0ZVwiIHx8IGF0dHIgPT09IFwib251cGRhdGVcIiB8fCBhdHRyID09PSBcIm9ucmVtb3ZlXCIgfHwgYXR0ciA9PT0gXCJvbmJlZm9yZXJlbW92ZVwiIHx8IGF0dHIgPT09IFwib25iZWZvcmV1cGRhdGVcIlxuXHR9XG5cdGZ1bmN0aW9uIGlzQXR0cmlidXRlKGF0dHIpIHtcblx0XHRyZXR1cm4gYXR0ciA9PT0gXCJocmVmXCIgfHwgYXR0ciA9PT0gXCJsaXN0XCIgfHwgYXR0ciA9PT0gXCJmb3JtXCIgfHwgYXR0ciA9PT0gXCJ3aWR0aFwiIHx8IGF0dHIgPT09IFwiaGVpZ2h0XCIvLyB8fCBhdHRyID09PSBcInR5cGVcIlxuXHR9XG5cdGZ1bmN0aW9uIGlzQ3VzdG9tRWxlbWVudCh2bm9kZSl7XG5cdFx0cmV0dXJuIHZub2RlLmF0dHJzLmlzIHx8IHZub2RlLnRhZy5pbmRleE9mKFwiLVwiKSA+IC0xXG5cdH1cblx0ZnVuY3Rpb24gaGFzSW50ZWdyYXRpb25NZXRob2RzKHNvdXJjZSkge1xuXHRcdHJldHVybiBzb3VyY2UgIT0gbnVsbCAmJiAoc291cmNlLm9uY3JlYXRlIHx8IHNvdXJjZS5vbnVwZGF0ZSB8fCBzb3VyY2Uub25iZWZvcmVyZW1vdmUgfHwgc291cmNlLm9ucmVtb3ZlKVxuXHR9XG5cdC8vc3R5bGVcblx0ZnVuY3Rpb24gdXBkYXRlU3R5bGUoZWxlbWVudCwgb2xkLCBzdHlsZSkge1xuXHRcdGlmIChvbGQgPT09IHN0eWxlKSBlbGVtZW50LnN0eWxlLmNzc1RleHQgPSBcIlwiLCBvbGQgPSBudWxsXG5cdFx0aWYgKHN0eWxlID09IG51bGwpIGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IFwiXCJcblx0XHRlbHNlIGlmICh0eXBlb2Ygc3R5bGUgPT09IFwic3RyaW5nXCIpIGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IHN0eWxlXG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAodHlwZW9mIG9sZCA9PT0gXCJzdHJpbmdcIikgZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gXCJcIlxuXHRcdFx0Zm9yICh2YXIga2V5MiBpbiBzdHlsZSkge1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlW2tleTJdID0gc3R5bGVba2V5Ml1cblx0XHRcdH1cblx0XHRcdGlmIChvbGQgIT0gbnVsbCAmJiB0eXBlb2Ygb2xkICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdGZvciAodmFyIGtleTIgaW4gb2xkKSB7XG5cdFx0XHRcdFx0aWYgKCEoa2V5MiBpbiBzdHlsZSkpIGVsZW1lbnQuc3R5bGVba2V5Ml0gPSBcIlwiXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Ly9ldmVudFxuXHRmdW5jdGlvbiB1cGRhdGVFdmVudCh2bm9kZSwga2V5MiwgdmFsdWUpIHtcblx0XHR2YXIgZWxlbWVudCA9IHZub2RlLmRvbVxuXHRcdHZhciBjYWxsYmFjayA9IHR5cGVvZiBvbmV2ZW50ICE9PSBcImZ1bmN0aW9uXCIgPyB2YWx1ZSA6IGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciByZXN1bHQgPSB2YWx1ZS5jYWxsKGVsZW1lbnQsIGUpXG5cdFx0XHRvbmV2ZW50LmNhbGwoZWxlbWVudCwgZSlcblx0XHRcdHJldHVybiByZXN1bHRcblx0XHR9XG5cdFx0aWYgKGtleTIgaW4gZWxlbWVudCkgZWxlbWVudFtrZXkyXSA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiID8gY2FsbGJhY2sgOiBudWxsXG5cdFx0ZWxzZSB7XG5cdFx0XHR2YXIgZXZlbnROYW1lID0ga2V5Mi5zbGljZSgyKVxuXHRcdFx0aWYgKHZub2RlLmV2ZW50cyA9PT0gdW5kZWZpbmVkKSB2bm9kZS5ldmVudHMgPSB7fVxuXHRcdFx0aWYgKHZub2RlLmV2ZW50c1trZXkyXSA9PT0gY2FsbGJhY2spIHJldHVyblxuXHRcdFx0aWYgKHZub2RlLmV2ZW50c1trZXkyXSAhPSBudWxsKSBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB2bm9kZS5ldmVudHNba2V5Ml0sIGZhbHNlKVxuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHZub2RlLmV2ZW50c1trZXkyXSA9IGNhbGxiYWNrXG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHZub2RlLmV2ZW50c1trZXkyXSwgZmFsc2UpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdC8vbGlmZWN5Y2xlXG5cdGZ1bmN0aW9uIGluaXRMaWZlY3ljbGUoc291cmNlLCB2bm9kZSwgaG9va3MpIHtcblx0XHRpZiAodHlwZW9mIHNvdXJjZS5vbmluaXQgPT09IFwiZnVuY3Rpb25cIikgc291cmNlLm9uaW5pdC5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSlcblx0XHRpZiAodHlwZW9mIHNvdXJjZS5vbmNyZWF0ZSA9PT0gXCJmdW5jdGlvblwiKSBob29rcy5wdXNoKHNvdXJjZS5vbmNyZWF0ZS5iaW5kKHZub2RlLnN0YXRlLCB2bm9kZSkpXG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlTGlmZWN5Y2xlKHNvdXJjZSwgdm5vZGUsIGhvb2tzKSB7XG5cdFx0aWYgKHR5cGVvZiBzb3VyY2Uub251cGRhdGUgPT09IFwiZnVuY3Rpb25cIikgaG9va3MucHVzaChzb3VyY2Uub251cGRhdGUuYmluZCh2bm9kZS5zdGF0ZSwgdm5vZGUpKVxuXHR9XG5cdGZ1bmN0aW9uIHNob3VsZE5vdFVwZGF0ZSh2bm9kZSwgb2xkKSB7XG5cdFx0dmFyIGZvcmNlVm5vZGVVcGRhdGUsIGZvcmNlQ29tcG9uZW50VXBkYXRlXG5cdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwgJiYgdHlwZW9mIHZub2RlLmF0dHJzLm9uYmVmb3JldXBkYXRlID09PSBcImZ1bmN0aW9uXCIpIGZvcmNlVm5vZGVVcGRhdGUgPSB2bm9kZS5hdHRycy5vbmJlZm9yZXVwZGF0ZS5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSwgb2xkKVxuXHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiB2bm9kZS5fc3RhdGUub25iZWZvcmV1cGRhdGUgPT09IFwiZnVuY3Rpb25cIikgZm9yY2VDb21wb25lbnRVcGRhdGUgPSB2bm9kZS5fc3RhdGUub25iZWZvcmV1cGRhdGUuY2FsbCh2bm9kZS5zdGF0ZSwgdm5vZGUsIG9sZClcblx0XHRpZiAoIShmb3JjZVZub2RlVXBkYXRlID09PSB1bmRlZmluZWQgJiYgZm9yY2VDb21wb25lbnRVcGRhdGUgPT09IHVuZGVmaW5lZCkgJiYgIWZvcmNlVm5vZGVVcGRhdGUgJiYgIWZvcmNlQ29tcG9uZW50VXBkYXRlKSB7XG5cdFx0XHR2bm9kZS5kb20gPSBvbGQuZG9tXG5cdFx0XHR2bm9kZS5kb21TaXplID0gb2xkLmRvbVNpemVcblx0XHRcdHZub2RlLmluc3RhbmNlID0gb2xkLmluc3RhbmNlXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxuXHRmdW5jdGlvbiByZW5kZXIoZG9tLCB2bm9kZXMpIHtcblx0XHRpZiAoIWRvbSkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBET00gZWxlbWVudCBiZWluZyBwYXNzZWQgdG8gbS5yb3V0ZS9tLm1vdW50L20ucmVuZGVyIGlzIG5vdCB1bmRlZmluZWQuXCIpXG5cdFx0dmFyIGhvb2tzID0gW11cblx0XHR2YXIgYWN0aXZlID0gJGRvYy5hY3RpdmVFbGVtZW50XG5cdFx0Ly8gRmlyc3QgdGltZTAgcmVuZGVyaW5nIGludG8gYSBub2RlIGNsZWFycyBpdCBvdXRcblx0XHRpZiAoZG9tLnZub2RlcyA9PSBudWxsKSBkb20udGV4dENvbnRlbnQgPSBcIlwiXG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KHZub2RlcykpIHZub2RlcyA9IFt2bm9kZXNdXG5cdFx0dXBkYXRlTm9kZXMoZG9tLCBkb20udm5vZGVzLCBWbm9kZS5ub3JtYWxpemVDaGlsZHJlbih2bm9kZXMpLCBmYWxzZSwgaG9va3MsIG51bGwsIHVuZGVmaW5lZClcblx0XHRkb20udm5vZGVzID0gdm5vZGVzXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBob29rcy5sZW5ndGg7IGkrKykgaG9va3NbaV0oKVxuXHRcdGlmICgkZG9jLmFjdGl2ZUVsZW1lbnQgIT09IGFjdGl2ZSkgYWN0aXZlLmZvY3VzKClcblx0fVxuXHRyZXR1cm4ge3JlbmRlcjogcmVuZGVyLCBzZXRFdmVudENhbGxiYWNrOiBzZXRFdmVudENhbGxiYWNrfVxufVxuZnVuY3Rpb24gdGhyb3R0bGUoY2FsbGJhY2spIHtcblx0Ly82MGZwcyB0cmFuc2xhdGVzIHRvIDE2LjZtcywgcm91bmQgaXQgZG93biBzaW5jZSBzZXRUaW1lb3V0IHJlcXVpcmVzIGludFxuXHR2YXIgdGltZSA9IDE2XG5cdHZhciBsYXN0ID0gMCwgcGVuZGluZyA9IG51bGxcblx0dmFyIHRpbWVvdXQgPSB0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSBcImZ1bmN0aW9uXCIgPyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgOiBzZXRUaW1lb3V0XG5cdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHR2YXIgbm93ID0gRGF0ZS5ub3coKVxuXHRcdGlmIChsYXN0ID09PSAwIHx8IG5vdyAtIGxhc3QgPj0gdGltZSkge1xuXHRcdFx0bGFzdCA9IG5vd1xuXHRcdFx0Y2FsbGJhY2soKVxuXHRcdH1cblx0XHRlbHNlIGlmIChwZW5kaW5nID09PSBudWxsKSB7XG5cdFx0XHRwZW5kaW5nID0gdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0cGVuZGluZyA9IG51bGxcblx0XHRcdFx0Y2FsbGJhY2soKVxuXHRcdFx0XHRsYXN0ID0gRGF0ZS5ub3coKVxuXHRcdFx0fSwgdGltZSAtIChub3cgLSBsYXN0KSlcblx0XHR9XG5cdH1cbn1cbnZhciBfMTEgPSBmdW5jdGlvbigkd2luZG93KSB7XG5cdHZhciByZW5kZXJTZXJ2aWNlID0gY29yZVJlbmRlcmVyKCR3aW5kb3cpXG5cdHJlbmRlclNlcnZpY2Uuc2V0RXZlbnRDYWxsYmFjayhmdW5jdGlvbihlKSB7XG5cdFx0aWYgKGUucmVkcmF3ICE9PSBmYWxzZSkgcmVkcmF3KClcblx0fSlcblx0dmFyIGNhbGxiYWNrcyA9IFtdXG5cdGZ1bmN0aW9uIHN1YnNjcmliZShrZXkxLCBjYWxsYmFjaykge1xuXHRcdHVuc3Vic2NyaWJlKGtleTEpXG5cdFx0Y2FsbGJhY2tzLnB1c2goa2V5MSwgdGhyb3R0bGUoY2FsbGJhY2spKVxuXHR9XG5cdGZ1bmN0aW9uIHVuc3Vic2NyaWJlKGtleTEpIHtcblx0XHR2YXIgaW5kZXggPSBjYWxsYmFja3MuaW5kZXhPZihrZXkxKVxuXHRcdGlmIChpbmRleCA+IC0xKSBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAyKVxuXHR9XG5cdGZ1bmN0aW9uIHJlZHJhdygpIHtcblx0XHRmb3IgKHZhciBpID0gMTsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkgKz0gMikge1xuXHRcdFx0Y2FsbGJhY2tzW2ldKClcblx0XHR9XG5cdH1cblx0cmV0dXJuIHtzdWJzY3JpYmU6IHN1YnNjcmliZSwgdW5zdWJzY3JpYmU6IHVuc3Vic2NyaWJlLCByZWRyYXc6IHJlZHJhdywgcmVuZGVyOiByZW5kZXJTZXJ2aWNlLnJlbmRlcn1cbn1cbnZhciByZWRyYXdTZXJ2aWNlID0gXzExKHdpbmRvdylcbnJlcXVlc3RTZXJ2aWNlLnNldENvbXBsZXRpb25DYWxsYmFjayhyZWRyYXdTZXJ2aWNlLnJlZHJhdylcbnZhciBfMTYgPSBmdW5jdGlvbihyZWRyYXdTZXJ2aWNlMCkge1xuXHRyZXR1cm4gZnVuY3Rpb24ocm9vdCwgY29tcG9uZW50KSB7XG5cdFx0aWYgKGNvbXBvbmVudCA9PT0gbnVsbCkge1xuXHRcdFx0cmVkcmF3U2VydmljZTAucmVuZGVyKHJvb3QsIFtdKVxuXHRcdFx0cmVkcmF3U2VydmljZTAudW5zdWJzY3JpYmUocm9vdClcblx0XHRcdHJldHVyblxuXHRcdH1cblx0XHRcblx0XHRpZiAoY29tcG9uZW50LnZpZXcgPT0gbnVsbCAmJiB0eXBlb2YgY29tcG9uZW50ICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBFcnJvcihcIm0ubW91bnQoZWxlbWVudCwgY29tcG9uZW50KSBleHBlY3RzIGEgY29tcG9uZW50LCBub3QgYSB2bm9kZVwiKVxuXHRcdFxuXHRcdHZhciBydW4wID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZWRyYXdTZXJ2aWNlMC5yZW5kZXIocm9vdCwgVm5vZGUoY29tcG9uZW50KSlcblx0XHR9XG5cdFx0cmVkcmF3U2VydmljZTAuc3Vic2NyaWJlKHJvb3QsIHJ1bjApXG5cdFx0cmVkcmF3U2VydmljZTAucmVkcmF3KClcblx0fVxufVxubS5tb3VudCA9IF8xNihyZWRyYXdTZXJ2aWNlKVxudmFyIFByb21pc2UgPSBQcm9taXNlUG9seWZpbGxcbnZhciBwYXJzZVF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24oc3RyaW5nKSB7XG5cdGlmIChzdHJpbmcgPT09IFwiXCIgfHwgc3RyaW5nID09IG51bGwpIHJldHVybiB7fVxuXHRpZiAoc3RyaW5nLmNoYXJBdCgwKSA9PT0gXCI/XCIpIHN0cmluZyA9IHN0cmluZy5zbGljZSgxKVxuXHR2YXIgZW50cmllcyA9IHN0cmluZy5zcGxpdChcIiZcIiksIGRhdGEwID0ge30sIGNvdW50ZXJzID0ge31cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGVudHJ5ID0gZW50cmllc1tpXS5zcGxpdChcIj1cIilcblx0XHR2YXIga2V5NSA9IGRlY29kZVVSSUNvbXBvbmVudChlbnRyeVswXSlcblx0XHR2YXIgdmFsdWUgPSBlbnRyeS5sZW5ndGggPT09IDIgPyBkZWNvZGVVUklDb21wb25lbnQoZW50cnlbMV0pIDogXCJcIlxuXHRcdGlmICh2YWx1ZSA9PT0gXCJ0cnVlXCIpIHZhbHVlID0gdHJ1ZVxuXHRcdGVsc2UgaWYgKHZhbHVlID09PSBcImZhbHNlXCIpIHZhbHVlID0gZmFsc2Vcblx0XHR2YXIgbGV2ZWxzID0ga2V5NS5zcGxpdCgvXFxdXFxbP3xcXFsvKVxuXHRcdHZhciBjdXJzb3IgPSBkYXRhMFxuXHRcdGlmIChrZXk1LmluZGV4T2YoXCJbXCIpID4gLTEpIGxldmVscy5wb3AoKVxuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgbGV2ZWxzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHR2YXIgbGV2ZWwgPSBsZXZlbHNbal0sIG5leHRMZXZlbCA9IGxldmVsc1tqICsgMV1cblx0XHRcdHZhciBpc051bWJlciA9IG5leHRMZXZlbCA9PSBcIlwiIHx8ICFpc05hTihwYXJzZUludChuZXh0TGV2ZWwsIDEwKSlcblx0XHRcdHZhciBpc1ZhbHVlID0gaiA9PT0gbGV2ZWxzLmxlbmd0aCAtIDFcblx0XHRcdGlmIChsZXZlbCA9PT0gXCJcIikge1xuXHRcdFx0XHR2YXIga2V5NSA9IGxldmVscy5zbGljZSgwLCBqKS5qb2luKClcblx0XHRcdFx0aWYgKGNvdW50ZXJzW2tleTVdID09IG51bGwpIGNvdW50ZXJzW2tleTVdID0gMFxuXHRcdFx0XHRsZXZlbCA9IGNvdW50ZXJzW2tleTVdKytcblx0XHRcdH1cblx0XHRcdGlmIChjdXJzb3JbbGV2ZWxdID09IG51bGwpIHtcblx0XHRcdFx0Y3Vyc29yW2xldmVsXSA9IGlzVmFsdWUgPyB2YWx1ZSA6IGlzTnVtYmVyID8gW10gOiB7fVxuXHRcdFx0fVxuXHRcdFx0Y3Vyc29yID0gY3Vyc29yW2xldmVsXVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gZGF0YTBcbn1cbnZhciBjb3JlUm91dGVyID0gZnVuY3Rpb24oJHdpbmRvdykge1xuXHR2YXIgc3VwcG9ydHNQdXNoU3RhdGUgPSB0eXBlb2YgJHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSA9PT0gXCJmdW5jdGlvblwiXG5cdHZhciBjYWxsQXN5bmMwID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gXCJmdW5jdGlvblwiID8gc2V0SW1tZWRpYXRlIDogc2V0VGltZW91dFxuXHRmdW5jdGlvbiBub3JtYWxpemUxKGZyYWdtZW50MCkge1xuXHRcdHZhciBkYXRhID0gJHdpbmRvdy5sb2NhdGlvbltmcmFnbWVudDBdLnJlcGxhY2UoLyg/OiVbYS1mODldW2EtZjAtOV0pKy9naW0sIGRlY29kZVVSSUNvbXBvbmVudClcblx0XHRpZiAoZnJhZ21lbnQwID09PSBcInBhdGhuYW1lXCIgJiYgZGF0YVswXSAhPT0gXCIvXCIpIGRhdGEgPSBcIi9cIiArIGRhdGFcblx0XHRyZXR1cm4gZGF0YVxuXHR9XG5cdHZhciBhc3luY0lkXG5cdGZ1bmN0aW9uIGRlYm91bmNlQXN5bmMoY2FsbGJhY2swKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKGFzeW5jSWQgIT0gbnVsbCkgcmV0dXJuXG5cdFx0XHRhc3luY0lkID0gY2FsbEFzeW5jMChmdW5jdGlvbigpIHtcblx0XHRcdFx0YXN5bmNJZCA9IG51bGxcblx0XHRcdFx0Y2FsbGJhY2swKClcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHBhcnNlUGF0aChwYXRoLCBxdWVyeURhdGEsIGhhc2hEYXRhKSB7XG5cdFx0dmFyIHF1ZXJ5SW5kZXggPSBwYXRoLmluZGV4T2YoXCI/XCIpXG5cdFx0dmFyIGhhc2hJbmRleCA9IHBhdGguaW5kZXhPZihcIiNcIilcblx0XHR2YXIgcGF0aEVuZCA9IHF1ZXJ5SW5kZXggPiAtMSA/IHF1ZXJ5SW5kZXggOiBoYXNoSW5kZXggPiAtMSA/IGhhc2hJbmRleCA6IHBhdGgubGVuZ3RoXG5cdFx0aWYgKHF1ZXJ5SW5kZXggPiAtMSkge1xuXHRcdFx0dmFyIHF1ZXJ5RW5kID0gaGFzaEluZGV4ID4gLTEgPyBoYXNoSW5kZXggOiBwYXRoLmxlbmd0aFxuXHRcdFx0dmFyIHF1ZXJ5UGFyYW1zID0gcGFyc2VRdWVyeVN0cmluZyhwYXRoLnNsaWNlKHF1ZXJ5SW5kZXggKyAxLCBxdWVyeUVuZCkpXG5cdFx0XHRmb3IgKHZhciBrZXk0IGluIHF1ZXJ5UGFyYW1zKSBxdWVyeURhdGFba2V5NF0gPSBxdWVyeVBhcmFtc1trZXk0XVxuXHRcdH1cblx0XHRpZiAoaGFzaEluZGV4ID4gLTEpIHtcblx0XHRcdHZhciBoYXNoUGFyYW1zID0gcGFyc2VRdWVyeVN0cmluZyhwYXRoLnNsaWNlKGhhc2hJbmRleCArIDEpKVxuXHRcdFx0Zm9yICh2YXIga2V5NCBpbiBoYXNoUGFyYW1zKSBoYXNoRGF0YVtrZXk0XSA9IGhhc2hQYXJhbXNba2V5NF1cblx0XHR9XG5cdFx0cmV0dXJuIHBhdGguc2xpY2UoMCwgcGF0aEVuZClcblx0fVxuXHR2YXIgcm91dGVyID0ge3ByZWZpeDogXCIjIVwifVxuXHRyb3V0ZXIuZ2V0UGF0aCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB0eXBlMiA9IHJvdXRlci5wcmVmaXguY2hhckF0KDApXG5cdFx0c3dpdGNoICh0eXBlMikge1xuXHRcdFx0Y2FzZSBcIiNcIjogcmV0dXJuIG5vcm1hbGl6ZTEoXCJoYXNoXCIpLnNsaWNlKHJvdXRlci5wcmVmaXgubGVuZ3RoKVxuXHRcdFx0Y2FzZSBcIj9cIjogcmV0dXJuIG5vcm1hbGl6ZTEoXCJzZWFyY2hcIikuc2xpY2Uocm91dGVyLnByZWZpeC5sZW5ndGgpICsgbm9ybWFsaXplMShcImhhc2hcIilcblx0XHRcdGRlZmF1bHQ6IHJldHVybiBub3JtYWxpemUxKFwicGF0aG5hbWVcIikuc2xpY2Uocm91dGVyLnByZWZpeC5sZW5ndGgpICsgbm9ybWFsaXplMShcInNlYXJjaFwiKSArIG5vcm1hbGl6ZTEoXCJoYXNoXCIpXG5cdFx0fVxuXHR9XG5cdHJvdXRlci5zZXRQYXRoID0gZnVuY3Rpb24ocGF0aCwgZGF0YSwgb3B0aW9ucykge1xuXHRcdHZhciBxdWVyeURhdGEgPSB7fSwgaGFzaERhdGEgPSB7fVxuXHRcdHBhdGggPSBwYXJzZVBhdGgocGF0aCwgcXVlcnlEYXRhLCBoYXNoRGF0YSlcblx0XHRpZiAoZGF0YSAhPSBudWxsKSB7XG5cdFx0XHRmb3IgKHZhciBrZXk0IGluIGRhdGEpIHF1ZXJ5RGF0YVtrZXk0XSA9IGRhdGFba2V5NF1cblx0XHRcdHBhdGggPSBwYXRoLnJlcGxhY2UoLzooW15cXC9dKykvZywgZnVuY3Rpb24obWF0Y2gyLCB0b2tlbikge1xuXHRcdFx0XHRkZWxldGUgcXVlcnlEYXRhW3Rva2VuXVxuXHRcdFx0XHRyZXR1cm4gZGF0YVt0b2tlbl1cblx0XHRcdH0pXG5cdFx0fVxuXHRcdHZhciBxdWVyeSA9IGJ1aWxkUXVlcnlTdHJpbmcocXVlcnlEYXRhKVxuXHRcdGlmIChxdWVyeSkgcGF0aCArPSBcIj9cIiArIHF1ZXJ5XG5cdFx0dmFyIGhhc2ggPSBidWlsZFF1ZXJ5U3RyaW5nKGhhc2hEYXRhKVxuXHRcdGlmIChoYXNoKSBwYXRoICs9IFwiI1wiICsgaGFzaFxuXHRcdGlmIChzdXBwb3J0c1B1c2hTdGF0ZSkge1xuXHRcdFx0dmFyIHN0YXRlID0gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdGUgOiBudWxsXG5cdFx0XHR2YXIgdGl0bGUgPSBvcHRpb25zID8gb3B0aW9ucy50aXRsZSA6IG51bGxcblx0XHRcdCR3aW5kb3cub25wb3BzdGF0ZSgpXG5cdFx0XHRpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJlcGxhY2UpICR3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoc3RhdGUsIHRpdGxlLCByb3V0ZXIucHJlZml4ICsgcGF0aClcblx0XHRcdGVsc2UgJHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZSwgdGl0bGUsIHJvdXRlci5wcmVmaXggKyBwYXRoKVxuXHRcdH1cblx0XHRlbHNlICR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJvdXRlci5wcmVmaXggKyBwYXRoXG5cdH1cblx0cm91dGVyLmRlZmluZVJvdXRlcyA9IGZ1bmN0aW9uKHJvdXRlcywgcmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0ZnVuY3Rpb24gcmVzb2x2ZVJvdXRlKCkge1xuXHRcdFx0dmFyIHBhdGggPSByb3V0ZXIuZ2V0UGF0aCgpXG5cdFx0XHR2YXIgcGFyYW1zID0ge31cblx0XHRcdHZhciBwYXRobmFtZSA9IHBhcnNlUGF0aChwYXRoLCBwYXJhbXMsIHBhcmFtcylcblx0XHRcdHZhciBzdGF0ZSA9ICR3aW5kb3cuaGlzdG9yeS5zdGF0ZVxuXHRcdFx0aWYgKHN0YXRlICE9IG51bGwpIHtcblx0XHRcdFx0Zm9yICh2YXIgayBpbiBzdGF0ZSkgcGFyYW1zW2tdID0gc3RhdGVba11cblx0XHRcdH1cblx0XHRcdGZvciAodmFyIHJvdXRlMCBpbiByb3V0ZXMpIHtcblx0XHRcdFx0dmFyIG1hdGNoZXIgPSBuZXcgUmVnRXhwKFwiXlwiICsgcm91dGUwLnJlcGxhY2UoLzpbXlxcL10rP1xcLnszfS9nLCBcIiguKj8pXCIpLnJlcGxhY2UoLzpbXlxcL10rL2csIFwiKFteXFxcXC9dKylcIikgKyBcIlxcLz8kXCIpXG5cdFx0XHRcdGlmIChtYXRjaGVyLnRlc3QocGF0aG5hbWUpKSB7XG5cdFx0XHRcdFx0cGF0aG5hbWUucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHZhciBrZXlzID0gcm91dGUwLm1hdGNoKC86W15cXC9dKy9nKSB8fCBbXVxuXHRcdFx0XHRcdFx0dmFyIHZhbHVlcyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxLCAtMilcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRwYXJhbXNba2V5c1tpXS5yZXBsYWNlKC86fFxcLi9nLCBcIlwiKV0gPSBkZWNvZGVVUklDb21wb25lbnQodmFsdWVzW2ldKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmVzb2x2ZShyb3V0ZXNbcm91dGUwXSwgcGFyYW1zLCBwYXRoLCByb3V0ZTApXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmVqZWN0KHBhdGgsIHBhcmFtcylcblx0XHR9XG5cdFx0aWYgKHN1cHBvcnRzUHVzaFN0YXRlKSAkd2luZG93Lm9ucG9wc3RhdGUgPSBkZWJvdW5jZUFzeW5jKHJlc29sdmVSb3V0ZSlcblx0XHRlbHNlIGlmIChyb3V0ZXIucHJlZml4LmNoYXJBdCgwKSA9PT0gXCIjXCIpICR3aW5kb3cub25oYXNoY2hhbmdlID0gcmVzb2x2ZVJvdXRlXG5cdFx0cmVzb2x2ZVJvdXRlKClcblx0fVxuXHRyZXR1cm4gcm91dGVyXG59XG52YXIgXzIwID0gZnVuY3Rpb24oJHdpbmRvdywgcmVkcmF3U2VydmljZTApIHtcblx0dmFyIHJvdXRlU2VydmljZSA9IGNvcmVSb3V0ZXIoJHdpbmRvdylcblx0dmFyIGlkZW50aXR5ID0gZnVuY3Rpb24odikge3JldHVybiB2fVxuXHR2YXIgcmVuZGVyMSwgY29tcG9uZW50LCBhdHRyczMsIGN1cnJlbnRQYXRoLCBsYXN0VXBkYXRlXG5cdHZhciByb3V0ZSA9IGZ1bmN0aW9uKHJvb3QsIGRlZmF1bHRSb3V0ZSwgcm91dGVzKSB7XG5cdFx0aWYgKHJvb3QgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBET00gZWxlbWVudCB0aGF0IHdhcyBwYXNzZWQgdG8gYG0ucm91dGVgIGlzIG5vdCB1bmRlZmluZWRcIilcblx0XHR2YXIgcnVuMSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHJlbmRlcjEgIT0gbnVsbCkgcmVkcmF3U2VydmljZTAucmVuZGVyKHJvb3QsIHJlbmRlcjEoVm5vZGUoY29tcG9uZW50LCBhdHRyczMua2V5LCBhdHRyczMpKSlcblx0XHR9XG5cdFx0dmFyIGJhaWwgPSBmdW5jdGlvbihwYXRoKSB7XG5cdFx0XHRpZiAocGF0aCAhPT0gZGVmYXVsdFJvdXRlKSByb3V0ZVNlcnZpY2Uuc2V0UGF0aChkZWZhdWx0Um91dGUsIG51bGwsIHtyZXBsYWNlOiB0cnVlfSlcblx0XHRcdGVsc2UgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IHJlc29sdmUgZGVmYXVsdCByb3V0ZSBcIiArIGRlZmF1bHRSb3V0ZSlcblx0XHR9XG5cdFx0cm91dGVTZXJ2aWNlLmRlZmluZVJvdXRlcyhyb3V0ZXMsIGZ1bmN0aW9uKHBheWxvYWQsIHBhcmFtcywgcGF0aCkge1xuXHRcdFx0dmFyIHVwZGF0ZSA9IGxhc3RVcGRhdGUgPSBmdW5jdGlvbihyb3V0ZVJlc29sdmVyLCBjb21wKSB7XG5cdFx0XHRcdGlmICh1cGRhdGUgIT09IGxhc3RVcGRhdGUpIHJldHVyblxuXHRcdFx0XHRjb21wb25lbnQgPSBjb21wICE9IG51bGwgJiYgKHR5cGVvZiBjb21wLnZpZXcgPT09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgY29tcCA9PT0gXCJmdW5jdGlvblwiKT8gY29tcCA6IFwiZGl2XCJcblx0XHRcdFx0YXR0cnMzID0gcGFyYW1zLCBjdXJyZW50UGF0aCA9IHBhdGgsIGxhc3RVcGRhdGUgPSBudWxsXG5cdFx0XHRcdHJlbmRlcjEgPSAocm91dGVSZXNvbHZlci5yZW5kZXIgfHwgaWRlbnRpdHkpLmJpbmQocm91dGVSZXNvbHZlcilcblx0XHRcdFx0cnVuMSgpXG5cdFx0XHR9XG5cdFx0XHRpZiAocGF5bG9hZC52aWV3IHx8IHR5cGVvZiBwYXlsb2FkID09PSBcImZ1bmN0aW9uXCIpIHVwZGF0ZSh7fSwgcGF5bG9hZClcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZiAocGF5bG9hZC5vbm1hdGNoKSB7XG5cdFx0XHRcdFx0UHJvbWlzZS5yZXNvbHZlKHBheWxvYWQub25tYXRjaChwYXJhbXMsIHBhdGgpKS50aGVuKGZ1bmN0aW9uKHJlc29sdmVkKSB7XG5cdFx0XHRcdFx0XHR1cGRhdGUocGF5bG9hZCwgcmVzb2x2ZWQpXG5cdFx0XHRcdFx0fSwgYmFpbClcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHVwZGF0ZShwYXlsb2FkLCBcImRpdlwiKVxuXHRcdFx0fVxuXHRcdH0sIGJhaWwpXG5cdFx0cmVkcmF3U2VydmljZTAuc3Vic2NyaWJlKHJvb3QsIHJ1bjEpXG5cdH1cblx0cm91dGUuc2V0ID0gZnVuY3Rpb24ocGF0aCwgZGF0YSwgb3B0aW9ucykge1xuXHRcdGlmIChsYXN0VXBkYXRlICE9IG51bGwpIG9wdGlvbnMgPSB7cmVwbGFjZTogdHJ1ZX1cblx0XHRsYXN0VXBkYXRlID0gbnVsbFxuXHRcdHJvdXRlU2VydmljZS5zZXRQYXRoKHBhdGgsIGRhdGEsIG9wdGlvbnMpXG5cdH1cblx0cm91dGUuZ2V0ID0gZnVuY3Rpb24oKSB7cmV0dXJuIGN1cnJlbnRQYXRofVxuXHRyb3V0ZS5wcmVmaXggPSBmdW5jdGlvbihwcmVmaXgwKSB7cm91dGVTZXJ2aWNlLnByZWZpeCA9IHByZWZpeDB9XG5cdHJvdXRlLmxpbmsgPSBmdW5jdGlvbih2bm9kZTEpIHtcblx0XHR2bm9kZTEuZG9tLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgcm91dGVTZXJ2aWNlLnByZWZpeCArIHZub2RlMS5hdHRycy5ocmVmKVxuXHRcdHZub2RlMS5kb20ub25jbGljayA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdGlmIChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5IHx8IGUuc2hpZnRLZXkgfHwgZS53aGljaCA9PT0gMikgcmV0dXJuXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KClcblx0XHRcdGUucmVkcmF3ID0gZmFsc2Vcblx0XHRcdHZhciBocmVmID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpXG5cdFx0XHRpZiAoaHJlZi5pbmRleE9mKHJvdXRlU2VydmljZS5wcmVmaXgpID09PSAwKSBocmVmID0gaHJlZi5zbGljZShyb3V0ZVNlcnZpY2UucHJlZml4Lmxlbmd0aClcblx0XHRcdHJvdXRlLnNldChocmVmLCB1bmRlZmluZWQsIHVuZGVmaW5lZClcblx0XHR9XG5cdH1cblx0cm91dGUucGFyYW0gPSBmdW5jdGlvbihrZXkzKSB7XG5cdFx0aWYodHlwZW9mIGF0dHJzMyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2Yga2V5MyAhPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGF0dHJzM1trZXkzXVxuXHRcdHJldHVybiBhdHRyczNcblx0fVxuXHRyZXR1cm4gcm91dGVcbn1cbm0ucm91dGUgPSBfMjAod2luZG93LCByZWRyYXdTZXJ2aWNlKVxubS53aXRoQXR0ciA9IGZ1bmN0aW9uKGF0dHJOYW1lLCBjYWxsYmFjazEsIGNvbnRleHQpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcblx0XHRjYWxsYmFjazEuY2FsbChjb250ZXh0IHx8IHRoaXMsIGF0dHJOYW1lIGluIGUuY3VycmVudFRhcmdldCA/IGUuY3VycmVudFRhcmdldFthdHRyTmFtZV0gOiBlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKSlcblx0fVxufVxudmFyIF8yOCA9IGNvcmVSZW5kZXJlcih3aW5kb3cpXG5tLnJlbmRlciA9IF8yOC5yZW5kZXJcbm0ucmVkcmF3ID0gcmVkcmF3U2VydmljZS5yZWRyYXdcbm0ucmVxdWVzdCA9IHJlcXVlc3RTZXJ2aWNlLnJlcXVlc3Rcbm0uanNvbnAgPSByZXF1ZXN0U2VydmljZS5qc29ucFxubS5wYXJzZVF1ZXJ5U3RyaW5nID0gcGFyc2VRdWVyeVN0cmluZ1xubS5idWlsZFF1ZXJ5U3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZ1xubS52ZXJzaW9uID0gXCIxLjEuMVwiXG5tLnZub2RlID0gVm5vZGVcbmlmICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiKSBtb2R1bGVbXCJleHBvcnRzXCJdID0gbVxuZWxzZSB3aW5kb3cubSA9IG1cbn0oKSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9taXRocmlsL21pdGhyaWwuanMiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5pbXBvcnQgTW9kZWwgZnJvbSAnLi9tb2RlbC5qcyc7XG5cbmltcG9ydCBzdHlsZXMgZnJvbSAnLi9zdHlsZXMuY3NzJztcblxuXG5jb25zdCBVbCA9IHtcbiAgdmlldzogdm5vZGUgPT4ge1xuICAgIHJldHVybiA8dWwgY2xhc3NOYW1lPSdtZGwtbGlzdCc+XG4gICAgICB7dm5vZGUuYXR0cnMuaW5uZXJ9XG4gICAgPC91bD5cbiAgfVxufTtcblxuY29uc3QgTGkgPSB7XG4gIHZpZXc6IHZub2RlID0+IHtcbiAgICByZXR1cm4gPGxpIGNsYXNzTmFtZT0nbWRsLWxpc3RfX2l0ZW0nPlxuICAgICAge3Zub2RlLmF0dHJzLmlubmVyfVxuICAgIDwvbGk+XG4gIH1cbn07XG5cbmNvbnN0IERldGFpbHMgPSB7XG4gIHZpZXc6IHZub2RlICA9PiB7XG4gICAgcmV0dXJuIDxkZXRhaWxzPlxuICAgICAgPHN1bW1hcnk+e3Zub2RlLmF0dHJzLnN1bW1hcnl9PC9zdW1tYXJ5PlxuICAgICAge3Zub2RlLmF0dHJzLmlubmVyfVxuICAgIDwvZGV0YWlscz5cbiAgfVxufTtcblxuY29uc3QgWWVhciA9IHtcbiAgdmlldzogdm5vZGUgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSB2bm9kZS5hdHRycy5kYXRhO1xuICAgIGNvbnN0IGlubmVyID0gZGF0YS5tb250aHMubWFwKGQgPT4ge1xuICAgICAgcmV0dXJuIDxVbCBpbm5lcj17PExpIGlubmVyPXs8TW9udGggZGF0YT17ZH0gLz59IC8+fSAvPlxuICAgIH0pO1xuICAgIHJldHVybiA8ZGl2IGlkPXtkYXRhLnllYXJ9PlxuICAgICAgPERldGFpbHMgc3VtbWFyeT17YCR7ZGF0YS55ZWFyfeW5tGB9IGlubmVyPXtpbm5lcn0gLz5cbiAgICA8L2Rpdj5cbiAgfVxufTtcblxuY29uc3QgTW9udGggPSB7XG4gIHZpZXc6IHZub2RlID0+IHtcbiAgICBjb25zdCBkYXRhID0gdm5vZGUuYXR0cnMuZGF0YTtcbiAgICBjb25zdCBpbm5lciA9IGRhdGEuZGF5cy5tYXAoZCA9PiB7XG4gICAgICByZXR1cm4gPFVsIGlubmVyPXs8TGkgaW5uZXI9ezxEYXkgZGF0YT17ZH0gLz59IC8+fSAvPlxuICAgIH0pO1xuICAgIHJldHVybiA8ZGl2IGlkPXtkYXRhLm1vbnRofT5cbiAgICAgIDxEZXRhaWxzIHN1bW1hcnk9e2Ake2RhdGEubW9udGh95pyIYH0gaW5uZXI9e2lubmVyfSAvPlxuICAgIDwvZGl2PlxuICB9XG59O1xuXG5jb25zdCBEYXkgPSB7XG4gIHZpZXc6IHZub2RlID0+IHtcbiAgICBjb25zdCBkYXRhID0gdm5vZGUuYXR0cnMuZGF0YTtcbiAgICBjb25zdCBpbm5lciA9IDxzcGFuPlxuICAgICAge2Ake2RhdGEuZGF5feaXpSBgfVxuICAgICAgPGEgaHJlZj17YC9hcnRpY2xlLyR7ZGF0YS5pZH1gfT5cbiAgICAgICAge2RhdGEudGl0bGV9XG4gICAgICA8L2E+XG4gICAgPC9zcGFuPlxuICAgIHJldHVybiA8TGkgaW5uZXI9e2lubmVyfSAvPlxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG9uaW5pdDogdm5vZGUgPT4ge1xuICAgIE1vZGVsLmZldGNoKCk7XG4gICAgdm5vZGUuc3RhdGUuYXJ0aWNsZUluZGV4ID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIE1vZGVsLmRhdGEubWFwKGQgPT4ge1xuICAgICAgICByZXR1cm4gPFVsIGlubmVyPXs8TGkgaW5uZXI9ezxZZWFyIGRhdGE9e2R9IC8+fSAvPn0gLz5cbiAgICAgIH0pO1xuICAgIH07XG4gIH0sXG4gIHZpZXc6IHZub2RlID0+IHtcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9J21kbC1ncmlkJz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdtZGwtY2VsbC0tMS1vZmZzZXQnIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbWRsLWNlbGwgbWRsLWNlbGwtLTEwLWNvbCc+XG4gICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgIGlmICghTW9kZWwuZmV0Y2hlZCkge1xuICAgICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdtZGwtc3Bpbm5lciBtZGwtanMtc3Bpbm5lciBpcy1hY3RpdmUnPjwvZGl2PlxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gPFVsIGlubmVyPXt2bm9kZS5zdGF0ZS5hcnRpY2xlSW5kZXgoKX0gLz5cbiAgICAgICAgfSkoKX1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9J21kbC1jZWxsLS0xLW9mZnNldCcgLz5cbiAgICA8L2Rpdj5cbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY29tcG9uZW50LmpzIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi9jb21wb25lbnQuanMnO1xuXG5cbm0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKSwgQ29tcG9uZW50KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2VudHJ5LmpzIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmNvbnN0IE1vZGVsID0ge1xuICBkYXRhOiBbXSxcbiAgZmV0Y2hlZDogZmFsc2UsXG4gIGZldGNoOiAoKSA9PiB7XG4gICAgcmV0dXJuIG0ucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL2FwaS9hcnRpY2xlcycsXG4gICAgfSkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBNb2RlbC5mZXRjaGVkID0gdHJ1ZTtcbiAgICAgIE1vZGVsLmRhdGEgPSByZXNwb25zZTtcbiAgICB9KTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgTW9kZWxcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL21vZGVsLmpzIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gcGxhY2VIb2xkZXJzQ291bnQgKGI2NCkge1xuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcbiAgLy8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuICAvLyByZXByZXNlbnQgb25lIGJ5dGVcbiAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG4gIC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2VcbiAgcmV0dXJuIGI2NFtsZW4gLSAyXSA9PT0gJz0nID8gMiA6IGI2NFtsZW4gLSAxXSA9PT0gJz0nID8gMSA6IDBcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuICByZXR1cm4gYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzQ291bnQoYjY0KVxufVxuXG5mdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG4gIHBsYWNlSG9sZGVycyA9IHBsYWNlSG9sZGVyc0NvdW50KGI2NClcblxuICBhcnIgPSBuZXcgQXJyKGxlbiAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgbCA9IHBsYWNlSG9sZGVycyA+IDAgPyBsZW4gLSA0IDogbGVuXG5cbiAgdmFyIEwgPSAwXG5cbiAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfCByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltMKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICsgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICsgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gKyBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgb3V0cHV0ID0gJydcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz09J1xuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMTBdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPSdcbiAgfVxuXG4gIHBhcnRzLnB1c2gob3V0cHV0KVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9iYXNlNjQtanMvaW5kZXguanMiLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuXG4ndXNlIHN0cmljdCdcblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxudmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuLypcbiAqIEV4cG9ydCBrTWF4TGVuZ3RoIGFmdGVyIHR5cGVkIGFycmF5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZC5cbiAqL1xuZXhwb3J0cy5rTWF4TGVuZ3RoID0ga01heExlbmd0aCgpXG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMSlcbiAgICBhcnIuX19wcm90b19fID0ge19fcHJvdG9fXzogVWludDhBcnJheS5wcm90b3R5cGUsIGZvbzogZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfX1cbiAgICByZXR1cm4gYXJyLmZvbygpID09PSA0MiAmJiAvLyB0eXBlZCBhcnJheSBpbnN0YW5jZXMgY2FuIGJlIGF1Z21lbnRlZFxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nICYmIC8vIGNocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICAgICAgICBhcnIuc3ViYXJyYXkoMSwgMSkuYnl0ZUxlbmd0aCA9PT0gMCAvLyBpZTEwIGhhcyBicm9rZW4gYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24ga01heExlbmd0aCAoKSB7XG4gIHJldHVybiBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVFxuICAgID8gMHg3ZmZmZmZmZlxuICAgIDogMHgzZmZmZmZmZlxufVxuXG5mdW5jdGlvbiBjcmVhdGVCdWZmZXIgKHRoYXQsIGxlbmd0aCkge1xuICBpZiAoa01heExlbmd0aCgpIDwgbGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgdHlwZWQgYXJyYXkgbGVuZ3RoJylcbiAgfVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoKVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICBpZiAodGhhdCA9PT0gbnVsbCkge1xuICAgICAgdGhhdCA9IG5ldyBCdWZmZXIobGVuZ3RoKVxuICAgIH1cbiAgICB0aGF0Lmxlbmd0aCA9IGxlbmd0aFxuICB9XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5mdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0lmIGVuY29kaW5nIGlzIHNwZWNpZmllZCB0aGVuIHRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUodGhpcywgYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKHRoaXMsIGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuLy8gVE9ETzogTGVnYWN5LCBub3QgbmVlZGVkIGFueW1vcmUuIFJlbW92ZSBpbiBuZXh0IG1ham9yIHZlcnNpb24uXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gZnJvbSAodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIHJldHVybiBmcm9tT2JqZWN0KHRoYXQsIHZhbHVlKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKG51bGwsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbmlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICBCdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG4gIEJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgICAgQnVmZmVyW1N5bWJvbC5zcGVjaWVzXSA9PT0gQnVmZmVyKSB7XG4gICAgLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgICAgdmFsdWU6IG51bGwsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG5lZ2F0aXZlJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAodGhhdCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2MobnVsbCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlICh0aGF0LCBzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgKytpKSB7XG4gICAgICB0aGF0W2ldID0gMFxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHRoYXQsIHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJlbmNvZGluZ1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgZW5jb2RpbmcnKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICB0aGF0ID0gdGhhdC5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGFycmF5LmJ5dGVMZW5ndGggLy8gdGhpcyB0aHJvd3MgaWYgYGFycmF5YCBpcyBub3QgYSB2YWxpZCBBcnJheUJ1ZmZlclxuXG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdvZmZzZXRcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ2xlbmd0aFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gYXJyYXlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21BcnJheUxpa2UodGhhdCwgYXJyYXkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIob2JqKSkge1xuICAgIHZhciBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuKVxuXG4gICAgaWYgKHRoYXQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhhdFxuICAgIH1cblxuICAgIG9iai5jb3B5KHRoYXQsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gdGhhdFxuICB9XG5cbiAgaWYgKG9iaikge1xuICAgIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICBvYmouYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHx8ICdsZW5ndGgnIGluIG9iaikge1xuICAgICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBpc25hbihvYmoubGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIDApXG4gICAgICB9XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh0aGF0LCBvYmopXG4gICAgfVxuXG4gICAgaWYgKG9iai50eXBlID09PSAnQnVmZmVyJyAmJiBpc0FycmF5KG9iai5kYXRhKSkge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqLmRhdGEpXG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksIG9yIGFycmF5LWxpa2Ugb2JqZWN0LicpXG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBrTWF4TGVuZ3RoKClgIGhlcmUgYmVjYXVzZSB0aGF0IGZhaWxzIHdoZW5cbiAgLy8gbGVuZ3RoIGlzIE5hTiAod2hpY2ggaXMgb3RoZXJ3aXNlIGNvZXJjZWQgdG8gemVyby4pXG4gIGlmIChsZW5ndGggPj0ga01heExlbmd0aCgpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gYWxsb2NhdGUgQnVmZmVyIGxhcmdlciB0aGFuIG1heGltdW0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3NpemU6IDB4JyArIGtNYXhMZW5ndGgoKS50b1N0cmluZygxNikgKyAnIGJ5dGVzJylcbiAgfVxuICByZXR1cm4gbGVuZ3RoIHwgMFxufVxuXG5mdW5jdGlvbiBTbG93QnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKCtsZW5ndGggIT0gbGVuZ3RoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZXFlcWVxXG4gICAgbGVuZ3RoID0gMFxuICB9XG4gIHJldHVybiBCdWZmZXIuYWxsb2MoK2xlbmd0aClcbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIgKGIpIHtcbiAgcmV0dXJuICEhKGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIWlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gICAgfVxuICAgIGJ1Zi5jb3B5KGJ1ZmZlciwgcG9zKVxuICAgIHBvcyArPSBidWYubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoc3RyaW5nKSkge1xuICAgIHJldHVybiBzdHJpbmcubGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldyA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgKEFycmF5QnVmZmVyLmlzVmlldyhzdHJpbmcpIHx8IHN0cmluZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSkge1xuICAgIHJldHVybiBzdHJpbmcuYnl0ZUxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHN0cmluZyA9ICcnICsgc3RyaW5nXG4gIH1cblxuICB2YXIgbGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAobGVuID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIFVzZSBhIGZvciBsb29wIHRvIGF2b2lkIHJlY3Vyc2lvblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICAvLyBObyBuZWVkIHRvIHZlcmlmeSB0aGF0IFwidGhpcy5sZW5ndGggPD0gTUFYX1VJTlQzMlwiIHNpbmNlIGl0J3MgYSByZWFkLW9ubHlcbiAgLy8gcHJvcGVydHkgb2YgYSB0eXBlZCBhcnJheS5cblxuICAvLyBUaGlzIGJlaGF2ZXMgbmVpdGhlciBsaWtlIFN0cmluZyBub3IgVWludDhBcnJheSBpbiB0aGF0IHdlIHNldCBzdGFydC9lbmRcbiAgLy8gdG8gdGhlaXIgdXBwZXIvbG93ZXIgYm91bmRzIGlmIHRoZSB2YWx1ZSBwYXNzZWQgaXMgb3V0IG9mIHJhbmdlLlxuICAvLyB1bmRlZmluZWQgaXMgaGFuZGxlZCBzcGVjaWFsbHkgYXMgcGVyIEVDTUEtMjYyIDZ0aCBFZGl0aW9uLFxuICAvLyBTZWN0aW9uIDEzLjMuMy43IFJ1bnRpbWUgU2VtYW50aWNzOiBLZXllZEJpbmRpbmdJbml0aWFsaXphdGlvbi5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgLy8gUmV0dXJuIGVhcmx5IGlmIHN0YXJ0ID4gdGhpcy5sZW5ndGguIERvbmUgaGVyZSB0byBwcmV2ZW50IHBvdGVudGlhbCB1aW50MzJcbiAgLy8gY29lcmNpb24gZmFpbCBiZWxvdy5cbiAgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoZW5kIDw9IDApIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIC8vIEZvcmNlIGNvZXJzaW9uIHRvIHVpbnQzMi4gVGhpcyB3aWxsIGFsc28gY29lcmNlIGZhbHNleS9OYU4gdmFsdWVzIHRvIDAuXG4gIGVuZCA+Pj49IDBcbiAgc3RhcnQgPj4+PSAwXG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIFRoZSBwcm9wZXJ0eSBpcyB1c2VkIGJ5IGBCdWZmZXIuaXNCdWZmZXJgIGFuZCBgaXMtYnVmZmVyYCAoaW4gU2FmYXJpIDUtNykgdG8gZGV0ZWN0XG4vLyBCdWZmZXIgaW5zdGFuY2VzLlxuQnVmZmVyLnByb3RvdHlwZS5faXNCdWZmZXIgPSB0cnVlXG5cbmZ1bmN0aW9uIHN3YXAgKGIsIG4sIG0pIHtcbiAgdmFyIGkgPSBiW25dXG4gIGJbbl0gPSBiW21dXG4gIGJbbV0gPSBpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDE2ID0gZnVuY3Rpb24gc3dhcDE2ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAzMiA9IGZ1bmN0aW9uIHN3YXAzMiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgNCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDMpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDIpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwNjQgPSBmdW5jdGlvbiBzd2FwNjQgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDggIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDY0LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDgpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyA3KVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyA2KVxuICAgIHN3YXAodGhpcywgaSArIDIsIGkgKyA1KVxuICAgIHN3YXAodGhpcywgaSArIDMsIGkgKyA0KVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCB8IDBcbiAgaWYgKGxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHNsb3dUb1N0cmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzIChiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTXG4gIGlmICh0aGlzLmxlbmd0aCA+IDApIHtcbiAgICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLm1hdGNoKC8uezJ9L2cpLmpvaW4oJyAnKVxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIHN0ciArICc+J1xufVxuXG5CdWZmZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlICh0YXJnZXQsIHN0YXJ0LCBlbmQsIHRoaXNTdGFydCwgdGhpc0VuZCkge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIH1cblxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHRhcmdldCA/IHRhcmdldC5sZW5ndGggOiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1N0YXJ0ID0gMFxuICB9XG4gIGlmICh0aGlzRW5kID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzRW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChzdGFydCA8IDAgfHwgZW5kID4gdGFyZ2V0Lmxlbmd0aCB8fCB0aGlzU3RhcnQgPCAwIHx8IHRoaXNFbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdvdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kICYmIHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kKSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cbiAgaWYgKHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAxXG4gIH1cblxuICBzdGFydCA+Pj49IDBcbiAgZW5kID4+Pj0gMFxuICB0aGlzU3RhcnQgPj4+PSAwXG4gIHRoaXNFbmQgPj4+PSAwXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCkgcmV0dXJuIDBcblxuICB2YXIgeCA9IHRoaXNFbmQgLSB0aGlzU3RhcnRcbiAgdmFyIHkgPSBlbmQgLSBzdGFydFxuICB2YXIgbGVuID0gTWF0aC5taW4oeCwgeSlcblxuICB2YXIgdGhpc0NvcHkgPSB0aGlzLnNsaWNlKHRoaXNTdGFydCwgdGhpc0VuZClcbiAgdmFyIHRhcmdldENvcHkgPSB0YXJnZXQuc2xpY2Uoc3RhcnQsIGVuZClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKHRoaXNDb3B5W2ldICE9PSB0YXJnZXRDb3B5W2ldKSB7XG4gICAgICB4ID0gdGhpc0NvcHlbaV1cbiAgICAgIHkgPSB0YXJnZXRDb3B5W2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuLy8gRmluZHMgZWl0aGVyIHRoZSBmaXJzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPj0gYGJ5dGVPZmZzZXRgLFxuLy8gT1IgdGhlIGxhc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0IDw9IGBieXRlT2Zmc2V0YC5cbi8vXG4vLyBBcmd1bWVudHM6XG4vLyAtIGJ1ZmZlciAtIGEgQnVmZmVyIHRvIHNlYXJjaFxuLy8gLSB2YWwgLSBhIHN0cmluZywgQnVmZmVyLCBvciBudW1iZXJcbi8vIC0gYnl0ZU9mZnNldCAtIGFuIGluZGV4IGludG8gYGJ1ZmZlcmA7IHdpbGwgYmUgY2xhbXBlZCB0byBhbiBpbnQzMlxuLy8gLSBlbmNvZGluZyAtIGFuIG9wdGlvbmFsIGVuY29kaW5nLCByZWxldmFudCBpcyB2YWwgaXMgYSBzdHJpbmdcbi8vIC0gZGlyIC0gdHJ1ZSBmb3IgaW5kZXhPZiwgZmFsc2UgZm9yIGxhc3RJbmRleE9mXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsSW5kZXhPZiAoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgLy8gRW1wdHkgYnVmZmVyIG1lYW5zIG5vIG1hdGNoXG4gIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSByZXR1cm4gLTFcblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldFxuICBpZiAodHlwZW9mIGJ5dGVPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBieXRlT2Zmc2V0XG4gICAgYnl0ZU9mZnNldCA9IDBcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikge1xuICAgIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSB7XG4gICAgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIH1cbiAgYnl0ZU9mZnNldCA9ICtieXRlT2Zmc2V0ICAvLyBDb2VyY2UgdG8gTnVtYmVyLlxuICBpZiAoaXNOYU4oYnl0ZU9mZnNldCkpIHtcbiAgICAvLyBieXRlT2Zmc2V0OiBpdCBpdCdzIHVuZGVmaW5lZCwgbnVsbCwgTmFOLCBcImZvb1wiLCBldGMsIHNlYXJjaCB3aG9sZSBidWZmZXJcbiAgICBieXRlT2Zmc2V0ID0gZGlyID8gMCA6IChidWZmZXIubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0OiBuZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggKyBieXRlT2Zmc2V0XG4gIGlmIChieXRlT2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBpZiAoZGlyKSByZXR1cm4gLTFcbiAgICBlbHNlIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoIC0gMVxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAwKSB7XG4gICAgaWYgKGRpcikgYnl0ZU9mZnNldCA9IDBcbiAgICBlbHNlIHJldHVybiAtMVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIHZhbFxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgLy8gRmluYWxseSwgc2VhcmNoIGVpdGhlciBpbmRleE9mIChpZiBkaXIgaXMgdHJ1ZSkgb3IgbGFzdEluZGV4T2ZcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJlxuICAgICAgICB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKHN0ckxlbiAlIDIgIT09IDApIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBsYXRpbjFXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCB8IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICAvLyBsZWdhY3kgd3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpIC0gcmVtb3ZlIGluIHYwLjEzXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERikgPyAzXG4gICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2kgKyAxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47ICsraSkge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJ1ZmZlclwiIGFyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlVUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVVSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDIpOyBpIDwgajsgKytpKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCA0KTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSAwXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSAtIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSArIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4N2YsIC0weDgwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5mdW5jdGlvbiBjaGVja0lFRUU3NTQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuZnVuY3Rpb24gd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA0LCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiB3cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoZW5kIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCArIHN0YXJ0XG4gIH1cblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcbiAgdmFyIGlcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHN0YXJ0IDwgdGFyZ2V0U3RhcnQgJiYgdGFyZ2V0U3RhcnQgPCBlbmQpIHtcbiAgICAvLyBkZXNjZW5kaW5nIGNvcHkgZnJvbSBlbmRcbiAgICBmb3IgKGkgPSBsZW4gLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSBpZiAobGVuIDwgMTAwMCB8fCAhQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBhc2NlbmRpbmcgY29weSBmcm9tIHN0YXJ0XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBVaW50OEFycmF5LnByb3RvdHlwZS5zZXQuY2FsbChcbiAgICAgIHRhcmdldCxcbiAgICAgIHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSxcbiAgICAgIHRhcmdldFN0YXJ0XG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIGxlblxufVxuXG4vLyBVc2FnZTpcbi8vICAgIGJ1ZmZlci5maWxsKG51bWJlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoYnVmZmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChzdHJpbmdbLCBvZmZzZXRbLCBlbmRdXVssIGVuY29kaW5nXSlcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uIGZpbGwgKHZhbCwgc3RhcnQsIGVuZCwgZW5jb2RpbmcpIHtcbiAgLy8gSGFuZGxlIHN0cmluZyBjYXNlczpcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHR5cGVvZiBzdGFydCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gc3RhcnRcbiAgICAgIHN0YXJ0ID0gMFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbmQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IGVuZFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9XG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciBjb2RlID0gdmFsLmNoYXJDb2RlQXQoMClcbiAgICAgIGlmIChjb2RlIDwgMjU2KSB7XG4gICAgICAgIHZhbCA9IGNvZGVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZW5jb2RpbmcgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnICYmICFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAyNTVcbiAgfVxuXG4gIC8vIEludmFsaWQgcmFuZ2VzIGFyZSBub3Qgc2V0IHRvIGEgZGVmYXVsdCwgc28gY2FuIHJhbmdlIGNoZWNrIGVhcmx5LlxuICBpZiAoc3RhcnQgPCAwIHx8IHRoaXMubGVuZ3RoIDwgc3RhcnQgfHwgdGhpcy5sZW5ndGggPCBlbmQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignT3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgc3RhcnQgPSBzdGFydCA+Pj4gMFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHRoaXMubGVuZ3RoIDogZW5kID4+PiAwXG5cbiAgaWYgKCF2YWwpIHZhbCA9IDBcblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgICB0aGlzW2ldID0gdmFsXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBieXRlcyA9IEJ1ZmZlci5pc0J1ZmZlcih2YWwpXG4gICAgICA/IHZhbFxuICAgICAgOiB1dGY4VG9CeXRlcyhuZXcgQnVmZmVyKHZhbCwgZW5jb2RpbmcpLnRvU3RyaW5nKCkpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGZvciAoaSA9IDA7IGkgPCBlbmQgLSBzdGFydDsgKytpKSB7XG4gICAgICB0aGlzW2kgKyBzdGFydF0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxudmFyIElOVkFMSURfQkFTRTY0X1JFID0gL1teK1xcLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0cmluZ3RyaW0oc3RyKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCAnJylcbiAgLy8gTm9kZSBjb252ZXJ0cyBzdHJpbmdzIHdpdGggbGVuZ3RoIDwgMiB0byAnJ1xuICBpZiAoc3RyLmxlbmd0aCA8IDIpIHJldHVybiAnJ1xuICAvLyBOb2RlIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBiYXNlNjQgc3RyaW5ncyAobWlzc2luZyB0cmFpbGluZyA9PT0pLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgd2hpbGUgKHN0ci5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgc3RyID0gc3RyICsgJz0nXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHJpbmcsIHVuaXRzKSB7XG4gIHVuaXRzID0gdW5pdHMgfHwgSW5maW5pdHlcbiAgdmFyIGNvZGVQb2ludFxuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuICB2YXIgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcbiAgdmFyIGJ5dGVzID0gW11cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29kZVBvaW50ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcblxuICAgIC8vIGlzIHN1cnJvZ2F0ZSBjb21wb25lbnRcbiAgICBpZiAoY29kZVBvaW50ID4gMHhEN0ZGICYmIGNvZGVQb2ludCA8IDB4RTAwMCkge1xuICAgICAgLy8gbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICghbGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgICAvLyBubyBsZWFkIHlldFxuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhEQkZGKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCB0cmFpbFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIC8vIHVucGFpcmVkIGxlYWRcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWQgbGVhZFxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gMiBsZWFkcyBpbiBhIHJvd1xuICAgICAgaWYgKGNvZGVQb2ludCA8IDB4REMwMCkge1xuICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyB2YWxpZCBzdXJyb2dhdGUgcGFpclxuICAgICAgY29kZVBvaW50ID0gKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDAgPDwgMTAgfCBjb2RlUG9pbnQgLSAweERDMDApICsgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0ciwgdW5pdHMpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcblxuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NGNsZWFuKHN0cikpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGlzbmFuICh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gdmFsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VsZi1jb21wYXJlXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L2J1ZmZlci9pbmRleC5qcyIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuICB2YXIgYmFzZTY0ID0gbmV3IEJ1ZmZlcihKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKS50b1N0cmluZygnYmFzZTY0Jyk7XG4gIHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cbiAgcmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vaWVlZTc1NC9pbmRleC5qcyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9pc2FycmF5L2luZGV4LmpzIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvVXNlcnMvYm9rdS93b3JrL2Jsb2cvYmxvZ19tYW5hZ2VyL2Jsb2dfbWFuYWdlci9zdGF0aWNzL2pzL34vcHJvY2Vzcy9icm93c2VyLmpzIiwiKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKGdsb2JhbC5zZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXh0SGFuZGxlID0gMTsgLy8gU3BlYyBzYXlzIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgdmFyIHRhc2tzQnlIYW5kbGUgPSB7fTtcbiAgICB2YXIgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgdmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbiAgICB2YXIgcmVnaXN0ZXJJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbiAgICAgIC8vIENhbGxiYWNrIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiBvciBhIHN0cmluZ1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uKFwiXCIgKyBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICAvLyBDb3B5IGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XG4gICAgICB9XG4gICAgICAvLyBTdG9yZSBhbmQgcmVnaXN0ZXIgdGhlIHRhc2tcbiAgICAgIHZhciB0YXNrID0geyBjYWxsYmFjazogY2FsbGJhY2ssIGFyZ3M6IGFyZ3MgfTtcbiAgICAgIHRhc2tzQnlIYW5kbGVbbmV4dEhhbmRsZV0gPSB0YXNrO1xuICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUobmV4dEhhbmRsZSk7XG4gICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIHZhciBhcmdzID0gdGFzay5hcmdzO1xuICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGUpIHtcbiAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ0FUYXNrKSB7XG4gICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcnVuKHRhc2spO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1bklmUHJlc2VudChoYW5kbGUpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcbiAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgICAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhbid0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2VcbiAgICAgICAgLy8gKiBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9jb21tcy5odG1sI2Nyb3NzRG9jdW1lbnRNZXNzYWdlc1xuXG4gICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG4gICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoK2V2ZW50LmRhdGEuc2xpY2UobWVzc2FnZVByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShtZXNzYWdlUHJlZml4ICsgaGFuZGxlLCBcIipcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSWYgc3VwcG9ydGVkLCB3ZSBzaG91bGQgYXR0YWNoIHRvIHRoZSBwcm90b3R5cGUgb2YgZ2xvYmFsLCBzaW5jZSB0aGF0IGlzIHdoZXJlIHNldFRpbWVvdXQgZXQgYWwuIGxpdmUuXG4gICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG4gICAgLy8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBlLmcuIGJyb3dzZXJpZnkgZW52aXJvbm1lbnRzLlxuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuICAgICAgICBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG4gICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG4gICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG4gICAgICAgIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG4gICAgICAgIC8vIEZvciBJRSA24oCTOFxuICAgICAgICBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpO1xuICAgIH1cblxuICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICBhdHRhY2hUby5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xufSh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIiA/IHR5cGVvZiBnbG9iYWwgPT09IFwidW5kZWZpbmVkXCIgPyB0aGlzIDogZ2xvYmFsIDogc2VsZikpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9ib2t1L3dvcmsvYmxvZy9ibG9nX21hbmFnZXIvYmxvZ19tYW5hZ2VyL3N0YXRpY3MvanMvfi9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzIiwiXG4vKipcbiAqIFdoZW4gc291cmNlIG1hcHMgYXJlIGVuYWJsZWQsIGBzdHlsZS1sb2FkZXJgIHVzZXMgYSBsaW5rIGVsZW1lbnQgd2l0aCBhIGRhdGEtdXJpIHRvXG4gKiBlbWJlZCB0aGUgY3NzIG9uIHRoZSBwYWdlLiBUaGlzIGJyZWFrcyBhbGwgcmVsYXRpdmUgdXJscyBiZWNhdXNlIG5vdyB0aGV5IGFyZSByZWxhdGl2ZSB0byBhXG4gKiBidW5kbGUgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBwYWdlLlxuICpcbiAqIE9uZSBzb2x1dGlvbiBpcyB0byBvbmx5IHVzZSBmdWxsIHVybHMsIGJ1dCB0aGF0IG1heSBiZSBpbXBvc3NpYmxlLlxuICpcbiAqIEluc3RlYWQsIHRoaXMgZnVuY3Rpb24gXCJmaXhlc1wiIHRoZSByZWxhdGl2ZSB1cmxzIHRvIGJlIGFic29sdXRlIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBwYWdlIGxvY2F0aW9uLlxuICpcbiAqIEEgcnVkaW1lbnRhcnkgdGVzdCBzdWl0ZSBpcyBsb2NhdGVkIGF0IGB0ZXN0L2ZpeFVybHMuanNgIGFuZCBjYW4gYmUgcnVuIHZpYSB0aGUgYG5wbSB0ZXN0YCBjb21tYW5kLlxuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MpIHtcbiAgLy8gZ2V0IGN1cnJlbnQgbG9jYXRpb25cbiAgdmFyIGxvY2F0aW9uID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cubG9jYXRpb247XG5cbiAgaWYgKCFsb2NhdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpeFVybHMgcmVxdWlyZXMgd2luZG93LmxvY2F0aW9uXCIpO1xuICB9XG5cblx0Ly8gYmxhbmsgb3IgbnVsbD9cblx0aWYgKCFjc3MgfHwgdHlwZW9mIGNzcyAhPT0gXCJzdHJpbmdcIikge1xuXHQgIHJldHVybiBjc3M7XG4gIH1cblxuICB2YXIgYmFzZVVybCA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdDtcbiAgdmFyIGN1cnJlbnREaXIgPSBiYXNlVXJsICsgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvW15cXC9dKiQvLCBcIi9cIik7XG5cblx0Ly8gY29udmVydCBlYWNoIHVybCguLi4pXG5cdC8qXG5cdFRoaXMgcmVndWxhciBleHByZXNzaW9uIGlzIGp1c3QgYSB3YXkgdG8gcmVjdXJzaXZlbHkgbWF0Y2ggYnJhY2tldHMgd2l0aGluXG5cdGEgc3RyaW5nLlxuXG5cdCAvdXJsXFxzKlxcKCAgPSBNYXRjaCBvbiB0aGUgd29yZCBcInVybFwiIHdpdGggYW55IHdoaXRlc3BhY2UgYWZ0ZXIgaXQgYW5kIHRoZW4gYSBwYXJlbnNcblx0ICAgKCAgPSBTdGFydCBhIGNhcHR1cmluZyBncm91cFxuXHQgICAgICg/OiAgPSBTdGFydCBhIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAgICAgW14pKF0gID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICg/OiAgPSBTdGFydCBhbm90aGVyIG5vbi1jYXB0dXJpbmcgZ3JvdXBzXG5cdCAgICAgICAgICAgICAgICAgW14pKF0rICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgICAgICBbXikoXSogID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgXFwpICA9IE1hdGNoIGEgZW5kIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICApICA9IEVuZCBHcm91cFxuICAgICAgICAgICAgICAqXFwpID0gTWF0Y2ggYW55dGhpbmcgYW5kIHRoZW4gYSBjbG9zZSBwYXJlbnNcbiAgICAgICAgICApICA9IENsb3NlIG5vbi1jYXB0dXJpbmcgZ3JvdXBcbiAgICAgICAgICAqICA9IE1hdGNoIGFueXRoaW5nXG4gICAgICAgKSAgPSBDbG9zZSBjYXB0dXJpbmcgZ3JvdXBcblx0IFxcKSAgPSBNYXRjaCBhIGNsb3NlIHBhcmVuc1xuXG5cdCAvZ2kgID0gR2V0IGFsbCBtYXRjaGVzLCBub3QgdGhlIGZpcnN0LiAgQmUgY2FzZSBpbnNlbnNpdGl2ZS5cblx0ICovXG5cdHZhciBmaXhlZENzcyA9IGNzcy5yZXBsYWNlKC91cmxcXHMqXFwoKCg/OlteKShdfFxcKCg/OlteKShdK3xcXChbXikoXSpcXCkpKlxcKSkqKVxcKS9naSwgZnVuY3Rpb24oZnVsbE1hdGNoLCBvcmlnVXJsKSB7XG5cdFx0Ly8gc3RyaXAgcXVvdGVzIChpZiB0aGV5IGV4aXN0KVxuXHRcdHZhciB1bnF1b3RlZE9yaWdVcmwgPSBvcmlnVXJsXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXlwiKC4qKVwiJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KVxuXHRcdFx0LnJlcGxhY2UoL14nKC4qKSckLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pO1xuXG5cdFx0Ly8gYWxyZWFkeSBhIGZ1bGwgdXJsPyBubyBjaGFuZ2Vcblx0XHRpZiAoL14oI3xkYXRhOnxodHRwOlxcL1xcL3xodHRwczpcXC9cXC98ZmlsZTpcXC9cXC9cXC8pL2kudGVzdCh1bnF1b3RlZE9yaWdVcmwpKSB7XG5cdFx0ICByZXR1cm4gZnVsbE1hdGNoO1xuXHRcdH1cblxuXHRcdC8vIGNvbnZlcnQgdGhlIHVybCB0byBhIGZ1bGwgdXJsXG5cdFx0dmFyIG5ld1VybDtcblxuXHRcdGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi8vXCIpID09PSAwKSB7XG5cdFx0ICBcdC8vVE9ETzogc2hvdWxkIHdlIGFkZCBwcm90b2NvbD9cblx0XHRcdG5ld1VybCA9IHVucXVvdGVkT3JpZ1VybDtcblx0XHR9IGVsc2UgaWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgdXJsXG5cdFx0XHRuZXdVcmwgPSBiYXNlVXJsICsgdW5xdW90ZWRPcmlnVXJsOyAvLyBhbHJlYWR5IHN0YXJ0cyB3aXRoICcvJ1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byBjdXJyZW50IGRpcmVjdG9yeVxuXHRcdFx0bmV3VXJsID0gY3VycmVudERpciArIHVucXVvdGVkT3JpZ1VybC5yZXBsYWNlKC9eXFwuXFwvLywgXCJcIik7IC8vIFN0cmlwIGxlYWRpbmcgJy4vJ1xuXHRcdH1cblxuXHRcdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgdXJsKC4uLilcblx0XHRyZXR1cm4gXCJ1cmwoXCIgKyBKU09OLnN0cmluZ2lmeShuZXdVcmwpICsgXCIpXCI7XG5cdH0pO1xuXG5cdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgY3NzXG5cdHJldHVybiBmaXhlZENzcztcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L3N0eWxlLWxvYWRlci9maXhVcmxzLmpzIiwidmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xuXG4vLyBET00gQVBJcywgZm9yIGNvbXBsZXRlbmVzc1xuXG5leHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhclRpbWVvdXQpO1xufTtcbmV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG59O1xuZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkge1xuICBpZiAodGltZW91dCkge1xuICAgIHRpbWVvdXQuY2xvc2UoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuICB0aGlzLl9pZCA9IGlkO1xuICB0aGlzLl9jbGVhckZuID0gY2xlYXJGbjtcbn1cblRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblRpbWVvdXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csIHRoaXMuX2lkKTtcbn07XG5cbi8vIERvZXMgbm90IHN0YXJ0IHRoZSB0aW1lLCBqdXN0IHNldHMgdXAgdGhlIG1lbWJlcnMgbmVlZGVkLlxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gbXNlY3M7XG59O1xuXG5leHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG59O1xuXG5leHBvcnRzLl91bnJlZkFjdGl2ZSA9IGV4cG9ydHMuYWN0aXZlID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cbiAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG4gIGlmIChtc2VjcyA+PSAwKSB7XG4gICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcbiAgICAgICAgaXRlbS5fb25UaW1lb3V0KCk7XG4gICAgfSwgbXNlY3MpO1xuICB9XG59O1xuXG4vLyBzZXRpbW1lZGlhdGUgYXR0YWNoZXMgaXRzZWxmIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5yZXF1aXJlKFwic2V0aW1tZWRpYXRlXCIpO1xuZXhwb3J0cy5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG5leHBvcnRzLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuXzF5eXFuQnZQRThuSnhub21jS2s5OXZ7cG9zaXRpb246Zml4ZWQ7cmlnaHQ6MDtib3R0b206MH1cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5leHBvcnRzLmxvY2FscyA9IHtcblx0XCJmaXhlZEJvdHRvbVwiOiBcIl8xeXlxbkJ2UEU4bkp4bm9tY0trOTl2XCJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L2Nzcy1sb2FkZXI/e1wibW9kdWxlc1wiOnRydWUsXCJtaW5pbWl6ZVwiOnRydWUsXCJjYW1lbENhc2VcIjp0cnVlfSEuL3N0eWxlcy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG52YXIgc3R5bGVzSW5Eb20gPSB7fSxcblx0bWVtb2l6ZSA9IGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIG1lbW87XG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRyZXR1cm4gbWVtbztcblx0XHR9O1xuXHR9LFxuXHRpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbigpIHtcblx0XHQvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuXHRcdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0XHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyIFxuXHRcdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHRcdC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIvaXNzdWVzLzE3N1xuXHRcdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcblx0fSksXG5cdGdldEVsZW1lbnQgPSAoZnVuY3Rpb24oZm4pIHtcblx0XHR2YXIgbWVtbyA9IHt9O1xuXHRcdHJldHVybiBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdFx0aWYgKHR5cGVvZiBtZW1vW3NlbGVjdG9yXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRtZW1vW3NlbGVjdG9yXSA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1lbW9bc2VsZWN0b3JdXG5cdFx0fTtcblx0fSkoZnVuY3Rpb24gKHN0eWxlVGFyZ2V0KSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc3R5bGVUYXJnZXQpXG5cdH0pLFxuXHRzaW5nbGV0b25FbGVtZW50ID0gbnVsbCxcblx0c2luZ2xldG9uQ291bnRlciA9IDAsXG5cdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW10sXG5cdGZpeFVybHMgPSByZXF1aXJlKFwiLi9maXhVcmxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRJbnRvID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCk7XG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKylcblx0XHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyhsaXN0KSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKVxuXHRcdFx0c3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlXG5cdFx0XHRuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCkge1xuXHR2YXIgc3R5bGVUYXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblx0aWYgKCFzdHlsZVRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wW3N0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0c3R5bGVUYXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgc3R5bGVUYXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHRzdHlsZVRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlVGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cdFx0fVxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGVFbGVtZW50KTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0c3R5bGVUYXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuXHRzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHR2YXIgaWR4ID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZUVsZW1lbnQpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSB7XG5cdHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblxuXHRhdHRhY2hUYWdBdHRycyhzdHlsZUVsZW1lbnQsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KTtcblx0cmV0dXJuIHN0eWxlRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucykge1xuXHR2YXIgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGF0dGFjaFRhZ0F0dHJzKGxpbmtFbGVtZW50LCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmtFbGVtZW50KTtcblx0cmV0dXJuIGxpbmtFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBhdHRhY2hUYWdBdHRycyhlbGVtZW50LCBhdHRycykge1xuXHRPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVFbGVtZW50LCB1cGRhdGUsIHJlbW92ZTtcblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblx0XHRzdHlsZUVsZW1lbnQgPSBzaW5nbGV0b25FbGVtZW50IHx8IChzaW5nbGV0b25FbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cdH0gZWxzZSBpZihvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG5cdFx0XHRpZihzdHlsZUVsZW1lbnQuaHJlZilcblx0XHRcdFx0VVJMLnJldm9rZU9iamVjdFVSTChzdHlsZUVsZW1lbnQuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xuXHRcdGlmKG5ld09iaikge1xuXHRcdFx0aWYobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnKHN0eWxlRWxlbWVudCwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGVFbGVtZW50LmNoaWxkTm9kZXM7XG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGVFbGVtZW50Lmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZUVsZW1lbnQsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayhsaW5rRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHQvKiBJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0YW5kIHRoZXJlIGlzIG5vIHB1YmxpY1BhdGggZGVmaW5lZCB0aGVuIGxldHMgdHVybiBjb252ZXJ0VG9BYnNvbHV0ZVVybHNcblx0b24gYnkgZGVmYXVsdC4gIE90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgb3B0aW9uXG5cdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscyl7XG5cdFx0Y3NzID0gZml4VXJscyhjc3MpO1xuXHR9XG5cblx0aWYoc291cmNlTWFwKSB7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblxuXHR2YXIgb2xkU3JjID0gbGlua0VsZW1lbnQuaHJlZjtcblxuXHRsaW5rRWxlbWVudC5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpXG5cdFx0VVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gL1VzZXJzL2Jva3Uvd29yay9ibG9nL2Jsb2dfbWFuYWdlci9ibG9nX21hbmFnZXIvc3RhdGljcy9qcy9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi9zdHlsZXMuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuL3N0eWxlcy5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuL3N0eWxlcy5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3R5bGVzLmNzc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==