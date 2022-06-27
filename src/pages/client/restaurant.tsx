import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { restaurant, restaurantVariables } from "../../__generated__/restaurant";

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

type SeeRestaurantParams = {
  id: string;
};

export const Restaurant = () => {
  const { id } = useParams<keyof SeeRestaurantParams>() as SeeRestaurantParams;
  const { loading, data } = useQuery(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +id,
      },
    },
  });
  return <h1>Restaurant</h1>;
};
