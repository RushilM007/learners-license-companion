import "./HomeScreen.css"

export default function Header(props){
    return (
        <>
            {props.title && <h1 id = "HomeScreenHeaderText">{props.title}</h1>}

            {props.imagePathOne && 
            <button className = "HeaderButton" onClick = {props.functionOne}>
                <img className = "HeaderImage" src = {props.imagePathOne} alt = {props.altOne}  />
            </button>}

            {props.imagePathTwo && 
            <button onClick = {props.functionTwo} className = "HeaderButton">
                <img className = "HeaderImage" src = {props.imagePathTwo} alt = {props.altTwo} />
            </button>}
        </>
    )
}