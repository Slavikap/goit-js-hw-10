import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

let countdownInterval;
let timerStarted = false; // Прапорець, що вказує, чи запущено таймер

window.addEventListener('DOMContentLoaded', () => {
  const currentDate = new Date();
  if (datetimePicker.value && new Date(datetimePicker.value) < currentDate) {
    startButton.disabled = true;
  }
});

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (!selectedDate || selectedDate < currentDate) {
      iziToast.show({
        title: '',
        message: 'Виберіть дату в майбутньому',
        color: 'red',
        position: 'topRight',
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

function startCountdown() {
  if (timerStarted) return; // Якщо таймер вже запущено, виходимо з функції
  timerStarted = true; // Позначаємо, що таймер запущено
  const userSelectedDate = new Date(datetimePicker.value).getTime();
  const currentDate = new Date().getTime();
  let timeDifference = userSelectedDate - currentDate;

  if (timeDifference <= 0) {
    clearInterval(countdownInterval);
    startButton.disabled = true;
    return;
  }

  // Блокуємо можливість змінювати дату під час роботи таймера
  datetimePicker.setAttribute('disabled', true);

  function updateTimerUI(timeDifference) {
    if (timeDifference <= 0) {
      daysElement.innerText = '00';
      hoursElement.innerText = '00';
      minutesElement.innerText = '00';
      secondsElement.innerText = '00';
      startButton.disabled = false; // Після закінчення таймера кнопку робимо активною
      datetimePicker.removeAttribute('disabled'); // Розблоковуємо можливість вибору нової дати
      return;
    }
  
    const { days, hours, minutes, seconds } = convertMs(timeDifference);
    daysElement.innerText = addLeadingZero(days);
    hoursElement.innerText = addLeadingZero(hours);
    minutesElement.innerText = addLeadingZero(minutes);
    secondsElement.innerText = addLeadingZero(seconds);
  }

  countdownInterval = setInterval(() => {
    timeDifference -= 1000; // Зменшуємо різницю на 1 секунду
    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      startButton.disabled = true;
      updateTimerUI(0); // Оновлюємо інтерфейс, показуючи 00:00:00
      timerStarted = false; // Позначаємо, що таймер зупинено
      return;
    }
    updateTimerUI(timeDifference);
  }, 1000);
}  

function addLeadingZero(value) {
  return value < 10 ? `0${value}` : `${value}`;
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

startButton.addEventListener('click', () => {
  startCountdown();
  startButton.disabled = true; // При кожному натисканні кнопку робимо неактивною
});
