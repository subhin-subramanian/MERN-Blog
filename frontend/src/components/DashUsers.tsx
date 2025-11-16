import { Alert, Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell,TableRow } from "flowbite-react";
import { useEffect, useState } from "react"
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";
import { RootState } from "../redux/store";
import { User } from "../types/user";

function DashUsers() {
  const [users,setUsers] = useState <User[]> ([]);
  const {currentUser} = useSelector((state : RootState)=>state.user);
  const [usersError,setUsersError] = useState <string | null> (null);
  const [showMore,setShowMore] = useState <boolean> (false);
  const [showModal,setShowModal] = useState <boolean> (false);
  const [userIdDelete,setUserIdDelete] = useState <string |null> (null);

  // FetchUsers function with useEffect the posts while opening the page
  useEffect(()=>{
    const fetchUsers = async()=>{
      setUsersError(null);
      try {        
        const res = await fetch('/api/user/getusers');
        const data = await res.json();
        if(!res.ok){
          setUsersError(data.message);
        }
        setUsers(data.datafromBknd.users);
      } catch (error:any) {
        setUsersError(error.message);
      }
    }
    if(currentUser && currentUser.isAdmin){
      fetchUsers();
    }
  },[currentUser]);

  // Showmore function to display users if total users is more than 9
  const handleShowMore = async()=>{
    try {
      const res = await fetch(`/api/user/getusers?startIndex=9`);
      const data = await res.json();
      if(!res.ok){
        setUsersError(data.message);
        return;
      }
      if(data.datafromBknd.users.length >= 9){
        setShowMore(true);
      }
      setUsers(prev=>([...prev,...data.datafromBknd.users]));
      setUsersError(null);
    } catch (error:any) {
      setUsersError(error.message);        
    }
  }

   // Function to delete a user
   const handleDelete = async()=>{
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${userIdDelete}`,{method:'DELETE'});
      const data = await res.json();
      if(!res.ok){
        setUsersError(data.message);
        return;
      }
      setUsers(prev=>prev.filter((user : User)=>user._id!==userIdDelete));
      setUsersError(null);
    } catch (error:any) {
      setUsersError(error.message);        
    }
  }

  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3">
      {currentUser?.isAdmin && users.length >0 ?(
        <>
         <Table hoverable className="shadow-md min-w-[800px]">
          <TableHead>
            <TableRow>
              <TableHeadCell>Date Created</TableHeadCell>
              <TableHeadCell>Profile Picture</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Admin</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableRow>
          </TableHead>
           
            <TableBody  className=" dark:bg-blue-900">
            {users.map((user : User)=>(
              <TableRow key={user._id} className="shadow-sm">
                <TableCell>{new Date(user.createdAt as string).toLocaleDateString()}</TableCell>
                <TableCell><img src={user.profilePic} alt="user-img" className="w-10 h-10 object-cover rounded-full" /></TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ?<FaCheck className="text-green-500"/> : <FaTimes className="text-red-500"/>}</TableCell>
                <TableCell><span className="text-red-500 font-semibold hover:underline cursor-pointer" onClick={()=>{setShowModal(true),setUserIdDelete(user._id)}}>Delete</span></TableCell>    
              </TableRow>
          ))}
            </TableBody>
         </Table>
         {showMore && <button onClick={handleShowMore} className="font-semibold hover:underline hover:text-blue-600 w-full text-center my-5">show more</button>}
        </>
      ):<p>no users yet!</p>}
      {usersError && <Alert color="failure">{usersError}</Alert>}
      <Modal show={showModal} onClose={()=>setShowModal(false)} popup size="md">
        <ModalHeader/>
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 mb-4 mx-auto"/>
              <h3 className="mb-5 text-lg text-blue-800">Are you sure you want to delete the account?</h3>
              <div className="flex justify-center gap-5">
                <Button color='alternative' onClick={handleDelete}>Yes I'm sure</Button>
                <Button color='default' onClick={()=>setShowModal(false)}>No I'm not</Button>
              </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default DashUsers
