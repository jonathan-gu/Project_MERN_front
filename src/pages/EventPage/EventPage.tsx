import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Event from "../../models/event";
import "./EventPage.css"

const EventPage = () => {
    const id = useParams().id;

    const [event, setEvent] = useState<Event | null>(null)

    useEffect(() => {
        async function getEvent () {
            try {
                const response = await fetch(`http://localhost:8080/event/${id}`, { credentials: 'include' });
                const responseData = await response.json();
                if (responseData.payload) {
                    const eventGet = new Event(responseData.payload._id, responseData.payload.title, responseData.payload.description, responseData.payload.city, responseData.payload.date, responseData.payload.type, responseData.payload.users);
                    setEvent(eventGet);
                } else {
                    console.error("Payload is undefined or not an array");
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }
        getEvent()
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
        <Card className="event">
            {/* <CardMedia component="img" alt="green iguana" height="140" /> */}
            <div className="backgroundEvent"></div>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                {event !== null ? event.title : ""}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {event !== null ? event.description : ""}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Ville : {event !== null ? event.city : ""}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Type : {event !== null ? event.type : ""}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Date : {event !== null ? formatDate(event.date) : ""}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default EventPage;