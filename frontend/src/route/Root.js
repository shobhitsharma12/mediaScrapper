import React, { Component } from "react";

class Root extends Component {
    render() {
        let renderData;
        renderData = (
            this.props.children
        );

        return (
            <div>
                {renderData}
            </div>
        );
    }
}

export default Root;