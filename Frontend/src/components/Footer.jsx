import { Typography } from "@material-tailwind/react";
import { FaFacebook, FaInstagram } from 'react-icons/fa';

export default function SimpleFooter() {
    return (
        <footer className="bg-white flex w-full flex-row flex-wrap items-center mt-24 justify-center gap-y-6 gap-x-12 border-t border-blue-gray-50 py-6 text-center md:justify-between" style={{ marginTop: '20px', position: 'fixed', left: 0, bottom: 0, width: '100%' }}>
            <Typography color="blue-gray" className="font-normal">
                &copy; 2023 UrbanFit
            </Typography>
            <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
                <li>
                    <Typography
                        as="a"
                        href="https://www.facebook.com/Gym.UrbanFit"
                        color="blue"
                        target="_blank"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                    >
                        <FaFacebook className="h-4 w-4 text-red" />

                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        href="https://www.instagram.com/gym_urbanfit/"
                        color="blue-gray"
                        target="_blank"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                    >
                        <FaInstagram className="h-4 w-4 text-[#C13584]" />
                    </Typography>
                </li>
                <li>

                </li>

            </ul>
        </footer>

    );
}