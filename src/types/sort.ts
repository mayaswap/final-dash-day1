export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  field: string | null;
  direction: SortDirection;
}