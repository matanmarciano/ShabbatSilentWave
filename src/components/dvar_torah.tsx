import { useEffect, useState } from "react";

type Props = {
    parasha: string;
};

const DvarTorah: React.FC<Props> = ({ parasha }) => {
    const [dvarTorah, setDvarTorah] = useState<string>("");

    useEffect(() => {
        const fetchDvarTorah = async () => {
            try {
                const response = await fetch("https://corsproxy.io/?https://aish.co.il/tp/tb/");
                const sourceCode = await response.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(sourceCode, "text/html");

                const liElements = Array.from(doc.querySelectorAll(".parshaBackground li"));

                const matchedLi = liElements.find((li) => {
                    const p = li.querySelector("p");
                    return p?.textContent?.trim() === parasha.trim();
                });

                if (!matchedLi) {
                    console.log("No matching parasha found:", parasha);
                    setDvarTorah("");
                    return;
                }

                const link = matchedLi.querySelector("a")?.getAttribute("href");
                if (!link) {
                    console.log("No article link found for parasha:", parasha);
                    setDvarTorah("");
                    return;
                }

                const articleResponse = await fetch(`https://corsproxy.io/?${link}`);
                const articleHtml = await articleResponse.text();

                const articleDoc = parser.parseFromString(articleHtml, "text/html");

                const paragraphs = Array.from(articleDoc.querySelectorAll("p.ArticleText"));

                const resultString = paragraphs
                    .map((p) => p.innerHTML.trim())
                    .filter(Boolean)
                    .join(". ");

                setDvarTorah(resultString);
            } catch (err) {
                console.error(err);
                setDvarTorah("");
            }
        };

        fetchDvarTorah();
    }, [parasha]);

    return <div dangerouslySetInnerHTML={{ __html: dvarTorah ?? '' }} />;
};

export default DvarTorah;