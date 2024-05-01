import { TextField, FormControl, InputLabel, MenuItem, Select, Button, SelectChangeEvent } from "@mui/material";
import "./FormAddEvent.css"
import { ChangeEvent, FormEvent, useState } from "react";

const FormAddEvent = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        city: "",
        date: "",
        type: "",
        users: [],
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string | undefined; value: unknown; }>) => {
        const { name, value } = e.target;
        console.log({ name, value })
        setFormData({ ...formData, [name!]: value as string });
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        setFormData({ ...formData, type: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        console.log(formData)
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log("Événement ajouté avec succès !");
            } else {
                console.error("Erreur lors de l'ajout de l'événement");
            }
        } catch (error) {
            console.error("Erreur lors de la requête :", error);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <h1>Ajouter un événement</h1>
            <div className="fields">
                <TextField className="field" required id="outlined-required" label="Titre" name="title" placeholder="Ajouter un titre" onChange={handleChange} />
                <TextField className="field" required id="outlined-required" label="Description" name="description" placeholder="Ajouter une description" onChange={handleChange} />
                <TextField className="field" required id="outlined-required" label="Ville" name="city" placeholder="Ajouter une ville" onChange={handleChange} />
                <TextField className="field" required id="outlined-required" type="date" name="date" onChange={handleChange} />
                <FormControl className="field">
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Age" onChange={handleSelectChange} >
                        <MenuItem value="CONFERENCE">Conférence</MenuItem>
                        <MenuItem value="CONCERT">Concert</MenuItem>
                        <MenuItem value="PRIVATE MEETING">Réunion privée</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="button">
                <Button variant="contained" type="submit">Ajouter</Button>
            </div>
        </form>
    )
}

export default FormAddEvent;