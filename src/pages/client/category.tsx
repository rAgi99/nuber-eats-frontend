import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useParams } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { category, categoryVariables } from "../../__generated__/category";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const Category = () => {
  const location = useLocation();
  const params = useParams<{ slug: string }>();
  const { data, loading } = useQuery<category, categoryVariables>(CATEGORY_QUERY, {
    variables: {
      input: {
        page: 1,
        slug: params.slug + "",
      },
    },
  });
  return (
    <div>
      <Helmet>
        <title>Category | Nuber Eats</title>
      </Helmet>
      <div className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <span className="text-white mr-3 opacity-60 font-semibold text-3xl">
          You're result for {location.pathname.split("/category/")} has
        </span>
        <span className="text-white opacity-60 font-semibold text-3xl">
          {data?.category.restaurants?.length} items
        </span>
      </div>
      <div>
        {!loading && (
          <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.category.restaurants?.map((restaurant) => (
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id + ""}
                  coverImg={restaurant.coverImg}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
