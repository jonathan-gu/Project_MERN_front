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

    return (
        <div className="events">
            {events.map((event) =>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia component="img" alt="green iguana" height="140" />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {event.description}
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