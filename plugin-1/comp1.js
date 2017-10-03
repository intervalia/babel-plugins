class MyEl extends HTMLElement {
  static get observedAttributes() {
    return ['fred'];
  }

  constructor() {
    super();

    this.dog = 10;
    this.cat = 20;
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this[attrName] = newVal;
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({mode: 'closed'});
      this.shadowRoot.innerHTML = '<p>My</p>';
      var c = document.createElement('p');
      c.textContent = 'Hi';
      this.shadowRoot.appendChild(c);
    }
  }

  // Value Attribute
  get test() {
    return this.getAttribute('test');
  }
  set test(value) {
    if (value) {
      this.setAttribute('test', value);
    }
    else {
      this.removeAttribute('test');
    }
  }

  // Boolean Attribute
  get open() {
    return this.hasAttribute('open');
  }
  set open(value) {
    if (value) {
      this.setAttribute('open', '');
    }
    else {
      this.removeAttribute('open');
    }
  }
}

// Define our web component
customElements.define('my-el', MyEl);
