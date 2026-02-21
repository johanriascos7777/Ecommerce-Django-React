import { Fragment } from 'react';
// ✅ react-icons/fa reemplaza @fortawesome — ya está instalado, no requiere nada extra
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// Estilos de color inline — ya no necesitamos rating_stars.css
const starStyle = { color: '#f59e0b', display: 'inline-block' }; // amber-400

const Stars = ({ rating }) => {

    const renderStar = (threshold, halfThreshold) => {
        if (rating >= threshold) {
            return <FaStar style={starStyle} />;
        } else if (rating === halfThreshold) {
            return <FaStarHalfAlt style={starStyle} />;
        } else {
            return <FaRegStar style={starStyle} />;
        }
    };

    const getStars = () => {
        if (rating && rating !== null && rating !== undefined) {
            return (
                <div className="flex gap-0.5">
                    {renderStar(1, 0.5)}
                    {renderStar(2, 1.5)}
                    {renderStar(3, 2.5)}
                    {renderStar(4, 3.5)}
                    {renderStar(5, 4.5)}
                </div>
            );
        }
    };

    return (
        <Fragment>
            {getStars()}
        </Fragment>
    );
};

export default Stars;