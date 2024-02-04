import {Layout, List} from "antd";
import {useEffect, useState} from "react";
import moment from "moment";
import {RedAlertResponse, RedAlertRepresentation} from "../models/models";

const RedAlertsPanel: React.FC = () => {
    const { Sider } = Layout;
    var defaultArray: RedAlertRepresentation[] = [
        // {
        //     id:"123456789",
        //     cat:"1",
        //     title:"ירי רקטות וטילים",
        //     data: ["עכו", "קריית ביאליק"],
        //     desc:"הישארו בממד 10 דקות",
        //     exp: moment(new Date()).add(5, "seconds")
        // },
        // {
        //     id:"15689746",
        //     cat:"1",
        //     title:"ירי רקטות וטילים",
        //     data: ["תל אביב", "ירושלים"],
        //     desc:"הישארו בממד 10 דקות",
        //     exp: moment(new Date()).add(10, "seconds")
        // }
        ]

    const [redAlerts, setRedAlerts] = useState<RedAlertRepresentation[]>(defaultArray);

    useEffect(() => {
        const fetchRedAlerts = () => {
            // fetch('https://corsproxy.io/?https://api.tzevaadom.co.il/notifications')
            fetch('https://api.codetabs.com/v1/proxy?quest=https://api.tzevaadom.co.il/notifications')
                .then(response => response.json())
                .then(result => result as RedAlertResponse[])
                .then(candidateAlerts => {
                    if (candidateAlerts.length === 0) {
                        return
                    }

                    candidateAlerts.forEach(candidateAlert => {
                        const newAlert: RedAlertRepresentation = {
                            notificationId: candidateAlert.notificationId,
                            time: candidateAlert.time,
                            threat: candidateAlert.threat,
                            isDrill: candidateAlert.isDrill,
                            cities: candidateAlert.cities,
                            exp: moment(new Date()).add(20, 'seconds'),
                        }

                        setRedAlerts((prevAlerts) => {
                            if(!prevAlerts.find((alert) => alert.notificationId === newAlert.notificationId)) {
                                return [...prevAlerts, newAlert]
                            } else {
                                return prevAlerts
                            }
                        });
                    })
                })
                .catch((reason) => {console.log(reason)})
        }

        const intervalId = setInterval(fetchRedAlerts, 1000)

        return () => clearInterval(intervalId)

    }, [])

    useEffect(() => {
        setInterval(() => {
            setRedAlerts((old) => old.filter((alert) => {
                return moment(new Date()) < alert.exp
            }))
        }, 1000)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Sider hidden={redAlerts.length === 0} style={{
            backgroundColor: '#000000'
        }}>

            <List
                style={{
                    margin: 15
                }}
                header={<h1 style={{
                    backgroundColor: '#073dd5',
                    color: 'white',
                    textAlign: 'center',
                    padding: 5,
                    borderRadius: 15,
                    margin:0
                }}>🚨 התרעות 🚨</h1>}
                dataSource={redAlerts.reduce((acc: string[], redAlert: RedAlertRepresentation) => [...acc, ...redAlert.cities], [])}
                renderItem={(item) => (
                    <List.Item style={{
                        backgroundColor: '#d55607',
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: 5,
                        borderRadius: 15,
                        marginBottom: 5,
                        display: 'block'
                    }}>
                        {item}
                    </List.Item>
                )}
            />
        </Sider>
    );
}

export default RedAlertsPanel;