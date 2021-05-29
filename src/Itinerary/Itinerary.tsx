import {Activity} from "./Activity/Activity";

// FEATURE 13. Provide default values

const STORAGE_KEY = 'myTravelItinerary'



// FEATURE 1. Create a whole that acts as a Facade for parts

export class Itinerary { // eslint-disable-line no-unused-vars

    currentActivityId: number;
    allMyActivities: Activity[];
    editedActivityCache: Activity | null

    constructor() {
        this.currentActivityId = 1;
        this.allMyActivities = [];
        this.editedActivityCache = null;
    }


    // FEATURE 2. Add a part

    addActivity(newTitle: string, newDestination: string, newDate: Date, id?: number): Activity | null {
        newTitle = newTitle.trim()
        newDestination = newDestination.trim()

        // FEATURE 10. Validate inputs

        if (!newTitle || !newDestination || !newDate) {
            return null;
        }

        // FEATURE 13. Provide default values

        let aNewActivity: Activity
        if (id) {
            aNewActivity = new Activity(id, newTitle, newDestination, newDate)
        } else {
            aNewActivity = new Activity(this.currentActivityId, newTitle, newDestination, newDate)
            this.currentActivityId++;
        }
        this.allMyActivities.push(aNewActivity)
        return aNewActivity; // ?
    }


    // FEATURE 12. A calculation across many parts

    setAllDone(): void {
        this.allMyActivities.forEach(function (activity: Activity) {
            activity.completed = true
        })
    }

    // FEATURE 12. A calculation across many parts (REVISED)
    // showRemainingCount() {
    //     if (this.getActiveActivities().length >= 2) {
    //         return `${this.getActiveActivities().length} activities left`
    //     } else {
    //         return `${this.getActiveActivities().length} activity left`
    //     }
    // }

    // FEATURE 12. A calculation across many parts (REVISED)

    getActivitiesBetween(fromDate: string, fromTime: string, toDate: string, toTime: string): Activity[] {
        //fromDate and toDate eg."03/25/2015"
        //fromTime and toTime eg."10:00"
        let from: Date;
        let to: Date;

        if (fromDate) {
            if (fromTime) {
                from = new Date(fromDate + " " + fromTime)
            } else {
                from = new Date(fromDate)
            }
        }
        if (toDate) {
            if (toTime) {
                to = new Date(toDate + " " + toTime)
            } else {
                to = new Date(toDate)
            }
        }

        const activityBetweenSelectedDateTime: Activity[] = this.allMyActivities.filter((activity: Activity): boolean => {
            const activityDateInMs = activity.date.getTime()
            const fromTimeInMs: number = from.getTime();
            const toTimeInMs: number = to.getTime();
            if (from && to) {
                return activityDateInMs >= fromTimeInMs && activityDateInMs <= toTimeInMs
            }
            if (from && activityDateInMs >= fromTimeInMs) {
                return true;
            }
            if (to && activityDateInMs <= toTimeInMs) {
                return true;
            }
            return false;
        })

        return activityBetweenSelectedDateTime.sort(function (a:Activity, b:Activity) {
            if (a.date.getTime() < b.date.getTime()) {
                return -1
            }
            if (a.date > b.date) {
                return 1
            } // a must be equal to b
            return 0
        });
    }

    // FEATURE 12. A calculation across many parts (REVISED)
    // How many activities left to be done

    getNumberOfActivitiesLeftToBeDoneForCertainDates(fromDate: string, fromTime: string, toDate: string, toTime: string): number {

        let numberOfActivitiesLeftToBeDone = 0;

        for (let anActivity of this.getActivitiesBetween(fromDate, fromTime, toDate, toTime)) {
            if (!anActivity.completed) {
                numberOfActivitiesLeftToBeDone++;
            }
        }
        return numberOfActivitiesLeftToBeDone;
    }

    // FEATURE 12. A calculation across many parts
    remaining(): number {
        return this.getActiveActivities().length
    }

    getAllDone(): boolean {
        return this.remaining() === 0
    }


    // FEATURE 12. A calculation across many parts
    // FEATURE 4. Filter parts

    getDueActivities(): Activity[] {
        return this.allMyActivities.filter(activity => activity.isDue())
    }

    // FEATURE 12. A calculation across many parts
    // FEATURE 4. Filter parts

