import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Event from "../../models/event";
import "./HomePage.css"

const HomePage = () => {
    const [events, setEvents] = useState<Event[]>([])

    useEffect(() => {
        async function getEvents () {
            try {
                const response = await fetch("http://localhost:8080/event");
                const responseData = await response.json();
                if (responseData.payload && Array.isArray(responseData.payload)) {
                    const eventsGet: Event[] = responseData.payload.map((event: any) => {
                        return new Event(event.title, event.description, event.city, event.date, event.type, event.users);
                    });
                    console.log(eventsGet)
                    setEvents(eventsGet);
                } else {
                    console.error("Payload is undefined or not an array");
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }
        getEvents()
    }, [])

    const formatDate = (date: Date | string): string => {
        if (typeof(date) == 'string') {
            date = new Date(date);
        }
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="events">
            {events.map((event, index) =>
                <Card className="card" key={index} sx={{ maxWidth: 345 }}>
                    {/* <CardMedia component="img" alt="green iguana" height="140" /> */}
                    <div className="background"></div>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Ville : {event.city}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Type : {event.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Date : {formatDate(event.date)}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Plus d'informations</Button>
                    </CardActions>
                </Card>
            )}
        </div>
    )
}

export default HomePage;