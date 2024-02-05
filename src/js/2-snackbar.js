import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const delay = formData.get('delay');
  const state = formData.get('state');

  try {
    await new Promise((resolve, reject) => {
      if (state === 'fulfilled') {
        setTimeout(() => {
          resolve(delay);
        }, delay);
      } else if (state === 'rejected') {
        setTimeout(() => {
          reject(delay);
        }, delay);
      }
    });
    iziToast.show({
      title: 'Notification',
      message: `✅ Fulfilled promise in ${delay}ms`,
      color: 'green',
      position: 'topRight',
    });
  } catch (error) {
    iziToast.show({
      title: 'Notification',
      message: `❌ Rejected promise in ${delay}ms`,
      color: 'red',
      position: 'topRight',
    });
  }
});
