import { Box, Text, VStack, Icon } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';

/**
 * Normalize category name to match actual image filename
 * Maps category names to their exact image filenames in /public/assets/images/categories/
 */
const normalizeCategoryName = (categoryName) => {
  if (!categoryName) return '';
  
  // Map category names to actual image filenames (without .jpg extension)
  const categoryMap = {
    // Popular Product -> Popular Products.jpg (plural, capitalized)
    'Popular Product': 'Popular Products',
    'popular product': 'Popular Products',
    'Popular Products': 'Popular Products',
    
    // Root Tubers -> root tubers.jpg (lowercase with space)
    'Root Tubers': 'root tubers',
    'root tubers': 'root tubers',
    'Root tubers': 'root tubers',
    
    // Roughhages/Roughages -> roughages.jpg (lowercase, note: filename is "roughages")
    'Roughhages': 'roughages',
    'roughhages': 'roughages',
    'Roughages': 'roughages',
    'roughages': 'roughages',
    
    // Juice -> juice.jpg (lowercase)
    'Juice': 'juice',
    'juice': 'juice',
    
    // Breakfast -> breakfast.jpg (lowercase)
    'Breakfast': 'breakfast',
    'breakfast': 'breakfast',
    
    // Vegetables -> vegetables.jpg (lowercase)
    'Vegetables': 'vegetables',
    'vegetables': 'vegetables',
    
    // Add other common mappings for consistency
    'juice&meals': 'juice&meals',
    'Juice&meals': 'juice&meals',
    'Juice & Meals': 'juice&meals',
  };
  
  // Check if there's a direct mapping
  if (categoryMap[categoryName]) {
    return categoryMap[categoryName];
  }
  
  // Default: try lowercase first (most common pattern)
  const lowercased = categoryName.toLowerCase();
  if (categoryMap[lowercased]) {
    return categoryMap[lowercased];
  }
  
  // Fallback: use the category name as-is (case-sensitive match)
  return categoryName;
};

const CategoryCard = ({ category, hasProducts = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Categories with no products redirect to subscription
  const href = hasProducts ? `/search?q=${encodeURIComponent(category)}` : '/subscription';

  // Normalize category name for image path
  const normalizedCategory = normalizeCategoryName(category);
  const imagePath = `/assets/images/categories/${normalizedCategory}.jpg`;

  return (
    <Link href={href} passHref style={{ textDecoration: 'none' }}>
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="xl"
        bg="white"
        boxShadow={isHovered ? '0 8px 20px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.08)'}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        transform={isHovered ? 'translateY(-6px)' : 'translateY(0)'}
        cursor="pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        border="2px solid"
        borderColor={isHovered ? '#185F2D' : 'transparent'}
        _hover={{
          '& .category-overlay': {
            opacity: 1,
          },
          borderColor: '#185F2D',
        }}
      >
        <VStack spacing={2} p={3}>
          <Box
            position="relative"
            width="100%"
            height={{ base: '80px', md: '100px', lg: '120px' }}
            borderRadius="lg"
            overflow="hidden"
            bg="gray.50"
          >
            {!imageError ? (
              <Image
                src={imagePath}
                alt={category}
                fill
                sizes="(max-width: 768px) 100px, (max-width: 1200px) 120px, 150px"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease-in-out',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
                bgGradient="linear(to-br, #185F2D10, #185F2D05)"
              >
                <Icon as={AiOutlineShoppingCart} boxSize={8} color="white" />
              </Box>
            )}
            
            {/* Overlay gradient */}
            <Box
              className="category-overlay"
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bgGradient="linear(to-t, blackAlpha.600, transparent)"
              opacity={0}
              transition="opacity 0.3s ease"
            />
          </Box>
          
          <Text
            fontSize={{ base: 'xs', md: 'sm' }}
            fontWeight="600"
            color="gray.700"
            textAlign="center"
            noOfLines={2}
            textTransform="capitalize"
            lineHeight="short"
            minH={{ base: '32px', md: '36px' }}
            display="flex"
            alignItems="center"
          >
            {category}
          </Text>
        </VStack>
      </Box>
    </Link>
  );
};

export default CategoryCard;
