import React, { useState } from 'react';



const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


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
            const payload = data.payload;
            console.log(payload);
            
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="form-box">
            <h2>Connexion</h2>
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            placeholder="Email"
                            type="email"
                            id="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Mot de passe"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <button className="valid-button" type="submit">Connexion</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
