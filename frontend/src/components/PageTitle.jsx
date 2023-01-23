/**
 * Page title and welcoming text. 
 * @param {String} title Page title
 * @param {String} text  text accompanying page title 
 * @returns PageTitle component
 */
const PageTitle = ({ title, text}) =>{
    return (
        <section className="page-title">
            <h1>{title}</h1>
            <p>{text}</p>
            <br/>
        </section>
    );
}

export default PageTitle;