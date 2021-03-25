import { gql, useQuery, useMutation } from '@apollo/client';
import ErrorMessage from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import { useState } from 'react';

const ALL_USERS_QUERY = gql`
    query ALL_USERS_QUERY {
        getAllUsers {
            id
            name
            email
            permissions
        }
    }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation UPDATE_PERMISSIONS_MUTATION ($permissions: [Permission], $userId: ID!) {
        updatePermissions(permissions: $permissions, userId: $userId) {
            id
            name
            email
            permissions
        }
    }
`;

const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE',
]

const PermissionsForm = () => {
    const { loading, error, data } = useQuery(ALL_USERS_QUERY);
    if(loading) return <p>loading...</p>
    if(error) return <ErrorMessage error={ error } />

    return (
        <div>
            <ErrorMessage error={ error } />
            <h2>Manage User Permissions</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        {possiblePermissions.map((permission, idx) => <th key={idx}>{permission}</th>)}
                        <th>👇🏾</th>
                    </tr>
                </thead>
                <tbody>
                    {data.getAllUsers.map(user => (
                        <UserPermisssions key={user.id} user={user} />
                    ))}
                </tbody>
            </Table>
        </div>
    )
};

const UserPermisssions = ({user}) => {
    const [permissions, setPermissions] = useState(user.permissions);
    const [sendPermissions, {error, loading, data}] = useMutation(UPDATE_PERMISSIONS_MUTATION, {
        variables: {
            permissions,
            userId: user.id
        }
    })

    const handleChange = e => {
        const checkbox = e.target;
        let updatedPermissions = [...permissions];
        if(checkbox.checked) {
            updatedPermissions.push(checkbox.value);
        }
        if(!checkbox.checked) {
            updatedPermissions =  updatedPermissions.filter(permission => (
                permission != checkbox.value
            ));
        }
        setPermissions([...updatedPermissions]);
    }
    return (
        <>
        {error && <tr><td colSpan="8"><ErrorMessage error={error} /></td></tr>}
        <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            {possiblePermissions.map((permission, idx) => (
                <td key={idx}>
                    <label htmlFor={`${user.id}-permisssion-${permission}`}>
                        <input 
                            id={`${user.id}-permisssion-${permission}`}
                            type="checkbox" 
                            checked={permissions.includes(permission)} 
                            value={permission}
                            onChange={handleChange} 
                        />
                    </label>
                </td>
            ))}
            <td>
                <SickButton type="button" disabled={loading} onClick={sendPermissions}>Updat{loading ? "ing" : "e"}</SickButton>
            </td>
        </tr>
        </>
    );
};

export default PermissionsForm;