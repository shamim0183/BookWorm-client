"use client"

import ConfirmModal from "@/components/ConfirmModal"
import PageWrapper from "@/components/PageWrapper"
import ProtectedLayout from "@/components/ProtectedLayout"
import SuccessModal from "@/components/SuccessModal"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface User {
  _id: string
  name: string
  email: string
  role: "user" | "admin"
  photoURL?: string
  createdAt: string
}

export default function ManageUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} })
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean
    title: string
    message: string
  }>({ isOpen: false, title: "", message: "" })

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")

    if (!token || !userStr) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userStr)
    if (user.role !== "admin") {
      router.push("/library")
      toast.error("Access denied. Admin only.")
      return
    }

    fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(response.data.users || [])
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin"
    const userName = users.find((u) => u._id === userId)?.name || "this user"

    setConfirmModal({
      isOpen: true,
      title: `Change User Role?`,
      message: `Change ${userName}'s role to ${newRole.toUpperCase()}?`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token")
          await axios.put(
            `${API_URL}/users/${userId}/role`,
            { role: newRole },
            { headers: { Authorization: `Bearer ${token}` } }
          )

          setSuccessModal({
            isOpen: true,
            title: "Role Updated!",
            message: `${userName} is now ${
              newRole === "admin" ? "an" : "a"
            } ${newRole}.`,
          })

          fetchUsers()
        } catch (error: any) {
          toast.error(error.response?.data?.error || "Failed to update role")
        }
      },
    })
  }

  const handleDelete = async (userId: string) => {
    const userName = users.find((u) => u._id === userId)?.name || "this user"

    setConfirmModal({
      isOpen: true,
      title: "Delete User?",
      message: `Are you sure you want to permanently delete ${userName}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token")
          await axios.delete(`${API_URL}/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          setSuccessModal({
            isOpen: true,
            title: "User Deleted!",
            message: `${userName} has been removed from the system.`,
          })

          fetchUsers()
        } catch (error: any) {
          toast.error(error.response?.data?.error || "Failed to delete user")
        }
      },
    })
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <PageWrapper className="-mt-16 pt-16">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-xl">Loading users...</div>
          </div>
        </PageWrapper>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <PageWrapper className="-mt-16 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h1 className="text-4xl font-bold text-white mb-2">Manage Users</h1>
            <p className="text-white/70 text-lg">
              View and manage all registered users
            </p>
          </div>

          {/* Users List */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">
                All Users ({users.length})
              </h2>
            </div>

            {users.length === 0 ? (
              <p className="text-center text-white/60 py-8">
                No users registered yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left text-white/80 text-sm font-medium pb-3 px-2">
                        User
                      </th>
                      <th className="text-left text-white/80 text-sm font-medium pb-3 px-2">
                        Email
                      </th>
                      <th className="text-left text-white/80 text-sm font-medium pb-3 px-2">
                        Role
                      </th>
                      <th className="text-left text-white/80 text-sm font-medium pb-3 px-2">
                        Joined
                      </th>
                      <th className="text-right text-white/80 text-sm font-medium pb-3 px-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-white/10 hover:bg-white/5 transition"
                      >
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#C9A86A] flex items-center justify-center overflow-hidden">
                              {user.photoURL ? (
                                <img
                                  src={user.photoURL}
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-semibold">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span className="text-white font-medium">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-white/70">
                          {user.email}
                        </td>
                        <td className="py-4 px-2">
                          <button
                            onClick={() =>
                              handleRoleToggle(user._id, user.role)
                            }
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                              user.role === "admin"
                                ? "bg-[#C9A86A]/80 text-white hover:bg-[#C9A86A]"
                                : "bg-white/20 text-white/80 hover:bg-white/30"
                            }`}
                          >
                            {user.role.toUpperCase()}
                          </button>
                        </td>
                        <td className="py-4 px-2 text-white/60 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="px-4 py-2 bg-red-500/80 backdrop-blur-sm hover:bg-red-500 text-white font-medium rounded-xl text-sm transition shadow-lg hover:shadow-red-500/50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          type="warning"
        />

        {/* Success Modal */}
        <SuccessModal
          isOpen={successModal.isOpen}
          onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
          title={successModal.title}
          message={successModal.message}
          type="success"
        />
      </PageWrapper>
    </ProtectedLayout>
  )
}
