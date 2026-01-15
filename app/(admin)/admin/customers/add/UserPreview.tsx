import { IUser } from '@/types/IUser';

export default function UserPreview({ user }: { user: IUser }) {
  return (
    <div className="p-4 border rounded bg-gray-50 space-y-2">
      <div>
        <strong>Імʼя:</strong> {user.name}
      </div>
      <div>
        <strong>Прізвище:</strong> {user.surname}
      </div>
      <div>
        <strong>Email:</strong> {user.email}
      </div>
      <div>
        <strong>Телефон:</strong> {user.phone}
      </div>
    </div>
  );
}
