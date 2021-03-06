!function() {
    var require, a, b = "2.9.0-0-g83dc4bd";
    !function() {
        function b(module) {
            var a = module.factory
              , b = function(a) {
                var b = a;
                return "." === a.charAt(0) && (b = module.id.slice(0, module.id.lastIndexOf(f)) + f + a.slice(2)),
                require(b)
            };
            return module.exports = {},
            delete module.factory,
            a(b, module.exports, module),
            module.exports
        }
        var c = {}
          , d = []
          , e = {}
          , f = ".";
        require = function(a) {
            if (!c[a])
                throw "module " + a + " not found";
            if (a in e) {
                var f = d.slice(e[a]).join("->") + "->" + a;
                throw "Cycle in require graph: " + f
            }
            if (c[a].factory)
                try {
                    return e[a] = d.length,
                    d.push(a),
                    b(c[a])
                } finally {
                    delete e[a],
                    d.pop()
                }
            return c[a].exports
        }
        ,
        a = function(a, b) {
            if (c[a])
                throw "module " + a + " already defined";
            c[a] = {
                id: a,
                factory: b
            }
        }
        ,
        a.remove = function(a) {
            delete c[a]
        }
        ,
        a.moduleMap = c
    }(),
    "object" == typeof module && "function" == typeof require && (module.exports.require = require,
    module.exports.define = a),
    a("cordova", function(require, exports, module) {
        function b(a, b) {
            var c = document.createEvent("Events");
            if (c.initEvent(a, !1, !1),
            b)
                for (var d in b)
                    b.hasOwnProperty(d) && (c[d] = b[d]);
            return c
        }
        var c = require("cordova/channel");
        document.addEventListener("DOMContentLoaded", function() {
            c.onDOMContentLoaded.fire()
        }, !1),
        ("complete" == document.readyState || "interactive" == document.readyState) && c.onDOMContentLoaded.fire();
        var d = document.addEventListener
          , e = document.removeEventListener
          , f = window.addEventListener
          , g = window.removeEventListener
          , h = {}
          , i = {};
        document.addEventListener = function(a, b, c) {
            var e = a.toLowerCase();
            "undefined" != typeof h[e] ? h[e].subscribe(b) : d.call(document, a, b, c)
        }
        ,
        window.addEventListener = function(a, b, c) {
            var d = a.toLowerCase();
            "undefined" != typeof i[d] ? i[d].subscribe(b) : f.call(window, a, b, c)
        }
        ,
        document.removeEventListener = function(a, b, c) {
            var d = a.toLowerCase();
            "undefined" != typeof h[d] ? h[d].unsubscribe(b) : e.call(document, a, b, c)
        }
        ,
        window.removeEventListener = function(a, b, c) {
            var d = a.toLowerCase();
            "undefined" != typeof i[d] ? i[d].unsubscribe(b) : g.call(window, a, b, c)
        }
        ,
        "undefined" == typeof window.console && (window.console = {
            log: function() {}
        });
        var j = {
            define: a,
            require: require,
            addWindowEventHandler: function(a) {
                return i[a] = c.create(a)
            },
            addStickyDocumentEventHandler: function(a) {
                return h[a] = c.createSticky(a)
            },
            addDocumentEventHandler: function(a) {
                return h[a] = c.create(a)
            },
            removeWindowEventHandler: function(a) {
                delete i[a]
            },
            removeDocumentEventHandler: function(a) {
                delete h[a]
            },
            getOriginalHandlers: function() {
                return {
                    document: {
                        addEventListener: d,
                        removeEventListener: e
                    },
                    window: {
                        addEventListener: f,
                        removeEventListener: g
                    }
                }
            },
            fireDocumentEvent: function(a, c, d) {
                var e = b(a, c);
                "undefined" != typeof h[a] ? d ? h[a].fire(e) : setTimeout(function() {
                    "deviceready" == a && document.dispatchEvent(e),
                    h[a].fire(e)
                }, 0) : document.dispatchEvent(e)
            },
            fireWindowEvent: function(a, c) {
                var d = b(a, c);
                "undefined" != typeof i[a] ? setTimeout(function() {
                    i[a].fire(d)
                }, 0) : window.dispatchEvent(d)
            },
            callbackId: Math.floor(2e9 * Math.random()),
            callbacks: {},
            callbackStatus: {
                NO_RESULT: 0,
                OK: 1,
                CLASS_NOT_FOUND_EXCEPTION: 2,
                ILLEGAL_ACCESS_EXCEPTION: 3,
                INSTANTIATION_EXCEPTION: 4,
                MALFORMED_URL_EXCEPTION: 5,
                IO_EXCEPTION: 6,
                INVALID_ACTION: 7,
                JSON_EXCEPTION: 8,
                ERROR: 9
            },
            callbackSuccess: function(a, b) {
                try {
                    j.callbackFromNative(a, !0, b.status, [b.message], b.keepCallback)
                } catch (c) {
                    console.log("Error in error callback: " + a + " = " + c)
                }
            },
            callbackError: function(a, b) {
                try {
                    j.callbackFromNative(a, !1, b.status, [b.message], b.keepCallback)
                } catch (c) {
                    console.log("Error in error callback: " + a + " = " + c)
                }
            },
            callbackFromNative: function(a, b, c, d, e) {
                var f = j.callbacks[a];
                f && (b && c == j.callbackStatus.OK ? f.success && f.success.apply(null , d) : b || f.fail && f.fail.apply(null , d),
                e || delete j.callbacks[a])
            },
            addConstructor: function(a) {
                c.onCordovaReady.subscribe(function() {
                    try {
                        a()
                    } catch (b) {
                        console.log("Failed to run constructor: " + b)
                    }
                })
            }
        };
        c.onPause = j.addDocumentEventHandler("pause"),
        c.onResume = j.addDocumentEventHandler("resume"),
        c.onDeviceReady = j.addStickyDocumentEventHandler("deviceready"),
        module.exports = j
    }),
    a("cordova/argscheck", function(require, exports, module) {
        function a(a, b) {
            return /.*?\((.*?)\)/.exec(a)[1].split(", ")[b]
        }
        function b(b, c, g, h) {
            if (e.enableChecks) {
                for (var i, j = null , k = 0; k < b.length; ++k) {
                    var l = b.charAt(k)
                      , m = l.toUpperCase()
                      , n = g[k];
                    if ("*" != l && (i = d.typeName(n),
                    (null !== n && void 0 !== n || l != m) && i != f[m])) {
                        j = "Expected " + f[m];
                        break
                    }
                }
                if (j)
                    throw j += ", but got " + i + ".",
                    j = 'Wrong type for parameter "' + a(h || g.callee, k) + '" of ' + c + ": " + j,
                    "undefined" == typeof jasmine && console.error(j),
                    TypeError(j)
            }
        }
        function c(a, b) {
            return void 0 === a ? b : a
        }
        var d = (require("cordova/exec"),
        require("cordova/utils"))
          , e = module.exports
          , f = {
            A: "Array",
            D: "Date",
            N: "Number",
            S: "String",
            F: "Function",
            O: "Object"
        };
        e.checkArgs = b,
        e.getValue = c,
        e.enableChecks = !0
    }),
    a("cordova/builder", function(require, exports) {
        function a(a, b, c) {
            for (var d in a)
                a.hasOwnProperty(d) && b.apply(c, [a[d], d])
        }
        function b(a, b, c) {
            exports.replaceHookForTesting(a, b),
            a[b] = c,
            a[b] !== c && f.defineGetter(a, b, function() {
                return c
            })
        }
        function c(a, c, d, e) {
            e ? f.defineGetter(a, c, function() {
                return console.log(e),
                delete a[c],
                b(a, c, d),
                d
            }) : b(a, c, d)
        }
        function d(b, g, h, i) {
            a(g, function(a, g) {
                try {
                    var j = a.path ? require(a.path) : {};
                    h ? ("undefined" == typeof b[g] ? c(b, g, j, a.deprecated) : "undefined" != typeof a.path && (i ? e(b[g], j) : c(b, g, j, a.deprecated)),
                    j = b[g]) : "undefined" == typeof b[g] ? c(b, g, j, a.deprecated) : j = b[g],
                    a.children && d(j, a.children, h, i)
                } catch (k) {
                    f.alert("Exception building cordova JS globals: " + k + ' for key "' + g + '"')
                }
            })
        }
        function e(a, c) {
            for (var d in c)
                c.hasOwnProperty(d) && (a.prototype && a.prototype.constructor === a ? b(a.prototype, d, c[d]) : "object" == typeof c[d] && "object" == typeof a[d] ? e(a[d], c[d]) : b(a, d, c[d]))
        }
        var f = require("cordova/utils");
        exports.buildIntoButDoNotClobber = function(a, b) {
            d(b, a, !1, !1)
        }
        ,
        exports.buildIntoAndClobber = function(a, b) {
            d(b, a, !0, !1)
        }
        ,
        exports.buildIntoAndMerge = function(a, b) {
            d(b, a, !0, !0)
        }
        ,
        exports.recursiveMerge = e,
        exports.assignOrWrapInDeprecateGetter = c,
        exports.replaceHookForTesting = function() {}
    }),
    a("cordova/channel", function(require, exports, module) {
        function a(a) {
            if ("function" != typeof a)
                throw "Function required as first argument!"
        }
        var b = require("cordova/utils")
          , c = 1
          , d = function(a, b) {
            this.type = a,
            this.handlers = {},
            this.state = b ? 1 : 0,
            this.fireArgs = null ,
            this.numHandlers = 0,
            this.onHasSubscribersChange = null
        }
          , e = {
            join: function(a, b) {
                for (var c = b.length, d = c, e = function() {
                    --d || a()
                }, f = 0; c > f; f++) {
                    if (0 === b[f].state)
                        throw Error("Can only use join with sticky channels.");
                    b[f].subscribe(e)
                }
                c || a()
            },
            create: function(a) {
                return e[a] = new d(a,!1)
            },
            createSticky: function(a) {
                return e[a] = new d(a,!0)
            },
            deviceReadyChannelsArray: [],
            deviceReadyChannelsMap: {},
            waitForInitialization: function(a) {
                if (a) {
                    var b = e[a] || this.createSticky(a);
                    this.deviceReadyChannelsMap[a] = b,
                    this.deviceReadyChannelsArray.push(b)
                }
            },
            initializationComplete: function(a) {
                var b = this.deviceReadyChannelsMap[a];
                b && b.fire()
            }
        };
        d.prototype.subscribe = function(d, e) {
            if (a(d),
            2 == this.state)
                return d.apply(e || this, this.fireArgs),
                void 0;
            var f = d
              , g = d.observer_guid;
            "object" == typeof e && (f = b.close(e, d)),
            g || (g = "" + c++),
            f.observer_guid = g,
            d.observer_guid = g,
            this.handlers[g] || (this.handlers[g] = f,
            this.numHandlers++,
            1 == this.numHandlers && this.onHasSubscribersChange && this.onHasSubscribersChange())
        }
        ,
        d.prototype.unsubscribe = function(b) {
            a(b);
            var c = b.observer_guid
              , d = this.handlers[c];
            d && (delete this.handlers[c],
            this.numHandlers--,
            0 === this.numHandlers && this.onHasSubscribersChange && this.onHasSubscribersChange())
        }
        ,
        d.prototype.fire = function() {
            var a = Array.prototype.slice.call(arguments);
            if (1 == this.state && (this.state = 2,
            this.fireArgs = a),
            this.numHandlers) {
                var b = [];
                for (var c in this.handlers)
                    b.push(this.handlers[c]);
                for (var d = 0; d < b.length; ++d)
                    b[d].apply(this, a);
                2 == this.state && this.numHandlers && (this.numHandlers = 0,
                this.handlers = {},
                this.onHasSubscribersChange && this.onHasSubscribersChange())
            }
        }
        ,
        e.createSticky("onDOMContentLoaded"),
        e.createSticky("onNativeReady"),
        e.createSticky("onCordovaReady"),
        e.createSticky("onCordovaInfoReady"),
        e.createSticky("onCordovaConnectionReady"),
        e.createSticky("onPluginsReady"),
        e.createSticky("onDeviceReady"),
        e.create("onResume"),
        e.create("onPause"),
        e.createSticky("onDestroy"),
        e.waitForInitialization("onCordovaReady"),
        e.waitForInitialization("onCordovaConnectionReady"),
        e.waitForInitialization("onDOMContentLoaded"),
        module.exports = e
    }),
    a("cordova/commandProxy", function(require, exports, module) {
        var a = {};
        module.exports = {
            add: function(b, c) {
                return console.log("adding proxy for " + b),
                a[b] = c,
                c
            },
            remove: function(b) {
                var c = a[b];
                return delete a[b],
                a[b] = null ,
                c
            },
            get: function(b, c) {
                return a[b] ? a[b][c] : null
            }
        }
    }),
    a("cordova/exec", function(require, exports, module) {
        function a() {
            var a = document.createElement("iframe");
            return a.style.display = "none",
            document.body.appendChild(a),
            a
        }
        function b() {
            if (g == l.XHR_WITH_PAYLOAD)
                return !0;
            if (g == l.XHR_OPTIONAL_PAYLOAD) {
                for (var a = 0, b = 0; b < o.length; ++b)
                    a += o[b].length;
                return 4500 > a
            }
            return !1
        }
        function c(a) {
            if (!a || "Array" != k.typeName(a))
                return a;
            var b = []
              , c = function(a) {
                return String.fromCharCode.apply(null , new Uint8Array(a))
            }
              , d = function(a) {
                return window.btoa(c(a))
            };
            return a.forEach(function(a) {
                "ArrayBuffer" == k.typeName(a) ? b.push({
                    CDVType: "ArrayBuffer",
                    data: d(a)
                }) : b.push(a)
            }),
            b
        }
        function d(a) {
            if ("ArrayBuffer" == a.CDVType) {
                var b = function(a) {
                    for (var b = new Uint8Array(a.length), c = 0; c < a.length; c++)
                        b[c] = a.charCodeAt(c);
                    return b.buffer
                }
                  , c = function(a) {
                    return b(atob(a))
                };
                a = c(a.data)
            }
            return a
        }
        function e(a) {
            var b = [];
            return a && a.hasOwnProperty("CDVType") ? "MultiPart" == a.CDVType ? a.messages.forEach(function(a) {
                b.push(d(a))
            }) : b.push(d(a)) : b.push(a),
            b
        }
        function f() {
            void 0 === g && (g = -1 == navigator.userAgent.indexOf(" 4_") ? l.XHR_NO_PAYLOAD : l.IFRAME_NAV);
            var d, e, k, q, r, s, t = null ;
            if ("string" != typeof arguments[0])
                d = arguments[0],
                e = arguments[1],
                k = arguments[2],
                q = arguments[3],
                r = arguments[4],
                t = "INVALID";
            else
                try {
                    return s = arguments[0].split("."),
                    q = s.pop(),
                    k = s.join("."),
                    r = Array.prototype.splice.call(arguments, 1),
                    console.log('The old format of this exec call has been removed (deprecated since 2.1). Change to: cordova.exec(null, null, "' + k + '", "' + q + '",' + JSON.stringify(r) + ");"),
                    void 0
                } catch (u) {}
            (d || e) && (t = k + j.callbackId++,
            j.callbacks[t] = {
                success: d,
                fail: e
            }),
            r = c(r);
            var v = [t, k, q, r];
            o.push(JSON.stringify(v)),
            p || 1 != o.length || (g != l.IFRAME_NAV ? (i && 4 != i.readyState && (i = null ),
            i = i || new XMLHttpRequest,
            n || (n = /.*\((.*)\)/.exec(navigator.userAgent)[1]),
            b() && i.setRequestHeader("cmds", f.nativeFetchMessages())) : (h = h || a(),h.src = "gap://ready")
            )
        }
        var g, h, i, j = require("cordova"), k = (require("cordova/channel"),
        require("cordova/utils")), l = {
            IFRAME_NAV: 0,
            XHR_NO_PAYLOAD: 1,
            XHR_WITH_PAYLOAD: 2,
            XHR_OPTIONAL_PAYLOAD: 3
        }, m = 0, n = null , o = [], p = 0;
        f.jsToNativeModes = l,
        f.setJsToNativeBridgeMode = function(a) {
            h && (h.parentNode.removeChild(h),
            h = null ),
            g = a
        }
        ,
        f.nativeFetchMessages = function() {
            if (!o.length)
                return "";
            var a = "[" + o.join(",") + "]";
            return o.length = 0,
            a
        }
        ,
        f.nativeCallback = function(a, b, c, d) {
            return f.nativeEvalAndFetch(function() {
                var f = 0 === b || 1 === b
                  , g = e(c);
                j.callbackFromNative(a, f, b, g, d)
            })
        }
        ,
        f.nativeEvalAndFetch = function(a) {
            p++;
            try {
                return a(),
                f.nativeFetchMessages()
            } finally {
                p--
            }
        }
        ,
        module.exports = f
    }),
    a("cordova/modulemapper", function(require, exports) {
        function b(a, b, c, f) {
            if (!(b in g))
                throw new Error("Module " + b + " does not exist.");
            d.push(a, b, c),
            f && (e[c] = f)
        }
        function c(a, b) {
            if (!a)
                return b;
            for (var c, d = a.split("."), e = b, f = 0; c = d[f]; ++f)
                e = e[c] = e[c] || {};
            return e
        }
        var d, e, f = require("cordova/builder"), g = a.moduleMap;
        exports.reset = function() {
            d = [],
            e = {}
        }
        ,
        exports.clobbers = function(a, c, d) {
            b("c", a, c, d)
        }
        ,
        exports.merges = function(a, c, d) {
            b("m", a, c, d)
        }
        ,
        exports.defaults = function(a, c, d) {
            b("d", a, c, d)
        }
        ,
        exports.mapModules = function(a) {
            var b = {};
            a.CDV_origSymbols = b;
            for (var g = 0, h = d.length; h > g; g += 3) {
                var i = d[g]
                  , j = d[g + 1]
                  , k = d[g + 2]
                  , l = k.lastIndexOf(".")
                  , m = k.substr(0, l)
                  , n = k.substr(l + 1)
                  , module = require(j)
                  , o = k in e ? "Access made to deprecated symbol: " + k + ". " + o : null
                  , p = c(m, a)
                  , q = p[n];
                "m" == i && q ? f.recursiveMerge(q, module) : ("d" == i && !q || "d" != i) && (k in b || (b[k] = q),
                f.assignOrWrapInDeprecateGetter(p, n, module, o))
            }
        }
        ,
        exports.getOriginalSymbol = function(a, b) {
            var c = a.CDV_origSymbols;
            if (c && b in c)
                return c[b];
            for (var d = b.split("."), e = a, f = 0; f < d.length; ++f)
                e = e && e[d[f]];
            return e
        }
        ,
        exports.loadMatchingModules = function(a) {
            for (var b in g)
                a.exec(b) && require(b)
        }
        ,
        exports.reset()
    }),
    a("cordova/platform", function(require, exports, module) {
        module.exports = {
            id: "ios",
            initialize: function() {
                var a = require("cordova/modulemapper");
                a.loadMatchingModules(/cordova.*\/plugininit$/),
                a.loadMatchingModules(/cordova.*\/symbols$/),
                a.mapModules(window)
            }
        }
    }),
    a("cordova/plugin/Acceleration", function(require, exports, module) {
        var a = function(a, b, c, d) {
            this.x = a,
            this.y = b,
            this.z = c,
            this.timestamp = d || (new Date).getTime()
        };
        module.exports = a
    }),
    a("cordova/plugin/Camera", function(require, exports, module) {
        var a = require("cordova/argscheck")
          , b = require("cordova/exec")
          , c = require("cordova/plugin/CameraConstants")
          , d = require("cordova/plugin/CameraPopoverHandle")
          , e = {};
        for (var f in c)
            e[f] = c[f];
        e.getPicture = function(e, f, g) {
            a.checkArgs("fFO", "Camera.getPicture", arguments),
            g = g || {};
            var h = a.getValue
              , i = h(g.quality, 50)
              , j = h(g.destinationType, c.DestinationType.FILE_URI)
              , k = h(g.sourceType, c.PictureSourceType.CAMERA)
              , l = h(g.targetWidth, -1)
              , m = h(g.targetHeight, -1)
              , n = h(g.encodingType, c.EncodingType.JPEG)
              , o = h(g.mediaType, c.MediaType.PICTURE)
              , p = !!g.allowEdit
              , q = !!g.correctOrientation
              , r = !!g.saveToPhotoAlbum
              , s = h(g.popoverOptions, null )
              , t = h(g.cameraDirection, c.Direction.BACK)
              , u = [i, j, k, l, m, n, o, p, q, r, s, t];
            return b(e, f, "Camera", "takePicture", u),
            new d
        }
        ,
        e.cleanup = function(a, c) {
            b(a, c, "Camera", "cleanup", [])
        }
        ,
        module.exports = e
    }),
    a("cordova/plugin/CameraConstants", function(require, exports, module) {
        module.exports = {
            DestinationType: {
                DATA_URL: 0,
                FILE_URI: 1,
                NATIVE_URI: 2
            },
            EncodingType: {
                JPEG: 0,
                PNG: 1
            },
            MediaType: {
                PICTURE: 0,
                VIDEO: 1,
                ALLMEDIA: 2
            },
            PictureSourceType: {
                PHOTOLIBRARY: 0,
                CAMERA: 1,
                SAVEDPHOTOALBUM: 2
            },
            PopoverArrowDirection: {
                ARROW_UP: 1,
                ARROW_DOWN: 2,
                ARROW_LEFT: 4,
                ARROW_RIGHT: 8,
                ARROW_ANY: 15
            },
            Direction: {
                BACK: 0,
                FRONT: 1
            }
        }
    }),
    a("cordova/plugin/CameraPopoverHandle", function(require, exports, module) {
        var a = require("cordova/exec")
          , b = function() {
            this.setPosition = function(b) {
                var c = [b];
                a(null , null , "Camera", "repositionPopover", c)
            }
        };
        module.exports = b
    }),
    a("cordova/plugin/CameraPopoverOptions", function(require, exports, module) {
        var a = require("cordova/plugin/CameraConstants")
          , b = function(b, c, d, e, f) {
            this.x = b || 0,
            this.y = c || 32,
            this.width = d || 320,
            this.height = e || 480,
            this.arrowDir = f || a.PopoverArrowDirection.ARROW_ANY
        };
        module.exports = b
    }),
    a("cordova/plugin/CaptureAudioOptions", function(require, exports, module) {
        var a = function() {
            this.limit = 1,
            this.duration = 0
        };
        module.exports = a
    }),
    a("cordova/plugin/CaptureError", function(require, exports, module) {
        var a = function(a) {
            this.code = a || null
        };
        a.CAPTURE_INTERNAL_ERR = 0,
        a.CAPTURE_APPLICATION_BUSY = 1,
        a.CAPTURE_INVALID_ARGUMENT = 2,
        a.CAPTURE_NO_MEDIA_FILES = 3,
        a.CAPTURE_NOT_SUPPORTED = 20,
        module.exports = a
    }),
    a("cordova/plugin/CaptureImageOptions", function(require, exports, module) {
        var a = function() {
            this.limit = 1
        };
        module.exports = a
    }),
    a("cordova/plugin/CaptureVideoOptions", function(require, exports, module) {
        var a = function() {
            this.limit = 1,
            this.duration = 0
        };
        module.exports = a
    }),
    a("cordova/plugin/CompassError", function(require, exports, module) {
        var a = function(a) {
            this.code = void 0 !== a ? a : null
        };
        a.COMPASS_INTERNAL_ERR = 0,
        a.COMPASS_NOT_SUPPORTED = 20,
        module.exports = a
    }),
    a("cordova/plugin/CompassHeading", function(require, exports, module) {
        var a = function(a, b, c, d) {
            this.magneticHeading = a,
            this.trueHeading = b,
            this.headingAccuracy = c,
            this.timestamp = d || (new Date).getTime()
        };
        module.exports = a
    }),
    a("cordova/plugin/ConfigurationData", function(require, exports, module) {
        function a() {
            this.type = null ,
            this.height = 0,
            this.width = 0
        }
        module.exports = a
    }),
    a("cordova/plugin/Connection", function(require, exports, module) {
        module.exports = {
            UNKNOWN: "unknown",
            ETHERNET: "ethernet",
            WIFI: "wifi",
            CELL_2G: "2g",
            CELL_3G: "3g",
            CELL_4G: "4g",
            CELL: "cellular",
            NONE: "none"
        }
    }),
    a("cordova/plugin/Contact", function(require, exports, module) {
        function a(a) {
            var b = a.birthday;
            try {
                a.birthday = new Date(parseFloat(b))
            } catch (c) {
                console.log("Cordova Contact convertIn error: exception creating date.")
            }
            return a
        }
        function b(a) {
            var b = a.birthday;
            if (null !== b) {
                if (!f.isDate(b))
                    try {
                        b = new Date(b)
                    } catch (c) {
                        b = null
                    }
                f.isDate(b) && (b = b.valueOf()),
                a.birthday = b
            }
            return a
        }
        var c = require("cordova/argscheck")
          , d = require("cordova/exec")
          , e = require("cordova/plugin/ContactError")
          , f = require("cordova/utils")
          , g = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
            this.id = a || null ,
            this.rawId = null ,
            this.displayName = b || null ,
            this.name = c || null ,
            this.nickname = d || null ,
            this.phoneNumbers = e || null ,
            this.emails = f || null ,
            this.addresses = g || null ,
            this.ims = h || null ,
            this.organizations = i || null ,
            this.birthday = j || null ,
            this.note = k || null ,
            this.photos = l || null ,
            this.categories = m || null ,
            this.urls = n || null
        };
        g.prototype.remove = function(a, b) {
            c.checkArgs("FF", "Contact.remove", arguments);
            var f = b && function(a) {
                b(new e(a))
            }
            ;
            null === this.id ? f(e.UNKNOWN_ERROR) : d(a, f, "Contacts", "remove", [this.id])
        }
        ,
        g.prototype.clone = function() {
            function a(a) {
                if (a)
                    for (var b = 0; b < a.length; ++b)
                        a[b].id = null
            }
            var b = f.clone(this);
            return b.id = null ,
            b.rawId = null ,
            a(b.phoneNumbers),
            a(b.emails),
            a(b.addresses),
            a(b.ims),
            a(b.organizations),
            a(b.categories),
            a(b.photos),
            a(b.urls),
            b
        }
        ,
        g.prototype.save = function(g, h) {
            c.checkArgs("FFO", "Contact.save", arguments);
            var i = h && function(a) {
                h(new e(a))
            }
              , j = function(b) {
                if (b) {
                    if (g) {
                        var c = require("cordova/plugin/contacts").create(b);
                        g(a(c))
                    }
                } else
                    i(e.UNKNOWN_ERROR)
            }
              , k = b(f.clone(this));
            d(j, i, "Contacts", "save", [k])
        }
        ,
        module.exports = g
    }),
    a("cordova/plugin/ContactAddress", function(require, exports, module) {
        var a = function(a, b, c, d, e, f, g, h) {
            this.id = null ,
            this.pref = "undefined" != typeof a ? a : !1,
            this.type = b || null ,
            this.formatted = c || null ,
            this.streetAddress = d || null ,
            this.locality = e || null ,
            this.region = f || null ,
            this.postalCode = g || null ,
            this.country = h || null
        };
        module.exports = a
    }),
    a("cordova/plugin/ContactError", function(require, exports, module) {
        var a = function(a) {
            this.code = "undefined" != typeof a ? a : null
        };
        a.UNKNOWN_ERROR = 0,
        a.INVALID_ARGUMENT_ERROR = 1,
        a.TIMEOUT_ERROR = 2,
        a.PENDING_OPERATION_ERROR = 3,
        a.IO_ERROR = 4,
        a.NOT_SUPPORTED_ERROR = 5,
        a.PERMISSION_DENIED_ERROR = 20,
        module.exports = a
    }),
    a("cordova/plugin/ContactField", function(require, exports, module) {
        var a = function(a, b, c) {
            this.id = null ,
            this.type = a && a.toString() || null ,
            this.value = b && b.toString() || null ,
            this.pref = "undefined" != typeof c ? c : !1
        };
        module.exports = a
    }),
    a("cordova/plugin/ContactFindOptions", function(require, exports, module) {
        var a = function(a, b) {
            this.filter = a || "",
            this.multiple = "undefined" != typeof b ? b : !1
        };
        module.exports = a
    }),
    a("cordova/plugin/ContactName", function(require, exports, module) {
        var a = function(a, b, c, d, e, f) {
            this.formatted = a || null ,
            this.familyName = b || null ,
            this.givenName = c || null ,
            this.middleName = d || null ,
            this.honorificPrefix = e || null ,
            this.honorificSuffix = f || null
        };
        module.exports = a
    }),
    a("cordova/plugin/ContactOrganization", function(require, exports, module) {
        var a = function(a, b, c, d, e) {
            this.id = null ,
            this.pref = "undefined" != typeof a ? a : !1,
            this.type = b || null ,
            this.name = c || null ,
            this.department = d || null ,
            this.title = e || null
        };
        module.exports = a
    }),
    a("cordova/plugin/Coordinates", function(require, exports, module) {
        var a = function(a, b, c, d, e, f, g) {
            this.latitude = a,
            this.longitude = b,
            this.accuracy = d,
            this.altitude = void 0 !== c ? c : null ,
            this.heading = void 0 !== e ? e : null ,
            this.speed = void 0 !== f ? f : null ,
            (0 === this.speed || null === this.speed) && (this.heading = 0 / 0),
            this.altitudeAccuracy = void 0 !== g ? g : null
        };
        module.exports = a
    }),
    a("cordova/plugin/DirectoryEntry", function(require, exports, module) {
        var a = require("cordova/argscheck")
          , b = require("cordova/utils")
          , c = require("cordova/exec")
          , d = require("cordova/plugin/Entry")
          , e = require("cordova/plugin/FileError")
          , f = require("cordova/plugin/DirectoryReader")
          , g = function(a, b) {
            g.__super__.constructor.call(this, !1, !0, a, b)
        };
        b.extend(g, d),
        g.prototype.createReader = function() {
            return new f(this.fullPath)
        }
        ,
        g.prototype.getDirectory = function(b, d, f, h) {
            a.checkArgs("sOFF", "DirectoryEntry.getDirectory", arguments);
            var i = f && function(a) {
                var b = new g(a.name,a.fullPath);
                f(b)
            }
              , j = h && function(a) {
                h(new e(a))
            }
            ;
            c(i, j, "File", "getDirectory", [this.fullPath, b, d])
        }
        ,
        g.prototype.removeRecursively = function(b, d) {
            a.checkArgs("FF", "DirectoryEntry.removeRecursively", arguments);
            var f = d && function(a) {
                d(new e(a))
            }
            ;
            c(b, f, "File", "removeRecursively", [this.fullPath])
        }
        ,
        g.prototype.getFile = function(b, d, f, g) {
            a.checkArgs("sOFF", "DirectoryEntry.getFile", arguments);
            var h = f && function(a) {
                var b = require("cordova/plugin/FileEntry")
                  , c = new b(a.name,a.fullPath);
                f(c)
            }
              , i = g && function(a) {
                g(new e(a))
            }
            ;
            c(h, i, "File", "getFile", [this.fullPath, b, d])
        }
        ,
        module.exports = g
    }),
    a("cordova/plugin/DirectoryReader", function(require, exports, module) {
        function a(a) {
            this.path = a || null
        }
        var b = require("cordova/exec")
          , c = require("cordova/plugin/FileError");
        a.prototype.readEntries = function(a, d) {
            var e = "function" != typeof a ? null : function(b) {
                for (var c = [], d = 0; d < b.length; d++) {
                    var e = null ;
                    b[d].isDirectory ? e = new (require("cordova/plugin/DirectoryEntry")) : b[d].isFile && (e = new (require("cordova/plugin/FileEntry"))),
                    e.isDirectory = b[d].isDirectory,
                    e.isFile = b[d].isFile,
                    e.name = b[d].name,
                    e.fullPath = b[d].fullPath,
                    c.push(e)
                }
                a(c)
            }
              , f = "function" != typeof d ? null : function(a) {
                d(new c(a))
            }
            ;
            b(e, f, "File", "readEntries", [this.path])
        }
        ,
        module.exports = a
    }),
    a("cordova/plugin/Entry", function(require, exports, module) {
        function a(a, b, c, d, e) {
            this.isFile = !!a,
            this.isDirectory = !!b,
            this.name = c || "",
            this.fullPath = d || "",
            this.filesystem = e || null
        }
        var b = require("cordova/argscheck")
          , c = require("cordova/exec")
          , d = require("cordova/plugin/FileError")
          , e = require("cordova/plugin/Metadata");
        a.prototype.getMetadata = function(a, f) {
            b.checkArgs("FF", "Entry.getMetadata", arguments);
            var g = a && function(b) {
                var c = new e(b);
                a(c)
            }
              , h = f && function(a) {
                f(new d(a))
            }
            ;
            c(g, h, "File", "getMetadata", [this.fullPath])
        }
        ,
        a.prototype.setMetadata = function(a, d, e) {
            b.checkArgs("FFO", "Entry.setMetadata", arguments),
            c(a, d, "File", "setMetadata", [this.fullPath, e])
        }
        ,
        a.prototype.moveTo = function(a, e, f, g) {
            b.checkArgs("oSFF", "Entry.moveTo", arguments);
            var h = g && function(a) {
                g(new d(a))
            }
              , i = this.fullPath
              , j = e || this.name
              , k = function(a) {
                if (a) {
                    if (f) {
                        var b = a.isDirectory ? new (require("cordova/plugin/DirectoryEntry"))(a.name,a.fullPath) : new (require("cordova/plugin/FileEntry"))(a.name,a.fullPath);
                        f(b)
                    }
                } else
                    h && h(d.NOT_FOUND_ERR)
            };
            c(k, h, "File", "moveTo", [i, a.fullPath, j])
        }
        ,
        a.prototype.copyTo = function(a, e, f, g) {
            b.checkArgs("oSFF", "Entry.copyTo", arguments);
            var h = g && function(a) {
                g(new d(a))
            }
              , i = this.fullPath
              , j = e || this.name
              , k = function(a) {
                if (a) {
                    if (f) {
                        var b = a.isDirectory ? new (require("cordova/plugin/DirectoryEntry"))(a.name,a.fullPath) : new (require("cordova/plugin/FileEntry"))(a.name,a.fullPath);
                        f(b)
                    }
                } else
                    h && h(d.NOT_FOUND_ERR)
            };
            c(k, h, "File", "copyTo", [i, a.fullPath, j])
        }
        ,
        a.prototype.toURL = function() {
            return this.fullPath
        }
        ,
        a.prototype.toURI = function() {
            return console.log("DEPRECATED: Update your code to use 'toURL'"),
            this.toURL()
        }
        ,
        a.prototype.remove = function(a, e) {
            b.checkArgs("FF", "Entry.remove", arguments);
            var f = e && function(a) {
                e(new d(a))
            }
            ;
            c(a, f, "File", "remove", [this.fullPath])
        }
        ,
        a.prototype.getParent = function(a, e) {
            b.checkArgs("FF", "Entry.getParent", arguments);
            var f = a && function(b) {
                var c = require("cordova/plugin/DirectoryEntry")
                  , d = new c(b.name,b.fullPath);
                a(d)
            }
              , g = e && function(a) {
                e(new d(a))
            }
            ;
            c(f, g, "File", "getParent", [this.fullPath])
        }
        ,
        module.exports = a
    }),
    a("cordova/plugin/File", function(require, exports, module) {
        var a = function(a, b, c, d, e) {
            this.name = a || "",
            this.fullPath = b || null ,
            this.type = c || null ,
            this.lastModifiedDate = d || null ,
            this.size = e || 0,
            this.start = 0,
            this.end = this.size
        };
        a.prototype.slice = function(b, c) {
            var d = this.end - this.start
              , e = 0
              , f = d;
            arguments.length && (e = 0 > b ? Math.max(d + b, 0) : Math.min(d, b)),
            arguments.length >= 2 && (f = 0 > c ? Math.max(d + c, 0) : Math.min(c, d));
            var g = new a(this.name,this.fullPath,this.type,this.lastModifiedData,this.size);
            return g.start = this.start + e,
            g.end = this.start + f,
            g
        }
        ,
        module.exports = a
    }),
    a("cordova/plugin/FileEntry", function(require, exports, module) {
        var a = require("cordova/utils")
          , b = require("cordova/exec")
          , c = require("cordova/plugin/Entry")
          , d = require("cordova/plugin/FileWriter")
          , e = require("cordova/plugin/File")
          , f = require("cordova/plugin/FileError")
          , g = function(a, b) {
            g.__super__.constructor.apply(this, [!0, !1, a, b])
        };
        a.extend(g, c),
        g.prototype.createWriter = function(a, b) {
            this.file(function(c) {
                var e = new d(c);
                null === e.fileName || "" === e.fileName ? b && b(new f(f.INVALID_STATE_ERR)) : a && a(e)
            }, b)
        }
        ,
        g.prototype.file = function(a, c) {
            var d = a && function(b) {
                var c = new e(b.name,b.fullPath,b.type,b.lastModifiedDate,b.size);
                a(c)
            }
              , g = c && function(a) {
                c(new f(a))
            }
            ;
            b(d, g, "File", "getFileMetadata", [this.fullPath])
        }
        ,
        module.exports = g
    }),
    a("cordova/plugin/FileError", function(require, exports, module) {
        function a(a) {
            this.code = a || null
        }
        a.NOT_FOUND_ERR = 1,
        a.SECURITY_ERR = 2,
        a.ABORT_ERR = 3,
        a.NOT_READABLE_ERR = 4,
        a.ENCODING_ERR = 5,
        a.NO_MODIFICATION_ALLOWED_ERR = 6,
        a.INVALID_STATE_ERR = 7,
        a.SYNTAX_ERR = 8,
        a.INVALID_MODIFICATION_ERR = 9,
        a.QUOTA_EXCEEDED_ERR = 10,
        a.TYPE_MISMATCH_ERR = 11,
        a.PATH_EXISTS_ERR = 12,
        module.exports = a
    }),
    a("cordova/plugin/FileReader", function(require, exports, module) {
        function a(a) {
            e.defineGetterSetter(i.prototype, a, function() {
                return this._realReader[a] || null
            }, function(b) {
                this._realReader[a] = b
            })
        }
        function b(a, b) {
            if (a.readyState == i.LOADING)
                throw new f(f.INVALID_STATE_ERR);
            return a._result = null ,
            a._error = null ,
            a._readyState = i.LOADING,
            "string" != typeof b.fullPath ? (a._fileName = "",
            !0) : (a._fileName = b.fullPath,
            a.onloadstart && a.onloadstart(new g("loadstart",{
                target: a
            })),
            void 0)
        }
        var c = require("cordova/exec")
          , d = require("cordova/modulemapper")
          , e = require("cordova/utils")
          , f = (require("cordova/plugin/File"),
        require("cordova/plugin/FileError"))
          , g = require("cordova/plugin/ProgressEvent")
          , h = d.getOriginalSymbol(this, "FileReader")
          , i = function() {
            this._readyState = 0,
            this._error = null ,
            this._result = null ,
            this._fileName = "",
            this._realReader = h ? new h : {}
        };
        i.EMPTY = 0,
        i.LOADING = 1,
        i.DONE = 2,
        e.defineGetter(i.prototype, "readyState", function() {
            return this._fileName ? this._readyState : this._realReader.readyState
        }),
        e.defineGetter(i.prototype, "error", function() {
            return this._fileName ? this._error : this._realReader.error
        }),
        e.defineGetter(i.prototype, "result", function() {
            return this._fileName ? this._result : this._realReader.result
        }),
        a("onloadstart"),
        a("onprogress"),
        a("onload"),
        a("onerror"),
        a("onloadend"),
        a("onabort"),
        i.prototype.abort = function() {
            return h && !this._fileName ? this._realReader.abort() : (this._result = null ,
            this._readyState != i.DONE && this._readyState != i.EMPTY && (this._readyState = i.DONE,
            "function" == typeof this.onabort && this.onabort(new g("abort",{
                target: this
            })),
            "function" == typeof this.onloadend && this.onloadend(new g("loadend",{
                target: this
            }))),
            void 0)
        }
        ,
        i.prototype.readAsText = function(a, d) {
            if (b(this, a))
                return this._realReader.readAsText(a, d);
            var e = d ? d : "UTF-8"
              , h = this
              , j = [this._fileName, e, a.start, a.end];
            c(function(a) {
                h._readyState !== i.DONE && (h._result = a,
                "function" == typeof h.onload && h.onload(new g("load",{
                    target: h
                })),
                h._readyState = i.DONE,
                "function" == typeof h.onloadend && h.onloadend(new g("loadend",{
                    target: h
                })))
            }, function(a) {
                h._readyState !== i.DONE && (h._readyState = i.DONE,
                h._result = null ,
                h._error = new f(a),
                "function" == typeof h.onerror && h.onerror(new g("error",{
                    target: h
                })),
                "function" == typeof h.onloadend && h.onloadend(new g("loadend",{
                    target: h
                })))
            }, "File", "readAsText", j)
        }
        ,
        i.prototype.readAsDataURL = function(a) {
            if (b(this, a))
                return this._realReader.readAsDataURL(a);
            var d = this
              , e = [this._fileName, a.start, a.end];
            c(function(a) {
                d._readyState !== i.DONE && (d._readyState = i.DONE,
                d._result = a,
                "function" == typeof d.onload && d.onload(new g("load",{
                    target: d
                })),
                "function" == typeof d.onloadend && d.onloadend(new g("loadend",{
                    target: d
                })))
            }, function(a) {
                d._readyState !== i.DONE && (d._readyState = i.DONE,
                d._result = null ,
                d._error = new f(a),
                "function" == typeof d.onerror && d.onerror(new g("error",{
                    target: d
                })),
                "function" == typeof d.onloadend && d.onloadend(new g("loadend",{
                    target: d
                })))
            }, "File", "readAsDataURL", e)
        }
        ,
        i.prototype.readAsBinaryString = function(a) {
            if (b(this, a))
                return this._realReader.readAsBinaryString(a);
            var d = this
              , e = [this._fileName, a.start, a.end];
            c(function(a) {
                d._readyState !== i.DONE && (d._readyState = i.DONE,
                d._result = a,
                "function" == typeof d.onload && d.onload(new g("load",{
                    target: d
                })),
                "function" == typeof d.onloadend && d.onloadend(new g("loadend",{
                    target: d
                })))
            }, function(a) {
                d._readyState !== i.DONE && (d._readyState = i.DONE,
                d._result = null ,
                d._error = new f(a),
                "function" == typeof d.onerror && d.onerror(new g("error",{
                    target: d
                })),
                "function" == typeof d.onloadend && d.onloadend(new g("loadend",{
                    target: d
                })))
            }, "File", "readAsBinaryString", e)
        }
        ,
        i.prototype.readAsArrayBuffer = function(a) {
            if (b(this, a))
                return this._realReader.readAsArrayBuffer(a);
            var d = this
              , e = [this._fileName, a.start, a.end];
            c(function(a) {
                d._readyState !== i.DONE && (d._readyState = i.DONE,
                d._result = a,
                "function" == typeof d.onload && d.onload(new g("load",{
                    target: d
                })),
                "function" == typeof d.onloadend && d.onloadend(new g("loadend",{
                    target: d
                })))
            }, function(a) {
                d._readyState !== i.DONE && (d._readyState = i.DONE,
                d._result = null ,
                d._error = new f(a),
                "function" == typeof d.onerror && d.onerror(new g("error",{
                    target: d
                })),
                "function" == typeof d.onloadend && d.onloadend(new g("loadend",{
                    target: d
                })))
            }, "File", "readAsArrayBuffer", e)
        }
        ,
        module.exports = i
    }),
    a("cordova/plugin/FileSystem", function(require, exports, module) {
        var a = require("cordova/plugin/DirectoryEntry")
          , b = function(b, c) {
            this.name = b || null ,
            c && (this.root = new a(c.name,c.fullPath))
        };
        module.exports = b
    }),
    a("cordova/plugin/FileTransfer", function(require, exports, module) {
        function a(a) {
            var b = new f;
            return b.lengthComputable = a.lengthComputable,
            b.loaded = a.loaded,
            b.total = a.total,
            b
        }
        function b(a) {
            var b = null ;
            if (window.btoa) {
                var c = document.createElement("a");
                c.href = a;
                var d = null
                  , e = c.protocol + "//"
                  , f = e + c.host;
                if (0 !== c.href.indexOf(f)) {
                    var g = c.href.indexOf("@");
                    d = c.href.substring(e.length, g)
                }
                if (d) {
                    var h = "Authorization"
                      , i = "Basic " + window.btoa(d);
                    b = {
                        name: h,
                        value: i
                    }
                }
            }
            return b
        }
        var c = require("cordova/argscheck")
          , d = require("cordova/exec")
          , e = require("cordova/plugin/FileTransferError")
          , f = require("cordova/plugin/ProgressEvent")
          , g = 0
          , h = function() {
            this._id = ++g,
            this.onprogress = null
        };
        h.prototype.upload = function(f, g, h, i, j, k) {
            c.checkArgs("ssFFO*", "FileTransfer.upload", arguments);
            var l = null
              , m = null
              , n = null
              , o = null
              , p = !0
              , q = null
              , r = null
              , s = b(g);
            s && (j = j || {},
            j.headers = j.headers || {},
            j.headers[s.name] = s.value),
            j && (l = j.fileKey,
            m = j.fileName,
            n = j.mimeType,
            q = j.headers,
            r = j.httpMethod || "POST",
            r = "PUT" == r.toUpperCase() ? "PUT" : "POST",
            (null !== j.chunkedMode || "undefined" != typeof j.chunkedMode) && (p = j.chunkedMode),
            o = j.params ? j.params : {});
            var t = i && function(a) {
                var b = new e(a.code,a.source,a.target,a.http_status,a.body);
                i(b)
            }
              , u = this
              , v = function(b) {
                "undefined" != typeof b.lengthComputable ? u.onprogress && u.onprogress(a(b)) : h && h(b)
            };
            d(v, t, "FileTransfer", "upload", [f, g, l, m, n, o, k, p, q, this._id, r])
        }
        ,
        h.prototype.download = function(f, g, h, i, j, k) {
            c.checkArgs("ssFF*", "FileTransfer.download", arguments);
            var l = this
              , m = b(f);
            m && (k = k || {},
            k.headers = k.headers || {},
            k.headers[m.name] = m.value);
            var n = null ;
            k && (n = k.headers || null );
            var o = function(b) {
                if ("undefined" != typeof b.lengthComputable) {
                    if (l.onprogress)
                        return l.onprogress(a(b))
                } else if (h) {
                    var c = null ;
                    b.isDirectory ? c = new (require("cordova/plugin/DirectoryEntry")) : b.isFile && (c = new (require("cordova/plugin/FileEntry"))),
                    c.isDirectory = b.isDirectory,
                    c.isFile = b.isFile,
                    c.name = b.name,
                    c.fullPath = b.fullPath,
                    h(c)
                }
            }
              , p = i && function(a) {
                var b = new e(a.code,a.source,a.target,a.http_status,a.body);
                i(b)
            }
            ;
            d(o, p, "FileTransfer", "download", [f, g, j, this._id, n])
        }
        ,
        h.prototype.abort = function() {
            d(null , null , "FileTransfer", "abort", [this._id])
        }
        ,
        module.exports = h
    }),
    a("cordova/plugin/FileTransferError", function(require, exports, module) {
        var a = function(a, b, c, d, e) {
            this.code = a || null ,
            this.source = b || null ,
            this.target = c || null ,
            this.http_status = d || null ,
            this.body = e || null
        };
        a.FILE_NOT_FOUND_ERR = 1,
        a.INVALID_URL_ERR = 2,
        a.CONNECTION_ERR = 3,
        a.ABORT_ERR = 4,
        module.exports = a
    }),
    a("cordova/plugin/FileUploadOptions", function(require, exports, module) {
        var a = function(a, b, c, d, e, f) {
            this.fileKey = a || null ,
            this.fileName = b || null ,
            this.mimeType = c || null ,
            this.params = d || null ,
            this.headers = e || null ,
            this.httpMethod = f || null
        };
        module.exports = a
    }),
    a("cordova/plugin/FileUploadResult", function(require, exports, module) {
        var a = function() {
            this.bytesSent = 0,
            this.responseCode = null ,
            this.response = null
        };
        module.exports = a
    }),
    a("cordova/plugin/FileWriter", function(require, exports, module) {
        var a = require("cordova/exec")
          , b = require("cordova/plugin/FileError")
          , c = require("cordova/plugin/ProgressEvent")
          , d = function(a) {
            this.fileName = "",
            this.length = 0,
            a && (this.fileName = a.fullPath || a,
            this.length = a.size || 0),
            this.position = 0,
            this.readyState = 0,
            this.result = null ,
            this.error = null ,
            this.onwritestart = null ,
            this.onprogress = null ,
            this.onwrite = null ,
            this.onwriteend = null ,
            this.onabort = null ,
            this.onerror = null
        };
        d.INIT = 0,
        d.WRITING = 1,
        d.DONE = 2,
        d.prototype.abort = function() {
            if (this.readyState === d.DONE || this.readyState === d.INIT)
                throw new b(b.INVALID_STATE_ERR);
            this.error = new b(b.ABORT_ERR),
            this.readyState = d.DONE,
            "function" == typeof this.onabort && this.onabort(new c("abort",{
                target: this
            })),
            "function" == typeof this.onwriteend && this.onwriteend(new c("writeend",{
                target: this
            }))
        }
        ,
        d.prototype.write = function(e) {
            var f = !1;
            if ("undefined" != typeof window.Blob && "undefined" != typeof window.ArrayBuffer) {
                if (e instanceof Blob) {
                    var g = this
                      , h = new FileReader;
                    return h.onload = function() {
                        d.prototype.write.call(g, this.result)
                    }
                    ,
                    h.readAsArrayBuffer(e),
                    void 0
                }
                f = e instanceof ArrayBuffer
            }
            if (this.readyState === d.WRITING)
                throw new b(b.INVALID_STATE_ERR);
            this.readyState = d.WRITING;
            var i = this;
            "function" == typeof i.onwritestart && i.onwritestart(new c("writestart",{
                target: i
            })),
            a(function(a) {
                i.readyState !== d.DONE && (i.position += a,
                i.length = i.position,
                i.readyState = d.DONE,
                "function" == typeof i.onwrite && i.onwrite(new c("write",{
                    target: i
                })),
                "function" == typeof i.onwriteend && i.onwriteend(new c("writeend",{
                    target: i
                })))
            }, function(a) {
                i.readyState !== d.DONE && (i.readyState = d.DONE,
                i.error = new b(a),
                "function" == typeof i.onerror && i.onerror(new c("error",{
                    target: i
                })),
                "function" == typeof i.onwriteend && i.onwriteend(new c("writeend",{
                    target: i
                })))
            }, "File", "write", [this.fileName, e, this.position, f])
        }
        ,
        d.prototype.seek = function(a) {
            if (this.readyState === d.WRITING)
                throw new b(b.INVALID_STATE_ERR);
            (a || 0 === a) && (this.position = 0 > a ? Math.max(a + this.length, 0) : a > this.length ? this.length : a)
        }
        ,
        d.prototype.truncate = function(e) {
            if (this.readyState === d.WRITING)
                throw new b(b.INVALID_STATE_ERR);
            this.readyState = d.WRITING;
            var f = this;
            "function" == typeof f.onwritestart && f.onwritestart(new c("writestart",{
                target: this
            })),
            a(function(a) {
                f.readyState !== d.DONE && (f.readyState = d.DONE,
                f.length = a,
                f.position = Math.min(f.position, a),
                "function" == typeof f.onwrite && f.onwrite(new c("write",{
                    target: f
                })),
                "function" == typeof f.onwriteend && f.onwriteend(new c("writeend",{
                    target: f
                })))
            }, function(a) {
                f.readyState !== d.DONE && (f.readyState = d.DONE,
                f.error = new b(a),
                "function" == typeof f.onerror && f.onerror(new c("error",{
                    target: f
                })),
                "function" == typeof f.onwriteend && f.onwriteend(new c("writeend",{
                    target: f
                })))
            }, "File", "truncate", [this.fileName, e])
        }
        ,
        module.exports = d
    }),
    a("cordova/plugin/Flags", function(require, exports, module) {
        function a(a, b) {
            this.create = a || !1,
            this.exclusive = b || !1
        }
        module.exports = a
    }),
    a("cordova/plugin/GlobalizationError", function(require, exports, module) {
        var a = function(a, b) {
            this.code = a || null ,
            this.message = b || ""
        };
        a.UNKNOWN_ERROR = 0,
        a.FORMATTING_ERROR = 1,
        a.PARSING_ERROR = 2,
        a.PATTERN_ERROR = 3,
        module.exports = a
    }),
    a("cordova/plugin/InAppBrowser", function(require, exports, module) {
        function a() {
            this.channels = {
                loadstart: c.create("loadstart"),
                loadstop: c.create("loadstop"),
                loaderror: c.create("loaderror"),
                exit: c.create("exit")
            }
        }
        var b = require("cordova/exec")
          , c = require("cordova/channel")
          , d = require("cordova/modulemapper");
        a.prototype = {
            _eventHandler: function(a) {
                a.type in this.channels && this.channels[a.type].fire(a)
            },
            close: function() {
                b(null , null , "InAppBrowser", "close", [])
            },
            show: function() {
                b(null , null , "InAppBrowser", "show", [])
            },
            addEventListener: function(a, b) {
                a in this.channels && this.channels[a].subscribe(b)
            },
            removeEventListener: function(a, b) {
                a in this.channels && this.channels[a].unsubscribe(b)
            },
            executeScript: function(a, c) {
                if (a.code)
                    b(c, null , "InAppBrowser", "injectScriptCode", [a.code, !!c]);
                else {
                    if (!a.file)
                        throw new Error("executeScript requires exactly one of code or file to be specified");
                    b(c, null , "InAppBrowser", "injectScriptFile", [a.file, !!c])
                }
            },
            insertCSS: function(a, c) {
                if (a.code)
                    b(c, null , "InAppBrowser", "injectStyleCode", [a.code, !!c]);
                else {
                    if (!a.file)
                        throw new Error("insertCSS requires exactly one of code or file to be specified");
                    b(c, null , "InAppBrowser", "injectStyleFile", [a.file, !!c])
                }
            }
        },
        module.exports = function(c, e, f) {
            var g = new a
              , h = function(a) {
                g._eventHandler(a)
            };
            if (window.frames && window.frames[e]) {
                var i = d.getOriginalSymbol(window, "open");
                return i.apply(window, arguments)
            }
            return b(h, h, "InAppBrowser", "open", [c, e, f]),
            g
        }
    }),
    a("cordova/plugin/LocalFileSystem", function(require, exports, module) {
        var a = (require("cordova/exec"),
        function() {}
        );
        a.TEMPORARY = 0,
        a.PERSISTENT = 1,
        module.exports = a
    }),
    a("cordova/plugin/Media", function(require, exports, module) {
        var a = require("cordova/argscheck")
          , b = require("cordova/utils")
          , c = require("cordova/exec")
          , d = {}
          , e = function(e, f, g, h) {
            a.checkArgs("SFFF", "Media", arguments),
            this.id = b.createUUID(),
            d[this.id] = this,
            this.src = e,
            this.successCallback = f,
            this.errorCallback = g,
            this.statusCallback = h,
            this._duration = -1,
            this._position = -1,
            c(null , this.errorCallback, "Media", "create", [this.id, this.src])
        };
        e.MEDIA_STATE = 1,
        e.MEDIA_DURATION = 2,
        e.MEDIA_POSITION = 3,
        e.MEDIA_ERROR = 9,
        e.MEDIA_NONE = 0,
        e.MEDIA_STARTING = 1,
        e.MEDIA_RUNNING = 2,
        e.MEDIA_PAUSED = 3,
        e.MEDIA_STOPPED = 4,
        e.MEDIA_MSG = ["None", "Starting", "Running", "Paused", "Stopped"],
        e.get = function(a) {
            return d[a]
        }
        ,
        e.prototype.play = function(a) {
            c(null , null , "Media", "startPlayingAudio", [this.id, this.src, a])
        }
        ,
        e.prototype.stop = function() {
            var a = this;
            c(function() {
                a._position = 0
            }, this.errorCallback, "Media", "stopPlayingAudio", [this.id])
        }
        ,
        e.prototype.seekTo = function(a) {
            var b = this;
            c(function(a) {
                b._position = a
            }, this.errorCallback, "Media", "seekToAudio", [this.id, a])
        }
        ,
        e.prototype.pause = function() {
            c(null , this.errorCallback, "Media", "pausePlayingAudio", [this.id])
        }
        ,
        e.prototype.getDuration = function() {
            return this._duration
        }
        ,
        e.prototype.getCurrentPosition = function(a, b) {
            var d = this;
            c(function(b) {
                d._position = b,
                a(b)
            }, b, "Media", "getCurrentPositionAudio", [this.id])
        }
        ,
        e.prototype.startRecord = function() {
            c(null , this.errorCallback, "Media", "startRecordingAudio", [this.id, this.src])
        }
        ,
        e.prototype.stopRecord = function() {
            c(null , this.errorCallback, "Media", "stopRecordingAudio", [this.id])
        }
        ,
        e.prototype.release = function() {
            c(null , this.errorCallback, "Media", "release", [this.id])
        }
        ,
        e.prototype.setVolume = function(a) {
            c(null , null , "Media", "setVolume", [this.id, a])
        }
        ,
        e.onStatus = function(a, b, c) {
            var f = d[a];
            if (f)
                switch (b) {
                case e.MEDIA_STATE:
                    f.statusCallback && f.statusCallback(c),
                    c == e.MEDIA_STOPPED && f.successCallback && f.successCallback();
                    break;
                case e.MEDIA_DURATION:
                    f._duration = c;
                    break;
                case e.MEDIA_ERROR:
                    f.errorCallback && f.errorCallback(c);
                    break;
                case e.MEDIA_POSITION:
                    f._position = Number(c);
                    break;
                default:
                    console.error && console.error("Unhandled Media.onStatus :: " + b)
                }
            else
                console.error && console.error("Received Media.onStatus callback for unknown media :: " + a)
        }
        ,
        module.exports = e
    }),
    a("cordova/plugin/MediaError", function(require, exports, module) {
        var a = window.MediaError;
        a || (window.MediaError = a = function(a, b) {
            this.code = "undefined" != typeof a ? a : null ,
            this.message = b || ""
        }
        ),
        a.MEDIA_ERR_NONE_ACTIVE = a.MEDIA_ERR_NONE_ACTIVE || 0,
        a.MEDIA_ERR_ABORTED = a.MEDIA_ERR_ABORTED || 1,
        a.MEDIA_ERR_NETWORK = a.MEDIA_ERR_NETWORK || 2,
        a.MEDIA_ERR_DECODE = a.MEDIA_ERR_DECODE || 3,
        a.MEDIA_ERR_NONE_SUPPORTED = a.MEDIA_ERR_NONE_SUPPORTED || 4,
        a.MEDIA_ERR_SRC_NOT_SUPPORTED = a.MEDIA_ERR_SRC_NOT_SUPPORTED || 4,
        module.exports = a
    }),
    a("cordova/plugin/MediaFile", function(require, exports, module) {
        var a = require("cordova/utils")
          , b = require("cordova/exec")
          , c = require("cordova/plugin/File")
          , d = require("cordova/plugin/CaptureError")
          , e = function() {
            e.__super__.constructor.apply(this, arguments)
        };
        a.extend(e, c),
        e.prototype.getFormatData = function(a, c) {
            "undefined" == typeof this.fullPath || null === this.fullPath ? c(new d(d.CAPTURE_INVALID_ARGUMENT)) : b(a, c, "Capture", "getFormatData", [this.fullPath, this.type])
        }
        ,
        module.exports = e
    }),
    a("cordova/plugin/MediaFileData", function(require, exports, module) {
        var a = function(a, b, c, d, e) {
            this.codecs = a || null ,
            this.bitrate = b || 0,
            this.height = c || 0,
            this.width = d || 0,
            this.duration = e || 0
        };
        module.exports = a
    }),
    a("cordova/plugin/Metadata", function(require, exports, module) {
        var a = function(a) {
            this.modificationTime = "undefined" != typeof a ? new Date(a) : null
        };
        module.exports = a
    }),
    a("cordova/plugin/Position", function(require, exports, module) {
        var a = require("cordova/plugin/Coordinates")
          , b = function(b, c) {
            this.coords = b ? new a(b.latitude,b.longitude,b.altitude,b.accuracy,b.heading,b.velocity,b.altitudeAccuracy) : new a,
            this.timestamp = void 0 !== c ? c : new Date
        };
        module.exports = b
    }),
    a("cordova/plugin/PositionError", function(require, exports, module) {
        var a = function(a, b) {
            this.code = a || null ,
            this.message = b || ""
        };
        a.PERMISSION_DENIED = 1,
        a.POSITION_UNAVAILABLE = 2,
        a.TIMEOUT = 3,
        module.exports = a
    }),
    a("cordova/plugin/ProgressEvent", function(require, exports, module) {
        var a = function() {
            return function(a, b) {
                this.type = a,
                this.bubbles = !1,
                this.cancelBubble = !1,
                this.cancelable = !1,
                this.lengthComputable = !1,
                this.loaded = b && b.loaded ? b.loaded : 0,
                this.total = b && b.total ? b.total : 0,
                this.target = b && b.target ? b.target : null
            }
        }();
        module.exports = a
    }),
    a("cordova/plugin/accelerometer", function(require, exports, module) {
        function a() {
            g(function(a) {
                var b = k.slice(0);
                l = new h(a.x,a.y,a.z,a.timestamp);
                for (var c = 0, d = b.length; d > c; c++)
                    b[c].win(l)
            }, function(a) {
                for (var b = k.slice(0), c = 0, d = b.length; d > c; c++)
                    b[c].fail(a)
            }, "Accelerometer", "start", []),
            i = !0
        }
        function b() {
            g(null , null , "Accelerometer", "stop", []),
            i = !1
        }
        function c(a, b) {
            return {
                win: a,
                fail: b
            }
        }
        function d(a) {
            var c = k.indexOf(a);
            c > -1 && (k.splice(c, 1),
            0 === k.length && b())
        }
        var e = require("cordova/argscheck")
          , f = require("cordova/utils")
          , g = require("cordova/exec")
          , h = require("cordova/plugin/Acceleration")
          , i = !1
          , j = {}
          , k = []
          , l = null
          , m = {
            getCurrentAcceleration: function(b, f) {
                e.checkArgs("fFO", "accelerometer.getCurrentAcceleration", arguments);
                var g, h = function(a) {
                    d(g),
                    b(a)
                }, j = function(a) {
                    d(g),
                    f && f(a)
                };
                g = c(h, j),
                k.push(g),
                i || a()
            },
            watchAcceleration: function(b, g, h) {
                e.checkArgs("fFO", "accelerometer.watchAcceleration", arguments);
                var m = h && h.frequency && "number" == typeof h.frequency ? h.frequency : 1e4
                  , n = f.createUUID()
                  , o = c(function() {}, function(a) {
                    d(o),
                    g && g(a)
                });
                return k.push(o),
                j[n] = {
                    timer: window.setInterval(function() {
                        l && b(l)
                    }, m),
                    listeners: o
                },
                i ? l && b(l) : a(),
                n
            },
            clearWatch: function(a) {
                a && j[a] && (window.clearInterval(j[a].timer),
                d(j[a].listeners),
                delete j[a])
            }
        };
        module.exports = m
    }),
    a("cordova/plugin/accelerometer/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.defaults("cordova/plugin/Acceleration", "Acceleration"),
        a.defaults("cordova/plugin/accelerometer", "navigator.accelerometer")
    }),
    a("cordova/plugin/battery", function(require, exports, module) {
        function a() {
            return e.channels.batterystatus.numHandlers + e.channels.batterylow.numHandlers + e.channels.batterycritical.numHandlers
        }
        var b = require("cordova")
          , c = require("cordova/exec")
          , d = function() {
            this._level = null ,
            this._isPlugged = null ,
            this.channels = {
                batterystatus: b.addWindowEventHandler("batterystatus"),
                batterylow: b.addWindowEventHandler("batterylow"),
                batterycritical: b.addWindowEventHandler("batterycritical")
            };
            for (var a in this.channels)
                this.channels[a].onHasSubscribersChange = d.onHasSubscribersChange
        };
        d.onHasSubscribersChange = function() {
            1 === this.numHandlers && 1 === a() ? c(e._status, e._error, "Battery", "start", []) : 0 === a() && c(null , null , "Battery", "stop", [])
        }
        ,
        d.prototype._status = function(a) {
            if (a) {
                var c = e
                  , d = a.level;
                (c._level !== d || c._isPlugged !== a.isPlugged) && (b.fireWindowEvent("batterystatus", a),
                (20 === d || 5 === d) && (20 === d ? b.fireWindowEvent("batterylow", a) : b.fireWindowEvent("batterycritical", a))),
                c._level = d,
                c._isPlugged = a.isPlugged
            }
        }
        ,
        d.prototype._error = function(a) {
            console.log("Error initializing Battery: " + a)
        }
        ;
        var e = new d;
        module.exports = e
    }),
    a("cordova/plugin/battery/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.defaults("cordova/plugin/battery", "navigator.battery")
    }),
    a("cordova/plugin/camera/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.defaults("cordova/plugin/Camera", "navigator.camera"),
        a.defaults("cordova/plugin/CameraConstants", "Camera"),
        a.defaults("cordova/plugin/CameraPopoverOptions", "CameraPopoverOptions")
    }),
    a("cordova/plugin/capture", function(require, exports, module) {
        function a(a, b, e, f) {
            var g = function(a) {
                var c, e = [];
                for (c = 0; c < a.length; c++) {
                    var f = new d;
                    f.name = a[c].name,
                    f.fullPath = a[c].fullPath,
                    f.type = a[c].type,
                    f.lastModifiedDate = a[c].lastModifiedDate,
                    f.size = a[c].size,
                    e.push(f)
                }
                b(e)
            };
            c(g, e, "Capture", a, [f])
        }
        function b() {
            this.supportedAudioModes = [],
            this.supportedImageModes = [],
            this.supportedVideoModes = []
        }
        var c = require("cordova/exec")
          , d = require("cordova/plugin/MediaFile");
        b.prototype.captureAudio = function(b, c, d) {
            a("captureAudio", b, c, d)
        }
        ,
        b.prototype.captureImage = function(b, c, d) {
            a("captureImage", b, c, d)
        }
        ,
        b.prototype.captureVideo = function(b, c, d) {
            a("captureVideo", b, c, d)
        }
        ,
        module.exports = new b
    }),
    a("cordova/plugin/capture/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.clobbers("cordova/plugin/CaptureError", "CaptureError"),
        a.clobbers("cordova/plugin/CaptureAudioOptions", "CaptureAudioOptions"),
        a.clobbers("cordova/plugin/CaptureImageOptions", "CaptureImageOptions"),
        a.clobbers("cordova/plugin/CaptureVideoOptions", "CaptureVideoOptions"),
        a.clobbers("cordova/plugin/ConfigurationData", "ConfigurationData"),
        a.clobbers("cordova/plugin/MediaFile", "MediaFile"),
        a.clobbers("cordova/plugin/MediaFileData", "MediaFileData"),
        a.clobbers("cordova/plugin/capture", "navigator.device.capture")
    }),
    a("cordova/plugin/compass", function(require, exports, module) {
        var a = require("cordova/argscheck")
          , b = require("cordova/exec")
          , c = require("cordova/utils")
          , d = require("cordova/plugin/CompassHeading")
          , e = require("cordova/plugin/CompassError")
          , f = {}
          , g = {
            getCurrentHeading: function(c, f, g) {
                a.checkArgs("fFO", "compass.getCurrentHeading", arguments);
                var h = function(a) {
                    var b = new d(a.magneticHeading,a.trueHeading,a.headingAccuracy,a.timestamp);
                    c(b)
                }
                  , i = f && function(a) {
                    var b = new e(a);
                    f(b)
                }
                ;
                b(h, i, "Compass", "getHeading", [g])
            },
            watchHeading: function(b, d, e) {
                a.checkArgs("fFO", "compass.watchHeading", arguments);
                var h = void 0 !== e && void 0 !== e.frequency ? e.frequency : 100
                  , i = void 0 !== e && void 0 !== e.filter ? e.filter : 0
                  , j = c.createUUID();
                return i > 0 ? (f[j] = "iOS",
                g.getCurrentHeading(b, d, e)) : f[j] = window.setInterval(function() {
                    g.getCurrentHeading(b, d)
                }, h),
                j
            },
            clearWatch: function(a) {
                a && f[a] && ("iOS" != f[a] ? clearInterval(f[a]) : b(null , null , "Compass", "stopHeading", []),
                delete f[a])
            }
        };
        module.exports = g
    }),
    a("cordova/plugin/compass/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.clobbers("cordova/plugin/CompassHeading", "CompassHeading"),
        a.clobbers("cordova/plugin/CompassError", "CompassError"),
        a.clobbers("cordova/plugin/compass", "navigator.compass")
    }),
    a("cordova/plugin/console-via-logger", function(require, exports, module) {
        function a() {}
        function b(a, b) {
            return function() {
                var c = [].slice.call(arguments);
                try {
                    a.apply(e, c)
                } catch (f) {}
                try {
                    b.apply(d, c)
                } catch (f) {}
            }
        }
        var c = require("cordova/plugin/logger")
          , d = (require("cordova/utils"),
        module.exports)
          , e = window.console
          , f = !1
          , g = {};
        d.useLogger = function(a) {
            if (arguments.length && (f = !!a),
            f && c.useConsole())
                throw new Error("console and logger are too intertwingly");
            return f
        }
        ,
        d.log = function() {
            c.useConsole() || c.log.apply(c, [].slice.call(arguments))
        }
        ,
        d.error = function() {
            c.useConsole() || c.error.apply(c, [].slice.call(arguments))
        }
        ,
        d.warn = function() {
            c.useConsole() || c.warn.apply(c, [].slice.call(arguments))
        }
        ,
        d.info = function() {
            c.useConsole() || c.info.apply(c, [].slice.call(arguments))
        }
        ,
        d.debug = function() {
            c.useConsole() || c.debug.apply(c, [].slice.call(arguments))
        }
        ,
        d.assert = function(a) {
            if (!a) {
                var b = c.format.apply(c.format, [].slice.call(arguments, 1));
                d.log("ASSERT: " + b)
            }
        }
        ,
        d.clear = function() {}
        ,
        d.dir = function(a) {
            d.log("%o", a)
        }
        ,
        d.dirxml = function(a) {
            d.log(a.innerHTML)
        }
        ,
        d.trace = a,
        d.group = d.log,
        d.groupCollapsed = d.log,
        d.groupEnd = a,
        d.time = function(a) {
            g[a] = (new Date).valueOf()
        }
        ,
        d.timeEnd = function(a) {
            var b = g[a];
            if (!b)
                return d.warn("unknown timer: " + a),
                void 0;
            var c = (new Date).valueOf() - b;
            d.log(a + ": " + c + "ms")
        }
        ,
        d.timeStamp = a,
        d.profile = a,
        d.profileEnd = a,
        d.count = a,
        d.exception = d.log,
        d.table = function(a) {
            d.log("%o", a)
        }
        ;
        for (var h in d)
            "function" == typeof e[h] && (d[h] = b(e[h], d[h]))
    }),
    a("cordova/plugin/contacts", function(require, exports, module) {
        var a = require("cordova/argscheck")
          , b = require("cordova/exec")
          , c = require("cordova/plugin/ContactError")
          , d = (require("cordova/utils"),
        require("cordova/plugin/Contact"))
          , e = {
            find: function(d, f, g, h) {
                if (a.checkArgs("afFO", "contacts.find", arguments),
                d.length) {
                    var i = function(a) {
                        for (var b = [], c = 0, d = a.length; d > c; c++)
                            b.push(e.create(a[c]));
                        f(b)
                    };
                    b(i, g, "Contacts", "search", [d, h])
                } else
                    g && g(new c(c.INVALID_ARGUMENT_ERROR))
            },
            create: function(b) {
                a.checkArgs("O", "contacts.create", arguments);
                var c = new d;
                for (var e in b)
                    "undefined" != typeof c[e] && b.hasOwnProperty(e) && (c[e] = b[e]);
                return c
            }
        };
        module.exports = e
    }),
    a("cordova/plugin/contacts/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.clobbers("cordova/plugin/contacts", "navigator.contacts"),
        a.clobbers("cordova/plugin/Contact", "Contact"),
        a.clobbers("cordova/plugin/ContactAddress", "ContactAddress"),
        a.clobbers("cordova/plugin/ContactError", "ContactError"),
        a.clobbers("cordova/plugin/ContactField", "ContactField"),
        a.clobbers("cordova/plugin/ContactFindOptions", "ContactFindOptions"),
        a.clobbers("cordova/plugin/ContactName", "ContactName"),
        a.clobbers("cordova/plugin/ContactOrganization", "ContactOrganization")
    }),
    a("cordova/plugin/device", function(require, exports, module) {
        function a() {
            this.available = !1,
            this.platform = null ,
            this.version = null ,
            this.uuid = null ,
            this.cordova = null ,
            this.model = null ;
            var a = this;
            d.onCordovaReady.subscribe(function() {
                a.getInfo(function(c) {
                    var e = c.cordova;
                    e != b && (e += " JS=" + b),
                    a.available = !0,
                    a.platform = c.platform,
                    a.version = c.version,
                    a.uuid = c.uuid,
                    a.cordova = e,
                    a.model = c.model,
                    d.onCordovaInfoReady.fire()
                }, function(b) {
                    a.available = !1,
                    e.alert("[ERROR] Error initializing Cordova: " + b)
                })
            })
        }
        var c = require("cordova/argscheck")
          , d = require("cordova/channel")
          , e = require("cordova/utils")
          , f = require("cordova/exec");
        d.waitForInitialization("onCordovaInfoReady"),
        a.prototype.getInfo = function(a, b) {
            c.checkArgs("fF", "Device.getInfo", arguments),
            f(a, b, "Device", "getDeviceInfo", [])
        }
        ,
        module.exports = new a
    }),
    a("cordova/plugin/device/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.clobbers("cordova/plugin/device", "device")
    }),
    a("cordova/plugin/echo", function(require, exports, module) {
        var a = require("cordova/exec")
          , b = require("cordova/utils");
        module.exports = function(c, d, e, f) {
            var g = "echo"
              , h = "Array" == b.typeName(e)
              , i = h ? e : [e];
            "ArrayBuffer" == b.typeName(e) ? (f && console.warn("Cannot echo ArrayBuffer with forced async, falling back to sync."),
            g += "ArrayBuffer") : h ? (f && console.warn("Cannot echo MultiPart Array with forced async, falling back to sync."),
            g += "MultiPart") : f && (g += "Async"),
            a(c, d, "Echo", g, i)
        }
    }),
    a("cordova/plugin/file/symbols", function(require) {
        var a = require("cordova/modulemapper")
          , b = require("cordova/plugin/file/symbolshelper");
        b(a.clobbers),
        a.merges("cordova/plugin/ios/Entry", "Entry")
    }),
    a("cordova/plugin/file/symbolshelper", function(require, exports, module) {
        module.exports = function(a) {
            a("cordova/plugin/DirectoryEntry", "DirectoryEntry"),
            a("cordova/plugin/DirectoryReader", "DirectoryReader"),
            a("cordova/plugin/Entry", "Entry"),
            a("cordova/plugin/File", "File"),
            a("cordova/plugin/FileEntry", "FileEntry"),
            a("cordova/plugin/FileError", "FileError"),
            a("cordova/plugin/FileReader", "FileReader"),
            a("cordova/plugin/FileSystem", "FileSystem"),
            a("cordova/plugin/FileUploadOptions", "FileUploadOptions"),
            a("cordova/plugin/FileUploadResult", "FileUploadResult"),
            a("cordova/plugin/FileWriter", "FileWriter"),
            a("cordova/plugin/Flags", "Flags"),
            a("cordova/plugin/LocalFileSystem", "LocalFileSystem"),
            a("cordova/plugin/Metadata", "Metadata"),
            a("cordova/plugin/ProgressEvent", "ProgressEvent"),
            a("cordova/plugin/requestFileSystem", "requestFileSystem"),
            a("cordova/plugin/resolveLocalFileSystemURI", "resolveLocalFileSystemURI")
        }
    }),
    a("cordova/plugin/filetransfer/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.clobbers("cordova/plugin/FileTransfer", "FileTransfer"),
        a.clobbers("cordova/plugin/FileTransferError", "FileTransferError")
    }),
    a("cordova/plugin/geolocation", function(require, exports, module) {
        function a(a) {
            var b = {
                maximumAge: 0,
                enableHighAccuracy: !1,
                timeout: 1 / 0
            };
            return a && (void 0 !== a.maximumAge && !isNaN(a.maximumAge) && a.maximumAge > 0 && (b.maximumAge = a.maximumAge),
            void 0 !== a.enableHighAccuracy && (b.enableHighAccuracy = a.enableHighAccuracy),
            void 0 === a.timeout || isNaN(a.timeout) || (b.timeout = a.timeout < 0 ? 0 : a.timeout)),
            b
        }
        function b(a, b) {
            var c = setTimeout(function() {
                clearTimeout(c),
                c = null ,
                a({
                    code: f.TIMEOUT,
                    message: "Position retrieval timed out."
                })
            }, b);
            return c
        }
        var c = require("cordova/argscheck")
          , d = require("cordova/utils")
          , e = require("cordova/exec")
          , f = require("cordova/plugin/PositionError")
          , g = require("cordova/plugin/Position")
          , h = {}
          , i = {
            lastPosition: null ,
            getCurrentPosition: function(d, h, j) {
                c.checkArgs("fFO", "geolocation.getCurrentPosition", arguments),
                j = a(j);
                var k = {
                    timer: null
                }
                  , l = function(a) {
                    if (clearTimeout(k.timer),
                    k.timer) {
                        var b = new g({
                            latitude: a.latitude,
                            longitude: a.longitude,
                            altitude: a.altitude,
                            accuracy: a.accuracy,
                            heading: a.heading,
                            velocity: a.velocity,
                            altitudeAccuracy: a.altitudeAccuracy
                        },void 0 === a.timestamp ? new Date : a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp));
                        i.lastPosition = b,
                        d(b)
                    }
                }
                  , m = function(a) {
                    clearTimeout(k.timer),
                    k.timer = null ;
                    var b = new f(a.code,a.message);
                    h && h(b)
                };
                return i.lastPosition && j.maximumAge && (new Date).getTime() - i.lastPosition.timestamp.getTime() <= j.maximumAge ? d(i.lastPosition) : 0 === j.timeout ? m({
                    code: f.TIMEOUT,
                    message: "timeout value in PositionOptions set to 0 and no cached Position object available, or cached Position object's age exceeds provided PositionOptions' maximumAge parameter."
                }) : (k.timer = 1 / 0 !== j.timeout ? b(m, j.timeout) : !0,
                e(l, m, "Geolocation", "getLocation", [j.enableHighAccuracy, j.maximumAge])),
                k
            },
            watchPosition: function(j, k, l) {
                c.checkArgs("fFO", "geolocation.getCurrentPosition", arguments),
                l = a(l);
                var m = d.createUUID();
                h[m] = i.getCurrentPosition(j, k, l);
                var n = function(a) {
                    clearTimeout(h[m].timer);
                    var b = new f(a.code,a.message);
                    k && k(b)
                }
                  , o = function(a) {
                    clearTimeout(h[m].timer),
                    1 / 0 !== l.timeout && (h[m].timer = b(n, l.timeout));
                    var c = new g({
                        latitude: a.latitude,
                        longitude: a.longitude,
                        altitude: a.altitude,
                        accuracy: a.accuracy,
                        heading: a.heading,
                        velocity: a.velocity,
                        altitudeAccuracy: a.altitudeAccuracy
                    },void 0 === a.timestamp ? new Date : a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp));
                    i.lastPosition = c,
                    j(c)
                };
                return e(o, n, "Geolocation", "addWatch", [m, l.enableHighAccuracy]),
                m
            },
            clearWatch: function(a) {
                a && void 0 !== h[a] && (clearTimeout(h[a].timer),
                h[a].timer = !1,
                e(null , null , "Geolocation", "clearWatch", [a]))
            }
        };
        module.exports = i
    }),
    a("cordova/plugin/geolocation/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.defaults("cordova/plugin/geolocation", "navigator.geolocation"),
        a.clobbers("cordova/plugin/PositionError", "PositionError"),
        a.clobbers("cordova/plugin/Position", "Position"),
        a.clobbers("cordova/plugin/Coordinates", "Coordinates")
    }),
    a("cordova/plugin/globalization", function(require, exports, module) {
        var a = require("cordova/argscheck")
          , b = require("cordova/exec")
          , c = (require("cordova/plugin/GlobalizationError"),
        {
            getPreferredLanguage: function(c, d) {
                a.checkArgs("fF", "Globalization.getPreferredLanguage", arguments),
                b(c, d, "Globalization", "getPreferredLanguage", [])
            },
            getLocaleName: function(c, d) {
                a.checkArgs("fF", "Globalization.getLocaleName", arguments),
                b(c, d, "Globalization", "getLocaleName", [])
            },
            dateToString: function(c, d, e, f) {
                a.checkArgs("dfFO", "Globalization.dateToString", arguments);
                var g = c.valueOf();
                b(d, e, "Globalization", "dateToString", [{
                    date: g,
                    options: f
                }])
            },
            stringToDate: function(c, d, e, f) {
                a.checkArgs("sfFO", "Globalization.stringToDate", arguments),
                b(d, e, "Globalization", "stringToDate", [{
                    dateString: c,
                    options: f
                }])
            },
            getDatePattern: function(c, d, e) {
                a.checkArgs("fFO", "Globalization.getDatePattern", arguments),
                b(c, d, "Globalization", "getDatePattern", [{
                    options: e
                }])
            },
            getDateNames: function(c, d, e) {
                a.checkArgs("fFO", "Globalization.getDateNames", arguments),
                b(c, d, "Globalization", "getDateNames", [{
                    options: e
                }])
            },
            isDayLightSavingsTime: function(c, d, e) {
                a.checkArgs("dfF", "Globalization.isDayLightSavingsTime", arguments);
                var f = c.valueOf();
                b(d, e, "Globalization", "isDayLightSavingsTime", [{
                    date: f
                }])
            },
            getFirstDayOfWeek: function(c, d) {
                a.checkArgs("fF", "Globalization.getFirstDayOfWeek", arguments),
                b(c, d, "Globalization", "getFirstDayOfWeek", [])
            },
            numberToString: function(c, d, e, f) {
                a.checkArgs("nfFO", "Globalization.numberToString", arguments),
                b(d, e, "Globalization", "numberToString", [{
                    number: c,
                    options: f
                }])
            },
            stringToNumber: function(c, d, e, f) {
                a.checkArgs("sfFO", "Globalization.stringToNumber", arguments),
                b(d, e, "Globalization", "stringToNumber", [{
                    numberString: c,
                    options: f
                }])
            },
            getNumberPattern: function(c, d, e) {
                a.checkArgs("fFO", "Globalization.getNumberPattern", arguments),
                b(c, d, "Globalization", "getNumberPattern", [{
                    options: e
                }])
            },
            getCurrencyPattern: function(c, d, e) {
                a.checkArgs("sfF", "Globalization.getCurrencyPattern", arguments),
                b(d, e, "Globalization", "getCurrencyPattern", [{
                    currencyCode: c
                }])
            }
        });
        module.exports = c
    }),
    a("cordova/plugin/globalization/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.clobbers("cordova/plugin/globalization", "navigator.globalization"),
        a.clobbers("cordova/plugin/GlobalizationError", "GlobalizationError")
    }),
    a("cordova/plugin/inappbrowser/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.clobbers("cordova/plugin/InAppBrowser", "open")
    }),
    a("cordova/plugin/ios/Contact", function(require, exports, module) {
        var a = require("cordova/exec")
          , b = require("cordova/plugin/ContactError");
        module.exports = {
            display: function(c, d) {
                if (null === this.id) {
                    if ("function" == typeof c) {
                        var e = new b(b.UNKNOWN_ERROR);
                        c(e)
                    }
                } else
                    a(null , c, "Contacts", "displayContact", [this.id, d])
            }
        }
    }),
    a("cordova/plugin/ios/Entry", function(require, exports, module) {
        module.exports = {
            toURL: function() {
                return "file://localhost" + this.fullPath
            },
            toURI: function() {
                return console.log("DEPRECATED: Update your code to use 'toURL'"),
                "file://localhost" + this.fullPath
            }
        }
    }),
    a("cordova/plugin/ios/contacts", function(require, exports, module) {
        var a = require("cordova/exec");
        module.exports = {
            newContactUI: function(b) {
                a(b, null , "Contacts", "newContact", [])
            },
            chooseContact: function(b, c) {
                var d = function(a) {
                    var c = require("cordova/plugin/contacts").create(a);
                    b(c.id, c)
                };
                a(d, null , "Contacts", "chooseContact", [c])
            }
        }
    }),
    a("cordova/plugin/ios/contacts/symbols", function(require) {
        require("cordova/plugin/contacts/symbols");
        var a = require("cordova/modulemapper");
        a.merges("cordova/plugin/ios/contacts", "navigator.contacts"),
        a.merges("cordova/plugin/ios/Contact", "Contact")
    }),
    a("cordova/plugin/ios/geolocation/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.merges("cordova/plugin/geolocation", "navigator.geolocation")
    }),
    a("cordova/plugin/ios/logger/plugininit", function(require) {
        var a = require("cordova/plugin/logger");
        a.useConsole(!0)
    }),
    a("cordova/plugin/ios/logger/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.clobbers("cordova/plugin/logger", "console")
    }),
    a("cordova/plugin/ios/notification", function(require, exports, module) {
        var a = require("cordova/plugin/Media");
        module.exports = {
            beep: function() {
                new a("beep.wav").play()
            }
        }
    }),
    a("cordova/plugin/logger", function(require, exports) {
        function a(a, b) {
            b = [a].concat([].slice.call(b)),
            e.logLevel.apply(e, b)
        }
        function b(a, b) {
            if (null === a || void 0 === a)
                return [""];
            if (1 == arguments.length)
                return [a.toString()];
            "string" != typeof a && (a = a.toString());
            for (var d = /(.*?)%(.)(.*)/, e = a, f = []; b.length; ) {
                var g = d.exec(e);
                if (!g)
                    break;
                var h = b.shift();
                e = g[3],
                f.push(g[1]),
                "%" != g[2] ? f.push(c(h, g[2])) : (f.push("%"),
                b.unshift(h))
            }
            f.push(e);
            var i = [].slice.call(b);
            return i.unshift(f.join("")),
            i
        }
        function c(a, b) {
            try {
                switch (b) {
                case "j":
                case "o":
                    return JSON.stringify(a);
                case "c":
                    return ""
                }
            } catch (c) {
                return "error JSON.stringify()ing argument: " + c
            }
            return null === a || void 0 === a ? Object.prototype.toString.call(a) : a.toString()
        }
        for (var d, e = exports, f = require("cordova/exec"), g = (require("cordova/utils"),
        !0), h = !0, i = [], j = !1, k = console, l = ["LOG", "ERROR", "WARN", "INFO", "DEBUG"], m = {}, n = 0; n < l.length; n++) {
            var o = l[n];
            m[o] = n,
            e[o] = o
        }
        d = m.WARN,
        e.level = function(a) {
            if (arguments.length) {
                if (null === m[a])
                    throw new Error("invalid logging level: " + a);
                d = m[a]
            }
            return l[d]
        }
        ,
        e.useConsole = function(a) {
            if (arguments.length && (g = !!a),
            g) {
                if ("undefined" == typeof console)
                    throw new Error("global console object is not defined");
                if ("function" != typeof console.log)
                    throw new Error("global console object does not have a log function");
                if ("function" == typeof console.useLogger && console.useLogger())
                    throw new Error("console and logger are too intertwingly")
            }
            return g
        }
        ,
        e.useLogger = function(a) {
            return arguments.length && (h = !!a),
            h
        }
        ,
        e.log = function() {
            a("LOG", arguments)
        }
        ,
        e.error = function() {
            a("ERROR", arguments)
        }
        ,
        e.warn = function() {
            a("WARN", arguments)
        }
        ,
        e.info = function() {
            a("INFO", arguments)
        }
        ,
        e.debug = function() {
            a("DEBUG", arguments)
        }
        ,
        e.logLevel = function(a) {
            var b = [].slice.call(arguments, 1)
              , c = e.format.apply(e.format, b);
            if (null === m[a])
                throw new Error("invalid logging level: " + a);
            if (!(m[a] > d)) {
                if (!j && !g)
                    return i.push([a, c]),
                    void 0;
                if (h && f(null , null , "Logger", "logLevel", [a, c]),
                g) {
                    if (console.__usingCordovaLogger)
                        throw new Error("console and logger are too intertwingly");
                    switch (a) {
                    case e.LOG:
                        k.log(c);
                        break;
                    case e.ERROR:
                        k.log("ERROR: " + c);
                        break;
                    case e.WARN:
                        k.log("WARN: " + c);
                        break;
                    case e.INFO:
                        k.log("INFO: " + c);
                        break;
                    case e.DEBUG:
                        k.log("DEBUG: " + c)
                    }
                }
            }
        }
        ,
        e.format = function() {
            return b(arguments[0], [].slice.call(arguments, 1)).join(" ")
        }
        ,
        e.__onDeviceReady = function() {
            if (!j) {
                j = !0;
                for (var a = 0; a < i.length; a++) {
                    var b = i[a];
                    e.logLevel(b[0], b[1])
                }
                i = null
            }
        }
        ,
        document.addEventListener("deviceready", e.__onDeviceReady, !1)
    }),
    a("cordova/plugin/logger/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.clobbers("cordova/plugin/logger", "cordova.logger")
    }),
    a("cordova/plugin/media/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.defaults("cordova/plugin/Media", "Media"),
        a.clobbers("cordova/plugin/MediaError", "MediaError")
    }),
    a("cordova/plugin/network", function(require, exports, module) {
        function a() {
            this.type = "unknown"
        }
        var b = require("cordova/exec")
          , c = require("cordova")
          , d = require("cordova/channel")
          , e = require("cordova/utils");
        "undefined" != typeof navigator && e.defineGetter(navigator, "onLine", function() {
            return "none" != this.connection.type
        }),
        a.prototype.getInfo = function(a, c) {
            b(a, c, "NetworkStatus", "getConnectionInfo", [])
        }
        ;
        var f = new a
          , g = null
          , h = 500;
        d.onCordovaReady.subscribe(function() {
            f.getInfo(function(a) {
                f.type = a,
                "none" === a ? g = setTimeout(function() {
                    c.fireDocumentEvent("offline"),
                    g = null
                }, h) : (null !== g && (clearTimeout(g),
                g = null ),
                c.fireDocumentEvent("online")),
                2 !== d.onCordovaConnectionReady.state && d.onCordovaConnectionReady.fire()
            }, function(a) {
                2 !== d.onCordovaConnectionReady.state && d.onCordovaConnectionReady.fire(),
                console.log("Error initializing Network Connection: " + a)
            })
        }),
        module.exports = f
    }),
    a("cordova/plugin/networkstatus/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.clobbers("cordova/plugin/network", "navigator.network.connection", "navigator.network.connection is deprecated. Use navigator.connection instead."),
        a.clobbers("cordova/plugin/network", "navigator.connection"),
        a.defaults("cordova/plugin/Connection", "Connection")
    }),
    a("cordova/plugin/notification", function(require, exports, module) {
        var a = require("cordova/exec")
          , b = require("cordova/platform");
        module.exports = {
            alert: function(b, c, d, e) {
                var f = d || "Alert"
                  , g = e || "OK";
                a(c, null , "Notification", "alert", [b, f, g])
            },
            confirm: function(c, d, e, f) {
                var g = e || "Confirm"
                  , h = f || ["OK", "Cancel"];
                if ("string" == typeof h && console.log("Notification.confirm(string, function, string, string) is deprecated.  Use Notification.confirm(string, function, string, array)."),
                "android" == b.id || "ios" == b.id || "windowsphone" == b.id || "blackberry10" == b.id) {
                    if ("string" == typeof h) {
                        h = h.split(",")
                    }
                } else if (Array.isArray(h)) {
                    var i = h;
                    h = i.toString()
                }
                a(d, null , "Notification", "confirm", [c, g, h])
            },
            prompt: function(b, c, d, e, f) {
                var g = b || "Prompt message"
                  , h = d || "Prompt"
                  , i = e || ["OK", "Cancel"]
                  , j = f || "Default text";
                a(c, null , "Notification", "prompt", [g, h, i, j])
            },
            vibrate: function(b) {
                a(null , null , "Notification", "vibrate", [b])
            },
            beep: function(b) {
                a(null , null , "Notification", "beep", [b])
            }
        }
    }),
    a("cordova/plugin/notification/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.clobbers("cordova/plugin/notification", "navigator.notification"),
        a.merges("cordova/plugin/ios/notification", "navigator.notification")
    }),
    a("cordova/plugin/requestFileSystem", function(require, exports, module) {
        var a = require("cordova/argscheck")
          , b = require("cordova/plugin/FileError")
          , c = require("cordova/plugin/FileSystem")
          , d = require("cordova/exec")
          , e = function(e, f, g, h) {
            a.checkArgs("nnFF", "requestFileSystem", arguments);
            var i = function(a) {
                h && h(new b(a))
            };
            if (0 > e || e > 3)
                i(b.SYNTAX_ERR);
            else {
                var j = function(a) {
                    if (a) {
                        if (g) {
                            var d = new c(a.name,a.root);
                            g(d)
                        }
                    } else
                        i(b.NOT_FOUND_ERR)
                };
                d(j, i, "File", "requestFileSystem", [e, f])
            }
        };
        module.exports = e
    }),
    a("cordova/plugin/resolveLocalFileSystemURI", function(require, exports, module) {
        var a = require("cordova/argscheck")
          , b = require("cordova/plugin/DirectoryEntry")
          , c = require("cordova/plugin/FileEntry")
          , d = require("cordova/plugin/FileError")
          , e = require("cordova/exec");
        module.exports = function(f, g, h) {
            a.checkArgs("sFF", "resolveLocalFileSystemURI", arguments);
            var i = function(a) {
                h && h(new d(a))
            };
            if (!f || f.split(":").length > 2)
                return setTimeout(function() {
                    i(d.ENCODING_ERR)
                }, 0),
                void 0;
            var j = function(a) {
                var e;
                a ? g && (e = a.isDirectory ? new b(a.name,a.fullPath) : new c(a.name,a.fullPath),
                g(e)) : i(d.NOT_FOUND_ERR)
            };
            e(j, i, "File", "resolveLocalFileSystemURI", [f])
        }
    }),
    a("cordova/plugin/splashscreen", function(require, exports, module) {
        var a = require("cordova/exec")
          , b = {
            show: function() {
                a(null , null , "SplashScreen", "show", [])
            },
            hide: function() {
                a(null , null , "SplashScreen", "hide", [])
            }
        };
        module.exports = b
    }),
    a("cordova/plugin/splashscreen/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.clobbers("cordova/plugin/splashscreen", "navigator.splashscreen")
    }),
    a("cordova/symbols", function(require) {
        var a = require("cordova/modulemapper");
        a.merges("cordova", "cordova"),
        a.clobbers("cordova/exec", "cordova.exec"),
        a.clobbers("cordova/exec", "Cordova.exec")
    }),
    a("cordova/utils", function(require, exports) {
        function a(a) {
            for (var b = "", c = 0; a > c; c++) {
                var d = parseInt(256 * Math.random(), 10).toString(16);
                1 == d.length && (d = "0" + d),
                b += d
            }
            return b
        }
        var b = exports;
        b.defineGetterSetter = function(a, b, c, d) {
            if (Object.defineProperty) {
                var e = {
                    get: c,
                    configurable: !0
                };
                d && (e.set = d),
                Object.defineProperty(a, b, e)
            } else
                a.__defineGetter__(b, c),
                d && a.__defineSetter__(b, d)
        }
        ,
        b.defineGetter = b.defineGetterSetter,
        b.arrayIndexOf = function(a, b) {
            if (a.indexOf)
                return a.indexOf(b);
            for (var c = a.length, d = 0; c > d; ++d)
                if (a[d] == b)
                    return d;
            return -1
        }
        ,
        b.arrayRemove = function(a, c) {
            var d = b.arrayIndexOf(a, c);
            return -1 != d && a.splice(d, 1),
            -1 != d
        }
        ,
        b.typeName = function(a) {
            return Object.prototype.toString.call(a).slice(8, -1)
        }
        ,
        b.isArray = function(a) {
            return "Array" == b.typeName(a)
        }
        ,
        b.isDate = function(a) {
            return "Date" == b.typeName(a)
        }
        ,
        b.clone = function(a) {
            if (!a || "function" == typeof a || b.isDate(a) || "object" != typeof a)
                return a;
            var c, d;
            if (b.isArray(a)) {
                for (c = [],
                d = 0; d < a.length; ++d)
                    c.push(b.clone(a[d]));
                return c
            }
            c = {};
            for (d in a)
                d in c && c[d] == a[d] || (c[d] = b.clone(a[d]));
            return c
        }
        ,
        b.close = function(a, b, c) {
            return "undefined" == typeof c ? function() {
                return b.apply(a, arguments)
            }
            : function() {
                return b.apply(a, c)
            }
        }
        ,
        b.createUUID = function() {
            return a(4) + "-" + a(2) + "-" + a(2) + "-" + a(2) + "-" + a(6)
        }
        ,
        b.extend = function() {
            var a = function() {};
            return function(b, c) {
                a.prototype = c.prototype,
                b.prototype = new a,
                b.__super__ = c.prototype,
                b.prototype.constructor = b
            }
        }(),
        b.alert = function(a) {
            window.alert ? window.alert(a) : console && console.log && console.log(a)
        }
    }),
    window.cordova = require("cordova"),
    function(a) {
        function b(a) {
            for (var b = 0; b < a.length; ++b)
                2 != a[b].state && console.log("Channel not fired: " + a[b].type)
        }
        function c(a) {
            var b = function() {};
            b.prototype = a;
            var c = new b;
            if (b.bind)
                for (var d in a)
                    "function" == typeof a[d] && (c[d] = a[d].bind(a));
            return c
        }
        if (a._cordovaJsLoaded)
            throw new Error("cordova.js included multiple times.");
        a._cordovaJsLoaded = !0;
        var d = require("cordova/channel")
          , e = [d.onNativeReady, d.onPluginsReady];
        window.setTimeout(function() {
            2 != d.onDeviceReady.state && (console.log("deviceready has not fired after 5 seconds."),
            b(e),
            b(d.deviceReadyChannelsArray))
        }, 5e3),
        a.navigator && (a.navigator = c(a.navigator)),
        window._nativeReady && d.onNativeReady.fire(),
        d.join(function() {
            require("cordova/platform").initialize(),
            d.onCordovaReady.fire(),
            d.join(function() {
                require("cordova").fireDocumentEvent("deviceready")
            }, d.deviceReadyChannelsArray)
        }, e)
    }(window),
    require("cordova/channel").onNativeReady.fire(),
    function(a) {
        function b() {
            h--,
            0 === h && g && g()
        }
        function c() {
            h--,
            0 === h && g && g()
        }
        function d(a) {
            h++;
            var d = document.createElement("script");
            d.onload = b,
            d.onerror = c,
            d.src = a,
            document.head.appendChild(d)
        }
        function e() {
            a.cordova.require("cordova/channel").onPluginsReady.fire()
        }
        function f(b, c) {
            var f = a.cordova.require("cordova/modulemapper");
            g = function() {
                for (var c = 0; c < b.length; c++) {
                    var module = b[c];
                    if (module)
                        try {
                            if (module.clobbers && module.clobbers.length)
                                for (var d = 0; d < module.clobbers.length; d++)
                                    f.clobbers(module.id, module.clobbers[d]);
                            if (module.merges && module.merges.length)
                                for (var g = 0; g < module.merges.length; g++)
                                    f.merges(module.id, module.merges[g]);
                            !module.runs || module.clobbers && module.clobbers.length || module.merges && module.merges.length || a.cordova.require(module.id)
                        } catch (h) {}
                }
                e()
            }
            ;
            for (var h = 0; h < b.length; h++)
                d(c + b[h].file)
        }
        for (var g, h = 0, i = "", j = document.getElementsByTagName("script"), k = "cordova.js", l = j.length - 1; l > -1; l--) {
            var m = j[l].src;
            if (m.indexOf(k) == m.length - k.length) {
                i = m.substring(0, m.length - k.length);
                break
            }
        }
        var p = function() {
            try {
                var a = document.createElement("script");
                a.onload = function() {
                    var a = cordova.require("cordova/plugin_list");
                    f(a, i)
                }
                ,
                a.onerror = function() {
                    e()
                }
                ,
                a.src = o,
                document.head.appendChild(a)
            } catch (b) {
                e()
            }
        }
          , q = new XMLHttpRequest;
        q.onload = function() {
            var a;
            try {
                a = (0 == this.status || 200 == this.status) && this.responseText && JSON.parse(this.responseText)
            } catch (b) {}
            Array.isArray(a) && a.length > 0 ? f(a, i) : e()
        }
        ,
        q.onerror = function() {
            p()
        }
        ;
        try {
            q.open("GET", n, !0),
            q.send()
        } catch (r) {
            p()
        }
    }(window)
}();
var PhoneGap = cordova;