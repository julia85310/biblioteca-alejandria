import './loaderstyle.css';

export default function Loader({tailwind}){
    return <div className={`${tailwind} flex items-center justify-center`}>
        <div className="loader block"></div>
    </div>
}