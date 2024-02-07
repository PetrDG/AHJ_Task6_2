export default class ShowErrorMessage {
  constructor(container, classNameBox, classNameMessage, classNameHide) {
    this.container = container;
    this.classNameBox = classNameBox;
    this.classNameMessage = classNameMessage;
    this.classNameHide = classNameHide;

    this.errorMessageBox = this.container.querySelector(`.${this.classNameBox}`);
    this.errorMessage = this.errorMessageBox.querySelector(`.${this.classNameMessage}`);
  }

  showMessage(message) {
    if (message) this.errorMessage.textContent = message;
    this.errorMessageBox.classList.remove(this.classNameHide);
  }

  hideMessage() {
    this.errorMessage.textContent = '';
    this.errorMessageBox.classList.add(this.classNameHide);
  }
}
