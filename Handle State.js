const [state, setState] = useState({
    count: 1,
    name: ""
})

const onClick = () => {
    setTimeout(() => {
        setState((prevState) => ({
            ...prevState,
            name: "John",
            count: prevState.count + 1
        }))
    }, 1000)
}
