import { app } from './firebaseConfing';
import { getDatabase, ref, set, push, get, remove } from 'firebase/database';

const db = getDatabase(app);

export const fetchSchedulerData = async () => {
  const dbRef = ref(db, 'activities');
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    const schedulerData = Object.values(snapshot.val()).flat();
    return schedulerData;
  } else {
    return [];
  }
};

export const updateDatabase = (updatedActivities) => {
  const newDocRef = push(ref(db, 'activities'));
  const dbRef = ref(db, 'activities');
  remove(dbRef);
  set(newDocRef, updatedActivities);
};
