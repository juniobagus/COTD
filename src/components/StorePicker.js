import React from 'react';
import { getFunName } from "../helpers";

class StorePicker extends React.Component {
    myInput = React.createRef();

    goToStore = (event) => {
        //1. stop form to submit
        event.preventDefault();
        //2. get the text from the input
        const storeName = this.myInput.current.value;
        //3. change the page
        this.props.history.push(`store/${storeName}`);
    }

    render() {
        return (
            <form className="store-selector" onSubmit={this.goToStore}>
                <h2>Please enter a stores</h2>
                <input
                    type="text"
                    ref={this.myInput}
                    required
                    placeholder="Store Name"
                    defaultValue={getFunName()}
                />
                <button type="submit" >Visit Store</button>
            </form>
        )
    }
}

export default StorePicker;