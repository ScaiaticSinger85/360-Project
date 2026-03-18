import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Search, Shield, User as UserIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const loadUsers = () => {
    const usersData = localStorage.getItem('users');
    if (usersData) {
      setUsers(JSON.parse(usersData));
    }
  };

  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, role: newRole } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Update current user if they changed their own role
    const currentUserData = localStorage.getItem('currentUser');
    if (currentUserData) {
      const current = JSON.parse(currentUserData);
      if (current.id === userId) {
        const updated = { ...current, role: newRole };
        localStorage.setItem('currentUser', JSON.stringify(updated));
      }
    }

    toast.success('User role updated');
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Access denied. Admin only.</p>
            <Link to="/">
              <Button className="w-full">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleBadgeColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'registered':
        return 'default';
      case 'unregistered':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl">User Management</CardTitle>
                <p className="text-gray-600 mt-2">
                  Manage user accounts and permissions
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Users Table */}
            {filteredUsers.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(value) =>
                              handleRoleChange(user.id, value as User['role'])
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unregistered">
                                Unregistered
                              </SelectItem>
                              <SelectItem value="registered">
                                Registered
                              </SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Admin Users</p>
                  <p className="text-3xl font-bold">
                    {users.filter((u) => u.role === 'admin').length}
                  </p>
                </div>
                <Shield className="h-10 w-10 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Registered Users</p>
                  <p className="text-3xl font-bold">
                    {users.filter((u) => u.role === 'registered').length}
                  </p>
                </div>
                <UserIcon className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unregistered Users</p>
                  <p className="text-3xl font-bold">
                    {users.filter((u) => u.role === 'unregistered').length}
                  </p>
                </div>
                <UserIcon className="h-10 w-10 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
