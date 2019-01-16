import React from "react";
import PropTypes from "prop-types";
import AddFishForm from "./AddFishForm";
import EditFishForm from "./EditFishForm";
import Login from "./Login";
import firebase from "firebase";
import base, { firebaseApp } from "../base";

class Inventory extends React.Component {
  static propTypes = {
    fishes: PropTypes.object,
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func,
    loadSampleFishes: PropTypes.func
  };

  state = {
    uid: null,
    owner: null
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authHandler({ user });
      }
    });
  }

  authHandler = async authData => {
    console.log(authData);
    //1. look up the store in the database
    const store = await base.fetch(this.props.storeID, { context: this });
    console.log(store);
    //2. claim it there is no owner
    if (!store.owner) {
      //save
      await base.post(`${this.props.storeID}/owner`, {
        data: authData.user.uid
      });
    }
    //3. set the state to user state
    this.setState({
      uid: authData.user.uid,
      owner: store.owner || authData.user.uid
    });
  };

  authenticate = provider => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    firebaseApp
      .auth()
      .signInWithPopup(authProvider)
      .then(this.authHandler);
  };

  logout = async () => {
    console.log("login out");
    await firebase.auth().signOut();
    this.setState({ uid: null });
  };

  render() {
    const logout = <button onClick={this.logout}>Log out</button>;
    //1. check log in
    if (!this.state.uid) {
      return <Login authenticate={this.authenticate} />;
    }
    //2. check owner
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>You are not the owner</p>
          {logout}
        </div>
      );
    }
    //3. must be the owner
    return (
      <div className="inventory">
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.fishes).map(key => (
          <EditFishForm
            key={key}
            index={key}
            fish={this.props.fishes[key]}
            updateFish={this.props.updateFish}
            deleteFish={this.props.deleteFish}
          />
        ))}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSampleFishes}>
          Load Sample Fishes
        </button>
      </div>
    );
  }
}

export default Inventory;
