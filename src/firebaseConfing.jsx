import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDqnS5zdRbr8fFqBdEGTnMK32dBfLCbqUo',
  authDomain: 'well-consulting-task.firebaseapp.com',
  projectId: 'well-consulting-task',
  databaseURL: 'https://well-consulting-task-default-rtdb.firebaseio.com/',
  storageBucket: 'well-consulting-task.appspot.com',
  messagingSenderId: '227065776599',
  appId: '1:227065776599:web:111fe8638c31584d4be392',
  measurementId: 'G-0K5PPK087X',
};

export const app = initializeApp(firebaseConfig);
