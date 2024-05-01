import { Box, Button, Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Event from "../../models/event";
import "./HomePage.css"
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
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

const HomePage = () => {
    const [events, setEvents] = useState<Event[]>([])
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [sortBy, setSortBy] = useState<string>('');
    const [open, setOpen] = useState(false);

    const handleOpen = (eventToDelete: Event) => {
        setSelectedEvent(eventToDelete);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const [openConfirmation, setOpenConfirmation] = useState(false);

    const handleOpenConfirmation = () => {
        handleClose()
        setOpenConfirmation(true);
    }

    const handleCloseConfirmation = () => setOpenConfirmation(false);

    useEffect(() => {
        async function getEvents () {
            try {
                const response = await fetch("http://localhost:8080/event");
                const responseData = await response.json();
                if (responseData.payload && Array.isArray(responseData.payload)) {
                    const eventsGet: Event[] = responseData.payload.map((event: any) => {
                        return new Event(event._id, event.title, event.description, event.city, event.date, event.type, event.users);
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
            sortedEvents.sort((a, b) => a.users.length - b.users.length);
        }
        setEvents(sortedEvents);
    };

    const handleOnDelete = async (eventToDelete: Event | null) => {
        if (eventToDelete !== null) {
            try {
                const response = await fetch(`http://localhost:8080/event/${eventToDelete._id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    const updatedEvents = events.filter((evt) => evt._id !== eventToDelete._id);
                    setEvents(updatedEvents);
                    handleClose();
                    handleOpenConfirmation();
                } else {
                    console.error('La suppression de l\'événement a échoué.');
                }
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'événement :', error);
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
                        <CardActions className="cardActions">
                            <Button component={Link} to={"/event/" + event._id} size="small">Plus d'informations</Button>
                            <Button onClick={() => handleOpen(event)} size="small"><DeleteIcon className="trash" /></Button>
                        </CardActions>
                    </Card>
                )}
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography className="titleModal" id="modal-modal-title" variant="h5" component="h2">
                        Suppression de l'événement
                    </Typography>
                    <CancelIcon className="cancel"/>
                    <Typography className="message" id="modal-modal-description" sx={{ mt: 2 }}>
                        Confirmez-vous la suppresion de l'événement ?
                    </Typography>
                    <CardActions className="buttonsModal">
                        <Button className="buttonModal buttonTrue" onClick={() => handleOnDelete(selectedEvent)} size="medium">Oui</Button>
                        <Button className="buttonModal buttonFalse" onClick={handleClose} size="medium">Non</Button>
                    </CardActions>
                </Box>
            </Modal>
            <Modal
                open={openConfirmation}
                onClose={handleCloseConfirmation}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography className="titleModal" id="modal-modal-title" variant="h5" component="h2">
                        Suppression de l'événement
                    </Typography>
                    <CheckCircleOutlineIcon className="check"/>
                    <Typography className="message" id="modal-modal-description" sx={{ mt: 2 }}>
                        Lévénement a bien été supprimé
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default HomePage;