import { SortOrder } from 'mongoose';
import { Sort } from '../dtos/query.dto';
import { UserSort } from 'src/user/dtos/user.query.dto';

export const getSortOption = (
  Desc: -1 | 1,
  sort?: Sort,
): Record<string, SortOrder> => {
  if (!sort) return {};
  switch (sort) {
    case Sort.Title:
      return { title: Desc };
    case Sort.CreatedAt:
      return { createdAt: Desc };
    case Sort.UpdatedAt:
      return { updatedAt: Desc };
  }
};

export const getUserSortOption = (
  Desc: -1 | 1,
  sort: UserSort,
): Record<string, SortOrder> => {
  switch (sort) {
    case UserSort.LastName:
      return { lastName: Desc };
    case UserSort.CreatedAt:
      return { createdAt: Desc };
    case UserSort.UpdatedAt:
      return { updatedAt: Desc };
  }
};
