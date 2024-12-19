import './css/style.css';
import './less/style.less';
import './sass/style.sass';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Страница загружена!');

  const button = document.createElement('button');
  button.textContent = 'Click me!';
  button.style.cssText = `
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 20px auto;
    display: block;
  `;

  button.addEventListener('click', () => {
    alert('Hello, world!');
  });

  document.body.appendChild(button);
});