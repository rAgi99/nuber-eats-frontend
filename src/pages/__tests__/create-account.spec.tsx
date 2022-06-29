/* eslint-disable no-empty-pattern */
import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import { render, waitFor, RenderResult, screen } from "@testing-library/react";
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../create-account";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../__generated__/globalTypes";

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(() => {
    mockedClient = createMockClient();
    // eslint-disable-next-line testing-library/no-render-in-setup
    renderResult = render(
      <HelmetProvider>
        <Router>
          <ApolloProvider client={mockedClient}>
            <CreateAccount />
          </ApolloProvider>
        </Router>
      </HelmetProvider>
    );
  });
  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Create Account | Nuber Eats");
    });
  });
  it("renders validation errors", async () => {
    const {} = renderResult;
    const email = screen.getByPlaceholderText(/email/i);
    const button = screen.getByRole("button");

    userEvent.type(email, "wont@work");
    await waitFor(() => {
      let errorMessage = screen.getByRole("alert");
      expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
    });

    userEvent.clear(email);
    await waitFor(() => {
      let errorMessage = screen.getByRole("alert");
      expect(errorMessage).toHaveTextContent(/email is required/i);
    });

    userEvent.type(email, "working@email.com");
    userEvent.click(button);
    await waitFor(() => {
      let errorMessage = screen.getByRole("alert");
      expect(errorMessage).toHaveTextContent(/password is required/i);
    });
  });
  it("submits mutation with form values", async () => {
    const {} = renderResult;
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole("button");
    const formData = {
      email: "working@mail.com",
      password: "12",
      role: UserRole.Client,
    };
    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        CreateAccount: {
          ok: true,
          error: "mutation-error",
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse
    );
    jest.spyOn(window, "alert").mockImplementation(() => null);
    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    userEvent.click(button);
    await waitFor(() => {
      expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
        createAccountInput: {
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
      });
    });
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");
    });
    const mutationError = screen.getByRole("alert");
    await waitFor(() => {
      expect(mutationError).toHaveTextContent("mutation-error");
    });
  });
});
