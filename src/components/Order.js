import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { formatPrice } from "../helpers";

class Order extends React.Component {
  renderOrder = key => {
    const fish = this.props.fishes[key];
    const count = this.props.order[key];
    const isAvailable = fish && fish.status === "available";
    const transitionOption = {
      classNames: "order",
      key,
      timeout: { enter: 250, exit: 250 }
    };
    //make sure fish loaded
    if (!fish) return null;
    if (!isAvailable) {
      return (
        <CSSTransition {...transitionOption}>
          <li key={key}>
            Sorry {fish ? fish.name : "fish"} is no longer available
          </li>
        </CSSTransition>
      );
    }
    return (
      <CSSTransition {...transitionOption}>
        <li key={key}>
          <span>
            <TransitionGroup component="span" className="count">
              <CSSTransition
                classNames="count"
                key={count}
                timeout={{ enter: 250, exit: 250 }}
              >
                <span>{count}</span>
              </CSSTransition>
            </TransitionGroup>
            lbs {fish.name}
            {formatPrice(count * fish.price)}
            <button onClick={() => this.props.removeFromOrder(key)}>
              &times;{" "}
            </button>
          </span>
        </li>
      </CSSTransition>
    );
  };

  render() {
    const orderIDs = Object.keys(this.props.order);
    const total = orderIDs.reduce((prevTotal, key) => {
      const fish = this.props.fishes[key];
      const count = this.props.order[key];
      const isAvailable = fish && fish.status === "available";
      if (isAvailable) {
        return prevTotal + count * fish.price;
      }
      return prevTotal;
    }, 0);

    return (
      <div className="orderwrap">
        <h2>Order</h2>
        <TransitionGroup component="ul" className="order">
          {orderIDs.map(this.renderOrder)}
        </TransitionGroup>
        <div className="total">
          <strong>Total: {formatPrice(total)}</strong>
        </div>
      </div>
    );
  }
}

export default Order;
