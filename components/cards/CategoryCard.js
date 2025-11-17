import { Box, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const CategoryCard = ({ category }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  return (
    <Link href={`/search?q=${category}`} passHref style={{ textDecoration: 'none' }}>
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="xl"
        bg="white"
        boxShadow={isHovered ? 'lg' : 'md'}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        transform={isHovered ? 'translateY(-4px)' : 'translateY(0)'}
        cursor="pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        border="1px solid"
        borderColor={isHovered ? 'green.400' : 'gray.200'}
        _hover={{
          '& .category-overlay': {
            opacity: 1,
          },
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
                src={`/assets/images/categories/${category}.jpg`}
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
                bg="green.50"
              >
                <Text fontSize="3xl" color="green.500">
                  🛒
                </Text>
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
