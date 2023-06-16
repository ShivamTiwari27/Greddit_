import {useEffect, useState} from "react";

export function custom_cursor() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [mousePosition, setMousePosition] = useState({
        x: 0,
        y: 0
    });
    // console.log(mousePosition);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const mouseMove = (coords) => {
            setMousePosition({
                x: coords.clientX,
                y: coords.clientY
            })
            // console.log(coords);
        }
        window.addEventListener("mousemove", mouseMove);
        return () => {
            window.removeEventListener("mousemove", mouseMove);
        }

    }, []);

    const variants = {
        default: {
            backgroundColor: "black",
            x: mousePosition.x,
            y: mousePosition.y
        }
    }
    return variants;
}