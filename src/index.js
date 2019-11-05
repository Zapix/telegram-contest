import './style.css';
import Avatar from './zap.avatar.png';

function component() {
  const title = 'My Wife will be healthy';
  const parentNode = document.createElement('div');

  const textNode = document.createTextNode(title);

  const headerNode = document.createElement('h1');
  headerNode.classList.add('red');
  headerNode.append(textNode);

  const image = new Image();
  image.src = Avatar;

  parentNode.append(headerNode);
  parentNode.append(image);

  return parentNode;
}

document.body.append(component());
