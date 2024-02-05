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

window.addEventListener('DOMContentLoaded', () => {
  const currentDate = new Date();
  if (datetimePicker.value && new Date(datetimePicker.value) < currentDate) {
    startButton.disabled = true;
  }
});

let countdownInterval;

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
  const userSelectedDate = new Date(datetimePicker.value).getTime();
  const currentDate = new Date().getTime();
  const timeDifference = userSelectedDate - currentDate;

  if (timeDifference <= 0) {
    clearInterval(countdownInterval);
    startButton.disabled = true;
    return;
  }

  updateTimerUI(timeDifference);

  countdownInterval = setInterval(() => {
    const currentTime = new Date().getTime();
    const newTimeDifference = userSelectedDate - currentTime;

    if (newTimeDifference <= 0) {
      clearInterval(countdownInterval);
      startButton.disabled = true;
      return;
    }

    updateTimerUI(newTimeDifference);
  }, 1000);
}

function updateTimerUI(timeDifference) {
  if (timeDifference <= 0) {
    startButton.disabled = true;
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeDifference);
  daysElement.innerText = addLeadingZero(days);
  hoursElement.innerText = addLeadingZero(hours);
  minutesElement.innerText = addLeadingZero(minutes);
  secondsElement.innerText = addLeadingZero(seconds);
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
  startButton.disabled = true;
});