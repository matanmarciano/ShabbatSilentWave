import {useEffect, useState} from "react";
import moment from "moment/moment";


const DigitalClock: React.FC = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            let newDate = new Date()
            newDate.setHours(newDate.getHours() + 24)
            setDate(newDate);
        }, 1000)

        return () => clearInterval(intervalId);
    }, [])

    return (
            <h1 style={{
                fontSize: 75,
                color: 'white',
                width: 450,
                textAlign: 'center',
                margin:0,
            }}>{moment(date).format('HH:mm:ss')}</h1>
    );
}

export default DigitalClock;