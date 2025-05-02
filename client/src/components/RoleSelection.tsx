import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RoleSelectionProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  availableRoles?: string[];
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ 
  selectedRole, 
  onRoleChange,
  availableRoles = ['Ali', 'Ayşe'] // Default roles if none are provided
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Choose Your Role</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <label htmlFor="role-select" className="text-sm font-medium">
            I am playing:
          </label>
          
          <Select 
            value={selectedRole} 
            onValueChange={onRoleChange}
          >
            <SelectTrigger id="role-select" className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <p className="text-sm text-muted-foreground mt-2">
            You'll speak the lines for this character
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleSelection;
