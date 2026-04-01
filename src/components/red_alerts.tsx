import {Layout, List} from "antd";
import {useEffect, useState} from "react";
import moment from "moment";
import {RedAlertResponse, RedAlertRepresentation} from "../models/models";

type CityAlertItem = {
    city: string;
    threat: number;
};

const RedAlertsPanel: React.FC = () => {
    const { Sider } = Layout;

    const getBackgroundColorByThreat = (threat: number) => {
        switch (threat) {
            case 5:
                return '#8e44ad';
            default:
                return '#d55607';
        }
    };

    const defaultArray: RedAlertRepresentation[] = [
        // // כלי טיס עויין
        // {
        //     notificationId: "1",
        //     time: 1,
        //     threat: 5,
        //     isDrill: true,
        //     cities: ["תל אביב", "ירושלים", "תל אביב", "ירושלים"],
        //     exp: moment(new Date()).add(40, "seconds")
        // },
        // // טילים
        // {
        //     notificationId: "2",
        //     time: 1,
        //     threat: 0,
        //     isDrill: true,
        //     cities: ["עכו", "נהריה", "עכו", "נהריה"],
        //     exp: moment(new Date()).add(40, "seconds")
        // },
    ];

    const [redAlerts, setRedAlerts] = useState<RedAlertRepresentation[]>(defaultArray);

    useEffect(() => {
        if(defaultArray.length > 0) {
            return;
        }
        
        const fetchRedAlerts = () => {
            fetch('https://api.codetabs.com/v1/proxy?quest=https://api.tzevaadom.co.il/notifications')
                .then(response => response.json())
                .then(result => result as RedAlertResponse[])
                .then(candidateAlerts => {
                    if (candidateAlerts.length === 0) {
                        return;
                    }

                    candidateAlerts.forEach(candidateAlert => {
                        const newAlert: RedAlertRepresentation = {
                            notificationId: candidateAlert.notificationId,
                            time: candidateAlert.time,
                            threat: candidateAlert.threat,
                            isDrill: candidateAlert.isDrill,
                            cities: candidateAlert.cities,
                            exp: moment(new Date()).add(40, 'seconds'),
                        };

                        setRedAlerts((prevAlerts) => {
                            if (!prevAlerts.find((alert) => alert.notificationId === newAlert.notificationId)) {
                                return [...prevAlerts, newAlert];
                            } else {
                                return prevAlerts;
                            }
                        });
                    });
                })
                .catch((reason) => {console.log(reason)});
        };

        const intervalId = setInterval(fetchRedAlerts, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const cleanupInterval = setInterval(() => {
            setRedAlerts((old) => old.filter((alert) => {
                return moment(new Date()) < alert.exp;
            }));
        }, 1000);

        return () => clearInterval(cleanupInterval);
    }, []);

    const cityAlerts: CityAlertItem[] = redAlerts
        .flatMap((redAlert) =>
            redAlert.cities.map((city) => ({
                city,
                threat: redAlert.threat,
            }))
        )
        .sort((a, b) => a.city.localeCompare(b.city, 'he'));

    return (
        <Sider
            width="100%"
            hidden={redAlerts.length === 0}
            style={{
                backgroundColor: '#000000'
            }}
        >
            <List
                style={{
                    margin: 15
                }}
                grid={{column: 7}}
                header={
                    <h1 style={{
                        backgroundColor: '#073dd5',
                        color: 'white',
                        textAlign: 'center',
                        padding: 5,
                        borderRadius: 15,
                        margin: 0
                    }}>
                        🚨 אזעקות (תגידו להראל) 🚨
                    </h1>
                }
                dataSource={cityAlerts}
                renderItem={(item) => (
                    <List.Item
                        style={{
                            backgroundColor: getBackgroundColorByThreat(item.threat),
                            color: 'white',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            padding: 3,
                            borderRadius: 15,
                            margin: 2,
                            display: 'block'
                        }}
                    >
                        {item.city} {item.threat === 5 ? "✈️" : "🚀"}
                    </List.Item>
                )}
            />
        </Sider>
    );
};

export default RedAlertsPanel;