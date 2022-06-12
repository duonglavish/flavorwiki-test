import React, { useState, useEffect, useMemo, useRef } from "react";
import UserService from "../services/Api";
import { useTable, useRowSelect } from "react-table";
import Modal from "./Modal";
import Loading from "./Loading";

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef

        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
            <>
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
        )
    }
)

const UsersList = (props) => {
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [action, setAction] = useState("");
    const [userData, setUserData] = useState({});
    const [isFetch, setIsFetch] = useState(false);

    const usersRef = useRef([]);
    usersRef.current = users;

    const columns = useMemo(
        () => [
            {
                Header: "Full Name",
                accessor: "fullname",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Phone Number",
                accessor: "phonenumber"
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props?.row?.id;
                    return (
                        <div>
                            <span onClick={() => editUser(rowIdx)}>
                                <i className="far fa-edit action mr-3"></i>
                            </span>
                            <span onClick={() => deleteUser(rowIdx)}>
                                <i className="fas fa-trash action"></i>
                            </span>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        selectedFlatRows,
    } = useTable({
        columns,
        data: users,
    },
        useRowSelect,
        hooks => {
            hooks?.visibleColumns?.push(columns => [
                // Let's make a column for selection
                {
                    id: 'selection',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div>
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
                ...columns,
            ])
        });

    useEffect(() => {
        retrieveUsers();
    }, []);

    const addUser = () => {
        setAction("add")
        setUserData({})
        setShow(true);
    }
    
    const retrieveUsers = () => {
        UserService.getAll()
            .then((response) => {
                setUsers(response?.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const editUser = (rowIndex) => {
        const user = usersRef?.current?.[rowIndex];
        setAction("edit")
        setUserData({
            id: user?.id,
            fullname: user?.fullname,
            email: user?.email,
            phonenumber: user?.phonenumber
        })
        setShow(true);
    };

    const deleteMutilUser = async () => {
        setIsFetch(true)
        let newUsers = [...usersRef?.current];
        for (let i of selectedFlatRows) {
            const { original } = i
            await UserService.remove(original?.id)
        }
        setIsFetch(false)
        selectedFlatRows.map(({ original }) => {
            const rowIndex = newUsers.findIndex(e => e?.id === original?.id)
            newUsers.splice(rowIndex, 1);
        })
        setUsers(_ => [...newUsers])
    }

    const deleteUser = (rowIndex) => {
        const id = usersRef?.current?.[rowIndex]?.id;
        UserService.remove(id)
            .then((response) => {
                let newUsers = [...usersRef?.current];
                newUsers.splice(rowIndex, 1);
                setUsers(newUsers);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    return (
        <>
            <div className="list row">
                <div className="col-md-12 list">
                    <table
                        className="table table-striped table-bordered"
                        {...getTableProps()}
                    >
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup?.getHeaderGroupProps()}>
                                    {headerGroup?.headers?.map((column) => (
                                        <th {...column?.getHeaderProps()}>
                                            {column?.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map((row, i) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell) => {
                                            return (
                                                <td {...cell?.getCellProps()}>{cell?.render("Cell")}</td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="col-md-8">
                    <button className="btn btn-sm btn-success mr-3" onClick={addUser}>
                        Add
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={deleteMutilUser}>
                        Delete
                    </button>
                </div>

                <Modal setShow={setShow} show={show} setUsers={setUsers} action={action} userData={userData} />
            </div>
            <Loading isFetch={ isFetch }/>
        </>
    );
};
export default React.memo(UsersList);