var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod2) => function __require() {
  try {
    return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
  } catch (e) {
    throw mod2 = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod2, secondTarget) => (__copyProps(target, mod2, "default"), secondTarget && __copyProps(secondTarget, mod2, "default"));
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// node_modules/@xmldom/xmldom/lib/conventions.js
var require_conventions = __commonJS({
  "node_modules/@xmldom/xmldom/lib/conventions.js"(exports) {
    "use strict";
    function find(list, predicate, ac) {
      if (ac === void 0) {
        ac = Array.prototype;
      }
      if (list && typeof ac.find === "function") {
        return ac.find.call(list, predicate);
      }
      for (var i = 0; i < list.length; i++) {
        if (hasOwn(list, i)) {
          var item = list[i];
          if (predicate.call(void 0, item, i, list)) {
            return item;
          }
        }
      }
    }
    function freeze(object, oc) {
      if (oc === void 0) {
        oc = Object;
      }
      if (oc && typeof oc.getOwnPropertyDescriptors === "function") {
        object = oc.create(null, oc.getOwnPropertyDescriptors(object));
      }
      return oc && typeof oc.freeze === "function" ? oc.freeze(object) : object;
    }
    function hasOwn(object, key) {
      return Object.prototype.hasOwnProperty.call(object, key);
    }
    function assign(target, source) {
      if (target === null || typeof target !== "object") {
        throw new TypeError("target is not an object");
      }
      for (var key in source) {
        if (hasOwn(source, key)) {
          target[key] = source[key];
        }
      }
      return target;
    }
    var HTML_BOOLEAN_ATTRIBUTES = freeze({
      allowfullscreen: true,
      async: true,
      autofocus: true,
      autoplay: true,
      checked: true,
      controls: true,
      default: true,
      defer: true,
      disabled: true,
      formnovalidate: true,
      hidden: true,
      ismap: true,
      itemscope: true,
      loop: true,
      multiple: true,
      muted: true,
      nomodule: true,
      novalidate: true,
      open: true,
      playsinline: true,
      readonly: true,
      required: true,
      reversed: true,
      selected: true
    });
    function isHTMLBooleanAttribute(name) {
      return hasOwn(HTML_BOOLEAN_ATTRIBUTES, name.toLowerCase());
    }
    var HTML_VOID_ELEMENTS = freeze({
      area: true,
      base: true,
      br: true,
      col: true,
      embed: true,
      hr: true,
      img: true,
      input: true,
      link: true,
      meta: true,
      param: true,
      source: true,
      track: true,
      wbr: true
    });
    function isHTMLVoidElement(tagName) {
      return hasOwn(HTML_VOID_ELEMENTS, tagName.toLowerCase());
    }
    var HTML_RAW_TEXT_ELEMENTS = freeze({
      script: false,
      style: false,
      textarea: true,
      title: true
    });
    function isHTMLRawTextElement(tagName) {
      var key = tagName.toLowerCase();
      return hasOwn(HTML_RAW_TEXT_ELEMENTS, key) && !HTML_RAW_TEXT_ELEMENTS[key];
    }
    function isHTMLEscapableRawTextElement(tagName) {
      var key = tagName.toLowerCase();
      return hasOwn(HTML_RAW_TEXT_ELEMENTS, key) && HTML_RAW_TEXT_ELEMENTS[key];
    }
    function isHTMLMimeType(mimeType) {
      return mimeType === MIME_TYPE.HTML;
    }
    function hasDefaultHTMLNamespace(mimeType) {
      return isHTMLMimeType(mimeType) || mimeType === MIME_TYPE.XML_XHTML_APPLICATION;
    }
    var MIME_TYPE = freeze({
      /**
       * `text/html`, the only mime type that triggers treating an XML document as HTML.
       *
       * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
       * @see https://en.wikipedia.org/wiki/HTML Wikipedia
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
       * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring
       *      WHATWG HTML Spec
       */
      HTML: "text/html",
      /**
       * `application/xml`, the standard mime type for XML documents.
       *
       * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType
       *      registration
       * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
       * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
       */
      XML_APPLICATION: "application/xml",
      /**
       * `text/xml`, an alias for `application/xml`.
       *
       * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
       * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
       * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
       */
      XML_TEXT: "text/xml",
      /**
       * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
       * but is parsed as an XML document.
       *
       * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType
       *      registration
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
       * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
       */
      XML_XHTML_APPLICATION: "application/xhtml+xml",
      /**
       * `image/svg+xml`,
       *
       * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
       * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
       * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
       */
      XML_SVG_IMAGE: "image/svg+xml"
    });
    var _MIME_TYPES = Object.keys(MIME_TYPE).map(function(key) {
      return MIME_TYPE[key];
    });
    function isValidMimeType(mimeType) {
      return _MIME_TYPES.indexOf(mimeType) > -1;
    }
    var NAMESPACE = freeze({
      /**
       * The XHTML namespace.
       *
       * @see http://www.w3.org/1999/xhtml
       */
      HTML: "http://www.w3.org/1999/xhtml",
      /**
       * The SVG namespace.
       *
       * @see http://www.w3.org/2000/svg
       */
      SVG: "http://www.w3.org/2000/svg",
      /**
       * The `xml:` namespace.
       *
       * @see http://www.w3.org/XML/1998/namespace
       */
      XML: "http://www.w3.org/XML/1998/namespace",
      /**
       * The `xmlns:` namespace.
       *
       * @see https://www.w3.org/2000/xmlns/
       */
      XMLNS: "http://www.w3.org/2000/xmlns/"
    });
    exports.assign = assign;
    exports.find = find;
    exports.freeze = freeze;
    exports.HTML_BOOLEAN_ATTRIBUTES = HTML_BOOLEAN_ATTRIBUTES;
    exports.HTML_RAW_TEXT_ELEMENTS = HTML_RAW_TEXT_ELEMENTS;
    exports.HTML_VOID_ELEMENTS = HTML_VOID_ELEMENTS;
    exports.hasDefaultHTMLNamespace = hasDefaultHTMLNamespace;
    exports.hasOwn = hasOwn;
    exports.isHTMLBooleanAttribute = isHTMLBooleanAttribute;
    exports.isHTMLRawTextElement = isHTMLRawTextElement;
    exports.isHTMLEscapableRawTextElement = isHTMLEscapableRawTextElement;
    exports.isHTMLMimeType = isHTMLMimeType;
    exports.isHTMLVoidElement = isHTMLVoidElement;
    exports.isValidMimeType = isValidMimeType;
    exports.MIME_TYPE = MIME_TYPE;
    exports.NAMESPACE = NAMESPACE;
  }
});

// node_modules/@xmldom/xmldom/lib/errors.js
var require_errors = __commonJS({
  "node_modules/@xmldom/xmldom/lib/errors.js"(exports) {
    "use strict";
    var conventions = require_conventions();
    function extendError(constructor, writableName) {
      constructor.prototype = Object.create(Error.prototype, {
        constructor: { value: constructor },
        name: { value: constructor.name, enumerable: true, writable: writableName }
      });
    }
    var DOMExceptionName = conventions.freeze({
      /**
       * the default value as defined by the spec
       */
      Error: "Error",
      /**
       * @deprecated
       * Use RangeError instead.
       */
      IndexSizeError: "IndexSizeError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      DomstringSizeError: "DomstringSizeError",
      HierarchyRequestError: "HierarchyRequestError",
      WrongDocumentError: "WrongDocumentError",
      InvalidCharacterError: "InvalidCharacterError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      NoDataAllowedError: "NoDataAllowedError",
      NoModificationAllowedError: "NoModificationAllowedError",
      NotFoundError: "NotFoundError",
      NotSupportedError: "NotSupportedError",
      InUseAttributeError: "InUseAttributeError",
      InvalidStateError: "InvalidStateError",
      SyntaxError: "SyntaxError",
      InvalidModificationError: "InvalidModificationError",
      NamespaceError: "NamespaceError",
      /**
       * @deprecated
       * Use TypeError for invalid arguments,
       * "NotSupportedError" DOMException for unsupported operations,
       * and "NotAllowedError" DOMException for denied requests instead.
       */
      InvalidAccessError: "InvalidAccessError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      ValidationError: "ValidationError",
      /**
       * @deprecated
       * Use TypeError instead.
       */
      TypeMismatchError: "TypeMismatchError",
      SecurityError: "SecurityError",
      NetworkError: "NetworkError",
      AbortError: "AbortError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      URLMismatchError: "URLMismatchError",
      QuotaExceededError: "QuotaExceededError",
      TimeoutError: "TimeoutError",
      InvalidNodeTypeError: "InvalidNodeTypeError",
      DataCloneError: "DataCloneError",
      EncodingError: "EncodingError",
      NotReadableError: "NotReadableError",
      UnknownError: "UnknownError",
      ConstraintError: "ConstraintError",
      DataError: "DataError",
      TransactionInactiveError: "TransactionInactiveError",
      ReadOnlyError: "ReadOnlyError",
      VersionError: "VersionError",
      OperationError: "OperationError",
      NotAllowedError: "NotAllowedError",
      OptOutError: "OptOutError"
    });
    var DOMExceptionNames = Object.keys(DOMExceptionName);
    function isValidDomExceptionCode(value) {
      return typeof value === "number" && value >= 1 && value <= 25;
    }
    function endsWithError(value) {
      return typeof value === "string" && value.substring(value.length - DOMExceptionName.Error.length) === DOMExceptionName.Error;
    }
    function DOMException(messageOrCode, nameOrMessage) {
      if (isValidDomExceptionCode(messageOrCode)) {
        this.name = DOMExceptionNames[messageOrCode];
        this.message = nameOrMessage || "";
      } else {
        this.message = messageOrCode;
        this.name = endsWithError(nameOrMessage) ? nameOrMessage : DOMExceptionName.Error;
      }
      if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
    }
    extendError(DOMException, true);
    Object.defineProperties(DOMException.prototype, {
      code: {
        enumerable: true,
        get: function() {
          var code = DOMExceptionNames.indexOf(this.name);
          if (isValidDomExceptionCode(code)) return code;
          return 0;
        }
      }
    });
    var ExceptionCode = {
      INDEX_SIZE_ERR: 1,
      DOMSTRING_SIZE_ERR: 2,
      HIERARCHY_REQUEST_ERR: 3,
      WRONG_DOCUMENT_ERR: 4,
      INVALID_CHARACTER_ERR: 5,
      NO_DATA_ALLOWED_ERR: 6,
      NO_MODIFICATION_ALLOWED_ERR: 7,
      NOT_FOUND_ERR: 8,
      NOT_SUPPORTED_ERR: 9,
      INUSE_ATTRIBUTE_ERR: 10,
      INVALID_STATE_ERR: 11,
      SYNTAX_ERR: 12,
      INVALID_MODIFICATION_ERR: 13,
      NAMESPACE_ERR: 14,
      INVALID_ACCESS_ERR: 15,
      VALIDATION_ERR: 16,
      TYPE_MISMATCH_ERR: 17,
      SECURITY_ERR: 18,
      NETWORK_ERR: 19,
      ABORT_ERR: 20,
      URL_MISMATCH_ERR: 21,
      QUOTA_EXCEEDED_ERR: 22,
      TIMEOUT_ERR: 23,
      INVALID_NODE_TYPE_ERR: 24,
      DATA_CLONE_ERR: 25
    };
    var entries = Object.entries(ExceptionCode);
    for (i = 0; i < entries.length; i++) {
      key = entries[i][0];
      DOMException[key] = entries[i][1];
    }
    var key;
    var i;
    function ParseError(message, locator, cause) {
      this.message = message;
      this.locator = locator;
      this.cause = cause;
      if (Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
    }
    extendError(ParseError);
    exports.DOMException = DOMException;
    exports.DOMExceptionName = DOMExceptionName;
    exports.ExceptionCode = ExceptionCode;
    exports.ParseError = ParseError;
  }
});

// node_modules/@xmldom/xmldom/lib/grammar.js
var require_grammar = __commonJS({
  "node_modules/@xmldom/xmldom/lib/grammar.js"(exports) {
    "use strict";
    function detectUnicodeSupport(RegExpImpl) {
      try {
        if (typeof RegExpImpl !== "function") {
          RegExpImpl = RegExp;
        }
        var match = new RegExpImpl("\u{1D306}", "u").exec("\u{1D306}");
        return !!match && match[0].length === 2;
      } catch (error) {
      }
      return false;
    }
    var UNICODE_SUPPORT = detectUnicodeSupport();
    function chars(regexp) {
      if (regexp.source[0] !== "[") {
        throw new Error(regexp + " can not be used with chars");
      }
      return regexp.source.slice(1, regexp.source.lastIndexOf("]"));
    }
    function chars_without(regexp, search) {
      if (regexp.source[0] !== "[") {
        throw new Error("/" + regexp.source + "/ can not be used with chars_without");
      }
      if (!search || typeof search !== "string") {
        throw new Error(JSON.stringify(search) + " is not a valid search");
      }
      if (regexp.source.indexOf(search) === -1) {
        throw new Error('"' + search + '" is not is /' + regexp.source + "/");
      }
      if (search === "-" && regexp.source.indexOf(search) !== 1) {
        throw new Error('"' + search + '" is not at the first postion of /' + regexp.source + "/");
      }
      return new RegExp(regexp.source.replace(search, ""), UNICODE_SUPPORT ? "u" : "");
    }
    function reg(args) {
      var self = this;
      return new RegExp(
        Array.prototype.slice.call(arguments).map(function(part) {
          var isStr = typeof part === "string";
          if (isStr && self === void 0 && part === "|") {
            throw new Error("use regg instead of reg to wrap expressions with `|`!");
          }
          return isStr ? part : part.source;
        }).join(""),
        UNICODE_SUPPORT ? "u" : ""
      );
    }
    function regg(args) {
      if (arguments.length === 0) {
        throw new Error("no parameters provided");
      }
      return reg.apply(regg, ["(?:"].concat(Array.prototype.slice.call(arguments), [")"]));
    }
    var UNICODE_REPLACEMENT_CHARACTER = "\uFFFD";
    var Char = /[-\x09\x0A\x0D\x20-\x2C\x2E-\uD7FF\uE000-\uFFFD]/;
    if (UNICODE_SUPPORT) {
      Char = reg("[", chars(Char), "\\u{10000}-\\u{10FFFF}", "]");
    }
    var InvalidChar = new RegExp("[^" + chars(Char) + "]", UNICODE_SUPPORT ? "u" : "");
    var _SChar = /[\x20\x09\x0D\x0A]/;
    var SChar_s = chars(_SChar);
    var S = reg(_SChar, "+");
    var S_OPT = reg(_SChar, "*");
    var NameStartChar = /[:_a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
    if (UNICODE_SUPPORT) {
      NameStartChar = reg("[", chars(NameStartChar), "\\u{10000}-\\u{10FFFF}", "]");
    }
    var NameStartChar_s = chars(NameStartChar);
    var NameChar = reg("[", NameStartChar_s, chars(/[-.0-9\xB7]/), chars(/[\u0300-\u036F\u203F-\u2040]/), "]");
    var Name = reg(NameStartChar, NameChar, "*");
    var Name_exact = reg("^", Name, "$");
    var Nmtoken = reg(NameChar, "+");
    var EntityRef = reg("&", Name, ";");
    var CharRef = regg(/&#[0-9]+;|&#x[0-9a-fA-F]+;/);
    var Reference = regg(EntityRef, "|", CharRef);
    var PEReference = reg("%", Name, ";");
    var EntityValue = regg(
      reg('"', regg(/[^%&"]/, "|", PEReference, "|", Reference), "*", '"'),
      "|",
      reg("'", regg(/[^%&']/, "|", PEReference, "|", Reference), "*", "'")
    );
    var AttValue = regg('"', regg(/[^<&"]/, "|", Reference), "*", '"', "|", "'", regg(/[^<&']/, "|", Reference), "*", "'");
    var NCNameStartChar = chars_without(NameStartChar, ":");
    var NCNameChar = chars_without(NameChar, ":");
    var NCName = reg(NCNameStartChar, NCNameChar, "*");
    var NCName_exact = reg("^", NCName, "$");
    var QName = reg(NCName, regg(":", NCName), "?");
    var QName_exact = reg("^", QName, "$");
    var QName_group = reg("(", QName, ")");
    var SystemLiteral = regg(/"[^"]*"|'[^']*'/);
    var PI2 = reg(/^<\?/, "(", Name, ")", regg(S, "(?!", _SChar, ")(", Char, "*?)"), "?", /\?>/);
    var PubidChar = /[\x20\x0D\x0Aa-zA-Z0-9-'()+,./:=?;!*#@$_%]/;
    var PubidLiteral = regg('"', PubidChar, '*"', "|", "'", chars_without(PubidChar, "'"), "*'");
    var COMMENT_START = "<!--";
    var COMMENT_END = "-->";
    var Comment = reg(COMMENT_START, regg(chars_without(Char, "-"), "|", reg("-", chars_without(Char, "-"))), "*", COMMENT_END);
    var PCDATA = "#PCDATA";
    var Mixed = regg(
      reg(/\(/, S_OPT, PCDATA, regg(S_OPT, /\|/, S_OPT, QName), "*", S_OPT, /\)\*/),
      "|",
      reg(/\(/, S_OPT, PCDATA, S_OPT, /\)/)
    );
    var _children_quantity = /[?*+]?/;
    var children = reg(
      /\([^>]+\)/,
      _children_quantity
      /*regg(choice, '|', seq), _children_quantity*/
    );
    var contentspec = regg("EMPTY", "|", "ANY", "|", Mixed, "|", children);
    var ELEMENTDECL_START = "<!ELEMENT";
    var elementdecl = reg(ELEMENTDECL_START, S, regg(QName, "|", PEReference), S, regg(contentspec, "|", PEReference), S_OPT, ">");
    var NotationType = reg("NOTATION", S, /\(/, S_OPT, Name, regg(S_OPT, /\|/, S_OPT, Name), "*", S_OPT, /\)/);
    var Enumeration = reg(/\(/, S_OPT, Nmtoken, regg(S_OPT, /\|/, S_OPT, Nmtoken), "*", S_OPT, /\)/);
    var EnumeratedType = regg(NotationType, "|", Enumeration);
    var AttType = regg(/CDATA|ID|IDREF|IDREFS|ENTITY|ENTITIES|NMTOKEN|NMTOKENS/, "|", EnumeratedType);
    var DefaultDecl = regg(/#REQUIRED|#IMPLIED/, "|", regg(regg("#FIXED", S), "?", AttValue));
    var AttDef = regg(S, Name, S, AttType, S, DefaultDecl);
    var ATTLIST_DECL_START = "<!ATTLIST";
    var AttlistDecl = reg(ATTLIST_DECL_START, S, Name, AttDef, "*", S_OPT, ">");
    var ABOUT_LEGACY_COMPAT = "about:legacy-compat";
    var ABOUT_LEGACY_COMPAT_SystemLiteral = regg('"' + ABOUT_LEGACY_COMPAT + '"', "|", "'" + ABOUT_LEGACY_COMPAT + "'");
    var SYSTEM = "SYSTEM";
    var PUBLIC = "PUBLIC";
    var ExternalID = regg(regg(SYSTEM, S, SystemLiteral), "|", regg(PUBLIC, S, PubidLiteral, S, SystemLiteral));
    var ExternalID_match = reg(
      "^",
      regg(
        regg(SYSTEM, S, "(?<SystemLiteralOnly>", SystemLiteral, ")"),
        "|",
        regg(PUBLIC, S, "(?<PubidLiteral>", PubidLiteral, ")", S, "(?<SystemLiteral>", SystemLiteral, ")")
      )
    );
    var PubidLiteral_match = reg("^", PubidLiteral, "$");
    var SystemLiteral_match = reg("^", SystemLiteral, "$");
    var NDataDecl = regg(S, "NDATA", S, Name);
    var EntityDef = regg(EntityValue, "|", regg(ExternalID, NDataDecl, "?"));
    var ENTITY_DECL_START = "<!ENTITY";
    var GEDecl = reg(ENTITY_DECL_START, S, Name, S, EntityDef, S_OPT, ">");
    var PEDef = regg(EntityValue, "|", ExternalID);
    var PEDecl = reg(ENTITY_DECL_START, S, "%", S, Name, S, PEDef, S_OPT, ">");
    var EntityDecl = regg(GEDecl, "|", PEDecl);
    var PublicID = reg(PUBLIC, S, PubidLiteral);
    var NotationDecl = reg("<!NOTATION", S, Name, S, regg(ExternalID, "|", PublicID), S_OPT, ">");
    var Eq = reg(S_OPT, "=", S_OPT);
    var VersionNum = /1[.]\d+/;
    var VersionInfo = reg(S, "version", Eq, regg("'", VersionNum, "'", "|", '"', VersionNum, '"'));
    var EncName = /[A-Za-z][-A-Za-z0-9._]*/;
    var EncodingDecl = regg(S, "encoding", Eq, regg('"', EncName, '"', "|", "'", EncName, "'"));
    var SDDecl = regg(S, "standalone", Eq, regg("'", regg("yes", "|", "no"), "'", "|", '"', regg("yes", "|", "no"), '"'));
    var XMLDecl = reg(/^<\?xml/, VersionInfo, EncodingDecl, "?", SDDecl, "?", S_OPT, /\?>/);
    var DOCTYPE_DECL_START = "<!DOCTYPE";
    var CDATA_START = "<![CDATA[";
    var CDATA_END = "]]>";
    var CDStart = /<!\[CDATA\[/;
    var CDEnd = /\]\]>/;
    var CData = reg(Char, "*?", CDEnd);
    var CDSect = reg(CDStart, CData);
    exports.chars = chars;
    exports.chars_without = chars_without;
    exports.detectUnicodeSupport = detectUnicodeSupport;
    exports.reg = reg;
    exports.regg = regg;
    exports.ABOUT_LEGACY_COMPAT = ABOUT_LEGACY_COMPAT;
    exports.ABOUT_LEGACY_COMPAT_SystemLiteral = ABOUT_LEGACY_COMPAT_SystemLiteral;
    exports.AttlistDecl = AttlistDecl;
    exports.CDATA_START = CDATA_START;
    exports.CDATA_END = CDATA_END;
    exports.CDSect = CDSect;
    exports.Char = Char;
    exports.Comment = Comment;
    exports.COMMENT_START = COMMENT_START;
    exports.COMMENT_END = COMMENT_END;
    exports.DOCTYPE_DECL_START = DOCTYPE_DECL_START;
    exports.elementdecl = elementdecl;
    exports.EntityDecl = EntityDecl;
    exports.EntityValue = EntityValue;
    exports.ExternalID = ExternalID;
    exports.ExternalID_match = ExternalID_match;
    exports.Name = Name;
    exports.Name_exact = Name_exact;
    exports.NCName_exact = NCName_exact;
    exports.NotationDecl = NotationDecl;
    exports.Reference = Reference;
    exports.PEReference = PEReference;
    exports.PI = PI2;
    exports.PUBLIC = PUBLIC;
    exports.PubidLiteral = PubidLiteral;
    exports.PubidLiteral_match = PubidLiteral_match;
    exports.QName = QName;
    exports.QName_exact = QName_exact;
    exports.QName_group = QName_group;
    exports.S = S;
    exports.SChar_s = SChar_s;
    exports.S_OPT = S_OPT;
    exports.SYSTEM = SYSTEM;
    exports.SystemLiteral = SystemLiteral;
    exports.SystemLiteral_match = SystemLiteral_match;
    exports.InvalidChar = InvalidChar;
    exports.UNICODE_REPLACEMENT_CHARACTER = UNICODE_REPLACEMENT_CHARACTER;
    exports.UNICODE_SUPPORT = UNICODE_SUPPORT;
    exports.XMLDecl = XMLDecl;
  }
});

// node_modules/@xmldom/xmldom/lib/dom.js
var require_dom = __commonJS({
  "node_modules/@xmldom/xmldom/lib/dom.js"(exports) {
    "use strict";
    var conventions = require_conventions();
    var find = conventions.find;
    var hasDefaultHTMLNamespace = conventions.hasDefaultHTMLNamespace;
    var hasOwn = conventions.hasOwn;
    var isHTMLMimeType = conventions.isHTMLMimeType;
    var isHTMLRawTextElement = conventions.isHTMLRawTextElement;
    var isHTMLVoidElement = conventions.isHTMLVoidElement;
    var MIME_TYPE = conventions.MIME_TYPE;
    var NAMESPACE = conventions.NAMESPACE;
    var PDC = /* @__PURE__ */ Symbol();
    var errors = require_errors();
    var DOMException = errors.DOMException;
    var DOMExceptionName = errors.DOMExceptionName;
    var g = require_grammar();
    function checkSymbol(symbol) {
      if (symbol !== PDC) {
        throw new TypeError("Illegal constructor");
      }
    }
    function notEmptyString(input) {
      return input !== "";
    }
    function splitOnASCIIWhitespace(input) {
      return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : [];
    }
    function orderedSetReducer(current, element) {
      if (!hasOwn(current, element)) {
        current[element] = true;
      }
      return current;
    }
    function toOrderedSet(input) {
      if (!input) return [];
      var list = splitOnASCIIWhitespace(input);
      return Object.keys(list.reduce(orderedSetReducer, {}));
    }
    function arrayIncludes(list) {
      return function(element) {
        return list && list.indexOf(element) !== -1;
      };
    }
    function validateQualifiedName(qualifiedName) {
      if (!g.QName_exact.test(qualifiedName)) {
        throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'invalid character in qualified name "' + qualifiedName + '"');
      }
    }
    function validateAndExtract(namespace, qualifiedName) {
      validateQualifiedName(qualifiedName);
      namespace = namespace || null;
      var prefix = null;
      var localName = qualifiedName;
      if (qualifiedName.indexOf(":") >= 0) {
        var splitResult = qualifiedName.split(":");
        prefix = splitResult[0];
        localName = splitResult[1];
      }
      if (prefix !== null && namespace === null) {
        throw new DOMException(DOMException.NAMESPACE_ERR, "prefix is non-null and namespace is null");
      }
      if (prefix === "xml" && namespace !== conventions.NAMESPACE.XML) {
        throw new DOMException(DOMException.NAMESPACE_ERR, 'prefix is "xml" and namespace is not the XML namespace');
      }
      if ((prefix === "xmlns" || qualifiedName === "xmlns") && namespace !== conventions.NAMESPACE.XMLNS) {
        throw new DOMException(
          DOMException.NAMESPACE_ERR,
          'either qualifiedName or prefix is "xmlns" and namespace is not the XMLNS namespace'
        );
      }
      if (namespace === conventions.NAMESPACE.XMLNS && prefix !== "xmlns" && qualifiedName !== "xmlns") {
        throw new DOMException(
          DOMException.NAMESPACE_ERR,
          'namespace is the XMLNS namespace and neither qualifiedName nor prefix is "xmlns"'
        );
      }
      return [namespace, prefix, localName];
    }
    function copy(src, dest) {
      for (var p in src) {
        if (hasOwn(src, p)) {
          dest[p] = src[p];
        }
      }
    }
    function _extends(Class, Super) {
      var pt = Class.prototype;
      if (!(pt instanceof Super)) {
        let t = function() {
        };
        t.prototype = Super.prototype;
        t = new t();
        copy(pt, t);
        Class.prototype = pt = t;
      }
      if (pt.constructor != Class) {
        if (typeof Class != "function") {
          console.error("unknown Class:" + Class);
        }
        pt.constructor = Class;
      }
    }
    var NodeType = {};
    var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
    var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
    var TEXT_NODE = NodeType.TEXT_NODE = 3;
    var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
    var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
    var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
    var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
    var COMMENT_NODE = NodeType.COMMENT_NODE = 8;
    var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
    var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
    var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
    var NOTATION_NODE = NodeType.NOTATION_NODE = 12;
    var DocumentPosition = conventions.freeze({
      DOCUMENT_POSITION_DISCONNECTED: 1,
      DOCUMENT_POSITION_PRECEDING: 2,
      DOCUMENT_POSITION_FOLLOWING: 4,
      DOCUMENT_POSITION_CONTAINS: 8,
      DOCUMENT_POSITION_CONTAINED_BY: 16,
      DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32
    });
    function commonAncestor(a, b) {
      if (b.length < a.length) return commonAncestor(b, a);
      var c = null;
      for (var n in a) {
        if (a[n] !== b[n]) return c;
        c = a[n];
      }
      return c;
    }
    function docGUID(doc) {
      if (!doc.guid) doc.guid = Math.random();
      return doc.guid;
    }
    function NodeList() {
    }
    NodeList.prototype = {
      /**
       * The number of nodes in the list. The range of valid child node indices is 0 to length-1
       * inclusive.
       *
       * @type {number}
       */
      length: 0,
      /**
       * Returns the item at `index`. If index is greater than or equal to the number of nodes in
       * the list, this returns null.
       *
       * @param index
       * Unsigned long Index into the collection.
       * @returns {Node | null}
       * The node at position `index` in the NodeList,
       * or null if that is not a valid index.
       */
      item: function(index) {
        return index >= 0 && index < this.length ? this[index] : null;
      },
      /**
       * Returns a string representation of the NodeList.
       *
       * Accepts the same `options` object as `XMLSerializer.prototype.serializeToString`
       * (`requireWellFormed`, `splitCDATASections`, `nodeFilter`). Passing a function is treated as
       * a legacy `nodeFilter` for backward compatibility.
       *
       * @param {Object | function} [options]
       * @param {boolean} [options.requireWellFormed=false]
       * @param {boolean} [options.splitCDATASections=true]
       * @param {function} [options.nodeFilter]
       * @returns {string}
       */
      toString: function(options) {
        var opts;
        if (typeof options === "function") {
          opts = { requireWellFormed: false, splitCDATASections: true, nodeFilter: options };
        } else if (!!options) {
          opts = {
            requireWellFormed: !!options.requireWellFormed,
            splitCDATASections: options.splitCDATASections !== false,
            nodeFilter: options.nodeFilter || null
          };
        } else {
          opts = { requireWellFormed: false, splitCDATASections: true, nodeFilter: null };
        }
        for (var buf = [], i = 0; i < this.length; i++) {
          serializeToString(this[i], buf, null, opts);
        }
        return buf.join("");
      },
      /**
       * Filters the NodeList based on a predicate.
       *
       * @param {function(Node): boolean} predicate
       * - A predicate function to filter the NodeList.
       * @returns {Node[]}
       * An array of nodes that satisfy the predicate.
       * @private
       */
      filter: function(predicate) {
        return Array.prototype.filter.call(this, predicate);
      },
      /**
       * Returns the first index at which a given node can be found in the NodeList, or -1 if it is
       * not present.
       *
       * @param {Node} item
       * - The Node item to locate in the NodeList.
       * @returns {number}
       * The first index of the node in the NodeList; -1 if not found.
       * @private
       */
      indexOf: function(item) {
        return Array.prototype.indexOf.call(this, item);
      }
    };
    NodeList.prototype[Symbol.iterator] = function() {
      var me = this;
      var index = 0;
      return {
        next: function() {
          if (index < me.length) {
            return {
              value: me[index++],
              done: false
            };
          } else {
            return {
              done: true
            };
          }
        },
        return: function() {
          return {
            done: true
          };
        }
      };
    };
    function LiveNodeList(node, refresh) {
      this._node = node;
      this._refresh = refresh;
      _updateLiveList(this);
    }
    function _updateLiveList(list) {
      var inc = list._node._inc || list._node.ownerDocument._inc;
      if (list._inc !== inc) {
        var ls = list._refresh(list._node);
        __set__(list, "length", ls.length);
        if (!list.$$length || ls.length < list.$$length) {
          for (var i = ls.length; i in list; i++) {
            if (hasOwn(list, i)) {
              delete list[i];
            }
          }
        }
        copy(ls, list);
        list._inc = inc;
      }
    }
    LiveNodeList.prototype.item = function(i) {
      _updateLiveList(this);
      return this[i] || null;
    };
    _extends(LiveNodeList, NodeList);
    function NamedNodeMap() {
      this._nsIndex = /* @__PURE__ */ Object.create(null);
      this._noNsIndex = /* @__PURE__ */ Object.create(null);
    }
    function _findNodeIndex(list, node) {
      var i = 0;
      while (i < list.length) {
        if (list[i] === node) {
          return i;
        }
        i++;
      }
    }
    function _nnmBucket(map, namespaceURI, create2) {
      if (!namespaceURI) {
        return map._noNsIndex;
      }
      var bucket = map._nsIndex[namespaceURI];
      if (!bucket && create2) {
        bucket = map._nsIndex[namespaceURI] = /* @__PURE__ */ Object.create(null);
      }
      return bucket;
    }
    function _nnmIndexFind(map, namespaceURI, localName) {
      var bucket = _nnmBucket(map, namespaceURI, false);
      var found = bucket && bucket[localName];
      return found ? found : null;
    }
    function _nnmIndexAdd(map, attr) {
      _nnmBucket(map, attr.namespaceURI, true)[attr.localName] = attr;
    }
    function _nnmIndexRemove(map, attr) {
      var bucket = _nnmBucket(map, attr.namespaceURI, false);
      if (bucket) {
        delete bucket[attr.localName];
      }
    }
    function _addNamedNode(el, list, newAttr, oldAttr) {
      if (oldAttr) {
        list[_findNodeIndex(list, oldAttr)] = newAttr;
      } else {
        list[list.length] = newAttr;
        list.length++;
      }
      _nnmIndexAdd(list, newAttr);
      if (el) {
        newAttr.ownerElement = el;
        var doc = el.ownerDocument;
        if (doc) {
          oldAttr && _onRemoveAttribute(doc, el, oldAttr);
          _onAddAttribute(doc, el, newAttr);
        }
      }
    }
    function _removeNamedNode(el, list, attr) {
      var i = _findNodeIndex(list, attr);
      if (i >= 0) {
        var lastIndex = list.length - 1;
        while (i <= lastIndex) {
          list[i] = list[++i];
        }
        list.length = lastIndex;
        _nnmIndexRemove(list, attr);
        if (el) {
          var doc = el.ownerDocument;
          if (doc) {
            _onRemoveAttribute(doc, el, attr);
          }
          attr.ownerElement = null;
        }
      }
    }
    NamedNodeMap.prototype = {
      length: 0,
      item: NodeList.prototype.item,
      /**
       * Get an attribute by name. Note: Name is in lower case in case of HTML namespace and
       * document.
       *
       * @param {string} localName
       * The local name of the attribute.
       * @returns {Attr | null}
       * The attribute with the given local name, or null if no such attribute exists.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name
       */
      getNamedItem: function(localName) {
        if (this._ownerElement && this._ownerElement._isInHTMLDocumentAndNamespace()) {
          localName = localName.toLowerCase();
        }
        var i = 0;
        while (i < this.length) {
          var attr = this[i];
          if (attr.nodeName === localName) {
            return attr;
          }
          i++;
        }
        return null;
      },
      /**
       * Set an attribute.
       *
       * @param {Attr} attr
       * The attribute to set.
       * @returns {Attr | null}
       * The old attribute with the same local name and namespace URI as the new one, or null if no
       * such attribute exists.
       * @throws {DOMException}
       * With code:
       * - {@link INUSE_ATTRIBUTE_ERR} - If the attribute is already an attribute of another
       * element.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
       */
      setNamedItem: function(attr) {
        var el = attr.ownerElement;
        if (el && el !== this._ownerElement) {
          throw new DOMException(DOMException.INUSE_ATTRIBUTE_ERR);
        }
        var oldAttr = _nnmIndexFind(this, attr.namespaceURI, attr.localName);
        if (oldAttr === attr) {
          return attr;
        }
        _addNamedNode(this._ownerElement, this, attr, oldAttr);
        return oldAttr;
      },
      /**
       * Set an attribute, replacing an existing attribute with the same local name and namespace
       * URI if one exists.
       *
       * @param {Attr} attr
       * The attribute to set.
       * @returns {Attr | null}
       * The old attribute with the same local name and namespace URI as the new one, or null if no
       * such attribute exists.
       * @throws {DOMException}
       * Throws a DOMException with the name "InUseAttributeError" if the attribute is already an
       * attribute of another element.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
       */
      setNamedItemNS: function(attr) {
        return this.setNamedItem(attr);
      },
      /**
       * Removes an attribute specified by the local name.
       *
       * @param {string} localName
       * The local name of the attribute to be removed.
       * @returns {Attr}
       * The attribute node that was removed.
       * @throws {DOMException}
       * With code:
       * - {@link DOMException.NOT_FOUND_ERR} if no attribute with the given name is found.
       * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditem
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-name
       */
      removeNamedItem: function(localName) {
        var attr = this.getNamedItem(localName);
        if (!attr) {
          throw new DOMException(DOMException.NOT_FOUND_ERR, localName);
        }
        _removeNamedNode(this._ownerElement, this, attr);
        return attr;
      },
      /**
       * Removes an attribute specified by the namespace and local name.
       *
       * @param {string | null} namespaceURI
       * The namespace URI of the attribute to be removed.
       * @param {string} localName
       * The local name of the attribute to be removed.
       * @returns {Attr}
       * The attribute node that was removed.
       * @throws {DOMException}
       * With code:
       * - {@link DOMException.NOT_FOUND_ERR} if no attribute with the given namespace URI and local
       * name is found.
       * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditemns
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-namespace
       */
      removeNamedItemNS: function(namespaceURI, localName) {
        var attr = this.getNamedItemNS(namespaceURI, localName);
        if (!attr) {
          throw new DOMException(DOMException.NOT_FOUND_ERR, namespaceURI ? namespaceURI + " : " + localName : localName);
        }
        _removeNamedNode(this._ownerElement, this, attr);
        return attr;
      },
      /**
       * Get an attribute by namespace and local name.
       *
       * @param {string | null} namespaceURI
       * The namespace URI of the attribute.
       * @param {string} localName
       * The local name of the attribute.
       * @returns {Attr | null}
       * The attribute with the given namespace URI and local name, or null if no such attribute
       * exists.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-namespace
       */
      getNamedItemNS: function(namespaceURI, localName) {
        if (!namespaceURI) {
          namespaceURI = null;
        }
        var i = 0;
        while (i < this.length) {
          var node = this[i];
          if (node.localName === localName && node.namespaceURI === namespaceURI) {
            return node;
          }
          i++;
        }
        return null;
      }
    };
    NamedNodeMap.prototype[Symbol.iterator] = function() {
      var me = this;
      var index = 0;
      return {
        next: function() {
          if (index < me.length) {
            return {
              value: me[index++],
              done: false
            };
          } else {
            return {
              done: true
            };
          }
        },
        return: function() {
          return {
            done: true
          };
        }
      };
    };
    function DOMImplementation() {
    }
    DOMImplementation.prototype = {
      /**
       * Test if the DOM implementation implements a specific feature and version, as specified in
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/core.html#DOMFeatures DOM Features}.
       *
       * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given
       * feature is supported. The different implementations fairly diverged in what kind of
       * features were reported. The latest version of the spec settled to force this method to
       * always return true, where the functionality was accurate and in use.
       *
       * @deprecated
       * It is deprecated and modern browsers return true in all cases.
       * @function DOMImplementation#hasFeature
       * @param {string} feature
       * The name of the feature to test.
       * @param {string} [version]
       * This is the version number of the feature to test.
       * @returns {boolean}
       * Always returns true.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
       * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-5CED94D7 DOM Level 3 Core
       */
      hasFeature: function(feature, version) {
        return true;
      },
      /**
       * Creates a DOM Document object of the specified type with its document element. Note that
       * based on the {@link DocumentType}
       * given to create the document, the implementation may instantiate specialized
       * {@link Document} objects that support additional features than the "Core", such as "HTML"
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#DOM2HTML DOM Level 2 HTML}.
       * On the other hand, setting the {@link DocumentType} after the document was created makes
       * this very unlikely to happen. Alternatively, specialized {@link Document} creation methods,
       * such as createHTMLDocument
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#DOM2HTML DOM Level 2 HTML},
       * can be used to obtain specific types of {@link Document} objects.
       *
       * __It behaves slightly different from the description in the living standard__:
       * - There is no interface/class `XMLDocument`, it returns a `Document`
       * instance (with it's `type` set to `'xml'`).
       * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
       *
       * @function DOMImplementation.createDocument
       * @param {string | null} namespaceURI
       * The
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-namespaceURI namespace URI}
       * of the document element to create or null.
       * @param {string | null} qualifiedName
       * The
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-qualifiedname qualified name}
       * of the document element to be created or null.
       * @param {DocumentType | null} [doctype=null]
       * The type of document to be created or null. When doctype is not null, its
       * {@link Node#ownerDocument} attribute is set to the document being created. Default is
       * `null`
       * @returns {Document}
       * A new {@link Document} object with its document element. If the NamespaceURI,
       * qualifiedName, and doctype are null, the returned {@link Document} is empty with no
       * document element.
       * @throws {DOMException}
       * With code:
       *
       * - `INVALID_CHARACTER_ERR`: Raised if the specified qualified name is not an XML name
       * according to {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#XML XML 1.0}.
       * - `NAMESPACE_ERR`: Raised if the qualifiedName is malformed, if the qualifiedName has a
       * prefix and the namespaceURI is null, or if the qualifiedName is null and the namespaceURI
       * is different from null, or if the qualifiedName has a prefix that is "xml" and the
       * namespaceURI is different from "{@link http://www.w3.org/XML/1998/namespace}"
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#Namespaces XML Namespaces},
       * or if the DOM implementation does not support the "XML" feature but a non-null namespace
       * URI was provided, since namespaces were defined by XML.
       * - `WRONG_DOCUMENT_ERR`: Raised if doctype has already been used with a different document
       * or was created from a different implementation.
       * - `NOT_SUPPORTED_ERR`: May be raised if the implementation does not support the feature
       * "XML" and the language exposed through the Document does not support XML Namespaces (such
       * as {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#HTML40 HTML 4.01}).
       * @since DOM Level 2.
       * @see {@link #createHTMLDocument}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument DOM Living Standard
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Level-2-Core-DOM-createDocument DOM
       *      Level 3 Core
       * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM
       *      Level 2 Core (initial)
       */
      createDocument: function(namespaceURI, qualifiedName, doctype) {
        var contentType = MIME_TYPE.XML_APPLICATION;
        if (namespaceURI === NAMESPACE.HTML) {
          contentType = MIME_TYPE.XML_XHTML_APPLICATION;
        } else if (namespaceURI === NAMESPACE.SVG) {
          contentType = MIME_TYPE.XML_SVG_IMAGE;
        }
        var doc = new Document(PDC, { contentType });
        doc.implementation = this;
        doc.childNodes = new NodeList();
        doc.doctype = doctype || null;
        if (doctype) {
          doc.appendChild(doctype);
        }
        if (qualifiedName) {
          var root = doc.createElementNS(namespaceURI, qualifiedName);
          doc.appendChild(root);
        }
        return doc;
      },
      /**
       * Creates an empty DocumentType node. Entity declarations and notations are not made
       * available. Entity reference expansions and default attribute additions do not occur.
       *
       * **This behavior is slightly different from the one in the specs**:
       * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
       * - `publicId` and `systemId` contain the raw data including any possible quotes,
       *   so they can always be serialized back to the original value
       * - `internalSubset` contains the raw string between `[` and `]` if present,
       *   but is not parsed or validated in any form.
       *
       * @function DOMImplementation#createDocumentType
       * @param {string} qualifiedName
       * The {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-qualifiedname qualified
       * name} of the document type to be created.
       * @param {string} [publicId]
       * The external subset public identifier. Stored verbatim including surrounding quotes.
       * When serialized with `requireWellFormed: true`, the serializer throws `InvalidStateError`
       * if the value is non-empty and does not match the XML `PubidLiteral` production
       * (W3C DOM Parsing §3.2.1.3; XML 1.0 production [12]). Creation-time validation is not
       * enforced — deferred to a future breaking release.
       * @param {string} [systemId]
       * The external subset system identifier. Stored verbatim including surrounding quotes.
       * When serialized with `requireWellFormed: true`, the serializer throws `InvalidStateError`
       * if the value is non-empty and does not match the XML `SystemLiteral` production
       * (W3C DOM Parsing §3.2.1.3; XML 1.0 production [11]). Creation-time validation is not
       * enforced — deferred to a future breaking release.
       * @param {string} [internalSubset]
       * The internal subset or an empty string if it is not present. Stored verbatim.
       * When serialized with `requireWellFormed: true`, the serializer throws `InvalidStateError`
       * if the value contains `"]>"`. Creation-time validation is not enforced.
       * @returns {DocumentType}
       * A new {@link DocumentType} node with {@link Node#ownerDocument} set to null.
       * @throws {DOMException}
       * With code:
       *
       * - `INVALID_CHARACTER_ERR`: Raised if the specified qualified name is not an XML name
       * according to {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#XML XML 1.0}.
       * - `NAMESPACE_ERR`: Raised if the qualifiedName is malformed.
       * - `NOT_SUPPORTED_ERR`: May be raised if the implementation does not support the feature
       * "XML" and the language exposed through the Document does not support XML Namespaces (such
       * as {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#HTML40 HTML 4.01}).
       * @since DOM Level 2.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType
       *      MDN
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living
       *      Standard
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Level-3-Core-DOM-createDocType DOM
       *      Level 3 Core
       * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM
       *      Level 2 Core
       * @see https://github.com/xmldom/xmldom/blob/master/CHANGELOG.md#050
       * @see https://www.w3.org/TR/DOM-Level-2-Core/#core-ID-Core-DocType-internalSubset
       * @prettierignore
       */
      createDocumentType: function(qualifiedName, publicId, systemId, internalSubset) {
        validateQualifiedName(qualifiedName);
        var node = new DocumentType(PDC);
        node.name = qualifiedName;
        node.nodeName = qualifiedName;
        node.publicId = publicId || "";
        node.systemId = systemId || "";
        node.internalSubset = internalSubset || "";
        node.childNodes = new NodeList();
        return node;
      },
      /**
       * Returns an HTML document, that might already have a basic DOM structure.
       *
       * __It behaves slightly different from the description in the living standard__:
       * - If the first argument is `false` no initial nodes are added (steps 3-7 in the specs are
       * omitted)
       * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
       *
       * @param {string | false} [title]
       * A string containing the title to give the new HTML document.
       * @returns {Document}
       * The HTML document.
       * @since WHATWG Living Standard.
       * @see {@link #createDocument}
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createhtmldocument
       * @see https://dom.spec.whatwg.org/#html-document
       */
      createHTMLDocument: function(title) {
        var doc = new Document(PDC, { contentType: MIME_TYPE.HTML });
        doc.implementation = this;
        doc.childNodes = new NodeList();
        if (title !== false) {
          doc.doctype = this.createDocumentType("html");
          doc.doctype.ownerDocument = doc;
          doc.appendChild(doc.doctype);
          var htmlNode = doc.createElement("html");
          doc.appendChild(htmlNode);
          var headNode = doc.createElement("head");
          htmlNode.appendChild(headNode);
          if (typeof title === "string") {
            var titleNode = doc.createElement("title");
            titleNode.appendChild(doc.createTextNode(title));
            headNode.appendChild(titleNode);
          }
          htmlNode.appendChild(doc.createElement("body"));
        }
        return doc;
      }
    };
    function Node(symbol) {
      checkSymbol(symbol);
    }
    Node.prototype = {
      /**
       * The first child of this node.
       *
       * @type {Node | null}
       */
      firstChild: null,
      /**
       * The last child of this node.
       *
       * @type {Node | null}
       */
      lastChild: null,
      /**
       * The previous sibling of this node.
       *
       * @type {Node | null}
       */
      previousSibling: null,
      /**
       * The next sibling of this node.
       *
       * @type {Node | null}
       */
      nextSibling: null,
      /**
       * The parent node of this node.
       *
       * @type {Node | null}
       */
      parentNode: null,
      /**
       * The parent element of this node.
       *
       * @type {Element | null}
       */
      get parentElement() {
        return this.parentNode && this.parentNode.nodeType === this.ELEMENT_NODE ? this.parentNode : null;
      },
      /**
       * The child nodes of this node.
       *
       * @type {NodeList}
       */
      childNodes: null,
      /**
       * The document object associated with this node.
       *
       * @type {Document | null}
       */
      ownerDocument: null,
      /**
       * The value of this node.
       *
       * @type {string | null}
       */
      nodeValue: null,
      /**
       * The namespace URI of this node.
       *
       * @type {string | null}
       */
      namespaceURI: null,
      /**
       * The prefix of the namespace for this node.
       *
       * @type {string | null}
       */
      prefix: null,
      /**
       * The local part of the qualified name of this node.
       *
       * @type {string | null}
       */
      localName: null,
      /**
       * The baseURI is currently always `about:blank`,
       * since that's what happens when you create a document from scratch.
       *
       * @type {'about:blank'}
       */
      baseURI: "about:blank",
      /**
       * Is true if this node is part of a document.
       *
       * @type {boolean}
       */
      get isConnected() {
        var rootNode = this.getRootNode();
        return rootNode && rootNode.nodeType === rootNode.DOCUMENT_NODE;
      },
      /**
       * Checks whether `other` is an inclusive descendant of this node.
       *
       * @param {Node | null | undefined} other
       * The node to check.
       * @returns {boolean}
       * True if `other` is an inclusive descendant of this node; false otherwise.
       * @see https://dom.spec.whatwg.org/#dom-node-contains
       */
      contains: function(other) {
        if (!other) return false;
        var parent = other;
        do {
          if (this === parent) return true;
          parent = parent.parentNode;
        } while (parent);
        return false;
      },
      /**
       * @typedef GetRootNodeOptions
       * @property {boolean} [composed=false]
       */
      /**
       * Searches for the root node of this node.
       *
       * **This behavior is slightly different from the in the specs**:
       * - ignores `options.composed`, since `ShadowRoot`s are unsupported, always returns root.
       *
       * @param {GetRootNodeOptions} [options]
       * @returns {Node}
       * Root node.
       * @see https://dom.spec.whatwg.org/#dom-node-getrootnode
       * @see https://dom.spec.whatwg.org/#concept-shadow-including-root
       */
      getRootNode: function(options) {
        var parent = this;
        do {
          if (!parent.parentNode) {
            return parent;
          }
          parent = parent.parentNode;
        } while (parent);
      },
      /**
       * Checks whether the given node is equal to this node.
       *
       * Two nodes are equal when they have the same type, defining characteristics (for the type),
       * and the same childNodes. The comparison is iterative to avoid stack overflows on
       * deeply-nested trees. Attribute nodes of each Element pair are also pushed onto the stack
       * and compared the same way.
       *
       * @param {Node} [otherNode]
       * @returns {boolean}
       * @see https://dom.spec.whatwg.org/#concept-node-equals
       * @see ../docs/walk-dom.md.
       */
      isEqualNode: function(otherNode) {
        if (!otherNode) return false;
        var stack = [{ node: this, other: otherNode }];
        while (stack.length > 0) {
          var pair = stack.pop();
          var node = pair.node;
          var other = pair.other;
          if (node.nodeType !== other.nodeType) return false;
          switch (node.nodeType) {
            case node.DOCUMENT_TYPE_NODE:
              if (node.name !== other.name) return false;
              if (node.publicId !== other.publicId) return false;
              if (node.systemId !== other.systemId) return false;
              break;
            case node.ELEMENT_NODE:
              if (node.namespaceURI !== other.namespaceURI) return false;
              if (node.prefix !== other.prefix) return false;
              if (node.localName !== other.localName) return false;
              if (node.attributes.length !== other.attributes.length) return false;
              for (var i = 0; i < node.attributes.length; i++) {
                var attr = node.attributes.item(i);
                var otherAttr = other.getAttributeNodeNS(attr.namespaceURI, attr.localName);
                if (!otherAttr) return false;
                stack.push({ node: attr, other: otherAttr });
              }
              break;
            case node.ATTRIBUTE_NODE:
              if (node.namespaceURI !== other.namespaceURI) return false;
              if (node.localName !== other.localName) return false;
              if (node.value !== other.value) return false;
              break;
            case node.PROCESSING_INSTRUCTION_NODE:
              if (node.target !== other.target || node.data !== other.data) return false;
              break;
            case node.TEXT_NODE:
            case node.CDATA_SECTION_NODE:
            case node.COMMENT_NODE:
              if (node.data !== other.data) return false;
              break;
          }
          if (node.childNodes.length !== other.childNodes.length) return false;
          for (var i = node.childNodes.length - 1; i >= 0; i--) {
            stack.push({ node: node.childNodes[i], other: other.childNodes[i] });
          }
        }
        return true;
      },
      /**
       * Checks whether or not the given node is this node.
       *
       * @param {Node} [otherNode]
       */
      isSameNode: function(otherNode) {
        return this === otherNode;
      },
      /**
       * Inserts a node before a reference node as a child of this node.
       *
       * @param {Node} newChild
       * The new child node to be inserted.
       * @param {Node | null} refChild
       * The reference node before which newChild will be inserted.
       * @returns {Node}
       * The new child node successfully inserted.
       * @throws {DOMException}
       * Throws a DOMException if inserting the node would result in a DOM tree that is not
       * well-formed, or if `child` is provided but is not a child of `parent`.
       * See {@link _insertBefore} for more details.
       * @since Modified in DOM L2
       */
      insertBefore: function(newChild, refChild) {
        return _insertBefore(this, newChild, refChild);
      },
      /**
       * Replaces an old child node with a new child node within this node.
       *
       * @param {Node} newChild
       * The new node that is to replace the old node.
       * If it already exists in the DOM, it is removed from its original position.
       * @param {Node} oldChild
       * The existing child node to be replaced.
       * @returns {Node}
       * Returns the replaced child node.
       * @throws {DOMException}
       * Throws a DOMException if replacing the node would result in a DOM tree that is not
       * well-formed, or if `oldChild` is not a child of `this`.
       * This can also occur if the pre-replacement validity assertion fails.
       * See {@link _insertBefore}, {@link Node.removeChild}, and
       * {@link assertPreReplacementValidityInDocument} for more details.
       * @see https://dom.spec.whatwg.org/#concept-node-replace
       */
      replaceChild: function(newChild, oldChild) {
        _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
        if (oldChild) {
          this.removeChild(oldChild);
        }
      },
      /**
       * Removes an existing child node from this node.
       *
       * @param {Node} oldChild
       * The child node to be removed.
       * @returns {Node}
       * Returns the removed child node.
       * @throws {DOMException}
       * Throws a DOMException if `oldChild` is not a child of `this`.
       * See {@link _removeChild} for more details.
       */
      removeChild: function(oldChild) {
        return _removeChild(this, oldChild);
      },
      /**
       * Appends a child node to this node.
       *
       * @param {Node} newChild
       * The child node to be appended to this node.
       * If it already exists in the DOM, it is removed from its original position.
       * @returns {Node}
       * Returns the appended child node.
       * @throws {DOMException}
       * Throws a DOMException if appending the node would result in a DOM tree that is not
       * well-formed, or if `newChild` is not a valid Node.
       * See {@link insertBefore} for more details.
       */
      appendChild: function(newChild) {
        return this.insertBefore(newChild, null);
      },
      /**
       * Determines whether this node has any child nodes.
       *
       * @returns {boolean}
       * Returns true if this node has any child nodes, and false otherwise.
       */
      hasChildNodes: function() {
        return this.firstChild != null;
      },
      /**
       * Creates a copy of the calling node.
       *
       * @param {boolean} deep
       * If true, the contents of the node are recursively copied.
       * If false, only the node itself (and its attributes, if it is an element) are copied.
       * @returns {Node}
       * Returns the newly created copy of the node.
       * @throws {DOMException}
       * May throw a DOMException if operations within {@link Element#setAttributeNode} or
       * {@link Node#appendChild} (which are potentially invoked in this method) do not meet their
       * specific constraints.
       * @see {@link cloneNode}
       */
      cloneNode: function(deep) {
        return cloneNode(this.ownerDocument || this, this, deep);
      },
      /**
       * Puts the specified node and all of its subtree into a "normalized" form. In a normalized
       * subtree, no text nodes in the subtree are empty and there are no adjacent text nodes.
       *
       * Specifically, this method merges any adjacent text nodes (i.e., nodes for which `nodeType`
       * is `TEXT_NODE`) into a single node with the combined data. It also removes any empty text
       * nodes.
       *
       * This method iterativly traverses all child nodes to normalize all descendent nodes within
       * the subtree.
       *
       * @throws {DOMException}
       * May throw a DOMException if operations within removeChild or appendData (which are
       * potentially invoked in this method) do not meet their specific constraints.
       * @since Modified in DOM Level 2
       * @see {@link Node.removeChild}
       * @see {@link CharacterData.appendData}
       * @see ../docs/walk-dom.md.
       */
      normalize: function() {
        walkDOM(this, null, {
          enter: function(node) {
            var child = node.firstChild;
            while (child) {
              var next = child.nextSibling;
              if (next !== null && next.nodeType === TEXT_NODE && child.nodeType === TEXT_NODE) {
                var tail = [];
                var sibling = next;
                while (sibling !== null && sibling.nodeType === TEXT_NODE) {
                  tail.push(sibling.data);
                  sibling = sibling.nextSibling;
                }
                var removed = child.nextSibling;
                while (removed !== sibling) {
                  var following = removed.nextSibling;
                  removed.parentNode = null;
                  removed.previousSibling = null;
                  removed.nextSibling = null;
                  removed = following;
                }
                child.nextSibling = sibling;
                if (sibling !== null) {
                  sibling.previousSibling = child;
                } else {
                  node.lastChild = child;
                }
                child.appendData(tail.join(""));
                _onUpdateChild(node.ownerDocument, node);
                child = sibling;
              } else {
                child = next;
              }
            }
            return true;
          }
        });
      },
      /**
       * Checks whether the DOM implementation implements a specific feature and its version.
       *
       * @deprecated
       * Since `DOMImplementation.hasFeature` is deprecated and always returns true.
       * @param {string} feature
       * The package name of the feature to test. This is the same name that can be passed to the
       * method `hasFeature` on `DOMImplementation`.
       * @param {string} version
       * This is the version number of the package name to test.
       * @returns {boolean}
       * Returns true in all cases in the current implementation.
       * @since Introduced in DOM Level 2
       * @see {@link DOMImplementation.hasFeature}
       */
      isSupported: function(feature, version) {
        return this.ownerDocument.implementation.hasFeature(feature, version);
      },
      /**
       * Look up the prefix associated to the given namespace URI, starting from this node.
       * **The default namespace declarations are ignored by this method.**
       * See Namespace Prefix Lookup for details on the algorithm used by this method.
       *
       * **This behavior is different from the in the specs**:
       * - no node type specific handling
       * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
       *
       * @param {string | null} namespaceURI
       * The namespace URI for which to find the associated prefix.
       * @returns {string | null}
       * The associated prefix, if found; otherwise, null.
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
       * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
       * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
       * @see https://github.com/xmldom/xmldom/issues/322
       * @prettierignore
       */
      lookupPrefix: function(namespaceURI) {
        var el = this;
        while (el) {
          var map = el._nsMap;
          if (map) {
            for (var n in map) {
              if (hasOwn(map, n) && map[n] === namespaceURI) {
                return n;
              }
            }
          }
          el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
        }
        return null;
      },
      /**
       * This function is used to look up the namespace URI associated with the given prefix,
       * starting from this node.
       *
       * **This behavior is different from the in the specs**:
       * - no node type specific handling
       * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
       *
       * @param {string | null} prefix
       * The prefix for which to find the associated namespace URI.
       * @returns {string | null}
       * The associated namespace URI, if found; otherwise, null.
       * @since DOM Level 3
       * @see https://dom.spec.whatwg.org/#dom-node-lookupnamespaceuri
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespaceURI
       * @prettierignore
       */
      lookupNamespaceURI: function(prefix) {
        var el = this;
        while (el) {
          var map = el._nsMap;
          if (map) {
            if (hasOwn(map, prefix)) {
              return map[prefix];
            }
          }
          el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
        }
        return null;
      },
      /**
       * Determines whether the given namespace URI is the default namespace.
       *
       * The function works by looking up the prefix associated with the given namespace URI. If no
       * prefix is found (i.e., the namespace URI is not registered in the namespace map of this
       * node or any of its ancestors), it returns `true`, implying the namespace URI is considered
       * the default.
       *
       * **This behavior is different from the in the specs**:
       * - no node type specific handling
       * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
       *
       * @param {string | null} namespaceURI
       * The namespace URI to be checked.
       * @returns {boolean}
       * Returns true if the given namespace URI is the default namespace, false otherwise.
       * @since DOM Level 3
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-isDefaultNamespace
       * @see https://dom.spec.whatwg.org/#dom-node-isdefaultnamespace
       * @prettierignore
       */
      isDefaultNamespace: function(namespaceURI) {
        var prefix = this.lookupPrefix(namespaceURI);
        return prefix == null;
      },
      /**
       * Compares the reference node with a node with regard to their position in the document and
       * according to the document order.
       *
       * @param {Node} other
       * The node to compare the reference node to.
       * @returns {number}
       * Returns how the node is positioned relatively to the reference node according to the
       * bitmask. 0 if reference node and given node are the same.
       * @since DOM Level 3
       * @see https://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#Node3-compare
       * @see https://dom.spec.whatwg.org/#dom-node-comparedocumentposition
       */
      compareDocumentPosition: function(other) {
        if (this === other) return 0;
        var node1 = other;
        var node2 = this;
        var attr1 = null;
        var attr2 = null;
        if (node1 instanceof Attr) {
          attr1 = node1;
          node1 = attr1.ownerElement;
        }
        if (node2 instanceof Attr) {
          attr2 = node2;
          node2 = attr2.ownerElement;
          if (attr1 && node1 && node2 === node1) {
            for (var i = 0, attr; attr = node2.attributes[i]; i++) {
              if (attr === attr1)
                return DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
              if (attr === attr2)
                return DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
            }
          }
        }
        if (!node1 || !node2 || node2.ownerDocument !== node1.ownerDocument) {
          return DocumentPosition.DOCUMENT_POSITION_DISCONNECTED + DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + (docGUID(node2.ownerDocument) > docGUID(node1.ownerDocument) ? DocumentPosition.DOCUMENT_POSITION_FOLLOWING : DocumentPosition.DOCUMENT_POSITION_PRECEDING);
        }
        if (attr2 && node1 === node2) {
          return DocumentPosition.DOCUMENT_POSITION_CONTAINS + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
        }
        if (attr1 && node1 === node2) {
          return DocumentPosition.DOCUMENT_POSITION_CONTAINED_BY + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
        }
        var chain1 = [];
        var ancestor1 = node1.parentNode;
        while (ancestor1) {
          if (!attr2 && ancestor1 === node2) {
            return DocumentPosition.DOCUMENT_POSITION_CONTAINED_BY + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
          }
          chain1.push(ancestor1);
          ancestor1 = ancestor1.parentNode;
        }
        chain1.reverse();
        var chain2 = [];
        var ancestor2 = node2.parentNode;
        while (ancestor2) {
          if (!attr1 && ancestor2 === node1) {
            return DocumentPosition.DOCUMENT_POSITION_CONTAINS + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
          }
          chain2.push(ancestor2);
          ancestor2 = ancestor2.parentNode;
        }
        chain2.reverse();
        var ca = commonAncestor(chain1, chain2);
        for (var n in ca.childNodes) {
          var child = ca.childNodes[n];
          if (child === node2) return DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
          if (child === node1) return DocumentPosition.DOCUMENT_POSITION_PRECEDING;
          if (chain2.indexOf(child) >= 0) return DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
          if (chain1.indexOf(child) >= 0) return DocumentPosition.DOCUMENT_POSITION_PRECEDING;
        }
        return 0;
      }
    };
    function _xmlEncoder(c) {
      return c == "<" && "&lt;" || c == ">" && "&gt;" || c == "&" && "&amp;" || c == '"' && "&quot;" || "&#" + c.charCodeAt() + ";";
    }
    copy(NodeType, Node);
    copy(NodeType, Node.prototype);
    copy(DocumentPosition, Node);
    copy(DocumentPosition, Node.prototype);
    function _visitNode(node, callback) {
      walkDOM(node, null, {
        enter: function(n) {
          return callback(n) ? walkDOM.STOP : true;
        }
      });
    }
    function walkDOM(node, context, callbacks) {
      var stack = [{ node, context, phase: walkDOM.ENTER }];
      while (stack.length > 0) {
        var frame = stack.pop();
        if (frame.phase === walkDOM.ENTER) {
          var childContext = callbacks.enter(frame.node, frame.context);
          if (childContext === walkDOM.STOP) {
            return walkDOM.STOP;
          }
          stack.push({ node: frame.node, context: childContext, phase: walkDOM.EXIT });
          if (childContext === null || childContext === void 0) {
            continue;
          }
          var child = frame.node.lastChild;
          while (child) {
            stack.push({ node: child, context: childContext, phase: walkDOM.ENTER });
            child = child.previousSibling;
          }
        } else {
          if (callbacks.exit) {
            callbacks.exit(frame.node, frame.context);
          }
        }
      }
    }
    walkDOM.STOP = /* @__PURE__ */ Symbol("walkDOM.STOP");
    walkDOM.ENTER = 0;
    walkDOM.EXIT = 1;
    function Document(symbol, options) {
      checkSymbol(symbol);
      var opt = options || {};
      this.ownerDocument = this;
      this.contentType = opt.contentType || MIME_TYPE.XML_APPLICATION;
      this.type = isHTMLMimeType(this.contentType) ? "html" : "xml";
    }
    function _onAddAttribute(doc, el, newAttr) {
      doc && doc._inc++;
      var ns = newAttr.namespaceURI;
      if (ns === NAMESPACE.XMLNS) {
        el._nsMap[newAttr.prefix ? newAttr.localName : ""] = newAttr.value;
      }
    }
    function _onRemoveAttribute(doc, el, newAttr, remove) {
      doc && doc._inc++;
      var ns = newAttr.namespaceURI;
      if (ns === NAMESPACE.XMLNS) {
        delete el._nsMap[newAttr.prefix ? newAttr.localName : ""];
      }
    }
    function _onUpdateChild(doc, parent, newChild) {
      if (doc && doc._inc) {
        doc._inc++;
        var childNodes = parent.childNodes;
        if (newChild && !newChild.nextSibling) {
          childNodes[childNodes.length++] = newChild;
        } else {
          var child = parent.firstChild;
          var i = 0;
          while (child) {
            childNodes[i++] = child;
            child = child.nextSibling;
          }
          childNodes.length = i;
          delete childNodes[childNodes.length];
        }
      }
    }
    function _removeChild(parentNode, child) {
      if (parentNode !== child.parentNode) {
        throw new DOMException(DOMException.NOT_FOUND_ERR, "child's parent is not parent");
      }
      var oldPreviousSibling = child.previousSibling;
      var oldNextSibling = child.nextSibling;
      if (oldPreviousSibling) {
        oldPreviousSibling.nextSibling = oldNextSibling;
      } else {
        parentNode.firstChild = oldNextSibling;
      }
      if (oldNextSibling) {
        oldNextSibling.previousSibling = oldPreviousSibling;
      } else {
        parentNode.lastChild = oldPreviousSibling;
      }
      _onUpdateChild(parentNode.ownerDocument, parentNode);
      child.parentNode = null;
      child.previousSibling = null;
      child.nextSibling = null;
      return child;
    }
    function hasValidParentNodeType(node) {
      return node && (node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.ELEMENT_NODE);
    }
    function hasInsertableNodeType(node) {
      return node && (node.nodeType === Node.CDATA_SECTION_NODE || node.nodeType === Node.COMMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.DOCUMENT_TYPE_NODE || node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.PROCESSING_INSTRUCTION_NODE || node.nodeType === Node.TEXT_NODE);
    }
    function isDocTypeNode(node) {
      return node && node.nodeType === Node.DOCUMENT_TYPE_NODE;
    }
    function isElementNode(node) {
      return node && node.nodeType === Node.ELEMENT_NODE;
    }
    function isTextNode(node) {
      return node && node.nodeType === Node.TEXT_NODE;
    }
    function isElementInsertionPossible(doc, child) {
      var parentChildNodes = doc.childNodes || [];
      if (find(parentChildNodes, isElementNode) || isDocTypeNode(child)) {
        return false;
      }
      var docTypeNode = find(parentChildNodes, isDocTypeNode);
      return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
    }
    function isElementReplacementPossible(doc, child) {
      var parentChildNodes = doc.childNodes || [];
      function hasElementChildThatIsNotChild(node) {
        return isElementNode(node) && node !== child;
      }
      if (find(parentChildNodes, hasElementChildThatIsNotChild)) {
        return false;
      }
      var docTypeNode = find(parentChildNodes, isDocTypeNode);
      return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
    }
    function assertPreInsertionValidity1to5(parent, node, child) {
      if (!hasValidParentNodeType(parent)) {
        throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Unexpected parent node type " + parent.nodeType);
      }
      if (child && child.parentNode !== parent) {
        throw new DOMException(DOMException.NOT_FOUND_ERR, "child not in parent");
      }
      if (
        // 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
        !hasInsertableNodeType(node) || // 5. If either `node` is a Text node and `parent` is a document,
        // the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
        // || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
        // or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
        isDocTypeNode(node) && parent.nodeType !== Node.DOCUMENT_NODE
      ) {
        throw new DOMException(
          DOMException.HIERARCHY_REQUEST_ERR,
          "Unexpected node type " + node.nodeType + " for parent node type " + parent.nodeType
        );
      }
    }
    function assertPreInsertionValidityInDocument(parent, node, child) {
      var parentChildNodes = parent.childNodes || [];
      var nodeChildNodes = node.childNodes || [];
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        var nodeChildElements = nodeChildNodes.filter(isElementNode);
        if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
        }
        if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
        }
      }
      if (isElementNode(node)) {
        if (!isElementInsertionPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
        }
      }
      if (isDocTypeNode(node)) {
        if (find(parentChildNodes, isDocTypeNode)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
        }
        var parentElementChild = find(parentChildNodes, isElementNode);
        if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
        }
        if (!child && parentElementChild) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can not be appended since element is present");
        }
      }
    }
    function assertPreReplacementValidityInDocument(parent, node, child) {
      var parentChildNodes = parent.childNodes || [];
      var nodeChildNodes = node.childNodes || [];
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        var nodeChildElements = nodeChildNodes.filter(isElementNode);
        if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
        }
        if (nodeChildElements.length === 1 && !isElementReplacementPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
        }
      }
      if (isElementNode(node)) {
        if (!isElementReplacementPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
        }
      }
      if (isDocTypeNode(node)) {
        let hasDoctypeChildThatIsNotChild = function(node2) {
          return isDocTypeNode(node2) && node2 !== child;
        };
        if (find(parentChildNodes, hasDoctypeChildThatIsNotChild)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
        }
        var parentElementChild = find(parentChildNodes, isElementNode);
        if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
        }
      }
    }
    function _insertBefore(parent, node, child, _inDocumentAssertion) {
      assertPreInsertionValidity1to5(parent, node, child);
      if (parent.nodeType === Node.DOCUMENT_NODE) {
        (_inDocumentAssertion || assertPreInsertionValidityInDocument)(parent, node, child);
      }
      var cp = node.parentNode;
      if (cp) {
        cp.removeChild(node);
      }
      if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
        var newFirst = node.firstChild;
        if (newFirst == null) {
          return node;
        }
        var newLast = node.lastChild;
      } else {
        newFirst = newLast = node;
      }
      var pre = child ? child.previousSibling : parent.lastChild;
      newFirst.previousSibling = pre;
      newLast.nextSibling = child;
      if (pre) {
        pre.nextSibling = newFirst;
      } else {
        parent.firstChild = newFirst;
      }
      if (child == null) {
        parent.lastChild = newLast;
      } else {
        child.previousSibling = newLast;
      }
      do {
        newFirst.parentNode = parent;
      } while (newFirst !== newLast && (newFirst = newFirst.nextSibling));
      _onUpdateChild(parent.ownerDocument || parent, parent, node);
      if (node.nodeType == DOCUMENT_FRAGMENT_NODE) {
        node.firstChild = node.lastChild = null;
      }
      return node;
    }
    Document.prototype = {
      /**
       * The implementation that created this document.
       *
       * @type DOMImplementation
       * @readonly
       */
      implementation: null,
      nodeName: "#document",
      nodeType: DOCUMENT_NODE,
      /**
       * The DocumentType node of the document.
       *
       * @type DocumentType
       * @readonly
       */
      doctype: null,
      documentElement: null,
      _inc: 1,
      insertBefore: function(newChild, refChild) {
        if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
          var child = newChild.firstChild;
          while (child) {
            var next = child.nextSibling;
            this.insertBefore(child, refChild);
            child = next;
          }
          return newChild;
        }
        _insertBefore(this, newChild, refChild);
        newChild.ownerDocument = this;
        if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
          this.documentElement = newChild;
        }
        return newChild;
      },
      removeChild: function(oldChild) {
        var removed = _removeChild(this, oldChild);
        if (removed === this.documentElement) {
          this.documentElement = null;
        }
        return removed;
      },
      replaceChild: function(newChild, oldChild) {
        _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
        newChild.ownerDocument = this;
        if (oldChild) {
          this.removeChild(oldChild);
        }
        if (isElementNode(newChild)) {
          this.documentElement = newChild;
        }
      },
      /**
       * Imports a node from another document into this document, creating a new copy owned by this
       * document. The source node and its subtree are not modified.
       *
       * @param {Node} importedNode
       * The node to import.
       * @param {boolean} deep
       * If true, the contents of the node are recursively imported.
       * If false, only the node itself (and its attributes, if it is an element) are imported.
       * @returns {Node}
       * Returns the newly created import of the node.
       * @see {@link importNode}
       * @see {@link https://dom.spec.whatwg.org/#dom-document-importnode}
       */
      importNode: function(importedNode, deep) {
        return importNode(this, importedNode, deep);
      },
      // Introduced in DOM Level 2:
      getElementById: function(id) {
        var rtv = null;
        _visitNode(this.documentElement, function(node) {
          if (node.nodeType == ELEMENT_NODE) {
            if (node.getAttribute("id") == id) {
              rtv = node;
              return true;
            }
          }
        });
        return rtv;
      },
      /**
       * Creates a new `Element` that is owned by this `Document`.
       * In HTML Documents `localName` is the lower cased `tagName`,
       * otherwise no transformation is being applied.
       * When `contentType` implies the HTML namespace, it will be set as `namespaceURI`.
       *
       * __This implementation differs from the specification:__ - The provided name is not checked
       * against the `Name` production,
       * so no related error will be thrown.
       * - There is no interface `HTMLElement`, it is always an `Element`.
       * - There is no support for a second argument to indicate using custom elements.
       *
       * @param {string} tagName
       * @returns {Element}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
       * @see https://dom.spec.whatwg.org/#dom-document-createelement
       * @see https://dom.spec.whatwg.org/#concept-create-element
       */
      createElement: function(tagName) {
        var node = new Element(PDC);
        node.ownerDocument = this;
        if (this.type === "html") {
          tagName = tagName.toLowerCase();
        }
        if (hasDefaultHTMLNamespace(this.contentType)) {
          node.namespaceURI = NAMESPACE.HTML;
        }
        node.nodeName = tagName;
        node.tagName = tagName;
        node.localName = tagName;
        node.childNodes = new NodeList();
        var attrs = node.attributes = new NamedNodeMap();
        attrs._ownerElement = node;
        return node;
      },
      /**
       * @returns {DocumentFragment}
       */
      createDocumentFragment: function() {
        var node = new DocumentFragment(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        return node;
      },
      /**
       * @param {string} data
       * @returns {Text}
       */
      createTextNode: function(data) {
        var node = new Text(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.appendData(data);
        return node;
      },
      /**
       * @param {string} data
       * @returns {Comment}
       * @see https://dom.spec.whatwg.org/#dom-document-createcomment
       * @see https://www.w3.org/TR/xml/#NT-Comment XML 1.0 production [15]
       * @see https://www.w3.org/TR/DOM-Parsing/#dfn-concept-serialize-xml §3.2.1.3
       *
       *      Note: no validation is performed at creation time. When the resulting document is
       *      serialized with `requireWellFormed: true`, the serializer throws `InvalidStateError`
       *      if the comment data contains `--` anywhere, ends with `-`, or contains characters
       *      outside the XML Char production (W3C DOM Parsing §3.2.1.3). Without that option the
       *      data is emitted verbatim.
       */
      createComment: function(data) {
        var node = new Comment(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.appendData(data);
        return node;
      },
      /**
       * Returns a new CDATASection node whose data is `data`.
       *
       * __This implementation differs from the specification:__ - calling this method on an HTML
       * document does not throw `NotSupportedError`.
       *
       * @param {string} data
       * @returns {CDATASection}
       * @throws {DOMException}
       * With code `INVALID_CHARACTER_ERR` if `data` contains `"]]>"`.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createCDATASection
       * @see https://dom.spec.whatwg.org/#dom-document-createcdatasection
       */
      createCDATASection: function(data) {
        if (data.indexOf("]]>") !== -1) {
          throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'data contains "]]>"');
        }
        var node = new CDATASection(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.appendData(data);
        return node;
      },
      /**
       * Returns a ProcessingInstruction node whose target is target and data is data.
       *
       * __This behavior is slightly different from the in the specs__:
       * - it does not do any input validation on the arguments and doesn't throw
       * "InvalidCharacterError".
       *
       * Note: When the resulting document is serialized with `requireWellFormed: true`, the
       * serializer throws `InvalidStateError` if `.target` is not a valid XML `NCName` (a `Name`
       * with no colon) or is an ASCII case-insensitive match for `"xml"`, or if `.data` contains
       * `?>` or characters outside the XML Char production (W3C DOM Parsing §3.2.1.7). Without that
       * option the target and data are emitted verbatim.
       *
       * @param {string} target
       * @param {string} data
       * @returns {ProcessingInstruction}
       * @see https://developer.mozilla.org/docs/Web/API/Document/createProcessingInstruction
       * @see https://dom.spec.whatwg.org/#dom-document-createprocessinginstruction
       * @see https://www.w3.org/TR/DOM-Parsing/#dfn-concept-serialize-xml §3.2.1.7
       */
      createProcessingInstruction: function(target, data) {
        var node = new ProcessingInstruction(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.nodeName = node.target = target;
        node.nodeValue = node.data = data;
        return node;
      },
      /**
       * Creates an `Attr` node that is owned by this document.
       * In HTML Documents `localName` is the lower cased `name`,
       * otherwise no transformation is being applied.
       *
       * __This implementation differs from the specification:__ - The provided name is not checked
       * against the `Name` production,
       * so no related error will be thrown.
       *
       * @param {string} name
       * @returns {Attr}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createAttribute
       * @see https://dom.spec.whatwg.org/#dom-document-createattribute
       */
      createAttribute: function(name) {
        if (!g.QName_exact.test(name)) {
          throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'invalid character in name "' + name + '"');
        }
        if (this.type === "html") {
          name = name.toLowerCase();
        }
        return this._createAttribute(name);
      },
      _createAttribute: function(name) {
        var node = new Attr(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.name = name;
        node.nodeName = name;
        node.localName = name;
        node.specified = true;
        return node;
      },
      /**
       * Creates an EntityReference object.
       * The current implementation does not fill the `childNodes` with those of the corresponding
       * `Entity`
       *
       * The `name` is validated against the XML `Name` production at creation time; an invalid name
       * throws `InvalidCharacterError`. When the resulting node is serialized with
       * `requireWellFormed: true`, the serializer re-validates `nodeName` against the XML `Name`
       * production and throws `InvalidStateError` if a later `nodeName` mutation made it invalid;
       * without that option the name is emitted verbatim.
       *
       * __This implementation differs from the specification:__ xmldom does not expand entities —
       * the parser resolves entity references inline and never constructs `EntityReference` nodes,
       * so this method is the only producer.
       *
       * @deprecated
       * In DOM Level 4.
       * @param {string} name
       * The name of the entity to reference. No namespace well-formedness checks are performed.
       * @returns {EntityReference}
       * @throws {DOMException}
       * With code `INVALID_CHARACTER_ERR` when `name` is not a valid XML `Name`.
       * @throws {DOMException}
       * with code `NOT_SUPPORTED_ERR` when the document is of type `html`
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-392B75AE
       */
      createEntityReference: function(name) {
        if (!g.Name_exact.test(name)) {
          throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'not a valid xml name "' + name + '"');
        }
        if (this.type === "html") {
          throw new DOMException("document is an html document", DOMExceptionName.NotSupportedError);
        }
        var node = new EntityReference(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.nodeName = name;
        return node;
      },
      // Introduced in DOM Level 2:
      /**
       * @param {string} namespaceURI
       * @param {string} qualifiedName
       * @returns {Element}
       */
      createElementNS: function(namespaceURI, qualifiedName) {
        var validated = validateAndExtract(namespaceURI, qualifiedName);
        var node = new Element(PDC);
        var attrs = node.attributes = new NamedNodeMap();
        node.childNodes = new NodeList();
        node.ownerDocument = this;
        node.nodeName = qualifiedName;
        node.tagName = qualifiedName;
        node.namespaceURI = validated[0];
        node.prefix = validated[1];
        node.localName = validated[2];
        attrs._ownerElement = node;
        return node;
      },
      // Introduced in DOM Level 2:
      /**
       * @param {string} namespaceURI
       * @param {string} qualifiedName
       * @returns {Attr}
       */
      createAttributeNS: function(namespaceURI, qualifiedName) {
        var validated = validateAndExtract(namespaceURI, qualifiedName);
        var node = new Attr(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.nodeName = qualifiedName;
        node.name = qualifiedName;
        node.specified = true;
        node.namespaceURI = validated[0];
        node.prefix = validated[1];
        node.localName = validated[2];
        return node;
      }
    };
    _extends(Document, Node);
    function Element(symbol) {
      checkSymbol(symbol);
      this._nsMap = /* @__PURE__ */ Object.create(null);
    }
    Element.prototype = {
      nodeType: ELEMENT_NODE,
      /**
       * The attributes of this element.
       *
       * @type {NamedNodeMap | null}
       */
      attributes: null,
      getQualifiedName: function() {
        return this.prefix ? this.prefix + ":" + this.localName : this.localName;
      },
      _isInHTMLDocumentAndNamespace: function() {
        return this.ownerDocument.type === "html" && this.namespaceURI === NAMESPACE.HTML;
      },
      /**
       * Implementaton of Level2 Core function hasAttributes.
       *
       * @returns {boolean}
       * True if attribute list is not empty.
       * @see https://www.w3.org/TR/DOM-Level-2-Core/#core-ID-NodeHasAttrs
       */
      hasAttributes: function() {
        return !!(this.attributes && this.attributes.length);
      },
      hasAttribute: function(name) {
        return !!this.getAttributeNode(name);
      },
      /**
       * Returns element’s first attribute whose qualified name is `name`, and `null`
       * if there is no such attribute.
       *
       * @param {string} name
       * @returns {string | null}
       */
      getAttribute: function(name) {
        var attr = this.getAttributeNode(name);
        return attr ? attr.value : null;
      },
      getAttributeNode: function(name) {
        if (this._isInHTMLDocumentAndNamespace()) {
          name = name.toLowerCase();
        }
        return this.attributes.getNamedItem(name);
      },
      /**
       * Sets the value of element’s first attribute whose qualified name is qualifiedName to value.
       *
       * @param {string} name
       * @param {string} value
       */
      setAttribute: function(name, value) {
        if (this._isInHTMLDocumentAndNamespace()) {
          name = name.toLowerCase();
        }
        var attr = this.getAttributeNode(name);
        if (attr) {
          attr.value = attr.nodeValue = "" + value;
        } else {
          attr = this.ownerDocument._createAttribute(name);
          attr.value = attr.nodeValue = "" + value;
          this.setAttributeNode(attr);
        }
      },
      removeAttribute: function(name) {
        var attr = this.getAttributeNode(name);
        attr && this.removeAttributeNode(attr);
      },
      setAttributeNode: function(newAttr) {
        return this.attributes.setNamedItem(newAttr);
      },
      setAttributeNodeNS: function(newAttr) {
        return this.attributes.setNamedItemNS(newAttr);
      },
      removeAttributeNode: function(oldAttr) {
        return this.attributes.removeNamedItem(oldAttr.nodeName);
      },
      //get real attribute name,and remove it by removeAttributeNode
      removeAttributeNS: function(namespaceURI, localName) {
        var old = this.getAttributeNodeNS(namespaceURI, localName);
        old && this.removeAttributeNode(old);
      },
      hasAttributeNS: function(namespaceURI, localName) {
        return this.getAttributeNodeNS(namespaceURI, localName) != null;
      },
      /**
       * Returns element’s attribute whose namespace is `namespaceURI` and local name is
       * `localName`,
       * or `null` if there is no such attribute.
       *
       * @param {string} namespaceURI
       * @param {string} localName
       * @returns {string | null}
       */
      getAttributeNS: function(namespaceURI, localName) {
        var attr = this.getAttributeNodeNS(namespaceURI, localName);
        return attr ? attr.value : null;
      },
      /**
       * Sets the value of element’s attribute whose namespace is `namespaceURI` and local name is
       * `localName` to value.
       *
       * @param {string} namespaceURI
       * @param {string} qualifiedName
       * @param {string} value
       * @see https://dom.spec.whatwg.org/#dom-element-setattributens
       */
      setAttributeNS: function(namespaceURI, qualifiedName, value) {
        var validated = validateAndExtract(namespaceURI, qualifiedName);
        var localName = validated[2];
        var attr = this.getAttributeNodeNS(namespaceURI, localName);
        if (attr) {
          attr.value = attr.nodeValue = "" + value;
        } else {
          attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
          attr.value = attr.nodeValue = "" + value;
          this.setAttributeNode(attr);
        }
      },
      getAttributeNodeNS: function(namespaceURI, localName) {
        return this.attributes.getNamedItemNS(namespaceURI, localName);
      },
      /**
       * Returns a LiveNodeList of all child elements which have **all** of the given class name(s).
       *
       * Returns an empty list if `classNames` is an empty string or only contains HTML white space
       * characters.
       *
       * Warning: This returns a live LiveNodeList.
       * Changes in the DOM will reflect in the array as the changes occur.
       * If an element selected by this array no longer qualifies for the selector,
       * it will automatically be removed. Be aware of this for iteration purposes.
       *
       * @param {string} classNames
       * Is a string representing the class name(s) to match; multiple class names are separated by
       * (ASCII-)whitespace.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
       * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
       */
      getElementsByClassName: function(classNames) {
        var classNamesSet = toOrderedSet(classNames);
        return new LiveNodeList(this, function(base) {
          var ls = [];
          if (classNamesSet.length > 0) {
            _visitNode(base, function(node) {
              if (node !== base && node.nodeType === ELEMENT_NODE) {
                var nodeClassNames = node.getAttribute("class");
                if (nodeClassNames) {
                  var matches = classNames === nodeClassNames;
                  if (!matches) {
                    var nodeClassNamesSet = toOrderedSet(nodeClassNames);
                    matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet));
                  }
                  if (matches) {
                    ls.push(node);
                  }
                }
              }
            });
          }
          return ls;
        });
      },
      /**
       * Returns a LiveNodeList of elements with the given qualifiedName.
       * Searching for all descendants can be done by passing `*` as `qualifiedName`.
       *
       * All descendants of the specified element are searched, but not the element itself.
       * The returned list is live, which means it updates itself with the DOM tree automatically.
       * Therefore, there is no need to call `Element.getElementsByTagName()`
       * with the same element and arguments repeatedly if the DOM changes in between calls.
       *
       * When called on an HTML element in an HTML document,
       * `getElementsByTagName` lower-cases the argument before searching for it.
       * This is undesirable when trying to match camel-cased SVG elements (such as
       * `<linearGradient>`) in an HTML document.
       * Instead, use `Element.getElementsByTagNameNS()`,
       * which preserves the capitalization of the tag name.
       *
       * `Element.getElementsByTagName` is similar to `Document.getElementsByTagName()`,
       * except that it only searches for elements that are descendants of the specified element.
       *
       * @param {string} qualifiedName
       * @returns {LiveNodeList}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
       * @see https://dom.spec.whatwg.org/#concept-getelementsbytagname
       */
      getElementsByTagName: function(qualifiedName) {
        var isHTMLDocument = (this.nodeType === DOCUMENT_NODE ? this : this.ownerDocument).type === "html";
        var lowerQualifiedName = qualifiedName.toLowerCase();
        return new LiveNodeList(this, function(base) {
          var ls = [];
          _visitNode(base, function(node) {
            if (node === base || node.nodeType !== ELEMENT_NODE) {
              return;
            }
            if (qualifiedName === "*") {
              ls.push(node);
            } else {
              var nodeQualifiedName = node.getQualifiedName();
              var matchingQName = isHTMLDocument && node.namespaceURI === NAMESPACE.HTML ? lowerQualifiedName : qualifiedName;
              if (nodeQualifiedName === matchingQName) {
                ls.push(node);
              }
            }
          });
          return ls;
        });
      },
      getElementsByTagNameNS: function(namespaceURI, localName) {
        return new LiveNodeList(this, function(base) {
          var ls = [];
          _visitNode(base, function(node) {
            if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === "*" || node.namespaceURI === namespaceURI) && (localName === "*" || node.localName == localName)) {
              ls.push(node);
            }
          });
          return ls;
        });
      }
    };
    Document.prototype.getElementsByClassName = Element.prototype.getElementsByClassName;
    Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
    Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;
    _extends(Element, Node);
    function Attr(symbol) {
      checkSymbol(symbol);
      this.namespaceURI = null;
      this.prefix = null;
      this.ownerElement = null;
    }
    Attr.prototype.nodeType = ATTRIBUTE_NODE;
    _extends(Attr, Node);
    function CharacterData(symbol) {
      checkSymbol(symbol);
    }
    CharacterData.prototype = {
      data: "",
      substringData: function(offset, count) {
        return this.data.substring(offset, offset + count);
      },
      appendData: function(text) {
        text = this.data + text;
        this.nodeValue = this.data = text;
        this.length = text.length;
      },
      insertData: function(offset, text) {
        this.replaceData(offset, 0, text);
      },
      deleteData: function(offset, count) {
        this.replaceData(offset, count, "");
      },
      replaceData: function(offset, count, text) {
        var start = this.data.substring(0, offset);
        var end = this.data.substring(offset + count);
        text = start + text + end;
        this.nodeValue = this.data = text;
        this.length = text.length;
      }
    };
    _extends(CharacterData, Node);
    function Text(symbol) {
      checkSymbol(symbol);
    }
    Text.prototype = {
      nodeName: "#text",
      nodeType: TEXT_NODE,
      splitText: function(offset) {
        var text = this.data;
        var newText = text.substring(offset);
        text = text.substring(0, offset);
        this.data = this.nodeValue = text;
        this.length = text.length;
        var newNode = this.ownerDocument.createTextNode(newText);
        if (this.parentNode) {
          this.parentNode.insertBefore(newNode, this.nextSibling);
        }
        return newNode;
      }
    };
    _extends(Text, CharacterData);
    function Comment(symbol) {
      checkSymbol(symbol);
    }
    Comment.prototype = {
      nodeName: "#comment",
      nodeType: COMMENT_NODE
    };
    _extends(Comment, CharacterData);
    function CDATASection(symbol) {
      checkSymbol(symbol);
    }
    CDATASection.prototype = {
      nodeName: "#cdata-section",
      nodeType: CDATA_SECTION_NODE
    };
    _extends(CDATASection, Text);
    function DocumentType(symbol) {
      checkSymbol(symbol);
    }
    DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
    _extends(DocumentType, Node);
    function Notation(symbol) {
      checkSymbol(symbol);
    }
    Notation.prototype.nodeType = NOTATION_NODE;
    _extends(Notation, Node);
    function Entity(symbol) {
      checkSymbol(symbol);
    }
    Entity.prototype.nodeType = ENTITY_NODE;
    _extends(Entity, Node);
    function EntityReference(symbol) {
      checkSymbol(symbol);
    }
    EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
    _extends(EntityReference, Node);
    function DocumentFragment(symbol) {
      checkSymbol(symbol);
    }
    DocumentFragment.prototype.nodeName = "#document-fragment";
    DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;
    _extends(DocumentFragment, Node);
    function ProcessingInstruction(symbol) {
      checkSymbol(symbol);
    }
    ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
    _extends(ProcessingInstruction, CharacterData);
    function XMLSerializer3() {
    }
    XMLSerializer3.prototype.serializeToString = function(node, options) {
      return nodeSerializeToString.call(node, options);
    };
    Node.prototype.toString = nodeSerializeToString;
    function nodeSerializeToString(options) {
      var opts;
      if (typeof options === "function") {
        opts = { requireWellFormed: false, splitCDATASections: true, nodeFilter: options };
      } else if (options != null) {
        opts = {
          requireWellFormed: !!options.requireWellFormed,
          splitCDATASections: options.splitCDATASections !== false,
          nodeFilter: options.nodeFilter || null
        };
      } else {
        opts = { requireWellFormed: false, splitCDATASections: true, nodeFilter: null };
      }
      var buf = [];
      var refNode = this.nodeType === DOCUMENT_NODE && this.documentElement || this;
      var prefix = refNode.prefix;
      var uri = refNode.namespaceURI;
      if (uri && prefix == null) {
        var prefix = refNode.lookupPrefix(uri);
        if (prefix == null) {
          var visibleNamespaces = [
            { namespace: uri, prefix: null }
            //{namespace:uri,prefix:''}
          ];
        }
      }
      serializeToString(this, buf, visibleNamespaces, opts);
      return buf.join("");
    }
    function needNamespaceDefine(node, isHTML, visibleNamespaces) {
      var prefix = node.prefix || "";
      var uri = node.namespaceURI;
      if (!uri) {
        return false;
      }
      if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) {
        return false;
      }
      var i = visibleNamespaces.length;
      while (i--) {
        var ns = visibleNamespaces[i];
        if (ns.prefix === prefix) {
          return ns.namespace !== uri;
        }
      }
      return true;
    }
    function addSerializedAttribute(buf, qualifiedName, value, requireWellFormed) {
      if (requireWellFormed && !g.QName_exact.test(qualifiedName)) {
        throw new DOMException(
          'The attribute name "' + qualifiedName + '" is not a valid XML QName',
          DOMExceptionName.InvalidStateError
        );
      }
      buf.push(" ", qualifiedName, '="', value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), '"');
    }
    function serializeToString(node, buf, visibleNamespaces, opts) {
      if (!visibleNamespaces) {
        visibleNamespaces = [];
      }
      var nodeFilter = opts.nodeFilter;
      var requireWellFormed = opts.requireWellFormed;
      var splitCDATASections = opts.splitCDATASections;
      var doc = node.nodeType === DOCUMENT_NODE ? node : node.ownerDocument;
      var isHTML = doc.type === "html";
      walkDOM(
        node,
        { ns: visibleNamespaces },
        {
          enter: function(n, ctx) {
            var namespaces = ctx.ns;
            if (nodeFilter) {
              n = nodeFilter(n);
              if (n) {
                if (typeof n == "string") {
                  buf.push(n);
                  return null;
                }
              } else {
                return null;
              }
            }
            switch (n.nodeType) {
              case ELEMENT_NODE:
                var attrs = n.attributes;
                var len = attrs.length;
                var nodeName = n.tagName;
                var prefixedNodeName = nodeName;
                if (!isHTML && !n.prefix && n.namespaceURI) {
                  var defaultNS;
                  for (var ai = 0; ai < attrs.length; ai++) {
                    if (attrs.item(ai).name === "xmlns") {
                      defaultNS = attrs.item(ai).value;
                      break;
                    }
                  }
                  if (!defaultNS) {
                    for (var nsi = namespaces.length - 1; nsi >= 0; nsi--) {
                      var nsEntry = namespaces[nsi];
                      if (nsEntry.prefix === "" && nsEntry.namespace === n.namespaceURI) {
                        defaultNS = nsEntry.namespace;
                        break;
                      }
                    }
                  }
                  if (defaultNS !== n.namespaceURI) {
                    for (var nsi = namespaces.length - 1; nsi >= 0; nsi--) {
                      var nsEntry = namespaces[nsi];
                      if (nsEntry.namespace === n.namespaceURI) {
                        if (nsEntry.prefix) {
                          prefixedNodeName = nsEntry.prefix + ":" + nodeName;
                        }
                        break;
                      }
                    }
                  }
                }
                if (requireWellFormed && !g.QName_exact.test(prefixedNodeName)) {
                  throw new DOMException(
                    'The element name "' + prefixedNodeName + '" is not a valid XML QName',
                    DOMExceptionName.InvalidStateError
                  );
                }
                buf.push("<", prefixedNodeName);
                var childNamespaces = namespaces.slice();
                for (var i = 0; i < len; i++) {
                  var attr = attrs.item(i);
                  if (attr.prefix == "xmlns") {
                    childNamespaces.push({
                      prefix: attr.localName,
                      namespace: attr.value
                    });
                  } else if (attr.nodeName == "xmlns") {
                    childNamespaces.push({ prefix: "", namespace: attr.value });
                  }
                }
                for (var i = 0; i < len; i++) {
                  var attr = attrs.item(i);
                  if (needNamespaceDefine(attr, isHTML, childNamespaces)) {
                    var attrPrefix = attr.prefix || "";
                    var uri = attr.namespaceURI;
                    addSerializedAttribute(buf, attrPrefix ? "xmlns:" + attrPrefix : "xmlns", uri, requireWellFormed);
                    childNamespaces.push({ prefix: attrPrefix, namespace: uri });
                  }
                  var filteredAttr = nodeFilter ? nodeFilter(attr) : attr;
                  if (filteredAttr) {
                    if (typeof filteredAttr === "string") {
                      buf.push(filteredAttr);
                    } else {
                      addSerializedAttribute(buf, filteredAttr.name, filteredAttr.value, requireWellFormed);
                    }
                  }
                }
                if (nodeName === prefixedNodeName && needNamespaceDefine(n, isHTML, childNamespaces)) {
                  var nodePrefix = n.prefix || "";
                  var uri = n.namespaceURI;
                  addSerializedAttribute(buf, nodePrefix ? "xmlns:" + nodePrefix : "xmlns", uri, requireWellFormed);
                  childNamespaces.push({ prefix: nodePrefix, namespace: uri });
                }
                var canCloseTag = !n.firstChild;
                if (canCloseTag && (isHTML || n.namespaceURI === NAMESPACE.HTML)) {
                  canCloseTag = isHTMLVoidElement(nodeName);
                }
                if (canCloseTag) {
                  buf.push("/>");
                  return null;
                }
                buf.push(">");
                if (isHTML && isHTMLRawTextElement(nodeName)) {
                  var child = n.firstChild;
                  while (child) {
                    if (child.data) {
                      buf.push(child.data);
                    } else {
                      serializeToString(child, buf, childNamespaces.slice(), opts);
                    }
                    child = child.nextSibling;
                  }
                  buf.push("</", prefixedNodeName, ">");
                  return null;
                }
                return { ns: childNamespaces, tag: prefixedNodeName };
              case DOCUMENT_NODE:
              case DOCUMENT_FRAGMENT_NODE:
                if (requireWellFormed && n.nodeType === DOCUMENT_NODE && n.documentElement == null) {
                  throw new DOMException("The Document has no documentElement", DOMExceptionName.InvalidStateError);
                }
                return { ns: namespaces };
              case ATTRIBUTE_NODE:
                addSerializedAttribute(buf, n.name, n.value, requireWellFormed);
                return null;
              case TEXT_NODE:
                if (requireWellFormed && g.InvalidChar.test(n.data)) {
                  throw new DOMException(
                    "The Text node data contains characters outside the XML Char production",
                    DOMExceptionName.InvalidStateError
                  );
                }
                buf.push(n.data.replace(/[<&>]/g, _xmlEncoder));
                return null;
              case CDATA_SECTION_NODE:
                if (requireWellFormed && n.data.indexOf("]]>") !== -1) {
                  throw new DOMException('The CDATASection data contains "]]>"', DOMExceptionName.InvalidStateError);
                }
                if (splitCDATASections) {
                  buf.push(g.CDATA_START, n.data.replace(/]]>/g, "]]]]><![CDATA[>"), g.CDATA_END);
                } else {
                  buf.push(g.CDATA_START, n.data, g.CDATA_END);
                }
                return null;
              case COMMENT_NODE:
                if (requireWellFormed) {
                  if (g.InvalidChar.test(n.data)) {
                    throw new DOMException(
                      "The comment node data contains characters outside the XML Char production",
                      DOMExceptionName.InvalidStateError
                    );
                  }
                  if (n.data.indexOf("--") !== -1 || n.data[n.data.length - 1] === "-") {
                    throw new DOMException(
                      'The comment node data contains "--" or ends with "-"',
                      DOMExceptionName.InvalidStateError
                    );
                  }
                }
                buf.push(g.COMMENT_START, n.data, g.COMMENT_END);
                return null;
              case DOCUMENT_TYPE_NODE:
                var pubid = n.publicId;
                var sysid = n.systemId;
                if (requireWellFormed) {
                  if (!g.Name_exact.test(n.name)) {
                    throw new DOMException(
                      'The doctype name "' + n.name + '" is not a valid XML Name',
                      DOMExceptionName.InvalidStateError
                    );
                  }
                  if (pubid && !g.PubidLiteral_match.test(pubid)) {
                    throw new DOMException("DocumentType publicId is not a valid PubidLiteral", DOMExceptionName.InvalidStateError);
                  }
                  if (sysid && sysid !== "." && !g.SystemLiteral_match.test(sysid)) {
                    throw new DOMException("DocumentType systemId is not a valid SystemLiteral", DOMExceptionName.InvalidStateError);
                  }
                  if (n.internalSubset && n.internalSubset.indexOf("]>") !== -1) {
                    throw new DOMException('DocumentType internalSubset contains "]>"', DOMExceptionName.InvalidStateError);
                  }
                }
                buf.push(g.DOCTYPE_DECL_START, " ", n.name);
                if (pubid) {
                  buf.push(" ", g.PUBLIC, " ", pubid);
                  if (sysid && sysid !== ".") {
                    buf.push(" ", sysid);
                  }
                } else if (sysid && sysid !== ".") {
                  buf.push(" ", g.SYSTEM, " ", sysid);
                }
                if (n.internalSubset) {
                  buf.push(" [", n.internalSubset, "]");
                }
                buf.push(">");
                return null;
              case PROCESSING_INSTRUCTION_NODE:
                if (requireWellFormed) {
                  if (!g.NCName_exact.test(n.target) || n.target.toLowerCase() === "xml") {
                    throw new DOMException(
                      'The processing instruction target "' + n.target + '" is not a valid XML NCName or is reserved',
                      DOMExceptionName.InvalidStateError
                    );
                  }
                  if (g.InvalidChar.test(n.data)) {
                    throw new DOMException(
                      "The ProcessingInstruction data contains characters outside the XML Char production",
                      DOMExceptionName.InvalidStateError
                    );
                  }
                  if (n.data.indexOf("?>") !== -1) {
                    throw new DOMException('The ProcessingInstruction data contains "?>"', DOMExceptionName.InvalidStateError);
                  }
                }
                buf.push("<?", n.target, " ", n.data, "?>");
                return null;
              case ENTITY_REFERENCE_NODE:
                if (requireWellFormed && !g.Name_exact.test(n.nodeName)) {
                  throw new DOMException(
                    'The entity reference name "' + n.nodeName + '" is not a valid XML Name',
                    DOMExceptionName.InvalidStateError
                  );
                }
                buf.push("&", n.nodeName, ";");
                return null;
              //case ENTITY_NODE:
              //case NOTATION_NODE:
              default:
                buf.push("??", n.nodeName);
                return null;
            }
          },
          exit: function(n, childCtx) {
            if (childCtx && childCtx.tag) {
              buf.push("</", childCtx.tag, ">");
            }
          }
        }
      );
    }
    function importNode(doc, node, deep) {
      var destRoot;
      walkDOM(node, null, {
        enter: function(srcNode, destParent) {
          var destNode = srcNode.cloneNode(false);
          destNode.ownerDocument = doc;
          destNode.parentNode = null;
          if (destParent === null) {
            destRoot = destNode;
          } else {
            destParent.appendChild(destNode);
          }
          var shouldDeep = srcNode.nodeType === ATTRIBUTE_NODE || deep;
          return shouldDeep ? destNode : null;
        }
      });
      return destRoot;
    }
    function cloneNode(doc, node, deep) {
      var destRoot;
      walkDOM(node, null, {
        enter: function(srcNode, destParent) {
          var destNode = new srcNode.constructor(PDC);
          for (var n in srcNode) {
            if (hasOwn(srcNode, n)) {
              var v = srcNode[n];
              if (typeof v != "object") {
                if (v != destNode[n]) {
                  destNode[n] = v;
                }
              }
            }
          }
          if (srcNode.childNodes) {
            destNode.childNodes = new NodeList();
          }
          destNode.ownerDocument = doc;
          var shouldDeep = deep;
          switch (destNode.nodeType) {
            case ELEMENT_NODE:
              var attrs = srcNode.attributes;
              var attrs2 = destNode.attributes = new NamedNodeMap();
              var len = attrs.length;
              attrs2._ownerElement = destNode;
              for (var i = 0; i < len; i++) {
                destNode.setAttributeNode(cloneNode(doc, attrs.item(i), true));
              }
              break;
            case ATTRIBUTE_NODE:
              shouldDeep = true;
          }
          if (destParent !== null) {
            destParent.appendChild(destNode);
          } else {
            destRoot = destNode;
          }
          return shouldDeep ? destNode : null;
        }
      });
      return destRoot;
    }
    function __set__(object, key, value) {
      object[key] = value;
    }
    function childrenRefresh(node) {
      var ls = [];
      var child = node.firstChild;
      while (child) {
        if (child.nodeType === ELEMENT_NODE) {
          ls.push(child);
        }
        child = child.nextSibling;
      }
      return ls;
    }
    try {
      if (Object.defineProperty) {
        Object.defineProperty(LiveNodeList.prototype, "length", {
          get: function() {
            _updateLiveList(this);
            return this.$$length;
          }
        });
        Object.defineProperty(Node.prototype, "textContent", {
          get: function() {
            if (this.nodeType === ELEMENT_NODE || this.nodeType === DOCUMENT_FRAGMENT_NODE) {
              var buf = [];
              walkDOM(this, null, {
                enter: function(n) {
                  if (n.nodeType === ELEMENT_NODE || n.nodeType === DOCUMENT_FRAGMENT_NODE) {
                    return true;
                  }
                  if (n.nodeType === PROCESSING_INSTRUCTION_NODE || n.nodeType === COMMENT_NODE) {
                    return null;
                  }
                  buf.push(n.nodeValue);
                }
              });
              return buf.join("");
            }
            return this.nodeValue;
          },
          set: function(data) {
            switch (this.nodeType) {
              case ELEMENT_NODE:
              case DOCUMENT_FRAGMENT_NODE:
                while (this.firstChild) {
                  this.removeChild(this.firstChild);
                }
                if (data || String(data)) {
                  this.appendChild(this.ownerDocument.createTextNode(data));
                }
                break;
              default:
                this.data = data;
                this.value = data;
                this.nodeValue = data;
            }
          }
        });
        Object.defineProperty(CharacterData.prototype, "data", {
          get: function() {
            return this._data != null ? this._data : "";
          },
          set: function(v) {
            this._data = v;
            this.length = typeof v === "string" ? v.length : 0;
          }
        });
        Object.defineProperty(CharacterData.prototype, "nodeValue", {
          get: function() {
            return this.data;
          },
          set: function(v) {
            this.data = v;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Element.prototype, "children", {
          get: function() {
            return new LiveNodeList(this, childrenRefresh);
          }
        });
        Object.defineProperty(Document.prototype, "children", {
          get: function() {
            return new LiveNodeList(this, childrenRefresh);
          }
        });
        Object.defineProperty(DocumentFragment.prototype, "children", {
          get: function() {
            return new LiveNodeList(this, childrenRefresh);
          }
        });
        __set__ = function(object, key, value) {
          object["$$" + key] = value;
        };
      }
    } catch (e) {
    }
    exports._updateLiveList = _updateLiveList;
    exports.Attr = Attr;
    exports.CDATASection = CDATASection;
    exports.CharacterData = CharacterData;
    exports.Comment = Comment;
    exports.Document = Document;
    exports.DocumentFragment = DocumentFragment;
    exports.DocumentType = DocumentType;
    exports.DOMImplementation = DOMImplementation;
    exports.Element = Element;
    exports.Entity = Entity;
    exports.EntityReference = EntityReference;
    exports.LiveNodeList = LiveNodeList;
    exports.NamedNodeMap = NamedNodeMap;
    exports.Node = Node;
    exports.NodeList = NodeList;
    exports.Notation = Notation;
    exports.Text = Text;
    exports.ProcessingInstruction = ProcessingInstruction;
    exports.walkDOM = walkDOM;
    exports.XMLSerializer = XMLSerializer3;
  }
});

// node_modules/@xmldom/xmldom/lib/entities.js
var require_entities = __commonJS({
  "node_modules/@xmldom/xmldom/lib/entities.js"(exports) {
    "use strict";
    var freeze = require_conventions().freeze;
    exports.XML_ENTITIES = freeze({
      amp: "&",
      apos: "'",
      gt: ">",
      lt: "<",
      quot: '"'
    });
    exports.HTML_ENTITIES = freeze({
      Aacute: "\xC1",
      aacute: "\xE1",
      Abreve: "\u0102",
      abreve: "\u0103",
      ac: "\u223E",
      acd: "\u223F",
      acE: "\u223E\u0333",
      Acirc: "\xC2",
      acirc: "\xE2",
      acute: "\xB4",
      Acy: "\u0410",
      acy: "\u0430",
      AElig: "\xC6",
      aelig: "\xE6",
      af: "\u2061",
      Afr: "\u{1D504}",
      afr: "\u{1D51E}",
      Agrave: "\xC0",
      agrave: "\xE0",
      alefsym: "\u2135",
      aleph: "\u2135",
      Alpha: "\u0391",
      alpha: "\u03B1",
      Amacr: "\u0100",
      amacr: "\u0101",
      amalg: "\u2A3F",
      AMP: "&",
      amp: "&",
      And: "\u2A53",
      and: "\u2227",
      andand: "\u2A55",
      andd: "\u2A5C",
      andslope: "\u2A58",
      andv: "\u2A5A",
      ang: "\u2220",
      ange: "\u29A4",
      angle: "\u2220",
      angmsd: "\u2221",
      angmsdaa: "\u29A8",
      angmsdab: "\u29A9",
      angmsdac: "\u29AA",
      angmsdad: "\u29AB",
      angmsdae: "\u29AC",
      angmsdaf: "\u29AD",
      angmsdag: "\u29AE",
      angmsdah: "\u29AF",
      angrt: "\u221F",
      angrtvb: "\u22BE",
      angrtvbd: "\u299D",
      angsph: "\u2222",
      angst: "\xC5",
      angzarr: "\u237C",
      Aogon: "\u0104",
      aogon: "\u0105",
      Aopf: "\u{1D538}",
      aopf: "\u{1D552}",
      ap: "\u2248",
      apacir: "\u2A6F",
      apE: "\u2A70",
      ape: "\u224A",
      apid: "\u224B",
      apos: "'",
      ApplyFunction: "\u2061",
      approx: "\u2248",
      approxeq: "\u224A",
      Aring: "\xC5",
      aring: "\xE5",
      Ascr: "\u{1D49C}",
      ascr: "\u{1D4B6}",
      Assign: "\u2254",
      ast: "*",
      asymp: "\u2248",
      asympeq: "\u224D",
      Atilde: "\xC3",
      atilde: "\xE3",
      Auml: "\xC4",
      auml: "\xE4",
      awconint: "\u2233",
      awint: "\u2A11",
      backcong: "\u224C",
      backepsilon: "\u03F6",
      backprime: "\u2035",
      backsim: "\u223D",
      backsimeq: "\u22CD",
      Backslash: "\u2216",
      Barv: "\u2AE7",
      barvee: "\u22BD",
      Barwed: "\u2306",
      barwed: "\u2305",
      barwedge: "\u2305",
      bbrk: "\u23B5",
      bbrktbrk: "\u23B6",
      bcong: "\u224C",
      Bcy: "\u0411",
      bcy: "\u0431",
      bdquo: "\u201E",
      becaus: "\u2235",
      Because: "\u2235",
      because: "\u2235",
      bemptyv: "\u29B0",
      bepsi: "\u03F6",
      bernou: "\u212C",
      Bernoullis: "\u212C",
      Beta: "\u0392",
      beta: "\u03B2",
      beth: "\u2136",
      between: "\u226C",
      Bfr: "\u{1D505}",
      bfr: "\u{1D51F}",
      bigcap: "\u22C2",
      bigcirc: "\u25EF",
      bigcup: "\u22C3",
      bigodot: "\u2A00",
      bigoplus: "\u2A01",
      bigotimes: "\u2A02",
      bigsqcup: "\u2A06",
      bigstar: "\u2605",
      bigtriangledown: "\u25BD",
      bigtriangleup: "\u25B3",
      biguplus: "\u2A04",
      bigvee: "\u22C1",
      bigwedge: "\u22C0",
      bkarow: "\u290D",
      blacklozenge: "\u29EB",
      blacksquare: "\u25AA",
      blacktriangle: "\u25B4",
      blacktriangledown: "\u25BE",
      blacktriangleleft: "\u25C2",
      blacktriangleright: "\u25B8",
      blank: "\u2423",
      blk12: "\u2592",
      blk14: "\u2591",
      blk34: "\u2593",
      block: "\u2588",
      bne: "=\u20E5",
      bnequiv: "\u2261\u20E5",
      bNot: "\u2AED",
      bnot: "\u2310",
      Bopf: "\u{1D539}",
      bopf: "\u{1D553}",
      bot: "\u22A5",
      bottom: "\u22A5",
      bowtie: "\u22C8",
      boxbox: "\u29C9",
      boxDL: "\u2557",
      boxDl: "\u2556",
      boxdL: "\u2555",
      boxdl: "\u2510",
      boxDR: "\u2554",
      boxDr: "\u2553",
      boxdR: "\u2552",
      boxdr: "\u250C",
      boxH: "\u2550",
      boxh: "\u2500",
      boxHD: "\u2566",
      boxHd: "\u2564",
      boxhD: "\u2565",
      boxhd: "\u252C",
      boxHU: "\u2569",
      boxHu: "\u2567",
      boxhU: "\u2568",
      boxhu: "\u2534",
      boxminus: "\u229F",
      boxplus: "\u229E",
      boxtimes: "\u22A0",
      boxUL: "\u255D",
      boxUl: "\u255C",
      boxuL: "\u255B",
      boxul: "\u2518",
      boxUR: "\u255A",
      boxUr: "\u2559",
      boxuR: "\u2558",
      boxur: "\u2514",
      boxV: "\u2551",
      boxv: "\u2502",
      boxVH: "\u256C",
      boxVh: "\u256B",
      boxvH: "\u256A",
      boxvh: "\u253C",
      boxVL: "\u2563",
      boxVl: "\u2562",
      boxvL: "\u2561",
      boxvl: "\u2524",
      boxVR: "\u2560",
      boxVr: "\u255F",
      boxvR: "\u255E",
      boxvr: "\u251C",
      bprime: "\u2035",
      Breve: "\u02D8",
      breve: "\u02D8",
      brvbar: "\xA6",
      Bscr: "\u212C",
      bscr: "\u{1D4B7}",
      bsemi: "\u204F",
      bsim: "\u223D",
      bsime: "\u22CD",
      bsol: "\\",
      bsolb: "\u29C5",
      bsolhsub: "\u27C8",
      bull: "\u2022",
      bullet: "\u2022",
      bump: "\u224E",
      bumpE: "\u2AAE",
      bumpe: "\u224F",
      Bumpeq: "\u224E",
      bumpeq: "\u224F",
      Cacute: "\u0106",
      cacute: "\u0107",
      Cap: "\u22D2",
      cap: "\u2229",
      capand: "\u2A44",
      capbrcup: "\u2A49",
      capcap: "\u2A4B",
      capcup: "\u2A47",
      capdot: "\u2A40",
      CapitalDifferentialD: "\u2145",
      caps: "\u2229\uFE00",
      caret: "\u2041",
      caron: "\u02C7",
      Cayleys: "\u212D",
      ccaps: "\u2A4D",
      Ccaron: "\u010C",
      ccaron: "\u010D",
      Ccedil: "\xC7",
      ccedil: "\xE7",
      Ccirc: "\u0108",
      ccirc: "\u0109",
      Cconint: "\u2230",
      ccups: "\u2A4C",
      ccupssm: "\u2A50",
      Cdot: "\u010A",
      cdot: "\u010B",
      cedil: "\xB8",
      Cedilla: "\xB8",
      cemptyv: "\u29B2",
      cent: "\xA2",
      CenterDot: "\xB7",
      centerdot: "\xB7",
      Cfr: "\u212D",
      cfr: "\u{1D520}",
      CHcy: "\u0427",
      chcy: "\u0447",
      check: "\u2713",
      checkmark: "\u2713",
      Chi: "\u03A7",
      chi: "\u03C7",
      cir: "\u25CB",
      circ: "\u02C6",
      circeq: "\u2257",
      circlearrowleft: "\u21BA",
      circlearrowright: "\u21BB",
      circledast: "\u229B",
      circledcirc: "\u229A",
      circleddash: "\u229D",
      CircleDot: "\u2299",
      circledR: "\xAE",
      circledS: "\u24C8",
      CircleMinus: "\u2296",
      CirclePlus: "\u2295",
      CircleTimes: "\u2297",
      cirE: "\u29C3",
      cire: "\u2257",
      cirfnint: "\u2A10",
      cirmid: "\u2AEF",
      cirscir: "\u29C2",
      ClockwiseContourIntegral: "\u2232",
      CloseCurlyDoubleQuote: "\u201D",
      CloseCurlyQuote: "\u2019",
      clubs: "\u2663",
      clubsuit: "\u2663",
      Colon: "\u2237",
      colon: ":",
      Colone: "\u2A74",
      colone: "\u2254",
      coloneq: "\u2254",
      comma: ",",
      commat: "@",
      comp: "\u2201",
      compfn: "\u2218",
      complement: "\u2201",
      complexes: "\u2102",
      cong: "\u2245",
      congdot: "\u2A6D",
      Congruent: "\u2261",
      Conint: "\u222F",
      conint: "\u222E",
      ContourIntegral: "\u222E",
      Copf: "\u2102",
      copf: "\u{1D554}",
      coprod: "\u2210",
      Coproduct: "\u2210",
      COPY: "\xA9",
      copy: "\xA9",
      copysr: "\u2117",
      CounterClockwiseContourIntegral: "\u2233",
      crarr: "\u21B5",
      Cross: "\u2A2F",
      cross: "\u2717",
      Cscr: "\u{1D49E}",
      cscr: "\u{1D4B8}",
      csub: "\u2ACF",
      csube: "\u2AD1",
      csup: "\u2AD0",
      csupe: "\u2AD2",
      ctdot: "\u22EF",
      cudarrl: "\u2938",
      cudarrr: "\u2935",
      cuepr: "\u22DE",
      cuesc: "\u22DF",
      cularr: "\u21B6",
      cularrp: "\u293D",
      Cup: "\u22D3",
      cup: "\u222A",
      cupbrcap: "\u2A48",
      CupCap: "\u224D",
      cupcap: "\u2A46",
      cupcup: "\u2A4A",
      cupdot: "\u228D",
      cupor: "\u2A45",
      cups: "\u222A\uFE00",
      curarr: "\u21B7",
      curarrm: "\u293C",
      curlyeqprec: "\u22DE",
      curlyeqsucc: "\u22DF",
      curlyvee: "\u22CE",
      curlywedge: "\u22CF",
      curren: "\xA4",
      curvearrowleft: "\u21B6",
      curvearrowright: "\u21B7",
      cuvee: "\u22CE",
      cuwed: "\u22CF",
      cwconint: "\u2232",
      cwint: "\u2231",
      cylcty: "\u232D",
      Dagger: "\u2021",
      dagger: "\u2020",
      daleth: "\u2138",
      Darr: "\u21A1",
      dArr: "\u21D3",
      darr: "\u2193",
      dash: "\u2010",
      Dashv: "\u2AE4",
      dashv: "\u22A3",
      dbkarow: "\u290F",
      dblac: "\u02DD",
      Dcaron: "\u010E",
      dcaron: "\u010F",
      Dcy: "\u0414",
      dcy: "\u0434",
      DD: "\u2145",
      dd: "\u2146",
      ddagger: "\u2021",
      ddarr: "\u21CA",
      DDotrahd: "\u2911",
      ddotseq: "\u2A77",
      deg: "\xB0",
      Del: "\u2207",
      Delta: "\u0394",
      delta: "\u03B4",
      demptyv: "\u29B1",
      dfisht: "\u297F",
      Dfr: "\u{1D507}",
      dfr: "\u{1D521}",
      dHar: "\u2965",
      dharl: "\u21C3",
      dharr: "\u21C2",
      DiacriticalAcute: "\xB4",
      DiacriticalDot: "\u02D9",
      DiacriticalDoubleAcute: "\u02DD",
      DiacriticalGrave: "`",
      DiacriticalTilde: "\u02DC",
      diam: "\u22C4",
      Diamond: "\u22C4",
      diamond: "\u22C4",
      diamondsuit: "\u2666",
      diams: "\u2666",
      die: "\xA8",
      DifferentialD: "\u2146",
      digamma: "\u03DD",
      disin: "\u22F2",
      div: "\xF7",
      divide: "\xF7",
      divideontimes: "\u22C7",
      divonx: "\u22C7",
      DJcy: "\u0402",
      djcy: "\u0452",
      dlcorn: "\u231E",
      dlcrop: "\u230D",
      dollar: "$",
      Dopf: "\u{1D53B}",
      dopf: "\u{1D555}",
      Dot: "\xA8",
      dot: "\u02D9",
      DotDot: "\u20DC",
      doteq: "\u2250",
      doteqdot: "\u2251",
      DotEqual: "\u2250",
      dotminus: "\u2238",
      dotplus: "\u2214",
      dotsquare: "\u22A1",
      doublebarwedge: "\u2306",
      DoubleContourIntegral: "\u222F",
      DoubleDot: "\xA8",
      DoubleDownArrow: "\u21D3",
      DoubleLeftArrow: "\u21D0",
      DoubleLeftRightArrow: "\u21D4",
      DoubleLeftTee: "\u2AE4",
      DoubleLongLeftArrow: "\u27F8",
      DoubleLongLeftRightArrow: "\u27FA",
      DoubleLongRightArrow: "\u27F9",
      DoubleRightArrow: "\u21D2",
      DoubleRightTee: "\u22A8",
      DoubleUpArrow: "\u21D1",
      DoubleUpDownArrow: "\u21D5",
      DoubleVerticalBar: "\u2225",
      DownArrow: "\u2193",
      Downarrow: "\u21D3",
      downarrow: "\u2193",
      DownArrowBar: "\u2913",
      DownArrowUpArrow: "\u21F5",
      DownBreve: "\u0311",
      downdownarrows: "\u21CA",
      downharpoonleft: "\u21C3",
      downharpoonright: "\u21C2",
      DownLeftRightVector: "\u2950",
      DownLeftTeeVector: "\u295E",
      DownLeftVector: "\u21BD",
      DownLeftVectorBar: "\u2956",
      DownRightTeeVector: "\u295F",
      DownRightVector: "\u21C1",
      DownRightVectorBar: "\u2957",
      DownTee: "\u22A4",
      DownTeeArrow: "\u21A7",
      drbkarow: "\u2910",
      drcorn: "\u231F",
      drcrop: "\u230C",
      Dscr: "\u{1D49F}",
      dscr: "\u{1D4B9}",
      DScy: "\u0405",
      dscy: "\u0455",
      dsol: "\u29F6",
      Dstrok: "\u0110",
      dstrok: "\u0111",
      dtdot: "\u22F1",
      dtri: "\u25BF",
      dtrif: "\u25BE",
      duarr: "\u21F5",
      duhar: "\u296F",
      dwangle: "\u29A6",
      DZcy: "\u040F",
      dzcy: "\u045F",
      dzigrarr: "\u27FF",
      Eacute: "\xC9",
      eacute: "\xE9",
      easter: "\u2A6E",
      Ecaron: "\u011A",
      ecaron: "\u011B",
      ecir: "\u2256",
      Ecirc: "\xCA",
      ecirc: "\xEA",
      ecolon: "\u2255",
      Ecy: "\u042D",
      ecy: "\u044D",
      eDDot: "\u2A77",
      Edot: "\u0116",
      eDot: "\u2251",
      edot: "\u0117",
      ee: "\u2147",
      efDot: "\u2252",
      Efr: "\u{1D508}",
      efr: "\u{1D522}",
      eg: "\u2A9A",
      Egrave: "\xC8",
      egrave: "\xE8",
      egs: "\u2A96",
      egsdot: "\u2A98",
      el: "\u2A99",
      Element: "\u2208",
      elinters: "\u23E7",
      ell: "\u2113",
      els: "\u2A95",
      elsdot: "\u2A97",
      Emacr: "\u0112",
      emacr: "\u0113",
      empty: "\u2205",
      emptyset: "\u2205",
      EmptySmallSquare: "\u25FB",
      emptyv: "\u2205",
      EmptyVerySmallSquare: "\u25AB",
      emsp: "\u2003",
      emsp13: "\u2004",
      emsp14: "\u2005",
      ENG: "\u014A",
      eng: "\u014B",
      ensp: "\u2002",
      Eogon: "\u0118",
      eogon: "\u0119",
      Eopf: "\u{1D53C}",
      eopf: "\u{1D556}",
      epar: "\u22D5",
      eparsl: "\u29E3",
      eplus: "\u2A71",
      epsi: "\u03B5",
      Epsilon: "\u0395",
      epsilon: "\u03B5",
      epsiv: "\u03F5",
      eqcirc: "\u2256",
      eqcolon: "\u2255",
      eqsim: "\u2242",
      eqslantgtr: "\u2A96",
      eqslantless: "\u2A95",
      Equal: "\u2A75",
      equals: "=",
      EqualTilde: "\u2242",
      equest: "\u225F",
      Equilibrium: "\u21CC",
      equiv: "\u2261",
      equivDD: "\u2A78",
      eqvparsl: "\u29E5",
      erarr: "\u2971",
      erDot: "\u2253",
      Escr: "\u2130",
      escr: "\u212F",
      esdot: "\u2250",
      Esim: "\u2A73",
      esim: "\u2242",
      Eta: "\u0397",
      eta: "\u03B7",
      ETH: "\xD0",
      eth: "\xF0",
      Euml: "\xCB",
      euml: "\xEB",
      euro: "\u20AC",
      excl: "!",
      exist: "\u2203",
      Exists: "\u2203",
      expectation: "\u2130",
      ExponentialE: "\u2147",
      exponentiale: "\u2147",
      fallingdotseq: "\u2252",
      Fcy: "\u0424",
      fcy: "\u0444",
      female: "\u2640",
      ffilig: "\uFB03",
      fflig: "\uFB00",
      ffllig: "\uFB04",
      Ffr: "\u{1D509}",
      ffr: "\u{1D523}",
      filig: "\uFB01",
      FilledSmallSquare: "\u25FC",
      FilledVerySmallSquare: "\u25AA",
      fjlig: "fj",
      flat: "\u266D",
      fllig: "\uFB02",
      fltns: "\u25B1",
      fnof: "\u0192",
      Fopf: "\u{1D53D}",
      fopf: "\u{1D557}",
      ForAll: "\u2200",
      forall: "\u2200",
      fork: "\u22D4",
      forkv: "\u2AD9",
      Fouriertrf: "\u2131",
      fpartint: "\u2A0D",
      frac12: "\xBD",
      frac13: "\u2153",
      frac14: "\xBC",
      frac15: "\u2155",
      frac16: "\u2159",
      frac18: "\u215B",
      frac23: "\u2154",
      frac25: "\u2156",
      frac34: "\xBE",
      frac35: "\u2157",
      frac38: "\u215C",
      frac45: "\u2158",
      frac56: "\u215A",
      frac58: "\u215D",
      frac78: "\u215E",
      frasl: "\u2044",
      frown: "\u2322",
      Fscr: "\u2131",
      fscr: "\u{1D4BB}",
      gacute: "\u01F5",
      Gamma: "\u0393",
      gamma: "\u03B3",
      Gammad: "\u03DC",
      gammad: "\u03DD",
      gap: "\u2A86",
      Gbreve: "\u011E",
      gbreve: "\u011F",
      Gcedil: "\u0122",
      Gcirc: "\u011C",
      gcirc: "\u011D",
      Gcy: "\u0413",
      gcy: "\u0433",
      Gdot: "\u0120",
      gdot: "\u0121",
      gE: "\u2267",
      ge: "\u2265",
      gEl: "\u2A8C",
      gel: "\u22DB",
      geq: "\u2265",
      geqq: "\u2267",
      geqslant: "\u2A7E",
      ges: "\u2A7E",
      gescc: "\u2AA9",
      gesdot: "\u2A80",
      gesdoto: "\u2A82",
      gesdotol: "\u2A84",
      gesl: "\u22DB\uFE00",
      gesles: "\u2A94",
      Gfr: "\u{1D50A}",
      gfr: "\u{1D524}",
      Gg: "\u22D9",
      gg: "\u226B",
      ggg: "\u22D9",
      gimel: "\u2137",
      GJcy: "\u0403",
      gjcy: "\u0453",
      gl: "\u2277",
      gla: "\u2AA5",
      glE: "\u2A92",
      glj: "\u2AA4",
      gnap: "\u2A8A",
      gnapprox: "\u2A8A",
      gnE: "\u2269",
      gne: "\u2A88",
      gneq: "\u2A88",
      gneqq: "\u2269",
      gnsim: "\u22E7",
      Gopf: "\u{1D53E}",
      gopf: "\u{1D558}",
      grave: "`",
      GreaterEqual: "\u2265",
      GreaterEqualLess: "\u22DB",
      GreaterFullEqual: "\u2267",
      GreaterGreater: "\u2AA2",
      GreaterLess: "\u2277",
      GreaterSlantEqual: "\u2A7E",
      GreaterTilde: "\u2273",
      Gscr: "\u{1D4A2}",
      gscr: "\u210A",
      gsim: "\u2273",
      gsime: "\u2A8E",
      gsiml: "\u2A90",
      Gt: "\u226B",
      GT: ">",
      gt: ">",
      gtcc: "\u2AA7",
      gtcir: "\u2A7A",
      gtdot: "\u22D7",
      gtlPar: "\u2995",
      gtquest: "\u2A7C",
      gtrapprox: "\u2A86",
      gtrarr: "\u2978",
      gtrdot: "\u22D7",
      gtreqless: "\u22DB",
      gtreqqless: "\u2A8C",
      gtrless: "\u2277",
      gtrsim: "\u2273",
      gvertneqq: "\u2269\uFE00",
      gvnE: "\u2269\uFE00",
      Hacek: "\u02C7",
      hairsp: "\u200A",
      half: "\xBD",
      hamilt: "\u210B",
      HARDcy: "\u042A",
      hardcy: "\u044A",
      hArr: "\u21D4",
      harr: "\u2194",
      harrcir: "\u2948",
      harrw: "\u21AD",
      Hat: "^",
      hbar: "\u210F",
      Hcirc: "\u0124",
      hcirc: "\u0125",
      hearts: "\u2665",
      heartsuit: "\u2665",
      hellip: "\u2026",
      hercon: "\u22B9",
      Hfr: "\u210C",
      hfr: "\u{1D525}",
      HilbertSpace: "\u210B",
      hksearow: "\u2925",
      hkswarow: "\u2926",
      hoarr: "\u21FF",
      homtht: "\u223B",
      hookleftarrow: "\u21A9",
      hookrightarrow: "\u21AA",
      Hopf: "\u210D",
      hopf: "\u{1D559}",
      horbar: "\u2015",
      HorizontalLine: "\u2500",
      Hscr: "\u210B",
      hscr: "\u{1D4BD}",
      hslash: "\u210F",
      Hstrok: "\u0126",
      hstrok: "\u0127",
      HumpDownHump: "\u224E",
      HumpEqual: "\u224F",
      hybull: "\u2043",
      hyphen: "\u2010",
      Iacute: "\xCD",
      iacute: "\xED",
      ic: "\u2063",
      Icirc: "\xCE",
      icirc: "\xEE",
      Icy: "\u0418",
      icy: "\u0438",
      Idot: "\u0130",
      IEcy: "\u0415",
      iecy: "\u0435",
      iexcl: "\xA1",
      iff: "\u21D4",
      Ifr: "\u2111",
      ifr: "\u{1D526}",
      Igrave: "\xCC",
      igrave: "\xEC",
      ii: "\u2148",
      iiiint: "\u2A0C",
      iiint: "\u222D",
      iinfin: "\u29DC",
      iiota: "\u2129",
      IJlig: "\u0132",
      ijlig: "\u0133",
      Im: "\u2111",
      Imacr: "\u012A",
      imacr: "\u012B",
      image: "\u2111",
      ImaginaryI: "\u2148",
      imagline: "\u2110",
      imagpart: "\u2111",
      imath: "\u0131",
      imof: "\u22B7",
      imped: "\u01B5",
      Implies: "\u21D2",
      in: "\u2208",
      incare: "\u2105",
      infin: "\u221E",
      infintie: "\u29DD",
      inodot: "\u0131",
      Int: "\u222C",
      int: "\u222B",
      intcal: "\u22BA",
      integers: "\u2124",
      Integral: "\u222B",
      intercal: "\u22BA",
      Intersection: "\u22C2",
      intlarhk: "\u2A17",
      intprod: "\u2A3C",
      InvisibleComma: "\u2063",
      InvisibleTimes: "\u2062",
      IOcy: "\u0401",
      iocy: "\u0451",
      Iogon: "\u012E",
      iogon: "\u012F",
      Iopf: "\u{1D540}",
      iopf: "\u{1D55A}",
      Iota: "\u0399",
      iota: "\u03B9",
      iprod: "\u2A3C",
      iquest: "\xBF",
      Iscr: "\u2110",
      iscr: "\u{1D4BE}",
      isin: "\u2208",
      isindot: "\u22F5",
      isinE: "\u22F9",
      isins: "\u22F4",
      isinsv: "\u22F3",
      isinv: "\u2208",
      it: "\u2062",
      Itilde: "\u0128",
      itilde: "\u0129",
      Iukcy: "\u0406",
      iukcy: "\u0456",
      Iuml: "\xCF",
      iuml: "\xEF",
      Jcirc: "\u0134",
      jcirc: "\u0135",
      Jcy: "\u0419",
      jcy: "\u0439",
      Jfr: "\u{1D50D}",
      jfr: "\u{1D527}",
      jmath: "\u0237",
      Jopf: "\u{1D541}",
      jopf: "\u{1D55B}",
      Jscr: "\u{1D4A5}",
      jscr: "\u{1D4BF}",
      Jsercy: "\u0408",
      jsercy: "\u0458",
      Jukcy: "\u0404",
      jukcy: "\u0454",
      Kappa: "\u039A",
      kappa: "\u03BA",
      kappav: "\u03F0",
      Kcedil: "\u0136",
      kcedil: "\u0137",
      Kcy: "\u041A",
      kcy: "\u043A",
      Kfr: "\u{1D50E}",
      kfr: "\u{1D528}",
      kgreen: "\u0138",
      KHcy: "\u0425",
      khcy: "\u0445",
      KJcy: "\u040C",
      kjcy: "\u045C",
      Kopf: "\u{1D542}",
      kopf: "\u{1D55C}",
      Kscr: "\u{1D4A6}",
      kscr: "\u{1D4C0}",
      lAarr: "\u21DA",
      Lacute: "\u0139",
      lacute: "\u013A",
      laemptyv: "\u29B4",
      lagran: "\u2112",
      Lambda: "\u039B",
      lambda: "\u03BB",
      Lang: "\u27EA",
      lang: "\u27E8",
      langd: "\u2991",
      langle: "\u27E8",
      lap: "\u2A85",
      Laplacetrf: "\u2112",
      laquo: "\xAB",
      Larr: "\u219E",
      lArr: "\u21D0",
      larr: "\u2190",
      larrb: "\u21E4",
      larrbfs: "\u291F",
      larrfs: "\u291D",
      larrhk: "\u21A9",
      larrlp: "\u21AB",
      larrpl: "\u2939",
      larrsim: "\u2973",
      larrtl: "\u21A2",
      lat: "\u2AAB",
      lAtail: "\u291B",
      latail: "\u2919",
      late: "\u2AAD",
      lates: "\u2AAD\uFE00",
      lBarr: "\u290E",
      lbarr: "\u290C",
      lbbrk: "\u2772",
      lbrace: "{",
      lbrack: "[",
      lbrke: "\u298B",
      lbrksld: "\u298F",
      lbrkslu: "\u298D",
      Lcaron: "\u013D",
      lcaron: "\u013E",
      Lcedil: "\u013B",
      lcedil: "\u013C",
      lceil: "\u2308",
      lcub: "{",
      Lcy: "\u041B",
      lcy: "\u043B",
      ldca: "\u2936",
      ldquo: "\u201C",
      ldquor: "\u201E",
      ldrdhar: "\u2967",
      ldrushar: "\u294B",
      ldsh: "\u21B2",
      lE: "\u2266",
      le: "\u2264",
      LeftAngleBracket: "\u27E8",
      LeftArrow: "\u2190",
      Leftarrow: "\u21D0",
      leftarrow: "\u2190",
      LeftArrowBar: "\u21E4",
      LeftArrowRightArrow: "\u21C6",
      leftarrowtail: "\u21A2",
      LeftCeiling: "\u2308",
      LeftDoubleBracket: "\u27E6",
      LeftDownTeeVector: "\u2961",
      LeftDownVector: "\u21C3",
      LeftDownVectorBar: "\u2959",
      LeftFloor: "\u230A",
      leftharpoondown: "\u21BD",
      leftharpoonup: "\u21BC",
      leftleftarrows: "\u21C7",
      LeftRightArrow: "\u2194",
      Leftrightarrow: "\u21D4",
      leftrightarrow: "\u2194",
      leftrightarrows: "\u21C6",
      leftrightharpoons: "\u21CB",
      leftrightsquigarrow: "\u21AD",
      LeftRightVector: "\u294E",
      LeftTee: "\u22A3",
      LeftTeeArrow: "\u21A4",
      LeftTeeVector: "\u295A",
      leftthreetimes: "\u22CB",
      LeftTriangle: "\u22B2",
      LeftTriangleBar: "\u29CF",
      LeftTriangleEqual: "\u22B4",
      LeftUpDownVector: "\u2951",
      LeftUpTeeVector: "\u2960",
      LeftUpVector: "\u21BF",
      LeftUpVectorBar: "\u2958",
      LeftVector: "\u21BC",
      LeftVectorBar: "\u2952",
      lEg: "\u2A8B",
      leg: "\u22DA",
      leq: "\u2264",
      leqq: "\u2266",
      leqslant: "\u2A7D",
      les: "\u2A7D",
      lescc: "\u2AA8",
      lesdot: "\u2A7F",
      lesdoto: "\u2A81",
      lesdotor: "\u2A83",
      lesg: "\u22DA\uFE00",
      lesges: "\u2A93",
      lessapprox: "\u2A85",
      lessdot: "\u22D6",
      lesseqgtr: "\u22DA",
      lesseqqgtr: "\u2A8B",
      LessEqualGreater: "\u22DA",
      LessFullEqual: "\u2266",
      LessGreater: "\u2276",
      lessgtr: "\u2276",
      LessLess: "\u2AA1",
      lesssim: "\u2272",
      LessSlantEqual: "\u2A7D",
      LessTilde: "\u2272",
      lfisht: "\u297C",
      lfloor: "\u230A",
      Lfr: "\u{1D50F}",
      lfr: "\u{1D529}",
      lg: "\u2276",
      lgE: "\u2A91",
      lHar: "\u2962",
      lhard: "\u21BD",
      lharu: "\u21BC",
      lharul: "\u296A",
      lhblk: "\u2584",
      LJcy: "\u0409",
      ljcy: "\u0459",
      Ll: "\u22D8",
      ll: "\u226A",
      llarr: "\u21C7",
      llcorner: "\u231E",
      Lleftarrow: "\u21DA",
      llhard: "\u296B",
      lltri: "\u25FA",
      Lmidot: "\u013F",
      lmidot: "\u0140",
      lmoust: "\u23B0",
      lmoustache: "\u23B0",
      lnap: "\u2A89",
      lnapprox: "\u2A89",
      lnE: "\u2268",
      lne: "\u2A87",
      lneq: "\u2A87",
      lneqq: "\u2268",
      lnsim: "\u22E6",
      loang: "\u27EC",
      loarr: "\u21FD",
      lobrk: "\u27E6",
      LongLeftArrow: "\u27F5",
      Longleftarrow: "\u27F8",
      longleftarrow: "\u27F5",
      LongLeftRightArrow: "\u27F7",
      Longleftrightarrow: "\u27FA",
      longleftrightarrow: "\u27F7",
      longmapsto: "\u27FC",
      LongRightArrow: "\u27F6",
      Longrightarrow: "\u27F9",
      longrightarrow: "\u27F6",
      looparrowleft: "\u21AB",
      looparrowright: "\u21AC",
      lopar: "\u2985",
      Lopf: "\u{1D543}",
      lopf: "\u{1D55D}",
      loplus: "\u2A2D",
      lotimes: "\u2A34",
      lowast: "\u2217",
      lowbar: "_",
      LowerLeftArrow: "\u2199",
      LowerRightArrow: "\u2198",
      loz: "\u25CA",
      lozenge: "\u25CA",
      lozf: "\u29EB",
      lpar: "(",
      lparlt: "\u2993",
      lrarr: "\u21C6",
      lrcorner: "\u231F",
      lrhar: "\u21CB",
      lrhard: "\u296D",
      lrm: "\u200E",
      lrtri: "\u22BF",
      lsaquo: "\u2039",
      Lscr: "\u2112",
      lscr: "\u{1D4C1}",
      Lsh: "\u21B0",
      lsh: "\u21B0",
      lsim: "\u2272",
      lsime: "\u2A8D",
      lsimg: "\u2A8F",
      lsqb: "[",
      lsquo: "\u2018",
      lsquor: "\u201A",
      Lstrok: "\u0141",
      lstrok: "\u0142",
      Lt: "\u226A",
      LT: "<",
      lt: "<",
      ltcc: "\u2AA6",
      ltcir: "\u2A79",
      ltdot: "\u22D6",
      lthree: "\u22CB",
      ltimes: "\u22C9",
      ltlarr: "\u2976",
      ltquest: "\u2A7B",
      ltri: "\u25C3",
      ltrie: "\u22B4",
      ltrif: "\u25C2",
      ltrPar: "\u2996",
      lurdshar: "\u294A",
      luruhar: "\u2966",
      lvertneqq: "\u2268\uFE00",
      lvnE: "\u2268\uFE00",
      macr: "\xAF",
      male: "\u2642",
      malt: "\u2720",
      maltese: "\u2720",
      Map: "\u2905",
      map: "\u21A6",
      mapsto: "\u21A6",
      mapstodown: "\u21A7",
      mapstoleft: "\u21A4",
      mapstoup: "\u21A5",
      marker: "\u25AE",
      mcomma: "\u2A29",
      Mcy: "\u041C",
      mcy: "\u043C",
      mdash: "\u2014",
      mDDot: "\u223A",
      measuredangle: "\u2221",
      MediumSpace: "\u205F",
      Mellintrf: "\u2133",
      Mfr: "\u{1D510}",
      mfr: "\u{1D52A}",
      mho: "\u2127",
      micro: "\xB5",
      mid: "\u2223",
      midast: "*",
      midcir: "\u2AF0",
      middot: "\xB7",
      minus: "\u2212",
      minusb: "\u229F",
      minusd: "\u2238",
      minusdu: "\u2A2A",
      MinusPlus: "\u2213",
      mlcp: "\u2ADB",
      mldr: "\u2026",
      mnplus: "\u2213",
      models: "\u22A7",
      Mopf: "\u{1D544}",
      mopf: "\u{1D55E}",
      mp: "\u2213",
      Mscr: "\u2133",
      mscr: "\u{1D4C2}",
      mstpos: "\u223E",
      Mu: "\u039C",
      mu: "\u03BC",
      multimap: "\u22B8",
      mumap: "\u22B8",
      nabla: "\u2207",
      Nacute: "\u0143",
      nacute: "\u0144",
      nang: "\u2220\u20D2",
      nap: "\u2249",
      napE: "\u2A70\u0338",
      napid: "\u224B\u0338",
      napos: "\u0149",
      napprox: "\u2249",
      natur: "\u266E",
      natural: "\u266E",
      naturals: "\u2115",
      nbsp: "\xA0",
      nbump: "\u224E\u0338",
      nbumpe: "\u224F\u0338",
      ncap: "\u2A43",
      Ncaron: "\u0147",
      ncaron: "\u0148",
      Ncedil: "\u0145",
      ncedil: "\u0146",
      ncong: "\u2247",
      ncongdot: "\u2A6D\u0338",
      ncup: "\u2A42",
      Ncy: "\u041D",
      ncy: "\u043D",
      ndash: "\u2013",
      ne: "\u2260",
      nearhk: "\u2924",
      neArr: "\u21D7",
      nearr: "\u2197",
      nearrow: "\u2197",
      nedot: "\u2250\u0338",
      NegativeMediumSpace: "\u200B",
      NegativeThickSpace: "\u200B",
      NegativeThinSpace: "\u200B",
      NegativeVeryThinSpace: "\u200B",
      nequiv: "\u2262",
      nesear: "\u2928",
      nesim: "\u2242\u0338",
      NestedGreaterGreater: "\u226B",
      NestedLessLess: "\u226A",
      NewLine: "\n",
      nexist: "\u2204",
      nexists: "\u2204",
      Nfr: "\u{1D511}",
      nfr: "\u{1D52B}",
      ngE: "\u2267\u0338",
      nge: "\u2271",
      ngeq: "\u2271",
      ngeqq: "\u2267\u0338",
      ngeqslant: "\u2A7E\u0338",
      nges: "\u2A7E\u0338",
      nGg: "\u22D9\u0338",
      ngsim: "\u2275",
      nGt: "\u226B\u20D2",
      ngt: "\u226F",
      ngtr: "\u226F",
      nGtv: "\u226B\u0338",
      nhArr: "\u21CE",
      nharr: "\u21AE",
      nhpar: "\u2AF2",
      ni: "\u220B",
      nis: "\u22FC",
      nisd: "\u22FA",
      niv: "\u220B",
      NJcy: "\u040A",
      njcy: "\u045A",
      nlArr: "\u21CD",
      nlarr: "\u219A",
      nldr: "\u2025",
      nlE: "\u2266\u0338",
      nle: "\u2270",
      nLeftarrow: "\u21CD",
      nleftarrow: "\u219A",
      nLeftrightarrow: "\u21CE",
      nleftrightarrow: "\u21AE",
      nleq: "\u2270",
      nleqq: "\u2266\u0338",
      nleqslant: "\u2A7D\u0338",
      nles: "\u2A7D\u0338",
      nless: "\u226E",
      nLl: "\u22D8\u0338",
      nlsim: "\u2274",
      nLt: "\u226A\u20D2",
      nlt: "\u226E",
      nltri: "\u22EA",
      nltrie: "\u22EC",
      nLtv: "\u226A\u0338",
      nmid: "\u2224",
      NoBreak: "\u2060",
      NonBreakingSpace: "\xA0",
      Nopf: "\u2115",
      nopf: "\u{1D55F}",
      Not: "\u2AEC",
      not: "\xAC",
      NotCongruent: "\u2262",
      NotCupCap: "\u226D",
      NotDoubleVerticalBar: "\u2226",
      NotElement: "\u2209",
      NotEqual: "\u2260",
      NotEqualTilde: "\u2242\u0338",
      NotExists: "\u2204",
      NotGreater: "\u226F",
      NotGreaterEqual: "\u2271",
      NotGreaterFullEqual: "\u2267\u0338",
      NotGreaterGreater: "\u226B\u0338",
      NotGreaterLess: "\u2279",
      NotGreaterSlantEqual: "\u2A7E\u0338",
      NotGreaterTilde: "\u2275",
      NotHumpDownHump: "\u224E\u0338",
      NotHumpEqual: "\u224F\u0338",
      notin: "\u2209",
      notindot: "\u22F5\u0338",
      notinE: "\u22F9\u0338",
      notinva: "\u2209",
      notinvb: "\u22F7",
      notinvc: "\u22F6",
      NotLeftTriangle: "\u22EA",
      NotLeftTriangleBar: "\u29CF\u0338",
      NotLeftTriangleEqual: "\u22EC",
      NotLess: "\u226E",
      NotLessEqual: "\u2270",
      NotLessGreater: "\u2278",
      NotLessLess: "\u226A\u0338",
      NotLessSlantEqual: "\u2A7D\u0338",
      NotLessTilde: "\u2274",
      NotNestedGreaterGreater: "\u2AA2\u0338",
      NotNestedLessLess: "\u2AA1\u0338",
      notni: "\u220C",
      notniva: "\u220C",
      notnivb: "\u22FE",
      notnivc: "\u22FD",
      NotPrecedes: "\u2280",
      NotPrecedesEqual: "\u2AAF\u0338",
      NotPrecedesSlantEqual: "\u22E0",
      NotReverseElement: "\u220C",
      NotRightTriangle: "\u22EB",
      NotRightTriangleBar: "\u29D0\u0338",
      NotRightTriangleEqual: "\u22ED",
      NotSquareSubset: "\u228F\u0338",
      NotSquareSubsetEqual: "\u22E2",
      NotSquareSuperset: "\u2290\u0338",
      NotSquareSupersetEqual: "\u22E3",
      NotSubset: "\u2282\u20D2",
      NotSubsetEqual: "\u2288",
      NotSucceeds: "\u2281",
      NotSucceedsEqual: "\u2AB0\u0338",
      NotSucceedsSlantEqual: "\u22E1",
      NotSucceedsTilde: "\u227F\u0338",
      NotSuperset: "\u2283\u20D2",
      NotSupersetEqual: "\u2289",
      NotTilde: "\u2241",
      NotTildeEqual: "\u2244",
      NotTildeFullEqual: "\u2247",
      NotTildeTilde: "\u2249",
      NotVerticalBar: "\u2224",
      npar: "\u2226",
      nparallel: "\u2226",
      nparsl: "\u2AFD\u20E5",
      npart: "\u2202\u0338",
      npolint: "\u2A14",
      npr: "\u2280",
      nprcue: "\u22E0",
      npre: "\u2AAF\u0338",
      nprec: "\u2280",
      npreceq: "\u2AAF\u0338",
      nrArr: "\u21CF",
      nrarr: "\u219B",
      nrarrc: "\u2933\u0338",
      nrarrw: "\u219D\u0338",
      nRightarrow: "\u21CF",
      nrightarrow: "\u219B",
      nrtri: "\u22EB",
      nrtrie: "\u22ED",
      nsc: "\u2281",
      nsccue: "\u22E1",
      nsce: "\u2AB0\u0338",
      Nscr: "\u{1D4A9}",
      nscr: "\u{1D4C3}",
      nshortmid: "\u2224",
      nshortparallel: "\u2226",
      nsim: "\u2241",
      nsime: "\u2244",
      nsimeq: "\u2244",
      nsmid: "\u2224",
      nspar: "\u2226",
      nsqsube: "\u22E2",
      nsqsupe: "\u22E3",
      nsub: "\u2284",
      nsubE: "\u2AC5\u0338",
      nsube: "\u2288",
      nsubset: "\u2282\u20D2",
      nsubseteq: "\u2288",
      nsubseteqq: "\u2AC5\u0338",
      nsucc: "\u2281",
      nsucceq: "\u2AB0\u0338",
      nsup: "\u2285",
      nsupE: "\u2AC6\u0338",
      nsupe: "\u2289",
      nsupset: "\u2283\u20D2",
      nsupseteq: "\u2289",
      nsupseteqq: "\u2AC6\u0338",
      ntgl: "\u2279",
      Ntilde: "\xD1",
      ntilde: "\xF1",
      ntlg: "\u2278",
      ntriangleleft: "\u22EA",
      ntrianglelefteq: "\u22EC",
      ntriangleright: "\u22EB",
      ntrianglerighteq: "\u22ED",
      Nu: "\u039D",
      nu: "\u03BD",
      num: "#",
      numero: "\u2116",
      numsp: "\u2007",
      nvap: "\u224D\u20D2",
      nVDash: "\u22AF",
      nVdash: "\u22AE",
      nvDash: "\u22AD",
      nvdash: "\u22AC",
      nvge: "\u2265\u20D2",
      nvgt: ">\u20D2",
      nvHarr: "\u2904",
      nvinfin: "\u29DE",
      nvlArr: "\u2902",
      nvle: "\u2264\u20D2",
      nvlt: "<\u20D2",
      nvltrie: "\u22B4\u20D2",
      nvrArr: "\u2903",
      nvrtrie: "\u22B5\u20D2",
      nvsim: "\u223C\u20D2",
      nwarhk: "\u2923",
      nwArr: "\u21D6",
      nwarr: "\u2196",
      nwarrow: "\u2196",
      nwnear: "\u2927",
      Oacute: "\xD3",
      oacute: "\xF3",
      oast: "\u229B",
      ocir: "\u229A",
      Ocirc: "\xD4",
      ocirc: "\xF4",
      Ocy: "\u041E",
      ocy: "\u043E",
      odash: "\u229D",
      Odblac: "\u0150",
      odblac: "\u0151",
      odiv: "\u2A38",
      odot: "\u2299",
      odsold: "\u29BC",
      OElig: "\u0152",
      oelig: "\u0153",
      ofcir: "\u29BF",
      Ofr: "\u{1D512}",
      ofr: "\u{1D52C}",
      ogon: "\u02DB",
      Ograve: "\xD2",
      ograve: "\xF2",
      ogt: "\u29C1",
      ohbar: "\u29B5",
      ohm: "\u03A9",
      oint: "\u222E",
      olarr: "\u21BA",
      olcir: "\u29BE",
      olcross: "\u29BB",
      oline: "\u203E",
      olt: "\u29C0",
      Omacr: "\u014C",
      omacr: "\u014D",
      Omega: "\u03A9",
      omega: "\u03C9",
      Omicron: "\u039F",
      omicron: "\u03BF",
      omid: "\u29B6",
      ominus: "\u2296",
      Oopf: "\u{1D546}",
      oopf: "\u{1D560}",
      opar: "\u29B7",
      OpenCurlyDoubleQuote: "\u201C",
      OpenCurlyQuote: "\u2018",
      operp: "\u29B9",
      oplus: "\u2295",
      Or: "\u2A54",
      or: "\u2228",
      orarr: "\u21BB",
      ord: "\u2A5D",
      order: "\u2134",
      orderof: "\u2134",
      ordf: "\xAA",
      ordm: "\xBA",
      origof: "\u22B6",
      oror: "\u2A56",
      orslope: "\u2A57",
      orv: "\u2A5B",
      oS: "\u24C8",
      Oscr: "\u{1D4AA}",
      oscr: "\u2134",
      Oslash: "\xD8",
      oslash: "\xF8",
      osol: "\u2298",
      Otilde: "\xD5",
      otilde: "\xF5",
      Otimes: "\u2A37",
      otimes: "\u2297",
      otimesas: "\u2A36",
      Ouml: "\xD6",
      ouml: "\xF6",
      ovbar: "\u233D",
      OverBar: "\u203E",
      OverBrace: "\u23DE",
      OverBracket: "\u23B4",
      OverParenthesis: "\u23DC",
      par: "\u2225",
      para: "\xB6",
      parallel: "\u2225",
      parsim: "\u2AF3",
      parsl: "\u2AFD",
      part: "\u2202",
      PartialD: "\u2202",
      Pcy: "\u041F",
      pcy: "\u043F",
      percnt: "%",
      period: ".",
      permil: "\u2030",
      perp: "\u22A5",
      pertenk: "\u2031",
      Pfr: "\u{1D513}",
      pfr: "\u{1D52D}",
      Phi: "\u03A6",
      phi: "\u03C6",
      phiv: "\u03D5",
      phmmat: "\u2133",
      phone: "\u260E",
      Pi: "\u03A0",
      pi: "\u03C0",
      pitchfork: "\u22D4",
      piv: "\u03D6",
      planck: "\u210F",
      planckh: "\u210E",
      plankv: "\u210F",
      plus: "+",
      plusacir: "\u2A23",
      plusb: "\u229E",
      pluscir: "\u2A22",
      plusdo: "\u2214",
      plusdu: "\u2A25",
      pluse: "\u2A72",
      PlusMinus: "\xB1",
      plusmn: "\xB1",
      plussim: "\u2A26",
      plustwo: "\u2A27",
      pm: "\xB1",
      Poincareplane: "\u210C",
      pointint: "\u2A15",
      Popf: "\u2119",
      popf: "\u{1D561}",
      pound: "\xA3",
      Pr: "\u2ABB",
      pr: "\u227A",
      prap: "\u2AB7",
      prcue: "\u227C",
      prE: "\u2AB3",
      pre: "\u2AAF",
      prec: "\u227A",
      precapprox: "\u2AB7",
      preccurlyeq: "\u227C",
      Precedes: "\u227A",
      PrecedesEqual: "\u2AAF",
      PrecedesSlantEqual: "\u227C",
      PrecedesTilde: "\u227E",
      preceq: "\u2AAF",
      precnapprox: "\u2AB9",
      precneqq: "\u2AB5",
      precnsim: "\u22E8",
      precsim: "\u227E",
      Prime: "\u2033",
      prime: "\u2032",
      primes: "\u2119",
      prnap: "\u2AB9",
      prnE: "\u2AB5",
      prnsim: "\u22E8",
      prod: "\u220F",
      Product: "\u220F",
      profalar: "\u232E",
      profline: "\u2312",
      profsurf: "\u2313",
      prop: "\u221D",
      Proportion: "\u2237",
      Proportional: "\u221D",
      propto: "\u221D",
      prsim: "\u227E",
      prurel: "\u22B0",
      Pscr: "\u{1D4AB}",
      pscr: "\u{1D4C5}",
      Psi: "\u03A8",
      psi: "\u03C8",
      puncsp: "\u2008",
      Qfr: "\u{1D514}",
      qfr: "\u{1D52E}",
      qint: "\u2A0C",
      Qopf: "\u211A",
      qopf: "\u{1D562}",
      qprime: "\u2057",
      Qscr: "\u{1D4AC}",
      qscr: "\u{1D4C6}",
      quaternions: "\u210D",
      quatint: "\u2A16",
      quest: "?",
      questeq: "\u225F",
      QUOT: '"',
      quot: '"',
      rAarr: "\u21DB",
      race: "\u223D\u0331",
      Racute: "\u0154",
      racute: "\u0155",
      radic: "\u221A",
      raemptyv: "\u29B3",
      Rang: "\u27EB",
      rang: "\u27E9",
      rangd: "\u2992",
      range: "\u29A5",
      rangle: "\u27E9",
      raquo: "\xBB",
      Rarr: "\u21A0",
      rArr: "\u21D2",
      rarr: "\u2192",
      rarrap: "\u2975",
      rarrb: "\u21E5",
      rarrbfs: "\u2920",
      rarrc: "\u2933",
      rarrfs: "\u291E",
      rarrhk: "\u21AA",
      rarrlp: "\u21AC",
      rarrpl: "\u2945",
      rarrsim: "\u2974",
      Rarrtl: "\u2916",
      rarrtl: "\u21A3",
      rarrw: "\u219D",
      rAtail: "\u291C",
      ratail: "\u291A",
      ratio: "\u2236",
      rationals: "\u211A",
      RBarr: "\u2910",
      rBarr: "\u290F",
      rbarr: "\u290D",
      rbbrk: "\u2773",
      rbrace: "}",
      rbrack: "]",
      rbrke: "\u298C",
      rbrksld: "\u298E",
      rbrkslu: "\u2990",
      Rcaron: "\u0158",
      rcaron: "\u0159",
      Rcedil: "\u0156",
      rcedil: "\u0157",
      rceil: "\u2309",
      rcub: "}",
      Rcy: "\u0420",
      rcy: "\u0440",
      rdca: "\u2937",
      rdldhar: "\u2969",
      rdquo: "\u201D",
      rdquor: "\u201D",
      rdsh: "\u21B3",
      Re: "\u211C",
      real: "\u211C",
      realine: "\u211B",
      realpart: "\u211C",
      reals: "\u211D",
      rect: "\u25AD",
      REG: "\xAE",
      reg: "\xAE",
      ReverseElement: "\u220B",
      ReverseEquilibrium: "\u21CB",
      ReverseUpEquilibrium: "\u296F",
      rfisht: "\u297D",
      rfloor: "\u230B",
      Rfr: "\u211C",
      rfr: "\u{1D52F}",
      rHar: "\u2964",
      rhard: "\u21C1",
      rharu: "\u21C0",
      rharul: "\u296C",
      Rho: "\u03A1",
      rho: "\u03C1",
      rhov: "\u03F1",
      RightAngleBracket: "\u27E9",
      RightArrow: "\u2192",
      Rightarrow: "\u21D2",
      rightarrow: "\u2192",
      RightArrowBar: "\u21E5",
      RightArrowLeftArrow: "\u21C4",
      rightarrowtail: "\u21A3",
      RightCeiling: "\u2309",
      RightDoubleBracket: "\u27E7",
      RightDownTeeVector: "\u295D",
      RightDownVector: "\u21C2",
      RightDownVectorBar: "\u2955",
      RightFloor: "\u230B",
      rightharpoondown: "\u21C1",
      rightharpoonup: "\u21C0",
      rightleftarrows: "\u21C4",
      rightleftharpoons: "\u21CC",
      rightrightarrows: "\u21C9",
      rightsquigarrow: "\u219D",
      RightTee: "\u22A2",
      RightTeeArrow: "\u21A6",
      RightTeeVector: "\u295B",
      rightthreetimes: "\u22CC",
      RightTriangle: "\u22B3",
      RightTriangleBar: "\u29D0",
      RightTriangleEqual: "\u22B5",
      RightUpDownVector: "\u294F",
      RightUpTeeVector: "\u295C",
      RightUpVector: "\u21BE",
      RightUpVectorBar: "\u2954",
      RightVector: "\u21C0",
      RightVectorBar: "\u2953",
      ring: "\u02DA",
      risingdotseq: "\u2253",
      rlarr: "\u21C4",
      rlhar: "\u21CC",
      rlm: "\u200F",
      rmoust: "\u23B1",
      rmoustache: "\u23B1",
      rnmid: "\u2AEE",
      roang: "\u27ED",
      roarr: "\u21FE",
      robrk: "\u27E7",
      ropar: "\u2986",
      Ropf: "\u211D",
      ropf: "\u{1D563}",
      roplus: "\u2A2E",
      rotimes: "\u2A35",
      RoundImplies: "\u2970",
      rpar: ")",
      rpargt: "\u2994",
      rppolint: "\u2A12",
      rrarr: "\u21C9",
      Rrightarrow: "\u21DB",
      rsaquo: "\u203A",
      Rscr: "\u211B",
      rscr: "\u{1D4C7}",
      Rsh: "\u21B1",
      rsh: "\u21B1",
      rsqb: "]",
      rsquo: "\u2019",
      rsquor: "\u2019",
      rthree: "\u22CC",
      rtimes: "\u22CA",
      rtri: "\u25B9",
      rtrie: "\u22B5",
      rtrif: "\u25B8",
      rtriltri: "\u29CE",
      RuleDelayed: "\u29F4",
      ruluhar: "\u2968",
      rx: "\u211E",
      Sacute: "\u015A",
      sacute: "\u015B",
      sbquo: "\u201A",
      Sc: "\u2ABC",
      sc: "\u227B",
      scap: "\u2AB8",
      Scaron: "\u0160",
      scaron: "\u0161",
      sccue: "\u227D",
      scE: "\u2AB4",
      sce: "\u2AB0",
      Scedil: "\u015E",
      scedil: "\u015F",
      Scirc: "\u015C",
      scirc: "\u015D",
      scnap: "\u2ABA",
      scnE: "\u2AB6",
      scnsim: "\u22E9",
      scpolint: "\u2A13",
      scsim: "\u227F",
      Scy: "\u0421",
      scy: "\u0441",
      sdot: "\u22C5",
      sdotb: "\u22A1",
      sdote: "\u2A66",
      searhk: "\u2925",
      seArr: "\u21D8",
      searr: "\u2198",
      searrow: "\u2198",
      sect: "\xA7",
      semi: ";",
      seswar: "\u2929",
      setminus: "\u2216",
      setmn: "\u2216",
      sext: "\u2736",
      Sfr: "\u{1D516}",
      sfr: "\u{1D530}",
      sfrown: "\u2322",
      sharp: "\u266F",
      SHCHcy: "\u0429",
      shchcy: "\u0449",
      SHcy: "\u0428",
      shcy: "\u0448",
      ShortDownArrow: "\u2193",
      ShortLeftArrow: "\u2190",
      shortmid: "\u2223",
      shortparallel: "\u2225",
      ShortRightArrow: "\u2192",
      ShortUpArrow: "\u2191",
      shy: "\xAD",
      Sigma: "\u03A3",
      sigma: "\u03C3",
      sigmaf: "\u03C2",
      sigmav: "\u03C2",
      sim: "\u223C",
      simdot: "\u2A6A",
      sime: "\u2243",
      simeq: "\u2243",
      simg: "\u2A9E",
      simgE: "\u2AA0",
      siml: "\u2A9D",
      simlE: "\u2A9F",
      simne: "\u2246",
      simplus: "\u2A24",
      simrarr: "\u2972",
      slarr: "\u2190",
      SmallCircle: "\u2218",
      smallsetminus: "\u2216",
      smashp: "\u2A33",
      smeparsl: "\u29E4",
      smid: "\u2223",
      smile: "\u2323",
      smt: "\u2AAA",
      smte: "\u2AAC",
      smtes: "\u2AAC\uFE00",
      SOFTcy: "\u042C",
      softcy: "\u044C",
      sol: "/",
      solb: "\u29C4",
      solbar: "\u233F",
      Sopf: "\u{1D54A}",
      sopf: "\u{1D564}",
      spades: "\u2660",
      spadesuit: "\u2660",
      spar: "\u2225",
      sqcap: "\u2293",
      sqcaps: "\u2293\uFE00",
      sqcup: "\u2294",
      sqcups: "\u2294\uFE00",
      Sqrt: "\u221A",
      sqsub: "\u228F",
      sqsube: "\u2291",
      sqsubset: "\u228F",
      sqsubseteq: "\u2291",
      sqsup: "\u2290",
      sqsupe: "\u2292",
      sqsupset: "\u2290",
      sqsupseteq: "\u2292",
      squ: "\u25A1",
      Square: "\u25A1",
      square: "\u25A1",
      SquareIntersection: "\u2293",
      SquareSubset: "\u228F",
      SquareSubsetEqual: "\u2291",
      SquareSuperset: "\u2290",
      SquareSupersetEqual: "\u2292",
      SquareUnion: "\u2294",
      squarf: "\u25AA",
      squf: "\u25AA",
      srarr: "\u2192",
      Sscr: "\u{1D4AE}",
      sscr: "\u{1D4C8}",
      ssetmn: "\u2216",
      ssmile: "\u2323",
      sstarf: "\u22C6",
      Star: "\u22C6",
      star: "\u2606",
      starf: "\u2605",
      straightepsilon: "\u03F5",
      straightphi: "\u03D5",
      strns: "\xAF",
      Sub: "\u22D0",
      sub: "\u2282",
      subdot: "\u2ABD",
      subE: "\u2AC5",
      sube: "\u2286",
      subedot: "\u2AC3",
      submult: "\u2AC1",
      subnE: "\u2ACB",
      subne: "\u228A",
      subplus: "\u2ABF",
      subrarr: "\u2979",
      Subset: "\u22D0",
      subset: "\u2282",
      subseteq: "\u2286",
      subseteqq: "\u2AC5",
      SubsetEqual: "\u2286",
      subsetneq: "\u228A",
      subsetneqq: "\u2ACB",
      subsim: "\u2AC7",
      subsub: "\u2AD5",
      subsup: "\u2AD3",
      succ: "\u227B",
      succapprox: "\u2AB8",
      succcurlyeq: "\u227D",
      Succeeds: "\u227B",
      SucceedsEqual: "\u2AB0",
      SucceedsSlantEqual: "\u227D",
      SucceedsTilde: "\u227F",
      succeq: "\u2AB0",
      succnapprox: "\u2ABA",
      succneqq: "\u2AB6",
      succnsim: "\u22E9",
      succsim: "\u227F",
      SuchThat: "\u220B",
      Sum: "\u2211",
      sum: "\u2211",
      sung: "\u266A",
      Sup: "\u22D1",
      sup: "\u2283",
      sup1: "\xB9",
      sup2: "\xB2",
      sup3: "\xB3",
      supdot: "\u2ABE",
      supdsub: "\u2AD8",
      supE: "\u2AC6",
      supe: "\u2287",
      supedot: "\u2AC4",
      Superset: "\u2283",
      SupersetEqual: "\u2287",
      suphsol: "\u27C9",
      suphsub: "\u2AD7",
      suplarr: "\u297B",
      supmult: "\u2AC2",
      supnE: "\u2ACC",
      supne: "\u228B",
      supplus: "\u2AC0",
      Supset: "\u22D1",
      supset: "\u2283",
      supseteq: "\u2287",
      supseteqq: "\u2AC6",
      supsetneq: "\u228B",
      supsetneqq: "\u2ACC",
      supsim: "\u2AC8",
      supsub: "\u2AD4",
      supsup: "\u2AD6",
      swarhk: "\u2926",
      swArr: "\u21D9",
      swarr: "\u2199",
      swarrow: "\u2199",
      swnwar: "\u292A",
      szlig: "\xDF",
      Tab: "	",
      target: "\u2316",
      Tau: "\u03A4",
      tau: "\u03C4",
      tbrk: "\u23B4",
      Tcaron: "\u0164",
      tcaron: "\u0165",
      Tcedil: "\u0162",
      tcedil: "\u0163",
      Tcy: "\u0422",
      tcy: "\u0442",
      tdot: "\u20DB",
      telrec: "\u2315",
      Tfr: "\u{1D517}",
      tfr: "\u{1D531}",
      there4: "\u2234",
      Therefore: "\u2234",
      therefore: "\u2234",
      Theta: "\u0398",
      theta: "\u03B8",
      thetasym: "\u03D1",
      thetav: "\u03D1",
      thickapprox: "\u2248",
      thicksim: "\u223C",
      ThickSpace: "\u205F\u200A",
      thinsp: "\u2009",
      ThinSpace: "\u2009",
      thkap: "\u2248",
      thksim: "\u223C",
      THORN: "\xDE",
      thorn: "\xFE",
      Tilde: "\u223C",
      tilde: "\u02DC",
      TildeEqual: "\u2243",
      TildeFullEqual: "\u2245",
      TildeTilde: "\u2248",
      times: "\xD7",
      timesb: "\u22A0",
      timesbar: "\u2A31",
      timesd: "\u2A30",
      tint: "\u222D",
      toea: "\u2928",
      top: "\u22A4",
      topbot: "\u2336",
      topcir: "\u2AF1",
      Topf: "\u{1D54B}",
      topf: "\u{1D565}",
      topfork: "\u2ADA",
      tosa: "\u2929",
      tprime: "\u2034",
      TRADE: "\u2122",
      trade: "\u2122",
      triangle: "\u25B5",
      triangledown: "\u25BF",
      triangleleft: "\u25C3",
      trianglelefteq: "\u22B4",
      triangleq: "\u225C",
      triangleright: "\u25B9",
      trianglerighteq: "\u22B5",
      tridot: "\u25EC",
      trie: "\u225C",
      triminus: "\u2A3A",
      TripleDot: "\u20DB",
      triplus: "\u2A39",
      trisb: "\u29CD",
      tritime: "\u2A3B",
      trpezium: "\u23E2",
      Tscr: "\u{1D4AF}",
      tscr: "\u{1D4C9}",
      TScy: "\u0426",
      tscy: "\u0446",
      TSHcy: "\u040B",
      tshcy: "\u045B",
      Tstrok: "\u0166",
      tstrok: "\u0167",
      twixt: "\u226C",
      twoheadleftarrow: "\u219E",
      twoheadrightarrow: "\u21A0",
      Uacute: "\xDA",
      uacute: "\xFA",
      Uarr: "\u219F",
      uArr: "\u21D1",
      uarr: "\u2191",
      Uarrocir: "\u2949",
      Ubrcy: "\u040E",
      ubrcy: "\u045E",
      Ubreve: "\u016C",
      ubreve: "\u016D",
      Ucirc: "\xDB",
      ucirc: "\xFB",
      Ucy: "\u0423",
      ucy: "\u0443",
      udarr: "\u21C5",
      Udblac: "\u0170",
      udblac: "\u0171",
      udhar: "\u296E",
      ufisht: "\u297E",
      Ufr: "\u{1D518}",
      ufr: "\u{1D532}",
      Ugrave: "\xD9",
      ugrave: "\xF9",
      uHar: "\u2963",
      uharl: "\u21BF",
      uharr: "\u21BE",
      uhblk: "\u2580",
      ulcorn: "\u231C",
      ulcorner: "\u231C",
      ulcrop: "\u230F",
      ultri: "\u25F8",
      Umacr: "\u016A",
      umacr: "\u016B",
      uml: "\xA8",
      UnderBar: "_",
      UnderBrace: "\u23DF",
      UnderBracket: "\u23B5",
      UnderParenthesis: "\u23DD",
      Union: "\u22C3",
      UnionPlus: "\u228E",
      Uogon: "\u0172",
      uogon: "\u0173",
      Uopf: "\u{1D54C}",
      uopf: "\u{1D566}",
      UpArrow: "\u2191",
      Uparrow: "\u21D1",
      uparrow: "\u2191",
      UpArrowBar: "\u2912",
      UpArrowDownArrow: "\u21C5",
      UpDownArrow: "\u2195",
      Updownarrow: "\u21D5",
      updownarrow: "\u2195",
      UpEquilibrium: "\u296E",
      upharpoonleft: "\u21BF",
      upharpoonright: "\u21BE",
      uplus: "\u228E",
      UpperLeftArrow: "\u2196",
      UpperRightArrow: "\u2197",
      Upsi: "\u03D2",
      upsi: "\u03C5",
      upsih: "\u03D2",
      Upsilon: "\u03A5",
      upsilon: "\u03C5",
      UpTee: "\u22A5",
      UpTeeArrow: "\u21A5",
      upuparrows: "\u21C8",
      urcorn: "\u231D",
      urcorner: "\u231D",
      urcrop: "\u230E",
      Uring: "\u016E",
      uring: "\u016F",
      urtri: "\u25F9",
      Uscr: "\u{1D4B0}",
      uscr: "\u{1D4CA}",
      utdot: "\u22F0",
      Utilde: "\u0168",
      utilde: "\u0169",
      utri: "\u25B5",
      utrif: "\u25B4",
      uuarr: "\u21C8",
      Uuml: "\xDC",
      uuml: "\xFC",
      uwangle: "\u29A7",
      vangrt: "\u299C",
      varepsilon: "\u03F5",
      varkappa: "\u03F0",
      varnothing: "\u2205",
      varphi: "\u03D5",
      varpi: "\u03D6",
      varpropto: "\u221D",
      vArr: "\u21D5",
      varr: "\u2195",
      varrho: "\u03F1",
      varsigma: "\u03C2",
      varsubsetneq: "\u228A\uFE00",
      varsubsetneqq: "\u2ACB\uFE00",
      varsupsetneq: "\u228B\uFE00",
      varsupsetneqq: "\u2ACC\uFE00",
      vartheta: "\u03D1",
      vartriangleleft: "\u22B2",
      vartriangleright: "\u22B3",
      Vbar: "\u2AEB",
      vBar: "\u2AE8",
      vBarv: "\u2AE9",
      Vcy: "\u0412",
      vcy: "\u0432",
      VDash: "\u22AB",
      Vdash: "\u22A9",
      vDash: "\u22A8",
      vdash: "\u22A2",
      Vdashl: "\u2AE6",
      Vee: "\u22C1",
      vee: "\u2228",
      veebar: "\u22BB",
      veeeq: "\u225A",
      vellip: "\u22EE",
      Verbar: "\u2016",
      verbar: "|",
      Vert: "\u2016",
      vert: "|",
      VerticalBar: "\u2223",
      VerticalLine: "|",
      VerticalSeparator: "\u2758",
      VerticalTilde: "\u2240",
      VeryThinSpace: "\u200A",
      Vfr: "\u{1D519}",
      vfr: "\u{1D533}",
      vltri: "\u22B2",
      vnsub: "\u2282\u20D2",
      vnsup: "\u2283\u20D2",
      Vopf: "\u{1D54D}",
      vopf: "\u{1D567}",
      vprop: "\u221D",
      vrtri: "\u22B3",
      Vscr: "\u{1D4B1}",
      vscr: "\u{1D4CB}",
      vsubnE: "\u2ACB\uFE00",
      vsubne: "\u228A\uFE00",
      vsupnE: "\u2ACC\uFE00",
      vsupne: "\u228B\uFE00",
      Vvdash: "\u22AA",
      vzigzag: "\u299A",
      Wcirc: "\u0174",
      wcirc: "\u0175",
      wedbar: "\u2A5F",
      Wedge: "\u22C0",
      wedge: "\u2227",
      wedgeq: "\u2259",
      weierp: "\u2118",
      Wfr: "\u{1D51A}",
      wfr: "\u{1D534}",
      Wopf: "\u{1D54E}",
      wopf: "\u{1D568}",
      wp: "\u2118",
      wr: "\u2240",
      wreath: "\u2240",
      Wscr: "\u{1D4B2}",
      wscr: "\u{1D4CC}",
      xcap: "\u22C2",
      xcirc: "\u25EF",
      xcup: "\u22C3",
      xdtri: "\u25BD",
      Xfr: "\u{1D51B}",
      xfr: "\u{1D535}",
      xhArr: "\u27FA",
      xharr: "\u27F7",
      Xi: "\u039E",
      xi: "\u03BE",
      xlArr: "\u27F8",
      xlarr: "\u27F5",
      xmap: "\u27FC",
      xnis: "\u22FB",
      xodot: "\u2A00",
      Xopf: "\u{1D54F}",
      xopf: "\u{1D569}",
      xoplus: "\u2A01",
      xotime: "\u2A02",
      xrArr: "\u27F9",
      xrarr: "\u27F6",
      Xscr: "\u{1D4B3}",
      xscr: "\u{1D4CD}",
      xsqcup: "\u2A06",
      xuplus: "\u2A04",
      xutri: "\u25B3",
      xvee: "\u22C1",
      xwedge: "\u22C0",
      Yacute: "\xDD",
      yacute: "\xFD",
      YAcy: "\u042F",
      yacy: "\u044F",
      Ycirc: "\u0176",
      ycirc: "\u0177",
      Ycy: "\u042B",
      ycy: "\u044B",
      yen: "\xA5",
      Yfr: "\u{1D51C}",
      yfr: "\u{1D536}",
      YIcy: "\u0407",
      yicy: "\u0457",
      Yopf: "\u{1D550}",
      yopf: "\u{1D56A}",
      Yscr: "\u{1D4B4}",
      yscr: "\u{1D4CE}",
      YUcy: "\u042E",
      yucy: "\u044E",
      Yuml: "\u0178",
      yuml: "\xFF",
      Zacute: "\u0179",
      zacute: "\u017A",
      Zcaron: "\u017D",
      zcaron: "\u017E",
      Zcy: "\u0417",
      zcy: "\u0437",
      Zdot: "\u017B",
      zdot: "\u017C",
      zeetrf: "\u2128",
      ZeroWidthSpace: "\u200B",
      Zeta: "\u0396",
      zeta: "\u03B6",
      Zfr: "\u2128",
      zfr: "\u{1D537}",
      ZHcy: "\u0416",
      zhcy: "\u0436",
      zigrarr: "\u21DD",
      Zopf: "\u2124",
      zopf: "\u{1D56B}",
      Zscr: "\u{1D4B5}",
      zscr: "\u{1D4CF}",
      zwj: "\u200D",
      zwnj: "\u200C"
    });
    exports.entityMap = exports.HTML_ENTITIES;
  }
});

// node_modules/@xmldom/xmldom/lib/sax.js
var require_sax = __commonJS({
  "node_modules/@xmldom/xmldom/lib/sax.js"(exports) {
    "use strict";
    var conventions = require_conventions();
    var g = require_grammar();
    var errors = require_errors();
    var isHTMLEscapableRawTextElement = conventions.isHTMLEscapableRawTextElement;
    var isHTMLMimeType = conventions.isHTMLMimeType;
    var isHTMLRawTextElement = conventions.isHTMLRawTextElement;
    var hasOwn = conventions.hasOwn;
    var NAMESPACE = conventions.NAMESPACE;
    var ParseError = errors.ParseError;
    var DOMException = errors.DOMException;
    var S_TAG = 0;
    var S_ATTR = 1;
    var S_ATTR_SPACE = 2;
    var S_EQ = 3;
    var S_ATTR_NOQUOT_VALUE = 4;
    var S_ATTR_END = 5;
    var S_TAG_SPACE = 6;
    var S_TAG_CLOSE = 7;
    function XMLReader() {
    }
    XMLReader.prototype = {
      parse: function(source, defaultNSMap, entityMap) {
        var domBuilder = this.domBuilder;
        domBuilder.startDocument();
        _copy(defaultNSMap, defaultNSMap = /* @__PURE__ */ Object.create(null));
        parse2(source, defaultNSMap, entityMap, domBuilder, this.errorHandler);
        domBuilder.endDocument();
      }
    };
    var ENTITY_REG = /&#?\w+;?/g;
    function parse2(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
      var isHTML = isHTMLMimeType(domBuilder.mimeType);
      if (source.indexOf(g.UNICODE_REPLACEMENT_CHARACTER) >= 0) {
        errorHandler.warning("Unicode replacement character detected, source encoding issues?");
      }
      function fixedFromCharCode(code) {
        if (code > 65535) {
          code -= 65536;
          var surrogate1 = 55296 + (code >> 10), surrogate2 = 56320 + (code & 1023);
          return String.fromCharCode(surrogate1, surrogate2);
        } else {
          return String.fromCharCode(code);
        }
      }
      function entityReplacer(a2) {
        var complete = a2[a2.length - 1] === ";" ? a2 : a2 + ";";
        if (!isHTML && complete !== a2) {
          errorHandler.error("EntityRef: expecting ;");
          return a2;
        }
        var match = g.Reference.exec(complete);
        if (!match || match[0].length !== complete.length) {
          errorHandler.error("entity not matching Reference production: " + a2);
          return a2;
        }
        var k = complete.slice(1, -1);
        if (hasOwn(entityMap, k)) {
          return entityMap[k];
        } else if (k.charAt(0) === "#") {
          return fixedFromCharCode(parseInt(k.substring(1).replace("x", "0x")));
        } else {
          errorHandler.error("entity not found:" + a2);
          return a2;
        }
      }
      function appendText(end2) {
        if (end2 > start) {
          var xt = source.substring(start, end2).replace(ENTITY_REG, entityReplacer);
          locator && position(start);
          domBuilder.characters(xt, 0, end2 - start);
          start = end2;
        }
      }
      var lineStart = 0;
      var lineEnd = 0;
      var linePattern = /\r\n?|\n|$/g;
      var locator = domBuilder.locator;
      function position(p, m) {
        while (p >= lineEnd && (m = linePattern.exec(source))) {
          lineStart = lineEnd;
          lineEnd = m.index + m[0].length;
          locator.lineNumber++;
        }
        locator.columnNumber = p - lineStart + 1;
      }
      var parseStack = [{ currentNSMap: defaultNSMapCopy }];
      var unclosedTags = [];
      var start = 0;
      while (true) {
        try {
          var tagStart = source.indexOf("<", start);
          if (tagStart < 0) {
            if (!isHTML && unclosedTags.length > 0) {
              return errorHandler.fatalError("unclosed xml tag(s): " + unclosedTags.join(", "));
            }
            if (!source.substring(start).match(/^\s*$/)) {
              var doc = domBuilder.doc;
              var text = doc.createTextNode(source.substring(start));
              if (doc.documentElement) {
                return errorHandler.error("Extra content at the end of the document");
              }
              doc.appendChild(text);
              domBuilder.currentElement = text;
            }
            return;
          }
          if (tagStart > start) {
            var fromSource = source.substring(start, tagStart);
            if (!isHTML && unclosedTags.length === 0) {
              fromSource = fromSource.replace(new RegExp(g.S_OPT.source, "g"), "");
              fromSource && errorHandler.error("Unexpected content outside root element: '" + fromSource + "'");
            }
            appendText(tagStart);
          }
          switch (source.charAt(tagStart + 1)) {
            case "/":
              var end = source.indexOf(">", tagStart + 2);
              var tagNameRaw = source.substring(tagStart + 2, end > 0 ? end : void 0);
              if (!tagNameRaw) {
                return errorHandler.fatalError("end tag name missing");
              }
              var endTagNameStrict = g.reg("^", g.QName_group, g.S_OPT, "$");
              var tagNameMatch = end > 0 && endTagNameStrict.exec(tagNameRaw);
              if (!tagNameMatch) {
                var leadingTagNameMatch = end > 0 && g.reg("^", g.QName_group).exec(tagNameRaw);
                if (isHTML && leadingTagNameMatch) {
                  errorHandler.warning('end tag name contains invalid trailing characters: "' + tagNameRaw + '"');
                  tagNameMatch = leadingTagNameMatch;
                } else if (
                  // Backward compatibility, remove this whole `else if` arm in the next breaking release
                  // (XML then falls through to the `fatalError` below, for a clean mode split: XML fatal,
                  // HTML warning). A valid end-tag name followed by a line break and trailing content was
                  // silently accepted while `reg` still used the `m` flag; re-adding `m` here matches exactly
                  // those inputs, kept recoverable and reported.
                  leadingTagNameMatch && new RegExp(endTagNameStrict.source, endTagNameStrict.flags + "m").test(tagNameRaw)
                ) {
                  errorHandler.error('end tag name is followed by a line break and trailing content: "' + tagNameRaw + '"');
                  tagNameMatch = leadingTagNameMatch;
                } else {
                  return errorHandler.fatalError('end tag name contains invalid characters: "' + tagNameRaw + '"');
                }
              }
              if (!domBuilder.currentElement && !domBuilder.doc.documentElement) {
                return;
              }
              var currentTagName = unclosedTags[unclosedTags.length - 1] || domBuilder.currentElement.tagName || domBuilder.doc.documentElement.tagName || "";
              if (currentTagName !== tagNameMatch[1]) {
                var tagNameLower = tagNameMatch[1].toLowerCase();
                if (!isHTML || currentTagName.toLowerCase() !== tagNameLower) {
                  return errorHandler.fatalError('Opening and ending tag mismatch: "' + currentTagName + '" != "' + tagNameRaw + '"');
                }
              }
              var config2 = parseStack.pop();
              unclosedTags.pop();
              var localNSMap = config2.localNSMap;
              domBuilder.endElement(config2.uri, config2.localName, currentTagName);
              if (localNSMap) {
                for (var prefix in localNSMap) {
                  if (hasOwn(localNSMap, prefix)) {
                    domBuilder.endPrefixMapping(prefix);
                  }
                }
              }
              end++;
              break;
            // end element
            case "?":
              locator && position(tagStart);
              end = parseProcessingInstruction(source, tagStart, domBuilder, errorHandler);
              break;
            case "!":
              locator && position(tagStart);
              end = parseDoctypeCommentOrCData(source, tagStart, domBuilder, errorHandler, isHTML);
              break;
            default:
              locator && position(tagStart);
              var el = new ElementAttributes();
              var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
              var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler, isHTML);
              var len = el.length;
              if (!el.closed) {
                if (isHTML && conventions.isHTMLVoidElement(el.tagName)) {
                  el.closed = true;
                } else {
                  unclosedTags.push(el.tagName);
                }
              }
              if (locator && len) {
                var locator2 = copyLocator(locator, {});
                for (var i = 0; i < len; i++) {
                  var a = el[i];
                  position(a.offset);
                  a.locator = copyLocator(locator, {});
                }
                domBuilder.locator = locator2;
                if (appendElement(el, domBuilder, currentNSMap)) {
                  parseStack.push(el);
                }
                domBuilder.locator = locator;
              } else {
                if (appendElement(el, domBuilder, currentNSMap)) {
                  parseStack.push(el);
                }
              }
              if (isHTML && !el.closed) {
                end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
              } else {
                end++;
              }
          }
        } catch (e) {
          if (e instanceof ParseError) {
            throw e;
          } else if (e instanceof DOMException) {
            return errorHandler.fatalError("Error constructing the DOM: " + e.name + ": " + e.message, e);
          }
          errorHandler.error("element parse error: " + e);
          end = -1;
        }
        if (end > start) {
          start = end;
        } else {
          appendText(Math.max(tagStart, start) + 1);
        }
      }
    }
    function copyLocator(f, t) {
      t.lineNumber = f.lineNumber;
      t.columnNumber = f.columnNumber;
      return t;
    }
    function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler, isHTML) {
      function addAttribute(qname, value2, startIndex) {
        if (hasOwn(el.attributeNames, qname)) {
          return errorHandler.fatalError("Attribute " + qname + " redefined");
        }
        if (!isHTML && value2.indexOf("<") >= 0) {
          return errorHandler.fatalError("Unescaped '<' not allowed in attributes values");
        }
        el.addValue(
          qname,
          // @see https://www.w3.org/TR/xml/#AVNormalize
          // since the xmldom sax parser does not "interpret" DTD the following is not implemented:
          // - recursive replacement of (DTD) entity references
          // - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
          value2.replace(/[\t\n\r]/g, " ").replace(ENTITY_REG, entityReplacer),
          startIndex
        );
      }
      var attrName;
      var value;
      var p = ++start;
      var s = S_TAG;
      while (true) {
        var c = source.charAt(p);
        if (s === S_TAG && c === "<") {
          throw new Error("unexpected < in tag name: " + source.slice(start, p));
        }
        switch (c) {
          case "=":
            if (s === S_ATTR) {
              attrName = source.slice(start, p);
              s = S_EQ;
            } else if (s === S_ATTR_SPACE) {
              s = S_EQ;
            } else {
              throw new Error("attribute equal must after attrName");
            }
            break;
          case "'":
          case '"':
            if (s === S_EQ || s === S_ATTR) {
              if (s === S_ATTR) {
                errorHandler.warning('attribute value must after "="');
                attrName = source.slice(start, p);
              }
              start = p + 1;
              p = source.indexOf(c, start);
              if (p > 0) {
                value = source.slice(start, p);
                addAttribute(attrName, value, start - 1);
                s = S_ATTR_END;
              } else {
                throw new Error("attribute value no end '" + c + "' match");
              }
            } else if (s == S_ATTR_NOQUOT_VALUE) {
              value = source.slice(start, p);
              addAttribute(attrName, value, start);
              errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ")!!");
              start = p + 1;
              s = S_ATTR_END;
            } else {
              throw new Error('attribute value must after "="');
            }
            break;
          case "/":
            switch (s) {
              case S_TAG:
                el.setTagName(source.slice(start, p));
              case S_ATTR_END:
              case S_TAG_SPACE:
              case S_TAG_CLOSE:
                s = S_TAG_CLOSE;
                el.closed = true;
              case S_ATTR_NOQUOT_VALUE:
              case S_ATTR:
                break;
              case S_ATTR_SPACE:
                el.closed = true;
                break;
              //case S_EQ:
              default:
                throw new Error("attribute invalid close char('/')");
            }
            break;
          case "":
            errorHandler.error("unexpected end of input");
            if (s == S_TAG) {
              el.setTagName(source.slice(start, p));
            }
            return p;
          case ">":
            switch (s) {
              case S_TAG:
                el.setTagName(source.slice(start, p));
              case S_ATTR_END:
              case S_TAG_SPACE:
              case S_TAG_CLOSE:
                break;
              //normal
              case S_ATTR_NOQUOT_VALUE:
              //Compatible state
              case S_ATTR:
                value = source.slice(start, p);
                if (value.slice(-1) === "/") {
                  el.closed = true;
                  value = value.slice(0, -1);
                }
              case S_ATTR_SPACE:
                if (s === S_ATTR_SPACE) {
                  value = attrName;
                }
                if (s == S_ATTR_NOQUOT_VALUE) {
                  errorHandler.warning('attribute "' + value + '" missed quot(")!');
                  addAttribute(attrName, value, start);
                } else {
                  if (!isHTML) {
                    errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!');
                  }
                  addAttribute(value, value, start);
                }
                break;
              case S_EQ:
                if (!isHTML) {
                  return errorHandler.fatalError(`AttValue: ' or " expected`);
                }
            }
            return p;
          /*xml space '\x20' | #x9 | #xD | #xA; */
          case "\x80":
            c = " ";
          default:
            if (c <= " ") {
              switch (s) {
                case S_TAG:
                  el.setTagName(source.slice(start, p));
                  s = S_TAG_SPACE;
                  break;
                case S_ATTR:
                  attrName = source.slice(start, p);
                  s = S_ATTR_SPACE;
                  break;
                case S_ATTR_NOQUOT_VALUE:
                  var value = source.slice(start, p);
                  errorHandler.warning('attribute "' + value + '" missed quot(")!!');
                  addAttribute(attrName, value, start);
                case S_ATTR_END:
                  s = S_TAG_SPACE;
                  break;
              }
            } else {
              switch (s) {
                //case S_TAG:void();break;
                //case S_ATTR:void();break;
                //case S_ATTR_NOQUOT_VALUE:void();break;
                case S_ATTR_SPACE:
                  if (!isHTML) {
                    errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!');
                  }
                  addAttribute(attrName, attrName, start);
                  start = p;
                  s = S_ATTR;
                  break;
                case S_ATTR_END:
                  errorHandler.warning('attribute space is required"' + attrName + '"!!');
                case S_TAG_SPACE:
                  s = S_ATTR;
                  start = p;
                  break;
                case S_EQ:
                  s = S_ATTR_NOQUOT_VALUE;
                  start = p;
                  break;
                case S_TAG_CLOSE:
                  throw new Error("elements closed character '/' and '>' must be connected to");
              }
            }
        }
        p++;
      }
    }
    function appendElement(el, domBuilder, currentNSMap) {
      var tagName = el.tagName;
      var localNSMap = null;
      var i = el.length;
      while (i--) {
        var a = el[i];
        var qName = a.qName;
        var value = a.value;
        var nsp = qName.indexOf(":");
        if (nsp > 0) {
          var prefix = a.prefix = qName.slice(0, nsp);
          var localName = qName.slice(nsp + 1);
          var nsPrefix = prefix === "xmlns" && localName;
        } else {
          localName = qName;
          prefix = null;
          nsPrefix = qName === "xmlns" && "";
        }
        a.localName = localName;
        if (nsPrefix !== false) {
          if (localNSMap == null) {
            localNSMap = /* @__PURE__ */ Object.create(null);
            currentNSMap = Object.create(currentNSMap);
          }
          currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
          a.uri = NAMESPACE.XMLNS;
          domBuilder.startPrefixMapping(nsPrefix, value);
        }
      }
      var i = el.length;
      while (i--) {
        a = el[i];
        if (a.prefix) {
          if (a.prefix === "xml") {
            a.uri = NAMESPACE.XML;
          }
          if (a.prefix !== "xmlns") {
            a.uri = currentNSMap[a.prefix];
          }
        }
      }
      var nsp = tagName.indexOf(":");
      if (nsp > 0) {
        prefix = el.prefix = tagName.slice(0, nsp);
        localName = el.localName = tagName.slice(nsp + 1);
      } else {
        prefix = null;
        localName = el.localName = tagName;
      }
      var ns = el.uri = currentNSMap[prefix || ""];
      domBuilder.startElement(ns, localName, tagName, el);
      if (el.closed) {
        domBuilder.endElement(ns, localName, tagName);
        if (localNSMap) {
          for (prefix in localNSMap) {
            if (hasOwn(localNSMap, prefix)) {
              domBuilder.endPrefixMapping(prefix);
            }
          }
        }
      } else {
        el.currentNSMap = currentNSMap;
        el.localNSMap = localNSMap;
        return true;
      }
    }
    function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
      var isEscapableRaw = isHTMLEscapableRawTextElement(tagName);
      if (isEscapableRaw || isHTMLRawTextElement(tagName)) {
        var closeTag = new RegExp("</" + tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ">", "ig");
        closeTag.lastIndex = elStartEnd;
        var match = closeTag.exec(source);
        var elEndStart = match ? match.index : -1;
        if (elEndStart < 0) {
          return elStartEnd + 1;
        }
        var text = source.substring(elStartEnd + 1, elEndStart);
        if (isEscapableRaw) {
          text = text.replace(ENTITY_REG, entityReplacer);
        }
        domBuilder.characters(text, 0, text.length);
        return elEndStart;
      }
      return elStartEnd + 1;
    }
    function _copy(source, target) {
      for (var n in source) {
        if (hasOwn(source, n)) {
          target[n] = source[n];
        }
      }
    }
    function parseUtils(source, start) {
      var index = start;
      function char(n) {
        n = n || 0;
        return source.charAt(index + n);
      }
      function skip(n) {
        n = n || 1;
        index += n;
      }
      function skipBlanks() {
        var blanks = 0;
        while (index < source.length) {
          var c = char();
          if (c !== " " && c !== "\n" && c !== "	" && c !== "\r") {
            return blanks;
          }
          blanks++;
          skip();
        }
        return -1;
      }
      function substringFromIndex() {
        return source.substring(index);
      }
      function substringStartsWith(text) {
        return source.substring(index, index + text.length) === text;
      }
      function substringStartsWithCaseInsensitive(text) {
        return source.substring(index, index + text.length).toUpperCase() === text.toUpperCase();
      }
      function getMatch(args) {
        var expr = g.reg("^", args);
        var match = expr.exec(substringFromIndex());
        if (match) {
          skip(match[0].length);
          return match[0];
        }
        return null;
      }
      return {
        char,
        getIndex: function() {
          return index;
        },
        getMatch,
        getSource: function() {
          return source;
        },
        skip,
        skipBlanks,
        substringFromIndex,
        substringStartsWith,
        substringStartsWithCaseInsensitive
      };
    }
    function parseDoctypeInternalSubset(p, errorHandler) {
      function parsePI(p2, errorHandler2) {
        var match = g.PI.exec(p2.substringFromIndex());
        if (!match) {
          return errorHandler2.fatalError("processing instruction is not well-formed at position " + p2.getIndex());
        }
        if (match[1].toLowerCase() === "xml") {
          return errorHandler2.fatalError(
            "xml declaration is only allowed at the start of the document, but found at position " + p2.getIndex()
          );
        }
        p2.skip(match[0].length);
        return match[0];
      }
      var source = p.getSource();
      if (p.char() === "[") {
        p.skip(1);
        var intSubsetStart = p.getIndex();
        while (p.getIndex() < source.length) {
          p.skipBlanks();
          if (p.char() === "]") {
            var internalSubset = source.substring(intSubsetStart, p.getIndex());
            p.skip(1);
            return internalSubset;
          }
          var current = null;
          if (p.char() === "<" && p.char(1) === "!") {
            switch (p.char(2)) {
              case "E":
                if (p.char(3) === "L") {
                  current = p.getMatch(g.elementdecl);
                } else if (p.char(3) === "N") {
                  current = p.getMatch(g.EntityDecl);
                }
                break;
              case "A":
                current = p.getMatch(g.AttlistDecl);
                break;
              case "N":
                current = p.getMatch(g.NotationDecl);
                break;
              case "-":
                current = p.getMatch(g.Comment);
                break;
            }
          } else if (p.char() === "<" && p.char(1) === "?") {
            current = parsePI(p, errorHandler);
          } else if (p.char() === "%") {
            current = p.getMatch(g.PEReference);
          } else {
            return errorHandler.fatalError("Error detected in Markup declaration");
          }
          if (!current) {
            return errorHandler.fatalError("Error in internal subset at position " + p.getIndex());
          }
        }
        return errorHandler.fatalError("doctype internal subset is not well-formed, missing ]");
      }
    }
    function parseDoctypeCommentOrCData(source, start, domBuilder, errorHandler, isHTML) {
      var p = parseUtils(source, start);
      switch (isHTML ? p.char(2).toUpperCase() : p.char(2)) {
        case "-":
          var comment = p.getMatch(g.Comment);
          if (comment) {
            domBuilder.comment(comment, g.COMMENT_START.length, comment.length - g.COMMENT_START.length - g.COMMENT_END.length);
            return p.getIndex();
          } else {
            return errorHandler.fatalError("comment is not well-formed at position " + p.getIndex());
          }
        case "[":
          var cdata = p.getMatch(g.CDSect);
          if (cdata) {
            if (!isHTML && !domBuilder.currentElement) {
              return errorHandler.fatalError("CDATA outside of element");
            }
            domBuilder.startCDATA();
            domBuilder.characters(cdata, g.CDATA_START.length, cdata.length - g.CDATA_START.length - g.CDATA_END.length);
            domBuilder.endCDATA();
            return p.getIndex();
          } else {
            return errorHandler.fatalError("Invalid CDATA starting at position " + start);
          }
        case "D": {
          if (domBuilder.doc && domBuilder.doc.documentElement) {
            return errorHandler.fatalError("Doctype not allowed inside or after documentElement at position " + p.getIndex());
          }
          if (isHTML ? !p.substringStartsWithCaseInsensitive(g.DOCTYPE_DECL_START) : !p.substringStartsWith(g.DOCTYPE_DECL_START)) {
            return errorHandler.fatalError("Expected " + g.DOCTYPE_DECL_START + " at position " + p.getIndex());
          }
          p.skip(g.DOCTYPE_DECL_START.length);
          if (p.skipBlanks() < 1) {
            return errorHandler.fatalError("Expected whitespace after " + g.DOCTYPE_DECL_START + " at position " + p.getIndex());
          }
          var doctype = {
            name: void 0,
            publicId: void 0,
            systemId: void 0,
            internalSubset: void 0
          };
          doctype.name = p.getMatch(g.Name);
          if (!doctype.name)
            return errorHandler.fatalError("doctype name missing or contains unexpected characters at position " + p.getIndex());
          if (isHTML && doctype.name.toLowerCase() !== "html") {
            errorHandler.warning("Unexpected DOCTYPE in HTML document at position " + p.getIndex());
          }
          p.skipBlanks();
          if (p.substringStartsWith(g.PUBLIC) || p.substringStartsWith(g.SYSTEM)) {
            var match = g.ExternalID_match.exec(p.substringFromIndex());
            if (!match) {
              return errorHandler.fatalError("doctype external id is not well-formed at position " + p.getIndex());
            }
            if (match.groups.SystemLiteralOnly !== void 0) {
              doctype.systemId = match.groups.SystemLiteralOnly;
            } else {
              doctype.systemId = match.groups.SystemLiteral;
              doctype.publicId = match.groups.PubidLiteral;
            }
            p.skip(match[0].length);
          } else if (isHTML && p.substringStartsWithCaseInsensitive(g.SYSTEM)) {
            p.skip(g.SYSTEM.length);
            if (p.skipBlanks() < 1) {
              return errorHandler.fatalError("Expected whitespace after " + g.SYSTEM + " at position " + p.getIndex());
            }
            doctype.systemId = p.getMatch(g.ABOUT_LEGACY_COMPAT_SystemLiteral);
            if (!doctype.systemId) {
              return errorHandler.fatalError(
                "Expected " + g.ABOUT_LEGACY_COMPAT + " in single or double quotes after " + g.SYSTEM + " at position " + p.getIndex()
              );
            }
          }
          if (isHTML && doctype.systemId && !g.ABOUT_LEGACY_COMPAT_SystemLiteral.test(doctype.systemId)) {
            errorHandler.warning("Unexpected doctype.systemId in HTML document at position " + p.getIndex());
          }
          if (!isHTML) {
            p.skipBlanks();
            doctype.internalSubset = parseDoctypeInternalSubset(p, errorHandler);
          }
          p.skipBlanks();
          if (p.char() !== ">") {
            return errorHandler.fatalError("doctype not terminated with > at position " + p.getIndex());
          }
          p.skip(1);
          domBuilder.startDTD(doctype.name, doctype.publicId, doctype.systemId, doctype.internalSubset);
          domBuilder.endDTD();
          return p.getIndex();
        }
        default:
          return errorHandler.fatalError('Not well-formed XML starting with "<!" at position ' + start);
      }
    }
    function parseProcessingInstruction(source, start, domBuilder, errorHandler) {
      var match = source.substring(start).match(g.PI);
      if (!match) {
        return errorHandler.fatalError("Invalid processing instruction starting at position " + start);
      }
      if (match[1].toLowerCase() === "xml") {
        if (start > 0) {
          return errorHandler.fatalError(
            "processing instruction at position " + start + " is an xml declaration which is only at the start of the document"
          );
        }
        if (!g.XMLDecl.test(source.substring(start))) {
          return errorHandler.fatalError("xml declaration is not well-formed");
        }
      }
      domBuilder.processingInstruction(match[1], match[2]);
      return start + match[0].length;
    }
    function ElementAttributes() {
      this.attributeNames = /* @__PURE__ */ Object.create(null);
    }
    ElementAttributes.prototype = {
      setTagName: function(tagName) {
        if (!g.QName_exact.test(tagName)) {
          throw new Error("invalid tagName:" + tagName);
        }
        this.tagName = tagName;
      },
      addValue: function(qName, value, offset) {
        if (!g.QName_exact.test(qName)) {
          throw new Error("invalid attribute:" + qName);
        }
        this.attributeNames[qName] = this.length;
        this[this.length++] = { qName, value, offset };
      },
      length: 0,
      getLocalName: function(i) {
        return this[i].localName;
      },
      getLocator: function(i) {
        return this[i].locator;
      },
      getQName: function(i) {
        return this[i].qName;
      },
      getURI: function(i) {
        return this[i].uri;
      },
      getValue: function(i) {
        return this[i].value;
      }
      //	,getIndex:function(uri, localName)){
      //		if(localName){
      //
      //		}else{
      //			var qName = uri
      //		}
      //	},
      //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
      //	getType:function(uri,localName){}
      //	getType:function(i){},
    };
    exports.XMLReader = XMLReader;
    exports.parseUtils = parseUtils;
    exports.parseDoctypeCommentOrCData = parseDoctypeCommentOrCData;
  }
});

// node_modules/@xmldom/xmldom/lib/dom-parser.js
var require_dom_parser = __commonJS({
  "node_modules/@xmldom/xmldom/lib/dom-parser.js"(exports) {
    "use strict";
    var conventions = require_conventions();
    var dom = require_dom();
    var errors = require_errors();
    var entities = require_entities();
    var sax = require_sax();
    var DOMImplementation = dom.DOMImplementation;
    var hasDefaultHTMLNamespace = conventions.hasDefaultHTMLNamespace;
    var isHTMLMimeType = conventions.isHTMLMimeType;
    var isValidMimeType = conventions.isValidMimeType;
    var MIME_TYPE = conventions.MIME_TYPE;
    var NAMESPACE = conventions.NAMESPACE;
    var ParseError = errors.ParseError;
    var XMLReader = sax.XMLReader;
    function normalizeLineEndings(input) {
      return input.replace(/\r[\n\u0085]/g, "\n").replace(/[\r\u0085\u2028\u2029]/g, "\n");
    }
    function DOMParser4(options) {
      options = options || {};
      if (options.locator === void 0) {
        options.locator = true;
      }
      this.assign = options.assign || conventions.assign;
      this.domHandler = options.domHandler || DOMHandler;
      this.onError = options.onError || options.errorHandler;
      if (options.errorHandler && typeof options.errorHandler !== "function") {
        throw new TypeError("errorHandler object is no longer supported, switch to onError!");
      } else if (options.errorHandler) {
        options.errorHandler("warning", "The `errorHandler` option has been deprecated, use `onError` instead!", this);
      }
      this.normalizeLineEndings = options.normalizeLineEndings || normalizeLineEndings;
      this.locator = !!options.locator;
      this.xmlns = this.assign(/* @__PURE__ */ Object.create(null), options.xmlns);
    }
    DOMParser4.prototype.parseFromString = function(source, mimeType) {
      if (!isValidMimeType(mimeType)) {
        throw new TypeError('DOMParser.parseFromString: the provided mimeType "' + mimeType + '" is not valid.');
      }
      var defaultNSMap = this.assign(/* @__PURE__ */ Object.create(null), this.xmlns);
      var entityMap = entities.XML_ENTITIES;
      var defaultNamespace = defaultNSMap[""] || null;
      if (hasDefaultHTMLNamespace(mimeType)) {
        entityMap = entities.HTML_ENTITIES;
        defaultNamespace = NAMESPACE.HTML;
      } else if (mimeType === MIME_TYPE.XML_SVG_IMAGE) {
        defaultNamespace = NAMESPACE.SVG;
      }
      defaultNSMap[""] = defaultNamespace;
      defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
      var domBuilder = new this.domHandler({
        mimeType,
        defaultNamespace,
        onError: this.onError
      });
      var locator = this.locator ? {} : void 0;
      if (this.locator) {
        domBuilder.setDocumentLocator(locator);
      }
      var sax2 = new XMLReader();
      sax2.errorHandler = domBuilder;
      sax2.domBuilder = domBuilder;
      var isXml = !conventions.isHTMLMimeType(mimeType);
      if (isXml && typeof source !== "string") {
        sax2.errorHandler.fatalError("source is not a string");
      }
      sax2.parse(this.normalizeLineEndings(String(source)), defaultNSMap, entityMap);
      if (!domBuilder.doc.documentElement) {
        sax2.errorHandler.fatalError("missing root element");
      }
      return domBuilder.doc;
    };
    function DOMHandler(options) {
      var opt = options || {};
      this.mimeType = opt.mimeType || MIME_TYPE.XML_APPLICATION;
      this.defaultNamespace = opt.defaultNamespace || null;
      this.cdata = false;
      this.currentElement = void 0;
      this.doc = void 0;
      this.locator = void 0;
      this.onError = opt.onError;
    }
    function position(locator, node) {
      node.lineNumber = locator.lineNumber;
      node.columnNumber = locator.columnNumber;
    }
    DOMHandler.prototype = {
      /**
       * Either creates an XML or an HTML document and stores it under `this.doc`.
       * If it is an XML document, `this.defaultNamespace` is used to create it,
       * and it will not contain any `childNodes`.
       * If it is an HTML document, it will be created without any `childNodes`.
       *
       * @see http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
       */
      startDocument: function() {
        var impl = new DOMImplementation();
        this.doc = isHTMLMimeType(this.mimeType) ? impl.createHTMLDocument(false) : impl.createDocument(this.defaultNamespace, "");
      },
      startElement: function(namespaceURI, localName, qName, attrs) {
        var doc = this.doc;
        var el = doc.createElementNS(namespaceURI, qName || localName);
        var len = attrs.length;
        appendElement(this, el);
        this.currentElement = el;
        this.locator && position(this.locator, el);
        for (var i = 0; i < len; i++) {
          var namespaceURI = attrs.getURI(i);
          var value = attrs.getValue(i);
          var qName = attrs.getQName(i);
          var attr = doc.createAttributeNS(namespaceURI, qName);
          this.locator && position(attrs.getLocator(i), attr);
          attr.value = attr.nodeValue = value;
          el.setAttributeNode(attr);
        }
      },
      endElement: function(namespaceURI, localName, qName) {
        this.currentElement = this.currentElement.parentNode;
      },
      startPrefixMapping: function(prefix, uri) {
      },
      endPrefixMapping: function(prefix) {
      },
      processingInstruction: function(target, data) {
        var ins = this.doc.createProcessingInstruction(target, data);
        this.locator && position(this.locator, ins);
        appendElement(this, ins);
      },
      ignorableWhitespace: function(ch, start, length) {
      },
      characters: function(chars, start, length) {
        chars = _toString.apply(this, arguments);
        if (chars) {
          if (this.cdata) {
            var charNode = this.doc.createCDATASection(chars);
          } else {
            var charNode = this.doc.createTextNode(chars);
          }
          if (this.currentElement) {
            this.currentElement.appendChild(charNode);
          } else if (/^\s*$/.test(chars)) {
            this.doc.appendChild(charNode);
          }
          this.locator && position(this.locator, charNode);
        }
      },
      skippedEntity: function(name) {
      },
      endDocument: function() {
        this.doc.normalize();
      },
      /**
       * Stores the locator to be able to set the `columnNumber` and `lineNumber`
       * on the created DOM nodes.
       *
       * @param {Locator} locator
       */
      setDocumentLocator: function(locator) {
        if (locator) {
          locator.lineNumber = 0;
        }
        this.locator = locator;
      },
      //LexicalHandler
      comment: function(chars, start, length) {
        chars = _toString.apply(this, arguments);
        var comm = this.doc.createComment(chars);
        this.locator && position(this.locator, comm);
        appendElement(this, comm);
      },
      startCDATA: function() {
        this.cdata = true;
      },
      endCDATA: function() {
        this.cdata = false;
      },
      startDTD: function(name, publicId, systemId, internalSubset) {
        var impl = this.doc.implementation;
        if (impl && impl.createDocumentType) {
          var dt = impl.createDocumentType(name, publicId, systemId, internalSubset);
          this.locator && position(this.locator, dt);
          appendElement(this, dt);
          this.doc.doctype = dt;
        }
      },
      reportError: function(level, message) {
        if (typeof this.onError === "function") {
          try {
            this.onError(level, message, this);
          } catch (e) {
            throw new ParseError("Reporting " + level + ' "' + message + '" caused ' + e, this.locator);
          }
        } else {
          console.error("[xmldom " + level + "]	" + message, _locator(this.locator));
        }
      },
      /**
       * @see http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
       */
      warning: function(message) {
        this.reportError("warning", message);
      },
      error: function(message) {
        this.reportError("error", message);
      },
      /**
       * This function reports a fatal error and throws a ParseError.
       *
       * @param {string} message
       * - The message to be used for reporting and throwing the error.
       * @param {Error} [cause]
       * The error that caused this fatal error, preserved as the thrown `ParseError`'s `cause`.
       * @returns {never}
       * This function always throws an error and never returns a value.
       * @throws {ParseError}
       * Always throws a ParseError with the provided message.
       */
      fatalError: function(message, cause) {
        this.reportError("fatalError", message);
        throw new ParseError(message, this.locator, cause);
      }
    };
    function _locator(l) {
      if (l) {
        return "\n@#[line:" + l.lineNumber + ",col:" + l.columnNumber + "]";
      }
    }
    function _toString(chars, start, length) {
      if (typeof chars == "string") {
        return chars.substr(start, length);
      } else {
        if (chars.length >= start + length || start) {
          return new java.lang.String(chars, start, length) + "";
        }
        return chars;
      }
    }
    "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(
      /\w+/g,
      function(key) {
        DOMHandler.prototype[key] = function() {
          return null;
        };
      }
    );
    function appendElement(handler, node) {
      if (!handler.currentElement) {
        handler.doc.appendChild(node);
      } else {
        handler.currentElement.appendChild(node);
      }
    }
    function onErrorStopParsing(level) {
      if (level === "error") throw "onErrorStopParsing";
    }
    function onWarningStopParsing() {
      throw "onWarningStopParsing";
    }
    exports.__DOMHandler = DOMHandler;
    exports.DOMParser = DOMParser4;
    exports.normalizeLineEndings = normalizeLineEndings;
    exports.onErrorStopParsing = onErrorStopParsing;
    exports.onWarningStopParsing = onWarningStopParsing;
  }
});

// node_modules/@xmldom/xmldom/lib/index.js
var require_lib = __commonJS({
  "node_modules/@xmldom/xmldom/lib/index.js"(exports) {
    "use strict";
    var conventions = require_conventions();
    exports.assign = conventions.assign;
    exports.hasDefaultHTMLNamespace = conventions.hasDefaultHTMLNamespace;
    exports.isHTMLMimeType = conventions.isHTMLMimeType;
    exports.isValidMimeType = conventions.isValidMimeType;
    exports.MIME_TYPE = conventions.MIME_TYPE;
    exports.NAMESPACE = conventions.NAMESPACE;
    var errors = require_errors();
    exports.DOMException = errors.DOMException;
    exports.DOMExceptionName = errors.DOMExceptionName;
    exports.ExceptionCode = errors.ExceptionCode;
    exports.ParseError = errors.ParseError;
    var dom = require_dom();
    exports.Attr = dom.Attr;
    exports.CDATASection = dom.CDATASection;
    exports.CharacterData = dom.CharacterData;
    exports.Comment = dom.Comment;
    exports.Document = dom.Document;
    exports.DocumentFragment = dom.DocumentFragment;
    exports.DocumentType = dom.DocumentType;
    exports.DOMImplementation = dom.DOMImplementation;
    exports.Element = dom.Element;
    exports.Entity = dom.Entity;
    exports.EntityReference = dom.EntityReference;
    exports.LiveNodeList = dom.LiveNodeList;
    exports.NamedNodeMap = dom.NamedNodeMap;
    exports.Node = dom.Node;
    exports.NodeList = dom.NodeList;
    exports.Notation = dom.Notation;
    exports.ProcessingInstruction = dom.ProcessingInstruction;
    exports.Text = dom.Text;
    exports.XMLSerializer = dom.XMLSerializer;
    var domParser = require_dom_parser();
    exports.DOMParser = domParser.DOMParser;
    exports.normalizeLineEndings = domParser.normalizeLineEndings;
    exports.onErrorStopParsing = domParser.onErrorStopParsing;
    exports.onWarningStopParsing = domParser.onWarningStopParsing;
  }
});

// src/components/grid.js
import { Bag as Bag3 } from "@gramlot/gramlot";

// node_modules/@genrojs/builders/src/pointers.js
function pointerTransform(value) {
  if (typeof value !== "string" || !["^", "="].includes(value[0]) || value.startsWith("==")) return null;
  const index = value.indexOf(":");
  if (index < 0) return null;
  const expression = value[index + 1] === "=";
  return { pointer: value.slice(0, index), expression, body: value.slice(index + (expression ? 2 : 1)) };
}
var SLOT = /^\{(\??[A-Za-z_][A-Za-z0-9_]*|\?)?\}/;
function pointerTemplate(body, read) {
  let result = "", blocked = false;
  for (let i = 0; i < body.length; ) {
    if (body[i] !== "{" && body[i] !== "}") {
      result += body[i++];
      continue;
    }
    const match = body.slice(i).match(SLOT);
    if (!match) throw new SyntaxError("Invalid pointer template placeholder");
    const slot = match[1] ?? "";
    const optional = slot.startsWith("?");
    const value = read(optional ? slot.slice(1) : slot);
    if (value == null || value === "" && !optional) blocked = true;
    else result += String(value);
    i += match[0].length;
  }
  return blocked ? null : result;
}
function pointerExpression(body) {
  const slots = [], identifiers = /* @__PURE__ */ new Set();
  let text = "", operand = true;
  for (let i = 0; i < body.length; ) {
    const start = i, c = body[i];
    if (c === '"' || c === "'" || c === "`") {
      i++;
      while (i < body.length) {
        if (body[i] === "\\") {
          i += 2;
          continue;
        }
        if (body[i++] === c) break;
      }
      text += body.slice(start, i);
      operand = false;
      continue;
    }
    if (body.startsWith("//", i)) {
      i = body.indexOf("\n", i);
      if (i < 0) i = body.length;
      text += body.slice(start, i);
      continue;
    }
    if (body.startsWith("/*", i)) {
      const end = body.indexOf("*/", i + 2);
      i = end < 0 ? body.length : end + 2;
      text += body.slice(start, i);
      continue;
    }
    if (c === "/" && operand) {
      let bracket = false;
      i++;
      while (i < body.length) {
        const current = body[i++];
        if (current === "\\") {
          i++;
          continue;
        }
        if (current === "[") bracket = true;
        else if (current === "]") bracket = false;
        else if (current === "/" && !bracket) break;
      }
      while (/[a-z]/i.test(body[i] ?? "") && i < body.length) i++;
      text += body.slice(start, i);
      operand = false;
      continue;
    }
    const slot = c === "{" ? body.slice(i).match(SLOT) : null;
    if (slot) {
      const name = slot[1] ?? "";
      if (name.startsWith("?")) throw new SyntaxError("Optional slots are supported in pointer templates only");
      text += `_pointerValues[${slots.length}]`;
      slots.push(name);
      i += slot[0].length;
      operand = false;
      continue;
    }
    const word = body.slice(i).match(/^[A-Za-z_$][\w$]*/);
    if (word) {
      identifiers.add(word[0]);
      text += word[0];
      i += word[0].length;
      operand = ["return", "typeof", "void", "delete", "new", "in", "instanceof", "yield", "await"].includes(word[0]);
      continue;
    }
    text += c;
    i++;
    if (!/\s/.test(c)) operand = /[([{,:;=!?&|+*%~<>\/-]/.test(c);
  }
  return { text, slots, identifiers };
}
function resolvePointerItems(items, current, evaluate = () => null) {
  const values = /* @__PURE__ */ new Map(), active = [];
  const resolve = (name) => {
    if (values.has(name)) return values.get(name);
    if (!items.has(name)) throw new Error(`Referenced Source attribute '${name}' does not exist`);
    if (active.includes(name)) throw new Error(`Cyclic attribute dependency: ${[...active, name].join(" -> ")}`);
    active.push(name);
    try {
      const raw = items.get(name);
      const transform = typeof name === "string" ? pointerTransform(raw) : null;
      let result = current.get(name);
      if (transform) {
        const read = (key) => key ? resolve(key) : current.get(name);
        if (transform.expression) {
          const expression = pointerExpression(transform.body);
          result = evaluate(name, raw, expression, expression.slots.map(read));
        } else {
          result = pointerTemplate(transform.body, read);
          if (current.get(name) == null) result = null;
        }
      }
      values.set(name, result);
      return result;
    } finally {
      active.pop();
    }
  };
  return new Map([...items.keys()].map((name) => [name, resolve(name)]));
}
function pointerDependencies(node, raw) {
  const items = new Map([...Object.entries(node.getAttr()), ...node.fixedAttrItems()]);
  const seen = /* @__PURE__ */ new Set(), active = [];
  const visit = (value) => {
    const transform = pointerTransform(value);
    if (!transform) return;
    const names = [];
    if (transform.expression) names.push(...pointerExpression(transform.body).slots);
    else pointerTemplate(transform.body, (key) => {
      names.push(key);
      return "";
    });
    for (const name of names.filter(Boolean)) {
      if (!items.has(name)) throw new Error(`Referenced Source attribute '${name}' does not exist`);
      if (active.includes(name)) throw new Error(`Cyclic attribute dependency: ${[...active, name].join(" -> ")}`);
      if (seen.has(name)) continue;
      active.push(name);
      visit(items.get(name));
      active.pop();
      seen.add(name);
    }
  };
  visit(raw);
  return seen;
}

// node_modules/decimal.js/decimal.mjs
/*!
 *  decimal.js v10.6.0
 *  An arbitrary-precision Decimal type for JavaScript.
 *  https://github.com/MikeMcl/decimal.js
 *  Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
 *  MIT Licence
 */
var EXP_LIMIT = 9e15;
var MAX_DIGITS = 1e9;
var NUMERALS = "0123456789abcdef";
var LN10 = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";
var PI = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789";
var DEFAULTS = {
  // These values must be integers within the stated ranges (inclusive).
  // Most of these values can be changed at run-time using the `Decimal.config` method.
  // The maximum number of significant digits of the result of a calculation or base conversion.
  // E.g. `Decimal.config({ precision: 20 });`
  precision: 20,
  // 1 to MAX_DIGITS
  // The rounding mode used when rounding to `precision`.
  //
  // ROUND_UP         0 Away from zero.
  // ROUND_DOWN       1 Towards zero.
  // ROUND_CEIL       2 Towards +Infinity.
  // ROUND_FLOOR      3 Towards -Infinity.
  // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
  // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
  // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
  // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
  // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
  //
  // E.g.
  // `Decimal.rounding = 4;`
  // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
  rounding: 4,
  // 0 to 8
  // The modulo mode used when calculating the modulus: a mod n.
  // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
  // The remainder (r) is calculated as: r = a - n * q.
  //
  // UP         0 The remainder is positive if the dividend is negative, else is negative.
  // DOWN       1 The remainder has the same sign as the dividend (JavaScript %).
  // FLOOR      3 The remainder has the same sign as the divisor (Python %).
  // HALF_EVEN  6 The IEEE 754 remainder function.
  // EUCLID     9 Euclidian division. q = sign(n) * floor(a / abs(n)). Always positive.
  //
  // Truncated division (1), floored division (3), the IEEE 754 remainder (6), and Euclidian
  // division (9) are commonly used for the modulus operation. The other rounding modes can also
  // be used, but they may not give useful results.
  modulo: 1,
  // 0 to 9
  // The exponent value at and beneath which `toString` returns exponential notation.
  // JavaScript numbers: -7
  toExpNeg: -7,
  // 0 to -EXP_LIMIT
  // The exponent value at and above which `toString` returns exponential notation.
  // JavaScript numbers: 21
  toExpPos: 21,
  // 0 to EXP_LIMIT
  // The minimum exponent value, beneath which underflow to zero occurs.
  // JavaScript numbers: -324  (5e-324)
  minE: -EXP_LIMIT,
  // -1 to -EXP_LIMIT
  // The maximum exponent value, above which overflow to Infinity occurs.
  // JavaScript numbers: 308  (1.7976931348623157e+308)
  maxE: EXP_LIMIT,
  // 1 to EXP_LIMIT
  // Whether to use cryptographically-secure random number generation, if available.
  crypto: false
  // true/false
};
var inexact;
var quadrant;
var external = true;
var decimalError = "[DecimalError] ";
var invalidArgument = decimalError + "Invalid argument: ";
var precisionLimitExceeded = decimalError + "Precision limit exceeded";
var cryptoUnavailable = decimalError + "crypto unavailable";
var tag = "[object Decimal]";
var mathfloor = Math.floor;
var mathpow = Math.pow;
var isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
var isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
var isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
var isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
var BASE = 1e7;
var LOG_BASE = 7;
var MAX_SAFE_INTEGER = 9007199254740991;
var LN10_PRECISION = LN10.length - 1;
var PI_PRECISION = PI.length - 1;
var P = { toStringTag: tag };
P.absoluteValue = P.abs = function() {
  var x = new this.constructor(this);
  if (x.s < 0) x.s = 1;
  return finalise(x);
};
P.ceil = function() {
  return finalise(new this.constructor(this), this.e + 1, 2);
};
P.clampedTo = P.clamp = function(min2, max2) {
  var k, x = this, Ctor = x.constructor;
  min2 = new Ctor(min2);
  max2 = new Ctor(max2);
  if (!min2.s || !max2.s) return new Ctor(NaN);
  if (min2.gt(max2)) throw Error(invalidArgument + max2);
  k = x.cmp(min2);
  return k < 0 ? min2 : x.cmp(max2) > 0 ? max2 : new Ctor(x);
};
P.comparedTo = P.cmp = function(y) {
  var i, j, xdL, ydL, x = this, xd = x.d, yd = (y = new x.constructor(y)).d, xs = x.s, ys = y.s;
  if (!xd || !yd) {
    return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
  }
  if (!xd[0] || !yd[0]) return xd[0] ? xs : yd[0] ? -ys : 0;
  if (xs !== ys) return xs;
  if (x.e !== y.e) return x.e > y.e ^ xs < 0 ? 1 : -1;
  xdL = xd.length;
  ydL = yd.length;
  for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
    if (xd[i] !== yd[i]) return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
  }
  return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
};
P.cosine = P.cos = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.d) return new Ctor(NaN);
  if (!x.d[0]) return new Ctor(1);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;
  x = cosine(Ctor, toLessThanHalfPi(Ctor, x));
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
};
P.cubeRoot = P.cbrt = function() {
  var e, m, n, r, rep, s, sd, t, t3, t3plusx, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero()) return new Ctor(x);
  external = false;
  s = x.s * mathpow(x.s * x, 1 / 3);
  if (!s || Math.abs(s) == 1 / 0) {
    n = digitsToString(x.d);
    e = x.e;
    if (s = (e - n.length + 1) % 3) n += s == 1 || s == -2 ? "0" : "00";
    s = mathpow(n, 1 / 3);
    e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));
    if (s == 1 / 0) {
      n = "5e" + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf("e") + 1) + e;
    }
    r = new Ctor(n);
    r.s = x.s;
  } else {
    r = new Ctor(s.toString());
  }
  sd = (e = Ctor.precision) + 3;
  for (; ; ) {
    t = r;
    t3 = t.times(t).times(t);
    t3plusx = t3.plus(x);
    r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);
    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1);
      if (n == "9999" || !rep && n == "4999") {
        if (!rep) {
          finalise(t, e + 1, 0);
          if (t.times(t).times(t).eq(x)) {
            r = t;
            break;
          }
        }
        sd += 4;
        rep = 1;
      } else {
        if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
          finalise(r, e + 1, 1);
          m = !r.times(r).times(r).eq(x);
        }
        break;
      }
    }
  }
  external = true;
  return finalise(r, e, Ctor.rounding, m);
};
P.decimalPlaces = P.dp = function() {
  var w, d = this.d, n = NaN;
  if (d) {
    w = d.length - 1;
    n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;
    w = d[w];
    if (w) for (; w % 10 == 0; w /= 10) n--;
    if (n < 0) n = 0;
  }
  return n;
};
P.dividedBy = P.div = function(y) {
  return divide(this, new this.constructor(y));
};
P.dividedToIntegerBy = P.divToInt = function(y) {
  var x = this, Ctor = x.constructor;
  return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
};
P.equals = P.eq = function(y) {
  return this.cmp(y) === 0;
};
P.floor = function() {
  return finalise(new this.constructor(this), this.e + 1, 3);
};
P.greaterThan = P.gt = function(y) {
  return this.cmp(y) > 0;
};
P.greaterThanOrEqualTo = P.gte = function(y) {
  var k = this.cmp(y);
  return k == 1 || k === 0;
};
P.hyperbolicCosine = P.cosh = function() {
  var k, n, pr, rm, len, x = this, Ctor = x.constructor, one = new Ctor(1);
  if (!x.isFinite()) return new Ctor(x.s ? 1 / 0 : NaN);
  if (x.isZero()) return one;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;
  if (len < 32) {
    k = Math.ceil(len / 3);
    n = (1 / tinyPow(4, k)).toString();
  } else {
    k = 16;
    n = "2.3283064365386962890625e-10";
  }
  x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);
  var cosh2_x, i = k, d8 = new Ctor(8);
  for (; i--; ) {
    cosh2_x = x.times(x);
    x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
  }
  return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
};
P.hyperbolicSine = P.sinh = function() {
  var k, pr, rm, len, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;
  if (len < 3) {
    x = taylorSeries(Ctor, 2, x, x, true);
  } else {
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;
    x = x.times(1 / tinyPow(5, k));
    x = taylorSeries(Ctor, 2, x, x, true);
    var sinh2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
    for (; k--; ) {
      sinh2_x = x.times(x);
      x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
    }
  }
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(x, pr, rm, true);
};
P.hyperbolicTangent = P.tanh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(x.s);
  if (x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 7;
  Ctor.rounding = 1;
  return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
};
P.inverseCosine = P.acos = function() {
  var x = this, Ctor = x.constructor, k = x.abs().cmp(1), pr = Ctor.precision, rm = Ctor.rounding;
  if (k !== -1) {
    return k === 0 ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0) : new Ctor(NaN);
  }
  if (x.isZero()) return getPi(Ctor, pr + 4, rm).times(0.5);
  Ctor.precision = pr + 6;
  Ctor.rounding = 1;
  x = new Ctor(1).minus(x).div(x.plus(1)).sqrt().atan();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(2);
};
P.inverseHyperbolicCosine = P.acosh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (x.lte(1)) return new Ctor(x.eq(1) ? 0 : NaN);
  if (!x.isFinite()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
  Ctor.rounding = 1;
  external = false;
  x = x.times(x).minus(1).sqrt().plus(x);
  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.ln();
};
P.inverseHyperbolicSine = P.asinh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
  Ctor.rounding = 1;
  external = false;
  x = x.times(x).plus(1).sqrt().plus(x);
  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.ln();
};
P.inverseHyperbolicTangent = P.atanh = function() {
  var pr, rm, wpr, xsd, x = this, Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(NaN);
  if (x.e >= 0) return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  xsd = x.sd();
  if (Math.max(xsd, pr) < 2 * -x.e - 1) return finalise(new Ctor(x), pr, rm, true);
  Ctor.precision = wpr = xsd - x.e;
  x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);
  Ctor.precision = pr + 4;
  Ctor.rounding = 1;
  x = x.ln();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(0.5);
};
P.inverseSine = P.asin = function() {
  var halfPi, k, pr, rm, x = this, Ctor = x.constructor;
  if (x.isZero()) return new Ctor(x);
  k = x.abs().cmp(1);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (k !== -1) {
    if (k === 0) {
      halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
      halfPi.s = x.s;
      return halfPi;
    }
    return new Ctor(NaN);
  }
  Ctor.precision = pr + 6;
  Ctor.rounding = 1;
  x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(2);
};
P.inverseTangent = P.atan = function() {
  var i, j, k, n, px2, t, r, wpr, x2, x = this, Ctor = x.constructor, pr = Ctor.precision, rm = Ctor.rounding;
  if (!x.isFinite()) {
    if (!x.s) return new Ctor(NaN);
    if (pr + 4 <= PI_PRECISION) {
      r = getPi(Ctor, pr + 4, rm).times(0.5);
      r.s = x.s;
      return r;
    }
  } else if (x.isZero()) {
    return new Ctor(x);
  } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
    r = getPi(Ctor, pr + 4, rm).times(0.25);
    r.s = x.s;
    return r;
  }
  Ctor.precision = wpr = pr + 10;
  Ctor.rounding = 1;
  k = Math.min(28, wpr / LOG_BASE + 2 | 0);
  for (i = k; i; --i) x = x.div(x.times(x).plus(1).sqrt().plus(1));
  external = false;
  j = Math.ceil(wpr / LOG_BASE);
  n = 1;
  x2 = x.times(x);
  r = new Ctor(x);
  px2 = x;
  for (; i !== -1; ) {
    px2 = px2.times(x2);
    t = r.minus(px2.div(n += 2));
    px2 = px2.times(x2);
    r = t.plus(px2.div(n += 2));
    if (r.d[j] !== void 0) for (i = j; r.d[i] === t.d[i] && i--; ) ;
  }
  if (k) r = r.times(2 << k - 1);
  external = true;
  return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
};
P.isFinite = function() {
  return !!this.d;
};
P.isInteger = P.isInt = function() {
  return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
};
P.isNaN = function() {
  return !this.s;
};
P.isNegative = P.isNeg = function() {
  return this.s < 0;
};
P.isPositive = P.isPos = function() {
  return this.s > 0;
};
P.isZero = function() {
  return !!this.d && this.d[0] === 0;
};
P.lessThan = P.lt = function(y) {
  return this.cmp(y) < 0;
};
P.lessThanOrEqualTo = P.lte = function(y) {
  return this.cmp(y) < 1;
};
P.logarithm = P.log = function(base) {
  var isBase10, d, denominator, k, inf, num, sd, r, arg = this, Ctor = arg.constructor, pr = Ctor.precision, rm = Ctor.rounding, guard = 5;
  if (base == null) {
    base = new Ctor(10);
    isBase10 = true;
  } else {
    base = new Ctor(base);
    d = base.d;
    if (base.s < 0 || !d || !d[0] || base.eq(1)) return new Ctor(NaN);
    isBase10 = base.eq(10);
  }
  d = arg.d;
  if (arg.s < 0 || !d || !d[0] || arg.eq(1)) {
    return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
  }
  if (isBase10) {
    if (d.length > 1) {
      inf = true;
    } else {
      for (k = d[0]; k % 10 === 0; ) k /= 10;
      inf = k !== 1;
    }
  }
  external = false;
  sd = pr + guard;
  num = naturalLogarithm(arg, sd);
  denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
  r = divide(num, denominator, sd, 1);
  if (checkRoundingDigits(r.d, k = pr, rm)) {
    do {
      sd += 10;
      num = naturalLogarithm(arg, sd);
      denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
      r = divide(num, denominator, sd, 1);
      if (!inf) {
        if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 1e14) {
          r = finalise(r, pr + 1, 0);
        }
        break;
      }
    } while (checkRoundingDigits(r.d, k += 10, rm));
  }
  external = true;
  return finalise(r, pr, rm);
};
P.minus = P.sub = function(y) {
  var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.d) {
    if (!x.s || !y.s) y = new Ctor(NaN);
    else if (x.d) y.s = -y.s;
    else y = new Ctor(y.d || x.s !== y.s ? x : NaN);
    return y;
  }
  if (x.s != y.s) {
    y.s = -y.s;
    return x.plus(y);
  }
  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (!xd[0] || !yd[0]) {
    if (yd[0]) y.s = -y.s;
    else if (xd[0]) y = new Ctor(x);
    else return new Ctor(rm === 3 ? -0 : 0);
    return external ? finalise(y, pr, rm) : y;
  }
  e = mathfloor(y.e / LOG_BASE);
  xe = mathfloor(x.e / LOG_BASE);
  xd = xd.slice();
  k = xe - e;
  if (k) {
    xLTy = k < 0;
    if (xLTy) {
      d = xd;
      k = -k;
      len = yd.length;
    } else {
      d = yd;
      e = xe;
      len = xd.length;
    }
    i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;
    if (k > i) {
      k = i;
      d.length = 1;
    }
    d.reverse();
    for (i = k; i--; ) d.push(0);
    d.reverse();
  } else {
    i = xd.length;
    len = yd.length;
    xLTy = i < len;
    if (xLTy) len = i;
    for (i = 0; i < len; i++) {
      if (xd[i] != yd[i]) {
        xLTy = xd[i] < yd[i];
        break;
      }
    }
    k = 0;
  }
  if (xLTy) {
    d = xd;
    xd = yd;
    yd = d;
    y.s = -y.s;
  }
  len = xd.length;
  for (i = yd.length - len; i > 0; --i) xd[len++] = 0;
  for (i = yd.length; i > k; ) {
    if (xd[--i] < yd[i]) {
      for (j = i; j && xd[--j] === 0; ) xd[j] = BASE - 1;
      --xd[j];
      xd[i] += BASE;
    }
    xd[i] -= yd[i];
  }
  for (; xd[--len] === 0; ) xd.pop();
  for (; xd[0] === 0; xd.shift()) --e;
  if (!xd[0]) return new Ctor(rm === 3 ? -0 : 0);
  y.d = xd;
  y.e = getBase10Exponent(xd, e);
  return external ? finalise(y, pr, rm) : y;
};
P.modulo = P.mod = function(y) {
  var q, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.s || y.d && !y.d[0]) return new Ctor(NaN);
  if (!y.d || x.d && !x.d[0]) {
    return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
  }
  external = false;
  if (Ctor.modulo == 9) {
    q = divide(x, y.abs(), 0, 3, 1);
    q.s *= y.s;
  } else {
    q = divide(x, y, 0, Ctor.modulo, 1);
  }
  q = q.times(y);
  external = true;
  return x.minus(q);
};
P.naturalExponential = P.exp = function() {
  return naturalExponential(this);
};
P.naturalLogarithm = P.ln = function() {
  return naturalLogarithm(this);
};
P.negated = P.neg = function() {
  var x = new this.constructor(this);
  x.s = -x.s;
  return finalise(x);
};
P.plus = P.add = function(y) {
  var carry, d, e, i, k, len, pr, rm, xd, yd, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.d) {
    if (!x.s || !y.s) y = new Ctor(NaN);
    else if (!x.d) y = new Ctor(y.d || x.s === y.s ? x : NaN);
    return y;
  }
  if (x.s != y.s) {
    y.s = -y.s;
    return x.minus(y);
  }
  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (!xd[0] || !yd[0]) {
    if (!yd[0]) y = new Ctor(x);
    return external ? finalise(y, pr, rm) : y;
  }
  k = mathfloor(x.e / LOG_BASE);
  e = mathfloor(y.e / LOG_BASE);
  xd = xd.slice();
  i = k - e;
  if (i) {
    if (i < 0) {
      d = xd;
      i = -i;
      len = yd.length;
    } else {
      d = yd;
      e = k;
      len = xd.length;
    }
    k = Math.ceil(pr / LOG_BASE);
    len = k > len ? k + 1 : len + 1;
    if (i > len) {
      i = len;
      d.length = 1;
    }
    d.reverse();
    for (; i--; ) d.push(0);
    d.reverse();
  }
  len = xd.length;
  i = yd.length;
  if (len - i < 0) {
    i = len;
    d = yd;
    yd = xd;
    xd = d;
  }
  for (carry = 0; i; ) {
    carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
    xd[i] %= BASE;
  }
  if (carry) {
    xd.unshift(carry);
    ++e;
  }
  for (len = xd.length; xd[--len] == 0; ) xd.pop();
  y.d = xd;
  y.e = getBase10Exponent(xd, e);
  return external ? finalise(y, pr, rm) : y;
};
P.precision = P.sd = function(z) {
  var k, x = this;
  if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);
  if (x.d) {
    k = getPrecision(x.d);
    if (z && x.e + 1 > k) k = x.e + 1;
  } else {
    k = NaN;
  }
  return k;
};
P.round = function() {
  var x = this, Ctor = x.constructor;
  return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
};
P.sine = P.sin = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(NaN);
  if (x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;
  x = sine(Ctor, toLessThanHalfPi(Ctor, x));
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
};
P.squareRoot = P.sqrt = function() {
  var m, n, sd, r, rep, t, x = this, d = x.d, e = x.e, s = x.s, Ctor = x.constructor;
  if (s !== 1 || !d || !d[0]) {
    return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
  }
  external = false;
  s = Math.sqrt(+x);
  if (s == 0 || s == 1 / 0) {
    n = digitsToString(d);
    if ((n.length + e) % 2 == 0) n += "0";
    s = Math.sqrt(n);
    e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);
    if (s == 1 / 0) {
      n = "5e" + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf("e") + 1) + e;
    }
    r = new Ctor(n);
  } else {
    r = new Ctor(s.toString());
  }
  sd = (e = Ctor.precision) + 3;
  for (; ; ) {
    t = r;
    r = t.plus(divide(x, t, sd + 2, 1)).times(0.5);
    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1);
      if (n == "9999" || !rep && n == "4999") {
        if (!rep) {
          finalise(t, e + 1, 0);
          if (t.times(t).eq(x)) {
            r = t;
            break;
          }
        }
        sd += 4;
        rep = 1;
      } else {
        if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
          finalise(r, e + 1, 1);
          m = !r.times(r).eq(x);
        }
        break;
      }
    }
  }
  external = true;
  return finalise(r, e, Ctor.rounding, m);
};
P.tangent = P.tan = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(NaN);
  if (x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 10;
  Ctor.rounding = 1;
  x = x.sin();
  x.s = 1;
  x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
};
P.times = P.mul = function(y) {
  var carry, e, i, k, r, rL, t, xdL, ydL, x = this, Ctor = x.constructor, xd = x.d, yd = (y = new Ctor(y)).d;
  y.s *= x.s;
  if (!xd || !xd[0] || !yd || !yd[0]) {
    return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd ? NaN : !xd || !yd ? y.s / 0 : y.s * 0);
  }
  e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
  xdL = xd.length;
  ydL = yd.length;
  if (xdL < ydL) {
    r = xd;
    xd = yd;
    yd = r;
    rL = xdL;
    xdL = ydL;
    ydL = rL;
  }
  r = [];
  rL = xdL + ydL;
  for (i = rL; i--; ) r.push(0);
  for (i = ydL; --i >= 0; ) {
    carry = 0;
    for (k = xdL + i; k > i; ) {
      t = r[k] + yd[i] * xd[k - i - 1] + carry;
      r[k--] = t % BASE | 0;
      carry = t / BASE | 0;
    }
    r[k] = (r[k] + carry) % BASE | 0;
  }
  for (; !r[--rL]; ) r.pop();
  if (carry) ++e;
  else r.shift();
  y.d = r;
  y.e = getBase10Exponent(r, e);
  return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
};
P.toBinary = function(sd, rm) {
  return toStringBinary(this, 2, sd, rm);
};
P.toDecimalPlaces = P.toDP = function(dp, rm) {
  var x = this, Ctor = x.constructor;
  x = new Ctor(x);
  if (dp === void 0) return x;
  checkInt32(dp, 0, MAX_DIGITS);
  if (rm === void 0) rm = Ctor.rounding;
  else checkInt32(rm, 0, 8);
  return finalise(x, dp + x.e + 1, rm);
};
P.toExponential = function(dp, rm) {
  var str, x = this, Ctor = x.constructor;
  if (dp === void 0) {
    str = finiteToString(x, true);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
    x = finalise(new Ctor(x), dp + 1, rm);
    str = finiteToString(x, true, dp + 1);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toFixed = function(dp, rm) {
  var str, y, x = this, Ctor = x.constructor;
  if (dp === void 0) {
    str = finiteToString(x);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
    y = finalise(new Ctor(x), dp + x.e + 1, rm);
    str = finiteToString(y, false, dp + y.e + 1);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toFraction = function(maxD) {
  var d, d0, d1, d2, e, k, n, n0, n1, pr, q, r, x = this, xd = x.d, Ctor = x.constructor;
  if (!xd) return new Ctor(x);
  n1 = d0 = new Ctor(1);
  d1 = n0 = new Ctor(0);
  d = new Ctor(d1);
  e = d.e = getPrecision(xd) - x.e - 1;
  k = e % LOG_BASE;
  d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);
  if (maxD == null) {
    maxD = e > 0 ? d : n1;
  } else {
    n = new Ctor(maxD);
    if (!n.isInt() || n.lt(n1)) throw Error(invalidArgument + n);
    maxD = n.gt(d) ? e > 0 ? d : n1 : n;
  }
  external = false;
  n = new Ctor(digitsToString(xd));
  pr = Ctor.precision;
  Ctor.precision = e = xd.length * LOG_BASE * 2;
  for (; ; ) {
    q = divide(n, d, 0, 1, 1);
    d2 = d0.plus(q.times(d1));
    if (d2.cmp(maxD) == 1) break;
    d0 = d1;
    d1 = d2;
    d2 = n1;
    n1 = n0.plus(q.times(d2));
    n0 = d2;
    d2 = d;
    d = n.minus(q.times(d2));
    n = d2;
  }
  d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
  n0 = n0.plus(d2.times(n1));
  d0 = d0.plus(d2.times(d1));
  n0.s = n1.s = x.s;
  r = divide(n1, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];
  Ctor.precision = pr;
  external = true;
  return r;
};
P.toHexadecimal = P.toHex = function(sd, rm) {
  return toStringBinary(this, 16, sd, rm);
};
P.toNearest = function(y, rm) {
  var x = this, Ctor = x.constructor;
  x = new Ctor(x);
  if (y == null) {
    if (!x.d) return x;
    y = new Ctor(1);
    rm = Ctor.rounding;
  } else {
    y = new Ctor(y);
    if (rm === void 0) {
      rm = Ctor.rounding;
    } else {
      checkInt32(rm, 0, 8);
    }
    if (!x.d) return y.s ? x : y;
    if (!y.d) {
      if (y.s) y.s = x.s;
      return y;
    }
  }
  if (y.d[0]) {
    external = false;
    x = divide(x, y, 0, rm, 1).times(y);
    external = true;
    finalise(x);
  } else {
    y.s = x.s;
    x = y;
  }
  return x;
};
P.toNumber = function() {
  return +this;
};
P.toOctal = function(sd, rm) {
  return toStringBinary(this, 8, sd, rm);
};
P.toPower = P.pow = function(y) {
  var e, k, pr, r, rm, s, x = this, Ctor = x.constructor, yn = +(y = new Ctor(y));
  if (!x.d || !y.d || !x.d[0] || !y.d[0]) return new Ctor(mathpow(+x, yn));
  x = new Ctor(x);
  if (x.eq(1)) return x;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (y.eq(1)) return finalise(x, pr, rm);
  e = mathfloor(y.e / LOG_BASE);
  if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
    r = intPow(Ctor, x, k, pr);
    return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
  }
  s = x.s;
  if (s < 0) {
    if (e < y.d.length - 1) return new Ctor(NaN);
    if ((y.d[e] & 1) == 0) s = 1;
    if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
      x.s = s;
      return x;
    }
  }
  k = mathpow(+x, yn);
  e = k == 0 || !isFinite(k) ? mathfloor(yn * (Math.log("0." + digitsToString(x.d)) / Math.LN10 + x.e + 1)) : new Ctor(k + "").e;
  if (e > Ctor.maxE + 1 || e < Ctor.minE - 1) return new Ctor(e > 0 ? s / 0 : 0);
  external = false;
  Ctor.rounding = x.s = 1;
  k = Math.min(12, (e + "").length);
  r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);
  if (r.d) {
    r = finalise(r, pr + 5, 1);
    if (checkRoundingDigits(r.d, pr, rm)) {
      e = pr + 10;
      r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);
      if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 1e14) {
        r = finalise(r, pr + 1, 0);
      }
    }
  }
  r.s = s;
  external = true;
  Ctor.rounding = rm;
  return finalise(r, pr, rm);
};
P.toPrecision = function(sd, rm) {
  var str, x = this, Ctor = x.constructor;
  if (sd === void 0) {
    str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  } else {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
    x = finalise(new Ctor(x), sd, rm);
    str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toSignificantDigits = P.toSD = function(sd, rm) {
  var x = this, Ctor = x.constructor;
  if (sd === void 0) {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  } else {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
  }
  return finalise(new Ctor(x), sd, rm);
};
P.toString = function() {
  var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.truncated = P.trunc = function() {
  return finalise(new this.constructor(this), this.e + 1, 1);
};
P.valueOf = P.toJSON = function() {
  var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  return x.isNeg() ? "-" + str : str;
};
function digitsToString(d) {
  var i, k, ws, indexOfLastWord = d.length - 1, str = "", w = d[0];
  if (indexOfLastWord > 0) {
    str += w;
    for (i = 1; i < indexOfLastWord; i++) {
      ws = d[i] + "";
      k = LOG_BASE - ws.length;
      if (k) str += getZeroString(k);
      str += ws;
    }
    w = d[i];
    ws = w + "";
    k = LOG_BASE - ws.length;
    if (k) str += getZeroString(k);
  } else if (w === 0) {
    return "0";
  }
  for (; w % 10 === 0; ) w /= 10;
  return str + w;
}
function checkInt32(i, min2, max2) {
  if (i !== ~~i || i < min2 || i > max2) {
    throw Error(invalidArgument + i);
  }
}
function checkRoundingDigits(d, i, rm, repeating) {
  var di, k, r, rd;
  for (k = d[0]; k >= 10; k /= 10) --i;
  if (--i < 0) {
    i += LOG_BASE;
    di = 0;
  } else {
    di = Math.ceil((i + 1) / LOG_BASE);
    i %= LOG_BASE;
  }
  k = mathpow(10, LOG_BASE - i);
  rd = d[di] % k | 0;
  if (repeating == null) {
    if (i < 3) {
      if (i == 0) rd = rd / 100 | 0;
      else if (i == 1) rd = rd / 10 | 0;
      r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 5e4 || rd == 0;
    } else {
      r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 || (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
    }
  } else {
    if (i < 4) {
      if (i == 0) rd = rd / 1e3 | 0;
      else if (i == 1) rd = rd / 100 | 0;
      else if (i == 2) rd = rd / 10 | 0;
      r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
    } else {
      r = ((repeating || rm < 4) && rd + 1 == k || !repeating && rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 1e3 | 0) == mathpow(10, i - 3) - 1;
    }
  }
  return r;
}
function convertBase(str, baseIn, baseOut) {
  var j, arr = [0], arrL, i = 0, strL = str.length;
  for (; i < strL; ) {
    for (arrL = arr.length; arrL--; ) arr[arrL] *= baseIn;
    arr[0] += NUMERALS.indexOf(str.charAt(i++));
    for (j = 0; j < arr.length; j++) {
      if (arr[j] > baseOut - 1) {
        if (arr[j + 1] === void 0) arr[j + 1] = 0;
        arr[j + 1] += arr[j] / baseOut | 0;
        arr[j] %= baseOut;
      }
    }
  }
  return arr.reverse();
}
function cosine(Ctor, x) {
  var k, len, y;
  if (x.isZero()) return x;
  len = x.d.length;
  if (len < 32) {
    k = Math.ceil(len / 3);
    y = (1 / tinyPow(4, k)).toString();
  } else {
    k = 16;
    y = "2.3283064365386962890625e-10";
  }
  Ctor.precision += k;
  x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));
  for (var i = k; i--; ) {
    var cos2x = x.times(x);
    x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
  }
  Ctor.precision -= k;
  return x;
}
var divide = /* @__PURE__ */ (function() {
  function multiplyInteger(x, k, base) {
    var temp, carry = 0, i = x.length;
    for (x = x.slice(); i--; ) {
      temp = x[i] * k + carry;
      x[i] = temp % base | 0;
      carry = temp / base | 0;
    }
    if (carry) x.unshift(carry);
    return x;
  }
  function compare(a, b, aL, bL) {
    var i, r;
    if (aL != bL) {
      r = aL > bL ? 1 : -1;
    } else {
      for (i = r = 0; i < aL; i++) {
        if (a[i] != b[i]) {
          r = a[i] > b[i] ? 1 : -1;
          break;
        }
      }
    }
    return r;
  }
  function subtract(a, b, aL, base) {
    var i = 0;
    for (; aL--; ) {
      a[aL] -= i;
      i = a[aL] < b[aL] ? 1 : 0;
      a[aL] = i * base + a[aL] - b[aL];
    }
    for (; !a[0] && a.length > 1; ) a.shift();
  }
  return function(x, y, pr, rm, dp, base) {
    var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0, yL, yz, Ctor = x.constructor, sign2 = x.s == y.s ? 1 : -1, xd = x.d, yd = y.d;
    if (!xd || !xd[0] || !yd || !yd[0]) {
      return new Ctor(
        // Return NaN if either NaN, or both Infinity or 0.
        !x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN : (
          // Return ±0 if x is 0 or y is ±Infinity, or return ±Infinity as y is 0.
          xd && xd[0] == 0 || !yd ? sign2 * 0 : sign2 / 0
        )
      );
    }
    if (base) {
      logBase = 1;
      e = x.e - y.e;
    } else {
      base = BASE;
      logBase = LOG_BASE;
      e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
    }
    yL = yd.length;
    xL = xd.length;
    q = new Ctor(sign2);
    qd = q.d = [];
    for (i = 0; yd[i] == (xd[i] || 0); i++) ;
    if (yd[i] > (xd[i] || 0)) e--;
    if (pr == null) {
      sd = pr = Ctor.precision;
      rm = Ctor.rounding;
    } else if (dp) {
      sd = pr + (x.e - y.e) + 1;
    } else {
      sd = pr;
    }
    if (sd < 0) {
      qd.push(1);
      more = true;
    } else {
      sd = sd / logBase + 2 | 0;
      i = 0;
      if (yL == 1) {
        k = 0;
        yd = yd[0];
        sd++;
        for (; (i < xL || k) && sd--; i++) {
          t = k * base + (xd[i] || 0);
          qd[i] = t / yd | 0;
          k = t % yd | 0;
        }
        more = k || i < xL;
      } else {
        k = base / (yd[0] + 1) | 0;
        if (k > 1) {
          yd = multiplyInteger(yd, k, base);
          xd = multiplyInteger(xd, k, base);
          yL = yd.length;
          xL = xd.length;
        }
        xi = yL;
        rem = xd.slice(0, yL);
        remL = rem.length;
        for (; remL < yL; ) rem[remL++] = 0;
        yz = yd.slice();
        yz.unshift(0);
        yd0 = yd[0];
        if (yd[1] >= base / 2) ++yd0;
        do {
          k = 0;
          cmp = compare(yd, rem, yL, remL);
          if (cmp < 0) {
            rem0 = rem[0];
            if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
            k = rem0 / yd0 | 0;
            if (k > 1) {
              if (k >= base) k = base - 1;
              prod = multiplyInteger(yd, k, base);
              prodL = prod.length;
              remL = rem.length;
              cmp = compare(prod, rem, prodL, remL);
              if (cmp == 1) {
                k--;
                subtract(prod, yL < prodL ? yz : yd, prodL, base);
              }
            } else {
              if (k == 0) cmp = k = 1;
              prod = yd.slice();
            }
            prodL = prod.length;
            if (prodL < remL) prod.unshift(0);
            subtract(rem, prod, remL, base);
            if (cmp == -1) {
              remL = rem.length;
              cmp = compare(yd, rem, yL, remL);
              if (cmp < 1) {
                k++;
                subtract(rem, yL < remL ? yz : yd, remL, base);
              }
            }
            remL = rem.length;
          } else if (cmp === 0) {
            k++;
            rem = [0];
          }
          qd[i++] = k;
          if (cmp && rem[0]) {
            rem[remL++] = xd[xi] || 0;
          } else {
            rem = [xd[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] !== void 0) && sd--);
        more = rem[0] !== void 0;
      }
      if (!qd[0]) qd.shift();
    }
    if (logBase == 1) {
      q.e = e;
      inexact = more;
    } else {
      for (i = 1, k = qd[0]; k >= 10; k /= 10) i++;
      q.e = i + e * logBase - 1;
      finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
    }
    return q;
  };
})();
function finalise(x, sd, rm, isTruncated) {
  var digits, i, j, k, rd, roundUp, w, xd, xdi, Ctor = x.constructor;
  out: if (sd != null) {
    xd = x.d;
    if (!xd) return x;
    for (digits = 1, k = xd[0]; k >= 10; k /= 10) digits++;
    i = sd - digits;
    if (i < 0) {
      i += LOG_BASE;
      j = sd;
      w = xd[xdi = 0];
      rd = w / mathpow(10, digits - j - 1) % 10 | 0;
    } else {
      xdi = Math.ceil((i + 1) / LOG_BASE);
      k = xd.length;
      if (xdi >= k) {
        if (isTruncated) {
          for (; k++ <= xdi; ) xd.push(0);
          w = rd = 0;
          digits = 1;
          i %= LOG_BASE;
          j = i - LOG_BASE + 1;
        } else {
          break out;
        }
      } else {
        w = k = xd[xdi];
        for (digits = 1; k >= 10; k /= 10) digits++;
        i %= LOG_BASE;
        j = i - LOG_BASE + digits;
        rd = j < 0 ? 0 : w / mathpow(10, digits - j - 1) % 10 | 0;
      }
    }
    isTruncated = isTruncated || sd < 0 || xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits - j - 1));
    roundUp = rm < 4 ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
    (i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
    if (sd < 1 || !xd[0]) {
      xd.length = 0;
      if (roundUp) {
        sd -= x.e + 1;
        xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
        x.e = -sd || 0;
      } else {
        xd[0] = x.e = 0;
      }
      return x;
    }
    if (i == 0) {
      xd.length = xdi;
      k = 1;
      xdi--;
    } else {
      xd.length = xdi + 1;
      k = mathpow(10, LOG_BASE - i);
      xd[xdi] = j > 0 ? (w / mathpow(10, digits - j) % mathpow(10, j) | 0) * k : 0;
    }
    if (roundUp) {
      for (; ; ) {
        if (xdi == 0) {
          for (i = 1, j = xd[0]; j >= 10; j /= 10) i++;
          j = xd[0] += k;
          for (k = 1; j >= 10; j /= 10) k++;
          if (i != k) {
            x.e++;
            if (xd[0] == BASE) xd[0] = 1;
          }
          break;
        } else {
          xd[xdi] += k;
          if (xd[xdi] != BASE) break;
          xd[xdi--] = 0;
          k = 1;
        }
      }
    }
    for (i = xd.length; xd[--i] === 0; ) xd.pop();
  }
  if (external) {
    if (x.e > Ctor.maxE) {
      x.d = null;
      x.e = NaN;
    } else if (x.e < Ctor.minE) {
      x.e = 0;
      x.d = [0];
    }
  }
  return x;
}
function finiteToString(x, isExp, sd) {
  if (!x.isFinite()) return nonFiniteToString(x);
  var k, e = x.e, str = digitsToString(x.d), len = str.length;
  if (isExp) {
    if (sd && (k = sd - len) > 0) {
      str = str.charAt(0) + "." + str.slice(1) + getZeroString(k);
    } else if (len > 1) {
      str = str.charAt(0) + "." + str.slice(1);
    }
    str = str + (x.e < 0 ? "e" : "e+") + x.e;
  } else if (e < 0) {
    str = "0." + getZeroString(-e - 1) + str;
    if (sd && (k = sd - len) > 0) str += getZeroString(k);
  } else if (e >= len) {
    str += getZeroString(e + 1 - len);
    if (sd && (k = sd - e - 1) > 0) str = str + "." + getZeroString(k);
  } else {
    if ((k = e + 1) < len) str = str.slice(0, k) + "." + str.slice(k);
    if (sd && (k = sd - len) > 0) {
      if (e + 1 === len) str += ".";
      str += getZeroString(k);
    }
  }
  return str;
}
function getBase10Exponent(digits, e) {
  var w = digits[0];
  for (e *= LOG_BASE; w >= 10; w /= 10) e++;
  return e;
}
function getLn10(Ctor, sd, pr) {
  if (sd > LN10_PRECISION) {
    external = true;
    if (pr) Ctor.precision = pr;
    throw Error(precisionLimitExceeded);
  }
  return finalise(new Ctor(LN10), sd, 1, true);
}
function getPi(Ctor, sd, rm) {
  if (sd > PI_PRECISION) throw Error(precisionLimitExceeded);
  return finalise(new Ctor(PI), sd, rm, true);
}
function getPrecision(digits) {
  var w = digits.length - 1, len = w * LOG_BASE + 1;
  w = digits[w];
  if (w) {
    for (; w % 10 == 0; w /= 10) len--;
    for (w = digits[0]; w >= 10; w /= 10) len++;
  }
  return len;
}
function getZeroString(k) {
  var zs = "";
  for (; k--; ) zs += "0";
  return zs;
}
function intPow(Ctor, x, n, pr) {
  var isTruncated, r = new Ctor(1), k = Math.ceil(pr / LOG_BASE + 4);
  external = false;
  for (; ; ) {
    if (n % 2) {
      r = r.times(x);
      if (truncate(r.d, k)) isTruncated = true;
    }
    n = mathfloor(n / 2);
    if (n === 0) {
      n = r.d.length - 1;
      if (isTruncated && r.d[n] === 0) ++r.d[n];
      break;
    }
    x = x.times(x);
    truncate(x.d, k);
  }
  external = true;
  return r;
}
function isOdd(n) {
  return n.d[n.d.length - 1] & 1;
}
function maxOrMin(Ctor, args, n) {
  var k, y, x = new Ctor(args[0]), i = 0;
  for (; ++i < args.length; ) {
    y = new Ctor(args[i]);
    if (!y.s) {
      x = y;
      break;
    }
    k = x.cmp(y);
    if (k === n || k === 0 && x.s === n) {
      x = y;
    }
  }
  return x;
}
function naturalExponential(x, sd) {
  var denominator, guard, j, pow2, sum2, t, wpr, rep = 0, i = 0, k = 0, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
  if (!x.d || !x.d[0] || x.e > 17) {
    return new Ctor(x.d ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0 : x.s ? x.s < 0 ? 0 : x : 0 / 0);
  }
  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }
  t = new Ctor(0.03125);
  while (x.e > -2) {
    x = x.times(t);
    k += 5;
  }
  guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
  wpr += guard;
  denominator = pow2 = sum2 = new Ctor(1);
  Ctor.precision = wpr;
  for (; ; ) {
    pow2 = finalise(pow2.times(x), wpr, 1);
    denominator = denominator.times(++i);
    t = sum2.plus(divide(pow2, denominator, wpr, 1));
    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum2.d).slice(0, wpr)) {
      j = k;
      while (j--) sum2 = finalise(sum2.times(sum2), wpr, 1);
      if (sd == null) {
        if (rep < 3 && checkRoundingDigits(sum2.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += 10;
          denominator = pow2 = t = new Ctor(1);
          i = 0;
          rep++;
        } else {
          return finalise(sum2, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum2;
      }
    }
    sum2 = t;
  }
}
function naturalLogarithm(y, sd) {
  var c, c0, denominator, e, numerator, rep, sum2, t, wpr, x1, x2, n = 1, guard = 10, x = y, xd = x.d, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
  if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) {
    return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
  }
  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }
  Ctor.precision = wpr += guard;
  c = digitsToString(xd);
  c0 = c.charAt(0);
  if (Math.abs(e = x.e) < 15e14) {
    while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
      x = x.times(y);
      c = digitsToString(x.d);
      c0 = c.charAt(0);
      n++;
    }
    e = x.e;
    if (c0 > 1) {
      x = new Ctor("0." + c);
      e++;
    } else {
      x = new Ctor(c0 + "." + c.slice(1));
    }
  } else {
    t = getLn10(Ctor, wpr + 2, pr).times(e + "");
    x = naturalLogarithm(new Ctor(c0 + "." + c.slice(1)), wpr - guard).plus(t);
    Ctor.precision = pr;
    return sd == null ? finalise(x, pr, rm, external = true) : x;
  }
  x1 = x;
  sum2 = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
  x2 = finalise(x.times(x), wpr, 1);
  denominator = 3;
  for (; ; ) {
    numerator = finalise(numerator.times(x2), wpr, 1);
    t = sum2.plus(divide(numerator, new Ctor(denominator), wpr, 1));
    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum2.d).slice(0, wpr)) {
      sum2 = sum2.times(2);
      if (e !== 0) sum2 = sum2.plus(getLn10(Ctor, wpr + 2, pr).times(e + ""));
      sum2 = divide(sum2, new Ctor(n), wpr, 1);
      if (sd == null) {
        if (checkRoundingDigits(sum2.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += guard;
          t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
          x2 = finalise(x.times(x), wpr, 1);
          denominator = rep = 1;
        } else {
          return finalise(sum2, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum2;
      }
    }
    sum2 = t;
    denominator += 2;
  }
}
function nonFiniteToString(x) {
  return String(x.s * x.s / 0);
}
function parseDecimal(x, str) {
  var e, i, len;
  if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
  if ((i = str.search(/e/i)) > 0) {
    if (e < 0) e = i;
    e += +str.slice(i + 1);
    str = str.substring(0, i);
  } else if (e < 0) {
    e = str.length;
  }
  for (i = 0; str.charCodeAt(i) === 48; i++) ;
  for (len = str.length; str.charCodeAt(len - 1) === 48; --len) ;
  str = str.slice(i, len);
  if (str) {
    len -= i;
    x.e = e = e - i - 1;
    x.d = [];
    i = (e + 1) % LOG_BASE;
    if (e < 0) i += LOG_BASE;
    if (i < len) {
      if (i) x.d.push(+str.slice(0, i));
      for (len -= LOG_BASE; i < len; ) x.d.push(+str.slice(i, i += LOG_BASE));
      str = str.slice(i);
      i = LOG_BASE - str.length;
    } else {
      i -= len;
    }
    for (; i--; ) str += "0";
    x.d.push(+str);
    if (external) {
      if (x.e > x.constructor.maxE) {
        x.d = null;
        x.e = NaN;
      } else if (x.e < x.constructor.minE) {
        x.e = 0;
        x.d = [0];
      }
    }
  } else {
    x.e = 0;
    x.d = [0];
  }
  return x;
}
function parseOther(x, str) {
  var base, Ctor, divisor, i, isFloat, len, p, xd, xe;
  if (str.indexOf("_") > -1) {
    str = str.replace(/(\d)_(?=\d)/g, "$1");
    if (isDecimal.test(str)) return parseDecimal(x, str);
  } else if (str === "Infinity" || str === "NaN") {
    if (!+str) x.s = NaN;
    x.e = NaN;
    x.d = null;
    return x;
  }
  if (isHex.test(str)) {
    base = 16;
    str = str.toLowerCase();
  } else if (isBinary.test(str)) {
    base = 2;
  } else if (isOctal.test(str)) {
    base = 8;
  } else {
    throw Error(invalidArgument + str);
  }
  i = str.search(/p/i);
  if (i > 0) {
    p = +str.slice(i + 1);
    str = str.substring(2, i);
  } else {
    str = str.slice(2);
  }
  i = str.indexOf(".");
  isFloat = i >= 0;
  Ctor = x.constructor;
  if (isFloat) {
    str = str.replace(".", "");
    len = str.length;
    i = len - i;
    divisor = intPow(Ctor, new Ctor(base), i, i * 2);
  }
  xd = convertBase(str, base, BASE);
  xe = xd.length - 1;
  for (i = xe; xd[i] === 0; --i) xd.pop();
  if (i < 0) return new Ctor(x.s * 0);
  x.e = getBase10Exponent(xd, xe);
  x.d = xd;
  external = false;
  if (isFloat) x = divide(x, divisor, len * 4);
  if (p) x = x.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
  external = true;
  return x;
}
function sine(Ctor, x) {
  var k, len = x.d.length;
  if (len < 3) {
    return x.isZero() ? x : taylorSeries(Ctor, 2, x, x);
  }
  k = 1.4 * Math.sqrt(len);
  k = k > 16 ? 16 : k | 0;
  x = x.times(1 / tinyPow(5, k));
  x = taylorSeries(Ctor, 2, x, x);
  var sin2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
  for (; k--; ) {
    sin2_x = x.times(x);
    x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
  }
  return x;
}
function taylorSeries(Ctor, n, x, y, isHyperbolic) {
  var j, t, u, x2, i = 1, pr = Ctor.precision, k = Math.ceil(pr / LOG_BASE);
  external = false;
  x2 = x.times(x);
  u = new Ctor(y);
  for (; ; ) {
    t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
    u = isHyperbolic ? y.plus(t) : y.minus(t);
    y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
    t = u.plus(y);
    if (t.d[k] !== void 0) {
      for (j = k; t.d[j] === u.d[j] && j--; ) ;
      if (j == -1) break;
    }
    j = u;
    u = y;
    y = t;
    t = j;
    i++;
  }
  external = true;
  t.d.length = k + 1;
  return t;
}
function tinyPow(b, e) {
  var n = b;
  while (--e) n *= b;
  return n;
}
function toLessThanHalfPi(Ctor, x) {
  var t, isNeg = x.s < 0, pi = getPi(Ctor, Ctor.precision, 1), halfPi = pi.times(0.5);
  x = x.abs();
  if (x.lte(halfPi)) {
    quadrant = isNeg ? 4 : 1;
    return x;
  }
  t = x.divToInt(pi);
  if (t.isZero()) {
    quadrant = isNeg ? 3 : 2;
  } else {
    x = x.minus(t.times(pi));
    if (x.lte(halfPi)) {
      quadrant = isOdd(t) ? isNeg ? 2 : 3 : isNeg ? 4 : 1;
      return x;
    }
    quadrant = isOdd(t) ? isNeg ? 1 : 4 : isNeg ? 3 : 2;
  }
  return x.minus(pi).abs();
}
function toStringBinary(x, baseOut, sd, rm) {
  var base, e, i, k, len, roundUp, str, xd, y, Ctor = x.constructor, isExp = sd !== void 0;
  if (isExp) {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
  } else {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  }
  if (!x.isFinite()) {
    str = nonFiniteToString(x);
  } else {
    str = finiteToString(x);
    i = str.indexOf(".");
    if (isExp) {
      base = 2;
      if (baseOut == 16) {
        sd = sd * 4 - 3;
      } else if (baseOut == 8) {
        sd = sd * 3 - 2;
      }
    } else {
      base = baseOut;
    }
    if (i >= 0) {
      str = str.replace(".", "");
      y = new Ctor(1);
      y.e = str.length - i;
      y.d = convertBase(finiteToString(y), 10, base);
      y.e = y.d.length;
    }
    xd = convertBase(str, 10, base);
    e = len = xd.length;
    for (; xd[--len] == 0; ) xd.pop();
    if (!xd[0]) {
      str = isExp ? "0p+0" : "0";
    } else {
      if (i < 0) {
        e--;
      } else {
        x = new Ctor(x);
        x.d = xd;
        x.e = e;
        x = divide(x, y, sd, rm, 0, base);
        xd = x.d;
        e = x.e;
        roundUp = inexact;
      }
      i = xd[sd];
      k = base / 2;
      roundUp = roundUp || xd[sd + 1] !== void 0;
      roundUp = rm < 4 ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2)) : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 || rm === (x.s < 0 ? 8 : 7));
      xd.length = sd;
      if (roundUp) {
        for (; ++xd[--sd] > base - 1; ) {
          xd[sd] = 0;
          if (!sd) {
            ++e;
            xd.unshift(1);
          }
        }
      }
      for (len = xd.length; !xd[len - 1]; --len) ;
      for (i = 0, str = ""; i < len; i++) str += NUMERALS.charAt(xd[i]);
      if (isExp) {
        if (len > 1) {
          if (baseOut == 16 || baseOut == 8) {
            i = baseOut == 16 ? 4 : 3;
            for (--len; len % i; len++) str += "0";
            xd = convertBase(str, base, baseOut);
            for (len = xd.length; !xd[len - 1]; --len) ;
            for (i = 1, str = "1."; i < len; i++) str += NUMERALS.charAt(xd[i]);
          } else {
            str = str.charAt(0) + "." + str.slice(1);
          }
        }
        str = str + (e < 0 ? "p" : "p+") + e;
      } else if (e < 0) {
        for (; ++e; ) str = "0" + str;
        str = "0." + str;
      } else {
        if (++e > len) for (e -= len; e--; ) str += "0";
        else if (e < len) str = str.slice(0, e) + "." + str.slice(e);
      }
    }
    str = (baseOut == 16 ? "0x" : baseOut == 2 ? "0b" : baseOut == 8 ? "0o" : "") + str;
  }
  return x.s < 0 ? "-" + str : str;
}
function truncate(arr, len) {
  if (arr.length > len) {
    arr.length = len;
    return true;
  }
}
function abs(x) {
  return new this(x).abs();
}
function acos(x) {
  return new this(x).acos();
}
function acosh(x) {
  return new this(x).acosh();
}
function add(x, y) {
  return new this(x).plus(y);
}
function asin(x) {
  return new this(x).asin();
}
function asinh(x) {
  return new this(x).asinh();
}
function atan(x) {
  return new this(x).atan();
}
function atanh(x) {
  return new this(x).atanh();
}
function atan2(y, x) {
  y = new this(y);
  x = new this(x);
  var r, pr = this.precision, rm = this.rounding, wpr = pr + 4;
  if (!y.s || !x.s) {
    r = new this(NaN);
  } else if (!y.d && !x.d) {
    r = getPi(this, wpr, 1).times(x.s > 0 ? 0.25 : 0.75);
    r.s = y.s;
  } else if (!x.d || y.isZero()) {
    r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
    r.s = y.s;
  } else if (!y.d || x.isZero()) {
    r = getPi(this, wpr, 1).times(0.5);
    r.s = y.s;
  } else if (x.s < 0) {
    this.precision = wpr;
    this.rounding = 1;
    r = this.atan(divide(y, x, wpr, 1));
    x = getPi(this, wpr, 1);
    this.precision = pr;
    this.rounding = rm;
    r = y.s < 0 ? r.minus(x) : r.plus(x);
  } else {
    r = this.atan(divide(y, x, wpr, 1));
  }
  return r;
}
function cbrt(x) {
  return new this(x).cbrt();
}
function ceil(x) {
  return finalise(x = new this(x), x.e + 1, 2);
}
function clamp(x, min2, max2) {
  return new this(x).clamp(min2, max2);
}
function config(obj) {
  if (!obj || typeof obj !== "object") throw Error(decimalError + "Object expected");
  var i, p, v, useDefaults = obj.defaults === true, ps = [
    "precision",
    1,
    MAX_DIGITS,
    "rounding",
    0,
    8,
    "toExpNeg",
    -EXP_LIMIT,
    0,
    "toExpPos",
    0,
    EXP_LIMIT,
    "maxE",
    0,
    EXP_LIMIT,
    "minE",
    -EXP_LIMIT,
    0,
    "modulo",
    0,
    9
  ];
  for (i = 0; i < ps.length; i += 3) {
    if (p = ps[i], useDefaults) this[p] = DEFAULTS[p];
    if ((v = obj[p]) !== void 0) {
      if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
      else throw Error(invalidArgument + p + ": " + v);
    }
  }
  if (p = "crypto", useDefaults) this[p] = DEFAULTS[p];
  if ((v = obj[p]) !== void 0) {
    if (v === true || v === false || v === 0 || v === 1) {
      if (v) {
        if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
          this[p] = true;
        } else {
          throw Error(cryptoUnavailable);
        }
      } else {
        this[p] = false;
      }
    } else {
      throw Error(invalidArgument + p + ": " + v);
    }
  }
  return this;
}
function cos(x) {
  return new this(x).cos();
}
function cosh(x) {
  return new this(x).cosh();
}
function clone(obj) {
  var i, p, ps;
  function Decimal2(v) {
    var e, i2, t, x = this;
    if (!(x instanceof Decimal2)) return new Decimal2(v);
    x.constructor = Decimal2;
    if (isDecimalInstance(v)) {
      x.s = v.s;
      if (external) {
        if (!v.d || v.e > Decimal2.maxE) {
          x.e = NaN;
          x.d = null;
        } else if (v.e < Decimal2.minE) {
          x.e = 0;
          x.d = [0];
        } else {
          x.e = v.e;
          x.d = v.d.slice();
        }
      } else {
        x.e = v.e;
        x.d = v.d ? v.d.slice() : v.d;
      }
      return;
    }
    t = typeof v;
    if (t === "number") {
      if (v === 0) {
        x.s = 1 / v < 0 ? -1 : 1;
        x.e = 0;
        x.d = [0];
        return;
      }
      if (v < 0) {
        v = -v;
        x.s = -1;
      } else {
        x.s = 1;
      }
      if (v === ~~v && v < 1e7) {
        for (e = 0, i2 = v; i2 >= 10; i2 /= 10) e++;
        if (external) {
          if (e > Decimal2.maxE) {
            x.e = NaN;
            x.d = null;
          } else if (e < Decimal2.minE) {
            x.e = 0;
            x.d = [0];
          } else {
            x.e = e;
            x.d = [v];
          }
        } else {
          x.e = e;
          x.d = [v];
        }
        return;
      }
      if (v * 0 !== 0) {
        if (!v) x.s = NaN;
        x.e = NaN;
        x.d = null;
        return;
      }
      return parseDecimal(x, v.toString());
    }
    if (t === "string") {
      if ((i2 = v.charCodeAt(0)) === 45) {
        v = v.slice(1);
        x.s = -1;
      } else {
        if (i2 === 43) v = v.slice(1);
        x.s = 1;
      }
      return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
    }
    if (t === "bigint") {
      if (v < 0) {
        v = -v;
        x.s = -1;
      } else {
        x.s = 1;
      }
      return parseDecimal(x, v.toString());
    }
    throw Error(invalidArgument + v);
  }
  Decimal2.prototype = P;
  Decimal2.ROUND_UP = 0;
  Decimal2.ROUND_DOWN = 1;
  Decimal2.ROUND_CEIL = 2;
  Decimal2.ROUND_FLOOR = 3;
  Decimal2.ROUND_HALF_UP = 4;
  Decimal2.ROUND_HALF_DOWN = 5;
  Decimal2.ROUND_HALF_EVEN = 6;
  Decimal2.ROUND_HALF_CEIL = 7;
  Decimal2.ROUND_HALF_FLOOR = 8;
  Decimal2.EUCLID = 9;
  Decimal2.config = Decimal2.set = config;
  Decimal2.clone = clone;
  Decimal2.isDecimal = isDecimalInstance;
  Decimal2.abs = abs;
  Decimal2.acos = acos;
  Decimal2.acosh = acosh;
  Decimal2.add = add;
  Decimal2.asin = asin;
  Decimal2.asinh = asinh;
  Decimal2.atan = atan;
  Decimal2.atanh = atanh;
  Decimal2.atan2 = atan2;
  Decimal2.cbrt = cbrt;
  Decimal2.ceil = ceil;
  Decimal2.clamp = clamp;
  Decimal2.cos = cos;
  Decimal2.cosh = cosh;
  Decimal2.div = div;
  Decimal2.exp = exp;
  Decimal2.floor = floor;
  Decimal2.hypot = hypot;
  Decimal2.ln = ln;
  Decimal2.log = log;
  Decimal2.log10 = log10;
  Decimal2.log2 = log2;
  Decimal2.max = max;
  Decimal2.min = min;
  Decimal2.mod = mod;
  Decimal2.mul = mul;
  Decimal2.pow = pow;
  Decimal2.random = random;
  Decimal2.round = round;
  Decimal2.sign = sign;
  Decimal2.sin = sin;
  Decimal2.sinh = sinh;
  Decimal2.sqrt = sqrt;
  Decimal2.sub = sub;
  Decimal2.sum = sum;
  Decimal2.tan = tan;
  Decimal2.tanh = tanh;
  Decimal2.trunc = trunc;
  if (obj === void 0) obj = {};
  if (obj) {
    if (obj.defaults !== true) {
      ps = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"];
      for (i = 0; i < ps.length; ) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
    }
  }
  Decimal2.config(obj);
  return Decimal2;
}
function div(x, y) {
  return new this(x).div(y);
}
function exp(x) {
  return new this(x).exp();
}
function floor(x) {
  return finalise(x = new this(x), x.e + 1, 3);
}
function hypot() {
  var i, n, t = new this(0);
  external = false;
  for (i = 0; i < arguments.length; ) {
    n = new this(arguments[i++]);
    if (!n.d) {
      if (n.s) {
        external = true;
        return new this(1 / 0);
      }
      t = n;
    } else if (t.d) {
      t = t.plus(n.times(n));
    }
  }
  external = true;
  return t.sqrt();
}
function isDecimalInstance(obj) {
  return obj instanceof Decimal || obj && obj.toStringTag === tag || false;
}
function ln(x) {
  return new this(x).ln();
}
function log(x, y) {
  return new this(x).log(y);
}
function log2(x) {
  return new this(x).log(2);
}
function log10(x) {
  return new this(x).log(10);
}
function max() {
  return maxOrMin(this, arguments, -1);
}
function min() {
  return maxOrMin(this, arguments, 1);
}
function mod(x, y) {
  return new this(x).mod(y);
}
function mul(x, y) {
  return new this(x).mul(y);
}
function pow(x, y) {
  return new this(x).pow(y);
}
function random(sd) {
  var d, e, k, n, i = 0, r = new this(1), rd = [];
  if (sd === void 0) sd = this.precision;
  else checkInt32(sd, 1, MAX_DIGITS);
  k = Math.ceil(sd / LOG_BASE);
  if (!this.crypto) {
    for (; i < k; ) rd[i++] = Math.random() * 1e7 | 0;
  } else if (crypto.getRandomValues) {
    d = crypto.getRandomValues(new Uint32Array(k));
    for (; i < k; ) {
      n = d[i];
      if (n >= 429e7) {
        d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
      } else {
        rd[i++] = n % 1e7;
      }
    }
  } else if (crypto.randomBytes) {
    d = crypto.randomBytes(k *= 4);
    for (; i < k; ) {
      n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 127) << 24);
      if (n >= 214e7) {
        crypto.randomBytes(4).copy(d, i);
      } else {
        rd.push(n % 1e7);
        i += 4;
      }
    }
    i = k / 4;
  } else {
    throw Error(cryptoUnavailable);
  }
  k = rd[--i];
  sd %= LOG_BASE;
  if (k && sd) {
    n = mathpow(10, LOG_BASE - sd);
    rd[i] = (k / n | 0) * n;
  }
  for (; rd[i] === 0; i--) rd.pop();
  if (i < 0) {
    e = 0;
    rd = [0];
  } else {
    e = -1;
    for (; rd[0] === 0; e -= LOG_BASE) rd.shift();
    for (k = 1, n = rd[0]; n >= 10; n /= 10) k++;
    if (k < LOG_BASE) e -= LOG_BASE - k;
  }
  r.e = e;
  r.d = rd;
  return r;
}
function round(x) {
  return finalise(x = new this(x), x.e + 1, this.rounding);
}
function sign(x) {
  x = new this(x);
  return x.d ? x.d[0] ? x.s : 0 * x.s : x.s || NaN;
}
function sin(x) {
  return new this(x).sin();
}
function sinh(x) {
  return new this(x).sinh();
}
function sqrt(x) {
  return new this(x).sqrt();
}
function sub(x, y) {
  return new this(x).sub(y);
}
function sum() {
  var i = 0, args = arguments, x = new this(args[i]);
  external = false;
  for (; x.s && ++i < args.length; ) x = x.plus(args[i]);
  external = true;
  return finalise(x, this.precision, this.rounding);
}
function tan(x) {
  return new this(x).tan();
}
function tanh(x) {
  return new this(x).tanh();
}
function trunc(x) {
  return finalise(x = new this(x), x.e + 1, 1);
}
P[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")] = P.toString;
P[Symbol.toStringTag] = "Decimal";
var Decimal = P.constructor = clone(DEFAULTS);
LN10 = new Decimal(LN10);
PI = new Decimal(PI);
var decimal_default = Decimal;

// node_modules/@genrojs/tytx/node_modules/big.js/big.mjs
var DP = 20;
var RM = 1;
var MAX_DP = 1e6;
var MAX_POWER = 1e6;
var NE = -7;
var PE = 21;
var STRICT = false;
var NAME = "[big.js] ";
var INVALID = NAME + "Invalid ";
var INVALID_DP = INVALID + "decimal places";
var INVALID_RM = INVALID + "rounding mode";
var DIV_BY_ZERO = NAME + "Division by zero";
var P2 = {};
var UNDEFINED = void 0;
var NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
function _Big_() {
  function Big2(n) {
    var x = this;
    if (!(x instanceof Big2)) return n === UNDEFINED ? _Big_() : new Big2(n);
    if (n instanceof Big2) {
      x.s = n.s;
      x.e = n.e;
      x.c = n.c.slice();
    } else {
      if (typeof n !== "string") {
        if (Big2.strict === true && typeof n !== "bigint") {
          throw TypeError(INVALID + "value");
        }
        n = n === 0 && 1 / n < 0 ? "-0" : String(n);
      }
      parse(x, n);
    }
    x.constructor = Big2;
  }
  Big2.prototype = P2;
  Big2.DP = DP;
  Big2.RM = RM;
  Big2.NE = NE;
  Big2.PE = PE;
  Big2.strict = STRICT;
  Big2.roundDown = 0;
  Big2.roundHalfUp = 1;
  Big2.roundHalfEven = 2;
  Big2.roundUp = 3;
  return Big2;
}
function parse(x, n) {
  var e, i, nl;
  if (!NUMERIC.test(n)) {
    throw Error(INVALID + "number");
  }
  x.s = n.charAt(0) == "-" ? (n = n.slice(1), -1) : 1;
  if ((e = n.indexOf(".")) > -1) n = n.replace(".", "");
  if ((i = n.search(/e/i)) > 0) {
    if (e < 0) e = i;
    e += +n.slice(i + 1);
    n = n.substring(0, i);
  } else if (e < 0) {
    e = n.length;
  }
  nl = n.length;
  for (i = 0; i < nl && n.charAt(i) == "0"; ) ++i;
  if (i == nl) {
    x.c = [x.e = 0];
  } else {
    for (; nl > 0 && n.charAt(--nl) == "0"; ) ;
    x.e = e - i - 1;
    x.c = [];
    for (e = 0; i <= nl; ) x.c[e++] = +n.charAt(i++);
  }
  return x;
}
function round2(x, sd, rm, more) {
  var xc = x.c;
  if (rm === UNDEFINED) rm = x.constructor.RM;
  if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
    throw Error(INVALID_RM);
  }
  if (sd < 1) {
    more = rm === 3 && (more || !!xc[0]) || sd === 0 && (rm === 1 && xc[0] >= 5 || rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED)));
    xc.length = 1;
    if (more) {
      x.e = x.e - sd + 1;
      xc[0] = 1;
    } else {
      xc[0] = x.e = 0;
    }
  } else if (sd < xc.length) {
    more = rm === 1 && xc[sd] >= 5 || rm === 2 && (xc[sd] > 5 || xc[sd] === 5 && (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) || rm === 3 && (more || !!xc[0]);
    xc.length = sd;
    if (more) {
      for (; ++xc[--sd] > 9; ) {
        xc[sd] = 0;
        if (sd === 0) {
          ++x.e;
          xc.unshift(1);
          break;
        }
      }
    }
    for (sd = xc.length; !xc[--sd]; ) xc.pop();
  }
  return x;
}
function stringify(x, doExponential, isNonzero) {
  var e = x.e, s = x.c.join(""), n = s.length;
  if (doExponential) {
    s = s.charAt(0) + (n > 1 ? "." + s.slice(1) : "") + (e < 0 ? "e" : "e+") + e;
  } else if (e < 0) {
    for (; ++e; ) s = "0" + s;
    s = "0." + s;
  } else if (e > 0) {
    if (++e > n) {
      for (e -= n; e--; ) s += "0";
    } else if (e < n) {
      s = s.slice(0, e) + "." + s.slice(e);
    }
  } else if (n > 1) {
    s = s.charAt(0) + "." + s.slice(1);
  }
  return x.s < 0 && isNonzero ? "-" + s : s;
}
P2.abs = function() {
  var x = new this.constructor(this);
  x.s = 1;
  return x;
};
P2.cmp = function(y) {
  var isneg, x = this, xc = x.c, yc = (y = new x.constructor(y)).c, i = x.s, j = y.s, k = x.e, l = y.e;
  if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;
  if (i != j) return i;
  isneg = i < 0;
  if (k != l) return k > l ^ isneg ? 1 : -1;
  j = (k = xc.length) < (l = yc.length) ? k : l;
  for (i = -1; ++i < j; ) {
    if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
  }
  return k == l ? 0 : k > l ^ isneg ? 1 : -1;
};
P2.div = function(y) {
  var x = this, Big2 = x.constructor, a = x.c, b = (y = new Big2(y)).c, k = x.s == y.s ? 1 : -1, dp = Big2.DP;
  if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
    throw Error(INVALID_DP);
  }
  if (!b[0]) {
    throw Error(DIV_BY_ZERO);
  }
  if (!a[0]) {
    y.s = k;
    y.c = [y.e = 0];
    return y;
  }
  var bl, bt, n, cmp, ri, bz = b.slice(), ai = bl = b.length, al = a.length, r = a.slice(0, bl), rl = r.length, q = y, qc = q.c = [], qi = 0, p = dp + (q.e = x.e - y.e) + 1;
  q.s = k;
  k = p < 0 ? 0 : p;
  bz.unshift(0);
  for (; rl++ < bl; ) r.push(0);
  do {
    for (n = 0; n < 10; n++) {
      if (bl != (rl = r.length)) {
        cmp = bl > rl ? 1 : -1;
      } else {
        for (ri = -1, cmp = 0; ++ri < bl; ) {
          if (b[ri] != r[ri]) {
            cmp = b[ri] > r[ri] ? 1 : -1;
            break;
          }
        }
      }
      if (cmp < 0) {
        for (bt = rl == bl ? b : bz; rl; ) {
          if (r[--rl] < bt[rl]) {
            ri = rl;
            for (; ri && !r[--ri]; ) r[ri] = 9;
            --r[ri];
            r[rl] += 10;
          }
          r[rl] -= bt[rl];
        }
        for (; !r[0]; ) r.shift();
      } else {
        break;
      }
    }
    qc[qi++] = cmp ? n : ++n;
    if (r[0] && cmp) r[rl] = a[ai] || 0;
    else r = [a[ai]];
  } while ((ai++ < al || r[0] !== UNDEFINED) && k--);
  if (!qc[0] && qi != 1) {
    qc.shift();
    q.e--;
    p--;
  }
  if (qi > p) round2(q, p, Big2.RM, r[0] !== UNDEFINED);
  return q;
};
P2.eq = function(y) {
  return this.cmp(y) === 0;
};
P2.gt = function(y) {
  return this.cmp(y) > 0;
};
P2.gte = function(y) {
  return this.cmp(y) > -1;
};
P2.lt = function(y) {
  return this.cmp(y) < 0;
};
P2.lte = function(y) {
  return this.cmp(y) < 1;
};
P2.minus = P2.sub = function(y) {
  var i, j, t, xlty, x = this, Big2 = x.constructor, a = x.s, b = (y = new Big2(y)).s;
  if (a != b) {
    y.s = -b;
    return x.plus(y);
  }
  var xc = x.c.slice(), xe = x.e, yc = y.c, ye = y.e;
  if (!xc[0] || !yc[0]) {
    if (yc[0]) {
      y.s = -b;
    } else if (xc[0]) {
      y = new Big2(x);
    } else {
      y.s = 1;
    }
    return y;
  }
  if (a = xe - ye) {
    if (xlty = a < 0) {
      a = -a;
      t = xc;
    } else {
      ye = xe;
      t = yc;
    }
    t.reverse();
    for (b = a; b--; ) t.push(0);
    t.reverse();
  } else {
    j = ((xlty = xc.length < yc.length) ? xc : yc).length;
    for (a = b = 0; b < j; b++) {
      if (xc[b] != yc[b]) {
        xlty = xc[b] < yc[b];
        break;
      }
    }
  }
  if (xlty) {
    t = xc;
    xc = yc;
    yc = t;
    y.s = -y.s;
  }
  if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--; ) xc[i++] = 0;
  for (b = i; j > a; ) {
    if (xc[--j] < yc[j]) {
      for (i = j; i && !xc[--i]; ) xc[i] = 9;
      --xc[i];
      xc[j] += 10;
    }
    xc[j] -= yc[j];
  }
  for (; xc[--b] === 0; ) xc.pop();
  for (; xc[0] === 0; ) {
    xc.shift();
    --ye;
  }
  if (!xc[0]) {
    y.s = 1;
    xc = [ye = 0];
  }
  y.c = xc;
  y.e = ye;
  return y;
};
P2.mod = function(y) {
  var ygtx, x = this, Big2 = x.constructor, a = x.s, b = (y = new Big2(y)).s;
  if (!y.c[0]) {
    throw Error(DIV_BY_ZERO);
  }
  x.s = y.s = 1;
  ygtx = y.cmp(x) == 1;
  x.s = a;
  y.s = b;
  if (ygtx) return new Big2(x);
  a = Big2.DP;
  b = Big2.RM;
  Big2.DP = Big2.RM = 0;
  x = x.div(y);
  Big2.DP = a;
  Big2.RM = b;
  return this.minus(x.times(y));
};
P2.neg = function() {
  var x = new this.constructor(this);
  x.s = -x.s;
  return x;
};
P2.plus = P2.add = function(y) {
  var e, k, t, x = this, Big2 = x.constructor;
  y = new Big2(y);
  if (x.s != y.s) {
    y.s = -y.s;
    return x.minus(y);
  }
  var xe = x.e, xc = x.c, ye = y.e, yc = y.c;
  if (!xc[0] || !yc[0]) {
    if (!yc[0]) {
      if (xc[0]) {
        y = new Big2(x);
      } else {
        y.s = x.s;
      }
    }
    return y;
  }
  xc = xc.slice();
  if (e = xe - ye) {
    if (e > 0) {
      ye = xe;
      t = yc;
    } else {
      e = -e;
      t = xc;
    }
    t.reverse();
    for (; e--; ) t.push(0);
    t.reverse();
  }
  if (xc.length - yc.length < 0) {
    t = yc;
    yc = xc;
    xc = t;
  }
  e = yc.length;
  for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;
  if (k) {
    xc.unshift(k);
    ++ye;
  }
  for (e = xc.length; xc[--e] === 0; ) xc.pop();
  y.c = xc;
  y.e = ye;
  return y;
};
P2.pow = function(n) {
  var x = this, one = new x.constructor("1"), y = one, isneg = n < 0;
  if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
    throw Error(INVALID + "exponent");
  }
  if (isneg) n = -n;
  for (; ; ) {
    if (n & 1) y = y.times(x);
    n >>= 1;
    if (!n) break;
    x = x.times(x);
  }
  return isneg ? one.div(y) : y;
};
P2.prec = function(sd, rm) {
  if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
    throw Error(INVALID + "precision");
  }
  return round2(new this.constructor(this), sd, rm);
};
P2.round = function(dp, rm) {
  if (dp === UNDEFINED) dp = 0;
  else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
    throw Error(INVALID_DP);
  }
  return round2(new this.constructor(this), dp + this.e + 1, rm);
};
P2.sqrt = function() {
  var r, c, t, x = this, Big2 = x.constructor, s = x.s, e = x.e, half = new Big2("0.5");
  if (!x.c[0]) return new Big2(x);
  if (s < 0) {
    throw Error(NAME + "No square root");
  }
  s = Math.sqrt(+stringify(x, true, true));
  if (s === 0 || s === 1 / 0) {
    c = x.c.join("");
    if (!(c.length + e & 1)) c += "0";
    s = Math.sqrt(c);
    e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
    r = new Big2((s == 1 / 0 ? "5e" : (s = s.toExponential()).slice(0, s.indexOf("e") + 1)) + e);
  } else {
    r = new Big2(s + "");
  }
  e = r.e + (Big2.DP += 4);
  do {
    t = r;
    r = half.times(t.plus(x.div(t)));
  } while (t.c.slice(0, e).join("") !== r.c.slice(0, e).join(""));
  return round2(r, (Big2.DP -= 4) + r.e + 1, Big2.RM);
};
P2.times = P2.mul = function(y) {
  var c, x = this, Big2 = x.constructor, xc = x.c, yc = (y = new Big2(y)).c, a = xc.length, b = yc.length, i = x.e, j = y.e;
  y.s = x.s == y.s ? 1 : -1;
  if (!xc[0] || !yc[0]) {
    y.c = [y.e = 0];
    return y;
  }
  y.e = i + j;
  if (a < b) {
    c = xc;
    xc = yc;
    yc = c;
    j = a;
    a = b;
    b = j;
  }
  for (c = new Array(j = a + b); j--; ) c[j] = 0;
  for (i = b; i--; ) {
    b = 0;
    for (j = a + i; j > i; ) {
      b = c[j] + yc[i] * xc[j - i - 1] + b;
      c[j--] = b % 10;
      b = b / 10 | 0;
    }
    c[j] = b;
  }
  if (b) ++y.e;
  else c.shift();
  for (i = c.length; !c[--i]; ) c.pop();
  y.c = c;
  return y;
};
P2.toExponential = function(dp, rm) {
  var x = this, n = x.c[0];
  if (dp !== UNDEFINED) {
    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    x = round2(new x.constructor(x), ++dp, rm);
    for (; x.c.length < dp; ) x.c.push(0);
  }
  return stringify(x, true, !!n);
};
P2.toFixed = function(dp, rm) {
  var x = this, n = x.c[0];
  if (dp !== UNDEFINED) {
    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    x = round2(new x.constructor(x), dp + x.e + 1, rm);
    for (dp = dp + x.e + 1; x.c.length < dp; ) x.c.push(0);
  }
  return stringify(x, false, !!n);
};
P2[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")] = P2.toJSON = P2.toString = function() {
  var x = this, Big2 = x.constructor;
  return stringify(x, x.e <= Big2.NE || x.e >= Big2.PE, !!x.c[0]);
};
P2.toNumber = function() {
  var n = +stringify(this, true, true);
  if (this.constructor.strict === true && !this.eq(n.toString())) {
    throw Error(NAME + "Imprecise conversion");
  }
  return n;
};
P2.toPrecision = function(sd, rm) {
  var x = this, Big2 = x.constructor, n = x.c[0];
  if (sd !== UNDEFINED) {
    if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
      throw Error(INVALID + "precision");
    }
    x = round2(new Big2(x), sd, rm);
    for (; x.c.length < sd; ) x.c.push(0);
  }
  return stringify(x, sd <= x.e || x.e <= Big2.NE || x.e >= Big2.PE, !!n);
};
P2.valueOf = function() {
  var x = this, Big2 = x.constructor;
  if (Big2.strict === true) {
    throw Error(NAME + "valueOf disallowed");
  }
  return stringify(x, x.e <= Big2.NE || x.e >= Big2.PE, true);
};
var Big = _Big_();
var big_default = Big;

// node_modules/@msgpack/msgpack/dist.esm/index.mjs
var dist_exports = {};
__export(dist_exports, {
  DecodeError: () => DecodeError,
  Decoder: () => Decoder,
  EXT_TIMESTAMP: () => EXT_TIMESTAMP,
  Encoder: () => Encoder,
  ExtData: () => ExtData,
  ExtensionCodec: () => ExtensionCodec,
  decode: () => decode,
  decodeArrayStream: () => decodeArrayStream,
  decodeAsync: () => decodeAsync,
  decodeMulti: () => decodeMulti,
  decodeMultiStream: () => decodeMultiStream,
  decodeTimestampExtension: () => decodeTimestampExtension,
  decodeTimestampToTimeSpec: () => decodeTimestampToTimeSpec,
  encode: () => encode,
  encodeDateToTimeSpec: () => encodeDateToTimeSpec,
  encodeTimeSpecToTimestamp: () => encodeTimeSpecToTimestamp,
  encodeTimestampExtension: () => encodeTimestampExtension
});

// node_modules/@msgpack/msgpack/dist.esm/utils/utf8.mjs
function utf8Count(str) {
  const strLength = str.length;
  let byteLength = 0;
  let pos = 0;
  while (pos < strLength) {
    let value = str.charCodeAt(pos++);
    if ((value & 4294967168) === 0) {
      byteLength++;
      continue;
    } else if ((value & 4294965248) === 0) {
      byteLength += 2;
    } else {
      if (value >= 55296 && value <= 56319) {
        if (pos < strLength) {
          const extra = str.charCodeAt(pos);
          if ((extra & 64512) === 56320) {
            ++pos;
            value = ((value & 1023) << 10) + (extra & 1023) + 65536;
          }
        }
      }
      if ((value & 4294901760) === 0) {
        byteLength += 3;
      } else {
        byteLength += 4;
      }
    }
  }
  return byteLength;
}
function utf8EncodeJs(str, output, outputOffset) {
  const strLength = str.length;
  let offset = outputOffset;
  let pos = 0;
  while (pos < strLength) {
    let value = str.charCodeAt(pos++);
    if ((value & 4294967168) === 0) {
      output[offset++] = value;
      continue;
    } else if ((value & 4294965248) === 0) {
      output[offset++] = value >> 6 & 31 | 192;
    } else {
      if (value >= 55296 && value <= 56319) {
        if (pos < strLength) {
          const extra = str.charCodeAt(pos);
          if ((extra & 64512) === 56320) {
            ++pos;
            value = ((value & 1023) << 10) + (extra & 1023) + 65536;
          }
        }
      }
      if ((value & 4294901760) === 0) {
        output[offset++] = value >> 12 & 15 | 224;
        output[offset++] = value >> 6 & 63 | 128;
      } else {
        output[offset++] = value >> 18 & 7 | 240;
        output[offset++] = value >> 12 & 63 | 128;
        output[offset++] = value >> 6 & 63 | 128;
      }
    }
    output[offset++] = value & 63 | 128;
  }
}
var sharedTextEncoder = new TextEncoder();
var TEXT_ENCODER_THRESHOLD = 50;
function utf8EncodeTE(str, output, outputOffset) {
  sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}
function utf8Encode(str, output, outputOffset) {
  if (str.length > TEXT_ENCODER_THRESHOLD) {
    utf8EncodeTE(str, output, outputOffset);
  } else {
    utf8EncodeJs(str, output, outputOffset);
  }
}
var CHUNK_SIZE = 4096;
function utf8DecodeJs(bytes, inputOffset, byteLength) {
  let offset = inputOffset;
  const end = offset + byteLength;
  const units = [];
  let result = "";
  while (offset < end) {
    const byte1 = bytes[offset++];
    if ((byte1 & 128) === 0) {
      units.push(byte1);
    } else if ((byte1 & 224) === 192) {
      const byte2 = bytes[offset++] & 63;
      units.push((byte1 & 31) << 6 | byte2);
    } else if ((byte1 & 240) === 224) {
      const byte2 = bytes[offset++] & 63;
      const byte3 = bytes[offset++] & 63;
      units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
    } else if ((byte1 & 248) === 240) {
      const byte2 = bytes[offset++] & 63;
      const byte3 = bytes[offset++] & 63;
      const byte4 = bytes[offset++] & 63;
      let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
      if (unit > 65535) {
        unit -= 65536;
        units.push(unit >>> 10 & 1023 | 55296);
        unit = 56320 | unit & 1023;
      }
      units.push(unit);
    } else {
      units.push(byte1);
    }
    if (units.length >= CHUNK_SIZE) {
      result += String.fromCharCode(...units);
      units.length = 0;
    }
  }
  if (units.length > 0) {
    result += String.fromCharCode(...units);
  }
  return result;
}
var sharedTextDecoder = new TextDecoder();
var TEXT_DECODER_THRESHOLD = 200;
function utf8DecodeTD(bytes, inputOffset, byteLength) {
  const stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
  return sharedTextDecoder.decode(stringBytes);
}
function utf8Decode(bytes, inputOffset, byteLength) {
  if (byteLength > TEXT_DECODER_THRESHOLD) {
    return utf8DecodeTD(bytes, inputOffset, byteLength);
  } else {
    return utf8DecodeJs(bytes, inputOffset, byteLength);
  }
}

// node_modules/@msgpack/msgpack/dist.esm/ExtData.mjs
var ExtData = class {
  type;
  data;
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
};

// node_modules/@msgpack/msgpack/dist.esm/DecodeError.mjs
var DecodeError = class _DecodeError extends Error {
  constructor(message) {
    super(message);
    const proto = Object.create(_DecodeError.prototype);
    Object.setPrototypeOf(this, proto);
    Object.defineProperty(this, "name", {
      configurable: true,
      enumerable: false,
      value: _DecodeError.name
    });
  }
};

// node_modules/@msgpack/msgpack/dist.esm/utils/int.mjs
var UINT32_MAX = 4294967295;
function setUint64(view, offset, value) {
  const high = value / 4294967296;
  const low = value;
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}
function setInt64(view, offset, value) {
  const high = Math.floor(value / 4294967296);
  const low = value;
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}
function getInt64(view, offset) {
  const high = view.getInt32(offset);
  const low = view.getUint32(offset + 4);
  return high * 4294967296 + low;
}
function getUint64(view, offset) {
  const high = view.getUint32(offset);
  const low = view.getUint32(offset + 4);
  return high * 4294967296 + low;
}

// node_modules/@msgpack/msgpack/dist.esm/timestamp.mjs
var EXT_TIMESTAMP = -1;
var TIMESTAMP32_MAX_SEC = 4294967296 - 1;
var TIMESTAMP64_MAX_SEC = 17179869184 - 1;
function encodeTimeSpecToTimestamp({ sec, nsec }) {
  if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
    if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
      const rv = new Uint8Array(4);
      const view = new DataView(rv.buffer);
      view.setUint32(0, sec);
      return rv;
    } else {
      const secHigh = sec / 4294967296;
      const secLow = sec & 4294967295;
      const rv = new Uint8Array(8);
      const view = new DataView(rv.buffer);
      view.setUint32(0, nsec << 2 | secHigh & 3);
      view.setUint32(4, secLow);
      return rv;
    }
  } else {
    const rv = new Uint8Array(12);
    const view = new DataView(rv.buffer);
    view.setUint32(0, nsec);
    setInt64(view, 4, sec);
    return rv;
  }
}
function encodeDateToTimeSpec(date) {
  const msec = date.getTime();
  const sec = Math.floor(msec / 1e3);
  const nsec = (msec - sec * 1e3) * 1e6;
  const nsecInSec = Math.floor(nsec / 1e9);
  return {
    sec: sec + nsecInSec,
    nsec: nsec - nsecInSec * 1e9
  };
}
function encodeTimestampExtension(object) {
  if (object instanceof Date) {
    const timeSpec = encodeDateToTimeSpec(object);
    return encodeTimeSpecToTimestamp(timeSpec);
  } else {
    return null;
  }
}
function decodeTimestampToTimeSpec(data) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  switch (data.byteLength) {
    case 4: {
      const sec = view.getUint32(0);
      const nsec = 0;
      return { sec, nsec };
    }
    case 8: {
      const nsec30AndSecHigh2 = view.getUint32(0);
      const secLow32 = view.getUint32(4);
      const sec = (nsec30AndSecHigh2 & 3) * 4294967296 + secLow32;
      const nsec = nsec30AndSecHigh2 >>> 2;
      return { sec, nsec };
    }
    case 12: {
      const sec = getInt64(view, 4);
      const nsec = view.getUint32(0);
      return { sec, nsec };
    }
    default:
      throw new DecodeError(`Unrecognized data size for timestamp (expected 4, 8, or 12): ${data.length}`);
  }
}
function decodeTimestampExtension(data) {
  const timeSpec = decodeTimestampToTimeSpec(data);
  return new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
}
var timestampExtension = {
  type: EXT_TIMESTAMP,
  encode: encodeTimestampExtension,
  decode: decodeTimestampExtension
};

// node_modules/@msgpack/msgpack/dist.esm/ExtensionCodec.mjs
var ExtensionCodec = class _ExtensionCodec {
  static defaultCodec = new _ExtensionCodec();
  // ensures ExtensionCodecType<X> matches ExtensionCodec<X>
  // this will make type errors a lot more clear
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __brand;
  // built-in extensions
  builtInEncoders = [];
  builtInDecoders = [];
  // custom extensions
  encoders = [];
  decoders = [];
  constructor() {
    this.register(timestampExtension);
  }
  register({ type, encode: encode2, decode: decode2 }) {
    if (type >= 0) {
      this.encoders[type] = encode2;
      this.decoders[type] = decode2;
    } else {
      const index = -1 - type;
      this.builtInEncoders[index] = encode2;
      this.builtInDecoders[index] = decode2;
    }
  }
  tryToEncode(object, context) {
    for (let i = 0; i < this.builtInEncoders.length; i++) {
      const encodeExt = this.builtInEncoders[i];
      if (encodeExt != null) {
        const data = encodeExt(object, context);
        if (data != null) {
          const type = -1 - i;
          return new ExtData(type, data);
        }
      }
    }
    for (let i = 0; i < this.encoders.length; i++) {
      const encodeExt = this.encoders[i];
      if (encodeExt != null) {
        const data = encodeExt(object, context);
        if (data != null) {
          const type = i;
          return new ExtData(type, data);
        }
      }
    }
    if (object instanceof ExtData) {
      return object;
    }
    return null;
  }
  decode(data, type, context) {
    const decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
    if (decodeExt) {
      return decodeExt(data, type, context);
    } else {
      return new ExtData(type, data);
    }
  }
};

// node_modules/@msgpack/msgpack/dist.esm/utils/typedArrays.mjs
function isArrayBufferLike(buffer) {
  return buffer instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && buffer instanceof SharedArrayBuffer;
}
function ensureUint8Array(buffer) {
  if (buffer instanceof Uint8Array) {
    return buffer;
  } else if (ArrayBuffer.isView(buffer)) {
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  } else if (isArrayBufferLike(buffer)) {
    return new Uint8Array(buffer);
  } else {
    return Uint8Array.from(buffer);
  }
}

// node_modules/@msgpack/msgpack/dist.esm/Encoder.mjs
var DEFAULT_MAX_DEPTH = 100;
var DEFAULT_INITIAL_BUFFER_SIZE = 2048;
var Encoder = class _Encoder {
  extensionCodec;
  context;
  useBigInt64;
  maxDepth;
  initialBufferSize;
  sortKeys;
  forceFloat32;
  ignoreUndefined;
  forceIntegerToFloat;
  pos;
  view;
  bytes;
  entered = false;
  constructor(options) {
    this.extensionCodec = options?.extensionCodec ?? ExtensionCodec.defaultCodec;
    this.context = options?.context;
    this.useBigInt64 = options?.useBigInt64 ?? false;
    this.maxDepth = options?.maxDepth ?? DEFAULT_MAX_DEPTH;
    this.initialBufferSize = options?.initialBufferSize ?? DEFAULT_INITIAL_BUFFER_SIZE;
    this.sortKeys = options?.sortKeys ?? false;
    this.forceFloat32 = options?.forceFloat32 ?? false;
    this.ignoreUndefined = options?.ignoreUndefined ?? false;
    this.forceIntegerToFloat = options?.forceIntegerToFloat ?? false;
    this.pos = 0;
    this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
    this.bytes = new Uint8Array(this.view.buffer);
  }
  clone() {
    return new _Encoder({
      extensionCodec: this.extensionCodec,
      context: this.context,
      useBigInt64: this.useBigInt64,
      maxDepth: this.maxDepth,
      initialBufferSize: this.initialBufferSize,
      sortKeys: this.sortKeys,
      forceFloat32: this.forceFloat32,
      ignoreUndefined: this.ignoreUndefined,
      forceIntegerToFloat: this.forceIntegerToFloat
    });
  }
  reinitializeState() {
    this.pos = 0;
  }
  /**
   * This is almost equivalent to {@link Encoder#encode}, but it returns an reference of the encoder's internal buffer and thus much faster than {@link Encoder#encode}.
   *
   * @returns Encodes the object and returns a shared reference the encoder's internal buffer.
   */
  encodeSharedRef(object) {
    if (this.entered) {
      const instance = this.clone();
      return instance.encodeSharedRef(object);
    }
    try {
      this.entered = true;
      this.reinitializeState();
      this.doEncode(object, 1);
      return this.bytes.subarray(0, this.pos);
    } finally {
      this.entered = false;
    }
  }
  /**
   * @returns Encodes the object and returns a copy of the encoder's internal buffer.
   */
  encode(object) {
    if (this.entered) {
      const instance = this.clone();
      return instance.encode(object);
    }
    try {
      this.entered = true;
      this.reinitializeState();
      this.doEncode(object, 1);
      return this.bytes.slice(0, this.pos);
    } finally {
      this.entered = false;
    }
  }
  doEncode(object, depth) {
    if (depth > this.maxDepth) {
      throw new Error(`Too deep objects in depth ${depth}`);
    }
    if (object == null) {
      this.encodeNil();
    } else if (typeof object === "boolean") {
      this.encodeBoolean(object);
    } else if (typeof object === "number") {
      if (!this.forceIntegerToFloat) {
        this.encodeNumber(object);
      } else {
        this.encodeNumberAsFloat(object);
      }
    } else if (typeof object === "string") {
      this.encodeString(object);
    } else if (this.useBigInt64 && typeof object === "bigint") {
      this.encodeBigInt64(object);
    } else {
      this.encodeObject(object, depth);
    }
  }
  ensureBufferSizeToWrite(sizeToWrite) {
    const requiredSize = this.pos + sizeToWrite;
    if (this.view.byteLength < requiredSize) {
      this.resizeBuffer(requiredSize * 2);
    }
  }
  resizeBuffer(newSize) {
    const newBuffer = new ArrayBuffer(newSize);
    const newBytes = new Uint8Array(newBuffer);
    const newView = new DataView(newBuffer);
    newBytes.set(this.bytes);
    this.view = newView;
    this.bytes = newBytes;
  }
  encodeNil() {
    this.writeU8(192);
  }
  encodeBoolean(object) {
    if (object === false) {
      this.writeU8(194);
    } else {
      this.writeU8(195);
    }
  }
  encodeNumber(object) {
    if (!this.forceIntegerToFloat && Number.isSafeInteger(object)) {
      if (object >= 0) {
        if (object < 128) {
          this.writeU8(object);
        } else if (object < 256) {
          this.writeU8(204);
          this.writeU8(object);
        } else if (object < 65536) {
          this.writeU8(205);
          this.writeU16(object);
        } else if (object < 4294967296) {
          this.writeU8(206);
          this.writeU32(object);
        } else if (!this.useBigInt64) {
          this.writeU8(207);
          this.writeU64(object);
        } else {
          this.encodeNumberAsFloat(object);
        }
      } else {
        if (object >= -32) {
          this.writeU8(224 | object + 32);
        } else if (object >= -128) {
          this.writeU8(208);
          this.writeI8(object);
        } else if (object >= -32768) {
          this.writeU8(209);
          this.writeI16(object);
        } else if (object >= -2147483648) {
          this.writeU8(210);
          this.writeI32(object);
        } else if (!this.useBigInt64) {
          this.writeU8(211);
          this.writeI64(object);
        } else {
          this.encodeNumberAsFloat(object);
        }
      }
    } else {
      this.encodeNumberAsFloat(object);
    }
  }
  encodeNumberAsFloat(object) {
    if (this.forceFloat32) {
      this.writeU8(202);
      this.writeF32(object);
    } else {
      this.writeU8(203);
      this.writeF64(object);
    }
  }
  encodeBigInt64(object) {
    if (object >= BigInt(0)) {
      this.writeU8(207);
      this.writeBigUint64(object);
    } else {
      this.writeU8(211);
      this.writeBigInt64(object);
    }
  }
  writeStringHeader(byteLength) {
    if (byteLength < 32) {
      this.writeU8(160 + byteLength);
    } else if (byteLength < 256) {
      this.writeU8(217);
      this.writeU8(byteLength);
    } else if (byteLength < 65536) {
      this.writeU8(218);
      this.writeU16(byteLength);
    } else if (byteLength < 4294967296) {
      this.writeU8(219);
      this.writeU32(byteLength);
    } else {
      throw new Error(`Too long string: ${byteLength} bytes in UTF-8`);
    }
  }
  encodeString(object) {
    const maxHeaderSize = 1 + 4;
    const byteLength = utf8Count(object);
    this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
    this.writeStringHeader(byteLength);
    utf8Encode(object, this.bytes, this.pos);
    this.pos += byteLength;
  }
  encodeObject(object, depth) {
    const ext = this.extensionCodec.tryToEncode(object, this.context);
    if (ext != null) {
      this.encodeExtension(ext);
    } else if (Array.isArray(object)) {
      this.encodeArray(object, depth);
    } else if (ArrayBuffer.isView(object)) {
      this.encodeBinary(object);
    } else if (typeof object === "object") {
      this.encodeMap(object, depth);
    } else {
      throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(object)}`);
    }
  }
  encodeBinary(object) {
    const size = object.byteLength;
    if (size < 256) {
      this.writeU8(196);
      this.writeU8(size);
    } else if (size < 65536) {
      this.writeU8(197);
      this.writeU16(size);
    } else if (size < 4294967296) {
      this.writeU8(198);
      this.writeU32(size);
    } else {
      throw new Error(`Too large binary: ${size}`);
    }
    const bytes = ensureUint8Array(object);
    this.writeU8a(bytes);
  }
  encodeArray(object, depth) {
    const size = object.length;
    if (size < 16) {
      this.writeU8(144 + size);
    } else if (size < 65536) {
      this.writeU8(220);
      this.writeU16(size);
    } else if (size < 4294967296) {
      this.writeU8(221);
      this.writeU32(size);
    } else {
      throw new Error(`Too large array: ${size}`);
    }
    for (const item of object) {
      this.doEncode(item, depth + 1);
    }
  }
  countWithoutUndefined(object, keys) {
    let count = 0;
    for (const key of keys) {
      if (object[key] !== void 0) {
        count++;
      }
    }
    return count;
  }
  encodeMap(object, depth) {
    const keys = Object.keys(object);
    if (this.sortKeys) {
      keys.sort();
    }
    const size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;
    if (size < 16) {
      this.writeU8(128 + size);
    } else if (size < 65536) {
      this.writeU8(222);
      this.writeU16(size);
    } else if (size < 4294967296) {
      this.writeU8(223);
      this.writeU32(size);
    } else {
      throw new Error(`Too large map object: ${size}`);
    }
    for (const key of keys) {
      const value = object[key];
      if (!(this.ignoreUndefined && value === void 0)) {
        this.encodeString(key);
        this.doEncode(value, depth + 1);
      }
    }
  }
  encodeExtension(ext) {
    if (typeof ext.data === "function") {
      const data = ext.data(this.pos + 6);
      const size2 = data.length;
      if (size2 >= 4294967296) {
        throw new Error(`Too large extension object: ${size2}`);
      }
      this.writeU8(201);
      this.writeU32(size2);
      this.writeI8(ext.type);
      this.writeU8a(data);
      return;
    }
    const size = ext.data.length;
    if (size === 1) {
      this.writeU8(212);
    } else if (size === 2) {
      this.writeU8(213);
    } else if (size === 4) {
      this.writeU8(214);
    } else if (size === 8) {
      this.writeU8(215);
    } else if (size === 16) {
      this.writeU8(216);
    } else if (size < 256) {
      this.writeU8(199);
      this.writeU8(size);
    } else if (size < 65536) {
      this.writeU8(200);
      this.writeU16(size);
    } else if (size < 4294967296) {
      this.writeU8(201);
      this.writeU32(size);
    } else {
      throw new Error(`Too large extension object: ${size}`);
    }
    this.writeI8(ext.type);
    this.writeU8a(ext.data);
  }
  writeU8(value) {
    this.ensureBufferSizeToWrite(1);
    this.view.setUint8(this.pos, value);
    this.pos++;
  }
  writeU8a(values) {
    const size = values.length;
    this.ensureBufferSizeToWrite(size);
    this.bytes.set(values, this.pos);
    this.pos += size;
  }
  writeI8(value) {
    this.ensureBufferSizeToWrite(1);
    this.view.setInt8(this.pos, value);
    this.pos++;
  }
  writeU16(value) {
    this.ensureBufferSizeToWrite(2);
    this.view.setUint16(this.pos, value);
    this.pos += 2;
  }
  writeI16(value) {
    this.ensureBufferSizeToWrite(2);
    this.view.setInt16(this.pos, value);
    this.pos += 2;
  }
  writeU32(value) {
    this.ensureBufferSizeToWrite(4);
    this.view.setUint32(this.pos, value);
    this.pos += 4;
  }
  writeI32(value) {
    this.ensureBufferSizeToWrite(4);
    this.view.setInt32(this.pos, value);
    this.pos += 4;
  }
  writeF32(value) {
    this.ensureBufferSizeToWrite(4);
    this.view.setFloat32(this.pos, value);
    this.pos += 4;
  }
  writeF64(value) {
    this.ensureBufferSizeToWrite(8);
    this.view.setFloat64(this.pos, value);
    this.pos += 8;
  }
  writeU64(value) {
    this.ensureBufferSizeToWrite(8);
    setUint64(this.view, this.pos, value);
    this.pos += 8;
  }
  writeI64(value) {
    this.ensureBufferSizeToWrite(8);
    setInt64(this.view, this.pos, value);
    this.pos += 8;
  }
  writeBigUint64(value) {
    this.ensureBufferSizeToWrite(8);
    this.view.setBigUint64(this.pos, value);
    this.pos += 8;
  }
  writeBigInt64(value) {
    this.ensureBufferSizeToWrite(8);
    this.view.setBigInt64(this.pos, value);
    this.pos += 8;
  }
};

// node_modules/@msgpack/msgpack/dist.esm/encode.mjs
function encode(value, options) {
  const encoder = new Encoder(options);
  return encoder.encodeSharedRef(value);
}

// node_modules/@msgpack/msgpack/dist.esm/utils/prettyByte.mjs
function prettyByte(byte) {
  return `${byte < 0 ? "-" : ""}0x${Math.abs(byte).toString(16).padStart(2, "0")}`;
}

// node_modules/@msgpack/msgpack/dist.esm/CachedKeyDecoder.mjs
var DEFAULT_MAX_KEY_LENGTH = 16;
var DEFAULT_MAX_LENGTH_PER_KEY = 16;
var CachedKeyDecoder = class {
  hit = 0;
  miss = 0;
  caches;
  maxKeyLength;
  maxLengthPerKey;
  constructor(maxKeyLength = DEFAULT_MAX_KEY_LENGTH, maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY) {
    this.maxKeyLength = maxKeyLength;
    this.maxLengthPerKey = maxLengthPerKey;
    this.caches = [];
    for (let i = 0; i < this.maxKeyLength; i++) {
      this.caches.push([]);
    }
  }
  canBeCached(byteLength) {
    return byteLength > 0 && byteLength <= this.maxKeyLength;
  }
  find(bytes, inputOffset, byteLength) {
    const records = this.caches[byteLength - 1];
    FIND_CHUNK: for (const record2 of records) {
      const recordBytes = record2.bytes;
      for (let j = 0; j < byteLength; j++) {
        if (recordBytes[j] !== bytes[inputOffset + j]) {
          continue FIND_CHUNK;
        }
      }
      return record2.str;
    }
    return null;
  }
  store(bytes, value) {
    const records = this.caches[bytes.length - 1];
    const record2 = { bytes, str: value };
    if (records.length >= this.maxLengthPerKey) {
      records[Math.random() * records.length | 0] = record2;
    } else {
      records.push(record2);
    }
  }
  decode(bytes, inputOffset, byteLength) {
    const cachedValue = this.find(bytes, inputOffset, byteLength);
    if (cachedValue != null) {
      this.hit++;
      return cachedValue;
    }
    this.miss++;
    const str = utf8DecodeJs(bytes, inputOffset, byteLength);
    const slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
    this.store(slicedCopyOfBytes, str);
    return str;
  }
};

// node_modules/@msgpack/msgpack/dist.esm/Decoder.mjs
var STATE_ARRAY = "array";
var STATE_MAP_KEY = "map_key";
var STATE_MAP_VALUE = "map_value";
var mapKeyConverter = (key) => {
  if (typeof key === "string" || typeof key === "number") {
    return key;
  }
  throw new DecodeError("The type of key must be string or number but " + typeof key);
};
var StackPool = class {
  stack = [];
  stackHeadPosition = -1;
  get length() {
    return this.stackHeadPosition + 1;
  }
  top() {
    return this.stack[this.stackHeadPosition];
  }
  pushArrayState(size) {
    const state = this.getUninitializedStateFromPool();
    state.type = STATE_ARRAY;
    state.position = 0;
    state.size = size;
    state.array = new Array(size);
  }
  pushMapState(size) {
    const state = this.getUninitializedStateFromPool();
    state.type = STATE_MAP_KEY;
    state.readCount = 0;
    state.size = size;
    state.map = {};
  }
  getUninitializedStateFromPool() {
    this.stackHeadPosition++;
    if (this.stackHeadPosition === this.stack.length) {
      const partialState = {
        type: void 0,
        size: 0,
        array: void 0,
        position: 0,
        readCount: 0,
        map: void 0,
        key: null
      };
      this.stack.push(partialState);
    }
    return this.stack[this.stackHeadPosition];
  }
  release(state) {
    const topStackState = this.stack[this.stackHeadPosition];
    if (topStackState !== state) {
      throw new Error("Invalid stack state. Released state is not on top of the stack.");
    }
    if (state.type === STATE_ARRAY) {
      const partialState = state;
      partialState.size = 0;
      partialState.array = void 0;
      partialState.position = 0;
      partialState.type = void 0;
    }
    if (state.type === STATE_MAP_KEY || state.type === STATE_MAP_VALUE) {
      const partialState = state;
      partialState.size = 0;
      partialState.map = void 0;
      partialState.readCount = 0;
      partialState.type = void 0;
    }
    this.stackHeadPosition--;
  }
  reset() {
    this.stack.length = 0;
    this.stackHeadPosition = -1;
  }
};
var HEAD_BYTE_REQUIRED = -1;
var EMPTY_VIEW = new DataView(new ArrayBuffer(0));
var EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
try {
  EMPTY_VIEW.getInt8(0);
} catch (e) {
  if (!(e instanceof RangeError)) {
    throw new Error("This module is not supported in the current JavaScript engine because DataView does not throw RangeError on out-of-bounds access");
  }
}
var MORE_DATA = new RangeError("Insufficient data");
var sharedCachedKeyDecoder = new CachedKeyDecoder();
var Decoder = class _Decoder {
  extensionCodec;
  context;
  useBigInt64;
  rawStrings;
  maxStrLength;
  maxBinLength;
  maxArrayLength;
  maxMapLength;
  maxExtLength;
  keyDecoder;
  mapKeyConverter;
  totalPos = 0;
  pos = 0;
  view = EMPTY_VIEW;
  bytes = EMPTY_BYTES;
  headByte = HEAD_BYTE_REQUIRED;
  stack = new StackPool();
  entered = false;
  constructor(options) {
    this.extensionCodec = options?.extensionCodec ?? ExtensionCodec.defaultCodec;
    this.context = options?.context;
    this.useBigInt64 = options?.useBigInt64 ?? false;
    this.rawStrings = options?.rawStrings ?? false;
    this.maxStrLength = options?.maxStrLength ?? UINT32_MAX;
    this.maxBinLength = options?.maxBinLength ?? UINT32_MAX;
    this.maxArrayLength = options?.maxArrayLength ?? UINT32_MAX;
    this.maxMapLength = options?.maxMapLength ?? UINT32_MAX;
    this.maxExtLength = options?.maxExtLength ?? UINT32_MAX;
    this.keyDecoder = options?.keyDecoder !== void 0 ? options.keyDecoder : sharedCachedKeyDecoder;
    this.mapKeyConverter = options?.mapKeyConverter ?? mapKeyConverter;
  }
  clone() {
    return new _Decoder({
      extensionCodec: this.extensionCodec,
      context: this.context,
      useBigInt64: this.useBigInt64,
      rawStrings: this.rawStrings,
      maxStrLength: this.maxStrLength,
      maxBinLength: this.maxBinLength,
      maxArrayLength: this.maxArrayLength,
      maxMapLength: this.maxMapLength,
      maxExtLength: this.maxExtLength,
      keyDecoder: this.keyDecoder
    });
  }
  reinitializeState() {
    this.totalPos = 0;
    this.headByte = HEAD_BYTE_REQUIRED;
    this.stack.reset();
  }
  setBuffer(buffer) {
    const bytes = ensureUint8Array(buffer);
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    this.pos = 0;
  }
  appendBuffer(buffer) {
    if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) {
      this.setBuffer(buffer);
    } else {
      const remainingData = this.bytes.subarray(this.pos);
      const newData = ensureUint8Array(buffer);
      const newBuffer = new Uint8Array(remainingData.length + newData.length);
      newBuffer.set(remainingData);
      newBuffer.set(newData, remainingData.length);
      this.setBuffer(newBuffer);
    }
  }
  hasRemaining(size) {
    return this.view.byteLength - this.pos >= size;
  }
  createExtraByteError(posToShow) {
    const { view, pos } = this;
    return new RangeError(`Extra ${view.byteLength - pos} of ${view.byteLength} byte(s) found at buffer[${posToShow}]`);
  }
  /**
   * @throws {@link DecodeError}
   * @throws {@link RangeError}
   */
  decode(buffer) {
    if (this.entered) {
      const instance = this.clone();
      return instance.decode(buffer);
    }
    try {
      this.entered = true;
      this.reinitializeState();
      this.setBuffer(buffer);
      const object = this.doDecodeSync();
      if (this.hasRemaining(1)) {
        throw this.createExtraByteError(this.pos);
      }
      return object;
    } finally {
      this.entered = false;
    }
  }
  *decodeMulti(buffer) {
    if (this.entered) {
      const instance = this.clone();
      yield* instance.decodeMulti(buffer);
      return;
    }
    try {
      this.entered = true;
      this.reinitializeState();
      this.setBuffer(buffer);
      while (this.hasRemaining(1)) {
        yield this.doDecodeSync();
      }
    } finally {
      this.entered = false;
    }
  }
  async decodeAsync(stream) {
    if (this.entered) {
      const instance = this.clone();
      return instance.decodeAsync(stream);
    }
    try {
      this.entered = true;
      let decoded = false;
      let object;
      for await (const buffer of stream) {
        if (decoded) {
          this.entered = false;
          throw this.createExtraByteError(this.totalPos);
        }
        this.appendBuffer(buffer);
        try {
          object = this.doDecodeSync();
          decoded = true;
        } catch (e) {
          if (!(e instanceof RangeError)) {
            throw e;
          }
        }
        this.totalPos += this.pos;
      }
      if (decoded) {
        if (this.hasRemaining(1)) {
          throw this.createExtraByteError(this.totalPos);
        }
        return object;
      }
      const { headByte, pos, totalPos } = this;
      throw new RangeError(`Insufficient data in parsing ${prettyByte(headByte)} at ${totalPos} (${pos} in the current buffer)`);
    } finally {
      this.entered = false;
    }
  }
  decodeArrayStream(stream) {
    return this.decodeMultiAsync(stream, true);
  }
  decodeStream(stream) {
    return this.decodeMultiAsync(stream, false);
  }
  async *decodeMultiAsync(stream, isArray) {
    if (this.entered) {
      const instance = this.clone();
      yield* instance.decodeMultiAsync(stream, isArray);
      return;
    }
    try {
      this.entered = true;
      let isArrayHeaderRequired = isArray;
      let arrayItemsLeft = -1;
      for await (const buffer of stream) {
        if (isArray && arrayItemsLeft === 0) {
          throw this.createExtraByteError(this.totalPos);
        }
        this.appendBuffer(buffer);
        if (isArrayHeaderRequired) {
          arrayItemsLeft = this.readArraySize();
          isArrayHeaderRequired = false;
          this.complete();
        }
        try {
          while (true) {
            yield this.doDecodeSync();
            if (--arrayItemsLeft === 0) {
              break;
            }
          }
        } catch (e) {
          if (!(e instanceof RangeError)) {
            throw e;
          }
        }
        this.totalPos += this.pos;
      }
    } finally {
      this.entered = false;
    }
  }
  doDecodeSync() {
    DECODE: while (true) {
      const headByte = this.readHeadByte();
      let object;
      if (headByte >= 224) {
        object = headByte - 256;
      } else if (headByte < 192) {
        if (headByte < 128) {
          object = headByte;
        } else if (headByte < 144) {
          const size = headByte - 128;
          if (size !== 0) {
            this.pushMapState(size);
            this.complete();
            continue DECODE;
          } else {
            object = {};
          }
        } else if (headByte < 160) {
          const size = headByte - 144;
          if (size !== 0) {
            this.pushArrayState(size);
            this.complete();
            continue DECODE;
          } else {
            object = [];
          }
        } else {
          const byteLength = headByte - 160;
          object = this.decodeString(byteLength, 0);
        }
      } else if (headByte === 192) {
        object = null;
      } else if (headByte === 194) {
        object = false;
      } else if (headByte === 195) {
        object = true;
      } else if (headByte === 202) {
        object = this.readF32();
      } else if (headByte === 203) {
        object = this.readF64();
      } else if (headByte === 204) {
        object = this.readU8();
      } else if (headByte === 205) {
        object = this.readU16();
      } else if (headByte === 206) {
        object = this.readU32();
      } else if (headByte === 207) {
        if (this.useBigInt64) {
          object = this.readU64AsBigInt();
        } else {
          object = this.readU64();
        }
      } else if (headByte === 208) {
        object = this.readI8();
      } else if (headByte === 209) {
        object = this.readI16();
      } else if (headByte === 210) {
        object = this.readI32();
      } else if (headByte === 211) {
        if (this.useBigInt64) {
          object = this.readI64AsBigInt();
        } else {
          object = this.readI64();
        }
      } else if (headByte === 217) {
        const byteLength = this.lookU8();
        object = this.decodeString(byteLength, 1);
      } else if (headByte === 218) {
        const byteLength = this.lookU16();
        object = this.decodeString(byteLength, 2);
      } else if (headByte === 219) {
        const byteLength = this.lookU32();
        object = this.decodeString(byteLength, 4);
      } else if (headByte === 220) {
        const size = this.readU16();
        if (size !== 0) {
          this.pushArrayState(size);
          this.complete();
          continue DECODE;
        } else {
          object = [];
        }
      } else if (headByte === 221) {
        const size = this.readU32();
        if (size !== 0) {
          this.pushArrayState(size);
          this.complete();
          continue DECODE;
        } else {
          object = [];
        }
      } else if (headByte === 222) {
        const size = this.readU16();
        if (size !== 0) {
          this.pushMapState(size);
          this.complete();
          continue DECODE;
        } else {
          object = {};
        }
      } else if (headByte === 223) {
        const size = this.readU32();
        if (size !== 0) {
          this.pushMapState(size);
          this.complete();
          continue DECODE;
        } else {
          object = {};
        }
      } else if (headByte === 196) {
        const size = this.lookU8();
        object = this.decodeBinary(size, 1);
      } else if (headByte === 197) {
        const size = this.lookU16();
        object = this.decodeBinary(size, 2);
      } else if (headByte === 198) {
        const size = this.lookU32();
        object = this.decodeBinary(size, 4);
      } else if (headByte === 212) {
        object = this.decodeExtension(1, 0);
      } else if (headByte === 213) {
        object = this.decodeExtension(2, 0);
      } else if (headByte === 214) {
        object = this.decodeExtension(4, 0);
      } else if (headByte === 215) {
        object = this.decodeExtension(8, 0);
      } else if (headByte === 216) {
        object = this.decodeExtension(16, 0);
      } else if (headByte === 199) {
        const size = this.lookU8();
        object = this.decodeExtension(size, 1);
      } else if (headByte === 200) {
        const size = this.lookU16();
        object = this.decodeExtension(size, 2);
      } else if (headByte === 201) {
        const size = this.lookU32();
        object = this.decodeExtension(size, 4);
      } else {
        throw new DecodeError(`Unrecognized type byte: ${prettyByte(headByte)}`);
      }
      this.complete();
      const stack = this.stack;
      while (stack.length > 0) {
        const state = stack.top();
        if (state.type === STATE_ARRAY) {
          state.array[state.position] = object;
          state.position++;
          if (state.position === state.size) {
            object = state.array;
            stack.release(state);
          } else {
            continue DECODE;
          }
        } else if (state.type === STATE_MAP_KEY) {
          if (object === "__proto__") {
            throw new DecodeError("The key __proto__ is not allowed");
          }
          state.key = this.mapKeyConverter(object);
          state.type = STATE_MAP_VALUE;
          continue DECODE;
        } else {
          state.map[state.key] = object;
          state.readCount++;
          if (state.readCount === state.size) {
            object = state.map;
            stack.release(state);
          } else {
            state.key = null;
            state.type = STATE_MAP_KEY;
            continue DECODE;
          }
        }
      }
      return object;
    }
  }
  readHeadByte() {
    if (this.headByte === HEAD_BYTE_REQUIRED) {
      this.headByte = this.readU8();
    }
    return this.headByte;
  }
  complete() {
    this.headByte = HEAD_BYTE_REQUIRED;
  }
  readArraySize() {
    const headByte = this.readHeadByte();
    switch (headByte) {
      case 220:
        return this.readU16();
      case 221:
        return this.readU32();
      default: {
        if (headByte < 160) {
          return headByte - 144;
        } else {
          throw new DecodeError(`Unrecognized array type byte: ${prettyByte(headByte)}`);
        }
      }
    }
  }
  pushMapState(size) {
    if (size > this.maxMapLength) {
      throw new DecodeError(`Max length exceeded: map length (${size}) > maxMapLengthLength (${this.maxMapLength})`);
    }
    this.stack.pushMapState(size);
  }
  pushArrayState(size) {
    if (size > this.maxArrayLength) {
      throw new DecodeError(`Max length exceeded: array length (${size}) > maxArrayLength (${this.maxArrayLength})`);
    }
    this.stack.pushArrayState(size);
  }
  decodeString(byteLength, headerOffset) {
    if (!this.rawStrings || this.stateIsMapKey()) {
      return this.decodeUtf8String(byteLength, headerOffset);
    }
    return this.decodeBinary(byteLength, headerOffset);
  }
  /**
   * @throws {@link RangeError}
   */
  decodeUtf8String(byteLength, headerOffset) {
    if (byteLength > this.maxStrLength) {
      throw new DecodeError(`Max length exceeded: UTF-8 byte length (${byteLength}) > maxStrLength (${this.maxStrLength})`);
    }
    if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
      throw MORE_DATA;
    }
    const offset = this.pos + headerOffset;
    let object;
    if (this.stateIsMapKey() && this.keyDecoder?.canBeCached(byteLength)) {
      object = this.keyDecoder.decode(this.bytes, offset, byteLength);
    } else {
      object = utf8Decode(this.bytes, offset, byteLength);
    }
    this.pos += headerOffset + byteLength;
    return object;
  }
  stateIsMapKey() {
    if (this.stack.length > 0) {
      const state = this.stack.top();
      return state.type === STATE_MAP_KEY;
    }
    return false;
  }
  /**
   * @throws {@link RangeError}
   */
  decodeBinary(byteLength, headOffset) {
    if (byteLength > this.maxBinLength) {
      throw new DecodeError(`Max length exceeded: bin length (${byteLength}) > maxBinLength (${this.maxBinLength})`);
    }
    if (!this.hasRemaining(byteLength + headOffset)) {
      throw MORE_DATA;
    }
    const offset = this.pos + headOffset;
    const object = this.bytes.subarray(offset, offset + byteLength);
    this.pos += headOffset + byteLength;
    return object;
  }
  decodeExtension(size, headOffset) {
    if (size > this.maxExtLength) {
      throw new DecodeError(`Max length exceeded: ext length (${size}) > maxExtLength (${this.maxExtLength})`);
    }
    const extType = this.view.getInt8(this.pos + headOffset);
    const data = this.decodeBinary(
      size,
      headOffset + 1
      /* extType */
    );
    return this.extensionCodec.decode(data, extType, this.context);
  }
  lookU8() {
    return this.view.getUint8(this.pos);
  }
  lookU16() {
    return this.view.getUint16(this.pos);
  }
  lookU32() {
    return this.view.getUint32(this.pos);
  }
  readU8() {
    const value = this.view.getUint8(this.pos);
    this.pos++;
    return value;
  }
  readI8() {
    const value = this.view.getInt8(this.pos);
    this.pos++;
    return value;
  }
  readU16() {
    const value = this.view.getUint16(this.pos);
    this.pos += 2;
    return value;
  }
  readI16() {
    const value = this.view.getInt16(this.pos);
    this.pos += 2;
    return value;
  }
  readU32() {
    const value = this.view.getUint32(this.pos);
    this.pos += 4;
    return value;
  }
  readI32() {
    const value = this.view.getInt32(this.pos);
    this.pos += 4;
    return value;
  }
  readU64() {
    const value = getUint64(this.view, this.pos);
    this.pos += 8;
    return value;
  }
  readI64() {
    const value = getInt64(this.view, this.pos);
    this.pos += 8;
    return value;
  }
  readU64AsBigInt() {
    const value = this.view.getBigUint64(this.pos);
    this.pos += 8;
    return value;
  }
  readI64AsBigInt() {
    const value = this.view.getBigInt64(this.pos);
    this.pos += 8;
    return value;
  }
  readF32() {
    const value = this.view.getFloat32(this.pos);
    this.pos += 4;
    return value;
  }
  readF64() {
    const value = this.view.getFloat64(this.pos);
    this.pos += 8;
    return value;
  }
};

// node_modules/@msgpack/msgpack/dist.esm/decode.mjs
function decode(buffer, options) {
  const decoder = new Decoder(options);
  return decoder.decode(buffer);
}
function decodeMulti(buffer, options) {
  const decoder = new Decoder(options);
  return decoder.decodeMulti(buffer);
}

// node_modules/@msgpack/msgpack/dist.esm/utils/stream.mjs
function isAsyncIterable(object) {
  return object[Symbol.asyncIterator] != null;
}
async function* asyncIterableFromStream(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
function ensureAsyncIterable(streamLike) {
  if (isAsyncIterable(streamLike)) {
    return streamLike;
  } else {
    return asyncIterableFromStream(streamLike);
  }
}

// node_modules/@msgpack/msgpack/dist.esm/decodeAsync.mjs
async function decodeAsync(streamLike, options) {
  const stream = ensureAsyncIterable(streamLike);
  const decoder = new Decoder(options);
  return decoder.decodeAsync(stream);
}
function decodeArrayStream(streamLike, options) {
  const stream = ensureAsyncIterable(streamLike);
  const decoder = new Decoder(options);
  return decoder.decodeArrayStream(stream);
}
function decodeMultiStream(streamLike, options) {
  const stream = ensureAsyncIterable(streamLike);
  const decoder = new Decoder(options);
  return decoder.decodeStream(stream);
}

// node_modules/@genrojs/tytx/js/src/platform/dependencies.js
var import_xmldom = __toESM(require_lib(), 1);
var DecimalJS = decimal_default;
var BigJS = big_default;
var msgpack = dist_exports;
var NodeDOMParser = import_xmldom.DOMParser;
var NodeXMLSerializer = import_xmldom.XMLSerializer;

// node_modules/@genrojs/tytx/js/src/msgpack.js
var HAS_MSGPACK = msgpack !== null;
function _checkMsgpack() {
  if (!HAS_MSGPACK) {
    throw new Error(
      "@msgpack/msgpack is required for MessagePack support. Install with: npm install @msgpack/msgpack"
    );
  }
}
var _extensionCodec = _buildCodec();
function _buildCodec() {
  if (!HAS_MSGPACK) {
    return null;
  }
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const codec = new msgpack.ExtensionCodec();
  codec.register({
    type: -1,
    encode: (v) => {
      if (v instanceof Date) {
        const dt = getDateType(v);
        if (dt === "D" || dt === "H") {
          return null;
        }
      }
      return msgpack.encodeTimestampExtension(v);
    },
    decode: (data) => msgpack.decodeTimestampExtension(data)
  });
  codec.register({
    type: 1,
    encode: (v) => {
      if (isDecimal2(v)) {
        return enc.encode(v.toString());
      }
      return null;
    },
    decode: (data) => createDecimal(dec.decode(data))
  });
  codec.register({
    type: 2,
    encode: (v) => {
      if (v instanceof Date && getDateType(v) === "D") {
        const y = v.getUTCFullYear();
        const m = String(v.getUTCMonth() + 1).padStart(2, "0");
        const d = String(v.getUTCDate()).padStart(2, "0");
        return enc.encode(`${y}-${m}-${d}`);
      }
      return null;
    },
    decode: (data) => /* @__PURE__ */ new Date(dec.decode(data) + "T00:00:00.000Z")
  });
  codec.register({
    type: 3,
    encode: (v) => {
      if (v instanceof Date && getDateType(v) === "H") {
        const h = String(v.getUTCHours()).padStart(2, "0");
        const m = String(v.getUTCMinutes()).padStart(2, "0");
        const s = String(v.getUTCSeconds()).padStart(2, "0");
        const ms = String(v.getUTCMilliseconds()).padStart(3, "0");
        return enc.encode(`${h}:${m}:${s}.${ms}`);
      }
      return null;
    },
    decode: (data) => {
      const str = dec.decode(data);
      const dotIdx = str.indexOf(".");
      const timePart = dotIdx >= 0 ? str.substring(0, dotIdx) : str;
      const fracStr = dotIdx >= 0 ? str.substring(dotIdx + 1) : "0";
      const [h, m, s] = timePart.split(":");
      const ms = Math.round(+fracStr.substring(0, 3));
      return new Date(Date.UTC(1970, 0, 1, +h, +m, +s, ms));
    }
  });
  codec.register({
    type: 4,
    encode: (v) => {
      const entry = getCustomTypeEntry(v);
      if (entry !== null) {
        const [suffix, serializer] = entry;
        return enc.encode(`${suffix}:${serializer(v)}`);
      }
      return null;
    },
    decode: (data) => {
      const str = dec.decode(data);
      const idx = str.indexOf(":");
      const suffix = str.slice(0, idx);
      const payload = str.slice(idx + 1);
      const entry = SUFFIX_TO_TYPE[suffix];
      if (entry !== void 0) {
        const [, deserializer] = entry;
        return deserializer(payload);
      }
      return `${payload}::${suffix}`;
    }
  });
  return codec;
}
function toMsgpack(value) {
  _checkMsgpack();
  return msgpack.encode(value, { extensionCodec: _extensionCodec });
}
function fromMsgpack(data) {
  _checkMsgpack();
  return msgpack.decode(data, { extensionCodec: _extensionCodec });
}

// node_modules/@genrojs/tytx/js/src/utils.js
function rawEncode(value, forceSuffix = false) {
  const entry = getTypeEntry(value);
  if (entry === null) {
    return [false, String(value)];
  }
  const [suffix, serializer, jsonNative] = entry;
  if (jsonNative && !forceSuffix) {
    return [false, String(value)];
  }
  return [true, `${serializer(value)}::${suffix}`];
}
function rawDecode(s) {
  if (!s.includes("::")) {
    return [false, s];
  }
  const lastIndex = s.lastIndexOf("::");
  const value = s.slice(0, lastIndex);
  const suffix = s.slice(lastIndex + 2);
  const entry = SUFFIX_TO_TYPE[suffix];
  if (entry === void 0) {
    return [false, s];
  }
  const [, decoder] = entry;
  return [true, decoder(value)];
}
function walk(data, callback, filtercb) {
  if (data !== null && typeof data === "object" && !Array.isArray(data)) {
    const result = {};
    for (const [k, v] of Object.entries(data)) {
      result[k] = walk(v, callback, filtercb);
    }
    return result;
  }
  if (Array.isArray(data)) {
    return data.map((item) => walk(item, callback, filtercb));
  }
  if (filtercb(data)) {
    return callback(data);
  }
  return data;
}

// node_modules/@genrojs/tytx/js/src/encode.js
function _preprocessValue(value) {
  const entry = getTypeEntry(value);
  if (entry !== null) {
    const [suffix, serializer, jsonNative] = entry;
    if (!jsonNative) {
      return [`${serializer(value)}::${suffix}`, true];
    }
    return [value, false];
  }
  if (Array.isArray(value)) {
    let hasSpecial = false;
    const result = value.map((item) => {
      const [processed, special] = _preprocessValue(item);
      if (special) hasSpecial = true;
      return processed;
    });
    return [result, hasSpecial];
  }
  if (value !== null && typeof value === "object") {
    let hasSpecial = false;
    const result = {};
    for (const [k, v] of Object.entries(value)) {
      const [processed, special] = _preprocessValue(v);
      if (special) hasSpecial = true;
      result[k] = processed;
    }
    return [result, hasSpecial];
  }
  return [value, false];
}
function _toJson(value, forceSuffix = false) {
  const [encoded, result] = rawEncode(value, forceSuffix);
  if (encoded) {
    return result;
  }
  const [processed, hasSpecial] = _preprocessValue(value);
  const jsonResult = JSON.stringify(processed);
  if (hasSpecial) {
    return `${jsonResult}::JS`;
  }
  return jsonResult;
}
function _toRawJson(value) {
  return JSON.stringify(value);
}
function _toRawMsgpack(value) {
  if (!msgpack) throw new Error("@msgpack/msgpack is required for MessagePack support");
  return msgpack.encode(value);
}
function toTytx(value, transport = null, { raw = false, qs = false, _forceSuffix = false } = {}) {
  if (qs) {
    return `${toQs(value)}::QS`;
  }
  if (raw) {
    if (transport === null || transport === "json") {
      return _toRawJson(value);
    } else if (transport === "msgpack") {
      return _toRawMsgpack(value);
    } else if (transport === "xml") {
      throw new Error("raw=true is not supported for XML transport");
    } else {
      throw new Error(`Unknown transport: ${transport}`);
    }
  }
  if (transport === null || transport === "json") {
    const result = _toJson(value, _forceSuffix);
    if (transport === "json") {
      return `"${result}"`;
    }
    return result;
  } else if (transport === "xml") {
    const result = toXml(value);
    return `<?xml version="1.0" ?><tytx_root>${result}</tytx_root>`;
  } else if (transport === "msgpack") {
    return toMsgpack(value);
  } else {
    throw new Error(`Unknown transport: ${transport}`);
  }
}

// node_modules/@genrojs/tytx/js/src/xml.js
var DOMParser3;
var XMLSerializer2;
if (typeof window !== "undefined" && window.DOMParser) {
  DOMParser3 = window.DOMParser;
  XMLSerializer2 = window.XMLSerializer;
} else {
  DOMParser3 = NodeDOMParser;
  XMLSerializer2 = NodeXMLSerializer;
}
function _isXmlElement(item) {
  if (item === null || typeof item !== "object" || Array.isArray(item)) {
    return false;
  }
  const keys = Object.keys(item);
  if (keys.length !== 1) {
    return false;
  }
  const itemData = item[keys[0]];
  return itemData !== null && typeof itemData === "object" && "value" in itemData;
}
function _serializeElement(doc, tag2, data) {
  const element = doc.createElement(tag2);
  const attrs = data.attrs || {};
  const value = data.value;
  for (const [attrName, attrValue] of Object.entries(attrs)) {
    element.setAttribute(attrName, toTytx(attrValue, null, { _forceSuffix: true }));
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      if (_isXmlElement(item)) {
        const [itemTag] = Object.keys(item);
        const itemData = item[itemTag];
        const childElement = _serializeElement(doc, itemTag, itemData);
        element.appendChild(childElement);
      } else {
        element.textContent = toTytx(value);
        break;
      }
    }
  } else {
    element.textContent = toTytx(value);
  }
  return element;
}
function toXml(value) {
  if (!DOMParser3) {
    throw new Error("XML support requires @xmldom/xmldom package in Node.js");
  }
  if (_isXmlElement(value)) {
    const [rootTag] = Object.keys(value);
    const rootData = value[rootTag];
    const doc = new DOMParser3().parseFromString("<root/>", "text/xml");
    const element = _serializeElement(doc, rootTag, rootData);
    const serializer = new XMLSerializer2();
    return serializer.serializeToString(element);
  } else {
    return toTytx(value);
  }
}
function fromXmlnode(element) {
  const attrs = {};
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    attrs[attr.name] = fromTytx(attr.value);
  }
  const children = [];
  for (let i = 0; i < element.childNodes.length; i++) {
    const node = element.childNodes[i];
    if (node.nodeType === 1) {
      children.push(node);
    }
  }
  if (children.length > 0) {
    if (children.length === 1) {
      const child = children[0];
      const childData = fromXmlnode(child);
      return { attrs, value: { [child.tagName]: childData } };
    } else {
      const valueList = [];
      for (const child of children) {
        const childData = fromXmlnode(child);
        valueList.push({ [child.tagName]: childData });
      }
      return { attrs, value: valueList };
    }
  }
  return { attrs, value: fromTytx(element.textContent) };
}
function fromXml(data) {
  if (!DOMParser3) {
    throw new Error("XML support requires @xmldom/xmldom package in Node.js");
  }
  const parser = new DOMParser3();
  const doc = parser.parseFromString(data, "text/xml");
  let root = doc.documentElement;
  if (root.tagName === "tytx_root") {
    let firstElementChild = null;
    for (let i = 0; i < root.childNodes.length; i++) {
      if (root.childNodes[i].nodeType === 1) {
        firstElementChild = root.childNodes[i];
        break;
      }
    }
    if (!firstElementChild) {
      return fromTytx(root.textContent);
    }
    root = firstElementChild;
  }
  const result = fromXmlnode(root);
  return { [root.tagName]: result };
}

// node_modules/@genrojs/tytx/js/src/decode.js
function isString(v) {
  return typeof v === "string";
}
function _fromJson(data) {
  const [decoded, value] = rawDecode(data);
  if (decoded) {
    return value;
  }
  let jsonData = data;
  if (jsonData.endsWith("::JS")) {
    jsonData = jsonData.slice(0, -4);
  }
  let parsed;
  try {
    parsed = JSON.parse(jsonData);
  } catch {
    return data;
  }
  return walk(parsed, _decodeItem, isString);
}
function _decodeItem(s) {
  if (!s.includes("::")) {
    return s;
  }
  return rawDecode(s)[1];
}
function _fromXml(data) {
  const result = fromXml(data);
  if (typeof result === "string") {
    return fromTytx(result);
  }
  return result;
}
function _fromMsgpack(data) {
  return fromMsgpack(data);
}
function fromTytx(data, transport = null) {
  if (data === null) {
    return null;
  }
  if (transport === null || transport === "json") {
    let jsonData = data;
    if (transport === "json" && data.startsWith('"') && data.endsWith('"')) {
      jsonData = data.slice(1, -1);
    }
    return _fromJson(jsonData);
  } else if (transport === "xml") {
    return _fromXml(data);
  } else if (transport === "msgpack") {
    return _fromMsgpack(data);
  } else {
    throw new Error(`Unknown transport: ${transport}`);
  }
}

// node_modules/@genrojs/tytx/js/src/qs.js
function toQs(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join("&");
  }
  if (value !== null && typeof value === "object") {
    const parts = [];
    for (const [k, v] of Object.entries(value)) {
      const [encoded, result] = rawEncode(v, true);
      if (encoded) {
        parts.push(`${k}=${result}`);
      } else {
        parts.push(`${k}=${v}`);
      }
    }
    return parts.join("&");
  }
  throw new TypeError(`toQs expects object or array, got ${typeof value}`);
}
function fromQs(data) {
  if (!data) {
    return [];
  }
  const parts = data.split("&");
  const hasEq = parts.map((p) => p.includes("="));
  const allWithEq = hasEq.every(Boolean);
  const noneWithEq = !hasEq.some(Boolean);
  if (!allWithEq && !noneWithEq) {
    throw new Error("QS format error: mixed items with and without '='");
  }
  if (noneWithEq) {
    return parts.map((p) => fromTytx(p));
  }
  const result = {};
  for (const part of parts) {
    const eqIndex = part.indexOf("=");
    const key = part.slice(0, eqIndex);
    const value = part.slice(eqIndex + 1);
    result[key] = fromTytx(value);
  }
  return result;
}

// node_modules/@genrojs/tytx/js/src/registry.js
var DecimalClass = DecimalJS || BigJS || Number;
var decimalLibrary = DecimalJS ? "decimal.js" : BigJS ? "big.js" : "number";
function createDecimal(value) {
  return new DecimalClass(value);
}
function isDecimal2(value) {
  if (decimalLibrary === "number") {
    return false;
  }
  return value instanceof DecimalClass;
}
function getDateType(d) {
  const isEpochDate = d.getUTCFullYear() === 1970 && d.getUTCMonth() === 0 && d.getUTCDate() === 1;
  const isMidnight = d.getUTCHours() === 0 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0 && d.getUTCMilliseconds() === 0;
  if (isEpochDate && !isMidnight) return "H";
  if (isMidnight && !isEpochDate) return "D";
  return "DHZ";
}
function _serializeDecimal(v) {
  return v.toString();
}
function _serializeDate(v) {
  const year = v.getUTCFullYear();
  const month = String(v.getUTCMonth() + 1).padStart(2, "0");
  const day = String(v.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function _serializeDatetime(v) {
  return v.toISOString();
}
function _serializeTime(v) {
  const hours = String(v.getUTCHours()).padStart(2, "0");
  const minutes = String(v.getUTCMinutes()).padStart(2, "0");
  const seconds = String(v.getUTCSeconds()).padStart(2, "0");
  const millis = String(v.getUTCMilliseconds()).padStart(3, "0");
  return `${hours}:${minutes}:${seconds}.${millis}`;
}
function _serializeBool(v) {
  return v ? "true" : "false";
}
function _serializeInt(v) {
  return v.toString();
}
function _serializeFloat(v) {
  return v.toString();
}
function _serializeRaw(v) {
  let binary = "";
  for (let i = 0; i < v.length; i += 32768) {
    binary += String.fromCharCode.apply(null, v.subarray(i, i + 32768));
  }
  return btoa(binary);
}
var CUSTOM_TYPES = [];
var SUBTYPE_DICTS = /* @__PURE__ */ new Map();
function getCustomTypeEntry(value) {
  if (value === null || typeof value !== "object") {
    return null;
  }
  for (let proto = Object.getPrototypeOf(value); proto !== null; proto = Object.getPrototypeOf(proto)) {
    for (const [cls, suffix, serializer, jsonNative] of CUSTOM_TYPES) {
      if (cls.prototype === proto) {
        return [suffix, serializer, jsonNative];
      }
    }
  }
  return null;
}
function getTypeEntry(value) {
  if (value === null) {
    return ["NN", () => "", true];
  }
  if (isDecimal2(value)) {
    return ["N", _serializeDecimal, false];
  }
  if (value instanceof Uint8Array) {
    return ["RAW", _serializeRaw, false];
  }
  if (value instanceof Date) {
    const dateType = getDateType(value);
    if (dateType === "D") {
      return ["D", _serializeDate, false];
    } else if (dateType === "H") {
      return ["H", _serializeTime, false];
    } else {
      return ["DHZ", _serializeDatetime, false];
    }
  }
  if (typeof value === "boolean") {
    return ["B", _serializeBool, true];
  }
  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      return ["L", _serializeInt, true];
    } else {
      return ["R", _serializeFloat, true];
    }
  }
  return getCustomTypeEntry(value);
}
function _deserializeDecimal(s) {
  return createDecimal(s);
}
function _deserializeDate(s) {
  const [year, month, day] = s.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}
function _deserializeDatetime(s) {
  return new Date(s);
}
function _deserializeTime(s) {
  const [h, m, rest] = s.split(":");
  const [sec, ms] = rest.split(".");
  return new Date(Date.UTC(1970, 0, 1, Number(h), Number(m), Number(sec), Number(ms || 0)));
}
function _deserializeBool(s) {
  return s.toLowerCase() === "true";
}
function _deserializeInt(s) {
  return parseInt(s, 10);
}
function _deserializeFloat(s) {
  return parseFloat(s);
}
function _deserializeStr(s) {
  return s;
}
function _deserializeNone(s) {
  return null;
}
var BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
function _deserializeRaw(s) {
  if (!BASE64_PATTERN.test(s)) {
    throw new Error(`RAW payload is not standard padded base64: '${s}'`);
  }
  const binary = atob(s);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}
function _deserializeQs(s) {
  return fromQs(s);
}
var SUFFIX_PATTERN = /^[A-Z]+$/;
var SUFFIX_TO_TYPE = {
  "N": [Object, _deserializeDecimal],
  // Object as placeholder for Decimal type
  "D": [Date, _deserializeDate],
  "DH": [Date, _deserializeDatetime],
  // deprecated, still accepted
  "DHZ": [Date, _deserializeDatetime],
  // canonical
  "H": [Date, _deserializeTime],
  "L": [Number, _deserializeInt],
  "R": [Number, _deserializeFloat],
  "T": [String, _deserializeStr],
  "B": [Boolean, _deserializeBool],
  "QS": [Object, _deserializeQs],
  "NN": [null, _deserializeNone],
  "RAW": [Uint8Array, _deserializeRaw]
};
function getRegisteredType(suffix) {
  return Object.hasOwn(SUFFIX_TO_TYPE, suffix) ? SUFFIX_TO_TYPE[suffix][0] : null;
}
function registerType(cls, suffix, serializer, deserializer, jsonNative = false) {
  if (typeof suffix !== "string" || !SUFFIX_PATTERN.test(suffix)) {
    throw new Error(
      `TYTX suffix '${suffix}' is invalid: expected uppercase ASCII letters only`
    );
  }
  const existing = SUFFIX_TO_TYPE[suffix];
  if (existing !== void 0 && existing[0] !== cls) {
    const owner = existing[0] === null ? "null" : existing[0].name;
    throw new Error(`TYTX suffix '${suffix}' is already registered for ${owner}`);
  }
  CUSTOM_TYPES = CUSTOM_TYPES.filter(([c]) => c !== cls);
  CUSTOM_TYPES.push([cls, suffix, serializer, jsonNative]);
  SUFFIX_TO_TYPE[suffix] = [cls, deserializer];
}
function setSubtypeDict(suffix, subtypes) {
  SUBTYPE_DICTS.set(suffix, subtypes);
}
function getSubtypeDict(suffix) {
  return SUBTYPE_DICTS.has(suffix) ? SUBTYPE_DICTS.get(suffix) : {};
}

// node_modules/@genrojs/bag/src/resolver.js
var RETRY_POLICIES = {
  network: {
    maxAttempts: 3,
    delay: 1,
    backoff: 2,
    jitter: true,
    on: ["TypeError", "NetworkError", "AbortError"]
  },
  aggressive: {
    maxAttempts: 5,
    delay: 0.5,
    backoff: 2,
    jitter: true,
    on: ["Error"]
  },
  gentle: {
    maxAttempts: 2,
    delay: 2,
    backoff: 1.5,
    jitter: false,
    on: ["TypeError", "NetworkError"]
  }
};
function getRetryPolicy(resolver) {
  const policy = resolver._retryPolicy;
  if (policy === null || policy === void 0) {
    return null;
  }
  if (typeof policy === "string") {
    return RETRY_POLICIES[policy] || null;
  }
  return policy;
}
function shouldRetry(error, errorTypes) {
  return errorTypes.some((type) => {
    if (type === "Error") return true;
    return error.name === type || error.constructor.name === type;
  });
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function withRetry(fn, policy) {
  if (!policy) {
    return fn();
  }
  const maxAttempts = policy.maxAttempts || 3;
  const delay = policy.delay || 1;
  const backoff = policy.backoff || 2;
  const jitter = policy.jitter !== false;
  const errorTypes = policy.on || ["Error"];
  let lastError = null;
  let currentDelay = delay * 1e3;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const result = fn();
      if (result instanceof Promise) {
        return await result;
      }
      return result;
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts - 1 && shouldRetry(error, errorTypes)) {
        let sleepTime = currentDelay;
        if (jitter) {
          sleepTime *= 1 + Math.random() * 0.1;
        }
        await sleep(sleepTime);
        currentDelay *= backoff;
      } else {
        throw error;
      }
    }
  }
  throw lastError;
}
var BagResolver = class _BagResolver {
  /**
   * Default options for this resolver class.
   * Subclasses can override to change defaults.
   */
  static classKwargs = {
    cacheTime: 0,
    readOnly: false,
    asBag: null,
    retryPolicy: null
  };
  /**
   * Positional argument names for constructor.
   * Subclasses can override to accept positional args.
   */
  static classArgs = [];
  /**
   * Parameters that are internal (not passed to load()).
   */
  static internalParams = /* @__PURE__ */ new Set(["cacheTime", "readOnly", "asBag", "retryPolicy"]);
  /**
   * Create a new resolver.
   *
   * @param {Object} kwargs - Configuration options merged with classKwargs.
   */
  constructor(kwargs = {}) {
    const defaults = this.constructor.classKwargs;
    const merged = { ...defaults, ...kwargs };
    for (const option of ["interval", "reactive"]) {
      if (Object.hasOwn(merged, option)) {
        throw new TypeError(`Removed resolver option: ${option}. Schedule updates in the application; use reset() and read explicitly.`);
      }
    }
    this.cacheTime = merged.cacheTime;
    this._readOnly = merged.readOnly;
    this._asBag = merged.asBag;
    this._retryPolicy = merged.retryPolicy;
    this._kw = {};
    const internalParams = this.constructor.internalParams;
    for (const [key, value] of Object.entries(merged)) {
      if (!internalParams.has(key)) {
        this._kw[key] = value;
      }
    }
    this._lastUpdate = null;
    this._node = null;
    this._lastEffectiveFingerprint = null;
    this._cachedValue = null;
    this.init();
  }
  /**
   * Hook called at the end of constructor.
   * Override in subclasses for custom initialization.
   */
  init() {
  }
  /**
   * Set the parent node (called when resolver is attached to a node).
   *
   * @param {BagNode} node - The node this resolver is attached to.
   */
  setNode(node) {
    if (node !== this._node && !this.readOnly && this._lastUpdate !== null) {
      this.reset();
    }
    this._node = node;
    this.onSetResolver(node);
  }
  /**
   * Hook called when resolver is attached to a node.
   * Override in subclasses for custom initialization.
   *
   * @param {BagNode} node - The node this resolver is attached to.
   */
  onSetResolver(node) {
  }
  /**
   * Get the parent node.
   *
   * @returns {BagNode|null}
   */
  get node() {
    return this._node;
  }
  /**
   * Get cache time setting.
   *
   * @returns {number}
   */
  get cacheTime() {
    return this._cacheTime;
  }
  /**
   * Set cache time.
   *
   * @param {number} value
   */
  set cacheTime(value) {
    if (typeof value === "boolean") {
      throw new TypeError("cacheTime must be numeric; use a negative value for infinite caching");
    }
    this._cacheTime = value;
  }
  /**
   * Check if resolver is read-only (value not stored in node).
   *
   * @returns {boolean}
   */
  get readOnly() {
    return this._readOnly;
  }
  /**
   * Check if cached value has expired.
   *
   * @returns {boolean}
   */
  get expired() {
    if (this._cacheTime < 0) {
      return this._lastUpdate === null;
    }
    if (this._cacheTime === 0) {
      return true;
    }
    if (this._lastUpdate === null) {
      return true;
    }
    const now = Date.now();
    const deltaSeconds = (now - this._lastUpdate) / 1e3;
    return deltaSeconds > this._cacheTime;
  }
  /**
   * Reset the cache, forcing next resolve to call load().
   */
  reset(...args) {
    if (args.length) {
      throw new TypeError("reset() takes no arguments. It invalidates the cache for the next explicit read.");
    }
    this._lastUpdate = null;
    this._lastEffectiveFingerprint = null;
  }
  /**
   * Readonly caches live in the resolver; writable caches use the attached node.
   *
   * @returns {*} The cached value.
   */
  get cachedValue() {
    return !this.readOnly && this._node ? this._node._value : this._cachedValue;
  }
  /**
   * Set cached value in parent node or local storage.
   *
   * @param {*} value
   */
  set cachedValue(value) {
    if (!this.readOnly && this._node) {
      this._node.setValue(value, false);
    } else {
      this._cachedValue = value;
    }
  }
  /**
   * Compute fingerprint of effective parameters for cache invalidation.
   *
   * @param {Object} effectiveKw - The effective kwargs.
   * @returns {string} JSON string fingerprint.
   * @private
   */
  _computeEffectiveFingerprint(effectiveKw) {
    return JSON.stringify(Object.entries(effectiveKw).sort());
  }
  /**
   * Resolve the value. Main entry point.
   *
   * @param {Object} options - Resolution options.
   * @param {boolean} options.static - If true, return cached value without resolving.
   * @param {Object} options.kwargs - Additional kwargs merged with resolver's _kw.
   * @returns {*} The resolved value (or Promise if load() is async).
   */
  resolve(options = {}) {
    const { static: isStatic = false, ...callKwargs } = options;
    if (isStatic) {
      return this._node ? this._node._value : this.cachedValue;
    }
    const kwargs = { ...this._kw };
    if (this._node && this._node.attr) {
      const internalParams = this.constructor.internalParams;
      for (const [key, value] of Object.entries(this._node.attr)) {
        if (!internalParams.has(key)) {
          kwargs[key] = value;
        }
      }
    }
    Object.assign(kwargs, callKwargs);
    const currentFingerprint = this._computeEffectiveFingerprint(kwargs);
    if (currentFingerprint === this._lastEffectiveFingerprint && !this.expired) {
      return this.cachedValue;
    }
    this._lastEffectiveFingerprint = currentFingerprint;
    const policy = getRetryPolicy(this);
    const doLoad = () => this.load(kwargs);
    if (policy) {
      return withRetry(doLoad, policy).then((value) => this._finalize(value));
    }
    const result = doLoad();
    if (result && typeof result.then === "function") {
      return result.then((value) => this._finalize(value));
    }
    return this._finalize(result);
  }
  /**
   * Finalize resolution: update cache timestamp and optionally store value.
   *
   * @param {*} value - The resolved value.
   * @returns {*} The value (possibly converted to Bag).
   * @private
   */
  _finalize(value) {
    let shouldConvert;
    if (this._asBag === true) {
      shouldConvert = true;
    } else if (this._asBag === false) {
      shouldConvert = false;
    } else {
      shouldConvert = !this._readOnly;
    }
    if (shouldConvert && value !== null && value !== void 0) {
      value = this._convertToBag(value);
    }
    this._lastUpdate = Date.now();
    if (!this.readOnly || this.cacheTime !== 0) {
      this.cachedValue = value;
    }
    return value;
  }
  /**
   * Convert result to Bag if possible.
   * Uses the Bag class registered via BagResolver.registerBagClass().
   *
   * @param {*} result - The value to convert.
   * @returns {*} A Bag if conversion succeeded, otherwise the original value.
   * @private
   */
  _convertToBag(result) {
    const BagClass = _BagResolver._BagClass;
    if (!BagClass) {
      return result;
    }
    if (result && typeof result._htraverse === "function") {
      return result;
    }
    if (typeof result === "string") {
      result = result.trim();
      if (result.startsWith("<") && BagClass.fromXml) {
        return BagClass.fromXml(result);
      }
      if ((result.startsWith("{") || result.startsWith("[")) && BagClass.fromTytx) {
        return BagClass.fromTytx(result);
      }
    }
    return result;
  }
  /**
   * Register the Bag class for asBag conversion.
   * Called by Bag module to avoid circular imports.
   *
   * @param {Function} BagClass - The Bag constructor.
   */
  static registerBagClass(BagClass) {
    _BagResolver._BagClass = BagClass;
  }
  /**
   * Load the value. Override in subclasses.
   *
   * Can return a value directly (sync) or a Promise (async).
   *
   * @param {Object} kwargs - Parameters for loading.
   * @returns {*} The loaded value or Promise.
   */
  load(kwargs) {
    return null;
  }
};
BagResolver._BagClass = null;
var BagCbResolver = class extends BagResolver {
  static classKwargs = {
    cacheTime: 0,
    readOnly: false,
    asBag: false,
    retryPolicy: null,
    callback: null
  };
  static classArgs = ["callback"];
  static internalParams = /* @__PURE__ */ new Set(["cacheTime", "readOnly", "asBag", "retryPolicy", "callback"]);
  /**
   * Create a callback resolver.
   *
   * @param {Object|Function} kwargs - Options or callback function directly.
   */
  constructor(kwargs = {}) {
    if (typeof kwargs === "function") {
      kwargs = { callback: kwargs };
    }
    super(kwargs);
    this._callback = kwargs.callback || null;
  }
  /**
   * Load by calling the callback.
   *
   * // DIFF-PYTHON: Python calls callback(**params) with expanded kwargs.
   * // JS calls callback(params) with a single kwargs object because JS
   * // has no **kwargs syntax. This is an intentional, unavoidable difference.
   *
   * @param {Object} kwargs - Parameters passed to callback as single object.
   * @returns {*} Result of callback (value or Promise).
   */
  load(kwargs) {
    if (!this._callback) {
      return null;
    }
    return this._callback.call(this, kwargs);
  }
};

// node_modules/@genrojs/bag/src/bag-node.js
var BagNode = class _BagNode {
  /**
   * Create a new BagNode.
   *
   * @param {Object} parentBag - The parent Bag containing this node.
   * @param {string} label - The node's key/name within the parent Bag.
   * @param {*} [value=null] - The node's value (can be scalar or Bag).
   * @param {Object} [attr=null] - Dict of attributes to set.
   * @param {BagResolver} [resolver=null] - Resolver for lazy value loading.
   * @param {string} [nodeTag=null] - Semantic type tag for the node.
   * @param {string} [xmlTag=null] - Original XML tag name (for serialization).
   * @param {boolean} [removeNullAttributes=true] - Remove null attributes during construction.
   */
  constructor(parentBag, label, value = null, attr = null, resolver = null, nodeTag = null, xmlTag = null, removeNullAttributes = true) {
    this.label = label;
    this._value = null;
    this._attr = {};
    this._parentBag = null;
    this._resolver = null;
    this._nodeSubscribers = {};
    this._onChangedValue = null;
    this.nodeTag = nodeTag;
    this.xmlTag = xmlTag;
    this._compiled = null;
    this.parentBag = parentBag;
    if (attr) {
      this.setAttr(attr, false, true, removeNullAttributes);
    }
    if (value !== null) {
      this.setValue(value, false);
    }
    if (resolver) {
      this.resolver = resolver;
    }
  }
  // -------------------------------------------------------------------------
  // Parent Bag Property
  // -------------------------------------------------------------------------
  get parentBag() {
    return this._parentBag;
  }
  set parentBag(parentBag) {
    if (parentBag === null && this._value?.parentNode === this) {
      this._value.setBackref();
    }
    this._parentBag = parentBag;
    if (parentBag?.backref && this._value && typeof this._value._htraverse === "function") {
      this._value.setBackref(this, parentBag);
    }
  }
  // -------------------------------------------------------------------------
  // Value Property and Methods
  // -------------------------------------------------------------------------
  get value() {
    return this.getValue();
  }
  set value(value) {
    this.setValue(value);
  }
  /**
   * Get the node's value.
   *
   * @param {boolean} [isStatic=false] - If true, return cached value without triggering resolver.
   * @param {string} [queryString=null] - Query string from path suffix (after '?').
   *   - null: return node value
   *   - '': return all attributes as an object
   *   - 'attr': return single attribute value (resolving attribute resolvers)
   *   - 'attr1&attr2': return tuple of attribute values
   *   - 'key=val::T&key2=val2::T': kwargs for resolver (parsed via tytx ::QS)
   * @param {Object} [kwargs={}] - Additional kwargs passed to resolver.
   * @returns {*} The value/attributes, or a Promise of the complete query result.
   * Static attribute queries preserve raw resolver objects without executing them.
   */
  getValue(isStatic = false, queryString = null, kwargs = {}) {
    if (queryString !== null) {
      const parsedQs = fromTytx(`${queryString}::QS`);
      if (Array.isArray(parsedQs)) {
        const keys = parsedQs.length ? parsedQs : Object.keys(this._attr);
        const values = keys.map((key) => {
          const value = this.getAttr(key);
          return !isStatic && value instanceof BagResolver ? value.resolve() : value;
        });
        const result = (attrs) => parsedQs.length === 0 ? Object.fromEntries(keys.map((key, index) => [key, attrs[index]])) : attrs.length === 1 ? attrs[0] : attrs;
        return values.some((value) => value && typeof value.then === "function") ? Promise.all(values).then(result) : result(values);
      } else {
        if (!this._resolver) {
          throw new Error("Cannot use kwargs syntax without resolver");
        }
        kwargs = { ...kwargs, ...parsedQs };
      }
    }
    if (this._resolver !== null) {
      return this._resolver.resolve({ static: isStatic, ...kwargs });
    }
    return this._value;
  }
  /**
   * Set the node's value.
   *
   * @param {*} value - The value to set.
   * @param {boolean} [trigger=true] - If true, notify subscribers of the change.
   * @param {Object} [attributes=null] - Optional attributes to set along with value.
   * @param {boolean|null} [updattr=null] - If falsy (default null), replace
   *   existing attributes; if true, merge. Note: unlike setAttr called
   *   directly (which merges by default), setValue replaces by default,
   *   matching Python's _updattr=None.
   * @param {boolean} [removeNullAttributes=true] - If true, remove null values from attributes.
   * @param {string} [reason=null] - Optional reason string for the trigger.
   * @param {boolean} [fired=false] - True when the write is a fired write;
   *   carried as `fired` in the Bag change event.
   */
  setValue(value, trigger = true, attributes = null, updattr = null, removeNullAttributes = true, reason = null, fired = false) {
    if (value instanceof BagResolver) {
      this.resolver = value;
      value = null;
    } else if (value instanceof _BagNode) {
      attributes = attributes || {};
      Object.assign(attributes, value._attr);
      if (value.resolver) {
        this.resolver = value.resolver;
      }
      value = value._value;
    }
    const oldvalue = this._value;
    if (oldvalue !== value && oldvalue?.parentNode === this) {
      oldvalue.setBackref();
    }
    this._value = value;
    const valueChanged = oldvalue !== this._value;
    const callbackTrigger = trigger == null ? true : trigger;
    let attrsDiff = null;
    if (attributes !== null) {
      const oldattrSnapshot = { ...this._attr };
      this.setAttr(attributes, false, updattr, removeNullAttributes);
      const diff = this._buildAttrDiff(oldattrSnapshot, this._attr);
      attrsDiff = Object.keys(diff).length > 0 ? diff : null;
    }
    trigger = callbackTrigger && (valueChanged || attrsDiff !== null);
    const evt = attrsDiff ? valueChanged ? "upd_value_attr" : "upd_attrs" : "upd_value";
    if (this._onChangedValue) {
      this._onChangedValue(this, value, oldvalue, callbackTrigger);
    }
    if (trigger) {
      const info = attrsDiff !== null ? { oldvalue, attrs_diff: attrsDiff } : { oldvalue };
      for (const subscriber of Object.values(this._nodeSubscribers)) {
        subscriber({ node: this, info, evt });
      }
    }
    if (this._parentBag !== null && this._parentBag.backref) {
      if (value && typeof value._htraverse === "function") {
        value.setBackref(this, this._parentBag);
      }
      if (trigger) {
        this._parentBag._onNodeChanged(
          this,
          [this.label],
          evt,
          oldvalue,
          attrsDiff,
          reason,
          fired
        );
      }
    }
  }
  /** Copy value, attributes and resolver; retain label, identity and position. */
  replace(other) {
    if (!(other instanceof _BagNode)) throw new TypeError("BagNode.replace expects a BagNode");
    if (other === this) return this;
    let value = other.staticValue;
    if (value && typeof value._htraverse === "function") {
      value = value.createChildBag().replace(value);
    }
    let resolver = null;
    if (other.resolver) {
      resolver = Object.create(
        Object.getPrototypeOf(other.resolver),
        Object.getOwnPropertyDescriptors(other.resolver)
      );
      resolver._node = null;
      resolver._kw = { ...other.resolver._kw };
    }
    const oldvalue = this._value;
    const oldattr = { ...this._attr };
    const oldresolver = this.resolver;
    if (oldresolver && oldresolver._node === this) oldresolver._node = null;
    this.resolver = resolver;
    this.setValue(value, false, { ...other.attr }, false, false, null);
    const diff = this._buildAttrDiff(oldattr, this._attr);
    const attrsDiff = Object.keys(diff).length ? diff : null;
    const valueChanged = oldvalue !== value || oldresolver !== resolver;
    if (valueChanged || attrsDiff) {
      const evt = attrsDiff ? valueChanged ? "upd_value_attr" : "upd_attrs" : "upd_value";
      const info = attrsDiff ? { oldvalue, attrs_diff: attrsDiff } : { oldvalue };
      for (const callback of Object.values(this._nodeSubscribers)) {
        callback({ node: this, info, evt });
      }
      if (this._parentBag !== null && this._parentBag.backref) {
        this._parentBag._onNodeChanged(this, [this.label], evt, oldvalue, attrsDiff);
      }
    }
    return this;
  }
  /**
   * Get node's raw _value (bypassing resolver).
   */
  get staticValue() {
    return this._value;
  }
  set staticValue(value) {
    this._value = value;
  }
  /**
   * Get the resolver attached to this node.
   *
   * @returns {BagResolver|null} The resolver or null.
   */
  get resolver() {
    return this._resolver;
  }
  /**
   * Set the resolver for this node.
   *
   * @param {BagResolver|null} resolver - The resolver to attach.
   */
  set resolver(resolver) {
    this._resolver = resolver;
    if (resolver && resolver.setNode) {
      resolver.setNode(this);
    }
  }
  /**
   * Reset the resolver and clear the node value.
   */
  resetResolver() {
    if (!this._resolver) {
      throw new Error("Cannot reset resolver: node has no resolver");
    }
    this._resolver.reset();
    this.setValue(null);
  }
  // -------------------------------------------------------------------------
  // Attribute Methods
  // -------------------------------------------------------------------------
  get attr() {
    return this._attr;
  }
  /**
   * Get attribute value or all attributes.
   *
   * @param {string} [label=null] - The attribute's label. If null, returns all attributes.
   * @param {*} [defaultValue=null] - Default value if attribute not found.
   * @returns {*} Attribute value, default, or dict of all attributes.
   */
  getAttr(label = null, defaultValue = null) {
    if (!label) {
      return this._attr;
    }
    return label in this._attr ? this._attr[label] : defaultValue;
  }
  /**
   * Compute the symmetric diff between two attribute snapshots.
   *
   * Returns a dict mapping each changed key to { old, new }, covering
   * added (old=null), removed (new=null) and modified entries. Keys whose
   * value did not change are omitted.
   *
   * @param {Object} oldattr - Attribute snapshot before the change.
   * @param {Object} newattr - Attribute snapshot after the change.
   * @returns {Object} Diff dict { name: { old, new } }.
   */
  _buildAttrDiff(oldattr, newattr) {
    const diff = {};
    const keys = /* @__PURE__ */ new Set([...Object.keys(oldattr), ...Object.keys(newattr)]);
    for (const key of keys) {
      const oldVal = key in oldattr ? oldattr[key] : null;
      const newVal = key in newattr ? newattr[key] : null;
      if (oldVal !== newVal) {
        diff[key] = { old: oldVal, new: newVal };
      }
    }
    return diff;
  }
  /**
   * Set attributes on the node.
   *
   * @param {Object} [attr=null] - Dictionary of attributes to set.
   * @param {boolean} [trigger=true] - If true, notify subscribers of the change.
   * @param {boolean} [updattr=true] - If false, clear existing attributes first.
   * @param {boolean} [removeNullAttributes=true] - If true, remove null values from attributes.
   */
  setAttr(attr = null, trigger = true, updattr = true, removeNullAttributes = true) {
    const newAttr = attr || {};
    const hasNodeSubscribers = Object.keys(this._nodeSubscribers).length > 0;
    const needDiff = trigger && (hasNodeSubscribers || this._parentBag !== null && this._parentBag.backref);
    const oldattr = needDiff ? { ...this._attr } : null;
    if (updattr) {
      Object.assign(this._attr, newAttr);
    } else {
      this._attr = { ...newAttr };
    }
    if (removeNullAttributes) {
      for (const key of Object.keys(this._attr)) {
        if (this._attr[key] === null) {
          delete this._attr[key];
        }
      }
    }
    if (trigger && oldattr !== null) {
      const diff = this._buildAttrDiff(oldattr, this._attr);
      if (Object.keys(diff).length > 0 && hasNodeSubscribers) {
        for (const subscriber of Object.values(this._nodeSubscribers)) {
          subscriber({ node: this, info: { attrs_diff: diff }, evt: "upd_attrs" });
        }
      }
      if (Object.keys(diff).length > 0 && this._parentBag !== null && this._parentBag.backref) {
        const reason = trigger === true ? "true" : String(trigger);
        this._parentBag._onNodeChanged(
          this,
          [this.label],
          "upd_attrs",
          null,
          diff,
          reason
        );
      }
    }
  }
  /**
   * Delete attributes from the node.
   *
   * @param {...string} attrsToDelete - Attribute labels to remove.
   *   Each can be a single label or a comma-separated string.
   */
  delAttr(...attrsToDelete) {
    for (const attr of attrsToDelete) {
      if (typeof attr === "string" && attr.includes(",")) {
        for (const a of attr.split(",")) {
          delete this._attr[a.trim()];
        }
      } else {
        delete this._attr[attr];
      }
    }
  }
  /**
   * Check if a node has the given attribute.
   *
   * @param {string} label - Attribute label to check.
   * @param {*} [value=null] - If provided, also check if attribute has this value.
   * @returns {boolean} True if attribute exists (and matches value if provided).
   */
  hasAttr(label, value = null) {
    if (!(label in this._attr)) {
      return false;
    }
    if (value !== null) {
      return this._attr[label] === value;
    }
    return true;
  }
  /**
   * Get attributes inherited from ancestors.
   *
   * @returns {Object} Dict with all inherited attributes merged with this node's attributes.
   */
  getInheritedAttributes() {
    let inherited = {};
    if (this._parentBag && this._parentBag.parentNode) {
      inherited = this._parentBag.parentNode.getInheritedAttributes();
    }
    return { ...inherited, ...this._attr };
  }
  // -------------------------------------------------------------------------
  // Subscription Methods
  // -------------------------------------------------------------------------
  /**
   * Subscribe to changes on this specific node.
   *
   * @param {string} subscriberId - Unique identifier for this subscription.
   * @param {Function} callback - Function to call on changes.
   *
   * Callback signature: callback({ node, info, evt })
   * - node: This BagNode
   * - info: an object with semantic keys:
   *     - 'upd_value'      → { oldvalue }
   *     - 'upd_attrs'      → { attrs_diff }   (diff dict { name: { old, new } })
   *     - 'upd_value_attr' → { oldvalue, attrs_diff }
   * - evt: Event type ('upd_value', 'upd_attrs' or 'upd_value_attr')
   */
  subscribe(subscriberId, callback) {
    this._nodeSubscribers[subscriberId] = callback;
  }
  /**
   * Unsubscribe from changes on this node.
   *
   * @param {string} subscriberId - The subscription identifier to remove.
   */
  unsubscribe(subscriberId) {
    delete this._nodeSubscribers[subscriberId];
  }
  // -------------------------------------------------------------------------
  // Compilation Properties
  // -------------------------------------------------------------------------
  /**
   * Lazy-initialized compiled data storage.
   * External systems (compilers) store compiled data here.
   *
   * @returns {Object} The compiled data dictionary.
   */
  get compiled() {
    if (!this._compiled) {
      this._compiled = {};
    }
    return this._compiled;
  }
  /**
   * Check if this node's value is a Bag (branch node).
   * Uses duck typing via _htraverse to avoid circular import.
   *
   * @returns {boolean} True if value is a Bag.
   */
  get isBranch() {
    return this._value != null && typeof this._value._htraverse === "function";
  }
  // -------------------------------------------------------------------------
  // Navigation Properties
  // -------------------------------------------------------------------------
  /**
   * Get this node's index position within parent Bag.
   *
   * @returns {number|null} The 0-based index of this node in the parent's node list,
   *   or null if this node has no parent.
   */
  get position() {
    if (this._parentBag === null) {
      return null;
    }
    return this._parentBag._nodes.index(this.label);
  }
  /**
   * Get dot-separated path from root to this node.
   *
   * @returns {string|null} Full path or null if no parent.
   */
  get fullpath() {
    if (this._parentBag !== null) {
      const parentFullpath = this._parentBag.fullpath;
      return parentFullpath ? `${parentFullpath}.${this.label}` : this.label;
    }
    return null;
  }
  /**
   * Get the node that contains this node's parent Bag.
   *
   * In the hierarchy: grandparent_bag contains parent_node, whose value
   * is parent_bag, which contains this node.
   *
   * @returns {BagNode|null} The parent node or null.
   */
  get parentNode() {
    if (this._parentBag) {
      return this._parentBag.parentNode;
    }
    return null;
  }
  /**
   * Find the ancestor node that owns a given attribute.
   *
   * @param {string} attrname - Attribute name to search for.
   * @param {*} [attrvalue=null] - If provided, also match this value.
   * @returns {BagNode|null} The node that owns the attribute, or null.
   */
  attributeOwnerNode(attrname, attrvalue = null) {
    let curr = this;
    if (attrvalue === null) {
      while (curr && !(attrname in curr._attr)) {
        curr = curr.parentNode;
      }
    } else {
      while (curr && curr._attr[attrname] !== attrvalue) {
        curr = curr.parentNode;
      }
    }
    return curr;
  }
  /**
   * Return node data as a tuple (array).
   *
   * @returns {Array} Array of [label, value, attr, resolver].
   */
  asTuple() {
    return [this.label, this.value, this._attr, this._resolver || null];
  }
  // -------------------------------------------------------------------------
  // Comparison
  // -------------------------------------------------------------------------
  /**
   * Check equality with another BagNode.
   *
   * @param {BagNode} other - Node to compare with.
   * @returns {boolean} True if label, attr and value match.
   */
  isEqual(other) {
    if (!(other instanceof _BagNode)) {
      return false;
    }
    if (this.label !== other.label) {
      return false;
    }
    const thisKeys = Object.keys(this._attr);
    const otherKeys = Object.keys(other._attr);
    if (thisKeys.length !== otherKeys.length) {
      return false;
    }
    for (const key of thisKeys) {
      if (this._attr[key] !== other._attr[key]) {
        return false;
      }
    }
    if (this._resolver !== null) {
      return this._resolver === other._resolver;
    }
    if (this._value && typeof this._value.equalTo === "function") {
      return this._value.equalTo(other._value);
    }
    if (this._value && typeof this._value.isEqual === "function") {
      return this._value.isEqual(other._value);
    }
    return this._value === other._value;
  }
  /**
   * Compare this node with another and return differences.
   *
   * @param {BagNode} other - Another BagNode to compare with.
   * @returns {string|null} Description of differences, or null if equal.
   */
  diff(other) {
    if (this.label !== other.label) {
      return `Other label: ${other.label}`;
    }
    const thisKeys = Object.keys(this._attr);
    const otherKeys = Object.keys(other._attr);
    if (thisKeys.length !== otherKeys.length || thisKeys.some((k) => this._attr[k] !== other._attr[k])) {
      return `attributes self:${JSON.stringify(this._attr)} --- other:${JSON.stringify(other._attr)}`;
    }
    if (this._value !== other._value) {
      return `value self:${this._value} --- other:${other._value}`;
    }
    return null;
  }
  /**
   * Convert node to JSON-serializable dict.
   *
   * @param {boolean} [typed=true] - If true, include type information.
   * @returns {Object} Dict with keys 'label', 'value', and 'attr'.
   */
  toJson(typed = true) {
    let value = this.value;
    if (value && typeof value.toJson === "function") {
      value = value.toJson(typed, true);
    }
    return { label: this.label, value, attr: this._attr };
  }
  // -------------------------------------------------------------------------
  // String representation
  // -------------------------------------------------------------------------
  toString() {
    return `BagNode : ${this.label}`;
  }
};

// node_modules/@genrojs/bag/src/bag-node-container.js
var BagNodeContainer = class _BagNodeContainer {
  constructor() {
    this._dict = /* @__PURE__ */ Object.create(null);
    this._list = [];
    this._parentBag = null;
  }
  /**
   * Return the index of a label in this container.
   *
   * @param {string} label - The label or special syntax to look up.
   *   - 'label': exact label match
   *   - '#n': numeric index (e.g., '#0', '#1')
   *   - '#attr=value': find by attribute value (e.g., '#id=34')
   *   - '#=value': find by node value (e.g., '#=target')
   * @returns {number} Index position (0-based), or -1 if not found.
   */
  index(label) {
    if (label in this._dict) {
      return this._list.findIndex((node) => node.label === label);
    }
    let match = label.match(/^#(\d+)$/);
    if (match) {
      const idx = parseInt(match[1], 10);
      return idx < this._list.length ? idx : -1;
    }
    match = label.match(/^#(\w*)=(.*)$/);
    if (match) {
      const [, attr, rawValue] = match;
      const value = rawValue.includes("::") ? fromTytx(rawValue) : rawValue;
      if (attr) {
        return this._list.findIndex((node) => node.getAttr(attr) === value);
      } else {
        return this._list.findIndex((node) => node._value === value);
      }
    }
    return -1;
  }
  /**
   * Parse position syntax and return insertion index.
   *
   * Supported formats:
   *   - null or '>': append at end
   *   - '<': insert at beginning
   *   - int n: insert at index n. Negative values count from the end
   *     (Python-style: -1 = before last). Out-of-range values clamp to [0, len].
   *   - '#n': insert at non-negative index n (clamped to len)
   *   - '<label': insert before node with given label
   *   - '>label': insert after node with given label
   *   - '<#n' / '>#n': insert before/after non-negative index n
   *
   * Fails fast on malformed input instead of silently appending, so a bad
   * position is reported to the caller (aligns with Python _parse_position).
   *
   * @param {string|number|null} position - Position specification.
   * @returns {number} Index where to insert (always valid for splice).
   * @throws {Error} If the string position is malformed (e.g. '#abc', '#-1',
   *   '@foo') or references a non-existent label (e.g. '<missing').
   */
  _parsePosition(position) {
    const n = this._list.length;
    if (position === null || position === void 0 || position === ">") {
      return n;
    }
    if (typeof position === "number") {
      if (position < 0) {
        position = n + position;
      }
      return Math.max(0, Math.min(position, n));
    }
    if (position === "<") {
      return 0;
    }
    if (position.startsWith("#")) {
      const idx = this._parseSharpIndex(position.slice(1), position);
      return Math.min(idx, n);
    }
    if (position.startsWith("<")) {
      const ref = position.slice(1);
      if (ref.startsWith("#")) {
        const idx = this._parseSharpIndex(ref.slice(1), position);
        return Math.min(idx, n);
      }
      const labelIdx = this.index(ref);
      if (labelIdx < 0) {
        throw new Error(
          `Invalid node_position '${position}': label '${ref}' not found`
        );
      }
      return labelIdx;
    }
    if (position.startsWith(">")) {
      const ref = position.slice(1);
      if (ref.startsWith("#")) {
        const idx = this._parseSharpIndex(ref.slice(1), position);
        return Math.min(idx + 1, n);
      }
      const labelIdx = this.index(ref);
      if (labelIdx < 0) {
        throw new Error(
          `Invalid node_position '${position}': label '${ref}' not found`
        );
      }
      return labelIdx + 1;
    }
    throw new Error(`Invalid node_position '${position}': unrecognized syntax`);
  }
  /**
   * Parse a non-negative integer from '#n' syntax.
   *
   * @param {string} raw - The part after '#' (e.g. '3' from '#3').
   * @param {string} original - Full position string for error messages.
   * @returns {number} The parsed non-negative integer.
   * @throws {Error} If raw is not a non-negative integer.
   */
  _parseSharpIndex(raw, original) {
    if (!/^-?\d+$/.test(raw)) {
      throw new Error(
        `Invalid node_position '${original}': '${raw}' is not an integer`
      );
    }
    const idx = parseInt(raw, 10);
    if (idx < 0) {
      throw new Error(
        `Invalid node_position '${original}': negative index not allowed in '#n' syntax`
      );
    }
    return idx;
  }
  /**
   * Get item by label or index.
   *
   * @param {string|number} key - Label string or integer index.
   * @returns {BagNode|null} The BagNode if found, null otherwise.
   */
  get(key) {
    if (typeof key === "number") {
      return key >= 0 && key < this._list.length ? this._list[key] : null;
    }
    if (key.startsWith("#")) {
      const idx = this.index(key);
      return idx >= 0 ? this._list[idx] : null;
    }
    return this._dict[key] || null;
  }
  /**
   * Set or create a BagNode with optional position.
   *
   * Supports ?attr syntax to set attributes instead of value (always
   * merged with existing attributes, regardless of `updattr`):
   *   - 'label?myattr' → sets attribute 'myattr' to value
   *   - 'label?x&y&z' → sets attributes from tuple (value must be array with matching length)
   *
   * @param {string} label - The node label. Can contain ?attr suffix.
   * @param {*} value - The value to set. With ?attr syntax, becomes the attribute value.
   * @param {string|number|null} [nodePosition='>'] - Position specification.
   * @param {Object} [attr=null] - Optional attributes.
   * @param {Object} [parentBag=null] - Parent Bag reference.
   * @param {BagResolver} [resolver=null] - Resolver to attach to node.
   * @param {boolean} [updattr=false] - If false, clear existing attributes first.
   * @param {boolean} [removeNullAttributes=true] - If true, remove null values from attributes.
   * @param {string} [reason=null] - Optional reason string for events.
   * @param {boolean} [doTrigger=true] - If false, suppress events.
   * @param {boolean} [fired=false] - If true, reset value to null after creation.
   *   The event of the write carries fired=true; the reset emits no event.
   * @param {string} [nodeTag=null] - Semantic type tag for the node.
   * @returns {BagNode} The created or updated BagNode.
   */
  set(label, value, nodePosition = ">", attr = null, parentBag = null, resolver = null, updattr = false, removeNullAttributes = true, reason = null, doTrigger = true, fired = false, nodeTag = null) {
    let queryString = null;
    if (label.includes("?")) {
      [label, queryString] = label.split("?", 2);
    }
    if (label === null || label === void 0 || label.startsWith("#")) {
      throw new Error("Cannot create new node with #n syntax");
    }
    if (queryString) {
      const qs = queryString.split("&");
      if (qs.length === 1) {
        attr = { [qs[0]]: value };
      } else {
        if (!Array.isArray(value) || value.length !== qs.length) {
          throw new Error("Wrong attributes assignment");
        }
        attr = {};
        for (let i = 0; i < qs.length; i++) {
          attr[qs[i]] = value[i];
        }
      }
      value = null;
    }
    let node = this._dict[label];
    if (node) {
      if (nodeTag) {
        node.nodeTag = nodeTag;
      }
      if (resolver !== null) {
        if (resolver === false) {
          node.resolver = null;
        } else {
          node.resolver = resolver;
        }
      }
      if (queryString) {
        node.setAttr(attr, doTrigger, true, removeNullAttributes);
      } else {
        node.setValue(value, doTrigger, attr, updattr, removeNullAttributes, reason, fired);
      }
    } else {
      const NodeClass = parentBag && parentBag.nodeClass ? parentBag.nodeClass : BagNode;
      node = new NodeClass(
        parentBag,
        label,
        queryString ? null : value,
        attr,
        resolver,
        nodeTag,
        null,
        removeNullAttributes
      );
      const idx = this._parsePosition(nodePosition);
      this._dict[label] = node;
      this._list.splice(idx, 0, node);
      if (doTrigger && parentBag && parentBag.backref) {
        parentBag._onNodeInserted(node, idx, null, reason, fired);
      }
    }
    if (fired) {
      node.setValue(null, false);
    }
    return node;
  }
  /**
   * Remove and return item.
   *
   * @param {string|number} key - Label, index, or '#n'.
   * @returns {BagNode|null} The removed BagNode, or null if not found.
   */
  pop(key) {
    const node = this.get(key);
    if (node) {
      delete this._dict[node.label];
      const idx = this._list.indexOf(node);
      if (idx >= 0) {
        this._list.splice(idx, 1);
      }
      return node;
    }
    return null;
  }
  /**
   * Check if label exists.
   *
   * @param {string} key - Label to check.
   * @returns {boolean} True if label exists.
   */
  has(key) {
    return key in this._dict;
  }
  /**
   * Return number of elements.
   *
   * @returns {number} Number of elements.
   */
  get length() {
    return this._list.length;
  }
  /**
   * Clear all elements.
   */
  clear() {
    this._dict = /* @__PURE__ */ Object.create(null);
    this._list = [];
  }
  /**
   * Return node labels in order.
   *
   * @returns {string[]} Array of labels.
   */
  keys() {
    return this._list.map((node) => node.label);
  }
  /**
   * Return node values in order.
   *
   * @returns {Array} Array of values.
   */
  values() {
    return this._list.map((node) => node.getValue());
  }
  /**
   * Return [label, value] tuples in order.
   *
   * @returns {Array} Array of [label, value] tuples.
   */
  items() {
    return this._list.map((node) => [node.label, node.getValue()]);
  }
  /**
   * Make container iterable.
   */
  [Symbol.iterator]() {
    return this._list[Symbol.iterator]();
  }
  /**
   * Move element(s) to a new position.
   *
   * @param {number|number[]} what - Index or list of indices to move.
   * @param {number} position - Target index position.
   * @param {boolean} [trigger=true] - If true, fire del/ins events.
   */
  move(what, position, trigger = true) {
    if (position < 0) {
      return;
    }
    const indices = Array.isArray(what) ? what : [what];
    if (indices.length === 0) {
      return;
    }
    if (position >= this._list.length) {
      return;
    }
    const destLabel = this._list[position].label;
    if (indices.length > 1) {
      const sortedIndices = [...indices].sort((a, b) => a - b);
      const delta = sortedIndices[0] < position ? 1 : 0;
      const popped = [];
      for (let i = sortedIndices.length - 1; i >= 0; i--) {
        const idx = sortedIndices[i];
        if (idx >= 0 && idx < this._list.length) {
          const node = this._list[idx];
          this._list.splice(idx, 1);
          popped.push(node);
          if (trigger && this._parentBag && this._parentBag.backref) {
            this._parentBag._onNodeDeleted(node, idx);
          }
        }
      }
      let newPos = this.index(destLabel);
      if (newPos < 0) {
        newPos = this._list.length;
      }
      newPos += delta;
      for (const node of popped) {
        this._list.splice(newPos, 0, node);
        if (trigger && this._parentBag && this._parentBag.backref) {
          this._parentBag._onNodeInserted(node, newPos);
        }
      }
    } else {
      const fromIdx = indices[0];
      if (fromIdx === position) {
        return;
      }
      if (fromIdx < 0 || fromIdx >= this._list.length) {
        return;
      }
      const node = this._list[fromIdx];
      this._list.splice(fromIdx, 1);
      if (trigger && this._parentBag && this._parentBag.backref) {
        this._parentBag._onNodeDeleted(node, fromIdx);
      }
      this._list.splice(position, 0, node);
      if (trigger && this._parentBag && this._parentBag.backref) {
        this._parentBag._onNodeInserted(node, position);
      }
    }
  }
  /**
   * Check equality with another BagNodeContainer.
   *
   * @param {BagNodeContainer} other - Container to compare with.
   * @returns {boolean} True if equal (same nodes in same order).
   */
  isEqual(other) {
    if (!(other instanceof _BagNodeContainer)) {
      return false;
    }
    if (this._list.length !== other._list.length) {
      return false;
    }
    for (let i = 0; i < this._list.length; i++) {
      const thisNode = this._list[i];
      const otherNode = other._list[i];
      if (!thisNode.isEqual(otherNode)) {
        return false;
      }
    }
    return true;
  }
};

// node_modules/@genrojs/bag/src/bag.js
var import_xmldom2 = __toESM(require_lib(), 1);

// node_modules/@genrojs/bag/src/resolver-wire.js
var MARKER = "::RSLV:";
var registrations = /* @__PURE__ */ new Map();
var classes = /* @__PURE__ */ new Map();
var opaquePayloads = /* @__PURE__ */ new WeakMap();
var BagSerializationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "BagSerializationError";
  }
};
var OpaqueResolver = class extends BagResolver {
  constructor(payload) {
    super({ asBag: false });
    opaquePayloads.set(this, payload);
  }
  get payload() {
    return opaquePayloads.get(this);
  }
  load() {
    throw new BagSerializationError("This resolver is opaque; local execution is unavailable");
  }
};
function validateDescription(data) {
  if (!data || typeof data !== "object" || Array.isArray(data) || typeof data.resolver_module !== "string" || typeof data.resolver_class !== "string" || !Array.isArray(data.args ?? []) || !data.kwargs || typeof data.kwargs !== "object" || Array.isArray(data.kwargs)) {
    throw new BagSerializationError("Invalid resolver description");
  }
}
function validateJson(value, parents2 = /* @__PURE__ */ new Set()) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number" && Number.isFinite(value)) return;
  if (typeof value !== "object" || parents2.has(value) || !Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
    throw new BagSerializationError("Resolver parameters must be JSON data; callbacks cannot travel");
  }
  parents2.add(value);
  for (const child of Object.values(value)) validateJson(child, parents2);
  parents2.delete(value);
}
function encodeResolver(resolver) {
  if (opaquePayloads.has(resolver)) return opaquePayloads.get(resolver);
  const entry = classes.get(resolver.constructor);
  if (!entry) throw new BagSerializationError(`Unregistered resolver: ${resolver.constructor.name}`);
  const parameters2 = entry.encode(resolver);
  const data = {
    resolver_module: entry.module,
    resolver_class: entry.name,
    args: parameters2.args ?? [],
    kwargs: parameters2.kwargs ?? {}
  };
  validateDescription(data);
  validateJson(data);
  return MARKER + JSON.stringify(data);
}
function decodeResolver(value) {
  if (typeof value !== "string" || !value.startsWith(MARKER)) return null;
  const payload = value.slice(MARKER.length);
  if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+$/.test(payload)) {
    return new OpaqueResolver(value);
  }
  let data;
  try {
    data = JSON.parse(payload);
  } catch {
    throw new BagSerializationError("Invalid resolver JSON or signed token");
  }
  validateDescription(data);
  const entry = registrations.get(JSON.stringify([data.resolver_module, data.resolver_class]));
  if (!entry) return new OpaqueResolver(value);
  const resolver = entry.decode({ args: data.args ?? [], kwargs: data.kwargs });
  if (!(resolver instanceof entry.cls)) {
    throw new BagSerializationError("Resolver decoder returned an incompatible instance");
  }
  return resolver;
}
function encodeAttrs(attr) {
  return Object.fromEntries(Object.entries(attr || {}).map(([key, value]) => [key, value instanceof BagResolver ? encodeResolver(value) : value]));
}
function decodeAttrs(attr) {
  return Object.fromEntries(Object.entries(attr || {}).map(([key, value]) => [key, decodeResolver(value) ?? value]));
}

// node_modules/@genrojs/bag/src/subtype-wire.js
var CLS_ATTRIBUTE = "__cls";
function getInheritedClass(parentClass, suffix) {
  if (parentClass !== null && parentClass.tytxSuffix === suffix) return parentClass;
  return getRegisteredType(suffix);
}
function getSubtypeName(cls) {
  const suffix = cls.tytxSuffix;
  const names = Object.entries(getSubtypeDict(suffix)).filter(([, subtype]) => subtype === cls).map(([name]) => name);
  if (names.length === 0) {
    throw new BagSerializationError(
      `${cls.name} is not in the TYTX subtype dictionary of '${suffix}'`
    );
  }
  if (names.length > 1) {
    throw new BagSerializationError(
      `${cls.name} is in the TYTX subtype dictionary of '${suffix}' under several names: ${names.sort().join(", ")}`
    );
  }
  return names[0];
}
function getSubtypeClass(suffix, name) {
  const subtypes = getSubtypeDict(suffix);
  if (!Object.hasOwn(subtypes, name)) {
    throw new BagSerializationError(`Unknown Bag class '${name}' for TYTX type '${suffix}'`);
  }
  return subtypes[name];
}
function getClsMarker(cls, inherited) {
  return cls === inherited ? null : getSubtypeName(cls);
}

// node_modules/@genrojs/bag/src/bag.js
function* serializationNodes(bag, prefix = []) {
  for (const node of bag) {
    const path = [...prefix, node.label];
    yield [path, node];
    const value = node.getValue(true);
    if (!node.resolver && value instanceof Bag) yield* serializationNodes(value, path);
  }
}
function xmlDateText(value) {
  const iso = value.toISOString();
  const isEpochDate = value.getUTCFullYear() === 1970 && value.getUTCMonth() === 0 && value.getUTCDate() === 1;
  const isMidnight = value.getUTCHours() === 0 && value.getUTCMinutes() === 0 && value.getUTCSeconds() === 0 && value.getUTCMilliseconds() === 0;
  if (isMidnight && !isEpochDate) return iso.slice(0, iso.indexOf("T"));
  const timestamp = iso.replace(/\.000Z$/, "Z");
  if (isEpochDate && !isMidnight) return timestamp.slice(timestamp.indexOf("T") + 1);
  return timestamp;
}
function isDictionary(value) {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
function wireValue(value) {
  if (typeof value === "string") return value.includes("::") ? `${value}::T` : value;
  if (Array.isArray(value)) return value.map(wireValue);
  if (isDictionary(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, wireValue(v)]));
  return value;
}
function ingestionOptions(options) {
  if (!isDictionary(options)) throw new TypeError("Bag options must be an object");
  const { recursive = true } = options;
  if (typeof recursive !== "boolean") throw new TypeError("recursive must be a boolean");
  return recursive;
}
var warnedFromJson = false;
var Bag = class _Bag {
  static tytxSuffix = "X";
  /**
   * Create a new Bag.
   *
   * @param {Object|Array|null} [source=null] - In-memory data with literal string labels.
   * @param {{recursive?: boolean}} [options={}] - Convert nested containers (default true).
   */
  constructor(source = null, options = {}) {
    this._nodes = new BagNodeContainer();
    this._backref = false;
    this._parent = null;
    this._parentNode = null;
    this._rootAttributes = null;
    this._updSubscribers = {};
    this._insSubscribers = {};
    this._delSubscribers = {};
    ingestionOptions(options);
    if (source !== null && source !== void 0) {
      this.fillFrom(source, options);
    }
  }
  // -------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------
  get parent() {
    return this._parent;
  }
  set parent(value) {
    this._parent = value;
  }
  get parentNode() {
    return this._parentNode;
  }
  set parentNode(value) {
    this._parentNode = value;
  }
  get backref() {
    return Boolean(this._backref);
  }
  /**
   * Node class used to create new nodes. Override in subclasses
   * to use custom BagNode subclasses.
   *
   * @returns {Function} The BagNode constructor.
   */
  get nodeClass() {
    return BagNode;
  }
  createChildBag() {
    return new this.constructor();
  }
  /**
   * Full path from root Bag to this Bag.
   *
   * Returns the dot-separated path from the root of the hierarchy to this
   * Bag. Returns null if backref mode is not enabled or if this is the root.
   *
   * @returns {string|null} The full path or null.
   */
  get fullpath() {
    if (this._parent !== null && this._parentNode !== null) {
      const parentFullpath = this._parent.fullpath;
      if (parentFullpath) {
        return `${parentFullpath}.${this._parentNode.label}`;
      } else {
        return this._parentNode.label;
      }
    }
    return null;
  }
  /**
   * Get dot-separated path from this Bag to a descendant node.
   *
   * Walks up from the node to this Bag collecting labels.
   * Requires backref mode enabled.
   *
   * @param {BagNode} node - A descendant BagNode.
   * @returns {string|null} The relative path, or null if not a descendant.
   */
  relativePath(node) {
    const parts = [];
    let current = node;
    while (current !== null) {
      if (current.parentBag === this) {
        parts.push(current.label);
        parts.reverse();
        return parts.join(".");
      }
      parts.push(current.label);
      current = current.parentNode;
    }
    return null;
  }
  get length() {
    return this._nodes.length;
  }
  /**
   * Root Bag of the hierarchy.
   *
   * Traverses the parent chain to find the topmost Bag. If this Bag has no
   * parent, returns itself.
   *
   * @returns {Bag} The root Bag.
   */
  get root() {
    let curr = this;
    while (curr.parent !== null) {
      curr = curr.parent;
    }
    return curr;
  }
  /**
   * Attributes of the node containing this Bag.
   *
   * Returns the attributes of the parent node that contains this Bag.
   * Returns an empty object if this Bag has no parent node.
   *
   * @returns {Object} Attributes dictionary.
   */
  get attributes() {
    if (this._parentNode !== null) {
      return this._parentNode.getAttr();
    }
    return {};
  }
  /**
   * Root-level attributes for this Bag hierarchy.
   *
   * These are special attributes stored at the hierarchy level,
   * independent of any node attributes.
   *
   * @returns {Object|null} Root attributes or null.
   */
  get rootAttributes() {
    return this._rootAttributes;
  }
  set rootAttributes(attrs) {
    this._rootAttributes = attrs !== null ? { ...attrs } : null;
  }
  // -------------------------------------------------------------------------
  // _htraverse helpers
  // -------------------------------------------------------------------------
  /**
   * Parse path and handle #parent navigation.
   *
   * @param {string|Array} path - Dot-separated path or array of segments.
   * @returns {Array} Tuple of [curr, pathlist].
   */
  _htraverseBefore(path) {
    let curr = this;
    let pathlist;
    if (typeof path === "string") {
      path = path.replace(/\.\.\//g, "#parent.");
      pathlist = path.split(".").filter((x) => x);
    } else {
      pathlist = [...path];
    }
    while (pathlist.length && pathlist[0] === "#parent" && curr !== null) {
      pathlist.shift();
      curr = curr.parent;
    }
    return [curr, pathlist];
  }
  // -------------------------------------------------------------------------
  // _htraverse
  // -------------------------------------------------------------------------
  /**
   * Traverse a hierarchical path.
   *
   * A `#parent` segment (also the `../` alias, expanded by _htraverseBefore)
   * walks up to the parent Bag. It is handled both as a leading segment and
   * inside the path; it requires backref/parent to be set, otherwise the
   * traversal breaks (read → null; write → stops short).
   *
   * @param {string|Array} path - Path as dot-separated string or array.
   * @param {boolean} [writeMode=false] - If true, create intermediate Bags.
   * @param {boolean} [isStatic=true] - If true, don't trigger resolvers.
   * @returns {Array} Tuple of [container, label].
   */
  _htraverse(path, writeMode = false, isStatic = true) {
    let [curr, pathlist] = this._htraverseBefore(path);
    if (curr === null) {
      return [null, null];
    }
    if (pathlist.length === 0) {
      return [curr, ""];
    }
    while (pathlist.length > 1 && curr instanceof _Bag) {
      const segment = pathlist[0];
      if (segment === "#parent") {
        if (curr.parent === null || curr.parent === void 0) {
          break;
        }
        pathlist.shift();
        curr = curr.parent;
        continue;
      }
      const node = curr._nodes.get(segment);
      if (!node) {
        break;
      }
      const value = node.getValue(isStatic);
      if (value instanceof _Bag) {
        pathlist.shift();
        curr = value;
      } else if (writeMode) {
        const newBag = curr.createChildBag();
        node.setValue(newBag, true, null, true, true, "autocreate");
        pathlist.shift();
        curr = newBag;
      } else {
        break;
      }
    }
    if (!writeMode) {
      if (pathlist.length > 1) {
        return [null, null];
      }
      return [curr, pathlist[0]];
    }
    while (pathlist.length > 1) {
      const label = pathlist.shift();
      if (label.startsWith("#")) {
        throw new BagException("Not existing index in #n syntax");
      }
      const newBag = curr.createChildBag();
      curr._nodes.set(label, newBag, ">", null, curr, null, false, true, "autocreate");
      curr = newBag;
    }
    return [curr, pathlist[0]];
  }
  // -------------------------------------------------------------------------
  // get (single level)
  // -------------------------------------------------------------------------
  /**
   * Get value at a single level (no path traversal).
   *
   * @param {string} label - Node label to look up.
   * @param {*} [defaultValue=null] - Value to return if label not found.
   * @param {boolean} [isStatic=true] - If true, don't trigger resolvers.
   * @param {Object} [kwargs={}] - Additional kwargs passed to resolver.
   * @returns {*} The node's value if found, otherwise default.
   */
  get(label, defaultValue = null, isStatic = true, kwargs = {}) {
    if (!label) {
      return this;
    }
    if (label === "#parent") {
      return this.parent;
    }
    let queryString = null;
    if (label.includes("?")) {
      [label, queryString] = label.split("?", 2);
    }
    const node = this._nodes.get(label);
    if (!node) {
      return defaultValue;
    }
    return node.getValue(isStatic, queryString, kwargs);
  }
  // -------------------------------------------------------------------------
  // getItem
  // -------------------------------------------------------------------------
  /**
   * Get value at a hierarchical path.
   *
   * @param {string} path - Hierarchical path like 'a.b.c'.
   * @param {*} [defaultValue=null] - Value to return if path not found.
   * @param {boolean} [isStatic=false] - If true, don't trigger resolvers.
   * @param {Object} [kwargs={}] - Additional kwargs passed to resolver at final path.
   * @returns {*} The value at the path if found, otherwise default.
   */
  getItem(path, defaultValue = null, isStatic = false, kwargs = {}) {
    if (!path) {
      return this;
    }
    const [obj, label] = this._htraverse(path, false, isStatic);
    if (obj instanceof _Bag) {
      return obj.get(label, defaultValue, isStatic, kwargs);
    }
    return defaultValue;
  }
  // -------------------------------------------------------------------------
  // setItem
  // -------------------------------------------------------------------------
  /**
   * Set value at a hierarchical path.
   *
   * An empty path raises RangeError without modifying the Bag.
   *
   * Resolver handling:
   *   - resolver=null (default): throw if node already has a resolver
   *   - resolver=false: remove existing resolver and set value
   *   - resolver=BagResolver: replace resolver
   *
   * @param {string} path - Hierarchical path like 'a.b.c'.
   * @param {*} value - Value to set at the path.
   * @param {Object} [attr=null] - Optional attributes to set on the node.
   * @param {string|number|null} [nodePosition='>'] - Position for new nodes.
   * @param {boolean} [updattr=false] - If false, clear existing attributes first.
   * @param {boolean} [removeNullAttributes=true] - If true, remove null values from attributes.
   * @param {string} [reason=null] - Reason for the change (for events).
   * @param {boolean} [fired=false] - If true, reset value to null after setting.
   * @param {boolean} [doTrigger=true] - If false, suppress events.
   * @param {*} [resolver=null] - Resolver handling for existing nodes.
   * @param {string} [nodeTag=null] - Semantic type tag for the node.
   * @returns {BagNode} The created or updated BagNode.
   */
  setItem(path, value, attr = null, nodePosition = ">", updattr = false, removeNullAttributes = true, reason = null, fired = false, doTrigger = true, resolver = null, nodeTag = null) {
    if (path === "") {
      throw new RangeError("setItem requires a non-empty path");
    }
    const [obj, label] = this._htraverse(path, true);
    return obj._nodes.set(
      label,
      value,
      nodePosition,
      attr,
      obj,
      resolver,
      updattr,
      removeNullAttributes,
      reason,
      doTrigger,
      fired,
      nodeTag
    );
  }
  // -------------------------------------------------------------------------
  // _pop (internal)
  // -------------------------------------------------------------------------
  /**
   * Internal pop by label at current level.
   *
   * @param {string} label - Node label to remove.
   * @param {string|null} [reason=null] - Reason for deletion (for events).
   * @returns {BagNode|null} The removed BagNode, or null if not found.
   */
  _pop(label, reason = null) {
    const p = this._nodes.index(label);
    if (p >= 0) {
      const node = this._nodes.pop(p);
      if (this.backref) {
        this._onNodeDeleted(node, p, null, reason);
      }
      return node;
    }
    return null;
  }
  // -------------------------------------------------------------------------
  // pop
  // -------------------------------------------------------------------------
  /**
   * Remove a node and return its value.
   *
   * Traverses to the path, removes the node, and returns its value.
   *
   * @param {string} path - Hierarchical path to the node to remove.
   * @param {*} [defaultValue=null] - Value to return if path not found.
   * @param {string|null} [reason=null] - Reason for deletion (for events).
   * @returns {*} The value of the removed node, or default if not found.
   */
  pop(path, defaultValue = null, reason = null) {
    const node = this.popNode(path, reason);
    return node ? node.value : defaultValue;
  }
  /**
   * Alias for pop.
   */
  delItem(path, defaultValue = null, reason = null) {
    return this.pop(path, defaultValue, reason);
  }
  // -------------------------------------------------------------------------
  // popNode
  // -------------------------------------------------------------------------
  /**
   * Remove and return the BagNode at a path.
   *
   * Like pop(), but returns the entire BagNode instead of just its value.
   *
   * @param {string} path - Hierarchical path to the node to remove.
   * @param {string|null} [reason=null] - Reason for deletion (for events).
   * @returns {BagNode|null} The removed BagNode, or null if not found.
   */
  popNode(path, reason = null) {
    const [obj, label] = this._htraverse(path, false, true);
    if (!obj || !label) return null;
    const node = obj._nodes.get(label);
    if (!node) return null;
    try {
      return obj._pop(label, reason);
    } finally {
      if (node.parentBag === obj && obj._nodes._dict[node.label] !== node) {
        node.parentBag = null;
      }
    }
  }
  // -------------------------------------------------------------------------
  // clear
  // -------------------------------------------------------------------------
  /**
   * Remove all nodes from this Bag.
   *
   * Empties the Bag completely. In backref mode, triggers delete events
   * for all removed nodes.
   */
  clear() {
    const oldNodes = [...this._nodes];
    this._nodes.clear();
    if (this.backref) {
      this._onNodeDeleted(oldNodes, -1);
    }
    for (const node of oldNodes) {
      node.parentBag = null;
    }
  }
  // -------------------------------------------------------------------------
  // getNode
  // -------------------------------------------------------------------------
  /**
   * Get the BagNode at a path (not its value).
   *
   * @param {string|number|null} path - Hierarchical path like 'a.b.c', integer index, or null.
   * @param {boolean} [isStatic=true] - If true, don't trigger resolvers.
   * @param {boolean} [autocreate=false] - If true, create node if not found.
   * @param {*} [defaultValue=null] - Default value for autocreated node.
   * @returns {BagNode|null} The BagNode if found, null otherwise.
   */
  getNode(path, isStatic = true, autocreate = false, defaultValue = null) {
    if (path === null || path === void 0 || path === "") {
      return this.parentNode;
    }
    if (typeof path === "number") {
      return this._nodes.get(path);
    }
    if (typeof path === "string") {
      path = path.split("?", 1)[0];
    }
    const [obj, label] = this._htraverse(path, autocreate, isStatic);
    if (obj instanceof _Bag && label) {
      const node = obj._nodes.get(label);
      if (node) {
        return node;
      }
      if (autocreate) {
        obj._nodes.set(
          label,
          defaultValue,
          ">",
          null,
          obj,
          null,
          false,
          true,
          "autocreate"
        );
        return obj._nodes.get(label);
      }
    }
    return null;
  }
  // -------------------------------------------------------------------------
  // Backref system
  // -------------------------------------------------------------------------
  /**
   * Enable backref mode (tree-leaf model with parent references).
   *
   * @param {BagNode|null} [node=null] - The BagNode that contains this Bag.
   * @param {Bag|null} [parent=null] - The parent Bag.
   */
  setBackref(node = null, parent = null) {
    const alreadyEnabled = this._backref;
    this._backref = true;
    this._parent = parent;
    this._parentNode = node;
    if (alreadyEnabled) return;
    this._nodes._parentBag = this;
    for (const n of this) {
      n.parentBag = this;
    }
  }
  /**
   * Clear parent reference and disable backref.
   */
  delParentRef() {
    this._parent = null;
    this._parentNode = null;
    this._backref = false;
  }
  /**
   * Clear all backref assumptions recursively.
   */
  clearBackref() {
    if (this._backref) {
      this._backref = false;
      this._parent = null;
      this._parentNode = null;
      this._nodes._parentBag = null;
      for (const node of this) {
        node.parentBag = null;
        const value = node.getValue(true);
        if (value instanceof _Bag) {
          value.clearBackref();
        }
      }
    }
  }
  // -------------------------------------------------------------------------
  // Event triggers
  // -------------------------------------------------------------------------
  /**
   * Trigger for node change events.
   *
   * @param {BagNode} node - The changed node.
   * @param {string[]} pathlist - Path to the node.
   * @param {string} evt - Event type ('upd_value', 'upd_attrs', 'upd_value_attr').
   * @param {*} [oldvalue=null] - Previous value (for value changes).
   * @param {Object|null} [attrsDiff=null] - Attribute diff dict { name: { old, new } }
   *   (for attribute changes).
   * @param {string|null} [reason=null] - Reason for change.
   * @param {boolean} [fired=false] - True when the change is a fired write.
   */
  _onNodeChanged(node, pathlist, evt, oldvalue = null, attrsDiff = null, reason = null, fired = false) {
    for (const s of Object.values(this._updSubscribers)) {
      s({ node, pathlist, oldvalue, attrs_diff: attrsDiff, evt, reason, fired });
    }
    if (this._parent && this._parentNode) {
      this._parent._onNodeChanged(
        node,
        [this._parentNode.label, ...pathlist],
        evt,
        oldvalue,
        attrsDiff,
        reason,
        fired
      );
    }
  }
  /**
   * Trigger for node insert events.
   *
   * @param {BagNode} node - The inserted node.
   * @param {number} ind - Index where inserted.
   * @param {string[]|null} [pathlist=null] - Path to the node.
   * @param {string|null} [reason=null] - Reason for insertion.
   * @param {boolean} [fired=false] - True when the insertion is a fired write.
   */
  _onNodeInserted(node, ind, pathlist = null, reason = null, fired = false) {
    const parent = node.parentBag;
    const value = node.getValue(true);
    if (parent !== null && parent.backref && value instanceof _Bag) {
      value.setBackref(node, parent);
    }
    if (pathlist === null) {
      pathlist = [];
    }
    for (const s of Object.values(this._insSubscribers)) {
      s({ node, pathlist, ind, evt: "ins", reason, fired });
    }
    if (this._parent && this._parentNode) {
      this._parent._onNodeInserted(
        node,
        ind,
        [this._parentNode.label, ...pathlist],
        reason,
        fired
      );
    }
  }
  /**
   * Trigger for node delete events.
   *
   * @param {BagNode|BagNode[]} node - The deleted node(s).
   * @param {number} ind - Index where deleted (-1 for clear).
   * @param {string[]|null} [pathlist=null] - Path to the node.
   * @param {string|null} [reason=null] - Reason for deletion.
   */
  _onNodeDeleted(node, ind, pathlist = null, reason = null) {
    for (const s of Object.values(this._delSubscribers)) {
      s({ node, pathlist, ind, evt: "del", reason });
    }
    if (this._parent && this._parentNode) {
      if (pathlist === null) {
        pathlist = [];
      }
      this._parent._onNodeDeleted(
        node,
        ind,
        [this._parentNode.label, ...pathlist],
        reason
      );
    }
  }
  // -------------------------------------------------------------------------
  // Subscription
  // -------------------------------------------------------------------------
  /**
   * Internal subscribe helper.
   */
  _subscribe(subscriberId, subscribersDict, callback) {
    if (callback !== null && callback !== void 0) {
      subscribersDict[subscriberId] = callback;
    }
  }
  /**
   * Subscribe to bag events.
   *
   * @param {string} subscriberId - Unique identifier for this subscription.
   * @param {Object} options - Subscription options.
   * @param {Function} [options.update] - Callback for update events.
   * @param {Function} [options.insert] - Callback for insert events.
   * @param {Function} [options.delete] - Callback for delete events.
   * @param {Function} [options.any] - Callback for all events.
   */
  subscribe(subscriberId, options = {}) {
    if (Object.hasOwn(options, "timer") || Object.hasOwn(options, "interval")) {
      throw new TypeError("Timer subscriptions were removed. Schedule polling in the application.");
    }
    const { update = null, insert = null, delete: del = null, any = null } = options;
    if (!this.backref) {
      this.setBackref();
    }
    this._subscribe(subscriberId, this._updSubscribers, update || any);
    this._subscribe(subscriberId, this._insSubscribers, insert || any);
    this._subscribe(subscriberId, this._delSubscribers, del || any);
  }
  /**
   * Unsubscribe from bag events.
   *
   * @param {string} subscriberId - The subscription identifier to remove.
   * @param {Object} options - Unsubscription options.
   * @param {boolean} [options.update=false] - Remove update subscription.
   * @param {boolean} [options.insert=false] - Remove insert subscription.
   * @param {boolean} [options.delete=false] - Remove delete subscription.
   * @param {boolean} [options.any=false] - Remove all subscriptions.
   */
  unsubscribe(subscriberId, options = {}) {
    if (Object.hasOwn(options, "timer") || Object.hasOwn(options, "interval")) {
      throw new TypeError("Timer subscriptions were removed. Schedule polling in the application.");
    }
    const { update = false, insert = false, delete: del = false, any = false } = options;
    if (update || any) {
      delete this._updSubscribers[subscriberId];
    }
    if (insert || any) {
      delete this._insSubscribers[subscriberId];
    }
    if (del || any) {
      delete this._delSubscribers[subscriberId];
    }
  }
  // -------------------------------------------------------------------------
  // Iteration
  // -------------------------------------------------------------------------
  /**
   * Iterate over BagNodes.
   */
  [Symbol.iterator]() {
    return this._nodes[Symbol.iterator]();
  }
  /**
   * Return node labels in order.
   *
   * @returns {string[]} Array of labels.
   */
  keys() {
    return this._nodes.keys();
  }
  /**
   * Return node values in order.
   *
   * @returns {Array} Array of values.
   */
  values() {
    return this._nodes.values();
  }
  /**
   * Return key/value objects in node order, resolving values as needed.
   *
   * @returns {Array<{key: string, value: *}>} Array of key/value objects.
   */
  items() {
    return [...this._nodes].map((node) => ({ key: node.label, value: node.getValue() }));
  }
  // -------------------------------------------------------------------------
  // Node Access Methods
  // -------------------------------------------------------------------------
  /**
   * Property alias for getNodes().
   *
   * @returns {BagNode[]} List of BagNodes.
   */
  get nodes() {
    return this.getNodes();
  }
  /**
   * Get a first-level node by label or index.
   *
   * Sync method for quick access to direct child nodes.
   * Does not traverse paths or trigger resolvers.
   *
   * @param {string|number} key - Node label (str) or index (int).
   * @returns {BagNode|null} The BagNode if found, null otherwise.
   *
   * @example
   * bag.node('a').value  // 1
   * bag.node(0).label    // 'a'
   */
  node(key) {
    return this._nodes.get(key);
  }
  /**
   * Set attributes on a node at the given path.
   *
   * @param {string|null} [path=null] - Path to the node.
   * @param {Object|null} [attr=null] - Dict of attributes to set.
   * @param {boolean} [removeNullAttributes=true] - If true, remove attributes with null value.
   */
  setAttr(path = null, attr = null, removeNullAttributes = true) {
    const node = _Bag.prototype.getNode.call(this, path, true, true);
    if (node) {
      node.setAttr(attr, true, true, removeNullAttributes);
    }
  }
  /**
   * Get an attribute from a node at the given path.
   *
   * @param {string|null} [path=null] - Path to the node.
   * @param {string|null} [attr=null] - Attribute name to get.
   * @param {*} [defaultVal=null] - Default value if node or attribute not found.
   * @returns {*} Attribute value or default.
   */
  getAttr(path = null, attr = null, defaultVal = null) {
    const node = this.getNode(path);
    if (node) {
      return node.getAttr(attr, defaultVal);
    }
    return defaultVal;
  }
  /**
   * Delete attributes from a node at the given path.
   *
   * @param {string|null} [path=null] - Path to the node.
   * @param {...string} attrs - Attribute names to delete.
   */
  delAttr(path = null, ...attrs) {
    const node = this.getNode(path);
    if (node) {
      node.delAttr(...attrs);
    }
  }
  /**
   * Get inherited attributes from parent chain.
   *
   * @returns {Object} Dict of attributes inherited from parent nodes.
   */
  getInheritedAttributes() {
    if (this._parentNode) {
      return this._parentNode.getInheritedAttributes();
    }
    return {};
  }
  // -------------------------------------------------------------------------
  // Query Methods (BagQuery)
  // -------------------------------------------------------------------------
  /**
   * Get the actual list of nodes contained in the Bag.
   *
   * The getNodes method works as the filter of a list.
   *
   * @param {Function|null} [condition=null] - Optional callable that takes a BagNode and returns bool.
   * Returns a new list of shared nodes. List mutations do not change the Bag;
   * node mutations do. Later structural changes are not reflected in the list.
   * @returns {BagNode[]} Snapshot of BagNodes, optionally filtered by condition.
   */
  getNodes(condition = null) {
    if (!condition) {
      return [...this._nodes];
    }
    return [...this._nodes].filter((n) => condition(n));
  }
  /**
   * Return the first BagNode whose value contains key=value.
   *
   * Searches only direct children (not recursive).
   * The node's value must be dict-like (Bag or dict).
   *
   * @param {string} key - Key to look for in node.value.
   * @param {*} value - Value to match.
   * @returns {BagNode|null} BagNode if found, null otherwise.
   */
  getNodeByValue(key, value) {
    for (const node of this._nodes) {
      const nodeValue = node.value;
      if (nodeValue instanceof _Bag) {
        if (nodeValue.getItem(key) === value) return node;
      } else if (nodeValue && nodeValue.get && nodeValue.get(key) === value) {
        return node;
      }
    }
    return null;
  }
  /**
   * Return the first BagNode with the requested attribute value.
   *
   * Search strategy (hybrid depth-first with level priority):
   * 1. First checks all direct children of current Bag
   * 2. Then recursively searches into sub-Bags (depth-first)
   *
   * This means a match at the current level is always found before
   * descending into nested Bags, but once descent begins, it proceeds
   * depth-first through the subtree before checking siblings.
   *
   * @param {string} attr - Attribute name to search.
   * @param {*} value - Attribute value; undefined searches for presence.
   * @param {boolean} [caseInsensitive=false] - Compare strings ignoring case.
   * @param {boolean} [deep_first=false] - Visit subtrees before next siblings.
   * @returns {BagNode|null} BagNode if found, null otherwise.
   */
  getNodeByAttr(attr, value, caseInsensitive = false, deep_first = false) {
    const existsOnly = value === void 0;
    const expected = caseInsensitive && typeof value === "string" ? value.toLowerCase() : value;
    const search = (bag) => {
      const subBags = [];
      for (const node of bag._nodes) {
        if (attr in node.attr) {
          const current = caseInsensitive && typeof node.attr[attr] === "string" ? node.attr[attr].toLowerCase() : node.attr[attr];
          if (existsOnly || current == expected) return node;
        }
        if (node._value instanceof _Bag) {
          if (deep_first) {
            const found = search(node._value);
            if (found) return found;
          } else {
            subBags.push(node._value);
          }
        }
      }
      for (const child of subBags) {
        const found = search(child);
        if (found) return found;
      }
      return null;
    };
    return search(this);
  }
  /**
   * Check if the Bag is empty.
   *
   * A node is considered non-empty if:
   * - It has a resolver (even if static value is null, the resolver
   *   represents potential content that can be loaded)
   * - It has a non-null static value (unless zeroIsNone/blankIsNone apply)
   *
   * This method never triggers resolver I/O - it only checks static values
   * and resolver presence.
   *
   * @param {boolean} [zeroIsNone=false] - If true, treat 0 values as empty.
   * @param {boolean} [blankIsNone=false] - If true, treat blank strings as empty.
   * @returns {boolean} True if Bag is empty according to criteria, false otherwise.
   */
  isEmpty(zeroIsNone = false, blankIsNone = false) {
    if (this._nodes.length === 0) {
      return true;
    }
    for (const node of this._nodes) {
      if (node._resolver !== null) {
        return false;
      }
      const v = node.getValue(true);
      if (v === null || v === void 0) {
        continue;
      }
      if (zeroIsNone && v === 0) {
        continue;
      }
      if (blankIsNone && v === "") {
        continue;
      }
      return false;
    }
    return true;
  }
  /**
   * Query Bag elements, extracting specified data.
   *
   * @param {string|Array|null} [what=null] - String of special keys separated by comma, or array of keys.
   *     Special keys:
   *     - '#k': label of each item
   *     - '#v': value of each item
   *     - '#v.path': inner values of each item
   *     - '#__v': static value (always bypasses resolver)
   *     - '#a': all attributes of each item
   *     - '#a.attrname': specific attribute for each item
   *     - '#p': path (full path from root, useful with deep=true)
   *     - '#n': node (the BagNode itself)
   *     - callable: custom function applied to each node
   * @param {Function|boolean|null} [condition=null] - Optional callable filter (receives BagNode, returns bool).
   * A boolean is the deprecated legacy asColumns argument and emits a warning.
   * @param {boolean} [iter=false] - If true, return a generator instead of an array.
   * @param {boolean} [deep=false] - If true, traverse recursively (depth-first) instead of first level only.
   * @param {boolean} [leaf=true] - If true (default), include leaf nodes (non-Bag values).
   * @param {boolean} [branch=true] - If true (default), include branch nodes (Bag values).
   * @param {number|null} [limit=null] - Maximum number of results to return. null means no limit.
   * @param {boolean} [isStatic=true] - If true (default), don't trigger resolvers during traversal.
   * @returns {Array|Generator} Array of tuples, or generator if iter=true.
   */
  query(what = null, condition = null, iter = false, deep = false, leaf = true, branch2 = true, limit = null, isStatic = true) {
    if (!what) {
      what = "#k,#v,#a";
    }
    let obj = this;
    let whatsplit;
    if (typeof what === "string") {
      if (what.includes(":")) {
        const [where, whatPart] = what.split(":");
        obj = this.getItem(where);
        what = whatPart;
      }
      whatsplit = what.split(",").map((x) => x.trim());
    } else {
      whatsplit = what;
    }
    const _extractValue = (node, w, path, isDeep, readValue) => {
      if (w === "#k") {
        return node.label;
      } else if (w === "#p") {
        return path;
      } else if (w === "#n") {
        return node;
      } else if (typeof w === "function") {
        return w(node);
      } else if (w === "#v") {
        const v = readValue();
        return isDeep && v instanceof _Bag ? null : v;
      } else if (w.startsWith("#v.")) {
        const innerPath = w.split(".").slice(1).join(".");
        const value = readValue();
        return value && value.getItem ? value.getItem(innerPath) : null;
      } else if (w === "#__v") {
        return node.getValue(true);
      } else if (w.startsWith("#a")) {
        const attr = w.includes(".") ? w.split(".").slice(1).join(".") : null;
        return node.getAttr(attr);
      } else {
        const value = readValue();
        return value && value.getItem ? value.getItem(w) : null;
      }
    };
    function* _iterDigest() {
      let count = 0;
      function* visit(bag, prefix) {
        for (const node of bag._nodes) {
          const path = prefix ? `${prefix}.${node.label}` : node.label;
          let loaded = false;
          let value;
          const readValue = () => {
            if (!loaded) {
              value = node.getValue(isStatic);
              loaded = true;
            }
            return value;
          };
          const included = leaf && branch2 || (readValue() instanceof _Bag ? branch2 : leaf);
          if (included && (condition === null || condition(node))) {
            yield whatsplit.length === 1 ? _extractValue(node, whatsplit[0], path, deep, readValue) : whatsplit.map((w) => _extractValue(node, w, path, deep, readValue));
            count++;
            if (limit !== null && count >= limit) return;
          }
          if (deep) {
            const child = readValue();
            if (child instanceof _Bag) {
              yield* visit(child, path);
              if (limit !== null && count >= limit) return;
            }
          }
        }
      }
      yield* visit(obj, "");
    }
    if (iter) {
      return _iterDigest();
    }
    return [..._iterDigest()];
  }
  /**
   * Return [relative path, value] pairs for non-Bag leaves.
   * Resolve each node once per occurrence. Empty Bags produce no leaf entry.
   * Paths do not require parent backrefs.
   */
  getLeaves() {
    const result = [];
    const collect = (bag, prefix) => {
      for (const node of bag._nodes) {
        const path = prefix ? `${prefix}.${node.label}` : node.label;
        const value = node.getValue(false);
        if (value instanceof _Bag) collect(value, path);
        else result.push([path, value]);
      }
    };
    collect(this, "");
    return result;
  }
  /**
   * Return a list of tuples with keys/values/attributes (backward compatible).
   *
   * This is an alias for query() with iter=false, deep=false for backward
   * compatibility. Use query() for new code.
   *
   * @param {string|Array|null} [what=null] - String of special keys separated by comma, or array of keys.
   * @param {Function|boolean|null} [condition=null] - Optional callable filter (receives BagNode, returns bool).
   * A boolean is the deprecated legacy asColumns argument and emits a warning.
   * @param {boolean} [asColumns=false] - If true, return array of arrays (transposed).
   * @returns {Array} Array of tuples (or array of arrays if asColumns=true).
   */
  digest(what = null, condition = null, asColumns = false) {
    if (typeof condition === "boolean") {
      console.warn("Bag.digest(what, asColumns) is deprecated; use digest(what, null, asColumns).");
      asColumns = condition;
      condition = null;
    }
    const result = this.query(what, condition, false, false, true, true, null, false);
    if (asColumns) {
      if (!result || result.length === 0) {
        const whatStr = typeof what === "string" ? what : "#k,#v,#a";
        const whatsplit = whatStr.split(",").map((x) => x.trim());
        return whatsplit.map(() => []);
      }
      const resultList = [...result];
      if (resultList.length && Array.isArray(resultList[0])) {
        const numCols = resultList[0].length;
        const columns = [];
        for (let i = 0; i < numCols; i++) {
          columns.push(resultList.map((row) => row[i]));
        }
        return columns;
      }
      return [resultList];
    }
    return [...result];
  }
  /**
   * Return digest result as columns.
   *
   * @param {string|Array} cols - Column names as comma-separated string or array.
   * @param {boolean} [attrMode=false] - If true, prefix columns with '#a.' for attribute access.
   * @returns {Array} Array of arrays (columns).
   */
  columns(cols, attrMode = false) {
    if (typeof cols === "string") {
      cols = cols.split(",");
    }
    const mode = attrMode ? "#a." : "";
    const what = cols.map((col) => `${mode}${col}`).join(",");
    return this.digest(what, null, true);
  }
  /**
   * Sum selected values at the current level; never traverse recursively.
   * @param {string} [what='#v'] - Query criterion, or comma-separated criteria.
   * @param {boolean} [strict=false] - Return null for null/undefined/empty string.
   * Otherwise these values contribute zero. Non-numeric values are ignored
   * unless strict, which raises TypeError. Zero and false remain valid.
   * @param {Function|null} [condition=null] - Optional BagNode predicate.
   * @returns {number|null|Array} One result, or one result per criterion.
   */
  sum(what = "#v", strict = false, condition = null) {
    if (strict != null && typeof strict !== "boolean") {
      throw new TypeError("sum strict must be a boolean; pass condition as the third argument");
    }
    if (condition != null && typeof condition !== "function") {
      throw new TypeError("sum condition must be callable; deep is no longer supported");
    }
    const total = (criterion) => {
      let result = 0;
      let missing = false;
      for (const value of this.query(criterion, condition)) {
        if (value == null || value === "") {
          missing = true;
          continue;
        }
        if (typeof value !== "number" && typeof value !== "boolean") {
          if (strict) throw new TypeError(`sum encountered non-numeric value: ${typeof value}`);
          continue;
        }
        result += value;
      }
      return strict && missing ? null : result;
    };
    return what.includes(",") ? what.split(",").map((w) => total(w.trim())) : total(what);
  }
  /**
   * Sort nodes in place.
   *
   * @param {string|Function} [key='#k:a'] - Sort specification string or callable.
   *     If callable, used directly as key function for sort.
   *     If string, format is 'criterion:mode' or multiple 'c1:m1,c2:m2'.
   *
   *     Criteria:
   *     - '#k': sort by label
   *     - '#v': sort by value
   *     - '#a.attrname': sort by attribute
   *     - 'fieldname': sort by field in value (if value is dict/Bag)
   *
   *     Modes:
   *     - 'a': ascending, case-insensitive (default)
   *     - 'A': ascending, case-sensitive
   *     - 'd': descending, case-insensitive
   *     - 'D': descending, case-sensitive
   *
   * @returns {Bag} Self (for chaining).
   *
   * @example
   * bag.sort('#k')           // by label ascending
   * bag.sort('#k:d')         // by label descending
   * bag.sort('#v:A')         // by value ascending, case-sensitive
   * bag.sort('#a.name:a')    // by attribute 'name'
   * bag.sort('field:d')      // by field in value
   * bag.sort('#k:a,#v:d')    // multi-level sort
   * bag.sort(n => n.value)   // custom key function
   */
  sort(key = "#k:a") {
    const sortKey = (value, caseInsensitive) => {
      if (value === null || value === void 0) {
        return [-1, ""];
      }
      if (caseInsensitive && typeof value === "string") {
        return [0, value.toLowerCase()];
      }
      return [0, value];
    };
    const compareKeys = (a, b) => {
      if (a[0] !== b[0]) {
        return a[0] - b[0];
      }
      if (a[1] < b[1]) return -1;
      if (a[1] > b[1]) return 1;
      return 0;
    };
    if (typeof key === "function") {
      this._nodes._list.sort((a, b) => {
        const ka = key(a);
        const kb = key(b);
        if (ka < kb) return -1;
        if (ka > kb) return 1;
        return 0;
      });
    } else {
      const levels = key.split(",");
      levels.reverse();
      for (const level of levels) {
        let what, mode;
        if (level.includes(":")) {
          [what, mode] = level.split(":", 2);
        } else {
          what = level;
          mode = "a";
        }
        what = what.trim();
        mode = mode.trim();
        const reverse = mode === "d" || mode === "D";
        const caseInsensitive = mode === "a" || mode === "d";
        let keyFn;
        if (what.toLowerCase() === "#k") {
          keyFn = (n) => sortKey(n.label, caseInsensitive);
        } else if (what.toLowerCase() === "#v") {
          keyFn = (n) => sortKey(n.value, caseInsensitive);
        } else if (what.toLowerCase().startsWith("#a.")) {
          const attrname = what.slice(3);
          keyFn = (n) => sortKey(n.getAttr(attrname), caseInsensitive);
        } else {
          keyFn = (n) => {
            const value = n.value;
            const field = value instanceof _Bag ? value.getItem(what) : value ? value[what] : null;
            return sortKey(field, caseInsensitive);
          };
        }
        this._nodes._list.sort((a, b) => {
          const result = compareKeys(keyFn(a), keyFn(b));
          return reverse ? -result : result;
        });
      }
    }
    return this;
  }
  /**
   * Check equality with another Bag.
   *
   * @param {Bag} other - Bag to compare with.
   * @returns {boolean} True if both Bags have same nodes with same values and attributes.
   */
  equalTo(other) {
    if (!(other instanceof _Bag)) return false;
    return this._nodes.isEqual(other._nodes);
  }
  /**
   * Check if a path or node exists in the Bag.
   *
   * Equivalent to Python's `__contains__` / `in` operator.
   *
   * With the `?attr` query syntax it checks the existence of the named
   * attribute on the target node; `?a&b` requires every named attribute
   * to be present. The check is static: it does not trigger resolvers
   * along the path.
   *
   * @param {string|BagNode} what - Path to check, optionally with a
   *   `?attr` or `?a&b` suffix, or a BagNode to check if it's in this Bag.
   * @returns {boolean} True if the path/node (and named attributes if
   *   provided) exists, false otherwise.
   *
   * @example
   * bag.setItem('a.b', 1);
   * bag.has('a.b')          // true
   * bag.has('a.c')          // false
   * bag.has('a.b?color')    // true if node a.b has attribute 'color'
   * bag.has('a.b?x&y')      // true only if both 'x' and 'y' are present
   */
  has(what) {
    if (typeof what === "string") {
      let queryString = null;
      if (what.includes("?")) {
        [what, queryString] = what.split("?", 2);
      }
      const node = this.getNode(what);
      if (node === null) {
        return false;
      }
      if (queryString === null) {
        return true;
      }
      return queryString.split("&").every((a) => a in node.attr);
    } else if (what && what.label !== void 0) {
      return [...this._nodes].includes(what);
    }
    return false;
  }
  // -------------------------------------------------------------------------
  // Resolver Methods
  // -------------------------------------------------------------------------
  /**
   * Get the resolver at the given path.
   *
   * @param {string} path - Path to the node.
   * @returns {*} The resolver, or null if path doesn't exist or has no resolver.
   */
  getResolver(path) {
    const node = this.getNode(path);
    return node ? node.resolver : null;
  }
  /**
   * Set a resolver at the given path.
   *
   * Creates the node if it doesn't exist, with value=null.
   *
   * @param {string} path - Path to the node.
   * @param {*} resolver - The resolver to set.
   */
  setResolver(path, resolver) {
    let node = this.getNode(path);
    if (!node) {
      this.setItem(path, null);
      node = this.getNode(path);
    }
    node.resolver = resolver;
  }
  /**
   * Set a callback resolver at the given path.
   *
   * Shortcut for creating a BagCbResolver and setting it on a node.
   *
   * @param {string} path - Path to the node.
   * @param {Function} callback - Callable that returns the value.
   * @param {Object} [options={}] - Options passed to BagCbResolver constructor.
   *     - cacheTime: Cache duration in ms (default 0, no cache).
   *     - readOnly: If true, value not saved in node (default false).
   */
  setCallbackItem(path, callback, options = {}) {
    const resolver = new BagCbResolver({ callback, ...options });
    this.setResolver(path, resolver);
  }
  // -------------------------------------------------------------------------
  // Structure Manipulation Methods
  // -------------------------------------------------------------------------
  /**
   * Move element(s) to a new position.
   *
   * @param {number|number[]} what - Index or list of indices to move.
   * @param {number} position - Target index position.
   * @param {boolean} [trigger=true] - If true, fire del/ins events.
   *
   * @example
   * bag.move(0, 2)      // move first element to position 2
   * bag.move([0, 2], 1) // move indices 0 and 2 to position 1
   */
  move(what, position, trigger = true) {
    this._nodes.move(what, position, trigger);
  }
  /**
   * Convert Bag to plain object (first level only).
   *
   * @param {boolean} [ascii=false] - If true, convert keys to ASCII.
   * @param {boolean} [lower=false] - If true, convert keys to lowercase.
   * @param {boolean} [recursive=false] - Convert nested Bags (not ordinary objects/arrays).
   * @param {boolean} [excludeNullValues=false] - Omit null/undefined, retaining empty Bags.
   * @returns {Object} Plain JavaScript object with key-value pairs.
   */
  asDict(ascii = false, lower = false, recursive = false, excludeNullValues = false) {
    const result = {};
    for (const el of this._nodes) {
      let value = el.value;
      if (excludeNullValues && value == null) continue;
      let key = el.label;
      if (ascii) {
        key = String(key);
      }
      if (lower) {
        key = key.toLowerCase();
      }
      if (recursive && value instanceof _Bag) {
        value = _Bag.prototype.asDict.call(value, ascii, lower, recursive, excludeNullValues);
      }
      Object.defineProperty(result, key, {
        value,
        enumerable: true,
        writable: true,
        configurable: true
      });
    }
    return result;
  }
  /**
   * Return value at path, setting it to default if not present.
   *
   * @param {string} path - Path to the value.
   * @param {*} [defaultVal=null] - Default value to set if path doesn't exist.
   * @returns {*} The value at path (existing or newly set default).
   */
  setdefault(path, defaultVal = null) {
    const node = this.getNode(path);
    if (!node) {
      this.setItem(path, defaultVal);
      return defaultVal;
    }
    return node.value;
  }
  /**
   * Return a deep copy of this Bag.
   *
   * Creates a new Bag with copies of all nodes. Nested Bags are
   * recursively deep copied. Values are copied by reference unless
   * they are Bags. Node attributes are copied as a new dict.
   *
   * @param {boolean} [resolve=false] - Resolve values before copying.
   * @returns {Bag} A new Bag with copied nodes.
   *
   * @example
   * const copy = bag.deepcopy();
   * copy.setItem('b.c', 3);
   * // Original bag['b.c'] unchanged
   */
  deepcopy(resolve = false) {
    const result = this.createChildBag();
    for (const node of this._nodes) {
      let value = node.getValue(!resolve);
      if (value instanceof _Bag) value = value.deepcopy(resolve);
      const copied = new result.nodeClass(result, node.label, value);
      copied.setAttr({ ...node.attr }, false, false, false);
      copied.nodeTag = node.nodeTag;
      copied.xmlTag = node.xmlTag;
      result._nodes._list.push(copied);
      result._nodes._dict[copied.label] = copied;
    }
    return result;
  }
  /**
   * Merge a Bag or object using the legacy JavaScript argument order.
   *
   * @param {Bag|Object} source - Incoming nodes or key/value properties.
   * @param {string|null} [mode=null] - 'static' preserves source resolvers;
   * otherwise their values are resolved before copying.
   * @param {*} [reason=null] - Modification reason passed to subscribers.
   * @param {boolean} [ignoreNone=false] - Optional extension: preserve existing
   * values when the incoming value is null. It is not the mode argument.
   */
  update(source, mode = null, reason = null, ignoreNone = false) {
    if (!(source instanceof _Bag)) {
      for (const label in source) {
        const value = source[label];
        if (!ignoreNone || value !== null || !this._nodes.has(label)) {
          this.setItem(
            label,
            value,
            null,
            ">",
            false,
            false,
            reason,
            false,
            reason !== false
          );
        }
      }
      return;
    }
    for (const incoming of [...source]) {
      const label = incoming.label;
      const resolver = mode === "static" ? incoming.resolver : null;
      const value = resolver ? null : incoming.getValue();
      const replaceContent = incoming.attr.__replace;
      delete incoming.attr.__replace;
      const current = this._nodes.get(label);
      if (current) {
        current.setAttr(incoming.attr, reason === null ? true : reason, true, false);
        if (incoming.nodeTag != null) current.nodeTag = incoming.nodeTag;
        if (incoming.xmlTag != null) current.xmlTag = incoming.xmlTag;
        if (resolver) {
          current.resolver = resolver;
          current.setValue(
            null,
            reason === null ? true : reason,
            null,
            null,
            false,
            reason
          );
        } else {
          if (incoming.resolver) current.resolver = null;
          const previous = current.getValue();
          if (value instanceof _Bag && previous instanceof _Bag && !replaceContent) {
            previous.update(value, mode, reason, ignoreNone);
          } else if (!ignoreNone || value !== null) {
            current.setValue(
              value,
              reason === null ? true : reason,
              null,
              null,
              false,
              reason
            );
          }
        }
      } else {
        const node = this.setItem(
          label,
          resolver || value,
          incoming.attr,
          ">",
          false,
          false,
          reason,
          false,
          reason !== false
        );
        node.nodeTag = incoming.nodeTag;
        node.xmlTag = incoming.xmlTag;
      }
    }
  }
  // -------------------------------------------------------------------------
  // Construction and Filling Methods
  // -------------------------------------------------------------------------
  /**
   * Copy nodes from another Bag.
   *
   * Clears current contents and copies all nodes from the source Bag.
   * Nested Bags are deep copied.
   *
   * @param {Bag} other - Source Bag to copy from.
   * @private
   */
  _fillFromBag(other) {
    this.clear();
    for (const node of other) {
      const copied = new this.nodeClass(this, node.label);
      copied.replace(node);
      copied.nodeTag = node.nodeTag;
      copied.xmlTag = node.xmlTag;
      this._nodes._list.push(copied);
      this._nodes._dict[copied.label] = copied;
    }
  }
  /**
   * Populate bag from a plain object (dictionary).
   *
   * Clears current contents and creates nodes from object properties.
   * Nested objects are converted to nested Bags.
   *
   * @param {Object} data - Object where keys become labels and values become node values.
   * @private
   */
  _appendLiteral(label, value, attr = null, resolver = null, nodeTag = null) {
    if (typeof label !== "string") throw new TypeError("Bag labels must be strings");
    const node = new this.nodeClass(this, label, null, attr, resolver, nodeTag, null, false);
    if (value instanceof BagResolver) node.resolver = value;
    else node._value = value;
    this._nodes._dict[label] = node;
    this._nodes._list.push(node);
    return node;
  }
  /** Replace in-memory data atomically. None/null clears; leaves stay shared. */
  fillFrom(source = null, options = {}) {
    const recursive = ingestionOptions(options);
    if (source != null && !isDictionary(source) && !Array.isArray(source)) {
      throw new TypeError("Bag source must be a dictionary, array or null");
    }
    const prepared = this.createChildBag();
    const active = /* @__PURE__ */ new Set();
    const populate = (bag, data, path) => {
      if (active.has(data)) throw new TypeError(`Cyclic Bag source at ${path}`);
      active.add(data);
      try {
        const width = Array.isArray(data) ? String(data.length).length + 1 : 0;
        const entries = Array.isArray(data) ? Array.from(data, (value, i) => [`r_${String(i).padStart(width, "0")}`, value]) : Object.entries(data);
        if (!Array.isArray(data) && Object.getOwnPropertySymbols(data).some((key) => Object.prototype.propertyIsEnumerable.call(data, key))) {
          throw new TypeError(`Bag labels must be strings at ${path}`);
        }
        for (const [label, item] of entries) {
          let value = item;
          if (recursive && (isDictionary(value) || Array.isArray(value))) {
            value = this.createChildBag();
            populate(value, item, `${path}[${JSON.stringify(label)}]`);
          }
          bag._appendLiteral(label, value);
        }
      } finally {
        active.delete(data);
      }
    };
    if (source != null) populate(prepared, source, "$");
    return this._replacePrepared(prepared);
  }
  _loadSource(source, options = {}) {
    return this.fillFrom(source, options);
  }
  /** Replace all contents from a Bag, preserving identity. Returns this. */
  replace(other) {
    if (!(other instanceof _Bag)) throw new TypeError("Bag.replace expects a Bag");
    if (other === this) return this;
    const prepared = this.createChildBag();
    prepared._fillFromBag(other);
    return this._replacePrepared(prepared);
  }
  _replacePrepared(prepared) {
    for (const node of this._nodes) {
      node.parentBag = null;
      const value = node.getValue(true);
      if (value instanceof _Bag) value.clearBackref();
    }
    const oldNodes = this._nodes;
    this._nodes = prepared._nodes;
    prepared._nodes = oldNodes;
    this._nodes._parentBag = this.backref ? this : null;
    prepared._nodes._parentBag = null;
    for (const node of this._nodes) node.parentBag = this;
    for (const node of prepared._nodes) node._parentBag = prepared;
    if (this.backref && this.parent && this.parentNode) {
      this.parent._onNodeChanged(
        this.parentNode,
        [this.parentNode.label],
        "upd_value",
        prepared
      );
    }
    return this;
  }
  /**
   * Visit direct nodes, or the full tree with deep=true.
   * Null/undefined descends; falsey non-null results skip children;
   * a truthy result stops the visit and is returned.
   * Callback receives (node, kwargs, siblingIndex).
   */
  forEach(callback, { static: isStatic = true, deep = false, kwargs = {} } = {}) {
    if (typeof callback !== "function") throw new TypeError("forEach requires a callback");
    const visit = (bag, context) => {
      for (let index = 0; index < bag._nodes.length; index++) {
        const node = bag._nodes._list[index];
        const kw = { ...context };
        if ("_pathlist" in context) kw._pathlist = [...context._pathlist, node.label];
        if ("_indexlist" in context) kw._indexlist = [...context._indexlist, index];
        const result = callback(node, kw, index);
        if (result) return result;
        if (result == null && deep) {
          const value = node.getValue(isStatic);
          if (value instanceof _Bag) {
            const innerResult = visit(value, kw);
            if (innerResult) return innerResult;
          }
        }
      }
      return null;
    };
    return visit(this, kwargs);
  }
  /**
   * Yield original nodes depth-first, parent before children.
   * Values are read statically: lazy resolvers are not invoked.
   * Shared subtrees are visited at each path, as in legacy Python.
   * @yields {BagNode}
   */
  *traverse() {
    for (const node of this._nodes) {
      yield node;
      const value = node.getValue(true);
      if (value instanceof _Bag) {
        yield* value.traverse();
      }
    }
  }
  /** Stream path/node pairs for internal query and serialization use. */
  *_iterNodesWithPaths(isStatic = true, prefix = "") {
    for (const node of this._nodes) {
      const path = prefix ? `${prefix}.${node.label}` : node.label;
      yield [path, node];
      const value = node.getValue(isStatic);
      if (value instanceof _Bag) yield* value._iterNodesWithPaths(isStatic, path);
    }
  }
  // -------------------------------------------------------------------------
  // TyTx Serialization
  // -------------------------------------------------------------------------
  /**
   * Flatten nodes into (parent, label, tag, value, attr) tuples for TyTx.
   *
   * @param {Object|null} [pathRegistry=null] - If provided, enable compact mode.
   * @yields {Array} Tuples of [parent, label, tag, value, attr].
   */
  *_nodeFlattener(pathRegistry = null) {
    const compact = pathRegistry !== null;
    const pathToCode = compact ? /* @__PURE__ */ Object.create(null) : null;
    let codeCounter = 0;
    const pathToClass = /* @__PURE__ */ new Map([["[]", this.constructor]]);
    for (const [path, node] of serializationNodes(this)) {
      const parentPath = path.slice(0, -1);
      const pathKey = JSON.stringify(path);
      const parentKey = JSON.stringify(parentPath);
      const nodeValue = node.getValue(true);
      let value;
      let branchCls = null;
      if (node.resolver) {
        value = encodeResolver(node.resolver);
      } else if (nodeValue instanceof _Bag) {
        const cls = nodeValue.constructor;
        const suffix = cls.tytxSuffix;
        pathToClass.set(pathKey, cls);
        branchCls = getClsMarker(cls, getInheritedClass(pathToClass.get(parentKey), suffix));
        value = `::${suffix}`;
      } else if (nodeValue === null) {
        value = "::NN";
      } else {
        value = wireValue(nodeValue);
      }
      if (node.attr && Object.hasOwn(node.attr, CLS_ATTRIBUTE)) {
        throw new BagSerializationError(
          `node '${path}': the attribute '${CLS_ATTRIBUTE}' is reserved for the Bag class name`
        );
      }
      const attr = encodeAttrs(wireValue(node.attr));
      if (branchCls !== null) attr[CLS_ATTRIBUTE] = branchCls;
      const tag2 = node.nodeTag;
      if (compact) {
        const parentRef = parentPath.length ? pathToCode[parentKey] : null;
        yield [parentRef, node.label, tag2, value, attr];
        if (nodeValue instanceof _Bag) {
          pathToCode[pathKey] = codeCounter;
          pathRegistry[codeCounter] = path;
          codeCounter++;
        }
      } else {
        yield [parentPath, node.label, tag2, value, attr];
      }
    }
  }
  /**
   * Serialize Bag to TyTx format.
   *
   * Converts the Bag hierarchy into a flat list of row tuples,
   * then encodes using TyTx which preserves types (Decimal, Date, etc.).
   *
   * @param {string} [transport='json'] - Output format: 'json' or 'msgpack'.
   * @param {boolean} [compact=false] - If true, use numeric path codes.
   * @returns {string|Uint8Array} Serialized data.
   */
  toTytx(transport = "json", compact = false) {
    const payload = this._toTytxPayload(compact);
    const suffix = this.constructor.tytxSuffix;
    if (transport === "json") return `${payload}::${suffix}`;
    if (transport === "msgpack") {
      return encode(new ExtData(4, new TextEncoder().encode(`${suffix}:${payload}`)));
    }
    throw new TypeError(`Unsupported transport: ${transport}`);
  }
  _toTytxPayload(compact = false) {
    let data;
    if (compact) {
      const paths = {};
      const rows = [...this._nodeFlattener(paths)];
      data = { rows, paths };
    } else {
      const rows = [...this._nodeFlattener(null)];
      data = { rows };
    }
    const rootClass = this.constructor;
    const rootCls = getClsMarker(rootClass, getInheritedClass(null, rootClass.tytxSuffix));
    if (rootCls !== null) data[CLS_ATTRIBUTE] = rootCls;
    data.rows = data.rows.map(([parent, label, tag2, value, attr]) => [wireValue(parent), wireValue(label), wireValue(tag2), value, attr]);
    if (data.paths) data.paths = wireValue(data.paths);
    return toTytx(data);
  }
  /**
   * Deserialize Bag from TyTx format.
   *
   * @param {string|Uint8Array} data - Serialized data from toTytx().
   * @param {string} [transport='json'] - Input format: 'json' or 'msgpack'.
   * @returns {Bag} Reconstructed Bag.
   */
  static fromTytx(data, transport = "json", options = {}) {
    if (isDictionary(transport)) {
      options = transport;
      transport = "json";
    }
    ingestionOptions(options);
    if (typeof data !== "string" && !(data instanceof Uint8Array)) {
      throw new TypeError("fromTytx requires serialized text or bytes");
    }
    if (transport !== "json" && transport !== "msgpack") {
      throw new TypeError(`Unsupported transport: ${transport}`);
    }
    if (transport === "json" && data instanceof Uint8Array) data = new TextDecoder().decode(data);
    const decoded = fromTytx(data, transport === "json" ? null : transport);
    if (decoded instanceof _Bag) return decoded;
    if (!isDictionary(decoded) && !Array.isArray(decoded)) {
      throw new TypeError("fromTytx requires a dictionary, array or typed Bag root");
    }
    return new this(decoded, options);
  }
  static _fromTytxPayload(data) {
    const suffix = this.tytxSuffix;
    if (data === "") return new (getInheritedClass(null, suffix))();
    const parsed = fromTytx(data);
    if (!parsed || !Array.isArray(parsed.rows)) {
      throw new BagSerializationError("Invalid TYTX Bag: expected rows");
    }
    const paths = parsed.paths;
    const compact = paths != null;
    const rootClass = Object.hasOwn(parsed, CLS_ATTRIBUTE) ? getSubtypeClass(suffix, parsed[CLS_ATTRIBUTE]) : getInheritedClass(null, suffix);
    const bag = new rootClass();
    const pathToBag = /* @__PURE__ */ new Map([["[]", bag]]);
    for (const row of parsed.rows) {
      if (!Array.isArray(row) || row.length !== 5) {
        throw new BagSerializationError("Invalid TYTX Bag row");
      }
      const [parentRef, label, tag2, rawValue, rawAttr] = row;
      let parentPath = parentRef ?? "";
      if (compact) {
        if (parentRef !== null && !Object.hasOwn(paths, parentRef)) {
          throw new BagSerializationError(`Unknown TYTX parent reference: ${parentRef}`);
        }
        parentPath = parentRef === null ? "" : paths[parentRef];
      }
      if (typeof parentPath === "string") parentPath = parentPath ? parentPath.split(".") : [];
      if (!Array.isArray(parentPath)) throw new BagSerializationError("Invalid TYTX parent path");
      const parentKey = JSON.stringify(parentPath);
      if (!pathToBag.has(parentKey)) {
        throw new BagSerializationError(`Missing or undecodable TYTX parent branch: ${parentPath}`);
      }
      const parentBag = pathToBag.get(parentKey);
      const fullPath = JSON.stringify([...parentPath, label]);
      let value = rawValue;
      const resolver = decodeResolver(value);
      const attr = decodeAttrs(rawAttr);
      const branchCls = Object.hasOwn(attr, CLS_ATTRIBUTE) ? attr[CLS_ATTRIBUTE] : null;
      delete attr[CLS_ATTRIBUTE];
      if (value instanceof _Bag) {
        const branchSuffix = value.constructor.tytxSuffix;
        const cls = branchCls !== null ? getSubtypeClass(branchSuffix, branchCls) : getInheritedClass(parentBag.constructor, branchSuffix);
        value = new cls();
        pathToBag.set(fullPath, value);
      } else if (branchCls !== null) {
        throw new BagSerializationError(
          `node '${fullPath}': the attribute '${CLS_ATTRIBUTE}' is reserved for the Bag class name of a branch`
        );
      }
      const node = parentBag._appendLiteral(label, resolver ? null : value, attr, resolver);
      node.nodeTag = tag2 ?? null;
    }
    return bag;
  }
  // -------------------------------------------------------------------------
  // XML Serialization
  // -------------------------------------------------------------------------
  /**
   * Serialize Bag to XML format.
   *
   * All values are converted to strings without type information.
   * Date values use ISO 8601 text in UTC (date, time, or datetime).
   * For type-preserving serialization, use toTytx() instead.
   *
   * @param {Object} [options={}] - Serialization options.
   * @param {boolean} [options.pretty=false] - If true, format with indentation.
   * @param {string} [options.encoding='UTF-8'] - XML encoding.
   * @param {boolean|string} [options.docHeader=null] - XML declaration.
   * @param {string[]} [options.selfClosedTags=null] - Tags to self-close when empty.
   * @returns {string} XML string.
   */
  toXml(options = {}) {
    const { pretty = false, encoding = "UTF-8", docHeader = null, selfClosedTags = null } = options;
    let content = this._bagToXml(selfClosedTags, pretty);
    if (docHeader === true) {
      content = `<?xml version='1.0' encoding='${encoding}'?>
${content}`;
    } else if (typeof docHeader === "string") {
      content = `${docHeader}
${content}`;
    }
    return content;
  }
  /**
   * Convert Bag to XML string (internal).
   * @private
   */
  _bagToXml(selfClosedTags = null, pretty = false, depth = 0) {
    const parts = [];
    for (const node of this._nodes) {
      parts.push((pretty ? "  ".repeat(depth) : "") + this._nodeToXml(node, selfClosedTags, pretty, depth));
    }
    return parts.join(pretty ? "\n" : "");
  }
  /**
   * Convert a BagNode to XML string (internal).
   * @private
   */
  _nodeToXml(node, selfClosedTags = null, pretty = false, depth = 0) {
    const originalTag = node.xmlTag || node.nodeTag || node.label;
    const tag2 = this._sanitizeTag(originalTag);
    const attrsParts = [];
    if (tag2 !== originalTag) {
      attrsParts.push(`_tag="${this._escapeAttr(originalTag)}"`);
    }
    if (node.resolver) {
      attrsParts.push(`_resolver="${this._escapeAttr(encodeResolver(node.resolver))}"`);
    }
    if (node.attr) {
      for (const [k, v] of Object.entries(encodeAttrs(node.attr))) {
        if (v !== null && v !== false && v !== void 0) {
          attrsParts.push(`${k}="${this._escapeAttr(String(v))}"`);
        }
      }
    }
    const attrsStr = attrsParts.length ? " " + attrsParts.join(" ") : "";
    const value = node.resolver ? null : node.getValue(true);
    if (value && typeof value._bagToXml === "function") {
      pretty = pretty && node.attr?.["xml:space"] !== "preserve";
      const inner = value._bagToXml(selfClosedTags, pretty, depth + 1);
      if (inner) {
        if (pretty) {
          return `<${tag2}${attrsStr}>
${inner}
${"  ".repeat(depth)}</${tag2}>`;
        }
        return `<${tag2}${attrsStr}>${inner}</${tag2}>`;
      }
      if (selfClosedTags === null || selfClosedTags.includes(tag2)) {
        return `<${tag2}${attrsStr}/>`;
      }
      return `<${tag2}${attrsStr}></${tag2}>`;
    }
    if (value === null || value === void 0 || value === "") {
      if (selfClosedTags === null || selfClosedTags.includes(tag2)) {
        return `<${tag2}${attrsStr}/>`;
      }
      return `<${tag2}${attrsStr}></${tag2}>`;
    }
    const scalar = value instanceof Date && !Number.isNaN(value.getTime()) ? xmlDateText(value) : String(value);
    const text = this._escapeXml(scalar);
    return `<${tag2}${attrsStr}>${text}</${tag2}>`;
  }
  /**
   * Sanitize tag name for XML.
   * @private
   */
  _sanitizeTag(tag2) {
    if (!tag2) return "_none_";
    return tag2.replace(/[^a-zA-Z0-9_\-.:]/g, "_");
  }
  /**
   * Escape XML text content.
   * @private
   */
  _escapeXml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  /**
   * Escape XML attribute value.
   * @private
   */
  _escapeAttr(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  /**
   * Deserialize Bag from XML format.
   *
   * @param {string} source - XML string to parse.
   * @param {Object} [options={}] - Parsing options.
   * @param {string} [options.tagAttribute=null] - If set, save XML tag name as this attribute on each node.
   * @returns {Bag} Reconstructed Bag hierarchy.
   */
  static fromXml(source, options = {}) {
    const { tagAttribute = null } = options;
    let doc;
    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      doc = parser.parseFromString(source, "application/xml");
      const parseError = doc.querySelector("parsererror");
      if (parseError) {
        throw new Error(`XML parse error: ${parseError.textContent}`);
      }
    } else {
      const parser = new import_xmldom2.DOMParser();
      doc = parser.parseFromString(source, "application/xml");
    }
    return this._xmlElementToBag(doc.documentElement, tagAttribute);
  }
  /**
   * Convert XML element to Bag (recursive).
   * @param {Element} element - XML element to convert.
   * @param {string|null} [tagAttribute=null] - If set, save tag name as this attribute.
   * @private
   */
  static _xmlElementToBag(element, tagAttribute = null) {
    const bag = new this();
    const childElements = Array.from(element.childNodes).filter((n) => n.nodeType === 1);
    for (const child of childElements) {
      const originalXmlTag = child.tagName;
      const attr = {};
      for (let i = 0; i < child.attributes.length; i++) {
        const attrNode = child.attributes[i];
        attr[attrNode.name] = attrNode.value;
      }
      const resolver = decodeResolver(attr._resolver);
      if (resolver) delete attr._resolver;
      const isBagValue = String(attr._T || "").toUpperCase() === "BAG";
      Object.assign(attr, decodeAttrs(attr));
      let label = originalXmlTag;
      if ("_tag" in attr) {
        label = attr._tag;
        delete attr._tag;
      }
      if (tagAttribute && tagAttribute in attr) {
        label = attr[tagAttribute];
        delete attr[tagAttribute];
      }
      const requestedLabel = label;
      let suffix = 1;
      while (bag.getNode(label)) {
        label = `${requestedLabel}_${suffix++}`;
      }
      const childChildElements = Array.from(child.childNodes).filter((n) => n.nodeType === 1);
      let node;
      if (childChildElements.length > 0 || isBagValue) {
        const childBag = this._xmlElementToBag(child, tagAttribute);
        node = bag.setItem(label, childBag, Object.keys(attr).length > 0 ? attr : null);
      } else {
        const value = child.textContent || "";
        node = bag.setItem(label, value, Object.keys(attr).length > 0 ? attr : null);
      }
      if (resolver) node.resolver = resolver;
      node.xmlTag = originalXmlTag;
    }
    return bag;
  }
  /**
   * Load Bag from URL. Auto-detects format from content-type.
   *
   * @param {string} url - HTTP/HTTPS URL to fetch.
   * @param {Object} [options={}] - Fetch options.
   * @param {number} [options.timeout=30] - Timeout in seconds.
   * @returns {Promise<Bag>} Parsed content as Bag.
   */
  static async fromUrl(url, options = {}) {
    const { timeout = 30 } = options;
    const fetchOptions = {};
    if (timeout) {
      fetchOptions.signal = AbortSignal.timeout(timeout * 1e3);
    }
    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();
    if (contentType.includes("json")) {
      return _Bag.fromTytx(text);
    }
    if (contentType.includes("xml")) {
      return _Bag.fromXml(text);
    }
    const trimmed = text.trim();
    if (trimmed.startsWith("<")) {
      return _Bag.fromXml(text);
    }
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      return _Bag.fromTytx(text);
    }
    throw new BagException(`Unsupported content-type: ${contentType}`);
  }
  // -------------------------------------------------------------------------
  // JSON Serialization
  // -------------------------------------------------------------------------
  /**
   * Serialize Bag to JSON string.
   *
   * Each node becomes {"label": ..., "value": ..., "attr": {...}}.
   * Nested Bags have value as a list of child nodes.
   *
   * @param {boolean} [typed=true] - If true, encode types for date/datetime/Decimal (TYTX).
   * @returns {string} JSON string representation.
   */
  toJson(typed = true) {
    const result = [];
    for (const node of this._nodes) {
      result.push(this._nodeToJsonDict(node, typed));
    }
    if (typed) {
      return toTytx(result);
    }
    return JSON.stringify(result);
  }
  /**
   * Convert a BagNode to JSON-serializable dict (internal).
   * @private
   */
  _nodeToJsonDict(node, typed) {
    let value = node.resolver ? null : node.getValue(true);
    if (value && typeof value._nodeToJsonDict === "function") {
      const childResult = [];
      for (const childNode of value._nodes) {
        childResult.push(value._nodeToJsonDict(childNode, typed));
      }
      value = childResult;
    }
    const result = { label: node.label, value, attr: encodeAttrs(node.attr) };
    if (node.nodeTag !== null) result.tag = node.nodeTag;
    if (node.resolver) result.resolver = encodeResolver(node.resolver);
    return result;
  }
  /**
   * Deprecated alias of fromTytx: serialized text only, no node heuristics.
   * @deprecated Use fromTytx, or new Bag(data) for native dictionaries/arrays.
   * @param {string|Uint8Array} source
   * @param {{recursive?: boolean}} [options={}]
   */
  static fromJson(source, options = {}) {
    if (!warnedFromJson) {
      console.warn("Bag.fromJson is deprecated; use Bag.fromTytx");
      warnedFromJson = true;
    }
    return this.fromTytx(source, "json", options);
  }
  // -------------------------------------------------------------------------
  // String representation
  // -------------------------------------------------------------------------
  /**
   * Return ASCII tree representation of bag contents.
   *
   * Produces a visual tree structure showing all nodes, their values,
   * and attributes. Handles nested Bags recursively and detects
   * circular references.
   *
   * @param {boolean} [isStatic=true] - If false, triggers resolvers to get current values.
   * @param {Map} [_visited=null] - Internal: tracks visited nodes for circular refs.
   * @param {string} [_prefix=''] - Internal: indentation prefix for nested bags.
   * @param {boolean} [_isLast=true] - Internal: whether this is the last sibling.
   * @returns {string} ASCII tree representation.
   *
   * @example
   * const bag = new Bag();
   * bag.setItem('user.age', 30);
   * bag.setItem('user.city', 'Rome');
   * console.log(bag.toStringTree());
   * // user
   * // ├── age: 30
   * // └── city: 'Rome'
   */
  toStringTree(isStatic = true, _visited = null, _prefix = "", _isLast = true) {
    if (_visited === null) {
      _visited = /* @__PURE__ */ new Map();
    }
    const lines = [];
    const nodes = [...this._nodes];
    for (let idx = 0; idx < nodes.length; idx++) {
      const node = nodes[idx];
      const isLast = idx === nodes.length - 1;
      const value = node.getValue(isStatic);
      const attrs = node.getAttr();
      let attrStr = "";
      const attrKeys = Object.keys(attrs);
      if (attrKeys.length > 0) {
        const attrParts = attrKeys.map((k) => `${k}=${JSON.stringify(attrs[k])}`);
        attrStr = " [" + attrParts.join(", ") + "]";
      }
      const branch2 = isLast ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 ";
      const childPrefix = _prefix + (isLast ? "    " : "\u2502   ");
      if (value instanceof _Bag) {
        const nodeId = node;
        const backref = value.backref ? "(*)" : "";
        if (_visited.has(nodeId)) {
          lines.push(`${_prefix}${branch2}${node.label}${backref}${attrStr} \u2192 (circular ref)`);
        } else {
          _visited.set(nodeId, node.label);
          lines.push(`${_prefix}${branch2}${node.label}${backref}${attrStr}`);
          const inner = value.toStringTree(isStatic, _visited, childPrefix, isLast);
          if (inner) {
            lines.push(inner);
          }
        }
      } else {
        let valueStr;
        if (value === null) {
          valueStr = "null";
        } else if (value === void 0) {
          valueStr = "undefined";
        } else if (value instanceof ArrayBuffer || value instanceof Uint8Array) {
          const decoder = new TextDecoder("utf-8", { fatal: false });
          const bytes = value instanceof ArrayBuffer ? new Uint8Array(value) : value;
          valueStr = decoder.decode(bytes);
        } else if (typeof value === "string") {
          if (value.length > 50) {
            valueStr = JSON.stringify(value.slice(0, 47) + "...");
          } else {
            valueStr = JSON.stringify(value);
          }
        } else {
          valueStr = String(value);
        }
        lines.push(`${_prefix}${branch2}${node.label}: ${valueStr}${attrStr}`);
      }
    }
    return lines.join("\n");
  }
  /**
   * Return ASCII tree representation of bag contents.
   *
   * @param {boolean} [isStatic=true] - If false, trigger resolvers.
   * @param {Object} [_visited=null] - Internal: tracks visited nodes for circular refs.
   * @param {string} [_prefix=''] - Internal: indentation prefix.
   * @returns {string} ASCII tree string.
   */
  toString(isStatic = true, _visited = null, _prefix = "") {
    if (!_visited) {
      _visited = /* @__PURE__ */ new Set();
    }
    const lines = [];
    const nodes = [...this._nodes];
    for (let idx = 0; idx < nodes.length; idx++) {
      const node = nodes[idx];
      const isLast = idx === nodes.length - 1;
      const value = node.getValue(isStatic);
      let attrStr = "";
      const attrs = node.attr;
      if (attrs && Object.keys(attrs).length > 0) {
        const parts = Object.entries(attrs).map(([k, v]) => `${k}=${JSON.stringify(v)}`);
        attrStr = ` [${parts.join(", ")}]`;
      }
      const branch2 = isLast ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 ";
      const childPrefix = _prefix + (isLast ? "    " : "\u2502   ");
      if (value && typeof value._htraverse === "function") {
        const nodeId = node;
        if (_visited.has(nodeId)) {
          lines.push(`${_prefix}${branch2}${node.label}${attrStr} \u2192 (circular ref)`);
        } else {
          _visited.add(nodeId);
          lines.push(`${_prefix}${branch2}${node.label}${attrStr}`);
          const inner = value.toString(isStatic, _visited, childPrefix);
          if (inner) {
            lines.push(inner);
          }
        }
      } else {
        let valueStr;
        if (value === null || value === void 0) {
          valueStr = "null";
        } else if (typeof value === "string" && value.length > 50) {
          valueStr = JSON.stringify(value.slice(0, 47) + "...");
        } else if (typeof value === "string") {
          valueStr = JSON.stringify(value);
        } else {
          valueStr = String(value);
        }
        lines.push(`${_prefix}${branch2}${node.label}: ${valueStr}${attrStr}`);
      }
    }
    return lines.join("\n");
  }
};
var BagException = class extends Error {
  constructor(message) {
    super(message);
    this.name = "BagException";
  }
};
BagResolver.registerBagClass(Bag);
registerType(Bag, "X", (bag) => bag._toTytxPayload(), (payload) => Bag._fromTytxPayload(payload));
setSubtypeDict(Bag.tytxSuffix, { ...getSubtypeDict(Bag.tytxSuffix), Bag });

// node_modules/@genrojs/builders/src/utils.js
var PYTHON_KEYWORDS = /* @__PURE__ */ new Set([
  "False",
  "None",
  "True",
  "and",
  "as",
  "assert",
  "async",
  "await",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "try",
  "while",
  "with",
  "yield"
]);
function pythonKeywordSuffix(name) {
  return name.endsWith("_") && PYTHON_KEYWORDS.has(name.slice(0, -1)) ? name.slice(0, -1) : name;
}
function pythonKeywordAttribute(name) {
  const suffix = pythonKeywordSuffix(name);
  if (suffix !== name) return suffix;
  return name.startsWith("_") && PYTHON_KEYWORDS.has(name.slice(1)) ? name.slice(1) : name;
}
function resolveRenderTag(sourceTag, { renderTag = null, ns = null, dialectName = null } = {}) {
  let tag2 = renderTag || sourceTag;
  if (!tag2) return tag2;
  tag2 = pythonKeywordSuffix(tag2);
  if (ns && !renderTag) {
    const prefix = `${dialectName}_`;
    if (tag2.startsWith(prefix)) tag2 = tag2.slice(prefix.length);
    tag2 = `${ns}:${tag2}`;
  }
  return tag2;
}

// node_modules/@genrojs/builders/src/source-bag.js
var VALUE = /* @__PURE__ */ Symbol("value");
var META_ATTRS = /* @__PURE__ */ new Set([
  "_meta",
  "datapath",
  "nodeId",
  "ns",
  "form",
  "formId",
  "_anchor",
  "updateOn"
]);
function sourceAttributeItems(attributes) {
  return Object.entries(attributes || {}).filter(([name]) => !META_ATTRS.has(name)).map(([name, value]) => [pythonKeywordAttribute(name), value]);
}
var SourceBagNode = class extends BagNode {
  constructor(parentBag, label, value = null, attr = null, resolver = null, nodeTag = null, xmlTag = null) {
    super(parentBag, label, value, attr, resolver, nodeTag, xmlTag);
    this._builder = parentBag?._insertingBuilder ?? parentBag?._builder ?? null;
    this._targetId = null;
  }
  /** Active builder: own slot, else the closest ancestor's. */
  get builder() {
    if (this._builder) {
      return this._builder;
    }
    const parent = this.parentBag;
    return parent ? parent._builder : null;
  }
  /** The document datastore, owned by the active builder. */
  get data() {
    return this.builder.data;
  }
  /** The page builder mounted on the document. */
  get rootBuilder() {
    return this.parentBag.root._builder;
  }
  /** Read schema `_meta` values carried by this node. */
  _getMeta(keys) {
    const meta = this.getAttr("_meta") || {};
    const names = keys.split(",").map((k) => k.trim());
    if (names.length === 1) {
      return meta[names[0]] !== void 0 ? meta[names[0]] : null;
    }
    return names.map((n) => meta[n] !== void 0 ? meta[n] : null);
  }
  /** Return "^" (reactive), "=" (passive) or null. */
  pointerType(v) {
    if (typeof v === "string" && (v[0] === "^" || v[0] === "=") && !v.startsWith("==")) {
      return v[0];
    }
    return null;
  }
  /** Reactive pointers carried by this node as [attrname, pointer].
   *  attrname "" for a pointer in node.value. Only `^` (reactive). */
  pointers() {
    this.builder.validateCustomTypes(this);
    const result = [];
    for (const [attrname, v] of Object.entries(this.getAttr() || {})) {
      if (this.pointerType(v) === "^") {
        result.push([attrname, v.split(":", 1)[0]]);
      }
    }
    if (this.pointerType(this.value) === "^") {
      result.push(["", this.value.split(":", 1)[0]]);
    }
    return result;
  }
  /** Domain attributes as [name, value] pairs, names canonicalized. */
  fixedAttrItems() {
    return sourceAttributeItems(this.getAttr());
  }
  /** Attributes to resolve plus the node value under the VALUE sentinel. */
  runtimeToEvaluate() {
    const items = new Map(this.fixedAttrItems());
    items.set(VALUE, this.value);
    return items;
  }
  // --- path composition (DAT.2), ported from source_bag.py ---------
  /** Compose the absolute datastore path for `path` relative to this node. */
  absDatapath(path) {
    const raw = path;
    if (this.pointerType(path)) {
      path = (pointerTransform(path)?.pointer ?? path).slice(1);
    }
    let attr = null;
    if (path.includes("?")) {
      [path, attr] = path.split("?", 2);
    }
    if (path.startsWith("#")) {
      return this._finalizeAbsPath(this._resolveSymbolicDatapath(path, raw), attr);
    }
    if (path.startsWith(".")) {
      path = this._composeRelativeDatapath(path, raw);
    }
    return this._finalizeAbsPath(path, attr);
  }
  _finalizeAbsPath(path, attr) {
    path = this._collapseParentDatapath(path, path);
    return attr ? `${path}?${attr}` : path;
  }
  _composeRelativeDatapath(path, raw) {
    let current = this;
    while (current !== null && path.startsWith(".")) {
      const dp = current.getAttr("datapath");
      if (dp !== null && dp !== void 0) {
        path = path === "." ? dp : dp + path;
      }
      current = current.parentNode;
    }
    if (path.startsWith(".")) {
      throw new Error(`unresolved relative datapath: ${raw}`);
    }
    return path;
  }
  _collapseParentDatapath(path, raw) {
    const out = [];
    for (const segment of path.split(".")) {
      if (segment === "#parent") {
        if (out.length === 0) {
          throw new Error(`#parent has no segment to cancel: ${raw}`);
        }
        out.pop();
      } else {
        out.push(segment);
      }
    }
    return out.join(".");
  }
  /** Resolve a `#SYMBOL[.relpath]` path.
   *  #FORM → nearest ancestor with formId set or form=true;
   *  #ANCHOR → nearest ancestor with `_anchor` present;
   *  #<id> → node carrying that nodeId. The anchor then resolves
   *  `relpath` relatively (its own datapath chain is consulted). */
  _resolveSymbolicDatapath(path, raw) {
    const s = path.slice(1);
    const idx = s.indexOf(".");
    const symbol = idx === -1 ? s : s.slice(0, idx);
    const relpath = idx === -1 ? "" : s.slice(idx + 1);
    let anchor;
    if (symbol === "FORM") {
      anchor = this._findMarkedDatapathAncestor(true, false, raw);
    } else if (symbol === "ANCHOR") {
      anchor = this._findMarkedDatapathAncestor(false, true, raw);
    } else {
      const builder = this.rootBuilder;
      if (!builder) {
        throw new Error(`#<id>: cannot resolve ${raw} on a node without builder`);
      }
      anchor = builder.source.getNodeByAttr("nodeId", symbol);
      if (anchor === null || anchor === void 0) {
        throw new Error(`#<id>: cannot resolve ${raw}`);
      }
    }
    return anchor.absDatapath(relpath ? `.${relpath}` : ".");
  }
  /** Walk ancestors (from this node) for the requested marker.
   *  form → formId set OR form===true; anchor → `_anchor` present. */
  _findMarkedDatapathAncestor(form, anchor, raw) {
    let current = this;
    while (current !== null && current !== void 0) {
      const attrs = current.getAttr() || {};
      if (form && (attrs.formId != null || attrs.form === true)) {
        return current;
      }
      if (anchor && "_anchor" in attrs) {
        return current;
      }
      current = current.parentNode;
    }
    const marker = form ? "FORM" : "ANCHOR";
    throw new Error(`#${marker}: no marked ancestor found for ${raw}`);
  }
  // --- datastore access + data-logic macros ------------------------
  /** Read the datastore at `path` resolved relative to this node. */
  getRelativeData(path, defaultValue = null, { autocreate = false } = {}) {
    const data = this.data;
    const absPath = this.absDatapath(path);
    if (autocreate && data.getItem(absPath) == null) data.setItem(absPath, defaultValue);
    return data.getItem(absPath, defaultValue);
  }
  /** Write `value` into the datastore at `path`. */
  setRelativeData(path, value, { attributes = null, fired = false, reason = null } = {}) {
    const data = this.data;
    const absPath = this.absDatapath(path);
    data.setItem(
      absPath,
      value,
      attributes,
      ">",
      false,
      true,
      reason === null ? true : reason,
      fired
    );
  }
  fireEvent(path, value = true, { attributes = null, reason = null } = {}) {
    this.setRelativeData(path, value, { attributes, fired: true, reason });
  }
  SET(path, value) {
    this.setRelativeData(path, value);
  }
  GET(path) {
    return this.getRelativeData(path);
  }
  PUT(path, value) {
    this.setRelativeData(path, value, { reason: false });
  }
  FIRE(path, value = true) {
    this.setRelativeData(path, value, { fired: true });
  }
};
var SourceBag = class _SourceBag extends Bag {
  constructor(source = null, builder = null) {
    super(source);
    this._builder = builder;
    this._insertingBuilder = null;
  }
  get nodeClass() {
    return SourceBagNode;
  }
  /** Insert with complete ownership visible to insertion subscribers. */
  _setBuilderItem(builder, bindings, label, ...args) {
    const previousBindings = bindings?.map(([item]) => [item, item._builder]) || null;
    if (bindings) {
      for (const [item, owner] of bindings) item._builder = owner;
    }
    const previousBuilder = this._insertingBuilder;
    this._insertingBuilder = builder;
    try {
      return this.setItem(label, ...args);
    } catch (error) {
      if (this.node(label) == null && previousBindings) {
        for (const [item, owner] of previousBindings) item._builder = owner;
      }
      throw error;
    } finally {
      this._insertingBuilder = previousBuilder;
    }
  }
  /** Attach runtime-only ownership after typed deserialization. Identity is
   *  preserved; only genuine SourceBag branches participate. */
  bindBuilder(builder) {
    if (!builder) {
      throw new Error("SourceBag.bindBuilder requires a builder");
    }
    const assignments = this._builderBindingPlan(builder);
    for (const [item, owner] of assignments) item._builder = owner;
    this.setBackref();
    return this;
  }
  /** Validate and plan ownership for the complete Source graph. */
  _builderBindingPlan(builder) {
    const assignments = [];
    const seen = /* @__PURE__ */ new WeakSet();
    const collect = (branch2, activeBuilder) => {
      if (seen.has(branch2)) {
        throw new Error("source contains a cyclic or shared SourceBag branch");
      }
      seen.add(branch2);
      assignments.push([branch2, activeBuilder]);
      for (const node of branch2.getNodes()) {
        let nodeBuilder = activeBuilder;
        const spec = node._getMeta("subbuilder");
        if (spec != null) {
          nodeBuilder = activeBuilder._resolveSubbuilderReference(
            spec,
            node.getAttr() || {},
            node.nodeTag
          );
        }
        assignments.push([node, nodeBuilder]);
        const value = node.getValue(true);
        if (value instanceof _SourceBag) collect(value, nodeBuilder);
      }
    };
    collect(this, builder);
    return assignments;
  }
};
if ((getSubtypeDict(SourceBag.tytxSuffix).SourceBag ?? SourceBag) !== SourceBag) {
  throw new Error("TYTX subtype name 'SourceBag' is already registered for another class");
}
setSubtypeDict(SourceBag.tytxSuffix, { ...getSubtypeDict(SourceBag.tytxSuffix), SourceBag });
function splitArgs(args) {
  if (args.length === 0) {
    return { value: null, attrs: {} };
  }
  const first = args[0];
  if (first !== null && typeof first === "object") {
    const prototype = Object.getPrototypeOf(first);
    if (prototype === Object.prototype || prototype === null) {
      return { value: null, attrs: first };
    }
  }
  return { value: first, attrs: args[1] || {} };
}
var SKIP = /* @__PURE__ */ new Set(["then", "toJSON"]);
var SOURCE_TARGETS = /* @__PURE__ */ new WeakMap();
function sourceTarget(value) {
  return SOURCE_TARGETS.get(value) || value;
}
function wrapSource(target) {
  if (target === null || target === void 0) {
    return target;
  }
  target = sourceTarget(target);
  const builder = target._builder || target.parentBag && target.parentBag._builder;
  if (!builder) {
    return target;
  }
  return builder.wrapSource(target);
}
function createSourceHandle(builder, target) {
  const onBag = target instanceof Bag;
  const proxy = new Proxy(target, {
    get(obj, prop) {
      if (typeof prop === "symbol" || prop.startsWith("_") || SKIP.has(prop)) {
        return Reflect.get(obj, prop, obj);
      }
      const tag2 = builder.schemaTag(prop);
      if (onBag && tag2) {
        return elementCall(builder, obj, tag2, onBag);
      }
      if (prop in obj) {
        const v = Reflect.get(obj, prop, obj);
        return typeof v === "function" ? v.bind(obj) : v;
      }
      if (tag2) {
        return elementCall(builder, obj, tag2, onBag);
      }
      const method = builder.containerMethod(prop);
      if (method) {
        return (...args) => builder[method](builder.wrapSource(obj), ...args);
      }
      return void 0;
    }
  });
  SOURCE_TARGETS.set(proxy, target);
  return proxy;
}
function elementCall(builder, target, tag2, onBag) {
  return (...args) => {
    const { value, attrs } = splitArgs(args);
    const node = onBag ? builder.bagCall(target, tag2, value, attrs) : builder.commandOnNode(target, tag2, value, attrs);
    return node.builder.wrapSource(node);
  };
}

// node_modules/@genrojs/builders/src/grammar-loader.js
var IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;
var PARAM_KINDS = /* @__PURE__ */ new Set(["positional_only", "positional_or_keyword", "keyword_only", "var_positional", "var_keyword"]);
var PARAM_ROLES = /* @__PURE__ */ new Set(["framework", "value", "attribute"]);
var PRIMITIVES = /* @__PURE__ */ new Map([
  ["builtins.str", (v) => typeof v === "string"],
  ["builtins.int", (v) => Number.isInteger(v)],
  ["builtins.float", (v) => typeof v === "number" && Number.isFinite(v)],
  ["builtins.bool", (v) => typeof v === "boolean"],
  ["builtins.list", (v) => Array.isArray(v)],
  ["builtins.dict", (v) => v !== null && typeof v === "object" && !Array.isArray(v)],
  ["builtins.tuple", (v) => Array.isArray(v)],
  ["builtins.set", (v) => Array.isArray(v) || v instanceof Set],
  ["builtins.NoneType", (v) => v === null],
  ["builtins.object", (_v) => true]
]);
function plainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function fail(path, message) {
  throw new TypeError(`${path}: ${message}`);
}
function exactKeys(value, allowed, required, path) {
  if (!plainObject(value)) fail(path, "must be an object");
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(path, `unknown field '${key}'`);
  for (const key of required) if (!Object.hasOwn(value, key)) fail(path, `missing field '${key}'`);
}
function jsonValue(value, path) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number" && Number.isFinite(value)) return;
  if (Array.isArray(value)) return value.forEach((v, i) => jsonValue(v, `${path}[${i}]`));
  if (plainObject(value)) return Object.entries(value).forEach(([k, v]) => jsonValue(v, `${path}.${k}`));
  fail(path, "must be lossless JSON data");
}
function pythonRegexPattern(pattern, flags) {
  let result = "", inClass = false;
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === "\\") {
      result += ch + (pattern[++i] ?? "");
      continue;
    }
    if (ch === "[") inClass = true;
    if (!inClass && ch === "." && !(flags & 16)) result += "[^\\n]";
    else if (!inClass && ch === "^" && flags & 8) result += "(?:^|(?<=\\n))";
    else if (!inClass && ch === "$") result += flags & 8 ? "(?=\\n|(?![\\s\\S]))" : "(?=\\n?(?![\\s\\S]))";
    else result += ch;
    if (ch === "]") inClass = false;
  }
  return result;
}
function annotation(desc, path, nested = false, customTypes = null) {
  if (desc === null) return null;
  exactKeys(desc, ["kind", "dtype", "module", "name", "origin", "arguments", "items", "values", "base", "metadata", "pattern", "flags", "ge", "le", "gt", "lt", "value"], ["kind"], path);
  switch (desc.kind) {
    case "custom": {
      exactKeys(desc, ["kind", "name"], ["kind", "name"], path);
      if (!customTypes) fail(path, "custom references require a catalog; nested catalog references are unsupported");
      return customTypes.resolve(desc.name, path);
    }
    case "dtype": {
      exactKeys(desc, ["kind", "dtype"], ["kind", "dtype"], path);
      const code = desc.dtype;
      if (typeof code !== "string") fail(path, "dtype must be a string");
      const Type = getRegisteredType(code);
      if (!Type && code !== "NN") fail(path, `unknown dtype '${code}'`);
      const test = (value) => {
        if (code === "NN") return value === null;
        if (code === "N") return isDecimal2(value) && !["NaN", "Infinity", "-Infinity"].includes(value.toString());
        if (Type === Number) return typeof value === "number" && Number.isFinite(value) && (code !== "L" || Number.isInteger(value));
        if (Type === String) return typeof value === "string";
        if (Type === Boolean) return typeof value === "boolean";
        if (Type === Date) return value instanceof Date && Number.isFinite(value.getTime());
        if (Type === Object) return plainObject(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
        return value instanceof Type;
      };
      return { ...desc, test };
    }
    case "any":
      return { ...desc, test: (_v) => true };
    case "type": {
      if (typeof desc.module !== "string" || typeof desc.name !== "string") fail(path, "type requires string module/name");
      const key = `${desc.module}.${desc.name}`;
      if (key === "collections.abc.Callable") return { ...desc, test: (v) => typeof v === "function", portable: false };
      const test = PRIMITIVES.get(key);
      if (!test) fail(path, `unsupported type '${key}'`);
      return { ...desc, test };
    }
    case "union": {
      if (!Array.isArray(desc.items) || !desc.items.length) fail(path, "union items must be non-empty");
      const items = desc.items.map((v, i) => annotation(v, `${path}.items[${i}]`, true, customTypes));
      return { ...desc, items, inputConstraint: items.some((x) => x.inputConstraint), test: (v) => items.some((x) => x.test && x.test(v)) };
    }
    case "literal":
      if (!Array.isArray(desc.values)) fail(path, "literal values must be an array");
      desc.values.forEach((v, i) => jsonValue(v, `${path}.values[${i}]`));
      return { ...desc, test: (v) => desc.values.some((x) => Object.is(x, v)) };
    case "annotated": {
      if (!Array.isArray(desc.metadata)) fail(path, "annotated metadata must be an array");
      if (desc.metadata.some((v) => !["regex", "range", "value"].includes(v?.kind))) fail(path, "unsupported annotation metadata kind");
      const base = annotation(desc.base, `${path}.base`, true, customTypes);
      const metadata = desc.metadata.map((v, i) => annotation(v, `${path}.metadata[${i}]`, true, customTypes));
      return { ...desc, base, metadata, inputConstraint: base.inputConstraint, test: (v) => base.test(v) && metadata.every((x) => !x.test || x.test(v)) };
    }
    case "range": {
      for (const key of ["ge", "le", "gt", "lt"]) if (!Object.hasOwn(desc, key)) fail(path, `range missing '${key}'`);
      for (const key of ["ge", "le", "gt", "lt"]) if (desc[key] !== null && (typeof desc[key] !== "number" || !Number.isFinite(desc[key]))) fail(path, `${key} must be finite number or null`);
      return { ...desc, test: (v) => typeof v === "number" && (desc.ge === null || v >= desc.ge) && (desc.le === null || v <= desc.le) && (desc.gt === null || v > desc.gt) && (desc.lt === null || v < desc.lt) };
    }
    case "regex": {
      if (typeof desc.pattern !== "string" || !Number.isInteger(desc.flags) || desc.flags < 0) fail(path, "regex requires pattern and non-negative integer flags");
      const unsupported = desc.flags & ~(2 | 8 | 16 | 32);
      if (unsupported) fail(path, `unsupported Python regex flags ${unsupported}`);
      if (desc.flags & 2) fail(path, "IGNORECASE is not portable across Python and JavaScript Unicode rules");
      if (/\\[AZzUwWdDsSabBN0-9]|\(\?P[<=!]|\(\?\(|\(\?>|\(\?#|\(\?[aiLmsux-]|[+*?}]\+|\{,/.test(desc.pattern.replaceAll(String.raw`[\s\S]`, "."))) fail(path, "regex uses a non-portable construct or character class");
      let flags = "uy";
      if (desc.flags & 16) flags += "s";
      let re;
      try {
        re = new RegExp(`(?:${pythonRegexPattern(desc.pattern, desc.flags)})(?![\\s\\S])`, flags);
      } catch (error) {
        fail(path, `invalid portable regex: ${error.message}`);
      }
      return { ...desc, test: (v) => {
        if (typeof v !== "string") return false;
        re.lastIndex = 0;
        return re.test(v);
      } };
    }
    case "value":
      jsonValue(desc.value, `${path}.value`);
      return { ...desc };
    case "generic": {
      const origin = annotation(desc.origin, `${path}.origin`, true, customTypes);
      if (desc.origin?.kind !== "type" || desc.origin.module !== "builtins" || !["list", "dict", "tuple", "set"].includes(desc.origin.name)) {
        fail(path, "only list, dict, tuple and set generic origins are supported");
      }
      if (!Array.isArray(desc.arguments)) fail(path, "generic arguments must be an array");
      const args = desc.arguments.map((v, i) => annotation(v, `${path}.arguments[${i}]`, true, customTypes));
      return { ...desc, origin, arguments: args, inputConstraint: args.some((x) => x.inputConstraint), test: (v) => origin.test(v) && genericItems(desc.origin, args, v) };
    }
    case "arguments":
      fail(path, "Callable argument-list descriptors are not supported by Python validation");
    case "ellipsis":
      if (!nested) fail(path, "ellipsis is only valid as a nested descriptor");
      return { ...desc };
    default:
      fail(path, `unknown annotation kind '${desc.kind}'`);
  }
}
function genericItems(origin, args, value) {
  const key = `${origin.module}.${origin.name}`;
  if (key === "builtins.tuple" && args.length && args[1]?.kind !== "ellipsis") {
    return value.length === args.length && value.every((item, index) => args[index].test(item));
  }
  if (key === "builtins.list" || key === "builtins.set" || key === "builtins.tuple") return [...value].every((v) => !args[0]?.test || args[0].test(v));
  if (key === "builtins.dict") return Object.entries(value).every(([k, v]) => (!args[0]?.test || args[0].test(k)) && (!args[1]?.test || args[1].test(v)));
  return false;
}
function parseCardinality(spec, path) {
  if (spec === null) return null;
  if (typeof spec !== "string") fail(path, "must be string or null");
  if (spec === "") return /* @__PURE__ */ new Map();
  const result = /* @__PURE__ */ new Map();
  for (const raw of spec.split(",")) {
    const item = raw.trim();
    if (/^[A-Za-z_][A-Za-z0-9_]*\[\]$/.test(item)) fail(path, `invalid cardinality item '${raw}'`);
    const match = item.match(/^([A-Za-z_][A-Za-z0-9_]*|\*)(?:\[(?:(\d+)|(?:(\d*):(\d*)))\])?$/);
    if (!match) fail(path, `invalid cardinality item '${raw}'`);
    const [, name, exact, lower, upper] = match;
    if (result.has(name)) fail(path, `duplicate tag '${name}'`);
    let min2 = 0, max2 = Infinity;
    if (item.includes("[")) {
      if (item.includes(":")) {
        min2 = lower ? Number(lower) : 0;
        max2 = upper ? Number(upper) : Infinity;
      } else {
        min2 = max2 = Number(exact);
      }
    }
    if (max2 < min2) fail(path, `maximum ${max2} is below minimum ${min2}`);
    result.set(name, { min: min2, max: max2 });
  }
  if (result.has("*") && result.size > 1) fail(path, "wildcard '*' cannot be combined with named tags");
  return result;
}
function parseParents(spec, path) {
  if (spec === null) return null;
  if (typeof spec !== "string") fail(path, "must be string or null");
  const result = /* @__PURE__ */ new Set();
  for (const raw of spec.split(",")) {
    const name = raw.trim();
    if (!name) continue;
    if (!IDENTIFIER.test(name) || result.has(name)) fail(path, `invalid or duplicate parent '${raw}'`);
    result.add(name);
  }
  return result;
}
function parameters(value, path, customTypes) {
  if (value === null) return null;
  exactKeys(value, ["parameters", "accepts_var_keyword", "accepts_var_positional"], [], path);
  const params = value.parameters ?? [];
  if (!Array.isArray(params)) fail(path, "parameters must be an array");
  value = {
    parameters: params,
    accepts_var_keyword: params.some((p) => p.kind === "var_keyword"),
    accepts_var_positional: params.some((p) => p.kind === "var_positional"),
    ...value
  };
  if (!Array.isArray(value.parameters) || typeof value.accepts_var_keyword !== "boolean" || typeof value.accepts_var_positional !== "boolean") fail(path, "invalid signature descriptor");
  const seen = /* @__PURE__ */ new Set();
  let foundVarKeyword = false;
  let foundVarPositional = false;
  const parsed = value.parameters.map((p, i) => {
    const pp = `${path}.parameters[${i}]`;
    exactKeys(p, ["name", "kind", "role", "annotation", "has_default", "default"], ["name", "kind", "role", "annotation", "has_default"], pp);
    if (typeof p.name !== "string" || !IDENTIFIER.test(p.name) || seen.has(p.name)) fail(pp, "invalid or duplicate parameter name");
    seen.add(p.name);
    if (!PARAM_KINDS.has(p.kind) || !PARAM_ROLES.has(p.role) || typeof p.has_default !== "boolean") fail(pp, "invalid kind, role, or has_default");
    if (p.has_default !== Object.hasOwn(p, "default")) fail(pp, "default presence must equal has_default");
    if (p.has_default) jsonValue(p.default, `${pp}.default`);
    foundVarKeyword ||= p.kind === "var_keyword";
    foundVarPositional ||= p.kind === "var_positional";
    return { ...p, annotation: annotation(p.annotation, `${pp}.annotation`, false, customTypes) };
  });
  if (foundVarKeyword !== value.accepts_var_keyword || foundVarPositional !== value.accepts_var_positional) {
    fail(path, "variadic summary flags do not match parameters");
  }
  return { ...value, parameters: parsed };
}
function declaration(value, path, isElement, customTypes) {
  const keys = ["doc", "sub_tags", "parent_tags", "inherits_from", "ns", "attributes", ...isElement ? ["node_label", "collection_key"] : [], "_meta"];
  exactKeys(value, keys, [], path);
  value = { ...Object.fromEntries(keys.map((k) => [k, null])), ...value };
  for (const key of ["doc", "inherits_from", "ns", ...isElement ? ["node_label", "collection_key"] : []]) if (value[key] !== null && typeof value[key] !== "string") fail(path, `${key} must be string or null`);
  if (value._meta !== null) {
    if (!plainObject(value._meta)) fail(path, "_meta must be object or null");
    jsonValue(value._meta, `${path}._meta`);
  }
  parseCardinality(value.sub_tags, `${path}.sub_tags`);
  parseParents(value.parent_tags, `${path}.parent_tags`);
  return { ...value, attributes: parameters(value.attributes, `${path}.attributes`, customTypes) };
}
function parents(value) {
  return value ? value.split(",").map((x) => x.trim()).filter(Boolean) : [];
}
function inherit(base, own) {
  const out = { ...own };
  for (const [key, value] of Object.entries(base)) {
    if (key === "inherits_from" || key.startsWith("_")) continue;
    if (!out[key]) out[key] = value;
  }
  out._meta = { ...base._meta || {}, ...own._meta || {} };
  return out;
}
function compileDeclaration(value) {
  const out = { ...value };
  out._subSpec = Object.hasOwn(out, "sub_tags") ? parseCardinality(out.sub_tags, "resolved.sub_tags") : null;
  out._parentSpec = Object.hasOwn(out, "parent_tags") ? parseParents(out.parent_tags, "resolved.parent_tags") : null;
  return out;
}
function resolveAbstract(name, abstracts, state, path) {
  if (state.get(name) === 1) fail(path, `inheritance cycle at '${name}'`);
  if (state.get(name) === 2) return abstracts[name];
  const raw = abstracts[name];
  if (!raw) fail(path, `unknown abstract '${name}'`);
  state.set(name, 1);
  let out = { ...raw };
  for (const parent of parents(raw.inherits_from)) out = inherit(resolveAbstract(parent, abstracts, state, path), out);
  out = compileDeclaration(out);
  state.set(name, 2);
  abstracts[name] = out;
  return out;
}
function resolveGrammarDeclarations({ abstracts: rawAbstracts = {}, elements: rawElements = {} }) {
  const abstracts = { ...rawAbstracts };
  const state = /* @__PURE__ */ new Map();
  for (const name of Object.keys(abstracts)) resolveAbstract(name, abstracts, state, `abstracts.${name}.inherits_from`);
  const elements = {};
  for (const [name, own] of Object.entries(rawElements)) {
    let out = { ...own };
    for (const parent of parents(own.inherits_from)) {
      const base = abstracts[parent];
      if (!base) fail(`elements.${name}.inherits_from`, `unknown abstract '${parent}'`);
      out = inherit(base, out);
    }
    elements[name] = compileDeclaration(out);
  }
  return { abstracts, elements };
}
function parseGrammarDocument(doc) {
  exactKeys(doc, ["document_format", "grammar", "abstracts", "elements", "custom_types"], ["document_format", "grammar", "abstracts", "elements"], "grammar document");
  exactKeys(doc.document_format, ["name", "version"], ["name", "version"], "document_format");
  if (doc.document_format.name !== "builder_grammar" || !["1.1", "1.2"].includes(doc.document_format.version)) fail("document_format", "expected builder_grammar version 1.1 or 1.2");
  exactKeys(doc.grammar, ["name", "version", "title", "description"], ["name", "version", "title", "description"], "grammar");
  if (typeof doc.grammar.name !== "string" || !doc.grammar.name) fail("grammar.name", "must be non-empty string");
  for (const key of ["version", "title", "description"]) if (doc.grammar[key] !== null && typeof doc.grammar[key] !== "string") fail(`grammar.${key}`, "must be string or null");
  if (!plainObject(doc.abstracts) || !plainObject(doc.elements)) fail("grammar document", "abstracts/elements must be objects");
  if (Object.hasOwn(doc, "custom_types") && doc.document_format.version !== "1.2") fail("custom_types", "requires version 1.2");
  const customTypes = CustomTypes.fromJSON(doc.custom_types ?? {});
  const rawAbstracts = {};
  for (const [name, value] of Object.entries(doc.abstracts)) {
    if (!name || name.startsWith("_")) {
      fail("abstracts", `invalid public name '${name}'`);
    }
    rawAbstracts[name] = declaration(value, `abstracts.${name}`, false, customTypes);
  }
  const rawElements = {};
  for (const [name, value] of Object.entries(doc.elements)) {
    if (!name || name.startsWith("_")) {
      fail("elements", `invalid public name '${name}'`);
    }
    rawElements[name] = declaration(value, `elements.${name}`, true, customTypes);
  }
  return {
    grammar: structuredClone(doc.grammar),
    abstracts: rawAbstracts,
    elements: rawElements
  };
}
function validateElementValues(tag2, spec, value, attrs) {
  const signature = spec.attributes;
  if (!signature) return;
  const supplied = { ...attrs };
  if (value !== null && value !== void 0) supplied.node_value = value;
  const known = new Set(signature.parameters.filter((p) => p.role === "attribute").map((p) => p.name));
  const framework = /* @__PURE__ */ new Set(["node_label", "node_position", "nodeId", "target_id", "datapath", "iterate", "store", "_tag", "_meta", "ns"]);
  if (!signature.accepts_var_keyword) {
    for (const name of Object.keys(attrs)) if (!known.has(name) && !framework.has(name)) fail(tag2, `unknown attribute '${name}'`);
  }
  const componentRoot = spec._meta?.component ? signature.parameters.find((p) => p.role !== "framework" && ["positional_only", "positional_or_keyword"].includes(p.kind))?.name : null;
  for (const p of signature.parameters) {
    if (p.name === componentRoot) continue;
    if (p.role === "framework" || p.kind.startsWith("var_")) continue;
    const present = Object.hasOwn(supplied, p.name);
    if (!present && !p.has_default) fail(tag2, `missing required ${p.role} '${p.name}'`);
    if (present && p.annotation !== null && (!p.annotation.test || !p.annotation.test(supplied[p.name]))) fail(tag2, `invalid value for ${p.role} '${p.name}'`);
  }
}
var CustomTypes = class _CustomTypes {
  #definitions = /* @__PURE__ */ new Map();
  #compiled = /* @__PURE__ */ new Map();
  register(name, type, constraint) {
    const bases = /* @__PURE__ */ new Map([
      [String, "str"],
      [Number, "float"],
      ["string", "str"],
      ["integer", "int"],
      ["number", "float"]
    ]);
    const base = bases.has(type) ? { kind: "type", module: "builtins", name: bases.get(type) } : type;
    return this.#register(name, { kind: "annotated", base, metadata: [constraint] });
  }
  #register(name, definition) {
    if (typeof name !== "string" || !/^[A-Za-z][A-Za-z0-9_]*$/.test(name) || name in this || ["to_dict", "from_dict"].includes(name) || PYTHON_KEYWORDS2.has(name)) fail("custom_types", `invalid, reserved or duplicate name '${name}'`);
    exactKeys(definition, ["kind", "base", "metadata"], ["kind", "base", "metadata"], `custom_types.${name}`);
    if (definition.kind !== "annotated" || !Array.isArray(definition.metadata) || definition.metadata.length !== 1 || !["regex", "range"].includes(definition.metadata[0]?.kind)) {
      fail(`custom_types.${name}`, "requires an annotated base with one Regex or Range validator");
    }
    const expected = definition.metadata[0].kind === "regex" ? ["str"] : ["int", "float"];
    if (definition.base?.kind !== "type" || definition.base.module !== "builtins" || !expected.includes(definition.base.name)) {
      fail(`custom_types.${name}`, "portable Regex requires str; portable Range requires int or float");
    }
    jsonValue(definition, `custom_types.${name}`);
    const copy = structuredClone(definition);
    const compiled = annotation(copy, `custom_types.${name}`);
    const reference = Object.freeze({ kind: "custom", name });
    Object.defineProperty(this, name, { value: reference, enumerable: true });
    this.#definitions.set(name, copy);
    this.#compiled.set(name, { ...reference, inputConstraint: true, test: compiled.test });
    return reference;
  }
  resolve(name, path = "custom_types") {
    if (!this.#compiled.has(name)) fail(path, `unknown custom type '${name}'`);
    return { ...this.#compiled.get(name) };
  }
  validate(name, value) {
    if (!this.resolve(name).test(value)) fail(`custom_types.${name}`, "invalid input value");
    return true;
  }
  toJSON() {
    return structuredClone(Object.fromEntries(this.#definitions));
  }
  static fromJSON(catalog) {
    if (!plainObject(catalog)) fail("custom_types", "must be an object");
    const registry = new _CustomTypes();
    for (const [name, definition] of Object.entries(catalog)) registry.#register(name, definition);
    return registry;
  }
};
var PYTHON_KEYWORDS2 = new Set("False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield".split(" "));
function validateCustomTypeValues(tag2, spec, value, attrs) {
  const signature = spec?.attributes;
  if (!signature) return;
  for (const p of signature.parameters) {
    if (!p.annotation?.inputConstraint || p.role === "framework" || ["var_keyword", "var_positional"].includes(p.kind)) continue;
    const supplied = p.role === "value" ? value : attrs[p.name];
    if (supplied === void 0) continue;
    if (!p.annotation.test(supplied)) fail(tag2, `invalid input for '${p.name}' (custom type)`);
  }
}

// node_modules/@genrojs/builders/src/collection.js
function merge(current, incoming, path = []) {
  if (incoming === null) return structuredClone(current);
  if (path.length === 2 && path[0] === "custom_types" && current !== void 0) {
    if (!equalJson(current, incoming)) throw new TypeError(`conflicting custom type '${path[1]}'`);
    return structuredClone(current);
  }
  if (path.length === 2 && ["abstracts", "elements"].includes(path[0])) return structuredClone(incoming);
  if (record(current) && record(incoming)) {
    const result = structuredClone(current);
    for (const [name, value] of Object.entries(incoming)) {
      if (value !== null) Object.defineProperty(result, name, {
        value: merge(result[name], value, [...path, name]),
        enumerable: true,
        writable: true,
        configurable: true
      });
    }
    return result;
  }
  return structuredClone(incoming);
}
function equalJson(a, b) {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => equalJson(x, b[i]));
  if (record(a) && record(b)) return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every((k) => Object.hasOwn(b, k) && equalJson(a[k], b[k]));
  return false;
}
function record(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}
function json(value) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number" && Number.isFinite(value)) return;
  if (Array.isArray(value)) {
    value.forEach(json);
    return;
  }
  if (record(value)) {
    Object.values(value).forEach(json);
    return;
  }
  throw new TypeError("collection must contain only finite JSON values");
}
var Collection = class _Collection {
  #document;
  constructor(document) {
    json(document);
    const keys = ["document_format", "grammar", "abstracts", "elements"];
    if (!record(document) || Object.keys(document).some((k) => ![...keys, "custom_types"].includes(k)) || keys.some((k) => !Object.hasOwn(document, k))) {
      throw new TypeError("collection requires document_format, grammar, abstracts and elements");
    }
    const format = document.document_format;
    if (!record(format) || Object.keys(format).length !== 2 || format.name !== "builder_grammar" || !["1.1", "1.2"].includes(format.version)) {
      throw new TypeError("expected builder_grammar version 1.1 or 1.2");
    }
    for (const section of ["grammar", "abstracts", "elements"]) {
      if (!record(document[section])) throw new TypeError(`${section} must be an object`);
    }
    if (Object.hasOwn(document, "custom_types") && (format.version !== "1.2" || !record(document.custom_types))) {
      throw new TypeError("custom_types requires an object catalog and version 1.2");
    }
    this.#document = structuredClone(document);
  }
  /** Compose a later document: an element or abstract it names replaces the
   *  earlier entry entirely, the others are kept; `grammar` metadata merges
   *  and a null metadata value preserves the earlier one. */
  update(document) {
    const incoming = new _Collection(document);
    const merged = merge(this.#document, incoming.#document);
    if (this.#document.document_format.version === "1.2" || incoming.#document.document_format.version === "1.2") merged.document_format.version = "1.2";
    this.#document = merged;
    return this;
  }
  /** Export independent JSON data, not a second representation of the grammar. */
  toDocument() {
    return structuredClone(this.#document);
  }
};

// node_modules/@genrojs/builders/src/renderer/base.js
var RendererBase = class {
  static renderType = "string";
  static mode = null;
  constructor(builder) {
    this._builder = builder;
    this.renders = /* @__PURE__ */ new Map([[builder, this]]);
  }
  get builder() {
    return this._builder;
  }
  get renderType() {
    return this.constructor.renderType;
  }
  get mode() {
    return this.constructor.mode;
  }
  /** Seed the cache with a renderer for `builder`. */
  addRender(builder, renderer) {
    this.renders.set(builder, renderer);
  }
  /** Return the renderer responsible for nodes of `builder`. */
  getRender(builder) {
    const rn = this.renders.get(builder);
    if (rn !== void 0) {
      return rn;
    }
    const prop = builder.getRenderer();
    this.renders.set(builder, prop);
    return prop;
  }
  /** Walk a node and produce its dialect-defined rendered value. */
  render(node, opts = {}) {
    const builder = node.builder;
    let [item, ra] = builder.runtimeValues(node);
    if (node._getMeta("data_element")) {
      return null;
    }
    if (node._getMeta("component")) {
      return this._renderComponent(node, ra, opts);
    }
    const renderer = this.getRender(builder);
    let tag2;
    [tag2, ra] = renderer._handleMeta(node, ra);
    if (!node._getMeta("subbuilder")) {
      ra = renderer.adaptAttrs(ra);
    }
    if (node.value instanceof SourceBag) item = this.renderChildren(node.value, opts);
    return renderer.renderedItem(node, item, ra, { tag: tag2, ...opts });
  }
  /** Render each child and collect the fragments (drop transparent nulls). */
  renderChildren(nodes, opts = {}) {
    const fragments = [];
    for (const child of nodes.getNodes()) {
      const frag = this.render(child, opts);
      if (frag === null) {
        continue;
      }
      if (Array.isArray(frag)) {
        fragments.push(...frag);
      } else {
        fragments.push(frag);
      }
    }
    return fragments;
  }
  // --- @component expansion (render-time) --------------------------
  /** Expand a component node and render the expansion in its place.
   *  The body (kept on the builder) receives a fresh throw-away root and
   *  builds exactly ONE tree. Three forms: params (one block), `store`
   *  (one block anchored to a record), `iterate` (N blocks, one per
   *  child of the collection). */
  _renderComponent(node, runtimeAttrs, opts) {
    const [body, iterable, anchor, bodyKwargs] = this._expansionInputs(node, runtimeAttrs);
    if (!Object.hasOwn(node.getAttr(), "iterate")) {
      return this._expandBlock(node, body, anchor, bodyKwargs, opts);
    }
    if (iterable == null) {
      return [];
    }
    if (!(iterable instanceof Bag)) {
      throw new TypeError(
        `component '${node.nodeTag}': iterate must resolve to a Bag, got ${iterable?.constructor?.name || typeof iterable}`
      );
    }
    return iterable.getNodes().map(
      (child) => this._expandBlock(
        node,
        body,
        anchor,
        { node_label: child.label },
        opts
      )
    );
  }
  /** The expansion prep: (body, iterable, anchor, bodyKwargs). Reads the
   *  data anchors RAW (store/iterate), drops the machinery kwargs, and
   *  passes reactive-pointer kwargs THROUGH as absolutized pointers
   *  (CMP.4: the address must reach the node the body builds). */
  _expansionInputs(node, runtimeAttrs) {
    const builder = node.builder;
    const method = builder.componentMethod(node.nodeTag);
    const body = method && builder[method];
    if (typeof body !== "function") {
      throw new Error(`component '${node.nodeTag}' has no implementation`);
    }
    const iterable = runtimeAttrs.iterate;
    delete runtimeAttrs.iterate;
    delete runtimeAttrs.store;
    let anchor = node.getAttr("iterate") || node.getAttr("store");
    if (anchor != null) {
      if (node.pointerType(anchor)) {
        anchor = anchor.slice(1);
      }
      if (anchor.startsWith(".")) {
        anchor = node._composeRelativeDatapath(anchor, anchor);
      }
    } else {
      anchor = null;
    }
    for (const name of Object.keys(runtimeAttrs)) {
      const raw = node.getAttr(name);
      if (node.pointerType(raw) === "^") {
        runtimeAttrs[name] = `^${node.absDatapath(raw)}`;
      }
    }
    return [body, iterable, anchor, runtimeAttrs];
  }
  /** ONE expansion: throw-away root, body call, single-tree check, render. */
  _expandBlock(node, body, anchor, bodyKwargs, opts) {
    const root = node.builder._expansionRoot(anchor);
    body.call(node.builder, wrapSource(root), bodyKwargs);
    const roots = root.getNodes();
    if (roots.length !== 1) {
      throw new Error(
        `component '${node.nodeTag}' must build a tree, not a forest: ${roots.length} root nodes`
      );
    }
    const expansionOpts = {
      ...opts,
      depthOffset: this._nodeDepth(node, opts.depthOffset || 0)
    };
    return this.render(roots[0], expansionOpts);
  }
  /** Normalize the source before the top-level walk. Identity by default. */
  preprocess(source) {
    return source;
  }
  /** Dialect-specific fragment for `node`. Concrete renderers override. */
  renderedItem(_node, _item, _runtimeAttrs, _opts) {
    throw new Error(`${this.constructor.name} does not implement renderedItem`);
  }
  /** Resolve render_tag / render_attributes / ns into a ready tag+attrs. */
  _handleMeta(node, runtimeAttrs) {
    const [renderTag, renderAttributes] = node._getMeta("render_tag,render_attributes");
    const tag2 = resolveRenderTag(node.nodeTag, {
      renderTag,
      ns: node.getAttr("ns"),
      dialectName: node.builder?.constructor._name
    });
    if (!tag2) {
      throw new Error(
        `node ${node.label} has no tag to render (no render_tag, no node_tag)`
      );
    }
    if (renderAttributes) {
      runtimeAttrs = { ...runtimeAttrs, ...renderAttributes };
    }
    return [tag2, runtimeAttrs];
  }
  /** Dialect adaptation of the attribute dict. Identity by default. */
  adaptAttrs(attrs) {
    return attrs;
  }
  /** Strip this dialect's own `<name>_` prefix from `what`. */
  adapt(what) {
    const prefix = `${this.builder.constructor._name}_`;
    return what.startsWith(prefix) ? what.slice(prefix.length) : what;
  }
  /** Compose string fragments and deliver the complete result. */
  finalize(result, target = null, _opts = {}) {
    const text = this._composeStringFragments(result);
    if (target === null || target === void 0) {
      return text;
    }
    if (typeof target === "string") {
      throw new TypeError(
        "string render targets require filesystem support, which is unavailable in the portable renderer; pass a callable or writable target instead"
      );
    }
    if (typeof target.full === "function" && typeof target.write !== "function") {
      target.full(text);
      return null;
    }
    if (typeof target.write === "function") {
      target.write(text);
      return null;
    }
    if (typeof target === "function") {
      target(text);
      return null;
    }
    throw new TypeError(
      "render target must be writable (.write), callable, or expose .full"
    );
  }
  /** Join string fragments without silently coercing object output. */
  _composeStringFragments(result) {
    if (!Array.isArray(result)) {
      return result;
    }
    if (result.some((fragment) => typeof fragment !== "string")) {
      throw new TypeError(
        "String composition requires string fragments; object renderers must define their own composition"
      );
    }
    return result.join("");
  }
  /** Escape a text value for safe inclusion in an XML/HTML body. */
  _escapeText(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  }
  /** Escape an attribute value, including double quotes. */
  _escapeAttr(value) {
    return this._escapeText(value).replaceAll('"', "&quot;");
  }
  /** Wrapper-rooted depth of a source node, shifted for expansions. */
  _nodeDepth(node, depthOffset = 0) {
    const fullpath = node.fullpath || "";
    const dots = (fullpath.match(/\./g) || []).length;
    return Math.max(dots - 1, 0) + depthOffset;
  }
};

// node_modules/@genrojs/builders/src/renderer/xml.js
var XmlRenderer = class extends RendererBase {
  static mode = "xml";
  renderedItem(node, item, runtimeAttrs, {
    tag: tag2,
    pretty = false,
    depthOffset = 0
  } = {}) {
    const attrs = this._formatAttrs(runtimeAttrs);
    const indent = pretty ? "  ".repeat(this._nodeDepth(node, depthOffset)) : "";
    const newline = pretty ? "\n" : "";
    if (Array.isArray(item)) {
      const body = this._composeStringFragments(item);
      return `${indent}<${tag2}${attrs}>${newline}${body}${indent}</${tag2}>${newline}`;
    }
    if (item === null || item === void 0) {
      return `${indent}<${tag2}${attrs}></${tag2}>${newline}`;
    }
    return `${indent}<${tag2}${attrs}>${this._escapeText(item)}</${tag2}>${newline}`;
  }
  finalize(result, target = null, { docHeader = null } = {}) {
    let text = this._composeStringFragments(result);
    if (docHeader === true) {
      text = `<?xml version='1.0' encoding='UTF-8'?>${text}`;
    } else if (typeof docHeader === "string") {
      text = docHeader + text;
    }
    return super.finalize(text, target);
  }
  _formatAttrs(attrs) {
    return Object.entries(attrs || {}).map(([name, value]) => {
      const outputName = name.startsWith("xmlns_") ? `xmlns:${name.slice("xmlns_".length)}` : name;
      return ` ${outputName}="${this._escapeAttr(value)}"`;
    }).join("");
  }
};

// node_modules/@genrojs/builders/src/collections/base.json
var base_default = {
  document_format: {
    name: "builder_grammar",
    version: "1.1"
  },
  grammar: {
    name: "base",
    version: null,
    title: null,
    description: null
  },
  abstracts: {},
  elements: {
    dataSetter: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "destination",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "type",
              module: "builtins",
              name: "str"
            },
            has_default: false
          },
          {
            name: "value",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "any"
            },
            has_default: false
          },
          {
            name: "attr",
            kind: "var_keyword",
            role: "attribute",
            annotation: {
              kind: "any"
            },
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        data_element: true
      }
    },
    dataFormula: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "destination",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "type",
              module: "builtins",
              name: "str"
            },
            has_default: false
          },
          {
            name: "func",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "union",
              items: [
                {
                  kind: "type",
                  module: "builtins",
                  name: "str"
                },
                {
                  kind: "type",
                  module: "collections.abc",
                  name: "Callable"
                }
              ]
            },
            has_default: false
          },
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        data_element: true
      }
    },
    dataController: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "func",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "union",
              items: [
                {
                  kind: "type",
                  module: "builtins",
                  name: "str"
                },
                {
                  kind: "type",
                  module: "collections.abc",
                  name: "Callable"
                }
              ]
            },
            has_default: false
          },
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        data_element: true
      }
    }
  }
};

// node_modules/@genrojs/builders/src/builder-base.js
function classChain(cls) {
  const chain = [];
  while (cls && cls !== Function.prototype) {
    chain.push(cls);
    cls = Object.getPrototypeOf(cls);
  }
  return chain.reverse();
}
function containerMap(BuilderClass) {
  const result = /* @__PURE__ */ Object.create(null);
  const register = (name, method) => {
    const key = name.toLowerCase();
    const existing = result[key];
    if (existing !== void 0 && existing !== method) {
      throw new Error(
        `container '${name}' is already tied to implementation method '${existing}' (cannot rebind to '${method}')`
      );
    }
    result[key] = method;
  };
  for (const owner of classChain(BuilderClass)) {
    if (Object.hasOwn(owner, "containers")) {
      for (const name of owner.containers || []) register(name, name);
    }
  }
  return result;
}
function grammarTagNames(schema) {
  const names = /* @__PURE__ */ Object.create(null);
  for (const name of Object.keys(schema)) {
    const key = name.toLowerCase();
    if (Object.hasOwn(names, key)) {
      throw new Error(`element declaration '${name}' has a case-insensitive collision with '${names[key]}'`);
    }
    names[key] = name;
  }
  return names;
}
var SOURCE_ROOT = "_root_";
var DATA_ROOT = "_root_";
var DATA_ELEMENT_FIELDS = /* @__PURE__ */ new Set(["destination", "func", "value", "_on_start"]);
var BuilderBase = class _BuilderBase {
  /** The SourceBag class of this builder's Source (legacy GenroPy
   *  `domSrcFactory`): the builder declares the class of the Source, the
   *  Source declares the class of its nodes (`nodeClass`). It is
   *  instantiated for `_sourceroot`, for the `source` payload under
   *  SOURCE_ROOT and for the component expansion root, always as
   *  `new _sourceClass(null, builder)`. Branches created while authoring,
   *  including a promoted scalar node, follow the class of their parent
   *  bag. Redefine it on a subclass to use a SourceBag subclass; to travel
   *  on the TYTX wire, the subclass must be registered in the TYTX subtype
   *  dictionary of `X`. Same name as Python `_source_class`. */
  static _sourceClass = SourceBag;
  static registerBuilder(BuilderClass) {
    if (typeof BuilderClass !== "function" || !(BuilderClass.prototype instanceof _BuilderBase)) {
      throw new TypeError("registerBuilder requires a BuilderBase subclass");
    }
    const name = BuilderClass._name;
    if (typeof name !== "string" || !name) {
      throw new TypeError("registered builders require a non-empty static _name");
    }
    const existing = _BuilderBase._registry.get(name);
    if (existing && existing !== BuilderClass) {
      throw new Error(
        `Builder name '${name}' is already registered to ${existing.name}; cannot register ${BuilderClass.name}`
      );
    }
    _BuilderBase._registry.set(name, BuilderClass);
    return BuilderClass;
  }
  static getBuilderClass(name) {
    const BuilderClass = _BuilderBase._registry.get(name);
    if (!BuilderClass) throw new Error(`No builder registered with name '${name}'`);
    return BuilderClass;
  }
  constructor(name = null) {
    this.name = name || this.constructor._name;
    this._dataroot = new Bag();
    this._dataroot.setBackref();
    this._dataroot.setItem(DATA_ROOT, new Bag());
    this.data = this._dataroot.getItem(DATA_ROOT);
    this._defaultTargets = /* @__PURE__ */ new Map();
    this.materialized = /* @__PURE__ */ Object.create(null);
    this._collection = null;
    this._schemaOverride = null;
    this._tagNamesOverride = null;
    this._componentMap = null;
    this._targetSerial = 0;
    this._subbuilders = /* @__PURE__ */ new Map();
    this._sourceHandles = /* @__PURE__ */ new WeakMap();
    const SourceClass = this.constructor._sourceClass;
    this._sourceroot = new SourceClass(null, this);
    this._sourceroot.setBackref();
    this._sourceroot.setItem(SOURCE_ROOT, new SourceClass(null, this));
    this.source = this._sourceroot.getItem(SOURCE_ROOT);
  }
  /** Stable fluent handle for a raw source bag or node. */
  wrapSource(target) {
    target = sourceTarget(target);
    if (!(target instanceof SourceBag) && !(target instanceof SourceBagNode)) {
      throw new TypeError("wrapSource requires a SourceBag or SourceBagNode");
    }
    let handle = this._sourceHandles.get(target);
    if (!handle) {
      handle = createSourceHandle(this, target);
      this._sourceHandles.set(target, handle);
    }
    return handle;
  }
  get root() {
    return this.wrapSource(this.source);
  }
  /** Return the host-local instance for a registered dialect name. */
  getSubbuilder(name) {
    if (typeof name !== "string" || !name || name.includes(":")) {
      throw new Error(`unsupported subbuilder reference '${name}'`);
    }
    let subbuilder = this._subbuilders.get(name);
    if (!subbuilder) {
      const BuilderClass = _BuilderBase.getBuilderClass(name);
      subbuilder = new BuilderClass();
      this._subbuilders.set(name, subbuilder);
    }
    subbuilder._dataroot = this._dataroot;
    subbuilder.data = this.data;
    return subbuilder;
  }
  _resolveSubbuilderReference(spec, _attrs, tag2) {
    if (typeof spec !== "string" || !spec) {
      throw new Error(`'${tag2}': subbuilder declaration must be a non-empty string`);
    }
    if (spec.includes(":")) {
      throw new Error(
        `'${tag2}': runtime subbuilder reference '${spec}' is unsupported`
      );
    }
    return this.getSubbuilder(spec);
  }
  // --- grammar -----------------------------------------------------
  /** Build `_classSchema` from a `builder_grammar` doc, merging the
   *  parent's (the mixin/inheritance chain). Called in a subclass
   *  `static {}` block — the JS equivalent of Python `__init_subclass__`.
   *  Static components and containers are registered separately because
   *  they carry executable bodies. */
  static defineGrammar(doc) {
    const current = this._classCollection;
    const collection = current ? new Collection(current.toDocument()).update(doc) : new Collection(doc);
    const parsed = parseGrammarDocument(collection.toDocument());
    const resolved = resolveGrammarDeclarations(parsed);
    const tagNames = grammarTagNames(resolved.elements);
    this._classCollection = collection;
    this._classSchema = resolved.elements;
    this._abstracts = resolved.abstracts;
    this._tagNames = tagNames;
  }
  static {
    this.defineGrammar(base_default);
  }
  /** Map lowercase → method name for containers declared along the class chain. */
  get _containers() {
    return containerMap(this.constructor);
  }
  /** The method name for the container `name`, or null. */
  containerMethod(name) {
    return this._containers[name.toLowerCase()] || null;
  }
  componentMethod(name) {
    return this._componentMap?.[name.toLowerCase()] || null;
  }
  get schema() {
    return this._schemaOverride || this.constructor._classSchema || {};
  }
  get schemaTagNames() {
    if (this._schemaOverride) {
      return this._tagNamesOverride ??= grammarTagNames(this.schema);
    }
    return this.constructor._tagNames ??= grammarTagNames(this.schema);
  }
  schemaTag(name) {
    const lookup = name.toLowerCase();
    const direct = this.schemaTagNames[lookup];
    if (direct) {
      return direct;
    }
    const prefix = `${this.constructor._name}_`;
    if (lookup.startsWith(prefix)) {
      return this.schemaTagNames[lookup.slice(prefix.length)] || null;
    }
    return null;
  }
  /** Compose JSON declarations, validate completely, then publish the new schema. */
  loadGrammar(doc, { replace = false } = {}) {
    const current = this._collection || this.constructor._classCollection;
    const collection = replace ? new Collection(doc) : new Collection(current.toDocument()).update(doc);
    const parsed = parseGrammarDocument(collection.toDocument());
    const resolved = resolveGrammarDeclarations(parsed);
    const tagNames = grammarTagNames(resolved.elements);
    this._collection = collection;
    this._schemaOverride = resolved.elements;
    this._tagNamesOverride = tagNames;
    return this;
  }
  /** Public value check used by renderers after removing framework attrs. */
  validateCustomTypes(node) {
    const host = node.parentBag?.parentNode?.builder || node.parentBag?._builder;
    const owner = host && host !== this && host.schema[node.nodeTag]?._meta?.subbuilder ? host : this;
    validateCustomTypeValues(node.nodeTag, owner.schema[node.nodeTag], node.value, node.getAttr() || {});
  }
  validateNodeValues(tag2, value, attrs = {}) {
    const actual = this.schemaTag(tag2);
    if (!actual) throw new Error(`unknown element '${tag2}'`);
    validateElementValues(actual, this.schema[actual], value, attrs);
    return true;
  }
  /** Validate an arbitrary source node (including renderer candidates). */
  validateNode(node, { value, attrs, childTags } = {}) {
    if (!node || typeof node.nodeTag !== "string") throw new TypeError("validateNode requires a source node");
    const nodeValue = value !== void 0 ? value : node.value instanceof SourceBag ? null : node.value;
    this.validateNodeValues(node.nodeTag, nodeValue, attrs || node.getAttr?.() || {});
    const info = this.schema[this.schemaTag(node.nodeTag)];
    const tags = childTags || (node.value instanceof SourceBag ? node.value.getNodes().map((n) => n.nodeTag) : null);
    if (tags) {
      this._validateChildren(node.nodeTag, info, tags, false);
    }
    return true;
  }
  /** Validate an arbitrary list of semantic child tags for a parent tag. */
  validateChildren(tag2, childTags, { includeMinimum = false } = {}) {
    const actual = this.schemaTag(tag2);
    if (!actual) throw new Error(`unknown element '${tag2}'`);
    if (!Array.isArray(childTags) || childTags.some((name) => typeof name !== "string")) {
      throw new TypeError("childTags must be an array of strings");
    }
    return this._validateChildren(actual, this.schema[actual], childTags, includeMinimum);
  }
  /** Validate one element against its semantic parent. A null parent means
   *  the element is at the Source root; SOURCE_ROOT itself is transparent. */
  validateParent(tag2, parentTag = null) {
    const actual = this.schemaTag(tag2);
    if (!actual) throw new Error(`unknown element '${tag2}'`);
    const info = this.schema[actual];
    if (!this._countsForGrammar(info)) return true;
    const spec = info._parentSpec;
    if (spec == null || spec.has("*")) return true;
    if (parentTag === null) throw new Error(`'${actual}' requires a declared parent`);
    const actualParent = this.schemaTag(parentTag);
    if (!actualParent) throw new Error(`unknown parent element '${parentTag}'`);
    this._validateParent(actual, info, actualParent);
    return true;
  }
  // --- node creation (the fluent API converges here) ---------------
  bagCall(bag, tag2, value, attrs) {
    return this.setChild(bag, tag2, value, attrs);
  }
  commandOnNode(node, tag2, value, attrs) {
    node = sourceTarget(node);
    if (node.value instanceof SourceBag) {
      return this.setChild(node.value, tag2, value, attrs);
    }
    const oldValue = node.value;
    const branch2 = new node.parentBag.constructor(null, node.builder || this);
    const child = this.setChild(branch2, tag2, value, attrs, node);
    this.promoteNodeValue(node, oldValue, branch2);
    return child;
  }
  /** Hook for dialects that preserve a scalar while promoting a node to a branch. */
  promoteNodeValue(node, _oldValue, branch2) {
    node.setValue(branch2);
  }
  setChild(bag, tag2, value, attrs, parentOverride = null) {
    const attributes = { ...attrs };
    const info = this.schema[tag2];
    if (!info) throw new Error(`unknown element '${tag2}'`);
    this.validateNodeValues(tag2, value, attributes);
    const subbuilderSpec = info._meta?.subbuilder;
    const subbuilder = subbuilderSpec == null ? null : this._resolveSubbuilderReference(subbuilderSpec, attributes, tag2);
    const branchBuilder = subbuilder || this;
    const branchBindings = value instanceof SourceBag ? value._builderBindingPlan(branchBuilder) : null;
    const rootBuilder = parentOverride?.rootBuilder || bag.root._builder || this;
    if (attributes.nodeId != null && rootBuilder.source.getNodeByAttr("nodeId", attributes.nodeId)) {
      throw new Error(`Duplicate nodeId '${attributes.nodeId}'`);
    }
    if (value instanceof SourceBag) {
      this._validateChildren(tag2, info, value.getNodes().map((node2) => node2.nodeTag), false);
    }
    const parent = parentOverride || bag.parentNode;
    const parentInfo = parent?.nodeTag ? this.schema[parent.nodeTag] : null;
    if (parentInfo && !parent._getMeta("subbuilder") && this._countsForGrammar(info)) {
      this._validateParent(tag2, info, parent.nodeTag);
      this._validateChildren(parent.nodeTag, parentInfo, [...bag.getNodes().map((n) => n.nodeTag), tag2], false);
    } else if (!parentInfo && !parent?._getMeta("subbuilder") && info._parentSpec != null && this._countsForGrammar(info)) {
      throw new Error(`'${tag2}' requires a declared parent`);
    }
    if (info._meta && !("_meta" in attributes)) {
      attributes._meta = info._meta;
    }
    if (info.ns && !("ns" in attributes)) {
      attributes.ns = info.ns;
    }
    const nodePosition = attributes.node_position;
    delete attributes.node_position;
    const explicitLabel = attributes.node_label;
    delete attributes.node_label;
    let label;
    if (parentInfo?.collection_key) {
      if (explicitLabel != null) throw new Error(`'${tag2}': node_label is not allowed in a collection`);
      label = this._collectionLabel(parentInfo.collection_key, tag2, attributes);
    } else {
      const bound = parentInfo?._subSpec?.get(tag2);
      if (bound && bound.max === 1) {
        if (explicitLabel != null) throw new Error(`'${tag2}': node_label is not allowed on a singleton`);
        label = tag2;
      } else label = explicitLabel || info.node_label || this._autoLabel(bag, tag2);
    }
    if (bag.node(label) != null) throw new Error(`duplicate node label '${label}'`);
    const node = bag._setBuilderItem(
      branchBuilder,
      branchBindings,
      label,
      value,
      attributes,
      nodePosition || ">",
      false,
      true,
      null,
      false,
      true,
      null,
      tag2
    );
    return node;
  }
  _countsForGrammar(info) {
    const meta = info?._meta || {};
    return !(meta.data_element || meta.subbuilder || meta.component);
  }
  _validateParent(tag2, info, parentTag) {
    const spec = info._parentSpec;
    if (spec == null || spec.has("*") || !this._countsForGrammar(info)) return;
    if (!spec.has(parentTag)) throw new Error(`'${tag2}' not allowed as child of '${parentTag}'`);
  }
  _validateChildren(parentTag, info, tags, includeMinimum) {
    const spec = info._subSpec;
    if (spec == null || spec.has("*") || info._meta?.subbuilder) return [];
    const counts = /* @__PURE__ */ new Map();
    for (const tag2 of tags) {
      const child = this.schema[tag2];
      if (child && !this._countsForGrammar(child)) continue;
      const bounds = spec.get(tag2);
      if (!bounds) throw new Error(`'${tag2}' not allowed as child of '${parentTag}'`);
      const count = (counts.get(tag2) || 0) + 1;
      counts.set(tag2, count);
      if (count > bounds.max) throw new Error(`too many '${tag2}' in '${parentTag}'`);
    }
    return includeMinimum ? [...spec].filter(([tag2, bounds]) => (counts.get(tag2) || 0) < bounds.min).map(([tag2]) => tag2) : [];
  }
  _collectionLabel(key, tag2, attrs) {
    const value = (name) => {
      if (attrs[name] === null || attrs[name] === void 0) throw new Error(`'${tag2}': collection key needs attribute '${name}'`);
      return String(attrs[name]);
    };
    return key.includes("${") ? key.replace(/\$\{([^}]+)\}/g, (_m, name) => value(name)) : value(key);
  }
  /** Return [path, missingTags] entries for unmet minimum cardinalities. */
  validateSource() {
    const problems = [];
    const walk2 = (bag, prefix = "") => {
      for (const node of bag.getNodes()) {
        const path = prefix ? `${prefix}.${node.label}` : node.label;
        const builder = node.builder;
        builder.validateCustomTypes(node);
        const info = builder.schema[node.nodeTag];
        if (info && !node._getMeta("data_element,subbuilder,component").some(Boolean)) {
          const children = node.value instanceof SourceBag ? node.value.getNodes().map((n) => n.nodeTag) : [];
          const missing = builder._validateChildren(node.nodeTag, info, children, true);
          if (missing.length) problems.push([path, missing]);
        }
        if (node.value instanceof SourceBag) walk2(node.value, path);
      }
    };
    walk2(this.source);
    return problems;
  }
  _autoLabel(bag, tag2) {
    let n = 0;
    while (bag.node(`${tag2}_${n}`) !== null && bag.node(`${tag2}_${n}`) !== void 0) {
      n += 1;
    }
    return `${tag2}_${n}`;
  }
  /** Source node carrying `nodeId` (per-builder id namespace), wrapped
   *  so the grammar dispatch (`.li(...)`) works, like Python's __getattr__. */
  nodeById(nodeId) {
    const node = this.source.getNodeByAttr("nodeId", nodeId);
    if (node === null || node === void 0) {
      throw new Error(`nodeId not found: ${nodeId}`);
    }
    return node.builder.wrapSource(node);
  }
  // --- data binding ------------------------------------------------
  /** Resolve the pointers/values a node carries → [runtimeValue, runtimeAttrs]. */
  runtimeValues(node) {
    node.builder.validateCustomTypes(node);
    const current = /* @__PURE__ */ new Map();
    const carried = {};
    const items = node.runtimeToEvaluate();
    const projected = new Set(items.keys());
    const sourceAttrs = new Map([...Object.entries(node.getAttr()), ...node.fixedAttrItems()]);
    for (const [key, raw] of [...items]) {
      if (typeof key !== "string" || !pointerTransform(raw)) continue;
      for (const name of pointerDependencies(node, raw)) {
        if (!items.has(name)) items.set(name, sourceAttrs.get(name));
      }
    }
    const isDataElement = node._getMeta("data_element");
    for (const [k, v] of items) {
      if (v instanceof BagResolver) {
        current.set(k, v.resolve());
        continue;
      }
      const pointer = typeof k === "string" ? pointerTransform(v)?.pointer ?? v : v;
      if (!node.pointerType(pointer)) {
        current.set(k, typeof k === "string" && typeof v === "string" && v.startsWith("==") ? null : v);
        continue;
      }
      const absPath = node.absDatapath(pointer);
      current.set(k, this.data.getItem(absPath));
      if (!isDataElement && !absPath.includes("?") && k === VALUE) {
        const dataNode = this.data.getNode(absPath);
        if (dataNode) Object.assign(carried, dataNode.getAttr("_wdg"));
      }
    }
    const resolved = resolvePointerItems(items, current, (name, raw, expression, inputs) => this.evaluatePointerExpression(node, name, raw, expression, inputs));
    const runtimeValue = resolved.get(VALUE);
    resolved.delete(VALUE);
    for (const name of resolved.keys()) if (!projected.has(name)) resolved.delete(name);
    return [runtimeValue, { ...Object.fromEntries(resolved), ...carried }];
  }
  /** Consumer hook for := expressions. Static builders intentionally return null.
   * Override using the runtime's compiler/CSP policy. inputs are typed slot values;
   * expression.text refers to them through _pointerValues, never textual injection. */
  evaluatePointerExpression(node, name, raw, expression, inputs) {
    return null;
  }
  /** Stable per-document identity assigned when a renderer requests it. */
  targetId(node) {
    if (node._targetId) {
      return node._targetId;
    }
    const root = node.rootBuilder;
    if (node.parentBag.root !== root.source.root) {
      return null;
    }
    root._targetSerial += 1;
    node._targetId = `n${root._targetSerial}`;
    return node._targetId;
  }
  // --- data-element logic ------------------------------------------
  /** Sources searched (left-to-right) to resolve a data-element func.
   *  Default `[this]`; override `_buildDataLogic` to add more. */
  get dataLogic() {
    if (!this._dataLogic) {
      const built = this._buildDataLogic();
      this._dataLogic = Array.isArray(built) ? built : [built];
    }
    return this._dataLogic;
  }
  _buildDataLogic() {
    return this;
  }
  /** Resolve a callable or a named static function over dataLogic sources. */
  _resolveLogicFunc(func) {
    if (typeof func === "function") {
      return func;
    }
    if (typeof func !== "string") {
      throw new Error("data-element func must be a name or a function");
    }
    for (const source of this.dataLogic) {
      const holder = typeof source === "function" ? source : source.constructor;
      const fn = holder[func];
      if (typeof fn === "function") {
        return fn;
      }
    }
    throw new Error(`data-element func '${func}' not found on any data_logic source`);
  }
  /** Resolve static bindings and remove the element's own fields. */
  _bindings(node) {
    const [, resolved] = this.runtimeValues(node);
    const out = {};
    for (const [k, v] of Object.entries(resolved)) {
      if (!DATA_ELEMENT_FIELDS.has(k)) {
        out[k] = v;
      }
    }
    return out;
  }
  /** Execute a list of data-element nodes. */
  computeLogic(nodes) {
    for (const node of nodes) {
      this._computeNode(node);
    }
  }
  /** Execute one data-element by kind: setter seeds, formula computes
   *  (pure), controller runs side effects (func gets the node). */
  _computeNode(node) {
    const attr = node.getAttr() || {};
    if (node.nodeTag === "dataSetter") {
      const attrs = {};
      for (const [k, v] of Object.entries(attr)) {
        if (k !== "destination" && k !== "value" && !k.startsWith("_")) {
          attrs[k] = v;
        }
      }
      node.setRelativeData(attr.destination, attr.value, {
        attributes: Object.keys(attrs).length ? attrs : null
      });
    } else if (node.nodeTag === "dataFormula") {
      const func = this._resolveLogicFunc(attr.func);
      node.setRelativeData(attr.destination, func(this._bindings(node)));
    } else if (node.nodeTag === "dataController") {
      const func = this._resolveLogicFunc(attr.func);
      func(node, this._bindings(node));
    }
  }
  /** Every source data-element, in document order. */
  _dataElementNodes() {
    const result = [];
    const walk2 = (bag) => {
      for (const node of bag.getNodes()) {
        if (node._getMeta("data_element")) {
          result.push(node);
        }
        if (node.value instanceof SourceBag) {
          walk2(node.value);
        }
      }
    };
    walk2(this.source);
    return result;
  }
  // --- lifecycle ---------------------------------------------------
  setup(_data) {
  }
  main(_root) {
    throw new Error(
      `${this.constructor.name}.main() not implemented: a bare builder is grammar, not a renderable page`
    );
  }
  /** Add the @components declared via `static components = [...]` to the
   *  schema, marked `_meta.component`; the body stays a method on the
   *  page (run at render time by the renderer's expansion). */
  _resolveComponents() {
    const mappings = {};
    for (const owner of classChain(this.constructor)) {
      if (Object.hasOwn(owner, "components")) {
        for (const name of owner.components || []) mappings[name] = name;
      }
    }
    if (!Object.keys(mappings).length) {
      return;
    }
    const merged = { ...this.schema };
    const componentMap = {};
    for (const [name, method] of Object.entries(mappings)) {
      merged[name] = { sub_tags: "", _meta: { component: true } };
      componentMap[name.toLowerCase()] = method;
    }
    const tagNames = grammarTagNames(merged);
    const current = this._collection || this.constructor._classCollection;
    const document = current.toDocument();
    document.abstracts = {};
    document.elements = Object.fromEntries(Object.keys(mappings).map((name) => [name, merged[name]]));
    this._collection = new Collection(current.toDocument()).update(document);
    this._schemaOverride = merged;
    this._componentMap = componentMap;
    this._tagNamesOverride = tagNames;
  }
  /** Fresh throw-away root for a component expansion (CMP.2): a payload
   *  under SOURCE_ROOT inside a wrapper; `datapath` (the expansion's data
   *  anchor) is stamped on the structural node so the body's relative
   *  pointers find it through the ancestor climb. Built, rendered, dropped. */
  _expansionRoot(datapath = null) {
    const SourceClass = this.constructor._sourceClass;
    const wrapper = new SourceClass(null, this);
    wrapper.setBackref();
    wrapper.setItem(
      SOURCE_ROOT,
      new SourceClass(null, this),
      datapath ? { datapath } : null
    );
    return wrapper.getItem(SOURCE_ROOT);
  }
  /** Static lifecycle: setup → component declarations → main → logic. */
  create() {
    this.setup(this.data);
    this._resolveComponents();
    this.main(this.root);
    this.computeLogic(this._dataElementNodes());
  }
  /** Every dialect can render an XML view of its Source. */
  get renderer_xml() {
    return new XmlRenderer(this);
  }
  /** Resolve the renderer declared by the dialect for a selected mode. */
  getRenderer(mode = null) {
    mode ??= this.constructor._defaultRenderMode;
    const renderer = this[`renderer_${mode}`];
    if (!renderer) {
      throw new Error(`${this.constructor.name} does not expose renderer_${mode}`);
    }
    return renderer;
  }
  /** Walk the Source, retaining fragments without delivering them. */
  materialize(mode = null, opts = {}) {
    mode ??= this.constructor._defaultRenderMode;
    const renderer = this.getRenderer(mode);
    const result = renderer.renderChildren(renderer.preprocess(this.source), opts);
    this.materialized[mode] = result;
    return result;
  }
  /** Register a destination for one render mode. */
  setRenderTarget(target, mode = null) {
    mode ??= this.constructor._defaultRenderMode;
    this._defaultTargets.set(mode, target);
  }
  /** Materialize the selected representation, then deliver it. */
  render({ mode = null, target = null, ...opts } = {}) {
    mode ??= this.constructor._defaultRenderMode;
    const renderer = this.getRenderer(mode);
    if (target === false && renderer.renderType !== "string") {
      throw new TypeError("target=false is not valid for an object renderer");
    }
    const destination = target === false ? null : target || this._defaultTargets.get(renderer.mode) || null;
    const options = { ...destination?.renderOpts, ...opts };
    return renderer.finalize(this.materialize(mode, options), destination, options);
  }
};
BuilderBase._registry = /* @__PURE__ */ new Map();

// node_modules/@genrojs/builders/src/renderer/display-format.js
var STYLES = /* @__PURE__ */ new Set(["short", "medium", "long", "full"]);
var TOKENS = /('(?:[^']|'')*'|[a-zA-Z]+|[^a-zA-Z']+)/g;
function temporal(value, dtype) {
  if (!(value instanceof Date)) throw new TypeError("Temporal formats require a typed Date value");
  if (!Number.isFinite(value.getTime())) throw new RangeError("Invalid date");
  const kind = dtype || toTytx(value).split("::").at(-1);
  if (!["D", "H", "DH", "DHZ"].includes(kind)) throw new RangeError(`Unsupported temporal dtype: ${kind}`);
  return kind;
}
function patternDate(value, pattern, locale, kind) {
  const parts = pattern.match(TOKENS) || [];
  if (parts.join("") !== pattern) throw new RangeError("Unclosed format literal");
  const pad = (v, n = 2) => String(v).padStart(n, "0");
  const name = (options) => new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...options }).format(value);
  const date = {
    y: () => String(value.getUTCFullYear()),
    yy: () => pad(value.getUTCFullYear() % 100),
    yyyy: () => pad(value.getUTCFullYear(), 4),
    M: () => String(value.getUTCMonth() + 1),
    MM: () => pad(value.getUTCMonth() + 1),
    MMM: () => name({ month: "short" }),
    MMMM: () => name({ month: "long" }),
    d: () => String(value.getUTCDate()),
    dd: () => pad(value.getUTCDate()),
    EEE: () => name({ weekday: "short" }),
    EEEE: () => name({ weekday: "long" })
  };
  const time = {
    H: () => String(value.getUTCHours()),
    HH: () => pad(value.getUTCHours()),
    h: () => String(value.getUTCHours() % 12 || 12),
    hh: () => pad(value.getUTCHours() % 12 || 12),
    m: () => String(value.getUTCMinutes()),
    mm: () => pad(value.getUTCMinutes()),
    s: () => String(value.getUTCSeconds()),
    ss: () => pad(value.getUTCSeconds()),
    a: () => new Intl.DateTimeFormat(locale, { hour: "numeric", hour12: true, timeZone: "UTC" }).formatToParts(value).find((p) => p.type === "dayPeriod").value
  };
  const tokens = { ...kind === "H" ? {} : date, ...kind === "D" ? {} : time };
  return parts.map((part) => {
    if (part.startsWith("'")) return part === "''" ? "'" : part.slice(1, -1).replaceAll("''", "'");
    if (!/^[a-zA-Z]/.test(part)) return part;
    if (!tokens[part]) throw new RangeError(`Unsupported date format token: ${part}`);
    return tokens[part]();
  }).join("");
}
function formatDisplay(value, { format, mask, locale, dtype, places } = {}) {
  let text = value == null ? "" : String(value);
  if (value != null && value !== "" && (format != null && format !== "" || places != null)) {
    if (typeof value === "number" || isDecimal2(value)) {
      text = formatNumber(value, { format, locale, places });
    } else {
      const kind = temporal(value, dtype);
      if (STYLES.has(format)) {
        const options = { timeZone: "UTC" };
        if (kind !== "H") options.dateStyle = format;
        if (kind !== "D") options.timeStyle = format;
        text = new Intl.DateTimeFormat(locale || void 0, options).format(value);
      } else text = patternDate(value, String(format), locale || void 0, kind);
    }
  }
  return mask == null ? text : String(mask).replaceAll("%s", () => text);
}
function numericOptions({ format = "decimal", places } = {}) {
  const options = { maximumFractionDigits: 20 };
  if (!format || format === "decimal") options.style = "decimal";
  else if (format === "percent") options.style = "percent";
  else if (format === "scientific") options.notation = "scientific";
  else {
    const match = /^(0|#,##0)(?:\.(0*)(#*))?$/.exec(format);
    if (!match || format.includes(".") && !match[2] && !match[3]) throw new RangeError(`Unsupported number format: ${format}`);
    options.useGrouping = match[1].includes(",");
    options.minimumFractionDigits = (match[2] || "").length;
    options.maximumFractionDigits = (match[2] || "").length + (match[3] || "").length;
  }
  if (places != null && places !== "") {
    const count = Number(places);
    if (!Number.isInteger(count) || count < 0 || count > 20) throw new RangeError("places must be an integer from 0 to 20");
    options.minimumFractionDigits = count;
    options.maximumFractionDigits = count;
  }
  return options;
}
function formatNumber(value, options = {}) {
  if (typeof value !== "number" && !isDecimal2(value)) throw new TypeError("Number formatting requires a Number or Decimal");
  if (!Number.isFinite(Number(value))) throw new RangeError("Number must be finite");
  const formatter = new Intl.NumberFormat(options.locale || void 0, numericOptions(options));
  if (isDecimal2(value) && new Intl.NumberFormat("en", { useGrouping: false }).format("9007199254740993") !== "9007199254740993") {
    throw new Error("This browser cannot format Decimal values without precision loss");
  }
  return formatter.format(isDecimal2(value) ? value.toString() : value);
}

// node_modules/@genrojs/builders/src/renderer/html.js
var RAW_TEXT_TAGS = /* @__PURE__ */ new Set(["style", "script"]);
var BOOLEAN_ATTRS = /* @__PURE__ */ new Set([
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var STYLE_ROOTS = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "padding",
  "margin",
  "border",
  "position",
  "display",
  "overflow",
  "float",
  "clear",
  "resize",
  "z_index",
  "min_width",
  "min_height",
  "max_width",
  "max_height",
  "color",
  "background",
  "font",
  "text",
  "line_height",
  "white_space",
  "vertical_align",
  "flex",
  "gap",
  "row_gap",
  "column_gap",
  "grid",
  "align_content",
  "justify_content",
  "align_items",
  "justify_items",
  "visibility",
  "opacity",
  "cursor"
]);
var MACRO_NAMES = /* @__PURE__ */ new Set([
  "rounded",
  "gradient",
  "shadow",
  "transform",
  "transition",
  "zoom",
  "filter"
]);
var cssValue = (value) => value === true ? "true" : value === false ? "false" : String(value);
var px = (value) => typeof value === "number" && Number.isFinite(value) ? `${value}px` : String(value);
function isStyleAttr(name) {
  if (STYLE_ROOTS.has(name)) return true;
  for (const root of STYLE_ROOTS) if (name.startsWith(`${root}_`)) return true;
  return false;
}
function parseStyle(value) {
  const result = /* @__PURE__ */ new Map();
  if (!value) return result;
  const declarations = [];
  let start = 0;
  let quote = null;
  let escaped = false;
  let comment = false;
  let depth = 0;
  const text = String(value);
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (comment) {
      if (char === "*" && next === "/") {
        comment = false;
        index += 1;
      }
      continue;
    }
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
    } else if (char === "/" && next === "*") {
      comment = true;
      index += 1;
    } else if ("([{".includes(char)) {
      depth += 1;
    } else if (")]}".includes(char) && depth > 0) {
      depth -= 1;
    } else if (char === ";" && depth === 0) {
      declarations.push(text.slice(start, index));
      start = index + 1;
    }
  }
  declarations.push(text.slice(start));
  for (const raw of declarations) {
    const entry = raw.trim();
    if (!entry) continue;
    const colon = entry.indexOf(":");
    if (colon < 0) throw new TypeError(`malformed style declaration '${entry}'`);
    result.set(entry.slice(0, colon).trim(), entry.slice(colon + 1).trim());
  }
  return result;
}
var HtmlRenderer = class extends RendererBase {
  static mode = "html";
  renderedItem(node, item, runtimeAttrs, {
    tag: tag2,
    xml = true,
    pretty = false,
    depthOffset = 0,
    includeDatapath = false
  } = {}) {
    const parent = node.parentNode;
    if (parent?._getMeta("subbuilder") === "html") {
      runtimeAttrs = {
        xmlns: "http://www.w3.org/1999/xhtml",
        ...runtimeAttrs
      };
    }
    const { format, mask, locale, places, dtype, ...htmlAttrs } = runtimeAttrs;
    if (!Array.isArray(item) && (format != null || mask != null || places != null)) {
      item = formatDisplay(item, {
        format,
        mask,
        places,
        dtype,
        locale: this._displayLocale(node, locale)
      });
    }
    let attrs = this._formatAttrs(htmlAttrs);
    if (includeDatapath) {
      if (!Object.hasOwn(runtimeAttrs, "id")) {
        const id = this.builder.targetId(node);
        if (id !== null) attrs += ` id="${this._htmlAttrValue(id)}"`;
      }
      for (const [name, value] of Object.entries(node.getAttr())) {
        if (node.pointerType(value)) {
          attrs += ` data-${this.adapt(name)}-pointer="${this._htmlAttrValue(node.absDatapath(value))}"`;
        }
      }
    }
    const indent = pretty ? "  ".repeat(this._nodeDepth(node, depthOffset)) : "";
    const newline = pretty ? "\n" : "";
    if (node._getMeta("void")) return `${indent}<${tag2}${attrs}${xml ? "/" : ""}>${newline}`;
    if (Array.isArray(item)) {
      const body = this._composeStringFragments(item);
      return `${indent}<${tag2}${attrs}>${newline}${body}${indent}</${tag2}>${newline}`;
    }
    if (item === null || item === void 0) return `${indent}<${tag2}${attrs}></${tag2}>${newline}`;
    const text = typeof item === "string" && item.endsWith("::HTML") ? item.slice(0, -6) : RAW_TEXT_TAGS.has(tag2) ? String(item) : this._escapeText(item);
    return `${indent}<${tag2}${attrs}>${text}</${tag2}>${newline}`;
  }
  /** Resolve an inherited locale in the ancestor's own Data scope. */
  _displayLocale(node, locale) {
    if (locale) return locale;
    for (let parent = node.parentNode; parent; parent = parent.parentNode) {
      const raw = parent.getAttr("locale");
      if (raw == null) continue;
      const value = parent.pointerType(raw) ? parent.data.getItem(parent.absDatapath(raw)) : raw;
      if (value) return value;
    }
    return void 0;
  }
  /** Python-compatible HTML attribute and Genro CSS kwarg adaptation. */
  adaptAttrs(attrs) {
    const out = {};
    const styleAttrs = {};
    for (const [rawName, value] of Object.entries(attrs || {})) {
      if (rawName.startsWith(`${this.builder.constructor._name}_`)) {
        out[this.adapt(rawName)] = value;
      } else if (rawName === "dtype") {
        out.dtype = value;
      } else if (this.builder.constructor.retainedAttrPrefixes.some((prefix) => rawName.startsWith(prefix))) {
        continue;
      } else if (this._isStyleContribution(rawName)) {
        styleAttrs[rawName] = value;
      } else {
        out[rawName] = value;
      }
    }
    const style = this._adaptStyle(styleAttrs);
    if (style) out.style = style;
    return out;
  }
  _isStyleContribution(name) {
    if (name === "style" || name.startsWith("style_") || MACRO_NAMES.has(name)) return true;
    const head = name.includes("_") ? name.slice(0, name.indexOf("_")) : null;
    return head !== null && MACRO_NAMES.has(head) || isStyleAttr(name);
  }
  _adaptStyle(attrs) {
    const css = parseStyle(attrs.style);
    const values = /* @__PURE__ */ new Map();
    const subs = /* @__PURE__ */ new Map();
    for (const [name, value] of Object.entries(attrs)) {
      if (name === "style") continue;
      if (name.startsWith("style_")) {
        css.set(name.slice(6).replaceAll("_", "-"), cssValue(value));
      } else if (MACRO_NAMES.has(name)) {
        values.set(name, value);
      } else {
        const split = name.indexOf("_");
        const head = split < 0 ? name : name.slice(0, split);
        if (split >= 0 && MACRO_NAMES.has(head)) {
          if (!subs.has(head)) subs.set(head, {});
          subs.get(head)[name.slice(split + 1)] = value;
        } else {
          css.set(name.replaceAll("_", "-"), cssValue(value));
        }
      }
    }
    for (const name of MACRO_NAMES) {
      if (values.has(name) || subs.has(name)) {
        this[`_macro_${name}`](values.get(name), subs.get(name) || {}, css);
      }
    }
    return [...css].map(([key, value]) => `${key}: ${value}`).join("; ");
  }
  _formatAttrs(attrs) {
    const parts = [];
    for (const [name, value] of Object.entries(attrs || {})) {
      if (BOOLEAN_ATTRS.has(name)) {
        if (value) parts.push(` ${name}`);
      } else {
        parts.push(` ${name}="${this._htmlAttrValue(value)}"`);
      }
    }
    return parts.join("");
  }
  _htmlAttrValue(value) {
    const text = value === true ? "true" : value === false ? "false" : String(value);
    return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }
  _macro_rounded(value, subs, css) {
    const corners = value === void 0 ? {} : {
      top_left: value,
      top_right: value,
      bottom_left: value,
      bottom_right: value
    };
    for (const [name, subValue] of Object.entries(subs)) {
      if (name === "top" || name === "bottom") {
        corners[`${name}_left`] = subValue;
        corners[`${name}_right`] = subValue;
      } else if (name === "left" || name === "right") {
        corners[`top_${name}`] = subValue;
        corners[`bottom_${name}`] = subValue;
      } else if (["top_left", "top_right", "bottom_left", "bottom_right"].includes(name)) {
        corners[name] = subValue;
      } else throw new TypeError(`rounded: unknown sub-kwarg '${name}'`);
    }
    for (const [corner, cornerValue] of Object.entries(corners)) {
      css.set(`border-${corner.replaceAll("_", "-")}-radius`, px(cornerValue));
    }
  }
  _macro_transform(value, subs, css) {
    const parts = value === void 0 ? [] : [String(value)];
    for (const [name, subValue] of Object.entries(subs)) {
      if (name === "rotate") parts.push(`rotate(${subValue}deg)`);
      else if (name === "scale" || name === "translate") parts.push(`${name}(${subValue})`);
      else if (name === "translate_x") parts.push(`translateX(${px(subValue)})`);
      else if (name === "translate_y") parts.push(`translateY(${px(subValue)})`);
      else if (name === "skew_x") parts.push(`skewX(${subValue}deg)`);
      else if (name === "skew_y") parts.push(`skewY(${subValue}deg)`);
      else parts.push(`${name.replaceAll("_", "-")}(${subValue})`);
    }
    if (parts.length) css.set("transform", parts.join(" "));
  }
  _macro_filter(value, subs, css) {
    const parts = value === void 0 ? [] : [String(value)];
    for (const [name, subValue] of Object.entries(subs)) {
      if (name === "rotate") parts.push(`hue-rotate(${subValue}deg)`);
      else if (name === "blur") parts.push(`blur(${px(subValue)})`);
      else if (name === "drop_shadow") parts.push(`drop-shadow(${subValue})`);
      else parts.push(`${name.replaceAll("_", "-")}(${subValue})`);
    }
    if (parts.length) css.set("filter", parts.join(" "));
  }
  _macro_transition(value, subs, css) {
    if (value !== void 0) css.set("transition", String(value));
    for (const [name, subValue] of Object.entries(subs)) css.set(`transition-${name.replaceAll("_", "-")}`, String(subValue));
  }
  _macro_zoom(value, _subs, css) {
    if (value !== void 0) css.set("zoom", String(value));
  }
  _macro_shadow(value, subs, css) {
    if (value !== void 0) css.set("box-shadow", String(value));
    for (const [name, subValue] of Object.entries(subs)) css.set(`box-shadow-${name.replaceAll("_", "-")}`, String(subValue));
  }
  _macro_gradient(value, _subs, css) {
    if (value !== void 0) css.set("background-image", String(value));
  }
};

// node_modules/@genrojs/builders/src/renderer/svg.js
var KEBAB_ATTRS = /* @__PURE__ */ new Set([
  "alignment_baseline",
  "baseline_shift",
  "clip_path",
  "clip_rule",
  "color_interpolation",
  "color_interpolation_filters",
  "dominant_baseline",
  "fill_opacity",
  "fill_rule",
  "flood_color",
  "flood_opacity",
  "font_family",
  "font_size",
  "font_size_adjust",
  "font_stretch",
  "font_style",
  "font_variant",
  "font_weight",
  "glyph_orientation_horizontal",
  "glyph_orientation_vertical",
  "image_rendering",
  "letter_spacing",
  "lighting_color",
  "marker_end",
  "marker_mid",
  "marker_start",
  "overline_position",
  "overline_thickness",
  "paint_order",
  "pointer_events",
  "shape_rendering",
  "stop_color",
  "stop_opacity",
  "strikethrough_position",
  "strikethrough_thickness",
  "stroke_dasharray",
  "stroke_dashoffset",
  "stroke_linecap",
  "stroke_linejoin",
  "stroke_miterlimit",
  "stroke_opacity",
  "stroke_width",
  "text_anchor",
  "text_decoration",
  "text_rendering",
  "underline_position",
  "underline_thickness",
  "unicode_bidi",
  "word_spacing",
  "writing_mode"
]);
function svgAttributes(attrs) {
  return Object.fromEntries(Object.entries(attrs || {}).map(([name, value]) => [
    KEBAB_ATTRS.has(name) ? name.replaceAll("_", "-") : name,
    value
  ]));
}
var SvgRenderer = class extends XmlRenderer {
  static mode = "svg";
  adaptAttrs(attrs) {
    return svgAttributes(attrs);
  }
};

// node_modules/@genrojs/builders/src/collections/html5.json
var html5_default = {
  document_format: {
    name: "builder_grammar",
    version: "1.1"
  },
  grammar: {
    name: "html",
    version: null,
    title: null,
    description: null
  },
  abstracts: {},
  elements: {
    svg: {
      doc: "Switch to the SVG dialect from this node down (BLD.2).\n\n        A sub-builder element: ``_meta['subbuilder']`` switches the active\n        dialect to SVG from this node down. No ``render_tag``: ``<svg>`` is\n        emitted verbatim (HTML5 has a native ``<svg>`` tag).",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        subbuilder: "svg"
      }
    },
    a: {
      doc: null,
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    abbr: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    address: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    area: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        void: true
      }
    },
    article: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    aside: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    audio: {
      doc: null,
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    b: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    base: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        void: true
      }
    },
    bdi: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    bdo: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    blockquote: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    body: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    br: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        void: true
      }
    },
    button: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    canvas: {
      doc: null,
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    caption: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    cite: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    code: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    col: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        void: true
      }
    },
    colgroup: {
      doc: null,
      sub_tags: "col,script,template",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    data: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    datalist: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,option,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    dd: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    del_: {
      doc: null,
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    details: {
      doc: null,
      sub_tags: "summary[0:1],a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    dfn: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    dialog: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    div: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    dl: {
      doc: null,
      sub_tags: "dd,div,dt,script,template",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    dt: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    em: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    embed: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        void: true
      }
    },
    fieldset: {
      doc: null,
      sub_tags: "legend[0:1],a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    figcaption: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    figure: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figcaption[0:1],figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    footer: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    form: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    h1: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    h2: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    h3: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    h4: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    h5: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    h6: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    head: {
      doc: null,
      sub_tags: "base[0:1],link,meta,noscript,script,style,template,title[0:1]",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    header: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    hgroup: {
      doc: null,
      sub_tags: "h1,h2,h3,h4,h5,h6,p,script,template",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    hr: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        void: true
      }
    },
    html: {
      doc: null,
      sub_tags: "head[0:1],body[0:1]",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    i: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    iframe: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    img: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        void: true
      }
    },
    input: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        void: true
      }
    },
    ins: {
      doc: null,
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    kbd: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    label: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    legend: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,h1,h2,h3,h4,h5,h6,hgroup,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    li: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    link: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        void: true
      }
    },
    main: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    map: {
      doc: null,
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    mark: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    menu: {
      doc: null,
      sub_tags: "li,script,template",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    meta: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        void: true
      }
    },
    meter: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    nav: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    noscript: {
      doc: null,
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    object: {
      doc: null,
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    ol: {
      doc: null,
      sub_tags: "li,script,template",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    optgroup: {
      doc: null,
      sub_tags: "div,legend,noscript,option,script,template",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    option: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,div,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    output: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    p: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    picture: {
      doc: null,
      sub_tags: "img[0:1],script,source,template",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    pre: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    progress: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    q: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    rp: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    rt: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    ruby: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    s: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    samp: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    script: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    search: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    section: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    select: {
      doc: null,
      sub_tags: "button,div,hr,noscript,optgroup,option,script,template",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    slot: {
      doc: null,
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    small: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    source: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        void: true
      }
    },
    span: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    strong: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    style: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    sub: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    summary: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,h1,h2,h3,h4,h5,h6,hgroup,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    sup: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    table: {
      doc: null,
      sub_tags: "caption[0:1],colgroup,script,tbody,template,tfoot[0:1],thead[0:1],tr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    tbody: {
      doc: null,
      sub_tags: "script,template,tr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    td: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    template: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,del_,details,dfn,dialog,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,source,span,strong,style,sub,summary,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,tr,track,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    textarea: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    tfoot: {
      doc: null,
      sub_tags: "script,template,tr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    th: {
      doc: null,
      sub_tags: "a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,br,button,canvas,cite,code,data,datalist,del_,details,dfn,dialog,div,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,iframe,img,input,ins,kbd,label,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,output,p,picture,pre,progress,q,ruby,s,samp,script,search,section,select,selectedcontent,slot,small,span,strong,style,sub,sup,table,template,textarea,time,u,ul,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    thead: {
      doc: null,
      sub_tags: "script,template,tr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    time: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    title: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    tr: {
      doc: null,
      sub_tags: "script,td,template,th",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    track: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        void: true
      }
    },
    u: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    ul: {
      doc: null,
      sub_tags: "li,script,template",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    var: {
      doc: null,
      sub_tags: "a,abbr,area,audio,b,bdi,bdo,br,button,canvas,cite,code,data,datalist,del_,dfn,em,embed,i,iframe,img,input,ins,kbd,label,link,map,mark,meta,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,selectedcontent,slot,small,span,strong,sub,sup,template,textarea,time,u,var,video,wbr",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    video: {
      doc: null,
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    wbr: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        void: true
      }
    },
    selectedcontent: {
      doc: "Mirror of the selected option for Customizable Select (HTML 2024).",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    dataSetter: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "destination",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "type",
              module: "builtins",
              name: "str"
            },
            has_default: false
          },
          {
            name: "value",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "any"
            },
            has_default: false
          },
          {
            name: "attr",
            kind: "var_keyword",
            role: "attribute",
            annotation: {
              kind: "any"
            },
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        data_element: true
      }
    },
    dataFormula: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "destination",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "type",
              module: "builtins",
              name: "str"
            },
            has_default: false
          },
          {
            name: "func",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "union",
              items: [
                {
                  kind: "type",
                  module: "builtins",
                  name: "str"
                },
                {
                  kind: "type",
                  module: "collections.abc",
                  name: "Callable"
                }
              ]
            },
            has_default: false
          },
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        data_element: true
      }
    },
    dataController: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "func",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "union",
              items: [
                {
                  kind: "type",
                  module: "builtins",
                  name: "str"
                },
                {
                  kind: "type",
                  module: "collections.abc",
                  name: "Callable"
                }
              ]
            },
            has_default: false
          },
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        data_element: true
      }
    }
  }
};

// node_modules/@genrojs/builders/src/builder/html.js
var HtmlBuilder = class extends BuilderBase {
  static _name = "html";
  static _defaultRenderMode = "html";
  static retainedAttrPrefixes = ["validate_", "dtype"];
  static {
    this.defineGrammar(html5_default);
  }
  get renderer_html() {
    return new HtmlRenderer(this);
  }
};
BuilderBase.registerBuilder(HtmlBuilder);

// node_modules/@genrojs/builders/src/collections/svg.json
var svg_default = {
  document_format: {
    name: "builder_grammar",
    version: "1.1"
  },
  grammar: {
    name: "svg",
    version: null,
    title: null,
    description: null
  },
  abstracts: {
    graphics: {
      doc: "SVG graphics content: any graphical element.",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      _meta: null
    },
    containerElement: {
      doc: "SVG container content: elements that can hold children.",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      _meta: null
    }
  },
  elements: {
    html: {
      doc: "Switch to the HTML dialect from this node down (BLD.2).\n\n        A sub-builder element: ``_meta['subbuilder']`` switches the active\n        dialect to HTML from this node down. The source tag ``html`` is\n        rendered as ``_meta['render_tag']`` (``<foreignObject>``) carrying\n        ``_meta['render_attributes']`` (the SVG namespace).  The immediate\n        HTML child declares XHTML so both sides of the XML boundary retain\n        their native namespace.\n        ",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        subbuilder: "html",
        render_tag: "foreignObject",
        render_attributes: {
          xmlns: "http://www.w3.org/2000/svg"
        }
      }
    },
    svg: {
      doc: "Root SVG container or nested SVG viewport.",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    g: {
      doc: "Group container for applying transforms and styles.",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    defs: {
      doc: "Container for referenced elements (gradients, patterns, etc.).",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    symbol: {
      doc: "Reusable graphical template, rendered only when referenced by <use>.",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    use: {
      doc: "Reference and render a <symbol> or other element.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    rect: {
      doc: "Rectangle.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    circle: {
      doc: "Circle.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    ellipse: {
      doc: "Ellipse.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    line: {
      doc: "Line segment between two points.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    polyline: {
      doc: "Open shape of connected line segments.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    polygon: {
      doc: "Closed shape of connected line segments.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    path: {
      doc: "Arbitrary shape defined by path commands (d attribute).",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    image: {
      doc: "Embedded raster image.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    text: {
      doc: "Text block. Contains text content and optional <tspan>/<textPath>.",
      sub_tags: "tspan,textPath",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    tspan: {
      doc: "Inline text span within <text>.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    textPath: {
      doc: "Text rendered along a path shape.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    linearGradient: {
      doc: "Linear gradient definition. Place inside <defs>.",
      sub_tags: "stop",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    radialGradient: {
      doc: "Radial gradient definition. Place inside <defs>.",
      sub_tags: "stop",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    stop: {
      doc: "Gradient stop (color and offset).",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    pattern: {
      doc: "Tile pattern definition. Place inside <defs>.",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    clipPath: {
      doc: "Clipping path definition.",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    mask: {
      doc: "Alpha mask definition.",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    marker: {
      doc: "Marker symbol for line endpoints or vertices.",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    filter: {
      doc: "Filter effect container. Place inside <defs>.",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feGaussianBlur: {
      doc: "Gaussian blur filter primitive.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feOffset: {
      doc: "Offset filter primitive.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feBlend: {
      doc: "Blend filter primitive.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feColorMatrix: {
      doc: "Color matrix filter primitive.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feComposite: {
      doc: "Composite filter primitive.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feFlood: {
      doc: "Flood fill filter primitive.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feMerge: {
      doc: "Merge filter primitive (container for feMergeNode).",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feMergeNode: {
      doc: "Single input for feMerge.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feDropShadow: {
      doc: "Drop shadow filter primitive (SVG 2).",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feDiffuseLighting: {
      doc: "Diffuse lighting filter primitive.",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feSpecularLighting: {
      doc: "Specular lighting filter primitive.",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    fePointLight: {
      doc: "Point light source for lighting filters.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feDistantLight: {
      doc: "Distant light source for lighting filters.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feSpotLight: {
      doc: "Spot light source for lighting filters.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feMorphology: {
      doc: "Morphology filter primitive (erode/dilate).",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feTurbulence: {
      doc: "Turbulence noise filter primitive.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feDisplacementMap: {
      doc: "Displacement map filter primitive.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feConvolveMatrix: {
      doc: "Convolution matrix filter primitive.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feImage: {
      doc: "Image filter primitive.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    feTile: {
      doc: "Tile filter primitive.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    animate: {
      doc: "Animate an attribute over time.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    animateTransform: {
      doc: "Animate a transform attribute.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    animateMotion: {
      doc: "Animate motion along a path.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    set: {
      doc: "Set an attribute to a value for a duration.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    title: {
      doc: "Accessible title (tooltip in browsers).",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    desc: {
      doc: "Accessible description.",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    metadata: {
      doc: "Metadata container (RDF, Dublin Core, etc.).",
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    a: {
      doc: "Hyperlink wrapper.",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    foreignObject: {
      doc: "Container for non-SVG content (HTML, MathML).",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    switch: {
      doc: "Conditional processing (renders first matching child).",
      sub_tags: "*",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: null
    },
    dataSetter: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "destination",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "type",
              module: "builtins",
              name: "str"
            },
            has_default: false
          },
          {
            name: "value",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "any"
            },
            has_default: false
          },
          {
            name: "attr",
            kind: "var_keyword",
            role: "attribute",
            annotation: {
              kind: "any"
            },
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        data_element: true
      }
    },
    dataFormula: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "destination",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "type",
              module: "builtins",
              name: "str"
            },
            has_default: false
          },
          {
            name: "func",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "union",
              items: [
                {
                  kind: "type",
                  module: "builtins",
                  name: "str"
                },
                {
                  kind: "type",
                  module: "collections.abc",
                  name: "Callable"
                }
              ]
            },
            has_default: false
          },
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        data_element: true
      }
    },
    dataController: {
      doc: null,
      sub_tags: "",
      parent_tags: null,
      inherits_from: null,
      ns: null,
      attributes: {
        parameters: [
          {
            name: "func",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "union",
              items: [
                {
                  kind: "type",
                  module: "builtins",
                  name: "str"
                },
                {
                  kind: "type",
                  module: "collections.abc",
                  name: "Callable"
                }
              ]
            },
            has_default: false
          },
          {
            name: "kwargs",
            kind: "var_keyword",
            role: "attribute",
            annotation: null,
            has_default: false
          }
        ],
        accepts_var_keyword: true,
        accepts_var_positional: false
      },
      node_label: null,
      collection_key: null,
      _meta: {
        data_element: true
      }
    }
  }
};

// node_modules/@genrojs/builders/src/builder/svg.js
var SvgBuilder = class extends BuilderBase {
  static _name = "svg";
  static _defaultRenderMode = "svg";
  static {
    this.defineGrammar(svg_default);
  }
  get renderer_svg() {
    return new SvgRenderer(this);
  }
};
BuilderBase.registerBuilder(SvgBuilder);

// src/renderer/attributes.js
var SVG_NS = "http://www.w3.org/2000/svg";

// collection-authoring:@gramlot/gramlot/components
var components_exports = {};
__export(components_exports, {
  defineCollection: () => defineCollection
});
__reExport(components_exports, components_star);
import * as components_star from "@gramlot/gramlot/components";
import { defineCollection as create } from "@gramlot/gramlot/components";
function defineCollection(options) {
  if (options.name !== "grid") throw new Error("Unexpected bundled collection");
  const css = [], assets = {};
  options.css?.forEach((url, index) => {
    url.href = css[index].href;
  });
  for (const [key, url] of Object.entries(options.assets ?? {})) url.href = assets[key].href;
  return create({ ...options, css, assets });
}

// src/components/parameters.js
function projectParameters(element, attrs) {
  element.parameters = Object.fromEntries(Object.entries(element.constructor.gramlotComponent.parameters).map(([name, spec]) => [name, Object.hasOwn(attrs, name) ? attrs[name] : spec.default]));
  return Object.fromEntries(Object.entries(attrs).filter(([name]) => !Object.hasOwn(element.parameters, name)));
}

// src/components/container.js
function Container(HTMLElement) {
  return class extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });
      const style = this.ownerDocument.createElement("style");
      style.textContent = `:host{box-sizing:border-box;display:block;min-width:0;font:inherit;color:var(--gramlot-ink,CanvasText)}
                *,*::before,*::after{box-sizing:border-box}.control-box{min-width:0}slot{display:contents}
                ::slotted(*){min-width:0;max-width:100%}`;
      this.controlBox = this.ownerDocument.createElement("div");
      this.controlBox.className = "control-box";
      this.control = this.controlBox;
      this.control.id = "control";
      this.control.append(this.ownerDocument.createElement("slot"));
      shadow.append(style, this.controlBox);
    }
    projectAttributes(attrs) {
      return projectParameters(this, attrs);
    }
  };
}
Container.parameters = {};

// src/components/grid-rows.js
var GridRows = class {
  constructor(store, format) {
    this.store = store;
    this.format = format;
  }
  read(columns, nodes = this.store.getRows()) {
    return nodes.map((node) => ({ node, cells: columns.map((column) => cellText(this.store.value(node, column.field), column, this.format)) }));
  }
};
function cellText(value, column, format) {
  if (value == null) return "";
  const { dtype, format: pattern } = column;
  if (dtype === "T" && typeof value !== "string" || dtype === "B" && typeof value !== "boolean") throw new TypeError(`grid ${column.field} does not match ${dtype}`);
  if (typeof value === "string" || typeof value === "boolean") {
    if (dtype && !["T", "B"].includes(dtype) || pattern != null) throw new TypeError(`grid ${column.field} requires a typed numeric or temporal value`);
    return String(value);
  }
  if (value instanceof Date || pattern != null) return format(value, { dtype, pattern: pattern ?? "short" });
  if (dtype && !["L", "R", "N"].includes(dtype)) throw new TypeError(`grid ${column.field} does not match ${dtype}`);
  if (dtype === "L" && !Number.isInteger(value)) throw new TypeError("grid L requires an integer");
  if (typeof value === "number" && Number.isFinite(value) || isDecimal2(value) && value.isFinite()) return String(value);
  throw new TypeError(`grid ${column.field} requires a scalar value`);
}

// src/components/grid-structure.js
import { Bag as Bag2 } from "@gramlot/gramlot";
var TYPES = /* @__PURE__ */ new Set(["T", "B", "L", "R", "N", "D", "H", "DHZ"]);
var COLUMN_KEYS = /* @__PURE__ */ new Set(["tag", "field", "name", "dtype", "width", "align", "format", "columnset", "white_space"]);
var GROUP_KEYS = /* @__PURE__ */ new Set(["tag", "code", "name", "background", "color"]);
var GridStructure = class {
  #nodes = /* @__PURE__ */ new Map();
  constructor(bag) {
    if (!(bag instanceof Bag2)) throw new TypeError("grid structpath must resolve to a Bag");
    const view = branch(bag, "view_0"), info = branch(bag, "info");
    const cells = branch(view, "rows_0"), definitions = branch(info, "columnsets");
    const fields = /* @__PURE__ */ new Set(), groups = /* @__PURE__ */ new Map();
    for (const node of definitions.getNodes()) {
      const attrs = node.getAttr();
      requireKeys(attrs, GROUP_KEYS);
      requireIdentity(attrs.code, "colgroup code");
      if (attrs.tag !== "columnset" || node.resolver || node.staticValue != null || node.label !== attrs.code) {
        throw new TypeError("grid columnset requires a scalar definition labelled by code");
      }
      if (groups.has(attrs.code)) throw new TypeError(`Duplicate grid colgroup: ${attrs.code}`);
      if (attrs.name != null && typeof attrs.name !== "string") throw new TypeError("grid group name must be text");
      for (const key of ["background", "color"]) if (attrs[key] != null && typeof attrs[key] !== "string") throw new TypeError(`grid ${key} must be text`);
      groups.set(attrs.code, { ...attrs, name: attrs.name ?? attrs.code });
    }
    this.columns = [];
    this.groups = [];
    for (const node of cells.getNodes()) {
      const attrs = node.getAttr();
      requireKeys(attrs, COLUMN_KEYS);
      if (attrs.tag !== "cell" || node.staticValue != null || node.resolver) throw new TypeError("grid cell must be a scalar declaration");
      requireIdentity(attrs.field, "field");
      if (fields.has(attrs.field)) throw new TypeError(`Duplicate grid field: ${attrs.field}`);
      fields.add(attrs.field);
      this.#nodes.set(attrs.field, node);
      if (attrs.columnset != null && !groups.has(attrs.columnset)) throw new TypeError(`Unknown grid columnset: ${attrs.columnset}`);
      if (attrs.dtype != null && !TYPES.has(attrs.dtype)) throw new TypeError(`Unsupported grid dtype: ${attrs.dtype}`);
      if (attrs.align != null && !["start", "center", "end"].includes(attrs.align)) throw new TypeError("grid align requires start, center or end");
      if (attrs.width != null && (typeof attrs.width !== "string" || !/^(?:\d+(?:\.\d+)?)(?:px|em|rem|ch|%)$/.test(attrs.width))) {
        throw new TypeError("grid width requires a nonnegative CSS length (px, em, rem, ch or %)");
      }
      if (attrs.white_space != null && !["normal", "nowrap", "pre-wrap"].includes(attrs.white_space)) throw new TypeError("grid white_space requires normal, nowrap or pre-wrap");
      for (const key of ["name", "format"]) if (attrs[key] != null && typeof attrs[key] !== "string") throw new TypeError(`grid ${key} must be text`);
      const column = Object.freeze({
        ...attrs,
        name: attrs.name ?? attrs.field,
        align: attrs.align ?? (["L", "R", "N"].includes(attrs.dtype) ? "end" : "start")
      });
      this.columns.push(column);
      const code = attrs.columnset ?? null;
      let run = this.groups.at(-1);
      if (!run || run.code !== code) {
        run = { code, ...code === null ? { name: null } : groups.get(code), columns: [] };
        this.groups.push(run);
      }
      run.columns.push(column);
    }
    if (!this.columns.length) throw new TypeError("grid struct requires at least one column");
    for (const group of this.groups) {
      Object.freeze(group.columns);
      Object.freeze(group);
    }
    Object.freeze(this.columns);
    Object.freeze(this.groups);
    Object.freeze(this);
  }
  columnNode(field) {
    return this.#nodes.get(field);
  }
  moveColumn(field, targetField, after = false) {
    const node = this.#nodes.get(field), target = this.#nodes.get(targetField);
    if (!node || !target || node === target) return;
    const bag = node.parentBag, nodes = bag.getNodes();
    const from = nodes.indexOf(node), targetIndex = nodes.indexOf(target);
    const position = targetIndex + Number(after) - Number(from < targetIndex);
    if (position !== from) bag.move(from, position);
  }
  setColumnWidth(field, width) {
    if (!Number.isFinite(width) || width <= 0) throw new TypeError("grid resized width must be positive pixels");
    this.#nodes.get(field).setAttr({ width: `${Math.round(width)}px` });
  }
};
function branch(bag, label) {
  const node = bag.getNode(label);
  if (!node || node.resolver || !(node.staticValue instanceof Bag2)) throw new TypeError(`grid struct requires Bag ${label}`);
  return node.staticValue;
}
function requireKeys(attrs, allowed) {
  for (const key of Object.keys(attrs)) if (!allowed.has(key)) throw new TypeError(`Unsupported grid struct attribute: ${key}`);
}
function requireIdentity(value, label) {
  if (typeof value !== "string" || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) throw new TypeError(`grid ${label} requires a simple field identifier`);
}

// src/components/grid-header-interaction.js
var GridHeaderInteraction = class {
  #head;
  #control;
  #structure;
  #sort;
  #suppressClick = false;
  #gesture = null;
  #drag = null;
  constructor(head, control, structure, sort) {
    this.#head = head;
    this.#control = control;
    this.#structure = structure;
    this.#sort = sort;
  }
  connect() {
    this.#head.addEventListener("click", this.#click);
    this.#head.addEventListener("pointerdown", this.#start);
    this.#head.addEventListener("pointermove", this.#move);
    this.#head.addEventListener("pointerup", this.#finish);
    this.#head.addEventListener("pointercancel", this.#cancel);
    this.#head.addEventListener("lostpointercapture", this.#cancel);
    this.#head.addEventListener("keydown", this.#key);
    this.#head.addEventListener("dragstart", this.#dragStart);
    this.#head.addEventListener("dragover", this.#dragOver);
    this.#head.addEventListener("drop", this.#drop);
    this.#head.addEventListener("dragend", this.#clearDrag);
  }
  disconnect() {
    this.cancel();
    this.#head.removeEventListener("click", this.#click);
    this.#head.removeEventListener("pointerdown", this.#start);
    this.#head.removeEventListener("pointermove", this.#move);
    this.#head.removeEventListener("pointerup", this.#finish);
    this.#head.removeEventListener("pointercancel", this.#cancel);
    this.#head.removeEventListener("lostpointercapture", this.#cancel);
    this.#head.removeEventListener("keydown", this.#key);
    this.#head.removeEventListener("dragstart", this.#dragStart);
    this.#head.removeEventListener("dragover", this.#dragOver);
    this.#head.removeEventListener("drop", this.#drop);
    this.#head.removeEventListener("dragend", this.#clearDrag);
  }
  #click = (event) => {
    if (this.#suppressClick) {
      this.#suppressClick = false;
      return;
    }
    if (event.target.closest(".column-resize")) return;
    const header = event.target.closest("th[data-field]");
    if (header) this.#sort(header.dataset.field, event.shiftKey);
  };
  #dragStart = (event) => {
    const header = event.target.closest("th[data-field]");
    if (!header || this.#gesture) {
      event.preventDefault();
      return;
    }
    this.#suppressClick = true;
    this.#drag = { field: header.dataset.field, node: this.#structure().columnNode(header.dataset.field) };
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", header.textContent);
    header.classList.add("column-dragging");
  };
  #dropTarget(event) {
    const header = event.target.closest("th[data-field]");
    if (!this.#drag || !header) return null;
    const target = this.#structure().columnNode(header.dataset.field);
    if (this.#structure().columnNode(this.#drag.field) !== this.#drag.node || target === this.#drag.node || target.parentBag !== this.#drag.node.parentBag) return null;
    return {
      header,
      field: header.dataset.field,
      after: event.clientX > header.getBoundingClientRect().left + header.getBoundingClientRect().width / 2
    };
  }
  #dragOver = (event) => {
    const target = this.#dropTarget(event);
    for (const cell of this.#head.querySelectorAll("[data-drop]")) cell.removeAttribute("data-drop");
    if (!target) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    target.header.dataset.drop = target.after ? "after" : "before";
  };
  #drop = (event) => {
    const target = this.#dropTarget(event);
    if (!target) return;
    event.preventDefault();
    const field = this.#drag.field;
    this.#clearDrag();
    this.#structure().moveColumn(field, target.field, target.after);
    this.#head.querySelector(`th[data-field="${field}"]`).focus({ preventScroll: true });
  };
  #clearDrag = () => {
    this.#drag = null;
    for (const cell of this.#head.querySelectorAll("th")) {
      cell.classList.remove("column-dragging");
      cell.removeAttribute("data-drop");
    }
  };
  #minimum() {
    return Number.parseFloat(this.#control.ownerDocument.defaultView.getComputedStyle(this.#control).getPropertyValue("--gramlot-grid-column-min-width")) || 40;
  }
  #start = (event) => {
    this.#suppressClick = false;
    const handle = event.target.closest(".column-resize");
    if (!handle || event.button !== 0 || this.#gesture) return;
    const header = handle.closest("[data-field]");
    const field = header.dataset.field;
    const node = this.#structure().columnNode(field);
    const tables = [...this.#control.querySelectorAll("table")];
    const headers = [...this.#head.querySelectorAll("th[scope=col]")];
    const widths = headers.map((cell) => cell.getBoundingClientRect().width);
    this.#gesture = {
      pointerId: event.pointerId,
      field,
      node,
      originalWidth: node.getAttr("width"),
      x: event.clientX,
      index: headers.indexOf(header),
      widths,
      width: header.getBoundingClientRect().width,
      tables: tables.map((table) => ({
        table,
        width: table.style.width,
        columns: [...table.querySelectorAll("col")].map((col) => ({ col, width: col.style.width }))
      }))
    };
    this.#head.setPointerCapture(event.pointerId);
    this.#control.classList.add("resizing");
    event.preventDefault();
  };
  #move = (event) => {
    const gesture = this.#gesture;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    gesture.width = Math.max(this.#minimum(), Math.round(gesture.widths[gesture.index] + event.clientX - gesture.x));
    const widths = gesture.widths.map((width, index) => index === gesture.index ? gesture.width : width);
    for (const { table, columns } of gesture.tables) {
      table.style.width = `${widths.reduce((sum2, width) => sum2 + width, 0)}px`;
      columns.forEach(({ col }, index) => {
        col.style.width = `${widths[index]}px`;
      });
    }
  };
  #finish = (event) => {
    const gesture = this.#gesture;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    this.#move(event);
    const structure = this.#structure();
    const current = structure.columnNode(gesture.field);
    this.#suppressClick = true;
    this.cancel();
    if (current !== gesture.node || current.getAttr("width") !== gesture.originalWidth) return;
    structure.setColumnWidth(gesture.field, gesture.width);
    this.#focus(gesture.field);
  };
  #key = (event) => {
    if (event.key === "Escape" && this.#gesture) {
      this.cancel();
      event.preventDefault();
      return;
    }
    const handle = event.target.closest(".column-resize");
    if (!handle && ["Enter", " "].includes(event.key)) {
      const header2 = event.target.closest("th[data-field]");
      if (header2) {
        event.preventDefault();
        this.#sort(header2.dataset.field, event.shiftKey);
      }
      return;
    }
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    if (!handle) {
      const header2 = event.target.closest("th[data-field]");
      if (!header2 || !event.altKey) return;
      const field = header2.dataset.field, structure = this.#structure();
      const node = structure.columnNode(field), siblings = node.parentBag.getNodes();
      const target = siblings[siblings.indexOf(node) + (event.key === "ArrowRight" ? 1 : -1)];
      if (target?.getAttr("tag") === "cell") {
        structure.moveColumn(field, target.getAttr("field"), event.key === "ArrowRight");
        this.#head.querySelector(`th[data-field="${field}"]`).focus({ preventScroll: true });
      }
      event.preventDefault();
      return;
    }
    const header = handle.closest("[data-field]");
    const delta = (event.key === "ArrowRight" ? 1 : -1) * (event.shiftKey ? 1 : 10);
    this.#structure().setColumnWidth(header.dataset.field, Math.max(this.#minimum(), Math.round(header.getBoundingClientRect().width + delta)));
    this.#focus(header.dataset.field);
    event.preventDefault();
  };
  #focus(field) {
    this.#head.querySelector(`th[data-field="${field}"] .column-resize`).focus({ preventScroll: true });
  }
  #cancel = () => {
    if (this.#gesture) this.cancel();
  };
  cancel() {
    this.#clearDrag();
    const gesture = this.#gesture;
    if (!gesture) return;
    this.#gesture = null;
    for (const { table, width, columns } of gesture.tables) {
      table.style.width = width;
      for (const { col, width: width2 } of columns) col.style.width = width2;
    }
    this.#control.classList.remove("resizing");
    if (this.#head.hasPointerCapture(gesture.pointerId)) this.#head.releasePointerCapture(gesture.pointerId);
  }
};

// src/components/grid-row-layout.js
var GridRowLayout = class {
  #store;
  #heights = /* @__PURE__ */ new Map();
  bindStore(store) {
    if (store !== this.#store) {
      this.#heights.clear();
      this.#store = store;
    }
  }
  retain(nodes) {
    const current = new Set(nodes);
    for (const node of this.#heights.keys()) if (!current.has(node)) this.#heights.delete(node);
  }
  height(node) {
    return this.#heights.get(node) ?? null;
  }
  setHeight(node, height) {
    if (node.parentBag !== this.#store) return;
    if (height === null) this.#heights.delete(node);
    else {
      if (!Number.isFinite(height) || height <= 0) throw new TypeError("Grid row height must be positive pixels");
      this.#heights.set(node, Math.round(height));
    }
  }
};

// src/components/grid-row-interaction.js
var GridRowInteraction = class {
  #body;
  #control;
  #layout;
  #nodeForRow;
  #gesture = null;
  #drag = null;
  #store;
  #dragEnabled;
  constructor(body, control, layout, nodeForRow, store, dragEnabled) {
    this.#body = body;
    this.#control = control;
    this.#layout = layout;
    this.#nodeForRow = nodeForRow;
    this.#store = store;
    this.#dragEnabled = dragEnabled;
  }
  connect() {
    this.#body.addEventListener("pointerdown", this.#start);
    this.#body.addEventListener("pointermove", this.#move);
    this.#body.addEventListener("pointerup", this.#finish);
    this.#body.addEventListener("pointercancel", this.#cancel);
    this.#body.addEventListener("lostpointercapture", this.#cancel);
    this.#body.addEventListener("keydown", this.#key);
    this.#body.addEventListener("dblclick", this.#reset);
    this.#body.addEventListener("dragstart", this.#dragStart);
    this.#body.addEventListener("dragover", this.#dragOver);
    this.#body.addEventListener("dragleave", this.#dragLeave);
    this.#body.addEventListener("drop", this.#drop);
    this.#body.addEventListener("dragend", this.#dragEnd);
  }
  disconnect() {
    this.cancel();
    this.cancelDrag();
    this.#body.removeEventListener("pointerdown", this.#start);
    this.#body.removeEventListener("pointermove", this.#move);
    this.#body.removeEventListener("pointerup", this.#finish);
    this.#body.removeEventListener("pointercancel", this.#cancel);
    this.#body.removeEventListener("lostpointercapture", this.#cancel);
    this.#body.removeEventListener("keydown", this.#key);
    this.#body.removeEventListener("dblclick", this.#reset);
    this.#body.removeEventListener("dragstart", this.#dragStart);
    this.#body.removeEventListener("dragover", this.#dragOver);
    this.#body.removeEventListener("dragleave", this.#dragLeave);
    this.#body.removeEventListener("drop", this.#drop);
    this.#body.removeEventListener("dragend", this.#dragEnd);
  }
  #dragStart = (event) => {
    const row = event.target.closest("tr");
    const node = this.#nodeForRow(row);
    if (!this.#dragEnabled() || !node || this.#gesture || event.target.closest(".row-height-handle")) {
      event.preventDefault();
      return;
    }
    this.#drag = { node, bag: this.#store().bag };
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", node.label);
    row.classList.add("row-dragging");
  };
  #dropTarget(event) {
    if (!this.#drag || !this.#dragEnabled()) return null;
    const { node, bag } = this.#drag;
    const row = event.target.closest("tr"), target = this.#nodeForRow(row);
    if (!target || target === node || this.#store().bag !== bag || node.parentBag !== bag || target.parentBag !== bag) return null;
    const box = row.getBoundingClientRect();
    return { row, target, after: event.clientY > box.top + box.height / 2 };
  }
  #clearMarker() {
    for (const row of this.#body.querySelectorAll("[data-row-drop]")) row.removeAttribute("data-row-drop");
  }
  #dragOver = (event) => {
    this.#clearMarker();
    const target = this.#dropTarget(event);
    if (!target) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    target.row.dataset.rowDrop = target.after ? "after" : "before";
  };
  #dragLeave = (event) => {
    if (!this.#body.contains(event.relatedTarget)) this.#clearMarker();
  };
  #drop = (event) => {
    const target = this.#dropTarget(event);
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    const { node } = this.#drag;
    this.cancelDrag();
    this.#store().moveRow(node, target.target, target.after);
  };
  #dragEnd = () => {
    this.cancelDrag();
  };
  cancelDrag() {
    this.#drag = null;
    this.#clearMarker();
    for (const row of this.#body.querySelectorAll(".row-dragging")) row.classList.remove("row-dragging");
  }
  #target(event) {
    const handle = event.target.closest(".row-height-handle");
    if (!handle) return null;
    const row = handle.closest("tr");
    const node = this.#nodeForRow(row);
    return node ? { handle, row, node } : null;
  }
  project(row, node) {
    const height = this.#layout().height(node);
    row.style.height = height === null ? "" : `${height}px`;
  }
  #value(row) {
    const handle = row.querySelector(".row-height-handle");
    if (handle) handle.setAttribute("aria-valuenow", String(Math.round(row.getBoundingClientRect().height)));
  }
  #start = (event) => {
    const target = this.#target(event);
    if (!target || event.button !== 0 || this.#gesture) return;
    const { row } = target;
    const height = row.getBoundingClientRect().height;
    const original = row.style.height;
    row.style.height = "";
    const minimum = row.getBoundingClientRect().height;
    row.style.height = original;
    this.#gesture = { ...target, pointerId: event.pointerId, y: event.clientY, height, minimum, preview: height };
    target.handle.focus({ preventScroll: true });
    target.handle.setPointerCapture(event.pointerId);
    this.#control.classList.add("resizing-row");
    event.preventDefault();
  };
  #move = (event) => {
    const gesture = this.#gesture;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    gesture.preview = Math.max(gesture.minimum, Math.round(gesture.height + event.clientY - gesture.y));
    gesture.row.style.height = `${gesture.preview}px`;
    this.#value(gesture.row);
  };
  #finish = (event) => {
    const gesture = this.#gesture;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    this.#move(event);
    this.cancel();
    if (this.#nodeForRow(gesture.row) !== gesture.node || gesture.preview === gesture.height) return;
    this.#layout().setHeight(gesture.node, gesture.preview);
    this.project(gesture.row, gesture.node);
    this.#value(gesture.row);
  };
  #key = (event) => {
    if (event.key === "Escape" && (this.#gesture || this.#drag)) {
      this.cancel();
      this.cancelDrag();
      event.preventDefault();
      return;
    }
    const target = this.#target(event);
    if (!target || !["ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
    this.cancel();
    let height = null;
    if (event.key !== "Home") {
      const current = target.row.getBoundingClientRect().height;
      target.row.style.height = "";
      const minimum = target.row.getBoundingClientRect().height;
      height = Math.max(minimum, current + (event.key === "ArrowDown" ? 10 : -10));
    }
    this.#layout().setHeight(target.node, height);
    this.project(target.row, target.node);
    this.#value(target.row);
    event.preventDefault();
  };
  #reset = (event) => {
    const target = this.#target(event);
    if (!target) return;
    this.cancel();
    this.#layout().setHeight(target.node, null);
    this.project(target.row, target.node);
    this.#value(target.row);
    event.preventDefault();
  };
  #cancel = () => {
    this.cancel();
  };
  cancel() {
    const gesture = this.#gesture;
    if (!gesture) return;
    this.#gesture = null;
    this.project(gesture.row, gesture.node);
    this.#control.classList.remove("resizing-row");
    if (gesture.handle.hasPointerCapture(gesture.pointerId)) gesture.handle.releasePointerCapture(gesture.pointerId);
  }
};

// src/components/grid-styles.js
var gridStyles = `
    :host {
        min-block-size: 0;
        color: var(--gramlot-grid-color, var(--gramlot-ink, CanvasText));
        font-family: var(--gramlot-font-ui, inherit);
        font-size: var(--gramlot-grid-font-size, inherit);
        line-height: var(--gramlot-grid-line-height, 1.35);
    }
    .control-box {
        display: flex;
        flex-direction: column;
        block-size: 100%;
        min-block-size: 0;
        overflow: hidden;
        border: 1px solid var(--gramlot-grid-border-color, var(--gramlot-border, ButtonBorder));
        border-radius: var(--gramlot-grid-radius, var(--gramlot-radius-sm, 0));
        background: var(--gramlot-grid-background, var(--gramlot-surface, Canvas));
    }
    .header-frame {
        flex: none;
        min-inline-size: 0;
        padding-inline-end: var(--grid-scrollbar-width, 0px);
        background: var(--gramlot-grid-header-background, var(--gramlot-surface-subtle, ButtonFace));
        border-block-end: 1px solid var(--gramlot-grid-border-color, var(--gramlot-border, ButtonBorder));
    }
    .header-viewport { overflow: hidden; min-inline-size: 0; }
    .body-viewport {
        flex: 1 1 auto;
        min-block-size: 0;
        min-inline-size: 0;
        overflow: auto;
        background: var(--gramlot-surface-subtle, Canvas);
        scrollbar-gutter: stable;
        overscroll-behavior: contain;
    }
    .body-viewport:focus-visible {
        outline: 2px solid var(--gramlot-focus-ring, Highlight);
        outline-offset: -2px;
    }
    table {
        border-spacing: 0;
        table-layout: fixed;
        inline-size: var(--grid-columns-width);
        font: inherit;
        color: inherit;
    }
    th, td {
        padding: var(--gramlot-grid-cell-padding, .3rem .6rem);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
        border-inline-end: 1px solid var(--gramlot-grid-column-border-color, var(--gramlot-border, ButtonBorder));
    }
    th {
        position: relative;
        block-size: var(--gramlot-grid-header-height, 2rem);
        color: var(--gramlot-grid-header-color, var(--gramlot-ink, ButtonText));
        background: var(--gramlot-grid-header-background, var(--gramlot-surface-subtle, ButtonFace));
        font-weight: var(--gramlot-grid-header-weight, 600);
        text-align: start;
    }
    th[scope=col], th.row-heading {
        background-image: linear-gradient(to bottom, var(--gramlot-grid-header-highlight), transparent 65%);
        border-inline-end-color: var(--gramlot-grid-header-border-color, ButtonBorder);
        box-shadow: inset 0 1px var(--gramlot-grid-header-highlight), inset 0 -1px var(--gramlot-grid-header-border-color, ButtonBorder);
    }
    .group-spacer, th[scope=colgroup] {
        box-sizing: border-box;
        block-size: var(--gramlot-grid-group-height, 1.5rem);
        padding-block: 0;
    }
    .group-spacer { background: var(--gramlot-grid-header-background); border: 0; }
    th[scope=colgroup] {
        border-start-start-radius: var(--gramlot-radius-lg, 10px);
        border-start-end-radius: var(--gramlot-radius-lg, 10px);
        border-inline-start: 2px solid var(--gramlot-grid-header-background);
        background-clip: padding-box;
        background: var(--gramlot-grid-group-background, var(--gramlot-surface-subtle, ButtonFace));
        color: var(--gramlot-grid-group-color, var(--gramlot-ink, ButtonText));
        border-block-end: 1px solid var(--gramlot-grid-border-color, var(--gramlot-border, ButtonBorder));
    }
    td {
        vertical-align: top;
        block-size: var(--gramlot-grid-row-height, 2rem);
        border-block-end: 1px solid var(--gramlot-grid-row-border-color, var(--gramlot-border, ButtonBorder));
    }
    tbody tr { background: var(--gramlot-grid-background, var(--gramlot-surface, Canvas)); }
    tbody tr:nth-child(even) { background: var(--gramlot-grid-row-alt-background, var(--gramlot-surface-subtle, Canvas)); }
    tbody tr:hover { background: var(--gramlot-grid-row-hover-background, var(--gramlot-selected, Highlight)); }
    th[data-field] { padding-inline-end: 14px; cursor: grab; user-select: none; }
    th[data-field]:hover { background-color: color-mix(in srgb, var(--gramlot-grid-header-background) 92%, var(--gramlot-grid-header-color)); }
    th:focus-visible, .column-resize:focus-visible { outline: 2px solid var(--gramlot-focus-ring, Highlight); outline-offset: -2px; }
    .column-caption { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    th[data-sort-direction] .column-caption { padding-inline-end: 24px; }
    .sort-indicator { display: none; position: absolute; inset-inline-end: 14px; top: calc(50% - 7px); inline-size: 14px; block-size: 14px; fill: none; stroke: currentColor; stroke-width: 1.7; }
    th[data-sort-direction] .sort-indicator { display: inline-block; }
    th[data-sort-direction=descending] .sort-indicator { transform: rotate(180deg); }
    th[data-sort-priority]::after { content: attr(data-sort-priority); position: absolute; inset-inline-end: 7px; top: calc(50% - .8em); font-size: .7em; opacity: .8; }
    .column-resize { position: absolute; inset: 0 -4px 0 auto; inline-size: 9px; z-index: 1; cursor: col-resize; touch-action: none; }
    .column-resize::after { content: ''; position: absolute; inset: 20% 4px; background: transparent; }
    th:hover .column-resize::after, .column-resize:focus-visible::after { background: var(--gramlot-focus-ring, Highlight); }
    .resizing, .resizing * { cursor: col-resize; user-select: none; }
    th.column-dragging { opacity: .45; }
    th[data-drop=before] { box-shadow: inset 3px 0 var(--gramlot-focus-ring, Highlight); }
    th[data-drop=after] { box-shadow: inset -3px 0 var(--gramlot-focus-ring, Highlight); }
    th.row-heading {
        position: sticky;
        inset-inline-start: 0;
        z-index: 2;
        text-align: end;
        font-weight: 400;
        vertical-align: top;
        user-select: none;
        block-size: var(--gramlot-grid-row-height, 2rem);
    }
    thead th.row-heading { vertical-align: middle; font-weight: var(--gramlot-grid-header-weight, 600); }
    .row-height-handle {
        position: absolute;
        inset: auto 0 0;
        block-size: 7px;
        cursor: row-resize;
        touch-action: none;
    }
    .row-height-handle:hover, .row-height-handle:focus-visible {
        background: color-mix(in srgb, var(--gramlot-focus-ring, Highlight) 35%, transparent);
    }
    .row-height-handle:focus-visible { outline: 2px solid var(--gramlot-focus-ring, Highlight); outline-offset: -2px; }
    .resizing-row, .resizing-row * { cursor: row-resize; user-select: none; }
    tbody tr[draggable=true] { cursor: grab; }
    tbody tr.row-dragging { opacity: .45; }
    tbody tr[data-row-drop=before] > * { box-shadow: inset 0 2px var(--gramlot-focus-ring, Highlight); }
    tbody tr[data-row-drop=after] > * { box-shadow: inset 0 -2px var(--gramlot-focus-ring, Highlight); }
    .numeric { font-variant-numeric: tabular-nums; }
    .empty { text-align: center; color: var(--gramlot-text-secondary, GrayText); }
`;

// src/components/grid-search.js
var GridSearch = class {
  #listeners = /* @__PURE__ */ new Set();
  view = null;
  #bag;
  columns = [];
  update(view, columns) {
    if (this.view === view && this.#bag === view.bag && this.columns === columns) return;
    this.view = view;
    this.#bag = view.bag;
    this.columns = columns;
    for (const listener of this.#listeners) listener();
  }
  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }
};
function gridSearch(node) {
  if (!Object.hasOwn(node, "gridSearch")) {
    Object.defineProperty(node, "gridSearch", { value: new GridSearch(), configurable: true });
  }
  return node.gridSearch;
}
function searchColumns(searchOn, columns) {
  if (searchOn === true || typeof searchOn === "string" && searchOn.startsWith("*")) {
    const allowed = searchOn === true ? columns : columns.filter((column) => searchOn.slice(1).includes(column.dtype ?? "T"));
    return allowed.length ? [
      { field: allowed.map((column) => column.field).join("+"), name: "All columns" },
      ...allowed.map((column) => ({ field: column.field, name: column.name }))
    ] : [];
  }
  if (typeof searchOn !== "string" || !searchOn.trim()) throw new TypeError("searchOn requires true or a column list");
  return searchOn.split(",").map((item) => {
    const parts = item.trim().split(":");
    const field = parts.at(-1), name = parts.length === 2 ? parts[0] : columns.find((column) => column.field === field)?.name;
    if (parts.length > 2 || !field || field.split("+").some((key) => !columns.some((column) => column.field === key))) {
      throw new TypeError(`Unknown searchOn column: ${item}`);
    }
    return { field, name: name ?? field };
  });
}

// src/components/popup.js
var VIEWPORT_MARGIN = 8;
var ANCHOR_GAP = 3;
function positionPopup(popup, anchor, { align = "start", matchWidth = false, inset = 0, placement = "bottom", point = null } = {}) {
  const view = anchor.ownerDocument.defaultView;
  const field = point ? { left: point.x, right: point.x, top: point.y, bottom: point.y, width: 0 } : anchor.getBoundingClientRect();
  const availableWidth = Math.max(0, view.innerWidth - 2 * VIEWPORT_MARGIN);
  popup.style.setProperty("--gramlot-popup-available-width", `${availableWidth}px`);
  if (matchWidth) popup.style.width = `${Math.min(Math.max(0, field.width - 2 * inset), availableWidth)}px`;
  popup.style.removeProperty("--gramlot-popup-available-height");
  const natural = popup.getBoundingClientRect();
  if (placement === "side") {
    const right = Math.max(0, view.innerWidth - VIEWPORT_MARGIN - field.right - ANCHOR_GAP);
    const left2 = Math.max(0, field.left - VIEWPORT_MARGIN - ANCHOR_GAP);
    const opensLeft = natural.width > right && left2 > right;
    popup.style.setProperty("--gramlot-popup-available-width", `${opensLeft ? left2 : right}px`);
    popup.style.setProperty("--gramlot-popup-available-height", `${Math.max(0, view.innerHeight - 2 * VIEWPORT_MARGIN)}px`);
    const size2 = popup.getBoundingClientRect();
    const x = opensLeft ? field.left - size2.width - ANCHOR_GAP : field.right + ANCHOR_GAP;
    popup.style.left = `${Math.max(VIEWPORT_MARGIN, Math.min(x, view.innerWidth - size2.width - VIEWPORT_MARGIN))}px`;
    popup.style.top = `${Math.max(VIEWPORT_MARGIN, Math.min(field.top, view.innerHeight - size2.height - VIEWPORT_MARGIN))}px`;
    return;
  }
  const below = Math.max(0, view.innerHeight - VIEWPORT_MARGIN - field.bottom - ANCHOR_GAP);
  const above = Math.max(0, field.top - VIEWPORT_MARGIN - ANCHOR_GAP);
  const upwards = natural.height > below && above > below;
  popup.style.setProperty("--gramlot-popup-available-height", `${upwards ? above : below}px`);
  const size = popup.getBoundingClientRect();
  const left = align === "end" ? field.right - size.width - inset : field.left + inset;
  const top = upwards ? field.top - size.height - ANCHOR_GAP : field.bottom + ANCHOR_GAP;
  popup.style.left = `${Math.max(VIEWPORT_MARGIN, Math.min(left, view.innerWidth - size.width - VIEWPORT_MARGIN))}px`;
  popup.style.top = `${Math.max(VIEWPORT_MARGIN, Math.min(top, view.innerHeight - size.height - VIEWPORT_MARGIN))}px`;
}

// src/components/grid-search-styles.js
var gridSearchStyles = `
:host{display:inline-block;inline-size:clamp(14rem,40vw,22rem);max-inline-size:100%;min-inline-size:0}
.control-box{display:flex;align-items:stretch;position:relative;min-block-size:var(--gramlot-field-height,2.75rem);
    border:1px solid var(--gramlot-border,GrayText);border-radius:999px;
    background:var(--gramlot-field-background,Canvas);color:var(--gramlot-ink,CanvasText);
    transition:border-color .15s}
.control-box:hover{border-color:var(--gramlot-border-control,GrayText)}
.control-box:focus-within{border-color:var(--gramlot-border-control,GrayText)}
select,input,button{font:inherit;color:inherit;min-inline-size:0;border:0;background:transparent}
.column-choice{display:flex;align-items:center;background:var(--gramlot-surface-subtle,ButtonFace);border-radius:999px 0 0 999px;position:relative;flex:0 1 auto;max-inline-size:42%;border-inline-end:1px solid var(--gramlot-border,GrayText)}
select{display:block;appearance:none;inline-size:100%;padding:.35rem 1.8rem .35rem .85rem;
    border-radius:999px;font-size:.9em;color:var(--gramlot-text-secondary,GrayText);cursor:pointer;text-overflow:ellipsis}
select option{background:var(--gramlot-field-background,Canvas);color:var(--gramlot-ink,CanvasText)}
.column-choice>svg{position:absolute;inset-inline-end:.55rem;inset-block-start:50%;transform:translateY(-50%);pointer-events:none;color:var(--gramlot-text-secondary,GrayText);width:.8rem;height:.8rem}
.search-entry{position:relative;display:flex;align-items:center;flex:1;min-inline-size:0}
.search-lens{position:absolute;inset-inline-start:.65rem;pointer-events:none;color:var(--gramlot-text-secondary,GrayText);opacity:.6}
input{inline-size:100%;min-block-size:var(--gramlot-field-height,2.75rem);padding:.4rem 3.6rem .4rem 2.1rem;border-radius:999px;outline:none}
input::placeholder{color:var(--gramlot-text-secondary,GrayText);opacity:.75}
input:disabled{opacity:.5}
.clear,.info{position:absolute;display:grid;place-items:center;padding:.3rem;
    inline-size:1.6rem;block-size:1.6rem;border-radius:50%;color:var(--gramlot-text-secondary,GrayText);cursor:pointer}
.clear{inset-inline-end:1.95rem}
.info{inset-inline-end:.35rem;opacity:.7}
.clear:hover,.info:hover{color:var(--gramlot-ink,CanvasText);background:var(--gramlot-surface-subtle,ButtonFace)}
input:placeholder-shown~.clear{display:none}
select:focus-visible,button:focus-visible{outline:1px solid var(--gramlot-text-secondary,GrayText);outline-offset:-3px}
svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none}
.control-box:has([aria-invalid=true]){border-color:var(--gramlot-error,Mark)}
.error{position:absolute;inset-block-start:calc(100% + .35rem);inset-inline:0;z-index:1;
    border:1px solid var(--gramlot-border,GrayText);border-radius:var(--gramlot-radius,.5rem);
    background:var(--gramlot-field-background,Canvas);color:var(--gramlot-error,Mark);
    font-size:.85em;padding:.5rem .75rem;box-shadow:var(--gramlot-shadow,0 2px 5px #0002)}
.error:empty{display:none}
.search-help{position:fixed;inset:auto;margin:0;inline-size:19rem;max-inline-size:calc(100vw - 1rem);
    max-block-size:var(--gramlot-popup-available-height,80vh);overflow:auto;padding:1rem;
    border:1px solid var(--gramlot-border,GrayText);border-radius:var(--gramlot-radius-lg,.75rem);
    background:var(--gramlot-surface,Canvas);color:var(--gramlot-ink,CanvasText);
    box-shadow:var(--gramlot-shadow,0 3px 12px #0002);font:inherit;font-size:.9em;line-height:1.5}
.search-help p{margin:.6rem 0 0}.search-help p:last-child{color:var(--gramlot-text-secondary,GrayText)}
@media(prefers-reduced-motion:reduce){.control-box{transition:none}}
`;

// src/components/grid-search-box.js
var SearchBox = (0, components_exports.defineComponent)({
  name: "searchBox",
  tag: "gramlot-search-box",
  base: Container,
  sourceContext: true,
  parameters: { searchOn: { dtype: ["B", "T"], default: true, binding: "read" } },
  implementation: (Base) => class extends Base {
    #context;
    #grid;
    #release;
    #releaseView;
    #view;
    #timer = null;
    #field;
    #input;
    #error;
    #helpText;
    #filterSignature;
    #bag;
    constructor() {
      super();
      const doc = this.ownerDocument;
      const style = doc.createElement("style");
      style.textContent = gridSearchStyles;
      const icon = (path) => {
        const svg = doc.createElementNS(SVG_NS, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("aria-hidden", "true");
        const shape = doc.createElementNS(SVG_NS, "path");
        shape.setAttribute("d", path);
        svg.append(shape);
        return svg;
      };
      this.#field = doc.createElement("select");
      this.#field.setAttribute("aria-label", "Search column");
      this.#input = doc.createElement("input");
      this.#input.type = "text";
      this.#input.setAttribute("role", "searchbox");
      this.#input.setAttribute("aria-label", "Filter rows");
      this.#input.setAttribute("aria-describedby", "search-error");
      this.#input.placeholder = " ";
      const clear = doc.createElement("button");
      clear.type = "button";
      clear.title = "Clear filter";
      clear.setAttribute("aria-label", "Clear filter");
      clear.append(icon("M6 6L18 18M18 6L6 18"));
      this.#error = doc.createElement("span");
      this.#error.id = "search-error";
      this.#error.className = "error";
      this.#error.setAttribute("role", "alert");
      const choice = doc.createElement("span");
      choice.className = "column-choice";
      choice.append(this.#field, icon("M7 10L12 15L17 10"));
      const entry = doc.createElement("span");
      entry.className = "search-entry";
      const lens = icon("M21 21L16 16M18 10A8 8 0 1 1 2 10A8 8 0 0 1 18 10");
      lens.classList.add("search-lens");
      clear.className = "clear";
      const info = doc.createElement("button");
      info.type = "button";
      info.className = "info";
      info.setAttribute("aria-label", "Search instructions");
      info.title = "Search instructions";
      info.setAttribute("aria-haspopup", "dialog");
      info.setAttribute("aria-expanded", "false");
      info.setAttribute("aria-controls", "search-help");
      info.append(icon("M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12M12 11V17M12 7V7.1"));
      const help = doc.createElement("div");
      help.id = "search-help";
      help.className = "search-help";
      help.setAttribute("popover", "auto");
      help.setAttribute("role", "dialog");
      help.setAttribute("aria-label", "Search instructions");
      const heading = doc.createElement("strong");
      heading.textContent = "Search instructions";
      this.#helpText = doc.createElement("p");
      const common = doc.createElement("p");
      common.textContent = "Clear with \xD7 or Escape. Changing column clears the query. An incomplete expression keeps the last valid result.";
      help.append(heading, this.#helpText, common);
      this.shadowRoot.append(help);
      info.addEventListener("click", () => {
        if (help.matches(":popover-open")) help.hidePopover();
        else {
          help.showPopover();
          positionPopup(help, info, { align: "end" });
        }
      });
      help.addEventListener("toggle", () => info.setAttribute("aria-expanded", String(help.matches(":popover-open"))));
      entry.append(lens, this.#input, clear, info);
      this.control.replaceChildren(choice, entry, this.#error);
      this.shadowRoot.append(style);
      this.#input.addEventListener("input", () => {
        this.#cancel();
        this.#timer = doc.defaultView.setTimeout(() => {
          this.#timer = null;
          this.#apply();
        }, 100);
      });
      this.#input.addEventListener("keydown", (event) => {
        if (event.isComposing) return;
        if (event.key === "Enter") {
          event.preventDefault();
          this.#cancel();
          this.#apply();
        }
        if (event.key === "Escape") {
          event.preventDefault();
          this.#clear();
        }
      });
      this.#field.addEventListener("change", () => this.#clear());
      clear.addEventListener("click", () => {
        this.#clear();
        this.#input.focus();
      });
    }
    setSourceContext(context) {
      this.#context = context;
      const target = context.frameRecipient();
      if (target?.nodeTag !== "grid") throw new TypeError("searchBox requires a FrameGrid target");
      this.#grid = gridSearch(target);
    }
    projectAttributes(attrs, adapt) {
      const rest = super.projectAttributes(attrs, adapt);
      if (this.isConnected) this.#configure();
      return rest;
    }
    connectedCallback() {
      this.#release = this.#grid.subscribe(() => this.#configure());
      this.#configure();
    }
    disconnectedCallback() {
      this.#cancel();
      this.#release?.();
      this.#releaseView?.();
      this.#release = this.#releaseView = null;
    }
    #cancel() {
      if (this.#timer !== null) this.ownerDocument.defaultView.clearTimeout(this.#timer);
      this.#timer = null;
    }
    #configure() {
      try {
        this.#update();
      } catch (error) {
        this.#input.disabled = true;
        this.#error.textContent = error.message;
      }
    }
    #update() {
      if (!this.#grid.view) return;
      if (this.#view !== this.#grid.view || this.#bag !== this.#grid.view.bag || !this.#releaseView) {
        this.#cancel();
        this.#releaseView?.();
        this.#view = this.#grid.view;
        this.#bag = this.#view.bag;
        this.#filterSignature = void 0;
        this.#releaseView = this.#view.subscribe(() => this.#sync());
      }
      const previous = this.#field.value;
      const options = searchColumns(this.parameters.searchOn, this.#grid.columns);
      this.#field.replaceChildren(...options.map(({ field, name }) => {
        const option = this.ownerDocument.createElement("option");
        option.value = field;
        option.textContent = name;
        return option;
      }));
      if (options.some((option) => option.field === previous)) this.#field.value = previous;
      this.#input.disabled = !options.length;
      this.#sync();
      this.#hint();
    }
    #sync() {
      const filter = this.#view.filter;
      const signature = JSON.stringify(filter);
      if (this.#filterSignature === signature) return;
      this.#filterSignature = signature;
      this.#cancel();
      this.#input.value = filter?.value ?? "";
      if (filter) this.#field.value = filter.columns.join("+");
      this.#error.textContent = "";
      this.#input.removeAttribute("aria-invalid");
      this.#hint();
    }
    #dtype() {
      const column = this.#grid.columns.find((column2) => column2.field === this.#field.value);
      return ["L", "R", "N", "D"].includes(column?.dtype) ? column.dtype : "T";
    }
    #hint() {
      const dtype = this.#dtype();
      this.#helpText.textContent = dtype === "T" ? "Type a word to find it anywhere. Text is case-insensitive. You can also use expressions: lamp|desk matches either word; ^lamp matches the start." : dtype === "D" ? "Compare dates: = 2026-10-15, >= 2026-10-15 or < 2026-10-15. ISO dates and your browser\u2019s local date notation are accepted." : "Compare numbers: = 12, > 100, <= 50 or ! 0 (not equal). Decimal punctuation follows your browser locale.";
    }
    #clear() {
      this.#cancel();
      this.#input.value = "";
      this.#apply();
      this.#hint();
    }
    #apply() {
      if (!this.#view) return;
      try {
        const value = this.#input.value;
        this.#view.applyFilter(value.trim() ? {
          value,
          columns: this.#field.value.split("+"),
          dtype: this.#dtype(),
          locale: this.#context.locale,
          timeZone: this.#context.timeZone
        } : null);
        this.#error.textContent = "";
        this.#input.removeAttribute("aria-invalid");
      } catch (error) {
        this.#error.textContent = error.message;
        this.#input.setAttribute("aria-invalid", "true");
      }
    }
  }
});

// src/components/grid-grammar.json
var grid_grammar_default = {
  elements: {
    struct: {
      doc: null,
      sub_tags: "column,colgroup",
      parent_tags: "grid",
      inherits_from: null,
      ns: null,
      node_label: null,
      collection_key: null,
      attributes: {
        parameters: [],
        accepts_var_keyword: false,
        accepts_var_positional: false
      },
      _meta: {
        data_element: true,
        gridStruct: true
      }
    },
    column: {
      doc: null,
      sub_tags: "",
      parent_tags: "struct,colgroup",
      inherits_from: null,
      ns: null,
      node_label: null,
      collection_key: null,
      attributes: {
        parameters: [
          {
            name: "field",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "annotated",
              base: {
                kind: "dtype",
                dtype: "T"
              },
              metadata: [
                {
                  kind: "regex",
                  pattern: "^[A-Za-z_][A-Za-z0-9_]*$",
                  flags: 0
                }
              ]
            },
            has_default: false
          },
          {
            name: "name",
            kind: "keyword_only",
            role: "attribute",
            annotation: {
              kind: "dtype",
              dtype: "T"
            },
            has_default: true,
            default: null
          },
          {
            name: "dtype",
            kind: "keyword_only",
            role: "attribute",
            annotation: {
              kind: "annotated",
              base: {
                kind: "dtype",
                dtype: "T"
              },
              metadata: [
                {
                  kind: "regex",
                  pattern: "^(T|B|L|R|N|D|H|DHZ)$",
                  flags: 0
                }
              ]
            },
            has_default: true,
            default: null
          },
          {
            name: "width",
            kind: "keyword_only",
            role: "attribute",
            annotation: {
              kind: "annotated",
              base: {
                kind: "dtype",
                dtype: "T"
              },
              metadata: [
                {
                  kind: "regex",
                  pattern: "^[0-9]+([.][0-9]+)?(px|em|rem|ch|%)$",
                  flags: 0
                }
              ]
            },
            has_default: true,
            default: null
          },
          {
            name: "align",
            kind: "keyword_only",
            role: "attribute",
            annotation: {
              kind: "annotated",
              base: {
                kind: "dtype",
                dtype: "T"
              },
              metadata: [
                {
                  kind: "regex",
                  pattern: "^(start|center|end)$",
                  flags: 0
                }
              ]
            },
            has_default: true,
            default: null
          },
          {
            name: "format",
            kind: "keyword_only",
            role: "attribute",
            annotation: {
              kind: "dtype",
              dtype: "T"
            },
            has_default: true,
            default: null
          },
          {
            name: "white_space",
            kind: "keyword_only",
            role: "attribute",
            annotation: {
              kind: "annotated",
              base: {
                kind: "dtype",
                dtype: "T"
              },
              metadata: [
                {
                  kind: "regex",
                  pattern: "^(normal|nowrap|pre-wrap)$",
                  flags: 0
                }
              ]
            },
            has_default: true,
            default: null
          }
        ],
        accepts_var_keyword: false,
        accepts_var_positional: false
      },
      _meta: {
        data_element: true
      }
    },
    colgroup: {
      doc: null,
      sub_tags: "column",
      parent_tags: "struct",
      inherits_from: null,
      ns: null,
      node_label: null,
      collection_key: null,
      attributes: {
        parameters: [
          {
            name: "code",
            kind: "positional_or_keyword",
            role: "attribute",
            annotation: {
              kind: "annotated",
              base: {
                kind: "dtype",
                dtype: "T"
              },
              metadata: [
                {
                  kind: "regex",
                  pattern: "^[A-Za-z_][A-Za-z0-9_]*$",
                  flags: 0
                }
              ]
            },
            has_default: false
          },
          {
            name: "name",
            kind: "keyword_only",
            role: "attribute",
            annotation: {
              kind: "dtype",
              dtype: "T"
            },
            has_default: true,
            default: null
          },
          {
            name: "background",
            kind: "keyword_only",
            role: "attribute",
            annotation: {
              kind: "dtype",
              dtype: "T"
            },
            has_default: true,
            default: null
          },
          {
            name: "color",
            kind: "keyword_only",
            role: "attribute",
            annotation: {
              kind: "dtype",
              dtype: "T"
            },
            has_default: true,
            default: null
          }
        ],
        accepts_var_keyword: false,
        accepts_var_positional: false
      },
      _meta: {
        data_element: true
      }
    }
  }
};

// src/components/grid.js
var Grid = (0, components_exports.defineComponent)({
  name: "grid",
  tag: "gramlot-grid",
  base: Container,
  bagStore: true,
  bagStruct: true,
  sourceContext: true,
  subTags: "struct",
  parameters: {
    storepath: { dtype: "T" },
    structpath: { dtype: "T" },
    rowMode: { dtype: "T" },
    rowHeaders: { dtype: "B", default: false, binding: "read" },
    rowResize: { dtype: "B", default: false, binding: "read" },
    selfDragRows: { dtype: "B", default: false, binding: "read" },
    sortedBy: { dtype: "T", default: "", binding: "read" },
    filter: { annotation: { kind: "type", module: "builtins", name: "dict" }, nullable: true, default: null, binding: "read" }
  },
  implementation: (Base) => class extends Base {
    #store;
    #context;
    #structure;
    #structBag;
    #structureDirty = true;
    #signature;
    #rows = /* @__PURE__ */ new Map();
    #head;
    #body;
    #headerTable;
    #bodyTable;
    #headerViewport;
    #bodyViewport;
    #resizeObserver;
    #layoutFrame = null;
    #headerRows = 1;
    #rowHeaders = false;
    #interaction;
    #rowInteraction;
    #rowLayout;
    #collectionView;
    #requestedSort;
    #requestedFilter;
    #unsubscribeStore;
    #refreshTimer = null;
    #pendingFull = false;
    #pendingRows = /* @__PURE__ */ new Set();
    #syncScroll = () => {
      this.#headerViewport.scrollLeft = this.#bodyViewport.scrollLeft;
    };
    constructor() {
      super();
      const doc = this.ownerDocument;
      const style = doc.createElement("style");
      style.textContent = gridStyles;
      this.control.setAttribute("role", "table");
      this.control.setAttribute("aria-label", "Grid");
      this.control.setAttribute("part", "table");
      const headerFrame = doc.createElement("div");
      headerFrame.className = "header-frame";
      headerFrame.setAttribute("part", "header");
      this.#headerViewport = doc.createElement("div");
      this.#headerViewport.className = "header-viewport";
      this.#headerViewport.setAttribute("part", "header-viewport");
      this.#bodyViewport = doc.createElement("div");
      this.#bodyViewport.className = "body-viewport";
      this.#bodyViewport.setAttribute("part", "body-viewport");
      this.#bodyViewport.tabIndex = 0;
      this.#bodyViewport.setAttribute("role", "rowgroup");
      this.#headerTable = doc.createElement("table");
      this.#bodyTable = doc.createElement("table");
      for (const table of [this.#headerTable, this.#bodyTable]) table.setAttribute("role", "presentation");
      this.#head = doc.createElement("thead");
      this.#head.setAttribute("role", "rowgroup");
      this.#body = doc.createElement("tbody");
      this.#body.setAttribute("role", "presentation");
      this.#headerTable.append(this.#head);
      this.#bodyTable.append(this.#body);
      this.#headerViewport.append(this.#headerTable);
      headerFrame.append(this.#headerViewport);
      this.#bodyViewport.append(this.#bodyTable);
      this.control.replaceChildren(headerFrame, this.#bodyViewport);
      this.shadowRoot.append(style);
      this.#interaction = new GridHeaderInteraction(this.#head, this.control, () => this.#structure, (field, multiple) => this.#sort(field, multiple));
      this.#rowInteraction = new GridRowInteraction(this.#body, this.control, () => this.#rowLayout, (row) => {
        for (const [node, element] of this.#rows) if (element === row) return node;
        return null;
      }, () => this.#collectionView, () => this.parameters.selfDragRows);
      this.#resizeObserver = new doc.defaultView.ResizeObserver(() => this.#scheduleLayout());
    }
    connectedCallback() {
      this.#observeStore();
      if (this.#collectionView) this.#invalidate({ full: true, rows: [] });
      this.#interaction.connect();
      this.#rowInteraction.connect();
      this.#bodyViewport.addEventListener("scroll", this.#syncScroll, { passive: true });
      this.#resizeObserver.observe(this.#bodyViewport);
      this.#resizeObserver.observe(this.#bodyTable);
      this.#scheduleLayout();
    }
    disconnectedCallback() {
      this.#cancelRefresh();
      this.#collectionView?.disconnect();
      this.#unsubscribeStore?.();
      this.#unsubscribeStore = null;
      this.#interaction.disconnect();
      this.#rowInteraction.disconnect();
      this.#bodyViewport.removeEventListener("scroll", this.#syncScroll);
      this.#resizeObserver.disconnect();
      if (this.#layoutFrame !== null) this.ownerDocument.defaultView.cancelAnimationFrame(this.#layoutFrame);
      this.#layoutFrame = null;
    }
    #scheduleLayout() {
      if (!this.isConnected || this.#layoutFrame !== null) return;
      this.#layoutFrame = this.ownerDocument.defaultView.requestAnimationFrame(() => {
        this.#layoutFrame = null;
        const gutter = this.#bodyViewport.offsetWidth - this.#bodyViewport.clientWidth;
        const width = `${gutter}px`;
        if (this.control.style.getPropertyValue("--grid-scrollbar-width") !== width) {
          this.control.style.setProperty("--grid-scrollbar-width", width);
        }
        for (const header of this.#head.querySelectorAll("th[data-field]")) {
          header.querySelector(".column-resize").setAttribute("aria-valuenow", String(Math.round(header.getBoundingClientRect().width)));
        }
        for (const row of this.#rows.values()) {
          const handle = row.querySelector(".row-height-handle");
          if (handle) handle.setAttribute("aria-valuenow", String(Math.round(row.getBoundingClientRect().height)));
        }
        this.#syncScroll();
      });
    }
    setSourceContext(context) {
      this.#context = context;
      const node = context.sourceNode;
      if (!Object.hasOwn(node, "gridRowLayout")) {
        Object.defineProperty(node, "gridRowLayout", { value: new GridRowLayout(), configurable: true });
      }
      this.#rowLayout = node.gridRowLayout;
    }
    setStoreBag(bag) {
      if (!(bag instanceof Bag3)) throw new TypeError("grid storepath must resolve to a Bag");
      this.#store = bag;
      this.#rowLayout.bindStore(bag);
    }
    setStructBag(bag) {
      this.#structBag = bag;
      this.#structureDirty = true;
    }
    projectAttributes(attrs, adapt) {
      const rest = super.projectAttributes(attrs, adapt);
      const store = this.#context.collectionView(this.#store, this.parameters.rowMode);
      if (this.#collectionView !== store) {
        this.#cancelRefresh();
        this.#unsubscribeStore?.();
        this.#unsubscribeStore = null;
        this.#collectionView = store;
        this.#observeStore();
      }
      if (this.#requestedSort !== this.parameters.sortedBy) {
        this.#collectionView.sort(this.parameters.sortedBy);
        this.#requestedSort = this.parameters.sortedBy;
      }
      const filter = this.parameters.filter;
      const signature = JSON.stringify(filter);
      if (this.#requestedFilter !== signature) {
        this.#collectionView.applyFilter(filter === null ? null : { locale: this.#context.locale, timeZone: this.#context.timeZone, ...filter });
        this.#requestedFilter = signature;
      }
      this.#invalidate({ full: true, rows: [] });
      return rest;
    }
    #observeStore() {
      if (this.isConnected && this.#collectionView && !this.#unsubscribeStore) {
        this.#collectionView.connect();
        this.#unsubscribeStore = this.#collectionView.subscribe((change) => this.#invalidate(change));
      }
    }
    #cancelRefresh() {
      if (this.#refreshTimer !== null) this.ownerDocument.defaultView.clearTimeout(this.#refreshTimer);
      this.#refreshTimer = null;
      this.#pendingFull = false;
      this.#pendingRows.clear();
    }
    #invalidate({ full, rows }) {
      this.#pendingFull ||= full;
      if (this.#pendingFull) this.#pendingRows.clear();
      else for (const node of rows) this.#pendingRows.add(node);
      if (!this.isConnected || this.#refreshTimer !== null) return;
      this.#refreshTimer = this.ownerDocument.defaultView.setTimeout(() => {
        const full2 = this.#pendingFull, nodes = [...this.#pendingRows];
        this.#refreshTimer = null;
        this.#pendingFull = false;
        this.#pendingRows.clear();
        try {
          if (full2) this.#project();
          else this.#projectRows(nodes);
        } catch (error) {
          this.#pendingFull = true;
          this.#context.reportError(error, "Grid refresh");
        }
      }, 0);
    }
    #projectRows(nodes) {
      const rows = new GridRows(this.#collectionView, this.#context.format).read(this.#structure.columns, nodes.filter((node) => this.#rows.has(node)));
      this.#rowInteraction.cancel();
      for (const { node, cells } of rows) this.#renderCells(this.#rows.get(node), cells);
      this.#scheduleLayout();
    }
    #project() {
      const model = this.#structureDirty ? new GridStructure(this.#structBag) : this.#structure;
      const rowModel = new GridRows(this.#collectionView, this.#context.format);
      const rows = rowModel.read(model.columns);
      this.#structure = model;
      this.#structureDirty = false;
      gridSearch(this.#context.sourceNode).update(this.#collectionView, model.columns);
      const rowHeaders = this.parameters.rowHeaders || this.parameters.rowResize;
      const signature = JSON.stringify([model.groups, rowHeaders]);
      this.#rowHeaders = rowHeaders;
      if (signature !== this.#signature) {
        this.#renderHeader(model);
        this.#signature = signature;
      }
      this.#renderSort();
      this.#renderRows(rows, model.columns);
      this.control.setAttribute("aria-colcount", String(model.columns.length + Number(this.#rowHeaders)));
      this.control.setAttribute("aria-rowcount", String(this.#headerRows + Math.max(rows.length, 1)));
      this.#scheduleLayout();
    }
    #sort(field, multiple) {
      try {
        const criteria = this.#collectionView.criteria;
        const current = criteria.find((item) => item.field === field);
        const direction = current?.direction === "a" ? "d" : "a";
        const next = multiple ? criteria.filter((item) => item.field !== field) : [];
        if (multiple && current) next.splice(criteria.indexOf(current), 0, { field, direction });
        else next.push({ field, direction });
        this.#collectionView.sort(next.map((item) => `${item.field}:${item.direction}`).join(","));
      } catch (error) {
        this.#context.reportError(error, "Grid sort");
      }
    }
    #renderSort() {
      const criteria = this.#collectionView.criteria;
      for (const header of this.#head.querySelectorAll("th[data-field]")) {
        const index = criteria.findIndex((item) => item.field === header.dataset.field);
        header.removeAttribute("aria-sort");
        if (index < 0) {
          delete header.dataset.sortDirection;
          delete header.dataset.sortPriority;
          header.removeAttribute("aria-label");
        } else {
          const direction = criteria[index].direction === "a" ? "ascending" : "descending";
          header.dataset.sortDirection = direction;
          header.dataset.sortPriority = String(index + 1);
          if (index === 0) header.setAttribute("aria-sort", direction);
          header.setAttribute("aria-label", `${header.textContent}, sort ${index + 1}, ${direction}`);
        }
      }
    }
    #renderHeader(model) {
      this.#interaction.cancel();
      const focused = this.shadowRoot.activeElement;
      const focusedField = focused?.closest("th[data-field]")?.dataset.field;
      const resizeFocused = focused?.classList.contains("column-resize");
      const doc = this.ownerDocument, grouped = model.groups.some((group) => group.name !== null);
      this.#headerRows = grouped ? 2 : 1;
      const top = doc.createElement("tr"), bottom = doc.createElement("tr");
      for (const [index2, row] of [top, bottom].entries()) {
        row.setAttribute("role", "row");
        row.setAttribute("aria-rowindex", String(index2 + 1));
      }
      const header = (text, span, rowSpan, scope, index2, align = "start") => {
        const cell = doc.createElement("th");
        cell.textContent = text;
        cell.colSpan = span;
        cell.rowSpan = rowSpan;
        cell.scope = scope;
        cell.setAttribute("role", "columnheader");
        cell.setAttribute("part", scope === "colgroup" ? "group-header" : "column-header");
        cell.setAttribute("aria-colindex", String(index2 + 1 + Number(this.#rowHeaders)));
        cell.setAttribute("aria-colspan", String(span));
        cell.setAttribute("aria-rowspan", String(rowSpan));
        cell.style.textAlign = align;
        if (scope === "col") {
          const caption = doc.createElement("span");
          caption.className = "column-caption";
          caption.textContent = text;
          cell.replaceChildren(caption);
          const column = model.columns[index2];
          cell.dataset.field = column.field;
          cell.draggable = true;
          cell.tabIndex = 0;
          cell.title = "Click: ascending / descending \xB7 Shift-click: add or reverse this column without changing the others \xB7 Numbers show sort priority \xB7 Drag to reorder";
          const indicator = doc.createElementNS(SVG_NS, "svg");
          indicator.classList.add("sort-indicator");
          indicator.setAttribute("viewBox", "0 0 16 16");
          indicator.setAttribute("aria-hidden", "true");
          const arrow = doc.createElementNS(SVG_NS, "path");
          arrow.setAttribute("d", "M4 10L8 6L12 10");
          indicator.append(arrow);
          cell.append(indicator);
          const handle = doc.createElement("span");
          handle.className = "column-resize";
          handle.tabIndex = 0;
          handle.setAttribute("role", "separator");
          handle.setAttribute("aria-orientation", "vertical");
          handle.setAttribute("aria-valuemin", "40");
          handle.setAttribute("aria-label", `Resize ${column.name}`);
          handle.title = "Drag to resize \xB7 Arrow keys adjust width";
          cell.append(handle);
        }
        return cell;
      };
      if (this.#rowHeaders) {
        const corner = doc.createElement("th");
        corner.textContent = "#";
        corner.scope = "col";
        corner.className = "row-heading";
        corner.rowSpan = this.#headerRows;
        corner.setAttribute("role", "columnheader");
        corner.setAttribute("aria-colindex", "1");
        corner.setAttribute("aria-rowspan", String(this.#headerRows));
        corner.setAttribute("part", "row-header");
        top.append(corner);
      }
      let index = 0;
      for (const group of model.groups) {
        if (grouped && group.name !== null) {
          const band = header(group.name, group.columns.length, 1, "colgroup", index, "center");
          band.style.background = group.background ?? "";
          band.style.color = group.color ?? "";
          top.append(band);
          for (const col of group.columns) bottom.append(header(col.name, 1, 1, "col", index++, col.align));
        } else for (const col of group.columns) {
          if (grouped) {
            const spacer = doc.createElement("td");
            spacer.className = "group-spacer";
            spacer.setAttribute("aria-hidden", "true");
            top.append(spacer);
          }
          (grouped ? bottom : top).append(header(col.name, 1, 1, "col", index++, col.align));
        }
      }
      this.#head.replaceChildren(top, ...grouped ? [bottom] : []);
      if (focusedField) this.#head.querySelector(`th[data-field="${focusedField}"]${resizeFocused ? " .column-resize" : ""}`)?.focus({ preventScroll: true });
      const widths = model.columns.map((column) => column.width ?? "var(--gramlot-grid-column-width, 10rem)");
      if (this.#rowHeaders) widths.unshift("var(--gramlot-grid-row-header-width, 44px)");
      this.control.style.setProperty("--grid-columns-width", `calc(${widths.join(" + ")})`);
      for (const table of [this.#headerTable, this.#bodyTable]) {
        for (const group of table.querySelectorAll(":scope > colgroup")) group.remove();
        table.prepend(...model.groups.map((group) => {
          const element = doc.createElement("colgroup");
          for (const column of group.columns) {
            const col = doc.createElement("col");
            col.style.width = column.width ?? "var(--gramlot-grid-column-width, 10rem)";
            element.append(col);
          }
          return element;
        }));
        if (this.#rowHeaders) {
          const group = doc.createElement("colgroup"), col = doc.createElement("col");
          col.style.width = "var(--gramlot-grid-row-header-width, 44px)";
          group.append(col);
          table.prepend(group);
        }
      }
    }
    #renderRows(rows, columns) {
      this.#rowInteraction.cancel();
      this.#rowInteraction.cancelDrag();
      this.#rowLayout.retain(this.#store.getNodes());
      const keep = /* @__PURE__ */ new Set();
      let previous = null;
      this.#body.querySelector(".empty")?.parentElement.remove();
      for (const { node, cells } of rows) {
        let tr = this.#rows.get(node);
        if (!tr) {
          tr = this.ownerDocument.createElement("tr");
          tr.setAttribute("part", "row");
          tr.setAttribute("role", "row");
          tr.dataset.row = node.label;
          this.#rows.set(node, tr);
        }
        tr.draggable = this.parameters.selfDragRows;
        let heading = tr.querySelector("th[scope=row]");
        if (this.#rowHeaders) {
          if (!heading) {
            heading = this.ownerDocument.createElement("th");
            heading.scope = "row";
            heading.className = "row-heading";
            heading.setAttribute("role", "rowheader");
            heading.setAttribute("part", "row-header");
            heading.setAttribute("aria-colindex", "1");
            const caption = this.ownerDocument.createElement("span");
            caption.className = "row-number";
            heading.append(caption);
            tr.prepend(heading);
          }
          heading.querySelector(".row-number").textContent = String(keep.size + 1);
          let handle = heading.querySelector(".row-height-handle");
          if (this.parameters.rowResize) {
            if (!handle) {
              handle = this.ownerDocument.createElement("span");
              handle.className = "row-height-handle";
              handle.tabIndex = 0;
              handle.setAttribute("role", "separator");
              handle.setAttribute("aria-orientation", "horizontal");
              handle.title = "Drag to resize row \xB7 Double-click or Home resets \xB7 Arrow keys adjust height";
              heading.append(handle);
            }
            handle.setAttribute("aria-label", `Resize row ${keep.size + 1}`);
          } else handle?.remove();
        } else heading?.remove();
        const offset = Number(this.#rowHeaders);
        const existing = new Map([...tr.querySelectorAll("td[data-field]")].map((td) => [td.dataset.field, td]));
        for (const [index, column] of columns.entries()) {
          let td = existing.get(column.field);
          if (!td) {
            td = this.ownerDocument.createElement("td");
            td.setAttribute("part", "cell");
            td.dataset.field = column.field;
            td.setAttribute("role", "cell");
          }
          td.style.textAlign = column.align;
          td.style.whiteSpace = column.white_space ?? "";
          td.style.overflowWrap = column.white_space === "pre-wrap" || column.white_space === "normal" ? "anywhere" : "";
          td.setAttribute("aria-colindex", String(index + 1 + offset));
          td.classList.toggle("numeric", ["L", "R", "N"].includes(column.dtype));
          if (tr.cells[index + offset] !== td) tr.insertBefore(td, tr.cells[index + offset] ?? null);
          existing.delete(column.field);
        }
        for (const td of existing.values()) td.remove();
        tr.setAttribute("aria-rowindex", String(this.#headerRows + keep.size + 1));
        this.#renderCells(tr, cells);
        const next = previous ? previous.nextSibling : this.#body.firstChild;
        if (next !== tr) this.#body.insertBefore(tr, next);
        this.#rowInteraction.project(tr, node);
        previous = tr;
        keep.add(node);
      }
      for (const [node, tr] of this.#rows) if (!keep.has(node)) {
        tr.remove();
        this.#rows.delete(node);
      }
      if (!rows.length) {
        const tr = this.ownerDocument.createElement("tr"), td = this.ownerDocument.createElement("td");
        tr.setAttribute("role", "row");
        tr.setAttribute("aria-rowindex", String(this.#headerRows + 1));
        td.setAttribute("role", "cell");
        td.setAttribute("aria-colspan", String(columns.length + Number(this.#rowHeaders)));
        td.className = "empty";
        td.colSpan = columns.length + Number(this.#rowHeaders);
        td.textContent = "No rows";
        tr.append(td);
        this.#body.append(tr);
      }
    }
    #renderCells(row, cells) {
      const offset = Number(this.#rowHeaders);
      cells.forEach((text, index) => {
        if (row.cells[index + offset].textContent !== text) row.cells[index + offset].textContent = text;
      });
    }
  }
});
var GridCollection = class extends components_exports.ComponentCollection {
  toDocument() {
    const document = super.toDocument();
    const parameters2 = document.elements.grid.attributes.parameters;
    for (const name of ["storepath", "rowMode"]) {
      const parameter = parameters2.find((item) => item.name === name);
      parameter.has_default = false;
      delete parameter.default;
      if (name === "rowMode") parameter.annotation = {
        kind: "annotated",
        base: { kind: "dtype", dtype: "T" },
        metadata: [{ kind: "regex", pattern: "^(values|attributes)$", flags: 0 }]
      };
    }
    Object.assign(document.elements, structuredClone(grid_grammar_default.elements));
    return document;
  }
};
var grid_default = new GridCollection({ name: "grid", components: [Grid, SearchBox] });
export {
  Grid,
  grid_default as default
};
