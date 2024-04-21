export interface Activity {
    name: string;
    description: string;
    start: Date;
    end: Date;
    location: string;
}
export default function ActivityCard({ start, end, name, location, description }: Activity): import("react/jsx-runtime").JSX.Element;
