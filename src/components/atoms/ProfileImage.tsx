import Image from "next/image"

interface ProfileImageProps {
    src: string,
    w?: number,
    h?: number
}


export const ProfileImage = ({ src, h = 10, w = 10 }: ProfileImageProps) => {
    return (
        <div className={`h-${h} w-${w} relative`} >
            <Image src={src} width={"10"} height={"10"} alt="profile" layout={'responsive'} className="rounded-full " />
        </div >
    )
}
