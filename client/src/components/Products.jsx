import React from 'react';
import { useInView } from 'react-intersection-observer';
import './Products.css';
import { FaLongArrowAltRight } from 'react-icons/fa';

const ProductCard = ({ image, text }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2, 
    });

    return (
        <div ref={ref} className={`current-product ${inView ? 'slide-in' : 'hidden'}`}>
            <div className='current-im'>
                <img className='im-product' src={image} alt='' />
                <div className="product-hover-box"></div>
            </div>
            <div>
                <p className='product-para'>{text}</p>
                <div className='product-btn-container'>
                    <p className="product-button">
                        Read more <FaLongArrowAltRight className="forward-icon" size={15} />
                    </p>
                    <hr className='read-more-line'></hr>
                </div>
            </div>
        </div>
    );
}

function Products() {
    const products = [
        { image: 'online learning.png', text:'Experience the future of learning with our AI-powered 3D teacher delivering personalized lessons anytime, anywhere.' },
        { image: 'dashboard.png', text: 'Track student progress in real-time with intelligent dashboards that provide insights for improved learning outcomes.'
    },
        { image: 'lessons.png', text: 'Our system generates dynamic lesson plans automatically, saving educators hours of manual work.' },
        { image: 'tasks.png', text: 'Say goodbye to repetitive tasks — from attendance to reporting, everything is automated for a smoother educational experience.' }
    ];

    return (
        <div className='products'>
            {products.map((product, index) => (
                <ProductCard key={index} image={product.image} text={product.text} />
            ))}
        </div>
    );
}

export default Products;
