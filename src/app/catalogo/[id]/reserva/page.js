
export default function ReservaPage(props){
    const params = use(props.params);
    const id = params.id;
    const [libro, setLibro] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/api/libro?id=" + id);
            const data = await res.json();
            setLibro(data)
        }
        
        fetchData(); 
    }, [])

    return <div>
        
    </div>
}