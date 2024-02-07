import CommunicationServer from './CommunicationServer';
import TicketWidget from './TicketWidget';
import InteractionWidget from './InteractionWidget';
import ShowErrorMessage from './ShowErrorMessage';
import ToolTip from './ToolTip';
import LoadingWidget from './LoadingWidget';

const port = 'http://localhost:7000';
const container = document.querySelector('.container');
const loadingBox = document.querySelector('.loading');

const loadingImg = new LoadingWidget(loadingBox);
const widget = new TicketWidget(container);
const communicator = new CommunicationServer(port);
const showErrorMessage = new ShowErrorMessage(container, 'error-message_box', 'error-message_text', 'hiden');
const toolTip = new ToolTip('tooltip');
const worker = new InteractionWidget(widget, communicator, showErrorMessage, toolTip, loadingImg);

worker.activation();
