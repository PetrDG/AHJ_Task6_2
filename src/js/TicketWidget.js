export default class TicketWidget {
  constructor(container) {
    this.container = container;
    this.btnAddTicket = this.container.querySelector('.add_ticket');
    this.ticketList = this.container.querySelector('.ticket_list');
    this.formTicket = document.forms.ticket;
    this.formTitle = this.formTicket.querySelector('.create_ticket_title');
    this.formCansel = this.formTicket.querySelector('.create_btn-cansel');
    this.textareaShort = this.formTicket.name;
    this.textareaDetailed = this.formTicket.description;
    this.confirmWindow = this.container.querySelector('.confirm_box');
    this.confirmCansel = this.confirmWindow.querySelector('.confirm_btn-cansel');
    this.confirmOk = this.confirmWindow.querySelector('.confirm_btn-ok');
    this.curtain = this.container.querySelector('.curtain');
    this.errorBtnOK = this.container.querySelector('.error-message_ok');

    this.elDescription = null;
  }

  static createTicket(obj, callbackStatus, callbackDescription, callbackEdit, callbackDel) {
    const ticketBox = TicketWidget.createElement('div', ['ticket_box']);
    ticketBox.dataset.id = obj.id;

    const statusBox = TicketWidget.createElement('div', ['ticket_status-box']);
    const checkView = TicketWidget.createElement('div', ['check-view']);
    if (obj.status === true) checkView.classList.add('status_ready');
    if (callbackStatus) checkView.addEventListener('click', callbackStatus);
    statusBox.append(checkView);
    ticketBox.append(statusBox);

    const textBox = TicketWidget.createElement('div', ['ticket_text-box']);
    if (callbackDescription) textBox.addEventListener('click', callbackDescription);
    const ticketTitle = TicketWidget.createElement('span', ['ticket_title', 'ticket-text']);
    ticketTitle.textContent = obj.name;
    textBox.append(ticketTitle);
    ticketBox.append(textBox);

    const dateBox = TicketWidget.createElement('div', ['ticket_date-box']);
    const ticketDate = TicketWidget.createElement('span', ['ticket_date']);
    ticketDate.textContent = obj.created;
    dateBox.append(ticketDate);
    ticketBox.append(dateBox);

    const btnsBox = TicketWidget.createElement('div', ['ticket_btns-box']);
    const editBtn = TicketWidget.createElement('button', ['ticket-btn', 'edit_btn'], [{ name: 'type', value: 'button' }]);
    if (callbackEdit) editBtn.addEventListener('click', callbackEdit);
    const delBtn = TicketWidget.createElement('button', ['ticket-btn', 'del_btn'], [{ name: 'type', value: 'button' }]);
    if (callbackDel) delBtn.addEventListener('click', callbackDel);
    btnsBox.append(editBtn);
    btnsBox.append(delBtn);
    ticketBox.append(btnsBox);

    return ticketBox;
  }

  static createElement(tag, classes, attributes) {
    const element = document.createElement(tag);
    if (classes) element.classList.add(...classes);
    if (attributes) {
      for (let i = 0; i < attributes.length; i += 1) {
        element.setAttribute(attributes[i].name, attributes[i].value);
      }
    }

    return element;
  }

  pasteTicket(element) {
    this.ticketList.append(element);
  }

  serchAllTickets() {
    return [...this.ticketList.querySelectorAll('.ticket_box')];
  }

  removeAllTickets() {
    this.serchAllTickets().forEach((el) => el.remove());
  }

  showDescription(ticket, description) {
    this.elDescription = TicketWidget.createElement('span', ['ticket_description', 'ticket-text']);
    this.elDescription.textContent = description;

    ticket.querySelector('.ticket_text-box').append(this.elDescription);
  }

  fillForm(obj) {
    this.formTicket.name.value = obj.name;
    this.formTicket.description.value = obj.description;
  }

  showForm() {
    this.formTicket.classList.remove('hiden');
  }

  resetForm() {
    this.formTicket.reset();
  }

  hideForm() {
    this.formTicket.classList.add('hiden');
  }

  showConfirmWindow() {
    this.showCurtain();
    this.confirmWindow.classList.remove('hiden');
  }

  hideConfirmWindow() {
    this.hideCurtain();
    this.confirmWindow.classList.add('hiden');
  }

  showCurtain(color) {
    if (color) this.curtain.style.backgroundColor = color;
    this.curtain.classList.remove('hiden');
  }

  hideCurtain() {
    if (this.curtain.style) this.curtain.removeAttribute('style');
    this.curtain.classList.add('hiden');
  }
}
