import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Event from "../../models/event";
import "./EventPage.css"
import Authentication from "../../utils/authentication";
import User from "../../models/user";

interface EventPageProps {
    authentication: Authentication;
}

const EventPage: React.FC<EventPageProps> = ({ authentication }) => {
    const navigate = useNavigate();
    const id = useParams().id;

    const [event, setEvent] = useState<Event | null>(null)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const isConnected = authentication.isConnected();

        if (!isConnected) {
            navigate("/login")   
        }

        async function getEvent () {
            try {
                const response = await fetch(`http://localhost:8080/api/event/${id}`, { credentials: 'include' });
                const responseData = await response.json();
                if (responseData.payload) {
                    const eventGet = new Event(responseData.payload._id, responseData.payload.title, responseData.payload.description, responseData.payload.city, responseData.payload.date, responseData.payload.type, responseData.payload.link, responseData.payload.owner, responseData.payload.subscriber);
                    setEvent(eventGet);
                    // console.log(responseData.payload)
                    // const responseUser = await fetch(`http://localhost:8080/api/user/${responseData.payload.owner}`, { credentials: 'include' });
                    // const responseUserData = await responseUser.json();
                    // console.log(responseUserData)
                    // const userGet = new User(responseUser.payload._id, responseUser.payload.firstName, responseUser.payload.lastName, responseUser.payload.email, responseUser.payload.role, responseUser.payload._id);
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
                {/* <Typography variant="body2" color="text.secondary">
                    Organisateur : {event !== null ? formatDate(event.date) : ""}
                </Typography> */}
                <Typography variant="body2" color="text.secondary">
                    Nombre de participants : {event !== null ? event.subscriber.length : ""}
                </Typography>
                {event !== null ? event.link.map((aLink, index) => (
                    <Typography className="link" key={index} component="a" href={aLink.toString()} variant="body2" color="text.secondary">
                        {aLink}
                    </Typography>
                )) : ""}

            </CardContent>
        </Card>
    )
}

export default EventPage;