
export interface RawActivity {
    id: string;
    name: string;
    description: string;
    start: string;
    end: string;
    location: string;
}

export interface Activity {
    id: string;
    name: string;
    description: string;
    start: Date;
    end: Date;
    location: string;
}