import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Event from "../../models/event";
import "./EventPage.css"
import Authentication from "../../utils/authentication";

interface EventPageProps {
    authentication: Authentication;
}

const EventPage: React.FC<EventPageProps> = ({ authentication }) => {
    const navigate = useNavigate();
    const id = useParams().id;

    const [event, setEvent] = useState<Event | null>(null)

    useEffect(() => {
        const isConnected = authentication.isConnected();

        if (!isConnected) {
            navigate("/login")   
        }

        async function getEvent () {
            try {
                const response = await fetch(`http://localhost:8080/event/${id}`, { credentials: 'include' });
                const responseData = await response.json();
                if (responseData.payload) {
                    const eventGet = new Event(responseData.payload._id, responseData.payload.title, responseData.payload.description, responseData.payload.city, responseData.payload.date, responseData.payload.type, responseData.payload.link, responseData.payload.owner, responseData.payload.subscriber);
                    console.log(eventGet)
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
                <Typography variant="body2" color="text.secondary">
                    Nombre de participants : {event !== null ? event.subscriber.length : ""}
                </Typography>
                {/* {event !== null ? event.link.forEach(aLink => (
                        <Typography component="a" href={aLink} variant="body2" color="text.secondary">
                            Nombre de participants : {event !== null ? event.subscriber.length : ""}
                        </Typography>
                    )) : ""
                } */}
            </CardContent>
        </Card>
    )
}

export default EventPage;