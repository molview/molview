//
// ChemDoodle Web Components 6.0.1
//
// http://web.chemdoodle.com
//
// Copyright 2009-2014 iChemLabs, LLC.  All rights reserved.
//
// The ChemDoodle Web Components library is licensed under version 3
// of the GNU GENERAL PUBLIC LICENSE.
//
// You may redistribute it and/or modify it under the terms of the
// GNU General Public License as published by the Free Software Foundation,
// either version 3 of the License, or (at your option) any later version.
//
// As an exception to the GPL, you may distribute this packed form of
// the code without the copy of the GPL license normally required,
// provided you include this license notice and a URL through which
// recipients can access the corresponding unpacked source code. 
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// Please contact iChemLabs <http://www.ichemlabs.com/contact-us> for
// alternate licensing options.
//
var ChemDoodle = function() {
  var b = {
      iChemLabs: {},
      informatics: {},
      io: {},
      lib: {},
      structures: {}
  };
  b.structures.d2 = {};
  b.structures.d3 = {};
  b.getVersion = function() {
      return "6.0.1"
  };
  return b
}();
(function(b, j, n) {
  function l(x) {
      var c = x.length,
          a = m.type(x);
      return m.isWindow(x) ? !1 : 1 === x.nodeType && c ? !0 : "array" === a || "function" !== a && (0 === c || "number" === typeof c && 0 < c && c - 1 in x)
  }

  function h(x, c, a, k) {
      if (m.acceptData(x)) {
          var d = m.expando,
              b = x.nodeType,
              f = b ? m.cache : x,
              g = b ? x[d] : x[d] && d;
          if (g && f[g] && (k || f[g].data) || !(a === n && "string" === typeof c)) {
              g || (g = b ? x[d] = ha.pop() || m.guid++ : d);
              f[g] || (f[g] = b ? {} : {
                  toJSON: m.noop
              });
              if ("object" === typeof c || "function" === typeof c) k ? f[g] = m.extend(f[g], c) : f[g].data = m.extend(f[g].data,
                  c);
              x = f[g];
              k || (x.data || (x.data = {}), x = x.data);
              a !== n && (x[m.camelCase(c)] = a);
              "string" === typeof c ? (a = x[c], null == a && (a = x[m.camelCase(c)])) : a = x;
              return a
          }
      }
  }

  function e(x, c, k) {
      if (m.acceptData(x)) {
          var d, b, f = x.nodeType,
              g = f ? m.cache : x,
              r = f ? x[m.expando] : m.expando;
          if (g[r]) {
              if (c && (d = k ? g[r] : g[r].data)) {
                  m.isArray(c) ? c = c.concat(m.map(c, m.camelCase)) : c in d ? c = [c] : (c = m.camelCase(c), c = c in d ? [c] : c.split(" "));
                  for (b = c.length; b--;) delete d[c[b]];
                  if (k ? !a(d) : !m.isEmptyObject(d)) return
              }
              if (!k && (delete g[r].data, !a(g[r]))) return;
              f ? m.cleanData([x], !0) : m.support.deleteExpando || g != g.window ? delete g[r] : g[r] = null
          }
      }
  }

  function g(x, c, a) {
      if (a === n && 1 === x.nodeType)
          if (a = "data-" + c.replace(zc, "-$1").toLowerCase(), a = x.getAttribute(a), "string" === typeof a) {
              try {
                  a = "true" === a ? !0 : "false" === a ? !1 : "null" === a ? null : +a + "" === a ? +a : Ac.test(a) ? m.parseJSON(a) : a
              } catch (k) {}
              m.data(x, c, a)
          } else a = n;
      return a
  }

  function a(x) {
      for (var c in x)
          if (!("data" === c && m.isEmptyObject(x[c])) && "toJSON" !== c) return !1;
      return !0
  }

  function d() {
      return !0
  }

  function r() {
      return !1
  }

  function f() {
      try {
          return J.activeElement
      } catch (x) {}
  }

  function p(x, c) {
      do x = x[c]; while (x && 1 !== x.nodeType);
      return x
  }

  function o(x, c, a) {
      if (m.isFunction(c)) return m.grep(x, function(x, k) {
          return !!c.call(x, k, x) !== a
      });
      if (c.nodeType) return m.grep(x, function(x) {
          return x === c !== a
      });
      if ("string" === typeof c) {
          if (Bc.test(c)) return m.filter(c, x, a);
          c = m.filter(c, x)
      }
      return m.grep(x, function(x) {
          return 0 <= m.inArray(x, c) !== a
      })
  }

  function w(x) {
      var c = Ob.split("|");
      x = x.createDocumentFragment();
      if (x.createElement)
          for (; c.length;) x.createElement(c.pop());
      return x
  }

  function A(x, c) {
      return m.nodeName(x,
          "table") && m.nodeName(1 === c.nodeType ? c : c.firstChild, "tr") ? x.getElementsByTagName("tbody")[0] || x.appendChild(x.ownerDocument.createElement("tbody")) : x
  }

  function q(x) {
      x.type = (null !== m.find.attr(x, "type")) + "/" + x.type;
      return x
  }

  function t(x) {
      var c = Cc.exec(x.type);
      c ? x.type = c[1] : x.removeAttribute("type");
      return x
  }

  function u(x, c) {
      for (var a, k = 0; null != (a = x[k]); k++) m._data(a, "globalEval", !c || m._data(c[k], "globalEval"))
  }

  function v(x, c) {
      if (1 === c.nodeType && m.hasData(x)) {
          var a, k, d;
          k = m._data(x);
          var b = m._data(c, k),
              f = k.events;
          if (f)
              for (a in delete b.handle, b.events = {}, f) {
                  k = 0;
                  for (d = f[a].length; k < d; k++) m.event.add(c, a, f[a][k])
              }
          b.data && (b.data = m.extend({}, b.data))
      }
  }

  function z(x, c) {
      var a, k, d = 0,
          b = typeof x.getElementsByTagName !== $ ? x.getElementsByTagName(c || "*") : typeof x.querySelectorAll !== $ ? x.querySelectorAll(c || "*") : n;
      if (!b) {
          b = [];
          for (a = x.childNodes || x; null != (k = a[d]); d++) !c || m.nodeName(k, c) ? b.push(k) : m.merge(b, z(k, c))
      }
      return c === n || c && m.nodeName(x, c) ? m.merge([x], b) : b
  }

  function y(x) {
      nb.test(x.type) && (x.defaultChecked =
          x.checked)
  }

  function B(x, c) {
      if (c in x) return c;
      for (var a = c.charAt(0).toUpperCase() + c.slice(1), k = c, d = Pb.length; d--;)
          if (c = Pb[d] + a, c in x) return c;
      return k
  }

  function c(x, c) {
      x = c || x;
      return "none" === m.css(x, "display") || !m.contains(x.ownerDocument, x)
  }

  function k(x, a) {
      for (var k, d, b, f = [], g = 0, r = x.length; g < r; g++)
          if (d = x[g], d.style)
              if (f[g] = m._data(d, "olddisplay"), k = d.style.display, a) !f[g] && "none" === k && (d.style.display = ""), "" === d.style.display && c(d) && (f[g] = m._data(d, "olddisplay", F(d.nodeName)));
              else if (!f[g] && (b = c(d),
              k && "none" !== k || !b)) m._data(d, "olddisplay", b ? k : m.css(d, "display"));
      for (g = 0; g < r; g++)
          if (d = x[g], d.style && (!a || "none" === d.style.display || "" === d.style.display)) d.style.display = a ? f[g] || "" : "none";
      return x
  }

  function C(x, c, a) {
      return (x = Dc.exec(c)) ? Math.max(0, x[1] - (a || 0)) + (x[2] || "px") : c
  }

  function D(x, c, a, k, d) {
      c = a === (k ? "border" : "content") ? 4 : "width" === c ? 1 : 0;
      for (var b = 0; 4 > c; c += 2) "margin" === a && (b += m.css(x, a + Aa[c], !0, d)), k ? ("content" === a && (b -= m.css(x, "padding" + Aa[c], !0, d)), "margin" !== a && (b -= m.css(x, "border" + Aa[c] + "Width",
          !0, d))) : (b += m.css(x, "padding" + Aa[c], !0, d), "padding" !== a && (b += m.css(x, "border" + Aa[c] + "Width", !0, d)));
      return b
  }

  function H(x, c, a) {
      var k = !0,
          d = "width" === c ? x.offsetWidth : x.offsetHeight,
          b = Ba(x),
          f = m.support.boxSizing && "border-box" === m.css(x, "boxSizing", !1, b);
      if (0 >= d || null == d) {
          d = Ca(x, c, b);
          if (0 > d || null == d) d = x.style[c];
          if (Wa.test(d)) return d;
          k = f && (m.support.boxSizingReliable || d === x.style[c]);
          d = parseFloat(d) || 0
      }
      return d + D(x, c, a || (f ? "border" : "content"), k, b) + "px"
  }

  function F(x) {
      var c = J,
          a = Qb[x];
      if (!a) {
          a = G(x, c);
          if ("none" ===
              a || !a) Qa = (Qa || m("\x3ciframe frameborder\x3d'0' width\x3d'0' height\x3d'0'/\x3e").css("cssText", "display:block !important")).appendTo(c.documentElement), c = (Qa[0].contentWindow || Qa[0].contentDocument).document, c.write("\x3c!doctype html\x3e\x3chtml\x3e\x3cbody\x3e"), c.close(), a = G(x, c), Qa.detach();
          Qb[x] = a
      }
      return a
  }

  function G(x, c) {
      var a = m(c.createElement(x)).appendTo(c.body),
          k = m.css(a[0], "display");
      a.remove();
      return k
  }

  function K(x, c, a, k) {
      var d;
      if (m.isArray(c)) m.each(c, function(c, d) {
          a || Ec.test(x) ? k(x,
              d) : K(x + "[" + ("object" === typeof d ? c : "") + "]", d, a, k)
      });
      else if (!a && "object" === m.type(c))
          for (d in c) K(x + "[" + d + "]", c[d], a, k);
      else k(x, c)
  }

  function I(x) {
      return function(c, a) {
          "string" !== typeof c && (a = c, c = "*");
          var d, k = 0,
              b = c.toLowerCase().match(pa) || [];
          if (m.isFunction(a))
              for (; d = b[k++];) "+" === d[0] ? (d = d.slice(1) || "*", (x[d] = x[d] || []).unshift(a)) : (x[d] = x[d] || []).push(a)
      }
  }

  function W(x, c, a, d) {
      function k(g) {
          var r;
          b[g] = !0;
          m.each(x[g] || [], function(x, g) {
              var e = g(c, a, d);
              if ("string" === typeof e && !f && !b[e]) return c.dataTypes.unshift(e),
                  k(e), !1;
              if (f) return !(r = e)
          });
          return r
      }
      var b = {},
          f = x === ob;
      return k(c.dataTypes[0]) || !b["*"] && k("*")
  }

  function E(x, c) {
      var a, d, k = m.ajaxSettings.flatOptions || {};
      for (d in c) c[d] !== n && ((k[d] ? x : a || (a = {}))[d] = c[d]);
      a && m.extend(!0, x, a);
      return x
  }

  function N() {
      try {
          return new b.XMLHttpRequest
      } catch (x) {}
  }

  function P() {
      setTimeout(function() {
          Ka = n
      });
      return Ka = m.now()
  }

  function ca(x, c, a) {
      for (var d, k = (Ra[c] || []).concat(Ra["*"]), b = 0, f = k.length; b < f; b++)
          if (d = k[b].call(a, c, x)) return d
  }

  function da(x, c, a) {
      var d, k, b = 0,
          f = Xa.length,
          g = m.Deferred().always(function() {
              delete r.elem
          }),
          r = function() {
              if (k) return !1;
              for (var c = Ka || P(), c = Math.max(0, e.startTime + e.duration - c), a = 1 - (c / e.duration || 0), d = 0, b = e.tweens.length; d < b; d++) e.tweens[d].run(a);
              g.notifyWith(x, [e, a, c]);
              if (1 > a && b) return c;
              g.resolveWith(x, [e]);
              return !1
          },
          e = g.promise({
              elem: x,
              props: m.extend({}, c),
              opts: m.extend(!0, {
                  specialEasing: {}
              }, a),
              originalProperties: c,
              originalOptions: a,
              startTime: Ka || P(),
              duration: a.duration,
              tweens: [],
              createTween: function(c, a) {
                  var d = m.Tween(x, e.opts, c, a, e.opts.specialEasing[c] ||
                      e.opts.easing);
                  e.tweens.push(d);
                  return d
              },
              stop: function(c) {
                  var a = 0,
                      d = c ? e.tweens.length : 0;
                  if (k) return this;
                  for (k = !0; a < d; a++) e.tweens[a].run(1);
                  c ? g.resolveWith(x, [e, c]) : g.rejectWith(x, [e, c]);
                  return this
              }
          });
      c = e.props;
      a = e.opts.specialEasing;
      var h, o, p, j;
      for (d in c)
          if (h = m.camelCase(d), o = a[h], p = c[d], m.isArray(p) && (o = p[1], p = c[d] = p[0]), d !== h && (c[h] = p, delete c[d]), (j = m.cssHooks[h]) && "expand" in j)
              for (d in p = j.expand(p), delete c[h], p) d in c || (c[d] = p[d], a[d] = o);
          else a[h] = o;
      for (; b < f; b++)
          if (d = Xa[b].call(e, x, c, e.opts)) return d;
      m.map(c, ca, e);
      m.isFunction(e.opts.start) && e.opts.start.call(x, e);
      m.fx.timer(m.extend(r, {
          elem: x,
          anim: e,
          queue: e.opts.queue
      }));
      return e.progress(e.opts.progress).done(e.opts.done, e.opts.complete).fail(e.opts.fail).always(e.opts.always)
  }

  function U(x, c, a, d, k) {
      return new U.prototype.init(x, c, a, d, k)
  }

  function S(x, c) {
      var a, d = {
              height: x
          },
          k = 0;
      for (c = c ? 1 : 0; 4 > k; k += 2 - c) a = Aa[k], d["margin" + a] = d["padding" + a] = x;
      c && (d.opacity = d.width = x);
      return d
  }

  function ja(x) {
      return m.isWindow(x) ? x : 9 === x.nodeType ? x.defaultView || x.parentWindow :
          !1
  }
  var aa, Sa, $ = typeof n,
      Gc = b.location,
      J = b.document,
      ba = J.documentElement,
      ea = b.jQuery,
      fa = b.$,
      X = {},
      ha = [],
      sa = ha.concat,
      qa = ha.push,
      R = ha.slice,
      Rb = ha.indexOf,
      Hc = X.toString,
      La = X.hasOwnProperty,
      pb = "1.10.2".trim,
      m = function(x, c) {
          return new m.fn.init(x, c, Sa)
      },
      Ya = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
      pa = /\S+/g,
      Ic = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
      Jc = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
      Sb = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
      Kc = /^[\],:{}\s]*$/,
      Lc = /(?:^|:|,)(?:\s*\[)+/g,
      Mc = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
      Nc = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
      Oc = /^-ms-/,
      Pc = /-([\da-z])/gi,
      Qc = function(x, c) {
          return c.toUpperCase()
      },
      ta = function(x) {
          if (J.addEventListener || "load" === x.type || "complete" === J.readyState) Tb(), m.ready()
      },
      Tb = function() {
          J.addEventListener ? (J.removeEventListener("DOMContentLoaded", ta, !1), b.removeEventListener("load", ta, !1)) : (J.detachEvent("onreadystatechange", ta), b.detachEvent("onload", ta))
      };
  m.fn = m.prototype = {
      jquery: "1.10.2",
      constructor: m,
      init: function(x, c, a) {
          var d;
          if (!x) return this;
          if ("string" === typeof x) {
              if ((d = "\x3c" === x.charAt(0) && "\x3e" === x.charAt(x.length - 1) && 3 <= x.length ? [null, x, null] : Jc.exec(x)) && (d[1] || !c)) {
                  if (d[1]) {
                      if (c = c instanceof m ? c[0] : c, m.merge(this, m.parseHTML(d[1], c && c.nodeType ? c.ownerDocument || c : J, !0)), Sb.test(d[1]) && m.isPlainObject(c))
                          for (d in c)
                              if (m.isFunction(this[d])) this[d](c[d]);
                              else this.attr(d, c[d])
                  } else {
                      if ((c = J.getElementById(d[2])) && c.parentNode) {
                          if (c.id !== d[2]) return a.find(x);
                          this.length = 1;
                          this[0] = c
                      }
                      this.context = J;
                      this.selector = x
                  }
                  return this
              }
              return !c ||
                  c.jquery ? (c || a).find(x) : this.constructor(c).find(x)
          }
          if (x.nodeType) return this.context = this[0] = x, this.length = 1, this;
          if (m.isFunction(x)) return a.ready(x);
          x.selector !== n && (this.selector = x.selector, this.context = x.context);
          return m.makeArray(x, this)
      },
      selector: "",
      length: 0,
      toArray: function() {
          return R.call(this)
      },
      get: function(x) {
          return null == x ? this.toArray() : 0 > x ? this[this.length + x] : this[x]
      },
      pushStack: function(x) {
          x = m.merge(this.constructor(), x);
          x.prevObject = this;
          x.context = this.context;
          return x
      },
      each: function(x,
          c) {
          return m.each(this, x, c)
      },
      ready: function(x) {
          m.ready.promise().done(x);
          return this
      },
      slice: function() {
          return this.pushStack(R.apply(this, arguments))
      },
      first: function() {
          return this.eq(0)
      },
      last: function() {
          return this.eq(-1)
      },
      eq: function(x) {
          var c = this.length;
          x = +x + (0 > x ? c : 0);
          return this.pushStack(0 <= x && x < c ? [this[x]] : [])
      },
      map: function(x) {
          return this.pushStack(m.map(this, function(c, a) {
              return x.call(c, a, c)
          }))
      },
      end: function() {
          return this.prevObject || this.constructor(null)
      },
      push: qa,
      sort: [].sort,
      splice: [].splice
  };
  m.fn.init.prototype = m.fn;
  m.extend = m.fn.extend = function() {
      var x, c, a, d, k, b = arguments[0] || {},
          f = 1,
          g = arguments.length,
          e = !1;
      "boolean" === typeof b && (e = b, b = arguments[1] || {}, f = 2);
      "object" !== typeof b && !m.isFunction(b) && (b = {});
      g === f && (b = this, --f);
      for (; f < g; f++)
          if (null != (k = arguments[f]))
              for (d in k) x = b[d], a = k[d], b !== a && (e && a && (m.isPlainObject(a) || (c = m.isArray(a))) ? (c ? (c = !1, x = x && m.isArray(x) ? x : []) : x = x && m.isPlainObject(x) ? x : {}, b[d] = m.extend(e, x, a)) : a !== n && (b[d] = a));
      return b
  };
  m.extend({
      expando: "jQuery" + ("1.10.2" + Math.random()).replace(/\D/g,
          ""),
      noConflict: function(x) {
          b.$ === m && (b.$ = fa);
          x && b.jQuery === m && (b.jQuery = ea);
          return m
      },
      isReady: !1,
      readyWait: 1,
      holdReady: function(x) {
          x ? m.readyWait++ : m.ready(!0)
      },
      ready: function(x) {
          if (!(!0 === x ? --m.readyWait : m.isReady)) {
              if (!J.body) return setTimeout(m.ready);
              m.isReady = !0;
              !0 !== x && 0 < --m.readyWait || (aa.resolveWith(J, [m]), m.fn.trigger && m(J).trigger("ready").off("ready"))
          }
      },
      isFunction: function(x) {
          return "function" === m.type(x)
      },
      isArray: Array.isArray || function(x) {
          return "array" === m.type(x)
      },
      isWindow: function(x) {
          return null !=
              x && x == x.window
      },
      isNumeric: function(x) {
          return !isNaN(parseFloat(x)) && isFinite(x)
      },
      type: function(x) {
          return null == x ? String(x) : "object" === typeof x || "function" === typeof x ? X[Hc.call(x)] || "object" : typeof x
      },
      isPlainObject: function(x) {
          var c;
          if (!x || "object" !== m.type(x) || x.nodeType || m.isWindow(x)) return !1;
          try {
              if (x.constructor && !La.call(x, "constructor") && !La.call(x.constructor.prototype, "isPrototypeOf")) return !1
          } catch (a) {
              return !1
          }
          if (m.support.ownLast)
              for (c in x) return La.call(x, c);
          for (c in x);
          return c === n || La.call(x,
              c)
      },
      isEmptyObject: function(x) {
          for (var c in x) return !1;
          return !0
      },
      error: function(x) {
          throw Error(x);
      },
      parseHTML: function(x, c, a) {
          if (!x || "string" !== typeof x) return null;
          "boolean" === typeof c && (a = c, c = !1);
          c = c || J;
          var d = Sb.exec(x);
          a = !a && [];
          if (d) return [c.createElement(d[1])];
          d = m.buildFragment([x], c, a);
          a && m(a).remove();
          return m.merge([], d.childNodes)
      },
      parseJSON: function(c) {
          if (b.JSON && b.JSON.parse) return b.JSON.parse(c);
          if (null === c) return c;
          if ("string" === typeof c && (c = m.trim(c)) && Kc.test(c.replace(Mc, "@").replace(Nc,
                  "]").replace(Lc, ""))) return (new Function("return " + c))();
          m.error("Invalid JSON: " + c)
      },
      parseXML: function(c) {
          var a, d;
          if (!c || "string" !== typeof c) return null;
          try {
              b.DOMParser ? (d = new DOMParser, a = d.parseFromString(c, "text/xml")) : (a = new ActiveXObject("Microsoft.XMLDOM"), a.async = "false", a.loadXML(c))
          } catch (k) {
              a = n
          }(!a || !a.documentElement || a.getElementsByTagName("parsererror").length) && m.error("Invalid XML: " + c);
          return a
      },
      noop: function() {},
      globalEval: function(c) {
          c && m.trim(c) && (b.execScript || function(c) {
              b.eval.call(b,
                  c)
          })(c)
      },
      camelCase: function(c) {
          return c.replace(Oc, "ms-").replace(Pc, Qc)
      },
      nodeName: function(c, a) {
          return c.nodeName && c.nodeName.toLowerCase() === a.toLowerCase()
      },
      each: function(c, a, d) {
          var k, b = 0,
              f = c.length;
          k = l(c);
          if (d)
              if (k)
                  for (; b < f && !(k = a.apply(c[b], d), !1 === k); b++);
              else
                  for (b in c) {
                      if (k = a.apply(c[b], d), !1 === k) break
                  } else if (k)
                      for (; b < f && !(k = a.call(c[b], b, c[b]), !1 === k); b++);
                  else
                      for (b in c)
                          if (k = a.call(c[b], b, c[b]), !1 === k) break;
          return c
      },
      trim: pb && !pb.call("\ufeff\u00a0") ? function(c) {
          return null == c ? "" : pb.call(c)
      } : function(c) {
          return null == c ? "" : (c + "").replace(Ic, "")
      },
      makeArray: function(c, a) {
          var d = a || [];
          null != c && (l(Object(c)) ? m.merge(d, "string" === typeof c ? [c] : c) : qa.call(d, c));
          return d
      },
      inArray: function(c, a, d) {
          var k;
          if (a) {
              if (Rb) return Rb.call(a, c, d);
              k = a.length;
              for (d = d ? 0 > d ? Math.max(0, k + d) : d : 0; d < k; d++)
                  if (d in a && a[d] === c) return d
          }
          return -1
      },
      merge: function(c, a) {
          var d = a.length,
              k = c.length,
              b = 0;
          if ("number" === typeof d)
              for (; b < d; b++) c[k++] = a[b];
          else
              for (; a[b] !== n;) c[k++] = a[b++];
          c.length = k;
          return c
      },
      grep: function(c, a, d) {
          var k,
              b = [],
              f = 0,
              g = c.length;
          for (d = !!d; f < g; f++) k = !!a(c[f], f), d !== k && b.push(c[f]);
          return b
      },
      map: function(c, a, d) {
          var k, b = 0,
              f = c.length,
              g = [];
          if (l(c))
              for (; b < f; b++) k = a(c[b], b, d), null != k && (g[g.length] = k);
          else
              for (b in c) k = a(c[b], b, d), null != k && (g[g.length] = k);
          return sa.apply([], g)
      },
      guid: 1,
      proxy: function(c, a) {
          var d, k;
          "string" === typeof a && (k = c[a], a = c, c = k);
          if (!m.isFunction(c)) return n;
          d = R.call(arguments, 2);
          k = function() {
              return c.apply(a || this, d.concat(R.call(arguments)))
          };
          k.guid = c.guid = c.guid || m.guid++;
          return k
      },
      access: function(c,
          a, d, k, b, f, g) {
          var e = 0,
              r = c.length,
              h = null == d;
          if ("object" === m.type(d))
              for (e in b = !0, d) m.access(c, a, e, d[e], !0, f, g);
          else if (k !== n && (b = !0, m.isFunction(k) || (g = !0), h && (g ? (a.call(c, k), a = null) : (h = a, a = function(c, a, x) {
                  return h.call(m(c), x)
              })), a))
              for (; e < r; e++) a(c[e], d, g ? k : k.call(c[e], e, a(c[e], d)));
          return b ? c : h ? a.call(c) : r ? a(c[0], d) : f
      },
      now: function() {
          return (new Date).getTime()
      },
      swap: function(c, a, d, k) {
          var b, f = {};
          for (b in a) f[b] = c.style[b], c.style[b] = a[b];
          d = d.apply(c, k || []);
          for (b in a) c.style[b] = f[b];
          return d
      }
  });
  m.ready.promise = function(c) {
      if (!aa)
          if (aa = m.Deferred(), "complete" === J.readyState) setTimeout(m.ready);
          else if (J.addEventListener) J.addEventListener("DOMContentLoaded", ta, !1), b.addEventListener("load", ta, !1);
      else {
          J.attachEvent("onreadystatechange", ta);
          b.attachEvent("onload", ta);
          var a = !1;
          try {
              a = null == b.frameElement && J.documentElement
          } catch (d) {}
          a && a.doScroll && function yc() {
              if (!m.isReady) {
                  try {
                      a.doScroll("left")
                  } catch (c) {
                      return setTimeout(yc, 50)
                  }
                  Tb();
                  m.ready()
              }
          }()
      }
      return aa.promise(c)
  };
  m.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),
      function(c, a) {
          X["[object " + a + "]"] = a.toLowerCase()
      });
  Sa = m(J);
  var qb = b,
      Q = function(c, a, d, k) {
          var b, f, g, e, r;
          (a ? a.ownerDocument || a : ra) !== Y && Da(a);
          a = a || Y;
          d = d || [];
          if (!c || "string" !== typeof c) return d;
          if (1 !== (e = a.nodeType) && 9 !== e) return [];
          if (ma && !k) {
              if (b = Rc.exec(c))
                  if (g = b[1])
                      if (9 === e)
                          if ((f = a.getElementById(g)) && f.parentNode) {
                              if (f.id === g) return d.push(f), d
                          } else return d;
              else {
                  if (a.ownerDocument && (f = a.ownerDocument.getElementById(g)) && Ta(a, f) && f.id === g) return d.push(f), d
              } else {
                  if (b[2]) return ua.apply(d, a.getElementsByTagName(c)),
                      d;
                  if ((g = b[3]) && T.getElementsByClassName && a.getElementsByClassName) return ua.apply(d, a.getElementsByClassName(g)), d
              }
              if (T.qsa && (!ga || !ga.test(c))) {
                  f = b = V;
                  g = a;
                  r = 9 === e && c;
                  if (1 === e && "object" !== a.nodeName.toLowerCase()) {
                      e = Za(c);
                      (b = a.getAttribute("id")) ? f = b.replace(Sc, "\\$\x26"): a.setAttribute("id", f);
                      f = "[id\x3d'" + f + "'] ";
                      for (g = e.length; g--;) e[g] = f + $a(e[g]);
                      g = rb.test(c) && a.parentNode || a;
                      r = e.join(",")
                  }
                  if (r) try {
                      return ua.apply(d, g.querySelectorAll(r)), d
                  } catch (h) {} finally {
                      b || a.removeAttribute("id")
                  }
              }
          }
          var o;
          a: {
              c = c.replace(ab, "$1");f = Za(c);
              if (!k && 1 === f.length) {
                  b = f[0] = f[0].slice(0);
                  if (2 < b.length && "ID" === (o = b[0]).type && T.getById && 9 === a.nodeType && ma && O.relative[b[1].type]) {
                      a = (O.find.ID(o.matches[0].replace(va, wa), a) || [])[0];
                      if (!a) {
                          o = d;
                          break a
                      }
                      c = c.slice(b.shift().value.length)
                  }
                  for (e = bb.needsContext.test(c) ? 0 : b.length; e--;) {
                      o = b[e];
                      if (O.relative[g = o.type]) break;
                      if (g = O.find[g])
                          if (k = g(o.matches[0].replace(va, wa), rb.test(b[0].type) && a.parentNode || a)) {
                              b.splice(e, 1);
                              c = k.length && $a(b);
                              if (!c) {
                                  ua.apply(d, k);
                                  o = d;
                                  break a
                              }
                              break
                          }
                  }
              }
              sb(c,
                  f)(k, a, !ma, d, rb.test(c));o = d
          }
          return o
      },
      tb = function() {
          function c(d, k) {
              a.push(d += " ") > O.cacheLength && delete c[a.shift()];
              return c[d] = k
          }
          var a = [];
          return c
      },
      ka = function(c) {
          c[V] = !0;
          return c
      },
      la = function(c) {
          var a = Y.createElement("div");
          try {
              return !!c(a)
          } catch (d) {
              return !1
          } finally {
              a.parentNode && a.parentNode.removeChild(a)
          }
      },
      ub = function(c, a) {
          for (var d = c.split("|"), k = c.length; k--;) O.attrHandle[d[k]] = a
      },
      Vb = function(c, a) {
          var d = a && c,
              k = d && 1 === c.nodeType && 1 === a.nodeType && (~a.sourceIndex || Ub) - (~c.sourceIndex || Ub);
          if (k) return k;
          if (d)
              for (; d = d.nextSibling;)
                  if (d === a) return -1;
          return c ? 1 : -1
      },
      Tc = function(c) {
          return function(a) {
              return "input" === a.nodeName.toLowerCase() && a.type === c
          }
      },
      Uc = function(c) {
          return function(a) {
              var d = a.nodeName.toLowerCase();
              return ("input" === d || "button" === d) && a.type === c
          }
      },
      Ea = function(c) {
          return ka(function(a) {
              a = +a;
              return ka(function(d, k) {
                  for (var b, f = c([], d.length, a), g = f.length; g--;)
                      if (d[b = f[g]]) d[b] = !(k[b] = d[b])
              })
          })
      },
      Wb = function() {},
      Za = function(c, a) {
          var d, k, b, f, g, e, r;
          if (g = Xb[c + " "]) return a ? 0 : g.slice(0);
          g = c;
          e = [];
          for (r = O.preFilter; g;) {
              if (!d || (k = Vc.exec(g))) k && (g = g.slice(k[0].length) || g), e.push(b = []);
              d = !1;
              if (k = Wc.exec(g)) d = k.shift(), b.push({
                  value: d,
                  type: k[0].replace(ab, " ")
              }), g = g.slice(d.length);
              for (f in O.filter)
                  if ((k = bb[f].exec(g)) && (!r[f] || (k = r[f](k)))) d = k.shift(), b.push({
                      value: d,
                      type: f,
                      matches: k
                  }), g = g.slice(d.length);
              if (!d) break
          }
          return a ? g.length : g ? Q.error(c) : Xb(c, e).slice(0)
      },
      $a = function(c) {
          for (var a = 0, d = c.length, k = ""; a < d; a++) k += c[a].value;
          return k
      },
      vb = function(c, a, d) {
          var k = a.dir,
              b = d && "parentNode" ===
              k,
              f = Xc++;
          return a.first ? function(a, d, f) {
              for (; a = a[k];)
                  if (1 === a.nodeType || b) return c(a, d, f)
          } : function(a, d, g) {
              var e, r, h, o = na + " " + f;
              if (g)
                  for (; a = a[k];) {
                      if ((1 === a.nodeType || b) && c(a, d, g)) return !0
                  } else
                      for (; a = a[k];)
                          if (1 === a.nodeType || b)
                              if (h = a[V] || (a[V] = {}), (r = h[k]) && r[0] === o) {
                                  if (!0 === (e = r[1]) || e === cb) return !0 === e
                              } else if (r = h[k] = [o], r[1] = c(a, d, g) || cb, !0 === r[1]) return !0
          }
      },
      wb = function(c) {
          return 1 < c.length ? function(a, d, k) {
              for (var b = c.length; b--;)
                  if (!c[b](a, d, k)) return !1;
              return !0
          } : c[0]
      },
      db = function(c, a, d, k, b) {
          for (var f,
                  g = [], e = 0, r = c.length, h = null != a; e < r; e++)
              if (f = c[e])
                  if (!d || d(f, k, b)) g.push(f), h && a.push(e);
          return g
      },
      xb = function(c, a, d, k, b, f) {
          k && !k[V] && (k = xb(k));
          b && !b[V] && (b = xb(b, f));
          return ka(function(f, g, e, r) {
              var h, o, p = [],
                  j = [],
                  l = g.length,
                  w;
              if (!(w = f)) {
                  w = a || "*";
                  for (var C = e.nodeType ? [e] : e, m = [], n = 0, q = C.length; n < q; n++) Q(w, C[n], m);
                  w = m
              }
              w = c && (f || !a) ? db(w, p, c, e, r) : w;
              C = d ? b || (f ? c : l || k) ? [] : g : w;
              d && d(w, C, e, r);
              if (k) {
                  h = db(C, j);
                  k(h, [], e, r);
                  for (e = h.length; e--;)
                      if (o = h[e]) C[j[e]] = !(w[j[e]] = o)
              }
              if (f) {
                  if (b || c) {
                      if (b) {
                          h = [];
                          for (e = C.length; e--;)
                              if (o =
                                  C[e]) h.push(w[e] = o);
                          b(null, C = [], h, r)
                      }
                      for (e = C.length; e--;)
                          if ((o = C[e]) && -1 < (h = b ? Fa.call(f, o) : p[e])) f[h] = !(g[h] = o)
                  }
              } else C = db(C === g ? C.splice(l, C.length) : C), b ? b(null, g, C, r) : ua.apply(g, C)
          })
      },
      yb = function(c) {
          var a, d, k, b = c.length,
              f = O.relative[c[0].type];
          d = f || O.relative[" "];
          for (var g = f ? 1 : 0, e = vb(function(c) {
                  return c === a
              }, d, !0), r = vb(function(c) {
                  return -1 < Fa.call(a, c)
              }, d, !0), h = [function(c, x, d) {
                  return !f && (d || x !== eb) || ((a = x).nodeType ? e(c, x, d) : r(c, x, d))
              }]; g < b; g++)
              if (d = O.relative[c[g].type]) h = [vb(wb(h), d)];
              else {
                  d =
                      O.filter[c[g].type].apply(null, c[g].matches);
                  if (d[V]) {
                      for (k = ++g; k < b && !O.relative[c[k].type]; k++);
                      return xb(1 < g && wb(h), 1 < g && $a(c.slice(0, g - 1).concat({
                          value: " " === c[g - 2].type ? "*" : ""
                      })).replace(ab, "$1"), d, g < k && yb(c.slice(g, k)), k < b && yb(c = c.slice(k)), k < b && $a(c))
                  }
                  h.push(d)
              } return wb(h)
      },
      Ma, T, cb, O, fb, Yb, sb, eb, Ga, Da, Y, oa, ma, ga, Ha, gb, Ta, V = "sizzle" + -new Date,
      ra = qb.document,
      na = 0,
      Xc = 0,
      Zb = tb(),
      Xb = tb(),
      $b = tb(),
      Na = !1,
      zb = function(c, a) {
          c === a && (Na = !0);
          return 0
      },
      Ub = -2147483648,
      Yc = {}.hasOwnProperty,
      xa = [],
      Zc = xa.pop,
      $c =
      xa.push,
      ua = xa.push,
      ac = xa.slice,
      Fa = xa.indexOf || function(c) {
          for (var a = 0, d = this.length; a < d; a++)
              if (this[a] === c) return a;
          return -1
      },
      bc = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+".replace("w", "w#"),
      cc = "\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)[\\x20\\t\\r\\n\\f]*(?:([*^$|!~]?\x3d)[\\x20\\t\\r\\n\\f]*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + bc + ")|)|)[\\x20\\t\\r\\n\\f]*\\]",
      Ab = ":((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + cc.replace(3, 8) + ")*)|.*)\\)|)",
      ab = RegExp("^[\\x20\\t\\r\\n\\f]+|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$", "g"),
      Vc = /^[\x20\t\r\n\f]*,[\x20\t\r\n\f]*/,
      Wc = /^[\x20\t\r\n\f]*([>+~]|[\x20\t\r\n\f])[\x20\t\r\n\f]*/,
      rb = /[\x20\t\r\n\f]*[+~]/,
      ad = RegExp("\x3d[\\x20\\t\\r\\n\\f]*([^\\]'\"]*)[\\x20\\t\\r\\n\\f]*\\]", "g"),
      bd = RegExp(Ab),
      cd = RegExp("^" + bc + "$"),
      bb = {
          ID: /^#((?:\\.|[\w-]|[^\x00-\xa0])+)/,
          CLASS: /^\.((?:\\.|[\w-]|[^\x00-\xa0])+)/,
          TAG: RegExp("^(" + "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+".replace("w", "w*") + ")"),
          ATTR: RegExp("^" + cc),
          PSEUDO: RegExp("^" +
              Ab),
          CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\([\\x20\\t\\r\\n\\f]*(even|odd|(([+-]|)(\\d*)n|)[\\x20\\t\\r\\n\\f]*(?:([+-]|)[\\x20\\t\\r\\n\\f]*(\\d+)|))[\\x20\\t\\r\\n\\f]*\\)|)", "i"),
          bool: RegExp("^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$", "i"),
          needsContext: RegExp("^[\\x20\\t\\r\\n\\f]*[\x3e+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\([\\x20\\t\\r\\n\\f]*((?:-\\d)?\\d*)[\\x20\\t\\r\\n\\f]*\\)|)(?\x3d[^-]|$)",
              "i")
      },
      Bb = /^[^{]+\{\s*\[native \w/,
      Rc = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      dd = /^(?:input|select|textarea|button)$/i,
      ed = /^h\d$/i,
      Sc = /'|\\/g,
      va = RegExp("\\\\([\\da-f]{1,6}[\\x20\\t\\r\\n\\f]?|([\\x20\\t\\r\\n\\f])|.)", "ig"),
      wa = function(c, a, d) {
          c = "0x" + a - 65536;
          return c !== c || d ? a : 0 > c ? String.fromCharCode(c + 65536) : String.fromCharCode(c >> 10 | 55296, c & 1023 | 56320)
      };
  try {
      ua.apply(xa = ac.call(ra.childNodes), ra.childNodes), xa[ra.childNodes.length].nodeType
  } catch (Hd) {
      ua = {
          apply: xa.length ? function(c, a) {
              $c.apply(c, ac.call(a))
          } : function(c, a) {
              for (var d = c.length, k = 0; c[d++] = a[k++];);
              c.length = d - 1
          }
      }
  }
  Yb = Q.isXML = function(c) {
      return (c = c && (c.ownerDocument || c).documentElement) ? "HTML" !== c.nodeName : !1
  };
  T = Q.support = {};
  Da = Q.setDocument = function(c) {
      var a = c ? c.ownerDocument || c : ra;
      c = a.defaultView;
      if (a === Y || 9 !== a.nodeType || !a.documentElement) return Y;
      Y = a;
      oa = a.documentElement;
      ma = !Yb(a);
      c && (c.attachEvent && c !== c.top) && c.attachEvent("onbeforeunload", function() {
          Da()
      });
      T.attributes = la(function(c) {
          c.className = "i";
          return !c.getAttribute("className")
      });
      T.getElementsByTagName = la(function(c) {
          c.appendChild(a.createComment(""));
          return !c.getElementsByTagName("*").length
      });
      T.getElementsByClassName = la(function(c) {
          c.innerHTML = "\x3cdiv class\x3d'a'\x3e\x3c/div\x3e\x3cdiv class\x3d'a i'\x3e\x3c/div\x3e";
          c.firstChild.className = "i";
          return 2 === c.getElementsByClassName("i").length
      });
      T.getById = la(function(c) {
          oa.appendChild(c).id = V;
          return !a.getElementsByName || !a.getElementsByName(V).length
      });
      T.getById ? (O.find.ID = function(c, a) {
          if ("undefined" !== typeof a.getElementById &&
              ma) {
              var x = a.getElementById(c);
              return x && x.parentNode ? [x] : []
          }
      }, O.filter.ID = function(c) {
          var a = c.replace(va, wa);
          return function(c) {
              return c.getAttribute("id") === a
          }
      }) : (delete O.find.ID, O.filter.ID = function(c) {
          var a = c.replace(va, wa);
          return function(c) {
              return (c = "undefined" !== typeof c.getAttributeNode && c.getAttributeNode("id")) && c.value === a
          }
      });
      O.find.TAG = T.getElementsByTagName ? function(c, a) {
          if ("undefined" !== typeof a.getElementsByTagName) return a.getElementsByTagName(c)
      } : function(c, a) {
          var x, d = [],
              k = 0,
              b = a.getElementsByTagName(c);
          if ("*" === c) {
              for (; x = b[k++];) 1 === x.nodeType && d.push(x);
              return d
          }
          return b
      };
      O.find.CLASS = T.getElementsByClassName && function(c, a) {
          if ("undefined" !== typeof a.getElementsByClassName && ma) return a.getElementsByClassName(c)
      };
      Ha = [];
      ga = [];
      if (T.qsa = Bb.test(a.querySelectorAll)) la(function(c) {
          c.innerHTML = "\x3cselect\x3e\x3coption selected\x3d''\x3e\x3c/option\x3e\x3c/select\x3e";
          c.querySelectorAll("[selected]").length || ga.push("\\[[\\x20\\t\\r\\n\\f]*(?:value|checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)");
          c.querySelectorAll(":checked").length || ga.push(":checked")
      }), la(function(c) {
          var x = a.createElement("input");
          x.setAttribute("type", "hidden");
          c.appendChild(x).setAttribute("t", "");
          c.querySelectorAll("[t^\x3d'']").length && ga.push("[*^$]\x3d[\\x20\\t\\r\\n\\f]*(?:''|\"\")");
          c.querySelectorAll(":enabled").length || ga.push(":enabled", ":disabled");
          c.querySelectorAll("*,:x");
          ga.push(",.*:")
      });
      (T.matchesSelector = Bb.test(gb = oa.webkitMatchesSelector || oa.mozMatchesSelector || oa.oMatchesSelector || oa.msMatchesSelector)) &&
      la(function(c) {
          T.disconnectedMatch = gb.call(c, "div");
          gb.call(c, "[s!\x3d'']:x");
          Ha.push("!\x3d", Ab)
      });
      ga = ga.length && RegExp(ga.join("|"));
      Ha = Ha.length && RegExp(Ha.join("|"));
      Ta = Bb.test(oa.contains) || oa.compareDocumentPosition ? function(c, a) {
          var x = 9 === c.nodeType ? c.documentElement : c,
              d = a && a.parentNode;
          return c === d || !(!d || !(1 === d.nodeType && (x.contains ? x.contains(d) : c.compareDocumentPosition && c.compareDocumentPosition(d) & 16)))
      } : function(c, a) {
          if (a)
              for (; a = a.parentNode;)
                  if (a === c) return !0;
          return !1
      };
      zb = oa.compareDocumentPosition ?
          function(c, x) {
              if (c === x) return Na = !0, 0;
              var d = x.compareDocumentPosition && c.compareDocumentPosition && c.compareDocumentPosition(x);
              return d ? d & 1 || !T.sortDetached && x.compareDocumentPosition(c) === d ? c === a || Ta(ra, c) ? -1 : x === a || Ta(ra, x) ? 1 : Ga ? Fa.call(Ga, c) - Fa.call(Ga, x) : 0 : d & 4 ? -1 : 1 : c.compareDocumentPosition ? -1 : 1
          } : function(c, x) {
              var d, k = 0;
              d = c.parentNode;
              var b = x.parentNode,
                  f = [c],
                  g = [x];
              if (c === x) return Na = !0, 0;
              if (!d || !b) return c === a ? -1 : x === a ? 1 : d ? -1 : b ? 1 : Ga ? Fa.call(Ga, c) - Fa.call(Ga, x) : 0;
              if (d === b) return Vb(c, x);
              for (d =
                  c; d = d.parentNode;) f.unshift(d);
              for (d = x; d = d.parentNode;) g.unshift(d);
              for (; f[k] === g[k];) k++;
              return k ? Vb(f[k], g[k]) : f[k] === ra ? -1 : g[k] === ra ? 1 : 0
          };
      return a
  };
  Q.matches = function(c, a) {
      return Q(c, null, null, a)
  };
  Q.matchesSelector = function(c, a) {
      (c.ownerDocument || c) !== Y && Da(c);
      a = a.replace(ad, "\x3d'$1']");
      if (T.matchesSelector && ma && (!Ha || !Ha.test(a)) && (!ga || !ga.test(a))) try {
          var d = gb.call(c, a);
          if (d || T.disconnectedMatch || c.document && 11 !== c.document.nodeType) return d
      } catch (k) {}
      return 0 < Q(a, Y, null, [c]).length
  };
  Q.contains =
      function(c, a) {
          (c.ownerDocument || c) !== Y && Da(c);
          return Ta(c, a)
      };
  Q.attr = function(c, a) {
      (c.ownerDocument || c) !== Y && Da(c);
      var d = O.attrHandle[a.toLowerCase()],
          d = d && Yc.call(O.attrHandle, a.toLowerCase()) ? d(c, a, !ma) : void 0;
      return void 0 === d ? T.attributes || !ma ? c.getAttribute(a) : (d = c.getAttributeNode(a)) && d.specified ? d.value : null : d
  };
  Q.error = function(c) {
      throw Error("Syntax error, unrecognized expression: " + c);
  };
  Q.uniqueSort = function(c) {
      var a, d = [],
          k = 0,
          b = 0;
      Na = !T.detectDuplicates;
      Ga = !T.sortStable && c.slice(0);
      c.sort(zb);
      if (Na) {
          for (; a = c[b++];) a === c[b] && (k = d.push(b));
          for (; k--;) c.splice(d[k], 1)
      }
      return c
  };
  fb = Q.getText = function(c) {
      var a, d = "",
          k = 0;
      if (a = c.nodeType)
          if (1 === a || 9 === a || 11 === a) {
              if ("string" === typeof c.textContent) return c.textContent;
              for (c = c.firstChild; c; c = c.nextSibling) d += fb(c)
          } else {
              if (3 === a || 4 === a) return c.nodeValue
          }
      else
          for (; a = c[k]; k++) d += fb(a);
      return d
  };
  O = Q.selectors = {
      cacheLength: 50,
      createPseudo: ka,
      match: bb,
      attrHandle: {},
      find: {},
      relative: {
          "\x3e": {
              dir: "parentNode",
              first: !0
          },
          " ": {
              dir: "parentNode"
          },
          "+": {
              dir: "previousSibling",
              first: !0
          },
          "~": {
              dir: "previousSibling"
          }
      },
      preFilter: {
          ATTR: function(c) {
              c[1] = c[1].replace(va, wa);
              c[3] = (c[4] || c[5] || "").replace(va, wa);
              "~\x3d" === c[2] && (c[3] = " " + c[3] + " ");
              return c.slice(0, 4)
          },
          CHILD: function(c) {
              c[1] = c[1].toLowerCase();
              "nth" === c[1].slice(0, 3) ? (c[3] || Q.error(c[0]), c[4] = +(c[4] ? c[5] + (c[6] || 1) : 2 * ("even" === c[3] || "odd" === c[3])), c[5] = +(c[7] + c[8] || "odd" === c[3])) : c[3] && Q.error(c[0]);
              return c
          },
          PSEUDO: function(c) {
              var a, d = !c[5] && c[2];
              if (bb.CHILD.test(c[0])) return null;
              if (c[3] && void 0 !== c[4]) c[2] = c[4];
              else if (d && bd.test(d) && (a = Za(d, !0)) && (a = d.indexOf(")", d.length - a) - d.length)) c[0] = c[0].slice(0, a), c[2] = d.slice(0, a);
              return c.slice(0, 3)
          }
      },
      filter: {
          TAG: function(c) {
              var a = c.replace(va, wa).toLowerCase();
              return "*" === c ? function() {
                  return !0
              } : function(c) {
                  return c.nodeName && c.nodeName.toLowerCase() === a
              }
          },
          CLASS: function(c) {
              var a = Zb[c + " "];
              return a || (a = RegExp("(^|[\\x20\\t\\r\\n\\f])" + c + "([\\x20\\t\\r\\n\\f]|$)")) && Zb(c, function(c) {
                  return a.test("string" === typeof c.className && c.className || "undefined" !== typeof c.getAttribute &&
                      c.getAttribute("class") || "")
              })
          },
          ATTR: function(c, a, d) {
              return function(k) {
                  k = Q.attr(k, c);
                  if (null == k) return "!\x3d" === a;
                  if (!a) return !0;
                  k += "";
                  return "\x3d" === a ? k === d : "!\x3d" === a ? k !== d : "^\x3d" === a ? d && 0 === k.indexOf(d) : "*\x3d" === a ? d && -1 < k.indexOf(d) : "$\x3d" === a ? d && k.slice(-d.length) === d : "~\x3d" === a ? -1 < (" " + k + " ").indexOf(d) : "|\x3d" === a ? k === d || k.slice(0, d.length + 1) === d + "-" : !1
              }
          },
          CHILD: function(c, a, d, k, b) {
              var f = "nth" !== c.slice(0, 3),
                  g = "last" !== c.slice(-4),
                  e = "of-type" === a;
              return 1 === k && 0 === b ? function(c) {
                      return !!c.parentNode
                  } :
                  function(a, d, r) {
                      var h, o, p, j, l;
                      d = f !== g ? "nextSibling" : "previousSibling";
                      var w = a.parentNode,
                          C = e && a.nodeName.toLowerCase();
                      r = !r && !e;
                      if (w) {
                          if (f) {
                              for (; d;) {
                                  for (o = a; o = o[d];)
                                      if (e ? o.nodeName.toLowerCase() === C : 1 === o.nodeType) return !1;
                                  l = d = "only" === c && !l && "nextSibling"
                              }
                              return !0
                          }
                          l = [g ? w.firstChild : w.lastChild];
                          if (g && r) {
                              r = w[V] || (w[V] = {});
                              h = r[c] || [];
                              j = h[0] === na && h[1];
                              p = h[0] === na && h[2];
                              for (o = j && w.childNodes[j]; o = ++j && o && o[d] || (p = j = 0) || l.pop();)
                                  if (1 === o.nodeType && ++p && o === a) {
                                      r[c] = [na, j, p];
                                      break
                                  }
                          } else if (r && (h = (a[V] ||
                                  (a[V] = {}))[c]) && h[0] === na) p = h[1];
                          else
                              for (; o = ++j && o && o[d] || (p = j = 0) || l.pop();)
                                  if ((e ? o.nodeName.toLowerCase() === C : 1 === o.nodeType) && ++p)
                                      if (r && ((o[V] || (o[V] = {}))[c] = [na, p]), o === a) break;
                          p -= b;
                          return p === k || 0 === p % k && 0 <= p / k
                      }
                  }
          },
          PSEUDO: function(c, a) {
              var d, k = O.pseudos[c] || O.setFilters[c.toLowerCase()] || Q.error("unsupported pseudo: " + c);
              return k[V] ? k(a) : 1 < k.length ? (d = [c, c, "", a], O.setFilters.hasOwnProperty(c.toLowerCase()) ? ka(function(c, d) {
                      for (var x, b = k(c, a), f = b.length; f--;) x = Fa.call(c, b[f]), c[x] = !(d[x] = b[f])
                  }) :
                  function(c) {
                      return k(c, 0, d)
                  }) : k
          }
      },
      pseudos: {
          not: ka(function(c) {
              var a = [],
                  d = [],
                  k = sb(c.replace(ab, "$1"));
              return k[V] ? ka(function(c, a, d, x) {
                  x = k(c, null, x, []);
                  for (var b = c.length; b--;)
                      if (d = x[b]) c[b] = !(a[b] = d)
              }) : function(c, x, b) {
                  a[0] = c;
                  k(a, null, b, d);
                  return !d.pop()
              }
          }),
          has: ka(function(c) {
              return function(a) {
                  return 0 < Q(c, a).length
              }
          }),
          contains: ka(function(c) {
              return function(a) {
                  return -1 < (a.textContent || a.innerText || fb(a)).indexOf(c)
              }
          }),
          lang: ka(function(c) {
              cd.test(c || "") || Q.error("unsupported lang: " + c);
              c = c.replace(va,
                  wa).toLowerCase();
              return function(a) {
                  var d;
                  do
                      if (d = ma ? a.lang : a.getAttribute("xml:lang") || a.getAttribute("lang")) return d = d.toLowerCase(), d === c || 0 === d.indexOf(c + "-"); while ((a = a.parentNode) && 1 === a.nodeType);
                  return !1
              }
          }),
          target: function(c) {
              var a = qb.location && qb.location.hash;
              return a && a.slice(1) === c.id
          },
          root: function(c) {
              return c === oa
          },
          focus: function(c) {
              return c === Y.activeElement && (!Y.hasFocus || Y.hasFocus()) && !(!c.type && !c.href && !~c.tabIndex)
          },
          enabled: function(c) {
              return !1 === c.disabled
          },
          disabled: function(c) {
              return !0 ===
                  c.disabled
          },
          checked: function(c) {
              var a = c.nodeName.toLowerCase();
              return "input" === a && !!c.checked || "option" === a && !!c.selected
          },
          selected: function(c) {
              c.parentNode && c.parentNode.selectedIndex;
              return !0 === c.selected
          },
          empty: function(c) {
              for (c = c.firstChild; c; c = c.nextSibling)
                  if ("@" < c.nodeName || 3 === c.nodeType || 4 === c.nodeType) return !1;
              return !0
          },
          parent: function(c) {
              return !O.pseudos.empty(c)
          },
          header: function(c) {
              return ed.test(c.nodeName)
          },
          input: function(c) {
              return dd.test(c.nodeName)
          },
          button: function(c) {
              var a = c.nodeName.toLowerCase();
              return "input" === a && "button" === c.type || "button" === a
          },
          text: function(c) {
              var a;
              return "input" === c.nodeName.toLowerCase() && "text" === c.type && (null == (a = c.getAttribute("type")) || a.toLowerCase() === c.type)
          },
          first: Ea(function() {
              return [0]
          }),
          last: Ea(function(c, a) {
              return [a - 1]
          }),
          eq: Ea(function(c, a, d) {
              return [0 > d ? d + a : d]
          }),
          even: Ea(function(c, a) {
              for (var d = 0; d < a; d += 2) c.push(d);
              return c
          }),
          odd: Ea(function(c, a) {
              for (var d = 1; d < a; d += 2) c.push(d);
              return c
          }),
          lt: Ea(function(c, a, d) {
              for (a = 0 > d ? d + a : d; 0 <= --a;) c.push(a);
              return c
          }),
          gt: Ea(function(c,
              a, d) {
              for (d = 0 > d ? d + a : d; ++d < a;) c.push(d);
              return c
          })
      }
  };
  O.pseudos.nth = O.pseudos.eq;
  for (Ma in {
          radio: !0,
          checkbox: !0,
          file: !0,
          password: !0,
          image: !0
      }) O.pseudos[Ma] = Tc(Ma);
  for (Ma in {
          submit: !0,
          reset: !0
      }) O.pseudos[Ma] = Uc(Ma);
  Wb.prototype = O.filters = O.pseudos;
  O.setFilters = new Wb;
  sb = Q.compile = function(c, a) {
      var d, k = [],
          b = [],
          f = $b[c + " "];
      if (!f) {
          a || (a = Za(c));
          for (d = a.length; d--;) f = yb(a[d]), f[V] ? k.push(f) : b.push(f);
          var g = 0,
              e = 0 < k.length,
              r = 0 < b.length;
          d = function(c, a, d, x, f) {
              var h, o, p = [],
                  j = 0,
                  l = "0",
                  w = c && [],
                  C = null != f,
                  m = eb,
                  mb = c ||
                  r && O.find.TAG("*", f && a.parentNode || a),
                  n = na += null == m ? 1 : Math.random() || 0.1;
              C && (eb = a !== Y && a, cb = g);
              for (; null != (f = mb[l]); l++) {
                  if (r && f) {
                      for (h = 0; o = b[h++];)
                          if (o(f, a, d)) {
                              x.push(f);
                              break
                          } C && (na = n, cb = ++g)
                  }
                  e && ((f = !o && f) && j--, c && w.push(f))
              }
              j += l;
              if (e && l !== j) {
                  for (h = 0; o = k[h++];) o(w, p, a, d);
                  if (c) {
                      if (0 < j)
                          for (; l--;) !w[l] && !p[l] && (p[l] = Zc.call(x));
                      p = db(p)
                  }
                  ua.apply(x, p);
                  C && (!c && 0 < p.length && 1 < j + k.length) && Q.uniqueSort(x)
              }
              C && (na = n, eb = m);
              return w
          };
          d = e ? ka(d) : d;
          f = $b(c, d)
      }
      return f
  };
  T.sortStable = V.split("").sort(zb).join("") ===
      V;
  T.detectDuplicates = Na;
  Da();
  T.sortDetached = la(function(c) {
      return c.compareDocumentPosition(Y.createElement("div")) & 1
  });
  la(function(c) {
      c.innerHTML = "\x3ca href\x3d'#'\x3e\x3c/a\x3e";
      return "#" === c.firstChild.getAttribute("href")
  }) || ub("type|href|height|width", function(c, a, d) {
      if (!d) return c.getAttribute(a, "type" === a.toLowerCase() ? 1 : 2)
  });
  (!T.attributes || !la(function(c) {
      c.innerHTML = "\x3cinput/\x3e";
      c.firstChild.setAttribute("value", "");
      return "" === c.firstChild.getAttribute("value")
  })) && ub("value", function(c,
      a, d) {
      if (!d && "input" === c.nodeName.toLowerCase()) return c.defaultValue
  });
  la(function(c) {
      return null == c.getAttribute("disabled")
  }) || ub("checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", function(c, a, d) {
      var k;
      if (!d) return (k = c.getAttributeNode(a)) && k.specified ? k.value : !0 === c[a] ? a.toLowerCase() : null
  });
  m.find = Q;
  m.expr = Q.selectors;
  m.expr[":"] = m.expr.pseudos;
  m.unique = Q.uniqueSort;
  m.text = Q.getText;
  m.isXMLDoc = Q.isXML;
  m.contains = Q.contains;
  var dc = {};
  m.Callbacks = function(c) {
      var a;
      if ("string" === typeof c) {
          if (!(a = dc[c])) {
              a = c;
              var d = dc[a] = {};
              m.each(a.match(pa) || [], function(c, a) {
                  d[a] = !0
              });
              a = d
          }
      } else a = m.extend({}, c);
      c = a;
      var k, b, f, g, e, r, h = [],
          o = !c.once && [],
          p = function(a) {
              b = c.memory && a;
              f = !0;
              e = r || 0;
              r = 0;
              g = h.length;
              for (k = !0; h && e < g; e++)
                  if (!1 === h[e].apply(a[0], a[1]) && c.stopOnFalse) {
                      b = !1;
                      break
                  } k = !1;
              h && (o ? o.length && p(o.shift()) : b ? h = [] : j.disable())
          },
          j = {
              add: function() {
                  if (h) {
                      var a = h.length;
                      (function Fc(a) {
                          m.each(a, function(a, d) {
                              var k = m.type(d);
                              "function" ===
                              k ? (!c.unique || !j.has(d)) && h.push(d) : d && (d.length && "string" !== k) && Fc(d)
                          })
                      })(arguments);
                      k ? g = h.length : b && (r = a, p(b))
                  }
                  return this
              },
              remove: function() {
                  h && m.each(arguments, function(c, a) {
                      for (var d; - 1 < (d = m.inArray(a, h, d));) h.splice(d, 1), k && (d <= g && g--, d <= e && e--)
                  });
                  return this
              },
              has: function(c) {
                  return c ? -1 < m.inArray(c, h) : !(!h || !h.length)
              },
              empty: function() {
                  h = [];
                  g = 0;
                  return this
              },
              disable: function() {
                  h = o = b = n;
                  return this
              },
              disabled: function() {
                  return !h
              },
              lock: function() {
                  o = n;
                  b || j.disable();
                  return this
              },
              locked: function() {
                  return !o
              },
              fireWith: function(c, a) {
                  if (h && (!f || o)) a = a || [], a = [c, a.slice ? a.slice() : a], k ? o.push(a) : p(a);
                  return this
              },
              fire: function() {
                  j.fireWith(this, arguments);
                  return this
              },
              fired: function() {
                  return !!f
              }
          };
      return j
  };
  m.extend({
      Deferred: function(c) {
          var a = [
                  ["resolve", "done", m.Callbacks("once memory"), "resolved"],
                  ["reject", "fail", m.Callbacks("once memory"), "rejected"],
                  ["notify", "progress", m.Callbacks("memory")]
              ],
              d = "pending",
              k = {
                  state: function() {
                      return d
                  },
                  always: function() {
                      b.done(arguments).fail(arguments);
                      return this
                  },
                  then: function() {
                      var c =
                          arguments;
                      return m.Deferred(function(d) {
                          m.each(a, function(a, x) {
                              var f = x[0],
                                  g = m.isFunction(c[a]) && c[a];
                              b[x[1]](function() {
                                  var c = g && g.apply(this, arguments);
                                  if (c && m.isFunction(c.promise)) c.promise().done(d.resolve).fail(d.reject).progress(d.notify);
                                  else d[f + "With"](this === k ? d.promise() : this, g ? [c] : arguments)
                              })
                          });
                          c = null
                      }).promise()
                  },
                  promise: function(c) {
                      return null != c ? m.extend(c, k) : k
                  }
              },
              b = {};
          k.pipe = k.then;
          m.each(a, function(c, x) {
              var f = x[2],
                  g = x[3];
              k[x[1]] = f.add;
              g && f.add(function() {
                  d = g
              }, a[c ^ 1][2].disable, a[2][2].lock);
              b[x[0]] = function() {
                  b[x[0] + "With"](this === b ? k : this, arguments);
                  return this
              };
              b[x[0] + "With"] = f.fireWith
          });
          k.promise(b);
          c && c.call(b, b);
          return b
      },
      when: function(c) {
          var a = 0,
              d = R.call(arguments),
              k = d.length,
              b = 1 !== k || c && m.isFunction(c.promise) ? k : 0,
              f = 1 === b ? c : m.Deferred(),
              g = function(c, a, d) {
                  return function(k) {
                      a[c] = this;
                      d[c] = 1 < arguments.length ? R.call(arguments) : k;
                      d === e ? f.notifyWith(a, d) : --b || f.resolveWith(a, d)
                  }
              },
              e, r, h;
          if (1 < k) {
              e = Array(k);
              r = Array(k);
              for (h = Array(k); a < k; a++) d[a] && m.isFunction(d[a].promise) ? d[a].promise().done(g(a,
                  h, d)).fail(f.reject).progress(g(a, r, e)) : --b
          }
          b || f.resolveWith(h, d);
          return f.promise()
      }
  });
  var fd = m;
  var L = {},
      Cb, ya, Z, hb, ib, jb, Db, ec, Ua, M = J.createElement("div");
  M.setAttribute("className", "t");
  M.innerHTML = "  \x3clink/\x3e\x3ctable\x3e\x3c/table\x3e\x3ca href\x3d'/a'\x3ea\x3c/a\x3e\x3cinput type\x3d'checkbox'/\x3e";
  Cb = M.getElementsByTagName("*") || [];
  if ((ya = M.getElementsByTagName("a")[0]) && ya.style && Cb.length) {
      hb = J.createElement("select");
      jb = hb.appendChild(J.createElement("option"));
      Z = M.getElementsByTagName("input")[0];
      ya.style.cssText = "top:1px;float:left;opacity:.5";
      L.getSetAttribute = "t" !== M.className;
      L.leadingWhitespace = 3 === M.firstChild.nodeType;
      L.tbody = !M.getElementsByTagName("tbody").length;
      L.htmlSerialize = !!M.getElementsByTagName("link").length;
      L.style = /top/.test(ya.getAttribute("style"));
      L.hrefNormalized = "/a" === ya.getAttribute("href");
      L.opacity = /^0.5/.test(ya.style.opacity);
      L.cssFloat = !!ya.style.cssFloat;
      L.checkOn = !!Z.value;
      L.optSelected = jb.selected;
      L.enctype = !!J.createElement("form").enctype;
      L.html5Clone =
          "\x3c:nav\x3e\x3c/:nav\x3e" !== J.createElement("nav").cloneNode(!0).outerHTML;
      L.inlineBlockNeedsLayout = !1;
      L.shrinkWrapBlocks = !1;
      L.pixelPosition = !1;
      L.deleteExpando = !0;
      L.noCloneEvent = !0;
      L.reliableMarginRight = !0;
      L.boxSizingReliable = !0;
      Z.checked = !0;
      L.noCloneChecked = Z.cloneNode(!0).checked;
      hb.disabled = !0;
      L.optDisabled = !jb.disabled;
      try {
          delete M.test
      } catch (Id) {
          L.deleteExpando = !1
      }
      Z = J.createElement("input");
      Z.setAttribute("value", "");
      L.input = "" === Z.getAttribute("value");
      Z.value = "t";
      Z.setAttribute("type", "radio");
      L.radioValue = "t" === Z.value;
      Z.setAttribute("checked", "t");
      Z.setAttribute("name", "t");
      ib = J.createDocumentFragment();
      ib.appendChild(Z);
      L.appendChecked = Z.checked;
      L.checkClone = ib.cloneNode(!0).cloneNode(!0).lastChild.checked;
      M.attachEvent && (M.attachEvent("onclick", function() {
          L.noCloneEvent = !1
      }), M.cloneNode(!0).click());
      for (Ua in {
              submit: !0,
              change: !0,
              focusin: !0
          }) M.setAttribute(Db = "on" + Ua, "t"), L[Ua + "Bubbles"] = Db in b || !1 === M.attributes[Db].expando;
      M.style.backgroundClip = "content-box";
      M.cloneNode(!0).style.backgroundClip =
          "";
      L.clearCloneStyle = "content-box" === M.style.backgroundClip;
      for (Ua in m(L)) break;
      L.ownLast = "0" !== Ua;
      m(function() {
          var c, a, d = J.getElementsByTagName("body")[0];
          d && (c = J.createElement("div"), c.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", d.appendChild(c).appendChild(M), M.innerHTML = "\x3ctable\x3e\x3ctr\x3e\x3ctd\x3e\x3c/td\x3e\x3ctd\x3et\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e", a = M.getElementsByTagName("td"), a[0].style.cssText = "padding:0;margin:0;border:0;display:none",
              ec = 0 === a[0].offsetHeight, a[0].style.display = "", a[1].style.display = "none", L.reliableHiddenOffsets = ec && 0 === a[0].offsetHeight, M.innerHTML = "", M.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", m.swap(d, null != d.style.zoom ? {
                  zoom: 1
              } : {}, function() {
                  L.boxSizing = 4 === M.offsetWidth
              }), b.getComputedStyle && (L.pixelPosition = "1%" !== (b.getComputedStyle(M, null) || {}).top, L.boxSizingReliable =
                  "4px" === (b.getComputedStyle(M, null) || {
                      width: "4px"
                  }).width, a = M.appendChild(J.createElement("div")), a.style.cssText = M.style.cssText = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", a.style.marginRight = a.style.width = "0", M.style.width = "1px", L.reliableMarginRight = !parseFloat((b.getComputedStyle(a, null) || {}).marginRight)), typeof M.style.zoom !== $ && (M.innerHTML = "", M.style.cssText = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;width:1px;padding:1px;display:inline;zoom:1",
                  L.inlineBlockNeedsLayout = 3 === M.offsetWidth, M.style.display = "block", M.innerHTML = "\x3cdiv\x3e\x3c/div\x3e", M.firstChild.style.width = "5px", L.shrinkWrapBlocks = 3 !== M.offsetWidth, L.inlineBlockNeedsLayout && (d.style.zoom = 1)), d.removeChild(c), c = M = a = a = null)
      });
      Cb = hb = ib = jb = ya = Z = null
  }
  fd.support = L;
  var Ac = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
      zc = /([A-Z])/g;
  m.extend({
      cache: {},
      noData: {
          applet: !0,
          embed: !0,
          object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
      },
      hasData: function(c) {
          c = c.nodeType ? m.cache[c[m.expando]] : c[m.expando];
          return !!c && !a(c)
      },
      data: function(c, a, d) {
          return h(c, a, d)
      },
      removeData: function(c, a) {
          return e(c, a)
      },
      _data: function(c, a, d) {
          return h(c, a, d, !0)
      },
      _removeData: function(c, a) {
          return e(c, a, !0)
      },
      acceptData: function(c) {
          if (c.nodeType && 1 !== c.nodeType && 9 !== c.nodeType) return !1;
          var a = c.nodeName && m.noData[c.nodeName.toLowerCase()];
          return !a || !0 !== a && c.getAttribute("classid") === a
      }
  });
  m.fn.extend({
      data: function(c, a) {
          var d, k, b = null,
              f = 0,
              e = this[0];
          if (c === n) {
              if (this.length && (b = m.data(e), 1 === e.nodeType && !m._data(e, "parsedAttrs"))) {
                  for (d =
                      e.attributes; f < d.length; f++) k = d[f].name, 0 === k.indexOf("data-") && (k = m.camelCase(k.slice(5)), g(e, k, b[k]));
                  m._data(e, "parsedAttrs", !0)
              }
              return b
          }
          return "object" === typeof c ? this.each(function() {
              m.data(this, c)
          }) : 1 < arguments.length ? this.each(function() {
              m.data(this, c, a)
          }) : e ? g(e, c, m.data(e, c)) : null
      },
      removeData: function(c) {
          return this.each(function() {
              m.removeData(this, c)
          })
      }
  });
  m.extend({
      queue: function(c, a, d) {
          var k;
          if (c) return a = (a || "fx") + "queue", k = m._data(c, a), d && (!k || m.isArray(d) ? k = m._data(c, a, m.makeArray(d)) :
              k.push(d)), k || []
      },
      dequeue: function(c, a) {
          a = a || "fx";
          var d = m.queue(c, a),
              k = d.length,
              b = d.shift(),
              f = m._queueHooks(c, a),
              g = function() {
                  m.dequeue(c, a)
              };
          "inprogress" === b && (b = d.shift(), k--);
          b && ("fx" === a && d.unshift("inprogress"), delete f.stop, b.call(c, g, f));
          !k && f && f.empty.fire()
      },
      _queueHooks: function(c, a) {
          var d = a + "queueHooks";
          return m._data(c, d) || m._data(c, d, {
              empty: m.Callbacks("once memory").add(function() {
                  m._removeData(c, a + "queue");
                  m._removeData(c, d)
              })
          })
      }
  });
  m.fn.extend({
      queue: function(c, a) {
          var d = 2;
          "string" !==
          typeof c && (a = c, c = "fx", d--);
          return arguments.length < d ? m.queue(this[0], c) : a === n ? this : this.each(function() {
              var d = m.queue(this, c, a);
              m._queueHooks(this, c);
              "fx" === c && "inprogress" !== d[0] && m.dequeue(this, c)
          })
      },
      dequeue: function(c) {
          return this.each(function() {
              m.dequeue(this, c)
          })
      },
      delay: function(c, a) {
          c = m.fx ? m.fx.speeds[c] || c : c;
          return this.queue(a || "fx", function(a, d) {
              var k = setTimeout(a, c);
              d.stop = function() {
                  clearTimeout(k)
              }
          })
      },
      clearQueue: function(c) {
          return this.queue(c || "fx", [])
      },
      promise: function(c, a) {
          var d, k =
              1,
              b = m.Deferred(),
              f = this,
              g = this.length,
              e = function() {
                  --k || b.resolveWith(f, [f])
              };
          "string" !== typeof c && (a = c, c = n);
          for (c = c || "fx"; g--;)
              if ((d = m._data(f[g], c + "queueHooks")) && d.empty) k++, d.empty.add(e);
          e();
          return b.promise(a)
      }
  });
  var Oa, fc, Eb = /[\t\r\n\f]/g,
      gd = /\r/g,
      hd = /^(?:input|select|textarea|button|object)$/i,
      id = /^(?:a|area)$/i,
      Fb = /^(?:checked|selected)$/i,
      Ia = m.support.getSetAttribute,
      kb = m.support.input;
  m.fn.extend({
      attr: function(c, a) {
          return m.access(this, m.attr, c, a, 1 < arguments.length)
      },
      removeAttr: function(c) {
          return this.each(function() {
              m.removeAttr(this,
                  c)
          })
      },
      prop: function(c, a) {
          return m.access(this, m.prop, c, a, 1 < arguments.length)
      },
      removeProp: function(c) {
          c = m.propFix[c] || c;
          return this.each(function() {
              try {
                  this[c] = n, delete this[c]
              } catch (a) {}
          })
      },
      addClass: function(c) {
          var a, d, k, b, f, g = 0,
              e = this.length;
          a = "string" === typeof c && c;
          if (m.isFunction(c)) return this.each(function(a) {
              m(this).addClass(c.call(this, a, this.className))
          });
          if (a)
              for (a = (c || "").match(pa) || []; g < e; g++)
                  if (d = this[g], k = 1 === d.nodeType && (d.className ? (" " + d.className + " ").replace(Eb, " ") : " ")) {
                      for (f =
                          0; b = a[f++];) 0 > k.indexOf(" " + b + " ") && (k += b + " ");
                      d.className = m.trim(k)
                  } return this
      },
      removeClass: function(c) {
          var a, d, k, b, f, g = 0,
              e = this.length;
          a = 0 === arguments.length || "string" === typeof c && c;
          if (m.isFunction(c)) return this.each(function(a) {
              m(this).removeClass(c.call(this, a, this.className))
          });
          if (a)
              for (a = (c || "").match(pa) || []; g < e; g++)
                  if (d = this[g], k = 1 === d.nodeType && (d.className ? (" " + d.className + " ").replace(Eb, " ") : "")) {
                      for (f = 0; b = a[f++];)
                          for (; 0 <= k.indexOf(" " + b + " ");) k = k.replace(" " + b + " ", " ");
                      d.className =
                          c ? m.trim(k) : ""
                  } return this
      },
      toggleClass: function(c, a) {
          var d = typeof c;
          return "boolean" === typeof a && "string" === d ? a ? this.addClass(c) : this.removeClass(c) : m.isFunction(c) ? this.each(function(d) {
              m(this).toggleClass(c.call(this, d, this.className, a), a)
          }) : this.each(function() {
              if ("string" === d)
                  for (var a, k = 0, b = m(this), f = c.match(pa) || []; a = f[k++];) b.hasClass(a) ? b.removeClass(a) : b.addClass(a);
              else if (d === $ || "boolean" === d) this.className && m._data(this, "__className__", this.className), this.className = this.className || !1 ===
                  c ? "" : m._data(this, "__className__") || ""
          })
      },
      hasClass: function(c) {
          c = " " + c + " ";
          for (var a = 0, d = this.length; a < d; a++)
              if (1 === this[a].nodeType && 0 <= (" " + this[a].className + " ").replace(Eb, " ").indexOf(c)) return !0;
          return !1
      },
      val: function(c) {
          var a, d, k, b = this[0];
          if (arguments.length) return k = m.isFunction(c), this.each(function(a) {
              if (1 === this.nodeType && (a = k ? c.call(this, a, m(this).val()) : c, null == a ? a = "" : "number" === typeof a ? a += "" : m.isArray(a) && (a = m.map(a, function(c) {
                          return null == c ? "" : c + ""
                      })), d = m.valHooks[this.type] || m.valHooks[this.nodeName.toLowerCase()],
                      !d || !("set" in d) || d.set(this, a, "value") === n)) this.value = a
          });
          if (b) {
              if ((d = m.valHooks[b.type] || m.valHooks[b.nodeName.toLowerCase()]) && "get" in d && (a = d.get(b, "value")) !== n) return a;
              a = b.value;
              return "string" === typeof a ? a.replace(gd, "") : null == a ? "" : a
          }
      }
  });
  m.extend({
      valHooks: {
          option: {
              get: function(c) {
                  var a = m.find.attr(c, "value");
                  return null != a ? a : c.text
              }
          },
          select: {
              get: function(c) {
                  for (var a, d = c.options, k = c.selectedIndex, b = (c = "select-one" === c.type || 0 > k) ? null : [], f = c ? k + 1 : d.length, g = 0 > k ? f : c ? k : 0; g < f; g++)
                      if (a = d[g], (a.selected ||
                              g === k) && (m.support.optDisabled ? !a.disabled : null === a.getAttribute("disabled")) && (!a.parentNode.disabled || !m.nodeName(a.parentNode, "optgroup"))) {
                          a = m(a).val();
                          if (c) return a;
                          b.push(a)
                      } return b
              },
              set: function(c, a) {
                  for (var d, k, b = c.options, f = m.makeArray(a), g = b.length; g--;)
                      if (k = b[g], k.selected = 0 <= m.inArray(m(k).val(), f)) d = !0;
                  d || (c.selectedIndex = -1);
                  return f
              }
          }
      },
      attr: function(c, a, d) {
          var k, b, f = c.nodeType;
          if (c && !(3 === f || 8 === f || 2 === f)) {
              if (typeof c.getAttribute === $) return m.prop(c, a, d);
              if (1 !== f || !m.isXMLDoc(c)) a =
                  a.toLowerCase(), k = m.attrHooks[a] || (m.expr.match.bool.test(a) ? fc : Oa);
              if (d !== n)
                  if (null === d) m.removeAttr(c, a);
                  else {
                      if (k && "set" in k && (b = k.set(c, d, a)) !== n) return b;
                      c.setAttribute(a, d + "");
                      return d
                  }
              else {
                  if (k && "get" in k && null !== (b = k.get(c, a))) return b;
                  b = m.find.attr(c, a);
                  return null == b ? n : b
              }
          }
      },
      removeAttr: function(c, a) {
          var d, k, b = 0,
              f = a && a.match(pa);
          if (f && 1 === c.nodeType)
              for (; d = f[b++];) k = m.propFix[d] || d, m.expr.match.bool.test(d) ? kb && Ia || !Fb.test(d) ? c[k] = !1 : c[m.camelCase("default-" + d)] = c[k] = !1 : m.attr(c, d, ""), c.removeAttribute(Ia ?
                  d : k)
      },
      attrHooks: {
          type: {
              set: function(c, a) {
                  if (!m.support.radioValue && "radio" === a && m.nodeName(c, "input")) {
                      var d = c.value;
                      c.setAttribute("type", a);
                      d && (c.value = d);
                      return a
                  }
              }
          }
      },
      propFix: {
          "for": "htmlFor",
          "class": "className"
      },
      prop: function(c, a, d) {
          var k, b, f;
          f = c.nodeType;
          if (c && !(3 === f || 8 === f || 2 === f)) {
              if (f = 1 !== f || !m.isXMLDoc(c)) a = m.propFix[a] || a, b = m.propHooks[a];
              return d !== n ? b && "set" in b && (k = b.set(c, d, a)) !== n ? k : c[a] = d : b && "get" in b && null !== (k = b.get(c, a)) ? k : c[a]
          }
      },
      propHooks: {
          tabIndex: {
              get: function(c) {
                  var a = m.find.attr(c,
                      "tabindex");
                  return a ? parseInt(a, 10) : hd.test(c.nodeName) || id.test(c.nodeName) && c.href ? 0 : -1
              }
          }
      }
  });
  fc = {
      set: function(c, a, d) {
          !1 === a ? m.removeAttr(c, d) : kb && Ia || !Fb.test(d) ? c.setAttribute(!Ia && m.propFix[d] || d, d) : c[m.camelCase("default-" + d)] = c[d] = !0;
          return d
      }
  };
  m.each(m.expr.match.bool.source.match(/\w+/g), function(c, a) {
      var d = m.expr.attrHandle[a] || m.find.attr;
      m.expr.attrHandle[a] = kb && Ia || !Fb.test(a) ? function(c, a, k) {
          var b = m.expr.attrHandle[a];
          c = k ? n : (m.expr.attrHandle[a] = n) != d(c, a, k) ? a.toLowerCase() : null;
          m.expr.attrHandle[a] =
              b;
          return c
      } : function(c, a, d) {
          return d ? n : c[m.camelCase("default-" + a)] ? a.toLowerCase() : null
      }
  });
  if (!kb || !Ia) m.attrHooks.value = {
      set: function(c, a, d) {
          if (m.nodeName(c, "input")) c.defaultValue = a;
          else return Oa && Oa.set(c, a, d)
      }
  };
  Ia || (Oa = {
      set: function(c, a, d) {
          var k = c.getAttributeNode(d);
          k || c.setAttributeNode(k = c.ownerDocument.createAttribute(d));
          k.value = a += "";
          return "value" === d || a === c.getAttribute(d) ? a : n
      }
  }, m.expr.attrHandle.id = m.expr.attrHandle.name = m.expr.attrHandle.coords = function(c, a, d) {
      var k;
      return d ? n : (k = c.getAttributeNode(a)) &&
          "" !== k.value ? k.value : null
  }, m.valHooks.button = {
      get: function(c, a) {
          var d = c.getAttributeNode(a);
          return d && d.specified ? d.value : n
      },
      set: Oa.set
  }, m.attrHooks.contenteditable = {
      set: function(c, a, d) {
          Oa.set(c, "" === a ? !1 : a, d)
      }
  }, m.each(["width", "height"], function(c, a) {
      m.attrHooks[a] = {
          set: function(c, d) {
              if ("" === d) return c.setAttribute(a, "auto"), d
          }
      }
  }));
  m.support.hrefNormalized || m.each(["href", "src"], function(c, a) {
      m.propHooks[a] = {
          get: function(c) {
              return c.getAttribute(a, 4)
          }
      }
  });
  m.support.style || (m.attrHooks.style = {
      get: function(c) {
          return c.style.cssText ||
              n
      },
      set: function(c, a) {
          return c.style.cssText = a + ""
      }
  });
  m.support.optSelected || (m.propHooks.selected = {
      get: function(c) {
          if (c = c.parentNode) c.selectedIndex, c.parentNode && c.parentNode.selectedIndex;
          return null
      }
  });
  m.each("tabIndex readOnly maxLength cellSpacing cellPadding rowSpan colSpan useMap frameBorder contentEditable".split(" "), function() {
      m.propFix[this.toLowerCase()] = this
  });
  m.support.enctype || (m.propFix.enctype = "encoding");
  m.each(["radio", "checkbox"], function() {
      m.valHooks[this] = {
          set: function(c, a) {
              if (m.isArray(a)) return c.checked =
                  0 <= m.inArray(m(c).val(), a)
          }
      };
      m.support.checkOn || (m.valHooks[this].get = function(c) {
          return null === c.getAttribute("value") ? "on" : c.value
      })
  });
  var Gb = /^(?:input|select|textarea)$/i,
      jd = /^key/,
      kd = /^(?:mouse|contextmenu)|click/,
      gc = /^(?:focusinfocus|focusoutblur)$/,
      hc = /^([^.]*)(?:\.(.+)|)$/;
  m.event = {
      global: {},
      add: function(c, a, d, k, b) {
          var f, g, e, r, h, o, p, j, l;
          if (e = m._data(c)) {
              d.handler && (r = d, d = r.handler, b = r.selector);
              d.guid || (d.guid = m.guid++);
              if (!(g = e.events)) g = e.events = {};
              if (!(h = e.handle)) h = e.handle = function(c) {
                  return typeof m !==
                      $ && (!c || m.event.triggered !== c.type) ? m.event.dispatch.apply(h.elem, arguments) : n
              }, h.elem = c;
              a = (a || "").match(pa) || [""];
              for (e = a.length; e--;)
                  if (f = hc.exec(a[e]) || [], j = o = f[1], l = (f[2] || "").split(".").sort(), j) {
                      f = m.event.special[j] || {};
                      j = (b ? f.delegateType : f.bindType) || j;
                      f = m.event.special[j] || {};
                      o = m.extend({
                          type: j,
                          origType: o,
                          data: k,
                          handler: d,
                          guid: d.guid,
                          selector: b,
                          needsContext: b && m.expr.match.needsContext.test(b),
                          namespace: l.join(".")
                      }, r);
                      if (!(p = g[j]))
                          if (p = g[j] = [], p.delegateCount = 0, !f.setup || !1 === f.setup.call(c,
                                  k, l, h)) c.addEventListener ? c.addEventListener(j, h, !1) : c.attachEvent && c.attachEvent("on" + j, h);
                      f.add && (f.add.call(c, o), o.handler.guid || (o.handler.guid = d.guid));
                      b ? p.splice(p.delegateCount++, 0, o) : p.push(o);
                      m.event.global[j] = !0
                  } c = null
          }
      },
      remove: function(c, a, d, k, b) {
          var f, g, e, r, h, o, p, j, l, w, C, n = m.hasData(c) && m._data(c);
          if (n && (o = n.events)) {
              a = (a || "").match(pa) || [""];
              for (h = a.length; h--;)
                  if (e = hc.exec(a[h]) || [], l = C = e[1], w = (e[2] || "").split(".").sort(), l) {
                      p = m.event.special[l] || {};
                      l = (k ? p.delegateType : p.bindType) ||
                          l;
                      j = o[l] || [];
                      e = e[2] && RegExp("(^|\\.)" + w.join("\\.(?:.*\\.|)") + "(\\.|$)");
                      for (r = f = j.length; f--;)
                          if (g = j[f], (b || C === g.origType) && (!d || d.guid === g.guid) && (!e || e.test(g.namespace)) && (!k || k === g.selector || "**" === k && g.selector)) j.splice(f, 1), g.selector && j.delegateCount--, p.remove && p.remove.call(c, g);
                      r && !j.length && ((!p.teardown || !1 === p.teardown.call(c, w, n.handle)) && m.removeEvent(c, l, n.handle), delete o[l])
                  } else
                      for (l in o) m.event.remove(c, l + a[h], d, k, !0);
              m.isEmptyObject(o) && (delete n.handle, m._removeData(c, "events"))
          }
      },
      trigger: function(c, a, d, k) {
          var f, g, e, r, h, o, p = [d || J],
              j = La.call(c, "type") ? c.type : c;
          h = La.call(c, "namespace") ? c.namespace.split(".") : [];
          e = f = d = d || J;
          if (!(3 === d.nodeType || 8 === d.nodeType) && !gc.test(j + m.event.triggered))
              if (0 <= j.indexOf(".") && (h = j.split("."), j = h.shift(), h.sort()), g = 0 > j.indexOf(":") && "on" + j, c = c[m.expando] ? c : new m.Event(j, "object" === typeof c && c), c.isTrigger = k ? 2 : 3, c.namespace = h.join("."), c.namespace_re = c.namespace ? RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, c.result = n, c.target || (c.target =
                      d), a = null == a ? [c] : m.makeArray(a, [c]), h = m.event.special[j] || {}, k || !(h.trigger && !1 === h.trigger.apply(d, a))) {
                  if (!k && !h.noBubble && !m.isWindow(d)) {
                      r = h.delegateType || j;
                      gc.test(r + j) || (e = e.parentNode);
                      for (; e; e = e.parentNode) p.push(e), f = e;
                      if (f === (d.ownerDocument || J)) p.push(f.defaultView || f.parentWindow || b)
                  }
                  for (o = 0;
                      (e = p[o++]) && !c.isPropagationStopped();) c.type = 1 < o ? r : h.bindType || j, (f = (m._data(e, "events") || {})[c.type] && m._data(e, "handle")) && f.apply(e, a), (f = g && e[g]) && (m.acceptData(e) && f.apply && !1 === f.apply(e, a)) &&
                      c.preventDefault();
                  c.type = j;
                  if (!k && !c.isDefaultPrevented() && (!h._default || !1 === h._default.apply(p.pop(), a)) && m.acceptData(d) && g && d[j] && !m.isWindow(d)) {
                      (f = d[g]) && (d[g] = null);
                      m.event.triggered = j;
                      try {
                          d[j]()
                      } catch (l) {}
                      m.event.triggered = n;
                      f && (d[g] = f)
                  }
                  return c.result
              }
      },
      dispatch: function(c) {
          c = m.event.fix(c);
          var a, d, k, b, f = [],
              g = R.call(arguments);
          a = (m._data(this, "events") || {})[c.type] || [];
          var e = m.event.special[c.type] || {};
          g[0] = c;
          c.delegateTarget = this;
          if (!(e.preDispatch && !1 === e.preDispatch.call(this, c))) {
              f =
                  m.event.handlers.call(this, c, a);
              for (a = 0;
                  (k = f[a++]) && !c.isPropagationStopped();) {
                  c.currentTarget = k.elem;
                  for (b = 0;
                      (d = k.handlers[b++]) && !c.isImmediatePropagationStopped();)
                      if (!c.namespace_re || c.namespace_re.test(d.namespace))
                          if (c.handleObj = d, c.data = d.data, d = ((m.event.special[d.origType] || {}).handle || d.handler).apply(k.elem, g), d !== n && !1 === (c.result = d)) c.preventDefault(), c.stopPropagation()
              }
              e.postDispatch && e.postDispatch.call(this, c);
              return c.result
          }
      },
      handlers: function(c, a) {
          var d, k, b, f, g = [],
              e = a.delegateCount,
              r = c.target;
          if (e && r.nodeType && (!c.button || "click" !== c.type))
              for (; r != this; r = r.parentNode || this)
                  if (1 === r.nodeType && (!0 !== r.disabled || "click" !== c.type)) {
                      b = [];
                      for (f = 0; f < e; f++) k = a[f], d = k.selector + " ", b[d] === n && (b[d] = k.needsContext ? 0 <= m(d, this).index(r) : m.find(d, this, null, [r]).length), b[d] && b.push(k);
                      b.length && g.push({
                          elem: r,
                          handlers: b
                      })
                  } e < a.length && g.push({
              elem: this,
              handlers: a.slice(e)
          });
          return g
      },
      fix: function(c) {
          if (c[m.expando]) return c;
          var a, d, k;
          a = c.type;
          var b = c,
              f = this.fixHooks[a];
          f || (this.fixHooks[a] =
              f = kd.test(a) ? this.mouseHooks : jd.test(a) ? this.keyHooks : {});
          k = f.props ? this.props.concat(f.props) : this.props;
          c = new m.Event(b);
          for (a = k.length; a--;) d = k[a], c[d] = b[d];
          c.target || (c.target = b.srcElement || J);
          3 === c.target.nodeType && (c.target = c.target.parentNode);
          c.metaKey = !!c.metaKey;
          return f.filter ? f.filter(c, b) : c
      },
      props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
      fixHooks: {},
      keyHooks: {
          props: ["char", "charCode", "key", "keyCode"],
          filter: function(c, a) {
              null == c.which && (c.which = null != a.charCode ? a.charCode : a.keyCode);
              return c
          }
      },
      mouseHooks: {
          props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
          filter: function(c, a) {
              var d, k, b = a.button,
                  f = a.fromElement;
              null == c.pageX && null != a.clientX && (d = c.target.ownerDocument || J, k = d.documentElement, d = d.body, c.pageX = a.clientX + (k && k.scrollLeft || d && d.scrollLeft || 0) - (k && k.clientLeft || d && d.clientLeft || 0), c.pageY = a.clientY + (k && k.scrollTop || d &&
                  d.scrollTop || 0) - (k && k.clientTop || d && d.clientTop || 0));
              !c.relatedTarget && f && (c.relatedTarget = f === c.target ? a.toElement : f);
              !c.which && b !== n && (c.which = b & 1 ? 1 : b & 2 ? 3 : b & 4 ? 2 : 0);
              return c
          }
      },
      special: {
          load: {
              noBubble: !0
          },
          focus: {
              trigger: function() {
                  if (this !== f() && this.focus) try {
                      return this.focus(), !1
                  } catch (c) {}
              },
              delegateType: "focusin"
          },
          blur: {
              trigger: function() {
                  if (this === f() && this.blur) return this.blur(), !1
              },
              delegateType: "focusout"
          },
          click: {
              trigger: function() {
                  if (m.nodeName(this, "input") && "checkbox" === this.type && this.click) return this.click(),
                      !1
              },
              _default: function(c) {
                  return m.nodeName(c.target, "a")
              }
          },
          beforeunload: {
              postDispatch: function(c) {
                  c.result !== n && (c.originalEvent.returnValue = c.result)
              }
          }
      },
      simulate: function(c, a, d, k) {
          c = m.extend(new m.Event, d, {
              type: c,
              isSimulated: !0,
              originalEvent: {}
          });
          k ? m.event.trigger(c, null, a) : m.event.dispatch.call(a, c);
          c.isDefaultPrevented() && d.preventDefault()
      }
  };
  m.removeEvent = J.removeEventListener ? function(c, a, d) {
      c.removeEventListener && c.removeEventListener(a, d, !1)
  } : function(c, a, d) {
      a = "on" + a;
      c.detachEvent && (typeof c[a] ===
          $ && (c[a] = null), c.detachEvent(a, d))
  };
  m.Event = function(c, a) {
      if (!(this instanceof m.Event)) return new m.Event(c, a);
      c && c.type ? (this.originalEvent = c, this.type = c.type, this.isDefaultPrevented = c.defaultPrevented || !1 === c.returnValue || c.getPreventDefault && c.getPreventDefault() ? d : r) : this.type = c;
      a && m.extend(this, a);
      this.timeStamp = c && c.timeStamp || m.now();
      this[m.expando] = !0
  };
  m.Event.prototype = {
      isDefaultPrevented: r,
      isPropagationStopped: r,
      isImmediatePropagationStopped: r,
      preventDefault: function() {
          var c = this.originalEvent;
          this.isDefaultPrevented = d;
          c && (c.preventDefault ? c.preventDefault() : c.returnValue = !1)
      },
      stopPropagation: function() {
          var c = this.originalEvent;
          this.isPropagationStopped = d;
          c && (c.stopPropagation && c.stopPropagation(), c.cancelBubble = !0)
      },
      stopImmediatePropagation: function() {
          this.isImmediatePropagationStopped = d;
          this.stopPropagation()
      }
  };
  m.each({
      mouseenter: "mouseover",
      mouseleave: "mouseout"
  }, function(c, a) {
      m.event.special[c] = {
          delegateType: a,
          bindType: a,
          handle: function(c) {
              var d, k = c.relatedTarget,
                  b = c.handleObj;
              if (!k ||
                  k !== this && !m.contains(this, k)) c.type = b.origType, d = b.handler.apply(this, arguments), c.type = a;
              return d
          }
      }
  });
  m.support.submitBubbles || (m.event.special.submit = {
      setup: function() {
          if (m.nodeName(this, "form")) return !1;
          m.event.add(this, "click._submit keypress._submit", function(c) {
              c = c.target;
              if ((c = m.nodeName(c, "input") || m.nodeName(c, "button") ? c.form : n) && !m._data(c, "submitBubbles")) m.event.add(c, "submit._submit", function(c) {
                  c._submit_bubble = !0
              }), m._data(c, "submitBubbles", !0)
          })
      },
      postDispatch: function(c) {
          c._submit_bubble &&
              (delete c._submit_bubble, this.parentNode && !c.isTrigger && m.event.simulate("submit", this.parentNode, c, !0))
      },
      teardown: function() {
          if (m.nodeName(this, "form")) return !1;
          m.event.remove(this, "._submit")
      }
  });
  m.support.changeBubbles || (m.event.special.change = {
      setup: function() {
          if (Gb.test(this.nodeName)) {
              if ("checkbox" === this.type || "radio" === this.type) m.event.add(this, "propertychange._change", function(c) {
                  "checked" === c.originalEvent.propertyName && (this._just_changed = !0)
              }), m.event.add(this, "click._change", function(c) {
                  this._just_changed &&
                      !c.isTrigger && (this._just_changed = !1);
                  m.event.simulate("change", this, c, !0)
              });
              return !1
          }
          m.event.add(this, "beforeactivate._change", function(c) {
              c = c.target;
              Gb.test(c.nodeName) && !m._data(c, "changeBubbles") && (m.event.add(c, "change._change", function(c) {
                  this.parentNode && (!c.isSimulated && !c.isTrigger) && m.event.simulate("change", this.parentNode, c, !0)
              }), m._data(c, "changeBubbles", !0))
          })
      },
      handle: function(c) {
          var a = c.target;
          if (this !== a || c.isSimulated || c.isTrigger || "radio" !== a.type && "checkbox" !== a.type) return c.handleObj.handler.apply(this,
              arguments)
      },
      teardown: function() {
          m.event.remove(this, "._change");
          return !Gb.test(this.nodeName)
      }
  });
  m.support.focusinBubbles || m.each({
      focus: "focusin",
      blur: "focusout"
  }, function(c, a) {
      var d = 0,
          k = function(c) {
              m.event.simulate(a, c.target, m.event.fix(c), !0)
          };
      m.event.special[a] = {
          setup: function() {
              0 === d++ && J.addEventListener(c, k, !0)
          },
          teardown: function() {
              0 === --d && J.removeEventListener(c, k, !0)
          }
      }
  });
  m.fn.extend({
      on: function(c, a, d, k, b) {
          var f, g;
          if ("object" === typeof c) {
              "string" !== typeof a && (d = d || a, a = n);
              for (f in c) this.on(f,
                  a, d, c[f], b);
              return this
          }
          null == d && null == k ? (k = a, d = a = n) : null == k && ("string" === typeof a ? (k = d, d = n) : (k = d, d = a, a = n));
          if (!1 === k) k = r;
          else if (!k) return this;
          1 === b && (g = k, k = function(c) {
              m().off(c);
              return g.apply(this, arguments)
          }, k.guid = g.guid || (g.guid = m.guid++));
          return this.each(function() {
              m.event.add(this, c, k, d, a)
          })
      },
      one: function(c, a, d, k) {
          return this.on(c, a, d, k, 1)
      },
      off: function(c, a, d) {
          var k;
          if (c && c.preventDefault && c.handleObj) return k = c.handleObj, m(c.delegateTarget).off(k.namespace ? k.origType + "." + k.namespace : k.origType,
              k.selector, k.handler), this;
          if ("object" === typeof c) {
              for (k in c) this.off(k, a, c[k]);
              return this
          }
          if (!1 === a || "function" === typeof a) d = a, a = n;
          !1 === d && (d = r);
          return this.each(function() {
              m.event.remove(this, c, d, a)
          })
      },
      trigger: function(c, a) {
          return this.each(function() {
              m.event.trigger(c, a, this)
          })
      },
      triggerHandler: function(c, a) {
          var d = this[0];
          if (d) return m.event.trigger(c, a, d, !0)
      }
  });
  var Bc = /^.[^:#\[\.,]*$/,
      ld = /^(?:parents|prev(?:Until|All))/,
      ic = m.expr.match.needsContext,
      md = {
          children: !0,
          contents: !0,
          next: !0,
          prev: !0
      };
  m.fn.extend({
      find: function(c) {
          var a, d = [],
              k = this,
              b = k.length;
          if ("string" !== typeof c) return this.pushStack(m(c).filter(function() {
              for (a = 0; a < b; a++)
                  if (m.contains(k[a], this)) return !0
          }));
          for (a = 0; a < b; a++) m.find(c, k[a], d);
          d = this.pushStack(1 < b ? m.unique(d) : d);
          d.selector = this.selector ? this.selector + " " + c : c;
          return d
      },
      has: function(c) {
          var a, d = m(c, this),
              k = d.length;
          return this.filter(function() {
              for (a = 0; a < k; a++)
                  if (m.contains(this, d[a])) return !0
          })
      },
      not: function(c) {
          return this.pushStack(o(this, c || [], !0))
      },
      filter: function(c) {
          return this.pushStack(o(this,
              c || [], !1))
      },
      is: function(c) {
          return !!o(this, "string" === typeof c && ic.test(c) ? m(c) : c || [], !1).length
      },
      closest: function(c, a) {
          for (var d, k = 0, b = this.length, f = [], g = ic.test(c) || "string" !== typeof c ? m(c, a || this.context) : 0; k < b; k++)
              for (d = this[k]; d && d !== a; d = d.parentNode)
                  if (11 > d.nodeType && (g ? -1 < g.index(d) : 1 === d.nodeType && m.find.matchesSelector(d, c))) {
                      f.push(d);
                      break
                  } return this.pushStack(1 < f.length ? m.unique(f) : f)
      },
      index: function(c) {
          return !c ? this[0] && this[0].parentNode ? this.first().prevAll().length : -1 : "string" === typeof c ?
              m.inArray(this[0], m(c)) : m.inArray(c.jquery ? c[0] : c, this)
      },
      add: function(c, a) {
          var d = "string" === typeof c ? m(c, a) : m.makeArray(c && c.nodeType ? [c] : c),
              d = m.merge(this.get(), d);
          return this.pushStack(m.unique(d))
      },
      addBack: function(c) {
          return this.add(null == c ? this.prevObject : this.prevObject.filter(c))
      }
  });
  m.each({
      parent: function(c) {
          return (c = c.parentNode) && 11 !== c.nodeType ? c : null
      },
      parents: function(c) {
          return m.dir(c, "parentNode")
      },
      parentsUntil: function(c, a, d) {
          return m.dir(c, "parentNode", d)
      },
      next: function(c) {
          return p(c,
              "nextSibling")
      },
      prev: function(c) {
          return p(c, "previousSibling")
      },
      nextAll: function(c) {
          return m.dir(c, "nextSibling")
      },
      prevAll: function(c) {
          return m.dir(c, "previousSibling")
      },
      nextUntil: function(c, a, d) {
          return m.dir(c, "nextSibling", d)
      },
      prevUntil: function(c, a, d) {
          return m.dir(c, "previousSibling", d)
      },
      siblings: function(c) {
          return m.sibling((c.parentNode || {}).firstChild, c)
      },
      children: function(c) {
          return m.sibling(c.firstChild)
      },
      contents: function(c) {
          return m.nodeName(c, "iframe") ? c.contentDocument || c.contentWindow.document :
              m.merge([], c.childNodes)
      }
  }, function(c, a) {
      m.fn[c] = function(d, k) {
          var b = m.map(this, a, d);
          "Until" !== c.slice(-5) && (k = d);
          k && "string" === typeof k && (b = m.filter(k, b));
          1 < this.length && (md[c] || (b = m.unique(b)), ld.test(c) && (b = b.reverse()));
          return this.pushStack(b)
      }
  });
  m.extend({
      filter: function(c, a, d) {
          var k = a[0];
          d && (c = ":not(" + c + ")");
          return 1 === a.length && 1 === k.nodeType ? m.find.matchesSelector(k, c) ? [k] : [] : m.find.matches(c, m.grep(a, function(c) {
              return 1 === c.nodeType
          }))
      },
      dir: function(c, a, d) {
          var k = [];
          for (c = c[a]; c && 9 !== c.nodeType &&
              (d === n || 1 !== c.nodeType || !m(c).is(d));) 1 === c.nodeType && k.push(c), c = c[a];
          return k
      },
      sibling: function(c, a) {
          for (var d = []; c; c = c.nextSibling) 1 === c.nodeType && c !== a && d.push(c);
          return d
      }
  });
  var Ob = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
      nd = / jQuery\d+="(?:null|\d+)"/g,
      jc = RegExp("\x3c(?:" + Ob + ")[\\s/\x3e]", "i"),
      Hb = /^\s+/,
      kc = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
      lc = /<([\w:]+)/,
      mc = /<tbody/i,
      od = /<|&#?\w+;/,
      pd = /<(?:script|style|link)/i,
      nb = /^(?:checkbox|radio)$/i,
      qd = /checked\s*(?:[^=]|=\s*.checked.)/i,
      nc = /^$|\/(?:java|ecma)script/i,
      Cc = /^true\/(.*)/,
      rd = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
      ia = {
          option: [1, "\x3cselect multiple\x3d'multiple'\x3e", "\x3c/select\x3e"],
          legend: [1, "\x3cfieldset\x3e", "\x3c/fieldset\x3e"],
          area: [1, "\x3cmap\x3e", "\x3c/map\x3e"],
          param: [1, "\x3cobject\x3e", "\x3c/object\x3e"],
          thead: [1, "\x3ctable\x3e", "\x3c/table\x3e"],
          tr: [2, "\x3ctable\x3e\x3ctbody\x3e",
              "\x3c/tbody\x3e\x3c/table\x3e"
          ],
          col: [2, "\x3ctable\x3e\x3ctbody\x3e\x3c/tbody\x3e\x3ccolgroup\x3e", "\x3c/colgroup\x3e\x3c/table\x3e"],
          td: [3, "\x3ctable\x3e\x3ctbody\x3e\x3ctr\x3e", "\x3c/tr\x3e\x3c/tbody\x3e\x3c/table\x3e"],
          _default: m.support.htmlSerialize ? [0, "", ""] : [1, "X\x3cdiv\x3e", "\x3c/div\x3e"]
      },
      Ib = w(J).appendChild(J.createElement("div"));
  ia.optgroup = ia.option;
  ia.tbody = ia.tfoot = ia.colgroup = ia.caption = ia.thead;
  ia.th = ia.td;
  m.fn.extend({
      text: function(c) {
          return m.access(this, function(c) {
              return c ===
                  n ? m.text(this) : this.empty().append((this[0] && this[0].ownerDocument || J).createTextNode(c))
          }, null, c, arguments.length)
      },
      append: function() {
          return this.domManip(arguments, function(c) {
              (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && A(this, c).appendChild(c)
          })
      },
      prepend: function() {
          return this.domManip(arguments, function(c) {
              if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                  var a = A(this, c);
                  a.insertBefore(c, a.firstChild)
              }
          })
      },
      before: function() {
          return this.domManip(arguments, function(c) {
              this.parentNode &&
                  this.parentNode.insertBefore(c, this)
          })
      },
      after: function() {
          return this.domManip(arguments, function(c) {
              this.parentNode && this.parentNode.insertBefore(c, this.nextSibling)
          })
      },
      remove: function(c, a) {
          for (var d, k = c ? m.filter(c, this) : this, b = 0; null != (d = k[b]); b++) !a && 1 === d.nodeType && m.cleanData(z(d)), d.parentNode && (a && m.contains(d.ownerDocument, d) && u(z(d, "script")), d.parentNode.removeChild(d));
          return this
      },
      empty: function() {
          for (var c, a = 0; null != (c = this[a]); a++) {
              for (1 === c.nodeType && m.cleanData(z(c, !1)); c.firstChild;) c.removeChild(c.firstChild);
              c.options && m.nodeName(c, "select") && (c.options.length = 0)
          }
          return this
      },
      clone: function(c, a) {
          c = null == c ? !1 : c;
          a = null == a ? c : a;
          return this.map(function() {
              return m.clone(this, c, a)
          })
      },
      html: function(c) {
          return m.access(this, function(c) {
              var a = this[0] || {},
                  d = 0,
                  k = this.length;
              if (c === n) return 1 === a.nodeType ? a.innerHTML.replace(nd, "") : n;
              if ("string" === typeof c && !pd.test(c) && (m.support.htmlSerialize || !jc.test(c)) && (m.support.leadingWhitespace || !Hb.test(c)) && !ia[(lc.exec(c) || ["", ""])[1].toLowerCase()]) {
                  c = c.replace(kc, "\x3c$1\x3e\x3c/$2\x3e");
                  try {
                      for (; d < k; d++) a = this[d] || {}, 1 === a.nodeType && (m.cleanData(z(a, !1)), a.innerHTML = c);
                      a = 0
                  } catch (b) {}
              }
              a && this.empty().append(c)
          }, null, c, arguments.length)
      },
      replaceWith: function() {
          var c = m.map(this, function(c) {
                  return [c.nextSibling, c.parentNode]
              }),
              a = 0;
          this.domManip(arguments, function(d) {
              var k = c[a++],
                  b = c[a++];
              b && (k && k.parentNode !== b && (k = this.nextSibling), m(this).remove(), b.insertBefore(d, k))
          }, !0);
          return a ? this : this.remove()
      },
      detach: function(c) {
          return this.remove(c, !0)
      },
      domManip: function(c, a, d) {
          c = sa.apply([],
              c);
          var k, b, f, g, e = 0,
              r = this.length,
              h = this,
              o = r - 1,
              p = c[0],
              j = m.isFunction(p);
          if (j || !(1 >= r || "string" !== typeof p || m.support.checkClone || !qd.test(p))) return this.each(function(k) {
              var b = h.eq(k);
              j && (c[0] = p.call(this, k, b.html()));
              b.domManip(c, a, d)
          });
          if (r && (g = m.buildFragment(c, this[0].ownerDocument, !1, !d && this), k = g.firstChild, 1 === g.childNodes.length && (g = k), k)) {
              f = m.map(z(g, "script"), q);
              for (b = f.length; e < r; e++) k = g, e !== o && (k = m.clone(k, !0, !0), b && m.merge(f, z(k, "script"))), a.call(this[e], k, e);
              if (b) {
                  g = f[f.length - 1].ownerDocument;
                  m.map(f, t);
                  for (e = 0; e < b; e++)
                      if (k = f[e], nc.test(k.type || "") && !m._data(k, "globalEval") && m.contains(g, k)) k.src ? m._evalUrl(k.src) : m.globalEval((k.text || k.textContent || k.innerHTML || "").replace(rd, ""))
              }
              g = k = null
          }
          return this
      }
  });
  m.each({
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith"
  }, function(c, a) {
      m.fn[c] = function(c) {
          for (var d = 0, k = [], b = m(c), f = b.length - 1; d <= f; d++) c = d === f ? this : this.clone(!0), m(b[d])[a](c), qa.apply(k, c.get());
          return this.pushStack(k)
      }
  });
  m.extend({
      clone: function(c, a, d) {
          var k, b, f, g, e, r = m.contains(c.ownerDocument, c);
          m.support.html5Clone || m.isXMLDoc(c) || !jc.test("\x3c" + c.nodeName + "\x3e") ? f = c.cloneNode(!0) : (Ib.innerHTML = c.outerHTML, Ib.removeChild(f = Ib.firstChild));
          if ((!m.support.noCloneEvent || !m.support.noCloneChecked) && (1 === c.nodeType || 11 === c.nodeType) && !m.isXMLDoc(c)) {
              k = z(f);
              e = z(c);
              for (g = 0; null != (b = e[g]); ++g)
                  if (k[g]) {
                      var h = k[g],
                          o = void 0,
                          p = void 0,
                          j = void 0;
                      if (1 === h.nodeType) {
                          o = h.nodeName.toLowerCase();
                          if (!m.support.noCloneEvent && h[m.expando]) {
                              j =
                                  m._data(h);
                              for (p in j.events) m.removeEvent(h, p, j.handle);
                              h.removeAttribute(m.expando)
                          }
                          if ("script" === o && h.text !== b.text) q(h).text = b.text, t(h);
                          else if ("object" === o) h.parentNode && (h.outerHTML = b.outerHTML), m.support.html5Clone && (b.innerHTML && !m.trim(h.innerHTML)) && (h.innerHTML = b.innerHTML);
                          else if ("input" === o && nb.test(b.type)) h.defaultChecked = h.checked = b.checked, h.value !== b.value && (h.value = b.value);
                          else if ("option" === o) h.defaultSelected = h.selected = b.defaultSelected;
                          else if ("input" === o || "textarea" === o) h.defaultValue =
                              b.defaultValue
                      }
                  }
          }
          if (a)
              if (d) {
                  e = e || z(c);
                  k = k || z(f);
                  for (g = 0; null != (b = e[g]); g++) v(b, k[g])
              } else v(c, f);
          k = z(f, "script");
          0 < k.length && u(k, !r && z(c, "script"));
          return f
      },
      buildFragment: function(c, a, d, k) {
          for (var b, f, g, e, r, h, o = c.length, p = w(a), j = [], l = 0; l < o; l++)
              if ((f = c[l]) || 0 === f)
                  if ("object" === m.type(f)) m.merge(j, f.nodeType ? [f] : f);
                  else if (od.test(f)) {
              g = g || p.appendChild(a.createElement("div"));
              e = (lc.exec(f) || ["", ""])[1].toLowerCase();
              h = ia[e] || ia._default;
              g.innerHTML = h[1] + f.replace(kc, "\x3c$1\x3e\x3c/$2\x3e") + h[2];
              for (b = h[0]; b--;) g = g.lastChild;
              !m.support.leadingWhitespace && Hb.test(f) && j.push(a.createTextNode(Hb.exec(f)[0]));
              if (!m.support.tbody)
                  for (b = (f = "table" === e && !mc.test(f) ? g.firstChild : "\x3ctable\x3e" === h[1] && !mc.test(f) ? g : 0) && f.childNodes.length; b--;) m.nodeName(r = f.childNodes[b], "tbody") && !r.childNodes.length && f.removeChild(r);
              m.merge(j, g.childNodes);
              for (g.textContent = ""; g.firstChild;) g.removeChild(g.firstChild);
              g = p.lastChild
          } else j.push(a.createTextNode(f));
          g && p.removeChild(g);
          m.support.appendChecked ||
              m.grep(z(j, "input"), y);
          for (l = 0; f = j[l++];)
              if (!(k && -1 !== m.inArray(f, k)) && (c = m.contains(f.ownerDocument, f), g = z(p.appendChild(f), "script"), c && u(g), d))
                  for (b = 0; f = g[b++];) nc.test(f.type || "") && d.push(f);
          return p
      },
      cleanData: function(c, a) {
          for (var d, k, b, f, g = 0, e = m.expando, r = m.cache, h = m.support.deleteExpando, o = m.event.special; null != (d = c[g]); g++)
              if (a || m.acceptData(d))
                  if (f = (b = d[e]) && r[b]) {
                      if (f.events)
                          for (k in f.events) o[k] ? m.event.remove(d, k) : m.removeEvent(d, k, f.handle);
                      r[b] && (delete r[b], h ? delete d[e] : typeof d.removeAttribute !==
                          $ ? d.removeAttribute(e) : d[e] = null, ha.push(b))
                  }
      },
      _evalUrl: function(c) {
          return m.ajax({
              url: c,
              type: "GET",
              dataType: "script",
              async: !1,
              global: !1,
              "throws": !0
          })
      }
  });
  m.fn.extend({
      wrapAll: function(c) {
          if (m.isFunction(c)) return this.each(function(a) {
              m(this).wrapAll(c.call(this, a))
          });
          if (this[0]) {
              var a = m(c, this[0].ownerDocument).eq(0).clone(!0);
              this[0].parentNode && a.insertBefore(this[0]);
              a.map(function() {
                  for (var c = this; c.firstChild && 1 === c.firstChild.nodeType;) c = c.firstChild;
                  return c
              }).append(this)
          }
          return this
      },
      wrapInner: function(c) {
          return m.isFunction(c) ?
              this.each(function(a) {
                  m(this).wrapInner(c.call(this, a))
              }) : this.each(function() {
                  var a = m(this),
                      d = a.contents();
                  d.length ? d.wrapAll(c) : a.append(c)
              })
      },
      wrap: function(c) {
          var a = m.isFunction(c);
          return this.each(function(d) {
              m(this).wrapAll(a ? c.call(this, d) : c)
          })
      },
      unwrap: function() {
          return this.parent().each(function() {
              m.nodeName(this, "body") || m(this).replaceWith(this.childNodes)
          }).end()
      }
  });
  var Qa, Ba, Ca, Jb = /alpha\([^)]*\)/i,
      sd = /opacity\s*=\s*([^)]*)/,
      td = /^(top|right|bottom|left)$/,
      ud = /^(none|table(?!-c[ea]).+)/,
      oc = /^margin/,
      Dc = RegExp("^(" + Ya + ")(.*)$", "i"),
      Wa = RegExp("^(" + Ya + ")(?!px)[a-z%]+$", "i"),
      vd = RegExp("^([+-])\x3d(" + Ya + ")", "i"),
      Qb = {
          BODY: "block"
      },
      wd = {
          position: "absolute",
          visibility: "hidden",
          display: "block"
      },
      pc = {
          letterSpacing: 0,
          fontWeight: 400
      },
      Aa = ["Top", "Right", "Bottom", "Left"],
      Pb = ["Webkit", "O", "Moz", "ms"];
  m.fn.extend({
      css: function(c, a) {
          return m.access(this, function(c, a, d) {
              var k, b = {},
                  f = 0;
              if (m.isArray(a)) {
                  k = Ba(c);
                  for (d = a.length; f < d; f++) b[a[f]] = m.css(c, a[f], !1, k);
                  return b
              }
              return d !== n ? m.style(c, a, d) : m.css(c,
                  a)
          }, c, a, 1 < arguments.length)
      },
      show: function() {
          return k(this, !0)
      },
      hide: function() {
          return k(this)
      },
      toggle: function(a) {
          return "boolean" === typeof a ? a ? this.show() : this.hide() : this.each(function() {
              c(this) ? m(this).show() : m(this).hide()
          })
      }
  });
  m.extend({
      cssHooks: {
          opacity: {
              get: function(c, a) {
                  if (a) {
                      var d = Ca(c, "opacity");
                      return "" === d ? "1" : d
                  }
              }
          }
      },
      cssNumber: {
          columnCount: !0,
          fillOpacity: !0,
          fontWeight: !0,
          lineHeight: !0,
          opacity: !0,
          order: !0,
          orphans: !0,
          widows: !0,
          zIndex: !0,
          zoom: !0
      },
      cssProps: {
          "float": m.support.cssFloat ? "cssFloat" : "styleFloat"
      },
      style: function(c, a, d, k) {
          if (c && !(3 === c.nodeType || 8 === c.nodeType || !c.style)) {
              var b, f, g, e = m.camelCase(a),
                  r = c.style;
              a = m.cssProps[e] || (m.cssProps[e] = B(r, e));
              g = m.cssHooks[a] || m.cssHooks[e];
              if (d !== n) {
                  f = typeof d;
                  if ("string" === f && (b = vd.exec(d))) d = (b[1] + 1) * b[2] + parseFloat(m.css(c, a)), f = "number";
                  if (!(null == d || "number" === f && isNaN(d)))
                      if ("number" === f && !m.cssNumber[e] && (d += "px"), !m.support.clearCloneStyle && ("" === d && 0 === a.indexOf("background")) && (r[a] = "inherit"), !g || !("set" in g) || (d = g.set(c, d, k)) !==
                          n) try {
                          r[a] = d
                      } catch (h) {}
              } else return g && "get" in g && (b = g.get(c, !1, k)) !== n ? b : r[a]
          }
      },
      css: function(c, a, d, k) {
          var b, f;
          f = m.camelCase(a);
          a = m.cssProps[f] || (m.cssProps[f] = B(c.style, f));
          (f = m.cssHooks[a] || m.cssHooks[f]) && "get" in f && (b = f.get(c, !0, d));
          b === n && (b = Ca(c, a, k));
          "normal" === b && a in pc && (b = pc[a]);
          return "" === d || d ? (c = parseFloat(b), !0 === d || m.isNumeric(c) ? c || 0 : b) : b
      }
  });
  b.getComputedStyle ? (Ba = function(c) {
      return b.getComputedStyle(c, null)
  }, Ca = function(c, a, d) {
      var k, b = (d = d || Ba(c)) ? d.getPropertyValue(a) || d[a] : n,
          f =
          c.style;
      d && ("" === b && !m.contains(c.ownerDocument, c) && (b = m.style(c, a)), Wa.test(b) && oc.test(a) && (c = f.width, a = f.minWidth, k = f.maxWidth, f.minWidth = f.maxWidth = f.width = b, b = d.width, f.width = c, f.minWidth = a, f.maxWidth = k));
      return b
  }) : J.documentElement.currentStyle && (Ba = function(c) {
      return c.currentStyle
  }, Ca = function(c, a, d) {
      var k, b, f = (d = d || Ba(c)) ? d[a] : n,
          g = c.style;
      null == f && (g && g[a]) && (f = g[a]);
      if (Wa.test(f) && !td.test(a)) {
          d = g.left;
          if (b = (k = c.runtimeStyle) && k.left) k.left = c.currentStyle.left;
          g.left = "fontSize" === a ? "1em" :
              f;
          f = g.pixelLeft + "px";
          g.left = d;
          b && (k.left = b)
      }
      return "" === f ? "auto" : f
  });
  m.each(["height", "width"], function(c, a) {
      m.cssHooks[a] = {
          get: function(c, d, k) {
              if (d) return 0 === c.offsetWidth && ud.test(m.css(c, "display")) ? m.swap(c, wd, function() {
                  return H(c, a, k)
              }) : H(c, a, k)
          },
          set: function(c, d, k) {
              var b = k && Ba(c);
              return C(c, d, k ? D(c, a, k, m.support.boxSizing && "border-box" === m.css(c, "boxSizing", !1, b), b) : 0)
          }
      }
  });
  m.support.opacity || (m.cssHooks.opacity = {
      get: function(c, a) {
          return sd.test((a && c.currentStyle ? c.currentStyle.filter : c.style.filter) ||
              "") ? 0.01 * parseFloat(RegExp.$1) + "" : a ? "1" : ""
      },
      set: function(c, a) {
          var d = c.style,
              k = c.currentStyle,
              b = m.isNumeric(a) ? "alpha(opacity\x3d" + 100 * a + ")" : "",
              f = k && k.filter || d.filter || "";
          d.zoom = 1;
          if ((1 <= a || "" === a) && "" === m.trim(f.replace(Jb, "")) && d.removeAttribute)
              if (d.removeAttribute("filter"), "" === a || k && !k.filter) return;
          d.filter = Jb.test(f) ? f.replace(Jb, b) : f + " " + b
      }
  });
  m(function() {
      m.support.reliableMarginRight || (m.cssHooks.marginRight = {
          get: function(c, a) {
              if (a) return m.swap(c, {
                  display: "inline-block"
              }, Ca, [c, "marginRight"])
          }
      });
      !m.support.pixelPosition && m.fn.position && m.each(["top", "left"], function(c, a) {
          m.cssHooks[a] = {
              get: function(c, d) {
                  if (d) return d = Ca(c, a), Wa.test(d) ? m(c).position()[a] + "px" : d
              }
          }
      })
  });
  m.expr && m.expr.filters && (m.expr.filters.hidden = function(c) {
      return 0 >= c.offsetWidth && 0 >= c.offsetHeight || !m.support.reliableHiddenOffsets && "none" === (c.style && c.style.display || m.css(c, "display"))
  }, m.expr.filters.visible = function(c) {
      return !m.expr.filters.hidden(c)
  });
  m.each({
      margin: "",
      padding: "",
      border: "Width"
  }, function(c, a) {
      m.cssHooks[c +
          a] = {
          expand: function(d) {
              var k = 0,
                  b = {};
              for (d = "string" === typeof d ? d.split(" ") : [d]; 4 > k; k++) b[c + Aa[k] + a] = d[k] || d[k - 2] || d[0];
              return b
          }
      };
      oc.test(c) || (m.cssHooks[c + a].set = C)
  });
  var xd = /%20/g,
      Ec = /\[\]$/,
      qc = /\r?\n/g,
      yd = /^(?:submit|button|image|reset|file)$/i,
      zd = /^(?:input|select|textarea|keygen)/i;
  m.fn.extend({
      serialize: function() {
          return m.param(this.serializeArray())
      },
      serializeArray: function() {
          return this.map(function() {
              var c = m.prop(this, "elements");
              return c ? m.makeArray(c) : this
          }).filter(function() {
              var c = this.type;
              return this.name && !m(this).is(":disabled") && zd.test(this.nodeName) && !yd.test(c) && (this.checked || !nb.test(c))
          }).map(function(c, a) {
              var d = m(this).val();
              return null == d ? null : m.isArray(d) ? m.map(d, function(c) {
                  return {
                      name: a.name,
                      value: c.replace(qc, "\r\n")
                  }
              }) : {
                  name: a.name,
                  value: d.replace(qc, "\r\n")
              }
          }).get()
      }
  });
  m.param = function(c, a) {
      var d, k = [],
          b = function(c, a) {
              a = m.isFunction(a) ? a() : null == a ? "" : a;
              k[k.length] = encodeURIComponent(c) + "\x3d" + encodeURIComponent(a)
          };
      a === n && (a = m.ajaxSettings && m.ajaxSettings.traditional);
      if (m.isArray(c) || c.jquery && !m.isPlainObject(c)) m.each(c, function() {
          b(this.name, this.value)
      });
      else
          for (d in c) K(d, c[d], a, b);
      return k.join("\x26").replace(xd, "+")
  };
  m.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(c, a) {
      m.fn[a] = function(c, d) {
          return 0 < arguments.length ? this.on(a, null, c, d) : this.trigger(a)
      }
  });
  m.fn.extend({
      hover: function(c,
          a) {
          return this.mouseenter(c).mouseleave(a || c)
      },
      bind: function(c, a, d) {
          return this.on(c, null, a, d)
      },
      unbind: function(c, a) {
          return this.off(c, null, a)
      },
      delegate: function(c, a, d, k) {
          return this.on(a, c, d, k)
      },
      undelegate: function(c, a, d) {
          return 1 === arguments.length ? this.off(c, "**") : this.off(a, c || "**", d)
      }
  });
  var Ja, za, Kb = m.now(),
      Lb = /\?/,
      Ad = /#.*$/,
      rc = /([?&])_=[^&]*/,
      Bd = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
      Cd = /^(?:GET|HEAD)$/,
      Dd = /^\/\//,
      sc = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
      tc = m.fn.load,
      uc = {},
      ob = {},
      vc = "*/".concat("*");
  try {
      za = Gc.href
  } catch (Jd) {
      za = J.createElement("a"), za.href = "", za = za.href
  }
  Ja = sc.exec(za.toLowerCase()) || [];
  m.fn.load = function(c, a, d) {
      if ("string" !== typeof c && tc) return tc.apply(this, arguments);
      var k, b, f, g = this,
          e = c.indexOf(" ");
      0 <= e && (k = c.slice(e, c.length), c = c.slice(0, e));
      m.isFunction(a) ? (d = a, a = n) : a && "object" === typeof a && (f = "POST");
      0 < g.length && m.ajax({
          url: c,
          type: f,
          dataType: "html",
          data: a
      }).done(function(c) {
          b = arguments;
          g.html(k ? m("\x3cdiv\x3e").append(m.parseHTML(c)).find(k) : c)
      }).complete(d && function(c,
          a) {
          g.each(d, b || [c.responseText, a, c])
      });
      return this
  };
  m.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(c, a) {
      m.fn[a] = function(c) {
          return this.on(a, c)
      }
  });
  m.extend({
      active: 0,
      lastModified: {},
      etag: {},
      ajaxSettings: {
          url: za,
          type: "GET",
          isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Ja[1]),
          global: !0,
          processData: !0,
          async: !0,
          contentType: "application/x-www-form-urlencoded; charset\x3dUTF-8",
          accepts: {
              "*": vc,
              text: "text/plain",
              html: "text/html",
              xml: "application/xml, text/xml",
              json: "application/json, text/javascript"
          },
          contents: {
              xml: /xml/,
              html: /html/,
              json: /json/
          },
          responseFields: {
              xml: "responseXML",
              text: "responseText",
              json: "responseJSON"
          },
          converters: {
              "* text": String,
              "text html": !0,
              "text json": m.parseJSON,
              "text xml": m.parseXML
          },
          flatOptions: {
              url: !0,
              context: !0
          }
      },
      ajaxSetup: function(c, a) {
          return a ? E(E(c, m.ajaxSettings), a) : E(m.ajaxSettings, c)
      },
      ajaxPrefilter: I(uc),
      ajaxTransport: I(ob),
      ajax: function(c, a) {
          function d(c, a, k, b) {
              var o, x, t, D;
              D = a;
              if (2 !== A) {
                  A = 2;
                  e && clearTimeout(e);
                  h = n;
                  g = b ||
                      "";
                  v.readyState = 0 < c ? 4 : 0;
                  b = 200 <= c && 300 > c || 304 === c;
                  if (k) {
                      t = p;
                      for (var u = v, H, z, F, y, G = t.contents, E = t.dataTypes;
                          "*" === E[0];) E.shift(), z === n && (z = t.mimeType || u.getResponseHeader("Content-Type"));
                      if (z)
                          for (y in G)
                              if (G[y] && G[y].test(z)) {
                                  E.unshift(y);
                                  break
                              } if (E[0] in k) F = E[0];
                      else {
                          for (y in k) {
                              if (!E[0] || t.converters[y + " " + E[0]]) {
                                  F = y;
                                  break
                              }
                              H || (H = y)
                          }
                          F = F || H
                      }
                      F ? (F !== E[0] && E.unshift(F), t = k[F]) : t = void 0
                  }
                  a: {
                      k = p;H = t;z = v;F = b;
                      var B, K, I, u = {},
                          G = k.dataTypes.slice();
                      if (G[1])
                          for (K in k.converters) u[K.toLowerCase()] = k.converters[K];
                      for (y = G.shift(); y;)
                          if (k.responseFields[y] && (z[k.responseFields[y]] = H), !I && (F && k.dataFilter) && (H = k.dataFilter(H, k.dataType)), I = y, y = G.shift())
                              if ("*" === y) y = I;
                              else if ("*" !== I && I !== y) {
                          K = u[I + " " + y] || u["* " + y];
                          if (!K)
                              for (B in u)
                                  if (t = B.split(" "), t[1] === y && (K = u[I + " " + t[0]] || u["* " + t[0]])) {
                                      !0 === K ? K = u[B] : !0 !== u[B] && (y = t[0], G.unshift(t[1]));
                                      break
                                  } if (!0 !== K)
                              if (K && k["throws"]) H = K(H);
                              else try {
                                  H = K(H)
                              } catch (mb) {
                                  t = {
                                      state: "parsererror",
                                      error: K ? mb : "No conversion from " + I + " to " + y
                                  };
                                  break a
                              }
                      }
                      t = {
                          state: "success",
                          data: H
                      }
                  }
                  if (b) p.ifModified &&
                      ((D = v.getResponseHeader("Last-Modified")) && (m.lastModified[f] = D), (D = v.getResponseHeader("etag")) && (m.etag[f] = D)), 204 === c || "HEAD" === p.type ? D = "nocontent" : 304 === c ? D = "notmodified" : (D = t.state, o = t.data, x = t.error, b = !x);
                  else if (x = D, c || !D) D = "error", 0 > c && (c = 0);
                  v.status = c;
                  v.statusText = (a || D) + "";
                  b ? w.resolveWith(j, [o, D, v]) : w.rejectWith(j, [v, D, x]);
                  v.statusCode(q);
                  q = n;
                  r && l.trigger(b ? "ajaxSuccess" : "ajaxError", [v, p, b ? o : x]);
                  C.fireWith(j, [v, D]);
                  r && (l.trigger("ajaxComplete", [v, p]), --m.active || m.event.trigger("ajaxStop"))
              }
          }
          "object" === typeof c && (a = c, c = n);
          a = a || {};
          var k, b, f, g, e, r, h, o, p = m.ajaxSetup({}, a),
              j = p.context || p,
              l = p.context && (j.nodeType || j.jquery) ? m(j) : m.event,
              w = m.Deferred(),
              C = m.Callbacks("once memory"),
              q = p.statusCode || {},
              t = {},
              D = {},
              A = 0,
              u = "canceled",
              v = {
                  readyState: 0,
                  getResponseHeader: function(c) {
                      var a;
                      if (2 === A) {
                          if (!o)
                              for (o = {}; a = Bd.exec(g);) o[a[1].toLowerCase()] = a[2];
                          a = o[c.toLowerCase()]
                      }
                      return null == a ? null : a
                  },
                  getAllResponseHeaders: function() {
                      return 2 === A ? g : null
                  },
                  setRequestHeader: function(c, a) {
                      var d = c.toLowerCase();
                      A || (c = D[d] = D[d] || c, t[c] = a);
                      return this
                  },
                  overrideMimeType: function(c) {
                      A || (p.mimeType = c);
                      return this
                  },
                  statusCode: function(c) {
                      var a;
                      if (c)
                          if (2 > A)
                              for (a in c) q[a] = [q[a], c[a]];
                          else v.always(c[v.status]);
                      return this
                  },
                  abort: function(c) {
                      c = c || u;
                      h && h.abort(c);
                      d(0, c);
                      return this
                  }
              };
          w.promise(v).complete = C.add;
          v.success = v.done;
          v.error = v.fail;
          p.url = ((c || p.url || za) + "").replace(Ad, "").replace(Dd, Ja[1] + "//");
          p.type = a.method || a.type || p.method || p.type;
          p.dataTypes = m.trim(p.dataType || "*").toLowerCase().match(pa) || [""];
          null == p.crossDomain && (k = sc.exec(p.url.toLowerCase()), p.crossDomain = !(!k || !(k[1] !== Ja[1] || k[2] !== Ja[2] || (k[3] || ("http:" === k[1] ? "80" : "443")) !== (Ja[3] || ("http:" === Ja[1] ? "80" : "443")))));
          p.data && (p.processData && "string" !== typeof p.data) && (p.data = m.param(p.data, p.traditional));
          W(uc, p, a, v);
          if (2 === A) return v;
          (r = p.global) && 0 === m.active++ && m.event.trigger("ajaxStart");
          p.type = p.type.toUpperCase();
          p.hasContent = !Cd.test(p.type);
          f = p.url;
          p.hasContent || (p.data && (f = p.url += (Lb.test(f) ? "\x26" : "?") + p.data, delete p.data),
              !1 === p.cache && (p.url = rc.test(f) ? f.replace(rc, "$1_\x3d" + Kb++) : f + (Lb.test(f) ? "\x26" : "?") + "_\x3d" + Kb++));
          p.ifModified && (m.lastModified[f] && v.setRequestHeader("If-Modified-Since", m.lastModified[f]), m.etag[f] && v.setRequestHeader("If-None-Match", m.etag[f]));
          (p.data && p.hasContent && !1 !== p.contentType || a.contentType) && v.setRequestHeader("Content-Type", p.contentType);
          v.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + vc + "; q\x3d0.01" : "") :
              p.accepts["*"]);
          for (b in p.headers) v.setRequestHeader(b, p.headers[b]);
          if (p.beforeSend && (!1 === p.beforeSend.call(j, v, p) || 2 === A)) return v.abort();
          u = "abort";
          for (b in {
                  success: 1,
                  error: 1,
                  complete: 1
              }) v[b](p[b]);
          if (h = W(ob, p, a, v)) {
              v.readyState = 1;
              r && l.trigger("ajaxSend", [v, p]);
              p.async && 0 < p.timeout && (e = setTimeout(function() {
                  v.abort("timeout")
              }, p.timeout));
              try {
                  A = 1, h.send(t, d)
              } catch (H) {
                  if (2 > A) d(-1, H);
                  else throw H;
              }
          } else d(-1, "No Transport");
          return v
      },
      getJSON: function(c, a, d) {
          return m.get(c, a, d, "json")
      },
      getScript: function(c,
          a) {
          return m.get(c, n, a, "script")
      }
  });
  m.each(["get", "post"], function(c, a) {
      m[a] = function(c, d, k, b) {
          m.isFunction(d) && (b = b || k, k = d, d = n);
          return m.ajax({
              url: c,
              type: a,
              dataType: b,
              data: d,
              success: k
          })
      }
  });
  m.ajaxSetup({
      accepts: {
          script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
      },
      contents: {
          script: /(?:java|ecma)script/
      },
      converters: {
          "text script": function(c) {
              m.globalEval(c);
              return c
          }
      }
  });
  m.ajaxPrefilter("script", function(c) {
      c.cache === n && (c.cache = !1);
      c.crossDomain && (c.type =
          "GET", c.global = !1)
  });
  m.ajaxTransport("script", function(c) {
      if (c.crossDomain) {
          var a, d = J.head || m("head")[0] || J.documentElement;
          return {
              send: function(k, b) {
                  a = J.createElement("script");
                  a.async = !0;
                  c.scriptCharset && (a.charset = c.scriptCharset);
                  a.src = c.url;
                  a.onload = a.onreadystatechange = function(c, d) {
                      if (d || !a.readyState || /loaded|complete/.test(a.readyState)) a.onload = a.onreadystatechange = null, a.parentNode && a.parentNode.removeChild(a), a = null, d || b(200, "success")
                  };
                  d.insertBefore(a, d.firstChild)
              },
              abort: function() {
                  if (a) a.onload(n,
                      !0)
              }
          }
      }
  });
  var wc = [],
      Mb = /(=)\?(?=&|$)|\?\?/;
  m.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
          var c = wc.pop() || m.expando + "_" + Kb++;
          this[c] = !0;
          return c
      }
  });
  m.ajaxPrefilter("json jsonp", function(c, a, d) {
      var k, f, g, e = !1 !== c.jsonp && (Mb.test(c.url) ? "url" : "string" === typeof c.data && !(c.contentType || "").indexOf("application/x-www-form-urlencoded") && Mb.test(c.data) && "data");
      if (e || "jsonp" === c.dataTypes[0]) return k = c.jsonpCallback = m.isFunction(c.jsonpCallback) ? c.jsonpCallback() : c.jsonpCallback, e ? c[e] = c[e].replace(Mb,
          "$1" + k) : !1 !== c.jsonp && (c.url += (Lb.test(c.url) ? "\x26" : "?") + c.jsonp + "\x3d" + k), c.converters["script json"] = function() {
          g || m.error(k + " was not called");
          return g[0]
      }, c.dataTypes[0] = "json", f = b[k], b[k] = function() {
          g = arguments
      }, d.always(function() {
          b[k] = f;
          c[k] && (c.jsonpCallback = a.jsonpCallback, wc.push(k));
          g && m.isFunction(f) && f(g[0]);
          g = f = n
      }), "script"
  });
  var Pa, Va, Ed = 0,
      Nb = b.ActiveXObject && function() {
          for (var c in Pa) Pa[c](n, !0)
      };
  m.ajaxSettings.xhr = b.ActiveXObject ? function() {
      var c;
      if (!(c = !this.isLocal && N())) a: {
          try {
              c =
                  new b.ActiveXObject("Microsoft.XMLHTTP");
              break a
          } catch (a) {}
          c = void 0
      }
      return c
  } : N;
  Va = m.ajaxSettings.xhr();
  m.support.cors = !!Va && "withCredentials" in Va;
  (Va = m.support.ajax = !!Va) && m.ajaxTransport(function(c) {
      if (!c.crossDomain || m.support.cors) {
          var a;
          return {
              send: function(d, k) {
                  var f, g, e = c.xhr();
                  c.username ? e.open(c.type, c.url, c.async, c.username, c.password) : e.open(c.type, c.url, c.async);
                  if (c.xhrFields)
                      for (g in c.xhrFields) e[g] = c.xhrFields[g];
                  c.mimeType && e.overrideMimeType && e.overrideMimeType(c.mimeType);
                  !c.crossDomain &&
                      !d["X-Requested-With"] && (d["X-Requested-With"] = "XMLHttpRequest");
                  try {
                      for (g in d) e.setRequestHeader(g, d[g])
                  } catch (r) {}
                  e.send(c.hasContent && c.data || null);
                  a = function(d, b) {
                      var g, r, h, p;
                      try {
                          if (a && (b || 4 === e.readyState))
                              if (a = n, f && (e.onreadystatechange = m.noop, Nb && delete Pa[f]), b) 4 !== e.readyState && e.abort();
                              else {
                                  p = {};
                                  g = e.status;
                                  r = e.getAllResponseHeaders();
                                  "string" === typeof e.responseText && (p.text = e.responseText);
                                  try {
                                      h = e.statusText
                                  } catch (o) {
                                      h = ""
                                  }!g && c.isLocal && !c.crossDomain ? g = p.text ? 200 : 404 : 1223 === g && (g = 204)
                              }
                      } catch (j) {
                          b ||
                              k(-1, j)
                      }
                      p && k(g, h, p, r)
                  };
                  c.async ? 4 === e.readyState ? setTimeout(a) : (f = ++Ed, Nb && (Pa || (Pa = {}, m(b).unload(Nb)), Pa[f] = a), e.onreadystatechange = a) : a()
              },
              abort: function() {
                  a && a(n, !0)
              }
          }
      }
  });
  var Ka, lb, Fd = /^(?:toggle|show|hide)$/,
      xc = RegExp("^(?:([+-])\x3d|)(" + Ya + ")([a-z%]*)$", "i"),
      Gd = /queueHooks$/,
      Xa = [function(a, d, k) {
          var b, f, g, e, r, h = this,
              p = {},
              o = a.style,
              j = a.nodeType && c(a),
              l = m._data(a, "fxshow");
          k.queue || (e = m._queueHooks(a, "fx"), null == e.unqueued && (e.unqueued = 0, r = e.empty.fire, e.empty.fire = function() {
                  e.unqueued || r()
              }),
              e.unqueued++, h.always(function() {
                  h.always(function() {
                      e.unqueued--;
                      m.queue(a, "fx").length || e.empty.fire()
                  })
              }));
          if (1 === a.nodeType && ("height" in d || "width" in d)) k.overflow = [o.overflow, o.overflowX, o.overflowY], "inline" === m.css(a, "display") && "none" === m.css(a, "float") && (!m.support.inlineBlockNeedsLayout || "inline" === F(a.nodeName) ? o.display = "inline-block" : o.zoom = 1);
          k.overflow && (o.overflow = "hidden", m.support.shrinkWrapBlocks || h.always(function() {
              o.overflow = k.overflow[0];
              o.overflowX = k.overflow[1];
              o.overflowY =
                  k.overflow[2]
          }));
          for (b in d)
              if (f = d[b], Fd.exec(f) && (delete d[b], g = g || "toggle" === f, f !== (j ? "hide" : "show"))) p[b] = l && l[b] || m.style(a, b);
          if (!m.isEmptyObject(p))
              for (b in l ? "hidden" in l && (j = l.hidden) : l = m._data(a, "fxshow", {}), g && (l.hidden = !j), j ? m(a).show() : h.done(function() {
                      m(a).hide()
                  }), h.done(function() {
                      var c;
                      m._removeData(a, "fxshow");
                      for (c in p) m.style(a, c, p[c])
                  }), p) d = ca(j ? l[b] : 0, b, h), b in l || (l[b] = d.start, j && (d.end = d.start, d.start = "width" === b || "height" === b ? 1 : 0))
      }],
      Ra = {
          "*": [function(c, a) {
              var d = this.createTween(c,
                      a),
                  k = d.cur(),
                  b = xc.exec(a),
                  f = b && b[3] || (m.cssNumber[c] ? "" : "px"),
                  g = (m.cssNumber[c] || "px" !== f && +k) && xc.exec(m.css(d.elem, c)),
                  e = 1,
                  r = 20;
              if (g && g[3] !== f) {
                  f = f || g[3];
                  b = b || [];
                  g = +k || 1;
                  do e = e || ".5", g /= e, m.style(d.elem, c, g + f); while (e !== (e = d.cur() / k) && 1 !== e && --r)
              }
              b && (g = d.start = +g || +k || 0, d.unit = f, d.end = b[1] ? g + (b[1] + 1) * b[2] : +b[2]);
              return d
          }]
      };
  m.Animation = m.extend(da, {
      tweener: function(c, a) {
          m.isFunction(c) ? (a = c, c = ["*"]) : c = c.split(" ");
          for (var d, k = 0, b = c.length; k < b; k++) d = c[k], Ra[d] = Ra[d] || [], Ra[d].unshift(a)
      },
      prefilter: function(c,
          a) {
          a ? Xa.unshift(c) : Xa.push(c)
      }
  });
  m.Tween = U;
  U.prototype = {
      constructor: U,
      init: function(c, a, d, k, b, f) {
          this.elem = c;
          this.prop = d;
          this.easing = b || "swing";
          this.options = a;
          this.start = this.now = this.cur();
          this.end = k;
          this.unit = f || (m.cssNumber[d] ? "" : "px")
      },
      cur: function() {
          var c = U.propHooks[this.prop];
          return c && c.get ? c.get(this) : U.propHooks._default.get(this)
      },
      run: function(c) {
          var a, d = U.propHooks[this.prop];
          this.pos = this.options.duration ? a = m.easing[this.easing](c, this.options.duration * c, 0, 1, this.options.duration) : a =
              c;
          this.now = (this.end - this.start) * a + this.start;
          this.options.step && this.options.step.call(this.elem, this.now, this);
          d && d.set ? d.set(this) : U.propHooks._default.set(this);
          return this
      }
  };
  U.prototype.init.prototype = U.prototype;
  U.propHooks = {
      _default: {
          get: function(c) {
              if (null != c.elem[c.prop] && (!c.elem.style || null == c.elem.style[c.prop])) return c.elem[c.prop];
              c = m.css(c.elem, c.prop, "");
              return !c || "auto" === c ? 0 : c
          },
          set: function(c) {
              if (m.fx.step[c.prop]) m.fx.step[c.prop](c);
              else c.elem.style && (null != c.elem.style[m.cssProps[c.prop]] ||
                  m.cssHooks[c.prop]) ? m.style(c.elem, c.prop, c.now + c.unit) : c.elem[c.prop] = c.now
          }
      }
  };
  U.propHooks.scrollTop = U.propHooks.scrollLeft = {
      set: function(c) {
          c.elem.nodeType && c.elem.parentNode && (c.elem[c.prop] = c.now)
      }
  };
  m.each(["toggle", "show", "hide"], function(c, a) {
      var d = m.fn[a];
      m.fn[a] = function(c, k, b) {
          return null == c || "boolean" === typeof c ? d.apply(this, arguments) : this.animate(S(a, !0), c, k, b)
      }
  });
  m.fn.extend({
      fadeTo: function(a, d, k, b) {
          return this.filter(c).css("opacity", 0).show().end().animate({
              opacity: d
          }, a, k, b)
      },
      animate: function(c,
          a, d, k) {
          var b = m.isEmptyObject(c),
              f = m.speed(a, d, k);
          a = function() {
              var a = da(this, m.extend({}, c), f);
              (b || m._data(this, "finish")) && a.stop(!0)
          };
          a.finish = a;
          return b || !1 === f.queue ? this.each(a) : this.queue(f.queue, a)
      },
      stop: function(c, a, d) {
          var k = function(c) {
              var a = c.stop;
              delete c.stop;
              a(d)
          };
          "string" !== typeof c && (d = a, a = c, c = n);
          a && !1 !== c && this.queue(c || "fx", []);
          return this.each(function() {
              var a = !0,
                  b = null != c && c + "queueHooks",
                  f = m.timers,
                  g = m._data(this);
              if (b) g[b] && g[b].stop && k(g[b]);
              else
                  for (b in g) g[b] && (g[b].stop && Gd.test(b)) &&
                      k(g[b]);
              for (b = f.length; b--;)
                  if (f[b].elem === this && (null == c || f[b].queue === c)) f[b].anim.stop(d), a = !1, f.splice(b, 1);
              (a || !d) && m.dequeue(this, c)
          })
      },
      finish: function(c) {
          !1 !== c && (c = c || "fx");
          return this.each(function() {
              var a, d = m._data(this),
                  k = d[c + "queue"];
              a = d[c + "queueHooks"];
              var b = m.timers,
                  f = k ? k.length : 0;
              d.finish = !0;
              m.queue(this, c, []);
              a && a.stop && a.stop.call(this, !0);
              for (a = b.length; a--;) b[a].elem === this && b[a].queue === c && (b[a].anim.stop(!0), b.splice(a, 1));
              for (a = 0; a < f; a++) k[a] && k[a].finish && k[a].finish.call(this);
              delete d.finish
          })
      }
  });
  m.each({
      slideDown: S("show"),
      slideUp: S("hide"),
      slideToggle: S("toggle"),
      fadeIn: {
          opacity: "show"
      },
      fadeOut: {
          opacity: "hide"
      },
      fadeToggle: {
          opacity: "toggle"
      }
  }, function(c, a) {
      m.fn[c] = function(c, d, k) {
          return this.animate(a, c, d, k)
      }
  });
  m.speed = function(c, a, d) {
      var k = c && "object" === typeof c ? m.extend({}, c) : {
          complete: d || !d && a || m.isFunction(c) && c,
          duration: c,
          easing: d && a || a && !m.isFunction(a) && a
      };
      k.duration = m.fx.off ? 0 : "number" === typeof k.duration ? k.duration : k.duration in m.fx.speeds ? m.fx.speeds[k.duration] :
          m.fx.speeds._default;
      if (null == k.queue || !0 === k.queue) k.queue = "fx";
      k.old = k.complete;
      k.complete = function() {
          m.isFunction(k.old) && k.old.call(this);
          k.queue && m.dequeue(this, k.queue)
      };
      return k
  };
  m.easing = {
      linear: function(c) {
          return c
      },
      swing: function(c) {
          return 0.5 - Math.cos(c * Math.PI) / 2
      }
  };
  m.timers = [];
  m.fx = U.prototype.init;
  m.fx.tick = function() {
      var c, a = m.timers,
          d = 0;
      for (Ka = m.now(); d < a.length; d++) c = a[d], !c() && a[d] === c && a.splice(d--, 1);
      a.length || m.fx.stop();
      Ka = n
  };
  m.fx.timer = function(c) {
      c() && m.timers.push(c) && m.fx.start()
  };
  m.fx.interval = 13;
  m.fx.start = function() {
      lb || (lb = setInterval(m.fx.tick, m.fx.interval))
  };
  m.fx.stop = function() {
      clearInterval(lb);
      lb = null
  };
  m.fx.speeds = {
      slow: 600,
      fast: 200,
      _default: 400
  };
  m.fx.step = {};
  m.expr && m.expr.filters && (m.expr.filters.animated = function(c) {
      return m.grep(m.timers, function(a) {
          return c === a.elem
      }).length
  });
  m.fn.offset = function(c) {
      if (arguments.length) return c === n ? this : this.each(function(a) {
          m.offset.setOffset(this, c, a)
      });
      var a, d, k = {
              top: 0,
              left: 0
          },
          b = (d = this[0]) && d.ownerDocument;
      if (b) {
          a = b.documentElement;
          if (!m.contains(a, d)) return k;
          typeof d.getBoundingClientRect !== $ && (k = d.getBoundingClientRect());
          d = ja(b);
          return {
              top: k.top + (d.pageYOffset || a.scrollTop) - (a.clientTop || 0),
              left: k.left + (d.pageXOffset || a.scrollLeft) - (a.clientLeft || 0)
          }
      }
  };
  m.offset = {
      setOffset: function(c, a, d) {
          var k = m.css(c, "position");
          "static" === k && (c.style.position = "relative");
          var b = m(c),
              f = b.offset(),
              g = m.css(c, "top"),
              e = m.css(c, "left"),
              r = {},
              h = {};
          ("absolute" === k || "fixed" === k) && -1 < m.inArray("auto", [g, e]) ? (h = b.position(), k = h.top, e = h.left) : (k = parseFloat(g) ||
              0, e = parseFloat(e) || 0);
          m.isFunction(a) && (a = a.call(c, d, f));
          null != a.top && (r.top = a.top - f.top + k);
          null != a.left && (r.left = a.left - f.left + e);
          "using" in a ? a.using.call(c, r) : b.css(r)
      }
  };
  m.fn.extend({
      position: function() {
          if (this[0]) {
              var c, a, d = {
                      top: 0,
                      left: 0
                  },
                  k = this[0];
              "fixed" === m.css(k, "position") ? a = k.getBoundingClientRect() : (c = this.offsetParent(), a = this.offset(), m.nodeName(c[0], "html") || (d = c.offset()), d.top += m.css(c[0], "borderTopWidth", !0), d.left += m.css(c[0], "borderLeftWidth", !0));
              return {
                  top: a.top - d.top - m.css(k,
                      "marginTop", !0),
                  left: a.left - d.left - m.css(k, "marginLeft", !0)
              }
          }
      },
      offsetParent: function() {
          return this.map(function() {
              for (var c = this.offsetParent || ba; c && !m.nodeName(c, "html") && "static" === m.css(c, "position");) c = c.offsetParent;
              return c || ba
          })
      }
  });
  m.each({
      scrollLeft: "pageXOffset",
      scrollTop: "pageYOffset"
  }, function(c, a) {
      var d = /Y/.test(a);
      m.fn[c] = function(k) {
          return m.access(this, function(c, k, b) {
              var f = ja(c);
              if (b === n) return f ? a in f ? f[a] : f.document.documentElement[k] : c[k];
              f ? f.scrollTo(!d ? b : m(f).scrollLeft(), d ?
                  b : m(f).scrollTop()) : c[k] = b
          }, c, k, arguments.length, null)
      }
  });
  m.each({
      Height: "height",
      Width: "width"
  }, function(c, a) {
      m.each({
          padding: "inner" + c,
          content: a,
          "": "outer" + c
      }, function(d, k) {
          m.fn[k] = function(k, b) {
              var f = arguments.length && (d || "boolean" !== typeof k),
                  g = d || (!0 === k || !0 === b ? "margin" : "border");
              return m.access(this, function(a, d, k) {
                  return m.isWindow(a) ? a.document.documentElement["client" + c] : 9 === a.nodeType ? (d = a.documentElement, Math.max(a.body["scroll" + c], d["scroll" + c], a.body["offset" + c], d["offset" + c], d["client" +
                      c])) : k === n ? m.css(a, d, g) : m.style(a, d, k, g)
              }, a, f ? k : n, f, null)
          }
      })
  });
  m.fn.size = function() {
      return this.length
  };
  m.fn.andSelf = m.fn.addBack;
  j.jQuery = m
})(window, ChemDoodle.lib);
(function(b) {
  "function" === typeof define && define.amd ? define(["jquery"], b) : "object" === typeof exports ? module.exports = b : b(ChemDoodle.lib.jQuery)
})(function(b) {
  function j(f) {
      var r = f || window.event,
          h = e.call(arguments, 1),
          j = 0,
          l = 0,
          t = 0,
          u = 0;
      f = b.event.fix(r);
      f.type = "mousewheel";
      "detail" in r && (t = -1 * r.detail);
      "wheelDelta" in r && (t = r.wheelDelta);
      "wheelDeltaY" in r && (t = r.wheelDeltaY);
      "wheelDeltaX" in r && (l = -1 * r.wheelDeltaX);
      "axis" in r && r.axis === r.HORIZONTAL_AXIS && (l = -1 * t, t = 0);
      j = 0 === t ? l : t;
      "deltaY" in r && (j = t = -1 * r.deltaY);
      "deltaX" in r && (l = r.deltaX, 0 === t && (j = -1 * l));
      if (!(0 === t && 0 === l)) {
          1 === r.deltaMode ? (r = b.data(this, "mousewheel-line-height"), j *= r, t *= r, l *= r) : 2 === r.deltaMode && (r = b.data(this, "mousewheel-page-height"), j *= r, t *= r, l *= r);
          u = Math.max(Math.abs(t), Math.abs(l));
          if (!d || u < d) d = u, 120 === d && (g = !0, d /= 40);
          g && (j /= 40, l /= 40, t /= 40);
          j = Math[1 <= j ? "floor" : "ceil"](j / d);
          l = Math[1 <= l ? "floor" : "ceil"](l / d);
          t = Math[1 <= t ? "floor" : "ceil"](t / d);
          f.deltaX = l;
          f.deltaY = t;
          f.deltaFactor = d;
          f.deltaMode = 0;
          h.unshift(f, j, l, t);
          a && clearTimeout(a);
          a = setTimeout(n,
              200);
          return (b.event.dispatch || b.event.handle).apply(this, h)
      }
  }

  function n() {
      g = d = null
  }
  var l = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
      h = "onwheel" in document || 9 <= document.documentMode ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
      e = Array.prototype.slice,
      g, a, d;
  if (b.event.fixHooks)
      for (var r = l.length; r;) b.event.fixHooks[l[--r]] = b.event.mouseHooks;
  var f = b.event.special.mousewheel = {
      version: "3.1.8",
      setup: function() {
          if (this.addEventListener)
              for (var a = h.length; a;) this.addEventListener(h[--a],
                  j, !1);
          else this.onmousewheel = j;
          b.data(this, "mousewheel-line-height", f.getLineHeight(this));
          b.data(this, "mousewheel-page-height", f.getPageHeight(this))
      },
      teardown: function() {
          if (this.removeEventListener)
              for (var a = h.length; a;) this.removeEventListener(h[--a], j, !1);
          else this.onmousewheel = null
      },
      getLineHeight: function(a) {
          return parseInt(b(a)["offsetParent" in b.fn ? "offsetParent" : "parent"]().css("fontSize"), 10)
      },
      getPageHeight: function(a) {
          return b(a).height()
      }
  };
  b.fn.extend({
      mousewheel: function(a) {
          return a ? this.bind("mousewheel",
              a) : this.trigger("mousewheel")
      },
      unmousewheel: function(a) {
          return this.unbind("mousewheel", a)
      }
  })
});
(function(b, j) {
  "object" === typeof exports ? module.exports = j(global) : "function" === typeof define && define.amd ? define([], function() {
      return j(b)
  }) : j(b)
})(ChemDoodle.lib, function(b) {
  function j(c) {
      return g = c
  }

  function n() {
      return g = "undefined" !== typeof Float32Array ? Float32Array : Array
  }
  var l = {};
  if ("undefined" != typeof Float32Array) {
      var h = new Float32Array(1),
          e = new Int32Array(h.buffer);
      l.invsqrt = function(c) {
          h[0] = c;
          e[0] = 1597463007 - (e[0] >> 1);
          var a = h[0];
          return a * (1.5 - 0.5 * c * a * a)
      }
  } else l.invsqrt = function(c) {
      return 1 /
          Math.sqrt(c)
  };
  var g = null;
  n();
  var a = {
          create: function(c) {
              var a = new g(3);
              c ? (a[0] = c[0], a[1] = c[1], a[2] = c[2]) : a[0] = a[1] = a[2] = 0;
              return a
          },
          createFrom: function(c, a, d) {
              var b = new g(3);
              b[0] = c;
              b[1] = a;
              b[2] = d;
              return b
          },
          set: function(c, a) {
              a[0] = c[0];
              a[1] = c[1];
              a[2] = c[2];
              return a
          },
          equal: function(c, a) {
              return c === a || 1E-6 > Math.abs(c[0] - a[0]) && 1E-6 > Math.abs(c[1] - a[1]) && 1E-6 > Math.abs(c[2] - a[2])
          },
          add: function(c, a, d) {
              if (!d || c === d) return c[0] += a[0], c[1] += a[1], c[2] += a[2], c;
              d[0] = c[0] + a[0];
              d[1] = c[1] + a[1];
              d[2] = c[2] + a[2];
              return d
          },
          subtract: function(c, a, d) {
              if (!d || c === d) return c[0] -= a[0], c[1] -= a[1], c[2] -= a[2], c;
              d[0] = c[0] - a[0];
              d[1] = c[1] - a[1];
              d[2] = c[2] - a[2];
              return d
          },
          multiply: function(c, a, d) {
              if (!d || c === d) return c[0] *= a[0], c[1] *= a[1], c[2] *= a[2], c;
              d[0] = c[0] * a[0];
              d[1] = c[1] * a[1];
              d[2] = c[2] * a[2];
              return d
          },
          negate: function(c, a) {
              a || (a = c);
              a[0] = -c[0];
              a[1] = -c[1];
              a[2] = -c[2];
              return a
          },
          scale: function(c, a, d) {
              if (!d || c === d) return c[0] *= a, c[1] *= a, c[2] *= a, c;
              d[0] = c[0] * a;
              d[1] = c[1] * a;
              d[2] = c[2] * a;
              return d
          },
          normalize: function(c, a) {
              a || (a = c);
              var d = c[0],
                  b = c[1],
                  f = c[2],
                  g = Math.sqrt(d * d + b * b + f * f);
              if (g) {
                  if (1 === g) return a[0] = d, a[1] = b, a[2] = f, a
              } else return a[0] = 0, a[1] = 0, a[2] = 0, a;
              g = 1 / g;
              a[0] = d * g;
              a[1] = b * g;
              a[2] = f * g;
              return a
          },
          cross: function(c, a, d) {
              d || (d = c);
              var b = c[0],
                  f = c[1];
              c = c[2];
              var g = a[0],
                  e = a[1];
              a = a[2];
              d[0] = f * a - c * e;
              d[1] = c * g - b * a;
              d[2] = b * e - f * g;
              return d
          },
          length: function(c) {
              var a = c[0],
                  d = c[1];
              c = c[2];
              return Math.sqrt(a * a + d * d + c * c)
          },
          squaredLength: function(c) {
              var a = c[0],
                  d = c[1];
              c = c[2];
              return a * a + d * d + c * c
          },
          dot: function(c, a) {
              return c[0] * a[0] + c[1] * a[1] + c[2] * a[2]
          },
          direction: function(c,
              a, d) {
              d || (d = c);
              var b = c[0] - a[0],
                  f = c[1] - a[1];
              c = c[2] - a[2];
              a = Math.sqrt(b * b + f * f + c * c);
              if (!a) return d[0] = 0, d[1] = 0, d[2] = 0, d;
              a = 1 / a;
              d[0] = b * a;
              d[1] = f * a;
              d[2] = c * a;
              return d
          },
          lerp: function(c, a, d, b) {
              b || (b = c);
              b[0] = c[0] + d * (a[0] - c[0]);
              b[1] = c[1] + d * (a[1] - c[1]);
              b[2] = c[2] + d * (a[2] - c[2]);
              return b
          },
          dist: function(c, a) {
              var d = a[0] - c[0],
                  b = a[1] - c[1],
                  f = a[2] - c[2];
              return Math.sqrt(d * d + b * b + f * f)
          }
      },
      d = null,
      r = new g(4);
  a.unproject = function(c, a, b, f, g) {
      g || (g = c);
      d || (d = q.create());
      var e = d;
      r[0] = 2 * (c[0] - f[0]) / f[2] - 1;
      r[1] = 2 * (c[1] - f[1]) / f[3] - 1;
      r[2] =
          2 * c[2] - 1;
      r[3] = 1;
      q.multiply(b, a, e);
      if (!q.inverse(e)) return null;
      q.multiplyVec4(e, r);
      if (0 === r[3]) return null;
      g[0] = r[0] / r[3];
      g[1] = r[1] / r[3];
      g[2] = r[2] / r[3];
      return g
  };
  var f = a.createFrom(1, 0, 0),
      p = a.createFrom(0, 1, 0),
      o = a.createFrom(0, 0, 1),
      w = a.create();
  a.rotationTo = function(c, d, b) {
      b || (b = t.create());
      var g = a.dot(c, d);
      if (1 <= g) t.set(u, b);
      else if (-0.999999 > g) a.cross(f, c, w), 1E-6 > a.length(w) && a.cross(p, c, w), 1E-6 > a.length(w) && a.cross(o, c, w), a.normalize(w), t.fromAngleAxis(Math.PI, w, b);
      else {
          var g = Math.sqrt(2 * (1 + g)),
              e = 1 / g;
          a.cross(c, d, w);
          b[0] = w[0] * e;
          b[1] = w[1] * e;
          b[2] = w[2] * e;
          b[3] = 0.5 * g;
          t.normalize(b)
      }
      1 < b[3] ? b[3] = 1 : -1 > b[3] && (b[3] = -1);
      return b
  };
  a.str = function(c) {
      return "[" + c[0] + ", " + c[1] + ", " + c[2] + "]"
  };
  var A = {
          create: function(c) {
              var a = new g(9);
              c ? (a[0] = c[0], a[1] = c[1], a[2] = c[2], a[3] = c[3], a[4] = c[4], a[5] = c[5], a[6] = c[6], a[7] = c[7], a[8] = c[8]) : a[0] = a[1] = a[2] = a[3] = a[4] = a[5] = a[6] = a[7] = a[8] = 0;
              return a
          },
          createFrom: function(c, a, d, b, f, e, r, h, p) {
              var o = new g(9);
              o[0] = c;
              o[1] = a;
              o[2] = d;
              o[3] = b;
              o[4] = f;
              o[5] = e;
              o[6] = r;
              o[7] = h;
              o[8] = p;
              return o
          },
          determinant: function(c) {
              var a = c[3],
                  d = c[4],
                  b = c[5],
                  f = c[6],
                  g = c[7],
                  e = c[8];
              return c[0] * (e * d - b * g) + c[1] * (-e * a + b * f) + c[2] * (g * a - d * f)
          },
          inverse: function(c, a) {
              var d = c[0],
                  b = c[1],
                  f = c[2],
                  g = c[3],
                  e = c[4],
                  r = c[5],
                  h = c[6],
                  p = c[7],
                  o = c[8],
                  j = o * e - r * p,
                  l = -o * g + r * h,
                  w = p * g - e * h,
                  n = d * j + b * l + f * w;
              if (!n) return null;
              n = 1 / n;
              a || (a = A.create());
              a[0] = j * n;
              a[1] = (-o * b + f * p) * n;
              a[2] = (r * b - f * e) * n;
              a[3] = l * n;
              a[4] = (o * d - f * h) * n;
              a[5] = (-r * d + f * g) * n;
              a[6] = w * n;
              a[7] = (-p * d + b * h) * n;
              a[8] = (e * d - b * g) * n;
              return a
          },
          multiply: function(c, a, d) {
              d || (d = c);
              var b = c[0],
                  f = c[1],
                  g = c[2],
                  e = c[3],
                  r = c[4],
                  h = c[5],
                  p = c[6],
                  o = c[7];
              c = c[8];
              var j = a[0],
                  l = a[1],
                  w = a[2],
                  n = a[3],
                  q = a[4],
                  t = a[5],
                  A = a[6],
                  u = a[7];
              a = a[8];
              d[0] = j * b + l * e + w * p;
              d[1] = j * f + l * r + w * o;
              d[2] = j * g + l * h + w * c;
              d[3] = n * b + q * e + t * p;
              d[4] = n * f + q * r + t * o;
              d[5] = n * g + q * h + t * c;
              d[6] = A * b + u * e + a * p;
              d[7] = A * f + u * r + a * o;
              d[8] = A * g + u * h + a * c;
              return d
          },
          multiplyVec2: function(c, a, d) {
              d || (d = a);
              var b = a[0];
              a = a[1];
              d[0] = b * c[0] + a * c[3] + c[6];
              d[1] = b * c[1] + a * c[4] + c[7];
              return d
          },
          multiplyVec3: function(c, a, d) {
              d || (d = a);
              var b = a[0],
                  f = a[1];
              a = a[2];
              d[0] = b * c[0] + f * c[3] + a * c[6];
              d[1] = b * c[1] + f * c[4] + a * c[7];
              d[2] = b * c[2] + f * c[5] + a * c[8];
              return d
          },
          set: function(c, a) {
              a[0] = c[0];
              a[1] = c[1];
              a[2] = c[2];
              a[3] = c[3];
              a[4] = c[4];
              a[5] = c[5];
              a[6] = c[6];
              a[7] = c[7];
              a[8] = c[8];
              return a
          },
          equal: function(c, a) {
              return c === a || 1E-6 > Math.abs(c[0] - a[0]) && 1E-6 > Math.abs(c[1] - a[1]) && 1E-6 > Math.abs(c[2] - a[2]) && 1E-6 > Math.abs(c[3] - a[3]) && 1E-6 > Math.abs(c[4] - a[4]) && 1E-6 > Math.abs(c[5] - a[5]) && 1E-6 > Math.abs(c[6] - a[6]) && 1E-6 > Math.abs(c[7] - a[7]) && 1E-6 > Math.abs(c[8] - a[8])
          },
          identity: function(c) {
              c || (c = A.create());
              c[0] = 1;
              c[1] = 0;
              c[2] = 0;
              c[3] = 0;
              c[4] = 1;
              c[5] =
                  0;
              c[6] = 0;
              c[7] = 0;
              c[8] = 1;
              return c
          },
          transpose: function(c, a) {
              if (!a || c === a) {
                  var d = c[1],
                      b = c[2],
                      f = c[5];
                  c[1] = c[3];
                  c[2] = c[6];
                  c[3] = d;
                  c[5] = c[7];
                  c[6] = b;
                  c[7] = f;
                  return c
              }
              a[0] = c[0];
              a[1] = c[3];
              a[2] = c[6];
              a[3] = c[1];
              a[4] = c[4];
              a[5] = c[7];
              a[6] = c[2];
              a[7] = c[5];
              a[8] = c[8];
              return a
          },
          toMat4: function(c, a) {
              a || (a = q.create());
              a[15] = 1;
              a[14] = 0;
              a[13] = 0;
              a[12] = 0;
              a[11] = 0;
              a[10] = c[8];
              a[9] = c[7];
              a[8] = c[6];
              a[7] = 0;
              a[6] = c[5];
              a[5] = c[4];
              a[4] = c[3];
              a[3] = 0;
              a[2] = c[2];
              a[1] = c[1];
              a[0] = c[0];
              return a
          },
          str: function(c) {
              return "[" + c[0] + ", " + c[1] + ", " + c[2] +
                  ", " + c[3] + ", " + c[4] + ", " + c[5] + ", " + c[6] + ", " + c[7] + ", " + c[8] + "]"
          }
      },
      q = {
          create: function(c) {
              var a = new g(16);
              c && (a[0] = c[0], a[1] = c[1], a[2] = c[2], a[3] = c[3], a[4] = c[4], a[5] = c[5], a[6] = c[6], a[7] = c[7], a[8] = c[8], a[9] = c[9], a[10] = c[10], a[11] = c[11], a[12] = c[12], a[13] = c[13], a[14] = c[14], a[15] = c[15]);
              return a
          },
          createFrom: function(c, a, d, b, f, e, r, h, p, o, j, l, w, n, q, t) {
              var A = new g(16);
              A[0] = c;
              A[1] = a;
              A[2] = d;
              A[3] = b;
              A[4] = f;
              A[5] = e;
              A[6] = r;
              A[7] = h;
              A[8] = p;
              A[9] = o;
              A[10] = j;
              A[11] = l;
              A[12] = w;
              A[13] = n;
              A[14] = q;
              A[15] = t;
              return A
          },
          set: function(c,
              a) {
              a[0] = c[0];
              a[1] = c[1];
              a[2] = c[2];
              a[3] = c[3];
              a[4] = c[4];
              a[5] = c[5];
              a[6] = c[6];
              a[7] = c[7];
              a[8] = c[8];
              a[9] = c[9];
              a[10] = c[10];
              a[11] = c[11];
              a[12] = c[12];
              a[13] = c[13];
              a[14] = c[14];
              a[15] = c[15];
              return a
          },
          equal: function(c, a) {
              return c === a || 1E-6 > Math.abs(c[0] - a[0]) && 1E-6 > Math.abs(c[1] - a[1]) && 1E-6 > Math.abs(c[2] - a[2]) && 1E-6 > Math.abs(c[3] - a[3]) && 1E-6 > Math.abs(c[4] - a[4]) && 1E-6 > Math.abs(c[5] - a[5]) && 1E-6 > Math.abs(c[6] - a[6]) && 1E-6 > Math.abs(c[7] - a[7]) && 1E-6 > Math.abs(c[8] - a[8]) && 1E-6 > Math.abs(c[9] - a[9]) && 1E-6 > Math.abs(c[10] - a[10]) &&
                  1E-6 > Math.abs(c[11] - a[11]) && 1E-6 > Math.abs(c[12] - a[12]) && 1E-6 > Math.abs(c[13] - a[13]) && 1E-6 > Math.abs(c[14] - a[14]) && 1E-6 > Math.abs(c[15] - a[15])
          },
          identity: function(c) {
              c || (c = q.create());
              c[0] = 1;
              c[1] = 0;
              c[2] = 0;
              c[3] = 0;
              c[4] = 0;
              c[5] = 1;
              c[6] = 0;
              c[7] = 0;
              c[8] = 0;
              c[9] = 0;
              c[10] = 1;
              c[11] = 0;
              c[12] = 0;
              c[13] = 0;
              c[14] = 0;
              c[15] = 1;
              return c
          },
          transpose: function(c, a) {
              if (!a || c === a) {
                  var d = c[1],
                      b = c[2],
                      f = c[3],
                      g = c[6],
                      e = c[7],
                      r = c[11];
                  c[1] = c[4];
                  c[2] = c[8];
                  c[3] = c[12];
                  c[4] = d;
                  c[6] = c[9];
                  c[7] = c[13];
                  c[8] = b;
                  c[9] = g;
                  c[11] = c[14];
                  c[12] = f;
                  c[13] = e;
                  c[14] = r;
                  return c
              }
              a[0] = c[0];
              a[1] = c[4];
              a[2] = c[8];
              a[3] = c[12];
              a[4] = c[1];
              a[5] = c[5];
              a[6] = c[9];
              a[7] = c[13];
              a[8] = c[2];
              a[9] = c[6];
              a[10] = c[10];
              a[11] = c[14];
              a[12] = c[3];
              a[13] = c[7];
              a[14] = c[11];
              a[15] = c[15];
              return a
          },
          determinant: function(c) {
              var a = c[0],
                  d = c[1],
                  b = c[2],
                  f = c[3],
                  g = c[4],
                  e = c[5],
                  r = c[6],
                  h = c[7],
                  p = c[8],
                  o = c[9],
                  j = c[10],
                  l = c[11],
                  w = c[12],
                  n = c[13],
                  q = c[14];
              c = c[15];
              return w * o * r * f - p * n * r * f - w * e * j * f + g * n * j * f + p * e * q * f - g * o * q * f - w * o * b * h + p * n * b * h + w * d * j * h - a * n * j * h - p * d * q * h + a * o * q * h + w * e * b * l - g * n * b * l - w * d * r * l + a * n * r * l + g * d * q * l - a * e * q * l - p * e * b * c + g * o * b *
                  c + p * d * r * c - a * o * r * c - g * d * j * c + a * e * j * c
          },
          inverse: function(c, a) {
              a || (a = c);
              var d = c[0],
                  b = c[1],
                  f = c[2],
                  g = c[3],
                  e = c[4],
                  r = c[5],
                  h = c[6],
                  p = c[7],
                  o = c[8],
                  j = c[9],
                  l = c[10],
                  w = c[11],
                  n = c[12],
                  q = c[13],
                  t = c[14],
                  A = c[15],
                  u = d * r - b * e,
                  v = d * h - f * e,
                  y = d * p - g * e,
                  z = b * h - f * r,
                  B = b * p - g * r,
                  ba = f * p - g * h,
                  ea = o * q - j * n,
                  fa = o * t - l * n,
                  X = o * A - w * n,
                  ha = j * t - l * q,
                  sa = j * A - w * q,
                  qa = l * A - w * t,
                  R = u * qa - v * sa + y * ha + z * X - B * fa + ba * ea;
              if (!R) return null;
              R = 1 / R;
              a[0] = (r * qa - h * sa + p * ha) * R;
              a[1] = (-b * qa + f * sa - g * ha) * R;
              a[2] = (q * ba - t * B + A * z) * R;
              a[3] = (-j * ba + l * B - w * z) * R;
              a[4] = (-e * qa + h * X - p * fa) * R;
              a[5] = (d * qa - f *
                  X + g * fa) * R;
              a[6] = (-n * ba + t * y - A * v) * R;
              a[7] = (o * ba - l * y + w * v) * R;
              a[8] = (e * sa - r * X + p * ea) * R;
              a[9] = (-d * sa + b * X - g * ea) * R;
              a[10] = (n * B - q * y + A * u) * R;
              a[11] = (-o * B + j * y - w * u) * R;
              a[12] = (-e * ha + r * fa - h * ea) * R;
              a[13] = (d * ha - b * fa + f * ea) * R;
              a[14] = (-n * z + q * v - t * u) * R;
              a[15] = (o * z - j * v + l * u) * R;
              return a
          },
          toRotationMat: function(c, a) {
              a || (a = q.create());
              a[0] = c[0];
              a[1] = c[1];
              a[2] = c[2];
              a[3] = c[3];
              a[4] = c[4];
              a[5] = c[5];
              a[6] = c[6];
              a[7] = c[7];
              a[8] = c[8];
              a[9] = c[9];
              a[10] = c[10];
              a[11] = c[11];
              a[12] = 0;
              a[13] = 0;
              a[14] = 0;
              a[15] = 1;
              return a
          },
          toMat3: function(c, a) {
              a || (a = A.create());
              a[0] = c[0];
              a[1] = c[1];
              a[2] = c[2];
              a[3] = c[4];
              a[4] = c[5];
              a[5] = c[6];
              a[6] = c[8];
              a[7] = c[9];
              a[8] = c[10];
              return a
          },
          toInverseMat3: function(c, a) {
              var d = c[0],
                  b = c[1],
                  f = c[2],
                  g = c[4],
                  e = c[5],
                  r = c[6],
                  h = c[8],
                  p = c[9],
                  o = c[10],
                  j = o * e - r * p,
                  l = -o * g + r * h,
                  w = p * g - e * h,
                  n = d * j + b * l + f * w;
              if (!n) return null;
              n = 1 / n;
              a || (a = A.create());
              a[0] = j * n;
              a[1] = (-o * b + f * p) * n;
              a[2] = (r * b - f * e) * n;
              a[3] = l * n;
              a[4] = (o * d - f * h) * n;
              a[5] = (-r * d + f * g) * n;
              a[6] = w * n;
              a[7] = (-p * d + b * h) * n;
              a[8] = (e * d - b * g) * n;
              return a
          },
          multiply: function(c, a, d) {
              d || (d = c);
              var b = c[0],
                  f = c[1],
                  g = c[2],
                  e = c[3],
                  r = c[4],
                  h =
                  c[5],
                  p = c[6],
                  o = c[7],
                  j = c[8],
                  l = c[9],
                  w = c[10],
                  n = c[11],
                  q = c[12],
                  t = c[13],
                  A = c[14];
              c = c[15];
              var u = a[0],
                  v = a[1],
                  y = a[2],
                  z = a[3];
              d[0] = u * b + v * r + y * j + z * q;
              d[1] = u * f + v * h + y * l + z * t;
              d[2] = u * g + v * p + y * w + z * A;
              d[3] = u * e + v * o + y * n + z * c;
              u = a[4];
              v = a[5];
              y = a[6];
              z = a[7];
              d[4] = u * b + v * r + y * j + z * q;
              d[5] = u * f + v * h + y * l + z * t;
              d[6] = u * g + v * p + y * w + z * A;
              d[7] = u * e + v * o + y * n + z * c;
              u = a[8];
              v = a[9];
              y = a[10];
              z = a[11];
              d[8] = u * b + v * r + y * j + z * q;
              d[9] = u * f + v * h + y * l + z * t;
              d[10] = u * g + v * p + y * w + z * A;
              d[11] = u * e + v * o + y * n + z * c;
              u = a[12];
              v = a[13];
              y = a[14];
              z = a[15];
              d[12] = u * b + v * r + y * j + z * q;
              d[13] = u * f + v * h + y * l + z * t;
              d[14] = u * g + v * p + y * w + z * A;
              d[15] = u * e + v * o + y * n + z * c;
              return d
          },
          multiplyVec3: function(c, a, d) {
              d || (d = a);
              var b = a[0],
                  f = a[1];
              a = a[2];
              d[0] = c[0] * b + c[4] * f + c[8] * a + c[12];
              d[1] = c[1] * b + c[5] * f + c[9] * a + c[13];
              d[2] = c[2] * b + c[6] * f + c[10] * a + c[14];
              return d
          },
          multiplyVec4: function(c, a, d) {
              d || (d = a);
              var b = a[0],
                  f = a[1],
                  g = a[2];
              a = a[3];
              d[0] = c[0] * b + c[4] * f + c[8] * g + c[12] * a;
              d[1] = c[1] * b + c[5] * f + c[9] * g + c[13] * a;
              d[2] = c[2] * b + c[6] * f + c[10] * g + c[14] * a;
              d[3] = c[3] * b + c[7] * f + c[11] * g + c[15] * a;
              return d
          },
          translate: function(c, a, d) {
              var b = a[0],
                  f = a[1];
              a = a[2];
              var g, e,
                  r, h, p, o, j, l, w, n, q, t;
              if (!d || c === d) return c[12] = c[0] * b + c[4] * f + c[8] * a + c[12], c[13] = c[1] * b + c[5] * f + c[9] * a + c[13], c[14] = c[2] * b + c[6] * f + c[10] * a + c[14], c[15] = c[3] * b + c[7] * f + c[11] * a + c[15], c;
              g = c[0];
              e = c[1];
              r = c[2];
              h = c[3];
              p = c[4];
              o = c[5];
              j = c[6];
              l = c[7];
              w = c[8];
              n = c[9];
              q = c[10];
              t = c[11];
              d[0] = g;
              d[1] = e;
              d[2] = r;
              d[3] = h;
              d[4] = p;
              d[5] = o;
              d[6] = j;
              d[7] = l;
              d[8] = w;
              d[9] = n;
              d[10] = q;
              d[11] = t;
              d[12] = g * b + p * f + w * a + c[12];
              d[13] = e * b + o * f + n * a + c[13];
              d[14] = r * b + j * f + q * a + c[14];
              d[15] = h * b + l * f + t * a + c[15];
              return d
          },
          scale: function(c, a, d) {
              var b = a[0],
                  f = a[1];
              a = a[2];
              if (!d || c === d) return c[0] *= b, c[1] *= b, c[2] *= b, c[3] *= b, c[4] *= f, c[5] *= f, c[6] *= f, c[7] *= f, c[8] *= a, c[9] *= a, c[10] *= a, c[11] *= a, c;
              d[0] = c[0] * b;
              d[1] = c[1] * b;
              d[2] = c[2] * b;
              d[3] = c[3] * b;
              d[4] = c[4] * f;
              d[5] = c[5] * f;
              d[6] = c[6] * f;
              d[7] = c[7] * f;
              d[8] = c[8] * a;
              d[9] = c[9] * a;
              d[10] = c[10] * a;
              d[11] = c[11] * a;
              d[12] = c[12];
              d[13] = c[13];
              d[14] = c[14];
              d[15] = c[15];
              return d
          },
          rotate: function(c, a, d, b) {
              var f = d[0],
                  g = d[1];
              d = d[2];
              var e = Math.sqrt(f * f + g * g + d * d),
                  r, h, p, o, j, l, w, n, q, t, A, u, v, y, z, B, ba, ea, fa, X;
              if (!e) return null;
              1 !== e && (e = 1 / e, f *= e, g *= e, d *= e);
              r = Math.sin(a);
              h = Math.cos(a);
              p = 1 - h;
              a = c[0];
              e = c[1];
              o = c[2];
              j = c[3];
              l = c[4];
              w = c[5];
              n = c[6];
              q = c[7];
              t = c[8];
              A = c[9];
              u = c[10];
              v = c[11];
              y = f * f * p + h;
              z = g * f * p + d * r;
              B = d * f * p - g * r;
              ba = f * g * p - d * r;
              ea = g * g * p + h;
              fa = d * g * p + f * r;
              X = f * d * p + g * r;
              f = g * d * p - f * r;
              g = d * d * p + h;
              b ? c !== b && (b[12] = c[12], b[13] = c[13], b[14] = c[14], b[15] = c[15]) : b = c;
              b[0] = a * y + l * z + t * B;
              b[1] = e * y + w * z + A * B;
              b[2] = o * y + n * z + u * B;
              b[3] = j * y + q * z + v * B;
              b[4] = a * ba + l * ea + t * fa;
              b[5] = e * ba + w * ea + A * fa;
              b[6] = o * ba + n * ea + u * fa;
              b[7] = j * ba + q * ea + v * fa;
              b[8] = a * X + l * f + t * g;
              b[9] = e * X + w * f + A * g;
              b[10] = o * X + n * f + u * g;
              b[11] = j * X + q * f + v * g;
              return b
          },
          rotateX: function(c, a, d) {
              var b = Math.sin(a);
              a = Math.cos(a);
              var f = c[4],
                  g = c[5],
                  e = c[6],
                  r = c[7],
                  h = c[8],
                  p = c[9],
                  o = c[10],
                  j = c[11];
              d ? c !== d && (d[0] = c[0], d[1] = c[1], d[2] = c[2], d[3] = c[3], d[12] = c[12], d[13] = c[13], d[14] = c[14], d[15] = c[15]) : d = c;
              d[4] = f * a + h * b;
              d[5] = g * a + p * b;
              d[6] = e * a + o * b;
              d[7] = r * a + j * b;
              d[8] = f * -b + h * a;
              d[9] = g * -b + p * a;
              d[10] = e * -b + o * a;
              d[11] = r * -b + j * a;
              return d
          },
          rotateY: function(c, a, d) {
              var b = Math.sin(a);
              a = Math.cos(a);
              var f = c[0],
                  g = c[1],
                  e = c[2],
                  r = c[3],
                  h = c[8],
                  p = c[9],
                  o = c[10],
                  j = c[11];
              d ? c !== d && (d[4] = c[4], d[5] = c[5], d[6] = c[6], d[7] =
                  c[7], d[12] = c[12], d[13] = c[13], d[14] = c[14], d[15] = c[15]) : d = c;
              d[0] = f * a + h * -b;
              d[1] = g * a + p * -b;
              d[2] = e * a + o * -b;
              d[3] = r * a + j * -b;
              d[8] = f * b + h * a;
              d[9] = g * b + p * a;
              d[10] = e * b + o * a;
              d[11] = r * b + j * a;
              return d
          },
          rotateZ: function(c, a, d) {
              var b = Math.sin(a);
              a = Math.cos(a);
              var f = c[0],
                  g = c[1],
                  e = c[2],
                  r = c[3],
                  h = c[4],
                  p = c[5],
                  o = c[6],
                  j = c[7];
              d ? c !== d && (d[8] = c[8], d[9] = c[9], d[10] = c[10], d[11] = c[11], d[12] = c[12], d[13] = c[13], d[14] = c[14], d[15] = c[15]) : d = c;
              d[0] = f * a + h * b;
              d[1] = g * a + p * b;
              d[2] = e * a + o * b;
              d[3] = r * a + j * b;
              d[4] = f * -b + h * a;
              d[5] = g * -b + p * a;
              d[6] = e * -b + o * a;
              d[7] = r *
                  -b + j * a;
              return d
          },
          frustum: function(c, a, d, b, f, g, e) {
              e || (e = q.create());
              var r = a - c,
                  h = b - d,
                  p = g - f;
              e[0] = 2 * f / r;
              e[1] = 0;
              e[2] = 0;
              e[3] = 0;
              e[4] = 0;
              e[5] = 2 * f / h;
              e[6] = 0;
              e[7] = 0;
              e[8] = (a + c) / r;
              e[9] = (b + d) / h;
              e[10] = -(g + f) / p;
              e[11] = -1;
              e[12] = 0;
              e[13] = 0;
              e[14] = -(2 * g * f) / p;
              e[15] = 0;
              return e
          },
          perspective: function(c, a, d, b, f) {
              c = d * Math.tan(c * Math.PI / 360);
              a *= c;
              return q.frustum(-a, a, -c, c, d, b, f)
          },
          ortho: function(c, a, d, b, f, g, e) {
              e || (e = q.create());
              var r = a - c,
                  h = b - d,
                  p = g - f;
              e[0] = 2 / r;
              e[1] = 0;
              e[2] = 0;
              e[3] = 0;
              e[4] = 0;
              e[5] = 2 / h;
              e[6] = 0;
              e[7] = 0;
              e[8] = 0;
              e[9] = 0;
              e[10] = -2 / p;
              e[11] = 0;
              e[12] = -(c + a) / r;
              e[13] = -(b + d) / h;
              e[14] = -(g + f) / p;
              e[15] = 1;
              return e
          },
          lookAt: function(c, a, d, b) {
              b || (b = q.create());
              var f, g, e, r, h, p, o, j, l = c[0],
                  w = c[1];
              c = c[2];
              e = d[0];
              r = d[1];
              g = d[2];
              o = a[0];
              d = a[1];
              f = a[2];
              if (l === o && w === d && c === f) return q.identity(b);
              a = l - o;
              d = w - d;
              o = c - f;
              j = 1 / Math.sqrt(a * a + d * d + o * o);
              a *= j;
              d *= j;
              o *= j;
              f = r * o - g * d;
              g = g * a - e * o;
              e = e * d - r * a;
              (j = Math.sqrt(f * f + g * g + e * e)) ? (j = 1 / j, f *= j, g *= j, e *= j) : e = g = f = 0;
              r = d * e - o * g;
              h = o * f - a * e;
              p = a * g - d * f;
              (j = Math.sqrt(r * r + h * h + p * p)) ? (j = 1 / j, r *= j, h *= j, p *= j) : p = h = r = 0;
              b[0] = f;
              b[1] = r;
              b[2] =
                  a;
              b[3] = 0;
              b[4] = g;
              b[5] = h;
              b[6] = d;
              b[7] = 0;
              b[8] = e;
              b[9] = p;
              b[10] = o;
              b[11] = 0;
              b[12] = -(f * l + g * w + e * c);
              b[13] = -(r * l + h * w + p * c);
              b[14] = -(a * l + d * w + o * c);
              b[15] = 1;
              return b
          },
          fromRotationTranslation: function(c, a, d) {
              d || (d = q.create());
              var b = c[0],
                  f = c[1],
                  g = c[2],
                  e = c[3],
                  r = b + b,
                  h = f + f,
                  p = g + g;
              c = b * r;
              var o = b * h,
                  b = b * p,
                  j = f * h,
                  f = f * p,
                  g = g * p,
                  r = e * r,
                  h = e * h,
                  e = e * p;
              d[0] = 1 - (j + g);
              d[1] = o + e;
              d[2] = b - h;
              d[3] = 0;
              d[4] = o - e;
              d[5] = 1 - (c + g);
              d[6] = f + r;
              d[7] = 0;
              d[8] = b + h;
              d[9] = f - r;
              d[10] = 1 - (c + j);
              d[11] = 0;
              d[12] = a[0];
              d[13] = a[1];
              d[14] = a[2];
              d[15] = 1;
              return d
          },
          str: function(c) {
              return "[" +
                  c[0] + ", " + c[1] + ", " + c[2] + ", " + c[3] + ", " + c[4] + ", " + c[5] + ", " + c[6] + ", " + c[7] + ", " + c[8] + ", " + c[9] + ", " + c[10] + ", " + c[11] + ", " + c[12] + ", " + c[13] + ", " + c[14] + ", " + c[15] + "]"
          }
      },
      t = {
          create: function(c) {
              var a = new g(4);
              c ? (a[0] = c[0], a[1] = c[1], a[2] = c[2], a[3] = c[3]) : a[0] = a[1] = a[2] = a[3] = 0;
              return a
          },
          createFrom: function(c, a, d, b) {
              var f = new g(4);
              f[0] = c;
              f[1] = a;
              f[2] = d;
              f[3] = b;
              return f
          },
          set: function(c, a) {
              a[0] = c[0];
              a[1] = c[1];
              a[2] = c[2];
              a[3] = c[3];
              return a
          },
          equal: function(c, a) {
              return c === a || 1E-6 > Math.abs(c[0] - a[0]) && 1E-6 > Math.abs(c[1] -
                  a[1]) && 1E-6 > Math.abs(c[2] - a[2]) && 1E-6 > Math.abs(c[3] - a[3])
          },
          identity: function(c) {
              c || (c = t.create());
              c[0] = 0;
              c[1] = 0;
              c[2] = 0;
              c[3] = 1;
              return c
          }
      },
      u = t.identity();
  t.calculateW = function(c, a) {
      var d = c[0],
          b = c[1],
          f = c[2];
      if (!a || c === a) return c[3] = -Math.sqrt(Math.abs(1 - d * d - b * b - f * f)), c;
      a[0] = d;
      a[1] = b;
      a[2] = f;
      a[3] = -Math.sqrt(Math.abs(1 - d * d - b * b - f * f));
      return a
  };
  t.dot = function(c, a) {
      return c[0] * a[0] + c[1] * a[1] + c[2] * a[2] + c[3] * a[3]
  };
  t.inverse = function(c, a) {
      var d = c[0],
          b = c[1],
          f = c[2],
          g = c[3],
          d = (d = d * d + b * b + f * f + g * g) ? 1 / d : 0;
      if (!a || c ===
          a) return c[0] *= -d, c[1] *= -d, c[2] *= -d, c[3] *= d, c;
      a[0] = -c[0] * d;
      a[1] = -c[1] * d;
      a[2] = -c[2] * d;
      a[3] = c[3] * d;
      return a
  };
  t.conjugate = function(c, a) {
      if (!a || c === a) return c[0] *= -1, c[1] *= -1, c[2] *= -1, c;
      a[0] = -c[0];
      a[1] = -c[1];
      a[2] = -c[2];
      a[3] = c[3];
      return a
  };
  t.length = function(c) {
      var a = c[0],
          d = c[1],
          b = c[2];
      c = c[3];
      return Math.sqrt(a * a + d * d + b * b + c * c)
  };
  t.normalize = function(c, a) {
      a || (a = c);
      var d = c[0],
          b = c[1],
          f = c[2],
          g = c[3],
          e = Math.sqrt(d * d + b * b + f * f + g * g);
      if (0 === e) return a[0] = 0, a[1] = 0, a[2] = 0, a[3] = 0, a;
      e = 1 / e;
      a[0] = d * e;
      a[1] = b * e;
      a[2] = f * e;
      a[3] =
          g * e;
      return a
  };
  t.add = function(c, a, d) {
      if (!d || c === d) return c[0] += a[0], c[1] += a[1], c[2] += a[2], c[3] += a[3], c;
      d[0] = c[0] + a[0];
      d[1] = c[1] + a[1];
      d[2] = c[2] + a[2];
      d[3] = c[3] + a[3];
      return d
  };
  t.multiply = function(c, a, d) {
      d || (d = c);
      var b = c[0],
          f = c[1],
          g = c[2];
      c = c[3];
      var e = a[0],
          r = a[1],
          h = a[2];
      a = a[3];
      d[0] = b * a + c * e + f * h - g * r;
      d[1] = f * a + c * r + g * e - b * h;
      d[2] = g * a + c * h + b * r - f * e;
      d[3] = c * a - b * e - f * r - g * h;
      return d
  };
  t.multiplyVec3 = function(c, a, d) {
      d || (d = a);
      var b = a[0],
          f = a[1],
          g = a[2];
      a = c[0];
      var e = c[1],
          r = c[2];
      c = c[3];
      var h = c * b + e * g - r * f,
          p = c * f + r * b - a * g,
          o = c * g +
          a * f - e * b,
          b = -a * b - e * f - r * g;
      d[0] = h * c + b * -a + p * -r - o * -e;
      d[1] = p * c + b * -e + o * -a - h * -r;
      d[2] = o * c + b * -r + h * -e - p * -a;
      return d
  };
  t.scale = function(c, a, d) {
      if (!d || c === d) return c[0] *= a, c[1] *= a, c[2] *= a, c[3] *= a, c;
      d[0] = c[0] * a;
      d[1] = c[1] * a;
      d[2] = c[2] * a;
      d[3] = c[3] * a;
      return d
  };
  t.toMat3 = function(c, a) {
      a || (a = A.create());
      var d = c[0],
          b = c[1],
          f = c[2],
          g = c[3],
          e = d + d,
          r = b + b,
          h = f + f,
          p = d * e,
          o = d * r,
          d = d * h,
          j = b * r,
          b = b * h,
          f = f * h,
          e = g * e,
          r = g * r,
          g = g * h;
      a[0] = 1 - (j + f);
      a[1] = o + g;
      a[2] = d - r;
      a[3] = o - g;
      a[4] = 1 - (p + f);
      a[5] = b + e;
      a[6] = d + r;
      a[7] = b - e;
      a[8] = 1 - (p + j);
      return a
  };
  t.toMat4 = function(c,
      a) {
      a || (a = q.create());
      var d = c[0],
          b = c[1],
          f = c[2],
          g = c[3],
          e = d + d,
          r = b + b,
          h = f + f,
          p = d * e,
          o = d * r,
          d = d * h,
          j = b * r,
          b = b * h,
          f = f * h,
          e = g * e,
          r = g * r,
          g = g * h;
      a[0] = 1 - (j + f);
      a[1] = o + g;
      a[2] = d - r;
      a[3] = 0;
      a[4] = o - g;
      a[5] = 1 - (p + f);
      a[6] = b + e;
      a[7] = 0;
      a[8] = d + r;
      a[9] = b - e;
      a[10] = 1 - (p + j);
      a[11] = 0;
      a[12] = 0;
      a[13] = 0;
      a[14] = 0;
      a[15] = 1;
      return a
  };
  t.slerp = function(c, a, d, b) {
      b || (b = c);
      var f = c[0] * a[0] + c[1] * a[1] + c[2] * a[2] + c[3] * a[3],
          g, e;
      if (1 <= Math.abs(f)) return b !== c && (b[0] = c[0], b[1] = c[1], b[2] = c[2], b[3] = c[3]), b;
      g = Math.acos(f);
      e = Math.sqrt(1 - f * f);
      if (0.001 > Math.abs(e)) return b[0] =
          0.5 * c[0] + 0.5 * a[0], b[1] = 0.5 * c[1] + 0.5 * a[1], b[2] = 0.5 * c[2] + 0.5 * a[2], b[3] = 0.5 * c[3] + 0.5 * a[3], b;
      f = Math.sin((1 - d) * g) / e;
      d = Math.sin(d * g) / e;
      b[0] = c[0] * f + a[0] * d;
      b[1] = c[1] * f + a[1] * d;
      b[2] = c[2] * f + a[2] * d;
      b[3] = c[3] * f + a[3] * d;
      return b
  };
  t.fromRotationMatrix = function(a, d) {
      d || (d = t.create());
      var b = a[0] + a[4] + a[8],
          f;
      if (0 < b) f = Math.sqrt(b + 1), d[3] = 0.5 * f, f = 0.5 / f, d[0] = (a[7] - a[5]) * f, d[1] = (a[2] - a[6]) * f, d[2] = (a[3] - a[1]) * f;
      else {
          f = t.fromRotationMatrix.s_iNext = t.fromRotationMatrix.s_iNext || [1, 2, 0];
          b = 0;
          a[4] > a[0] && (b = 1);
          a[8] > a[3 * b + b] &&
              (b = 2);
          var g = f[b],
              e = f[g];
          f = Math.sqrt(a[3 * b + b] - a[3 * g + g] - a[3 * e + e] + 1);
          d[b] = 0.5 * f;
          f = 0.5 / f;
          d[3] = (a[3 * e + g] - a[3 * g + e]) * f;
          d[g] = (a[3 * g + b] + a[3 * b + g]) * f;
          d[e] = (a[3 * e + b] + a[3 * b + e]) * f
      }
      return d
  };
  A.toQuat4 = t.fromRotationMatrix;
  var v = A.create();
  t.fromAxes = function(a, d, b, f) {
      v[0] = d[0];
      v[3] = d[1];
      v[6] = d[2];
      v[1] = b[0];
      v[4] = b[1];
      v[7] = b[2];
      v[2] = a[0];
      v[5] = a[1];
      v[8] = a[2];
      return t.fromRotationMatrix(v, f)
  };
  t.identity = function(a) {
      a || (a = t.create());
      a[0] = 0;
      a[1] = 0;
      a[2] = 0;
      a[3] = 1;
      return a
  };
  t.fromAngleAxis = function(a, d, b) {
      b || (b = t.create());
      a *= 0.5;
      var f = Math.sin(a);
      b[3] = Math.cos(a);
      b[0] = f * d[0];
      b[1] = f * d[1];
      b[2] = f * d[2];
      return b
  };
  t.toAngleAxis = function(a, d) {
      d || (d = a);
      var b = a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
      0 < b ? (d[3] = 2 * Math.acos(a[3]), b = l.invsqrt(b), d[0] = a[0] * b, d[1] = a[1] * b, d[2] = a[2] * b) : (d[3] = 0, d[0] = 1, d[1] = 0, d[2] = 0);
      return d
  };
  t.str = function(a) {
      return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + "]"
  };
  var z = {
          create: function(a) {
              var d = new g(2);
              a ? (d[0] = a[0], d[1] = a[1]) : (d[0] = 0, d[1] = 0);
              return d
          },
          createFrom: function(a, d) {
              var b = new g(2);
              b[0] = a;
              b[1] = d;
              return b
          },
          add: function(a, d, b) {
              b || (b = d);
              b[0] = a[0] + d[0];
              b[1] = a[1] + d[1];
              return b
          },
          subtract: function(a, d, b) {
              b || (b = d);
              b[0] = a[0] - d[0];
              b[1] = a[1] - d[1];
              return b
          },
          multiply: function(a, d, b) {
              b || (b = d);
              b[0] = a[0] * d[0];
              b[1] = a[1] * d[1];
              return b
          },
          divide: function(a, d, b) {
              b || (b = d);
              b[0] = a[0] / d[0];
              b[1] = a[1] / d[1];
              return b
          },
          scale: function(a, d, b) {
              b || (b = a);
              b[0] = a[0] * d;
              b[1] = a[1] * d;
              return b
          },
          dist: function(a, d) {
              var b = d[0] - a[0],
                  f = d[1] - a[1];
              return Math.sqrt(b * b + f * f)
          },
          set: function(a, d) {
              d[0] = a[0];
              d[1] = a[1];
              return d
          },
          equal: function(a, d) {
              return a ===
                  d || 1E-6 > Math.abs(a[0] - d[0]) && 1E-6 > Math.abs(a[1] - d[1])
          },
          negate: function(a, d) {
              d || (d = a);
              d[0] = -a[0];
              d[1] = -a[1];
              return d
          },
          normalize: function(a, d) {
              d || (d = a);
              var b = a[0] * a[0] + a[1] * a[1];
              0 < b ? (b = Math.sqrt(b), d[0] = a[0] / b, d[1] = a[1] / b) : d[0] = d[1] = 0;
              return d
          },
          cross: function(a, d, b) {
              a = a[0] * d[1] - a[1] * d[0];
              if (!b) return a;
              b[0] = b[1] = 0;
              b[2] = a;
              return b
          },
          length: function(a) {
              var d = a[0];
              a = a[1];
              return Math.sqrt(d * d + a * a)
          },
          squaredLength: function(a) {
              var d = a[0];
              a = a[1];
              return d * d + a * a
          },
          dot: function(a, d) {
              return a[0] * d[0] + a[1] * d[1]
          },
          direction: function(a, d, b) {
              b || (b = a);
              var f = a[0] - d[0];
              a = a[1] - d[1];
              d = f * f + a * a;
              if (!d) return b[0] = 0, b[1] = 0, b[2] = 0, b;
              d = 1 / Math.sqrt(d);
              b[0] = f * d;
              b[1] = a * d;
              return b
          },
          lerp: function(a, d, b, f) {
              f || (f = a);
              f[0] = a[0] + b * (d[0] - a[0]);
              f[1] = a[1] + b * (d[1] - a[1]);
              return f
          },
          str: function(a) {
              return "[" + a[0] + ", " + a[1] + "]"
          }
      },
      y = {
          create: function(a) {
              var d = new g(4);
              a ? (d[0] = a[0], d[1] = a[1], d[2] = a[2], d[3] = a[3]) : d[0] = d[1] = d[2] = d[3] = 0;
              return d
          },
          createFrom: function(a, d, b, f) {
              var e = new g(4);
              e[0] = a;
              e[1] = d;
              e[2] = b;
              e[3] = f;
              return e
          },
          set: function(a,
              d) {
              d[0] = a[0];
              d[1] = a[1];
              d[2] = a[2];
              d[3] = a[3];
              return d
          },
          equal: function(a, d) {
              return a === d || 1E-6 > Math.abs(a[0] - d[0]) && 1E-6 > Math.abs(a[1] - d[1]) && 1E-6 > Math.abs(a[2] - d[2]) && 1E-6 > Math.abs(a[3] - d[3])
          },
          identity: function(a) {
              a || (a = y.create());
              a[0] = 1;
              a[1] = 0;
              a[2] = 0;
              a[3] = 1;
              return a
          },
          transpose: function(a, d) {
              if (!d || a === d) {
                  var b = a[1];
                  a[1] = a[2];
                  a[2] = b;
                  return a
              }
              d[0] = a[0];
              d[1] = a[2];
              d[2] = a[1];
              d[3] = a[3];
              return d
          },
          determinant: function(a) {
              return a[0] * a[3] - a[2] * a[1]
          },
          inverse: function(a, d) {
              d || (d = a);
              var b = a[0],
                  f = a[1],
                  g = a[2],
                  e = a[3],
                  r = b * e - g * f;
              if (!r) return null;
              r = 1 / r;
              d[0] = e * r;
              d[1] = -f * r;
              d[2] = -g * r;
              d[3] = b * r;
              return d
          },
          multiply: function(a, d, b) {
              b || (b = a);
              var f = a[0],
                  g = a[1],
                  e = a[2];
              a = a[3];
              b[0] = f * d[0] + g * d[2];
              b[1] = f * d[1] + g * d[3];
              b[2] = e * d[0] + a * d[2];
              b[3] = e * d[1] + a * d[3];
              return b
          },
          rotate: function(a, d, b) {
              b || (b = a);
              var f = a[0],
                  g = a[1],
                  e = a[2];
              a = a[3];
              var r = Math.sin(d);
              d = Math.cos(d);
              b[0] = f * d + g * r;
              b[1] = f * -r + g * d;
              b[2] = e * d + a * r;
              b[3] = e * -r + a * d;
              return b
          },
          multiplyVec2: function(a, d, b) {
              b || (b = d);
              var f = d[0];
              d = d[1];
              b[0] = f * a[0] + d * a[1];
              b[1] = f * a[2] + d * a[3];
              return b
          },
          scale: function(a, d, b) {
              b || (b = a);
              var f = a[1],
                  g = a[2],
                  e = a[3],
                  r = d[0];
              d = d[1];
              b[0] = a[0] * r;
              b[1] = f * d;
              b[2] = g * r;
              b[3] = e * d;
              return b
          },
          str: function(a) {
              return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + "]"
          }
      },
      B = {
          create: function(a) {
              var d = new g(4);
              a ? (d[0] = a[0], d[1] = a[1], d[2] = a[2], d[3] = a[3]) : (d[0] = 0, d[1] = 0, d[2] = 0, d[3] = 0);
              return d
          },
          createFrom: function(a, d, b, f) {
              var e = new g(4);
              e[0] = a;
              e[1] = d;
              e[2] = b;
              e[3] = f;
              return e
          },
          add: function(a, d, b) {
              b || (b = d);
              b[0] = a[0] + d[0];
              b[1] = a[1] + d[1];
              b[2] = a[2] + d[2];
              b[3] = a[3] + d[3];
              return b
          },
          subtract: function(a,
              d, b) {
              b || (b = d);
              b[0] = a[0] - d[0];
              b[1] = a[1] - d[1];
              b[2] = a[2] - d[2];
              b[3] = a[3] - d[3];
              return b
          },
          multiply: function(a, d, b) {
              b || (b = d);
              b[0] = a[0] * d[0];
              b[1] = a[1] * d[1];
              b[2] = a[2] * d[2];
              b[3] = a[3] * d[3];
              return b
          },
          divide: function(a, d, b) {
              b || (b = d);
              b[0] = a[0] / d[0];
              b[1] = a[1] / d[1];
              b[2] = a[2] / d[2];
              b[3] = a[3] / d[3];
              return b
          },
          scale: function(a, d, b) {
              b || (b = a);
              b[0] = a[0] * d;
              b[1] = a[1] * d;
              b[2] = a[2] * d;
              b[3] = a[3] * d;
              return b
          },
          set: function(a, d) {
              d[0] = a[0];
              d[1] = a[1];
              d[2] = a[2];
              d[3] = a[3];
              return d
          },
          equal: function(a, d) {
              return a === d || 1E-6 > Math.abs(a[0] - d[0]) &&
                  1E-6 > Math.abs(a[1] - d[1]) && 1E-6 > Math.abs(a[2] - d[2]) && 1E-6 > Math.abs(a[3] - d[3])
          },
          negate: function(a, d) {
              d || (d = a);
              d[0] = -a[0];
              d[1] = -a[1];
              d[2] = -a[2];
              d[3] = -a[3];
              return d
          },
          length: function(a) {
              var d = a[0],
                  b = a[1],
                  f = a[2];
              a = a[3];
              return Math.sqrt(d * d + b * b + f * f + a * a)
          },
          squaredLength: function(a) {
              var d = a[0],
                  b = a[1],
                  f = a[2];
              a = a[3];
              return d * d + b * b + f * f + a * a
          },
          lerp: function(a, d, b, f) {
              f || (f = a);
              f[0] = a[0] + b * (d[0] - a[0]);
              f[1] = a[1] + b * (d[1] - a[1]);
              f[2] = a[2] + b * (d[2] - a[2]);
              f[3] = a[3] + b * (d[3] - a[3]);
              return f
          },
          str: function(a) {
              return "[" + a[0] + ", " +
                  a[1] + ", " + a[2] + ", " + a[3] + "]"
          }
      };
  b && (b.glMatrixArrayType = g, b.MatrixArray = g, b.setMatrixArrayType = j, b.determineMatrixArrayType = n, b.glMath = l, b.vec2 = z, b.vec3 = a, b.vec4 = B, b.mat2 = y, b.mat3 = A, b.mat4 = q, b.quat4 = t);
  return {
      glMatrixArrayType: g,
      MatrixArray: g,
      setMatrixArrayType: j,
      determineMatrixArrayType: n,
      glMath: l,
      vec2: z,
      vec3: a,
      vec4: B,
      mat2: y,
      mat3: A,
      mat4: q,
      quat4: t
  }
});
ChemDoodle.animations = function(b) {
  var j = {};
  b.requestAnimFrame = b.requestAnimationFrame || b.webkitRequestAnimationFrame || b.mozRequestAnimationFrame || b.oRequestAnimationFrame || b.msRequestAnimationFrame || function(j) {
      b.setTimeout(j, 1E3 / 60)
  };
  j.requestInterval = function(j, l) {
      function h() {
          (new Date).getTime() - e >= l && (j.call(), e = (new Date).getTime());
          g.value = b.requestAnimFrame(h)
      }
      if (!b.requestAnimationFrame && !b.webkitRequestAnimationFrame && (!b.mozRequestAnimationFrame || !b.mozCancelRequestAnimationFrame) && !b.oRequestAnimationFrame &&
          !b.msRequestAnimationFrame) return b.setInterval(j, l);
      var e = (new Date).getTime(),
          g = {};
      g.value = b.requestAnimFrame(h);
      return g
  };
  j.clearRequestInterval = function(j) {
      b.cancelAnimationFrame ? b.cancelAnimationFrame(j.value) : b.webkitCancelAnimationFrame ? b.webkitCancelAnimationFrame(j.value) : b.webkitCancelRequestAnimationFrame ? b.webkitCancelRequestAnimationFrame(j.value) : b.mozCancelRequestAnimationFrame ? b.mozCancelRequestAnimationFrame(j.value) : b.oCancelRequestAnimationFrame ? b.oCancelRequestAnimationFrame(j.value) :
          b.msCancelRequestAnimationFrame ? b.msCancelRequestAnimationFrame(j.value) : clearInterval(j)
  };
  j.requestTimeout = function(j, l) {
      function h() {
          (new Date).getTime() - e >= l ? j.call() : g.value = b.requestAnimFrame(h)
      }
      if (!b.requestAnimationFrame && !b.webkitRequestAnimationFrame && (!b.mozRequestAnimationFrame || !b.mozCancelRequestAnimationFrame) && !b.oRequestAnimationFrame && !b.msRequestAnimationFrame) return b.setTimeout(j, l);
      var e = (new Date).getTime(),
          g = {};
      g.value = b.requestAnimFrame(h);
      return g
  };
  j.clearRequestTimeout = function(j) {
      b.cancelAnimationFrame ?
          b.cancelAnimationFrame(j.value) : b.webkitCancelAnimationFrame ? b.webkitCancelAnimationFrame(j.value) : b.webkitCancelRequestAnimationFrame ? b.webkitCancelRequestAnimationFrame(j.value) : b.mozCancelRequestAnimationFrame ? b.mozCancelRequestAnimationFrame(j.value) : b.oCancelRequestAnimationFrame ? b.oCancelRequestAnimationFrame(j.value) : b.msCancelRequestAnimationFrame ? b.msCancelRequestAnimationFrame(j.value) : clearTimeout(j)
  };
  return j
}(window);
ChemDoodle.extensions = function(b, j, n) {
  return {
      stringStartsWith: function(b, h) {
          return b.slice(0, h.length) === h
      },
      vec3AngleFrom: function(b, h) {
          var e = j.length(b),
              g = j.length(h),
              e = j.dot(b, h) / e / g;
          return n.acos(e)
      },
      contextHashTo: function(j, h, e, g, a, d, r) {
          var f = 0,
              p = (new b.Point(h, e)).distance(new b.Point(g, a)),
              o = !1,
              w = h,
              n = e;
          h = g - h;
          for (e = a - e; f < p;) {
              if (o)
                  if (f + r > p) {
                      j.moveTo(g, a);
                      break
                  } else {
                      var q = r / p,
                          w = w + q * h,
                          n = n + q * e;
                      j.moveTo(w, n);
                      f += r
                  }
              else if (f + d > p) {
                  j.lineTo(g, a);
                  break
              } else q = d / p, w += q * h, n += q * e, j.lineTo(w, n), f += d;
              o = !o
          }
      },
      contextRoundRect: function(b, h, e, g, a, d) {
          b.beginPath();
          b.moveTo(h + d, e);
          b.lineTo(h + g - d, e);
          b.quadraticCurveTo(h + g, e, h + g, e + d);
          b.lineTo(h + g, e + a - d);
          b.quadraticCurveTo(h + g, e + a, h + g - d, e + a);
          b.lineTo(h + d, e + a);
          b.quadraticCurveTo(h, e + a, h, e + a - d);
          b.lineTo(h, e + d);
          b.quadraticCurveTo(h, e, h + d, e);
          b.closePath()
      },
      contextEllipse: function(b, h, e, g, a) {
          var d = 0.5522848 * (g / 2),
              r = 0.5522848 * (a / 2),
              f = h + g,
              p = e + a;
          g = h + g / 2;
          a = e + a / 2;
          b.beginPath();
          b.moveTo(h, a);
          b.bezierCurveTo(h, a - r, g - d, e, g, e);
          b.bezierCurveTo(g + d, e, f, a - r, f, a);
          b.bezierCurveTo(f,
              a + r, g + d, p, g, p);
          b.bezierCurveTo(g - d, p, h, a + r, h, a);
          b.closePath()
      },
      getFontString: function(b, h, e, g) {
          var a = [];
          e && a.push("bold ");
          g && a.push("italic ");
          a.push(b + "px ");
          b = 0;
          for (e = h.length; b < e; b++) g = h[b], -1 !== g.indexOf(" ") && (g = '"' + g + '"'), a.push((0 !== b ? "," : "") + g);
          return a.join("")
      }
  }
}(ChemDoodle.structures, ChemDoodle.lib.vec3, Math);
ChemDoodle.math = function(b, j, n, l, h) {
  var e = {},
      g = {
          aliceblue: "#f0f8ff",
          antiquewhite: "#faebd7",
          aqua: "#00ffff",
          aquamarine: "#7fffd4",
          azure: "#f0ffff",
          beige: "#f5f5dc",
          bisque: "#ffe4c4",
          black: "#000000",
          blanchedalmond: "#ffebcd",
          blue: "#0000ff",
          blueviolet: "#8a2be2",
          brown: "#a52a2a",
          burlywood: "#deb887",
          cadetblue: "#5f9ea0",
          chartreuse: "#7fff00",
          chocolate: "#d2691e",
          coral: "#ff7f50",
          cornflowerblue: "#6495ed",
          cornsilk: "#fff8dc",
          crimson: "#dc143c",
          cyan: "#00ffff",
          darkblue: "#00008b",
          darkcyan: "#008b8b",
          darkgoldenrod: "#b8860b",
          darkgrey: "#a9a9a9",
          darkgreen: "#006400",
          darkkhaki: "#bdb76b",
          darkmagenta: "#8b008b",
          darkolivegreen: "#556b2f",
          darkorange: "#ff8c00",
          darkorchid: "#9932cc",
          darkred: "#8b0000",
          darksalmon: "#e9967a",
          darkseagreen: "#8fbc8f",
          darkslateblue: "#483d8b",
          darkslategrey: "#2f4f4f",
          darkturquoise: "#00ced1",
          darkviolet: "#9400d3",
          deeppink: "#ff1493",
          deepskyblue: "#00bfff",
          dimgrey: "#696969",
          dodgerblue: "#1e90ff",
          firebrick: "#b22222",
          floralwhite: "#fffaf0",
          forestgreen: "#228b22",
          fuchsia: "#ff00ff",
          gainsboro: "#dcdcdc",
          ghostwhite: "#f8f8ff",
          gold: "#ffd700",
          goldenrod: "#daa520",
          grey: "#808080",
          green: "#008000",
          greenyellow: "#adff2f",
          honeydew: "#f0fff0",
          hotpink: "#ff69b4",
          "indianred ": "#cd5c5c",
          "indigo ": "#4b0082",
          ivory: "#fffff0",
          khaki: "#f0e68c",
          lavender: "#e6e6fa",
          lavenderblush: "#fff0f5",
          lawngreen: "#7cfc00",
          lemonchiffon: "#fffacd",
          lightblue: "#add8e6",
          lightcoral: "#f08080",
          lightcyan: "#e0ffff",
          lightgoldenrodyellow: "#fafad2",
          lightgrey: "#d3d3d3",
          lightgreen: "#90ee90",
          lightpink: "#ffb6c1",
          lightsalmon: "#ffa07a",
          lightseagreen: "#20b2aa",
          lightskyblue: "#87cefa",
          lightslategrey: "#778899",
          lightsteelblue: "#b0c4de",
          lightyellow: "#ffffe0",
          lime: "#00ff00",
          limegreen: "#32cd32",
          linen: "#faf0e6",
          magenta: "#ff00ff",
          maroon: "#800000",
          mediumaquamarine: "#66cdaa",
          mediumblue: "#0000cd",
          mediumorchid: "#ba55d3",
          mediumpurple: "#9370d8",
          mediumseagreen: "#3cb371",
          mediumslateblue: "#7b68ee",
          mediumspringgreen: "#00fa9a",
          mediumturquoise: "#48d1cc",
          mediumvioletred: "#c71585",
          midnightblue: "#191970",
          mintcream: "#f5fffa",
          mistyrose: "#ffe4e1",
          moccasin: "#ffe4b5",
          navajowhite: "#ffdead",
          navy: "#000080",
          oldlace: "#fdf5e6",
          olive: "#808000",
          olivedrab: "#6b8e23",
          orange: "#ffa500",
          orangered: "#ff4500",
          orchid: "#da70d6",
          palegoldenrod: "#eee8aa",
          palegreen: "#98fb98",
          paleturquoise: "#afeeee",
          palevioletred: "#d87093",
          papayawhip: "#ffefd5",
          peachpuff: "#ffdab9",
          peru: "#cd853f",
          pink: "#ffc0cb",
          plum: "#dda0dd",
          powderblue: "#b0e0e6",
          purple: "#800080",
          red: "#ff0000",
          rosybrown: "#bc8f8f",
          royalblue: "#4169e1",
          saddlebrown: "#8b4513",
          salmon: "#fa8072",
          sandybrown: "#f4a460",
          seagreen: "#2e8b57",
          seashell: "#fff5ee",
          sienna: "#a0522d",
          silver: "#c0c0c0",
          skyblue: "#87ceeb",
          slateblue: "#6a5acd",
          slategrey: "#708090",
          snow: "#fffafa",
          springgreen: "#00ff7f",
          steelblue: "#4682b4",
          tan: "#d2b48c",
          teal: "#008080",
          thistle: "#d8bfd8",
          tomato: "#ff6347",
          turquoise: "#40e0d0",
          violet: "#ee82ee",
          wheat: "#f5deb3",
          white: "#ffffff",
          whitesmoke: "#f5f5f5",
          yellow: "#ffff00",
          yellowgreen: "#9acd32"
      };
  e.angleBetweenLargest = function(a) {
      if (0 === a.length) return {
          angle: 0,
          largest: 2 * h.PI
      };
      if (1 === a.length) return {
          angle: a[0] + h.PI,
          largest: 2 * h.PI
      };
      for (var d = 0, b = 0, f = 0, g = a.length - 1; f < g; f++) {
          var e = a[f + 1] - a[f];
          e > d && (d = e, b = (a[f + 1] + a[f]) / 2)
      }
      f = a[0] + 2 * h.PI - a[a.length - 1];
      f > d && (b = a[0] - f / 2, d = f, 0 > b && (b += 2 * h.PI));
      return {
          angle: b,
          largest: d
      }
  };
  e.isBetween = function(a, d, b) {
      if (d > b) {
          var f = d;
          d = b;
          b = f
      }
      return a >= d && a <= b
  };
  l(document).ready(function() {
      b.iChemLabs.checkForUpdates({})
  });
  e.getRGB = function(a, d) {
      var b = [0, 0, 0];
      g[a.toLowerCase()] && (a = g[a.toLowerCase()]);
      if ("#" === a.charAt(0)) return 4 === a.length && (a = "#" + a.charAt(1) + a.charAt(1) + a.charAt(2) + a.charAt(2) + a.charAt(3) + a.charAt(3)), [parseInt(a.substring(1, 3), 16) / 255 * d, parseInt(a.substring(3,
          5), 16) / 255 * d, parseInt(a.substring(5, 7), 16) / 255 * d];
      if (j.stringStartsWith(a, "rgb")) {
          var f = a.replace(/rgb\(|\)/g, "").split(",");
          return 3 !== f.length ? b : [parseInt(f[0]) / 255 * d, parseInt(f[1]) / 255 * d, parseInt(f[2]) / 255 * d]
      }
      return b
  };
  e.idx2color = function(a) {
      a = a.toString(16);
      for (var d = 0, b = 6 - a.length; d < b; d++) a = "0" + a;
      return "#" + a
  };
  e.distanceFromPointToLineInclusive = function(a, d, b) {
      var f = d.distance(b);
      b = d.angle(b);
      b = h.PI / 2 - b;
      b = d.angle(a) + b;
      a = d.distance(a);
      a = new n.Point(a * h.cos(b), -a * h.sin(b));
      return e.isBetween(-a.y,
          0, f) ? h.abs(a.x) : -1
  };
  e.calculateDistanceInterior = function(a, d, b) {
      if (this.isBetween(d.x, b.x, b.x + b.w) && this.isBetween(d.y, b.y, b.y + b.w)) return a.distance(d);
      var f = [];
      f.push({
          x1: b.x,
          y1: b.y,
          x2: b.x + b.w,
          y2: b.y
      });
      f.push({
          x1: b.x,
          y1: b.y + b.h,
          x2: b.x + b.w,
          y2: b.y + b.h
      });
      f.push({
          x1: b.x,
          y1: b.y,
          x2: b.x,
          y2: b.y + b.h
      });
      f.push({
          x1: b.x + b.w,
          y1: b.y,
          x2: b.x + b.w,
          y2: b.y + b.h
      });
      b = [];
      for (var g = 0; 4 > g; g++) {
          var e = f[g];
          (e = this.intersectLines(d.x, d.y, a.x, a.y, e.x1, e.y1, e.x2, e.y2)) && b.push(e)
      }
      if (0 === b.length) return 0;
      g = d = 0;
      for (f = b.length; g <
          f; g++) {
          var e = b[g],
              j = a.x - e.x,
              e = a.y - e.y;
          d = h.max(d, h.sqrt(j * j + e * e))
      }
      return d
  };
  e.intersectLines = function(a, d, b, f, g, e, h, j) {
      b -= a;
      f -= d;
      h -= g;
      j -= e;
      var l = f * h - b * j;
      if (0 === l) return !1;
      h = (j * (a - g) - h * (d - e)) / l;
      g = (f * (a - g) - b * (d - e)) / l;
      return 0 <= g && 1 >= g && 0 <= h && 1 >= h ? {
          x: a + h * b,
          y: d + h * f
      } : !1
  };
  e.hsl2rgb = function(a, d, b) {
      var f = function(a, d, b) {
          0 > b ? b += 1 : 1 < b && (b -= 1);
          return b < 1 / 6 ? a + 6 * (d - a) * b : 0.5 > b ? d : b < 2 / 3 ? a + 6 * (d - a) * (2 / 3 - b) : a
      };
      if (0 === d) b = d = a = b;
      else {
          var g = 0.5 > b ? b * (1 + d) : b + d - b * d,
              e = 2 * b - g;
          b = f(e, g, a + 1 / 3);
          d = f(e, g, a);
          a = f(e, g, a - 1 / 3)
      }
      return [255 *
          b, 255 * d, 255 * a
      ]
  };
  e.isPointInPoly = function(a, d) {
      for (var b = !1, f = -1, g = a.length, e = g - 1; ++f < g; e = f)(a[f].y <= d.y && d.y < a[e].y || a[e].y <= d.y && d.y < a[f].y) && d.x < (a[e].x - a[f].x) * (d.y - a[f].y) / (a[e].y - a[f].y) + a[f].x && (b = !b);
      return b
  };
  e.clamp = function(a, d, b) {
      return a < d ? d : a > b ? b : a
  };
  e.rainbowAt = function(a, d, b) {
      1 > b.length ? b.push("#000000", "#FFFFFF") : 2 > b.length && b.push("#FFFFFF");
      var f = d / (b.length - 1);
      d = h.floor(a / f);
      a = (a - d * f) / f;
      f = e.getRGB(b[d], 1);
      b = e.getRGB(b[d + 1], 1);
      return "rgb(" + [255 * (f[0] + (b[0] - f[0]) * a), 255 * (f[1] + (b[1] -
          f[1]) * a), 255 * (f[2] + (b[2] - f[2]) * a)].join() + ")"
  };
  e.angleBounds = function(a, d, b) {
      for (var f = 2 * h.PI; 0 > a;) a += f;
      for (; a > f;) a -= f;
      b && a > h.PI && (a = 2 * h.PI - a);
      d && (a = 180 * a / h.PI);
      return a
  };
  return e
}(ChemDoodle, ChemDoodle.extensions, ChemDoodle.structures, ChemDoodle.lib.jQuery, Math);
(function(b, j) {
  b.Bounds = function() {};
  var n = b.Bounds.prototype;
  n.minX = n.minY = n.minZ = Infinity;
  n.maxX = n.maxY = n.maxZ = -Infinity;
  n.expand = function(l, h, e, g) {
      l instanceof b.Bounds ? (this.minX = j.min(this.minX, l.minX), this.minY = j.min(this.minY, l.minY), this.maxX = j.max(this.maxX, l.maxX), this.maxY = j.max(this.maxY, l.maxY), Infinity !== l.maxZ && (this.minZ = j.min(this.minZ, l.minZ), this.maxZ = j.max(this.maxZ, l.maxZ))) : (this.minX = j.min(this.minX, l), this.maxX = j.max(this.maxX, l), this.minY = j.min(this.minY, h), this.maxY = j.max(this.maxY,
          h), void 0 !== e && void 0 !== g && (this.minX = j.min(this.minX, e), this.maxX = j.max(this.maxX, e), this.minY = j.min(this.minY, g), this.maxY = j.max(this.maxY, g)))
  };
  n.expand3D = function(b, h, e, g, a, d) {
      this.minX = j.min(this.minX, b);
      this.maxX = j.max(this.maxX, b);
      this.minY = j.min(this.minY, h);
      this.maxY = j.max(this.maxY, h);
      this.minZ = j.min(this.minZ, e);
      this.maxZ = j.max(this.maxZ, e);
      void 0 !== g && (void 0 !== a && void 0 !== d) && (this.minX = j.min(this.minX, g), this.maxX = j.max(this.maxX, g), this.minY = j.min(this.minY, a), this.maxY = j.max(this.maxY,
          a), this.minZ = j.min(this.minZ, d), this.maxZ = j.max(this.maxZ, d))
  }
})(ChemDoodle.math, Math);
(function() {
  var b = {
          subtract: function(a, d) {
              return {
                  x: a.x - d.x,
                  y: a.y - d.y
              }
          },
          dotProduct: function(a, d) {
              return a.x * d.x + a.y * d.y
          },
          square: function(a) {
              return Math.sqrt(a.x * a.x + a.y * a.y)
          },
          scale: function(a, d) {
              return {
                  x: a.x * d,
                  y: a.y * d
              }
          }
      },
      j = Math.pow(2, -65),
      n = function(a, d) {
          for (var g = [], e = d.length - 1, r = 2 * e - 1, j = [], n = [], u = [], v = [], z = [
                  [1, 0.6, 0.3, 0.1],
                  [0.4, 0.6, 0.6, 0.4],
                  [0.1, 0.3, 0.6, 1]
              ], y = 0; y <= e; y++) j[y] = b.subtract(d[y], a);
          for (y = 0; y <= e - 1; y++) n[y] = b.subtract(d[y + 1], d[y]), n[y] = b.scale(n[y], 3);
          for (y = 0; y <= e - 1; y++)
              for (var B = 0; B <=
                  e; B++) u[y] || (u[y] = []), u[y][B] = b.dotProduct(n[y], j[B]);
          for (y = 0; y <= r; y++) v[y] || (v[y] = []), v[y].y = 0, v[y].x = parseFloat(y) / r;
          r = e - 1;
          for (j = 0; j <= e + r; j++) {
              y = Math.max(0, j - r);
              for (n = Math.min(j, e); y <= n; y++) B = j - y, v[y + B].y += u[B][y] * z[B][y]
          }
          e = d.length - 1;
          v = l(v, 2 * e - 1, g, 0);
          r = b.subtract(a, d[0]);
          u = b.square(r);
          for (y = z = 0; y < v; y++) r = b.subtract(a, h(d, e, g[y], null, null)), r = b.square(r), r < u && (u = r, z = g[y]);
          r = b.subtract(a, d[e]);
          r = b.square(r);
          r < u && (u = r, z = 1);
          return {
              location: z,
              distance: u
          }
      },
      l = function(a, d, b, g) {
          var e = [],
              r = [],
              n = [],
              u = [],
              v = 0,
              z, y;
          y = 0 == a[0].y ? 0 : 0 < a[0].y ? 1 : -1;
          for (var B = 1; B <= d; B++) z = 0 == a[B].y ? 0 : 0 < a[B].y ? 1 : -1, z != y && v++, y = z;
          switch (v) {
              case 0:
                  return 0;
              case 1:
                  if (64 <= g) return b[0] = (a[0].x + a[d].x) / 2, 1;
                  var c, k, C, v = a[0].y - a[d].y;
                  z = a[d].x - a[0].x;
                  y = a[0].x * a[d].y - a[d].x * a[0].y;
                  B = c = 0;
                  for (k = 1; k < d; k++) C = v * a[k].x + z * a[k].y + y, C > c ? c = C : C < B && (B = C);
                  C = z;
                  k = 0 * C - 1 * v;
                  c = (1 * (y - c) - 0 * C) * (1 / k);
                  C = z;
                  k = 0 * C - 1 * v;
                  v = (1 * (y - B) - 0 * C) * (1 / k);
                  z = Math.min(c, v);
                  if (Math.max(c, v) - z < j) return n = a[d].x - a[0].x, u = a[d].y - a[0].y, b[0] = 0 + 1 * (n * (a[0].y - 0) - u * (a[0].x - 0)) * (1 / (0 * n -
                      1 * u)), 1
          }
          h(a, d, 0.5, e, r);
          a = l(e, d, n, g + 1);
          d = l(r, d, u, g + 1);
          for (g = 0; g < a; g++) b[g] = n[g];
          for (g = 0; g < d; g++) b[g + a] = u[g];
          return a + d
      },
      h = function(a, d, b, g, e) {
          for (var h = [
                  []
              ], r = 0; r <= d; r++) h[0][r] = a[r];
          for (a = 1; a <= d; a++)
              for (r = 0; r <= d - a; r++) h[a] || (h[a] = []), h[a][r] || (h[a][r] = {}), h[a][r].x = (1 - b) * h[a - 1][r].x + b * h[a - 1][r + 1].x, h[a][r].y = (1 - b) * h[a - 1][r].y + b * h[a - 1][r + 1].y;
          if (null != g)
              for (r = 0; r <= d; r++) g[r] = h[r][0];
          if (null != e)
              for (r = 0; r <= d; r++) e[r] = h[d - r][r];
          return h[d][0]
      },
      e = {},
      g = function(a, d) {
          var b, g = a.length - 1;
          b = e[g];
          if (!b) {
              b = [];
              var h = function(a) {
                      return function() {
                          return a
                      }
                  },
                  r = function() {
                      return function(a) {
                          return a
                      }
                  },
                  j = function() {
                      return function(a) {
                          return 1 - a
                      }
                  },
                  l = function(a) {
                      return function(c) {
                          for (var d = 1, b = 0; b < a.length; b++) d *= a[b](c);
                          return d
                      }
                  };
              b.push(new function() {
                  return function(a) {
                      return Math.pow(a, g)
                  }
              });
              for (var n = 1; n < g; n++) {
                  for (var z = [new h(g)], y = 0; y < g - n; y++) z.push(new r);
                  for (y = 0; y < n; y++) z.push(new j);
                  b.push(new l(z))
              }
              b.push(new function() {
                  return function(a) {
                      return Math.pow(1 - a, g)
                  }
              });
              e[g] = b
          }
          for (j = r = h = 0; j < a.length; j++) h +=
              a[j].x * b[j](d), r += a[j].y * b[j](d);
          return {
              x: h,
              y: r
          }
      },
      a = function(a, d) {
          return Math.sqrt(Math.pow(a.x - d.x, 2) + Math.pow(a.y - d.y, 2))
      },
      d = function(d, b, e) {
          for (var h = g(d, b), r = 0, j = 0 < e ? 1 : -1, l = null; r < Math.abs(e);) b += 0.005 * j, l = g(d, b), r += a(l, h), h = l;
          return {
              point: l,
              location: b
          }
      },
      r = function(a, d) {
          var b = g(a, d),
              e = g(a.slice(0, a.length - 1), d),
              h = e.y - b.y,
              b = e.x - b.x;
          return 0 == h ? Infinity : Math.atan(h / b)
      };
  ChemDoodle.math.jsBezier = {
      distanceFromCurve: n,
      gradientAtPoint: r,
      gradientAtPointAlongCurveFrom: function(a, b, g) {
          b = d(a, b, g);
          1 < b.location &&
              (b.location = 1);
          0 > b.location && (b.location = 0);
          return r(a, b.location)
      },
      nearestPointOnCurve: function(a, d) {
          var b = n(a, d);
          return {
              point: h(d, d.length - 1, b.location, null, null),
              location: b.location
          }
      },
      pointOnCurve: g,
      pointAlongCurveFrom: function(a, b, g) {
          return d(a, b, g).point
      },
      perpendicularToCurveAt: function(a, b, g, e) {
          b = d(a, b, null == e ? 0 : e);
          a = r(a, b.location);
          e = Math.atan(-1 / a);
          a = g / 2 * Math.sin(e);
          g = g / 2 * Math.cos(e);
          return [{
              x: b.point.x + g,
              y: b.point.y + a
          }, {
              x: b.point.x - g,
              y: b.point.y - a
          }]
      },
      locationAlongCurveFrom: function(a, b, g) {
          return d(a,
              b, g).location
      },
      getLength: function(d) {
          for (var b = g(d, 0), e = 0, h = 0, r = null; 1 > h;) h += 0.005, r = g(d, h), e += a(r, b), b = r;
          return e
      }
  }
})(ChemDoodle.math);
ChemDoodle.featureDetection = function(b, j, n, l) {
  var h = {
      supports_canvas: function() {
          return !!n.createElement("canvas").getContext
      },
      supports_canvas_text: function() {
          return !h.supports_canvas() ? !1 : "function" === typeof n.createElement("canvas").getContext("2d").fillText
      },
      supports_webgl: function() {
          var b = n.createElement("canvas");
          try {
              if (b.getContext("webgl") || b.getContext("experimental-webgl")) return !0
          } catch (g) {}
          return !1
      },
      supports_xhr2: function() {
          return j.support.cors
      },
      supports_touch: function() {
          return "ontouchstart" in
              l && navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|BB10/i)
      },
      supports_gesture: function() {
          return "ongesturestart" in l
      }
  };
  return h
}(ChemDoodle.iChemLabs, ChemDoodle.lib.jQuery, document, window);
ChemDoodle.SYMBOLS = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Uut Uuq Uup Uuh Uus Uuo".split(" ");
ChemDoodle.ELEMENT = function() {
  function b(b, j, h, e, g, a, d, r, f) {
      this.symbol = b;
      this.name = j;
      this.atomicNumber = h;
      this.addH = e;
      this.jmolColor = this.pymolColor = g;
      this.covalentRadius = a;
      this.vdWRadius = d;
      this.valency = r;
      this.mass = f
  }
  var j = [];
  j.H = new b("H", "Hydrogen", 1, !1, "#FFFFFF", 0.31, 1.2, 1, 1);
  j.He = new b("He", "Helium", 2, !1, "#D9FFFF", 0.28, 1.4, 0, 4);
  j.Li = new b("Li", "Lithium", 3, !1, "#CC80FF", 1.28, 1.82, 1, 7);
  j.Be = new b("Be", "Beryllium", 4, !1, "#C2FF00", 0.96, 0, 2, 9);
  j.B = new b("B", "Boron", 5, !0, "#FFB5B5", 0.84, 0, 3, 11);
  j.C = new b("C",
      "Carbon", 6, !0, "#909090", 0.76, 1.7, 4, 12);
  j.N = new b("N", "Nitrogen", 7, !0, "#3050F8", 0.71, 1.55, 3, 14);
  j.O = new b("O", "Oxygen", 8, !0, "#FF0D0D", 0.66, 1.52, 2, 16);
  j.F = new b("F", "Fluorine", 9, !0, "#90E050", 0.57, 1.47, 1, 19);
  j.Ne = new b("Ne", "Neon", 10, !1, "#B3E3F5", 0.58, 1.54, 0, 20);
  j.Na = new b("Na", "Sodium", 11, !1, "#AB5CF2", 1.66, 2.27, 1, 23);
  j.Mg = new b("Mg", "Magnesium", 12, !1, "#8AFF00", 1.41, 1.73, 0, 24);
  j.Al = new b("Al", "Aluminum", 13, !1, "#BFA6A6", 1.21, 0, 0, 27);
  j.Si = new b("Si", "Silicon", 14, !0, "#F0C8A0", 1.11, 2.1, 4, 28);
  j.P = new b("P",
      "Phosphorus", 15, !0, "#FF8000", 1.07, 1.8, 3, 31);
  j.S = new b("S", "Sulfur", 16, !0, "#FFFF30", 1.05, 1.8, 2, 32);
  j.Cl = new b("Cl", "Chlorine", 17, !0, "#1FF01F", 1.02, 1.75, 1, 35);
  j.Ar = new b("Ar", "Argon", 18, !1, "#80D1E3", 1.06, 1.88, 0, 40);
  j.K = new b("K", "Potassium", 19, !1, "#8F40D4", 2.03, 2.75, 0, 39);
  j.Ca = new b("Ca", "Calcium", 20, !1, "#3DFF00", 1.76, 0, 0, 40);
  j.Sc = new b("Sc", "Scandium", 21, !1, "#E6E6E6", 1.7, 0, 0, 45);
  j.Ti = new b("Ti", "Titanium", 22, !1, "#BFC2C7", 1.6, 0, 1, 48);
  j.V = new b("V", "Vanadium", 23, !1, "#A6A6AB", 1.53, 0, 1, 51);
  j.Cr = new b("Cr",
      "Chromium", 24, !1, "#8A99C7", 1.39, 0, 2, 52);
  j.Mn = new b("Mn", "Manganese", 25, !1, "#9C7AC7", 1.39, 0, 3, 55);
  j.Fe = new b("Fe", "Iron", 26, !1, "#E06633", 1.32, 0, 2, 56);
  j.Co = new b("Co", "Cobalt", 27, !1, "#F090A0", 1.26, 0, 1, 59);
  j.Ni = new b("Ni", "Nickel", 28, !1, "#50D050", 1.24, 1.63, 1, 58);
  j.Cu = new b("Cu", "Copper", 29, !1, "#C88033", 1.32, 1.4, 0, 63);
  j.Zn = new b("Zn", "Zinc", 30, !1, "#7D80B0", 1.22, 1.39, 0, 64);
  j.Ga = new b("Ga", "Gallium", 31, !1, "#C28F8F", 1.22, 1.87, 0, 69);
  j.Ge = new b("Ge", "Germanium", 32, !1, "#668F8F", 1.2, 0, 4, 74);
  j.As = new b("As",
      "Arsenic", 33, !0, "#BD80E3", 1.19, 1.85, 3, 75);
  j.Se = new b("Se", "Selenium", 34, !0, "#FFA100", 1.2, 1.9, 2, 80);
  j.Br = new b("Br", "Bromine", 35, !0, "#A62929", 1.2, 1.85, 1, 79);
  j.Kr = new b("Kr", "Krypton", 36, !1, "#5CB8D1", 1.16, 2.02, 0, 84);
  j.Rb = new b("Rb", "Rubidium", 37, !1, "#702EB0", 2.2, 0, 0, 85);
  j.Sr = new b("Sr", "Strontium", 38, !1, "#00FF00", 1.95, 0, 0, 88);
  j.Y = new b("Y", "Yttrium", 39, !1, "#94FFFF", 1.9, 0, 0, 89);
  j.Zr = new b("Zr", "Zirconium", 40, !1, "#94E0E0", 1.75, 0, 0, 90);
  j.Nb = new b("Nb", "Niobium", 41, !1, "#73C2C9", 1.64, 0, 1, 93);
  j.Mo = new b("Mo",
      "Molybdenum", 42, !1, "#54B5B5", 1.54, 0, 2, 98);
  j.Tc = new b("Tc", "Technetium", 43, !1, "#3B9E9E", 1.47, 0, 3, 0);
  j.Ru = new b("Ru", "Ruthenium", 44, !1, "#248F8F", 1.46, 0, 2, 102);
  j.Rh = new b("Rh", "Rhodium", 45, !1, "#0A7D8C", 1.42, 0, 1, 103);
  j.Pd = new b("Pd", "Palladium", 46, !1, "#006985", 1.39, 1.63, 0, 106);
  j.Ag = new b("Ag", "Silver", 47, !1, "#C0C0C0", 1.45, 1.72, 0, 107);
  j.Cd = new b("Cd", "Cadmium", 48, !1, "#FFD98F", 1.44, 1.58, 0, 114);
  j.In = new b("In", "Indium", 49, !1, "#A67573", 1.42, 1.93, 0, 115);
  j.Sn = new b("Sn", "Tin", 50, !1, "#668080", 1.39, 2.17, 4, 120);
  j.Sb = new b("Sb", "Antimony", 51, !1, "#9E63B5", 1.39, 0, 3, 121);
  j.Te = new b("Te", "Tellurium", 52, !0, "#D47A00", 1.38, 2.06, 2, 130);
  j.I = new b("I", "Iodine", 53, !0, "#940094", 1.39, 1.98, 1, 127);
  j.Xe = new b("Xe", "Xenon", 54, !1, "#429EB0", 1.4, 2.16, 0, 132);
  j.Cs = new b("Cs", "Cesium", 55, !1, "#57178F", 2.44, 0, 0, 133);
  j.Ba = new b("Ba", "Barium", 56, !1, "#00C900", 2.15, 0, 0, 138);
  j.La = new b("La", "Lanthanum", 57, !1, "#70D4FF", 2.07, 0, 0, 139);
  j.Ce = new b("Ce", "Cerium", 58, !1, "#FFFFC7", 2.04, 0, 0, 140);
  j.Pr = new b("Pr", "Praseodymium", 59, !1, "#D9FFC7", 2.03,
      0, 0, 141);
  j.Nd = new b("Nd", "Neodymium", 60, !1, "#C7FFC7", 2.01, 0, 0, 142);
  j.Pm = new b("Pm", "Promethium", 61, !1, "#A3FFC7", 1.99, 0, 0, 0);
  j.Sm = new b("Sm", "Samarium", 62, !1, "#8FFFC7", 1.98, 0, 0, 152);
  j.Eu = new b("Eu", "Europium", 63, !1, "#61FFC7", 1.98, 0, 0, 153);
  j.Gd = new b("Gd", "Gadolinium", 64, !1, "#45FFC7", 1.96, 0, 0, 158);
  j.Tb = new b("Tb", "Terbium", 65, !1, "#30FFC7", 1.94, 0, 0, 159);
  j.Dy = new b("Dy", "Dysprosium", 66, !1, "#1FFFC7", 1.92, 0, 0, 164);
  j.Ho = new b("Ho", "Holmium", 67, !1, "#00FF9C", 1.92, 0, 0, 165);
  j.Er = new b("Er", "Erbium", 68, !1, "#00E675",
      1.89, 0, 0, 166);
  j.Tm = new b("Tm", "Thulium", 69, !1, "#00D452", 1.9, 0, 0, 169);
  j.Yb = new b("Yb", "Ytterbium", 70, !1, "#00BF38", 1.87, 0, 0, 174);
  j.Lu = new b("Lu", "Lutetium", 71, !1, "#00AB24", 1.87, 0, 0, 175);
  j.Hf = new b("Hf", "Hafnium", 72, !1, "#4DC2FF", 1.75, 0, 0, 180);
  j.Ta = new b("Ta", "Tantalum", 73, !1, "#4DA6FF", 1.7, 0, 1, 181);
  j.W = new b("W", "Tungsten", 74, !1, "#2194D6", 1.62, 0, 2, 184);
  j.Re = new b("Re", "Rhenium", 75, !1, "#267DAB", 1.51, 0, 3, 187);
  j.Os = new b("Os", "Osmium", 76, !1, "#266696", 1.44, 0, 2, 192);
  j.Ir = new b("Ir", "Iridium", 77, !1, "#175487",
      1.41, 0, 3, 193);
  j.Pt = new b("Pt", "Platinum", 78, !1, "#D0D0E0", 1.36, 1.75, 0, 195);
  j.Au = new b("Au", "Gold", 79, !1, "#FFD123", 1.36, 1.66, 1, 197);
  j.Hg = new b("Hg", "Mercury", 80, !1, "#B8B8D0", 1.32, 1.55, 0, 202);
  j.Tl = new b("Tl", "Thallium", 81, !1, "#A6544D", 1.45, 1.96, 0, 205);
  j.Pb = new b("Pb", "Lead", 82, !1, "#575961", 1.46, 2.02, 4, 208);
  j.Bi = new b("Bi", "Bismuth", 83, !1, "#9E4FB5", 1.48, 0, 3, 209);
  j.Po = new b("Po", "Polonium", 84, !1, "#AB5C00", 1.4, 0, 2, 0);
  j.At = new b("At", "Astatine", 85, !0, "#754F45", 1.5, 0, 1, 0);
  j.Rn = new b("Rn", "Radon", 86, !1, "#428296",
      1.5, 0, 0, 0);
  j.Fr = new b("Fr", "Francium", 87, !1, "#420066", 2.6, 0, 0, 0);
  j.Ra = new b("Ra", "Radium", 88, !1, "#007D00", 2.21, 0, 0, 0);
  j.Ac = new b("Ac", "Actinium", 89, !1, "#70ABFA", 2.15, 0, 0, 0);
  j.Th = new b("Th", "Thorium", 90, !1, "#00BAFF", 2.06, 0, 0, 232);
  j.Pa = new b("Pa", "Protactinium", 91, !1, "#00A1FF", 2, 0, 0, 231);
  j.U = new b("U", "Uranium", 92, !1, "#008FFF", 1.96, 1.86, 0, 238);
  j.Np = new b("Np", "Neptunium", 93, !1, "#0080FF", 1.9, 0, 0, 0);
  j.Pu = new b("Pu", "Plutonium", 94, !1, "#006BFF", 1.87, 0, 0, 0);
  j.Am = new b("Am", "Americium", 95, !1, "#545CF2", 1.8,
      0, 0, 0);
  j.Cm = new b("Cm", "Curium", 96, !1, "#785CE3", 1.69, 0, 0, 0);
  j.Bk = new b("Bk", "Berkelium", 97, !1, "#8A4FE3", 0, 0, 0, 0);
  j.Cf = new b("Cf", "Californium", 98, !1, "#A136D4", 0, 0, 0, 0);
  j.Es = new b("Es", "Einsteinium", 99, !1, "#B31FD4", 0, 0, 0, 0);
  j.Fm = new b("Fm", "Fermium", 100, !1, "#B31FBA", 0, 0, 0, 0);
  j.Md = new b("Md", "Mendelevium", 101, !1, "#B30DA6", 0, 0, 0, 0);
  j.No = new b("No", "Nobelium", 102, !1, "#BD0D87", 0, 0, 0, 0);
  j.Lr = new b("Lr", "Lawrencium", 103, !1, "#C70066", 0, 0, 0, 0);
  j.Rf = new b("Rf", "Rutherfordium", 104, !1, "#CC0059", 0, 0, 0, 0);
  j.Db =
      new b("Db", "Dubnium", 105, !1, "#D1004F", 0, 0, 0, 0);
  j.Sg = new b("Sg", "Seaborgium", 106, !1, "#D90045", 0, 0, 0, 0);
  j.Bh = new b("Bh", "Bohrium", 107, !1, "#E00038", 0, 0, 0, 0);
  j.Hs = new b("Hs", "Hassium", 108, !1, "#E6002E", 0, 0, 0, 0);
  j.Mt = new b("Mt", "Meitnerium", 109, !1, "#EB0026", 0, 0, 0, 0);
  j.Ds = new b("Ds", "Darmstadtium", 110, !1, "#000000", 0, 0, 0, 0);
  j.Rg = new b("Rg", "Roentgenium", 111, !1, "#000000", 0, 0, 0, 0);
  j.Cn = new b("Cn", "Copernicium", 112, !1, "#000000", 0, 0, 0, 0);
  j.Uut = new b("Uut", "Ununtrium", 113, !1, "#000000", 0, 0, 0, 0);
  j.Uuq = new b("Uuq",
      "Ununquadium", 114, !1, "#000000", 0, 0, 0, 0);
  j.Uup = new b("Uup", "Ununpentium", 115, !1, "#000000", 0, 0, 0, 0);
  j.Uuh = new b("Uuh", "Ununhexium", 116, !1, "#000000", 0, 0, 0, 0);
  j.Uus = new b("Uus", "Ununseptium", 117, !1, "#000000", 0, 0, 0, 0);
  j.Uuo = new b("Uuo", "Ununoctium", 118, !1, "#000000", 0, 0, 0, 0);
  j.H.pymolColor = "#E6E6E6";
  j.C.pymolColor = "#33FF33";
  j.N.pymolColor = "#3333FF";
  j.O.pymolColor = "#FF4D4D";
  j.F.pymolColor = "#B3FFFF";
  j.S.pymolColor = "#E6C640";
  return j
}(ChemDoodle.SYMBOLS);
ChemDoodle.RESIDUE = function() {
  function b(b, j, h, e, g, a) {
      this.symbol = b;
      this.name = j;
      this.polar = h;
      this.aminoColor = e;
      this.shapelyColor = g;
      this.acidity = a
  }
  var j = [];
  j.Ala = new b("Ala", "Alanine", !1, "#C8C8C8", "#8CFF8C", 0);
  j.Arg = new b("Arg", "Arginine", !0, "#145AFF", "#00007C", 1);
  j.Asn = new b("Asn", "Asparagine", !0, "#00DCDC", "#FF7C70", 0);
  j.Asp = new b("Asp", "Aspartic Acid", !0, "#E60A0A", "#A00042", -1);
  j.Cys = new b("Cys", "Cysteine", !0, "#E6E600", "#FFFF70", 0);
  j.Gln = new b("Gln", "Glutamine", !0, "#00DCDC", "#FF4C4C", 0);
  j.Glu = new b("Glu",
      "Glutamic Acid", !0, "#E60A0A", "#660000", -1);
  j.Gly = new b("Gly", "Glycine", !1, "#EBEBEB", "#FFFFFF", 0);
  j.His = new b("His", "Histidine", !0, "#8282D2", "#7070FF", 1);
  j.Ile = new b("Ile", "Isoleucine", !1, "#0F820F", "#004C00", 0);
  j.Leu = new b("Leu", "Leucine", !1, "#0F820F", "#455E45", 0);
  j.Lys = new b("Lys", "Lysine", !0, "#145AFF", "#4747B8", 1);
  j.Met = new b("Met", "Methionine", !1, "#E6E600", "#B8A042", 0);
  j.Phe = new b("Phe", "Phenylalanine", !1, "#3232AA", "#534C52", 0);
  j.Pro = new b("Pro", "Proline", !1, "#DC9682", "#525252", 0);
  j.Ser = new b("Ser",
      "Serine", !0, "#FA9600", "#FF7042", 0);
  j.Thr = new b("Thr", "Threonine", !0, "#FA9600", "#B84C00", 0);
  j.Trp = new b("Trp", "Tryptophan", !0, "#B45AB4", "#4F4600", 0);
  j.Tyr = new b("Tyr", "Tyrosine", !0, "#3232AA", "#8C704C", 0);
  j.Val = new b("Val", "Valine", !1, "#0F820F", "#FF8CFF", 0);
  j.Asx = new b("Asx", "Asparagine/Aspartic Acid", !0, "#FF69B4", "#FF00FF", 0);
  j.Glx = new b("Glx", "Glutamine/Glutamic Acid", !0, "#FF69B4", "#FF00FF", 0);
  j["*"] = new b("*", "Other", !1, "#BEA06E", "#FF00FF", 0);
  j.A = new b("A", "Adenine", !1, "#BEA06E", "#A0A0FF", 0);
  j.G =
      new b("G", "Guanine", !1, "#BEA06E", "#FF7070", 0);
  j.I = new b("I", "", !1, "#BEA06E", "#80FFFF", 0);
  j.C = new b("C", "Cytosine", !1, "#BEA06E", "#FF8C4B", 0);
  j.T = new b("T", "Thymine", !1, "#BEA06E", "#A0FFA0", 0);
  j.U = new b("U", "Uracil", !1, "#BEA06E", "#FF8080", 0);
  return j
}();
(function(b) {
  b.Queue = function() {
      this.queue = []
  };
  b = b.Queue.prototype;
  b.queueSpace = 0;
  b.getSize = function() {
      return this.queue.length - this.queueSpace
  };
  b.isEmpty = function() {
      return 0 === this.queue.length
  };
  b.enqueue = function(b) {
      this.queue.push(b)
  };
  b.dequeue = function() {
      var b;
      this.queue.length && (b = this.queue[this.queueSpace], 2 * ++this.queueSpace >= this.queue.length && (this.queue = this.queue.slice(this.queueSpace), this.queueSpace = 0));
      return b
  };
  b.getOldestElement = function() {
      var b;
      this.queue.length && (b = this.queue[this.queueSpace]);
      return b
  }
})(ChemDoodle.structures);
(function(b, j) {
  b.Point = function(b, h) {
      this.x = b ? b : 0;
      this.y = h ? h : 0
  };
  var n = b.Point.prototype;
  n.sub = function(b) {
      this.x -= b.x;
      this.y -= b.y
  };
  n.add = function(b) {
      this.x += b.x;
      this.y += b.y
  };
  n.distance = function(b) {
      var h = b.x - this.x;
      b = b.y - this.y;
      return j.sqrt(h * h + b * b)
  };
  n.angleForStupidCanvasArcs = function(b) {
      var h = b.x - this.x;
      b = b.y - this.y;
      for (var e = 0, e = 0 === h ? 0 === b ? 0 : 0 < b ? j.PI / 2 : 3 * j.PI / 2 : 0 === b ? 0 < h ? 0 : j.PI : 0 > h ? j.atan(b / h) + j.PI : 0 > b ? j.atan(b / h) + 2 * j.PI : j.atan(b / h); 0 > e;) e += 2 * j.PI;
      return e %= 2 * j.PI
  };
  n.angle = function(b) {
      var h = b.x -
          this.x;
      b = this.y - b.y;
      for (var e = 0, e = 0 === h ? 0 === b ? 0 : 0 < b ? j.PI / 2 : 3 * j.PI / 2 : 0 === b ? 0 < h ? 0 : j.PI : 0 > h ? j.atan(b / h) + j.PI : 0 > b ? j.atan(b / h) + 2 * j.PI : j.atan(b / h); 0 > e;) e += 2 * j.PI;
      return e %= 2 * j.PI
  }
})(ChemDoodle.structures, Math);
(function(b, j, n, l, h, e) {
  l.Atom = function(g, a, d, e) {
      this.label = g ? g.replace(/\s/g, "") : "C";
      b[this.label] || (this.label = "C");
      this.x = a ? a : 0;
      this.y = d ? d : 0;
      this.z = e ? e : 0
  };
  l = l.Atom.prototype = new l.Point(0, 0);
  l.charge = 0;
  l.numLonePair = 0;
  l.numRadical = 0;
  l.mass = -1;
  l.coordinationNumber = 0;
  l.bondNumber = 0;
  l.angleOfLeastInterference = 0;
  l.isHidden = !1;
  l.altLabel = void 0;
  l.any = !1;
  l.rgroup = -1;
  l.isLone = !1;
  l.isHover = !1;
  l.isSelected = !1;
  l.add3D = function(b) {
      this.x += b.x;
      this.y += b.y;
      this.z += b.z
  };
  l.sub3D = function(b) {
      this.x -= b.x;
      this.y -=
          b.y;
      this.z -= b.z
  };
  l.distance3D = function(b) {
      var a = b.x - this.x,
          d = b.y - this.y;
      b = b.z - this.z;
      return h.sqrt(a * a + d * d + b * b)
  };
  l.draw = function(b, a) {
      if (this.isLassoed) {
          var d = b.createRadialGradient(this.x - 1, this.y - 1, 0, this.x, this.y, 7);
          d.addColorStop(0, "rgba(212, 99, 0, 0)");
          d.addColorStop(0.7, "rgba(212, 99, 0, 0.8)");
          b.fillStyle = d;
          b.beginPath();
          b.arc(this.x, this.y, 5, 0, 2 * h.PI, !1);
          b.fill()
      }
      this.textBounds = [];
      this.specs && (a = this.specs);
      var e = j.getFontString(a.atoms_font_size_2D, a.atoms_font_families_2D, a.atoms_font_bold_2D,
          a.atoms_font_italic_2D);
      b.font = e;
      b.fillStyle = this.getElementColor(a.atoms_useJMOLColors, a.atoms_usePYMOLColors, a.atoms_color, 2);
      "H" === this.label && a.atoms_HBlack_2D && (b.fillStyle = "black");
      var f;
      if (this.isLone && !a.atoms_displayAllCarbonLabels_2D || a.atoms_circles_2D) b.beginPath(), b.arc(this.x, this.y, a.atoms_circleDiameter_2D / 2, 0, 2 * h.PI, !1), b.fill(), 0 < a.atoms_circleBorderWidth_2D && (b.lineWidth = a.atoms_circleBorderWidth_2D, b.strokeStyle = "black", b.stroke());
      else if (this.isLabelVisible(a))
          if (b.textAlign =
              "center", b.textBaseline = "middle", void 0 !== this.altLabel) {
              b.fillText(this.altLabel, this.x, this.y);
              var p = b.measureText(this.altLabel).width;
              this.textBounds.push({
                  x: this.x - p / 2,
                  y: this.y - a.atoms_font_size_2D / 2 + 1,
                  w: p,
                  h: a.atoms_font_size_2D - 2
              })
          } else if (this.any) b.font = j.getFontString(a.atoms_font_size_2D + 5, a.atoms_font_families_2D, !0), b.fillText("*", this.x + 1, this.y + 3), p = b.measureText("*").width, this.textBounds.push({
          x: this.x - p / 2,
          y: this.y - a.atoms_font_size_2D / 2 + 1,
          w: p,
          h: a.atoms_font_size_2D - 2
      });
      else if (-1 !==
          this.rgroup) d = "R" + this.rgroup, b.fillText(d, this.x, this.y), p = b.measureText(d).width, this.textBounds.push({
          x: this.x - p / 2,
          y: this.y - a.atoms_font_size_2D / 2 + 1,
          w: p,
          h: a.atoms_font_size_2D - 2
      });
      else {
          b.fillText(this.label, this.x, this.y);
          p = b.measureText(this.label).width;
          this.textBounds.push({
              x: this.x - p / 2,
              y: this.y - a.atoms_font_size_2D / 2 + 1,
              w: p,
              h: a.atoms_font_size_2D - 2
          });
          var o = 0; - 1 !== this.mass && (d = b.font, b.font = j.getFontString(0.7 * a.atoms_font_size_2D, a.atoms_font_families_2D, a.atoms_font_bold_2D, a.atoms_font_italic_2D),
              o = b.measureText(this.mass).width, b.fillText(this.mass, this.x - o - 0.5, this.y - a.atoms_font_size_2D / 2 + 1), this.textBounds.push({
                  x: this.x - p / 2 - o - 0.5,
                  y: this.y - 1.7 * a.atoms_font_size_2D / 2 + 1,
                  w: o,
                  h: a.atoms_font_size_2D / 2 - 1
              }), b.font = d);
          var d = p / 2,
              l = this.getImplicitHydrogenCount();
          if (a.atoms_implicitHydrogens_2D && 0 < l) {
              f = 0;
              var A = b.measureText("H").width,
                  q = !0;
              if (1 < l) {
                  var t = p / 2 + A / 2,
                      u = 0,
                      v = j.getFontString(0.8 * a.atoms_font_size_2D, a.atoms_font_families_2D, a.atoms_font_bold_2D, a.atoms_font_italic_2D);
                  b.font = v;
                  var z = b.measureText(l).width;
                  1 === this.bondNumber ? this.angleOfLeastInterference > h.PI / 2 && this.angleOfLeastInterference < 3 * h.PI / 2 && (t = -p / 2 - z - A / 2 - o / 2, q = !1, f = h.PI) : this.angleOfLeastInterference <= h.PI / 4 || (this.angleOfLeastInterference < 3 * h.PI / 4 ? (t = 0, u = 0.9 * -a.atoms_font_size_2D, 0 !== this.charge && (u -= 0.3 * a.atoms_font_size_2D), q = !1, f = h.PI / 2) : this.angleOfLeastInterference <= 5 * h.PI / 4 ? (t = -p / 2 - z - A / 2 - o / 2, q = !1, f = h.PI) : this.angleOfLeastInterference < 7 * h.PI / 4 && (t = 0, u = 0.9 * a.atoms_font_size_2D, q = !1, f = 3 * h.PI / 2));
                  b.font = e;
                  b.fillText("H", this.x + t, this.y +
                      u);
                  b.font = v;
                  b.fillText(l, this.x + t + A / 2 + z / 2, this.y + u + 0.3 * a.atoms_font_size_2D);
                  this.textBounds.push({
                      x: this.x + t - A / 2,
                      y: this.y + u - a.atoms_font_size_2D / 2 + 1,
                      w: A,
                      h: a.atoms_font_size_2D - 2
                  });
                  this.textBounds.push({
                      x: this.x + t + A / 2,
                      y: this.y + u + 0.3 * a.atoms_font_size_2D - a.atoms_font_size_2D / 2 + 1,
                      w: z,
                      h: 0.8 * a.atoms_font_size_2D - 2
                  })
              } else t = p / 2 + A / 2, u = 0, 1 === this.bondNumber ? this.angleOfLeastInterference > h.PI / 2 && this.angleOfLeastInterference < 3 * h.PI / 2 && (t = -p / 2 - A / 2 - o / 2, q = !1, f = h.PI) : this.angleOfLeastInterference <= h.PI / 4 || (this.angleOfLeastInterference <
                  3 * h.PI / 4 ? (t = 0, u = 0.9 * -a.atoms_font_size_2D, q = !1, f = h.PI / 2) : this.angleOfLeastInterference <= 5 * h.PI / 4 ? (t = -p / 2 - A / 2 - o / 2, q = !1, f = h.PI) : this.angleOfLeastInterference < 7 * h.PI / 4 && (t = 0, u = 0.9 * a.atoms_font_size_2D, q = !1, f = 3 * h.PI / 2)), b.fillText("H", this.x + t, this.y + u), this.textBounds.push({
                  x: this.x + t - A / 2,
                  y: this.y + u - a.atoms_font_size_2D / 2 + 1,
                  w: A,
                  h: a.atoms_font_size_2D - 2
              });
              q && (d += A)
          }
          0 !== this.charge && (e = this.charge.toFixed(0), e = "1" === e ? "+" : "-1" === e ? "\u2013" : j.stringStartsWith(e, "-") ? e.substring(1) + "\u2013" : e + "+", p = b.measureText(e).width,
              d += p / 2, b.textAlign = "center", b.textBaseline = "middle", b.font = j.getFontString(h.floor(0.8 * a.atoms_font_size_2D), a.atoms_font_families_2D, a.atoms_font_bold_2D, a.atoms_font_italic_2D), b.fillText(e, this.x + d - 1, this.y - a.atoms_font_size_2D / 2 + 1), this.textBounds.push({
                  x: this.x + d - p / 2 - 1,
                  y: this.y - 1.8 * a.atoms_font_size_2D / 2 + 5,
                  w: p,
                  h: a.atoms_font_size_2D / 2 - 1
              }))
      }
      if (0 < this.numLonePair || 0 < this.numRadical) {
          b.fillStyle = "black";
          l = this.angles.slice(0);
          d = this.angleOfLeastInterference;
          e = this.largestAngle;
          void 0 !== f && (l.push(f),
              l.sort(), e = n.angleBetweenLargest(l), d = e.angle % (2 * h.PI), e = e.largest);
          p = [];
          for (o = 0; o < this.numLonePair; o++) p.push({
              t: 2
          });
          for (o = 0; o < this.numRadical; o++) p.push({
              t: 1
          });
          if (void 0 === f && h.abs(e - 2 * h.PI / l.length) < h.PI / 60) {
              l = h.ceil(p.length / l.length);
              o = 0;
              for (A = p.length; o < A; o += l, d += e) this.drawElectrons(b, a, p.slice(o, h.min(p.length, o + l)), d, e, f)
          } else this.drawElectrons(b, a, p, d, e, f)
      }
  };
  l.drawElectrons = function(b, a, d, e, f, j) {
      j = f / (d.length + (0 === this.bonds.length && void 0 === j ? 0 : 1));
      f = e - f / 2 + j;
      for (var o = 0; o < d.length; o++) {
          var l =
              d[o];
          e = f + o * j;
          var n = this.x + Math.cos(e) * a.atoms_lonePairDistance_2D,
              q = this.y - Math.sin(e) * a.atoms_lonePairDistance_2D;
          2 === l.t ? (l = e + Math.PI / 2, e = Math.cos(l) * a.atoms_lonePairSpread_2D / 2, l = -Math.sin(l) * a.atoms_lonePairSpread_2D / 2, b.beginPath(), b.arc(n + e, q + l, a.atoms_lonePairDiameter_2D, 0, 2 * h.PI, !1), b.fill(), b.beginPath(), b.arc(n - e, q - l, a.atoms_lonePairDiameter_2D, 0, 2 * h.PI, !1), b.fill()) : 1 === l.t && (b.beginPath(), b.arc(n, q, a.atoms_lonePairDiameter_2D, 0, 2 * h.PI, !1), b.fill())
      }
  };
  l.drawDecorations = function(b) {
      if (this.isHover ||
          this.isSelected) b.strokeStyle = this.isHover ? "#885110" : "#0060B2", b.lineWidth = 1.2, b.beginPath(), b.arc(this.x, this.y, this.isHover ? 7 : 15, 0, 2 * h.PI, !1), b.stroke();
      this.isOverlap && (b.strokeStyle = "#C10000", b.lineWidth = 1.2, b.beginPath(), b.arc(this.x, this.y, 7, 0, 2 * h.PI, !1), b.stroke())
  };
  l.render = function(g, a, d) {
      this.specs && (a = this.specs);
      var h = e.translate(g.modelViewMatrix, [this.x, this.y, this.z], []),
          f = a.atoms_useVDWDiameters_3D ? b[this.label].vdWRadius * a.atoms_vdwMultiplier_3D : a.atoms_sphereDiameter_3D / 2;
      0 === f &&
          (f = 1);
      e.scale(h, [f, f, f]);
      d || (d = a.atoms_color, a.atoms_useJMOLColors ? d = b[this.label].jmolColor : a.atoms_usePYMOLColors && (d = b[this.label].pymolColor), g.material.setDiffuseColor(d));
      g.setMatrixUniforms(h);
      g.drawElements(g.TRIANGLES, (this.renderAsStar ? g.starBuffer : g.sphereBuffer).vertexIndexBuffer.numItems, g.UNSIGNED_SHORT, 0)
  };
  l.renderHighlight = function(g, a) {
      if (this.isSelected || this.isHover) {
          this.specs && (a = this.specs);
          var d = e.translate(g.modelViewMatrix, [this.x, this.y, this.z], []),
              h = a.atoms_useVDWDiameters_3D ?
              b[this.label].vdWRadius * a.atoms_vdwMultiplier_3D : a.atoms_sphereDiameter_3D / 2;
          0 === h && (h = 1);
          h *= 1.3;
          e.scale(d, [h, h, h]);
          g.setMatrixUniforms(d);
          g.material.setDiffuseColor(this.isHover ? "#885110" : "#0060B2");
          g.drawElements(g.TRIANGLES, (this.renderAsStar ? g.starBuffer : g.sphereBuffer).vertexIndexBuffer.numItems, g.UNSIGNED_SHORT, 0)
      }
  };
  l.isLabelVisible = function(b) {
      return b.atoms_displayAllCarbonLabels_2D || "C" !== this.label || this.altLabel || (this.any || -1 !== this.rgroup) || (-1 !== this.mass || 0 !== this.charge) || b.atoms_showAttributedCarbons_2D &&
          (0 !== this.numRadical || 0 !== this.numLonePair) || this.isHidden && b.atoms_showHiddenCarbons_2D || b.atoms_displayTerminalCarbonLabels_2D && 1 === this.bondNumber ? !0 : !1
  };
  l.getImplicitHydrogenCount = function() {
      if ("H" === this.label || !b[this.label] || !b[this.label].addH) return 0;
      var e = b[this.label].valency,
          a = e - this.coordinationNumber;
      0 < this.numRadical && (a = h.max(0, a - this.numRadical));
      0 < this.charge ? (e = 4 - e, a = this.charge <= e ? a + this.charge : 4 - this.coordinationNumber - this.charge + e) : a += this.charge;
      return 0 > a ? 0 : h.floor(a)
  };
  l.getBounds =
      function() {
          var b = new n.Bounds;
          b.expand(this.x, this.y);
          if (this.textBounds)
              for (var a = 0, d = this.textBounds.length; a < d; a++) {
                  var e = this.textBounds[a];
                  b.expand(e.x, e.y, e.x + e.w, e.y + e.h)
              }
          return b
      };
  l.getBounds3D = function() {
      var b = new n.Bounds;
      b.expand3D(this.x, this.y, this.z);
      return b
  };
  l.getElementColor = function(e, a, d, h) {
      if (2 == h && this.any || -1 !== this.rgroup) return d;
      e ? d = b[this.label].jmolColor : a && (d = b[this.label].pymolColor);
      return d
  }
})(ChemDoodle.ELEMENT, ChemDoodle.extensions, ChemDoodle.math, ChemDoodle.structures,
  Math, ChemDoodle.lib.mat4);
(function(b, j, n, l, h, e, g) {
  n.Bond = function(a, d, b) {
      this.a1 = a;
      this.a2 = d;
      this.bondOrder = void 0 !== b ? b : 1
  };
  n.Bond.STEREO_NONE = "none";
  n.Bond.STEREO_PROTRUDING = "protruding";
  n.Bond.STEREO_RECESSED = "recessed";
  n.Bond.STEREO_AMBIGUOUS = "ambiguous";
  b = n.Bond.prototype;
  b.stereo = n.Bond.STEREO_NONE;
  b.isHover = !1;
  b.ring = void 0;
  b.getCenter = function() {
      return new n.Point((this.a1.x + this.a2.x) / 2, (this.a1.y + this.a2.y) / 2)
  };
  b.getLength = function() {
      return this.a1.distance(this.a2)
  };
  b.getLength3D = function() {
      return this.a1.distance3D(this.a2)
  };
  b.contains =
      function(a) {
          return a === this.a1 || a === this.a2
      };
  b.getNeighbor = function(a) {
      if (a === this.a1) return this.a2;
      if (a === this.a2) return this.a1
  };
  b.draw = function(a, d) {
      if (!(this.a1.x === this.a2.x && this.a1.y === this.a2.y)) {
          this.specs && (d = this.specs);
          var b = this.a1.x,
              f = this.a2.x,
              e = this.a1.y,
              g = this.a2.y,
              w = this.a1.distance(this.a2),
              A = f - b,
              q = g - e;
          if (this.a1.isLassoed && this.a2.isLassoed) {
              var t = a.createLinearGradient(b, e, f, g);
              t.addColorStop(0, "rgba(212, 99, 0, 0)");
              t.addColorStop(0.5, "rgba(212, 99, 0, 0.8)");
              t.addColorStop(1,
                  "rgba(212, 99, 0, 0)");
              var u = 2.5,
                  v = this.a1.angle(this.a2) + h.PI / 2,
                  z = h.cos(v),
                  v = h.sin(v),
                  y = b - z * u,
                  B = e + v * u,
                  c = b + z * u,
                  k = e - v * u,
                  C = f + z * u,
                  D = g - v * u,
                  z = f - z * u,
                  v = g + v * u;
              a.fillStyle = t;
              a.beginPath();
              a.moveTo(y, B);
              a.lineTo(c, k);
              a.lineTo(C, D);
              a.lineTo(z, v);
              a.closePath();
              a.fill()
          }
          if (d.atoms_display && !d.atoms_circles_2D && this.a1.isLabelVisible(d) && this.a1.textBounds) {
              u = z = 0;
              for (y = this.a1.textBounds.length; u < y; u++) z = Math.max(z, l.calculateDistanceInterior(this.a1, this.a2, this.a1.textBounds[u]));
              z += d.bonds_atomLabelBuffer_2D;
              z /= w;
              b += A * z;
              e += q * z
          }
          if (d.atoms_display && !d.atoms_circles_2D && this.a2.isLabelVisible(d) && this.a2.textBounds) {
              u = z = 0;
              for (y = this.a2.textBounds.length; u < y; u++) z = Math.max(z, l.calculateDistanceInterior(this.a2, this.a1, this.a2.textBounds[u]));
              z += d.bonds_atomLabelBuffer_2D;
              z /= w;
              f -= A * z;
              g -= q * z
          }
          d.bonds_clearOverlaps_2D && (z = b + 0.15 * A, v = e + 0.15 * q, u = f - 0.15 * A, w = g - 0.15 * q, a.strokeStyle = d.backgroundColor, a.lineWidth = d.bonds_width_2D + 2 * d.bonds_overlapClearWidth_2D, a.lineCap = "round", a.beginPath(), a.moveTo(z, v), a.lineTo(u,
              w), a.closePath(), a.stroke());
          a.strokeStyle = d.bonds_color;
          a.fillStyle = d.bonds_color;
          a.lineWidth = d.bonds_width_2D;
          a.lineCap = d.bonds_ends_2D;
          if (d.bonds_useJMOLColors || d.bonds_usePYMOLColors) z = a.createLinearGradient(b, e, f, g), v = this.a1.getElementColor(d.bonds_useJMOLColors, d.bonds_usePYMOLColors, d.atoms_color, 2), u = this.a2.getElementColor(d.bonds_useJMOLColors, d.bonds_usePYMOLColors, d.atoms_color, 2), z.addColorStop(0, v), d.bonds_colorGradient || (z.addColorStop(0.5, v), z.addColorStop(0.51, u)), z.addColorStop(1,
              u), a.strokeStyle = z, a.fillStyle = z;
          if (d.bonds_lewisStyle_2D && 0 === this.bondOrder % 1) this.drawLewisStyle(a, d, b, e, f, g);
          else switch (this.bondOrder) {
              case 0:
                  f -= b;
                  g -= e;
                  f = h.sqrt(f * f + g * g);
                  g = h.floor(f / d.bonds_dotSize_2D);
                  f = (f - (g - 1) * d.bonds_dotSize_2D) / 2;
                  1 === g % 2 ? f += d.bonds_dotSize_2D / 4 : (f -= d.bonds_dotSize_2D / 4, g += 2);
                  g /= 2;
                  q = this.a1.angle(this.a2);
                  z = b + f * Math.cos(q);
                  v = e - f * Math.sin(q);
                  a.beginPath();
                  for (u = 0; u < g; u++) a.arc(z, v, d.bonds_dotSize_2D / 2, 0, 2 * h.PI, !1), z += 2 * d.bonds_dotSize_2D * Math.cos(q), v -= 2 * d.bonds_dotSize_2D *
                      Math.sin(q);
                  a.fill();
                  break;
              case 0.5:
                  a.beginPath();
                  a.moveTo(b, e);
                  j.contextHashTo(a, b, e, f, g, d.bonds_hashSpacing_2D, d.bonds_hashSpacing_2D);
                  a.stroke();
                  break;
              case 1:
                  if (this.stereo === n.Bond.STEREO_PROTRUDING || this.stereo === n.Bond.STEREO_RECESSED) q = d.bonds_width_2D / 2, u = this.a1.distance(this.a2) * d.bonds_wedgeThickness_2D / 2, v = this.a1.angle(this.a2) + h.PI / 2, z = h.cos(v), v = h.sin(v), y = b - z * q, B = e + v * q, c = b + z * q, k = e - v * q, C = f + z * u, D = g - v * u, z = f - z * u, v = g + v * u, a.beginPath(), a.moveTo(y, B), a.lineTo(c, k), a.lineTo(C, D), a.lineTo(z,
                      v), a.closePath(), this.stereo === n.Bond.STEREO_PROTRUDING ? a.fill() : (a.save(), a.clip(), a.lineWidth = 2 * u, a.lineCap = "butt", a.beginPath(), a.moveTo(b, e), j.contextHashTo(a, b, e, f, g, d.bonds_hashWidth_2D, d.bonds_hashSpacing_2D), a.stroke(), a.restore());
                  else if (this.stereo === n.Bond.STEREO_AMBIGUOUS) {
                      a.beginPath();
                      a.moveTo(b, e);
                      f = h.floor(h.sqrt(A * A + q * q) / d.bonds_wavyLength_2D);
                      v = this.a1.angle(this.a2) + h.PI / 2;
                      z = h.cos(v);
                      v = h.sin(v);
                      g = A / f;
                      q /= f;
                      u = 0;
                      for (y = f; u < y; u++) b += g, e += q, f = d.bonds_wavyLength_2D * z + b - 0.5 * g, w = d.bonds_wavyLength_2D *
                          -v + e - 0.5 * q, A = d.bonds_wavyLength_2D * -z + b - 0.5 * g, B = d.bonds_wavyLength_2D * v + e - 0.5 * q, 0 === u % 2 ? a.quadraticCurveTo(f, w, b, e) : a.quadraticCurveTo(A, B, b, e);
                      a.stroke();
                      break
                  } else a.beginPath(), a.moveTo(b, e), a.lineTo(f, g), a.stroke();
                  break;
              case 1.5:
              case 2:
                  this.stereo === n.Bond.STEREO_AMBIGUOUS ? (u = this.a1.distance(this.a2) * d.bonds_saturationWidth_2D / 2, v = this.a1.angle(this.a2) + h.PI / 2, z = h.cos(v), v = h.sin(v), y = b - z * u, B = e + v * u, c = b + z * u, k = e - v * u, C = f + z * u, D = g - v * u, z = f - z * u, v = g + v * u, a.beginPath(), a.moveTo(y, B), a.lineTo(C, D), a.moveTo(c,
                      k), a.lineTo(z, v), a.stroke()) : !d.bonds_symmetrical_2D && (this.ring || "C" === this.a1.label && "C" === this.a2.label) ? (a.beginPath(), a.moveTo(b, e), a.lineTo(f, g), z = 0, w = this.a1.distance(this.a2), q = this.a1.angle(this.a2), v = q + h.PI / 2, u = w * d.bonds_saturationWidth_2D, A = d.bonds_saturationAngle_2D, A < h.PI / 2 && (z = -(u / h.tan(A))), h.abs(z) < w / 2 && (A = b - h.cos(q) * z, b = f + h.cos(q) * z, f = e + h.sin(q) * z, e = g - h.sin(q) * z, z = h.cos(v), v = h.sin(v), y = A - z * u, B = f + v * u, c = A + z * u, k = f - v * u, C = b - z * u, D = e + v * u, z = b + z * u, v = e - v * u, !this.ring || this.ring.center.angle(this.a1) >
                      this.ring.center.angle(this.a2) && !(this.ring.center.angle(this.a1) - this.ring.center.angle(this.a2) > h.PI) || this.ring.center.angle(this.a1) - this.ring.center.angle(this.a2) < -h.PI ? (a.moveTo(y, B), 2 === this.bondOrder ? a.lineTo(C, D) : j.contextHashTo(a, y, B, C, D, d.bonds_hashSpacing_2D, d.bonds_hashSpacing_2D)) : (a.moveTo(c, k), 2 === this.bondOrder ? a.lineTo(z, v) : j.contextHashTo(a, c, k, z, v, d.bonds_hashSpacing_2D, d.bonds_hashSpacing_2D)), a.stroke())) : (u = this.a1.distance(this.a2) * d.bonds_saturationWidth_2D / 2, v = this.a1.angle(this.a2) +
                      h.PI / 2, z = h.cos(v), v = h.sin(v), y = b - z * u, B = e + v * u, c = b + z * u, k = e - v * u, C = f + z * u, D = g - v * u, z = f - z * u, v = g + v * u, a.beginPath(), a.moveTo(y, B), a.lineTo(z, v), a.moveTo(c, k), 2 === this.bondOrder ? a.lineTo(C, D) : j.contextHashTo(a, c, k, C, D, d.bonds_hashSpacing_2D, d.bonds_hashSpacing_2D), a.stroke());
                  break;
              case 3:
                  u = this.a1.distance(this.a2) * d.bonds_saturationWidth_2D, v = this.a1.angle(this.a2) + h.PI / 2, z = h.cos(v), v = h.sin(v), y = b - z * u, B = e + v * u, c = b + z * u, k = e - v * u, C = f + z * u, D = g - v * u, z = f - z * u, v = g + v * u, a.beginPath(), a.moveTo(y, B), a.lineTo(z, v), a.moveTo(c,
                      k), a.lineTo(C, D), a.moveTo(b, e), a.lineTo(f, g), a.stroke()
          }
      }
  };
  b.drawDecorations = function(a) {
      if (this.isHover || this.isSelected) {
          var d = 2 * h.PI,
              b = (this.a1.angleForStupidCanvasArcs(this.a2) + h.PI / 2) % d;
          a.strokeStyle = this.isHover ? "#885110" : "#0060B2";
          a.lineWidth = 1.2;
          a.beginPath();
          var f = (b + h.PI) % d,
              f = f % (2 * h.PI);
          a.arc(this.a1.x, this.a1.y, 7, b, f, !1);
          a.stroke();
          a.beginPath();
          b += h.PI;
          f = (b + h.PI) % d;
          a.arc(this.a2.x, this.a2.y, 7, b, f, !1);
          a.stroke()
      }
  };
  b.drawLewisStyle = function(a, d, b, f, e, g) {
      var j = this.a1.angle(this.a2),
          l = j +
          h.PI / 2;
      e -= b;
      g -= f;
      e = h.sqrt(e * e + g * g) / (this.bondOrder + 1);
      g = e * h.cos(j);
      j = -e * h.sin(j);
      b += g;
      f += j;
      for (e = 0; e < this.bondOrder; e++) {
          var n = d.atoms_lonePairSpread_2D / 2,
              t = b - h.cos(l) * n,
              u = f + h.sin(l) * n,
              v = b + h.cos(l) * n,
              n = f - h.sin(l) * n;
          a.beginPath();
          a.arc(t - d.atoms_lonePairDiameter_2D / 2, u - d.atoms_lonePairDiameter_2D / 2, d.atoms_lonePairDiameter_2D, 0, 2 * h.PI, !1);
          a.fill();
          a.beginPath();
          a.arc(v - d.atoms_lonePairDiameter_2D / 2, n - d.atoms_lonePairDiameter_2D / 2, d.atoms_lonePairDiameter_2D, 0, 2 * h.PI, !1);
          a.fill();
          b += g;
          f += j
      }
  };
  b.render =
      function(a, d, b) {
          this.specs && (d = this.specs);
          var f = this.a1.distance3D(this.a2);
          if (0 !== f) {
              var p = d.bonds_cylinderDiameter_3D / 2,
                  o = d.bonds_color,
                  l, n = e.translate(a.modelViewMatrix, [this.a1.x, this.a1.y, this.a1.z], []),
                  q, t = [this.a2.x - this.a1.x, this.a2.y - this.a1.y, this.a2.z - this.a1.z],
                  u = [0, 1, 0],
                  v = 0;
              this.a1.x === this.a2.x && this.a1.z === this.a2.z ? (u = [0, 0, 1], this.a2.y < this.a1.y && (v = h.PI)) : (v = j.vec3AngleFrom(u, t), u = g.cross(u, t, []));
              var z = d.bonds_useJMOLColors,
                  y = d.bonds_usePYMOLColors;
              if (z || y) o = this.a1.getElementColor(z,
                  y, o), l = this.a2.getElementColor(z, y, d.bonds_color), o != l && (q = e.translate(a.modelViewMatrix, [this.a2.x, this.a2.y, this.a2.z], []));
              var z = [0],
                  B;
              if (b) {
                  d.bonds_showBondOrders_3D && 1 < this.bondOrder && (z = [d.bonds_cylinderDiameter_3D], B = [0, 0, 1], b = e.inverse(a.rotationMatrix, []), e.multiplyVec3(b, B), B = g.cross(t, B, []), g.normalize(B));
                  var p = 1,
                      c = d.bonds_pillSpacing_3D,
                      t = d.bonds_pillHeight_3D;
                  0 == this.bondOrder && (d.bonds_renderAsLines_3D ? t = c : (t = d.bonds_pillDiameter_3D, t < d.bonds_cylinderDiameter_3D && (t /= 2), p = t / 2, f /= p,
                      c /= p / 2));
                  b = t + c;
                  var y = h.floor(f / b),
                      k = (c + d.bonds_pillDiameter_3D + (f - b * y)) / 2,
                      C = y;
                  q && (C = h.floor(y / 2));
                  f = 0;
                  for (c = z.length; f < c; f++) {
                      var D = e.set(n, []);
                      0 !== z[f] && e.translate(D, g.scale(B, z[f], []));
                      0 !== v && e.rotate(D, v, u);
                      1 != p && e.scale(D, [p, p, p]);
                      o && a.material.setDiffuseColor(o);
                      e.translate(D, [0, k, 0]);
                      for (var H = 0; H < C; H++) d.bonds_renderAsLines_3D ? 0 == this.bondOrder ? (a.setMatrixUniforms(D), a.drawArrays(a.POINTS, 0, 1)) : (e.scale(D, [1, t, 1]), a.setMatrixUniforms(D), a.drawArrays(a.LINES, 0, a.lineBuffer.vertexPositionBuffer.numItems),
                          e.scale(D, [1, 1 / t, 1])) : (a.setMatrixUniforms(D), 0 == this.bondOrder ? a.drawElements(a.TRIANGLES, a.sphereBuffer.vertexIndexBuffer.numItems, a.UNSIGNED_SHORT, 0) : a.drawElements(a.TRIANGLES, a.pillBuffer.vertexIndexBuffer.numItems, a.UNSIGNED_SHORT, 0)), e.translate(D, [0, b, 0]);
                      if (q) {
                          var F, G;
                          d.bonds_renderAsLines_3D ? (F = t, F /= 2, G = 0) : (F = 2 / 3, G = (1 - F) / 2);
                          0 != y % 2 && (e.scale(D, [1, F, 1]), a.setMatrixUniforms(D), d.bonds_renderAsLines_3D ? 0 == this.bondOrder ? a.drawArrays(a.POINTS, 0, 1) : a.drawArrays(a.LINES, 0, a.lineBuffer.vertexPositionBuffer.numItems) :
                              0 == this.bondOrder ? a.drawElements(a.TRIANGLES, a.sphereBuffer.vertexIndexBuffer.numItems, a.UNSIGNED_SHORT, 0) : a.drawElements(a.TRIANGLES, a.pillBuffer.vertexIndexBuffer.numItems, a.UNSIGNED_SHORT, 0), e.translate(D, [0, b * (1 + G), 0]), e.scale(D, [1, 1 / F, 1]));
                          e.set(q, D);
                          0 !== z[f] && e.translate(D, g.scale(B, z[f], []));
                          e.rotate(D, v + h.PI, u);
                          1 != p && e.scale(D, [p, p, p]);
                          l && a.material.setDiffuseColor(l);
                          e.translate(D, [0, k, 0]);
                          for (H = 0; H < C; H++) d.bonds_renderAsLines_3D ? 0 == this.bondOrder ? (a.setMatrixUniforms(D), a.drawArrays(a.POINTS,
                              0, 1)) : (e.scale(D, [1, t, 1]), a.setMatrixUniforms(D), a.drawArrays(a.LINES, 0, a.lineBuffer.vertexPositionBuffer.numItems), e.scale(D, [1, 1 / t, 1])) : (a.setMatrixUniforms(D), 0 == this.bondOrder ? a.drawElements(a.TRIANGLES, a.sphereBuffer.vertexIndexBuffer.numItems, a.UNSIGNED_SHORT, 0) : a.drawElements(a.TRIANGLES, a.pillBuffer.vertexIndexBuffer.numItems, a.UNSIGNED_SHORT, 0)), e.translate(D, [0, b, 0]);
                          0 != y % 2 && (e.scale(D, [1, F, 1]), a.setMatrixUniforms(D), d.bonds_renderAsLines_3D ? 0 == this.bondOrder ? a.drawArrays(a.POINTS, 0, 1) :
                              a.drawArrays(a.LINES, 0, a.lineBuffer.vertexPositionBuffer.numItems) : 0 == this.bondOrder ? a.drawElements(a.TRIANGLES, a.sphereBuffer.vertexIndexBuffer.numItems, a.UNSIGNED_SHORT, 0) : a.drawElements(a.TRIANGLES, a.pillBuffer.vertexIndexBuffer.numItems, a.UNSIGNED_SHORT, 0), e.translate(D, [0, b * (1 + G), 0]), e.scale(D, [1, 1 / F, 1]))
                      }
                  }
              } else {
                  if (d.bonds_showBondOrders_3D) {
                      switch (this.bondOrder) {
                          case 1.5:
                              z = [-d.bonds_cylinderDiameter_3D];
                              break;
                          case 2:
                              z = [-d.bonds_cylinderDiameter_3D, d.bonds_cylinderDiameter_3D];
                              break;
                          case 3:
                              z = [-1.2 * d.bonds_cylinderDiameter_3D, 0, 1.2 * d.bonds_cylinderDiameter_3D]
                      }
                      1 < this.bondOrder && (B = [0, 0, 1], b = e.inverse(a.rotationMatrix, []), e.multiplyVec3(b, B), B = g.cross(t, B, []), g.normalize(B))
                  } else switch (this.bondOrder) {
                      case 0:
                          p *= 0.25;
                          break;
                      case 0.5:
                      case 1.5:
                          p *= 0.5
                  }
                  q && (f /= 2);
                  p = [p, f, p];
                  f = 0;
                  for (c = z.length; f < c; f++) D = e.set(n, []), 0 !== z[f] && e.translate(D, g.scale(B, z[f], [])), 0 !== v && e.rotate(D, v, u), e.scale(D, p), o && a.material.setDiffuseColor(o), a.setMatrixUniforms(D), d.bonds_renderAsLines_3D ? a.drawArrays(a.LINES,
                      0, a.lineBuffer.vertexPositionBuffer.numItems) : a.drawArrays(a.TRIANGLE_STRIP, 0, a.cylinderBuffer.vertexPositionBuffer.numItems), q && (e.set(q, D), 0 !== z[f] && e.translate(D, g.scale(B, z[f], [])), e.rotate(D, v + h.PI, u), e.scale(D, p), l && a.material.setDiffuseColor(l), a.setMatrixUniforms(D), d.bonds_renderAsLines_3D ? a.drawArrays(a.LINES, 0, a.lineBuffer.vertexPositionBuffer.numItems) : a.drawArrays(a.TRIANGLE_STRIP, 0, a.cylinderBuffer.vertexPositionBuffer.numItems))
              }
          }
      };
  b.renderHighlight = function(a, d) {
      if (this.isSelected ||
          this.isHover) {
          this.specs && (d = this.specs);
          this.specs && (d = this.specs);
          var b = this.a1.distance3D(this.a2);
          if (0 !== b) {
              var f = d.bonds_cylinderDiameter_3D / 1.2,
                  p = e.translate(a.modelViewMatrix, [this.a1.x, this.a1.y, this.a1.z], []),
                  o = [this.a2.x - this.a1.x, this.a2.y - this.a1.y, this.a2.z - this.a1.z],
                  l = [0, 1, 0],
                  n = 0;
              this.a1.x === this.a2.x && this.a1.z === this.a2.z ? (o = [0, 0, 1], this.a2.y < this.a1.y && (n = h.PI)) : (n = j.vec3AngleFrom(l, o), o = g.cross(l, o, []));
              b = [f, b, f];
              0 !== n && e.rotate(p, n, o);
              e.scale(p, b);
              a.setMatrixUniforms(p);
              a.material.setDiffuseColor(this.isHover ?
                  "#885110" : "#0060B2");
              a.drawArrays(a.TRIANGLE_STRIP, 0, a.cylinderBuffer.vertexPositionBuffer.numItems)
          }
      }
  };
  b.renderPicker = function(a, d) {
      this.specs && (d = this.specs);
      var b = this.a1.distance3D(this.a2);
      if (0 !== b) {
          var f = d.bonds_cylinderDiameter_3D / 2,
              p = e.translate(a.modelViewMatrix, [this.a1.x, this.a1.y, this.a1.z], []),
              o = [this.a2.x - this.a1.x, this.a2.y - this.a1.y, this.a2.z - this.a1.z],
              l = [0, 1, 0],
              n = 0;
          this.a1.x === this.a2.x && this.a1.z === this.a2.z ? (l = [0, 0, 1], this.a2.y < this.a1.y && (n = h.PI)) : (n = j.vec3AngleFrom(l, o), l = g.cross(l,
              o, []));
          var q = [0],
              t;
          if (d.bonds_showBondOrders_3D)
              if (d.bonds_renderAsLines_3D) {
                  switch (this.bondOrder) {
                      case 1.5:
                      case 2:
                          q = [-d.bonds_cylinderDiameter_3D, d.bonds_cylinderDiameter_3D];
                          break;
                      case 3:
                          q = [-1.2 * d.bonds_cylinderDiameter_3D, 0, 1.2 * d.bonds_cylinderDiameter_3D]
                  }
                  if (1 < this.bondOrder) {
                      t = [0, 0, 1];
                      var u = e.inverse(a.rotationMatrix, []);
                      e.multiplyVec3(u, t);
                      t = g.cross(o, t, []);
                      g.normalize(t)
                  }
              } else switch (this.bondOrder) {
                  case 1.5:
                  case 2:
                      f *= 3;
                      break;
                  case 3:
                      f *= 3.4
              } else switch (this.bondOrder) {
                  case 0:
                      f *= 0.25;
                      break;
                  case 0.5:
                  case 1.5:
                      f *= 0.5
              }
          b = [f, b, f];
          f = 0;
          for (o = q.length; f < o; f++) u = e.set(p, []), 0 !== q[f] && e.translate(u, g.scale(t, q[f], [])), 0 !== n && e.rotate(u, n, l), e.scale(u, b), a.setMatrixUniforms(u), d.bonds_renderAsLines_3D ? a.drawArrays(a.LINES, 0, a.lineBuffer.vertexPositionBuffer.numItems) : a.drawArrays(a.TRIANGLE_STRIP, 0, a.cylinderBuffer.vertexPositionBuffer.numItems)
      }
  }
})(ChemDoodle.ELEMENT, ChemDoodle.extensions, ChemDoodle.structures, ChemDoodle.math, Math, ChemDoodle.lib.mat4, ChemDoodle.lib.vec3);
(function(b, j) {
  b.Ring = function() {
      this.atoms = [];
      this.bonds = []
  };
  var n = b.Ring.prototype;
  n.center = void 0;
  n.setupBonds = function() {
      for (var b = 0, h = this.bonds.length; b < h; b++) this.bonds[b].ring = this;
      this.center = this.getCenter()
  };
  n.getCenter = function() {
      for (var l = Infinity, h = Infinity, e = -Infinity, g = -Infinity, a = 0, d = this.atoms.length; a < d; a++) l = j.min(this.atoms[a].x, l), h = j.min(this.atoms[a].y, h), e = j.max(this.atoms[a].x, e), g = j.max(this.atoms[a].y, g);
      return new b.Point((e + l) / 2, (g + h) / 2)
  }
})(ChemDoodle.structures, Math);
(function(b, j, n, l, h) {
  n.Molecule = function() {
      this.atoms = [];
      this.bonds = [];
      this.rings = []
  };
  var e = n.Molecule.prototype;
  e.findRings = !0;
  e.draw = function(b, a) {
      this.specs && (a = this.specs);
      if (a.atoms_display && !a.atoms_circles_2D)
          for (var d = 0, e = this.atoms.length; d < e; d++) this.atoms[d].draw(b, a);
      if (a.bonds_display) {
          d = 0;
          for (e = this.bonds.length; d < e; d++) this.bonds[d].draw(b, a)
      }
      if (a.atoms_display && a.atoms_circles_2D) {
          d = 0;
          for (e = this.atoms.length; d < e; d++) this.atoms[d].draw(b, a)
      }
  };
  e.render = function(b, a) {
      this.specs && (a = this.specs);
      var d = 0 < this.atoms.length && void 0 !== this.atoms[0].hetatm;
      if (d) {
          if (a.macro_displayBonds) {
              0 < this.bonds.length && (a.bonds_renderAsLines_3D && !this.residueSpecs || this.residueSpecs && this.residueSpecs.bonds_renderAsLines_3D ? (b.lineWidth(this.residueSpecs ? this.residueSpecs.bonds_width_2D : a.bonds_width_2D), b.lineBuffer.bindBuffers(b)) : b.cylinderBuffer.bindBuffers(b), b.material.setTempColors(a.bonds_materialAmbientColor_3D, void 0, a.bonds_materialSpecularColor_3D, a.bonds_materialShininess_3D));
              for (var e = 0, f =
                      this.bonds.length; e < f; e++) {
                  var h = this.bonds[e];
                  if (!h.a1.hetatm && (-1 === a.macro_atomToLigandDistance || void 0 !== h.a1.closestDistance && a.macro_atomToLigandDistance >= h.a1.closestDistance && a.macro_atomToLigandDistance >= h.a2.closestDistance)) h.render(b, this.residueSpecs ? this.residueSpecs : a)
              }
          }
          if (a.macro_displayAtoms) {
              0 < this.atoms.length && (b.sphereBuffer.bindBuffers(b), b.material.setTempColors(a.atoms_materialAmbientColor_3D, void 0, a.atoms_materialSpecularColor_3D, a.atoms_materialShininess_3D));
              e = 0;
              for (f =
                  this.atoms.length; e < f; e++)
                  if (h = this.atoms[e], !h.hetatm && (-1 === a.macro_atomToLigandDistance || void 0 !== h.closestDistance && a.macro_atomToLigandDistance >= h.closestDistance)) h.render(b, this.residueSpecs ? this.residueSpecs : a)
          }
      }
      if (a.bonds_display) {
          var o = [],
              w = [];
          0 < this.bonds.length && (a.bonds_renderAsLines_3D ? (b.lineWidth(a.bonds_width_2D), b.lineBuffer.bindBuffers(b)) : b.cylinderBuffer.bindBuffers(b), b.material.setTempColors(a.bonds_materialAmbientColor_3D, void 0, a.bonds_materialSpecularColor_3D, a.bonds_materialShininess_3D));
          e = 0;
          for (f = this.bonds.length; e < f; e++)
              if (h = this.bonds[e], !d || h.a1.hetatm) a.bonds_showBondOrders_3D ? 0 == h.bondOrder ? w.push(h) : 0.5 == h.bondOrder ? o.push(h) : (1.5 == h.bondOrder && o.push(h), h.render(b, a)) : h.render(b, a);
          if (0 < o.length) {
              a.bonds_renderAsLines_3D || b.pillBuffer.bindBuffers(b);
              e = 0;
              for (f = o.length; e < f; e++) o[e].render(b, a, !0)
          }
          if (0 < w.length) {
              a.bonds_renderAsLines_3D || b.sphereBuffer.bindBuffers(b);
              e = 0;
              for (f = w.length; e < f; e++) w[e].render(b, a, !0)
          }
      }
      if (a.atoms_display) {
          e = 0;
          for (f = this.atoms.length; e < f; e++) h = this.atoms[e],
              h.bondNumber = 0, h.renderAsStar = !1;
          e = 0;
          for (f = this.bonds.length; e < f; e++) h = this.bonds[e], h.a1.bondNumber++, h.a2.bondNumber++;
          0 < this.atoms.length && (b.sphereBuffer.bindBuffers(b), b.material.setTempColors(a.atoms_materialAmbientColor_3D, void 0, a.atoms_materialSpecularColor_3D, a.atoms_materialShininess_3D));
          o = [];
          e = 0;
          for (f = this.atoms.length; e < f; e++)
              if (h = this.atoms[e], !d || h.hetatm && (a.macro_showWater || !h.isWater)) a.atoms_nonBondedAsStars_3D && 0 === h.bondNumber ? (h.renderAsStar = !0, o.push(h)) : h.render(b, a);
          if (0 <
              o.length) {
              b.starBuffer.bindBuffers(b);
              e = 0;
              for (f = o.length; e < f; e++) o[e].render(b, a)
          }
      }
      if (this.chains) {
          b.setMatrixUniforms(b.modelViewMatrix);
          if (a.proteins_displayRibbon) {
              b.material.setTempColors(a.proteins_materialAmbientColor_3D, void 0, a.proteins_materialSpecularColor_3D, a.proteins_materialShininess_3D);
              d = 0;
              for (o = this.ribbons.length; d < o; d++)
                  if (h = a.proteins_ribbonCartoonize ? this.cartoons[d] : this.ribbons[d], "none" !== a.proteins_residueColor) {
                      h.front.bindBuffers(b);
                      w = "rainbow" === a.proteins_residueColor;
                      e = 0;
                      for (f = h.front.segments.length; e < f; e++) w && b.material.setDiffuseColor(j.rainbowAt(e, f, a.macro_rainbowColors)), h.front.segments[e].render(b, a);
                      h.back.bindBuffers(b);
                      e = 0;
                      for (f = h.back.segments.length; e < f; e++) w && b.material.setDiffuseColor(j.rainbowAt(e, f, a.macro_rainbowColors)), h.back.segments[e].render(b, a)
                  } else if (a.proteins_ribbonCartoonize) {
                  h.front.bindBuffers(b);
                  e = 0;
                  for (f = h.front.cartoonSegments.length; e < f; e++) h.front.cartoonSegments[e].render(b, a);
                  h.back.bindBuffers(b);
                  e = 0;
                  for (f = h.back.cartoonSegments.length; e <
                      f; e++) h.back.cartoonSegments[e].render(b, a)
              } else h.front.render(b, a), h.back.render(b, a)
          }
          if (a.proteins_displayBackbone) {
              if (!this.alphaCarbonTrace) {
                  this.alphaCarbonTrace = {
                      nodes: [],
                      edges: []
                  };
                  d = 0;
                  for (o = this.chains.length; d < o; d++)
                      if (w = this.chains[d], !(2 < w.length && l[w[2].name] && "#BEA06E" === l[w[2].name].aminoColor) && 0 < w.length) {
                          e = 1;
                          for (f = w.length - 2; e < f; e++) h = w[e].cp1, h.chainColor = w.chainColor, this.alphaCarbonTrace.nodes.push(h), h = new n.Bond(w[e].cp1, w[e + 1].cp1), h.residueName = w[e].name, h.chainColor = w.chainColor,
                              this.alphaCarbonTrace.edges.push(h), e === w.length - 3 && (h = w[e + 1].cp1, h.chainColor = w.chainColor, this.alphaCarbonTrace.nodes.push(h))
                      }
              }
              if (0 < this.alphaCarbonTrace.nodes.length) {
                  d = new n.VisualSpecifications;
                  d.atoms_display = !0;
                  d.bonds_display = !0;
                  d.atoms_sphereDiameter_3D = a.proteins_backboneThickness;
                  d.bonds_cylinderDiameter_3D = a.proteins_backboneThickness;
                  d.bonds_useJMOLColors = !1;
                  d.atoms_color = a.proteins_backboneColor;
                  d.bonds_color = a.proteins_backboneColor;
                  d.atoms_useVDWDiameters_3D = !1;
                  b.material.setTempColors(a.proteins_materialAmbientColor_3D,
                      void 0, a.proteins_materialSpecularColor_3D, a.proteins_materialShininess_3D);
                  b.material.setDiffuseColor(a.proteins_backboneColor);
                  e = 0;
                  for (f = this.alphaCarbonTrace.nodes.length; e < f; e++) h = this.alphaCarbonTrace.nodes[e], a.macro_colorByChain && (d.atoms_color = h.chainColor), b.sphereBuffer.bindBuffers(b), h.render(b, d);
                  e = 0;
                  for (f = this.alphaCarbonTrace.edges.length; e < f; e++) {
                      var h = this.alphaCarbonTrace.edges[e],
                          A, o = l[h.residueName] ? l[h.residueName] : l["*"];
                      a.macro_colorByChain ? A = h.chainColor : "shapely" === a.proteins_residueColor ?
                          A = o.shapelyColor : "amino" === a.proteins_residueColor ? A = o.aminoColor : "polarity" === a.proteins_residueColor ? A = o.polar ? "#C10000" : "#FFFFFF" : "acidity" === a.proteins_residueColor ? A = 1 === o.acidity ? "#0000FF" : -1 === o.acidity ? "#FF0000" : o.polar ? "#FFFFFF" : "#773300" : "rainbow" === a.proteins_residueColor && (A = j.rainbowAt(e, f, a.macro_rainbowColors));
                      A && (d.bonds_color = A);
                      b.cylinderBuffer.bindBuffers(b);
                      h.render(b, d)
                  }
              }
          }
          if (a.nucleics_display) {
              b.material.setTempColors(a.nucleics_materialAmbientColor_3D, void 0, a.nucleics_materialSpecularColor_3D,
                  a.nucleics_materialShininess_3D);
              d = 0;
              for (o = this.tubes.length; d < o; d++) b.setMatrixUniforms(b.modelViewMatrix), h = this.tubes[d], h.render(b, a)
          }
      }
      a.crystals_displayUnitCell && this.unitCell && (b.setMatrixUniforms(b.modelViewMatrix), this.unitCell.bindBuffers(b), b.material.setDiffuseColor(a.crystals_unitCellColor), b.lineWidth(a.crystals_unitCellLineWidth), b.drawElements(b.LINES, this.unitCell.vertexIndexBuffer.numItems, b.UNSIGNED_SHORT, 0));
      if (a.atoms_display) {
          A = !1;
          e = 0;
          for (f = this.atoms.length; e < f; e++)
              if (h = this.atoms[e],
                  h.isHover || h.isSelected) {
                  A = !0;
                  break
              } if (!A) {
              e = 0;
              for (f = this.bonds.length; e < f; e++)
                  if (h = this.bonds[e], h.isHover || h.isSelected) {
                      A = !0;
                      break
                  }
          }
          if (A) {
              b.sphereBuffer.bindBuffers(b);
              b.blendFunc(b.SRC_ALPHA, b.ONE);
              b.material.setTempColors(a.atoms_materialAmbientColor_3D, void 0, "#000000", 0);
              b.enable(b.BLEND);
              b.depthMask(!1);
              b.material.setAlpha(0.4);
              b.sphereBuffer.bindBuffers(b);
              e = 0;
              for (f = this.atoms.length; e < f; e++) h = this.atoms[e], (h.isHover || h.isSelected) && h.renderHighlight(b, a);
              b.cylinderBuffer.bindBuffers(b);
              e = 0;
              for (f = this.bonds.length; e < f; e++) h = this.bonds[e], (h.isHover || h.isSelected) && h.renderHighlight(b, a);
              b.depthMask(!0);
              b.disable(b.BLEND);
              b.blendFuncSeparate(b.SRC_ALPHA, b.ONE_MINUS_SRC_ALPHA, b.ONE, b.ONE_MINUS_SRC_ALPHA)
          }
      }
      this.surface && a.surfaces_display && (b.setMatrixUniforms(b.modelViewMatrix), this.surface.bindBuffers(b), b.material.setTempColors(a.surfaces_materialAmbientColor_3D, a.surfaces_color, a.surfaces_materialSpecularColor_3D, a.surfaces_materialShininess_3D), "Dot" === a.surfaces_style ? b.drawArrays(b.POINTS,
          0, this.surface.vertexPositionBuffer.numItems) : b.drawElements(b.TRIANGLES, this.surface.vertexIndexBuffer.numItems, b.UNSIGNED_SHORT, 0))
  };
  e.renderPickFrame = function(b, a, d, e, f) {
      this.specs && (a = this.specs);
      var h = 0 < this.atoms.length && void 0 !== this.atoms[0].hetatm;
      if (f && a.bonds_display) {
          0 < this.bonds.length && (a.bonds_renderAsLines_3D ? (b.lineWidth(a.bonds_width_2D), b.lineBuffer.bindBuffers(b)) : b.cylinderBuffer.bindBuffers(b));
          f = 0;
          for (var o = this.bonds.length; f < o; f++) {
              var l = this.bonds[f];
              if (!h || l.a1.hetatm) b.material.setDiffuseColor(j.idx2color(d.length)),
                  l.renderPicker(b, a), d.push(l)
          }
      }
      if (e && a.atoms_display) {
          f = 0;
          for (o = this.atoms.length; f < o; f++) e = this.atoms[f], e.bondNumber = 0, e.renderAsStar = !1;
          f = 0;
          for (o = this.bonds.length; f < o; f++) l = this.bonds[f], l.a1.bondNumber++, l.a2.bondNumber++;
          0 < this.atoms.length && b.sphereBuffer.bindBuffers(b);
          l = [];
          f = 0;
          for (o = this.atoms.length; f < o; f++)
              if (e = this.atoms[f], !h || e.hetatm && (a.macro_showWater || !e.isWater)) a.atoms_nonBondedAsStars_3D && 0 === e.bondNumber ? (e.renderAsStar = !0, l.push(e)) : (b.material.setDiffuseColor(j.idx2color(d.length)),
                  e.render(b, a, !0), d.push(e));
          if (0 < l.length) {
              b.starBuffer.bindBuffers(b);
              f = 0;
              for (o = l.length; f < o; f++) e = l[f], b.material.setDiffuseColor(j.idx2color(d.length)), e.render(b, a, !0), d.push(e)
          }
      }
  };
  e.getCenter3D = function() {
      if (1 === this.atoms.length) return new n.Atom("C", this.atoms[0].x, this.atoms[0].y, this.atoms[0].z);
      var b = Infinity,
          a = Infinity,
          d = Infinity,
          e = -Infinity,
          f = -Infinity,
          j = -Infinity;
      if (this.chains)
          for (var o = 0, l = this.chains.length; o < l; o++)
              for (var A = this.chains[o], q = 0, t = A.length; q < t; q++) var u = A[q],
                  b = h.min(u.cp1.x,
                      u.cp2.x, b),
                  a = h.min(u.cp1.y, u.cp2.y, a),
                  d = h.min(u.cp1.z, u.cp2.z, d),
                  e = h.max(u.cp1.x, u.cp2.x, e),
                  f = h.max(u.cp1.y, u.cp2.y, f),
                  j = h.max(u.cp1.z, u.cp2.z, j);
      o = 0;
      for (l = this.atoms.length; o < l; o++) b = h.min(this.atoms[o].x, b), a = h.min(this.atoms[o].y, a), d = h.min(this.atoms[o].z, d), e = h.max(this.atoms[o].x, e), f = h.max(this.atoms[o].y, f), j = h.max(this.atoms[o].z, j);
      return new n.Atom("C", (e + b) / 2, (f + a) / 2, (j + d) / 2)
  };
  e.getCenter = function() {
      if (1 === this.atoms.length) return new n.Point(this.atoms[0].x, this.atoms[0].y);
      for (var b =
              Infinity, a = Infinity, d = -Infinity, e = -Infinity, f = 0, j = this.atoms.length; f < j; f++) b = h.min(this.atoms[f].x, b), a = h.min(this.atoms[f].y, a), d = h.max(this.atoms[f].x, d), e = h.max(this.atoms[f].y, e);
      return new n.Point((d + b) / 2, (e + a) / 2)
  };
  e.getDimension = function() {
      if (1 === this.atoms.length) return new n.Point(0, 0);
      var b = Infinity,
          a = Infinity,
          d = -Infinity,
          e = -Infinity;
      if (this.chains) {
          for (var f = 0, j = this.chains.length; f < j; f++)
              for (var o = this.chains[f], l = 0, A = o.length; l < A; l++) var q = o[l],
                  b = h.min(q.cp1.x, q.cp2.x, b),
                  a = h.min(q.cp1.y,
                      q.cp2.y, a),
                  d = h.max(q.cp1.x, q.cp2.x, d),
                  e = h.max(q.cp1.y, q.cp2.y, e);
          b -= 30;
          a -= 30;
          d += 30;
          e += 30
      }
      f = 0;
      for (j = this.atoms.length; f < j; f++) b = h.min(this.atoms[f].x, b), a = h.min(this.atoms[f].y, a), d = h.max(this.atoms[f].x, d), e = h.max(this.atoms[f].y, e);
      return new n.Point(d - b, e - a)
  };
  e.check = function(e) {
      if (e && this.doChecks) {
          if (this.findRings)
              if (this.bonds.length - this.atoms.length !== this.fjNumCache) {
                  this.rings = (new b.informatics.SSSRFinder(this)).rings;
                  for (var a = 0, d = this.bonds.length; a < d; a++) this.bonds[a].ring = void 0;
                  a =
                      0;
                  for (d = this.rings.length; a < d; a++) this.rings[a].setupBonds()
              } else {
                  a = 0;
                  for (d = this.rings.length; a < d; a++) {
                      var h = this.rings[a];
                      h.center = h.getCenter()
                  }
              } a = 0;
          for (d = this.atoms.length; a < d; a++)
              if (this.atoms[a].isLone = !1, "C" === this.atoms[a].label) {
                  for (var f = h = 0, j = this.bonds.length; f < j; f++)(this.bonds[f].a1 === this.atoms[a] || this.bonds[f].a2 === this.atoms[a]) && h++;
                  0 === h && (this.atoms[a].isLone = !0)
              } h = !1;
          a = 0;
          for (d = this.atoms.length; a < d; a++) 0 !== this.atoms[a].z && (h = !0);
          h && (this.sortAtomsByZ(), this.sortBondsByZ());
          this.setupMetaData();
          this.atomNumCache = this.atoms.length;
          this.bondNumCache = this.bonds.length;
          this.fjNumCache = this.bonds.length - this.atoms.length
      }
      this.doChecks = !e
  };
  e.getAngles = function(b) {
      for (var a = [], d = 0, e = this.bonds.length; d < e; d++) this.bonds[d].contains(b) && a.push(b.angle(this.bonds[d].getNeighbor(b)));
      a.sort();
      return a
  };
  e.getCoordinationNumber = function(b) {
      for (var a = 0, d = 0, e = b.length; d < e; d++) a += b[d].bondOrder;
      return a
  };
  e.getBonds = function(b) {
      for (var a = [], d = 0, e = this.bonds.length; d < e; d++) this.bonds[d].contains(b) && a.push(this.bonds[d]);
      return a
  };
  e.sortAtomsByZ = function() {
      for (var b = 1, a = this.atoms.length; b < a; b++)
          for (var d = b; 0 < d && this.atoms[d].z < this.atoms[d - 1].z;) {
              var e = this.atoms[d];
              this.atoms[d] = this.atoms[d - 1];
              this.atoms[d - 1] = e;
              d--
          }
  };
  e.sortBondsByZ = function() {
      for (var b = 1, a = this.bonds.length; b < a; b++)
          for (var d = b; 0 < d && this.bonds[d].a1.z + this.bonds[d].a2.z < this.bonds[d - 1].a1.z + this.bonds[d - 1].a2.z;) {
              var e = this.bonds[d];
              this.bonds[d] = this.bonds[d - 1];
              this.bonds[d - 1] = e;
              d--
          }
  };
  e.setupMetaData = function() {
      for (var b = this.getCenter(), a = 0, d =
              this.atoms.length; a < d; a++) {
          var e = this.atoms[a];
          e.bonds = this.getBonds(e);
          e.angles = this.getAngles(e);
          e.isHidden = 2 === e.bonds.length && h.abs(h.abs(e.angles[1] - e.angles[0]) - h.PI) < h.PI / 30 && e.bonds[0].bondOrder === e.bonds[1].bondOrder;
          var f = j.angleBetweenLargest(e.angles);
          e.angleOfLeastInterference = f.angle % (2 * h.PI);
          e.largestAngle = f.largest;
          e.coordinationNumber = this.getCoordinationNumber(e.bonds);
          e.bondNumber = e.bonds.length;
          e.molCenter = b
      }
      a = 0;
      for (d = this.bonds.length; a < d; a++) this.bonds[a].molCenter = b
  };
  e.scaleToAverageBondLength =
      function(b) {
          var a = this.getAverageBondLength();
          if (0 !== a) {
              b /= a;
              for (var a = 0, d = this.atoms.length; a < d; a++) this.atoms[a].x *= b, this.atoms[a].y *= b
          }
      };
  e.getAverageBondLength = function() {
      if (0 === this.bonds.length) return 0;
      for (var b = 0, a = 0, d = this.bonds.length; a < d; a++) b += this.bonds[a].getLength();
      return b /= this.bonds.length
  };
  e.getBounds = function() {
      for (var b = new j.Bounds, a = 0, d = this.atoms.length; a < d; a++) b.expand(this.atoms[a].getBounds());
      if (this.chains) {
          a = 0;
          for (d = this.chains.length; a < d; a++)
              for (var e = this.chains[a],
                      f = 0, h = e.length; f < h; f++) {
                  var o = e[f];
                  b.expand(o.cp1.x, o.cp1.y);
                  b.expand(o.cp2.x, o.cp2.y)
              }
          b.minX -= 30;
          b.minY -= 30;
          b.maxX += 30;
          b.maxY += 30
      }
      return b
  };
  e.getBounds3D = function() {
      for (var b = new j.Bounds, a = 0, d = this.atoms.length; a < d; a++) b.expand(this.atoms[a].getBounds3D());
      if (this.chains) {
          a = 0;
          for (d = this.chains.length; a < d; a++)
              for (var e = this.chains[a], f = 0, h = e.length; f < h; f++) {
                  var o = e[f];
                  b.expand3D(o.cp1.x, o.cp1.y, o.cp1.z);
                  b.expand3D(o.cp2.x, o.cp2.y, o.cp2.z)
              }
      }
      return b
  }
})(ChemDoodle, ChemDoodle.math, ChemDoodle.structures,
  ChemDoodle.RESIDUE, Math);
(function(b, j, n, l) {
  var h, e = -1;
  b.Residue = function(a) {
      this.resSeq = a
  };
  var g = b.Residue.prototype;
  g.setup = function(a, d) {
      this.horizontalResolution = d;
      var e = [a.x - this.cp1.x, a.y - this.cp1.y, a.z - this.cp1.z],
          f = l.cross(e, [this.cp2.x - this.cp1.x, this.cp2.y - this.cp1.y, this.cp2.z - this.cp1.z], []);
      this.D = l.cross(f, e, []);
      l.normalize(f);
      l.normalize(this.D);
      this.guidePointsSmall = [];
      this.guidePointsLarge = [];
      e = [(a.x + this.cp1.x) / 2, (a.y + this.cp1.y) / 2, (a.z + this.cp1.z) / 2];
      this.helix && (l.scale(f, 1.5), l.add(e, f));
      this.guidePointsSmall[0] =
          new b.Atom("", e[0] - this.D[0] / 2, e[1] - this.D[1] / 2, e[2] - this.D[2] / 2);
      for (f = 1; f < d; f++) this.guidePointsSmall[f] = new b.Atom("", this.guidePointsSmall[0].x + this.D[0] * f / d, this.guidePointsSmall[0].y + this.D[1] * f / d, this.guidePointsSmall[0].z + this.D[2] * f / d);
      l.scale(this.D, 4);
      this.guidePointsLarge[0] = new b.Atom("", e[0] - this.D[0] / 2, e[1] - this.D[1] / 2, e[2] - this.D[2] / 2);
      for (f = 1; f < d; f++) this.guidePointsLarge[f] = new b.Atom("", this.guidePointsLarge[0].x + this.D[0] * f / d, this.guidePointsLarge[0].y + this.D[1] * f / d, this.guidePointsLarge[0].z +
          this.D[2] * f / d)
  };
  g.getGuidePointSet = function(a) {
      if (0 === a) return this.helix || this.sheet ? this.guidePointsLarge : this.guidePointsSmall;
      if (1 === a) return this.guidePointsSmall;
      if (2 === a) return this.guidePointsLarge
  };
  g.computeLineSegments = function(a, d, b, f, g) {
      if (g !== e) {
          var j = g * g,
              l = g * g * g;
          h = n.multiply([-1 / 6, 0.5, -0.5, 1 / 6, 0.5, -1, 0.5, 0, -0.5, 0, 0.5, 0, 1 / 6, 2 / 3, 1 / 6, 0], [6 / l, 0, 0, 0, 6 / l, 2 / j, 0, 0, 1 / l, 1 / j, 1 / g, 0, 0, 0, 0, 1], []);
          e = g
      }
      this.split = d.helix !== this.helix || d.sheet !== this.sheet;
      this.lineSegments = this.innerCompute(0, a, d, b,
          !1, g);
      f && (this.lineSegmentsCartoon = this.innerCompute(d.helix || d.sheet ? 2 : 1, a, d, b, !0, g))
  };
  g.innerCompute = function(a, d, e, f, g, o) {
      var w = [],
          A = this.getGuidePointSet(a);
      d = d.getGuidePointSet(a);
      e = e.getGuidePointSet(a);
      for (var q = f.getGuidePointSet(a), t = 0, u = this.guidePointsLarge.length; t < u; t++) {
          for (var v = n.multiply([d[t].x, d[t].y, d[t].z, 1, A[t].x, A[t].y, A[t].z, 1, e[t].x, e[t].y, e[t].z, 1, q[t].x, q[t].y, q[t].z, 1], h, []), z = [], y = 0; y < o; y++) {
              for (a = 3; 0 < a; a--)
                  for (f = 0; 4 > f; f++) v[4 * a + f] += v[4 * (a - 1) + f];
              z[y] = new b.Atom("", v[12] /
                  v[15], v[13] / v[15], v[14] / v[15])
          }
          w[t] = z
      }
      if (g && this.arrow)
          for (a = 0; a < o; a++) {
              g = 1.5 - 1.3 * a / o;
              A = j.floor(this.horizontalResolution / 2);
              d = w[A];
              f = 0;
              for (e = w.length; f < e; f++) f !== A && (q = d[a], t = w[f][a], u = [t.x - q.x, t.y - q.y, t.z - q.z], l.scale(u, g), t.x = q.x + u[0], t.y = q.y + u[1], t.z = q.z + u[2])
          }
      return w
  }
})(ChemDoodle.structures, Math, ChemDoodle.lib.mat4, ChemDoodle.lib.vec3);
(function(b, j, n, l, h) {
  j.Spectrum = function() {
      this.data = [];
      this.metadata = [];
      this.dataDisplay = [];
      this.memory = {
          offsetTop: 0,
          offsetLeft: 0,
          offsetBottom: 0,
          flipXAxis: !1,
          scale: 1,
          width: 0,
          height: 0
      }
  };
  l = j.Spectrum.prototype;
  l.title = void 0;
  l.xUnit = void 0;
  l.yUnit = void 0;
  l.continuous = !0;
  l.integrationSensitivity = 0.01;
  l.draw = function(e, g, a, d) {
      this.specs && (g = this.specs);
      var j = 5,
          f = 0,
          l = 0;
      e.fillStyle = g.text_color;
      e.textAlign = "center";
      e.textBaseline = "alphabetic";
      e.font = b.getFontString(g.text_font_size, g.text_font_families);
      this.xUnit && (l += g.text_font_size, e.fillText(this.xUnit, a / 2, d - 2));
      this.yUnit && g.plots_showYAxis && (f += g.text_font_size, e.save(), e.translate(g.text_font_size, d / 2), e.rotate(-h.PI / 2), e.fillText(this.yUnit, 0, 0), e.restore());
      this.title && (j += g.text_font_size, e.fillText(this.title, a / 2, g.text_font_size));
      l += 5 + g.text_font_size;
      g.plots_showYAxis && (f += 5 + e.measureText("1000").width);
      g.plots_showGrid && (e.strokeStyle = g.plots_gridColor, e.lineWidth = g.plots_gridLineWidth, e.strokeRect(f, j, a - f, d - l - j));
      e.textAlign = "center";
      e.textBaseline = "top";
      for (var o = this.maxX - this.minX, w = o / 100, n = 0.001; n < w || 25 < o / n;) n *= 10;
      for (var q = 0, t = g.plots_flipXAxis ? a : 0, o = h.round(this.minX / n) * n; o <= this.maxX; o += n / 2) {
          var u = this.getTransformedX(o, g, a, f);
          if (u > f)
              if (e.strokeStyle = "black", e.lineWidth = 1, 0 === q % 2) {
                  e.beginPath();
                  e.moveTo(u, d - l);
                  e.lineTo(u, d - l + 2);
                  e.stroke();
                  for (w = o.toFixed(5);
                      "0" === w.charAt(w.length - 1);) w = w.substring(0, w.length - 1);
                  "." === w.charAt(w.length - 1) && (w = w.substring(0, w.length - 1));
                  var v = e.measureText(w).width;
                  g.plots_flipXAxis && (v *=
                      -1);
                  var z = u - v / 2;
                  if (g.plots_flipXAxis ? z < t : z > t) e.fillText(w, u, d - l + 2), t = u + v / 2;
                  g.plots_showGrid && (e.strokeStyle = g.plots_gridColor, e.lineWidth = g.plots_gridLineWidth, e.beginPath(), e.moveTo(u, d - l), e.lineTo(u, j), e.stroke())
              } else e.beginPath(), e.moveTo(u, d - l), e.lineTo(u, d - l + 2), e.stroke();
          q++
      }
      if (g.plots_showYAxis || g.plots_showGrid) {
          n = 1 / g.scale;
          e.textAlign = "right";
          e.textBaseline = "middle";
          for (o = 0; 10 >= o; o++)
              if (w = n / 10 * o, q = j + (d - l - j) * (1 - w * g.scale), g.plots_showGrid && (e.strokeStyle = g.plots_gridColor, e.lineWidth = g.plots_gridLineWidth,
                      e.beginPath(), e.moveTo(f, q), e.lineTo(a, q), e.stroke()), g.plots_showYAxis) {
                  e.strokeStyle = "black";
                  e.lineWidth = 1;
                  e.beginPath();
                  e.moveTo(f, q);
                  e.lineTo(f - 3, q);
                  e.stroke();
                  w *= 100;
                  t = h.max(0, 3 - h.floor(w).toString().length);
                  w = w.toFixed(t);
                  if (0 < t)
                      for (;
                          "0" === w.charAt(w.length - 1);) w = w.substring(0, w.length - 1);
                  "." === w.charAt(w.length - 1) && (w = w.substring(0, w.length - 1));
                  e.fillText(w, f - 3, q)
              }
      }
      e.strokeStyle = "black";
      e.lineWidth = 1;
      e.beginPath();
      e.moveTo(a, d - l);
      e.lineTo(f, d - l);
      g.plots_showYAxis && e.lineTo(f, j);
      e.stroke();
      if (0 < this.dataDisplay.length) {
          e.textAlign = "left";
          e.textBaseline = "top";
          o = w = 0;
          for (n = this.dataDisplay.length; o < n; o++)
              if (this.dataDisplay[o].value) e.fillText([this.dataDisplay[o].display, ": ", this.dataDisplay[o].value].join(""), f + 10, j + 10 + w * (g.text_font_size + 5)), w++;
              else if (this.dataDisplay[o].tag) {
              q = 0;
              for (t = this.metadata.length; q < t; q++)
                  if (b.stringStartsWith(this.metadata[q], this.dataDisplay[o].tag)) {
                      t = this.metadata[q];
                      this.dataDisplay[o].display && (t = this.metadata[q].indexOf("\x3d"), t = [this.dataDisplay[o].display,
                          ": ", -1 < t ? this.metadata[q].substring(t + 2) : this.metadata[q]
                      ].join(""));
                      e.fillText(t, f + 10, j + 10 + w * (g.text_font_size + 5));
                      w++;
                      break
                  }
          }
      }
      this.drawPlot(e, g, a, d, j, f, l);
      this.memory.offsetTop = j;
      this.memory.offsetLeft = f;
      this.memory.offsetBottom = l;
      this.memory.flipXAxis = g.plots_flipXAxis;
      this.memory.scale = g.scale;
      this.memory.width = a;
      this.memory.height = d
  };
  l.drawPlot = function(b, g, a, d, l, f, p) {
      this.specs && (g = this.specs);
      b.strokeStyle = g.plots_color;
      b.lineWidth = g.plots_width;
      var o = [];
      b.beginPath();
      if (this.continuous)
          for (var w = !1, n = 0, q = !1, t = 0, u = this.data.length; t < u; t++) {
              var v = this.getTransformedX(this.data[t].x, g, a, f),
                  z;
              t < u && !w && (z = this.getTransformedX(this.data[t + 1].x, g, a, f));
              if (v >= f && v < a || void 0 !== z && z >= f && z < a) {
                  var y = this.getTransformedY(this.data[t].y, g, d, p, l);
                  g.plots_showIntegration && h.abs(this.data[t].y) > this.integrationSensitivity && o.push(new j.Point(this.data[t].x, this.data[t].y));
                  w || (b.moveTo(v, y), w = !0);
                  b.lineTo(v, y);
                  n++;
                  0 === n % 1E3 && (b.stroke(), b.beginPath(), b.moveTo(v, y));
                  if (q) break
              } else w && (q = !0)
          } else {
              t = 0;
              for (u =
                  this.data.length; t < u; t++) v = this.getTransformedX(this.data[t].x, g, a, f), v >= f && v < a && (b.moveTo(v, d - p), b.lineTo(v, this.getTransformedY(this.data[t].y, g, d, p, l)))
          }
      b.stroke();
      if (g.plots_showIntegration && 1 < o.length) {
          b.strokeStyle = g.plots_integrationColor;
          b.lineWidth = g.plots_integrationLineWidth;
          b.beginPath();
          t = o[1].x > o[0].x;
          if (this.flipXAxis && !t || !this.flipXAxis && t) {
              for (t = o.length - 2; 0 <= t; t--) o[t].y += o[t + 1].y;
              w = o[0].y
          } else {
              t = 1;
              for (u = o.length; t < u; t++) o[t].y += o[t - 1].y;
              w = o[o.length - 1].y
          }
          t = 0;
          for (u = o.length; t < u; t++) v =
              this.getTransformedX(o[t].x, g, a, f), y = this.getTransformedY(o[t].y / g.scale / w, g, d, p, l), 0 === t ? b.moveTo(v, y) : b.lineTo(v, y);
          b.stroke()
      }
  };
  l.getTransformedY = function(b, h, a, d, j) {
      return j + (a - d - j) * (1 - b * h.scale)
  };
  l.getInverseTransformedY = function(b) {
      return 100 * ((1 - (b - this.memory.offsetTop) / (this.memory.height - this.memory.offsetBottom - this.memory.offsetTop)) / this.memory.scale)
  };
  l.getTransformedX = function(b, h, a, d) {
      b = d + (b - this.minX) / (this.maxX - this.minX) * (a - d);
      h.plots_flipXAxis && (b = a + d - b);
      return b
  };
  l.getInverseTransformedX =
      function(b) {
          this.memory.flipXAxis && (b = this.memory.width + this.memory.offsetLeft - b);
          return (b - this.memory.offsetLeft) * (this.maxX - this.minX) / (this.memory.width - this.memory.offsetLeft) + this.minX
      };
  l.setup = function() {
      for (var b = Number.MAX_VALUE, g = Number.MIN_VALUE, a = Number.MIN_VALUE, d = 0, j = this.data.length; d < j; d++) b = h.min(b, this.data[d].x), g = h.max(g, this.data[d].x), a = h.max(a, this.data[d].y);
      this.continuous ? (this.minX = b, this.maxX = g) : (this.minX = b - 1, this.maxX = g + 1);
      d = 0;
      for (j = this.data.length; d < j; d++) this.data[d].y /=
          a
  };
  l.zoom = function(b, g, a, d) {
      b = this.getInverseTransformedX(b);
      g = this.getInverseTransformedX(g);
      this.minX = h.min(b, g);
      this.maxX = h.max(b, g);
      if (d) {
          d = Number.MIN_VALUE;
          g = 0;
          for (b = this.data.length; g < b; g++) n.isBetween(this.data[g].x, this.minX, this.maxX) && (d = h.max(d, this.data[g].y));
          return 1 / d
      }
  };
  l.translate = function(b, h) {
      var a = b / (h - this.memory.offsetLeft) * (this.maxX - this.minX) * (this.memory.flipXAxis ? 1 : -1);
      this.minX += a;
      this.maxX += a
  };
  l.alertMetadata = function() {
      alert(this.metadata.join("\n"))
  };
  l.getInternalCoordinates =
      function(b, h) {
          return new ChemDoodle.structures.Point(this.getInverseTransformedX(b), this.getInverseTransformedY(h))
      };
  l.getClosestPlotInternalCoordinates = function(b) {
      var h = this.getInverseTransformedX(b - 1);
      b = this.getInverseTransformedX(b + 1);
      if (h > b) {
          var a = h,
              h = b;
          b = a
      }
      for (var a = -1, d = -Infinity, j = !1, f = 0, l = this.data.length; f < l; f++) {
          var o = this.data[f];
          if (n.isBetween(o.x, h, b)) o.y > d && (j = !0, d = o.y, a = f);
          else if (j) break
      }
      if (-1 !== a) return o = this.data[a], new ChemDoodle.structures.Point(o.x, 100 * o.y)
  };
  l.getClosestPeakInternalCoordinates =
      function(b) {
          var g = this.getInverseTransformedX(b);
          b = 0;
          for (var a = Infinity, d = 0, j = this.data.length; d < j; d++) {
              var f = h.abs(this.data[d].x - g);
              if (f <= a) a = f, b = d;
              else break
          }
          g = highestRight = b;
          a = maxRight = this.data[b].y;
          d = b + 1;
          for (j = this.data.length; d < j; d++)
              if (this.data[d].y + 0.05 > maxRight) maxRight = this.data[d].y, highestRight = d;
              else break;
          for (d = b - 1; 0 <= d; d--)
              if (this.data[d].y + 0.05 > a) a = this.data[d].y, g = d;
              else break;
          b = this.data[g - b > highestRight - b ? highestRight : g];
          return new ChemDoodle.structures.Point(b.x, 100 * b.y)
      }
})(ChemDoodle.extensions,
  ChemDoodle.structures, ChemDoodle.math, ChemDoodle.lib.jQuery, Math);
(function(b, j, n) {
  j._Shape = function() {};
  j = j._Shape.prototype;
  j.drawDecorations = function(b, h) {
      if (this.isHover)
          for (var e = this.getPoints(), g = 0, a = e.length; g < a; g++) {
              var d = e[g];
              this.drawAnchor(b, h, d, d === this.hoverPoint)
          }
  };
  j.getBounds = function() {
      for (var j = new b.Bounds, h = this.getPoints(), e = 0, g = h.length; e < g; e++) {
          var a = h[e];
          j.expand(a.x, a.y)
      }
      return j
  };
  j.drawAnchor = function(b, h, e, g) {
      b.save();
      b.translate(e.x, e.y);
      b.rotate(n.PI / 4);
      b.scale(1 / h.scale, 1 / h.scale);
      b.beginPath();
      b.moveTo(-4, -4);
      b.lineTo(4, -4);
      b.lineTo(4,
          4);
      b.lineTo(-4, 4);
      b.closePath();
      b.fillStyle = g ? "#885110" : "white";
      b.fill();
      b.beginPath();
      b.moveTo(-4, -2);
      b.lineTo(-4, -4);
      b.lineTo(-2, -4);
      b.moveTo(2, -4);
      b.lineTo(4, -4);
      b.lineTo(4, -2);
      b.moveTo(4, 2);
      b.lineTo(4, 4);
      b.lineTo(2, 4);
      b.moveTo(-2, 4);
      b.lineTo(-4, 4);
      b.lineTo(-4, 2);
      b.moveTo(-4, -2);
      b.strokeStyle = "rgba(0,0,0,.2)";
      b.lineWidth = 5;
      b.stroke();
      b.strokeStyle = "blue";
      b.lineWidth = 1;
      b.stroke();
      b.restore()
  }
})(ChemDoodle.math, ChemDoodle.structures.d2, Math);
(function(b, j, n, l, h) {
  l.Bracket = function(b, h) {
      this.p1 = b ? b : new n.Point;
      this.p2 = h ? h : new n.Point
  };
  l = l.Bracket.prototype = new l._Shape;
  l.charge = 0;
  l.mult = 0;
  l.repeat = 0;
  l.draw = function(e, g) {
      var a = h.min(this.p1.x, this.p2.x),
          d = h.max(this.p1.x, this.p2.x),
          j = h.min(this.p1.y, this.p2.y),
          f = h.max(this.p1.y, this.p2.y),
          l = f - j,
          o = l / 10;
      e.beginPath();
      e.moveTo(a + o, j);
      e.lineTo(a, j);
      e.lineTo(a, f);
      e.lineTo(a + o, f);
      e.moveTo(d - o, f);
      e.lineTo(d, f);
      e.lineTo(d, j);
      e.lineTo(d - o, j);
      this.isLassoed && (o = e.createLinearGradient(this.p1.x, this.p1.y,
          this.p2.x, this.p2.y), o.addColorStop(0, "rgba(212, 99, 0, 0)"), o.addColorStop(0.5, "rgba(212, 99, 0, 0.8)"), o.addColorStop(1, "rgba(212, 99, 0, 0)"), e.lineWidth = g.shapes_lineWidth_2D + 5, e.strokeStyle = o, e.lineJoin = "miter", e.lineCap = "square", e.stroke());
      e.strokeStyle = g.shapes_color;
      e.lineWidth = g.shapes_lineWidth_2D;
      e.lineJoin = "miter";
      e.lineCap = "butt";
      e.stroke();
      0 !== this.charge && (e.fillStyle = g.text_color, e.textAlign = "left", e.textBaseline = "alphabetic", e.font = b.getFontString(g.text_font_size, g.text_font_families),
          o = this.charge.toFixed(0), o = "1" === o ? "+" : "-1" === o ? "\u2013" : b.stringStartsWith(o, "-") ? o.substring(1) + "\u2013" : o + "+", e.fillText(o, d + 5, j + 5));
      0 !== this.mult && (e.fillStyle = g.text_color, e.textAlign = "right", e.textBaseline = "middle", e.font = b.getFontString(g.text_font_size, g.text_font_families), e.fillText(this.mult.toFixed(0), a - 5, j + l / 2));
      0 !== this.repeat && (e.fillStyle = g.text_color, e.textAlign = "left", e.textBaseline = "top", e.font = b.getFontString(g.text_font_size, g.text_font_families), o = this.repeat.toFixed(0), e.fillText(o,
          d + 5, f - 5))
  };
  l.getPoints = function() {
      return [this.p1, this.p2]
  };
  l.isOver = function(b) {
      return j.isBetween(b.x, this.p1.x, this.p2.x) && j.isBetween(b.y, this.p1.y, this.p2.y)
  }
})(ChemDoodle.extensions, ChemDoodle.math, ChemDoodle.structures, ChemDoodle.structures.d2, Math);
(function(b, j, n, l) {
  n.Line = function(b, h) {
      this.p1 = b ? b : new j.Point;
      this.p2 = h ? h : new j.Point
  };
  n.Line.ARROW_SYNTHETIC = "synthetic";
  n.Line.ARROW_RETROSYNTHETIC = "retrosynthetic";
  n.Line.ARROW_RESONANCE = "resonance";
  n.Line.ARROW_EQUILIBRIUM = "equilibrium";
  var h = n.Line.prototype = new n._Shape;
  h.arrowType = void 0;
  h.topText = void 0;
  h.bottomText = void 0;
  h.draw = function(b, h) {
      if (this.isLassoed) {
          var a = b.createLinearGradient(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
          a.addColorStop(0, "rgba(212, 99, 0, 0)");
          a.addColorStop(0.5,
              "rgba(212, 99, 0, 0.8)");
          a.addColorStop(1, "rgba(212, 99, 0, 0)");
          var d = 2.5,
              j = this.p1.angle(this.p2) + l.PI / 2,
              f = l.cos(j),
              j = l.sin(j),
              p = this.p1.x - f * d,
              o = this.p1.y + j * d,
              w = this.p1.x + f * d,
              A = this.p1.y - j * d,
              q = this.p2.x + f * d,
              t = this.p2.y - j * d,
              u = this.p2.x - f * d,
              v = this.p2.y + j * d;
          b.fillStyle = a;
          b.beginPath();
          b.moveTo(p, o);
          b.lineTo(w, A);
          b.lineTo(q, t);
          b.lineTo(u, v);
          b.closePath();
          b.fill()
      }
      b.strokeStyle = h.shapes_color;
      b.fillStyle = h.shapes_color;
      b.lineWidth = h.shapes_lineWidth_2D;
      b.lineJoin = "miter";
      b.lineCap = "butt";
      if (this.p1.x !==
          this.p2.x || this.p1.y !== this.p2.y) {
          if (this.arrowType === n.Line.ARROW_RETROSYNTHETIC) {
              var a = 2 * l.sqrt(2),
                  d = h.shapes_arrowLength_2D / a,
                  f = this.p1.angle(this.p2),
                  j = f + l.PI / 2,
                  a = h.shapes_arrowLength_2D / a,
                  z = l.cos(f),
                  y = l.sin(f),
                  f = l.cos(j),
                  j = l.sin(j),
                  p = this.p1.x - f * d,
                  o = this.p1.y + j * d,
                  w = this.p1.x + f * d,
                  A = this.p1.y - j * d,
                  q = this.p2.x + f * d - z * a,
                  t = this.p2.y - j * d + y * a,
                  u = this.p2.x - f * d - z * a,
                  v = this.p2.y + j * d + y * a,
                  B = this.p2.x + 2 * f * d - 2 * z * a,
                  c = this.p2.y - 2 * j * d + 2 * y * a,
                  k = this.p2.x - 2 * f * d - 2 * z * a,
                  d = this.p2.y + 2 * j * d + 2 * y * a;
              b.beginPath();
              b.moveTo(w,
                  A);
              b.lineTo(q, t);
              b.moveTo(B, c);
              b.lineTo(this.p2.x, this.p2.y);
              b.lineTo(k, d);
              b.moveTo(u, v);
              b.lineTo(p, o)
          } else this.arrowType === n.Line.ARROW_EQUILIBRIUM ? (a = 2 * l.sqrt(2), d = h.shapes_arrowLength_2D / a / 2, f = this.p1.angle(this.p2), j = f + l.PI / 2, a = 2 * h.shapes_arrowLength_2D / l.sqrt(3), z = l.cos(f), y = l.sin(f), f = l.cos(j), j = l.sin(j), p = this.p1.x - f * d, o = this.p1.y + j * d, w = this.p1.x + f * d, A = this.p1.y - j * d, q = this.p2.x + f * d, t = this.p2.y - j * d, u = this.p2.x - f * d, v = this.p2.y + j * d, b.beginPath(), b.moveTo(w, A), b.lineTo(q, t), b.moveTo(u, v), b.lineTo(p,
              o), b.stroke(), w = q - 0.8 * z * a, A = t + 0.8 * y * a, B = q + f * h.shapes_arrowLength_2D / 3 - z * a, c = t - j * h.shapes_arrowLength_2D / 3 + y * a, b.beginPath(), b.moveTo(q, t), b.lineTo(B, c), b.lineTo(w, A), b.closePath(), b.fill(), b.stroke(), w = p + 0.8 * z * a, A = o - 0.8 * y * a, B = p - f * h.shapes_arrowLength_2D / 3 + z * a, c = o + j * h.shapes_arrowLength_2D / 3 - y * a, b.beginPath(), b.moveTo(p, o), b.lineTo(B, c), b.lineTo(w, A), b.closePath(), b.fill()) : this.arrowType === n.Line.ARROW_SYNTHETIC ? (f = this.p1.angle(this.p2), j = f + l.PI / 2, a = 2 * h.shapes_arrowLength_2D / l.sqrt(3), z = l.cos(f),
              y = l.sin(f), f = l.cos(j), j = l.sin(j), b.beginPath(), b.moveTo(this.p1.x, this.p1.y), b.lineTo(this.p2.x - z * a / 2, this.p2.y + y * a / 2), b.stroke(), w = this.p2.x - 0.8 * z * a, A = this.p2.y + 0.8 * y * a, B = this.p2.x + f * h.shapes_arrowLength_2D / 3 - z * a, c = this.p2.y - j * h.shapes_arrowLength_2D / 3 + y * a, k = this.p2.x - f * h.shapes_arrowLength_2D / 3 - z * a, d = this.p2.y + j * h.shapes_arrowLength_2D / 3 + y * a, b.beginPath(), b.moveTo(this.p2.x, this.p2.y), b.lineTo(k, d), b.lineTo(w, A), b.lineTo(B, c), b.closePath(), b.fill()) : this.arrowType === n.Line.ARROW_RESONANCE ? (f = this.p1.angle(this.p2),
              j = f + l.PI / 2, a = 2 * h.shapes_arrowLength_2D / l.sqrt(3), z = l.cos(f), y = l.sin(f), f = l.cos(j), j = l.sin(j), b.beginPath(), b.moveTo(this.p1.x + z * a / 2, this.p1.y - y * a / 2), b.lineTo(this.p2.x - z * a / 2, this.p2.y + y * a / 2), b.stroke(), w = this.p2.x - 0.8 * z * a, A = this.p2.y + 0.8 * y * a, B = this.p2.x + f * h.shapes_arrowLength_2D / 3 - z * a, c = this.p2.y - j * h.shapes_arrowLength_2D / 3 + y * a, k = this.p2.x - f * h.shapes_arrowLength_2D / 3 - z * a, d = this.p2.y + j * h.shapes_arrowLength_2D / 3 + y * a, b.beginPath(), b.moveTo(this.p2.x, this.p2.y), b.lineTo(k, d), b.lineTo(w, A), b.lineTo(B,
                  c), b.closePath(), b.fill(), b.stroke(), w = this.p1.x + 0.8 * z * a, A = this.p1.y - 0.8 * y * a, B = this.p1.x - f * h.shapes_arrowLength_2D / 3 + z * a, c = this.p1.y + j * h.shapes_arrowLength_2D / 3 - y * a, k = this.p1.x + f * h.shapes_arrowLength_2D / 3 + z * a, d = this.p1.y - j * h.shapes_arrowLength_2D / 3 - y * a, b.beginPath(), b.moveTo(this.p1.x, this.p1.y), b.lineTo(k, d), b.lineTo(w, A), b.lineTo(B, c), b.closePath(), b.fill()) : (b.beginPath(), b.moveTo(this.p1.x, this.p1.y), b.lineTo(this.p2.x, this.p2.y));
          b.stroke();
          this.topText && (b.textAlign = "center", b.textBaseline =
              "bottom", b.fillText(this.topText, (this.p1.x + this.p2.x) / 2, this.p1.y - 5));
          this.bottomText && (b.textAlign = "center", b.textBaseline = "top", b.fillText(this.bottomText, (this.p1.x + this.p2.x) / 2, this.p1.y + 5))
      }
  };
  h.getPoints = function() {
      return [this.p1, this.p2]
  };
  h.isOver = function(e, h) {
      var a = b.distanceFromPointToLineInclusive(e, this.p1, this.p2);
      return -1 !== a && a < h
  }
})(ChemDoodle.math, ChemDoodle.structures, ChemDoodle.structures.d2, Math);
(function(b, j, n, l, h) {
  var e = function(a) {
          var b = [];
          if (a instanceof n.Atom)
              if (0 === a.bondNumber) b.push(h.PI);
              else {
                  if (a.angles) {
                      if (1 === a.angles.length) b.push(a.angles[0] + h.PI);
                      else {
                          for (var f = 1, e = a.angles.length; f < e; f++) b.push(a.angles[f - 1] + (a.angles[f] - a.angles[f - 1]) / 2);
                          f = a.angles[a.angles.length - 1];
                          b.push(f + (a.angles[0] + 2 * h.PI - f) / 2)
                      }
                      a.largestAngle > h.PI && (b = [a.angleOfLeastInterference]);
                      if (a.bonds) {
                          f = 0;
                          for (e = a.bonds.length; f < e; f++) {
                              var g = a.bonds[f];
                              if (2 === g.bondOrder && (g = g.getNeighbor(a), "O" === g.label)) {
                                  b = [g.angle(a)];
                                  break
                              }
                          }
                      }
                  }
              }
          else a = a.a1.angle(a.a2), b.push(a + h.PI / 2), b.push(a + 3 * h.PI / 2);
          f = 0;
          for (e = b.length; f < e; f++) {
              for (; b[f] > 2 * h.PI;) b[f] -= 2 * h.PI;
              for (; 0 > b[f];) b[f] += 2 * h.PI
          }
          return b
      },
      g = function(a, b) {
          var e = 3;
          if (a instanceof n.Atom) {
              if (a.isLabelVisible(b) && (e = 8), 0 !== a.charge || 0 !== a.numRadical || 0 !== a.numLonePair) e = 13
          } else a instanceof n.Point ? e = 0 : 1 < a.bondOrder && (e = 5);
          return e
      },
      a = function(a, b, e, j, o, l, A, q, t, u) {
          var v = l.angle(o),
              z = A.angle(q),
              y = h.cos(v),
              v = h.sin(v),
              B = g(e, b);
          o.x -= y * B;
          o.y += v * B;
          B = z + h.PI / 2;
          e = 2 * b.shapes_arrowLength_2D /
              h.sqrt(3);
          var y = h.cos(z),
              v = h.sin(z),
              c = h.cos(B),
              k = h.sin(B);
          q.x -= 5 * y;
          q.y += 5 * v;
          z = new n.Point(q.x, q.y);
          B = g(j, b) / 3;
          z.x -= y * B;
          z.y += v * B;
          q.x -= y * (0.8 * e + B);
          q.y += v * (0.8 * e + B);
          j = z.x - 0.8 * y * e;
          var B = z.y + 0.8 * v * e,
              C = new n.Point(z.x + c * b.shapes_arrowLength_2D / 3 - y * e, z.y - k * b.shapes_arrowLength_2D / 3 + v * e);
          b = new n.Point(z.x - c * b.shapes_arrowLength_2D / 3 - y * e, z.y + k * b.shapes_arrowLength_2D / 3 + v * e);
          v = y = !0;
          1 === t && (C.distance(l) > b.distance(l) ? v = !1 : y = !1);
          a.beginPath();
          a.moveTo(z.x, z.y);
          v && a.lineTo(b.x, b.y);
          a.lineTo(j, B);
          y && a.lineTo(C.x,
              C.y);
          a.closePath();
          a.fill();
          a.stroke();
          a.beginPath();
          a.moveTo(o.x, o.y);
          a.bezierCurveTo(l.x, l.y, A.x, A.y, q.x, q.y);
          a.stroke();
          u.push([o, l, A, q])
      };
  l.Pusher = function(a, b, e) {
      this.o1 = a;
      this.o2 = b;
      this.numElectron = e ? e : 1
  };
  l = l.Pusher.prototype = new l._Shape;
  l.drawDecorations = function(a, b) {
      if (this.isHover)
          for (var e = this.o1 instanceof n.Atom ? new n.Point(this.o1.x, this.o1.y) : this.o1.getCenter(), h = this.o2 instanceof n.Atom ? new n.Point(this.o2.x, this.o2.y) : this.o2.getCenter(), e = [e, h], h = 0, g = e.length; h < g; h++) {
              var j =
                  e[h];
              this.drawAnchor(a, b, j, j === this.hoverPoint)
          }
  };
  l.draw = function(d, g) {
      if (this.o1 && this.o2) {
          d.strokeStyle = g.shapes_color;
          d.fillStyle = g.shapes_color;
          d.lineWidth = g.shapes_lineWidth_2D;
          d.lineJoin = "miter";
          d.lineCap = "butt";
          for (var f = this.o1 instanceof n.Atom ? new n.Point(this.o1.x, this.o1.y) : this.o1.getCenter(), j = this.o2 instanceof n.Atom ? new n.Point(this.o2.x, this.o2.y) : this.o2.getCenter(), o = e(this.o1), l = e(this.o2), A, q, t = Infinity, u = 0, v = o.length; u < v; u++)
              for (var z = 0, y = l.length; z < y; z++) {
                  var B = new n.Point(f.x +
                          35 * h.cos(o[u]), f.y - 35 * h.sin(o[u])),
                      c = new n.Point(j.x + 35 * h.cos(l[z]), j.y - 35 * h.sin(l[z])),
                      k = B.distance(c);
                  k < t && (t = k, A = B, q = c)
              }
          this.caches = []; - 1 === this.numElectron ? (u = f.distance(j) / 2, l = f.angle(j), o = l + h.PI / 2, v = h.cos(l), z = h.sin(l), l = new n.Point(f.x + (u - 1) * v, f.y - (u - 1) * z), t = new n.Point(l.x + 35 * h.cos(o + h.PI / 6), l.y - 35 * h.sin(o + h.PI / 6)), u = new n.Point(f.x + (u + 1) * v, f.y - (u + 1) * z), o = new n.Point(u.x + 35 * h.cos(o - h.PI / 6), u.y - 35 * h.sin(o - h.PI / 6)), a(d, g, this.o1, l, f, A, t, l, 1, this.caches), a(d, g, this.o2, u, j, q, o, u, 1, this.caches)) :
              (b.intersectLines(f.x, f.y, A.x, A.y, j.x, j.y, q.x, q.y) && (o = A, A = q, q = o), o = A.angle(f), l = q.angle(j), t = h.max(o, l) - h.min(o, l), 0.001 > h.abs(t - h.PI) && this.o1.molCenter === this.o2.molCenter && (o += h.PI / 2, l -= h.PI / 2, A.x = f.x + 35 * h.cos(o + h.PI), A.y = f.y - 35 * h.sin(o + h.PI), q.x = j.x + 35 * h.cos(l + h.PI), q.y = j.y - 35 * h.sin(l + h.PI)), a(d, g, this.o1, this.o2, f, A, q, j, this.numElectron, this.caches))
      }
  };
  l.getPoints = function() {
      return []
  };
  l.isOver = function(a, b) {
      for (var e = 0, h = this.caches.length; e < h; e++)
          if (j.distanceFromCurve(a, this.caches[e]).distance <
              b) return !0;
      return !1
  }
})(ChemDoodle.math, ChemDoodle.math.jsBezier, ChemDoodle.structures, ChemDoodle.structures.d2, Math);
(function(b) {
  b._Mesh = function() {};
  b = b._Mesh.prototype;
  b.storeData = function(b, n, l) {
      this.positionData = b;
      this.normalData = n;
      this.indexData = l
  };
  b.setupBuffers = function(b) {
      this.vertexPositionBuffer = b.createBuffer();
      b.bindBuffer(b.ARRAY_BUFFER, this.vertexPositionBuffer);
      b.bufferData(b.ARRAY_BUFFER, new Float32Array(this.positionData), b.STATIC_DRAW);
      this.vertexPositionBuffer.itemSize = 3;
      this.vertexPositionBuffer.numItems = this.positionData.length / 3;
      this.vertexNormalBuffer = b.createBuffer();
      b.bindBuffer(b.ARRAY_BUFFER,
          this.vertexNormalBuffer);
      b.bufferData(b.ARRAY_BUFFER, new Float32Array(this.normalData), b.STATIC_DRAW);
      this.vertexNormalBuffer.itemSize = 3;
      this.vertexNormalBuffer.numItems = this.normalData.length / 3;
      this.indexData && (this.vertexIndexBuffer = b.createBuffer(), b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer), b.bufferData(b.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexData), b.STATIC_DRAW), this.vertexIndexBuffer.itemSize = 1, this.vertexIndexBuffer.numItems = this.indexData.length);
      if (this.partitions)
          for (var n =
                  0, l = this.partitions.length; n < l; n++) {
              var h = this.partitions[n],
                  e = this.generateBuffers(b, h.positionData, h.normalData, h.indexData);
              h.vertexPositionBuffer = e[0];
              h.vertexNormalBuffer = e[1];
              h.vertexIndexBuffer = e[2]
          }
  };
  b.generateBuffers = function(b, n, l, h) {
      var e = b.createBuffer();
      b.bindBuffer(b.ARRAY_BUFFER, e);
      b.bufferData(b.ARRAY_BUFFER, new Float32Array(n), b.STATIC_DRAW);
      e.itemSize = 3;
      e.numItems = n.length / 3;
      n = b.createBuffer();
      b.bindBuffer(b.ARRAY_BUFFER, n);
      b.bufferData(b.ARRAY_BUFFER, new Float32Array(l), b.STATIC_DRAW);
      n.itemSize = 3;
      n.numItems = l.length / 3;
      var g;
      h && (g = b.createBuffer(), b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, g), b.bufferData(b.ELEMENT_ARRAY_BUFFER, new Uint16Array(h), b.STATIC_DRAW), g.itemSize = 1, g.numItems = h.length);
      return [e, n, g]
  };
  b.bindBuffers = function(b) {
      this.vertexPositionBuffer || this.setupBuffers(b);
      b.bindBuffer(b.ARRAY_BUFFER, this.vertexPositionBuffer);
      b.vertexAttribPointer(b.shader.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, b.FLOAT, !1, 0, 0);
      b.bindBuffer(b.ARRAY_BUFFER, this.vertexNormalBuffer);
      b.vertexAttribPointer(b.shader.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, b.FLOAT, !1, 0, 0);
      this.vertexIndexBuffer && b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer)
  }
})(ChemDoodle.structures.d3, Math);
(function(b) {
  b._Measurement = function() {};
  (b._Measurement.prototype = new b._Mesh).render = function(b, n) {
      b.setMatrixUniforms(b.modelViewMatrix);
      n.measurement_update_3D && (this.text = this.vertexPositionBuffer = void 0);
      this.vertexPositionBuffer || this.calculateData(n);
      this.bindBuffers(b);
      b.material.setDiffuseColor(n.shapes_color);
      b.lineWidth(1);
      b.drawElements(b.LINES, this.vertexIndexBuffer.numItems, b.UNSIGNED_SHORT, 0);
      if (n.measurement_displayText_3D) {
          this.text || (this.text = this.getText(n));
          var l = {
              position: [],
              texCoord: [],
              translation: []
          };
          b.textImage.pushVertexData(this.text.value, this.text.pos, 1, l);
          b.textMesh.storeData(b, l.position, l.texCoord, l.translation);
          b.enable(b.BLEND);
          b.depthMask(!1);
          b.enableVertexAttribArray(b.shader.vertexTexCoordAttribute);
          b.textImage.useTexture(b);
          b.textMesh.render(b);
          b.disableVertexAttribArray(b.shader.vertexTexCoordAttribute);
          b.disable(b.BLEND);
          b.depthMask(!0)
      }
  }
})(ChemDoodle.structures.d3);
(function(b, j, n, l, h, e, g) {
  n.Angle = function(a, b, e) {
      this.a1 = a;
      this.a2 = b;
      this.a3 = e
  };
  b = n.Angle.prototype = new n._Measurement;
  b.calculateData = function(a) {
      var b = [],
          e = [],
          f = [],
          l = this.a2.distance3D(this.a1),
          o = this.a2.distance3D(this.a3);
      this.distUse = h.min(l, o) / 2;
      this.vec1 = g.normalize([this.a1.x - this.a2.x, this.a1.y - this.a2.y, this.a1.z - this.a2.z]);
      this.vec2 = g.normalize([this.a3.x - this.a2.x, this.a3.y - this.a2.y, this.a3.z - this.a2.z]);
      this.angle = j.vec3AngleFrom(this.vec1, this.vec2);
      l = g.normalize(g.cross(this.vec1,
          this.vec2, []));
      l = g.normalize(g.cross(l, this.vec1, []));
      a = a.measurement_angleBands_3D;
      for (o = 0; o <= a; ++o) {
          var w = this.angle * o / a,
              n = g.scale(this.vec1, h.cos(w), []),
              w = g.scale(l, h.sin(w), []),
              n = g.scale(g.normalize(g.add(n, w, [])), this.distUse);
          b.push(this.a2.x + n[0], this.a2.y + n[1], this.a2.z + n[2]);
          e.push(0, 0, 0);
          o < a && f.push(o, o + 1)
      }
      this.storeData(b, e, f)
  };
  b.getText = function() {
      var a = g.scale(g.normalize(g.add(this.vec1, this.vec2, [])), this.distUse + 0.3);
      return {
          pos: [this.a2.x + a[0], this.a2.y + a[1], this.a2.z + a[2]],
          value: [l.angleBounds(this.angle,
              !0).toFixed(2), " \u00b0"].join("")
      }
  }
})(ChemDoodle.ELEMENT, ChemDoodle.extensions, ChemDoodle.structures.d3, ChemDoodle.math, Math, ChemDoodle.lib.mat4, ChemDoodle.lib.vec3);
(function(b, j) {
  b.Arrow = function(b, l) {
      for (var h = [], e = [], g = 0; g <= l; g++) {
          var a = 2 * g * j.PI / l,
              d = j.sin(a),
              a = j.cos(a);
          e.push(0, 0, -1, 0, 0, -1, a, d, 0, a, d, 0, 0, 0, -1, 0, 0, -1, a, d, 1, a, d, 1);
          h.push(0, 0, 0, b * a, b * d, 0, b * a, b * d, 0, b * a, b * d, 2, b * a, b * d, 2, 2 * b * a, 2 * b * d, 2, 2 * b * a, 2 * b * d, 2, 0, 0, 3)
      }
      g = [];
      for (d = 0; d < l; d++)
          for (var a = 8 * d, r = 0; 7 > r; r++) {
              var f = r + a,
                  p = f + 7 + 2;
              g.push(f, p, f + 1, p, f, p - 1)
          }
      this.storeData(h, e, g)
  };
  b.Arrow.prototype = new b._Mesh
})(ChemDoodle.structures.d3, Math);
(function(b, j, n) {
  b.LineArrow = function() {
      this.storeData([0, 0, -3, 0.1, 0, -2.8, 0, 0, -3, -0.1, 0, -2.8, 0, 0, -3, 0, 0, 3, 0, 0, 3, 0.1, 0, 2.8, 0, 0, 3, -0.1, 0, 2.8], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  };
  b.LineArrow.prototype = new b._Mesh;
  b.Compass = function(h, e) {
      this.textImage = new b.TextImage;
      this.textImage.init(h);
      this.textImage.updateFont(h, e.text_font_size, e.text_font_families, e.text_font_bold, e.text_font_italic, e.text_font_stroke_3D);
      this.textMesh = new b.TextMesh;
      this.textMesh.init(h);
      var g = 3 / (e.compass_size_3D /
              h.canvas.clientHeight),
          a = j.tan(e.projectionPerspectiveVerticalFieldOfView_3D / 360 * j.PI),
          d = g / a,
          l = j.max(d - g, 0.1),
          f = h.canvas.clientWidth / h.canvas.clientHeight,
          p, o;
      e.projectionPerspective_3D ? (o = l, p = n.frustum) : (o = d, p = n.ortho);
      var w = 2 * (o / h.canvas.clientHeight) * a,
          a = a * o;
      o = -a;
      var A = f * o,
          f = f * a;
      if (0 === e.compass_type_3D) {
          var q = (-(h.canvas.clientWidth - e.compass_size_3D) / 2 + this.textImage.charHeight) * w,
              w = (-(h.canvas.clientHeight - e.compass_size_3D) / 2 + this.textImage.charHeight) * w,
              A = A - q,
              f = f - q;
          o -= w;
          a -= w
      }
      this.projectionMatrix =
          p(A, f, o, a, l, d + g);
      this.translationMatrix = n.translate(n.identity([]), [0, 0, -d]);
      g = {
          position: [],
          texCoord: [],
          translation: []
      };
      this.textImage.pushVertexData("X", [3.5, 0, 0], 0, g);
      this.textImage.pushVertexData("Y", [0, 3.5, 0], 0, g);
      this.textImage.pushVertexData("Z", [0, 0, 3.5], 0, g);
      this.textMesh.storeData(h, g.position, g.texCoord, g.translation)
  };
  var l = b.Compass.prototype;
  l.renderArrow = function(b, e, g, a) {
      b.material.setDiffuseColor(g);
      b.setMatrixUniforms(a);
      1 === e ? b.drawArrays(b.LINES, 0, b.lineArrowBuffer.vertexPositionBuffer.numItems) :
          b.drawElements(b.TRIANGLES, b.arrowBuffer.vertexIndexBuffer.numItems, b.UNSIGNED_SHORT, 0)
  };
  l.render = function(b, e) {
      1 === e.compass_type_3D ? b.lineArrowBuffer.bindBuffers(b) : b.arrowBuffer.bindBuffers(b);
      b.material.setTempColors(e.bonds_materialAmbientColor_3D, void 0, e.bonds_materialSpecularColor_3D, e.bonds_materialShininess_3D);
      var g = n.multiply(this.translationMatrix, b.rotationMatrix, []),
          a = j.PI / 2;
      b.fogging.setMode(0);
      this.renderArrow(b, e.compass_type_3D, e.compass_axisXColor_3D, n.rotateY(g, a, []));
      this.renderArrow(b,
          e.compass_type_3D, e.compass_axisYColor_3D, n.rotateX(g, -a, []));
      this.renderArrow(b, e.compass_type_3D, e.compass_axisZColor_3D, g)
  };
  l.renderAxis = function(b) {
      var e = n.multiply(this.translationMatrix, b.rotationMatrix, []);
      b.setMatrixUniforms(e);
      this.textImage.useTexture(b);
      this.textMesh.render(b)
  }
})(ChemDoodle.structures.d3, Math, ChemDoodle.lib.mat4);
(function(b, j) {
  b.Cylinder = function(b, l, h) {
      for (var e = [], g = [], a = 0; a < h; a++) {
          var d = 2 * a * j.PI / h,
              r = j.cos(d),
              d = j.sin(d);
          g.push(r, 0, d);
          e.push(b * r, 0, b * d);
          g.push(r, 0, d);
          e.push(b * r, l, b * d)
      }
      g.push(1, 0, 0);
      e.push(b, 0, 0);
      g.push(1, 0, 0);
      e.push(b, l, 0);
      this.storeData(e, g)
  };
  b.Cylinder.prototype = new b._Mesh
})(ChemDoodle.structures.d3, Math);
(function(b, j, n, l) {
  j.Distance = function(b, e, g, a) {
      this.a1 = b;
      this.a2 = e;
      this.node = g;
      this.offset = a ? a : 0
  };
  j = j.Distance.prototype = new j._Measurement;
  j.calculateData = function(h) {
      var e = [this.a1.x, this.a1.y, this.a1.z, this.a2.x, this.a2.y, this.a2.z];
      this.node && (this.move = this.offset + n.max(h.atoms_useVDWDiameters_3D ? b[this.a1.label].vdWRadius * h.atoms_vdwMultiplier_3D : h.atoms_sphereDiameter_3D / 2, h.atoms_useVDWDiameters_3D ? b[this.a2.label].vdWRadius * h.atoms_vdwMultiplier_3D : h.atoms_sphereDiameter_3D / 2), this.displacement = [(this.a1.x + this.a2.x) / 2 - this.node.x, (this.a1.y + this.a2.y) / 2 - this.node.y, (this.a1.z + this.a2.z) / 2 - this.node.z], l.normalize(this.displacement), h = l.scale(this.displacement, this.move, []), e[0] += h[0], e[1] += h[1], e[2] += h[2], e[3] += h[0], e[4] += h[1], e[5] += h[2]);
      this.storeData(e, [0, 0, 0, 0, 0, 0], [0, 1])
  };
  j.getText = function() {
      var b = this.a1.distance3D(this.a2),
          e = [(this.a1.x + this.a2.x) / 2, (this.a1.y + this.a2.y) / 2, (this.a1.z + this.a2.z) / 2];
      if (this.node) {
          var g = l.scale(this.displacement, this.move + 0.1, []);
          e[0] += g[0];
          e[1] +=
              g[1];
          e[2] += g[2]
      }
      return {
          pos: e,
          value: [b.toFixed(2), " \u212b"].join("")
      }
  }
})(ChemDoodle.ELEMENT, ChemDoodle.structures.d3, Math, ChemDoodle.lib.vec3);
(function(b, j) {
  j.Fog = function(b) {
      this.gl = b;
      this.mUL = b.getUniformLocation(b.program, "u_fog_mode");
      this.cUL = b.getUniformLocation(b.program, "u_fog_color");
      this.sUL = b.getUniformLocation(b.program, "u_fog_start");
      this.eUL = b.getUniformLocation(b.program, "u_fog_end");
      this.dUL = b.getUniformLocation(b.program, "u_fog_density")
  };
  var n = j.Fog.prototype;
  n.setTempParameter = function(j, h, e, g) {
      if (!this.cCache || this.cCache !== j) this.cCache = j, j = b.getRGB(j, 1), this.gl.uniform3f(this.cUL, j[0], j[1], j[2]);
      if (!this.sCache || this.sCache !==
          h) this.sCache = h, this.gl.uniform1f(this.sUL, h);
      if (!this.eCache || this.eCache !== e) this.eCache = e, this.gl.uniform1f(this.eUL, e);
      if (!this.dCache || this.dCache !== g) this.dCache = g, this.gl.uniform1f(this.dUL, g)
  };
  n.setMode = function(b) {
      if (!this.mCache || this.mCache !== b) this.mCache = b, this.gl.uniform1i(this.mUL, b)
  }
})(ChemDoodle.math, ChemDoodle.structures.d3, ChemDoodle.lib.vec3);
(function(b, j) {
  j.Label = function() {
      this.textImage = new j.TextImage
  };
  var n = j.Label.prototype;
  n.init = function(b, h) {
      this.textImage.init(b);
      this.textImage.updateFont(b, h.atoms_font_size_2D, h.atoms_font_families_2D, h.atoms_font_bold_2D, h.atoms_font_italic_2D, h.text_font_stroke_3D)
  };
  n.updateVerticesBuffer = function(j, h, e) {
      for (var g = 0, a = h.length; g < a; g++) {
          for (var d = h[g], r = d.labelMesh, f = d.atoms, p = this.textImage, o = {
                  position: [],
                  texCoord: [],
                  translation: []
              }, w = 0 < f.length && void 0 != f[0].hetatm, n = 0, q = f.length; n < q; n++) {
              var t =
                  f[n],
                  u = t.label,
                  v = 0.05;
              if (e.atoms_useVDWDiameters_3D) {
                  var z = b[u].vdWRadius * e.atoms_vdwMultiplier_3D;
                  0 === z && (z = 1);
                  v += z
              } else e.atoms_sphereDiameter_3D && (v += 1.5 * (e.atoms_sphereDiameter_3D / 2));
              if (w)
                  if (t.hetatm) {
                      if (t.isWater && !e.macro_showWaters) continue
                  } else if (!e.macro_displayAtoms) continue;
              p.pushVertexData(u, [t.x, t.y, t.z], v, o)
          }
          if ((d = d.chains) && (e.proteins_displayRibbon || e.proteins_displayBackbone)) {
              n = 0;
              for (q = d.length; n < q; n++) {
                  f = d[n];
                  w = 0;
                  for (u = f.length; w < u; w++) v = f[w], v.name && (t = v.cp1, p.pushVertexData(v.name,
                      [t.x, t.y, t.z], 2, o))
              }
          }
          r.storeData(j, o.position, o.texCoord, o.translation, o.zDepth)
      }
  };
  n.render = function(b, h, e) {
      b.setMatrixUniforms(b.modelViewMatrix);
      this.textImage.useTexture(b);
      h = 0;
      for (var g = e.length; h < g; h++) e[h].labelMesh && e[h].labelMesh.render(b)
  }
})(ChemDoodle.ELEMENT, ChemDoodle.structures.d3);
(function(b, j) {
  b.Sphere = function(b, l, h) {
      for (var e = [], g = [], a = 0; a <= l; a++)
          for (var d = a * j.PI / l, r = j.sin(d), f = j.cos(d), d = 0; d <= h; d++) {
              var p = 2 * d * j.PI / h,
                  o = j.sin(p),
                  p = j.cos(p) * r,
                  w = f,
                  o = o * r;
              g.push(p, w, o);
              e.push(b * p, b * w, b * o)
          }
      b = [];
      h += 1;
      for (a = 0; a < l; a++)
          for (d = 0; d < h; d++) r = a * h + d % h, f = r + h, b.push(r, r + 1, f), d < h - 1 && b.push(f, r + 1, f + 1);
      this.storeData(e, g, b)
  };
  b.Sphere.prototype = new b._Mesh
})(ChemDoodle.structures.d3, Math);
(function(b, j, n, l) {
  function h(a, b, e, f) {
      this.entire = a;
      this.name = b;
      this.indexes = e;
      this.pi = f
  }
  var e = function(a, b) {
          a.bindBuffer(a.ARRAY_BUFFER, b.vertexPositionBuffer);
          a.vertexAttribPointer(a.shader.vertexPositionAttribute, b.vertexPositionBuffer.itemSize, a.FLOAT, !1, 0, 0);
          a.bindBuffer(a.ARRAY_BUFFER, b.vertexNormalBuffer);
          a.vertexAttribPointer(a.shader.vertexNormalAttribute, b.vertexNormalBuffer.itemSize, a.FLOAT, !1, 0, 0);
          a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, b.vertexIndexBuffer)
      },
      g = h.prototype;
  g.getColor = function(a) {
      return a.macro_colorByChain ?
          this.chainColor : this.name ? this.getResidueColor(b[this.name] ? this.name : "*", a) : this.helix ? this.entire.front ? a.proteins_ribbonCartoonHelixPrimaryColor : a.proteins_ribbonCartoonHelixSecondaryColor : this.sheet ? a.proteins_ribbonCartoonSheetColor : this.entire.front ? a.proteins_primaryColor : a.proteins_secondaryColor
  };
  g.getResidueColor = function(a, d) {
      var e = b[a];
      if ("shapely" === d.proteins_residueColor) return e.shapelyColor;
      if ("amino" === d.proteins_residueColor) return e.aminoColor;
      if ("polarity" === d.proteins_residueColor) {
          if (e.polar) return "#C10000"
      } else if ("acidity" ===
          d.proteins_residueColor) {
          if (1 === e.acidity) return "#0000FF";
          if (-1 === e.acidity) return "#FF0000";
          if (!e.polar) return "#773300"
      }
      return "#FFFFFF"
  };
  g.render = function(a, b, h) {
      this.entire.partitions && this.pi !== this.entire.partitions.lastRender && (e(a, this.entire.partitions[this.pi]), this.entire.partitions.lastRender = this.pi);
      this.vertexIndexBuffer || (this.vertexIndexBuffer = a.createBuffer(), a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer), a.bufferData(a.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexes),
          a.STATIC_DRAW), this.vertexIndexBuffer.itemSize = 1, this.vertexIndexBuffer.numItems = this.indexes.length);
      a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
      !h && "rainbow" !== b.proteins_residueColor && a.material.setDiffuseColor(this.getColor(b));
      a.drawElements(a.TRIANGLES, this.vertexIndexBuffer.numItems, a.UNSIGNED_SHORT, 0)
  };
  j.Ribbon = function(a, b, e) {
      var f = a[0].lineSegments.length,
          g = a[0].lineSegments[0].length;
      this.partitions = [];
      this.partitions.lastRender = 0;
      var j;
      this.front = 0 < b;
      for (var w = 0, A = a.length -
              1; w < A; w++) {
          if (!j || 65E3 < j.positionData.length) 0 < this.partitions.length && w--, j = {
              count: 0,
              positionData: [],
              normalData: [],
              indexData: []
          }, this.partitions.push(j);
          var q = a[w];
          j.count++;
          for (var t = 0; t < f; t++)
              for (var u = e ? q.lineSegmentsCartoon[t] : q.lineSegments[t], v = 0 === t, z = !1, y = 0; y < g; y++) {
                  var B = u[y],
                      c = w,
                      k = y + 1;
                  w === a.length - 2 && y === g - 1 ? k-- : y === g - 1 && (c++, k = 0);
                  var k = e ? a[c].lineSegmentsCartoon[t][k] : a[c].lineSegments[t][k],
                      c = !1,
                      C = t + 1;
                  t === f - 1 && (C -= 2, c = !0);
                  var C = e ? q.lineSegmentsCartoon[C][y] : q.lineSegments[C][y],
                      k = [k.x -
                          B.x, k.y - B.y, k.z - B.z
                      ],
                      C = [C.x - B.x, C.y - B.y, C.z - B.z],
                      D = l.cross(k, C, []);
                  0 === y && (l.normalize(k), l.scale(k, -1), j.normalData.push(k[0], k[1], k[2]), j.positionData.push(B.x, B.y, B.z));
                  v || z ? (l.normalize(C), l.scale(C, -1), j.normalData.push(C[0], C[1], C[2]), j.positionData.push(B.x, B.y, B.z), v && y === g - 1 && (v = !1, y = -1)) : (l.normalize(D), (c && !this.front || !c && this.front) && l.scale(D, -1), j.normalData.push(D[0], D[1], D[2]), l.scale(D, n.abs(b)), j.positionData.push(B.x + D[0], B.y + D[1], B.z + D[2]), t === f - 1 && y === g - 1 && (z = !0, y = -1));
                  if (-1 ===
                      y || y === g - 1) l.normalize(k), j.normalData.push(k[0], k[1], k[2]), j.positionData.push(B.x, B.y, B.z)
              }
      }
      f += 2;
      g += 2;
      e && (this.cartoonSegments = []);
      this.segments = [];
      b = 0;
      for (q = this.partitions.length; b < q; b++) {
          j = this.partitions[b];
          var H;
          e && (H = []);
          w = 0;
          for (A = j.count - 1; w < A; w++) {
              u = w;
              for (t = 0; t < b; t++) u += this.partitions[t].count - 1;
              t = a[u];
              0 < w && (e && t.split) && (y = new h(this, void 0, H, b), t.helix && (y.helix = !0), t.sheet && (y.sheet = !0), this.cartoonSegments.push(y), H = []);
              v = w * f * g;
              z = [];
              t = 0;
              for (B = f - 1; t < B; t++) {
                  c = v + t * g;
                  for (y = 0; y < g; y++) k =
                      1, w === j.count - 1 ? k = 0 : y === g - 1 && (k = f * g - y), k = [c + y, c + g + y, c + g + y + k, c + y, c + y + k, c + g + y + k], y !== g - 1 && (this.front ? z.push(k[0], k[1], k[2], k[3], k[5], k[4]) : z.push(k[0], k[2], k[1], k[3], k[4], k[5])), y === g - 2 && w < j.count - 1 && (C = f * g - y, k[2] += C, k[4] += C, k[5] += C), this.front ? j.indexData.push(k[0], k[1], k[2], k[3], k[5], k[4]) : j.indexData.push(k[0], k[2], k[1], k[3], k[4], k[5]), e && (this.front ? H.push(k[0], k[1], k[2], k[3], k[5], k[4]) : H.push(k[0], k[2], k[1], k[3], k[4], k[5]))
              }
              this.segments.push(new h(this, a[u + 1].name, z, b))
          }
          if (e) {
              y = new h(this, void 0,
                  H, b);
              u = j.count - 1;
              for (t = 0; t < b; t++) u += this.partitions[t].count - 1;
              t = a[u];
              t.helix && (y.helix = !0);
              t.sheet && (y.sheet = !0);
              this.cartoonSegments.push(y)
          }
      }
      this.storeData(this.partitions[0].positionData, this.partitions[0].normalData, this.partitions[0].indexData);
      1 === this.partitions.length && (this.partitions = void 0)
  };
  (j.Ribbon.prototype = new j._Mesh).render = function(a, b) {
      this.bindBuffers(a);
      var h = b.macro_colorByChain ? this.chainColor : void 0;
      h || (h = this.front ? b.proteins_primaryColor : b.proteins_secondaryColor);
      a.material.setDiffuseColor(h);
      a.drawElements(a.TRIANGLES, this.vertexIndexBuffer.numItems, a.UNSIGNED_SHORT, 0);
      if (this.partitions)
          for (var h = 1, f = this.partitions.length; h < f; h++) {
              var g = this.partitions[h];
              e(a, g);
              a.drawElements(a.TRIANGLES, g.vertexIndexBuffer.numItems, a.UNSIGNED_SHORT, 0)
          }
  }
})(ChemDoodle.RESIDUE, ChemDoodle.structures.d3, Math, ChemDoodle.lib.vec3);
(function(b, j, n) {
  j.Light = function(j, h, e) {
      this.diffuseRGB = b.getRGB(j, 1);
      this.specularRGB = b.getRGB(h, 1);
      this.direction = e
  };
  j.Light.prototype.lightScene = function(b) {
      b.uniform3f(b.getUniformLocation(b.program, "u_light_diffuse_color"), this.diffuseRGB[0], this.diffuseRGB[1], this.diffuseRGB[2]);
      b.uniform3f(b.getUniformLocation(b.program, "u_light_specular_color"), this.specularRGB[0], this.specularRGB[1], this.specularRGB[2]);
      var h = n.create(this.direction);
      n.normalize(h);
      n.negate(h);
      b.uniform3f(b.getUniformLocation(b.program,
          "u_light_direction"), h[0], h[1], h[2]);
      var e = [0, 0, 0],
          h = [e[0] + h[0], e[1] + h[1], e[2] + h[2]],
          e = n.length(h);
      0 === e ? h = [0, 0, 1] : n.scale(1 / e);
      b.uniform3f(b.getUniformLocation(b.program, "u_light_half_vector"), h[0], h[1], h[2])
  }
})(ChemDoodle.math, ChemDoodle.structures.d3, ChemDoodle.lib.vec3);
(function(b) {
  b.Line = function() {
      this.storeData([0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0])
  };
  b.Line.prototype = new b._Mesh
})(ChemDoodle.structures.d3);
(function(b, j) {
  j.Material = function(b) {
      this.gl = b;
      this.aUL = b.getUniformLocation(b.program, "u_material_ambient_color");
      this.dUL = b.getUniformLocation(b.program, "u_material_diffuse_color");
      this.sUL = b.getUniformLocation(b.program, "u_material_specular_color");
      this.snUL = b.getUniformLocation(b.program, "u_material_shininess");
      this.alUL = b.getUniformLocation(b.program, "u_material_alpha")
  };
  var n = j.Material.prototype;
  n.setTempColors = function(j, h, e, g) {
      if (!this.aCache || this.aCache !== j) this.aCache = j, j = b.getRGB(j,
          1), this.gl.uniform3f(this.aUL, j[0], j[1], j[2]);
      if (h && (!this.dCache || this.dCache !== h)) this.dCache = h, j = b.getRGB(h, 1), this.gl.uniform3f(this.dUL, j[0], j[1], j[2]);
      if (!this.sCache || this.sCache !== e) this.sCache = e, j = b.getRGB(e, 1), this.gl.uniform3f(this.sUL, j[0], j[1], j[2]);
      if (!this.snCache || this.snCache !== g) this.snCache = g, this.gl.uniform1f(this.snUL, g);
      this.alCache = 1;
      this.gl.uniform1f(this.alUL, 1)
  };
  n.setDiffuseColor = function(j) {
      if (!this.dCache || this.dCache !== j) this.dCache = j, j = b.getRGB(j, 1), this.gl.uniform3f(this.dUL,
          j[0], j[1], j[2])
  };
  n.setAlpha = function(b) {
      if (!this.alCache || this.alCache !== b) this.alCache = b, this.gl.uniform1f(this.alUL, b)
  }
})(ChemDoodle.math, ChemDoodle.structures.d3);
(function(b, j, n, l) {
  j.MolecularSurface = function(h, e, g, a, d) {
      function j(a, b, c, d) {
          var e = a.index;
          if (a.contained)
              for (var e = -1, f = Infinity, h = 0, g = b.length; h < g; h++)
                  for (var o = b[h], k = 0, l = o.length; k < l; k++) {
                      var p = o[k];
                      if (!p.contained && p.index !== c && p.index !== d) {
                          var r = p.distance3D(a);
                          r < f && (e = p.index, f = r)
                      }
                  }
          return e
      }
      for (var f = [], p = [], o = [], w = [], A = 0; A <= e; A++)
          for (var q = A * l.PI / e, t = l.sin(q), u = l.cos(q), q = 0; q <= g; q++) {
              var v = 2 * q * l.PI / g;
              w.push(l.cos(v) * t, u, l.sin(v) * t)
          }
      t = [];
      A = 0;
      for (q = h.atoms.length; A < q; A++) {
          for (var u = [], z = h.atoms[A],
                  y = n[z.label][d] + a, B = [], v = 0, c = h.atoms.length; v < c; v++)
              if (v !== A) {
                  var k = h.atoms[v];
                  k.index = v;
                  z.distance3D(k) < y + n[k.label][d] + a && B.push(k)
              } v = 0;
          for (c = w.length; v < c; v += 3) {
              for (var C = new b.Atom("C", z.x + y * w[v], z.y + y * w[v + 1], z.z + y * w[v + 2]), D = 0, H = B.length; D < H; D++)
                  if (k = B[D], C.distance3D(k) < n[k.label][d] + a) {
                      C.contained = !0;
                      break
                  } u.push(C)
          }
          t.push(u)
      }
      h = [];
      g++;
      for (A = 0; A < e; A++)
          for (q = 0; q < g; q++) d = A * g + q % g, a = d + g, h.push(d), h.push(a), h.push(d + 1), q < g - 1 && (h.push(a), h.push(a + 1), h.push(d + 1));
      A = D = 0;
      for (q = t.length; A < q; A++) {
          u = t[A];
          v = 0;
          for (c = u.length; v < c; v++) C = u[v], C.contained || (C.index = D, D++, f.push(C.x, C.y, C.z), p.push(w[3 * v], w[3 * v + 1], w[3 * v + 2]));
          v = 0;
          for (c = h.length; v < c; v += 3) d = u[h[v]], a = u[h[v + 1]], C = u[h[v + 2]], !d.contained && (!a.contained && !C.contained) && o.push(d.index, a.index, C.index)
      }
      w = [];
      A = 0;
      for (q = t.length; A < q; A++) {
          u = t[A];
          v = 0;
          for (c = h.length; v < c; v += 3) {
              d = u[h[v]];
              a = u[h[v + 1]];
              C = u[h[v + 2]];
              B = [];
              D = 0;
              for (H = t.length; D < H; D++) D !== A && B.push(t[D]);
              if ((!d.contained || !a.contained || !C.contained) && (d.contained || a.contained || C.contained))
                  if (e =
                      j(d, B, -1, -1), g = j(a, B, e, -1), B = j(C, B, e, g), -1 !== e && -1 !== g && -1 !== B) {
                      a = !1;
                      D = 0;
                      for (H = w.length; D < H; D += 3)
                          if (d = w[D], C = w[D + 1], z = w[D + 2], y = g === d || g === C || g === z, k = B === d || B === C || B === z, (e === d || e === C || e === z) && y && k) {
                              a = !0;
                              break
                          } a || w.push(e, g, B)
                  }
          }
      }
      o = o.concat(w);
      this.storeData(f, p, o)
  };
  j.MolecularSurface.prototype = new j._Mesh
})(ChemDoodle.structures, ChemDoodle.structures.d3, ChemDoodle.ELEMENT, Math);
(function(b) {
  b.Picker = function() {};
  b = b.Picker.prototype;
  b.init = function(b) {
      this.framebuffer = b.createFramebuffer();
      var n = b.createTexture(),
          l = b.createRenderbuffer();
      b.bindTexture(b.TEXTURE_2D, n);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.NEAREST);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
      b.bindRenderbuffer(b.RENDERBUFFER, l);
      b.bindFramebuffer(b.FRAMEBUFFER,
          this.framebuffer);
      b.framebufferTexture2D(b.FRAMEBUFFER, b.COLOR_ATTACHMENT0, b.TEXTURE_2D, n, 0);
      b.framebufferRenderbuffer(b.FRAMEBUFFER, b.DEPTH_ATTACHMENT, b.RENDERBUFFER, l);
      b.bindTexture(b.TEXTURE_2D, null);
      b.bindRenderbuffer(b.RENDERBUFFER, null);
      b.bindFramebuffer(b.FRAMEBUFFER, null)
  };
  b.setDimension = function(b, n, l) {
      b.bindFramebuffer(b.FRAMEBUFFER, this.framebuffer);
      var h = b.getFramebufferAttachmentParameter(b.FRAMEBUFFER, b.DEPTH_ATTACHMENT, b.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);
      b.isRenderbuffer(h) && (b.bindRenderbuffer(b.RENDERBUFFER,
          h), b.renderbufferStorage(b.RENDERBUFFER, b.DEPTH_COMPONENT16, n, l), b.bindRenderbuffer(b.RENDERBUFFER, null));
      h = b.getFramebufferAttachmentParameter(b.FRAMEBUFFER, b.COLOR_ATTACHMENT0, b.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);
      b.isTexture(h) && (b.bindTexture(b.TEXTURE_2D, h), b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, n, l, 0, b.RGBA, b.UNSIGNED_BYTE, null), b.bindTexture(b.TEXTURE_2D, null));
      b.bindFramebuffer(b.FRAMEBUFFER, null)
  };
  b.pick = function(b, n, l, h, e, g, a) {
      var d = void 0,
          r = b.getParameter(b.COLOR_CLEAR_VALUE);
      b.bindFramebuffer(b.FRAMEBUFFER,
          this.framebuffer);
      b.clearColor(1, 1, 1, 0);
      b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT);
      b.fogging.setMode(0);
      b.disableVertexAttribArray(b.shader.vertexNormalAttribute);
      var f = [];
      b.material.setAlpha(255);
      for (var p = 0, o = n.length; p < o; p++) n[p].renderPickFrame(b, l, f, g, a);
      b.flush();
      n = new Uint8Array(4);
      b.readPixels(h - 2, e + 2, 1, 1, b.RGBA, b.UNSIGNED_BYTE, n);
      0 < n[3] && (d = f[n[2] | n[1] << 8 | n[0] << 16]);
      b.enableVertexAttribArray(b.shader.vertexNormalAttribute);
      b.fogging.setMode(l.fog_mode_3D);
      b.bindFramebuffer(b.FRAMEBUFFER,
          null);
      b.clearColor(r[0], r[1], r[2], r[3]);
      return d
  }
})(ChemDoodle.structures.d3, ChemDoodle.math, document);
(function(b, j) {
  b.Pill = function(b, l, h, e) {
      var g = 1,
          a = 2 * b;
      l -= a;
      0 > l ? (g = 0, l += a) : l < a && (g = l / a, l = a);
      for (var a = [], d = [], r = 0; r <= h; r++)
          for (var f = r * j.PI / h, p = j.sin(f), o = j.cos(f) * g, f = 0; f <= e; f++) {
              var w = 2 * f * j.PI / e,
                  A = j.sin(w),
                  w = j.cos(w) * p,
                  q = o,
                  A = A * p;
              d.push(w, q, A);
              a.push(b * w, b * q + (r < h / 2 ? l : 0), b * A)
          }
      b = [];
      e += 1;
      for (r = 0; r < h; r++)
          for (f = 0; f < e; f++) l = r * e + f % e, g = l + e, b.push(l, l + 1, g), f < e - 1 && b.push(g, l + 1, g + 1);
      this.storeData(a, d, b)
  };
  b.Pill.prototype = new b._Mesh
})(ChemDoodle.structures.d3, Math);
(function(b, j) {
  b.Shader = function() {};
  var n = b.Shader.prototype;
  n.init = function(b) {
      var h = this.getShader(b, "vertex-shader");
      h || (h = this.loadDefaultVertexShader(b));
      var e = this.getShader(b, "fragment-shader");
      e || (e = this.loadDefaultFragmentShader(b));
      b.attachShader(b.program, h);
      b.attachShader(b.program, e);
      this.vertexPositionAttribute = 0;
      b.bindAttribLocation(b.program, this.vertexPositionAttribute, "a_vertex_position");
      b.linkProgram(b.program);
      b.getProgramParameter(b.program, b.LINK_STATUS) || alert("Could not initialize shaders: " +
          b.getProgramInfoLog(b.program));
      b.useProgram(b.program);
      b.enableVertexAttribArray(this.vertexPositionAttribute);
      this.vertexTexCoordAttribute = b.getAttribLocation(b.program, "a_vertex_texcoord");
      this.vertexNormalAttribute = b.getAttribLocation(b.program, "a_vertex_normal");
      b.enableVertexAttribArray(this.vertexNormalAttribute);
      this.dimensionUniform = b.getUniformLocation(b.program, "u_dimension")
  };
  n.getShader = function(b, h) {
      var e = j.getElementById(h);
      if (e) {
          for (var g = [], a = e.firstChild; a;) 3 === a.nodeType && g.push(a.textContent),
              a = a.nextSibling;
          if ("x-shader/x-fragment" === e.type) a = b.createShader(b.FRAGMENT_SHADER);
          else if ("x-shader/x-vertex" === e.type) a = b.createShader(b.VERTEX_SHADER);
          else return;
          b.shaderSource(a, g.join(""));
          b.compileShader(a);
          if (b.getShaderParameter(a, b.COMPILE_STATUS)) return a;
          alert(e.type + " " + b.getShaderInfoLog(a))
      }
  };
  n.loadDefaultVertexShader = function(b) {
      var h = b.createShader(b.VERTEX_SHADER);
      b.shaderSource(h, "precision mediump float;attribute vec3 a_vertex_position;attribute vec3 a_vertex_normal;attribute vec2 a_vertex_texcoord;uniform vec3 u_light_diffuse_color;uniform vec3 u_material_ambient_color;uniform vec3 u_material_diffuse_color;uniform mat4 u_model_view_matrix;uniform mat4 u_projection_matrix;uniform mat3 u_normal_matrix;uniform vec2 u_dimension;varying vec2 v_texcoord;varying vec3 v_diffuse;varying vec4 v_ambient;varying vec3 v_normal;void main() {v_texcoord \x3d a_vertex_texcoord;if(length(a_vertex_texcoord) !\x3d 0.) {gl_Position \x3d u_model_view_matrix * vec4(a_vertex_position, 1.);vec4 depth_pos \x3d vec4(gl_Position);depth_pos.z +\x3d a_vertex_normal.z;gl_Position \x3d u_projection_matrix * gl_Position;depth_pos \x3d u_projection_matrix * depth_pos;gl_Position /\x3d gl_Position.w;gl_Position.xy +\x3d a_vertex_normal.xy / u_dimension * 2.;gl_Position.z \x3d depth_pos.z / depth_pos.w;} else {v_normal \x3d length(a_vertex_normal)\x3d\x3d0. ? a_vertex_normal : normalize(u_normal_matrix * a_vertex_normal);v_ambient \x3d vec4(u_material_ambient_color, 1.);v_diffuse \x3d u_material_diffuse_color * u_light_diffuse_color;gl_Position \x3d u_projection_matrix * u_model_view_matrix * vec4(a_vertex_position, 1.);gl_Position /\x3d gl_Position.w;gl_PointSize \x3d 2.;}}");
      b.compileShader(h);
      if (b.getShaderParameter(h, b.COMPILE_STATUS)) return h;
      alert("Vertex shader failed to compile: " + b.getShaderInfoLog(h))
  };
  n.loadDefaultFragmentShader = function(b) {
      var h = b.createShader(b.FRAGMENT_SHADER);
      b.shaderSource(h, "precision mediump float;\nuniform vec3 u_light_specular_color;uniform vec3 u_light_direction;uniform vec3 u_light_half_vector;uniform vec3 u_material_specular_color;uniform float u_material_shininess;uniform float u_material_alpha;uniform int u_fog_mode;uniform vec3 u_fog_color;uniform float u_fog_density;uniform float u_fog_start;uniform float u_fog_end;uniform sampler2D u_image;varying vec2 v_texcoord;varying vec3 v_diffuse;varying vec4 v_ambient;varying vec3 v_normal;void main(void){if(length(v_texcoord)!\x3d0.) {gl_FragColor \x3d texture2D(u_image, v_texcoord);}else if(length(v_normal)\x3d\x3d0.){gl_FragColor \x3d vec4(v_diffuse, u_material_alpha);}else{float nDotL \x3d max(dot(v_normal, u_light_direction), 0.);vec4 color \x3d vec4(v_diffuse*nDotL, 1.);float nDotHV \x3d max(dot(v_normal, u_light_half_vector), 0.);vec3 specular \x3d u_material_specular_color * u_light_specular_color;color+\x3dvec4(specular * pow(nDotHV, u_material_shininess), 1.);gl_FragColor \x3d color+v_ambient;gl_FragColor.a*\x3du_material_alpha;float fogCoord \x3d gl_FragCoord.z/gl_FragCoord.w;float fogFactor \x3d 1.;if(u_fog_mode \x3d\x3d 1){if(fogCoord \x3c u_fog_start){fogFactor \x3d 1.;}else if(fogCoord \x3e u_fog_end){fogFactor \x3d 0.;}else{fogFactor \x3d clamp((u_fog_end - fogCoord) / (u_fog_end - u_fog_start), 0., 1.);}}else if(u_fog_mode \x3d\x3d 2) {fogFactor \x3d clamp(exp(-u_fog_density*fogCoord), 0., 1.);}else if(u_fog_mode \x3d\x3d 3) {fogFactor \x3d clamp(exp(-pow(u_fog_density*fogCoord, 2.)), 0., 1.);}gl_FragColor \x3d mix(vec4(u_fog_color, 1.), gl_FragColor, fogFactor);}}");
      b.compileShader(h);
      if (b.getShaderParameter(h, b.COMPILE_STATUS)) return h;
      alert("Fragment shader failed to compile: " + b.getShaderInfoLog(h))
  }
})(ChemDoodle.structures.d3, document);
(function(b, j, n) {
  j.Shape = function(j, h) {
      for (var e = j.length, g = [], a = [], d = new b.Point, r = 0, f = e; r < f; r++) {
          var p = r + 1;
          r === f - 1 && (p = 0);
          for (var o = j[r], p = j[p], w = n.cross([0, 0, 1], [p.x - o.x, p.y - o.y, 0]), A = 0; 2 > A; A++) g.push(o.x, o.y, h / 2), g.push(o.x, o.y, -h / 2), g.push(p.x, p.y, h / 2), g.push(p.x, p.y, -h / 2);
          for (A = 0; 4 > A; A++) a.push(w[0], w[1], w[2]);
          a.push(0, 0, 1);
          a.push(0, 0, -1);
          a.push(0, 0, 1);
          a.push(0, 0, -1);
          d.add(o)
      }
      d.x /= e;
      d.y /= e;
      a.push(0, 0, 1);
      g.push(d.x, d.y, h / 2);
      a.push(0, 0, -1);
      g.push(d.x, d.y, -h / 2);
      d = [];
      o = 8 * e;
      r = 0;
      for (f = e; r < f; r++) e =
          8 * r, d.push(e), d.push(e + 3), d.push(e + 1), d.push(e), d.push(e + 2), d.push(e + 3), d.push(e + 4), d.push(o), d.push(e + 6), d.push(e + 5), d.push(e + 7), d.push(o + 1);
      this.storeData(g, a, d)
  };
  j.Shape.prototype = new j._Mesh
})(ChemDoodle.structures, ChemDoodle.structures.d3, ChemDoodle.lib.vec3);
(function(b, j, n) {
  b.Star = function() {
      for (var b = [0.8944, 0.4472, 0, 0.2764, 0.4472, 0.8506, 0.2764, 0.4472, -0.8506, -0.7236, 0.4472, 0.5257, -0.7236, 0.4472, -0.5257, -0.3416, 0.4472, 0, -0.1056, 0.4472, 0.3249, -0.1056, 0.4472, -0.3249, 0.2764, 0.4472, 0.2008, 0.2764, 0.4472, -0.2008, -0.8944, -0.4472, 0, -0.2764, -0.4472, 0.8506, -0.2764, -0.4472, -0.8506, 0.7236, -0.4472, 0.5257, 0.7236, -0.4472, -0.5257, 0.3416, -0.4472, 0, 0.1056, -0.4472, 0.3249, 0.1056, -0.4472, -0.3249, -0.2764, -0.4472, 0.2008, -0.2764, -0.4472, -0.2008, -0.5527, 0.1058, 0, -0.1708, 0.1058,
              0.5527, -0.1708, 0.1058, -0.5527, 0.4471, 0.1058, 0.3249, 0.4471, 0.1058, -0.3249, 0.5527, -0.1058, 0, 0.1708, -0.1058, 0.5527, 0.1708, -0.1058, -0.5527, -0.4471, -0.1058, 0.3249, -0.4471, -0.1058, -0.3249, 0, 1, 0, 0, -1, 0
          ], h = [0, 9, 8, 2, 7, 9, 4, 5, 7, 3, 6, 5, 1, 8, 6, 0, 8, 23, 30, 6, 8, 3, 21, 6, 11, 26, 21, 13, 23, 26, 2, 9, 24, 30, 8, 9, 1, 23, 8, 13, 25, 23, 14, 24, 25, 4, 7, 22, 30, 9, 7, 0, 24, 9, 14, 27, 24, 12, 22, 27, 3, 5, 20, 30, 7, 5, 2, 22, 7, 12, 29, 22, 10, 20, 29, 1, 6, 21, 30, 5, 6, 4, 20, 5, 10, 28, 20, 11, 21, 28, 10, 19, 18, 12, 17, 19, 14, 15, 17, 13, 16, 15, 11, 18, 16, 31, 19, 17, 14, 17, 27, 2, 27, 22, 4, 22, 29,
              10, 29, 19, 31, 18, 19, 12, 19, 29, 4, 29, 20, 3, 20, 28, 11, 28, 18, 31, 16, 18, 10, 18, 28, 3, 28, 21, 1, 21, 26, 13, 26, 16, 31, 15, 16, 11, 16, 26, 1, 26, 23, 0, 23, 25, 14, 25, 15, 31, 17, 15, 13, 15, 25, 0, 25, 24, 2, 24, 27, 12, 27, 17
          ], e = [], g = [], a = [], d = 0, j = h.length; d < j; d += 3) {
          var f = 3 * h[d],
              p = 3 * h[d + 1],
              o = 3 * h[d + 2],
              f = [b[f], b[f + 1], b[f + 2]],
              p = [b[p], b[p + 1], b[p + 2]],
              o = [b[o], b[o + 1], b[o + 2]],
              w = n.cross([o[0] - p[0], o[1] - p[1], o[2] - p[2]], [f[0] - p[0], f[1] - p[1], f[2] - p[2]], []);
          n.normalize(w);
          e.push(f[0], f[1], f[2], p[0], p[1], p[2], o[0], o[1], o[2]);
          g.push(w[0], w[1], w[2], w[0], w[1],
              w[2], w[0], w[1], w[2]);
          a.push(d, d + 1, d + 2)
      }
      this.storeData(e, g, a)
  };
  b.Star.prototype = new b._Mesh
})(ChemDoodle.structures.d3, Math, ChemDoodle.lib.vec3);
(function(b, j, n) {
  b.TextImage = function() {
      this.ctx = n.createElement("canvas").getContext("2d");
      this.data = [];
      this.text = "";
      this.charHeight = 0
  };
  b = b.TextImage.prototype;
  b.init = function(b) {
      this.textureImage = b.createTexture();
      b.bindTexture(b.TEXTURE_2D, this.textureImage);
      b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !1);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST);
      b.texParameteri(b.TEXTURE_2D,
          b.TEXTURE_MAG_FILTER, b.NEAREST);
      b.bindTexture(b.TEXTURE_2D, null);
      this.updateFont(b, 12, ["Sans-serif"], !1, !1, !1)
  };
  b.charData = function(b) {
      b = this.text.indexOf(b);
      return 0 <= b ? this.data[b] : null
  };
  b.updateFont = function(b, h, e, g, a, d) {
      var r = this.ctx,
          f = this.ctx.canvas,
          p = [],
          o = "";
      a = j.getFontString(h, e, g, a);
      r.font = a;
      r.save();
      var w = 0;
      h *= 1.5;
      e = 32;
      for (g = 127; e < g; e++) {
          var n = String.fromCharCode(e),
              q = r.measureText(n).width;
          p.push({
              text: n,
              width: q,
              height: h
          });
          w += 2 * q
      }
      var t = ["\u00b0", "\u212b", "\u00ae"];
      e = 0;
      for (g = t.length; e <
          g; e++) n = t[e], q = r.measureText(n).width, p.push({
          text: n,
          width: q,
          height: h
      }), w += 2 * q;
      e = Math.sqrt(w * h);
      e = Math.ceil(e / h);
      w = Math.ceil(w / (e - 1));
      f.width = w;
      f.height = e * h;
      r.font = a;
      r.textAlign = "left";
      r.textBaseline = "middle";
      r.strokeStyle = "#000";
      r.lineWidth = 1.4;
      r.fillStyle = "#fff";
      e = n = a = 0;
      for (g = p.length; e < g; e++) {
          q = p[e];
          t = 2 * q.width;
          h = q.height;
          var u = q.text;
          n + t > w && (a++, n = 0);
          var v = a * h;
          d && r.strokeText(u, n, v + h / 2);
          r.fillText(u, n, v + h / 2);
          q.x = n;
          q.y = v;
          o += u;
          n += t
      }
      this.text = o;
      this.data = p;
      this.charHeight = h;
      b.bindTexture(b.TEXTURE_2D,
          this.textureImage);
      b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, b.RGBA, b.UNSIGNED_BYTE, f);
      b.bindTexture(b.TEXTURE_2D, null)
  };
  b.pushVertexData = function(b, h, e, g) {
      var a = b.toString().split(""),
          d = this.getHeight(),
          j = this.getWidth();
      b = -this.textWidth(b) / 2;
      for (var f = -this.charHeight / 2, p = 0, o = a.length; p < o; p++) {
          var w = this.charData(a[p]),
              n = w.width,
              q = w.x / j,
              t = q + 1.8 * w.width / j,
              u = w.y / d,
              w = u + w.height / d,
              v = b + 1.8 * n,
              z = this.charHeight / 2;
          g.position.push(h[0], h[1], h[2], h[0], h[1], h[2], h[0], h[1], h[2], h[0], h[1], h[2], h[0], h[1], h[2], h[0],
              h[1], h[2]);
          g.texCoord.push(q, u, t, w, t, u, q, u, q, w, t, w);
          g.translation.push(b, z, e, v, f, e, v, z, e, b, z, e, b, f, e, v, f, e);
          b = v + n - 1.8 * n
      }
  };
  b.getCanvas = function() {
      return this.ctx.canvas
  };
  b.getHeight = function() {
      return this.getCanvas().height
  };
  b.getWidth = function() {
      return this.getCanvas().width
  };
  b.textWidth = function(b) {
      return this.ctx.measureText(b).width
  };
  b.test = function() {
      n.body.appendChild(this.getCanvas())
  };
  b.useTexture = function(b) {
      b.bindTexture(b.TEXTURE_2D, this.textureImage)
  }
})(ChemDoodle.structures.d3, ChemDoodle.extensions,
  document);
(function(b) {
  b.TextMesh = function() {};
  b = b.TextMesh.prototype;
  b.init = function(b) {
      this.vertexPositionBuffer = b.createBuffer();
      this.vertexTexCoordBuffer = b.createBuffer();
      this.vertexTranslationBuffer = b.createBuffer()
  };
  b.setVertexData = function(b, n, l, h) {
      b.bindBuffer(b.ARRAY_BUFFER, n);
      b.bufferData(b.ARRAY_BUFFER, new Float32Array(l), b.STATIC_DRAW);
      n.itemSize = h;
      n.numItems = l.length / h
  };
  b.storeData = function(b, n, l, h) {
      this.setVertexData(b, this.vertexPositionBuffer, n, 3);
      this.setVertexData(b, this.vertexTexCoordBuffer, l,
          2);
      this.setVertexData(b, this.vertexTranslationBuffer, h, 3)
  };
  b.bindBuffers = function(b) {
      b.bindBuffer(b.ARRAY_BUFFER, this.vertexPositionBuffer);
      b.vertexAttribPointer(b.shader.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, b.FLOAT, !1, 0, 0);
      b.bindBuffer(b.ARRAY_BUFFER, this.vertexTexCoordBuffer);
      b.vertexAttribPointer(b.shader.vertexTexCoordAttribute, this.vertexTexCoordBuffer.itemSize, b.FLOAT, !1, 0, 0);
      b.bindBuffer(b.ARRAY_BUFFER, this.vertexTranslationBuffer);
      b.vertexAttribPointer(b.shader.vertexNormalAttribute,
          this.vertexTranslationBuffer.itemSize, b.FLOAT, !1, 0, 0)
  };
  b.render = function(b) {
      var n = this.vertexPositionBuffer.numItems;
      n && (this.bindBuffers(b), b.drawArrays(b.TRIANGLES, 0, n))
  }
})(ChemDoodle.structures.d3, Math);
(function(b, j, n, l, h, e, g) {
  l.Torsion = function(a, b, e, f) {
      this.a1 = a;
      this.a2 = b;
      this.a3 = e;
      this.a4 = f
  };
  b = l.Torsion.prototype = new l._Measurement;
  b.calculateData = function(a) {
      var b = [],
          e = [],
          f = [],
          j = this.a2.distance3D(this.a1),
          o = this.a2.distance3D(this.a3);
      this.distUse = h.min(j, o) / 2;
      var o = [this.a2.x - this.a1.x, this.a2.y - this.a1.y, this.a2.z - this.a1.z],
          j = [this.a3.x - this.a2.x, this.a3.y - this.a2.y, this.a3.z - this.a2.z],
          l = [this.a4.x - this.a3.x, this.a4.y - this.a3.y, this.a4.z - this.a3.z],
          n = g.cross(o, j, []),
          l = g.cross(j, l, []);
      g.scale(o,
          g.length(j));
      this.torsion = h.atan2(g.dot(o, l), g.dot(n, l));
      o = g.normalize(g.cross(n, j, []));
      n = g.normalize(g.cross(j, o, []));
      this.pos = g.add([this.a2.x, this.a2.y, this.a2.z], g.scale(g.normalize(j, []), this.distUse));
      var l = [],
          q = a.measurement_angleBands_3D;
      for (a = 0; a <= q; ++a) {
          var t = this.torsion * a / q,
              u = g.scale(o, h.cos(t), []),
              t = g.scale(n, h.sin(t), []),
              u = g.scale(g.normalize(g.add(u, t, [])), this.distUse);
          0 == a && (l = u);
          b.push(this.pos[0] + u[0], this.pos[1] + u[1], this.pos[2] + u[2]);
          e.push(0, 0, 0);
          a < q && f.push(a, a + 1)
      }
      this.vecText =
          g.normalize(g.add(l, u, []));
      j = g.normalize(j, []);
      g.scale(j, 0.0625);
      t = this.torsion - 2 * h.asin(0.125) * this.torsion / h.abs(this.torsion);
      u = g.scale(o, h.cos(t), []);
      t = g.scale(n, h.sin(t), []);
      u = g.scale(g.normalize(g.add(u, t, [])), this.distUse);
      b.push(this.pos[0] + j[0] + u[0], this.pos[1] + j[1] + u[1], this.pos[2] + j[2] + u[2]);
      e.push(0, 0, 0);
      b.push(this.pos[0] - j[0] + u[0], this.pos[1] - j[1] + u[1], this.pos[2] - j[2] + u[2]);
      e.push(0, 0, 0);
      f.push(--a, a + 1, a, a + 2);
      this.storeData(b, e, f)
  };
  b.getText = function() {
      g.add(this.pos, g.scale(this.vecText,
          this.distUse + 0.3, []));
      return {
          pos: this.pos,
          value: [j.angleBounds(this.torsion, !0, !0).toFixed(2), " \u00b0"].join("")
      }
  }
})(ChemDoodle.ELEMENT, ChemDoodle.math, ChemDoodle.extensions, ChemDoodle.structures.d3, Math, ChemDoodle.lib.mat4, ChemDoodle.lib.vec3);
(function(b, j, n, l, h, e, g, a) {
  var d = function(a, b, d) {
      var g = h.sqrt(b[1] * b[1] + b[2] * b[2]),
          j = [1, 0, 0, 0, 0, b[2] / g, -b[1] / g, 0, 0, b[1] / g, b[2] / g, 0, 0, 0, 0, 1],
          l = [1, 0, 0, 0, 0, b[2] / g, b[1] / g, 0, 0, -b[1] / g, b[2] / g, 0, 0, 0, 0, 1],
          n = [g, 0, -b[0], 0, 0, 1, 0, 0, b[0], 0, g, 0, 0, 0, 0, 1];
      b = [g, 0, b[0], 0, 0, 1, 0, 0, -b[0], 0, g, 0, 0, 0, 0, 1];
      d = [h.cos(d), -h.sin(d), 0, 0, h.sin(d), h.cos(d), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      var t = e.multiply(j, e.multiply(n, e.multiply(d, e.multiply(b, l, []))));
      this.rotate = function() {
          return e.multiplyVec3(t, a)
      }
  };
  l.Tube = function(l, f, p) {
      var o = l[0].lineSegments[0].length;
      this.partitions = [];
      var w;
      this.ends = [];
      this.ends.push(l[0].lineSegments[0][0]);
      this.ends.push(l[l.length - 2].lineSegments[0][0]);
      for (var A = [1, 0, 0], q = 0, t = l.length - 1; q < t; q++) {
          if (!w || 65E3 < w.positionData.length) 0 < this.partitions.length && q--, w = {
              count: 0,
              positionData: [],
              normalData: [],
              indexData: []
          }, this.partitions.push(w);
          var u = l[q];
          w.count++;
          for (var v = Infinity, z = new n.Atom("", l[q + 1].cp1.x, l[q + 1].cp1.y, l[q + 1].cp1.z), y = 0; y < o; y++) {
              var B = u.lineSegments[0][y],
                  c;
              c = y === o - 1 ? q === l.length - 2 ? u.lineSegments[0][y - 1] : l[q +
                  1].lineSegments[0][0] : u.lineSegments[0][y + 1];
              c = [c.x - B.x, c.y - B.y, c.z - B.z];
              g.normalize(c);
              q === l.length - 2 && y === o - 1 && g.scale(c, -1);
              var k = g.cross(c, A, []);
              g.normalize(k);
              g.scale(k, f / 2);
              k = new d(k, c, 2 * Math.PI / p);
              c = 0;
              for (var C = p; c < C; c++) {
                  var D = k.rotate();
                  c === h.floor(p / 4) && (A = [D[0], D[1], D[2]]);
                  w.normalData.push(D[0], D[1], D[2]);
                  w.positionData.push(B.x + D[0], B.y + D[1], B.z + D[2])
              }
              z && (c = B.distance3D(z), c < v && (v = c, l[q + 1].pPoint = B))
          }
      }
      A = 0;
      for (u = this.partitions.length; A < u; A++) {
          w = this.partitions[A];
          q = 0;
          for (t = w.count - 1; q <
              t; q++) {
              v = q * o * p;
              y = 0;
              for (z = o; y < z; y++) {
                  B = v + y * p;
                  for (c = 0; c < p; c++) k = B + c, w.indexData.push(k), w.indexData.push(k + p), w.indexData.push(k + p + 1), w.indexData.push(k), w.indexData.push(k + p + 1), w.indexData.push(k + 1)
              }
          }
      }
      this.storeData(this.partitions[0].positionData, this.partitions[0].normalData, this.partitions[0].indexData);
      p = [new n.Point(2, 0)];
      for (q = 0; 60 > q; q++) o = q / 60 * h.PI, p.push(new n.Point(2 * h.cos(o), -2 * h.sin(o)));
      p.push(new n.Point(-2, 0), new n.Point(-2, 4), new n.Point(2, 4));
      var H = new n.d3.Shape(p, 1);
      this.render = function(c,
          d) {
          this.bindBuffers(c);
          c.material.setDiffuseColor(d.macro_colorByChain ? this.chainColor : d.nucleics_tubeColor);
          c.drawElements(c.TRIANGLES, this.vertexIndexBuffer.numItems, c.UNSIGNED_SHORT, 0);
          if (this.partitions)
              for (var o = 1, k = this.partitions.length; o < k; o++) {
                  var p = this.partitions[o],
                      w = c,
                      q = p;
                  w.bindBuffer(w.ARRAY_BUFFER, q.vertexPositionBuffer);
                  w.vertexAttribPointer(w.shader.vertexPositionAttribute, q.vertexPositionBuffer.itemSize, w.FLOAT, !1, 0, 0);
                  w.bindBuffer(w.ARRAY_BUFFER, q.vertexNormalBuffer);
                  w.vertexAttribPointer(w.shader.vertexNormalAttribute,
                      q.vertexNormalBuffer.itemSize, w.FLOAT, !1, 0, 0);
                  w.bindBuffer(w.ELEMENT_ARRAY_BUFFER, q.vertexIndexBuffer);
                  c.drawElements(c.TRIANGLES, p.vertexIndexBuffer.numItems, c.UNSIGNED_SHORT, 0)
              }
          c.sphereBuffer.bindBuffers(c);
          for (o = 0; 2 > o; o++) p = this.ends[o], p = e.translate(c.modelViewMatrix, [p.x, p.y, p.z], []), k = f / 2, e.scale(p, [k, k, k]), c.setMatrixUniforms(p), c.drawElements(c.TRIANGLES, c.sphereBuffer.vertexIndexBuffer.numItems, c.UNSIGNED_SHORT, 0);
          c.cylinderBuffer.bindBuffers(c);
          o = 1;
          for (k = l.length - 1; o < k; o++) {
              var q = l[o],
                  t =
                  q.pPoint,
                  u = new n.Atom("", q.cp2.x, q.cp2.y, q.cp2.z),
                  p = 1.001 * t.distance3D(u),
                  q = [f / 4, p, f / 4],
                  p = e.translate(c.modelViewMatrix, [t.x, t.y, t.z], []),
                  v = [0, 1, 0],
                  A = 0,
                  w = [u.x - t.x, u.y - t.y, u.z - t.z];
              t.x === u.x && t.z === u.z ? (v = [0, 0, 1], t.y < t.y && (A = h.PI)) : (A = b.vec3AngleFrom(v, w), v = g.cross(v, w, []));
              0 !== A && e.rotate(p, A, v);
              e.scale(p, q);
              c.setMatrixUniforms(p);
              c.drawArrays(c.TRIANGLE_STRIP, 0, c.cylinderBuffer.vertexPositionBuffer.numItems)
          }
          H.bindBuffers(c);
          "none" === d.nucleics_residueColor && !d.macro_colorByChain && c.material.setDiffuseColor(d.nucleics_baseColor);
          o = 1;
          for (k = l.length - 1; o < k; o++) q = l[o], u = q.cp2, p = e.translate(c.modelViewMatrix, [u.x, u.y, u.z], []), v = [0, 1, 0], A = 0, t = q.cp3, w = [t.x - u.x, t.y - u.y, t.z - u.z], u.x === t.x && u.z === t.z ? (v = [0, 0, 1], u.y < u.y && (A = h.PI)) : (A = b.vec3AngleFrom(v, w), v = g.cross(v, w, [])), 0 !== A && e.rotate(p, A, v), u = [1, 0, 0], A = e.rotate(e.identity([]), A, v), e.multiplyVec3(A, u), A = q.cp4, t = q.cp5, A.y === t.y && A.z === t.z || (A = [t.x - A.x, t.y - A.y, t.z - A.z], t = b.vec3AngleFrom(u, A), 0 > g.dot(w, g.cross(u, A)) && (t *= -1), e.rotateY(p, t)), d.macro_colorByChain || ("shapely" === d.nucleics_residueColor ?
              j[q.name] ? c.material.setDiffuseColor(j[q.name].shapelyColor) : c.material.setDiffuseColor(j["*"].shapelyColor) : "rainbow" === d.nucleics_residueColor && c.material.setDiffuseColor(a.rainbowAt(o, k, d.macro_rainbowColors))), c.setMatrixUniforms(p), c.drawElements(c.TRIANGLES, H.vertexIndexBuffer.numItems, c.UNSIGNED_SHORT, 0)
      }
  };
  l.Tube.prototype = new l._Mesh
})(ChemDoodle.extensions, ChemDoodle.RESIDUE, ChemDoodle.structures, ChemDoodle.structures.d3, Math, ChemDoodle.lib.mat4, ChemDoodle.lib.vec3, ChemDoodle.math);
(function(b) {
  b.UnitCell = function(b) {
      var n = [],
          l = [],
          h = function(b, a, d, e) {
              n.push(b[0], b[1], b[2]);
              n.push(a[0], a[1], a[2]);
              n.push(d[0], d[1], d[2]);
              n.push(e[0], e[1], e[2]);
              for (b = 0; 4 > b; b++) l.push(0, 0, 0)
          };
      h(b.o, b.x, b.xy, b.y);
      h(b.o, b.y, b.yz, b.z);
      h(b.o, b.z, b.xz, b.x);
      h(b.yz, b.y, b.xy, b.xyz);
      h(b.xyz, b.xz, b.z, b.yz);
      h(b.xy, b.x, b.xz, b.xyz);
      b = [];
      for (h = 0; 6 > h; h++) {
          var e = 4 * h;
          b.push(e, e + 1, e + 1, e + 2, e + 2, e + 3, e + 3, e)
      }
      this.storeData(n, l, b)
  };
  b.UnitCell.prototype = new b._Mesh
})(ChemDoodle.structures.d3, ChemDoodle.lib.vec3);
(function(b, j, n) {
  b.Plate = function(b) {
      this.lanes = Array(b);
      i = 0;
      for (ii = b; i < ii; i++) this.lanes[i] = []
  };
  var l = b.Plate.prototype;
  l.sort = function() {
      i = 0;
      for (ii = this.lanes.length; i < ii; i++) this.lanes[i].sort(function(b, e) {
          return b - e
      })
  };
  l.draw = function(b) {
      var e = b.canvas.width,
          g = b.canvas.height;
      this.origin = 9 * g / 10;
      this.front = g / 10;
      this.laneLength = this.origin - this.front;
      b.strokeStyle = "#000000";
      b.beginPath();
      b.moveTo(0, this.front);
      j.contextHashTo(b, 0, this.front, e, this.front, 3, 3);
      b.closePath();
      b.stroke();
      b.beginPath();
      b.moveTo(0, this.origin);
      b.lineTo(e, this.origin);
      b.closePath();
      b.stroke();
      i = 0;
      for (ii = this.lanes.length; i < ii; i++) {
          g = (i + 1) * e / (ii + 1);
          b.beginPath();
          b.moveTo(g, this.origin);
          b.lineTo(g, this.origin + 3);
          b.closePath();
          b.stroke();
          s = 0;
          for (ss = this.lanes[i].length; s < ss; s++) {
              var a = this.origin - this.laneLength * this.lanes[i][s].rf;
              switch (this.lanes[i][s].type) {
                  case "compact":
                      b.beginPath();
                      b.arc(g, a, 3, 0, 2 * n.PI, !1);
                      b.closePath();
                      break;
                  case "expanded":
                      b.beginPath();
                      b.arc(g, a, 7, 0, 2 * n.PI, !1);
                      b.closePath();
                      break;
                  case "widened":
                      j.contextOval(b,
                          g - 18, a - 10, 36, 10);
                      break;
                  case "cresent":
                      b.beginPath(), b.arc(g, a, 9, 0, n.PI, !0), b.closePath()
              }
              switch (this.lanes[i][s].style) {
                  case "solid":
                      b.fillStyle = "#000000";
                      b.fill();
                      break;
                  case "transparent":
                      b.stroke()
              }
          }
      }
  };
  b.Plate.Spot = function(b, e, g) {
      this.type = b;
      this.rf = e;
      this.style = g ? g : "solid"
  }
})(ChemDoodle.structures, ChemDoodle.extensions, Math);
(function(b, j, n) {
  b.default_backgroundColor = "#FFFFFF";
  b.default_scale = 1;
  b.default_rotateAngle = 0;
  b.default_bondLength_2D = 20;
  b.default_angstromsPerBondLength = 1.25;
  b.default_lightDirection_3D = [-0.1, -0.1, -1];
  b.default_lightDiffuseColor_3D = "#FFFFFF";
  b.default_lightSpecularColor_3D = "#FFFFFF";
  b.default_projectionPerspective_3D = !0;
  b.default_projectionPerspectiveVerticalFieldOfView_3D = 45;
  b.default_projectionOrthoWidth_3D = 40;
  b.default_projectionWidthHeightRatio_3D = void 0;
  b.default_projectionFrontCulling_3D =
      0.1;
  b.default_projectionBackCulling_3D = 1E4;
  b.default_cullBackFace_3D = !0;
  b.default_fog_mode_3D = 0;
  b.default_fog_color_3D = "#000000";
  b.default_fog_start_3D = 0;
  b.default_fog_end_3D = 1;
  b.default_fog_density_3D = 1;
  b.default_atoms_display = !0;
  b.default_atoms_color = "#000000";
  b.default_atoms_font_size_2D = 12;
  b.default_atoms_font_families_2D = ["Helvetica", "Arial", "Dialog"];
  b.default_atoms_font_bold_2D = !1;
  b.default_atoms_font_italic_2D = !1;
  b.default_atoms_circles_2D = !1;
  b.default_atoms_circleDiameter_2D = 10;
  b.default_atoms_circleBorderWidth_2D =
      1;
  b.default_atoms_lonePairDistance_2D = 8;
  b.default_atoms_lonePairSpread_2D = 4;
  b.default_atoms_lonePairDiameter_2D = 1;
  b.default_atoms_useJMOLColors = !1;
  b.default_atoms_usePYMOLColors = !1;
  b.default_atoms_resolution_3D = 60;
  b.default_atoms_sphereDiameter_3D = 0.8;
  b.default_atoms_useVDWDiameters_3D = !1;
  b.default_atoms_vdwMultiplier_3D = 1;
  b.default_atoms_materialAmbientColor_3D = "#000000";
  b.default_atoms_materialSpecularColor_3D = "#555555";
  b.default_atoms_materialShininess_3D = 32;
  b.default_atoms_implicitHydrogens_2D = !0;
  b.default_atoms_displayTerminalCarbonLabels_2D = !1;
  b.default_atoms_showHiddenCarbons_2D = !0;
  b.default_atoms_showAttributedCarbons_2D = !0;
  b.default_atoms_displayAllCarbonLabels_2D = !1;
  b.default_atoms_nonBondedAsStars_3D = !1;
  b.default_atoms_displayLabels_3D = !1;
  b.default_atoms_HBlack_2D = !0;
  b.default_bonds_display = !0;
  b.default_bonds_color = "#000000";
  b.default_bonds_width_2D = 1;
  b.default_bonds_saturationWidth_2D = 0.2;
  b.default_bonds_ends_2D = "round";
  b.default_bonds_useJMOLColors = !1;
  b.default_bonds_usePYMOLColors = !1;
  b.default_bonds_colorGradient = !1;
  b.default_bonds_saturationAngle_2D = n.PI / 3;
  b.default_bonds_symmetrical_2D = !1;
  b.default_bonds_clearOverlaps_2D = !1;
  b.default_bonds_overlapClearWidth_2D = 0.5;
  b.default_bonds_atomLabelBuffer_2D = 1;
  b.default_bonds_wedgeThickness_2D = 0.22;
  b.default_bonds_hashWidth_2D = 1;
  b.default_bonds_hashSpacing_2D = 2.5;
  b.default_bonds_dotSize_2D = 2;
  b.default_bonds_lewisStyle_2D = !1;
  b.default_bonds_showBondOrders_3D = !1;
  b.default_bonds_resolution_3D = 60;
  b.default_bonds_renderAsLines_3D = !1;
  b.default_bonds_cylinderDiameter_3D =
      0.3;
  b.default_bonds_pillLatitudeResolution_3D = 10;
  b.default_bonds_pillLongitudeResolution_3D = 20;
  b.default_bonds_pillHeight_3D = 0.3;
  b.default_bonds_pillSpacing_3D = 0.1;
  b.default_bonds_pillDiameter_3D = 0.3;
  b.default_bonds_materialAmbientColor_3D = "#222222";
  b.default_bonds_materialSpecularColor_3D = "#555555";
  b.default_bonds_materialShininess_3D = 32;
  b.default_proteins_displayRibbon = !0;
  b.default_proteins_displayBackbone = !1;
  b.default_proteins_backboneThickness = 1.5;
  b.default_proteins_backboneColor = "#CCCCCC";
  b.default_proteins_ribbonCartoonize = !1;
  b.default_proteins_residueColor = "none";
  b.default_proteins_primaryColor = "#FF0D0D";
  b.default_proteins_secondaryColor = "#FFFF30";
  b.default_proteins_ribbonCartoonHelixPrimaryColor = "#00E740";
  b.default_proteins_ribbonCartoonHelixSecondaryColor = "#9905FF";
  b.default_proteins_ribbonCartoonSheetColor = "#E8BB99";
  b.default_proteins_ribbonThickness = 0.2;
  b.default_proteins_verticalResolution = 10;
  b.default_proteins_horizontalResolution = 9;
  b.default_proteins_materialAmbientColor_3D = "#222222";
  b.default_proteins_materialSpecularColor_3D =
      "#555555";
  b.default_proteins_materialShininess_3D = 32;
  b.default_nucleics_display = !0;
  b.default_nucleics_tubeColor = "#CCCCCC";
  b.default_nucleics_baseColor = "#C10000";
  b.default_nucleics_residueColor = "none";
  b.default_nucleics_tubeThickness = 1.5;
  b.default_nucleics_tubeResolution_3D = 60;
  b.default_nucleics_verticalResolution = 10;
  b.default_nucleics_materialAmbientColor_3D = "#222222";
  b.default_nucleics_materialSpecularColor_3D = "#555555";
  b.default_nucleics_materialShininess_3D = 32;
  b.default_macro_displayAtoms = !1;
  b.default_macro_displayBonds = !1;
  b.default_macro_atomToLigandDistance = -1;
  b.default_macro_showWater = !1;
  b.default_macro_colorByChain = !1;
  b.default_macro_rainbowColors = ["#0000FF", "#00FFFF", "#00FF00", "#FFFF00", "#FF0000"];
  b.default_surfaces_display = !0;
  b.default_surfaces_style = "Dot";
  b.default_surfaces_color = "#E9B862";
  b.default_surfaces_materialAmbientColor_3D = "#000000";
  b.default_surfaces_materialSpecularColor_3D = "#000000";
  b.default_surfaces_materialShininess_3D = 32;
  b.default_crystals_displayUnitCell = !0;
  b.default_crystals_unitCellColor =
      "green";
  b.default_crystals_unitCellLineWidth = 1;
  b.default_plots_color = "#000000";
  b.default_plots_width = 1;
  b.default_plots_showIntegration = !1;
  b.default_plots_integrationColor = "#c10000";
  b.default_plots_integrationLineWidth = 1;
  b.default_plots_showGrid = !1;
  b.default_plots_gridColor = "grey";
  b.default_plots_gridLineWidth = 0.5;
  b.default_plots_showYAxis = !0;
  b.default_plots_flipXAxis = !1;
  b.default_text_font_size = 12;
  b.default_text_font_families = ["Helvetica", "Arial", "Dialog"];
  b.default_text_font_bold = !0;
  b.default_text_font_italic = !1;
  b.default_text_font_stroke_3D = !0;
  b.default_text_color = "#000000";
  b.default_shapes_color = "#000000";
  b.default_shapes_lineWidth_2D = 1;
  b.default_shapes_arrowLength_2D = 8;
  b.default_compass_display = !1;
  b.default_compass_axisXColor_3D = "#FF0000";
  b.default_compass_axisYColor_3D = "#00FF00";
  b.default_compass_axisZColor_3D = "#0000FF";
  b.default_compass_size_3D = 50;
  b.default_compass_resolution_3D = 10;
  b.default_compass_displayText_3D = !0;
  b.default_compass_type_3D = 0;
  b.default_measurement_update_3D = !1;
  b.default_measurement_angleBands_3D =
      10;
  b.default_measurement_displayText_3D = !0;
  j.VisualSpecifications = function() {
      this.backgroundColor = b.default_backgroundColor;
      this.scale = b.default_scale;
      this.rotateAngle = b.default_rotateAngle;
      this.bondLength = b.default_bondLength_2D;
      this.angstromsPerBondLength = b.default_angstromsPerBondLength;
      this.lightDirection_3D = b.default_lightDirection_3D.slice(0);
      this.lightDiffuseColor_3D = b.default_lightDiffuseColor_3D;
      this.lightSpecularColor_3D = b.default_lightSpecularColor_3D;
      this.projectionPerspective_3D = b.default_projectionPerspective_3D;
      this.projectionPerspectiveVerticalFieldOfView_3D = b.default_projectionPerspectiveVerticalFieldOfView_3D;
      this.projectionOrthoWidth_3D = b.default_projectionOrthoWidth_3D;
      this.projectionWidthHeightRatio_3D = b.default_projectionWidthHeightRatio_3D;
      this.projectionFrontCulling_3D = b.default_projectionFrontCulling_3D;
      this.projectionBackCulling_3D = b.default_projectionBackCulling_3D;
      this.cullBackFace_3D = b.default_cullBackFace_3D;
      this.fog_mode_3D = b.default_fog_mode_3D;
      this.fog_color_3D = b.default_fog_color_3D;
      this.fog_start_3D =
          b.default_fog_start_3D;
      this.fog_end_3D = b.default_fog_end_3D;
      this.fog_density_3D = b.default_fog_density_3D;
      this.atoms_display = b.default_atoms_display;
      this.atoms_color = b.default_atoms_color;
      this.atoms_font_size_2D = b.default_atoms_font_size_2D;
      this.atoms_font_families_2D = b.default_atoms_font_families_2D.slice(0);
      this.atoms_font_bold_2D = b.default_atoms_font_bold_2D;
      this.atoms_font_italic_2D = b.default_atoms_font_italic_2D;
      this.atoms_circles_2D = b.default_atoms_circles_2D;
      this.atoms_circleDiameter_2D = b.default_atoms_circleDiameter_2D;
      this.atoms_circleBorderWidth_2D = b.default_atoms_circleBorderWidth_2D;
      this.atoms_lonePairDistance_2D = b.default_atoms_lonePairDistance_2D;
      this.atoms_lonePairSpread_2D = b.default_atoms_lonePairSpread_2D;
      this.atoms_lonePairDiameter_2D = b.default_atoms_lonePairDiameter_2D;
      this.atoms_useJMOLColors = b.default_atoms_useJMOLColors;
      this.atoms_usePYMOLColors = b.default_atoms_usePYMOLColors;
      this.atoms_resolution_3D = b.default_atoms_resolution_3D;
      this.atoms_sphereDiameter_3D = b.default_atoms_sphereDiameter_3D;
      this.atoms_useVDWDiameters_3D =
          b.default_atoms_useVDWDiameters_3D;
      this.atoms_vdwMultiplier_3D = b.default_atoms_vdwMultiplier_3D;
      this.atoms_materialAmbientColor_3D = b.default_atoms_materialAmbientColor_3D;
      this.atoms_materialSpecularColor_3D = b.default_atoms_materialSpecularColor_3D;
      this.atoms_materialShininess_3D = b.default_atoms_materialShininess_3D;
      this.atoms_implicitHydrogens_2D = b.default_atoms_implicitHydrogens_2D;
      this.atoms_displayTerminalCarbonLabels_2D = b.default_atoms_displayTerminalCarbonLabels_2D;
      this.atoms_showHiddenCarbons_2D =
          b.default_atoms_showHiddenCarbons_2D;
      this.atoms_showAttributedCarbons_2D = b.default_atoms_showAttributedCarbons_2D;
      this.atoms_displayAllCarbonLabels_2D = b.default_atoms_displayAllCarbonLabels_2D;
      this.atoms_nonBondedAsStars_3D = b.default_atoms_nonBondedAsStars_3D;
      this.atoms_displayLabels_3D = b.default_atoms_displayLabels_3D;
      this.atoms_HBlack_2D = b.default_atoms_HBlack_2D;
      this.bonds_display = b.default_bonds_display;
      this.bonds_color = b.default_bonds_color;
      this.bonds_width_2D = b.default_bonds_width_2D;
      this.bonds_saturationWidth_2D =
          b.default_bonds_saturationWidth_2D;
      this.bonds_ends_2D = b.default_bonds_ends_2D;
      this.bonds_useJMOLColors = b.default_bonds_useJMOLColors;
      this.bonds_usePYMOLColors = b.default_bonds_usePYMOLColors;
      this.bonds_colorGradient = b.default_bonds_colorGradient;
      this.bonds_saturationAngle_2D = b.default_bonds_saturationAngle_2D;
      this.bonds_symmetrical_2D = b.default_bonds_symmetrical_2D;
      this.bonds_clearOverlaps_2D = b.default_bonds_clearOverlaps_2D;
      this.bonds_overlapClearWidth_2D = b.default_bonds_overlapClearWidth_2D;
      this.bonds_atomLabelBuffer_2D =
          b.default_bonds_atomLabelBuffer_2D;
      this.bonds_wedgeThickness_2D = b.default_bonds_wedgeThickness_2D;
      this.bonds_hashWidth_2D = b.default_bonds_hashWidth_2D;
      this.bonds_hashSpacing_2D = b.default_bonds_hashSpacing_2D;
      this.bonds_dotSize_2D = b.default_bonds_dotSize_2D;
      this.bonds_lewisStyle_2D = b.default_bonds_lewisStyle_2D;
      this.bonds_showBondOrders_3D = b.default_bonds_showBondOrders_3D;
      this.bonds_resolution_3D = b.default_bonds_resolution_3D;
      this.bonds_renderAsLines_3D = b.default_bonds_renderAsLines_3D;
      this.bonds_cylinderDiameter_3D =
          b.default_bonds_cylinderDiameter_3D;
      this.bonds_pillHeight_3D = b.default_bonds_pillHeight_3D;
      this.bonds_pillLatitudeResolution_3D = b.default_bonds_pillLatitudeResolution_3D;
      this.bonds_pillLongitudeResolution_3D = b.default_bonds_pillLongitudeResolution_3D;
      this.bonds_pillSpacing_3D = b.default_bonds_pillSpacing_3D;
      this.bonds_pillDiameter_3D = b.default_bonds_pillDiameter_3D;
      this.bonds_materialAmbientColor_3D = b.default_bonds_materialAmbientColor_3D;
      this.bonds_materialSpecularColor_3D = b.default_bonds_materialSpecularColor_3D;
      this.bonds_materialShininess_3D = b.default_bonds_materialShininess_3D;
      this.proteins_displayRibbon = b.default_proteins_displayRibbon;
      this.proteins_displayBackbone = b.default_proteins_displayBackbone;
      this.proteins_backboneThickness = b.default_proteins_backboneThickness;
      this.proteins_backboneColor = b.default_proteins_backboneColor;
      this.proteins_ribbonCartoonize = b.default_proteins_ribbonCartoonize;
      this.proteins_residueColor = b.default_proteins_residueColor;
      this.proteins_primaryColor = b.default_proteins_primaryColor;
      this.proteins_secondaryColor = b.default_proteins_secondaryColor;
      this.proteins_ribbonCartoonHelixPrimaryColor = b.default_proteins_ribbonCartoonHelixPrimaryColor;
      this.proteins_ribbonCartoonHelixSecondaryColor = b.default_proteins_ribbonCartoonHelixSecondaryColor;
      this.proteins_ribbonCartoonSheetColor = b.default_proteins_ribbonCartoonSheetColor;
      this.proteins_ribbonThickness = b.default_proteins_ribbonThickness;
      this.proteins_verticalResolution = b.default_proteins_verticalResolution;
      this.proteins_horizontalResolution =
          b.default_proteins_horizontalResolution;
      this.proteins_materialAmbientColor_3D = b.default_proteins_materialAmbientColor_3D;
      this.proteins_materialSpecularColor_3D = b.default_proteins_materialSpecularColor_3D;
      this.proteins_materialShininess_3D = b.default_proteins_materialShininess_3D;
      this.macro_displayAtoms = b.default_macro_displayAtoms;
      this.macro_displayBonds = b.default_macro_displayBonds;
      this.macro_atomToLigandDistance = b.default_macro_atomToLigandDistance;
      this.nucleics_display = b.default_nucleics_display;
      this.nucleics_tubeColor = b.default_nucleics_tubeColor;
      this.nucleics_baseColor = b.default_nucleics_baseColor;
      this.nucleics_residueColor = b.default_nucleics_residueColor;
      this.nucleics_tubeThickness = b.default_nucleics_tubeThickness;
      this.nucleics_tubeResolution_3D = b.default_nucleics_tubeResolution_3D;
      this.nucleics_verticalResolution = b.default_nucleics_verticalResolution;
      this.nucleics_materialAmbientColor_3D = b.default_nucleics_materialAmbientColor_3D;
      this.nucleics_materialSpecularColor_3D = b.default_nucleics_materialSpecularColor_3D;
      this.nucleics_materialShininess_3D = b.default_nucleics_materialShininess_3D;
      this.macro_showWater = b.default_macro_showWater;
      this.macro_colorByChain = b.default_macro_colorByChain;
      this.macro_rainbowColors = b.default_macro_rainbowColors.slice(0);
      this.surfaces_display = b.default_surfaces_display;
      this.surfaces_style = b.default_surfaces_style;
      this.surfaces_color = b.default_surfaces_color;
      this.surfaces_materialAmbientColor_3D = b.default_surfaces_materialAmbientColor_3D;
      this.surfaces_materialSpecularColor_3D = b.default_surfaces_materialSpecularColor_3D;
      this.surfaces_materialShininess_3D = b.default_surfaces_materialShininess_3D;
      this.crystals_displayUnitCell = b.default_crystals_displayUnitCell;
      this.crystals_unitCellColor = b.default_crystals_unitCellColor;
      this.crystals_unitCellLineWidth = b.default_crystals_unitCellLineWidth;
      this.plots_color = b.default_plots_color;
      this.plots_width = b.default_plots_width;
      this.plots_showIntegration = b.default_plots_showIntegration;
      this.plots_integrationColor = b.default_plots_integrationColor;
      this.plots_integrationLineWidth = b.default_plots_integrationLineWidth;
      this.plots_showGrid = b.default_plots_showGrid;
      this.plots_gridColor = b.default_plots_gridColor;
      this.plots_gridLineWidth = b.default_plots_gridLineWidth;
      this.plots_showYAxis = b.default_plots_showYAxis;
      this.plots_flipXAxis = b.default_plots_flipXAxis;
      this.text_font_size = b.default_text_font_size;
      this.text_font_families = b.default_text_font_families.slice(0);
      this.text_font_bold = b.default_text_font_bold;
      this.text_font_italic = b.default_text_font_italic;
      this.text_font_stroke_3D = b.default_text_font_stroke_3D;
      this.text_color =
          b.default_text_color;
      this.shapes_color = b.default_shapes_color;
      this.shapes_lineWidth_2D = b.default_shapes_lineWidth_2D;
      this.shapes_arrowLength_2D = b.default_shapes_arrowLength_2D;
      this.compass_display = b.default_compass_display;
      this.compass_axisXColor_3D = b.default_compass_axisXColor_3D;
      this.compass_axisYColor_3D = b.default_compass_axisYColor_3D;
      this.compass_axisZColor_3D = b.default_compass_axisZColor_3D;
      this.compass_size_3D = b.default_compass_size_3D;
      this.compass_resolution_3D = b.default_compass_resolution_3D;
      this.compass_displayText_3D = b.default_compass_displayText_3D;
      this.compass_type_3D = b.default_compass_type_3D;
      this.measurement_update_3D = b.default_measurement_update_3D;
      this.measurement_angleBands_3D = b.default_measurement_angleBands_3D;
      this.measurement_displayText_3D = b.default_measurement_displayText_3D
  };
  j.VisualSpecifications.prototype.set3DRepresentation = function(j) {
      this.bonds_display = this.atoms_display = !0;
      this.bonds_color = "#777777";
      this.bonds_showBondOrders_3D = this.bonds_useJMOLColors = this.atoms_useJMOLColors =
          this.atoms_useVDWDiameters_3D = !0;
      this.bonds_renderAsLines_3D = !1;
      "Ball and Stick" === j ? (this.atoms_vdwMultiplier_3D = 0.3, this.bonds_useJMOLColors = !1, this.bonds_cylinderDiameter_3D = 0.3, this.bonds_materialAmbientColor_3D = b.default_atoms_materialAmbientColor_3D, this.bonds_pillDiameter_3D = 0.15) : "van der Waals Spheres" === j ? (this.bonds_display = !1, this.atoms_vdwMultiplier_3D = 1) : "Stick" === j ? (this.bonds_showBondOrders_3D = this.atoms_useVDWDiameters_3D = !1, this.bonds_cylinderDiameter_3D = this.atoms_sphereDiameter_3D =
          0.8, this.bonds_materialAmbientColor_3D = this.atoms_materialAmbientColor_3D) : "Wireframe" === j ? (this.atoms_useVDWDiameters_3D = !1, this.bonds_cylinderDiameter_3D = this.bonds_pillDiameter_3D = 0.05, this.atoms_sphereDiameter_3D = 0.15, this.bonds_materialAmbientColor_3D = b.default_atoms_materialAmbientColor_3D) : "Line" === j ? (this.atoms_display = !1, this.bonds_renderAsLines_3D = !0, this.bonds_width_2D = 1, this.bonds_cylinderDiameter_3D = 0.05) : alert('"' + j + '" is not recognized. Use one of the following strings:\n\n1. Ball and Stick\n2. van der Waals Spheres\n3. Stick\n4. Wireframe\n5. Line\n')
  }
})(ChemDoodle,
  ChemDoodle.structures, Math);
(function(b, j, n, l) {
  n.getPointsPerAngstrom = function() {
      return b.default_bondLength_2D / b.default_angstromsPerBondLength
  };
  n.BondDeducer = function() {};
  var h = n.BondDeducer.prototype;
  h.margin = 1.1;
  h.deduceCovalentBonds = function(b, h) {
      var a = n.getPointsPerAngstrom();
      h && (a = h);
      for (var d = 0, r = b.atoms.length; d < r; d++)
          for (var f = d + 1; f < r; f++) {
              var p = b.atoms[d],
                  o = b.atoms[f];
              p.distance3D(o) < (j[p.label].covalentRadius + j[o.label].covalentRadius) * a * this.margin && b.bonds.push(new l.Bond(p, o, 1))
          }
  }
})(ChemDoodle, ChemDoodle.ELEMENT,
  ChemDoodle.informatics, ChemDoodle.structures);
(function(b) {
  b.HydrogenDeducer = function() {};
  b.HydrogenDeducer.prototype.removeHydrogens = function(b) {
      for (var n = [], l = [], h = 0, e = b.bonds.length; h < e; h++) "H" !== b.bonds[h].a1.label && "H" !== b.bonds[h].a2.label && l.push(b.bonds[h]);
      h = 0;
      for (e = b.atoms.length; h < e; h++) "H" !== b.atoms[h].label && n.push(b.atoms[h]);
      b.atoms = n;
      b.bonds = l
  }
})(ChemDoodle.informatics);
(function(b, j, n) {
  j.MolecularSurfaceGenerator = function() {};
  j.MolecularSurfaceGenerator.prototype.generateSurface = function(b, h, e, g, a) {
      return new n.MolecularSurface(b, h, e, g, a)
  }
})(ChemDoodle, ChemDoodle.informatics, ChemDoodle.structures.d3);
(function(b, j) {
  b.Splitter = function() {};
  b.Splitter.prototype.split = function(b) {
      for (var l = [], h = 0, e = b.atoms.length; h < e; h++) b.atoms[h].visited = !1;
      h = 0;
      for (e = b.bonds.length; h < e; h++) b.bonds[h].visited = !1;
      h = 0;
      for (e = b.atoms.length; h < e; h++) {
          var g = b.atoms[h];
          if (!g.visited) {
              var a = new j.Molecule;
              a.atoms.push(g);
              g.visited = !0;
              var d = new j.Queue;
              for (d.enqueue(g); !d.isEmpty();)
                  for (var g = d.dequeue(), r = 0, f = b.bonds.length; r < f; r++) {
                      var p = b.bonds[r];
                      p.contains(g) && !p.visited && (p.visited = !0, a.bonds.push(p), p = p.getNeighbor(g),
                          p.visited || (p.visited = !0, a.atoms.push(p), d.enqueue(p)))
                  }
              l.push(a)
          }
      }
      return l
  }
})(ChemDoodle.informatics, ChemDoodle.structures);
(function(b, j) {
  b.StructureBuilder = function() {};
  b.StructureBuilder.prototype.copy = function(b) {
      var l = new j.JSONInterpreter;
      return l.molFrom(l.molTo(b))
  }
})(ChemDoodle.informatics, ChemDoodle.io, ChemDoodle.structures);
(function(b) {
  b._Counter = function() {};
  b = b._Counter.prototype;
  b.value = 0;
  b.molecule = void 0;
  b.setMolecule = function(b) {
      this.value = 0;
      this.molecule = b;
      this.innerCalculate && this.innerCalculate()
  }
})(ChemDoodle.informatics);
(function(b) {
  b.FrerejacqueNumberCounter = function(b) {
      this.setMolecule(b)
  };
  (b.FrerejacqueNumberCounter.prototype = new b._Counter).innerCalculate = function() {
      this.value = this.molecule.bonds.length - this.molecule.atoms.length + (new b.NumberOfMoleculesCounter(this.molecule)).value
  }
})(ChemDoodle.informatics);
(function(b, j) {
  j.NumberOfMoleculesCounter = function(b) {
      this.setMolecule(b)
  };
  (j.NumberOfMoleculesCounter.prototype = new j._Counter).innerCalculate = function() {
      for (var j = 0, l = this.molecule.atoms.length; j < l; j++) this.molecule.atoms[j].visited = !1;
      j = 0;
      for (l = this.molecule.atoms.length; j < l; j++)
          if (!this.molecule.atoms[j].visited) {
              this.value++;
              var h = new b.Queue;
              this.molecule.atoms[j].visited = !0;
              for (h.enqueue(this.molecule.atoms[j]); !h.isEmpty();)
                  for (var e = h.dequeue(), g = 0, a = this.molecule.bonds.length; g < a; g++) {
                      var d =
                          this.molecule.bonds[g];
                      d.contains(e) && (d = d.getNeighbor(e), d.visited || (d.visited = !0, h.enqueue(d)))
                  }
          }
  }
})(ChemDoodle.structures, ChemDoodle.informatics);
(function(b) {
  b._RingFinder = function() {};
  b = b._RingFinder.prototype;
  b.atoms = void 0;
  b.bonds = void 0;
  b.rings = void 0;
  b.reduce = function(b) {
      for (var n = 0, l = b.atoms.length; n < l; n++) b.atoms[n].visited = !1;
      n = 0;
      for (l = b.bonds.length; n < l; n++) b.bonds[n].visited = !1;
      for (var h = !0; h;) {
          h = !1;
          n = 0;
          for (l = b.atoms.length; n < l; n++) {
              for (var e = 0, g, a = 0, d = b.bonds.length; a < d; a++)
                  if (b.bonds[a].contains(b.atoms[n]) && !b.bonds[a].visited) {
                      e++;
                      if (2 === e) break;
                      g = b.bonds[a]
                  } 1 === e && (h = !0, g.visited = !0, b.atoms[n].visited = !0)
          }
      }
      n = 0;
      for (l = b.atoms.length; n <
          l; n++) b.atoms[n].visited || this.atoms.push(b.atoms[n]);
      n = 0;
      for (l = b.bonds.length; n < l; n++) b.bonds[n].visited || this.bonds.push(b.bonds[n]);
      0 === this.bonds.length && 0 !== this.atoms.length && (this.atoms = [])
  };
  b.setMolecule = function(b) {
      this.atoms = [];
      this.bonds = [];
      this.rings = [];
      this.reduce(b);
      2 < this.atoms.length && this.innerGetRings && this.innerGetRings()
  };
  b.fuse = function() {
      for (var b = 0, n = this.rings.length; b < n; b++)
          for (var l = 0, h = this.bonds.length; l < h; l++) - 1 !== this.rings[b].atoms.indexOf(this.bonds[l].a1) && -1 !== this.rings[b].atoms.indexOf(this.bonds[l].a2) &&
              this.rings[b].bonds.push(this.bonds[l])
  }
})(ChemDoodle.informatics);
(function(b, j) {
  function n(b, e) {
      this.atoms = [];
      if (e)
          for (var g = 0, a = e.atoms.length; g < a; g++) this.atoms[g] = e.atoms[g];
      this.atoms.push(b)
  }
  var l = n.prototype;
  l.grow = function(b, e) {
      for (var g = this.atoms[this.atoms.length - 1], a = [], d = 0, j = b.length; d < j; d++)
          if (b[d].contains(g)) {
              var f = b[d].getNeighbor(g); - 1 === e.indexOf(f) && a.push(f)
          } g = [];
      d = 0;
      for (j = a.length; d < j; d++) g.push(new n(a[d], this));
      return g
  };
  l.check = function(b, e, g) {
      for (var a = 0, d = e.atoms.length - 1; a < d; a++)
          if (-1 !== this.atoms.indexOf(e.atoms[a])) return;
      var l;
      if (e.atoms[e.atoms.length -
              1] === this.atoms[this.atoms.length - 1]) {
          l = new j.Ring;
          l.atoms[0] = g;
          a = 0;
          for (d = this.atoms.length; a < d; a++) l.atoms.push(this.atoms[a]);
          for (a = e.atoms.length - 2; 0 <= a; a--) l.atoms.push(e.atoms[a])
      } else {
          for (var f = [], a = 0, d = b.length; a < d; a++) b[a].contains(e.atoms[e.atoms.length - 1]) && f.push(b[a]);
          a = 0;
          for (d = f.length; a < d; a++)
              if ((1 === e.atoms.length || !f[a].contains(e.atoms[e.atoms.length - 2])) && f[a].contains(this.atoms[this.atoms.length - 1])) {
                  l = new j.Ring;
                  l.atoms[0] = g;
                  b = 0;
                  for (g = this.atoms.length; b < g; b++) l.atoms.push(this.atoms[b]);
                  for (b = e.atoms.length - 1; 0 <= b; b--) l.atoms.push(e.atoms[b]);
                  break
              }
      }
      return l
  };
  b.EulerFacetRingFinder = function(b) {
      this.setMolecule(b)
  };
  l = b.EulerFacetRingFinder.prototype = new b._RingFinder;
  l.fingerBreak = 5;
  l.innerGetRings = function() {
      for (var b = 0, e = this.atoms.length; b < e; b++) {
          for (var g = [], a = 0, d = this.bonds.length; a < d; a++) this.bonds[a].contains(this.atoms[b]) && g.push(this.bonds[a].getNeighbor(this.atoms[b]));
          a = 0;
          for (d = g.length; a < d; a++)
              for (var j = a + 1; j < g.length; j++) {
                  var f = [];
                  f[0] = new n(g[a]);
                  f[1] = new n(g[j]);
                  var l = [];
                  l[0] = this.atoms[b];
                  for (var o = 0, w = g.length; o < w; o++) o !== a && o !== j && l.push(g[o]);
                  var A = [];
                  for ((o = f[0].check(this.bonds, f[1], this.atoms[b])) && (A[0] = o); 0 === A.length && 0 < f.length && f[0].atoms.length < this.fingerBreak;) {
                      for (var q = [], o = 0, w = f.length; o < w; o++)
                          for (var t = f[o].grow(this.bonds, l), u = 0, v = t.length; u < v; u++) q.push(t[u]);
                      f = q;
                      o = 0;
                      for (w = f.length; o < w; o++)
                          for (u = o + 1; u < w; u++)(v = f[o].check(this.bonds, f[u], this.atoms[b])) && A.push(v);
                      if (0 === A.length) {
                          q = [];
                          o = 0;
                          for (w = l.length; o < w; o++) {
                              u = 0;
                              for (v = this.bonds.length; u <
                                  v; u++) this.bonds[u].contains(l[o]) && (g = this.bonds[u].getNeighbor(l[o]), -1 === l.indexOf(g) && -1 === q.indexOf(g) && q.push(g))
                          }
                          o = 0;
                          for (w = q.length; o < w; o++) l.push(q[o])
                      }
                  }
                  if (0 < A.length) {
                      f = void 0;
                      o = 0;
                      for (w = A.length; o < w; o++)
                          if (!f || f.atoms.length > A[o].atoms.length) f = A[o];
                      A = !1;
                      o = 0;
                      for (w = this.rings.length; o < w; o++) {
                          l = !0;
                          u = 0;
                          for (v = f.atoms.length; u < v; u++)
                              if (-1 === this.rings[o].atoms.indexOf(f.atoms[u])) {
                                  l = !1;
                                  break
                              } if (l) {
                              A = !0;
                              break
                          }
                      }
                      A || this.rings.push(f)
                  }
              }
      }
      this.fuse()
  }
})(ChemDoodle.informatics, ChemDoodle.structures);
(function(b) {
  b.SSSRFinder = function(j) {
      this.rings = [];
      if (0 < j.atoms.length) {
          var n = (new b.FrerejacqueNumberCounter(j)).value,
              l = (new b.EulerFacetRingFinder(j)).rings;
          l.sort(function(a, b) {
              return a.atoms.length - b.atoms.length
          });
          for (var h = 0, e = j.bonds.length; h < e; h++) j.bonds[h].visited = !1;
          h = 0;
          for (e = l.length; h < e; h++) {
              j = !1;
              for (var g = 0, a = l[h].bonds.length; g < a; g++)
                  if (!l[h].bonds[g].visited) {
                      j = !0;
                      break
                  } if (j) {
                  g = 0;
                  for (a = l[h].bonds.length; g < a; g++) l[h].bonds[g].visited = !0;
                  this.rings.push(l[h])
              }
              if (this.rings.length ===
                  n) break
          }
      }
  }
})(ChemDoodle.informatics);
(function(b) {
  b._Interpreter = function() {};
  b._Interpreter.prototype.fit = function(b, n, l) {
      for (var h = b.length, e = [], g = 0; g < n - h; g++) e.push(" ");
      return l ? b + e.join("") : e.join("") + b
  }
})(ChemDoodle.io);
(function(b, j, n, l, h, e) {
  var g = /\s+/g,
      a = /\(|\)|\s+/g,
      d = /\'|\s+/g,
      r = /,|\'|\s+/g,
      f = /^\s+/,
      p = /[0-9]/g,
      o = /[0-9]|\+|\-/g,
      w = function(a) {
          return 0 !== a.length
      },
      A = {
          P: [],
          A: [
              [0, 0.5, 0.5]
          ],
          B: [
              [0.5, 0, 0.5]
          ],
          C: [
              [0.5, 0.5, 0]
          ],
          I: [
              [0.5, 0.5, 0.5]
          ],
          R: [
              [2 / 3, 1 / 3, 1 / 3],
              [1 / 3, 2 / 3, 2 / 3]
          ],
          S: [
              [1 / 3, 1 / 3, 2 / 3],
              [2 / 3, 2 / 3, 1 / 3]
          ],
          T: [
              [1 / 3, 2 / 3, 1 / 3],
              [2 / 3, 1 / 3, 2 / 3]
          ],
          F: [
              [0, 0.5, 0.5],
              [0.5, 0, 0.5],
              [0.5, 0.5, 0]
          ]
      },
      q = function(a) {
          var b = 0,
              d = 0,
              e = 0,
              f = 0,
              c = a.indexOf("x"),
              g = a.indexOf("y"),
              h = a.indexOf("z"); - 1 !== c && (d++, 0 < c && "+" !== a.charAt(c - 1) && (d *= -1)); - 1 !== g &&
              (e++, 0 < g && "+" !== a.charAt(g - 1) && (e *= -1)); - 1 !== h && (f++, 0 < h && "+" !== a.charAt(h - 1) && (f *= -1));
          if (2 < a.length) {
              c = "+";
              g = 0;
              for (h = a.length; g < h; g++) {
                  var j = a.charAt(g);
                  if (("-" === j || "/" === j) && (g === a.length - 1 || a.charAt(g + 1).match(p))) c = j;
                  j.match(p) && ("+" === c ? b += parseInt(j) : "-" === c ? b -= parseInt(j) : "/" === c && (b /= parseInt(j)))
              }
          }
          return [b, d, e, f]
      };
  n.CIFInterpreter = function() {};
  (n.CIFInterpreter.prototype = new n._Interpreter).read = function(p, n, t, y) {
      n = n ? n : 1;
      t = t ? t : 1;
      y = y ? y : 1;
      var B = new l.Molecule;
      if (!p) return B;
      for (var c = p.split("\n"),
              k = 0, C = 0, D = 0, H = p = 0, F = 0, G = "P", K, I, W, E, N = !0; 0 < c.length;)
          if (N ? E = c.shift() : N = !0, 0 < E.length)
              if (j.stringStartsWith(E, "_cell_length_a")) k = parseFloat(E.split(a)[1]);
              else if (j.stringStartsWith(E, "_cell_length_b")) C = parseFloat(E.split(a)[1]);
      else if (j.stringStartsWith(E, "_cell_length_c")) D = parseFloat(E.split(a)[1]);
      else if (j.stringStartsWith(E, "_cell_angle_alpha")) p = h.PI * parseFloat(E.split(a)[1]) / 180;
      else if (j.stringStartsWith(E, "_cell_angle_beta")) H = h.PI * parseFloat(E.split(a)[1]) / 180;
      else if (j.stringStartsWith(E,
              "_cell_angle_gamma")) F = h.PI * parseFloat(E.split(a)[1]) / 180;
      else if (j.stringStartsWith(E, "_symmetry_space_group_name_H-M")) G = E.split(d)[1];
      else if (j.stringStartsWith(E, "loop_")) {
          for (var P = {
                  fields: [],
                  lines: []
              }, ca = !1; void 0 !== (E = c.shift()) && !j.stringStartsWith(E = E.replace(f, ""), "loop_") && 0 < E.length;)
              if (j.stringStartsWith(E, "_")) {
                  if (ca) break;
                  P.fields = P.fields.concat(E.split(g).filter(w))
              } else ca = !0, P.lines.push(E);
          if (0 !== c.length && (j.stringStartsWith(E, "loop_") || j.stringStartsWith(E, "_"))) N = !1; - 1 !== P.fields.indexOf("_symmetry_equiv_pos_as_xyz") ||
              -1 !== P.fields.indexOf("_space_group_symop_operation_xyz") ? K = P : -1 !== P.fields.indexOf("_atom_site_label") ? I = P : -1 !== P.fields.indexOf("_geom_bond_atom_site_label_1") && (W = P)
      }
      E = k;
      p = (h.cos(p) - h.cos(F) * h.cos(H)) / h.sin(F);
      p = [E, 0, 0, 0, C * h.cos(F), C * h.sin(F), 0, 0, D * h.cos(H), D * p, D * h.sqrt(1 - h.pow(h.cos(H), 2) - p * p), 0, 0, 0, 0, 1];
      if (I) {
          P = N = k = c = D = -1;
          F = 0;
          for (H = I.fields.length; F < H; F++) E = I.fields[F], "_atom_site_type_symbol" === E ? D = F : "_atom_site_label" === E ? c = F : "_atom_site_fract_x" === E ? k = F : "_atom_site_fract_y" === E ? N = F : "_atom_site_fract_z" ===
              E && (P = F);
          F = 0;
          for (H = I.lines.length; F < H; F++) E = I.lines[F], C = E.split(g).filter(w), E = new l.Atom(C[-1 === D ? c : D].split(o)[0], parseFloat(C[k]), parseFloat(C[N]), parseFloat(C[P])), B.atoms.push(E), -1 !== c && (E.cifId = C[c], E.cifPart = 0)
      }
      if (K && !W) {
          F = C = 0;
          for (H = K.fields.length; F < H; F++)
              if (E = K.fields[F], "_symmetry_equiv_pos_as_xyz" === E || "_space_group_symop_operation_xyz" === E) C = F;
          N = A[G];
          c = [];
          F = 0;
          for (H = K.lines.length; F < H; F++) {
              E = K.lines[F].split(r).filter(w);
              for (var P = q(E[C]), ca = q(E[C + 1]), da = q(E[C + 2]), G = 0, k = B.atoms.length; G <
                  k; G++) {
                  E = B.atoms[G];
                  var U = E.x * P[1] + E.y * P[2] + E.z * P[3] + P[0],
                      S = E.x * ca[1] + E.y * ca[2] + E.z * ca[3] + ca[0],
                      ja = E.x * da[1] + E.y * da[2] + E.z * da[3] + da[0];
                  I = new l.Atom(E.label, U, S, ja);
                  c.push(I);
                  void 0 !== E.cifId && (I.cifId = E.cifId, I.cifPart = F + 1);
                  if (N) {
                      I = 0;
                      for (D = N.length; I < D; I++) {
                          var aa = N[I],
                              aa = new l.Atom(E.label, U + aa[0], S + aa[1], ja + aa[2]);
                          c.push(aa);
                          void 0 !== E.cifId && (aa.cifId = E.cifId, aa.cifPart = F + 1)
                      }
                  }
              }
          }
          F = 0;
          for (H = c.length; F < H; F++) {
              for (E = c[F]; 1 <= E.x;) E.x--;
              for (; 0 > E.x;) E.x++;
              for (; 1 <= E.y;) E.y--;
              for (; 0 > E.y;) E.y++;
              for (; 1 <= E.z;) E.z--;
              for (; 0 > E.z;) E.z++
          }
          I = [];
          F = 0;
          for (H = c.length; F < H; F++) {
              D = !1;
              E = c[F];
              G = 0;
              for (k = B.atoms.length; G < k; G++)
                  if (1E-4 > B.atoms[G].distance3D(E)) {
                      D = !0;
                      break
                  } if (!D) {
                  G = 0;
                  for (k = I.length; G < k; G++)
                      if (1E-4 > I[G].distance3D(E)) {
                          D = !0;
                          break
                      } D || I.push(E)
              }
          }
          B.atoms = B.atoms.concat(I)
      }
      H = [];
      for (F = 0; F < n; F++)
          for (G = 0; G < t; G++)
              for (I = 0; I < y; I++)
                  if (!(0 === F && 0 === G && 0 === I)) {
                      D = 0;
                      for (C = B.atoms.length; D < C; D++) E = B.atoms[D], c = new l.Atom(E.label, E.x + F, E.y + G, E.z + I), H.push(c), void 0 !== E.cifId && (c.cifId = E.cifId, c.cifPart = E.cifPart + (K ? K.lines.length :
                          0) + F + 10 * G + 100 * I)
                  } B.atoms = B.atoms.concat(H);
      F = 0;
      for (H = B.atoms.length; F < H; F++) E = B.atoms[F], K = e.multiplyVec3(p, [E.x, E.y, E.z]), E.x = K[0], E.y = K[1], E.z = K[2];
      if (W) {
          c = K = -1;
          F = 0;
          for (H = W.fields.length; F < H; F++) E = W.fields[F], "_geom_bond_atom_site_label_1" === E ? K = F : "_geom_bond_atom_site_label_2" === E && (c = F);
          I = 0;
          for (D = W.lines.length; I < D; I++) {
              C = W.lines[I].split(g).filter(w);
              E = C[K];
              C = C[c];
              F = 0;
              for (H = B.atoms.length; F < H; F++)
                  for (G = F + 1; G < H; G++) {
                      k = B.atoms[F];
                      N = B.atoms[G];
                      if (k.cifPart !== N.cifPart) break;
                      (k.cifId === E && N.cifId ===
                          C || k.cifId === C && N.cifId === E) && B.bonds.push(new l.Bond(k, N))
                  }
          }
      } else(new b.informatics.BondDeducer).deduceCovalentBonds(B, 1);
      n = [-n / 2, -t / 2, -y / 2];
      B.unitCellVectors = {
          o: e.multiplyVec3(p, n, []),
          x: e.multiplyVec3(p, [n[0] + 1, n[1], n[2]]),
          y: e.multiplyVec3(p, [n[0], n[1] + 1, n[2]]),
          z: e.multiplyVec3(p, [n[0], n[1], n[2] + 1]),
          xy: e.multiplyVec3(p, [n[0] + 1, n[1] + 1, n[2]]),
          xz: e.multiplyVec3(p, [n[0] + 1, n[1], n[2] + 1]),
          yz: e.multiplyVec3(p, [n[0], n[1] + 1, n[2] + 1]),
          xyz: e.multiplyVec3(p, [n[0] + 1, n[1] + 1, n[2] + 1])
      };
      return B
  };
  var t = new n.CIFInterpreter;
  b.readCIF = function(a, b, d, e) {
      return t.read(a, b, d, e)
  }
})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.io, ChemDoodle.structures, Math, ChemDoodle.lib.mat4, ChemDoodle.lib.vec3);
(function(b, j, n, l) {
  j.CMLInterpreter = function() {};
  var h = j.CMLInterpreter.prototype = new j._Interpreter;
  h.read = function(b) {
      var a = [];
      b = l.parseXML(b);
      b = l(b).find("cml");
      for (var d = 0, e = b.length; d < e; d++)
          for (var f = l(b[d]).find("molecule"), h = 0, j = f.length; h < j; h++) {
              for (var w = a[h] = new n.Molecule, A = [], q = l(f[h]).find("atom"), t = 0, u = q.length; t < u; t++) {
                  var v = l(q[t]),
                      z = v.attr("elementType"),
                      y, B, c;
                  void 0 == v.attr("x2") ? (y = v.attr("x3"), B = v.attr("y3"), c = v.attr("z3")) : (y = v.attr("x2"), B = v.attr("y2"), c = 0);
                  z = a[h].atoms[t] = new n.Atom(z,
                      y, B, c);
                  A[t] = v.attr("id");
                  void 0 != v.attr("formalCharge") && (z.charge = v.attr("formalCharge"))
              }
              q = l(f[h]).find("bond");
              t = 0;
              for (u = q.length; t < u; t++) {
                  v = l(q[t]);
                  y = v.attr("atomRefs2").split(" ");
                  z = w.atoms[l.inArray(y[0], A)];
                  y = w.atoms[l.inArray(y[1], A)];
                  switch (v.attr("order")) {
                      case "2":
                      case "D":
                          B = 2;
                          break;
                      case "3":
                      case "T":
                          B = 3;
                          break;
                      case "A":
                          B = 1.5;
                          break;
                      default:
                          B = 1
                  }
                  z = a[h].bonds[t] = new n.Bond(z, y, B);
                  switch (v.find("bondStereo").text()) {
                      case "W":
                          z.stereo = n.Bond.STEREO_PROTRUDING;
                          break;
                      case "H":
                          z.stereo = n.Bond.STEREO_RECESSED
                  }
              }
          }
      return a
  };
  h.write = function(b) {
      var a = [];
      a.push('\x3c?xml version\x3d"1.0" encoding\x3d"UTF-8"?\x3e\n');
      a.push('\x3ccml convention\x3d"conventions:molecular" xmlns\x3d"http://www.xml-cml.org/schema" xmlns:conventions\x3d"http://www.xml-cml.org/convention/" xmlns:dc\x3d"http://purl.org/dc/elements/1.1/"\x3e\n');
      for (var d = 0, e = b.length; d < e; d++) {
          a.push('\x3cmolecule id\x3d"m');
          a.push(d);
          a.push('"\x3e');
          a.push("\x3catomArray\x3e");
          for (var f = 0, h = b[d].atoms.length; f < h; f++) {
              var j = b[d].atoms[f];
              a.push('\x3catom elementType\x3d"');
              a.push(j.label);
              a.push('" id\x3d"a');
              a.push(f);
              a.push('" ');
              a.push('x3\x3d"');
              a.push(j.x);
              a.push('" y3\x3d"');
              a.push(j.y);
              a.push('" z3\x3d"');
              a.push(j.z);
              a.push('" ');
              0 != j.charge && (a.push('formalCharge\x3d"'), a.push(j.charge), a.push('" '));
              a.push("/\x3e")
          }
          a.push("\x3c/atomArray\x3e");
          a.push("\x3cbondArray\x3e");
          f = 0;
          for (h = b[d].bonds.length; f < h; f++) {
              j = b[d].bonds[f];
              a.push('\x3cbond atomRefs2\x3d"a');
              a.push(b[d].atoms.indexOf(j.a1));
              a.push(" a");
              a.push(b[d].atoms.indexOf(j.a2));
              a.push('" order\x3d"');
              switch (j.bondOrder) {
                  case 1.5:
                      a.push("A");
                      break;
                  case 1:
                  case 2:
                  case 3:
                      a.push(j.bondOrder);
                      break;
                  default:
                      a.push("S")
              }
              a.push('"/\x3e')
          }
          a.push("\x3c/bondArray\x3e");
          a.push("\x3c/molecule\x3e")
      }
      a.push("\x3c/cml\x3e");
      return a.join("")
  };
  var e = new j.CMLInterpreter;
  b.readCML = function(b) {
      return e.read(b)
  };
  b.writeCML = function(b) {
      return e.write(b)
  }
})(ChemDoodle, ChemDoodle.io, ChemDoodle.structures, ChemDoodle.lib.jQuery);
(function(b, j, n, l) {
  n.MOLInterpreter = function() {};
  var h = n.MOLInterpreter.prototype = new n._Interpreter;
  h.read = function(e, a) {
      a || (a = b.default_bondLength_2D);
      var d = new l.Molecule;
      if (!e) return d;
      for (var h = e.split("\n"), f = h[3], p = parseInt(f.substring(0, 3)), f = parseInt(f.substring(3, 6)), o = 0; o < p; o++) {
          var w = h[4 + o];
          d.atoms[o] = new l.Atom(w.substring(31, 34), parseFloat(w.substring(0, 10)) * a, (1 === a ? 1 : -1) * parseFloat(w.substring(10, 20)) * a, parseFloat(w.substring(20, 30)) * a);
          var n = parseInt(w.substring(34, 36));
          0 !== n && j[d.atoms[o].label] &&
              (d.atoms[o].mass = j[d.atoms[o].label].mass + n);
          switch (parseInt(w.substring(36, 39))) {
              case 1:
                  d.atoms[o].charge = 3;
                  break;
              case 2:
                  d.atoms[o].charge = 2;
                  break;
              case 3:
                  d.atoms[o].charge = 1;
                  break;
              case 5:
                  d.atoms[o].charge = -1;
                  break;
              case 6:
                  d.atoms[o].charge = -2;
                  break;
              case 7:
                  d.atoms[o].charge = -3
          }
      }
      for (o = 0; o < f; o++) {
          var w = h[4 + p + o],
              q = parseInt(w.substring(6, 9)),
              n = parseInt(w.substring(9, 12));
          if (3 < q) switch (q) {
              case 4:
                  q = 1.5;
                  break;
              default:
                  q = 1
          }
          w = new l.Bond(d.atoms[parseInt(w.substring(0, 3)) - 1], d.atoms[parseInt(w.substring(3, 6)) -
              1], q);
          switch (n) {
              case 3:
                  w.stereo = l.Bond.STEREO_AMBIGUOUS;
                  break;
              case 1:
                  w.stereo = l.Bond.STEREO_PROTRUDING;
                  break;
              case 6:
                  w.stereo = l.Bond.STEREO_RECESSED
          }
          d.bonds[o] = w
      }
      return d
  };
  h.write = function(e) {
      var a = [];
      a.push("Molecule from ChemDoodle Web Components\n\nhttp://www.ichemlabs.com\n");
      a.push(this.fit(e.atoms.length.toString(), 3));
      a.push(this.fit(e.bonds.length.toString(), 3));
      a.push("  0  0  0  0            999 V2000\n");
      for (var d = e.getCenter(), h = 0, f = e.atoms.length; h < f; h++) {
          var p = e.atoms[h],
              o = " 0";
          if (-1 !==
              p.mass && j[p.label]) {
              var n = p.mass - j[p.label].mass;
              5 > n && -4 < n && (o = (-1 < n ? " " : "") + n)
          }
          n = "  0";
          if (0 !== p.charge) switch (p.charge) {
              case 3:
                  n = "  1";
                  break;
              case 2:
                  n = "  2";
                  break;
              case 1:
                  n = "  3";
                  break;
              case -1:
                  n = "  5";
                  break;
              case -2:
                  n = "  6";
                  break;
              case -3:
                  n = "  7"
          }
          a.push(this.fit(((p.x - d.x) / b.default_bondLength_2D).toFixed(4), 10));
          a.push(this.fit((-(p.y - d.y) / b.default_bondLength_2D).toFixed(4), 10));
          a.push(this.fit((p.z / b.default_bondLength_2D).toFixed(4), 10));
          a.push(" ");
          a.push(this.fit(p.label, 3, !0));
          a.push(o);
          a.push(n);
          a.push("  0  0  0  0\n")
      }
      h = 0;
      for (f = e.bonds.length; h < f; h++) {
          p = e.bonds[h];
          d = 0;
          p.stereo === l.Bond.STEREO_AMBIGUOUS ? d = 3 : p.stereo === l.Bond.STEREO_PROTRUDING ? d = 1 : p.stereo === l.Bond.STEREO_RECESSED && (d = 6);
          a.push(this.fit((e.atoms.indexOf(p.a1) + 1).toString(), 3));
          a.push(this.fit((e.atoms.indexOf(p.a2) + 1).toString(), 3));
          p = p.bondOrder;
          if (1.5 == p) p = 4;
          else if (3 < p || 0 != p % 1) p = 1;
          a.push(this.fit(p, 3));
          a.push("  ");
          a.push(d);
          a.push("     0  0\n")
      }
      a.push("M  END");
      return a.join("")
  };
  var e = new n.MOLInterpreter;
  b.readMOL =
      function(b, a) {
          return e.read(b, a)
      };
  b.writeMOL = function(b) {
      return e.write(b)
  }
})(ChemDoodle, ChemDoodle.ELEMENT, ChemDoodle.io, ChemDoodle.structures);
(function(b, j, n, l, h, e, g) {
  function a(a, b, d, e, h) {
      for (var g = 0, j = b.length; g < j; g++) {
          var l = b[g];
          if (l.id === d && e >= l.start && e <= l.end) {
              h ? a.helix = !0 : a.sheet = !0;
              e + 1 === l.end && (a.arrow = !0);
              break
          }
      }
  }
  n.PDBInterpreter = function() {};
  var d = n.PDBInterpreter.prototype = new n._Interpreter;
  d.calculateRibbonDistances = !1;
  d.deduceResidueBonds = !1;
  d.read = function(d, p) {
      var o = new l.Molecule;
      o.chains = [];
      if (!d) return o;
      var n = d.split("\n");
      p || (p = 1);
      for (var r = [], q = [], t, u = [], v = [], z = [], y = 0, B = n.length; y < B; y++) {
          var c = n[y];
          if (j.stringStartsWith(c,
                  "HELIX")) r.push({
              id: c.substring(19, 20),
              start: parseInt(c.substring(21, 25)),
              end: parseInt(c.substring(33, 37))
          });
          else if (j.stringStartsWith(c, "SHEET")) q.push({
              id: c.substring(21, 22),
              start: parseInt(c.substring(22, 26)),
              end: parseInt(c.substring(33, 37))
          });
          else if (j.stringStartsWith(c, "ATOM")) {
              var k = c.substring(16, 17);
              if (" " === k || "A" === k) {
                  k = e(c.substring(76, 78));
                  if (0 === k.length) {
                      var C = e(c.substring(12, 14));
                      "HD" === C ? k = "H" : 0 < C.length && (k = 1 < C.length ? C.charAt(0) + C.substring(1).toLowerCase() : C)
                  }
                  C = new l.Atom(k, parseFloat(c.substring(30,
                      38)) * p, parseFloat(c.substring(38, 46)) * p, parseFloat(c.substring(46, 54)) * p);
                  C.hetatm = !1;
                  v.push(C);
                  var D = parseInt(c.substring(22, 26));
                  if (0 === u.length)
                      for (k = 0; 2 > k; k++) {
                          var H = new l.Residue(-1);
                          H.cp1 = C;
                          H.cp2 = C;
                          u.push(H)
                      }
                  D !== Number.NaN && u[u.length - 1].resSeq !== D && (k = new l.Residue(D), k.name = e(c.substring(17, 20)), 3 === k.name.length ? k.name = k.name.substring(0, 1) + k.name.substring(1).toLowerCase() : 2 === k.name.length && "D" === k.name.charAt(0) && (k.name = k.name.substring(1)), u.push(k), H = c.substring(21, 22), a(k, r, H, D, !0),
                      a(k, q, H, D, !1));
                  c = e(c.substring(12, 16));
                  k = u[u.length - 1];
                  if ("CA" === c || "P" === c || "O5'" === c) k.cp1 || (k.cp1 = C);
                  else if ("N3" === c && ("C" === k.name || "U" === k.name || "T" === k.name) || "N1" === c && ("A" === k.name || "G" === k.name)) k.cp3 = C;
                  else if ("C2" === c) k.cp4 = C;
                  else if ("C4" === c && ("C" === k.name || "U" === k.name || "T" === k.name) || "C6" === c && ("A" === k.name || "G" === k.name)) k.cp5 = C;
                  else if ("O" === c || "C6" === c && ("C" === k.name || "U" === k.name || "T" === k.name) || "N9" === c) {
                      if (!u[u.length - 1].cp2) {
                          if ("C6" === c || "N9" === c) t = C;
                          k.cp2 = C
                      }
                  } else "C" === c && (t =
                      C)
              }
          } else if (j.stringStartsWith(c, "HETATM")) k = e(c.substring(76, 78)), 0 === k.length && (k = e(c.substring(12, 16))), 1 < k.length && (k = k.substring(0, 1) + k.substring(1).toLowerCase()), k = new l.Atom(k, parseFloat(c.substring(30, 38)) * p, parseFloat(c.substring(38, 46)) * p, parseFloat(c.substring(46, 54)) * p), k.hetatm = !0, "HOH" === e(c.substring(17, 20)) && (k.isWater = !0), o.atoms.push(k), z[parseInt(e(c.substring(6, 11)))] = k;
          else if (j.stringStartsWith(c, "CONECT")) {
              if (k = parseInt(e(c.substring(6, 11))), z[k]) {
                  C = z[k];
                  for (D = 0; 4 > D; D++)
                      if (k =
                          e(c.substring(11 + 5 * D, 16 + 5 * D)), 0 !== k.length && (k = parseInt(k), z[k])) {
                          for (var H = z[k], F = !1, k = 0, G = o.bonds.length; k < G; k++) {
                              var K = o.bonds[k];
                              if (K.a1 === C && K.a2 === H || K.a1 === H && K.a2 === C) {
                                  F = !0;
                                  break
                              }
                          }
                          F || o.bonds.push(new l.Bond(C, H))
                      }
              }
          } else if (j.stringStartsWith(c, "TER")) this.endChain(o, u, t, v), u = [];
          else if (j.stringStartsWith(c, "ENDMDL")) break
      }
      this.endChain(o, u, t, v);
      0 === o.bonds.size && (new b.informatics.BondDeducer).deduceCovalentBonds(o, p);
      if (this.deduceResidueBonds) {
          y = 0;
          for (B = v.length; y < B; y++) {
              n = g.min(B, y + 20);
              for (k = y + 1; k < n; k++) r = v[y], q = v[k], r.distance3D(q) < 1.1 * (h[r.label].covalentRadius + h[q.label].covalentRadius) && o.bonds.push(new l.Bond(r, q, 1))
          }
      }
      o.atoms = o.atoms.concat(v);
      this.calculateRibbonDistances && this.calculateDistances(o, v);
      return o
  };
  d.endChain = function(a, b, d, e) {
      if (0 < b.length) {
          var h = b[b.length - 1];
          h.cp1 || (h.cp1 = e[e.length - 2]);
          h.cp2 || (h.cp2 = e[e.length - 1]);
          for (e = 0; 4 > e; e++) h = new l.Residue(-1), h.cp1 = d, h.cp2 = b[b.length - 1].cp2, b.push(h);
          a.chains.push(b)
      }
  };
  d.calculateDistances = function(a, b) {
      for (var d = [],
              e = 0, h = a.atoms.length; e < h; e++) {
          var g = a.atoms[e];
          g.hetatm && (g.isWater || d.push(g))
      }
      e = 0;
      for (h = b.length; e < h; e++)
          if (g = b[e], g.closestDistance = Number.POSITIVE_INFINITY, 0 === d.length) g.closestDistance = 0;
          else
              for (var j = 0, l = d.length; j < l; j++) g.closestDistance = Math.min(g.closestDistance, g.distance3D(d[j]))
  };
  var r = new n.PDBInterpreter;
  b.readPDB = function(a, b) {
      return r.read(a, b)
  }
})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.io, ChemDoodle.structures, ChemDoodle.ELEMENT, ChemDoodle.lib.jQuery.trim, Math);
(function(b, j, n, l, h, e) {
  var g = {
          "@": 0,
          A: 1,
          B: 2,
          C: 3,
          D: 4,
          E: 5,
          F: 6,
          G: 7,
          H: 8,
          I: 9,
          a: -1,
          b: -2,
          c: -3,
          d: -4,
          e: -5,
          f: -6,
          g: -7,
          h: -8,
          i: -9
      },
      a = {
          "%": 0,
          J: 1,
          K: 2,
          L: 3,
          M: 4,
          N: 5,
          O: 6,
          P: 7,
          Q: 8,
          R: 9,
          j: -1,
          k: -2,
          l: -3,
          m: -4,
          n: -5,
          o: -6,
          p: -7,
          q: -8,
          r: -9
      },
      d = {
          S: 1,
          T: 2,
          U: 3,
          V: 4,
          W: 5,
          X: 6,
          Y: 7,
          Z: 8,
          s: 9
      };
  n.JCAMPInterpreter = function() {};
  h = n.JCAMPInterpreter.prototype = new n._Interpreter;
  h.convertHZ2PPM = !1;
  h.read = function(b) {
      this.isBreak = function(b) {
          return void 0 !== g[b] || void 0 !== a[b] || void 0 !== d[b] || " " === b || "-" === b || "+" === b
      };
      this.getValue = function(b, c) {
          var d =
              b.charAt(0),
              e = b.substring(1);
          return void 0 !== g[d] ? parseFloat(g[d] + e) : void 0 !== a[d] ? parseFloat(a[d] + e) + c : parseFloat(e)
      };
      var h = new l.Spectrum;
      if (void 0 === b || 0 === b.length) return h;
      b = b.split("\n");
      for (var o = [], n, r, q, t, u = 1, v = 1, z = 1, y = -1, B = -1, c = -1, k = !0, C = !1, D = 0, H = b.length; D < H; D++) {
          var F = e(b[D]),
              G = F.indexOf("$$"); - 1 !== G && (F = F.substring(0, G));
          if (0 === o.length || !j.stringStartsWith(b[D], "##")) 0 !== o.length && o.push("\n"), o.push(e(F));
          else if (G = o.join(""), k && 100 > G.length && h.metadata.push(G), o = [F], j.stringStartsWith(G,
                  "##TITLE\x3d")) h.title = e(G.substring(8));
          else if (j.stringStartsWith(G, "##XUNITS\x3d")) h.xUnit = e(G.substring(9)), this.convertHZ2PPM && "HZ" === h.xUnit.toUpperCase() && (h.xUnit = "PPM", C = !0);
          else if (j.stringStartsWith(G, "##YUNITS\x3d")) h.yUnit = e(G.substring(9));
          else if (!j.stringStartsWith(G, "##XYPAIRS\x3d"))
              if (j.stringStartsWith(G, "##FIRSTX\x3d")) r = parseFloat(e(G.substring(9)));
              else if (j.stringStartsWith(G, "##LASTX\x3d")) n = parseFloat(e(G.substring(8)));
          else if (j.stringStartsWith(G, "##FIRSTY\x3d")) q = parseFloat(e(G.substring(9)));
          else if (j.stringStartsWith(G, "##NPOINTS\x3d")) t = parseFloat(e(G.substring(10)));
          else if (j.stringStartsWith(G, "##XFACTOR\x3d")) u = parseFloat(e(G.substring(10)));
          else if (j.stringStartsWith(G, "##YFACTOR\x3d")) v = parseFloat(e(G.substring(10)));
          else if (j.stringStartsWith(G, "##DELTAX\x3d")) y = parseFloat(e(G.substring(9)));
          else if (j.stringStartsWith(G, "##.OBSERVE FREQUENCY\x3d")) this.convertHZ2PPM && (z = parseFloat(e(G.substring(21))));
          else if (j.stringStartsWith(G, "##.SHIFT REFERENCE\x3d")) this.convertHZ2PPM &&
              (c = G.substring(19).split(","), B = parseInt(e(c[2])), c = parseFloat(e(c[3])));
          else if (j.stringStartsWith(G, "##XYDATA\x3d")) {
              C || (z = 1);
              var F = k = !1,
                  G = G.split("\n"),
                  K = (n - r) / (t - 1);
              if (-1 !== y)
                  for (var I = 1, W = G.length; I < W; I++)
                      if ("|" === G[I].charAt(0)) {
                          K = y;
                          break
                      } for (var E = r - K, N = q, P = 0, ca, I = 1, W = G.length; I < W; I++) {
                  for (var da = [], E = e(G[I]), o = [], U = !1, S = 0, ja = E.length; S < ja; S++) this.isBreak(E.charAt(S)) ? (0 < o.length && !(1 === o.length && " " === o[0]) && da.push(o.join("")), o = [E.charAt(S)]) : "|" === E.charAt(S) ? U = !0 : o.push(E.charAt(S));
                  da.push(o.join(""));
                  E = parseFloat(da[0]) * u - K;
                  S = 1;
                  for (ja = da.length; S < ja; S++)
                      if (N = da[S], void 0 !== d[N.charAt(0)])
                          for (var aa = parseInt(d[N.charAt(0)] + N.substring(1)) - 1, Sa = 0; Sa < aa; Sa++) E += K, P = this.getValue(ca, P), N = P * v, $++, h.data[h.data.length - 1] = new l.Point(E / z, N);
                      else void 0 !== g[N.charAt(0)] && F ? (N = this.getValue(N, P) * v, U && (E += K, h.data.push(new l.Point(E / z, N)))) : (F = void 0 !== a[N.charAt(0)], ca = N, E += K, P = this.getValue(N, P), N = P * v, $++, h.data.push(new l.Point(E / z, N)))
              }
              if (-1 !== B) {
                  F = c - h.data[B - 1].x;
                  D = 0;
                  for (H = h.data.length; D <
                      H; D++) h.data[D].x += F
              }
          } else if (j.stringStartsWith(G, "##PEAK TABLE\x3d")) {
              k = !1;
              h.continuous = !1;
              for (var G = G.split("\n"), $ = 0, I = 1, W = G.length; I < W; I++) {
                  F = G[I].split(/[\s,]+/);
                  $ += F.length / 2;
                  S = 0;
                  for (ja = F.length; S + 1 < ja; S += 2) h.data.push(new l.Point(parseFloat(e(F[S])), parseFloat(e(F[S + 1]))))
              }
          }
      }
      h.setup();
      return h
  };
  var r = new n.JCAMPInterpreter;
  r.convertHZ2PPM = !0;
  b.readJCAMP = function(a) {
      return r.read(a)
  }
})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.io, ChemDoodle.structures, ChemDoodle.lib.jQuery, ChemDoodle.lib.jQuery.trim);
(function(b, j, n, l, h, e) {
  j.JSONInterpreter = function() {};
  var g = j.JSONInterpreter.prototype;
  g.contentTo = function(a, b) {
      for (var e = 0, h = 0, g = 0, j = a.length; g < j; g++) {
          for (var l = a[g], n = 0, t = l.atoms.length; n < t; n++) l.atoms[n].tmpid = "a" + e++;
          n = 0;
          for (t = l.bonds.length; n < t; n++) l.bonds[n].tmpid = "b" + h++
      }
      g = e = 0;
      for (j = b.length; g < j; g++) b[g].tmpid = "s" + e++;
      e = {};
      if (a && 0 < a.length) {
          e.m = [];
          g = 0;
          for (j = a.length; g < j; g++) e.m.push(this.molTo(a[g]))
      }
      if (b && 0 < b.length) {
          e.s = [];
          g = 0;
          for (j = b.length; g < j; g++) e.s.push(this.shapeTo(b[g]))
      }
      g = 0;
      for (j =
          a.length; g < j; g++) {
          l = a[g];
          n = 0;
          for (t = l.atoms.length; n < t; n++) l.atoms[n].tmpid = void 0;
          n = 0;
          for (t = l.bonds.length; n < t; n++) l.bonds[n].tmpid = void 0
      }
      g = 0;
      for (j = b.length; g < j; g++) b[g].tmpid = void 0;
      return e
  };
  g.contentFrom = function(a) {
      var b = {
          molecules: [],
          shapes: []
      };
      if (a.m)
          for (var e = 0, h = a.m.length; e < h; e++) b.molecules.push(this.molFrom(a.m[e]));
      if (a.s) {
          e = 0;
          for (h = a.s.length; e < h; e++) b.shapes.push(this.shapeFrom(a.s[e], b.molecules))
      }
      e = 0;
      for (h = b.molecules.length; e < h; e++) {
          a = b.molecules[e];
          for (var g = 0, j = a.atoms.length; g <
              j; g++) a.atoms[g].tmpid = void 0;
          g = 0;
          for (j = a.bonds.length; g < j; g++) a.bonds[g].tmpid = void 0
      }
      e = 0;
      for (h = b.shapes.length; e < h; e++) b.shapes[e].tmpid = void 0;
      return b
  };
  g.molTo = function(a) {
      for (var b = {
              a: []
          }, e = 0, h = a.atoms.length; e < h; e++) {
          var g = a.atoms[e],
              j = {
                  x: g.x,
                  y: g.y
              };
          g.tmpid && (j.i = g.tmpid);
          "C" !== g.label && (j.l = g.label);
          0 !== g.z && (j.z = g.z);
          0 !== g.charge && (j.c = g.charge); - 1 !== g.mass && (j.m = g.mass);
          0 !== g.numRadical && (j.r = g.numRadical);
          0 !== g.numLonePair && (j.p = g.numLonePair);
          g.any && (j.q = !0); - 1 !== g.rgroup && (j.rg = g.rgroup);
          b.a.push(j)
      }
      if (0 < a.bonds.length) {
          b.b = [];
          e = 0;
          for (h = a.bonds.length; e < h; e++) g = a.bonds[e], j = {
              b: a.atoms.indexOf(g.a1),
              e: a.atoms.indexOf(g.a2)
          }, g.tmpid && (j.i = g.tmpid), 1 !== g.bondOrder && (j.o = g.bondOrder), g.stereo !== n.Bond.STEREO_NONE && (j.s = g.stereo), b.b.push(j)
      }
      return b
  };
  g.molFrom = function(a) {
      for (var b = new n.Molecule, e = 0, h = a.a.length; e < h; e++) {
          var g = a.a[e],
              j = new n.Atom(g.l ? g.l : "C", g.x, g.y);
          g.i && (j.tmpid = g.i);
          g.z && (j.z = g.z);
          g.c && (j.charge = g.c);
          g.m && (j.mass = g.m);
          g.r && (j.numRadical = g.r);
          g.p && (j.numLonePair = g.p);
          g.q && (j.any = !0);
          g.rg && (j.rgroup = g.rg);
          void 0 !== g.p_h && (j.hetatm = g.p_h);
          void 0 !== g.p_w && (j.isWater = g.p_w);
          void 0 !== g.p_d && (j.closestDistance = g.p_d);
          b.atoms.push(j)
      }
      if (a.b) {
          e = 0;
          for (h = a.b.length; e < h; e++) g = a.b[e], j = new n.Bond(b.atoms[g.b], b.atoms[g.e], void 0 === g.o ? 1 : g.o), g.i && (j.tmpid = g.i), g.s && (j.stereo = g.s), b.bonds.push(j)
      }
      return b
  };
  g.shapeTo = function(a) {
      var b = {};
      a.tmpid && (b.i = a.tmpid);
      a instanceof l.Line ? (b.t = "Line", b.x1 = a.p1.x, b.y1 = a.p1.y, b.x2 = a.p2.x, b.y2 = a.p2.y, b.a = a.arrowType) : a instanceof l.Pusher ?
          (b.t = "Pusher", b.o1 = a.o1.tmpid, b.o2 = a.o2.tmpid, 1 !== a.numElectron && (b.e = a.numElectron)) : a instanceof l.Bracket ? (b.t = "Bracket", b.x1 = a.p1.x, b.y1 = a.p1.y, b.x2 = a.p2.x, b.y2 = a.p2.y, 0 !== a.charge && (b.c = a.charge), 0 !== a.mult && (b.m = a.mult), 0 !== a.repeat && (b.r = a.repeat)) : a instanceof h.Distance ? (b.t = "Distance", b.a1 = a.a1.tmpid, b.a2 = a.a2.tmpid, a.node && (b.n = a.node, b.o = a.offset)) : a instanceof h.Angle ? (b.t = "Angle", b.a1 = a.a1.tmpid, b.a2 = a.a2.tmpid, b.a3 = a.a3.tmpid) : a instanceof h.Torsion && (b.t = "Torsion", b.a1 = a.a1.tmpid,
              b.a2 = a.a2.tmpid, b.a3 = a.a3.tmpid, b.a4 = a.a4.tmpid);
      return b
  };
  g.shapeFrom = function(a, b) {
      var e;
      if ("Line" === a.t) e = new l.Line(new n.Point(a.x1, a.y1), new n.Point(a.x2, a.y2)), e.arrowType = a.a;
      else if ("Pusher" === a.t) {
          var g, j;
          e = 0;
          for (var w = b.length; e < w; e++) {
              for (var A = b[e], q = 0, t = A.atoms.length; q < t; q++) {
                  var u = A.atoms[q];
                  u.tmpid === a.o1 ? g = u : u.tmpid === a.o2 && (j = u)
              }
              q = 0;
              for (t = A.bonds.length; q < t; q++) {
                  var v = A.bonds[q];
                  v.tmpid === a.o1 ? g = v : v.tmpid === a.o2 && (j = v)
              }
          }
          e = new l.Pusher(g, j);
          a.e && (e.numElectron = a.e)
      } else if ("Bracket" ===
          a.t) e = new l.Bracket(new n.Point(a.x1, a.y1), new n.Point(a.x2, a.y2)), void 0 !== a.c && (e.charge = a.c), void 0 !== a.m && (e.mult = a.m), void 0 !== a.r && (e.repeat = a.r);
      else if ("Distance" === a.t) {
          var z;
          e = 0;
          for (w = b.length; e < w; e++) {
              A = b[e];
              q = 0;
              for (t = A.atoms.length; q < t; q++) u = A.atoms[q], u.tmpid === a.a1 ? v = u : u.tmpid === a.a2 && (z = u)
          }
          e = new h.Distance(v, z, a.n, a.o)
      } else if ("Angle" === a.t) {
          var y;
          e = 0;
          for (w = b.length; e < w; e++) {
              A = b[e];
              q = 0;
              for (t = A.atoms.length; q < t; q++) u = A.atoms[q], u.tmpid === a.a1 ? v = u : u.tmpid === a.a2 ? z = u : u.tmpid === a.a3 && (y =
                  u)
          }
          e = new h.Angle(v, z, y)
      } else if ("Torsion" === a.t) {
          var B;
          e = 0;
          for (w = b.length; e < w; e++) {
              A = b[e];
              q = 0;
              for (t = A.atoms.length; q < t; q++) u = A.atoms[q], u.tmpid === a.a1 ? v = u : u.tmpid === a.a2 ? z = u : u.tmpid === a.a3 ? y = u : u.tmpid === a.a4 && (B = u)
          }
          e = new h.Torsion(v, z, y, B)
      }
      return e
  };
  g.pdbFrom = function(a) {
      var b = this.molFrom(a.mol);
      b.findRings = !1;
      b.fromJSON = !0;
      b.chains = this.chainsFrom(a.ribbons);
      return b
  };
  g.chainsFrom = function(a) {
      for (var b = [], e = 0, g = a.cs.length; e < g; e++) {
          for (var h = a.cs[e], j = [], l = 0, q = h.length; l < q; l++) {
              var t = h[l],
                  u = new n.Residue;
              u.name = t.n;
              u.cp1 = new n.Atom("", t.x1, t.y1, t.z1);
              u.cp2 = new n.Atom("", t.x2, t.y2, t.z2);
              t.x3 && (u.cp3 = new n.Atom("", t.x3, t.y3, t.z3), u.cp4 = new n.Atom("", t.x4, t.y4, t.z4), u.cp5 = new n.Atom("", t.x5, t.y5, t.z5));
              u.helix = t.h;
              u.sheet = t.s;
              u.arrow = t.a;
              j.push(u)
          }
          b.push(j)
      }
      return b
  };
  var a = new j.JSONInterpreter;
  b.readJSON = function(b) {
      var g;
      try {
          g = e.parse(b)
      } catch (f) {
          return
      }
      if (g) return g.m || g.s ? a.contentFrom(g) : g.a ? {
          molecules: [a.molFrom(g)],
          shapes: []
      } : {
          molecules: [],
          shapes: []
      }
  };
  b.writeJSON = function(b, g) {
      return e.stringify(a.contentTo(b,
          g))
  }
})(ChemDoodle, ChemDoodle.io, ChemDoodle.structures, ChemDoodle.structures.d2, ChemDoodle.structures.d3, JSON);
(function(b, j, n) {
  j.RXNInterpreter = function() {};
  var l = j.RXNInterpreter.prototype = new j._Interpreter;
  l.read = function(e, g) {
      g || (g = b.default_bondLength_2D);
      var a = [],
          d;
      if (e) {
          d = e.split("$MOL\n");
          for (var h = d[0].split("\n")[4], f = parseInt(h.substring(0, 3)), h = parseInt(h.substring(3, 6)), j = 1, l = 0, w = 0, A = f + h; w < A; w++) {
              a[w] = b.readMOL(d[j], g);
              var q = a[w].getBounds(),
                  q = q.maxX - q.minX,
                  l = l - (q + 40);
              j++
          }
          w = 0;
          for (A = f; w < A; w++) {
              var q = a[w].getBounds(),
                  q = q.maxX - q.minX,
                  j = a[w].getCenter(),
                  t = 0;
              for (d = a[w].atoms.length; t < d; t++) {
                  var u =
                      a[w].atoms[t];
                  u.x += l + q / 2 - j.x;
                  u.y -= j.y
              }
              l += q + 40
          }
          d = new n.d2.Line(new n.Point(l, 0), new n.Point(l + 40, 0));
          l += 80;
          w = f;
          for (A = f + h; w < A; w++) {
              q = a[w].getBounds();
              q = q.maxX - q.minX;
              j = a[w].getCenter();
              for (t = 0; t < a[w].atoms.length; t++) u = a[w].atoms[t], u.x += l + q / 2 - j.x, u.y -= j.y;
              l += q + 40
          }
      } else a.push(new n.Molecule), d = new n.d2.Line(new n.Point(-20, 0), new n.Point(20, 0));
      d.arrowType = n.d2.Line.ARROW_SYNTHETIC;
      return {
          molecules: a,
          shapes: [d]
      }
  };
  l.write = function(e, g) {
      var a = [
              [],
              []
          ],
          d = void 0;
      if (e && g) {
          h = 0;
          for (f = g.length; h < f; h++)
              if (g[h] instanceof n.d2.Line) {
                  d = g[h].getPoints();
                  break
              } if (!d) return "";
          for (var h = 0, f = e.length; h < f; h++) e[h].getCenter().x < d[1].x ? a[0].push(e[h]) : a[1].push(e[h]);
          d = [];
          d.push("$RXN\nReaction from ChemDoodle Web Components\n\nhttp://www.ichemlabs.com\n");
          d.push(this.fit(a[0].length.toString(), 3));
          d.push(this.fit(a[1].length.toString(), 3));
          d.push("\n");
          for (h = 0; 2 > h; h++)
              for (var f = 0, j = a[h].length; f < j; f++) d.push("$MOL\n"), d.push(b.writeMOL(a[h][f])), d.push("\n");
          return d.join("")
      }
  };
  var h = new j.RXNInterpreter;
  b.readRXN = function(b,
      g) {
      return h.read(b, g)
  };
  b.writeRXN = function(b, g) {
      return h.write(b, g)
  }
})(ChemDoodle, ChemDoodle.io, ChemDoodle.structures);
(function(b, j, n, l, h, e) {
  l.XYZInterpreter = function() {};
  j = l.XYZInterpreter.prototype = new l._Interpreter;
  j.deduceCovalentBonds = !0;
  j.read = function(a) {
      var d = new h.Molecule;
      if (!a) return d;
      a = a.split("\n");
      for (var g = parseInt(e(a[0])), f = 0; f < g; f++) {
          var j = a[f + 2].split(/\s+/g);
          d.atoms[f] = new h.Atom(isNaN(j[0]) ? j[0] : n[parseInt(j[0]) - 1], parseFloat(j[1]), parseFloat(j[2]), parseFloat(j[3]))
      }
      this.deduceCovalentBonds && (new b.informatics.BondDeducer).deduceCovalentBonds(d, 1);
      return d
  };
  var g = new l.XYZInterpreter;
  b.readXYZ =
      function(a) {
          return g.read(a)
      }
})(ChemDoodle, ChemDoodle.ELEMENT, ChemDoodle.SYMBOLS, ChemDoodle.io, ChemDoodle.structures, ChemDoodle.lib.jQuery.trim);
ChemDoodle.monitor = function(b, j, n) {
  var l = {
      CANVAS_DRAGGING: void 0,
      CANVAS_OVER: void 0,
      ALT: !1,
      SHIFT: !1,
      META: !1
  };
  b.supports_touch() || j(n).ready(function() {
      j(n).mousemove(function(b) {
          l.CANVAS_DRAGGING && l.CANVAS_DRAGGING.drag && (l.CANVAS_DRAGGING.prehandleEvent(b), l.CANVAS_DRAGGING.drag(b))
      });
      j(n).mouseup(function(b) {
          l.CANVAS_DRAGGING && l.CANVAS_DRAGGING !== l.CANVAS_OVER && l.CANVAS_DRAGGING.mouseup && (l.CANVAS_DRAGGING.prehandleEvent(b), l.CANVAS_DRAGGING.mouseup(b));
          l.CANVAS_DRAGGING = void 0
      });
      j(n).keydown(function(b) {
          l.SHIFT =
              b.shiftKey;
          l.ALT = b.altKey;
          l.META = b.metaKey || b.ctrlKey;
          var e = l.CANVAS_OVER;
          l.CANVAS_DRAGGING && (e = l.CANVAS_DRAGGING);
          e && e.keydown && (e.prehandleEvent(b), e.keydown(b))
      });
      j(n).keypress(function(b) {
          var e = l.CANVAS_OVER;
          l.CANVAS_DRAGGING && (e = l.CANVAS_DRAGGING);
          e && e.keypress && (e.prehandleEvent(b), e.keypress(b))
      });
      j(n).keyup(function(b) {
          l.SHIFT = b.shiftKey;
          l.ALT = b.altKey;
          l.META = b.metaKey || b.ctrlKey;
          var e = l.CANVAS_OVER;
          l.CANVAS_DRAGGING && (e = l.CANVAS_DRAGGING);
          e && e.keyup && (e.prehandleEvent(b), e.keyup(b))
      })
  });
  return l
}(ChemDoodle.featureDetection, ChemDoodle.lib.jQuery, document);
(function(b, j, n, l, h, e, g, a, d, r) {
  b._Canvas = function() {};
  var f = b._Canvas.prototype;
  f.molecules = void 0;
  f.shapes = void 0;
  f.emptyMessage = void 0;
  f.image = void 0;
  f.repaint = function() {
      if (!this.test) {
          var b = a.getElementById(this.id);
          if (b.getContext) {
              var d = b.getContext("2d");
              1 !== this.pixelRatio && b.width === this.width && (b.width = this.width * this.pixelRatio, b.height = this.height * this.pixelRatio, d.scale(this.pixelRatio, this.pixelRatio));
              this.image ? d.drawImage(this.image, 0, 0) : (this.specs.backgroundColor && this.bgCache !==
                  b.style.backgroundColor && (b.style.backgroundColor = this.specs.backgroundColor, this.bgCache = b.style.backgroundColor), d.fillStyle = this.specs.backgroundColor, d.fillRect(0, 0, this.width, this.height));
              if (this.innerRepaint) this.innerRepaint(d);
              else if (0 !== this.molecules.length || 0 !== this.shapes.length) {
                  d.save();
                  d.translate(this.width / 2, this.height / 2);
                  d.rotate(this.specs.rotateAngle);
                  d.scale(this.specs.scale, this.specs.scale);
                  d.translate(-this.width / 2, -this.height / 2);
                  for (var b = 0, e = this.molecules.length; b < e; b++) this.molecules[b].check(!0),
                      this.molecules[b].draw(d, this.specs);
                  b = 0;
                  for (e = this.shapes.length; b < e; b++) this.shapes[b].draw(d, this.specs);
                  d.restore()
              } else this.emptyMessage && (d.fillStyle = "#737683", d.textAlign = "center", d.textBaseline = "middle", d.font = "18px Helvetica, Verdana, Arial, Sans-serif", d.fillText(this.emptyMessage, this.width / 2, this.height / 2));
              this.drawChildExtras && this.drawChildExtras(d)
          }
      }
  };
  f.resize = function(a, d) {
      var f = e("#" + this.id);
      f.attr({
          width: a,
          height: d
      });
      f.css("width", a);
      f.css("height", d);
      this.width = a;
      this.height =
          d;
      if (b._Canvas3D && this instanceof b._Canvas3D) this.gl.viewport(0, 0, a, d), this.setupScene();
      else if (0 < this.molecules.length) {
          this.center();
          for (var f = 0, g = this.molecules.length; f < g; f++) this.molecules[f].check()
      }
      this.repaint()
  };
  f.setBackgroundImage = function(a) {
      this.image = new Image;
      var b = this;
      this.image.onload = function() {
          b.repaint()
      };
      this.image.src = a
  };
  f.loadMolecule = function(a) {
      this.clear();
      this.molecules.push(a);
      this.center();
      b._Canvas3D && this instanceof b._Canvas3D || a.check();
      this.afterLoadContent && this.afterLoadContent();
      this.repaint()
  };
  f.loadContent = function(a, d) {
      this.molecules = a ? a : [];
      this.shapes = d ? d : [];
      this.center();
      if (!(b._Canvas3D && this instanceof b._Canvas3D))
          for (var e = 0, f = this.molecules.length; e < f; e++) this.molecules[e].check();
      this.afterLoadContent && this.afterLoadContent();
      this.repaint()
  };
  f.addMolecule = function(a) {
      this.molecules.push(a);
      b._Canvas3D && this instanceof b._Canvas3D || a.check();
      this.repaint()
  };
  f.removeMolecule = function(a) {
      this.molecules = e.grep(this.molecules, function(b) {
          return b !== a
      });
      this.repaint()
  };
  f.getMolecule = function() {
      return 0 < this.molecules.length ? this.molecules[0] : void 0
  };
  f.getMolecules = function() {
      return this.molecules
  };
  f.addShape = function(a) {
      this.shapes.push(a);
      this.repaint()
  };
  f.removeShape = function(a) {
      this.shapes = e.grep(this.shapes, function(b) {
          return b !== a
      });
      this.repaint()
  };
  f.getShapes = function() {
      return this.shapes
  };
  f.clear = function() {
      this.molecules = [];
      this.shapes = [];
      this.specs.scale = 1;
      this.repaint()
  };
  f.center = function() {
      for (var a = this.getContentBounds(), b = new h.Point((this.width - a.minX -
              a.maxX) / 2, (this.height - a.minY - a.maxY) / 2), d = 0, e = this.molecules.length; d < e; d++)
          for (var f = this.molecules[d], j = 0, l = f.atoms.length; j < l; j++) f.atoms[j].add(b);
      d = 0;
      for (e = this.shapes.length; d < e; d++) {
          f = this.shapes[d].getPoints();
          j = 0;
          for (l = f.length; j < l; j++) f[j].add(b)
      }
      this.specs.scale = 1;
      b = a.maxX - a.minX;
      a = a.maxY - a.minY;
      if (b > this.width || a > this.height) this.specs.scale = 0.85 * g.min(this.width / b, this.height / a)
  };
  f.bondExists = function(a, b) {
      for (var d = 0, e = this.molecules.length; d < e; d++)
          for (var f = this.molecules[d], g = 0, h =
                  f.bonds.length; g < h; g++) {
              var j = f.bonds[g];
              if (j.contains(a) && j.contains(b)) return !0
          }
      return !1
  };
  f.getBond = function(a, b) {
      for (var d = 0, e = this.molecules.length; d < e; d++)
          for (var f = this.molecules[d], g = 0, h = f.bonds.length; g < h; g++) {
              var j = f.bonds[g];
              if (j.contains(a) && j.contains(b)) return j
          }
  };
  f.getMoleculeByAtom = function(a) {
      for (var b = 0, d = this.molecules.length; b < d; b++) {
          var e = this.molecules[b];
          if (-1 !== e.atoms.indexOf(a)) return e
      }
  };
  f.getAllAtoms = function() {
      for (var a = [], b = 0, d = this.molecules.length; b < d; b++) a = a.concat(this.molecules[b].atoms);
      return a
  };
  f.getAllPoints = function() {
      for (var a = [], b = 0, d = this.molecules.length; b < d; b++) a = a.concat(this.molecules[b].atoms);
      b = 0;
      for (d = this.shapes.length; b < d; b++) a = a.concat(this.shapes[b].getPoints());
      return a
  };
  f.getContentBounds = function() {
      for (var a = new n.Bounds, b = 0, d = this.molecules.length; b < d; b++) a.expand(this.molecules[b].getBounds());
      b = 0;
      for (d = this.shapes.length; b < d; b++) a.expand(this.shapes[b].getBounds());
      return a
  };
  f.create = function(f, o, n) {
      this.id = f;
      this.width = o;
      this.height = n;
      this.molecules = [];
      this.shapes = [];
      if (a.getElementById(f)) {
          var A = e("#" + f);
          o ? A.attr("width", o) : this.width = A.attr("width");
          n ? A.attr("height", n) : this.height = A.attr("height");
          A.attr("class", "ChemDoodleWebComponent")
      } else {
          if (!b.featureDetection.supports_canvas_text() && -1 != r.indexOf("MSIE")) {
              a.writeln('\x3cdiv style\x3d"border: 1px solid black;" width\x3d"' + o + '" height\x3d"' + n + '"\x3ePlease install \x3ca href\x3d"http://code.google.com/chrome/chromeframe/"\x3eGoogle Chrome Frame\x3c/a\x3e, then restart Internet Explorer.\x3c/div\x3e');
              return
          }
          a.writeln('\x3ccanvas class\x3d"ChemDoodleWebComponent" id\x3d"' + f + '" width\x3d"' + o + '" height\x3d"' + n + '" alt\x3d"ChemDoodle Web Component"\x3eThis browser does not support HTML5/Canvas.\x3c/canvas\x3e')
      }
      f = e("#" + f);
      f.css("width", this.width);
      f.css("height", this.height);
      this.pixelRatio = d.devicePixelRatio ? d.devicePixelRatio : 1;
      this.specs = new h.VisualSpecifications;
      var q = this;
      j.supports_touch() ? (f.bind("touchstart", function(a) {
              var b = (new Date).getTime();
              if (!j.supports_gesture() && 2 === a.originalEvent.touches.length) {
                  var d =
                      a.originalEvent.touches,
                      e = new h.Point(d[0].pageX, d[0].pageY),
                      d = new h.Point(d[1].pageX, d[1].pageY);
                  q.implementedGestureDist = e.distance(d);
                  q.implementedGestureAngle = e.angle(d);
                  q.gesturestart && (q.prehandleEvent(a), q.gesturestart(a))
              }
              q.lastTouch && 1 === a.originalEvent.touches.length && 500 > b - q.lastTouch ? q.dbltap ? (q.prehandleEvent(a), q.dbltap(a)) : q.dblclick ? (q.prehandleEvent(a), q.dblclick(a)) : q.touchstart ? (q.prehandleEvent(a), q.touchstart(a)) : q.mousedown && (q.prehandleEvent(a), q.mousedown(a)) : q.touchstart ?
                  (q.prehandleEvent(a), q.touchstart(a), this.hold && clearTimeout(this.hold), this.touchhold && (this.hold = setTimeout(function() {
                      q.touchhold(a)
                  }, 1E3))) : q.mousedown && (q.prehandleEvent(a), q.mousedown(a));
              q.lastTouch = b
          }), f.bind("touchmove", function(a) {
              this.hold && (clearTimeout(this.hold), this.hold = void 0);
              if (!j.supports_gesture() && 2 === a.originalEvent.touches.length && q.gesturechange) {
                  var b = a.originalEvent.touches,
                      d = new h.Point(b[0].pageX, b[0].pageY),
                      e = new h.Point(b[1].pageX, b[1].pageY),
                      b = d.distance(e),
                      d = d.angle(e);
                  a.originalEvent.scale = b / q.implementedGestureDist;
                  a.originalEvent.rotation = 180 * (q.implementedGestureAngle - d) / g.PI;
                  q.prehandleEvent(a);
                  q.gesturechange(a)
              }
              if (1 < a.originalEvent.touches.length && q.multitouchmove) {
                  d = a.originalEvent.touches.length;
                  q.prehandleEvent(a);
                  b = new h.Point(-a.offset.left * d, -a.offset.top * d);
                  for (e = 0; e < d; e++) b.x += a.originalEvent.changedTouches[e].pageX, b.y += a.originalEvent.changedTouches[e].pageY;
                  b.x /= d;
                  b.y /= d;
                  a.p = b;
                  q.multitouchmove(a, d)
              } else q.touchmove ? (q.prehandleEvent(a), q.touchmove(a)) :
                  q.drag && (q.prehandleEvent(a), q.drag(a))
          }), f.bind("touchend", function(a) {
              this.hold && (clearTimeout(this.hold), this.hold = void 0);
              !j.supports_gesture() && q.implementedGestureDist && (q.implementedGestureDist = void 0, q.implementedGestureAngle = void 0, q.gestureend && (q.prehandleEvent(a), q.gestureend(a)));
              q.touchend ? (q.prehandleEvent(a), q.touchend(a)) : q.mouseup && (q.prehandleEvent(a), q.mouseup(a));
              250 > (new Date).getTime() - q.lastTouch && (q.tap ? (q.prehandleEvent(a), q.tap(a)) : q.click && (q.prehandleEvent(a), q.click(a)))
          }),
          f.bind("gesturestart", function(a) {
              q.gesturestart && (q.prehandleEvent(a), q.gesturestart(a))
          }), f.bind("gesturechange", function(a) {
              q.gesturechange && (q.prehandleEvent(a), q.gesturechange(a))
          }), f.bind("gestureend", function(a) {
              q.gestureend && (q.prehandleEvent(a), q.gestureend(a))
          })) : (f.click(function(a) {
          switch (a.which) {
              case 1:
                  q.click && (q.prehandleEvent(a), q.click(a));
                  break;
              case 2:
                  q.middleclick && (q.prehandleEvent(a), q.middleclick(a));
                  break;
              case 3:
                  q.rightclick && (q.prehandleEvent(a), q.rightclick(a))
          }
      }), f.dblclick(function(a) {
          q.dblclick &&
              (q.prehandleEvent(a), q.dblclick(a))
      }), f.mousedown(function(a) {
          switch (a.which) {
              case 1:
                  l.CANVAS_DRAGGING = q;
                  q.mousedown && (q.prehandleEvent(a), q.mousedown(a));
                  break;
              case 2:
                  q.middlemousedown && (q.prehandleEvent(a), q.middlemousedown(a));
                  break;
              case 3:
                  q.rightmousedown && (q.prehandleEvent(a), q.rightmousedown(a))
          }
      }), f.mousemove(function(a) {
          !l.CANVAS_DRAGGING && q.mousemove && (q.prehandleEvent(a), q.mousemove(a))
      }), f.mouseout(function(a) {
          l.CANVAS_OVER = void 0;
          q.mouseout && (q.prehandleEvent(a), q.mouseout(a))
      }), f.mouseover(function(a) {
          l.CANVAS_OVER =
              q;
          q.mouseover && (q.prehandleEvent(a), q.mouseover(a))
      }), f.mouseup(function(a) {
          switch (a.which) {
              case 1:
                  q.mouseup && (q.prehandleEvent(a), q.mouseup(a));
                  break;
              case 2:
                  q.middlemouseup && (q.prehandleEvent(a), q.middlemouseup(a));
                  break;
              case 3:
                  q.rightmouseup && (q.prehandleEvent(a), q.rightmouseup(a))
          }
      }), f.mousewheel(function(a, b) {
          q.mousewheel && (q.prehandleEvent(a), q.mousewheel(a, b))
      }));
      this.subCreate && this.subCreate()
  };
  f.prehandleEvent = function(a) {
      a.originalEvent.changedTouches && (a.pageX = a.originalEvent.changedTouches[0].pageX,
          a.pageY = a.originalEvent.changedTouches[0].pageY);
      a.preventDefault();
      a.offset = e("#" + this.id).offset();
      a.p = new h.Point(a.pageX - a.offset.left, a.pageY - a.offset.top)
  }
})(ChemDoodle, ChemDoodle.featureDetection, ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.structures, ChemDoodle.lib.jQuery, Math, document, window, navigator.userAgent);
(function(b, j) {
  b._AnimatorCanvas = function(b, h, e) {
      b && this.create(b, h, e)
  };
  var n = b._AnimatorCanvas.prototype = new b._Canvas;
  n.timeout = 33;
  n.startAnimation = function() {
      this.stopAnimation();
      this.lastTime = (new Date).getTime();
      var b = this;
      this.nextFrame && (this.handle = j.requestInterval(function() {
          var h = (new Date).getTime();
          b.nextFrame(h - b.lastTime);
          b.repaint();
          b.lastTime = h
      }, this.timeout))
  };
  n.stopAnimation = function() {
      this.handle && (j.clearRequestInterval(this.handle), this.handle = void 0)
  };
  n.isRunning = function() {
      return void 0 !==
          this.handle
  }
})(ChemDoodle, ChemDoodle.animations);
(function(b, j) {
  b.FileCanvas = function(b, l, h, e) {
      b && this.create(b, l, h);
      j.writeln('\x3cbr\x3e\x3cform name\x3d"FileForm" enctype\x3d"multipart/form-data" method\x3d"POST" action\x3d"' + e + '" target\x3d"HiddenFileFrame"\x3e\x3cinput type\x3d"file" name\x3d"f" /\x3e\x3cinput type\x3d"submit" name\x3d"submitbutton" value\x3d"Show File" /\x3e\x3c/form\x3e\x3ciframe id\x3d"HFF-' + b + '" name\x3d"HiddenFileFrame" height\x3d"0" width\x3d"0" style\x3d"display:none;" onLoad\x3d"GetMolFromFrame(\'HFF-' + b + "', " + b + ')"\x3e\x3c/iframe\x3e');
      this.emptyMessage = "Click below to load file";
      this.repaint()
  };
  b.FileCanvas.prototype = new b._Canvas
})(ChemDoodle, document);
(function(b) {
  b.HyperlinkCanvas = function(b, n, l, h, e, g) {
      b && this.create(b, n, l);
      this.urlOrFunction = h;
      this.color = e ? e : "blue";
      this.size = g ? g : 2
  };
  b = b.HyperlinkCanvas.prototype = new b._Canvas;
  b.openInNewWindow = !0;
  b.hoverImage = void 0;
  b.drawChildExtras = function(b) {
      this.e && (this.hoverImage ? b.drawImage(this.hoverImage, 0, 0) : (b.strokeStyle = this.color, b.lineWidth = 2 * this.size, b.strokeRect(0, 0, this.width, this.height)))
  };
  b.setHoverImage = function(b) {
      this.hoverImage = new Image;
      this.hoverImage.src = b
  };
  b.click = function() {
      this.e =
          void 0;
      this.repaint();
      this.urlOrFunction instanceof Function ? this.urlOrFunction() : this.openInNewWindow ? window.open(this.urlOrFunction) : location.href = this.urlOrFunction
  };
  b.mouseout = function() {
      this.e = void 0;
      this.repaint()
  };
  b.mouseover = function(b) {
      this.e = b;
      this.repaint()
  }
})(ChemDoodle);
(function(b, j, n, l) {
  b.MolGrabberCanvas = function(b, e, g) {
      b && this.create(b, e, g);
      e = [];
      e.push('\x3cbr\x3e\x3cinput type\x3d"text" id\x3d"');
      e.push(b);
      e.push('_query" size\x3d"32" value\x3d"" /\x3e');
      e.push("\x3cbr\x3e\x3cnobr\x3e");
      e.push('\x3cselect id\x3d"');
      e.push(b);
      e.push('_select"\x3e');
      e.push('\x3coption value\x3d"chemexper"\x3eChemExper');
      e.push('\x3coption value\x3d"chemspider"\x3eChemSpider');
      e.push('\x3coption value\x3d"pubchem" selected\x3ePubChem');
      e.push("\x3c/select\x3e");
      e.push('\x3cbutton id\x3d"');
      e.push(b);
      e.push('_submit"\x3eShow Molecule\x3c/button\x3e');
      e.push("\x3c/nobr\x3e");
      l.getElementById(b);
      n("#" + b).after(e.join(""));
      var a = this;
      n("#" + b + "_submit").click(function() {
          a.search()
      });
      n("#" + b + "_query").keypress(function(b) {
          13 === b.which && a.search()
      });
      this.emptyMessage = "Enter search term below";
      this.repaint()
  };
  b = b.MolGrabberCanvas.prototype = new b._Canvas;
  b.setSearchTerm = function(b) {
      n("#" + this.id + "_query").val(b);
      this.search()
  };
  b.search = function() {
      this.emptyMessage = "Searching...";
      this.clear();
      var b = this;
      j.getMoleculeFromDatabase(n("#" + this.id + "_query").val(), {
          database: n("#" + this.id + "_select").val()
      }, function(e) {
          b.loadMolecule(e)
      })
  }
})(ChemDoodle, ChemDoodle.iChemLabs, ChemDoodle.lib.jQuery, document);
(function(b, j, n) {
  var l = [],
      h = [1, 0, 0],
      e = [0, 1, 0],
      g = [0, 0, 1];
  b.RotatorCanvas = function(a, b, e, f) {
      a && this.create(a, b, e);
      this.rotate3D = f
  };
  b = b.RotatorCanvas.prototype = new b._AnimatorCanvas;
  j = j.PI / 15;
  b.xIncrement = j;
  b.yIncrement = j;
  b.zIncrement = j;
  b.nextFrame = function(a) {
      if (0 === this.molecules.length && 0 === this.shapes.length) this.stopAnimation();
      else if (a /= 1E3, this.rotate3D) {
          n.identity(l);
          n.rotate(l, this.xIncrement * a, h);
          n.rotate(l, this.yIncrement * a, e);
          n.rotate(l, this.zIncrement * a, g);
          a = 0;
          for (var b = this.molecules.length; a <
              b; a++) {
              for (var j = this.molecules[a], f = 0, p = j.atoms.length; f < p; f++) {
                  var o = j.atoms[f],
                      w = [o.x - this.width / 2, o.y - this.height / 2, o.z];
                  n.multiplyVec3(l, w);
                  o.x = w[0] + this.width / 2;
                  o.y = w[1] + this.height / 2;
                  o.z = w[2]
              }
              f = 0;
              for (p = j.rings.length; f < p; f++) j.rings[f].center = j.rings[f].getCenter();
              this.specs.atoms_display && this.specs.atoms_circles_2D && j.sortAtomsByZ();
              this.specs.bonds_display && this.specs.bonds_clearOverlaps_2D && j.sortBondsByZ()
          }
          a = 0;
          for (b = this.shapes.length; a < b; a++) {
              j = this.shapes[a].getPoints();
              f = 0;
              for (p = j.length; f <
                  p; f++) o = j[f], w = [o.x - this.width / 2, o.y - this.height / 2, 0], n.multiplyVec3(l, w), o.x = w[0] + this.width / 2, o.y = w[1] + this.height / 2
          }
      } else this.specs.rotateAngle += this.zIncrement * a
  };
  b.dblclick = function() {
      this.isRunning() ? this.stopAnimation() : this.startAnimation()
  }
})(ChemDoodle, Math, ChemDoodle.lib.mat4);
(function(b, j, n) {
  b.SlideshowCanvas = function(b, h, e) {
      b && this.create(b, h, e)
  };
  b = b.SlideshowCanvas.prototype = new b._AnimatorCanvas;
  b.frames = [];
  b.curIndex = 0;
  b.timeout = 5E3;
  b.alpha = 0;
  b.innerHandle = void 0;
  b.phase = 0;
  b.drawChildExtras = function(b) {
      var h = n.getRGB(this.specs.backgroundColor, 255);
      b.fillStyle = "rgba(" + h[0] + ", " + h[1] + ", " + h[2] + ", " + this.alpha + ")";
      b.fillRect(0, 0, this.width, this.height)
  };
  b.nextFrame = function() {
      if (0 === this.frames.length) this.stopAnimation();
      else {
          this.phase = 0;
          var b = this,
              h = 1;
          this.innerHandle =
              setInterval(function() {
                  b.alpha = h / 15;
                  b.repaint();
                  15 === h && b.breakInnerHandle();
                  h++
              }, 33)
      }
  };
  b.breakInnerHandle = function() {
      this.innerHandle && (clearInterval(this.innerHandle), this.innerHandle = void 0);
      if (0 === this.phase) {
          this.curIndex++;
          this.curIndex > this.frames.length - 1 && (this.curIndex = 0);
          this.alpha = 1;
          var b = this.frames[this.curIndex];
          this.loadContent(b.mols, b.shapes);
          this.phase = 1;
          var h = this,
              e = 1;
          this.innerHandle = setInterval(function() {
              h.alpha = (15 - e) / 15;
              h.repaint();
              15 === e && h.breakInnerHandle();
              e++
          }, 33)
      } else 1 ===
          this.phase && (this.alpha = 0, this.repaint())
  };
  b.addFrame = function(b, h) {
      0 === this.frames.length && this.loadContent(b, h);
      this.frames.push({
          mols: b,
          shapes: h
      })
  }
})(ChemDoodle, ChemDoodle.animations, ChemDoodle.math);
(function(b, j, n, l, h) {
  b.TransformCanvas = function(b, g, a, d) {
      b && this.create(b, g, a);
      this.rotate3D = d
  };
  b = b.TransformCanvas.prototype = new b._Canvas;
  b.lastPoint = void 0;
  b.rotationMultMod = 1.3;
  b.lastPinchScale = 1;
  b.lastGestureRotate = 0;
  b.mousedown = function(b) {
      this.lastPoint = b.p
  };
  b.dblclick = function() {
      this.center();
      this.repaint()
  };
  b.drag = function(b) {
      if (!this.lastPoint.multi) {
          if (j.ALT) {
              var g = new n.Point(b.p.x, b.p.y);
              g.sub(this.lastPoint);
              for (var a = 0, d = this.molecules.length; a < d; a++) {
                  for (var r = this.molecules[a], f =
                          0, p = r.atoms.length; f < p; f++) r.atoms[f].add(g);
                  r.check()
              }
              a = 0;
              for (d = this.shapes.length; a < d; a++) {
                  r = this.shapes[a].getPoints();
                  f = 0;
                  for (p = r.length; f < p; f++) r[f].add(g)
              }
              this.lastPoint = b.p
          } else if (!0 === this.rotate3D) {
              p = l.max(this.width / 4, this.height / 4);
              f = (b.p.x - this.lastPoint.x) / p * this.rotationMultMod;
              p = -(b.p.y - this.lastPoint.y) / p * this.rotationMultMod;
              g = [];
              h.identity(g);
              h.rotate(g, p, [1, 0, 0]);
              h.rotate(g, f, [0, 1, 0]);
              a = 0;
              for (d = this.molecules.length; a < d; a++) {
                  r = this.molecules[a];
                  f = 0;
                  for (p = r.atoms.length; f < p; f++) a =
                      r.atoms[f], d = [a.x - this.width / 2, a.y - this.height / 2, a.z], h.multiplyVec3(g, d), a.x = d[0] + this.width / 2, a.y = d[1] + this.height / 2, a.z = d[2];
                  a = 0;
                  for (d = r.rings.length; a < d; a++) r.rings[a].center = r.rings[a].getCenter();
                  this.lastPoint = b.p;
                  this.specs.atoms_display && this.specs.atoms_circles_2D && r.sortAtomsByZ();
                  this.specs.bonds_display && this.specs.bonds_clearOverlaps_2D && r.sortBondsByZ()
              }
          } else p = new n.Point(this.width / 2, this.height / 2), f = p.angle(this.lastPoint), p = p.angle(b.p), this.specs.rotateAngle -= p - f, this.lastPoint =
              b.p;
          this.repaint()
      }
  };
  b.mousewheel = function(b, g) {
      this.specs.scale += g / 50;
      0.01 > this.specs.scale && (this.specs.scale = 0.01);
      this.repaint()
  };
  b.multitouchmove = function(b, g) {
      if (2 === g)
          if (this.lastPoint.multi) {
              var a = new n.Point(b.p.x, b.p.y);
              a.sub(this.lastPoint);
              for (var d = 0, h = this.molecules.length; d < h; d++) {
                  for (var f = this.molecules[d], j = 0, l = f.atoms.length; j < l; j++) f.atoms[j].add(a);
                  f.check()
              }
              d = 0;
              for (h = this.shapes.length; d < h; d++) {
                  f = this.shapes[d].getPoints();
                  j = 0;
                  for (l = f.length; j < l; j++) f[j].add(a)
              }
              this.lastPoint =
                  b.p;
              this.lastPoint.multi = !0;
              this.repaint()
          } else this.lastPoint = b.p, this.lastPoint.multi = !0
  };
  b.gesturechange = function(b) {
      0 !== b.originalEvent.scale - this.lastPinchScale && (this.specs.scale *= b.originalEvent.scale / this.lastPinchScale, 0.01 > this.specs.scale && (this.specs.scale = 0.01), this.lastPinchScale = b.originalEvent.scale);
      if (0 !== this.lastGestureRotate - b.originalEvent.rotation) {
          for (var g = (this.lastGestureRotate - b.originalEvent.rotation) / 180 * f.PI, a = new n.Point(this.width / 2, this.height / 2), d = 0, h = this.molecules.length; d <
              h; d++) {
              for (var f = this.molecules[d], j = 0, l = f.atoms.length; j < l; j++) {
                  var w = f.atoms[j],
                      A = a.distance(w),
                      q = a.angle(w) + g;
                  w.x = a.x + A * f.cos(q);
                  w.y = a.y - A * f.sin(q)
              }
              f.check()
          }
          this.lastGestureRotate = b.originalEvent.rotation
      }
      this.repaint()
  };
  b.gestureend = function() {
      this.lastPinchScale = 1;
      this.lastGestureRotate = 0
  }
})(ChemDoodle, ChemDoodle.monitor, ChemDoodle.structures, Math, ChemDoodle.lib.mat4);
(function(b) {
  b.ViewerCanvas = function(b, n, l) {
      b && this.create(b, n, l)
  };
  b.ViewerCanvas.prototype = new b._Canvas
})(ChemDoodle);
(function(b) {
  b._SpectrumCanvas = function(b, n, l) {
      b && this.create(b, n, l)
  };
  b = b._SpectrumCanvas.prototype = new b._Canvas;
  b.spectrum = void 0;
  b.emptyMessage = "No Spectrum Loaded or Recognized";
  b.loadMolecule = void 0;
  b.getMolecule = void 0;
  b.innerRepaint = function(b) {
      this.spectrum && 0 < this.spectrum.data.length ? this.spectrum.draw(b, this.specs, this.width, this.height) : this.emptyMessage && (b.fillStyle = "#737683", b.textAlign = "center", b.textBaseline = "middle", b.font = "18px Helvetica, Verdana, Arial, Sans-serif", b.fillText(this.emptyMessage,
          this.width / 2, this.height / 2))
  };
  b.loadSpectrum = function(b) {
      this.spectrum = b;
      this.repaint()
  };
  b.getSpectrum = function() {
      return this.spectrum
  };
  b.getSpectrumCoordinates = function(b, n) {
      return spectrum.getInternalCoordinates(b, n, this.width, this.height)
  }
})(ChemDoodle, document);
(function(b) {
  b.ObserverCanvas = function(b, n, l) {
      b && this.create(b, n, l)
  };
  b.ObserverCanvas.prototype = new b._SpectrumCanvas
})(ChemDoodle);
(function(b) {
  b.OverlayCanvas = function(b, n, l) {
      b && this.create(b, n, l)
  };
  b = b.OverlayCanvas.prototype = new b._SpectrumCanvas;
  b.overlaySpectra = [];
  b.superRepaint = b.innerRepaint;
  b.innerRepaint = function(b) {
      this.superRepaint(b);
      if (this.spectrum && 0 < this.spectrum.data.length)
          for (var n = 0, l = this.overlaySpectra.length; n < l; n++) {
              var h = this.overlaySpectra[n];
              h && 0 < h.data.length && (h.minX = this.spectrum.minX, h.maxX = this.spectrum.maxX, h.drawPlot(b, this.specs, this.width, this.height, this.spectrum.memory.offsetTop, this.spectrum.memory.offsetLeft,
                  this.spectrum.memory.offsetBottom))
          }
  };
  b.addSpectrum = function(b) {
      this.spectrum ? this.overlaySpectra.push(b) : this.spectrum = b
  }
})(ChemDoodle);
(function(b, j, n) {
  b.PerspectiveCanvas = function(b, e, g) {
      b && this.create(b, e, g)
  };
  var l = b.PerspectiveCanvas.prototype = new b._SpectrumCanvas;
  l.dragRange = void 0;
  l.rescaleYAxisOnZoom = !0;
  l.lastPinchScale = 1;
  l.mousedown = function(h) {
      this.dragRange = new b.structures.Point(h.p.x, h.p.x)
  };
  l.mouseup = function(b) {
      this.dragRange && this.dragRange.x !== this.dragRange.y && (this.dragRange.multi || (b = this.spectrum.zoom(this.dragRange.x, b.p.x, this.width, this.rescaleYAxisOnZoom), this.rescaleYAxisOnZoom && (this.specs.scale = b)), this.dragRange =
          void 0, this.repaint())
  };
  l.drag = function(b) {
      this.dragRange && (this.dragRange.multi ? this.dragRange = void 0 : (j.SHIFT && (this.spectrum.translate(b.p.x - this.dragRange.x, this.width), this.dragRange.x = b.p.x), this.dragRange.y = b.p.x), this.repaint())
  };
  l.drawChildExtras = function(b) {
      if (this.dragRange) {
          var e = n.min(this.dragRange.x, this.dragRange.y),
              g = n.max(this.dragRange.x, this.dragRange.y);
          b.strokeStyle = "grey";
          b.lineStyle = 1;
          b.beginPath();
          for (b.moveTo(e, this.height / 2); e <= g; e++) 5 > e % 10 ? b.lineTo(e, n.round(this.height /
              2)) : b.moveTo(e, n.round(this.height / 2));
          b.stroke()
      }
  };
  l.mousewheel = function(b, e) {
      this.specs.scale += e / 10;
      0.01 > this.specs.scale && (this.specs.scale = 0.01);
      this.repaint()
  };
  l.dblclick = function() {
      this.spectrum.setup();
      this.specs.scale = 1;
      this.repaint()
  };
  l.multitouchmove = function(h, e) {
      2 === e && (!this.dragRange || !this.dragRange.multi ? (this.dragRange = new b.structures.Point(h.p.x, h.p.x), this.dragRange.multi = !0) : (this.spectrum.translate(h.p.x - this.dragRange.x, this.width), this.dragRange.x = h.p.x, this.dragRange.y = h.p.x,
          this.repaint()))
  };
  l.gesturechange = function(b) {
      this.specs.scale *= b.originalEvent.scale / this.lastPinchScale;
      0.01 > this.specs.scale && (this.specs.scale = 0.01);
      this.lastPinchScale = b.originalEvent.scale;
      this.repaint()
  };
  l.gestureend = function() {
      this.lastPinchScale = 1
  }
})(ChemDoodle, ChemDoodle.monitor, Math);
(function(b, j, n) {
  b.SeekerCanvas = function(b, e, g, a) {
      b && this.create(b, e, g);
      this.seekType = a
  };
  var l = b.SeekerCanvas.prototype = new b._SpectrumCanvas;
  l.superRepaint = l.innerRepaint;
  l.innerRepaint = function(h) {
      this.superRepaint(h);
      if (this.spectrum && 0 < this.spectrum.data.length && this.p) {
          var e, g;
          if (this.seekType === b.SeekerCanvas.SEEK_POINTER) e = this.p, g = this.spectrum.getInternalCoordinates(e.x, e.y);
          else if (this.seekType === b.SeekerCanvas.SEEK_PLOT || this.seekType === b.SeekerCanvas.SEEK_PEAK) {
              g = this.seekType === b.SeekerCanvas.SEEK_PLOT ?
                  this.spectrum.getClosestPlotInternalCoordinates(this.p.x) : this.spectrum.getClosestPeakInternalCoordinates(this.p.x);
              if (!g) return;
              e = {
                  x: this.spectrum.getTransformedX(g.x, this.specs, this.width, this.spectrum.memory.offsetLeft),
                  y: this.spectrum.getTransformedY(g.y / 100, this.specs, this.height, this.spectrum.memory.offsetBottom, this.spectrum.memory.offsetTop)
              }
          }
          h.fillStyle = "white";
          h.strokeStyle = this.specs.plots_color;
          h.lineWidth = this.specs.plots_width;
          h.beginPath();
          h.arc(e.x, e.y, 3, 0, 2 * n.PI, !1);
          h.fill();
          h.stroke();
          h.font = j.getFontString(this.specs.text_font_size, this.specs.text_font_families);
          h.textAlign = "left";
          h.textBaseline = "bottom";
          g = "x:" + g.x.toFixed(3) + ", y:" + g.y.toFixed(3);
          var a = e.x + 3,
              d = h.measureText(g).width;
          a + d > this.width - 2 && (a -= 6 + d);
          e = e.y;
          0 > e - this.specs.text_font_size - 2 && (e += this.specs.text_font_size);
          h.fillRect(a, e - this.specs.text_font_size, d, this.specs.text_font_size);
          h.fillStyle = "black";
          h.fillText(g, a, e)
      }
  };
  l.mouseout = function() {
      this.p = void 0;
      this.repaint()
  };
  l.mousemove = function(b) {
      this.p = {
          x: b.p.x -
              2,
          y: b.p.y - 3
      };
      this.repaint()
  };
  l.touchstart = function(b) {
      this.mousemove(b)
  };
  l.touchmove = function(b) {
      this.mousemove(b)
  };
  l.touchend = function(b) {
      this.mouseout(b)
  };
  b.SeekerCanvas.SEEK_POINTER = "pointer";
  b.SeekerCanvas.SEEK_PLOT = "plot";
  b.SeekerCanvas.SEEK_PEAK = "peak"
})(ChemDoodle, ChemDoodle.extensions, Math);
(function(b, j, n, l, h, e, g, a, d, r, f, p) {
  b._Canvas3D = function(a, b, d) {
      a && this.create(a, b, d)
  };
  var o = b._Canvas3D.prototype = new b._Canvas;
  o.rotationMatrix = void 0;
  o.translationMatrix = void 0;
  o.lastPoint = void 0;
  o.emptyMessage = "WebGL is Unavailable!";
  o.lastPinchScale = 1;
  o.lastGestureRotate = 0;
  o.afterLoadContent = function() {
      for (var a = new n.Bounds, b = 0, e = this.molecules.length; b < e; b++) a.expand(this.molecules[b].getBounds3D());
      var h = f.dist([a.maxX, a.maxY, a.maxZ], [a.minX, a.minY, a.minZ]) / 2 + 1.5,
          b = 45,
          e = Math.tan(b / 360 * Math.PI) /
          0.8;
      this.depth = h / e;
      var e = g.max(this.depth - h, 0.1),
          h = this.depth + h,
          j = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
      1 > j && (b /= j);
      this.specs.projectionOrthoWidth_3D = 2 * (Math.tan(b / 360 * Math.PI) * this.depth) * j;
      this.specs.projectionPerspectiveVerticalFieldOfView_3D = b;
      this.specs.projectionFrontCulling_3D = e;
      this.specs.projectionBackCulling_3D = h;
      this.specs.projectionWidthHeightRatio_3D = j;
      this.translationMatrix = d.translate(d.identity([]), [0, 0, -this.depth]);
      this.maxDimension = g.max(a.maxX - a.minX, a.maxY - a.minY);
      this.setupScene()
  };
  o.setViewDistance = function(a) {
      this.specs.projectionPerspectiveVerticalFieldOfView_3D = n.clamp(this.specs.projectionPerspectiveVerticalFieldOfView_3D / a, 0.1, 179.9);
      this.specs.projectionOrthoWidth_3D = 2 * (g.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D / 360 * Math.PI) * this.depth) * this.specs.projectionWidthHeightRatio_3D;
      this.updateScene()
  };
  o.repaint = function() {
      if (this.gl) {
          this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
          this.gl.modelViewMatrix = d.multiply(this.translationMatrix,
              this.rotationMatrix, []);
          this.gl.rotationMatrix = this.rotationMatrix;
          var a = this.gl.getUniformLocation(this.gl.program, "u_projection_matrix");
          this.gl.uniformMatrix4fv(a, !1, this.gl.projectionMatrix);
          this.gl.fogging.setMode(this.specs.fog_mode_3D);
          for (var b = 0, e = this.molecules.length; b < e; b++) this.molecules[b].render(this.gl, this.specs);
          b = 0;
          for (e = this.shapes.length; b < e; b++) this.shapes[b].render(this.gl, this.specs);
          this.specs.compass_display && (this.gl.uniformMatrix4fv(a, !1, this.compass.projectionMatrix),
              this.compass.render(this.gl, this.specs), this.gl.setMatrixUniforms(this.gl.modelViewMatrix), this.gl.uniformMatrix4fv(a, !1, this.gl.projectionMatrix));
          this.gl.enable(this.gl.BLEND);
          this.gl.depthMask(!1);
          this.gl.enableVertexAttribArray(this.gl.shader.vertexTexCoordAttribute);
          this.specs.atoms_displayLabels_3D && this.label3D.render(this.gl, this.specs, this.getMolecules());
          this.specs.compass_display && this.specs.compass_displayText_3D && (this.gl.uniformMatrix4fv(a, !1, this.compass.projectionMatrix), this.compass.renderAxis(this.gl),
              this.gl.setMatrixUniforms(this.gl.modelViewMatrix), this.gl.uniformMatrix4fv(a, !1, this.gl.projectionMatrix));
          this.gl.disableVertexAttribArray(this.gl.shader.vertexTexCoordAttribute);
          this.gl.disable(this.gl.BLEND);
          this.gl.depthMask(!0);
          this.gl.disable(this.gl.DEPTH_TEST);
          this.drawChildExtras && this.drawChildExtras(this.gl);
          this.gl.enable(this.gl.DEPTH_TEST);
          this.gl.flush()
      }
  };
  o.pick = function(a, b, e, f) {
      if (this.gl) {
          d.multiply(this.translationMatrix, this.rotationMatrix, this.gl.modelViewMatrix);
          this.gl.rotationMatrix =
              this.rotationMatrix;
          var g = this.gl.getUniformLocation(this.gl.program, "u_projection_matrix");
          this.gl.uniformMatrix4fv(g, !1, this.gl.projectionMatrix);
          return this.picker.pick(this.gl, this.molecules, this.specs, a, this.height - b, e, f)
      }
  };
  o.center = function() {
      for (var a = new l.Atom, b = 0, d = this.molecules.length; b < d; b++) {
          var e = this.molecules[b];
          a.add3D(e.getCenter3D())
      }
      a.x /= this.molecules.length;
      a.y /= this.molecules.length;
      b = 0;
      for (d = this.molecules.length; b < d; b++) {
          for (var e = this.molecules[b], f = 0, g = e.atoms.length; f <
              g; f++) e.atoms[f].sub3D(a);
          if (e.chains && e.fromJSON) {
              f = 0;
              for (g = e.chains.length; f < g; f++)
                  for (var h = e.chains[f], j = 0, n = h.length; j < n; j++) {
                      var c = h[j];
                      c.cp1.sub3D(a);
                      c.cp2.sub3D(a);
                      c.cp3 && (c.cp3.sub3D(a), c.cp4.sub3D(a), c.cp5.sub3D(a))
                  }
          }
      }
  };
  o.subCreate = function() {
      try {
          var b = a.getElementById(this.id);
          this.gl = b.getContext("webgl");
          this.gl || (this.gl = b.getContext("experimental-webgl"))
      } catch (e) {}
      this.gl ? (this.rotationMatrix = d.identity([]), this.translationMatrix = d.identity([]), this.gl.viewport(0, 0, this.width, this.height),
          this.gl.program = this.gl.createProgram(), this.gl.shader = new h.Shader, this.gl.shader.init(this.gl), this.gl.programLabel = this.gl.createProgram(), this.setupScene()) : this.displayMessage()
  };
  b._Canvas.prototype.displayMessage = function() {
      var b = a.getElementById(this.id);
      b.getContext && (b = b.getContext("2d"), this.specs.backgroundColor && (b.fillStyle = this.specs.backgroundColor, b.fillRect(0, 0, this.width, this.height)), this.emptyMessage && (b.fillStyle = "#737683", b.textAlign = "center", b.textBaseline = "middle", b.font = "18px Helvetica, Verdana, Arial, Sans-serif",
          b.fillText(this.emptyMessage, this.width / 2, this.height / 2)))
  };
  o.renderText = function(a, b) {
      if (this.gl) {
          var d = {
              position: [],
              texCoord: [],
              translation: []
          };
          this.gl.textImage.pushVertexData(a, b, 0, d);
          this.gl.textMesh.storeData(this.gl, d.position, d.texCoord, d.translation);
          this.gl.enable(this.gl.BLEND);
          this.gl.depthMask(!1);
          this.gl.enableVertexAttribArray(this.gl.shader.vertexTexCoordAttribute);
          this.gl.textImage.useTexture(this.gl);
          this.gl.textMesh.render(this.gl);
          this.gl.disableVertexAttribArray(this.gl.shader.vertexTexCoordAttribute);
          this.gl.disable(this.gl.BLEND);
          this.gl.depthMask(!0)
      }
  };
  o.setupScene = function() {
      if (this.gl) {
          p("#" + this.id).css("background-color", this.specs.backgroundColor);
          var a = n.getRGB(this.specs.backgroundColor, 1);
          this.gl.clearColor(a[0], a[1], a[2], 1);
          this.gl.clearDepth(1);
          this.gl.enable(this.gl.DEPTH_TEST);
          this.gl.depthFunc(this.gl.LEQUAL);
          this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
          this.specs.cullBackFace_3D && this.gl.enable(this.gl.CULL_FACE);
          this.gl.sphereBuffer = new h.Sphere(1, this.specs.atoms_resolution_3D, this.specs.atoms_resolution_3D);
          this.gl.starBuffer = new h.Star;
          this.gl.cylinderBuffer = new h.Cylinder(1, 1, this.specs.bonds_resolution_3D);
          this.gl.pillBuffer = new h.Pill(this.specs.bonds_pillDiameter_3D / 2, this.specs.bonds_pillHeight_3D, this.specs.bonds_pillLatitudeResolution_3D, this.specs.bonds_pillLongitudeResolution_3D);
          this.gl.lineBuffer = new h.Line;
          this.gl.lineArrowBuffer = new h.LineArrow;
          this.gl.arrowBuffer = new h.Arrow(0.3, this.specs.compass_resolution_3D);
          this.gl.textMesh = new h.TextMesh;
          this.gl.textMesh.init(this.gl);
          this.gl.textImage = new h.TextImage;
          this.gl.textImage.init(this.gl);
          this.gl.textImage.updateFont(this.gl, this.specs.text_font_size, this.specs.text_font_families, this.specs.text_font_bold, this.specs.text_font_italic, this.specs.text_font_stroke_3D);
          this.label3D = new h.Label;
          this.label3D.init(this.gl, this.specs);
          for (var o = 0, q = this.molecules.length; o < q; o++)
              if (a = this.molecules[o], a.labelMesh instanceof h.TextMesh || (a.labelMesh = new h.TextMesh,
                      a.labelMesh.init(this.gl)), a.unitCellVectors && (a.unitCell = new h.UnitCell(a.unitCellVectors)), a.chains) {
                  a.ribbons = [];
                  a.cartoons = [];
                  a.tubes = [];
                  for (var t = 0, u = a.chains.length; t < u; t++) {
                      var v = a.chains[t],
                          z = 2 < v.length && e[v[2].name] && "#BEA06E" === e[v[2].name].aminoColor;
                      if (0 < v.length && !v[0].lineSegments) {
                          for (var y = 0, B = v.length - 1; y < B; y++) v[y].setup(v[y + 1].cp1, z ? 1 : this.specs.proteins_horizontalResolution);
                          if (!z) {
                              y = 1;
                              for (B = v.length - 1; y < B; y++) j.vec3AngleFrom(v[y - 1].D, v[y].D) > g.PI / 2 && (v[y].guidePointsSmall.reverse(),
                                  v[y].guidePointsLarge.reverse(), f.scale(v[y].D, -1))
                          }
                          y = 1;
                          for (B = v.length - 3; y < B; y++) v[y].computeLineSegments(v[y - 1], v[y + 1], v[y + 2], !z, z ? this.specs.nucleics_verticalResolution : this.specs.proteins_verticalResolution);
                          v.pop();
                          v.pop();
                          v.pop();
                          v.shift()
                      }
                      var y = n.hsl2rgb(1 === u ? 0.5 : t / u, 1, 0.5),
                          c = "rgb(" + y[0] + "," + y[1] + "," + y[2] + ")";
                      v.chainColor = c;
                      if (z) y = new h.Tube(v, this.specs.nucleics_tubeThickness, this.specs.nucleics_tubeResolution_3D), y.chainColor = c, a.tubes.push(y);
                      else {
                          z = {
                              front: new h.Ribbon(v, this.specs.proteins_ribbonThickness,
                                  !1),
                              back: new h.Ribbon(v, -this.specs.proteins_ribbonThickness, !1)
                          };
                          z.front.chainColor = c;
                          z.back.chainColor = c;
                          y = 0;
                          for (B = z.front.segments.length; y < B; y++) z.front.segments[y].chainColor = c;
                          y = 0;
                          for (B = z.back.segments.length; y < B; y++) z.back.segments[y].chainColor = c;
                          a.ribbons.push(z);
                          v = {
                              front: new h.Ribbon(v, this.specs.proteins_ribbonThickness, !0),
                              back: new h.Ribbon(v, -this.specs.proteins_ribbonThickness, !0)
                          };
                          v.front.chainColor = c;
                          v.back.chainColor = c;
                          y = 0;
                          for (B = v.front.segments.length; y < B; y++) v.front.segments[y].chainColor =
                              c;
                          y = 0;
                          for (B = v.back.segments.length; y < B; y++) v.back.segments[y].chainColor = c;
                          y = 0;
                          for (B = v.front.cartoonSegments.length; y < B; y++) v.front.cartoonSegments[y].chainColor = c;
                          y = 0;
                          for (B = v.back.cartoonSegments.length; y < B; y++) v.back.cartoonSegments[y].chainColor = c;
                          a.cartoons.push(v)
                      }
                  }
              } this.label3D.updateVerticesBuffer(this.gl, this.getMolecules(), this.specs);
          if (this instanceof b.MovieCanvas3D && this.frames) {
              y = 0;
              for (B = this.frames.length; y < B; y++) {
                  o = this.frames[y];
                  t = 0;
                  for (u = o.mols.length; t < u; t++) a = o.mols[t], a.labelMesh instanceof
                  l.d3.TextMesh || (a.labelMesh = new l.d3.TextMesh, a.labelMesh.init(this.gl));
                  this.label3D.updateVerticesBuffer(this.gl, o.mols, this.specs)
              }
          }
          this.gl.lighting = new h.Light(this.specs.lightDiffuseColor_3D, this.specs.lightSpecularColor_3D, this.specs.lightDirection_3D);
          this.gl.lighting.lightScene(this.gl);
          this.gl.material = new h.Material(this.gl);
          this.gl.fogging = new h.Fog(this.gl);
          this.gl.fogging.setTempParameter(this.specs.fog_color_3D || this.specs.backgroundColor, this.specs.fog_start_3D, this.specs.fog_end_3D,
              this.specs.fog_density_3D);
          this.compass = new h.Compass(this.gl, this.specs);
          a = this.width / this.height;
          this.specs.projectionWidthHeightRatio_3D && (a = this.specs.projectionWidthHeightRatio_3D);
          this.gl.projectionMatrix = this.specs.projectionPerspective_3D ? d.perspective(this.specs.projectionPerspectiveVerticalFieldOfView_3D, a, this.specs.projectionFrontCulling_3D, this.specs.projectionBackCulling_3D) : d.ortho(-this.specs.projectionOrthoWidth_3D / 2, this.specs.projectionOrthoWidth_3D / 2, -this.specs.projectionOrthoWidth_3D /
              2 / a, this.specs.projectionOrthoWidth_3D / 2 / a, this.specs.projectionFrontCulling_3D, this.specs.projectionBackCulling_3D);
          a = this.gl.getUniformLocation(this.gl.program, "u_projection_matrix");
          this.gl.uniformMatrix4fv(a, !1, this.gl.projectionMatrix);
          var k = this.gl.getUniformLocation(this.gl.program, "u_model_view_matrix"),
              C = this.gl.getUniformLocation(this.gl.program, "u_normal_matrix");
          this.gl.setMatrixUniforms = function(a) {
              this.uniformMatrix4fv(k, !1, a);
              a = r.transpose(d.toInverseMat3(a, []));
              this.uniformMatrix3fv(C,
                  !1, a)
          };
          t = this.gl.getUniformLocation(this.gl.program, "u_dimension");
          this.gl.uniformMatrix4fv(a, !1, this.gl.projectionMatrix);
          this.gl.uniform2f(t, this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
          this.picker = new h.Picker;
          this.picker.init(this.gl);
          this.picker.setDimension(this.gl, this.width, this.height)
      }
  };
  o.updateScene = function() {
      this.gl.fogging.setTempParameter(this.specs.fog_color_3D || this.specs.backgroundColor, this.specs.fog_start_3D, this.specs.fog_end_3D, this.specs.fog_density_3D);
      var a = this.width /
          this.height;
      this.specs.projectionWidthHeightRatio_3D && (a = this.specs.projectionWidthHeightRatio_3D);
      this.gl.projectionMatrix = this.specs.projectionPerspective_3D ? d.perspective(this.specs.projectionPerspectiveVerticalFieldOfView_3D, a, this.specs.projectionFrontCulling_3D, this.specs.projectionBackCulling_3D) : d.ortho(-this.specs.projectionOrthoWidth_3D / 2, this.specs.projectionOrthoWidth_3D / 2, -this.specs.projectionOrthoWidth_3D / 2 / a, this.specs.projectionOrthoWidth_3D / 2 / a, this.specs.projectionFrontCulling_3D,
          this.specs.projectionBackCulling_3D);
      this.repaint()
  };
  o.mousedown = function(a) {
      this.lastPoint = a.p
  };
  o.mouseup = function() {
      this.lastPoint = void 0
  };
  o.rightmousedown = function(a) {
      this.lastPoint = a.p
  };
  o.drag = function(a) {
      if (this.lastPoint) {
          if (b.monitor.ALT) {
              var e = new l.Point(a.p.x, a.p.y);
              e.sub(this.lastPoint);
              var f = g.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D / 360 * g.PI),
                  f = this.depth / (this.height / 2 / f);
              d.translate(this.translationMatrix, [e.x * f, -e.y * f, 0])
          } else f = a.p.x - this.lastPoint.x, e = a.p.y - this.lastPoint.y,
              f = d.rotate(d.identity([]), f * g.PI / 180, [0, 1, 0]), d.rotate(f, e * g.PI / 180, [1, 0, 0]), this.rotationMatrix = d.multiply(f, this.rotationMatrix);
          this.lastPoint = a.p;
          this.repaint()
      }
  };
  o.mousewheel = function(a, b) {
      var d = this.specs.projectionPerspectiveVerticalFieldOfView_3D + b;
      this.specs.projectionPerspectiveVerticalFieldOfView_3D = 0.1 > d ? 0.1 : 179.9 < d ? 179.9 : d;
      this.specs.projectionOrthoWidth_3D = 2 * (Math.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D / 360 * Math.PI) * this.depth) * this.specs.projectionWidthHeightRatio_3D;
      this.updateScene()
  };
  o.multitouchmove = function(a, b) {
      if (2 === b)
          if (this.lastPoint.multi) {
              var e = new l.Point(a.p.x, a.p.y);
              e.sub(this.lastPoint);
              var f = g.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D / 360 * g.PI),
                  f = this.depth / (this.height / 2 / f);
              d.translate(this.translationMatrix, [e.x * f, -e.y * f, 0]);
              this.lastPoint = a.p;
              this.repaint()
          } else this.lastPoint = a.p, this.lastPoint.multi = !0
  };
  o.gesturechange = function(a) {
      if (0 !== a.originalEvent.scale - this.lastPinchScale) {
          var b = this.specs.projectionPerspectiveVerticalFieldOfView_3D +
              30 * -(a.originalEvent.scale / this.lastPinchScale - 1);
          this.specs.projectionPerspectiveVerticalFieldOfView_3D = 0.1 > b ? 0.1 : 179.9 < b ? 179.9 : b;
          this.specs.projectionOrthoWidth_3D = 2 * (Math.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D / 360 * Math.PI) * this.depth) * this.specs.projectionWidthHeightRatio_3D;
          this.updateScene();
          this.lastPinchScale = a.originalEvent.scale
      }
      this.repaint()
  };
  o.gestureend = function() {
      this.lastPinchScale = 1;
      this.lastGestureRotate = 0
  }
})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.math, ChemDoodle.structures,
  ChemDoodle.structures.d3, ChemDoodle.RESIDUE, Math, document, ChemDoodle.lib.mat4, ChemDoodle.lib.mat3, ChemDoodle.lib.vec3, ChemDoodle.lib.jQuery, window);
(function(b, j, n, l) {
  b.MolGrabberCanvas3D = function(b, e, g) {
      b && this.create(b, e, g);
      e = [];
      e.push('\x3cbr\x3e\x3cinput type\x3d"text" id\x3d"');
      e.push(b);
      e.push('_query" size\x3d"32" value\x3d"" /\x3e');
      e.push("\x3cbr\x3e\x3cnobr\x3e");
      e.push('\x3cselect id\x3d"');
      e.push(b);
      e.push('_select"\x3e');
      e.push('\x3coption value\x3d"pubchem" selected\x3ePubChem');
      e.push("\x3c/select\x3e");
      e.push('\x3cbutton id\x3d"');
      e.push(b);
      e.push('_submit"\x3eShow Molecule\x3c/button\x3e');
      e.push("\x3c/nobr\x3e");
      l.writeln(e.join(""));
      var a = this;
      n("#" + b + "_submit").click(function() {
          a.search()
      });
      n("#" + b + "_query").keypress(function(b) {
          13 === b.which && a.search()
      })
  };
  b = b.MolGrabberCanvas3D.prototype = new b._Canvas3D;
  b.setSearchTerm = function(b) {
      n("#" + this.id + "_query").val(b);
      this.search()
  };
  b.search = function() {
      var b = this;
      j.getMoleculeFromDatabase(n("#" + this.id + "_query").val(), {
          database: n("#" + this.id + "_select").val(),
          dimension: 3
      }, function(e) {
          b.loadMolecule(e)
      })
  }
})(ChemDoodle, ChemDoodle.iChemLabs, ChemDoodle.lib.jQuery, document);
(function(b, j) {
  b.MovieCanvas3D = function(b, h, e) {
      b && this.create(b, h, e);
      this.frames = []
  };
  b.MovieCanvas3D.PLAY_ONCE = 0;
  b.MovieCanvas3D.PLAY_LOOP = 1;
  b.MovieCanvas3D.PLAY_SPRING = 2;
  var n = b.MovieCanvas3D.prototype = new b._Canvas3D;
  n.timeout = 50;
  n.frameNumber = 0;
  n.playMode = 2;
  n.reverse = !1;
  n.startAnimation = b._AnimatorCanvas.prototype.startAnimation;
  n.stopAnimation = b._AnimatorCanvas.prototype.stopAnimation;
  n.isRunning = b._AnimatorCanvas.prototype.isRunning;
  n.dblclick = b.RotatorCanvas.prototype.dblclick;
  n.nextFrame = function() {
      var b =
          this.frames[this.frameNumber];
      this.molecules = b.mols;
      this.shapes = b.shapes;
      2 === this.playMode && this.reverse ? (this.frameNumber--, 0 > this.frameNumber && (this.frameNumber = 1, this.reverse = !1)) : (this.frameNumber++, this.frameNumber >= this.frames.length && (2 === this.playMode ? (this.frameNumber -= 2, this.reverse = !0) : (this.frameNumber = 0, 0 === this.playMode && this.stopAnimation())))
  };
  n.center = function() {
      for (var b = new j.Atom, h = this.frames[0], e = 0, g = h.mols.length; e < g; e++) b.add3D(h.mols[e].getCenter3D());
      b.x /= h.mols.length;
      b.y /=
          h.mols.length;
      h = new j.Atom;
      h.sub3D(b);
      for (var b = 0, a = this.frames.length; b < a; b++)
          for (var d = this.frames[b], e = 0, g = d.mols.length; e < g; e++)
              for (var n = d.mols[e], f = 0, p = n.atoms.length; f < p; f++) n.atoms[f].add3D(h)
  };
  n.addFrame = function(b, h) {
      this.frames.push({
          mols: b,
          shapes: h
      })
  }
})(ChemDoodle, ChemDoodle.structures);
(function(b, j, n) {
  var l = [],
      h = [1, 0, 0],
      e = [0, 1, 0],
      g = [0, 0, 1];
  b.RotatorCanvas3D = function(a, b, e) {
      a && this.create(a, b, e)
  };
  var a = b.RotatorCanvas3D.prototype = new b._Canvas3D;
  a.timeout = 33;
  j = j.PI / 15;
  a.xIncrement = j;
  a.yIncrement = j;
  a.zIncrement = j;
  a.startAnimation = b._AnimatorCanvas.prototype.startAnimation;
  a.stopAnimation = b._AnimatorCanvas.prototype.stopAnimation;
  a.isRunning = b._AnimatorCanvas.prototype.isRunning;
  a.dblclick = b.RotatorCanvas.prototype.dblclick;
  a.mousedown = void 0;
  a.rightmousedown = void 0;
  a.drag = void 0;
  a.mousewheel = void 0;
  a.nextFrame = function(a) {
      0 === this.molecules.length && 0 === this.shapes.length ? this.stopAnimation() : (n.identity(l), a /= 1E3, n.rotate(l, this.xIncrement * a, h), n.rotate(l, this.yIncrement * a, e), n.rotate(l, this.zIncrement * a, g), n.multiply(this.rotationMatrix, l))
  }
})(ChemDoodle, Math, ChemDoodle.lib.mat4);
(function(b) {
  b.TransformCanvas3D = function(b, n, l) {
      b && this.create(b, n, l)
  };
  b.TransformCanvas3D.prototype = new b._Canvas3D
})(ChemDoodle);
(function(b) {
  b.ViewerCanvas3D = function(b, n, l) {
      b && this.create(b, n, l)
  };
  b = b.ViewerCanvas3D.prototype = new b._Canvas3D;
  b.mousedown = void 0;
  b.rightmousedown = void 0;
  b.drag = void 0;
  b.mousewheel = void 0
})(ChemDoodle);
(function(b, j, n) {
  function l(b, g, a, d) {
      this.element = b;
      this.x = g;
      this.y = a;
      this.dimension = d
  }
  b.PeriodicTableCanvas = function(b, g) {
      this.padding = 5;
      b && this.create(b, 18 * g + 2 * this.padding, 10 * g + 2 * this.padding);
      this.cellDimension = g ? g : 20;
      this.setupTable();
      this.repaint()
  };
  var h = b.PeriodicTableCanvas.prototype = new b._Canvas;
  h.loadMolecule = void 0;
  h.getMolecule = void 0;
  h.getHoveredElement = function() {
      if (this.hovered) return this.hovered.element
  };
  h.innerRepaint = function(b) {
      for (var g = 0, a = this.cells.length; g < a; g++) this.drawCell(b,
          this.specs, this.cells[g]);
      this.hovered && this.drawCell(b, this.specs, this.hovered);
      this.selected && this.drawCell(b, this.specs, this.selected)
  };
  h.setupTable = function() {
      this.cells = [];
      for (var e = this.padding, g = this.padding, a = 0, d = 0, h = b.SYMBOLS.length; d < h; d++) {
          18 === a && (a = 0, g += this.cellDimension, e = this.padding);
          var f = b.ELEMENT[b.SYMBOLS[d]];
          if (2 === f.atomicNumber) e += 16 * this.cellDimension, a += 16;
          else if (5 === f.atomicNumber || 13 === f.atomicNumber) e += 10 * this.cellDimension, a += 10;
          if ((58 > f.atomicNumber || 71 < f.atomicNumber &&
                  90 > f.atomicNumber || 103 < f.atomicNumber) && 113 > f.atomicNumber) this.cells.push(new l(f, e, g, this.cellDimension)), e += this.cellDimension, a++
      }
      g += 2 * this.cellDimension;
      e = 3 * this.cellDimension + this.padding;
      for (d = 57; 104 > d; d++)
          if (f = b.ELEMENT[b.SYMBOLS[d]], 90 === f.atomicNumber && (g += this.cellDimension, e = 3 * this.cellDimension + this.padding), 58 <= f.atomicNumber && 71 >= f.atomicNumber || 90 <= f.atomicNumber && 103 >= f.atomicNumber) this.cells.push(new l(f, e, g, this.cellDimension)), e += this.cellDimension
  };
  h.drawCell = function(b, g, a) {
      var d =
          b.createRadialGradient(a.x + a.dimension / 3, a.y + a.dimension / 3, 1.5 * a.dimension, a.x + a.dimension / 3, a.y + a.dimension / 3, a.dimension / 10);
      d.addColorStop(0, "#000000");
      d.addColorStop(0.7, a.element.jmolColor);
      d.addColorStop(1, "#FFFFFF");
      b.fillStyle = d;
      j.contextRoundRect(b, a.x, a.y, a.dimension, a.dimension, a.dimension / 8);
      if (a === this.hovered || a === this.selected) b.lineWidth = 2, b.strokeStyle = "#c10000", b.stroke(), b.fillStyle = "white";
      b.fill();
      b.font = j.getFontString(g.text_font_size, g.text_font_families);
      b.fillStyle = g.text_color;
      b.textAlign = "center";
      b.textBaseline = "middle";
      b.fillText(a.element.symbol, a.x + a.dimension / 2, a.y + a.dimension / 2)
  };
  h.click = function() {
      this.hovered && (this.selected = this.hovered, this.repaint())
  };
  h.touchstart = function(b) {
      this.mousemove(b)
  };
  h.mousemove = function(b) {
      var g = b.p.x;
      b = b.p.y;
      this.hovered = void 0;
      for (var a = 0, d = this.cells.length; a < d; a++) {
          var h = this.cells[a];
          if (n.isBetween(g, h.x, h.x + h.dimension) && n.isBetween(b, h.y, h.y + h.dimension)) {
              this.hovered = h;
              break
          }
      }
      this.repaint()
  };
  h.mouseout = function() {
      this.hovered =
          void 0;
      this.repaint()
  }
})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.math, document);
(function(b, j, n) {
  b.png = {};
  b.png.create = function(b) {
      n.open(j.getElementById(b.id).toDataURL("image/png"))
  }
})(ChemDoodle.io, document, window);
(function(b, j) {
  b.file = {};
  b.file.content = function(b, l) {
      j.get(b, "", l)
  }
})(ChemDoodle.io, ChemDoodle.lib.jQuery);
(function(b, j, n, l, h, e) {
  j.SERVER_URL = "http://ichemlabs.cloud.chemdoodle.com/icl_cdc_v060001/WebHQ";
  j.inRelay = !1;
  j.asynchronous = !0;
  j.INFO = {
      userAgent: navigator.userAgent,
      v_cwc: b.getVersion(),
      v_jQuery: h.version,
      v_jQuery_ui: h.ui ? h.ui.version : "N/A"
  };
  var g = new n.JSONInterpreter,
      a = new l.Queue;
  j.useHTTPS = function() {
      j.SERVER_URL = "https" + j.SERVER_URL.substr(4)
  };
  j._contactServer = function(b, e, f, g, l) {
      /*this.inRelay ? a.enqueue({
          call: b,
          content: e,
          options: f,
          callback: g,
          errorback: l
      }) : (j.inRelay = !0, h.ajax({
          dataType: "text",
          type: "POST",
          data: JSON.stringify({
              call: b,
              content: e,
              options: f,
              info: j.INFO
          }),
          url: this.SERVER_URL,
          success: function(b) {
              b = JSON.parse(b);
              b.message && alert(b.message);
              j.inRelay = !1;
              g && (b.content && !b.stop) && g(b.content);
              b.stop && l && l();
              a.isEmpty() || (b = a.dequeue(), j.contactServer(b.call, b.content, b.options, b.callback, b.errorback))
          },
          error: function() {
              "checkForUpdates" != b && alert("Call failed. Please try again. If you continue to see this message, please contact iChemLabs customer support.");
              j.inRelay = !1;
              l && l();
              if (!a.isEmpty()) {
                  var e =
                      a.dequeue();
                  j.contactServer(e.call, e.content, e.options, e.callback, e.errorback)
              }
          },
          xhrFields: {
              withCredentials: !0
          },
          async: j.asynchronous
      }))*/
  };
  j.authenticate = function(a, b, e, g) {
      this._contactServer("authenticate", {
          credential: a
      }, b, function(a) {
          e(a)
      }, g)
  };
  j.calculate = function(a, b, e, h) {
      this._contactServer("calculate", {
          mol: g.molTo(a)
      }, b, function(a) {
          e(a)
      }, h)
  };
  j.createLewisDotStructure = function(a, b, e, h) {
      this._contactServer("createLewisDot", {
          mol: g.molTo(a)
      }, b, function(a) {
          e(g.molFrom(a.mol))
      }, h)
  };
  j.generateImage = function(a,
      b, e, h) {
      this._contactServer("generateImage", {
          mol: g.molTo(a)
      }, b, function(a) {
          e(a.link)
      }, h)
  };
  j.generateIUPACName = function(a, b, e, h) {
      this._contactServer("generateIUPACName", {
          mol: g.molTo(a)
      }, b, function(a) {
          e(a.iupac)
      }, h)
  };
  j.getAd = function(a, b) {
      this._contactServer("getAd", {}, {}, function(b) {
          a(b.image_url, b.target_url)
      }, b)
  };
  j.getMoleculeFromContent = function(a, b, e, h) {
      this._contactServer("getMoleculeFromContent", {
          content: a
      }, b, function(a) {
          for (var b = !1, d = 0, h = a.mol.a.length; d < h; d++)
              if (0 !== a.mol.a[d].z) {
                  b = !0;
                  break
              } if (b) {
              d =
                  0;
              for (h = a.mol.a.length; d < h; d++) a.mol.a[d].x /= 20, a.mol.a[d].y /= 20, a.mol.a[d].z /= 20
          }
          e(g.molFrom(a.mol))
      }, h)
  };
  j.getMoleculeFromDatabase = function(a, b, e, h) {
      this._contactServer("getMoleculeFromDatabase", {
          query: a
      }, b, function(a) {
          if (3 === b.dimension)
              for (var d = 0, h = a.mol.a.length; d < h; d++) a.mol.a[d].x /= 20, a.mol.a[d].y /= -20, a.mol.a[d].z /= 20;
          e(g.molFrom(a.mol))
      }, h)
  };
  j.getOptimizedPDBStructure = function(a, b, e, h) {
      this._contactServer("getOptimizedPDBStructure", {
          id: a
      }, b, function(a) {
          var b;
          b = a.mol ? g.molFrom(a.mol) : new l.Molecule;
          b.chains = g.chainsFrom(a.ribbons);
          b.fromJSON = !0;
          e(b)
      }, h)
  };
  j.getZeoliteFromIZA = function(a, b, e, g) {
      this._contactServer("getZeoliteFromIZA", {
          query: a
      }, b, function(a) {
          e(ChemDoodle.readCIF(a.cif, b.xSuper, b.ySuper, b.zSuper))
      }, g)
  };
  j.isGraphIsomorphism = function(a, b, e, h, j) {
      this._contactServer("isGraphIsomorphism", {
          arrow: g.molTo(a),
          target: g.molTo(b)
      }, e, function(a) {
          h(a.value)
      }, j)
  };
  j.isSubgraphIsomorphism = function(a, b, e, h, j) {
      this._contactServer("isSubgraphIsomorphism", {
              arrow: g.molTo(a),
              target: g.molTo(b)
          }, e, function(a) {
              h(a.value)
          },
          j)
  };
  j.kekulize = function(a, b, e, h) {
      this._contactServer("kekulize", {
          mol: g.molTo(a)
      }, b, function(a) {
          e(g.molFrom(a.mol))
      }, h)
  };
  j.optimize = function(a, b, e, h) {
      this._contactServer("optimize", {
          mol: g.molTo(a)
      }, b, function(h) {
          h = g.molFrom(h.mol);
          if (2 === b.dimension) {
              for (var j = 0, l = h.atoms.length; j < l; j++) a.atoms[j].x = h.atoms[j].x, a.atoms[j].y = h.atoms[j].y;
              e()
          } else if (3 === b.dimension) {
              j = 0;
              for (l = h.atoms.length; j < l; j++) h.atoms[j].x /= 20, h.atoms[j].y /= -20, h.atoms[j].z /= 20;
              e(h)
          }
      }, h)
  };
  j.readIUPACName = function(a, b, e, h) {
      this._contactServer("readIUPACName", {
          iupac: a
      }, b, function(a) {
          e(g.molFrom(a.mol))
      }, h)
  };
  j.readSMILES = function(a, b, e, h) {
      this._contactServer("readSMILES", {
          smiles: a
      }, b, function(a) {
          e(g.molFrom(a.mol))
      }, h)
  };
  j.saveFile = function(a, b, e, h) {
      this._contactServer("saveFile", {
          mol: g.molTo(a)
      }, b, function(a) {
          e(a.link)
      }, h)
  };
  j.simulate13CNMR = function(a, e, f, h) {
      e.nucleus = "C";
      e.isotope = 13;
      this._contactServer("simulateNMR", {
          mol: g.molTo(a)
      }, e, function(a) {
          f(b.readJCAMP(a.jcamp))
      }, h)
  };
  j.simulate1HNMR = function(a, e, f, h) {
      e.nucleus = "H";
      e.isotope = 1;
      this._contactServer("simulateNMR", {
          mol: g.molTo(a)
      }, e, function(a) {
          f(b.readJCAMP(a.jcamp))
      }, h)
  };
  j.simulateMassParentPeak = function(a, e, f, h) {
      this._contactServer("simulateMassParentPeak", {
          mol: g.molTo(a)
      }, e, function(a) {
          f(b.readJCAMP(a.jcamp))
      }, h)
  };
  j.writeSMILES = function(a, b, e, h) {
      this._contactServer("writeSMILES", {
          mol: g.molTo(a)
      }, b, function(a) {
          e(a.smiles)
      }, h)
  };
  j.version = function(a, b, e) {
      this._contactServer("version", {}, a, function(a) {
          b(a.value)
      }, e)
  };
  j.checkForUpdates = function(a) {
      this._contactServer("checkForUpdates", {
              value: e.href
          }, a, function() {},
          function() {})
  }
})(ChemDoodle, ChemDoodle.iChemLabs, ChemDoodle.io, ChemDoodle.structures, ChemDoodle.lib.jQuery, location);
