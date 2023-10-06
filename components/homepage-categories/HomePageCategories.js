import { Box, List, ListItem } from "@chakra-ui/react";
import Link from "next/link";
import { useQuery } from "react-query"; // Import react-query

function Homepage() {
  const { data: categories } = useQuery(
    "homepageCategories",
    fetchHomepageCategories
  );

  return (
    <Box>
      <h1>Homepage Categories</h1>
      <List>
        {categories?.map((category) => (
          <ListItem key={category.id}>
            <Link href={`/${category.slug}`}>{category.name}</Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

// Fetch homepage categories from an API endpoint
async function fetchHomepageCategories() {
  const response = await fetch("/api/homepage-categories"); // Replace with  API endpoint
  const data = await response.json();
  return data;
}

export default Homepage;
