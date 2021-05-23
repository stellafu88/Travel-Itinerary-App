import React, {ChangeEvent, useEffect, useState} from 'react';
import {IActivityUserInput} from "./Activity/IActivityUserInput";
import {IActivity} from "./Activity/IActivity";


function Itinerary() {
    const STORAGE_KEY = 'myTravelItinerary'
    const [activity, setActivity] = useState({
        title: "",
        destination: "",
        date: "",
        time: ""
    } as IActivityUserInput)

    const [allMyActivities, setAllMyActivities] = useState([] as IActivity[])
    useEffect(() => {
        if (allMyActivities.length) {
            sortActivitiesByDate();
            save();
        }
    });
    const [currentActivityId, setCurrentActivityId] = useState(1)

    const onTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setActivity({...activity, title: event.target.value.trim()})
    }

    const onDestinationChange = (event: ChangeEvent<HTMLInputElement>) => {
        setActivity({...activity, destination: event.target.value.trim()})
    }

    const onDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setActivity({...activity, date: event.target.value})
    }

    const onTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setActivity({...activity, time: event.target.value})
    }

    const save = () => {
        console.log(allMyActivities)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allMyActivities))
    }

    const sortActivitiesByDate = () => {
        const activities = [...allMyActivities];
        const sortedActivities = activities.sort((a: IActivity, b: IActivity) => {
            if (a.date.getTime() < b.date.getTime()) {
                return -1
            }
            if (a.date > b.date) {
                return 1
            } // a must be equal to b
            return 0
        })
        if (JSON.stringify(allMyActivities) !== JSON.stringify(sortedActivities)){
            setAllMyActivities(sortedActivities)
        }
    }

    const onAddActivity = (id?: number) => {
        if (!activity.title) {
            alert("Title is missing.")
        } else if (!activity.destination) {
            alert("Destination is missing.")
        } else if (!activity.date) {
            alert("Date is missing.")
        } else if (!activity.time) {
            alert("Time is missing.")
        }

        // FEATURE 10. Validate inputs

        if (!activity.title || !activity.destination || !activity.date || !activity.time) {
            return;
        }

        // FEATURE 13. Provide default values

        let aNewActivity: IActivity
        if (id) {
            aNewActivity = {
                title: activity.title,
                destination: activity.destination,
                date: new Date(activity.date + ' ' + activity.time),
                id,
                completed: false
            }
        } else {
            aNewActivity = {
                title: activity.title,
                destination: activity.destination,
                date: new Date(activity.date + ' ' + activity.time),
                id: currentActivityId,
                completed: false
            }
            setCurrentActivityId(currentActivityId + 1)
        }
        setAllMyActivities([...allMyActivities, aNewActivity])
    }

    return (
        <div className="Itinerary">
            <div>
                <label htmlFor="title">Title</label>
                <input id="title" type="text" onChange={(event: ChangeEvent<HTMLInputElement>) => onTitleChange(event)}
                       value={activity.title}/>
                <label htmlFor="dest">Destination</label>
                <input id="dest" type="text"
                       onChange={(event: ChangeEvent<HTMLInputElement>) => onDestinationChange(event)}
                       value={activity.destination}/>
                <label htmlFor="date">Date</label>
                <input id="date" type="date" onChange={(event: ChangeEvent<HTMLInputElement>) => onDateChange(event)}
                       value={activity.date}/>
                <label htmlFor="time">Time</label>
                <input id="time" type="time" onChange={(event: ChangeEvent<HTMLInputElement>) => onTimeChange(event)}
                       value={activity.time}/>
            </div>

            <div>
                <input type="button" onClick={() => onAddActivity()} value="Add"/>
                {/*    <input type="button" onClick={onDueActivities()} value="Due"/>*/}
                {/*    <input type="button" onClick={onCompletedActivities()} value="All Completed Activities"/>*/}
                {/*    <input type="button" onClick={onTodayActivities()} value="Today"/>*/}

                {/*    <input type="button" onClick={onAllActivities()} value="All Activities"/>*/}
                {/*</div>*/}

                {/*<div>*/}
                {/*    <input type="button" onClick={onRevertEditing()} value="Undo"/>*/}
                {/*</div>*/}

                {/*<div className="displayActivities">*/}

            </div>


        </div>
    );
};

export default Itinerary;
