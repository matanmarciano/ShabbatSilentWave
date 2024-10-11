import {useEffect, useState} from "react";

type Props = {
    parasha: string
};

const DvarTorah: React.FC<Props> = ({parasha}) => {
    const [dvarTorah, setDvarTorah] = useState<string>();

    useEffect(() => {
        fetch('https://corsproxy.io/?https://aish.co.il/tp/tb')
            .then(response => response.text())
            .then(sourceCode => {
                const cleanedSource = sourceCode.replace(/\s+/g, '');

                const pattern = new RegExp(`<li><p>${parasha}<\\/p>(.*?)<\\/li>`, 'gs');
                const matches = cleanedSource.match(pattern);
                const extractedContent = matches?.map((match) => {
                    const regex = new RegExp(`<li><p>${parasha}<\\/p>(.*?)<\\/li>`, 's');
                    const result = regex.exec(match);
                    return result && result[1]; // Extracted content is in result[1]
                });

                if (extractedContent) {
                    if (extractedContent.length > 0) {
                        const aa = extractedContent[0]??''
                        const urlRegex = /<ahref="([^"]*)"[^>]*>/g;
                        const matches = Array.from(aa.matchAll(urlRegex), match => match[1]);

                        if(matches.length > 0) {
                            fetch(`https://corsproxy.io/?${matches[0]}`)
                                .then(response => response.text())
                                .then(sourceCode => {
                                    console.log(sourceCode)

                                    var pTagRegex = /<p\s+class=ArticleText[^>]*>(.*?)<\/p>/g;
                                    var matches = Array.from(sourceCode.matchAll(pTagRegex), match => match[0]);

                                    if(matches.length === 0) {
                                        pTagRegex = /<p\s+class="ArticleText"[^>]*>(.*?)<\/p>/g;
                                        matches = Array.from(sourceCode.matchAll(pTagRegex), match => match[0]);
                                    }

                                    const resultString = matches.map(tag => tag.replace(/<p[^>]*>/, '').replace(/<\/p>/, '')).join('\n');

                                    setDvarTorah(resultString)
                                })
                                .catch(() => {

                                })
                        }
                    }
                }
            })
            .catch(() => {

            })
    }, [parasha]);

    return (
    <div dangerouslySetInnerHTML={{__html: dvarTorah ?? ''}}/>
    );
}

export default DvarTorah;