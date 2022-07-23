import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Pronostic from './Pronostic'
import api from '../../utils/api'
import {Route, useNavigate} from 'react-router-dom';
import ReactLoading from 'react-loading'
import { Button } from '@mui/material'
import TelegramIcon from '@mui/icons-material/Telegram'

const GrandChelem = () => {
    const [event, setEvent] = useState(null)
    const navigate = useNavigate();
    const [pronostics, setPronostics] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        api.get("/events")
        .then(res => {
            setEvent(res.data.events_list[0])

            if (new Date(res.data.events_list[0].starts) >= new Date(Date.now())) {
                return navigate('/')
            }
        })
        .catch(err => {
            setEvent(null)
        })
    }, [])

    useEffect( () => {
        setLoading(true)
        api.get("/pronostics/gc").then(res => {
            setPronostics(res.data.finalResults)
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    }, [])

    return (
        <Container fluid className="pronostics">
            <Row className="title">
                <div className="filter position-absolute" />
                <Col className="d-flex align-items-center pt-4 pb-4" style={{zIndex: "1"}}>
                    <Container className="p-0">
                        <Row>
                            <Col lg={6}>
                                <span>PRONOSTICS</span>
                                <h2>
                                    { event ? event.tournament : "AUCUN TOURNOI EN COURS" }
                                </h2>
                                {
                                    event ?
                                        <p>
                                            DU { new Date(event.starts).toLocaleDateString("fr-Fr") } AU { new Date(event.ends).toLocaleDateString("fr-Fr") }
                                        </p>
                                        : null
                                }
                            </Col>
                            <Col lg={6} className="d-flex justify-content-lg-end align-items-center pb-3">
                                <Button variant="contained" startIcon={<TelegramIcon />}>
                                    Suivre
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
            {
                !loading ?
                    <Container>
                        <Row className="pt-5 pb-5">
                            {
                                pronostics[0] ?
                                    pronostics
                                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                    .map(el => (
                                        <Pronostic
                                            key={el.title}
                                            title={el.title}
                                            image={el.image}
                                            content={el.content}
                                            created_at={el.created_at}
                                        />
                                    ))
                                    : <p> Aucun pronostic trouvé. </p>
                            }
                        </Row>
                    </Container>
                    :
                    <Container className="d-flex flex-column align-items-center justify-content-center" style={{height: "500px"}}>
                        <ReactLoading className="mx-auto" type="bars" color="black" height={50} width={50} />
                        <p className="mx-auto text-center"> Chargement en cours... </p>
                    </Container>
            }
        </Container>
    )
}

export default GrandChelem