    getTodayActivities(): Activity[] {
        return this.allMyActivities.filter(activity => activity.isToday())
    }

    // FEATURE 12. A calculation across many parts
    // FEATURE 4. Filter parts

    getActiveActivities(): Activity[] {
        return this.allMyActivities.filter(activity => !activity.completed)
    }

    // FEATURE 12. A calculation across many parts
    // FEATURE 4. Filter parts

    getCompletedActivities(): Activity[] {
        return this.allMyActivities.filter(activity => activity.completed)
    }

    // FEATURE 3. Sort parts: by title

    sortActivitiesByTitle(): void {
        this.allMyActivities.sort(function (a:Activity, b:Activity) {
            if (a.title < b.title) {
                return -1
            }
            if (a.title > b.title) {
                return 1
            } // a must be equal to b
            return 0
        })
    }

    // FEATURE 3. Sort parts:by id (REVISED)
    sortActivitiesById(): void {
        this.allMyActivities.sort(function (a:Activity, b:Activity) {
            if (a.id < b.id) {
                return -1
            }
            if (a.id > b.id) {
                return 1
            } // a must be equal to b
            return 0
        })
    }

    // FEATURE 3. Sort parts:by destination (REVISED)
    sortActivitiesByDestination(): void {
        this.allMyActivities.sort(function (a:Activity, b:Activity) {
            if (a.destination < b.destination) {
                return -1
            }
            if (a.destination > b.destination) {
                return 1
            } // a must be equal to b
            return 0
        })
    }

    // FEATURE 3. Sort parts:by date (REVISED)
    sortActivitiesByDate(): void {
        this.allMyActivities.sort(function (a:Activity, b:Activity) {
            if (a.date.getTime() < b.date.getTime()) {
                return -1
            }
            if (a.date > b.date) {
                return 1
            } // a must be equal to b
            return 0
        })
    }

    // FEATURE 14. Find a part given a search criterion
    // NOTE: finds only FIRST match!

    findActivityById(targetActivityId: number): Activity | undefined {
        return this.allMyActivities.find((activity: Activity) => activity.id === targetActivityId)
    }

    findActivityByTitle(targetActivityTitle: string): Activity | undefined {
        return this.allMyActivities.find((activity: Activity) => activity.title === targetActivityTitle)
    }

    setCompleted(activityId: number): void {
        this.findActivityById(activityId)?.setCompleted();
    }

    // FEATURE 5. Delete a selected part

    removeActivity(targetActivityId: number): Activity[] {
        const index = this.allMyActivities.findIndex((activity: Activity) => activity.id === targetActivityId)
        return this.allMyActivities.splice(index, 1)
    }

    // FEATURE 5. Delete a selected part

    removeCompleted(): void {
        this.allMyActivities = this.getActiveActivities()
    }

    //  FEATURE 6. Save all parts to LocalStorage

    save(): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.allMyActivities))
    }

    // FEATURE 7. Load all parts from LocalStorage

    load(): Activity[] {
        // FEATURE 13. Provide default values
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    }


    // FEATURE 8. Update/edit a part

    editing(updatedActivity: Activity, isUndo: boolean): void {
        // FEATURE 10. Validate inputs
        if (!updatedActivity.title || !updatedActivity.destination || !updatedActivity.date) {
            return
        }
        // const deletedActivities = this.removeActivity(updatedActivity.id);
        // const deletedActivity = deletedActivities[0];
        const [deletedActivity] = this.removeActivity(updatedActivity.id);//the deleted object - an array with one element

        // If undo is false, then the deleted activity will be saved as edited activity cache.
        // edited activity cache will be used to undo the previous editing
        // If undo is true, edited activity cache will be set to null, so that we cannot undo the undo.
        this.editedActivityCache = isUndo ? null : deletedActivity
        this.addActivity(updatedActivity.title, updatedActivity.destination, updatedActivity.date, updatedActivity.id)
        this.sortActivitiesByTitle()
    }


    // FEATURE 9. Discard /revert edits to a part
    revertEditing(): void {
        if (this.editedActivityCache) {
            this.editing(this.editedActivityCache, true)
        }
    }

    // FEATURE 15. Get all parts
    getAllActivities(): Activity[] {
        return this.allMyActivities
    }

}
