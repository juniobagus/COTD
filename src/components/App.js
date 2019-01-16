import React from "react";
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import sampleFishes from "../sample-fishes";
import Fish from "./Fish";
import base from "../base";

class App extends React.Component {
  state = {
    fishes: {},
    order: {}
  };

  componentDidMount() {
    const { params } = this.props.match;
    // reinstate localstorage
    const localStorageRef = localStorage.getItem(params.storeID);
    if (localStorageRef) {
      //set the local storage to state
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
    this.ref = base.syncState(`${params.storeID}/fishes`, {
      context: this,
      state: "fishes"
    });
  }

  componentDidUpdate() {
    localStorage.setItem(
      this.props.match.params.storeID,
      JSON.stringify(this.state.order)
    );
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  addFish = fish => {
    //1. Take a copy of existing state
    const fishes = { ...this.state.fishes };
    //2. add new fish to the fishes
    fishes[`fish${Date.now()}`] = fish;
    //3. Set the new fishes to state
    this.setState({
      fishes: fishes
    });
  };

  updateFish = (key, updatedFish) => {
    //1. take a copy of current state of fishes
    const fishes = { ...this.state.fishes };
    //2. update the state
    fishes[key] = updatedFish;
    //3. set that to state
    this.setState({ fishes });
  };

  deleteFish = key => {
    //1. take a copy of fishees
    const fishes = { ...this.state.fishes };
    //2. update the fish
    fishes[key] = null;
    //3. update state
    this.setState({ fishes });
  };

  loadSampleFishes = () => {
    this.setState({ fishes: sampleFishes });
  };

  addToOrder = key => {
    //1. Take a copy of paste
    const order = { ...this.state.order };
    //2. Either add or update
    order[key] = order[key] + 1 || 1;
    //3. call setState to update state object
    this.setState({ order });
  };

  removeFromOrder = key => {
    //1. Take a copy of paste
    const order = { ...this.state.order };
    //2. Remove from order
    delete order[key];
    //3. call setState to update state object
    this.setState({ order });
  };

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh seafood market" />
          <ul className="fishes">
            {Object.keys(this.state.fishes).map(key => (
              <Fish
                key={key}
                index={key}
                details={this.state.fishes[key]}
                addToOrder={this.addToOrder}
              >
                {key}
              </Fish>
            ))}
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          fishes={this.state.fishes}
          addFish={this.addFish}
          updateFish={this.updateFish}
          deleteFish={this.deleteFish}
          loadSampleFishes={this.loadSampleFishes}
          storeID={this.props.match.params.storeID}
        />
      </div>
    );
  }
}

export default App;
