import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Ban, CheckCircle, Trash2, Shield } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import toast from 'react-hot-toast';
import { cn } from '@/utils/helpers';

const mockUsers = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i === 0 ? 'admin' : i % 3 === 0 ? 'recruiter' : 'candidate',
  status: i === 4 ? 'suspended' : 'active',
  joinDate: `2023-10-${(i % 28) + 1}`.padStart(2, '0')
}));

export default function ManageUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => {
    const matchesRole = filter === 'all' || u.role === filter;
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const toggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id && u.role !== 'admin') {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        toast.success(`User ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const deleteUser = (id) => {
    if(window.confirm('Delete this user completely?')) {
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted');
    }
  };

  return (
    <motion.div className="p-6 max-w-7xl mx-auto space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <h1 className="text-3xl serif font-bold text-text">Manage Users</h1>
        <p className="text-text-muted mt-1">Administrate platform accounts and access.</p>
      </div>

      <Card className="p-4 glass flex flex-col md:flex-row gap-4 justify-between items-center">
        <Input icon={<Search size={16}/>} placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="w-full md:max-w-md" />
        <div className="flex gap-2 bg-surface-alt p-1 rounded-lg border border-border">
          {['all', 'candidate', 'recruiter', 'admin'].map(r => (
            <button 
              key={r} onClick={() => setFilter(r)} 
              className={cn("px-3 py-1.5 text-sm rounded-md capitalize transition-colors", filter === r ? "bg-primary/20 text-primary" : "text-text-muted hover:text-text")}
            >
              {r}
            </button>
          ))}
        </div>
      </Card>

      <Card className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-alt/50 border-b border-border">
                <th className="p-4 text-sm font-medium text-text-secondary">User</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Role</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Status</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Join Date</th>
                <th className="p-4 text-sm font-medium text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-surface-alt/30 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <Avatar fallback={user.name} />
                    <div>
                      <div className="font-medium text-text">{user.name}</div>
                      <div className="text-xs text-text-muted">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={user.role === 'admin' ? 'primary' : user.role === 'recruiter' ? 'default' : 'default'} className="capitalize">
                      {user.role} {user.role === 'admin' && <Shield size={12} className="ml-1 inline" />}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={user.status === 'active' ? 'success' : 'danger'} className="capitalize">{user.status}</Badge>
                  </td>
                  <td className="p-4 text-sm text-text-secondary mono">{user.joinDate}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <Button 
                      variant="ghost" size="sm" 
                      icon={user.status === 'active' ? <Ban size={16}/> : <CheckCircle size={16}/>} 
                      onClick={() => toggleStatus(user.id)}
                      disabled={user.role === 'admin'}
                      className={user.status === 'active' ? 'hover:text-warning' : 'hover:text-success'}
                    />
                    <Button variant="ghost" size="sm" icon={<Trash2 size={16}/>} onClick={() => deleteUser(user.id)} disabled={user.role === 'admin'} className="hover:text-danger hover:bg-danger/10" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
