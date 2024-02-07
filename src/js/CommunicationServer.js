export default class CommunicationServer {
  constructor(port) {
    this.port = port;
  }

  async getTicket(id) {
    let url = this.port;

    if (!id) {
      url += '?method=allTickets';
    } else {
      url += `?method=ticketById&id=${id}`;
    }
    const result = await fetch(url);

    return result;
  }

  async sendNewTicket(data) {
    const url = `${this.port}?method=createTicket`;

    const result = await fetch(url, {
      method: 'POST',
      body: data,
    });

    return result;
  }

  async sendToggleStatus(id) {
    const url = `${this.port}?method=toggleStatus`;

    const result = await fetch(url, {
      method: 'PATCH',
      body: id,
    });

    return result;
  }

  async sendEditTicket(data) {
    const url = `${this.port}?method=editTicket`;

    const result = await fetch(url, {
      method: 'PATCH',
      body: data,
    });

    return result;
  }

  async sendDelTicket(id) {
    const url = `${this.port}?method=deleteTicket&id=${id}`;

    const result = await fetch(url, {
      method: 'DELETE',
    });

    return result;
  }
}
