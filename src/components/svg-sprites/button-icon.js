export default function ButtonIcon({name}) {
    return (
        <svg className="button-icon" version="1.1" viewBox="0 0 64 64" width="36" height="36">
            {/* Center the icon inside the 36x36 container */}
            <use 
                href={`#icon-${name}`} 
                width="64" // Set the icon width to 36px
                height="64" // Set the icon height to 36px
                x="8" 
                y="8"
            />
        </svg>
    )
}
