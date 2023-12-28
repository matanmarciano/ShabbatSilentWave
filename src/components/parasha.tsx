import {Card} from "antd";
import {useEffect, useState} from "react";
import moment, {Moment} from "moment";
import DvarTorah from "./dvar_torah";

const Parasha: React.FC = () => {
    const [parasha, setParasha] = useState<string>('');
    const [startShabbat, setStartShabbat] = useState<Moment>();
    const [endShabbat, setEndShabbat] = useState<Moment>();
    const cityCode = '294577' // Karmiel. Use '247773' for Naharya

    function fetchShabbatDetails() {
        fetch(`https://www.hebcal.com/shabbat?cfg=json&geonameid=${cityCode}&M=on&a=off`)
            .then(response => response.json())
            .then(result => {
                result.items.forEach((part: any) => {
                    if(part.category === 'parashat') {
                        setParasha(part.hebrew)
                    } else if(part.category === 'candles') {
                        setStartShabbat(moment(part.date))
                    } else if(part.category === 'havdalah') {
                        setEndShabbat(moment(part.date))
                    }
                })
            })
    }

    useEffect(() => {
        setInterval(fetchShabbatDetails, 1000 * 60 * 60 * 3)
        fetchShabbatDetails()
    }, [])

    return (
        <div>

            <Card
                title={<h1 style={{margin:0, padding:0}}>{parasha}</h1>}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    width: 450,
                    textAlign: 'center',
                    padding: 5,
                    borderRadius: 15
                }}>
                <h3 style={{margin:0, padding:0}}>כניסת השבת: <span>{startShabbat?.format('HH:mm')}</span></h3>
                <h3 style={{margin:0, padding:0}}>צאת השבת: <span>{endShabbat?.format('HH:mm')}</span></h3>

            </Card>

            <Card
                title={<h1 style={{margin:0}}>דבר תורה</h1>}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    width: 800,
                    textAlign: 'center',
                    borderRadius: 15,
                    marginTop: 15,
                    padding: 0
                }}>
                <DvarTorah parasha={parasha.replace('פרשת ', '')} />
            </Card>
        </div>
    );
}

export default Parasha;