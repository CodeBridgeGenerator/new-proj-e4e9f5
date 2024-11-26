import React from "react";
import { render, screen } from "@testing-library/react";

import StudentPage from "../StudentPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders student page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <StudentPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("student-datatable")).toBeInTheDocument();
    expect(screen.getByRole("student-add-button")).toBeInTheDocument();
});
