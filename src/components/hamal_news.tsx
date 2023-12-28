import {Image} from "antd";
import logo from "../assets/hamal.png";
import MarqueeContainer from "./marquee_wrapper";
import {useEffect, useState} from "react";
import {NewsItem} from "../models/models";
import moment from "moment";

const HamalNews: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);

    function fetchNews() {
        fetch('https://public-api.hamal.co.il/item')
            .then(response => response.json())
            .then(data => {
                let newNews: NewsItem[] = []
                data.data.slice(0,20).forEach((item: any) => {
                    const newsItem: NewsItem = {description: ''}
                    item.body.forEach((part: any) => {
                        if(part.type === 'title') {
                            newsItem.title = part.value
                        } else if(part.type === 'text') {
                            newsItem.description = newsItem.description + part.value
                        }
                    })
                    newsItem.description = newsItem.description?.substring(0, 200) + "..."
                    newsItem.pubDate = moment(item.publishedAt).utc().utcOffset(moment().utcOffset())

                    newNews.push(newsItem)
                })

                setNews(newNews)
            })
    }

    useEffect(() => {
        setInterval(fetchNews, 1000 * 30)
        fetchNews()
    }, [])

    return (
        <div style={{height:'100%'}}>
            <Image src={logo} style={{marginBottom: 10, padding: 10, backgroundColor: "white", borderRadius: 15}}></Image>
            {/*<MarqueeContainerV2 news={news}></MarqueeContainerV2>*/}
            <MarqueeContainer news={news}></MarqueeContainer>
        </div>
    );
}

export default HamalNews;