import React, { useState } from "react";

function RecommendedProducts({ Products }) {
  const [likedProducts, setLikedProducts] = useState([]);

  // Function to get recommended products based on liked products
  function getRecommendedProducts() {
    const recommendedProducts = [];
    likedProducts.forEach((likedProduct) => {
      const likedCategory = likedProduct.category;
      Products.forEach((product) => {
        if (product.category === likedCategory) {
          recommendedProducts.push(product);
        }
      });
    });

    // Remove duplicates
    return Array.from(new Set(recommendedProducts));
  }

  // Function to handle liking a product
  const handleLikeProduct = (product) => {
    if (!likedProducts.some((likedProduct) => likedProduct._id === product._id)) {
      setLikedProducts([...likedProducts, product]);
    }
  };

  // Get recommended products based on liked products
  const recommendedProducts = getRecommendedProducts();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Recommended Products</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recommendedProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white border rounded-lg shadow-lg p-4"
          >
            <p className="text-lg font-semibold">{product.name}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold my-4">Liked Products</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Products.map((product) => (
          <div
            key={product._id}
            className="bg-white border rounded-lg shadow-lg p-4"
          >
            <p className="text-lg font-semibold">
              {product?.name}{" "}
              <button
                onClick={() => handleLikeProduct(product)}
                className="px-2 py-1 bg-blue-500 rounded hover:bg-blue-600"
              >
                Like
              </button>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedProducts;
