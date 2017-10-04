(function() {
  const css = `
    :host {
      border: 1px solid #27c4f4;
      display: inline-block;
      height: 14px;
      margin: 0;
      padding: 0;
      position: relative;
      width: 100%;
      --complete-color: #27c4f4;
      --in-progress-color: #D8D8D8;
    }
    fs-statusbar {
      border: 1px solid #27c4f4;
      display: inline-block;
      height: 14px;
      margin: 0;
      padding: 0;
      position: relative;
      width: 100%;
      --complete-color: #27c4f4;
      --in-progress-color: #D8D8D8;
    }

    :host > span {
      display: inline-block;
      height: 14px;
      margin: 0;
      padding: 0;
      position: relative;
      top:-2px;
    }
    fs-statusbar > span {
      display: inline-block;
      height: 14px;
      margin: 0;
      padding: 0;
      position: relative;
      top:-2px;
    }

    .fs-statusbar--percent-complete {
      background-color: var(--complete-color);
    }

    .fs-statusbar--percent-in-progress {
      background-color: var(--in-progress-color);
    }
  `;


  var template = '<span class="fs-statusbar--percent-complete" style="width:0;"></span><span class="fs-statusbar--percent-in-progress" style="width:0;"></span>';

  // Does this browser support shadowDom?
  var supportsShadowDom = !!/\{\s+\[native code\]\s+\}/.test((HTMLElement.prototype.attachShadow||'').toString());
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
    } while(node);
  }

  addSiblings(temp.firstElementChild);

  if (!supportsShadowDom) {
    // We don't support shadow DOM so we need to load our styles into the <head> tag
    document.head.appendChild(_styles);
  }

  // Class for `<fs-statusbar>`
  class FsStatusbar extends HTMLElement {
    constructor() {
      super();

      // `rootEl` is set to `this` for shady DOM
      var rootEl = this;

      if (supportsShadowDom) {
        // We can support shadow DOM.
        rootEl = this.attachShadow({mode: 'open'}); // `rootEl` is set to the shadow DOM
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

    get percentComplete() {
      return $private.get(this).percentComplete;
    }
    set percentComplete(value) {
      if (isNaN(value)) {
        throw new TypeError('percentComplete must be a number');
      }
      value = Number(value);
      var data = $private.get(this);
      var percentInProgress = data.percentInProgress;
      if (value + percentInProgress > 100) {
        percentInProgress = 100 - value;
        data.percentInProgress = percentInProgress;
        data.subEl.percentInProgress.style.width = percentInProgress+"%";
      }

      data.percentComplete = value;
      data.subEl.percentComplete.style.width = value+"%";
    }

    get percentInProgress() {
      return $private.get(this).percentInProgress;
    }
    set percentInProgress(value) {
      if (isNaN(value)) {
        throw new TypeError('percentInProgress must be a number');
      }
      value = Number(value);
      var data = $private.get(this);
      var percentComplete = data.percentComplete;
      if (value + percentComplete > 100) {
        percentComplete = 100 - value;
        data.percentComplete = percentComplete;
        data.subEl.percentComplete.style.width = percentComplete+"%";
      }
      data.percentInProgress = value;
      data.subEl.percentInProgress.style.width = value+"%";
    }

  }

  // Define our web component
  customElements.define('fs-statusbar', FsStatusbar);
})();
