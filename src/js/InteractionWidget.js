import GetDate from './GetDate';
import TicketWidget from './TicketWidget';

export default class InteractionWidget {
  constructor(widget, communicator, showErrorMessage, toolTip, loadingImg) {
    this.widget = widget;
    this.communicator = communicator;
    this.showErrorMessage = showErrorMessage;
    this.toolTip = toolTip;
    this.loadingImg = loadingImg;

    this.targetTicketId = null;
    this.formStatus = null;

    this.addListener = this.addListener.bind(this);
    this.openForm = this.openForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.ticketDescription = this.ticketDescription.bind(this);
    this.openConfirm = this.openConfirm.bind(this);
    this.canselDel = this.canselDel.bind(this);
    this.delTicket = this.delTicket.bind(this);
    this.hideError = this.hideError.bind(this);
    this.changeTextarea = this.changeTextarea.bind(this);

    this.callbacks = [this.toggleStatus, this.ticketDescription, this.openForm, this.openConfirm];
  }

  activation() {
    this.getListTickets();

    this.addListener();
    this.widget.errorBtnOK.addEventListener('click', this.hideError);
    this.widget.textareaShort.addEventListener('input', this.changeTextarea);
    this.widget.textareaDetailed.addEventListener('input', this.changeTextarea);
  }

  addListener() {
    this.widget.btnAddTicket.addEventListener('click', this.openForm);
    this.widget.formTicket.addEventListener('submit', this.submitForm);
    this.widget.formCansel.addEventListener('click', this.closeForm);
    this.widget.confirmCansel.addEventListener('click', this.canselDel);
    this.widget.confirmOk.addEventListener('click', this.delTicket);
  }

  removeListener() {
    this.widget.btnAddTicket.removeEventListener('click', this.openForm);
    this.widget.formTicket.removeEventListener('submit', this.submitForm);
    this.widget.formCansel.removeEventListener('click', this.closeForm);
    this.widget.confirmCansel.removeEventListener('click', this.canselDel);
    this.widget.confirmOk.removeEventListener('click', this.delTicket);
  }

