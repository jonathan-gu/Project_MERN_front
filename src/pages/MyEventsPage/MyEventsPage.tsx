import { Box, Button, Card, CardActions, CardContent, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Event from "../../models/event";
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from "react-router-dom";
import Authentication from "../../utils/authentication";

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

const MyEventsPage: React.FC<HomePageProps> = ({ authentication }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const isConnected = authentication.isConnected();

        if (!isConnected) {
            navigate("/login")   
        }
    }, [])

    const [events, setEvents] = useState<Event[]>([])
    const [open, setOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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

    const formatDate = (date: Date | string): string => {
        if (typeof(date) == 'string') {
            date = new Date(date);
        }
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleOnDelete = async (eventToDelete: Event | null) => {
        if (eventToDelete !== null) {
            try {
                const response = await fetch(`http://localhost:8080/event/${eventToDelete._id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (response.ok) {
                    const deletedEvents = events.filter((evt) => evt._id !== eventToDelete._id);
                    setEvents(deletedEvents);
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
            <div className="events">
                {events.map((event, index) =>
                    <>
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
                                <div>
                                    <Button component="a" href={"/updateEvent/" + event._id} size="small"><EditIcon className="icon" /></Button>
                                    <Button onClick={() => handleOpen(event)} size="small"><DeleteIcon className="icon" /></Button>
                                </div>
                            </CardActions>
                        </Card>
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
                                    L'événement a bien été supprimé
                                </Typography>
                            </Box>
                        </Modal>
                    </>
                )}
            </div>
        </>
    )
}

export default MyEventsPage;