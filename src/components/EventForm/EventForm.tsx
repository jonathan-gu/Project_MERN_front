import { TextField, FormControl, InputLabel, MenuItem, Select, Button, SelectChangeEvent } from "@mui/material";
import "./EventForm.css"
import { ChangeEvent, FormEvent, SetStateAction, useState } from "react";

interface EventFormProps {
    isNew?: boolean;
    handleOpenConfirmation: () => void;
    handleOpenErrorForm: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ isNew = true, handleOpenConfirmation, handleOpenErrorForm }) => {
    let title = "Ajouter une événment";

    if (!isNew) {
        title = "Modifier un événement";
    }

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        city: "",
        date: "",
        type: "",
        link: [String] || null,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string | undefined; value: unknown; }>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name!]: value as string });
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        setFormData({ ...formData, type: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData)
        setFormData({ ...formData, "date": new Date(formData.date).toString() });
        console.log(formData)
        try {
            const response = await fetch("http://localhost:8080/event", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                handleOpenConfirmation()
                console.log("Événement ajouté avec succès !");
            } else {
                handleOpenErrorForm()
                console.error("Erreur lors de l'ajout de l'événement");
            }
        } catch (error) {
            console.error("Erreur lors de la requête :", error);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <h1>{title}</h1>
            
            <div className="fields">
                <TextField className="field" required id="outlined-required" label="Titre (lettres et chiffres, 5 - 200 caractères)" name="title" placeholder="Ajouter un titre" onChange={handleChange} value={formData.title} />
                <TextField className="field" required id="outlined-required" label="Description (lettres et chiffres, 20 - 2000 caractères)" name="description" placeholder="Ajouter une description" onChange={handleChange} value={formData.description} />
                <TextField className="field" required id="outlined-required" label="Ville (lettres et chiffres)" name="city" placeholder="Ajouter une ville" onChange={handleChange} value={formData.city} />
                <TextField className="field" required id="outlined-required" type="date" name="date" onChange={handleChange} value={formData.date} />
                <FormControl className="field">
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Age" onChange={handleSelectChange} value={formData.type} >
                        <MenuItem value="CONFERENCE">Conférence</MenuItem>
                        <MenuItem value="CONCERT">Concert</MenuItem>
                        <MenuItem value="PRIVATE MEETING">Réunion privée</MenuItem>
                    </Select>
                </FormControl>
                <TextField className="field" required id="outlined-required" label="Lien (Optionnel)" name="link" placeholder="Ajouter des liens" onChange={handleChange} value={formData.link} />
            </div>
            <div className="button">
                <Button variant="contained" type="submit">Ajouter</Button>
            </div>
        </form>
    )
}

export default EventForm;