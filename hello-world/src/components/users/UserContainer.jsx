import { Table } from "semantic-ui-react";

export default props => {
    return (
        <Table.Row>
            <Table.Cell>{props.name}</Table.Cell>
            <Table.Cell>{props.email}</Table.Cell>
        </Table.Row>
    );
};
