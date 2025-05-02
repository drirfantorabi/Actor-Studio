import React from 'react';

interface RoleSelectionProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ selectedRole, onRoleChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <h2 className="text-xl font-medium mb-4 text-neutral-800">Choose Your Role</h2>
      
      <div className="relative">
        <label htmlFor="role-select" className="block text-sm font-medium text-neutral-700 mb-2">I am playing:</label>
        <div className="relative">
          <select 
            id="role-select" 
            className="appearance-none block w-full px-4 py-3 border border-neutral-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150"
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
          >
            <option value="Ali">Ali</option>
            <option value="Ayşe">Ayşe</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-sm text-neutral-600">You'll speak the lines for this character</p>
      </div>
    </div>
  );
};

export default RoleSelection;
