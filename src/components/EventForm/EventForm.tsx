import { TextField, FormControl, InputLabel, MenuItem, Select, Button, SelectChangeEvent, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import "./EventForm.css"
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Event from "../../models/event";
import User from "../../models/user";
import RemoveIcon from '@mui/icons-material/Remove';

interface EventFormProps {
    isNew?: boolean;
    handleOpenConfirmation: () => void;
    handleOpenErrorForm: () => void;
    eventId?: string | null
}

const EventForm: React.FC<EventFormProps> = ({ isNew = true, handleOpenConfirmation, handleOpenErrorForm, eventId = null }) => {
    let titleForm = "Ajouter une événment";
    let messageButton = "Ajouter";

    if (!isNew) {
        titleForm = "Modifier un événement";
        messageButton = "Modifier";
    }

    const [title, setTitle] = useState<String | null>(null)
    const [description, setDescription] = useState<String | null>(null)
    const [city, setCity] = useState<String | null>(null)
    const [type, setType] = useState<String | null>(null)
    const [link, setLink] = useState<String>("");
    const [date, setDate] = useState<Date | null>(null)
    const [subscribers, setSubscribers] = useState<User[]>([])
    const [subscribersFormData, setSubscribersFormData] = useState([])

    useEffect(() => {
        if (!isNew && eventId !== null) {
            async function getEvent () {
                try {
                    const response = await fetch(`http://localhost:8080/api/event/${eventId}`, { credentials: 'include' });
                    const responseData = await response.json();
                    if (responseData.payload) {
                        const eventGet = new Event(responseData.payload._id, responseData.payload.title, responseData.payload.description, responseData.payload.city, responseData.payload.date, responseData.payload.type, responseData.payload.link, responseData.payload.owner, responseData.payload.subscriber);
                        // console.log(responseData.payload.subscriber)
                        setTitle(eventGet.title)
                        setDescription(eventGet.description)
                        setCity(eventGet.city)
                        setDate(new Date(eventGet.date))
                        setType(eventGet.type)
                        setLink(eventGet.link[0])
                        setSubscribersFormData(eventGet.subscriber)
                        eventGet.subscriber.forEach(async sub => {
                            const responseUser = await fetch(`http://localhost:8080/api/user/${sub}`, { credentials: 'include' });
                            const responseUserData = await responseUser.json();
                            const user: User = new User(responseUserData.payload._id, responseUserData.payload.firstName, responseUserData.payload.lastName, responseUserData.payload.email, responseUserData.payload.password, responseUserData.payload.role, responseUserData.payload.events)
                            setSubscribers([...subscribers, user])
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
    
        if (name === "date") {
            setDate(new Date(value));
        }
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        setType(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isNew) {
            try {
                let response: Response;
                if (link === "") {
                    response = await fetch("http://localhost:8080/api/event", {
                        method: "POST",
                        credentials: 'include',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: title,
                            description: description,
                            city: city,
                            date: date,
                            type: type,
                            subscriber: subscribersFormData
                        })
                    });
                } else {
                    response = await fetch("http://localhost:8080/api/event", {
                        method: "PATCH",
                        credentials: 'include',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: title,
                            description: description,
                            city: city,
                            date: date,
                            type: type,
                            link: [link],
                            subscriber: subscribersFormData
                        })
                    });
                }
                if (response.ok) {
                    handleOpenConfirmation()
                } else {
                    handleOpenErrorForm()
                }
            } catch (error) {
                console.error("Erreur lors de la requête :", error);
            }
        } else {
            console.log(link)
            try {
                let response: Response;
                if (!link) {
                    console.log(1)
                    response = await fetch(`http://localhost:8080/api/event/${eventId}`, {
                        method: "PATCH",
                        credentials: 'include',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: title,
                            description: description,
                            city: city,
                            date: date,
                            type: type,
                            subscriber: subscribersFormData
                        })
                    });
                } else {
                    response = await fetch(`http://localhost:8080/api/event/${eventId}`, {
                        method: "PATCH",
                        credentials: 'include',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: title,
                            description: description,
                            city: city,
                            date: date,
                            type: type,
                            link: [link],
                            subscriber: subscribersFormData
                        })
                    });
                }
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

    const handleOnRemove = (subscriberId: String) => {
        const newSubscribers = subscribers.filter(subscriber => subscriber._id !== subscriberId)
        const newSubscribersFormData = subscribersFormData.filter(subscriber => subscriber !== subscriberId)
        setSubscribers(newSubscribers)
        setSubscribersFormData(newSubscribersFormData)
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1>{titleForm}</h1>
                
                <div className="fields">
                    <TextField className="field" required id="outlined-required" label="Titre (lettres et chiffres, 5 - 200 caractères)" name="title" placeholder="Ajouter un titre" onChange={(e) => setTitle(e.target.value)} value={title ? title : ""} />
                    <TextField className="field" required id="outlined-required" label="Description (lettres et chiffres, 20 - 2000 caractères)" name="description" placeholder="Ajouter une description" onChange={(e) => setDescription(e.target.value)} value={description ? description : ""} />
                    <TextField className="field" required id="outlined-required" label="Ville (lettres et chiffres)" name="city" placeholder="Ajouter une ville" onChange={(e) => setCity(e.target.value)} value={city ? city : ""} />
                    <TextField className="field" required id="outlined-required" type="date" name="date" onChange={handleChange} value={date ? date.toISOString().substr(0, 10) : ""} />
                    <FormControl className="field">
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select labelId="demo-smoimple-select-label" id="de-simple-select" label="Age" onChange={(e) => setType(e.target.value)} value={type ? type : "CONFERENCE"} >
                            <MenuItem value="CONFERENCE">Conférence</MenuItem>
                            <MenuItem value="CONCERT">Concert</MenuItem>
                            <MenuItem value="PRIVATE MEETING">Réunion privée</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField className="field" id="outlined-required" label="Lien (Optionnel)" name="link" placeholder={link ? "" : "Ajouter des liens"} onChange={(e) => setLink(e.target.value)} value={link} />
                </div>
                <div className="button">
                    <Button variant="contained" type="submit">{messageButton}</Button>
                </div>
            </form>
            {!isNew ?
            <div className="participants">
                <TableContainer sx={{ maxWidth: 650, width: "80%" }} component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Participants</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscribers.map((subscriber, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {subscriber.firstName + " " + subscriber.lastName}
                        </TableCell>
                        <TableCell sx={{ width: 32, cursor:"pointer" }} component="th" scope="row" onClick={() => handleOnRemove(subscriber._id)}>
                            <RemoveIcon />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            : ""}
        </>
    )
}

export default EventForm;