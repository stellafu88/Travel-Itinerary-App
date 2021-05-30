export interface IActivity {
    id: number;
    title: string;
    destination: string;
    date: Date;
    completed: boolean;
    isEdit: boolean;
}