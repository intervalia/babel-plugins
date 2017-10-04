var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

(function () {
  var css = '\n    :host {\n      border: 1px solid #27c4f4;\n      display: inline-block;\n      height: 14px;\n      margin: 0;\n      padding: 0;\n      position: relative;\n      width: 100%;\n      --complete-color: #27c4f4;\n      --in-progress-color: #D8D8D8;\n    }\n    fs-statusbar {\n      border: 1px solid #27c4f4;\n      display: inline-block;\n      height: 14px;\n      margin: 0;\n      padding: 0;\n      position: relative;\n      width: 100%;\n      --complete-color: #27c4f4;\n      --in-progress-color: #D8D8D8;\n    }\n\n    :host > span {\n      display: inline-block;\n      height: 14px;\n      margin: 0;\n      padding: 0;\n      position: relative;\n      top:-2px;\n    }\n    fs-statusbar > span {\n      display: inline-block;\n      height: 14px;\n      margin: 0;\n      padding: 0;\n      position: relative;\n      top:-2px;\n    }\n\n    .fs-statusbar--percent-complete {\n      background-color: var(--complete-color);\n    }\n\n    .fs-statusbar--percent-in-progress {\n      background-color: var(--in-progress-color);\n    }\n  ';

  var template = '<span class="fs-statusbar--percent-complete" style="width:0;"></span><span class="fs-statusbar--percent-in-progress" style="width:0;"></span>';

  // Does this browser support shadowDom?
  var supportsShadowDom = !!/\{\s+\[native code\]\s+\}/.test((HTMLElement.prototype.attachShadow || '').toString());
  var $private = new WeakMap();

  // Get the `<link>`, `<style>` and the DOM template
  var _styles = document.createElement('style');
  _styles.setAttribute('data-type', 'fs-statusbar');
  _styles.textContent = css;

  var _template = document.createDocumentFragment();
  var temp = document.createElement('div');
  _temp.innerHTML = template;

  function addSiblings(node) {
    var next;
    do {
      next = node.nextElementSibling;
      _template.appendChild(node);
      node = next;
    } while (node);
  }

  addSiblings(temp.firstElementChild);

  if (!supportsShadowDom) {
    // We don't support shadow DOM so we need to load our styles into the <head> tag
    document.head.appendChild(_styles);
  }

  // Class for `<fs-statusbar>`

  var FsStatusbar = function () {
    function FsStatusbar() {

      // `rootEl` is set to `this` for shady DOM
      var rootEl = this;

      if (supportsShadowDom) {
        // We can support shadow DOM.
        rootEl = this.attachShadow({ mode: 'open' }); // `rootEl` is set to the shadow DOM
        var _link = document.createElement('link');
        _link.rel = 'stylesheet';
        _link.href = 'https://edge.fscdn.org/assets/css/familysearch-styles-164c2ce89d1f0ce825bb82091e47fd9a.styl.css';
        rootEl.appendChild(_link);
        rootEl.appendChild(_styles.cloneNode(true)); // Add a clone of our custom styles to the shadow DOM
      }

      // Append a clone of our DOM template
      rootEl.appendChild(_template.cloneNode(true));

      var privateVars = {
        percentComplete: parseInt(this.getAttribute('percent-complete') || '0', 10),
        percentInProgress: parseInt(this.getAttribute('percent-in-progress') || '0', 10),
        subEl: { // Elements we need to access when properties change
          percentComplete: rootEl.querySelector('.fs-statusbar--percent-complete'),
          percentInProgress: rootEl.querySelector('.fs-statusbar--percent-in-progress')
        }
      };

      $private.set(this, privateVars);

      // Note: These lines must happen after setting the $private map because the setters use this information and will be called by the lines below
      this.percentComplete = privateVars.percentComplete;
      this.percentInProgress = privateVars.percentInProgress;
    }

    _createClass(FsStatusbar, [{
      key: 'percentComplete',
      get: function get() {
        return $private.get(this).percentComplete;
      },
      set: function set(value) {
        if (isNaN(value)) {
          throw new TypeError('percentComplete must be a number');
        }
        value = Number(value);
        var data = $private.get(this);
        var percentInProgress = data.percentInProgress;
        if (value + percentInProgress > 100) {
          percentInProgress = 100 - value;
          data.percentInProgress = percentInProgress;
          data.subEl.percentInProgress.style.width = percentInProgress + "%";
        }

        data.percentComplete = value;
        data.subEl.percentComplete.style.width = value + "%";
      }
    }, {
      key: 'percentInProgress',
      get: function get() {
        return $private.get(this).percentInProgress;
      },
      set: function set(value) {
        if (isNaN(value)) {
          throw new TypeError('percentInProgress must be a number');
        }
        value = Number(value);
        var data = $private.get(this);
        var percentComplete = data.percentComplete;
        if (value + percentComplete > 100) {
          percentComplete = 100 - value;
          data.percentComplete = percentComplete;
          data.subEl.percentComplete.style.width = percentComplete + "%";
        }
        data.percentInProgress = value;
        data.subEl.percentInProgress.style.width = value + "%";
      }
    }]);

    return FsStatusbar;
  }();

  // Define our web component


  customElements.define('fs-statusbar', FsStatusbar);
})();