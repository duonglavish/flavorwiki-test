import React from "react";

const Loading = ({isFetch}) => {
    return (
        !!isFetch && <div id="overlay">
            <div className="loader"></div>
        </div>
    );
};
export default React.memo(Loading);