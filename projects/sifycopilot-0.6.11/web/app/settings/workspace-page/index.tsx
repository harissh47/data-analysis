'use client'

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/app/components/base/button';
import Modal from '@/app/components/base/modal';
import { useAppContext } from '@/context/app-context';
import { CommonResponse } from '@/models/common';
import { apiPrefix } from '@/config';
import { error } from 'console';
import { Data } from 'emoji-mart';
import useSWR, { mutate } from 'swr';

interface Workspace {
  email: string;
  name: string;
  password: string;
}

export default function WorkspacePage() {
  const { t } = useTranslation();
  const { userProfile } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
  });
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for missing fields
    if (!formData.email || !formData.name || !formData.password) {
      setErrorMessage('All fields are required.');
      console.error('Form data is incomplete. Please fill out all fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      // Prepare the request payload
      const requestPayload = {
        email: formData.email,
        name: formData.name,
        password: formData.password,
      };

      // Send the API request to /guesttenantapi
      // const response = await fetch('http://localhost:5001/console/api/guesttenantapi', {
      // 
      // const response = await fetch(`${apiPrefix}/guesttenantapi`, {
      const response = await fetch(`${apiPrefix}/newworkspaceowner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      // Check if the response is OK (status code 2xx)
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error from server:', errorData);
        setErrorMessage(errorData.message || 'An error occurred while creating workspace.');
        return;
      }

      const responseData = await response.json();
      console.log('API Response:', responseData); // Log the response to console

      if (responseData.result === 'success') {
        // If successful, update the UI
        const newWorkspace: Workspace = {
          email: formData.email,
          name: formData.name,
          password: formData.password,
        };

        // const storedWorkspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');
        // storedWorkspaces.push(newWorkspace);
        // localStorage.setItem('workspaces', JSON.stringify(storedWorkspaces));
        // setWorkspaces(storedWorkspaces);

        setWorkspaces((prevWorkspaces) => [...prevWorkspaces, newWorkspace])

        setFormData({ email: '', name: '', password: '' });
        closeModal();
      } else {
        setErrorMessage('Failed to create workspace');
      }
    } catch (e: any) {
      console.error('Unexpected error:', e);
      setErrorMessage('An error occurred while creating workspace.');
    } finally {
      setIsSubmitting(false);
    }


  };

  useEffect(() => {
    const storedWorkspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');
    setWorkspaces(storedWorkspaces);
  }, []);

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-2xl dark:bg-[#1A1A1A] dark:border-2 dark:border-[#3F3F3F] dark:rounded-xl dark:shadow-sm dark:hover:bg-zinc-800 cursor-pointer dark:text-white'>
          <span>Create a new Workspace</span>
          <Button onClick={openModal} type='primary' className='text-sm px-4 py-2'>
            Add
          </Button>
        </div>

        <div className='overflow-visible lg:overflow-visible'>
          <div className='flex items-center py-[7px] border-b border-gray-200 dark:border-[#5f5f5f] min-w-[480px]'>
            <div className='grow px-3 text-xs font-medium text-gray-500 dark:text-white'>Email</div>
            <div className='shrink-0 w-[104px] text-xs font-medium text-gray-500 dark:text-white'>Role</div>
          </div>

          {workspaces?.map((workspace, index) => (
            <div
              key={index}
              className='py-3 border-b border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700'
            >
              <div className='px-3 text-sm font-medium text-gray-700 dark:text-gray-200'>{workspace.email}</div>
              <div className='px-3 text-sm text-gray-500 dark:text-gray-400'>{workspace.name}</div>
              <div className='px-3 text-sm text-gray-500 dark:text-gray-400'>
                Password: {workspace.password ? '******' : 'Not Set'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <Modal
          onClose={closeModal}
          isShow={isModalOpen}
          closable={true}
          wrapperClassName='!z-50'
          className='!w-[362px] !p-0'
        >
          <div className='p-4'>
            <h2 className='text-xl mb-4 text-gray-900 dark:text-white'>
              {t('AddWorkspace')}
            </h2>
            <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                  {t('Email')}
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='mt-1 block w-full p-2 border border-gray-300 dark:border-[#5f5f5f] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-[#333] dark:text-white'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                  {t('UserName')}
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className='mt-1 block w-full p-2 border border-gray-300 dark:border-[#5f5f5f] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-[#333] dark:text-white'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                  {t('Password')}
                </label>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className='mt-1 block w-full p-2 border border-gray-300 dark:border-[#5f5f5f] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-[#333] dark:text-white'
                  required
                />
              </div>

              {/* Error Message Display */}
              {errorMessage && (
                <div className='text-red-500 text-sm mt-2'>
                  {t(errorMessage)}
                </div>
              )}

              <div className='flex justify-end space-x-3 '>
                <Button type='default' 
                onClick={closeModal}          
                 className='mr-2 text-sm font-medium dark:border-0 dark:bg-[#3f3f3f] dark:hover:bg-zinc-800'
                >

                  {t('Cancel')}
                </Button>
                <Button
                  type='primary'
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.email || !formData.name || !formData.password}
                >
                  {isSubmitting ? t('Saving') : t('Add')}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
}


// 'use client'

// import Button from "@/app/components/base/button"
// import Modal from "@/app/components/base/modal"
// import index from "@/app/components/datasets/api"
// import { useAppContext } from "@/context/app-context"
// import { fetchMembers } from "@/service/common"
// import React, { useState } from "react"
// import useSWR from "swr"

// interface Workspace {
//     // workspaceName: string
//     // ownerName: string
//     email: string
//     name: string
//     password: string
//     role: string 
// }

// const WorkspacePage = () => {
//     const { userProfile } = useAppContext()
//     const { data } = useSWR({ url: '/workspaces/current/members' }, fetchMembers) // Fetch member data
//     const accounts = data?.accounts || []
//     const isOwner = accounts.some(account => account.role === 'owner' && account.email === userProfile.email)
//     const [isModalOpen, setIsModalOpen] = useState(false)
//     const [formData, setFormData] = useState({
//         email: '',
//         name: '',
//         password: '',
//         role: 'Normal'
//     })
//     // const [formData, setFormData] = useState({
//     //     workspaceName: '',
//     //     ownerName: '',

//     // })


//     const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

//     // const openModal = () => setIsModalOpen(true)
//     const openModal = () => {
//         if (isOwner) setIsModalOpen(true)
//     }
//     const closeModal = () => setIsModalOpen(false)

//     // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     //     const { name, value } = e.target
//     //     setFormData((prevData) => ({ ...prevData, [name]: value }))
//     // }

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target
//         setFormData((prevData) => ({ ...prevData, [name]: value }))
//     }

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault()
//         setWorkspaces((prevWorkspaces) => [...prevWorkspaces, formData])
//         // setFormData({ workspaceName: '', ownerName: '' })
//         // setFormData({ email: '', name: '', password: '' })
//         setFormData({ email: '', name: '', password: '', role: 'Normal' })
//         console.log(formData)
//         closeModal()
//     }
//     return (
//         <>
//             <div className='flex flex-col'>
//                 <div className={`flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-2xl dark:bg-[#1A1A1A] dark:border-2 dark:border-[#3F3F3F] dark:rounded-xl dark:shadow-sm dark:hover:bg-zinc-800 cursor-pointer dark:text-white
//                     ${isOwner ? 'cursor-pointer' : 'cursor-not-allowed grayscale'}`}>
//                     <span>Create a new Workspace</span>
//                     {isOwner && (
//                         <Button onClick={openModal} type="primary" className="text-sm px-4 py-2">Add</Button>
//                     )}
//                 </div>

//                 {/* <div className="overflow-visible lg:overflow-visible">
//                     <div className="flex items-center py-[7px] border-b border-gray-200 min-w-[480px]">
//                         <div className="grow px-3 text-xs font-medium text-gray-500 dark:text-white">Email</div>
//                         <div className="grow px-3 text-xs font-medium text-gray-500 dark:text-white">Name</div>
//                         <div className='shrink-0 w-[104px] text-xs font-medium text-gray-500 dark:text-white'>Role</div>
//                     </div>
//                     {workspaces.map((workspace, index) => (
//                         <div key={index} className="flex items-center py-2 border-b border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
//                             <div className="grow px-3 text-sm text-gray-700 dark:text-gray-200">{workspace.email}</div>
//                             <div className="grow px-3 text-sm text-gray-700 dark:text-gray-200">{workspace.name}</div>
//                             <div className="shrink-0 w-[104px] text-sm text-gray-700 dark:text-gray-200">Role</div>
//                         </div>
//                     ))}
//                 </div> */}
//                 <div className="overflow-visible lg:overflow-visible">
//                     <div className="flex items-center py-[7px] border-b border-gray-200 min-w-[480px]">
//                         <div className="grow px-3 text-xs font-medium text-gray-500 dark:text-white">Email</div>
//                         <div className="shrink-0 w-[104px] text-xs font-medium text-gray-500 dark:text-white">Role</div>
//                     </div>

//                     {workspaces.map((workspace, index) => (
//                         <div key={index} className="py-3 border-b border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
//                             {/* Email */}
//                             <div className="px-3 text-sm font-medium text-gray-700 dark:text-gray-200">{workspace.email}</div>
//                             {/* Name under Email */}
//                             <div className="px-3 text-sm text-gray-500 dark:text-gray-400">{workspace.name}</div>
//                             {/* Password with placeholder text */}
//                             <div className="px-3 text-sm text-gray-500 dark:text-gray-400">Password: {workspace.password ? '******' : 'Not Set'}</div>
//                         </div>
//                     ))}
//                 </div>

//             </div>

//             {isModalOpen && (
//                 <Modal
//                     onClose={closeModal}
//                     isShow={isModalOpen}
//                     closable={true}
//                     wrapperClassName="!z-50"
//                     className="!w-[362px] !p-0"
//                 >
//                     <div className="p-4">
//                         <h2 className="text-xl mb-4 text-gray-900 dark:text-white">Add Workspace</h2>
//                         <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 dark:text-white">Email</label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     // value={formData.workspaceName}
//                                     value={formData.email}
//                                     onChange={handleInputChange}
//                                     className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-[#333] dark:text-white"
//                                     required
//                                 ></input>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 dark:text-white">User Name</label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     // value={formData.ownerName}
//                                     value={formData.name}
//                                     onChange={handleInputChange}
//                                     className="mt-1 block w-full p-2 borer border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-[#333] dark:text-white"
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 dark:text-white">Password</label>
//                                 <input
//                                     type="password"
//                                     name="password"
//                                     // value={formData.ownerName}
//                                     value={formData.password}
//                                     onChange={handleInputChange}
//                                     className="mt-1 block w-full p-2 borer border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-[#333] dark:text-white"
//                                     required
//                                 />
//                             </div>

//                         {/* role */}

//                         <div>
//                                 <label className="block text-sm font-medium text-gray-700 dark:text-white">Role</label>
//                                 <select
//                                     name="role"
//                                     value={formData.role}
//                                     onChange={handleInputChange}
//                                     className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-[#333] dark:text-white"
//                                     required
//                                 >
//                                     <option value="Admin">Admin</option>
//                                     <option value="Editor">Editor</option>
//                                     <option value="Normal">Normal</option>
//                                 </select>
//                             </div>


//                             <div className="flex justify-end space-x-3">
//                                 <Button type="default" onClick={closeModal}>Cancel</Button>
//                                 <Button type="primary" onClick={handleSubmit}>Add</Button>
//                             </div>
//                         </form>
//                     </div>
//                 </Modal>
//             )}

//         </>
//     )
// }

// export default WorkspacePage
