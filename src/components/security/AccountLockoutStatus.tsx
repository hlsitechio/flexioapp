import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Unlock, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface AccountLockout {
  id: string;
  user_id: string;
  failed_attempts: number;
  locked_until: string | null;
  ip_address: unknown;
  created_at: string;
  updated_at: string;
}

export function AccountLockoutStatus() {
  const [lockouts, setLockouts] = useState<AccountLockout[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlockingAccounts, setUnlockingAccounts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchLockouts();
  }, []);

  const fetchLockouts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('account_lockouts')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLockouts(data || []);
    } catch (error) {
      console.error('Error fetching lockouts:', error);
      toast.error('Failed to fetch account lockouts');
    } finally {
      setLoading(false);
    }
  };

  const unlockAccount = async (userId: string) => {
    try {
      setUnlockingAccounts(prev => new Set(prev).add(userId));
      
      const { error } = await supabase
        .from('account_lockouts')
        .update({
          failed_attempts: 0,
          locked_until: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      
      // Log admin action
      await supabase.rpc('log_admin_action', {
        _action: 'unlock_account',
        _target_resource: 'user_account',
        _target_id: userId,
        _metadata: { manual_unlock: true }
      });
      
      toast.success('Account unlocked successfully');
      fetchLockouts();
    } catch (error) {
      console.error('Error unlocking account:', error);
      toast.error('Failed to unlock account');
    } finally {
      setUnlockingAccounts(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const isCurrentlyLocked = (lockout: AccountLockout) => {
    if (!lockout.locked_until) return false;
    return new Date(lockout.locked_until) > new Date();
  };

  const getTimeUntilUnlock = (lockedUntil: string) => {
    const unlockTime = new Date(lockedUntil);
    const now = new Date();
    const diff = unlockTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.ceil(diff / (1000 * 60));
    return `${minutes} min`;
  };

  const activeLockouts = lockouts.filter(isCurrentlyLocked);
  const inactiveLockouts = lockouts.filter(lockout => !isCurrentlyLocked(lockout));

  return (
    <div className="space-y-6">
      {/* Active Lockouts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Active Account Lockouts</CardTitle>
              {activeLockouts.length > 0 && (
                <Badge variant="destructive">{activeLockouts.length}</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeLockouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 text-success" />
              <p>No accounts currently locked</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Failed Attempts</TableHead>
                    <TableHead>Time Until Unlock</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeLockouts.map((lockout) => (
                    <TableRow key={lockout.id}>
                      <TableCell className="font-mono text-sm">
                        {lockout.user_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          {lockout.failed_attempts} attempts
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {lockout.locked_until && getTimeUntilUnlock(lockout.locked_until)}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {String(lockout.ip_address) || '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unlockAccount(lockout.user_id)}
                          disabled={unlockingAccounts.has(lockout.user_id)}
                        >
                          <Unlock className="h-4 w-4 mr-2" />
                          Unlock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Recent Lockout History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Recent Lockout History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {inactiveLockouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent lockout history
            </div>
          ) : (
            <ScrollArea className="h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Failed Attempts</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inactiveLockouts.map((lockout) => (
                    <TableRow key={lockout.id} className="opacity-60">
                      <TableCell className="font-mono text-sm">
                        {lockout.user_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {lockout.failed_attempts} attempts
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(lockout.updated_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {String(lockout.ip_address) || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {lockout.failed_attempts === 0 ? 'Reset' : 'Expired'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}