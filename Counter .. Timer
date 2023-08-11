const timerRef = useRef(null)
const [timer, setTimer] = useState(30)

useEffect(() => {
        if (timer > 0) {
            timerRef.current = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(timerRef.current);
        } else {
            timerRef.current = setInterval(() => setTimer(timer - 1), 1000);
            clearInterval(timerRef.current);
        }
        return () => {
            clearTimeout(timerRef.current)
        }
    }, [timer])
