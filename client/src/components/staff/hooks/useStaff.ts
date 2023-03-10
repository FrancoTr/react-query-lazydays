import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useQuery } from 'react-query';

import type { Staff } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { filterByTreatment } from '../utils';

interface UseStaff {
  staff: Staff[];
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}

export function useStaff(): UseStaff {
  // for filtering staff by treatment
  const [filter, setFilter] = useState('all');
  const selectFn = useCallback(
    (unfilteredStaff) => filterByTreatment(unfilteredStaff, filter),
    [filter],
  );

  const fallback = [];
  const { data: staff = fallback } = useQuery(queryKeys.staff, getStaff, {
    select: filter !== 'all' ? selectFn : undefined,
  });

  return { staff, filter, setFilter };
}