  getListTickets() {
    this.loadingImg.showLoading();

    this.communicator.getTicket()
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Не удалось загрузить список тикетов');
      }).then((data) => {
        if (data) {
          return this.renderingTikets(data);
        }
        throw new Error('Данные отсутствуют');
      }).catch((error) => {
        this.loadingImg.hideLoading();
        this.widget.showCurtain('red');
        this.showErrorMessage.showMessage(error.message);
      });
  }

  renderingTikets(data) {
    this.widget.removeAllTickets();
    this.widget.elDescription = null;

    for (let i = 0; i < data.length; i += 1) {
      const el = TicketWidget.createTicket(data[i], ...this.callbacks);
      this.widget.pasteTicket(el);
    }
    this.loadingImg.hideLoading();
  }

  openForm(e) {
    e.preventDefault();

    if (!e.target.classList.contains('edit_btn')) {
      this.widget.formTitle.textContent = 'Добавить тикет';
      this.formStatus = 'new';
    } else {
      this.widget.formTitle.textContent = 'Изменить тикет';
      this.formStatus = 'edit';

      this.defineTargetId(e.target);
      this.editTicket();
    }

    this.unblockForm();
  }

  unblockForm() {
    this.widget.showCurtain();
    this.widget.showForm();
  }

  closeForm(e) {
    e.preventDefault();

    this.toolTip.hideAllToolTips();
    this.blockForm();
  }

  blockForm() {
    this.widget.resetForm();
    this.widget.hideCurtain();
    this.widget.hideForm();
  }

  submitForm(e) {
    e.preventDefault();

    const emtyTextarea = this.getEmptyTextarea();
    if (emtyTextarea.length !== 0) {
      emtyTextarea.forEach((et) => this.toolTip.showToolTip(et, 'Поле необходимо заполнить'));
    } else {
      const formData = new FormData(this.widget.formTicket);
      this.loadingImg.showLoading();

      if (this.formStatus === 'new') {
        const status = false;
        formData.append('status', status);

        const created = GetDate.getFormatDate();
        formData.append('created', created);

        this.communicator.sendNewTicket(formData)
          .then((response) => {
            if (response.ok) {
              return this.getListTickets();
            }
            throw new Error('Не удалось создать тикет');
          }).catch((error) => {
            this.loadingImg.hideLoading();
            this.widget.showCurtain('red');
            this.showErrorMessage.showMessage(error.message);
          });
      } else if (this.formStatus === 'edit') {
        formData.append('id', this.targetTicketId);
        this.communicator.sendEditTicket(formData)
          .then((response) => {
            if (response.ok) {
              return this.getListTickets();
            }
            throw new Error('Не удалось сохранить изменения тикета');
          }).catch((error) => {
            this.loadingImg.hideLoading();
            this.widget.showCurtain('red');
            this.showErrorMessage.showMessage(error.message);
          });
      }

      this.targetTicketId = null;
      this.formStatus = null;
      this.closeForm(e);
    }
  }

  getEmptyTextarea() {
    const result = [];

    if (this.widget.textareaShort.value.length === 0) result.push(this.widget.textareaShort);
    if (this.widget.textareaDetailed.value.length === 0) result.push(this.widget.textareaDetailed);

    return result;
  }

  toggleStatus(e) {
    e.preventDefault();

    this.loadingImg.showLoading();

    const { id } = e.target.closest('.ticket_box').dataset;
    const jsonId = JSON.stringify(id);

    this.communicator.sendToggleStatus(jsonId)
      .then((response) => {
        if (response.ok) {
          return this.getListTickets();
        }
        throw new Error('Не удалось изменить статус');
      }).catch((error) => {
        this.loadingImg.hideLoading();
        this.widget.showCurtain('red');
        this.showErrorMessage.showMessage(error.message);
      });
  }

  ticketDescription(e) {
    e.preventDefault();

    if (this.widget.elDescription) {
      this.widget.elDescription.remove();
      this.widget.elDescription = null;
    } else {
      this.loadingImg.showLoading();

      const { id } = e.target.closest('.ticket_box').dataset;
      const allTickets = this.widget.serchAllTickets();
      this.communicator.getTicket(id)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Не удалось загрузить подробное описание');
        }).then((data) => {
          const ticket = allTickets.find((t) => t.dataset.id === data.id);
          this.widget.showDescription(ticket, data.description);
          this.loadingImg.hideLoading();
        }).catch((error) => {
          this.loadingImg.hideLoading();
          this.widget.showCurtain('red');
          this.showErrorMessage.showMessage(error.message);
        });
    }
  }

  editTicket() {
    this.loadingImg.showLoading();

    this.communicator.getTicket(this.targetTicketId)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Не удалось загрузить редактируемый тикет');
      }).then((data) => {
        this.widget.fillForm(data);
        this.loadingImg.hideLoading();
      }).catch((error) => {
        this.loadingImg.hideLoading();
        this.widget.showCurtain('red');
        this.showErrorMessage.showMessage(error.message);
      });
  }

  openConfirm(e) {
    e.preventDefault();

    this.defineTargetId(e.target);
    this.widget.showConfirmWindow();
  }

  canselDel(e) {
    e.preventDefault();

    this.targetTicketId = null;
    this.widget.hideConfirmWindow();
  }

  delTicket(e) {
    e.preventDefault();

    this.loadingImg.showLoading();

    this.communicator.sendDelTicket(this.targetTicketId)
      .then((response) => {
        if (response.ok) {
          return this.getListTickets();
        }
        throw new Error('Не удалось удалить тикет');
      }).catch((error) => {
        this.loadingImg.hideLoading();
        this.widget.showCurtain('red');
        this.showErrorMessage.showMessage(error.message);
      });

    this.targetTicketId = null;
    this.widget.hideConfirmWindow();
  }

  defineTargetId(target) {
    this.targetTicketId = target.closest('.ticket_box').dataset.id;
  }

  hideError(e) {
    e.preventDefault();

    this.showErrorMessage.hideMessage();
    this.widget.hideCurtain();
  }

  changeTextarea(e) {
    if (this.toolTip.toolTipsBox.find((tt) => tt.dataset.name === e.target.name)) {
      this.toolTip.hideToolTip(e.target.name);
    }
  }
}
