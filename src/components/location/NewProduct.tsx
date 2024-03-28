'use client';

import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import { parseFormData } from '@lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import ProductForm from './ProductForm';

export default function NewItemSheet({ location }: { location: string }) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const { isPending, mutate } = useMutation({
		mutationFn: (e: FormEvent<HTMLFormElement>) => {
			const data = parseFormData(e);
			return fetch(`/api/products?location=${location}`, {
				method: 'POST',
				body: data,
			});
		},
		onSettled: async (res) => {
			if (res?.ok) {
				queryClient.invalidateQueries({ queryKey: ['products'] });
				setOpen(false);
			} else toast.error('Failed to add product: ' + (await res?.text()));
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className='w-4 h-4 mr-2' />
					New Product
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={mutate}>
					<DialogHeader>
						<DialogTitle>Add New Product</DialogTitle>
						<DialogDescription>
							Add a new inventory product. All information entered can be
							changed later.
						</DialogDescription>
					</DialogHeader>
					<ProductForm />
					<DialogFooter>
						<Button
							className='ml-auto'
							type='submit'
							icon={Plus}
							isLoading={isPending}
						>
							Add
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
