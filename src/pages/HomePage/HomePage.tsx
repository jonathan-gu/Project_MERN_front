import { Box, Button, Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Event from "../../models/event";
import "./HomePage.css"
import { Link, useNavigate } from "react-router-dom";
import Authentication from "../../utils/authentication";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    p: 4,
};

interface HomePageProps {
    authentication: Authentication;
}

const HomePage: React.FC<HomePageProps> = ({ authentication }) => {
    const navigate = useNavigate();

    const [events, setEvents] = useState<Event[]>([])
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [sortBy, setSortBy] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [openRemove, setOpenRemove] = useState(false);
    const handleClose = () => setOpen(false);
    const handleCloseRemove = () => setOpenRemove(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);

    const handleOpen = (eventToPartipate: Event) => {
        setSelectedEvent(eventToPartipate);
        setOpen(true);
    };

    const handleOpenRemove = (eventToPartipate: Event) => {
        setSelectedEvent(eventToPartipate);
        setOpenRemove(true);
    };

    const handleOpenConfirmation = () => {
        handleClose()
        setOpenConfirmation(true);
    }

    const handleCloseConfirmation = () => setOpenConfirmation(false);

    useEffect(() => {
        const isConnected = authentication.isConnected();

        if (!isConnected) {
            navigate("/login")   
        }

        async function getEvents () {
            try {
                const response = await fetch("http://localhost:8080/api/event", { credentials: 'include' });
                const responseData = await response.json();
                if (responseData.payload && Array.isArray(responseData.payload)) {
                    const eventsGet: Event[] = responseData.payload.map((event: any) => {
                        return new Event(event._id, event.title, event.description, event.city, event.date, event.type, event.link, event.owner, event.subscriber);
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

    const formatDate = (date: Date | string): string => {
        if (typeof(date) == 'string') {
            date = new Date(date);
        }
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSortChange = (event: SelectChangeEvent<unknown>) => {
        setSortBy(event.target.value as string);
        sortEvents(event.target.value as string);
    };

    const sortEvents = (sortBy: string) => {
        const sortedEvents = [...events];
        if (sortBy === 'date') {
            sortedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } else if (sortBy === 'type') {
            sortedEvents.sort((a, b) => a.type.localeCompare(b.type.toString()));
        } else if (sortBy === 'popularity') {
            sortedEvents.sort((a, b) => a.subscriber.length - b.subscriber.length);
        }
        setEvents(sortedEvents);
    };

    const handleOnParticipate = async (eventToParticipate: Event | null) => {
        console.log(eventToParticipate)
        if (eventToParticipate !== null) {
            try {
                const userId = authentication.getUserId();
                if (userId) {
                    const response = await fetch(`http://localhost:8080/api/event/${eventToParticipate._id}`, {
                        method: 'PATCH',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: eventToParticipate.title,
                            description: eventToParticipate.description,
                            city: eventToParticipate.city,
                            date: eventToParticipate.date,
                            type: eventToParticipate.type,
                            subscriber: [...eventToParticipate.subscriber, userId]
                        }),
                        credentials: 'include'
                    });
                    if (response.ok) {
                        const participateEvents = events.filter((evt) => evt._id !== eventToParticipate._id);
                        const subscriber = [...eventToParticipate.subscriber, userId] as String[]
                        participateEvents.push({
                            _id: eventToParticipate._id,
                            title: eventToParticipate.title,
                            description: eventToParticipate.description,
                            city: eventToParticipate.city,
                            date: eventToParticipate.date,
                            type: eventToParticipate.type,
                            link: eventToParticipate.link,
                            owner: eventToParticipate.owner,
                            subscriber: subscriber
                        })
                        console.log(participateEvents)
                        setEvents(participateEvents);
                        handleClose();
                        handleOpenConfirmation();
                    } else {
                        console.error('La récupération de l\'événement a échoué.');
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'événement :', error);
            }
        }
    } 

    const handleOnNotParticipate = async (eventToRemove: Event | null) => {
        if (eventToRemove !== null) {
            try {
                const userId = authentication.getUserId();
                if (userId) {
                    const response = await fetch(`http://localhost:8080/api/event/${eventToRemove._id}`, {
                        method: 'PATCH',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: eventToRemove.title,
                            description: eventToRemove.description,
                            city: eventToRemove.city,
                            date: eventToRemove.date,
                            type: eventToRemove.type,
                            subscriber: eventToRemove.subscriber.filter((sub) => sub !== userId)
                        }),
                        credentials: 'include'
                    });
                    if (response.ok) {
                        const participateEvents = events.filter((evt) => evt._id !== eventToRemove._id);
                        const subscriber = eventToRemove.subscriber.filter((sub) => sub !== userId) as String[]
                        participateEvents.push({
                            _id: eventToRemove._id,
                            title: eventToRemove.title,
                            description: eventToRemove.description,
                            city: eventToRemove.city,
                            date: eventToRemove.date,
                            type: eventToRemove.type,
                            link: eventToRemove.link,
                            owner: eventToRemove.owner,
                            subscriber: subscriber
                        })
                        setEvents(participateEvents);
                        handleCloseRemove();
                        handleOpenConfirmation();
                    } else {
                        console.error('La récupération de l\'événement a échoué.');
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'événement :', error);
            }
        }
    } 

    return (
        <>
            <FormControl className="select">
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Age" onChange={handleSortChange}>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="type">Type</MenuItem>
                    <MenuItem value="popularity">Popularity</MenuItem>
                </Select>
            </FormControl>
            <div className="events">
                {events.map((event, index) =>
                    <Card className="card" key={index} sx={{ maxWidth: 345 }}>
                        {/* <CardMedia component="img" alt="green iguana" height="140" /> */}
                        <div className="background"></div>
                        <CardContent>
                            <Typography className="cardTitle" gutterBottom component="div">
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
                        <CardActions className="cardActions">
                            <Button component={Link} to={"/event/" + event._id} size="small">Plus d'informations</Button>
                            {event.subscriber.filter((sub) => sub === authentication.getUserId()).length === 0
                                ? 
                                <Button onClick={() => handleOpen(event)} size="small">Partiper</Button>
                                :
                                <Button onClick={() => handleOpenRemove(event)} size="small">Ne pas partiper</Button>
                            }
                        </CardActions>
                    </Card>
                )}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography className="titleModal" id="modal-modal-title" variant="h5" component="h2">
                            Participation à l'événement
                        </Typography>
                        <Typography className="message" id="modal-modal-description" sx={{ mt: 2 }}>
                            Confirmez-vous votre participation à l'événement ?
                        </Typography>
                        <CardActions className="buttonsModal">
                            <Button className="buttonModal buttonTrue" onClick={() => handleOnParticipate(selectedEvent)} size="medium">Oui</Button>
                            <Button className="buttonModal buttonFalse" onClick={handleClose} size="medium">Non</Button>
                        </CardActions>
                    </Box>
                </Modal>
                <Modal
                    open={openRemove}
                    onClose={handleCloseRemove}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography className="titleModal" id="modal-modal-title" variant="h5" component="h2">
                            Participation à l'événement
                        </Typography>
                        <Typography className="message" id="modal-modal-description" sx={{ mt: 2 }}>
                            Confirmez-vous ne plus vouloir participer à l'événement ?
                        </Typography>
                        <CardActions className="buttonsModal">
                            <Button className="buttonModal buttonTrue" onClick={() => handleOnNotParticipate(selectedEvent)} size="medium">Oui</Button>
                            <Button className="buttonModal buttonFalse" onClick={handleClose} size="medium">Non</Button>
                        </CardActions>
                    </Box>
                </Modal>
            </div>
            <Modal
                open={openConfirmation}
                onClose={handleCloseConfirmation}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography className="titleModal" id="modal-modal-title" variant="h5" component="h2">
                        Participation à l'événement
                    </Typography>
                    <CheckCircleOutlineIcon className="check"/>
                    <Typography className="message" id="modal-modal-description" sx={{ mt: 2 }}>
                        Vous être inscrit à l'événement
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default HomePage;