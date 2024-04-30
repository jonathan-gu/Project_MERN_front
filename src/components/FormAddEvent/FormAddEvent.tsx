import { TextField, FormControl, InputLabel, MenuItem, Select, Button } from "@mui/material";
import "./FormAddEvent.css"

const FormAddEvent = () => {
    return (
        <form>
            <h1>Ajouter un événement</h1>
            <div>
                <TextField className="field" required id="outlined-required" label="Titre" placeholder="Ajouter un titre" />
                <TextField className="field" required id="outlined-required" label="Description" placeholder="Ajouter une description" />
            </div>
            <div>
                <TextField className="field" required id="outlined-required" label="Ville" placeholder="Ajouter une ville" />
                <TextField className="field" required id="outlined-required" type="date" />
            </div>
            <div>
                <FormControl className="field">
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Age" >
                        <MenuItem value="CONFERENCE">Conférence</MenuItem>
                        <MenuItem value="CONCERT">Concert</MenuItem>
                        <MenuItem value="PRIVATE MEETING">Réunion privée</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <Button variant="contained">Ajouter</Button>
            </div>
        </form>
    )
}

export default FormAddEvent;