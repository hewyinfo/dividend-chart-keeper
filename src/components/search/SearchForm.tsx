
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  query: string;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: { query: string }) => void;
  isLoading: boolean;
}

const SearchForm = ({ query, onQueryChange, onSubmit, isLoading }: SearchFormProps) => {
  const { register, handleSubmit } = useForm<{ query: string }>({
    defaultValues: { query }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <Input
        placeholder="Enter ticker symbol..."
        {...register("query")}
        value={query}
        onChange={onQueryChange}
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default SearchForm;
