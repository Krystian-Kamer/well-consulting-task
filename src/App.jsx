import Paper from '@mui/material/Paper';
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
  MonthView,
  WeekView,
  Toolbar,
  ViewSwitcher,
  AppointmentForm,
  AppointmentTooltip,
} from '@devexpress/dx-react-scheduler-material-ui';
import { app } from '../src/firebaseConfing';
import { getDatabase, ref, set, push, get, remove } from 'firebase/database';
import { useState, useEffect } from 'react';

const currentDate = new Date();
const db = getDatabase(app);

const fetchSchedulerData = async () => {
  const dbRef = ref(db, 'activities');
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    const schedulerData = Object.values(snapshot.val()).flat();
    return schedulerData;
  } else {
    return [];
  }
};

const App = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const firebaseActivities = await fetchSchedulerData();
        setActivities(firebaseActivities);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadActivities();
  }, []);

  const commitChanges = ({ added, changed, deleted }) => {
    const newActivities = [...activities];
    const newDocRef = push(ref(db, 'activities'));
    if (added) {
      const startingAddedId =
        newActivities.length > 0
          ? newActivities[newActivities.length - 1].id + 1
          : 0;
      const activity = {
        id: startingAddedId,
        ...added,
        endDate: new Date(added.endDate).toString(),
        startDate: new Date(added.startDate).toString(),
      };
      const updatedActivities = [...newActivities, activity];
      const dbRef = ref(db, 'activities');
      remove(dbRef);
      set(newDocRef, updatedActivities);
      setActivities(updatedActivities);
    }

    if (changed) {
      const activityId = Number(Object.keys(changed)[0]);
      const activityChanges = Object.values(changed)[0];
      const updatedActivities = newActivities.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              ...activityChanges,
              endDate: new Date(
                activityChanges.endDate
                  ? activityChanges.endDate
                  : activity.endDate
              ).toString(),
              startDate: new Date(
                activityChanges.startDate
                  ? activityChanges.startDate
                  : activity.startDate
              ).toString(),
            }
          : activity
      );
      const dbRef = ref(db, 'activities');
      remove(dbRef);
      set(newDocRef, updatedActivities);
      setActivities(updatedActivities);
    }
    if (deleted !== undefined) {
      const updatedActivities = newActivities
        .filter((activity) => activity.id !== deleted)
        .map((activity, index) => ({
          ...activity,
          id: index + 1,
        }));
      const dbRef = ref(db, 'activities');
      remove(dbRef);
      set(newDocRef, updatedActivities);
      setActivities(updatedActivities);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading activities: {error.message}</div>;
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '50px auto' }}>
      <Paper>
        <Scheduler data={activities} locale='pl'>
          <ViewState
            currentDate={currentDate}
            defaultCurrentViewName='Tydzień'
          />
          <EditingState onCommitChanges={commitChanges} />
          <IntegratedEditing />
          <DayView name='Dzień' startDayHour={6} endDayHour={18} />
          <WeekView name='Tydzień' startDayHour={6} endDayHour={18} />
          <MonthView name='Miesiąc' startDayHour={6} endDayHour={18} />
          <Toolbar />
          <ViewSwitcher />
          <Appointments />
          <AppointmentTooltip showOpenButton showDeleteButton />
          <AppointmentForm />
        </Scheduler>
      </Paper>
    </div>
  );
};
export default App;
