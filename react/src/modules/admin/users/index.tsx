import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "../../../context/ToastContext";
import axios from "axios";
import {
  Search,
  User,
  Shield,
  Trash2,
  Mail,
  Loader2,
  CheckCircle2,
  XCircle,
  Pencil,
  Phone,
  MapPin,
  PlusCircle,
  Lock,
  Crown
} from "lucide-react";
import { API_BASE_URL } from "../../../constants/config";
import VModal from "../../../components/core/VModal";
import VButton from "../../../components/core/VButton";

interface UserData {
  id: number;
  fullname: string;
  email: string;
  phone: string | null;
  address: string | null;
  avatar: string | null;
  role: "admin" | "user";
  status: number;
  is_vip: number;
  created_at: string;
}

const AdminUsers = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "user">("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    fullname: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "user" as "admin" | "user",
  });
  const token = localStorage.getItem("auth_token");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/index.php`, {
        params: {
          module: 'api',
          action: 'admin/admin_users',
          token: token
        }
      });
      if (res.data.status === "success") {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching admin users:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async () => {
    if (!newUser.fullname || !newUser.email || !newUser.password) {
      showToast("Vui lòng điền đầy đủ thông tin", "error");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/index.php?module=api&action=admin/admin_users&token=${token}`,
        { ...newUser, action: "add", token },
      );
      if (response.data.status === "success") {
        showToast("Thêm thành viên thành công!", "success");
        setIsAddModalOpen(false);
        setNewUser({ fullname: "", email: "", password: "", phone: "", address: "", role: "user" });
        fetchUsers();
      } else {
        showToast("Lỗi: " + response.data.msg, "error");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    try {
      setUpdatingId(id);
      const response = await axios.post(
        `${API_BASE_URL}/index.php?module=api&action=admin/admin_users&token=${token}`,
        { id, action: "delete", token },
      );
      if (response.data.status === "success") {
        showToast("Xóa người dùng thành công!", "success");
        setUsers(users.filter((u) => u.id !== id));
      } else {
        showToast("Lỗi: " + response.data.msg, "error");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      setUpdatingId(editingUser.id);
      const response = await axios.post(
        `${API_BASE_URL}/index.php?module=api&action=admin/admin_users&token=${token}`,
        { ...editingUser, action: "update", token },
      );
      if (response.data.status === "success") {
        showToast("Cập nhật thông tin thành công!", "success");
        setUsers(
          users.map((u) => (u.id === editingUser.id ? editingUser : u)),
        );
        setIsEditModalOpen(false);
      } else {
        showToast("Lỗi: " + response.data.msg, "error");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateStatus = async (id: number, currentStatus: number) => {
    try {
      setUpdatingId(id);
      const newStatus = currentStatus === 1 ? 0 : 1;
      const response = await axios.post(
        `${API_BASE_URL}/index.php?module=api&action=admin/admin_users&token=${token}`,
        { id, action: "update", status: newStatus, token },
      );
      if (response.data.status === "success") {
        showToast("Cập nhật trạng thái thành công!", "success");
        setUsers(
          users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
        );
      } else {
        showToast("Lỗi: " + response.data.msg, "error");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateRole = async (id: number, currentRole: string) => {
    try {
      setUpdatingId(id);
      const newRole = currentRole === "admin" ? "user" : "admin";
      const response = await axios.post(
        `${API_BASE_URL}/index.php?module=api&action=admin/admin_users&token=${token}`,
        { id, action: "update", role: newRole, token },
      );
      if (response.data.status === "success") {
        showToast("Cập nhật quyền hạn thành công!", "success");
        setUsers(
          users.map((u) => (u.id === id ? { ...u, role: newRole as any } : u)),
        );
      } else {
        showToast("Lỗi: " + response.data.msg, "error");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Quản lý người dùng
          </h1>
          <p className="text-xs font-bold text-slate-400 tracking-widest">Danh sách thành viên và phân quyền hệ thống</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="text-right whitespace-nowrap">
              <p className="text-[10px] font-bold text-slate-400 tracking-tight">
                Tổng cộng
              </p>
              <p className="text-xl font-black text-slate-900">
                {users.length.toLocaleString()}
              </p>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <User size={20} />
            </div>
          </div>

          <VButton 
            variant="primary" 
            size="md" 
            icon={PlusCircle}
            onClick={() => setIsAddModalOpen(true)}
            className="shadow-lg shadow-blue-100"
          >
            Thêm thành viên
          </VButton>
        </div>
      </header>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-transparent rounded-lg pl-11 pr-4 py-2.5 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "admin", "user"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filterRole === role
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {role === "all"
                ? "Tất cả"
                : role === "admin"
                  ? "Admin"
                  : "User"}
            </button>
          ))}
          <button
            onClick={() => window.location.reload()}
            className="p-2.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-all"
          >
            <Loader2 size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold tracking-wider">
                <th className="px-6 py-4">Thành viên</th>
                <th className="px-6 py-4 text-center">Số điện thoại</th>
                <th className="px-6 py-4 text-center">Địa chỉ</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Đặc quyền</th>
                <th className="px-6 py-4 text-center">VIP</th>
                <th className="px-6 py-4 text-center">Ngày gia nhập</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          user.avatar
                            ? user.avatar.startsWith("http") || user.avatar.startsWith("data:")
                              ? user.avatar
                              : `${API_BASE_URL.replace("/BE", "")}/${user.avatar}`
                            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullname}`
                        }
                        alt={user.fullname}
                        className="w-10 h-10 rounded-full object-cover bg-slate-100 border border-slate-100"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {user.fullname}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Mail size={10} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.phone ? (
                      <p className="text-[10px] font-bold text-slate-600">
                        {user.phone}
                      </p>
                    ) : (
                      <span className="text-[10px] text-slate-300 italic">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.address ? (
                      <p className="text-[10px] font-bold text-slate-600 line-clamp-1 max-w-[150px] mx-auto">
                        {user.address}
                      </p>
                    ) : (
                      <span className="text-[10px] text-slate-300 italic">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleUpdateStatus(user.id, user.status)}
                      disabled={updatingId === user.id}
                      className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                        user.status === 1
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      } disabled:opacity-50`}
                    >
                      {user.status === 1 ? "Kích hoạt" : "Đã khóa"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleUpdateRole(user.id, user.role)}
                      disabled={updatingId === user.id}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                        user.role === "admin"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-blue-50 text-blue-600"
                      } disabled:opacity-50`}
                    >
                      {user.role === "admin" ? "Quản trị" : "Thành viên"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${user.is_vip === 1 ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-300'}`}>
                      <Crown size={16} fill={user.is_vip === 1 ? "currentColor" : "none"} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[10px] text-slate-500 font-medium">
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={updatingId === user.id}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {}
      <VModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa thành viên"
        type="info"
        message={
          <div className="space-y-4 text-left mt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text"
                  value={editingUser?.fullname || ''}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, fullname: e.target.value } : null)}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="email"
                  value={editingUser?.email || ''}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Số điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="text"
                    value={editingUser?.phone || ''}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    placeholder="Chưa cập nhật"
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-100 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Chức vụ</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <select 
                    value={editingUser?.role || 'user'}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, role: e.target.value as any } : null)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-100 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Địa chỉ</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text"
                  value={editingUser?.address || ''}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, address: e.target.value } : null)}
                  placeholder="Chưa cập nhật"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${editingUser?.is_vip === 1 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Crown size={18} fill={editingUser?.is_vip === 1 ? "currentColor" : "none"} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 tracking-tight">Thành viên VIP</p>
                  <p className="text-[10px] text-slate-500 font-medium">Kích hoạt các tính năng đặc biệt</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(prev => prev ? { ...prev, is_vip: prev.is_vip === 1 ? 0 : 1 } : null)}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${editingUser?.is_vip === 1 ? 'bg-amber-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${editingUser?.is_vip === 1 ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${editingUser?.status === 1 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {editingUser?.status === 1 ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 tracking-tight">Trạng thái tài khoản</p>
                  <p className="text-[10px] text-slate-500 font-medium">{editingUser?.status === 1 ? 'Tài khoản đang hoạt động' : 'Tài khoản đang bị khóa'}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(prev => prev ? { ...prev, status: prev.status === 1 ? 0 : 1 } : null)}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${editingUser?.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${editingUser?.status === 1 ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        }
        confirmText="Lưu thay đổi"
        onConfirm={handleUpdateUser}
        loading={updatingId === editingUser?.id}
      />

      {}
      <VModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm thành viên mới"
        type="info"
        message={
          <div className="space-y-4 text-left mt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text"
                  value={newUser.fullname}
                  onChange={(e) => setNewUser(prev => ({ ...prev, fullname: e.target.value }))}
                  placeholder="Nhập họ và tên..."
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="example@gmail.com"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Số điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="text"
                    value={newUser.phone}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Nhập số điện thoại..."
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-100 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Địa chỉ</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="text"
                    value={newUser.address}
                    onChange={(e) => setNewUser(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Nhập địa chỉ..."
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-100 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-100 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Chức vụ</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as any }))}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-100 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        }
        confirmText="Tạo tài khoản"
        onConfirm={handleAddUser}
        loading={loading}
      />
    </div>
  );
};

export default AdminUsers;
