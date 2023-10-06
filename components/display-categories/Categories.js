// Categories.js
import Link from "next/link";
import React from "react";

const Categories = ({ categories }) => {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category.id}>
          <Link href={`/category/${category.slug}`}>{category.name}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Categories;
