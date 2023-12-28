import {Image} from "antd";
import logo from "../assets/walla.png";
import MarqueeContainer from "./marquee_wrapper";
import {useEffect, useState} from "react";
import {NewsItem} from "../models/models";
import moment from "moment";


const WallaNews: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const Parser = require('rss-parser');
    const parser = new Parser();

    function fetchNews() {
        (async () => {
            const feed = await parser.parseURL('https://rss.walla.co.il/feed/22');
            setNews(feed.items.slice(0,10).map((item:any) => {
                return {
                    title: item.title,
                    description: item.contentSnippet,
                    pubDate: moment(item.pubDate).utc()

                }
            }))
        })();
    }

    useEffect(() => {
        fetchNews()
        setInterval(fetchNews, 1000 * 30)
    }, [])

    return (
        <div>
            <Image src={logo} style={{marginBottom: 10, padding: 10, backgroundColor: "white", borderRadius: 15}}></Image>
            <MarqueeContainer news={news}></MarqueeContainer>
        </div>
    );
}

export default WallaNews;