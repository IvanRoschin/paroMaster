import { getEntityCounts } from '@/app/services/adminService';

export async function getEntityCountsAction(token: string) {
  return getEntityCounts();
}
