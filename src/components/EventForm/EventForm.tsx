import { TextField, FormControl, InputLabel, MenuItem, Select, Button, SelectChangeEvent } from "@mui/material";
import "./EventForm.css"
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Event from "../../models/event";

interface EventFormProps {
    isNew?: boolean;
    handleOpenConfirmation: () => void;
    handleOpenErrorForm: () => void;
    eventId?: string | null
}

const EventForm: React.FC<EventFormProps> = ({ isNew = true, handleOpenConfirmation, handleOpenErrorForm, eventId = null }) => {
    let title = "Ajouter une événment";
    let messageButton = "Ajouter";

    if (!isNew) {
        title = "Modifier un événement";
        messageButton = "Modifier";
    }

    const [date, setDate] = useState<Date | null>(null)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        city: "",
        date: "",
        type: "",
        imageName: null,
        link: null,
    });

    useEffect(() => {
        if (!isNew && eventId !== null) {
            async function getEvent () {
                try {
                    const response = await fetch(`http://localhost:8080/event/${eventId}`);
                    const responseData = await response.json();
                    if (responseData.payload) {
                        console.log(responseData.payload)
                        const eventGet = new Event(responseData.payload._id, responseData.payload.title, responseData.payload.description, responseData.payload.city, responseData.payload.date, responseData.payload.type, responseData.payload.users);
                        setDate(new Date(eventGet.date))
                        setFormData({
                            title: eventGet.title.toString(),
                            description: eventGet.description.toString(),
                            city: eventGet.city.toString(),
                            date: eventGet.date.toString(),
                            type: eventGet.type.toString(),
                            imageName: null,
                            link: null,
                        })
                    } else {
                        console.error("Payload is undefined or not an array");
                    }
                } catch (error) {
                    console.error("Error fetching events:", error);
                }
            }
            getEvent()
        }
    }, [])

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string | undefined; value: string; }>) => {
        const { name, value } = e.target;
    
        const isValidDate = /^(\d{4})-(\d{2})-(\d{2})$/.test(value);
        if (name === "date" && !isValidDate) {
            return;
        }
    
        setFormData({ ...formData, [name!]: value as string });
        if (name === "date") {
            setDate(new Date(value));
        }
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        setFormData({ ...formData, type: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isNew) {
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
                } else {
                    handleOpenErrorForm()
                }
            } catch (error) {
                console.error("Erreur lors de la requête :", error);
            }
        } else {
            try {
                const response = await fetch(`http://localhost:8080/event/${eventId}`, {
                    method: "PATCH",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    handleOpenConfirmation()
                } else {
                    handleOpenErrorForm()
                }
            } catch (error) {
                console.error("Erreur lors de la requête :", error);
            }
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <h1>{title}</h1>
            
            <div className="fields">
                <TextField className="field" required id="outlined-required" label="Titre (lettres et chiffres, 5 - 200 caractères)" name="title" placeholder="Ajouter un titre" onChange={handleChange} value={formData.title} />
                <TextField className="field" required id="outlined-required" label="Description (lettres et chiffres, 20 - 2000 caractères)" name="description" placeholder="Ajouter une description" onChange={handleChange} value={formData.description} />
                <TextField className="field" required id="outlined-required" label="Ville (lettres et chiffres)" name="city" placeholder="Ajouter une ville" onChange={handleChange} value={formData.city} />
                <TextField className="field" required id="outlined-required" type="date" name="date" onChange={handleChange} value={date ? date.toISOString().substr(0, 10) : ""} />
                <FormControl className="field">
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Age" onChange={handleSelectChange} value={formData.type} >
                        <MenuItem value="CONFERENCE">Conférence</MenuItem>
                        <MenuItem value="CONCERT">Concert</MenuItem>
                        <MenuItem value="PRIVATE MEETING">Réunion privée</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="button">
                <Button variant="contained" type="submit">{messageButton}</Button>
            </div>
        </form>
    )
}

export default EventForm;