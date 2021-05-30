import React, {ChangeEvent, useState} from 'react';
import {IActivityUserInput} from "./Activity/IActivityUserInput";
import {Itinerary} from "./Itinerary";
import {Activity} from "./Activity/Activity";

function ItineraryComponent(props: {itinerary: Itinerary}) {
    // State setup
    const [activity, setActivity] = useState({
        title: "",
        destination: "",
        date: "",
        time: ""
    } as IActivityUserInput)

    const [editActivity, setEditActivity] = useState({
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

    const onEditTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value.trim());
        setEditActivity({...editActivity, title: event.target.value.trim()})
    }

    const onEditDestinationChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEditActivity({...editActivity, destination: event.target.value.trim()})
    }

    const onEditDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEditActivity({...editActivity, date: event.target.value})
    }

    const onEditTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEditActivity({...editActivity, time: event.target.value})
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

    const [activityIdInEditMode, setActivityIdInEditMode] = useState(-1)
    const activityListItem = (activity: Activity) => {
        let showEdit = null
        if (activityIdInEditMode === activity.id) {
            showEdit = <div>
                <p>EDIT:</p>
                <label htmlFor="editTitle">Title</label>
                <input id="editTitle" type="text" value={editActivity.title} onChange={(event: ChangeEvent<HTMLInputElement>) => onEditTitleChange(event)}/>

                <label htmlFor="editDest">Destination</label>
                <input id="editDest" type="text" value={editActivity.destination} onChange={(event: ChangeEvent<HTMLInputElement>) => onEditDestinationChange(event)}/>

                <label htmlFor="editDate">Date</label>
                <input id="editDate" type="date" value={editActivity.date} onChange={(event: ChangeEvent<HTMLInputElement>) => onEditDateChange(event)}/>

                <label htmlFor="editTime">Time</label>
                <input id="editTime" type="time" value={editActivity.time} onChange={(event: ChangeEvent<HTMLInputElement>) => onEditTimeChange(event)}/>

                <input type="button" onClick={() => onCancelEdit()} value="Cancel"/>
                <input type="button" onClick={() => onSaveEdit(editActivity, activity.id)} value="Save"/>
            </div>
        }

        return <li key={activity.id}>
            {activity.toString()}
            {activityIdInEditMode !== activity.id ?
                <input className="edit" type="button"
                       onClick={() => onEditActivity(activity)} value="Edit"/> :
                null}
            <input type="button" onClick={() => onDeleteActivity(activity.id)} value="Delete"/>
            {activity.completed? null : <input type="button" onClick={() => onCompleteActivity(activity.id)} value="Complete"/>}
            {showEdit}
        </li>
    }


    const [displayedActivities, setDisplayedActivities] = useState(props.itinerary.allMyActivities)

    const onDueActivities = () => {
        setDisplayedActivities([...props.itinerary.getDueActivities()])
    }

    const onCompletedActivities = () => {
        setDisplayedActivities([...props.itinerary.getCompletedActivities()])
    }

    const onTodayActivities = () => {
        setDisplayedActivities([...props.itinerary.getTodayActivities()])
    }

    const onAllActivities = () => {
        setDisplayedActivities([...props.itinerary.allMyActivities])
    }

    const onActiveActivities = () => {
        setDisplayedActivities([...props.itinerary.getActiveActivities()])
    }
    const onRevertEditing = () => {
        props.itinerary.revertEditing();
        onAllActivities()
    }

    const onAddActivity = (id?: number) => {
        if (!activity.title) {
            alert("Title is missing.")
            return
        } else if (!activity.destination) {
            alert("Destination is missing.")
            return
        } else if (!activity.date) {
            alert("Date is missing.")
            return
        } else if (!activity.time) {
            alert("Time is missing.")
            return
        }

        props.itinerary.addActivity(activity.title, activity.destination, new Date(activity.date + ' ' + activity.time))
        props.itinerary.sortActivitiesByDate();
        onAllActivities()
    }

    const onEditActivity = (activity: Activity) => {
        let day = activity.date.getDate().toString()
        if (day.length === 1) {
            day = '0' + day
        }
        let month = (activity.date.getMonth() + 1).toString()
        if (month.length === 1) {
            month = '0' + month
        }
        const date = `${activity.date.getFullYear()}-${month}-${day}`

        const {title, destination} = activity

        setActivityIdInEditMode(activity.id)
        setEditActivity({title, destination, date, time: activity.date.toLocaleTimeString()})
    }

    const onCancelEdit = () => setActivityIdInEditMode(-1)

    const onSaveEdit = (activity: IActivityUserInput, id: number) => {
        const {title, destination, date, time} = activity
        props.itinerary.editing(new Activity(id,title,destination,new Date(date + ' ' + time)), false)
        onAllActivities()
        setActivityIdInEditMode(-1)
    }

    const onCompleteActivity = (activityId: number) => {
        props.itinerary.setCompleted(activityId)
        onAllActivities()
    }

    const onDeleteActivity = (activityId: number) => {
        props.itinerary.removeActivity(activityId)
        onAllActivities()
    }

    const [showDateRange, setShowDateRange] = useState(false)
    const onActivitiesLeft = () => {
        setShowDateRange(!showDateRange)
    }

    const[activitiesLeftFilter, setActivitiesLeftFilter] = useState({fromDate: "", fromTime: "", toDate: "", toTime: ""})
    const onFromDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setActivitiesLeftFilter({...activitiesLeftFilter, fromDate: event.target.value})
    }
    const onFromTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setActivitiesLeftFilter({...activitiesLeftFilter, fromTime: event.target.value})
    }
    const onToDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setActivitiesLeftFilter({...activitiesLeftFilter, toDate: event.target.value})
    }
    const onToTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setActivitiesLeftFilter({...activitiesLeftFilter, toTime: event.target.value})
    }

    const [leftActivitiesCount, setLeftActivitiesCount] = useState(0)
    const onSearch = () => {
        const {fromDate, fromTime, toDate, toTime} = activitiesLeftFilter
        const total = props.itinerary.getNumberOfActivitiesLeftToBeDoneForCertainDates(fromDate, fromTime, toDate, toTime)
        setLeftActivitiesCount(total)
    }

    const currentDateString = ()=>{
        const newDate = new Date()
        let day = newDate.getDate().toString()
        if (day.length === 1) {
            day = '0' + day
        }
        let month = (newDate.getMonth() + 1).toString()
        if (month.length === 1) {
            month = '0' + month
        }
        const date = `${newDate.getFullYear()}-${month}-${day}`
        return date;
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
                       value={activity.date || currentDateString()}/>
                <label htmlFor="time">Time</label>
                <input id="time" type="time" onChange={(event: ChangeEvent<HTMLInputElement>) => onTimeChange(event)}
                       value={activity.time || new Date().toLocaleTimeString()}/>
            </div>

            <div>
                <input type="button" onClick={() => onAddActivity()} value="Add"/>
                <input type="button" onClick={() => onDueActivities()} value="Due"/>
                <input type="button" onClick={() => onCompletedActivities()} value="All Completed Activities"/>
                <input type="button" onClick={() => onTodayActivities()} value="Today"/>
                <input type="button" onClick={() => onActiveActivities()} value="Active Activities"/>

                <input type="button" onClick={() => onAllActivities()} value="All Activities"/>
            </div>

            <div>
                <input type="button"  onClick={() => onRevertEditing()} value="Undo Editing"/>
            </div>

            <div className="displayActivities">
                <ul style={{listStyle: 'none'}}>
                    {displayedActivities.map(activityListItem)}
                </ul>
            </div>

            <div>
                <input type="button"  onClick={() => onActivitiesLeft()} value="How many activities left?"/>
                {showDateRange?
                    <div>
                        <label htmlFor="fromDate">From Date</label>
                        <input id="fromDate" type="date" onChange={(event: ChangeEvent<HTMLInputElement>) => onFromDateChange(event)}/>

                        <label htmlFor="fromTime">From Time</label>
                        <input id="fromTime" type="time" onChange={(event: ChangeEvent<HTMLInputElement>) => onFromTimeChange(event)}/>

                        <label htmlFor="toDate">To Date</label>
                        <input id="toDate" type="date" onChange={(event: ChangeEvent<HTMLInputElement>) => onToDateChange(event)}/>

                        <label htmlFor="toTime">To Time</label>
                        <input id="toTime" type="time" onChange={(event: ChangeEvent<HTMLInputElement>) => onToTimeChange(event)}/>

                        <input type="button"  onClick={() => onSearch()} value="Search"/>
                        <div>
                            {leftActivitiesCount} left
                        </div>
                    </div> : null}
            </div>
        </div>
    );
};

export default ItineraryComponent;
