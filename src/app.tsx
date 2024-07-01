import links from "assets/links.json";
import quotes from "assets/quotes.json";

interface Link {
    name: string;
    url: string;
}

export const App = () => {
    const quote = quotes[new Date().getDate() % quotes.length];

    return (
        <div>
            <div className="d-flex">
                <div className="v-line" />
                <div className="d-flex flex-v">
                    <span className="f-switzer name-title">
                        AARON
                        <br />
                        GEIGER
                    </span>

                    <div className="d-flex flex-v box">
                        <span>student.</span>
                        <span>developer.</span>
                    </div>

                    <div className="d-flex flex-v box">
                        {(links as Link[]).map((contact: Link) => (
                            <a href={contact.url} key={contact.url}>
                                {contact.name}
                            </a>
                        ))}
                    </div>

                    <div className="box quote">
                        <span>{quote.quote}</span>
                        <span style={{float: "right"}}>— {quote.source}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
