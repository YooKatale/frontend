import React from "react";
import Categories from "./Categories";
import Link from "next/link";

const ProductListingPage = ({ products, categories }) => {
  return (
    <div>
      <h1>Products</h1>
      <Categories categories={categories} />{" "}
      {/* Use the Categories component */}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductListingPage;
