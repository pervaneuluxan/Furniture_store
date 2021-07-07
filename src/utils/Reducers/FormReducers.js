const FormReducer=(state,action)=>{
    switch(action.type){
        case "Handle input text":
            return{
                ...state,
                [action.field] :action.payload,
            };
            case "Show error":
                return{
                    ...state,
                    showError: !state.showError
                };

                default:
                return state;
    }
}
export default FormReducer;