class RowiPlainText extends HTMLElement {
  static formAssociated = true
  get form() { return this._internals.form; }
  get name() { return this.getAttribute('name'); }
  get type() { return this.localName; }

  constructor () {
    super()
    this._internals = this.attachInternals()
    this._updateValue = this.updateValue.bind(this)
    this._pasteText = this.pasteText.bind(this)
  }

  get value() { return this.innerText }
  set value(value) {
    this.innerText = value
    this._internals.setFormValue(value)
  }

  connectedCallback () {
    this.style.cssText = 'display:block;outline: none;white-space:pre-wrap;'
    this.contentEditable = 'true'
    this.addEventListener('keyup', this._updateValue)
    this.addEventListener('paste', this._pasteText)
  }

  disconnectedCallback () {
    this.removeEventListener('keyup', this._updateValue)
    this.removeEventListener('paste', this._pasteText)
  }

  updateValue (ev) {
    const value = this.innerText
    this.dispatchEvent(new CustomEvent('$change', { detail: value }))
    this._internals.setFormValue(value)
  }

  pasteText (ev) {
    const text = ev.clipboardData.getData('text')
    const sel = window.getSelection();
    if (!sel.rangeCount) return false;
    sel.deleteFromDocument()
    const range = sel.getRangeAt(0)
    range.insertNode(document.createTextNode(text))
    ev.preventDefault()
  }
}

customElements.define('rw-plain-text', RowiPlainText)