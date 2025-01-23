import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, Ban, User } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsers() {
  const { users, fetchAllUsers, suspendUser, activateUser: _activateUser } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  void _activateUser; void isLoading;

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuspend = async (userId: string) => {
    setIsLoading(true);
    const success = await suspendUser(userId);
    if (success) {
      toast.success('User suspended');
    }
    setIsLoading(false);
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Users</h1>
          <p className="text-[#666666]">Manage platform users</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f9f9f9]">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-[#666666]">User</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666666]">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666666]">Joined</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666666]">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-[#666666]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=f27a2a&color=fff`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-[#1a1a1a]">{user.name}</p>
                          <p className="text-sm text-[#666666]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4 text-[#666666]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <User className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSuspend(user.id)}>
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
