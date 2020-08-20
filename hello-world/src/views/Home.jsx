import { Component } from "react";
import { Container, Table } from "semantic-ui-react";
import UserContainer from "../components/users/UserContainer";
import create_UUID from "@/utils/uuid";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [
                {
                    id: create_UUID(),
                    name: "Phong Tran",
                    email: "tranphongbb@outlook.com",
                },
                {
                    id: create_UUID(),
                    name: "Thao Pham",
                    email: "pphuongthao22@gmail.com",
                },
            ],
        };
    }

    render() {
        const users = this.state.users.map(user => <UserContainer key={user.id} name={user.name} email={user.email} />);

        return (
            <Container>
                <Table celled padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>{users}</Table.Body>
                </Table>
            </Container>
        );
    }
}

export default Home;
