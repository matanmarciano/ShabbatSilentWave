import './App.css';
import {Image, Layout} from "antd";
import HamalNews from "./components/hamal_news";
import DigitalClock from "./components/digital_clock";
import Parasha from "./components/parasha";
import RedAlertsPanel from "./components/red_alerts";
import background from "./assets/background.jpg";
import candle from "./assets/candle.png";

const { Content, Sider } = Layout;

const App: React.FC = () => {
    return (
      <Layout style={{height:"100vh"}}>
          <Layout>
              <RedAlertsPanel />

              <Content style={{
                  backgroundImage: `url(${background})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  paddingRight: 30,
              }}>
                  <DigitalClock />
                  <h1 style={{
                      marginTop:0,
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      width: 450,
                      textAlign: 'center',
                      padding: 5,
                      borderRadius: 15 }}><Image src={candle} height={35} /> שבת שלום <Image src={candle} height={35} /> </h1>
                  <Parasha />
              </Content>
          </Layout>

          <Sider style={{backgroundColor: "#50001b", padding: 10, overflow: "hidden"}} width={200}>
              <HamalNews />
              {/*<WallaNews />*/}
          </Sider>
      </Layout>
  );
}

export default App;
