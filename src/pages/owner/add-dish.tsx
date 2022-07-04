import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { createDish, createDishVariables } from "../../__generated__/createDish";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IForm {
  name: string;
  price: string;
  description: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navaigate = useNavigate();
  const [createDishMutaion, { loading }] = useMutation<createDish, createDishVariables>(
    CREATE_DISH_MUTATION,
    {
      refetchQueries: [
        {
          query: MY_RESTAURANT_QUERY,
          variables: {
            input: {
              id: +restaurantId,
            },
          },
        },
      ],
    }
  );
  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
    setValue,
  } = useForm<IForm>({
    mode: "onChange",
  });
  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    createDishMutaion({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
        },
      },
    });
    navaigate(-1);
  };
  const [optionsNumber, setOptionsNumber] = useState(0);
  const onAddOptionClick = () => {
    setOptionsNumber((current) => current + 1);
  };
  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current - 1);
    // @ts-ignore
    setValue(`${idToDelete}-optionName`, "");
    // @ts-ignore
    setValue(`${idToDelete}-optionEXtra`, "");
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          {...register("name", { required: "Name is required." })}
          className="input"
          type="text"
          name="name"
          placeholder="Name"
        />
        <input
          {...register("price", { required: "Price is required." })}
          className="input"
          type="number"
          name="price"
          min={0}
          placeholder="Price"
        />
        <input
          {...register("description", { required: "Description is required." })}
          className="input"
          type="text"
          name="description"
          placeholder="Description"
        />
        <div className="my-10">
          <h4 className="font-medium  mb-3 text-lg">Dish Options</h4>
          <span
            onClick={onAddOptionClick}
            className=" cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-"
          >
            Add Dish Option
          </span>
          {optionsNumber !== 0 &&
            Array.from(new Array(optionsNumber)).map((_, index) => (
              <div key={index} className="mt-5">
                <input
                  // @ts-ignore
                  {...register(`${index}-optionName`)}
                  name={`${index}-optionName`}
                  className="py-2 px-4 mr-3 focus:outline-none focus:border-gray-600 border-2"
                  type="text"
                  placeholder="Option Name"
                />
                <input
                  // @ts-ignore
                  {...register(`${index}-optionExtra`)}
                  name={`${index}-optionExtra`}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                  type="number"
                  min={0}
                  placeholder="Option Extra"
                />
                <span onClick={() => onDeleteClick(index)}>Delete Option</span>
              </div>
            ))}
        </div>
        <Button loading={loading} canClick={isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};
