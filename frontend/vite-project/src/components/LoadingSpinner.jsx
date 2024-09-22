const LoadingSpinner = ({size = 'md'})=>{

    return (
        <div className="w-full h-full flex justify-center items-center">
            <span className={`loading loading-spinner loading-${size}`}></span>
        </div>
    )
}

export default LoadingSpinner;