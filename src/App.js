import React, { Component } from 'react';
import { Dropdown, Button, Card, Container, Segment, Modal, Link } from "semantic-ui-react";
import { stateOptions } from "./stateOptions"
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      govt: [],
      stateSelection: "",
      govtSelection: "",
      stateOptions: stateOptions,
      govtOptions: [{key: "Representatives", value:"representatives", text: "Representatives"}, {key: "Senators", value:"senators", text: "Senators"} ]
    };
  }

/* Here I am handling the values of the dropdowns and updating the state in real time.*/
handleGovt = (event, { value }) => {
  let govtValue = value;
  this.setState({
    govtSelection: govtValue,
  })
  console.log(govtValue)
}

usState = (event, { value }) => {
  let stateValue = value;
  this.setState({
    stateSelection: stateValue,
  })
  console.log(stateValue)
}

onSubmit = () => {
  console.log(this.state)
  /* Here I am fetching the data for the correct endpoint by passing the state from the dropdown fields.*/
  fetch("http://localhost:3000/" + this.state.govtSelection + "/" + this.state.stateSelection)
  .then(results => {
    return results.json();
  }).then(data => {
    let govt = data.results.map((govt) => {
  /* Here i added some styling to change the color of the name tag to match their respective party */
    let partyData = govt.party ==="Republican";
    let partyColor = partyData === true ? "red" : "blue";
      return(
        /* Here i mapped out my search results and pass them into a modal triggered by a card.
          They take the information passed down from the result data and display it neatly*/
        <Modal size="mini" key={govt.results} trigger={
          <Card color={partyColor}>
          <Card.Content>
            <Card.Header>{govt.name}</Card.Header>
            <Card.Meta>Party: {govt.party}</Card.Meta>
          </Card.Content>
          </Card>
        }>
          <Modal.Header>{govt.name}</Modal.Header>
          <Modal.Description>
          <Segment borderless>
          <p>Party: {govt.party} </p>
          <p>District: {govt.district} </p>
          <p>Phone: {govt.phone} </p>
          <a href={govt.link}>{govt.name}'s Website</a>
          </Segment>
          </Modal.Description>
        </Modal>
      )
    })
    this.setState({govt: govt});
  })
}
  render() {

/* Here I created a simple if statement to use with my button to disable it.*/
    const isInvalid =
      this.state.govtSelection === "" ||
      this.state.stateSelection === "";

    return (
      <div className="App">
        <Container>
          <Segment>
              <Dropdown inverted onChange={this.handleGovt.bind(this)} placeholder="Government" options={this.state.govtOptions} selection/>
              <Dropdown onChange={this.usState.bind(this)} placeholder="State" options={this.state.stateOptions} search selection/>
              <Button type="submit" onClick={this.onSubmit} disabled={isInvalid} tertiary color="green"> Submit </Button>
          </Segment>
          <Card.Group centered>
            {this.state.govt}
          </Card.Group>
        </Container>
      </div>
    );
  }
}

export default App;
