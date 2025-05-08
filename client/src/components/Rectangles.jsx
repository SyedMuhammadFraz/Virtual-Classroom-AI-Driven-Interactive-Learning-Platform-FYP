import React, { useEffect, useRef } from "react";
import "./Rectangles.css";
import { useInView } from "react-intersection-observer";

function Rectangles() {
    const [ref, InView] = useInView({
        threshold: 0.2,
        triggerOnce: false
    });

    const rect11Ref = useRef(null);
    const rect12Ref = useRef(null);

    useEffect(() => {
        if (InView) {
            setTimeout(() => {
                if (rect11Ref.current) {
                    rect11Ref.current.style.width = "100%";
                    rect11Ref.current.style.transform = "translateX(0)"; // Move to normal position
                }
                if (rect12Ref.current) {
                    rect12Ref.current.style.width = "100%";
                }
            }, 1000);
        }
    }, [InView]);

    return (
        <div className="rectangles" ref={ref}>
            <div className="rect-left">
                <div></div>
                <div className="rect" ref={rect11Ref}></div>
            </div>
            <div className="rect-next">
                <div className="rect-12" ref={rect12Ref}></div>
                <div></div>
            </div>
        </div>
    );
}

export default Rectangles;
