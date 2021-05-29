import React, {ChangeEvent, useState} from 'react';
import {IActivityUserInput} from "./Activity/IActivityUserInput";
import {Itinerary} from "./Itinerary";
import {Activity} from "./Activity/Activity";

function ItineraryComponent() {
    const itinerary = new Itinerary()  ;

    const loadLocalStorage = () => {
        const activities = itinerary.load()
        activities.forEach((activity: Activity) => {
            itinerary.addActivity(activity.title, activity.destination, new Date(activity.date))
        })
    }
    loadLocalStorage();

    // State setup
    const [activity, setActivity] = useState({
        title: "",
        destination: "",
        date: "",
        time: ""
    } as IActivityUserInput)

    // const [allMyActivities, setAllMyActivities] = useState([] as IActivity[])
    // // After allMyActivities is updated, execute the following
    // useEffect(() => {
    //     if (allMyActivities.length) {
    //         sortActivitiesByDate();
    //         save();
    //     }
    // });
    // const [currentActivityId, setCurrentActivityId] = useState(1)

    // Event handlers
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

    // const save = () => {
    //     console.log(allMyActivities)
    //     localStorage.setItem(STORAGE_KEY, JSON.stringify(allMyActivities))
    // }
    //
    // const sortActivitiesByDate = () => {
    //     const activities = [...allMyActivities];
    //     const sortedActivities = activities.sort((a: IActivity, b: IActivity) => {
    //         if (a.date.getTime() < b.date.getTime()) {
    //             return -1
    //         }
    //         if (a.date > b.date) {
    //             return 1
    //         } // a must be equal to b
    //         return 0
    //     })
    //     if (JSON.stringify(allMyActivities) !== JSON.stringify(sortedActivities)){
    //         setAllMyActivities(sortedActivities)
    //     }
    // }


    const[activityList, setActivityList] = useState(itinerary.allMyActivities.map(activity=> (<li key={activity.id}>{activity.toString()}</li>)))

    const onDueActivities = () => {
        setActivityList(itinerary.getDueActivities().map(activity=> (<li key={activity.id}>{activity.toString()}</li>)))
    }

    const onCompletedActivities = () => {
        setActivityList(itinerary.getCompletedActivities().map(activity=> (<li key={activity.id}>{activity.toString()}</li>)))
    }

    const onTodayActivities = () => {
        setActivityList(itinerary.getTodayActivities().map(activity=> (<li key={activity.id}>{activity.toString()}</li>)))
    }

    const onAllActivities = () => {
        setActivityList(itinerary.allMyActivities.map(activity=> (<li key={activity.id}>{activity.toString()}</li>)))
    }

    const onRevertEditing = () => {
        itinerary.revertEditing();
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

        itinerary.addActivity(activity.title, activity.destination, new Date(activity.date + ' ' + activity.time))
        itinerary.save();
        itinerary.sortActivitiesByDate();
        console.log(itinerary.allMyActivities.length)
        onAllActivities()
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
                    <input type="button" onClick={() => onDueActivities()} value="Due"/>
                    <input type="button" onClick={() => onCompletedActivities()} value="All Completed Activities"/>
                    <input type="button" onClick={() => onTodayActivities()} value="Today"/>

                    <input type="button" onClick={() => onAllActivities()} value="All Activities"/>
                </div>

                <div>
                    <input type="button" onClick={() => onRevertEditing()} value="Undo"/>
                </div>

                <div className="displayActivities">
                    <ul style={{listStyle: 'none'}}>
                        {activityList}
                    </ul>
                </div>


        </div>
    );
};

export default ItineraryComponent;
