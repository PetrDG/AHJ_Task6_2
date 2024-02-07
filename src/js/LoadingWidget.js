export default class LoadingWidget {
  constructor(box) {
    this.box = box;
  }

  showLoading() {
    this.box.classList.remove('hiden');
  }

  hideLoading() {
    this.box.classList.add('hiden');
  }
}
