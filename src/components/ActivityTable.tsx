'use client';

import { Badge } from '@components/ui/badge';
import { DataTable } from '@components/ui/data-table';
import { formatDateTime } from '@lib/date';
import { templates } from '@lib/logTemplates';
import { LogType } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import Pagination from './Pagination';

type ActivityLog = {
	id: string;
	user: {
		name: string;
		email: string;
	};
	product: {
		name: string;
		id: string;
	};
	type: LogType;
	timestamp: Date;
};

export default function ActivityTable({
	locationId,
	productId,
}: {
	locationId: string;
	productId?: string;
}) {
	const { data, isLoading } = useQuery({
		queryKey: ['activity', locationId, productId],
		queryFn: async () => {
			const response = await fetch(
				`/api/locations/activity?location=${locationId}${
					productId ? `&product=${productId}` : ''
				}`
			);
			return response.json();
		},
	});
	const [page, setPage] = useState(1);
	const PER_PAGE = 20;

	const columns: ColumnDef<ActivityLog>[] = [
		{
			header: 'User',
			accessorFn: (row) => row.user?.name ?? 'Guest',
		},
		...(!productId
			? [
					{
						header: 'Product',
						accessorFn: (row: ActivityLog) => row.product.name,
					},
			  ]
			: []),
		{
			header: 'Type',
			accessorKey: 'type',
			cell: ({ row }: { row: { original: { type: LogType } } }) => {
				const Icon = templates[row.original.type].icon;
				return (
					<Badge variant='outline' className='py-1'>
						{<Icon className='icon-left' />}
						{templates[row.original.type].badge.text}
					</Badge>
				);
			},
		},
		{
			header: 'Timestamp',
			accessorKey: 'timestamp',
			cell: ({ row }: { row: { original: { timestamp: Date } } }) =>
				formatDateTime(new Date(row.original.timestamp)),
		},
	];

	return (
		<>
			<DataTable
				columns={columns}
				data={data ?? []}
				isLoading={isLoading}
				onRowClick={(row) => {
					console.log(row);
				}}
				classNames={{ cell: 'p-2' }}
			/>
			<Pagination
				total={45}
				page={page}
				onChange={setPage}
				perPage={PER_PAGE}
				className='justify-end mx-0 mt-8'
			/>
		</>
	);
}