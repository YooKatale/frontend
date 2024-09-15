import Image from 'next/image'; // Import Image from next/image
import Link from 'next/link';

const CategoryCard = ({ category }) => (
  <div
    style={{
      padding: '0.5rem', // Use rem for padding
      border: '0.125rem solid lightgrey', // Use rem for border thickness
      borderRadius: '0.5rem', // Use rem for border radius
      transition: 'border-color 0.3s ease-in-out',
      cursor: 'pointer',
    }}
    onMouseOver={(e) => (e.currentTarget.style.borderColor = '#1976d2')} // Primary color on hover
    onMouseOut={(e) => (e.currentTarget.style.borderColor = 'lightgrey')}
  >
    <Link href={`/search?q=${category}`} passHref>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Image
          src={`/assets/images/categories/${category}.jpg`}
          alt={category}
          width={120} // You can control the width and height for optimized loading
          height={120} // This must be specified for Image to work
          style={{
            objectFit: 'contain', // Make the image fit the container
            transition: 'transform 0.3s ease-in-out',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')} // Zoom on hover
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </div>
    </Link>
  </div>
);

export default CategoryCard;
