import React, {useState, useEffect} from 'react';

const ScrollToTopButton : React.FC = () => {
    const [isVisible,
        setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsVisible(scrollTop > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    return (
        <button
            className={`scroll-to-top-button ${isVisible
            ? 'visible'
            : ''}`}
            onClick={scrollToTop}>
            ▲
        </button>
    );
};

export default ScrollToTopButton;
