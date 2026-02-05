import { useQuery } from '@tanstack/react-query';
import { getQuote, getQuotes } from '../api';

export const QUOTES_KEY = ['quotes'];

export const useQuotes = () =>
  useQuery({
    queryKey: QUOTES_KEY,
    queryFn: getQuotes
  });

export const useQuote = (id: string) =>
  useQuery({
    queryKey: ['quote', id],
    queryFn: () => getQuote(id),
    enabled: !!id
  });

