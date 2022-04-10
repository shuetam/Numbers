export const update = (state, updatedProperties) => {
    return {
        ...state,
        ...updatedProperties
    };
};