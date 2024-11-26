import React from "react";
import { render, screen } from "@testing-library/react";

import ContactPage from "../ContactPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders contact page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ContactPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("contact-datatable")).toBeInTheDocument();
    expect(screen.getByRole("contact-add-button")).toBeInTheDocument();
});
