import React, { useState, useEffect } from 'react'
import { FiPower, FiTrash2 } from "react-icons/fi"
import { Link, useHistory} from "react-router-dom";

import './styles.css'
import api from "../../services/api";


import logoImg from "../../assets/logo.svg"


export default function Profile() {
        const [incidents, setIncidents] = useState([]);
    
    const history = useHistory()

    const ongId = localStorage.getItem('ongId')
    const contaOng = localStorage.getItem("ongName")
    

    useEffect(() => {
        api.get('profile', {
            headers: {
                authorization: ongId,
            }
        }).then((response) => {
            setIncidents(response.data)
        })
    }, [ongId])

    async function handleDeleteIncident(id) {
        try{
            await api.delete(`incident/${id}`, {
                headers: {
                    authorization: ongId,
                }
            })

            setIncidents(incidents.filter(incident => incident.id !== id ))
        }catch(err){
            alert(`erro ao deletar caso: ${err}`)
        }
    }

    function handleLogout() {
         localStorage.clear()
         history.push('/')
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero" />
                <span>Wellcome, {contaOng}</span>
                <Link className="button" to="/incidents/new">Register new incident</Link>
                <button onClick={handleLogout} type="button" >
                        <FiPower size={18} color="#E01041" />
                </button>
            </header>
            <h1>Casos cadastrados</h1>

            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>

                        <strong>CASO:</strong>
                        <p>{incident.title}</p>

                        <strong>DESCRIÇÃO:</strong>
                        <p>{incident.description}</p>

                        <strong>VALOR:</strong>
                        <p>{Intl.NumberFormat('pt-br', {style: 'currency', currency: "BRL"}).format(incident.value)}</p>

                        <button onClick={() => handleDeleteIncident(incident.id)} type="button">
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>

    )
}