import { createSlice } from "@reduxjs/toolkit"

const companySlice = createSlice({
    name: "company",
    initialState: {
        departments: {
            departments: null,
            isFetching: false,
            error: false
        },
        positions: {
            positions: null,
            isFetching: false,
            error: false
        }
    },
    reducers: {
        getDepartmentsStart: (state) => {
            state.departments.isFetching = true;
        },
        getDepartmentsSuccess: (state, action) => {
            state.departments.isFetching = false;
            state.departments.departments = action.payload;
            state.departments.error = false;
        },
        getDepartmentsFailed: (state) => {
            state.departments.isFetching = false;
            state.departments.error = true;
        },
        getPositionsStart: (state) => {
            state.positions.isFetching = true;
        },
        getPositionsSuccess: (state, action) => {
            state.positions.isFetching = false;
            state.positions.positions = action.payload;
            state.positions.error = false;
        },
        getPositionsFailed: (state) => {
            state.positions.isFetching = false;
            state.positions.error = true;
        },

    }
});

export const {
    getDepartmentsStart,
    getDepartmentsSuccess,
    getDepartmentsFailed,
    getPositionsStart,
    getPositionsSuccess,
    getPositionsFailed
} = companySlice.actions;

export default companySlice.reducer