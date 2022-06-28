import { ApolloProvider } from "@apollo/client";
import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import { createMockClient } from "mock-apollo-client";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { Login } from "../login";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  let renderResult: RenderResult;
  beforeEach(() => {
    const mockedClient = createMockClient();
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
  });
});
