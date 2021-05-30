import React from 'react';
import './App.css';
import ItineraryComponent from "./Itinerary/Itinerary.component";
import {Itinerary} from "./Itinerary/Itinerary";
import {Activity} from "./Itinerary/Activity/Activity";

function App() {
    const itinerary = new Itinerary();
    const loadLocalStorage = () => {
        const activities = itinerary.load()
        activities.forEach((activity: Activity) => {
            itinerary.addActivity(activity.title, activity.destination, new Date(activity.date))
        })
    }

    loadLocalStorage();
    return (
        <div className="App">
            <ItineraryComponent itinerary={itinerary}/>
        </div>
    );
}

export default App;
