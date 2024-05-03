import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import { NavLink, redirect, useNavigate } from "react-router-dom";

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

const RegistrationForm = () => {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "USER",
        subscribedEvent: [],
        eventHeld: []
    });

    const [openErrorForm, setOpenErrorForm] = useState(false);

    const handleOpenErrorForm = () => setOpenErrorForm(true);

    const handleCloseErrorForm = () => setOpenErrorForm(false);

    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string | undefined; value: string; }>) => {
        const { name, value } = e.target;
    
        setFormData({ ...formData, [name!]: value as string });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                navigate("/login");
            } else {
                handleOpenErrorForm()
            }
        } catch (error) {
            console.error("Erreur lors de la requête :", error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1>Inscription</h1>
                <div className="fields">
                    <TextField className="field" required id="outlined-required" label="Prénom" name="firstName" placeholder="Veuillez saisir votre prénom" onChange={handleChange} value={formData.firstName} />
                    <TextField className="field" required id="outlined-required" label="Nom" name="lastName" placeholder="Veuillez saisir votre nom" onChange={handleChange} value={formData.lastName} />
                    <TextField className="field" required id="outlined-required" label="Email" name="email" placeholder="Veuillez saisir votre email" onChange={handleChange} value={formData.email} type="email" />
                    <TextField className="field" required id="outlined-required" label="Mot de passe" name="password" placeholder="Veuillez saisir votre mot de passe" type="password" onChange={handleChange} value={formData.password} />
                </div>
                <div className="button">
                    <Button variant="contained" type="submit">Inscription</Button>
                </div>
                <Typography className="linkAuth" variant="h6" component="a" href='/login'>
                    Vous avez déjà un compte ? Connectez-vous
                </Typography>
            </form>
            <Modal
                open={openErrorForm}
                onClose={handleCloseErrorForm}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography className="titleModal" id="modal-modal-title" variant="h5" component="h2">
                        Inscription
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

export default RegistrationForm;