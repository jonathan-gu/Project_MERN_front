import { useState } from "react";
import EventForm from "../../components/EventForm/EventForm";
import { Box, Modal, Typography } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { useParams } from "react-router-dom";

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

const UpdateEventPage = () => {
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [openErrorForm, setOpenErrorForm] = useState(false);

    const handleOpenConfirmation = () => setOpenConfirmation(true);

    const handleCloseConfirmation = () => setOpenConfirmation(false);

    const handleOpenErrorForm = () => setOpenErrorForm(true);

    const handleCloseErrorForm = () => setOpenErrorForm(false);

    const eventId = useParams().id as string; 

    return (
        <>
            <EventForm isNew={false} handleOpenConfirmation={handleOpenConfirmation} handleOpenErrorForm={handleOpenErrorForm} eventId={eventId}/>
            <Modal
                open={openConfirmation}
                onClose={handleCloseConfirmation}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography className="titleModal" id="modal-modal-title" variant="h5" component="h2">
                        Modification de l'événement
                    </Typography>
                    <CheckCircleOutlineIcon className="check"/>
                    <Typography className="message" id="modal-modal-description" sx={{ mt: 2 }}>
                        L'événement a bien été modifié
                    </Typography>
                </Box>
            </Modal>
            <Modal
                open={openErrorForm}
                onClose={handleCloseErrorForm}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography className="titleModal" id="modal-modal-title" variant="h5" component="h2">
                        Modification de l'événement
                    </Typography>
                    <CancelIcon className="cancel"/>
                    <Typography className="message" id="modal-modal-description" sx={{ mt: 2 }}>
                        Erreur dans le formulaire
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default UpdateEventPage;