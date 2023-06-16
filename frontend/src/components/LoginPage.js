function success(props){
    return (
        <>
            <p>
                User: {props.name}
            </p>
            {alert(props.name+" logged in")}
        </>
    ) ;
}

export default success;