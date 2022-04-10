import { update } from './Update';


const initialState = {
    movedCell: null
};


export function updateCell  (state, action)  {
    return update( state, { 
        movedCell: action.data
    } );      
};



export function reducer ( state = initialState, action )  {
    switch ( action.type ) {
        case ('MOVE_CELL'): return updateCell(state, action); 
        default:
            return state;
    }
};


export default reducer;