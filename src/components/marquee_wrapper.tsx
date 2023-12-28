import styled, { keyframes } from "styled-components";
import React from "react";
import {Card} from "antd";
import {NewsItem} from "../models/models";

const marqueeTop = keyframes`
  0% {
    transform: translateY(20%);
  }
  100% {
    transform: translateY(-100%);
  }
`;

const MarqueeWrapper = styled.div`
  overflow: hidden;
  margin: 0 auto !important;
`;

const MarqueeBlock = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  float: left;
`;

const MarqueeInner = styled.div`
  position: relative;
    width: 100%;
  display: inline-block;
  animation: ${marqueeTop} 200s linear infinite;
  animation-timing-function: linear;
  &:hover {
    animation-play-state: paused;
  }
`;

const MarqueeItem = styled.div`
  transition: all 0.2s ease-out;
    margin-top: 10px;
`;



type MarqueeContainerProps = {
    news: NewsItem[]
};

export default class MarqueeContainer extends React.Component<MarqueeContainerProps> {
    render() {
        return (
            <MarqueeWrapper>
                <MarqueeBlock>
                    <MarqueeInner>
                        {this.props.news.map((item) => {
                            return <MarqueeItem key={`${item.title} ${item.pubDate}`}>
                                <Card title={<p>{item.pubDate?.format('HH:mm')}<br/>{item.title}</p>}>{item.description}</Card>
                            </MarqueeItem>
                        })}
                    </MarqueeInner>
                </MarqueeBlock>
            </MarqueeWrapper>
        );
    }
}