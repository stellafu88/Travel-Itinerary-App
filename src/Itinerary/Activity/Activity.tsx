// FEATURE 2. Add a part

export class Activity {
    id: number;
    title: string;
    destination: string;
    date: Date;
    completed: boolean;

    constructor(newId: number, newTitle: string, newDestination: string, newDate: Date) {
        this.id = newId
        this.title = newTitle
        this.destination = newDestination
        this.date = newDate
        this.completed = false // FEATURE 13. Provide default values
    }

    setCompleted(): void {
        this.completed = true;
    }

    // FEATURE 11. A calculation within a part
    isDue(): boolean {
        if (new Date().getTime() > this.date.getTime()) {
            return true;
        }
        return false;
    }

    // FEATURE 11. A calculation within a part
    isToday(): boolean {
        if (new Date().toDateString() === this.date.toDateString()) {
            return true;
        }
        return false;
    }

    toString(): string {
        return `${this.title} in ${this.destination} on ${this.date.getFullYear()}-${this.date.getMonth() + 1}-${this.date.getDate()} at ${this.date.getHours()}:${this.date.getMinutes()}`
    }
}