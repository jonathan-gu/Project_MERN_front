import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';

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

interface LoginPageProps {
    setIsConnected: (value: boolean) => void;
}

const Login: React.FC<LoginPageProps> = ({ setIsConnected }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const [openErrorForm, setOpenErrorForm] = useState(false);

    const handleOpenErrorForm = () => setOpenErrorForm(true);

    const handleCloseErrorForm = () => setOpenErrorForm(false);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                const payload = data.payload;
                localStorage.setItem("userId", payload.id)
                setIsConnected(true)
                navigate("/");
            }
            else {
                handleOpenErrorForm()
            }
            
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1>Connexion</h1>
                <div className="fields">
                    <TextField className="field" required id="outlined-required" label="Email" name="email" placeholder="Veuillez saisir votre email" onChange={(e) => setEmail(e.target.value)} value={email} type="email" />
                    <TextField className="field" required id="outlined-required" label="Mot de passe" name="password" placeholder="Veuillez saisir votre mot de passe" type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                </div>
                <div className="button">
                    <Button variant="contained" type="submit">Connexion</Button>
                </div>
            </form>
            <Modal
                open={openErrorForm}
                onClose={handleCloseErrorForm}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography className="titleModal" id="modal-modal-title" variant="h5" component="h2">
                        Connexion
                    </Typography>
                    <CancelIcon className="cancel"/>
                    <Typography className="message" id="modal-modal-description" sx={{ mt: 2 }}>
                        Erreur dans le formulaire
                    </Typography>
                </Box>
            </Modal>
        </>
    );
};

export default Login;
