export interface RawActivity {
    name: string;
    description: string;
    start: string;
    end: string;
    location: string;
}
export interface Activity {
    name: string;
    description: string;
    start: Date;
    end: Date;
    location: string;
}
