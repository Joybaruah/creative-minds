export default function Message({children, avatar, username, description}) {
    return(
        <div className="bg-white p-8 border-b-2 rounded-lg border-2 my-2">
            <div className="flex items-center gap-2">
                <img src={avatar} alt="" className="w-10 rounded-full "/>
                <h2>{username}</h2>
            </div>
            <div className="py-4 text-base">
                <p>{description}</p>
            </div>
            {children}
        </div>
    )
}