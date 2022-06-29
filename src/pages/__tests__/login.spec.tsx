import { ApolloProvider } from "@apollo/client";
import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { Login, LOGIN_MUTATION } from "../login";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(() => {
    mockedClient = createMockClient();
    // eslint-disable-next-line testing-library/no-render-in-setup
    renderResult = render(
      <HelmetProvider>
        <Router>
          <ApolloProvider client={mockedClient}>
            <Login />
          </ApolloProvider>
        </Router>
      </HelmetProvider>
    );
  });
  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });
  it("displays email validation errors", async () => {
    // eslint-disable-next-line no-empty-pattern
    const {} = renderResult;
    const email = screen.getByPlaceholderText(/email/i);
    userEvent.type(email, "this@wont");
    await waitFor(() => {
      let errorMessage = screen.getByRole("alert");
      expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);
    });
    userEvent.clear(email);
    await waitFor(() => {
      let errorMessage = screen.getByRole("alert");
      expect(errorMessage).toHaveTextContent(/email is required/i);
    });
  });
  it("display password required errors", async () => {
    // eslint-disable-next-line no-empty-pattern
    const {} = renderResult;
    const email = screen.getByPlaceholderText(/email/i);
    const submitBtn = screen.getByRole("button");
    userEvent.type(email, "this@wont.com");
    userEvent.click(submitBtn);
    await waitFor(() => {
      const errorMessage = screen.getByRole("alert");
      expect(errorMessage).toHaveTextContent(/password is required/i);
    });
  });
  it("submits form and calls mutation", async () => {
    // eslint-disable-next-line no-empty-pattern
    const {} = renderResult;
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const submitBtn = screen.getByRole("button");
    const formData = {
      email: "real@test.com",
      password: "123",
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "XXX",
          error: null,
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    });
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: formData.email,
        password: formData.password,
      },
    });
  });
});
