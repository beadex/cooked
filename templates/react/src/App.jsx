import { Component } from "react";
import { Container } from "semantic-ui-react";
import Home from "./views/Home";
class App extends Component {
    render() {
        return (
            <Container fluid className="container">
                <Home />
            </Container>
        );
    }
}

export default App;
