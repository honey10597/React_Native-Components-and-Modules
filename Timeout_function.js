useEffect(() => {
        if (timer > 0) {
            console.log("XXXXXX 2222");
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
