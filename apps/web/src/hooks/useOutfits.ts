"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import type { OutfitWithItems, PaginatedResponse, CreateOutfitDto, UpdateOutfitDto } from "@fashion/shared";

export function useOutfits(page = 1) {
  return useQuery({
    queryKey: ["outfits", page],
    queryFn: () => apiGet<PaginatedResponse<OutfitWithItems>>(`/outfits?page=${page}&limit=20`),
  });
}

export function useOutfit(id: string) {
  return useQuery({
    queryKey: ["outfits", id],
    queryFn: () => apiGet<{ data: OutfitWithItems }>(`/outfits/${id}`),
    enabled: !!id,
  });
}

export function useCreateOutfit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateOutfitDto) => apiPost<{ data: OutfitWithItems }>("/outfits", dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["outfits"] }),
  });
}

export function useUpdateOutfit(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateOutfitDto) => apiPatch<{ data: OutfitWithItems }>(`/outfits/${id}`, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["outfits", id] }),
  });
}

export function useDeleteOutfit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/outfits/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["outfits"] }),
  });
}
