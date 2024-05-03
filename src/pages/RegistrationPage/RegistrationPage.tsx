import { useNavigate } from "react-router-dom";
import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";
import Authentication from "../../utils/authentication";
import { useEffect } from "react";

interface LoginPageProps {
    authentication: Authentication;
}

const RegistrationPage: React.FC<LoginPageProps> = ({ authentication }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const isConnected = authentication.isConnected();
    
        if (isConnected) {
            navigate("/")   
        }
    })


    return (
        <RegistrationForm />
    )
}

export default RegistrationPage;